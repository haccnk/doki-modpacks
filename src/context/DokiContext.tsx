import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  Modpack, 
  PermissionRequest, 
  PlatformConfig, 
  AuthService, 
  ModpackService, 
  PermissionService, 
  PlatformConfigService, 
  DownloadService, 
  CreateModpackDTO, 
  UpdateModpackDTO, 
  db 
} from '../backend/index';
import { useToast } from './ToastContext';
import { sound } from '../utils/sound';

interface DokiContextType {
  currentUser: User | null;
  sessionToken: string | null;
  isAdmin: boolean;
  isGuest: boolean;
  modpacks: Modpack[];
  featuredModpack: Modpack | null;
  platformConfig: PlatformConfig | null;
  pendingRequests: PermissionRequest[];
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  loginAsDoki: () => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  loginAsGuest: (customHandle?: string) => Promise<boolean>;
  logout: () => void;
  refreshData: () => Promise<void>;
  createModpack: (dto: CreateModpackDTO) => Promise<boolean>;
  updateModpack: (id: string, dto: UpdateModpackDTO) => Promise<boolean>;
  deleteModpack: (id: string) => Promise<boolean>;
  toggleEmergencyQuarantine: (id: string, currentStatus: boolean) => Promise<boolean>;
  submitPermissionRequest: (modpackId: string, reason: string) => Promise<boolean>;
  moderateRequest: (requestId: string, status: 'APPROVED' | 'REJECTED') => Promise<boolean>;
  updatePlatformConfig: (dto: Partial<PlatformConfig>) => Promise<boolean>;
  resolveDownload: (modpackId: string) => Promise<{ downloadMirror: string; bypass: boolean } | null>;
  isEditingModpack: boolean;
  setIsEditingModpack: (editing: boolean) => void;
}

const DokiContext = createContext<DokiContextType | undefined>(undefined);

export const DokiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [modpacks, setModpacks] = useState<Modpack[]>([]);
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig | null>(null);
  const [pendingRequests, setPendingRequests] = useState<PermissionRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditingModpack, setIsEditingModpack] = useState<boolean>(false);
  const { showToast } = useToast();

  const refreshData = async () => {
    try {
      await db.init();
      const token = localStorage.getItem('doki_session_token');
      const catalog = await ModpackService.getCatalog(token);
      setModpacks(catalog);

      const config = await PlatformConfigService.getConfig();
      setPlatformConfig(config);

      if (token) {
        try {
          const user = await AuthService.getCurrentUser(token);
          setCurrentUser(user);
          setSessionToken(token);

          if (user.role === 'ADMIN') {
            const requests = await PermissionService.listRequests(token);
            setPendingRequests(requests);
          }
        } catch {
          // invalid token
          localStorage.removeItem('doki_session_token');
          setCurrentUser(null);
          setSessionToken(null);
        }
      }
    } catch (err) {
      console.error('Error refreshing Doki store:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const session = await AuthService.login(username, password);
      setSessionToken(session.token);
      localStorage.setItem('doki_session_token', session.token);
      const fullUser = await AuthService.getCurrentUser(session.token);
      setCurrentUser(fullUser);

      sound.playSuccess();
      showToast(`Welcome back, ${fullUser.username}! (${fullUser.role})`, 'success');

      if (fullUser.role === 'ADMIN') {
        const reqs = await PermissionService.listRequests(session.token);
        setPendingRequests(reqs);
      }

      await refreshData();
      return true;
    } catch (err: any) {
      sound.playFault();
      showToast(err.message || 'Login failed', 'error');
      return false;
    }
  };

  const loginAsDoki = async (): Promise<boolean> => {
    return login('doki', 'doki123');
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const session = await AuthService.register(username, email, password);
      setSessionToken(session.token);
      localStorage.setItem('doki_session_token', session.token);
      const fullUser = await AuthService.getCurrentUser(session.token);
      setCurrentUser(fullUser);

      sound.playSuccess();
      showToast(`Welcome, ${fullUser.username}! Your player account is registered.`, 'success');
      await refreshData();
      return true;
    } catch (err: any) {
      sound.playFault();
      showToast(err.message || 'Registration failed', 'error');
      return false;
    }
  };

  const loginAsGuest = async (customHandle?: string): Promise<boolean> => {
    try {
      const session = await AuthService.loginAsGuest(customHandle);
      setSessionToken(session.token);
      localStorage.setItem('doki_session_token', session.token);
      const fullUser = await AuthService.getCurrentUser(session.token);
      setCurrentUser(fullUser);

      sound.playSuccess();
      showToast(`Browsing as ${fullUser.username} (Guest Installer Mode)`, 'info');
      await refreshData();
      return true;
    } catch (err: any) {
      sound.playFault();
      showToast(err.message || 'Guest session initialization failed', 'error');
      return false;
    }
  };

  const logout = () => {
    if (sessionToken) {
      AuthService.logout(sessionToken);
    }
    localStorage.removeItem('doki_session_token');
    setCurrentUser(null);
    setSessionToken(null);
    setPendingRequests([]);
    sound.playClick();
    showToast('Signed out successfully.', 'info');
    refreshData();
  };

  const createModpack = async (dto: CreateModpackDTO): Promise<boolean> => {
    if (!sessionToken) return false;
    try {
      await ModpackService.createModpack(sessionToken, dto);
      sound.playSuccess();
      showToast(`Created modpack: ${dto.title}`, 'success');
      await refreshData();
      return true;
    } catch (err: any) {
      sound.playFault();
      showToast(err.message || 'Failed to create modpack', 'error');
      return false;
    }
  };

  const updateModpack = async (id: string, dto: UpdateModpackDTO): Promise<boolean> => {
    if (!sessionToken) return false;
    try {
      await ModpackService.updateModpack(sessionToken, id, dto);
      sound.playSuccess();
      showToast(`Updated modpack specs & lifecycle`, 'success');
      await refreshData();
      return true;
    } catch (err: any) {
      sound.playFault();
      showToast(err.message || 'Failed to update modpack', 'error');
      return false;
    }
  };

  const deleteModpack = async (id: string): Promise<boolean> => {
    if (!sessionToken) return false;
    try {
      await ModpackService.deleteModpack(sessionToken, id);
      sound.playSuccess();
      showToast('Modpack deleted', 'info');
      await refreshData();
      return true;
    } catch (err: any) {
      sound.playFault();
      showToast(err.message || 'Failed to delete modpack', 'error');
      return false;
    }
  };

  const toggleEmergencyQuarantine = async (id: string, currentStatus: boolean): Promise<boolean> => {
    if (!sessionToken) return false;
    try {
      const nextStatus = !currentStatus;
      await ModpackService.setEmergencyQuarantine(sessionToken, id, nextStatus);
      if (nextStatus) {
        sound.playFault();
        showToast('⚠️ Emergency Quarantine ACTIVATED: Public downloads halted', 'error');
      } else {
        sound.playSuccess();
        showToast('Emergency Quarantine lifted: Downloads restored', 'success');
      }
      await refreshData();
      return true;
    } catch (err: any) {
      sound.playFault();
      showToast(err.message || 'Failed to toggle quarantine', 'error');
      return false;
    }
  };

  const submitPermissionRequest = async (modpackId: string, reason: string): Promise<boolean> => {
    if (!sessionToken) {
      showToast('Please sign in to request access', 'error');
      return false;
    }
    try {
      await PermissionService.submitRequest(sessionToken, { modpackId, reason });
      sound.playSuccess();
      showToast('Permission request submitted to Doki for review!', 'success');
      await refreshData();
      return true;
    } catch (err: any) {
      sound.playFault();
      showToast(err.message || 'Request submission failed', 'error');
      return false;
    }
  };

  const moderateRequest = async (requestId: string, status: 'APPROVED' | 'REJECTED'): Promise<boolean> => {
    if (!sessionToken) return false;
    try {
      await PermissionService.moderateRequest(sessionToken, { requestId, status });
      sound.playSuccess();
      showToast(`Request ${status.toLowerCase()} successfully`, 'info');
      await refreshData();
      return true;
    } catch (err: any) {
      sound.playFault();
      showToast(err.message || 'Moderation failed', 'error');
      return false;
    }
  };

  const updatePlatformConfig = async (dto: Partial<PlatformConfig>): Promise<boolean> => {
    if (!sessionToken) return false;
    try {
      await PlatformConfigService.updateConfig(sessionToken, dto);
      sound.playSuccess();
      showToast('Platform settings & About copy updated', 'success');
      await refreshData();
      return true;
    } catch (err: any) {
      sound.playFault();
      showToast(err.message || 'Config update failed', 'error');
      return false;
    }
  };

  const resolveDownload = async (modpackId: string): Promise<{ downloadMirror: string; bypass: boolean } | null> => {
    try {
      const res = await DownloadService.resolveDownload(modpackId, sessionToken);
      sound.playSuccess();
      return { downloadMirror: res.downloadMirror, bypass: res.bypass };
    } catch (err: any) {
      sound.playFault();
      showToast(err.message || 'Download blocked by policy', 'error');
      return null;
    }
  };

  const featuredModpack = modpacks.find(m => m.id === platformConfig?.featuredModpackId) || modpacks[0] || null;

  return (
    <DokiContext.Provider
      value={{
        currentUser,
        sessionToken,
        isAdmin: currentUser?.role === 'ADMIN',
        isGuest: currentUser?.role === 'GUEST',
        modpacks,
        featuredModpack,
        platformConfig,
        pendingRequests,
        isLoading,
        login,
        loginAsDoki,
        register,
        loginAsGuest,
        logout,
        refreshData,
        createModpack,
        updateModpack,
        deleteModpack,
        toggleEmergencyQuarantine,
        submitPermissionRequest,
        moderateRequest,
        updatePlatformConfig,
        resolveDownload,
        isEditingModpack,
        setIsEditingModpack,
      }}
    >
      {children}
    </DokiContext.Provider>
  );
};

export const useDoki = () => {
  const context = useContext(DokiContext);
  if (!context) {
    throw new Error('useDoki must be used within a DokiProvider');
  }
  return context;
};

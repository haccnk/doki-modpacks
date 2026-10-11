// Persistent In-Memory Database with Browser & Node Storage Adapters
import { User, Modpack, PermissionRequest, PlatformConfig, AuthSession } from './types';
import { getSeedData } from './seed';

const STORAGE_KEY_PREFIX = 'doki_modpacks_db_';

interface DatabaseState {
  users: Map<string, User>;
  modpacks: Map<string, Modpack>;
  permissionRequests: Map<string, PermissionRequest>;
  platformConfig: PlatformConfig | null;
  sessions: Map<string, AuthSession>;
  initialized: boolean;
}

class DatabaseStore {
  private state: DatabaseState = {
    users: new Map(),
    modpacks: new Map(),
    permissionRequests: new Map(),
    platformConfig: null,
    sessions: new Map(),
    initialized: false,
  };
  private initPromise: Promise<void> | null = null;

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private saveToStorage(table: string, data: any) {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${table}`, JSON.stringify(data));
    } catch (err) {
      console.warn(`[DatabaseStore] Storage write warning for '${table}':`, err);
    }
  }

  private loadFromStorage<T>(table: string): T | null {
    if (!this.isBrowser()) return null;
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${table}`);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.warn(`[DatabaseStore] Storage parse warning for '${table}':`, err);
      return null;
    }
  }

  public async init(): Promise<void> {
    if (this.state.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        // Load data from persistent browser storage
        const storedUsers = this.loadFromStorage<User[]>('users');
        const storedModpacks = this.loadFromStorage<Modpack[]>('modpacks');
        const storedRequests = this.loadFromStorage<PermissionRequest[]>('permission_requests');
        const storedConfig = this.loadFromStorage<PlatformConfig>('platform_config');
        const storedSessions = this.loadFromStorage<AuthSession[]>('sessions');

        if (storedUsers && storedUsers.length > 0) {
          storedUsers.forEach(u => this.state.users.set(u.id, u));
          // Guarantee superAdmin 'doki' account is present in database
          const hasAdmin = Array.from(this.state.users.values()).some(u => u.username.toLowerCase() === 'doki');
          if (!hasAdmin) {
            const seed = await getSeedData();
            const doki = seed.users.find(u => u.username.toLowerCase() === 'doki');
            if (doki) {
              this.state.users.set(doki.id, doki);
              this.saveToStorage('users', Array.from(this.state.users.values()));
            }
          }
        } else {
          const seed = await getSeedData();
          seed.users.forEach(u => this.state.users.set(u.id, u));
          this.saveToStorage('users', seed.users);
        }

        if (storedModpacks && storedModpacks.length > 0) {
          storedModpacks.forEach(m => this.state.modpacks.set(m.id, m));
        } else {
          const seed = await getSeedData();
          seed.modpacks.forEach(m => this.state.modpacks.set(m.id, m));
          this.saveToStorage('modpacks', seed.modpacks);
        }

        if (storedConfig) {
          this.state.platformConfig = storedConfig;
        } else {
          const seed = await getSeedData();
          this.state.platformConfig = seed.platformConfig;
          this.saveToStorage('platform_config', seed.platformConfig);
        }

        if (storedRequests && Array.isArray(storedRequests)) {
          storedRequests.forEach(r => this.state.permissionRequests.set(r.id, r));
        }

        if (storedSessions && Array.isArray(storedSessions)) {
          storedSessions.forEach(s => {
            if (Date.now() <= s.expiresAt) {
              this.state.sessions.set(s.token, s);
            }
          });
        }
      } catch (err) {
        console.error('[DatabaseStore] Initialization fallback triggered:', err);
        try {
          const seed = await getSeedData();
          seed.users.forEach(u => this.state.users.set(u.id, u));
          seed.modpacks.forEach(m => this.state.modpacks.set(m.id, m));
          this.state.platformConfig = seed.platformConfig;
        } catch (seedErr) {
          console.error('[DatabaseStore] Critical seed fallback failed:', seedErr);
        }
      } finally {
        this.state.initialized = true;
      }
    })();

    return this.initPromise;
  }

  // --- USER TABLE ---
  public findUserById(id: string): User | null {
    return this.state.users.get(id) || null;
  }

  public findUserByUsername(username: string): User | null {
    for (const user of this.state.users.values()) {
      if (user.username.toLowerCase() === username.toLowerCase()) {
        return user;
      }
    }
    return null;
  }

  public createUser(user: User): User {
    this.state.users.set(user.id, user);
    this.saveToStorage('users', Array.from(this.state.users.values()));
    return user;
  }

  // --- SESSION STORE ---
  private saveSessions(): void {
    const activeSessions = Array.from(this.state.sessions.values()).filter(s => Date.now() <= s.expiresAt);
    this.saveToStorage('sessions', activeSessions);
  }

  public createSession(session: AuthSession): void {
    this.state.sessions.set(session.token, session);
    this.saveSessions();
  }

  public getSession(token: string): AuthSession | null {
    const session = this.state.sessions.get(token);
    if (!session) return null;
    if (Date.now() > session.expiresAt) {
      this.state.sessions.delete(token);
      this.saveSessions();
      return null;
    }
    return session;
  }

  public deleteSession(token: string): void {
    this.state.sessions.delete(token);
    this.saveSessions();
  }

  // --- MODPACK TABLE ---
  public getAllModpacks(): Modpack[] {
    return Array.from(this.state.modpacks.values());
  }

  public findModpackById(id: string): Modpack | null {
    return this.state.modpacks.get(id) || null;
  }

  public findModpackBySlug(slug: string): Modpack | null {
    for (const pack of this.state.modpacks.values()) {
      if (pack.slug.toLowerCase() === slug.toLowerCase()) {
        return pack;
      }
    }
    return null;
  }

  public saveModpack(modpack: Modpack): Modpack {
    this.state.modpacks.set(modpack.id, modpack);
    this.saveToStorage('modpacks', Array.from(this.state.modpacks.values()));
    return modpack;
  }

  public deleteModpack(id: string): boolean {
    const existed = this.state.modpacks.delete(id);
    if (existed) {
      this.saveToStorage('modpacks', Array.from(this.state.modpacks.values()));
    }
    return existed;
  }

  // --- PERMISSION REQUESTS TABLE ---
  public getPermissionRequests(): PermissionRequest[] {
    return Array.from(this.state.permissionRequests.values());
  }

  public findPermissionRequest(modpackId: string, userId: string): PermissionRequest | null {
    for (const req of this.state.permissionRequests.values()) {
      if (req.modpackId === modpackId && req.userId === userId) {
        return req;
      }
    }
    return null;
  }

  public findPermissionRequestById(id: string): PermissionRequest | null {
    return this.state.permissionRequests.get(id) || null;
  }

  public savePermissionRequest(req: PermissionRequest): PermissionRequest {
    this.state.permissionRequests.set(req.id, req);
    this.saveToStorage('permission_requests', Array.from(this.state.permissionRequests.values()));
    return req;
  }

  // --- PLATFORM CONFIG TABLE ---
  public getPlatformConfig(): PlatformConfig {
    if (!this.state.platformConfig) {
      return {
        id: "cfg_default",
        siteTitle: "Doki's Modpacks Hub",
        heroHeadline: "Minecraft 2: Biohazard",
        heroSubtitle: "The Overworld Has Fallen. Survival Re-engineered.",
        heroTagline: "Flagship Post-End Exploration Modpack",
        announcementText: "Flagship Release: Minecraft 2: Biohazard is Live",
        announcementUrl: "/modpack/minecraft-2-biohazard",
        catalogMode: "FEATURED_HERO",
        aboutDokiCopy: "Doki's Modpacks is the dedicated home for high-quality, custom-crafted Minecraft adventures.",
        footerCopy: "A member of PackOps",
        emergencySystemLock: false,
        featuredModpackId: "",
        marqueeEnabled: true,
        marqueeLabel: "PackOps Live Telemetry",
        marqueePingText: "Cluster Ping: 12ms",
        marqueeItems: [],
        updatedAt: new Date().toISOString(),
        updatedBy: "system"
      };
    }
    return this.state.platformConfig;
  }

  public savePlatformConfig(config: PlatformConfig): PlatformConfig {
    this.state.platformConfig = config;
    this.saveToStorage('platform_config', config);
    return config;
  }
}

// Global Singleton Binding across Serverless, Edge & Browser Contexts
const globalForDb = (typeof globalThis !== 'undefined'
  ? globalThis
  : typeof window !== 'undefined'
    ? window
    : {}) as unknown as {
  __dokiDatabaseStoreInstance?: DatabaseStore;
};

export const db = globalForDb.__dokiDatabaseStoreInstance ?? new DatabaseStore();
globalForDb.__dokiDatabaseStoreInstance = db;


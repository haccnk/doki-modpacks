import { User, Modpack, PermissionRequest, PlatformConfig, AuthSession } from './types';
import { getSeedData } from './seed';
import { getSupabaseConfig, fetchCloudItem, saveCloudItem, syncAllLocalToCloud } from './supabase';

const STORAGE_KEY_PREFIX = 'doki_modpacks_db_';
const DB_NAME = 'DokiModpackHub_v2';
const DB_VERSION = 1;

// IndexedDB Helper for high-capacity, durable browser storage
function openIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not available in current environment'));
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('users')) db.createObjectStore('users', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('modpacks')) db.createObjectStore('modpacks', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('permission_requests')) db.createObjectStore('permission_requests', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('platform_config')) db.createObjectStore('platform_config', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('sessions')) db.createObjectStore('sessions', { keyPath: 'token' });
      if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'key' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function idbGetAll<T>(storeName: string): Promise<T[]> {
  return openIDB().then(db => {
    return new Promise<T[]>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result || []) as T[]);
      req.onerror = () => reject(req.error);
    });
  }).catch(() => [] as T[]);
}

function idbPut(storeName: string, item: any): Promise<void> {
  return openIDB().then(db => {
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }).catch((err) => {
    console.warn(`[DatabaseStore IDB] Write warning in ${storeName}:`, err);
  });
}

function idbDelete(storeName: string, key: any): Promise<void> {
  return openIDB().then(db => {
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }).catch((err) => {
    console.warn(`[DatabaseStore IDB] Delete warning in ${storeName}:`, err);
  });
}

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
    return typeof window !== 'undefined';
  }

  private saveToLocalStorage(table: string, data: any) {
    if (!this.isBrowser() || typeof window.localStorage === 'undefined') return;
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${table}`, JSON.stringify(data));
    } catch {
      // LocalStorage quota may be exceeded when storing screenshots/images;
      // IndexedDB handles durable persistence safely.
    }
  }

  private loadFromLocalStorage<T>(table: string): T | null {
    if (!this.isBrowser() || typeof window.localStorage === 'undefined') return null;
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${table}`);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.warn(`[DatabaseStore] LocalStorage parse warning for '${table}':`, err);
      return null;
    }
  }

  public async init(): Promise<void> {
    if (this.state.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        let idbSupported = false;
        let idbUsers: User[] = [];
        let idbModpacks: Modpack[] = [];
        let idbRequests: PermissionRequest[] = [];
        let idbConfigs: PlatformConfig[] = [];
        let idbSessions: AuthSession[] = [];
        let isSeededMeta = false;

        try {
          if (this.isBrowser() && window.indexedDB) {
            idbSupported = true;
            const meta = await idbGetAll<{ key: string; value: boolean }>('meta');
            isSeededMeta = meta.some(m => m.key === 'seeded' && m.value === true);
            idbUsers = await idbGetAll<User>('users');
            idbModpacks = await idbGetAll<Modpack>('modpacks');
            idbRequests = await idbGetAll<PermissionRequest>('permission_requests');
            idbConfigs = await idbGetAll<PlatformConfig>('platform_config');
            idbSessions = await idbGetAll<AuthSession>('sessions');
          }
        } catch (e) {
          console.warn('[DatabaseStore] IndexedDB check failed, falling back to localStorage:', e);
          idbSupported = false;
        }

        const localUsers = this.loadFromLocalStorage<User[]>('users');
        const localModpacks = this.loadFromLocalStorage<Modpack[]>('modpacks');
        const localRequests = this.loadFromLocalStorage<PermissionRequest[]>('permission_requests');
        const localConfig = this.loadFromLocalStorage<PlatformConfig>('platform_config');
        const localSessions = this.loadFromLocalStorage<AuthSession[]>('sessions');
        const localSeeded = typeof window !== 'undefined' && localStorage.getItem('doki_db_seeded') === 'true';

        const hasExistingData =
          isSeededMeta ||
          localSeeded ||
          idbModpacks.length > 0 ||
          (localModpacks && localModpacks.length > 0) ||
          idbUsers.length > 0 ||
          (localUsers && localUsers.length > 0) ||
          idbConfigs.length > 0 ||
          localConfig !== null;

        if (hasExistingData) {
          // 1. Populate Users
          const usersToLoad = idbUsers.length > 0 ? idbUsers : (localUsers || []);
          usersToLoad.forEach(u => this.state.users.set(u.id, u));

          // Guarantee superAdmin 'doki' account is present
          const hasAdmin = Array.from(this.state.users.values()).some(u => u.username.toLowerCase() === 'doki');
          if (!hasAdmin) {
            const seed = await getSeedData();
            const doki = seed.users.find(u => u.username.toLowerCase() === 'doki');
            if (doki) {
              this.state.users.set(doki.id, doki);
              if (idbSupported) idbPut('users', doki);
              this.saveToLocalStorage('users', Array.from(this.state.users.values()));
            }
          }

          // 2. Populate Modpacks
          const modpacksToLoad = idbModpacks.length > 0 ? idbModpacks : (localModpacks || []);
          modpacksToLoad.forEach(m => this.state.modpacks.set(m.id, m));

          // 3. Populate Platform Config
          if (idbConfigs.length > 0 && idbConfigs[0]) {
            this.state.platformConfig = idbConfigs[0];
          } else if (localConfig) {
            this.state.platformConfig = localConfig;
            if (idbSupported) idbPut('platform_config', localConfig);
          } else {
            const seed = await getSeedData();
            this.state.platformConfig = seed.platformConfig;
            if (idbSupported) idbPut('platform_config', seed.platformConfig);
            this.saveToLocalStorage('platform_config', seed.platformConfig);
          }

          // 4. Populate Requests
          const reqsToLoad = idbRequests.length > 0 ? idbRequests : (localRequests || []);
          reqsToLoad.forEach(r => this.state.permissionRequests.set(r.id, r));

          // 5. Populate Sessions
          const sessionsToLoad = idbSessions.length > 0 ? idbSessions : (localSessions || []);
          sessionsToLoad.forEach(s => {
            if (Date.now() <= s.expiresAt) {
              this.state.sessions.set(s.token, s);
            }
          });

          // Sync any missing items from localStorage into IndexedDB for durability
          if (idbSupported && idbModpacks.length === 0 && localModpacks && localModpacks.length > 0) {
            for (const pack of localModpacks) {
              await idbPut('modpacks', pack);
            }
          }
        } else {
          // Brand New First Load -> Seed baseline data
          const seed = await getSeedData();
          seed.users.forEach(u => {
            this.state.users.set(u.id, u);
            if (idbSupported) idbPut('users', u);
          });
          this.saveToLocalStorage('users', seed.users);

          seed.modpacks.forEach(m => {
            this.state.modpacks.set(m.id, m);
            if (idbSupported) idbPut('modpacks', m);
          });
          this.saveToLocalStorage('modpacks', seed.modpacks);

          this.state.platformConfig = seed.platformConfig;
          if (idbSupported) idbPut('platform_config', seed.platformConfig);
          this.saveToLocalStorage('platform_config', seed.platformConfig);

          // Mark seeded flag so we never re-seed over deletions or modifications
          if (idbSupported) {
            await idbPut('meta', { key: 'seeded', value: true });
          }
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('doki_db_seeded', 'true');
          }
        }

        // Check if Supabase cloud is configured for global synchronization
        const supabaseConfig = getSupabaseConfig();
        if (supabaseConfig) {
          try {
            const [cloudModpacks, cloudConfig, cloudRequests, cloudUsers] = await Promise.all([
              fetchCloudItem<Modpack[]>('modpacks'),
              fetchCloudItem<PlatformConfig>('platform_config'),
              fetchCloudItem<PermissionRequest[]>('permission_requests'),
              fetchCloudItem<User[]>('users')
            ]);

            if (cloudModpacks && Array.isArray(cloudModpacks) && cloudModpacks.length > 0) {
              this.state.modpacks.clear();
              cloudModpacks.forEach(m => {
                this.state.modpacks.set(m.id, m);
                if (idbSupported) idbPut('modpacks', m);
              });
              this.saveToLocalStorage('modpacks', cloudModpacks);
            } else if (this.state.modpacks.size > 0) {
              saveCloudItem('modpacks', Array.from(this.state.modpacks.values()));
            }

            if (cloudConfig) {
              this.state.platformConfig = cloudConfig;
              if (idbSupported) idbPut('platform_config', cloudConfig);
              this.saveToLocalStorage('platform_config', cloudConfig);
            } else if (this.state.platformConfig) {
              saveCloudItem('platform_config', this.state.platformConfig);
            }

            if (cloudRequests && Array.isArray(cloudRequests)) {
              this.state.permissionRequests.clear();
              cloudRequests.forEach(r => {
                this.state.permissionRequests.set(r.id, r);
                if (idbSupported) idbPut('permission_requests', r);
              });
              this.saveToLocalStorage('permission_requests', cloudRequests);
            }

            if (cloudUsers && Array.isArray(cloudUsers) && cloudUsers.length > 0) {
              cloudUsers.forEach(u => {
                this.state.users.set(u.id, u);
                if (idbSupported) idbPut('users', u);
              });
              const hasAdmin = Array.from(this.state.users.values()).some(u => u.username.toLowerCase() === 'doki');
              if (!hasAdmin) {
                const seed = await getSeedData();
                const doki = seed.users.find(u => u.username.toLowerCase() === 'doki');
                if (doki) {
                  this.state.users.set(doki.id, doki);
                  if (idbSupported) idbPut('users', doki);
                }
              }
              this.saveToLocalStorage('users', Array.from(this.state.users.values()));
            } else if (this.state.users.size > 0) {
              saveCloudItem('users', Array.from(this.state.users.values()));
            }
          } catch (cloudErr) {
            console.warn('[DatabaseStore] Supabase cloud sync warning:', cloudErr);
          }
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
  public async syncUsersFromCloud(): Promise<void> {
    const supabaseConfig = getSupabaseConfig();
    if (!supabaseConfig) return;
    try {
      const cloudUsers = await fetchCloudItem<User[]>('users');
      if (cloudUsers && Array.isArray(cloudUsers) && cloudUsers.length > 0) {
        let isBrowserCtx = this.isBrowser() && Boolean(window.indexedDB);
        cloudUsers.forEach(u => {
          this.state.users.set(u.id, u);
          if (isBrowserCtx) idbPut('users', u);
        });
        const hasAdmin = Array.from(this.state.users.values()).some(u => u.username.toLowerCase() === 'doki');
        if (!hasAdmin) {
          const seed = await getSeedData();
          const doki = seed.users.find(u => u.username.toLowerCase() === 'doki');
          if (doki) {
            this.state.users.set(doki.id, doki);
            if (isBrowserCtx) idbPut('users', doki);
          }
        }
        this.saveToLocalStorage('users', Array.from(this.state.users.values()));
      }
    } catch (e) {
      console.warn('[DatabaseStore] syncUsersFromCloud warning:', e);
    }
  }

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

  public async createUser(user: User): Promise<User> {
    // Pull any users registered from other browsers first
    await this.syncUsersFromCloud();

    this.state.users.set(user.id, user);
    idbPut('users', user);
    this.saveToLocalStorage('users', Array.from(this.state.users.values()));

    // Synchronize full user roster to Supabase cloud
    saveCloudItem('users', Array.from(this.state.users.values()));
    return user;
  }

  // --- SESSION STORE ---
  private saveSessions(): void {
    const activeSessions = Array.from(this.state.sessions.values()).filter(s => Date.now() <= s.expiresAt);
    this.saveToLocalStorage('sessions', activeSessions);
  }

  public createSession(session: AuthSession): void {
    this.state.sessions.set(session.token, session);
    idbPut('sessions', session);
    this.saveSessions();
  }

  public getSession(token: string): AuthSession | null {
    const session = this.state.sessions.get(token);
    if (!session) return null;
    if (Date.now() > session.expiresAt) {
      this.state.sessions.delete(token);
      idbDelete('sessions', token);
      this.saveSessions();
      return null;
    }
    return session;
  }

  public deleteSession(token: string): void {
    this.state.sessions.delete(token);
    idbDelete('sessions', token);
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
    idbPut('modpacks', modpack);
    this.saveToLocalStorage('modpacks', Array.from(this.state.modpacks.values()));
    saveCloudItem('modpacks', Array.from(this.state.modpacks.values()));
    return modpack;
  }

  public deleteModpack(id: string): boolean {
    const existed = this.state.modpacks.delete(id);
    if (existed) {
      idbDelete('modpacks', id);
      this.saveToLocalStorage('modpacks', Array.from(this.state.modpacks.values()));
      saveCloudItem('modpacks', Array.from(this.state.modpacks.values()));
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
    idbPut('permission_requests', req);
    this.saveToLocalStorage('permission_requests', Array.from(this.state.permissionRequests.values()));
    saveCloudItem('permission_requests', Array.from(this.state.permissionRequests.values()));
    return req;
  }

  // --- PLATFORM CONFIG TABLE ---
  public getPlatformConfig(): PlatformConfig {
    if (!this.state.platformConfig) {
      return {
        id: "platform_cfg_default",
        siteTitle: "Doki's Modpacks Hub",
        heroHeadline: "Minecraft 2:",
        heroSubtitle: "Biohazard.",
        heroTagline: "Custom Crafted Adventure • Official Client Release",
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
    idbPut('platform_config', config);
    this.saveToLocalStorage('platform_config', config);
    saveCloudItem('platform_config', config);
    return config;
  }

  public async syncToCloud(): Promise<{ success: boolean; message: string }> {
    return syncAllLocalToCloud(
      Array.from(this.state.modpacks.values()),
      this.state.platformConfig,
      Array.from(this.state.permissionRequests.values()),
      Array.from(this.state.users.values())
    );
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

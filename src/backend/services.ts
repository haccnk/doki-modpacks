// Service Layer: Business Logic, Mutation Handlers & Policy Verification
import { db } from './db';
import { 
  User, 
  Modpack, 
  ModpackLifecycle, 
  AccessPolicy, 
  PermissionRequest, 
  PlatformConfig,
  CreateModpackDTO, 
  UpdateModpackDTO, 
  SubmitPermissionRequestDTO, 
  ReviewPermissionRequestDTO, 
  UpdatePlatformConfigDTO, 
  AuthSession 
} from './types';
import { 
  verifyPassword, 
  hashPassword,
  generateSessionToken, 
  assertAdminRole, 
  assertCanDownloadModpack, 
  AccessDeniedError, 
  AuthenticationError 
} from './security';

// Helper to resolve user from auth token
async function resolveUserFromToken(token?: string | null): Promise<User | null> {
  if (!token) return null;
  await db.init();
  const session = db.getSession(token);
  if (!session) return null;
  return db.findUserById(session.user.id);
}

// ----------------------------------------------------
// 1. AUTH SERVICE
// ----------------------------------------------------
export class AuthService {
  /**
   * Authenticates user credentials (supporting Super Admin 'doki' / 'doki123' and registered users).
   */
  public static async login(username: string, password: string): Promise<AuthSession> {
    await db.init();

    const user = db.findUserByUsername(username);
    if (!user) {
      throw new AuthenticationError('Invalid username or password credentials.', 'INVALID_CREDENTIALS');
    }

    const isValid = await verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      throw new AuthenticationError('Invalid username or password credentials.', 'INVALID_CREDENTIALS');
    }

    // 7-day session duration
    const token = generateSessionToken(user.id);
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

    const session: AuthSession = {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      expiresAt,
    };

    db.createSession(session);
    return session;
  }

  /**
   * Registers a new regular user account (role: USER).
   */
  public static async register(username: string, email: string, password: string): Promise<AuthSession> {
    await db.init();

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanUsername || cleanUsername.length < 3) {
      throw new AuthenticationError('Username must be at least 3 characters long.', 'VALIDATION_ERROR');
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new AuthenticationError('Please provide a valid email address.', 'VALIDATION_ERROR');
    }

    if (!password || password.length < 6) {
      throw new AuthenticationError('Password must be at least 6 characters long.', 'VALIDATION_ERROR');
    }

    const existingUser = db.findUserByUsername(cleanUsername);
    if (existingUser) {
      throw new AuthenticationError('Username is already taken. Please choose another.', 'USERNAME_TAKEN');
    }

    const { hash, salt } = await hashPassword(password);
    const now = new Date().toISOString();
    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      username: cleanUsername,
      email: cleanEmail,
      passwordHash: hash,
      salt,
      role: 'USER',
      createdAt: now,
      updatedAt: now,
    };

    db.createUser(newUser);

    const token = generateSessionToken(newUser.id);
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

    const session: AuthSession = {
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
      expiresAt,
    };

    db.createSession(session);
    return session;
  }

  /**
   * Creates a guest installer session (role: GUEST).
   */
  public static async loginAsGuest(customHandle?: string): Promise<AuthSession> {
    await db.init();

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const guestHandle = (customHandle && customHandle.trim()) ? customHandle.trim() : `Guest_${randomSuffix}`;
    const now = new Date().toISOString();

    let user = db.findUserByUsername(guestHandle);
    if (!user) {
      user = {
        id: `guest_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        username: guestHandle,
        email: `${guestHandle.toLowerCase()}@guest.doki-hub.local`,
        passwordHash: 'GUEST_NO_PASSWORD',
        salt: 'GUEST_SALT',
        role: 'GUEST',
        createdAt: now,
        updatedAt: now,
      };
      db.createUser(user);
    }

    const token = generateSessionToken(user.id);
    const expiresAt = Date.now() + 2 * 24 * 60 * 60 * 1000;

    const session: AuthSession = {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      expiresAt,
    };

    db.createSession(session);
    return session;
  }

  public static async getCurrentUser(token: string): Promise<User> {
    const user = await resolveUserFromToken(token);
    if (!user) {
      throw new AuthenticationError('Session expired or invalid.', 'INVALID_SESSION');
    }
    return user;
  }

  public static async logout(token: string): Promise<void> {
    await db.init();
    db.deleteSession(token);
  }
}

// ----------------------------------------------------
// 2. MODPACK SERVICE (CRUD & Lifecycle Management)
// ----------------------------------------------------
export class ModpackService {
  /**
   * Regular User Scope: Retrieves catalog modpacks.
   */
  public static async getCatalog(token?: string | null): Promise<Modpack[]> {
    await db.init();
    const user = await resolveUserFromToken(token);
    const modpacks = db.getAllModpacks();

    // Super Admin gets all modpacks including drafts and quarantined
    if (user && user.role === 'ADMIN') {
      return modpacks;
    }

    // Public / Regular users only see published lifecycles
    return modpacks.filter(m => m.lifecycle === 'RELEASE' || m.lifecycle === 'BETA' || m.lifecycle === 'UPCOMING');
  }

  public static async getBySlug(slug: string): Promise<Modpack> {
    await db.init();
    const modpack = db.findModpackBySlug(slug);
    if (!modpack) {
      throw new AccessDeniedError(`Modpack with slug '${slug}' not found.`, 'MODPACK_NOT_FOUND', 404);
    }
    return modpack;
  }

  /**
   * Super Admin Scope: Create a new modpack.
   */
  public static async createModpack(adminToken: string, dto: CreateModpackDTO): Promise<Modpack> {
    const admin = await resolveUserFromToken(adminToken);
    assertAdminRole(admin);

    if (db.findModpackBySlug(dto.slug)) {
      throw new AccessDeniedError(`A modpack with slug '${dto.slug}' already exists.`, 'DUPLICATE_SLUG', 409);
    }

    const newModpack: Modpack = {
      id: `pack_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: dto.title,
      slug: dto.slug,
      description: dto.description,
      lore: dto.lore,
      lifecycle: dto.lifecycle,
      accessPolicy: dto.accessPolicy,
      isQuarantined: false,
      downloadMirror: dto.downloadMirror,
      bannerUrl: dto.bannerUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200',
      thumbnailUrl: dto.thumbnailUrl || dto.bannerUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600',
      themeHex: dto.themeHex || '#10B981',
      specs: dto.specs,
      featured: dto.featured || false,
      changelog: dto.changelog || '',
      screenshots: dto.screenshots || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return db.saveModpack(newModpack);
  }

  /**
   * Super Admin Scope: Update an existing modpack.
   */
  public static async updateModpack(adminToken: string, id: string, dto: UpdateModpackDTO): Promise<Modpack> {
    const admin = await resolveUserFromToken(adminToken);
    assertAdminRole(admin);

    const modpack = db.findModpackById(id);
    if (!modpack) {
      throw new AccessDeniedError(`Modpack with id '${id}' not found.`, 'MODPACK_NOT_FOUND', 404);
    }

    const updated: Modpack = {
      ...modpack,
      title: dto.title ?? modpack.title,
      slug: dto.slug ?? modpack.slug,
      description: dto.description ?? modpack.description,
      lore: dto.lore ?? modpack.lore,
      lifecycle: dto.lifecycle ?? modpack.lifecycle,
      accessPolicy: dto.accessPolicy ?? modpack.accessPolicy,
      isQuarantined: dto.isQuarantined ?? modpack.isQuarantined,
      downloadMirror: dto.downloadMirror ?? modpack.downloadMirror,
      bannerUrl: dto.bannerUrl ?? modpack.bannerUrl,
      thumbnailUrl: dto.thumbnailUrl ?? modpack.thumbnailUrl,
      themeHex: dto.themeHex ?? modpack.themeHex,
      specs: dto.specs ? { ...modpack.specs, ...dto.specs } : modpack.specs,
      featured: dto.featured ?? modpack.featured,
      changelog: dto.changelog ?? modpack.changelog,
      screenshots: dto.screenshots ?? modpack.screenshots,
      updatedAt: new Date().toISOString(),
    };

    return db.saveModpack(updated);
  }

  /**
   * Super Admin Scope: Emergency Quarantine Toggle.
   * Halts or restores public downloads instantly.
   */
  public static async setEmergencyQuarantine(adminToken: string, id: string, quarantined: boolean): Promise<Modpack> {
    const admin = await resolveUserFromToken(adminToken);
    assertAdminRole(admin);

    const modpack = db.findModpackById(id);
    if (!modpack) {
      throw new AccessDeniedError(`Modpack '${id}' not found.`, 'MODPACK_NOT_FOUND', 404);
    }

    modpack.isQuarantined = quarantined;
    modpack.updatedAt = new Date().toISOString();
    return db.saveModpack(modpack);
  }

  /**
   * Super Admin Scope: Delete modpack.
   */
  public static async deleteModpack(adminToken: string, id: string): Promise<boolean> {
    const admin = await resolveUserFromToken(adminToken);
    assertAdminRole(admin);

    const modpack = db.findModpackById(id);
    if (!modpack) {
      throw new AccessDeniedError(`Modpack '${id}' not found.`, 'MODPACK_NOT_FOUND', 404);
    }

    return db.deleteModpack(id);
  }
}

// ----------------------------------------------------
// 3. PERMISSION MODERATION SERVICE
// ----------------------------------------------------
export class PermissionService {
  /**
   * Regular User Scope: Submit access request for NEED_PERMISSION modpack.
   */
  public static async submitRequest(userToken: string, dto: SubmitPermissionRequestDTO): Promise<PermissionRequest> {
    const user = await resolveUserFromToken(userToken);
    if (!user) {
      throw new AuthenticationError('Sign in required to submit permission requests.', 'AUTH_REQUIRED');
    }

    const modpack = db.findModpackById(dto.modpackId);
    if (!modpack) {
      throw new AccessDeniedError(`Modpack '${dto.modpackId}' not found.`, 'MODPACK_NOT_FOUND', 404);
    }

    const existing = db.findPermissionRequest(dto.modpackId, user.id);
    if (existing && existing.status === 'PENDING') {
      throw new AccessDeniedError('You already have a pending permission request for this modpack.', 'DUPLICATE_REQUEST', 409);
    }

    const request: PermissionRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      modpackId: modpack.id,
      modpackSlug: modpack.slug,
      userId: user.id,
      username: user.username,
      reason: dto.reason,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return db.savePermissionRequest(request);
  }

  /**
   * Super Admin Scope: View all permission requests.
   */
  public static async listRequests(adminToken: string, filterStatus?: string): Promise<PermissionRequest[]> {
    const admin = await resolveUserFromToken(adminToken);
    assertAdminRole(admin);

    const all = db.getPermissionRequests();
    if (!filterStatus) return all;
    return all.filter(r => r.status === filterStatus);
  }

  /**
   * Super Admin Scope: Approve or Reject user permission request.
   */
  public static async moderateRequest(adminToken: string, dto: ReviewPermissionRequestDTO): Promise<PermissionRequest> {
    const admin = await resolveUserFromToken(adminToken);
    assertAdminRole(admin);

    const request = db.findPermissionRequestById(dto.requestId);
    if (!request) {
      throw new AccessDeniedError(`Permission request '${dto.requestId}' not found.`, 'REQUEST_NOT_FOUND', 404);
    }

    request.status = dto.status;
    request.reviewedBy = admin.username;
    request.reviewedAt = new Date().toISOString();
    request.updatedAt = new Date().toISOString();

    return db.savePermissionRequest(request);
  }

  /**
   * Checks if user has an approved permission request for a modpack.
   */
  public static async hasApprovedAccess(userId: string, modpackId: string): Promise<boolean> {
    await db.init();
    const req = db.findPermissionRequest(modpackId, userId);
    return req !== null && req.status === 'APPROVED';
  }
}

// ----------------------------------------------------
// 4. PLATFORM & CONTENT CUSTOMIZATION SERVICE
// ----------------------------------------------------
export class PlatformConfigService {
  /**
   * Public Scope: Retrieves active platform configuration.
   */
  public static async getConfig(): Promise<PlatformConfig> {
    await db.init();
    return db.getPlatformConfig();
  }

  /**
   * Super Admin Scope: Updates platform configuration (featured hero modpack, catalog mode, emergency lock).
   */
  public static async updateConfig(adminToken: string, dto: UpdatePlatformConfigDTO): Promise<PlatformConfig> {
    const admin = await resolveUserFromToken(adminToken);
    assertAdminRole(admin);

    const current = db.getPlatformConfig();
    const updated: PlatformConfig = {
      ...current,
      ...dto,
      updatedBy: admin.id,
      updatedAt: new Date().toISOString(),
    };

    return db.savePlatformConfig(updated);
  }
}

// ----------------------------------------------------
// 5. DOWNLOAD & ACCESS RESOLUTION SERVICE
// ----------------------------------------------------
export class DownloadService {
  /**
   * Resolves the secure download mirror URL for a modpack.
   * Enforces role boundaries, quarantine checks, and permission requirements.
   */
  public static async resolveDownload(
    modpackIdOrSlug: string,
    userToken?: string | null
  ): Promise<{ downloadMirror: string; modpackTitle: string; bypass: boolean }> {
    await db.init();

    // Find by ID or Slug
    let modpack = db.findModpackById(modpackIdOrSlug);
    if (!modpack) {
      modpack = db.findModpackBySlug(modpackIdOrSlug);
    }
    if (!modpack) {
      throw new AccessDeniedError(`Modpack '${modpackIdOrSlug}' not found.`, 'MODPACK_NOT_FOUND', 404);
    }

    const user = await resolveUserFromToken(userToken);
    const hasApproved = user ? await PermissionService.hasApprovedAccess(user.id, modpack.id) : false;

    // Enforce Access Boundary Guard
    const check = assertCanDownloadModpack(user, modpack, hasApproved);

    return {
      downloadMirror: modpack.downloadMirror,
      modpackTitle: modpack.title,
      bypass: check.bypassReason === 'SUPER_ADMIN_BYPASS',
    };
  }
}

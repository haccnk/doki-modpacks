// Security, Password Hashing & Access Control Enforcement
import { User, Modpack, AccessPolicy } from './types';

export class AccessDeniedError extends Error {
  public code: string;
  public statusCode: number;

  constructor(message: string, code = 'ACCESS_DENIED', statusCode = 403) {
    super(message);
    this.name = 'AccessDeniedError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class AuthenticationError extends Error {
  public code: string;
  public statusCode: number;

  constructor(message: string, code = 'UNAUTHENTICATED', statusCode = 401) {
    super(message);
    this.name = 'AuthenticationError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

// Convert string to Uint8Array
const textEncode = (str: string) => new TextEncoder().encode(str);

// Convert buffer to hex string
const bufToHex = (buffer: ArrayBuffer | Uint8Array): string => {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Cryptographically secure password hashing using PBKDF2 with SHA-256 (100,000 iterations).
 */
export async function hashPassword(password: string, customSalt?: string): Promise<{ hash: string; salt: string }> {
  const salt = customSalt || bufToHex(crypto.getRandomValues(new Uint8Array(16)));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    textEncode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: textEncode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  return {
    hash: bufToHex(derivedKey),
    salt,
  };
}

/**
 * Verifies a plain password against the stored PBKDF2 hash.
 */
export async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
  const result = await hashPassword(password, salt);
  return result.hash === hash;
}

/**
 * Generates a random cryptographic session token.
 */
export function generateSessionToken(userId: string): string {
  const randomBytes = bufToHex(crypto.getRandomValues(new Uint8Array(24)));
  return `sess_${userId}_${randomBytes}_${Date.now()}`;
}

/**
 * Access Control Boundary 1: Strict Admin Mutation Guard
 * Throws AccessDeniedError if the current user is not a Super Admin.
 */
export function assertAdminRole(user: User | null | undefined): asserts user is User {
  if (!user) {
    throw new AuthenticationError('Authentication required to perform administrative mutations.', 'AUTH_REQUIRED');
  }

  if (user.role !== 'ADMIN') {
    throw new AccessDeniedError(
      `Forbidden: Super Admin scope required. User '${user.username}' does not hold 'ADMIN' privileges.`,
      'ADMIN_ROLE_REQUIRED'
    );
  }
}

/**
 * Access Control Boundary 2: Download Rights & Quarantine Guard
 * Evaluates whether a user can download a given modpack.
 */
export function assertCanDownloadModpack(
  user: Pick<User, 'id' | 'role' | 'username'> | null | undefined,
  modpack: Modpack,
  hasApprovedPermission: boolean
): { allowed: boolean; bypassReason?: string } {
  // 1. Super Admin bypass: Instant access regardless of quarantine or access policy
  if (user && user.role === 'ADMIN') {
    return { allowed: true, bypassReason: 'SUPER_ADMIN_BYPASS' };
  }

  // 2. Emergency Quarantine Check
  if (modpack.isQuarantined) {
    throw new AccessDeniedError(
      `Downloads for '${modpack.title}' have been halted by administration under an Emergency Quarantine.`,
      'EMERGENCY_QUARANTINE_ACTIVE'
    );
  }

  // 3. Open Download Policy
  if (modpack.accessPolicy === 'OPEN_DOWNLOAD') {
    return { allowed: true };
  }

  // 4. Need Permission Policy
  if (modpack.accessPolicy === 'NEED_PERMISSION') {
    if (!user) {
      throw new AuthenticationError(
        `This modpack requires administrative permission. Please sign in to submit an access request.`,
        'AUTHENTICATION_REQUIRED_FOR_PERMISSION'
      );
    }

    if (!hasApprovedPermission) {
      throw new AccessDeniedError(
        `Access to '${modpack.title}' requires an approved permission request. Your request is pending or has not been submitted.`,
        'PERMISSION_REQUEST_REQUIRED'
      );
    }

    return { allowed: true };
  }

  throw new AccessDeniedError('Unrecognized access policy on modpack.', 'INVALID_POLICY');
}

// Doki's Modpacks Hub: Backend Architecture & Domain Models

export type UserRole = 'ADMIN' | 'USER' | 'GUEST';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type ModpackLifecycle = 'TEASER' | 'UPCOMING' | 'BETA' | 'RELEASE';

export type AccessPolicy = 'OPEN_DOWNLOAD' | 'NEED_PERMISSION';

export interface ModpackTechnicalSpecs {
  minecraftVersion: string;
  modLoader: string;
  javaRuntime: string;
  recommendedRam: string;
  minRam: string;
  totalModsCount?: number;
  minCpu?: string;
  minGpu?: string;
  diskSpace?: string;
}

export interface Modpack {
  id: string;
  title: string;
  slug: string;
  description: string;
  lore: string;
  lifecycle: ModpackLifecycle;
  accessPolicy: AccessPolicy;
  isQuarantined: boolean;
  downloadMirror: string;
  bannerUrl: string;
  thumbnailUrl?: string;
  themeHex: string;
  specs: ModpackTechnicalSpecs;
  featured: boolean;
  changelog?: string;
  screenshots?: string[];
  createdAt: string;
  updatedAt: string;
}

export type PermissionRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface PermissionRequest {
  id: string;
  modpackId: string;
  modpackSlug: string;
  userId: string;
  username: string;
  reason: string;
  status: PermissionRequestStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type CatalogDisplayMode = 'FEATURED_HERO' | 'MULTI_CATALOG';

export interface MarqueeItem {
  id?: string;
  label: string;
  status: string;
  tag: string;
  link?: string;
  color?: 'emerald' | 'cyan' | 'amber' | 'indigo' | 'rose' | 'violet';
}

export interface PlatformConfig {
  id: string;
  siteTitle?: string;
  heroHeadline?: string;
  heroSubtitle?: string;
  heroTagline?: string;
  announcementText?: string;
  announcementUrl?: string;
  featuredModpackId: string;
  catalogMode: CatalogDisplayMode;
  aboutDokiCopy: string;
  footerCopy?: string;
  emergencySystemLock: boolean;
  // Get Help & Community Customization
  helpTitle?: string;
  helpSubtitle?: string;
  helpDiscordUrl?: string;
  helpFacebookUrl?: string;
  helpCustomUrl?: string;
  helpCustomLabel?: string;
  helpImageUrl?: string;
  helpContent?: string;
  helpContactEmail?: string;
  // Top Information Bar (Live Telemetry & Announcements)
  marqueeEnabled?: boolean;
  marqueeLabel?: string;
  marqueePingText?: string;
  marqueeItems?: MarqueeItem[];
  updatedBy: string;
  updatedAt: string;
}

// Authentication & Session Contracts
export interface AuthSession {
  token: string;
  user: Omit<User, 'passwordHash' | 'salt'>;
  expiresAt: number;
}

// DTOs for Mutations
export interface CreateModpackDTO {
  title: string;
  slug: string;
  description: string;
  lore: string;
  lifecycle: ModpackLifecycle;
  accessPolicy: AccessPolicy;
  downloadMirror: string;
  bannerUrl?: string;
  thumbnailUrl?: string;
  themeHex?: string;
  specs: ModpackTechnicalSpecs;
  featured?: boolean;
  changelog?: string;
  screenshots?: string[];
}

export interface UpdateModpackDTO extends Partial<CreateModpackDTO> {
  isQuarantined?: boolean;
}

export interface SubmitPermissionRequestDTO {
  modpackId: string;
  reason: string;
}

export interface ReviewPermissionRequestDTO {
  requestId: string;
  status: 'APPROVED' | 'REJECTED';
}

export interface UpdatePlatformConfigDTO extends Partial<Omit<PlatformConfig, 'id' | 'updatedBy' | 'updatedAt'>> {}


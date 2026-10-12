// Initial Database Seeding for Doki's Modpacks Hub
import { User, Modpack, PlatformConfig } from './types';
import { hashPassword } from './security';

export async function getSeedData(): Promise<{
  users: User[];
  modpacks: Modpack[];
  platformConfig: PlatformConfig;
}> {
  // Pre-seed Super Admin credentials: doki / doki123 (hashed via PBKDF2/SHA-256)
  const dokiAuth = await hashPassword('doki123', 'doki_salt_production_99482');

  const superAdmin: User = {
    id: 'user_admin_doki',
    username: 'doki',
    email: 'doki@modpack.hub',
    passwordHash: dokiAuth.hash,
    salt: dokiAuth.salt,
    role: 'ADMIN',
    createdAt: '2026-10-11T12:00:00Z',
    updatedAt: '2026-10-11T12:00:00Z',
  };

  // Seed baseline record: Minecraft 2: Biohazard
  const biohazardModpack: Modpack = {
    id: 'pack_biohazard_01',
    title: 'Minecraft 2: Biohazard',
    slug: 'minecraft-2-biohazard',
    description: 'Post-Ender Dragon survival reimagined in an Overworld consumed by a mysterious biological entity.',
    lore: 'The Ender Dragon has been defeated, but when we return to the Overworld, everything has withered away due to a strange plague caused by a mysterious entity. We will have to wander everywhere to search for the truth and also to return to The End.',
    lifecycle: 'RELEASE',
    accessPolicy: 'OPEN_DOWNLOAD',
    isQuarantined: false,
    releaseDate: '2026-10-11',
    trailerUrl: 'https://www.youtube.com/watch?v=MmB9b5njVbA',
    trailerTitle: 'Minecraft 2: Biohazard Cinematic Reveal Trailer',
    downloadMirror: 'https://drive.google.com/drive/folders/1aFzU3cR0nRVHCT-gzJSTNoRKEavO-VFk?usp=drive_link',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600',
    themeHex: '#10B981',
    specs: {
      minecraftVersion: '1.20.1',
      modLoader: 'Fabric 0.16.5',
      javaRuntime: 'Java 21 OpenJDK',
      recommendedRam: '8 GB',
      minRam: '6 GB',
      totalModsCount: 184,
      minCpu: 'Intel Core i5-8400 / AMD Ryzen 5 2600',
      minGpu: 'NVIDIA GTX 1060 (6GB) / AMD Radeon RX 580',
      diskSpace: '5.2 GB High-Speed NVMe/SSD',
    },
    featured: true,
    changelog: 'v1.0.0-RELEASE: Initial official release of Minecraft 2: Biohazard. Complete Fabric 0.16.5 balance pass, custom plague entities, and end-portal tether mechanisms.',
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800'
    ],
    createdAt: '2026-10-11T12:00:00Z',
    updatedAt: '2026-10-11T12:00:00Z',
  };

  const initialPlatformConfig: PlatformConfig = {
    id: 'platform_cfg_default',
    siteTitle: "Doki's Modpacks Hub",
    heroHeadline: 'Minecraft 2:',
    heroSubtitle: 'Biohazard.',
    heroTagline: 'Custom Crafted Adventure • Official Client Release',
    announcementText: 'Flagship Release: Minecraft 2: Biohazard is Live',
    announcementUrl: '/modpack/minecraft-2-biohazard',
    featuredModpackId: biohazardModpack.id,
    catalogMode: 'FEATURED_HERO',
    aboutDokiCopy: `Doki's Modpacks is the dedicated home for high-quality, custom-crafted Minecraft adventures. Every modpack is meticulously configured, tested for balance, and enriched with bespoke lore and survival mechanics.
Our flagship release, Minecraft 2: Biohazard, reimagines the post-Ender Dragon survival journey in an Overworld consumed by a mysterious biological plague. Through this platform, players can explore rich lore, preview interactive 3D voxel mechanics, read comprehensive survival guides, and download official client builds directly.`,
    footerCopy: 'Meticulously configured Minecraft adventures, rich lore narratives, and high-performance server engineering. A member of the PackOps ecosystem.',
    emergencySystemLock: false,
    helpTitle: 'Community Support & Help Desk',
    helpSubtitle: 'Need assistance setting up a modpack, configuring Java 21, or finding players? Join our official community Discord or Facebook group.',
    helpDiscordUrl: 'https://discord.gg/minecraft',
    helpFacebookUrl: 'https://facebook.com/groups/minecraft',
    helpCustomUrl: 'https://github.com',
    helpCustomLabel: 'GitHub Issue Tracker',
    helpImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    helpContent: `### Quick Setup Troubleshooting
1. **Crash on Startup:** Ensure you are using **Java 21 LTS** with 64-bit architecture. Older Java 8 or 17 runtimes will fail with Fabric 0.16.5+.
2. **Low Framerates:** Allocate between 6 GB to 8 GB RAM in your launcher settings. Allocating more than 10 GB can cause JVM garbage collection freezes.
3. **Multiplayer Connection:** Ensure you have downloaded the official client build matching the server release version.

Need personal 1-on-1 assistance? Join our official Discord or Facebook community!`,
    helpContactEmail: 'support@doki-modpacks.io',
    faqs: [
      {
        id: 'faq-1',
        question: 'What Java version is required to run Doki modpacks?',
        answer: 'All modern Doki modpacks require 64-bit Java 21 LTS (OpenJDK, Eclipse Temurin, or Oracle). Older versions such as Java 8 or Java 17 will result in startup crashes on Fabric 0.16+.',
        category: 'System & Installation'
      },
      {
        id: 'faq-2',
        question: 'How much RAM should I allocate in the launcher?',
        answer: 'We recommend allocating 6 GB to 8 GB of RAM. Allocating less than 6 GB may cause stutters in heavily modded biomes, while allocating more than 10 GB can trigger JVM garbage collection latency spikes.',
        category: 'Performance'
      },
      {
        id: 'faq-3',
        question: 'How do I access Closed Demo modpacks?',
        answer: 'Closed Demo modpacks require permission authorization. Simply click the "Request Access" button on the modpack card and provide your player handle or reason. Admin moderators review requests promptly.',
        category: 'Access & Permissions'
      },
      {
        id: 'faq-4',
        question: 'Can I install client-side shaders or performance mods?',
        answer: 'Yes! Doki modpacks include Sodium and Iris by default for modern Fabric builds. You can drop your favorite shaders into the shaderpacks folder without modifying base config files.',
        category: 'Modding & Customization'
      },
      {
        id: 'faq-5',
        question: 'Is multiplayer supported out of the box?',
        answer: 'Yes! Our modpacks are balanced and stress-tested for both singleplayer and dedicated multiplayer servers. Official server pack archives are distributed alongside client releases.',
        category: 'Multiplayer'
      }
    ],
    creditsTitle: 'Credits & Acknowledgments',
    creditsSubtitle: "Honoring the mod authors, engineers, testers, and community contributors who bring Doki's modpack worlds to life.",
    creditsLastUpdated: 'October 2026',
    creditsContent: `### Modding Community & Library Authors
We express our deepest gratitude to the Minecraft modding community and fabricMC developers whose groundbreaking libraries make these adventures possible:
* **Fabric Project & Loom Team** – For the lightweight, modular modding framework.
* **CaffeineMC (JellySquid & Contributors)** – For Sodium, Lithium, and Phosphor rendering optimizations.
* **Iris Shaders Team** – For next-generation shader pipeline support.
* **Bespoke Environmental Designers** – For biome expansions, atmospheric audio engines, and creature models.

---

### Project Leadership & Direction
* **Doki** – Lead Pack Architect, Balance Engineer, Lore Design & System Integration.
* **PackOps Engineering Fleet** – High-speed distribution infrastructure, telemetry pipelines, and security protocols.

---

### Special Thanks
* Dedicated Alpha & Closed Demo Playtesters who hunted down desync glitches and memory leaks.
* The community members across Discord and Facebook for continuous feedback and bug reports.

*All third-party mods belong to their respective authors and are distributed in accordance with their respective open-source and modpack distribution licenses.*`,
    marqueeEnabled: true,
    marqueeLabel: 'PackOps Live Telemetry',
    marqueePingText: 'Cluster Ping: 12ms',
    marqueeItems: [
      {
        id: 'mq-1',
        label: 'Flagship Biohazard Overworld Sync',
        status: 'Fabric 0.16.5 • Release Live',
        tag: 'ACTIVE',
        color: 'emerald',
        link: '/modpack/minecraft-2-biohazard'
      },
      {
        id: 'mq-2',
        label: 'Doki Hub Access Control',
        status: 'PBKDF2/SHA-256 • Role Enforced',
        tag: 'SECURE',
        color: 'emerald'
      },
      {
        id: 'mq-3',
        label: 'Client Build Distribution',
        status: 'Direct Client Download Ready',
        tag: 'DIRECT',
        color: 'cyan',
        link: '/catalog'
      },
      {
        id: 'mq-4',
        label: 'Official Community Hub',
        status: 'Discord & Facebook Live',
        tag: 'ONLINE',
        color: 'indigo',
        link: '/help'
      },
      {
        id: 'mq-5',
        label: 'JVM Runtime Target',
        status: 'Java 21 LTS 64-Bit Recommended',
        tag: 'RUNTIME',
        color: 'amber'
      }
    ],
    updatedBy: superAdmin.id,
    updatedAt: '2026-10-11T12:00:00Z',
  };

  return {
    users: [superAdmin],
    modpacks: [biohazardModpack],
    platformConfig: initialPlatformConfig,
  };
}

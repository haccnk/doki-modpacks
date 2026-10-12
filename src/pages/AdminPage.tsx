import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Package, 
  Sliders, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  Trash2, 
  Plus, 
  Edit3, 
  Save, 
  Check, 
  Clock, 
  CheckCircle2, 
  X, 
  Image, 
  Cpu, 
  FileText, 
  Globe, 
  Layers, 
  HardDrive,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
  LifeBuoy,
  Facebook,
  Radio,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Film,
  Calendar,
  MessageCircleQuestion,
  Award,
  Disc as Discord,
  Database,
  Cloud,
  UploadCloud,
  DownloadCloud,
  Copy
} from 'lucide-react';
import { useDoki } from '../context/DokiContext';
import { Modpack, ModpackLifecycle, AccessPolicy, CreateModpackDTO, UpdateModpackDTO, MarqueeItem, FAQItem } from '../backend/types';
import { sound } from '../utils/sound';
import { BorderBeam } from '../components/BorderBeam';

export const AdminPage: React.FC = () => {
  const { 
    modpacks, 
    platformConfig, 
    pendingRequests, 
    currentUser,
    isAdmin, 
    login,
    createModpack, 
    updateModpack, 
    deleteModpack, 
    toggleEmergencyQuarantine, 
    moderateRequest, 
    updatePlatformConfig,
    setIsEditingModpack,
    syncToCloud,
    testCloudConnection,
    saveCloudConfig,
    getCloudConfig
  } = useDoki();

  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'modpacks' | 'customizer' | 'marquee' | 'help' | 'permissions' | 'credits' | 'database'>('modpacks');

  // Modpack Edit Modal State
  const [editingPack, setEditingPack] = useState<Modpack | null>(null);
  const [isCreatingPack, setIsCreatingPack] = useState(false);

  // Sync editing state so Taskbar disappears during editing
  useEffect(() => {
    setIsEditingModpack(Boolean(editingPack || isCreatingPack));
    return () => {
      setIsEditingModpack(false);
    };
  }, [editingPack, isCreatingPack, setIsEditingModpack]);

  // Login form if not admin
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Cloud Database (Supabase / Vercel Sync) State
  const [cloudUrl, setCloudUrl] = useState('');
  const [cloudKey, setCloudKey] = useState('');
  const [isTestingCloud, setIsTestingCloud] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; tableMissing?: boolean } | null>(null);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [copiedSeed, setCopiedSeed] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    const cfg = getCloudConfig();
    if (cfg) {
      setCloudUrl(cfg.url);
      setCloudKey(cfg.anonKey);
    }
  }, [getCloudConfig]);

  // Modpack Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formLore, setFormLore] = useState('');
  const [formThumbnail, setFormThumbnail] = useState('');
  const [formBanner, setFormBanner] = useState('');
  const [formMirror, setFormMirror] = useState('');
  const [formLifecycle, setFormLifecycle] = useState<ModpackLifecycle>('RELEASE');
  const [formPolicy, setFormPolicy] = useState<AccessPolicy>('OPEN_DOWNLOAD');
  const [formReleaseDate, setFormReleaseDate] = useState('');
  const [formTrailerUrl, setFormTrailerUrl] = useState('');
  const [formTrailerTitle, setFormTrailerTitle] = useState('');
  const [formMcVersion, setFormMcVersion] = useState('1.20.1');
  const [formLoader, setFormLoader] = useState('Fabric 0.16.5');
  const [formJava, setFormJava] = useState('Java 21 LTS');
  const [formMinRam, setFormMinRam] = useState('6 GB');
  const [formRecRam, setFormRecRam] = useState('8 GB');
  const [formMinCpu, setFormMinCpu] = useState('Intel Core i5-8400 / AMD Ryzen 5 2600');
  const [formMinGpu, setFormMinGpu] = useState('NVIDIA GTX 1060 / AMD RX 580 (4 GB)');
  const [formDiskSpace, setFormDiskSpace] = useState('12 GB Free SSD Space');
  const [formModsCount, setFormModsCount] = useState(248);
  const [formChangelog, setFormChangelog] = useState('');
  const [formScreenshotsList, setFormScreenshotsList] = useState<string[]>([]);
  const [newScreenshotUrl, setNewScreenshotUrl] = useState('');

  // Page Customizer State
  const [customSiteTitle, setCustomSiteTitle] = useState(platformConfig?.siteTitle || "Doki's Modpacks Hub");
  const [customHeroHeadline, setCustomHeroHeadline] = useState(platformConfig?.heroHeadline || "Minecraft 2: Biohazard");
  const [customHeroSubtitle, setCustomHeroSubtitle] = useState(platformConfig?.heroSubtitle || "The Overworld Has Fallen. Survival Re-engineered.");
  const [customHeroTagline, setCustomHeroTagline] = useState(platformConfig?.heroTagline || "Flagship Post-End Exploration Modpack");
  const [customAnnouncementText, setCustomAnnouncementText] = useState(platformConfig?.announcementText || "Flagship Release: Minecraft 2: Biohazard is Live");
  const [customAnnouncementUrl, setCustomAnnouncementUrl] = useState(platformConfig?.announcementUrl || "/modpack/minecraft-2-biohazard");
  const [customFeaturedId, setCustomFeaturedId] = useState(platformConfig?.featuredModpackId || '');
  const [customAboutCopy, setCustomAboutCopy] = useState(platformConfig?.aboutDokiCopy || '');
  const [customFooterCopy, setCustomFooterCopy] = useState(platformConfig?.footerCopy || "Doki's Modpacks Hub • A member of PackOps");
  const [customLock, setCustomLock] = useState(platformConfig?.emergencySystemLock || false);

  // Get Help Page Customizer State
  const [customHelpTitle, setCustomHelpTitle] = useState(platformConfig?.helpTitle || 'Community Support & Help Desk');
  const [customHelpSubtitle, setCustomHelpSubtitle] = useState(platformConfig?.helpSubtitle || 'Need assistance setting up a modpack, configuring Java 21, or finding players? Join our official community Discord or Facebook group.');
  const [customHelpDiscordUrl, setCustomHelpDiscordUrl] = useState(platformConfig?.helpDiscordUrl || 'https://discord.gg/minecraft');
  const [customHelpFacebookUrl, setCustomHelpFacebookUrl] = useState(platformConfig?.helpFacebookUrl || 'https://facebook.com/groups/minecraft');
  const [customHelpCustomUrl, setCustomHelpCustomUrl] = useState(platformConfig?.helpCustomUrl || 'https://github.com');
  const [customHelpCustomLabel, setCustomHelpCustomLabel] = useState(platformConfig?.helpCustomLabel || 'GitHub Issue Tracker');
  const [customHelpImageUrl, setCustomHelpImageUrl] = useState(platformConfig?.helpImageUrl || '');
  const [customHelpContent, setCustomHelpContent] = useState(platformConfig?.helpContent || '');
  const [customHelpContactEmail, setCustomHelpContactEmail] = useState(platformConfig?.helpContactEmail || 'support@doki-modpacks.io');

  // Top Information Bar (Live Telemetry & Announcements) State
  const [customMarqueeEnabled, setCustomMarqueeEnabled] = useState(platformConfig?.marqueeEnabled ?? true);
  const [customMarqueeLabel, setCustomMarqueeLabel] = useState(platformConfig?.marqueeLabel || 'PackOps Live Telemetry');
  const [customMarqueePing, setCustomMarqueePing] = useState(platformConfig?.marqueePingText || 'Cluster Ping: 12ms');
  const [customMarqueeItems, setCustomMarqueeItems] = useState<MarqueeItem[]>(platformConfig?.marqueeItems || [
    {
      id: 'item-1',
      label: 'Flagship Biohazard Overworld Sync',
      status: 'Fabric 0.16.5 • Release Live',
      tag: 'ACTIVE',
      color: 'emerald',
      link: '/modpack/minecraft-2-biohazard'
    },
    {
      id: 'item-2',
      label: 'Doki Hub Access Control',
      status: 'PBKDF2/SHA-256 • Role Enforced',
      tag: 'SECURE',
      color: 'emerald'
    },
    {
      id: 'item-3',
      label: 'Edge Cluster us-east-1',
      status: '48/48 MicroVMs Ready',
      tag: 'HEALTHY',
      color: 'emerald'
    },
    {
      id: 'item-4',
      label: 'Client Build Distribution',
      status: 'Direct Client Download Ready',
      tag: 'DIRECT',
      color: 'cyan',
      link: '/catalog'
    },
    {
      id: 'item-5',
      label: 'Official Community Hub',
      status: 'Discord & Facebook Live',
      tag: 'ONLINE',
      color: 'indigo',
      link: '/help'
    },
    {
      id: 'item-6',
      label: 'JVM Runtime Target',
      status: 'Java 21 LTS 64-Bit Recommended',
      tag: 'RUNTIME',
      color: 'amber'
    }
  ]);

  // FAQ Management State
  const [customFaqs, setCustomFaqs] = useState<FAQItem[]>(platformConfig?.faqs || [
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
  ]);
  const [draftFaqQuestion, setDraftFaqQuestion] = useState('');
  const [draftFaqAnswer, setDraftFaqAnswer] = useState('');
  const [draftFaqCategory, setDraftFaqCategory] = useState('System & Installation');
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);

  // Credits Customizer State
  const [customCreditsTitle, setCustomCreditsTitle] = useState(platformConfig?.creditsTitle || 'Credits & Acknowledgments');
  const [customCreditsSubtitle, setCustomCreditsSubtitle] = useState(platformConfig?.creditsSubtitle || "Honoring the mod authors, engineers, testers, and community contributors who bring Doki's modpack worlds to life.");
  const [customCreditsLastUpdated, setCustomCreditsLastUpdated] = useState(platformConfig?.creditsLastUpdated || 'October 2026');
  const [customCreditsContent, setCustomCreditsContent] = useState(platformConfig?.creditsContent || `### Modding Community & Library Authors
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

*All third-party mods belong to their respective authors and are distributed in accordance with their respective open-source and modpack distribution licenses.*`);

  // Draft new marquee item
  const [draftLabel, setDraftLabel] = useState('');
  const [draftStatus, setDraftStatus] = useState('');
  const [draftTag, setDraftTag] = useState('ACTIVE');
  const [draftLink, setDraftLink] = useState('');
  const [draftColor, setDraftColor] = useState<'emerald' | 'cyan' | 'amber' | 'indigo' | 'rose' | 'violet'>('emerald');

  const [isSavedCustomizer, setIsSavedCustomizer] = useState(false);

  // Canvas-based image compressor to safely fit in storage without quota issues
  const compressImage = (file: File, maxWidth = 1280, maxHeight = 1280, quality = 0.82): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      };
      img.src = objectUrl;
    });
  };

  // Image Upload helper (file to compressed base64 Data URL)
  const handleImageUpload = async (file: File, callback: (result: string) => void) => {
    try {
      const compressed = await compressImage(file);
      callback(compressed);
      sound.playSuccess();
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
          sound.playSuccess();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Sync customizer with platformConfig on load
  useEffect(() => {
    if (platformConfig) {
      setCustomSiteTitle(platformConfig.siteTitle || "Doki's Modpacks Hub");
      setCustomHeroHeadline(platformConfig.heroHeadline || "Minecraft 2: Biohazard");
      setCustomHeroSubtitle(platformConfig.heroSubtitle || "The Overworld Has Fallen. Survival Re-engineered.");
      setCustomHeroTagline(platformConfig.heroTagline || "Flagship Post-End Exploration Modpack");
      setCustomAnnouncementText(platformConfig.announcementText || "Flagship Release: Minecraft 2: Biohazard is Live");
      setCustomAnnouncementUrl(platformConfig.announcementUrl || "/modpack/minecraft-2-biohazard");
      setCustomFeaturedId(platformConfig.featuredModpackId || '');
      setCustomAboutCopy(platformConfig.aboutDokiCopy || '');
      setCustomFooterCopy(platformConfig.footerCopy || "Doki's Modpacks Hub • A member of PackOps");
      setCustomLock(platformConfig.emergencySystemLock || false);

      setCustomHelpTitle(platformConfig.helpTitle || 'Community Support & Help Desk');
      setCustomHelpSubtitle(platformConfig.helpSubtitle || 'Need assistance setting up a modpack, configuring Java 21, or finding players? Join our official community Discord or Facebook group.');
      setCustomHelpDiscordUrl(platformConfig.helpDiscordUrl || 'https://discord.gg/minecraft');
      setCustomHelpFacebookUrl(platformConfig.helpFacebookUrl || 'https://facebook.com/groups/minecraft');
      setCustomHelpCustomUrl(platformConfig.helpCustomUrl || 'https://github.com');
      setCustomHelpCustomLabel(platformConfig.helpCustomLabel || 'GitHub Issue Tracker');
      setCustomHelpImageUrl(platformConfig.helpImageUrl || '');
      setCustomHelpContent(platformConfig.helpContent || '');
      setCustomHelpContactEmail(platformConfig.helpContactEmail || 'support@doki-modpacks.io');

      if (platformConfig.faqs && platformConfig.faqs.length > 0) {
        setCustomFaqs(platformConfig.faqs);
      }
      if (platformConfig.creditsTitle) {
        setCustomCreditsTitle(platformConfig.creditsTitle);
      }
      if (platformConfig.creditsSubtitle) {
        setCustomCreditsSubtitle(platformConfig.creditsSubtitle);
      }
      if (platformConfig.creditsLastUpdated) {
        setCustomCreditsLastUpdated(platformConfig.creditsLastUpdated);
      }
      if (platformConfig.creditsContent) {
        setCustomCreditsContent(platformConfig.creditsContent);
      }

      if (platformConfig.marqueeEnabled !== undefined) {
        setCustomMarqueeEnabled(platformConfig.marqueeEnabled);
      }
      if (platformConfig.marqueeLabel) {
        setCustomMarqueeLabel(platformConfig.marqueeLabel);
      }
      if (platformConfig.marqueePingText) {
        setCustomMarqueePing(platformConfig.marqueePingText);
      }
      if (platformConfig.marqueeItems && platformConfig.marqueeItems.length > 0) {
        setCustomMarqueeItems(platformConfig.marqueeItems);
      }
    }
  }, [platformConfig]);

  // Handle URL edit and tab param
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && modpacks.length > 0) {
      const target = modpacks.find(m => m.id === editId || m.slug === editId);
      if (target) {
        openEditForm(target);
      }
    }

    const tabParam = searchParams.get('tab');
    if (tabParam === 'help' || tabParam === 'customizer' || tabParam === 'marquee' || tabParam === 'permissions' || tabParam === 'modpacks' || tabParam === 'credits') {
      setActiveTab(tabParam as any);
    }
  }, [searchParams, modpacks]);

  const handleAddMarqueeItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftLabel.trim()) return;
    sound.playSuccess();
    const newItem: MarqueeItem = {
      id: `item-${Date.now()}`,
      label: draftLabel.trim(),
      status: draftStatus.trim() || 'Active',
      tag: draftTag.trim().toUpperCase() || 'INFO',
      link: draftLink.trim() || undefined,
      color: draftColor,
    };
    setCustomMarqueeItems((prev) => [...prev, newItem]);
    setDraftLabel('');
    setDraftStatus('');
    setDraftTag('ACTIVE');
    setDraftLink('');
  };

  const handleDeleteMarqueeItem = (index: number) => {
    sound.playClick();
    setCustomMarqueeItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveMarqueeItem = (index: number, direction: 'up' | 'down') => {
    sound.playSwitch();
    setCustomMarqueeItems((prev) => {
      const items = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= items.length) return prev;
      const temp = items[index];
      items[index] = items[targetIndex];
      items[targetIndex] = temp;
      return items;
    });
  };

  const handleResetDefaultMarquee = () => {
    sound.playClick();
    setCustomMarqueeLabel('PackOps Live Telemetry');
    setCustomMarqueePing('Cluster Ping: 12ms');
    setCustomMarqueeEnabled(true);
    setCustomMarqueeItems([
      {
        id: 'item-1',
        label: 'Flagship Biohazard Overworld Sync',
        status: 'Fabric 0.16.5 • Release Live',
        tag: 'ACTIVE',
        color: 'emerald',
        link: '/modpack/minecraft-2-biohazard'
      },
      {
        id: 'item-2',
        label: 'Doki Hub Access Control',
        status: 'PBKDF2/SHA-256 • Role Enforced',
        tag: 'SECURE',
        color: 'emerald'
      },
      {
        id: 'item-3',
        label: 'Edge Cluster us-east-1',
        status: '48/48 MicroVMs Ready',
        tag: 'HEALTHY',
        color: 'emerald'
      },
      {
        id: 'item-4',
        label: 'Client Build Distribution',
        status: 'Direct Client Download Ready',
        tag: 'DIRECT',
        color: 'cyan',
        link: '/catalog'
      },
      {
        id: 'item-5',
        label: 'Official Community Hub',
        status: 'Discord & Facebook Live',
        tag: 'ONLINE',
        color: 'indigo',
        link: '/help'
      },
      {
        id: 'item-6',
        label: 'JVM Runtime Target',
        status: 'Java 21 LTS 64-Bit Recommended',
        tag: 'RUNTIME',
        color: 'amber'
      }
    ]);
  };

  const openCreateForm = () => {
    sound.playClick();
    setEditingPack(null);
    setFormTitle('');
    setFormSlug('');
    setFormDescription('');
    setFormLore('');
    setFormThumbnail('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80');
    setFormBanner('');
    setFormMirror('');
    setFormLifecycle('RELEASE');
    setFormPolicy('OPEN_DOWNLOAD');
    setFormReleaseDate(new Date().toISOString().split('T')[0]);
    setFormTrailerUrl('');
    setFormTrailerTitle('');
    setFormMcVersion('1.20.1');
    setFormLoader('Fabric 0.16.5');
    setFormJava('Java 21 LTS');
    setFormMinRam('6 GB');
    setFormRecRam('8 GB');
    setFormMinCpu('Intel Core i5-8400 / AMD Ryzen 5 2600');
    setFormMinGpu('NVIDIA GTX 1060 / AMD RX 580 (4 GB)');
    setFormDiskSpace('12 GB Free SSD Space');
    setFormModsCount(248);
    setFormChangelog('v1.0.0 Initial Stable Release');
    setFormScreenshotsList([]);
    setNewScreenshotUrl('');
    setIsCreatingPack(true);
  };

  const openEditForm = (pack: Modpack) => {
    sound.playClick();
    setEditingPack(pack);
    setIsCreatingPack(false);
    setFormTitle(pack.title);
    setFormSlug(pack.slug);
    setFormDescription(pack.description);
    setFormLore(pack.lore);
    setFormThumbnail(pack.thumbnailUrl || '');
    setFormBanner(pack.bannerUrl || '');
    setFormMirror(pack.downloadMirror || '');
    setFormLifecycle(pack.lifecycle);
    setFormPolicy(pack.lifecycle === 'CLOSED_DEMO' ? 'NEED_PERMISSION' : pack.accessPolicy);
    setFormReleaseDate(pack.releaseDate || '');
    setFormTrailerUrl(pack.trailerUrl || '');
    setFormTrailerTitle(pack.trailerTitle || '');
    setFormMcVersion(pack.specs.minecraftVersion);
    setFormLoader(pack.specs.modLoader);
    setFormJava(pack.specs.javaRuntime);
    setFormMinRam(pack.specs.minRam);
    setFormRecRam(pack.specs.recommendedRam);
    setFormMinCpu(pack.specs.minCpu || 'Intel Core i5-8400 / AMD Ryzen 5 2600');
    setFormMinGpu(pack.specs.minGpu || 'NVIDIA GTX 1060 / AMD RX 580 (4 GB)');
    setFormDiskSpace(pack.specs.diskSpace || '12 GB Free SSD Space');
    setFormModsCount(pack.specs.totalModsCount || 248);
    setFormChangelog(pack.changelog || '');
    setFormScreenshotsList(pack.screenshots ? [...pack.screenshots] : []);
    setNewScreenshotUrl('');
  };

  const closeForm = () => {
    setEditingPack(null);
    setIsCreatingPack(false);
  };

  const handleAddScreenshotUrl = () => {
    if (!newScreenshotUrl.trim()) return;
    sound.playClick();
    setFormScreenshotsList(prev => [...prev, newScreenshotUrl.trim()]);
    setNewScreenshotUrl('');
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    sound.playClick();
    const newShots: string[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const compressed = await compressImage(files[i]);
        newShots.push(compressed);
      } catch {
        const reader = new FileReader();
        await new Promise<void>((resolve) => {
          reader.onload = () => {
            if (typeof reader.result === 'string') newShots.push(reader.result);
            resolve();
          };
          reader.readAsDataURL(files[i]);
        });
      }
    }
    if (newShots.length > 0) {
      setFormScreenshotsList(prev => [...prev, ...newShots]);
      sound.playSuccess();
    }
    e.target.value = '';
  };

  const handleRemoveScreenshot = (index: number) => {
    sound.playClick();
    setFormScreenshotsList(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveScreenshot = (index: number, direction: 'up' | 'down') => {
    sound.playSwitch();
    setFormScreenshotsList(prev => {
      const list = [...prev];
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= list.length) return prev;
      const temp = list[index];
      list[index] = list[target];
      list[target] = temp;
      return list;
    });
  };

  const handleSaveModpack = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();

    const specsPayload = {
      minecraftVersion: formMcVersion,
      modLoader: formLoader,
      javaRuntime: formJava,
      minRam: formMinRam,
      recommendedRam: formRecRam,
      minCpu: formMinCpu,
      minGpu: formMinGpu,
      diskSpace: formDiskSpace,
      totalModsCount: Number(formModsCount) || 240,
    };

    const effectivePolicy = formLifecycle === 'CLOSED_DEMO' ? 'NEED_PERMISSION' : formPolicy;

    if (editingPack) {
      const updateDTO: UpdateModpackDTO = {
        title: formTitle,
        slug: formSlug,
        description: formDescription,
        lore: formLore,
        thumbnailUrl: formThumbnail,
        bannerUrl: formBanner,
        downloadMirror: formMirror,
        lifecycle: formLifecycle,
        accessPolicy: effectivePolicy,
        releaseDate: formReleaseDate,
        trailerUrl: formTrailerUrl,
        trailerTitle: formTrailerTitle,
        specs: specsPayload,
        changelog: formChangelog,
        screenshots: formScreenshotsList,
      };

      const success = await updateModpack(editingPack.id, updateDTO);
      if (success) {
        closeForm();
      }
    } else {
      const createDTO: CreateModpackDTO = {
        title: formTitle,
        slug: formSlug,
        description: formDescription,
        lore: formLore,
        thumbnailUrl: formThumbnail,
        bannerUrl: formBanner,
        downloadMirror: formMirror,
        lifecycle: formLifecycle,
        accessPolicy: effectivePolicy,
        releaseDate: formReleaseDate,
        trailerUrl: formTrailerUrl,
        trailerTitle: formTrailerTitle,
        specs: specsPayload,
        changelog: formChangelog,
        screenshots: formScreenshotsList,
      };

      const success = await createModpack(createDTO);
      if (success) {
        closeForm();
      }
    }
  };

  // FAQ Manager Handlers
  const handleAddOrUpdateFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftFaqQuestion.trim() || !draftFaqAnswer.trim()) return;
    sound.playSuccess();

    if (editingFaqId) {
      setCustomFaqs(prev => prev.map(f => f.id === editingFaqId ? {
        ...f,
        question: draftFaqQuestion.trim(),
        answer: draftFaqAnswer.trim(),
        category: draftFaqCategory.trim() || 'General'
      } : f));
      setEditingFaqId(null);
    } else {
      const newFaq: FAQItem = {
        id: `faq-${Date.now()}`,
        question: draftFaqQuestion.trim(),
        answer: draftFaqAnswer.trim(),
        category: draftFaqCategory.trim() || 'General'
      };
      setCustomFaqs(prev => [...prev, newFaq]);
    }

    setDraftFaqQuestion('');
    setDraftFaqAnswer('');
  };

  const handleEditFaq = (faq: FAQItem) => {
    sound.playClick();
    setEditingFaqId(faq.id);
    setDraftFaqQuestion(faq.question);
    setDraftFaqAnswer(faq.answer);
    setDraftFaqCategory(faq.category || 'General');
  };

  const handleDeleteFaq = (id: string) => {
    sound.playClick();
    setCustomFaqs(prev => prev.filter(f => f.id !== id));
    if (editingFaqId === id) {
      setEditingFaqId(null);
      setDraftFaqQuestion('');
      setDraftFaqAnswer('');
    }
  };

  const handleMoveFaq = (index: number, direction: 'up' | 'down') => {
    sound.playSwitch();
    setCustomFaqs(prev => {
      const items = [...prev];
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= items.length) return prev;
      const tmp = items[index];
      items[index] = items[target];
      items[target] = tmp;
      return items;
    });
  };

  const handleSaveCustomizer = async () => {
    sound.playSuccess();
    const ok = await updatePlatformConfig({
      siteTitle: customSiteTitle,
      heroHeadline: customHeroHeadline,
      heroSubtitle: customHeroSubtitle,
      heroTagline: customHeroTagline,
      announcementText: customAnnouncementText,
      announcementUrl: customAnnouncementUrl,
      featuredModpackId: customFeaturedId,
      aboutDokiCopy: customAboutCopy,
      footerCopy: customFooterCopy,
      emergencySystemLock: customLock,
      helpTitle: customHelpTitle,
      helpSubtitle: customHelpSubtitle,
      helpDiscordUrl: customHelpDiscordUrl,
      helpFacebookUrl: customHelpFacebookUrl,
      helpCustomUrl: customHelpCustomUrl,
      helpCustomLabel: customHelpCustomLabel,
      helpImageUrl: customHelpImageUrl,
      helpContent: customHelpContent,
      helpContactEmail: customHelpContactEmail,
      faqs: customFaqs,
      creditsTitle: customCreditsTitle,
      creditsSubtitle: customCreditsSubtitle,
      creditsLastUpdated: customCreditsLastUpdated,
      creditsContent: customCreditsContent,
      marqueeEnabled: customMarqueeEnabled,
      marqueeLabel: customMarqueeLabel,
      marqueePingText: customMarqueePing,
      marqueeItems: customMarqueeItems,
    });
    if (ok) {
      setIsSavedCustomizer(true);
      setTimeout(() => setIsSavedCustomizer(false), 2500);
    }
  };

  // Cloud Database Handlers
  const handleTestCloudConnection = async () => {
    sound.playClick();
    setIsTestingCloud(true);
    setTestResult(null);
    const res = await testCloudConnection({ url: cloudUrl, anonKey: cloudKey });
    setIsTestingCloud(false);
    setTestResult(res);
    if (res.success) {
      sound.playSuccess();
    } else {
      sound.playFault();
    }
  };

  const handleSaveCloud = () => {
    sound.playClick();
    saveCloudConfig(cloudUrl, cloudKey);
    setTestResult({ success: true, message: 'Cloud configuration saved and active!' });
    sound.playSuccess();
  };

  const handleDisconnectCloud = () => {
    sound.playClick();
    saveCloudConfig('', '');
    setCloudUrl('');
    setCloudKey('');
    setTestResult(null);
  };

  const handleSyncToCloudNow = async () => {
    sound.playClick();
    setIsSyncingCloud(true);
    await syncToCloud();
    setIsSyncingCloud(false);
  };

  const handleCopySeed = () => {
    sound.playClick();
    const seedExport = {
      exportedAt: new Date().toISOString(),
      modpacks,
      platformConfig
    };
    navigator.clipboard.writeText(JSON.stringify(seedExport, null, 2));
    setCopiedSeed(true);
    setTimeout(() => setCopiedSeed(false), 2500);
  };

  const handleDownloadSeed = () => {
    sound.playClick();
    const seedExport = {
      exportedAt: new Date().toISOString(),
      modpacks,
      platformConfig
    };
    const blob = new Blob([JSON.stringify(seedExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doki-modpacks-hub-seed-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sqlSetupSnippet = `-- Supabase Table Setup for Doki's Modpacks Hub
create table if not exists app_storage (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS and public read/write access for anonymous client
alter table app_storage enable row level security;
create policy "Public Access" on app_storage for all using (true);`;

  const handleCopySql = () => {
    sound.playClick();
    navigator.clipboard.writeText(sqlSetupSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // If not logged in as Admin, show Root Authentication Prompt
  if (!isAdmin) {
    return (
      <div className="pt-28 pb-32 max-w-xl mx-auto px-4">
        <div className="rounded-3xl bg-zinc-950/80 border border-white/[0.08] p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
          <BorderBeam size={220} duration={12} />

          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-sans font-bold text-white tracking-tight">
              Super Admin Authentication Required
            </h1>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Restricted control console. Please authenticate with administrator credentials to manage modpack lifecycles, thumbnails, technical requirements, and custom page parameters.
            </p>
          </div>

          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              await login(loginUsername, loginPassword);
            }} 
            className="space-y-4 text-left"
          >
            <div>
              <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">Handle</label>
              <input
                type="text"
                required
                placeholder="Enter administrator handle..."
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-900/30"
            >
              Authenticate as Administrator
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Admin Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight">
              Doki&apos;s Super Admin Control Center
            </h1>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
              ROOT: doki
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Full platform authority: Modpack specifications, thumbnail assets, hardware requirements, and live page customization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/catalog"
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-mono text-zinc-300 flex items-center gap-1.5 transition-colors"
          >
            <span>View Public Catalog</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={openCreateForm}
            className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-lg hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Modpack</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 text-xs font-mono">
        <button
          onClick={() => {
            sound.playSwitch();
            setActiveTab('modpacks');
          }}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'modpacks'
              ? 'bg-zinc-900 text-white border border-white/15 font-bold shadow-lg'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
          }`}
        >
          <Package className="w-4 h-4 text-emerald-400" />
          <span>Modpack CRUD & Specs ({modpacks.length})</span>
        </button>

        <button
          onClick={() => {
            sound.playSwitch();
            setActiveTab('customizer');
          }}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'customizer'
              ? 'bg-zinc-900 text-white border border-white/15 font-bold shadow-lg'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
          }`}
        >
          <Sliders className="w-4 h-4 text-brand-light" />
          <span>Page & Platform Customizer</span>
        </button>

        <button
          onClick={() => {
            sound.playSwitch();
            setActiveTab('marquee');
          }}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'marquee'
              ? 'bg-zinc-900 text-white border border-white/15 font-bold shadow-lg'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
          }`}
        >
          <Radio className="w-4 h-4 text-emerald-400" />
          <span>Top Information Bar ({customMarqueeItems.length})</span>
        </button>

        <button
          onClick={() => {
            sound.playSwitch();
            setActiveTab('help');
          }}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'help'
              ? 'bg-zinc-900 text-white border border-white/15 font-bold shadow-lg'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
          }`}
        >
          <LifeBuoy className="w-4 h-4 text-[#5865F2]" />
          <span>Get Help & FAQs</span>
        </button>

        <button
          onClick={() => {
            sound.playSwitch();
            setActiveTab('credits');
          }}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'credits'
              ? 'bg-zinc-900 text-white border border-white/15 font-bold shadow-lg'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-brand-light" />
          <span>Credits Page Customizer</span>
        </button>

        <button
          onClick={() => {
            sound.playSwitch();
            setActiveTab('permissions');
          }}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'permissions'
              ? 'bg-zinc-900 text-white border border-white/15 font-bold shadow-lg'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
          }`}
        >
          <Lock className="w-4 h-4 text-indigo-400" />
          <span>Access Requests ({pendingRequests.filter(r => r.status === 'PENDING').length})</span>
        </button>

        <button
          onClick={() => {
            sound.playSwitch();
            setActiveTab('database');
          }}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'database'
              ? 'bg-zinc-900 text-white border border-white/15 font-bold shadow-lg'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
          }`}
        >
          <Database className="w-4 h-4 text-cyan-400" />
          <span>Cloud Database (Vercel Sync)</span>
        </button>
      </div>

      {/* TAB 1: MODPACK CRUD & SPECS */}
      {activeTab === 'modpacks' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Modpacks Table / List */}
          <div className="grid grid-cols-1 gap-4">
            {modpacks.map((pack) => (
              <div 
                key={pack.id}
                className="p-5 rounded-2xl bg-zinc-950/70 border border-white/[0.08] hover:border-white/20 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl"
              >
                {/* Pack Thumbnail & Metadata */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                    {pack.thumbnailUrl ? (
                      <img src={pack.thumbnailUrl} alt={pack.title} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-7 h-7 text-brand-light" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-sans font-bold text-white">{pack.title}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-white/10">
                        {pack.slug}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand/10 text-brand-light border border-brand/30">
                        {pack.lifecycle}
                      </span>
                      {pack.isQuarantined && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1 font-bold animate-pulse">
                          <AlertTriangle className="w-3 h-3" /> QUARANTINED
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                      <span>MC: <strong className="text-zinc-200">{pack.specs.minecraftVersion}</strong></span>
                      <span>•</span>
                      <span>Loader: <strong className="text-zinc-200">{pack.specs.modLoader}</strong></span>
                      <span>•</span>
                      <span>RAM: <strong className="text-emerald-400">{pack.specs.recommendedRam}</strong></span>
                      <span>•</span>
                      <span>CPU: <strong className="text-zinc-200">{pack.specs.minCpu || 'Standard'}</strong></span>
                      <span>•</span>
                      <span>Policy: <strong className="text-indigo-400">{pack.accessPolicy}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Controls */}
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <Link
                    to={`/modpack/${pack.slug}`}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-mono text-zinc-300 transition-colors flex items-center gap-1"
                  >
                    <span>View Page</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </Link>

                  <button
                    onClick={() => openEditForm(pack)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit Specs & Assets</span>
                  </button>

                  <button
                    onClick={() => toggleEmergencyQuarantine(pack.id, pack.isQuarantined)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                      pack.isQuarantined
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/40'
                        : 'bg-zinc-900 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-300 border border-white/10'
                    }`}
                    title="Toggle Emergency Quarantine to halt or restore public downloads"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{pack.isQuarantined ? 'Quarantine Active' : 'Halt (Quarantine)'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to permanently delete '${pack.title}'?`)) {
                        deleteModpack(pack.id);
                      }
                    }}
                    className="p-2 rounded-lg bg-zinc-900 hover:bg-rose-900/60 text-zinc-500 hover:text-rose-200 transition-colors cursor-pointer"
                    title="Delete Modpack"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: PAGE & PLATFORM DEEP CUSTOMIZER */}
      {activeTab === 'customizer' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-sans font-bold text-white">Live Platform & Page Customizer</h2>
              <p className="text-xs text-zinc-400">
                Instantly modify headlines, titles, announcement bars, hero modpack, and official narrative copy across all pages.
              </p>
            </div>

            <button
              onClick={handleSaveCustomizer}
              className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-xl hover:scale-[1.02] cursor-pointer"
            >
              {isSavedCustomizer ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{isSavedCustomizer ? 'Configuration Saved!' : 'Save Page Customization'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Branding & Titles */}
            <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-brand-light font-bold flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>Branding & Navigation</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Global Site Title</label>
                  <input
                    type="text"
                    value={customSiteTitle}
                    onChange={(e) => setCustomSiteTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Footer Attribution Copy</label>
                  <input
                    type="text"
                    value={customFooterCopy}
                    onChange={(e) => setCustomFooterCopy(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-brand"
                  />
                  <span className="text-[10px] font-mono text-zinc-500 mt-1 block">e.g. &quot;A member of PackOps&quot;</span>
                </div>
              </div>
            </div>

            {/* Announcement Banner */}
            <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Homepage Top Announcement Banner</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Announcement Pill Text</label>
                  <input
                    type="text"
                    value={customAnnouncementText}
                    onChange={(e) => setCustomAnnouncementText(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Announcement Click Target URL</label>
                  <input
                    type="text"
                    value={customAnnouncementUrl}
                    onChange={(e) => setCustomAnnouncementUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-brand"
                  />
                </div>
              </div>
            </div>

            {/* Hero Showcase Customizer */}
            <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Hero Banner Headline & Featured Pack</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Featured Hero Modpack</label>
                  <select
                    value={customFeaturedId}
                    onChange={(e) => setCustomFeaturedId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none"
                  >
                    {modpacks.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title} ({m.slug}) - [{m.lifecycle}]
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Hero Main Headline</label>
                  <input
                    type="text"
                    value={customHeroHeadline}
                    onChange={(e) => setCustomHeroHeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Hero Subtitle</label>
                  <input
                    type="text"
                    value={customHeroSubtitle}
                    onChange={(e) => setCustomHeroSubtitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Hero Tagline Badge</label>
                  <input
                    type="text"
                    value={customHeroTagline}
                    onChange={(e) => setCustomHeroTagline(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-brand"
                  />
                </div>
              </div>
            </div>

            {/* Official About Doki Narrative */}
            <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Official &quot;About Doki&quot; Platform Narrative</span>
              </h3>

              <div className="space-y-3">
                <p className="text-[11px] text-zinc-400">
                  This narrative appears on the dedicated <Link to="/about" className="text-brand-light underline">/about</Link> page and on public onboarding guides.
                </p>
                <textarea
                  rows={8}
                  value={customAboutCopy}
                  onChange={(e) => setCustomAboutCopy(e.target.value)}
                  className="w-full p-3 rounded-lg bg-black border border-white/10 text-xs text-zinc-200 leading-relaxed font-sans focus:outline-none focus:border-brand"
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB: TOP INFORMATION BAR CUSTOMIZER */}
      {activeTab === 'marquee' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-sans font-bold text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-emerald-400" />
                <span>Top Information Bar & Live Telemetry Customizer</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Configure the persistent live ticker displayed at the very top of every page. Toggle visibility, edit telemetry tags, and link directly to modpacks or guides.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetDefaultMarquee}
                className="px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <button
                type="button"
                onClick={handleSaveCustomizer}
                className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-xl hover:scale-[1.02] cursor-pointer"
              >
                {isSavedCustomizer ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
                <span>{isSavedCustomizer ? 'Configuration Saved!' : 'Save Bar Configuration'}</span>
              </button>
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/[0.1] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Interactive Preview</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                Status: {customMarqueeEnabled ? 'Visible on site' : 'Hidden by Admin'}
              </span>
            </div>

            {customMarqueeEnabled ? (
              <div className="w-full bg-[#08090C] border border-white/10 rounded-xl overflow-hidden py-2 px-3 flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-emerald-400 shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-[11px] text-zinc-200">{customMarqueeLabel}</span>
                  <span className="text-[10px] text-zinc-500">• {customMarqueePing}</span>
                </div>
                <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1">
                  {customMarqueeItems.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="px-3 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] flex items-center gap-2 shrink-0 text-[11px]"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        item.color === 'cyan' ? 'bg-cyan-400' :
                        item.color === 'amber' ? 'bg-amber-400' :
                        item.color === 'indigo' ? 'bg-indigo-400' :
                        item.color === 'rose' ? 'bg-rose-400' :
                        item.color === 'violet' ? 'bg-purple-400' :
                        'bg-emerald-400'
                      }`} />
                      <span className="text-zinc-300">{item.label}</span>
                      <span className="text-zinc-500 text-[10px]">{item.status}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded border font-bold uppercase ${
                        item.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' :
                        item.color === 'amber' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' :
                        item.color === 'indigo' ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' :
                        item.color === 'rose' ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' :
                        item.color === 'violet' ? 'bg-purple-500/10 text-purple-300 border-purple-500/20' :
                        'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      }`}>
                        {item.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 text-center text-xs font-mono text-zinc-500">
                Top bar is currently hidden. Toggle &quot;Show Top Bar&quot; below to display.
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* General Settings */}
            <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-5">
              <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                <span>General Bar Settings</span>
              </h3>

              <div className="space-y-4">
                {/* Visibility Toggle */}
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/10 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-mono font-bold text-white block">Bar Visibility</span>
                    <span className="text-[11px] text-zinc-400 block">
                      {customMarqueeEnabled ? 'Visible across all site pages' : 'Hidden from all users'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playSwitch();
                      setCustomMarqueeEnabled(!customMarqueeEnabled);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      customMarqueeEnabled
                        ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-900/30'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {customMarqueeEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{customMarqueeEnabled ? 'Enabled' : 'Disabled'}</span>
                  </button>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Prefix / Brand Label</label>
                  <input
                    type="text"
                    value={customMarqueeLabel}
                    onChange={(e) => setCustomMarqueeLabel(e.target.value)}
                    placeholder="e.g. PackOps Live Telemetry"
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-brand"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">Displayed in the left fixed badge of the ticker.</p>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Status / Ping Badge</label>
                  <input
                    type="text"
                    value={customMarqueePing}
                    onChange={(e) => setCustomMarqueePing(e.target.value)}
                    placeholder="e.g. Cluster Ping: 12ms"
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-brand"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">Subtext beside the prefix label (cluster ping, version, or status).</p>
                </div>
              </div>
            </div>

            {/* Existing Items Manager */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
                  <Radio className="w-4 h-4" />
                  <span>Configured Ticker Feeds ({customMarqueeItems.length})</span>
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">Reorder with arrows or delete</span>
              </div>

              {customMarqueeItems.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-zinc-900/50 border border-white/5 text-xs font-mono text-zinc-500">
                  No items configured. Add one below or click &quot;Reset Defaults&quot;.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {customMarqueeItems.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="p-3.5 rounded-xl bg-black border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-3 text-xs font-mono"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveMarqueeItem(index, 'up')}
                            className="p-1 rounded text-zinc-500 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={index === customMarqueeItems.length - 1}
                            onClick={() => handleMoveMarqueeItem(index, 'down')}
                            className="p-1 rounded text-zinc-500 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${
                          item.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' :
                          item.color === 'amber' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                          item.color === 'indigo' ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' :
                          item.color === 'rose' ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' :
                          item.color === 'violet' ? 'bg-purple-500/10 text-purple-300 border-purple-500/30' :
                          'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {item.tag}
                        </span>

                        <div className="min-w-0">
                          <div className="text-white font-medium truncate">{item.label}</div>
                          <div className="text-[10px] text-zinc-400 truncate flex items-center gap-2">
                            <span>{item.status}</span>
                            {item.link && (
                              <span className="text-brand-light flex items-center gap-0.5">
                                <ExternalLink className="w-2.5 h-2.5" />
                                {item.link}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteMarqueeItem(index)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Item Form */}
              <form onSubmit={handleAddMarqueeItem} className="pt-4 border-t border-white/[0.08] space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Add New Ticker Item</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Headline / Label *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Next Major Update v1.1"
                      value={draftLabel}
                      onChange={(e) => setDraftLabel(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Status / Subtext</label>
                    <input
                      type="text"
                      placeholder="e.g. Scheduled for Oct 25"
                      value={draftStatus}
                      onChange={(e) => setDraftStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Badge Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. NOTICE, LIVE, HOT"
                      value={draftTag}
                      onChange={(e) => setDraftTag(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-brand uppercase"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Destination Link (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. /modpack/minecraft-2-biohazard"
                      value={draftLink}
                      onChange={(e) => setDraftLink(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                {/* Color Selector */}
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1.5">Badge Accent Color</label>
                  <div className="flex flex-wrap items-center gap-2">
                    {(['emerald', 'cyan', 'amber', 'indigo', 'rose', 'violet'] as const).map((colorKey) => (
                      <button
                        key={colorKey}
                        type="button"
                        onClick={() => setDraftColor(colorKey)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-medium capitalize border transition-all cursor-pointer ${
                          draftColor === colorKey
                            ? 'bg-white/10 border-white text-white shadow-md'
                            : 'bg-black/50 border-white/10 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                          colorKey === 'cyan' ? 'bg-cyan-400' :
                          colorKey === 'amber' ? 'bg-amber-400' :
                          colorKey === 'indigo' ? 'bg-indigo-400' :
                          colorKey === 'rose' ? 'bg-rose-400' :
                          colorKey === 'violet' ? 'bg-purple-400' :
                          'bg-emerald-400'
                        }`} />
                        {colorKey}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-mono font-bold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Add Feed Item to Ticker</span>
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: GET HELP PAGE CUSTOMIZER */}
      {activeTab === 'help' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-sans font-bold text-white flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-[#5865F2]" />
                <span>Get Help & Community Page Customizer</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Update community Discord/Facebook links, upload or edit banner images, and modify troubleshooting instructions.
              </p>
            </div>

            <button
              onClick={handleSaveCustomizer}
              className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-xl hover:scale-[1.02] cursor-pointer"
            >
              {isSavedCustomizer ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{isSavedCustomizer ? 'Configuration Saved!' : 'Save Help Page Customization'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Community Links */}
            <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold flex items-center gap-2">
                <Discord className="w-4 h-4" />
                <span>Official Community URLs</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Discord Server Invite URL</label>
                  <input
                    type="text"
                    value={customHelpDiscordUrl}
                    onChange={(e) => setCustomHelpDiscordUrl(e.target.value)}
                    placeholder="https://discord.gg/..."
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-[#5865F2]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Facebook Page / Group URL</label>
                  <input
                    type="text"
                    value={customHelpFacebookUrl}
                    onChange={(e) => setCustomHelpFacebookUrl(e.target.value)}
                    placeholder="https://facebook.com/groups/..."
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-[#1877F2]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Custom Link Label</label>
                    <input
                      type="text"
                      value={customHelpCustomLabel}
                      onChange={(e) => setCustomHelpCustomLabel(e.target.value)}
                      placeholder="e.g. GitHub Issue Tracker"
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Custom Link Target URL</label>
                    <input
                      type="text"
                      value={customHelpCustomUrl}
                      onChange={(e) => setCustomHelpCustomUrl(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Support Contact Email</label>
                  <input
                    type="text"
                    value={customHelpContactEmail}
                    onChange={(e) => setCustomHelpContactEmail(e.target.value)}
                    placeholder="support@..."
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Banner & Headings */}
            <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-2">
                <Image className="w-4 h-4" />
                <span>Page Headings & Visual Banner</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Help Page Main Title</label>
                  <input
                    type="text"
                    value={customHelpTitle}
                    onChange={(e) => setCustomHelpTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Help Page Subtitle</label>
                  <input
                    type="text"
                    value={customHelpSubtitle}
                    onChange={(e) => setCustomHelpSubtitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Banner Image URL or File Upload</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customHelpImageUrl}
                      onChange={(e) => setCustomHelpImageUrl(e.target.value)}
                      placeholder="Paste image URL..."
                      className="flex-1 px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none"
                    />
                    <label className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-mono text-zinc-300 cursor-pointer transition-colors flex items-center gap-1.5 shrink-0">
                      <Image className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, setCustomHelpImageUrl);
                        }} 
                      />
                    </label>
                  </div>
                </div>

                {/* Banner Preview */}
                {customHelpImageUrl && (
                  <div className="rounded-xl overflow-hidden border border-white/10 h-32 relative">
                    <img 
                      src={customHelpImageUrl} 
                      alt="Help Banner Preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => (e.target as HTMLElement).style.display = 'none'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                      <span className="text-[10px] font-mono text-zinc-300">Live Banner Preview</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* FAQ Manager */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/30 flex items-center justify-center text-brand-light">
                    <MessageCircleQuestion className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-sans font-bold text-white tracking-tight">
                      Frequently Asked Questions (FAQ) Manager ({customFaqs.length} Items)
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Add, update, reorder, or delete questions displayed in the Help Page FAQ section.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveCustomizer}
                  className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-mono font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save All FAQs</span>
                </button>
              </div>

              {/* Add/Edit FAQ Form */}
              <form onSubmit={handleAddOrUpdateFaq} className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-brand-light font-bold">
                    {editingFaqId ? 'Edit Selected FAQ Item' : 'Add New FAQ Question & Answer'}
                  </span>
                  {editingFaqId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingFaqId(null);
                        setDraftFaqQuestion('');
                        setDraftFaqAnswer('');
                      }}
                      className="text-xs font-mono text-zinc-400 hover:text-white"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Question</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. How much RAM should I allocate?"
                      value={draftFaqQuestion}
                      onChange={(e) => setDraftFaqQuestion(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-brand font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Performance, Installation"
                      value={draftFaqCategory}
                      onChange={(e) => setDraftFaqCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Answer</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide clear technical explanation..."
                    value={draftFaqAnswer}
                    onChange={(e) => setDraftFaqAnswer(e.target.value)}
                    className="w-full p-3 rounded-lg bg-zinc-900 border border-white/10 text-xs text-zinc-200 font-sans leading-relaxed focus:outline-none focus:border-brand"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-brand-light" />
                    <span>{editingFaqId ? 'Update FAQ Entry' : 'Add Question'}</span>
                  </button>
                </div>
              </form>

              {/* Existing FAQs List */}
              <div className="space-y-2">
                {customFaqs.map((faq, idx) => (
                  <div 
                    key={faq.id}
                    className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/[0.06] flex items-start justify-between gap-4 hover:border-white/15 transition-all"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-sans font-bold text-white">{faq.question}</span>
                        {faq.category && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-zinc-400 border border-white/10">
                            {faq.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{faq.answer}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 pt-0.5">
                      <button
                        type="button"
                        onClick={() => handleMoveFaq(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded bg-black border border-white/10 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveFaq(idx, 'down')}
                        disabled={idx === customFaqs.length - 1}
                        className="p-1 rounded bg-black border border-white/10 text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditFaq(faq)}
                        className="p-1 rounded bg-black border border-white/10 text-amber-300 hover:bg-amber-500/20 cursor-pointer ml-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="p-1 rounded bg-black border border-white/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Troubleshooting & Guide Content */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Custom Troubleshooting Guide & Architecture Notes</span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Write setup tips, common crash explanations, Java flags, or custom instructions. Markdown and line-breaks supported.
              </p>
              <textarea
                rows={6}
                value={customHelpContent}
                onChange={(e) => setCustomHelpContent(e.target.value)}
                placeholder="Enter custom troubleshooting instructions, FAQs, or steps..."
                className="w-full p-3 rounded-lg bg-black border border-white/10 text-xs text-zinc-200 font-sans leading-relaxed focus:outline-none focus:border-amber-400"
              />
            </div>

          </div>
        </div>
      )}

      {/* TAB: CREDITS PAGE CUSTOMIZER */}
      {activeTab === 'credits' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-sans font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-light" />
                <span>Credits & Attributions Page Customizer</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Customize titles, dates, mod author recognitions, and community attributions displayed at /credits.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/credits"
                className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-mono text-zinc-300 flex items-center gap-1.5 transition-colors"
              >
                <span>View Public /credits Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={handleSaveCustomizer}
                className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-xl hover:scale-[1.02] cursor-pointer"
              >
                {isSavedCustomizer ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
                <span>{isSavedCustomizer ? 'Configuration Saved!' : 'Save Credits Settings'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Title & Metadata Settings */}
            <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-brand-light font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Page Titles & Header Metadata</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Credits Page Title</label>
                  <input
                    type="text"
                    value={customCreditsTitle}
                    onChange={(e) => setCustomCreditsTitle(e.target.value)}
                    placeholder="Credits & Acknowledgments"
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-brand font-sans font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Subtitle / Mission Statement</label>
                  <textarea
                    rows={2}
                    value={customCreditsSubtitle}
                    onChange={(e) => setCustomCreditsSubtitle(e.target.value)}
                    placeholder="Honoring the mod authors and community contributors..."
                    className="w-full p-2.5 rounded-lg bg-black border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-brand font-sans leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Last Updated String</label>
                  <input
                    type="text"
                    value={customCreditsLastUpdated}
                    onChange={(e) => setCustomCreditsLastUpdated(e.target.value)}
                    placeholder="e.g. October 2026"
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Formatting Guidelines</span>
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Use markdown syntax in the text editor below:
                </p>
                <ul className="text-xs text-zinc-400 space-y-1 font-mono">
                  <li><span className="text-white">### Header</span> for section titles</li>
                  <li><span className="text-white">* **Bold Name** – Description</span> for author credits</li>
                  <li><span className="text-white">---</span> for divider lines</li>
                  <li><span className="text-white">*Italic text*</span> for disclaimer notes</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-brand/10 border border-brand/20 text-[11px] text-brand-light font-mono">
                Changes will take effect instantly across all visitor sessions.
              </div>
            </div>

            {/* Main Credits Content Text Area */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Credits & Attributions Text Content</span>
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">Live Markdown Editor</span>
              </div>

              <textarea
                rows={14}
                value={customCreditsContent}
                onChange={(e) => setCustomCreditsContent(e.target.value)}
                placeholder="Write credits and acknowledgments in text/markdown..."
                className="w-full p-4 rounded-xl bg-black border border-white/10 text-xs text-zinc-200 font-mono leading-relaxed focus:outline-none focus:border-brand"
              />
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: PERMISSION REQUESTS QUEUE */}
      {activeTab === 'permissions' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-sans font-bold text-white">Pending Access Requests</h2>
              <p className="text-xs text-zinc-400">
                Approve or deny community access for modpacks set to NEED_PERMISSION.
              </p>
            </div>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-zinc-950/60 border border-white/[0.06] text-xs font-mono text-zinc-500">
              No pending permission requests at this time.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div 
                  key={req.id}
                  className="p-5 rounded-2xl bg-zinc-950/70 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white">{req.username}</span>
                      <span className="text-[10px] font-mono text-zinc-500">requested access for</span>
                      <span className="text-xs font-mono text-brand-light font-bold">{req.modpackSlug}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        req.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' :
                        req.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 italic">&ldquo;{req.reason}&rdquo;</p>
                  </div>

                  {req.status === 'PENDING' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moderateRequest(req.id, 'APPROVED')}
                        className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-mono font-medium transition-colors cursor-pointer"
                      >
                        Approve Request
                      </button>
                      <button
                        onClick={() => moderateRequest(req.id, 'REJECTED')}
                        className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-mono font-medium transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: CLOUD DATABASE & VERCEL SYNC */}
      {activeTab === 'database' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header Card: Status & Architecture */}
          <div className="p-6 rounded-3xl bg-zinc-950/70 border border-white/[0.08] shadow-2xl relative overflow-hidden space-y-4">
            <BorderBeam size={200} duration={14} />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl border ${
                  cloudUrl && cloudKey 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}>
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-sans font-bold text-white flex items-center gap-2">
                    <span>Cloud Database & Global Sync</span>
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-wider ${
                      cloudUrl && cloudKey
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}>
                      {cloudUrl && cloudKey ? '● Supabase Cloud Active' : '● Local Browser Sandbox (IndexedDB)'}
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Synchronize your custom modpacks, cover thumbnails, FAQs, and credits across all visitors on Vercel worldwide.
                  </p>
                </div>
              </div>

              {/* Quick Sync Button */}
              {cloudUrl && cloudKey && (
                <button
                  type="button"
                  onClick={handleSyncToCloudNow}
                  disabled={isSyncingCloud}
                  className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-xl hover:scale-[1.02] cursor-pointer flex items-center gap-2 shrink-0 disabled:opacity-50"
                >
                  <UploadCloud className={`w-4 h-4 ${isSyncingCloud ? 'animate-bounce' : ''}`} />
                  <span>{isSyncingCloud ? 'Syncing to Cloud...' : 'Push Local Edits to Cloud'}</span>
                </button>
              )}
            </div>

            {/* Architecture Explanation Banner */}
            <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
              cloudUrl && cloudKey
                ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-200'
                : 'bg-amber-950/20 border-amber-500/20 text-amber-200'
            }`}>
              {cloudUrl && cloudKey ? (
                <p>
                  <strong>Global Synchronization Enabled:</strong> Any change you save in this admin panel is automatically written to your Supabase cloud database. All users and devices visiting your Vercel deployment will immediately see the updated thumbnails, modpacks, and content without needing a redeploy!
                </p>
              ) : (
                <p>
                  <strong>Why others can't see your changes yet:</strong> Edits and thumbnail uploads are currently stored in your browser's private local storage (IndexedDB). Since Vercel serves a static frontend without a default database, other users and browsers cannot see your local changes until you connect a free Supabase cloud database below, or export your data into the site seed!
                </p>
              )}
            </div>
          </div>

          {/* Cloud Database Credentials Configuration */}
          <div className="p-6 rounded-3xl bg-zinc-950/70 border border-white/[0.08] shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-sans font-bold text-white">
                  Supabase Cloud Connection Settings
                </h4>
                <p className="text-xs text-zinc-400">
                  Connect your free Supabase project to enable permanent, real-time shared storage across all visitors.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                  Supabase Project URL *
                </label>
                <input
                  type="text"
                  placeholder="https://your-project-id.supabase.co"
                  value={cloudUrl}
                  onChange={(e) => setCloudUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-brand font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                  Supabase Public Anon API Key *
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={cloudKey}
                  onChange={(e) => setCloudKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-brand font-mono"
                />
              </div>
            </div>

            {/* Test Connection Diagnostic Output */}
            {testResult && (
              <div className={`p-4 rounded-2xl border text-xs font-mono space-y-2 ${
                testResult.success 
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' 
                  : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
              }`}>
                <div className="flex items-center gap-2 font-bold">
                  {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                  <span>{testResult.message}</span>
                </div>
                {testResult.tableMissing && (
                  <p className="text-[11px] text-zinc-300 font-sans">
                    Please copy the SQL snippet below, go to your Supabase Dashboard &gt; SQL Editor, paste it and click Run to create the required table.
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleTestCloudConnection}
                disabled={isTestingCloud || !cloudUrl || !cloudKey}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-mono transition-colors cursor-pointer border border-white/10 flex items-center gap-2 disabled:opacity-40"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTestingCloud ? 'animate-spin' : ''}`} />
                <span>{isTestingCloud ? 'Testing Connection...' : 'Test Connection'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveCloud}
                disabled={!cloudUrl || !cloudKey}
                className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-mono font-bold transition-all shadow-lg cursor-pointer flex items-center gap-2 disabled:opacity-40"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save & Activate Cloud Sync</span>
              </button>

              {cloudUrl && (
                <button
                  type="button"
                  onClick={handleDisconnectCloud}
                  className="px-4 py-2.5 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 text-xs font-mono transition-colors cursor-pointer border border-rose-500/20"
                >
                  Disconnect Cloud
                </button>
              )}
            </div>
          </div>

          {/* 60-Second Setup Guide */}
          <div className="p-6 rounded-3xl bg-zinc-950/70 border border-white/[0.08] shadow-2xl space-y-5">
            <h4 className="text-sm font-sans font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-light" />
              <span>Free 60-Second Supabase Setup (Step-by-Step)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-2">
                <span className="w-6 h-6 rounded-full bg-brand/20 text-brand-light border border-brand/30 flex items-center justify-center font-bold text-[11px]">1</span>
                <p className="font-bold text-white font-sans">Create Free Project</p>
                <p className="text-zinc-400 font-sans text-[11px] leading-relaxed">
                  Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-brand-light underline">supabase.com</a>, create a free project (100% free forever, no credit card required).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-2">
                <span className="w-6 h-6 rounded-full bg-brand/20 text-brand-light border border-brand/30 flex items-center justify-center font-bold text-[11px]">2</span>
                <p className="font-bold text-white font-sans">Run SQL Schema</p>
                <p className="text-zinc-400 font-sans text-[11px] leading-relaxed">
                  Open the <strong>SQL Editor</strong> in Supabase, paste the SQL snippet below, and click <strong>Run</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-2">
                <span className="w-6 h-6 rounded-full bg-brand/20 text-brand-light border border-brand/30 flex items-center justify-center font-bold text-[11px]">3</span>
                <p className="font-bold text-white font-sans">Paste Keys & Sync</p>
                <p className="text-zinc-400 font-sans text-[11px] leading-relaxed">
                  In Supabase <strong>Project Settings &gt; API</strong>, copy the Project URL & anon key, paste them above, and click <strong>Push Local Edits</strong>!
                </p>
              </div>
            </div>

            {/* SQL Snippet Block */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>SQL Schema for Table &lsquo;app_storage&rsquo;</span>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-[11px] font-mono border border-white/10 transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3 text-brand-light" />
                  <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Snippet'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-black border border-white/10 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed select-all">
                {sqlSetupSnippet}
              </pre>
            </div>
          </div>

          {/* Zero-Setup Static Seed Export (Alternative) */}
          <div className="p-6 rounded-3xl bg-zinc-950/70 border border-white/[0.08] shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-sans font-bold text-white">
                  Zero-Setup Static Export (Bake Data into Site)
                </h4>
                <p className="text-xs text-zinc-400">
                  Prefer not to create any cloud accounts? You can export your current modpacks and thumbnail updates directly as code or a JSON file.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopySeed}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-mono transition-colors cursor-pointer border border-white/10 flex items-center gap-2"
              >
                <Copy className="w-3.5 h-3.5 text-brand-light" />
                <span>{copiedSeed ? 'Copied Full Catalog JSON!' : 'Copy Catalog as Seed JSON'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadSeed}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-mono transition-colors cursor-pointer border border-white/10 flex items-center gap-2"
              >
                <DownloadCloud className="w-3.5 h-3.5 text-cyan-400" />
                <span>Download doki-seed.json</span>
              </button>
            </div>
          </div>

        </div>
      )}


      {/* DEEP MODPACK EDIT / CREATE MODAL */}
      {(isCreatingPack || editingPack) && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-[#0C0D13] border border-white/10 shadow-2xl flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/[0.08] bg-zinc-950 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-brand/10 border border-brand/30 text-brand-light">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-sans font-bold text-white">
                    {editingPack ? `Edit Modpack: ${editingPack.title}` : 'Create & Register New Modpack'}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Configure technical requirements, thumbnail visuals, lore, and download mirrors.
                  </p>
                </div>
              </div>

              <button
                onClick={closeForm}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveModpack} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-brand-light font-bold">
                  1. Identity & Narrative
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Minecraft 2: Biohazard"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Slug (URL Route) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. minecraft-2-biohazard"
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Short Description</label>
                  <input
                    type="text"
                    placeholder="Brief summary of the modpack adventure"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Lore & Storyline Narrative</label>
                  <textarea
                    rows={3}
                    placeholder="Narrative backstory (e.g. The Ender Dragon has been defeated, but...)"
                    value={formLore}
                    onChange={(e) => setFormLore(e.target.value)}
                    className="w-full p-3 rounded-lg bg-black border border-white/10 text-xs text-white font-sans focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              {/* Visual Assets, Thumbnails & In-Game Screenshots */}
              <div className="space-y-5 pt-4 border-t border-white/[0.08]">
                <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5" />
                  <span>2. Visual Assets & In-Game Screenshots Gallery</span>
                </h4>

                {/* Primary Visuals: Thumbnail & Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Thumbnail (Cover) */}
                  <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-mono text-zinc-300 font-bold">
                        Modpack Thumbnail (Card Cover)
                      </label>
                      {formThumbnail && (
                        <button
                          type="button"
                          onClick={() => setFormThumbnail('')}
                          className="text-[10px] font-mono text-rose-400 hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="https://... or upload image"
                        value={formThumbnail}
                        onChange={(e) => setFormThumbnail(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                      <label className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-mono text-zinc-300 cursor-pointer transition-colors flex items-center gap-1.5 shrink-0">
                        <Image className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Upload</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, setFormThumbnail);
                          }} 
                        />
                      </label>
                    </div>

                    {formThumbnail && (
                      <div className="relative rounded-xl overflow-hidden border border-white/10 h-28 bg-black">
                        <img 
                          src={formThumbnail} 
                          alt="Thumbnail Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                          <span className="text-[10px] font-mono text-zinc-300">Live Cover Preview</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Banner (Hero / Detail Top Header) */}
                  <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-mono text-zinc-300 font-bold">
                        Hero Banner (Header Background)
                      </label>
                      {formBanner && (
                        <button
                          type="button"
                          onClick={() => setFormBanner('')}
                          className="text-[10px] font-mono text-rose-400 hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="https://... or upload banner"
                        value={formBanner}
                        onChange={(e) => setFormBanner(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                      <label className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-mono text-zinc-300 cursor-pointer transition-colors flex items-center gap-1.5 shrink-0">
                        <Image className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Upload</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, setFormBanner);
                          }} 
                        />
                      </label>
                    </div>

                    {formBanner && (
                      <div className="relative rounded-xl overflow-hidden border border-white/10 h-28 bg-black">
                        <img 
                          src={formBanner} 
                          alt="Banner Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                          <span className="text-[10px] font-mono text-zinc-300">Live Banner Preview</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* IN-GAME VISUAL TRANSMISSIONS (SCREENSHOTS GALLERY) */}
                <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/[0.08] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
                    <div>
                      <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <span>In-Game Visual Transmissions</span>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px]">
                          {formScreenshotsList.length} Screenshots
                        </span>
                      </h5>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        These images display under the &ldquo;In-Game Visual Transmissions&rdquo; gallery on the modpack detail page.
                      </p>
                    </div>

                    {/* Batch Upload Button */}
                    <label className="px-3.5 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-mono font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 shrink-0">
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload Screenshots</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        className="hidden" 
                        onChange={handleScreenshotUpload} 
                      />
                    </label>
                  </div>

                  {/* Add URL Row */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Or paste screenshot image URL (https://...)"
                      value={newScreenshotUrl}
                      onChange={(e) => setNewScreenshotUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddScreenshotUrl();
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-brand font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddScreenshotUrl}
                      disabled={!newScreenshotUrl.trim()}
                      className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-zinc-200 text-xs font-mono border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 text-brand-light" />
                      <span>Add URL</span>
                    </button>
                  </div>

                  {/* Screenshots Grid Display */}
                  {formScreenshotsList.length === 0 ? (
                    <div className="p-8 rounded-xl border border-dashed border-white/10 text-center space-y-2">
                      <Image className="w-8 h-8 text-zinc-600 mx-auto" />
                      <p className="text-xs text-zinc-400 font-mono">No in-game screenshots attached yet.</p>
                      <p className="text-[11px] text-zinc-500">
                        Click &ldquo;Upload Screenshots&rdquo; to select files from your computer, or paste image URLs above.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {formScreenshotsList.map((shot, idx) => (
                        <div key={idx} className="group relative rounded-xl overflow-hidden border border-white/10 bg-black aspect-video flex flex-col justify-between">
                          <img 
                            src={shot} 
                            alt={`Screenshot ${idx + 1}`} 
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          
                          {/* Overlay Controls */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/80 text-white border border-white/10">
                                #{idx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveScreenshot(idx)}
                                className="p-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                                title="Remove screenshot"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-1 self-end">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveScreenshot(idx, 'up')}
                                  className="p-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-[10px] font-mono"
                                  title="Move earlier"
                                >
                                  ←
                                </button>
                              )}
                              {idx < formScreenshotsList.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveScreenshot(idx, 'down')}
                                  className="p-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-[10px] font-mono"
                                  title="Move later"
                                >
                                  →
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* System Requirements & Engine */}
              <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>3. System Requirements & Hardware Specs</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Minecraft Version</label>
                    <input
                      type="text"
                      value={formMcVersion}
                      onChange={(e) => setFormMcVersion(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Mod Loader</label>
                    <input
                      type="text"
                      value={formLoader}
                      onChange={(e) => setFormLoader(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Java Runtime</label>
                    <input
                      type="text"
                      value={formJava}
                      onChange={(e) => setFormJava(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Minimum RAM</label>
                    <input
                      type="text"
                      value={formMinRam}
                      onChange={(e) => setFormMinRam(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Recommended RAM</label>
                    <input
                      type="text"
                      value={formRecRam}
                      onChange={(e) => setFormRecRam(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Disk Space</label>
                    <input
                      type="text"
                      value={formDiskSpace}
                      onChange={(e) => setFormDiskSpace(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Minimum CPU</label>
                    <input
                      type="text"
                      value={formMinCpu}
                      onChange={(e) => setFormMinCpu(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Minimum GPU</label>
                    <input
                      type="text"
                      value={formMinGpu}
                      onChange={(e) => setFormMinGpu(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Policy, Lifecycle, Release Date, Trailer & Download Link */}
              <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
                  4. Lifecycle, Release Date, Trailer & Direct Download Link
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Lifecycle State</label>
                    <select
                      value={formLifecycle}
                      onChange={(e) => {
                        const val = e.target.value as ModpackLifecycle;
                        setFormLifecycle(val);
                        if (val === 'CLOSED_DEMO') {
                          setFormPolicy('NEED_PERMISSION');
                        }
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none"
                    >
                      <option value="RELEASE">RELEASE</option>
                      <option value="DEMO">DEMO</option>
                      <option value="CLOSED_DEMO">CLOSED DEMO (Permission Only)</option>
                      <option value="COMING_SOON">COMING SOON</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                      Access Policy {formLifecycle === 'CLOSED_DEMO' ? '(Locked: Permission Required)' : ''}
                    </label>
                    <select
                      value={formPolicy}
                      onChange={(e) => setFormPolicy(e.target.value as AccessPolicy)}
                      disabled={formLifecycle === 'CLOSED_DEMO'}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none disabled:opacity-50"
                    >
                      <option value="OPEN_DOWNLOAD">OPEN_DOWNLOAD (Public)</option>
                      <option value="NEED_PERMISSION">NEED_PERMISSION (Requires Review)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                      {formLifecycle === 'COMING_SOON' ? 'Expected Release Date' : 'Official Release Date'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2026-11-15 or November 2026"
                      value={formReleaseDate}
                      onChange={(e) => setFormReleaseDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Cinematic Video Trailer Section */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
                    <Film className="w-3.5 h-3.5" />
                    <span>Official Cinematic Trailer (YouTube / Video URL)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono text-zinc-400 block mb-1">Trailer Video URL</label>
                      <input
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=... or .mp4 URL"
                        value={formTrailerUrl}
                        onChange={(e) => setFormTrailerUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-zinc-400 block mb-1">Trailer Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Official Cinematic Reveal Trailer"
                        value={formTrailerTitle}
                        onChange={(e) => setFormTrailerTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Direct Modpack Download Link URL</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={formMirror}
                      onChange={(e) => setFormMirror(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Total Mods Count</label>
                    <input
                      type="number"
                      value={formModsCount}
                      onChange={(e) => setFormModsCount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Changelog & Release Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Enter version patch notes..."
                    value={formChangelog}
                    onChange={(e) => setFormChangelog(e.target.value)}
                    className="w-full p-3 rounded-lg bg-black border border-white/10 text-xs text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="sticky bottom-0 bg-[#0C0D13]/95 backdrop-blur-md pt-4 pb-2 border-t border-white/[0.08] flex items-center justify-end gap-3 z-10">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono transition-colors cursor-pointer border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-xl hover:scale-[1.02] cursor-pointer"
                >
                  {editingPack ? 'Update Modpack Specs' : 'Commit New Modpack'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

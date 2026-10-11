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
  Disc as Discord
} from 'lucide-react';
import { useDoki } from '../context/DokiContext';
import { Modpack, ModpackLifecycle, AccessPolicy, CreateModpackDTO, UpdateModpackDTO, MarqueeItem } from '../backend/types';
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
    setIsEditingModpack
  } = useDoki();

  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'modpacks' | 'customizer' | 'marquee' | 'help' | 'permissions'>('modpacks');

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
  const [formScreenshots, setFormScreenshots] = useState('');

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
      label: 'Client Build Mirror',
      status: 'Google Drive Direct Sync Ready',
      tag: 'MIRROR',
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

  // Draft new marquee item
  const [draftLabel, setDraftLabel] = useState('');
  const [draftStatus, setDraftStatus] = useState('');
  const [draftTag, setDraftTag] = useState('ACTIVE');
  const [draftLink, setDraftLink] = useState('');
  const [draftColor, setDraftColor] = useState<'emerald' | 'cyan' | 'amber' | 'indigo' | 'rose' | 'violet'>('emerald');

  const [isSavedCustomizer, setIsSavedCustomizer] = useState(false);

  // Image Upload helper (file to base64 Data URL)
  const handleImageUpload = (file: File, callback: (result: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        callback(reader.result);
        sound.playSuccess();
      }
    };
    reader.readAsDataURL(file);
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
    if (tabParam === 'help' || tabParam === 'customizer' || tabParam === 'marquee' || tabParam === 'permissions' || tabParam === 'modpacks') {
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
        label: 'Client Build Mirror',
        status: 'Google Drive Direct Sync Ready',
        tag: 'MIRROR',
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
    setFormMirror('https://drive.google.com');
    setFormLifecycle('RELEASE');
    setFormPolicy('OPEN_DOWNLOAD');
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
    setFormScreenshots('');
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
    setFormPolicy(pack.accessPolicy);
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
    setFormScreenshots(pack.screenshots ? pack.screenshots.join('\n') : '');
  };

  const closeForm = () => {
    setEditingPack(null);
    setIsCreatingPack(false);
  };

  const handleSaveModpack = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();

    const parsedScreenshots = formScreenshots
      ? formScreenshots.split('\n').map(s => s.trim()).filter(Boolean)
      : [];

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
        accessPolicy: formPolicy,
        specs: specsPayload,
        changelog: formChangelog,
        screenshots: parsedScreenshots,
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
        accessPolicy: formPolicy,
        specs: specsPayload,
        changelog: formChangelog,
        screenshots: parsedScreenshots,
      };

      const success = await createModpack(createDTO);
      if (success) {
        closeForm();
      }
    }
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
          <span>Get Help Page Customizer</span>
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

            {/* Troubleshooting & Guide Content */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Custom Troubleshooting Guides & FAQ Content</span>
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

              {/* Visual Assets & Thumbnails */}
              <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5" />
                  <span>2. Visual Assets & Thumbnail Preview</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Thumbnail URL</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={formThumbnail}
                      onChange={(e) => setFormThumbnail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Banner URL</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={formBanner}
                      onChange={(e) => setFormBanner(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Live Thumbnail Preview */}
                {formThumbnail && (
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-zinc-900/50 border border-white/10">
                    <img 
                      src={formThumbnail} 
                      alt="Thumbnail Preview" 
                      className="w-16 h-16 rounded-lg object-cover border border-white/10"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="text-xs text-zinc-400">
                      <span className="font-semibold text-white block">Visual Asset Loaded</span>
                      This cover will display on the home hero, catalog cards, and detail page.
                    </div>
                  </div>
                )}
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

              {/* Policy, Lifecycle & Mirror */}
              <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
                  4. Lifecycle, Download Mirror & Access Policy
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Lifecycle State</label>
                    <select
                      value={formLifecycle}
                      onChange={(e) => setFormLifecycle(e.target.value as ModpackLifecycle)}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none"
                    >
                      <option value="TEASER">TEASER</option>
                      <option value="UPCOMING">UPCOMING</option>
                      <option value="BETA">BETA</option>
                      <option value="RELEASE">RELEASE</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Access Policy</label>
                    <select
                      value={formPolicy}
                      onChange={(e) => setFormPolicy(e.target.value as AccessPolicy)}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none"
                    >
                      <option value="OPEN_DOWNLOAD">OPEN_DOWNLOAD (Public)</option>
                      <option value="NEED_PERMISSION">NEED_PERMISSION (Requires Review)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Total Mods Count</label>
                    <input
                      type="number"
                      value={formModsCount}
                      onChange={(e) => setFormModsCount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Download Mirror URL (Google Drive, S3, etc.)</label>
                  <input
                    type="text"
                    value={formMirror}
                    onChange={(e) => setFormMirror(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none"
                  />
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

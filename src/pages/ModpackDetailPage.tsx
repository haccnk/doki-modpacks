import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Download, 
  Lock, 
  ExternalLink, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  HardDrive, 
  Terminal, 
  FileText, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  Copy, 
  Clock, 
  Edit3,
  ChevronRight,
  Info
} from 'lucide-react';
import { useDoki } from '../context/DokiContext';
import { sound } from '../utils/sound';
import { BorderBeam } from '../components/BorderBeam';
import { PermissionRequestModal } from '../components/PermissionRequestModal';
import { Modpack } from '../backend/types';

export const ModpackDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { modpacks, resolveDownload, isAdmin, isLoading } = useDoki();
  const [requestModalPack, setRequestModalPack] = useState<Modpack | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'lore' | 'specs' | 'installation' | 'changelog'>('lore');

  const pack = modpacks.find((m) => m.slug === slug);

  if (isLoading && !pack) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-brand-light animate-pulse mb-4">
          <Package className="w-6 h-6" />
        </div>
        <p className="text-xs font-mono text-zinc-400">Loading modpack archive...</p>
      </div>
    );
  }

  if (!pack) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 mb-6">
          <Package className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-sans font-bold text-white mb-2">Modpack Not Found</h1>
        <p className="text-sm text-zinc-400 max-w-md mb-6">
          The requested modpack with slug &quot;<span className="font-mono text-brand-light">{slug}</span>&quot; does not exist or may have been unlisted.
        </p>
        <Link
          to="/catalog"
          onClick={() => sound.playClick()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand hover:bg-brand-hover text-white text-xs font-mono font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const handleDownload = async () => {
    sound.playClick();
    if (pack.isQuarantined && !isAdmin) {
      sound.playFault();
      alert(`⚠️ Downloads for '${pack.title}' have been temporarily halted by Doki under Emergency Quarantine.`);
      return;
    }

    if (pack.accessPolicy === 'NEED_PERMISSION' && !isAdmin) {
      setRequestModalPack(pack);
      return;
    }

    const res = await resolveDownload(pack.id);
    if (res && res.downloadMirror) {
      window.open(res.downloadMirror, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopyLink = () => {
    sound.playClick();
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getLifecycleBadge = (lifecycle: string) => {
    switch (lifecycle) {
      case 'RELEASE':
        return 'bg-brand/15 text-brand-light border-brand/30';
      case 'BETA':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'UPCOMING':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'TEASER':
      default:
        return 'bg-zinc-800 text-zinc-400 border-white/10';
    }
  };

  return (
    <div className="pt-24 pb-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Breadcrumbs & Admin Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <Link to="/catalog" className="hover:text-white transition-colors">Catalog</Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-zinc-200 truncate">{pack.title}</span>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-mono text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => {
                sound.playClick();
                navigate(`/admin?edit=${pack.id}`);
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Modpack (Admin)</span>
            </button>
          )}
        </div>
      </div>

      {/* Emergency Quarantine Alert */}
      {pack.isQuarantined && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs leading-relaxed animate-pulse">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <div>
            <span className="font-bold font-mono uppercase tracking-wider block mb-0.5">
              Emergency Quarantine Active
            </span>
            Downloads for this modpack are temporarily halted by Doki for security maintenance or balance patch deployment.
            {isAdmin && <span className="text-white font-semibold"> (You are logged in as Admin and can bypass this halt).</span>}
          </div>
        </div>
      )}

      {/* Hero Showcase Card */}
      <div className="relative rounded-3xl bg-zinc-950/80 border border-white/[0.08] overflow-hidden shadow-2xl p-6 sm:p-10">
        <BorderBeam size={280} duration={16} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Thumbnail & Badges */}
          <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center group">
              {pack.thumbnailUrl ? (
                <img 
                  src={pack.thumbnailUrl} 
                  alt={pack.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-500">
                  <Package className="w-14 h-14 text-brand-light" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Doki Build</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border uppercase font-bold tracking-wider ${getLifecycleBadge(pack.lifecycle)}`}>
                {pack.lifecycle}
              </span>
              <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                pack.accessPolicy === 'OPEN_DOWNLOAD'
                  ? 'bg-zinc-900 text-zinc-300 border-white/10'
                  : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
              }`}>
                {pack.accessPolicy === 'OPEN_DOWNLOAD' ? <Package className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                <span>{pack.accessPolicy === 'OPEN_DOWNLOAD' ? 'Public Download' : 'Permission Required'}</span>
              </span>
            </div>
          </div>

          {/* Right: Title, Specs Bento & Download Callout */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-brand-light font-bold">
                Official Minecraft Adventure Build
              </div>
              <h1 className="text-3xl sm:text-4xl font-sans font-bold text-white tracking-tight">
                {pack.title}
              </h1>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
                {pack.description}
              </p>
            </div>

            {/* Quick Specs Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Minecraft</div>
                <div className="text-xs font-semibold text-white mt-0.5">{pack.specs.minecraftVersion}</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Mod Loader</div>
                <div className="text-xs font-semibold text-white mt-0.5">{pack.specs.modLoader}</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">RAM Allocation</div>
                <div className="text-xs font-semibold text-emerald-400 mt-0.5">{pack.specs.recommendedRam}</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
                <div className="text-[10px] font-mono text-zinc-500 uppercase">Pack Size</div>
                <div className="text-xs font-semibold text-zinc-200 mt-0.5">{pack.specs.totalModsCount || 248}+ Mods</div>
              </div>
            </div>

            {/* Download CTA Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={handleDownload}
                disabled={pack.isQuarantined && !isAdmin}
                className={`px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                  pack.isQuarantined && !isAdmin
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5'
                    : 'bg-brand hover:bg-brand-hover text-white hover:scale-[1.02]'
                }`}
              >
                {pack.accessPolicy === 'NEED_PERMISSION' && !isAdmin ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Request Permission Access</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Official Client Build</span>
                  </>
                )}
              </button>

              {pack.downloadMirror && (
                <a
                  href={pack.downloadMirror}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white text-xs font-mono flex items-center justify-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Google Drive Mirror</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nav Tabs: Lore, System Requirements, Installation, Changelog */}
      <div className="space-y-8">
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 text-xs font-mono overflow-x-auto">
          <button
            onClick={() => {
              sound.playSwitch();
              setActiveTab('lore');
            }}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'lore'
                ? 'bg-zinc-900 text-white border border-white/10 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-light" />
            <span>Lore & Narrative</span>
          </button>

          <button
            onClick={() => {
              sound.playSwitch();
              setActiveTab('specs');
            }}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'specs'
                ? 'bg-zinc-900 text-white border border-white/10 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>System Requirements</span>
          </button>

          <button
            onClick={() => {
              sound.playSwitch();
              setActiveTab('installation');
            }}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'installation'
                ? 'bg-zinc-900 text-white border border-white/10 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>Installation Guide</span>
          </button>

          <button
            onClick={() => {
              sound.playSwitch();
              setActiveTab('changelog');
            }}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'changelog'
                ? 'bg-zinc-900 text-white border border-white/10 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Changelog</span>
          </button>
        </div>

        {/* TAB 1: LORE & STORYLINE */}
        {activeTab === 'lore' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="relative rounded-2xl bg-zinc-950/70 border border-white/[0.08] p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-light font-bold">
                <Sparkles className="w-4 h-4" />
                <span>The Narrative Record</span>
              </div>
              <blockquote className="text-sm sm:text-base text-zinc-200 leading-relaxed font-sans italic border-l-2 border-brand pl-4 py-1">
                &ldquo;{pack.lore}&rdquo;
              </blockquote>
              <p className="text-xs text-zinc-400 leading-relaxed pt-2">
                Every survival mechanic in {pack.title} is designed around this narrative foundation. From mutated fauna to toxic atmospheric pockets, players must craft advanced filtration equipment, uncover forgotten research outposts, and synthesize the cure to reopen the portal to The End.
              </p>
            </div>

            {/* Screenshots Strip if available */}
            {pack.screenshots && pack.screenshots.length > 0 && (
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  Field Recon // Screenshots
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pack.screenshots.map((shot, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden border border-white/10 bg-zinc-900 group">
                      <img src={shot} alt={`Screenshot ${idx + 1}`} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SYSTEM REQUIREMENTS */}
        {activeTab === 'specs' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Minimum Specs */}
              <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <h3 className="text-sm font-sans font-bold text-white">Minimum Requirements</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-white/10">30-45 FPS Target</span>
                </div>
                <ul className="space-y-3 text-xs">
                  <li className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                    <span className="text-zinc-400">Processor (CPU)</span>
                    <span className="font-mono text-zinc-200">{pack.specs.minCpu || 'Intel Core i5-8400 / Ryzen 5 2600'}</span>
                  </li>
                  <li className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                    <span className="text-zinc-400">Graphics (GPU)</span>
                    <span className="font-mono text-zinc-200">{pack.specs.minGpu || 'NVIDIA GTX 1060 / AMD RX 580 (4 GB)'}</span>
                  </li>
                  <li className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                    <span className="text-zinc-400">Allocated RAM</span>
                    <span className="font-mono text-zinc-200">{pack.specs.minRam}</span>
                  </li>
                  <li className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                    <span className="text-zinc-400">Java Runtime</span>
                    <span className="font-mono text-zinc-200">{pack.specs.javaRuntime}</span>
                  </li>
                  <li className="flex justify-between items-center py-1">
                    <span className="text-zinc-400">Storage Required</span>
                    <span className="font-mono text-zinc-200">{pack.specs.diskSpace || '12 GB Free SSD Space'}</span>
                  </li>
                </ul>
              </div>

              {/* Recommended Specs */}
              <div className="p-6 rounded-2xl bg-zinc-950/70 border border-brand/30 space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <h3 className="text-sm font-sans font-bold text-white flex items-center gap-2">
                    <span>Recommended Experience</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand/10 text-brand-light border border-brand/30">60-120+ FPS Target</span>
                </div>
                <ul className="space-y-3 text-xs">
                  <li className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                    <span className="text-zinc-400">Processor (CPU)</span>
                    <span className="font-mono text-zinc-200">Intel Core i7-12700 / AMD Ryzen 7 5800X</span>
                  </li>
                  <li className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                    <span className="text-zinc-400">Graphics (GPU)</span>
                    <span className="font-mono text-zinc-200">NVIDIA RTX 3060 / AMD RX 6700 XT (8 GB)</span>
                  </li>
                  <li className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                    <span className="text-zinc-400">Allocated RAM</span>
                    <span className="font-mono text-emerald-400 font-bold">{pack.specs.recommendedRam}</span>
                  </li>
                  <li className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                    <span className="text-zinc-400">Java Runtime</span>
                    <span className="font-mono text-zinc-200">{pack.specs.javaRuntime} (with ZGC/Generational Shenandoah)</span>
                  </li>
                  <li className="flex justify-between items-center py-1">
                    <span className="text-zinc-400">Storage Required</span>
                    <span className="font-mono text-zinc-200">NVMe High-Speed SSD</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: INSTALLATION GUIDE */}
        {activeTab === 'installation' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-6">
              <h3 className="text-sm font-sans font-bold text-white">How to Install {pack.title}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-brand/10 border border-brand/30 flex items-center justify-center text-brand-light font-mono text-xs font-bold">1</div>
                  <h4 className="text-xs font-semibold text-white">Download Build Package</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Download the official archive zip file from the Google Drive mirror above.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-brand/10 border border-brand/30 flex items-center justify-center text-brand-light font-mono text-xs font-bold">2</div>
                  <h4 className="text-xs font-semibold text-white">Import into Launcher</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Open Prism Launcher, Modrinth App, or CurseForge, and select &quot;Import from Zip / Add Instance&quot;.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-brand/10 border border-brand/30 flex items-center justify-center text-brand-light font-mono text-xs font-bold">3</div>
                  <h4 className="text-xs font-semibold text-white">Configure Java & Launch</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Allocate at least {pack.specs.minRam} (recommended: {pack.specs.recommendedRam}) in Instance Settings and launch!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CHANGELOG */}
        {activeTab === 'changelog' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <span className="text-xs font-mono uppercase text-brand-light font-bold">Build Version History</span>
                <span className="text-[10px] font-mono text-zinc-500">Updated: {new Date(pack.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="text-xs text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed">
                {pack.changelog || `v1.0.0-PROD (Initial Stable Release):\n- Integrated 240+ Fabric optimization and survival mods.\n- Custom Iris Shaders profile with high-framerate occlusion culling.\n- Custom biohazard mutation mechanics and toxic biome radiation filters.\n- Verified multiplayer server parity and zero tick-lag drop.`}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Permission Request Modal for restricted packs */}
      <PermissionRequestModal
        isOpen={!!requestModalPack}
        modpackId={requestModalPack?.id || ''}
        modpackTitle={requestModalPack?.title || ''}
        onClose={() => setRequestModalPack(null)}
      />
    </div>
  );
};

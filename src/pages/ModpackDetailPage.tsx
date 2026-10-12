import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Download, 
  Lock, 
  ExternalLink, 
  AlertTriangle, 
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
  Calendar,
  Film,
  Play
} from 'lucide-react';
import { useDoki } from '../context/DokiContext';
import { sound } from '../utils/sound';
import { BorderBeam } from '../components/BorderBeam';
import { PermissionRequestModal } from '../components/PermissionRequestModal';
import { Modpack, ModpackLifecycle } from '../backend/types';

function parseTrailer(url?: string): { isEmbeddable: boolean; embedUrl: string; isVideoFile: boolean; rawUrl: string } {
  if (!url || !url.trim()) return { isEmbeddable: false, embedUrl: '', isVideoFile: false, rawUrl: '' };
  const trimmed = url.trim();

  // YouTube URL matching
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      isEmbeddable: true,
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0&rel=0`,
      isVideoFile: false,
      rawUrl: trimmed,
    };
  }

  // Direct video file
  if (/\.(mp4|webm|ogg)($|\?)/i.test(trimmed)) {
    return {
      isEmbeddable: true,
      embedUrl: trimmed,
      isVideoFile: true,
      rawUrl: trimmed,
    };
  }

  // Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/i);
  if (vimeoMatch && vimeoMatch[3]) {
    return {
      isEmbeddable: true,
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}`,
      isVideoFile: false,
      rawUrl: trimmed,
    };
  }

  return { isEmbeddable: false, embedUrl: trimmed, isVideoFile: false, rawUrl: trimmed };
}

export const ModpackDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { modpacks, resolveDownload, isAdmin, isLoading } = useDoki();
  const [requestModalPack, setRequestModalPack] = useState<Modpack | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'lore' | 'trailer' | 'specs' | 'installation' | 'changelog'>('lore');

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

    if (pack.lifecycle === 'COMING_SOON') {
      return;
    }

    if (pack.isQuarantined && !isAdmin) {
      sound.playFault();
      alert(`⚠️ Downloads for '${pack.title}' have been temporarily halted by Doki under Emergency Quarantine.`);
      return;
    }

    if ((pack.lifecycle === 'CLOSED_DEMO' || pack.accessPolicy === 'NEED_PERMISSION') && !isAdmin) {
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

  const getLifecycleBadge = (lifecycle: ModpackLifecycle | string) => {
    switch (lifecycle) {
      case 'RELEASE':
        return {
          label: 'RELEASE',
          style: 'bg-brand/15 text-brand-light border-brand/30',
        };
      case 'DEMO':
        return {
          label: 'DEMO',
          style: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        };
      case 'CLOSED_DEMO':
        return {
          label: 'CLOSED DEMO • PERMISSION ONLY',
          style: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
        };
      case 'COMING_SOON':
        return {
          label: 'COMING SOON',
          style: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        };
      default:
        return {
          label: lifecycle,
          style: 'bg-zinc-800 text-zinc-300 border-white/10',
        };
    }
  };

  const badge = getLifecycleBadge(pack.lifecycle);
  const trailerInfo = parseTrailer(pack.trailerUrl);

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
              <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border uppercase font-bold tracking-wider ${badge.style}`}>
                {badge.label}
              </span>
              <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                pack.lifecycle === 'CLOSED_DEMO'
                  ? 'bg-purple-900/30 text-purple-300 border-purple-500/30'
                  : pack.accessPolicy === 'OPEN_DOWNLOAD'
                  ? 'bg-zinc-900 text-zinc-300 border-white/10'
                  : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
              }`}>
                {pack.lifecycle === 'CLOSED_DEMO' || pack.accessPolicy === 'NEED_PERMISSION' ? <Lock className="w-3 h-3" /> : <Package className="w-3 h-3" />}
                <span>
                  {pack.lifecycle === 'CLOSED_DEMO' ? 'Permission Only' : pack.accessPolicy === 'OPEN_DOWNLOAD' ? 'Public Download' : 'Permission Required'}
                </span>
              </span>
            </div>
          </div>

          {/* Right: Title, Specs Bento & Exactly 1 Download Button */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-brand-light font-bold">
                  Official Minecraft Adventure Build
                </span>
                {pack.releaseDate && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-white/10 text-[11px] font-mono text-zinc-300">
                    <Calendar className="w-3 h-3 text-brand-light" />
                    <span>
                      {pack.lifecycle === 'COMING_SOON' ? `Expected Release: ${pack.releaseDate}` : `Release Date: ${pack.releaseDate}`}
                    </span>
                  </span>
                )}
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

            {/* EXACTLY ONE DOWNLOAD BUTTON */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={handleDownload}
                disabled={pack.lifecycle === 'COMING_SOON' || (pack.isQuarantined && !isAdmin)}
                className={`px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all ${
                  pack.lifecycle === 'COMING_SOON'
                    ? 'bg-zinc-800/90 text-amber-300 border border-amber-500/20 cursor-default'
                    : pack.isQuarantined && !isAdmin
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5'
                    : (pack.lifecycle === 'CLOSED_DEMO' || pack.accessPolicy === 'NEED_PERMISSION') && !isAdmin
                    ? 'bg-purple-900/60 hover:bg-purple-900/80 text-purple-200 border border-purple-500/30 cursor-pointer'
                    : 'bg-brand hover:bg-brand-hover text-white hover:scale-[1.02] cursor-pointer'
                }`}
              >
                {pack.lifecycle === 'COMING_SOON' ? (
                  <>
                    <Clock className="w-4 h-4" />
                    <span>Coming Soon {pack.releaseDate ? `• ${pack.releaseDate}` : ''}</span>
                  </>
                ) : pack.isQuarantined && !isAdmin ? (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    <span>Downloads Halted (Emergency Quarantine)</span>
                  </>
                ) : (pack.lifecycle === 'CLOSED_DEMO' || pack.accessPolicy === 'NEED_PERMISSION') && !isAdmin ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Request Permission Access (Closed Demo)</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Modpack Build</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                  </>
                )}
              </button>

              {trailerInfo.rawUrl && (
                <button
                  onClick={() => {
                    sound.playSwitch();
                    setActiveTab('trailer');
                  }}
                  className="px-4 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white text-xs font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-brand-light" />
                  <span>Watch Trailer</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic Trailer Section (Prominently shown if trailerUrl is set) */}
      {trailerInfo.rawUrl && (
        <section className="rounded-3xl bg-zinc-950/80 border border-white/[0.08] p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/30 flex items-center justify-center text-brand-light">
                <Film className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-sans font-bold text-white tracking-tight">
                  {pack.trailerTitle || 'Official Cinematic Trailer'}
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Official gameplay and storyline reveal
                </p>
              </div>
            </div>

            <a
              href={trailerInfo.rawUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-brand-light hover:text-white transition-colors self-start sm:self-auto"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
            {trailerInfo.isEmbeddable && !trailerInfo.isVideoFile ? (
              <iframe
                src={trailerInfo.embedUrl}
                title={pack.trailerTitle || 'Modpack Trailer'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : trailerInfo.isVideoFile ? (
              <video
                src={trailerInfo.embedUrl}
                controls
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3">
                <Film className="w-12 h-12 text-zinc-600" />
                <p className="text-xs text-zinc-400 max-w-sm">
                  External trailer stream configured: <span className="font-mono text-zinc-300">{trailerInfo.rawUrl}</span>
                </p>
                <a
                  href={trailerInfo.rawUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-brand hover:bg-brand-hover text-white text-xs font-mono font-semibold"
                >
                  Launch External Video
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Nav Tabs: Lore, Specs, Installation, Changelog */}
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
                This modpack is crafted to immerse you in a dangerous, evolving sandbox. Every encounter demands preparation, resource conservation, and knowledge of the environment.
              </p>
            </div>

            {/* Screenshots Gallery */}
            {pack.screenshots && pack.screenshots.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  In-Game Visual Transmissions ({pack.screenshots.length} Screenshots)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pack.screenshots.map((shot, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden border border-white/10 bg-zinc-900 h-56 sm:h-64 relative group">
                      <img src={shot} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SYSTEM REQUIREMENTS */}
        {activeTab === 'specs' && (
          <div className="rounded-2xl bg-zinc-950/70 border border-white/[0.08] p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              <Cpu className="w-4 h-4" />
              <span>Verified Hardware Specification</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-1">
                <div className="text-zinc-500 text-[10px] uppercase">Minecraft Target</div>
                <div className="text-zinc-200 font-semibold">{pack.specs.minecraftVersion}</div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-1">
                <div className="text-zinc-500 text-[10px] uppercase">Mod Loader</div>
                <div className="text-zinc-200 font-semibold">{pack.specs.modLoader}</div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-1">
                <div className="text-zinc-500 text-[10px] uppercase">Java Runtime</div>
                <div className="text-zinc-200 font-semibold">{pack.specs.javaRuntime}</div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-1">
                <div className="text-zinc-500 text-[10px] uppercase">Memory Allocation (RAM)</div>
                <div className="text-emerald-400 font-semibold">Min: {pack.specs.minRam} • Rec: {pack.specs.recommendedRam}</div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-1">
                <div className="text-zinc-500 text-[10px] uppercase">Processor (CPU)</div>
                <div className="text-zinc-200 font-semibold">{pack.specs.minCpu || 'Quad-Core 3.2 GHz or higher'}</div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-1">
                <div className="text-zinc-500 text-[10px] uppercase">Graphics (GPU)</div>
                <div className="text-zinc-200 font-semibold">{pack.specs.minGpu || 'NVIDIA GTX 1060 / AMD RX 580 (4GB+)'}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs flex items-center gap-3">
              <HardDrive className="w-5 h-5 shrink-0 text-cyan-400" />
              <span>Recommended SSD Space: {pack.specs.diskSpace || '8 GB NVMe/SSD space for world generation caching.'}</span>
            </div>
          </div>
        )}

        {/* TAB 3: INSTALLATION GUIDE */}
        {activeTab === 'installation' && (
          <div className="rounded-2xl bg-zinc-950/70 border border-white/[0.08] p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              <Terminal className="w-4 h-4" />
              <span>Deployment & Launcher Setup</span>
            </div>

            <ol className="space-y-4 text-xs font-sans text-zinc-300">
              <li className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/50 border border-white/[0.04]">
                <span className="w-6 h-6 rounded-full bg-brand/20 text-brand-light font-mono text-xs flex items-center justify-center shrink-0">1</span>
                <div>
                  <span className="font-semibold text-white block">Download Modpack Client Archive</span>
                  Download the official archive zip file from the download button above.
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/50 border border-white/[0.04]">
                <span className="w-6 h-6 rounded-full bg-brand/20 text-brand-light font-mono text-xs flex items-center justify-center shrink-0">2</span>
                <div>
                  <span className="font-semibold text-white block">Import into Prism, Modrinth, or CurseForge</span>
                  Open your custom Minecraft launcher, select &quot;Add Instance&quot; or &quot;Import from Zip&quot;, and select the downloaded archive.
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/50 border border-white/[0.04]">
                <span className="w-6 h-6 rounded-full bg-brand/20 text-brand-light font-mono text-xs flex items-center justify-center shrink-0">3</span>
                <div>
                  <span className="font-semibold text-white block">Configure Java Runtime & RAM</span>
                  Verify that your instance is pointing to <span className="font-mono text-brand-light">{pack.specs.javaRuntime}</span> and has at least <span className="font-mono text-brand-light">{pack.specs.recommendedRam}</span> assigned.
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/50 border border-white/[0.04]">
                <span className="w-6 h-6 rounded-full bg-brand/20 text-brand-light font-mono text-xs flex items-center justify-center shrink-0">4</span>
                <div>
                  <span className="font-semibold text-white block">Launch & Connect</span>
                  Start the instance. If you encounter any crash or memory exhaustion, refer to our Community Help Center on Discord or Facebook.
                </div>
              </li>
            </ol>
          </div>
        )}

        {/* TAB 4: CHANGELOG */}
        {activeTab === 'changelog' && (
          <div className="rounded-2xl bg-zinc-950/70 border border-white/[0.08] p-6 sm:p-8 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
              <FileText className="w-4 h-4" />
              <span>Version History & Notes</span>
            </div>

            <pre className="p-4 rounded-xl bg-black border border-white/10 font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {pack.changelog || 'No detailed changelog provided for this release version.'}
            </pre>
          </div>
        )}
      </div>

      {/* Permission Request Modal */}
      {requestModalPack && (
        <PermissionRequestModal
          isOpen={true}
          onClose={() => setRequestModalPack(null)}
          modpackId={requestModalPack.id}
          modpackTitle={requestModalPack.title}
        />
      )}
    </div>
  );
};

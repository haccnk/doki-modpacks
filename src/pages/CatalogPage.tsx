import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Download, 
  Lock, 
  ExternalLink, 
  AlertTriangle, 
  Search, 
  Filter, 
  Sparkles, 
  Sliders, 
  Plus, 
  ArrowRight,
  Layers
} from 'lucide-react';
import { useDoki } from '../context/DokiContext';
import { Modpack, ModpackLifecycle } from '../backend/types';
import { sound } from '../utils/sound';
import { PermissionRequestModal } from '../components/PermissionRequestModal';

export const CatalogPage: React.FC = () => {
  const { modpacks, resolveDownload, isAdmin } = useDoki();
  const [selectedPackForRequest, setSelectedPackForRequest] = useState<Modpack | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lifecycleFilter, setLifecycleFilter] = useState<string>('ALL');
  const [policyFilter, setPolicyFilter] = useState<string>('ALL');

  const filteredModpacks = modpacks.filter((pack) => {
    const matchesSearch = 
      pack.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pack.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pack.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pack.specs.minecraftVersion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pack.specs.modLoader.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLifecycle = lifecycleFilter === 'ALL' || pack.lifecycle === lifecycleFilter;
    const matchesPolicy = policyFilter === 'ALL' || pack.accessPolicy === policyFilter;

    return matchesSearch && matchesLifecycle && matchesPolicy;
  });

  const handleDownloadClick = async (pack: Modpack) => {
    sound.playClick();
    if (pack.isQuarantined && !isAdmin) {
      sound.playFault();
      alert(`⚠️ Downloads for '${pack.title}' have been temporarily halted by Doki under Emergency Quarantine.`);
      return;
    }

    if (pack.accessPolicy === 'NEED_PERMISSION' && !isAdmin) {
      setSelectedPackForRequest(pack);
      return;
    }

    const res = await resolveDownload(pack.id);
    if (res && res.downloadMirror) {
      window.open(res.downloadMirror, '_blank', 'noopener,noreferrer');
    }
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
        return 'bg-zinc-800 text-zinc-300 border-white/10';
    }
  };

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono text-zinc-400">
              <Package className="w-3.5 h-3.5 text-brand-light" />
              <span>OFFICIAL CLIENT CATALOG</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
              Doki&apos;s Modpack Catalog
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Explore bespoke Minecraft releases configured with balanced survival progression, custom storylines, and high-performance server options.
            </p>
          </div>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => sound.playSuccess()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-semibold shadow-md shadow-brand/20 transition-all self-start"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Modpack</span>
            </Link>
          )}
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/[0.08] shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, version, loader..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.08] focus:border-brand text-xs text-white placeholder:text-zinc-600 font-sans focus:outline-none"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-white/[0.06] text-xs font-mono">
              <span className="text-[10px] text-zinc-500 px-2 uppercase">Lifecycle:</span>
              {['ALL', 'RELEASE', 'BETA', 'UPCOMING'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    sound.playClick();
                    setLifecycleFilter(status);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                    lifecycleFilter === status
                      ? 'bg-brand text-white font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-white/[0.06] text-xs font-mono">
              <span className="text-[10px] text-zinc-500 px-2 uppercase">Policy:</span>
              {['ALL', 'OPEN_DOWNLOAD', 'NEED_PERMISSION'].map((policy) => (
                <button
                  key={policy}
                  onClick={() => {
                    sound.playClick();
                    setPolicyFilter(policy);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                    policyFilter === policy
                      ? 'bg-brand text-white font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {policy === 'ALL' ? 'All' : policy === 'OPEN_DOWNLOAD' ? 'Open' : 'Restricted'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modpacks Grid */}
      {filteredModpacks.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-zinc-950/60 border border-white/[0.06] space-y-3">
          <Package className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No modpacks match your criteria</h3>
          <p className="text-xs text-zinc-500">Try adjusting your search query or reset the lifecycle filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setLifecycleFilter('ALL');
              setPolicyFilter('ALL');
            }}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredModpacks.map((pack) => {
            const isBiohazard = pack.slug === 'minecraft-2-biohazard';

            return (
              <div
                key={pack.id}
                className="rounded-2xl liquid-glass liquid-glass-item p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden group shadow-xl"
              >
                {/* Quarantine Warning Ribbon */}
                {pack.isQuarantined && (
                  <div className="absolute top-0 left-0 right-0 bg-rose-600/90 text-white text-[11px] font-mono py-1 px-4 text-center font-bold tracking-wider flex items-center justify-center gap-2 z-20">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>EMERGENCY QUARANTINE: Public downloads halted</span>
                    {isAdmin && <span className="underline ml-1">(Admin Bypass Active)</span>}
                  </div>
                )}

                <div className={`space-y-4 ${pack.isQuarantined ? 'pt-4' : ''}`}>
                  {/* Thumbnail / Cover */}
                  {pack.thumbnailUrl && (
                    <div className="w-full h-44 rounded-xl overflow-hidden relative border border-white/10 group-hover:border-brand/30 transition-colors">
                      <img 
                        src={pack.thumbnailUrl} 
                        alt={pack.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold ${getLifecycleBadge(pack.lifecycle)}`}>
                          {pack.lifecycle}
                        </span>
                      </div>
                      {isBiohazard && (
                        <div className="absolute top-3 right-3 text-[10px] font-mono uppercase tracking-wider text-brand-light font-bold flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-full border border-brand/30">
                          <Sparkles className="w-3 h-3" /> Flagship
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 text-xs font-mono text-zinc-300">
                        {pack.specs.modLoader} • MC {pack.specs.minecraftVersion}
                      </div>
                    </div>
                  )}

                  {/* Title & Description */}
                  <div>
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/modpack/${pack.slug}`}
                        onClick={() => sound.playClick()}
                        className="text-2xl font-sans font-bold text-white tracking-tight group-hover:text-brand-light transition-colors flex items-center gap-2"
                      >
                        <span>{pack.title}</span>
                      </Link>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-white/10">
                        {pack.accessPolicy === 'OPEN_DOWNLOAD' ? 'OPEN ACCESS' : 'RESTRICTED'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 font-mono">
                      Target Engine: Minecraft {pack.specs.minecraftVersion} ({pack.specs.modLoader})
                    </p>
                  </div>

                  {/* Lore Quote Box */}
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] text-xs text-zinc-300 leading-relaxed italic border-l-2 border-l-brand">
                    &ldquo;{pack.lore}&rdquo;
                  </div>

                  {/* Technical Specs Bento */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-[11px]">
                    <div className="p-2 rounded-lg bg-black/60 border border-white/[0.04]">
                      <div className="text-zinc-500 text-[10px]">LOADER</div>
                      <div className="text-zinc-200 font-semibold truncate">{pack.specs.modLoader}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-black/60 border border-white/[0.04]">
                      <div className="text-zinc-500 text-[10px]">MINECRAFT</div>
                      <div className="text-zinc-200 font-semibold">{pack.specs.minecraftVersion}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-black/60 border border-white/[0.04]">
                      <div className="text-zinc-500 text-[10px]">JAVA</div>
                      <div className="text-zinc-200 font-semibold">{pack.specs.javaRuntime.split(' ')[0]}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-black/60 border border-white/[0.04]">
                      <div className="text-zinc-500 text-[10px]">RAM</div>
                      <div className="text-zinc-200 font-semibold">{pack.specs.recommendedRam}</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
                  <Link
                    to={`/modpack/${pack.slug}`}
                    onClick={() => sound.playClick()}
                    className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Full Details & Specs</span>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-light" />
                  </Link>

                  <button
                    onClick={() => handleDownloadClick(pack)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${
                      pack.isQuarantined && !isAdmin
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        : pack.accessPolicy === 'NEED_PERMISSION' && !isAdmin
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10'
                        : 'bg-brand hover:bg-brand-hover text-white shadow-inner-light shadow-brand/30'
                    }`}
                  >
                    {pack.isQuarantined && !isAdmin ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Halted</span>
                      </>
                    ) : pack.accessPolicy === 'NEED_PERMISSION' && !isAdmin ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Request Access</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Client Build</span>
                        <ExternalLink className="w-3 h-3 text-white/80" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Permission Request Modal */}
      {selectedPackForRequest && (
        <PermissionRequestModal
          isOpen={true}
          onClose={() => setSelectedPackForRequest(null)}
          modpackId={selectedPackForRequest.id}
          modpackTitle={selectedPackForRequest.title}
        />
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Download, 
  Lock, 
  ExternalLink, 
  AlertTriangle, 
  Calendar,
  Sparkles,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useDoki } from '../context/DokiContext';
import { Modpack, ModpackLifecycle } from '../backend/types';
import { sound } from '../utils/sound';
import { PermissionRequestModal } from './PermissionRequestModal';

export const DokiCatalog: React.FC = () => {
  const navigate = useNavigate();
  const { modpacks, resolveDownload, isAdmin } = useDoki();
  const [selectedPackForRequest, setSelectedPackForRequest] = useState<Modpack | null>(null);

  const handleDownloadClick = async (e: React.MouseEvent, pack: Modpack) => {
    e.stopPropagation();
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
      setSelectedPackForRequest(pack);
      return;
    }

    const res = await resolveDownload(pack.id);
    if (res && res.downloadMirror) {
      window.open(res.downloadMirror, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCardClick = (slug: string) => {
    sound.playClick();
    navigate(`/modpack/${slug}`);
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

  return (
    <section id="catalog" className="py-24 relative border-t border-white/[0.06] bg-[#08090C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono text-zinc-400">
            <Package className="w-3.5 h-3.5 text-brand-light" />
            <span>OFFICIAL RELEASES & ARCHIVES</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
            Explore Doki&apos;s Modpack Catalog
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Click any modpack to view complete lore, embedded trailers, system requirements, and direct downloads.
          </p>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modpacks.map((pack) => {
            const isBiohazard = pack.slug === 'minecraft-2-biohazard';
            const badge = getLifecycleBadge(pack.lifecycle);

            return (
              <div
                key={pack.id}
                onClick={() => handleCardClick(pack.slug)}
                className="rounded-2xl bg-zinc-950/80 border border-white/[0.08] hover:border-brand/40 transition-all p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden group shadow-xl cursor-pointer hover:-translate-y-0.5 hover:shadow-brand/5"
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
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold ${badge.style}`}>
                        {badge.label}
                      </span>
                      {pack.lifecycle !== 'CLOSED_DEMO' && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-white/10">
                          {pack.accessPolicy === 'OPEN_DOWNLOAD' ? 'OPEN ACCESS' : 'RESTRICTED'}
                        </span>
                      )}
                    </div>

                    {isBiohazard && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-brand-light font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Flagship
                      </span>
                    )}
                  </div>

                  {/* Title & Target Engine */}
                  <div>
                    <h3 className="text-2xl font-sans font-bold text-white tracking-tight group-hover:text-brand-light transition-colors flex items-center justify-between">
                      <span>{pack.title}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-light shrink-0" />
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-zinc-400 font-mono">
                      <span>Minecraft {pack.specs.minecraftVersion} ({pack.specs.modLoader})</span>
                      {pack.releaseDate && (
                        <span className="flex items-center gap-1 text-zinc-300">
                          <Calendar className="w-3 h-3 text-brand-light" />
                          <span>
                            {pack.lifecycle === 'COMING_SOON' ? `Expected: ${pack.releaseDate}` : `Released: ${pack.releaseDate}`}
                          </span>
                        </span>
                      )}
                    </div>
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
                      <div className="text-zinc-200 font-semibold">{pack.specs.javaRuntime ? pack.specs.javaRuntime.split(' ')[0] : 'Java 21'}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-black/60 border border-white/[0.04]">
                      <div className="text-zinc-500 text-[10px]">RAM</div>
                      <div className="text-zinc-200 font-semibold">{pack.specs.recommendedRam}</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions: Exactly 1 single download button */}
                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
                  <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1 group-hover:text-brand-light transition-colors">
                    <span>View Full Modpack Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>

                  <button
                    onClick={(e) => handleDownloadClick(e, pack)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${
                      pack.lifecycle === 'COMING_SOON'
                        ? 'bg-zinc-800/80 text-amber-300 border border-amber-500/20 cursor-default'
                        : pack.isQuarantined && !isAdmin
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        : (pack.lifecycle === 'CLOSED_DEMO' || pack.accessPolicy === 'NEED_PERMISSION') && !isAdmin
                        ? 'bg-purple-900/40 hover:bg-purple-900/60 text-purple-200 border border-purple-500/30'
                        : 'bg-brand hover:bg-brand-hover text-white shadow-inner-light shadow-brand/30'
                    }`}
                  >
                    {pack.lifecycle === 'COMING_SOON' ? (
                      <>
                        <Clock className="w-3.5 h-3.5" />
                        <span>Coming Soon</span>
                      </>
                    ) : pack.isQuarantined && !isAdmin ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Downloads Halted</span>
                      </>
                    ) : (pack.lifecycle === 'CLOSED_DEMO' || pack.accessPolicy === 'NEED_PERMISSION') && !isAdmin ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Request Access</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Modpack</span>
                        <ExternalLink className="w-3 h-3 text-white/80" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Permission Request Modal */}
      {selectedPackForRequest && (
        <PermissionRequestModal
          isOpen={true}
          onClose={() => setSelectedPackForRequest(null)}
          modpackId={selectedPackForRequest.id}
          modpackTitle={selectedPackForRequest.title}
        />
      )}
    </section>
  );
};

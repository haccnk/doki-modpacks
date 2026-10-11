import React, { useState } from 'react';
import { 
  Package, 
  Download, 
  Lock, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Calendar,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDoki } from '../context/DokiContext';
import { Modpack } from '../backend/types';
import { sound } from '../utils/sound';
import { PermissionRequestModal } from './PermissionRequestModal';

export const DokiCatalog: React.FC = () => {
  const { modpacks, resolveDownload, isAdmin } = useDoki();
  const [selectedPackForRequest, setSelectedPackForRequest] = useState<Modpack | null>(null);

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
            Every release is built around unique progression mechanics, custom environmental threats, and hand-tuned balance.
          </p>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modpacks.map((pack) => {
            const isBiohazard = pack.slug === 'minecraft-2-biohazard';

            return (
              <div
                key={pack.id}
                className="rounded-2xl bg-zinc-950/80 border border-white/[0.08] hover:border-brand/40 transition-all p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden group shadow-xl"
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
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold ${getLifecycleBadge(pack.lifecycle)}`}>
                        {pack.lifecycle}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-white/10">
                        {pack.accessPolicy === 'OPEN_DOWNLOAD' ? 'OPEN ACCESS' : 'RESTRICTED (PERMISSION REQUIRED)'}
                      </span>
                    </div>

                    {isBiohazard && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-brand-light font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Flagship
                      </span>
                    )}
                  </div>

                  {/* Title & Lore */}
                  <div>
                    <h3 className="text-2xl font-sans font-bold text-white tracking-tight group-hover:text-brand-light transition-colors">
                      {pack.title}
                    </h3>
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
                  <div className="text-[11px] font-mono text-zinc-500">
                    {pack.accessPolicy === 'OPEN_DOWNLOAD' ? 'Direct Official Mirror' : 'Request-based Authorization'}
                  </div>

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

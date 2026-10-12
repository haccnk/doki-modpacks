import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  ChevronRight,
  ExternalLink,
  AlertTriangle,
  Heart,
  PackageCheck,
  BookOpen
} from 'lucide-react';
import { useDoki } from '../context/DokiContext';
import { useToast } from '../context/ToastContext';
import { BorderBeam } from './BorderBeam';
import { MagneticButton } from './MagneticButton';
import { sound } from '../utils/sound';

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const { featuredModpack, resolveDownload, isAdmin } = useDoki();
  const { showToast } = useToast();

  const title = featuredModpack?.title || 'Minecraft 2: Biohazard';
  const lore = featuredModpack?.lore || 'The Ender Dragon has been defeated, but when we return to the Overworld, everything has withered away due to a strange plague caused by a mysterious entity. We will have to wander everywhere to search for the truth and also to return to The End.';
  const mirror = featuredModpack?.downloadMirror || 'https://drive.google.com/drive/folders/1aFzU3cR0nRVHCT-gzJSTNoRKEavO-VFk?usp=drive_link';
  const isQuarantined = featuredModpack?.isQuarantined || false;

  const handleDownload = async () => {
    sound.playClick();
    if (isQuarantined && !isAdmin) {
      sound.playFault();
      showToast('Downloads are temporarily halted under Emergency Quarantine.', 'error');
      return;
    }

    if (featuredModpack) {
      const res = await resolveDownload(featuredModpack.id);
      if (res && res.downloadMirror) {
        window.open(res.downloadMirror, '_blank', 'noopener,noreferrer');
      }
    } else {
      window.open(mirror, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="relative pt-6 pb-12 sm:pt-8 sm:pb-16 overflow-hidden">
      
      {/* Subtle Linear-style Radial Glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-b from-brand/20 via-brand-gradient/10 to-transparent blur-[120px] pointer-events-none transition-colors duration-500"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Single Announcement Chip */}
        <div className="flex justify-center mb-6">
          <Link
            to={featuredModpack ? `/modpack/${featuredModpack.slug}` : '/modpack/minecraft-2-biohazard'}
            onClick={() => sound.playClick()}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-white/[0.08] hover:border-brand/40 text-xs text-zinc-300 transition-all group shadow-sm hover:scale-[1.02]"
          >
            <span className="flex h-2 w-2 rounded-full bg-brand-light animate-pulse"></span>
            <span className="font-mono text-[11px] text-brand-light font-bold uppercase tracking-wider">
              Doki&apos;s Modpacks Hub
            </span>
            <span className="text-zinc-600">/</span>
            <span className="group-hover:text-white transition-colors">
              Flagship Release: {title} is Live
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Main Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-bold tracking-tight text-white leading-[1.08]">
              Minecraft 2: <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-brand-light via-brand to-brand-gradient bg-clip-text text-transparent">
                Biohazard.
              </span>
            </h1>
            <p className="text-xs sm:text-sm font-mono uppercase tracking-widest text-brand-light font-semibold pt-1">
              Custom Crafted Adventure • Official Client Release
            </p>
          </div>

          {/* Official Storyline Lore Narrative Box */}
          <div className="max-w-2xl mx-auto p-5 sm:p-6 rounded-2xl bg-zinc-950/70 border border-white/[0.08] backdrop-blur-md relative overflow-hidden shadow-2xl">
            <BorderBeam size={180} duration={12} />
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 flex items-center justify-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-brand-light" />
              <span>Official Lore & Storyline</span>
            </div>
            <p className="text-sm sm:text-base text-zinc-200 font-serif italic leading-relaxed">
              &ldquo;{lore}&rdquo;
            </p>
          </div>

          {/* Emergency Quarantine Alert Banner */}
          {isQuarantined && (
            <div className="max-w-lg mx-auto p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>EMERGENCY QUARANTINE: Public downloads temporarily halted by Doki.</span>
            </div>
          )}

          {/* CTA Cluster */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <MagneticButton
              onClick={handleDownload}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-xs font-semibold text-white bg-brand hover:bg-brand-hover transition-all shadow-inner-light shadow-brand/30 cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Modpack Build</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/80" />
            </MagneticButton>

            <a
              href="#about-doki"
              onClick={() => sound.playClick()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900/60 hover:bg-zinc-900 border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>About Doki&apos;s Mission</span>
            </a>

            <a
              href="#catalog"
              onClick={() => sound.playClick()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 bg-black/40 hover:bg-zinc-900 border border-white/[0.06] transition-all cursor-pointer"
            >
              <span>View Full Catalog</span>
            </a>
          </div>

          {/* Technical Specs Strip */}
          <div className="pt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-12 border-t border-white/[0.06] text-center font-mono">
            <div className="hover:scale-105 transition-transform duration-200">
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">Fabric 0.16.5</div>
              <div className="text-[11px] text-zinc-500 uppercase tracking-wider mt-0.5">Mod Loader</div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/[0.06]" />
            <div className="hover:scale-105 transition-transform duration-200">
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">1.20.1</div>
              <div className="text-[11px] text-zinc-500 uppercase tracking-wider mt-0.5">Minecraft Version</div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/[0.06]" />
            <div className="hover:scale-105 transition-transform duration-200">
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">Java 21</div>
              <div className="text-[11px] text-zinc-500 uppercase tracking-wider mt-0.5">Runtime</div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/[0.06]" />
            <div className="hover:scale-105 transition-transform duration-200">
              <div className="text-xl sm:text-2xl font-bold text-brand-light tracking-tight">6 GB – 8 GB</div>
              <div className="text-[11px] text-zinc-500 uppercase tracking-wider mt-0.5">Allocated RAM</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

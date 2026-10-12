import React from 'react';
import { ShieldCheck, Heart, Sparkles, Compass, Download, BookOpen } from 'lucide-react';
import { useDoki } from '../context/DokiContext';
import { BorderBeam } from './BorderBeam';

export const AboutDokiSection: React.FC = () => {
  const { platformConfig } = useDoki();

  const copy = platformConfig?.aboutDokiCopy || `Doki's Modpacks is the dedicated home for high-quality, custom-crafted Minecraft adventures. Every modpack is meticulously configured, tested for balance, and enriched with bespoke lore and survival mechanics.
Our flagship release, Minecraft 2: Biohazard, reimagines the post-Ender Dragon survival journey in an Overworld consumed by a mysterious biological plague. Through this platform, players can explore rich lore, preview interactive 3D voxel mechanics, read comprehensive survival guides, and download official client builds directly.`;

  const paragraphs = copy.split('\n').filter(p => p.trim().length > 0);

  return (
    <section id="about-doki" className="py-24 relative border-t border-white/[0.06] bg-[#0A0B10]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl bg-zinc-950/80 border border-white/[0.08] shadow-2xl p-8 sm:p-12 overflow-hidden">
          <BorderBeam size={280} duration={14} />

          {/* Header Tag */}
          <div className="flex items-center justify-between pb-6 border-b border-white/[0.08] mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand/10 border border-brand/30 flex items-center justify-center text-brand-light">
                <Heart className="w-5 h-5 fill-brand/20" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-brand-light font-bold block">
                  Author & Platform Mission
                </span>
                <h3 className="text-xl sm:text-2xl font-sans font-bold text-white tracking-tight">
                  About Doki&apos;s Modpacks
                </h3>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-brand-light" />
              <span>Curated by Doki</span>
            </div>
          </div>

          {/* Body Content */}
          <div className="space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
            {paragraphs.map((para, idx) => (
              <p key={idx} className="leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 mt-10 border-t border-white/[0.08]">
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/[0.05] space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-brand-light">
                <Compass className="w-4 h-4" />
                <span>Bespoke Storylines</span>
              </div>
              <p className="text-[11px] text-zinc-400">Deep, immersive lore rooted in post-Ender Dragon survival mystery.</p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/[0.05] space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-cyan-400">
                <Sparkles className="w-4 h-4" />
                <span>Meticulous Balance</span>
              </div>
              <p className="text-[11px] text-zinc-400">Zero duplicate items or broken recipe exploits. Tailored progression.</p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/[0.05] space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-indigo-400">
                <Download className="w-4 h-4" />
                <span>Direct Client Builds</span>
              </div>
              <p className="text-[11px] text-zinc-400">High-speed anycast CDN mirrors and verified client archives for 1-click installs.</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

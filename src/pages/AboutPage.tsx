import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  Layers, 
  ArrowRight, 
  Compass, 
  Heart, 
  Award,
  Zap,
  Package
} from 'lucide-react';
import { useDoki } from '../context/DokiContext';
import { sound } from '../utils/sound';
import { BorderBeam } from '../components/BorderBeam';

export const AboutPage: React.FC = () => {
  const { platformConfig, featuredModpack } = useDoki();

  const officialCopy = platformConfig?.aboutDokiCopy || 
    `Doki's Modpacks is the dedicated home for high-quality, custom-crafted Minecraft adventures. Every modpack is meticulously configured, tested for balance, and enriched with bespoke lore and survival mechanics.\n\nOur flagship release, Minecraft 2: Biohazard, reimagines the post-Ender Dragon survival journey in an Overworld consumed by a mysterious biological plague. Through this platform, players can explore rich lore, preview interactive 3D voxel mechanics, read comprehensive survival guides, and download official client builds directly.`;

  return (
    <div className="pt-24 pb-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Top Hero Banner */}
      <div className="relative rounded-3xl bg-zinc-950/80 border border-white/[0.08] p-8 sm:p-12 overflow-hidden shadow-2xl">
        <BorderBeam size={260} duration={14} />

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/30 text-[11px] font-mono font-bold text-brand-light uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creative Mission & Craftsmanship</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
            About Doki&apos;s Modpacks
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-sans">
            Bridging cinematic storytelling, surgical game balance, and high-performance server engineering for Minecraft enthusiasts.
          </p>
        </div>
      </div>

      {/* Official Narrative Manifesto Box */}
      <section className="rounded-2xl bg-zinc-900/40 border border-white/[0.08] p-6 sm:p-10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand/10 border border-brand/30 flex items-center justify-center text-brand-light">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-brand-light font-bold">
              Official Platform Manifesto
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-white/10">
            Authored by Doki
          </span>
        </div>

        <div className="space-y-4 text-sm sm:text-base text-zinc-200 leading-relaxed font-sans whitespace-pre-line">
          {officialCopy}
        </div>
      </section>

      {/* Core Design Pillars Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-brand-light font-bold block">
            The Standard
          </span>
          <h2 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight">
            What Sets Our Modpacks Apart
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Every build is engineered to deliver seamless 60+ FPS stability, coherent progression, and unforgettable narrative beats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-zinc-950/60 border border-white/[0.08] hover:border-brand/40 space-y-4 transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center text-brand-light">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-sans font-bold text-white">Narrative-Driven Survival</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No generic kitchen-sink packs. Every mod is chosen to serve an interconnected storyline, questline, and survival dilemma.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-zinc-950/60 border border-white/[0.08] hover:border-brand/40 space-y-4 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-sans font-bold text-white">Surgical Optimization</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Tuned JVM flags (ZGC, Generational Shenandoah), Iris Shaders presets, and Sodium engine parity ensure silky performance.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-zinc-950/60 border border-white/[0.08] hover:border-brand/40 space-y-4 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-sans font-bold text-white">Meticulous Balance</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Recipes, loot tables, and mob scaling are manually adjusted to prevent game-breaking power creep and maintain tension.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-2xl bg-zinc-950/60 border border-white/[0.08] hover:border-brand/40 space-y-4 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-sans font-bold text-white">Direct Client Mirrors</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              High-speed verified Google Drive mirrors, single-click zip import, and zero ad-wall hurdles for players.
            </p>
          </div>
        </div>
      </section>

      {/* Flagship Biohazard Feature Box */}
      {featuredModpack && (
        <div className="p-8 sm:p-10 rounded-3xl bg-zinc-950/80 border border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-[11px] font-mono uppercase tracking-wider text-brand-light font-bold">
              Flagship Experience
            </span>
            <h3 className="text-2xl font-sans font-bold text-white">
              Ready to delve into {featuredModpack.title}?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Overcome the Overworld plague, synthesize advanced vaccines, and find the lost trail to return to The End.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/modpack/${featuredModpack.slug}`}
              onClick={() => sound.playClick()}
              className="px-5 py-3 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-[1.02] shadow-xl"
            >
              <span>View Modpack Story & Specs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/catalog"
              onClick={() => sound.playClick()}
              className="px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white text-xs font-mono transition-colors"
            >
              <span>Explore Full Catalog</span>
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};

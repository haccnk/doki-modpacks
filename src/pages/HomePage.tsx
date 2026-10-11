import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  BookOpen, 
  Cpu, 
  ChevronRight, 
  ArrowRight, 
  Download, 
  Sparkles, 
  Layers, 
  LifeBuoy,
  Disc as Discord,
  Facebook
} from 'lucide-react';
import { useDoki } from '../context/DokiContext';
import { Hero } from '../components/Hero';
import { sound } from '../utils/sound';
import { BorderBeam } from '../components/BorderBeam';

export const HomePage: React.FC = () => {
  const { featuredModpack, modpacks, platformConfig } = useDoki();
  const navigate = useNavigate();

  const title = featuredModpack?.title || 'Minecraft 2: Biohazard';
  const announcementText = platformConfig?.announcementText || `Flagship Release: ${title} is Live`;
  const announcementUrl = platformConfig?.announcementUrl || `/modpack/${featuredModpack?.slug || 'minecraft-2-biohazard'}`;

  return (
    <div className="space-y-10 pb-24">
      
      {/* Flagship Hero Section */}
      <Hero onGetStarted={() => navigate('/catalog')} />

      {/* Hub Navigation Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-2 mb-10">
          <span className="text-[11px] font-mono uppercase tracking-wider text-brand-light font-bold block">
            Doki&apos;s Modpacks Platform Hub
          </span>
          <h2 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight">
            Explore Dedicated Sections
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Navigate through our curated catalog, bespoke storylines, community helpdesk, and server engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Modpack Catalog */}
          <Link
            to="/catalog"
            onClick={() => sound.playClick()}
            className="group relative rounded-2xl liquid-glass liquid-glass-item p-6 flex flex-col justify-between space-y-6 transition-all hover:bg-zinc-900/40 shadow-xl overflow-hidden cursor-pointer"
          >
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center text-brand-light group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-sans font-bold text-white group-hover:text-brand-light transition-colors">
                    Modpack Catalog
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900/80 text-zinc-400 border border-white/10">
                    {modpacks.length} Packs
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Browse our full collection of custom Minecraft adventures with direct downloads and lifecycle tracking.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono text-brand-light group-hover:translate-x-1 transition-transform">
              <span>Open Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 2: About Doki & Lore */}
          <Link
            to="/about"
            onClick={() => sound.playClick()}
            className="group relative rounded-2xl liquid-glass liquid-glass-item p-6 flex flex-col justify-between space-y-6 transition-all hover:bg-zinc-900/40 shadow-xl overflow-hidden cursor-pointer"
          >
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-brand-gradient/10 border border-brand-gradient/30 flex items-center justify-center text-brand-light group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-sans font-bold text-white group-hover:text-brand-light transition-colors">
                  About Doki & Lore
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Discover the author&apos;s story, the post-Ender Dragon Overworld plague origins, and our design philosophy.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono text-brand-light group-hover:translate-x-1 transition-transform">
              <span>Read Lore Mission</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 3: Get Help & Community (NEW) */}
          <Link
            to="/help"
            onClick={() => sound.playClick()}
            className="group relative rounded-2xl liquid-glass liquid-glass-item border-[#5865F2]/30 hover:border-[#5865F2]/70 p-6 flex flex-col justify-between space-y-6 transition-all hover:bg-[#5865F2]/5 shadow-xl overflow-hidden cursor-pointer"
          >
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/30 flex items-center justify-center text-[#5865F2] group-hover:scale-110 transition-transform">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-sans font-bold text-white group-hover:text-indigo-300 transition-colors">
                    Get Help & Discord
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900/80 text-indigo-400 border border-[#5865F2]/30">
                    Community
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Join our official Discord or Facebook community for installation help, crash log analysis, and ticket support.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span>Join Community</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 4: Engineering Suite */}
          <Link
            to="/engineering"
            onClick={() => sound.playClick()}
            className="group relative rounded-2xl liquid-glass liquid-glass-item p-6 flex flex-col justify-between space-y-6 transition-all hover:bg-zinc-900/40 shadow-xl overflow-hidden cursor-pointer"
          >
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-sans font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Engineering Suite
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Interactive CI pipeline simulator, Grafana observability, Scala Pekko engine, C4 architecture, and CLI sandbox.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>Launch Dev Suite</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>

        {/* Featured Modpack Preview Strip */}
        {featuredModpack && (
          <div className="mt-12 rounded-3xl liquid-glass p-6 sm:p-10 relative overflow-hidden shadow-2xl">
            <BorderBeam size={260} duration={14} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-brand-light font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Flagship Feature Spotlight</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight">
                  {featuredModpack.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl">
                  {featuredModpack.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-brand/10 text-brand-light border border-brand/30">
                    MC {featuredModpack.specs.minecraftVersion}
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-white/10">
                    {featuredModpack.specs.modLoader}
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-zinc-900 text-emerald-400 border border-white/10">
                    RAM: {featuredModpack.specs.recommendedRam}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-end gap-3">
                <Link
                  to={`/modpack/${featuredModpack.slug}`}
                  onClick={() => sound.playClick()}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-all"
                >
                  <span>View Details & Specs</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/catalog"
                  onClick={() => sound.playClick()}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white text-xs font-mono text-center transition-colors"
                >
                  <span>Full Catalog</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

    </div>
  );
};

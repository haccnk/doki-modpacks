import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ChevronRight, 
  Calendar, 
  Edit3, 
  Heart, 
  ShieldCheck, 
  Award,
  Terminal,
  FileText
} from 'lucide-react';
import { useDoki } from '../context/DokiContext';
import { sound } from '../utils/sound';
import { BorderBeam } from '../components/BorderBeam';

const DEFAULT_CREDITS_CONTENT = `### Modding Community & Library Authors
We express our deepest gratitude to the Minecraft modding community and fabricMC developers whose groundbreaking libraries make these adventures possible:
* **Fabric Project & Loom Team** – For the lightweight, modular modding framework.
* **CaffeineMC (JellySquid & Contributors)** – For Sodium, Lithium, and Phosphor rendering optimizations.
* **Iris Shaders Team** – For next-generation shader pipeline support.
* **Bespoke Environmental Designers** – For biome expansions, atmospheric audio engines, and creature models.

---

### Project Leadership & Direction
* **Doki** – Lead Pack Architect, Balance Engineer, Lore Design & System Integration.
* **PackOps Engineering Fleet** – High-speed distribution infrastructure, telemetry pipelines, and security protocols.

---

### Special Thanks
* Dedicated Alpha & Closed Demo Playtesters who hunted down desync glitches and memory leaks.
* The community members across Discord and Facebook for continuous feedback and bug reports.

*All third-party mods belong to their respective authors and are distributed in accordance with their respective open-source and modpack distribution licenses.*`;

export const CreditsPage: React.FC = () => {
  const { platformConfig, isAdmin } = useDoki();
  const navigate = useNavigate();

  const title = platformConfig?.creditsTitle || 'Credits & Acknowledgments';
  const subtitle = platformConfig?.creditsSubtitle || "Honoring the mod authors, engineers, testers, and community contributors who bring Doki's modpack worlds to life.";
  const lastUpdated = platformConfig?.creditsLastUpdated || 'October 2026';
  const content = platformConfig?.creditsContent || DEFAULT_CREDITS_CONTENT;

  return (
    <div className="pt-24 pb-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Breadcrumbs & Admin Edit Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-zinc-200">Credits & Attributions</span>
        </nav>

        {isAdmin && (
          <button
            onClick={() => {
              sound.playClick();
              navigate('/admin?tab=credits');
            }}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Credits Page (Admin)</span>
          </button>
        )}
      </div>

      {/* Hero Header Card */}
      <div className="relative rounded-3xl bg-zinc-950/80 border border-white/[0.08] p-6 sm:p-10 space-y-4 overflow-hidden shadow-2xl">
        <BorderBeam size={280} duration={16} />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300">
          <Award className="w-3.5 h-3.5 text-brand-light" />
          <span>OFFICIAL ATTRIBUTION RECORD</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
          {title}
        </h1>

        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans max-w-2xl">
          {subtitle}
        </p>

        <div className="pt-2 flex items-center gap-2 font-mono text-xs text-zinc-400">
          <Calendar className="w-3.5 h-3.5 text-brand-light" />
          <span>Last Updated: {lastUpdated}</span>
        </div>
      </div>

      {/* Main Text Content Body */}
      <article className="rounded-3xl liquid-glass liquid-glass-item border border-white/[0.08] p-6 sm:p-12 shadow-2xl relative">
        <div className="space-y-6 text-zinc-200 font-sans leading-relaxed text-sm sm:text-base">
          {content.split('\n\n').map((paragraph, idx) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;

            // Header 3
            if (trimmed.startsWith('### ')) {
              return (
                <div key={idx} className="pt-4 first:pt-0 border-b border-white/[0.06] pb-2">
                  <h2 className="text-lg sm:text-xl font-bold font-sans text-white tracking-tight flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-light shrink-0" />
                    <span>{trimmed.replace(/^###\s+/, '')}</span>
                  </h2>
                </div>
              );
            }

            // Divider
            if (trimmed === '---') {
              return <hr key={idx} className="border-t border-white/[0.08] my-6" />;
            }

            // Italic notice at bottom
            if (trimmed.startsWith('*') && trimmed.endsWith('*') && !trimmed.includes('\n* ')) {
              return (
                <p key={idx} className="text-xs font-mono text-zinc-400 italic pt-4 border-t border-white/[0.06]">
                  {trimmed.replace(/^\*|\*$/g, '')}
                </p>
              );
            }

            // List block
            if (trimmed.includes('\n* ') || trimmed.startsWith('* ')) {
              const lines = trimmed.split('\n');
              return (
                <ul key={idx} className="space-y-2.5 my-3 pl-2">
                  {lines.map((line, lIdx) => {
                    const cleanLine = line.replace(/^\*\s+/, '').trim();
                    if (!cleanLine) return null;

                    // Parse bold leader if present e.g. **Fabric Project** – description
                    const boldMatch = cleanLine.match(/^\*\*([^*]+)\*\*(.*)/);
                    if (boldMatch) {
                      return (
                        <li key={lIdx} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-light mt-1.5 shrink-0" />
                          <div>
                            <strong className="text-white font-semibold">{boldMatch[1]}</strong>
                            <span className="text-zinc-400">{boldMatch[2]}</span>
                          </div>
                        </li>
                      );
                    }

                    return (
                      <li key={lIdx} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-light mt-1.5 shrink-0" />
                        <span>{cleanLine}</span>
                      </li>
                    );
                  })}
                </ul>
              );
            }

            // Standard Paragraph
            return (
              <p key={idx} className="text-zinc-300 leading-relaxed text-xs sm:text-sm">
                {trimmed}
              </p>
            );
          })}
        </div>
      </article>

      {/* Community Recognition Footer Callout */}
      <div className="p-6 rounded-2xl bg-zinc-950/60 border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center text-brand-light shrink-0">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-sans font-bold text-white">Want your mod or translation listed?</h4>
            <p className="text-xs text-zinc-400">Join our Discord community or submit an issue to collaborate.</p>
          </div>
        </div>

        <Link
          to="/help"
          onClick={() => sound.playClick()}
          className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-mono text-white transition-colors whitespace-nowrap"
        >
          Join Discord Hub
        </Link>
      </div>
    </div>
  );
};

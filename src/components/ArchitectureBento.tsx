import React from 'react';
import { 
  Layers, 
  GitMerge, 
  Cpu, 
  RotateCcw, 
  Lock, 
  Webhook, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';

export const ArchitectureBento: React.FC = () => {
  return (
    <section id="architecture" className="py-24 relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono text-zinc-400">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>PLATFORM ARCHITECTURE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
            Built for modern engineering teams.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Every layer of PackOps has been engineered to eliminate manual toil, reduce build times, and provide complete visibility.
          </p>
        </div>

        {/* Bento Grid with Dynamic Cursor Spotlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          
          {/* Card 1: Multi-Loader Matrix (Large 2 cols) */}
          <SpotlightCard className="md:col-span-2 p-7 group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-indigo-400">
                <GitMerge className="w-5 h-5" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold tracking-wider">
                  UNIFIED MANIFEST
                </span>
                <h3 className="text-xl font-sans font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Multi-Loader Matrix
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
                  Maintain a single canonical `packops.yaml` configuration. PackOps automatically transpiles and distributes compliant builds for Fabric, Forge, NeoForge, and Quilt simultaneously.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center gap-3 text-[11px] font-mono text-zinc-400">
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.06] text-zinc-300">Fabric 0.16</span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.06] text-zinc-300">Forge 47.3</span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.06] text-zinc-300">NeoForge 20.4</span>
            </div>
          </SpotlightCard>

          {/* Card 2: Atomic Rollbacks in 1.2s (1 col) */}
          <SpotlightCard className="md:col-span-1 p-6 group space-y-4">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-emerald-400">
              <RotateCcw className="w-5 h-5" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider">
                SAFETY FIRST
              </span>
              <h3 className="text-lg font-sans font-bold text-white group-hover:text-emerald-300 transition-colors">
                Atomic Rollbacks
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                If a mod regression introduces memory leaks, instantly flip the active edge pointer back to any stable release in under 1.2 seconds.
              </p>
            </div>
          </SpotlightCard>

          {/* Card 3: Ephemeral CI Sandbox (1 col) */}
          <SpotlightCard className="md:col-span-1 p-6 group space-y-4">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider">
                ZERO OVERHEAD
              </span>
              <h3 className="text-lg font-sans font-bold text-white group-hover:text-cyan-300 transition-colors">
                Headless Sandboxes
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Pre-warmed Linux containers verify chunk generation and mod tick loops without launching GUI windows.
              </p>
            </div>
          </SpotlightCard>

          {/* Card 4: Automated Storefront Sync (2 cols) */}
          <SpotlightCard className="md:col-span-2 p-6 group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-violet-400">
                <Webhook className="w-5 h-5" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-violet-400 font-bold tracking-wider">
                  DISTRIBUTION API
                </span>
                <h3 className="text-xl font-sans font-bold text-white group-hover:text-violet-300 transition-colors">
                  CurseForge & Modrinth Webhooks
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
                  A single `packops deploy` authenticates with CurseForge and Modrinth APIs, formats Markdown changelogs from your Git commits, and verifies file signatures automatically.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
              <span>Automatic Git-to-Changelog parsing</span>
              <span className="text-indigo-400 flex items-center gap-1 font-mono text-[11px]">
                API Spec <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </SpotlightCard>

          {/* Card 5: Role-Based Workspaces (2 cols) */}
          <SpotlightCard className="md:col-span-2 p-6 group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/[0.08] flex items-center justify-center text-amber-400">
                <Lock className="w-5 h-5" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider">
                  TEAM COLLABORATION
                </span>
                <h3 className="text-xl font-sans font-bold text-white group-hover:text-amber-300 transition-colors">
                  Studio Workspaces & RBAC
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
                  Collaborate across config editors, quest writers, and shader artists. Assign granular permissions, require 2-person release approvals, and audit deploy logs.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
              <span>SOC2 Type II certified infrastructure</span>
              <span className="text-emerald-400 font-mono text-[11px]">2FA & SSO Ready</span>
            </div>
          </SpotlightCard>

        </div>

      </div>
    </section>
  );
};

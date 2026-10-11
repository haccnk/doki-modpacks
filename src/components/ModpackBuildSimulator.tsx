import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Sparkles, 
  Terminal, 
  ExternalLink,
  ChevronRight,
  Flame,
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { BorderBeam } from './BorderBeam';
import { MagneticButton } from './MagneticButton';
import { useToast } from '../context/ToastContext';
import { sound } from '../utils/sound';

type BuildStatus = 'idle' | 'running' | 'conflict_detected' | 'resolved' | 'completed';

interface PipelineStage {
  id: string;
  name: string;
  desc: string;
  durationMs: number;
  status: 'pending' | 'active' | 'success' | 'warning';
}

export const ModpackBuildSimulator: React.FC = () => {
  const [status, setStatus] = useState<BuildStatus>('idle');
  const [currentStageIndex, setCurrentStageIndex] = useState(-1);
  const [simulateConflict, setSimulateConflict] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const { showToast } = useToast();

  const stages: PipelineStage[] = [
    { id: 'deps', name: 'Dependency Lockfile', desc: 'Resolving 184 mod manifests & transitive Maven hashes', durationMs: 400, status: 'pending' },
    { id: 'asm', name: 'ASM Bytecode Scanner', desc: 'Scanning 14,200 classes for conflicting mixin inject points', durationMs: 500, status: 'pending' },
    { id: 'dag', name: 'Mixin DAG Conflict Solver', desc: 'Topological sort resolving class injector priorities', durationMs: 600, status: 'pending' },
    { id: 'delta', name: 'Deterministic Jar Packager', desc: 'SHA-256 byte-identical deduplication & bsdiff slicing', durationMs: 450, status: 'pending' },
    { id: 'cdn', name: 'Anycast Edge Broadcast', desc: 'Replicating signed artifacts across 12 global edge POPs', durationMs: 350, status: 'pending' },
  ];

  const [activeStages, setActiveStages] = useState(stages);

  const startBuild = () => {
    if (status === 'running') return;
    sound.playBurst();
    setStatus('running');
    setCurrentStageIndex(0);
    setProgress(0);
    setLogs([
      `[${new Date().toLocaleTimeString()}] INF > Starting PackOps build run v2.4.0-rc...`,
      `[${new Date().toLocaleTimeString()}] INF > Workspace: production-modpack.json (184 mods)`,
    ]);

    let stageIdx = 0;
    const runNextStage = () => {
      if (stageIdx >= stages.length) {
        // Complete
        setProgress(100);
        setStatus('completed');
        sound.playSuccess();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#6366F1', '#10B981', '#06B6D4', '#8B5CF6']
        });
        showToast('Modpack build passed: 184 mods packaged deterministically in 2.3s', 'success');
        setLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] OK  > Build complete: 24.2 MB final jar (Delta: 1.4 MB)`,
          `[${new Date().toLocaleTimeString()}] OK  > Global hash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`,
        ]);
        return;
      }

      setCurrentStageIndex(stageIdx);
      setProgress(Math.round(((stageIdx + 1) / stages.length) * 100));

      // Handle synthetic conflict on stage 2 (Mixin DAG)
      if (stageIdx === 2 && simulateConflict) {
        setStatus('conflict_detected');
        sound.playFault();
        setLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] WRN > Detected Mixin collision: net.minecraft.client.renderer.LevelRenderer`,
          `[${new Date().toLocaleTimeString()}] WRN > Target injected by SodiumMixin (priority 1000) & IrisMixin (priority 1000)`,
          `[${new Date().toLocaleTimeString()}] INF > Applying automatic topological reorder: IrisMixin -> priority 1010`,
        ]);

        setTimeout(() => {
          setStatus('resolved');
          sound.playSuccess();
          setLogs(prev => [
            ...prev,
            `[${new Date().toLocaleTimeString()}] OK  > Mixin DAG conflict resolved automatically via AST transform!`,
          ]);
          stageIdx++;
          setTimeout(runNextStage, 600);
        }, 1200);
        return;
      }

      // Normal stage log
      setLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] INF > [${stages[stageIdx].name}] complete in ${stages[stageIdx].durationMs}ms`,
      ]);

      stageIdx++;
      setTimeout(runNextStage, 600);
    };

    setTimeout(runNextStage, 300);
  };

  const resetBuild = () => {
    sound.playClick();
    setStatus('idle');
    setCurrentStageIndex(-1);
    setProgress(0);
    setLogs([]);
  };

  return (
    <section id="build-simulator" className="py-24 relative overflow-hidden bg-[#090A0E] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand-light text-xs font-mono mb-4">
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Interactive Engineering Sandbox</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Live Modpack Build & Conflict Pipeline
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Experience the automated bytecode resolution engine. Trigger a synthetic production build, simulate mixin collisions between high-performance mods, and watch the AST solver restore compatibility in real time.
          </p>
        </div>

        {/* Sandbox Glass Card */}
        <div className="relative rounded-2xl bg-zinc-950/80 border border-white/[0.08] shadow-2xl backdrop-blur-xl overflow-hidden p-6 sm:p-8">
          <BorderBeam size={280} duration={12} delay={2} />

          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-brand animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold">
                Pipeline Runner: Modpack v2.4 (Fabric 0.15.11 + 184 Mods)
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Conflict Simulation Toggle */}
              <label className="flex items-center gap-2 text-xs font-mono text-zinc-400 cursor-pointer select-none bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-white/[0.06] hover:border-white/20 transition-colors">
                <input 
                  type="checkbox" 
                  checked={simulateConflict} 
                  onChange={(e) => {
                    sound.playClick();
                    setSimulateConflict(e.target.checked);
                    showToast(e.target.checked ? 'Enabled synthetic Mixin conflict simulation' : 'Disabled conflict simulation', 'info');
                  }}
                  className="rounded border-zinc-700 text-brand focus:ring-brand bg-zinc-800"
                />
                <span>Simulate Mixin Collision</span>
              </label>

              {/* Start Button */}
              <MagneticButton
                onClick={startBuild}
                disabled={status === 'running' || status === 'conflict_detected'}
                className="px-4 py-2 rounded-lg bg-brand hover:bg-brand-hover text-white text-xs font-mono font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-brand/20 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{status === 'running' ? 'Building...' : status === 'completed' ? 'Re-run Build' : 'Start Build Run'}</span>
              </MagneticButton>

              {/* Reset */}
              {status !== 'idle' && (
                <button
                  onClick={resetBuild}
                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/[0.06] text-xs transition-colors cursor-pointer"
                  title="Reset Sandbox"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 mb-8">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
              <span className="flex items-center gap-2">
                <span>Progress:</span>
                <span className="text-white font-semibold">{progress}%</span>
              </span>
              <span className="text-zinc-500">
                {status === 'idle' && 'Waiting for execution'}
                {status === 'running' && 'Pipeline active: resolving dependencies & bytecode AST'}
                {status === 'conflict_detected' && '⚠️ Conflict detected: Applying topological DAG sort'}
                {status === 'resolved' && '✅ Conflict resolved automatically'}
                {status === 'completed' && '✨ Build finished: All 184 mods verified'}
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/[0.06]">
              <motion.div 
                className={`h-full rounded-full transition-all duration-300 ${
                  status === 'conflict_detected' 
                    ? 'bg-amber-400' 
                    : status === 'completed' 
                    ? 'bg-emerald-500' 
                    : 'bg-brand'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 5 Pipeline Stages Visualizer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {stages.map((stage, idx) => {
              const isCurrent = currentStageIndex === idx && status === 'running';
              const isPast = currentStageIndex > idx || status === 'completed';
              const isConflict = idx === 2 && (status === 'conflict_detected' || status === 'resolved');

              return (
                <div 
                  key={stage.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent 
                      ? 'bg-brand/10 border-brand shadow-lg shadow-brand/15'
                      : isConflict && status === 'conflict_detected'
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                      : isPast
                      ? 'bg-zinc-900/90 border-emerald-500/30 text-zinc-200'
                      : 'bg-zinc-900/40 border-white/[0.05] text-zinc-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-semibold">0{idx + 1}. Stage</span>
                    {isPast ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-brand animate-ping" />
                    ) : isConflict && status === 'conflict_detected' ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-zinc-700" />
                    )}
                  </div>
                  <div className="text-xs font-semibold text-white mb-1 tracking-tight truncate">
                    {stage.name}
                  </div>
                  <div className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {stage.desc}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lower Grid: Real-time Terminal Log & Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Terminal Window */}
            <div className="lg:col-span-2 rounded-xl bg-black/90 border border-white/[0.08] p-4 font-mono text-xs overflow-hidden flex flex-col h-64">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 text-zinc-400 text-[11px]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                  <span>packops-worker-daemon.log</span>
                </div>
                <span className="text-[10px] text-zinc-500">Live Stream stdout</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin text-zinc-300 font-mono text-[11px]">
                {logs.length === 0 ? (
                  <div className="text-zinc-600 italic py-8 text-center">
                    Ready. Click &quot;Start Build Run&quot; to execute the pipeline sandbox.
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`leading-relaxed ${
                        log.includes('OK') ? 'text-emerald-400' :
                        log.includes('WRN') ? 'text-amber-400 font-semibold' :
                        log.includes('INF') ? 'text-zinc-300' : 'text-brand-light'
                      }`}
                    >
                      {log}
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Performance Metrics Bento */}
            <div className="rounded-xl bg-zinc-900/60 border border-white/[0.08] p-5 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-4 flex items-center justify-between">
                  <span>Engine Telemetry</span>
                  <Sparkles className="w-3.5 h-3.5 text-brand-light" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
                    <span className="text-xs text-zinc-400">Total Build Time:</span>
                    <span className="text-xs font-mono font-semibold text-emerald-400">
                      {status === 'completed' ? '2.34s' : status === 'running' ? 'measuring...' : '0.00s'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
                    <span className="text-xs text-zinc-400">Class Injections:</span>
                    <span className="text-xs font-mono font-semibold text-white">
                      14,200 ASM Nodes
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
                    <span className="text-xs text-zinc-400">Mixin DAG Cycles:</span>
                    <span className="text-xs font-mono font-semibold text-brand-light">
                      0 Cycles (Acyclic)
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
                    <span className="text-xs text-zinc-400">Delta Compression:</span>
                    <span className="text-xs font-mono font-semibold text-cyan-400">
                      94.2% Bandwidth Saved
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] text-zinc-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Deterministic reproducible bytecode guarantee enforced by SHA-256 tree.</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

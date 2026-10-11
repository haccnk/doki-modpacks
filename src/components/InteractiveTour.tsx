import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  Cpu, 
  Zap, 
  Terminal, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Cloud, 
  Activity, 
  Code,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  Play,
  RotateCcw,
  Sliders,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { FEATURE_TOURS } from '../data/saasData';
import { useToast } from '../context/ToastContext';
import { BorderBeam } from './BorderBeam';
import { sound } from '../utils/sound';

export const InteractiveTour: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<string>('resolver');
  const [copiedCmd, setCopiedCmd] = useState(false);
  const { showToast } = useToast();

  // Tab 1 state: Resolver scan simulator
  const [isScanning, setIsScanning] = useState(false);
  const [scannedClasses, setScannedClasses] = useState(12410);

  // Tab 2 state: CI pipeline runner simulator
  const [ciRunning, setCiRunning] = useState(false);
  const [ciStep, setCiStep] = useState(3); // 0=idle, 1=container, 2=worldboot, 3=done

  // Tab 3 state: Delta CDN dynamic calculator
  const [packSizeMb, setPackSizeMb] = useState(420);

  // Tab 4 state: Crash deobfuscation simulator
  const [isDeobfuscating, setIsDeobfuscating] = useState(false);
  const [isDeobfuscated, setIsDeobfuscated] = useState(true);

  const activeTour = FEATURE_TOURS.find(t => t.id === activeTabId) || FEATURE_TOURS[0];

  const handleCopyCmd = async (cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
      sound.playSuccess();
      setCopiedCmd(true);
      showToast(`Copied to clipboard: ${cmd}`, 'success');
      setTimeout(() => setCopiedCmd(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Run Resolver Simulation
  const handleTriggerScan = () => {
    sound.playBurst();
    setIsScanning(true);
    setScannedClasses(0);
    showToast('Starting bytecode dependency scan...', 'info');

    let current = 0;
    const interval = setInterval(() => {
      current += 2482;
      if (current >= 12410) {
        current = 12410;
        clearInterval(interval);
        setIsScanning(false);
        sound.playSuccess();
        showToast('Bytecode analysis complete: 0 collisions detected', 'success');
      }
      setScannedClasses(current);
    }, 120);
  };

  // Run CI Pipeline Simulation
  const handleTriggerCi = () => {
    sound.playBurst();
    setCiRunning(true);
    setCiStep(1);
    showToast('Spinning up ephemeral Linux test sandbox...', 'info');

    setTimeout(() => {
      setCiStep(2);
      sound.playClick();
      showToast('Headless world booted, verifying tick loop...', 'info');
      setTimeout(() => {
        setCiStep(3);
        setCiRunning(false);
        sound.playSuccess();
        showToast('CI build passed! PR #142 verified stable.', 'success');
        try {
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#6366F1', '#10B981', '#A855F7']
          });
        } catch (e) {}
      }, 1000);
    }, 1000);
  };

  // Deobfuscate Toggle
  const handleToggleDeobfuscate = () => {
    sound.playClick();
    setIsDeobfuscating(true);
    setTimeout(() => {
      setIsDeobfuscated(!isDeobfuscated);
      setIsDeobfuscating(false);
      sound.playSuccess();
      showToast(
        !isDeobfuscated 
          ? 'Stack trace symbolicated via Mojang official mappings' 
          : 'Showing raw obfuscated intermediary bytecode',
        'info'
      );
    }, 400);
  };

  // Dynamic Delta Calculations
  const deltaSizeMb = (packSizeMb * 0.035).toFixed(1);
  const bandwidthSavedMb = (packSizeMb - parseFloat(deltaSizeMb)).toFixed(1);
  const monthlySavings = ((parseFloat(bandwidthSavedMb) * 25000) / (1024 * 1024) * 0.08).toFixed(2);

  return (
    <section id="workflows" className="py-24 relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono text-zinc-400">
            <Zap className="w-3.5 h-3.5 text-brand-light" />
            <span>INTERACTIVE FEATURE TOUR</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
            Workflows designed for speed.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Test the live interactive engineering sandboxes below. Experience how PackOps replaces manual troubleshooting with automated intelligence.
          </p>
        </div>

        {/* Interactive Tour Main Card with BorderBeam */}
        <div className="max-w-5xl mx-auto rounded-2xl bg-[#0C0D13] border border-white/[0.08] shadow-2xl overflow-hidden relative">
          <BorderBeam size={300} duration={14} />

          {/* Top Workflow Switcher Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/[0.08] bg-zinc-950/70" role="tablist">
            {FEATURE_TOURS.map((tour) => {
              const isActive = activeTabId === tour.id;
              return (
                <button
                  key={tour.id}
                  onClick={() => {
                    sound.playSwitch();
                    setActiveTabId(tour.id);
                  }}
                  role="tab"
                  aria-selected={isActive}
                  className={`p-4 text-left transition-all relative cursor-pointer ${
                    isActive 
                      ? 'bg-zinc-900/70 text-white font-medium' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                    {tour.badge}
                  </div>
                  <div className="text-xs sm:text-sm font-sans font-semibold truncate">
                    {tour.title}
                  </div>
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand shadow-[0_0_12px_rgb(var(--color-brand))]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Workflow Content Grid */}
          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Descriptive info & Highlights (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold text-brand-light uppercase tracking-wider">
                  {activeTour.badge}
                </span>
                <h3 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight">
                  {activeTour.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {activeTour.fullDesc}
                </p>
              </div>

              {/* Bullet highlights */}
              <div className="space-y-2.5">
                {activeTour.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-brand-light shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Metric readouts */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06]">
                {activeTour.metrics.map((m, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/[0.06] hover:border-brand/40 transition-colors">
                    <div className="text-sm font-mono font-bold text-white">{m.value}</div>
                    <div className="text-[10px] font-mono text-zinc-500 truncate">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Terminal command trigger */}
              {activeTour.terminalCommand && (
                <div className="pt-1">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950 border border-white/[0.08] text-xs font-mono text-zinc-300">
                    <span className="truncate">$ {activeTour.terminalCommand}</span>
                    <button
                      onClick={() => handleCopyCmd(activeTour.terminalCommand!)}
                      className="p-1 text-zinc-400 hover:text-white transition-colors"
                      title="Copy command"
                    >
                      {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Live Interactive Simulated UI Mockup (7 cols) */}
            <div className="lg:col-span-7">
              <div className="rounded-xl bg-[#090A0F] border border-white/[0.08] shadow-2xl overflow-hidden font-mono text-xs">
                
                {/* Simulated Window Chrome */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/80 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"></span>
                    <span className="text-[11px] text-zinc-500 ml-2">packops-workbench // {activeTour.id}.ts</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-sans">Active</span>
                  </div>
                </div>

                {/* Dynamic Mockup Body per Tab with Interactive Controls */}
                <div className="p-5 space-y-4">
                  
                  {/* TAB 1: RESOLVER MOCKUP */}
                  {activeTour.id === 'resolver' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-zinc-400">Bytecode ASM Class Registry</span>
                        <button
                          onClick={handleTriggerScan}
                          disabled={isScanning}
                          className="px-2.5 py-1 rounded bg-brand/15 hover:bg-brand/25 text-brand-light border border-brand/30 text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <RotateCcw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
                          <span>{isScanning ? 'Scanning...' : 'Re-run Scan'}</span>
                        </button>
                      </div>

                      {/* Scan Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-zinc-500">
                          <span>Classes Analyzed</span>
                          <span className="text-white font-bold">{scannedClasses} / 12,410</span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                          <motion.div 
                            className="bg-brand h-1.5 rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: `${(scannedClasses / 12410) * 100}%` }}
                            transition={{ ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-zinc-950 border border-white/[0.06] space-y-1.5 text-zinc-300">
                        <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
                          <span className="text-zinc-200">net.minecraft.client.renderer.LevelRenderer</span>
                          <span className="text-emerald-400 font-mono">0 collisions ✔</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
                          <span className="text-zinc-200">net.minecraft.world.entity.LivingEntity</span>
                          <span className="text-brand-light font-mono">Auto-merged priority (1000)</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-zinc-200">net.minecraft.server.MinecraftServer</span>
                          <span className="text-emerald-400 font-mono">Synthetic bridge ok</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-brand/10 border border-brand/20 text-brand-light text-[11px] flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-brand-light shrink-0" />
                        <span>Fabric & Forge ABI verified compatible. Zero client crashes expected.</span>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: CI/CD PIPELINE MOCKUP */}
                  {activeTour.id === 'ci-cd' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-zinc-400">Headless PR Sandbox Pipeline</span>
                        <button
                          onClick={handleTriggerCi}
                          disabled={ciRunning}
                          className="px-2.5 py-1 rounded bg-brand/15 hover:bg-brand/25 text-brand-light border border-brand/30 text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Play className={`w-3 h-3 ${ciRunning ? 'animate-pulse' : ''}`} />
                          <span>{ciRunning ? 'Testing...' : 'Simulate Run'}</span>
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        <div className={`p-2.5 rounded-lg bg-zinc-950 border transition-colors flex items-center justify-between ${
                          ciStep >= 1 ? 'border-emerald-500/30 text-zinc-200' : 'border-white/[0.06] text-zinc-500'
                        }`}>
                          <span>1. Spin Ephemeral Container</span>
                          <span className="text-emerald-400">{ciStep >= 1 ? '0.8s ✔' : 'Pending'}</span>
                        </div>

                        <div className={`p-2.5 rounded-lg bg-zinc-950 border transition-colors flex items-center justify-between ${
                          ciStep >= 2 ? 'border-emerald-500/30 text-zinc-200' : 'border-white/[0.06] text-zinc-500'
                        }`}>
                          <span>2. Headless World Boot & Tick Loop</span>
                          <span className="text-emerald-400">{ciStep >= 2 ? '2.1s (20.0 TPS) ✔' : 'Pending'}</span>
                        </div>

                        <div className={`p-2.5 rounded-lg bg-zinc-950 border transition-colors flex items-center justify-between ${
                          ciStep >= 3 ? 'border-emerald-500/30 text-zinc-200' : 'border-white/[0.06] text-zinc-500'
                        }`}>
                          <span>3. Heap Allocation Profiler Check</span>
                          <span className="text-emerald-400">{ciStep >= 3 ? '0.4s (Zero GC leaks) ✔' : 'Pending'}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] flex items-center justify-between text-[11px]">
                        <span className="text-zinc-400">Total Run Time: <strong className="text-white">3.3s</strong></span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>PR #142 GREEN</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: DELTA CDN MOCKUP */}
                  {activeTour.id === 'delta-cdn' && (
                    <div className="space-y-4">
                      {/* Dynamic Modpack Size Slider */}
                      <div className="space-y-1.5 p-3 rounded-lg bg-zinc-950 border border-white/[0.06]">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-400 flex items-center gap-1">
                            <Sliders className="w-3.5 h-3.5 text-brand-light" />
                            <span>Adjust Modpack Size:</span>
                          </span>
                          <span className="text-white font-bold">{packSizeMb} MB</span>
                        </div>
                        <input
                          type="range"
                          min="100"
                          max="1000"
                          step="20"
                          value={packSizeMb}
                          onChange={(e) => setPackSizeMb(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand"
                        />
                      </div>

                      {/* Visual Delta Comparison */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-zinc-400 text-[11px]">
                          <span>Standard Re-Download</span>
                          <span className="text-rose-400 font-bold">{packSizeMb} MB</span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-2">
                          <div className="bg-rose-500 h-2 rounded-full w-full" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-zinc-400 text-[11px]">
                          <span>PackOps Delta Payload</span>
                          <span className="text-emerald-400 font-bold">{deltaSizeMb} MB (-96.4%)</span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-2">
                          <div className="bg-emerald-500 h-2 rounded-full w-[3.5%]" />
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-zinc-950 border border-white/[0.06] text-zinc-400 text-[11px] flex justify-between items-center">
                        <span>Est. Monthly Bandwidth Saved</span>
                        <span className="text-brand-light font-bold font-mono">
                          ~{bandwidthSavedMb} MB/user (${monthlySavings}/mo)
                        </span>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: CRASH TELEMETRY MOCKUP */}
                  {activeTour.id === 'telemetry' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-zinc-400">Stack Trace Symbolication</span>
                        <button
                          onClick={handleToggleDeobfuscate}
                          disabled={isDeobfuscating}
                          className="px-2.5 py-1 rounded bg-brand/15 hover:bg-brand/25 text-brand-light border border-brand/30 text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-brand-light" />
                          <span>{isDeobfuscated ? 'Show Raw Obfuscated' : 'Apply Mappings'}</span>
                        </button>
                      </div>

                      <div className="p-3 rounded-lg bg-zinc-950 border border-white/[0.06] space-y-1.5 text-[11px]">
                        <div className="text-rose-400 font-bold flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>FATAL: NullPointerException in RenderTypeBuffer</span>
                        </div>
                        
                        {isDeobfuscated ? (
                          <div className="text-zinc-300 pl-5 space-y-1 font-mono text-[11px]">
                            <div className="text-zinc-400">at me.jellysquid.mods.sodium.client.render.SodiumWorldRenderer.render(...)</div>
                            <div className="text-emerald-400 font-bold">✔ Mapped to: LevelRendererMixin.onRenderBlockOutline()</div>
                          </div>
                        ) : (
                          <div className="text-zinc-500 pl-5 space-y-1 font-mono text-[11px]">
                            <div>at net.minecraft.class_761.method_22710(class_761.java:142)</div>
                            <div className="text-zinc-600">at net.minecraft.class_757.method_3188(class_757.java:89)</div>
                          </div>
                        )}
                      </div>

                      <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-[11px] flex items-center justify-between">
                        <span>Automated PR generated: #189 Fix GL context</span>
                        <span className="font-bold">Merged in 2m</span>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { 
  Layers, 
  GitBranch, 
  Cpu, 
  Database, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Code2, 
  FileCode,
  Share2,
  Workflow
} from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';
import { BorderBeam } from './BorderBeam';
import { sound } from '../utils/sound';

interface C4ComponentData {
  id: string;
  name: string;
  type: string;
  technology: string;
  purpose: string;
  interfaces: { name: string; signature: string; desc: string }[];
  dependencies: string[];
  externalSystems: string[];
}

export const C4ArchitectureViewer: React.FC = () => {
  const [selectedCompId, setSelectedCompId] = useState<string>('resolver');

  const components: C4ComponentData[] = [
    {
      id: 'parser',
      name: 'BytecodeScanner',
      type: 'Core Library',
      technology: 'Java 21 ASM Core & Byte Buddy',
      purpose: 'Parses all jar files in parallel, extracting @Mixin, @Inject, and @ModifyVariable targets ahead of launch.',
      interfaces: [
        { name: 'scanJars', signature: 'scanJars(List<File>): BytecodeIndex', desc: 'Indexes all class bytecode signatures' },
        { name: 'extractMixins', signature: 'extractMixins(BytecodeIndex): Set<MixinTarget>', desc: 'Extracts ASM injection points' }
      ],
      dependencies: ['packops-cache', 'virtual-fs'],
      externalSystems: ['Fabric Loom', 'Forge Gradle']
    },
    {
      id: 'resolver',
      name: 'ConflictSolver',
      type: 'Algorithmic Engine',
      technology: 'Rust & Tokio (High-Throughput DAG Solver)',
      purpose: 'Constructs a directed acyclic graph of all mixins, identifying overlapping injection targets and assigning safe injection priorities.',
      interfaces: [
        { name: 'resolveGraph', signature: 'resolve_graph(targets: &Vec<MixinTarget>) -> ResolutionReport', desc: 'Solves graph ordering and flags hard collisions' },
        { name: 'transpileConfigs', signature: 'transpile_configs(matrix: MultiLoaderMatrix) -> Result<BuildSpec>', desc: 'Outputs unified multi-loader build spec' }
      ],
      dependencies: ['BytecodeScanner', 'NeoForge ABI Rules'],
      externalSystems: ['CurseForge API', 'Modrinth Metadata']
    },
    {
      id: 'delta',
      name: 'DeltaEngine',
      type: 'Binary Compiler',
      technology: 'Go & bsdiff / zstd compression',
      purpose: 'Computes binary byte-level diffs between production releases, slashing download sizes by 96.4%.',
      interfaces: [
        { name: 'generateDelta', signature: 'GenerateDelta(baseRelease, targetRelease string) ([]byte, error)', desc: 'Outputs differential delta package' },
        { name: 'verifyIntegrity', signature: 'VerifyIntegrity(delta []byte, expectedSha string) bool', desc: 'Validates cryptographic checksum' }
      ],
      dependencies: ['ConflictSolver', 'S3 Object Storage'],
      externalSystems: ['Cloudflare Edge PoPs', 'Custom Launcher SDK']
    },
    {
      id: 'sandbox',
      name: 'HeadlessSandbox',
      type: 'Ephemeral MicroVM Runner',
      technology: 'Firecracker & Linux Namespaces',
      purpose: 'Boots containerized Minecraft server instances without GUI in 3.8s to verify chunk gen stability on every pull request.',
      interfaces: [
        { name: 'bootEphemeralServer', signature: 'boot_instance(config: InstanceConfig) -> VMHandle', desc: 'Spins up isolated microVM in 800ms' },
        { name: 'profileTickLoop', signature: 'profile_ticks(handle: VMHandle, duration_sec: u32) -> TelemetryStream', desc: 'Profiles TPS and memory allocations' }
      ],
      dependencies: ['ConflictSolver', 'Prometheus Agent'],
      externalSystems: ['GitHub Actions Runner', 'GitLab CI']
    },
    {
      id: 'telemetry',
      name: 'TelemetrySymbolicator',
      type: 'Ingestion Service',
      technology: 'Rust & Redis Stream Buffer',
      purpose: 'Ingests player runtime crashes, symbolicates obfuscated stack traces with official mappings, and triggers auto-fix PRs.',
      interfaces: [
        { name: 'symbolicateStack', signature: 'symbolicate(raw_trace: &str, mapping_version: &str) -> MappedTrace', desc: 'Translates obfuscated bytecode traces' },
        { name: 'groupSignatures', signature: 'group_incident(trace: &MappedTrace) -> IncidentGroup', desc: 'Deduplicates identical crash causes' }
      ],
      dependencies: ['Mojang Mapping Cache', 'PostgreSQL'],
      externalSystems: ['Discord Webhooks', 'Slack Enterprise']
    }
  ];

  const activeComp = components.find(c => c.id === selectedCompId) || components[1];

  return (
    <section id="architecture-c4" className="py-24 relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono text-zinc-400">
            <Workflow className="w-3.5 h-3.5 text-indigo-400" />
            <span>C4 COMPONENT LEVEL ARCHITECTURE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
            Container component boundaries.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Zooming into the <strong>PackOps Core Engine Container</strong>. Click any component node to inspect its internal responsibilities, interfaces, and cross-service dependencies:
          </p>
        </div>

        {/* C4 Container Boundary Box */}
        <div className="max-w-5xl mx-auto rounded-2xl bg-[#0B0C11] border border-white/[0.1] shadow-2xl p-6 sm:p-8 space-y-8 relative overflow-hidden">
          <BorderBeam size={280} duration={14} colorFrom="#6366F1" colorTo="#3B82F6" />

          {/* Container Tag */}
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Container Boundary</span>
              <h3 className="text-lg font-sans font-bold text-white">PackOps Core Engine Container</h3>
            </div>
            <div className="text-xs font-mono text-indigo-400">
              5 Core Components // High Concurrency
            </div>
          </div>

          {/* Interactive Component Nodes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {components.map((comp) => {
              const isActive = selectedCompId === comp.id;
              return (
                <button
                  key={comp.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedCompId(comp.id);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative group ${
                    isActive 
                      ? 'bg-brand/20 border-brand text-white shadow-lg shadow-brand/20' 
                      : 'bg-zinc-900/60 border-white/[0.06] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">{comp.type}</div>
                  <div className="font-sans font-semibold text-xs text-white truncate mt-1">{comp.name}</div>
                  <div className="text-[10px] font-mono text-brand-light/80 truncate mt-0.5">{comp.technology.split('&')[0]}</div>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active C4 Component Deep-Dive Inspection */}
          <div className="p-6 rounded-xl bg-zinc-950/80 border border-white/[0.08] space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
              <div>
                <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold">{activeComp.type}</span>
                <h4 className="text-xl font-sans font-bold text-white">{activeComp.name}</h4>
                <p className="text-xs text-zinc-400 mt-1 font-mono">Implemented in: {activeComp.technology}</p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Component Ready</span>
              </div>
            </div>

            {/* Purpose */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase text-zinc-500">Component Purpose</span>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                {activeComp.purpose}
              </p>
            </div>

            {/* Public Interfaces */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase text-zinc-500">Exposed Component Interfaces</span>
              <div className="space-y-2">
                {activeComp.interfaces.map((iface, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-black/60 border border-white/[0.04] space-y-1 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-400 font-bold">{iface.name}</span>
                      <span className="text-[10px] text-zinc-500">{iface.desc}</span>
                    </div>
                    <div className="text-zinc-300 text-[11px] break-all select-all">
                      <code>{iface.signature}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Relationships & External Systems */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/[0.06] text-xs font-mono">
              <div className="space-y-1">
                <span className="text-zinc-500 text-[10px] uppercase">Internal Dependencies</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeComp.dependencies.map((dep) => (
                    <span key={dep} className="px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.06] text-zinc-300 text-[11px]">
                      {dep}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-500 text-[10px] uppercase">External Container / System Calls</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeComp.externalSystems.map((ext) => (
                    <span key={ext} className="px-2 py-0.5 rounded bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 text-[11px]">
                      {ext}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

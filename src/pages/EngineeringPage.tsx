import React, { useState } from 'react';
import { 
  Cpu, 
  Activity, 
  Terminal, 
  Code2, 
  Smartphone, 
  Workflow, 
  Zap, 
  Layers, 
  Sliders, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { sound } from '../utils/sound';
import { ModpackBuildSimulator } from '../components/ModpackBuildSimulator';
import { GrafanaTelemetryPanel } from '../components/GrafanaTelemetryPanel';
import { ScalaStreamEngine } from '../components/ScalaStreamEngine';
import { C4ArchitectureViewer } from '../components/C4ArchitectureViewer';
import { InteractiveTour } from '../components/InteractiveTour';
import { ApiConsole } from '../components/ApiConsole';
import { FlutterCompanionPreview } from '../components/FlutterCompanionPreview';
import { CliPlayground } from '../components/CliPlayground';
import { ArchitectureBento } from '../components/ArchitectureBento';

type EngineeringToolTab = 
  | 'build'
  | 'grafana'
  | 'scala'
  | 'c4'
  | 'api'
  | 'flutter'
  | 'cli'
  | 'tour'
  | 'bento';

export const EngineeringPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EngineeringToolTab>('build');

  const tabs = [
    { id: 'build', label: 'CI/CD Pipeline', icon: Zap, color: 'text-amber-400' },
    { id: 'grafana', label: 'Grafana Telemetry', icon: Activity, color: 'text-emerald-400' },
    { id: 'scala', label: 'Scala Pekko Engine', icon: Cpu, color: 'text-cyan-400' },
    { id: 'c4', label: 'C4 Architecture', icon: Workflow, color: 'text-indigo-400' },
    { id: 'api', label: 'REST API & OpenAPI', icon: Code2, color: 'text-brand-light' },
    { id: 'flutter', label: 'Flutter Companion', icon: Smartphone, color: 'text-blue-400' },
    { id: 'cli', label: 'CLI Playground', icon: Terminal, color: 'text-zinc-300' },
    { id: 'tour', label: 'Interactive Tour', icon: Sparkles, color: 'text-purple-400' },
    { id: 'bento', label: 'Architecture Bento', icon: Layers, color: 'text-rose-400' },
  ];

  return (
    <div className="pt-24 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span>PackOps Suite</span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-zinc-200">Engineering & Observability Tools</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-sans font-bold text-white tracking-tight">
              Engineering Suite & Diagnostics
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Real-time telemetry, Pekko actor streams, C4 container topology, and interactive CI/CD pipelines.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-400 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>9 Interactive Dev Modules Live</span>
          </div>
        </div>
      </div>

      {/* Modern Sub-Tab Pill Bar */}
      <div className="p-1.5 rounded-2xl bg-zinc-950 border border-white/[0.08] flex items-center gap-1.5 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playSwitch();
                setActiveTab(tab.id as EngineeringToolTab);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-zinc-800 text-white shadow-lg border border-white/15 font-semibold scale-[1.02]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Component Container */}
      <div className="space-y-12">
        {activeTab === 'build' && (
          <div className="animate-in fade-in duration-200">
            <ModpackBuildSimulator />
          </div>
        )}

        {activeTab === 'grafana' && (
          <div className="animate-in fade-in duration-200">
            <GrafanaTelemetryPanel />
          </div>
        )}

        {activeTab === 'scala' && (
          <div className="animate-in fade-in duration-200">
            <ScalaStreamEngine />
          </div>
        )}

        {activeTab === 'c4' && (
          <div className="animate-in fade-in duration-200">
            <C4ArchitectureViewer />
          </div>
        )}

        {activeTab === 'api' && (
          <div className="animate-in fade-in duration-200">
            <ApiConsole />
          </div>
        )}

        {activeTab === 'flutter' && (
          <div className="animate-in fade-in duration-200">
            <FlutterCompanionPreview />
          </div>
        )}

        {activeTab === 'cli' && (
          <div className="animate-in fade-in duration-200">
            <CliPlayground />
          </div>
        )}

        {activeTab === 'tour' && (
          <div className="animate-in fade-in duration-200">
            <InteractiveTour />
          </div>
        )}

        {activeTab === 'bento' && (
          <div className="animate-in fade-in duration-200">
            <ArchitectureBento />
          </div>
        )}
      </div>

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  BarChart3, 
  Clock, 
  RefreshCw, 
  Server, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Sliders, 
  Code2, 
  Maximize2,
  Cpu,
  Database
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { BorderBeam } from './BorderBeam';
import { sound } from '../utils/sound';

export const GrafanaTelemetryPanel: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'5m' | '15m' | '1h' | '24h'>('5m');
  const [showPromQl, setShowPromQl] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [jitter, setJitter] = useState(0);
  const { showToast } = useToast();

  const handleRefresh = () => {
    sound.playBurst();
    setIsRefreshing(true);
    setJitter(Math.floor(Math.random() * 8) - 4);
    setTimeout(() => {
      setIsRefreshing(false);
      sound.playSuccess();
      showToast('Grafana telemetry synced from Prometheus (5m window)', 'info');
    }, 400);
  };

  // Simulate real-time metric variance
  useEffect(() => {
    const interval = setInterval(() => {
      setJitter((Math.random() - 0.5) * 6);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const rateValue = (4210 + jitter * 15).toFixed(0);
  const p95Latency = (18.4 + (jitter * 0.2)).toFixed(1);
  const p99Latency = (33.8 + (jitter * 0.4)).toFixed(1);
  const errorRate = Math.max(0.001, (0.002 + (jitter * 0.0002))).toFixed(4);

  return (
    <section id="observability" className="py-24 relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono text-zinc-400">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>GRAFANA OBSERVABILITY // RED & USE METHODS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
            Production telemetry at scale.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Real-time Grafana dashboard monitoring build worker fleets, PromQL telemetry queries, and edge distribution nodes using the RED (Rate, Errors, Duration) method.
          </p>
        </div>

        {/* Grafana Dashboard Frame */}
        <div className="max-w-5xl mx-auto rounded-2xl bg-[#111217] border border-white/[0.1] shadow-2xl overflow-hidden relative">
          <BorderBeam size={260} duration={12} colorFrom="#F59E0B" colorTo="#6366F1" />

          {/* Grafana Navigation Bar Header */}
          <div className="flex flex-wrap items-center justify-between p-4 bg-[#181B1F] border-b border-white/[0.08] gap-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-[#F59E0B]/20 border border-[#F59E0B]/40 flex items-center justify-center text-[#F59E0B]">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-sans font-bold text-sm text-white">PackOps Fleet // Global Edge & CI Runners</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    LIVE
                  </span>
                </div>
                <div className="text-[11px] font-mono text-zinc-400">Prometheus Datasource: `prom-prod-us-east.internal:9090`</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* PromQL Query Toggle */}
              <button
                onClick={() => {
                  sound.playSwitch();
                  setShowPromQl(!showPromQl);
                }}
                className={`px-2.5 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                  showPromQl 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                    : 'bg-zinc-800 text-zinc-300 hover:text-white'
                }`}
                title="View PromQL Prometheus queries"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>PromQL</span>
              </button>

              {/* Time Range Selector */}
              <div className="flex items-center bg-zinc-900 rounded p-0.5 border border-white/[0.06] text-xs font-mono">
                {(['5m', '15m', '1h', '24h'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      sound.playClick();
                      setTimeRange(r);
                      showToast(`Grafana time range changed to ${r}`, 'info');
                    }}
                    className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                      timeRange === r ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                title="Refresh metrics"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* PromQL Query Inspector Bar */}
          {showPromQl && (
            <div className="p-3 bg-black/60 border-b border-white/[0.08] text-[11px] font-mono text-amber-300/90 space-y-1 animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500">Query A:</span>
                <code>sum(rate(packops_api_requests_total&#123;env="production"&#125;[{timeRange}]))</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500">Query B:</span>
                <code>histogram_quantile(0.95, sum(rate(packops_build_duration_seconds_bucket[{timeRange}])) by (le))</code>
              </div>
            </div>
          )}

          {/* Grafana Panel Grid */}
          <div className="p-6 space-y-6">
            
            {/* ROW 1: THE RED METHOD (Rate, Errors, Duration) */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                RED Method // Service Performance
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Panel 1: Rate */}
                <div className="rounded-xl bg-[#181B1F] p-4 border border-white/[0.06] space-y-2 group hover:border-brand/40 transition-colors">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>REQUEST RATE (RPS)</span>
                    <Radio className="w-3.5 h-3.5 text-brand-light" />
                  </div>
                  <div className="text-3xl font-mono font-bold text-white tracking-tight">
                    {rateValue} <span className="text-xs text-zinc-500">req/s</span>
                  </div>
                  {/* Simulated Sparkline SVG with Brand Glow */}
                  <div className="h-10 w-full pt-1">
                    <svg className="w-full h-full overflow-visible text-brand" preserveAspectRatio="none" viewBox="0 0 100 20">
                      <path
                        d="M0,15 Q15,5 30,12 T60,8 T85,14 T100,6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="transition-all duration-500 drop-shadow-[0_0_8px_currentColor]"
                      />
                    </svg>
                  </div>
                </div>

                {/* Panel 2: Errors */}
                <div className="rounded-xl bg-[#181B1F] p-4 border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>ERROR RATE (%)</span>
                    <AlertTriangle className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-mono font-bold text-emerald-400 tracking-tight">
                    {errorRate}%
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 flex items-center justify-between pt-1">
                    <span>SLO Budget: &lt; 0.05%</span>
                    <span className="text-emerald-400">Normal</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-1.5 rounded-full w-[4%]" />
                  </div>
                </div>

                {/* Panel 3: Duration (P95 Latency) */}
                <div className="rounded-xl bg-[#181B1F] p-4 border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>P95 / P99 LATENCY</span>
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-mono font-bold text-cyan-300 tracking-tight">
                    {p95Latency} <span className="text-xs text-zinc-500">ms</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-1">
                    <span>P99: {p99Latency}ms</span>
                    <span className="text-cyan-400">Edge BGP</span>
                  </div>
                </div>

              </div>
            </div>

            {/* ROW 2: USE METHOD (Utilization, Saturation, Errors) */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                USE Method // Fleet Cluster Utilization
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Worker CPU Utilization */}
                <div className="rounded-xl bg-[#181B1F] p-4 border border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-indigo-400" />
                      <span>Headless Sandbox CPU Utilization</span>
                    </div>
                    <span className="text-white font-bold">28.4%</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-indigo-500 h-2 rounded-full w-[28.4%]" />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                      <span>48 Pods Active</span>
                      <span>Cluster Target: 65% max</span>
                    </div>
                  </div>
                </div>

                {/* Worker Memory Heap Saturation */}
                <div className="rounded-xl bg-[#181B1F] p-4 border border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Database className="w-4 h-4 text-amber-400" />
                      <span>JVM Heap Saturation (G1GC)</span>
                    </div>
                    <span className="text-white font-bold">2.1 GB / 8.0 GB (26%)</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-amber-500 h-2 rounded-full w-[26%]" />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                      <span>Garbage Collection Pauses: 12ms avg</span>
                      <span className="text-emerald-400">Zero OOM Triggers</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Dashboard Footer */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] flex flex-wrap items-center justify-between text-xs font-mono text-zinc-400 gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Alert Rule: 'P95 Latency &gt; 100ms' is healthy (0 active incidents)</span>
              </div>
              <span className="text-zinc-600">Grafana v11.2 Enterprise Engine</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

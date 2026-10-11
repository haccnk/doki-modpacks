import React, { useState, useEffect } from 'react';
import { 
  Workflow, 
  Cpu, 
  Activity, 
  Radio, 
  Zap, 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  ShieldAlert, 
  CheckCircle2, 
  Layers, 
  Flame, 
  Code2,
  Server
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { BorderBeam } from './BorderBeam';
import { motion } from 'framer-motion';
import { sound } from '../utils/sound';

export const ScalaStreamEngine: React.FC = () => {
  const [isBurstable, setIsBurstable] = useState(false);
  const [throughput, setThroughput] = useState(42000);
  const [actorState, setActorState] = useState<'healthy' | 'recovering' | 'supervising'>('healthy');
  const [copiedScala, setCopiedScala] = useState(false);
  const { showToast } = useToast();

  const scalaCode = `// PackOps Core Distributed Engine // Scala 3 & Apache Pekko Streams
package dev.packops.engine

import org.apache.pekko.actor.typed.{ActorRef, Behavior}
import org.apache.pekko.actor.typed.scaladsl.Behaviors
import org.apache.pekko.stream.scaladsl.{Flow, Sink, Source}
import org.apache.pekko.stream.OverflowStrategy

// Scala 3 Algebraic Data Types (ADTs)
enum BytecodeMessage derives CanEqual:
  case InspectJar(path: String, replyTo: ActorRef[ResolutionResult])
  case ProcessMixin(classBytes: Array[Byte])
  case StreamDelta(baseSha: String, targetSha: String)

object BytecodeStreamPipeline:
  // Pekko Streams Flow with Backpressure & Zero-Drop Buffer
  def parallelTransformer(concurrency: Int): Flow[BytecodeMessage, ProcessedClass, ?] =
    Flow[BytecodeMessage]
      .buffer(size = 8192, overflowStrategy = OverflowStrategy.backpressure)
      .mapAsync(concurrency): msg =>
        // Pure functional transformation via Cats Effect / IO
        AsyncBytecodeParser.parseClass(msg)`;

  const handleBurst = () => {
    sound.playBurst();
    setIsBurstable(true);
    setThroughput(118400);
    showToast('Reactive stream burst initiated: Throttling backpressure buffer to 8,192 events', 'info');

    setTimeout(() => {
      setThroughput(42000);
      setIsBurstable(false);
      sound.playSuccess();
      showToast('Stream returned to nominal steady-state (42,000 msgs/s)', 'success');
    }, 2800);
  };

  const handleSimulateFault = () => {
    sound.playFault();
    setActorState('recovering');
    showToast('Simulating node hardware fault... Triggering Pekko Supervisor Strategy', 'error');

    setTimeout(() => {
      setActorState('supervising');
      setTimeout(() => {
        setActorState('healthy');
        sound.playSuccess();
        showToast('Pekko Actor cluster auto-healed in 18ms with 0 dropped messages', 'success');
      }, 700);
    }, 600);
  };

  const handleCopyScala = async () => {
    try {
      await navigator.clipboard.writeText(scalaCode);
      sound.playSuccess();
      setCopiedScala(true);
      showToast('Copied Scala 3 Pekko Streams code', 'success');
      setTimeout(() => setCopiedScala(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section id="scala-engine" className="py-24 relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono text-zinc-400">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>SCALA 3 // APACHE PEKKO STREAMS & ACTOR CLUSTERING</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
            High-throughput reactive engine.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Powered by <strong>Scala 3</strong> and <strong>Apache Pekko Streams</strong>. Process hundreds of jar archives with non-blocking backpressure, zero-copy byte buffers, and self-healing actor supervision.
          </p>
        </div>

        {/* Engine Dashboard Box */}
        <div className="max-w-5xl mx-auto rounded-2xl bg-[#0C0D13] border border-white/[0.08] shadow-2xl overflow-hidden relative">
          <BorderBeam size={280} duration={12} colorFrom="#F43F5E" colorTo="#6366F1" />

          {/* Top Engine Bar */}
          <div className="flex flex-wrap items-center justify-between p-4 bg-zinc-950/80 border-b border-white/[0.08] gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Workflow className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-sans font-bold text-sm text-white">Pekko Distributed Actor Cluster</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    SCALA 3.4
                  </span>
                </div>
                <div className="text-[11px] font-mono text-zinc-400">Cluster Nodes: 12 Active Workers // Backpressure: Active</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleBurst}
                disabled={isBurstable}
                className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Zap className={`w-3.5 h-3.5 ${isBurstable ? 'animate-bounce text-amber-300' : ''}`} />
                <span>{isBurstable ? 'Surging (100k msgs)...' : 'Test Stream Burst'}</span>
              </button>

              <button
                onClick={handleSimulateFault}
                disabled={actorState !== 'healthy'}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Simulate Node Fault</span>
              </button>
            </div>
          </div>

          {/* Visual Actor Topology Grid */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Actor Pipeline Diagram */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                Reactive Stream Stages // Pekko Actor Mesh
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                
                {/* Actor 1 */}
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-2 relative group">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span>STAGE 1: INGEST</span>
                    <Radio className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div className="font-sans font-bold text-sm text-white">JarSourceActor</div>
                  <p className="text-[11px] text-zinc-400 font-mono">Zero-copy byte streaming from S3 Edge</p>
                  <div className="text-[10px] font-mono text-emerald-400">Backpressure: 0ms lag</div>
                </div>

                {/* Actor 2 */}
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-2 relative group">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span>STAGE 2: ASM</span>
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="font-sans font-bold text-sm text-white">BytecodeWorkerPool</div>
                  <p className="text-[11px] text-zinc-400 font-mono">Parses @Mixin bytecode targets in parallel</p>
                  <div className="text-[10px] font-mono text-cyan-400">16 Workers Allocated</div>
                </div>

                {/* Actor 3 */}
                <div className={`p-4 rounded-xl border space-y-2 relative transition-colors ${
                  actorState === 'healthy' ? 'bg-zinc-900/60 border-white/[0.06]' :
                  actorState === 'recovering' ? 'bg-rose-950/30 border-rose-500/50 animate-pulse' :
                  'bg-amber-950/30 border-amber-500/50'
                }`}>
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span>STAGE 3: SOLVER</span>
                    <Activity className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                  <div className="font-sans font-bold text-sm text-white">MixinDAGSupervisor</div>
                  <p className="text-[11px] text-zinc-400 font-mono">Stateful topological graph deduplication</p>
                  <div className={`text-[10px] font-mono font-bold ${
                    actorState === 'healthy' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {actorState === 'healthy' ? 'State: OK (Zero Drop)' : 'RestartSupervisorStrategy'}
                  </div>
                </div>

                {/* Actor 4 */}
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-2 relative group">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span>STAGE 4: SINK</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="font-sans font-bold text-sm text-white">DeltaPublisherSink</div>
                  <p className="text-[11px] text-zinc-400 font-mono">Pushes binary deltas to 310 Cloudflare PoPs</p>
                  <div className="text-[10px] font-mono text-emerald-400">HTTP/2 Multiplexing</div>
                </div>

              </div>
            </div>

            {/* Throughput Gauge Bar */}
            <div className="p-4 rounded-xl bg-black/50 border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-mono uppercase text-zinc-500">Live Stream Throughput</span>
                <div className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                  <span>{throughput.toLocaleString()}</span>
                  <span className="text-xs font-normal text-zinc-400 font-sans">class bytecode transforms / sec</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
                <div className="text-center sm:text-right">
                  <span className="text-zinc-500 block text-[10px]">Buffer Strategy</span>
                  <span className="text-rose-400 font-bold">Backpressure (0 drops)</span>
                </div>
                <div className="text-center sm:text-right">
                  <span className="text-zinc-500 block text-[10px]">JVM Memory Model</span>
                  <span className="text-emerald-400 font-bold">GraalVM Native</span>
                </div>
              </div>
            </div>

            {/* Scala 3 Code Sample */}
            <div className="rounded-xl bg-[#090A0F] border border-white/[0.08] overflow-hidden font-mono text-xs">
              <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/80 border-b border-white/[0.08]">
                <span className="text-[11px] text-zinc-400">src/main/scala/dev/packops/engine/BytecodeStreamPipeline.scala</span>
                <button
                  onClick={handleCopyScala}
                  className="text-zinc-500 hover:text-zinc-300 flex items-center gap-1 text-[11px]"
                >
                  {copiedScala ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScala ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-4 text-zinc-300 overflow-x-auto text-[11px] leading-relaxed">
                <pre><code>{scalaCode}</code></pre>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

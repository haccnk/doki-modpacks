import React, { useState } from 'react';
import { 
  Smartphone, 
  Layers, 
  Sparkles, 
  Zap, 
  Play, 
  Check, 
  Bell, 
  Server, 
  Radio, 
  Sliders, 
  Copy,
  ExternalLink,
  ShieldCheck,
  Code2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { BorderBeam } from './BorderBeam';
import { motion } from 'framer-motion';
import { sound } from '../utils/sound';

export const FlutterCompanionPreview: React.FC = () => {
  const [mobileTab, setMobileTab] = useState<'builds' | 'fleet' | 'alerts'>('builds');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [copiedDart, setCopiedDart] = useState(false);
  const { showToast } = useToast();

  const handleMobileDeploy = () => {
    sound.playBurst();
    setIsDeploying(true);
    showToast('Triggering remote deploy from Flutter Companion app...', 'info');

    setTimeout(() => {
      setIsDeploying(false);
      setDeploySuccess(true);
      sound.playSuccess();
      showToast('Deploy approved & released globally via Flutter Riverpod client', 'success');
      setTimeout(() => setDeploySuccess(false), 3000);
    }, 1200);
  };

  const dartCode = `// PackOps Mobile & Desktop Companion // Flutter 3.x + Riverpod 2.x
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

@riverpod
class BuildPipelineNotifier extends _$BuildPipelineNotifier {
  @override
  AsyncValue<PipelineStatus> build() => const AsyncValue.data(PipelineStatus.ready);

  Future<void> triggerDeploy() async {
    state = const AsyncValue.loading();
    // Impeller-accelerated 120fps spring animation
    state = await AsyncValue.guard(() async {
      final (buildId, duration) = await ref.read(packopsClientProvider).deployProduction();
      return PipelineStatus.deployed(buildId: buildId, seconds: duration);
    });
  }
}`;

  const handleCopyDart = async () => {
    try {
      await navigator.clipboard.writeText(dartCode);
      sound.playSuccess();
      setCopiedDart(true);
      showToast('Copied Flutter Dart 3 Riverpod sample', 'success');
      setTimeout(() => setCopiedDart(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section id="flutter" className="py-24 relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono text-zinc-400">
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>FLUTTER 3.X // MULTI-PLATFORM COMPANION & SDK</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
            Manage your fleet from anywhere.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Built with <strong>Flutter 3.x</strong>, <strong>Dart 3</strong>, and the <strong>Impeller 120fps engine</strong>. Experience unified mobile and desktop controls, Riverpod compile-time state, and biometric deployment approvals.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Interactive Mobile Mockup (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-[300px] h-[580px] rounded-[36px] bg-[#0E1017] border-4 border-zinc-800 shadow-2xl p-3 flex flex-col justify-between relative overflow-hidden">
              
              {/* Dynamic Island / Speaker */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1"></span>
                <span className="text-[9px] font-mono text-zinc-400">PackOps</span>
              </div>

              {/* Mobile Screen Content */}
              <div className="pt-8 px-2 flex-1 flex flex-col justify-between overflow-y-auto font-sans">
                
                {/* Top Mobile Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span>Aetheria Studios</span>
                    <span className="text-emerald-400 font-bold">120 FPS</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900 border border-white/[0.06] space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Active Release</span>
                    <div className="text-base font-bold text-white">Chronos v2.8.4</div>
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                      <span>✔ 284 mods verified</span>
                      <span>•</span>
                      <span>18ms CDN</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Push Notification */}
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-1 animate-in slide-in-from-top-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-indigo-300">
                    <span className="flex items-center gap-1">
                      <Bell className="w-3 h-3 text-indigo-400" />
                      <span>PR #142 GREEN</span>
                    </span>
                    <span>2m ago</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 font-sans">
                    Headless CI verified chunk generation stability in 3.8s.
                  </p>
                </div>

                {/* Remote Deploy Trigger Action */}
                <div className="space-y-2 pt-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleMobileDeploy}
                    disabled={isDeploying}
                    className={`w-full py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      deploySuccess
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/50'
                    }`}
                  >
                    {deploySuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Deployed to Edge!</span>
                      </>
                    ) : isDeploying ? (
                      <>
                        <Zap className="w-4 h-4 animate-spin text-amber-300" />
                        <span>Releasing Delta...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>1-Tap Edge Deploy</span>
                      </>
                    )}
                  </motion.button>
                  <p className="text-[10px] text-zinc-500 text-center font-mono">
                    Protected by FaceID Biometric Lock
                  </p>
                </div>

                {/* Bottom App Navigation */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-around text-zinc-400 text-[10px]">
                  <span className="text-indigo-400 font-bold">Builds</span>
                  <span>Fleet</span>
                  <span>Telemetry</span>
                  <span>Settings</span>
                </div>

              </div>

              {/* Home indicator bar */}
              <div className="w-28 h-1 bg-zinc-700 rounded-full mx-auto mt-2 mb-1" />

            </div>
          </div>

          {/* Right Column: Flutter 3 & Dart 3 Architecture Specs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                FLUTTER & DART 3 SDK
              </span>
              <h3 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight">
                Impeller 120 FPS Rendering & Riverpod State
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                The PackOps Flutter SDK powers native mobile, macOS, Windows, and Linux admin consoles with zero Jank. Uses Dart 3 records, sealed classes for build state machines, and Riverpod for declarative reactivity.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-900/60 border border-white/[0.06]">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Impeller Vulkan / Metal pipeline</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-900/60 border border-white/[0.06]">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Biometric FaceID / TouchID auth</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-900/60 border border-white/[0.06]">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Real-time WebSocket telemetry push</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-900/60 border border-white/[0.06]">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Single codebase for iOS & Desktop</span>
              </div>
            </div>

            {/* Dart 3 / Riverpod Code Sample */}
            <div className="rounded-xl bg-[#090A0F] border border-white/[0.08] overflow-hidden font-mono text-xs">
              <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/80 border-b border-white/[0.08]">
                <span className="text-[11px] text-zinc-400">lib/presentation/build_notifier.dart</span>
                <button
                  onClick={handleCopyDart}
                  className="text-zinc-500 hover:text-zinc-300 flex items-center gap-1 text-[11px]"
                >
                  {copiedDart ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDart ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-4 text-zinc-300 overflow-x-auto text-[11px] leading-relaxed">
                <pre><code>{dartCode}</code></pre>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

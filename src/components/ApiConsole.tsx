import React, { useState } from 'react';
import { 
  Code2, 
  Send, 
  Copy, 
  Check, 
  Key, 
  Layers, 
  Sliders, 
  Sparkles, 
  ShieldCheck, 
  CornerDownRight,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { BorderBeam } from './BorderBeam';
import { sound } from '../utils/sound';

export const ApiConsole: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<'build' | 'resolve' | 'delta'>('resolve');
  const [selectedLang, setSelectedLang] = useState<'curl' | 'typescript' | 'dart' | 'python'>('typescript');
  const [simulateError, setSimulateError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(200);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const endpoints = {
    resolve: {
      method: "POST",
      path: "/v1/mixins/resolve",
      desc: "Dry-run analyze bytecode dependencies and mixin collision graph ahead of runtime.",
      requestBody: {
        loader: "fabric",
        minecraft_version: "1.20.1",
        strict_mode: true,
        mods: [
          { id: "create", version: "0.5.1.f" },
          { id: "appliedenergistics2", version: "15.0.18" },
          { id: "iris", version: "1.7.0" }
        ]
      },
      successResponse: {
        status: "success",
        resolved_at: "2026-10-11T13:20:00Z",
        total_classes_scanned: 12410,
        conflicts_count: 0,
        compatible_loaders: ["fabric-0.16.5", "quilt-0.25.0"],
        resolution_hash: "sha256:7b91d9f04..."
      },
      errorResponse: {
        error: {
          code: "MIXIN_INJECTION_COLLISION",
          message: "Conflicting @Inject target in net.minecraft.client.renderer.LevelRenderer",
          target_class: "net.minecraft.client.renderer.LevelRenderer",
          conflicting_mods: ["sodium-v0.5.8.jar", "optifine-v1.20.1.jar"],
          suggested_fix: "Remove OptiFine; Iris and Embeddium already cover full shader pipeline.",
          documentation_url: "https://docs.packops.dev/errors/MIXIN_COLLISION"
        }
      }
    },
    build: {
      method: "POST",
      path: "/v1/modpacks/aetheria/builds",
      desc: "Trigger an automated headless container build with idempotency guarantee.",
      requestBody: {
        target_version: "v2.8.5",
        git_commit: "9f81ac3e",
        channel: "production",
        options: {
          generate_delta: true,
          headless_verification: true
        }
      },
      successResponse: {
        build_id: "bld_01jh92ka89z",
        status: "queued",
        idempotency_key: "idemp_9f81a7b82c",
        pipeline_url: "https://api.packops.dev/v1/builds/bld_01jh92ka89z",
        created_at: "2026-10-11T13:20:00Z"
      },
      errorResponse: {
        error: {
          code: "IDEMPOTENCY_CONFLICT",
          message: "A build with this idempotency key is already running.",
          existing_build_id: "bld_01jh92ka89z"
        }
      }
    },
    delta: {
      method: "GET",
      path: "/v1/artifacts/delta?base=v2.8.3&target=v2.8.4",
      desc: "Fetch pre-computed differential binary blocks between two releases.",
      requestBody: null,
      successResponse: {
        base_version: "v2.8.3",
        target_version: "v2.8.4",
        full_size_bytes: 438418290,
        delta_size_bytes: 15518920,
        compression_ratio: 0.0353,
        download_url: "https://cdn.packops.dev/deltas/v2.8.3-to-v2.8.4.pak",
        sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
      },
      errorResponse: {
        error: {
          code: "BASE_VERSION_NOT_FOUND",
          message: "Base artifact release 'v2.8.3' does not exist in registry."
        }
      }
    }
  };

  const current = endpoints[selectedEndpoint];

  const handleSend = () => {
    sound.playBurst();
    setIsLoading(true);
    showToast(`Sending ${current.method} ${current.path}...`, 'info');

    setTimeout(() => {
      setIsLoading(false);
      if (simulateError) {
        sound.playFault();
      } else {
        sound.playSuccess();
      }
      setResponseStatus(simulateError ? 409 : (current.method === 'POST' ? 201 : 200));
      showToast(
        simulateError 
          ? `HTTP 409 Conflict: ${current.errorResponse.error.code}` 
          : `HTTP ${current.method === 'POST' ? 201 : 200} OK (124ms roundtrip)`,
        simulateError ? 'error' : 'success'
      );
    }, 450);
  };

  // Generate code sample per language
  const getCodeSnippet = () => {
    switch (selectedLang) {
      case 'curl':
        return `curl -X ${current.method} "https://api.packops.dev${current.path}" \\
  -H "Authorization: Bearer pk_live_9482fa81..." \\
  -H "Idempotency-Key: idemp_${Date.now().toString(36)}" \\
  -H "Content-Type: application/json"${current.requestBody ? ` \\\n  -d '${JSON.stringify(current.requestBody, null, 2)}'` : ''}`;

      case 'typescript':
        return `import { PackOpsClient } from '@packops/sdk';

const packops = new PackOpsClient({ apiKey: process.env.PACKOPS_API_KEY });

const response = await packops.${selectedEndpoint === 'resolve' ? 'mixins.resolve' : selectedEndpoint === 'build' ? 'builds.trigger' : 'artifacts.getDelta'}(${
          current.requestBody ? JSON.stringify(current.requestBody, null, 2) : '"v2.8.3", "v2.8.4"'
        });

console.log(response);`;

      case 'dart':
        return `// Dart 3 / Flutter Dio SDK
import 'package:packops/packops.dart';

final client = PackOpsClient(apiKey: 'pk_live_9482fa81...');

final result = await client.${selectedEndpoint === 'resolve' ? 'resolveMixins' : selectedEndpoint === 'build' ? 'createBuild' : 'fetchDelta'}(
  ${current.requestBody ? '// Validated with Dart 3 Records\n' + JSON.stringify(current.requestBody, null, 2) : ''}
);`;

      case 'python':
        return `import httpx

headers = {
    "Authorization": "Bearer pk_live_9482fa81...",
    "Idempotency-Key": "idemp_9f81a7b82c"
}

response = httpx.${current.method.toLowerCase()}(
    "https://api.packops.dev${current.path}",
    headers=headers${current.requestBody ? `,\n    json=${JSON.stringify(current.requestBody, null, 2)}` : ''}
)

print(response.json())`;
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(getCodeSnippet());
      setCopied(true);
      showToast('API code snippet copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section id="api" className="py-24 relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono text-zinc-400">
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>REST API DESIGN PRINCIPLES // OPENAPI 3.1</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
            Developer-first API console.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Designed around idempotency keys, predictable semantic resources, RFC 7807 error envelopes, and cross-platform SDKs. Test the live interactive endpoint explorer:
          </p>
        </div>

        {/* API Console Box */}
        <div className="max-w-5xl mx-auto rounded-2xl bg-[#090A0F] border border-white/[0.08] shadow-2xl overflow-hidden font-mono text-xs">
          
          {/* Top Endpoint Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between p-3.5 bg-zinc-900/80 border-b border-white/[0.08] gap-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              {(['resolve', 'build', 'delta'] as const).map((epKey) => {
                const ep = endpoints[epKey];
                const isActive = selectedEndpoint === epKey;
                return (
                  <button
                    key={epKey}
                    onClick={() => {
                      setSelectedEndpoint(epKey);
                      setResponseStatus(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs transition-colors cursor-pointer ${
                      isActive 
                        ? 'bg-zinc-800 text-white border border-white/20' 
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      ep.method === 'POST' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {ep.method}
                    </span>
                    <span>{ep.path}</span>
                  </button>
                );
              })}
            </div>

            {/* Error simulation toggle */}
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simulateError}
                  onChange={(e) => setSimulateError(e.target.checked)}
                  className="rounded bg-zinc-800 border-zinc-700 text-indigo-500 focus:ring-0"
                />
                <span>Simulate 409 Conflict Error Envelope</span>
              </label>
            </div>
          </div>

          {/* Endpoint Documentation Summary */}
          <div className="px-5 py-3 bg-zinc-950/60 border-b border-white/[0.04] text-[11px] text-zinc-400 flex items-center justify-between">
            <span>{current.desc}</span>
            <span className="text-zinc-600">Rate Limit: 1,000 req/min</span>
          </div>

          {/* Code Generation Tabs (cURL, TypeScript, Dart, Python) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
            
            {/* Left Column: Request & Code Generator (6 cols) */}
            <div className="lg:col-span-6 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {(['typescript', 'dart', 'curl', 'python'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLang(lang)}
                      className={`px-2.5 py-1 rounded text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
                        selectedLang === lang 
                          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' 
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopyCode}
                  className="p-1 text-zinc-500 hover:text-zinc-300 flex items-center gap-1 text-[11px]"
                  title="Copy snippet"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Code Snippet Display */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.06] text-zinc-300 overflow-x-auto min-h-[220px]">
                <pre className="font-mono text-[11px] leading-relaxed">
                  <code>{getCodeSnippet()}</code>
                </pre>
              </div>

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer shadow-inner-light"
              >
                <Send className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Executing Request...' : `Send ${current.method} Request`}</span>
              </button>
            </div>

            {/* Right Column: Response Headers & Body (6 cols) */}
            <div className="lg:col-span-6 p-5 space-y-4 bg-zinc-950/40">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">Response Payload</span>
                {responseStatus && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    responseStatus >= 200 && responseStatus < 300 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    HTTP {responseStatus} {responseStatus >= 200 && responseStatus < 300 ? 'OK' : 'Conflict'}
                  </span>
                )}
              </div>

              {/* Standard Headers Inspection */}
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04] text-[10px] text-zinc-500 space-y-0.5 font-mono">
                <div>Content-Type: application/json; charset=utf-8</div>
                <div>X-RateLimit-Limit: 1000</div>
                <div>X-RateLimit-Remaining: 994</div>
                <div>X-Response-Time: 124ms</div>
              </div>

              {/* Response JSON Output */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.06] text-zinc-300 overflow-x-auto min-h-[220px]">
                <pre className="font-mono text-[11px] leading-relaxed">
                  <code>
                    {JSON.stringify(simulateError ? current.errorResponse : current.successResponse, null, 2)}
                  </code>
                </pre>
              </div>

              <div className="text-[11px] text-zinc-500 flex items-center justify-between">
                <span>Conforms to RFC 7807 Error Envelope Standard</span>
                <span className="text-emerald-400">Idempotency-Key Checked</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

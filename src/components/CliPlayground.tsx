import React, { useState, useEffect } from 'react';
import { Terminal, Play, RotateCcw, Copy, Check, ChevronRight, CheckCircle2 } from 'lucide-react';
import { CLI_COMMANDS } from '../data/saasData';
import { useToast } from '../context/ToastContext';
import { sound } from '../utils/sound';

export const CliPlayground: React.FC = () => {
  const [selectedCmd, setSelectedCmd] = useState<string>('packops check');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [visibleLinesCount, setVisibleLinesCount] = useState<number>(100);
  const [copied, setCopied] = useState<boolean>(false);
  const { showToast } = useToast();

  const commandData = CLI_COMMANDS[selectedCmd] || CLI_COMMANDS['packops check'];

  // Stream output line by line on execution
  const executeCommand = (cmdKey: string) => {
    sound.playBurst();
    setSelectedCmd(cmdKey);
    setIsRunning(true);
    setVisibleLinesCount(0);
    showToast(`Executing '${cmdKey}' in CLI sandbox...`, 'info');

    const totalLines = (CLI_COMMANDS[cmdKey] || CLI_COMMANDS['packops check']).output.length;
    let currentLine = 0;

    const interval = setInterval(() => {
      currentLine++;
      setVisibleLinesCount(currentLine);
      if (currentLine >= totalLines) {
        clearInterval(interval);
        setIsRunning(false);
        sound.playSuccess();
        showToast(`Command '${cmdKey}' completed successfully`, 'success');
      }
    }, 130);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(commandData.cmd);
      sound.playSuccess();
      setCopied(true);
      showToast(`Copied command: ${commandData.cmd}`, 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section id="cli" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono text-zinc-400">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>DEVELOPER CLI PLAYGROUND</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
            One CLI. Zero friction.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Run automated checks, generate binary delta packages, and deploy globally in a single line.
            Test the live streaming CLI emulator below:
          </p>
        </div>

        {/* Terminal Interactive Box */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-[#090A0F] border border-white/[0.08] shadow-2xl overflow-hidden font-mono text-xs">
          
          {/* Top Command Selector Bar */}
          <div className="flex flex-wrap items-center justify-between p-3 bg-zinc-900/70 border-b border-white/[0.08] gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"></span>
              <span className="text-[11px] text-zinc-500 ml-2">bash — 80x24 (streaming)</span>
            </div>

            {/* Clickable command presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {Object.keys(CLI_COMMANDS).map((cmdKey) => (
                <button
                  key={cmdKey}
                  onClick={() => executeCommand(cmdKey)}
                  disabled={isRunning}
                  className={`px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                    selectedCmd === cmdKey 
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40' 
                      : 'bg-zinc-800/60 text-zinc-400 hover:text-white border border-transparent'
                  }`}
                >
                  {cmdKey}
                </button>
              ))}
            </div>

            {/* Run Button */}
            <button
              onClick={() => executeCommand(selectedCmd)}
              disabled={isRunning}
              className="inline-flex items-center gap-1 px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-sans font-medium transition-colors cursor-pointer"
            >
              <Play className={`w-3 h-3 text-emerald-400 fill-emerald-400 ${isRunning ? 'animate-pulse' : ''}`} />
              <span>{isRunning ? 'Running...' : 'Execute'}</span>
            </button>
          </div>

          {/* Terminal Screen Body */}
          <div className="p-6 space-y-3 min-h-[280px] bg-black/50 overflow-x-auto">
            {/* Command input prompt */}
            <div className="flex items-center justify-between text-zinc-300">
              <div className="flex items-center gap-2">
                <span className="text-indigo-400">user@aetheria-dev</span>
                <span className="text-zinc-600">:</span>
                <span className="text-zinc-400">~/repo</span>
                <span className="text-indigo-400 font-bold">$</span>
                <span className="text-white font-bold">{commandData.cmd}</span>
                <span className="inline-block w-2 h-4 bg-indigo-400 animate-pulse ml-0.5" />
              </div>

              <button
                onClick={handleCopy}
                className="text-zinc-500 hover:text-zinc-300 flex items-center gap-1 text-[11px] transition-colors"
                title="Copy command"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <p className="text-[11px] text-zinc-500 italic pt-1 border-b border-white/[0.04] pb-2">
              # {commandData.description}
            </p>

            {/* Output lines streamed in real time */}
            <div className="space-y-1.5 pt-2">
              {commandData.output.slice(0, visibleLinesCount).map((line, idx) => (
                <div 
                  key={idx} 
                  className={`leading-relaxed animate-in fade-in duration-100 ${
                    line.startsWith('✔') ? 'text-emerald-400' :
                    line.startsWith('⚠') ? 'text-amber-400' :
                    line.startsWith('🚀') ? 'text-indigo-300 font-bold' :
                    'text-zinc-400'
                  }`}
                >
                  {line}
                </div>
              ))}

              {isRunning && (
                <div className="flex items-center gap-2 text-zinc-500 text-[11px] pt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                  <span>Processing bytecode operations...</span>
                </div>
              )}
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="px-6 py-2.5 bg-zinc-950/70 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-500">
            <span>PackOps CLI v2.8.4</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Daemon active & listening</span>
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

import { useDoki } from '../context/DokiContext';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  const { isAdmin } = useDoki();
  
  const shortcutGroups = [
    {
      title: 'Navigation & Focus',
      items: [
        { keys: ['⌘', 'K'], label: 'Open Command Palette' },
        { keys: ['?'], label: 'Toggle Keyboard Shortcuts HUD' },
        ...(isAdmin ? [{ keys: ['D'], label: 'Open Super Admin Modal' }] : []),
        { keys: ['Esc'], label: 'Close Active Modal or Palette' },
      ]
    },
    {
      title: 'Interactive Sandboxes',
      items: [
        { keys: ['B'], label: 'Jump to Modpack Build Sandbox' },
        { keys: ['G'], label: 'Jump to Grafana Telemetry Panel' },
        { keys: ['S'], label: 'Jump to Scala 3 Stream Engine' },
        { keys: ['A'], label: 'Jump to OpenAPI 3.1 Console' },
        { keys: ['C'], label: 'Jump to C4 Architecture' },
      ]
    },
    {
      title: 'Environment & Tone',
      items: [
        { keys: ['T'], label: 'Cycle Design Token Palette' },
        { keys: ['M'], label: 'Toggle Tactile Audio Feedback' },
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative w-full max-w-xl rounded-2xl bg-zinc-950 border border-white/10 shadow-2xl p-6 overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-brand/10 border border-brand/20 text-brand-light">
                  <Keyboard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white tracking-tight">
                    Keyboard Shortcuts HUD
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Navigate PackOps at the speed of thought.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="space-y-6">
              {shortcutGroups.map((group) => (
                <div key={group.title}>
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-2.5">
                    {group.title}
                  </h4>
                  <div className="space-y-1.5">
                    {group.items.map((item) => (
                      <div 
                        key={item.label}
                        className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 border border-white/[0.04] text-xs transition-colors"
                      >
                        <span className="text-zinc-300 font-medium">{item.label}</span>
                        <div className="flex items-center gap-1">
                          {item.keys.map((k) => (
                            <kbd 
                              key={k}
                              className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[11px] text-zinc-300 shadow-sm min-w-[22px] text-center"
                            >
                              {k}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Tip */}
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span className="flex items-center gap-1.5 text-brand-light">
                <Sparkles className="w-3 h-3" />
                <span>Tip: Press ? anywhere to toggle this guide</span>
              </span>
              <span>PackOps Dev Acceleration</span>
            </div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
};

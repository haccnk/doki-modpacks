import React, { useState, useEffect } from 'react';
import { Palette, Check, Sparkles, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { sound } from '../utils/sound';

import { ThemeAccent, ThemeConfig, themes } from '../data/themeData';


export const ThemeDial: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeAccent>('emerald');
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useToast();

  const applyTheme = (theme: ThemeConfig, notify: boolean = false) => {
    setCurrentTheme(theme.id);
    localStorage.setItem('doki_theme_accent', theme.id);
    const root = document.documentElement;

    // Direct CSS custom properties injection - guarantees 100% instant reactivity across all CSS and Tailwind rules!
    root.style.setProperty('--color-brand', theme.rgb);
    root.style.setProperty('--color-brand-hover', theme.rgbHover);
    root.style.setProperty('--color-brand-light', theme.rgbLight);
    root.style.setProperty('--color-brand-gradient', theme.rgbGrad);
    root.style.setProperty('--color-brand-hex', theme.hex);
    root.style.setProperty('--color-brand-gradient-hex', theme.gradHex);

    // Update classes on root and body
    themes.forEach(t => {
      root.classList.remove(t.className);
      document.body.classList.remove(t.className);
    });
    root.classList.add(theme.className);
    document.body.classList.add(theme.className);

    // Notify listeners (e.g. interactive canvas)
    window.dispatchEvent(new CustomEvent('doki-theme-change', { detail: theme }));

    if (notify) {
      showToast(`Accent theme switched to: ${theme.name}`, 'info');
    }
  };

  // Restore saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('doki_theme_accent') as ThemeAccent | null;
    const initialTheme = themes.find(t => t.id === saved) || themes[0];
    applyTheme(initialTheme, false);
  }, []);

  const handleSelectTheme = (theme: ThemeConfig) => {
    sound.playSwitch();
    applyTheme(theme, true);
    setIsOpen(false);
  };

  // Allow pressing 'T' anywhere to cycle theme
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 't' || e.key === 'T') {
        const currentIndex = themes.findIndex(t => t.id === currentTheme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        sound.playSwitch();
        applyTheme(nextTheme, true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTheme]);

  const activeTheme = themes.find(t => t.id === currentTheme) || themes[0];

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <div className="relative">
        
        {/* Toggle Floating Button */}
        <button
          onClick={() => {
            sound.playClick();
            setIsOpen(!isOpen);
          }}
          className="liquid-glass-item flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-950/70 border border-white/15 hover:border-brand/40 text-xs font-mono text-zinc-300 shadow-2xl backdrop-blur-xl transition-all active:scale-95 cursor-pointer group"
          title="Tailwind Design System // Accent Dial (Press 'T' to cycle)"
          aria-label="Toggle Theme Accent Dial"
        >
          <div 
            className="w-3.5 h-3.5 rounded-full transition-transform group-hover:scale-110 shadow-sm"
            style={{ backgroundColor: activeTheme.hex }}
          />
          <span className="hidden sm:inline-block font-sans font-medium text-white">Design Tokens</span>
          <kbd className="hidden sm:inline-block text-[9px] px-1 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-white/10">
            T
          </kbd>
          <Palette className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
        </button>

        {/* Dropdown Options */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-12 left-0 w-64 p-3 rounded-2xl liquid-glass border border-white/20 shadow-2xl space-y-2 backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between px-1 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                <span>Theme Design Tokens</span>
                <span className="text-brand-light flex items-center gap-1 font-mono">
                  <Sliders className="w-3 h-3" /> Live CSS
                </span>
              </div>

              <div className="space-y-1">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTheme(t)}
                    onMouseEnter={() => sound.playClick()}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      currentTheme === t.id 
                        ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/10' 
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-3.5 h-3.5 rounded-full ring-2 ring-white/10" 
                        style={{ backgroundColor: t.hex }}
                      />
                      <span>{t.name}</span>
                    </div>
                    {currentTheme === t.id ? (
                      <Check className="w-3.5 h-3.5 text-brand-light" />
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-600">{t.hex}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Active Token Inspector */}
              <div className="pt-2 border-t border-white/[0.06] text-[10px] font-mono text-zinc-400 bg-zinc-950/60 p-2 rounded-lg border border-white/[0.04] space-y-0.5">
                <div className="text-zinc-500">// Injected root token</div>
                <div className="text-brand-light">--color-brand: {activeTheme.rgb}</div>
                <div className="text-zinc-500 flex items-center gap-1">
                  <span>Hex:</span>
                  <span style={{ color: activeTheme.hex }}>{activeTheme.hex}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

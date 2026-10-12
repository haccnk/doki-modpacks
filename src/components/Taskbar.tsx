import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  BookOpen, 
  LifeBuoy, 
  Cpu, 
  ShieldCheck, 
  Search, 
  Volume2, 
  VolumeX, 
  Palette,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { sound } from '../utils/sound';
import { useDoki } from '../context/DokiContext';
import { themes } from '../data/themeData';

interface TaskbarProps {
  onOpenCommandPalette: () => void;
  onOpenShortcuts?: () => void;
  onOpenAdmin?: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({ 
  onOpenCommandPalette,
  onOpenShortcuts,
  onOpenAdmin
}) => {
  const { isAdmin, isEditingModpack } = useDoki();
  const location = useLocation();
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  if (isEditingModpack) {
    return null;
  }

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const cycleTheme = () => {
    sound.playSwitch();
    const stored = localStorage.getItem('doki_theme_accent') || localStorage.getItem('packops_theme_accent') || 'emerald';
    const currentIndex = themes.findIndex(t => t.id === stored);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    
    // Apply theme
    themes.forEach(t => {
      document.documentElement.classList.remove(t.className);
      document.body.classList.remove(t.className);
    });
    document.documentElement.classList.add(nextTheme.className);
    document.body.classList.add(nextTheme.className);

    document.documentElement.style.setProperty('--color-brand', nextTheme.rgb);
    document.documentElement.style.setProperty('--color-brand-hover', nextTheme.rgbHover);
    document.documentElement.style.setProperty('--color-brand-light', nextTheme.rgbLight);
    document.documentElement.style.setProperty('--color-brand-gradient', nextTheme.rgbGrad);
    document.documentElement.style.setProperty('--color-brand-hex', nextTheme.hex);
    document.documentElement.style.setProperty('--color-brand-gradient-hex', nextTheme.gradHex);

    localStorage.setItem('doki_theme_accent', nextTheme.id);
    localStorage.setItem('packops_theme_accent', nextTheme.id);
    window.dispatchEvent(new CustomEvent('doki-theme-change', { detail: nextTheme }));
  };

  const navItems = [
    { id: 'home', label: 'Home', path: '/', icon: Home, shortcut: 'H' },
    { id: 'catalog', label: 'Catalog', path: '/catalog', icon: Package, shortcut: 'C' },
    { id: 'about', label: 'About & Lore', path: '/about', icon: BookOpen, shortcut: 'A' },
    { id: 'help', label: 'Get Help', path: '/help', icon: LifeBuoy, shortcut: 'G' },
    { id: 'credits', label: 'Credits', path: '/credits', icon: Sparkles, shortcut: 'R' },
    { id: 'engineering', label: 'Engineering', path: '/engineering', icon: Cpu, shortcut: 'E' },
    { id: 'admin', label: 'Admin Hub', path: '/admin', icon: ShieldCheck, shortcut: 'D', adminOnly: false },
  ];

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none max-w-[calc(100vw-1rem)]">
      
      {/* Liquid Glass Floating Tooltip Bubble */}
      {hoveredTab && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-xl liquid-glass text-[11px] font-mono font-medium text-white shadow-2xl pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150 flex items-center gap-1.5 backdrop-blur-2xl border border-white/20">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          <span>{hoveredTab}</span>
        </div>
      )}

      {/* Main Liquid Glass Dock Bar */}
      <nav 
        className="liquid-glass-dock flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-2xl ring-1 ring-white/10 overflow-x-auto no-scrollbar shadow-2xl"
        aria-label="Liquid Glass Quick Taskbar"
      >
        {/* Core Page Navigation Items (Admin only visible to Admin) */}
        {navItems
          .filter((item) => item.id !== 'admin' || isAdmin)
          .map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => sound.playClick()}
              onMouseEnter={() => setHoveredTab(`${item.label} (${item.shortcut})`)}
              onMouseLeave={() => setHoveredTab(null)}
              className={`liquid-glass-item flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-medium cursor-pointer ${
                isActive
                  ? 'liquid-glass-active font-semibold'
                  : item.id === 'admin' && isAdmin
                  ? 'text-amber-400 hover:text-amber-200 border border-amber-500/30 bg-amber-500/10'
                  : 'text-zinc-300 hover:text-white border border-transparent'
              }`}
              aria-label={item.label}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.id === 'admin' ? 'text-amber-400' : 'text-zinc-300'}`} />
              <span className="hidden sm:inline-block font-sans text-xs">{item.label}</span>

              {/* Pulsing Liquid Dot */}
              {isActive && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-md shadow-white/80" />
              )}
            </NavLink>
          );
        })}

        {/* Specular Liquid Divider */}
        <div className="w-px h-5 sm:h-6 bg-white/15 mx-0.5 sm:mx-1" />

        {/* Search Command Palette Trigger */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenCommandPalette();
          }}
          onMouseEnter={() => setHoveredTab('Fast Search (Cmd+K)')}
          onMouseLeave={() => setHoveredTab(null)}
          className="liquid-glass-item flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl text-zinc-300 hover:text-white border border-transparent cursor-pointer font-mono"
          title="Search modpacks & pages (Cmd+K)"
          aria-label="Search"
        >
          <Search className="w-4 h-4 text-brand-light" />
          <span className="hidden md:inline text-[11px] text-zinc-400 font-bold">⌘K</span>
        </button>

        {/* Keyboard Shortcuts HUD */}
        {onOpenShortcuts && (
          <button
            onClick={() => {
              sound.playClick();
              onOpenShortcuts();
            }}
            onMouseEnter={() => setHoveredTab('Keyboard Shortcuts (?)')}
            onMouseLeave={() => setHoveredTab(null)}
            className="liquid-glass-item p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-white border border-transparent cursor-pointer"
            title="Shortcuts (?)"
            aria-label="Keyboard Shortcuts"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}

        {/* Theme Accent Dial Trigger */}
        <button
          onClick={cycleTheme}
          onMouseEnter={() => setHoveredTab('Cycle Theme Accent (T)')}
          onMouseLeave={() => setHoveredTab(null)}
          className="liquid-glass-item p-1.5 sm:p-2 rounded-xl text-zinc-300 hover:text-white border border-transparent cursor-pointer"
          title="Cycle Theme Accent"
          aria-label="Theme Accent Dial"
        >
          <Palette className="w-4 h-4 text-brand-light" />
        </button>

        {/* Tactile Audio SFX Toggle */}
        <button
          onClick={toggleSound}
          onMouseEnter={() => setHoveredTab(isMuted ? 'Unmute Tactile SFX' : 'Mute SFX (M)')}
          onMouseLeave={() => setHoveredTab(null)}
          className={`liquid-glass-item p-1.5 sm:p-2 rounded-xl border border-transparent cursor-pointer ${
            !isMuted 
              ? 'text-brand-light' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          aria-label="Toggle SFX Audio"
        >
          {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

      </nav>
    </div>
  );
};

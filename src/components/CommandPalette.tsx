import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Terminal, 
  Layers, 
  BookOpen, 
  Cpu, 
  ArrowRight, 
  X, 
  ExternalLink,
  Zap,
  Globe,
  Activity,
  Code2,
  Workflow,
  Smartphone,
  Package,
  ShieldCheck,
  Sliders,
  Volume2,
  HelpCircle,
  Download,
  LifeBuoy
} from 'lucide-react';
import { useDoki } from '../context/DokiContext';
import { sound } from '../utils/sound';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (target: string) => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  target: string;
  external?: boolean;
  subtitle?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ 
  isOpen, 
  onClose,
  onSelectAction 
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { modpacks, isAdmin } = useDoki();

  // Dynamic Modpack items
  const modpackItems: CommandItem[] = modpacks.map((m) => ({
    id: `modpack-${m.slug}`,
    title: `${m.title} [MC ${m.specs.minecraftVersion} • ${m.specs.modLoader}]`,
    category: "Doki's Modpacks",
    icon: Package,
    target: `/modpack/${m.slug}`,
    external: false,
    subtitle: m.description,
  }));

  // Download items
  const downloadItems: CommandItem[] = modpacks
    .filter(m => m.downloadMirror && !m.isQuarantined)
    .map((m) => ({
      id: `dl-${m.slug}`,
      title: `Download: ${m.title} (Official Mirror)`,
      category: 'Downloads',
      icon: Download,
      target: m.downloadMirror,
      external: true,
      subtitle: `Mirror link for ${m.title}`,
    }));

  // Page navigation items
  const pageItems: CommandItem[] = [
    { id: 'page-home', title: 'Home // Featured Showcase', category: 'Navigation', icon: SparklesIcon, target: '/', external: false },
    { id: 'page-catalog', title: 'Modpack Catalog // Full Archive', category: 'Navigation', icon: Layers, target: '/catalog', external: false },
    { id: 'page-about', title: 'About Doki // Narrative Lore & Storyline', category: 'Navigation', icon: BookOpen, target: '/about', external: false },
    { id: 'page-help', title: 'Get Help // Community Discord & Support Desk', category: 'Navigation', icon: LifeBuoy, target: '/help', external: false },
    { id: 'page-engineering', title: 'Engineering Suite // Telemetry & Dev Tools', category: 'Navigation', icon: Cpu, target: '/engineering', external: false },
    ...(isAdmin ? [{ id: 'page-admin', title: 'Super Admin Console // Modpack & Page Editor', category: 'Administration', icon: ShieldCheck, target: '/admin', external: false }] : []),
  ];

  // Action items
  const actionItems: CommandItem[] = [
    { id: 'act-shortcuts', title: 'Keyboard Shortcuts Cheatsheet', category: 'Quick Actions', icon: HelpCircle, target: 'action:shortcuts', external: false },
    { id: 'act-sound', title: 'Toggle Interface SFX Audio (Mute / Unmute)', category: 'Quick Actions', icon: Volume2, target: 'action:sound', external: false },
    ...(isAdmin ? [{ id: 'act-admin-modal', title: 'Open Quick Admin Modal Portal', category: 'Administration', icon: Sliders, target: 'admin-modal', external: false }] : []),
  ];

  const allItems = [...modpackItems, ...pageItems, ...downloadItems, ...actionItems];

  const filtered = allItems.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase()) || 
    a.category.toLowerCase().includes(query.toLowerCase()) ||
    (a.subtitle && a.subtitle.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global keyboard listener for Cmd+K / Ctrl+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onSelectAction('open');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onSelectAction]);

  if (!isOpen) return null;

  const handleSelect = (target: string, external?: boolean) => {
    sound.playClick();
    if (target === 'admin-modal') {
      onSelectAction('admin-modal');
    } else if (target === 'action:shortcuts') {
      onSelectAction('shortcuts');
    } else if (target === 'action:sound') {
      sound.toggleMute();
    } else if (external || target.startsWith('http')) {
      window.open(target, '_blank', 'noopener,noreferrer');
    } else if (target.startsWith('/')) {
      navigate(target);
    } else {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl rounded-2xl bg-[#0E1017] border border-white/10 shadow-2xl shadow-black overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Fast Search Engine"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/[0.08] gap-3 bg-zinc-950/60">
          <Search className="w-4 h-4 text-brand-light shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(i => Math.min(filtered.length - 1, i + 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(i => Math.max(0, i - 1));
              } else if (e.key === 'Enter' && filtered[selectedIndex]) {
                e.preventDefault();
                handleSelect(filtered[selectedIndex].target, filtered[selectedIndex].external);
              }
            }}
            placeholder="Search modpacks, pages, documentation, or admin tools..."
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
          />
          <kbd className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-white/[0.08]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.target, item.external)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-brand/15 text-white border border-brand/30 shadow-sm' 
                      : 'text-zinc-300 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-1.5 rounded-lg border shrink-0 ${
                      isSelected ? 'bg-brand/20 border-brand/40 text-brand-light' : 'bg-zinc-900 border-white/5 text-zinc-400'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-sans font-semibold text-white">{item.title}</div>
                      {item.subtitle && (
                        <div className="truncate text-[11px] text-zinc-500 font-normal">{item.subtitle}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 shrink-0 ml-3">
                    <span>{item.category}</span>
                    {item.external ? (
                      <ExternalLink className="w-3 h-3 text-zinc-600" />
                    ) : (
                      <ArrowRight className="w-3 h-3 text-zinc-600" />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-xs text-zinc-500 font-mono">
              No matching modpacks or commands found for &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 border-t border-white/[0.06] bg-zinc-950/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <span>Use ↑↓ to navigate</span>
            <span>•</span>
            <span>↵ to select</span>
          </div>
          <span>Doki&apos;s Modpacks Fast Search</span>
        </div>

      </div>
    </div>
  );
};

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

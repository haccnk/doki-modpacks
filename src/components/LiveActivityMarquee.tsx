import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Zap, 
  Server, 
  Radio,
  CheckCircle2,
  Globe2,
  Edit3,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useDoki } from '../context/DokiContext';
import { useToast } from '../context/ToastContext';
import { sound } from '../utils/sound';
import { MarqueeItem } from '../backend/types';

export const LiveActivityMarquee: React.FC = () => {
  const { platformConfig, isAdmin } = useDoki();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // If admin toggled off the marquee, hide it completely
  if (platformConfig?.marqueeEnabled === false) {
    return null;
  }

  const defaultItems: MarqueeItem[] = [
    {
      id: 'def-1',
      label: 'Flagship Biohazard Overworld Sync',
      status: 'Fabric 0.16.5 • Release Live',
      tag: 'ACTIVE',
      color: 'emerald',
      link: '/modpack/minecraft-2-biohazard'
    },
    {
      id: 'def-2',
      label: 'Doki Hub Access Control',
      status: 'PBKDF2/SHA-256 • Role Enforced',
      tag: 'SECURE',
      color: 'emerald'
    },
    {
      id: 'def-3',
      label: 'Edge Cluster us-east-1',
      status: '48/48 MicroVMs Ready',
      tag: 'HEALTHY',
      color: 'emerald'
    },
    {
      id: 'def-4',
      label: 'Client Build Mirror',
      status: 'Google Drive Direct Sync Ready',
      tag: 'MIRROR',
      color: 'cyan',
      link: '/catalog'
    },
    {
      id: 'def-5',
      label: 'Official Community Hub',
      status: 'Discord & Facebook Live',
      tag: 'ONLINE',
      color: 'indigo',
      link: '/help'
    },
    {
      id: 'def-6',
      label: 'JVM Runtime Target',
      status: 'Java 21 LTS 64-Bit Recommended',
      tag: 'RUNTIME',
      color: 'amber'
    }
  ];

  const items = (platformConfig?.marqueeItems && platformConfig.marqueeItems.length > 0)
    ? platformConfig.marqueeItems
    : defaultItems;

  const label = platformConfig?.marqueeLabel || 'PackOps Live Telemetry';
  const pingText = platformConfig?.marqueePingText || 'Cluster Ping: 12ms';

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'cyan':
        return {
          dot: 'bg-cyan-400',
          tag: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
          hover: 'hover:border-cyan-500/40 hover:bg-cyan-500/5'
        };
      case 'amber':
        return {
          dot: 'bg-amber-400',
          tag: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          hover: 'hover:border-amber-500/40 hover:bg-amber-500/5'
        };
      case 'indigo':
        return {
          dot: 'bg-indigo-400',
          tag: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
          hover: 'hover:border-indigo-500/40 hover:bg-indigo-500/5'
        };
      case 'rose':
        return {
          dot: 'bg-rose-400',
          tag: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
          hover: 'hover:border-rose-500/40 hover:bg-rose-500/5'
        };
      case 'violet':
        return {
          dot: 'bg-purple-400',
          tag: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
          hover: 'hover:border-purple-500/40 hover:bg-purple-500/5'
        };
      case 'emerald':
      default:
        return {
          dot: 'bg-emerald-400',
          tag: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          hover: 'hover:border-emerald-500/40 hover:bg-emerald-500/5'
        };
    }
  };

  const handleItemClick = (item: MarqueeItem) => {
    sound.playClick();
    if (item.link) {
      if (item.link.startsWith('http')) {
        window.open(item.link, '_blank', 'noopener,noreferrer');
      } else {
        navigate(item.link);
      }
      showToast(`Navigating to ${item.label}`, 'info');
    } else {
      showToast(`Telemetry: ${item.label} • ${item.status}`, 'info');
    }
  };

  return (
    <div className="relative z-30 border-y border-white/[0.08] bg-[#08090E]/90 backdrop-blur-xl overflow-hidden py-2 select-none group transition-colors">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        
        {/* Left Ticker Label & Admin Quick Edit */}
        <div className="hidden sm:flex items-center gap-2 pr-4 border-r border-white/10 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-300 flex items-center gap-1 font-semibold">
            {label}
          </span>

          {isAdmin && (
            <Link
              to="/admin?tab=marquee"
              onClick={() => sound.playClick()}
              className="ml-1 p-1 rounded-md text-zinc-500 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
              title="Customize Top Information Bar (Admin)"
            >
              <Edit3 className="w-3 h-3" />
            </Link>
          )}
        </div>

        {/* Marquee Track with Smooth Pause on Hover & Fluid Item Reflections */}
        <div className="overflow-hidden flex-1 relative mask-fade-edges">
          <div className="flex items-center gap-6 whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]">
            {[...items, ...items].map((item, idx) => {
              const c = getColorClasses(item.color);

              return (
                <button
                  key={`${item.id || item.label}-${idx}`}
                  onClick={() => handleItemClick(item)}
                  className={`liquid-glass-item inline-flex items-center gap-2 text-xs font-mono text-zinc-300 hover:text-white px-3 py-1 rounded-full border border-transparent ${c.hover} transition-all cursor-pointer`}
                  title={item.link ? `Go to: ${item.link}` : item.label}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${c.dot} shrink-0 animate-pulse`} />
                  <span className="text-zinc-400 font-medium">{item.label}:</span>
                  <span className="font-semibold text-zinc-200">{item.status}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider border ${c.tag}`}>
                    {item.tag}
                  </span>
                  {item.link && (
                    <ExternalLink className="w-2.5 h-2.5 text-zinc-500 ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Status Pill */}
        <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-white/10 shrink-0 text-[11px] font-mono text-zinc-400">
          <span className="text-zinc-500">Fleet Status:</span>
          <span className="text-emerald-400 font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
            {pingText}
          </span>
        </div>

      </div>
    </div>
  );
};

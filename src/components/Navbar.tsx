import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShieldCheck, 
  UserCheck, 
  LogOut,
  UserPlus,
  LogIn
} from 'lucide-react';
import { useDoki } from '../context/DokiContext';
import { sound } from '../utils/sound';

interface NavbarProps {
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, isAdmin, isGuest, logout, platformConfig } = useDoki();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#08090C]/70 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3' 
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Left: Website Logo & Name */}
          <Link 
            to="/" 
            onClick={() => sound.playClick()}
            className="flex items-center gap-2.5 group focus-visible:ring-1 focus-visible:ring-brand rounded-xl p-1 liquid-glass-item"
            aria-label="Doki's Modpacks Hub Home"
          >
            <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/30 flex items-center justify-center text-brand-light shadow-inner group-hover:border-brand/60 transition-colors">
              <Package className="w-4 h-4 text-brand-light group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-sans font-bold tracking-tight text-base sm:text-lg text-white">
                {platformConfig?.siteTitle ? (
                  platformConfig.siteTitle
                ) : (
                  <>Doki&apos;s <span className="bg-gradient-to-r from-brand-light to-brand-gradient bg-clip-text text-transparent">Modpacks</span></>
                )}
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand/10 text-brand-light border border-brand/20 uppercase font-bold tracking-wide">
                HUB
              </span>
            </div>
          </Link>

          {/* Right: Authentication Status & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono font-bold text-amber-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>doki (ADMIN)</span>
                </span>

                <button
                  onClick={() => {
                    sound.playClick();
                    logout();
                  }}
                  className="liquid-glass-item p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : isGuest ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono font-bold text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>{currentUser?.username || 'Guest'} (Guest)</span>
                </span>

                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenAuth();
                  }}
                  className="liquid-glass-item px-3 py-1.5 rounded-xl bg-brand/20 hover:bg-brand/30 border border-brand/40 text-xs font-semibold text-white transition-all cursor-pointer flex items-center gap-1"
                  title="Upgrade to full Player Account"
                >
                  <UserPlus className="w-3.5 h-3.5 text-brand-light" />
                  <span className="hidden sm:inline">Upgrade</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    logout();
                  }}
                  className="liquid-glass-item p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Exit Guest Mode"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : currentUser ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 border border-white/10 text-[11px] font-mono text-zinc-300">
                  <UserCheck className="w-3.5 h-3.5 text-brand-light" />
                  <span>{currentUser.username} (Player)</span>
                </span>

                <button
                  onClick={() => {
                    sound.playClick();
                    logout();
                  }}
                  className="liquid-glass-item p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Sign In Button with Liquid Glass Effect */}
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenAuth();
                  }}
                  className="liquid-glass-item px-3.5 py-1.5 rounded-xl border border-white/10 hover:border-white/20 text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Sign In</span>
                </button>

                {/* Register Button with Liquid Glass Brand Accent */}
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenAuth();
                  }}
                  className="liquid-glass-item px-3.5 py-1.5 rounded-xl bg-brand/20 hover:bg-brand/30 border border-brand/40 hover:border-brand/70 text-xs font-semibold text-white shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5 text-brand-light" />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

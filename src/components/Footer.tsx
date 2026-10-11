import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowUp, ShieldCheck, Heart } from 'lucide-react';
import { useDoki } from '../context/DokiContext';
import { sound } from '../utils/sound';

export const Footer: React.FC = () => {
  const { platformConfig } = useDoki();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerAttribution = platformConfig?.footerCopy || "A member of PackOps";

  return (
    <footer className="border-t border-white/[0.08] bg-[#06070A] pt-16 pb-12 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-white/[0.06]">
          
          {/* Brand Info (2 cols on desktop) */}
          <div className="col-span-2 space-y-4">
            <Link 
              to="/" 
              onClick={() => sound.playClick()}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-white group-hover:border-brand/50 transition-colors">
                <Package className="w-4 h-4 text-brand-light" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-white tracking-tight">
                  Doki&apos;s <span className="text-brand-light">Modpacks</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  {footerAttribution}
                </span>
              </div>
            </Link>

            <p className="text-zinc-400 max-w-sm leading-relaxed text-xs">
              Meticulously configured Minecraft adventures, rich lore narratives, and high-performance server engineering.
            </p>

            <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-zinc-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Hub Fleet Operational • Verified Builds</span>
            </div>
          </div>

          {/* Links Column 1: Modpacks & Hub */}
          <div className="space-y-3">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider block">Doki&apos;s Modpacks</span>
            <ul className="space-y-2 text-zinc-400">
              <li><Link to="/modpack/minecraft-2-biohazard" className="hover:text-white transition-colors">Minecraft 2: Biohazard</Link></li>
              <li><Link to="/catalog" className="hover:text-white transition-colors">Modpack Catalog</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Doki&apos;s Mission</Link></li>
              <li><Link to="/engineering" className="hover:text-white transition-colors">Engineering Suite</Link></li>
              <li><Link to="/help" className="hover:text-white transition-colors">Community Help & Discord</Link></li>
            </ul>
          </div>

          {/* Links Column 2: PackOps Platform */}
          <div className="space-y-3">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider block">Dev & Architecture</span>
            <ul className="space-y-2 text-zinc-400">
              <li><Link to="/engineering" className="hover:text-white transition-colors">CI Pipeline Simulator</Link></li>
              <li><Link to="/engineering" className="hover:text-white transition-colors">Grafana Observability</Link></li>
              <li><Link to="/engineering" className="hover:text-white transition-colors">Scala 3 Pekko Engine</Link></li>
              <li><Link to="/engineering" className="hover:text-white transition-colors">C4 Architecture</Link></li>
              <li><Link to="/engineering" className="hover:text-white transition-colors">Flutter 3.x Companion</Link></li>
            </ul>
          </div>

          {/* Links Column 3: Administration & Governance */}
          <div className="space-y-3">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider block">Governance & Admin</span>
            <ul className="space-y-2 text-zinc-400">
              <li><Link to="/admin" className="hover:text-white transition-colors flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-amber-400" /> Admin Control Center</Link></li>
              <li><Link to="/catalog" className="hover:text-white transition-colors">Access Policy & Permissions</Link></li>
              <li><span className="text-zinc-600">PBKDF2/SHA-256 RBAC</span></li>
              <li><span className="text-zinc-600">Emergency Quarantine Protocol</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px] font-mono">
          <div>
            © {new Date().getFullYear()} Doki&apos;s Modpacks Hub • {footerAttribution}. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span className="text-zinc-600">Linear / Vercel Modern Dark Design Standard</span>
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-md bg-zinc-900 border border-white/[0.08] text-zinc-400 hover:text-white cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

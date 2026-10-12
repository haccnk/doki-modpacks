import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { DokiProvider, useDoki } from './context/DokiContext';
import { BackgroundMesh } from './components/BackgroundMesh';
import { InteractiveCanvas } from './components/InteractiveCanvas';
import { Navbar } from './components/Navbar';
import { LiveActivityMarquee } from './components/LiveActivityMarquee';
import { Footer } from './components/Footer';
import { Taskbar } from './components/Taskbar';
import { CommandPalette } from './components/CommandPalette';
import { AuthModal } from './components/AuthModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { ThemeDial } from './components/ThemeDial';
import { ShortcutsModal } from './components/ShortcutsModal';
import { sound } from './utils/sound';

// Dedicated Pages
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ModpackDetailPage } from './pages/ModpackDetailPage';
import { AboutPage } from './pages/AboutPage';
import { HelpPage } from './pages/HelpPage';
import { CreditsPage } from './pages/CreditsPage';
import { EngineeringPage } from './pages/EngineeringPage';
import { AdminPage } from './pages/AdminPage';

// Scroll restoration helper
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const AppContent: React.FC = () => {
  const { isAdmin } = useDoki();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShortcutsModalOpen(prev => !prev);
      } else if ((e.key === 'd' || e.key === 'D') && isAdmin) {
        setAdminModalOpen(prev => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        sound.toggleMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin]);

  return (
    <div className="min-h-screen bg-[#08090C] text-[#EDEDED] font-sans relative selection:bg-brand/30 selection:text-white overflow-x-hidden">
      
      {/* Scroll restoration */}
      <ScrollToTop />

      {/* Ambient Depth & Mesh Orbs */}
      <BackgroundMesh />

      {/* Interactive Constellation Particle Canvas */}
      <InteractiveCanvas />

      {/* Sleek Minimalist Top Header (Website Name & Login/Register only) */}
      <Navbar 
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Real-time Telemetry & Cluster Activity Marquee Ticker */}
      <div className="pt-16 sm:pt-20">
        <LiveActivityMarquee />
      </div>

      {/* Dedicated Multi-Page Routing */}
      <main className="relative z-10 min-h-[calc(100vh-280px)]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/modpack/:slug" element={<ModpackDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/credits" element={<CreditsPage />} />
          <Route path="/engineering" element={<EngineeringPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Modern Minimalist Footer with clearance for floating taskbar */}
      <div className="pb-16 sm:pb-20">
        <Footer />
      </div>

      {/* Liquid Glass Floating Bottom Taskbar holding all features and navigation */}
      <Taskbar 
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenShortcuts={() => setShortcutsModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Fast Command Palette Search Engine */}
      <CommandPalette 
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectAction={(target) => {
          if (target === 'open') setCommandPaletteOpen(true);
          else if (target === 'admin-modal') setAdminModalOpen(true);
          else if (target === 'shortcuts') setShortcutsModalOpen(true);
        }}
      />

      {/* Sign In & Get Started Auth Dialog */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Super Admin Control Panel Quick Modal (Doki Exclusive) */}
      <AdminPortalModal 
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />

      {/* Keyboard Shortcuts HUD */}
      <ShortcutsModal 
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />

      {/* Floating Theme Accent Dial (/tailwind-design-system & /ui-ux-designer) */}
      <ThemeDial />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <DokiProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </DokiProvider>
    </ToastProvider>
  );
};

export default App;

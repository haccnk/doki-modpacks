import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  User, 
  Sparkles, 
  Mail, 
  Download, 
  LogIn, 
  UserPlus, 
  Gamepad2,
  Check,
  AlertCircle
} from 'lucide-react';
import { useDoki } from '../context/DokiContext';
import { sound } from '../utils/sound';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'register' | 'guest';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose,
  initialMode = 'signin'
}) => {
  const { login, register, loginAsGuest, currentUser, isAdmin, isGuest } = useDoki();
  
  const [mode, setMode] = useState<'signin' | 'register' | 'guest'>(initialMode);
  
  // Sign in state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register state
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Guest state
  const [guestHandle, setGuestHandle] = useState(`Player_${Math.floor(1000 + Math.random() * 9000)}`);
  
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    sound.playClick();

    try {
      const ok = await login(loginIdentifier, loginPassword);
      if (ok) {
        onClose();
      } else {
        setErrorMessage('Invalid username or password.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      sound.playFault();
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      sound.playFault();
      return;
    }

    setIsSubmitting(true);
    sound.playClick();

    try {
      const ok = await register(regUsername, regEmail, regPassword);
      if (ok) {
        onClose();
      } else {
        setErrorMessage('Failed to create account. Username may already exist.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestInstall = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    sound.playClick();

    try {
      const ok = await loginAsGuest(guestHandle);
      if (ok) {
        onClose();
      } else {
        setErrorMessage('Could not initialize guest session.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Guest session error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md rounded-3xl liquid-glass bg-[#0A0C12]/90 border border-white/15 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-zinc-400 hover:text-white liquid-glass-item border border-transparent hover:border-white/20 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-brand-light font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand/10 border border-brand/20">
              Doki&apos;s Modpacks Access
            </span>
          </div>
          <h3 id="auth-modal-title" className="text-2xl font-sans font-bold text-white tracking-tight">
            {mode === 'signin' && 'Sign In to Hub'}
            {mode === 'register' && 'Create Player Account'}
            {mode === 'guest' && 'Guest Installer Mode'}
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {mode === 'signin' && 'Sign in as a community player or enter admin credentials for hub management.'}
            {mode === 'register' && 'Join the community to track downloads, request access, and sync save profiles.'}
            {mode === 'guest' && 'Jump straight in. Download and install official modpack builds without creating an account.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-zinc-900/90 p-1 rounded-xl border border-white/[0.08] text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setErrorMessage('');
              setMode('signin');
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-brand text-white font-bold shadow-md shadow-brand/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setErrorMessage('');
              setMode('register');
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-brand text-white font-bold shadow-md shadow-brand/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setErrorMessage('');
              setMode('guest');
            }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'guest'
                ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Guest Install</span>
          </button>
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* --- 1. SIGN IN TAB --- */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-zinc-400 block">
                  Username or Handle
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. doki or your username"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-white/10 focus:border-brand text-xs text-white placeholder:text-zinc-600 font-mono focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono text-zinc-400 block">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-white/10 focus:border-brand text-xs text-white placeholder:text-zinc-600 font-mono focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In as Player'}</span>
            </button>
          </form>
        )}

        {/* --- 2. REGISTER TAB (NORMAL USER) --- */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-zinc-400 block">
                Player Username (Minecraft IGN)
              </label>
              <div className="relative">
                <Gamepad2 className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="e.g. EnderKnight99"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-white/10 focus:border-brand text-xs text-white placeholder:text-zinc-600 font-mono focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-zinc-400 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="player@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-white/10 focus:border-brand text-xs text-white placeholder:text-zinc-600 font-mono focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-zinc-400 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-950/80 border border-white/10 focus:border-brand text-xs text-white placeholder:text-zinc-600 font-mono focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-zinc-400 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-950/80 border border-white/10 focus:border-brand text-xs text-white placeholder:text-zinc-600 font-mono focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-white/[0.06] text-[11px] text-zinc-400 space-y-1">
              <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                <Check className="w-3.5 h-3.5 text-brand-light" />
                <span>Player Role Access</span>
              </div>
              <p className="text-[10px] text-zinc-500 pl-5">
                Download open client releases, track your permission requests, and receive update alerts.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSubmitting ? 'Creating Account...' : 'Register Player Account'}</span>
            </button>
          </form>
        )}

        {/* --- 3. GUEST INSTALLER TAB ("GUEST WANT TO INSTALL") --- */}
        {mode === 'guest' && (
          <form onSubmit={handleGuestInstall} className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-medium text-xs">
                <Download className="w-4 h-4 text-amber-400" />
                <span>Instant Installation Mode</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Want to play immediately? You don&apos;t need to register an account. As a guest, you can download all public modpack releases directly.
              </p>
              <ul className="space-y-1.5 text-[11px] font-mono text-zinc-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Immediate access to official client downloads</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Zero sign-up or email verification friction</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Upgrade to registered account anytime</span>
                </li>
              </ul>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-zinc-400 block">
                Your Temporary Gamer Tag (Optional)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={guestHandle}
                  onChange={(e) => setGuestHandle(e.target.value)}
                  placeholder="e.g. Guest_4021"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-white/10 focus:border-amber-400 text-xs text-white placeholder:text-zinc-600 font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isSubmitting ? 'Starting Guest Session...' : 'Start Installing as Guest'}</span>
            </button>
          </form>
        )}

        {/* Footer Security Badge */}
        <div className="pt-2 border-t border-white/[0.04] flex items-center justify-center gap-2 text-[11px] font-mono text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-light" />
          <span>RBAC Guard • PBKDF2/SHA-256 Hashed • Guest & Player Supported</span>
        </div>

      </div>
    </div>
  );
};

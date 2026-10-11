import React, { useState } from 'react';
import { X, Lock, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDoki } from '../context/DokiContext';
import { sound } from '../utils/sound';

interface PermissionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  modpackId: string;
  modpackTitle: string;
}

export const PermissionRequestModal: React.FC<PermissionRequestModalProps> = ({
  isOpen,
  onClose,
  modpackId,
  modpackTitle,
}) => {
  const { submitPermissionRequest, currentUser } = useDoki();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    setIsSubmitting(true);
    const ok = await submitPermissionRequest(modpackId, reason);
    setIsSubmitting(false);
    if (ok) {
      setReason('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md rounded-2xl bg-[#0E1017] border border-white/10 shadow-2xl p-6 space-y-5 z-10"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Request Download Access</h3>
              <p className="text-[11px] text-zinc-400">{modpackTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/60 p-3 rounded-xl border border-white/[0.05]">
          This modpack requires administrative authorization from <strong>Doki</strong> before files can be mirrored to your client. Please state your intended use or beta testing background.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-zinc-400 block">
              Reason / Background:
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Experienced modpack tester with dedicated Fabric benchmarking hardware..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 rounded-lg bg-zinc-950 border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !reason.trim()}
            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all active:scale-[0.98] shadow-inner-light disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Transmitting...' : 'Submit Request to Doki'}</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sliders, 
  FileText, 
  Layers, 
  Lock, 
  Unlock,
  Sparkles,
  Save,
  Check,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDoki } from '../context/DokiContext';
import { ModpackLifecycle, AccessPolicy, CreateModpackDTO } from '../backend/types';
import { sound } from '../utils/sound';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({ isOpen, onClose }) => {
  const { 
    isAdmin,
    modpacks, 
    platformConfig, 
    pendingRequests, 
    updateModpack, 
    deleteModpack, 
    createModpack, 
    toggleEmergencyQuarantine, 
    moderateRequest, 
    updatePlatformConfig 
  } = useDoki();

  const [activeTab, setActiveTab] = useState<'modpacks' | 'permissions' | 'content'>('modpacks');
  const [aboutCopy, setAboutCopy] = useState(platformConfig?.aboutDokiCopy || '');
  const [isCreating, setIsCreating] = useState(false);

  // New modpack form state
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLore, setNewLore] = useState('');
  const [newMirror, setNewMirror] = useState('');
  const [newLifecycle, setNewLifecycle] = useState<ModpackLifecycle>('RELEASE');
  const [newPolicy, setNewPolicy] = useState<AccessPolicy>('OPEN_DOWNLOAD');

  if (!isOpen || !isAdmin) return null;

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSlug) return;
    const dto: CreateModpackDTO = {
      title: newTitle,
      slug: newSlug,
      description: newDesc || 'Custom crafted Minecraft adventure',
      lore: newLore || 'An uncharted journey awaits in the Overworld.',
      lifecycle: newLifecycle,
      accessPolicy: newPolicy,
      downloadMirror: newMirror || 'https://drive.google.com',
      specs: {
        minecraftVersion: '1.20.1',
        modLoader: 'Fabric 0.16.5',
        javaRuntime: 'Java 21',
        recommendedRam: '8 GB',
        minRam: '6 GB',
      }
    };
    const ok = await createModpack(dto);
    if (ok) {
      setIsCreating(false);
      setNewTitle('');
      setNewSlug('');
      setNewDesc('');
      setNewLore('');
    }
  };

  const handleSaveAbout = async () => {
    sound.playSuccess();
    await updatePlatformConfig({ aboutDokiCopy: aboutCopy });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Main Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-4xl max-h-[85vh] rounded-2xl bg-[#0C0D13] border border-white/10 shadow-2xl flex flex-col overflow-hidden z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.08] bg-zinc-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-sans font-bold text-white tracking-tight">
                  Doki&apos;s Modpacks Hub // Super Admin Console
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ROOT: doki
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Exclusive control over modpack lifecycles, emergency quarantine, and content parameters.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-white/[0.06] bg-zinc-950/40 text-xs font-mono">
          <button
            onClick={() => {
              sound.playSwitch();
              setActiveTab('modpacks');
            }}
            className={`px-4 py-2.5 rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'modpacks' 
                ? 'bg-[#0C0D13] text-white border-t border-x border-white/10 font-bold' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-emerald-400" />
            <span>Modpacks & Quarantine ({modpacks.length})</span>
          </button>

          <button
            onClick={() => {
              sound.playSwitch();
              setActiveTab('permissions');
            }}
            className={`px-4 py-2.5 rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'permissions' 
                ? 'bg-[#0C0D13] text-white border-t border-x border-white/10 font-bold' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Permission Requests ({pendingRequests.filter(r => r.status === 'PENDING').length})</span>
          </button>

          <button
            onClick={() => {
              sound.playSwitch();
              setActiveTab('content');
            }}
            className={`px-4 py-2.5 rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'content' 
                ? 'bg-[#0C0D13] text-white border-t border-x border-white/10 font-bold' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Platform Content & About Copy</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: MODPACK CRUD & QUARANTINE */}
          {activeTab === 'modpacks' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Configured Modpacks</h4>
                  <p className="text-xs text-zinc-400">Configure lifecycles, download mirrors, and emergency halts.</p>
                </div>
                <button
                  onClick={() => setIsCreating(!isCreating)}
                  className="px-3 py-1.5 rounded-lg bg-brand hover:bg-brand-hover text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isCreating ? 'Cancel' : 'New Modpack'}</span>
                </button>
              </div>

              {/* Create Form */}
              {isCreating && (
                <form onSubmit={handleCreateSubmit} className="p-4 rounded-xl bg-zinc-900/90 border border-white/10 space-y-3">
                  <div className="text-xs font-mono text-emerald-400 font-semibold uppercase">Register New Modpack</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Title (e.g. Minecraft 2: Voidfall)"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Slug (e.g. minecraft-2-voidfall)"
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-none"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Lore & Storyline narrative..."
                    value={newLore}
                    onChange={(e) => setNewLore(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-none font-sans"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <select
                      value={newLifecycle}
                      onChange={(e) => {
                        const val = e.target.value as ModpackLifecycle;
                        setNewLifecycle(val);
                        if (val === 'CLOSED_DEMO') {
                          setNewPolicy('NEED_PERMISSION');
                        }
                      }}
                      className="px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none"
                    >
                      <option value="RELEASE">RELEASE</option>
                      <option value="DEMO">DEMO</option>
                      <option value="CLOSED_DEMO">CLOSED DEMO (Permission Only)</option>
                      <option value="COMING_SOON">COMING SOON</option>
                    </select>

                    <select
                      value={newPolicy}
                      onChange={(e) => setNewPolicy(e.target.value as AccessPolicy)}
                      disabled={newLifecycle === 'CLOSED_DEMO'}
                      className="px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none disabled:opacity-50"
                    >
                      <option value="OPEN_DOWNLOAD">OPEN_DOWNLOAD</option>
                      <option value="NEED_PERMISSION">NEED_PERMISSION</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Download URL"
                      value={newMirror}
                      onChange={(e) => setNewMirror(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all cursor-pointer"
                  >
                    Commit Modpack Record
                  </button>
                </form>
              )}

              {/* Modpack List */}
              <div className="space-y-3">
                {modpacks.map((pack) => (
                  <div 
                    key={pack.id}
                    className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.08] hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-sans font-bold text-white">{pack.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/10">
                          {pack.slug}
                        </span>
                        {pack.isQuarantined && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1 font-bold animate-pulse">
                            <AlertTriangle className="w-3 h-3" /> QUARANTINED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-1 max-w-xl">{pack.lore}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {/* Lifecycle Selector */}
                      <select
                        value={pack.lifecycle}
                        onChange={(e) => {
                          const val = e.target.value as ModpackLifecycle;
                          updateModpack(pack.id, { 
                            lifecycle: val,
                            ...(val === 'CLOSED_DEMO' ? { accessPolicy: 'NEED_PERMISSION' } : {})
                          });
                        }}
                        className="px-2.5 py-1 rounded bg-black border border-white/10 text-xs font-mono text-zinc-300 focus:outline-none"
                      >
                        <option value="RELEASE">RELEASE</option>
                        <option value="DEMO">DEMO</option>
                        <option value="CLOSED_DEMO">CLOSED DEMO</option>
                        <option value="COMING_SOON">COMING SOON</option>
                      </select>

                      {/* Policy Selector */}
                      <select
                        value={pack.accessPolicy}
                        onChange={(e) => updateModpack(pack.id, { accessPolicy: e.target.value as AccessPolicy })}
                        className="px-2.5 py-1 rounded bg-black border border-white/10 text-xs font-mono text-zinc-300 focus:outline-none"
                      >
                        <option value="OPEN_DOWNLOAD">OPEN_DOWNLOAD</option>
                        <option value="NEED_PERMISSION">NEED_PERMISSION</option>
                      </select>

                      {/* Quarantine Toggle Button */}
                      <button
                        onClick={() => toggleEmergencyQuarantine(pack.id, pack.isQuarantined)}
                        className={`px-3 py-1 rounded text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                          pack.isQuarantined
                            ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/40'
                            : 'bg-zinc-800 hover:bg-rose-950/60 text-zinc-300 hover:text-rose-300 border border-white/10'
                        }`}
                        title="Emergency Quarantine: Immediately halt public downloads"
                      >
                        <AlertTriangle className="w-3 h-3" />
                        <span>{pack.isQuarantined ? 'Lift Quarantine' : 'Halt (Quarantine)'}</span>
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => deleteModpack(pack.id)}
                        className="p-1.5 rounded bg-zinc-800 hover:bg-rose-900/60 text-zinc-400 hover:text-rose-200 transition-colors cursor-pointer"
                        title="Delete Modpack"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 2: PERMISSION REQUESTS */}
          {activeTab === 'permissions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Pending Access Requests</h4>
                  <p className="text-xs text-zinc-400">Review users requesting permission for restricted modpacks.</p>
                </div>
              </div>

              {pendingRequests.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-xs font-mono bg-zinc-900/30 rounded-xl border border-white/[0.05]">
                  No pending permission requests at this time.
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingRequests.map((req) => (
                    <div 
                      key={req.id}
                      className="p-4 rounded-xl bg-zinc-900/50 border border-white/[0.08] flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-white">{req.username}</span>
                          <span className="text-[10px] font-mono text-zinc-500">for</span>
                          <span className="text-xs font-mono text-indigo-400 font-semibold">{req.modpackSlug}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            req.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' :
                            req.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-400' :
                            'bg-amber-500/20 text-amber-400'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-300 italic">&ldquo;{req.reason}&rdquo;</p>
                      </div>

                      {req.status === 'PENDING' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => moderateRequest(req.id, 'APPROVED')}
                            className="px-3 py-1 rounded bg-brand hover:bg-brand-hover text-white text-xs font-mono font-medium transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => moderateRequest(req.id, 'REJECTED')}
                            className="px-3 py-1 rounded bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-mono font-medium transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PLATFORM CONTENT & ABOUT DOKI COPY */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              
              {/* Featured Modpack Selector */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.08] space-y-3">
                <div className="text-xs font-mono uppercase text-zinc-400 font-semibold">Featured Hero Modpack</div>
                <select
                  value={platformConfig?.featuredModpackId}
                  onChange={(e) => updatePlatformConfig({ featuredModpackId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black border border-white/10 text-xs text-white focus:outline-none"
                >
                  {modpacks.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.slug}) - [{m.lifecycle}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Inline Editor: Official About Doki Copy */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono uppercase text-zinc-400 font-semibold">Official &quot;About Doki&quot; Platform Narrative</div>
                    <p className="text-[11px] text-zinc-500">Rendered on the public storefront and client onboarding guides.</p>
                  </div>
                  <button
                    onClick={handleSaveAbout}
                    className="px-3 py-1.5 rounded-lg bg-brand hover:bg-brand-hover text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Narrative Copy</span>
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={aboutCopy}
                  onChange={(e) => setAboutCopy(e.target.value)}
                  className="w-full p-3 rounded-lg bg-black border border-white/10 text-xs text-zinc-200 leading-relaxed font-sans focus:outline-none focus:border-brand"
                />
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-zinc-950 flex items-center justify-between text-xs font-mono text-zinc-500">
          <span>Super Admin Authority: Root Level</span>
          <span>PackOps Core // Doki&apos;s Modpacks Hub v2.8</span>
        </div>
      </motion.div>
    </div>
  );
};

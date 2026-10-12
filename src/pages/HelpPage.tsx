import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HelpCircle, 
  Disc as Discord, 
  Facebook, 
  ExternalLink, 
  Mail, 
  Copy, 
  CheckCircle2, 
  Sparkles, 
  LifeBuoy, 
  Terminal, 
  BookOpen, 
  AlertCircle,
  Edit3,
  ChevronRight,
  ChevronDown,
  Search,
  MessageCircleQuestion,
  Tag
} from 'lucide-react';
import { useDoki } from '../context/DokiContext';
import { sound } from '../utils/sound';
import { BorderBeam } from '../components/BorderBeam';
import { FAQItem } from '../backend/types';

const DEFAULT_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What Java version is required to run Doki modpacks?',
    answer: 'All modern Doki modpacks require 64-bit Java 21 LTS (OpenJDK, Eclipse Temurin, or Oracle). Older versions such as Java 8 or Java 17 will result in startup crashes on Fabric 0.16+.',
    category: 'System & Installation'
  },
  {
    id: 'faq-2',
    question: 'How much RAM should I allocate in the launcher?',
    answer: 'We recommend allocating 6 GB to 8 GB of RAM. Allocating less than 6 GB may cause stutters in heavily modded biomes, while allocating more than 10 GB can trigger JVM garbage collection latency spikes.',
    category: 'Performance'
  },
  {
    id: 'faq-3',
    question: 'How do I access Closed Demo modpacks?',
    answer: 'Closed Demo modpacks require permission authorization. Simply click the "Request Access" button on the modpack card and provide your player handle or reason. Admin moderators review requests promptly.',
    category: 'Access & Permissions'
  },
  {
    id: 'faq-4',
    question: 'Can I install client-side shaders or performance mods?',
    answer: 'Yes! Doki modpacks include Sodium and Iris by default for modern Fabric builds. You can drop your favorite shaders into the shaderpacks folder without modifying base config files.',
    category: 'Modding & Customization'
  },
  {
    id: 'faq-5',
    question: 'Is multiplayer supported out of the box?',
    answer: 'Yes! Our modpacks are balanced and stress-tested for both singleplayer and dedicated multiplayer servers. Official server pack archives are distributed alongside client releases.',
    category: 'Multiplayer'
  }
];

export const HelpPage: React.FC = () => {
  const { platformConfig, isAdmin } = useDoki();
  const navigate = useNavigate();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');
  const [faqSearch, setFaqSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const title = platformConfig?.helpTitle || 'Community Support & Help Desk';
  const subtitle = platformConfig?.helpSubtitle || 'Need assistance setting up a modpack, configuring Java 21, or finding players? Join our official community channels.';
  const discordUrl = platformConfig?.helpDiscordUrl || 'https://discord.gg/minecraft';
  const facebookUrl = platformConfig?.helpFacebookUrl || 'https://facebook.com/groups/minecraft';
  const customUrl = platformConfig?.helpCustomUrl || 'https://github.com';
  const customLabel = platformConfig?.helpCustomLabel || 'GitHub Issue Tracker';
  const imageUrl = platformConfig?.helpImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop';
  const contactEmail = platformConfig?.helpContactEmail || 'support@doki-modpacks.io';
  const helpContent = platformConfig?.helpContent;

  const faqs: FAQItem[] = (platformConfig?.faqs && platformConfig.faqs.length > 0)
    ? platformConfig.faqs
    : DEFAULT_FAQS;

  const categories: string[] = ['ALL', ...Array.from(new Set(faqs.map(f => f.category).filter((c): c is string => Boolean(c))))];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
      (faq.category && faq.category.toLowerCase().includes(faqSearch.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFaq = (id: string) => {
    sound.playSwitch();
    setExpandedFaqId(prev => (prev === id ? null : id));
  };

  const handleCopyEmail = () => {
    sound.playClick();
    navigator.clipboard.writeText(contactEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="pt-24 pb-32 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Breadcrumbs & Admin Edit Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-zinc-200">Get Help & Community</span>
        </nav>

        {isAdmin && (
          <button
            onClick={() => {
              sound.playClick();
              navigate('/admin?tab=help');
            }}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Customize Help & FAQs (Admin)</span>
          </button>
        )}
      </div>

      {/* Hero Header & Community Banner */}
      <div className="relative rounded-3xl bg-zinc-950/80 border border-white/[0.08] overflow-hidden shadow-2xl">
        <BorderBeam size={280} duration={16} />

        {/* Community Banner Image */}
        {imageUrl && (
          <div className="relative w-full h-48 sm:h-64 overflow-hidden border-b border-white/[0.08]">
            <img 
              src={imageUrl} 
              alt="Community Banner" 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
            
            <div className="absolute bottom-4 left-6 sm:left-10 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-brand/20 border border-brand/40 text-[11px] font-mono font-bold text-brand-light uppercase tracking-wider backdrop-blur-md">
                Official Helpdesk & Community
              </span>
            </div>
          </div>
        )}

        {/* Header Text */}
        <div className="p-6 sm:p-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300">
            <LifeBuoy className="w-3.5 h-3.5 text-brand-light" />
            <span>24/7 Community Support Gateway</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-sans font-bold text-white tracking-tight">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans max-w-3xl">
            {subtitle}
          </p>
        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono text-zinc-400">
              <MessageCircleQuestion className="w-3.5 h-3.5 text-brand-light" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-2xl font-sans font-bold text-white tracking-tight">
              Common Questions & Solutions
            </h2>
            <p className="text-xs text-zinc-400">
              Answers to technical setup, RAM, Java versions, and permission access.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => {
                sound.playClick();
                navigate('/admin?tab=help');
              }}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-mono text-zinc-300 flex items-center gap-1.5 self-start cursor-pointer transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Manage FAQs</span>
            </button>
          )}
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            <input
              type="text"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder="Search questions or keywords..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.08] focus:border-brand text-xs text-white placeholder:text-zinc-600 font-sans focus:outline-none"
            />
          </div>

          {categories.length > 2 && (
            <div className="flex flex-wrap items-center gap-1 w-full sm:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    sound.playClick();
                    setSelectedCategory(cat);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-brand text-white font-bold'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="p-10 rounded-2xl bg-zinc-950/60 border border-white/[0.08] text-center space-y-2">
              <HelpCircle className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400">No questions match your query.</p>
              <button
                onClick={() => {
                  setFaqSearch('');
                  setSelectedCategory('ALL');
                }}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 text-xs font-mono text-white"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = expandedFaqId === faq.id;

              return (
                <div
                  key={faq.id}
                  className="rounded-2xl liquid-glass liquid-glass-item border border-white/[0.08] overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-brand-light shrink-0">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-sans font-bold text-white tracking-tight">
                          {faq.question}
                        </h3>
                        {faq.category && (
                          <span className="inline-block text-[10px] font-mono text-zinc-400 mt-0.5">
                            {faq.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={`p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-brand-light border-brand/30' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 pt-1 sm:px-6 sm:pb-6 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans border-t border-white/[0.04] bg-zinc-950/40">
                      <p className="pl-11 pr-4 whitespace-pre-wrap">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Primary Community Links Grid */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-sans font-bold text-white tracking-tight">
            Official Community Hubs
          </h2>
          <p className="text-xs text-zinc-400">
            Connect directly with Doki, server moderators, and fellow adventurers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Official Discord Server */}
          <div className="p-6 sm:p-8 rounded-2xl liquid-glass liquid-glass-item border-[#5865F2]/30 hover:border-[#5865F2] flex flex-col justify-between space-y-6 transition-all hover:bg-[#5865F2]/5 group shadow-xl">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/30 flex items-center justify-center text-[#5865F2] group-hover:scale-110 transition-transform">
                <Discord className="w-6 h-6" />
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-sans font-bold text-white group-hover:text-indigo-300 transition-colors">
                    Official Discord Server
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#5865F2]/20 text-indigo-300 border border-[#5865F2]/30">
                    Live Chat & Tickets
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Join our active Discord for live voice channels, instant modpack support tickets, sneak-peeks for upcoming releases, and team matchmaking.
                </p>
              </div>
            </div>

            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="w-full py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#5865F2]/20 hover:scale-[1.01]"
            >
              <span>Join Discord Community</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Official Facebook Community */}
          <div className="p-6 sm:p-8 rounded-2xl liquid-glass liquid-glass-item border-[#1877F2]/30 hover:border-[#1877F2] flex flex-col justify-between space-y-6 transition-all hover:bg-[#1877F2]/5 group shadow-xl">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/30 flex items-center justify-center text-[#1877F2] group-hover:scale-110 transition-transform">
                <Facebook className="w-6 h-6" />
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-sans font-bold text-white group-hover:text-blue-300 transition-colors">
                    Facebook Community Group
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1877F2]/20 text-blue-300 border border-[#1877F2]/30">
                    Community & Guides
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Follow our official Facebook page and group for patch notes, community build showcases, guide discussions, and event livestreams.
                </p>
              </div>
            </div>

            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="w-full py-3 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#1877F2]/20 hover:scale-[1.01]"
            >
              <span>Join Facebook Group</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </section>

      {/* Secondary Support Channels Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 3: GitHub Issue Tracker */}
        <div className="p-6 rounded-2xl liquid-glass liquid-glass-item space-y-4 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300">
              <Terminal className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-sans font-bold text-white">{customLabel}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Found a mod incompatibility, crash log anomaly, or recipe bug? Submit a formal issue with your crash log.
              </p>
            </div>
          </div>

          <a
            href={customUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-brand-light hover:text-white transition-colors"
          >
            <span>Open Issue Tracker</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Card 4: Email & Direct Contact */}
        <div className="p-6 rounded-2xl liquid-glass liquid-glass-item space-y-4 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-sans font-bold text-white">Direct Support Email</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                For administrative inquiries, server partnerships, or account issues:
              </p>
              <div className="font-mono text-xs text-white select-all pt-1">
                {contactEmail}
              </div>
            </div>
          </div>

          <button
            onClick={handleCopyEmail}
            className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-mono text-zinc-300 transition-colors cursor-pointer"
          >
            {copiedEmail ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedEmail ? 'Email Copied!' : 'Copy Support Email'}</span>
          </button>
        </div>

      </section>

      {/* Troubleshooting Guides & Knowledge Base */}
      <section className="rounded-2xl bg-zinc-950/70 border border-white/[0.08] p-6 sm:p-10 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-4">
          <div className="w-7 h-7 rounded-lg bg-brand/10 border border-brand/30 flex items-center justify-center text-brand-light">
            <BookOpen className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-mono uppercase tracking-wider text-brand-light font-bold">
            Troubleshooting Guide & Architecture Notes
          </h2>
        </div>

        {helpContent ? (
          <div className="text-xs sm:text-sm text-zinc-200 font-sans leading-relaxed whitespace-pre-wrap">
            {helpContent}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-2">
              <div className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>1. Java 21 LTS Requirement</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                All modern Fabric 1.20+ modpacks require 64-bit Java 21 LTS. Older Java 8 or 17 runtimes will crash with an &quot;Unsupported class version error&quot;.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-2">
              <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>2. RAM Memory Allocation</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Allocate between 6 GB to 8 GB in instance settings. Do not allocate over 10 GB unless hosting a local server, as it leads to GC micro-stutters.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.06] space-y-2">
              <div className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <LifeBuoy className="w-3.5 h-3.5" />
                <span>3. Launcher Recommendations</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                We strongly recommend Prism Launcher or Modrinth App for automated dependency resolution and seamless one-click zip importing.
              </p>
            </div>
          </div>
        )}
      </section>

    </div>
  );
};

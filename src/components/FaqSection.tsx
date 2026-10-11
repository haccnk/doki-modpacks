import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { SAAS_FAQS } from '../data/saasData';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 relative border-t border-white/[0.06]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono text-zinc-400">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-sans font-bold text-white tracking-tight">
            Developer FAQ
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Everything you need to know about bytecode resolution, headless runners, and edge distribution.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {SAAS_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-[#0C0D13] border border-white/[0.08] overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${idx}`}
                >
                  <span className="font-sans font-semibold text-sm sm:text-base text-zinc-100">
                    {faq.q}
                  </span>
                  <div className={`p-1 text-zinc-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-indigo-400' : ''
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div 
                    id={`faq-${idx}`}
                    className="px-5 pb-5 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-white/[0.04] pt-3 font-sans"
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

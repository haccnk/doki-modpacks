import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { PRICING_PLANS } from '../data/saasData';
import { SpotlightCard } from './SpotlightCard';
import { BorderBeam } from './BorderBeam';
import { sound } from '../utils/sound';

interface PricingProps {
  onSelectPlan: (planName: string) => void;
}

export const PricingSection: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const [annualBilling, setAnnualBilling] = useState<boolean>(true);

  return (
    <section id="pricing" className="py-24 relative border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-[11px] font-mono text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-brand-light" />
            <span>TRANSPARENT PRICING</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight">
            Simple plans for every team.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Start building for free on our community tier, then scale your builds and delta CDN when your modpack takes off.
          </p>

          {/* Monthly / Annual Toggle Switch */}
          <div className="pt-6 flex items-center justify-center gap-3">
            <span className={`text-xs font-medium ${!annualBilling ? 'text-white' : 'text-zinc-500'}`}>
              Monthly billing
            </span>

            <button
              onClick={() => {
                sound.playSwitch();
                setAnnualBilling(!annualBilling);
              }}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-800 border border-white/[0.08] transition-colors focus:outline-none cursor-pointer"
              role="switch"
              aria-checked={annualBilling}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-brand transition-transform ${
                  annualBilling ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>

            <span className={`text-xs font-medium flex items-center gap-1.5 ${annualBilling ? 'text-white' : 'text-zinc-500'}`}>
              <span>Annual billing</span>
              <span className="px-2 py-0.5 rounded-full bg-brand/10 text-brand-light border border-brand/30 text-[10px] font-mono font-bold animate-pulse">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid with Spotlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
          {PRICING_PLANS.map((plan) => {
            const price = annualBilling ? plan.yearlyPrice : plan.monthlyPrice;
            const isPopular = plan.popular;

            return (
              <SpotlightCard
                key={plan.id}
                spotlightColor={isPopular ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.08)'}
                className={`p-7 flex flex-col justify-between transition-all relative ${
                  isPopular
                    ? 'border-2 border-indigo-500/70 shadow-2xl shadow-indigo-950/40 md:-translate-y-2'
                    : 'border-white/[0.08] hover:border-white/[0.16]'
                }`}
              >
                {/* BorderBeam on popular card */}
                {isPopular && (
                  <BorderBeam size={220} duration={10} />
                )}

                {/* Popular Pill */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand text-white font-mono text-[10px] font-bold uppercase tracking-wider shadow-sm z-30">
                    Most Popular
                  </div>
                )}

                <div className="space-y-6">
                  {/* Plan Header */}
                  <div>
                    <h3 className="text-xl font-sans font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-zinc-400 mt-1 min-h-[32px]">{plan.description}</p>
                  </div>

                  {/* Price with smooth counter presentation */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-sans font-bold text-white tracking-tight">
                      ${price}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">
                      / month {annualBilling && price > 0 ? '(billed annually)' : ''}
                    </span>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => {
                      sound.playSuccess();
                      onSelectPlan(plan.name);
                    }}
                    className={`w-full py-2.5 rounded-lg text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer ${
                      isPopular
                        ? 'bg-brand hover:bg-brand-hover text-white shadow-inner-light shadow-brand/20'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/[0.06]'
                    }`}
                  >
                    {plan.cta}
                  </button>

                  {/* Features List */}
                  <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                    <span className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider block">
                      Includes
                    </span>
                    <div className="space-y-2.5">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/[0.04] text-[11px] font-mono text-zinc-500 text-center">
                  Instant deployment • Cancel anytime
                </div>
              </SpotlightCard>
            );
          })}
        </div>

      </div>
    </section>
  );
};

import React from 'react';

interface HeroSectionProps {
  onTrySimulation: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onTrySimulation }) => {
  return (
    <section className="space-y-6 pt-2 sm:pt-4 pb-1">
      {/* Hero Header */}
      <div className="space-y-3 max-w-2xl">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight font-heading">
          FreshFlow PNG
        </h1>
        <p className="text-lg sm:text-xl font-semibold text-emerald-400">
          What happens to fresh produce when time and delays increase?
        </p>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Explore how transport time, delays and storage conditions can affect the amount of usable fresh produce across Papua New Guinea transit corridors.
        </p>

        <div className="pt-2">
          <button
            onClick={onTrySimulation}
            className="px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            Try a simulation
          </button>
        </div>
      </div>

      {/* Plain English Explanation Box */}
      <div className="p-4 sm:p-5 bg-[#131B2E] border border-slate-800/80 rounded-xl space-y-2 text-slate-300 text-xs sm:text-sm leading-relaxed shadow-xs">
        <p className="font-semibold text-slate-100">
          Fresh produce does not stay fresh forever. The longer it spends travelling or sitting in storage, the more can be lost.
        </p>
        <p className="text-slate-400">
          FreshFlow lets you explore this idea using a simple mathematical model.
        </p>
      </div>
    </section>
  );
};

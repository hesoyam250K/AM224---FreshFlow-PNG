import React from 'react';

interface HeroSectionProps {
  onTrySimulation: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onTrySimulation }) => {
  return (
    <section className="space-y-8 pt-4 pb-2">
      {/* Hero Header */}
      <div className="space-y-3 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
          FreshFlow PNG
        </h1>
        <p className="text-xl font-semibold text-slate-700">
          What happens to fresh produce when time and delays increase?
        </p>
        <p className="text-base text-slate-600 leading-relaxed">
          Explore how transport time, delays and storage conditions can affect the amount of usable fresh produce.
        </p>

        <div className="pt-2">
          <button
            onClick={onTrySimulation}
            className="px-6 py-3 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            Try a simulation
          </button>
        </div>
      </div>

      {/* Plain English Explanation Box */}
      <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-2 text-slate-700 text-sm leading-relaxed shadow-xs">
        <p className="font-medium text-slate-900">
          Fresh produce does not stay fresh forever. The longer it spends travelling or sitting in storage, the more can be lost.
        </p>
        <p className="text-slate-600">
          FreshFlow lets you explore this idea using a simple mathematical model.
        </p>
      </div>
    </section>
  );
};

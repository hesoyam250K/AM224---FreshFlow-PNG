import React from 'react';
import { SimulationResult } from '../math_engine/types';

interface ResultsDashboardProps {
  result: SimulationResult;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result }) => {
  const { startingQty, remainingQty, lostQty, percentageLoss } = result;

  return (
    <section id="results" className="bg-[#131B2E] border border-slate-800/80 rounded-xl p-4 sm:p-8 space-y-5 sm:space-y-6 shadow-xs scroll-mt-20">
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-bold text-slate-100 font-heading">
          Here's what happened
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Estimated results based on your selected conditions.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 py-3 border-y border-slate-800/80">
        <div className="space-y-1">
          <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Starting amount
          </span>
          <span className="block text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-100 font-mono tabular-nums">
            {startingQty.toLocaleString()} <span className="text-xs sm:text-sm text-slate-400 font-sans font-normal">kg</span>
          </span>
        </div>

        <div className="space-y-1">
          <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Estimated remaining
          </span>
          <span className="block text-xl sm:text-2xl md:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
            {remainingQty.toLocaleString(undefined, { maximumFractionDigits: 1 })} <span className="text-xs sm:text-sm text-slate-400 font-sans font-normal">kg</span>
          </span>
        </div>

        <div className="space-y-1">
          <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Estimated loss
          </span>
          <span className="block text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
            {lostQty.toLocaleString(undefined, { maximumFractionDigits: 1 })} <span className="text-xs sm:text-sm text-slate-400 font-sans font-normal">kg</span>
          </span>
        </div>

        <div className="space-y-1">
          <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Percentage lost
          </span>
          <span className="block text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-100 font-mono tabular-nums">
            {percentageLoss.toFixed(1)}<span className="text-sm text-slate-400 font-sans">%</span>
          </span>
        </div>
      </div>
    </section>
  );
};

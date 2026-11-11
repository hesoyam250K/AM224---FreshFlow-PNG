import React from 'react';
import { SimulationResult } from '../math_engine/types';

interface ResultsDashboardProps {
  result: SimulationResult;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result }) => {
  const { startingQty, remainingQty, lostQty, percentageLoss } = result;

  return (
    <section id="results" className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs scroll-mt-20">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 font-heading">
          Here's what happened
        </h2>
        <p className="text-sm text-slate-600">
          Estimated results based on your selected conditions.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-2 border-y border-slate-200">
        <div className="space-y-1">
          <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider">
            Starting amount
          </span>
          <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {startingQty.toLocaleString()} <span className="text-sm text-slate-500 font-sans font-normal">kg</span>
          </span>
        </div>

        <div className="space-y-1">
          <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider">
            Estimated remaining
          </span>
          <span className="block text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono tabular-nums">
            {remainingQty.toLocaleString(undefined, { maximumFractionDigits: 1 })} <span className="text-sm text-slate-500 font-sans font-normal">kg</span>
          </span>
        </div>

        <div className="space-y-1">
          <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider">
            Estimated loss
          </span>
          <span className="block text-2xl sm:text-3xl font-extrabold text-amber-700 font-mono tabular-nums">
            {lostQty.toLocaleString(undefined, { maximumFractionDigits: 1 })} <span className="text-sm text-slate-500 font-sans font-normal">kg</span>
          </span>
        </div>

        <div className="space-y-1">
          <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider">
            Percentage lost
          </span>
          <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {percentageLoss.toFixed(1)}<span className="text-lg text-slate-500 font-sans">%</span>
          </span>
        </div>
      </div>
    </section>
  );
};

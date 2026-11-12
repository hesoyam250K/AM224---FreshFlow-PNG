import React from 'react';

export const SimpleQuestion: React.FC = () => {
  return (
    <section className="bg-[#131B2E] border border-slate-800/80 rounded-xl p-4 sm:p-8 space-y-5 sm:space-y-6 shadow-xs">
      <div className="space-y-1.5">
        <h2 className="text-lg sm:text-xl font-bold text-slate-100 font-heading">
          Start with a simple situation
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
          Imagine fresh produce leaving a farm and travelling to a market. What happens if the journey takes longer than expected?
        </p>
      </div>

      {/* Visual Flow: Farm -> Transport -> Market */}
      <div className="pt-1">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 bg-[#0B0F17]/80 border border-slate-800 rounded-lg text-slate-300 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
              1
            </span>
            <div>
              <span className="block font-semibold text-slate-100">Farm</span>
              <span className="text-[11px] sm:text-xs text-slate-400">Fresh harvest ready</span>
            </div>
          </div>

          <div className="text-slate-600 font-bold hidden sm:block">→</div>
          <div className="text-slate-600 font-bold text-center sm:hidden">↓</div>

          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
              2
            </span>
            <div>
              <span className="block font-semibold text-slate-100">Transport</span>
              <span className="text-[11px] sm:text-xs text-slate-400">Travel time & storage</span>
            </div>
          </div>

          <div className="text-slate-600 font-bold hidden sm:block">→</div>
          <div className="text-slate-600 font-bold text-center sm:hidden">↓</div>

          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
              3
            </span>
            <div>
              <span className="block font-semibold text-slate-100">Market</span>
              <span className="text-[11px] sm:text-xs text-slate-400">Usable produce remaining</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

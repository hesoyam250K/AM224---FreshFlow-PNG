import React from 'react';

export const SimpleQuestion: React.FC = () => {
  return (
    <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-slate-900 font-heading">
          Start with a simple situation
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
          Imagine fresh produce leaving a farm and travelling to a market. What happens if the journey takes longer than expected?
        </p>
      </div>

      {/* Very Simple Visual Flow: Farm -> Transport -> Market */}
      <div className="pt-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm font-medium">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              1
            </span>
            <div>
              <span className="block font-semibold text-slate-900">Farm</span>
              <span className="text-xs text-slate-500">Fresh harvest ready</span>
            </div>
          </div>

          <div className="text-slate-400 font-bold hidden sm:block">→</div>
          <div className="text-slate-400 font-bold sm:hidden">↓</div>

          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
              2
            </span>
            <div>
              <span className="block font-semibold text-slate-900">Transport</span>
              <span className="text-xs text-slate-500">Travel time & storage</span>
            </div>
          </div>

          <div className="text-slate-400 font-bold hidden sm:block">→</div>
          <div className="text-slate-400 font-bold sm:hidden">↓</div>

          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs">
              3
            </span>
            <div>
              <span className="block font-semibold text-slate-900">Market</span>
              <span className="text-xs text-slate-500">Usable produce remaining</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

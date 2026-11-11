import React from 'react';
import { SimulationResult } from '../math_engine/types';
import { deriveMathematicalInsights } from '../math_engine/insightsEngine';
import { Lightbulb, Info, AlertTriangle, CheckCircle, Calculator } from 'lucide-react';

interface DecisionInsightsProps {
  result: SimulationResult;
}

export const DecisionInsights: React.FC<DecisionInsightsProps> = ({ result }) => {
  const insights = deriveMathematicalInsights(result);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-heading">Simulation Insights</h2>
            <p className="text-xs text-slate-400">
              Rule-based mathematical deductions derived from first-order ODE output
            </p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-full text-slate-400 font-mono">
          Deterministic Rule Engine
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item, idx) => {
          let icon = <Info className="w-4 h-4 text-sky-400" />;
          let borderStyle = 'border-slate-800 bg-slate-950/60';
          let titleColor = 'text-white';

          if (item.type === 'warning') {
            icon = <AlertTriangle className="w-4 h-4 text-amber-400" />;
            borderStyle = 'border-amber-500/30 bg-amber-950/20';
            titleColor = 'text-amber-300';
          } else if (item.type === 'success') {
            icon = <CheckCircle className="w-4 h-4 text-emerald-400" />;
            borderStyle = 'border-emerald-500/30 bg-emerald-950/20';
            titleColor = 'text-emerald-300';
          } else if (item.type === 'math') {
            icon = <Calculator className="w-4 h-4 text-teal-400" />;
            borderStyle = 'border-teal-500/30 bg-teal-950/20';
            titleColor = 'text-teal-300';
          }

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${borderStyle} transition-all space-y-2 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`text-sm font-semibold ${titleColor} flex items-center gap-2`}>
                    {icon}
                    {item.title}
                  </h3>
                  {item.metric && (
                    <span className="text-[11px] font-mono px-2 py-0.5 bg-slate-900 border border-slate-700/60 rounded text-slate-300">
                      {item.metric}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
              </div>
              <div className="pt-2 border-t border-slate-800/40 text-[10px] text-slate-500 flex items-center justify-between">
                <span>Model derivation</span>
                <span className="italic">Estimated / Simulated</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { Info, AlertCircle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            Educational Applied Mathematics Simulation
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            This application is an educational mathematical simulation exploring how first-order differential equations (ODEs) and rate dynamics can be applied to supply-chain problems. Parameters and results are illustrative and designed for exploration of rate dynamics across PNG transport corridors.
          </p>
        </div>
      </div>
    </div>
  );
};

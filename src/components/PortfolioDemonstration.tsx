import React from 'react';

export const PortfolioDemonstration: React.FC = () => {
  return (
    <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 font-heading">
          What this project demonstrates
        </h2>
        <p className="text-sm text-slate-600">
          Core concepts and technical skills demonstrated in this mini-scale portfolio application.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Applied Mathematics */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
          <h3 className="text-sm font-bold text-slate-900 font-heading">
            Applied Mathematics (AM224)
          </h3>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
            <li>First-order differential equations</li>
            <li>Rate modelling</li>
            <li>Separable equations</li>
            <li>Autonomous equations</li>
            <li>Initial value problems</li>
            <li>First-order linear equations</li>
            <li>Equilibrium analysis</li>
          </ul>
        </div>

        {/* Python & Numerical Engineering */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
          <h3 className="text-sm font-bold text-slate-900 font-heading">
            Python & Numerical Simulation
          </h3>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
            <li>Mathematical modelling</li>
            <li>Numerical simulation (RK4 solver)</li>
            <li>Data processing & validation</li>
            <li>Interactive time-series visualisation</li>
          </ul>
        </div>

        {/* AI Layer */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
          <h3 className="text-sm font-bold text-slate-900 font-heading">
            AI Engineering
          </h3>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
            <li>Optional AI explanation layer</li>
            <li>Strict separation of math & AI</li>
            <li>Deterministic math as truth source</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

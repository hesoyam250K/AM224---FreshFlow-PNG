import React from 'react';
import { Award, Calculator, Code, BarChart2, Cpu, CheckCircle } from 'lucide-react';

export const PortfolioSection: React.FC = () => {
  const competencies = [
    {
      icon: <Calculator className="w-5 h-5 text-emerald-400" />,
      title: 'Applied Mathematics (AM224)',
      items: [
        'First-Order Differential Equations (ODEs)',
        'Separable Rate Equations & Analytical Solvers',
        'Autonomous Systems & Rate Modelling',
        'First-Order Linear Equations & Integrating Factors',
        'Equilibrium Analysis (Q* = S/k) & Stability',
        'Initial Value Problems (IVPs: Q(0) = Q₀)',
        'Half-life (t½) & Truncation Error Bounds',
      ],
    },
    {
      icon: <Code className="w-5 h-5 text-teal-400" />,
      title: 'Software & Numerical Engineering',
      items: [
        '4th-Order Runge-Kutta (RK4) Numerical ODE Solver',
        'Deterministic State & Time-Series Generation',
        'TypeScript High-Performance Computation',
        'Full-Stack Express & Vite Architecture',
        'Piecewise Rate Function Integration',
        'Clean Modular Engine Architecture',
      ],
    },
    {
      icon: <BarChart2 className="w-5 h-5 text-sky-400" />,
      title: 'Data Visualisation & UX Design',
      items: [
        'Multi-Trace Analytical vs Numerical Plots',
        'Scenario Comparison & Sensitivity Traces',
        'Dark Analytical Dashboard Aesthetic',
        'Tabular Numeral Precision (font-mono)',
        'Interactive Parameter Controls & Presets',
        'WCAG Accessible High-Contrast Elements',
      ],
    },
    {
      icon: <Cpu className="w-5 h-5 text-amber-400" />,
      title: 'AI Engineering & System Safety',
      items: [
        'Strict Separation of Math Engine & AI Layer',
        'Deterministic Math as Single Source of Truth',
        'Server-Side Gemini 3.8 Flash Proxy Endpoint',
        'Zero-Hallucination Numerical Prompt Guardrails',
        'Natural Language Agricultural Synthesis',
      ],
    },
  ];

  return (
    <div id="portfolio" className="bg-[#0B1A24] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-heading">What This Project Demonstrates</h2>
            <p className="text-xs text-slate-400">
              Portfolio synthesis across Applied Mathematics, Software Engineering & AI Integration
            </p>
          </div>
        </div>
        <span className="text-xs px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-full font-mono font-semibold">
          Applied Math Portfolio
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {competencies.map((comp, idx) => (
          <div key={idx} className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-2">
                {comp.icon}
                <h3 className="text-sm font-bold text-white font-heading">{comp.title}</h3>
              </div>
              <ul className="space-y-2">
                {comp.items.map((item, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

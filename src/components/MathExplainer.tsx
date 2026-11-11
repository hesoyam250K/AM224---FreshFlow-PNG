import React, { useState } from 'react';
import katex from 'katex';
import { BookOpen, Calculator, CheckCircle2, ChevronRight, HelpCircle, Layers, ArrowRight } from 'lucide-react';

export const MathExplainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'concepts' | 'model1' | 'model2' | 'model3' | 'numerical'>('concepts');

  const renderMath = (latexStr: string, displayMode: boolean = true) => {
    try {
      return {
        __html: katex.renderToString(latexStr, {
          displayMode,
          throwOnError: false,
        }),
      };
    } catch (e) {
      return { __html: latexStr };
    }
  };

  return (
    <div id="mathematics" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-heading">Mathematics Behind FreshFlow</h2>
            <p className="text-xs text-slate-400">
              First-Order Differential Equations, Separable Systems & Integrating Factors (AM224)
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('concepts')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'concepts'
                ? 'bg-teal-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Core ODE Concepts
          </button>
          <button
            onClick={() => setActiveTab('model1')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'model1'
                ? 'bg-teal-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Model 1: Autonomous Spoilage
          </button>
          <button
            onClick={() => setActiveTab('model2')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'model2'
                ? 'bg-teal-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Model 2: Supply + Integrating Factor
          </button>
          <button
            onClick={() => setActiveTab('model3')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'model3'
                ? 'bg-teal-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Model 3: Piecewise k(t)
          </button>
          <button
            onClick={() => setActiveTab('numerical')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'numerical'
                ? 'bg-teal-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            RK4 Numerical Solver
          </button>
        </div>
      </div>

      {/* TAB 1: Core ODE Concepts */}
      {activeTab === 'concepts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-teal-400" />
              Ordinary Differential Equation
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              An equation involving an unknown function <span dangerouslySetInnerHTML={renderMath('Q(t)', false)} /> and its derivatives with respect to a single independent variable (time <span dangerouslySetInnerHTML={renderMath('t', false)} />).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-teal-400" />
              First-Order Classification
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Only the first derivative <span dangerouslySetInnerHTML={renderMath('\\frac{dQ}{dt}', false)} /> appears. The rate of change of usable crop quantity depends directly on current state and parameters.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-teal-400" />
              Autonomous Equation
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The rate equation <span dangerouslySetInnerHTML={renderMath('\\frac{dQ}{dt} = -kQ', false)} /> depends explicitly on <span dangerouslySetInnerHTML={renderMath('Q', false)} /> rather than explicitly on time <span dangerouslySetInnerHTML={renderMath('t', false)} />.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-teal-400" />
              Separable ODE Structure
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Can be algebraically separated into terms containing <span dangerouslySetInnerHTML={renderMath('Q', false)} /> on one side and terms containing <span dangerouslySetInnerHTML={renderMath('t', false)} /> on the other before integrating.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-teal-400" />
              Initial Value Problem (IVP)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The physical constraint <span dangerouslySetInnerHTML={renderMath('Q(0) = Q_0', false)} /> (initial harvested produce quantity at farm gate) singles out one unique trajectory from an infinite family of solution curves.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-teal-400" />
              Equilibrium State
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              A state where <span dangerouslySetInnerHTML={renderMath('\\frac{dQ}{dt} = 0', false)} />. In Model 2, incoming supply rate equals spoilage loss rate (<span dangerouslySetInnerHTML={renderMath('S = kQ^* \\implies Q^* = S/k', false)} />).
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: Model 1 Derivation */}
      {activeTab === 'model1' && (
        <div className="space-y-4 bg-slate-950 p-6 rounded-xl border border-slate-800">
          <h3 className="text-base font-bold text-emerald-400">Model 1: Analytical Derivation of Basic Spoilage ODE</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The basic rate model assumes that the rate of produce loss is directly proportional to the amount of usable produce currently remaining:
          </p>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-emerald-300 text-center font-mono">
            <div dangerouslySetInnerHTML={renderMath('\\frac{dQ}{dt} = -k Q')} />
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <h4 className="font-semibold text-white">Step-by-Step Separation of Variables:</h4>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>
                Divide by <span dangerouslySetInnerHTML={renderMath('Q', false)} /> and multiply by <span dangerouslySetInnerHTML={renderMath('dt', false)} />:
                <div className="my-2 bg-slate-900 p-2 rounded text-center text-emerald-300" dangerouslySetInnerHTML={renderMath('\\frac{1}{Q} dQ = -k dt')} />
              </li>
              <li>
                Integrate both sides with respect to their variables:
                <div className="my-2 bg-slate-900 p-2 rounded text-center text-emerald-300" dangerouslySetInnerHTML={renderMath('\\int \\frac{1}{Q} dQ = \\int -k dt \\implies \\ln|Q| = -kt + C')} />
              </li>
              <li>
                Exponentiate both sides to solve for <span dangerouslySetInnerHTML={renderMath('Q(t)', false)} />:
                <div className="my-2 bg-slate-900 p-2 rounded text-center text-emerald-300" dangerouslySetInnerHTML={renderMath('Q(t) = e^{-kt + C} = e^C \\cdot e^{-kt} = C_1 e^{-kt}')} />
              </li>
              <li>
                Apply the Initial Condition <span dangerouslySetInnerHTML={renderMath('Q(0) = Q_0', false)} />:
                <div className="my-2 bg-slate-900 p-2 rounded text-center text-emerald-300" dangerouslySetInnerHTML={renderMath('Q(0) = C_1 e^{0} = C_1 \\implies C_1 = Q_0')} />
              </li>
            </ol>
          </div>

          <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-200">
            <span className="font-bold">Final Analytical Solution: </span>
            <span dangerouslySetInnerHTML={renderMath('Q(t) = Q_0 e^{-kt}', false)} />
            <br />
            <span className="font-bold">Crop Half-Life Definition: </span>
            <span dangerouslySetInnerHTML={renderMath('t_{1/2} = \\frac{\\ln(2)}{k}', false)} />
          </div>
        </div>
      )}

      {/* TAB 3: Model 2 Derivation (Integrating Factor) */}
      {activeTab === 'model2' && (
        <div className="space-y-4 bg-slate-950 p-6 rounded-xl border border-slate-800">
          <h3 className="text-base font-bold text-teal-300">Model 2: Supply + Spoilage via Integrating Factor</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            When incoming produce arrives at a constant supply rate <span dangerouslySetInnerHTML={renderMath('S', false)} /> (e.g. continuous market unloading), the governing first-order linear ODE is:
          </p>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-teal-300 text-center font-mono">
            <div dangerouslySetInnerHTML={renderMath('\\frac{dQ}{dt} + k Q = S')} />
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <h4 className="font-semibold text-white">Integrating Factor Technique:</h4>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              <li>
                Standard linear form <span dangerouslySetInnerHTML={renderMath('\\frac{dQ}{dt} + P(t)Q = f(t)', false)} /> where <span dangerouslySetInnerHTML={renderMath('P(t) = k', false)} /> and <span dangerouslySetInnerHTML={renderMath('f(t) = S', false)} />.
              </li>
              <li>
                Compute Integrating Factor <span dangerouslySetInnerHTML={renderMath('I(t) = e^{\\int P(t)dt} = e^{\\int k dt} = e^{kt}', false)} />.
              </li>
              <li>
                Multiply the differential equation by <span dangerouslySetInnerHTML={renderMath('I(t) = e^{kt}', false)} />:
                <div className="my-2 bg-slate-900 p-2 rounded text-center text-teal-300" dangerouslySetInnerHTML={renderMath('e^{kt} \\frac{dQ}{dt} + k e^{kt} Q = S e^{kt} \\implies \\frac{d}{dt} \\left( Q e^{kt} \\right) = S e^{kt}')} />
              </li>
              <li>
                Integrate both sides:
                <div className="my-2 bg-slate-900 p-2 rounded text-center text-teal-300" dangerouslySetInnerHTML={renderMath('Q e^{kt} = \\int S e^{kt} dt = \\frac{S}{k} e^{kt} + C \\implies Q(t) = \\frac{S}{k} + C e^{-kt}')} />
              </li>
              <li>
                Apply <span dangerouslySetInnerHTML={renderMath('Q(0) = Q_0 \\implies Q_0 = \\frac{S}{k} + C \\implies C = Q_0 - \\frac{S}{k}', false)} />.
              </li>
            </ol>
          </div>

          <div className="p-4 bg-teal-950/40 border border-teal-500/30 rounded-xl text-xs text-teal-200">
            <span className="font-bold">Exact Solution: </span>
            <span dangerouslySetInnerHTML={renderMath('Q(t) = \\frac{S}{k} + \\left( Q_0 - \\frac{S}{k} \\right) e^{-kt}', false)} />
            <br />
            <span className="font-bold">Equilibrium State: </span>
            As <span dangerouslySetInnerHTML={renderMath('t \\to \\infty', false)} />, <span dangerouslySetInnerHTML={renderMath('e^{-kt} \\to 0', false)} />, yielding stable equilibrium <span dangerouslySetInnerHTML={renderMath('Q^* = \\frac{S}{k}', false)} />.
          </div>
        </div>
      )}

      {/* TAB 4: Model 3 Piecewise */}
      {activeTab === 'model3' && (
        <div className="space-y-4 bg-slate-950 p-6 rounded-xl border border-slate-800">
          <h3 className="text-base font-bold text-amber-300">Model 3: Time-Varying & Piecewise Deterioration k(t)</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            In real Papua New Guinea supply chains, deterioration rate <span dangerouslySetInnerHTML={renderMath('k(t)', false)} /> varies across journey legs (farm loading, Kassam Pass transit, landslide roadside delays, coastal port handling):
          </p>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-amber-300 text-center font-mono">
            <div dangerouslySetInnerHTML={renderMath('\\frac{dQ}{dt} = -k(t) Q')} />
          </div>

          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
            <h4 className="font-semibold text-white">General Solution with Definite Integration:</h4>
            <div className="bg-slate-950 p-3 rounded text-center text-amber-300" dangerouslySetInnerHTML={renderMath('Q(t) = Q_0 \\exp\\left( -\\int_{0}^{t} k(\\tau) d\\tau \\right)')} />
            <p className="text-[11px] text-slate-400">
              For piecewise constant segments <span dangerouslySetInnerHTML={renderMath('k(t) = k_i', false)} /> over subintervals <span dangerouslySetInnerHTML={renderMath('[t_i, t_{i+1}]', false)} />, the solution compounds exponentially across each route segment.
            </p>
          </div>
        </div>
      )}

      {/* TAB 5: Numerical RK4 Solver */}
      {activeTab === 'numerical' && (
        <div className="space-y-4 bg-slate-950 p-6 rounded-xl border border-slate-800">
          <h3 className="text-base font-bold text-sky-400">4th-Order Runge-Kutta (RK4) Numerical Solver</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            To solve arbitrary rate functions <span dangerouslySetInnerHTML={renderMath('\\frac{dQ}{dt} = f(t, Q)', false)} />, the application executes a 4th-order Runge-Kutta step integration:
          </p>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2 font-mono">
            <p className="text-sky-300 font-bold">RK4 Evaluation Slopes per Step h:</p>
            <p>k₁ = f(tₙ, Qₙ)</p>
            <p>k₂ = f(tₙ + h/2, Qₙ + (h/2)k₁)</p>
            <p>k₃ = f(tₙ + h/2, Qₙ + (h/2)k₂)</p>
            <p>k₄ = f(tₙ + h, Qₙ + hk₃)</p>
            <div className="pt-2 text-emerald-400 font-bold border-t border-slate-800">
              Qₙ₊₁ = Qₙ + (h/6)(k₁ + 2k₂ + 2k₃ + k₄)
            </div>
          </div>

          <p className="text-xs text-slate-400 italic">
            Local truncation error is O(h⁵), providing ultra-high numerical fidelity matching the exact analytical solution.
          </p>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import katex from 'katex';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const MathExplanation: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showIntegratingFactor, setShowIntegratingFactor] = useState<boolean>(false);

  const renderMath = (latexStr: string, displayMode: boolean = false) => {
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
    <section id="maths" className="bg-[#131B2E] border border-slate-800/80 rounded-xl p-4 sm:p-8 space-y-4 shadow-xs scroll-mt-20">
      {/* Header Button to Toggle Expand/Collapse */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left cursor-pointer group"
      >
        <div className="space-y-1 pr-2">
          <h2 className="text-lg sm:text-xl font-bold text-slate-100 font-heading group-hover:text-emerald-400 transition-colors">
            How does the maths work?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Click to explore the differential equations behind the simulation.
          </p>
        </div>
        <div className="p-2 bg-slate-800/80 rounded-lg text-slate-300 group-hover:bg-emerald-950 group-hover:text-emerald-400 transition-colors shrink-0">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Expandable Content */}
      {isOpen && (
        <div className="pt-4 border-t border-slate-800/80 space-y-6 sm:space-y-8 text-slate-300 text-xs sm:text-sm leading-relaxed">
          {/* Plain English Start */}
          <div className="p-4 bg-[#0B0F17]/80 border border-slate-800 rounded-lg space-y-2">
            <p className="font-semibold text-slate-100">
              The model looks at how the amount of usable produce changes over time.
            </p>
            <p className="text-slate-400">
              In simple terms, the model assumes that produce gradually decreases over time.
            </p>
          </div>

          {/* Model 1: Main Equation */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-slate-100 font-heading">
              1. Basic Deterioration Model
            </h3>
            <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded-lg text-center my-2 font-mono text-emerald-300 text-sm sm:text-base overflow-x-auto max-w-full">
              <span dangerouslySetInnerHTML={renderMath('\\frac{dQ}{dt} = -kQ', true)} />
            </div>
            <ul className="space-y-1 text-slate-300 pl-4 list-disc">
              <li><strong className="text-slate-100">Q</strong> is the amount of usable produce remaining.</li>
              <li><strong className="text-slate-100">t</strong> is time (in hours).</li>
              <li><strong className="text-slate-100">k</strong> controls how quickly the produce deteriorates.</li>
            </ul>
          </div>

          {/* Separable Equation */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-slate-100 font-heading">
              2. Solving the Separable Equation
            </h3>
            <p>
              This equation can be solved by separating the quantity and time parts of the equation:
            </p>
            <div className="p-4 bg-[#0B0F17]/80 border border-slate-800 rounded-lg space-y-2 font-mono text-[11px] sm:text-xs text-slate-200 overflow-x-auto max-w-full">
              <p>Step 1: Separate variables → <span dangerouslySetInnerHTML={renderMath('\\frac{1}{Q} dQ = -k dt')} /></p>
              <p>Step 2: Integrate both sides → <span dangerouslySetInnerHTML={renderMath('\\ln(Q) = -kt + C')} /></p>
              <p>Step 3: Solve for Q(t) → <span dangerouslySetInnerHTML={renderMath('Q(t) = Q_0 e^{-kt}')} /></p>
            </div>
            <p className="text-xs text-slate-400">
              This mathematical solution lets us estimate how much usable produce remains after a certain amount of time.
            </p>
          </div>

          {/* Initial Value */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-100 font-heading">
              3. Initial Value Condition
            </h3>
            <p>
              Every simulation starts with an initial amount when time <span dangerouslySetInnerHTML={renderMath('t = 0')} />:
            </p>
            <div className="p-3 bg-[#0B0F17]/80 border border-slate-800 rounded-lg font-mono text-emerald-400 font-semibold text-center text-xs sm:text-sm">
              Q(0) = 1,000 kg
            </div>
            <p className="text-xs text-slate-400">
              This starting value helps determine the specific result for that simulation.
            </p>
          </div>

          {/* Model 2: Supply and Spoilage Model */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-slate-100 font-heading">
              4. Supply and Spoilage Model
            </h3>
            <p>
              For a slightly more realistic situation where new produce arrives while existing produce deteriorates:
            </p>
            <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded-lg text-center font-mono text-emerald-300 text-sm sm:text-base overflow-x-auto max-w-full">
              <span dangerouslySetInnerHTML={renderMath('\\frac{dQ}{dt} = S - kQ', true)} />
            </div>
            <ul className="space-y-1 text-slate-300 pl-4 list-disc">
              <li><strong className="text-slate-100">S</strong> represents new produce entering the system.</li>
              <li><strong className="text-slate-100">kQ</strong> represents produce being lost over time.</li>
            </ul>
            <p className="text-xs text-slate-400">
              This model looks at two things happening at once: new produce arriving and existing produce deteriorating.
            </p>
          </div>

          {/* Equilibrium */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-slate-100 font-heading">
              5. Equilibrium State
            </h3>
            <p>
              Sometimes the amount entering the system and the amount being lost can balance each other:
            </p>
            <div className="p-4 bg-[#0B0F17]/80 border border-slate-800 rounded-lg text-center font-mono text-slate-100 overflow-x-auto max-w-full">
              <span dangerouslySetInnerHTML={renderMath('Q^* = \\frac{S}{k}', true)} />
            </div>
            <p className="text-xs text-slate-400">
              This is the point where the amount entering matches the amount being lost in the model.
            </p>
          </div>

          {/* First-Order Linear Equation for AM224 */}
          <div className="space-y-3 border-t border-slate-800/80 pt-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-100 font-heading">
              6. First-Order Linear Equation (AM224 Concept)
            </h3>
            <p>
              The supply model can be written in standard linear form:
            </p>
            <div className="p-4 bg-[#0B0F17]/80 border border-slate-800 rounded-lg text-center font-mono text-slate-100 overflow-x-auto max-w-full">
              <span dangerouslySetInnerHTML={renderMath('\\frac{dQ}{dt} + kQ = S', true)} />
            </div>

            <button
              onClick={() => setShowIntegratingFactor(!showIntegratingFactor)}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
            >
              {showIntegratingFactor ? 'Hide Integrating Factor Details' : 'Show Integrating Factor Details (AM224)'}
            </button>

            {showIntegratingFactor && (
              <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-lg space-y-2 text-[11px] sm:text-xs font-mono text-slate-300 overflow-x-auto max-w-full">
                <p><strong>Linear Form:</strong> <span dangerouslySetInnerHTML={renderMath('Q\' + P(t)Q = f(t)')} /> where <span dangerouslySetInnerHTML={renderMath('P(t) = k')} />, <span dangerouslySetInnerHTML={renderMath('f(t) = S')} /></p>
                <p><strong>Integrating Factor:</strong> <span dangerouslySetInnerHTML={renderMath('I(t) = e^{\\int k dt} = e^{kt}')} /></p>
                <p><strong>Complementary Solution:</strong> <span dangerouslySetInnerHTML={renderMath('Q_c(t) = C e^{-kt}')} /></p>
                <p><strong>Particular Solution:</strong> <span dangerouslySetInnerHTML={renderMath('Q_p(t) = \\frac{S}{k}')} /></p>
                <p><strong>General Solution:</strong> <span dangerouslySetInnerHTML={renderMath('Q(t) = \\frac{S}{k} + (Q_0 - \\frac{S}{k})e^{-kt}')} /></p>
              </div>
            )}
          </div>

          {/* Numerical Simulation */}
          <div className="space-y-2 border-t border-slate-800/80 pt-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-100 font-heading">
              7. Numerical Simulation
            </h3>
            <p className="text-xs text-slate-400">
              The computer solves the model step by step using 4th-order Runge-Kutta numerical integration to simulate what happens over time and verify the exact mathematical solution.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

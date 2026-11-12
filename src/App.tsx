import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { HeroSection } from './components/HeroSection';
import { SimpleQuestion } from './components/SimpleQuestion';
import { SimulationControls } from './components/SimulationControls';
import { ResultsDashboard } from './components/ResultsDashboard';
import { ChartSection } from './components/ChartSection';
import { ScenarioComparison } from './components/ScenarioComparison';
import { ModelSuggestions } from './components/ModelSuggestions';
import { MathExplanation } from './components/MathExplanation';
import { AIExplainer } from './components/AIExplainer';
import { Disclaimer } from './components/Disclaimer';
import { PortfolioDemonstration } from './components/PortfolioDemonstration';

import { runSimulation, fetchSimulationResult } from './math_engine/odeModels';
import { SimulationParams, SimulationResult } from './math_engine/types';

export default function App() {
  const defaultParams: SimulationParams = {
    produceId: 'tomatoes',
    initialQuantity: 1000,
    transportHours: 12,
    storageCondition: 'normal',
    scenarioId: 'normal_journey',
    incomingSupplyRate: 40,
    enableModel2Supply: false,
    enablePiecewiseConditions: false,
  };

  const [params, setParams] = useState<SimulationParams>(defaultParams);
  const [simulationResult, setSimulationResult] = useState<SimulationResult>(() => runSimulation(defaultParams));

  // Fetch simulation results asynchronously from Python FastAPI Backend
  useEffect(() => {
    let isMounted = true;
    fetchSimulationResult(params).then((res) => {
      if (isMounted) {
        setSimulationResult(res);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [params]);

  const scrollToSimulation = () => {
    const el = document.getElementById('simulation');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToResults = () => {
    const el = document.getElementById('results');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans selection:bg-emerald-900/60 selection:text-emerald-200">
      {/* Top Bar Navigation */}
      <TopBar onTrySimulation={scrollToSimulation} />

      {/* Main Content Area */}
      <main className="flex-grow max-w-4xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-10">
        {/* Section 1: Hero & Plain English Explanation */}
        <HeroSection onTrySimulation={scrollToSimulation} />

        {/* Section 2: The Simple Question (Farm -> Transport -> Market) */}
        <SimpleQuestion />

        {/* Section 3: Simulation Inputs */}
        <SimulationControls
          params={params}
          onChangeParams={setParams}
          onRunSimulation={scrollToResults}
        />

        {/* Section 4: Results */}
        <ResultsDashboard result={simulationResult} />

        {/* Section 5: Interactive Visualisations & Solver Comparisons */}
        <ChartSection result={simulationResult} />

        {/* Section 6: What If Conditions Change? (Comparison Chart) */}
        <ScenarioComparison result={simulationResult} />

        {/* Section 7: What The Model Suggests (Observations) */}
        <ModelSuggestions result={simulationResult} />

        {/* Section 8: The Maths Behind It (Expandable) */}
        <MathExplanation />

        {/* Section 9: AI Explanation Feature */}
        <AIExplainer result={simulationResult} />

        {/* Section 10: Important Disclaimer */}
        <Disclaimer />

        {/* Section 11: Final Section (What this project demonstrates) */}
        <PortfolioDemonstration />
      </main>

      {/* Footer */}
      <footer className="bg-[#0F172A]/80 border-t border-slate-800/80 py-6 px-4 sm:px-8 mt-12 text-slate-400 text-xs">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-200">FreshFlow PNG V2</p>
            <p className="text-slate-400">Python FastAPI Engine & Applied Mathematics ODE Simulation</p>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Backend: {simulationResult.engineUsed || 'Python FastAPI (NumPy/SciPy)'}
          </p>
        </div>
      </footer>
    </div>
  );
}

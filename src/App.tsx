import React, { useState, useMemo } from 'react';
import { TopBar } from './components/TopBar';
import { HeroSection } from './components/HeroSection';
import { SimpleQuestion } from './components/SimpleQuestion';
import { SimulationControls } from './components/SimulationControls';
import { ResultsDashboard } from './components/ResultsDashboard';
import { MainGraph } from './components/MainGraph';
import { ScenarioComparison } from './components/ScenarioComparison';
import { ModelSuggestions } from './components/ModelSuggestions';
import { MathExplanation } from './components/MathExplanation';
import { AIExplainer } from './components/AIExplainer';
import { Disclaimer } from './components/Disclaimer';
import { PortfolioDemonstration } from './components/PortfolioDemonstration';

import { runSimulation } from './math_engine/odeModels';
import { SimulationParams } from './math_engine/types';

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

  // Compute deterministic mathematical simulation result in real-time
  const simulationResult = useMemo(() => {
    return runSimulation(params);
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
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <TopBar onTrySimulation={scrollToSimulation} />

      {/* Main Content Area */}
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-10">
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

        {/* Section 5: Main Graph */}
        <MainGraph result={simulationResult} />

        {/* Section 6: What If Conditions Change? (Comparison Chart) */}
        <ScenarioComparison result={simulationResult} />

        {/* Section 7: What The Model Suggests (Observations) */}
        <ModelSuggestions result={simulationResult} />

        {/* Section 8: The Maths Behind It (Expandable) */}
        <MathExplanation />

        {/* Section 9: AI Feature (Optional and Simple) */}
        <AIExplainer result={simulationResult} />

        {/* Section 10: Important Disclaimer */}
        <Disclaimer />

        {/* Section 11: Final Section (What this project demonstrates) */}
        <PortfolioDemonstration />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-8 mt-12 text-slate-500 text-xs">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-800">FreshFlow PNG</p>
            <p className="text-slate-500">Understanding how time and delays affect fresh food</p>
          </div>
          <p className="text-[11px] text-slate-400">
            Educational Applied Mathematics Simulation
          </p>
        </div>
      </footer>
    </div>
  );
}

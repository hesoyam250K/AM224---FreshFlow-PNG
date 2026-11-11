import React from 'react';
import { SimulationResult } from '../math_engine/types';

interface ModelSuggestionsProps {
  result: SimulationResult;
}

export const ModelSuggestions: React.FC<ModelSuggestionsProps> = ({ result }) => {
  const { percentageLoss, params, lostQty, startingQty } = result;

  const observations: string[] = [];

  // Observation 1: Journey length effect
  if (params.transportHours > 30) {
    observations.push(`The simulated ${params.transportHours}-hour travel time significantly reduced the final amount of usable produce.`);
  } else {
    observations.push('A shorter journey helped preserve a higher portion of usable produce.');
  }

  // Observation 2: Storage condition effect
  if (params.storageCondition === 'improved') {
    observations.push('Better storage reduced the estimated rate of deterioration during travel.');
  } else if (params.storageCondition === 'poor') {
    observations.push('Poor storage conditions led to a noticeably faster rate of loss over time.');
  } else {
    observations.push('Standard storage conditions allowed produce to deteriorate at a steady rate.');
  }

  // Observation 3: Comparative loss scale
  if (percentageLoss > 30) {
    observations.push(`Over a third of the starting amount (${percentageLoss.toFixed(1)}%) was estimated as lost in this simulation.`);
  } else {
    observations.push(`In this test, ${percentageLoss.toFixed(1)}% of the initial crop was lost before reaching the destination.`);
  }

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 font-heading">
          What can we learn?
        </h2>
        <p className="text-sm text-slate-600">
          Simple observations based on your simulation results.
        </p>
      </div>

      <div className="space-y-3 pt-2">
        {observations.map((obs, idx) => (
          <div
            key={idx}
            className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 font-medium flex items-start gap-3"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-700 shrink-0 mt-1.5" />
            <p className="leading-relaxed">{obs}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

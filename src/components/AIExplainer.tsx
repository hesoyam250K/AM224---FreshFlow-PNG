import React, { useState } from 'react';
import { SimulationResult } from '../math_engine/types';

interface AIExplainerProps {
  result: SimulationResult;
}

export const AIExplainer: React.FC<AIExplainerProps> = ({ result }) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAIExplanation = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produceType: result.produce.name,
          initialQty: result.startingQty,
          durationHours: result.params.transportHours,
          storageCondition: result.params.storageCondition,
          scenarioName: result.params.scenarioId,
          spoilageRate: result.effectiveK,
          remainingQty: result.remainingQty,
          lostQty: result.lostQty,
          percentageLoss: result.percentageLoss,
          halfLifeHours: result.halfLifeHours,
          estimatedLossPGK: result.estimatedValueLostPGK,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate explanation');
      }

      setExplanation(data.explanation);
    } catch (err: any) {
      console.error('AI Explanation Error:', err);
      setError(err.message || 'Could not load explanation at this time.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 font-heading">
          Explain this result
        </h2>
        <p className="text-sm text-slate-600">
          Get a short, plain-English summary of your simulation results.
        </p>
      </div>

      {!explanation && !loading && (
        <div>
          <button
            onClick={fetchAIExplanation}
            className="px-5 py-2.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer"
          >
            Explain this result
          </button>
        </div>
      )}

      {loading && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
          Generating explanation...
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
          {error}
        </div>
      )}

      {explanation && !loading && (
        <div className="space-y-3">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 leading-relaxed whitespace-pre-line">
            {explanation}
          </div>
          <button
            onClick={fetchAIExplanation}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Refresh explanation
          </button>
        </div>
      )}
    </section>
  );
};

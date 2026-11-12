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
        let msg = data.detail || data.error || data.message;
        if (response.status === 503 && (!msg || msg.includes('missing'))) {
          msg = 'AI explanation service is not configured.';
        } else if (response.status === 429) {
          msg = 'Gemini API quota has been reached. Please try again later.';
        } else if (!msg) {
          msg = 'The explanation service is temporarily unavailable.';
        }
        throw new Error(msg);
      }

      setExplanation(data.explanation);
    } catch (err: any) {
      console.error('AI Explanation Error:', err);
      setError(err.message || 'Unable to generate an explanation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#131B2E] border border-slate-800/80 rounded-xl p-4 sm:p-8 space-y-4 shadow-xs">
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-bold text-slate-100 font-heading">
          Explain this result with AI
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Get a short, plain-English summary of your simulation results generated from backend calculations.
        </p>
      </div>

      {!explanation && !loading && (
        <div className="pt-2">
          <button
            onClick={fetchAIExplanation}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            Explain this result
          </button>
        </div>
      )}

      {loading && (
        <div className="p-4 bg-[#0B0F17]/80 border border-slate-800 rounded-lg text-xs sm:text-sm text-emerald-400 font-mono flex items-center gap-3">
          <span className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin shrink-0" />
          <span>Generating explanation from ODE simulation outputs...</span>
        </div>
      )}

      {error && (
        <div className="space-y-3 pt-2">
          <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-lg text-xs sm:text-sm text-rose-300">
            {error}
          </div>
          <button
            onClick={fetchAIExplanation}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            Try again
          </button>
        </div>
      )}

      {explanation && !loading && (
        <div className="space-y-3 pt-2">
          <div className="p-4 sm:p-5 bg-[#0B0F17]/80 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
            {explanation}
          </div>
          <button
            onClick={fetchAIExplanation}
            className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            Refresh explanation
          </button>
        </div>
      )}
    </section>
  );
};

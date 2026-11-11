import React from 'react';
import { PRODUCE_TYPES } from '../math_engine/produceData';
import { SCENARIO_PRESETS } from '../math_engine/scenarios';
import { SimulationParams, StorageCondition, ScenarioPresetId } from '../math_engine/types';

interface SimulationControlsProps {
  params: SimulationParams;
  onChangeParams: (newParams: SimulationParams) => void;
  onRunSimulation: () => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  params,
  onChangeParams,
  onRunSimulation,
}) => {
  const selectedProduce = PRODUCE_TYPES.find((p) => p.id === params.produceId) || PRODUCE_TYPES[0];

  const handleProduceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pId = e.target.value;
    const prod = PRODUCE_TYPES.find((p) => p.id === pId);
    onChangeParams({
      ...params,
      produceId: pId,
      customSpoilageRate: prod ? prod.baseSpoilageRate : params.customSpoilageRate,
    });
  };

  const handleScenarioChange = (sId: ScenarioPresetId) => {
    const sc = SCENARIO_PRESETS.find((s) => s.id === sId);
    if (sc) {
      onChangeParams({
        ...params,
        scenarioId: sId,
        transportHours: sc.transportHours,
        storageCondition: sc.storageCondition,
        customSpoilageRate: undefined,
      });
    }
  };

  return (
    <section id="simulation" className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs scroll-mt-20">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 font-heading">
          Set up your simulation
        </h2>
        <p className="text-sm text-slate-600">
          Choose a few conditions and see what the model predicts.
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Input 1: Produce */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-800">
            Produce
          </label>
          <select
            value={params.produceId}
            onChange={handleProduceChange}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
          >
            {PRODUCE_TYPES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.localName ? `(${p.localName})` : ''}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500">
            {selectedProduce.description}
          </p>
        </div>

        {/* Input 2: Starting amount */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-800">
            Starting amount (kg)
          </label>
          <div className="relative">
            <input
              type="number"
              min="10"
              max="10000"
              step="50"
              value={params.initialQuantity}
              onChange={(e) =>
                onChangeParams({
                  ...params,
                  initialQuantity: Math.max(1, Number(e.target.value) || 0),
                })
              }
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all pr-12 font-mono"
            />
            <span className="absolute right-3.5 top-2 text-xs text-slate-400 font-mono">
              kg
            </span>
          </div>
        </div>

        {/* Input 3: Travel time */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-slate-800">
              Travel time
            </label>
            <span className="text-sm font-bold text-emerald-700 font-mono">
              {params.transportHours} hours
            </span>
          </div>
          <input
            type="range"
            min="2"
            max="72"
            step="1"
            value={params.transportHours}
            onChange={(e) =>
              onChangeParams({
                ...params,
                transportHours: Number(e.target.value),
              })
            }
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
          />
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>2 hrs</span>
            <span>24 hrs</span>
            <span>48 hrs</span>
            <span>72 hrs</span>
          </div>
        </div>

        {/* Input 4: Storage conditions */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-800">
            Storage conditions
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'poor', label: 'Poor', desc: 'The produce deteriorates faster.' },
              { id: 'normal', label: 'Normal', desc: 'A standard example condition.' },
              { id: 'improved', label: 'Better storage', desc: 'The produce deteriorates more slowly.' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => onChangeParams({ ...params, storageCondition: st.id as StorageCondition })}
                className={`p-3 text-left rounded-lg border transition-all cursor-pointer ${
                  params.storageCondition === st.id
                    ? 'border-emerald-600 bg-emerald-50/50 text-slate-900 ring-1 ring-emerald-600/30'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="block font-semibold text-sm mb-0.5">{st.label}</span>
                <span className="block text-xs text-slate-500 leading-tight">{st.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input 5: Journey scenario */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-800">
            Journey scenario
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'normal_journey', label: 'Normal journey', desc: 'Standard expected trip' },
              { id: 'road_delay', label: 'Delayed journey', desc: 'Moderate transport delay' },
              { id: 'major_disruption', label: 'Long delay', desc: 'Extended disruption' },
            ].map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => handleScenarioChange(sc.id as ScenarioPresetId)}
                className={`p-3 text-left rounded-lg border transition-all cursor-pointer ${
                  params.scenarioId === sc.id
                    ? 'border-emerald-600 bg-emerald-50/50 text-slate-900 ring-1 ring-emerald-600/30'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="block font-semibold text-sm mb-0.5">{sc.label}</span>
                <span className="block text-xs text-slate-500 leading-tight">{sc.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Single Primary Action Button */}
        <div className="pt-4">
          <button
            onClick={onRunSimulation}
            className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            Run simulation
          </button>
        </div>
      </div>
    </section>
  );
};

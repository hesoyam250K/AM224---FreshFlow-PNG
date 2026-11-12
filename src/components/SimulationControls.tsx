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
    <section id="simulation" className="bg-[#131B2E] border border-slate-800/80 rounded-xl p-4 sm:p-8 space-y-5 sm:space-y-6 shadow-xs scroll-mt-20">
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-bold text-slate-100 font-heading">
          Set up your simulation
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Choose a few conditions and see what the model predicts.
        </p>
      </div>

      <div className="space-y-5 sm:space-y-6 max-w-2xl">
        {/* Input 1: Produce */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-semibold text-slate-200">
            Produce
          </label>
          <select
            value={params.produceId}
            onChange={handleProduceChange}
            className="w-full bg-[#0B0F17] border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          >
            {PRODUCE_TYPES.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900 text-slate-100">
                {p.name} {p.localName ? `(${p.localName})` : ''}
              </option>
            ))}
          </select>
          <p className="text-[11px] sm:text-xs text-slate-400">
            {selectedProduce.description}
          </p>
        </div>

        {/* Input 2: Starting amount */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-semibold text-slate-200">
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
              className="w-full bg-[#0B0F17] border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all pr-12 font-mono"
            />
            <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-mono">
              kg
            </span>
          </div>
        </div>

        {/* Input 3: Travel time */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs sm:text-sm font-semibold text-slate-200">
              Travel time
            </label>
            <span className="text-xs sm:text-sm font-bold text-emerald-400 font-mono">
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
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>2 hrs</span>
            <span>24 hrs</span>
            <span>48 hrs</span>
            <span>72 hrs</span>
          </div>
        </div>

        {/* Input 4: Storage conditions */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-semibold text-slate-200">
            Storage conditions
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {[
              { id: 'poor', label: 'Poor', desc: 'Deteriorates faster.' },
              { id: 'normal', label: 'Normal', desc: 'Standard condition.' },
              { id: 'improved', label: 'Better storage', desc: 'Deteriorates slower.' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => onChangeParams({ ...params, storageCondition: st.id as StorageCondition })}
                className={`p-3 text-left rounded-lg border transition-all cursor-pointer ${
                  params.storageCondition === st.id
                    ? 'border-emerald-500 bg-emerald-950/40 text-slate-100 ring-1 ring-emerald-500/40'
                    : 'border-slate-800 bg-[#0B0F17]/60 text-slate-300 hover:bg-[#0B0F17]'
                }`}
              >
                <span className="block font-semibold text-xs sm:text-sm mb-0.5">{st.label}</span>
                <span className="block text-[11px] text-slate-400 leading-tight">{st.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input 5: Journey scenario */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-semibold text-slate-200">
            Journey scenario
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
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
                    ? 'border-emerald-500 bg-emerald-950/40 text-slate-100 ring-1 ring-emerald-500/40'
                    : 'border-slate-800 bg-[#0B0F17]/60 text-slate-300 hover:bg-[#0B0F17]'
                }`}
              >
                <span className="block font-semibold text-xs sm:text-sm mb-0.5">{sc.label}</span>
                <span className="block text-[11px] text-slate-400 leading-tight">{sc.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 sm:pt-4">
          <button
            onClick={onRunSimulation}
            className="w-full sm:w-auto px-8 py-3 text-xs sm:text-sm font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            Run simulation
          </button>
        </div>
      </div>
    </section>
  );
};

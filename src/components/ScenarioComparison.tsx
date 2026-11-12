import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { SimulationResult } from '../math_engine/types';
import { generateMultiScenarioTraces } from '../math_engine/odeModels';

interface ScenarioComparisonProps {
  result: SimulationResult;
}

export const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({ result }) => {
  const { params, timeSeries } = result;
  const scenarioTraces = generateMultiScenarioTraces(params);

  // Combine scenario traces into single chart dataset
  const chartData = timeSeries.map((pt, idx) => {
    const row: any = { timeHours: pt.timeHours };
    scenarioTraces.forEach((st) => {
      if (st.timeSeries[idx]) {
        row[st.name] = st.timeSeries[idx].analyticalUsableQty;
      }
    });
    return row;
  });

  return (
    <section id="compare" className="bg-[#131B2E] border border-slate-800/80 rounded-xl p-4 sm:p-8 space-y-4 shadow-xs scroll-mt-20">
      <div className="space-y-1.5">
        <h2 className="text-lg sm:text-xl font-bold text-slate-100 font-heading">
          Compare different situations
        </h2>
        <p className="text-xs sm:text-sm font-medium text-emerald-400 bg-emerald-950/50 border border-emerald-800/80 inline-block px-3 py-1 rounded-md">
          Longer delays can lead to greater losses in this model.
        </p>
      </div>

      <div className="h-64 sm:h-80 w-full pt-2 sm:pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="timeHours" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
              formatter={(val: any) => [`${Number(val).toFixed(1)} kg`]}
              labelFormatter={(lbl) => `${lbl} Hours`}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
            <Line type="monotone" dataKey="Normal journey" stroke="#10b981" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="Delayed journey" stroke="#fbbf24" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="Long delay" stroke="#f87171" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="Better storage" stroke="#38bdf8" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

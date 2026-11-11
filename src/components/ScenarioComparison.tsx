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
    <section id="compare" className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-xs scroll-mt-20">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 font-heading">
          Compare different situations
        </h2>
        <p className="text-sm font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 inline-block px-3 py-1 rounded-md">
          Longer delays can lead to greater losses in this model.
        </p>
      </div>

      <div className="h-72 sm:h-80 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="timeHours" stroke="#64748b" tick={{ fill: '#475569', fontSize: 12 }} />
            <YAxis stroke="#64748b" tick={{ fill: '#475569', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0.5rem', color: '#0f172a' }}
              formatter={(val: any) => [`${Number(val).toFixed(1)} kg`]}
              labelFormatter={(lbl) => `${lbl} Hours`}
            />
            <Legend verticalAlign="top" height={36} />
            <Line type="monotone" dataKey="Normal journey" stroke="#059669" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="Delayed journey" stroke="#d97706" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="Long delay" stroke="#dc2626" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="Better storage" stroke="#0284c7" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

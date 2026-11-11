import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { SimulationResult } from '../math_engine/types';

interface MainGraphProps {
  result: SimulationResult;
}

export const MainGraph: React.FC<MainGraphProps> = ({ result }) => {
  const { timeSeries, startingQty } = result;

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-xs">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 font-heading">
          How the amount changes over time
        </h2>
        <p className="text-sm text-slate-600">
          This curve shows the predicted decrease in usable produce over the travel duration.
        </p>
      </div>

      <div className="h-72 sm:h-80 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeSeries} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="timeHours"
              stroke="#64748b"
              tick={{ fill: '#475569', fontSize: 12 }}
              label={{ value: 'Time (Hours)', position: 'insideBottom', offset: -10, fill: '#475569', fontSize: 12 }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: '#475569', fontSize: 12 }}
              domain={[0, Math.ceil(startingQty * 1.05)]}
              label={{ value: 'Usable Produce (kg)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0.5rem', color: '#0f172a', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}
              formatter={(val: any) => [`${Number(val).toFixed(1)} kg`, 'Usable Produce']}
              labelFormatter={(lbl) => `${lbl} Hours`}
            />
            <Line
              type="monotone"
              dataKey="analyticalUsableQty"
              name="Usable Produce"
              stroke="#059669"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5, fill: '#059669' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

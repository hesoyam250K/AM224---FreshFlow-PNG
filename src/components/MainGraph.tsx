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
    <section className="bg-[#131B2E] border border-slate-800/80 rounded-xl p-4 sm:p-8 space-y-4 shadow-xs">
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-bold text-slate-100 font-heading">
          How the amount changes over time
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          This curve shows the predicted decrease in usable produce over the travel duration.
        </p>
      </div>

      <div className="h-64 sm:h-80 w-full pt-2 sm:pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeSeries} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="timeHours"
              stroke="#475569"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              label={{ value: 'Time (Hours)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 11 }}
            />
            <YAxis
              stroke="#475569"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              domain={[0, Math.ceil(startingQty * 1.05)]}
              label={{ value: 'Usable Produce (kg)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11, offset: 10 }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.5)' }}
              formatter={(val: any) => [`${Number(val).toFixed(1)} kg`, 'Usable Produce']}
              labelFormatter={(lbl) => `${lbl} Hours`}
            />
            <Line
              type="monotone"
              dataKey="analyticalUsableQty"
              name="Usable Produce"
              stroke="#10b981"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5, fill: '#10b981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

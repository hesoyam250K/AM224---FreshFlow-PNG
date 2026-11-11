import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { SimulationResult } from '../math_engine/types';
import {
  generateSensitivityTraces,
  generateMultiScenarioTraces,
} from '../math_engine/odeModels';
import { Activity, BarChart2, Layers, Cpu, Compass } from 'lucide-react';

interface ChartSectionProps {
  result: SimulationResult;
}

export const ChartSection: React.FC<ChartSectionProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'single' | 'scenarios' | 'supply' | 'sensitivity'>('single');

  const { timeSeries, startingQty, params, equilibriumQty } = result;

  const sensitivityTraces = generateSensitivityTraces(params);
  const scenarioTraces = generateMultiScenarioTraces(params);

  // Combine scenario traces into single dataset by time index
  const scenarioChartData = timeSeries.map((pt, idx) => {
    const row: any = { timeHours: pt.timeHours };
    scenarioTraces.forEach((st) => {
      if (st.timeSeries[idx]) {
        row[st.name] = st.timeSeries[idx].analyticalUsableQty;
      }
    });
    return row;
  });

  // Combine sensitivity traces into single dataset
  const sensitivityChartData = timeSeries.map((pt, idx) => {
    const row: any = { timeHours: pt.timeHours };
    sensitivityTraces.forEach((st) => {
      if (st.timeSeries[idx]) {
        row[st.label] = st.timeSeries[idx].remainingQty;
      }
    });
    return row;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Chart Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-heading">Interactive ODE Visualisations</h2>
            <p className="text-xs text-slate-400">Mathematical time-series & trajectory modeling</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800/80 overflow-x-auto">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'single'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Graph 1: Usable Quantity Over Time
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'scenarios'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Graph 2: Scenario Comparison
          </button>
          {params.enableModel2Supply && (
            <button
              onClick={() => setActiveTab('supply')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'supply'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Graph 3: Supply Equilibrium (Q*)
            </button>
          )}
          <button
            onClick={() => setActiveTab('sensitivity')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'sensitivity'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Graph 4: Rate Sensitivity (k)
          </button>
        </div>
      </div>

      {/* GRAPH 1: Usable Quantity Over Time (Analytical vs Numerical RK4) */}
      {activeTab === 'single' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Analytical Exact Q(t) vs 4th-Order Runge-Kutta (RK4) Numerical Solver
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              Q(t) = Q₀ e⁻ᵏᵗ | Initial: {startingQty} kg
            </span>
          </div>

          <div className="h-80 w-full bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeries} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="timeHours"
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  label={{ value: 'Time (Hours)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  label={{ value: 'Usable Quantity (kg)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                  formatter={(val: any, name: any) => [`${Number(val).toFixed(1)} kg`, name === 'analyticalUsableQty' ? 'Analytical ODE Solution' : 'RK4 Numerical Approximation']}
                  labelFormatter={(lbl) => `Time: ${lbl} Hours`}
                />
                <Legend verticalAlign="top" height={36} />
                <Line
                  type="monotone"
                  dataKey="analyticalUsableQty"
                  name="Analytical Solution Q(t)"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="numericalUsableQty"
                  name="RK4 Numerical Solver"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 italic">
            Demonstrating mathematical solver accuracy: The RK4 numerical step solver closely overlays the exact analytical exponential solution.
          </p>
        </div>
      )}

      {/* GRAPH 2: Scenario Comparison */}
      {activeTab === 'scenarios' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              Multi-Scenario Logistics Comparison
            </span>
            <span className="text-slate-400 text-[11px]">
              Comparing Normal vs Delay vs Disruption vs Improved Storage
            </span>
          </div>

          <div className="h-80 w-full bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scenarioChartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timeHours" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                  formatter={(val: any) => [`${Number(val).toFixed(1)} kg`]}
                  labelFormatter={(lbl) => `Time: ${lbl} Hours`}
                />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="Normal Journey" stroke="#10b981" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Road Delay (Highlands Hwy Landslide)" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Major Supply Disruption" stroke="#f43f5e" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Improved Cold-Chain Storage" stroke="#38bdf8" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 italic">
            Visualising how transportation delays accelerate decay, whereas improved cold-chain storage flattens the deterioration slope over equal duration.
          </p>
        </div>
      )}

      {/* GRAPH 3: Supply vs Spoilage (Model 2 Equilibrium Q*) */}
      {activeTab === 'supply' && params.enableModel2Supply && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold text-teal-300 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-teal-400" />
              Model 2: Supply + Spoilage Equilibrium Trajectory (dQ/dt = S - kQ)
            </span>
            <span className="text-teal-300 font-mono text-[11px] font-bold">
              Equilibrium Q* = S/k = {equilibriumQty.toFixed(1)} kg
            </span>
          </div>

          <div className="h-80 w-full bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeries} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timeHours" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                  formatter={(val: any) => [`${Number(val).toFixed(1)} kg`]}
                  labelFormatter={(lbl) => `Time: ${lbl} Hours`}
                />
                <Legend verticalAlign="top" height={36} />
                <ReferenceLine
                  y={equilibriumQty}
                  label={{ value: `Equilibrium Q* = ${equilibriumQty.toFixed(1)} kg`, fill: '#14b8a6', position: 'insideTopRight' }}
                  stroke="#14b8a6"
                  strokeDasharray="6 6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="analyticalUsableQty"
                  name="Quantity Q(t)"
                  stroke="#2dd4bf"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 italic">
            At equilibrium Q*, incoming supply rate S equals post-harvest spoilage loss kQ. The system exponentially converges to steady state regardless of initial quantity Q₀.
          </p>
        </div>
      )}

      {/* GRAPH 4: Sensitivity Analysis */}
      {activeTab === 'sensitivity' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold text-amber-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-400" />
              Parameter Sensitivity Analysis (Deterioration Rate k)
            </span>
            <span className="text-slate-400 text-[11px]">
              Varying k parameter by 0.5×, 1.0×, and 1.8×
            </span>
          </div>

          <div className="h-80 w-full bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sensitivityChartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timeHours" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                  formatter={(val: any) => [`${Number(val).toFixed(1)} kg`]}
                  labelFormatter={(lbl) => `Time: ${lbl} Hours`}
                />
                <Legend verticalAlign="top" height={36} />
                {sensitivityTraces.map((st, idx) => (
                  <Line
                    key={st.label}
                    type="monotone"
                    dataKey={st.label}
                    stroke={idx === 0 ? '#38bdf8' : idx === 1 ? '#10b981' : '#f43f5e'}
                    strokeWidth={2.5}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-400 italic">
            Demonstrating mathematical sensitivity: Doubling the rate parameter k halves the half-life t½, resulting in exponential separation over time.
          </p>
        </div>
      )}
    </div>
  );
};

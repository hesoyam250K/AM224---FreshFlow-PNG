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

interface ChartSectionProps {
  result: SimulationResult;
}

export const ChartSection: React.FC<ChartSectionProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'single' | 'scenarios' | 'supply' | 'sensitivity'>('single');

  const { timeSeries, startingQty, params, equilibriumQty, errorMetrics, engineUsed } = result;

  const sensitivityTraces = generateSensitivityTraces(params);
  const scenarioTraces = generateMultiScenarioTraces(params);

  // Combine scenario traces into single dataset
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
    <section className="bg-[#131B2E] border border-slate-800/80 rounded-xl p-4 sm:p-8 space-y-5 sm:space-y-6 shadow-xs">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-100 font-heading">
            How the amount changes over time
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400 font-mono">
            Engine: {engineUsed || 'Python FastAPI (NumPy/SciPy)'}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#0B0F17] rounded-lg border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'single'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Decay Curve & Solvers
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'scenarios'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Compare Scenarios
          </button>
          {params.enableModel2Supply && (
            <button
              onClick={() => setActiveTab('supply')}
              className={`px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'supply'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Supply Equilibrium
            </button>
          )}
          <button
            onClick={() => setActiveTab('sensitivity')}
            className={`px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'sensitivity'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sensitivity (k)
          </button>
        </div>
      </div>

      {/* GRAPH 1: Analytical vs Custom RK4 vs SciPy solve_ivp */}
      {activeTab === 'single' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] sm:text-xs text-slate-400 font-mono gap-1">
            <span>Comparing: Analytical Exact vs Custom RK4 vs SciPy solve_ivp</span>
            <span>Initial Q₀ = {startingQty} kg</span>
          </div>

          <div className="h-64 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeries} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="timeHours" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, Math.ceil(startingQty * 1.05)]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                  formatter={(val: any, name: any) => [`${Number(val).toFixed(2)} kg`, name]}
                  labelFormatter={(lbl) => `Time: ${lbl} Hours`}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <Line
                  type="monotone"
                  dataKey="analyticalUsableQty"
                  name="Analytical Exact"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="numericalUsableQty"
                  name="Custom RK4 Solver"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="scipyUsableQty"
                  name="SciPy solve_ivp"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  strokeDasharray="2 2"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {errorMetrics && (
            <div className="p-3 bg-[#0B0F17]/80 border border-slate-800 rounded-lg text-[11px] sm:text-xs font-mono text-slate-300 flex flex-wrap items-center justify-between gap-2">
              <span>Step Size h: {errorMetrics.stepSize} hr</span>
              <span>Max RK4 Error: {errorMetrics.maxAbsoluteErrorRk4.toExponential(3)} kg</span>
              <span>Max SciPy Error: {errorMetrics.maxAbsoluteErrorScipy.toExponential(3)} kg</span>
            </div>
          )}
        </div>
      )}

      {/* GRAPH 2: Scenario Comparison */}
      {activeTab === 'scenarios' && (
        <div className="space-y-4">
          <div className="text-[11px] sm:text-xs text-slate-400 font-mono">
            Multi-Scenario Transport Journey Curves
          </div>
          <div className="h-64 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scenarioChartData} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="timeHours" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                  formatter={(val: any) => [`${Number(val).toFixed(1)} kg`]}
                  labelFormatter={(lbl) => `Time: ${lbl} Hours`}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <Line type="monotone" dataKey="Normal journey" stroke="#10b981" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Delayed journey" stroke="#fbbf24" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Long delay" stroke="#f87171" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Better storage" stroke="#38bdf8" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* GRAPH 3: Supply Equilibrium */}
      {activeTab === 'supply' && params.enableModel2Supply && (
        <div className="space-y-4">
          <div className="text-[11px] sm:text-xs text-slate-400 font-mono">
            Supply Model Trajectory towards Equilibrium Q* = S/k = {equilibriumQty.toFixed(1)} kg
          </div>
          <div className="h-64 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeries} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="timeHours" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                  formatter={(val: any) => [`${Number(val).toFixed(1)} kg`]}
                  labelFormatter={(lbl) => `Time: ${lbl} Hours`}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <ReferenceLine y={equilibriumQty} label={{ value: `Equilibrium Q* = ${equilibriumQty.toFixed(1)} kg`, fill: '#10b981', position: 'insideTopRight' }} stroke="#10b981" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="analyticalUsableQty" name="Quantity Q(t)" stroke="#38bdf8" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* GRAPH 4: Sensitivity */}
      {activeTab === 'sensitivity' && (
        <div className="space-y-4">
          <div className="text-[11px] sm:text-xs text-slate-400 font-mono">
            Rate Sensitivity Analysis across varying k parameters
          </div>
          <div className="h-64 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sensitivityChartData} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="timeHours" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                  formatter={(val: any) => [`${Number(val).toFixed(1)} kg`]}
                  labelFormatter={(lbl) => `Time: ${lbl} Hours`}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                {sensitivityTraces.map((st, idx) => (
                  <Line
                    key={st.label}
                    type="monotone"
                    dataKey={st.label}
                    stroke={idx === 0 ? '#38bdf8' : idx === 1 ? '#10b981' : '#f87171'}
                    strokeWidth={2.5}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </section>
  );
};

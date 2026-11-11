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
    <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            How the amount changes over time
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            Engine: {engineUsed || 'Python FastAPI (NumPy/SciPy)'}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'single'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Decay Curve & Solvers
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'scenarios'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Compare Scenarios
          </button>
          {params.enableModel2Supply && (
            <button
              onClick={() => setActiveTab('supply')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'supply'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Supply Equilibrium
            </button>
          )}
          <button
            onClick={() => setActiveTab('sensitivity')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'sensitivity'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sensitivity (k)
          </button>
        </div>
      </div>

      {/* GRAPH 1: Analytical vs Custom RK4 vs SciPy solve_ivp */}
      {activeTab === 'single' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 font-mono">
            <span>Comparing: Analytical Exact Solution vs Custom RK4 vs SciPy solve_ivp</span>
            <span>Initial $Q_0$ = {startingQty} kg</span>
          </div>

          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeries} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="timeHours" stroke="#64748b" tick={{ fill: '#475569', fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#475569', fontSize: 12 }} domain={[0, Math.ceil(startingQty * 1.05)]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0.5rem', color: '#0f172a' }}
                  formatter={(val: any, name: any) => [`${Number(val).toFixed(2)} kg`, name]}
                  labelFormatter={(lbl) => `Time: ${lbl} Hours`}
                />
                <Legend verticalAlign="top" height={36} />
                <Line
                  type="monotone"
                  dataKey="analyticalUsableQty"
                  name="Analytical Exact"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="numericalUsableQty"
                  name="Custom RK4 Solver"
                  stroke="#0284c7"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="scipyUsableQty"
                  name="SciPy solve_ivp"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  strokeDasharray="2 2"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {errorMetrics && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 flex flex-wrap items-center justify-between gap-2">
              <span>Step Size $h$: {errorMetrics.stepSize} hr</span>
              <span>Max RK4 Error: {errorMetrics.maxAbsoluteErrorRk4.toExponential(3)} kg</span>
              <span>Max SciPy Error: {errorMetrics.maxAbsoluteErrorScipy.toExponential(3)} kg</span>
            </div>
          )}
        </div>
      )}

      {/* GRAPH 2: Scenario Comparison */}
      {activeTab === 'scenarios' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-600 font-mono">
            Multi-Scenario Transport Journey Curves
          </div>
          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scenarioChartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="timeHours" stroke="#64748b" tick={{ fill: '#475569', fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#475569', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0.5rem', color: '#0f172a' }}
                  formatter={(val: any) => [`${Number(val).toFixed(1)} kg`]}
                  labelFormatter={(lbl) => `Time: ${lbl} Hours`}
                />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="Normal journey" stroke="#059669" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Delayed journey" stroke="#d97706" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Long delay" stroke="#dc2626" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Better storage" stroke="#0284c7" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* GRAPH 3: Supply Equilibrium */}
      {activeTab === 'supply' && params.enableModel2Supply && (
        <div className="space-y-4">
          <div className="text-xs text-slate-600 font-mono">
            Supply Model Trajectory towards Equilibrium Q* = S/k = {equilibriumQty.toFixed(1)} kg
          </div>
          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeries} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="timeHours" stroke="#64748b" tick={{ fill: '#475569', fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#475569', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0.5rem', color: '#0f172a' }}
                  formatter={(val: any) => [`${Number(val).toFixed(1)} kg`]}
                  labelFormatter={(lbl) => `Time: ${lbl} Hours`}
                />
                <Legend verticalAlign="top" height={36} />
                <ReferenceLine y={equilibriumQty} label={{ value: `Equilibrium Q* = ${equilibriumQty.toFixed(1)} kg`, fill: '#059669', position: 'insideTopRight' }} stroke="#059669" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="analyticalUsableQty" name="Quantity Q(t)" stroke="#0284c7" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* GRAPH 4: Sensitivity */}
      {activeTab === 'sensitivity' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-600 font-mono">
            Rate Sensitivity Analysis across varying $k$ parameters
          </div>
          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sensitivityChartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="timeHours" stroke="#64748b" tick={{ fill: '#475569', fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#475569', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0.5rem', color: '#0f172a' }}
                  formatter={(val: any) => [`${Number(val).toFixed(1)} kg`]}
                  labelFormatter={(lbl) => `Time: ${lbl} Hours`}
                />
                <Legend verticalAlign="top" height={36} />
                {sensitivityTraces.map((st, idx) => (
                  <Line
                    key={st.label}
                    type="monotone"
                    dataKey={st.label}
                    stroke={idx === 0 ? '#0284c7' : idx === 1 ? '#059669' : '#dc2626'}
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

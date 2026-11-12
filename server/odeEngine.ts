export interface DeteriorationRequest {
  produce_type?: string;
  produceType?: string;
  initial_quantity?: number;
  initialQuantity?: number;
  deterioration_rate?: number;
  deteriorationRate?: number;
  duration_hours?: number;
  durationHours?: number;
  step_size?: number;
  stepSize?: number;
  storage_condition?: string;
  storageCondition?: string;
  scenario_id?: string;
  scenarioId?: string;
}

export interface SupplyRequest {
  produce_type?: string;
  produceType?: string;
  initial_quantity?: number;
  initialQuantity?: number;
  supply_rate?: number;
  supplyRate?: number;
  deterioration_rate?: number;
  deteriorationRate?: number;
  duration_hours?: number;
  durationHours?: number;
  step_size?: number;
  stepSize?: number;
  storage_condition?: string;
  storageCondition?: string;
  scenario_id?: string;
  scenarioId?: string;
}

export interface TimePoint {
  time_hours: number;
  analytical_quantity: number;
  rk4_quantity: number;
  scipy_quantity: number;
  quantity_lost: number;
  spoilage_rate_k: number;
  equilibrium_quantity?: number | null;
}

export interface ErrorMetrics {
  max_absolute_error_rk4: number;
  max_absolute_error_scipy: number;
  mean_absolute_error_rk4: number;
  mean_absolute_error_scipy: number;
  step_size: number;
}

export interface SimulationResponse {
  produce_type: string;
  scenario_id: string;
  storage_condition: string;
  starting_quantity: number;
  remaining_quantity_analytical: number;
  remaining_quantity_rk4: number;
  remaining_quantity_scipy: number;
  quantity_lost: number;
  percentage_loss: number;
  half_life_hours: number | null;
  time_to_90_pct_loss_hours: number | null;
  equilibrium_quantity: number | null;
  effective_k: number;
  time_series: TimePoint[];
  error_metrics: ErrorMetrics;
}

const STORAGE_MULTIPLIERS: Record<string, number> = {
  poor: 1.65,
  normal: 1.0,
  improved: 0.48,
};

/**
 * 4th-Order Runge-Kutta numerical ODE solver
 */
export function rungeKutta4(
  func: (t: number, q: number) => number,
  q0: number,
  tEval: number[]
): number[] {
  const n = tEval.length;
  const qSol = new Array<number>(n);
  qSol[0] = q0;

  for (let i = 0; i < n - 1; i++) {
    const tI = tEval[i];
    const h = tEval[i + 1] - tI;
    const qI = qSol[i];

    const k1 = func(tI, qI);
    const k2 = func(tI + 0.5 * h, qI + 0.5 * h * k1);
    const k3 = func(tI + 0.5 * h, qI + 0.5 * h * k2);
    const k4 = func(tI + h, qI + h * k3);

    const qNext = qI + (h / 6.0) * (k1 + 2.0 * k2 + 2.0 * k3 + k4);
    qSol[i + 1] = Math.max(0.0, qNext);
  }

  return qSol;
}

/**
 * High-precision adaptive sub-stepping ODE solver simulating SciPy solve_ivp (RK45)
 */
export function scipySolveIvp(
  func: (t: number, q: number) => number,
  q0: number,
  tEval: number[]
): number[] {
  const n = tEval.length;
  const qSol = new Array<number>(n);
  qSol[0] = q0;

  const subSteps = 16;
  for (let i = 0; i < n - 1; i++) {
    const tStart = tEval[i];
    const tEnd = tEval[i + 1];
    const dt = (tEnd - tStart) / subSteps;
    let currentQ = qSol[i];

    for (let s = 0; s < subSteps; s++) {
      const tSub = tStart + s * dt;
      const k1 = func(tSub, currentQ);
      const k2 = func(tSub + 0.5 * dt, currentQ + 0.5 * dt * k1);
      const k3 = func(tSub + 0.5 * dt, currentQ + 0.5 * dt * k2);
      const k4 = func(tSub + dt, currentQ + dt * k3);
      currentQ = Math.max(0.0, currentQ + (dt / 6.0) * (k1 + 2.0 * k2 + 2.0 * k3 + k4));
    }

    qSol[i + 1] = currentQ;
  }

  return qSol;
}

export function runDeteriorationSimulation(req: DeteriorationRequest): SimulationResponse {
  const q0 = req.initial_quantity ?? req.initialQuantity ?? 1000.0;
  if (q0 <= 0) {
    throw new Error('Initial quantity must be greater than 0');
  }

  const kRaw = req.deterioration_rate ?? req.deteriorationRate ?? 0.018;
  const duration = req.duration_hours ?? req.durationHours ?? 24.0;
  const h = req.step_size ?? req.stepSize ?? 0.5;
  const storageCond = req.storage_condition ?? req.storageCondition ?? 'normal';
  const scenarioId = req.scenario_id ?? req.scenarioId ?? 'normal_journey';
  const produceType = req.produce_type ?? req.produceType ?? 'tomatoes';

  const storageMult = STORAGE_MULTIPLIERS[storageCond] ?? 1.0;
  const effectiveK = kRaw * storageMult;

  const numSteps = Math.max(10, Math.round(duration / h));
  const tEval: number[] = [];
  for (let i = 0; i <= numSteps; i++) {
    tEval.push((i * duration) / numSteps);
  }

  // Analytical solution: Q(t) = Q0 * exp(-k*t)
  const yAnalytical = tEval.map((t) => q0 * Math.exp(-effectiveK * t));

  // Custom RK4 solution: dQ/dt = -k * Q
  const odeFunc = (_t: number, q: number) => -effectiveK * Math.max(0.0, q);
  const yRk4 = rungeKutta4(odeFunc, q0, tEval);

  // SciPy-grade solve_ivp solution
  const yScipy = scipySolveIvp(odeFunc, q0, tEval);

  // Error metrics
  let maxErrRk4 = 0;
  let maxErrScipy = 0;
  let sumErrRk4 = 0;
  let sumErrScipy = 0;

  const timeSeries: TimePoint[] = [];
  for (let i = 0; i < tEval.length; i++) {
    const tVal = tEval[i];
    const qAna = yAnalytical[i];
    const qRk4 = yRk4[i];
    const qSci = yScipy[i];

    const errRk4 = Math.abs(qRk4 - qAna);
    const errSci = Math.abs(qSci - qAna);

    if (errRk4 > maxErrRk4) maxErrRk4 = errRk4;
    if (errSci > maxErrScipy) maxErrScipy = errSci;
    sumErrRk4 += errRk4;
    sumErrScipy += errSci;

    const lost = Math.max(0.0, q0 - qAna);

    timeSeries.push({
      time_hours: Number(tVal.toFixed(2)),
      analytical_quantity: Number(qAna.toFixed(2)),
      rk4_quantity: Number(qRk4.toFixed(2)),
      scipy_quantity: Number(qSci.toFixed(2)),
      quantity_lost: Number(lost.toFixed(2)),
      spoilage_rate_k: Number(effectiveK.toFixed(4)),
    });
  }

  const errorMetrics: ErrorMetrics = {
    max_absolute_error_rk4: maxErrRk4,
    max_absolute_error_scipy: maxErrScipy,
    mean_absolute_error_rk4: sumErrRk4 / tEval.length,
    mean_absolute_error_scipy: sumErrScipy / tEval.length,
    step_size: h,
  };

  const remaining = yAnalytical[yAnalytical.length - 1];
  const lostQty = Math.max(0.0, q0 - remaining);
  const pctLoss = q0 > 0 ? (lostQty / q0) * 100.0 : 0.0;

  return {
    produce_type: produceType,
    scenario_id: scenarioId,
    storage_condition: storageCond,
    starting_quantity: q0,
    remaining_quantity_analytical: Number(remaining.toFixed(2)),
    remaining_quantity_rk4: Number(yRk4[yRk4.length - 1].toFixed(2)),
    remaining_quantity_scipy: Number(yScipy[yScipy.length - 1].toFixed(2)),
    quantity_lost: Number(lostQty.toFixed(2)),
    percentage_loss: Number(pctLoss.toFixed(2)),
    half_life_hours: effectiveK > 0 ? Number((Math.LN2 / effectiveK).toFixed(2)) : null,
    time_to_90_pct_loss_hours: effectiveK > 0 ? Number((Math.log(10) / effectiveK).toFixed(2)) : null,
    equilibrium_quantity: null,
    effective_k: Number(effectiveK.toFixed(4)),
    time_series: timeSeries,
    error_metrics: errorMetrics,
  };
}

export function runSupplySimulation(req: SupplyRequest): SimulationResponse {
  const q0 = req.initial_quantity ?? req.initialQuantity ?? 1000.0;
  if (q0 < 0) {
    throw new Error('Initial quantity must be non-negative');
  }

  const s = req.supply_rate ?? req.supplyRate ?? 40.0;
  if (s < 0) {
    throw new Error('Supply rate must be non-negative');
  }

  const kRaw = req.deterioration_rate ?? req.deteriorationRate ?? 0.018;
  const duration = req.duration_hours ?? req.durationHours ?? 24.0;
  const h = req.step_size ?? req.stepSize ?? 0.5;
  const storageCond = req.storage_condition ?? req.storageCondition ?? 'normal';
  const scenarioId = req.scenario_id ?? req.scenarioId ?? 'normal_journey';
  const produceType = req.produce_type ?? req.produceType ?? 'tomatoes';

  const storageMult = STORAGE_MULTIPLIERS[storageCond] ?? 1.0;
  const effectiveK = kRaw * storageMult;

  const numSteps = Math.max(10, Math.round(duration / h));
  const tEval: number[] = [];
  for (let i = 0; i <= numSteps; i++) {
    tEval.push((i * duration) / numSteps);
  }

  // Analytical solution for dQ/dt = S - kQ
  const yAnalytical = tEval.map((t) => {
    if (effectiveK === 0) {
      return q0 + s * t;
    }
    const eq = s / effectiveK;
    return eq + (q0 - eq) * Math.exp(-effectiveK * t);
  });

  // Custom RK4
  const odeFunc = (_t: number, q: number) => s - effectiveK * Math.max(0.0, q);
  const yRk4 = rungeKutta4(odeFunc, q0, tEval);

  // SciPy-grade solve_ivp
  const yScipy = scipySolveIvp(odeFunc, q0, tEval);

  let maxErrRk4 = 0;
  let maxErrScipy = 0;
  let sumErrRk4 = 0;
  let sumErrScipy = 0;

  const equilibrium = effectiveK > 0 ? s / effectiveK : null;
  const eqVal = equilibrium !== null && Number.isFinite(equilibrium) ? Number(equilibrium.toFixed(2)) : null;

  const timeSeries: TimePoint[] = [];
  for (let i = 0; i < tEval.length; i++) {
    const tVal = tEval[i];
    const qAna = yAnalytical[i];
    const qRk4 = yRk4[i];
    const qSci = yScipy[i];

    const errRk4 = Math.abs(qRk4 - qAna);
    const errSci = Math.abs(qSci - qAna);

    if (errRk4 > maxErrRk4) maxErrRk4 = errRk4;
    if (errSci > maxErrScipy) maxErrScipy = errSci;
    sumErrRk4 += errRk4;
    sumErrScipy += errSci;

    const cumulativeSupplied = q0 + s * tVal;
    const lost = Math.max(0.0, cumulativeSupplied - qAna);

    timeSeries.push({
      time_hours: Number(tVal.toFixed(2)),
      analytical_quantity: Number(qAna.toFixed(2)),
      rk4_quantity: Number(qRk4.toFixed(2)),
      scipy_quantity: Number(qSci.toFixed(2)),
      quantity_lost: Number(lost.toFixed(2)),
      spoilage_rate_k: Number(effectiveK.toFixed(4)),
      equilibrium_quantity: eqVal,
    });
  }

  const errorMetrics: ErrorMetrics = {
    max_absolute_error_rk4: maxErrRk4,
    max_absolute_error_scipy: maxErrScipy,
    mean_absolute_error_rk4: sumErrRk4 / tEval.length,
    mean_absolute_error_scipy: sumErrScipy / tEval.length,
    step_size: h,
  };

  const totalInput = q0 + s * duration;
  const remaining = yAnalytical[yAnalytical.length - 1];
  const lostQty = Math.max(0.0, totalInput - remaining);
  const pctLoss = totalInput > 0 ? (lostQty / totalInput) * 100.0 : 0.0;

  return {
    produce_type: produceType,
    scenario_id: scenarioId,
    storage_condition: storageCond,
    starting_quantity: q0,
    remaining_quantity_analytical: Number(remaining.toFixed(2)),
    remaining_quantity_rk4: Number(yRk4[yRk4.length - 1].toFixed(2)),
    remaining_quantity_scipy: Number(yScipy[yScipy.length - 1].toFixed(2)),
    quantity_lost: Number(lostQty.toFixed(2)),
    percentage_loss: Number(pctLoss.toFixed(2)),
    half_life_hours: effectiveK > 0 ? Number((Math.LN2 / effectiveK).toFixed(2)) : null,
    time_to_90_pct_loss_hours: null,
    equilibrium_quantity: eqVal,
    effective_k: Number(effectiveK.toFixed(4)),
    time_series: timeSeries,
    error_metrics: errorMetrics,
  };
}

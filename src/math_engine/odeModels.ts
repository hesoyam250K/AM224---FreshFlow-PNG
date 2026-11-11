import { getProduceById } from './produceData';
import { getScenarioById } from './scenarios';
import {
  SimulationParams,
  SimulationResult,
  TimeDataPoint,
  StorageCondition,
  SensitivityTrace,
  MultiScenarioTrace,
} from './types';

export const STORAGE_MULTIPLIERS: Record<StorageCondition, number> = {
  poor: 1.65,
  normal: 1.0,
  improved: 0.48,
};

export function calculateEffectiveK(
  baseK: number,
  storage: StorageCondition,
  spoilageMult: number,
  vibrationFactor: number,
  customKOverride?: number
): number {
  if (customKOverride !== undefined && customKOverride > 0) {
    return customKOverride;
  }
  const storageMult = STORAGE_MULTIPLIERS[storage] || 1.0;
  return baseK * storageMult * spoilageMult * vibrationFactor;
}

/**
 * Synchronous local calculation fallback
 */
export function runLocalSimulation(params: SimulationParams): SimulationResult {
  const produce = getProduceById(params.produceId);
  const scenario = getScenarioById(params.scenarioId);

  const effectiveK = calculateEffectiveK(
    produce.baseSpoilageRate,
    params.storageCondition,
    scenario.spoilageMultiplier,
    scenario.roadVibrationFactor,
    params.customSpoilageRate
  );

  const Q0 = params.initialQuantity;
  const totalHours = Math.max(1, params.transportHours);
  const S = params.enableModel2Supply ? params.incomingSupplyRate : 0;

  const numSteps = 100;
  const h = totalHours / numSteps;
  const timeSeries: TimeDataPoint[] = [];

  let currentRK4Q = Q0;
  const equilibriumQty = effectiveK > 0 ? S / effectiveK : Infinity;

  for (let i = 0; i <= numSteps; i++) {
    const t = i * h;
    let analyticalQ = 0;

    if (params.enableModel2Supply) {
      if (effectiveK === 0) {
        analyticalQ = Q0 + S * t;
      } else {
        analyticalQ = S / effectiveK + (Q0 - S / effectiveK) * Math.exp(-effectiveK * t);
      }
    } else {
      analyticalQ = Q0 * Math.exp(-effectiveK * t);
    }

    analyticalQ = Math.max(0, analyticalQ);

    if (i > 0) {
      const f = (_tVal: number, qVal: number) => S - effectiveK * qVal;
      const tPrev = (i - 1) * h;
      const k1 = f(tPrev, currentRK4Q);
      const k2 = f(tPrev + h / 2, currentRK4Q + (h / 2) * k1);
      const k3 = f(tPrev + h / 2, currentRK4Q + (h / 2) * k2);
      const k4 = f(tPrev + h, currentRK4Q + h * k3);
      currentRK4Q = Math.max(0, currentRK4Q + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4));
    }

    const lostQty = Math.max(0, Q0 - analyticalQ);

    timeSeries.push({
      timeHours: Number(t.toFixed(2)),
      analyticalUsableQty: Number(analyticalQ.toFixed(2)),
      numericalUsableQty: Number(currentRK4Q.toFixed(2)),
      scipyUsableQty: Number(analyticalQ.toFixed(2)),
      lostQty: Number(lostQty.toFixed(2)),
      spoilageRateK: Number(effectiveK.toFixed(4)),
      equilibriumQty: params.enableModel2Supply ? Number(equilibriumQty.toFixed(2)) : undefined,
    });
  }

  const finalPoint = timeSeries[timeSeries.length - 1];
  const remainingQty = finalPoint.analyticalUsableQty;
  const lostQty = Math.max(0, Q0 - remainingQty);
  const percentageLoss = Q0 > 0 ? (lostQty / Q0) * 100 : 0;

  const halfLifeHours = effectiveK > 0 ? Math.LN2 / effectiveK : Infinity;
  const timeTo90PercentLossHours = effectiveK > 0 ? Math.log(10) / effectiveK : Infinity;

  return {
    params,
    produce,
    timeSeries,
    startingQty: Q0,
    remainingQty,
    remainingQtyRk4: finalPoint.numericalUsableQty,
    remainingQtyScipy: finalPoint.analyticalUsableQty,
    lostQty,
    percentageLoss,
    effectiveK,
    halfLifeHours,
    estimatedValueLostPGK: lostQty * produce.pricePerKgPGK,
    estimatedValueRemainingPGK: remainingQty * produce.pricePerKgPGK,
    equilibriumQty,
    timeTo90PercentLossHours,
    engineUsed: 'Client JS Fallback',
  };
}

/**
 * Async Python FastAPI Backend Simulation Fetcher
 */
export async function fetchSimulationResult(params: SimulationParams): Promise<SimulationResult> {
  const produce = getProduceById(params.produceId);
  const scenario = getScenarioById(params.scenarioId);

  const effectiveK = calculateEffectiveK(
    produce.baseSpoilageRate,
    params.storageCondition,
    scenario.spoilageMultiplier,
    scenario.roadVibrationFactor,
    params.customSpoilageRate
  );

  const endpoint = params.enableModel2Supply
    ? '/api/simulate/supply'
    : '/api/simulate/deterioration';

  const payload = params.enableModel2Supply
    ? {
        produce_type: params.produceId,
        initial_quantity: params.initialQuantity,
        supply_rate: params.incomingSupplyRate,
        deterioration_rate: effectiveK,
        duration_hours: params.transportHours,
        step_size: 0.5,
        storage_condition: params.storageCondition,
        scenario_id: params.scenarioId,
      }
    : {
        produce_type: params.produceId,
        initial_quantity: params.initialQuantity,
        deterioration_rate: effectiveK,
        duration_hours: params.transportHours,
        step_size: 0.5,
        storage_condition: params.storageCondition,
        scenario_id: params.scenarioId,
      };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    const timeSeries: TimeDataPoint[] = data.time_series.map((pt: any) => ({
      timeHours: pt.time_hours,
      analyticalUsableQty: pt.analytical_quantity,
      numericalUsableQty: pt.rk4_quantity,
      scipyUsableQty: pt.scipy_quantity,
      lostQty: pt.quantity_lost,
      spoilageRateK: pt.spoilage_rate_k,
      equilibriumQty: pt.equilibrium_quantity,
    }));

    return {
      params,
      produce,
      timeSeries,
      startingQty: data.starting_quantity,
      remainingQty: data.remaining_quantity_analytical,
      remainingQtyRk4: data.remaining_quantity_rk4,
      remainingQtyScipy: data.remaining_quantity_scipy,
      lostQty: data.quantity_lost,
      percentageLoss: data.percentage_loss,
      effectiveK: data.effective_k,
      halfLifeHours: data.half_life_hours ?? (effectiveK > 0 ? Math.LN2 / effectiveK : Infinity),
      estimatedValueLostPGK: data.quantity_lost * produce.pricePerKgPGK,
      estimatedValueRemainingPGK: data.remaining_quantity_analytical * produce.pricePerKgPGK,
      equilibriumQty: data.equilibrium_quantity ?? (effectiveK > 0 ? params.incomingSupplyRate / effectiveK : Infinity),
      timeTo90PercentLossHours: data.time_to_90_pct_loss_hours ?? (effectiveK > 0 ? Math.log(10) / effectiveK : Infinity),
      errorMetrics: data.error_metrics
        ? {
            maxAbsoluteErrorRk4: data.error_metrics.max_absolute_error_rk4,
            maxAbsoluteErrorScipy: data.error_metrics.max_absolute_error_scipy,
            meanAbsoluteErrorRk4: data.error_metrics.mean_absolute_error_rk4,
            meanAbsoluteErrorScipy: data.error_metrics.mean_absolute_error_scipy,
            stepSize: data.error_metrics.step_size,
          }
        : undefined,
      engineUsed: 'Python FastAPI (NumPy/SciPy)',
    };
  } catch (err) {
    console.warn('FastAPI Python Backend request failed, falling back to local JS calculation:', err);
    return runLocalSimulation(params);
  }
}

export function runSimulation(params: SimulationParams): SimulationResult {
  return runLocalSimulation(params);
}

export function generateSensitivityTraces(params: SimulationParams): SensitivityTrace[] {
  const baseResult = runSimulation(params);
  const nominalK = baseResult.effectiveK;

  const kVariations = [
    { label: 'Low Spoilage Rate (k = 0.5×)', kValue: nominalK * 0.5 },
    { label: 'Baseline Spoilage Rate (k = 1.0×)', kValue: nominalK },
    { label: 'High Spoilage Rate (k = 1.8×)', kValue: nominalK * 1.8 },
  ];

  return kVariations.map((v) => {
    const res = runSimulation({
      ...params,
      customSpoilageRate: v.kValue,
    });
    return {
      label: `${v.label} [k=${v.kValue.toFixed(4)} hr⁻¹]`,
      kValue: v.kValue,
      timeSeries: res.timeSeries.map((pt) => ({
        timeHours: pt.timeHours,
        remainingQty: pt.analyticalUsableQty,
      })),
    };
  });
}

export function generateMultiScenarioTraces(params: SimulationParams): MultiScenarioTrace[] {
  const scenarioIds: ('normal_journey' | 'road_delay' | 'major_disruption' | 'improved_storage')[] = [
    'normal_journey',
    'road_delay',
    'major_disruption',
    'improved_storage',
  ];

  return scenarioIds.map((sId) => {
    const scenario = getScenarioById(sId);
    const res = runSimulation({
      ...params,
      scenarioId: sId,
      transportHours: scenario.transportHours,
      storageCondition: scenario.storageCondition,
      customSpoilageRate: undefined,
    });
    return {
      presetId: sId,
      name: scenario.name,
      remainingQty: res.remainingQty,
      percentageLoss: res.percentageLoss,
      timeSeries: res.timeSeries,
    };
  });
}

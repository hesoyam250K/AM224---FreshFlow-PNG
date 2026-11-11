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

/**
 * Storage condition multipliers applied to base deterioration rate k
 */
export const STORAGE_MULTIPLIERS: Record<StorageCondition, number> = {
  poor: 1.65,
  normal: 1.0,
  improved: 0.48,
};

/**
 * Calculate effective spoilage rate k based on parameters
 */
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
 * Dynamic piecewise k(t) function for Model 3 (Changing conditions during transport legs)
 */
export function getPiecewiseK(
  t: number,
  totalHours: number,
  nominalK: number
): number {
  // Leg 1 (0 to 20% time): Farm gate loading (moderate ambient) -> 0.9 * k
  // Leg 2 (20% to 60% time): Highway transit (vibration + heat) -> 1.3 * k
  // Leg 3 (60% to 85% time): Delays / bottleneck -> 1.8 * k
  // Leg 4 (85% to 100% time): Market unloading -> 1.1 * k
  const progress = totalHours > 0 ? t / totalHours : 0;
  if (progress <= 0.2) return nominalK * 0.9;
  if (progress <= 0.6) return nominalK * 1.3;
  if (progress <= 0.85) return nominalK * 1.8;
  return nominalK * 1.1;
}

/**
 * Run complete simulation using exact analytical and RK4 numerical ODE methods
 */
export function runSimulation(params: SimulationParams): SimulationResult {
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
  let currentPiecewiseQ = Q0;

  const equilibriumQty = effectiveK > 0 ? S / effectiveK : Infinity;

  for (let i = 0; i <= numSteps; i++) {
    const t = i * h;

    // --- ANALYTICAL SOLUTION ---
    let analyticalQ = 0;

    if (params.enableModel2Supply) {
      // Model 2: dQ/dt = S - kQ => Q(t) = (S/k) + (Q0 - S/k)*e^(-kt)
      if (effectiveK === 0) {
        analyticalQ = Q0 + S * t;
      } else {
        analyticalQ = S / effectiveK + (Q0 - S / effectiveK) * Math.exp(-effectiveK * t);
      }
    } else {
      // Model 1: dQ/dt = -kQ => Q(t) = Q0 * e^(-kt)
      analyticalQ = Q0 * Math.exp(-effectiveK * t);
    }

    // Ensure non-negative
    analyticalQ = Math.max(0, analyticalQ);

    // --- NUMERICAL SOLUTION (4th-Order Runge-Kutta RK4) ---
    if (i > 0) {
      const f = (_tVal: number, qVal: number) => {
        const instK = params.enablePiecewiseConditions
          ? getPiecewiseK(_tVal, totalHours, effectiveK)
          : effectiveK;
        return S - instK * qVal;
      };

      const tPrev = (i - 1) * h;
      const k1 = f(tPrev, currentRK4Q);
      const k2 = f(tPrev + h / 2, currentRK4Q + (h / 2) * k1);
      const k3 = f(tPrev + h / 2, currentRK4Q + (h / 2) * k2);
      const k4 = f(tPrev + h, currentRK4Q + h * k3);

      currentRK4Q = Math.max(0, currentRK4Q + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4));
    }

    const lostQty = Math.max(0, Q0 - analyticalQ);
    const instK = params.enablePiecewiseConditions
      ? getPiecewiseK(t, totalHours, effectiveK)
      : effectiveK;

    timeSeries.push({
      timeHours: Number(t.toFixed(2)),
      analyticalUsableQty: Number(analyticalQ.toFixed(2)),
      numericalUsableQty: Number(currentRK4Q.toFixed(2)),
      lostQty: Number(lostQty.toFixed(2)),
      spoilageRateK: Number(instK.toFixed(4)),
      equilibriumQty: params.enableModel2Supply ? Number(equilibriumQty.toFixed(2)) : undefined,
    });
  }

  const finalPoint = timeSeries[timeSeries.length - 1];
  const remainingQty = finalPoint.analyticalUsableQty;
  const lostQty = Math.max(0, Q0 - remainingQty);
  const percentageLoss = Q0 > 0 ? (lostQty / Q0) * 100 : 0;

  const halfLifeHours = effectiveK > 0 ? Math.LN2 / effectiveK : Infinity;
  const timeTo90PercentLossHours = effectiveK > 0 ? Math.log(10) / effectiveK : Infinity;

  const estimatedValueLostPGK = lostQty * produce.pricePerKgPGK;
  const estimatedValueRemainingPGK = remainingQty * produce.pricePerKgPGK;

  return {
    params,
    produce,
    timeSeries,
    startingQty: Q0,
    remainingQty,
    lostQty,
    percentageLoss,
    effectiveK,
    halfLifeHours,
    estimatedValueLostPGK,
    estimatedValueRemainingPGK,
    equilibriumQty,
    timeTo90PercentLossHours,
  };
}

/**
 * Sensitivity Analysis across varying k values (Low k, Nominal k, High k)
 */
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

/**
 * Multi-scenario comparison generator
 */
export function generateMultiScenarioTraces(params: SimulationParams): MultiScenarioTrace[] {
  const presets = getScenarioById('normal_journey'); // all 4 presets
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

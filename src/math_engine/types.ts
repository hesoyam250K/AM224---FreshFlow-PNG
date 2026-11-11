export type StorageCondition = 'poor' | 'normal' | 'improved';

export type ScenarioPresetId = 'normal_journey' | 'road_delay' | 'major_disruption' | 'improved_storage';

export interface ProduceTypeSpec {
  id: string;
  name: string;
  localName?: string; // e.g. "Kaukau"
  baseSpoilageRate: number; // k in hr^-1 under normal ambient storage (e.g. 0.015)
  pricePerKgPGK: number; // Price in Papua New Guinea Kina per kg
  description: string;
  iconName: string;
  optimalTempC: number;
}

export interface ScenarioPreset {
  id: ScenarioPresetId;
  name: string;
  shortDescription: string;
  transportHours: number;
  storageCondition: StorageCondition;
  spoilageMultiplier: number;
  roadVibrationFactor: number; // k modifier due to road conditions
  incomingSupplyRate: number; // S in kg/hr
  badgeText: string;
}

export interface SimulationParams {
  produceId: string;
  initialQuantity: number; // Q0 in kg
  transportHours: number; // t in hours
  storageCondition: StorageCondition;
  customSpoilageRate?: number; // optional manual override for k
  scenarioId: ScenarioPresetId;
  incomingSupplyRate: number; // S for Model 2 (kg/hr)
  enableModel2Supply: boolean; // toggle Model 2 (Supply + Spoilage)
  enablePiecewiseConditions: boolean; // toggle Model 3 (Changing conditions k(t))
}

export interface TimeDataPoint {
  timeHours: number;
  analyticalUsableQty: number; // Q(t) exact
  numericalUsableQty: number; // Q(t) RK4 approximation
  lostQty: number;
  spoilageRateK: number; // instantaneous k(t)
  equilibriumQty?: number; // Q* = S/k
}

export interface SimulationResult {
  params: SimulationParams;
  produce: ProduceTypeSpec;
  timeSeries: TimeDataPoint[];
  startingQty: number; // Q0
  remainingQty: number; // Q(t_final)
  lostQty: number; // Q0 - Q(t_final)
  percentageLoss: number; // (lostQty / Q0) * 100
  effectiveK: number; // effective rate parameter hr^-1
  halfLifeHours: number; // t_1/2 = ln(2) / k
  estimatedValueLostPGK: number;
  estimatedValueRemainingPGK: number;
  equilibriumQty: number; // S/k for Model 2
  timeTo90PercentLossHours: number;
}

export interface SensitivityTrace {
  label: string;
  kValue: number;
  timeSeries: { timeHours: number; remainingQty: number }[];
}

export interface MultiScenarioTrace {
  presetId: ScenarioPresetId;
  name: string;
  remainingQty: number;
  percentageLoss: number;
  timeSeries: TimeDataPoint[];
}

export interface MathematicalInsight {
  type: 'info' | 'warning' | 'success' | 'math';
  title: string;
  description: string;
  metric?: string;
}

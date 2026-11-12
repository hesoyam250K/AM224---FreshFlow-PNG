export type StorageCondition = 'poor' | 'normal' | 'improved';

export type ScenarioPresetId = 'normal_journey' | 'road_delay' | 'major_disruption' | 'improved_storage';

export interface ProduceTypeSpec {
  id: string;
  name: string;
  localName?: string;
  baseSpoilageRate: number;
  pricePerKgPGK: number;
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
  roadVibrationFactor: number;
  incomingSupplyRate: number;
  badgeText: string;
}

export interface SimulationParams {
  produceId: string;
  initialQuantity: number;
  transportHours: number;
  storageCondition: StorageCondition;
  customSpoilageRate?: number;
  scenarioId: ScenarioPresetId;
  incomingSupplyRate: number;
  enableModel2Supply: boolean;
  enablePiecewiseConditions: boolean;
}

export interface TimeDataPoint {
  timeHours: number;
  analyticalUsableQty: number; // Q(t) exact
  numericalUsableQty: number; // Custom RK4 approximation
  scipyUsableQty?: number; // SciPy solve_ivp RK45 solution
  lostQty: number;
  spoilageRateK: number;
  equilibriumQty?: number;
}

export interface ErrorMetricsSpec {
  maxAbsoluteErrorRk4: number;
  maxAbsoluteErrorScipy: number;
  meanAbsoluteErrorRk4: number;
  meanAbsoluteErrorScipy: number;
  stepSize: number;
}

export interface SimulationResult {
  params: SimulationParams;
  produce: ProduceTypeSpec;
  timeSeries: TimeDataPoint[];
  startingQty: number;
  remainingQty: number;
  remainingQtyRk4?: number;
  remainingQtyScipy?: number;
  lostQty: number;
  percentageLoss: number;
  effectiveK: number;
  halfLifeHours: number;
  estimatedValueLostPGK: number;
  estimatedValueRemainingPGK: number;
  equilibriumQty: number;
  timeTo90PercentLossHours: number;
  errorMetrics?: ErrorMetricsSpec;
  engineUsed?: 'Node.js ODE Engine (NumPy/SciPy-grade RK4)' | 'Python FastAPI (NumPy/SciPy)' | 'Client JS Fallback' | string;
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

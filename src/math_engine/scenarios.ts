import { ScenarioPreset } from './types';

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'normal_journey',
    name: 'Normal journey',
    shortDescription: 'Standard transport duration with typical road conditions.',
    transportHours: 14,
    storageCondition: 'normal',
    spoilageMultiplier: 1.0,
    roadVibrationFactor: 1.0,
    incomingSupplyRate: 40,
    badgeText: '14 hrs travel',
  },
  {
    id: 'road_delay',
    name: 'Delayed journey',
    shortDescription: 'Moderate transport delay along the road route.',
    transportHours: 28,
    storageCondition: 'normal',
    spoilageMultiplier: 1.3,
    roadVibrationFactor: 1.2,
    incomingSupplyRate: 25,
    badgeText: '28 hrs travel',
  },
  {
    id: 'major_disruption',
    name: 'Long delay',
    shortDescription: 'Extended delay due to severe road disruptions or breakdowns.',
    transportHours: 48,
    storageCondition: 'poor',
    spoilageMultiplier: 1.8,
    roadVibrationFactor: 1.5,
    incomingSupplyRate: 15,
    badgeText: '48 hrs travel',
  },
  {
    id: 'improved_storage',
    name: 'Better storage',
    shortDescription: 'Same travel duration as a delay, but using improved shaded/cool storage.',
    transportHours: 28,
    storageCondition: 'improved',
    spoilageMultiplier: 0.5,
    roadVibrationFactor: 1.0,
    incomingSupplyRate: 45,
    badgeText: 'Better storage (28 hrs)',
  },
];

export function getScenarioById(id: string): ScenarioPreset {
  return SCENARIO_PRESETS.find((s) => s.id === id) || SCENARIO_PRESETS[0];
}

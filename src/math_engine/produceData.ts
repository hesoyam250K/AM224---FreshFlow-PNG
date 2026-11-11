import { ProduceTypeSpec } from './types';

export const PRODUCE_TYPES: ProduceTypeSpec[] = [
  {
    id: 'tomatoes',
    name: 'Tomatoes',
    localName: 'Tomato',
    baseSpoilageRate: 0.018, // ~1.8% per hour loss under ambient PNG humidity/temp (~28°C)
    pricePerKgPGK: 8.50, // ~8.50 Kina/kg in urban markets like Port Moresby / Lae
    description: 'Highly perishable fruit-vegetable sensitive to physical crushing and ambient warmth.',
    iconName: 'Apple',
    optimalTempC: 13,
  },
  {
    id: 'bananas',
    name: 'Bananas',
    localName: 'Mumu / Cooking Banana',
    baseSpoilageRate: 0.012, // ~1.2% per hour loss
    pricePerKgPGK: 5.00,
    description: 'Ethylene-producing staple crop susceptible to mechanical bruising during PMV transit.',
    iconName: 'Banana',
    optimalTempC: 14,
  },
  {
    id: 'kaukau',
    name: 'Kaukau (Sweet Potato)',
    localName: 'Kaukau',
    baseSpoilageRate: 0.006, // ~0.6% per hour loss (sturdy root vegetable)
    pricePerKgPGK: 4.00,
    description: 'Highlands primary staple crop. Sturdy root tuber with low baseline spoilage rate.',
    iconName: 'Tubers',
    optimalTempC: 16,
  },
  {
    id: 'leafy_greens',
    name: 'Leafy Greens',
    localName: 'Aibika / Kumu',
    baseSpoilageRate: 0.035, // ~3.5% per hour loss (rapid wilting)
    pricePerKgPGK: 7.00,
    description: 'Aibika and traditional greens. Extremely perishable with rapid moisture transpiration.',
    iconName: 'Leaf',
    optimalTempC: 8,
  },
  {
    id: 'custom',
    name: 'Custom Produce Spec',
    localName: 'User Parametric',
    baseSpoilageRate: 0.015,
    pricePerKgPGK: 6.00,
    description: 'User-configurable produce item for mathematical rate exploration.',
    iconName: 'Sliders',
    optimalTempC: 12,
  },
];

export function getProduceById(id: string): ProduceTypeSpec {
  return PRODUCE_TYPES.find((p) => p.id === id) || PRODUCE_TYPES[0];
}

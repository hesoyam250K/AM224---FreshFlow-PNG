import { SimulationResult, MathematicalInsight } from './types';

export function deriveMathematicalInsights(result: SimulationResult): MathematicalInsight[] {
  const insights: MathematicalInsight[] = [];
  const {
    percentageLoss,
    effectiveK,
    halfLifeHours,
    params,
    startingQty,
    remainingQty,
    lostQty,
    estimatedValueLostPGK,
    equilibriumQty,
    produce,
  } = result;

  // Insight 1: Decay Rate & Duration Impact
  if (percentageLoss > 50) {
    insights.push({
      type: 'warning',
      title: 'Critical Spoilage Threshold Exceeded',
      description: `Under this simulated ${params.transportHours}-hour transport duration and k = ${effectiveK.toFixed(4)} hr⁻¹, over half of the usable ${produce.name} (${percentageLoss.toFixed(1)}%) is estimated to be lost. Transport time heavily dominates overall post-harvest retention.`,
      metric: `${percentageLoss.toFixed(1)}% loss`,
    });
  } else if (percentageLoss > 20) {
    insights.push({
      type: 'info',
      title: 'Moderate Deterioration Observed',
      description: `Deterioration rate k = ${effectiveK.toFixed(4)} hr⁻¹ yields an estimated loss of ${lostQty.toFixed(1)} kg out of ${startingQty} kg. Transport delays contribute non-linearly due to the negative exponential curve Q(t) = Q₀ e⁻ᵏᵗ.`,
      metric: `${percentageLoss.toFixed(1)}% loss`,
    });
  } else {
    insights.push({
      type: 'success',
      title: 'High Produce Retention',
      description: `Efficient journey duration (${params.transportHours} hrs) retains ${remainingQty.toFixed(1)} kg (${(100 - percentageLoss).toFixed(1)}%) of produce. Exponential decay remains in its early shallow region.`,
      metric: `${(100 - percentageLoss).toFixed(1)}% retained`,
    });
  }

  // Insight 2: Half-Life Analysis
  if (isFinite(halfLifeHours)) {
    insights.push({
      type: 'math',
      title: `Crop Half-Life (t½) = ${halfLifeHours.toFixed(1)} Hours`,
      description: `The ODE solution Q(t) = Q₀ e⁻ᵏᵗ reaches half of its initial batch quantity when t = ln(2)/k = ${halfLifeHours.toFixed(1)} hours under simulated storage conditions (${params.storageCondition}).`,
      metric: `t½ = ${halfLifeHours.toFixed(1)} hrs`,
    });
  }

  // Insight 3: Storage Condition Leverage
  if (params.storageCondition === 'poor') {
    const potentialSavingsPct = percentageLoss * 0.55;
    insights.push({
      type: 'warning',
      title: 'Storage Condition Sensitivity',
      description: `Transitioning from 'Poor' to 'Improved' cold-chain storage reduces the effective rate parameter k by ~70%, which would theoretically save an estimated ${(startingQty * (potentialSavingsPct / 100)).toFixed(1)} kg (K${(estimatedValueLostPGK * 0.55).toFixed(0)} PGK) during this journey.`,
      metric: 'Storage Leverage High',
    });
  } else if (params.storageCondition === 'improved') {
    insights.push({
      type: 'success',
      title: 'Cold-Chain Rate Reduction Benefit',
      description: `Improved storage depresses the deterioration coefficient k to ${effectiveK.toFixed(4)} hr⁻¹, extending crop half-life and mitigating heat-driven enzymatic degradation.`,
      metric: 'Mitigation Active',
    });
  }

  // Insight 4: Model 2 Equilibrium Dynamics
  if (params.enableModel2Supply) {
    const isNearEquilibrium = Math.abs(remainingQty - equilibriumQty) / equilibriumQty < 0.1;
    insights.push({
      type: 'math',
      title: `Supply-Spoilage Equilibrium Q* = S/k = ${equilibriumQty.toFixed(1)} kg`,
      description: params.enableModel2Supply
        ? `Under continuous incoming supply rate S = ${params.incomingSupplyRate} kg/hr and spoilage loss rate kQ, the first-order linear ODE dQ/dt + kQ = S approaches stable equilibrium Q* = S/k = ${equilibriumQty.toFixed(1)} kg as t → ∞. ${isNearEquilibrium ? 'The system is currently near steady state.' : 'The system is currently in transient phase.'}`
        : '',
      metric: `Q* = ${equilibriumQty.toFixed(1)} kg`,
    });
  }

  // Insight 5: Economic Financial Impact
  insights.push({
    type: 'info',
    title: `Simulated PNG Economic Impact: K${estimatedValueLostPGK.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} PGK`,
    description: `At an average market price of K${produce.pricePerKgPGK.toFixed(2)} PGK/kg for ${produce.name}, the estimated ${lostQty.toFixed(1)} kg spoilage loss translates to K${estimatedValueLostPGK.toLocaleString()} PGK in lost economic revenue for growers and traders.`,
    metric: `K${estimatedValueLostPGK.toFixed(0)} PGK lost`,
  });

  return insights;
}

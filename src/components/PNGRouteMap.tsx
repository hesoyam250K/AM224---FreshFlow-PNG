import React from 'react';
import { MapPin, Navigation, Truck, Anchor, Thermometer, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const PNGRouteMap: React.FC = () => {
  const corridors = [
    {
      id: 'highlands_hwy',
      title: 'Highlands Highway Corridor',
      route: 'Mount Hagen → Goroka → Kassam Pass → Lae Port (450 km)',
      challenge: 'Unpaved sections, landslide slips, altitude temperature shifts (15°C to 32°C ambient).',
      produceFocus: 'Kaukau, Bananas, Tomatoes, Leafy Greens',
      mathImpact: 'High road vibration factor (1.3× to 1.6× k), variable travel duration (18h to 60h).',
      statusColor: 'border-emerald-500/30 bg-emerald-950/20',
    },
    {
      id: 'coastal_shipping',
      title: 'Coastal Maritime Transit',
      route: 'Lae Port → Coastal Vessels → Port Moresby / Island Hubs',
      challenge: 'Port loading delays, non-refrigerated container deck storage.',
      produceFocus: 'Bulk Root Crops (Kaukau), Cooking Bananas',
      mathImpact: 'Extended storage duration t (48h to 96h) requiring low k storage conditions.',
      statusColor: 'border-teal-500/30 bg-teal-950/20',
    },
    {
      id: 'pmv_local',
      title: 'Local PMV & Open-Tray Transport',
      route: 'Farm Gate → Village Market Hubs',
      challenge: 'Direct solar radiation exposure, manual stacking without ventilated crates.',
      produceFocus: 'Tomatoes, Aibika, Fresh Leafy Greens',
      mathImpact: 'Elevated initial rate k₀ due to direct sunlight and mechanical bruising.',
      statusColor: 'border-amber-500/30 bg-amber-950/20',
    },
  ];

  return (
    <div id="png-context" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-heading">
              Papua New Guinea Agricultural Logistics Context
            </h2>
            <p className="text-xs text-slate-400">
              Connecting differential rate parameters to PNG supply chain environments
            </p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-full text-slate-400 font-mono">
          Highlands Corridor Model
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
        FreshFlow PNG explores how mathematical rate models can help us think about the consequences of transport duration, delay bottlenecks, and storage conditions across Papua New Guinea's key agricultural supply chains.
      </p>

      {/* Visual Logistics Corridors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {corridors.map((c) => (
          <div key={c.id} className={`p-5 rounded-xl border ${c.statusColor} space-y-3 flex flex-col justify-between`}>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <h3 className="text-sm font-bold text-white">{c.title}</h3>
              </div>
              <p className="text-xs font-mono text-emerald-300/90">{c.route}</p>
              <p className="text-xs text-slate-300 leading-relaxed">{c.challenge}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/60 space-y-1 text-[11px] text-slate-400">
              <p><span className="text-slate-300 font-semibold">Key Crops:</span> {c.produceFocus}</p>
              <p><span className="text-emerald-400 font-semibold">Math Link:</span> {c.mathImpact}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

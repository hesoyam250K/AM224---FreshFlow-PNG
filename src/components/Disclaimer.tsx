import React from 'react';

export const Disclaimer: React.FC = () => {
  return (
    <div className="p-4 bg-[#0B0F17]/80 border border-slate-800 rounded-lg text-xs text-slate-400 leading-relaxed">
      <span className="font-semibold text-slate-200">Disclaimer: </span>
      FreshFlow PNG is an educational mathematical simulation. The settings and results are illustrative unless real, validated data is added. The project is designed to show how differential equations can be used to explore real-world problems.
    </div>
  );
};

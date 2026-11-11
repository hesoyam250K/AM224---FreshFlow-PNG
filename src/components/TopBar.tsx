import React from 'react';

interface TopBarProps {
  onTrySimulation: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onTrySimulation }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 sm:px-8 py-3.5 transition-colors">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-6">
        {/* Brand Zone */}
        <a
          href="#"
          className="text-lg font-bold text-slate-900 tracking-tight whitespace-nowrap hover:text-emerald-700 transition-colors"
        >
          FreshFlow PNG
        </a>

        {/* Navigation Links */}
        <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-600 font-medium">
          <a href="#simulation" className="hover:text-slate-900 transition-colors whitespace-nowrap">
            Simulation
          </a>
          <a href="#results" className="hover:text-slate-900 transition-colors whitespace-nowrap">
            Results
          </a>
          <a href="#compare" className="hover:text-slate-900 transition-colors whitespace-nowrap">
            Compare
          </a>
          <a href="#maths" className="hover:text-slate-900 transition-colors whitespace-nowrap">
            The Maths
          </a>
        </nav>

        {/* Action Button */}
        <button
          onClick={onTrySimulation}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm"
        >
          Try a simulation
        </button>
      </div>
    </header>
  );
};

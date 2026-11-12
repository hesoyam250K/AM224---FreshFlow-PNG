import React from 'react';

interface TopBarProps {
  onTrySimulation: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onTrySimulation }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800/80 px-3.5 sm:px-8 py-3 transition-colors">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Zone */}
        <a
          href="#"
          className="text-base sm:text-lg font-bold text-slate-100 tracking-tight whitespace-nowrap hover:text-emerald-400 transition-colors flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shrink-0" />
          <span>FreshFlow PNG</span>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300 font-medium">
          <a href="#simulation" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
            Simulation
          </a>
          <a href="#results" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
            Results
          </a>
          <a href="#compare" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
            Compare
          </a>
          <a href="#maths" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
            The Maths
          </a>
        </nav>

        {/* Action Button */}
        <button
          onClick={onTrySimulation}
          className="px-3.5 sm:px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm shrink-0"
        >
          Try simulation
        </button>
      </div>
    </header>
  );
};

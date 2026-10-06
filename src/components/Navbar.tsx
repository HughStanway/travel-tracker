import React from 'react';
import { Compass, Moon, Sun, Printer, MapPin, ChevronLeft } from 'lucide-react';
import { TravelPlan } from '../types/travel';

interface NavbarProps {
  plans: TravelPlan[];
  selectedPlan: TravelPlan | null;
  onSelectPlan: (plan: TravelPlan | null) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onPrint: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  plans,
  selectedPlan,
  onSelectPlan,
  darkMode,
  onToggleDarkMode,
  onPrint,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectPlan(null)}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:bg-orange-600 transition-all">
                <Compass className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  Travel Tracker
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300">
                    Plans
                  </span>
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block -mt-0.5">
                  Static Markdown Itineraries
                </span>
              </div>
            </button>

            {selectedPlan && (
              <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => onSelectPlan(null)}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 transition"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  All Trips
                </button>
                <span className="text-slate-300 dark:text-slate-600">/</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-orange-500" />
                  {selectedPlan.title}
                </span>
              </div>
            )}
          </div>

          {/* Plan Selector & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {plans.length > 1 && (
              <select
                aria-label="Select trip destination"
                value={selectedPlan?.id || ''}
                onChange={(e) => {
                  const target = plans.find((p) => p.id === e.target.value);
                  onSelectPlan(target || null);
                }}
                className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-orange-400 focus:outline-none"
              >
                <option value="">All Destinations ({plans.length})</option>
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.totalItems} places)
                  </option>
                ))}
              </select>
            )}

            {selectedPlan && (
              <button
                onClick={onPrint}
                title="Print or Export PDF"
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Printer className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onToggleDarkMode}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

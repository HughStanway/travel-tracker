import React, { useState, useEffect } from 'react';
import { TravelPlan } from './types/travel';
import rawPlans from './data/plans.json';
import { Navbar } from './components/Navbar';
import { PlanCard } from './components/PlanCard';
import { PlanView } from './components/PlanView';
import { Compass, Map, Sparkles, PlusCircle } from 'lucide-react';

const plansData = rawPlans as TravelPlan[];

export const App: React.FC = () => {
  const [plans] = useState<TravelPlan[]>(plansData);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(() => {
    // Check URL hash first (e.g. #/new-york)
    const hash = window.location.hash.replace('#/', '').trim();
    if (hash && plansData.some((p) => p.id === hash)) {
      return hash;
    }
    // If only one plan exists, default to it
    if (plansData.length === 1) {
      return plansData[0].id;
    }
    return null;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('travel_tracker_dark');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [visitedMap, setVisitedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('travel_tracker_visited');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('travel_tracker_dark', String(darkMode));
  }, [darkMode]);

  // Sync URL hash with selected plan
  useEffect(() => {
    if (selectedPlanId) {
      window.location.hash = `#/${selectedPlanId}`;
    } else {
      window.location.hash = '';
    }
  }, [selectedPlanId]);

  // Persist visitedMap to localStorage
  useEffect(() => {
    localStorage.setItem('travel_tracker_visited', JSON.stringify(visitedMap));
  }, [visitedMap]);

  const handleToggleVisited = (id: string) => {
    setVisitedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleResetProgress = () => {
    if (!selectedPlan) return;
    if (window.confirm(`Reset visited checkmarks for ${selectedPlan.title}?`)) {
      setVisitedMap((prev) => {
        const next = { ...prev };
        selectedPlan.items.forEach((item) => {
          delete next[item.id];
        });
        return next;
      });
    }
  };

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || null;

  const handleSelectPlan = (plan: TravelPlan | null) => {
    setSelectedPlanId(plan ? plan.id : null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar
        plans={plans}
        selectedPlan={selectedPlan}
        onSelectPlan={handleSelectPlan}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        onPrint={handlePrint}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {selectedPlan ? (
          <PlanView
            plan={selectedPlan}
            visitedMap={visitedMap}
            onToggleVisited={handleToggleVisited}
            onResetProgress={handleResetProgress}
          />
        ) : (
          /* Destinations / Trips Dashboard */
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xs relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 text-xs font-semibold mb-3 border border-orange-200/80 dark:border-orange-900/60">
                  <Compass className="w-3.5 h-3.5 text-orange-500 animate-spin" style={{ animationDuration: '8s' }} />
                  Travel Tracker
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Your Travel Itineraries
                </h1>
                <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  Fast, stateless travel companion dynamically generated from your markdown files.
                  Explore places, check off destinations, look up maps, and organize your trips.
                </p>
              </div>
            </div>

            {/* Plans Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Map className="w-5 h-5 text-orange-500" />
                  Available Destinations ({plans.length})
                </h2>
              </div>

              {plans.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
                  <PlusCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    No itineraries found
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                    Add markdown travel plans into the <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">itinery/</code> directory and rebuild the app.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {plans.map((p) => {
                    const count = p.items.filter((item) => !!visitedMap[item.id]).length;
                    return (
                      <PlanCard
                        key={p.id}
                        plan={p}
                        visitedCount={count}
                        onSelect={handleSelectPlan}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-400 no-print">
        <p className="flex items-center justify-center gap-1.5">
          <span>Travel Tracker</span>
          <span>•</span>
          <span>Stateless Static Frontend</span>
          <span>•</span>
          <span>Deployable via Brewery</span>
        </p>
      </footer>
    </div>
  );
};
export default App;

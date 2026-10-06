import React from 'react';
import { MapPin, FileCode, CheckCircle2, ArrowRight } from 'lucide-react';
import { TravelPlan } from '../types/travel';

interface PlanCardProps {
  plan: TravelPlan;
  visitedCount: number;
  onSelect: (plan: TravelPlan) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, visitedCount, onSelect }) => {
  const percent = plan.totalItems > 0 ? Math.round((visitedCount / plan.totalItems) * 100) : 0;

  return (
    <div
      onClick={() => onSelect(plan)}
      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/5 transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/40 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-105 group-hover:bg-teal-500 group-hover:text-white transition-all shadow-sm">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
                {plan.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                /{plan.slug}
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {plan.totalItems} places
          </span>
        </div>

        {/* Multi-file badges */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {plan.files.map((f) => (
            <span
              key={f.relativePath}
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60"
            >
              <FileCode className="w-3 h-3 text-teal-500" />
              {f.filename}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            {visitedCount} / {plan.totalItems} Visited
          </span>
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {percent}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-500 rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="mt-4 flex items-center justify-end text-xs font-semibold text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform">
          View Itinerary <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </div>
      </div>
    </div>
  );
};

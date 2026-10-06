import React from 'react';
import { Search, LayoutGrid, FileText, CheckCircle2, RotateCcw } from 'lucide-react';

interface StatsBarProps {
  totalItems: number;
  visitedCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: 'all' | 'unvisited' | 'visited';
  onStatusFilterChange: (filter: 'all' | 'unvisited' | 'visited') => void;
  sectionFilter: string;
  onSectionFilterChange: (section: string) => void;
  sections: string[];
  viewMode: 'cards' | 'markdown';
  onViewModeChange: (mode: 'cards' | 'markdown') => void;
  onResetProgress: () => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  totalItems,
  visitedCount,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sectionFilter,
  onSectionFilterChange,
  sections,
  viewMode,
  onViewModeChange,
  onResetProgress,
}) => {
  const percent = totalItems > 0 ? Math.round((visitedCount / totalItems) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 no-print">
      {/* Top Row: Progress Bar & Progress Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm">
            {percent}%
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Trip Progress
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                ({visitedCount} of {totalItems} visited)
              </span>
            </div>
            {/* Progress line */}
            <div className="w-48 sm:w-64 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>

        {/* View Switcher & Reset */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {visitedCount > 0 && (
            <button
              onClick={onResetProgress}
              title="Reset visited checkboxes"
              className="text-xs font-medium text-slate-400 hover:text-rose-500 px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}

          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => onViewModeChange('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Interactive Cards
            </button>
            <button
              onClick={() => onViewModeChange('markdown')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'markdown'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Markdown Doc
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row (Only relevant in cards mode): Filters & Search */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search spots, landmarks, notes..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none placeholder:text-slate-400 text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Status Filter (All / To Visit / Visited) */}
          <div className="md:col-span-4 flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => onStatusFilterChange('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All ({totalItems})
            </button>
            <button
              onClick={() => onStatusFilterChange('unvisited')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === 'unvisited'
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              To Visit ({totalItems - visitedCount})
            </button>
            <button
              onClick={() => onStatusFilterChange('visited')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === 'visited'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              Visited ({visitedCount})
            </button>
          </div>

          {/* Section Filter Dropdown */}
          <div className="md:col-span-3">
            <select
              aria-label="Filter by neighborhood or section"
              value={sectionFilter}
              onChange={(e) => onSectionFilterChange(e.target.value)}
              className="w-full text-xs py-2 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Sections / Areas</option>
              {sections.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { TravelPlan, TravelFile } from '../types/travel';
import { ItemCard } from './ItemCard';
import { StatsBar } from './StatsBar';
import { MarkdownViewer } from './MarkdownViewer';
import { FileText, Layers, MapPin, Sparkles, Folder } from 'lucide-react';

interface PlanViewProps {
  plan: TravelPlan;
  visitedMap: Record<string, boolean>;
  onToggleVisited: (id: string) => void;
  onResetProgress: () => void;
}

export const PlanView: React.FC<PlanViewProps> = ({
  plan,
  visitedMap,
  onToggleVisited,
  onResetProgress,
}) => {
  // Active file selection: 'all' or relativePath of a file
  const [activeFileKey, setActiveFileKey] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unvisited' | 'visited'>('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'markdown'>('cards');

  // Currently active file object (if not 'all')
  const activeFile = useMemo<TravelFile | null>(() => {
    if (activeFileKey === 'all') return null;
    return plan.files.find((f) => f.relativePath === activeFileKey) || null;
  }, [plan, activeFileKey]);

  // Items to consider based on active file selection
  const baseItems = useMemo(() => {
    if (activeFile) {
      return activeFile.items;
    }
    return plan.items;
  }, [plan, activeFile]);

  // Visited count for current scope
  const visitedCount = useMemo(() => {
    return baseItems.filter((item) => !!visitedMap[item.id]).length;
  }, [baseItems, visitedMap]);

  // Unique sections in current scope
  const sections = useMemo(() => {
    const set = new Set<string>();
    baseItems.forEach((i) => {
      if (i.section) set.add(i.section);
    });
    return Array.from(set);
  }, [baseItems]);

  // Filtered items based on search, status, and section
  const filteredItems = useMemo(() => {
    return baseItems.filter((item) => {
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesSection = item.section.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesSection) return false;
      }

      // Status filter
      const isVisited = !!visitedMap[item.id];
      if (statusFilter === 'visited' && !isVisited) return false;
      if (statusFilter === 'unvisited' && isVisited) return false;

      // Section filter
      if (sectionFilter !== 'all' && item.section !== sectionFilter) return false;

      return true;
    });
  }, [baseItems, searchQuery, statusFilter, sectionFilter, visitedMap]);

  // Group filtered items by section for organized display
  const groupedSections = useMemo(() => {
    const map = new Map<string, typeof filteredItems>();
    filteredItems.forEach((item) => {
      const sec = item.section || 'General';
      if (!map.has(sec)) {
        map.set(sec, []);
      }
      map.get(sec)!.push(item);
    });
    return Array.from(map.entries());
  }, [filteredItems]);

  // Combined markdown content for markdown view
  const markdownContent = useMemo(() => {
    if (activeFile) {
      return activeFile.rawContent;
    }
    return plan.files
      .map((f) => `# ${f.title}\n\n${f.rawContent}`)
      .join('\n\n---\n\n');
  }, [plan, activeFile]);

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-3 border border-teal-500/30">
              <MapPin className="w-3 h-3" />
              Travel Plan
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {plan.title}
            </h1>
            <p className="text-teal-100/70 text-xs sm:text-sm mt-1.5 flex items-center gap-3">
              <span>{plan.files.length} document{plan.files.length > 1 ? 's' : ''}</span>
              <span>•</span>
              <span>{plan.totalItems} places / activities</span>
              <span>•</span>
              <span>{plan.totalSections} sections</span>
            </p>
          </div>

          {/* Quick file stats info */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xs">
            <Folder className="w-5 h-5 text-teal-400" />
            <div className="text-xs">
              <div className="text-white/60">Source Folder</div>
              <div className="font-mono font-bold text-white">itinery/{plan.folder}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-file Tabs Switcher (Key requirement: multiple .md files per travel plan) */}
      {plan.files.length > 1 && (
        <div className="border-b border-slate-200 dark:border-slate-800 pb-2 no-print">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <button
              onClick={() => {
                setActiveFileKey('all');
                setSectionFilter('all');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeFileKey === 'all'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              All Documents ({plan.files.length})
            </button>

            {plan.files.map((file) => (
              <button
                key={file.relativePath}
                onClick={() => {
                  setActiveFileKey(file.relativePath);
                  setSectionFilter('all');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  activeFileKey === file.relativePath
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                {file.title || file.filename}
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10">
                  {file.items.length}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stats, Filters & Search Bar */}
      <StatsBar
        totalItems={baseItems.length}
        visitedCount={visitedCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sectionFilter={sectionFilter}
        onSectionFilterChange={setSectionFilter}
        sections={sections}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onResetProgress={onResetProgress}
      />

      {/* Main Content Area */}
      {viewMode === 'markdown' ? (
        <MarkdownViewer content={markdownContent} />
      ) : (
        <div className="space-y-8">
          {filteredItems.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
              <Sparkles className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No matching places found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Try clearing your search query or adjusting your filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setSectionFilter('all');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-500 transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            groupedSections.map(([secTitle, secItems]) => (
              <div key={secTitle} className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    {secTitle}
                  </h3>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    ({secItems.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {secItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      destination={plan.title}
                      isChecked={!!visitedMap[item.id]}
                      onToggle={onToggleVisited}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

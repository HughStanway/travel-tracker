import React, { useState } from 'react';
import { Check, MapPin, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';
import { TravelItem } from '../types/travel';
import { renderInlineMarkdown, stripMarkdown } from '../utils/markdown';

interface ItemCardProps {
  item: TravelItem;
  destination: string;
  isChecked: boolean;
  onToggle: (id: string) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  destination,
  isChecked,
  onToggle,
}) => {
  const [copied, setCopied] = useState(false);

  const plainName = stripMarkdown(item.name);
  const mapsName = plainName.replace(/\s*\([^)]*\)\s*$/, '').trim() || plainName;
  const mapsQuery = encodeURIComponent(`${mapsName}, ${destination}`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(plainName);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      onClick={() => onToggle(item.id)}
      className={`group relative rounded-xl border p-4 transition-all cursor-pointer select-none avoid-break-inside ${
        isChecked
          ? 'bg-orange-50/40 dark:bg-orange-950/20 border-orange-200/80 dark:border-orange-800/60'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-xs'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div
          role="checkbox"
          aria-checked={isChecked}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              onToggle(item.id);
            }
          }}
          className={`flex-shrink-0 w-6 h-6 rounded-lg mt-0.5 flex items-center justify-center border transition-all ${
            isChecked
              ? 'bg-orange-500 border-orange-500 text-white shadow-xs shadow-orange-500/20'
              : 'border-slate-300 dark:border-slate-600 group-hover:border-orange-400 bg-slate-50 dark:bg-slate-800 text-transparent'
          }`}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4
              className={`text-sm font-semibold tracking-tight transition ${
                isChecked
                  ? 'text-slate-500 dark:text-slate-400 line-through'
                  : 'text-slate-900 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-orange-400'
              }`}
              dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item.name) }}
            />

            {/* Quick Actions (hidden in print) */}
            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition no-print">
              <button
                type="button"
                onClick={handleCopy}
                title="Copy name to clipboard"
                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {copied ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="Search on Google Maps"
                className="p-1 rounded text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {item.description && (
            <p
              className={`text-xs mt-1 leading-relaxed ${
                isChecked
                  ? 'text-slate-400 dark:text-slate-500'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
              dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item.description) }}
            />
          )}

          <div className="mt-2.5 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              <MapPin className="w-2.5 h-2.5" />
              {stripMarkdown(item.section)}
            </span>
            {isChecked && (
              <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400">
                Visited
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

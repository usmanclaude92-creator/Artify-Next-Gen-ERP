import React from 'react';
import { ChevronRight, Home, Sparkles } from 'lucide-react';
import { BreadcrumbItem } from '../../navigation/erpHierarchy';
import { ERPRouteState } from '../../types/erp';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (route: ERPRouteState) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-500 overflow-x-auto py-1 whitespace-nowrap scrollbar-none">
      {items.map((item, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === items.length - 1;

        return (
          <div key={`${item.label}-${idx}`} className="flex items-center space-x-1.5">
            {!isFirst && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
            <button
              onClick={() => onNavigate(item.route)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all font-medium ${
                isLast
                  ? 'text-slate-900 bg-slate-100/80 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              {isFirst && <Home className="w-3.5 h-3.5 text-slate-500" />}
              {item.route.view === 'ai' && <Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
              {item.code && (
                <span className="font-mono text-[10px] text-slate-500 bg-slate-200/70 px-1 py-0.5 rounded">
                  {item.code}
                </span>
              )}
              <span>{item.label}</span>
            </button>
          </div>
        );
      })}
    </nav>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Layers, ArrowRight, CornerDownLeft, Sparkles, Star } from 'lucide-react';
import { ERP_SEARCH_INDEX, SearchResultItem } from '../../navigation/erpHierarchy';
import { ERPRouteState } from '../../types/erp';
import { IconRenderer } from '../common/IconRenderer';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: ERPRouteState) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'module' | 'functional_area' | 'process' | 'transaction'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle modal if needed
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    let list = ERP_SEARCH_INDEX;

    if (activeTab !== 'all') {
      list = list.filter(item => item.type === activeTab);
    }

    if (!trimmed) {
      // Return top representative modules and processes when empty
      return list.slice(0, 12);
    }

    return list
      .filter(item => {
        return (
          (item.title || '').toLowerCase().includes(trimmed) ||
          (item.subtitle || '').toLowerCase().includes(trimmed) ||
          (item.code || '').toLowerCase().includes(trimmed) ||
          (item.moduleName || '').toLowerCase().includes(trimmed)
        );
      })
      .slice(0, 30);
  }, [query, activeTab]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults]);

  if (!isOpen) return null;

  const handleSelect = (item: SearchResultItem) => {
    onNavigate(item.route);
    onClose();
  };

  const handleKeyDownInInput = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && filteredResults[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredResults[selectedIndex]);
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'module':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'functional_area':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'process':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'transaction':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            type="text"
            placeholder="Search all 17 AFE modules, functional areas, processes, vouchers (e.g., 'GL', '16.02', 'Requisition', 'Asset')..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDownInInput}
            autoFocus
            className="w-full text-slate-800 placeholder-slate-400 text-base focus:outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-md shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Category Filters */}
        <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/70 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
          <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider shrink-0">Filter:</span>
          {(
            [
              { key: 'all', label: 'All Hierarchy' },
              { key: 'module', label: 'L1 Modules (17)' },
              { key: 'functional_area', label: 'L2 Areas' },
              { key: 'process', label: 'L3 Processes' },
              { key: 'transaction', label: 'L4 Activities & Screens' }
            ] as const
          ).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-50">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Layers className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
              <p className="text-sm font-medium text-slate-600">No matching AFE navigation items found</p>
              <p className="text-xs text-slate-400 mt-1">Try searching by module code, process name, or keyword</p>
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={`${item.id}-${idx}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl cursor-pointer flex items-center justify-between gap-3 transition-all ${
                    isSelected ? 'bg-indigo-50/80 border border-indigo-100' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <IconRenderer name={item.icon} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                          {item.code}
                        </span>
                        <span className="font-semibold text-sm text-slate-900 truncate">
                          {item.title}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${getBadgeColor(
                            item.type
                          )}`}
                        >
                          {item.type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-slate-400">
                    <span className="text-[11px] hidden sm:inline-block text-slate-400">{item.phase}</span>
                    <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-indigo-600 translate-x-0.5' : ''} transition-transform`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">↓</kbd> to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">↵</kbd> to select
            </span>
          </div>
          <div className="flex items-center gap-1 text-indigo-600 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Indexed Navigation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

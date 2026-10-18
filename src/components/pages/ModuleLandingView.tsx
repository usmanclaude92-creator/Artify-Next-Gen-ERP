import React from 'react';
import {
  Sparkles,
  Layers,
  Star,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';
import { ERPModule, ERPRouteState } from '../../types/erp';
import { IconRenderer } from '../common/IconRenderer';

interface ModuleLandingViewProps {
  module: ERPModule;
  onNavigate: (route: ERPRouteState) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const ModuleLandingView: React.FC<ModuleLandingViewProps> = ({
  module,
  onNavigate,
  isFavorite,
  onToggleFavorite
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Module Hero Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <IconRenderer name={module.icon} className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-500/30">
                  MODULE {module.code}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">• {module.category}</span>
                <span className="text-[11px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/30">
                  {module.phase}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                {module.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
                {module.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={onToggleFavorite}
              title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Star
                className={`w-4 h-4 ${isFavorite ? 'text-amber-500 dark:text-amber-400 fill-amber-400' : 'text-slate-400'}`}
              />
              <span>{isFavorite ? 'Pinned to Favorites' : 'Pin to Favorites'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Module KPIs Grid */}
      {module.kpiPlaceholders && module.kpiPlaceholders.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Module Executive KPIs & Key Metrics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {module.kpiPlaceholders.map((kpi, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block truncate">{kpi.title}</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{kpi.value}</span>
                  {kpi.change && (
                    <span
                      className={`text-xs font-bold ${
                        kpi.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {kpi.change}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Assistant Suggestions */}
      {module.aiSuggestions && module.aiSuggestions.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50/70 dark:from-indigo-500/10 via-slate-50 dark:via-slate-900 to-indigo-50/70 dark:to-indigo-500/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-indigo-950">AI Copilot Operational Suggestions</h3>
              <div className="mt-1 flex flex-wrap gap-2">
                {module.aiSuggestions.map((sug, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white dark:bg-slate-900 text-indigo-900 dark:text-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-500/20 font-medium shadow-2xs"
                  >
                    • {sug}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate({ view: 'ai' })}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold whitespace-nowrap self-start md:self-auto cursor-pointer"
          >
            Run in AI Command
          </button>
        </div>
      )}

      {/* Level-2 Functional Areas Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Functional Areas & Subsystems ({module.functionalAreas.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Level-2 Architecture</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {module.functionalAreas.map(fa => {
            const totalTransactions = fa.processes.reduce(
              (acc, p) => acc + p.transactions.length,
              0
            );

            return (
              <div
                key={fa.id}
                onClick={() =>
                  onNavigate({
                    view: 'functional_area',
                    moduleId: module.id,
                    functionalAreaId: fa.id
                  })
                }
                className="group bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 px-2 py-0.5 rounded transition-colors">
                      {fa.code}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {fa.phase}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mt-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {fa.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{fa.description}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                    <span className="font-medium">{fa.processes.length} Processes</span>
                    <span>•</span>
                    <span>{totalTransactions} Screens</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Layers, ArrowLeft, ChevronRight, FileText, Star, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ERPModule, ERPFunctionalArea, ERPProcess, ERPRouteState } from '../../types/erp';

interface ProcessViewProps {
  module: ERPModule;
  functionalArea: ERPFunctionalArea;
  process: ERPProcess;
  onNavigate: (route: ERPRouteState) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const ProcessView: React.FC<ProcessViewProps> = ({
  module,
  functionalArea,
  process,
  onNavigate,
  isFavorite,
  onToggleFavorite
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() =>
                  onNavigate({
                    view: 'functional_area',
                    moduleId: module.id,
                    functionalAreaId: functionalArea.id
                  })
                }
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to {functionalArea.name}</span>
              </button>
              <span className="text-slate-300">•</span>
              <span className="font-mono text-xs font-bold text-slate-500">{process.code}</span>
              <span className="text-[11px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                {process.phase}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{process.name}</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {process.description}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={onToggleFavorite}
              title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Star
                className={`w-4 h-4 ${isFavorite ? 'text-amber-500 fill-amber-400' : 'text-slate-400'}`}
              />
              <span>{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Level-4 Transactions List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Transactions & Operating Screens ({process.transactions.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500">Level-4 Transactional Units</span>
        </div>

        <div className="space-y-3">
          {process.transactions.map((tx, idx) => (
            <div
              key={tx.id}
              onClick={() =>
                onNavigate({
                  view: 'transaction',
                  moduleId: module.id,
                  functionalAreaId: functionalArea.id,
                  processId: process.id,
                  transactionId: tx.id
                })
              }
              className="group bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0 transition-colors">
                  {idx + 1}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {tx.code}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {tx.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{tx.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 hidden sm:inline-block">
                  {tx.phase}
                </span>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

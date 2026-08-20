import React from 'react';
import { Layers, ArrowLeft, ChevronRight, FileText, Sparkles, Star } from 'lucide-react';
import { ERPModule, ERPFunctionalArea, ERPRouteState } from '../../types/erp';
import { IconRenderer } from '../common/IconRenderer';

interface FunctionalAreaViewProps {
  module: ERPModule;
  functionalArea: ERPFunctionalArea;
  onNavigate: (route: ERPRouteState) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const FunctionalAreaView: React.FC<FunctionalAreaViewProps> = ({
  module,
  functionalArea,
  onNavigate,
  isFavorite,
  onToggleFavorite
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Back button & Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => onNavigate({ view: 'module', moduleId: module.id })}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to {module.shortName}</span>
              </button>
              <span className="text-slate-300">•</span>
              <span className="font-mono text-xs font-bold text-slate-500">
                {functionalArea.code}
              </span>
              <span className="text-[11px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                {functionalArea.phase}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {functionalArea.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {functionalArea.description}
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

      {/* Level-3 Processes Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Operating Processes ({functionalArea.processes.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500">Level-3 Workflow Sequences</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {functionalArea.processes.map(proc => (
            <div
              key={proc.id}
              onClick={() =>
                onNavigate({
                  view: 'process',
                  moduleId: module.id,
                  functionalAreaId: functionalArea.id,
                  processId: proc.id
                })
              }
              className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 group-hover:bg-indigo-50 group-hover:text-indigo-700 px-2 py-0.5 rounded transition-colors">
                    {proc.code}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {proc.phase}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 mt-2 group-hover:text-indigo-600 transition-colors">
                  {proc.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{proc.description}</p>

                {/* Sub-transactions badges preview */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {proc.transactions.slice(0, 3).map(tx => (
                    <span
                      key={tx.id}
                      className="text-[11px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100 font-medium"
                    >
                      {tx.name}
                    </span>
                  ))}
                  {proc.transactions.length > 3 && (
                    <span className="text-[11px] text-indigo-600 font-medium self-center">
                      +{proc.transactions.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {proc.transactions.length} Screen Vouchers / Activities
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

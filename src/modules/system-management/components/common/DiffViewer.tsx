import React from 'react';
import { ArrowRight, History } from 'lucide-react';

interface DiffViewerProps {
  previousValue?: string;
  newValue?: string;
  entityName?: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ previousValue, newValue, entityName }) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono">
      <div className="flex items-center gap-2 mb-3 text-slate-500 font-sans font-semibold">
        <History className="w-4 h-4 text-indigo-600" />
        <span>Attribute Modification Diff {entityName ? `(${entityName})` : ''}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-rose-50/60 border border-rose-200 rounded-lg p-3">
          <div className="text-[10px] font-bold text-rose-700 uppercase tracking-wider mb-1">
            Previous State
          </div>
          <pre className="text-rose-900 whitespace-pre-wrap break-all text-[11px] leading-relaxed">
            {previousValue || '(None / Newly Initialized)'}
          </pre>
        </div>

        <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3">
          <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
            Committed State
          </div>
          <pre className="text-emerald-900 whitespace-pre-wrap break-all text-[11px] leading-relaxed">
            {newValue || '(Purged / Deleted)'}
          </pre>
        </div>
      </div>
    </div>
  );
};

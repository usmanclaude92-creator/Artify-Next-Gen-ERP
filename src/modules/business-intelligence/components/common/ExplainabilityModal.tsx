import React from 'react';
import { ShieldCheck, Cpu, Database, Filter, Clock, FileSpreadsheet, X, CheckCircle2 } from 'lucide-react';
import { useBI } from '../../services/biStore';

export const ExplainabilityModal: React.FC = () => {
  const { selectedExplainabilityTrace, closeExplainability } = useBI();

  if (!selectedExplainabilityTrace) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">AI & BI Calculation Explainability Trace</h3>
              <p className="text-xs text-slate-400 font-mono">Trace ID: {selectedExplainabilityTrace.insightId}</p>
            </div>
          </div>
          <button
            onClick={closeExplainability}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Security & Access Check */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Role Access Verified:</strong> Executed under context <em>{selectedExplainabilityTrace.userRoleContext}</em>
              </span>
            </div>
            <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              <CheckCircle2 className="w-3 h-3" />
              RBAC PASS
            </span>
          </div>

          {/* Mathematical Formula */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              Mathematical Aggregation Formula
            </div>
            <pre className="font-mono text-xs text-indigo-900 bg-white border border-slate-200 p-2.5 rounded-lg whitespace-pre-wrap">
              {selectedExplainabilityTrace.aggregationFormula}
            </pre>
          </div>

          {/* Data Sources Queried */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-600" />
                Data Sources Ingested
              </div>
              <ul className="space-y-1 text-xs text-slate-700">
                {selectedExplainabilityTrace.dataSourcesQueried.map(ds => (
                  <li key={ds} className="font-mono bg-white px-2 py-1 rounded border border-slate-200">
                    {ds}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Compute & Scan Telemetry
              </div>
              <div className="space-y-1 text-xs text-slate-700">
                <div className="flex justify-between bg-white px-2 py-1 rounded border border-slate-200">
                  <span className="text-slate-500">Query Latency:</span>
                  <span className="font-mono font-bold">{selectedExplainabilityTrace.computationTimeMs} ms</span>
                </div>
                <div className="flex justify-between bg-white px-2 py-1 rounded border border-slate-200">
                  <span className="text-slate-500">Scanned Records:</span>
                  <span className="font-mono font-bold">{selectedExplainabilityTrace.sourceRecordCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Applied Filters */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-600" />
              Applied Multi-Tenant & Boundary Filters
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedExplainabilityTrace.appliedFilters.map(f => (
                <div key={f.field} className="bg-white border border-slate-200 p-2 rounded-lg text-xs flex justify-between">
                  <span className="text-slate-500">{f.field}:</span>
                  <span className="font-semibold text-slate-800">{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={closeExplainability}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close Trace Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

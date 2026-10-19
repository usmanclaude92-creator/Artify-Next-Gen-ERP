import React from 'react';
import { useAdmin } from '../../services/administrationStore';
import { UserCheck, Shield, ChevronDown, RefreshCw, KeyRound, AlertOctagon } from 'lucide-react';

export const ActorSimulationBar: React.FC = () => {
  const { activeActor, setActiveActor, enterpriseActors, formatCurrency } = useAdmin();

  return (
    <div className="bg-gradient-to-r from-slate-50 dark:from-slate-900 via-slate-100 dark:via-slate-800 to-indigo-50 dark:to-indigo-950 text-slate-900 dark:text-white rounded-2xl p-4 shadow-sm border border-slate-300/60 dark:border-slate-700/60">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left info badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                Workflow Identity Context (SoD Simulator)
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                SoD Enforced
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="font-bold text-sm text-slate-900 dark:text-white">{activeActor.name}</span>
              <span className="text-xs text-slate-700 dark:text-slate-300">({activeActor.role})</span>
              <span className="text-xs text-slate-600 dark:text-slate-400">• {activeActor.department}</span>
              <span className="text-xs text-indigo-800 dark:text-indigo-200 font-mono bg-indigo-50 dark:bg-indigo-900/60 px-2 py-0.5 rounded border border-indigo-700/50">
                DoA Limit: {activeActor.approvalLimitOMR >= 999999 ? 'Unlimited / Board' : formatCurrency(activeActor.approvalLimitOMR)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Actor Switcher & Guidance */}
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-xs text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">
            Switch Operating Actor:
          </label>
          <select
            value={activeActor.userId}
            onChange={(e) => {
              const actor = enterpriseActors.find(a => a.userId === e.target.value);
              if (actor) setActiveActor(actor);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer shadow-inner"
          >
            {enterpriseActors.map(actor => (
              <option key={actor.userId} value={actor.userId} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {actor.name} — {actor.role} (Limit: {actor.approvalLimitOMR >= 999999 ? 'No Limit' : `${actor.approvalLimitOMR} OMR`})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

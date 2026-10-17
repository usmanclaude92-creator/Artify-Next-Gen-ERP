import React, { useState } from 'react';
import { Target, Plus, Building2, Calendar, CheckCircle2, ShieldAlert, Award } from 'lucide-react';
import { useBI } from '../../services/biStore';
import { DemoDataBanner } from '../common/DemoDataBanner';
import { KPITarget } from '../../types';

export const KpiTargetsView: React.FC = () => {
  const { kpiTargets, kpis, addKpiTarget } = useBI();
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTarget, setNewTarget] = useState<Partial<KPITarget>>({
    kpiId: kpis[0]?.id || 'kpi-01',
    companyName: 'Artify Group Holdings',
    period: 'FY2026',
    baselineTarget: 15.0,
    stretchTarget: 18.0,
    minThreshold: 12.0,
    maxThreshold: 22.0,
    effectiveDate: '2026-01-01',
    expiryDate: '2026-12-31',
    status: 'Active'
  });

  const handleCreateTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const selKpi = kpis.find(k => k.id === newTarget.kpiId) || kpis[0];
    const created: KPITarget = {
      id: `tgt-${Date.now()}`,
      kpiId: selKpi.id,
      kpiCode: selKpi.code,
      kpiName: selKpi.name,
      companyId: 'comp-01',
      companyName: newTarget.companyName || 'Artify Group Holdings',
      period: newTarget.period || 'FY2026',
      baselineTarget: Number(newTarget.baselineTarget) || 0,
      stretchTarget: Number(newTarget.stretchTarget) || 0,
      minThreshold: Number(newTarget.minThreshold) || 0,
      maxThreshold: Number(newTarget.maxThreshold) || 0,
      effectiveDate: newTarget.effectiveDate || '2026-01-01',
      expiryDate: newTarget.expiryDate || '2026-12-31',
      status: 'Active'
    };
    addKpiTarget(created);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <DemoDataBanner moduleSource="Module 02.06 Strategic KPI Target Setting" />

      {/* Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Corporate & Operating Entity Target Allocations
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Set baseline hurdles, stretch objectives, and warning thresholds across fiscal planning windows.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Assign Target
        </button>
      </div>

      {/* Target Schedules Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400">
                <th className="py-2.5 px-3 font-semibold">KPI Reference</th>
                <th className="py-2.5 px-3 font-semibold">Entity Scope</th>
                <th className="py-2.5 px-3 font-semibold">Fiscal Period</th>
                <th className="py-2.5 px-3 font-semibold text-right">Baseline Target</th>
                <th className="py-2.5 px-3 font-semibold text-right">Stretch Target</th>
                <th className="py-2.5 px-3 font-semibold text-center">Safety Range</th>
                <th className="py-2.5 px-3 font-semibold text-center">Effective Range</th>
                <th className="py-2.5 px-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {kpiTargets.map(tgt => (
                <tr key={tgt.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">{tgt.kpiName}</span>
                    <span className="text-[10px] font-mono text-indigo-700 dark:text-indigo-300">{tgt.kpiCode}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium">{tgt.companyName}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">{tgt.period}</td>
                  <td className="py-3 px-3 font-mono font-bold text-right text-indigo-900 dark:text-indigo-100">{tgt.baselineTarget}</td>
                  <td className="py-3 px-3 font-mono font-bold text-right text-emerald-700 dark:text-emerald-300">
                    <span className="inline-flex items-center gap-1">
                      <Award className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      {tgt.stretchTarget}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-center text-slate-500 dark:text-slate-400">
                    [{tgt.minThreshold} - {tgt.maxThreshold}]
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-center text-slate-600 dark:text-slate-400">
                    {tgt.effectiveDate} ~ {tgt.expiryDate}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {tgt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Target Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Assign Strategic KPI Target</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-500 dark:text-slate-400 text-xs">
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateTarget} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Select Master KPI</label>
                <select
                  value={newTarget.kpiId}
                  onChange={e => setNewTarget(prev => ({ ...prev, kpiId: e.target.value }))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  {kpis.map(k => (
                    <option key={k.id} value={k.id}>
                      {k.code} - {k.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Legal Entity Scope</label>
                <select
                  value={newTarget.companyName}
                  onChange={e => setNewTarget(prev => ({ ...prev, companyName: e.target.value }))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <option value="Artify Group Holdings">Artify Group Holdings</option>
                  <option value="Artify Manufacturing LLC">Artify Manufacturing LLC</option>
                  <option value="Artify Engineering Contracting">Artify Engineering Contracting</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Baseline Target</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newTarget.baselineTarget}
                    onChange={e => setNewTarget(prev => ({ ...prev, baselineTarget: Number(e.target.value) }))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Stretch Target</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newTarget.stretchTarget}
                    onChange={e => setNewTarget(prev => ({ ...prev, stretchTarget: Number(e.target.value) }))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Effective Date</label>
                  <input
                    type="date"
                    value={newTarget.effectiveDate}
                    onChange={e => setNewTarget(prev => ({ ...prev, effectiveDate: e.target.value }))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newTarget.expiryDate}
                    onChange={e => setNewTarget(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Save Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

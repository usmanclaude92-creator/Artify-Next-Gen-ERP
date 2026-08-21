// ==========================================
// 16.07 COST ACCOUNTING VIEW
// Cost Centers, Profit Centers, Shared Overhead Allocation Cycles & Cost Analysis
// ==========================================

import React, { useState } from 'react';
import { useFinanceStore } from '../../services/financeStore';
import { CostCenter, ProfitCenter, CostAllocationCycle } from '../../types/financeTypes';
import {
  PieChart,
  Plus,
  Play,
  Search,
  CheckCircle2,
  AlertCircle,
  Building2,
  TrendingUp,
  TrendingDown,
  Layers,
  ArrowRight,
  RefreshCw,
  Sliders,
  DollarSign
} from 'lucide-react';

export const CostAccountingView: React.FC = () => {
  const {
    currency,
    costCenters,
    profitCenters,
    costAllocationCycles,
    executeCostAllocation
  } = useFinanceStore();

  const [activeTab, setActiveTab] = useState<'cost-centers' | 'profit-centers' | 'allocation-cycles'>('profit-centers');
  const [allocationSuccess, setAllocationSuccess] = useState(false);

  const totalCostCenterBudget = costCenters.reduce((s, c) => s + c.budgetAllocated, 0);
  const totalCostCenterActual = costCenters.reduce((s, c) => s + c.actualCost, 0);
  const totalProfitCenterRev = profitCenters.reduce((s, p) => s + p.revenue, 0);
  const totalProfitCenterNet = profitCenters.reduce((s, p) => s + p.netProfit, 0);

  const handleRunAllocation = (id: string) => {
    executeCostAllocation(id);
    setAllocationSuccess(true);
    setTimeout(() => setAllocationSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <PieChart className="w-3.5 h-3.5" />
            Module 16.07 — Cost & Management Accounting
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Cost Centers, Profit Centers & Overhead Allocation</h2>
          <p className="text-sm text-slate-400">
            Multi-dimensional cost distribution, activity-based costing (ABC), shared corporate overhead absorption cycles, and business unit profitability.
          </p>
        </div>

        <div className="text-right bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
          <span className="text-xs text-slate-400 font-medium block">Total Business Unit Revenue</span>
          <p className="text-2xl font-bold font-mono text-teal-400">
            {currency} {totalProfitCenterRev.toLocaleString()}
          </p>
          <span className="text-[10px] text-teal-300">
            Net Margin: {((totalProfitCenterNet / totalProfitCenterRev) * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {allocationSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 p-4 rounded-2xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Shared Overhead Allocation Cycle executed successfully! Secondary costs distributed to target Profit Centers.
            </span>
          </div>
          <span className="font-mono font-bold">ALLOC_CYCLE_POSTED</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('profit-centers')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'profit-centers'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Profit Centers & Margins ({profitCenters.length})
          </button>
          <button
            onClick={() => setActiveTab('cost-centers')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'cost-centers'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Departmental Cost Centers ({costCenters.length})
          </button>
          <button
            onClick={() => setActiveTab('allocation-cycles')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'allocation-cycles'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Cost Allocation Cycles ({costAllocationCycles.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Profit Centers */}
      {activeTab === 'profit-centers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {profitCenters.map(pc => (
              <div
                key={pc.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-teal-500/50 transition-all space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                    <PieChart className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    {pc.code}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{pc.name}</h3>
                  <p className="text-xs text-slate-500">Unit: {pc.businessUnit} • Lead: {pc.manager}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Operating Revenue:</span>
                    <strong className="text-slate-900 dark:text-white">{currency} {pc.revenue.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Direct Production Costs:</span>
                    <span className="text-red-500">- {currency} {pc.directCosts.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Allocated HQ Overhead:</span>
                    <span className="text-amber-500">- {currency} {pc.allocatedOverhead.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-teal-600 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="font-sans">Net Contribution Margin:</span>
                    <span>{currency} {pc.netProfit.toLocaleString()} ({pc.marginPercent}%)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Cost Centers */}
      {activeTab === 'cost-centers' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Departmental Cost Center Register</h3>
              <p className="text-xs text-slate-500">Responsibility accounting and budget variance analysis</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 font-sans font-semibold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Cost Center Title</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Manager</th>
                  <th className="py-3 px-4 text-right">Budget Allocated</th>
                  <th className="py-3 px-4 text-right">Actual Incurred</th>
                  <th className="py-3 px-4 text-right">Favorable Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {costCenters.map(cc => (
                  <tr key={cc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-teal-600">{cc.code}</td>
                    <td className="py-3 px-4 font-sans font-medium text-slate-900 dark:text-white">{cc.name}</td>
                    <td className="py-3 px-4 font-sans text-slate-600 dark:text-slate-400">{cc.department}</td>
                    <td className="py-3 px-4 font-sans text-slate-700 dark:text-slate-300">{cc.manager}</td>
                    <td className="py-3 px-4 text-right text-slate-900 dark:text-white">{currency} {cc.budgetAllocated.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-slate-900 dark:text-white">{currency} {cc.actualCost.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600">
                      + {currency} {cc.variance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Cost Allocation Cycles */}
      {activeTab === 'allocation-cycles' && (
        <div className="space-y-4">
          {costAllocationCycles.map(cycle => (
            <div
              key={cycle.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{cycle.cycleName}</h3>
                  <p className="text-xs text-slate-500">
                    Source Cost Pool: <strong>{cycle.sourceCostCenterName}</strong> • Basis: <strong>{cycle.allocationMethod}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-400 font-sans">Pool Amount</span>
                    <p className="text-base font-bold text-slate-900 dark:text-white">{currency} {cycle.totalPoolAmount.toLocaleString()}</p>
                  </div>

                  <button
                    onClick={() => handleRunAllocation(cycle.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Allocation Cycle</span>
                  </button>
                </div>
              </div>

              {/* Target Distribution Grid */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Profit Center Distribution:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {cycle.targets.map((tgt, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
                      <span className="font-bold text-slate-900 dark:text-white block truncate">{tgt.profitCenterName}</span>
                      <div className="flex justify-between mt-2 font-mono">
                        <span className="text-teal-600 font-bold">{tgt.sharePercent}% Share</span>
                        <strong className="text-slate-900 dark:text-white">{currency} {tgt.allocatedAmount.toLocaleString()}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 15.05 CONTRACT FINANCIAL MANAGEMENT VIEW
// Retention Ledger, Advance Recovery, Contract Costing (EVM) & Profitability
// ==========================================

import React, { useState } from 'react';
import { useConstructionStore } from '../../services/constructionStore';
import {
  DollarSign,
  PieChart,
  TrendingUp,
  Percent,
  Calendar,
  Lock,
  RefreshCw,
  BarChart3,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Building
} from 'lucide-react';

export const ContractFinancialView: React.FC = () => {
  const {
    selectedContractId,
    contracts,
    ipcs,
    currency
  } = useConstructionStore();

  const [activeTab, setActiveTab] = useState<'profitability' | 'costing-evm' | 'retention' | 'advance-recovery'>('profitability');

  const selectedContract = contracts.find(c => c.id === selectedContractId) || contracts[0];

  // Financial Calculations for Selected Contract
  const originalVal = selectedContract?.originalContractValue || 0;
  const variationsVal = selectedContract?.approvedVariationsValue || 0;
  const revisedVal = selectedContract?.revisedContractValue || 0;

  // EVM & Costing Metrics
  const plannedValuePV = revisedVal * 0.70; // 70% planned to date
  const earnedValueEV = revisedVal * (selectedContract?.progressPhysicalPct / 100); // physical progress
  const actualCostAC = earnedValueEV / 1.06; // CPI = 1.06
  const costVarianceCV = earnedValueEV - actualCostAC;
  const scheduleVarianceSV = earnedValueEV - plannedValuePV;
  const cpi = earnedValueEV / (actualCostAC || 1);
  const spi = earnedValueEV / (plannedValuePV || 1);
  const estimateAtCompletionEAC = revisedVal / cpi;
  const forecastedGrossProfit = revisedVal - estimateAtCompletionEAC;
  const forecastedMarginPct = (forecastedGrossProfit / revisedVal) * 100;

  // Retention & Advance metrics
  const maxRetentionCap = revisedVal * (selectedContract?.retentionCapPercentage / 100);
  const cumulativeRetentionHeld = Math.min(maxRetentionCap, 1425000);
  const totalAdvancePaid = revisedVal * (selectedContract?.advancePaymentPercentage / 100);
  const cumulativeAdvanceRecovered = 2098000;
  const remainingAdvance = Math.max(0, totalAdvancePaid - cumulativeAdvanceRecovered);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <DollarSign className="w-3.5 h-3.5" />
            Module 15.05 — Contract Financial Management
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Contract Costing, EVM & Margin Analytics</h2>
          <p className="text-sm text-slate-400">
            Earned Value Management (EVM), cost & schedule performance indexes (CPI/SPI), retention escrow accounts, and advance payment recovery schedules.
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl text-right">
          <span className="text-xs text-slate-400 font-medium">Forecasted Gross Margin</span>
          <p className="text-2xl font-bold text-emerald-400 font-mono mt-0.5">
            {forecastedMarginPct.toFixed(1)}%
          </p>
          <p className="text-[11px] text-slate-400 font-mono">Profit: {currency} {(forecastedGrossProfit / 1000000).toFixed(2)}M</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('profitability')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'profitability'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Contract Profitability & Margins
          </button>
          <button
            onClick={() => setActiveTab('costing-evm')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'costing-evm'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Costing & Earned Value (EVM)
          </button>
          <button
            onClick={() => setActiveTab('retention')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'retention'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Retention Money Ledger
          </button>
          <button
            onClick={() => setActiveTab('advance-recovery')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'advance-recovery'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Advance Payment Recovery Schedule
          </button>
        </div>
      </div>

      {/* Tab 1: Profitability */}
      {activeTab === 'profitability' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500">Contract Final Revenue</span>
              <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {currency} {revisedVal.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 font-mono">Original: {currency} {originalVal.toLocaleString()}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500">Estimated Cost at Completion (EAC)</span>
              <p className="text-xl font-bold font-mono text-blue-600">
                {currency} {Math.round(estimateAtCompletionEAC).toLocaleString()}
              </p>
              <p className="text-[11px] text-emerald-600">Under original budget baseline</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500">Forecasted Gross Profit</span>
              <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {currency} {Math.round(forecastedGrossProfit).toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400">Target Margin: 12.0%</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500">Certified Billed to Date</span>
              <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {currency} {ipcs[ipcs.length - 1]?.grossCertifiedCumulativeTotal.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400">Financial Progress: {selectedContract.progressFinancialPct}%</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Revenue & Margin Breakdown ({selectedContract.projectName})
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold pb-1">
                  <span>Gross Profit Margin Allocation ({forecastedMarginPct.toFixed(1)}%)</span>
                  <span className="text-emerald-600 font-mono">{currency} {Math.round(forecastedGrossProfit).toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden flex">
                  <div className="bg-emerald-500 h-full" style={{ width: `${forecastedMarginPct}%` }} title="Gross Margin" />
                  <div className="bg-blue-500 h-full" style={{ width: `${100 - forecastedMarginPct}%` }} title="Direct Project Execution Cost" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Costing & EVM */}
      {activeTab === 'costing-evm' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500">Cost Performance Index (CPI)</span>
              <p className="text-2xl font-bold font-mono text-emerald-600 mt-1">{cpi.toFixed(2)}</p>
              <p className="text-[11px] text-slate-400">&gt; 1.00 indicates under-budget performance</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500">Schedule Performance Index (SPI)</span>
              <p className="text-2xl font-bold font-mono text-amber-600 mt-1">{spi.toFixed(2)}</p>
              <p className="text-[11px] text-slate-400">0.98 on critical path alignment</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500">Cost Variance (CV = EV - AC)</span>
              <p className="text-2xl font-bold font-mono text-emerald-600 mt-1">
                +{currency} {(costVarianceCV / 1000).toFixed(0)}k
              </p>
              <p className="text-[11px] text-emerald-600">Positive cost favorability</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500">Schedule Variance (SV = EV - PV)</span>
              <p className="text-2xl font-bold font-mono text-amber-600 mt-1">
                -{currency} {Math.abs(scheduleVarianceSV / 1000).toFixed(0)}k
              </p>
              <p className="text-[11px] text-amber-600">Recoverable via accelerated fitout</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Earned Value Table (EVM Standards)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Metric</th>
                    <th className="py-3 px-4">Formula / Source</th>
                    <th className="py-3 px-4 text-right">Value ({currency})</th>
                    <th className="py-3 px-4">Performance Interpretation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Planned Value (PV / BCWS)</td>
                    <td className="py-3 px-4 font-mono text-slate-500">Baseline Target Progress (70%)</td>
                    <td className="py-3 px-4 text-right font-mono font-bold">{plannedValuePV.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-500">Scheduled baseline work</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Earned Value (EV / BCWP)</td>
                    <td className="py-3 px-4 font-mono text-slate-500">Actual Physical Progress (68.5%)</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-blue-600">{earnedValueEV.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-500">Physical work certified</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Actual Cost (AC / ACWP)</td>
                    <td className="py-3 px-4 font-mono text-slate-500">Incurred Cost Ledger</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">{Math.round(actualCostAC).toLocaleString()}</td>
                    <td className="py-3 px-4 text-emerald-600 font-semibold">Under Budget by OMR 1.15M</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Retention */}
      {activeTab === 'retention' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500">Total Retention Deductions Capped (5%)</span>
              <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {currency} {maxRetentionCap.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400">10% per IPC capped at 5% of Contract</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500">Stage 1 Release (50% at TOC)</span>
              <p className="text-xl font-bold font-mono text-blue-600">
                {currency} {(maxRetentionCap * 0.5).toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400">Due upon Taking-Over Certificate</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500">Stage 2 Final Release (50% at DLP)</span>
              <p className="text-xl font-bold font-mono text-emerald-600">
                {currency} {(maxRetentionCap * 0.5).toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400">Due after 24-month warranty</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Advance Recovery */}
      {activeTab === 'advance-recovery' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500">Total Mobilization Advance Received</span>
              <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {currency} {totalAdvancePaid.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400">10% secured by Bank Guarantee</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500">Cumulative Recovered from IPCs</span>
              <p className="text-xl font-bold font-mono text-emerald-600">
                {currency} {cumulativeAdvanceRecovered.toLocaleString()}
              </p>
              <p className="text-[11px] text-emerald-600">73.6% amortized</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500">Remaining Advance Balance</span>
              <p className="text-xl font-bold font-mono text-amber-600">
                {currency} {remainingAdvance.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400">Full recovery targeted by IPC-12</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

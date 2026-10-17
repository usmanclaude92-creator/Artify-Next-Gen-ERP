// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 10.06: PROJECT PERFORMANCE & EVA
// Earned Value Management (EVM), Profitability, P&L, Cash Flow, Commitments
// ==========================================

import React, { useState } from 'react';
import { useProjectStore } from '../../services/projectStore';
import {
  TrendingUp,
  Activity,
  DollarSign,
  PieChart,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  TrendingDown,
  BarChart2,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';

export const ProjectPerformanceView: React.FC = () => {
  const {
    selectedProject,
    getProjectEvmMetrics,
    getProjectPnL,
    getProjectCashFlow,
    purchaseOrders,
    subcontracts,
    purchaseRequisitions
  } = useProjectStore();

  const [activeTab, setActiveTab] = useState<'EVM_METRICS' | 'PROJECT_PROFITABILITY' | 'PROJECT_PNL' | 'PROJECT_CASHFLOW' | 'COMMITMENTS'>('EVM_METRICS');

  const evm = getProjectEvmMetrics(selectedProject.id);
  const pnl = getProjectPnL(selectedProject.id);
  const cashFlow = getProjectCashFlow(selectedProject.id);

  // Commitments
  const openPos = purchaseOrders.filter(po => po.projectId === selectedProject.id);
  const openSubs = subcontracts.filter(sub => sub.projectId === selectedProject.id);
  const pendingPrs = purchaseRequisitions.filter(pr => pr.projectId === selectedProject.id && pr.status === 'SUBMITTED_FOR_PM_APPROVAL');

  const totalPoCommitment = openPos.reduce((sum, po) => sum + po.subtotalAmount, 0);
  const totalSubCommitment = openSubs.reduce((sum, s) => sum + s.contractTotalValue, 0);
  const totalPrCommitment = pendingPrs.reduce((sum, pr) => sum + pr.totalEstimatedAmount, 0);

  return (
    <div id="project-performance-module" className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl text-slate-900 dark:text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-widest text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                10.06 — Project Performance & Earned Value (EVM)
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                {selectedProject.projectCode}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Earned Value Management (EVM), Project P&L, S-Curves & Commitments
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
            evm.healthStatus === 'ON_TRACK'
              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
              : evm.healthStatus === 'COST_OVERRUN_RISK'
              ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
              : 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
          }`}>
            EVM Index: {evm.healthStatus.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* EVM Top KPI Quad Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">Cost Performance Index (CPI)</span>
            <span className={`text-xs font-bold font-mono ${evm.cpi >= 1.0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {evm.cpi >= 1.0 ? 'Under Budget' : 'Cost Overrun'}
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
            {evm.cpi}
          </p>
          <span className="text-[11px] text-slate-600 dark:text-slate-400">CPI = Earned Value (EV) / Actual Cost (AC)</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">Schedule Performance Index (SPI)</span>
            <span className={`text-xs font-bold font-mono ${evm.spi >= 1.0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
              {evm.spi >= 1.0 ? 'Ahead of Sched.' : 'Minor Delay'}
            </span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
            {evm.spi}
          </p>
          <span className="text-[11px] text-slate-600 dark:text-slate-400">SPI = Earned Value (EV) / Planned Value (PV)</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">Estimate at Completion (EAC)</span>
          <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 font-mono mt-1">
            {evm.currency} {evm.estimateAtCompletion.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-600 dark:text-slate-400">Variance at Completion (VAC): +{evm.currency} {evm.varianceAtCompletion.toLocaleString()}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">Gross Margin Profitability</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            {pnl.grossProfitMarginPercent}%
          </p>
          <span className="text-[11px] text-slate-600 dark:text-slate-400">Gross Profit: {selectedProject.currency} {pnl.grossProfitAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('EVM_METRICS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'EVM_METRICS'
              ? 'bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Earned Value Analysis (EVA)</span>
        </button>
        <button
          onClick={() => setActiveTab('PROJECT_PROFITABILITY')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'PROJECT_PROFITABILITY'
              ? 'bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>Project Profitability Matrix</span>
        </button>
        <button
          onClick={() => setActiveTab('PROJECT_PNL')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'PROJECT_PNL'
              ? 'bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Project Income Statement (P&L)</span>
        </button>
        <button
          onClick={() => setActiveTab('PROJECT_CASHFLOW')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'PROJECT_CASHFLOW'
              ? 'bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Project Liquidity & Cash Flow</span>
        </button>
        <button
          onClick={() => setActiveTab('COMMITMENTS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'COMMITMENTS'
              ? 'bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Encumbered Commitments</span>
        </button>
      </div>

      {/* TAB 1: EVM METRICS */}
      {activeTab === 'EVM_METRICS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">ANSI/PMI Standard Earned Value Metrics (BCWS / BCWP / ACWP)</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Calculated in real-time from direct job cost ledger entries and physical engineering progress</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="text-xs text-slate-600 dark:text-slate-400 uppercase font-semibold">Core Cost & Progress Benchmarks</div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Budget At Completion (BAC):</span>
                  <span className="font-bold text-slate-900 dark:text-white">{evm.currency} {evm.budgetAtCompletion.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Planned Value (PV / BCWS):</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{evm.currency} {evm.plannedValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Earned Value (EV / BCWP):</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{evm.currency} {evm.earnedValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Actual Cost (AC / ACWP):</span>
                  <span className="font-bold text-amber-700 dark:text-amber-400">{evm.currency} {evm.actualCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="text-xs text-slate-600 dark:text-slate-400 uppercase font-semibold">Variance Analysis</div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Cost Variance (CV = EV - AC):</span>
                  <span className={`font-bold ${evm.costVariance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {evm.costVariance >= 0 ? '+' : ''}{evm.currency} {evm.costVariance.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Schedule Variance (SV = EV - PV):</span>
                  <span className={`font-bold ${evm.scheduleVariance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                    {evm.scheduleVariance >= 0 ? '+' : ''}{evm.currency} {evm.scheduleVariance.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Variance at Completion (VAC):</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">+{evm.currency} {evm.varianceAtCompletion.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">TCPI Target:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{evm.toCompletePerformanceIndex}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="text-xs text-slate-600 dark:text-slate-400 uppercase font-semibold">Forecasts & Completion Estimates</div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Estimate at Completion (EAC):</span>
                  <span className="font-extrabold text-purple-600 dark:text-purple-400">{evm.currency} {evm.estimateAtCompletion.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Estimate to Complete (ETC):</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{evm.currency} {evm.estimateToComplete.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Project Physical Progress:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedProject.overallProgressPercent}%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Contract Retention Cap:</span>
                  <span className="font-bold text-amber-700 dark:text-amber-400">{selectedProject.retentionWithheldPercent}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROJECT PROFITABILITY MATRIX */}
      {activeTab === 'PROJECT_PROFITABILITY' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Project Profitability & Margin Decomposition</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">Comparing earned contract revenue against direct cost centers</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
              Gross Margin: {pnl.grossProfitMarginPercent}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cost Center Breakdown */}
            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Cost of Work Done (COWD) Breakdown</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                    <span>Direct Materials ({selectedProject.currency} {pnl.materialDirectCost.toLocaleString()})</span>
                    <span className="font-mono font-bold">
                      {pnl.totalCostOfWorkDone > 0 ? Math.round((pnl.materialDirectCost / pnl.totalCostOfWorkDone) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '38%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                    <span>Direct Site Labor ({selectedProject.currency} {pnl.laborDirectCost.toLocaleString()})</span>
                    <span className="font-mono font-bold">
                      {pnl.totalCostOfWorkDone > 0 ? Math.round((pnl.laborDirectCost / pnl.totalCostOfWorkDone) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '22%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                    <span>Heavy Equipment Plant ({selectedProject.currency} {pnl.equipmentDirectCost.toLocaleString()})</span>
                    <span className="font-mono font-bold">
                      {pnl.totalCostOfWorkDone > 0 ? Math.round((pnl.equipmentDirectCost / pnl.totalCostOfWorkDone) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                    <span>Specialist Subcontractors ({selectedProject.currency} {pnl.subcontractorDirectCost.toLocaleString()})</span>
                    <span className="font-mono font-bold">
                      {pnl.totalCostOfWorkDone > 0 ? Math.round((pnl.subcontractorDirectCost / pnl.totalCostOfWorkDone) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '17%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Profit Margin Summary */}
            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Project Commercial Margin Summary</h3>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Earned Revenue Recognized:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedProject.currency} {pnl.contractRevenueRecognized.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Total Cost of Work Done (COWD):</span>
                  <span className="font-bold text-amber-700 dark:text-amber-400">-{selectedProject.currency} {pnl.totalCostOfWorkDone.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Gross Profit:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">+{selectedProject.currency} {pnl.grossProfitAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Net Contribution Margin %:</span>
                  <span className="font-extrabold text-purple-600 dark:text-purple-400 text-sm">{pnl.netMarginPercent}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROJECT P&L STATEMENT */}
      {activeTab === 'PROJECT_PNL' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Project Profit & Loss Statement (Income Statement)</h2>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">Reporting Period: {pnl.period}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Line Item / General Ledger Mapping</th>
                  <th className="py-3 px-4 text-right">Inception to Date ({selectedProject.currency})</th>
                  <th className="py-3 px-4 text-right">% of Recognized Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 font-mono">
                <tr className="bg-slate-50/40 dark:bg-slate-950/40">
                  <td className="py-3 px-4 font-sans font-bold text-slate-900 dark:text-white">1. Contract Revenue (POCM Basis)</td>
                  <td className="py-3 px-4 text-right font-extrabold text-emerald-600 dark:text-emerald-400">{pnl.contractRevenueRecognized.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">100.0%</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 pl-8 font-sans text-slate-700 dark:text-slate-300">Direct Material Consumption (CC-MAT)</td>
                  <td className="py-2.5 px-4 text-right text-rose-700 dark:text-rose-300">({pnl.materialDirectCost.toLocaleString()})</td>
                  <td className="py-2.5 px-4 text-right text-slate-600 dark:text-slate-400">
                    {pnl.contractRevenueRecognized > 0 ? (Math.round((pnl.materialDirectCost / pnl.contractRevenueRecognized) * 1000) / 10) : 0}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 pl-8 font-sans text-slate-700 dark:text-slate-300">Direct Site Labor & Timesheets (CC-LAB)</td>
                  <td className="py-2.5 px-4 text-right text-rose-700 dark:text-rose-300">({pnl.laborDirectCost.toLocaleString()})</td>
                  <td className="py-2.5 px-4 text-right text-slate-600 dark:text-slate-400">
                    {pnl.contractRevenueRecognized > 0 ? (Math.round((pnl.laborDirectCost / pnl.contractRevenueRecognized) * 1000) / 10) : 0}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 pl-8 font-sans text-slate-700 dark:text-slate-300">Heavy Equipment & Plant Hire (CC-EQP)</td>
                  <td className="py-2.5 px-4 text-right text-rose-700 dark:text-rose-300">({pnl.equipmentDirectCost.toLocaleString()})</td>
                  <td className="py-2.5 px-4 text-right text-slate-600 dark:text-slate-400">
                    {pnl.contractRevenueRecognized > 0 ? (Math.round((pnl.equipmentDirectCost / pnl.contractRevenueRecognized) * 1000) / 10) : 0}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 pl-8 font-sans text-slate-700 dark:text-slate-300">Specialist Subcontractor Work (CC-SUB)</td>
                  <td className="py-2.5 px-4 text-right text-rose-700 dark:text-rose-300">({pnl.subcontractorDirectCost.toLocaleString()})</td>
                  <td className="py-2.5 px-4 text-right text-slate-600 dark:text-slate-400">
                    {pnl.contractRevenueRecognized > 0 ? (Math.round((pnl.subcontractorDirectCost / pnl.contractRevenueRecognized) * 1000) / 10) : 0}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 pl-8 font-sans text-slate-700 dark:text-slate-300">Allocated Site Overhead (CC-GEN)</td>
                  <td className="py-2.5 px-4 text-right text-rose-700 dark:text-rose-300">({pnl.siteOverheadAllocated.toLocaleString()})</td>
                  <td className="py-2.5 px-4 text-right text-slate-600 dark:text-slate-400">
                    {pnl.contractRevenueRecognized > 0 ? (Math.round((pnl.siteOverheadAllocated / pnl.contractRevenueRecognized) * 1000) / 10) : 0}%
                  </td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-950">
                  <td className="py-3 px-4 font-sans font-bold text-amber-700 dark:text-amber-400">Total Cost of Work Done (COWD)</td>
                  <td className="py-3 px-4 text-right font-bold text-amber-700 dark:text-amber-400">({pnl.totalCostOfWorkDone.toLocaleString()})</td>
                  <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">
                    {pnl.contractRevenueRecognized > 0 ? (Math.round((pnl.totalCostOfWorkDone / pnl.contractRevenueRecognized) * 1000) / 10) : 0}%
                  </td>
                </tr>
                <tr className="bg-purple-50 dark:bg-purple-950/40 border-t-2 border-purple-500">
                  <td className="py-3.5 px-4 font-sans font-extrabold text-slate-900 dark:text-white text-sm">Project Gross Profit</td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">{pnl.grossProfitAmount.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400 text-sm">{pnl.grossProfitMarginPercent}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PROJECT CASH FLOW */}
      {activeTab === 'PROJECT_CASHFLOW' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Project Cash Inflows & Outflows Statement</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">Cash received from client vs. disbursements to suppliers and labor</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
              Net Project Liquidity: +{selectedProject.currency} {cashFlow.cumulativeProjectLiquidity.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
            {/* Cash Inflows */}
            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-sans">Cash Inflows (Collections)</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Mobilization Advance Collected:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedProject.currency} {cashFlow.inflows.advancePaymentCollected.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Progress Claim Invoices Received:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedProject.currency} {cashFlow.inflows.progressClaimsReceived.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Retention Released:</span>
                  <span className="font-bold text-slate-600 dark:text-slate-400">{selectedProject.currency} 0</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-emerald-800/80 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  <span className="font-sans">Total Cash Inflows:</span>
                  <span>+{selectedProject.currency} {cashFlow.inflows.totalCashInflows.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Cash Outflows */}
            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider font-sans">Cash Outflows (Disbursements)</h3>
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Vendor Material Payments:</span>
                  <span className="font-bold text-slate-900 dark:text-white">-{selectedProject.currency} {cashFlow.outflows.vendorMaterialPayments.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Site Labor Payroll & Wages:</span>
                  <span className="font-bold text-slate-900 dark:text-white">-{selectedProject.currency} {cashFlow.outflows.siteLaborPayroll.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Equipment Rental Disbursements:</span>
                  <span className="font-bold text-slate-900 dark:text-white">-{selectedProject.currency} {cashFlow.outflows.equipmentRentalPayments.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Subcontractor Progress Payments:</span>
                  <span className="font-bold text-slate-900 dark:text-white">-{selectedProject.currency} {cashFlow.outflows.subcontractorDisbursements.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-rose-800/80 font-bold text-rose-600 dark:text-rose-400 text-sm">
                  <span className="font-sans">Total Cash Outflows:</span>
                  <span>-{selectedProject.currency} {cashFlow.outflows.totalCashOutflows.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: COMMITMENTS */}
      {activeTab === 'COMMITMENTS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Committed & Encumbered Cost Tracking</h2>
            <span className="text-xs text-slate-700 dark:text-slate-300 font-mono">
              Total Committed: <strong className="text-purple-600 dark:text-purple-400">{selectedProject.currency} {(totalPoCommitment + totalSubCommitment).toLocaleString()}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">Open Purchase Orders</span>
              <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-1">
                {selectedProject.currency} {totalPoCommitment.toLocaleString()}
              </p>
              <span className="text-[11px] text-blue-600 dark:text-blue-400">{openPos.length} Active POs with Suppliers</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">Subcontract Packages</span>
              <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-1">
                {selectedProject.currency} {totalSubCommitment.toLocaleString()}
              </p>
              <span className="text-[11px] text-purple-600 dark:text-purple-400">{openSubs.length} Executed Subcontract Agreements</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">Pending Requisitions</span>
              <p className="text-lg font-bold text-amber-700 dark:text-amber-400 font-mono mt-1">
                {selectedProject.currency} {totalPrCommitment.toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-600 dark:text-slate-400">{pendingPrs.length} PRs in Approval Pipeline</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

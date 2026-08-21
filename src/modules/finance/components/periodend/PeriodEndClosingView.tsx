// ==========================================
// 16.06 PERIOD-END ACCOUNTING VIEW
// Accruals, Prepayments, IFRS Provisions, Sub-ledger Soft/Hard Closing & Year-End Rollover
// ==========================================

import React, { useState } from 'react';
import { useFinanceStore } from '../../services/financeStore';
import { AccrualPrepayment, FiscalPeriod } from '../../types/financeTypes';
import {
  CalendarCheck,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  FileCheck,
  ShieldCheck,
  Flame,
  Plus
} from 'lucide-react';

export const PeriodEndClosingView: React.FC = () => {
  const {
    currency,
    fiscalPeriods,
    accrualsPrepayments,
    lockFiscalPeriod,
    triggerYearEndClosing
  } = useFinanceStore();

  const [activeTab, setActiveTab] = useState<'closing-matrix' | 'accruals-prepayments' | 'year-end'>('closing-matrix');
  const [selectedFiscalYear, setSelectedFiscalYear] = useState('2025');
  const [yearEndSuccess, setYearEndSuccess] = useState(false);

  const handleYearEndClose = () => {
    triggerYearEndClosing(selectedFiscalYear);
    setYearEndSuccess(true);
    setTimeout(() => setYearEndSuccess(false), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
            <CalendarCheck className="w-3.5 h-3.5" />
            Module 16.06 — Period-End Accounting
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Period-End Closing, Accruals & Year-End Rollover</h2>
          <p className="text-sm text-slate-400">
            Multi-subledger soft and hard period closing controls (AP, AR, Inventory, GL), auto-reversing accruals, prepayment amortization, and fiscal year closing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('year-end')}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-2xl shadow-lg transition-all cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Year-End Closing Assistant</span>
          </button>
        </div>
      </div>

      {yearEndSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 p-4 rounded-2xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Fiscal Year <strong>{selectedFiscalYear}</strong> successfully closed! All Revenue and Expense accounts zeroed and Net Income rolled into <strong>Retained Earnings (3020)</strong>.
            </span>
          </div>
          <span className="font-mono font-bold">YEAR_END_JV_COMMITTED</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('closing-matrix')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'closing-matrix'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Period Closing Matrix ({fiscalPeriods.length} Periods)
          </button>
          <button
            onClick={() => setActiveTab('accruals-prepayments')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'accruals-prepayments'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Accruals, Prepayments & Provisions ({accrualsPrepayments.length})
          </button>
          <button
            onClick={() => setActiveTab('year-end')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'year-end'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Fiscal Year-End Closing
          </button>
        </div>
      </div>

      {/* Tab 1: Period Closing Matrix */}
      {activeTab === 'closing-matrix' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Subledger Period Lock Matrix (FY 2026)</h3>
                <p className="text-xs text-slate-500">
                  Granular control to prevent unauthorized back-dated postings across AP, AR, Inventory and GL.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4">Fiscal Period</th>
                    <th className="py-3 px-4">Date Range</th>
                    <th className="py-3 px-4 text-center">Accounts Payable (AP)</th>
                    <th className="py-3 px-4 text-center">Accounts Receivable (AR)</th>
                    <th className="py-3 px-4 text-center">General Ledger (GL)</th>
                    <th className="py-3 px-4 text-center">Inventory & Costing</th>
                    <th className="py-3 px-4 text-right">Master Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {fiscalPeriods.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {p.periodName} ({p.periodCode})
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {p.startDate} to {p.endDate}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          p.apStatus === 'HARD_CLOSED' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        }`}>
                          {p.apStatus === 'HARD_CLOSED' ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />} {p.apStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          p.arStatus === 'HARD_CLOSED' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        }`}>
                          {p.arStatus === 'HARD_CLOSED' ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />} {p.arStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          p.glStatus === 'HARD_CLOSED' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        }`}>
                          {p.glStatus === 'HARD_CLOSED' ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />} {p.glStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          p.inventoryStatus === 'HARD_CLOSED' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        }`}>
                          {p.inventoryStatus === 'HARD_CLOSED' ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />} {p.inventoryStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {p.glStatus === 'OPEN' ? (
                          <button
                            onClick={() => lockFiscalPeriod(p.id, 'all', 'HARD_CLOSED')}
                            className="px-3 py-1 text-xs font-bold bg-red-600 hover:bg-red-500 text-white rounded-xl shadow cursor-pointer"
                          >
                            Hard Close Period
                          </button>
                        ) : (
                          <button
                            onClick={() => lockFiscalPeriod(p.id, 'all', 'OPEN')}
                            className="px-3 py-1 text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl cursor-pointer"
                          >
                            Reopen Period
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Accruals & Prepayments */}
      {activeTab === 'accruals-prepayments' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accrualsPrepayments.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-200">
                  {item.type}
                </span>
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                  {item.reference}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</h4>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  Schedule: {item.startDate} to {item.endDate}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Total Booking Amount:</span>
                  <strong>{currency} {item.totalAmount.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Monthly Amortization:</span>
                  <span className="text-purple-600">{currency} {item.monthlyAmortization.toLocaleString()}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Remaining Carrying Balance:</span>
                  <span className="text-emerald-600 font-bold">{currency} {item.remainingAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-400 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
                <span>Auto-Reversal: {item.autoReverse ? 'Enabled (Next Period 1st)' : 'No (Amortized)'}</span>
                <span className="text-emerald-500 font-bold">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Year-End Closing */}
      {activeTab === 'year-end' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm max-w-3xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Fiscal Year-End Closing Wizard</h3>
            <p className="text-xs text-slate-500">
              Automated year-end procedure: Zero all temporary Revenue & Expense accounts, calculate Net Income, and post closing transfer to <strong>Retained Earnings (Account 3020)</strong>.
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/40 p-5 rounded-2xl border border-purple-200 dark:border-purple-800 space-y-3 text-xs">
            <h4 className="font-bold text-purple-900 dark:text-purple-300">Year-End Closing Checklist:</h4>
            <div className="space-y-2 text-purple-800 dark:text-purple-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>All 12 monthly subledger periods (Jan–Dec) are Hard Closed.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Bank reconciliations complete with zero unreconciled variances.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Fixed asset depreciation and impairment tests fully executed.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Statutory 10% legal reserve calculated per Oman Commercial Companies Law.</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Select Fiscal Year to Close:</label>
              <select
                value={selectedFiscalYear}
                onChange={e => setSelectedFiscalYear(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl font-mono"
              >
                <option value="2025">Fiscal Year 2025 (FY 2025)</option>
                <option value="2026">Fiscal Year 2026 (FY 2026)</option>
              </select>
            </div>

            <div className="pt-5">
              <button
                onClick={handleYearEndClose}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Execute Year-End Close & Transfer to Retained Earnings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 16.05 FIXED ASSETS ACCOUNTING VIEW
// Asset Capitalization, IFRS IAS 16 Depreciation Runs, Disposals & GL Postings
// ==========================================

import React, { useState } from 'react';
import { useFinanceStore } from '../../services/financeStore';
import { FixedAssetEntry } from '../../types/financeTypes';
import {
  Shield,
  Plus,
  Play,
  Search,
  CheckCircle2,
  AlertCircle,
  Building2,
  Truck,
  Wrench,
  Calendar,
  Layers,
  ArrowRight,
  TrendingDown,
  FileText,
  DollarSign,
  Download
} from 'lucide-react';

export const FixedAssetsAccountingView: React.FC = () => {
  const {
    currency,
    fixedAssets,
    runDepreciationPosting
  } = useFinanceStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [deprRunSuccess, setDeprRunSuccess] = useState(false);

  const totalCostBasis = fixedAssets.reduce((sum, fa) => sum + fa.costBasis, 0);
  const totalAccumDepr = fixedAssets.reduce((sum, fa) => sum + fa.accumulatedDepreciation, 0);
  const totalNetBookValue = fixedAssets.reduce((sum, fa) => sum + fa.netBookValue, 0);
  const totalMonthlyDeprRate = fixedAssets
    .filter(fa => fa.status === 'ACTIVE')
    .reduce((sum, fa) => sum + fa.monthlyDepreciationRate, 0);

  const handleRunDepreciation = () => {
    runDepreciationPosting();
    setDeprRunSuccess(true);
    setTimeout(() => setDeprRunSuccess(false), 5000);
  };

  const filteredAssets = fixedAssets.filter(fa => {
    const matchesSearch = fa.assetName.toLowerCase().includes(searchTerm.toLowerCase()) || fa.assetCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || fa.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-slate-900 dark:text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            Module 16.05 — Fixed Assets Accounting
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Fixed Asset Capitalization & IAS 16 Depreciation</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Property, Plant & Equipment (PPE) capitalization schedules, straight-line and reducing balance monthly depreciation runs, and asset disposal gain/loss recognition.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunDepreciation}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-2xl shadow-lg transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Execute Monthly Depreciation Run</span>
          </button>
        </div>
      </div>

      {deprRunSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 p-4 rounded-2xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              Monthly IAS 16 Depreciation successfully calculated and posted to GL: <strong>Debit Depreciation Expense (6030) / Credit Accumulated Depreciation (1520)</strong> for <strong>{currency} {totalMonthlyDeprRate.toLocaleString()}</strong>.
            </span>
          </div>
          <span className="font-mono font-bold">JV-DEPRECIATION-POSTED</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Historical Cost Basis (PPE)</span>
          <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {currency} {totalCostBasis.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Asset Register Gross Value</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Accumulated Depreciation</span>
          <p className="text-xl font-bold font-mono text-red-600 dark:text-red-500 mt-1">
            - {currency} {totalAccumDepr.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Total Reserve to date</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Net Carrying Book Value (NBV)</span>
          <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {currency} {totalNetBookValue.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">IFRS Balance Sheet Asset Value</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Monthly Depreciation Expense</span>
          <p className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
            {currency} {totalMonthlyDeprRate.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Monthly P&L Impact</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          {['ALL', 'BUILDINGS', 'PLANT_MACHINERY', 'VEHICLES'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-600 dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search asset code or title..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Fixed Assets List */}
      <div className="space-y-3">
        {filteredAssets.map(fa => (
          <div
            key={fa.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-indigo-500/50 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-mono font-bold text-xs">
                  {fa.assetCode}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{fa.assetName}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Category: <strong>{fa.category}</strong> • Capitalized: <strong>{fa.capitalizationDate}</strong> • Useful Life: <strong>{fa.usefulLifeYears} Years</strong> ({fa.depreciationMethod})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium font-sans">Net Book Value (NBV)</span>
                  <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {currency} {fa.netBookValue.toLocaleString()}
                  </p>
                </div>

                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                  {fa.status}
                </span>
              </div>
            </div>

            {/* Asset Financials Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl font-mono">
              <div>
                <span className="text-slate-600 dark:text-slate-400 block text-[10px] font-sans">Gross Cost Basis:</span>
                <strong className="text-slate-900 dark:text-white">{currency} {fa.costBasis.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400 block text-[10px] font-sans">Residual Salvage Value:</span>
                <span className="text-slate-700 dark:text-slate-300">{currency} {fa.salvageValue.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400 block text-[10px] font-sans">Accumulated Depreciation:</span>
                <span className="text-red-600 dark:text-red-500 font-bold">- {currency} {fa.accumulatedDepreciation.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400 block text-[10px] font-sans">Monthly Depreciation Rate:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{currency} {fa.monthlyDepreciationRate.toLocaleString()}/mo</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

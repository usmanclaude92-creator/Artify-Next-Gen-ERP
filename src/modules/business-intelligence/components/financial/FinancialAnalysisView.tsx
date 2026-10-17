import React from 'react';
import {
  TrendingUp,
  PieChart as PieIcon,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useBI } from '../../services/biStore';
import { BiFilterBar } from '../common/BiFilterBar';
import { DemoDataBanner } from '../common/DemoDataBanner';
import { BiMetricCard } from '../common/BiMetricCard';

export const FinancialAnalysisView: React.FC = () => {
  const { financialRatios, formatCurrency } = useBI();

  return (
    <div className="space-y-6">
      <DemoDataBanner moduleSource="Module 02.12 Comprehensive Financial Analysis & DuPont Model" />
      <BiFilterBar />

      {/* DuPont Model Breakdown Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-indigo-300">
              Strategic Equity Decomposition
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">DuPont Model ROE Breakdown (14.0% Return on Equity)</h3>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
            ROE Target: 12.0% (Exceeding +200 bps)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-xs">
            <span className="text-xs text-indigo-200 block">1. Net Profit Margin</span>
            <span className="text-xl font-bold font-mono text-white mt-1 block">14.72%</span>
            <span className="text-[11px] text-slate-300 mt-1 block">Operating profitability per OMR revenue</span>
          </div>

          <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-xs">
            <span className="text-xs text-indigo-200 block">2. Asset Turnover Ratio</span>
            <span className="text-xl font-bold font-mono text-white mt-1 block">0.59x</span>
            <span className="text-[11px] text-slate-300 mt-1 block">Revenue generated per asset invested</span>
          </div>

          <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-xs">
            <span className="text-xs text-indigo-200 block">3. Financial Leverage Multiplier</span>
            <span className="text-xl font-bold font-mono text-white mt-1 block">1.60x</span>
            <span className="text-[11px] text-slate-300 mt-1 block">Assets / Equity equity multiplier</span>
          </div>
        </div>
      </div>

      {/* Ratios Table grouped by Category */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Financial Ratios & Benchmark Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Category</th>
                <th className="py-2.5 px-3 font-semibold">Ratio Name</th>
                <th className="py-2.5 px-3 font-semibold">Calculation Formula</th>
                <th className="py-2.5 px-3 font-semibold text-right">Actual Value</th>
                <th className="py-2.5 px-3 font-semibold text-right">Industry Benchmark</th>
                <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                <th className="py-2.5 px-3 font-semibold">Strategic Commentary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {financialRatios.map(r => (
                <tr key={r.name} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80">
                  <td className="py-3 px-3 font-medium text-slate-600 dark:text-slate-400">{r.category}</td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">{r.name}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">{r.formula}</td>
                  <td className="py-3 px-3 font-mono font-bold text-right text-indigo-900 dark:text-indigo-100">
                    {r.value} {r.unit}
                  </td>
                  <td className="py-3 px-3 font-mono text-right text-slate-600 dark:text-slate-400">
                    {r.benchmark} {r.unit}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400 text-[11px] max-w-xs">{r.commentary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

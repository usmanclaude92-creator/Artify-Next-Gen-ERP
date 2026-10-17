import React from 'react';
import { Layers, Download, Printer, TrendingUp, TrendingDown } from 'lucide-react';
import { useBI } from '../../services/biStore';
import { BiFilterBar } from '../common/BiFilterBar';
import { DemoDataBanner } from '../common/DemoDataBanner';
import { exportToCSV, triggerPrintReport } from '../../services/exportService';

export const BudgetVsActualView: React.FC = () => {
  const { budgetVsActual, formatCurrency, currencySymbol } = useBI();

  const handleExport = () => {
    exportToCSV('Budget_vs_Actual_Variance_Report', [
      { key: 'accountOrDept', label: 'Cost Center / Account' },
      { key: 'category', label: 'Category' },
      { key: 'annualBudgetOMR', label: 'Annual Budget (OMR)' },
      { key: 'ytdBudgetOMR', label: 'YTD Budget (OMR)' },
      { key: 'ytdActualOMR', label: 'YTD Actual (OMR)' },
      { key: 'varianceOMR', label: 'Variance (OMR)' },
      { key: 'variancePercent', label: 'Variance %' },
      { key: 'status', label: 'Status' },
      { key: 'explanation', label: 'Variance Root Cause' }
    ], budgetVsActual);
  };

  return (
    <div className="space-y-6">
      <DemoDataBanner moduleSource="Module 02.22 Budget vs Actual Variance Control" />
      <BiFilterBar
        onPrint={() => triggerPrintReport('Budget vs Actual Report')}
        onExport={handleExport}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-xs">
        <div className="pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Budget vs Actual Operating Variance Tracking
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Comprehensive line-item variance against Board-approved fiscal plan</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Account / Cost Center</th>
                <th className="py-2.5 px-3 font-semibold">Category</th>
                <th className="py-2.5 px-3 font-mono text-right">Annual Budget</th>
                <th className="py-2.5 px-3 font-mono text-right">YTD Budget</th>
                <th className="py-2.5 px-3 font-mono text-right">YTD Actual ({currencySymbol})</th>
                <th className="py-2.5 px-3 font-mono text-right">Variance ({currencySymbol})</th>
                <th className="py-2.5 px-3 font-mono text-right">Variance %</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 font-semibold">Executive Commentary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {budgetVsActual.map(row => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">{row.accountOrDept}</td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium">{row.category}</td>
                  <td className="py-3 px-3 font-mono text-right text-slate-500 dark:text-slate-400">{formatCurrency(row.annualBudgetOMR)}</td>
                  <td className="py-3 px-3 font-mono text-right text-slate-600 dark:text-slate-400">{formatCurrency(row.ytdBudgetOMR)}</td>
                  <td className="py-3 px-3 font-mono font-bold text-right text-slate-900 dark:text-slate-100">{formatCurrency(row.ytdActualOMR)}</td>
                  <td
                    className={`py-3 px-3 font-mono font-bold text-right ${
                      row.varianceOMR >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {row.varianceOMR > 0 ? '+' : ''}
                    {formatCurrency(row.varianceOMR)}
                  </td>
                  <td
                    className={`py-3 px-3 font-mono font-bold text-right ${
                      row.variancePercent >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {row.variancePercent > 0 ? '+' : ''}
                    {row.variancePercent}%
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.status === 'Favorable'
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                          : 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400 text-[11px] max-w-xs">{row.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

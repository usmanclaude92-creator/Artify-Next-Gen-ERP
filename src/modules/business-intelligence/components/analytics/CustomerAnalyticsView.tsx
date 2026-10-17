import React from 'react';
import { Briefcase, Download, Printer, ShieldAlert, Award } from 'lucide-react';
import { useBI } from '../../services/biStore';
import { BiFilterBar } from '../common/BiFilterBar';
import { DemoDataBanner } from '../common/DemoDataBanner';
import { exportToCSV, triggerPrintReport } from '../../services/exportService';

export const CustomerAnalyticsView: React.FC = () => {
  const { customerAnalytics, formatCurrency, currencySymbol } = useBI();

  const handleExport = () => {
    exportToCSV('Strategic_Customer_Analytics', [
      { key: 'customerCode', label: 'Customer Code' },
      { key: 'customerName', label: 'Customer Name' },
      { key: 'tier', label: 'Tier' },
      { key: 'lifetimeValueOMR', label: 'Customer Lifetime Value (OMR)' },
      { key: 'ytdRevenueOMR', label: 'YTD Revenue (OMR)' },
      { key: 'ytdGrossMarginPercent', label: 'Gross Margin %' },
      { key: 'currentReceivablesOMR', label: 'Receivables (OMR)' },
      { key: 'daysSalesOutstanding', label: 'DSO (Days)' },
      { key: 'concentrationPercent', label: 'Revenue Share %' },
      { key: 'churnRisk', label: 'Churn Risk' }
    ], customerAnalytics);
  };

  return (
    <div className="space-y-6">
      <DemoDataBanner moduleSource="Module 02.20 Strategic Customer & Client Analytics" />
      <BiFilterBar
        onPrint={() => triggerPrintReport('Customer Analytics')}
        onExport={handleExport}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-xs">
        <div className="pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Client Lifetime Value (CLV), Margin Contribution & Concentration Risk
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Tiered customer hierarchy, outstanding receivables exposure, and churn telemetry</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Customer / Entity Name</th>
                <th className="py-2.5 px-3 font-semibold">Tier Classification</th>
                <th className="py-2.5 px-3 font-mono text-right">Lifetime Value (CLV)</th>
                <th className="py-2.5 px-3 font-mono text-right">YTD Revenue ({currencySymbol})</th>
                <th className="py-2.5 px-3 font-mono text-right">Gross Margin %</th>
                <th className="py-2.5 px-3 font-mono text-right">AR Balance</th>
                <th className="py-2.5 px-3 font-mono text-right">DSO</th>
                <th className="py-2.5 px-3 font-mono text-right">Portfolio Share</th>
                <th className="py-2.5 px-3 text-center">Churn Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {customerAnalytics.map(row => (
                <tr key={row.customerCode} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">{row.customerName}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{row.customerCode}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 font-semibold text-indigo-900 dark:text-indigo-100 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded text-[11px]">
                      <Award className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      {row.tier}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-right font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(row.lifetimeValueOMR)}</td>
                  <td className="py-3 px-3 font-mono font-bold text-right text-indigo-900 dark:text-indigo-100">{formatCurrency(row.ytdRevenueOMR)}</td>
                  <td className="py-3 px-3 font-mono font-bold text-right text-emerald-700 dark:text-emerald-300">{row.ytdGrossMarginPercent}%</td>
                  <td className="py-3 px-3 font-mono text-right text-slate-800 dark:text-slate-200">{formatCurrency(row.currentReceivablesOMR)}</td>
                  <td className="py-3 px-3 font-mono text-right text-slate-600 dark:text-slate-400 font-semibold">{row.daysSalesOutstanding}d</td>
                  <td className="py-3 px-3 font-mono font-bold text-right text-slate-900 dark:text-slate-100">{row.concentrationPercent}%</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.churnRisk === 'Low'
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                          : row.churnRisk === 'Medium'
                          ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200'
                          : 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200'
                      }`}
                    >
                      {row.churnRisk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

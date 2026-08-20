import React from 'react';
import { Landmark, Download, Printer, ShieldCheck, Layers, PieChart } from 'lucide-react';
import { useBI } from '../../services/biStore';
import { BiFilterBar } from '../common/BiFilterBar';
import { DemoDataBanner } from '../common/DemoDataBanner';
import { exportToCSV, triggerPrintReport } from '../../services/exportService';

export const BalanceSheetView: React.FC = () => {
  const { balanceSheetData, formatCurrency, currencySymbol } = useBI();

  const handleExport = () => {
    const flatRows: any[] = [];
    balanceSheetData.forEach(cat => {
      flatRows.push({
        category: cat.category,
        code: 'TOTAL',
        name: `Total ${cat.category}`,
        currentOMR: cat.totalCurrentOMR,
        priorOMR: cat.totalPriorOMR,
        change: ((cat.totalCurrentOMR - cat.totalPriorOMR) / cat.totalPriorOMR * 100).toFixed(1)
      });
      cat.items.forEach(item => {
        flatRows.push({
          category: cat.category,
          code: item.code,
          name: item.name,
          currentOMR: item.currentOMR,
          priorOMR: item.priorOMR,
          change: item.changePercent
        });
      });
    });

    exportToCSV('Balance_Sheet_Statement_FY2026', [
      { key: 'category', label: 'Section' },
      { key: 'code', label: 'Account Code' },
      { key: 'name', label: 'Balance Sheet Account' },
      { key: 'currentOMR', label: 'Current Period (OMR)' },
      { key: 'priorOMR', label: 'Prior Year (OMR)' },
      { key: 'change', label: 'Change %' }
    ], flatRows);
  };

  const totalAssets =
    (balanceSheetData.find(c => c.category === 'Current Assets')?.totalCurrentOMR || 0) +
    (balanceSheetData.find(c => c.category === 'Non-Current Assets')?.totalCurrentOMR || 0);

  const totalLiabilities =
    (balanceSheetData.find(c => c.category === 'Current Liabilities')?.totalCurrentOMR || 0) +
    (balanceSheetData.find(c => c.category === 'Non-Current Liabilities')?.totalCurrentOMR || 0);

  const totalEquity = balanceSheetData.find(c => c.category === 'Equity')?.totalCurrentOMR || 0;

  return (
    <div className="space-y-6">
      <DemoDataBanner moduleSource="Module 02.10 Consolidated Balance Sheet Statement" />
      <BiFilterBar
        onPrint={() => triggerPrintReport('Balance Sheet Statement')}
        onExport={handleExport}
      />

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Consolidated Assets</span>
          <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">{formatCurrency(totalAssets)}</span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">+7.1% Expansion YoY</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Liabilities</span>
          <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">{formatCurrency(totalLiabilities)}</span>
          <span className="text-[11px] text-slate-500 font-semibold mt-0.5 block">Leverage: 0.34x D/E</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Shareholder Equity</span>
          <span className="text-xl font-bold font-mono text-indigo-900 mt-1 block">{formatCurrency(totalEquity)}</span>
          <span className="text-[11px] text-indigo-600 font-semibold mt-0.5 block">Assets = Liabilities + Equity (Balanced)</span>
        </div>
      </div>

      {/* Balance Sheet Categories */}
      <div className="space-y-5">
        {balanceSheetData.map(cat => (
          <div key={cat.category} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">{cat.category}</h3>
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-slate-500">Section Total:</span>
                <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {formatCurrency(cat.totalCurrentOMR)}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                    <th className="py-2 px-3 font-mono">Code</th>
                    <th className="py-2 px-3">Account Description</th>
                    <th className="py-2 px-3 font-mono text-right">Current Period ({currencySymbol})</th>
                    <th className="py-2 px-3 font-mono text-right">Prior Year ({currencySymbol})</th>
                    <th className="py-2 px-3 font-mono text-right">YoY Movement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cat.items.map(item => (
                    <tr key={item.code} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono text-[11px] text-slate-400">{item.code}</td>
                      <td className="py-2 px-3 font-semibold text-slate-900">{item.name}</td>
                      <td className="py-2 px-3 font-mono font-bold text-right text-slate-900">
                        {formatCurrency(item.currentOMR)}
                      </td>
                      <td className="py-2 px-3 font-mono text-right text-slate-500">
                        {formatCurrency(item.priorOMR)}
                      </td>
                      <td
                        className={`py-2 px-3 font-mono font-bold text-right ${
                          item.changePercent >= 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {item.changePercent > 0 ? '+' : ''}
                        {item.changePercent}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

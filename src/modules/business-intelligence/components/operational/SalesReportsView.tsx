import React, { useState } from 'react';
import { ShoppingBag, Download, Printer, Search, Filter, TrendingUp } from 'lucide-react';
import { useBI } from '../../services/biStore';
import { BiFilterBar } from '../common/BiFilterBar';
import { DemoDataBanner } from '../common/DemoDataBanner';
import { exportToCSV, triggerPrintReport } from '../../services/exportService';

export const SalesReportsView: React.FC = () => {
  const { salesData, formatCurrency, currencySymbol } = useBI();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSales = salesData.filter(s => {
    const sTerm = (searchTerm || '').toLowerCase();
    return (
      (s.customerName || '').toLowerCase().includes(sTerm) ||
      (s.category || '').toLowerCase().includes(sTerm) ||
      (s.branchName || '').toLowerCase().includes(sTerm)
    );
  });

  const handleExport = () => {
    exportToCSV('Operational_Sales_Analytics_Report', [
      { key: 'period', label: 'Period' },
      { key: 'customerCode', label: 'Customer Code' },
      { key: 'customerName', label: 'Customer Name' },
      { key: 'category', label: 'Category' },
      { key: 'branchName', label: 'Operating Branch' },
      { key: 'salesRep', label: 'Sales Rep' },
      { key: 'revenueOMR', label: 'Revenue (OMR)' },
      { key: 'cogsOMR', label: 'COGS (OMR)' },
      { key: 'grossMarginPercent', label: 'Gross Margin %' }
    ], filteredSales);
  };

  return (
    <div className="space-y-6">
      <DemoDataBanner moduleSource="Module 02.13 Operational Sales Reporting" />
      <BiFilterBar
        onPrint={() => triggerPrintReport('Operational Sales Analytics')}
        onExport={handleExport}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Commercial Invoicing & Margin Analysis
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Revenue, cost of sales, and gross margins by customer account</p>
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search customer or category..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Client / Strategic Account</th>
                <th className="py-2.5 px-3 font-semibold">Product Line</th>
                <th className="py-2.5 px-3 font-semibold">Branch</th>
                <th className="py-2.5 px-3 font-semibold">Account Exec</th>
                <th className="py-2.5 px-3 font-mono text-right">Revenue ({currencySymbol})</th>
                <th className="py-2.5 px-3 font-mono text-right">COGS ({currencySymbol})</th>
                <th className="py-2.5 px-3 font-mono text-right">Gross Margin %</th>
                <th className="py-2.5 px-3 font-mono text-center">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSales.map(row => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">{row.customerName}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{row.customerCode}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-medium">{row.category}</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{row.branchName}</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{row.salesRep}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-right text-indigo-900 dark:text-indigo-100">
                    {formatCurrency(row.revenueOMR)}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-right text-slate-600 dark:text-slate-400">
                    {formatCurrency(row.cogsOMR)}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-right text-emerald-700 dark:text-emerald-300">
                    {row.grossMarginPercent}%
                  </td>
                  <td className="py-2.5 px-3 font-mono text-center text-slate-800 dark:text-slate-200 font-bold">{row.orderCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

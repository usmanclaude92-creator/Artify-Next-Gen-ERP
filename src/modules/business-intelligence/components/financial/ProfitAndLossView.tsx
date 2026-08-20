import React, { useState } from 'react';
import {
  FileSpreadsheet,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Printer,
  Download,
  Filter,
  DollarSign
} from 'lucide-react';
import { useBI } from '../../services/biStore';
import { BiFilterBar } from '../common/BiFilterBar';
import { DemoDataBanner } from '../common/DemoDataBanner';
import { ProfitAndLossLineItem } from '../../types';
import { exportToCSV, triggerPrintReport } from '../../services/exportService';

export const ProfitAndLossView: React.FC = () => {
  const { pnlData, formatCurrency, currencySymbol } = useBI();
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({
    'pnl-01': true,
    'pnl-02': true,
    'pnl-04': true
  });

  const toggleExpand = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExport = () => {
    const flatRows: any[] = [];
    pnlData.forEach(item => {
      flatRows.push({
        code: item.code,
        name: item.name,
        actualOMR: item.currentActualOMR,
        priorOMR: item.priorActualOMR,
        budgetOMR: item.budgetOMR,
        varianceOMR: item.varianceOMR,
        variancePct: item.variancePercent
      });
      if (item.children) {
        item.children.forEach(c => {
          flatRows.push({
            code: c.code,
            name: `  - ${c.name}`,
            actualOMR: c.currentActualOMR,
            priorOMR: c.priorActualOMR,
            budgetOMR: c.budgetOMR,
            varianceOMR: c.varianceOMR,
            variancePct: c.variancePercent
          });
        });
      }
    });

    exportToCSV('Profit_and_Loss_Statement_FY2026', [
      { key: 'code', label: 'Account Code' },
      { key: 'name', label: 'Account Group / Description' },
      { key: 'actualOMR', label: 'Current Actual' },
      { key: 'priorOMR', label: 'Prior Year' },
      { key: 'budgetOMR', label: 'Budget' },
      { key: 'varianceOMR', label: 'Variance' },
      { key: 'variancePct', label: 'Variance %' }
    ], flatRows);
  };

  return (
    <div className="space-y-6">
      <DemoDataBanner moduleSource="Module 02.09 Consolidated Profit & Loss Statement" />
      <BiFilterBar
        onPrint={() => triggerPrintReport('Profit & Loss Statement')}
        onExport={handleExport}
      />

      {/* Main Financial Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
              Consolidated Statement of Comprehensive Income (P&L)
            </h3>
            <p className="text-xs text-slate-500">
              Comparative analysis for Fiscal Year 2026 YTD in {currencySymbol} (Collapsible hierarchy)
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-500">Net Profit Margin:</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">14.72% Margin</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                <th className="py-3 px-3">Account Group / Line Item</th>
                <th className="py-3 px-3 font-mono">Code</th>
                <th className="py-3 px-3 font-mono text-right">Current Actual</th>
                <th className="py-3 px-3 font-mono text-right text-slate-500">Prior Period</th>
                <th className="py-3 px-3 font-mono text-right text-slate-500">Approved Budget</th>
                <th className="py-3 px-3 font-mono text-right">Variance</th>
                <th className="py-3 px-3 font-mono text-right">Variance %</th>
                <th className="py-3 px-3 text-center">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pnlData.map(item => {
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = !!expandedRows[item.id];
                const isMajorTotal = ['GP', 'EBIT', 'NET'].includes(item.code);

                return (
                  <React.Fragment key={item.id}>
                    <tr
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isMajorTotal ? 'bg-indigo-50/50 font-bold text-indigo-950 border-t-2 border-slate-200' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          {hasChildren ? (
                            <button
                              onClick={() => toggleExpand(item.id)}
                              className="text-slate-400 hover:text-slate-700 p-0.5"
                            >
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                          ) : (
                            <span className="w-4" />
                          )}
                          <span className={isMajorTotal ? 'font-bold uppercase tracking-wide' : 'font-semibold text-slate-900'}>
                            {item.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">{item.code}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-right text-slate-900">
                        {formatCurrency(item.currentActualOMR)}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-right text-slate-500">
                        {formatCurrency(item.priorActualOMR)}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-right text-slate-500">
                        {formatCurrency(item.budgetOMR)}
                      </td>
                      <td
                        className={`py-2.5 px-3 font-mono font-semibold text-right ${
                          item.varianceOMR >= 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {item.varianceOMR > 0 ? '+' : ''}
                        {formatCurrency(item.varianceOMR)}
                      </td>
                      <td
                        className={`py-2.5 px-3 font-mono font-bold text-right ${
                          item.variancePercent >= 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {item.variancePercent > 0 ? '+' : ''}
                        {item.variancePercent}%
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'Favorable'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'Unfavorable'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>

                    {/* Collapsible Children */}
                    {hasChildren &&
                      isExpanded &&
                      item.children!.map(child => (
                        <tr key={child.id} className="bg-slate-50/50 hover:bg-slate-100/50 text-[11px]">
                          <td className="py-2 px-3 pl-10 text-slate-600 font-medium">{child.name}</td>
                          <td className="py-2 px-3 font-mono text-slate-400">{child.code}</td>
                          <td className="py-2 px-3 font-mono text-right font-semibold text-slate-800">
                            {formatCurrency(child.currentActualOMR)}
                          </td>
                          <td className="py-2 px-3 font-mono text-right text-slate-500">
                            {formatCurrency(child.priorActualOMR)}
                          </td>
                          <td className="py-2 px-3 font-mono text-right text-slate-500">
                            {formatCurrency(child.budgetOMR)}
                          </td>
                          <td
                            className={`py-2 px-3 font-mono text-right ${
                              child.varianceOMR >= 0 ? 'text-emerald-700' : 'text-rose-700'
                            }`}
                          >
                            {child.varianceOMR > 0 ? '+' : ''}
                            {formatCurrency(child.varianceOMR)}
                          </td>
                          <td
                            className={`py-2 px-3 font-mono font-semibold text-right ${
                              child.variancePercent >= 0 ? 'text-emerald-700' : 'text-rose-700'
                            }`}
                          >
                            {child.variancePercent > 0 ? '+' : ''}
                            {child.variancePercent}%
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span
                              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                                child.status === 'Favorable'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : child.status === 'Unfavorable'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {child.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

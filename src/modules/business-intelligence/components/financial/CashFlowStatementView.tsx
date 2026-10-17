import React from 'react';
import { ArrowDownLeft, ArrowUpRight, DollarSign, Download, Printer, ShieldCheck } from 'lucide-react';
import { useBI } from '../../services/biStore';
import { BiFilterBar } from '../common/BiFilterBar';
import { DemoDataBanner } from '../common/DemoDataBanner';
import { exportToCSV, triggerPrintReport } from '../../services/exportService';

export const CashFlowStatementView: React.FC = () => {
  const { cashFlowData, formatCurrency, currencySymbol } = useBI();

  const handleExport = () => {
    const flatRows: any[] = [];
    cashFlowData.forEach(sec => {
      flatRows.push({
        section: sec.section,
        name: `Total ${sec.section}`,
        amountOMR: sec.totalOMR,
        type: sec.totalOMR >= 0 ? 'Net Inflow' : 'Net Outflow'
      });
      sec.items.forEach(item => {
        flatRows.push({
          section: sec.section,
          name: item.name,
          amountOMR: item.amountOMR,
          type: item.type
        });
      });
    });

    exportToCSV('Cash_Flow_Statement_FY2026', [
      { key: 'section', label: 'Cash Flow Section' },
      { key: 'name', label: 'Activity Line Item' },
      { key: 'amountOMR', label: 'Amount (OMR)' },
      { key: 'type', label: 'Flow Type' }
    ], flatRows);
  };

  const netCashGenerated = cashFlowData.reduce((acc, curr) => acc + curr.totalOMR, 0);

  return (
    <div className="space-y-6">
      <DemoDataBanner moduleSource="Module 02.11 Consolidated Cash Flow Statement" />
      <BiFilterBar
        onPrint={() => triggerPrintReport('Cash Flow Statement')}
        onExport={handleExport}
      />

      {/* Net Cash Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Net Change in Liquid Cash & Placements</span>
          <span className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-300 mt-1 block">
            +{formatCurrency(netCashGenerated)}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-500/30">
            Operating: <strong>+{formatCurrency(cashFlowData[0]?.totalOMR || 0)}</strong>
          </div>
          <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-500/30">
            Investing: <strong>{formatCurrency(cashFlowData[1]?.totalOMR || 0)}</strong>
          </div>
          <div className="p-2 bg-rose-50 dark:bg-rose-500/10 rounded-lg text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-500/30">
            Financing: <strong>{formatCurrency(cashFlowData[2]?.totalOMR || 0)}</strong>
          </div>
        </div>
      </div>

      {/* Cash Flow Sections */}
      <div className="space-y-5">
        {cashFlowData.map(section => (
          <div key={section.section} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{section.section}</h3>
              <div className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                Net: {formatCurrency(section.totalOMR)}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                    <th className="py-2 px-3">Cash Flow Line Item</th>
                    <th className="py-2 px-3 text-center">Impact Type</th>
                    <th className="py-2 px-3 font-mono text-right">Amount ({currencySymbol})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {section.items.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-2 px-3 font-semibold text-slate-800 dark:text-slate-200">{item.name}</td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.type === 'Inflow'
                              ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                              : 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200'
                          }`}
                        >
                          {item.type === 'Inflow' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          {item.type}
                        </span>
                      </td>
                      <td
                        className={`py-2 px-3 font-mono font-bold text-right ${
                          item.amountOMR >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {item.amountOMR > 0 ? '+' : ''}
                        {formatCurrency(item.amountOMR)}
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

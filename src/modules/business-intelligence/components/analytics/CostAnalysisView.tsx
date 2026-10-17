import React from 'react';
import { Layers, Download, Printer, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useBI } from '../../services/biStore';
import { BiFilterBar } from '../common/BiFilterBar';
import { DemoDataBanner } from '../common/DemoDataBanner';
import { exportToCSV, triggerPrintReport } from '../../services/exportService';

export const CostAnalysisView: React.FC = () => {
  const { costData, formatCurrency, currencySymbol } = useBI();

  const handleExport = () => {
    exportToCSV('Cost_Center_Absorption_Analysis', [
      { key: 'costCenterCode', label: 'Cost Center Code' },
      { key: 'costCenterName', label: 'Cost Center Description' },
      { key: 'department', label: 'Department' },
      { key: 'category', label: 'Expense Category' },
      { key: 'budgetedAmountOMR', label: 'Budget (OMR)' },
      { key: 'actualSpendOMR', label: 'Actual Spend (OMR)' },
      { key: 'absorbedCostOMR', label: 'Absorbed Standard (OMR)' },
      { key: 'underOverAbsorptionOMR', label: 'Under/Over Absorption (OMR)' },
      { key: 'varianceOMR', label: 'Budget Variance (OMR)' },
      { key: 'status', label: 'Status' }
    ], costData);
  };

  return (
    <div className="space-y-6">
      <DemoDataBanner moduleSource="Module 02.19 Cost Center & Overhead Absorption Analysis" />
      <BiFilterBar
        onPrint={() => triggerPrintReport('Cost Center Analysis')}
        onExport={handleExport}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-xs">
        <div className="pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Cost Center Budgeting & Overhead Standard Absorption
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Tracking direct material, direct labor, and manufacturing overhead recovery rates</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Cost Center Code & Name</th>
                <th className="py-2.5 px-3 font-semibold">Department</th>
                <th className="py-2.5 px-3 font-semibold">Expense Nature</th>
                <th className="py-2.5 px-3 font-mono text-right">Budget Allocation</th>
                <th className="py-2.5 px-3 font-mono text-right">Actual Spend</th>
                <th className="py-2.5 px-3 font-mono text-right">Absorbed Standard</th>
                <th className="py-2.5 px-3 font-mono text-right">Under/(Over) Recovery</th>
                <th className="py-2.5 px-3 font-mono text-right">Net Variance</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {costData.map(row => (
                <tr key={row.costCenterCode} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">{row.costCenterName}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{row.costCenterCode}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium">{row.department}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{row.category}</td>
                  <td className="py-3 px-3 font-mono text-right text-slate-600 dark:text-slate-400">{formatCurrency(row.budgetedAmountOMR)}</td>
                  <td className="py-3 px-3 font-mono font-bold text-right text-slate-900 dark:text-slate-100">{formatCurrency(row.actualSpendOMR)}</td>
                  <td className="py-3 px-3 font-mono text-right text-indigo-900 dark:text-indigo-100">{formatCurrency(row.absorbedCostOMR)}</td>
                  <td
                    className={`py-3 px-3 font-mono font-bold text-right ${
                      row.underOverAbsorptionOMR >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {formatCurrency(row.underOverAbsorptionOMR)}
                  </td>
                  <td
                    className={`py-3 px-3 font-mono font-bold text-right ${
                      row.varianceOMR >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {row.varianceOMR > 0 ? '+' : ''}
                    {formatCurrency(row.varianceOMR)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.status === 'Within Budget'
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                          : 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200'
                      }`}
                    >
                      {row.status}
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

import React, { useState } from 'react';
import { TrendingUp, Layers, Download, Printer, Filter } from 'lucide-react';
import { useBI } from '../../services/biStore';
import { BiFilterBar } from '../common/BiFilterBar';
import { DemoDataBanner } from '../common/DemoDataBanner';
import { exportToCSV, triggerPrintReport } from '../../services/exportService';

export const ProfitabilityAnalysisView: React.FC = () => {
  const { profitabilityData, formatCurrency, currencySymbol } = useBI();

  const handleExport = () => {
    exportToCSV('Profitability_Dimension_Analysis', [
      { key: 'dimension', label: 'Business Line / Product' },
      { key: 'dimensionType', label: 'Dimension' },
      { key: 'revenueOMR', label: 'Revenue (OMR)' },
      { key: 'directCostOMR', label: 'Direct Costs (OMR)' },
      { key: 'grossProfitOMR', label: 'Gross Profit (OMR)' },
      { key: 'grossMarginPercent', label: 'Gross Margin %' },
      { key: 'operatingOverheadOMR', label: 'Operating Overhead (OMR)' },
      { key: 'netProfitOMR', label: 'Net Margin (OMR)' },
      { key: 'netMarginPercent', label: 'Net Margin %' }
    ], profitabilityData);
  };

  return (
    <div className="space-y-6">
      <DemoDataBanner moduleSource="Module 02.18 Multi-Dimensional Profitability Analysis" />
      <BiFilterBar
        onPrint={() => triggerPrintReport('Profitability Analysis')}
        onExport={handleExport}
      />

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="pb-4 mb-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            Product Line & Business Unit Margin Contribution
          </h3>
          <p className="text-xs text-slate-500">Gross and net profitability ranking across commercial solution offerings</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <th className="py-2.5 px-3 font-semibold">Rank</th>
                <th className="py-2.5 px-3 font-semibold">Solution / Business Line</th>
                <th className="py-2.5 px-3 font-mono text-right">Revenue ({currencySymbol})</th>
                <th className="py-2.5 px-3 font-mono text-right">Direct Costs</th>
                <th className="py-2.5 px-3 font-mono text-right">Gross Profit</th>
                <th className="py-2.5 px-3 font-mono text-right">Gross Margin %</th>
                <th className="py-2.5 px-3 font-mono text-right">OPEX Overhead</th>
                <th className="py-2.5 px-3 font-mono text-right">Net Profit</th>
                <th className="py-2.5 px-3 font-mono text-right">Net Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {profitabilityData.map(row => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold font-mono text-slate-400">#{row.rank}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{row.dimension}</td>
                  <td className="py-3 px-3 font-mono font-bold text-right text-slate-900">{formatCurrency(row.revenueOMR)}</td>
                  <td className="py-3 px-3 font-mono text-right text-slate-600">{formatCurrency(row.directCostOMR)}</td>
                  <td className="py-3 px-3 font-mono font-bold text-right text-indigo-900">{formatCurrency(row.grossProfitOMR)}</td>
                  <td className="py-3 px-3 font-mono font-bold text-right text-emerald-700">{row.grossMarginPercent}%</td>
                  <td className="py-3 px-3 font-mono text-right text-slate-500">{formatCurrency(row.operatingOverheadOMR)}</td>
                  <td className="py-3 px-3 font-mono font-bold text-right text-emerald-700">{formatCurrency(row.netProfitOMR)}</td>
                  <td className="py-3 px-3 font-mono font-bold text-right text-emerald-700">{row.netMarginPercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Layers, Download, Printer, CheckCircle2, AlertOctagon, TrendingUp } from 'lucide-react';
import { useBI } from '../../services/biStore';
import { BiFilterBar } from '../common/BiFilterBar';
import { DemoDataBanner } from '../common/DemoDataBanner';
import { exportToCSV, triggerPrintReport } from '../../services/exportService';

export const VarianceAnalysisView: React.FC = () => {
  const { deepVarianceFactors, formatCurrency, currencySymbol } = useBI();

  const handleExport = () => {
    exportToCSV('Root_Cause_Variance_Decomposition', [
      { key: 'varianceType', label: 'Variance Type' },
      { key: 'parameter', label: 'Operational Driver' },
      { key: 'standardBenchmark', label: 'Standard Benchmark' },
      { key: 'actualResult', label: 'Actual Incurred' },
      { key: 'varianceEffectOMR', label: 'Net Variance (OMR)' },
      { key: 'impact', label: 'Impact' },
      { key: 'recommendation', label: 'Management Corrective Action' }
    ], deepVarianceFactors);
  };

  return (
    <div className="space-y-6">
      <DemoDataBanner moduleSource="Module 02.25 Operational & Strategic Variance Root Cause Engine" />
      <BiFilterBar
        onPrint={() => triggerPrintReport('Variance Deep-Dive')}
        onExport={handleExport}
      />

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="pb-4 mb-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            Standard Costing & Operational Variance Decomposition
          </h3>
          <p className="text-xs text-slate-500">
            Deconstruction into Purchase Price Variance (PPV), Sales Volume/Price Variance, and Labor Efficiency
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <th className="py-2.5 px-3 font-semibold">Variance Classification</th>
                <th className="py-2.5 px-3 font-semibold">Operational Driver</th>
                <th className="py-2.5 px-3 font-mono text-right">Standard / Benchmark</th>
                <th className="py-2.5 px-3 font-mono text-right">Actual Incurred</th>
                <th className="py-2.5 px-3 font-mono text-right">Net Impact ({currencySymbol})</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 font-semibold">Management Corrective Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deepVarianceFactors.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 block">{row.varianceType}</span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{row.parameter}</td>
                  <td className="py-3 px-3 font-mono text-right text-slate-500">{row.standardBenchmark}</td>
                  <td className="py-3 px-3 font-mono font-bold text-right text-slate-900">{row.actualResult}</td>
                  <td
                    className={`py-3 px-3 font-mono font-bold text-right ${
                      row.varianceEffectOMR >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {row.varianceEffectOMR > 0 ? '+' : ''}
                    {formatCurrency(row.varianceEffectOMR)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.impact === 'Favorable'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {row.impact}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-indigo-900 font-medium text-[11px] max-w-sm">{row.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

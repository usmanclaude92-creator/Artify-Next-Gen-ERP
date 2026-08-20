import React from 'react';
import { Briefcase, Download, Printer, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useBI } from '../../services/biStore';
import { BiFilterBar } from '../common/BiFilterBar';
import { DemoDataBanner } from '../common/DemoDataBanner';
import { exportToCSV, triggerPrintReport } from '../../services/exportService';

export const ProjectReportsView: React.FC = () => {
  const { projectData, formatCurrency, currencySymbol } = useBI();

  const handleExport = () => {
    exportToCSV('Operational_EPC_Projects_Report', [
      { key: 'projectCode', label: 'Project Code' },
      { key: 'projectName', label: 'Project Name' },
      { key: 'clientName', label: 'Client' },
      { key: 'projectManager', label: 'Project Manager' },
      { key: 'contractValueOMR', label: 'Contract Value (OMR)' },
      { key: 'actualCostOMR', label: 'Actual Cost (OMR)' },
      { key: 'progressPercent', label: 'Progress %' },
      { key: 'cpi', label: 'CPI' },
      { key: 'spi', label: 'SPI' },
      { key: 'marginPercent', label: 'Margin %' },
      { key: 'health', label: 'Health' }
    ], projectData);
  };

  return (
    <div className="space-y-6">
      <DemoDataBanner moduleSource="Module 02.17 Operational Projects & Earned Value Reporting" />
      <BiFilterBar
        onPrint={() => triggerPrintReport('Projects EVA Analysis')}
        onExport={handleExport}
      />

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="pb-4 mb-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            EPC & Infrastructure Project Earned Value Performance
          </h3>
          <p className="text-xs text-slate-500">Contract values, cost performance index (CPI), schedule performance (SPI), and recognized margins</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <th className="py-2.5 px-3 font-semibold">Project Code & Title</th>
                <th className="py-2.5 px-3 font-semibold">Client Name</th>
                <th className="py-2.5 px-3 font-semibold">Project Manager</th>
                <th className="py-2.5 px-3 font-mono text-right">Contract Value ({currencySymbol})</th>
                <th className="py-2.5 px-3 font-mono text-right">Actual Cost ({currencySymbol})</th>
                <th className="py-2.5 px-3 font-mono text-right">Progress %</th>
                <th className="py-2.5 px-3 font-mono text-center">CPI</th>
                <th className="py-2.5 px-3 font-mono text-center">SPI</th>
                <th className="py-2.5 px-3 font-mono text-right">Margin %</th>
                <th className="py-2.5 px-3 text-center">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projectData.map(row => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-900 block">{row.projectName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{row.projectCode}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 font-medium">{row.clientName}</td>
                  <td className="py-2.5 px-3 text-slate-600">{row.projectManager}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-right text-slate-900">
                    {formatCurrency(row.contractValueOMR)}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-right text-slate-600">
                    {formatCurrency(row.actualCostOMR)}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-right text-indigo-900">{row.progressPercent}%</td>
                  <td className="py-2.5 px-3 font-mono text-center font-bold text-emerald-700">{row.cpi}</td>
                  <td className="py-2.5 px-3 font-mono text-center font-bold text-indigo-700">{row.spi}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-right text-emerald-700">{row.marginPercent}%</td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.health === 'Green'
                          ? 'bg-emerald-100 text-emerald-800'
                          : row.health === 'Amber'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {row.health}
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

import React from 'react';
import { Users, Download, Printer, TrendingUp } from 'lucide-react';
import { useBI } from '../../services/biStore';
import { BiFilterBar } from '../common/BiFilterBar';
import { DemoDataBanner } from '../common/DemoDataBanner';
import { exportToCSV, triggerPrintReport } from '../../services/exportService';

export const HrReportsView: React.FC = () => {
  const { hrData } = useBI();

  const handleExport = () => {
    exportToCSV('Operational_HR_Workforce_Report', [
      { key: 'department', label: 'Department' },
      { key: 'headcount', label: 'Headcount' },
      { key: 'joinersYtd', label: 'New Hires YTD' },
      { key: 'leaversYtd', label: 'Exits YTD' },
      { key: 'turnoverRatePercent', label: 'Turnover Rate %' },
      { key: 'attendanceRatePercent', label: 'Attendance Rate %' },
      { key: 'overtimeHoursTotal', label: 'Total Overtime Hours' },
      { key: 'recruitmentOpenPositions', label: 'Open Positions' }
    ], hrData);
  };

  return (
    <div className="space-y-6">
      <DemoDataBanner moduleSource="Module 02.16 Operational Human Resources Reporting" />
      <BiFilterBar
        onPrint={() => triggerPrintReport('Workforce Analytics')}
        onExport={handleExport}
      />

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="pb-4 mb-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            Organizational Headcount, Turnover & Overtime Analytics
          </h3>
          <p className="text-xs text-slate-500">Departmental workforce distribution, recruitment load, and retention</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <th className="py-2.5 px-3 font-semibold">Department Division</th>
                <th className="py-2.5 px-3 font-mono text-right">Headcount</th>
                <th className="py-2.5 px-3 font-mono text-right">Joiners YTD</th>
                <th className="py-2.5 px-3 font-mono text-right">Exits YTD</th>
                <th className="py-2.5 px-3 font-mono text-right">Turnover %</th>
                <th className="py-2.5 px-3 font-mono text-right">Avg Tenure</th>
                <th className="py-2.5 px-3 font-mono text-right">Attendance %</th>
                <th className="py-2.5 px-3 font-mono text-right">Overtime Hrs</th>
                <th className="py-2.5 px-3 font-mono text-center">Open Roles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hrData.map(row => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-slate-900">{row.department}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-right text-slate-900">{row.headcount}</td>
                  <td className="py-2.5 px-3 font-mono text-right text-emerald-700 font-semibold">+{row.joinersYtd}</td>
                  <td className="py-2.5 px-3 font-mono text-right text-rose-600">-{row.leaversYtd}</td>
                  <td className="py-2.5 px-3 font-mono text-right text-slate-700">{row.turnoverRatePercent}%</td>
                  <td className="py-2.5 px-3 font-mono text-right text-slate-600">{row.avgTenureYears} yrs</td>
                  <td className="py-2.5 px-3 font-mono text-right text-emerald-700 font-semibold">{row.attendanceRatePercent}%</td>
                  <td className="py-2.5 px-3 font-mono text-right text-slate-700">{row.overtimeHoursTotal.toLocaleString()}h</td>
                  <td className="py-2.5 px-3 font-mono text-center font-bold text-indigo-700">{row.recruitmentOpenPositions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

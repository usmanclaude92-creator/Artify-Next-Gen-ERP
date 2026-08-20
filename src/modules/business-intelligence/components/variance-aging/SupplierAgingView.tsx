import React from 'react';
import { Clock, Download, Printer, ShieldCheck } from 'lucide-react';
import { useBI } from '../../services/biStore';
import { BiFilterBar } from '../common/BiFilterBar';
import { DemoDataBanner } from '../common/DemoDataBanner';
import { exportToCSV, triggerPrintReport } from '../../services/exportService';

export const SupplierAgingView: React.FC = () => {
  const { supplierAging, formatCurrency, currencySymbol } = useBI();

  const handleExport = () => {
    exportToCSV('Accounts_Payable_AP_Aging_Schedule', [
      { key: 'entityCode', label: 'Vendor Code' },
      { key: 'entityName', label: 'Supplier Name' },
      { key: 'totalOutstandingOMR', label: 'Total Outstanding (OMR)' },
      { key: 'currentNotDueOMR', label: 'Current Not Due (OMR)' },
      { key: 'days1To30OMR', label: '1-30 Days (OMR)' },
      { key: 'days31To60OMR', label: '31-60 Days (OMR)' },
      { key: 'days61To90OMR', label: '61-90 Days (OMR)' },
      { key: 'days91To120OMR', label: '91-120 Days (OMR)' },
      { key: 'lastPaymentDate', label: 'Last Remittance Date' }
    ], supplierAging);
  };

  const totalAP = supplierAging.reduce((acc, curr) => acc + curr.totalOutstandingOMR, 0);

  return (
    <div className="space-y-6">
      <DemoDataBanner moduleSource="Module 02.24 Trade Accounts Payable (AP) Aging Analysis" />
      <BiFilterBar
        onPrint={() => triggerPrintReport('AP Aging Schedule')}
        onExport={handleExport}
      />

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              Supplier Accounts Payable (AP) Maturity Buckets
            </h3>
            <p className="text-xs text-slate-500">Payable maturity timelines, scheduled disbursements, and vendor obligations</p>
          </div>

          <div className="font-mono text-xs font-bold text-indigo-950 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg">
            Total Outstanding AP: {formatCurrency(totalAP)}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <th className="py-2.5 px-3 font-semibold">Vendor / Supplier</th>
                <th className="py-2.5 px-3 font-mono text-right font-bold">Total Due ({currencySymbol})</th>
                <th className="py-2.5 px-3 font-mono text-right text-emerald-700">Current (Not Due)</th>
                <th className="py-2.5 px-3 font-mono text-right text-emerald-700">1 - 30 Days</th>
                <th className="py-2.5 px-3 font-mono text-right text-amber-700">31 - 60 Days</th>
                <th className="py-2.5 px-3 font-mono text-right text-rose-700">61 - 90 Days</th>
                <th className="py-2.5 px-3 font-mono text-right text-rose-800">91 - 120 Days</th>
                <th className="py-2.5 px-3 font-mono text-center">Last Remittance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {supplierAging.map(row => (
                <tr key={row.entityCode} className="hover:bg-slate-50">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 block">{row.entityName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{row.entityCode} • {row.category}</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-right text-slate-900">
                    {formatCurrency(row.totalOutstandingOMR)}
                  </td>
                  <td className="py-3 px-3 font-mono text-right text-emerald-700">{formatCurrency(row.currentNotDueOMR)}</td>
                  <td className="py-3 px-3 font-mono text-right text-emerald-700">{formatCurrency(row.days1To30OMR)}</td>
                  <td className="py-3 px-3 font-mono text-right text-amber-700">{formatCurrency(row.days31To60OMR)}</td>
                  <td className="py-3 px-3 font-mono text-right text-rose-700">{formatCurrency(row.days61To90OMR)}</td>
                  <td className="py-3 px-3 font-mono text-right text-rose-800">{formatCurrency(row.days91To120OMR)}</td>
                  <td className="py-3 px-3 font-mono text-center text-slate-500">{row.lastPaymentDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

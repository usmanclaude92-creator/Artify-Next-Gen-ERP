import React, { useState } from 'react';
import { ShoppingCart, Download, Printer, Search, CheckCircle2 } from 'lucide-react';
import { useBI } from '../../services/biStore';
import { BiFilterBar } from '../common/BiFilterBar';
import { DemoDataBanner } from '../common/DemoDataBanner';
import { exportToCSV, triggerPrintReport } from '../../services/exportService';

export const PurchaseReportsView: React.FC = () => {
  const { purchaseData, formatCurrency, currencySymbol } = useBI();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPurchases = purchaseData.filter(p => {
    const sTerm = (searchTerm || '').toLowerCase();
    return (
      (p.supplierName || '').toLowerCase().includes(sTerm) ||
      (p.category || '').toLowerCase().includes(sTerm)
    );
  });

  const handleExport = () => {
    exportToCSV('Operational_Purchase_Spend_Report', [
      { key: 'period', label: 'Period' },
      { key: 'supplierCode', label: 'Vendor Code' },
      { key: 'supplierName', label: 'Supplier Name' },
      { key: 'category', label: 'Category' },
      { key: 'spendOMR', label: 'Spend (OMR)' },
      { key: 'poCount', label: 'PO Count' },
      { key: 'leadTimeDaysAvg', label: 'Avg Lead Time (Days)' },
      { key: 'otifPercent', label: 'OTIF %' }
    ], filteredPurchases);
  };

  return (
    <div className="space-y-6">
      <DemoDataBanner moduleSource="Module 02.14 Operational Procurement Reporting" />
      <BiFilterBar
        onPrint={() => triggerPrintReport('Procurement Analytics')}
        onExport={handleExport}
      />

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-indigo-600" />
              Vendor Spend & Fulfillment SLA Analytics
            </h3>
            <p className="text-xs text-slate-500">Procurement volumes, order frequencies, and vendor performance</p>
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search vendor or category..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <th className="py-2.5 px-3 font-semibold">Vendor Name</th>
                <th className="py-2.5 px-3 font-semibold">Spend Category</th>
                <th className="py-2.5 px-3 font-mono text-right">YTD Spend ({currencySymbol})</th>
                <th className="py-2.5 px-3 font-mono text-center">PO Count</th>
                <th className="py-2.5 px-3 font-mono text-right">Avg Lead Time</th>
                <th className="py-2.5 px-3 font-mono text-right">OTIF Rate</th>
                <th className="py-2.5 px-3 font-mono text-right">Price Variance %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPurchases.map(row => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-900 block">{row.supplierName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{row.supplierCode}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 font-medium">{row.category}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-right text-slate-900">
                    {formatCurrency(row.spendOMR)}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-center font-bold text-slate-800">{row.poCount}</td>
                  <td className="py-2.5 px-3 font-mono text-right text-slate-600">{row.leadTimeDaysAvg} Days</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-right text-emerald-700">{row.otifPercent}%</td>
                  <td
                    className={`py-2.5 px-3 font-mono font-semibold text-right ${
                      row.priceVariancePercent <= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {row.priceVariancePercent > 0 ? '+' : ''}
                    {row.priceVariancePercent}%
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

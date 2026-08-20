import React from 'react';
import { ShoppingCart, Download, Printer, ShieldCheck } from 'lucide-react';
import { useBI } from '../../services/biStore';
import { BiFilterBar } from '../common/BiFilterBar';
import { DemoDataBanner } from '../common/DemoDataBanner';
import { exportToCSV, triggerPrintReport } from '../../services/exportService';

export const SupplierAnalyticsView: React.FC = () => {
  const { supplierAnalytics, formatCurrency, currencySymbol } = useBI();

  const handleExport = () => {
    exportToCSV('Strategic_Supplier_Analytics', [
      { key: 'supplierCode', label: 'Supplier Code' },
      { key: 'supplierName', label: 'Supplier Name' },
      { key: 'category', label: 'Category' },
      { key: 'ytdSpendOMR', label: 'YTD Spend (OMR)' },
      { key: 'spendConcentrationPercent', label: 'Spend Share %' },
      { key: 'onTimeDeliveryRate', label: 'OTIF %' },
      { key: 'qualityDefectRatePpm', label: 'Defect PPM' },
      { key: 'outstandingPayablesOMR', label: 'AP Balance (OMR)' },
      { key: 'paymentTermDays', label: 'Payment Terms (Days)' },
      { key: 'riskRating', label: 'Risk Rating' }
    ], supplierAnalytics);
  };

  return (
    <div className="space-y-6">
      <DemoDataBanner moduleSource="Module 02.21 Strategic Supplier & Vendor Analytics" />
      <BiFilterBar
        onPrint={() => triggerPrintReport('Supplier Analytics')}
        onExport={handleExport}
      />

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="pb-4 mb-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-indigo-600" />
            Vendor Spend Concentration, OTIF Delivery & Quality Scorecard
          </h3>
          <p className="text-xs text-slate-500">Procurement exposure, quality defect rates (PPM), and contract renewal timelines</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <th className="py-2.5 px-3 font-semibold">Vendor / Supplier Name</th>
                <th className="py-2.5 px-3 font-semibold">Spend Category</th>
                <th className="py-2.5 px-3 font-mono text-right">YTD Spend ({currencySymbol})</th>
                <th className="py-2.5 px-3 font-mono text-right">Spend Share %</th>
                <th className="py-2.5 px-3 font-mono text-right">OTIF Delivery</th>
                <th className="py-2.5 px-3 font-mono text-right">Defect PPM</th>
                <th className="py-2.5 px-3 font-mono text-right">AP Outstanding</th>
                <th className="py-2.5 px-3 font-mono text-right">Terms</th>
                <th className="py-2.5 px-3 text-center">Risk Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {supplierAnalytics.map(row => (
                <tr key={row.supplierCode} className="hover:bg-slate-50">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 block">{row.supplierName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{row.supplierCode}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">{row.category}</td>
                  <td className="py-3 px-3 font-mono font-bold text-right text-slate-900">{formatCurrency(row.ytdSpendOMR)}</td>
                  <td className="py-3 px-3 font-mono font-bold text-right text-indigo-700">{row.spendConcentrationPercent}%</td>
                  <td className="py-3 px-3 font-mono font-bold text-right text-emerald-700">{row.onTimeDeliveryRate}%</td>
                  <td className="py-3 px-3 font-mono text-right text-slate-600 font-semibold">{row.qualityDefectRatePpm} PPM</td>
                  <td className="py-3 px-3 font-mono text-right text-slate-800">{formatCurrency(row.outstandingPayablesOMR)}</td>
                  <td className="py-3 px-3 font-mono text-right text-slate-600">{row.paymentTermDays} Days</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.riskRating === 'Low'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {row.riskRating} Risk
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

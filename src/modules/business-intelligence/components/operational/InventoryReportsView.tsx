import React, { useState } from 'react';
import { Boxes, Download, Printer, Search, AlertTriangle } from 'lucide-react';
import { useBI } from '../../services/biStore';
import { BiFilterBar } from '../common/BiFilterBar';
import { DemoDataBanner } from '../common/DemoDataBanner';
import { exportToCSV, triggerPrintReport } from '../../services/exportService';

export const InventoryReportsView: React.FC = () => {
  const { inventoryData, formatCurrency, currencySymbol } = useBI();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInventory = inventoryData.filter(i => {
    const sTerm = (searchTerm || '').toLowerCase();
    return (
      (i.itemName || '').toLowerCase().includes(sTerm) ||
      (i.itemCode || '').toLowerCase().includes(sTerm) ||
      (i.warehouse || '').toLowerCase().includes(sTerm)
    );
  });

  const handleExport = () => {
    exportToCSV('Operational_Inventory_Valuation_Report', [
      { key: 'itemCode', label: 'Item Code' },
      { key: 'itemName', label: 'Item Name' },
      { key: 'category', label: 'Category' },
      { key: 'warehouse', label: 'Warehouse' },
      { key: 'quantityOnHand', label: 'Quantity On Hand' },
      { key: 'unitCostOMR', label: 'Unit Cost (OMR)' },
      { key: 'totalValuationOMR', label: 'Total Valuation (OMR)' },
      { key: 'stockTurnoverRatio', label: 'Stock Turnover' },
      { key: 'status', label: 'Status' }
    ], filteredInventory);
  };

  return (
    <div className="space-y-6">
      <DemoDataBanner moduleSource="Module 02.15 Operational Inventory & Warehouse Reporting" />
      <BiFilterBar
        onPrint={() => triggerPrintReport('Inventory Valuation & Stock')}
        onExport={handleExport}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Warehouse Stock Valuation, Velocity & Health
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Live quantities on-hand, safety thresholds, and turnover ratios</p>
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search SKU or warehouse..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400">
                <th className="py-2.5 px-3 font-semibold">SKU / Item Description</th>
                <th className="py-2.5 px-3 font-semibold">Warehouse Location</th>
                <th className="py-2.5 px-3 font-mono text-right">On-Hand Qty</th>
                <th className="py-2.5 px-3 font-mono text-right">Unit Cost</th>
                <th className="py-2.5 px-3 font-mono text-right">Total Valuation ({currencySymbol})</th>
                <th className="py-2.5 px-3 font-mono text-right">Turnover</th>
                <th className="py-2.5 px-3 font-mono text-right">Days Left</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInventory.map(row => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">{row.itemName}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{row.itemCode} • {row.category}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-medium">{row.warehouse}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-right text-slate-900 dark:text-slate-100">{row.quantityOnHand}</td>
                  <td className="py-2.5 px-3 font-mono text-right text-slate-600 dark:text-slate-400">{formatCurrency(row.unitCostOMR)}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-right text-indigo-900 dark:text-indigo-100">
                    {formatCurrency(row.totalValuationOMR)}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-right text-slate-700 dark:text-slate-300">{row.stockTurnoverRatio}x</td>
                  <td className="py-2.5 px-3 font-mono text-right text-slate-700 dark:text-slate-300">{row.daysOfInventoryRemaining}d</td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.status === 'Healthy'
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                          : row.status === 'Low Stock'
                          ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200'
                          : 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200'
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

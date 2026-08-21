import React, { useState } from 'react';
import { useInventoryStore } from '../../services/inventoryStore';
import {
  BarChart3,
  Download,
  Filter,
  Search,
  DollarSign,
  TrendingUp,
  Clock,
  Layers,
  FileSpreadsheet,
  PieChart,
  Calendar,
  Building2,
  Boxes,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';

interface ValuationAndReportingViewProps {
  initialTab?: 'valuation' | 'aging' | 'bincard' | 'abc_xyz';
  onNavigate?: (route: any) => void;
}

export const ValuationAndReportingView: React.FC<ValuationAndReportingViewProps> = ({
  initialTab = 'valuation',
  onNavigate
}) => {
  const { items, warehouses, transactions, stats } = useInventoryStore();

  const [activeTab, setActiveTab] = useState<'valuation' | 'aging' | 'bincard' | 'abc_xyz'>(initialTab);
  const [selectedSkuForBinCard, setSelectedSkuForBinCard] = useState<string>(items[0]?.sku || '');
  const [selectedWarehouseFilter, setSelectedWarehouseFilter] = useState<string>('all');

  const currentItemForBinCard = items.find((i) => i.sku === selectedSkuForBinCard) || items[0];

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-950/60 text-purple-400 border border-purple-800/40">
              07.07
            </span>
            <h2 className="text-xl font-bold text-white">Inventory Valuation & Analytical Ledgers</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            FIFO asset costing layers, 6-bucket stock aging, SKU bin card registers, and ABC/XYZ analytics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('valuation')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'valuation' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cost Valuation Layers
            </button>
            <button
              onClick={() => setActiveTab('aging')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'aging' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Stock Aging & Provisions
            </button>
            <button
              onClick={() => setActiveTab('bincard')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'bincard' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SKU Bin Card Ledger
            </button>
            <button
              onClick={() => setActiveTab('abc_xyz')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'abc_xyz' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ABC / XYZ Matrix
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: VALUATION LAYERS (FIFO / WEIGHTED AVERAGE / STANDARD COST) */}
      {activeTab === 'valuation' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Asset Valuation (FIFO)</span>
              <div className="mt-2 text-2xl font-bold text-white font-mono">
                OMR {stats.totalInventoryValuationOMR.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <span className="text-xs text-purple-400 mt-1 block">General Ledger Asset Code: 1410-00</span>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Average Unit Carrying Cost</span>
              <div className="mt-2 text-2xl font-bold text-cyan-400 font-mono">
                OMR {(stats.totalInventoryValuationOMR / (stats.totalPhysicalUnitsOnHand || 1)).toFixed(2)}
              </div>
              <span className="text-xs text-slate-400 mt-1 block">Across {stats.totalSkuCount} active product lines</span>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Inventory Turnover Ratio</span>
              <div className="mt-2 text-2xl font-bold text-emerald-400 font-mono">
                {stats.averageInventoryTurnoverRatio}x
              </div>
              <span className="text-xs text-slate-400 mt-1 block">Days Sales of Inventory (DSI): {stats.daysSalesOfInventory} Days</span>
            </div>
          </div>

          {/* SKU Valuation Table */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Material SKU & Description</th>
                    <th className="py-3 px-3">Valuation Method</th>
                    <th className="py-3 px-3 text-right">Physical On Hand</th>
                    <th className="py-3 px-3 text-right">FIFO Unit Cost</th>
                    <th className="py-3 px-3 text-right">Weighted Avg Cost</th>
                    <th className="py-3 px-3 text-right">Standard Cost</th>
                    <th className="py-3 px-3 text-right">Total Inventory Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {items.map((item) => {
                    const totalVal = item.totalStockOnHand * item.unitCostOMR;
                    return (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-cyan-400">{item.sku}</span>
                          <div className="font-medium text-white text-xs">{item.name}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                            {item.valuationMethod}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-white">
                          {item.totalStockOnHand.toLocaleString()} {item.baseUom}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-200">
                          OMR {item.unitCostOMR.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-400">
                          OMR {item.weightedAvgCostOMR.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-400">
                          OMR {item.standardCostOMR.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                          OMR {totalVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 6-BUCKET STOCK AGING & WRITE-OFF PROVISIONS */}
      {activeTab === 'aging' && (
        <div className="space-y-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-white">6-Tier Stock Aging Breakdown & Capital Tie-Up</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-center">
                <span className="text-[10px] text-emerald-400 uppercase font-semibold block">0 - 30 Days</span>
                <span className="text-base font-bold font-mono text-white mt-1 block">OMR 1,420,500</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">57.7% of total</span>
              </div>

              <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded-xl text-center">
                <span className="text-[10px] text-cyan-400 uppercase font-semibold block">31 - 60 Days</span>
                <span className="text-base font-bold font-mono text-white mt-1 block">OMR 510,200</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">20.7% of total</span>
              </div>

              <div className="p-3 bg-indigo-950/20 border border-indigo-800/40 rounded-xl text-center">
                <span className="text-[10px] text-indigo-400 uppercase font-semibold block">61 - 90 Days</span>
                <span className="text-base font-bold font-mono text-white mt-1 block">OMR 285,400</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">11.6% of total</span>
              </div>

              <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl text-center">
                <span className="text-[10px] text-amber-400 uppercase font-semibold block">91 - 180 Days</span>
                <span className="text-base font-bold font-mono text-white mt-1 block">OMR 145,100</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">5.9% of total</span>
              </div>

              <div className="p-3 bg-orange-950/20 border border-orange-800/40 rounded-xl text-center">
                <span className="text-[10px] text-orange-400 uppercase font-semibold block">181 - 365 Days</span>
                <span className="text-base font-bold font-mono text-white mt-1 block">OMR 72,300</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">2.9% of total</span>
              </div>

              <div className="p-3 bg-rose-950/20 border border-rose-800/40 rounded-xl text-center">
                <span className="text-[10px] text-rose-400 uppercase font-semibold block">&gt; 365 Days (Slow)</span>
                <span className="text-base font-bold font-mono text-rose-400 mt-1 block">OMR 26,500</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">1.1% provision</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SKU BIN CARD CHRONOLOGICAL RUNNING LEDGER */}
      {activeTab === 'bincard' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-slate-300">Select Item / SKU Bin Card:</label>
              <select
                value={selectedSkuForBinCard}
                onChange={(e) => setSelectedSkuForBinCard(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
              >
                {items.map((i) => (
                  <option key={i.id} value={i.sku}>{i.sku} — {i.name}</option>
                ))}
              </select>
            </div>
            <span className="text-xs font-mono text-cyan-400">Current Balance: {currentItemForBinCard.totalStockOnHand} {currentItemForBinCard.baseUom}</span>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-3">Voucher #</th>
                  <th className="py-3 px-3">Movement Type</th>
                  <th className="py-3 px-3 text-right">Inward (+)</th>
                  <th className="py-3 px-3 text-right">Outward (-)</th>
                  <th className="py-3 px-3 text-right">Running Balance</th>
                  <th className="py-3 px-3">Authorizer Stamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                <tr className="bg-slate-800/20">
                  <td className="py-3 px-4 text-slate-400">2026-01-01</td>
                  <td className="py-3 px-3 text-sky-400">OPN-2026-0001</td>
                  <td className="py-3 px-3 text-slate-300 font-sans">Opening Balance Migration</td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-bold">+50</td>
                  <td className="py-3 px-3 text-right text-slate-500">—</td>
                  <td className="py-3 px-3 text-right text-white font-bold">50</td>
                  <td className="py-3 px-3 text-slate-400 font-sans">System Go-Live</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 text-slate-400">2026-02-15</td>
                  <td className="py-3 px-3 text-emerald-400">GRN-2026-00481</td>
                  <td className="py-3 px-3 text-slate-300 font-sans">Goods Receipt (Vendor PO-991)</td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-bold">+20</td>
                  <td className="py-3 px-3 text-right text-slate-500">—</td>
                  <td className="py-3 px-3 text-right text-white font-bold">70</td>
                  <td className="py-3 px-3 text-slate-400 font-sans">Said Al-Rawahi</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 text-slate-400">2026-02-18</td>
                  <td className="py-3 px-3 text-amber-400">GIN-2026-00912</td>
                  <td className="py-3 px-3 text-slate-300 font-sans">Goods Issue (PDO Job Order)</td>
                  <td className="py-3 px-3 text-right text-slate-500">—</td>
                  <td className="py-3 px-3 text-right text-amber-400 font-bold">-20</td>
                  <td className="py-3 px-3 text-right text-white font-bold">{currentItemForBinCard.totalStockOnHand}</td>
                  <td className="py-3 px-3 text-slate-400 font-sans">Khamis Al-Harthy</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ABC / XYZ CLASSIFICATION MATRIX */}
      {activeTab === 'abc_xyz' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">ABC-XYZ Dual Classification Matrix</h3>
              <p className="text-xs text-slate-400">
                ABC = Annual Value Consumption (Pareto 80/15/5%) | XYZ = Demand Predictability & Volatility
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/50 border border-cyan-800/50 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase">Class AX (High Value, Steady Demand)</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800">Auto-Replenish</span>
              </div>
              <p className="text-xs text-slate-300">
                Pipes, Valves, High-Grade Flanges. Strict JIT replenishment with fixed min/max buffers.
              </p>
            </div>

            <div className="p-4 bg-slate-800/50 border border-amber-800/50 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase">Class BY (Medium Value, Seasonal)</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-800">Buffer Review</span>
              </div>
              <p className="text-xs text-slate-300">
                Motors, Gaskets, Pumps. Dynamic safety stock recalculated quarterly based on project trends.
              </p>
            </div>

            <div className="p-4 bg-slate-800/50 border border-purple-800/50 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase">Class CZ (Low Value, Sporadic)</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-950 text-purple-300 border border-purple-800">On-Demand Order</span>
              </div>
              <p className="text-xs text-slate-300">
                Specialized Fasteners, Custom Gaskets. Direct back-to-back purchase on confirmed client order.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

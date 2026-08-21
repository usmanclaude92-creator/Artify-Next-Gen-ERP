import React, { useState } from 'react';
import { useInventoryStore } from '../../services/inventoryStore';
import { StockReservation, CycleCountCampaign, CycleCountLine } from '../../types';
import {
  Sliders,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  Lock,
  Unlock,
  RotateCcw,
  Calculator,
  DollarSign,
  TrendingDown,
  Clock,
  Sparkles,
  ClipboardList
} from 'lucide-react';

interface InventoryControlViewProps {
  initialTab?: 'reservations' | 'reorder_points' | 'eoq_minmax' | 'cycle_counts';
  onNavigate?: (route: any) => void;
}

export const InventoryControlView: React.FC<InventoryControlViewProps> = ({
  initialTab = 'reservations',
  onNavigate
}) => {
  const {
    reservations,
    cycleCounts,
    items,
    warehouses,
    createReservation,
    releaseReservation,
    createCycleCount,
    recordCountLine,
    reconcileCycleCount
  } = useInventoryStore();

  const [activeTab, setActiveTab] = useState<'reservations' | 'reorder_points' | 'eoq_minmax' | 'cycle_counts'>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [isCycleCountModalOpen, setIsCycleCountModalOpen] = useState(false);
  const [selectedCountCampaign, setSelectedCountCampaign] = useState<CycleCountCampaign | null>(null);

  // Reserve Modal State
  const [reserveType, setReserveType] = useState<'HARD_ALLOCATION' | 'SOFT_ALLOCATION'>('HARD_ALLOCATION');
  const [reserveRef, setReserveRef] = useState('SO-2026-0941');
  const [reserveTarget, setReserveTarget] = useState('PDO Harweel Phase 3');
  const [reserveSku, setReserveSku] = useState(items[0]?.sku || '');
  const [reserveQty, setReserveQty] = useState(15);
  const [reserveWh, setReserveWh] = useState(warehouses[0]?.id || '');

  // EOQ Calculator Interactive State
  const [annualDemand, setAnnualDemand] = useState(2500);
  const [orderCostOMR, setOrderCostOMR] = useState(45);
  const [holdingCostPercent, setHoldingCostPercent] = useState(18); // 18% of unit cost
  const [unitCostOMR, setUnitCostOMR] = useState(120);

  // EOQ Formula: sqrt((2 * D * S) / H)
  const holdingCostPerUnit = (holdingCostPercent / 100) * unitCostOMR;
  const calculatedEOQ = Math.round(Math.sqrt((2 * annualDemand * orderCostOMR) / (holdingCostPerUnit || 1)));
  const optimalOrdersPerYear = (annualDemand / (calculatedEOQ || 1)).toFixed(1);
  const totalAnnualInventoryCostOMR = (
    (annualDemand / calculatedEOQ) * orderCostOMR +
    (calculatedEOQ / 2) * holdingCostPerUnit
  ).toFixed(2);

  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = items.find((i) => i.sku === reserveSku) || items[0];
    const wh = warehouses.find((w) => w.id === reserveWh);

    createReservation({
      referenceType: 'SALES_ORDER',
      referenceDocNumber: reserveRef,
      targetEntityName: reserveTarget,
      reservationType: reserveType,
      itemId: item.id,
      sku: item.sku,
      itemName: item.name,
      warehouseId: reserveWh,
      warehouseName: wh?.name || 'Warehouse',
      reservedQuantity: reserveQty,
      uom: item.baseUom,
      status: 'ALLOCATED',
      expiryDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      createdByName: 'Said Al-Rawahi'
    });

    setIsReserveModalOpen(false);
  };

  const handleCreateCountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const wh = warehouses[0];
    const lines: CycleCountLine[] = items.map((itm) => ({
      id: `cntline-${itm.id}-${Date.now()}`,
      itemId: itm.id,
      sku: itm.sku,
      itemName: itm.name,
      uom: itm.baseUom,
      systemQuantity: itm.totalStockOnHand,
      countedQuantity: itm.totalStockOnHand, // default same, user can edit
      varianceQuantity: 0,
      varianceValueOMR: 0,
      unitCostOMR: itm.unitCostOMR,
      status: 'COUNTED'
    }));

    createCycleCount({
      title: `Q1-2026 Scheduled Blind Cycle Count (${wh.code})`,
      warehouseId: wh.id,
      warehouseName: wh.name,
      abcClassification: 'A',
      frequency: 'MONTHLY',
      lines,
      toleranceThresholdPercent: 1.0,
      totalLinesCount: lines.length,
      linesCounted: lines.length,
      totalVarianceValueOMR: 0,
      status: 'COUNTING_IN_PROGRESS',
      assignedAuditorName: 'Khamis Al-Harthy (Senior Internal Auditor)'
    });

    setIsCycleCountModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-950/60 text-amber-400 border border-amber-800/40">
              07.05
            </span>
            <h2 className="text-xl font-bold text-white">Inventory Control & Cycle Counting</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Order stock reservations, automated reorder thresholds, EOQ buffer calculators, and audit reconciliations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('reservations')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'reservations' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Stock Reservations ({reservations.length})
            </button>
            <button
              onClick={() => setActiveTab('reorder_points')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'reorder_points' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Reorder Points & Auto-PR
            </button>
            <button
              onClick={() => setActiveTab('eoq_minmax')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'eoq_minmax' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EOQ & Min/Max Calculator
            </button>
            <button
              onClick={() => setActiveTab('cycle_counts')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'cycle_counts' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cycle Count Audits ({cycleCounts.length})
            </button>
          </div>

          <button
            onClick={() => {
              if (activeTab === 'cycle_counts') setIsCycleCountModalOpen(true);
              else setIsReserveModalOpen(true);
            }}
            className="px-3.5 py-2 text-xs font-medium bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{activeTab === 'cycle_counts' ? 'New Audit Campaign' : 'Create Reservation'}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: STOCK RESERVATIONS */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-white">Active Order Allocations</span>
            </div>
            <span className="text-xs text-slate-400">Hard allocations lock physical inventory preventing double-commitment</span>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Reservation #</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Reference & Customer/Project</th>
                    <th className="py-3 px-3">Reserved Material</th>
                    <th className="py-3 px-3">Warehouse Hub</th>
                    <th className="py-3 px-3 text-right">Quantity</th>
                    <th className="py-3 px-3">Expiry Date</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">
                        {res.reservationNumber}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                          {res.reservationType === 'HARD_ALLOCATION' ? 'Hard Allocation' : 'Soft Allocation'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-white">{res.targetEntityName}</span>
                        <div className="text-[10px] text-cyan-400 font-mono">{res.referenceType}: {res.referenceDocNumber}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-cyan-400">{res.sku}</span>
                        <div className="text-slate-200">{res.itemName}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-300">{res.warehouseName}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-amber-400">
                        {res.reservedQuantity} {res.uom}
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-mono">{res.expiryDate}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-950/60 text-amber-300 border border-amber-800/40">
                          {res.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {res.status === 'ALLOCATED' && (
                          <button
                            onClick={() => releaseReservation(res.id)}
                            className="px-2.5 py-1 rounded text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                          >
                            Release
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REORDER POINTS & AUTOMATED PURCHASE REQUISITIONS */}
      {activeTab === 'reorder_points' && (
        <div className="space-y-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Automated Reorder Point (ROP) & Safety Stock Monitoring</h3>
                <p className="text-xs text-slate-400">
                  Formula: ROP = (Average Daily Usage × Lead Time) + Safety Stock Buffer
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => {
                const isBelow = item.totalStockOnHand <= item.reorderPoint;
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border space-y-3 ${
                      isBelow
                        ? 'bg-amber-950/20 border-amber-800/50'
                        : 'bg-slate-800/40 border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400">{item.sku}</span>
                        <h4 className="text-xs font-semibold text-white truncate max-w-[200px]">{item.name}</h4>
                      </div>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                          isBelow
                            ? 'bg-amber-950/60 text-amber-300 border-amber-800/50'
                            : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50'
                        }`}
                      >
                        {isBelow ? 'Auto-PR Triggered' : 'Stock Healthy'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                      <div className="bg-slate-900/70 p-2 rounded">
                        <span className="text-slate-400 text-[10px] block">On Hand</span>
                        <span className="text-white font-bold">{item.totalStockOnHand} {item.baseUom}</span>
                      </div>
                      <div className="bg-slate-900/70 p-2 rounded">
                        <span className="text-slate-400 text-[10px] block">ROP Trigger</span>
                        <span className="text-amber-400 font-bold">{item.reorderPoint} {item.baseUom}</span>
                      </div>
                      <div className="bg-slate-900/70 p-2 rounded">
                        <span className="text-slate-400 text-[10px] block">Safety Stock</span>
                        <span className="text-sky-400 font-bold">{item.safetyStock} {item.baseUom}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-400 pt-2 border-t border-slate-700/40">
                      <span>Lead Time: {item.leadTimeDays} Days</span>
                      <span>EOQ Batch: {item.economicOrderQty} {item.baseUom}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EOQ & WILSON LOT SIZE CALCULATOR */}
      {activeTab === 'eoq_minmax' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-amber-500/10 text-amber-400">
                <Calculator className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">Wilson EOQ Parameter Inputs</h3>
            </div>
            <p className="text-xs text-slate-400">
              Calculate optimal batch purchase quantity that balances order setup costs against carrying holding costs.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Annual Forecast Demand (Units / Year)</label>
                <input
                  type="number"
                  value={annualDemand}
                  onChange={(e) => setAnnualDemand(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Cost Per Order / PO Administrative Setup (OMR)</label>
                <input
                  type="number"
                  step="0.5"
                  value={orderCostOMR}
                  onChange={(e) => setOrderCostOMR(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Unit Purchase Cost (OMR)</label>
                <input
                  type="number"
                  step="1"
                  value={unitCostOMR}
                  onChange={(e) => setUnitCostOMR(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Annual Inventory Holding Cost Rate (%)</label>
                <input
                  type="number"
                  step="1"
                  value={holdingCostPercent}
                  onChange={(e) => setHoldingCostPercent(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
            <h3 className="text-sm font-semibold text-white">Optimized Economic Order Model Results</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-amber-950/30 border border-amber-800/50 rounded-xl text-center">
                <span className="text-xs text-amber-300 uppercase tracking-wider block">Recommended EOQ Lot</span>
                <span className="text-3xl font-bold font-mono text-amber-400 mt-1 block">
                  {calculatedEOQ} Units
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">Optimal batch replenishment size</span>
              </div>

              <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl text-center">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Orders Per Year</span>
                <span className="text-3xl font-bold font-mono text-white mt-1 block">
                  {optimalOrdersPerYear} POs
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">Average order frequency</span>
              </div>

              <div className="p-4 bg-emerald-950/30 border border-emerald-800/50 rounded-xl text-center">
                <span className="text-xs text-emerald-300 uppercase tracking-wider block">Total Annual Cost</span>
                <span className="text-3xl font-bold font-mono text-emerald-400 mt-1 block">
                  OMR {totalAnnualInventoryCostOMR}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">Min total holding + setup cost</span>
              </div>
            </div>

            <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
              <h4 className="font-semibold text-white">Mathematical Principles of the EOQ Calculation</h4>
              <p className="text-slate-400">
                The Economic Order Quantity identifies the exact minima where holding costs line intersects the ordering cost curve. Ordering in batches of <span className="font-mono text-amber-400">{calculatedEOQ} units</span> minimizes capital tie-up in Oman central warehouses while insulating against lead-time stockouts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CYCLE COUNT CAMPAIGNS & AUDIT SHEETS */}
      {activeTab === 'cycle_counts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cycleCounts.map((cc) => (
              <div
                key={cc.id}
                onClick={() => setSelectedCountCampaign(cc)}
                className="bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 rounded-xl p-5 shadow-sm cursor-pointer transition-colors space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-400">{cc.campaignNumber}</span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{cc.title}</h4>
                    <span className="text-xs text-slate-400">{cc.warehouseName}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    ABC Class {cc.abcClassification}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <div className="bg-slate-800/60 p-2 rounded">
                    <span className="text-slate-400 text-[10px] block">Audit Lines</span>
                    <span className="text-white font-bold">{cc.totalLinesCount} SKUs</span>
                  </div>
                  <div className="bg-slate-800/60 p-2 rounded">
                    <span className="text-slate-400 text-[10px] block">Variance Value</span>
                    <span className="text-emerald-400 font-bold">OMR {cc.totalVarianceValueOMR.toFixed(2)}</span>
                  </div>
                  <div className="bg-slate-800/60 p-2 rounded">
                    <span className="text-slate-400 text-[10px] block">Status</span>
                    <span className="text-amber-400 font-bold">{cc.status}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Auditor: {cc.assignedAuditorName}</span>
                  <span className="text-amber-400 font-medium">Open Count Sheet →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE RESERVATION MODAL */}
      {isReserveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Create Stock Allocation Reservation</h3>
              </div>
              <button onClick={() => setIsReserveModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleReserveSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Reservation Type</label>
                  <select
                    value={reserveType}
                    onChange={(e) => setReserveType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium"
                  >
                    <option value="HARD_ALLOCATION">Hard Allocation (Physical Lock)</option>
                    <option value="SOFT_ALLOCATION">Soft Allocation (Advisory Only)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Reference Order #</label>
                  <input
                    type="text"
                    required
                    value={reserveRef}
                    onChange={(e) => setReserveRef(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Client / Project Name</label>
                <input
                  type="text"
                  required
                  value={reserveTarget}
                  onChange={(e) => setReserveTarget(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Material SKU</label>
                  <select
                    value={reserveSku}
                    onChange={(e) => setReserveSku(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    {items.map((i) => (
                      <option key={i.id} value={i.sku}>{i.sku} — {i.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Quantity to Reserve</label>
                  <input
                    type="number"
                    required
                    value={reserveQty}
                    onChange={(e) => setReserveQty(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReserveModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold"
                >
                  Lock & Reserve Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CYCLE COUNT SHEET MODAL */}
      {selectedCountCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400">{selectedCountCampaign.campaignNumber}</span>
                <h3 className="text-base font-bold text-white">{selectedCountCampaign.title}</h3>
              </div>
              <button onClick={() => setSelectedCountCampaign(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Audit Count Sheet & Physical Reconciliation</h4>
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">SKU & Item</th>
                      <th className="py-2.5 px-2 text-right">System Qty</th>
                      <th className="py-2.5 px-2 text-right">Counted Qty</th>
                      <th className="py-2.5 px-2 text-right">Variance</th>
                      <th className="py-2.5 px-2 text-right">Variance (OMR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {selectedCountCampaign.lines.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-800/30">
                        <td className="py-2 px-3">
                          <span className="font-mono font-bold text-cyan-400">{l.sku}</span>
                          <div className="text-[11px] text-white truncate max-w-[220px]">{l.itemName}</div>
                        </td>
                        <td className="py-2 px-2 text-right font-mono text-slate-300">
                          {l.systemQuantity} {l.uom}
                        </td>
                        <td className="py-2 px-2 text-right font-mono font-bold text-white">
                          <input
                            type="number"
                            value={l.countedQuantity}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              recordCountLine(selectedCountCampaign.id, l.id, val);
                            }}
                            className="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-right font-mono text-white text-xs"
                          />
                        </td>
                        <td className="py-2 px-2 text-right font-mono font-bold text-emerald-400">
                          {l.varianceQuantity > 0 ? `+${l.varianceQuantity}` : l.varianceQuantity}
                        </td>
                        <td className="py-2 px-2 text-right font-mono text-slate-300">
                          OMR {l.varianceValueOMR.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400">Tolerance Limit: ±{selectedCountCampaign.toleranceThresholdPercent}%</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCountCampaign(null)}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    reconcileCycleCount(selectedCountCampaign.id);
                    setSelectedCountCampaign(null);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  Reconcile & Post Auto-Adjustment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

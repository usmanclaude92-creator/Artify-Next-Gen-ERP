// ==========================================
// ARTIFY ERP — MODULE 12: SUPPLY CHAIN MANAGEMENT (SCM)
// 12.03 — Material Planning View (MRP & Inventory Policy)
// ==========================================

import React, { useState } from 'react';
import { useScmStore } from '../../services/scmStore';
import {
  Layers,
  Calendar,
  Shield,
  Zap,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sliders,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Boxes,
  Truck
} from 'lucide-react';

export const MaterialPlanningView: React.FC = () => {
  const {
    mrpRequirements,
    inventoryPolicies,
    procurementSchedules,
    generatePurchaseOrderFromMrp,
    updateInventorySafetyLevel
  } = useScmStore();

  const [activeSubTab, setActiveSubTab] = useState<'mrp' | 'procurement' | 'inventory'>('mrp');
  const [generatedPoMessage, setGeneratedPoMessage] = useState<string | null>(null);

  const handleGeneratePo = (mrpId: string) => {
    const poNum = generatePurchaseOrderFromMrp(mrpId);
    setGeneratedPoMessage(`Successfully bridged to Procurement: Generated ${poNum}`);
    setTimeout(() => setGeneratedPoMessage(null), 5000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-950 text-emerald-400 border border-emerald-800 tracking-wider">
                12.03 MATERIAL PLANNING
              </span>
              <span className="text-xs text-slate-400 font-medium">Multi-Echelon MRP & Buffer Policies</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight mt-1">
              Time-Phased MRP Engine, Container Schedules & Dynamic Buffer Stocks
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Explode net requirements across bills of materials, automate replenishment trigger dates, and dynamically calculate safety stock buffers based on statistical demand variance.
            </p>
          </div>
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveSubTab('mrp')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'mrp'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>MRP Net Requirements (12.03.01)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('procurement')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'procurement'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Procurement Schedules (12.03.02)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'inventory'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Inventory Policies & Safety Stock (12.03.03)</span>
          </button>
        </div>
      </div>

      {generatedPoMessage && (
        <div className="bg-emerald-950/80 border border-emerald-700/60 rounded-2xl p-4 flex items-center justify-between text-emerald-300 text-xs font-bold animate-fadeIn">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {generatedPoMessage}
          </span>
          <button onClick={() => setGeneratedPoMessage(null)} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {/* ----------------- SUB-TAB 1: MRP NET REQUIREMENTS ----------------- */}
      {activeSubTab === 'mrp' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Time-Phased MRP Net Requirements Explosion</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Lot-Sizing Rules: L4L / EOQ / POQ</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800 text-[10px] tracking-wider font-sans">
                  <tr>
                    <th className="py-3 px-4">Material Code & Description</th>
                    <th className="py-3 px-3 text-right">Gross Req</th>
                    <th className="py-3 px-3 text-right">Scheduled Rcpt</th>
                    <th className="py-3 px-3 text-right">On-Hand</th>
                    <th className="py-3 px-3 text-right">Safety Stock</th>
                    <th className="py-3 px-3 text-right">Net Req</th>
                    <th className="py-3 px-3 text-right font-bold text-emerald-400">Planned Release</th>
                    <th className="py-3 px-3 text-center">Required By</th>
                    <th className="py-3 px-3">Supplier</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {mrpRequirements.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-sans">
                        <span className="font-mono font-bold text-emerald-400 block">{row.materialCode}</span>
                        <span className="text-slate-300 text-xs">{row.materialName}</span>
                        <span className="text-[10px] text-slate-500 font-mono block">Rule: {row.lotSizing} • Lead: {row.leadTimeDays}d</span>
                      </td>
                      <td className="py-3 px-3 text-right text-slate-300">{row.grossRequirementQty}</td>
                      <td className="py-3 px-3 text-right text-cyan-400">+{row.scheduledReceiptsQty}</td>
                      <td className="py-3 px-3 text-right text-slate-400">{row.projectedOnHandQty}</td>
                      <td className="py-3 px-3 text-right text-amber-400">{row.safetyStockQty}</td>
                      <td className="py-3 px-3 text-right font-black text-white">
                        {row.netRequirementQty > 0 ? (
                          <span className="text-rose-400">{row.netRequirementQty}</span>
                        ) : (
                          <span className="text-slate-500">0</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-400">
                        {row.plannedOrderReleaseDate}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-300 font-mono">
                        {row.requiredDeliveryDate}
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-400 text-[11px]">
                        {row.primarySupplier}
                      </td>
                      <td className="py-3 px-4 text-center font-sans">
                        {row.orderActionRequired === 'Create PO' && row.actionStatus === 'Open' ? (
                          <button
                            onClick={() => handleGeneratePo(row.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                          >
                            Release PO ({row.plannedOrderReceiptQty})
                          </button>
                        ) : row.actionStatus === 'PO Generated' ? (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 text-[11px] font-bold border border-emerald-800">
                            PO Generated
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Stock Adequate</span>
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

      {/* ----------------- SUB-TAB 2: PROCUREMENT SCHEDULES ----------------- */}
      {activeSubTab === 'procurement' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {procurementSchedules.map((sched) => (
              <div
                key={sched.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/60">
                      {sched.scheduleRef}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">{sched.materialName}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Supplier: {sched.supplier}</p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      sched.status === 'Confirmed By Supplier'
                        ? 'bg-blue-950 text-blue-400 border border-blue-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    {sched.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Containers</span>
                    <p className="font-bold text-cyan-400 mt-0.5">{sched.targetContainerCount} x 40ft FCL</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Order Qty</span>
                    <p className="font-bold text-white mt-0.5">{sched.orderQuantity} {sched.orderVolumeUom}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">PO Ref</span>
                    <p className="font-bold text-emerald-400 mt-0.5">{sched.poReference || 'Pending'}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-mono text-slate-400">
                  <span>Departure: {sched.plannedDepartureDate}</span>
                  <span className="text-emerald-400 font-bold">ETA Port: {sched.estimatedArrivalDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 3: INVENTORY POLICIES & SAFETY STOCK ----------------- */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {inventoryPolicies.map((policy) => (
              <div
                key={policy.sku}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-400">{policy.sku}</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{policy.itemName}</h3>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-black ${
                      policy.stockHealth === 'Healthy'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {policy.stockHealth}
                  </span>
                </div>

                {/* Service Level Slider */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-bold">Target Service Level</span>
                    <span className="font-mono font-black text-purple-400">{policy.serviceLevelTargetPercent}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[95, 98, 99].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => updateInventorySafetyLevel(policy.sku, lvl)}
                        className={`flex-1 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          policy.serviceLevelTargetPercent === lvl
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {lvl}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantitative Results */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Safety Stock Buffer</span>
                    <p className="text-base font-black text-emerald-400 mt-0.5">{policy.calculatedSafetyStock} Units</p>
                  </div>

                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Reorder Point (ROP)</span>
                    <p className="text-base font-black text-cyan-400 mt-0.5">{policy.reorderPoint} Units</p>
                  </div>

                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Economic Order (EOQ)</span>
                    <p className="text-base font-black text-white mt-0.5">{policy.economicOrderQuantity} Units</p>
                  </div>

                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Current Physical Stock</span>
                    <p className="text-base font-black text-slate-200 mt-0.5">{policy.currentStock} Units</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

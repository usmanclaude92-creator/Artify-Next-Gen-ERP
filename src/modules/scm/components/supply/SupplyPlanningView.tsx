// ==========================================
// ARTIFY ERP — MODULE 12: SUPPLY CHAIN MANAGEMENT (SCM)
// 12.02 — Supply Planning View
// ==========================================

import React, { useState } from 'react';
import { useScmStore } from '../../services/scmStore';
import {
  GitPullRequest,
  Factory,
  ShieldAlert,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  TrendingDown,
  Layers,
  Building,
  DollarSign,
  Truck
} from 'lucide-react';

export const SupplyPlanningView: React.FC = () => {
  const {
    supplyForecasts,
    supplyAllocations,
    supplyScenarios,
    updateSupplyAllocationQty,
    adoptSupplyOptimizationScenario,
    currency
  } = useScmStore();

  const [activeSubTab, setActiveSubTab] = useState<'forecast' | 'allocation' | 'optimization'>('forecast');
  const [selectedRuleId, setSelectedRuleId] = useState<string>(supplyAllocations[0]?.id || '');

  const activeAllocationRule = supplyAllocations.find(r => r.id === selectedRuleId) || supplyAllocations[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-cyan-950 text-cyan-400 border border-cyan-800 tracking-wider">
                12.02 SUPPLY PLANNING
              </span>
              <span className="text-xs text-slate-400 font-medium">Capacity Matching & Network Optimization</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight mt-1">
              Supplier Capacity Modeling, Allocation & Landed Cost Optimization
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Reconcile unconstrained demand against vendor production limits, execute fair-share client rationing, and optimize multi-hub transportation landed costs.
            </p>
          </div>
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveSubTab('forecast')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'forecast'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Factory className="w-4 h-4" />
            <span>Supplier Capacity Forecast (12.02.01)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('allocation')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'allocation'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Supply Allocation & Rationing (12.02.02)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('optimization')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'optimization'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Network Optimization Solver (12.02.03)</span>
          </button>
        </div>
      </div>

      {/* ----------------- SUB-TAB 1: SUPPLY FORECAST & BOTTLENECKS ----------------- */}
      {activeSubTab === 'forecast' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supplyForecasts.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
                      <Factory className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-400">{item.supplierId}</span>
                      <h3 className="text-sm font-bold text-white mt-0.5">{item.supplierName}</h3>
                      <span className="text-[11px] text-slate-400">{item.plantOrigin}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase ${
                      item.constraintSeverity === 'None'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : item.constraintSeverity === 'Moderate'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {item.constraintType === 'None' ? 'Unconstrained' : item.constraintType}
                  </span>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Key Component Supply</span>
                  <p className="text-xs font-mono font-bold text-cyan-400">{item.componentSku}</p>
                  <p className="text-xs text-slate-300">{item.componentName}</p>
                </div>

                {/* Capacity vs Throughput Meter */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-400">Available vs Committed Capacity:</span>
                    <span className="font-bold text-white">
                      {item.actualAvailableCapacity} / {item.committedMonthlyCapacity} Units ({Math.round((item.actualAvailableCapacity / item.committedMonthlyCapacity) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        item.actualAvailableCapacity >= item.committedMonthlyCapacity
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                      style={{
                        width: `${Math.min(100, (item.actualAvailableCapacity / item.committedMonthlyCapacity) * 100)}%`
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Lead Time</span>
                    <p className="font-bold text-white">{item.leadTimeDays} Days</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">MOQ</span>
                    <p className="font-bold text-white">{item.minOrderQuantity} Units</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">OTIF Reliability</span>
                    <p className="font-bold text-emerald-400">{item.reliabilityRating}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 2: SUPPLY ALLOCATION MATRIX ----------------- */}
      {activeSubTab === 'allocation' && activeAllocationRule && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-800/60">
                  {activeAllocationRule.ruleCode}
                </span>
                <h3 className="text-base font-black text-white mt-1">
                  Scarce Material Rationing Matrix — {activeAllocationRule.itemName}
                </h3>
                <p className="text-xs text-slate-400">
                  SKU: <span className="font-mono text-blue-400">{activeAllocationRule.sku}</span> • Effective Date: {activeAllocationRule.effectiveDate}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-xl text-xs font-bold">
                  Rule Status: {activeAllocationRule.status}
                </span>
              </div>
            </div>

            {/* Shortage Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Unconstrained Demand</span>
                <p className="text-xl font-mono font-black text-white mt-1">
                  {activeAllocationRule.totalUnconstrainedDemand} Units
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Available Supply Stock</span>
                <p className="text-xl font-mono font-black text-cyan-400 mt-1">
                  {activeAllocationRule.totalAvailableStock} Units
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Material Deficit / Shortage</span>
                <p className="text-xl font-mono font-black text-rose-400 mt-1">
                  -{activeAllocationRule.shortageUnits} Units ({Math.round((activeAllocationRule.shortageUnits / activeAllocationRule.totalUnconstrainedDemand) * 100)}% Gap)
                </p>
              </div>
            </div>

            {/* Allocation Channels Interactive Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800 text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Client Channel / Project Target</th>
                    <th className="py-3 px-4">Priority Tier</th>
                    <th className="py-3 px-4 text-right">Requested Qty</th>
                    <th className="py-3 px-4 text-center">Allocated Qty (Interactive)</th>
                    <th className="py-3 px-4 text-right">Fulfillment Rate</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {activeAllocationRule.allocations.map((ch, idx) => (
                    <tr key={ch.channel} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-sans font-bold text-white">{ch.channel}</td>
                      <td className="py-3 px-4 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          ch.priority.includes('Tier 1') ? 'bg-indigo-950 text-indigo-400 border border-indigo-800' :
                          ch.priority.includes('Tier 2') ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {ch.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-300 font-bold">{ch.requestedQty} Units</td>
                      <td className="py-3 px-4 text-center font-sans">
                        <div className="inline-flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max={ch.requestedQty}
                            value={ch.allocatedQty}
                            onChange={(e) => updateSupplyAllocationQty(activeAllocationRule.id, idx, Number(e.target.value))}
                            className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-center font-mono font-bold text-cyan-400 focus:border-cyan-500 focus:outline-none"
                          />
                          <span className="text-slate-500 text-xs">/ {ch.requestedQty}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-bold">
                        <span className={ch.fulfillmentRatePercent === 100 ? 'text-emerald-400' : ch.fulfillmentRatePercent > 0 ? 'text-amber-400' : 'text-rose-400'}>
                          {ch.fulfillmentRatePercent}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-sans">
                        {ch.fulfillmentRatePercent === 100 ? (
                          <span className="text-emerald-400 text-xs flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Full
                          </span>
                        ) : ch.fulfillmentRatePercent > 0 ? (
                          <span className="text-amber-400 text-xs">Rationed</span>
                        ) : (
                          <span className="text-rose-400 text-xs">Deferred</span>
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

      {/* ----------------- SUB-TAB 3: NETWORK OPTIMIZATION SOLVER ----------------- */}
      {activeSubTab === 'optimization' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supplyScenarios.map((sc) => (
              <div
                key={sc.id}
                className={`bg-slate-900 border rounded-2xl p-5 shadow-xl transition-all space-y-4 ${
                  sc.status === 'Adopted'
                    ? 'border-cyan-500 ring-1 ring-cyan-500/30'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-black text-white">{sc.scenarioName}</h3>
                    <p className="text-xs text-slate-400 mt-1">{sc.description}</p>
                  </div>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase ${
                      sc.status === 'Adopted'
                        ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {sc.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Service Level Target</span>
                    <p className="font-bold text-purple-400 mt-0.5">{sc.serviceLevelTargetPercent}%</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Total Landed Cost</span>
                    <p className="font-bold text-white mt-0.5">
                      {(sc.estimatedTotalLandedCost / 1000000).toFixed(2)}M {currency}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Freight Budget</span>
                    <p className="font-bold text-cyan-400 mt-0.5">
                      {(sc.freightCost / 1000).toFixed(0)}k {currency}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Cost Savings</span>
                    <p className="font-black text-emerald-400 mt-0.5">+{sc.costSavingsPercent}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400 font-mono">
                    Suggested Cross-Dock Transfers: {sc.suggestedTransfersCount} movements
                  </span>
                  {sc.status !== 'Adopted' && (
                    <button
                      onClick={() => adoptSupplyOptimizationScenario(sc.id)}
                      className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all cursor-pointer shadow-lg shadow-cyan-600/20"
                    >
                      Adopt Routing Plan
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

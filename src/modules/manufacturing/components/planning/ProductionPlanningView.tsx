// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 08: MANUFACTURING
// 08.02 — Production Planning (Forecast, MPS, Capacity, MRP)
// ==========================================

import React, { useState } from 'react';
import { useManufacturingStore } from '../../services/manufacturingStore';
import { MrpRequirementLine, MasterProductionScheduleItem } from '../../types';
import { ERPRouteState } from '../../../../types/erp';
import {
  CalendarRange,
  TrendingUp,
  Sliders,
  Cpu,
  Play,
  CheckCircle2,
  AlertTriangle,
  Package,
  Layers,
  ArrowRight,
  Sparkles,
  FileCheck,
  RefreshCw
} from 'lucide-react';

interface ProductionPlanningViewProps {
  initialTab?: 'forecast' | 'mps' | 'capacity' | 'mrp';
  onNavigate: (route: ERPRouteState) => void;
}

export const ProductionPlanningView: React.FC<ProductionPlanningViewProps> = ({
  initialTab = 'forecast',
  onNavigate
}) => {
  const { forecasts, mpsPlans, workCenters, runMrpSimulation } = useManufacturingStore();
  const [activeTab, setActiveTab] = useState<'forecast' | 'mps' | 'capacity' | 'mrp'>(initialTab);
  const [selectedMpsIds, setSelectedMpsIds] = useState<string[]>(['mps-01', 'mps-02', 'mps-03']);
  const [mrpResults, setMrpResults] = useState<MrpRequirementLine[]>([]);
  const [mrpRunTimestamp, setMrpRunTimestamp] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const activeForecast = forecasts[0];

  const handleExecuteMrp = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const results = runMrpSimulation(selectedMpsIds);
      setMrpResults(results);
      setMrpRunTimestamp(new Date().toLocaleTimeString());
      setIsSimulating(false);
    }, 600);
  };

  const toggleMpsSelection = (id: string) => {
    setSelectedMpsIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
            <CalendarRange className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-white">08.02 — Production Planning & Material Requirements (MRP)</h2>
            <p className="text-xs text-slate-400">
              Demand forecast leveling, weekly Master Production Schedule (MPS), work center capacity load, and multi-level MRP explosion.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('mrp');
              handleExecuteMrp();
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Run Full MRP Simulation
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('forecast')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'forecast'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Rolling 12-Month Demand Forecast
        </button>
        <button
          onClick={() => setActiveTab('mps')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'mps'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CalendarRange className="w-4 h-4" />
          Master Production Schedule (MPS)
        </button>
        <button
          onClick={() => setActiveTab('capacity')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'capacity'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4" />
          Rough-Cut Capacity Planning (RCCP)
        </button>
        <button
          onClick={() => setActiveTab('mrp')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'mrp'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          MRP Engine & Material Orders
        </button>
      </div>

      {/* TAB 1: Demand Forecast */}
      {activeTab === 'forecast' && activeForecast && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-orange-400">{activeForecast.forecastCode}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{activeForecast.productName}</h3>
                <p className="text-xs text-slate-400">
                  Lead Time: <strong className="text-slate-200">{activeForecast.leadTimeDays} days</strong> • Safety Buffer:{' '}
                  <strong className="text-slate-200">{activeForecast.baselineSafetyStockUnits} units</strong> • Model Confidence:{' '}
                  <strong className="text-emerald-400">{activeForecast.confidenceScorePct}% (AI Calibrated)</strong>
                </p>
              </div>
            </div>

            {/* Buckets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {activeForecast.buckets.map((b) => (
                <div key={b.month} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="text-xs font-bold text-orange-400 text-center border-b border-slate-800 pb-1">
                    {b.monthName}
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Sales Target:</span>
                      <strong className="text-white">{b.salesForecastUnits}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Confirmed POs:</span>
                      <strong className="text-emerald-400">{b.confirmedOrdersUnits}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Planned Build:</span>
                      <strong className="text-cyan-400">{b.plannedProductionUnits}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800/80">
                      <span>Ending Stock:</span>
                      <strong className="text-white font-bold">{b.projectedEndingInventoryUnits}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Master Production Schedule (MPS) */}
      {activeTab === 'mps' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Master Production Schedule (MPS) Batches</h3>
              <p className="text-xs text-slate-400">
                Scheduled weekly manufacturing batches committed to plant lines.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">MPS Code / Week</th>
                  <th className="p-3">Target Finished Good</th>
                  <th className="p-3 text-center">Batch Quantity</th>
                  <th className="p-3">Assigned Plant Line</th>
                  <th className="p-3 text-center">Due Date</th>
                  <th className="p-3 text-center">Priority</th>
                  <th className="p-3 text-center">MPS Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {mpsPlans.map((mps) => (
                  <tr key={mps.id} className="hover:bg-slate-800/40">
                    <td className="p-3">
                      <div className="font-mono font-bold text-orange-400">{mps.mpsCode}</div>
                      <span className="text-[10px] text-slate-500 font-bold">{mps.planWeek}</span>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-white">{mps.productName}</div>
                      <span className="font-mono text-[10px] text-slate-500">{mps.productSku}</span>
                    </td>
                    <td className="p-3 text-center font-bold text-white text-sm">
                      {mps.plannedBatchQuantity} {mps.uom}
                    </td>
                    <td className="p-3 text-slate-300">{mps.assignedLine}</td>
                    <td className="p-3 text-center text-slate-400">{mps.targetDate}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          mps.priority === 'EMERGENCY_RUSH'
                            ? 'bg-rose-500/20 text-rose-300'
                            : mps.priority === 'HIGH'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {mps.priority.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                        {mps.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Capacity Planning (RCCP) */}
      {activeTab === 'capacity' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Work Center Capacity Loading vs Nominal Weekly Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workCenters.map((wc) => {
                // Calculate simulated demand from active MPS
                const scheduledHours =
                  wc.id === 'wc-01' ? 72.0 : wc.id === 'wc-02' ? 54.0 : wc.id === 'wc-04' ? 70.0 : 40.0;
                const utilPct = Math.round((scheduledHours / wc.effectiveCapacityHoursPerWeek) * 100);
                const isOverloaded = utilPct > 95;

                return (
                  <div key={wc.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono text-xs text-orange-400 font-bold">{wc.code}</span>
                        <h4 className="text-xs font-bold text-white mt-0.5">{wc.name}</h4>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isOverloaded ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {utilPct}% Load
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isOverloaded ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(100, utilPct)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Scheduled Demand: <strong className="text-white">{scheduledHours} hrs</strong></span>
                      <span>Effective Cap: <strong className="text-slate-300">{wc.effectiveCapacityHoursPerWeek} hrs</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MRP Simulation Engine */}
      {activeTab === 'mrp' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-400" />
                Material Requirements Planning (MRP) Multi-Level Explosion
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculate net component deficits after netting out on-hand inventory, WIP allocations, and scheduled purchase receipts.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExecuteMrp}
                disabled={isSimulating}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-sm transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                {isSimulating ? 'Exploding BOMs...' : 'Run MRP Engine'}
              </button>
            </div>
          </div>

          {/* MPS Inclusions selection */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
            <div className="text-xs font-semibold text-slate-300">Selected MPS Schedule Batches for MRP Run:</div>
            <div className="flex flex-wrap gap-2">
              {mpsPlans.map((mps) => {
                const isChecked = selectedMpsIds.includes(mps.id);
                return (
                  <button
                    key={mps.id}
                    onClick={() => toggleMpsSelection(mps.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 ${
                      isChecked
                        ? 'bg-orange-500/10 border-orange-500/40 text-orange-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isChecked ? 'text-orange-400' : 'text-slate-600'}`} />
                    <span>{mps.mpsCode} ({mps.productSku} × {mps.plannedBatchQuantity})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Table */}
          {mrpResults.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Calculated at {mrpRunTimestamp} • {mrpResults.length} Raw Material / Sub-Assembly lines exploded</span>
                <span className="text-emerald-400 font-medium">Ready to auto-generate PO Requisitions</span>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Material SKU / Name</th>
                      <th className="p-2.5 text-center">On-Hand</th>
                      <th className="p-2.5 text-center">WIP Allocated</th>
                      <th className="p-2.5 text-center">Free Available</th>
                      <th className="p-2.5 text-center">Gross Demand</th>
                      <th className="p-2.5 text-center">Net Shortage</th>
                      <th className="p-2.5 text-center">Lead Time</th>
                      <th className="p-2.5 text-center">Recommended Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {mrpResults.map((line) => (
                      <tr key={line.id} className="hover:bg-slate-800/40">
                        <td className="p-2.5">
                          <div className="font-semibold text-white">{line.materialName}</div>
                          <span className="font-mono text-[10px] text-slate-500">{line.materialSku}</span>
                        </td>
                        <td className="p-2.5 text-center font-mono">{line.currentStockOnHand} {line.uom}</td>
                        <td className="p-2.5 text-center font-mono text-slate-400">{line.allocatedInWip}</td>
                        <td className="p-2.5 text-center font-mono text-emerald-400">{line.freeAvailableStock}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-white">{line.grossRequirement}</td>
                        <td className="p-2.5 text-center font-mono">
                          {line.netRequirement > 0 ? (
                            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                              -{line.netRequirement} {line.uom}
                            </span>
                          ) : (
                            <span className="text-emerald-400 font-bold">0 (Covered)</span>
                          )}
                        </td>
                        <td className="p-2.5 text-center text-slate-400">{line.leadTimeDays} days</td>
                        <td className="p-2.5 text-center">
                          {line.suggestedAction === 'GENERATE_PURCHASE_REQUISITION' ? (
                            <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                              Generate PO Req ({line.recommendedOrderQuantity} {line.uom})
                            </span>
                          ) : line.suggestedAction === 'GENERATE_SUB_WORK_ORDER' ? (
                            <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 font-bold text-[10px] border border-purple-500/30">
                              Release Sub-WO ({line.recommendedOrderQuantity} {line.uom})
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-medium text-[10px]">
                              Stock Sufficient
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs space-y-2">
              <Layers className="w-8 h-8 text-slate-600 mx-auto" />
              <p>Click <strong>Run MRP Engine</strong> to calculate gross-to-net material shortages.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 08: MANUFACTURING
// 08.06 — Production Costing & Variance Analysis View
// ==========================================

import React, { useState } from 'react';
import { useManufacturingStore } from '../../services/manufacturingStore';
import { ERPRouteState } from '../../../../types/erp';
import {
  DollarSign,
  TrendingUp,
  BarChart2,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Search,
  Layers,
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface ProductionCostingViewProps {
  initialTab?: 'costing' | 'variance' | 'rollup';
  onNavigate: (route: ERPRouteState) => void;
}

export const ProductionCostingView: React.FC<ProductionCostingViewProps> = ({
  initialTab = 'costing',
  onNavigate
}) => {
  const { costSummary, workOrders } = useManufacturingStore();
  const [activeTab, setActiveTab] = useState<'costing' | 'variance' | 'rollup'>(initialTab);
  const [selectedWoId, setSelectedWoId] = useState(workOrders[0]?.id || '');

  const isFavorable = costSummary.totalVarianceOMR <= 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
            <DollarSign className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-white">08.06 — Production Costing & Standard Variance Analysis</h2>
            <p className="text-xs text-slate-400">
              Standard vs actual cost absorption, Material Price/Quantity variances (MPV/MQV), Labor Efficiency variances (LEV), and Overhead rollups.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('costing')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'costing'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Standard vs Actual Cost Breakdown
        </button>
        <button
          onClick={() => setActiveTab('variance')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'variance'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          Four-Way Cost Variance Decomposition
        </button>
        <button
          onClick={() => setActiveTab('rollup')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'rollup'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          Work Order Cost Roll-Up Explorer
        </button>
      </div>

      {/* TAB 1: Cost Breakdown */}
      {activeTab === 'costing' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400">Total Standard Target</span>
              <div className="text-2xl font-bold text-white mt-1">
                OMR {costSummary.totalStandardCostOMR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">BOM Standard Rate Basis</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400">Total Actual Accumulated</span>
              <div className="text-2xl font-bold text-white mt-1">
                OMR {costSummary.totalActualCostOMR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Direct GL Shop Floor Postings</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400">Net Manufacturing Variance</span>
              <div className={`text-2xl font-bold mt-1 ${isFavorable ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isFavorable ? '-' : '+'}OMR {Math.abs(costSummary.totalVarianceOMR).toFixed(2)}
              </div>
              <p className="text-[11px] text-emerald-400 mt-1 font-semibold">
                {costSummary.variancePercentage}% Favorable (Under Budget)
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400">Scrap Loss Offset</span>
              <div className="text-2xl font-bold text-rose-400 mt-1">OMR 120.00</div>
              <p className="text-[11px] text-slate-500 mt-1">Within 2.0% allowance tolerance</p>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Cost Element Comparison (Standard vs Actual)</h3>

            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Cost Category</th>
                    <th className="p-3 text-right">Standard Cost (OMR)</th>
                    <th className="p-3 text-right">Actual Cost (OMR)</th>
                    <th className="p-3 text-right">Net Variance (OMR)</th>
                    <th className="p-3 text-center">Variance Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-orange-400" />
                      Direct Raw Materials Cost
                    </td>
                    <td className="p-3 text-right font-mono">
                      {costSummary.materialStandardCostOMR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-white">
                      {costSummary.materialActualCostOMR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-400">-200.00</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                        FAVORABLE
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      Direct Touch Labor Cost
                    </td>
                    <td className="p-3 text-right font-mono">
                      {costSummary.laborStandardCostOMR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-white">
                      {costSummary.laborActualCostOMR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-400">-160.00</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                        FAVORABLE
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-white flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-purple-400" />
                      Machine Run & Overhead Absorption
                    </td>
                    <td className="p-3 text-right font-mono">
                      {costSummary.machineStandardCostOMR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-white">
                      {costSummary.machineActualCostOMR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-400">-120.00</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                        FAVORABLE
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Four-Way Variance */}
      {activeTab === 'variance' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Four-Way Cost Variance Formula Decomposition</h3>
          <p className="text-xs text-slate-400">
            Standard industrial accounting equations isolating Price, Quantity, Efficiency, and Spending factors.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                  Material Price Variance (MPV)
                </h4>
                <span className="text-emerald-400 font-bold text-xs font-mono">-OMR 80.00 (F)</span>
              </div>
              <div className="font-mono text-[11px] text-slate-400 bg-slate-900 p-2 rounded">
                Formula: (Actual Unit Price - Standard Unit Price) × Actual Quantity
              </div>
              <p className="text-xs text-slate-400">
                Bulk procurement discount achieved on ASTM A105 forgings reduced actual raw material price below BOM benchmark.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                  Material Quantity Variance (MQV)
                </h4>
                <span className="text-emerald-400 font-bold text-xs font-mono">-OMR 120.00 (F)</span>
              </div>
              <div className="font-mono text-[11px] text-slate-400 bg-slate-900 p-2 rounded">
                Formula: (Actual Material Used - Standard Allowed) × Standard Price
              </div>
              <p className="text-xs text-slate-400">
                High first-pass yield in CNC machining resulted in lower scrap consumption than standard 2% scrap allowance.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Labor Efficiency Variance (LEV)
                </h4>
                <span className="text-emerald-400 font-bold text-xs font-mono">-OMR 160.00 (F)</span>
              </div>
              <div className="font-mono text-[11px] text-slate-400 bg-slate-900 p-2 rounded">
                Formula: (Actual Labor Hours - Standard Allowed Hours) × Standard Labor Rate
              </div>
              <p className="text-xs text-slate-400">
                Experienced ASME IX welding crew completed cladding operations in 14.5 hours vs standard 16.0 hours allowed.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Manufacturing Overhead Variance (MOV)
                </h4>
                <span className="text-emerald-400 font-bold text-xs font-mono">-OMR 120.00 (F)</span>
              </div>
              <div className="font-mono text-[11px] text-slate-400 bg-slate-900 p-2 rounded">
                Formula: Actual Machine Hours × Burden Rate vs Absorbed Fixed/Variable Standard
              </div>
              <p className="text-xs text-slate-400">
                Continuous 24-hr multi-shift scheduling resulted in higher overhead absorption rate across CNC bays.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Work Order Cost Roll-Up Explorer */}
      {activeTab === 'rollup' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Work Order Cost Roll-Up Explorer</h3>
            <select
              value={selectedWoId}
              onChange={(e) => setSelectedWoId(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
            >
              {workOrders.map((wo) => (
                <option key={wo.id} value={wo.id}>
                  {wo.orderNumber} — {wo.productName}
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Standard Unit Cost: <strong className="text-white">OMR 992.00</strong></span>
              <span className="text-slate-400">Actual Unit Cost: <strong className="text-emerald-400">OMR 968.00</strong></span>
              <span className="text-emerald-400 font-bold">Net Margin Gain: +2.4%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

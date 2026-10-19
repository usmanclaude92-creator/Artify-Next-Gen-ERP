// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 08: MANUFACTURING
// Executive Dashboard & Plant Cockpit
// ==========================================

import React, { useState } from 'react';
import { useManufacturingStore } from '../../services/manufacturingStore';
import { ERPUserRole, ERPRouteState } from '../../../../types/erp';
import {
  Factory,
  Activity,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Clock,
  Sparkles,
  GitFork,
  ClipboardList,
  Layers,
  Wrench,
  DollarSign,
  PackageCheck,
  RotateCcw,
  BarChart2
} from 'lucide-react';

interface ManufacturingDashboardViewProps {
  onNavigate: (route: ERPRouteState) => void;
  activeRole?: ERPUserRole;
}

export const ManufacturingDashboardView: React.FC<ManufacturingDashboardViewProps> = ({
  onNavigate,
  activeRole
}) => {
  const { stats, workOrders, workCenters, boms, scrapRecords, productionReceipts } = useManufacturingStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'lines' | 'ai_insights'>('overview');

  const inProgressOrders = workOrders.filter((w) => w.status === 'IN_PROGRESS');
  const recentReceipts = productionReceipts.slice(0, 4);
  const recentScraps = scrapRecords.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-50 dark:from-slate-900 via-orange-50 dark:via-orange-950/40 to-slate-50 dark:to-slate-900 border border-orange-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-orange-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-700 dark:text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Factory className="w-3.5 h-3.5" />
              Sohar Heavy Manufacturing Plant & Cleanroom Bay
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Manufacturing & Production Cockpit
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-2xl">
              Real-time shop floor execution, OEE plant analytics, multi-level BOM costing, finite capacity dispatching, and material requirements planning (MRP).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() =>
                onNavigate({
                  view: 'functional_area',
                  moduleId: 'manufacturing',
                  functionalAreaId: 'production-orders'
                })
              }
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-xl shadow-lg shadow-orange-600/20 transition-all text-sm"
            >
              <ClipboardList className="w-4 h-4" />
              Dispatch Work Order
            </button>
            <button
              onClick={() =>
                onNavigate({
                  view: 'functional_area',
                  moduleId: 'manufacturing',
                  functionalAreaId: 'production-planning'
                })
              }
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium rounded-xl transition-all text-sm"
            >
              <Calendar className="w-4 h-4" />
              MPS & MRP Run
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Work Orders */}
        <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-orange-500/40 rounded-xl p-4 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Active Work Orders</span>
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-700 dark:text-orange-400">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats.activeWorkOrdersCount}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              {stats.workOrdersInProgress} Running
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-orange-500 h-full rounded-full"
              style={{
                width: `${(stats.workOrdersInProgress / (stats.activeWorkOrdersCount || 1)) * 100}%`
              }}
            />
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">
            {stats.workOrdersReleased} Released • {stats.workOrdersCompletedMTD} Completed MTD
          </p>
        </div>

        {/* Card 2: Overall Equipment Effectiveness (OEE) */}
        <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 rounded-xl p-4 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Plant OEE Efficiency</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.overallEquipmentEffectivenessPct}%</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +3.1% MoM
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${stats.overallEquipmentEffectivenessPct}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">
            Availability: 93.4% • Performance: 90.7% • Quality: 99.1%
          </p>
        </div>

        {/* Card 3: Work-In-Progress (WIP) Valuation */}
        <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 rounded-xl p-4 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Active WIP Valuation</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              OMR {stats.totalWipValuationOMR.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">5 Bays</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-500 h-full rounded-full" style={{ width: '68%' }} />
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">
            FG Output Value MTD: OMR {stats.finishedGoodsProducedValueOMR.toLocaleString()}
          </p>
        </div>

        {/* Card 4: Quality & Scrap Rate */}
        <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-rose-500/40 rounded-xl p-4 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Scrap Defect Rate</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.scrapRatePercentage}%</span>
            <span className="text-xs text-slate-600 dark:text-slate-400">Target &lt; 2.0%</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full"
              style={{ width: `${Math.min(100, stats.scrapRatePercentage * 40)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">
            Net Cost Variance: <span className="text-emerald-600 dark:text-emerald-400 font-medium">OMR 480 Favorable</span>
          </p>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'border-orange-500 text-orange-700 dark:text-orange-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          Active Shop Floor Jobs & Work Centers
        </button>
        <button
          onClick={() => setActiveTab('lines')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'lines'
              ? 'border-orange-500 text-orange-700 dark:text-orange-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Wrench className="w-4 h-4" />
          Plant Work Center Load & OEE Matrix
        </button>
        <button
          onClick={() => setActiveTab('ai_insights')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'ai_insights'
              ? 'border-orange-500 text-orange-700 dark:text-orange-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-orange-700 dark:text-orange-400" />
          AI Production Optimizer & Anomaly Feed
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Work Orders in Progress */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-700 dark:text-orange-400" />
                Live Shop Floor Production Queue
              </h3>
              <button
                onClick={() =>
                  onNavigate({
                    view: 'functional_area',
                    moduleId: 'manufacturing',
                    functionalAreaId: 'production-orders'
                  })
                }
                className="text-xs text-orange-700 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 font-medium flex items-center gap-1"
              >
                View all orders <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {inProgressOrders.map((wo) => {
                const completedSteps = wo.operations.filter((o) => o.status === 'COMPLETED').length;
                const totalSteps = wo.operations.length || 1;
                const progressPct = Math.round((completedSteps / totalSteps) * 100);

                return (
                  <div
                    key={wo.id}
                    className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl p-4 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-700 dark:text-orange-400 font-mono text-xs font-bold">
                          {wo.orderNumber}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{wo.productName}</h4>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                wo.priority === 'EMERGENCY_RUSH'
                                  ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                                  : wo.priority === 'HIGH'
                                  ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {wo.priority.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                            Customer: <span className="text-slate-700 dark:text-slate-300">{wo.customerName || 'Stock Build'}</span> • Plant:{' '}
                            <span className="text-slate-700 dark:text-slate-300">{wo.productionPlant}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right sm:self-center">
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          {wo.completedQuantity} / {wo.plannedQuantity} {wo.uom}
                        </div>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{progressPct}% Routed</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    {/* Active Operation Badge */}
                    <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>
                          Current Op:{' '}
                          <strong className="text-slate-800 dark:text-slate-200">
                            {wo.operations.find((o) => o.status === 'RUNNING')?.operationName ||
                              'Final Assembly & Testing'}
                          </strong>
                        </span>
                      </div>
                      <div className="text-slate-600 dark:text-slate-400">
                        Lead: <strong className="text-slate-700 dark:text-slate-300">{wo.supervisor}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Output Receipts & Scrap Alerts */}
          <div className="space-y-6">
            {/* Recent Output Receipts */}
            <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Recent Production Receipts
                </h3>
                <span className="text-[11px] text-slate-600 dark:text-slate-400">QC Released</span>
              </div>

              <div className="space-y-2.5">
                {recentReceipts.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-2.5 rounded-lg bg-slate-50/60 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">{rec.productName}</div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                        Lot: <span className="font-mono text-slate-700 dark:text-slate-300">{rec.lotBatchNumber}</span> • Qty:{' '}
                        <strong className="text-emerald-600 dark:text-emerald-400">{rec.receivedQuantity} {rec.uom}</strong>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        OMR {rec.totalInventoryValuationOMR.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{rec.receivedDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scrap Defect Incident Log */}
            <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  Scrap & Defect Root Causes
                </h3>
                <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">5-Whys Logged</span>
              </div>

              <div className="space-y-2.5">
                {recentScraps.map((sc) => (
                  <div
                    key={sc.id}
                    className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-900/30 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">{sc.defectDescription.slice(0, 48)}...</span>
                      <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                        -OMR {sc.estimatedScrapValueLossOMR}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Reason: <strong className="text-slate-700 dark:text-slate-300">{sc.reasonCode.replace(/_/g, ' ')}</strong> • Work Center:{' '}
                      <span className="text-slate-700 dark:text-slate-300">{sc.workCenterName}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Work Centers Matrix */}
      {activeTab === 'lines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workCenters.map((wc) => (
            <div
              key={wc.id}
              className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-orange-500/30 rounded-xl p-4 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-orange-700 dark:text-orange-400 font-mono text-xs font-bold">
                    {wc.code}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">{wc.name}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{wc.plantLocation}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                  {wc.status}
                </span>
              </div>

              {/* OEE Metric Gauges */}
              <div className="mt-4 grid grid-cols-3 gap-2 bg-slate-50/60 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800/60 text-center">
                <div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400">Availability</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{wc.oeeAvailabilityPct}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400">Performance</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{wc.oeePerformancePct}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400">Overall OEE</div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{wc.oeeOverallPct}%</div>
                </div>
              </div>

              {/* Capacity & Rates */}
              <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Weekly Effective Capacity:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{wc.effectiveCapacityHoursPerWeek} hrs</strong>
                </div>
                <div className="flex justify-between">
                  <span>Burden Rate:</span>
                  <strong className="text-slate-800 dark:text-slate-200">OMR {wc.totalHourlyBurdenRateOMR.toFixed(2)} / hr</strong>
                </div>
                <div className="flex justify-between">
                  <span>Installed Assets:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{wc.machines.length} Machines ({wc.machines[0]?.name.slice(0, 18)}...)</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: AI Insights */}
      {activeTab === 'ai_insights' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50 dark:from-orange-950/30 to-slate-50 dark:to-slate-900 border border-orange-500/30 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-orange-700 dark:text-orange-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">AI Production Scheduling & Capacity Optimizer</h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                The AI Engine has analyzed open sales order delivery milestones against CNC Bay 1 spindle utilization and recommends batching 12" valve body forgings in consecutive runs to eliminate 3.5 hours of tooling changeover setup time.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase">
                <AlertTriangle className="w-4 h-4" />
                Thermal Porosity Scrap Alert
              </div>
              <h5 className="text-sm font-semibold text-slate-900 dark:text-white">Inconel 625 Cladding Weld Cell Thermal Anomaly</h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Statistical process control detected a 1.2% variance in shielding gas flow during Pass 3 on WO-2026-0081. Automated recommendation: enact pre-pass digital gas pressure interlocks to eliminate scrap rework loss.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase">
                <TrendingUp className="w-4 h-4" />
                Raw Material Buffer Optimization
              </div>
              <h5 className="text-sm font-semibold text-slate-900 dark:text-white">MRP Stock Forecast Alignment</h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Projected Q4 demand for ASTM SA516 Gr 70N plates will exceed available safety buffer by 12,000 kg due to new OQ Gas Networks tenders. Automated Purchase Requisition suggested 3 weeks prior to prevent line starvation.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

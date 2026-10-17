import React, { useState } from 'react';
import { useInventoryStore } from '../../services/inventoryStore';
import {
  Package,
  Boxes,
  Building2,
  Repeat,
  RotateCcw,
  Sliders,
  Search,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Warehouse as WhIcon,
  Flame,
  Snowflake,
  Layers,
  ChevronRight,
  Plus,
  FileSpreadsheet,
  Activity
} from 'lucide-react';

interface InventoryDashboardViewProps {
  onNavigate: (route: {
    view: 'module' | 'functional_area' | 'process' | 'transaction';
    moduleId?: string;
    functionalAreaId?: string;
    processId?: string;
    transactionId?: string;
  }) => void;
  activeRole?: unknown;
}

export const InventoryDashboardView: React.FC<InventoryDashboardViewProps> = ({
  onNavigate,
  activeRole
}) => {
  const {
    items,
    warehouses,
    transactions,
    returns,
    reservations,
    batches,
    stats,
    aiRecommendations,
    applyAiRecommendation
  } = useInventoryStore();

  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'warehouses' | 'ai_insights'>('overview');

  const filteredWarehouses = selectedWarehouseId === 'all'
    ? warehouses
    : warehouses.filter((w) => w.id === selectedWarehouseId);

  return (
    <div className="space-y-6">
      {/* Executive KPI Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Total Inventory Asset Value</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
              OMR {stats.totalInventoryValuationOMR.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>{stats.totalSkuCount} Active Master SKUs</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">{stats.totalPhysicalUnitsOnHand.toLocaleString()} Physical Units</span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* KPI 2 */}
        <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Warehouse Space Utilization</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <WhIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
              {stats.warehouseCapacityUtilizationPercent}%
            </span>
            <span className="text-xs text-indigo-600 dark:text-indigo-400">across 5 hubs</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${stats.warehouseCapacityUtilizationPercent}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Occupied Pallets</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">17,990 / 23,800 Pallet Slots</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Stockout Risk & Buffers</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-700 dark:text-amber-400 font-mono">
              {stats.itemsBelowSafetyStockCount} SKUs
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400">below safety stock</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Open Hard Reservations</span>
            <span className="text-amber-700 dark:text-amber-400 font-medium">{stats.openReservationsCount} Orders Active</span>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* KPI 4 */}
        <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Stock Audit Accuracy Rate</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {stats.inventoryAccuracyRatePercent}%
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400">Cycle Count Target: &gt;99%</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Inventory Turn Ratio</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">{stats.averageInventoryTurnoverRatio}x / DSI {stats.daysSalesOfInventory}d</span>
          </div>
        </div>
      </div>

      {/* Interactive Hub Quick Actions & AI Copilot Banner */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-indigo-950/40 border border-cyan-500/20 rounded-xl p-5 relative overflow-hidden shadow-lg">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-cyan-500/20 text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold tracking-wider uppercase text-cyan-400">AI Inventory Copilot & Supply Optimization</span>
            </div>
            <h3 className="text-lg font-semibold text-white">
              Autonomous Stock Replenishment & Multi-Warehouse Allocation
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl">
              AI actively monitors project reservation queues, lead times across Oman transport routes, and FEFO shelf-life limits to prevent stockouts and minimize warehouse picker transit travel time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate({ view: 'functional_area', moduleId: 'inventory', functionalAreaId: 'stock-transactions' })}
              className="px-3.5 py-2 text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Stock Movement</span>
            </button>
            <button
              onClick={() => onNavigate({ view: 'functional_area', moduleId: 'inventory', functionalAreaId: 'inventory-control' })}
              className="px-3.5 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Cycle Count Sheet</span>
            </button>
            <button
              onClick={() => onNavigate({ view: 'functional_area', moduleId: 'inventory', functionalAreaId: 'traceability' })}
              className="px-3.5 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Lot Traceability</span>
            </button>
          </div>
        </div>

        {/* AI Recommendations Inline Carousel */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3">
          {aiRecommendations.map((rec) => (
            <div
              key={rec.id}
              className={`p-3 rounded-lg border text-xs transition-all ${
                rec.severity === 'CRITICAL'
                  ? 'bg-rose-950/30 border-rose-800/50 text-rose-200'
                  : rec.severity === 'WARNING'
                  ? 'bg-amber-950/30 border-amber-800/50 text-amber-200'
                  : 'bg-cyan-950/30 border-cyan-800/50 text-cyan-200'
              }`}
            >
              <div className="flex items-center justify-between font-semibold">
                <span className="flex items-center gap-1">
                  {rec.severity === 'CRITICAL' && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
                  {rec.severity === 'WARNING' && <Clock className="w-3.5 h-3.5 text-amber-400" />}
                  {rec.severity === 'OPPORTUNITY' && <Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
                  {rec.title}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900/60 border border-slate-800">
                  {rec.confidenceScore}% conf
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-300 line-clamp-2">
                {rec.description}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  {rec.impactValueOMR ? `Impact: OMR ${rec.impactValueOMR.toLocaleString()}` : 'Efficiency Gain'}
                </span>
                <button
                  onClick={() => applyAiRecommendation(rec.id)}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
                >
                  Apply Fix
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7 Functional Areas Navigation Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Authoritative Module Scope — 7 Functional Areas
          </h3>
          <span className="text-xs text-slate-600 dark:text-slate-400">Select any functional area to open its dedicated operational workbench</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 07.01 Item Master */}
          <div
            onClick={() => onNavigate({ view: 'functional_area', moduleId: 'inventory', functionalAreaId: 'item-master' })}
            className="group bg-white/70 dark:bg-slate-900/70 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                <Boxes className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">07.01</span>
            </div>
            <h4 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
              Item Master & Taxonomy
            </h4>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
              SKU definitions, categories, UOM conversion matrices, and technical material attributes.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>{items.length} Master SKUs</span>
              <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 07.02 Warehouse Management */}
          <div
            onClick={() => onNavigate({ view: 'functional_area', moduleId: 'inventory', functionalAreaId: 'warehouse-mgmt' })}
            className="group bg-white/70 dark:bg-slate-900/70 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">07.02</span>
            </div>
            <h4 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
              Warehouse Management
            </h4>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
              Multi-site hubs (Rusayl, Sohar, Duqm, Salalah), bin coordinates, cold/hazmat zones, and volumetric capacities.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>5 Active Warehouses</span>
              <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 07.03 Stock Transactions */}
          <div
            onClick={() => onNavigate({ view: 'functional_area', moduleId: 'inventory', functionalAreaId: 'stock-transactions' })}
            className="group bg-white/70 dark:bg-slate-900/70 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <Repeat className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">07.03</span>
            </div>
            <h4 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
              Stock Transactions
            </h4>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
              Opening balances, miscellaneous goods receipts, issues, 2-step inter-warehouse transfers, and adjustments.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>{transactions.length} Movement Vouchers</span>
              <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 07.04 Stock Returns */}
          <div
            onClick={() => onNavigate({ view: 'functional_area', moduleId: 'inventory', functionalAreaId: 'stock-returns' })}
            className="group bg-white/70 dark:bg-slate-900/70 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                <RotateCcw className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400">07.04</span>
            </div>
            <h4 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white group-hover:text-rose-700 dark:group-hover:text-rose-300 transition-colors">
              Stock Returns & QC Inspection
            </h4>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
              Vendor purchase returns, customer sales returns (RMA), and quarantine return inspection workbench.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>{returns.length} Return Cases</span>
              <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 07.05 Inventory Control */}
          <div
            onClick={() => onNavigate({ view: 'functional_area', moduleId: 'inventory', functionalAreaId: 'inventory-control' })}
            className="group bg-white/70 dark:bg-slate-900/70 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <Sliders className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 group-hover:text-amber-700 dark:group-hover:text-amber-400">07.05</span>
            </div>
            <h4 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors">
              Inventory Control & Counting
            </h4>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
              Order reservations, reorder points (ROP), Min/Max thresholds, EOQ buffers, and cycle count audits.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>{reservations.length} Active Reservations</span>
              <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 07.06 Traceability */}
          <div
            onClick={() => onNavigate({ view: 'functional_area', moduleId: 'inventory', functionalAreaId: 'traceability' })}
            className="group bg-white/70 dark:bg-slate-900/70 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400">07.06</span>
            </div>
            <h4 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors">
              Traceability & Expiry
            </h4>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
              Batch lot genealogy, supplier MTR certs, serial number warranty tracking, and FEFO shelf-life rules.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>{batches.length} Tracked Batches</span>
              <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 07.07 Inventory Valuation & Reporting */}
          <div
            onClick={() => onNavigate({ view: 'functional_area', moduleId: 'inventory', functionalAreaId: 'inventory-valuation-rep' })}
            className="group bg-white/70 dark:bg-slate-900/70 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400">07.07</span>
            </div>
            <h4 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
              Valuation & Stock Ledgers
            </h4>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
              FIFO vs Moving Average valuation layers, 6-bucket stock aging, bin movement cards, and ABC/XYZ analytics.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Financial Subledger</span>
              <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Warehouse Operations Live Status Card */}
          <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Multi-Site Network</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  All 5 Hubs Online
                </span>
              </div>
              <div className="mt-2 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-700 dark:text-slate-300">
                  <span>Rusayl Central Hub:</span>
                  <span className="font-mono text-cyan-600 dark:text-cyan-400">78.8% Utilized</span>
                </div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300">
                  <span>Sohar Port Freezone:</span>
                  <span className="font-mono text-cyan-600 dark:text-cyan-400">79.0% Utilized</span>
                </div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300">
                  <span>Duqm EPC Project Yard:</span>
                  <span className="font-mono text-cyan-600 dark:text-cyan-400">71.9% Utilized</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate({ view: 'functional_area', moduleId: 'inventory', functionalAreaId: 'warehouse-mgmt' })}
              className="mt-3 w-full py-1.5 text-xs font-medium text-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/30 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 border border-cyan-800/40 rounded-lg transition-colors"
            >
              Open Warehouse Topography
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Warehouse Live Occupancy & Critical SKUs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Warehouse Occupancy Grid */}
        <div className="lg:col-span-2 bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Physical Warehouse Utilization & Special Storage Zones</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Real-time pallet slots, cubic capacity, and climate/hazmat zones</p>
            </div>
            <select
              value={selectedWarehouseId}
              onChange={(e) => setSelectedWarehouseId(e.target.value)}
              className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Warehouses (5)</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWarehouses.map((wh) => (
              <div
                key={wh.id}
                className="p-4 bg-slate-100/70 dark:bg-slate-800/50 border border-slate-300/80 dark:border-slate-700/80 rounded-lg space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-800/50">
                      {wh.code}
                    </span>
                    <h4 className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{wh.name}</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">{wh.location}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-300 dark:border-slate-700">
                    {wh.utilizationPercent}%
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400">
                    <span>Pallet Slots:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{wh.occupiedPalletPositions} / {wh.totalPalletPositions}</span>
                  </div>
                  <div className="w-full bg-white dark:bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        wh.utilizationPercent > 80 ? 'bg-amber-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${wh.utilizationPercent}%` }}
                    />
                  </div>
                </div>

                {/* Zones Pills */}
                <div className="pt-2 border-t border-slate-300/50 dark:border-slate-700/50 flex flex-wrap gap-1.5">
                  {wh.zones.map((zone) => (
                    <span
                      key={zone.id}
                      className="px-2 py-0.5 rounded text-[10px] flex items-center gap-1 bg-white/80 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      {zone.zoneType === 'COLD_STORAGE' && <Snowflake className="w-3 h-3 text-sky-600 dark:text-sky-400" />}
                      {zone.zoneType === 'HAZMAT_BUNKER' && <Flame className="w-3 h-3 text-amber-700 dark:text-amber-400" />}
                      {zone.zoneType === 'QUARANTINE_QC' && <ShieldCheck className="w-3 h-3 text-rose-600 dark:text-rose-400" />}
                      {zone.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: High-Velocity SKUs & Stockout Alarms */}
        <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Stock Buffer Status</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Critical items & safety stock limits</p>
            </div>
            <button
              onClick={() => onNavigate({ view: 'functional_area', moduleId: 'inventory', functionalAreaId: 'item-master' })}
              className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View All SKUs</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item) => {
              const isLow = item.totalStockOnHand <= item.reorderPoint;
              return (
                <div
                  key={item.id}
                  className="p-3 bg-slate-100/70 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 border border-slate-300/60 dark:border-slate-700/60 rounded-lg transition-colors space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400">{item.sku}</span>
                      <h5 className="text-xs font-medium text-slate-900 dark:text-slate-100 line-clamp-1">{item.name}</h5>
                    </div>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                        isLow
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-800/50'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-800/50'
                      }`}
                    >
                      {isLow ? 'Reorder Alert' : 'Healthy Stock'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    <div className="bg-white/60 dark:bg-slate-900/60 p-1.5 rounded border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400 text-[10px] block">On Hand</span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">{item.totalStockOnHand} {item.baseUom}</span>
                    </div>
                    <div className="bg-white/60 dark:bg-slate-900/60 p-1.5 rounded border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400 text-[10px] block">Reserved</span>
                      <span className="font-bold text-amber-700 dark:text-amber-400 font-mono">{item.totalReservedStock} {item.baseUom}</span>
                    </div>
                    <div className="bg-white/60 dark:bg-slate-900/60 p-1.5 rounded border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400 text-[10px] block">Available</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{item.totalAvailableStock} {item.baseUom}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

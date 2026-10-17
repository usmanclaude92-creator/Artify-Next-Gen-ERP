import React from 'react';
import {
  ERPModule,
  ERPFunctionalArea,
  ERPProcess,
  ERPTransaction,
  ERPRouteState,
  ERPUserRole
} from '../../types/erp';
import { InventoryProvider } from './services/inventoryStore';
import { InventoryDashboardView } from './components/dashboard/InventoryDashboardView';
import { ItemMasterView } from './components/items/ItemMasterView';
import { WarehouseManagementView } from './components/warehouse/WarehouseManagementView';
import { StockTransactionsView } from './components/transactions/StockTransactionsView';
import { StockReturnsView } from './components/returns/StockReturnsView';
import { InventoryControlView } from './components/control/InventoryControlView';
import { TraceabilityView } from './components/traceability/TraceabilityView';
import { ValuationAndReportingView } from './components/valuation/ValuationAndReportingView';
import {
  ArrowLeft,
  Star,
  LayoutDashboard,
  Boxes,
  Building2,
  Repeat,
  RotateCcw,
  Sliders,
  Search,
  BarChart3,
  Package
} from 'lucide-react';

interface InventoryModuleRunnerProps {
  module: ERPModule;
  functionalArea?: ERPFunctionalArea;
  process?: ERPProcess;
  transaction?: ERPTransaction;
  onNavigate: (route: ERPRouteState) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  activeRole: ERPUserRole;
}

export const InventoryModuleRunner: React.FC<InventoryModuleRunnerProps> = ({
  module,
  functionalArea,
  process,
  transaction,
  onNavigate,
  isFavorite,
  onToggleFavorite,
  activeRole
}) => {
  const handleAreaNavigate = (faCodeOrId: string) => {
    const codeMap: Record<string, string> = {
      '07.01': 'item-master',
      '07.02': 'warehouse-mgmt',
      '07.03': 'stock-transactions',
      '07.04': 'stock-returns',
      '07.05': 'inventory-control',
      '07.06': 'traceability',
      '07.07': 'inventory-valuation-rep'
    };

    const targetId = codeMap[faCodeOrId] || faCodeOrId;
    onNavigate({
      view: 'functional_area',
      moduleId: 'inventory',
      functionalAreaId: targetId
    });
  };

  const renderActiveSubView = () => {
    if (!functionalArea) {
      return (
        <InventoryDashboardView
          onNavigate={(route: any) => onNavigate(route)}
          activeRole={activeRole}
        />
      );
    }

    switch (functionalArea.id) {
      case 'item-master':
        return (
          <ItemMasterView
            initialTab={
              process?.id === 'item-categories'
                ? 'categories'
                : process?.id === 'uom-management'
                ? 'uoms'
                : process?.id === 'item-attributes'
                ? 'attributes'
                : 'items'
            }
            onNavigate={onNavigate}
          />
        );
      case 'warehouse-mgmt':
        return (
          <WarehouseManagementView
            initialTab={
              process?.id === 'bin-locations'
                ? 'bins'
                : process?.id === 'warehouse-zones'
                ? 'zones'
                : process?.id === 'warehouse-capacity'
                ? 'capacity'
                : 'warehouses'
            }
            onNavigate={onNavigate}
          />
        );
      case 'stock-transactions':
        return (
          <StockTransactionsView
            initialTab={
              process?.id === 'goods-receipt'
                ? 'receipts'
                : process?.id === 'goods-issue'
                ? 'issues'
                : process?.id === 'stock-transfer'
                ? 'transfers'
                : process?.id === 'stock-adjustments'
                ? 'adjustments'
                : process?.id === 'opening-stock'
                ? 'opening'
                : 'all'
            }
            onNavigate={onNavigate}
          />
        );
      case 'stock-returns':
        return (
          <StockReturnsView
            initialTab={
              process?.id === 'purchase-returns'
                ? 'vendor_returns'
                : process?.id === 'return-inspection'
                ? 'qc_inspection'
                : process?.id === 'sales-returns-rma'
                ? 'customer_rma'
                : 'all'
            }
            onNavigate={onNavigate}
          />
        );
      case 'inventory-control':
        return (
          <InventoryControlView
            initialTab={
              process?.id === 'reorder-points'
                ? 'reorder_points'
                : process?.id === 'min-max-stock'
                ? 'eoq_minmax'
                : process?.id === 'physical-inventory'
                ? 'cycle_counts'
                : 'reservations'
            }
            onNavigate={onNavigate}
          />
        );
      case 'traceability':
        return (
          <TraceabilityView
            initialTab={
              process?.id === 'serial-numbers'
                ? 'serials'
                : process?.id === 'fefo-management'
                ? 'fefo_expiry'
                : process?.id === 'genealogy-search'
                ? 'genealogy'
                : 'batches'
            }
            onNavigate={onNavigate}
          />
        );
      case 'inventory-valuation-rep':
        return (
          <ValuationAndReportingView
            initialTab={
              process?.id === 'stock-aging'
                ? 'aging'
                : process?.id === 'bin-card'
                ? 'bincard'
                : process?.id === 'inventory-reports'
                ? 'abc_xyz'
                : 'valuation'
            }
            onNavigate={onNavigate}
          />
        );
      default:
        return (
          <InventoryDashboardView
            onNavigate={(route: any) => onNavigate(route)}
            activeRole={activeRole}
          />
        );
    }
  };

  const functionalAreasList = [
    { id: 'item-master', code: '07.01', name: 'Item Master & Taxonomy', icon: Boxes },
    { id: 'warehouse-mgmt', code: '07.02', name: 'Warehouse Management', icon: Building2 },
    { id: 'stock-transactions', code: '07.03', name: 'Stock Transactions', icon: Repeat },
    { id: 'stock-returns', code: '07.04', name: 'Stock Returns & QC', icon: RotateCcw },
    { id: 'inventory-control', code: '07.05', name: 'Inventory Control', icon: Sliders },
    { id: 'traceability', code: '07.06', name: 'Traceability & Expiry', icon: Search },
    { id: 'inventory-valuation-rep', code: '07.07', name: 'Valuation & Reporting', icon: BarChart3 }
  ];

  return (
    <InventoryProvider>
      <div className="space-y-6">
        {/* Module Header Bar */}
        <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-600 to-indigo-700 text-white shadow-md">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 border border-cyan-800/50">
                    Module 07
                  </span>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Inventory & Warehouse Management
                  </h1>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  SKU Master, Multi-Site Warehouse Topography, Stock Transactions, Quarantine Returns, Control, Traceability, & FIFO Valuation
                </p>
              </div>
            </div>

            {/* Quick Breadcrumbs & Favorite Toggle */}
            <div className="flex items-center gap-2 self-end lg:self-center">
              {functionalArea && (
                <button
                  onClick={() => onNavigate({ view: 'module', moduleId: 'inventory' })}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-300 dark:border-slate-700"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Module Cockpit</span>
                </button>
              )}
              <button
                onClick={onToggleFavorite}
                className={`p-2 rounded-lg border transition-colors ${
                  isFavorite
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={isFavorite ? 'Remove from Quick Access' : 'Pin to Quick Access'}
              >
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Quick Sub-Navigation Strip for 7 Functional Areas */}
          <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => onNavigate({ view: 'module', moduleId: 'inventory' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-all ${
                !functionalArea
                  ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                  : 'bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Cockpit</span>
            </button>

            {functionalAreasList.map((fa) => {
              const Icon = fa.icon;
              const isActive = functionalArea?.id === fa.id;
              return (
                <button
                  key={fa.id}
                  onClick={() => handleAreaNavigate(fa.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                      : 'bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="font-mono text-[10px] opacity-75">{fa.code}</span>
                  <span>{fa.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Sub-View Content */}
        <div className="min-h-[500px]">
          {renderActiveSubView()}
        </div>
      </div>
    </InventoryProvider>
  );
};

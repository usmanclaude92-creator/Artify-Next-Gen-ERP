// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 08: MANUFACTURING
// Main Module Runner & View Router
// ==========================================

import React from 'react';
import {
  ERPModule,
  ERPFunctionalArea,
  ERPProcess,
  ERPTransaction,
  ERPRouteState,
  ERPUserRole
} from '../../types/erp';
import { ManufacturingProvider } from './services/manufacturingStore';
import { ManufacturingDashboardView } from './components/dashboard/ManufacturingDashboardView';
import { ProductBomManagementView } from './components/bom/ProductBomManagementView';
import { ProductionPlanningView } from './components/planning/ProductionPlanningView';
import { ProductionOrdersView } from './components/orders/ProductionOrdersView';
import { WorkCentersView } from './components/workcenters/WorkCentersView';
import { ProductionOutputView } from './components/output/ProductionOutputView';
import { ProductionCostingView } from './components/costing/ProductionCostingView';
import {
  ArrowLeft,
  Star,
  LayoutDashboard,
  Factory,
  GitFork,
  CalendarRange,
  ClipboardList,
  Wrench,
  PackageCheck,
  DollarSign
} from 'lucide-react';

interface ManufacturingModuleRunnerProps {
  module: ERPModule;
  functionalArea?: ERPFunctionalArea;
  process?: ERPProcess;
  transaction?: ERPTransaction;
  onNavigate: (route: ERPRouteState) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  activeRole: ERPUserRole;
}

export const ManufacturingModuleRunner: React.FC<ManufacturingModuleRunnerProps> = ({
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
      '08.01': 'product-bom-mgmt',
      '08.02': 'production-planning',
      '08.03': 'production-orders',
      '08.04': 'work-centers',
      '08.05': 'production-output',
      '08.06': 'production-costing'
    };

    const targetId = codeMap[faCodeOrId] || faCodeOrId;
    onNavigate({
      view: 'functional_area',
      moduleId: 'manufacturing',
      functionalAreaId: targetId
    });
  };

  const renderActiveSubView = () => {
    if (!functionalArea) {
      return (
        <ManufacturingDashboardView
          onNavigate={(route: any) => onNavigate(route)}
          activeRole={activeRole}
        />
      );
    }

    switch (functionalArea.id) {
      case 'product-bom-mgmt':
        return (
          <ProductBomManagementView
            initialTab={
              process?.id === 'tx-bom-versions'
                ? 'versions'
                : process?.id === 'tx-routing'
                ? 'routings'
                : process?.id === 'tx-prod-specs'
                ? 'specs'
                : 'boms'
            }
            onNavigate={onNavigate}
          />
        );
      case 'production-planning':
        return (
          <ProductionPlanningView
            initialTab={
              process?.id === 'tx-prod-plan'
                ? 'mps'
                : process?.id === 'tx-capacity-planning'
                ? 'capacity'
                : process?.id === 'tx-mrp'
                ? 'mrp'
                : 'forecast'
            }
            onNavigate={onNavigate}
          />
        );
      case 'production-orders':
        return (
          <ProductionOrdersView
            initialTab={
              process?.id === 'tx-prod-orders'
                ? 'traveler'
                : process?.id === 'tx-material-issue-prod'
                ? 'issue'
                : process?.id === 'tx-material-return-prod'
                ? 'return'
                : 'orders'
            }
            onNavigate={onNavigate}
          />
        );
      case 'work-centers':
        return (
          <WorkCentersView
            initialTab={
              process?.id === 'tx-machine-capacity'
                ? 'oee'
                : process?.id === 'tx-labor-capacity'
                ? 'labor'
                : process?.id === 'tx-work-center-sched'
                ? 'scheduling'
                : 'centers'
            }
            onNavigate={onNavigate}
          />
        );
      case 'production-output':
        return (
          <ProductionOutputView
            initialTab={
              process?.id === 'tx-by-products'
                ? 'byproducts'
                : process?.id === 'tx-scrap-mgmt'
                ? 'scrap'
                : process?.id === 'tx-prod-completion'
                ? 'closeout'
                : 'receipts'
            }
            onNavigate={onNavigate}
          />
        );
      case 'production-costing':
        return (
          <ProductionCostingView
            initialTab={
              process?.id === 'tx-labor-cost-prod' || process?.id === 'tx-machine-cost-prod'
                ? 'variance'
                : process?.id === 'tx-prod-variance'
                ? 'rollup'
                : 'costing'
            }
            onNavigate={onNavigate}
          />
        );
      default:
        return (
          <ManufacturingDashboardView
            onNavigate={(route: any) => onNavigate(route)}
            activeRole={activeRole}
          />
        );
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Plant Cockpit', icon: LayoutDashboard, isDashboard: true },
    { id: 'product-bom-mgmt', label: '08.01 Product & BOM', icon: GitFork },
    { id: 'production-planning', label: '08.02 MPS & MRP Planning', icon: CalendarRange },
    { id: 'production-orders', label: '08.03 Production Orders', icon: ClipboardList },
    { id: 'work-centers', label: '08.04 Work Centers & OEE', icon: Wrench },
    { id: 'production-output', label: '08.05 Output & Scrap', icon: PackageCheck },
    { id: 'production-costing', label: '08.06 Costing & Variance', icon: DollarSign }
  ];

  return (
    <ManufacturingProvider>
      <div className="space-y-6">
        {/* Top Control Bar with Breadcrumbs and Quick Nav Tabs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Breadcrumb & Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate({ view: 'module', moduleId: 'manufacturing' })}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"
                title="Back to Manufacturing Hub"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wider">
                    {module.code} — {module.shortName}
                  </span>
                  {functionalArea && (
                    <>
                      <span>/</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{functionalArea.name}</span>
                    </>
                  )}
                  {process && (
                    <>
                      <span>/</span>
                      <span className="text-slate-600 dark:text-slate-400">{process.name}</span>
                    </>
                  )}
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Factory className="w-5 h-5 text-orange-700 dark:text-orange-400" />
                  {functionalArea ? functionalArea.name : 'Manufacturing & Production Cockpit'}
                </h2>
              </div>
            </div>

            {/* Favorite & Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleFavorite}
                className={`p-2 rounded-xl border transition-all ${
                  isFavorite
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Quick Sub-Navigation Pills */}
          <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.isDashboard ? !functionalArea : functionalArea?.id === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.isDashboard) {
                      onNavigate({ view: 'module', moduleId: 'manufacturing' });
                    } else {
                      handleAreaNavigate(item.id);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/30'
                      : 'bg-slate-100/60 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Sub-View Render */}
        <div className="transition-all duration-200">{renderActiveSubView()}</div>
      </div>
    </ManufacturingProvider>
  );
};

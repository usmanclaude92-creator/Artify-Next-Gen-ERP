import React from 'react';
import {
  ERPModule,
  ERPFunctionalArea,
  ERPProcess,
  ERPTransaction,
  ERPRouteState,
  ERPUserRole
} from '../../types/erp';
import { ProcurementProvider } from './services/procurementStore';
import { ProcurementDashboardView } from './components/dashboard/ProcurementDashboardView';
import { PurchasePlanningView } from './components/planning/PurchasePlanningView';
import { PurchaseRequisitionView } from './components/requisition/PurchaseRequisitionView';
import { RequestForQuotationView } from './components/rfq/RequestForQuotationView';
import { SupplierQuotationView } from './components/quotation/SupplierQuotationView';
import { PurchaseOrdersView } from './components/orders/PurchaseOrdersView';
import { PurchasingReceiptsView } from './components/receipts/PurchasingReceiptsView';
import { PurchaseInvoiceView } from './components/invoice/PurchaseInvoiceView';
import { PurchaseReturnsView } from './components/returns/PurchaseReturnsView';
import { SupplierManagementView } from './components/supplier/SupplierManagementView';
import {
  ArrowLeft,
  Star,
  LayoutDashboard
} from 'lucide-react';

interface ProcurementModuleRunnerProps {
  module: ERPModule;
  functionalArea?: ERPFunctionalArea;
  process?: ERPProcess;
  transaction?: ERPTransaction;
  onNavigate: (route: ERPRouteState) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  activeRole: ERPUserRole;
}

export const ProcurementModuleRunner: React.FC<ProcurementModuleRunnerProps> = ({
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
      '05.01': 'purchase-planning',
      '05.02': 'purchase-requisition',
      '05.03': 'rfq-mgmt',
      '05.04': 'supplier-quotation',
      '05.05': 'purchase-orders',
      '05.06': 'purchasing-receipts',
      '05.07': 'purchase-invoice',
      '05.08': 'purchase-returns',
      '05.09': 'supplier-mgmt'
    };

    const targetId = codeMap[faCodeOrId] || faCodeOrId;
    onNavigate({
      view: 'functional_area',
      moduleId: 'procurement',
      functionalAreaId: targetId
    });
  };

  const renderActiveSubView = () => {
    if (!functionalArea) {
      return <ProcurementDashboardView onNavigateToSubView={handleAreaNavigate} />;
    }

    switch (functionalArea.id) {
      case 'purchase-planning':
        return <PurchasePlanningView />;
      case 'purchase-requisition':
        return <PurchaseRequisitionView />;
      case 'rfq-mgmt':
        return <RequestForQuotationView />;
      case 'supplier-quotation':
        return <SupplierQuotationView />;
      case 'purchase-orders':
        return <PurchaseOrdersView />;
      case 'purchasing-receipts':
        return <PurchasingReceiptsView />;
      case 'purchase-invoice':
        return <PurchaseInvoiceView />;
      case 'purchase-returns':
        return <PurchaseReturnsView />;
      case 'supplier-mgmt':
        return <SupplierManagementView />;
      default:
        return <ProcurementDashboardView onNavigateToSubView={handleAreaNavigate} />;
    }
  };

  return (
    <ProcurementProvider>
      <div className="space-y-6 pb-12">
        {/* Module Header Bar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {functionalArea && (
                <button
                  onClick={() => onNavigate({ view: 'module', moduleId: 'procurement' })}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Back to Procurement Dashboard"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    {functionalArea ? functionalArea.code : module.code}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {module.category} • Phase {module.phaseNumber}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-slate-900 mt-1">
                  {functionalArea ? functionalArea.name : module.name}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {functionalArea ? functionalArea.description : module.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={onToggleFavorite}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  isFavorite
                    ? 'bg-amber-50 border-amber-200 text-amber-600'
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
              </button>

              {functionalArea && (
                <button
                  onClick={() => onNavigate({ view: 'module', moduleId: 'procurement' })}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Module Overview</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Sub-navigation Bar for Functional Areas */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-slate-100 no-scrollbar">
            <button
              onClick={() => onNavigate({ view: 'module', moduleId: 'procurement' })}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                !functionalArea
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Executive Cockpit
            </button>
            {module.functionalAreas.map((fa) => {
              const isActive = functionalArea?.id === fa.id;
              return (
                <button
                  key={fa.id}
                  onClick={() =>
                    onNavigate({
                      view: 'functional_area',
                      moduleId: 'procurement',
                      functionalAreaId: fa.id
                    })
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="font-mono opacity-70 mr-1.5">{fa.code}</span>
                  {fa.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-view Content */}
        {renderActiveSubView()}
      </div>
    </ProcurementProvider>
  );
};

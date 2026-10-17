import React from 'react';
import {
  ERPModule,
  ERPFunctionalArea,
  ERPProcess,
  ERPTransaction,
  ERPRouteState,
  ERPUserRole
} from '../../types/erp';
import { SalesCrmProvider } from './services/salesCrmStore';
import { SalesCrmDashboardView } from './components/dashboard/SalesCrmDashboardView';
import { LeadManagementView } from './components/leads/LeadManagementView';
import { CustomerManagementView } from './components/customer/CustomerManagementView';
import { OpportunityManagementView } from './components/opportunity/OpportunityManagementView';
import { SalesActivitiesView } from './components/activities/SalesActivitiesView';
import { SalesQuotationsView } from './components/quotations/SalesQuotationsView';
import { SalesOrdersView } from './components/orders/SalesOrdersView';
import { DeliveryAndBillingView } from './components/billing/DeliveryAndBillingView';
import { CustomerServiceView } from './components/service/CustomerServiceView';
import {
  ArrowLeft,
  Star,
  LayoutDashboard,
  TrendingUp,
  UserPlus,
  Users,
  Layers,
  PhoneCall,
  FileText,
  ShoppingBag,
  Truck,
  HelpCircle
} from 'lucide-react';

interface SalesCrmModuleRunnerProps {
  module: ERPModule;
  functionalArea?: ERPFunctionalArea;
  process?: ERPProcess;
  transaction?: ERPTransaction;
  onNavigate: (route: ERPRouteState) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  activeRole: ERPUserRole;
}

export const SalesCrmModuleRunner: React.FC<SalesCrmModuleRunnerProps> = ({
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
      '06.01': 'lead-management',
      '06.02': 'customer-management',
      '06.03': 'opportunity-management',
      '06.04': 'sales-activities',
      '06.05': 'sales-quotations',
      '06.06': 'sales-orders',
      '06.07': 'delivery-billing',
      '06.08': 'customer-service'
    };

    const targetId = codeMap[faCodeOrId] || faCodeOrId;
    onNavigate({
      view: 'functional_area',
      moduleId: 'sales-crm',
      functionalAreaId: targetId
    });
  };

  const renderActiveSubView = () => {
    if (!functionalArea) {
      return (
        <SalesCrmDashboardView
          onNavigate={(route: any) => onNavigate(route)}
          activeRole={activeRole}
        />
      );
    }

    switch (functionalArea.id) {
      case 'lead-management':
        return (
          <LeadManagementView
            activeTransactionId={transaction?.id}
            onNavigate={onNavigate}
            activeRole={activeRole}
          />
        );
      case 'customer-management':
        return (
          <CustomerManagementView
            activeTransactionId={transaction?.id}
            onNavigate={onNavigate}
            activeRole={activeRole}
          />
        );
      case 'opportunity-management':
        return (
          <OpportunityManagementView
            activeTransactionId={transaction?.id}
            onNavigate={onNavigate}
            activeRole={activeRole}
          />
        );
      case 'sales-activities':
        return (
          <SalesActivitiesView
            activeTransactionId={transaction?.id}
            onNavigate={onNavigate}
            activeRole={activeRole}
          />
        );
      case 'sales-quotations':
        return (
          <SalesQuotationsView
            activeTransactionId={transaction?.id}
            onNavigate={onNavigate}
            activeRole={activeRole}
          />
        );
      case 'sales-orders':
        return (
          <SalesOrdersView
            activeTransactionId={transaction?.id}
            onNavigate={onNavigate}
            activeRole={activeRole}
          />
        );
      case 'delivery-billing':
        return (
          <DeliveryAndBillingView
            activeTransactionId={transaction?.id}
            onNavigate={onNavigate}
            activeRole={activeRole}
          />
        );
      case 'customer-service':
        return (
          <CustomerServiceView
            activeTransactionId={transaction?.id}
            onNavigate={onNavigate}
            activeRole={activeRole}
          />
        );
      default:
        return (
          <SalesCrmDashboardView
            onNavigate={(route: any) => onNavigate(route)}
            activeRole={activeRole}
          />
        );
    }
  };

  return (
    <SalesCrmProvider>
      <div className="space-y-6 pb-12">
        {/* Module Header Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {functionalArea && (
                <button
                  onClick={() => onNavigate({ view: 'module', moduleId: 'sales-crm' })}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Back to Sales & CRM Cockpit"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                    {functionalArea ? functionalArea.code : module.code}
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    {module.category} • Phase {module.phaseNumber}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {functionalArea ? functionalArea.name : module.name}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {functionalArea ? functionalArea.description : module.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={onToggleFavorite}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  isFavorite
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-400'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
              </button>

              {functionalArea && (
                <button
                  onClick={() => onNavigate({ view: 'module', moduleId: 'sales-crm' })}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Executive Cockpit</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Sub-navigation Bar for Functional Areas */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 no-scrollbar">
            <button
              onClick={() => onNavigate({ view: 'module', moduleId: 'sales-crm' })}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                !functionalArea
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              06 Cockpit
            </button>
            {module.functionalAreas.map((fa) => {
              const isActive = functionalArea?.id === fa.id;
              return (
                <button
                  key={fa.id}
                  onClick={() =>
                    onNavigate({
                      view: 'functional_area',
                      moduleId: 'sales-crm',
                      functionalAreaId: fa.id
                    })
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
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
    </SalesCrmProvider>
  );
};

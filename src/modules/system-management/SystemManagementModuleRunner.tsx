import React, { useState } from 'react';
import {
  ERPModule,
  ERPFunctionalArea,
  ERPProcess,
  ERPTransaction,
  ERPRouteState,
  ERPUserRole
} from '../../types/erp';
import { SystemManagementProvider } from './services/systemManagementStore';
import { SystemDashboardView } from './components/SystemDashboardView';
import { CompanyOrganizationLandingView } from './components/CompanyOrganizationLandingView';
import { CompanySetupManagementView } from './components/CompanySetupManagementView';
import { BranchLocationSetupView } from './components/BranchLocationSetupView';
import { OrganizationalStructureView } from './components/OrganizationalStructureView';
import { FiscalYearSetupView } from './components/FiscalYearSetupView';
import { PostingPeriodsSetupView } from './components/PostingPeriodsSetupView';
import { GroupHoldingManagementView } from './components/GroupHoldingManagementView';
import { OrganizationManagementView } from './components/OrganizationManagementView';
import { UserAccessManagementView } from './components/UserAccessManagementView';
import { WorkflowApprovalManagementView } from './components/WorkflowApprovalManagementView';
import { FinancialPeriodControlsView } from './components/FinancialPeriodControlsView';
import { MasterDataManagementView } from './components/MasterDataManagementView';
import { NotificationAlertsView } from './components/NotificationAlertsView';
import { AuditTrailMonitoringView } from './components/AuditTrailMonitoringView';
import { IntegrationsApiView } from './components/IntegrationsApiView';
import { BackupRecoveryView } from './components/BackupRecoveryView';
import { SecurityManagementView } from './components/SecurityManagementView';
import { ArrowLeft, Sparkles, Star, LayoutDashboard, Layers, ChevronRight } from 'lucide-react';

interface SystemManagementModuleRunnerProps {
  module: ERPModule;
  functionalArea?: ERPFunctionalArea;
  process?: ERPProcess;
  transaction?: ERPTransaction;
  onNavigate: (route: ERPRouteState) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  activeRole: ERPUserRole;
}

export const SystemManagementModuleRunner: React.FC<SystemManagementModuleRunnerProps> = ({
  module,
  functionalArea,
  process,
  transaction,
  onNavigate,
  isFavorite,
  onToggleFavorite,
  activeRole
}) => {
  const [viewMode, setViewMode] = useState<'cockpit' | 'hierarchy'>('cockpit');

  const handleAreaNavigate = (faId: string, procId?: string, txId?: string) => {
    if (txId && procId) {
      onNavigate({
        view: 'transaction',
        moduleId: 'system-management',
        functionalAreaId: faId,
        processId: procId,
        transactionId: txId
      });
    } else if (procId) {
      onNavigate({
        view: 'process',
        moduleId: 'system-management',
        functionalAreaId: faId,
        processId: procId
      });
    } else {
      onNavigate({
        view: 'functional_area',
        moduleId: 'system-management',
        functionalAreaId: faId
      });
    }
  };

  // Determine which sub-view to render based on functionalArea / process / transaction
  const renderActiveSubView = () => {
    if (!functionalArea) {
      return <SystemDashboardView onNavigate={handleAreaNavigate} />;
    }

    // 01.01 Company & Organization Setup (Parent Level-2 and Level-3 children)
    if (
      functionalArea.id === 'company-organization-setup' ||
      functionalArea.id === '01.01' ||
      functionalArea.code === '01.01' ||
      functionalArea.id === 'org-setup'
    ) {
      if (process) {
        switch (process.id) {
          case 'company-setup':
          case '01.01.01':
            return (
              <CompanySetupManagementView
                initialTransactionId={transaction?.id}
                initialTransactionCode={transaction?.code}
              />
            );
          case 'branch-location-setup':
          case '01.01.02':
            return (
              <BranchLocationSetupView
                initialTransactionId={transaction?.id}
                initialTransactionCode={transaction?.code}
              />
            );
          case 'org-structure':
          case 'organizational-structure':
          case '01.01.03':
            return (
              <OrganizationalStructureView
                initialTransactionId={transaction?.id}
                initialTransactionCode={transaction?.code}
              />
            );
          case 'fiscal-year':
          case 'fiscal-year-setup':
          case '01.01.04':
            return (
              <FiscalYearSetupView
                initialTransactionId={transaction?.id}
                initialTransactionCode={transaction?.code}
              />
            );
          case 'posting-periods':
          case 'posting-periods-setup':
          case '01.01.05':
            return (
              <PostingPeriodsSetupView
                initialTransactionId={transaction?.id}
                initialTransactionCode={transaction?.code}
              />
            );
          case 'group-holding-hierarchy':
          case 'group-holding':
          case 'group-hierarchy':
          case 'hierarchy':
          case 'manage-hierarchy':
          case '01.01.06':
            return <GroupHoldingManagementView />;
          default:
            return <CompanyOrganizationLandingView onNavigate={onNavigate} />;
        }
      }
      return <CompanyOrganizationLandingView onNavigate={onNavigate} />;
    }

    switch (functionalArea.id) {
      case 'user-access-mgmt':
        return <UserAccessManagementView />;
      case 'workflow-approval-mgmt':
        return <WorkflowApprovalManagementView />;
      case 'fin-period-controls':
        return <PostingPeriodsSetupView />;
      case 'master-data-mgmt':
        return <MasterDataManagementView />;
      case 'notifications-alerts':
        return <NotificationAlertsView />;
      case 'audit-trail-monitoring':
        return <AuditTrailMonitoringView />;
      case 'integrations-api':
        return <IntegrationsApiView />;
      case 'backup-recovery':
        return <BackupRecoveryView />;
      case 'security-mgmt':
        return <SecurityManagementView />;
      default:
        return <SystemDashboardView onNavigate={handleAreaNavigate} />;
    }
  };

  return (
    <SystemManagementProvider>
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Module Header Bar if inside functional area or process */}
        {functionalArea && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate({ view: 'module', moduleId: 'system-management' })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
                title="Back to Module Dashboard"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Executive Dashboard</span>
              </button>

              {process && (
                <>
                  <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
                  <button
                    onClick={() =>
                      onNavigate({
                        view: 'functional_area',
                        moduleId: 'system-management',
                        functionalAreaId: functionalArea.id
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-semibold cursor-pointer transition-colors border border-indigo-200 dark:border-indigo-800"
                    title="Back to Parent Level 2"
                  >
                    <span>{functionalArea.code} {functionalArea.name}</span>
                  </button>
                </>
              )}

              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                    {process ? process.code : functionalArea.code}
                  </span>
                  <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
                    {process ? process.name : functionalArea.name}
                  </h1>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {process ? process.description : functionalArea.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onToggleFavorite}
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                  isFavorite
                    ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    isFavorite ? 'text-amber-500 fill-amber-400' : 'text-slate-400'
                  }`}
                />
                <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Dynamic sub-view */}
        {renderActiveSubView()}
      </div>
    </SystemManagementProvider>
  );
};

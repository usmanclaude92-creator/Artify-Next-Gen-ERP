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
      case '01.02': {
        let activeTab: string | undefined = undefined;
        if (transaction?.id === 'tx-sod' || process?.id === 'sod-proc') activeTab = 'sod';
        else if (transaction?.id === 'tx-access-restrictions' || process?.id === 'restrictions-proc') activeTab = 'restrictions';
        else if (transaction?.id === 'tx-user-groups' || transaction?.id === 'tx-roles-perms' || process?.id === 'roles-proc') activeTab = 'groups';
        else if (transaction?.id === 'tx-user-mgmt') activeTab = 'users';
        return <UserAccessManagementView activeTab={activeTab} />;
      }
      case 'workflow-approval-mgmt':
      case '01.03': {
        let activeTab: string | undefined = undefined;
        if (transaction?.id === 'tx-approval-matrix' || process?.id === 'matrix-proc') activeTab = 'matrices';
        else if (transaction?.id === 'tx-doa' || process?.id === 'doa-proc') activeTab = 'delegations';
        else if (transaction?.id === 'tx-approval-limits' || process?.id === 'limits-proc') activeTab = 'limits';
        else if (transaction?.id === 'tx-escalation-rules' || process?.id === 'escalations-proc') activeTab = 'escalations';
        else if (transaction?.id === 'tx-approval-workflows') activeTab = 'workflows';
        return <WorkflowApprovalManagementView activeTab={activeTab} />;
      }
      case 'fin-period-controls':
      case '01.04': {
        let activeTab: string | undefined = undefined;
        if (transaction?.id === 'tx-doc-numbering' || process?.id === 'numbering-proc') activeTab = 'sequences';
        else if (transaction?.id === 'tx-posting-controls' || transaction?.id === 'tx-posting-ctrls' || process?.id === 'ctrls-proc') activeTab = 'controls';
        else if (transaction?.id === 'tx-period-lock' || transaction?.id === 'tx-period-locks' || process?.id === 'locks-proc') activeTab = 'locks';
        else if (transaction?.id === 'tx-posting-periods' || transaction?.id === 'tx-fiscal-year') activeTab = 'periods';
        return <FinancialPeriodControlsView activeTab={activeTab} />;
      }
      case 'master-data-mgmt':
      case '01.05': {
        let activeTab: string | undefined = undefined;
        if (transaction?.id === 'tx-duplicate-ctrl' || transaction?.id === 'tx-mdm-duplicates' || process?.id === 'duplicates-proc') activeTab = 'duplicates';
        else if (transaction?.id === 'tx-data-val' || transaction?.id === 'tx-mdm-validations' || process?.id === 'validations-proc') activeTab = 'validations';
        else if (transaction?.id === 'tx-mdm-approval' || transaction?.id === 'tx-mdm-approvals' || process?.id === 'approvals-proc') activeTab = 'approvals';
        else if (transaction?.id === 'tx-mdm-defs' || transaction?.id === 'tx-mdm-gov' || transaction?.id === 'tx-mdm-catalog') activeTab = 'catalog';
        return <MasterDataManagementView activeTab={activeTab} />;
      }
      case 'notifications-alerts':
      case '01.06': {
        let activeTab: string | undefined = undefined;
        if (transaction?.id === 'tx-email-notif' || transaction?.id === 'tx-notif-templates' || process?.id === 'templates-proc') activeTab = 'templates';
        else if (transaction?.id === 'tx-inapp-notif' || transaction?.id === 'tx-approval-alerts' || transaction?.id === 'tx-due-date-alerts' || transaction?.id === 'tx-exception-alerts' || transaction?.id === 'tx-notif-rules' || process?.id === 'rules-proc') activeTab = 'rules';
        else if (transaction?.id === 'tx-notif-alerts') activeTab = 'alerts';
        return <NotificationAlertsView activeTab={activeTab} />;
      }
      case 'audit-trail-monitoring':
      case '01.07': {
        let activeTab: string | undefined = undefined;
        if (transaction?.id === 'tx-login-hist' || transaction?.id === 'tx-login-history' || process?.id === 'logins-proc') activeTab = 'logins';
        else if (transaction?.id === 'tx-audit-trail' || transaction?.id === 'tx-user-activity-logs' || transaction?.id === 'tx-rec-change-hist' || transaction?.id === 'tx-trans-hist' || transaction?.id === 'tx-user-activity') activeTab = 'events';
        return <AuditTrailMonitoringView activeTab={activeTab} />;
      }
      case 'integration-api-mgmt':
      case 'integrations-api':
      case '01.08': {
        let activeTab: string | undefined = undefined;
        if (transaction?.id === 'tx-api-mgmt' || transaction?.id === 'tx-api-clients' || process?.id === 'clients-proc') activeTab = 'clients';
        else if (transaction?.id === 'tx-integration-logs' || process?.id === 'logs-proc') activeTab = 'logs';
        else if (transaction?.id === 'tx-ext-integration' || transaction?.id === 'tx-banking-integration' || transaction?.id === 'tx-tax-gov-integration' || transaction?.id === 'tx-integrations-hub') activeTab = 'integrations';
        return <IntegrationsApiView activeTab={activeTab} />;
      }
      case 'backup-recovery':
      case '01.09': {
        let activeTab: string | undefined = undefined;
        if (transaction?.id === 'tx-disaster-recovery' || transaction?.id === 'tx-recovery-logs' || transaction?.id === 'tx-dr-status' || process?.id === 'dr-proc') activeTab = 'dr';
        else if (transaction?.id === 'tx-scheduled-backup' || transaction?.id === 'tx-backup-config' || process?.id === 'config-proc') activeTab = 'config';
        else if (transaction?.id === 'tx-db-backup' || transaction?.id === 'tx-restore-mgmt' || transaction?.id === 'tx-backup-snapshots') activeTab = 'snapshots';
        return <BackupRecoveryView activeTab={activeTab} />;
      }
      case 'security-mgmt':
      case '01.10': {
        let activeTab: string | undefined = undefined;
        if (transaction?.id === 'tx-pwd-policies' || transaction?.id === 'tx-password-policy' || process?.id === 'passwords-proc') activeTab = 'passwords';
        else if (transaction?.id === 'tx-session-mgmt' || transaction?.id === 'tx-active-sessions' || process?.id === 'sessions-proc') activeTab = 'sessions';
        else if (transaction?.id === 'tx-sec-logs' || transaction?.id === 'tx-security-events' || process?.id === 'events-proc') activeTab = 'events';
        else if (transaction?.id === 'tx-sec-policies' || transaction?.id === 'tx-auth-mgmt' || transaction?.id === 'tx-security-policies') activeTab = 'policies';
        return <SecurityManagementView activeTab={activeTab} />;
      }
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

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
import { ArrowLeft, Sparkles, Star, LayoutDashboard, Layers } from 'lucide-react';

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

    switch (functionalArea.id) {
      case 'org-setup':
        return <OrganizationManagementView />;
      case 'user-access-mgmt':
        return <UserAccessManagementView />;
      case 'workflow-approval-mgmt':
        return <WorkflowApprovalManagementView />;
      case 'fin-period-controls':
        return <FinancialPeriodControlsView />;
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
        {/* Module Header Bar if inside functional area or transaction */}
        {functionalArea && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate({ view: 'module', moduleId: 'system-management' })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Executive Dashboard</span>
              </button>

              <div className="h-4 w-px bg-slate-200 hidden sm:block" />

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {functionalArea.code}
                  </span>
                  <h1 className="text-base sm:text-lg font-extrabold text-slate-900">
                    {functionalArea.name}
                  </h1>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{functionalArea.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onToggleFavorite}
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                  isFavorite ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${isFavorite ? 'text-amber-500 fill-amber-400' : 'text-slate-400'}`} />
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

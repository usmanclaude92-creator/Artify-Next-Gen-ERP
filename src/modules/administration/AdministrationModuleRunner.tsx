import React, { useState } from 'react';
import {
  ERPModule,
  ERPFunctionalArea,
  ERPProcess,
  ERPTransaction,
  ERPRouteState,
  ERPUserRole
} from '../../types/erp';
import { AdministrationProvider } from './services/administrationStore';
import { AdministrationDashboardView } from './components/dashboard/AdministrationDashboardView';
import { OfficeAdministrationView } from './components/office/OfficeAdministrationView';
import { CorrespondenceManagementView } from './components/correspondence/CorrespondenceManagementView';
import { DocumentManagementView } from './components/documents/DocumentManagementView';
import { InternalRequestsView } from './components/requests/InternalRequestsView';
import { TaskActivityView } from './components/tasks/TaskActivityView';
import { MeetingManagementView } from './components/meetings/MeetingManagementView';
import { TravelTransportationView } from './components/travel/TravelTransportationView';
import { GeneralBusinessServicesView } from './components/services/GeneralBusinessServicesView';
import {
  ArrowLeft,
  Sparkles,
  Star,
  LayoutDashboard,
  Layers,
  ChevronRight,
  Briefcase
} from 'lucide-react';

interface AdministrationModuleRunnerProps {
  module: ERPModule;
  functionalArea?: ERPFunctionalArea;
  process?: ERPProcess;
  transaction?: ERPTransaction;
  onNavigate: (route: ERPRouteState) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  activeRole: ERPUserRole;
}

export const AdministrationModuleRunner: React.FC<AdministrationModuleRunnerProps> = ({
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

  const handleAreaNavigate = (faCodeOrId: string) => {
    // Map code like '03.01' or id like 'office-admin'
    const codeMap: Record<string, string> = {
      '03.01': 'office-admin',
      '03.02': 'correspondence-mgmt',
      '03.03': 'document-mgmt',
      '03.04': 'internal-requests',
      '03.05': 'task-activity-mgmt',
      '03.06': 'meeting-mgmt',
      '03.07': 'travel-transport-admin',
      '03.08': 'general-business-services'
    };

    const targetId = codeMap[faCodeOrId] || faCodeOrId;
    onNavigate({
      view: 'functional_area',
      moduleId: 'administration',
      functionalAreaId: targetId
    });
  };

  const renderActiveSubView = () => {
    if (!functionalArea) {
      return <AdministrationDashboardView onNavigateToSubView={handleAreaNavigate} />;
    }

    switch (functionalArea.id) {
      case 'office-admin':
      case '03.01': {
        let activeTab: string | undefined = undefined;
        if (transaction?.id === 'tx-facility-requests') activeTab = 'facilities';
        else if (transaction?.id === 'tx-stationery-mgmt') activeTab = 'stationery';
        else if (transaction?.id === 'tx-office-services') activeTab = 'services';
        else if (transaction?.id === 'tx-gen-admin') activeTab = 'notices';
        return <OfficeAdministrationView activeTab={activeTab} />;
      }
      case 'correspondence-mgmt':
      case '03.02': {
        let activeTab: string | undefined = undefined;
        if (transaction?.id === 'tx-incoming-corresp') activeTab = 'incoming';
        else if (transaction?.id === 'tx-outgoing-corresp') activeTab = 'outgoing';
        else if (transaction?.id === 'tx-internal-corresp') activeTab = 'internal';
        else if (transaction?.id === 'tx-corresp-tracking') activeTab = 'tracking';
        return <CorrespondenceManagementView activeTab={activeTab} />;
      }
      case 'document-mgmt':
      case '03.03': {
        let activeTab: string | undefined = undefined;
        if (transaction?.id === 'tx-doc-archiving') activeTab = 'archived';
        else if (transaction?.id === 'tx-doc-control') activeTab = 'checkout';
        else if (transaction?.id === 'tx-doc-reg' || transaction?.id === 'tx-doc-versioning') activeTab = 'active';
        return <DocumentManagementView activeTab={activeTab} />;
      }
      case 'internal-requests':
      case '03.04': {
        let activeTab: string | undefined = undefined;
        if (transaction?.id === 'tx-employee-req') activeTab = 'Employee';
        else if (transaction?.id === 'tx-dept-req') activeTab = 'Department';
        else if (transaction?.id === 'tx-admin-requests') activeTab = 'Administrative';
        else if (transaction?.id === 'tx-request-approvals') activeTab = 'pending';
        return <InternalRequestsView activeTab={activeTab} />;
      }
      case 'task-activity-mgmt':
      case '03.05': {
        let activeTab: string | undefined = undefined;
        if (transaction?.id === 'tx-task-completion') activeTab = 'list';
        else if (transaction?.id === 'tx-task-create' || transaction?.id === 'tx-task-assign' || transaction?.id === 'tx-task-tracking') activeTab = 'kanban';
        return <TaskActivityView activeTab={activeTab} />;
      }
      case 'meeting-mgmt':
      case '03.06': {
        return <MeetingManagementView />;
      }
      case 'travel-transport-admin':
      case '03.07': {
        let activeTab: string | undefined = undefined;
        if (transaction?.id === 'tx-vehicle-requests') activeTab = 'bookings';
        else if (transaction?.id === 'tx-transport-mgmt') activeTab = 'fleet';
        else if (transaction?.id === 'tx-travel-requests' || transaction?.id === 'tx-travel-approvals') activeTab = 'travel';
        return <TravelTransportationView activeTab={activeTab} />;
      }
      case 'general-business-services':
      case '03.08': {
        let activeTab: string | undefined = undefined;
        if (transaction?.id === 'tx-service-requests' || transaction?.id === 'tx-office-cleaning') activeTab = 'services';
        else if (transaction?.id === 'tx-vendor-services' || transaction?.id === 'tx-catering-services') activeTab = 'vendors';
        else if (transaction?.id === 'tx-office-assets' || transaction?.id === 'tx-security-services') activeTab = 'assets';
        return <GeneralBusinessServicesView activeTab={activeTab} />;
      }
      default:
        return <AdministrationDashboardView onNavigateToSubView={handleAreaNavigate} />;
    }
  };

  return (
    <AdministrationProvider>
      <div className="space-y-6 pb-12">
        {/* Module Header Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {functionalArea && (
                <button
                  onClick={() => onNavigate({ view: 'module', moduleId: 'administration' })}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Back to Administration Cockpit"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                03
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {functionalArea ? functionalArea.name : '03 — Administration & General Business Management'}
                  </h1>
                  <button
                    onClick={onToggleFavorite}
                    className="text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-700 dark:text-amber-400' : ''}`} />
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {functionalArea ? functionalArea.description : 'Corporate office administration, mailroom, document archives, meeting MoMs, and service requests'}
                </p>
              </div>
            </div>

            {/* Sub-module Navigation Dropdown / Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onNavigate({ view: 'module', moduleId: 'administration' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  !functionalArea ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Executive Cockpit</span>
              </button>

              <select
                value={functionalArea?.id || 'cockpit'}
                onChange={(e) => {
                  if (e.target.value === 'cockpit') {
                    onNavigate({ view: 'module', moduleId: 'administration' });
                  } else {
                    handleAreaNavigate(e.target.value);
                  }
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 cursor-pointer"
              >
                <option value="cockpit">Select Functional Area...</option>
                <option value="office-admin">03.01 Office Administration</option>
                <option value="correspondence-mgmt">03.02 Correspondence Management</option>
                <option value="document-mgmt">03.03 Document Management (DMS)</option>
                <option value="internal-requests">03.04 Internal Requests & Approvals</option>
                <option value="task-activity-mgmt">03.05 Task & Activity Kanban</option>
                <option value="meeting-mgmt">03.06 Meeting Management & MoM</option>
                <option value="travel-transport-admin">03.07 Travel & Fleet Logistics</option>
                <option value="general-business-services">03.08 General Business Services</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Sub-view */}
        {renderActiveSubView()}
      </div>
    </AdministrationProvider>
  );
};

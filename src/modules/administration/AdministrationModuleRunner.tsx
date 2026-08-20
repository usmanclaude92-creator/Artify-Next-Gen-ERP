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
        return <OfficeAdministrationView />;
      case 'correspondence-mgmt':
        return <CorrespondenceManagementView />;
      case 'document-mgmt':
        return <DocumentManagementView />;
      case 'internal-requests':
        return <InternalRequestsView />;
      case 'task-activity-mgmt':
        return <TaskActivityView />;
      case 'meeting-mgmt':
        return <MeetingManagementView />;
      case 'travel-transport-admin':
        return <TravelTransportationView />;
      case 'general-business-services':
        return <GeneralBusinessServicesView />;
      default:
        return <AdministrationDashboardView onNavigateToSubView={handleAreaNavigate} />;
    }
  };

  return (
    <AdministrationProvider>
      <div className="space-y-6 pb-12">
        {/* Module Header Bar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {functionalArea && (
                <button
                  onClick={() => onNavigate({ view: 'module', moduleId: 'administration' })}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
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
                  <h1 className="text-lg font-bold text-slate-900">
                    {functionalArea ? functionalArea.name : '03 — Administration & General Business Management'}
                  </h1>
                  <button
                    onClick={onToggleFavorite}
                    className="text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  {functionalArea ? functionalArea.description : 'Corporate office administration, mailroom, document archives, meeting MoMs, and service requests'}
                </p>
              </div>
            </div>

            {/* Sub-module Navigation Dropdown / Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onNavigate({ view: 'module', moduleId: 'administration' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  !functionalArea ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
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
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
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

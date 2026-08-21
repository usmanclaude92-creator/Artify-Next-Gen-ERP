// ==========================================
// ARTIFY ERP — MODULE 10: PROJECT MANAGEMENT & JOB COSTING
// Main Module Runner & View Router
// ==========================================

import React, { useState } from 'react';
import {
  ERPModule,
  ERPFunctionalArea,
  ERPProcess,
  ERPTransaction,
  ERPRouteState,
  ERPUserRole
} from '../../types/erp';
import { ProjectProvider, useProjectStore } from './services/projectStore';
import { ProjectSetupView } from './components/setup/ProjectSetupView';
import { ProjectPlanningView } from './components/planning/ProjectPlanningView';
import { ProjectCostingView } from './components/costing/ProjectCostingView';
import { ProjectProcurementView } from './components/procurement/ProjectProcurementView';
import { ProjectBillingView } from './components/billing/ProjectBillingView';
import { ProjectPerformanceView } from './components/performance/ProjectPerformanceView';
import {
  ArrowLeft,
  Star,
  LayoutDashboard,
  FolderKanban,
  Calendar,
  DollarSign,
  Truck,
  Receipt,
  TrendingUp,
  Building,
  ChevronDown
} from 'lucide-react';

interface ProjectManagementModuleRunnerProps {
  module: ERPModule;
  functionalArea?: ERPFunctionalArea;
  process?: ERPProcess;
  transaction?: ERPTransaction;
  onNavigate: (route: ERPRouteState) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  activeRole: ERPUserRole;
}

const ProjectManagementRunnerInner: React.FC<ProjectManagementModuleRunnerProps> = ({
  module,
  functionalArea,
  process,
  transaction,
  onNavigate,
  isFavorite,
  onToggleFavorite,
  activeRole
}) => {
  const { projects, selectedProject, selectProject } = useProjectStore();

  // Internal tab fallback when not driven strictly by route
  const [internalTab, setInternalTab] = useState<'10.01' | '10.02' | '10.03' | '10.04' | '10.05' | '10.06'>('10.01');

  // Map route functionalArea to tab
  const getActiveTab = (): '10.01' | '10.02' | '10.03' | '10.04' | '10.05' | '10.06' => {
    if (functionalArea) {
      if (functionalArea.code === '10.01' || functionalArea.id.includes('setup') || functionalArea.id.includes('master')) return '10.01';
      if (functionalArea.code === '10.02' || functionalArea.id.includes('planning') || functionalArea.id.includes('gantt')) return '10.02';
      if (functionalArea.code === '10.03' || functionalArea.id.includes('costing') || functionalArea.id.includes('job-cost')) return '10.03';
      if (functionalArea.code === '10.04' || functionalArea.id.includes('procurement') || functionalArea.id.includes('subcontract')) return '10.04';
      if (functionalArea.code === '10.05' || functionalArea.id.includes('billing') || functionalArea.id.includes('revenue')) return '10.05';
      if (functionalArea.code === '10.06' || functionalArea.id.includes('performance') || functionalArea.id.includes('evm')) return '10.06';
    }
    return internalTab;
  };

  const currentTab = getActiveTab();

  const handleTabClick = (tabCode: '10.01' | '10.02' | '10.03' | '10.04' | '10.05' | '10.06') => {
    setInternalTab(tabCode);
    const targetFa = module.functionalAreas?.find(fa => fa.code === tabCode);
    if (targetFa) {
      onNavigate({
        view: 'functional_area',
        moduleId: module.id,
        functionalAreaId: targetFa.id
      });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Module Level Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate({ view: 'dashboard' })}
              aria-label="Back to dashboard"
              className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-purple-400 bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-800">
                  {module.code} — {module.category}
                </span>
                <span className="text-xs text-slate-400">Enterprise Edition</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight mt-1">{module.name}</h1>
              <p className="text-xs text-slate-400 mt-0.5">{module.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleFavorite}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-amber-950/40 text-amber-300 border-amber-800/80'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>{isFavorite ? 'Favorited' : 'Bookmark'}</span>
            </button>

            {/* Active Project Switcher */}
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <Building className="w-4 h-4 text-purple-400" />
              <select
                value={selectedProject.id}
                onChange={(e) => selectProject(e.target.value)}
                aria-label="Select current project"
                className="bg-transparent text-white font-mono text-xs font-bold focus:outline-none cursor-pointer"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                    {p.projectCode} — {p.projectName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Functional Area Nav Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-6 pt-5 border-t border-slate-800">
          <button
            onClick={() => handleTabClick('10.01')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentTab === '10.01'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>10.01 Setup</span>
          </button>

          <button
            onClick={() => handleTabClick('10.02')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentTab === '10.02'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>10.02 Planning</span>
          </button>

          <button
            onClick={() => handleTabClick('10.03')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentTab === '10.03'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>10.03 Costing</span>
          </button>

          <button
            onClick={() => handleTabClick('10.04')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentTab === '10.04'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>10.04 Procurement</span>
          </button>

          <button
            onClick={() => handleTabClick('10.05')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentTab === '10.05'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>10.05 Billing</span>
          </button>

          <button
            onClick={() => handleTabClick('10.06')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentTab === '10.06'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>10.06 Performance</span>
          </button>
        </div>
      </div>

      {/* Dynamic Sub-Module Render */}
      {currentTab === '10.01' && <ProjectSetupView />}
      {currentTab === '10.02' && <ProjectPlanningView />}
      {currentTab === '10.03' && <ProjectCostingView />}
      {currentTab === '10.04' && <ProjectProcurementView />}
      {currentTab === '10.05' && <ProjectBillingView />}
      {currentTab === '10.06' && <ProjectPerformanceView />}
    </div>
  );
};

export const ProjectManagementModuleRunner: React.FC<ProjectManagementModuleRunnerProps> = (props) => {
  return (
    <ProjectProvider>
      <ProjectManagementRunnerInner {...props} />
    </ProjectProvider>
  );
};

export default ProjectManagementModuleRunner;

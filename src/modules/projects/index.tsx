// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 10: PROJECT MANAGEMENT & JOB COSTING
// Main Container View & Export Entry
// ==========================================

import React, { useState } from 'react';
import { ProjectProvider, useProjectStore } from './services/projectStore';
import { ProjectSetupView } from './components/setup/ProjectSetupView';
import { ProjectPlanningView } from './components/planning/ProjectPlanningView';
import { ProjectCostingView } from './components/costing/ProjectCostingView';
import { ProjectProcurementView } from './components/procurement/ProjectProcurementView';
import { ProjectBillingView } from './components/billing/ProjectBillingView';
import { ProjectPerformanceView } from './components/performance/ProjectPerformanceView';
import {
  FolderKanban,
  Calendar,
  DollarSign,
  Truck,
  Receipt,
  TrendingUp,
  Building,
  Layers,
  ChevronDown
} from 'lucide-react';

const ProjectManagementContent: React.FC = () => {
  const { projects, selectedProject, selectProject } = useProjectStore();
  const [activeModuleTab, setActiveModuleTab] = useState<
    '10.01_SETUP' | '10.02_PLANNING' | '10.03_COSTING' | '10.04_PROCUREMENT' | '10.05_BILLING' | '10.06_PERFORMANCE'
  >('10.01_SETUP');

  return (
    <div className="space-y-6">
      {/* Project Switcher Bar */}
      <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Construction Project</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-bold text-white text-base">{selectedProject.projectName}</span>
              <span className="text-xs font-mono bg-purple-950 text-purple-400 px-2 py-0.5 rounded border border-purple-800">
                {selectedProject.projectCode}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 font-medium">Switch Project:</label>
          <div className="relative">
            <select
              value={selectedProject.id}
              onChange={(e) => selectProject(e.target.value)}
              aria-label="Select active project"
              className="bg-slate-900 border border-slate-700 text-white text-xs font-medium rounded-xl px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.projectCode} — {p.projectName} ({p.status})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <button
          onClick={() => setActiveModuleTab('10.01_SETUP')}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeModuleTab === '10.01_SETUP'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          <span>10.01 Setup</span>
        </button>

        <button
          onClick={() => setActiveModuleTab('10.02_PLANNING')}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeModuleTab === '10.02_PLANNING'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>10.02 Planning</span>
        </button>

        <button
          onClick={() => setActiveModuleTab('10.03_COSTING')}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeModuleTab === '10.03_COSTING'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>10.03 Costing</span>
        </button>

        <button
          onClick={() => setActiveModuleTab('10.04_PROCUREMENT')}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeModuleTab === '10.04_PROCUREMENT'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>10.04 Procurement</span>
        </button>

        <button
          onClick={() => setActiveModuleTab('10.05_BILLING')}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeModuleTab === '10.05_BILLING'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>10.05 Billing</span>
        </button>

        <button
          onClick={() => setActiveTabToPerformance(setActiveModuleTab)}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeModuleTab === '10.06_PERFORMANCE'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>10.06 Performance</span>
        </button>
      </div>

      {/* Render Active Sub-Module View */}
      {activeModuleTab === '10.01_SETUP' && <ProjectSetupView />}
      {activeModuleTab === '10.02_PLANNING' && <ProjectPlanningView />}
      {activeModuleTab === '10.03_COSTING' && <ProjectCostingView />}
      {activeModuleTab === '10.04_PROCUREMENT' && <ProjectProcurementView />}
      {activeModuleTab === '10.05_BILLING' && <ProjectBillingView />}
      {activeModuleTab === '10.06_PERFORMANCE' && <ProjectPerformanceView />}
    </div>
  );
};

function setActiveTabToPerformance(setTab: (tab: any) => void) {
  setTab('10.06_PERFORMANCE');
}

export const ProjectManagementModule: React.FC = () => {
  return (
    <ProjectProvider>
      <ProjectManagementContent />
    </ProjectProvider>
  );
};

export default ProjectManagementModule;

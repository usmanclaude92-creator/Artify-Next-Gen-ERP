// ==========================================
// ARTIFY ERP — MODULE 10.01: PROJECT SETUP
// Master, Classification, Phases & WBS Activities
// ==========================================

import React, { useState } from 'react';
import { useProjectStore } from '../../services/projectStore';
import { ProjectMaster, ProjectPhase, ProjectActivity, ProjectType, BillingMethod, ProjectPriority } from '../../types';
import {
  FolderPlus,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  DollarSign,
  Layers,
  ListTree,
  Calendar,
  User,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Tag,
  ArrowRight,
  FileText
} from 'lucide-react';

export const ProjectSetupView: React.FC = () => {
  const {
    projects,
    selectedProject,
    setSelectedProject,
    classifications,
    createProject,
    addPhase,
    addActivity,
    updateActivityProgress
  } = useProjectStore();

  const [activeTab, setActiveTab] = useState<'PROJECT_MASTER' | 'CLASSIFICATION' | 'PHASES' | 'WBS_ACTIVITIES'>('PROJECT_MASTER');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showNewPhaseModal, setShowNewPhaseModal] = useState(false);
  const [showNewActivityModal, setShowNewActivityModal] = useState(false);
  const [selectedPhaseIdForActivity, setSelectedPhaseIdForActivity] = useState<string>('');

  // New Project Form State
  const [newProjectForm, setNewProjectForm] = useState({
    projectName: '',
    clientEntity: '',
    clientContactPerson: '',
    clientEmail: '',
    clientPhone: '',
    contractNumber: '',
    contractValue: 1500000,
    currency: 'OMR',
    projectType: 'OIL_GAS_FACILITY' as ProjectType,
    projectClassificationId: 'class-01',
    projectManager: 'Dr. Tarek Al-Ghamdi',
    siteEngineer: 'Eng. Salem Al-Maamari',
    location: 'Sohar Port Quay 5',
    branch: 'Sohar Regional Office',
    startDate: new Date().toISOString().split('T')[0],
    targetCompletionDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    status: 'PLANNING' as ProjectMaster['status'],
    priority: 'HIGH' as ProjectPriority,
    billingMethod: 'PROGRESS_PERCENT_COMPLETION' as BillingMethod,
    totalBudget: 1200000,
    retentionWithheldPercent: 10,
    customTags: ['Petrochemical', 'Turnkey']
  });

  // New Phase Form State
  const [newPhaseForm, setNewPhaseForm] = useState({
    phaseSequence: (selectedProject.phases?.length || 0) + 1,
    phaseName: '',
    description: '',
    startDate: selectedProject.startDate,
    endDate: selectedProject.targetCompletionDate,
    budgetAllocated: 250000,
    weightagePercent: 20,
    status: 'UPCOMING' as ProjectPhase['status']
  });

  // New Activity Form State
  const [newActivityForm, setNewActivityForm] = useState({
    wbsCode: '1.2.04',
    activityName: '',
    description: '',
    durationDays: 30,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    plannedCost: 50000,
    assignedTeamLeader: 'Eng. Salem Al-Maamari',
    isCriticalPath: false
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    createProject(newProjectForm);
    setShowNewProjectModal(false);
  };

  const handleAddPhase = (e: React.FormEvent) => {
    e.preventDefault();
    addPhase(selectedProject.id, newPhaseForm);
    setShowNewPhaseModal(false);
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPhaseId = selectedPhaseIdForActivity || selectedProject.phases[0]?.id;
    if (targetPhaseId) {
      addActivity(selectedProject.id, targetPhaseId, newActivityForm);
    }
    setShowNewActivityModal(false);
  };

  const filteredProjects = projects.filter(p =>
    p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.projectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.clientEntity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="project-setup-module" className="space-y-6">
      {/* Top Banner & Context Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <FolderPlus className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-widest text-purple-400 bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-800">
                10.01 — Project Setup
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {selectedProject.projectCode}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mt-1">
              {selectedProject.projectName}
            </h1>
          </div>
        </div>

        {/* Action Buttons & Project Switcher Dropdown */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedProject.id}
              onChange={(e) => {
                const found = projects.find(p => p.id === e.target.value);
                if (found) setSelectedProject(found);
              }}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2 pr-8 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.projectCode} — {p.projectName.substring(0, 30)}...
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm px-4 py-2 rounded-xl shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Project Charter</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('PROJECT_MASTER')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'PROJECT_MASTER'
              ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Project Master Register</span>
        </button>
        <button
          onClick={() => setActiveTab('CLASSIFICATION')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'CLASSIFICATION'
              ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Project Classifications ({classifications.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('PHASES')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'PHASES'
              ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Project Phases ({selectedProject.phases?.length || 0})</span>
        </button>
        <button
          onClick={() => setActiveTab('WBS_ACTIVITIES')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'WBS_ACTIVITIES'
              ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ListTree className="w-4 h-4" />
          <span>WBS Activities Hierarchy</span>
        </button>
      </div>

      {/* TAB 1: PROJECT MASTER */}
      {activeTab === 'PROJECT_MASTER' && (
        <div className="space-y-6">
          {/* Active Project Highlight Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Client Principal</span>
                <p className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-400" />
                  {selectedProject.clientEntity}
                </p>
                <p className="text-xs text-slate-400">Rep: {selectedProject.clientContactPerson} ({selectedProject.clientEmail})</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Contract & Commercial</span>
                <p className="text-base font-bold text-emerald-400 flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {selectedProject.currency} {selectedProject.contractValue.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400">Contract Ref: {selectedProject.contractNumber}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Leadership & Site</span>
                <p className="text-base font-semibold text-slate-200 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" />
                  PM: {selectedProject.projectManager}
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {selectedProject.location}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Physical Execution</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-purple-400">{selectedProject.overallProgressPercent}% Complete</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {selectedProject.status}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 mt-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${selectedProject.overallProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Project List Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter projects by code, title, or client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl pl-9 pr-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div className="text-xs text-slate-400">
                Displaying <span className="text-white font-bold">{filteredProjects.length}</span> commercial EPC projects
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Project Code</th>
                    <th className="py-3 px-4">Project Title & Scope</th>
                    <th className="py-3 px-4">Client Entity</th>
                    <th className="py-3 px-4 text-right">Contract Value</th>
                    <th className="py-3 px-4 text-right">Actual Cost</th>
                    <th className="py-3 px-4">Timeline</th>
                    <th className="py-3 px-4">Progress</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredProjects.map((p) => {
                    const isSelected = p.id === selectedProject.id;
                    return (
                      <tr
                        key={p.id}
                        onClick={() => setSelectedProject(p)}
                        className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                          isSelected ? 'bg-purple-950/30 border-l-4 border-l-purple-500' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono font-semibold text-purple-400 whitespace-nowrap">
                          {p.projectCode}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-white line-clamp-1">{p.projectName}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {p.projectType}
                            </span>
                            <span>Mgr: {p.projectManager}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                          {p.clientEntity}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-medium text-emerald-400 whitespace-nowrap">
                          {p.currency} {p.contractValue.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-slate-300 whitespace-nowrap">
                          {p.currency} {p.totalActualCost.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-400 whitespace-nowrap">
                          <div>Start: {p.startDate}</div>
                          <div>Target: {p.targetCompletionDate}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-white">{p.overallProgressPercent}%</span>
                            <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-purple-500 h-1.5 rounded-full"
                                style={{ width: `${p.overallProgressPercent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProject(p);
                              setActiveTab('PHASES');
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white transition-all cursor-pointer"
                            title="Manage Project Phases"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLASSIFICATION */}
      {activeTab === 'CLASSIFICATION' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {classifications.map(c => (
            <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-purple-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-400 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-800">
                  {c.code}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{c.sector}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{c.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{c.description}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Standard Overhead Markup:</span>
                  <span className="font-mono font-bold text-emerald-400">{c.standardOverheadMarkupPercent}%</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Standard Retention Rate:</span>
                  <span className="font-mono font-bold text-amber-400">{c.standardRetentionRatePercent}%</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Standard Advance Recovery:</span>
                  <span className="font-mono font-bold text-blue-400">{c.standardAdvanceRecoveryPercent}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: PHASES */}
      {activeTab === 'PHASES' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Project Work Phases</h2>
              <p className="text-xs text-slate-400">Sequential milestone phases allocated for {selectedProject.projectName}</p>
            </div>
            <button
              onClick={() => setShowNewPhaseModal(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Phase</span>
            </button>
          </div>

          <div className="space-y-4">
            {selectedProject.phases?.map(phase => (
              <div key={phase.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                      {phase.phaseSequence}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{phase.phaseName}</h3>
                      <p className="text-xs text-slate-400">{phase.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
                      {phase.startDate} — {phase.endDate}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full font-bold uppercase ${
                      phase.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-blue-950 text-blue-400 border border-blue-800'
                    }`}>
                      {phase.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500">Allocated Budget:</span>
                    <p className="text-sm font-bold text-white font-mono mt-0.5">
                      {selectedProject.currency} {phase.budgetAllocated.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500">Actual Spent:</span>
                    <p className="text-sm font-bold text-amber-400 font-mono mt-0.5">
                      {selectedProject.currency} {phase.actualSpent.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500">Project Weightage:</span>
                    <p className="text-sm font-bold text-purple-400 font-mono mt-0.5">
                      {phase.weightagePercent}% of total
                    </p>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Phase Progress:</span>
                      <span className="font-bold text-white">{phase.completionPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full"
                        style={{ width: `${phase.completionPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Sub-activities Preview */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-300">WBS Activities ({phase.activities?.length || 0})</span>
                    <button
                      onClick={() => {
                        setSelectedPhaseIdForActivity(phase.id);
                        setShowNewActivityModal(true);
                      }}
                      className="text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Activity to this Phase</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {phase.activities?.map(act => (
                      <div key={act.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800/60 flex items-center justify-between text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-purple-400">{act.wbsCode}</span>
                            <span className="font-medium text-white">{act.activityName}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{act.durationDays} days | Lead: {act.assignedTeamLeader}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            act.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-400' : 'bg-blue-950 text-blue-400'
                          }`}>
                            {act.progressPercent}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: WBS ACTIVITIES HIERARCHY */}
      {activeTab === 'WBS_ACTIVITIES' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg space-y-4 p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white">Work Breakdown Structure (WBS) Catalog</h2>
              <p className="text-xs text-slate-400">Granular activities linked to critical path scheduling and cost codes</p>
            </div>
            <button
              onClick={() => setShowNewActivityModal(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add WBS Activity</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">WBS Code</th>
                  <th className="py-3 px-4">Activity Name</th>
                  <th className="py-3 px-4">Parent Phase</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4 text-right">Planned Cost</th>
                  <th className="py-3 px-4 text-right">Actual Cost</th>
                  <th className="py-3 px-4">Assigned Team Lead</th>
                  <th className="py-3 px-4">Critical Path</th>
                  <th className="py-3 px-4">Status & Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {selectedProject.phases?.flatMap(phase =>
                  phase.activities?.map(act => (
                    <tr key={act.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-purple-400">
                        {act.wbsCode}
                      </td>
                      <td className="py-3 px-4 font-medium text-white">
                        {act.activityName}
                        <div className="text-[11px] text-slate-400">{act.description}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {phase.phaseName}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono">
                        {act.durationDays} Days ({act.startDate} to {act.endDate})
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-200">
                        {selectedProject.currency} {act.plannedCost.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-amber-400 font-semibold">
                        {selectedProject.currency} {act.actualCost.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {act.assignedTeamLeader}
                      </td>
                      <td className="py-3 px-4">
                        {act.isCriticalPath ? (
                          <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-bold text-[10px]">
                            CRITICAL PATH
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Standard</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={act.progressPercent}
                            onChange={(e) => {
                              const newProg = Number(e.target.value);
                              const newStatus = newProg === 100 ? 'COMPLETED' : newProg > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';
                              updateActivityProgress(selectedProject.id, phase.id, act.id, newProg, newStatus);
                            }}
                            className="bg-slate-800 text-xs text-white rounded px-2 py-1 border border-slate-700 focus:outline-none cursor-pointer"
                          >
                            <option value="0">0% (Not Started)</option>
                            <option value="25">25% (Started)</option>
                            <option value="50">50% (Halfway)</option>
                            <option value="75">75% (Advanced)</option>
                            <option value="100">100% (Completed)</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW PROJECT */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-purple-400" />
                <span>Initialize New Project Master Charter</span>
              </h2>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Project Title / Scope Name</label>
                  <input
                    type="text"
                    required
                    value={newProjectForm.projectName}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, projectName: e.target.value })}
                    placeholder="e.g. Duqm Refinery Storage Expansion"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Client Organization</label>
                  <input
                    type="text"
                    required
                    value={newProjectForm.clientEntity}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, clientEntity: e.target.value })}
                    placeholder="e.g. OQ Exploration & Production"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Contract Number</label>
                  <input
                    type="text"
                    required
                    value={newProjectForm.contractNumber}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, contractNumber: e.target.value })}
                    placeholder="e.g. OQ-EPC-2026-009"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Contract Total Value</label>
                  <div className="flex gap-2">
                    <select
                      value={newProjectForm.currency}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, currency: e.target.value })}
                      className="bg-slate-800 border border-slate-700 rounded-xl px-2 py-2 text-white"
                    >
                      <option value="OMR">OMR</option>
                      <option value="AED">AED</option>
                      <option value="SAR">SAR</option>
                      <option value="USD">USD</option>
                    </select>
                    <input
                      type="number"
                      required
                      value={newProjectForm.contractValue}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, contractValue: Number(e.target.value) })}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Project Classification</label>
                  <select
                    value={newProjectForm.projectClassificationId}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, projectClassificationId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {classifications.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Billing Method</label>
                  <select
                    value={newProjectForm.billingMethod}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, billingMethod: e.target.value as BillingMethod })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="PROGRESS_PERCENT_COMPLETION">Progress Percent of Completion (POCM)</option>
                    <option value="MILESTONE_DELIVERABLE">Certified Milestone Deliverable</option>
                    <option value="FIXED_LUMP_SUM">Fixed Lump Sum Turnkey</option>
                    <option value="TIME_AND_MATERIALS">Time and Materials Cost Plus</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Project Manager Lead</label>
                  <input
                    type="text"
                    value={newProjectForm.projectManager}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, projectManager: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Site Location</label>
                  <input
                    type="text"
                    value={newProjectForm.location}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, location: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold cursor-pointer"
                >
                  Initialize Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PHASE */}
      {showNewPhaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-xs">
            <h2 className="text-base font-bold text-white">Add Project Phase to {selectedProject.projectCode}</h2>
            <form onSubmit={handleAddPhase} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Phase Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Phase 4: DCS Automation & Cold Commissioning"
                  value={newPhaseForm.phaseName}
                  onChange={(e) => setNewPhaseForm({ ...newPhaseForm, phaseName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Budget Allocated ({selectedProject.currency})</label>
                  <input
                    type="number"
                    required
                    value={newPhaseForm.budgetAllocated}
                    onChange={(e) => setNewPhaseForm({ ...newPhaseForm, budgetAllocated: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Weightage % (Overall Project)</label>
                  <input
                    type="number"
                    required
                    value={newPhaseForm.weightagePercent}
                    onChange={(e) => setNewPhaseForm({ ...newPhaseForm, weightagePercent: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewPhaseModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold cursor-pointer"
                >
                  Save Phase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD WBS ACTIVITY */}
      {showNewActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-xs">
            <h2 className="text-base font-bold text-white">Add WBS Activity to {selectedProject.projectCode}</h2>
            <form onSubmit={handleAddActivity} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Select Parent Phase</label>
                <select
                  value={selectedPhaseIdForActivity}
                  onChange={(e) => setSelectedPhaseIdForActivity(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {selectedProject.phases?.map(ph => (
                    <option key={ph.id} value={ph.id}>{ph.phaseSequence}. {ph.phaseName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">WBS Code</label>
                  <input
                    type="text"
                    required
                    value={newActivityForm.wbsCode}
                    onChange={(e) => setNewActivityForm({ ...newActivityForm, wbsCode: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Duration (Days)</label>
                  <input
                    type="number"
                    required
                    value={newActivityForm.durationDays}
                    onChange={(e) => setNewActivityForm({ ...newActivityForm, durationDays: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Activity Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ultrasonic Weld NDT Testing"
                  value={newActivityForm.activityName}
                  onChange={(e) => setNewActivityForm({ ...newActivityForm, activityName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Planned Budget Cost ({selectedProject.currency})</label>
                  <input
                    type="number"
                    value={newActivityForm.plannedCost}
                    onChange={(e) => setNewActivityForm({ ...newActivityForm, plannedCost: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Lead Supervisor</label>
                  <input
                    type="text"
                    value={newActivityForm.assignedTeamLeader}
                    onChange={(e) => setNewActivityForm({ ...newActivityForm, assignedTeamLeader: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="critPath"
                  checked={newActivityForm.isCriticalPath}
                  onChange={(e) => setNewActivityForm({ ...newActivityForm, isCriticalPath: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="critPath" className="text-slate-300 font-semibold cursor-pointer">
                  Mark as Critical Path Item (Zero Float)
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewActivityModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold cursor-pointer"
                >
                  Save WBS Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

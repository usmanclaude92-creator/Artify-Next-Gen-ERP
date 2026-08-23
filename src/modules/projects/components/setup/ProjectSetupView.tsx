// ==========================================
// ARTIFY ERP — MODULE 10.01: PROJECT SETUP
// Master, Classification, Phases & WBS Activities
// ==========================================

import React, { useState } from 'react';
import { useProjectStore } from '../../services/projectStore';
import { ProjectMaster, ProjectPhase, ProjectActivity, ProjectType, BillingMethod, ProjectPriority, ProjectClassification } from '../../types';
import { PROJECT_DB_SCHEMAS, TableDefinition } from '../../db/schema';
import { ProjectMasterView } from './ProjectMasterView';
import {
  FolderPlus,
  Plus,
  Search,
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
  FileText,
  Trash2,
  Edit3,
  Sliders,
  Check,
  Briefcase,
  TrendingUp,
  Percent,
  CheckSquare,
  Database,
  Code2,
  Key,
  Network,
  Copy,
  CheckCheck
} from 'lucide-react';

export const ProjectSetupView: React.FC = () => {
  const {
    companies,
    branches,
    departments,
    costCenters,
    clientEntities,
    projectManagers,
    siteEngineers,
    currencies,
    projects,
    selectedProject,
    setSelectedProject,
    classifications,
    createProject,
    updateProject,
    deleteProject,
    createClassification,
    updateClassification,
    deleteClassification,
    addPhase,
    updatePhase,
    deletePhase,
    addActivity,
    updateActivity,
    deleteActivity,
    updateActivityProgress
  } = useProjectStore();

  const [activeTab, setActiveTab] = useState<'PROJECT_MASTER' | 'CLASSIFICATION' | 'PHASES' | 'WBS_ACTIVITIES' | 'DB_SCHEMA'>('PROJECT_MASTER');
  const [selectedSchemaTableKey, setSelectedSchemaTableKey] = useState<string>('project_masters');
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showNewPhaseModal, setShowNewPhaseModal] = useState(false);
  const [showEditPhaseModal, setShowEditPhaseModal] = useState(false);
  const [selectedPhaseForEdit, setSelectedPhaseForEdit] = useState<ProjectPhase | null>(null);
  const [showNewActivityModal, setShowNewActivityModal] = useState(false);
  const [showEditActivityModal, setShowEditActivityModal] = useState(false);
  const [selectedActivityForEdit, setSelectedActivityForEdit] = useState<{ phaseId: string; activity: ProjectActivity } | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [activityForProgress, setActivityForProgress] = useState<{ phaseId: string; activity: ProjectActivity } | null>(null);
  const [newProgressValue, setNewProgressValue] = useState<number>(0);
  const [newStatusValue, setNewStatusValue] = useState<ProjectActivity['status']>('NOT_STARTED');

  // Classification Modal State
  const [showNewClassificationModal, setShowNewClassificationModal] = useState(false);
  const [newClassificationForm, setNewClassificationForm] = useState({
    code: 'EPC-PETRO',
    name: 'Petrochemical & Cryogenic Infrastructure',
    sector: 'ENERGY_UTILITIES' as ProjectClassification['sector'],
    standardOverheadMarkupPercent: 12.0,
    standardRetentionRatePercent: 10.0,
    standardAdvanceRecoveryPercent: 15.0,
    description: 'EPC execution for cryogenic tanks, high pressure pipelines and refining units.'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // New Project Form State with Enterprise Master Fields
  const [newProjectForm, setNewProjectForm] = useState({
    projectName: '',
    clientEntity: clientEntities[0] || 'Oman National Petrochemicals Corp (ONPC)',
    clientContactPerson: 'Eng. Khalid Al-Rawahi',
    clientEmail: 'k.rawahi@onpc.om',
    clientPhone: '+968 2450 8899',
    contractNumber: 'ONPC-EPC-2026-092',
    contractValue: 2400000,
    currency: currencies[0] || 'OMR',
    company: companies[0] || 'Oman Heavy Industries SAOC',
    branch: branches[0] || 'Sohar Industrial Port Regional Office',
    department: departments[0] || 'EPC Project Delivery Directorate',
    costCenter: costCenters[0] || 'CC-PRJ-SOHAR-01 (EPC Sohar)',
    projectType: 'OIL_GAS_FACILITY' as ProjectType,
    projectClassificationId: classifications[0]?.id || 'class-01',
    projectManager: projectManagers[0] || 'Dr. Tarek Al-Ghamdi (PMP, EPC Director)',
    siteEngineer: siteEngineers[0] || 'Eng. Salem Al-Maamari',
    location: 'Sohar Port Industrial Zone, Quay 4',
    startDate: new Date().toISOString().split('T')[0],
    targetCompletionDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    status: 'PLANNING' as ProjectMaster['status'],
    priority: 'HIGH' as ProjectPriority,
    billingMethod: 'PROGRESS_PERCENT_COMPLETION' as BillingMethod,
    totalBudget: 1950000,
    retentionWithheldPercent: 10,
    customTags: ['Petrochemical', 'Turnkey', 'Cryogenic']
  });

  // Edit Project Form State
  const [editProjectForm, setEditProjectForm] = useState<Partial<ProjectMaster>>({});

  // New Phase Form State
  const [newPhaseForm, setNewPhaseForm] = useState({
    phaseSequence: (selectedProject?.phases?.length || 0) + 1,
    phaseName: '',
    description: '',
    startDate: selectedProject?.startDate || new Date().toISOString().split('T')[0],
    endDate: selectedProject?.targetCompletionDate || new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
    budgetAllocated: 300000,
    weightagePercent: 20,
    status: 'UPCOMING' as ProjectPhase['status']
  });

  // New Activity Form State
  const [selectedPhaseIdForActivity, setSelectedPhaseIdForActivity] = useState<string>('');
  const [newActivityForm, setNewActivityForm] = useState({
    wbsCode: '1.2.04',
    activityName: '',
    description: '',
    durationDays: 30,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    plannedCost: 50000,
    assignedTeamLeader: siteEngineers[0] || 'Eng. Salem Al-Maamari',
    isCriticalPath: false
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    createProject(newProjectForm);
    setShowNewProjectModal(false);
    showToast('Project Master charter successfully created and saved to ERP database.');
  };

  const handleOpenEditProject = () => {
    if (!selectedProject) return;
    setEditProjectForm({ ...selectedProject });
    setShowEditProjectModal(true);
  };

  const handleSaveEditProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProject && editProjectForm) {
      updateProject(selectedProject.id, editProjectForm);
      setShowEditProjectModal(false);
      showToast('Project Master record updated and synchronized.');
    }
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Are you sure you want to archive/delete this Project Master record and its WBS hierarchy?')) {
      deleteProject(id);
      showToast('Project record removed from active project portfolio.');
    }
  };

  const handleCreateClassification = (e: React.FormEvent) => {
    e.preventDefault();
    createClassification(newClassificationForm);
    setShowNewClassificationModal(false);
    showToast('New Project Classification taxonomy registered.');
  };

  const handleAddPhase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    addPhase(selectedProject.id, newPhaseForm);
    setShowNewPhaseModal(false);
    showToast('Project Phase milestone created.');
  };

  const handleOpenEditPhase = (phase: ProjectPhase) => {
    setSelectedPhaseForEdit(phase);
    setShowEditPhaseModal(true);
  };

  const handleSaveEditPhase = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProject && selectedPhaseForEdit) {
      updatePhase(selectedProject.id, selectedPhaseForEdit.id, selectedPhaseForEdit);
      setShowEditPhaseModal(false);
      showToast('Phase milestone updated.');
    }
  };

  const handleDeletePhase = (phaseId: string) => {
    if (window.confirm('Delete this phase and all associated WBS work packages?')) {
      deletePhase(selectedProject.id, phaseId);
      showToast('Phase removed from Project WBS.');
    }
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPhaseId = selectedPhaseIdForActivity || selectedProject.phases[0]?.id;
    if (targetPhaseId) {
      addActivity(selectedProject.id, targetPhaseId, newActivityForm);
      setShowNewActivityModal(false);
      showToast('WBS work package activity added.');
    }
  };

  const handleOpenEditActivity = (phaseId: string, activity: ProjectActivity) => {
    setSelectedActivityForEdit({ phaseId, activity: { ...activity } });
    setShowEditActivityModal(true);
  };

  const handleSaveEditActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProject && selectedActivityForEdit) {
      updateActivity(selectedProject.id, selectedActivityForEdit.phaseId, selectedActivityForEdit.activity.id, selectedActivityForEdit.activity);
      setShowEditActivityModal(false);
      showToast('Activity work package updated.');
    }
  };

  const handleDeleteActivity = (phaseId: string, activityId: string) => {
    if (window.confirm('Delete this WBS activity?')) {
      deleteActivity(selectedProject.id, phaseId, activityId);
      showToast('WBS activity deleted.');
    }
  };

  const handleOpenProgressModal = (phaseId: string, activity: ProjectActivity) => {
    setActivityForProgress({ phaseId, activity });
    setNewProgressValue(activity.progressPercent);
    setNewStatusValue(activity.status);
    setShowProgressModal(true);
  };

  const handleSaveProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProject && activityForProgress) {
      updateActivityProgress(
        selectedProject.id,
        activityForProgress.phaseId,
        activityForProgress.activity.id,
        Number(newProgressValue),
        newStatusValue
      );
      setShowProgressModal(false);
      showToast(`Activity ${activityForProgress.activity.wbsCode} progress updated to ${newProgressValue}%. Overall project progress recalculated.`);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.projectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientEntity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate portfolio totals
  const totalPortfolioValue = projects.reduce((acc, curr) => acc + curr.contractValue, 0);
  const totalPortfolioActual = projects.reduce((acc, curr) => acc + curr.totalActualCost, 0);
  const totalPortfolioBudget = projects.reduce((acc, curr) => acc + curr.totalBudget, 0);
  const avgProgress = projects.length > 0 ? (projects.reduce((acc, curr) => acc + curr.overallProgressPercent, 0) / projects.length).toFixed(1) : '0.0';

  return (
    <div id="project-setup-module" className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-950 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

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
                {selectedProject?.projectCode}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                {selectedProject?.status}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mt-1">
              {selectedProject?.projectName || 'Industrial EPC Turnkey Project'}
            </h1>
          </div>
        </div>

        {/* Action Buttons & Project Switcher Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={selectedProject?.id}
              onChange={(e) => {
                const found = projects.find(p => p.id === e.target.value);
                if (found) setSelectedProject(found);
              }}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2 pr-8 focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.projectCode} — {p.projectName.substring(0, 32)}...
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

      {/* Portfolio Stats Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active EPC Projects</span>
            <Briefcase className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl font-bold text-white mt-1">{projects.length} Contracts</p>
          <span className="text-[11px] text-slate-500">Across Sohar, Duqm, Salalah</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Portfolio Contract Value</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-emerald-400 mt-1 font-mono">
            {selectedProject?.currency || 'OMR'} {totalPortfolioValue.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500">Total Awarded Commitments</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Cumulative Actual Cost</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-xl font-bold text-white mt-1 font-mono">
            {selectedProject?.currency || 'OMR'} {totalPortfolioActual.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500">Budget: {totalPortfolioBudget.toLocaleString()}</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Average Physical Progress</span>
            <Percent className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl font-bold text-purple-400 mt-1">{avgProgress}%</p>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
            <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${avgProgress}%` }} />
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
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
          <span>Project Phases ({selectedProject?.phases?.length || 0})</span>
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
        <button
          onClick={() => setActiveTab('DB_SCHEMA')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'DB_SCHEMA'
              ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-400" />
          <span className="flex items-center gap-1.5">
            Database Schemas & DDL
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
              6 Tables
            </span>
          </span>
        </button>
      </div>

      {/* TAB 1: PROJECT MASTER */}
      {activeTab === 'PROJECT_MASTER' && (
        <ProjectMasterView
          onNavigateToPlanning={(projectId) => {
            const prj = projects.find(p => p.id === projectId);
            if (prj) setSelectedProject(prj);
            setActiveTab('PHASES');
          }}
          onNavigateToCosting={(projectId) => {
            const prj = projects.find(p => p.id === projectId);
            if (prj) setSelectedProject(prj);
            setActiveTab('WBS_ACTIVITIES');
          }}
        />
      )}

      {/* TAB 2: CLASSIFICATION */}
      {activeTab === 'CLASSIFICATION' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Project Classification Taxonomy</h2>
              <p className="text-xs text-slate-400">Standard project templates, overhead markups, and statutory retention rules</p>
            </div>
            <button
              onClick={() => setShowNewClassificationModal(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-lg shadow-purple-950/40"
            >
              <Plus className="w-4 h-4" />
              <span>New Classification</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {classifications.map(c => (
              <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-purple-500/40 transition-all flex flex-col justify-between shadow-lg">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-purple-400 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-800">
                      {c.code}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                      {c.sector}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{c.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{c.description}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs">
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
                  <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500">
                    <span>Associated Projects: {projects.filter(p => p.projectClassificationId === c.id).length}</span>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete classification ${c.name}?`)) {
                          deleteClassification(c.id);
                          showToast('Classification deleted.');
                        }
                      }}
                      className="text-rose-400 hover:text-rose-300 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PHASES */}
      {activeTab === 'PHASES' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Project Work Phases (Milestones)</h2>
              <p className="text-xs text-slate-400">Sequential milestone phases for {selectedProject?.projectName}</p>
            </div>
            <button
              onClick={() => setShowNewPhaseModal(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-lg shadow-purple-950/40"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Phase</span>
            </button>
          </div>

          <div className="space-y-4">
            {selectedProject?.phases?.map(phase => (
              <div key={phase.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg hover:border-slate-700 transition-all">
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
                    <span className={`px-2.5 py-1 rounded-full font-bold ${
                      phase.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      phase.status === 'ACTIVE' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {phase.status}
                    </span>
                    <button
                      onClick={() => handleOpenEditPhase(phase)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                      title="Edit Phase"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                    </button>
                    <button
                      onClick={() => handleDeletePhase(phase.id)}
                      className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 cursor-pointer"
                      title="Delete Phase"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500">Allocated Budget</span>
                    <p className="text-sm font-bold text-white font-mono mt-0.5">
                      {selectedProject.currency} {phase.budgetAllocated.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500">Actual Spent</span>
                    <p className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                      {selectedProject.currency} {phase.actualSpent.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500">Project Weightage</span>
                    <p className="text-sm font-bold text-amber-400 mt-0.5">{phase.weightagePercent}% of Contract</p>
                  </div>

                  <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Milestone Progress</span>
                      <span className="font-bold text-purple-400">{phase.completionPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-purple-500 h-1.5 rounded-full"
                        style={{ width: `${phase.completionPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Underlying activities preview */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold text-slate-300">WBS Work Packages in this Phase ({phase.activities?.length || 0})</span>
                    <button
                      onClick={() => {
                        setSelectedPhaseIdForActivity(phase.id);
                        setShowNewActivityModal(true);
                      }}
                      className="text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Work Package</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {phase.activities?.map(act => (
                      <div key={act.id} className="bg-slate-950/40 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-purple-400 font-bold">{act.wbsCode}</span>
                          <span className="text-slate-200 font-medium truncate max-w-[180px]">{act.activityName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-400">{act.progressPercent}%</span>
                          <button
                            onClick={() => handleOpenProgressModal(phase.id, act)}
                            className="p-1 rounded bg-purple-950 text-purple-300 hover:bg-purple-900 cursor-pointer"
                            title="Update Progress"
                          >
                            <Sliders className="w-3 h-3" />
                          </button>
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

      {/* TAB 4: WBS ACTIVITIES */}
      {activeTab === 'WBS_ACTIVITIES' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Work Breakdown Structure (WBS Level 2 Activities)</h2>
              <p className="text-xs text-slate-400">Detailed engineering, procurement and construction work packages</p>
            </div>
            <button
              onClick={() => {
                setSelectedPhaseIdForActivity(selectedProject?.phases[0]?.id || '');
                setShowNewActivityModal(true);
              }}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-lg shadow-purple-950/40"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add WBS Activity</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">WBS Code</th>
                    <th className="py-3 px-4">Activity Name & Scope</th>
                    <th className="py-3 px-4">Phase Milestone</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4 text-right">Planned Cost</th>
                    <th className="py-3 px-4 text-right">Actual Cost</th>
                    <th className="py-3 px-4">Lead Engineer</th>
                    <th className="py-3 px-4">Progress & Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {selectedProject?.phases?.flatMap(ph => ph.activities.map(act => ({ ...act, phaseName: ph.phaseName, phaseId: ph.id }))).map(act => (
                    <tr key={act.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-purple-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{act.wbsCode}</span>
                          {act.isCriticalPath && (
                            <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold" title="Critical Path (Zero Float)">
                              CP
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{act.activityName}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{act.description}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {act.phaseName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                        {act.durationDays} Days ({act.startDate} to {act.endDate})
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-300 whitespace-nowrap">
                        {selectedProject.currency} {act.plannedCost.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-emerald-400 whitespace-nowrap">
                        {selectedProject.currency} {act.actualCost.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                        {act.assignedTeamLeader}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-purple-400">{act.progressPercent}%</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            act.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                            act.status === 'IN_PROGRESS' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                            act.status === 'BLOCKED' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {act.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenProgressModal(act.phaseId, act)}
                            className="p-1.5 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-300 cursor-pointer"
                            title="Update Physical Progress"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditActivity(act.phaseId, act)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                            title="Edit Activity"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteActivity(act.phaseId, act.id)}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 cursor-pointer"
                            title="Delete Activity"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DATABASE SCHEMA & DDL EXPLORER */}
      {activeTab === 'DB_SCHEMA' && (
        <div className="space-y-6">
          {/* Header & Architecture Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">
                      Relational Database Schemas & Enterprise Architecture
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                      PostgreSQL / ANSI SQL
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Compliant with ERP conventions: Multi-tenancy (tenant_id), Organizational Context (company/branch/department/cost center), Audit Trail, and Optimistic Concurrency Locking.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`-- ARTIFY ERP MODULE 10.01 DDL\n-- Database tables: project_classifications, project_masters, project_phases, project_activities, project_activity_dependencies, project_audit_logs\n-- See /src/modules/projects/db/schema.sql`);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 2000);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer border border-slate-700 transition-colors"
                >
                  {copiedSql ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
                  <span>{copiedSql ? 'Copied Reference' : 'Copy DDL Spec'}</span>
                </button>
              </div>
            </div>

            {/* Architecture Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4 text-xs">
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                <div className="flex items-center gap-2 text-purple-400 font-bold mb-1">
                  <Key className="w-4 h-4" />
                  <span>Primary & Foreign Keys</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  UUID / String PKs with ON DELETE CASCADE for Phases & Activities, and ON DELETE RESTRICT on Classifications.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                <div className="flex items-center gap-2 text-blue-400 font-bold mb-1">
                  <Building2 className="w-4 h-4" />
                  <span>Organizational Context</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Scoping columns for company_id, branch_id, department_id, and cost_center_id on every project master.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                  <Clock className="w-4 h-4" />
                  <span>Audit & Concurrency</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Standard created_at, updated_at, deleted_at, is_deleted soft-delete, and row_version optimistic locks.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl">
                <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Integrity Constraints</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Strict CHECK constraints on progress (0..100%), sequences (&gt;0), valid statuses, and non-negative budgets.
                </p>
              </div>
            </div>
          </div>

          {/* Table Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(PROJECT_DB_SCHEMAS).map(tableKey => {
              const table = PROJECT_DB_SCHEMAS[tableKey];
              const isSelected = selectedSchemaTableKey === tableKey;
              return (
                <button
                  key={tableKey}
                  onClick={() => setSelectedSchemaTableKey(tableKey)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>{table.tableName}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded ${isSelected ? 'bg-purple-800 text-purple-200' : 'bg-slate-800 text-slate-400'}`}>
                    {table.columns.length} cols
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Table Schema Details */}
          {PROJECT_DB_SCHEMAS[selectedSchemaTableKey] && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-white">
                      {PROJECT_DB_SCHEMAS[selectedSchemaTableKey].tableName}
                    </span>
                    <span className="text-xs text-purple-400 font-semibold">
                      ({PROJECT_DB_SCHEMAS[selectedSchemaTableKey].displayName})
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {PROJECT_DB_SCHEMAS[selectedSchemaTableKey].description}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Primary Key:</span>
                  <span className="font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                    {PROJECT_DB_SCHEMAS[selectedSchemaTableKey].primaryKey}
                  </span>
                </div>
              </div>

              {/* Columns Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Column Name</th>
                      <th className="py-3 px-4">SQL Data Type</th>
                      <th className="py-3 px-4">Nullable</th>
                      <th className="py-3 px-4">Key / Reference</th>
                      <th className="py-3 px-4">Default Value / Constraint</th>
                      <th className="py-3 px-4">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {PROJECT_DB_SCHEMAS[selectedSchemaTableKey].columns.map(col => (
                      <tr key={col.name} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {col.isPrimaryKey && <Key className="w-3.5 h-3.5 text-amber-400" />}
                            {col.isForeignKey && <Network className="w-3.5 h-3.5 text-blue-400" />}
                            <span className={col.isPrimaryKey ? 'text-amber-300' : col.isForeignKey ? 'text-blue-300' : 'text-slate-200'}>
                              {col.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-purple-400 whitespace-nowrap">
                          {col.dataType}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {col.isNullable ? (
                            <span className="text-slate-500">NULL</span>
                          ) : (
                            <span className="text-rose-400 font-bold">NOT NULL</span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {col.isPrimaryKey ? (
                            <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 text-[10px] font-bold">
                              PRIMARY KEY
                            </span>
                          ) : col.isForeignKey ? (
                            <span className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800 text-[10px] font-bold">
                              FK &rarr; {col.references}
                            </span>
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-[11px] text-slate-400">
                          {col.defaultValue && <span className="text-emerald-400 mr-2">DEFAULT {col.defaultValue}</span>}
                          {col.checkConstraint && <span className="text-amber-400/90 text-[10px] block">CHECK ({col.checkConstraint})</span>}
                          {!col.defaultValue && !col.checkConstraint && <span className="text-slate-600">-</span>}
                        </td>
                        <td className="py-3 px-4 font-sans text-slate-300 text-[11px]">
                          {col.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Indexes & Foreign Keys Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-950/50 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <h4 className="font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-purple-400" />
                    <span>Indexes on {PROJECT_DB_SCHEMAS[selectedSchemaTableKey].tableName}</span>
                  </h4>
                  <div className="space-y-1.5">
                    {PROJECT_DB_SCHEMAS[selectedSchemaTableKey].indexes.map(idx => (
                      <div key={idx.name} className="bg-slate-900 border border-slate-800 p-2 rounded-lg font-mono text-[11px] flex items-center justify-between">
                        <span className="text-purple-300">{idx.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">({idx.columns.join(', ')})</span>
                          {idx.isUnique && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[9px] font-bold">
                              UNIQUE
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Network className="w-3.5 h-3.5 text-blue-400" />
                    <span>Foreign Key Constraints</span>
                  </h4>
                  <div className="space-y-1.5">
                    {PROJECT_DB_SCHEMAS[selectedSchemaTableKey].foreignKeys.length === 0 ? (
                      <p className="text-slate-500 italic text-[11px]">No outgoing foreign keys (Base Root Master)</p>
                    ) : (
                      PROJECT_DB_SCHEMAS[selectedSchemaTableKey].foreignKeys.map(fk => (
                        <div key={fk.name} className="bg-slate-900 border border-slate-800 p-2 rounded-lg font-mono text-[11px] flex items-center justify-between">
                          <span className="text-blue-300">{fk.column}</span>
                          <span className="text-slate-400">&rarr; {fk.refTable}({fk.refColumn}) [{fk.onDelete}]</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: NEW PROJECT CHARTER */}
      {/* ========================================== */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl p-6 space-y-4 shadow-2xl text-xs my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-purple-400" />
                <span>Create New Project Master Charter</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">10.01 Project Setup</span>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-300 font-semibold">Project Title / Scope Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Duqm Heavy Refinery — Hydrocracker Flare Gas Unit Phase 3"
                    value={newProjectForm.projectName}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, projectName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Client Principal Entity *</label>
                  <select
                    value={newProjectForm.clientEntity}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, clientEntity: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {clientEntities.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Operating Company Entity *</label>
                  <select
                    value={newProjectForm.company}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, company: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {companies.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Regional Branch Office *</label>
                  <select
                    value={newProjectForm.branch}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, branch: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {branches.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Cost Center Allocation *</label>
                  <select
                    value={newProjectForm.costCenter}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, costCenter: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {costCenters.map(cc => (
                      <option key={cc} value={cc}>{cc}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Commercials */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Contract Number Ref *</label>
                  <input
                    type="text"
                    required
                    value={newProjectForm.contractNumber}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, contractNumber: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Contract Value *</label>
                  <input
                    type="number"
                    required
                    value={newProjectForm.contractValue}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, contractValue: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Currency *</label>
                  <select
                    value={newProjectForm.currency}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, currency: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  >
                    {currencies.map(curr => (
                      <option key={curr} value={curr}>{curr}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Classification, Billing Method & Project Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Project Classification</label>
                  <select
                    value={newProjectForm.projectClassificationId}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, projectClassificationId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {classifications.map(c => (
                      <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Project Type</label>
                  <select
                    value={newProjectForm.projectType}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, projectType: e.target.value as ProjectType })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="OIL_GAS_FACILITY">Oil & Gas Facility</option>
                    <option value="EPC_COMMERCIAL">EPC Commercial</option>
                    <option value="INFRASTRUCTURE">Infrastructure</option>
                    <option value="INDUSTRIAL_FABRICATION">Industrial Fabrication</option>
                    <option value="RESIDENTIAL_COMPLEX">Residential Complex</option>
                    <option value="MAINTENANCE_SHUTDOWN">Maintenance Shutdown</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Billing Method</label>
                  <select
                    value={newProjectForm.billingMethod}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, billingMethod: e.target.value as BillingMethod })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="PROGRESS_PERCENT_COMPLETION">Percentage of Completion (POCM)</option>
                    <option value="MILESTONE_DELIVERABLE">Milestone Deliverable</option>
                    <option value="TIME_AND_MATERIALS">Time & Materials</option>
                    <option value="FIXED_LUMP_SUM">Fixed Lump Sum</option>
                  </select>
                </div>
              </div>

              {/* Leadership & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Project Manager *</label>
                  <select
                    value={newProjectForm.projectManager}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, projectManager: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {projectManagers.map(pm => (
                      <option key={pm} value={pm}>{pm}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Site Engineer *</label>
                  <select
                    value={newProjectForm.siteEngineer}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, siteEngineer: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {siteEngineers.map(se => (
                      <option key={se} value={se}>{se}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Site Physical Location *</label>
                  <input
                    type="text"
                    required
                    value={newProjectForm.location}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, location: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Dates & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Commencement Date *</label>
                  <input
                    type="date"
                    required
                    value={newProjectForm.startDate}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, startDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Target Handover Date *</label>
                  <input
                    type="date"
                    required
                    value={newProjectForm.targetCompletionDate}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, targetCompletionDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Baseline Budget Cost *</label>
                  <input
                    type="number"
                    required
                    value={newProjectForm.totalBudget}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, totalBudget: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold cursor-pointer shadow-lg shadow-purple-900/40"
                >
                  Commit & Save Project Charter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: EDIT PROJECT CHARTER */}
      {/* ========================================== */}
      {showEditProjectModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl p-6 space-y-4 shadow-2xl text-xs my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-purple-400" />
                <span>Edit Project Charter: {selectedProject.projectCode}</span>
              </h2>
            </div>

            <form onSubmit={handleSaveEditProject} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Project Title</label>
                <input
                  type="text"
                  required
                  value={editProjectForm.projectName || ''}
                  onChange={(e) => setEditProjectForm({ ...editProjectForm, projectName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Contract Value</label>
                  <input
                    type="number"
                    value={editProjectForm.contractValue || 0}
                    onChange={(e) => setEditProjectForm({ ...editProjectForm, contractValue: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Status</label>
                  <select
                    value={editProjectForm.status}
                    onChange={(e) => setEditProjectForm({ ...editProjectForm, status: e.target.value as ProjectMaster['status'] })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="PLANNING">Planning</option>
                    <option value="ACTIVE_IN_PROGRESS">Active in Progress</option>
                    <option value="PROPOSED">Proposed</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="SUBSTANTIALLY_COMPLETE">Substantially Complete</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Priority</label>
                  <select
                    value={editProjectForm.priority}
                    onChange={(e) => setEditProjectForm({ ...editProjectForm, priority: e.target.value as ProjectPriority })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL_FAST_TRACK">Critical Fast Track</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Project Manager</label>
                  <select
                    value={editProjectForm.projectManager}
                    onChange={(e) => setEditProjectForm({ ...editProjectForm, projectManager: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {projectManagers.map(pm => (
                      <option key={pm} value={pm}>{pm}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Site Location</label>
                  <input
                    type="text"
                    value={editProjectForm.location || ''}
                    onChange={(e) => setEditProjectForm({ ...editProjectForm, location: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditProjectModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: ADD CLASSIFICATION */}
      {/* ========================================== */}
      {showNewClassificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-xs">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <span>Create Project Classification Taxonomy</span>
            </h2>

            <form onSubmit={handleCreateClassification} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Classification Code</label>
                  <input
                    type="text"
                    required
                    value={newClassificationForm.code}
                    onChange={(e) => setNewClassificationForm({ ...newClassificationForm, code: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Sector Category</label>
                  <select
                    value={newClassificationForm.sector}
                    onChange={(e) => setNewClassificationForm({ ...newClassificationForm, sector: e.target.value as ProjectClassification['sector'] })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="ENERGY_UTILITIES">Energy & Utilities</option>
                    <option value="HEAVY_ENGINEERING">Heavy Engineering</option>
                    <option value="CONSTRUCTION_CIVIL">Construction & Civil</option>
                    <option value="COMMERCIAL_BUILD">Commercial Build</option>
                    <option value="GOVERNMENT_INFRA">Government Infrastructure</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Classification Name</label>
                <input
                  type="text"
                  required
                  value={newClassificationForm.name}
                  onChange={(e) => setNewClassificationForm({ ...newClassificationForm, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={newClassificationForm.description}
                  onChange={(e) => setNewClassificationForm({ ...newClassificationForm, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Overhead %</label>
                  <input
                    type="number"
                    value={newClassificationForm.standardOverheadMarkupPercent}
                    onChange={(e) => setNewClassificationForm({ ...newClassificationForm, standardOverheadMarkupPercent: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Retention %</label>
                  <input
                    type="number"
                    value={newClassificationForm.standardRetentionRatePercent}
                    onChange={(e) => setNewClassificationForm({ ...newClassificationForm, standardRetentionRatePercent: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Advance Rec %</label>
                  <input
                    type="number"
                    value={newClassificationForm.standardAdvanceRecoveryPercent}
                    onChange={(e) => setNewClassificationForm({ ...newClassificationForm, standardAdvanceRecoveryPercent: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewClassificationModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold cursor-pointer"
                >
                  Save Classification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: ADD PHASE */}
      {/* ========================================== */}
      {showNewPhaseModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-xs">
            <h2 className="text-base font-bold text-white">Add Phase Milestone to {selectedProject.projectCode}</h2>
            <form onSubmit={handleAddPhase} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Sequence No.</label>
                  <input
                    type="number"
                    required
                    value={newPhaseForm.phaseSequence}
                    onChange={(e) => setNewPhaseForm({ ...newPhaseForm, phaseSequence: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-slate-300 font-semibold">Phase Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Phase 3: Piping & E&I Hookup"
                    value={newPhaseForm.phaseName}
                    onChange={(e) => setNewPhaseForm({ ...newPhaseForm, phaseName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={newPhaseForm.description}
                  onChange={(e) => setNewPhaseForm({ ...newPhaseForm, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Allocated Budget ({selectedProject.currency})</label>
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

      {/* ========================================== */}
      {/* MODAL: EDIT PHASE */}
      {/* ========================================== */}
      {showEditPhaseModal && selectedPhaseForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-xs">
            <h2 className="text-base font-bold text-white">Edit Phase: {selectedPhaseForEdit.phaseName}</h2>
            <form onSubmit={handleSaveEditPhase} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Phase Title</label>
                <input
                  type="text"
                  required
                  value={selectedPhaseForEdit.phaseName}
                  onChange={(e) => setSelectedPhaseForEdit({ ...selectedPhaseForEdit, phaseName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Allocated Budget ({selectedProject?.currency})</label>
                  <input
                    type="number"
                    value={selectedPhaseForEdit.budgetAllocated}
                    onChange={(e) => setSelectedPhaseForEdit({ ...selectedPhaseForEdit, budgetAllocated: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Weightage %</label>
                  <input
                    type="number"
                    value={selectedPhaseForEdit.weightagePercent}
                    onChange={(e) => setSelectedPhaseForEdit({ ...selectedPhaseForEdit, weightagePercent: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Phase Status</label>
                <select
                  value={selectedPhaseForEdit.status}
                  onChange={(e) => setSelectedPhaseForEdit({ ...selectedPhaseForEdit, status: e.target.value as ProjectPhase['status'] })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="UPCOMING">Upcoming</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="DELAYED">Delayed</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditPhaseModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold cursor-pointer"
                >
                  Save Phase Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: ADD WBS ACTIVITY */}
      {/* ========================================== */}
      {showNewActivityModal && selectedProject && (
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

      {/* ========================================== */}
      {/* MODAL: EDIT WBS ACTIVITY */}
      {/* ========================================== */}
      {showEditActivityModal && selectedActivityForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-xs">
            <h2 className="text-base font-bold text-white">Edit WBS: {selectedActivityForEdit.activity.wbsCode}</h2>
            <form onSubmit={handleSaveEditActivity} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Activity Title</label>
                <input
                  type="text"
                  required
                  value={selectedActivityForEdit.activity.activityName}
                  onChange={(e) => setSelectedActivityForEdit({
                    ...selectedActivityForEdit,
                    activity: { ...selectedActivityForEdit.activity, activityName: e.target.value }
                  })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Planned Cost</label>
                  <input
                    type="number"
                    value={selectedActivityForEdit.activity.plannedCost}
                    onChange={(e) => setSelectedActivityForEdit({
                      ...selectedActivityForEdit,
                      activity: { ...selectedActivityForEdit.activity, plannedCost: Number(e.target.value) }
                    })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Duration (Days)</label>
                  <input
                    type="number"
                    value={selectedActivityForEdit.activity.durationDays}
                    onChange={(e) => setSelectedActivityForEdit({
                      ...selectedActivityForEdit,
                      activity: { ...selectedActivityForEdit.activity, durationDays: Number(e.target.value) }
                    })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Assigned Team Leader</label>
                <input
                  type="text"
                  value={selectedActivityForEdit.activity.assignedTeamLeader}
                  onChange={(e) => setSelectedActivityForEdit({
                    ...selectedActivityForEdit,
                    activity: { ...selectedActivityForEdit.activity, assignedTeamLeader: e.target.value }
                  })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditActivityModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold cursor-pointer"
                >
                  Save Activity Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: QUICK PROGRESS SLIDER */}
      {/* ========================================== */}
      {showProgressModal && activityForProgress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-400" />
                <span>Update Physical Work Progress</span>
              </h2>
              <span className="font-mono text-purple-400 font-bold">{activityForProgress.activity.wbsCode}</span>
            </div>

            <p className="text-slate-300 font-semibold text-sm">{activityForProgress.activity.activityName}</p>

            <form onSubmit={handleSaveProgress} className="space-y-4">
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center">
                  <label className="text-slate-400 font-semibold">Progress Percentage</label>
                  <span className="text-lg font-bold font-mono text-purple-400">{newProgressValue}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={newProgressValue}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setNewProgressValue(val);
                    if (val === 100) setNewStatusValue('COMPLETED');
                    else if (val > 0) setNewStatusValue('IN_PROGRESS');
                    else setNewStatusValue('NOT_STARTED');
                  }}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Activity Status</label>
                <select
                  value={newStatusValue}
                  onChange={(e) => setNewStatusValue(e.target.value as ProjectActivity['status'])}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="NOT_STARTED">Not Started (0%)</option>
                  <option value="IN_PROGRESS">In Progress (Active Execution)</option>
                  <option value="COMPLETED">Completed (100% Certified)</option>
                  <option value="BLOCKED">Blocked (Hold / Permit Delay)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowProgressModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Update & Roll-up Progress</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

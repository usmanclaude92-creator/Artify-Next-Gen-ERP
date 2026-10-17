// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 10: PROJECT MANAGEMENT & JOB COSTING
// Transaction 10.01.01.01 — Project Master Management View
// List View with Advanced Filters (Company/Status) & Detailed Data Entry Form
// ==========================================

import React, { useState, useMemo } from 'react';
import { useProjectStore } from '../../services/projectStore';
import {
  ProjectMaster,
  ProjectType,
  ProjectPriority,
  ProjectStatus,
  BillingMethod,
  ProjectClassification
} from '../../types';
import {
  FolderKanban,
  Building2,
  Building,
  DollarSign,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  Edit3,
  Trash2,
  Download,
  Share2,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
  Calendar,
  User,
  MapPin,
  Tag,
  ShieldCheck,
  Briefcase,
  Layers,
  FileSpreadsheet,
  CheckSquare,
  Square,
  Sparkles,
  Info,
  X,
  Check,
  TrendingUp,
  Percent,
  Compass,
  FileText
} from 'lucide-react';

interface ProjectMasterViewProps {
  onNavigateToPlanning?: (projectId: string) => void;
  onNavigateToCosting?: (projectId: string) => void;
}

export const ProjectMasterView: React.FC<ProjectMasterViewProps> = ({
  onNavigateToPlanning,
  onNavigateToCosting
}) => {
  const {
    projects,
    selectedProject,
    setSelectedProject,
    companies,
    branches,
    departments,
    costCenters,
    clientEntities,
    projectManagers,
    siteEngineers,
    currencies,
    classifications,
    createProject,
    updateProject,
    deleteProject
  } = useProjectStore();

  // View & Filter States
  const [viewMode, setViewMode] = useState<'TABLE' | 'CARDS'>('TABLE');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('ALL');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'projectCode' | 'projectName' | 'contractValue' | 'overallProgressPercent' | 'startDate' | 'targetCompletionDate'>('projectCode');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals & Drawers
  const [showDataEntryModal, setShowDataEntryModal] = useState(false);
  const [formMode, setFormMode] = useState<'CREATE' | 'EDIT'>('CREATE');
  const [activeFormTab, setActiveFormTab] = useState<'CHARTER' | 'ORGANIZATION' | 'COMMERCIAL' | 'LEADERSHIP' | 'TIMELINE' | 'BUDGET'>('CHARTER');
  const [show360Drawer, setShow360Drawer] = useState(false);
  const [drawerProject, setDrawerProject] = useState<ProjectMaster | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Form State
  const initialFormData: Omit<ProjectMaster, 'id' | 'totalCommitted' | 'totalActualCost' | 'totalBilledAmount' | 'totalReceivedAmount' | 'overallProgressPercent' | 'phases'> = {
    projectCode: `PRJ-2026-OM-${String(projects.length + 1).padStart(3, '0')}`,
    projectName: '',
    clientEntity: clientEntities[0] || 'Oman National Petrochemicals Corp (ONPC)',
    clientContactPerson: 'Eng. Khalid Al-Rawahi',
    clientEmail: 'k.rawahi@onpc.om',
    clientPhone: '+968 2450 8899',
    contractNumber: `ONPC-EPC-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
    contractValue: 2500000,
    currency: currencies[0] || 'OMR',
    company: companies[0] || 'Oman Heavy Industries SAOC',
    branch: branches[0] || 'Sohar Industrial Port Regional Office',
    department: departments[0] || 'EPC Project Delivery Directorate',
    costCenter: costCenters[0] || 'CC-PRJ-SOHAR-01 (EPC Sohar)',
    projectType: 'EPC_COMMERCIAL',
    projectClassificationId: classifications[0]?.id || 'class-01',
    projectManager: projectManagers[0] || 'Dr. Tarek Al-Ghamdi (PMP, EPC Director)',
    siteEngineer: siteEngineers[0] || 'Eng. Salem Al-Maamari',
    location: 'Sohar Industrial Free Zone, Quay 4',
    startDate: new Date().toISOString().split('T')[0],
    targetCompletionDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    status: 'PLANNING',
    priority: 'HIGH',
    billingMethod: 'PROGRESS_PERCENT_COMPLETION',
    totalBudget: 2000000,
    retentionWithheldPercent: 10,
    customTags: ['Petrochemical', 'EPC Turnkey', 'Fast-Track']
  };

  const [formData, setFormData] = useState<typeof initialFormData>(initialFormData);
  const [formValidationErrors, setFormValidationErrors] = useState<Record<string, string>>({});
  const [autoGenCode, setAutoGenCode] = useState(true);
  const [customTagInput, setCustomTagInput] = useState('');

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          project.projectCode.toLowerCase().includes(term) ||
          project.projectName.toLowerCase().includes(term) ||
          project.clientEntity.toLowerCase().includes(term) ||
          project.projectManager.toLowerCase().includes(term) ||
          project.branch.toLowerCase().includes(term) ||
          (project.company && project.company.toLowerCase().includes(term)) ||
          project.contractNumber.toLowerCase().includes(term) ||
          project.customTags?.some(tag => tag.toLowerCase().includes(term));
        if (!matchesSearch) return false;
      }

      // Company Filter
      if (selectedCompanyFilter !== 'ALL') {
        const projectCompany = project.company || companies[0];
        if (projectCompany !== selectedCompanyFilter) return false;
      }

      // Status Filter
      if (selectedStatusFilter !== 'ALL' && project.status !== selectedStatusFilter) {
        return false;
      }

      // Branch Filter
      if (selectedBranchFilter !== 'ALL' && project.branch !== selectedBranchFilter) {
        return false;
      }

      // Priority Filter
      if (selectedPriorityFilter !== 'ALL' && project.priority !== selectedPriorityFilter) {
        return false;
      }

      // Project Type Filter
      if (selectedTypeFilter !== 'ALL' && project.projectType !== selectedTypeFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let aVal = a[sortBy] ?? '';
      let bVal = b[sortBy] ?? '';

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }

      if (typeof aVal === 'number') {
        return sortDirection === 'asc'
          ? (aVal as number) - (bVal as number)
          : (bVal as number) - (aVal as number);
      }

      return 0;
    });
  }, [
    projects,
    searchTerm,
    selectedCompanyFilter,
    selectedStatusFilter,
    selectedBranchFilter,
    selectedPriorityFilter,
    selectedTypeFilter,
    sortBy,
    sortDirection,
    companies
  ]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(start, start + itemsPerPage);
  }, [filteredProjects, currentPage, itemsPerPage]);

  // Aggregate Portfolio KPIs
  const portfolioKPIs = useMemo(() => {
    const totalCount = projects.length;
    const activeCount = projects.filter(p => p.status === 'ACTIVE_IN_PROGRESS').length;
    const planningCount = projects.filter(p => p.status === 'PLANNING').length;
    const completedCount = projects.filter(p => p.status === 'SUBSTANTIALLY_COMPLETE' || p.status === 'CLOSED').length;
    const totalContractValue = projects.reduce((acc, p) => acc + (p.contractValue || 0), 0);
    const totalBaselineBudget = projects.reduce((acc, p) => acc + (p.totalBudget || 0), 0);
    const totalActualCost = projects.reduce((acc, p) => acc + (p.totalActualCost || 0), 0);
    const totalBilled = projects.reduce((acc, p) => acc + (p.totalBilledAmount || 0), 0);
    const avgProgress = totalCount > 0 ? (projects.reduce((acc, p) => acc + (p.overallProgressPercent || 0), 0) / totalCount).toFixed(1) : '0';

    return {
      totalCount,
      activeCount,
      planningCount,
      completedCount,
      totalContractValue,
      totalBaselineBudget,
      totalActualCost,
      totalBilled,
      avgProgress
    };
  }, [projects]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setFormMode('CREATE');
    setFormData({
      ...initialFormData,
      projectCode: `PRJ-2026-OM-${String(projects.length + 1).padStart(3, '0')}`,
      projectName: ''
    });
    setFormValidationErrors({});
    setActiveFormTab('CHARTER');
    setShowDataEntryModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (project: ProjectMaster) => {
    setFormMode('EDIT');
    setFormData({
      projectCode: project.projectCode,
      projectName: project.projectName,
      clientEntity: project.clientEntity,
      clientContactPerson: project.clientContactPerson || '',
      clientEmail: project.clientEmail || '',
      clientPhone: project.clientPhone || '',
      contractNumber: project.contractNumber || '',
      contractValue: project.contractValue || 0,
      currency: project.currency || 'OMR',
      company: project.company || companies[0] || 'Oman Heavy Industries SAOC',
      branch: project.branch,
      department: project.department || departments[0] || '',
      costCenter: project.costCenter || costCenters[0] || '',
      projectType: project.projectType,
      projectClassificationId: project.projectClassificationId || classifications[0]?.id || '',
      projectManager: project.projectManager,
      siteEngineer: project.siteEngineer,
      location: project.location,
      startDate: project.startDate,
      targetCompletionDate: project.targetCompletionDate,
      status: project.status,
      priority: project.priority,
      billingMethod: project.billingMethod,
      totalBudget: project.totalBudget || 0,
      retentionWithheldPercent: project.retentionWithheldPercent || 10,
      customTags: project.customTags || []
    });
    setFormValidationErrors({});
    setActiveFormTab('CHARTER');
    setShowDataEntryModal(true);
  };

  // Validate Form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.projectName.trim()) {
      errors.projectName = 'Project Title / Name is required';
    }
    if (!formData.projectCode.trim()) {
      errors.projectCode = 'Project Code is required';
    }
    if (!formData.contractValue || formData.contractValue <= 0) {
      errors.contractValue = 'Awarded contract value must be greater than 0';
    }
    if (!formData.totalBudget || formData.totalBudget <= 0) {
      errors.totalBudget = 'Approved baseline budget must be greater than 0';
    }
    if (!formData.startDate) {
      errors.startDate = 'Project Start Date is required';
    }
    if (!formData.targetCompletionDate) {
      errors.targetCompletionDate = 'Target Completion Date is required';
    } else if (new Date(formData.targetCompletionDate) <= new Date(formData.startDate)) {
      errors.targetCompletionDate = 'Target Completion Date must be after Start Date';
    }

    setFormValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save Form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fix the highlighted validation errors before saving.', 'warning');
      return;
    }

    if (formMode === 'CREATE') {
      createProject(formData);
      showToast(`Project Master ${formData.projectCode} successfully created in ERP database.`);
    } else if (formMode === 'EDIT' && selectedProject) {
      updateProject(selectedProject.id, formData);
      showToast(`Project Master ${formData.projectCode} successfully updated.`);
    }

    setShowDataEntryModal(false);
  };

  // Handle Tag Addition
  const handleAddCustomTag = () => {
    if (customTagInput.trim() && !formData.customTags.includes(customTagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        customTags: [...prev.customTags, customTagInput.trim()]
      }));
      setCustomTagInput('');
    }
  };

  const handleRemoveCustomTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      customTags: prev.customTags.filter(t => t !== tagToRemove)
    }));
  };

  // Handle Classification Selection (auto-populate defaults)
  const handleClassificationChange = (classId: string) => {
    const selectedClass = classifications.find(c => c.id === classId);
    if (selectedClass) {
      setFormData(prev => ({
        ...prev,
        projectClassificationId: classId,
        retentionWithheldPercent: selectedClass.standardRetentionRatePercent
      }));
    } else {
      setFormData(prev => ({ ...prev, projectClassificationId: classId }));
    }
  };

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedProjectIds.length === paginatedProjects.length) {
      setSelectedProjectIds([]);
    } else {
      setSelectedProjectIds(paginatedProjects.map(p => p.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedProjectIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Project Code',
      'Project Name',
      'Company',
      'Branch',
      'Client Entity',
      'Contract Value',
      'Currency',
      'Status',
      'Priority',
      'Project Manager',
      'Progress %',
      'Start Date',
      'Target Date'
    ];

    const rows = filteredProjects.map(p => [
      `"${p.projectCode}"`,
      `"${p.projectName.replace(/"/g, '""')}"`,
      `"${(p.company || companies[0]).replace(/"/g, '""')}"`,
      `"${p.branch.replace(/"/g, '""')}"`,
      `"${p.clientEntity.replace(/"/g, '""')}"`,
      p.contractValue,
      p.currency,
      p.status,
      p.priority,
      `"${p.projectManager.replace(/"/g, '""')}"`,
      p.overallProgressPercent,
      p.startDate,
      p.targetCompletionDate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Artify_AFE_Project_Master_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filteredProjects.length} project records to CSV.`);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCompanyFilter('ALL');
    setSelectedStatusFilter('ALL');
    setSelectedBranchFilter('ALL');
    setSelectedPriorityFilter('ALL');
    setSelectedTypeFilter('ALL');
    setCurrentPage(1);
    showToast('Filters reset to default view.', 'info');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCompanyFilter !== 'ALL' ||
    selectedStatusFilter !== 'ALL' ||
    selectedBranchFilter !== 'ALL' ||
    selectedPriorityFilter !== 'ALL' ||
    selectedTypeFilter !== 'ALL';

  // Status Badge Helper
  const renderStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'ACTIVE_IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        );
      case 'PLANNING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-950/80 text-blue-300 border border-blue-800">
            <Clock className="w-3 h-3 text-blue-400" />
            Planning
          </span>
        );
      case 'PROPOSED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-950/80 text-purple-300 border border-purple-800">
            <Info className="w-3 h-3 text-purple-400" />
            Proposed
          </span>
        );
      case 'ON_HOLD':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            On Hold
          </span>
        );
      case 'SUBSTANTIALLY_COMPLETE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-800">
            <CheckCircle2 className="w-3 h-3 text-indigo-400" />
            Substantial Comp.
          </span>
        );
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
            <ShieldCheck className="w-3 h-3 text-slate-400" />
            Closed Out
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800">
            <XCircle className="w-3 h-3 text-rose-400" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  // Priority Badge Helper
  const renderPriorityBadge = (priority: ProjectPriority) => {
    switch (priority) {
      case 'CRITICAL_FAST_TRACK':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/90 text-rose-300 border border-rose-800 tracking-wider uppercase">
            Critical Fast-Track
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/90 text-amber-300 border border-amber-800">
            High
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            Medium
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900 text-slate-400 border border-slate-800">
            Low
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-sm font-semibold animate-slideUp ${
            toastMessage.type === 'warning'
              ? 'bg-amber-950 text-amber-200 border-amber-700'
              : toastMessage.type === 'info'
              ? 'bg-blue-950 text-blue-200 border-blue-700'
              : 'bg-emerald-950 text-emerald-200 border-emerald-700'
          }`}
        >
          {toastMessage.type === 'warning' ? (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner & Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-purple-400 bg-purple-950/70 px-2.5 py-0.5 rounded border border-purple-800">
                10.01.01.01
              </span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Enterprise Project Master Register
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              <FolderKanban className="w-7 h-7 text-purple-400" />
              Project Master Entities & Charters
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Centralized repository for multi-company project charters, commercial contracts, organizational cost center assignments, leadership assignments, and physical WBS milestones.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer border border-slate-700 transition-colors shadow-sm"
              title="Export filtered project master register to CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer transition-all shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>New Project Charter</span>
            </button>
          </div>
        </div>

        {/* Portfolio KPI Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Total Portfolio</span>
              <Building2 className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-lg font-bold text-white mt-1">
              {portfolioKPIs.totalCount}{' '}
              <span className="text-xs font-normal text-slate-400">Projects</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {portfolioKPIs.activeCount} Active • {portfolioKPIs.planningCount} Planning
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Awarded Contract Value</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-emerald-400 mt-1">
              OMR {(portfolioKPIs.totalContractValue / 1000000).toFixed(2)}M
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Portfolio Base Currency Sum
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Baseline Cost Budget</span>
              <Briefcase className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-lg font-bold text-blue-300 mt-1">
              OMR {(portfolioKPIs.totalBaselineBudget / 1000000).toFixed(2)}M
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Approved Cost Commitment
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Avg Execution Progress</span>
              <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-lg font-bold text-purple-300 mt-1">
              {portfolioKPIs.avgProgress}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Across All Active Sites
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Billed Invoices (To Date)</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-bold text-amber-300 mt-1">
              OMR {(portfolioKPIs.totalBilled / 1000000).toFixed(2)}M
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Certified Progress Billing
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        {/* Main Search and Quick Controls */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by code, title, client principal, PM, branch, or contract #..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:outline-none placeholder:text-slate-500 font-sans"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('TABLE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'TABLE'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Grid / Data Table View"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
              <button
                onClick={() => setViewMode('CARDS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'CARDS'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Cards / Visual Bento View"
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
            </div>

            {/* Reset Filter Button */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer border border-slate-700 transition-colors"
                title="Clear all filters"
              >
                <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Multi-Facet Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {/* Company Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Building className="w-3 h-3 text-purple-400" />
              <span>Company / Entity</span>
            </label>
            <select
              value={selectedCompanyFilter}
              onChange={e => {
                setSelectedCompanyFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Legal Entities ({projects.length})</option>
              {companies.map(comp => {
                const count = projects.filter(p => (p.company || companies[0]) === comp).length;
                return (
                  <option key={comp} value={comp}>
                    {comp} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-400" />
              <span>Lifecycle Status</span>
            </label>
            <select
              value={selectedStatusFilter}
              onChange={e => {
                setSelectedStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses ({projects.length})</option>
              <option value="ACTIVE_IN_PROGRESS">Active in Progress ({projects.filter(p => p.status === 'ACTIVE_IN_PROGRESS').length})</option>
              <option value="PLANNING">Planning ({projects.filter(p => p.status === 'PLANNING').length})</option>
              <option value="PROPOSED">Proposed ({projects.filter(p => p.status === 'PROPOSED').length})</option>
              <option value="ON_HOLD">On Hold ({projects.filter(p => p.status === 'ON_HOLD').length})</option>
              <option value="SUBSTANTIALLY_COMPLETE">Substantially Complete ({projects.filter(p => p.status === 'SUBSTANTIALLY_COMPLETE').length})</option>
              <option value="CLOSED">Closed Out ({projects.filter(p => p.status === 'CLOSED').length})</option>
              <option value="CANCELLED">Cancelled ({projects.filter(p => p.status === 'CANCELLED').length})</option>
            </select>
          </div>

          {/* Branch Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>Regional Branch</span>
            </label>
            <select
              value={selectedBranchFilter}
              onChange={e => {
                setSelectedBranchFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Regional Branches</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>Priority Level</span>
            </label>
            <select
              value={selectedPriorityFilter}
              onChange={e => {
                setSelectedPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL_FAST_TRACK">Critical Fast-Track</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          {/* Project Type Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3 h-3 text-rose-400" />
              <span>Sector & Type</span>
            </label>
            <select
              value={selectedTypeFilter}
              onChange={e => {
                setSelectedTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Project Types</option>
              <option value="EPC_COMMERCIAL">EPC Commercial Plant</option>
              <option value="OIL_GAS_FACILITY">Oil & Gas Facility</option>
              <option value="INFRASTRUCTURE">Civil Infrastructure</option>
              <option value="INDUSTRIAL_FABRICATION">Heavy Industrial Fabrication</option>
              <option value="RESIDENTIAL_COMPLEX">Residential & Commercial Towers</option>
              <option value="MAINTENANCE_SHUTDOWN">Plant Maintenance Shutdown</option>
              <option value="INTERNAL_RD">Internal R&D / Capital Asset</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips & Summary */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-300">Showing {filteredProjects.length} of {projects.length} Projects:</span>
            {selectedCompanyFilter !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-950/70 text-purple-300 border border-purple-800 text-[11px]">
                Company: {selectedCompanyFilter}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-white"
                  onClick={() => setSelectedCompanyFilter('ALL')}
                />
              </span>
            )}
            {selectedStatusFilter !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-950/70 text-blue-300 border border-blue-800 text-[11px]">
                Status: {selectedStatusFilter}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-white"
                  onClick={() => setSelectedStatusFilter('ALL')}
                />
              </span>
            )}
            {selectedBranchFilter !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/70 text-emerald-300 border border-emerald-800 text-[11px]">
                Branch: {selectedBranchFilter}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-white"
                  onClick={() => setSelectedBranchFilter('ALL')}
                />
              </span>
            )}
          </div>

          {selectedProjectIds.length > 0 && (
            <div className="flex items-center gap-2 bg-purple-950/40 px-3 py-1 rounded-lg border border-purple-800/80">
              <span className="text-purple-300 font-semibold text-[11px]">
                {selectedProjectIds.length} Selected
              </span>
              <button
                onClick={() => {
                  if (window.confirm(`Archive ${selectedProjectIds.length} selected projects?`)) {
                    selectedProjectIds.forEach(id => deleteProject(id));
                    setSelectedProjectIds([]);
                    showToast(`Archived ${selectedProjectIds.length} projects.`);
                  }
                }}
                className="text-rose-400 hover:text-rose-300 text-[11px] font-bold cursor-pointer ml-2"
              >
                Bulk Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* VIEW 1: DATA TABLE VIEW */}
      {/* ========================================== */}
      {viewMode === 'TABLE' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        paginatedProjects.length > 0 &&
                        selectedProjectIds.length === paginatedProjects.length
                      }
                      onChange={handleToggleSelectAll}
                      className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                  </th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                    onClick={() => {
                      if (sortBy === 'projectCode') {
                        setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
                      } else {
                        setSortBy('projectCode');
                        setSortDirection('asc');
                      }
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Project Code</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                    onClick={() => {
                      if (sortBy === 'projectName') {
                        setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
                      } else {
                        setSortBy('projectName');
                        setSortDirection('asc');
                      }
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Project Title & Client</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Company & Branch</th>
                  <th
                    className="py-3.5 px-4 text-right cursor-pointer hover:text-white transition-colors"
                    onClick={() => {
                      if (sortBy === 'contractValue') {
                        setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
                      } else {
                        setSortBy('contractValue');
                        setSortDirection('desc');
                      }
                    }}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Contract Value</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Project Manager</th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                    onClick={() => {
                      if (sortBy === 'overallProgressPercent') {
                        setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
                      } else {
                        setSortBy('overallProgressPercent');
                        setSortDirection('desc');
                      }
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Execution Progress</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Status & Priority</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {paginatedProjects.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500">
                      <FolderKanban className="w-12 h-12 mx-auto text-slate-700 mb-2" />
                      <p className="text-sm font-semibold text-slate-400">No project masters match your criteria</p>
                      <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search keywords.</p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-3 px-3 py-1.5 rounded-lg bg-purple-950 text-purple-300 border border-purple-800 text-xs font-semibold cursor-pointer hover:bg-purple-900"
                      >
                        Clear All Filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  paginatedProjects.map(project => {
                    const isSelected = selectedProject.id === project.id;
                    const isChecked = selectedProjectIds.includes(project.id);
                    const companyName = project.company || companies[0];

                    return (
                      <tr
                        key={project.id}
                        className={`hover:bg-slate-800/40 transition-colors group ${
                          isSelected ? 'bg-purple-950/20' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSelectRow(project.id)}
                            className="rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-purple-500 cursor-pointer"
                          />
                        </td>

                        {/* Code & Selection Marker */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedProject(project);
                                showToast(`Active runner context set to ${project.projectCode}`, 'info');
                              }}
                              className={`font-mono text-xs font-bold px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-purple-600 text-white border-purple-500'
                                  : 'bg-slate-950 text-purple-400 border-slate-800 hover:border-purple-600'
                              }`}
                              title="Click to set as current active project"
                            >
                              {project.projectCode}
                            </button>
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Active Project" />
                            )}
                          </div>
                        </td>

                        {/* Title & Client Principal */}
                        <td className="py-3.5 px-4">
                          <div>
                            <div className="font-bold text-slate-100 hover:text-purple-300 transition-colors cursor-pointer flex items-center gap-1.5"
                              onClick={() => {
                                setDrawerProject(project);
                                setShow360Drawer(true);
                              }}
                            >
                              <span>{project.projectName}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <Building2 className="w-3 h-3 text-slate-500" />
                              <span className="text-slate-300 font-medium">{project.clientEntity}</span>
                              <span className="text-slate-600">•</span>
                              <span className="font-mono text-slate-500 text-[10px]">{project.contractNumber}</span>
                            </div>
                          </div>
                        </td>

                        {/* Company & Branch */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <div className="font-semibold text-slate-300 text-xs flex items-center gap-1">
                              <Building className="w-3 h-3 text-purple-400 shrink-0" />
                              <span className="truncate max-w-[160px]" title={companyName}>
                                {companyName}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-600 shrink-0" />
                              <span className="truncate max-w-[160px]" title={project.branch}>
                                {project.branch}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Contract Value */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="font-mono font-bold text-emerald-400 text-xs">
                            {project.currency} {project.contractValue?.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            Budget: {project.currency} {project.totalBudget?.toLocaleString()}
                          </div>
                        </td>

                        {/* Project Manager */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs text-slate-300">
                            <User className="w-3.5 h-3.5 text-blue-400" />
                            <span className="truncate max-w-[140px]" title={project.projectManager}>
                              {project.projectManager}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Start: {project.startDate}
                          </div>
                        </td>

                        {/* Progress */}
                        <td className="py-3.5 px-4 whitespace-nowrap w-36">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <span className="font-bold text-purple-300">{project.overallProgressPercent}%</span>
                              <span className="text-slate-500 text-[10px]">Target: {project.targetCompletionDate}</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-1.5 rounded-full"
                                style={{ width: `${project.overallProgressPercent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Status & Priority */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div>{renderStatusBadge(project.status)}</div>
                            <div>{renderPriorityBadge(project.priority)}</div>
                          </div>
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setDrawerProject(project);
                                setShow360Drawer(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="Quick 360 Inspection Drawer"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-400" />
                            </button>

                            <button
                              onClick={() => handleOpenEditModal(project)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="Edit Project Charter"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Archive Project Master ${project.projectCode}?`)) {
                                  deleteProject(project.id);
                                  showToast(`Project ${project.projectCode} archived.`, 'info');
                                }
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                              title="Archive Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
            <div>
              Showing {filteredProjects.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredProjects.length)} of {filteredProjects.length} Projects
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg font-semibold cursor-pointer transition-colors ${
                    currentPage === page
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* VIEW 2: VISUAL BENTO CARDS VIEW */}
      {/* ========================================== */}
      {viewMode === 'CARDS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedProjects.map(project => {
            const isSelected = selectedProject.id === project.id;
            const companyName = project.company || companies[0];

            return (
              <div
                key={project.id}
                className={`bg-slate-900 border rounded-2xl p-5 shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                  isSelected
                    ? 'border-purple-500/80 ring-1 ring-purple-500/40 shadow-purple-950/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-purple-400 bg-purple-950/80 px-2.5 py-0.5 rounded border border-purple-800">
                        {project.projectCode}
                      </span>
                      {renderPriorityBadge(project.priority)}
                    </div>
                    {renderStatusBadge(project.status)}
                  </div>

                  {/* Title & Scope */}
                  <div>
                    <h3
                      className="font-bold text-white text-base hover:text-purple-300 transition-colors cursor-pointer line-clamp-2"
                      onClick={() => {
                        setDrawerProject(project);
                        setShow360Drawer(true);
                      }}
                    >
                      {project.projectName}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="font-semibold text-slate-300 truncate">{project.clientEntity}</span>
                    </p>
                  </div>

                  {/* Company & Branch Cardlet */}
                  <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500 text-[11px]">Operating Entity:</span>
                      <span className="font-semibold truncate max-w-[180px] text-purple-300">{companyName}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500 text-[11px]">Regional Branch:</span>
                      <span className="truncate max-w-[180px] text-slate-300">{project.branch}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500 text-[11px]">Project Manager:</span>
                      <span className="truncate max-w-[180px] text-blue-300 font-medium">{project.projectManager}</span>
                    </div>
                  </div>

                  {/* Financial & Schedule Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-950/40 border border-slate-800/60 p-2.5 rounded-xl">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Contract Value</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">
                        {project.currency} {(project.contractValue / 1000).toLocaleString()}k
                      </span>
                    </div>
                    <div className="bg-slate-950/40 border border-slate-800/60 p-2.5 rounded-xl">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Target Date</span>
                      <span className="font-mono text-slate-300 text-xs block mt-0.5">
                        {project.targetCompletionDate}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Execution Progress</span>
                      <span className="font-bold text-purple-300">{project.overallProgressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                        style={{ width: `${project.overallProgressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-800/80">
                  <button
                    onClick={() => {
                      setSelectedProject(project);
                      showToast(`Active project set to ${project.projectCode}`, 'info');
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isSelected ? 'Active Context' : 'Select Project'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setDrawerProject(project);
                        setShow360Drawer(true);
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                      title="Inspect 360 Details"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(project)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                      title="Edit Charter"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: COMPREHENSIVE DATA ENTRY FORM */}
      {/* ========================================== */}
      {showDataEntryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {formMode === 'CREATE' ? 'New Project Master Charter' : `Edit Charter: ${formData.projectCode}`}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Comprehensive enterprise data entry across contract, scoping, leadership, and budgets.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDataEntryModal(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-950/40 px-4 gap-2 py-2">
              <button
                onClick={() => setActiveFormTab('CHARTER')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeFormTab === 'CHARTER'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span>1. Core Charter</span>
              </button>
              <button
                onClick={() => setActiveFormTab('ORGANIZATION')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeFormTab === 'ORGANIZATION'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>2. Org Hierarchy</span>
              </button>
              <button
                onClick={() => setActiveFormTab('COMMERCIAL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeFormTab === 'COMMERCIAL'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>3. Commercial & Client</span>
              </button>
              <button
                onClick={() => setActiveFormTab('LEADERSHIP')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeFormTab === 'LEADERSHIP'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>4. Leadership & Site</span>
              </button>
              <button
                onClick={() => setActiveFormTab('TIMELINE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeFormTab === 'TIMELINE'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>5. Schedule & Dates</span>
              </button>
              <button
                onClick={() => setActiveFormTab('BUDGET')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeFormTab === 'BUDGET'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Percent className="w-3.5 h-3.5" />
                <span>6. Budgets & Margins</span>
              </button>
            </div>

            {/* Modal Body / Form Inputs */}
            <form onSubmit={handleSaveForm} className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* TAB 1: CORE CHARTER & TAXONOMY */}
              {activeFormTab === 'CHARTER' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-slate-300">
                          Project Code <span className="text-rose-400">*</span>
                        </label>
                        {formMode === 'CREATE' && (
                          <button
                            type="button"
                            onClick={() => {
                              setAutoGenCode(!autoGenCode);
                              if (!autoGenCode) {
                                setFormData(prev => ({
                                  ...prev,
                                  projectCode: `PRJ-2026-OM-${String(projects.length + 1).padStart(3, '0')}`
                                }));
                              }
                            }}
                            className="text-[10px] text-purple-400 hover:underline"
                          >
                            {autoGenCode ? 'Manual Code' : 'Auto Generate'}
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={formData.projectCode}
                        onChange={e => setFormData(prev => ({ ...prev, projectCode: e.target.value }))}
                        disabled={formMode === 'CREATE' && autoGenCode}
                        className={`w-full bg-slate-950 border rounded-xl px-3 py-2 text-xs font-mono text-white focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                          formValidationErrors.projectCode ? 'border-rose-500' : 'border-slate-800'
                        }`}
                      />
                      {formValidationErrors.projectCode && (
                        <p className="text-[10px] text-rose-400">{formValidationErrors.projectCode}</p>
                      )}
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Project Name / Title <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Duqm Refinery Cryogenic Nitrogen Plant Extension"
                        value={formData.projectName}
                        onChange={e => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                        className={`w-full bg-slate-950 border rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                          formValidationErrors.projectName ? 'border-rose-500' : 'border-slate-800'
                        }`}
                      />
                      {formValidationErrors.projectName && (
                        <p className="text-[10px] text-rose-400">{formValidationErrors.projectName}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Project Classification Taxonomy
                      </label>
                      <select
                        value={formData.projectClassificationId}
                        onChange={e => handleClassificationChange(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                      >
                        {classifications.map(cls => (
                          <option key={cls.id} value={cls.id}>
                            {cls.code} — {cls.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Project Sector & Type
                      </label>
                      <select
                        value={formData.projectType}
                        onChange={e => setFormData(prev => ({ ...prev, projectType: e.target.value as ProjectType }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                      >
                        <option value="EPC_COMMERCIAL">EPC Commercial Plant</option>
                        <option value="OIL_GAS_FACILITY">Oil & Gas Facility</option>
                        <option value="INFRASTRUCTURE">Civil Infrastructure</option>
                        <option value="INDUSTRIAL_FABRICATION">Heavy Industrial Fabrication</option>
                        <option value="RESIDENTIAL_COMPLEX">Residential & Commercial Towers</option>
                        <option value="MAINTENANCE_SHUTDOWN">Plant Maintenance Shutdown</option>
                        <option value="INTERNAL_RD">Internal R&D / Capital Asset</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Priority Level
                      </label>
                      <select
                        value={formData.priority}
                        onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value as ProjectPriority }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                      >
                        <option value="CRITICAL_FAST_TRACK">Critical Fast-Track</option>
                        <option value="HIGH">High Priority</option>
                        <option value="MEDIUM">Medium Priority</option>
                        <option value="LOW">Low Priority</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Lifecycle Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as ProjectStatus }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                      >
                        <option value="PROPOSED">Proposed</option>
                        <option value="PLANNING">Planning</option>
                        <option value="ACTIVE_IN_PROGRESS">Active in Progress</option>
                        <option value="ON_HOLD">On Hold</option>
                        <option value="SUBSTANTIALLY_COMPLETE">Substantially Complete</option>
                        <option value="CLOSED">Closed Out</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Custom Search Tags & Keywords
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Add keyword (e.g. API 620, Turnkey)..."
                          value={customTagInput}
                          onChange={e => setCustomTagInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomTag();
                            }
                          }}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomTag}
                          className="px-3 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {formData.customTags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800 text-[11px]"
                          >
                            {tag}
                            <X
                              className="w-3 h-3 cursor-pointer hover:text-white"
                              onClick={() => handleRemoveCustomTag(tag)}
                            />
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ORGANIZATIONAL HIERARCHY & COST SCOPING */}
              {activeFormTab === 'ORGANIZATION' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-1">
                    <p className="font-semibold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      Multi-Tenant Enterprise Organizational Context
                    </p>
                    <p>
                      Every project is scoped to an authorized company entity, branch location, operating department, and cost center for ERP general ledger segregation.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Operating Legal Entity (Company) <span className="text-rose-400">*</span>
                      </label>
                      <select
                        value={formData.company}
                        onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                      >
                        {companies.map(comp => (
                          <option key={comp} value={comp}>
                            {comp}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Regional Branch / Operating Center <span className="text-rose-400">*</span>
                      </label>
                      <select
                        value={formData.branch}
                        onChange={e => setFormData(prev => ({ ...prev, branch: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                      >
                        {branches.map(b => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Operating Department
                      </label>
                      <select
                        value={formData.department}
                        onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                      >
                        {departments.map(d => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Assigned ERP Cost Center
                      </label>
                      <select
                        value={formData.costCenter}
                        onChange={e => setFormData(prev => ({ ...prev, costCenter: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                      >
                        {costCenters.map(cc => (
                          <option key={cc} value={cc}>
                            {cc}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: COMMERCIAL & CLIENT TERMS */}
              {activeFormTab === 'COMMERCIAL' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Client Principal Entity <span className="text-rose-400">*</span>
                      </label>
                      <select
                        value={formData.clientEntity}
                        onChange={e => setFormData(prev => ({ ...prev, clientEntity: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                      >
                        {clientEntities.map(client => (
                          <option key={client} value={client}>
                            {client}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Contract Reference / Award Letter #
                      </label>
                      <input
                        type="text"
                        value={formData.contractNumber}
                        onChange={e => setFormData(prev => ({ ...prev, contractNumber: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Client Representative
                      </label>
                      <input
                        type="text"
                        value={formData.clientContactPerson}
                        onChange={e => setFormData(prev => ({ ...prev, clientContactPerson: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Client Email
                      </label>
                      <input
                        type="email"
                        value={formData.clientEmail}
                        onChange={e => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Client Phone Number
                      </label>
                      <input
                        type="text"
                        value={formData.clientPhone}
                        onChange={e => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Awarded Contract Value <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={formData.contractValue}
                        onChange={e => setFormData(prev => ({ ...prev, contractValue: parseFloat(e.target.value) || 0 }))}
                        className={`w-full bg-slate-950 border rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-400 focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                          formValidationErrors.contractValue ? 'border-rose-500' : 'border-slate-800'
                        }`}
                      />
                      {formValidationErrors.contractValue && (
                        <p className="text-[10px] text-rose-400">{formValidationErrors.contractValue}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Contract Currency
                      </label>
                      <select
                        value={formData.currency}
                        onChange={e => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                      >
                        {currencies.map(curr => (
                          <option key={curr} value={curr}>
                            {curr}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Billing Method
                      </label>
                      <select
                        value={formData.billingMethod}
                        onChange={e => setFormData(prev => ({ ...prev, billingMethod: e.target.value as BillingMethod }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                      >
                        <option value="PROGRESS_PERCENT_COMPLETION">Progress % Completion (IPC)</option>
                        <option value="MILESTONE_DELIVERABLE">Milestone Deliverables</option>
                        <option value="TIME_AND_MATERIALS">Time & Materials (T&M)</option>
                        <option value="FIXED_LUMP_SUM">Fixed Lump Sum</option>
                        <option value="COST_PLUS_PERCENT">Cost Plus % Markup</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: LEADERSHIP & SITE LOGISTICS */}
              {activeFormTab === 'LEADERSHIP' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Assigned Project Manager (PM) <span className="text-rose-400">*</span>
                      </label>
                      <select
                        value={formData.projectManager}
                        onChange={e => setFormData(prev => ({ ...prev, projectManager: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                      >
                        {projectManagers.map(pm => (
                          <option key={pm} value={pm}>
                            {pm}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Assigned Lead Site Engineer <span className="text-rose-400">*</span>
                      </label>
                      <select
                        value={formData.siteEngineer}
                        onChange={e => setFormData(prev => ({ ...prev, siteEngineer: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                      >
                        {siteEngineers.map(se => (
                          <option key={se} value={se}>
                            {se}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Physical Site Location / Berth / Coordinates
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-rose-400" />
                      <input
                        type="text"
                        placeholder="e.g. Sohar Port Industrial Zone, Quay 4, Berth 12 (24.498° N, 56.634° E)"
                        value={formData.location}
                        onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: TIMELINE & SCHEDULE DATES */}
              {activeFormTab === 'TIMELINE' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Notice to Proceed (NTP) / Start Date <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        className={`w-full bg-slate-950 border rounded-xl px-3 py-2 text-xs font-mono text-white focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                          formValidationErrors.startDate ? 'border-rose-500' : 'border-slate-800'
                        }`}
                      />
                      {formValidationErrors.startDate && (
                        <p className="text-[10px] text-rose-400">{formValidationErrors.startDate}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Target Contractual Completion Date <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.targetCompletionDate}
                        onChange={e => setFormData(prev => ({ ...prev, targetCompletionDate: e.target.value }))}
                        className={`w-full bg-slate-950 border rounded-xl px-3 py-2 text-xs font-mono text-white focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                          formValidationErrors.targetCompletionDate ? 'border-rose-500' : 'border-slate-800'
                        }`}
                      />
                      {formValidationErrors.targetCompletionDate && (
                        <p className="text-[10px] text-rose-400">{formValidationErrors.targetCompletionDate}</p>
                      )}
                    </div>
                  </div>

                  {formData.startDate && formData.targetCompletionDate && (
                    <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs flex items-center justify-between text-slate-400 font-mono">
                      <span>Calculated Calendar Duration:</span>
                      <span className="text-purple-300 font-bold">
                        {Math.max(
                          0,
                          Math.ceil(
                            (new Date(formData.targetCompletionDate).getTime() -
                              new Date(formData.startDate).getTime()) /
                              86400000
                          )
                        )}{' '}
                        Days (~
                        {(
                          Math.max(
                            0,
                            Math.ceil(
                              (new Date(formData.targetCompletionDate).getTime() -
                                new Date(formData.startDate).getTime()) /
                                86400000
                            )
                          ) / 30.4
                        ).toFixed(1)}{' '}
                        Months)
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: BUDGETS & MARGINS */}
              {activeFormTab === 'BUDGET' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Approved Total Baseline Cost Budget <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={formData.totalBudget}
                        onChange={e => setFormData(prev => ({ ...prev, totalBudget: parseFloat(e.target.value) || 0 }))}
                        className={`w-full bg-slate-950 border rounded-xl px-3 py-2 text-xs font-mono font-bold text-blue-300 focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                          formValidationErrors.totalBudget ? 'border-rose-500' : 'border-slate-800'
                        }`}
                      />
                      {formValidationErrors.totalBudget && (
                        <p className="text-[10px] text-rose-400">{formValidationErrors.totalBudget}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Standard Retention Rate Withheld (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        step="0.5"
                        value={formData.retentionWithheldPercent}
                        onChange={e => setFormData(prev => ({ ...prev, retentionWithheldPercent: parseFloat(e.target.value) || 0 }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Computed Margin Analysis */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                    <div className="font-semibold text-slate-200">Commercial Margin Analysis:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                      <div>
                        <span className="text-slate-500 text-[11px] block">Contract Revenue:</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          {formData.currency} {formData.contractValue?.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[11px] block">Baseline Budget:</span>
                        <span className="font-mono text-blue-300 font-bold">
                          {formData.currency} {formData.totalBudget?.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[11px] block">Expected Gross Margin:</span>
                        <span
                          className={`font-mono font-bold ${
                            formData.contractValue - formData.totalBudget >= 0
                              ? 'text-purple-300'
                              : 'text-rose-400'
                          }`}
                        >
                          {formData.contractValue > 0
                            ? (
                                ((formData.contractValue - formData.totalBudget) /
                                  formData.contractValue) *
                                100
                              ).toFixed(1)
                            : 0}
                          % ({formData.currency}{' '}
                          {(formData.contractValue - formData.totalBudget)?.toLocaleString()})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowDataEntryModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  {activeFormTab !== 'BUDGET' ? (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs: (typeof activeFormTab)[] = ['CHARTER', 'ORGANIZATION', 'COMMERCIAL', 'LEADERSHIP', 'TIMELINE', 'BUDGET'];
                        const nextIndex = tabs.indexOf(activeFormTab) + 1;
                        if (nextIndex < tabs.length) setActiveFormTab(tabs[nextIndex]);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-bold cursor-pointer transition-colors"
                    >
                      Next Section &rarr;
                    </button>
                  ) : null}

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer transition-all shadow-lg shadow-purple-600/30"
                  >
                    {formMode === 'CREATE' ? 'Save Project Charter' : 'Update Project Master'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* DRAWER: PROJECT 360 COMPREHENSIVE VIEW */}
      {/* ========================================== */}
      {show360Drawer && drawerProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end animate-fadeIn">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-2xl h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-purple-400 bg-purple-950/80 px-2.5 py-0.5 rounded border border-purple-800">
                      {drawerProject.projectCode}
                    </span>
                    {renderStatusBadge(drawerProject.status)}
                    {renderPriorityBadge(drawerProject.priority)}
                  </div>
                  <h2 className="text-xl font-bold text-white mt-2">{drawerProject.projectName}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Operating Entity: <strong className="text-slate-300">{drawerProject.company || companies[0]}</strong>
                  </p>
                </div>

                <button
                  onClick={() => setShow360Drawer(false)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Commercial & Contractual Summary */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Commercial Terms & Client Reference</span>
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Client Principal:</span>
                    <span className="font-bold text-slate-200">{drawerProject.clientEntity}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Contract Reference #:</span>
                    <span className="font-mono text-slate-300">{drawerProject.contractNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Awarded Contract Value:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {drawerProject.currency} {drawerProject.contractValue?.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Baseline Cost Budget:</span>
                    <span className="font-mono font-bold text-blue-300">
                      {drawerProject.currency} {drawerProject.totalBudget?.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Billing Method:</span>
                    <span className="text-slate-300">{drawerProject.billingMethod}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Retention Rate:</span>
                    <span className="text-slate-300">{drawerProject.retentionWithheldPercent}%</span>
                  </div>
                </div>
              </div>

              {/* Leadership & Location */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-blue-400" />
                  <span>Execution Team & Site Coordinates</span>
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Project Manager:</span>
                    <span className="font-semibold text-slate-200">{drawerProject.projectManager}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Lead Site Engineer:</span>
                    <span className="font-semibold text-slate-200">{drawerProject.siteEngineer}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block text-[11px]">Physical Site Location:</span>
                    <span className="text-slate-300 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      {drawerProject.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Phases & WBS Summary */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Project Phases ({drawerProject.phases?.length || 0})</span>
                  </h4>
                  <span className="text-xs text-purple-300 font-bold">
                    {drawerProject.overallProgressPercent}% Total
                  </span>
                </div>

                {drawerProject.phases && drawerProject.phases.length > 0 ? (
                  <div className="space-y-2">
                    {drawerProject.phases.map(phase => (
                      <div
                        key={phase.id}
                        className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs space-y-1"
                      >
                        <div className="flex justify-between font-semibold text-slate-200">
                          <span>{phase.phaseName}</span>
                          <span className="font-mono text-purple-400">{phase.completionPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-purple-500 h-1.5 rounded-full"
                            style={{ width: `${phase.completionPercent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>Budget: {drawerProject.currency} {phase.budgetAllocated.toLocaleString()}</span>
                          <span>Weight: {phase.weightagePercent}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No milestone phases defined yet for this charter.</p>
                )}
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedProject(drawerProject);
                  setShow360Drawer(false);
                  showToast(`Active project context set to ${drawerProject.projectCode}`, 'info');
                }}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer transition-all text-center"
              >
                Set as Active Context
              </button>
              <button
                onClick={() => {
                  setShow360Drawer(false);
                  handleOpenEditModal(drawerProject);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
              >
                Edit Charter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

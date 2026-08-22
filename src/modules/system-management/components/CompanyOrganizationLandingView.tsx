import React, { useState } from 'react';
import {
  Building2,
  Building,
  Layers,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Globe2,
  TrendingUp,
  Landmark,
  FileCheck2,
  Settings,
  ChevronRight,
  Briefcase,
  MapPin,
  GitFork,
  LayoutGrid
} from 'lucide-react';
import { useSystemManagement } from '../services/systemManagementStore';
import { ERPRouteState } from '../../../types/erp';
import { GroupHoldingManagementView } from './GroupHoldingManagementView';

interface CompanyOrganizationLandingViewProps {
  onNavigate?: (route: ERPRouteState) => void;
}

export const CompanyOrganizationLandingView: React.FC<CompanyOrganizationLandingViewProps> = ({
  onNavigate
}) => {
  const [activeLandingMode, setActiveLandingMode] = useState<'modules' | 'hierarchy'>('modules');

  const {
    companies = [],
    groups = [],
    groupMemberships = [],
    branches = [],
    locations = [],
    departments = [],
    operatingUnits = [],
    fiscalYears = [],
    postingPeriods = []
  } = useSystemManagement();

  const handleOpenProcess = (processId: string) => {
    if (processId === 'group-holding-hierarchy' || processId === 'hierarchy' || processId === 'manage-hierarchy') {
      setActiveLandingMode('hierarchy');
      return;
    }
    if (onNavigate) {
      onNavigate({
        view: 'process',
        moduleId: 'system-management',
        functionalAreaId: 'company-organization-setup',
        processId
      });
    }
  };

  const handleOpenTransaction = (processId: string, transactionId: string) => {
    if (processId === 'group-holding-hierarchy' || processId === 'hierarchy') {
      setActiveLandingMode('hierarchy');
      return;
    }
    if (onNavigate) {
      onNavigate({
        view: 'transaction',
        moduleId: 'system-management',
        functionalAreaId: 'company-organization-setup',
        processId,
        transactionId
      });
    }
  };

  const activeCompaniesCount = companies.filter(c => c.status === 'Active').length;
  const activeBranchesCount = branches.filter(b => b.status === 'Active').length;
  const openPeriodsCount = postingPeriods.filter(p => p.overallStatus === 'Open').length;
  const currentFiscalYear = fiscalYears.find(f => f.isCurrent) || fiscalYears[0];

  const functionalModules = [
    {
      id: 'company-setup',
      code: '01.01.01',
      title: 'Company Setup',
      icon: Building2,
      color: 'indigo',
      badge: `${activeCompaniesCount} of ${companies.length} Active`,
      description: 'Manage legal entities, corporate profiles, and statutory parameters.',
      details: 'Configure multi-entity legal structures, tax identifiers, statutory registrations, currency standards, fiscal calendars, and enterprise branding.',
      operations: [
        { name: 'Company Creation', txId: 'tx-company-creation', code: '01.01.01.01' },
        { name: 'Company Profile', txId: 'tx-company-profile', code: '01.01.01.02' },
        { name: 'Company Info', txId: 'tx-company-info', code: '01.01.01.03' },
        { name: 'Branding & Logo', txId: 'tx-company-branding', code: '01.01.01.04' },
        { name: 'Fiscal Parameters', txId: 'tx-company-params', code: '01.01.01.05' }
      ],
      kpis: [
        { label: 'Total Entities', value: companies.length },
        { label: 'Active Status', value: `${Math.round((activeCompaniesCount / (companies.length || 1)) * 100)}%` }
      ]
    },
    {
      id: 'branch-location-setup',
      code: '01.01.02',
      title: 'Branch & Location Setup',
      icon: Landmark,
      color: 'sky',
      badge: `${activeBranchesCount} Branches • ${locations.length} Sites`,
      description: 'Manage branches, operational sites, and regional facilities.',
      details: 'Configure multi-branch networks, physical warehouses, regional trading hubs, transit points, and branch-specific statutory licenses.',
      operations: [
        { name: 'Branch Creation', txId: 'tx-branch-creation', code: '01.01.02.01' },
        { name: 'Location Setup', txId: 'tx-location-setup', code: '01.01.02.02' },
        { name: 'Branch Mapping', txId: 'tx-branch-mapping', code: '01.01.02.03' },
        { name: 'License Management', txId: 'tx-branch-license', code: '01.01.02.04' }
      ],
      kpis: [
        { label: 'Operating Branches', value: branches.length },
        { label: 'Physical Sites', value: locations.length }
      ]
    },
    {
      id: 'org-structure',
      code: '01.01.03',
      title: 'Organizational Structure',
      icon: Layers,
      color: 'emerald',
      badge: `${departments.length} Cost Centers • ${operatingUnits.length} Divisions`,
      description: 'Manage business divisions, functional departments, and organograms.',
      details: 'Define enterprise business divisions, operational departments, cost center hierarchies, and executive reporting relationships.',
      operations: [
        { name: 'Department Setup', txId: 'tx-dept-setup', code: '01.01.03.01' },
        { name: 'Division Setup', txId: 'tx-division-setup', code: '01.01.03.02' },
        { name: 'Section Setup', txId: 'tx-section-setup', code: '01.01.03.03' },
        { name: 'Reporting Organogram', txId: 'tx-reporting-structure', code: '01.01.03.04' }
      ],
      kpis: [
        { label: 'Departments', value: departments.length },
        { label: 'P&L Segments', value: operatingUnits.length }
      ]
    },
    {
      id: 'fiscal-year',
      code: '01.01.04',
      title: 'Fiscal Year Setup',
      icon: Calendar,
      color: 'amber',
      badge: `${currentFiscalYear?.yearCode || 'FY 2026'} Current`,
      description: 'Manage corporate fiscal calendars.',
      details: 'Define accounting annual cycles (Calendar Year, Split Fiscal Year), transition periods, and year-end closing controls.',
      operations: [
        { name: 'Fiscal Year Creation', txId: 'tx-fy-creation', code: '01.01.04.01' },
        { name: 'Fiscal Year Opening', txId: 'tx-fy-opening', code: '01.01.04.02' },
        { name: 'Fiscal Year Closing', txId: 'tx-fy-closing', code: '01.01.04.03' },
        { name: 'Year-End Configuration', txId: 'tx-ye-config', code: '01.01.04.04' }
      ],
      kpis: [
        { label: 'Configured FYs', value: fiscalYears.length },
        { label: 'Status', value: currentFiscalYear?.status || 'Open' }
      ]
    },
    {
      id: 'posting-periods',
      code: '01.01.05',
      title: 'Posting Periods',
      icon: Clock,
      color: 'purple',
      badge: `${openPeriodsCount} Open Periods`,
      description: 'Manage financial posting periods.',
      details: 'Generate 12/13 month period calendars, authorize period openings/closings, and enforce granular sub-ledger locking (GL, AP, AR, Inventory, Fixed Assets, Payroll).',
      operations: [
        { name: 'Period Creation', txId: 'tx-period-creation', code: '01.01.05.01' },
        { name: 'Period Opening', txId: 'tx-period-opening', code: '01.01.05.02' },
        { name: 'Period Closing', txId: 'tx-period-closing', code: '01.01.05.03' },
        { name: 'Period Locking', txId: 'tx-period-locking', code: '01.01.05.04' }
      ],
      kpis: [
        { label: 'Open Sub-Ledgers', value: openPeriodsCount },
        { label: 'Calendar Periods', value: postingPeriods.length }
      ]
    },
    {
      id: 'group-holding-hierarchy',
      code: '01.01.06',
      title: 'Manage Hierarchy & Group Holding',
      icon: GitFork,
      color: 'indigo',
      badge: `${groups.length} Groups • ${groupMemberships.length} Subsidiaries`,
      description: 'Manage enterprise holding entities, corporate apex structures, parent-subsidiary relationships, and consolidation ownership percentages.',
      details: 'Configure multi-tier corporate hierarchies, IFRS 10 full consolidation vs equity accounting, circular relationship prevention, and interactive organograms.',
      operations: [
        { name: 'Group Entity Creation', txId: 'tx-group-creation', code: '01.01.06.01' },
        { name: 'Subsidiary & Member Mapping', txId: 'tx-group-members', code: '01.01.06.02' },
        { name: 'Multi-Tier Organogram Tree', txId: 'tx-hierarchy-tree', code: '01.01.06.03' },
        { name: 'Consolidation & Ownership Rules', txId: 'tx-group-consolidation', code: '01.01.06.04' }
      ],
      kpis: [
        { label: 'Holding Groups', value: groups.length },
        { label: 'Subsidiaries', value: groupMemberships.length }
      ]
    }
  ];

  if (activeLandingMode === 'hierarchy') {
    return (
      <div id="company-hierarchy-wrapper" className="space-y-4 pb-12">
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveLandingMode('modules')}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Back to Functional Modules</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800">
                01.01.06
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Manage Hierarchy Studio (Group & Holding Multi-Tier Structure)
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveLandingMode('modules')}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>01.01 Modules Overview</span>
          </button>
        </div>

        <GroupHoldingManagementView />
      </div>
    );
  }

  return (
    <div id="company-org-landing-view" className="space-y-6 pb-12">
      {/* Module Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800">
                  01.01
                </span>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Company & Organization Setup
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                  Operational Master
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
                Manage companies, holding hierarchies, branches, locations, organizational structures, fiscal years and posting periods.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setActiveLandingMode('hierarchy')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              title="Launch Multi-Tier Enterprise Group & Holding Hierarchy Studio"
            >
              <GitFork className="w-4 h-4" />
              <span>Manage Hierarchy</span>
            </button>
            <button
              onClick={() => handleOpenProcess('company-setup')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4" />
              <span>Company Master</span>
            </button>
          </div>
        </div>

        {/* Enterprise Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Holding Groups
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {groups.length}
              </span>
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                {groupMemberships.length} members
              </span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Legal Entities
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {companies.length}
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                {activeCompaniesCount} active
              </span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Branches & Sites
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {branches.length + locations.length}
              </span>
              <span className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">
                {branches.length} branches
              </span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Cost Centers / Depts
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {departments.length}
              </span>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                {operatingUnits.length} P&L units
              </span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Fiscal Calendars
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {fiscalYears.length}
              </span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                {currentFiscalYear?.yearCode || 'FY 2026'} active
              </span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Open Periods
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {openPeriodsCount}
              </span>
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                of {postingPeriods.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Level 3 Functional Modules Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Level-3 Functional Modules
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any functional module below to configure organizational entities, enterprise hierarchies, facility networks, and financial controls.
            </p>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            6 Modules Configured
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {functionalModules.map(mod => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                id={`card-${mod.id}`}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header matching reference style */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/70 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:border-indigo-200 dark:group-hover:border-indigo-800 transition-colors shrink-0 shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {mod.code}
                        </span>
                        <h3
                          onClick={() => handleOpenProcess(mod.id)}
                          className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer"
                        >
                          {mod.title}
                        </h3>
                      </div>
                      <div className="mt-1">
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                          {mod.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-3.5 leading-relaxed">
                    {mod.description}
                  </p>

                  {/* Operations List */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2.5">
                      CORE OPERATIONS
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {mod.operations.map((op, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleOpenTransaction(mod.id, op.txId)}
                          className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800/80 dark:hover:bg-indigo-950/60 text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-300 border border-slate-200/90 hover:border-indigo-300 dark:border-slate-700/80 dark:hover:border-indigo-700 font-medium transition-colors cursor-pointer text-left"
                          title={`Launch ${op.name} (${op.code})`}
                        >
                          {op.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer / Action */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {mod.kpis[0].label}: <strong className="text-slate-800 dark:text-slate-200 font-bold">{mod.kpis[0].value}</strong>
                  </div>

                  <button
                    onClick={() => handleOpenProcess(mod.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800/80 transition-all cursor-pointer group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 shadow-2xs"
                  >
                    <span>{mod.id === 'group-holding-hierarchy' ? 'Manage Hierarchy' : 'Open Module'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

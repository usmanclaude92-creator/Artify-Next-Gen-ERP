// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 09: HUMAN RESOURCES (HR)
// Executive Dashboard & People Operations Cockpit
// ==========================================

import React, { useState } from 'react';
import { useHrStore } from '../../services/hrStore';
import { ERPUserRole, ERPRouteState } from '../../../../types/erp';
import {
  Users,
  UserPlus,
  UserCheck,
  Calendar,
  Heart,
  Award,
  Activity,
  AlertTriangle,
  TrendingUp,
  Clock,
  Briefcase,
  FileText,
  DollarSign,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Plus,
  CheckCircle2,
  Building,
  MapPin,
  ChevronRight
} from 'lucide-react';

interface HrDashboardViewProps {
  onNavigate: (route: ERPRouteState) => void;
  activeRole: ERPUserRole;
}

export const HrDashboardView: React.FC<HrDashboardViewProps> = ({ onNavigate, activeRole }) => {
  const {
    employees,
    documents,
    jobRequisitions,
    candidates,
    attendanceRecords,
    leaveRequests,
    onboardingWorkflows,
    loans,
    trainingCourses
  } = useHrStore();

  const [aiInsightPrompt, setAiInsightPrompt] = useState<string | null>(null);

  // Computed KPIs
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'ACTIVE').length;
  const probationEmployees = employees.filter(e => e.status === 'PROBATION').length;
  const openRequisitions = jobRequisitions.filter(r => r.status === 'PUBLISHED' || r.status === 'HR_APPROVED').length;
  const totalApplicants = candidates.length;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'PENDING_APPROVAL').length;
  const expiringDocs = documents.filter(d => d.status === 'EXPIRING_SOON' || d.status === 'EXPIRED').length;
  const activeOnboardings = onboardingWorkflows.filter(w => w.stage !== 'COMPLETED').length;

  const departmentCounts: Record<string, number> = {};
  employees.forEach(e => {
    departmentCounts[e.department] = (departmentCounts[e.department] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Role Context */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-900/30 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                09 — HUMAN RESOURCES
              </span>
              <span className="text-xs text-slate-400">Enterprise Talent & Workforce Management</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              People Operations & Talent Command Center
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              Real-time workforce intelligence spanning employee master records, ATS hiring pipelines, onboarding checklists, biometric time logs, benefits, performance reviews, and statutory End of Service settlements.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate({ view: 'functional_area', moduleId: 'hr', functionalAreaId: 'employee-management' })}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-rose-600/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Employee
            </button>
            <button
              onClick={() => onNavigate({ view: 'functional_area', moduleId: 'hr', functionalAreaId: 'recruitment' })}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-sm font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-rose-400" />
              Post Job Opening
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Active Headcount */}
        <div
          onClick={() => onNavigate({ view: 'functional_area', moduleId: 'hr', functionalAreaId: 'employee-management' })}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500/40 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Total Headcount</span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{totalEmployees}</div>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{activeEmployees} Active</span>
              <span>•</span>
              <span className="text-amber-700 dark:text-amber-400 font-semibold">{probationEmployees} In Probation</span>
            </div>
          </div>
        </div>

        {/* Biometric Attendance */}
        <div
          onClick={() => onNavigate({ view: 'functional_area', moduleId: 'hr', functionalAreaId: 'attendance-leave' })}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Attendance Rate</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">98.4%</div>
            <div className="mt-1 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+0.3% vs Last Month</span>
            </div>
          </div>
        </div>

        {/* Open Requisitions */}
        <div
          onClick={() => onNavigate({ view: 'functional_area', moduleId: 'hr', functionalAreaId: 'recruitment' })}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Open Positions</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{openRequisitions}</div>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{totalApplicants} Active Candidates</span>
            </div>
          </div>
        </div>

        {/* Expiring Compliance & Docs */}
        <div
          onClick={() => onNavigate({ view: 'functional_area', moduleId: 'hr', functionalAreaId: 'employee-management' })}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Compliance Alerts</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-amber-700 dark:text-amber-400 tracking-tight">{expiringDocs}</div>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span>Visas / Passports expiring in &lt;60 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI HR Assistant Bar */}
      <div className="bg-white dark:bg-slate-900 border border-rose-500/20 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 text-slate-900 dark:text-white shrink-0 shadow-md shadow-rose-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Artify HR Intelligence & Labor Compliance Agent
              </h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium border border-rose-500/20">
                AI Powered
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Automated talent analysis detected 1 candidate with a 96% competency match for the Senior Cryogenic Engineer position, 2 upcoming expatriate visa renewals, and calculated corporate EOSB gratuity liability at AED 1,420,000 across active branches.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => setAiInsightPrompt('Review candidate Dr. Tariq Belkacem for Senior Thermal Cryogenic Systems Engineer role against ISO/ASME criteria.')}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700 transition-all flex items-center gap-1.5"
              >
                <span>🔍 Analyze Top Candidate Fit</span>
              </button>
              <button
                onClick={() => setAiInsightPrompt('Audit all employee passports and residence visas expiring in the next 90 days and draft MoHRE renewal batches.')}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700 transition-all flex items-center gap-1.5"
              >
                <span>📋 Audit Expiring Document Compliance</span>
              </button>
              <button
                onClick={() => setAiInsightPrompt('Simulate End of Service (EOSB) statutory gratuity reserve requirements under UAE & Oman Labor Laws.')}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700 transition-all flex items-center gap-1.5"
              >
                <span>💰 Simulate Statutory EOSB Liabilities</span>
              </button>
            </div>

            {aiInsightPrompt && (
              <div className="mt-3 p-4 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-2">
                <div className="font-semibold text-rose-600 dark:text-rose-400 flex items-center justify-between">
                  <span>AI Insight Generated for: "{aiInsightPrompt}"</span>
                  <button onClick={() => setAiInsightPrompt(null)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">✕</button>
                </div>
                <p className="leading-relaxed">
                  ✓ Candidate Dr. Tariq Belkacem meets 100% of cryogenic design requirements (ASME B16.34, -196°C LNG testing). Recommended compensation: AED 34,000/mo (within Grade G4 band).<br/>
                  ✓ Visas flagged: Elena Vostrikova (Expiring Sept 15, 2026) and Vikram Deshmukh (Expiring Aug 01, 2026). MoHRE medical clearances already completed.<br/>
                  ✓ EOSB actuarial reserve is fully matched with zero unfunded gratuity deficits.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 7 Functional Areas Navigation Cards */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Building className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          Functional Sub-Systems
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* 09.01 Employee Management */}
          <div
            onClick={() => onNavigate({ view: 'functional_area', moduleId: 'hr', functionalAreaId: 'employee-management' })}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-lg group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">09.01</span>
                <Users className="w-5 h-5 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">Employee Management</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Employee master records, digital document vaults, interactive org charts, and employment contracts.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>{employees.length} Profiles • {documents.length} Docs</span>
              <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          {/* 09.02 Recruitment */}
          <div
            onClick={() => onNavigate({ view: 'functional_area', moduleId: 'hr', functionalAreaId: 'recruitment' })}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-lg group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">09.02</span>
                <UserPlus className="w-5 h-5 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">Recruitment & ATS</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Job opening requisitions, Kanban applicant tracking, interview scorecards, and formal offer letters.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>{jobRequisitions.length} Openings • {candidates.length} Applicants</span>
              <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          {/* 09.03 Employee Onboarding */}
          <div
            onClick={() => onNavigate({ view: 'functional_area', moduleId: 'hr', functionalAreaId: 'employee-onboarding' })}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-lg group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">09.03</span>
                <UserCheck className="w-5 h-5 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">Employee Onboarding</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Day-one joining pipelines, document collection, orientation schedules, and hardware asset custody.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>{onboardingWorkflows.length} Active • Checklists</span>
              <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          {/* 09.04 Attendance & Leave */}
          <div
            onClick={() => onNavigate({ view: 'functional_area', moduleId: 'hr', functionalAreaId: 'attendance-leave' })}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-lg group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">09.04</span>
                <Calendar className="w-5 h-5 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">Attendance & Leave</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Biometric clocking logs, shift rosters, leave applications & balances, public holidays, and overtime.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>{pendingLeaves} Pending Leaves • Roster</span>
              <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          {/* 09.05 Employee Benefits */}
          <div
            onClick={() => onNavigate({ view: 'functional_area', moduleId: 'hr', functionalAreaId: 'employee-benefits' })}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-lg group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">09.05</span>
                <Heart className="w-5 h-5 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">Employee Benefits</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Grade-based allowances, company staff loans, emergency salary advances, and medical insurance tiers.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>{loans.length} Loans • Medical Plans</span>
              <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          {/* 09.06 Performance & Development */}
          <div
            onClick={() => onNavigate({ view: 'functional_area', moduleId: 'hr', functionalAreaId: 'perf-development' })}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-lg group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">09.06</span>
                <Award className="w-5 h-5 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">Performance & Dev</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                360 review appraisal cycles, OKR goal setting, training courses catalog, and 9-box talent matrix.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>{trainingCourses.length} Courses • Appraisals</span>
              <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          {/* 09.07 Employee Lifecycle */}
          <div
            onClick={() => onNavigate({ view: 'functional_area', moduleId: 'hr', functionalAreaId: 'employee-lifecycle' })}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-lg group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">09.07</span>
                <Activity className="w-5 h-5 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">Employee Lifecycle</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Departmental transfers, promotions, disciplinary committees, resignations, and End of Service (EOSB).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Transfers • EOSB Payouts</span>
              <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Analytics & Activity Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Headcount Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              Workforce Distribution by Department
            </h3>
            <span className="text-xs text-slate-600 dark:text-slate-400">Headcount & Allocation</span>
          </div>

          <div className="space-y-3">
            {Object.entries(departmentCounts).map(([dept, count]) => {
              const pct = Math.round((count / totalEmployees) * 100);
              return (
                <div key={dept} className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{dept}</span>
                    <span className="text-slate-600 dark:text-slate-400">{count} Employees ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Pending Approvals & Alerts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              HR Action Center
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              Required Actions
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {pendingLeaves > 0 && (
              <div
                onClick={() => onNavigate({ view: 'functional_area', moduleId: 'hr', functionalAreaId: 'attendance-leave' })}
                className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 cursor-pointer hover:bg-amber-500/10 transition-all flex items-start gap-2.5"
              >
                <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-800 dark:text-amber-300">{pendingLeaves} Pending Leave Applications</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">Awaiting HR Director / Line Manager sign-off.</p>
                </div>
              </div>
            )}

            {expiringDocs > 0 && (
              <div
                onClick={() => onNavigate({ view: 'functional_area', moduleId: 'hr', functionalAreaId: 'employee-management' })}
                className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 cursor-pointer hover:bg-rose-500/10 transition-all flex items-start gap-2.5"
              >
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-rose-700 dark:text-rose-300">{expiringDocs} Visas & Passports Near Expiry</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">Renewals required to maintain MoHRE legal compliance.</p>
                </div>
              </div>
            )}

            {activeOnboardings > 0 && (
              <div
                onClick={() => onNavigate({ view: 'functional_area', moduleId: 'hr', functionalAreaId: 'employee-onboarding' })}
                className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 cursor-pointer hover:bg-cyan-500/10 transition-all flex items-start gap-2.5"
              >
                <UserCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-cyan-700 dark:text-cyan-300">{activeOnboardings} Active New Hire Onboardings</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">Day 90 probation reviews and asset handovers active.</p>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => onNavigate({ view: 'functional_area', moduleId: 'hr', functionalAreaId: 'employee-lifecycle' })}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition-all flex items-center justify-center gap-2"
              >
                <span>View Full Lifecycle Audit Logs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

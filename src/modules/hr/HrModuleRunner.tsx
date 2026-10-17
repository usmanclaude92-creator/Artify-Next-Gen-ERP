// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 09: HUMAN RESOURCES (HR)
// Main Module Runner & View Router
// ==========================================

import React from 'react';
import {
  ERPModule,
  ERPFunctionalArea,
  ERPProcess,
  ERPTransaction,
  ERPRouteState,
  ERPUserRole
} from '../../types/erp';
import { HrProvider } from './services/hrStore';
import { HrDashboardView } from './components/dashboard/HrDashboardView';
import { EmployeeManagementView } from './components/employee/EmployeeManagementView';
import { RecruitmentView } from './components/recruitment/RecruitmentView';
import { OnboardingView } from './components/onboarding/OnboardingView';
import { AttendanceLeaveView } from './components/attendance/AttendanceLeaveView';
import { BenefitsView } from './components/benefits/BenefitsView';
import { PerformanceDevView } from './components/performance/PerformanceDevView';
import { EmployeeLifecycleView } from './components/lifecycle/EmployeeLifecycleView';
import {
  ArrowLeft,
  Star,
  LayoutDashboard,
  Users,
  UserPlus,
  UserCheck,
  Calendar,
  Heart,
  Award,
  Activity
} from 'lucide-react';

interface HrModuleRunnerProps {
  module: ERPModule;
  functionalArea?: ERPFunctionalArea;
  process?: ERPProcess;
  transaction?: ERPTransaction;
  onNavigate: (route: ERPRouteState) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  activeRole: ERPUserRole;
}

export const HrModuleRunner: React.FC<HrModuleRunnerProps> = ({
  module,
  functionalArea,
  process,
  transaction,
  onNavigate,
  isFavorite,
  onToggleFavorite,
  activeRole
}) => {
  const handleAreaNavigate = (faCodeOrId: string) => {
    const codeMap: Record<string, string> = {
      '09.01': 'employee-management',
      '09.02': 'recruitment',
      '09.03': 'employee-onboarding',
      '09.04': 'attendance-leave',
      '09.05': 'employee-benefits',
      '09.06': 'perf-development',
      '09.07': 'employee-lifecycle'
    };

    const targetId = codeMap[faCodeOrId] || faCodeOrId;
    onNavigate({
      view: 'functional_area',
      moduleId: 'hr',
      functionalAreaId: targetId
    });
  };

  const renderActiveSubView = () => {
    if (!functionalArea) {
      return (
        <HrDashboardView
          onNavigate={(route: any) => onNavigate(route)}
          activeRole={activeRole}
        />
      );
    }

    switch (functionalArea.id) {
      case 'employee-management':
        return (
          <EmployeeManagementView
            initialTab={
              transaction?.id === 'tx-emp-docs'
                ? 'docs'
                : transaction?.id === 'tx-org-chart'
                ? 'orgchart'
                : transaction?.id === 'tx-emp-contracts'
                ? 'contracts'
                : 'master'
            }
            onNavigate={onNavigate}
          />
        );

      case 'recruitment':
        return (
          <RecruitmentView
            initialTab={
              transaction?.id === 'tx-ats'
                ? 'ats'
                : transaction?.id === 'tx-interview-mgmt'
                ? 'interviews'
                : transaction?.id === 'tx-recruit-selection'
                ? 'offers'
                : 'reqs'
            }
            onNavigate={onNavigate}
          />
        );

      case 'employee-onboarding':
        return (
          <OnboardingView
            initialTab={
              transaction?.id === 'tx-doc-collection'
                ? 'docs'
                : transaction?.id === 'tx-emp-induction'
                ? 'induction'
                : transaction?.id === 'tx-asset-assignment-hr'
                ? 'assets'
                : 'joining'
            }
            onNavigate={onNavigate}
          />
        );

      case 'attendance-leave':
        return (
          <AttendanceLeaveView
            initialTab={
              transaction?.id === 'tx-leave-mgmt'
                ? 'leaves'
                : transaction?.id === 'tx-holidays'
                ? 'holidays'
                : transaction?.id === 'tx-overtime'
                ? 'overtime'
                : 'attendance'
            }
            onNavigate={onNavigate}
          />
        );

      case 'employee-benefits':
        return (
          <BenefitsView
            initialTab={
              transaction?.id === 'tx-emp-loans'
                ? 'loans'
                : transaction?.id === 'tx-emp-advances'
                ? 'advances'
                : transaction?.id === 'tx-insurance'
                ? 'insurance'
                : 'plans'
            }
            onNavigate={onNavigate}
          />
        );

      case 'perf-development':
        return (
          <PerformanceDevView
            initialTab={
              transaction?.id === 'tx-career-dev'
                ? 'ninebox'
                : transaction?.id === 'tx-training'
                ? 'training'
                : transaction?.id === 'tx-perf-mgmt'
                ? 'succession'
                : 'reviews'
            }
            onNavigate={onNavigate}
          />
        );

      case 'employee-lifecycle':
        return (
          <EmployeeLifecycleView
            initialTab={
              transaction?.id === 'tx-promotions'
                ? 'promotions'
                : transaction?.id === 'tx-disciplinary-mgmt'
                ? 'disciplinary'
                : transaction?.id === 'tx-emp-separation' || transaction?.id === 'tx-eosb'
                ? 'separation'
                : 'transfers'
            }
            onNavigate={onNavigate}
          />
        );

      default:
        return (
          <HrDashboardView
            onNavigate={(route: any) => onNavigate(route)}
            activeRole={activeRole}
          />
        );
    }
  };

  return (
    <HrProvider>
      <div className="space-y-6">
        {/* Module Header Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate({ view: 'module', moduleId: 'hr' })}
                className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
                title="Back to HR Cockpit"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold shadow-inner">
                <Users className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {module.code} — {module.name}
                  </h1>
                  <button
                    onClick={onToggleFavorite}
                    className={`p-1.5 rounded-xl transition-all ${
                      isFavorite
                        ? 'text-amber-700 dark:text-amber-400 bg-amber-400/10'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {functionalArea
                    ? `${functionalArea.code} ${functionalArea.name} ${process ? `› ${process.name}` : ''} ${transaction ? `› ${transaction.name}` : ''}`
                    : module.description}
                </p>
              </div>
            </div>

            {/* Quick Functional Area Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <button
                onClick={() => onNavigate({ view: 'module', moduleId: 'hr' })}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  !functionalArea
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                    : 'bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Executive Cockpit</span>
              </button>

              <button
                onClick={() => handleAreaNavigate('09.01')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  functionalArea?.id === 'employee-management'
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                    : 'bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>09.01 Master & Docs</span>
              </button>

              <button
                onClick={() => handleAreaNavigate('09.02')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  functionalArea?.id === 'recruitment'
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                    : 'bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>09.02 ATS & Hiring</span>
              </button>

              <button
                onClick={() => handleAreaNavigate('09.03')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  functionalArea?.id === 'employee-onboarding'
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                    : 'bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>09.03 Onboarding</span>
              </button>

              <button
                onClick={() => handleAreaNavigate('09.04')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  functionalArea?.id === 'attendance-leave'
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                    : 'bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>09.04 Time & Leave</span>
              </button>

              <button
                onClick={() => handleAreaNavigate('09.05')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  functionalArea?.id === 'employee-benefits'
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                    : 'bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>09.05 Benefits</span>
              </button>

              <button
                onClick={() => handleAreaNavigate('09.06')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  functionalArea?.id === 'perf-development'
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                    : 'bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>09.06 9-Box & Reviews</span>
              </button>

              <button
                onClick={() => handleAreaNavigate('09.07')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  functionalArea?.id === 'employee-lifecycle'
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                    : 'bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>09.07 Lifecycle & EOSB</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic View Mount */}
        {renderActiveSubView()}
      </div>
    </HrProvider>
  );
};

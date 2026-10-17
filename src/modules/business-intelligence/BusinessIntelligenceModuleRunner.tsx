import React, { useState } from 'react';
import {
  ERPModule,
  ERPFunctionalArea,
  ERPProcess,
  ERPTransaction,
  ERPRouteState,
  ERPUserRole
} from '../../types/erp';
import { BIProvider } from './services/biStore';
import { ExecutiveDashboardView } from './components/dashboards/ExecutiveDashboardView';
import { ManagementDashboardView } from './components/dashboards/ManagementDashboardView';
import { DepartmentDashboardView } from './components/dashboards/DepartmentDashboardView';
import { OperationalDashboardView } from './components/dashboards/OperationalDashboardView';

import { KpiDefinitionView } from './components/kpis/KpiDefinitionView';
import { KpiTargetsView } from './components/kpis/KpiTargetsView';
import { KpiMonitoringView } from './components/kpis/KpiMonitoringView';
import { KpiScorecardsView } from './components/kpis/KpiScorecardsView';

import { ProfitAndLossView } from './components/financial/ProfitAndLossView';
import { BalanceSheetView } from './components/financial/BalanceSheetView';
import { CashFlowStatementView } from './components/financial/CashFlowStatementView';
import { FinancialAnalysisView } from './components/financial/FinancialAnalysisView';

import { SalesReportsView } from './components/operational/SalesReportsView';
import { PurchaseReportsView } from './components/operational/PurchaseReportsView';
import { InventoryReportsView } from './components/operational/InventoryReportsView';
import { HrReportsView } from './components/operational/HrReportsView';
import { ProjectReportsView } from './components/operational/ProjectReportsView';

import { ProfitabilityAnalysisView } from './components/analytics/ProfitabilityAnalysisView';
import { CostAnalysisView } from './components/analytics/CostAnalysisView';
import { CustomerAnalyticsView } from './components/analytics/CustomerAnalyticsView';
import { SupplierAnalyticsView } from './components/analytics/SupplierAnalyticsView';

import { BudgetVsActualView } from './components/variance-aging/BudgetVsActualView';
import { CustomerAgingView } from './components/variance-aging/CustomerAgingView';
import { SupplierAgingView } from './components/variance-aging/SupplierAgingView';
import { VarianceAnalysisView } from './components/variance-aging/VarianceAnalysisView';

import { ReportBuilderView } from './components/builder/ReportBuilderView';
import { ScheduledReportsView } from './components/builder/ScheduledReportsView';

import {
  BarChart3,
  LayoutDashboard,
  Target,
  TrendingUp,
  Layers,
  PieChart,
  Clock,
  FileCode,
  Sparkles,
  Star,
  ArrowLeft
} from 'lucide-react';

interface BusinessIntelligenceModuleRunnerProps {
  module: ERPModule;
  functionalArea?: ERPFunctionalArea;
  process?: ERPProcess;
  transaction?: ERPTransaction;
  onNavigate: (route: ERPRouteState) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  activeRole: ERPUserRole;
}

export const BusinessIntelligenceModuleRunner: React.FC<BusinessIntelligenceModuleRunnerProps> = ({
  module,
  functionalArea,
  process,
  transaction,
  onNavigate,
  isFavorite,
  onToggleFavorite,
  activeRole
}) => {
  const [activeTab, setActiveTab] = useState<string>(
    functionalArea?.id || 'management-dashboards'
  );

  const handleSubNavigate = (faId: string, procId?: string, txId?: string) => {
    if (txId && procId) {
      onNavigate({
        view: 'transaction',
        moduleId: 'business-intelligence',
        functionalAreaId: faId,
        processId: procId,
        transactionId: txId
      });
    } else if (procId) {
      onNavigate({
        view: 'process',
        moduleId: 'business-intelligence',
        functionalAreaId: faId,
        processId: procId
      });
    } else {
      onNavigate({
        view: 'functional_area',
        moduleId: 'business-intelligence',
        functionalAreaId: faId
      });
    }
  };

  // Resolve current active component
  const renderCurrentView = () => {
    const targetFaId = functionalArea?.id || activeTab;
    const targetTxId = transaction?.id;

    // 1. Dashboards
    if (targetFaId === 'management-dashboards') {
      if (targetTxId === 'tx-mgmt-dash') return <ManagementDashboardView />;
      if (targetTxId === 'tx-dept-dash') return <DepartmentDashboardView />;
      if (targetTxId === 'tx-ops-dash') return <OperationalDashboardView />;
      return <ExecutiveDashboardView />;
    }

    // 2. KPI Management
    if (targetFaId === 'kpi-management') {
      if (targetTxId === 'tx-kpi-targets') return <KpiTargetsView />;
      if (targetTxId === 'tx-kpi-monitoring') return <KpiMonitoringView />;
      if (targetTxId === 'tx-kpi-scorecards') return <KpiScorecardsView />;
      return <KpiDefinitionView />;
    }

    // 3. Financial Reporting
    if (targetFaId === 'financial-reporting') {
      if (targetTxId === 'tx-balance-sheet-rep') return <BalanceSheetView />;
      if (targetTxId === 'tx-cashflow-rep') return <CashFlowStatementView />;
      if (targetTxId === 'tx-fin-analysis') return <FinancialAnalysisView />;
      return <ProfitAndLossView />;
    }

    // 4. Operational Reporting
    if (targetFaId === 'operational-reporting') {
      if (targetTxId === 'tx-purchase-rep') return <PurchaseReportsView />;
      if (targetTxId === 'tx-inventory-rep') return <InventoryReportsView />;
      if (targetTxId === 'tx-hr-rep') return <HrReportsView />;
      if (targetTxId === 'tx-project-rep') return <ProjectReportsView />;
      return <SalesReportsView />;
    }

    // 5. Management Analysis
    if (targetFaId === 'management-analysis') {
      if (targetTxId === 'tx-cost-analysis') return <CostAnalysisView />;
      if (targetTxId === 'tx-customer-analytics') return <CustomerAnalyticsView />;
      if (targetTxId === 'tx-supplier-analytics') return <SupplierAnalyticsView />;
      return <ProfitabilityAnalysisView />;
    }

    // 6. Variance & Aging Analysis
    if (targetFaId === 'variance-aging-analysis') {
      if (targetTxId === 'tx-cust-aging-rep') return <CustomerAgingView />;
      if (targetTxId === 'tx-supp-aging-rep') return <SupplierAgingView />;
      if (targetTxId === 'tx-variance-analysis') return <VarianceAnalysisView />;
      return <BudgetVsActualView />;
    }

    // 7. Report Builder
    if (targetFaId === 'report-builder') {
      if (targetTxId === 'tx-sched-reports' || targetTxId === 'tx-export-distribution') {
        return <ScheduledReportsView />;
      }
      return <ReportBuilderView />;
    }

    return <ExecutiveDashboardView />;
  };

  const navTabs = [
    { id: 'management-dashboards', label: 'Executive Dashboards', icon: LayoutDashboard },
    { id: 'kpi-management', label: 'KPI Management', icon: Target },
    { id: 'financial-reporting', label: 'Financial Statements', icon: TrendingUp },
    { id: 'operational-reporting', label: 'Operational Reports', icon: Layers },
    { id: 'management-analysis', label: 'Management Analytics', icon: PieChart },
    { id: 'variance-aging-analysis', label: 'Variance & Aging', icon: Clock },
    { id: 'report-builder', label: 'Report Studio & Schedules', icon: FileCode }
  ];

  return (
    <BIProvider>
      <div className="space-y-6">
        {/* Module Header Strip */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded">
                    Module 02
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Analytics & Enterprise Intelligence</span>
                </div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{module.name}</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">{module.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onToggleFavorite}
                className={`p-2 rounded-xl border transition-colors ${
                  isFavorite
                    ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-400'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>

          {/* Quick Sub-module Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 border-t border-slate-100 dark:border-slate-800 pt-4">
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isSelected = (functionalArea?.id || activeTab) === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    handleSubNavigate(tab.id);
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Render Active Sub-View */}
        {renderCurrentView()}
      </div>
    </BIProvider>
  );
};

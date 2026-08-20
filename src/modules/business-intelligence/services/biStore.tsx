import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  GlobalBiFilter,
  DashboardDefinition,
  DashboardWidget,
  KPIDefinition,
  KPITarget,
  KPIScorecard,
  ProfitAndLossLineItem,
  BalanceSheetCategory,
  CashFlowActivity,
  FinancialRatio,
  SalesReportRecord,
  PurchaseReportRecord,
  InventoryReportRecord,
  HrReportRecord,
  ProjectReportRecord,
  ProfitabilityAnalysisItem,
  CostAnalysisItem,
  CustomerAnalyticsRecord,
  SupplierAnalyticsRecord,
  BudgetVsActualLine,
  AgingBucketSchedule,
  DeepVarianceFactor,
  ReportDefinition,
  ScheduledReportConfig,
  AIInsight,
  AIExplainabilityTrace,
  CurrencyCode
} from '../types';

import {
  MOCK_EXECUTIVE_METRICS,
  MOCK_MONTHLY_FINANCIAL_TRENDS,
  MOCK_REVENUE_BY_BRANCH,
  MOCK_EXPENSES_BY_DEPARTMENT,
  MOCK_PROFIT_AND_LOSS,
  MOCK_BALANCE_SHEET,
  MOCK_CASH_FLOW_STATEMENT,
  MOCK_FINANCIAL_RATIOS,
  MOCK_SALES_RECORDS,
  MOCK_PURCHASE_RECORDS,
  MOCK_INVENTORY_RECORDS,
  MOCK_HR_RECORDS,
  MOCK_PROJECT_RECORDS,
  MOCK_PROFITABILITY_ANALYSIS,
  MOCK_COST_ANALYSIS,
  MOCK_CUSTOMER_ANALYTICS,
  MOCK_SUPPLIER_ANALYTICS,
  MOCK_BUDGET_VS_ACTUAL,
  MOCK_CUSTOMER_AGING,
  MOCK_SUPPLIER_AGING,
  MOCK_DEEP_VARIANCE_FACTORS,
  MOCK_KPI_DEFINITIONS,
  MOCK_KPI_TARGETS,
  MOCK_KPI_SCORECARDS,
  MOCK_REPORT_DEFINITIONS,
  MOCK_SCHEDULED_REPORTS,
  MOCK_AI_INSIGHTS
} from '../data-sources/mockDataProviders';

// Currency exchange multiplier from OMR base
const CURRENCY_RATES: Record<CurrencyCode, { symbol: string; rate: number }> = {
  OMR: { symbol: 'OMR', rate: 1.0 },
  USD: { symbol: '$', rate: 2.60 },
  AED: { symbol: 'AED', rate: 9.54 },
  SAR: { symbol: 'SAR', rate: 9.75 },
  EUR: { symbol: '€', rate: 2.38 },
  GBP: { symbol: '£', rate: 2.06 }
};

interface BIContextType {
  // Global Filters
  filters: GlobalBiFilter;
  setFilters: React.Dispatch<React.SetStateAction<GlobalBiFilter>>;
  formatCurrency: (amountInOMR: number) => string;
  currencySymbol: string;

  // Executive Data
  executiveMetrics: typeof MOCK_EXECUTIVE_METRICS;
  monthlyTrends: typeof MOCK_MONTHLY_FINANCIAL_TRENDS;
  revenueByBranch: typeof MOCK_REVENUE_BY_BRANCH;
  expensesByDept: typeof MOCK_EXPENSES_BY_DEPARTMENT;

  // Financial
  pnlData: ProfitAndLossLineItem[];
  balanceSheetData: BalanceSheetCategory[];
  cashFlowData: CashFlowActivity[];
  financialRatios: FinancialRatio[];

  // Operational
  salesData: SalesReportRecord[];
  purchaseData: PurchaseReportRecord[];
  inventoryData: InventoryReportRecord[];
  hrData: HrReportRecord[];
  projectData: ProjectReportRecord[];

  // Management Analysis
  profitabilityData: ProfitabilityAnalysisItem[];
  costData: CostAnalysisItem[];
  customerAnalytics: CustomerAnalyticsRecord[];
  supplierAnalytics: SupplierAnalyticsRecord[];

  // Variance & Aging
  budgetVsActual: BudgetVsActualLine[];
  customerAging: AgingBucketSchedule[];
  supplierAging: AgingBucketSchedule[];
  deepVarianceFactors: DeepVarianceFactor[];

  // KPIs
  kpis: KPIDefinition[];
  kpiTargets: KPITarget[];
  kpiScorecards: KPIScorecard[];
  addKpi: (kpi: KPIDefinition) => void;
  updateKpi: (kpi: KPIDefinition) => void;
  deleteKpi: (id: string) => void;
  addKpiTarget: (target: KPITarget) => void;

  // Custom Reports & Schedules
  reports: ReportDefinition[];
  scheduledReports: ScheduledReportConfig[];
  addReport: (report: ReportDefinition) => void;
  updateReport: (report: ReportDefinition) => void;
  deleteReport: (id: string) => void;
  toggleFavoriteReport: (id: string) => void;
  addScheduledReport: (config: ScheduledReportConfig) => void;
  toggleScheduleStatus: (id: string) => void;

  // AI Insights & Explainability
  aiInsights: AIInsight[];
  selectedExplainabilityTrace: AIExplainabilityTrace | null;
  inspectExplainability: (insight: AIInsight) => void;
  closeExplainability: () => void;

  // Management Dashboard Customizer
  managementWidgets: DashboardWidget[];
  addWidgetToManagement: (widget: DashboardWidget) => void;
  removeWidgetFromManagement: (widgetId: string) => void;
  updateWidgetLayout: (widgetId: string, width: '1' | '2' | '3' | '4' | 'full') => void;
  resetManagementLayout: () => void;
}

const DEFAULT_FILTERS: GlobalBiFilter = {
  period: 'this_year',
  companyId: 'comp-all',
  branchId: 'all',
  departmentId: 'all',
  currency: 'OMR',
  comparisonPeriod: 'previous_period'
};

const DEFAULT_MANAGEMENT_WIDGETS: DashboardWidget[] = [
  {
    id: 'w-rev-trend',
    title: 'Monthly Revenue vs OPEX Trend',
    description: 'Rolling 8-month revenue and operating expenditures comparison (OMR)',
    type: 'line_chart',
    dataSourceId: 'ds-financial-gl',
    width: '3',
    height: 'md',
    config: { chartColor: '#4f46e5', showLegend: true, showGrid: true }
  },
  {
    id: 'w-ebitda-gauge',
    title: 'EBITDA Margin Target Health',
    description: 'Current YTD 16.99% against 15.0% strategic corporate hurdle',
    type: 'progress_gauge',
    dataSourceId: 'ds-financial-gl',
    width: '1',
    height: 'md',
    config: { targetValue: 15.0, thresholdWarning: 12.0, prefix: '', suffix: '%' }
  },
  {
    id: 'w-branch-rev',
    title: 'Operating Revenue by Regional Branch',
    description: 'Muscat HQ, Sohar Freezone, Salalah Port, and Nizwa Distribution',
    type: 'bar_chart',
    dataSourceId: 'ds-sales-invoices',
    width: '2',
    height: 'md',
    config: { chartColor: '#0ea5e9' }
  },
  {
    id: 'w-aging-summary',
    title: 'Receivables & Payables Aging Exposure',
    description: 'Accounts Receivable vs Accounts Payable aging across 30, 60, 90 days',
    type: 'aging_bar',
    dataSourceId: 'ds-financial-gl',
    width: '2',
    height: 'md',
    config: {}
  },
  {
    id: 'w-top-customers',
    title: 'Top Strategic Accounts by Revenue',
    description: 'Leading client contributors and gross margin percentages',
    type: 'ranking_list',
    dataSourceId: 'ds-sales-invoices',
    width: '2',
    height: 'md',
    config: { limit: 5 }
  },
  {
    id: 'w-ai-radar',
    title: 'AI Anomaly & Variance Radar',
    description: 'Automated executive alerts on gross margin and material cost variances',
    type: 'alert_feed',
    dataSourceId: 'ds-financial-gl',
    width: '2',
    height: 'md',
    config: {}
  }
];

const BIContext = createContext<BIContextType | undefined>(undefined);

export const BIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<GlobalBiFilter>(DEFAULT_FILTERS);
  const [kpis, setKpis] = useState<KPIDefinition[]>(MOCK_KPI_DEFINITIONS);
  const [kpiTargets, setKpiTargets] = useState<KPITarget[]>(MOCK_KPI_TARGETS);
  const [kpiScorecards, setKpiScorecards] = useState<KPIScorecard[]>(MOCK_KPI_SCORECARDS);
  const [reports, setReports] = useState<ReportDefinition[]>(MOCK_REPORT_DEFINITIONS);
  const [scheduledReports, setScheduledReports] = useState<ScheduledReportConfig[]>(MOCK_SCHEDULED_REPORTS);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>(MOCK_AI_INSIGHTS);
  const [managementWidgets, setManagementWidgets] = useState<DashboardWidget[]>(DEFAULT_MANAGEMENT_WIDGETS);
  const [selectedExplainabilityTrace, setSelectedExplainabilityTrace] = useState<AIExplainabilityTrace | null>(null);

  const formatCurrency = (amountInOMR: number): string => {
    const rateInfo = CURRENCY_RATES[filters.currency] || CURRENCY_RATES.OMR;
    const converted = amountInOMR * rateInfo.rate;
    return `${rateInfo.symbol} ${converted.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  };

  const currencySymbol = CURRENCY_RATES[filters.currency]?.symbol || 'OMR';

  // KPI Actions
  const addKpi = (newKpi: KPIDefinition) => {
    setKpis(prev => [newKpi, ...prev]);
  };

  const updateKpi = (updatedKpi: KPIDefinition) => {
    setKpis(prev => prev.map(k => (k.id === updatedKpi.id ? updatedKpi : k)));
  };

  const deleteKpi = (id: string) => {
    setKpis(prev => prev.filter(k => k.id !== id));
  };

  const addKpiTarget = (newTarget: KPITarget) => {
    setKpiTargets(prev => [newTarget, ...prev]);
  };

  // Report Actions
  const addReport = (newRep: ReportDefinition) => {
    setReports(prev => [newRep, ...prev]);
  };

  const updateReport = (updatedRep: ReportDefinition) => {
    setReports(prev => prev.map(r => (r.id === updatedRep.id ? updatedRep : r)));
  };

  const deleteReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
  };

  const toggleFavoriteReport = (id: string) => {
    setReports(prev =>
      prev.map(r => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r))
    );
  };

  const addScheduledReport = (config: ScheduledReportConfig) => {
    setScheduledReports(prev => [config, ...prev]);
  };

  const toggleScheduleStatus = (id: string) => {
    setScheduledReports(prev =>
      prev.map(s =>
        s.id === id ? { ...s, status: s.status === 'Active' ? 'Paused' : 'Active' } : s
      )
    );
  };

  // Explainability inspection
  const inspectExplainability = (insight: AIInsight) => {
    const trace: AIExplainabilityTrace = {
      insightId: insight.id,
      dataSourcesQueried: [insight.dataSourceRef, 'ds-financial-gl'],
      appliedFilters: [
        { field: 'Fiscal Year', value: '2026' },
        { field: 'Reporting Currency', value: filters.currency },
        { field: 'Branch Scope', value: filters.branchId || 'All Entities' }
      ],
      aggregationFormula: 'SUM(Revenue) - SUM(COGS) / SUM(Revenue) * 100 with variance deviation >= 2.0%',
      computationTimeMs: 42,
      sourceRecordCount: 14200,
      userRoleContext: 'Enterprise Executive / BI Administrator',
      securityRestrictionsChecked: true
    };
    setSelectedExplainabilityTrace(trace);
  };

  const closeExplainability = () => {
    setSelectedExplainabilityTrace(null);
  };

  // Management Dashboard Customizer
  const addWidgetToManagement = (widget: DashboardWidget) => {
    setManagementWidgets(prev => [...prev, widget]);
  };

  const removeWidgetFromManagement = (widgetId: string) => {
    setManagementWidgets(prev => prev.filter(w => w.id !== widgetId));
  };

  const updateWidgetLayout = (widgetId: string, width: '1' | '2' | '3' | '4' | 'full') => {
    setManagementWidgets(prev =>
      prev.map(w => (w.id === widgetId ? { ...w, width } : w))
    );
  };

  const resetManagementLayout = () => {
    setManagementWidgets(DEFAULT_MANAGEMENT_WIDGETS);
  };

  return (
    <BIContext.Provider
      value={{
        filters,
        setFilters,
        formatCurrency,
        currencySymbol,

        executiveMetrics: MOCK_EXECUTIVE_METRICS,
        monthlyTrends: MOCK_MONTHLY_FINANCIAL_TRENDS,
        revenueByBranch: MOCK_REVENUE_BY_BRANCH,
        expensesByDept: MOCK_EXPENSES_BY_DEPARTMENT,

        pnlData: MOCK_PROFIT_AND_LOSS,
        balanceSheetData: MOCK_BALANCE_SHEET,
        cashFlowData: MOCK_CASH_FLOW_STATEMENT,
        financialRatios: MOCK_FINANCIAL_RATIOS,

        salesData: MOCK_SALES_RECORDS,
        purchaseData: MOCK_PURCHASE_RECORDS,
        inventoryData: MOCK_INVENTORY_RECORDS,
        hrData: MOCK_HR_RECORDS,
        projectData: MOCK_PROJECT_RECORDS,

        profitabilityData: MOCK_PROFITABILITY_ANALYSIS,
        costData: MOCK_COST_ANALYSIS,
        customerAnalytics: MOCK_CUSTOMER_ANALYTICS,
        supplierAnalytics: MOCK_SUPPLIER_ANALYTICS,

        budgetVsActual: MOCK_BUDGET_VS_ACTUAL,
        customerAging: MOCK_CUSTOMER_AGING,
        supplierAging: MOCK_SUPPLIER_AGING,
        deepVarianceFactors: MOCK_DEEP_VARIANCE_FACTORS,

        kpis,
        kpiTargets,
        kpiScorecards,
        addKpi,
        updateKpi,
        deleteKpi,
        addKpiTarget,

        reports,
        scheduledReports,
        addReport,
        updateReport,
        deleteReport,
        toggleFavoriteReport,
        addScheduledReport,
        toggleScheduleStatus,

        aiInsights,
        selectedExplainabilityTrace,
        inspectExplainability,
        closeExplainability,

        managementWidgets,
        addWidgetToManagement,
        removeWidgetFromManagement,
        updateWidgetLayout,
        resetManagementLayout
      }}
    >
      {children}
    </BIContext.Provider>
  );
};

export const useBI = (): BIContextType => {
  const context = useContext(BIContext);
  if (!context) {
    throw new Error('useBI must be used within a BIProvider');
  }
  return context;
};

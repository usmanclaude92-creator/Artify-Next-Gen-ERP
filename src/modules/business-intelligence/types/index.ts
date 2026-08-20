export type PeriodFilter =
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'this_month'
  | 'last_month'
  | 'this_quarter'
  | 'last_quarter'
  | 'this_year'
  | 'last_year'
  | 'custom';

export type CurrencyCode = 'OMR' | 'USD' | 'AED' | 'SAR' | 'EUR' | 'GBP';

export type KPIDirection = 'higher_is_better' | 'lower_is_better' | 'within_range';
export type KPICategory = 'Financial' | 'Customer' | 'Operational' | 'People' | 'Quality' | 'Growth';
export type KPIFrequency = 'Realtime' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';

export interface GlobalBiFilter {
  period: PeriodFilter;
  customStartDate?: string;
  customEndDate?: string;
  companyId: string;
  branchId?: string;
  departmentId?: string;
  currency: CurrencyCode;
  businessUnitId?: string;
  comparisonPeriod?: 'previous_period' | 'previous_year' | 'budget' | 'none';
}

// ----------------------------------------------------
// Dashboard & Widgets
// ----------------------------------------------------

export type WidgetType =
  | 'kpi_card'
  | 'metric_number'
  | 'line_chart'
  | 'bar_chart'
  | 'area_chart'
  | 'pie_chart'
  | 'donut_chart'
  | 'data_table'
  | 'trend_indicator'
  | 'progress_gauge'
  | 'ranking_list'
  | 'aging_bar'
  | 'variance_bar'
  | 'alert_feed';

export interface DashboardWidget {
  id: string;
  title: string;
  description?: string;
  type: WidgetType;
  dataSourceId: string;
  width: '1' | '2' | '3' | '4' | 'full'; // grid column span
  height?: 'sm' | 'md' | 'lg' | 'xl';
  refreshIntervalSeconds?: number;
  config: {
    metrics?: string[];
    dimensions?: string[];
    chartColor?: string;
    showLegend?: boolean;
    showGrid?: boolean;
    prefix?: string;
    suffix?: string;
    targetValue?: number;
    thresholdWarning?: number;
    thresholdDanger?: number;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    drillDownTarget?: string;
  };
  customData?: any;
}

export interface DashboardDefinition {
  id: string;
  code: string;
  name: string;
  category: 'Executive' | 'Management' | 'Department' | 'Operational' | 'Custom';
  description: string;
  ownerDepartment?: string;
  isFavorite?: boolean;
  isDefault?: boolean;
  widgets: DashboardWidget[];
  layoutGrid?: { widgetId: string; x: number; y: number; w: number; h: number }[];
  lastModified?: string;
}

// ----------------------------------------------------
// KPI Management
// ----------------------------------------------------

export interface KPIDefinition {
  id: string;
  code: string;
  name: string;
  description: string;
  category: KPICategory;
  module: string;
  department: string;
  company: string;
  calculationDefinition: string;
  unit: string;
  frequency: KPIFrequency;
  direction: KPIDirection;
  owner: string;
  status: 'Active' | 'Under Review' | 'Deprecated';
  currentValue: number;
  targetValue: number;
  minThreshold?: number;
  maxThreshold?: number;
  historicalTrend?: { date: string; value: number; target: number }[];
}

export interface KPITarget {
  id: string;
  kpiId: string;
  kpiCode: string;
  kpiName: string;
  companyId: string;
  companyName: string;
  branchId?: string;
  branchName?: string;
  departmentId?: string;
  departmentName?: string;
  period: string;
  baselineTarget: number;
  stretchTarget: number;
  minThreshold: number;
  maxThreshold: number;
  effectiveDate: string;
  expiryDate: string;
  status: 'Draft' | 'Approved' | 'Active' | 'Archived';
}

export interface KPIScorecard {
  id: string;
  code: string;
  title: string;
  perspective: 'Financial' | 'Customer' | 'Internal Business Processes' | 'Learning & Growth';
  department: string;
  period: string;
  owner: string;
  weightPercent: number;
  score: number; // 0-100
  status: 'Exceeding' | 'On Track' | 'Needs Attention' | 'Critical';
  kpis: {
    kpiId: string;
    kpiName: string;
    weight: number; // weight within scorecard
    target: number;
    actual: number;
    unit: string;
    achievementPercent: number;
    weightedScore: number;
    status: 'Exceeding' | 'On Track' | 'Warning' | 'Critical';
  }[];
}

// ----------------------------------------------------
// Financial Reporting
// ----------------------------------------------------

export interface ProfitAndLossLineItem {
  id: string;
  code: string;
  accountGroup: 'Revenue' | 'Cost of Goods Sold' | 'Gross Profit' | 'Operating Expenses' | 'Operating Profit' | 'Other Income & Expense' | 'Net Profit';
  name: string;
  currentActualOMR: number;
  priorActualOMR: number;
  budgetOMR: number;
  varianceOMR: number;
  variancePercent: number;
  status: 'Favorable' | 'Unfavorable' | 'Neutral';
  children?: ProfitAndLossLineItem[];
  depth: number;
}

export interface BalanceSheetCategory {
  category: 'Current Assets' | 'Non-Current Assets' | 'Current Liabilities' | 'Non-Current Liabilities' | 'Equity';
  totalCurrentOMR: number;
  totalPriorOMR: number;
  items: {
    code: string;
    name: string;
    currentOMR: number;
    priorOMR: number;
    changePercent: number;
  }[];
}

export interface CashFlowActivity {
  section: 'Operating Activities' | 'Investing Activities' | 'Financing Activities';
  totalOMR: number;
  items: {
    name: string;
    amountOMR: number;
    type: 'Inflow' | 'Outflow';
  }[];
}

export interface FinancialRatio {
  category: 'Liquidity' | 'Profitability' | 'Efficiency' | 'Solvency' | 'Valuation';
  name: string;
  formula: string;
  value: number;
  unit: string;
  benchmark: number;
  status: 'Optimal' | 'Acceptable' | 'Caution' | 'Adverse';
  trend: 'Up' | 'Down' | 'Stable';
  commentary: string;
}

// ----------------------------------------------------
// Operational Reporting
// ----------------------------------------------------

export interface SalesReportRecord {
  id: string;
  period: string;
  customerCode: string;
  customerName: string;
  category: string;
  branchName: string;
  salesRep: string;
  revenueOMR: number;
  cogsOMR: number;
  grossMarginPercent: number;
  orderCount: number;
  volumeUnits: number;
}

export interface PurchaseReportRecord {
  id: string;
  period: string;
  supplierCode: string;
  supplierName: string;
  category: string;
  spendOMR: number;
  poCount: number;
  leadTimeDaysAvg: number;
  otifPercent: number; // On-Time In-Full
  priceVariancePercent: number;
}

export interface InventoryReportRecord {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  warehouse: string;
  quantityOnHand: number;
  unitCostOMR: number;
  totalValuationOMR: number;
  stockTurnoverRatio: number;
  daysOfInventoryRemaining: number;
  reorderPoint: number;
  safetyStock: number;
  status: 'Healthy' | 'Low Stock' | 'Critical Stockout' | 'Excess/Aging';
}

export interface HrReportRecord {
  id: string;
  department: string;
  headcount: number;
  joinersYtd: number;
  leaversYtd: number;
  turnoverRatePercent: number;
  avgTenureYears: number;
  attendanceRatePercent: number;
  overtimeHoursTotal: number;
  trainingHoursAvg: number;
  recruitmentOpenPositions: number;
}

export interface ProjectReportRecord {
  id: string;
  projectCode: string;
  projectName: string;
  clientName: string;
  projectManager: string;
  contractValueOMR: number;
  costBudgetOMR: number;
  actualCostOMR: number;
  revenueRecognizedOMR: number;
  progressPercent: number;
  earnedValueOMR: number;
  cpi: number; // Cost Performance Index (>1 good)
  spi: number; // Schedule Performance Index (>1 good)
  marginPercent: number;
  health: 'Green' | 'Amber' | 'Red';
}

// ----------------------------------------------------
// Management Analysis
// ----------------------------------------------------

export interface ProfitabilityAnalysisItem {
  id: string;
  dimension: string; // e.g. "Commercial Office Furniture", "Muscat Central Branch", "Apex Holding"
  dimensionType: 'Product' | 'Branch' | 'Customer' | 'Project' | 'Sales Channel';
  revenueOMR: number;
  directCostOMR: number;
  grossProfitOMR: number;
  grossMarginPercent: number;
  operatingOverheadOMR: number;
  netProfitOMR: number;
  netMarginPercent: number;
  rank: number;
}

export interface CostAnalysisItem {
  costCenterCode: string;
  costCenterName: string;
  department: string;
  category: 'Direct Material' | 'Direct Labor' | 'Manufacturing Overhead' | 'Selling & Marketing' | 'Administrative' | 'Technology';
  budgetedAmountOMR: number;
  actualSpendOMR: number;
  absorbedCostOMR: number;
  underOverAbsorptionOMR: number;
  varianceOMR: number;
  status: 'Within Budget' | 'Warning Deviation' | 'Severe Breach';
}

export interface CustomerAnalyticsRecord {
  customerCode: string;
  customerName: string;
  tier: 'Tier 1 Strategic' | 'Tier 2 Enterprise' | 'Tier 3 Commercial' | 'Tier 4 Retail';
  lifetimeValueOMR: number;
  ytdRevenueOMR: number;
  ytdGrossMarginPercent: number;
  currentReceivablesOMR: number;
  daysSalesOutstanding: number;
  ordersYtd: number;
  churnRisk: 'Low' | 'Medium' | 'High';
  concentrationPercent: number;
}

export interface SupplierAnalyticsRecord {
  supplierCode: string;
  supplierName: string;
  category: string;
  ytdSpendOMR: number;
  spendConcentrationPercent: number;
  onTimeDeliveryRate: number;
  qualityDefectRatePpm: number;
  outstandingPayablesOMR: number;
  paymentTermDays: number;
  riskRating: 'Low' | 'Medium' | 'High';
  contractRenewalDate: string;
}

// ----------------------------------------------------
// Variance & Aging Analysis
// ----------------------------------------------------

export interface BudgetVsActualLine {
  id: string;
  accountOrDept: string;
  category: 'Revenue' | 'Direct Cost' | 'Operating Overhead' | 'Capital Expenditure';
  annualBudgetOMR: number;
  ytdBudgetOMR: number;
  ytdActualOMR: number;
  varianceOMR: number;
  variancePercent: number;
  status: 'Favorable' | 'Unfavorable' | 'On Target';
  explanation?: string;
  trend: 'Improving' | 'Deteriorating' | 'Stable';
}

export interface AgingBucketSchedule {
  entityCode: string;
  entityName: string;
  category: string;
  totalOutstandingOMR: number;
  currentNotDueOMR: number;
  days1To30OMR: number;
  days31To60OMR: number;
  days61To90OMR: number;
  days91To120OMR: number;
  daysOver120OMR: number;
  disputedAmountOMR: number;
  creditLimitOMR?: number;
  lastPaymentDate?: string;
}

export interface DeepVarianceFactor {
  parameter: string;
  standardBenchmark: string;
  actualResult: string;
  varianceEffectOMR: number;
  varianceType: 'Sales Volume' | 'Selling Price' | 'Purchase Price' | 'Labor Efficiency' | 'Overhead Spending';
  impact: 'Favorable' | 'Unfavorable';
  recommendation: string;
}

// ----------------------------------------------------
// Report Builder & Data Source Registry
// ----------------------------------------------------

export type FieldDataType = 'string' | 'number' | 'currency' | 'percent' | 'date' | 'boolean';

export interface DataField {
  id: string;
  name: string;
  label: string;
  dataType: FieldDataType;
  type: 'dimension' | 'measure' | 'calculated';
  description?: string;
  formula?: string; // e.g. "[Revenue] - [COGS]"
  aggregationType?: 'sum' | 'avg' | 'count' | 'min' | 'max';
}

export interface DataSource {
  id: string;
  code: string;
  name: string;
  domain: 'Financial' | 'Sales' | 'Procurement' | 'Inventory' | 'Projects' | 'HR' | 'Budgeting';
  description: string;
  status: 'Available (Demo Data)' | 'Live Data' | 'Coming in Future Phase';
  isLive: boolean;
  fields: DataField[];
  sampleRecordCount: number;
}

export type FilterOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'starts_with'
  | 'greater_than'
  | 'less_than'
  | 'between'
  | 'in_list'
  | 'date_range';

export interface ReportFilter {
  id: string;
  fieldId: string;
  operator: FilterOperator;
  value: any;
  valueSecondary?: any; // For between
}

export interface ReportSort {
  fieldId: string;
  direction: 'asc' | 'desc';
}

export interface CalculatedField {
  id: string;
  name: string;
  label: string;
  expression: string; // e.g. "([Revenue] - [Cost]) / [Revenue] * 100"
  outputType: 'currency' | 'percent' | 'number';
}

export interface ReportDefinition {
  id: string;
  code: string;
  title: string;
  description: string;
  dataSourceId: string;
  category: string;
  selectedFields: string[]; // field ids
  filters: ReportFilter[];
  groupByFields: string[];
  sorts: ReportSort[];
  calculatedFields: CalculatedField[];
  visualization: 'table' | 'bar_chart' | 'line_chart' | 'area_chart' | 'pie_chart' | 'kpi_card' | 'ranking';
  chartConfig?: {
    xAxisField?: string;
    yAxisFields?: string[];
    colorPalette?: string;
  };
  isScheduled?: boolean;
  isFavorite?: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduledReportConfig {
  id: string;
  reportId: string;
  reportTitle: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Custom';
  deliveryTime: string;
  format: 'PDF' | 'Excel' | 'CSV';
  recipients: string[];
  deliveryMethod: 'Email' | 'In-App Alert' | 'SFTP' | 'Secure Portal';
  startDate: string;
  endDate?: string;
  lastRunAt?: string;
  nextRunAt: string;
  status: 'Active' | 'Paused' | 'Failed' | 'Draft';
  lastRunResult?: 'Success' | 'Partial' | 'Failed';
}

export interface ExportDistributionJob {
  id: string;
  reportTitle: string;
  format: 'PDF' | 'Excel' | 'CSV' | 'JSON';
  requestedBy: string;
  requestedAt: string;
  fileSizeBytes: number;
  status: 'Ready' | 'Processing' | 'Completed' | 'Failed';
  downloadUrl?: string;
}

// ----------------------------------------------------
// AI Insights & Query
// ----------------------------------------------------

export interface AIInsight {
  id: string;
  title: string;
  summary: string;
  category: 'Revenue Growth' | 'Cost Anomaly' | 'Margin Risk' | 'Aging Warning' | 'Inventory Alert' | 'Operational Excellence';
  severity: 'info' | 'positive' | 'warning' | 'critical';
  confidenceScore: number; // e.g. 0.94
  timestamp: string;
  dataSourceRef: string;
  periodRef: string;
  supportingMetrics: { label: string; value: string; variance?: string }[];
  actionableRecommendation: string;
  isGeneratedFromDemoData: boolean;
}

export interface AIExplainabilityTrace {
  insightId: string;
  dataSourcesQueried: string[];
  appliedFilters: { field: string; value: string }[];
  aggregationFormula: string;
  computationTimeMs: number;
  sourceRecordCount: number;
  userRoleContext: string;
  securityRestrictionsChecked: boolean;
}

export interface NaturalLanguageReportQuery {
  id: string;
  userPrompt: string;
  parsedDataSourceId: string;
  parsedDimensions: string[];
  parsedMeasures: string[];
  parsedFilters: { field: string; value: string; operator: string }[];
  parsedTimeframe: string;
  parsedVisualization: 'table' | 'bar_chart' | 'line_chart' | 'pie_chart';
  status: 'parsed' | 'executing' | 'ready';
}

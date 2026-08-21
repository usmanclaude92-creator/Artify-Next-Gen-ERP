// ==========================================
// ARTIFY ERP — MODULE 11: BUDGETING & FINANCIAL PLANNING
// TypeScript Domain Definitions
// ==========================================

export type BudgetStatus = 'Draft' | 'In Review' | 'Submitted' | 'Approved' | 'Active' | 'Locked' | 'Revised' | 'Archived' | 'Rejected';

export type FiscalPeriod = 'Annual' | 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Monthly';

export type BudgetType = 'Operating (OPEX)' | 'Capital (CAPEX)' | 'Revenue' | 'Cash Flow' | 'Project' | 'Department' | 'Cost Center' | 'Financing';

export type RestrictionMode = 'Hard Block' | 'Soft Warning' | 'Manager Override' | 'Advisory Only';

export type VarianceNature = 'Favorable' | 'Unfavorable' | 'Neutral';

export interface BudgetLineItem {
  id: string;
  budgetId: string;
  accountCode: string;
  accountName: string;
  category: string;
  subCategory?: string;
  costCenterId: string;
  costCenterCode: string;
  costCenterName: string;
  departmentId: string;
  departmentName: string;
  annualBudget: number;
  q1Amount: number;
  q2Amount: number;
  q3Amount: number;
  q4Amount: number;
  monthlyDistribution?: number[]; // 12 months
  committedAmount: number; // Encumbrances (open POs, PRs)
  actualSpent: number; // Posted GL expenses
  tolerancePercent: number; // e.g., 5%
  notes?: string;
}

export interface BudgetMaster {
  id: string;
  budgetCode: string;
  budgetName: string;
  fiscalYear: number;
  version: string; // e.g. "V1.0 - Board Baseline", "V1.1 - Mid-Year Revision"
  type: BudgetType;
  entityId: string;
  entityName: string;
  currency: string; // OMR, USD, EUR
  totalAllocated: number;
  totalCommitted: number;
  totalActual: number;
  status: BudgetStatus;
  preparedBy: string;
  approvedBy?: string;
  approvalDate?: string;
  effectiveStartDate: string;
  effectiveEndDate: string;
  description: string;
  lineItemsCount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentBudgetSummary {
  departmentId: string;
  departmentName: string;
  headOfDepartment: string;
  headcount: number;
  allocatedBudget: number;
  committedBudget: number;
  actualSpent: number;
  availableBalance: number;
  burnRatePercent: number;
  status: BudgetStatus;
  costCenterCodes: string[];
}

export interface ProjectBudgetSummary {
  projectId: string;
  projectCode: string;
  projectName: string;
  projectManager: string;
  totalContractValue: number;
  allocatedBudget: number;
  contingencyReserve: number;
  committedCost: number;
  actualIncurred: number;
  eacEstimatedAtCompletion: number;
  varianceAtCompletion: number;
  health: 'On Track' | 'At Risk' | 'Over Budget';
}

export interface CostCenterBudgetSummary {
  costCenterId: string;
  costCenterCode: string;
  costCenterName: string;
  departmentName: string;
  managerName: string;
  allocatedBudget: number;
  committedBudget: number;
  actualSpent: number;
  remainingBudget: number;
  utilizationPercent: number;
  restrictionMode: RestrictionMode;
  tolerancePercent: number;
}

export interface RevenueBudgetStream {
  id: string;
  streamCode: string;
  streamName: string;
  productFamily: string;
  territory: string;
  targetUnits: number;
  unitPrice: number;
  targetAnnualRevenue: number;
  actualYtdRevenue: number;
  forecastYearEnd: number;
  achievementPercent: number;
  q1Target: number;
  q2Target: number;
  q3Target: number;
  q4Target: number;
}

export interface CapexInvestmentProposal {
  id: string;
  proposalCode: string;
  assetTitle: string;
  category: 'Machinery & Equipment' | 'IT Infrastructure' | 'Fleet & Logistics' | 'Facilities & Real Estate' | 'R&D Technology';
  department: string;
  costCenterCode: string;
  estimatedCost: number;
  contingency: number;
  totalCapexRequired: number;
  economicUsefulLifeYears: number;
  salvageValue: number;
  depreciationMethod: 'Straight Line' | 'Accelerated MACRS' | 'Double Declining';
  estimatedAnnualSavingsOrRevenue: number;
  paybackPeriodYears: number;
  npvEstimated: number;
  irrPercent: number;
  priority: 'Critical' | 'Strategic' | 'Operational' | 'Discretionary';
  status: 'Draft' | 'Submitted' | 'Under Technical Review' | 'Approved' | 'Procurement Initiated' | 'Commissioned' | 'Rejected';
  justification: string;
  requestedBy: string;
  approvedBy?: string;
  dateRequested: string;
  expectedCommissionDate: string;
}

export interface CashFlowMonthlyProjection {
  monthIndex: number; // 1 to 12
  monthName: string;
  beginningCashBalance: number;
  operatingInflows: {
    customerArCollections: number;
    cashSales: number;
    otherOperationalIncome: number;
    totalOperatingInflows: number;
  };
  operatingOutflows: {
    vendorApPayments: number;
    payrollAndBenefits: number;
    utilitiesAndFacilities: number;
    statutoryTaxesAndVat: number;
    totalOperatingOutflows: number;
  };
  netOperatingCash: number;
  investingCashFlows: {
    capexOutflows: number;
    assetDisposals: number;
    totalInvesting: number;
  };
  financingCashFlows: {
    loanDrawdowns: number;
    principalDebtRepayments: number;
    interestExpensePayments: number;
    equityDividendDistributions: number;
    totalFinancing: number;
  };
  netMonthlyCashChange: number;
  endingCashBalance: number;
  minimumLiquidityBuffer: number;
  liquiditySurplusOrDeficit: number;
}

export interface FinancingDebtObligation {
  id: string;
  facilityCode: string;
  lenderOrInstitution: string;
  facilityType: 'Term Loan' | 'Revolving Working Capital' | 'Islamic Sukuk Facility' | 'Equipment Lease-Purchase' | 'Trade Finance LC';
  principalFacilityAmount: number;
  currentOutstandingBalance: number;
  interestRateOrProfitRate: number; // e.g. 5.75%
  rateType: 'Fixed' | 'Floating (SOFR/CBO+Spread)';
  maturityDate: string;
  annualDebtServicePrincipal: number;
  annualInterestService: number;
  quarterlyPaymentSchedule: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
  };
  covenantRequirements: string;
  currentDscr: number; // Debt Service Coverage Ratio
  complianceStatus: 'Fully Compliant' | 'Watchlist' | 'Breach Risk';
}

export interface BudgetReallocationTransfer {
  id: string;
  transferCode: string;
  fromCostCenter: string;
  fromAccountCode: string;
  fromAccountName: string;
  toCostCenter: string;
  toAccountCode: string;
  toAccountName: string;
  transferAmount: number;
  reason: string;
  impactAssessment: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected' | 'Executed';
  requestedBy: string;
  approvedBy?: string;
  requestDate: string;
  effectiveDate: string;
}

export interface BudgetApprovalStep {
  id: string;
  level: number;
  roleName: string;
  approverName: string;
  thresholdMaxAmount: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Skipped';
  timestamp?: string;
  comments?: string;
}

export interface BudgetApprovalWorkflowItem {
  id: string;
  workflowCode: string;
  budgetId: string;
  budgetName: string;
  fiscalYear: number;
  totalBudgetAmount: number;
  budgetType: BudgetType;
  submittedBy: string;
  submissionDate: string;
  currentLevel: number;
  totalLevels: number;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
  steps: BudgetApprovalStep[];
  priority: 'Normal' | 'Urgent' | 'Board Level';
}

export interface BudgetRestrictionRule {
  id: string;
  costCenterCode: string;
  costCenterName: string;
  accountCategory: string;
  controlMode: RestrictionMode;
  hardThresholdPercent: number; // e.g. 100%
  softWarningThresholdPercent: number; // e.g. 85%
  managerOverrideTolerancePercent: number; // e.g. 5%
  designatedApprover: string;
  isActive: boolean;
  notes: string;
}

export interface BudgetVsActualRow {
  id: string;
  accountCode: string;
  accountName: string;
  category: 'Revenue' | 'Cost of Goods Sold' | 'Operating Expenses (OPEX)' | 'Capital Expenditure (CAPEX)' | 'Financing Costs';
  costCenter: string;
  department: string;
  annualBudget: number;
  ytdBudget: number;
  ytdActual: number;
  ytdCommitted: number;
  ytdTotalUtilized: number;
  varianceAmount: number; // Budget - Actual
  variancePercent: number;
  nature: VarianceNature;
  eacForecastYearEnd: number;
  fullYearProjectedVariance: number;
}

export interface RollingForecastQuarter {
  quarterCode: string; // e.g. "Q1 2026 (Actual)", "Q2 2026 (Actual)", "Q3 2026 (Forecast)", "Q4 2026 (Forecast)", "Q1 2027 (Rolling)", "Q2 2027 (Rolling)"
  periodType: 'Actual' | 'Committed Forecast' | 'Rolling Outlook';
  projectedRevenue: number;
  projectedCogs: number;
  projectedGrossProfit: number;
  projectedOpex: number;
  projectedEbitda: number;
  projectedCapex: number;
  projectedNetCashFlow: number;
}

export interface VarianceDecomposition {
  id: string;
  accountName: string;
  totalVariance: number;
  priceRateVariance: number;
  volumeQuantityVariance: number;
  operationalEfficiencyVariance: number;
  timingPhasingVariance: number;
  rootCauseAnalysis: string;
  correctiveAction: string;
}

export interface ScenarioPlanModel {
  id: string;
  scenarioCode: string;
  scenarioName: string;
  description: string;
  parameters: {
    revenueGrowthPercent: number; // e.g. -15%
    cogsInflationPercent: number; // e.g. +8%
    opexAdjustmentPercent: number; // e.g. -5%
    capexSpendingFactor: number; // e.g. 0.8 (20% freeze)
    interestRateShiftBps: number; // e.g. +100 bps
    fxExchangeRateImpactPercent: number; // e.g. -3%
  };
  projectedRevenue: number;
  projectedGrossProfit: number;
  projectedOperatingExpenses: number;
  projectedEbitda: number;
  projectedNetIncome: number;
  projectedEndingCash: number;
  covenantComplianceRisk: 'Low' | 'Moderate' | 'Critical Stress';
  isBaseline: boolean;
}

export interface BudgetAuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: 'Created Budget' | 'Updated Allocation' | 'Approved Level' | 'Rejected Budget' | 'Reallocated Virement' | 'Modified Tolerance' | 'Executed Forecast Run' | 'Simulated Scenario';
  targetReference: string;
  details: string;
  ipAddress?: string;
}

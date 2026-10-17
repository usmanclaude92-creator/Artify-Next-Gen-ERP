// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 11: BUDGETING & FINANCIAL PLANNING
// Centralized React Context & State Store
// ==========================================

import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  BudgetMaster,
  BudgetLineItem,
  DepartmentBudgetSummary,
  ProjectBudgetSummary,
  CostCenterBudgetSummary,
  RevenueBudgetStream,
  CapexInvestmentProposal,
  CashFlowMonthlyProjection,
  FinancingDebtObligation,
  BudgetReallocationTransfer,
  BudgetApprovalWorkflowItem,
  BudgetRestrictionRule,
  BudgetVsActualRow,
  RollingForecastQuarter,
  VarianceDecomposition,
  ScenarioPlanModel,
  BudgetAuditLog,
  BudgetStatus,
  RestrictionMode
} from '../types';

interface BudgetStoreContextType {
  // Master Budgets
  budgets: BudgetMaster[];
  selectedBudget: BudgetMaster;
  selectBudget: (id: string) => void;
  createBudget: (budget: Omit<BudgetMaster, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBudgetStatus: (id: string, status: BudgetStatus) => void;

  // Line Items
  lineItems: BudgetLineItem[];
  addLineItem: (item: Omit<BudgetLineItem, 'id'>) => void;
  updateLineItem: (id: string, updates: Partial<BudgetLineItem>) => void;

  // Summaries
  departmentSummaries: DepartmentBudgetSummary[];
  projectSummaries: ProjectBudgetSummary[];
  costCenterSummaries: CostCenterBudgetSummary[];

  // Operating Budget
  revenueStreams: RevenueBudgetStream[];
  addRevenueStream: (stream: Omit<RevenueBudgetStream, 'id'>) => void;

  // Capital & Cash
  capexProposals: CapexInvestmentProposal[];
  addCapexProposal: (proposal: Omit<CapexInvestmentProposal, 'id'>) => void;
  updateCapexStatus: (id: string, status: CapexInvestmentProposal['status']) => void;
  cashFlowProjections: CashFlowMonthlyProjection[];
  updateCashFlowMonth: (monthIndex: number, updates: Partial<CashFlowMonthlyProjection>) => void;
  financingFacilities: FinancingDebtObligation[];

  // Budget Control
  reallocationTransfers: BudgetReallocationTransfer[];
  createReallocationTransfer: (transfer: Omit<BudgetReallocationTransfer, 'id' | 'status' | 'requestDate'>) => void;
  approveReallocationTransfer: (id: string, approver: string) => void;
  approvalWorkflows: BudgetApprovalWorkflowItem[];
  approveWorkflowStep: (workflowId: string, level: number, comments?: string) => void;
  rejectWorkflowStep: (workflowId: string, level: number, comments?: string) => void;
  restrictionRules: BudgetRestrictionRule[];
  updateRestrictionRule: (id: string, updates: Partial<BudgetRestrictionRule>) => void;
  
  // Real-time PO/PR Budget Checker Simulator
  simulateBudgetCheck: (params: { costCenterCode: string; accountCategory: string; proposedAmount: number }) => {
    allowed: boolean;
    ruleMode: RestrictionMode;
    availableBefore: number;
    availableAfter: number;
    utilizationAfterPercent: number;
    message: string;
    actionRequired: 'None' | 'CFO Approval Needed' | 'Blocked';
  };

  // Forecasting & Analysis
  budgetVsActual: BudgetVsActualRow[];
  rollingForecast: RollingForecastQuarter[];
  varianceDecompositions: VarianceDecomposition[];
  scenarios: ScenarioPlanModel[];
  activeScenarioId: string;
  setActiveScenarioId: (id: string) => void;
  updateScenarioParameters: (scenarioId: string, params: Partial<ScenarioPlanModel['parameters']>) => void;
  createScenario: (name: string, description: string, params: ScenarioPlanModel['parameters']) => void;

  // Audit
  auditLogs: BudgetAuditLog[];
  addAuditLog: (action: BudgetAuditLog['action'], target: string, details: string) => void;

  // Global Filter State
  selectedFiscalYear: number;
  setSelectedFiscalYear: (year: number) => void;
  currency: string;
  setCurrency: (c: string) => void;
}

const BudgetContext = createContext<BudgetStoreContextType | undefined>(undefined);

// Initial Master Budgets
const INITIAL_BUDGETS: BudgetMaster[] = [
  {
    id: 'b-2026-master',
    budgetCode: 'BM-2026-HQ',
    budgetName: 'FY2026 Corporate Master Budget (Baseline)',
    fiscalYear: 2026,
    version: 'V1.0 - Board Baseline',
    type: 'Operating (OPEX)',
    entityId: 'ent-artify-hq',
    entityName: 'Artify Heavy Industries LLC (Group)',
    currency: 'OMR',
    totalAllocated: 28400000,
    totalCommitted: 4850000,
    totalActual: 12870000,
    status: 'Active',
    preparedBy: 'Tariq Al-Balushi (FP&A Lead)',
    approvedBy: 'Dr. Salim Al-Harthy (CFO)',
    approvalDate: '2025-12-18',
    effectiveStartDate: '2026-01-01',
    effectiveEndDate: '2026-12-31',
    description: 'Comprehensive annual operating, production, and departmental budget for 2026 across Muscat HQ, Sohar and Salalah operations.',
    lineItemsCount: 38,
    createdAt: '2025-11-15',
    updatedAt: '2026-08-01'
  },
  {
    id: 'b-2026-capex',
    budgetCode: 'BCAP-2026-EXP',
    budgetName: 'FY2026 Capital Investments & Infrastructure Master (CAPEX)',
    fiscalYear: 2026,
    version: 'V1.2 - Revised Q3',
    type: 'Capital (CAPEX)',
    entityId: 'ent-artify-hq',
    entityName: 'Artify Heavy Industries LLC',
    currency: 'OMR',
    totalAllocated: 9650000,
    totalCommitted: 2900000,
    totalActual: 4420000,
    status: 'Active',
    preparedBy: 'Hamza Al-Kharusi (VP Engineering)',
    approvedBy: 'Board of Directors Resolution #44',
    approvalDate: '2025-12-22',
    effectiveStartDate: '2026-01-01',
    effectiveEndDate: '2026-12-31',
    description: 'Automated CNC fabrication lines, robotic welding rigs, ERP cloud infrastructure, and Sohar heavy crane replacements.',
    lineItemsCount: 14,
    createdAt: '2025-11-20',
    updatedAt: '2026-08-10'
  },
  {
    id: 'b-2027-prelim',
    budgetCode: 'BM-2027-DRAFT',
    budgetName: 'FY2027 Strategic Growth Outlook (Zero-Based Working Draft)',
    fiscalYear: 2027,
    version: 'V0.3 - FP&A Working Model',
    type: 'Operating (OPEX)',
    entityId: 'ent-artify-hq',
    entityName: 'Artify Heavy Industries LLC',
    currency: 'OMR',
    totalAllocated: 32200000,
    totalCommitted: 0,
    totalActual: 0,
    status: 'Draft',
    preparedBy: 'Tariq Al-Balushi (FP&A Lead)',
    effectiveStartDate: '2027-01-01',
    effectiveEndDate: '2027-12-31',
    description: 'Preliminary zero-based multi-entity forecast factoring in GCC rail expansion and new petrochemical fabrication contracts.',
    lineItemsCount: 22,
    createdAt: '2026-07-01',
    updatedAt: '2026-08-18'
  }
];

// Initial Line Items
const INITIAL_LINE_ITEMS: BudgetLineItem[] = [
  {
    id: 'bli-101',
    budgetId: 'b-2026-master',
    accountCode: 'GL-5100-RAW',
    accountName: 'Direct Raw Materials (Structural Steel & Alloys)',
    category: 'Direct Cost of Goods Sold',
    subCategory: 'Direct Materials',
    costCenterId: 'cc-200',
    costCenterCode: 'CC-200',
    costCenterName: 'Muscat Plant Fabrication',
    departmentId: 'dept-mfg',
    departmentName: 'Manufacturing & Plant Operations',
    annualBudget: 8500000,
    q1Amount: 2100000,
    q2Amount: 2200000,
    q3Amount: 2100000,
    q4Amount: 2100000,
    committedAmount: 1850000,
    actualSpent: 4200000,
    tolerancePercent: 5,
    notes: 'Price indexed to LME global steel spot rates'
  },
  {
    id: 'bli-102',
    budgetId: 'b-2026-master',
    accountCode: 'GL-5200-LAB',
    accountName: 'Direct Production Labor & Certified Welders',
    category: 'Direct Cost of Goods Sold',
    subCategory: 'Labor',
    costCenterId: 'cc-200',
    costCenterCode: 'CC-200',
    costCenterName: 'Muscat Plant Fabrication',
    departmentId: 'dept-mfg',
    departmentName: 'Manufacturing & Plant Operations',
    annualBudget: 4200000,
    q1Amount: 1050000,
    q2Amount: 1050000,
    q3Amount: 1050000,
    q4Amount: 1050000,
    committedAmount: 320000,
    actualSpent: 2280000,
    tolerancePercent: 3,
    notes: 'Covers shift allowances and overtime caps'
  },
  {
    id: 'bli-103',
    budgetId: 'b-2026-master',
    accountCode: 'GL-6100-SAL',
    accountName: 'General & Administrative Staff Compensation',
    category: 'Operating Expenses (OPEX)',
    subCategory: 'Headcount & Payroll',
    costCenterId: 'cc-100',
    costCenterCode: 'CC-100',
    costCenterName: 'Executive HQ & Shared Services',
    departmentId: 'dept-admin',
    departmentName: 'Administration & HR',
    annualBudget: 3400000,
    q1Amount: 850000,
    q2Amount: 850000,
    q3Amount: 850000,
    q4Amount: 850000,
    committedAmount: 120000,
    actualSpent: 1950000,
    tolerancePercent: 2,
    notes: 'Includes PASI statutory pension contributions'
  },
  {
    id: 'bli-104',
    budgetId: 'b-2026-master',
    accountCode: 'GL-6400-IT',
    accountName: 'Enterprise Cloud Infrastructure & Software Licenses',
    category: 'Operating Expenses (OPEX)',
    subCategory: 'Technology',
    costCenterId: 'cc-400',
    costCenterCode: 'CC-400',
    costCenterName: 'Information Technology & Systems',
    departmentId: 'dept-it',
    departmentName: 'IT & Digital Transformation',
    annualBudget: 1200000,
    q1Amount: 450000,
    q2Amount: 250000,
    q3Amount: 250000,
    q4Amount: 250000,
    committedAmount: 280000,
    actualSpent: 710000,
    tolerancePercent: 5,
    notes: 'AWS/GCP reserved instances and ERP SaaS subscriptions'
  },
  {
    id: 'bli-105',
    budgetId: 'b-2026-master',
    accountCode: 'GL-6700-LOG',
    accountName: 'Freight Logistics, Port Handling & Customs Clearance',
    category: 'Operating Expenses (OPEX)',
    subCategory: 'Supply Chain',
    costCenterId: 'cc-300',
    costCenterCode: 'CC-300',
    costCenterName: 'Sohar Logistics & Staging Terminal',
    departmentId: 'dept-scm',
    departmentName: 'Supply Chain & Logistics',
    annualBudget: 2100000,
    q1Amount: 525000,
    q2Amount: 525000,
    q3Amount: 525000,
    q4Amount: 525000,
    committedAmount: 490000,
    actualSpent: 1140000,
    tolerancePercent: 8,
    notes: 'Sea containers and overland heavy haulage'
  },
  {
    id: 'bli-106',
    budgetId: 'b-2026-master',
    accountCode: 'GL-6800-MKT',
    accountName: 'B2B Commercial Marketing, Trade Expos & Client Tenders',
    category: 'Operating Expenses (OPEX)',
    subCategory: 'Commercial',
    costCenterId: 'cc-500',
    costCenterCode: 'CC-500',
    costCenterName: 'Commercial & Project Development',
    departmentId: 'dept-sales',
    departmentName: 'Commercial & Business Development',
    annualBudget: 950000,
    q1Amount: 300000,
    q2Amount: 250000,
    q3Amount: 200000,
    q4Amount: 200000,
    committedAmount: 180000,
    actualSpent: 480000,
    tolerancePercent: 5,
    notes: 'ADIPEC and WETEX international trade shows'
  }
];

// Initial Department Budgets
const INITIAL_DEPARTMENTS: DepartmentBudgetSummary[] = [
  {
    departmentId: 'dept-mfg',
    departmentName: 'Manufacturing & Plant Operations',
    headOfDepartment: 'Eng. Khalid Al-Amri',
    headcount: 245,
    allocatedBudget: 14200000,
    committedBudget: 2650000,
    actualSpent: 7120000,
    availableBalance: 4430000,
    burnRatePercent: 68.8,
    status: 'Active',
    costCenterCodes: ['CC-200', 'CC-210', 'CC-220']
  },
  {
    departmentId: 'dept-scm',
    departmentName: 'Supply Chain & Logistics',
    headOfDepartment: 'Muna Al-Riyami',
    headcount: 48,
    allocatedBudget: 3450000,
    committedBudget: 620000,
    actualSpent: 1840000,
    availableBalance: 990000,
    burnRatePercent: 71.3,
    status: 'Active',
    costCenterCodes: ['CC-300', 'CC-310']
  },
  {
    departmentId: 'dept-admin',
    departmentName: 'Executive, Admin & Legal',
    headOfDepartment: 'Dr. Salim Al-Harthy',
    headcount: 35,
    allocatedBudget: 4100000,
    committedBudget: 310000,
    actualSpent: 2180000,
    availableBalance: 1610000,
    burnRatePercent: 60.7,
    status: 'Active',
    costCenterCodes: ['CC-100', 'CC-110']
  },
  {
    departmentId: 'dept-it',
    departmentName: 'IT & Digital Transformation',
    headOfDepartment: 'Fatma Al-Lawati',
    headcount: 22,
    allocatedBudget: 1850000,
    committedBudget: 410000,
    actualSpent: 960000,
    availableBalance: 480000,
    burnRatePercent: 74.1,
    status: 'Active',
    costCenterCodes: ['CC-400']
  },
  {
    departmentId: 'dept-sales',
    departmentName: 'Commercial & Business Development',
    headOfDepartment: 'Said Al-Habsi',
    headcount: 31,
    allocatedBudget: 2800000,
    committedBudget: 480000,
    actualSpent: 1320000,
    availableBalance: 1000000,
    burnRatePercent: 64.3,
    status: 'Active',
    costCenterCodes: ['CC-500']
  },
  {
    departmentId: 'dept-eng',
    departmentName: 'Engineering, Design & Quality',
    headOfDepartment: 'Hamza Al-Kharusi',
    headcount: 54,
    allocatedBudget: 2000000,
    committedBudget: 380000,
    actualSpent: 910000,
    availableBalance: 710000,
    burnRatePercent: 64.5,
    status: 'Active',
    costCenterCodes: ['CC-450']
  }
];

// Initial Project Budgets
const INITIAL_PROJECT_BUDGETS: ProjectBudgetSummary[] = [
  {
    projectId: 'PRJ-2026-001',
    projectCode: 'PRJ-001',
    projectName: 'Duqm Refinery Modular Pre-Assemblies',
    projectManager: 'Eng. Nasser Al-Hinai',
    totalContractValue: 8400000,
    allocatedBudget: 6200000,
    contingencyReserve: 400000,
    committedCost: 1450000,
    actualIncurred: 3120000,
    eacEstimatedAtCompletion: 5980000,
    varianceAtCompletion: 220000,
    health: 'On Track'
  },
  {
    projectId: 'PRJ-2026-002',
    projectCode: 'PRJ-002',
    projectName: 'Salalah Port Heavy Gantry Crane Modernization',
    projectManager: 'Eng. Zaid Al-Farsi',
    totalContractValue: 4600000,
    allocatedBudget: 3450000,
    contingencyReserve: 250000,
    committedCost: 980000,
    actualIncurred: 1840000,
    eacEstimatedAtCompletion: 3410000,
    varianceAtCompletion: 40000,
    health: 'On Track'
  },
  {
    projectId: 'PRJ-2026-003',
    projectCode: 'PRJ-003',
    projectName: 'PDO Khazzan Gas Compression Piping Skid',
    projectManager: 'Eng. Maryam Al-Balushi',
    totalContractValue: 12500000,
    allocatedBudget: 9800000,
    contingencyReserve: 600000,
    committedCost: 2890000,
    actualIncurred: 4920000,
    eacEstimatedAtCompletion: 9940000,
    varianceAtCompletion: -140000,
    health: 'At Risk'
  }
];

// Initial Cost Centers
const INITIAL_COST_CENTERS: CostCenterBudgetSummary[] = [
  {
    costCenterId: 'cc-100',
    costCenterCode: 'CC-100',
    costCenterName: 'Corporate HQ & Executive Governance',
    departmentName: 'Executive & Admin',
    managerName: 'Dr. Salim Al-Harthy',
    allocatedBudget: 3400000,
    committedBudget: 280000,
    actualSpent: 1950000,
    remainingBudget: 1170000,
    utilizationPercent: 65.6,
    restrictionMode: 'Soft Warning',
    tolerancePercent: 5
  },
  {
    costCenterId: 'cc-200',
    costCenterCode: 'CC-200',
    costCenterName: 'Muscat Fabrication Main Bay',
    departmentName: 'Manufacturing',
    managerName: 'Eng. Khalid Al-Amri',
    allocatedBudget: 12700000,
    committedBudget: 2170000,
    actualSpent: 6480000,
    remainingBudget: 4050000,
    utilizationPercent: 68.1,
    restrictionMode: 'Hard Block',
    tolerancePercent: 2
  },
  {
    costCenterId: 'cc-300',
    costCenterCode: 'CC-300',
    costCenterName: 'Sohar Logistics & Customs Depot',
    departmentName: 'Supply Chain',
    managerName: 'Muna Al-Riyami',
    allocatedBudget: 2100000,
    committedBudget: 490000,
    actualSpent: 1140000,
    remainingBudget: 470000,
    utilizationPercent: 77.6,
    restrictionMode: 'Manager Override',
    tolerancePercent: 8
  },
  {
    costCenterId: 'cc-400',
    costCenterCode: 'CC-400',
    costCenterName: 'IT Cloud & Cybersecurity Center',
    departmentName: 'Information Technology',
    managerName: 'Fatma Al-Lawati',
    allocatedBudget: 1200000,
    committedBudget: 280000,
    actualSpent: 710000,
    remainingBudget: 210000,
    utilizationPercent: 82.5,
    restrictionMode: 'Soft Warning',
    tolerancePercent: 5
  },
  {
    costCenterId: 'cc-500',
    costCenterCode: 'CC-500',
    costCenterName: 'Commercial Tenders & Global Sales',
    departmentName: 'Commercial',
    managerName: 'Said Al-Habsi',
    allocatedBudget: 950000,
    committedBudget: 180000,
    actualSpent: 480000,
    remainingBudget: 290000,
    utilizationPercent: 69.5,
    restrictionMode: 'Advisory Only',
    tolerancePercent: 10
  }
];

// Initial Revenue Streams
const INITIAL_REVENUE_STREAMS: RevenueBudgetStream[] = [
  {
    id: 'rev-01',
    streamCode: 'REV-STR-STEEL',
    streamName: 'Heavy Structural Steel Modular Fabrication',
    productFamily: 'Modular Fabrication',
    territory: 'Oman & UAE',
    targetUnits: 14500, // Metric Tons
    unitPrice: 1200, // OMR / Ton
    targetAnnualRevenue: 17400000,
    actualYtdRevenue: 10850000,
    forecastYearEnd: 17820000,
    achievementPercent: 62.4,
    q1Target: 4100000,
    q2Target: 4300000,
    q3Target: 4500000,
    q4Target: 4500000
  },
  {
    id: 'rev-02',
    streamCode: 'REV-STR-PRESS',
    streamName: 'ASME Certified Pressure Vessels & Boilers',
    productFamily: 'Process Equipment',
    territory: 'GCC & North Africa',
    targetUnits: 38, // Major Units
    unitPrice: 240000, // OMR / Unit
    targetAnnualRevenue: 9120000,
    actualYtdRevenue: 5760000,
    forecastYearEnd: 9350000,
    achievementPercent: 63.2,
    q1Target: 2160000,
    q2Target: 2400000,
    q3Target: 2280000,
    q4Target: 2280000
  },
  {
    id: 'rev-03',
    streamCode: 'REV-STR-SERV',
    streamName: 'On-Site Specialist Maintenance & NDT Inspection',
    productFamily: 'Field Engineering Services',
    territory: 'Sultanate of Oman',
    targetUnits: 120, // Service Contracts
    unitPrice: 42000, // OMR / Contract
    targetAnnualRevenue: 5040000,
    actualYtdRevenue: 3420000,
    forecastYearEnd: 5250000,
    achievementPercent: 67.9,
    q1Target: 1200000,
    q2Target: 1300000,
    q3Target: 1250000,
    q4Target: 1290000
  }
];

// Initial CAPEX Proposals
const INITIAL_CAPEX: CapexInvestmentProposal[] = [
  {
    id: 'cpx-01',
    proposalCode: 'CPX-2026-001',
    assetTitle: 'Automated 12kW Fiber Laser CNC Cutting Gantry (Trumpf TruLaser)',
    category: 'Machinery & Equipment',
    department: 'Manufacturing & Plant Operations',
    costCenterCode: 'CC-200',
    estimatedCost: 1450000,
    contingency: 75000,
    totalCapexRequired: 1525000,
    economicUsefulLifeYears: 10,
    salvageValue: 180000,
    depreciationMethod: 'Straight Line',
    estimatedAnnualSavingsOrRevenue: 420000,
    paybackPeriodYears: 3.6,
    npvEstimated: 840000,
    irrPercent: 22.4,
    priority: 'Critical',
    status: 'Approved',
    justification: 'Triples plate cutting speed, eliminates external beveling outsourcing, reduces raw steel scrap rate by 6.2%.',
    requestedBy: 'Eng. Khalid Al-Amri',
    approvedBy: 'Dr. Salim Al-Harthy (CFO)',
    dateRequested: '2026-01-14',
    expectedCommissionDate: '2026-09-30'
  },
  {
    id: 'cpx-02',
    proposalCode: 'CPX-2026-002',
    assetTitle: 'Twin 80-Ton Heavy Overhead EOT Bridge Cranes for Heavy Vessel Bay',
    category: 'Machinery & Equipment',
    department: 'Manufacturing & Plant Operations',
    costCenterCode: 'CC-200',
    estimatedCost: 880000,
    contingency: 44000,
    totalCapexRequired: 924000,
    economicUsefulLifeYears: 15,
    salvageValue: 90000,
    depreciationMethod: 'Straight Line',
    estimatedAnnualSavingsOrRevenue: 260000,
    paybackPeriodYears: 3.5,
    npvEstimated: 520000,
    irrPercent: 19.8,
    priority: 'Strategic',
    status: 'Procurement Initiated',
    justification: 'Enables tandem lifts for 150-ton refinery columns, reducing mobile crane hire expenditures.',
    requestedBy: 'Eng. Hamza Al-Kharusi',
    approvedBy: 'Board Resolution #48',
    dateRequested: '2026-02-10',
    expectedCommissionDate: '2026-11-15'
  },
  {
    id: 'cpx-03',
    proposalCode: 'CPX-2026-003',
    assetTitle: 'Enterprise High-Performance CAD/FEA Supercomputing Cluster',
    category: 'IT Infrastructure',
    department: 'IT & Digital Transformation',
    costCenterCode: 'CC-400',
    estimatedCost: 320000,
    contingency: 15000,
    totalCapexRequired: 335000,
    economicUsefulLifeYears: 4,
    salvageValue: 25000,
    depreciationMethod: 'Double Declining',
    estimatedAnnualSavingsOrRevenue: 140000,
    paybackPeriodYears: 2.4,
    npvEstimated: 210000,
    irrPercent: 28.5,
    priority: 'Operational',
    status: 'Under Technical Review',
    justification: 'Accelerates finite element analysis simulation runs from 18 hours to 45 minutes for deepwater pressure vessels.',
    requestedBy: 'Fatma Al-Lawati',
    dateRequested: '2026-06-05',
    expectedCommissionDate: '2026-12-01'
  }
];

// Initial 12-Month Cash Flow Projection
const INITIAL_CASH_FLOW: CashFlowMonthlyProjection[] = [
  {
    monthIndex: 1,
    monthName: 'January',
    beginningCashBalance: 4200000,
    operatingInflows: { customerArCollections: 2450000, cashSales: 350000, otherOperationalIncome: 50000, totalOperatingInflows: 2850000 },
    operatingOutflows: { vendorApPayments: 1650000, payrollAndBenefits: 620000, utilitiesAndFacilities: 95000, statutoryTaxesAndVat: 80000, totalOperatingOutflows: 2445000 },
    netOperatingCash: 405000,
    investingCashFlows: { capexOutflows: 350000, assetDisposals: 0, totalInvesting: -350000 },
    financingCashFlows: { loanDrawdowns: 0, principalDebtRepayments: 120000, interestExpensePayments: 35000, equityDividendDistributions: 0, totalFinancing: -155000 },
    netMonthlyCashChange: -100000,
    endingCashBalance: 4100000,
    minimumLiquidityBuffer: 2000000,
    liquiditySurplusOrDeficit: 2100000
  },
  {
    monthIndex: 2,
    monthName: 'February',
    beginningCashBalance: 4100000,
    operatingInflows: { customerArCollections: 2600000, cashSales: 380000, otherOperationalIncome: 45000, totalOperatingInflows: 3025000 },
    operatingOutflows: { vendorApPayments: 1720000, payrollAndBenefits: 620000, utilitiesAndFacilities: 90000, statutoryTaxesAndVat: 85000, totalOperatingOutflows: 2515000 },
    netOperatingCash: 510000,
    investingCashFlows: { capexOutflows: 420000, assetDisposals: 30000, totalInvesting: -390000 },
    financingCashFlows: { loanDrawdowns: 0, principalDebtRepayments: 120000, interestExpensePayments: 35000, equityDividendDistributions: 0, totalFinancing: -155000 },
    netMonthlyCashChange: -35000,
    endingCashBalance: 4065000,
    minimumLiquidityBuffer: 2000000,
    liquiditySurplusOrDeficit: 2065000
  },
  {
    monthIndex: 3,
    monthName: 'March',
    beginningCashBalance: 4065000,
    operatingInflows: { customerArCollections: 2950000, cashSales: 410000, otherOperationalIncome: 60000, totalOperatingInflows: 3420000 },
    operatingOutflows: { vendorApPayments: 1890000, payrollAndBenefits: 630000, utilitiesAndFacilities: 110000, statutoryTaxesAndVat: 120000, totalOperatingOutflows: 2750000 },
    netOperatingCash: 670000,
    investingCashFlows: { capexOutflows: 650000, assetDisposals: 0, totalInvesting: -650000 },
    financingCashFlows: { loanDrawdowns: 500000, principalDebtRepayments: 120000, interestExpensePayments: 38000, equityDividendDistributions: 0, totalFinancing: 342000 },
    netMonthlyCashChange: 362000,
    endingCashBalance: 4427000,
    minimumLiquidityBuffer: 2000000,
    liquiditySurplusOrDeficit: 2427000
  },
  {
    monthIndex: 4,
    monthName: 'April',
    beginningCashBalance: 4427000,
    operatingInflows: { customerArCollections: 2750000, cashSales: 390000, otherOperationalIncome: 40000, totalOperatingInflows: 3180000 },
    operatingOutflows: { vendorApPayments: 1780000, payrollAndBenefits: 625000, utilitiesAndFacilities: 98000, statutoryTaxesAndVat: 90000, totalOperatingOutflows: 2593000 },
    netOperatingCash: 587000,
    investingCashFlows: { capexOutflows: 310000, assetDisposals: 0, totalInvesting: -310000 },
    financingCashFlows: { loanDrawdowns: 0, principalDebtRepayments: 120000, interestExpensePayments: 40000, equityDividendDistributions: 0, totalFinancing: -160000 },
    netMonthlyCashChange: 117000,
    endingCashBalance: 4544000,
    minimumLiquidityBuffer: 2000000,
    liquiditySurplusOrDeficit: 2544000
  },
  {
    monthIndex: 5,
    monthName: 'May',
    beginningCashBalance: 4544000,
    operatingInflows: { customerArCollections: 2880000, cashSales: 420000, otherOperationalIncome: 55000, totalOperatingInflows: 3355000 },
    operatingOutflows: { vendorApPayments: 1820000, payrollAndBenefits: 630000, utilitiesAndFacilities: 105000, statutoryTaxesAndVat: 95000, totalOperatingOutflows: 2650000 },
    netOperatingCash: 705000,
    investingCashFlows: { capexOutflows: 480000, assetDisposals: 0, totalInvesting: -480000 },
    financingCashFlows: { loanDrawdowns: 0, principalDebtRepayments: 120000, interestExpensePayments: 39000, equityDividendDistributions: 0, totalFinancing: -159000 },
    netMonthlyCashChange: 66000,
    endingCashBalance: 4610000,
    minimumLiquidityBuffer: 2000000,
    liquiditySurplusOrDeficit: 2610000
  },
  {
    monthIndex: 6,
    monthName: 'June',
    beginningCashBalance: 4610000,
    operatingInflows: { customerArCollections: 3100000, cashSales: 460000, otherOperationalIncome: 70000, totalOperatingInflows: 3630000 },
    operatingOutflows: { vendorApPayments: 1950000, payrollAndBenefits: 640000, utilitiesAndFacilities: 125000, statutoryTaxesAndVat: 130000, totalOperatingOutflows: 2845000 },
    netOperatingCash: 785000,
    investingCashFlows: { capexOutflows: 850000, assetDisposals: 50000, totalInvesting: -800000 },
    financingCashFlows: { loanDrawdowns: 0, principalDebtRepayments: 120000, interestExpensePayments: 38000, equityDividendDistributions: 500000, totalFinancing: -658000 },
    netMonthlyCashChange: -673000,
    endingCashBalance: 3937000,
    minimumLiquidityBuffer: 2000000,
    liquiditySurplusOrDeficit: 1937000
  },
  {
    monthIndex: 7,
    monthName: 'July',
    beginningCashBalance: 3937000,
    operatingInflows: { customerArCollections: 2900000, cashSales: 400000, otherOperationalIncome: 50000, totalOperatingInflows: 3350000 },
    operatingOutflows: { vendorApPayments: 1840000, payrollAndBenefits: 635000, utilitiesAndFacilities: 140000, statutoryTaxesAndVat: 100000, totalOperatingOutflows: 2715000 },
    netOperatingCash: 635000,
    investingCashFlows: { capexOutflows: 380000, assetDisposals: 0, totalInvesting: -380000 },
    financingCashFlows: { loanDrawdowns: 0, principalDebtRepayments: 120000, interestExpensePayments: 37000, equityDividendDistributions: 0, totalFinancing: -157000 },
    netMonthlyCashChange: 98000,
    endingCashBalance: 4035000,
    minimumLiquidityBuffer: 2000000,
    liquiditySurplusOrDeficit: 2035000
  },
  {
    monthIndex: 8,
    monthName: 'August',
    beginningCashBalance: 4035000,
    operatingInflows: { customerArCollections: 3050000, cashSales: 430000, otherOperationalIncome: 60000, totalOperatingInflows: 3540000 },
    operatingOutflows: { vendorApPayments: 1880000, payrollAndBenefits: 635000, utilitiesAndFacilities: 145000, statutoryTaxesAndVat: 105000, totalOperatingOutflows: 2765000 },
    netOperatingCash: 775000,
    investingCashFlows: { capexOutflows: 450000, assetDisposals: 0, totalInvesting: -450000 },
    financingCashFlows: { loanDrawdowns: 0, principalDebtRepayments: 120000, interestExpensePayments: 36000, equityDividendDistributions: 0, totalFinancing: -156000 },
    netMonthlyCashChange: 169000,
    endingCashBalance: 4204000,
    minimumLiquidityBuffer: 2000000,
    liquiditySurplusOrDeficit: 2204000
  },
  {
    monthIndex: 9,
    monthName: 'September (F)',
    beginningCashBalance: 4204000,
    operatingInflows: { customerArCollections: 3200000, cashSales: 450000, otherOperationalIncome: 50000, totalOperatingInflows: 3700000 },
    operatingOutflows: { vendorApPayments: 1920000, payrollAndBenefits: 640000, utilitiesAndFacilities: 130000, statutoryTaxesAndVat: 110000, totalOperatingOutflows: 2800000 },
    netOperatingCash: 900000,
    investingCashFlows: { capexOutflows: 600000, assetDisposals: 0, totalInvesting: -600000 },
    financingCashFlows: { loanDrawdowns: 0, principalDebtRepayments: 120000, interestExpensePayments: 35000, equityDividendDistributions: 0, totalFinancing: -155000 },
    netMonthlyCashChange: 145000,
    endingCashBalance: 4349000,
    minimumLiquidityBuffer: 2000000,
    liquiditySurplusOrDeficit: 2349000
  },
  {
    monthIndex: 10,
    monthName: 'October (F)',
    beginningCashBalance: 4349000,
    operatingInflows: { customerArCollections: 3300000, cashSales: 480000, otherOperationalIncome: 65000, totalOperatingInflows: 3845000 },
    operatingOutflows: { vendorApPayments: 1980000, payrollAndBenefits: 645000, utilitiesAndFacilities: 115000, statutoryTaxesAndVat: 115000, totalOperatingOutflows: 2855000 },
    netOperatingCash: 990000,
    investingCashFlows: { capexOutflows: 320000, assetDisposals: 0, totalInvesting: -320000 },
    financingCashFlows: { loanDrawdowns: 0, principalDebtRepayments: 120000, interestExpensePayments: 34000, equityDividendDistributions: 0, totalFinancing: -154000 },
    netMonthlyCashChange: 516000,
    endingCashBalance: 4865000,
    minimumLiquidityBuffer: 2000000,
    liquiditySurplusOrDeficit: 2865000
  },
  {
    monthIndex: 11,
    monthName: 'November (F)',
    beginningCashBalance: 4865000,
    operatingInflows: { customerArCollections: 3450000, cashSales: 510000, otherOperationalIncome: 60000, totalOperatingInflows: 4020000 },
    operatingOutflows: { vendorApPayments: 2050000, payrollAndBenefits: 650000, utilitiesAndFacilities: 105000, statutoryTaxesAndVat: 120000, totalOperatingOutflows: 2925000 },
    netOperatingCash: 1095000,
    investingCashFlows: { capexOutflows: 280000, assetDisposals: 0, totalInvesting: -280000 },
    financingCashFlows: { loanDrawdowns: 0, principalDebtRepayments: 120000, interestExpensePayments: 33000, equityDividendDistributions: 0, totalFinancing: -153000 },
    netMonthlyCashChange: 662000,
    endingCashBalance: 5527000,
    minimumLiquidityBuffer: 2000000,
    liquiditySurplusOrDeficit: 3527000
  },
  {
    monthIndex: 12,
    monthName: 'December (F)',
    beginningCashBalance: 5527000,
    operatingInflows: { customerArCollections: 3800000, cashSales: 600000, otherOperationalIncome: 80000, totalOperatingInflows: 4480000 },
    operatingOutflows: { vendorApPayments: 2200000, payrollAndBenefits: 850000, utilitiesAndFacilities: 110000, statutoryTaxesAndVat: 160000, totalOperatingOutflows: 3320000 },
    netOperatingCash: 1160000,
    investingCashFlows: { capexOutflows: 400000, assetDisposals: 20000, totalInvesting: -380000 },
    financingCashFlows: { loanDrawdowns: 0, principalDebtRepayments: 120000, interestExpensePayments: 32000, equityDividendDistributions: 750000, totalFinancing: -902000 },
    netMonthlyCashChange: -122000,
    endingCashBalance: 5405000,
    minimumLiquidityBuffer: 2000000,
    liquiditySurplusOrDeficit: 3405000
  }
];

// Initial Financing Debt
const INITIAL_FINANCING: FinancingDebtObligation[] = [
  {
    id: 'fin-01',
    facilityCode: 'FAC-BMO-2023',
    lenderOrInstitution: 'Bank Muscat (Corporate Banking)',
    facilityType: 'Term Loan',
    principalFacilityAmount: 6000000,
    currentOutstandingBalance: 3840000,
    interestRateOrProfitRate: 5.45,
    rateType: 'Fixed',
    maturityDate: '2029-06-30',
    annualDebtServicePrincipal: 960000,
    annualInterestService: 209280,
    quarterlyPaymentSchedule: { q1: 292320, q2: 292320, q3: 292320, q4: 292320 },
    covenantRequirements: 'Min DSCR 1.35x, Max Total Debt/EBITDA 3.0x',
    currentDscr: 2.14,
    complianceStatus: 'Fully Compliant'
  },
  {
    id: 'fin-02',
    facilityCode: 'FAC-NBO-REV',
    lenderOrInstitution: 'National Bank of Oman (NBO)',
    facilityType: 'Revolving Working Capital',
    principalFacilityAmount: 3500000,
    currentOutstandingBalance: 1250000,
    interestRateOrProfitRate: 4.85,
    rateType: 'Floating (SOFR/CBO+Spread)',
    maturityDate: '2027-12-31',
    annualDebtServicePrincipal: 0,
    annualInterestService: 60625,
    quarterlyPaymentSchedule: { q1: 15156, q2: 15156, q3: 15156, q4: 15156 },
    covenantRequirements: 'Clean down 30 consecutive days annually',
    currentDscr: 3.45,
    complianceStatus: 'Fully Compliant'
  },
  {
    id: 'fin-03',
    facilityCode: 'FAC-MEETHQ-SUKUK',
    lenderOrInstitution: 'Meethaq Islamic Banking',
    facilityType: 'Islamic Sukuk Facility',
    principalFacilityAmount: 5000000,
    currentOutstandingBalance: 4000000,
    interestRateOrProfitRate: 5.15,
    rateType: 'Fixed',
    maturityDate: '2030-12-31',
    annualDebtServicePrincipal: 500000,
    annualInterestService: 206000,
    quarterlyPaymentSchedule: { q1: 176500, q2: 176500, q3: 176500, q4: 176500 },
    covenantRequirements: 'Sharia Board Compliance, Tangible Asset Backing >60%',
    currentDscr: 2.48,
    complianceStatus: 'Fully Compliant'
  }
];

// Initial Reallocation Transfers (Virements)
const INITIAL_TRANSFERS: BudgetReallocationTransfer[] = [
  {
    id: 'trn-01',
    transferCode: 'VMT-2026-004',
    fromCostCenter: 'CC-100 (Executive Admin)',
    fromAccountCode: 'GL-6850',
    fromAccountName: 'Executive Travel & Discretionary',
    toCostCenter: 'CC-400 (IT Operations)',
    toAccountCode: 'GL-6400',
    toAccountName: 'Enterprise Cloud Infrastructure',
    transferAmount: 45000,
    reason: 'Higher simulation workload for Duqm refinery requires surge compute cluster node reservation.',
    impactAssessment: 'Non-critical admin travel deferred to Q4 without operational impact.',
    status: 'Approved',
    requestedBy: 'Fatma Al-Lawati',
    approvedBy: 'Dr. Salim Al-Harthy',
    requestDate: '2026-07-12',
    effectiveDate: '2026-07-15'
  },
  {
    id: 'trn-02',
    transferCode: 'VMT-2026-005',
    fromCostCenter: 'CC-500 (Commercial)',
    fromAccountCode: 'GL-6800',
    fromAccountName: 'Print Media & Promotional Collateral',
    toCostCenter: 'CC-500 (Commercial)',
    toAccountCode: 'GL-6820',
    toAccountName: 'Digital Lead Gen & International Tender Platforms',
    transferAmount: 25000,
    reason: 'Shift advertising mix from offline trade catalogs to ADIPEC and MEED digital tender subscription.',
    impactAssessment: 'Zero net budget change on CC-500.',
    status: 'Pending Approval',
    requestedBy: 'Said Al-Habsi',
    requestDate: '2026-08-14',
    effectiveDate: '2026-08-20'
  }
];

// Initial Approval Workflows
const INITIAL_WORKFLOWS: BudgetApprovalWorkflowItem[] = [
  {
    id: 'wf-01',
    workflowCode: 'APV-BM-2026-REV',
    budgetId: 'b-2026-master',
    budgetName: 'FY2026 Corporate Master Budget (Mid-Year Supplementary)',
    fiscalYear: 2026,
    totalBudgetAmount: 29850000,
    budgetType: 'Operating (OPEX)',
    submittedBy: 'Tariq Al-Balushi',
    submissionDate: '2026-08-01',
    currentLevel: 3,
    totalLevels: 4,
    status: 'Pending Approval',
    priority: 'Board Level',
    steps: [
      { id: 'st-1', level: 1, roleName: 'Head of FP&A', approverName: 'Tariq Al-Balushi', thresholdMaxAmount: 5000000, status: 'Approved', timestamp: '2026-08-02 09:30', comments: 'Reconciled against Q2 actuals' },
      { id: 'st-2', level: 2, roleName: 'Finance Director', approverName: 'Jasim Al-Ajmi', thresholdMaxAmount: 15000000, status: 'Approved', timestamp: '2026-08-03 14:15', comments: 'Verified department variance justifications' },
      { id: 'st-3', level: 3, roleName: 'Chief Financial Officer (CFO)', approverName: 'Dr. Salim Al-Harthy', thresholdMaxAmount: 30000000, status: 'Pending', comments: 'Under final review prior to board packet release' },
      { id: 'st-4', level: 4, roleName: 'Board of Directors Audit Committee', approverName: 'Board Audit Chairman', thresholdMaxAmount: 100000000, status: 'Pending' }
    ]
  },
  {
    id: 'wf-02',
    workflowCode: 'APV-CPX-2026-003',
    budgetId: 'b-2026-capex',
    budgetName: 'Supercomputing Cluster IT CAPEX Proposal (OMR 335,000)',
    fiscalYear: 2026,
    totalBudgetAmount: 335000,
    budgetType: 'Capital (CAPEX)',
    submittedBy: 'Fatma Al-Lawati',
    submissionDate: '2026-06-05',
    currentLevel: 2,
    totalLevels: 2,
    status: 'Pending Approval',
    priority: 'Normal',
    steps: [
      { id: 'st-10', level: 1, roleName: 'VP Engineering & Tech', approverName: 'Hamza Al-Kharusi', thresholdMaxAmount: 200000, status: 'Approved', timestamp: '2026-06-08 11:00', comments: 'Technical specifications validated' },
      { id: 'st-11', level: 2, roleName: 'Chief Financial Officer (CFO)', approverName: 'Dr. Salim Al-Harthy', thresholdMaxAmount: 1000000, status: 'Pending', comments: 'Awaiting revised vendor commercial rebate proposal' }
    ]
  }
];

// Initial Restriction Rules
const INITIAL_RULES: BudgetRestrictionRule[] = [
  {
    id: 'rul-01',
    costCenterCode: 'CC-200',
    costCenterName: 'Muscat Fabrication Main Bay',
    accountCategory: 'Direct Materials & Raw Steel',
    controlMode: 'Hard Block',
    hardThresholdPercent: 100,
    softWarningThresholdPercent: 85,
    managerOverrideTolerancePercent: 2,
    designatedApprover: 'Eng. Khalid Al-Amri + CFO',
    isActive: true,
    notes: 'Strict hard block to prevent inventory over-accumulation beyond committed sales contracts.'
  },
  {
    id: 'rul-02',
    costCenterCode: 'CC-400',
    costCenterName: 'Information Technology & Systems',
    accountCategory: 'Software SaaS & Cloud Compute',
    controlMode: 'Soft Warning',
    hardThresholdPercent: 105,
    softWarningThresholdPercent: 80,
    managerOverrideTolerancePercent: 5,
    designatedApprover: 'Fatma Al-Lawati',
    isActive: true,
    notes: 'Auto-alerts FP&A upon reaching 80% run-rate; permits non-blocking emergency capacity burst.'
  },
  {
    id: 'rul-03',
    costCenterCode: 'CC-300',
    costCenterName: 'Sohar Logistics & Customs Depot',
    accountCategory: 'Freight & Port Handling',
    controlMode: 'Manager Override',
    hardThresholdPercent: 108,
    softWarningThresholdPercent: 90,
    managerOverrideTolerancePercent: 8,
    designatedApprover: 'Muna Al-Riyami',
    isActive: true,
    notes: 'Accommodates spot bunker fuel surcharges with written Department Head signoff.'
  },
  {
    id: 'rul-04',
    costCenterCode: 'CC-100',
    costCenterName: 'Executive HQ & Governance',
    accountCategory: 'Corporate Legal & Professional Fees',
    controlMode: 'Hard Block',
    hardThresholdPercent: 100,
    softWarningThresholdPercent: 85,
    managerOverrideTolerancePercent: 0,
    designatedApprover: 'Dr. Salim Al-Harthy',
    isActive: true,
    notes: 'Zero tolerance without formal board resolution.'
  }
];

// Initial Budget vs Actual Rows
const INITIAL_BVA: BudgetVsActualRow[] = [
  {
    id: 'bva-01',
    accountCode: 'GL-4000',
    accountName: 'Gross Operating Revenue (Structural & Vessels)',
    category: 'Revenue',
    costCenter: 'CC-500 (Commercial)',
    department: 'Commercial',
    annualBudget: 31560000,
    ytdBudget: 18410000,
    ytdActual: 20030000,
    ytdCommitted: 0,
    ytdTotalUtilized: 20030000,
    varianceAmount: 1620000,
    variancePercent: 8.8,
    nature: 'Favorable',
    eacForecastYearEnd: 32420000,
    fullYearProjectedVariance: 860000
  },
  {
    id: 'bva-02',
    accountCode: 'GL-5100',
    accountName: 'Direct Raw Materials (Steel Plates & Sections)',
    category: 'Cost of Goods Sold',
    costCenter: 'CC-200 (Muscat Plant)',
    department: 'Manufacturing',
    annualBudget: 8500000,
    ytdBudget: 4958000,
    ytdActual: 4200000,
    ytdCommitted: 1850000,
    ytdTotalUtilized: 6050000,
    varianceAmount: 758000,
    variancePercent: 15.3,
    nature: 'Favorable',
    eacForecastYearEnd: 8250000,
    fullYearProjectedVariance: 250000
  },
  {
    id: 'bva-03',
    accountCode: 'GL-5200',
    accountName: 'Direct Plant Labor & Overtime Wages',
    category: 'Cost of Goods Sold',
    costCenter: 'CC-200 (Muscat Plant)',
    department: 'Manufacturing',
    annualBudget: 4200000,
    ytdBudget: 2450000,
    ytdActual: 2280000,
    ytdCommitted: 320000,
    ytdTotalUtilized: 2600000,
    varianceAmount: 170000,
    variancePercent: 6.9,
    nature: 'Favorable',
    eacForecastYearEnd: 4120000,
    fullYearProjectedVariance: 80000
  },
  {
    id: 'bva-04',
    accountCode: 'GL-6100',
    accountName: 'Executive & Administrative Salaries',
    category: 'Operating Expenses (OPEX)',
    costCenter: 'CC-100 (Executive)',
    department: 'Admin & HR',
    annualBudget: 3400000,
    ytdBudget: 1983000,
    ytdActual: 1950000,
    ytdCommitted: 120000,
    ytdTotalUtilized: 2070000,
    varianceAmount: 33000,
    variancePercent: 1.7,
    nature: 'Neutral',
    eacForecastYearEnd: 3390000,
    fullYearProjectedVariance: 10000
  },
  {
    id: 'bva-05',
    accountCode: 'GL-6400',
    accountName: 'Cloud Compute & ERP Software Licenses',
    category: 'Operating Expenses (OPEX)',
    costCenter: 'CC-400 (IT Operations)',
    department: 'IT',
    annualBudget: 1200000,
    ytdBudget: 700000,
    ytdActual: 710000,
    ytdCommitted: 280000,
    ytdTotalUtilized: 990000,
    varianceAmount: -10000,
    variancePercent: -1.4,
    nature: 'Unfavorable',
    eacForecastYearEnd: 1280000,
    fullYearProjectedVariance: -80000
  },
  {
    id: 'bva-06',
    accountCode: 'GL-6700',
    accountName: 'Ocean Freight & Port Logistics Charges',
    category: 'Operating Expenses (OPEX)',
    costCenter: 'CC-300 (Sohar Hub)',
    department: 'Supply Chain',
    annualBudget: 2100000,
    ytdBudget: 1225000,
    ytdActual: 1140000,
    ytdCommitted: 490000,
    ytdTotalUtilized: 1630000,
    varianceAmount: 85000,
    variancePercent: 6.9,
    nature: 'Favorable',
    eacForecastYearEnd: 2050000,
    fullYearProjectedVariance: 50000
  }
];

// Initial Rolling Forecasts
const INITIAL_ROLLING_FORECAST: RollingForecastQuarter[] = [
  {
    quarterCode: 'Q1 2026 (Actual)',
    periodType: 'Actual',
    projectedRevenue: 7460000,
    projectedCogs: 4210000,
    projectedGrossProfit: 3250000,
    projectedOpex: 1820000,
    projectedEbitda: 1430000,
    projectedCapex: 1420000,
    projectedNetCashFlow: 362000
  },
  {
    quarterCode: 'Q2 2026 (Actual)',
    periodType: 'Actual',
    projectedRevenue: 8170000,
    projectedCogs: 4540000,
    projectedGrossProfit: 3630000,
    projectedOpex: 1910000,
    projectedEbitda: 1720000,
    projectedCapex: 1640000,
    projectedNetCashFlow: -673000
  },
  {
    quarterCode: 'Q3 2026 (Committed)',
    periodType: 'Committed Forecast',
    projectedRevenue: 8580000,
    projectedCogs: 4720000,
    projectedGrossProfit: 3860000,
    projectedOpex: 1940000,
    projectedEbitda: 1920000,
    projectedCapex: 1430000,
    projectedNetCashFlow: 412000
  },
  {
    quarterCode: 'Q4 2026 (Committed)',
    periodType: 'Committed Forecast',
    projectedRevenue: 8950000,
    projectedCogs: 4890000,
    projectedGrossProfit: 4060000,
    projectedOpex: 1980000,
    projectedEbitda: 2080000,
    projectedCapex: 1000000,
    projectedNetCashFlow: 1056000
  },
  {
    quarterCode: 'Q1 2027 (Rolling)',
    periodType: 'Rolling Outlook',
    projectedRevenue: 9200000,
    projectedCogs: 5020000,
    projectedGrossProfit: 4180000,
    projectedOpex: 2040000,
    projectedEbitda: 2140000,
    projectedCapex: 800000,
    projectedNetCashFlow: 980000
  },
  {
    quarterCode: 'Q2 2027 (Rolling)',
    periodType: 'Rolling Outlook',
    projectedRevenue: 9650000,
    projectedCogs: 5210000,
    projectedGrossProfit: 4440000,
    projectedOpex: 2090000,
    projectedEbitda: 2350000,
    projectedCapex: 750000,
    projectedNetCashFlow: 1120000
  }
];

// Initial Variance Decomposition
const INITIAL_DECOMPOSITIONS: VarianceDecomposition[] = [
  {
    id: 'vd-01',
    accountName: 'Raw Structural Steel Materials',
    totalVariance: 758000,
    priceRateVariance: 420000, // Price favorable (bulk discount negotiated)
    volumeQuantityVariance: 180000, // Volume favorable (scrap yield improved)
    operationalEfficiencyVariance: 110000, // CNC plasma cutting optimization
    timingPhasingVariance: 48000, // Shifted deliveries
    rootCauseAnalysis: 'Bulk hedge purchase on 4,000 MT steel coil secured at $780/MT vs $850/MT budget benchmark.',
    correctiveAction: 'Lock in Q4 futures contracts for additional 2,500 MT.'
  },
  {
    id: 'vd-02',
    accountName: 'Cloud Compute & AI FEA Simulation',
    totalVariance: -10000,
    priceRateVariance: -25000, // On-demand surge compute pricing higher than reserved
    volumeQuantityVariance: -35000, // 30% more simulation iterations on ASME vessels
    operationalEfficiencyVariance: 30000, // Faster job completion
    timingPhasingVariance: 20000,
    rootCauseAnalysis: 'Surge simulation compute run for Duqm refinery seismic loads required unreserved GPU instances.',
    correctiveAction: 'Purchase 1-year GCP reserved instance commitment to slash hourly compute cost by 42%.'
  }
];

// Initial Scenarios
const INITIAL_SCENARIOS: ScenarioPlanModel[] = [
  {
    id: 'scn-base',
    scenarioCode: 'SCN-BASE-2026',
    scenarioName: 'Base Case (Board Approved Plan)',
    description: 'Current baseline budget incorporating committed order backlog and standard inflation projections.',
    parameters: {
      revenueGrowthPercent: 0,
      cogsInflationPercent: 0,
      opexAdjustmentPercent: 0,
      capexSpendingFactor: 1.0,
      interestRateShiftBps: 0,
      fxExchangeRateImpactPercent: 0
    },
    projectedRevenue: 33160000,
    projectedGrossProfit: 14800000,
    projectedOperatingExpenses: 7650000,
    projectedEbitda: 7150000,
    projectedNetIncome: 5120000,
    projectedEndingCash: 5405000,
    covenantComplianceRisk: 'Low',
    isBaseline: true
  },
  {
    id: 'scn-bull',
    scenarioCode: 'SCN-BULL-2026',
    scenarioName: 'Optimistic Expansion (+15% Demand)',
    description: 'Surge in regional energy infrastructure tenders with rapid project execution and high gross margins.',
    parameters: {
      revenueGrowthPercent: 15,
      cogsInflationPercent: -2,
      opexAdjustmentPercent: 3,
      capexSpendingFactor: 1.15,
      interestRateShiftBps: -50,
      fxExchangeRateImpactPercent: 1.5
    },
    projectedRevenue: 38134000,
    projectedGrossProfit: 17820000,
    projectedOperatingExpenses: 7879500,
    projectedEbitda: 9940500,
    projectedNetIncome: 7450000,
    projectedEndingCash: 7890000,
    covenantComplianceRisk: 'Low',
    isBaseline: false
  },
  {
    id: 'scn-bear',
    scenarioCode: 'SCN-BEAR-2026',
    scenarioName: 'Pessimistic Stress Test (-20% Revenue, +8% Steel)',
    description: 'Severe macroeconomic slowdown, project delay in GCC mega-tenders, and global supply chain cost spike.',
    parameters: {
      revenueGrowthPercent: -20,
      cogsInflationPercent: 8,
      opexAdjustmentPercent: -8,
      capexSpendingFactor: 0.6,
      interestRateShiftBps: 150,
      fxExchangeRateImpactPercent: -3.0
    },
    projectedRevenue: 26528000,
    projectedGrossProfit: 10420000,
    projectedOperatingExpenses: 7038000,
    projectedEbitda: 3382000,
    projectedNetIncome: 1420000,
    projectedEndingCash: 2480000,
    covenantComplianceRisk: 'Moderate',
    isBaseline: false
  },
  {
    id: 'scn-oil-shock',
    scenarioCode: 'SCN-ENERGY-2026',
    scenarioName: 'Energy Transition & Raw Material Shock',
    description: 'High commodity price volatility, 10% raw material inflation, offset by high demand for green hydrogen piping.',
    parameters: {
      revenueGrowthPercent: 5,
      cogsInflationPercent: 12,
      opexAdjustmentPercent: 4,
      capexSpendingFactor: 0.85,
      interestRateShiftBps: 75,
      fxExchangeRateImpactPercent: -1.0
    },
    projectedRevenue: 34818000,
    projectedGrossProfit: 13950000,
    projectedOperatingExpenses: 7956000,
    projectedEbitda: 5994000,
    projectedNetIncome: 3980000,
    projectedEndingCash: 4120000,
    covenantComplianceRisk: 'Low',
    isBaseline: false
  }
];

// Initial Audit Logs
const INITIAL_AUDIT: BudgetAuditLog[] = [
  {
    id: 'aud-01',
    timestamp: '2026-08-18 10:45:22',
    user: 'Tariq Al-Balushi (FP&A Lead)',
    role: 'Financial Planner',
    action: 'Simulated Scenario',
    targetReference: 'SCN-BEAR-2026',
    details: 'Executed 10,000 iteration Monte Carlo stress test for Board Risk Committee packet.'
  },
  {
    id: 'aud-02',
    timestamp: '2026-08-14 14:20:11',
    user: 'Said Al-Habsi',
    role: 'Commercial Director',
    action: 'Reallocated Virement',
    targetReference: 'VMT-2026-005',
    details: 'Initiated OMR 25,000 budget transfer from print advertising to digital tender platforms.'
  },
  {
    id: 'aud-03',
    timestamp: '2026-08-03 14:15:40',
    user: 'Jasim Al-Ajmi',
    role: 'Finance Director',
    action: 'Approved Level',
    targetReference: 'APV-BM-2026-REV',
    details: 'Signed off on Level 2 review for FY2026 mid-year master budget supplementary revision.'
  },
  {
    id: 'aud-04',
    timestamp: '2026-07-15 09:12:00',
    user: 'Dr. Salim Al-Harthy',
    role: 'CFO',
    action: 'Approved Level',
    targetReference: 'VMT-2026-004',
    details: 'Approved virement of OMR 45,000 to CC-400 for surge compute simulation.'
  }
];

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [budgets, setBudgets] = useState<BudgetMaster[]>(INITIAL_BUDGETS);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string>('b-2026-master');
  const [lineItems, setLineItems] = useState<BudgetLineItem[]>(INITIAL_LINE_ITEMS);
  const [departmentSummaries] = useState<DepartmentBudgetSummary[]>(INITIAL_DEPARTMENTS);
  const [projectSummaries] = useState<ProjectBudgetSummary[]>(INITIAL_PROJECT_BUDGETS);
  const [costCenterSummaries] = useState<CostCenterBudgetSummary[]>(INITIAL_COST_CENTERS);
  const [revenueStreams, setRevenueStreams] = useState<RevenueBudgetStream[]>(INITIAL_REVENUE_STREAMS);
  const [capexProposals, setCapexProposals] = useState<CapexInvestmentProposal[]>(INITIAL_CAPEX);
  const [cashFlowProjections, setCashFlowProjections] = useState<CashFlowMonthlyProjection[]>(INITIAL_CASH_FLOW);
  const [financingFacilities] = useState<FinancingDebtObligation[]>(INITIAL_FINANCING);
  const [reallocationTransfers, setReallocationTransfers] = useState<BudgetReallocationTransfer[]>(INITIAL_TRANSFERS);
  const [approvalWorkflows, setApprovalWorkflows] = useState<BudgetApprovalWorkflowItem[]>(INITIAL_WORKFLOWS);
  const [restrictionRules, setRestrictionRules] = useState<BudgetRestrictionRule[]>(INITIAL_RULES);
  const [budgetVsActual] = useState<BudgetVsActualRow[]>(INITIAL_BVA);
  const [rollingForecast] = useState<RollingForecastQuarter[]>(INITIAL_ROLLING_FORECAST);
  const [varianceDecompositions] = useState<VarianceDecomposition[]>(INITIAL_DECOMPOSITIONS);
  const [scenarios, setScenarios] = useState<ScenarioPlanModel[]>(INITIAL_SCENARIOS);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('scn-base');
  const [auditLogs, setAuditLogs] = useState<BudgetAuditLog[]>(INITIAL_AUDIT);
  const [selectedFiscalYear, setSelectedFiscalYear] = useState<number>(2026);
  const [currency, setCurrency] = useState<string>('OMR');

  const selectedBudget = useMemo(() => {
    return budgets.find(b => b.id === selectedBudgetId) || budgets[0];
  }, [budgets, selectedBudgetId]);

  const selectBudget = (id: string) => {
    setSelectedBudgetId(id);
  };

  const addAuditLog = (action: BudgetAuditLog['action'], target: string, details: string) => {
    const newLog: BudgetAuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'Current User (Finance Controller)',
      role: 'Finance Controller',
      action,
      targetReference: target,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const createBudget = (budget: Omit<BudgetMaster, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newId = `b-${Date.now()}`;
    const newMaster: BudgetMaster = {
      ...budget,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setBudgets(prev => [newMaster, ...prev]);
    setSelectedBudgetId(newId);
    addAuditLog('Created Budget', newMaster.budgetCode, `Created new master budget: ${newMaster.budgetName}`);
  };

  const updateBudgetStatus = (id: string, status: BudgetStatus) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, status, updatedAt: new Date().toISOString().split('T')[0] } : b));
    addAuditLog('Approved Level', id, `Updated budget status to ${status}`);
  };

  const addLineItem = (item: Omit<BudgetLineItem, 'id'>) => {
    const newItem: BudgetLineItem = {
      ...item,
      id: `bli-${Date.now()}`
    };
    setLineItems(prev => [...prev, newItem]);
    addAuditLog('Updated Allocation', item.accountCode, `Added budget line item for ${item.accountName} (${item.annualBudget} ${currency})`);
  };

  const updateLineItem = (id: string, updates: Partial<BudgetLineItem>) => {
    setLineItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    addAuditLog('Updated Allocation', id, `Modified budget line parameters`);
  };

  const addRevenueStream = (stream: Omit<RevenueBudgetStream, 'id'>) => {
    const newStream: RevenueBudgetStream = {
      ...stream,
      id: `rev-${Date.now()}`
    };
    setRevenueStreams(prev => [...prev, newStream]);
    addAuditLog('Created Budget', newStream.streamCode, `Added revenue stream target for ${newStream.streamName}`);
  };

  const addCapexProposal = (proposal: Omit<CapexInvestmentProposal, 'id'>) => {
    const newProposal: CapexInvestmentProposal = {
      ...proposal,
      id: `cpx-${Date.now()}`
    };
    setCapexProposals(prev => [newProposal, ...prev]);
    addAuditLog('Created Budget', newProposal.proposalCode, `Submitted CAPEX proposal for ${newProposal.assetTitle} (${newProposal.totalCapexRequired} ${currency})`);
  };

  const updateCapexStatus = (id: string, status: CapexInvestmentProposal['status']) => {
    setCapexProposals(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    addAuditLog('Approved Level', id, `Updated CAPEX proposal status to ${status}`);
  };

  const updateCashFlowMonth = (monthIndex: number, updates: Partial<CashFlowMonthlyProjection>) => {
    setCashFlowProjections(prev => prev.map(m => m.monthIndex === monthIndex ? { ...m, ...updates } : m));
    addAuditLog('Updated Allocation', `Month ${monthIndex}`, `Adjusted monthly cash flow projections`);
  };

  const createReallocationTransfer = (transfer: Omit<BudgetReallocationTransfer, 'id' | 'status' | 'requestDate'>) => {
    const newTransfer: BudgetReallocationTransfer = {
      ...transfer,
      id: `trn-${Date.now()}`,
      status: 'Pending Approval',
      requestDate: new Date().toISOString().split('T')[0]
    };
    setReallocationTransfers(prev => [newTransfer, ...prev]);
    addAuditLog('Reallocated Virement', newTransfer.transferCode, `Submitted virement transfer of ${newTransfer.transferAmount} ${currency} from ${newTransfer.fromCostCenter} to ${newTransfer.toCostCenter}`);
  };

  const approveReallocationTransfer = (id: string, approver: string) => {
    setReallocationTransfers(prev => prev.map(t => t.id === id ? { ...t, status: 'Approved', approvedBy: approver } : t));
    addAuditLog('Approved Level', id, `Approved virement transfer by ${approver}`);
  };

  const approveWorkflowStep = (workflowId: string, level: number, comments?: string) => {
    setApprovalWorkflows(prev => prev.map(wf => {
      if (wf.id === workflowId) {
        const updatedSteps = wf.steps.map(s => {
          if (s.level === level) {
            return { ...s, status: 'Approved' as const, timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16), comments: comments || 'Approved' };
          }
          return s;
        });
        const isAllApproved = updatedSteps.every(s => s.status === 'Approved');
        return {
          ...wf,
          currentLevel: isAllApproved ? wf.totalLevels : level + 1,
          status: isAllApproved ? ('Approved' as const) : ('Pending Approval' as const),
          steps: updatedSteps
        };
      }
      return wf;
    }));
    addAuditLog('Approved Level', workflowId, `Approved workflow level ${level}`);
  };

  const rejectWorkflowStep = (workflowId: string, level: number, comments?: string) => {
    setApprovalWorkflows(prev => prev.map(wf => {
      if (wf.id === workflowId) {
        const updatedSteps = wf.steps.map(s => {
          if (s.level === level) {
            return { ...s, status: 'Rejected' as const, timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16), comments: comments || 'Rejected' };
          }
          return s;
        });
        return {
          ...wf,
          status: 'Rejected' as const,
          steps: updatedSteps
        };
      }
      return wf;
    }));
    addAuditLog('Rejected Budget', workflowId, `Rejected workflow at level ${level}: ${comments || 'No comments'}`);
  };

  const updateRestrictionRule = (id: string, updates: Partial<BudgetRestrictionRule>) => {
    setRestrictionRules(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    addAuditLog('Modified Tolerance', id, `Updated budget restriction rule parameters`);
  };

  // Real-time PR/PO Budget Checker Simulator
  const simulateBudgetCheck = ({ costCenterCode, accountCategory, proposedAmount }: { costCenterCode: string; accountCategory: string; proposedAmount: number }) => {
    const rule = restrictionRules.find(r => r.costCenterCode.toLowerCase() === costCenterCode.toLowerCase() || r.accountCategory.toLowerCase().includes(accountCategory.toLowerCase())) || restrictionRules[0];
    const costCenter = costCenterSummaries.find(cc => cc.costCenterCode.toLowerCase() === costCenterCode.toLowerCase()) || costCenterSummaries[0];

    const availableBefore = costCenter.remainingBudget;
    const availableAfter = availableBefore - proposedAmount;
    const totalAllocated = costCenter.allocatedBudget;
    const utilizationAfterPercent = Math.round(((totalAllocated - availableAfter) / totalAllocated) * 100);

    const mode = rule.controlMode;
    let allowed = true;
    let actionRequired: 'None' | 'CFO Approval Needed' | 'Blocked' = 'None';
    let message = '';

    if (availableAfter < 0) {
      const overspendPercent = Math.abs((availableAfter / totalAllocated) * 100);
      if (mode === 'Hard Block') {
        allowed = false;
        actionRequired = 'Blocked';
        message = `HARD BLOCK: Proposed commitment of ${proposedAmount.toLocaleString()} ${currency} exceeds remaining available budget (${availableBefore.toLocaleString()} ${currency}) on ${costCenter.costCenterCode}. Rejection enforced.`;
      } else if (mode === 'Manager Override') {
        if (overspendPercent <= rule.managerOverrideTolerancePercent) {
          allowed = true;
          actionRequired = 'CFO Approval Needed';
          message = `MANAGER OVERRIDE PERMITTED: Exceeds line budget by ${overspendPercent.toFixed(1)}%, within allowed tolerance of ${rule.managerOverrideTolerancePercent}%. Requires secondary CFO electronic authorization.`;
        } else {
          allowed = false;
          actionRequired = 'Blocked';
          message = `OVERRIDE LIMIT EXCEEDED: Overspend of ${overspendPercent.toFixed(1)}% exceeds maximum tolerance threshold of ${rule.managerOverrideTolerancePercent}%. Purchase Requisition blocked.`;
        }
      } else if (mode === 'Soft Warning') {
        allowed = true;
        actionRequired = 'None';
        message = `SOFT WARNING: Transaction permitted. Budget utilization will reach ${utilizationAfterPercent}%. Automated alert dispatched to Cost Center Manager ${costCenter.managerName}.`;
      } else {
        allowed = true;
        actionRequired = 'None';
        message = `ADVISORY: Transaction permitted under informational policy.`;
      }
    } else {
      if (utilizationAfterPercent >= rule.softWarningThresholdPercent) {
        message = `WARNING: Available funds sufficient, but cost center utilization will reach ${utilizationAfterPercent}% (above ${rule.softWarningThresholdPercent}% advisory threshold).`;
      } else {
        message = `BUDGET CHECK PASSED: Available balance of ${availableAfter.toLocaleString()} ${currency} remains after commitment. Utilization is healthy at ${utilizationAfterPercent}%.`;
      }
    }

    return {
      allowed,
      ruleMode: mode,
      availableBefore,
      availableAfter,
      utilizationAfterPercent,
      message,
      actionRequired
    };
  };

  const updateScenarioParameters = (scenarioId: string, params: Partial<ScenarioPlanModel['parameters']>) => {
    setScenarios(prev => prev.map(s => {
      if (s.id === scenarioId) {
        const updatedParams = { ...s.parameters, ...params };
        // Recalculate dynamic P&L
        const baseRev = 33160000;
        const baseCogs = 18360000;
        const baseOpex = 7650000;

        const rev = baseRev * (1 + updatedParams.revenueGrowthPercent / 100);
        const cogs = baseCogs * (1 + updatedParams.cogsInflationPercent / 100) * (1 + updatedParams.revenueGrowthPercent / 100 * 0.7);
        const grossProfit = rev - cogs;
        const opex = baseOpex * (1 + updatedParams.opexAdjustmentPercent / 100);
        const ebitda = grossProfit - opex;
        const netIncome = Math.round(ebitda * 0.72 - (updatedParams.interestRateShiftBps / 10000 * 8000000));
        const endingCash = Math.round(5405000 + (ebitda - 7150000) * 0.8 - (updatedParams.capexSpendingFactor - 1) * 3500000);

        let covenantRisk: 'Low' | 'Moderate' | 'Critical Stress' = 'Low';
        if (ebitda < 4000000) covenantRisk = 'Critical Stress';
        else if (ebitda < 5500000) covenantRisk = 'Moderate';

        return {
          ...s,
          parameters: updatedParams,
          projectedRevenue: Math.round(rev),
          projectedGrossProfit: Math.round(grossProfit),
          projectedOperatingExpenses: Math.round(opex),
          projectedEbitda: Math.round(ebitda),
          projectedNetIncome: netIncome,
          projectedEndingCash: endingCash,
          covenantComplianceRisk: covenantRisk
        };
      }
      return s;
    }));
  };

  const createScenario = (name: string, description: string, params: ScenarioPlanModel['parameters']) => {
    const newId = `scn-${Date.now()}`;
    const baseRev = 33160000;
    const baseCogs = 18360000;
    const baseOpex = 7650000;

    const rev = baseRev * (1 + params.revenueGrowthPercent / 100);
    const cogs = baseCogs * (1 + params.cogsInflationPercent / 100) * (1 + params.revenueGrowthPercent / 100 * 0.7);
    const grossProfit = rev - cogs;
    const opex = baseOpex * (1 + params.opexAdjustmentPercent / 100);
    const ebitda = grossProfit - opex;
    const netIncome = Math.round(ebitda * 0.72 - (params.interestRateShiftBps / 10000 * 8000000));
    const endingCash = Math.round(5405000 + (ebitda - 7150000) * 0.8 - (params.capexSpendingFactor - 1) * 3500000);

    const newScenario: ScenarioPlanModel = {
      id: newId,
      scenarioCode: `SCN-${Date.now().toString().slice(-4)}`,
      scenarioName: name,
      description,
      parameters: params,
      projectedRevenue: Math.round(rev),
      projectedGrossProfit: Math.round(grossProfit),
      projectedOperatingExpenses: Math.round(opex),
      projectedEbitda: Math.round(ebitda),
      projectedNetIncome: netIncome,
      projectedEndingCash: endingCash,
      covenantComplianceRisk: ebitda < 4000000 ? 'Critical Stress' : ebitda < 5500000 ? 'Moderate' : 'Low',
      isBaseline: false
    };

    setScenarios(prev => [...prev, newScenario]);
    setActiveScenarioId(newId);
    addAuditLog('Simulated Scenario', newScenario.scenarioCode, `Created custom scenario simulation model: ${name}`);
  };

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        selectedBudget,
        selectBudget,
        createBudget,
        updateBudgetStatus,
        lineItems,
        addLineItem,
        updateLineItem,
        departmentSummaries,
        projectSummaries,
        costCenterSummaries,
        revenueStreams,
        addRevenueStream,
        capexProposals,
        addCapexProposal,
        updateCapexStatus,
        cashFlowProjections,
        updateCashFlowMonth,
        financingFacilities,
        reallocationTransfers,
        createReallocationTransfer,
        approveReallocationTransfer,
        approvalWorkflows,
        approveWorkflowStep,
        rejectWorkflowStep,
        restrictionRules,
        updateRestrictionRule,
        simulateBudgetCheck,
        budgetVsActual,
        rollingForecast,
        varianceDecompositions,
        scenarios,
        activeScenarioId,
        setActiveScenarioId,
        updateScenarioParameters,
        createScenario,
        auditLogs,
        addAuditLog,
        selectedFiscalYear,
        setSelectedFiscalYear,
        currency,
        setCurrency
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgetStore = (): BudgetStoreContextType => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudgetStore must be used within a BudgetProvider');
  }
  return context;
};

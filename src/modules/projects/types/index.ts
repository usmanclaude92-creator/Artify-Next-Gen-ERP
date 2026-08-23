// ==========================================
// ARTIFY ERP — MODULE 10: PROJECT MANAGEMENT & JOB COSTING
// TypeScript Interfaces, Types, and Enumerations
// ==========================================

export type ProjectStatus = 'PROPOSED' | 'PLANNING' | 'ACTIVE_IN_PROGRESS' | 'ON_HOLD' | 'SUBSTANTIALLY_COMPLETE' | 'CLOSED' | 'CANCELLED';
export type ProjectType = 'EPC_COMMERCIAL' | 'INFRASTRUCTURE' | 'INDUSTRIAL_FABRICATION' | 'OIL_GAS_FACILITY' | 'RESIDENTIAL_COMPLEX' | 'MAINTENANCE_SHUTDOWN' | 'INTERNAL_RD';
export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL_FAST_TRACK';
export type BillingMethod = 'PROGRESS_PERCENT_COMPLETION' | 'MILESTONE_DELIVERABLE' | 'TIME_AND_MATERIALS' | 'FIXED_LUMP_SUM' | 'COST_PLUS_PERCENT';
export type CostCodeCategory = 'MATERIAL' | 'LABOR' | 'EQUIPMENT_PLANT' | 'SUBCONTRACTOR' | 'OVERHEAD_GENERAL' | 'PERMIT_FEES';

// ==========================================
// 10.01 — PROJECT SETUP
// ==========================================

export interface ProjectActivity {
  id: string;
  wbsCode: string; // e.g. "1.1.02"
  activityName: string;
  phaseId: string;
  description: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  plannedCost: number;
  actualCost: number;
  progressPercent: number; // 0 to 100
  assignedTeamLeader: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  predecessorActivityIds?: string[];
  isCriticalPath?: boolean;
}

export interface ProjectPhase {
  id: string;
  phaseSequence: number;
  phaseName: string;
  description: string;
  startDate: string;
  endDate: string;
  budgetAllocated: number;
  actualSpent: number;
  weightagePercent: number; // e.g. 25% of total project
  completionPercent: number;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'DELAYED';
  activities: ProjectActivity[];
}

export interface ProjectClassification {
  id: string;
  code: string;
  name: string;
  sector: 'ENERGY_UTILITIES' | 'CONSTRUCTION_CIVIL' | 'HEAVY_ENGINEERING' | 'COMMERCIAL_BUILD' | 'GOVERNMENT_INFRA';
  standardOverheadMarkupPercent: number;
  standardRetentionRatePercent: number;
  standardAdvanceRecoveryPercent: number;
  description: string;
}

export interface ProjectMaster {
  id: string;
  projectCode: string; // e.g. "PRJ-2026-OM-004"
  projectName: string;
  clientEntity: string;
  clientContactPerson: string;
  clientEmail: string;
  clientPhone: string;
  contractNumber: string;
  contractValue: number;
  currency: string; // OMR, AED, USD, SAR
  projectType: ProjectType;
  projectClassificationId: string;
  projectManager: string;
  siteEngineer: string;
  company?: string; // Enterprise Company Master
  branch: string; // Regional Branch Master
  department?: string; // Operating Department Master
  costCenter?: string; // Cost Center Master
  location: string;
  startDate: string;
  targetCompletionDate: string;
  revisedCompletionDate?: string;
  actualCompletionDate?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  billingMethod: BillingMethod;
  totalBudget: number;
  totalCommitted: number;
  totalActualCost: number;
  totalBilledAmount: number;
  totalReceivedAmount: number;
  retentionWithheldPercent: number; // e.g. 10%
  overallProgressPercent: number;
  phases: ProjectPhase[];
  customTags: string[];
}

// ==========================================
// 10.02 — PROJECT PLANNING
// ==========================================

export interface ProjectScheduleItem {
  id: string;
  activityId: string;
  wbsCode: string;
  activityName: string;
  phaseName: string;
  plannedStart: string;
  plannedFinish: string;
  actualStart?: string;
  actualFinish?: string;
  earlyStart: string;
  earlyFinish: string;
  lateStart: string;
  lateFinish: string;
  totalFloatDays: number;
  freeFloatDays: number;
  isCriticalPath: boolean;
  dependencyType: 'FS' | 'SS' | 'FF' | 'SF';
  predecessors: string[];
  progressPercent: number;
  assignedResourceSummary: string;
}

export interface ResourceAllocation {
  id: string;
  projectId: string;
  resourceName: string;
  resourceRole: 'PROJECT_ENGINEER' | 'SITE_SUPERVISOR' | 'CERTIFIED_WELDER' | 'HEAVY_RIGGER' | 'SAFETY_OFFICER' | 'CRANE_OPERATOR' | 'MEP_TECHNICIAN';
  resourceType: 'INTERNAL_STAFF' | 'SITE_DIRECT_HIRE' | 'SUBCONTRACT_MANPOWER';
  allocatedDailyHours: number;
  hourlyBillingRate: number;
  hourlyCostRate: number;
  assignedWbsActivities: string[];
  startDate: string;
  endDate: string;
  utilizationPercent: number;
}

export interface ProjectBudgetLine {
  id: string;
  costCodeId: string;
  costCodeNumber: string;
  costCodeName: string;
  category: CostCodeCategory;
  phaseId: string;
  phaseName: string;
  baselineBudget: number;
  revisedBudget: number;
  committedCost: number;
  actualCost: number;
  varianceAmount: number; // Budget - Actual
  variancePercent: number;
  forecastAtCompletion: number;
}

export interface ProjectCashForecastMonth {
  monthYear: string; // e.g. "2026-09"
  plannedCapexOutflow: number;
  plannedMaterialOutflow: number;
  plannedLaborOutflow: number;
  plannedSubcontractOutflow: number;
  totalForecastOutflow: number;
  forecastInflowProgressBilling: number;
  netCashFlowForecast: number;
  cumulativeCashFlow: number;
}

// ==========================================
// 10.03 — PROJECT COSTING
// ==========================================

export interface CostCode {
  id: string;
  codeNumber: string; // e.g. "CC-101-01"
  name: string;
  category: CostCodeCategory;
  glAccountCode: string;
  description: string;
  unitOfMeasure?: string;
  standardRatePerUnit?: number;
  isActive: boolean;
}

export interface MaterialCostEntry {
  id: string;
  transactionNumber: string;
  projectId: string;
  activityWbsCode: string;
  costCodeNumber: string;
  itemCode: string;
  itemName: string;
  issueDate: string;
  quantityIssued: number;
  uom: string;
  unitCost: number;
  totalCost: number;
  currency: string;
  warehouseLocation: string;
  issueDocReference: string; // Store Requisition or Delivery Note
  issuedBy: string;
  receivedBySiteStaff: string;
  status: 'POSTED_TO_JOB' | 'DRAFT_PENDING' | 'REVERSED';
}

export interface LaborCostEntry {
  id: string;
  timesheetNumber: string;
  projectId: string;
  activityWbsCode: string;
  costCodeNumber: string;
  employeeId: string;
  employeeName: string;
  tradeOrRole: string;
  workDate: string;
  regularHoursWorked: number;
  overtimeHoursWorked: number;
  regularHourlyRate: number;
  overtimeHourlyRate: number;
  totalLaborCost: number;
  currency: string;
  approvedBySiteForeman: string;
  glPostingReference: string;
  status: 'APPROVED_AND_POSTED' | 'PENDING_ENGINEER_SIGN' | 'REJECTED';
}

export interface EquipmentCostEntry {
  id: string;
  equipmentLogNumber: string;
  projectId: string;
  activityWbsCode: string;
  costCodeNumber: string;
  equipmentAssetId: string;
  equipmentName: string; // e.g. "Kato 50T Mobile Crane", "CAT 330D Excavator"
  equipmentOwnership: 'INTERNAL_COMPANY_PLANT' | 'THIRD_PARTY_DRY_HIRE' | 'THIRD_PARTY_WET_HIRE';
  usageDate: string;
  operatingHours: number;
  idleHours: number;
  hourlyOperatingRate: number;
  hourlyIdleRate: number;
  fuelAndMaintenanceCharge: number;
  totalCost: number;
  currency: string;
  operatorName: string;
  status: 'POSTED_TO_PROJECT' | 'AUDIT_PENDING';
}

// ==========================================
// 10.04 — PROJECT PROCUREMENT
// ==========================================

export interface ProjectRequisitionItem {
  id: string;
  itemCode: string;
  itemDescription: string;
  costCodeNumber: string;
  requiredQuantity: number;
  uom: string;
  estimatedUnitPrice: number;
  estimatedTotal: number;
  requiredByDate: string;
  budgetCheckPassed: boolean;
}

export interface ProjectPurchaseRequisition {
  id: string;
  prNumber: string; // e.g. "PR-PRJ-2026-089"
  projectId: string;
  projectName: string;
  requestedBy: string;
  department: string;
  requestDate: string;
  priority: 'ROUTINE' | 'URGENT_SITE_STOPPAGE' | 'CRITICAL_LONG_LEAD';
  requiredDeliveryLocation: string;
  totalEstimatedAmount: number;
  currency: string;
  justification: string;
  items: ProjectRequisitionItem[];
  status: 'DRAFT' | 'SUBMITTED_FOR_PM_APPROVAL' | 'APPROVED_READY_FOR_PO' | 'REJECTED' | 'PO_GENERATED';
  approvedBy?: string;
  approvalDate?: string;
}

export interface ProjectPurchaseOrder {
  id: string;
  poNumber: string; // e.g. "PO-PRJ-2026-042"
  projectId: string;
  projectName: string;
  vendorId: string;
  vendorName: string;
  costCodeNumber: string;
  orderDate: string;
  expectedDeliveryDate: string;
  deliverySiteLocation: string;
  currency: string;
  subtotalAmount: number;
  taxVatAmount: number;
  totalPoAmount: number;
  paymentTerms: string;
  status: 'ISSUED_TO_VENDOR' | 'PARTIALLY_DELIVERED' | 'FULLY_RECEIVED_ON_SITE' | 'INVOICED_AND_CLOSED' | 'CANCELLED';
  matchedPrNumber?: string;
}

export interface ProjectSiteMaterialInventory {
  id: string;
  projectId: string;
  itemCode: string;
  itemName: string;
  costCodeNumber: string;
  totalReceivedToDate: number;
  totalConsumedToDate: number;
  currentStockOnSite: number;
  uom: string;
  unitValue: number;
  totalInventoryValuation: number;
  currency: string;
  siteStorageLocation: string;
  inspectionCertRef: string;
  qualityCondition: 'PASSED_QC_INSPECTED' | 'QUARANTINED' | 'REJECTED_DEFECTIVE';
}

export interface SubcontractorContract {
  id: string;
  subcontractNumber: string; // e.g. "SUB-2026-018"
  projectId: string;
  subcontractorVendorId: string;
  subcontractorName: string;
  scopeOfWork: string;
  contractTotalValue: number;
  currency: string;
  retentionPercent: number; // e.g. 10%
  advancePaid: number;
  totalCertifiedWorkDone: number;
  totalRetentionDeducted: number;
  netBilledToDate: number;
  totalPaidToDate: number;
  status: 'ACTIVE_AGREEMENT' | 'INSPECTION_PENDING' | 'WORK_COMPLETED_WARRANTY' | 'TERMINATED';
  siteEngineerSignoff: string;
}

// ==========================================
// 10.05 — PROJECT BILLING
// ==========================================

export interface RevenueRecognitionSchedule {
  id: string;
  projectId: string;
  fiscalPeriod: string; // e.g. "2026-Q3"
  contractValue: number;
  cumulativeCostIncurred: number;
  estimatedTotalCostAtCompletion: number;
  calculatedCostToCostPercent: number; // (Cost Incurred / EAC) * 100
  cumulativeRecognizedRevenue: number;
  priorRecognizedRevenue: number;
  currentPeriodRevenueToRecognize: number;
  currency: string;
  methodApplied: 'PERCENTAGE_OF_COMPLETION' | 'COMPLETED_CONTRACT' | 'INPUT_COST_RATIO';
  auditedBy: string;
  status: 'AUDITED_AND_POSTED' | 'DRAFT_ESTIMATE';
}

export interface ProgressPaymentCertificate {
  id: string;
  certificateNumber: string; // e.g. "IPC-2026-004"
  projectId: string;
  claimPeriodStart: string;
  claimPeriodEnd: string;
  submissionDate: string;
  grossAmountClaimed: number;
  certifiedWorkAmount: number;
  retentionDeductionPercent: number;
  retentionDeductionAmount: number;
  mobilizationAdvanceRecoveryAmount: number;
  materialOnSiteCertifiedAmount: number;
  netPayableAmount: number;
  vatTaxAmount: number;
  totalClientPayable: number;
  currency: string;
  clientConsultantEngineer: string;
  consultantSignoffDate?: string;
  status: 'SUBMITTED_TO_CLIENT' | 'CONSULTANT_CERTIFIED' | 'PAYMENT_RECEIVED' | 'DISPUTED';
}

export interface ProjectCustomerInvoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-PRJ-2026-008"
  projectId: string;
  customerName: string;
  linkedIpcNumber: string;
  invoiceDate: string;
  paymentDueDate: string;
  netAmount: number;
  vatAmount: number;
  totalGrossInvoiceAmount: number;
  currency: string;
  paidAmount: number;
  outstandingBalance: number;
  paymentStatus: 'PAID_IN_FULL' | 'PARTIALLY_PAID' | 'OVERDUE' | 'UNPAID_PENDING_MATURITY';
}

// ==========================================
// 10.06 — PROJECT PERFORMANCE & EVA
// ==========================================

export interface ProjectEarnedValueMetrics {
  projectId: string;
  projectCode: string;
  projectName: string;
  currency: string;
  budgetAtCompletion: number; // BAC
  plannedValue: number; // PV (BCWS)
  earnedValue: number; // EV (BCWP)
  actualCost: number; // AC (ACWP)
  scheduleVariance: number; // SV = EV - PV
  costVariance: number; // CV = EV - AC
  schedulePerformanceIndex: number; // SPI = EV / PV
  costPerformanceIndex: number; // CPI = EV / AC
  estimateAtCompletion: number; // EAC = BAC / CPI
  estimateToComplete: number; // ETC = EAC - AC
  varianceAtCompletion: number; // VAC = BAC - EAC
  toCompletePerformanceIndex: number; // TCPI = (BAC - EV) / (BAC - AC)
  healthStatus: 'ON_TRACK' | 'COST_OVERRUN_RISK' | 'SCHEDULE_DELAY' | 'CRITICAL_INTERVENTION_REQUIRED';
}

export interface ProjectPnLStatement {
  projectId: string;
  period: string;
  contractRevenueRecognized: number;
  materialDirectCost: number;
  laborDirectCost: number;
  equipmentDirectCost: number;
  subcontractorDirectCost: number;
  siteOverheadAllocated: number;
  totalCostOfWorkDone: number;
  grossProfitAmount: number;
  grossProfitMarginPercent: number;
  netMarginPercent: number;
}

export interface ProjectCashFlowStatement {
  projectId: string;
  currency: string;
  inflows: {
    advancePaymentCollected: number;
    progressClaimsReceived: number;
    retentionReleased: number;
    totalCashInflows: number;
  };
  outflows: {
    vendorMaterialPayments: number;
    siteLaborPayroll: number;
    equipmentRentalPayments: number;
    subcontractorDisbursements: number;
    statutoryPermitsAndOverheads: number;
    totalCashOutflows: number;
  };
  netOperatingCashFlow: number;
  cumulativeProjectLiquidity: number;
}

// Re-export backend database schema models and DDL definitions
export * from '../db/schema';

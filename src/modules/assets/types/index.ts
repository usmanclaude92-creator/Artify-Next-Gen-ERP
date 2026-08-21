// ==========================================
// ARTIFY ERP — MODULE 13: ASSET MANAGEMENT
// TypeScript Types & Interface Definitions
// ==========================================

export type AssetStatus = 
  | 'DRAFT'
  | 'ACQUIRED'
  | 'IN_SERVICE'
  | 'UNDER_MAINTENANCE'
  | 'IN_TRANSIT'
  | 'CWIP'
  | 'HELD_FOR_SALE'
  | 'DISPOSED'
  | 'SCRAPPED'
  | 'FULLY_DEPRECIATED';

export type DepreciationMethod = 
  | 'STRAIGHT_LINE'
  | 'DECLINING_BALANCE'
  | 'DOUBLE_DECLINING'
  | 'UNITS_OF_PRODUCTION'
  | 'SUM_OF_YEARS_DIGITS';

export type AssetCondition = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';

export type MaintenancePriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type MaintenanceStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';

// ------------------------------------------
// 13.01 Asset Master & Categories
// ------------------------------------------
export interface AssetCategory {
  id: string;
  code: string;
  name: string;
  assetClass: 'LAND_AND_BUILDING' | 'PLANT_AND_MACHINERY' | 'VEHICLES' | 'IT_HARDWARE' | 'OFFICE_EQUIPMENT' | 'FURNITURE_AND_FIXTURES' | 'CWIP';
  defaultDepreciationMethod: DepreciationMethod;
  usefulLifeYears: number;
  salvageValuePercent: number;
  assetGlAccount: string;
  accumulatedDepGlAccount: string;
  depreciationExpenseGlAccount: string;
  gainLossOnDisposalGlAccount: string;
  totalAssetsCount: number;
  totalNBV: number;
}

export interface AssetClassification {
  id: string;
  code: string;
  name: string;
  level: number;
  parentClassId?: string;
  description: string;
  ifrsStandard: string; // e.g. "IAS 16 Property, Plant and Equipment"
  taxDepreciationRatePercent: number;
  active: boolean;
}

export interface FixedAsset {
  id: string;
  assetTag: string; // Barcode / RFID Tag ID e.g. "AST-2024-0089"
  name: string;
  description?: string;
  categoryId: string;
  categoryName: string;
  classificationId: string;
  classificationName: string;
  serialNumber: string;
  barcode: string;
  rfidTag?: string;
  brand: string;
  model: string;
  manufactureYear: number;
  supplierId: string;
  supplierName: string;
  poNumber?: string;
  invoiceNumber?: string;
  
  // Financial Data
  currency: string;
  acquisitionDate: string;
  placedInServiceDate: string;
  originalCost: number;
  additionalCosts: number; // Freight, installation, customs
  revaluationsTotal: number;
  impairmentsTotal: number;
  salvageValue: number;
  usefulLifeMonths: number;
  depreciationMethod: DepreciationMethod;
  accumulatedDepreciation: number;
  netBookValue: number;
  currentYearDepreciation: number;
  lastDepreciationDate?: string;
  
  // Physical & Organizational Context
  companyId: string;
  branch: string;
  plant: string;
  costCenter: string;
  department: string;
  locationId: string;
  locationName: string;
  subLocation?: string; // Room, Bay, Floor, GPS
  gpsCoordinates?: { lat: number; lng: number };
  
  // Custodianship
  custodianId?: string;
  custodianName?: string;
  custodianEmail?: string;
  custodianBadgeId?: string;
  
  // Status & Telematics
  status: AssetStatus;
  condition: AssetCondition;
  meterReading?: number;
  meterUnit?: 'HOURS' | 'KMS' | 'CYCLES';
  isInsured: boolean;
  insurancePolicyId?: string;
  lastPhysicalAuditDate?: string;
  auditStatus?: 'VERIFIED' | 'DISCREPANCY' | 'MISSING' | 'PENDING';
  
  imageUrl?: string;
  notes?: string;
  createdDate: string;
  updatedDate: string;
}

// ------------------------------------------
// 13.02 Asset Acquisition & CWIP
// ------------------------------------------
export interface AssetPurchaseRecord {
  id: string;
  poReference: string;
  vendorInvoiceNumber: string;
  vendorName: string;
  invoiceDate: string;
  capitalizationDate: string;
  items: {
    assetName: string;
    categoryId: string;
    quantity: number;
    unitCost: number;
    additionalFreightCost: number;
    installationLaborCost: number;
    totalCapitalizedCost: number;
    generatedAssetTags: string[];
  }[];
  totalInvoiceAmount: number;
  glPostingStatus: 'POSTED' | 'DRAFT' | 'REVERSED';
  paymentTerms: string;
  approver: string;
}

export interface CWIPProject {
  id: string;
  projectCode: string;
  projectName: string;
  targetAssetCategory: string;
  costCenter: string;
  startDate: string;
  estimatedCompletionDate: string;
  actualCompletionDate?: string;
  budgetAllocated: number;
  accumulatedMaterialCost: number;
  accumulatedContractorCost: number;
  accumulatedInternalLaborCost: number;
  accumulatedOverheadCost: number;
  totalCwipCost: number;
  status: 'IN_PROGRESS' | 'READY_FOR_CAPITALIZATION' | 'CAPITALIZED' | 'CANCELLED';
  completionCertificateNumber?: string;
  capitalizedAssetId?: string;
}

export interface AssetOpeningBalanceUpload {
  id: string;
  batchReference: string;
  uploadDate: string;
  uploadedBy: string;
  totalAssets: number;
  totalHistoricalCost: number;
  totalAccumulatedDep: number;
  totalOpeningNBV: number;
  status: 'PENDING_VALIDATION' | 'VALIDATED' | 'POSTED_TO_SUBLEDGER';
  recordsProcessed: number;
}

// ------------------------------------------
// 13.03 Asset Assignment & Transfer
// ------------------------------------------
export interface AssetAssignment {
  id: string;
  assignmentNumber: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  employeeId: string;
  employeeName: string;
  employeeDepartment: string;
  employeeDesignation: string;
  assignedDate: string;
  expectedReturnDate?: string;
  actualReturnDate?: string;
  conditionAtIssuance: AssetCondition;
  conditionAtReturn?: AssetCondition;
  signatureReceived: boolean;
  status: 'ACTIVE' | 'RETURNED' | 'TRANSFER_REQUESTED';
  acknowledgementNotes?: string;
}

export interface AssetTransferOrder {
  id: string;
  transferOrderNumber: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  fromBranch: string;
  toBranch: string;
  fromCostCenter: string;
  toCostCenter: string;
  fromLocation: string;
  toLocation: string;
  fromCustodian: string;
  toCustodian: string;
  requestDate: string;
  effectiveDate: string;
  transferReason: string;
  requiresGatePass: boolean;
  gatePassNumber?: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'IN_TRANSIT' | 'COMPLETED' | 'REJECTED';
  approvedBy?: string;
  glReallocationJournalId?: string;
}

export interface CustodianProfile {
  id: string;
  employeeId: string;
  fullName: string;
  department: string;
  branch: string;
  email: string;
  activeAssetsCount: number;
  totalAssetsValue: number;
  lastClearanceDate?: string;
  clearanceStatus: 'CLEARED' | 'ASSETS_ASSIGNED' | 'OVERDUE_RETURNS';
}

// ------------------------------------------
// 13.04 Asset Valuation & Depreciation
// ------------------------------------------
export interface DepreciationRun {
  id: string;
  runNumber: string;
  fiscalYear: number;
  periodMonth: number; // 1-12
  periodName: string; // e.g. "August 2026"
  runDate: string;
  totalAssetsDepreciated: number;
  totalDepreciationAmount: number;
  status: 'DRAFT' | 'PREVIEW' | 'POSTED' | 'REVERSED';
  glJournalVoucherNumber?: string;
  executedBy: string;
  categoryBreakdown: {
    categoryName: string;
    assetsCount: number;
    totalDepreciation: number;
  }[];
}

export interface AssetRevaluationRecord {
  id: string;
  revaluationNumber: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  revaluationDate: string;
  appraiserName: string;
  appraisalMethod: 'MARKET_COMPARISON' | 'DISCOUNTED_CASH_FLOW' | 'DEPRECIATED_REPLACEMENT_COST';
  historicalNBV: number;
  newAppraisedFairValue: number;
  revaluationSurplus: number; // Positive = Surplus, Negative = Deficit
  newUsefulLifeRemainingMonths: number;
  effectiveDepreciationRate: number;
  status: 'DRAFT' | 'PENDING_AUDIT_SIGN' | 'APPROVED' | 'POSTED_TO_RESERVES';
  notes: string;
}

export interface AssetImpairmentTest {
  id: string;
  testReference: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  testDate: string;
  carryingAmount: number;
  fairValueLessCostsToSell: number;
  valueInUse: number;
  recoverableAmount: number;
  impairmentLoss: number; // Carrying Amount - Recoverable Amount
  triggerEvent: string; // e.g. "Technological obsolescence", "Physical damage", "Market downturn"
  status: 'TEST_ONLY' | 'IMPAIRMENT_CONFIRMED' | 'POSTED_TO_P_AND_L';
  assessor: string;
}

// ------------------------------------------
// 13.05 Asset Maintenance
// ------------------------------------------
export interface PreventiveMaintenancePlan {
  id: string;
  planCode: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  planName: string;
  frequencyType: 'CALENDAR_DAYS' | 'METER_HOURS' | 'METER_KMS';
  frequencyInterval: number; // e.g. Every 90 days or 500 hours
  lastExecutedDate?: string;
  lastExecutedMeterReading?: number;
  nextDueDate: string;
  nextDueMeterReading?: number;
  tasksChecklist: { taskName: string; mandatory: boolean }[];
  estimatedLaborHours: number;
  estimatedCost: number;
  assignedTechnician: string;
  status: 'ACTIVE' | 'PAUSED' | 'OVERDUE';
}

export interface MaintenanceWorkOrder {
  id: string;
  workOrderNumber: string;
  type: 'PREVENTIVE' | 'CORRECTIVE' | 'EMERGENCY' | 'OVERHAUL';
  priority: MaintenancePriority;
  assetId: string;
  assetTag: string;
  assetName: string;
  location: string;
  reportedDate: string;
  scheduledDate: string;
  completedDate?: string;
  problemDescription: string;
  rootCauseAnalysis?: string;
  actionTaken?: string;
  technician: string;
  vendorId?: string;
  vendorName?: string;
  sparePartsCost: number;
  laborCost: number;
  vendorServiceCost: number;
  totalCost: number;
  sparePartsUsed: {
    itemCode: string;
    description: string;
    quantity: number;
    unitCost: number;
    total: number;
  }[];
  downTimeHours: number;
  status: MaintenanceStatus;
}

// ------------------------------------------
// 13.06 Asset Disposal & Physical Verification
// ------------------------------------------
export interface AssetDisposalRecord {
  id: string;
  disposalNumber: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  disposalType: 'SCRAP' | 'WRITE_OFF' | 'DONATION' | 'AUCTION' | 'TRADE_IN';
  disposalDate: string;
  historicalCost: number;
  accumulatedDepreciation: number;
  netBookValueAtDisposal: number;
  salvageRealizedAmount: number;
  netGainLossOnDisposal: number;
  disposalReason: string;
  approver: string;
  status: 'SUBMITTED' | 'APPROVED' | 'POSTED_TO_GL';
  certificateUrl?: string;
}

export interface AssetSaleInvoice {
  id: string;
  saleInvoiceNumber: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  customerName: string;
  customerTaxId: string;
  saleDate: string;
  netBookValue: number;
  salePriceBeforeTax: number;
  vatRatePercent: number;
  vatAmount: number;
  totalSaleInvoiceAmount: number;
  gainOnSale: number;
  paymentReceived: boolean;
  status: 'INVOICE_ISSUED' | 'PAID' | 'POSTED';
}

export interface PhysicalVerificationAudit {
  id: string;
  auditReference: string;
  auditDate: string;
  locationName: string;
  auditorName: string;
  totalExpectedAssets: number;
  scannedAssetsCount: number;
  missingAssetsCount: number;
  discrepantLocationCount: number;
  unrecordedAssetsFound: number;
  reconciliationStatus: 'IN_PROGRESS' | 'RECONCILED' | 'ADJUSTMENT_POSTED';
  scannedRecords: {
    assetTag: string;
    assetName: string;
    expectedLocation: string;
    actualLocation: string;
    scannedCondition: AssetCondition;
    status: 'FOUND_MATCH' | 'WRONG_LOCATION' | 'MISSING' | 'UNRECORDED';
    scannedTimestamp: string;
  }[];
}

export interface AssetInsurancePolicy {
  id: string;
  policyNumber: string;
  insuranceProvider: string;
  policyType: 'ALL_RISK' | 'MACHINERY_BREAKDOWN' | 'COMMERCIAL_FLEET' | 'FIRE_AND_PERILS';
  coverageStartDate: string;
  coverageEndDate: string;
  totalInsuredValue: number;
  annualPremium: number;
  deductibleAmount: number;
  coveredAssetsCount: number;
  policyStatus: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'RENEWED';
  claims: {
    claimNumber: string;
    incidentDate: string;
    assetTag: string;
    claimAmount: number;
    settledAmount?: number;
    claimStatus: 'FILED' | 'UNDER_REVIEW' | 'SETTLED' | 'REJECTED';
  }[];
}

// ------------------------------------------
// SCM / Asset AI Recommendations
// ------------------------------------------
export interface AssetAIInsight {
  id: string;
  type: 'PREDICTIVE_FAILURE' | 'IMPAIRMENT_FLAG' | 'AUDIT_ANOMALY' | 'DEPRECIATION_OPTIMIZATION' | 'REPLACEMENT_ROI';
  title: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  affectedAssetTag?: string;
  affectedAssetName?: string;
  description: string;
  suggestedAction: string;
  financialImpact?: string;
  confidenceScore: number;
}

// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 15: CONSTRUCTION & CONTRACT MANAGEMENT
// TypeScript Definitions & Entity Data Models
// ==========================================

export type ContractType = 
  | 'FIDIC_RED_BOOK' // Measurement / Construction
  | 'FIDIC_YELLOW_BOOK' // Plant & Design-Build
  | 'FIDIC_SILVER_BOOK' // EPC / Turnkey
  | 'LUMP_SUM_FIXED_PRICE'
  | 'ITEM_RATE_REMEASURABLE'
  | 'COST_PLUS_PERCENTAGE'
  | 'TRADE_SUBCONTRACT';

export type ContractStatus = 
  | 'DRAFT'
  | 'TENDER_AWARD'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'SUBSTANTIALLY_COMPLETED'
  | 'DLP_WARRANTY'
  | 'CLOSED';

export type BOQDivision = 
  | 'DIV_01_GENERAL_REQUIREMENTS'
  | 'DIV_02_EXISTING_CONDITIONS_EARTHWORKS'
  | 'DIV_03_CONCRETE_WORKS'
  | 'DIV_04_MASONRY'
  | 'DIV_05_METALS_STRUCTURAL_STEEL'
  | 'DIV_07_THERMAL_MOISTURE_PROTECTION'
  | 'DIV_08_OPENINGS_DOORS_WINDOWS'
  | 'DIV_09_FINISHES_FLOORING_PAINT'
  | 'DIV_22_PLUMBING_DRAINAGE'
  | 'DIV_23_HVAC_MECHANICAL'
  | 'DIV_26_ELECTRICAL_LOW_CURRENT'
  | 'DIV_31_EARTHMOVING_FOUNDATIONS'
  | 'DIV_32_EXTERIOR_LANDSCAPING';

export type IPCStatus = 
  | 'DRAFT'
  | 'SUBMITTED_TO_ENGINEER'
  | 'UNDER_CONSULTANT_EVALUATION'
  | 'CERTIFIED'
  | 'DISPUTED'
  | 'INVOICED'
  | 'PAID';

export type BondType = 
  | 'PERFORMANCE_BOND'
  | 'TENDER_BID_BOND'
  | 'ADVANCE_PAYMENT_GUARANTEE'
  | 'RETENTION_BOND'
  | 'MAINTENANCE_WARRANTY_BOND';

export type BondStatus = 
  | 'ACTIVE'
  | 'RENEWAL_PENDING'
  | 'RELEASED'
  | 'INVOKED_CLAIMED'
  | 'EXPIRED';

export type VariationStatus = 
  | 'PROPOSED'
  | 'UNDER_ENGINEER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXECUTED';

export type ClaimStatus = 
  | 'NOTICE_SUBMITTED'
  | 'DETAILED_CLAIM_LODGED'
  | 'UNDER_DETERMINATION'
  | 'DETERMINED_SETTLED'
  | 'REFERRED_TO_ADJUDICATION';

// ==========================================
// 15.01 CONTRACT MANAGEMENT
// ==========================================

export interface ContractMaster {
  id: string;
  contractNumber: string; // e.g. "CON-2024-008"
  title: string;
  projectCode: string;
  projectName: string;
  contractType: ContractType;
  clientName: string;
  mainContractor: string;
  supervisingConsultant: string;
  currency: string;
  originalContractValue: number;
  approvedVariationsValue: number;
  revisedContractValue: number;
  contractStartDate: string;
  contractualCompletionDate: string;
  revisedCompletionDate: string;
  actualCompletionDate?: string;
  siteLocation: string;
  status: ContractStatus;
  progressPhysicalPct: number;
  progressFinancialPct: number;
  scopeSummary: string;
  advancePaymentPercentage: number;
  advanceRecoveryStartPct: number;
  advanceRecoveryEndPct: number;
  retentionPercentage: number;
  retentionCapPercentage: number;
  defectLiabilityPeriodMonths: number;
  liquidatedDamagesPerDay: number;
  maxLiquidatedDamagesPct: number;
}

export interface ClientContractAgreement {
  id: string;
  contractId: string;
  employerName: string;
  employerAddress: string;
  paymentCycleDays: number;
  ipcSubmissionDayOfMonth: number;
  engineerName: string;
  vatTaxRegistrationNumber: string;
  governingLaw: string;
  arbitrationVenue: string;
}

export interface SubcontractPackage {
  id: string;
  subcontractNumber: string; // e.g. "SUB-MEP-01"
  contractId: string;
  tradePackage: string; // e.g. "HVAC & Ductwork Installation"
  subcontractorName: string;
  contactPerson: string;
  subcontractValue: number;
  awardedDate: string;
  targetStartDate: string;
  targetEndDate: string;
  retentionPercentage: number;
  advancePercentage: number;
  payWhenPaidClause: boolean;
  cumulativeBilled: number;
  cumulativeCertified: number;
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'SUBSTANTIALLY_COMPLETED' | 'CLOSED';
}

export interface ContractClauseTerm {
  id: string;
  contractId: string;
  clauseCode: string; // e.g. "FIDIC Cl. 14.2"
  clauseHeading: string;
  clauseType: 'ADVANCE' | 'RETENTION' | 'VARIATION' | 'EOT_CLAIM' | 'LIQUIDATED_DAMAGES' | 'DISPUTE_ARBITRATION' | 'TERMINATION';
  standardText: string;
  customModifications: string;
  complianceLevel: 'STANDARD' | 'MODIFIED_STRICT' | 'SPECIAL_CONDITION';
}

// ==========================================
// 15.02 BOQ MANAGEMENT
// ==========================================

export interface BOQItem {
  id: string;
  boqCode: string; // e.g. "03.02.01"
  contractId: string;
  division: BOQDivision;
  itemDescription: string;
  unitOfMeasure: string; // m3, m2, Ton, LS, Nr
  tenderQuantity: number;
  revisedQuantity: number;
  executedQuantityToDate: number;
  certifiedQuantityToDate: number;
  unitRate: number;
  totalTenderAmount: number;
  totalRevisedAmount: number;
  totalExecutedAmount: number;
  rateBreakdown: {
    materialRate: number;
    laborRate: number;
    equipmentRate: number;
    subcontractorRate: number;
    overheadProfitRate: number;
  };
  reMeasurementRequired: boolean;
}

export interface BOQRevision {
  id: string;
  revisionCode: string; // e.g. "REV-IFC-02"
  contractId: string;
  title: string;
  reason: 'IFC_DRAWING_UPDATE' | 'TENDER_ADDENDUM' | 'SITE_RE_MEASUREMENT' | 'CLIENT_SCOPE_CHANGE';
  dateIssued: string;
  issuedBy: string;
  approvedBy: string;
  affectedItemsCount: number;
  netFinancialImpact: number;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'SUPERSEDED';
}

export interface BOQRateAnalysis {
  id: string;
  boqItemId: string;
  itemCode: string;
  description: string;
  unit: string;
  baseMaterialCost: number;
  baseLaborCost: number;
  basePlantEquipmentCost: number;
  preliminarySiteOverheadPct: number;
  contractorMarginProfitPct: number;
  derivedUnitRate: number;
  clientApprovedRate: number;
  analysisDate: string;
}

// ==========================================
// 15.03 SITE & WORK MANAGEMENT
// ==========================================

export interface SiteProfile {
  id: string;
  siteCode: string; // e.g. "SITE-DOWNTOWN-TWR"
  siteName: string;
  contractId: string;
  locationCoordinates: string;
  projectManager: string;
  residentEngineer: string;
  hseSafetyManager: string;
  totalHeadcountToday: number;
  activeEquipmentUnits: number;
  safeManHoursSinceLTI: number;
  siteOfficeStatus: 'OPERATIONAL' | 'MOBILIZING' | 'DEMOBILIZING';
  accessPermitNumber: string;
  stagingYardCapacityPct: number;
}

export interface SiteWorkOrder {
  id: string;
  workOrderNumber: string; // e.g. "SWO-2024-114"
  siteId: string;
  contractId: string;
  title: string;
  tradePackage: string;
  assignedCrewOrSubcontractor: string;
  zoneLocation: string; // e.g. "Level 14 - East Core Wall"
  scheduledStartDate: string;
  scheduledEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  progressPercent: number;
  inspectionStatus: 'PENDING_INSPECTION' | 'INSPECTED_PASSED' | 'PUNCH_LIST_REWORK' | 'IN_PROGRESS';
  qaInspectionRequestId?: string;
  status: 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
}

export interface ProjectMilestone {
  id: string;
  contractId: string;
  milestoneCode: string; // e.g. "MS-04"
  title: string;
  targetDate: string;
  actualDate?: string;
  weightagePct: number;
  associatedPaymentRelease: number;
  isCriticalPath: boolean;
  status: 'PENDING' | 'ON_SCHEDULE' | 'DELAYED' | 'ACHIEVED' | 'CERTIFIED';
  consultantSignoffDate?: string;
}

export interface SiteDailyActivityLog {
  id: string;
  reportDate: string;
  siteId: string;
  contractId: string;
  reportNumber: string; // e.g. "DSR-2024-0312"
  weatherCondition: 'CLEAR_SUNNY' | 'EXTREME_HEAT' | 'SAND_STORM' | 'RAIN_WIND';
  ambientTemperatureHighC: number;
  manpowerLog: {
    engineers: number;
    foremen: number;
    skilledCarpentersSteelFixers: number;
    mepTechnicians: number;
    helpersGeneralLabor: number;
    totalHeadcount: number;
  };
  equipmentLog: {
    equipmentName: string;
    quantity: number;
    hoursWorked: number;
    hoursIdleBreakdown: number;
  }[];
  activitiesExecuted: string[];
  materialsReceivedSummary: string[];
  safetyObservations: string;
  visitorsConsultantComments: string;
  sitePhotosAttached: number;
  loggedBy: string;
}

// ==========================================
// 15.04 PROGRESS & BILLING (IPC)
// ==========================================

export interface JointProgressMeasurement {
  id: string;
  measurementSheetNumber: string; // e.g. "JMS-IPC09-001"
  contractId: string;
  periodMonth: string;
  measurementDate: string;
  contractorSurveyor: string;
  consultantSurveyor: string;
  lineItems: {
    boqItemId: string;
    boqCode: string;
    description: string;
    unit: string;
    tenderQty: number;
    previousCumulativeQty: number;
    thisPeriodMeasuredQty: number;
    totalCumulativeQty: number;
    unitRate: number;
    thisPeriodAmount: number;
  }[];
  totalMeasuredAmount: number;
  status: 'DRAFT' | 'SURVEYOR_AGREED' | 'CONSULTANT_SIGNED';
}

export interface InterimPaymentCertificate {
  id: string;
  ipcNumber: string; // e.g. "IPC-09"
  contractId: string;
  periodStartDate: string;
  periodEndDate: string;
  submissionDate: string;
  certificationDate?: string;
  clientName: string;
  // Valuation Components
  grossWorkExecutedThisPeriod: number;
  cumulativeGrossWorkExecuted: number;
  materialsOnSiteAdvancement: number; // MOS
  approvedVariationsThisPeriod: number;
  cumulativeApprovedVariations: number;
  grossCertifiedCumulativeTotal: number;
  // Deductions
  advancePaymentRecoveryThisPeriod: number;
  cumulativeAdvanceRecovered: number;
  retentionDeductedThisPeriod: number;
  cumulativeRetentionWithheld: number;
  previousCertificatesCumulativePaid: number;
  // Net Payable
  netPayableBeforeVat: number;
  vatTaxAmount: number; // 5%
  totalNetPayableWithVat: number;
  // Approvals & Status
  certifiedByConsultantEngineer: string;
  engineerCertificateRefNumber?: string;
  status: IPCStatus;
  paymentDueDate: string;
  paidDate?: string;
}

export interface ProgressTaxInvoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-CIVIL-2024-009"
  ipcId: string;
  contractId: string;
  clientName: string;
  invoiceDate: string;
  paymentDueDate: string;
  taxableCertifiedAmount: number;
  vatRatePct: number;
  vatAmount: number;
  totalInvoiceAmount: number;
  paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE';
  amountCollected: number;
}

export interface SubcontractorPaymentCertificate {
  id: string;
  subIpcNumber: string; // e.g. "SUB-IPC-MEP-06"
  subcontractId: string;
  subcontractorName: string;
  tradePackage: string;
  period: string;
  claimedAmount: number;
  engineerCertifiedAmount: number;
  retentionWithheld: number;
  advanceRecoveryDeducted: number;
  netPayableToSubcontractor: number;
  approvalStatus: 'PENDING_QS_AUDIT' | 'APPROVED_BY_PROJECT_DIRECTOR' | 'PROCESSED_IN_TREASURY';
  paymentDate?: string;
}

// ==========================================
// 15.05 CONTRACT FINANCIAL MANAGEMENT
// ==========================================

export interface RetentionLedgerEntry {
  id: string;
  contractId: string;
  retentionType: 'CLIENT_WITHHELD' | 'SUBCONTRACTOR_WITHHELD';
  partyName: string;
  ipcOrBillRef: string;
  transactionDate: string;
  amountWithheld: number;
  cumulativeRetentionBalance: number;
  retentionCapAmount: number;
  releaseTrigger: '50_PCT_ON_PRACTICAL_COMPLETION' | '50_PCT_ON_DLP_EXPIRY';
  status: 'HELD_IN_ESCROW' | 'RELEASED_STAGE_1' | 'FULLY_RELEASED' | 'SUBSTITUTED_BY_BOND';
}

export interface AdvancePaymentRecoverySchedule {
  id: string;
  contractId: string;
  totalAdvancePaid: number;
  advancePercentage: number;
  bankGuaranteeRef: string;
  recoveryThresholdStartPercentage: number; // e.g. 20%
  recoveryThresholdEndPercentage: number; // e.g. 80%
  recoveryRatePerIpcPct: number;
  totalRecoveredToDate: number;
  remainingAdvanceBalance: number;
  recoveryStatus: 'AMORTIZING' | 'FULLY_RECOVERED' | 'NOT_STARTED';
}

export interface ContractCostingBreakdown {
  id: string;
  contractId: string;
  baselineBudgetCost: number;
  committedPurchaseOrders: number;
  actualIncurredCost: {
    materialsDirect: number;
    laborDirect: number;
    plantAndEquipment: number;
    tradeSubcontracts: number;
    sitePreliminariesAndStaff: number;
    totalActualCost: number;
  };
  earnedValueEV: number; // BCWP
  plannedValuePV: number; // BCWS
  costVarianceCV: number; // EV - AC
  scheduleVarianceSV: number; // EV - PV
  costPerformanceIndexCPI: number; // EV / AC
  schedulePerformanceIndexSPI: number; // EV / PV
  forecastedCostAtCompletionEAC: number;
}

export interface ContractProfitabilitySummary {
  id: string;
  contractId: string;
  projectName: string;
  clientName: string;
  contractOriginalValue: number;
  approvedVariationsValue: number;
  finalForecastedRevenue: number;
  forecastedTotalCost: number;
  forecastedGrossProfit: number;
  forecastedGrossMarginPct: number;
  billedToDate: number;
  collectedToDate: number;
  costIncurredToDate: number;
  currentRealizedMarginPct: number;
}

// ==========================================
// 15.06 BONDS & BANK GUARANTEES
// ==========================================

export interface BondGuaranteeRecord {
  id: string;
  instrumentNumber: string; // e.g. "BG-NBO-2024-9981"
  contractId: string;
  bondType: BondType;
  title: string;
  issuingBank: string;
  beneficiaryName: string; // Client / Employer
  instrumentValue: number;
  currency: string;
  percentageOfContract: number;
  issueDate: string;
  originalExpiryDate: string;
  currentExpiryDate: string;
  claimPeriodDays: number;
  renewalAlertDaysBefore: number;
  marginCashCollateralHeld: number;
  bankCommissionFeeAnnualPct: number;
  status: BondStatus;
  linkedMilestoneRelease: string;
  physicalDocumentLocation: string;
}

// ==========================================
// 15.07 VARIATIONS, CLAIMS & EXTENSION OF TIME
// ==========================================

export interface VariationOrderRecord {
  id: string;
  voNumber: string; // e.g. "VO-014"
  contractId: string;
  title: string;
  originatingParty: 'CLIENT_REQUEST' | 'ENGINEER_INSTRUCTION' | 'SITE_CONDITION' | 'VALUE_ENGINEERING_PROPOSAL';
  dateInitiated: string;
  dateApproved?: string;
  contractorProposedAmount: number;
  engineerEvaluatedAmount: number;
  finalAgreedAmount: number;
  extensionOfTimeDaysGranted: number;
  scopeDescription: string;
  technicalJustification: string;
  boqItemsAddedCount: number;
  status: VariationStatus;
  ipcIncorporatedNumber?: string;
}

export interface ContractClaimRecord {
  id: string;
  claimNumber: string; // e.g. "CLM-2024-002"
  contractId: string;
  title: string;
  fidicClauseReference: string; // e.g. "Clause 8.4 [Extension of Time for Completion] & Clause 20.1"
  claimCategory: 'PROLONGATION_AND_DISRUPTION' | 'UNFORESEEN_PHYSICAL_CONDITIONS' | 'DELAYED_DRAWINGS_ACCESS' | 'PRICE_MATERIAL_ESCALATION';
  noticeOfClaimDate: string;
  fullParticularsSubmissionDate: string;
  claimedFinancialQuantum: number;
  claimedTimeExtensionDays: number;
  engineerDeterminedAmount: number;
  engineerDeterminedEOTDays: number;
  narrativeSummary: string;
  status: ClaimStatus;
  disputeAdjudicationBoardInvolved: boolean;
}

export interface ExtensionOfTimeRecord {
  id: string;
  eotNumber: string; // e.g. "EOT-REQ-03"
  contractId: string;
  eventDescription: string;
  criticalPathActivityAffected: string;
  eventStartDate: string;
  eventEndDate: string;
  delayDaysClaimed: number;
  delayDaysRecommendedByEngineer: number;
  delayDaysApprovedByEmployer: number;
  originalCompletionDate: string;
  revisedContractualCompletionDate: string;
  associatedProlongationCost: number;
  status: 'SUBMITTED' | 'UNDER_EVALUATION' | 'APPROVED' | 'PARTIALLY_GRANTED' | 'REJECTED';
}

export interface LiquidatedDamagesAssessment {
  id: string;
  contractId: string;
  dailyPenaltyRate: number;
  contractualCompletionDate: string;
  forecastedOrActualCompletionDate: string;
  unexcusedDelayDays: number;
  totalCalculatedLdExposure: number;
  maximumLdCapAmount: number; // 10% of Contract
  status: 'NO_EXPOSURE' | 'WARNING_DELAY_ACCELERATION_REQUIRED' | 'LD_LEVIED_IN_IPC';
  mitigationRecoveryPlan: string;
}

// ==========================================
// 15.08 CONTRACT CLOSEOUT
// ==========================================

export interface FinalAccountStatement {
  id: string;
  finalAccountNumber: string; // e.g. "FA-CON-2024-008"
  contractId: string;
  originalContractSum: number;
  netVariationsSummarySum: number;
  provisionalSumsReconciliation: number;
  claimsAndEotSettlementSum: number;
  totalFinalAgreedContractSum: number;
  totalGrossIpcCertifiedToDate: number;
  finalBalancePayableToContractor: number;
  contractorSignedAgreementDate?: string;
  employerSignedAgreementDate?: string;
  dateClosed: string;
  status: 'DRAFT_STATEMENT' | 'JOINT_NEGOTIATION' | 'MUTUALLY_SIGNED' | 'FINAL_PAYMENT_PROCESSED';
}

export interface ContractCompletionCertificate {
  id: string;
  completionType: 'TAKING_OVER_CERTIFICATE_TOC' | 'PRACTICAL_COMPLETION_PAC' | 'PERFORMANCE_CERTIFICATE_FINAL';
  certificateNumber: string; // e.g. "TOC-2024-001"
  contractId: string;
  effectiveTakingOverDate: string;
  snagPunchListTotalCount: number;
  snagPunchListClearedCount: number;
  dlpWarrantyStartDate: string;
  dlpWarrantyEndDate: string;
  supervisingEngineerSignature: string;
  clientRepresentativeSignature: string;
  status: 'ISSUED_WITH_SNAGS' | 'ALL_SNAGS_CLEARED' | 'WARRANTY_DLP_ACTIVE' | 'FINAL_DISCHARGE';
}

export interface RetentionReleaseRecord {
  id: string;
  releaseNumber: string; // e.g. "RET-REL-01"
  contractId: string;
  releaseStage: 'STAGE_1_TOC_50_PERCENT' | 'STAGE_2_DLP_EXPIRY_50_PERCENT';
  totalRetentionWithheld: number;
  amountBeingReleased: number;
  deductionsForUnrepairedDefects: number;
  netPaymentDisbursed: number;
  bankTransferRef: string;
  releaseDate: string;
  approvedBy: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'DISBURSED';
}

export interface ContractCloseoutFormalRecord {
  id: string;
  closeoutNumber: string; // e.g. "CLS-2024-008"
  contractId: string;
  asBuiltDrawingsHandedOver: boolean;
  operationAndMaintenanceManualsDelivered: boolean;
  municipalityCompletionPermitsReceived: boolean;
  subcontractorFinalAccountsSettled: boolean;
  bankGuaranteesReturnedCancelled: boolean;
  finalRetentionFullyReleased: boolean;
  taxClearanceCertificateAttached: boolean;
  formalCloseoutDate: string;
  archivalStorageReference: string;
  closeoutStatus: 'IN_PROGRESS' | 'AUDITED_AND_COMPLETED' | 'ARCHIVED';
}

// ==========================================
// EXECUTIVE & AI METRICS
// ==========================================

export interface ConstructionModuleKPIs {
  activeContractsCount: number;
  totalPortfolioContractValue: number;
  totalCertifiedWipThisMonth: number;
  cumulativeRetentionHeldInPortfolio: number;
  pendingVariationOrdersValue: number;
  activeBondsExposureValue: number;
  averagePortfolioCostPerformanceIndexCPI: number;
  averagePortfolioSchedulePerformanceIndexSPI: number;
  activeClaimsTotalExposure: number;
}

// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 17: COMPLIANCE, RISK & AUDIT
// Type Definitions (17.01 - 17.08)
// ==========================================

export type ComplianceStatus = 'COMPLIANT' | 'WARNING' | 'NON_COMPLIANT' | 'UNDER_REVIEW' | 'PENDING_RENEWAL';
export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type RiskCategory = 'STRATEGIC' | 'FINANCIAL' | 'OPERATIONAL' | 'CYBER_SECURITY' | 'LEGAL_REGULATORY';
export type ControlType = 'PREVENTATIVE' | 'DETECTIVE' | 'CORRECTIVE';
export type ControlFrequency = 'CONTINUOUS' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
export type AuditStatus = 'PLANNED' | 'IN_PROGRESS' | 'FIELDWORK_COMPLETE' | 'REPORT_ISSUED' | 'CLOSED';
export type FindingSeverity = 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';
export type FindingStatus = 'OPEN' | 'UNDER_REMEDIATION' | 'READY_FOR_RETEST' | 'VERIFIED_CLOSED' | 'MANAGEMENT_ACCEPTED';
export type PBCStatus = 'REQUESTED' | 'IN_PREPARATION' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED';
export type RedFlagType = 'DUPLICATE_PAYMENT' | 'SPLIT_PO' | 'DORMANT_VENDOR' | 'AFTER_HOURS_TX' | 'BENFORD_ANOMALY' | 'SOD_CONFLICT';

// ----------------------------------------------------
// 17.01 REGULATORY COMPLIANCE
// ----------------------------------------------------
export interface RegulatoryRequirement {
  id: string;
  code: string;
  authority: string; // e.g. Ministry of Commerce, Industry & Investment Promotion (MOCIIP), Tax Authority Oman, Ministry of Labour
  jurisdiction: string;
  title: string;
  category: 'LABOUR_LAW' | 'COMMERCIAL_COMPANIES' | 'ENVIRONMENTAL' | 'DATA_PRIVACY' | 'HEALTH_SAFETY' | 'FINANCIAL_CRIME';
  description: string;
  complianceLead: string;
  department: string;
  penaltyClause: string;
  frequency: 'CONTINUOUS' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'EVENT_DRIVEN';
  status: ComplianceStatus;
  lastReviewDate: string;
  nextReviewDate: string;
  complianceScore: number; // 0-100%
  evidenceDocuments: string[];
}

export interface ComplianceCalendarEvent {
  id: string;
  title: string;
  category: string;
  authority: string;
  dueDate: string;
  status: 'PENDING' | 'SUBMITTED' | 'OVERDUE' | 'APPROVED';
  assignedTo: string;
  reminderDaysBefore: number;
  statutoryReference: string;
  estimatedEffortHours: number;
  actualSubmissionDate?: string;
  filingReferenceNo?: string;
}

export interface ComplianceScorecard {
  department: string;
  totalRequirements: number;
  compliantCount: number;
  warningCount: number;
  breachCount: number;
  healthPercentage: number;
  lastAuditDate: string;
  leadOwner: string;
}

// ----------------------------------------------------
// 17.02 TAX COMPLIANCE
// ----------------------------------------------------
export interface VATComplianceRecord {
  id: string;
  period: string; // e.g., '2026-Q1'
  invoiceNumber: string;
  invoiceDate: string;
  partyName: string;
  partyVatTin: string;
  taxableAmountOMR: number;
  vatRate: number; // 5%
  vatAmountOMR: number;
  direction: 'OUTPUT_VAT' | 'INPUT_VAT';
  qrCodeValidated: boolean;
  cryptographicHashValid: boolean;
  reverseChargeApplicable: boolean;
  complianceFlag: 'PASS' | 'EXEMPTION_VERIFIED' | 'FLAGGED_DISCREPANCY';
  notes: string;
}

export interface TaxScheduleItem {
  id: string;
  taxYear: string;
  scheduleCode: string;
  description: string;
  accountingBasisOMR: number;
  taxAdjustmentsOMR: number;
  taxableBasisOMR: number;
  taxRatePercent: number; // 15% Standard Corporate Tax
  taxLiabilityOMR: number;
  status: 'DRAFT' | 'AUDITED' | 'SUBMITTED' | 'ACCEPTED_BY_AUTHORITY';
  preparedBy: string;
  reviewedBy: string;
}

export interface StatutoryTaxReturn {
  id: string;
  returnType: 'CORPORATE_INCOME_TAX' | 'VAT_DECLARATION' | 'WITHHOLDING_TAX' | 'CUSTOMS_EXCISE';
  period: string;
  filingDeadline: string;
  submissionDate?: string;
  acknowledgementNumber?: string;
  netTaxPayableOMR: number;
  paymentStatus: 'UNPAID' | 'PAID' | 'REFUND_DUE';
  paymentReference?: string;
  status: 'DRAFT' | 'APPROVED_BY_CFO' | 'SUBMITTED' | 'AUTHORITY_ACCEPTED';
  attachments: string[];
}

export interface StatutoryReportPackage {
  id: string;
  reportName: string;
  regulatoryBody: 'CENTRAL_BANK_OMAN' | 'MOCIIP' | 'NCSI' | 'MOL_OMANISATION';
  submissionFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  reportingPeriod: string;
  dueDate: string;
  status: 'PREPARED' | 'SUBMITTED' | 'ACKNOWLEDGED';
  submissionChannel: 'PORTAL_API' | 'MANUAL_DEPOSIT' | 'SECURE_EMAIL';
  signedBy: string;
}

// ----------------------------------------------------
// 17.03 INTERNAL CONTROLS (COSO & SoD)
// ----------------------------------------------------
export interface ControlActivity {
  id: string;
  code: string; // e.g., 'CTRL-P2P-01'
  processArea: 'PROCURE_TO_PAY' | 'ORDER_TO_CASH' | 'RECORD_TO_REPORT' | 'HIRE_TO_RETIRE' | 'FIXED_ASSETS' | 'TREASURY';
  controlName: string;
  controlObjective: string;
  controlType: ControlType;
  frequency: ControlFrequency;
  ownerRole: string;
  automatedOrManual: 'AUTOMATED' | 'MANUAL' | 'IT_DEPENDENT_MANUAL';
  keyControl: boolean;
  status: 'EFFECTIVE' | 'DEFICIENT' | 'NOT_TESTED';
  lastTestedDate: string;
  testResult: 'PASS' | 'FAIL' | 'INCONCLUSIVE';
}

export interface ApprovalControlRule {
  id: string;
  ruleCode: string;
  workflowName: string;
  thresholdMinOMR: number;
  thresholdMaxOMR: number;
  requiredApprovers: string[];
  allowsSelfApproval: boolean;
  emergencyBypassAllowed: boolean;
  activeViolationsCount: number;
  status: 'ACTIVE' | 'AUDIT_PAUSED';
}

export interface SoDConflictRule {
  id: string;
  ruleCode: string;
  conflictTitle: string;
  incompatibleRoleA: string;
  incompatibleRoleB: string;
  riskDescription: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  activeViolations: {
    userId: string;
    userName: string;
    department: string;
    assignedRoles: string[];
    mitigatingControl?: string;
    exceptionApprovedBy?: string;
  }[];
}

export interface ControlTestRecord {
  id: string;
  controlCode: string;
  testPeriod: string;
  testerName: string;
  sampleSize: number;
  exceptionsIdentified: number;
  testConclusion: 'OPERATING_EFFECTIVELY' | 'SIGNIFICANT_DEFICIENCY' | 'MATERIAL_WEAKNESS';
  walkthroughNotes: string;
  workpaperReference: string;
  completedDate: string;
}

// ----------------------------------------------------
// 17.04 RISK MANAGEMENT (ERM Matrix & Heatmap)
// ----------------------------------------------------
export interface RiskItem {
  id: string;
  code: string; // e.g. 'RSK-OPS-04'
  title: string;
  category: RiskCategory;
  description: string;
  riskOwner: string;
  department: string;
  
  // Inherent Risk
  inherentLikelihood: number; // 1 - 5
  inherentImpact: number; // 1 - 5
  inherentScore: number; // Likelihood * Impact (1 - 25)
  inherentLevel: RiskLevel;
  
  // Residual Risk (after controls & mitigation)
  residualLikelihood: number; // 1 - 5
  residualImpact: number; // 1 - 5
  residualScore: number; // Likelihood * Impact (1 - 25)
  residualLevel: RiskLevel;

  financialExposureOMR: number;
  riskAppetiteStatus: 'WITHIN_APPETITE' | 'EXCEEDS_APPETITE';
  mitigationStrategy: 'TREAT' | 'TRANSFER' | 'TERMINATE' | 'TOLERATE';
  mitigationPlanSummary: string;
  kriIndicators: { name: string; threshold: string; currentValue: string; status: 'GREEN' | 'AMBER' | 'RED' }[];
  status: 'ACTIVE' | 'CLOSED' | 'EMERGING';
  lastAssessedDate: string;
}

// ----------------------------------------------------
// 17.05 INTERNAL AUDIT
// ----------------------------------------------------
export interface AuditPlanEngagement {
  id: string;
  auditCode: string;
  engagementTitle: string;
  auditUniverseArea: string;
  auditType: 'FINANCIAL' | 'OPERATIONAL' | 'COMPLIANCE' | 'IT_CYBER' | 'SPECIAL_INVESTIGATION';
  plannedQuarter: 'Q1 2026' | 'Q2 2026' | 'Q3 2026' | 'Q4 2026';
  leadAuditor: string;
  budgetDays: number;
  actualDays: number;
  status: AuditStatus;
  riskWeighting: 'HIGH' | 'MEDIUM' | 'LOW';
  committeeApprovalDate: string;
}

export interface AuditProgramStep {
  id: string;
  engagementId: string;
  stepNumber: string;
  objective: string;
  procedureDescription: string;
  samplingMethod: 'RANDOM' | 'STRATIFIED_MONETARY' | '100%_POPULATION' | 'JUDGMENTAL';
  sampleSize: number;
  completedBy?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  findingsCount: number;
}

export interface AuditFinding {
  id: string;
  findingCode: string; // e.g. 'AUD-2026-F01'
  engagementId: string;
  engagementTitle: string;
  title: string;
  severity: FindingSeverity;
  category: 'INTERNAL_CONTROL' | 'POLICY_BREACH' | 'FINANCIAL_REPORTING' | 'ASSET_SAFEGUARD' | 'STATUTORY';
  condition: string; // What was found
  criteria: string; // Standard / Policy violated
  cause: string; // Root cause
  consequence: string; // Financial / Operational impact
  recommendation: string;
  managementResponse: string;
  actionOwner: string;
  targetClosureDate: string;
  status: FindingStatus;
  retestEvidence?: string;
}

// ----------------------------------------------------
// 17.06 EXTERNAL AUDIT (PBC Requests & Defense)
// ----------------------------------------------------
export interface ExternalAuditorProfile {
  id: string;
  firmName: string; // e.g., 'KPMG Oman / PwC Oman / Deloitte / EY'
  leadPartner: string;
  auditManager: string;
  fiscalYearUnderAudit: string;
  engagementLetterSignedDate: string;
  auditFeeAgreedOMR: number;
  auditInterimDate: string;
  auditFinalDate: string;
  status: 'ENGAGED' | 'FIELDWORK' | 'REPORTING' | 'COMPLETED';
}

export interface ExternalPBCRequest {
  id: string;
  pbcNumber: string; // e.g. 'PBC-GL-001'
  auditorId: string;
  financialArea: 'CASH_BANK' | 'REVENUE_AR' | 'EXPENSE_AP' | 'FIXED_ASSETS' | 'PAYROLL' | 'TAX_VAT' | 'LEGAL_CONTINGENCIES';
  itemDescription: string;
  requestedFormat: 'EXCEL_SCHEDULE' | 'PDF_CONTRACTS' | 'BANK_CERTIFICATES' | 'SYSTEM_EXTRACT';
  requestedDate: string;
  dueDate: string;
  assignedTeam: string;
  assignedPerson: string;
  status: PBCStatus;
  fileAttachment?: string;
  auditorRemarks?: string;
}

export interface ExternalAuditQueryResponse {
  id: string;
  queryNumber: string;
  pbcReference: string;
  auditorQuery: string;
  managementDraftResponse: string;
  cfoApprovedResponse?: string;
  supportingDocuments: string[];
  status: 'DRAFT' | 'REVIEWED_BY_CONTROLLER' | 'APPROVED_BY_CFO' | 'DELIVERED_TO_AUDITOR';
  deliveredDate?: string;
}

// ----------------------------------------------------
// 17.07 CORRECTIVE ACTIONS & REMEDIATION (CAPA)
// ----------------------------------------------------
export interface CorrectiveActionItem {
  id: string;
  capaCode: string; // e.g. 'CAPA-2026-08'
  sourceType: 'INTERNAL_AUDIT' | 'EXTERNAL_AUDIT' | 'REGULATORY_INSPECTION' | 'FRAUD_INVESTIGATION' | 'SOX_CONTROL_FAIL';
  sourceFindingReference: string;
  findingSummary: string;
  severity: FindingSeverity;
  rootCauseCategory: 'PROCESS_GAP' | 'SYSTEM_LIMITATION' | 'PEOPLE_TRAINING' | 'AUTHORIZATION_OVERRIDE';
  remediationPlan: string;
  operationalLead: string;
  department: string;
  targetDueDate: string;
  completionPercentage: number; // 0-100%
  milestones: { title: string; targetDate: string; completed: boolean }[];
  status: 'IN_PROGRESS' | 'COMPLETED_PENDING_RETEST' | 'VERIFIED_CLOSED' | 'OVERDUE';
  closureSignoffBy?: string;
  closureSignoffDate?: string;
  closureNotes?: string;
}

// ----------------------------------------------------
// 17.08 FRAUD & COMPLIANCE MONITORING
// ----------------------------------------------------
export interface FraudRedFlagAlert {
  id: string;
  alertCode: string;
  alertType: RedFlagType;
  detectionTimestamp: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  transactionReference: string;
  amountOMR?: number;
  entityInvolved: string; // Vendor name, Employee name, or Account
  anomalyDescription: string;
  aiRiskScore: number; // 0-100
  aiSuggestedAction: string;
  investigationStatus: 'NEW' | 'UNDER_INVESTIGATION' | 'FALSE_POSITIVE' | 'ESCALATED_TO_AUDIT_COMMITTEE' | 'RESOLVED';
  investigatorNotes?: string;
}

export interface BenfordAnalysisItem {
  leadingDigit: number; // 1 through 9
  observedCount: number;
  observedPercent: number;
  expectedBenfordPercent: number; // 30.1%, 17.6%, 12.5%, 9.7%, 7.9%, 6.7%, 5.8%, 5.1%, 4.6%
  variancePercent: number;
  isAnomaly: boolean;
}

export interface PolicyDeclaration {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  policyType: 'CODE_OF_CONDUCT' | 'GIFT_HOSPITALITY' | 'CONFLICT_OF_INTEREST' | 'ANTI_BRIBERY';
  declarationYear: string;
  signedDate: string;
  disclosuresMade: boolean;
  disclosureDetails?: string;
  complianceApproved: boolean;
}

export interface DocumentRetentionRule {
  id: string;
  recordCategory: string;
  regulatoryMandate: string; // e.g., Oman Commercial Law (Article 18) - 10 Years
  mandatoryRetentionYears: number;
  storageFormat: 'IMMUTABLE_DIGITAL_ARCHIVE' | 'PHYSICAL_FIREPROOF_VAULT' | 'HYBRID';
  autoPurgeEligible: boolean;
  legalHoldActive: boolean;
  totalArchivedRecordsCount: number;
}

// Global Compliance Executive Overview
export interface ComplianceExecutiveMetrics {
  overallComplianceScore: number; // 0-100%
  totalRegulatoryObligations: number;
  compliantCount: number;
  imminentDeadlinesCount: number;
  openAuditFindingsCount: number;
  highRiskCount: number;
  activeFraudAlertsCount: number;
  sodViolationsCount: number;
  pbcFulfillmentRate: number; // 0-100%
}

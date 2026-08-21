// ==========================================
// ARTIFY ERP — MODULE 14: QUALITY MANAGEMENT (QMS)
// Comprehensive TypeScript Definitions
// ==========================================

export type SeverityLevel = 'CRITICAL' | 'MAJOR' | 'MINOR' | 'OBSERVATION';

export type ComplianceStatus = 'COMPLIANT' | 'NEEDS_REVIEW' | 'NON_COMPLIANT' | 'OBSOLETE';

export type InspectionStatus = 'PENDING' | 'IN_PROGRESS' | 'PASSED' | 'REJECTED' | 'QUARANTINED' | 'CONDITIONALLY_PASSED';

export type InspectionType = 'INCOMING' | 'IN_PROCESS' | 'FINAL' | 'LAB_TESTING';

export type NCRStatus = 'DRAFT' | 'OPEN' | 'CONTAINMENT_ACTIVE' | 'MRB_REVIEW' | 'DISPOSITIONED' | 'CLOSED' | 'REJECTED';

export type MRBDisposition = 'REWORK' | 'SCRAP' | 'USE_AS_IS' | 'RETURN_TO_VENDOR' | 'CONCESSION' | 'PENDING';
export type MrbDisposition = MRBDisposition;

export type CAPAStatus = 'INITIATED' | 'ROOT_CAUSE_ANALYSIS' | 'ACTION_PLANNING' | 'IMPLEMENTATION' | 'EFFECTIVENESS_VERIFICATION' | 'CLOSED' | 'OVERDUE';

export type CAPAType = 'CORRECTIVE' | 'PREVENTIVE' | 'AUDIT_FINDING' | 'CUSTOMER_COMPLAINT' | 'SUPPLIER_SCAR';

export type AuditType = 'INTERNAL_ISO' | 'SUPPLIER_AUDIT' | 'THIRD_PARTY_REGISTRAR' | 'PROCESS_AUDIT' | 'CUSTOMER_AUDIT';

export type AuditStatus = 'PLANNED' | 'IN_PROGRESS' | 'REPORT_SUBMITTED' | 'FINDINGS_OPEN' | 'CLOSED';

export type EightDStage =
  | 'D1_TEAM'
  | 'D2_PROBLEM_DESCRIPTION'
  | 'D2_PROBLEM_STATEMENT'
  | 'D3_CONTAINMENT'
  | 'D4_ROOT_CAUSE'
  | 'D5_CORRECTIVE_ACTIONS'
  | 'D5_PERMANENT_CORRECTIVE_ACTIONS'
  | 'D6_IMPLEMENT_VALIDATE'
  | 'D6_VALIDATE_IMPLEMENTATION'
  | 'D7_PREVENT_RECURRENCE'
  | 'D8_CLOSURE_RECOGNITION'
  | 'D8_RECOGNIZE_TEAM';

// ==========================================
// 14.01 QUALITY STANDARDS & SPECIFICATIONS
// ==========================================

export interface QualityStandard {
  id: string;
  code: string; // e.g. "STD-ISO-9001-2015"
  name: string;
  category: 'ISO' | 'ASTM' | 'API' | 'GMP' | 'INTERNAL_SOP' | 'CUSTOMER_SPEC';
  version: string;
  effectiveDate: string;
  reviewCycleMonths: number;
  nextReviewDate: string;
  ownerDepartment: string;
  status: ComplianceStatus;
  clausesCount: number;
  description: string;
  certificationBody?: string;
  certificateExpiry?: string;
}

export interface QualityPolicy {
  id: string;
  code: string; // e.g. "POL-QMS-001"
  title: string;
  scope: string;
  targetObjective: string;
  currentScorePct: number;
  approvedBy: string;
  approvalDate: string;
  revisionNumber: string;
  mandatoryDepartments: string[];
  status: 'ACTIVE' | 'UNDER_REVISION' | 'ARCHIVED';
}

export interface SpecParameter {
  id: string;
  name: string; // e.g. "Tensile Strength", "Moisture Content", "Outer Diameter"
  unit: string; // e.g. "MPa", "%", "mm"
  targetNominal: number;
  lowerSpecLimit: number; // LSL
  upperSpecLimit: number; // USL
  toleranceType: 'BILATERAL' | 'UNILATERAL_MIN' | 'UNILATERAL_MAX';
  testMethod: string; // e.g. "ASTM D638", "Visual inspection at 10x"
  criticality: 'CRITICAL_TO_QUALITY' | 'MAJOR' | 'STANDARD';
}

export interface QualitySpecification {
  id: string;
  code: string; // e.g. "SPEC-STL-GRADE-A36"
  itemCode: string;
  itemName: string;
  category: 'RAW_MATERIAL' | 'SEMI_FINISHED' | 'FINISHED_GOODS' | 'PACKAGING';
  revision: string;
  effectiveDate: string;
  parameters: SpecParameter[];
  samplingStandard: string; // e.g. "ISO 2859-1 Level II"
  aqlLevel: string; // e.g. "0.65 Normal"
  approvedBy: string;
  status: 'ACTIVE' | 'DRAFT' | 'REVISED';
}

// ==========================================
// 14.02 QUALITY PLANNING
// ==========================================

export interface QualityPlan {
  id: string;
  code: string; // e.g. "QP-PROJ-LNG-2024"
  projectNameOrProduct: string;
  controlPlanType: 'PROTOTYPE' | 'PRE_LAUNCH' | 'MASS_PRODUCTION' | 'PROJECT_SPECIFIC';
  version: string;
  stagesCount: number;
  holdPointsCount: number;
  leadQualityEngineer: string;
  effectiveDate: string;
  approvalStatus: 'APPROVED' | 'DRAFT' | 'PENDING_CUSTOMER_APPROVAL';
  stages: {
    stageNumber: number;
    operationName: string;
    inspectionType: InspectionType;
    isHoldPoint: boolean; // Production cannot proceed without QA stamp
    sampleSizeRule: string;
    responsibleRole: string;
  }[];
}

export interface InspectionPlan {
  id: string;
  code: string; // e.g. "IP-INCOMING-VALVES"
  title: string;
  targetCategory: string;
  inspectionType: InspectionType;
  mandatoryGauges: string[];
  frequency: '100_PERCENT' | 'BATCH_SAMPLING' | 'FIRST_LAST_PIECE' | 'HOURLY_PATROL';
  sampleSizeFormula: string;
  criteriaSummary: string;
  isActive: boolean;
}

export interface ChecklistItem {
  id: string;
  checkpoint: string;
  specificationRequirement: string;
  measurementType: 'PASS_FAIL' | 'NUMERIC_VALUE' | 'VISUAL_RATING';
  unit?: string;
  minValue?: number;
  maxValue?: number;
  actualValue?: number;
  actualResult?: 'PASS' | 'FAIL' | 'N/A';
  notes?: string;
}

export interface QualityChecklist {
  id: string;
  code: string; // e.g. "CHK-LINE-CLEARANCE-01"
  title: string;
  department: string;
  workCenter: string;
  revision: string;
  items: ChecklistItem[];
  inspectorName?: string;
  supervisorSignoff?: boolean;
}

export interface SamplingPlan {
  id: string;
  standard: 'MIL-STD-105E' | 'ISO-2859-1' | 'ZERO_ACCEPTANCE_C0';
  inspectionLevel: 'I' | 'II' | 'III' | 'S-1' | 'S-2' | 'S-3' | 'S-4';
  lotSizeMin: number;
  lotSizeMax: number;
  sampleCodeLetter: string;
  sampleSize: number;
  aqlPercent: number; // e.g. 0.65, 1.0, 2.5, 4.0
  acceptanceNumberAc: number; // e.g. 0
  rejectionNumberRe: number; // e.g. 1
  samplingType: 'NORMAL' | 'TIGHTENED' | 'REDUCED';
}

// ==========================================
// 14.03 INSPECTION & TESTING
// ==========================================

export interface InspectionRecord {
  id: string;
  inspectionNumber: string; // e.g. "INSP-2024-0089"
  type: InspectionType;
  lotNumber: string;
  batchSize: number;
  sampleSize: number;
  itemCode: string;
  itemName: string;
  vendorOrWorkCenter: string;
  grnOrJobOrderRef: string;
  inspectionDate: string;
  inspectorName: string;
  status: InspectionStatus;
  defectsFound: number;
  criticalDefects: number;
  majorDefects: number;
  minorDefects: number;
  certificateOfAnalysisAttached: boolean;
  coaNumber?: string;
  measurements: {
    parameter: string;
    nominal: number;
    lsl: number;
    usl: number;
    recordedValues: number[];
    average: number;
    isWithinTolerance: boolean;
  }[];
  remarks: string;
  dispositionAction?: string;
}

export interface MaterialTestReport {
  id: string;
  reportNumber: string; // e.g. "MTR-LAB-2024-0412"
  heatNumber: string;
  materialGrade: string; // e.g. "SS316L", "ASTM A106 Gr. B"
  sampleOrigin: string;
  testStandard: string; // e.g. "ASTM E8 / E8M"
  testingLab: 'INTERNAL_METALLURGY_LAB' | 'THIRD_PARTY_SGS' | 'TUV_SUD' | 'BUREAU_VERITAS';
  testDate: string;
  tensileStrengthMpa: number;
  yieldStrengthMpa: number;
  elongationPct: number;
  hardnessHrc: number;
  chemicalComposition: {
    element: string; // C, Mn, Si, Cr, Ni, Mo, S, P
    observedPct: number;
    minLimitPct: number;
    maxLimitPct: number;
    isCompliant: boolean;
  }[];
  verdict: 'CONFORMING' | 'NON_CONFORMING';
  certifiedBy: string;
}

// ==========================================
// 14.04 NON-CONFORMANCE (NCR)
// ==========================================

export interface NonConformanceReport {
  id: string;
  ncrNumber: string; // e.g. "NCR-2024-0034"
  title: string;
  severity: SeverityLevel;
  source?: 'INCOMING_INSPECTION' | 'IN_PROCESS' | 'FINAL_INSPECTION' | 'CUSTOMER_RETURN' | 'INTERNAL_AUDIT' | string;
  origin?: 'INCOMING_INSPECTION' | 'IN_PROCESS' | 'FINAL_INSPECTION' | 'CUSTOMER_RETURN' | 'INTERNAL_AUDIT' | string;
  referenceDoc?: string; // PO/GRN/Job Order
  itemCode: string;
  itemName: string;
  supplierOrDepartment?: string;
  vendorOrDepartment?: string;
  lotNumber: string;
  quantityAffected: number;
  unitOfMeasure?: string;
  unit?: string;
  defectCategory: 'DIMENSIONAL' | 'SURFACE_FINISH' | 'CHEMICAL_SPEC' | 'PACKAGING' | 'CONTAMINATION' | 'WELDING_DEFECT' | 'DOCUMENTATION' | string;
  defectDescription: string;
  reportedDate?: string;
  dateRaised?: string;
  reportedBy?: string;
  raisedBy?: string;
  status: NCRStatus | string;
  quarantineLocation?: string;
  quarantineTagId?: string;
  containmentAction?: string;
  containmentImplementedDate?: string;
  mrbDisposition?: MRBDisposition;
  disposition?: MRBDisposition;
  mrbMembers?: string[];
  mrbDecisionNotes?: string;
  reworkCostEstimated?: number;
  reworkHoursEstimated?: number;
  scrapCostEstimated?: number;
  financialImpactCopq?: number; // Cost of Poor Quality
  associatedCapaId?: string;
  capaRequired?: boolean;
  closedDate?: string;
  mrbSignatures?: {
    qualityApproved: boolean;
    engineeringApproved: boolean;
    operationsApproved: boolean;
  };
}

export interface DefectClassification {
  code: string;
  name: string;
  category: string;
  standardSeverity: SeverityLevel;
  frequencyLast90Days: number;
  avgCostPerOccurrence: number;
}

// ==========================================
// 14.05 CORRECTIVE & PREVENTIVE ACTIONS (CAPA)
// ==========================================

export interface EightDStep {
  step: 'D1_TEAM' | 'D2_PROBLEM_DESCRIPTION' | 'D3_CONTAINMENT' | 'D4_ROOT_CAUSE' | 'D5_CORRECTIVE_ACTIONS' | 'D6_IMPLEMENT_VALIDATE' | 'D7_PREVENT_RECURRENCE' | 'D8_CLOSURE_RECOGNITION';
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  completedDate?: string;
  owner: string;
}

export interface FishboneBranch {
  category: 'MANPOWER' | 'MACHINERY' | 'MATERIAL' | 'METHOD' | 'MEASUREMENT' | 'ENVIRONMENT';
  causes: string[];
}

export interface FiveWhyAnalysis {
  problemStatement: string;
  why1: string;
  why2: string;
  why3: string;
  why4: string;
  why5RootCause: string;
}

export interface CAPARecord {
  id: string;
  capaNumber: string; // e.g. "CAPA-2024-0012"
  title: string;
  type: CAPAType;
  sourceType?: string;
  sourceNcrNumber?: string;
  linkedNcrId?: string;
  initiator?: string;
  assignedChampion?: string;
  championName?: string;
  department?: string;
  targetCompletionDate?: string;
  targetResolutionDate?: string;
  actualCompletionDate?: string;
  status: CAPAStatus | string;
  riskPriorityNumberRpn?: number; // Severity * Occurrence * Detection (1-1000)
  currentEightDStage?: EightDStage | string;
  problemStatement?: string;
  d1Team?: string[];
  d2ProblemStatement?: string;
  d3ContainmentAction?: string;
  d4RootCauseSummary?: string;
  d5PermanentCorrectiveAction?: string;
  d6ValidationResults?: string;
  d7PreventiveSystemChanges?: string;
  d8ClosureNotes?: string;
  fiveWhy?: FiveWhyAnalysis;
  fiveWhys?: { whyNumber: number; question: string; answer: string }[];
  fishbone?: FishboneBranch[];
  ishikawaCategories?: { category: string; causes: string[] }[];
  eightDSteps?: EightDStep[];
  actionItems?: {
    id: string;
    task: string;
    assignee: string;
    dueDate: string;
    completed: boolean;
  }[];
  effectivenessVerificationDate?: string;
  effectivenessResult?: 'EFFECTIVE_RECURRENCE_PREVENTED' | 'INEFFECTIVE_REOPENED';
  verifiedBy?: string;
}

export type CapaRecord = CAPARecord;

export interface FMEARiskEntry {
  id: string;
  processStep: string;
  potentialFailureMode: string;
  potentialEffect?: string;
  potentialEffectOfFailure?: string;
  severityScore?: number; // 1-10
  severityScoreS?: number;
  potentialCause?: string;
  occurrenceScore?: number; // 1-10
  occurrenceScoreO?: number;
  currentControls?: string;
  detectionScore?: number; // 1-10
  detectionScoreD?: number;
  calculatedRpn?: number; // Severity * Occurrence * Detection
  riskPriorityNumberRpn?: number;
  mitigationAction?: string;
  recommendedMitigationAction?: string;
  recommendedAction?: string;
  revisedRpn?: number;
  status?: string;
}

export type FmeaItem = FMEARiskEntry;

// ==========================================
// 14.06 QUALITY AUDIT, SUPPLIER QUALITY & KPIS
// ==========================================

export interface AuditFinding {
  id?: string;
  findingId?: string;
  clauseReference: string; // e.g. "ISO 9001:2015 Clause 8.4"
  findingType?: 'MAJOR_NC' | 'MINOR_NC' | 'OBSERVATION' | 'OPPORTUNITY_FOR_IMPROVEMENT';
  severity?: 'MAJOR' | 'MINOR' | 'OBSERVATION' | 'OFI' | string;
  description: string;
  evidence?: string;
  assignedActionee?: string;
  dueDate?: string;
  correctiveActionDeadline?: string;
  capaReference?: string;
  isClosed: boolean;
}

export interface QualityAudit {
  id: string;
  auditNumber: string; // e.g. "AUD-2024-0015"
  title?: string;
  type?: AuditType | string;
  auditType?: AuditType | string;
  standardReference?: string; // e.g. "ISO 9001:2015"
  standardScope?: string;
  auditedDepartmentOrSupplier?: string;
  targetDepartmentOrVendor?: string;
  leadAuditor: string;
  auditDate: string;
  closingMeetingDate?: string;
  closureTargetDate?: string;
  status: AuditStatus | string;
  findings?: AuditFinding[];
  findingsList?: AuditFinding[];
  scorePct?: number;
  auditSummary?: string;
  executiveSummary?: string;
  majorNonConformances?: number;
  minorNonConformances?: number;
  opportunitiesForImprovement?: number;
}

export interface SupplierQualityScorecard {
  id?: string;
  supplierId?: string;
  vendorCode?: string;
  supplierName?: string;
  vendorName?: string;
  category?: string;
  vendorTier?: 'STRATEGIC_A' | 'APPROVED_B' | 'CONDITIONAL_C' | 'RESTRICTED' | string;
  qualificationStatus?: 'CERTIFIED_PREFERRED' | 'APPROVED' | 'PROBATIONARY' | 'RESTRICTED' | string;
  lotsReceivedTotal?: number;
  lotsReceivedCount?: number;
  lotsAccepted?: number;
  lotsRejected?: number;
  lotsRejectedCount?: number;
  acceptanceRatePct?: number;
  defectPpm?: number; // Parts Per Million
  inboundPpm?: number;
  openNcrCount?: number;
  openScarCount?: number; // Supplier Corrective Action Requests
  overallQualityRatingScore?: number; // 0-100
  overallRatingPercent?: number;
  onTimeDeliveryPercent?: number;
  lastAuditScore?: number;
  isoCertified?: boolean;
  lastAuditDate?: string;
}

export interface QualityCertificate {
  id: string;
  certNumber?: string;
  certificateNumber?: string;
  title: string;
  certType?: 'COA_ANALYSIS' | 'COC_CONFORMANCE' | 'CALIBRATION_GAUGE' | 'ISO_CERTIFICATE' | 'MILL_TEST_CERT' | string;
  type?: string;
  entityReference?: string; // Item, Equipment, or Supplier
  issueDate?: string;
  issuedDate?: string;
  expiryDate?: string;
  issuingAuthority?: string;
  documentRefNumber?: string;
  isValid?: boolean;
  status?: string;
}

export interface QualityKPIs {
  firstPassYieldPct: number;
  overallRejectionRatePct: number;
  openNcrCount: number;
  activeCapasCount: number;
  supplierDefectPpm: number;
  costOfPoorQualityCopq: number;
  costOfPoorQualityPct?: number;
  cpkProcessCapability: number;
  auditCompliancePct: number;
  supplierQualityIndexScore?: number;
  customerReturnRatePpm?: number;
}

export interface QualityAIInsight {
  id: string;
  type: 'ALERT' | 'ROOT_CAUSE' | 'PREDICTION' | 'OPTIMIZATION';
  title: string;
  description: string;
  recommendedAction: string;
  relatedEntity: string;
  confidenceScore: number;
}

// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 17: COMPLIANCE, RISK & AUDIT
// Store & Enterprise State Management
// ==========================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  RegulatoryRequirement,
  ComplianceCalendarEvent,
  ComplianceScorecard,
  VATComplianceRecord,
  TaxScheduleItem,
  StatutoryTaxReturn,
  StatutoryReportPackage,
  ControlActivity,
  ApprovalControlRule,
  SoDConflictRule,
  ControlTestRecord,
  RiskItem,
  RiskLevel,
  AuditPlanEngagement,
  AuditProgramStep,
  AuditFinding,
  ExternalAuditorProfile,
  ExternalPBCRequest,
  ExternalAuditQueryResponse,
  CorrectiveActionItem,
  FraudRedFlagAlert,
  BenfordAnalysisItem,
  PolicyDeclaration,
  DocumentRetentionRule,
  ComplianceExecutiveMetrics
} from '../types';

interface ComplianceContextType {
  // 17.01 Regulatory Compliance
  regulatoryRequirements: RegulatoryRequirement[];
  calendarEvents: ComplianceCalendarEvent[];
  scorecards: ComplianceScorecard[];
  addRegulatoryRequirement: (req: Omit<RegulatoryRequirement, 'id'>) => void;
  updateRegulatoryRequirement: (id: string, updates: Partial<RegulatoryRequirement>) => void;
  addCalendarEvent: (event: Omit<ComplianceCalendarEvent, 'id'>) => void;
  updateCalendarEvent: (id: string, updates: Partial<ComplianceCalendarEvent>) => void;

  // 17.02 Tax Compliance
  vatRecords: VATComplianceRecord[];
  taxSchedules: TaxScheduleItem[];
  statutoryTaxReturns: StatutoryTaxReturn[];
  statutoryReports: StatutoryReportPackage[];
  addVatRecord: (record: Omit<VATComplianceRecord, 'id'>) => void;
  updateTaxReturnStatus: (id: string, status: StatutoryTaxReturn['status'], paymentRef?: string) => void;
  addTaxSchedule: (sched: Omit<TaxScheduleItem, 'id'>) => void;

  // 17.03 Internal Controls
  controlActivities: ControlActivity[];
  approvalRules: ApprovalControlRule[];
  sodRules: SoDConflictRule[];
  controlTests: ControlTestRecord[];
  addControlActivity: (ctrl: Omit<ControlActivity, 'id'>) => void;
  recordControlTest: (test: Omit<ControlTestRecord, 'id'>) => void;
  updateApprovalRule: (id: string, updates: Partial<ApprovalControlRule>) => void;
  resolveSodViolation: (ruleId: string, userId: string, mitigatingControl: string, approvedBy: string) => void;

  // 17.04 Risk Management
  riskItems: RiskItem[];
  addRiskItem: (risk: Omit<RiskItem, 'id' | 'inherentScore' | 'residualScore'>) => void;
  updateRiskItem: (id: string, updates: Partial<RiskItem>) => void;

  // 17.05 Internal Audit
  auditEngagements: AuditPlanEngagement[];
  auditPrograms: AuditProgramStep[];
  auditFindings: AuditFinding[];
  addAuditEngagement: (engagement: Omit<AuditPlanEngagement, 'id'>) => void;
  addAuditFinding: (finding: Omit<AuditFinding, 'id'>) => void;
  updateAuditFinding: (id: string, updates: Partial<AuditFinding>) => void;

  // 17.06 External Audit
  auditorProfiles: ExternalAuditorProfile[];
  pbcRequests: ExternalPBCRequest[];
  auditResponses: ExternalAuditQueryResponse[];
  updatePbcStatus: (id: string, status: ExternalPBCRequest['status'], fileAttachment?: string) => void;
  addAuditQueryResponse: (resp: Omit<ExternalAuditQueryResponse, 'id'>) => void;
  updateAuditQueryResponse: (id: string, updates: Partial<ExternalAuditQueryResponse>) => void;

  // 17.07 Corrective Actions
  correctiveActions: CorrectiveActionItem[];
  addCorrectiveAction: (action: Omit<CorrectiveActionItem, 'id'>) => void;
  updateCorrectiveAction: (id: string, updates: Partial<CorrectiveActionItem>) => void;
  verifyAndCloseCapa: (id: string, signoffBy: string, notes: string) => void;

  // 17.08 Fraud & Compliance Monitoring
  fraudAlerts: FraudRedFlagAlert[];
  benfordData: BenfordAnalysisItem[];
  policyDeclarations: PolicyDeclaration[];
  retentionRules: DocumentRetentionRule[];
  updateFraudAlertStatus: (id: string, status: FraudRedFlagAlert['investigationStatus'], notes?: string) => void;
  runAiAnomalyScan: () => void;
  isAiScanning: boolean;

  // Metrics
  metrics: ComplianceExecutiveMetrics;
}

const ComplianceContext = createContext<ComplianceContextType | undefined>(undefined);

const STORAGE_KEY = 'ARTIFY_ERP_MODULE_17_COMPLIANCE_STATE_V1';

export const ComplianceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ----------------------------------------------------
  // INITIAL SEED DATA
  // ----------------------------------------------------
  const initialRegulatoryRequirements: RegulatoryRequirement[] = [
    {
      id: 'REQ-001',
      code: 'MOCIIP-CL-01',
      authority: 'Ministry of Commerce, Industry & Investment Promotion (MOCIIP)',
      jurisdiction: 'Sultanate of Oman',
      title: 'Commercial Companies Law (Royal Decree 18/2019) Compliance',
      category: 'COMMERCIAL_COMPANIES',
      description: 'Mandatory maintenance of statutory minutes book, commercial registration (CR) renewal, annual general meeting (AGM) convocation within 90 days of fiscal year end.',
      complianceLead: 'Salim Al-Busaidi (Legal Counsel)',
      department: 'Corporate Governance',
      penaltyClause: 'Fine up to OMR 20,000 and suspension of commercial activities.',
      frequency: 'ANNUAL',
      status: 'COMPLIANT',
      lastReviewDate: '2026-01-15',
      nextReviewDate: '2027-01-15',
      complianceScore: 100,
      evidenceDocuments: ['CR_Renewal_2026.pdf', 'Board_Charter_Signed.pdf']
    },
    {
      id: 'REQ-002',
      code: 'MOL-OMN-02',
      authority: 'Ministry of Labour (MOL)',
      jurisdiction: 'Sultanate of Oman',
      title: 'Omanisation Quota & National Workforce Adherence',
      category: 'LABOUR_LAW',
      description: 'Enforce minimum 35% overall Omanisation ratio across professional and administrative job bands, with zero delay in social security (PASI) wage disbursements.',
      complianceLead: 'Fatima Al-Riyami (HR Director)',
      department: 'Human Resources',
      penaltyClause: 'Revocation of work permits and commercial blacklisting.',
      frequency: 'MONTHLY',
      status: 'COMPLIANT',
      lastReviewDate: '2026-02-01',
      nextReviewDate: '2026-03-01',
      complianceScore: 94,
      evidenceDocuments: ['MOL_Monthly_Roster_Jan2026.pdf', 'PASI_Payment_Proof.pdf']
    },
    {
      id: 'REQ-003',
      code: 'OTA-VAT-03',
      authority: 'Oman Tax Authority (OTA)',
      jurisdiction: 'Sultanate of Oman',
      title: 'Value Added Tax (VAT) Law (Royal Decree 121/2020)',
      category: 'FINANCIAL_CRIME',
      description: 'Standard 5% VAT billing, mandatory tax invoice archiving for 10 years, quarterly VAT-01 return filings and reverse charge mechanism on cross-border services.',
      complianceLead: 'Tariq Al-Lawati (Head of Tax)',
      department: 'Finance & Tax',
      penaltyClause: 'Penalties of 1% per month on overdue tax + OMR 5,000 fine for non-filing.',
      frequency: 'QUARTERLY',
      status: 'COMPLIANT',
      lastReviewDate: '2026-01-31',
      nextReviewDate: '2026-04-30',
      complianceScore: 98,
      evidenceDocuments: ['VAT_Return_2025_Q4_Receipt.pdf']
    },
    {
      id: 'REQ-004',
      code: 'EA-ENV-04',
      authority: 'Environment Authority (EA)',
      jurisdiction: 'Sultanate of Oman',
      title: 'Industrial Environmental Permit & Waste Management',
      category: 'ENVIRONMENTAL',
      description: 'Maintain valid Environmental Clearance Certificate for manufacturing plants, periodic toxic emission testing and hazardous waste disposal manifests.',
      complianceLead: 'Khalfan Al-Mamari (HSE Officer)',
      department: 'HSE & Quality',
      penaltyClause: 'Facility shutdown notice and fine up to OMR 15,000.',
      frequency: 'ANNUAL',
      status: 'UNDER_REVIEW',
      lastReviewDate: '2025-11-20',
      nextReviewDate: '2026-03-15',
      complianceScore: 82,
      evidenceDocuments: ['Stack_Emission_Test_Report_Q4.pdf']
    }
  ];

  const initialCalendarEvents: ComplianceCalendarEvent[] = [
    {
      id: 'CAL-01',
      title: 'Q1 2026 Statutory VAT Return (Form VAT-01) Filing',
      category: 'Tax & VAT',
      authority: 'Oman Tax Authority (OTA)',
      dueDate: '2026-04-30',
      status: 'PENDING',
      assignedTo: 'Tariq Al-Lawati',
      reminderDaysBefore: 15,
      statutoryReference: 'Article 47, Oman VAT Executive Regulations',
      estimatedEffortHours: 24
    },
    {
      id: 'CAL-02',
      title: 'Annual Corporate Income Tax Provisional Return Submission',
      category: 'Corporate Tax',
      authority: 'Oman Tax Authority',
      dueDate: '2026-03-31',
      status: 'PENDING',
      assignedTo: 'Finance Controller',
      reminderDaysBefore: 30,
      statutoryReference: 'Oman Income Tax Law RD 28/2009',
      estimatedEffortHours: 40
    },
    {
      id: 'CAL-03',
      title: 'PASI & Job Security Fund Monthly Contribution Remittance',
      category: 'Labour & Pension',
      authority: 'Public Authority for Social Insurance',
      dueDate: '2026-03-15',
      status: 'PENDING',
      assignedTo: 'Fatima Al-Riyami',
      reminderDaysBefore: 5,
      statutoryReference: 'Social Insurance Law RD 72/91',
      estimatedEffortHours: 8
    },
    {
      id: 'CAL-04',
      title: 'Annual Commercial Registration (CR) Renewal & Chamber Fee',
      category: 'Corporate Secretarial',
      authority: 'MOCIIP / Oman Chamber of Commerce (OCCI)',
      dueDate: '2026-05-10',
      status: 'PENDING',
      assignedTo: 'Salim Al-Busaidi',
      reminderDaysBefore: 20,
      statutoryReference: 'Commercial Register Law',
      estimatedEffortHours: 6
    },
    {
      id: 'CAL-05',
      title: 'Audited Financial Statements Submission to MOCIIP Portal',
      category: 'Financial Reporting',
      authority: 'MOCIIP',
      dueDate: '2026-04-15',
      status: 'PENDING',
      assignedTo: 'Chief Financial Officer',
      reminderDaysBefore: 25,
      statutoryReference: 'CCL 2019 Art 235',
      estimatedEffortHours: 16
    }
  ];

  const initialScorecards: ComplianceScorecard[] = [
    {
      department: 'Finance & Treasury',
      totalRequirements: 18,
      compliantCount: 17,
      warningCount: 1,
      breachCount: 0,
      healthPercentage: 94.4,
      lastAuditDate: '2026-01-20',
      leadOwner: 'Zaid Al-Habsi (Financial Controller)'
    },
    {
      department: 'Human Capital & HR',
      totalRequirements: 12,
      compliantCount: 12,
      warningCount: 0,
      breachCount: 0,
      healthPercentage: 100.0,
      lastAuditDate: '2026-02-05',
      leadOwner: 'Fatima Al-Riyami (HR Director)'
    },
    {
      department: 'Supply Chain & Logistics',
      totalRequirements: 10,
      compliantCount: 9,
      warningCount: 1,
      breachCount: 0,
      healthPercentage: 90.0,
      lastAuditDate: '2026-01-28',
      leadOwner: 'Hamad Al-Ghafri (SCM VP)'
    },
    {
      department: 'HSE & Construction Sites',
      totalRequirements: 14,
      compliantCount: 12,
      warningCount: 2,
      breachCount: 0,
      healthPercentage: 85.7,
      lastAuditDate: '2026-02-12',
      leadOwner: 'Khalfan Al-Mamari (HSE Lead)'
    }
  ];

  const initialVatRecords: VATComplianceRecord[] = [
    {
      id: 'VAT-REC-01',
      period: '2026-Q1',
      invoiceNumber: 'INV-2026-0104',
      invoiceDate: '2026-01-14',
      partyName: 'Oman National Engineering Co.',
      partyVatTin: 'OM1200482910',
      taxableAmountOMR: 120000.00,
      vatRate: 0.05,
      vatAmountOMR: 6000.00,
      direction: 'OUTPUT_VAT',
      qrCodeValidated: true,
      cryptographicHashValid: true,
      reverseChargeApplicable: false,
      complianceFlag: 'PASS',
      notes: 'Standard 5% domestic sales supply with validated cryptographic signature.'
    },
    {
      id: 'VAT-REC-02',
      period: '2026-Q1',
      invoiceNumber: 'SUP-2026-8831',
      invoiceDate: '2026-01-22',
      partyName: 'Al-Jazeera Steel Products SAOG',
      partyVatTin: 'OM1100938472',
      taxableAmountOMR: 45000.00,
      vatRate: 0.05,
      vatAmountOMR: 2250.00,
      direction: 'INPUT_VAT',
      qrCodeValidated: true,
      cryptographicHashValid: true,
      reverseChargeApplicable: false,
      complianceFlag: 'PASS',
      notes: 'Raw material procurement with matching 3-way matched GRN.'
    },
    {
      id: 'VAT-REC-03',
      period: '2026-Q1',
      invoiceNumber: 'IMP-TECH-009',
      invoiceDate: '2026-02-04',
      partyName: 'Siemens Industrial AG (Germany)',
      partyVatTin: 'DE811115368',
      taxableAmountOMR: 35000.00,
      vatRate: 0.05,
      vatAmountOMR: 1750.00,
      direction: 'INPUT_VAT',
      qrCodeValidated: true,
      cryptographicHashValid: true,
      reverseChargeApplicable: true,
      complianceFlag: 'PASS',
      notes: 'Cross-border specialized engineering consultancy under reverse charge mechanism.'
    },
    {
      id: 'VAT-REC-04',
      period: '2026-Q1',
      invoiceNumber: 'INV-2026-0219',
      invoiceDate: '2026-02-18',
      partyName: 'Sohar Port Development Corp',
      partyVatTin: 'OM1300847291',
      taxableAmountOMR: 85000.00,
      vatRate: 0.05,
      vatAmountOMR: 4250.00,
      direction: 'OUTPUT_VAT',
      qrCodeValidated: true,
      cryptographicHashValid: true,
      reverseChargeApplicable: false,
      complianceFlag: 'PASS',
      notes: 'Civil construction progress billing under IPC #04.'
    }
  ];

  const initialTaxSchedules: TaxScheduleItem[] = [
    {
      id: 'SCH-01',
      taxYear: '2025',
      scheduleCode: 'SCH-CIT-DEP',
      description: 'Tax Depreciation vs Accounting Depreciation Adjustment (IAS 16 vs OTA Rules)',
      accountingBasisOMR: 185000.00,
      taxAdjustmentsOMR: -28000.00,
      taxableBasisOMR: 157000.00,
      taxRatePercent: 15.0,
      taxLiabilityOMR: 23550.00,
      status: 'AUDITED',
      preparedBy: 'Tariq Al-Lawati',
      reviewedBy: 'PwC Tax Partner'
    },
    {
      id: 'SCH-02',
      taxYear: '2025',
      scheduleCode: 'SCH-CIT-DISALL',
      description: 'Disallowable Expenses (Non-business travel, entertainment, and general provisions)',
      accountingBasisOMR: 42000.00,
      taxAdjustmentsOMR: 42000.00,
      taxableBasisOMR: 42000.00,
      taxRatePercent: 15.0,
      taxLiabilityOMR: 6300.00,
      status: 'AUDITED',
      preparedBy: 'Tariq Al-Lawati',
      reviewedBy: 'PwC Tax Partner'
    },
    {
      id: 'SCH-03',
      taxYear: '2025',
      scheduleCode: 'SCH-CIT-TP',
      description: 'Transfer Pricing & Related Party Cross-Charge Arm’s Length Validation',
      accountingBasisOMR: 95000.00,
      taxAdjustmentsOMR: 0.00,
      taxableBasisOMR: 95000.00,
      taxRatePercent: 15.0,
      taxLiabilityOMR: 14250.00,
      status: 'AUDITED',
      preparedBy: 'Tariq Al-Lawati',
      reviewedBy: 'PwC Tax Partner'
    }
  ];

  const initialTaxReturns: StatutoryTaxReturn[] = [
    {
      id: 'TR-2025-CIT',
      returnType: 'CORPORATE_INCOME_TAX',
      period: 'FY 2025',
      filingDeadline: '2026-04-30',
      submissionDate: '2026-02-10',
      acknowledgementNumber: 'OTA-CIT-2025-994821',
      netTaxPayableOMR: 87450.00,
      paymentStatus: 'PAID',
      paymentReference: 'NBO-TRF-20260210-948',
      status: 'AUTHORITY_ACCEPTED',
      attachments: ['Annual_Tax_Return_2025_Final.pdf', 'Audited_P&L_Tax_Comp.xlsx']
    },
    {
      id: 'TR-2025-Q4-VAT',
      returnType: 'VAT_DECLARATION',
      period: '2025-Q4',
      filingDeadline: '2026-01-31',
      submissionDate: '2026-01-28',
      acknowledgementNumber: 'OTA-VAT-2025Q4-184920',
      netTaxPayableOMR: 14320.00,
      paymentStatus: 'PAID',
      paymentReference: 'BMS-TRF-20260128-112',
      status: 'AUTHORITY_ACCEPTED',
      attachments: ['VAT_Q4_Summary_Return.pdf']
    },
    {
      id: 'TR-2026-Q1-VAT',
      returnType: 'VAT_DECLARATION',
      period: '2026-Q1',
      filingDeadline: '2026-04-30',
      netTaxPayableOMR: 16850.00,
      paymentStatus: 'UNPAID',
      status: 'DRAFT',
      attachments: ['VAT_Q1_Draft_Worksheet.xlsx']
    }
  ];

  const initialStatutoryReports: StatutoryReportPackage[] = [
    {
      id: 'REP-CBO-01',
      reportName: 'Quarterly Commercial Borrowing & FX Exposure Report',
      regulatoryBody: 'CENTRAL_BANK_OMAN',
      submissionFrequency: 'QUARTERLY',
      reportingPeriod: '2025-Q4',
      dueDate: '2026-01-20',
      status: 'ACKNOWLEDGED',
      submissionChannel: 'PORTAL_API',
      signedBy: 'VP Treasury'
    },
    {
      id: 'REP-MOL-02',
      reportName: 'Omanisation Quota & Expatriate Replacement Plan',
      regulatoryBody: 'MOL_OMANISATION',
      submissionFrequency: 'MONTHLY',
      reportingPeriod: 'January 2026',
      dueDate: '2026-02-05',
      status: 'ACKNOWLEDGED',
      submissionChannel: 'PORTAL_API',
      signedBy: 'HR Director'
    },
    {
      id: 'REP-NCSI-03',
      reportName: 'National Center for Statistics Annual Industrial Output Survey',
      regulatoryBody: 'NCSI',
      submissionFrequency: 'ANNUAL',
      reportingPeriod: 'FY 2025',
      dueDate: '2026-03-31',
      status: 'PREPARED',
      submissionChannel: 'SECURE_EMAIL',
      signedBy: 'Operations Director'
    }
  ];

  const initialControls: ControlActivity[] = [
    {
      id: 'CTRL-P2P-01',
      code: 'CTRL-P2P-01',
      processArea: 'PROCURE_TO_PAY',
      controlName: 'Mandatory 3-Way Matching for Supplier Invoices',
      controlObjective: 'Ensure no payments are approved without valid PO and verified Good Receipt Note (GRN) quantity.',
      controlType: 'PREVENTATIVE',
      frequency: 'CONTINUOUS',
      ownerRole: 'Accounts Payable Manager',
      automatedOrManual: 'AUTOMATED',
      keyControl: true,
      status: 'EFFECTIVE',
      lastTestedDate: '2026-01-18',
      testResult: 'PASS'
    },
    {
      id: 'CTRL-O2C-02',
      code: 'CTRL-O2C-02',
      processArea: 'ORDER_TO_CASH',
      controlName: 'Customer Credit Limit Block Override Authorization',
      controlObjective: 'Sales orders exceeding authorized customer credit lines require dual signoff from Credit Controller and CFO.',
      controlType: 'PREVENTATIVE',
      frequency: 'EVENT_DRIVEN' as any,
      ownerRole: 'Credit Control Lead',
      automatedOrManual: 'AUTOMATED',
      keyControl: true,
      status: 'EFFECTIVE',
      lastTestedDate: '2026-01-22',
      testResult: 'PASS'
    },
    {
      id: 'CTRL-R2R-03',
      code: 'CTRL-R2R-03',
      processArea: 'RECORD_TO_REPORT',
      controlName: 'Manual Journal Entry Multi-tier Approval & Evidence Attachment',
      controlObjective: 'All manual journal entries above OMR 10,000 require independent review and supporting calculation upload.',
      controlType: 'PREVENTATIVE',
      frequency: 'DAILY',
      ownerRole: 'Chief Accountant',
      automatedOrManual: 'AUTOMATED',
      keyControl: true,
      status: 'EFFECTIVE',
      lastTestedDate: '2026-01-25',
      testResult: 'PASS'
    },
    {
      id: 'CTRL-TRE-04',
      code: 'CTRL-TRE-04',
      processArea: 'TREASURY',
      controlName: 'Dual Electronic Authorization for Bank Outbound Wire Transfers',
      controlObjective: 'Any electronic wire payment above OMR 5,000 requires token-authenticated Maker and Checker release.',
      controlType: 'PREVENTATIVE',
      frequency: 'CONTINUOUS',
      ownerRole: 'Head of Treasury',
      automatedOrManual: 'AUTOMATED',
      keyControl: true,
      status: 'EFFECTIVE',
      lastTestedDate: '2026-02-02',
      testResult: 'PASS'
    },
    {
      id: 'CTRL-AST-05',
      code: 'CTRL-AST-05',
      processArea: 'FIXED_ASSETS',
      controlName: 'Annual Physical Asset Verification & Tagging Count',
      controlObjective: 'Physical inspection of plant machinery and reconciliation against Fixed Asset Register.',
      controlType: 'DETECTIVE',
      frequency: 'ANNUAL',
      ownerRole: 'Fixed Asset Accountant',
      automatedOrManual: 'MANUAL',
      keyControl: false,
      status: 'DEFICIENT',
      lastTestedDate: '2025-12-28',
      testResult: 'FAIL'
    }
  ];

  const initialApprovalRules: ApprovalControlRule[] = [
    {
      id: 'RULE-01',
      ruleCode: 'DOA-PO-TIER1',
      workflowName: 'Purchase Order Approval (OMR 0 - 5,000)',
      thresholdMinOMR: 0,
      thresholdMaxOMR: 5000,
      requiredApprovers: ['Department Manager'],
      allowsSelfApproval: false,
      emergencyBypassAllowed: false,
      activeViolationsCount: 0,
      status: 'ACTIVE'
    },
    {
      id: 'RULE-02',
      ruleCode: 'DOA-PO-TIER2',
      workflowName: 'Purchase Order Approval (OMR 5,001 - 25,000)',
      thresholdMinOMR: 5001,
      thresholdMaxOMR: 25000,
      requiredApprovers: ['Procurement Head', 'Finance Controller'],
      allowsSelfApproval: false,
      emergencyBypassAllowed: false,
      activeViolationsCount: 0,
      status: 'ACTIVE'
    },
    {
      id: 'RULE-03',
      ruleCode: 'DOA-PO-TIER3',
      workflowName: 'Major Capital Expenditure (Above OMR 25,000)',
      thresholdMinOMR: 25001,
      thresholdMaxOMR: 1000000,
      requiredApprovers: ['Chief Financial Officer', 'Chief Executive Officer'],
      allowsSelfApproval: false,
      emergencyBypassAllowed: false,
      activeViolationsCount: 0,
      status: 'ACTIVE'
    }
  ];

  const initialSodRules: SoDConflictRule[] = [
    {
      id: 'SOD-01',
      ruleCode: 'SOD-P2P-CREAT-PAY',
      conflictTitle: 'Vendor Master Maintenance vs. Outbound Payment Processing',
      incompatibleRoleA: 'Vendor Master Data Administrator',
      incompatibleRoleB: 'Treasury Payment Releaser',
      riskDescription: 'Risk of creating fictitious vendor master accounts and disbursing funds without external review.',
      severity: 'CRITICAL',
      activeViolations: []
    },
    {
      id: 'SOD-02',
      ruleCode: 'SOD-INV-REC-POST',
      conflictTitle: 'Inventory Physical Custody vs. General Ledger Journal Posting',
      incompatibleRoleA: 'Warehouse Storekeeper',
      incompatibleRoleB: 'Inventory General Ledger Accountant',
      riskDescription: 'Risk of masking inventory shrinkage or theft by posting unauthorized inventory write-offs.',
      severity: 'HIGH',
      activeViolations: [
        {
          userId: 'USR-882',
          userName: 'Majid Al-Balushi',
          department: 'Supply Chain Sohar',
          assignedRoles: ['Warehouse Storekeeper', 'Inventory General Ledger Accountant'],
          mitigatingControl: 'Monthly independent stock count performed by Internal Audit',
          exceptionApprovedBy: 'CFO (Temporary waiver during system rollout)'
        }
      ]
    },
    {
      id: 'SOD-03',
      ruleCode: 'SOD-HR-PAY-REL',
      conflictTitle: 'Payroll Master Setup vs. Bank Salary Transfer Authorization',
      incompatibleRoleA: 'Payroll Specialist',
      incompatibleRoleB: 'Bank Signatory (A-Level)',
      riskDescription: 'Risk of inflating salary payments or adding ghost employees to the payroll run.',
      severity: 'CRITICAL',
      activeViolations: []
    }
  ];

  const initialControlTests: ControlTestRecord[] = [
    {
      id: 'TEST-2026-01',
      controlCode: 'CTRL-P2P-01',
      testPeriod: '2025-Q4 Sample',
      testerName: 'Nasser Al-Harthy (Senior Internal Auditor)',
      sampleSize: 45,
      exceptionsIdentified: 0,
      testConclusion: 'OPERATING_EFFECTIVELY',
      walkthroughNotes: 'Tested 45 randomly stratified supplier invoice vouchers. 100% had automated 3-way match seals and electronic GRN verification.',
      workpaperReference: 'WP-IA-2025Q4-P2P-01',
      completedDate: '2026-01-18'
    },
    {
      id: 'TEST-2026-02',
      controlCode: 'CTRL-AST-05',
      testPeriod: 'Annual 2025',
      testerName: 'Laila Al-Zadjali (Audit Associate)',
      sampleSize: 30,
      exceptionsIdentified: 4,
      testConclusion: 'SIGNIFICANT_DEFICIENCY',
      walkthroughNotes: 'Four machinery assets at Rusayl Plant lacked physical barcode tags and serial numbers differed from FAR register.',
      workpaperReference: 'WP-IA-2025-AST-05',
      completedDate: '2025-12-28'
    }
  ];

  const initialRisks: RiskItem[] = [
    {
      id: 'RSK-01',
      code: 'RSK-FIN-01',
      title: 'Raw Material & Steel Price Volatility & Currency Fluctuations',
      category: 'FINANCIAL',
      description: 'Fluctuations in international rebar, structural steel and cement commodity prices impacting construction project profit margins.',
      riskOwner: 'Zaid Al-Habsi (Financial Controller)',
      department: 'Finance & Procurement',
      inherentLikelihood: 4,
      inherentImpact: 4,
      inherentScore: 16,
      inherentLevel: 'HIGH',
      residualLikelihood: 2,
      residualImpact: 3,
      residualScore: 6,
      residualLevel: 'MEDIUM',
      financialExposureOMR: 250000.00,
      riskAppetiteStatus: 'WITHIN_APPETITE',
      mitigationStrategy: 'TREAT',
      mitigationPlanSummary: 'Back-to-back index-linked supplier framework contracts and forward purchase hedging for 6-month steel inventory requirements.',
      kriIndicators: [
        { name: 'London Metal Exchange Steel Billet Index Variance', threshold: '± 8%', currentValue: '+ 3.2%', status: 'GREEN' },
        { name: 'Fixed Price Vendor Contract Ratio', threshold: '> 75%', currentValue: '82%', status: 'GREEN' }
      ],
      status: 'ACTIVE',
      lastAssessedDate: '2026-01-10'
    },
    {
      id: 'RSK-02',
      code: 'RSK-CYB-02',
      title: 'Ransomware Cyber Attack & Business Interruption',
      category: 'CYBER_SECURITY',
      description: 'Sophisticated phishing attacks targeting corporate credentials leading to critical ERP database encryption and operational shutdown.',
      riskOwner: 'Said Al-Kindi (Chief Information Security Officer)',
      department: 'Information Technology',
      inherentLikelihood: 4,
      inherentImpact: 5,
      inherentScore: 20,
      inherentLevel: 'CRITICAL',
      residualLikelihood: 2,
      residualImpact: 3,
      residualScore: 6,
      residualLevel: 'MEDIUM',
      financialExposureOMR: 450000.00,
      riskAppetiteStatus: 'WITHIN_APPETITE',
      mitigationStrategy: 'TREAT',
      mitigationPlanSummary: 'Zero Trust architecture, mandatory hardware MFA, immutable daily cloud backups in Frankfurt and Muscat tier-3 datacenters, quarterly simulated penetration tests.',
      kriIndicators: [
        { name: 'Employee Phishing Simulation Fail Rate', threshold: '< 3%', currentValue: '1.4%', status: 'GREEN' },
        { name: 'Disaster Recovery RTO (Recovery Time Objective)', threshold: '< 4 Hours', currentValue: '1.8 Hours', status: 'GREEN' }
      ],
      status: 'ACTIVE',
      lastAssessedDate: '2026-02-01'
    },
    {
      id: 'RSK-03',
      code: 'RSK-OPS-03',
      title: 'Subcontractor Default & Labor Shortage on FIDIC Contracts',
      category: 'OPERATIONAL',
      description: 'Critical MEP subcontractors failing to mobilize sufficient certified manpower causing milestone delay liquidated damages.',
      riskOwner: 'Rashid Al-Kharusi (VP Projects)',
      department: 'Projects & Engineering',
      inherentLikelihood: 3,
      inherentImpact: 4,
      inherentScore: 12,
      inherentLevel: 'HIGH',
      residualLikelihood: 2,
      residualImpact: 3,
      residualScore: 6,
      residualLevel: 'MEDIUM',
      financialExposureOMR: 180000.00,
      riskAppetiteStatus: 'WITHIN_APPETITE',
      mitigationStrategy: 'TREAT',
      mitigationPlanSummary: 'Mandatory 10% unconditional Performance Bond from grade-1 banks, pre-qualification labor audits, and secondary contingency standby subcontractors.',
      kriIndicators: [
        { name: 'Subcontractor Schedule Performance Index (SPI)', threshold: '> 0.95', currentValue: '0.97', status: 'GREEN' },
        { name: 'Active Bank Performance Bonds in Custody', threshold: '100%', currentValue: '100%', status: 'GREEN' }
      ],
      status: 'ACTIVE',
      lastAssessedDate: '2026-01-28'
    },
    {
      id: 'RSK-04',
      code: 'RSK-REG-04',
      title: 'Statutory VAT Audit Disallowance & Penalties',
      category: 'LEGAL_REGULATORY',
      description: 'Incomplete electronic invoicing cryptographic tags or supplier tax TIN mismatches resulting in input tax deduction rejections by Oman Tax Authority.',
      riskOwner: 'Tariq Al-Lawati (Head of Tax)',
      department: 'Finance & Tax',
      inherentLikelihood: 3,
      inherentImpact: 3,
      inherentScore: 9,
      inherentLevel: 'MEDIUM',
      residualLikelihood: 1,
      residualImpact: 2,
      residualScore: 2,
      residualLevel: 'LOW',
      financialExposureOMR: 65000.00,
      riskAppetiteStatus: 'WITHIN_APPETITE',
      mitigationStrategy: 'TREAT',
      mitigationPlanSummary: 'Automated ERP pre-submission validation engine verifying QR codes, cryptographic hashes, and live TIN verification against Tax Authority database.',
      kriIndicators: [
        { name: 'Invalid Vendor VAT TIN Invoice Rate', threshold: '0%', currentValue: '0%', status: 'GREEN' },
        { name: 'Timely VAT-01 Filing Record', threshold: '100%', currentValue: '100%', status: 'GREEN' }
      ],
      status: 'ACTIVE',
      lastAssessedDate: '2026-02-05'
    }
  ];

  const initialAuditEngagements: AuditPlanEngagement[] = [
    {
      id: 'ENG-2026-01',
      auditCode: 'IA-2026-P2P',
      engagementTitle: 'Procure-to-Pay & Subcontractor Milestone Payment Audit',
      auditUniverseArea: 'Procurement, SCM & Finance',
      auditType: 'OPERATIONAL',
      plannedQuarter: 'Q1 2026',
      leadAuditor: 'Nasser Al-Harthy (CIA, Lead Auditor)',
      budgetDays: 25,
      actualDays: 20,
      status: 'IN_PROGRESS',
      riskWeighting: 'HIGH',
      committeeApprovalDate: '2025-12-15'
    },
    {
      id: 'ENG-2026-02',
      auditCode: 'IA-2026-FIX',
      engagementTitle: 'Fixed Assets Verification, IAS 16 Depreciation & Disposal Audit',
      auditUniverseArea: 'Asset Management & Plant Engineering',
      auditType: 'FINANCIAL',
      plannedQuarter: 'Q2 2026',
      leadAuditor: 'Laila Al-Zadjali (Audit Senior)',
      budgetDays: 18,
      actualDays: 0,
      status: 'PLANNED',
      riskWeighting: 'MEDIUM',
      committeeApprovalDate: '2025-12-15'
    },
    {
      id: 'ENG-2026-03',
      auditCode: 'IA-2026-CYB',
      engagementTitle: 'Cyber Security, Access Controls & ERP Segregation of Duties (SoD)',
      auditUniverseArea: 'Information Technology & Systems',
      auditType: 'IT_CYBER',
      plannedQuarter: 'Q1 2026',
      leadAuditor: 'External IT Specialist & Internal Auditor',
      budgetDays: 15,
      actualDays: 15,
      status: 'REPORT_ISSUED',
      riskWeighting: 'HIGH',
      committeeApprovalDate: '2025-12-15'
    }
  ];

  const initialAuditPrograms: AuditProgramStep[] = [
    {
      id: 'PRG-01',
      engagementId: 'ENG-2026-01',
      stepNumber: 'P2P-01',
      objective: 'Verify that all Purchase Orders exceeding OMR 5,000 have documented competitive quotation evaluations.',
      procedureDescription: 'Sample 30 POs. Check for minimum 3 vendor bids, price comparison sheet, and authorized technical evaluation signoffs.',
      samplingMethod: 'STRATIFIED_MONETARY',
      sampleSize: 30,
      completedBy: 'Nasser Al-Harthy',
      status: 'COMPLETED',
      findingsCount: 1
    },
    {
      id: 'PRG-02',
      engagementId: 'ENG-2026-01',
      stepNumber: 'P2P-02',
      objective: 'Verify 3-way matching and GRN physical receipt stamp on construction progress claims.',
      procedureDescription: 'Examine 25 interim subcontractor payment vouchers. Match against Surveyor IPC and Engineer stamp.',
      samplingMethod: 'RANDOM',
      sampleSize: 25,
      completedBy: 'Nasser Al-Harthy',
      status: 'IN_PROGRESS',
      findingsCount: 0
    },
    {
      id: 'PRG-03',
      engagementId: 'ENG-2026-03',
      stepNumber: 'IT-01',
      objective: 'Assess user access rights and identify conflicting role assignments across GL and Bank transfer modules.',
      procedureDescription: 'Extract full user permission matrix from ERP database. Run automated conflict detection algorithm.',
      samplingMethod: '100%_POPULATION',
      sampleSize: 180,
      completedBy: 'Laila Al-Zadjali',
      status: 'COMPLETED',
      findingsCount: 1
    }
  ];

  const initialAuditFindings: AuditFinding[] = [
    {
      id: 'FND-2026-01',
      findingCode: 'AUD-2026-F01',
      engagementId: 'ENG-2026-01',
      engagementTitle: 'Procure-to-Pay Audit',
      title: 'Sole-Source Vendor Justification Missing on 2 Capital Procurements',
      severity: 'MEDIUM',
      category: 'INTERNAL_CONTROL',
      condition: 'Two equipment orders totaling OMR 48,000 were placed with a single vendor without documented sole-source committee approval forms.',
      criteria: 'Artify Procurement Policy Manual (Section 4.3) requires minimum 3 formal bids or written CFO sole-source waiver.',
      cause: 'Urgent project site requirement led procurement team to bypass standard bidding workflow without formal waiver logging.',
      consequence: 'Risk of non-competitive pricing and lack of transparency in supplier selection.',
      recommendation: 'Enforce hard system stop in ERP requiring uploaded waiver before PO release on single-quote purchases > OMR 10,000.',
      managementResponse: 'Management accepts the recommendation. SCM workflow has been updated to require CFO approval flag on single-source POs.',
      actionOwner: 'Hamad Al-Ghafri (SCM VP)',
      targetClosureDate: '2026-03-31',
      status: 'UNDER_REMEDIATION',
      retestEvidence: 'PO_Workflow_Config_Screenshot.png'
    },
    {
      id: 'FND-2026-02',
      findingCode: 'AUD-2026-F02',
      engagementId: 'ENG-2026-03',
      engagementTitle: 'IT Cyber & Access Controls Audit',
      title: 'Segregation of Duties Conflict in Warehouse Storekeeper Role',
      severity: 'HIGH',
      category: 'INTERNAL_CONTROL',
      condition: 'One user in Sohar Logistics had dual roles allowing both physical goods receipt and inventory write-off posting.',
      criteria: 'COSO Internal Control Framework & ERP Security Policy prohibiting incompatible custody and record-keeping privileges.',
      cause: 'Temporary role assignment during annual leave of store accountant that was not revoked upon return.',
      consequence: 'Risk of undetected inventory shrinkage and unauthorized stock balance adjustments.',
      recommendation: 'Immediately revoke inventory adjustment role from storekeeper and institute automated 90-day temporary role expiration.',
      managementResponse: 'Incompatible role was immediately revoked on 2026-02-02. System timer now auto-expires temporary permissions after 14 days.',
      actionOwner: 'Said Al-Kindi (CISO)',
      targetClosureDate: '2026-02-28',
      status: 'READY_FOR_RETEST'
    }
  ];

  const initialAuditors: ExternalAuditorProfile[] = [
    {
      id: 'AUD-FIRM-01',
      firmName: 'PricewaterhouseCoopers (PwC Oman)',
      leadPartner: 'Kenneth Macpherson (Statutory Audit Partner)',
      auditManager: 'Ali Al-Marhoon (Senior Audit Manager)',
      fiscalYearUnderAudit: 'FY 2025 Statutory Audit',
      engagementLetterSignedDate: '2025-10-15',
      auditFeeAgreedOMR: 32000.00,
      auditInterimDate: '2025-11-15',
      auditFinalDate: '2026-03-20',
      status: 'FIELDWORK'
    }
  ];

  const initialPbcRequests: ExternalPBCRequest[] = [
    {
      id: 'PBC-01',
      pbcNumber: 'PBC-TB-001',
      auditorId: 'AUD-FIRM-01',
      financialArea: 'CASH_BANK',
      itemDescription: 'Final Audited Trial Balance as of 31 December 2025 with GL account mapping to IFRS financial statement line items.',
      requestedFormat: 'EXCEL_SCHEDULE',
      requestedDate: '2026-01-10',
      dueDate: '2026-01-20',
      assignedTeam: 'Financial Reporting',
      assignedPerson: 'Zaid Al-Habsi',
      status: 'ACCEPTED',
      fileAttachment: 'Artify_Trial_Balance_Dec2025_IFRS.xlsx',
      auditorRemarks: 'Agreed to general ledger. Completed testing.'
    },
    {
      id: 'PBC-02',
      pbcNumber: 'PBC-BNK-002',
      auditorId: 'AUD-FIRM-01',
      financialArea: 'CASH_BANK',
      itemDescription: 'Bank confirmation letters signed by all authorized bank institutions directly returned to PwC address.',
      requestedFormat: 'BANK_CERTIFICATES',
      requestedDate: '2026-01-10',
      dueDate: '2026-02-15',
      assignedTeam: 'Treasury',
      assignedPerson: 'Head of Treasury',
      status: 'SUBMITTED',
      fileAttachment: 'Bank_Confirmations_Consolidated_2025.pdf',
      auditorRemarks: '4 of 5 bank certificates received. Awaiting Bank Dhofar response.'
    },
    {
      id: 'PBC-03',
      pbcNumber: 'PBC-AR-003',
      auditorId: 'AUD-FIRM-01',
      financialArea: 'REVENUE_AR',
      itemDescription: 'Accounts Receivable detailed sub-ledger aging schedule and sample contracts for top 10 construction project billings.',
      requestedFormat: 'EXCEL_SCHEDULE',
      requestedDate: '2026-01-15',
      dueDate: '2026-02-28',
      assignedTeam: 'Credit & AR',
      assignedPerson: 'AR Team Lead',
      status: 'IN_PREPARATION',
      auditorRemarks: 'Pending contract copies for Sohar Port Project Phase 2.'
    }
  ];

  const initialAuditResponses: ExternalAuditQueryResponse[] = [
    {
      id: 'QRY-01',
      queryNumber: 'EXT-QRY-2025-04',
      pbcReference: 'PBC-REV-008',
      auditorQuery: 'Please provide justification for revenue recognition timing on FIDIC Variation Claim #03 on Muscat Airport Link project (OMR 85,000) under IFRS 15.',
      managementDraftResponse: 'Variation was formally approved by Engineer in IPC #09 and client commercial acceptance was received on 28 Dec 2025.',
      cfoApprovedResponse: 'Confirmed that variation satisfies IFRS 15 highly probable criteria with legally enforceable claim supported by Engineer Certificate #09.',
      supportingDocuments: ['Engineer_IPC_09_Approved.pdf', 'Client_Variation_Addendum.pdf'],
      status: 'DELIVERED_TO_AUDITOR',
      deliveredDate: '2026-02-08'
    }
  ];

  const initialCorrectiveActions: CorrectiveActionItem[] = [
    {
      id: 'CAPA-01',
      capaCode: 'CAPA-2026-01',
      sourceType: 'INTERNAL_AUDIT',
      sourceFindingReference: 'AUD-2026-F01',
      findingSummary: 'Lack of mandatory sole-source waiver documentation on capital equipment orders > OMR 10,000.',
      severity: 'MEDIUM',
      rootCauseCategory: 'PROCESS_GAP',
      remediationPlan: 'Implement automated system validation rule blocking PO issuance without signed CFO waiver attachment.',
      operationalLead: 'Hamad Al-Ghafri (SCM VP)',
      department: 'Procurement',
      targetDueDate: '2026-03-31',
      completionPercentage: 75,
      milestones: [
        { title: 'ERP system validation rule configuration in Procurement module', targetDate: '2026-02-15', completed: true },
        { title: 'Procurement team training on revised sole-source policy guidelines', targetDate: '2026-03-01', completed: true },
        { title: 'Conduct 30-day post-implementation audit review of POs', targetDate: '2026-03-31', completed: false }
      ],
      status: 'IN_PROGRESS'
    },
    {
      id: 'CAPA-02',
      capaCode: 'CAPA-2026-02',
      sourceType: 'INTERNAL_AUDIT',
      sourceFindingReference: 'AUD-2026-F02',
      findingSummary: 'Segregation of duties conflict in Sohar warehouse storekeeper role.',
      severity: 'HIGH',
      rootCauseCategory: 'AUTHORIZATION_OVERRIDE',
      remediationPlan: 'Revoke incompatible role, implement 14-day auto-revocation policy, and re-test user access logs.',
      operationalLead: 'Said Al-Kindi (CISO)',
      department: 'IT Security',
      targetDueDate: '2026-02-28',
      completionPercentage: 100,
      milestones: [
        { title: 'Revoke inventory adjustment role from user', targetDate: '2026-02-02', completed: true },
        { title: 'Deploy automatic expiration timer for temporary permission elevation', targetDate: '2026-02-10', completed: true },
        { title: 'Submit evidence workpaper for Internal Audit closure verification', targetDate: '2026-02-15', completed: true }
      ],
      status: 'COMPLETED_PENDING_RETEST'
    }
  ];

  const initialFraudAlerts: FraudRedFlagAlert[] = [
    {
      id: 'ALERT-001',
      alertCode: 'RED-2026-881',
      alertType: 'DUPLICATE_PAYMENT',
      detectionTimestamp: '2026-02-14 09:24:18',
      severity: 'HIGH',
      transactionReference: 'INV-2026-0899 vs INV-2026-0902',
      amountOMR: 14250.00,
      entityInvolved: 'Gulf Construction Supplies LLC',
      anomalyDescription: 'Identical amount of OMR 14,250.00 submitted under two different invoice numbers within 48 hours for the same purchase order reference.',
      aiRiskScore: 92,
      aiSuggestedAction: 'Place immediate payment freeze on voucher #PV-2026-0419 and cross-check GRN physical delivery slips.',
      investigationStatus: 'UNDER_INVESTIGATION',
      investigatorNotes: 'Finance controller notified. Payment held pending supplier account statement reconciliation.'
    },
    {
      id: 'ALERT-002',
      alertCode: 'RED-2026-882',
      alertType: 'SPLIT_PO',
      detectionTimestamp: '2026-02-17 14:10:05',
      severity: 'MEDIUM',
      transactionReference: 'PO-2026-441, PO-2026-442, PO-2026-443',
      amountOMR: 14700.00,
      entityInvolved: 'Al-Batinah Fasteners Co.',
      anomalyDescription: 'Three purchase orders created on the same day for OMR 4,900 each (just below the OMR 5,000 threshold requiring CFO approval).',
      aiRiskScore: 86,
      aiSuggestedAction: 'Flag purchase orders for consolidated DOA review and audit procurement officer requisitions.',
      investigationStatus: 'NEW'
    },
    {
      id: 'ALERT-003',
      alertCode: 'RED-2026-883',
      alertType: 'AFTER_HOURS_TX',
      detectionTimestamp: '2026-02-19 23:48:12',
      severity: 'MEDIUM',
      transactionReference: 'JV-2026-0922',
      amountOMR: 35000.00,
      entityInvolved: 'General Ledger Account 5100 (Direct Costs)',
      anomalyDescription: 'Manual journal entry posted at 11:48 PM on a weekend by user outside Oman IP address range.',
      aiRiskScore: 78,
      aiSuggestedAction: 'Verify VPN token audit log and require independent Chief Accountant approval.',
      investigationStatus: 'RESOLVED',
      investigatorNotes: 'Verified as authorized month-end closing adjustment by Financial Controller during travel.'
    }
  ];

  const initialBenfordData: BenfordAnalysisItem[] = [
    { leadingDigit: 1, observedCount: 1420, observedPercent: 31.2, expectedBenfordPercent: 30.1, variancePercent: +1.1, isAnomaly: false },
    { leadingDigit: 2, observedCount: 790, observedPercent: 17.4, expectedBenfordPercent: 17.6, variancePercent: -0.2, isAnomaly: false },
    { leadingDigit: 3, observedCount: 570, observedPercent: 12.5, expectedBenfordPercent: 12.5, variancePercent: 0.0, isAnomaly: false },
    { leadingDigit: 4, observedCount: 520, observedPercent: 11.4, expectedBenfordPercent: 9.7, variancePercent: +1.7, isAnomaly: true },
    { leadingDigit: 5, observedCount: 340, observedPercent: 7.5, expectedBenfordPercent: 7.9, variancePercent: -0.4, isAnomaly: false },
    { leadingDigit: 6, observedCount: 290, observedPercent: 6.4, expectedBenfordPercent: 6.7, variancePercent: -0.3, isAnomaly: false },
    { leadingDigit: 7, observedCount: 250, observedPercent: 5.5, expectedBenfordPercent: 5.8, variancePercent: -0.3, isAnomaly: false },
    { leadingDigit: 8, observedCount: 210, observedPercent: 4.6, expectedBenfordPercent: 5.1, variancePercent: -0.5, isAnomaly: false },
    { leadingDigit: 9, observedCount: 160, observedPercent: 3.5, expectedBenfordPercent: 4.6, variancePercent: -1.1, isAnomaly: false }
  ];

  const initialPolicyDeclarations: PolicyDeclaration[] = [
    {
      id: 'DEC-01',
      employeeId: 'EMP-1002',
      employeeName: 'Zaid Al-Habsi',
      department: 'Finance',
      policyType: 'CONFLICT_OF_INTEREST',
      declarationYear: '2026',
      signedDate: '2026-01-08',
      disclosuresMade: false,
      complianceApproved: true
    },
    {
      id: 'DEC-02',
      employeeId: 'EMP-1045',
      employeeName: 'Hamad Al-Ghafri',
      department: 'Procurement',
      policyType: 'GIFT_HOSPITALITY',
      declarationYear: '2026',
      signedDate: '2026-01-12',
      disclosuresMade: true,
      disclosureDetails: 'Received ceremonial corporate pen set (< OMR 25 value) from industrial supplier during annual conference.',
      complianceApproved: true
    },
    {
      id: 'DEC-03',
      employeeId: 'EMP-1089',
      employeeName: 'Salim Al-Busaidi',
      department: 'Legal',
      policyType: 'CODE_OF_CONDUCT',
      declarationYear: '2026',
      signedDate: '2026-01-05',
      disclosuresMade: false,
      complianceApproved: true
    }
  ];

  const initialRetentionRules: DocumentRetentionRule[] = [
    {
      id: 'RET-01',
      recordCategory: 'Tax Invoices, VAT Filings & Double-Entry Journals',
      regulatoryMandate: 'Oman VAT Law (Art 70) & Commercial Law (Art 18) — Mandatory 10 Years',
      mandatoryRetentionYears: 10,
      storageFormat: 'IMMUTABLE_DIGITAL_ARCHIVE',
      autoPurgeEligible: false,
      legalHoldActive: false,
      totalArchivedRecordsCount: 48520
    },
    {
      id: 'RET-02',
      recordCategory: 'Employee Contracts, PASI Records & Payroll Registers',
      regulatoryMandate: 'Oman Labour Law (RD 53/2023) — Mandatory 10 Years post-termination',
      mandatoryRetentionYears: 10,
      storageFormat: 'IMMUTABLE_DIGITAL_ARCHIVE',
      autoPurgeEligible: false,
      legalHoldActive: false,
      totalArchivedRecordsCount: 12400
    },
    {
      id: 'RET-03',
      recordCategory: 'FIDIC Construction Contracts, IPCs & As-Built Drawings',
      regulatoryMandate: 'Oman Civil Transactions Law (Decennial Liability — 10 Years)',
      mandatoryRetentionYears: 10,
      storageFormat: 'HYBRID',
      autoPurgeEligible: false,
      legalHoldActive: true,
      totalArchivedRecordsCount: 6890
    }
  ];

  // ----------------------------------------------------
  // STATE DEFINITIONS
  // ----------------------------------------------------
  const [regulatoryRequirements, setRegulatoryRequirements] = useState<RegulatoryRequirement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_REQ`);
    return saved ? JSON.parse(saved) : initialRegulatoryRequirements;
  });

  const [calendarEvents, setCalendarEvents] = useState<ComplianceCalendarEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_CAL`);
    return saved ? JSON.parse(saved) : initialCalendarEvents;
  });

  const [scorecards, setScorecards] = useState<ComplianceScorecard[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_SCORE`);
    return saved ? JSON.parse(saved) : initialScorecards;
  });

  const [vatRecords, setVatRecords] = useState<VATComplianceRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_VAT`);
    return saved ? JSON.parse(saved) : initialVatRecords;
  });

  const [taxSchedules, setTaxSchedules] = useState<TaxScheduleItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_TAXSCH`);
    return saved ? JSON.parse(saved) : initialTaxSchedules;
  });

  const [statutoryTaxReturns, setStatutoryTaxReturns] = useState<StatutoryTaxReturn[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_TAXRET`);
    return saved ? JSON.parse(saved) : initialTaxReturns;
  });

  const [statutoryReports, setStatutoryReports] = useState<StatutoryReportPackage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_REPORTS`);
    return saved ? JSON.parse(saved) : initialStatutoryReports;
  });

  const [controlActivities, setControlActivities] = useState<ControlActivity[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_CTRL`);
    return saved ? JSON.parse(saved) : initialControls;
  });

  const [approvalRules, setApprovalRules] = useState<ApprovalControlRule[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_APPRULES`);
    return saved ? JSON.parse(saved) : initialApprovalRules;
  });

  const [sodRules, setSodRules] = useState<SoDConflictRule[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_SOD`);
    return saved ? JSON.parse(saved) : initialSodRules;
  });

  const [controlTests, setControlTests] = useState<ControlTestRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_CTRLTESTS`);
    return saved ? JSON.parse(saved) : initialControlTests;
  });

  const [riskItems, setRiskItems] = useState<RiskItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_RISK`);
    return saved ? JSON.parse(saved) : initialRisks;
  });

  const [auditEngagements, setAuditEngagements] = useState<AuditPlanEngagement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ENG`);
    return saved ? JSON.parse(saved) : initialAuditEngagements;
  });

  const [auditPrograms, setAuditPrograms] = useState<AuditProgramStep[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_PRG`);
    return saved ? JSON.parse(saved) : initialAuditPrograms;
  });

  const [auditFindings, setAuditFindings] = useState<AuditFinding[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_FIND`);
    return saved ? JSON.parse(saved) : initialAuditFindings;
  });

  const [auditorProfiles] = useState<ExternalAuditorProfile[]>(initialAuditors);

  const [pbcRequests, setPbcRequests] = useState<ExternalPBCRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_PBC`);
    return saved ? JSON.parse(saved) : initialPbcRequests;
  });

  const [auditResponses, setAuditResponses] = useState<ExternalAuditQueryResponse[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_RESP`);
    return saved ? JSON.parse(saved) : initialAuditResponses;
  });

  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveActionItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_CAPA`);
    return saved ? JSON.parse(saved) : initialCorrectiveActions;
  });

  const [fraudAlerts, setFraudAlerts] = useState<FraudRedFlagAlert[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ALERTS`);
    return saved ? JSON.parse(saved) : initialFraudAlerts;
  });

  const [benfordData] = useState<BenfordAnalysisItem[]>(initialBenfordData);
  const [policyDeclarations] = useState<PolicyDeclaration[]>(initialPolicyDeclarations);
  const [retentionRules] = useState<DocumentRetentionRule[]>(initialRetentionRules);
  const [isAiScanning, setIsAiScanning] = useState<boolean>(false);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_REQ`, JSON.stringify(regulatoryRequirements));
  }, [regulatoryRequirements]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_CAL`, JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_VAT`, JSON.stringify(vatRecords));
  }, [vatRecords]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_TAXRET`, JSON.stringify(statutoryTaxReturns));
  }, [statutoryTaxReturns]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_CTRL`, JSON.stringify(controlActivities));
  }, [controlActivities]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_SOD`, JSON.stringify(sodRules));
  }, [sodRules]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_RISK`, JSON.stringify(riskItems));
  }, [riskItems]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_FIND`, JSON.stringify(auditFindings));
  }, [auditFindings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_PBC`, JSON.stringify(pbcRequests));
  }, [pbcRequests]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_CAPA`, JSON.stringify(correctiveActions));
  }, [correctiveActions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_ALERTS`, JSON.stringify(fraudAlerts));
  }, [fraudAlerts]);

  // ----------------------------------------------------
  // HANDLERS & STATE MUTATORS
  // ----------------------------------------------------

  // 17.01 Regulatory
  const addRegulatoryRequirement = (req: Omit<RegulatoryRequirement, 'id'>) => {
    const newReq: RegulatoryRequirement = {
      ...req,
      id: `REQ-${Date.now().toString().slice(-4)}`
    };
    setRegulatoryRequirements(prev => [newReq, ...prev]);
  };

  const updateRegulatoryRequirement = (id: string, updates: Partial<RegulatoryRequirement>) => {
    setRegulatoryRequirements(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const addCalendarEvent = (event: Omit<ComplianceCalendarEvent, 'id'>) => {
    const newEvent: ComplianceCalendarEvent = {
      ...event,
      id: `CAL-${Date.now().toString().slice(-4)}`
    };
    setCalendarEvents(prev => [...prev, newEvent]);
  };

  const updateCalendarEvent = (id: string, updates: Partial<ComplianceCalendarEvent>) => {
    setCalendarEvents(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // 17.02 Tax
  const addVatRecord = (record: Omit<VATComplianceRecord, 'id'>) => {
    const newRec: VATComplianceRecord = {
      ...record,
      id: `VAT-REC-${Date.now().toString().slice(-4)}`
    };
    setVatRecords(prev => [newRec, ...prev]);
  };

  const updateTaxReturnStatus = (id: string, status: StatutoryTaxReturn['status'], paymentRef?: string) => {
    setStatutoryTaxReturns(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              status,
              paymentStatus: status === 'AUTHORITY_ACCEPTED' ? 'PAID' : item.paymentStatus,
              paymentReference: paymentRef || item.paymentReference,
              submissionDate: item.submissionDate || new Date().toISOString().split('T')[0]
            }
          : item
      )
    );
  };

  const addTaxSchedule = (sched: Omit<TaxScheduleItem, 'id'>) => {
    const newSched: TaxScheduleItem = {
      ...sched,
      id: `SCH-${Date.now().toString().slice(-4)}`
    };
    setTaxSchedules(prev => [...prev, newSched]);
  };

  // 17.03 Controls
  const addControlActivity = (ctrl: Omit<ControlActivity, 'id'>) => {
    const newCtrl: ControlActivity = {
      ...ctrl,
      id: `CTRL-${Date.now().toString().slice(-4)}`
    };
    setControlActivities(prev => [...prev, newCtrl]);
  };

  const recordControlTest = (test: Omit<ControlTestRecord, 'id'>) => {
    const newTest: ControlTestRecord = {
      ...test,
      id: `TEST-${Date.now().toString().slice(-4)}`
    };
    setControlTests(prev => [newTest, ...prev]);
    // Also update target control activity status
    setControlActivities(prev =>
      prev.map(c =>
        c.code === test.controlCode
          ? {
              ...c,
              lastTestedDate: test.completedDate,
              testResult: test.testConclusion === 'OPERATING_EFFECTIVELY' ? 'PASS' : 'FAIL',
              status: test.testConclusion === 'OPERATING_EFFECTIVELY' ? 'EFFECTIVE' : 'DEFICIENT'
            }
          : c
      )
    );
  };

  const updateApprovalRule = (id: string, updates: Partial<ApprovalControlRule>) => {
    setApprovalRules(prev =>
      prev.map(rule => (rule.id === id ? { ...rule, ...updates } : rule))
    );
  };

  const resolveSodViolation = (ruleId: string, userId: string, mitigatingControl: string, approvedBy: string) => {
    setSodRules(prev =>
      prev.map(rule => {
        if (rule.id !== ruleId) return rule;
        return {
          ...rule,
          activeViolations: rule.activeViolations.map(v =>
            v.userId === userId
              ? { ...v, mitigatingControl, exceptionApprovedBy: approvedBy }
              : v
          )
        };
      })
    );
  };

  // 17.04 Risk
  const calculateRiskLevel = (score: number): RiskLevel => {
    if (score >= 15) return 'CRITICAL';
    if (score >= 10) return 'HIGH';
    if (score >= 5) return 'MEDIUM';
    return 'LOW';
  };

  const addRiskItem = (risk: Omit<RiskItem, 'id' | 'inherentScore' | 'residualScore'>) => {
    const inherentScore = risk.inherentLikelihood * risk.inherentImpact;
    const residualScore = risk.residualLikelihood * risk.residualImpact;
    const newRisk: RiskItem = {
      ...risk,
      id: `RSK-${Date.now().toString().slice(-4)}`,
      inherentScore,
      inherentLevel: calculateRiskLevel(inherentScore),
      residualScore,
      residualLevel: calculateRiskLevel(residualScore)
    };
    setRiskItems(prev => [newRisk, ...prev]);
  };

  const updateRiskItem = (id: string, updates: Partial<RiskItem>) => {
    setRiskItems(prev =>
      prev.map(risk => {
        if (risk.id !== id) return risk;
        const updated = { ...risk, ...updates };
        const inherentScore = updated.inherentLikelihood * updated.inherentImpact;
        const residualScore = updated.residualLikelihood * updated.residualImpact;
        return {
          ...updated,
          inherentScore,
          inherentLevel: calculateRiskLevel(inherentScore),
          residualScore,
          residualLevel: calculateRiskLevel(residualScore)
        };
      })
    );
  };

  // 17.05 Internal Audit
  const addAuditEngagement = (engagement: Omit<AuditPlanEngagement, 'id'>) => {
    const newEng: AuditPlanEngagement = {
      ...engagement,
      id: `ENG-${Date.now().toString().slice(-4)}`
    };
    setAuditEngagements(prev => [...prev, newEng]);
  };

  const addAuditFinding = (finding: Omit<AuditFinding, 'id'>) => {
    const newFinding: AuditFinding = {
      ...finding,
      id: `FND-${Date.now().toString().slice(-4)}`
    };
    setAuditFindings(prev => [newFinding, ...prev]);
  };

  const updateAuditFinding = (id: string, updates: Partial<AuditFinding>) => {
    setAuditFindings(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // 17.06 External Audit
  const updatePbcStatus = (id: string, status: ExternalPBCRequest['status'], fileAttachment?: string) => {
    setPbcRequests(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              status,
              fileAttachment: fileAttachment || item.fileAttachment
            }
          : item
      )
    );
  };

  const addAuditQueryResponse = (resp: Omit<ExternalAuditQueryResponse, 'id'>) => {
    const newResp: ExternalAuditQueryResponse = {
      ...resp,
      id: `QRY-${Date.now().toString().slice(-4)}`
    };
    setAuditResponses(prev => [...prev, newResp]);
  };

  const updateAuditQueryResponse = (id: string, updates: Partial<ExternalAuditQueryResponse>) => {
    setAuditResponses(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // 17.07 Corrective Actions
  const addCorrectiveAction = (action: Omit<CorrectiveActionItem, 'id'>) => {
    const newAction: CorrectiveActionItem = {
      ...action,
      id: `CAPA-${Date.now().toString().slice(-4)}`
    };
    setCorrectiveActions(prev => [newAction, ...prev]);
  };

  const updateCorrectiveAction = (id: string, updates: Partial<CorrectiveActionItem>) => {
    setCorrectiveActions(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const verifyAndCloseCapa = (id: string, signoffBy: string, notes: string) => {
    setCorrectiveActions(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              status: 'VERIFIED_CLOSED',
              completionPercentage: 100,
              closureSignoffBy: signoffBy,
              closureSignoffDate: new Date().toISOString().split('T')[0],
              closureNotes: notes
            }
          : item
      )
    );
  };

  // 17.08 Fraud & Anomaly
  const updateFraudAlertStatus = (
    id: string,
    status: FraudRedFlagAlert['investigationStatus'],
    notes?: string
  ) => {
    setFraudAlerts(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              investigationStatus: status,
              investigatorNotes: notes || item.investigatorNotes
            }
          : item
      )
    );
  };

  const runAiAnomalyScan = () => {
    setIsAiScanning(true);
    setTimeout(() => {
      // Simulate real AI analysis finding an additional anomalous pattern
      const newAlert: FraudRedFlagAlert = {
        id: `ALERT-${Date.now().toString().slice(-4)}`,
        alertCode: `RED-2026-${Math.floor(100 + Math.random() * 900)}`,
        alertType: 'BENFORD_ANOMALY',
        detectionTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        severity: 'MEDIUM',
        transactionReference: 'General Ledger Batch #GL-2026-088',
        amountOMR: 44000.00,
        entityInvolved: 'Accounts Payable Batch Posting',
        anomalyDescription: 'Digit 4 frequency exceeds Benford standard distribution by 1.7% in vouchers between OMR 4,000 and OMR 4,999.',
        aiRiskScore: 74,
        aiSuggestedAction: 'Sample all 4,000-range vouchers created by procurement clerks for approval threshold splitting.',
        investigationStatus: 'NEW'
      };
      setFraudAlerts(prev => [newAlert, ...prev]);
      setIsAiScanning(false);
    }, 1500);
  };

  // ----------------------------------------------------
  // EXECUTIVE METRICS CALCULATION
  // ----------------------------------------------------
  const compliantCount = regulatoryRequirements.filter(r => r.status === 'COMPLIANT').length;
  const overallComplianceScore = Math.round(
    (regulatoryRequirements.reduce((acc, curr) => acc + curr.complianceScore, 0) /
      (regulatoryRequirements.length || 1))
  );
  const openAuditFindingsCount = auditFindings.filter(f => f.status !== 'VERIFIED_CLOSED').length;
  const highRiskCount = riskItems.filter(r => r.residualLevel === 'CRITICAL' || r.residualLevel === 'HIGH').length;
  const activeFraudAlertsCount = fraudAlerts.filter(a => a.investigationStatus === 'NEW' || a.investigationStatus === 'UNDER_INVESTIGATION').length;
  const sodViolationsCount = sodRules.reduce((acc, curr) => acc + curr.activeViolations.length, 0);
  const pbcFulfillmentRate = Math.round(
    ((pbcRequests.filter(p => p.status === 'SUBMITTED' || p.status === 'ACCEPTED').length) /
      (pbcRequests.length || 1)) *
      100
  );

  const metrics: ComplianceExecutiveMetrics = {
    overallComplianceScore,
    totalRegulatoryObligations: regulatoryRequirements.length,
    compliantCount,
    imminentDeadlinesCount: calendarEvents.filter(c => c.status === 'PENDING').length,
    openAuditFindingsCount,
    highRiskCount,
    activeFraudAlertsCount,
    sodViolationsCount,
    pbcFulfillmentRate
  };

  return (
    <ComplianceContext.Provider
      value={{
        regulatoryRequirements,
        calendarEvents,
        scorecards,
        addRegulatoryRequirement,
        updateRegulatoryRequirement,
        addCalendarEvent,
        updateCalendarEvent,
        vatRecords,
        taxSchedules,
        statutoryTaxReturns,
        statutoryReports,
        addVatRecord,
        updateTaxReturnStatus,
        addTaxSchedule,
        controlActivities,
        approvalRules,
        sodRules,
        controlTests,
        addControlActivity,
        recordControlTest,
        updateApprovalRule,
        resolveSodViolation,
        riskItems,
        addRiskItem,
        updateRiskItem,
        auditEngagements,
        auditPrograms,
        auditFindings,
        addAuditEngagement,
        addAuditFinding,
        updateAuditFinding,
        auditorProfiles,
        pbcRequests,
        auditResponses,
        updatePbcStatus,
        addAuditQueryResponse,
        updateAuditQueryResponse,
        correctiveActions,
        addCorrectiveAction,
        updateCorrectiveAction,
        verifyAndCloseCapa,
        fraudAlerts,
        benfordData,
        policyDeclarations,
        retentionRules,
        updateFraudAlertStatus,
        runAiAnomalyScan,
        isAiScanning,
        metrics
      }}
    >
      {children}
    </ComplianceContext.Provider>
  );
};

export const useComplianceStore = () => {
  const context = useContext(ComplianceContext);
  if (!context) {
    throw new Error('useComplianceStore must be used within a ComplianceProvider');
  }
  return context;
};

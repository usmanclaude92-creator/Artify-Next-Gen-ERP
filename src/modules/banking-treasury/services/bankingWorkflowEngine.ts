// ============================================================================
// Artify ERP — Module 04: Banking & Treasury Management
// Enterprise Workflow Engine, Segregation of Duties (SoD), Delegation of Authority (DoA)
// Multi-Tier Sequential Approvals & Double-Entry Accounting GL Posting Engine
// ============================================================================

import {
  UserContext,
  WorkflowApproverStage,
  WorkflowEvaluationResult,
  CurrencyCode,
  BankingGLJournalEntry,
  BankingAuditLogRecord
} from '../types';

export const ENTERPRISE_BANKING_ACTORS: UserContext[] = [
  {
    id: 'usr-cfo',
    userId: 'U1001',
    name: 'Sarah Jenkins',
    email: 's.jenkins@artify-group.com',
    role: 'Group Chief Financial Officer (CFO)',
    department: 'Corporate Finance & Treasury',
    approvalLimitOMR: 100000,
    signatoryTier: 'Category A (Executive)',
    employeeRef: 'EMP-00102',
    branch: 'Muscat HQ'
  },
  {
    id: 'usr-ceo',
    userId: 'U1002',
    name: 'Eng. Salim Al-Rawahi',
    email: 's.alrawahi@artify-group.com',
    role: 'Group Chief Executive Officer (CEO)',
    department: 'Executive Directorate',
    approvalLimitOMR: 500000,
    signatoryTier: 'Category A (Executive)',
    employeeRef: 'EMP-00001',
    branch: 'Muscat HQ'
  },
  {
    id: 'usr-treasury-dir',
    userId: 'U1003',
    name: 'Dr. Tariq Al-Habsi',
    email: 't.alhabsi@artify-group.com',
    role: 'Head of Treasury & Director of Finance',
    department: 'Corporate Finance & Treasury',
    approvalLimitOMR: 25000,
    signatoryTier: 'Category B (Senior Management)',
    employeeRef: 'EMP-00045',
    branch: 'Muscat HQ'
  },
  {
    id: 'usr-treasury-ops',
    userId: 'U1004',
    name: 'Hilal Al-Kharusi',
    email: 'h.alkharusi@artify-group.com',
    role: 'Senior Treasury Specialist (Maker/Checker)',
    department: 'Corporate Finance & Treasury',
    approvalLimitOMR: 10000,
    signatoryTier: 'Category C (Operational Finance)',
    employeeRef: 'EMP-00188',
    branch: 'Muscat HQ'
  },
  {
    id: 'usr-cashier',
    userId: 'U1005',
    name: 'Salim Al-Ghafri',
    email: 's.alghafri@artify-group.com',
    role: 'Chief Cashier & Vault Custodian',
    department: 'Treasury Cash Operations',
    approvalLimitOMR: 2500,
    signatoryTier: 'Category C (Operational Finance)',
    employeeRef: 'EMP-00304',
    branch: 'Muscat Main Branch'
  },
  {
    id: 'usr-requester',
    userId: 'U1012',
    name: 'Fatima Al-Riyami',
    email: 'f.riyami@artify-group.com',
    role: 'Senior Commercial Executive (Preparer)',
    department: 'Commercial Business Development',
    approvalLimitOMR: 500,
    employeeRef: 'EMP-00891',
    branch: 'Muscat HQ'
  }
];

export class BankingWorkflowEngine {
  /**
   * Evaluate multi-tier approval hierarchy based on transaction parameters, amount in OMR, and risk factors
   */
  public static evaluatePaymentWorkflow(
    transactionType: 'Bank Wire Transfer' | 'Cheque Release' | 'Electronic Batch (WPS)' | 'Urgent High-Value Payment' | 'Cash Disbursement' | 'Petty Cash Advance' | 'Reconciliation Adjustment',
    amountInOMR: number,
    beneficiaryOrPayee: string,
    urgency: 'Standard' | 'Urgent / Same-Day' | 'Critical SLA' = 'Standard',
    isCrossBorder: boolean = false
  ): WorkflowEvaluationResult {
    let stages: WorkflowApproverStage[] = [];
    let workflowCode = 'WF-BNK-DISB-01';
    let workflowName = 'Standard Treasury Disbursement Matrix';
    const sodRulesApplied = [
      'SOD-BNK-01 (Prohibition of Self-Approval / Maker-Checker Separation)',
      'SOD-BNK-02 (Dual Signatory Specimen Mandate for High Value)'
    ];
    let requiresExecutiveSignoff = false;
    let requiresDualSignatory = false;

    // TIER 1: Low-Value Transactions (<= 2,500 OMR)
    if (amountInOMR <= 2500 && urgency === 'Standard') {
      workflowCode = 'WF-BNK-LV-01';
      workflowName = 'Level 1: Operational Treasury Verification (≤ 2,500 OMR)';
      stages = [
        {
          level: 1,
          role: 'Treasury Operations Lead / Verifier',
          approverName: 'Hilal Al-Kharusi',
          approverUserId: 'usr-treasury-ops',
          approvalLimitOMR: 10000,
          status: 'Pending',
          requiredSlaHours: 12,
          signatoryTierRequired: 'Category C (Operational Finance)'
        }
      ];
    }
    // TIER 2: Medium-Value Transactions (2,500 - 25,000 OMR)
    else if (amountInOMR <= 25000) {
      workflowCode = 'WF-BNK-MV-02';
      workflowName = 'Level 2: Dual Treasury Sign-off (2,500 - 25,000 OMR)';
      stages = [
        {
          level: 1,
          role: 'Treasury Specialist (Verification & Compliance Check)',
          approverName: 'Hilal Al-Kharusi',
          approverUserId: 'usr-treasury-ops',
          approvalLimitOMR: 10000,
          status: 'Pending',
          requiredSlaHours: 12,
          signatoryTierRequired: 'Category C (Operational Finance)'
        },
        {
          level: 2,
          role: 'Head of Treasury & Director of Finance',
          approverName: 'Dr. Tariq Al-Habsi',
          approverUserId: 'usr-treasury-dir',
          approvalLimitOMR: 25000,
          status: 'Waiting',
          requiredSlaHours: 24,
          signatoryTierRequired: 'Category B (Senior Management)'
        }
      ];
    }
    // TIER 3: High-Value Transactions (25,000 - 100,000 OMR)
    else if (amountInOMR <= 100000) {
      requiresExecutiveSignoff = true;
      requiresDualSignatory = true;
      workflowCode = 'WF-BNK-HV-03';
      workflowName = 'Level 3: Executive Dual Signatory Approval (25,000 - 100,000 OMR)';
      sodRulesApplied.push('MANDATE-CAT-A: Requires Category A Signatory (Group CFO)');

      stages = [
        {
          level: 1,
          role: 'Head of Treasury (Category B Signatory)',
          approverName: 'Dr. Tariq Al-Habsi',
          approverUserId: 'usr-treasury-dir',
          approvalLimitOMR: 25000,
          status: 'Pending',
          requiredSlaHours: 12,
          signatoryTierRequired: 'Category B (Senior Management)'
        },
        {
          level: 2,
          role: 'Group Chief Financial Officer (CFO — Category A Signatory)',
          approverName: 'Sarah Jenkins',
          approverUserId: 'usr-cfo',
          approvalLimitOMR: 100000,
          status: 'Waiting',
          requiredSlaHours: 24,
          signatoryTierRequired: 'Category A (Executive)'
        }
      ];
    }
    // TIER 4: Ultra High-Value (> 100,000 OMR) or Urgent SLA or Cross-Border
    else {
      requiresExecutiveSignoff = true;
      requiresDualSignatory = true;
      workflowCode = 'WF-BNK-BOARD-04';
      workflowName = 'Level 4: Executive Board Mandate (> 100,000 OMR / Strategic Treasury)';
      sodRulesApplied.push('MANDATE-CAT-A-DUAL: Dual Category A Signatories (CFO + Group CEO Required)');

      stages = [
        {
          level: 1,
          role: 'Head of Treasury (Technical Validation)',
          approverName: 'Dr. Tariq Al-Habsi',
          approverUserId: 'usr-treasury-dir',
          approvalLimitOMR: 25000,
          status: 'Pending',
          requiredSlaHours: 6,
          signatoryTierRequired: 'Category B (Senior Management)'
        },
        {
          level: 2,
          role: 'Group CFO (Category A Primary Signatory)',
          approverName: 'Sarah Jenkins',
          approverUserId: 'usr-cfo',
          approvalLimitOMR: 100000,
          status: 'Waiting',
          requiredSlaHours: 12,
          signatoryTierRequired: 'Category A (Executive)'
        },
        {
          level: 3,
          role: 'Group CEO (Category A Final Signatory)',
          approverName: 'Eng. Salim Al-Rawahi',
          approverUserId: 'usr-ceo',
          approvalLimitOMR: 500000,
          status: 'Waiting',
          requiredSlaHours: 24,
          signatoryTierRequired: 'Category A (Executive)'
        }
      ];
    }

    return {
      workflowCode,
      workflowName,
      totalLevels: stages.length,
      stages,
      sodRulesApplied,
      requiresExecutiveSignoff,
      requiresDualSignatory
    };
  }

  /**
   * Validate submission payload against security policy SEC-AUTH-04.
   * Rejects direct creation of transactions in Approved/Posted state.
   */
  public static validateSubmission(payload: {
    status?: string;
    preparedBy?: string;
    requestedBy?: string;
    amount?: number;
    beneficiaryName?: string;
    payeeName?: string;
  }): { isValid: boolean; error?: string } {
    if (payload.status === 'Approved' || payload.status === 'Posted' || payload.status === 'Cleared') {
      return {
        isValid: false,
        error:
          'Security Policy Violation (SEC-AUTH-04): Direct creation of Approved/Posted/Cleared transactional records is forbidden. All payment and disbursement vouchers must be submitted in "Draft" or "Submitted" status and pass through the sequential workflow approval engine.'
      };
    }

    const maker = payload.preparedBy || payload.requestedBy;
    if (!maker || !maker.trim()) {
      return {
        isValid: false,
        error: 'Validation Error: Preparer identity and user attribution are mandatory for all banking vouchers.'
      };
    }

    if (payload.amount !== undefined && payload.amount <= 0) {
      return {
        isValid: false,
        error: 'Validation Error: Transaction amount must be greater than zero.'
      };
    }

    return { isValid: true };
  }

  /**
   * Strictly enforces Segregation of Duties (SoD), Delegation of Authority (DoA) limits,
   * sequential stage progression, and Signatory Specimen Mandates on approval execution.
   */
  public static validateApprovalAuthority(
    transaction: {
      id?: string;
      transactionRef?: string;
      submittedBy?: string;
      preparedBy?: string;
      makerUserId?: string;
      amountInOMR?: number;
      amount?: number;
      currentStep?: number;
      totalSteps?: number;
      approverStages?: WorkflowApproverStage[];
      requiredApprovalLevel?: string;
    },
    approver: UserContext
  ): { isAuthorized: boolean; error?: string; violationCode?: string } {
    const makerName = (transaction.submittedBy || transaction.preparedBy || '').trim().toLowerCase();
    const actorName = approver.name.trim().toLowerCase();
    const makerUserId = (transaction.makerUserId || '').trim().toLowerCase();
    const actorUserId = (approver.userId || approver.id || '').trim().toLowerCase();

    // 1. SEGREGATION OF DUTIES (SoD) RULE: PROHIBITION OF SELF-APPROVAL (SOD-BNK-01)
    if (
      (makerName && actorName && (makerName === actorName || makerName.includes(actorName) || actorName.includes(makerName))) ||
      (makerUserId && actorUserId && makerUserId === actorUserId)
    ) {
      return {
        isAuthorized: false,
        violationCode: 'SOD-BNK-01',
        error: `Segregation of Duties Violation (SOD-BNK-01): The preparer/maker "${approver.name}" is strictly prohibited from approving their own disbursement voucher. An independent checker or authorized signatory must execute the sign-off.`
      };
    }

    // 2. SEQUENTIAL STAGE VERIFICATION
    const currentLevel = transaction.currentStep || 1;
    const stages = transaction.approverStages || [];
    const activeStage = stages.find((s) => s.level === currentLevel);

    if (activeStage && activeStage.status === 'Approved') {
      return {
        isAuthorized: false,
        error: `Workflow Stage Conflict: Level ${currentLevel} (${activeStage.role}) has already been approved.`
      };
    }

    // 3. DELEGATION OF AUTHORITY (DoA) / FINANCIAL LIMIT VERIFICATION
    const amountOMR = transaction.amountInOMR || transaction.amount || 0;
    if (amountOMR > 0 && approver.approvalLimitOMR < amountOMR) {
      return {
        isAuthorized: false,
        violationCode: 'DOA-LIMIT-EXCEEDED',
        error: `Delegation of Authority Breach (DOA-BNK-01): Approver "${approver.name}" has an authorization ceiling of OMR ${approver.approvalLimitOMR.toLocaleString()}, which is insufficient for this transaction of OMR ${amountOMR.toLocaleString()}. Escalation to a higher authority tier is mandatory.`
      };
    }

    return { isAuthorized: true };
  }

  /**
   * Generates a balanced double-entry General Ledger (GL) journal voucher
   * when a Banking or Treasury transaction is posted.
   */
  public static generateGLAccountingImpact(
    transactionType: 'BANK_PAYMENT' | 'CUSTOMER_RECEIPT' | 'CASH_PAYMENT' | 'CASH_RECEIPT' | 'PDC_CLEARING' | 'RECON_ADJUSTMENT' | 'PETTY_CASH_SETTLE',
    details: {
      transactionRef: string;
      amountOMR: number;
      currency: CurrencyCode;
      bankAccountName?: string;
      bankGlCode?: string;
      offsetAccountCode?: string;
      offsetAccountName?: string;
      payeeOrCustomerName?: string;
      narration?: string;
      postedBy: string;
    }
  ): BankingGLJournalEntry {
    const seq = Math.floor(Math.random() * 9000) + 1000;
    const voucherNumber = `JV-BNK-2026-${seq}`;
    const today = new Date().toISOString().split('T')[0];

    const bankGl = details.bankGlCode || '1010-01-001';
    const bankName = details.bankAccountName || 'Bank Muscat — Operating Current A/C';
    const offsetGl = details.offsetAccountCode || '2010-01-001';
    const offsetName = details.offsetAccountName || 'Trade Accounts Payable';

    let lines = [];

    if (transactionType === 'BANK_PAYMENT') {
      // Debit Accounts Payable / Expense, Credit Bank GL
      lines = [
        {
          id: `gl-line-${Date.now()}-1`,
          accountId: offsetGl,
          accountCode: offsetGl,
          accountName: offsetName,
          debit: details.amountOMR,
          credit: 0,
          description: `Disbursement to ${details.payeeOrCustomerName || 'Vendor'}`
        },
        {
          id: `gl-line-${Date.now()}-2`,
          accountId: bankGl,
          accountCode: bankGl,
          accountName: bankName,
          debit: 0,
          credit: details.amountOMR,
          description: `Bank wire settlement ref ${details.transactionRef}`
        }
      ];
    } else if (transactionType === 'CUSTOMER_RECEIPT') {
      // Debit Bank GL, Credit Trade Accounts Receivable
      lines = [
        {
          id: `gl-line-${Date.now()}-1`,
          accountId: bankGl,
          accountCode: bankGl,
          accountName: bankName,
          debit: details.amountOMR,
          credit: 0,
          description: `Collection from ${details.payeeOrCustomerName || 'Customer'}`
        },
        {
          id: `gl-line-${Date.now()}-2`,
          accountId: offsetGl || '1020-01-001',
          accountCode: offsetGl || '1020-01-001',
          accountName: offsetName || 'Trade Accounts Receivable',
          debit: 0,
          credit: details.amountOMR,
          description: `Settlement receipt ref ${details.transactionRef}`
        }
      ];
    } else if (transactionType === 'CASH_PAYMENT') {
      // Debit Expense GL, Credit Cash Vault GL
      lines = [
        {
          id: `gl-line-${Date.now()}-1`,
          accountId: offsetGl || '6020-01-001',
          accountCode: offsetGl || '6020-01-001',
          accountName: offsetName || 'Operational Cash Expenses',
          debit: details.amountOMR,
          credit: 0,
          description: `Cash disbursement to ${details.payeeOrCustomerName || 'Payee'}`
        },
        {
          id: `gl-line-${Date.now()}-2`,
          accountId: '1020-01-004',
          accountCode: '1020-01-004',
          accountName: 'Muscat HQ Main Cash Vault',
          debit: 0,
          credit: details.amountOMR,
          description: `Cash voucher payment ref ${details.transactionRef}`
        }
      ];
    } else if (transactionType === 'CASH_RECEIPT') {
      // Debit Cash Vault GL, Credit Income/Customer AR GL
      lines = [
        {
          id: `gl-line-${Date.now()}-1`,
          accountId: '1020-01-004',
          accountCode: '1020-01-004',
          accountName: 'Muscat HQ Main Cash Vault',
          debit: details.amountOMR,
          credit: 0,
          description: `Cash received from ${details.payeeOrCustomerName || 'Customer'}`
        },
        {
          id: `gl-line-${Date.now()}-2`,
          accountId: offsetGl || '4030-01-001',
          accountCode: offsetGl || '4030-01-001',
          accountName: offsetName || 'Counter Cash Sales / AR Collection',
          debit: 0,
          credit: details.amountOMR,
          description: `Cash receipt ref ${details.transactionRef}`
        }
      ];
    } else if (transactionType === 'RECON_ADJUSTMENT') {
      // Debit Bank Charges / Overdraft Interest GL, Credit Bank GL
      lines = [
        {
          id: `gl-line-${Date.now()}-1`,
          accountId: offsetGl || '5090-01-001',
          accountCode: offsetGl || '5090-01-001',
          accountName: offsetName || 'Bank Charges & Commissions',
          debit: details.amountOMR,
          credit: 0,
          description: details.narration || 'Monthly bank statement reconciliation adjustment'
        },
        {
          id: `gl-line-${Date.now()}-2`,
          accountId: bankGl,
          accountCode: bankGl,
          accountName: bankName,
          debit: 0,
          credit: details.amountOMR,
          description: `Bank charge adjustment on account ${bankName}`
        }
      ];
    } else {
      // Generic balanced voucher
      lines = [
        {
          id: `gl-line-${Date.now()}-1`,
          accountId: offsetGl,
          accountCode: offsetGl,
          accountName: offsetName,
          debit: details.amountOMR,
          credit: 0,
          description: details.narration || `Treasury GL entry ${details.transactionRef}`
        },
        {
          id: `gl-line-${Date.now()}-2`,
          accountId: bankGl,
          accountCode: bankGl,
          accountName: bankName,
          debit: 0,
          credit: details.amountOMR,
          description: `Treasury offset ${details.transactionRef}`
        }
      ];
    }

    return {
      id: `jv-${Date.now()}`,
      voucherNumber,
      voucherDate: today,
      postingDate: today,
      sourceModule: '04-BANKING-TREASURY',
      sourceTransactionRef: details.transactionRef,
      sourceTransactionType: transactionType,
      narration: details.narration || `${transactionType} settlement for ${details.payeeOrCustomerName || details.transactionRef}`,
      currency: details.currency || 'OMR',
      totalDebit: details.amountOMR,
      totalCredit: details.amountOMR,
      status: 'POSTED',
      postedBy: details.postedBy,
      lines
    };
  }

  /**
   * Write tamper-evident audit record to localStorage and return record
   */
  public static logAuditAction(payload: {
    actor: UserContext;
    action: BankingAuditLogRecord['action'];
    entityType: BankingAuditLogRecord['entityType'];
    entityId: string;
    entityReference: string;
    amountOMR?: number;
    details: string;
    statusBefore?: string;
    statusAfter?: string;
    violationCode?: string;
  }): BankingAuditLogRecord {
    const record: BankingAuditLogRecord = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actorName: payload.actor.name,
      actorRole: payload.actor.role,
      actorUserId: payload.actor.userId,
      action: payload.action,
      entityType: payload.entityType,
      entityId: payload.entityId,
      entityReference: payload.entityReference,
      amountOMR: payload.amountOMR,
      details: payload.details,
      statusBefore: payload.statusBefore,
      statusAfter: payload.statusAfter,
      violationCode: payload.violationCode
    };

    try {
      const existing = localStorage.getItem('artify_bnk_audit_trail');
      const logs: BankingAuditLogRecord[] = existing ? JSON.parse(existing) : [];
      logs.unshift(record);
      if (logs.length > 500) logs.pop();
      localStorage.setItem('artify_bnk_audit_trail', JSON.stringify(logs));
    } catch (e) {
      console.warn('Could not persist audit record to localStorage', e);
    }

    return record;
  }
}

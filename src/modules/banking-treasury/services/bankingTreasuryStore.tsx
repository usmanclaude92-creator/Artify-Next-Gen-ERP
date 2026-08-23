import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BankMasterRecord,
  BankAccountRecord,
  BankSignatoryRecord,
  BankLimitRecord,
  CashAccountRecord,
  CashReceiptRecord,
  CashPaymentRecord,
  CashPositionSummary,
  BankPaymentRecord,
  ChequePaymentRecord,
  ElectronicPaymentBatch,
  PaymentApprovalQueueItem,
  CustomerReceiptRecord,
  OtherReceiptRecord,
  BankDepositSlipRecord,
  ReceiptAllocationItem,
  BankStatementImportRecord,
  BankStatementLine,
  ReconciliationAdjustmentRecord,
  PettyCashAccountRecord,
  PettyCashAdvanceRecord,
  PettyCashExpenseRecord,
  PettyCashReconciliationRecord,
  CashFlowForecastItem,
  BankFacilityRecord,
  BankChargeAuditRecord,
  PostDatedChequeRecord,
  TransactionStatus,
  PDCStatus,
  UserContext,
  WorkflowApproverStage,
  WorkflowEvaluationResult,
  BankingGLJournalEntry,
  BankingAuditLogRecord
} from '../types';
import {
  mockBankMasters,
  mockBankAccounts,
  mockBankSignatories,
  mockBankLimits,
  mockCashAccounts,
  mockCashReceipts,
  mockCashPayments,
  mockCashPositionSummary,
  mockBankPayments,
  mockChequePayments,
  mockElectronicBatches,
  mockPaymentApprovalQueue,
  mockCustomerReceipts,
  mockOtherReceipts,
  mockDepositSlips,
  mockReceiptAllocations,
  mockStatementImports,
  mockStatementLines,
  mockReconciliationAdjustments,
  mockPettyCashAccounts,
  mockPettyCashAdvances,
  mockPettyCashExpenses,
  mockPettyCashReconciliations,
  mockCashFlowForecast,
  mockBankFacilities,
  mockBankChargeAudits,
  mockPostDatedCheques
} from '../data/mockBankingTreasuryData';
import { BankingWorkflowEngine, ENTERPRISE_BANKING_ACTORS } from './bankingWorkflowEngine';

const STORAGE_KEY = 'ARTIFY_ERP_BANKING_TREASURY_V2';

interface BankingTreasuryContextType {
  // Active User / Actor Simulation
  activeActor: UserContext;
  setActiveActor: (actor: UserContext) => void;
  availableActors: UserContext[];
  evaluateWorkflowTiers: (
    type: 'Bank Wire Transfer' | 'Cheque Release' | 'Electronic Batch (WPS)' | 'Urgent High-Value Payment' | 'Cash Disbursement' | 'Petty Cash Advance' | 'Reconciliation Adjustment',
    amountInOMR: number,
    beneficiaryOrPayee: string,
    urgency?: 'Standard' | 'Urgent / Same-Day' | 'Critical SLA'
  ) => WorkflowEvaluationResult;

  // 04.01 Bank Management
  bankMasters: BankMasterRecord[];
  bankAccounts: BankAccountRecord[];
  bankSignatories: BankSignatoryRecord[];
  bankLimits: BankLimitRecord[];
  addBankMaster: (data: Omit<BankMasterRecord, 'id' | 'createdAt' | 'updatedAt' | 'totalAccountsLinked' | 'totalFacilitiesOMR'>) => void;
  addBankAccount: (data: Omit<BankAccountRecord, 'id' | 'currentBookBalance' | 'clearedBankBalance' | 'unreconciledDifference' | 'lastReconciledDate'>) => void;
  updateBankAccountStatus: (id: string, status: BankAccountRecord['status']) => void;
  addBankSignatory: (data: Omit<BankSignatoryRecord, 'id'>) => void;
  addBankLimit: (data: Omit<BankLimitRecord, 'id'>) => void;

  // 04.02 Cash Management
  cashAccounts: CashAccountRecord[];
  cashReceipts: CashReceiptRecord[];
  cashPayments: CashPaymentRecord[];
  cashPosition: CashPositionSummary;
  addCashAccount: (data: Omit<CashAccountRecord, 'id' | 'lastCountTimestamp'>) => void;
  recordCashReceipt: (data: Omit<CashReceiptRecord, 'id' | 'receiptNumber' | 'status'>) => void;
  recordCashPayment: (data: Omit<CashPaymentRecord, 'id' | 'voucherNumber' | 'status' | 'cashierSignatureDate'>) => { success: boolean; error?: string };
  updateCashPaymentStatus: (id: string, status: CashPaymentRecord['status']) => void;

  // 04.03 Payment Management
  bankPayments: BankPaymentRecord[];
  chequePayments: ChequePaymentRecord[];
  electronicBatches: ElectronicPaymentBatch[];
  approvalQueue: PaymentApprovalQueueItem[];
  createBankPayment: (data: Omit<BankPaymentRecord, 'id' | 'paymentReference' | 'status'>) => { success: boolean; error?: string; payment?: BankPaymentRecord };
  updateBankPaymentStatus: (id: string, status: TransactionStatus) => void;
  issueChequePayment: (data: Omit<ChequePaymentRecord, 'id' | 'status'>) => { success: boolean; error?: string };
  updateChequeStatus: (id: string, status: ChequePaymentRecord['status']) => void;
  createElectronicBatch: (data: Omit<ElectronicPaymentBatch, 'id' | 'batchNumber' | 'status'>) => { success: boolean; error?: string };
  processPaymentApproval: (queueItemId: string, decision: 'approve' | 'reject', comment?: string) => { success: boolean; error?: string; violationCode?: string; updatedStatus?: string; glVoucherId?: string };

  // 04.04 Receipt Management
  customerReceipts: CustomerReceiptRecord[];
  otherReceipts: OtherReceiptRecord[];
  depositSlips: BankDepositSlipRecord[];
  receiptAllocations: ReceiptAllocationItem[];
  recordCustomerReceipt: (data: Omit<CustomerReceiptRecord, 'id' | 'receiptNumber' | 'status' | 'allocatedAmount' | 'unallocatedAmount'>) => void;
  allocateReceiptToInvoice: (receiptId: string, invoiceNumber: string, invoiceOriginalAmount: number, allocateAmount: number) => void;
  recordOtherReceipt: (data: Omit<OtherReceiptRecord, 'id' | 'receiptNumber' | 'status'>) => void;
  generateDepositSlip: (data: Omit<BankDepositSlipRecord, 'id' | 'depositSlipNumber' | 'status'>) => void;

  // 04.05 Bank Reconciliation
  statementImports: BankStatementImportRecord[];
  statementLines: BankStatementLine[];
  reconciliationAdjustments: ReconciliationAdjustmentRecord[];
  importBankStatement: (bankAccountId: string, format: BankStatementImportRecord['importFormat'], filename: string, linesCount: number) => void;
  runAutoMatchingEngine: (statementImportId: string) => { matchedCount: number; unreconciledCount: number };
  toggleManualReconciliation: (lineId: string, isReconciled: boolean) => void;
  createReconciliationAdjustment: (data: Omit<ReconciliationAdjustmentRecord, 'id' | 'adjustmentNumber' | 'status'>) => void;

  // 04.06 Petty Cash
  pettyCashAccounts: PettyCashAccountRecord[];
  pettyCashAdvances: PettyCashAdvanceRecord[];
  pettyCashExpenses: PettyCashExpenseRecord[];
  pettyCashReconciliations: PettyCashReconciliationRecord[];
  addPettyCashAccount: (data: Omit<PettyCashAccountRecord, 'id'>) => void;
  issuePettyCashAdvance: (data: Omit<PettyCashAdvanceRecord, 'id' | 'advanceNumber' | 'status'>) => void;
  settlePettyCashAdvance: (advanceId: string, actualExpenseOMR: number, cashReturnedOMR: number) => void;
  submitPettyCashExpense: (data: Omit<PettyCashExpenseRecord, 'id' | 'voucherNumber' | 'status'>) => void;
  createPettyCashReconciliation: (accountId: string, countedCash: number) => void;

  // 04.07 Treasury Management
  cashFlowForecast: CashFlowForecastItem[];
  bankFacilities: BankFacilityRecord[];
  bankChargeAudits: BankChargeAuditRecord[];
  postDatedCheques: PostDatedChequeRecord[];
  addBankFacility: (data: Omit<BankFacilityRecord, 'id'>) => void;
  updateBankFacilityUtilization: (facilityId: string, newUtilizedAmount: number) => void;
  recordBankChargeAudit: (data: Omit<BankChargeAuditRecord, 'id' | 'auditRefNumber'>) => void;
  registerPostDatedCheque: (data: Omit<PostDatedChequeRecord, 'id' | 'pdcReference' | 'status' | 'daysUntilMaturity'>) => void;
  updatePDCStatus: (pdcId: string, newStatus: PDCStatus, clearingAccountId?: string) => void;

  // GL Vouchers & Audit Trail
  glJournalEntries: BankingGLJournalEntry[];
  auditLogs: BankingAuditLogRecord[];

  // Summary Metrics & Utilities
  totalLiquidityOMR: number;
  totalFacilitiesSanctionedOMR: number;
  totalFacilitiesHeadroomOMR: number;
  totalUnreconciledDifferenceOMR: number;
  pendingApprovalsCount: number;
  totalPdcReceivablesOMR: number;
  totalPdcPayablesOMR: number;
  resetToDefaultData: () => void;
}

const BankingTreasuryContext = createContext<BankingTreasuryContextType | undefined>(undefined);

export const BankingTreasuryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Actor Simulation State
  const [activeActor, setActiveActor] = useState<UserContext>(ENTERPRISE_BANKING_ACTORS[0]); // Default to Group CFO

  // 04.01 Bank State
  const [bankMasters, setBankMasters] = useState<BankMasterRecord[]>(mockBankMasters);
  const [bankAccounts, setBankAccounts] = useState<BankAccountRecord[]>(mockBankAccounts);
  const [bankSignatories, setBankSignatories] = useState<BankSignatoryRecord[]>(mockBankSignatories);
  const [bankLimits, setBankLimits] = useState<BankLimitRecord[]>(mockBankLimits);

  // 04.02 Cash State
  const [cashAccounts, setCashAccounts] = useState<CashAccountRecord[]>(mockCashAccounts);
  const [cashReceipts, setCashReceipts] = useState<CashReceiptRecord[]>(mockCashReceipts);
  const [cashPayments, setCashPayments] = useState<CashPaymentRecord[]>(mockCashPayments);
  const [cashPosition, setCashPosition] = useState<CashPositionSummary>(mockCashPositionSummary);

  // 04.03 Payment State
  const [bankPayments, setBankPayments] = useState<BankPaymentRecord[]>(mockBankPayments);
  const [chequePayments, setChequePayments] = useState<ChequePaymentRecord[]>(mockChequePayments);
  const [electronicBatches, setElectronicBatches] = useState<ElectronicPaymentBatch[]>(mockElectronicBatches);
  const [approvalQueue, setApprovalQueue] = useState<PaymentApprovalQueueItem[]>(() => {
    // Enrich initial mock queue items with workflow stages if missing
    return mockPaymentApprovalQueue.map((item) => {
      if (!item.approverStages || item.approverStages.length === 0) {
        const evalResult = BankingWorkflowEngine.evaluatePaymentWorkflow(
          item.transactionType,
          item.amount,
          item.beneficiaryName,
          item.urgency
        );
        return {
          ...item,
          approverStages: evalResult.stages,
          workflowCode: evalResult.workflowCode,
          sodRulesApplied: evalResult.sodRulesApplied,
          currentStep: 1,
          totalSteps: evalResult.totalLevels,
          amountInOMR: item.amount
        };
      }
      return item;
    });
  });

  // 04.04 Receipt State
  const [customerReceipts, setCustomerReceipts] = useState<CustomerReceiptRecord[]>(mockCustomerReceipts);
  const [otherReceipts, setOtherReceipts] = useState<OtherReceiptRecord[]>(mockOtherReceipts);
  const [depositSlips, setDepositSlips] = useState<BankDepositSlipRecord[]>(mockDepositSlips);
  const [receiptAllocations, setReceiptAllocations] = useState<ReceiptAllocationItem[]>(mockReceiptAllocations);

  // 04.05 Bank Reconciliation State
  const [statementImports, setStatementImports] = useState<BankStatementImportRecord[]>(mockStatementImports);
  const [statementLines, setStatementLines] = useState<BankStatementLine[]>(mockStatementLines);
  const [reconciliationAdjustments, setReconciliationAdjustments] = useState<ReconciliationAdjustmentRecord[]>(mockReconciliationAdjustments);

  // 04.06 Petty Cash State
  const [pettyCashAccounts, setPettyCashAccounts] = useState<PettyCashAccountRecord[]>(mockPettyCashAccounts);
  const [pettyCashAdvances, setPettyCashAdvances] = useState<PettyCashAdvanceRecord[]>(mockPettyCashAdvances);
  const [pettyCashExpenses, setPettyCashExpenses] = useState<PettyCashExpenseRecord[]>(mockPettyCashExpenses);
  const [pettyCashReconciliations, setPettyCashReconciliations] = useState<PettyCashReconciliationRecord[]>(mockPettyCashReconciliations);

  // 04.07 Treasury State
  const [cashFlowForecast, setCashFlowForecast] = useState<CashFlowForecastItem[]>(mockCashFlowForecast);
  const [bankFacilities, setBankFacilities] = useState<BankFacilityRecord[]>(mockBankFacilities);
  const [bankChargeAudits, setBankChargeAudits] = useState<BankChargeAuditRecord[]>(mockBankChargeAudits);
  const [postDatedCheques, setPostDatedCheques] = useState<PostDatedChequeRecord[]>(mockPostDatedCheques);

  // GL Journals & Audit Logs
  const [glJournalEntries, setGlJournalEntries] = useState<BankingGLJournalEntry[]>([]);
  const [auditLogs, setAuditLogs] = useState<BankingAuditLogRecord[]>(() => {
    try {
      const stored = localStorage.getItem('artify_bnk_audit_trail');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.bankAccounts) setBankAccounts(parsed.bankAccounts);
        if (parsed.bankPayments) setBankPayments(parsed.bankPayments);
        if (parsed.approvalQueue) setApprovalQueue(parsed.approvalQueue);
        if (parsed.cashAccounts) setCashAccounts(parsed.cashAccounts);
        if (parsed.cashPayments) setCashPayments(parsed.cashPayments);
        if (parsed.cashReceipts) setCashReceipts(parsed.cashReceipts);
        if (parsed.customerReceipts) setCustomerReceipts(parsed.customerReceipts);
        if (parsed.statementLines) setStatementLines(parsed.statementLines);
        if (parsed.reconciliationAdjustments) setReconciliationAdjustments(parsed.reconciliationAdjustments);
        if (parsed.pettyCashAccounts) setPettyCashAccounts(parsed.pettyCashAccounts);
        if (parsed.pettyCashAdvances) setPettyCashAdvances(parsed.pettyCashAdvances);
        if (parsed.pettyCashExpenses) setPettyCashExpenses(parsed.pettyCashExpenses);
        if (parsed.postDatedCheques) setPostDatedCheques(parsed.postDatedCheques);
        if (parsed.bankFacilities) setBankFacilities(parsed.bankFacilities);
        if (parsed.glJournalEntries) setGlJournalEntries(parsed.glJournalEntries);
      }
    } catch (err) {
      console.warn('Could not read state from localStorage', err);
    }
  }, []);

  // Save to LocalStorage on state change
  useEffect(() => {
    try {
      const stateToPersist = {
        bankAccounts,
        bankPayments,
        approvalQueue,
        cashAccounts,
        cashPayments,
        cashReceipts,
        customerReceipts,
        statementLines,
        reconciliationAdjustments,
        pettyCashAccounts,
        pettyCashAdvances,
        pettyCashExpenses,
        postDatedCheques,
        bankFacilities,
        glJournalEntries
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
    } catch (err) {
      console.warn('Could not persist state to localStorage', err);
    }
  }, [
    bankAccounts,
    bankPayments,
    approvalQueue,
    cashAccounts,
    cashPayments,
    cashReceipts,
    customerReceipts,
    statementLines,
    reconciliationAdjustments,
    pettyCashAccounts,
    pettyCashAdvances,
    pettyCashExpenses,
    postDatedCheques,
    bankFacilities,
    glJournalEntries
  ]);

  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('artify_bnk_audit_trail');
    setBankMasters(mockBankMasters);
    setBankAccounts(mockBankAccounts);
    setBankSignatories(mockBankSignatories);
    setBankLimits(mockBankLimits);
    setCashAccounts(mockCashAccounts);
    setCashReceipts(mockCashReceipts);
    setCashPayments(mockCashPayments);
    setCashPosition(mockCashPositionSummary);
    setBankPayments(mockBankPayments);
    setChequePayments(mockChequePayments);
    setElectronicBatches(mockElectronicBatches);
    setApprovalQueue(
      mockPaymentApprovalQueue.map((item) => {
        const evalResult = BankingWorkflowEngine.evaluatePaymentWorkflow(
          item.transactionType,
          item.amount,
          item.beneficiaryName,
          item.urgency
        );
        return {
          ...item,
          approverStages: evalResult.stages,
          workflowCode: evalResult.workflowCode,
          sodRulesApplied: evalResult.sodRulesApplied,
          currentStep: 1,
          totalSteps: evalResult.totalLevels,
          amountInOMR: item.amount
        };
      })
    );
    setCustomerReceipts(mockCustomerReceipts);
    setOtherReceipts(mockOtherReceipts);
    setDepositSlips(mockDepositSlips);
    setReceiptAllocations(mockReceiptAllocations);
    setStatementImports(mockStatementImports);
    setStatementLines(mockStatementLines);
    setReconciliationAdjustments(mockReconciliationAdjustments);
    setPettyCashAccounts(mockPettyCashAccounts);
    setPettyCashAdvances(mockPettyCashAdvances);
    setPettyCashExpenses(mockPettyCashExpenses);
    setPettyCashReconciliations(mockPettyCashReconciliations);
    setCashFlowForecast(mockCashFlowForecast);
    setBankFacilities(mockBankFacilities);
    setBankChargeAudits(mockBankChargeAudits);
    setPostDatedCheques(mockPostDatedCheques);
    setGlJournalEntries([]);
    setAuditLogs([]);
  };

  const evaluateWorkflowTiers = (
    type: 'Bank Wire Transfer' | 'Cheque Release' | 'Electronic Batch (WPS)' | 'Urgent High-Value Payment' | 'Cash Disbursement' | 'Petty Cash Advance' | 'Reconciliation Adjustment',
    amountInOMR: number,
    beneficiaryOrPayee: string,
    urgency: 'Standard' | 'Urgent / Same-Day' | 'Critical SLA' = 'Standard'
  ) => {
    return BankingWorkflowEngine.evaluatePaymentWorkflow(type, amountInOMR, beneficiaryOrPayee, urgency);
  };

  // -------------------------------------------------------------
  // 04.01 Bank Actions
  // -------------------------------------------------------------
  const addBankMaster = (data: Omit<BankMasterRecord, 'id' | 'createdAt' | 'updatedAt' | 'totalAccountsLinked' | 'totalFacilitiesOMR'>) => {
    const newBank: BankMasterRecord = {
      ...data,
      id: `bank-${Date.now().toString().slice(-4)}`,
      totalAccountsLinked: 0,
      totalFacilitiesOMR: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setBankMasters((prev) => [newBank, ...prev]);
  };

  const addBankAccount = (data: Omit<BankAccountRecord, 'id' | 'currentBookBalance' | 'clearedBankBalance' | 'unreconciledDifference' | 'lastReconciledDate'>) => {
    const newAccount: BankAccountRecord = {
      ...data,
      id: `acct-${Date.now().toString().slice(-4)}`,
      currentBookBalance: 0,
      clearedBankBalance: 0,
      unreconciledDifference: 0,
      lastReconciledDate: new Date().toISOString().split('T')[0]
    };
    setBankAccounts((prev) => [newAccount, ...prev]);
  };

  const updateBankAccountStatus = (id: string, status: BankAccountRecord['status']) => {
    setBankAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const addBankSignatory = (data: Omit<BankSignatoryRecord, 'id'>) => {
    const newSig: BankSignatoryRecord = {
      ...data,
      id: `sig-${Date.now().toString().slice(-4)}`
    };
    setBankSignatories((prev) => [newSig, ...prev]);
  };

  const addBankLimit = (data: Omit<BankLimitRecord, 'id'>) => {
    const newLim: BankLimitRecord = {
      ...data,
      id: `lim-${Date.now().toString().slice(-4)}`
    };
    setBankLimits((prev) => [newLim, ...prev]);
  };

  // -------------------------------------------------------------
  // 04.02 Cash Actions
  // -------------------------------------------------------------
  const addCashAccount = (data: Omit<CashAccountRecord, 'id' | 'lastCountTimestamp'>) => {
    const newAcc: CashAccountRecord = {
      ...data,
      id: `cash-${Date.now().toString().slice(-4)}`,
      lastCountTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setCashAccounts((prev) => [newAcc, ...prev]);
  };

  const recordCashReceipt = (data: Omit<CashReceiptRecord, 'id' | 'receiptNumber' | 'status'>) => {
    const seq = Math.floor(Math.random() * 900) + 100;
    const newReceipt: CashReceiptRecord = {
      ...data,
      id: `cr-${Date.now().toString().slice(-4)}`,
      receiptNumber: `CR-2026-00${seq}`,
      status: 'Posted'
    };
    setCashReceipts((prev) => [newReceipt, ...prev]);

    // Update cash vault balance
    setCashAccounts((prev) =>
      prev.map((acc) =>
        acc.id === data.cashAccountId ? { ...acc, currentBalance: acc.currentBalance + data.amount } : acc
      )
    );

    // Generate GL impact
    const glEntry = BankingWorkflowEngine.generateGLAccountingImpact('CASH_RECEIPT', {
      transactionRef: newReceipt.receiptNumber,
      amountOMR: data.amount,
      currency: data.currency,
      offsetAccountCode: data.glCreditAccount,
      offsetAccountName: 'Counter Cash Sales / AR Collection',
      payeeOrCustomerName: data.receivedFrom,
      narration: `Cash receipt voucher ${newReceipt.receiptNumber} from ${data.receivedFrom}`,
      postedBy: activeActor.name
    });
    setGlJournalEntries((prev) => [glEntry, ...prev]);

    // Audit log
    const audit = BankingWorkflowEngine.logAuditAction({
      actor: activeActor,
      action: 'POST_GL',
      entityType: 'CASH_VOUCHER',
      entityId: newReceipt.id,
      entityReference: newReceipt.receiptNumber,
      amountOMR: data.amount,
      details: `Cash receipt of OMR ${data.amount.toLocaleString()} received from ${data.receivedFrom}. GL voucher ${glEntry.voucherNumber} posted.`
    });
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const recordCashPayment = (data: Omit<CashPaymentRecord, 'id' | 'voucherNumber' | 'status' | 'cashierSignatureDate'>): { success: boolean; error?: string } => {
    // Security policy check
    const validation = BankingWorkflowEngine.validateSubmission({
      requestedBy: data.requestedBy,
      amount: data.amount
    });
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const seq = Math.floor(Math.random() * 900) + 100;
    const newPayment: CashPaymentRecord = {
      ...data,
      id: `cp-${Date.now().toString().slice(-4)}`,
      voucherNumber: `CP-2026-00${seq}`,
      cashierSignatureDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Posted'
    };
    setCashPayments((prev) => [newPayment, ...prev]);

    // Decrease cash balance
    setCashAccounts((prev) =>
      prev.map((acc) =>
        acc.id === data.cashAccountId ? { ...acc, currentBalance: Math.max(0, acc.currentBalance - data.amount) } : acc
      )
    );

    // Post to GL
    const glEntry = BankingWorkflowEngine.generateGLAccountingImpact('CASH_PAYMENT', {
      transactionRef: newPayment.voucherNumber,
      amountOMR: data.amount,
      currency: data.currency,
      offsetAccountCode: data.glDebitAccount,
      offsetAccountName: data.expenseCategory,
      payeeOrCustomerName: data.payeeName,
      narration: `Cash disbursement ${newPayment.voucherNumber} to ${data.payeeName} for ${data.expenseCategory}`,
      postedBy: activeActor.name
    });
    setGlJournalEntries((prev) => [glEntry, ...prev]);

    const audit = BankingWorkflowEngine.logAuditAction({
      actor: activeActor,
      action: 'POST_GL',
      entityType: 'CASH_VOUCHER',
      entityId: newPayment.id,
      entityReference: newPayment.voucherNumber,
      amountOMR: data.amount,
      details: `Cash disbursement voucher ${newPayment.voucherNumber} of OMR ${data.amount.toLocaleString()} paid to ${data.payeeName}.`
    });
    setAuditLogs((prev) => [audit, ...prev]);

    return { success: true };
  };

  const updateCashPaymentStatus = (id: string, status: CashPaymentRecord['status']) => {
    setCashPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  // -------------------------------------------------------------
  // 04.03 Payment Actions & Enterprise Workflow Engine
  // -------------------------------------------------------------
  const createBankPayment = (data: Omit<BankPaymentRecord, 'id' | 'paymentReference' | 'status'>): { success: boolean; error?: string; payment?: BankPaymentRecord } => {
    // 1. Validation check
    const validation = BankingWorkflowEngine.validateSubmission({
      preparedBy: data.preparedBy,
      amount: data.amountInOMR || data.amount,
      beneficiaryName: data.beneficiaryName
    });

    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const seq = Math.floor(Math.random() * 9000) + 1000;
    const amountOMR = data.amountInOMR || data.amount;
    const isUrgent = amountOMR > 50000;

    // 2. Evaluate workflow tiers
    const wfEval = BankingWorkflowEngine.evaluatePaymentWorkflow(
      'Bank Wire Transfer',
      amountOMR,
      data.beneficiaryName,
      isUrgent ? 'Urgent / Same-Day' : 'Standard'
    );

    const newPay: BankPaymentRecord = {
      ...data,
      id: `bp-${Date.now().toString().slice(-4)}`,
      paymentReference: `PAY-WIR-2026-00${seq}`,
      status: 'Submitted',
      makerUserId: activeActor.userId,
      workflowStages: wfEval.stages,
      currentApprovalLevel: 1,
      totalApprovalLevels: wfEval.totalLevels
    };

    setBankPayments((prev) => [newPay, ...prev]);

    // 3. Add to centralized approval queue
    const queueItem: PaymentApprovalQueueItem = {
      id: `app-${Date.now().toString().slice(-4)}`,
      transactionId: newPay.id,
      transactionRef: newPay.paymentReference,
      transactionType: 'Bank Wire Transfer',
      beneficiaryName: data.beneficiaryName,
      amount: data.amount,
      currency: data.currency,
      amountInOMR: amountOMR,
      submittedBy: data.preparedBy,
      makerUserId: activeActor.userId,
      submissionDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      requiredApprovalLevel: wfEval.workflowName,
      currentStep: 1,
      totalSteps: wfEval.totalLevels,
      urgency: isUrgent ? 'Urgent / Same-Day' : 'Standard',
      status: 'Pending',
      complianceCheckPassed: true,
      sanctionsScreeningPassed: true,
      approverStages: wfEval.stages,
      workflowCode: wfEval.workflowCode,
      sodRulesApplied: wfEval.sodRulesApplied
    };

    setApprovalQueue((prev) => [queueItem, ...prev]);

    // 4. Audit Log
    const audit = BankingWorkflowEngine.logAuditAction({
      actor: activeActor,
      action: 'SUBMIT',
      entityType: 'BANK_PAYMENT',
      entityId: newPay.id,
      entityReference: newPay.paymentReference,
      amountOMR: amountOMR,
      details: `Bank wire payment ${newPay.paymentReference} submitted for OMR ${amountOMR.toLocaleString()} to ${data.beneficiaryName}. Routed to ${wfEval.workflowName}.`
    });
    setAuditLogs((prev) => [audit, ...prev]);

    return { success: true, payment: newPay };
  };

  const updateBankPaymentStatus = (id: string, status: TransactionStatus) => {
    setBankPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const issueChequePayment = (data: Omit<ChequePaymentRecord, 'id' | 'status'>): { success: boolean; error?: string } => {
    const seq = Math.floor(Math.random() * 900) + 100;
    const newChq: ChequePaymentRecord = {
      ...data,
      id: `chq-${Date.now().toString().slice(-4)}`,
      status: 'Signed',
      makerUserId: activeActor.userId
    };
    setChequePayments((prev) => [newChq, ...prev]);

    // If post-dated, register into PDC vault automatically
    if (data.isPostDated) {
      const newPdc: PostDatedChequeRecord = {
        id: `pdc-${Date.now().toString().slice(-4)}`,
        pdcReference: `PDC-PAY-2026-${seq}`,
        direction: 'Payable (Supplier PDC)',
        chequeNumber: data.chequeNumber,
        bankName: data.bankAccountName,
        drawerOrPayeeName: data.payeeName,
        chequeDate: data.chequeDate,
        maturityDate: data.dueDate,
        amount: data.amount,
        currency: data.currency,
        amountInOMR: data.amount,
        custodyLocation: 'Treasury Safe Vault',
        linkedInvoiceOrVoucherRef: data.purpose,
        status: 'In Vault',
        clearingBankAccountId: data.bankAccountId,
        daysUntilMaturity: Math.max(1, Math.ceil((new Date(data.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))
      };
      setPostDatedCheques((prev) => [newPdc, ...prev]);
    }

    const audit = BankingWorkflowEngine.logAuditAction({
      actor: activeActor,
      action: 'CREATE',
      entityType: 'CHEQUE',
      entityId: newChq.id,
      entityReference: `CHQ-${data.chequeNumber}`,
      amountOMR: data.amount,
      details: `Cheque #${data.chequeNumber} issued for OMR ${data.amount.toLocaleString()} to ${data.payeeName}.`
    });
    setAuditLogs((prev) => [audit, ...prev]);

    return { success: true };
  };

  const updateChequeStatus = (id: string, status: ChequePaymentRecord['status']) => {
    setChequePayments((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const createElectronicBatch = (data: Omit<ElectronicPaymentBatch, 'id' | 'batchNumber' | 'status'>): { success: boolean; error?: string } => {
    const seq = Math.floor(Math.random() * 900) + 100;
    const wf = BankingWorkflowEngine.evaluatePaymentWorkflow(
      'Electronic Batch (WPS)',
      data.totalAmount,
      'WPS Salary Employees',
      'Urgent / Same-Day'
    );

    const newBatch: ElectronicPaymentBatch = {
      ...data,
      id: `wps-${Date.now().toString().slice(-4)}`,
      batchNumber: `WPS-2026-08-B${seq}`,
      status: 'Pending Dual Sign-off',
      workflowStages: wf.stages,
      currentApprovalLevel: 1,
      totalApprovalLevels: wf.totalLevels
    };

    setElectronicBatches((prev) => [newBatch, ...prev]);

    // Also register in approval queue
    const queueItem: PaymentApprovalQueueItem = {
      id: `app-wps-${Date.now().toString().slice(-4)}`,
      transactionId: newBatch.id,
      transactionRef: newBatch.batchNumber,
      transactionType: 'Electronic Batch (WPS)',
      beneficiaryName: `${data.totalTransactions} Employees (${data.batchType})`,
      amount: data.totalAmount,
      currency: data.currency,
      amountInOMR: data.totalAmount,
      submittedBy: activeActor.name,
      makerUserId: activeActor.userId,
      submissionDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      requiredApprovalLevel: wf.workflowName,
      currentStep: 1,
      totalSteps: wf.totalLevels,
      urgency: 'Urgent / Same-Day',
      status: 'Pending',
      complianceCheckPassed: true,
      sanctionsScreeningPassed: true,
      approverStages: wf.stages,
      workflowCode: wf.workflowCode,
      sodRulesApplied: wf.sodRulesApplied
    };
    setApprovalQueue((prev) => [queueItem, ...prev]);

    const audit = BankingWorkflowEngine.logAuditAction({
      actor: activeActor,
      action: 'SUBMIT',
      entityType: 'ELECTRONIC_BATCH',
      entityId: newBatch.id,
      entityReference: newBatch.batchNumber,
      amountOMR: data.totalAmount,
      details: `Electronic payment batch ${newBatch.batchNumber} created for OMR ${data.totalAmount.toLocaleString()} (${data.totalTransactions} transactions).`
    });
    setAuditLogs((prev) => [audit, ...prev]);

    return { success: true };
  };

  /**
   * Process payment approval with strict Segregation of Duties (SoD),
   * Delegation of Authority (DoA) limit enforcement, sequential stage progress,
   * and automated double-entry GL ledger posting on final approval.
   */
  const processPaymentApproval = (
    queueItemId: string,
    decision: 'approve' | 'reject',
    comment?: string
  ): { success: boolean; error?: string; violationCode?: string; updatedStatus?: string; glVoucherId?: string } => {
    const item = approvalQueue.find((q) => q.id === queueItemId);
    if (!item) {
      return { success: false, error: 'Approval queue item not found.' };
    }

    if (item.status !== 'Pending') {
      return { success: false, error: `This item is already in "${item.status}" state.` };
    }

    // 1. ENFORCE SEGREGATION OF DUTIES & DELEGATION OF AUTHORITY
    const authCheck = BankingWorkflowEngine.validateApprovalAuthority(
      {
        id: item.id,
        transactionRef: item.transactionRef,
        submittedBy: item.submittedBy,
        makerUserId: item.makerUserId,
        amountInOMR: item.amountInOMR || item.amount,
        amount: item.amount,
        currentStep: item.currentStep,
        totalSteps: item.totalSteps,
        approverStages: item.approverStages
      },
      activeActor
    );

    if (!authCheck.isAuthorized) {
      // Log authorization violation attempt to audit log
      const audit = BankingWorkflowEngine.logAuditAction({
        actor: activeActor,
        action: 'APPROVE_LEVEL',
        entityType: 'BANK_PAYMENT',
        entityId: item.transactionId,
        entityReference: item.transactionRef,
        amountOMR: item.amountInOMR || item.amount,
        details: `REJECTED APPROVAL ATTEMPT: ${authCheck.error}`,
        violationCode: authCheck.violationCode
      });
      setAuditLogs((prev) => [audit, ...prev]);

      return {
        success: false,
        error: authCheck.error,
        violationCode: authCheck.violationCode
      };
    }

    const currentStep = item.currentStep || 1;
    const stages = item.approverStages || [];
    const totalSteps = item.totalSteps || (stages.length > 0 ? stages.length : 1);

    if (decision === 'reject') {
      const updatedStages = stages.map((st) =>
        st.level === currentStep
          ? {
              ...st,
              status: 'Rejected' as const,
              decisionDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
              decisionBy: activeActor.name,
              comments: comment || 'Rejected by authorized approver'
            }
          : st
      );

      setApprovalQueue((prev) =>
        prev.map((q) =>
          q.id === queueItemId
            ? {
                ...q,
                status: 'Rejected',
                rejectionReason: comment || 'Rejected during workflow review',
                approverStages: updatedStages
              }
            : q
        )
      );

      // Update underlying bank payment
      updateBankPaymentStatus(item.transactionId, 'Rejected');

      const audit = BankingWorkflowEngine.logAuditAction({
        actor: activeActor,
        action: 'REJECT',
        entityType: 'BANK_PAYMENT',
        entityId: item.transactionId,
        entityReference: item.transactionRef,
        amountOMR: item.amountInOMR || item.amount,
        details: `Transaction ${item.transactionRef} rejected by ${activeActor.name}. Reason: ${comment || 'Disapproved'}`
      });
      setAuditLogs((prev) => [audit, ...prev]);

      return { success: true, updatedStatus: 'Rejected' };
    }

    // DECISION === 'APPROVE'
    const isFinalStep = currentStep >= totalSteps;
    const nextStep = currentStep + 1;

    const updatedStages = stages.map((st) => {
      if (st.level === currentStep) {
        return {
          ...st,
          status: 'Approved' as const,
          decisionDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
          decisionBy: activeActor.name,
          comments: comment || 'Approved by authority'
        };
      }
      if (st.level === nextStep && !isFinalStep) {
        return { ...st, status: 'Pending' as const };
      }
      return st;
    });

    let glVoucherId: string | undefined;

    if (isFinalStep) {
      // 1. FINAL APPROVAL REACHED: Generate balanced GL Journal Entry
      const targetPayment = bankPayments.find((p) => p.id === item.transactionId);
      const targetBankAcc = bankAccounts.find((b) => b.id === targetPayment?.bankAccountId);

      const glEntry = BankingWorkflowEngine.generateGLAccountingImpact('BANK_PAYMENT', {
        transactionRef: item.transactionRef,
        amountOMR: item.amountInOMR || item.amount,
        currency: item.currency,
        bankAccountName: targetBankAcc?.accountName || 'Bank Muscat — Operating Current A/C',
        bankGlCode: targetBankAcc?.glAccountCode || '1010-01-001',
        offsetAccountCode: '2010-01-001',
        offsetAccountName: 'Trade Accounts Payable',
        payeeOrCustomerName: item.beneficiaryName,
        narration: `Bank wire payment ${item.transactionRef} to ${item.beneficiaryName}`,
        postedBy: activeActor.name
      });

      glVoucherId = glEntry.voucherNumber;
      setGlJournalEntries((prev) => [glEntry, ...prev]);

      // 2. Reduce Bank Book Balance
      if (targetPayment && targetPayment.bankAccountId) {
        setBankAccounts((prev) =>
          prev.map((acc) =>
            acc.id === targetPayment.bankAccountId
              ? {
                  ...acc,
                  currentBookBalance: acc.currentBookBalance - (item.amountInOMR || item.amount),
                  unreconciledDifference: acc.unreconciledDifference - (item.amountInOMR || item.amount)
                }
              : acc
          )
        );
      }

      // 3. Mark queue item as Approved
      setApprovalQueue((prev) =>
        prev.map((q) =>
          q.id === queueItemId
            ? {
                ...q,
                status: 'Approved',
                currentStep: totalSteps,
                approverStages: updatedStages,
                glVoucherId: glEntry.voucherNumber
              }
            : q
        )
      );

      // 4. Mark underlying bank payment as Approved / Posted
      setBankPayments((prev) =>
        prev.map((p) =>
          p.id === item.transactionId
            ? {
                ...p,
                status: 'Approved',
                workflowStages: updatedStages,
                currentApprovalLevel: totalSteps,
                glVoucherId: glEntry.voucherNumber,
                firstApprover: updatedStages[0]?.decisionBy,
                secondApprover: updatedStages[1]?.decisionBy || activeActor.name
              }
            : p
        )
      );

      // If it is an electronic batch
      setElectronicBatches((prev) =>
        prev.map((b) =>
          b.id === item.transactionId
            ? {
                ...b,
                status: 'Approved',
                workflowStages: updatedStages,
                currentApprovalLevel: totalSteps
              }
            : b
        )
      );

      // 5. Audit Log
      const audit = BankingWorkflowEngine.logAuditAction({
        actor: activeActor,
        action: 'FINAL_APPROVE',
        entityType: 'BANK_PAYMENT',
        entityId: item.transactionId,
        entityReference: item.transactionRef,
        amountOMR: item.amountInOMR || item.amount,
        details: `Final approval granted for ${item.transactionRef} (OMR ${(item.amountInOMR || item.amount).toLocaleString()}) by ${activeActor.name}. GL journal voucher ${glEntry.voucherNumber} created and Bank Book Balance adjusted.`
      });
      setAuditLogs((prev) => [audit, ...prev]);

      return {
        success: true,
        updatedStatus: 'Approved',
        glVoucherId: glEntry.voucherNumber
      };
    } else {
      // ADVANCE TO NEXT STAGE (e.g. Level 1 -> Level 2)
      setApprovalQueue((prev) =>
        prev.map((q) =>
          q.id === queueItemId
            ? {
                ...q,
                currentStep: nextStep,
                approverStages: updatedStages
              }
            : q
        )
      );

      setBankPayments((prev) =>
        prev.map((p) =>
          p.id === item.transactionId
            ? {
                ...p,
                currentApprovalLevel: nextStep,
                workflowStages: updatedStages,
                firstApprover: activeActor.name
              }
            : p
        )
      );

      const audit = BankingWorkflowEngine.logAuditAction({
        actor: activeActor,
        action: 'APPROVE_LEVEL',
        entityType: 'BANK_PAYMENT',
        entityId: item.transactionId,
        entityReference: item.transactionRef,
        amountOMR: item.amountInOMR || item.amount,
        details: `Level ${currentStep} approval granted by ${activeActor.name}. Escalated to Level ${nextStep} for next authorization tier.`
      });
      setAuditLogs((prev) => [audit, ...prev]);

      return {
        success: true,
        updatedStatus: `Progressed to Level ${nextStep}`
      };
    }
  };

  // -------------------------------------------------------------
  // 04.04 Receipt Actions
  // -------------------------------------------------------------
  const recordCustomerReceipt = (data: Omit<CustomerReceiptRecord, 'id' | 'receiptNumber' | 'status' | 'allocatedAmount' | 'unallocatedAmount'>) => {
    const seq = Math.floor(Math.random() * 900) + 100;
    const newRcpt: CustomerReceiptRecord = {
      ...data,
      id: `rcpt-${Date.now().toString().slice(-4)}`,
      receiptNumber: `RC-2026-00${seq}`,
      allocatedAmount: 0,
      unallocatedAmount: data.amountReceived,
      status: 'Posted'
    };
    setCustomerReceipts((prev) => [newRcpt, ...prev]);

    // Increase Bank Account balance
    setBankAccounts((prev) =>
      prev.map((acc) =>
        acc.id === data.receivingBankAccountId
          ? {
              ...acc,
              currentBookBalance: acc.currentBookBalance + data.amountReceived,
              unreconciledDifference: acc.unreconciledDifference + data.amountReceived
            }
          : acc
      )
    );

    // GL Posting
    const gl = BankingWorkflowEngine.generateGLAccountingImpact('CUSTOMER_RECEIPT', {
      transactionRef: newRcpt.receiptNumber,
      amountOMR: data.amountOMR || data.amountReceived,
      currency: data.currency,
      bankAccountName: data.receivingBankAccountName,
      payeeOrCustomerName: data.customerName,
      narration: `Customer receipt ${newRcpt.receiptNumber} from ${data.customerName} via ${data.paymentMode}`,
      postedBy: activeActor.name
    });
    setGlJournalEntries((prev) => [gl, ...prev]);

    const audit = BankingWorkflowEngine.logAuditAction({
      actor: activeActor,
      action: 'POST_GL',
      entityType: 'CUSTOMER_RECEIPT',
      entityId: newRcpt.id,
      entityReference: newRcpt.receiptNumber,
      amountOMR: data.amountOMR || data.amountReceived,
      details: `Customer collection ${newRcpt.receiptNumber} posted for OMR ${data.amountReceived.toLocaleString()} from ${data.customerName}. GL Voucher: ${gl.voucherNumber}`
    });
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const allocateReceiptToInvoice = (receiptId: string, invoiceNumber: string, invoiceOriginalAmount: number, allocateAmount: number) => {
    const allocItem: ReceiptAllocationItem = {
      id: `alloc-${Date.now().toString().slice(-4)}`,
      receiptId,
      invoiceId: `inv-${Date.now()}`,
      invoiceNumber,
      invoiceDate: new Date().toISOString().split('T')[0],
      invoiceOriginalAmount,
      invoiceDueAmount: invoiceOriginalAmount,
      allocatedThisVoucher: allocateAmount,
      discountTaken: 0,
      withholdingTaxDeducted: 0,
      remainingDueAfterAllocation: Math.max(0, invoiceOriginalAmount - allocateAmount)
    };
    setReceiptAllocations((prev) => [allocItem, ...prev]);

    setCustomerReceipts((prev) =>
      prev.map((r) => {
        if (r.id === receiptId) {
          const newAllocated = r.allocatedAmount + allocateAmount;
          const newUnallocated = Math.max(0, r.amountReceived - newAllocated);
          const status = newUnallocated === 0 ? 'Fully Allocated' : 'Partially Allocated';
          return { ...r, allocatedAmount: newAllocated, unallocatedAmount: newUnallocated, status };
        }
        return r;
      })
    );
  };

  const recordOtherReceipt = (data: Omit<OtherReceiptRecord, 'id' | 'receiptNumber' | 'status'>) => {
    const seq = Math.floor(Math.random() * 900) + 100;
    const newOther: OtherReceiptRecord = {
      ...data,
      id: `orcpt-${Date.now().toString().slice(-4)}`,
      receiptNumber: `ORC-2026-00${seq}`,
      status: 'Posted'
    };
    setOtherReceipts((prev) => [newOther, ...prev]);
  };

  const generateDepositSlip = (data: Omit<BankDepositSlipRecord, 'id' | 'depositSlipNumber' | 'status'>) => {
    const seq = Math.floor(Math.random() * 900) + 100;
    const newSlip: BankDepositSlipRecord = {
      ...data,
      id: `dep-${Date.now().toString().slice(-4)}`,
      depositSlipNumber: `DEP-2026-00${seq}`,
      status: 'Prepared'
    };
    setDepositSlips((prev) => [newSlip, ...prev]);
  };

  // -------------------------------------------------------------
  // 04.05 Bank Reconciliation Actions
  // -------------------------------------------------------------
  const importBankStatement = (bankAccountId: string, format: BankStatementImportRecord['importFormat'], filename: string, linesCount: number) => {
    const bank = bankAccounts.find((b) => b.id === bankAccountId);
    const newImport: BankStatementImportRecord = {
      id: `stmt-${Date.now().toString().slice(-4)}`,
      bankAccountId,
      bankAccountName: bank?.accountName || 'Bank Account',
      statementReference: `${format.slice(0, 3)}-${filename.replace(/\.[^/.]+$/, '')}`,
      statementPeriodStart: '2026-08-01',
      statementPeriodEnd: new Date().toISOString().split('T')[0],
      openingBalance: (bank?.clearedBankBalance || 100000) - 25000,
      closingBalance: bank?.clearedBankBalance || 100000,
      totalCreditEntries: Math.floor(linesCount * 0.4),
      totalDebitEntries: Math.ceil(linesCount * 0.6),
      totalLinesCount: linesCount,
      matchedLinesCount: 0,
      unmatchedLinesCount: linesCount,
      importFormat: format,
      importedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      importedBy: activeActor.name,
      reconciliationStatus: 'Imported'
    };
    setStatementImports((prev) => [newImport, ...prev]);

    const audit = BankingWorkflowEngine.logAuditAction({
      actor: activeActor,
      action: 'IMPORT_STATEMENT',
      entityType: 'STATEMENT_RECON',
      entityId: newImport.id,
      entityReference: newImport.statementReference,
      details: `Bank statement "${filename}" (${format}) imported with ${linesCount} lines for ${bank?.accountName}.`
    });
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const runAutoMatchingEngine = (statementImportId: string) => {
    let matched = 0;
    setStatementLines((prev) =>
      prev.map((line) => {
        if (!line.isReconciled) {
          matched++;
          return {
            ...line,
            isReconciled: true,
            matchScorePercent: 98,
            matchMethod: 'AI Suggested (88%)'
          };
        }
        return line;
      })
    );

    setStatementImports((prev) =>
      prev.map((st) =>
        st.id === statementImportId || !st.reconciliationStatus.includes('Closed')
          ? {
              ...st,
              matchedLinesCount: st.totalLinesCount - 1,
              unmatchedLinesCount: 1,
              reconciliationStatus: 'Auto-Matched'
            }
          : st
      )
    );

    const audit = BankingWorkflowEngine.logAuditAction({
      actor: activeActor,
      action: 'MATCH_STATEMENT',
      entityType: 'STATEMENT_RECON',
      entityId: statementImportId,
      entityReference: 'AUTO-MATCH-RULESET-V4',
      details: `Automated matching executed: ${matched} transaction lines successfully reconciled against GL bank vouchers.`
    });
    setAuditLogs((prev) => [audit, ...prev]);

    return { matchedCount: matched, unreconciledCount: 1 };
  };

  const toggleManualReconciliation = (lineId: string, isReconciled: boolean) => {
    setStatementLines((prev) =>
      prev.map((l) => (l.id === lineId ? { ...l, isReconciled, matchMethod: isReconciled ? 'Manual Tagged' : 'Unmatched' } : l))
    );
  };

  const createReconciliationAdjustment = (data: Omit<ReconciliationAdjustmentRecord, 'id' | 'adjustmentNumber' | 'status'>) => {
    const seq = Math.floor(Math.random() * 900) + 100;
    const newAdj: ReconciliationAdjustmentRecord = {
      ...data,
      id: `adj-${Date.now().toString().slice(-4)}`,
      adjustmentNumber: `ADJ-2026-00${seq}`,
      status: 'Posted to GL'
    };
    setReconciliationAdjustments((prev) => [newAdj, ...prev]);

    // Update bank balance based on adjustment type
    const bank = bankAccounts.find((b) => b.id === data.bankAccountId);
    const isCreditIncome = data.adjustmentType.includes('Income');

    setBankAccounts((prev) =>
      prev.map((b) =>
        b.id === data.bankAccountId
          ? {
              ...b,
              currentBookBalance: isCreditIncome ? b.currentBookBalance + data.amount : b.currentBookBalance - data.amount,
              unreconciledDifference: Math.max(0, b.unreconciledDifference - data.amount)
            }
          : b
      )
    );

    // Generate GL voucher
    const gl = BankingWorkflowEngine.generateGLAccountingImpact('RECON_ADJUSTMENT', {
      transactionRef: newAdj.adjustmentNumber,
      amountOMR: data.amount,
      currency: data.currency,
      bankAccountName: data.bankAccountName || bank?.accountName,
      bankGlCode: bank?.glAccountCode || '1010-01-001',
      offsetAccountCode: data.glOffsetAccount,
      offsetAccountName: data.glOffsetAccountName || data.adjustmentType,
      narration: `${data.adjustmentType}: ${data.narration}`,
      postedBy: activeActor.name
    });
    setGlJournalEntries((prev) => [gl, ...prev]);

    const audit = BankingWorkflowEngine.logAuditAction({
      actor: activeActor,
      action: 'POST_GL',
      entityType: 'STATEMENT_RECON',
      entityId: newAdj.id,
      entityReference: newAdj.adjustmentNumber,
      amountOMR: data.amount,
      details: `Reconciliation adjustment ${newAdj.adjustmentNumber} posted for OMR ${data.amount.toLocaleString()} (${data.adjustmentType}). GL Voucher: ${gl.voucherNumber}`
    });
    setAuditLogs((prev) => [audit, ...prev]);
  };

  // -------------------------------------------------------------
  // 04.06 Petty Cash Actions
  // -------------------------------------------------------------
  const addPettyCashAccount = (data: Omit<PettyCashAccountRecord, 'id'>) => {
    const newAcc: PettyCashAccountRecord = {
      ...data,
      id: `pc-${Date.now().toString().slice(-4)}`
    };
    setPettyCashAccounts((prev) => [newAcc, ...prev]);
  };

  const issuePettyCashAdvance = (data: Omit<PettyCashAdvanceRecord, 'id' | 'advanceNumber' | 'status'>) => {
    const seq = Math.floor(Math.random() * 900) + 100;
    const newAdv: PettyCashAdvanceRecord = {
      ...data,
      id: `pca-${Date.now().toString().slice(-4)}`,
      advanceNumber: `IOU-2026-00${seq}`,
      status: 'Open / Disbursed'
    };
    setPettyCashAdvances((prev) => [newAdv, ...prev]);

    // adjust float
    setPettyCashAccounts((prev) =>
      prev.map((a) =>
        a.id === data.pettyCashAccountId
          ? {
              ...a,
              currentAvailableCashOMR: Math.max(0, a.currentAvailableCashOMR - data.advanceAmountOMR),
              openAdvancesIOUOMR: a.openAdvancesIOUOMR + data.advanceAmountOMR
            }
          : a
      )
    );
  };

  const settlePettyCashAdvance = (advanceId: string, actualExpenseOMR: number, cashReturnedOMR: number) => {
    const adv = pettyCashAdvances.find((a) => a.id === advanceId);
    if (!adv) return;

    setPettyCashAdvances((prev) =>
      prev.map((a) =>
        a.id === advanceId
          ? {
              ...a,
              status: 'Settled',
              actualExpenseSubmittedOMR: actualExpenseOMR,
              cashReturnedOMR: cashReturnedOMR,
              settlementDate: new Date().toISOString().split('T')[0]
            }
          : a
      )
    );

    // replenish account available cash with cash returned
    setPettyCashAccounts((prev) =>
      prev.map((acc) =>
        acc.id === adv.pettyCashAccountId
          ? {
              ...acc,
              currentAvailableCashOMR: acc.currentAvailableCashOMR + cashReturnedOMR,
              openAdvancesIOUOMR: Math.max(0, acc.openAdvancesIOUOMR - adv.advanceAmountOMR),
              pendingUnclaimedExpensesOMR: acc.pendingUnclaimedExpensesOMR + actualExpenseOMR
            }
          : acc
      )
    );
  };

  const submitPettyCashExpense = (data: Omit<PettyCashExpenseRecord, 'id' | 'voucherNumber' | 'status'>) => {
    const seq = Math.floor(Math.random() * 900) + 100;
    const newExp: PettyCashExpenseRecord = {
      ...data,
      id: `pce-${Date.now().toString().slice(-4)}`,
      voucherNumber: `PCV-2026-00${seq}`,
      status: 'Verified'
    };
    setPettyCashExpenses((prev) => [newExp, ...prev]);

    setPettyCashAccounts((prev) =>
      prev.map((acc) =>
        acc.id === data.pettyCashAccountId
          ? {
              ...acc,
              currentAvailableCashOMR: Math.max(0, acc.currentAvailableCashOMR - data.grossAmountOMR),
              pendingUnclaimedExpensesOMR: acc.pendingUnclaimedExpensesOMR + data.grossAmountOMR
            }
          : acc
      )
    );
  };

  const createPettyCashReconciliation = (accountId: string, countedCash: number) => {
    const acc = pettyCashAccounts.find((a) => a.id === accountId);
    if (!acc) return;

    const vouchersSum = acc.pendingUnclaimedExpensesOMR;
    const advancesSum = acc.openAdvancesIOUOMR;
    const totalAccounted = countedCash + vouchersSum + advancesSum;
    const variance = totalAccounted - acc.imprestLimitOMR;
    const replenishmentNeeded = acc.imprestLimitOMR - countedCash;

    const newRecon: PettyCashReconciliationRecord = {
      id: `pcr-${Date.now().toString().slice(-4)}`,
      reconciliationBatchNo: `PCR-2026-08-${acc.fundCode.slice(-4)}`,
      pettyCashAccountId: accountId,
      pettyCashAccountName: acc.fundName,
      periodEndDate: new Date().toISOString().split('T')[0],
      floatLimitOMR: acc.imprestLimitOMR,
      physicalCashCountedOMR: countedCash,
      vouchersSumOMR: vouchersSum,
      advancesSumOMR: advancesSum,
      totalAccountedOMR: totalAccounted,
      shortageOrSurplusOMR: variance,
      replenishmentChequeRequestedOMR: replenishmentNeeded,
      status: 'Submitted for Audit',
      auditedBy: activeActor.name,
      reimbursementBankAccountId: 'acct-01'
    };

    setPettyCashReconciliations((prev) => [newRecon, ...prev]);
  };

  // -------------------------------------------------------------
  // 04.07 Treasury Actions
  // -------------------------------------------------------------
  const addBankFacility = (data: Omit<BankFacilityRecord, 'id'>) => {
    const newFac: BankFacilityRecord = {
      ...data,
      id: `fac-${Date.now().toString().slice(-4)}`
    };
    setBankFacilities((prev) => [newFac, ...prev]);
  };

  const updateBankFacilityUtilization = (facilityId: string, newUtilizedAmount: number) => {
    setBankFacilities((prev) =>
      prev.map((f) =>
        f.id === facilityId
          ? {
              ...f,
              utilizedAmountOMR: newUtilizedAmount,
              availableHeadroomOMR: Math.max(0, f.sanctionedLimitOMR - newUtilizedAmount)
            }
          : f
      )
    );
  };

  const recordBankChargeAudit = (data: Omit<BankChargeAuditRecord, 'id' | 'auditRefNumber'>) => {
    const seq = Math.floor(Math.random() * 900) + 100;
    const newAudit: BankChargeAuditRecord = {
      ...data,
      id: `bca-${Date.now().toString().slice(-4)}`,
      auditRefNumber: `BCA-2026-08-00${seq}`
    };
    setBankChargeAudits((prev) => [newAudit, ...prev]);
  };

  const registerPostDatedCheque = (data: Omit<PostDatedChequeRecord, 'id' | 'pdcReference' | 'status' | 'daysUntilMaturity'>) => {
    const seq = Math.floor(Math.random() * 900) + 100;
    const days = Math.max(0, Math.ceil((new Date(data.maturityDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)));
    const newPdc: PostDatedChequeRecord = {
      ...data,
      id: `pdc-${Date.now().toString().slice(-4)}`,
      pdcReference: `PDC-${data.direction.startsWith('Rec') ? 'REC' : 'PAY'}-2026-00${seq}`,
      status: 'In Vault',
      daysUntilMaturity: days
    };
    setPostDatedCheques((prev) => [newPdc, ...prev]);
  };

  const updatePDCStatus = (pdcId: string, newStatus: PDCStatus, clearingAccountId?: string) => {
    const pdc = postDatedCheques.find((p) => p.id === pdcId);
    if (!pdc) return;

    setPostDatedCheques((prev) =>
      prev.map((p) =>
        p.id === pdcId
          ? {
              ...p,
              status: newStatus,
              clearingBankAccountId: clearingAccountId || p.clearingBankAccountId,
              actualClearingDate: newStatus === 'Cleared' ? new Date().toISOString().split('T')[0] : p.actualClearingDate
            }
          : p
      )
    );

    // If cleared, adjust bank account balance and generate GL impact
    if (newStatus === 'Cleared') {
      const targetAccountId = clearingAccountId || pdc.clearingBankAccountId || 'acct-01';
      const isReceivable = pdc.direction.startsWith('Rec');

      setBankAccounts((prev) =>
        prev.map((acc) =>
          acc.id === targetAccountId
            ? {
                ...acc,
                clearedBankBalance: isReceivable ? acc.clearedBankBalance + pdc.amountInOMR : acc.clearedBankBalance - pdc.amountInOMR,
                currentBookBalance: isReceivable ? acc.currentBookBalance + pdc.amountInOMR : acc.currentBookBalance - pdc.amountInOMR
              }
            : acc
        )
      );

      const gl = BankingWorkflowEngine.generateGLAccountingImpact('PDC_CLEARING', {
        transactionRef: pdc.pdcReference,
        amountOMR: pdc.amountInOMR,
        currency: pdc.currency,
        offsetAccountCode: isReceivable ? '1020-01-002' : '2010-01-002',
        offsetAccountName: isReceivable ? 'Post-Dated Cheques in Hand (Asset)' : 'Post-Dated Cheques Payable (Liability)',
        payeeOrCustomerName: pdc.drawerOrPayeeName,
        narration: `Clearing of PDC ${pdc.chequeNumber} (${pdc.direction}) for ${pdc.drawerOrPayeeName}`,
        postedBy: activeActor.name
      });
      setGlJournalEntries((prev) => [gl, ...prev]);

      const audit = BankingWorkflowEngine.logAuditAction({
        actor: activeActor,
        action: 'CLEAR_PDC',
        entityType: 'PDC',
        entityId: pdc.id,
        entityReference: pdc.pdcReference,
        amountOMR: pdc.amountInOMR,
        details: `PDC #${pdc.chequeNumber} cleared into account. GL voucher ${gl.voucherNumber} posted.`
      });
      setAuditLogs((prev) => [audit, ...prev]);
    }
  };

  // -------------------------------------------------------------
  // Summary Aggregations
  // -------------------------------------------------------------
  const totalLiquidityOMR =
    bankAccounts.reduce((acc, b) => acc + (b.currency === 'OMR' ? b.currentBookBalance : b.currentBookBalance * 0.385), 0) +
    cashAccounts.reduce((acc, c) => acc + c.currentBalance, 0);

  const totalFacilitiesSanctionedOMR = bankFacilities.reduce((acc, f) => acc + f.sanctionedLimitOMR, 0);
  const totalFacilitiesHeadroomOMR = bankFacilities.reduce((acc, f) => acc + f.availableHeadroomOMR, 0);

  const totalUnreconciledDifferenceOMR = bankAccounts.reduce((acc, b) => acc + Math.abs(b.unreconciledDifference), 0);

  const pendingApprovalsCount = approvalQueue.filter((q) => q.status === 'Pending').length;

  const totalPdcReceivablesOMR = postDatedCheques
    .filter((p) => p.direction.startsWith('Rec') && p.status !== 'Cleared' && p.status !== 'Cancelled')
    .reduce((acc, p) => acc + p.amountInOMR, 0);

  const totalPdcPayablesOMR = postDatedCheques
    .filter((p) => p.direction.startsWith('Pay') && p.status !== 'Cleared' && p.status !== 'Cancelled')
    .reduce((acc, p) => acc + p.amountInOMR, 0);

  return (
    <BankingTreasuryContext.Provider
      value={{
        // Actor Simulation
        activeActor,
        setActiveActor,
        availableActors: ENTERPRISE_BANKING_ACTORS,
        evaluateWorkflowTiers,

        // 04.01 Bank
        bankMasters,
        bankAccounts,
        bankSignatories,
        bankLimits,
        addBankMaster,
        addBankAccount,
        updateBankAccountStatus,
        addBankSignatory,
        addBankLimit,

        // 04.02 Cash
        cashAccounts,
        cashReceipts,
        cashPayments,
        cashPosition,
        addCashAccount,
        recordCashReceipt,
        recordCashPayment,
        updateCashPaymentStatus,

        // 04.03 Payment
        bankPayments,
        chequePayments,
        electronicBatches,
        approvalQueue,
        createBankPayment,
        updateBankPaymentStatus,
        issueChequePayment,
        updateChequeStatus,
        createElectronicBatch,
        processPaymentApproval,

        // 04.04 Receipt
        customerReceipts,
        otherReceipts,
        depositSlips,
        receiptAllocations,
        recordCustomerReceipt,
        allocateReceiptToInvoice,
        recordOtherReceipt,
        generateDepositSlip,

        // 04.05 Reconciliation
        statementImports,
        statementLines,
        reconciliationAdjustments,
        importBankStatement,
        runAutoMatchingEngine,
        toggleManualReconciliation,
        createReconciliationAdjustment,

        // 04.06 Petty Cash
        pettyCashAccounts,
        pettyCashAdvances,
        pettyCashExpenses,
        pettyCashReconciliations,
        addPettyCashAccount,
        issuePettyCashAdvance,
        settlePettyCashAdvance,
        submitPettyCashExpense,
        createPettyCashReconciliation,

        // 04.07 Treasury
        cashFlowForecast,
        bankFacilities,
        bankChargeAudits,
        postDatedCheques,
        addBankFacility,
        updateBankFacilityUtilization,
        recordBankChargeAudit,
        registerPostDatedCheque,
        updatePDCStatus,

        // GL & Audit Logs
        glJournalEntries,
        auditLogs,

        // Summary metrics
        totalLiquidityOMR,
        totalFacilitiesSanctionedOMR,
        totalFacilitiesHeadroomOMR,
        totalUnreconciledDifferenceOMR,
        pendingApprovalsCount,
        totalPdcReceivablesOMR,
        totalPdcPayablesOMR,
        resetToDefaultData
      }}
    >
      {children}
    </BankingTreasuryContext.Provider>
  );
};

export const useBankingTreasury = () => {
  const context = useContext(BankingTreasuryContext);
  if (!context) {
    throw new Error('useBankingTreasury must be used within a BankingTreasuryProvider');
  }
  return context;
};

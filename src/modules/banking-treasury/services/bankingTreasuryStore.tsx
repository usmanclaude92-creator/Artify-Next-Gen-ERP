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
  PDCStatus
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

interface BankingTreasuryContextType {
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
  recordCashPayment: (data: Omit<CashPaymentRecord, 'id' | 'voucherNumber' | 'status' | 'cashierSignatureDate'>) => void;
  updateCashPaymentStatus: (id: string, status: CashPaymentRecord['status']) => void;

  // 04.03 Payment Management
  bankPayments: BankPaymentRecord[];
  chequePayments: ChequePaymentRecord[];
  electronicBatches: ElectronicPaymentBatch[];
  approvalQueue: PaymentApprovalQueueItem[];
  createBankPayment: (data: Omit<BankPaymentRecord, 'id' | 'paymentReference' | 'status'>) => void;
  updateBankPaymentStatus: (id: string, status: TransactionStatus) => void;
  issueChequePayment: (data: Omit<ChequePaymentRecord, 'id' | 'status'>) => void;
  updateChequeStatus: (id: string, status: ChequePaymentRecord['status']) => void;
  createElectronicBatch: (data: Omit<ElectronicPaymentBatch, 'id' | 'batchNumber' | 'status'>) => void;
  processPaymentApproval: (queueItemId: string, decision: 'approve' | 'reject', comment?: string) => void;

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

  // Summary Metrics & Utilities
  totalLiquidityOMR: number;
  totalFacilitiesSanctionedOMR: number;
  totalFacilitiesHeadroomOMR: number;
  totalUnreconciledDifferenceOMR: number;
  pendingApprovalsCount: number;
  totalPdcReceivablesOMR: number;
  totalPdcPayablesOMR: number;
}

const BankingTreasuryContext = createContext<BankingTreasuryContextType | undefined>(undefined);

export const BankingTreasuryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
  const [approvalQueue, setApprovalQueue] = useState<PaymentApprovalQueueItem[]>(mockPaymentApprovalQueue);

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

  // -------------------------------------------------------------
  // 04.01 Actions
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
  // 04.02 Actions
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
    // update cash account balance
    setCashAccounts((prev) =>
      prev.map((acc) =>
        acc.id === data.cashAccountId ? { ...acc, currentBalance: acc.currentBalance + data.amount } : acc
      )
    );
  };

  const recordCashPayment = (data: Omit<CashPaymentRecord, 'id' | 'voucherNumber' | 'status' | 'cashierSignatureDate'>) => {
    const seq = Math.floor(Math.random() * 900) + 100;
    const newPayment: CashPaymentRecord = {
      ...data,
      id: `cp-${Date.now().toString().slice(-4)}`,
      voucherNumber: `CP-2026-00${seq}`,
      cashierSignatureDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Posted'
    };
    setCashPayments((prev) => [newPayment, ...prev]);
    // decrease cash balance
    setCashAccounts((prev) =>
      prev.map((acc) =>
        acc.id === data.cashAccountId ? { ...acc, currentBalance: Math.max(0, acc.currentBalance - data.amount) } : acc
      )
    );
  };

  const updateCashPaymentStatus = (id: string, status: CashPaymentRecord['status']) => {
    setCashPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  // -------------------------------------------------------------
  // 04.03 Actions
  // -------------------------------------------------------------
  const createBankPayment = (data: Omit<BankPaymentRecord, 'id' | 'paymentReference' | 'status'>) => {
    const seq = Math.floor(Math.random() * 900) + 100;
    const newPay: BankPaymentRecord = {
      ...data,
      id: `bp-${Date.now().toString().slice(-4)}`,
      paymentReference: `PAY-WIR-2026-00${seq}`,
      status: 'Submitted'
    };
    setBankPayments((prev) => [newPay, ...prev]);

    // add to approval queue if amount > 5000 OMR
    if (data.amountInOMR > 5000) {
      const queueItem: PaymentApprovalQueueItem = {
        id: `app-${Date.now().toString().slice(-4)}`,
        transactionId: newPay.id,
        transactionRef: newPay.paymentReference,
        transactionType: 'Bank Wire Transfer',
        beneficiaryName: data.beneficiaryName,
        amount: data.amount,
        currency: data.currency,
        submittedBy: data.preparedBy,
        submissionDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
        requiredApprovalLevel: data.amountInOMR > 50000 ? 'Level 2 (CFO + CEO)' : 'Level 1 (Treasury Director)',
        currentStep: 1,
        totalSteps: data.amountInOMR > 50000 ? 2 : 1,
        urgency: data.amountInOMR > 50000 ? 'Urgent / Same-Day' : 'Standard',
        status: 'Pending',
        complianceCheckPassed: true,
        sanctionsScreeningPassed: true
      };
      setApprovalQueue((prev) => [queueItem, ...prev]);
    }
  };

  const updateBankPaymentStatus = (id: string, status: TransactionStatus) => {
    setBankPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const issueChequePayment = (data: Omit<ChequePaymentRecord, 'id' | 'status'>) => {
    const newChq: ChequePaymentRecord = {
      ...data,
      id: `chq-${Date.now().toString().slice(-4)}`,
      status: 'Signed'
    };
    setChequePayments((prev) => [newChq, ...prev]);

    // If it is post-dated, register into PDC vault automatically
    if (data.isPostDated) {
      const newPdc: PostDatedChequeRecord = {
        id: `pdc-${Date.now().toString().slice(-4)}`,
        pdcReference: `PDC-PAY-2026-${Math.floor(Math.random() * 900) + 100}`,
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
  };

  const updateChequeStatus = (id: string, status: ChequePaymentRecord['status']) => {
    setChequePayments((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const createElectronicBatch = (data: Omit<ElectronicPaymentBatch, 'id' | 'batchNumber' | 'status'>) => {
    const seq = Math.floor(Math.random() * 900) + 100;
    const newBatch: ElectronicPaymentBatch = {
      ...data,
      id: `wps-${Date.now().toString().slice(-4)}`,
      batchNumber: `WPS-2026-08-B${seq}`,
      status: 'Pending Dual Sign-off'
    };
    setElectronicBatches((prev) => [newBatch, ...prev]);
  };

  const processPaymentApproval = (queueItemId: string, decision: 'approve' | 'reject') => {
    const item = approvalQueue.find((q) => q.id === queueItemId);
    if (!item) return;

    setApprovalQueue((prev) =>
      prev.map((q) => (q.id === queueItemId ? { ...q, status: decision === 'approve' ? 'Approved' : 'Rejected' } : q))
    );

    // Update underlying bank payment
    if (decision === 'approve') {
      updateBankPaymentStatus(item.transactionId, 'Approved');
    } else {
      updateBankPaymentStatus(item.transactionId, 'Rejected');
    }
  };

  // -------------------------------------------------------------
  // 04.04 Actions
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
  // 04.05 Actions
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
      importedBy: 'Direct Upload Feed',
      reconciliationStatus: 'Imported'
    };
    setStatementImports((prev) => [newImport, ...prev]);
  };

  const runAutoMatchingEngine = (statementImportId: string) => {
    let matched = 0;
    setStatementLines((prev) =>
      prev.map((line) => {
        if (line.statementImportId === statementImportId || !line.isReconciled) {
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
        st.id === statementImportId
          ? {
              ...st,
              matchedLinesCount: st.totalLinesCount - 1,
              unmatchedLinesCount: 1,
              reconciliationStatus: 'Partially Reconciled'
            }
          : st
      )
    );

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
  };

  // -------------------------------------------------------------
  // 04.06 Actions
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
      auditedBy: 'Dr. Tariq Al-Habsi',
      reimbursementBankAccountId: 'acct-01'
    };

    setPettyCashReconciliations((prev) => [newRecon, ...prev]);
  };

  // -------------------------------------------------------------
  // 04.07 Actions
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
        bankMasters,
        bankAccounts,
        bankSignatories,
        bankLimits,
        addBankMaster,
        addBankAccount,
        updateBankAccountStatus,
        addBankSignatory,
        addBankLimit,

        cashAccounts,
        cashReceipts,
        cashPayments,
        cashPosition,
        addCashAccount,
        recordCashReceipt,
        recordCashPayment,
        updateCashPaymentStatus,

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

        customerReceipts,
        otherReceipts,
        depositSlips,
        receiptAllocations,
        recordCustomerReceipt,
        allocateReceiptToInvoice,
        recordOtherReceipt,
        generateDepositSlip,

        statementImports,
        statementLines,
        reconciliationAdjustments,
        importBankStatement,
        runAutoMatchingEngine,
        toggleManualReconciliation,
        createReconciliationAdjustment,

        pettyCashAccounts,
        pettyCashAdvances,
        pettyCashExpenses,
        pettyCashReconciliations,
        addPettyCashAccount,
        issuePettyCashAdvance,
        settlePettyCashAdvance,
        submitPettyCashExpense,
        createPettyCashReconciliation,

        cashFlowForecast,
        bankFacilities,
        bankChargeAudits,
        postDatedCheques,
        addBankFacility,
        updateBankFacilityUtilization,
        recordBankChargeAudit,
        registerPostDatedCheque,
        updatePDCStatus,

        totalLiquidityOMR,
        totalFacilitiesSanctionedOMR,
        totalFacilitiesHeadroomOMR,
        totalUnreconciledDifferenceOMR,
        pendingApprovalsCount,
        totalPdcReceivablesOMR,
        totalPdcPayablesOMR
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

export type CurrencyCode = 'OMR' | 'USD' | 'AED' | 'SAR' | 'EUR' | 'GBP';

export type PaymentMethod = 'Bank Transfer' | 'Cheque' | 'Electronic / WPS' | 'Direct Debit' | 'Corporate Card' | 'Letter of Credit';

export type TransactionStatus = 'Draft' | 'Submitted' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Posted' | 'Cleared' | 'Voided' | 'Reconciled';

export type PDCStatus = 'In Vault' | 'Deposited' | 'Cleared' | 'Bounced' | 'Returned' | 'Replaced' | 'Cancelled';

export type FacilityType = 'Overdraft (OD)' | 'Letter of Credit (LC)' | 'Bank Guarantee (BG)' | 'Short-Term Loan (STL)' | 'Revolving Credit Line' | 'Bill Discounting';

export type FacilityStatus = 'Active' | 'Under Review' | 'Expired' | 'Exceeded' | 'Closed';

// -------------------------------------------------------------
// 04.01 — Bank Management Types
// -------------------------------------------------------------
export interface BankMasterRecord {
  id: string;
  bankCode: string;
  bankNameEn: string;
  bankNameAr: string;
  swiftBic: string;
  routingCode: string;
  country: string;
  headOfficeAddress: string;
  relationshipManagerName: string;
  relationshipManagerEmail: string;
  relationshipManagerPhone: string;
  supportHelpdesk: string;
  ratingAgencyGrade: string; // e.g. "Moody's A3 / Fitch BBB+"
  status: 'Active' | 'Inactive';
  totalAccountsLinked: number;
  totalFacilitiesOMR: number;
  createdAt: string;
  updatedAt: string;
}

export interface BankAccountRecord {
  id: string;
  bankId: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  accountType: 'Current Operating' | 'Call Deposit' | 'Escrow Account' | 'Fixed Deposit' | 'Payroll (WPS)' | 'Foreign Currency Reserve';
  iban: string;
  currency: CurrencyCode;
  glAccountCode: string;
  glAccountName: string;
  branchName: string;
  openingDate: string;
  currentBookBalance: number;
  clearedBankBalance: number;
  unreconciledDifference: number;
  overdraftLimit: number;
  interestRatePercent: number;
  signatoryRule: string; // e.g., "Any 2 Category A or 1 Category A + 1 Category B"
  isPrimaryOperating: boolean;
  status: 'Active' | 'Dormant' | 'Frozen' | 'Closed';
  lastReconciledDate: string;
}

export interface BankSignatoryRecord {
  id: string;
  bankAccountId: string;
  accountNumber: string;
  signatoryName: string;
  signatoryTitle: string;
  categoryTier: 'Category A (Executive)' | 'Category B (Senior Management)' | 'Category C (Operational Finance)';
  authorizationLimitOMR: number; // e.g., 500000
  powerOfAttorneyRef: string;
  validFrom: string;
  validUntil: string;
  specimenCardStatus: 'Verified On File' | 'Pending Renewal' | 'Expired';
  status: 'Active' | 'Suspended' | 'Revoked';
  contactEmail: string;
  contactMobile: string;
}

export interface BankLimitRecord {
  id: string;
  bankId: string;
  bankName: string;
  limitType: 'Overdraft Limit' | 'Single Electronic Wire Cap' | 'Daily Batch Disbursement Cap' | 'FX Spot Limit' | 'Treasury Placements Cap';
  allocatedAmountOMR: number;
  utilizedAmountOMR: number;
  availableAmountOMR: number;
  effectiveDate: string;
  expiryDate: string;
  covenantTerms: string;
  authorizedByBoardRef: string;
  status: 'Compliant' | 'Warning (>85% Utilized)' | 'Breached' | 'Expired';
}

// -------------------------------------------------------------
// 04.02 — Cash Management Types
// -------------------------------------------------------------
export interface CashAccountRecord {
  id: string;
  accountCode: string;
  accountName: string;
  locationBranch: string;
  vaultType: 'Main Vault Safe' | 'Cashier Till Drawer' | 'Branch Petty Box' | 'Transit Security Bag';
  glAccountCode: string;
  custodianName: string;
  custodianEmployeeId: string;
  currency: CurrencyCode;
  currentBalance: number;
  maxHoldingLimit: number;
  insuranceCoverageLimit: number;
  lastCountTimestamp: string;
  status: 'Active' | 'Auditing' | 'Locked' | 'Closed';
}

export interface CashReceiptRecord {
  id: string;
  receiptNumber: string;
  cashAccountId: string;
  cashAccountName: string;
  dateReceived: string;
  receivedFrom: string;
  customerCode?: string;
  currency: CurrencyCode;
  amount: number;
  amountInWords: string;
  reasonCategory: 'Counter Sale Collection' | 'Customer AR Settlement' | 'Unearned Advance' | 'Security Deposit' | 'Refund / Expense Recovery' | 'Petty Cash Return';
  notes: string;
  glCreditAccount: string;
  cashierName: string;
  witnessName: string;
  printedVoucherNumber: string;
  status: 'Draft' | 'Posted' | 'Reconciled' | 'Voided';
  attachmentRef?: string;
}

export interface CashPaymentRecord {
  id: string;
  voucherNumber: string;
  cashAccountId: string;
  cashAccountName: string;
  paymentDate: string;
  payeeName: string;
  payeeIdOrCivilNo: string;
  amount: number;
  currency: CurrencyCode;
  amountInWords: string;
  expenseCategory: 'Local Vendor Settlement' | 'Emergency Office Maintenance' | 'Chauffeur Fuel Float' | 'Official Hospitality' | 'Staff Cash Advance';
  glDebitAccount: string;
  supportingInvoiceNo: string;
  requestedBy: string;
  approvedBy: string;
  cashierSignatureDate: string;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Posted' | 'Cancelled';
}

export interface CashPositionSummary {
  totalVaultCashOMR: number;
  totalTillCashOMR: number;
  inTransitOMR: number;
  totalPhysicalCashOMR: number;
  locationsReported: number;
  locationsPendingAudit: number;
  asOfDate: string;
}

// -------------------------------------------------------------
// 04.03 — Payment Management Types
// -------------------------------------------------------------
export interface BankPaymentRecord {
  id: string;
  paymentReference: string;
  bankAccountId: string;
  bankAccountName: string;
  paymentDate: string;
  vendorId?: string;
  beneficiaryName: string;
  beneficiaryBank: string;
  beneficiaryIban: string;
  beneficiarySwift: string;
  currency: CurrencyCode;
  amount: number;
  exchangeRate: number;
  amountInOMR: number;
  paymentMethod: PaymentMethod;
  purposeOfRemittance: string;
  invoiceReferences: string[];
  preparedBy: string;
  firstApprover?: string;
  secondApprover?: string;
  status: TransactionStatus;
  valueDate: string;
  bankChargesBorneBy: 'OUR (Debtor)' | 'BEN (Creditor)' | 'SHA (Shared)';
  bankSwiftRefNumber?: string;
}

export interface ChequePaymentRecord {
  id: string;
  chequeNumber: string;
  bankAccountId: string;
  bankAccountName: string;
  chequeDate: string;
  dueDate: string; // for PDCs
  payeeName: string;
  amount: number;
  currency: CurrencyCode;
  isAccountPayeeOnly: boolean;
  isPostDated: boolean;
  chequeBookId: string;
  glDebitAccount: string;
  purpose: string;
  status: 'Printed' | 'Signed' | 'Handed to Payee' | 'Presented & Cleared' | 'Stopped / Void' | 'Bounced';
  preparedBy: string;
  signatoryA: string;
  signatoryB?: string;
  handoverReceiptRef?: string;
}

export interface ElectronicPaymentBatch {
  id: string;
  batchNumber: string;
  bankAccountId: string;
  bankAccountName: string;
  batchType: 'Oman WPS Payroll' | 'ISO 20022 pain.001' | 'Corporate Bulk Transfer' | 'Cross-Border SWIFT Batch';
  totalTransactions: number;
  totalAmount: number;
  currency: CurrencyCode;
  creationDate: string;
  executionDate: string;
  status: 'Draft' | 'Validating' | 'Pending Dual Sign-off' | 'Exported / Transmitted' | 'Bank Acknowledged' | 'Processed' | 'Rejected';
  generatedFileFormat: 'WPS .SIF' | 'XML pain.001.001.03' | 'CSV Flat File';
  authorizedSignatories: string[];
}

export interface PaymentApprovalQueueItem {
  id: string;
  transactionId: string;
  transactionRef: string;
  transactionType: 'Bank Wire Transfer' | 'Cheque Release' | 'Electronic Batch (WPS)' | 'Urgent High-Value Payment';
  beneficiaryName: string;
  amount: number;
  currency: CurrencyCode;
  submittedBy: string;
  submissionDate: string;
  requiredApprovalLevel: string; // e.g. "Level 2 (CEO + CFO)"
  currentStep: number;
  totalSteps: number;
  urgency: 'Standard' | 'Urgent / Same-Day' | 'Critical SLA';
  status: 'Pending' | 'Approved' | 'Rejected';
  complianceCheckPassed: boolean;
  sanctionsScreeningPassed: boolean;
}

// -------------------------------------------------------------
// 04.04 — Receipt Management Types
// -------------------------------------------------------------
export interface CustomerReceiptRecord {
  id: string;
  receiptNumber: string;
  receiptDate: string;
  customerId: string;
  customerName: string;
  receivingBankAccountId: string;
  receivingBankAccountName: string;
  paymentMode: 'Direct Bank Wire' | 'Cheque' | 'Credit Card Payment Gateway' | 'Point of Sale (POS)' | 'Cash';
  instrumentReference: string; // e.g., Cheque No. or Bank Wire UTR
  currency: CurrencyCode;
  amountReceived: number;
  exchangeRate: number;
  amountOMR: number;
  allocatedAmount: number;
  unallocatedAmount: number;
  glCreditAccount: string;
  collectorName: string;
  depositSlipRef?: string;
  status: 'Draft' | 'Posted' | 'Partially Allocated' | 'Fully Allocated' | 'Reconciled';
}

export interface OtherReceiptRecord {
  id: string;
  receiptNumber: string;
  receiptDate: string;
  receivingBankAccountId: string;
  receivingBankAccountName: string;
  payerName: string;
  receiptCategory: 'Bank Term Deposit Interest' | 'Scrap & Asset Disposal Proceeds' | 'Insurance Claim Settlement' | 'Inter-Company Loan Receipt' | 'Government Subsidy / Incentive' | 'Rental Income';
  currency: CurrencyCode;
  amount: number;
  glCreditAccount: string;
  glCreditAccountName: string;
  remarks: string;
  status: 'Draft' | 'Posted' | 'Reconciled';
}

export interface BankDepositSlipRecord {
  id: string;
  depositSlipNumber: string;
  depositDate: string;
  targetBankAccountId: string;
  targetBankAccountName: string;
  depositedBy: string;
  totalCashAmount: number;
  totalChequesAmount: number;
  chequeCount: number;
  grandTotalDeposit: number;
  currency: CurrencyCode;
  bankBranchDepositLocation: string;
  bankTellerStampRef: string;
  status: 'Prepared' | 'Dispatched with Courier' | 'Bank Confirmed' | 'Cancelled';
}

export interface ReceiptAllocationItem {
  id: string;
  receiptId: string;
  invoiceId: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceOriginalAmount: number;
  invoiceDueAmount: number;
  allocatedThisVoucher: number;
  discountTaken: number;
  withholdingTaxDeducted: number;
  remainingDueAfterAllocation: number;
}

// -------------------------------------------------------------
// 04.05 — Bank Reconciliation Types
// -------------------------------------------------------------
export interface BankStatementImportRecord {
  id: string;
  bankAccountId: string;
  bankAccountName: string;
  statementReference: string;
  statementPeriodStart: string;
  statementPeriodEnd: string;
  openingBalance: number;
  closingBalance: number;
  totalCreditEntries: number;
  totalDebitEntries: number;
  totalLinesCount: number;
  matchedLinesCount: number;
  unmatchedLinesCount: number;
  importFormat: 'MT940 SWIFT' | 'CAMT.053 XML' | 'CSV Bank Feed' | 'OFX Format';
  importedAt: string;
  importedBy: string;
  reconciliationStatus: 'Imported' | 'Auto-Matched' | 'Partially Reconciled' | 'Fully Reconciled' | 'Closed & Signed';
}

export interface BankStatementLine {
  id: string;
  statementImportId: string;
  bankAccountId: string;
  transactionDate: string;
  valueDate: string;
  bookingText: string;
  narrativeDescription: string;
  bankReference: string;
  transactionType: 'Credit' | 'Debit';
  amount: number;
  currency: CurrencyCode;
  matchedErpVoucherId?: string;
  matchedVoucherRef?: string;
  matchScorePercent?: number;
  matchMethod?: 'Exact Match (100%)' | 'Fuzzy Rule (95%)' | 'AI Suggested (88%)' | 'Manual Tagged' | 'Unmatched';
  isReconciled: boolean;
  requiresAdjustment: boolean;
  adjustmentReason?: 'Bank Charges' | 'Interest Income' | 'FX Difference' | 'Direct Debit Not Yet Booked' | 'Unrecorded Receipt';
}

export interface ReconciliationAdjustmentRecord {
  id: string;
  adjustmentNumber: string;
  bankAccountId: string;
  bankAccountName: string;
  statementLineId: string;
  adjustmentDate: string;
  adjustmentType: 'Bank Service Charges' | 'Overdraft Interest Expense' | 'Credit Interest Income' | 'FX Translation Variance' | 'Direct Standing Order';
  amount: number;
  currency: CurrencyCode;
  glOffsetAccount: string;
  glOffsetAccountName: string;
  narration: string;
  taxAmountVAT: number;
  status: 'Draft' | 'Posted to GL';
  postedBy: string;
}

// -------------------------------------------------------------
// 04.06 — Petty Cash Types
// -------------------------------------------------------------
export interface PettyCashAccountRecord {
  id: string;
  fundCode: string;
  fundName: string;
  custodianName: string;
  custodianEmail: string;
  department: string;
  branch: string;
  imprestLimitOMR: number;
  currentAvailableCashOMR: number;
  pendingUnclaimedExpensesOMR: number;
  openAdvancesIOUOMR: number;
  glAccountCode: string;
  reimbursementThresholdPercent: number; // e.g. 70% used triggers replenishment
  status: 'Active' | 'Replenishing' | 'Under Audit' | 'Suspended';
}

export interface PettyCashAdvanceRecord {
  id: string;
  advanceNumber: string;
  pettyCashAccountId: string;
  pettyCashAccountName: string;
  issuedDate: string;
  settlementDueDate: string;
  employeeName: string;
  employeeCivilId: string;
  department: string;
  advanceAmountOMR: number;
  purpose: string;
  status: 'Open / Disbursed' | 'Settled' | 'Partially Settled' | 'Overdue';
  actualExpenseSubmittedOMR?: number;
  cashReturnedOMR?: number;
  settlementDate?: string;
}

export interface PettyCashExpenseRecord {
  id: string;
  voucherNumber: string;
  pettyCashAccountId: string;
  pettyCashAccountName: string;
  expenseDate: string;
  payeeOrMerchant: string;
  billInvoiceNo: string;
  category: 'Local Conveyance & Fuel' | 'Office Tea / Hospitality' | 'Urgent Hardware & Tools' | 'Postal & Courier' | 'Stationery & Printing' | 'Government Stamps / Attestation';
  grossAmountOMR: number;
  vatAmountOMR: number;
  netAmountOMR: number;
  glExpenseAccount: string;
  glExpenseAccountName: string;
  claimedByEmployee: string;
  approvedByDeptHead: string;
  receiptAttachmentUrl?: string;
  reimbursementBatchId?: string;
  status: 'Submitted' | 'Verified' | 'Included in Replenishment' | 'Posted';
}

export interface PettyCashReconciliationRecord {
  id: string;
  reconciliationBatchNo: string;
  pettyCashAccountId: string;
  pettyCashAccountName: string;
  periodEndDate: string;
  floatLimitOMR: number;
  physicalCashCountedOMR: number;
  vouchersSumOMR: number;
  advancesSumOMR: number;
  totalAccountedOMR: number;
  shortageOrSurplusOMR: number;
  replenishmentChequeRequestedOMR: number;
  status: 'Draft' | 'Submitted for Audit' | 'Replenishment Cheque Issued' | 'Replenished & Closed';
  auditedBy: string;
  reimbursementBankAccountId: string;
}

// -------------------------------------------------------------
// 04.07 — Treasury Management Types
// -------------------------------------------------------------
export interface CashFlowForecastItem {
  weekNumber: number;
  weekLabel: string;
  startDate: string;
  endDate: string;
  projectedInflows: {
    customerReceivables: number;
    posCounterSales: number;
    interestAndDividends: number;
    maturingPdcReceivables: number;
    otherInflows: number;
    totalInflow: number;
  };
  projectedOutflows: {
    vendorPayables: number;
    wpsPayrollSalaries: number;
    statutoryTaxesAndVAT: number;
    rentAndUtilities: number;
    bankFacilityInterestAndPrincipal: number;
    maturingPdcPayables: number;
    totalOutflow: number;
  };
  netPeriodicCashFlow: number;
  openingTreasuryBalance: number;
  closingTreasuryBalance: number;
  stressScenarioBuffer: number;
  liquidityStatus: 'Optimal Surplus' | 'Adequate' | 'Deficit Warning' | 'Critical Shortfall';
}

export interface BankFacilityRecord {
  id: string;
  facilityNumber: string;
  bankId: string;
  bankName: string;
  facilityType: FacilityType;
  sanctionedLimitOMR: number;
  utilizedAmountOMR: number;
  availableHeadroomOMR: number;
  marginDepositPercent: number;
  interestOrCommissionRate: number; // e.g. 4.75% or 1.25% commission
  tenureStartDate: string;
  expiryDate: string;
  renewalStatus: 'Active & In-Good-Standing' | 'Renewal Pending' | 'Expiring in 30 Days' | 'Matured';
  securityCollateralDetails: string;
  covenantDebtServiceCoverageRatio: number;
}

export interface BankChargeAuditRecord {
  id: string;
  auditRefNumber: string;
  bankAccountId: string;
  bankName: string;
  billingMonth: string;
  chargeCategory: 'SWIFT Wire Commission' | 'Overdraft Facility Fee' | 'Cheque Book Issuance' | 'POS Merchant Terminal Fee' | 'LC Issuance & Amendment Fee' | 'Maintenance Fee';
  billedAmountOMR: number;
  contractAgreedAmountOMR: number;
  varianceDiscrepancyOMR: number;
  auditConclusion: 'Accurate as per Schedule' | 'Disputed / Overcharged' | 'Refund Claim Lodged' | 'Refund Received';
  status: 'Audited' | 'Claim Pending' | 'Resolved';
}

export interface PostDatedChequeRecord {
  id: string;
  pdcReference: string;
  direction: 'Receivable (Customer PDC)' | 'Payable (Supplier PDC)';
  chequeNumber: string;
  bankName: string;
  drawerOrPayeeName: string;
  chequeDate: string;
  maturityDate: string;
  amount: number;
  currency: CurrencyCode;
  amountInOMR: number;
  custodyLocation: 'Treasury Safe Vault' | 'Lodged with Bank for Collection' | 'Dispatched to Supplier' | 'With Branch Cashier';
  linkedInvoiceOrVoucherRef: string;
  status: PDCStatus;
  clearingBankAccountId?: string;
  actualClearingDate?: string;
  notes?: string;
  daysUntilMaturity: number;
}

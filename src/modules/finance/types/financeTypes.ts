// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 16: FINANCIAL ACCOUNTING & REPORTING
// Master TypeScript Definitions & Data Contracts
// ==========================================

export type AccountClass = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
export type AccountSubClass = 
  | 'CURRENT_ASSET' 
  | 'NON_CURRENT_ASSET' 
  | 'CURRENT_LIABILITY' 
  | 'NON_CURRENT_LIABILITY' 
  | 'EQUITY_CAPITAL' 
  | 'RETAINED_EARNINGS' 
  | 'OPERATING_REVENUE' 
  | 'OTHER_INCOME' 
  | 'DIRECT_COST' 
  | 'OPERATING_EXPENSE' 
  | 'TAX_EXPENSE';

export interface ChartOfAccount {
  id: string;
  code: string; // e.g., '1010', '2010', '4010'
  name: string;
  nameAr?: string;
  accountClass: AccountClass;
  subClass: AccountSubClass;
  parentCode?: string;
  level: number; // 1 (Header), 2 (Control), 3 (Posting)
  currency: string;
  isReconcilable: boolean;
  isActive: boolean;
  openingBalance: number;
  currentDebit: number;
  currentCredit: number;
  closingBalance: number;
  description?: string;
}

export type VoucherStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'POSTED' | 'REJECTED' | 'CANCELLED';
export type VoucherType = 'GENERAL' | 'AP_INVOICE' | 'AR_INVOICE' | 'PAYMENT' | 'RECEIPT' | 'DEPRECIATION' | 'ACCRUAL' | 'FX_REVALUATION' | 'YEAR_END';

export interface JournalLine {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  currency: string;
  exchangeRate: number;
  baseDebit: number;
  baseCredit: number;
  description: string;
  costCenterId?: string;
  profitCenterId?: string;
  projectId?: string;
  referenceNumber?: string;
}

export interface JournalEntry {
  id: string;
  voucherNumber: string; // e.g. 'JV-2026-0012'
  voucherDate: string;
  postingDate: string;
  period: string; // '2026-03'
  voucherType: VoucherType;
  reference: string;
  narration: string;
  currency: string;
  totalDebit: number;
  totalCredit: number;
  status: VoucherStatus;
  lines: JournalLine[];
  createdBy: string;
  approvedBy?: string;
  postedBy?: string;
  postedAt?: string;
  attachmentsCount?: number;
}

export interface RecurringJournal {
  id: string;
  code: string;
  title: string;
  frequency: 'MONTHLY' | 'QUARTERLY' | 'BI_ANNUAL' | 'ANNUAL';
  startDate: string;
  endDate: string;
  nextRunDate: string;
  lastRunDate?: string;
  status: 'ACTIVE' | 'PAUSED' | 'EXPIRED';
  templateLines: JournalLine[];
  autoPost: boolean;
  narration: string;
}

// 16.02 Accounts Payable
export type InvoiceStatus = 'DRAFT' | 'VERIFIED' | 'PENDING_APPROVAL' | 'APPROVED' | 'POSTED' | 'PAID' | 'PARTIALLY_PAID' | 'REJECTED';

export interface SupplierInvoiceLine {
  id: string;
  description: string;
  expenseAccountId: string;
  costCenterId?: string;
  quantity: number;
  unitPrice: number;
  netAmount: number;
  vatRate: number; // 0.05
  vatAmount: number;
  totalAmount: number;
}

export interface SupplierInvoice {
  id: string;
  invoiceNumber: string; // Vendor's invoice number
  systemRef: string; // 'AP-INV-2026-089'
  vendorId: string;
  vendorName: string;
  vendorVatNo: string;
  poNumber?: string;
  grnNumber?: string;
  invoiceDate: string;
  dueDate: string;
  paymentTerms: string; // 'Net 30', 'Net 60'
  currency: string;
  subTotal: number;
  vatAmount: number;
  grandTotal: number;
  paidAmount: number;
  balanceDue: number;
  status: InvoiceStatus;
  approvalStatus: 'PENDING' | 'APPROVED_L1' | 'APPROVED_L2' | 'REJECTED';
  is3WayMatched: boolean;
  lines: SupplierInvoiceLine[];
  glVoucherId?: string;
}

// 16.03 Accounts Receivable
export interface CustomerInvoiceLine {
  id: string;
  description: string;
  revenueAccountId: string;
  profitCenterId?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  netAmount: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
}

export interface CustomerInvoice {
  id: string;
  invoiceNumber: string; // 'AR-INV-2026-0142'
  customerId: string;
  customerName: string;
  customerVatNo: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  subTotal: number;
  vatAmount: number;
  grandTotal: number;
  allocatedAmount: number;
  balanceAmount: number;
  status: 'DRAFT' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  lines: CustomerInvoiceLine[];
  glVoucherId?: string;
}

export interface CustomerReceipt {
  id: string;
  receiptNumber: string; // 'REC-2026-0054'
  customerId: string;
  customerName: string;
  receiptDate: string;
  paymentMethod: 'BANK_TRANSFER' | 'CHEQUE' | 'CREDIT_CARD' | 'CASH';
  bankAccountId: string;
  amount: number;
  unallocatedAmount: number;
  currency: string;
  referenceNumber: string;
  status: 'POSTED' | 'DRAFT';
  allocations: {
    invoiceId: string;
    invoiceNumber: string;
    allocatedAmount: number;
  }[];
}

export interface CustomerCreditNote {
  id: string;
  creditNoteNumber: string; // 'CN-2026-0012'
  customerId: string;
  customerName: string;
  originalInvoiceNumber: string;
  date: string;
  reason: string;
  subTotal: number;
  vatAmount: number;
  totalAmount: number;
  status: 'DRAFT' | 'APPROVED' | 'APPLIED' | 'REFUNDED';
}

// 16.04 Cash & Bank
export interface BankAccount {
  id: string;
  accountNumber: string;
  bankName: string;
  branch: string;
  currency: string;
  glAccountId: string;
  glAccountCode: string;
  currentBookBalance: number;
  statementBalance: number;
  unreconciledDifference: number;
  lastReconciledDate: string;
  accountType: 'CURRENT' | 'SAVINGS' | 'ESCROW' | 'PETTY_CASH';
}

export interface BankTransaction {
  id: string;
  bankAccountId: string;
  transactionDate: string;
  valueDate: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'FEE' | 'INTEREST';
  reference: string;
  description: string;
  amount: number; // positive deposit, negative withdrawal
  currency: string;
  isReconciled: boolean;
  matchedStatementLineId?: string;
  glVoucherId?: string;
}

export interface BankReconciliationRecord {
  id: string;
  bankAccountId: string;
  statementDate: string;
  statementClosingBalance: number;
  glBookBalance: number;
  outstandingDeposits: number;
  unpresentedCheques: number;
  bankAdjustments: number;
  adjustedBankBalance: number;
  variance: number;
  status: 'IN_PROGRESS' | 'RECONCILED' | 'OUT_OF_BALANCE';
}

// 16.05 Fixed Assets Accounting
export interface FixedAssetEntry {
  id: string;
  assetCode: string; // 'FA-EQ-0082'
  assetName: string;
  category: 'BUILDINGS' | 'PLANT_MACHINERY' | 'VEHICLES' | 'OFFICE_EQUIPMENT' | 'IT_INFRASTRUCTURE';
  capitalizationDate: string;
  costBasis: number;
  salvageValue: number;
  usefulLifeYears: number;
  depreciationMethod: 'STRAIGHT_LINE' | 'REDUCING_BALANCE' | 'UNITS_OF_PRODUCTION';
  accumulatedDepreciation: number;
  netBookValue: number;
  monthlyDepreciationRate: number;
  costAccountId: string;
  deprExpenseAccountId: string;
  accumDeprAccountId: string;
  status: 'ACTIVE' | 'DISPOSED' | 'FULLY_DEPRECIATED' | 'WRITTEN_OFF';
}

// 16.06 Period-End Accounting
export interface AccrualPrepayment {
  id: string;
  type: 'EXPENSE_ACCRUAL' | 'REVENUE_ACCRUAL' | 'PREPAYMENT' | 'PROVISION';
  reference: string;
  title: string;
  totalAmount: number;
  monthlyAmortization: number;
  remainingAmount: number;
  startDate: string;
  endDate: string;
  drAccountId: string;
  crAccountId: string;
  status: 'ACTIVE' | 'COMPLETED' | 'REVERSED';
  autoReverse: boolean;
}

export interface FiscalPeriod {
  id: string;
  periodCode: string; // '2026-03'
  periodName: string; // 'March 2026'
  startDate: string;
  endDate: string;
  glStatus: 'OPEN' | 'SOFT_CLOSED' | 'HARD_CLOSED';
  apStatus: 'OPEN' | 'SOFT_CLOSED' | 'HARD_CLOSED';
  arStatus: 'OPEN' | 'SOFT_CLOSED' | 'HARD_CLOSED';
  inventoryStatus: 'OPEN' | 'SOFT_CLOSED' | 'HARD_CLOSED';
  closedBy?: string;
  closedAt?: string;
}

// 16.07 Cost Accounting
export interface CostCenter {
  id: string;
  code: string; // 'CC-101'
  name: string;
  department: string;
  manager: string;
  budgetAllocated: number;
  actualCost: number;
  variance: number;
  isActive: boolean;
}

export interface ProfitCenter {
  id: string;
  code: string; // 'PC-01'
  name: string;
  businessUnit: string;
  manager: string;
  revenue: number;
  directCosts: number;
  allocatedOverhead: number;
  netProfit: number;
  marginPercent: number;
}

export interface CostAllocationCycle {
  id: string;
  cycleName: string;
  sourceCostCenterId: string;
  sourceCostCenterName: string;
  totalPoolAmount: number;
  allocationMethod: 'HEADCOUNT' | 'SQUARE_METERS' | 'REVENUE_RATIO' | 'DIRECT_PERCENT';
  targets: {
    profitCenterId: string;
    profitCenterName: string;
    sharePercent: number;
    allocatedAmount: number;
  }[];
  lastExecutedDate?: string;
  status: 'ACTIVE' | 'DRAFT';
}

// 16.08 Tax & VAT Accounting
export interface VatSummary {
  period: string; // 'Q1 2026'
  standardRatedSales: number; // 5%
  zeroRatedSales: number; // 0% (Exports)
  exemptSales: number;
  totalOutputVat: number;
  standardRatedPurchases: number;
  importVatPaid: number;
  totalInputVat: number;
  badDebtReliefAdjustments: number;
  netVatPayable: number; // Output - Input
  filingDueDate: string;
  status: 'DRAFT' | 'READY_FOR_FILING' | 'FILED';
}

// 16.09 Intercompany & FX
export interface IntercompanyTransaction {
  id: string;
  transactionRef: string;
  originEntity: string; // 'Artify Group Parent'
  targetEntity: string; // 'Artify Contracting LLC'
  date: string;
  description: string;
  amount: number;
  currency: string;
  isMatched: boolean;
  eliminationVoucherId?: string;
  status: 'PENDING_MATCH' | 'RECONCILED' | 'ELIMINATED';
}

export interface CurrencyRate {
  currencyCode: string;
  currencyName: string;
  symbol: string;
  exchangeRateToBase: number; // 1 OMR = X Currency
  inverseRate: number; // 1 Currency = X OMR
  lastUpdated: string;
  isBaseCurrency: boolean;
}

// 16.10 Financial Statements
export interface TrialBalanceItem {
  accountCode: string;
  accountName: string;
  accountClass: AccountClass;
  openingDebit: number;
  openingCredit: number;
  periodDebit: number;
  periodCredit: number;
  closingDebit: number;
  closingCredit: number;
}

export interface FinancialRatio {
  name: string;
  category: 'LIQUIDITY' | 'PROFITABILITY' | 'SOLVENCY' | 'EFFICIENCY';
  value: string;
  benchmark: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  description: string;
}

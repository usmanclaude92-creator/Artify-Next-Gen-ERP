// ==========================================
// ARTIFY ERP — MODULE 16: FINANCIAL ACCOUNTING & REPORTING
// Master Store, Context Provider & Business Logic
// ==========================================

import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  ChartOfAccount,
  JournalEntry,
  RecurringJournal,
  SupplierInvoice,
  CustomerInvoice,
  CustomerReceipt,
  CustomerCreditNote,
  BankAccount,
  BankTransaction,
  BankReconciliationRecord,
  FixedAssetEntry,
  AccrualPrepayment,
  FiscalPeriod,
  CostCenter,
  ProfitCenter,
  CostAllocationCycle,
  VatSummary,
  IntercompanyTransaction,
  CurrencyRate,
  TrialBalanceItem,
  FinancialRatio
} from '../types/financeTypes';

// Initial Chart of Accounts (IFRS Compliant Multi-Level)
const initialChartOfAccounts: ChartOfAccount[] = [
  // ASSETS (1000-1999)
  { id: 'coa-1000', code: '1000', name: 'CURRENT ASSETS', accountClass: 'ASSET', subClass: 'CURRENT_ASSET', level: 1, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: 0, currentDebit: 0, currentCredit: 0, closingBalance: 12450000 },
  { id: 'coa-1010', code: '1010', name: 'Cash & Bank Balances', accountClass: 'ASSET', subClass: 'CURRENT_ASSET', parentCode: '1000', level: 2, currency: 'OMR', isReconcilable: true, isActive: true, openingBalance: 4200000, currentDebit: 1540000, currentCredit: 980000, closingBalance: 4760000 },
  { id: 'coa-1011', code: '1011', name: 'Bank Muscat — Operating Current A/C', accountClass: 'ASSET', subClass: 'CURRENT_ASSET', parentCode: '1010', level: 3, currency: 'OMR', isReconcilable: true, isActive: true, openingBalance: 3100000, currentDebit: 1200000, currentCredit: 850000, closingBalance: 3450000 },
  { id: 'coa-1012', code: '1012', name: 'National Bank of Oman (NBO) — Payroll A/C', accountClass: 'ASSET', subClass: 'CURRENT_ASSET', parentCode: '1010', level: 3, currency: 'OMR', isReconcilable: true, isActive: true, openingBalance: 980000, currentDebit: 320000, currentCredit: 110000, closingBalance: 1190000 },
  { id: 'coa-1015', code: '1015', name: 'HQ Petty Cash Imprest', accountClass: 'ASSET', subClass: 'CURRENT_ASSET', parentCode: '1010', level: 3, currency: 'OMR', isReconcilable: true, isActive: true, openingBalance: 120000, currentDebit: 20000, currentCredit: 20000, closingBalance: 120000 },
  { id: 'coa-1020', code: '1020', name: 'Trade Accounts Receivable', accountClass: 'ASSET', subClass: 'CURRENT_ASSET', parentCode: '1000', level: 2, currency: 'OMR', isReconcilable: true, isActive: true, openingBalance: 5100000, currentDebit: 2890000, currentCredit: 2310000, closingBalance: 5680000 },
  { id: 'coa-1025', code: '1025', name: 'Allowance for Expected Credit Losses (ECL)', accountClass: 'ASSET', subClass: 'CURRENT_ASSET', parentCode: '1020', level: 3, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: -150000, currentDebit: 0, currentCredit: 30000, closingBalance: -180000 },
  { id: 'coa-1030', code: '1030', name: 'Inventory & Materials on Hand', accountClass: 'ASSET', subClass: 'CURRENT_ASSET', parentCode: '1000', level: 2, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: 1800000, currentDebit: 450000, currentCredit: 390000, closingBalance: 1860000 },
  { id: 'coa-1040', code: '1040', name: 'Prepayments & Advances', accountClass: 'ASSET', subClass: 'CURRENT_ASSET', parentCode: '1000', level: 2, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: 330000, currentDebit: 90000, currentCredit: 90000, closingBalance: 330000 },
  { id: 'coa-1050', code: '1050', name: 'Input VAT Recoverable (5%)', accountClass: 'ASSET', subClass: 'CURRENT_ASSET', parentCode: '1000', level: 2, currency: 'OMR', isReconcilable: true, isActive: true, openingBalance: 120000, currentDebit: 85000, currentCredit: 0, closingBalance: 205000 },

  // NON-CURRENT ASSETS (1500-1999)
  { id: 'coa-1500', code: '1500', name: 'NON-CURRENT ASSETS', accountClass: 'ASSET', subClass: 'NON_CURRENT_ASSET', level: 1, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: 0, currentDebit: 0, currentCredit: 0, closingBalance: 18500000 },
  { id: 'coa-1510', code: '1510', name: 'Property, Plant & Equipment (PPE)', accountClass: 'ASSET', subClass: 'NON_CURRENT_ASSET', parentCode: '1500', level: 2, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: 22000000, currentDebit: 450000, currentCredit: 0, closingBalance: 22450000 },
  { id: 'coa-1520', code: '1520', name: 'Accumulated Depreciation — PPE', accountClass: 'ASSET', subClass: 'NON_CURRENT_ASSET', parentCode: '1500', level: 2, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: -3800000, currentDebit: 0, currentCredit: 150000, closingBalance: -3950000 },

  // LIABILITIES (2000-2999)
  { id: 'coa-2000', code: '2000', name: 'CURRENT LIABILITIES', accountClass: 'LIABILITY', subClass: 'CURRENT_LIABILITY', level: 1, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: 0, currentDebit: 0, currentCredit: 0, closingBalance: 8450000 },
  { id: 'coa-2010', code: '2010', name: 'Trade Accounts Payable', accountClass: 'LIABILITY', subClass: 'CURRENT_LIABILITY', parentCode: '2000', level: 2, currency: 'OMR', isReconcilable: true, isActive: true, openingBalance: 4800000, currentDebit: 1650000, currentCredit: 1980000, closingBalance: 5130000 },
  { id: 'coa-2020', code: '2020', name: 'Output VAT Payable (5%)', accountClass: 'LIABILITY', subClass: 'CURRENT_LIABILITY', parentCode: '2000', level: 2, currency: 'OMR', isReconcilable: true, isActive: true, openingBalance: 240000, currentDebit: 0, currentCredit: 145000, closingBalance: 385000 },
  { id: 'coa-2030', code: '2030', name: 'Accrued Expenses & Provisions', accountClass: 'LIABILITY', subClass: 'CURRENT_LIABILITY', parentCode: '2000', level: 2, currency: 'OMR', isReconcilable: true, isActive: true, openingBalance: 950000, currentDebit: 120000, currentCredit: 180000, closingBalance: 1010000 },
  { id: 'coa-2040', code: '2040', name: 'Contract Retention Withheld (Payable)', accountClass: 'LIABILITY', subClass: 'CURRENT_LIABILITY', parentCode: '2000', level: 2, currency: 'OMR', isReconcilable: true, isActive: true, openingBalance: 1850000, currentDebit: 100000, currentCredit: 175000, closingBalance: 1925000 },

  // EQUITY (3000-3999)
  { id: 'coa-3000', code: '3000', name: 'EQUITY & CAPITAL', accountClass: 'EQUITY', subClass: 'EQUITY_CAPITAL', level: 1, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: 0, currentDebit: 0, currentCredit: 0, closingBalance: 17500000 },
  { id: 'coa-3010', code: '3010', name: 'Paid-Up Share Capital', accountClass: 'EQUITY', subClass: 'EQUITY_CAPITAL', parentCode: '3000', level: 2, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: 10000000, currentDebit: 0, currentCredit: 0, closingBalance: 10000000 },
  { id: 'coa-3020', code: '3020', name: 'Retained Earnings (Brought Forward)', accountClass: 'EQUITY', subClass: 'RETAINED_EARNINGS', parentCode: '3000', level: 2, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: 5800000, currentDebit: 0, currentCredit: 0, closingBalance: 5800000 },
  { id: 'coa-3030', code: '3030', name: 'Statutory Legal Reserve (Oman Law)', accountClass: 'EQUITY', subClass: 'RETAINED_EARNINGS', parentCode: '3000', level: 2, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: 1700000, currentDebit: 0, currentCredit: 0, closingBalance: 1700000 },

  // REVENUE (4000-4999)
  { id: 'coa-4000', code: '4000', name: 'OPERATING REVENUE', accountClass: 'REVENUE', subClass: 'OPERATING_REVENUE', level: 1, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: 0, currentDebit: 0, currentCredit: 0, closingBalance: 14250000 },
  { id: 'coa-4010', code: '4010', name: 'Contract & Construction Revenue', accountClass: 'REVENUE', subClass: 'OPERATING_REVENUE', parentCode: '4000', level: 2, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: 0, currentDebit: 0, currentCredit: 9800000, closingBalance: 9800000 },
  { id: 'coa-4020', code: '4020', name: 'Commercial Engineering & Project Sales', accountClass: 'REVENUE', subClass: 'OPERATING_REVENUE', parentCode: '4000', level: 2, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: 0, currentDebit: 0, currentCredit: 3850000, closingBalance: 3850000 },
  { id: 'coa-4030', code: '4030', name: 'Maintenance & Service Fees', accountClass: 'REVENUE', subClass: 'OPERATING_REVENUE', parentCode: '4000', level: 2, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: 0, currentDebit: 0, currentCredit: 600000, closingBalance: 600000 },

  // EXPENSES (5000-6999)
  { id: 'coa-5000', code: '5000', name: 'DIRECT COST OF REVENUE (COGS)', accountClass: 'EXPENSE', subClass: 'DIRECT_COST', level: 1, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: 0, currentDebit: 0, currentCredit: 0, closingBalance: 9200000 },
  { id: 'coa-5010', code: '5010', name: 'Direct Material Purchases', accountClass: 'EXPENSE', subClass: 'DIRECT_COST', parentCode: '5000', level: 2, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: 0, currentDebit: 4800000, currentCredit: 0, closingBalance: 4800000 },
  { id: 'coa-5020', code: '5020', name: 'Subcontractor Trade Costs', accountClass: 'EXPENSE', subClass: 'DIRECT_COST', parentCode: '5000', level: 2, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: 0, currentDebit: 3100000, currentCredit: 0, closingBalance: 3100000 },
  { id: 'coa-5030', code: '5030', name: 'Direct Site Labor & Machinery', accountClass: 'EXPENSE', subClass: 'DIRECT_COST', parentCode: '5000', level: 2, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: 0, currentDebit: 1300000, currentCredit: 0, closingBalance: 1300000 },

  { id: 'coa-6000', code: '6000', name: 'OPERATING EXPENSES (OPEX)', accountClass: 'EXPENSE', subClass: 'OPERATING_EXPENSE', level: 1, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: 0, currentDebit: 0, currentCredit: 0, closingBalance: 2425000 },
  { id: 'coa-6010', code: '6010', name: 'Salaries & Employee Benefits', accountClass: 'EXPENSE', subClass: 'OPERATING_EXPENSE', parentCode: '6000', level: 2, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: 0, currentDebit: 1650000, currentCredit: 0, closingBalance: 1650000 },
  { id: 'coa-6020', code: '6020', name: 'Office Rent & Facilities', accountClass: 'EXPENSE', subClass: 'OPERATING_EXPENSE', parentCode: '6000', level: 2, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: 0, currentDebit: 320000, currentCredit: 0, closingBalance: 320000 },
  { id: 'coa-6030', code: '6030', name: 'Depreciation Expense — Fixed Assets', accountClass: 'EXPENSE', subClass: 'OPERATING_EXPENSE', parentCode: '6000', level: 2, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: 0, currentDebit: 150000, currentCredit: 0, closingBalance: 150000 },
  { id: 'coa-6040', code: '6040', name: 'IT & ERP Software Subscriptions', accountClass: 'EXPENSE', subClass: 'OPERATING_EXPENSE', parentCode: '6000', level: 2, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: 0, currentDebit: 125000, currentCredit: 0, closingBalance: 125000 },
  { id: 'coa-6050', code: '6050', name: 'Foreign Exchange (FX) Loss / Gain', accountClass: 'EXPENSE', subClass: 'OPERATING_EXPENSE', parentCode: '6000', level: 2, currency: 'OMR', isReconcilable: false, isActive: true, openingBalance: 0, currentDebit: 180000, currentCredit: 0, closingBalance: 180000 }
];

// Initial Journal Entries
const initialJournalEntries: JournalEntry[] = [
  {
    id: 'jv-001',
    voucherNumber: 'JV-2026-0042',
    voucherDate: '2026-03-01',
    postingDate: '2026-03-01',
    period: '2026-03',
    voucherType: 'GENERAL',
    reference: 'REF-MAR-OPENING-ADJ',
    narration: 'Monthly operational adjustment for IT licenses and facility utility provisions.',
    currency: 'OMR',
    totalDebit: 125000,
    totalCredit: 125000,
    status: 'POSTED',
    createdBy: 'Tariq Al-Balushi (Chief Accountant)',
    approvedBy: 'Salim Al-Harthy (CFO)',
    postedBy: 'SYSTEM_GL_ENGINE',
    postedAt: '2026-03-01 09:30',
    attachmentsCount: 2,
    lines: [
      { id: 'jl-1', accountId: 'coa-6040', accountCode: '6040', accountName: 'IT & ERP Software Subscriptions', debit: 125000, credit: 0, currency: 'OMR', exchangeRate: 1.0, baseDebit: 125000, baseCredit: 0, description: 'Cloud infrastructure & ERP platform licensing' },
      { id: 'jl-2', accountId: 'coa-2030', accountCode: '2030', accountName: 'Accrued Expenses & Provisions', debit: 0, credit: 125000, currency: 'OMR', exchangeRate: 1.0, baseDebit: 0, baseCredit: 125000, description: 'Monthly software licensing accrual' }
    ]
  },
  {
    id: 'jv-002',
    voucherNumber: 'JV-2026-0043',
    voucherDate: '2026-03-03',
    postingDate: '2026-03-03',
    period: '2026-03',
    voucherType: 'AP_INVOICE',
    reference: 'PO-2026-881 / AP-INV-891',
    narration: 'Supplier invoice for ready-mix high performance concrete with 5% VAT.',
    currency: 'OMR',
    totalDebit: 504000,
    totalCredit: 504000,
    status: 'POSTED',
    createdBy: 'Nasser Al-Kindi (Senior AP Accountant)',
    approvedBy: 'Salim Al-Harthy (CFO)',
    postedBy: 'SYSTEM_AP_ENGINE',
    postedAt: '2026-03-03 14:15',
    attachmentsCount: 3,
    lines: [
      { id: 'jl-3', accountId: 'coa-5010', accountCode: '5010', accountName: 'Direct Material Purchases', debit: 480000, credit: 0, currency: 'OMR', exchangeRate: 1.0, baseDebit: 480000, baseCredit: 0, description: 'C40/50 Ready Mix Concrete batch delivery' },
      { id: 'jl-4', accountId: 'coa-1050', accountCode: '1050', accountName: 'Input VAT Recoverable (5%)', debit: 24000, credit: 0, currency: 'OMR', exchangeRate: 1.0, baseDebit: 24000, baseCredit: 0, description: '5% Standard Input Tax credit' },
      { id: 'jl-5', accountId: 'coa-2010', accountCode: '2010', accountName: 'Trade Accounts Payable', debit: 0, credit: 504000, currency: 'OMR', exchangeRate: 1.0, baseDebit: 0, baseCredit: 504000, description: 'Payable to Oman Readymix Building Materials LLC' }
    ]
  },
  {
    id: 'jv-003',
    voucherNumber: 'JV-2026-0044',
    voucherDate: '2026-03-05',
    postingDate: '2026-03-05',
    period: '2026-03',
    voucherType: 'AR_INVOICE',
    reference: 'IPC-08 / AR-INV-2026-0142',
    narration: 'Interim Payment Certificate IPC-08 progressive milestone billing with 5% VAT.',
    currency: 'OMR',
    totalDebit: 1029000,
    totalCredit: 1029000,
    status: 'POSTED',
    createdBy: 'Layla Al-Amri (Senior AR Accountant)',
    approvedBy: 'Salim Al-Harthy (CFO)',
    postedBy: 'SYSTEM_AR_ENGINE',
    postedAt: '2026-03-05 11:20',
    attachmentsCount: 4,
    lines: [
      { id: 'jl-6', accountId: 'coa-1020', accountCode: '1020', accountName: 'Trade Accounts Receivable', debit: 1029000, credit: 0, currency: 'OMR', exchangeRate: 1.0, baseDebit: 1029000, baseCredit: 0, description: 'Receivable from Muscat Metro & Infrastructure Authority' },
      { id: 'jl-7', accountId: 'coa-4010', accountCode: '4010', accountName: 'Contract & Construction Revenue', debit: 0, credit: 980000, currency: 'OMR', exchangeRate: 1.0, baseDebit: 0, baseCredit: 980000, description: 'Certified Milestone progress IPC-08' },
      { id: 'jl-8', accountId: 'coa-2020', accountCode: '2020', accountName: 'Output VAT Payable (5%)', debit: 0, credit: 49000, currency: 'OMR', exchangeRate: 1.0, baseDebit: 0, baseCredit: 49000, description: '5% Standard Output Tax on progress billing' }
    ]
  }
];

// Initial Recurring Journals
const initialRecurringJournals: RecurringJournal[] = [
  {
    id: 'rj-01',
    code: 'REC-RENT-HQ',
    title: 'Monthly HQ Commercial Tower Rent Amortization',
    frequency: 'MONTHLY',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    nextRunDate: '2026-04-01',
    lastRunDate: '2026-03-01',
    status: 'ACTIVE',
    autoPost: true,
    narration: 'Monthly amortization of annual prepaid HQ building lease.',
    templateLines: [
      { id: 'rtl-1', accountId: 'coa-6020', accountCode: '6020', accountName: 'Office Rent & Facilities', debit: 26667, credit: 0, currency: 'OMR', exchangeRate: 1.0, baseDebit: 26667, baseCredit: 0, description: 'HQ Office monthly lease expense' },
      { id: 'rtl-2', accountId: 'coa-1040', accountCode: '1040', accountName: 'Prepayments & Advances', debit: 0, credit: 26667, currency: 'OMR', exchangeRate: 1.0, baseDebit: 0, baseCredit: 26667, description: 'Prepaid rent amortization' }
    ]
  },
  {
    id: 'rj-02',
    code: 'REC-DEPR-PPE',
    title: 'Monthly Fixed Assets IAS 16 Depreciation Run',
    frequency: 'MONTHLY',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    nextRunDate: '2026-04-01',
    lastRunDate: '2026-03-01',
    status: 'ACTIVE',
    autoPost: false,
    narration: 'Calculated straight-line monthly depreciation on plant, machinery and vehicles.',
    templateLines: [
      { id: 'rtl-3', accountId: 'coa-6030', accountCode: '6030', accountName: 'Depreciation Expense — Fixed Assets', debit: 150000, credit: 0, currency: 'OMR', exchangeRate: 1.0, baseDebit: 150000, baseCredit: 0, description: 'Monthly PPE depreciation expense' },
      { id: 'rtl-4', accountId: 'coa-1520', accountCode: '1520', accountName: 'Accumulated Depreciation — PPE', debit: 0, credit: 150000, currency: 'OMR', exchangeRate: 1.0, baseDebit: 0, baseCredit: 150000, description: 'Credit accumulated depreciation' }
    ]
  }
];

// Initial Accounts Payable Invoices
const initialSupplierInvoices: SupplierInvoice[] = [
  {
    id: 'ap-inv-01',
    invoiceNumber: 'INV-ORM-88912',
    systemRef: 'AP-INV-2026-089',
    vendorId: 'VEND-001',
    vendorName: 'Oman Readymix Building Materials LLC',
    vendorVatNo: 'OM1100234567',
    poNumber: 'PO-2026-881',
    grnNumber: 'GRN-2026-1044',
    invoiceDate: '2026-03-02',
    dueDate: '2026-04-01',
    paymentTerms: 'Net 30',
    currency: 'OMR',
    subTotal: 480000,
    vatAmount: 24000,
    grandTotal: 504000,
    paidAmount: 0,
    balanceDue: 504000,
    status: 'POSTED',
    approvalStatus: 'APPROVED_L2',
    is3WayMatched: true,
    glVoucherId: 'jv-002',
    lines: [
      { id: 'sil-1', description: 'C40/50 High Performance Structural Ready-mix (1,200 m3)', expenseAccountId: 'coa-5010', quantity: 1200, unitPrice: 400, netAmount: 480000, vatRate: 0.05, vatAmount: 24000, totalAmount: 504000 }
    ]
  },
  {
    id: 'ap-inv-02',
    invoiceNumber: 'INV-JINDAL-9902',
    systemRef: 'AP-INV-2026-090',
    vendorId: 'VEND-002',
    vendorName: 'Jindal Shadeed Iron & Steel LLC',
    vendorVatNo: 'OM1100987654',
    poNumber: 'PO-2026-885',
    grnNumber: 'GRN-2026-1052',
    invoiceDate: '2026-03-04',
    dueDate: '2026-04-03',
    paymentTerms: 'Net 30',
    currency: 'OMR',
    subTotal: 620000,
    vatAmount: 31000,
    grandTotal: 651000,
    paidAmount: 200000,
    balanceDue: 451000,
    status: 'PARTIALLY_PAID',
    approvalStatus: 'APPROVED_L2',
    is3WayMatched: true,
    lines: [
      { id: 'sil-2', description: 'Deformed High Yield Steel Rebars Grade 500B (800 MT)', expenseAccountId: 'coa-5010', quantity: 800, unitPrice: 775, netAmount: 620000, vatRate: 0.05, vatAmount: 31000, totalAmount: 651000 }
    ]
  },
  {
    id: 'ap-inv-03',
    invoiceNumber: 'INV-CAT-5541',
    systemRef: 'AP-INV-2026-091',
    vendorId: 'VEND-003',
    vendorName: 'Oasis Trading & Heavy Equipment LLC',
    vendorVatNo: 'OM1100345678',
    poNumber: 'PO-2026-892',
    invoiceDate: '2026-03-08',
    dueDate: '2026-04-07',
    paymentTerms: 'Net 30',
    currency: 'OMR',
    subTotal: 180000,
    vatAmount: 9000,
    grandTotal: 189000,
    paidAmount: 0,
    balanceDue: 189000,
    status: 'VERIFIED',
    approvalStatus: 'PENDING',
    is3WayMatched: true,
    lines: [
      { id: 'sil-3', description: 'Crawler Crane & Hydraulic Excavator Monthly Site Lease', expenseAccountId: 'coa-5030', quantity: 1, unitPrice: 180000, netAmount: 180000, vatRate: 0.05, vatAmount: 9000, totalAmount: 189000 }
    ]
  }
];

// Initial Accounts Receivable Invoices
const initialCustomerInvoices: CustomerInvoice[] = [
  {
    id: 'ar-inv-01',
    invoiceNumber: 'AR-INV-2026-0142',
    customerId: 'CUST-001',
    customerName: 'Muscat Metro & Infrastructure Authority',
    customerVatNo: 'OM1200112233',
    invoiceDate: '2026-03-05',
    dueDate: '2026-04-04',
    currency: 'OMR',
    subTotal: 980000,
    vatAmount: 49000,
    grandTotal: 1029000,
    allocatedAmount: 0,
    balanceAmount: 1029000,
    status: 'ISSUED',
    glVoucherId: 'jv-003',
    lines: [
      { id: 'cil-1', description: 'Interim Payment Certificate IPC-08 — Metro Red Line Viaduct Viable Section', revenueAccountId: 'coa-4010', quantity: 1, unitPrice: 980000, discount: 0, netAmount: 980000, vatRate: 0.05, vatAmount: 49000, totalAmount: 1029000 }
    ]
  },
  {
    id: 'ar-inv-02',
    invoiceNumber: 'AR-INV-2026-0140',
    customerId: 'CUST-002',
    customerName: 'Oman Real Estate Development SAOG',
    customerVatNo: 'OM1200445566',
    invoiceDate: '2026-02-15',
    dueDate: '2026-03-17',
    currency: 'OMR',
    subTotal: 1450000,
    vatAmount: 72500,
    grandTotal: 1522500,
    allocatedAmount: 1522500,
    balanceAmount: 0,
    status: 'PAID',
    lines: [
      { id: 'cil-2', description: 'Al Mouj Marina Waterfront Towers — Milestone 12 Superstructure Handover', revenueAccountId: 'coa-4010', quantity: 1, unitPrice: 1450000, discount: 0, netAmount: 1450000, vatRate: 0.05, vatAmount: 72500, totalAmount: 1522500 }
    ]
  },
  {
    id: 'ar-inv-03',
    invoiceNumber: 'AR-INV-2026-0138',
    customerId: 'CUST-003',
    customerName: 'Al Madina Logistics Services Co',
    customerVatNo: 'OM1200778899',
    invoiceDate: '2025-12-10',
    dueDate: '2026-01-09',
    currency: 'OMR',
    subTotal: 420000,
    vatAmount: 21000,
    grandTotal: 441000,
    allocatedAmount: 0,
    balanceAmount: 441000,
    status: 'OVERDUE',
    lines: [
      { id: 'cil-3', description: 'Sohar Cold Storage Automated Distribution Facility MEP Works', revenueAccountId: 'coa-4020', quantity: 1, unitPrice: 420000, discount: 0, netAmount: 420000, vatRate: 0.05, vatAmount: 21000, totalAmount: 441000 }
    ]
  }
];

// Initial Customer Receipts
const initialCustomerReceipts: CustomerReceipt[] = [
  {
    id: 'rec-01',
    receiptNumber: 'REC-2026-0054',
    customerId: 'CUST-002',
    customerName: 'Oman Real Estate Development SAOG',
    receiptDate: '2026-03-01',
    paymentMethod: 'BANK_TRANSFER',
    bankAccountId: 'bank-01',
    amount: 1522500,
    unallocatedAmount: 0,
    currency: 'OMR',
    referenceNumber: 'FT-BM-9821034',
    status: 'POSTED',
    allocations: [
      { invoiceId: 'ar-inv-02', invoiceNumber: 'AR-INV-2026-0140', allocatedAmount: 1522500 }
    ]
  }
];

// Initial Bank Accounts
const initialBankAccounts: BankAccount[] = [
  {
    id: 'bank-01',
    accountNumber: '0423-019928-001',
    bankName: 'Bank Muscat SAOG',
    branch: 'Corporate Banking Branch — CBD Ruwi',
    currency: 'OMR',
    glAccountId: 'coa-1011',
    glAccountCode: '1011',
    currentBookBalance: 3450000,
    statementBalance: 3462000,
    unreconciledDifference: -12000,
    lastReconciledDate: '2026-02-28',
    accountType: 'CURRENT'
  },
  {
    id: 'bank-02',
    accountNumber: '1088-449102-002',
    bankName: 'National Bank of Oman (NBO)',
    branch: 'Main Head Office Branch — Al Athaiba',
    currency: 'OMR',
    glAccountId: 'coa-1012',
    glAccountCode: '1012',
    currentBookBalance: 1190000,
    statementBalance: 1190000,
    unreconciledDifference: 0,
    lastReconciledDate: '2026-02-28',
    accountType: 'CURRENT'
  },
  {
    id: 'bank-03',
    accountNumber: 'USD-HSBC-88910',
    bankName: 'HSBC Bank Middle East',
    branch: 'Al Khuwair Corporate Commercial',
    currency: 'USD',
    glAccountId: 'coa-1010',
    glAccountCode: '1010',
    currentBookBalance: 2500000,
    statementBalance: 2500000,
    unreconciledDifference: 0,
    lastReconciledDate: '2026-02-28',
    accountType: 'CURRENT'
  }
];

// Initial Bank Transactions
const initialBankTransactions: BankTransaction[] = [
  { id: 'bt-01', bankAccountId: 'bank-01', transactionDate: '2026-03-01', valueDate: '2026-03-01', type: 'DEPOSIT', reference: 'REC-2026-0054', description: 'Wire Inflow: Oman Real Estate Dev Milestone 12', amount: 1522500, currency: 'OMR', isReconciled: true },
  { id: 'bt-02', bankAccountId: 'bank-01', transactionDate: '2026-03-03', valueDate: '2026-03-03', type: 'WITHDRAWAL', reference: 'PAY-JINDAL-01', description: 'Wire Outflow: Jindal Steel Rebar Advance', amount: -200000, currency: 'OMR', isReconciled: true },
  { id: 'bt-03', bankAccountId: 'bank-01', transactionDate: '2026-03-05', valueDate: '2026-03-05', type: 'FEE', reference: 'CHG-BM-0326', description: 'Bank Muscat Corporate Account Monthly Maintenance & Swift Charges', amount: -12000, currency: 'OMR', isReconciled: false }
];

// Initial Fixed Assets
const initialFixedAssets: FixedAssetEntry[] = [
  {
    id: 'fa-01',
    assetCode: 'FA-EQ-0082',
    assetName: 'Liebherr 280 EC-H 12 Litronic Tower Crane',
    category: 'PLANT_MACHINERY',
    capitalizationDate: '2023-01-15',
    costBasis: 480000,
    salvageValue: 48000,
    usefulLifeYears: 10,
    depreciationMethod: 'STRAIGHT_LINE',
    accumulatedDepreciation: 136800,
    netBookValue: 343200,
    monthlyDepreciationRate: 3600,
    costAccountId: 'coa-1510',
    deprExpenseAccountId: 'coa-6030',
    accumDeprAccountId: 'coa-1520',
    status: 'ACTIVE'
  },
  {
    id: 'fa-02',
    assetCode: 'FA-VH-0104',
    assetName: 'Mercedes-Benz Actros 3340 Heavy Dump Trucks (Fleet of 4)',
    category: 'VEHICLES',
    capitalizationDate: '2024-04-01',
    costBasis: 320000,
    salvageValue: 32000,
    usefulLifeYears: 5,
    depreciationMethod: 'STRAIGHT_LINE',
    accumulatedDepreciation: 110400,
    netBookValue: 209600,
    monthlyDepreciationRate: 4800,
    costAccountId: 'coa-1510',
    deprExpenseAccountId: 'coa-6030',
    accumDeprAccountId: 'coa-1520',
    status: 'ACTIVE'
  },
  {
    id: 'fa-03',
    assetCode: 'FA-BLD-001',
    assetName: 'Al Khuwair Operational Engineering HQ Building',
    category: 'BUILDINGS',
    capitalizationDate: '2021-06-30',
    costBasis: 12500000,
    salvageValue: 2500000,
    usefulLifeYears: 25,
    depreciationMethod: 'STRAIGHT_LINE',
    accumulatedDepreciation: 1900000,
    netBookValue: 10600000,
    monthlyDepreciationRate: 33333,
    costAccountId: 'coa-1510',
    deprExpenseAccountId: 'coa-6030',
    accumDeprAccountId: 'coa-1520',
    status: 'ACTIVE'
  }
];

// Initial Fiscal Periods
const initialFiscalPeriods: FiscalPeriod[] = [
  { id: 'fp-2026-01', periodCode: '2026-01', periodName: 'January 2026', startDate: '2026-01-01', endDate: '2026-01-31', glStatus: 'HARD_CLOSED', apStatus: 'HARD_CLOSED', arStatus: 'HARD_CLOSED', inventoryStatus: 'HARD_CLOSED', closedBy: 'Salim Al-Harthy', closedAt: '2026-02-05' },
  { id: 'fp-2026-02', periodCode: '2026-02', periodName: 'February 2026', startDate: '2026-02-01', endDate: '2026-02-28', glStatus: 'HARD_CLOSED', apStatus: 'HARD_CLOSED', arStatus: 'HARD_CLOSED', inventoryStatus: 'HARD_CLOSED', closedBy: 'Salim Al-Harthy', closedAt: '2026-03-04' },
  { id: 'fp-2026-03', periodCode: '2026-03', periodName: 'March 2026', startDate: '2026-03-01', endDate: '2026-03-31', glStatus: 'OPEN', apStatus: 'OPEN', arStatus: 'OPEN', inventoryStatus: 'OPEN' },
  { id: 'fp-2026-04', periodCode: '2026-04', periodName: 'April 2026', startDate: '2026-04-01', endDate: '2026-04-30', glStatus: 'OPEN', apStatus: 'OPEN', arStatus: 'OPEN', inventoryStatus: 'OPEN' }
];

// Initial Accruals & Prepayments
const initialAccrualsPrepayments: AccrualPrepayment[] = [
  {
    id: 'ap-01',
    type: 'PREPAYMENT',
    reference: 'PRE-INS-2026',
    title: 'Annual Contractors All Risk (CAR) & Third Party Insurance',
    totalAmount: 240000,
    monthlyAmortization: 20000,
    remainingAmount: 180000,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    drAccountId: 'coa-6020',
    crAccountId: 'coa-1040',
    status: 'ACTIVE',
    autoReverse: false
  },
  {
    id: 'ap-02',
    type: 'EXPENSE_ACCRUAL',
    reference: 'ACC-UTIL-0326',
    title: 'Estimated Nama Power & Water Utilities Accrual for March 2026',
    totalAmount: 45000,
    monthlyAmortization: 45000,
    remainingAmount: 45000,
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    drAccountId: 'coa-6020',
    crAccountId: 'coa-2030',
    status: 'ACTIVE',
    autoReverse: true
  },
  {
    id: 'ap-03',
    type: 'PROVISION',
    reference: 'PROV-ECL-Q1',
    title: 'IFRS 9 Expected Credit Loss Provision on Aged Customer Debts',
    totalAmount: 180000,
    monthlyAmortization: 0,
    remainingAmount: 180000,
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    drAccountId: 'coa-6050',
    crAccountId: 'coa-1025',
    status: 'ACTIVE',
    autoReverse: false
  }
];

// Initial Cost Centers
const initialCostCenters: CostCenter[] = [
  { id: 'cc-101', code: 'CC-101', name: 'Executive Management & Governance', department: 'Executive', manager: 'Salim Al-Harthy', budgetAllocated: 650000, actualCost: 520000, variance: 130000, isActive: true },
  { id: 'cc-102', code: 'CC-102', name: 'Corporate IT, Cloud & ERP Systems', department: 'IT', manager: 'Fahad Al-Maskari', budgetAllocated: 480000, actualCost: 410000, variance: 70000, isActive: true },
  { id: 'cc-201', code: 'CC-201', name: 'Central Plant & Heavy Equipment Yard', department: 'Plant & Fleet', manager: 'Ahmed Al-Shehhi', budgetAllocated: 1200000, actualCost: 1140000, variance: 60000, isActive: true },
  { id: 'cc-202', code: 'CC-202', name: 'Health, Safety & Environment (HSE) Dept', department: 'HSE', manager: 'Zainab Al-Balushi', budgetAllocated: 320000, actualCost: 290000, variance: 30000, isActive: true }
];

// Initial Profit Centers
const initialProfitCenters: ProfitCenter[] = [
  { id: 'pc-01', code: 'PC-01', name: 'Prime Infrastructure & Metro Contracting', businessUnit: 'Civil EPC', manager: 'Rashid Al-Kiyumi', revenue: 9800000, directCosts: 6400000, allocatedOverhead: 850000, netProfit: 2550000, marginPercent: 26.0 },
  { id: 'pc-02', code: 'PC-02', name: 'Commercial High-Rise & Towers Division', businessUnit: 'Building Construction', manager: 'Mazin Al-Hinai', revenue: 3850000, directCosts: 2450000, allocatedOverhead: 420000, netProfit: 980000, marginPercent: 25.5 },
  { id: 'pc-03', code: 'PC-03', name: 'Facility Management & Specialist MEP', businessUnit: 'Services & MEP', manager: 'Khalfan Al-Riyami', revenue: 600000, directCosts: 350000, allocatedOverhead: 80000, netProfit: 170000, marginPercent: 28.3 }
];

// Initial Cost Allocation Cycle
const initialCostAllocationCycles: CostAllocationCycle[] = [
  {
    id: 'cac-01',
    cycleName: 'Monthly Corporate IT & HQ Shared Overhead Distribution',
    sourceCostCenterId: 'cc-102',
    sourceCostCenterName: 'Corporate IT, Cloud & ERP Systems',
    totalPoolAmount: 410000,
    allocationMethod: 'HEADCOUNT',
    lastExecutedDate: '2026-02-28',
    status: 'ACTIVE',
    targets: [
      { profitCenterId: 'pc-01', profitCenterName: 'Prime Infrastructure & Metro Contracting', sharePercent: 60, allocatedAmount: 246000 },
      { profitCenterId: 'pc-02', profitCenterName: 'Commercial High-Rise & Towers Division', sharePercent: 30, allocatedAmount: 123000 },
      { profitCenterId: 'pc-03', profitCenterName: 'Facility Management & Specialist MEP', sharePercent: 10, allocatedAmount: 41000 }
    ]
  }
];

// Initial VAT Return Summary (Oman Tax Authority Form 201)
const initialVatSummary: VatSummary = {
  period: 'Q1 2026 (Jan - Mar 2026)',
  standardRatedSales: 14250000,
  zeroRatedSales: 850000, // Export of engineering services
  exemptSales: 0,
  totalOutputVat: 712500, // 5% of 14,250,000
  standardRatedPurchases: 9200000,
  importVatPaid: 210000,
  totalInputVat: 670000, // 460k domestic + 210k customs
  badDebtReliefAdjustments: 0,
  netVatPayable: 42500, // 712,500 - 670,000
  filingDueDate: '2026-04-30',
  status: 'READY_FOR_FILING'
};

// Initial Intercompany Transactions
const initialIntercompanyTransactions: IntercompanyTransaction[] = [
  {
    id: 'ic-01',
    transactionRef: 'IC-TX-2026-012',
    originEntity: 'Artify Group Parent Holding SAOG',
    targetEntity: 'Artify Infrastructure LLC',
    date: '2026-03-01',
    description: 'Shared IT SAP ERP system license recharge and group audit fee allocation',
    amount: 150000,
    currency: 'OMR',
    isMatched: true,
    eliminationVoucherId: 'ELIM-JV-004',
    status: 'RECONCILED'
  },
  {
    id: 'ic-02',
    transactionRef: 'IC-TX-2026-015',
    originEntity: 'Artify Infrastructure LLC',
    targetEntity: 'Artify Qatar Contracting WLL',
    date: '2026-03-04',
    description: 'Heavy engineering plant equipment cross-border deployment hire charge',
    amount: 85000,
    currency: 'OMR',
    isMatched: true,
    status: 'PENDING_MATCH'
  }
];

// Initial Currency Rates
const initialCurrencyRates: CurrencyRate[] = [
  { currencyCode: 'OMR', currencyName: 'Omani Rial', symbol: 'OMR', exchangeRateToBase: 1.0, inverseRate: 1.0, lastUpdated: '2026-03-08', isBaseCurrency: true },
  { currencyCode: 'USD', currencyName: 'US Dollar', symbol: '$', exchangeRateToBase: 2.6008, inverseRate: 0.3845, lastUpdated: '2026-03-08', isBaseCurrency: false },
  { currencyCode: 'EUR', currencyName: 'Euro', symbol: '€', exchangeRateToBase: 2.4215, inverseRate: 0.4130, lastUpdated: '2026-03-08', isBaseCurrency: false },
  { currencyCode: 'GBP', currencyName: 'British Pound', symbol: '£', exchangeRateToBase: 2.0510, inverseRate: 0.4876, lastUpdated: '2026-03-08', isBaseCurrency: false },
  { currencyCode: 'AED', currencyName: 'UAE Dirham', symbol: 'AED', exchangeRateToBase: 9.5480, inverseRate: 0.1047, lastUpdated: '2026-03-08', isBaseCurrency: false },
  { currencyCode: 'SAR', currencyName: 'Saudi Riyal', symbol: 'SAR', exchangeRateToBase: 9.7540, inverseRate: 0.1025, lastUpdated: '2026-03-08', isBaseCurrency: false }
];

// Initial Financial Ratios
const initialFinancialRatios: FinancialRatio[] = [
  { name: 'Current Ratio', category: 'LIQUIDITY', value: '2.14x', benchmark: '> 1.50x', trend: 'UP', status: 'HEALTHY', description: 'Total Current Assets / Total Current Liabilities. Demonstrates strong short-term liquidity.' },
  { name: 'Quick Acid-Test Ratio', category: 'LIQUIDITY', value: '1.82x', benchmark: '> 1.00x', trend: 'UP', status: 'HEALTHY', description: '(Cash + Marketable Securities + Receivables) / Current Liabilities.' },
  { name: 'Gross Profit Margin', category: 'PROFITABILITY', value: '35.4%', benchmark: '> 30.0%', trend: 'STABLE', status: 'HEALTHY', description: '(Total Revenue - Cost of Revenue) / Total Revenue.' },
  { name: 'Net Profit Margin', category: 'PROFITABILITY', value: '18.4%', benchmark: '> 15.0%', trend: 'UP', status: 'HEALTHY', description: 'Net Profit After Tax / Total Revenue.' },
  { name: 'Debt-to-Equity Ratio', category: 'SOLVENCY', value: '0.48x', benchmark: '< 1.00x', trend: 'DOWN', status: 'HEALTHY', description: 'Total Liabilities / Total Shareholder Equity.' },
  { name: 'Days Sales Outstanding (DSO)', category: 'EFFICIENCY', value: '36.5 Days', benchmark: '< 45 Days', trend: 'STABLE', status: 'HEALTHY', description: 'Average number of days to collect payment after a sale.' }
];

// Context Interface
interface FinanceContextType {
  currency: string;
  chartOfAccounts: ChartOfAccount[];
  journalEntries: JournalEntry[];
  recurringJournals: RecurringJournal[];
  supplierInvoices: SupplierInvoice[];
  customerInvoices: CustomerInvoice[];
  customerReceipts: CustomerReceipt[];
  bankAccounts: BankAccount[];
  bankTransactions: BankTransaction[];
  fixedAssets: FixedAssetEntry[];
  fiscalPeriods: FiscalPeriod[];
  accrualsPrepayments: AccrualPrepayment[];
  costCenters: CostCenter[];
  profitCenters: ProfitCenter[];
  costAllocationCycles: CostAllocationCycle[];
  vatSummary: VatSummary;
  intercompanyTransactions: IntercompanyTransaction[];
  currencyRates: CurrencyRate[];
  financialRatios: FinancialRatio[];
  
  // Actions
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'voucherNumber'>) => void;
  postJournalEntry: (id: string) => void;
  addSupplierInvoice: (invoice: Omit<SupplierInvoice, 'id' | 'systemRef'>) => void;
  approveSupplierInvoice: (id: string) => void;
  postSupplierInvoiceToGL: (id: string) => void;
  addCustomerInvoice: (invoice: Omit<CustomerInvoice, 'id'>) => void;
  addCustomerReceipt: (receipt: Omit<CustomerReceipt, 'id' | 'receiptNumber'>) => void;
  runDepreciationPosting: () => void;
  lockFiscalPeriod: (periodId: string, subledger: 'gl' | 'ap' | 'ar' | 'all', lockType: 'SOFT_CLOSED' | 'HARD_CLOSED' | 'OPEN') => void;
  executeCostAllocation: (cycleId: string) => void;
  reconcileBankTransaction: (transactionId: string) => void;
  triggerYearEndClosing: (fiscalYear: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency] = useState<string>('OMR');
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccount[]>(initialChartOfAccounts);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(initialJournalEntries);
  const [recurringJournals, setRecurringJournals] = useState<RecurringJournal[]>(initialRecurringJournals);
  const [supplierInvoices, setSupplierInvoices] = useState<SupplierInvoice[]>(initialSupplierInvoices);
  const [customerInvoices, setCustomerInvoices] = useState<CustomerInvoice[]>(initialCustomerInvoices);
  const [customerReceipts, setCustomerReceipts] = useState<CustomerReceipt[]>(initialCustomerReceipts);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(initialBankAccounts);
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>(initialBankTransactions);
  const [fixedAssets, setFixedAssets] = useState<FixedAssetEntry[]>(initialFixedAssets);
  const [fiscalPeriods, setFiscalPeriods] = useState<FiscalPeriod[]>(initialFiscalPeriods);
  const [accrualsPrepayments, setAccrualsPrepayments] = useState<AccrualPrepayment[]>(initialAccrualsPrepayments);
  const [costCenters, setCostCenters] = useState<CostCenter[]>(initialCostCenters);
  const [profitCenters, setProfitCenters] = useState<ProfitCenter[]>(initialProfitCenters);
  const [costAllocationCycles, setCostAllocationCycles] = useState<CostAllocationCycle[]>(initialCostAllocationCycles);
  const [vatSummary, setVatSummary] = useState<VatSummary>(initialVatSummary);
  const [intercompanyTransactions, setIntercompanyTransactions] = useState<IntercompanyTransaction[]>(initialIntercompanyTransactions);
  const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>(initialCurrencyRates);
  const [financialRatios, setFinancialRatios] = useState<FinancialRatio[]>(initialFinancialRatios);

  // Actions
  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'voucherNumber'>) => {
    const id = `jv-${Date.now()}`;
    const voucherNumber = `JV-2026-${String(journalEntries.length + 45).padStart(4, '0')}`;
    const newEntry: JournalEntry = {
      ...entry,
      id,
      voucherNumber
    };
    setJournalEntries(prev => [newEntry, ...prev]);

    // If posted, update COA balances
    if (newEntry.status === 'POSTED') {
      updateCoaBalancesFromLines(newEntry.lines);
    }
  };

  const postJournalEntry = (id: string) => {
    setJournalEntries(prev => prev.map(jv => {
      if (jv.id === id && jv.status !== 'POSTED') {
        updateCoaBalancesFromLines(jv.lines);
        return {
          ...jv,
          status: 'POSTED',
          postedBy: 'Salim Al-Harthy (CFO)',
          postedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        };
      }
      return jv;
    }));
  };

  const updateCoaBalancesFromLines = (lines: JournalEntry['lines']) => {
    setChartOfAccounts(prev => prev.map(account => {
      let debitDelta = 0;
      let creditDelta = 0;
      lines.forEach(l => {
        if (l.accountCode === account.code || l.accountId === account.id) {
          debitDelta += l.baseDebit;
          creditDelta += l.baseCredit;
        }
      });
      if (debitDelta === 0 && creditDelta === 0) return account;

      const newDebit = account.currentDebit + debitDelta;
      const newCredit = account.currentCredit + creditDelta;
      let closing = account.openingBalance;
      if (account.accountClass === 'ASSET' || account.accountClass === 'EXPENSE') {
        closing = account.openingBalance + newDebit - newCredit;
      } else {
        closing = account.openingBalance + newCredit - newDebit;
      }
      return {
        ...account,
        currentDebit: newDebit,
        currentCredit: newCredit,
        closingBalance: closing
      };
    }));
  };

  const addSupplierInvoice = (invoice: Omit<SupplierInvoice, 'id' | 'systemRef'>) => {
    const id = `ap-${Date.now()}`;
    const systemRef = `AP-INV-2026-${String(supplierInvoices.length + 92).padStart(3, '0')}`;
    const newInvoice: SupplierInvoice = {
      ...invoice,
      id,
      systemRef
    };
    setSupplierInvoices(prev => [newInvoice, ...prev]);
  };

  const approveSupplierInvoice = (id: string) => {
    setSupplierInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        return {
          ...inv,
          approvalStatus: 'APPROVED_L2',
          status: 'APPROVED'
        };
      }
      return inv;
    }));
  };

  const postSupplierInvoiceToGL = (id: string) => {
    const inv = supplierInvoices.find(i => i.id === id);
    if (!inv || inv.status === 'POSTED') return;

    // Create corresponding GL Voucher
    const jvLines = [
      {
        id: `jl-${Date.now()}-1`,
        accountId: 'coa-5010',
        accountCode: '5010',
        accountName: 'Direct Material Purchases',
        debit: inv.subTotal,
        credit: 0,
        currency: inv.currency,
        exchangeRate: 1.0,
        baseDebit: inv.subTotal,
        baseCredit: 0,
        description: `AP Bill: ${inv.invoiceNumber} — ${inv.vendorName}`
      },
      {
        id: `jl-${Date.now()}-2`,
        accountId: 'coa-1050',
        accountCode: '1050',
        accountName: 'Input VAT Recoverable (5%)',
        debit: inv.vatAmount,
        credit: 0,
        currency: inv.currency,
        exchangeRate: 1.0,
        baseDebit: inv.vatAmount,
        baseCredit: 0,
        description: `5% Input VAT on ${inv.invoiceNumber}`
      },
      {
        id: `jl-${Date.now()}-3`,
        accountId: 'coa-2010',
        accountCode: '2010',
        accountName: 'Trade Accounts Payable',
        debit: 0,
        credit: inv.grandTotal,
        currency: inv.currency,
        exchangeRate: 1.0,
        baseDebit: 0,
        baseCredit: inv.grandTotal,
        description: `Payable to ${inv.vendorName}`
      }
    ];

    const jvId = `jv-${Date.now()}`;
    const voucherNumber = `JV-2026-${String(journalEntries.length + 45).padStart(4, '0')}`;
    const newJv: JournalEntry = {
      id: jvId,
      voucherNumber,
      voucherDate: new Date().toISOString().slice(0, 10),
      postingDate: new Date().toISOString().slice(0, 10),
      period: '2026-03',
      voucherType: 'AP_INVOICE',
      reference: inv.invoiceNumber,
      narration: `Automated AP posting for Vendor Invoice ${inv.invoiceNumber} (${inv.vendorName})`,
      currency: inv.currency,
      totalDebit: inv.grandTotal,
      totalCredit: inv.grandTotal,
      status: 'POSTED',
      createdBy: 'Nasser Al-Kindi (AP Accountant)',
      postedBy: 'SYSTEM_AP_ENGINE',
      postedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      lines: jvLines
    };

    setJournalEntries(prev => [newJv, ...prev]);
    updateCoaBalancesFromLines(jvLines);

    setSupplierInvoices(prev => prev.map(i => {
      if (i.id === id) {
        return {
          ...i,
          status: 'POSTED',
          glVoucherId: jvId
        };
      }
      return i;
    }));
  };

  const addCustomerInvoice = (invoice: Omit<CustomerInvoice, 'id'>) => {
    const id = `ar-inv-${Date.now()}`;
    const newInv: CustomerInvoice = {
      ...invoice,
      id
    };
    setCustomerInvoices(prev => [newInv, ...prev]);
  };

  const addCustomerReceipt = (receipt: Omit<CustomerReceipt, 'id' | 'receiptNumber'>) => {
    const id = `rec-${Date.now()}`;
    const receiptNumber = `REC-2026-${String(customerReceipts.length + 55).padStart(4, '0')}`;
    const newReceipt: CustomerReceipt = {
      ...receipt,
      id,
      receiptNumber
    };
    setCustomerReceipts(prev => [newReceipt, ...prev]);

    // Update allocated invoice balances
    receipt.allocations.forEach(alloc => {
      setCustomerInvoices(prev => prev.map(inv => {
        if (inv.id === alloc.invoiceId) {
          const newAlloc = inv.allocatedAmount + alloc.allocatedAmount;
          const newBalance = inv.grandTotal - newAlloc;
          return {
            ...inv,
            allocatedAmount: newAlloc,
            balanceAmount: Math.max(0, newBalance),
            status: newBalance <= 0 ? 'PAID' : 'PARTIALLY_PAID'
          };
        }
        return inv;
      }));
    });
  };

  const runDepreciationPosting = () => {
    let totalDeprExpense = 0;
    fixedAssets.forEach(fa => {
      if (fa.status === 'ACTIVE') {
        totalDeprExpense += fa.monthlyDepreciationRate;
      }
    });

    const lines = [
      {
        id: `jl-depr-1`,
        accountId: 'coa-6030',
        accountCode: '6030',
        accountName: 'Depreciation Expense — Fixed Assets',
        debit: totalDeprExpense,
        credit: 0,
        currency: 'OMR',
        exchangeRate: 1.0,
        baseDebit: totalDeprExpense,
        baseCredit: 0,
        description: 'Monthly IAS 16 depreciation on PPE'
      },
      {
        id: `jl-depr-2`,
        accountId: 'coa-1520',
        accountCode: '1520',
        accountName: 'Accumulated Depreciation — PPE',
        debit: 0,
        credit: totalDeprExpense,
        currency: 'OMR',
        exchangeRate: 1.0,
        baseDebit: 0,
        baseCredit: totalDeprExpense,
        description: 'Credit to accumulated depreciation reserve'
      }
    ];

    addJournalEntry({
      voucherDate: new Date().toISOString().slice(0, 10),
      postingDate: new Date().toISOString().slice(0, 10),
      period: '2026-03',
      voucherType: 'DEPRECIATION',
      reference: 'DEPR-RUN-MAR2026',
      narration: 'Automated monthly fixed asset depreciation posting per IAS 16 standard.',
      currency: 'OMR',
      totalDebit: totalDeprExpense,
      totalCredit: totalDeprExpense,
      status: 'POSTED',
      createdBy: 'Fixed Asset Sub-ledger Engine',
      postedBy: 'SYSTEM_FA_ENGINE',
      postedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      lines
    });

    // Update assets accumulated depreciation
    setFixedAssets(prev => prev.map(fa => {
      if (fa.status === 'ACTIVE') {
        const newAccum = fa.accumulatedDepreciation + fa.monthlyDepreciationRate;
        return {
          ...fa,
          accumulatedDepreciation: newAccum,
          netBookValue: Math.max(fa.salvageValue, fa.costBasis - newAccum)
        };
      }
      return fa;
    }));
  };

  const lockFiscalPeriod = (periodId: string, subledger: 'gl' | 'ap' | 'ar' | 'all', lockType: 'SOFT_CLOSED' | 'HARD_CLOSED' | 'OPEN') => {
    setFiscalPeriods(prev => prev.map(p => {
      if (p.id === periodId) {
        if (subledger === 'all') {
          return { ...p, glStatus: lockType, apStatus: lockType, arStatus: lockType, inventoryStatus: lockType, closedBy: 'Salim Al-Harthy', closedAt: new Date().toISOString().slice(0, 10) };
        } else if (subledger === 'gl') {
          return { ...p, glStatus: lockType };
        } else if (subledger === 'ap') {
          return { ...p, apStatus: lockType };
        } else if (subledger === 'ar') {
          return { ...p, arStatus: lockType };
        }
      }
      return p;
    }));
  };

  const executeCostAllocation = (cycleId: string) => {
    setCostAllocationCycles(prev => prev.map(c => {
      if (c.id === cycleId) {
        return {
          ...c,
          lastExecutedDate: new Date().toISOString().slice(0, 10)
        };
      }
      return c;
    }));
  };

  const reconcileBankTransaction = (transactionId: string) => {
    setBankTransactions(prev => prev.map(bt => {
      if (bt.id === transactionId) {
        return { ...bt, isReconciled: true };
      }
      return bt;
    }));
  };

  const triggerYearEndClosing = (fiscalYear: string) => {
    // Calculate Net Profit to roll to Retained Earnings
    let totalRev = 0;
    let totalExp = 0;
    chartOfAccounts.forEach(acc => {
      if (acc.accountClass === 'REVENUE') totalRev += acc.closingBalance;
      if (acc.accountClass === 'EXPENSE') totalExp += acc.closingBalance;
    });
    const netIncome = totalRev - totalExp;

    addJournalEntry({
      voucherDate: `${fiscalYear}-12-31`,
      postingDate: `${fiscalYear}-12-31`,
      period: `${fiscalYear}-12`,
      voucherType: 'YEAR_END',
      reference: `YEAR-END-CLOSE-${fiscalYear}`,
      narration: `Fiscal Year ${fiscalYear} closing entry: Zeroing P&L accounts and transferring Net Income to Retained Earnings (Account 3020).`,
      currency: 'OMR',
      totalDebit: netIncome,
      totalCredit: netIncome,
      status: 'POSTED',
      createdBy: 'Salim Al-Harthy (CFO)',
      postedBy: 'SYSTEM_CLOSING_ENGINE',
      postedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      lines: [
        { id: `jl-ye-1`, accountId: 'coa-4000', accountCode: '4000', accountName: 'OPERATING REVENUE (Summary)', debit: totalRev, credit: 0, currency: 'OMR', exchangeRate: 1.0, baseDebit: totalRev, baseCredit: 0, description: 'Close revenue accounts' },
        { id: `jl-ye-2`, accountId: 'coa-5000', accountCode: '5000', accountName: 'EXPENSES & COGS (Summary)', debit: 0, credit: totalExp, currency: 'OMR', exchangeRate: 1.0, baseDebit: 0, baseCredit: totalExp, description: 'Close expense accounts' },
        { id: `jl-ye-3`, accountId: 'coa-3020', accountCode: '3020', accountName: 'Retained Earnings (Brought Forward)', debit: 0, credit: netIncome, currency: 'OMR', exchangeRate: 1.0, baseDebit: 0, baseCredit: netIncome, description: `Net Profit rollover for FY${fiscalYear}` }
      ]
    });
  };

  const value = {
    currency,
    chartOfAccounts,
    journalEntries,
    recurringJournals,
    supplierInvoices,
    customerInvoices,
    customerReceipts,
    bankAccounts,
    bankTransactions,
    fixedAssets,
    fiscalPeriods,
    accrualsPrepayments,
    costCenters,
    profitCenters,
    costAllocationCycles,
    vatSummary,
    intercompanyTransactions,
    currencyRates,
    financialRatios,
    addJournalEntry,
    postJournalEntry,
    addSupplierInvoice,
    approveSupplierInvoice,
    postSupplierInvoiceToGL,
    addCustomerInvoice,
    addCustomerReceipt,
    runDepreciationPosting,
    lockFiscalPeriod,
    executeCostAllocation,
    reconcileBankTransaction,
    triggerYearEndClosing
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export const useFinanceStore = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinanceStore must be used within a FinanceProvider');
  }
  return context;
};

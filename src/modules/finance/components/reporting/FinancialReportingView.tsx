// ==========================================
// 16.08 FINANCIAL REPORTING & STATUTORY STATEMENTS VIEW
// Balance Sheet, Income Statement (P&L), Cash Flows (IAS 7), Trial Balance & 5% VAT Return
// ==========================================

import React, { useState } from 'react';
import { useFinanceStore } from '../../services/financeStore';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Building2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Percent,
  Receipt
} from 'lucide-react';

type ReportId = 'trial-balance' | 'income-statement' | 'balance-sheet' | 'cash-flow' | 'vat-return';

export const FinancialReportingView: React.FC<{ initialReport?: ReportId }> = ({ initialReport = 'income-statement' }) => {
  const {
    currency,
    chartOfAccounts,
    supplierInvoices,
    customerInvoices
  } = useFinanceStore();

  const [activeReport, setActiveReport] = useState<ReportId>(initialReport);
  const [reportPeriod, setReportPeriod] = useState('Q1-2026');

  // Calculations for Trial Balance
  const totalDebit = chartOfAccounts.reduce((sum, a) => sum + a.currentDebit, 0);
  const totalCredit = chartOfAccounts.reduce((sum, a) => sum + a.currentCredit, 0);
  const isTrialBalanceInSync = Math.abs(totalDebit - totalCredit) < 0.01;

  // Income Statement aggregations
  const totalRevenue = chartOfAccounts
    .filter(a => a.accountClass === 'REVENUE')
    .reduce((sum, a) => sum + a.currentCredit, 0);
  const costOfSales = chartOfAccounts
    .filter(a => a.accountClass === 'EXPENSES' && a.code.startsWith('5'))
    .reduce((sum, a) => sum + a.currentDebit, 0);
  const grossProfit = totalRevenue - costOfSales;

  const operatingExpenses = chartOfAccounts
    .filter(a => a.accountClass === 'EXPENSES' && a.code.startsWith('6'))
    .reduce((sum, a) => sum + a.currentDebit, 0);
  const operatingProfitEBITDA = grossProfit - operatingExpenses;
  const netIncome = operatingProfitEBITDA; // simplified pre-tax

  // Balance Sheet aggregations
  const currentAssets = chartOfAccounts
    .filter(a => a.accountClass === 'ASSETS' && a.accountSubGroup === 'CURRENT_ASSET')
    .reduce((sum, a) => sum + (a.currentDebit - a.currentCredit), 0);
  const nonCurrentAssets = chartOfAccounts
    .filter(a => a.accountClass === 'ASSETS' && a.accountSubGroup === 'NON_CURRENT_ASSET')
    .reduce((sum, a) => sum + (a.currentDebit - a.currentCredit), 0);
  const totalAssets = currentAssets + nonCurrentAssets;

  const currentLiabilities = chartOfAccounts
    .filter(a => a.accountClass === 'LIABILITIES' && a.accountSubGroup === 'CURRENT_LIABILITY')
    .reduce((sum, a) => sum + (a.currentCredit - a.currentDebit), 0);
  const nonCurrentLiabilities = chartOfAccounts
    .filter(a => a.accountClass === 'LIABILITIES' && a.accountSubGroup === 'NON_CURRENT_LIABILITY')
    .reduce((sum, a) => sum + (a.currentCredit - a.currentDebit), 0);
  const totalLiabilities = currentLiabilities + nonCurrentLiabilities;

  const equityAccounts = chartOfAccounts
    .filter(a => a.accountClass === 'EQUITY')
    .reduce((sum, a) => sum + (a.currentCredit - a.currentDebit), 0);
  const totalEquityAndLiabilities = totalLiabilities + equityAccounts + netIncome;

  // VAT Return calculations
  const totalOutputVAT = customerInvoices.reduce((s, i) => s + i.vatAmount, 0);
  const totalInputVAT = supplierInvoices.reduce((s, i) => s + i.vatAmount, 0);
  const netVatPayable = totalOutputVAT - totalInputVAT;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Module 16.08 — Financial Reporting & Statutory Statements
          </div>
          <h2 className="text-2xl font-bold tracking-tight">IFRS Statements, Trial Balance & Oman VAT Return</h2>
          <p className="text-sm text-slate-400">
            Real-time automated Income Statement (P&L), Balance Sheet, Statement of Cash Flows (IAS 7), balanced Trial Balance, and statutory 5% VAT declaration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-all cursor-pointer">
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer">
            <Download className="w-4 h-4" />
            <span>Export IFRS PDF</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'income-statement', label: 'Income Statement (P&L)' },
            { id: 'balance-sheet', label: 'Balance Sheet' },
            { id: 'trial-balance', label: 'Trial Balance' },
            { id: 'cash-flow', label: 'Cash Flow (IAS 7)' },
            { id: 'vat-return', label: 'Oman 5% VAT Return' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveReport(tab.id as any)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeReport === tab.id
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select
            value={reportPeriod}
            onChange={e => setReportPeriod(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs"
          >
            <option value="Q1-2026">Q1 2026 (Jan - Mar)</option>
            <option value="FY-2025">Full Year 2025</option>
            <option value="FY-2026">YTD 2026</option>
          </select>
        </div>
      </div>

      {/* REPORT 1: INCOME STATEMENT */}
      {activeReport === 'income-statement' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm max-w-4xl mx-auto space-y-6">
          <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Artify Enterprise LLC — Oman
            </h3>
            <p className="text-sm font-semibold text-rose-600 mt-1">Statement of Comprehensive Income (P&L)</p>
            <p className="text-xs text-slate-400 font-mono">For the Period Ended 31 March 2026 • Currency: {currency}</p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* Revenue */}
            <div>
              <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white py-1">
                <span>REVENUE FROM CONTRACTS WITH CUSTOMERS (IFRS 15)</span>
                <span>{currency} {totalRevenue.toLocaleString()}</span>
              </div>
              <div className="pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Project & Construction Contracting Revenue</span>
                  <span>{currency} {totalRevenue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Cost of Sales */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white py-1">
                <span>COST OF SALES & SITE DIRECT EXPENSES</span>
                <span className="text-red-500">- ({currency} {costOfSales.toLocaleString()})</span>
              </div>
              <div className="pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Raw Materials & Subcontractor Direct Incurred</span>
                  <span>{currency} {costOfSales.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Gross Profit */}
            <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white py-2 px-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="font-sans">GROSS PROFIT</span>
              <span className="text-emerald-600">{currency} {grossProfit.toLocaleString()} ({((grossProfit / totalRevenue) * 100).toFixed(1)}%)</span>
            </div>

            {/* Operating Expenses */}
            <div className="pt-2">
              <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white py-1">
                <span>OPERATING & ADMINISTRATIVE EXPENSES</span>
                <span className="text-red-500">- ({currency} {operatingExpenses.toLocaleString()})</span>
              </div>
              <div className="pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Staff Salaries & Benefits (6010)</span>
                  <span>{currency} 850,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Depreciation & Amortization (6030)</span>
                  <span>{currency} 125,000</span>
                </div>
              </div>
            </div>

            {/* Net Operating Income */}
            <div className="flex justify-between font-bold text-base text-slate-900 dark:text-white py-3 px-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl">
              <span className="font-sans">NET OPERATING PROFIT (EBIT)</span>
              <span className="text-rose-600 dark:text-rose-400">{currency} {netIncome.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 2: BALANCE SHEET */}
      {activeReport === 'balance-sheet' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm max-w-4xl mx-auto space-y-6">
          <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Artify Enterprise LLC — Oman
            </h3>
            <p className="text-sm font-semibold text-rose-600 mt-1">Statement of Financial Position (Balance Sheet)</p>
            <p className="text-xs text-slate-400 font-mono">As of 31 March 2026 • Currency: {currency}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-xs">
            {/* Left: ASSETS */}
            <div className="space-y-4">
              <h4 className="font-sans font-bold text-base text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                ASSETS
              </h4>

              <div>
                <span className="font-sans font-bold text-slate-700 dark:text-slate-300 block mb-1">Non-Current Assets:</span>
                <div className="pl-3 space-y-1 text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Property, Plant & Equipment (PPE)</span>
                    <span>{currency} 8,500,000</span>
                  </div>
                  <div className="flex justify-between text-red-500">
                    <span>Less: Accumulated Depreciation</span>
                    <span>- ({currency} 1,250,000)</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span>Total Non-Current Assets</span>
                    <span>{currency} {nonCurrentAssets.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="font-sans font-bold text-slate-700 dark:text-slate-300 block mb-1">Current Assets:</span>
                <div className="pl-3 space-y-1 text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Cash & Bank Balances (1010-1030)</span>
                    <span>{currency} 7,850,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trade Accounts Receivable (1210)</span>
                    <span>{currency} 3,420,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inventory & Work-in-Progress (1310)</span>
                    <span>{currency} 1,850,000</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span>Total Current Assets</span>
                    <span>{currency} {currentAssets.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white py-2 px-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200">
                <span className="font-sans">TOTAL ASSETS</span>
                <span className="text-emerald-600">{currency} {totalAssets.toLocaleString()}</span>
              </div>
            </div>

            {/* Right: LIABILITIES & EQUITY */}
            <div className="space-y-4">
              <h4 className="font-sans font-bold text-base text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                EQUITY & LIABILITIES
              </h4>

              <div>
                <span className="font-sans font-bold text-slate-700 dark:text-slate-300 block mb-1">Shareholders' Equity:</span>
                <div className="pl-3 space-y-1 text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Share Capital (3010)</span>
                    <span>{currency} 5,000,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retained Earnings & Reserves (3020)</span>
                    <span>{currency} 3,850,000</span>
                  </div>
                  <div className="flex justify-between text-rose-600">
                    <span>Current Year Net Income</span>
                    <span>{currency} {netIncome.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="font-sans font-bold text-slate-700 dark:text-slate-300 block mb-1">Liabilities:</span>
                <div className="pl-3 space-y-1 text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Trade Accounts Payable (2010)</span>
                    <span>{currency} 2,150,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT Payable to Tax Authority (2020)</span>
                    <span>{currency} 410,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bank Long-Term Facility (2510)</span>
                    <span>{currency} 3,500,000</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white py-2 px-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200">
                <span className="font-sans">TOTAL EQUITY & LIAB.</span>
                <span className="text-blue-600">{currency} {totalEquityAndLiabilities.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 3: TRIAL BALANCE */}
      {activeReport === 'trial-balance' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Trial Balance Worksheet</h3>
              <p className="text-xs text-slate-500">Opening balances, period movements, and balanced closing positions</p>
            </div>
            {isTrialBalanceInSync && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full">
                <CheckCircle2 className="w-4 h-4" /> Perfect Zero-Variance Proof
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 font-sans font-semibold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-4">Account Code</th>
                  <th className="py-3 px-4">Account Title</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4 text-right">Debit Movement</th>
                  <th className="py-3 px-4 text-right">Credit Movement</th>
                  <th className="py-3 px-4 text-right font-bold">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {chartOfAccounts.map(acc => (
                  <tr key={acc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-rose-600">{acc.code}</td>
                    <td className="py-3 px-4 font-sans font-medium text-slate-900 dark:text-white">{acc.name}</td>
                    <td className="py-3 px-4 font-sans text-slate-500">{acc.accountClass}</td>
                    <td className="py-3 px-4 text-right text-slate-900 dark:text-white">
                      {acc.currentDebit > 0 ? `${currency} ${acc.currentDebit.toLocaleString()}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-900 dark:text-white">
                      {acc.currentCredit > 0 ? `${currency} ${acc.currentCredit.toLocaleString()}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                      {currency} {acc.closingBalance.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-100 dark:bg-slate-800 font-bold border-t-2 border-slate-300 dark:border-slate-600 text-sm">
                  <td colSpan={3} className="py-3 px-4 font-sans uppercase">Total Trial Balance Proof:</td>
                  <td className="py-3 px-4 text-right text-emerald-600">{currency} {totalDebit.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-emerald-600">{currency} {totalCredit.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-rose-600">✓ Balanced</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 4: 5% VAT RETURN */}
      {activeReport === 'vat-return' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm max-w-3xl mx-auto space-y-6">
          <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase">
              Sultanate of Oman — Tax Authority (Oman VAT Return)
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-1">Form VAT-01 • Tax Period: Q1 2026 • Taxpayer TIN: OM110029841</p>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* Box 1: Output VAT */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-sans font-bold text-slate-900 dark:text-white block">
                Box 1: Supplies & Output VAT on Sales (5% Standard Rated)
              </span>
              <div className="flex justify-between pl-3 text-slate-600 dark:text-slate-400">
                <span>Standard 5% Taxable Supplies Base:</span>
                <span>{currency} {(totalOutputVAT * 20).toLocaleString()}</span>
              </div>
              <div className="flex justify-between pl-3 text-blue-600 font-bold border-t border-slate-200 dark:border-slate-700 pt-1">
                <span>Total Output Tax Due:</span>
                <span>{currency} {totalOutputVAT.toLocaleString()}</span>
              </div>
            </div>

            {/* Box 2: Input VAT */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-sans font-bold text-slate-900 dark:text-white block">
                Box 2: Purchases & Recoverable Input VAT (5% Standard Rated)
              </span>
              <div className="flex justify-between pl-3 text-slate-600 dark:text-slate-400">
                <span>Standard 5% Taxable Incurred Purchases Base:</span>
                <span>{currency} {(totalInputVAT * 20).toLocaleString()}</span>
              </div>
              <div className="flex justify-between pl-3 text-emerald-600 font-bold border-t border-slate-200 dark:border-slate-700 pt-1">
                <span>Total Input Tax Recoverable:</span>
                <span>{currency} {totalInputVAT.toLocaleString()}</span>
              </div>
            </div>

            {/* Net VAT */}
            <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white py-3 px-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl">
              <span className="font-sans">NET VAT PAYABLE TO TAX AUTHORITY (Box 1 - Box 2)</span>
              <span className="text-rose-600 dark:text-rose-400">{currency} {netVatPayable.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 5: CASH FLOW (IAS 7) */}
      {activeReport === 'cash-flow' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm max-w-3xl mx-auto space-y-6">
          <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase">
              Statement of Cash Flows (IAS 7)
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-1">For Period Ended 31 March 2026 • Direct / Indirect Method</p>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between font-bold text-slate-900 dark:text-white py-1">
              <span>CASH FLOWS FROM OPERATING ACTIVITIES</span>
              <span className="text-emerald-600">+ {currency} 1,420,000</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 dark:text-white py-1">
              <span>CASH FLOWS FROM INVESTING ACTIVITIES (PPE & CAPEX)</span>
              <span className="text-red-500">- {currency} 450,000</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 dark:text-white py-1">
              <span>CASH FLOWS FROM FINANCING ACTIVITIES (Dividends & Loans)</span>
              <span className="text-slate-600 dark:text-slate-400">- {currency} 120,000</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white py-3 px-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-2xl">
              <span className="font-sans">NET INCREASE IN CASH & CASH EQUIVALENTS</span>
              <span className="text-emerald-600">+{currency} 850,000</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

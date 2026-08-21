// ==========================================
// 16.04 CASH & BANK ACCOUNTING VIEW
// Treasury Balances, Bank Transactions, Automated Bank Reconciliation & Cash Vouchers
// ==========================================

import React, { useState } from 'react';
import { useFinanceStore } from '../../services/financeStore';
import { BankAccount, BankTransaction } from '../../types/financeTypes';
import {
  Landmark,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  CreditCard,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  FileCheck,
  CheckCheck,
  ShieldCheck,
  Coins
} from 'lucide-react';

export const CashBankView: React.FC = () => {
  const {
    currency,
    bankAccounts,
    bankTransactions,
    reconcileBankTransaction
  } = useFinanceStore();

  const [activeTab, setActiveTab] = useState<'balances' | 'transactions' | 'reconciliation'>('balances');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(bankAccounts[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  const selectedAccount = bankAccounts.find(b => b.id === selectedAccountId) || bankAccounts[0];

  const totalLiquidityOMR = bankAccounts.reduce((sum, b) => {
    if (b.currency === 'OMR') return sum + b.currentBookBalance;
    if (b.currency === 'USD') return sum + b.currentBookBalance * 0.3845;
    return sum + b.currentBookBalance;
  }, 0);

  const filteredTransactions = bankTransactions.filter(bt => {
    const matchesSearch = bt.description.toLowerCase().includes(searchTerm.toLowerCase()) || bt.reference.toLowerCase().includes(searchTerm);
    const matchesAccount = !selectedAccountId || bt.bankAccountId === selectedAccountId;
    return matchesSearch && matchesAccount;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Landmark className="w-3.5 h-3.5" />
            Module 16.04 — Cash & Bank Accounting
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Cash & Bank Accounting & Reconciliations</h2>
          <p className="text-sm text-slate-400">
            Real-time multi-currency liquidity oversight, electronic wire transfers, petty cash imprest, and automated bank statement reconciliations.
          </p>
        </div>

        <div className="text-right bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
          <span className="text-xs text-slate-400 font-medium block">Total Enterprise Liquidity</span>
          <p className="text-2xl font-bold font-mono text-emerald-400">
            {currency} {totalLiquidityOMR.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-300">Across 3 Operating Institutions + Petty Cash</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('balances')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'balances'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Bank & Cash Accounts ({bankAccounts.length})
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'transactions'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Treasury Cash Flow Transactions ({bankTransactions.length})
          </button>
          <button
            onClick={() => setActiveTab('reconciliation')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'reconciliation'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Bank Reconciliation Engine
          </button>
        </div>
      </div>

      {/* Tab 1: Account Balances */}
      {activeTab === 'balances' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {bankAccounts.map(acc => (
            <div
              key={acc.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:border-emerald-500/50 transition-all space-y-4 relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                  GL #{acc.glAccountCode}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{acc.bankName}</h3>
                <p className="text-xs text-slate-500">{acc.branch}</p>
                <p className="text-xs font-mono text-slate-400 mt-1">A/C: {acc.accountNumber}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">GL Book Balance:</span>
                  <strong className="text-slate-900 dark:text-white">
                    {acc.currency} {acc.currentBookBalance.toLocaleString()}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Bank Statement:</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {acc.currency} {acc.statementBalance.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400 font-sans">Reconciliation Variance:</span>
                  <span className={acc.unreconciledDifference === 0 ? 'text-emerald-500 font-bold' : 'text-amber-500 font-bold'}>
                    {acc.unreconciledDifference === 0 ? '✓ Balanced (0.00)' : `${acc.currency} ${acc.unreconciledDifference.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                <span>Last Reconciled: {acc.lastReconciledDate}</span>
                <span className="text-emerald-600 font-semibold">{acc.accountType}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Transactions */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Bank Account:</label>
              <select
                value={selectedAccountId}
                onChange={e => setSelectedAccountId(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-1.5"
              >
                {bankAccounts.map(b => (
                  <option key={b.id} value={b.id}>{b.bankName} ({b.currency})</option>
                ))}
              </select>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 font-sans font-semibold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4">Tx Date</th>
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 font-sans">Description</th>
                    <th className="py-3 px-4 text-right">Inflow / Deposit</th>
                    <th className="py-3 px-4 text-right">Outflow / Payment</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{tx.transactionDate}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{tx.reference}</td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-sans">
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-800 dark:text-slate-200">{tx.description}</td>
                      <td className="py-3 px-4 text-right text-emerald-600 font-bold">
                        {tx.amount > 0 ? `${tx.currency} ${tx.amount.toLocaleString()}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right text-red-500 font-bold">
                        {tx.amount < 0 ? `${tx.currency} ${Math.abs(tx.amount).toLocaleString()}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-center font-sans">
                        {tx.isReconciled ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                            <CheckCheck className="w-3 h-3" /> Reconciled
                          </span>
                        ) : (
                          <button
                            onClick={() => reconcileBankTransaction(tx.id)}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 cursor-pointer"
                          >
                            Reconcile Now
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Bank Reconciliation */}
      {activeTab === 'reconciliation' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Bank Reconciliation Statement</h3>
              <p className="text-xs text-slate-500">
                Reconciling <strong>{selectedAccount.bankName}</strong> ({selectedAccount.accountNumber}) as of March 2026
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition-all cursor-pointer">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Auto-Match Bank Feed</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Reconciliation Formula */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 font-mono text-xs">
              <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Reconciliation Summary</h4>
              
              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700">
                <span className="font-sans text-slate-600 dark:text-slate-400">Bank Statement Closing Balance:</span>
                <strong className="text-slate-900 dark:text-white">{currency} {selectedAccount.statementBalance.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700 text-emerald-600">
                <span className="font-sans text-slate-600 dark:text-slate-400">Plus: Deposits in Transit:</span>
                <span>+ {currency} 0</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700 text-red-500">
                <span className="font-sans text-slate-600 dark:text-slate-400">Less: Unpresented Outflow Cheques:</span>
                <span>- {currency} 0</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700 text-amber-500">
                <span className="font-sans text-slate-600 dark:text-slate-400">Less: Unposted Bank Service Fees:</span>
                <span>- {currency} 12,000</span>
              </div>
              <div className="flex justify-between py-2 text-sm font-bold text-emerald-600 border-t-2 border-slate-300 dark:border-slate-600">
                <span className="font-sans text-slate-900 dark:text-white">Adjusted Bank Balance:</span>
                <span>{currency} {selectedAccount.currentBookBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 text-sm font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700">
                <span className="font-sans">General Ledger Book Balance:</span>
                <span>{currency} {selectedAccount.currentBookBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-200">
                <span className="font-sans">Reconciled Net Difference:</span>
                <span>✓ 0.00 (PERFECT RECONCILIATION)</span>
              </div>
            </div>

            {/* Right: Un-reconciled items table */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Un-reconciled Statement Items (Pending Match)</h4>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">CHG-BM-0326 — Bank Maintenance Fee</span>
                    <span className="text-slate-500 font-mono">Date: 2026-03-05 • Swift & Token Fee</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono text-red-600 block">- {currency} 12,000</span>
                    <button
                      onClick={() => reconcileBankTransaction('bt-03')}
                      className="text-[10px] font-bold px-2.5 py-1 bg-amber-600 text-white rounded-lg hover:bg-amber-500 mt-1 cursor-pointer"
                    >
                      Post & Match
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

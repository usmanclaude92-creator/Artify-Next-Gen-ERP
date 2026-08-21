// ==========================================
// 16.01 GENERAL LEDGER VIEW
// Chart of Accounts, Journal Entries, Recurring Vouchers & GL Drilldown
// ==========================================

import React, { useState } from 'react';
import { useFinanceStore } from '../../services/financeStore';
import { JournalEntry, JournalLine } from '../../types/financeTypes';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  Layers,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Sparkles,
  Download,
  Printer,
  Sliders,
  DollarSign
} from 'lucide-react';

export const GeneralLedgerView: React.FC = () => {
  const {
    currency,
    chartOfAccounts,
    journalEntries,
    recurringJournals,
    addJournalEntry,
    postJournalEntry
  } = useFinanceStore();

  const [activeTab, setActiveTab] = useState<'coa' | 'journals' | 'recurring' | 'gl-inquiry'>('journals');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('coa-1011');

  // Form State for new Journal Entry
  const [voucherType, setVoucherType] = useState<JournalEntry['voucherType']>('GENERAL');
  const [narration, setNarration] = useState('');
  const [reference, setReference] = useState('');
  const [lines, setLines] = useState<{ accountCode: string; debit: number; credit: number; description: string }[]>([
    { accountCode: '6020', debit: 5000, credit: 0, description: 'Office lease and utilities' },
    { accountCode: '1011', debit: 0, credit: 5000, description: 'Bank transfer payment' }
  ]);

  const totalDebit = lines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.001 && totalDebit > 0;

  const handleAddLine = () => {
    setLines(prev => [...prev, { accountCode: '1011', debit: 0, credit: 0, description: '' }]);
  };

  const handleRemoveLine = (idx: number) => {
    if (lines.length <= 2) return;
    setLines(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmitJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) return;

    const jvLines: JournalLine[] = lines.map((l, idx) => {
      const coa = chartOfAccounts.find(c => c.code === l.accountCode) || chartOfAccounts[0];
      return {
        id: `jl-new-${idx}`,
        accountId: coa.id,
        accountCode: coa.code,
        accountName: coa.name,
        debit: Number(l.debit) || 0,
        credit: Number(l.credit) || 0,
        currency,
        exchangeRate: 1.0,
        baseDebit: Number(l.debit) || 0,
        baseCredit: Number(l.credit) || 0,
        description: l.description || narration
      };
    });

    addJournalEntry({
      voucherDate: new Date().toISOString().slice(0, 10),
      postingDate: new Date().toISOString().slice(0, 10),
      period: '2026-03',
      voucherType,
      reference: reference || `REF-${Date.now().toString().slice(-4)}`,
      narration,
      currency,
      totalDebit,
      totalCredit,
      status: 'POSTED',
      createdBy: 'Tariq Al-Balushi (Chief Accountant)',
      postedBy: 'SYSTEM_GL_ENGINE',
      postedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      lines: jvLines
    });

    setShowCreateModal(false);
    setNarration('');
    setReference('');
  };

  // Filtered COA
  const filteredAccounts = chartOfAccounts.filter(acc => {
    const matchesSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || acc.code.includes(searchTerm);
    const matchesClass = selectedClass === 'ALL' || acc.accountClass === selectedClass;
    return matchesSearch && matchesClass;
  });

  // Selected Account for GL Inquiry
  const selectedAccount = chartOfAccounts.find(a => a.id === selectedAccountId) || chartOfAccounts[2];

  // Ledger transactions for selected account
  const accountTransactions = journalEntries.flatMap(jv =>
    jv.lines
      .filter(l => l.accountCode === selectedAccount.code || l.accountId === selectedAccount.id)
      .map(l => ({
        jvId: jv.id,
        voucherNumber: jv.voucherNumber,
        date: jv.voucherDate,
        type: jv.voucherType,
        narration: jv.narration,
        description: l.description,
        debit: l.baseDebit,
        credit: l.baseCredit,
        status: jv.status
      }))
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            Module 16.01 — General Ledger (GL)
          </div>
          <h2 className="text-2xl font-bold tracking-tight">General Ledger & Double-Entry Accounting</h2>
          <p className="text-sm text-slate-400">
            Multi-tiered IFRS Chart of Accounts, manual and automated journal vouchers, recurring journal schedules, and transaction ledger inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-2xl shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Journal Voucher</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('journals')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'journals'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Journal Vouchers ({journalEntries.length})
          </button>
          <button
            onClick={() => setActiveTab('coa')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'coa'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Chart of Accounts ({chartOfAccounts.length})
          </button>
          <button
            onClick={() => setActiveTab('recurring')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'recurring'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Recurring Journals ({recurringJournals.length})
          </button>
          <button
            onClick={() => setActiveTab('gl-inquiry')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'gl-inquiry'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Account Ledger Inquiry
          </button>
        </div>
      </div>

      {/* Tab 1: Journal Entries */}
      {activeTab === 'journals' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by JV number, narration, reference..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="text-xs text-slate-500">
              Showing <strong>{journalEntries.length}</strong> journal entries
            </div>
          </div>

          <div className="space-y-3">
            {journalEntries.map(jv => (
              <div
                key={jv.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-emerald-500/50 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-mono font-bold text-xs">
                      {jv.voucherNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {jv.narration}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                          {jv.voucherType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Date: <strong>{jv.voucherDate}</strong> • Period: <strong>{jv.period}</strong> • Ref: <strong>{jv.reference}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-medium">Total Amount</span>
                      <p className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                        {currency} {jv.totalDebit.toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        jv.status === 'POSTED'
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 text-amber-600 border border-amber-200'
                      }`}
                    >
                      {jv.status}
                    </span>
                    {jv.status !== 'POSTED' && (
                      <button
                        onClick={() => postJournalEntry(jv.id)}
                        className="px-3 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow cursor-pointer"
                      >
                        Post to GL
                      </button>
                    )}
                  </div>
                </div>

                {/* Voucher Lines Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-y border-slate-100 dark:border-slate-800">
                        <th className="py-2 px-3">Account Code & Name</th>
                        <th className="py-2 px-3">Line Description</th>
                        <th className="py-2 px-3 text-right">Debit ({currency})</th>
                        <th className="py-2 px-3 text-right">Credit ({currency})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                      {jv.lines.map(l => (
                        <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-slate-900 dark:text-white">{l.accountCode}</span> — {l.accountName}
                          </td>
                          <td className="py-2.5 px-3 font-sans text-slate-600 dark:text-slate-400">{l.description}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                            {l.debit > 0 ? l.debit.toLocaleString() : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                            {l.credit > 0 ? l.credit.toLocaleString() : '-'}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 dark:bg-slate-800/70 font-bold border-t border-slate-200 dark:border-slate-700">
                        <td colSpan={2} className="py-2.5 px-3 text-right uppercase tracking-wider font-sans text-slate-700 dark:text-slate-300">
                          Balanced Total:
                        </td>
                        <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400">
                          {currency} {jv.totalDebit.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400">
                          {currency} {jv.totalCredit.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Chart of Accounts */}
      {activeTab === 'coa' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              {['ALL', 'ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'].map(cls => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedClass === cls
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search account code or name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4">Account Code</th>
                    <th className="py-3 px-4">Account Title</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Type / Level</th>
                    <th className="py-3 px-4 text-right">Debit Movement</th>
                    <th className="py-3 px-4 text-right">Credit Movement</th>
                    <th className="py-3 px-4 text-right">Closing Balance</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredAccounts.map(acc => (
                    <tr
                      key={acc.id}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                        acc.level === 1 ? 'bg-slate-50/50 dark:bg-slate-800/20 font-bold' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {acc.code}
                      </td>
                      <td className="py-3 px-4">
                        <div style={{ paddingLeft: `${(acc.level - 1) * 16}px` }} className="flex items-center gap-2">
                          {acc.level > 1 && <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />}
                          <span className={acc.level === 1 ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-700 dark:text-slate-300'}>
                            {acc.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {acc.accountClass}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        Level {acc.level} ({acc.subClass})
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                        {acc.currentDebit > 0 ? `${currency} ${acc.currentDebit.toLocaleString()}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                        {acc.currentCredit > 0 ? `${currency} ${acc.currentCredit.toLocaleString()}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {currency} {acc.closingBalance.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Recurring Journals */}
      {activeTab === 'recurring' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recurringJournals.map(rj => (
              <div
                key={rj.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{rj.title}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                        {rj.frequency}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">Template Ref: {rj.code}</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {rj.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {rj.narration}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Next Scheduled Run:</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{rj.nextRunDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Auto-Post Mode:</span>
                    <strong className={rj.autoPost ? 'text-emerald-500' : 'text-slate-500'}>
                      {rj.autoPost ? 'Enabled (Instant GL Commit)' : 'Draft Review Mode'}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Account Ledger Inquiry */}
      {activeTab === 'gl-inquiry' && (
        <div className="space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select General Ledger Account:</label>
              <select
                value={selectedAccountId}
                onChange={e => setSelectedAccountId(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-emerald-500"
              >
                {chartOfAccounts.filter(a => a.level >= 2).map(a => (
                  <option key={a.id} value={a.id}>
                    {a.code} — {a.name} ({a.accountClass})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-all">
                <Printer className="w-3.5 h-3.5" />
                <span>Print Ledger</span>
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-all">
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Account Ledger: {selectedAccount.code} — {selectedAccount.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Class: {selectedAccount.accountClass} • Sub-Class: {selectedAccount.subClass} • Currency: {selectedAccount.currency}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Current Closing Balance</span>
                <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {currency} {selectedAccount.closingBalance.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-y border-slate-100 dark:border-slate-800">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Voucher #</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Description / Narration</th>
                    <th className="py-2.5 px-3 text-right">Debit ({currency})</th>
                    <th className="py-2.5 px-3 text-right">Credit ({currency})</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  <tr className="bg-slate-50/50 dark:bg-slate-800/20 italic text-slate-500">
                    <td className="py-2.5 px-3">2026-01-01</td>
                    <td className="py-2.5 px-3">—</td>
                    <td className="py-2.5 px-3 font-sans">OPENING</td>
                    <td className="py-2.5 px-3 font-sans">Opening Balance Forward</td>
                    <td className="py-2.5 px-3 text-right">{selectedAccount.openingBalance > 0 ? selectedAccount.openingBalance.toLocaleString() : '-'}</td>
                    <td className="py-2.5 px-3 text-right">-</td>
                    <td className="py-2.5 px-3 text-center font-sans text-[10px]">AUDITED</td>
                  </tr>
                  {accountTransactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3">{tx.date}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-600">{tx.voucherNumber}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-600 dark:text-slate-400">{tx.type}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-900 dark:text-white">{tx.description}</td>
                      <td className="py-2.5 px-3 text-right text-slate-900 dark:text-white font-bold">{tx.debit > 0 ? tx.debit.toLocaleString() : '-'}</td>
                      <td className="py-2.5 px-3 text-right text-slate-900 dark:text-white font-bold">{tx.credit > 0 ? tx.credit.toLocaleString() : '-'}</td>
                      <td className="py-2.5 px-3 text-center font-sans">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create New Journal Entry */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold">Create Balanced Journal Voucher</h3>
                <p className="text-xs text-slate-400">Double-entry General Ledger posting</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>

            <form onSubmit={handleSubmitJournal} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Voucher Type</label>
                  <select
                    value={voucherType}
                    onChange={e => setVoucherType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="GENERAL">GENERAL VOUCHER</option>
                    <option value="ACCRUAL">ACCRUAL ADJUSTMENT</option>
                    <option value="AP_INVOICE">AP INVOICE POSTING</option>
                    <option value="AR_INVOICE">AR INVOICE POSTING</option>
                    <option value="FX_REVALUATION">FX REVALUATION</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Reference Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ADJ-MAR-2026"
                    value={reference}
                    onChange={e => setReference(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Narration</label>
                  <input
                    type="text"
                    required
                    placeholder="Explain business justification..."
                    value={narration}
                    onChange={e => setNarration(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              {/* Lines Table */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Journal Lines (Debits & Credits)</span>
                  <button
                    type="button"
                    onClick={handleAddLine}
                    className="flex items-center gap-1 text-emerald-600 font-bold hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Line
                  </button>
                </div>

                <div className="space-y-2">
                  {lines.map((line, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="col-span-4">
                        <select
                          value={line.accountCode}
                          onChange={e => {
                            const val = e.target.value;
                            setLines(prev => prev.map((l, i) => i === idx ? { ...l, accountCode: val } : l));
                          }}
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                        >
                          {chartOfAccounts.filter(a => a.level >= 2).map(a => (
                            <option key={a.id} value={a.code}>{a.code} — {a.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          placeholder="Line description..."
                          value={line.description}
                          onChange={e => {
                            const val = e.target.value;
                            setLines(prev => prev.map((l, i) => i === idx ? { ...l, description: val } : l));
                          }}
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Debit"
                          value={line.debit || ''}
                          onChange={e => {
                            const val = parseFloat(e.target.value) || 0;
                            setLines(prev => prev.map((l, i) => i === idx ? { ...l, debit: val, credit: val > 0 ? 0 : l.credit } : l));
                          }}
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-right"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Credit"
                          value={line.credit || ''}
                          onChange={e => {
                            const val = parseFloat(e.target.value) || 0;
                            setLines(prev => prev.map((l, i) => i === idx ? { ...l, credit: val, debit: val > 0 ? 0 : l.debit } : l));
                          }}
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-right"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveLine(idx)}
                          className="text-red-500 hover:text-red-700 text-sm font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Balance validation bar */}
                <div className={`p-3 rounded-xl flex justify-between items-center text-xs font-mono font-bold ${
                  isBalanced ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300'
                }`}>
                  <span>Debit Total: {currency} {totalDebit.toLocaleString()}</span>
                  <span>Credit Total: {currency} {totalCredit.toLocaleString()}</span>
                  <span>
                    {isBalanced ? '✓ VOUCHER BALANCED' : `⚠ UNBALANCED (Diff: ${currency} ${Math.abs(totalDebit - totalCredit).toLocaleString()})`}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isBalanced || !narration}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg cursor-pointer"
                >
                  Commit & Post to GL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useBankingTreasury } from '../../services/bankingTreasuryStore';
import {
  BankStatementImportRecord,
  BankStatementLine,
  ReconciliationAdjustmentRecord
} from '../../types';
import {
  CheckCircle,
  UploadCloud,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Sparkles,
  RefreshCw,
  Sliders,
  DollarSign,
  ArrowRightLeft,
  XCircle,
  Plus,
  HelpCircle
} from 'lucide-react';

export const BankReconciliationView: React.FC = () => {
  const {
    statementImports,
    statementLines,
    reconciliationAdjustments,
    bankAccounts,
    importBankStatement,
    runAutoMatchingEngine,
    toggleManualReconciliation,
    createReconciliationAdjustment
  } = useBankingTreasury();

  const [activeTab, setActiveTab] = useState<'statement' | 'matching' | 'adjustments'>('matching');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(bankAccounts[0]?.id || '');
  const [matchingInProgress, setMatchingInProgress] = useState(false);
  const [matchReport, setMatchReport] = useState<{ matchedCount: number; unreconciledCount: number } | null>(null);

  // Modals
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);

  // Form State: Statement Import
  const [importFormat, setImportFormat] = useState<BankStatementImportRecord['importFormat']>('MT940 SWIFT');
  const [importFilename, setImportFilename] = useState('BMUS_STATEMENT_2026_08_20.STA');
  const [importLinesCount, setImportLinesCount] = useState(14);

  // Form State: Adjustment
  const [adjType, setAdjType] = useState<ReconciliationAdjustmentRecord['adjustmentType']>('Bank Service Charges');
  const [adjAmount, setAdjAmount] = useState<number>(35.5);
  const [adjDesc, setAdjDesc] = useState('Monthly corporate internet banking & token maintenance charges');
  const [adjGlDebit, setAdjGlDebit] = useState('5090-01-001');

  const formatCurrency = (val: number, curr = 'OMR') => {
    return `${curr} ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleRunMatching = () => {
    setMatchingInProgress(true);
    setTimeout(() => {
      const res = runAutoMatchingEngine('stmt-01');
      setMatchReport(res);
      setMatchingInProgress(false);
    }, 800);
  };

  const handleImportStatement = (e: React.FormEvent) => {
    e.preventDefault();
    importBankStatement(selectedAccountId, importFormat, importFilename, Number(importLinesCount));
    setShowImportModal(false);
  };

  const handleCreateAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    const acc = bankAccounts.find((b) => b.id === selectedAccountId);
    createReconciliationAdjustment({
      bankAccountId: selectedAccountId,
      bankAccountName: acc?.accountName || 'Bank Muscat Operating',
      statementLineId: '',
      adjustmentDate: new Date().toISOString().split('T')[0],
      adjustmentType: adjType,
      amount: Number(adjAmount),
      currency: 'OMR',
      glOffsetAccount: adjGlDebit,
      glOffsetAccountName: adjGlDebit,
      narration: adjDesc,
      taxAmountVAT: 0,
      postedBy: 'Dr. Tariq Al-Habsi (Finance Director)'
    });
    setShowAdjustmentModal(false);
    setAdjAmount(35.5);
    setAdjDesc('');
  };

  const currentAccount = bankAccounts.find((b) => b.id === selectedAccountId) || bankAccounts[0];

  return (
    <div className="space-y-6">
      {/* Account Selector Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Active Reconciliation Target
            </label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="text-sm font-bold text-slate-900 dark:text-slate-100 bg-transparent border-none focus:outline-none cursor-pointer"
            >
              {bankAccounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.accountName} ({a.bankName}) — {a.currency}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Gap Meter */}
        <div className="flex items-center gap-4 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px]">GL Book Balance</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(currentAccount.currentBookBalance, currentAccount.currency)}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Bank Statement Balance</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(currentAccount.clearedBankBalance, currentAccount.currency)}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30">
            <span className="text-amber-700 dark:text-amber-300 block text-[10px] font-semibold">Unreconciled Variance</span>
            <span className="font-bold text-amber-800 dark:text-amber-200">{formatCurrency(currentAccount.unreconciledDifference, currentAccount.currency)}</span>
          </div>
        </div>
      </div>

      {/* Tabs & Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('matching')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'matching'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Interactive Side-by-Side Matching ({statementLines.length} Lines)</span>
          </button>

          <button
            onClick={() => setActiveTab('statement')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'statement'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Statement Imports Feed ({statementImports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('adjustments')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'adjustments'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Reconciliation Adjustments ({reconciliationAdjustments.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'matching' && (
            <button
              onClick={handleRunMatching}
              disabled={matchingInProgress}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${matchingInProgress ? 'animate-spin' : ''}`} />
              <span>{matchingInProgress ? 'Running Rule Engine...' : 'Run Auto-Reconcile Engine'}</span>
            </button>
          )}

          {activeTab === 'statement' && (
            <button
              onClick={() => setShowImportModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Import MT940 / CSV Feed</span>
            </button>
          )}

          {activeTab === 'adjustments' && (
            <button
              onClick={() => setShowAdjustmentModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Bank Charge / Interest Adjustment</span>
            </button>
          )}
        </div>
      </div>

      {/* MATCH REPORT ALERT */}
      {matchReport && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              Auto-Matching complete: <strong>{matchReport.matchedCount} lines matched</strong> with 98%+ confidence score. 1 discrepancy remaining for manual audit.
            </span>
          </div>
          <button
            onClick={() => setMatchReport(null)}
            className="text-xs text-emerald-700 dark:text-emerald-300 font-bold hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: INTERACTIVE SIDE-BY-SIDE MATCHING */}
      {activeTab === 'matching' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs overflow-hidden">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">Bank Statement Feed Lines vs ERP Cash Ledger</span>
            <span className="text-slate-500 dark:text-slate-400">Matching Threshold: Exact Reference & Value Date ±2 Days</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3.5">Txn Date</th>
                  <th className="p-3.5">Statement Description & Ref</th>
                  <th className="p-3.5 text-right">Debit (Withdrawal)</th>
                  <th className="p-3.5 text-right">Credit (Deposit)</th>
                  <th className="p-3.5">Matched ERP Ledger Reference</th>
                  <th className="p-3.5 text-center">Match Method & Score</th>
                  <th className="p-3.5 text-center">Reconcile Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {statementLines.map((line) => (
                  <tr
                    key={line.id}
                    className={`transition-colors ${line.isReconciled ? 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50' : 'bg-amber-50/40 dark:bg-amber-500/40 hover:bg-amber-50/70 dark:hover:bg-amber-500/70'}`}
                  >
                    <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300">{line.transactionDate}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{line.narrativeDescription}</div>
                      <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400">{line.bankReference}</div>
                    </td>
                    <td className="p-3.5 text-right font-bold text-rose-700 dark:text-rose-300">
                      {line.transactionType === 'Debit' ? formatCurrency(line.amount) : '—'}
                    </td>
                    <td className="p-3.5 text-right font-bold text-emerald-700 dark:text-emerald-300">
                      {line.transactionType === 'Credit' ? formatCurrency(line.amount) : '—'}
                    </td>
                    <td className="p-3.5">
                      {line.matchedVoucherRef ? (
                        <span className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {line.matchedVoucherRef}
                        </span>
                      ) : (
                        <span className="text-[11px] text-amber-700 dark:text-amber-300 italic font-semibold">Unmatched in ERP</span>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">{line.matchMethod}</div>
                      {line.matchScorePercent > 0 && (
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold">
                          {line.matchScorePercent}% Confidence
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => toggleManualReconciliation(line.id, !line.isReconciled)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 mx-auto ${
                          line.isReconciled
                            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-200 dark:hover:bg-emerald-500/30'
                            : 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-500/30'
                        }`}
                      >
                        {line.isReconciled ? <CheckCircle2 className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />}
                        <span>{line.isReconciled ? 'Reconciled' : 'Open / Unmatched'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: STATEMENT IMPORTS FEED */}
      {activeTab === 'statement' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {statementImports.map((imp) => (
            <div key={imp.id} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    {imp.statementReference}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">{imp.bankAccountName}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Format: {imp.importFormat}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-200">
                  {imp.reconciliationStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Opening Balance</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formatCurrency(imp.openingBalance)}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Closing Balance</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(imp.closingBalance)}</span>
                </div>
              </div>

              <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span>
                  Total Lines: <strong>{imp.totalLinesCount}</strong> ({imp.totalCreditEntries} Cr, {imp.totalDebitEntries} Dr)
                </span>
                <span className="text-emerald-700 dark:text-emerald-300 font-bold">{imp.matchedLinesCount} Matched</span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Imported: {imp.importedAt}</span>
                <span>By: {imp.importedBy}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: RECONCILIATION ADJUSTMENTS */}
      {activeTab === 'adjustments' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3.5">Adjustment # & Date</th>
                  <th className="p-3.5">Bank Account</th>
                  <th className="p-3.5">Adjustment Category</th>
                  <th className="p-3.5">GL Debit / Credit Codes</th>
                  <th className="p-3.5 text-right">Adjustment (OMR)</th>
                  <th className="p-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {reconciliationAdjustments.map((adj) => (
                  <tr key={adj.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-slate-900 dark:text-slate-100">{adj.adjustmentNumber}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{adj.adjustmentDate}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{adj.bankAccountName}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{adj.narration}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold">
                        {adj.adjustmentType}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-mono text-slate-700 dark:text-slate-300">Dr: {adj.glOffsetAccount}</div>
                      <div className="font-mono text-slate-500 dark:text-slate-400">Cr: {adj.glOffsetAccountName}</div>
                    </td>
                    <td className="p-3.5 text-right font-bold text-rose-700 dark:text-rose-300 text-sm">
                      {formatCurrency(adj.amount)}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                        {adj.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: IMPORT BANK STATEMENT */}
      {showImportModal && (
        <div className="fixed inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Import Bank Statement Feed</h3>
            <form onSubmit={handleImportStatement} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Target Bank Account *</label>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                >
                  {bankAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.accountName} ({a.bankName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Statement Format *</label>
                  <select
                    value={importFormat}
                    onChange={(e) => setImportFormat(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                  >
                    <option value="MT940 SWIFT">SWIFT MT940 (.STA)</option>
                    <option value="ISO 20022 CAMT.053 XML">ISO 20022 CAMT.053 XML</option>
                    <option value="CSV / Excel Bank Feed">CSV / Excel Bank Feed</option>
                    <option value="Direct Host-to-Host SFTP">Direct Host-to-Host (H2H)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Estimated Line Entries</label>
                  <input
                    type="number"
                    value={importLinesCount}
                    onChange={(e) => setImportLinesCount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Filename / Electronic Ref</label>
                <input
                  type="text"
                  required
                  value={importFilename}
                  onChange={(e) => setImportFilename(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Parse & Load Statement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: POST ADJUSTMENT */}
      {showAdjustmentModal && (
        <div className="fixed inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Post Bank Reconciliation Adjustment</h3>
            <form onSubmit={handleCreateAdjustment} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Adjustment Category *</label>
                <select
                  value={adjType}
                  onChange={(e) => setAdjType(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                >
                  <option value="Bank Service Charges">Bank Service Charges & Commission</option>
                  <option value="Overdraft Interest Debit">Overdraft Interest Debit</option>
                  <option value="Call Account Interest Credit">Call Account Interest Credit</option>
                  <option value="Foreign Exchange Translation Diff">Foreign Exchange Translation Diff</option>
                  <option value="Direct Standing Order Debit">Direct Standing Order Debit</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Amount (OMR) *</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={adjAmount}
                    onChange={(e) => setAdjAmount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">GL Debit Expense Account</label>
                  <input
                    type="text"
                    value={adjGlDebit}
                    onChange={(e) => setAdjGlDebit(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Description / Memo</label>
                <input
                  type="text"
                  required
                  placeholder="Monthly banking service fees"
                  value={adjDesc}
                  onChange={(e) => setAdjDesc(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAdjustmentModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Post to General Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

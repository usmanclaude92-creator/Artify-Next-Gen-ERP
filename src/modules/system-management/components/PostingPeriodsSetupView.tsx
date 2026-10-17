import React, { useState } from 'react';
import {
  Clock,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Layers,
  ShieldCheck,
  Building2,
  FileCheck2,
  Key,
  ShieldAlert,
  ArrowRight,
  X
} from 'lucide-react';
import { useSystemManagement } from '../services/systemManagementStore';
import { PostingPeriod } from '../types';
import { notify } from '@/src/components/common/Feedback';

interface PostingPeriodsSetupViewProps {
  initialTransactionId?: string;
  initialTransactionCode?: string;
}

export const PostingPeriodsSetupView: React.FC<PostingPeriodsSetupViewProps> = ({
  initialTransactionId,
  initialTransactionCode
}) => {
  const {
    companies = [],
    fiscalYears = [],
    postingPeriods = [],
    togglePostingPeriodSubLedger,
    lockOrUnlockPeriod,
    requestPeriodUnlock,
    approvePeriodUnlock,
    periodLocks = []
  } = useSystemManagement();

  const [selectedFyFilter, setSelectedFyFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'periods' | 'sub-ledgers' | 'locking' | 'unlock-requests'>('periods');

  React.useEffect(() => {
    if (initialTransactionId === 'tx-period-creation' || initialTransactionCode === '01.01.05.01') {
      setActiveTab('periods');
    } else if (initialTransactionId === 'tx-period-opening' || initialTransactionCode === '01.01.05.02') {
      setActiveTab('periods');
    } else if (initialTransactionId === 'tx-period-closing' || initialTransactionCode === '01.01.05.03') {
      setActiveTab('sub-ledgers');
    } else if (initialTransactionId === 'tx-period-locking' || initialTransactionCode === '01.01.05.04') {
      setActiveTab('locking');
    }
  }, [initialTransactionId, initialTransactionCode]);

  // Lock modal state
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [selectedPeriodForLock, setSelectedPeriodForLock] = useState<PostingPeriod | null>(null);
  const [lockReason, setLockReason] = useState('');
  const [lockActionType, setLockActionType] = useState<'lock' | 'unlock'>('lock');

  // Unlock Request Modal state
  const [isUnlockRequestModalOpen, setIsUnlockRequestModalOpen] = useState(false);
  const [unlockReason, setUnlockReason] = useState('');

  const handleOpenLockDialog = (period: PostingPeriod, action: 'lock' | 'unlock') => {
    setSelectedPeriodForLock(period);
    setLockActionType(action);
    setLockReason(action === 'lock' ? 'Month-end statutory audit close' : 'Emergency adjustment authorization');
    setIsLockModalOpen(true);
  };

  const handleConfirmLockAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPeriodForLock) {
      lockOrUnlockPeriod(selectedPeriodForLock.id, lockActionType, lockReason);
    }
    setIsLockModalOpen(false);
  };

  const handleOpenUnlockRequest = (period: PostingPeriod) => {
    setSelectedPeriodForLock(period);
    setUnlockReason('');
    setIsUnlockRequestModalOpen(true);
  };

  const handleSubmitUnlockRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPeriodForLock) {
      requestPeriodUnlock(selectedPeriodForLock.id, unlockReason);
    }
    setIsUnlockRequestModalOpen(false);
  };

  const filteredPeriods = postingPeriods.filter(p => {
    const matchesFy = selectedFyFilter === 'ALL' || p.fiscalYearCode === selectedFyFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || p.overallStatus === selectedStatusFilter;
    return matchesFy && matchesStatus;
  });

  const getSubLedgerBadge = (status: 'Open' | 'Closed' | 'Locked') => {
    if (status === 'Open') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
          OPEN
        </span>
      );
    }
    if (status === 'Closed') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
          CLOSED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800">
        LOCKED
      </span>
    );
  };

  return (
    <div id="posting-periods-setup-view" className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/80 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
                  01.01.05
                </span>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Posting Periods Setup
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                  Sub-Ledger Controls
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
                Manage monthly financial posting calendars, authorize sub-ledger open/close routines, and enforce granular period locking.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => notify('Generated standard 12-month posting calendar for active fiscal years.')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Calendar Periods</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mt-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('periods')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'periods'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>01.01.05.01 Period Creation & Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('sub-ledgers')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'sub-ledgers'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>01.01.05.02 / 03 Period Opening & Closing Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('locking')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'locking'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>01.01.05.04 Period Locking & Audit Controls</span>
          </button>
        </div>
      </div>

      {/* Filter and Status Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Fiscal Year:</span>
            <select
              value={selectedFyFilter}
              onChange={e => setSelectedFyFilter(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
            >
              <option value="ALL">All Fiscal Years</option>
              <option value="FY 2026">FY 2026</option>
              <option value="FY 2025">FY 2025</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Locked">Locked</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600 dark:text-slate-400">Open for Postings</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
            <span className="text-slate-600 dark:text-slate-400">Closed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-slate-600 dark:text-slate-400">Hard Locked</span>
          </div>
        </div>
      </div>

      {/* Tab 1: Period Overview */}
      {activeTab === 'periods' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Financial Posting Periods Calendar</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Period</th>
                  <th className="px-4 py-3">Fiscal Year</th>
                  <th className="px-4 py-3">Date Range</th>
                  <th className="px-4 py-3">GL</th>
                  <th className="px-4 py-3">AP</th>
                  <th className="px-4 py-3">AR</th>
                  <th className="px-4 py-3">Inventory</th>
                  <th className="px-4 py-3">Payroll</th>
                  <th className="px-4 py-3">Overall Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredPeriods.map(period => (
                  <tr
                    key={period.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                          P{String(period.periodNumber).padStart(2, '0')}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {period.periodName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                      {period.fiscalYearCode}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-600 dark:text-slate-400">
                      {period.startDate} → {period.endDate}
                    </td>
                    <td className="px-4 py-3.5">{getSubLedgerBadge(period.subLedgers.gl)}</td>
                    <td className="px-4 py-3.5">{getSubLedgerBadge(period.subLedgers.ap)}</td>
                    <td className="px-4 py-3.5">{getSubLedgerBadge(period.subLedgers.ar)}</td>
                    <td className="px-4 py-3.5">{getSubLedgerBadge(period.subLedgers.inventory)}</td>
                    <td className="px-4 py-3.5">{getSubLedgerBadge(period.subLedgers.payroll)}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          period.overallStatus === 'Open'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:border-emerald-500/30 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : period.overallStatus === 'Closed'
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30'
                        }`}
                      >
                        {period.overallStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {period.overallStatus === 'Open' ? (
                        <button
                          onClick={() => handleOpenLockDialog(period, 'lock')}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 transition-colors cursor-pointer"
                        >
                          Lock Period
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenLockDialog(period, 'unlock')}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 transition-colors cursor-pointer"
                        >
                          Unlock
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Sub-Ledgers Matrix */}
      {activeTab === 'sub-ledgers' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Sub-Ledger Granular Posting Matrix</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Click individual sub-ledger switches to selectively open or close transactional modules independently (e.g. keep AP open for late invoices while closing Inventory).
            </p>
          </div>

          <div className="space-y-4">
            {filteredPeriods.slice(0, 6).map(period => (
              <div
                key={period.id}
                className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-3 mb-3">
                  <div>
                    <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                      P{String(period.periodNumber).padStart(2, '0')} • {period.fiscalYearCode}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {period.periodName} ({period.startDate} to {period.endDate})
                    </h4>
                  </div>

                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      period.overallStatus === 'Open'
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {period.overallStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {(['gl', 'ap', 'ar', 'inventory', 'fixedAssets', 'payroll'] as const).map(ledger => {
                    const status = period.subLedgers[ledger];
                    const ledgerLabel = {
                      gl: 'GL (General Ledger)',
                      ap: 'AP (Purchasing)',
                      ar: 'AR (Sales & Billing)',
                      inventory: 'Inventory & Stock',
                      fixedAssets: 'Fixed Assets',
                      payroll: 'Payroll & HR'
                    }[ledger];

                    return (
                      <div
                        key={ledger}
                        className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-center"
                      >
                        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                          {ledgerLabel}
                        </span>

                        <button
                          onClick={() =>
                            togglePostingPeriodSubLedger(
                              period.id,
                              ledger,
                              status === 'Open' ? 'Closed' : 'Open'
                            )
                          }
                          className={`w-full py-1 text-xs font-bold rounded cursor-pointer transition-colors ${
                            status === 'Open'
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                          }`}
                        >
                          {status.toUpperCase()}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Locking & Audit */}
      {activeTab === 'locking' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Period Hard-Lock & Statutory Audit Registry</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Audit trail of locked periods, emergency unlock approvals, and reason documentation.
            </p>
          </div>

          <div className="space-y-4">
            {periodLocks.map(lock => (
              <div
                key={lock.id}
                className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {lock.periodName} — Hard-Locked by {lock.lockedBy}
                      </h4>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Timestamp: {lock.lockedAt} • Reason: {lock.lockReason}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenLockDialog(postingPeriods[0], 'unlock')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 transition-colors cursor-pointer"
                  >
                    Request Emergency Unlock
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lock / Unlock Confirmation Dialog */}
      {isLockModalOpen && selectedPeriodForLock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>
                  {lockActionType === 'lock' ? 'Lock Posting Period' : 'Unlock Posting Period'}
                </span>
              </h3>
              <button
                onClick={() => setIsLockModalOpen(false)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmLockAction} className="p-6 space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                You are about to <strong>{lockActionType.toUpperCase()}</strong>{' '}
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {selectedPeriodForLock.periodName} ({selectedPeriodForLock.fiscalYearCode})
                </span>
                .
              </p>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Reason for Action (Statutory Audit Log) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={lockReason}
                  onChange={e => setLockReason(e.target.value)}
                  placeholder="State justification..."
                  className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLockModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-semibold text-slate-900 dark:text-white rounded-lg shadow-xs cursor-pointer ${
                    lockActionType === 'lock'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  Confirm {lockActionType === 'lock' ? 'Lock' : 'Unlock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

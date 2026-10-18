import React, { useState } from 'react';
import {
  Calendar,
  Lock,
  Unlock,
  Hash,
  SlidersHorizontal,
  ShieldAlert,
  AlertOctagon,
  CheckCircle2,
  Plus,
  RefreshCw,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useSystemManagement } from '../services/systemManagementStore';
import { DataTable, ColumnDef } from './common/DataTable';
import { StatusBadge } from './common/StatusBadge';
import { MetricCard } from './common/MetricCard';
import { FormModal } from './common/FormModal';
import { PostingPeriod, DocumentSequence, PeriodLockRecord } from '../types';

export const FinancialPeriodControlsView: React.FC<{ activeTab?: string }> = ({ activeTab: initialTab = 'periods' }) => {
  const {
    fiscalYears,
    postingPeriods,
    documentSequences,
    postingControls,
    periodLocks,
    togglePostingPeriodSubLedger,
    lockOrUnlockPeriod,
    addDocumentSequence,
    updatePostingControls,
    requestPeriodUnlock,
    approvePeriodUnlock
  } = useSystemManagement();

  const [activeTab, setActiveTab] = useState<'periods' | 'sequences' | 'controls' | 'locks'>(
    (initialTab as any) || 'periods'
  );

  const [isSeqModalOpen, setIsSeqModalOpen] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [selectedPeriodForUnlock, setSelectedPeriodForUnlock] = useState<string>('p-2026-07');
  const [unlockReason, setUnlockReason] = useState('');

  const [seqForm, setSeqForm] = useState({
    code: '',
    documentTypeName: '',
    module: 'Finance & Accounting',
    prefix: 'JV-2026-',
    suffix: '',
    nextNumber: 10001,
    paddingDigits: 5,
    resetFrequency: 'Annual' as const,
    allowManualOverride: false,
    status: 'Active' as const
  });

  const handleCreateSequence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seqForm.code || !seqForm.documentTypeName) return;
    addDocumentSequence({
      documentType: seqForm.code,
      documentTypeName: seqForm.documentTypeName,
      companyId: 'comp-1',
      companyName: 'Artify Global Holding Co.',
      prefix: seqForm.prefix,
      suffix: seqForm.suffix,
      startingNumber: seqForm.nextNumber,
      currentNumber: seqForm.nextNumber,
      numberLength: seqForm.paddingDigits,
      fiscalYearReset: seqForm.resetFrequency === 'Annual',
      sampleFormatted: `${seqForm.prefix}${String(seqForm.nextNumber).padStart(seqForm.paddingDigits, '0')}${seqForm.suffix}`,
      status: seqForm.status
    });
    setIsSeqModalOpen(false);
  };

  const handleRequestUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlockReason.trim()) return;
    requestPeriodUnlock(selectedPeriodForUnlock, unlockReason);
    setIsUnlockModalOpen(false);
    setUnlockReason('');
  };

  // Sequence Columns
  const seqColumns: ColumnDef<DocumentSequence>[] = [
    {
      key: 'documentType',
      header: 'Series Code',
      accessor: item => <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">{item.documentType}</span>
    },
    {
      key: 'documentTypeName',
      header: 'Document Type & Scope',
      accessor: item => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-100">{item.documentTypeName}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.companyName}</div>
        </div>
      )
    },
    {
      key: 'sampleFormatted',
      header: 'Live Pattern Preview',
      accessor: item => (
        <span className="font-mono text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded text-[11px] font-bold">
          {item.sampleFormatted || `${item.prefix}${String(item.currentNumber).padStart(item.numberLength, '0')}${item.suffix || ''}`}
        </span>
      )
    },
    {
      key: 'fiscalYearReset',
      header: 'Reset Rule',
      accessor: item => (
        <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">{item.fiscalYearReset ? 'Annual Fiscal Reset' : 'Continuous Sequential'}</span>
      )
    },
    {
      key: 'startingNumber',
      header: 'Starting / Current Sequence',
      accessor: item => (
        <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
          Start: {item.startingNumber} • Cur: <strong>{item.currentNumber}</strong>
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      accessor: item => <StatusBadge status={item.status} />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Active Fiscal Calendar"
          value="FY-2026"
          status="positive"
          description="12 Monthly Posting Periods"
          icon={<Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
        />
        <MetricCard
          label="Current Open Posting Period"
          value="Period 08"
          status="positive"
          description="August 2026 (Live Sub-Ledgers)"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
        />
        <MetricCard
          label="Backdated Tolerance Window"
          value={`${postingControls.allowedBackdatedDays} Days`}
          status="neutral"
          description="Max Posting Grace Window"
          icon={<Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
        />
        <MetricCard
          label="Document Numbering Series"
          value={documentSequences.length}
          status="positive"
          description="Autonomous Gapless Sequences"
          icon={<Hash className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('periods')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'periods' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Posting Periods & Sub-Ledger Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('sequences')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'sequences' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Hash className="w-4 h-4" />
          <span>Document Numbering Sequences ({documentSequences.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('controls')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'controls' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Posting Controls & Tolerances</span>
        </button>

        <button
          onClick={() => setActiveTab('locks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'locks' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Audit Period Locks & Unlock Approvals</span>
        </button>
      </div>

      {/* Tab 1: Sub-Ledger Posting Matrix */}
      {activeTab === 'periods' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                FY-2026 Sub-Ledger Posting Calendar
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Granular control over transaction posting across individual module sub-ledgers (GL, AP, AR, Inventory, Assets, Payroll)
              </p>
            </div>

            <button
              onClick={() => setIsUnlockModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Request Period Unlock</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Date Range</th>
                  <th className="py-3 px-4 text-center">General Ledger (GL)</th>
                  <th className="py-3 px-4 text-center">Accounts Payable (AP)</th>
                  <th className="py-3 px-4 text-center">Accounts Receivable (AR)</th>
                  <th className="py-3 px-4 text-center">Inventory</th>
                  <th className="py-3 px-4 text-center">Fixed Assets</th>
                  <th className="py-3 px-4 text-center">Payroll</th>
                  <th className="py-3 px-4 text-right">Master Gate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {postingPeriods.map(p => {
                  const isOpen = p.overallStatus === 'Open';
                  const isLocked = p.overallStatus === 'Locked';

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors ${
                        isOpen ? 'bg-emerald-50/20 dark:bg-emerald-500/10' : isLocked ? 'bg-slate-50/40 dark:bg-slate-800/40' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{p.periodName}</div>
                        <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400">Code: {p.id}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                        {p.startDate} to {p.endDate}
                      </td>

                      {/* Sub-ledger cell buttons */}
                      {(['gl', 'ap', 'ar', 'inventory', 'fixedAssets', 'payroll'] as const).map(ledger => {
                        const status = p.subLedgers[ledger];
                        return (
                          <td key={ledger} className="py-3.5 px-3 text-center">
                            <button
                              onClick={() => {
                                const nextStatus =
                                  status === 'Open' ? 'Closed' : status === 'Closed' ? 'Locked' : 'Open';
                                togglePostingPeriodSubLedger(p.id, ledger, nextStatus);
                              }}
                              className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                                status === 'Open'
                                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'
                                  : status === 'Closed'
                                  ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20'
                                  : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30 hover:bg-rose-100 dark:hover:bg-rose-500/20'
                              }`}
                              title={`Click to cycle: Open -> Closed -> Locked`}
                            >
                              {status}
                            </button>
                          </td>
                        );
                      })}

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <StatusBadge status={p.overallStatus} size="sm" />
                          <button
                            onClick={() =>
                              lockOrUnlockPeriod(
                                p.id,
                                p.overallStatus === 'Locked' ? 'unlock' : 'lock',
                                'Manual Administrator override via financial posting matrix'
                              )
                            }
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
                            title={p.overallStatus === 'Locked' ? 'Unlock full period' : 'Lock full period'}
                          >
                            {p.overallStatus === 'Locked' ? (
                              <Unlock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Document Sequences */}
      {activeTab === 'sequences' && (
        <DataTable
          title="Document Auto-Numbering Series"
          subtitle="Strict consecutive numbering sequences with zero-gap compliance and prefix formatting"
          data={documentSequences}
          columns={seqColumns}
          keyExtractor={item => item.id}
          onAddClick={() => setIsSeqModalOpen(true)}
          addLabel="Add Number Series"
          searchPlaceholder="Search sequence code, document type, prefix..."
          exportFileName="artify-document-sequences"
        />
      )}

      {/* Tab 3: Posting Controls & Tolerances */}
      {activeTab === 'controls' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">General Ledger Posting & Tolerance Controls</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Enterprise financial guardrails governing backdated entries, future-dated vouchers, and rounding variance caps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">Allow Backdated Posting</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Permit posting transactions with effective dates earlier than today
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      updatePostingControls({
                        allowedBackdatedDays: postingControls.allowedBackdatedDays > 0 ? 0 : 7
                      })
                    }
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      postingControls.allowedBackdatedDays > 0 ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white dark:bg-slate-900 transition-transform ${
                        postingControls.allowedBackdatedDays > 0 ? 'translate-x-4.5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {postingControls.allowedBackdatedDays > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Tolerance Window:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={postingControls.allowedBackdatedDays}
                        onChange={e =>
                          updatePostingControls({
                            allowedBackdatedDays: Number(e.target.value)
                          })
                        }
                        className="w-16 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded font-mono text-xs text-center"
                      />
                      <span className="text-slate-500 dark:text-slate-400">Days</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">Allow Future-Dated Posting</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Permit scheduling future journal entries and recurring accruals
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      updatePostingControls({
                        allowedFutureDays: postingControls.allowedFutureDays > 0 ? 0 : 3
                      })
                    }
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      postingControls.allowedFutureDays > 0 ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white dark:bg-slate-900 transition-transform ${
                        postingControls.allowedFutureDays > 0 ? 'translate-x-4.5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">Enforce Balanced Journal Rule</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Strict validation that Total Debits = Total Credits before voucher commitment
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold">
                    Mandatory Active
                  </span>
                </div>
              </div>

              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">Rounding Variance Threshold</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Automatic small FX/Penny rounding adjustment ceiling
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>0.001 OMR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Period Locks */}
      {activeTab === 'locks' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Period Unlock Authorization Queue</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Audit sign-offs required by Financial Controllers to re-open historical posting books
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {periodLocks.map(lock => (
              <div key={lock.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50/60 dark:bg-slate-800/60 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {lock.periodName} ({lock.companyName})
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Locked by: <strong>{lock.lockedBy}</strong> at {lock.lockedAt} • Reason: {lock.lockReason}
                    </p>
                  </div>
                  <StatusBadge status="Locked" size="sm" />
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Unlock Authorization Requests
                  </div>
                  {lock.unlockRequests.map(req => (
                    <div
                      key={req.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          Request #{req.id} • Submitted by {req.requestedBy} ({req.requestedAt})
                        </div>
                        <div className="text-slate-600 dark:text-slate-400 mt-0.5">
                          <strong>Justification:</strong> {req.reason}
                        </div>
                        {req.approvedBy && (
                          <div className="text-emerald-700 dark:text-emerald-300 font-medium text-[11px] mt-0.5">
                            Approved by: {req.approvedBy} ({req.approvedAt})
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusBadge status={req.status} size="sm" />
                        {req.status === 'Pending' && (
                          <button
                            onClick={() => approvePeriodUnlock(lock.id, req.id)}
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold cursor-pointer shadow-2xs"
                          >
                            Approve Unlock
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Create Numbering Sequence */}
      <FormModal
        isOpen={isSeqModalOpen}
        onClose={() => setIsSeqModalOpen(false)}
        title="Define Document Numbering Series"
        subtitle="Establish gapless automatic serial numbering with dynamic prefix and year reset rules"
        onSubmit={handleCreateSequence}
        submitLabel="Register Numbering Series"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Series Code *</label>
            <input
              type="text"
              required
              value={seqForm.code}
              onChange={e => setSeqForm({ ...seqForm, code: e.target.value.toUpperCase() })}
              placeholder="e.g. SEQ-INV-2026"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Document Type *</label>
            <input
              type="text"
              required
              value={seqForm.documentTypeName}
              onChange={e => setSeqForm({ ...seqForm, documentTypeName: e.target.value })}
              placeholder="e.g. Sales Tax Invoice"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Prefix Template</label>
            <input
              type="text"
              value={seqForm.prefix}
              onChange={e => setSeqForm({ ...seqForm, prefix: e.target.value })}
              placeholder="e.g. INV-2026-"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Starting Serial Number</label>
            <input
              type="number"
              value={seqForm.nextNumber}
              onChange={e => setSeqForm({ ...seqForm, nextNumber: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Zero-Padding Digits</label>
            <input
              type="number"
              value={seqForm.paddingDigits}
              onChange={e => setSeqForm({ ...seqForm, paddingDigits: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Reset Rule</label>
            <select
              value={seqForm.resetFrequency}
              onChange={e => setSeqForm({ ...seqForm, resetFrequency: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            >
              <option value="Annual">Annual (Fiscal Year Start)</option>
              <option value="Monthly">Monthly</option>
              <option value="Never">Continuous (Never Reset)</option>
            </select>
          </div>
        </div>
      </FormModal>

      {/* Modal: Request Unlock */}
      <FormModal
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        title="Submit Period Unlock Request"
        subtitle="Forward an emergency re-opening request for financial controller authorization"
        onSubmit={handleRequestUnlock}
        submitLabel="Submit for CFO Sign-Off"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Target Closed Period *</label>
            <select
              value={selectedPeriodForUnlock}
              onChange={e => setSelectedPeriodForUnlock(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            >
              {postingPeriods
                .filter(p => p.overallStatus !== 'Open')
                .map(p => (
                  <option key={p.id} value={p.id}>
                    {p.periodName} ({p.startDate} - {p.endDate}) - Status: {p.overallStatus}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Audit Justification & Statutory Reason *
            </label>
            <textarea
              required
              rows={3}
              value={unlockReason}
              onChange={e => setUnlockReason(e.target.value)}
              placeholder="e.g. Statutory external audit year-end tax adjustment voucher required under Deloitte guidance..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
};

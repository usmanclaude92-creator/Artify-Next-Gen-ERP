// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 17: COMPLIANCE, RISK & AUDIT
// 17.07 — Corrective & Preventive Actions (CAPA) View
// ==========================================

import React, { useState } from 'react';
import { useComplianceStore } from '../../services/complianceStore';
import { CorrectiveActionItem, FindingSeverity } from '../../types';
import {
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Sliders,
  CheckSquare,
  FileCheck,
  Building,
  User,
  X
} from 'lucide-react';

export const CorrectiveActionsView: React.FC = () => {
  const { correctiveActions, addCorrectiveAction, updateCorrectiveAction, verifyAndCloseCapa } = useComplianceStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modals
  const [isAddCapaOpen, setIsAddCapaOpen] = useState(false);
  const [selectedCapaClose, setSelectedCapaClose] = useState<CorrectiveActionItem | null>(null);
  const [verificationNotesInput, setVerificationNotesInput] = useState('');
  const [verifiedByInput, setVerifiedByInput] = useState('Nasser Al-Harthy (Lead Internal Auditor)');

  // Form state
  const [capaForm, setCapaForm] = useState<Omit<CorrectiveActionItem, 'id'>>({
    capaCode: '',
    sourceType: 'INTERNAL_AUDIT',
    sourceFindingReference: 'AUD-2026-F01',
    findingSummary: '',
    severity: 'MEDIUM',
    rootCauseCategory: 'PROCESS_GAP',
    remediationPlan: '',
    operationalLead: '',
    department: 'Finance',
    targetDueDate: '',
    completionPercentage: 0,
    milestones: [
      { title: 'Revise Standard Operating Procedure (SOP)', targetDate: '2026-04-15', completed: true },
      { title: 'Implement 3-way match validation in ERP', targetDate: '2026-05-15', completed: false }
    ],
    status: 'IN_PROGRESS'
  });

  const filteredCapas = correctiveActions.filter(c => {
    const matchesSearch =
      c.capaCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.findingSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.operationalLead.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: CorrectiveActionItem['status']) => {
    switch (status) {
      case 'VERIFIED_CLOSED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Closed & Verified
          </span>
        );
      case 'COMPLETED_PENDING_RETEST':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
            <Clock className="w-3 h-3" /> Pending Audit Signoff
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
            <Clock className="w-3 h-3" /> In Progress
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30">
            <AlertTriangle className="w-3 h-3" /> Overdue
          </span>
        );
    }
  };

  const handleAddCapaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capaForm.capaCode || !capaForm.findingSummary || !capaForm.operationalLead) return;
    addCorrectiveAction(capaForm);
    setIsAddCapaOpen(false);
  };

  const handleCloseVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCapaClose || !verificationNotesInput) return;
    verifyAndCloseCapa(selectedCapaClose.id, verifiedByInput, verificationNotesInput);
    setSelectedCapaClose(null);
    setVerificationNotesInput('');
  };

  return (
    <div className="space-y-6">
      {/* Submodule Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              17.07
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Corrective & Preventive Actions (CAPA)</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tracking remedial implementation milestones, root cause analysis, and formal re-testing sign-off by internal audit.
          </p>
        </div>

        <button
          onClick={() => setIsAddCapaOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create CAPA Remediation Plan
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500 dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search CAPA code, summary, owner, department..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED_PENDING_RETEST">Pending Verification</option>
            <option value="VERIFIED_CLOSED">Closed & Verified</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
      </div>

      {/* CAPA Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCapas.map(capa => (
          <div key={capa.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  {capa.capaCode} • Ref: {capa.sourceFindingReference}
                </span>
                {getStatusBadge(capa.status)}
              </div>

              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{capa.findingSummary}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{capa.remediationPlan}</p>

              {/* Progress Slider / Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500 dark:text-slate-400">Implementation Progress</span>
                  <span className="text-emerald-700 dark:text-emerald-300 font-mono font-bold">{capa.completionPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${capa.completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Milestones Preview */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Milestones</span>
                {capa.milestones.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className={m.completed ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}>
                      {m.completed ? '☑' : '☐'}
                    </span>
                    <span className={m.completed ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-300'}>
                      {m.title} ({m.targetDate})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Owner</span>
                <strong className="text-slate-800 dark:text-slate-200">{capa.operationalLead} ({capa.department})</strong>
              </div>
              <div className="flex items-center gap-2">
                {capa.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => updateCorrectiveAction(capa.id, { completionPercentage: 100, status: 'COMPLETED_PENDING_RETEST' })}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-lg transition cursor-pointer"
                  >
                    Submit for Signoff
                  </button>
                )}
                {capa.status === 'COMPLETED_PENDING_RETEST' && (
                  <button
                    onClick={() => setSelectedCapaClose(capa)}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition cursor-pointer"
                  >
                    Verify & Close
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: CREATE CAPA */}
      {isAddCapaOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg">Create CAPA Remediation Plan</h3>
              <button onClick={() => setIsAddCapaOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCapaSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CAPA Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CAPA-2026-03"
                    value={capaForm.capaCode}
                    onChange={e => setCapaForm({ ...capaForm, capaCode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Finding Reference</label>
                  <input
                    type="text"
                    placeholder="e.g. AUD-2026-F02"
                    value={capaForm.sourceFindingReference}
                    onChange={e => setCapaForm({ ...capaForm, sourceFindingReference: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Finding Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ERP Automated Two-Way Signatory Control Implementation"
                  value={capaForm.findingSummary}
                  onChange={e => setCapaForm({ ...capaForm, findingSummary: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Remediation Action Plan</label>
                <textarea
                  rows={2}
                  value={capaForm.remediationPlan}
                  onChange={e => setCapaForm({ ...capaForm, remediationPlan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Operational Lead *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Procurement Director"
                    value={capaForm.operationalLead}
                    onChange={e => setCapaForm({ ...capaForm, operationalLead: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Due Date</label>
                  <input
                    type="date"
                    required
                    value={capaForm.targetDueDate}
                    onChange={e => setCapaForm({ ...capaForm, targetDueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCapaOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition cursor-pointer shadow-sm"
                >
                  Save CAPA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VERIFY & CLOSE CAPA */}
      {selectedCapaClose && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg">Audit Verification & Closure</h3>
              <button onClick={() => setSelectedCapaClose(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCloseVerification} className="space-y-4 text-sm">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-mono font-bold text-slate-900">{selectedCapaClose.capaCode}</span>
                <p className="text-slate-700 mt-1">{selectedCapaClose.findingSummary}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Auditor Verification Notes *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Conducted re-test sample of 25 transactions post-implementation. Zero exceptions noted."
                  value={verificationNotesInput}
                  onChange={e => setVerificationNotesInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Verifying Auditor Name</label>
                <input
                  type="text"
                  required
                  value={verifiedByInput}
                  onChange={e => setVerifiedByInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCapaClose(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition cursor-pointer shadow-sm"
                >
                  Sign Off & Close CAPA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

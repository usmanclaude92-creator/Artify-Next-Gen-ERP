// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 17: COMPLIANCE, RISK & AUDIT
// 17.06 — External Audit View (PBC & Big-4 Coordination)
// ==========================================

import React, { useState } from 'react';
import { useComplianceStore } from '../../services/complianceStore';
import { ExternalPBCRequest, ExternalAuditorProfile, ExternalAuditQueryResponse, PBCStatus } from '../../types';
import {
  Building2,
  FolderLock,
  FileCheck2,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Plus,
  FileText,
  DollarSign,
  User,
  X
} from 'lucide-react';

export const ExternalAuditView: React.FC = () => {
  const { auditorProfiles, pbcRequests, auditResponses, updatePbcStatus, addAuditQueryResponse } = useComplianceStore();

  const [activeTab, setActiveTab] = useState<'pbc' | 'firm' | 'queries'>('pbc');
  const [pbcSearch, setPbcSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modals
  const [selectedPbcUpload, setSelectedPbcUpload] = useState<ExternalPBCRequest | null>(null);
  const [simulatedFileName, setSimulatedFileName] = useState('');

  const filteredPbc = pbcRequests.filter(p => {
    const matchesSearch =
      p.pbcNumber.toLowerCase().includes(pbcSearch.toLowerCase()) ||
      p.itemDescription.toLowerCase().includes(pbcSearch.toLowerCase()) ||
      p.assignedPerson.toLowerCase().includes(pbcSearch.toLowerCase()) ||
      p.financialArea.toLowerCase().includes(pbcSearch.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: PBCStatus) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Accepted by Auditor
          </span>
        );
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
            <Clock className="w-3 h-3" /> Under Review
          </span>
        );
      case 'IN_PREPARATION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
            <Clock className="w-3 h-3" /> In Preparation
          </span>
        );
      case 'REQUESTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <AlertCircle className="w-3 h-3" /> Requested
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30">
            <AlertCircle className="w-3 h-3" /> Rejected / Clarify
          </span>
        );
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPbcUpload || !simulatedFileName) return;
    updatePbcStatus(selectedPbcUpload.id, 'SUBMITTED', simulatedFileName);
    setSelectedPbcUpload(null);
    setSimulatedFileName('');
  };

  const currentAuditor = auditorProfiles[0];

  return (
    <div className="space-y-6">
      {/* Submodule Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              17.06
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">External Statutory Audit & PBC Workspace</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Provided-By-Client (PBC) request fulfillment tracker, digital evidence repository, and auditor query correspondence.
          </p>
        </div>

        {currentAuditor && (
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <strong className="text-xs text-slate-900 dark:text-slate-100 block">{currentAuditor.firmName}</strong>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Lead: {currentAuditor.leadPartner} (FY {currentAuditor.fiscalYearUnderAudit})</span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('pbc')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'pbc'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-t-xl'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <FolderLock className="w-4 h-4" /> PBC Request Tracker ({pbcRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('queries')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'queries'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-t-xl'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" /> Auditor Query Responses ({auditResponses.length})
        </button>
        <button
          onClick={() => setActiveTab('firm')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'firm'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-t-xl'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" /> Audit Engagement Profile
        </button>
      </div>

      {/* 1. PBC TRACKER */}
      {activeTab === 'pbc' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Search PBC number, description, owner, area..."
                value={pbcSearch}
                onChange={e => setPbcSearch(e.target.value)}
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
                <option value="ACCEPTED">Accepted</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="IN_PREPARATION">In Preparation</option>
                <option value="REQUESTED">Requested</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">PBC #</th>
                    <th className="px-4 py-3">Financial Area</th>
                    <th className="px-4 py-3">Request Item Description</th>
                    <th className="px-4 py-3">Format</th>
                    <th className="px-4 py-3">Due Date</th>
                    <th className="px-4 py-3">Assigned Lead</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredPbc.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="px-5 py-4 font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">{p.pbcNumber}</td>
                      <td className="px-4 py-4 text-xs font-semibold text-slate-700 dark:text-slate-300">{p.financialArea.replace(/_/g, ' ')}</td>
                      <td className="px-4 py-4 text-xs text-slate-900 dark:text-slate-100 font-medium max-w-xs">{p.itemDescription}</td>
                      <td className="px-4 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{p.requestedFormat}</td>
                      <td className="px-4 py-4 font-mono text-xs text-slate-700 dark:text-slate-300">{p.dueDate}</td>
                      <td className="px-4 py-4 text-xs text-slate-700 dark:text-slate-300">{p.assignedPerson} ({p.assignedTeam})</td>
                      <td className="px-4 py-4">{getStatusBadge(p.status)}</td>
                      <td className="px-4 py-4 text-right">
                        {p.status === 'ACCEPTED' ? (
                          <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold font-mono">
                            ✓ {p.fileAttachment || 'Delivered'}
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedPbcUpload(p)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            <Upload className="w-3 h-3" /> Upload
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

      {/* 2. AUDITOR QUERY RESPONSES */}
      {activeTab === 'queries' && (
        <div className="space-y-3">
          {auditResponses.map(query => (
            <div key={query.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {query.queryNumber}
                  </span>
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400">Ref: {query.pbcReference}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                  {query.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div>
                <strong className="text-slate-900 dark:text-slate-100 text-sm block">Auditor Inquiry:</strong>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{query.auditorQuery}</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <strong className="text-indigo-900 dark:text-indigo-100 block mb-1">Approved Management Response:</strong>
                <p className="text-slate-800 dark:text-slate-200">{query.cfoApprovedResponse || query.managementDraftResponse}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. AUDIT FIRM PROFILE */}
      {activeTab === 'firm' && currentAuditor && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{currentAuditor.firmName}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Principal Statutory Auditor for Artify Group SAOC</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 font-mono">
              Status: {currentAuditor.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">Engagement Leadership</span>
              <strong className="text-slate-900 dark:text-slate-100 text-sm block">{currentAuditor.leadPartner}</strong>
              <span className="text-slate-600 dark:text-slate-400 block">Manager: {currentAuditor.auditManager}</span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">Statutory Engagement Fee</span>
              <strong className="text-slate-900 dark:text-slate-100 text-sm block font-mono">OMR {currentAuditor.auditFeeAgreedOMR.toLocaleString()}</strong>
              <span className="text-slate-600 dark:text-slate-400 block">Engagement Letter: {currentAuditor.engagementLetterSignedDate}</span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">Audit Timeline</span>
              <strong className="text-slate-900 dark:text-slate-100 text-sm block">Interim: {currentAuditor.auditInterimDate}</strong>
              <span className="text-slate-600 dark:text-slate-400 block">Final Signoff: {currentAuditor.auditFinalDate}</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD EVIDENCE */}
      {selectedPbcUpload && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg">Fulfill PBC Evidence Request</h3>
              <button onClick={() => setSelectedPbcUpload(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-sm">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-mono font-bold text-slate-900">{selectedPbcUpload.pbcNumber}</span>
                <p className="text-slate-700 mt-1">{selectedPbcUpload.itemDescription}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Evidence Document Name / Reference *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FY2025_Bank_Confirmation_NBO_Signed.pdf"
                  value={simulatedFileName}
                  onChange={e => setSimulatedFileName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPbcUpload(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition cursor-pointer shadow-sm"
                >
                  Deliver Evidence Pack
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

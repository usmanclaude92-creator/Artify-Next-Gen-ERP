// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 17: COMPLIANCE, RISK & AUDIT
// 17.05 — Internal Audit View
// ==========================================

import React, { useState } from 'react';
import { useComplianceStore } from '../../services/complianceStore';
import { AuditPlanEngagement, AuditFinding, FindingSeverity, AuditProgramStep } from '../../types';
import {
  FileText,
  Calendar,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  Users,
  ChevronRight,
  ClipboardList,
  MessageSquare,
  Sparkles,
  X
} from 'lucide-react';

export const InternalAuditView: React.FC = () => {
  const {
    auditEngagements,
    auditFindings,
    auditPrograms,
    addAuditEngagement,
    addAuditFinding
  } = useComplianceStore();

  const [activeTab, setActiveTab] = useState<'engagements' | 'findings' | 'universe'>('engagements');
  const [findingSearch, setFindingSearch] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');

  // Modals
  const [isAddEngOpen, setIsAddEngOpen] = useState(false);
  const [isAddFindingOpen, setIsAddFindingOpen] = useState(false);
  const [selectedFindingDetail, setSelectedFindingDetail] = useState<AuditFinding | null>(null);

  // Form for Engagement
  const [engForm, setEngForm] = useState<Omit<AuditPlanEngagement, 'id'>>({
    auditCode: '',
    engagementTitle: '',
    auditUniverseArea: 'Procure-to-Pay & Subcontracts',
    auditType: 'OPERATIONAL',
    plannedQuarter: 'Q2 2026',
    leadAuditor: '',
    budgetDays: 25,
    actualDays: 0,
    status: 'PLANNED',
    riskWeighting: 'HIGH',
    committeeApprovalDate: new Date().toISOString().split('T')[0]
  });

  // Form for Finding
  const [findForm, setFindForm] = useState<Omit<AuditFinding, 'id'>>({
    findingCode: '',
    engagementId: auditEngagements[0]?.id || 'ENG-2026-01',
    engagementTitle: auditEngagements[0]?.engagementTitle || 'Procure-to-Pay & Subcontracts Audit',
    title: '',
    severity: 'MEDIUM',
    category: 'INTERNAL_CONTROL',
    condition: '',
    criteria: '',
    cause: '',
    consequence: '',
    recommendation: '',
    managementResponse: '',
    actionOwner: '',
    targetClosureDate: '',
    status: 'OPEN'
  });

  const filteredFindings = auditFindings.filter(f => {
    const matchesSearch =
      f.findingCode.toLowerCase().includes(findingSearch.toLowerCase()) ||
      f.title.toLowerCase().includes(findingSearch.toLowerCase()) ||
      f.actionOwner.toLowerCase().includes(findingSearch.toLowerCase());
    const matchesSev = selectedSeverity === 'ALL' || f.severity === selectedSeverity;
    return matchesSearch && matchesSev;
  });

  const getSeverityBadge = (sev: FindingSeverity) => {
    switch (sev) {
      case 'HIGH':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-500/40">High Risk</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-500/40">Medium</span>;
      case 'LOW':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-500/40">Low</span>;
      case 'INFORMATIONAL':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600">Info</span>;
    }
  };

  const handleAddEngSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!engForm.auditCode || !engForm.engagementTitle || !engForm.leadAuditor) return;
    addAuditEngagement(engForm);
    setIsAddEngOpen(false);
  };

  const handleAddFindingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!findForm.findingCode || !findForm.title || !findForm.actionOwner) return;
    addAuditFinding(findForm);
    setIsAddFindingOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Submodule Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              17.05
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Internal Audit Planning & Findings Register</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Risk-based annual audit plan, fieldwork workpapers, 5C structured audit findings (Condition, Criteria, Cause, Consequence, Corrective Action).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'engagements' && (
            <button
              onClick={() => setIsAddEngOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create Audit Engagement
            </button>
          )}
          {activeTab === 'findings' && (
            <button
              onClick={() => setIsAddFindingOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" /> Raise Formal Finding
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('engagements')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'engagements'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-t-xl'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" /> Audit Plan Engagements ({auditEngagements.length})
        </button>
        <button
          onClick={() => setActiveTab('findings')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'findings'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-t-xl'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <AlertOctagon className="w-4 h-4" /> 5C Findings Register ({auditFindings.length})
        </button>
        <button
          onClick={() => setActiveTab('universe')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'universe'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-t-xl'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <ClipboardList className="w-4 h-4" /> Fieldwork Workpapers ({auditPrograms.length})
        </button>
      </div>

      {/* 1. ENGAGEMENTS TAB */}
      {activeTab === 'engagements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {auditEngagements.map(eng => (
            <div key={eng.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {eng.auditCode}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-semibold">
                    {eng.auditType}
                  </span>
                </div>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    eng.status === 'REPORT_ISSUED'
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                      : eng.status === 'IN_PROGRESS'
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30'
                      : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30'
                  }`}
                >
                  {eng.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{eng.engagementTitle}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Universe: {eng.auditUniverseArea}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Planned Quarter</span>
                  <strong className="text-slate-700 dark:text-slate-300">{eng.plannedQuarter}</strong>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Lead Auditor</span>
                  <strong className="text-slate-700 dark:text-slate-300 truncate block">{eng.leadAuditor}</strong>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Days Budget</span>
                  <strong className="text-slate-700 dark:text-slate-300">{eng.actualDays}/{eng.budgetDays} Days</strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Audit Committee Approved ({eng.committeeApprovalDate})</span>
                </div>
                <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">Weight: {eng.riskWeighting}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. FINDINGS REGISTER (5C Structured) */}
      {activeTab === 'findings' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Search finding code, title, action owner..."
                value={findingSearch}
                onChange={e => setFindingSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <select
                value={selectedSeverity}
                onChange={e => setSelectedSeverity(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Severities</option>
                <option value="HIGH">High Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="LOW">Low Risk</option>
                <option value="INFORMATIONAL">Informational</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredFindings.map(f => (
              <div
                key={f.id}
                onClick={() => setSelectedFindingDetail(f)}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500 transition cursor-pointer space-y-3"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {f.findingCode}
                    </span>
                    {getSeverityBadge(f.severity)}
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">[{f.engagementTitle}]</span>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold self-start md:self-auto ${
                      f.status === 'VERIFIED_CLOSED'
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                        : f.status === 'UNDER_REMEDIATION'
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30'
                        : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30'
                    }`}
                  >
                    {f.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">{f.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  <strong className="text-slate-800 dark:text-slate-200">Condition:</strong> {f.condition}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-4">
                    <span>Owner: <strong className="text-slate-700 dark:text-slate-300">{f.actionOwner}</strong></span>
                    <span>Target Date: <strong className="text-slate-700 dark:text-slate-300">{f.targetClosureDate}</strong></span>
                  </div>
                  <span className="text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
                    View 5C Workpaper <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. FIELDWORK WORKPAPERS */}
      {activeTab === 'universe' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Active Fieldwork Audit Programs</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Sampling methodologies and procedure checklists.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Step #</th>
                  <th className="px-4 py-3">Objective & Procedure</th>
                  <th className="px-4 py-3">Sampling Method</th>
                  <th className="px-4 py-3">Sample Size</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Findings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {auditPrograms.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="px-5 py-4 font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">{p.stepNumber}</td>
                    <td className="px-4 py-4 text-xs space-y-0.5">
                      <strong className="text-slate-900 dark:text-slate-100 block">{p.objective}</strong>
                      <span className="text-slate-500 dark:text-slate-400">{p.procedureDescription}</span>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-slate-600 dark:text-slate-400">{p.samplingMethod}</td>
                    <td className="px-4 py-4 font-mono text-xs text-slate-900 dark:text-slate-100">{p.sampleSize} Items</td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          p.status === 'COMPLETED'
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                            : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs font-bold text-rose-700 dark:text-rose-300">
                      {p.findingsCount > 0 ? `${p.findingsCount} Raised` : '0 None'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD ENGAGEMENT */}
      {isAddEngOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg">Create Audit Engagement</h3>
              <button onClick={() => setIsAddEngOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEngSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Audit Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AUD-2026-03"
                    value={engForm.auditCode}
                    onChange={e => setEngForm({ ...engForm, auditCode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Planned Quarter</label>
                  <select
                    value={engForm.plannedQuarter}
                    onChange={e => setEngForm({ ...engForm, plannedQuarter: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="Q1 2026">Q1 2026</option>
                    <option value="Q2 2026">Q2 2026</option>
                    <option value="Q3 2026">Q3 2026</option>
                    <option value="Q4 2026">Q4 2026</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Engagement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fixed Assets & Capex Capitalization Audit"
                  value={engForm.engagementTitle}
                  onChange={e => setEngForm({ ...engForm, engagementTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Audit Lead *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nasser Al-Harthy"
                    value={engForm.leadAuditor}
                    onChange={e => setEngForm({ ...engForm, leadAuditor: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Budget Days</label>
                  <input
                    type="number"
                    value={engForm.budgetDays}
                    onChange={e => setEngForm({ ...engForm, budgetDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEngOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition cursor-pointer shadow-sm"
                >
                  Save Engagement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD FINDING */}
      {isAddFindingOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg">Raise Formal 5C Audit Finding</h3>
              <button onClick={() => setIsAddFindingOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFindingSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Finding Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AUD-2026-F03"
                    value={findForm.findingCode}
                    onChange={e => setFindForm({ ...findForm, findingCode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Severity</label>
                  <select
                    value={findForm.severity}
                    onChange={e => setFindForm({ ...findForm, severity: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="HIGH">High Risk</option>
                    <option value="MEDIUM">Medium Risk</option>
                    <option value="LOW">Low Risk</option>
                    <option value="INFORMATIONAL">Informational</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Finding Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Missing Purchase Order 3-Way Matching for Subcontractor Invoices"
                  value={findForm.title}
                  onChange={e => setFindForm({ ...findForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Condition (What was found)</label>
                <textarea
                  rows={2}
                  value={findForm.condition}
                  onChange={e => setFindForm({ ...findForm, condition: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Criteria (Policy / Rule)</label>
                <input
                  type="text"
                  value={findForm.criteria}
                  onChange={e => setFindForm({ ...findForm, criteria: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cause (Root cause)</label>
                <input
                  type="text"
                  value={findForm.cause}
                  onChange={e => setFindForm({ ...findForm, cause: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Consequence (Risk / Financial Impact)</label>
                <input
                  type="text"
                  value={findForm.consequence}
                  onChange={e => setFindForm({ ...findForm, consequence: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Auditor Recommendation</label>
                <textarea
                  rows={2}
                  value={findForm.recommendation}
                  onChange={e => setFindForm({ ...findForm, recommendation: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Action Owner *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Procurement Lead"
                    value={findForm.actionOwner}
                    onChange={e => setFindForm({ ...findForm, actionOwner: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Agreed Target Date</label>
                  <input
                    type="date"
                    required
                    value={findForm.targetClosureDate}
                    onChange={e => setFindForm({ ...findForm, targetClosureDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddFindingOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition cursor-pointer shadow-sm"
                >
                  Issue Formal Finding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: 5C DETAIL VIEW */}
      {selectedFindingDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm bg-slate-100 px-2 py-0.5 rounded">
                  {selectedFindingDetail.findingCode}
                </span>
                {getSeverityBadge(selectedFindingDetail.severity)}
              </div>
              <button onClick={() => setSelectedFindingDetail(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="font-bold text-slate-900 text-lg">{selectedFindingDetail.title}</h3>

            {/* 5C Structure Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold uppercase text-slate-500 block mb-1">1. Condition (What was observed)</span>
                <p className="text-slate-800">{selectedFindingDetail.condition}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold uppercase text-slate-500 block mb-1">2. Criteria (What should be)</span>
                <p className="text-slate-800">{selectedFindingDetail.criteria}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold uppercase text-slate-500 block mb-1">3. Cause (Root cause analysis)</span>
                <p className="text-slate-800">{selectedFindingDetail.cause}</p>
              </div>

              <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                <span className="font-bold uppercase text-rose-700 block mb-1">4. Consequence (Financial / Operational exposure)</span>
                <p className="text-rose-900">{selectedFindingDetail.consequence}</p>
              </div>

              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <span className="font-bold uppercase text-emerald-700 block mb-1">5. Corrective Recommendation</span>
                <p className="text-emerald-900">{selectedFindingDetail.recommendation}</p>
              </div>

              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-1">
                <span className="font-bold uppercase text-indigo-700 block mb-1">Management Response & CAPA Commitment</span>
                <p className="text-indigo-950 font-medium">{selectedFindingDetail.managementResponse}</p>
                <div className="pt-2 text-[11px] flex justify-between text-indigo-800 font-mono">
                  <span>Action Lead: {selectedFindingDetail.actionOwner}</span>
                  <span>Target Date: {selectedFindingDetail.targetClosureDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedFindingDetail(null)}
                className="px-5 py-2 text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                Close Workpaper
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 17: COMPLIANCE, RISK & AUDIT
// 17.01 — Regulatory Compliance View
// ==========================================

import React, { useState } from 'react';
import { useComplianceStore } from '../../services/complianceStore';
import { RegulatoryRequirement, ComplianceCalendarEvent, ComplianceStatus } from '../../types';
import {
  Award,
  Calendar,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  Clock,
  Building,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  FileText,
  ChevronRight,
  TrendingUp,
  X,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const RegulatoryComplianceView: React.FC = () => {
  const {
    regulatoryRequirements,
    calendarEvents,
    scorecards,
    addRegulatoryRequirement,
    updateRegulatoryRequirement,
    addCalendarEvent,
    updateCalendarEvent
  } = useComplianceStore();

  const [activeTab, setActiveTab] = useState<'requirements' | 'calendar' | 'scorecards'>('requirements');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modal states
  const [isAddReqOpen, setIsAddReqOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [selectedReqDetail, setSelectedReqDetail] = useState<RegulatoryRequirement | null>(null);

  // Form states for adding Requirement
  const [reqForm, setReqForm] = useState<Omit<RegulatoryRequirement, 'id'>>({
    code: '',
    authority: 'Ministry of Commerce, Industry & Investment Promotion (MOCIIP)',
    jurisdiction: 'Sultanate of Oman',
    title: '',
    category: 'COMMERCIAL_COMPANIES',
    description: '',
    complianceLead: '',
    department: 'Corporate Governance',
    penaltyClause: '',
    frequency: 'ANNUAL',
    status: 'COMPLIANT',
    lastReviewDate: new Date().toISOString().split('T')[0],
    nextReviewDate: '',
    complianceScore: 100,
    evidenceDocuments: []
  });

  // Form state for Calendar Event
  const [calForm, setCalForm] = useState<Omit<ComplianceCalendarEvent, 'id'>>({
    title: '',
    category: 'Regulatory Filing',
    authority: 'Oman Tax Authority',
    dueDate: '',
    status: 'PENDING',
    assignedTo: '',
    reminderDaysBefore: 15,
    statutoryReference: '',
    estimatedEffortHours: 10
  });

  // Filtered requirements
  const filteredRequirements = regulatoryRequirements.filter(req => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.authority.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.complianceLead.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || req.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || req.status === selectedStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const getStatusBadge = (status: ComplianceStatus) => {
    switch (status) {
      case 'COMPLIANT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Compliant
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
            <Clock className="w-3.5 h-3.5" /> Under Review
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-500/30">
            <AlertTriangle className="w-3.5 h-3.5" /> Warning
          </span>
        );
      case 'NON_COMPLIANT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30">
            <AlertOctagon className="w-3.5 h-3.5" /> Non-Compliant
          </span>
        );
      default:
        return null;
    }
  };

  const handleAddReqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqForm.code || !reqForm.title || !reqForm.complianceLead) return;
    addRegulatoryRequirement(reqForm);
    setIsAddReqOpen(false);
    setReqForm({
      code: '',
      authority: 'Ministry of Commerce, Industry & Investment Promotion (MOCIIP)',
      jurisdiction: 'Sultanate of Oman',
      title: '',
      category: 'COMMERCIAL_COMPANIES',
      description: '',
      complianceLead: '',
      department: 'Corporate Governance',
      penaltyClause: '',
      frequency: 'ANNUAL',
      status: 'COMPLIANT',
      lastReviewDate: new Date().toISOString().split('T')[0],
      nextReviewDate: '',
      complianceScore: 100,
      evidenceDocuments: ['Compliance_Cert_2026.pdf']
    });
  };

  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calForm.title || !calForm.dueDate || !calForm.assignedTo) return;
    addCalendarEvent(calForm);
    setIsAddEventOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Submodule Header & Quick Metric Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              17.01
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Regulatory Compliance & Statutory Mandates</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tracking Royal Decrees, Ministerial Directives, Omanisation quotas, environmental clearances, and statutory filing deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'requirements' && (
            <button
              onClick={() => setIsAddReqOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Legal Requirement
            </button>
          )}
          {activeTab === 'calendar' && (
            <button
              onClick={() => setIsAddEventOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Calendar Filing
            </button>
          )}
        </div>
      </div>

      {/* Top 3 Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('requirements')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'requirements'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-t-xl'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Award className="w-4 h-4" /> Regulatory Obligations ({regulatoryRequirements.length})
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'calendar'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-t-xl'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" /> Compliance Calendar ({calendarEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('scorecards')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'scorecards'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-t-xl'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Department Scorecards ({scorecards.length})
        </button>
      </div>

      {/* TAB 1: REQUIREMENTS TABLE */}
      {activeTab === 'requirements' && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Search obligation by code, decree title, authority, lead..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Categories</option>
                <option value="COMMERCIAL_COMPANIES">Commercial Companies Law</option>
                <option value="LABOUR_LAW">Labour & Social Protection</option>
                <option value="ENVIRONMENTAL">Environmental & HSE</option>
                <option value="FINANCIAL_CRIME">Anti-Money Laundering / Tax</option>
              </select>
            </div>
            <div>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="COMPLIANT">Compliant</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="WARNING">Warning</option>
                <option value="NON_COMPLIANT">Non-Compliant</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Requirement & Code</th>
                    <th className="px-4 py-3">Statutory Authority</th>
                    <th className="px-4 py-3">Department & Lead</th>
                    <th className="px-4 py-3">Next Review</th>
                    <th className="px-4 py-3 text-center">Adherence</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredRequirements.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 mt-0.5">
                            {req.code}
                          </span>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{req.title}</p>
                            <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                              {req.category.toLowerCase().replace(/_/g, ' ')} • {req.frequency}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200 block truncate max-w-xs" title={req.authority}>
                          {req.authority}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{req.jurisdiction}</span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-xs font-medium text-slate-900 dark:text-slate-100">{req.complianceLead}</p>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{req.department}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-mono text-xs text-slate-700 dark:text-slate-300 font-medium">{req.nextReviewDate}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <div className="w-16 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                req.complianceScore >= 90
                                  ? 'bg-emerald-500'
                                  : req.complianceScore >= 75
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${req.complianceScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                            {req.complianceScore}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">{getStatusBadge(req.status)}</td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => setSelectedReqDetail(req)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredRequirements.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400">
                        No regulatory requirements match the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPLIANCE CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {calendarEvents.map(event => {
              const isOverdue = new Date(event.dueDate) < new Date() && event.status === 'PENDING';
              return (
                <div
                  key={event.id}
                  className={`p-5 rounded-2xl border transition bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between ${
                    isOverdue ? 'border-rose-300 dark:border-rose-500/40 ring-2 ring-rose-100 dark:ring-rose-500/20' : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {event.category}
                      </span>
                      {event.status === 'SUBMITTED' || event.status === 'APPROVED' ? (
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Submitted
                        </span>
                      ) : isOverdue ? (
                        <span className="text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-500/30 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Overdue
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-500/30 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Due Soon
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug">{event.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> {event.authority}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono italic">
                      Ref: {event.statutoryReference}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Due Date</span>
                      <strong className="text-xs font-mono text-slate-800 dark:text-slate-200">{event.dueDate}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Assigned Lead</span>
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{event.assignedTo}</span>
                    </div>
                    {event.status === 'PENDING' && (
                      <button
                        onClick={() =>
                          updateCalendarEvent(event.id, {
                            status: 'SUBMITTED',
                            actualSubmissionDate: new Date().toISOString().split('T')[0],
                            filingReferenceNo: `ACK-${Date.now().toString().slice(-5)}`
                          })
                        }
                        className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition cursor-pointer"
                      >
                        Mark Done
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DEPARTMENT SCORECARDS */}
      {activeTab === 'scorecards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scorecards.map((sc, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{sc.department}</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Compliance Owner: {sc.leadOwner}</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
                    {sc.healthPercentage}%
                  </span>
                  <span className="block text-[10px] uppercase text-emerald-600 dark:text-emerald-400 font-bold">Health Score</span>
                </div>
              </div>

              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${sc.healthPercentage}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">Compliant</span>
                  <strong className="text-sm font-mono text-emerald-900 dark:text-emerald-100">{sc.compliantCount}</strong>
                </div>
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
                  <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block">Warning</span>
                  <strong className="text-sm font-mono text-amber-900 dark:text-amber-100">{sc.warningCount}</strong>
                </div>
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20">
                  <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 block">Breaches</span>
                  <strong className="text-sm font-mono text-rose-900 dark:text-rose-100">{sc.breachCount}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Total Statutory Obligations: {sc.totalRequirements}</span>
                <span>Last Monitored: {sc.lastAuditDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL DRAWER / MODAL */}
      {selectedReqDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-800">
                  {selectedReqDetail.code}
                </span>
                <h3 className="font-bold text-slate-900 text-lg">{selectedReqDetail.title}</h3>
              </div>
              <button
                onClick={() => setSelectedReqDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <strong className="text-xs uppercase font-bold text-slate-400 block mb-1">Statutory Authority & Law</strong>
                <p className="text-slate-800 font-medium">{selectedReqDetail.authority} ({selectedReqDetail.jurisdiction})</p>
              </div>

              <div>
                <strong className="text-xs uppercase font-bold text-slate-400 block mb-1">Mandate Description</strong>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedReqDetail.description}
                </p>
              </div>

              <div>
                <strong className="text-xs uppercase font-bold text-rose-500 block mb-1">Non-Compliance Penalty Clause</strong>
                <p className="text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-100 text-xs font-medium">
                  {selectedReqDetail.penaltyClause}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong className="text-xs uppercase font-bold text-slate-400 block mb-1">Assigned Lead</strong>
                  <p className="text-slate-800">{selectedReqDetail.complianceLead} ({selectedReqDetail.department})</p>
                </div>
                <div>
                  <strong className="text-xs uppercase font-bold text-slate-400 block mb-1">Current Status</strong>
                  <div>{getStatusBadge(selectedReqDetail.status)}</div>
                </div>
              </div>

              <div>
                <strong className="text-xs uppercase font-bold text-slate-400 block mb-2">Attached Statutory Evidence</strong>
                <div className="space-y-1.5">
                  {selectedReqDetail.evidenceDocuments.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <span className="font-mono text-slate-700 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-slate-400" /> {doc}
                      </span>
                      <span className="text-emerald-600 font-semibold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Validated
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedReqDetail(null)}
                className="px-5 py-2 text-sm font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD REQUIREMENT */}
      {isAddReqOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg">Add Statutory Obligation</h3>
              <button onClick={() => setIsAddReqOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReqSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Requirement Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MOCIIP-GOV-05"
                    value={reqForm.code}
                    onChange={e => setReqForm({ ...reqForm, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={reqForm.category}
                    onChange={e => setReqForm({ ...reqForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="COMMERCIAL_COMPANIES">Commercial Companies Law</option>
                    <option value="LABOUR_LAW">Labour & Social Insurance</option>
                    <option value="ENVIRONMENTAL">Environmental & HSE</option>
                    <option value="FINANCIAL_CRIME">Anti-Money Laundering / Tax</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Obligation Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Anti-Money Laundering (AML) Compliance Certification"
                  value={reqForm.title}
                  onChange={e => setReqForm({ ...reqForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Statutory Authority</label>
                <input
                  type="text"
                  required
                  value={reqForm.authority}
                  onChange={e => setReqForm({ ...reqForm, authority: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description & Scope</label>
                <textarea
                  rows={3}
                  value={reqForm.description}
                  onChange={e => setReqForm({ ...reqForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  placeholder="Detailed compliance requirement obligations..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Compliance Lead *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Salim Al-Busaidi"
                    value={reqForm.complianceLead}
                    onChange={e => setReqForm({ ...reqForm, complianceLead: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={reqForm.department}
                    onChange={e => setReqForm({ ...reqForm, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Penalty Clause for Non-Compliance</label>
                <input
                  type="text"
                  placeholder="e.g. Fine up to OMR 10,000 and business license freeze"
                  value={reqForm.penaltyClause}
                  onChange={e => setReqForm({ ...reqForm, penaltyClause: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Next Review Date</label>
                  <input
                    type="date"
                    required
                    value={reqForm.nextReviewDate}
                    onChange={e => setReqForm({ ...reqForm, nextReviewDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Review Frequency</label>
                  <select
                    value={reqForm.frequency}
                    onChange={e => setReqForm({ ...reqForm, frequency: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="ANNUAL">Annual</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="CONTINUOUS">Continuous</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddReqOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition cursor-pointer shadow-sm"
                >
                  Save Obligation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CALENDAR EVENT */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg">Add Statutory Filing Deadline</h3>
              <button onClick={() => setIsAddEventOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEventSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Filing Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q2 Corporate Tax Provisional Filing"
                  value={calForm.title}
                  onChange={e => setCalForm({ ...calForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Authority</label>
                <input
                  type="text"
                  required
                  value={calForm.authority}
                  onChange={e => setCalForm({ ...calForm, authority: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={calForm.dueDate}
                    onChange={e => setCalForm({ ...calForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Al-Lawati"
                    value={calForm.assignedTo}
                    onChange={e => setCalForm({ ...calForm, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Statutory Law Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Article 48, Income Tax Law"
                  value={calForm.statutoryReference}
                  onChange={e => setCalForm({ ...calForm, statutoryReference: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition cursor-pointer shadow-sm"
                >
                  Add to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

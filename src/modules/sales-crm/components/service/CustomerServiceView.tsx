import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  Plus,
  Wrench,
  Smile,
  BarChart3,
  TrendingUp,
  ShieldAlert,
  ThumbsUp,
  FileCheck
} from 'lucide-react';
import { useSalesCrm } from '../../services/salesCrmStore';
import { CustomerComplaint, ComplaintStatus, ComplaintUrgency } from '../../types';
import { ERPUserRole } from '../../../../types/erp';

interface CustomerServiceViewProps {
  activeTransactionId?: string;
  onNavigate?: (route: any) => void;
  activeRole: ERPUserRole;
}

export const CustomerServiceView: React.FC<CustomerServiceViewProps> = ({
  activeTransactionId,
  onNavigate,
  activeRole
}) => {
  const { complaints, resolveComplaint, addComplaint, customers, stats } = useSalesCrm();

  const [activeTab, setActiveTab] = useState<'all' | 'complaints' | 'service' | 'followup' | 'analytics'>(
    activeTransactionId === 'tx-cust-complaints'
      ? 'complaints'
      : activeTransactionId === 'tx-service-requests'
      ? 'service'
      : activeTransactionId === 'tx-cust-followup'
      ? 'followup'
      : activeTransactionId === 'tx-crm-analytics'
      ? 'analytics'
      : 'all'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  // New ticket state
  const [ticketCustomer, setTicketCustomer] = useState(customers[0]?.id || '');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<CustomerComplaint['category']>('Technical / Product Defect');
  const [ticketUrgency, setTicketUrgency] = useState<ComplaintUrgency>('High');
  const [ticketDesc, setTicketDesc] = useState('');

  const [resolveActionText, setResolveActionText] = useState('');
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketCustomer) return;

    const cust = customers.find((c) => c.id === ticketCustomer);

    addComplaint({
      customerId: ticketCustomer,
      customerName: cust?.legalName || 'Client',
      contactPerson: 'Lead Plant Engineer',
      contactPhone: '+968 2400 0000',
      category: ticketCategory,
      urgency: ticketUrgency,
      status: 'Open',
      subject: ticketSubject,
      description: ticketDesc,
      assignedEngineer: 'Eng. Hamed Al-Riyami (Field Technical Lead)',
      targetResolutionDate: '2026-08-30'
    });

    setShowNewTicketModal(false);
    setTicketSubject('');
    setTicketDesc('');
  };

  const handleConfirmResolve = (id: string) => {
    if (!resolveActionText) return;
    resolveComplaint(id, resolveActionText);
    setResolvingId(null);
    setResolveActionText('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                Functional Area 06.08
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Post-Sales Support, Field Service & CRM Analytics</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Customer Complaints, Field Service & CSAT Analytics
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Service level agreement (SLA) response governance, field engineering dispatch, customer satisfaction surveys, and commercial KPIs.
            </p>
          </div>

          <button
            onClick={() => setShowNewTicketModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium shadow-md shadow-rose-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Raise Support Ticket
          </button>
        </div>

        {/* Process Tabs */}
        <div className="flex flex-wrap gap-2 border-t border-slate-200 dark:border-slate-800 pt-4 mt-5">
          {[
            { id: 'all', label: 'All Customer Care' },
            { id: 'complaints', label: '06.08.01 Complaints & SLA Tickets', code: 'tx-cust-complaints' },
            { id: 'service', label: '06.08.02 Field Service Requests', code: 'tx-service-requests' },
            { id: 'followup', label: '06.08.03 CSAT & NPS Follow-up', code: 'tx-cust-followup' },
            { id: 'analytics', label: '06.08.04 CRM Commercial Analytics', code: 'tx-crm-analytics' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Open SLA Tickets</div>
          <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            {complaints.filter((c) => c.status !== 'Resolved').length} Active
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Average SLA: 24h</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Customer CSAT Index</div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {stats.customerSatisfactionIndex}%
          </div>
          <div className="text-[11px] text-emerald-500 dark:text-emerald-400 mt-0.5">94% Positive Feedback</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Net Promoter Score</div>
          <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            +68 NPS
          </div>
          <div className="text-[11px] text-purple-500 dark:text-purple-400 mt-0.5">Top-quartile in Oman EPC</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">First-Contact Resolution</div>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            89.4%
          </div>
          <div className="text-[11px] text-blue-500 dark:text-blue-400 mt-0.5">Field tech response</div>
        </div>
      </div>

      {/* 1. COMPLAINTS & TICKETS LIST */}
      {(activeTab === 'all' || activeTab === 'complaints') && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              06.08.01 Incident & Complaint SLA Tracker
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">{complaints.length} Tickets Registered</span>
          </div>

          <div className="p-4 space-y-3">
            {filteredComplaints.map((comp) => {
              const isResolved = comp.status === 'Resolved';

              return (
                <div
                  key={comp.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isResolved
                      ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                      : 'bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-900/60 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
                          {comp.ticketNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            comp.urgency === 'Critical / Emergency' || comp.urgency === 'High'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {comp.urgency}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {comp.category}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {comp.subject}
                      </h4>

                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {comp.customerName}
                        </span>
                        <span>• Contact: {comp.contactPerson} ({comp.contactPhone})</span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        {comp.description}
                      </p>

                      {comp.resolutionNotes && (
                        <div className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 mt-2">
                          <span className="font-bold">Resolution Recorded:</span> {comp.resolutionNotes}
                        </div>
                      )}
                    </div>

                    <div className="text-right shrink-0 space-y-2">
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Target: <span className="font-bold text-slate-900 dark:text-white">{comp.targetResolutionDate}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400">Assigned: {comp.assignedEngineer}</div>

                      {!isResolved ? (
                        <div>
                          {resolvingId === comp.id ? (
                            <div className="space-y-2 text-left mt-2">
                              <textarea
                                rows={2}
                                value={resolveActionText}
                                onChange={(e) => setResolveActionText(e.target.value)}
                                placeholder="State corrective action taken..."
                                className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
                              ></textarea>
                              <div className="flex justify-end gap-1">
                                <button
                                  onClick={() => setResolvingId(null)}
                                  className="px-2 py-1 text-xs text-slate-500 dark:text-slate-400"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleConfirmResolve(comp.id)}
                                  className="px-3 py-1 rounded bg-emerald-600 text-white text-xs font-bold"
                                >
                                  Confirm Resolution
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setResolvingId(comp.id)}
                              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-xs cursor-pointer"
                            >
                              Resolve Ticket
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. FIELD SERVICE & CSAT ANALYTICS */}
      {(activeTab === 'all' || activeTab === 'analytics' || activeTab === 'followup') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                06.08.03 CSAT Feedback Survey Summary
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Post-commissioning and delivery satisfaction survey ratings</p>

            <div className="space-y-2.5 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs flex justify-between items-center">
                <span>Product Quality & Specification Compliance</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">4.9 / 5.0 ★</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs flex justify-between items-center">
                <span>On-Time Delivery to PDO Marmul & Nimr Sites</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">4.7 / 5.0 ★</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs flex justify-between items-center">
                <span>Field Engineer Commissioning & Technical Support</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">4.9 / 5.0 ★</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                06.08.04 Commercial Win/Loss & Sales Cycle
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Executive metrics across Sultanate energy & infrastructure accounts</p>

            <div className="space-y-2.5 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs flex justify-between items-center">
                <span>Average Deal Sales Cycle Duration</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">48 Days (Inquiry to PO)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs flex justify-between items-center">
                <span>Primary Reason for Won Deals</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">Local Assembly & ICV 100% Score</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs flex justify-between items-center">
                <span>Customer Retention / Repeat Order Rate</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">92.3%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Raise Support Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  06.08.01 Raise Service / SLA Ticket
                </h3>
              </div>
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Customer Account *
                </label>
                <select
                  value={ticketCustomer}
                  onChange={(e) => setTicketCustomer(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.legalName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Ticket Subject / Issue Summary *
                </label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. VSD control panel error code 04 on startup"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Issue Category
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    <option value="Technical / Product Defect">Technical / Defect</option>
                    <option value="Delivery Delay">Delivery Delay</option>
                    <option value="Billing / Invoice Dispute">Billing / Invoice Dispute</option>
                    <option value="Documentation / Mill Test Certificate">Documentation / MTR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    SLA Urgency Level
                  </label>
                  <select
                    value={ticketUrgency}
                    onChange={(e) => setTicketUrgency(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    <option value="Critical / Emergency">Critical / Emergency (&lt; 4h)</option>
                    <option value="High">High (&lt; 24h)</option>
                    <option value="Medium">Medium (48h)</option>
                    <option value="Low">Low (5 Days)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Detailed Fault Description & Serial No
                </label>
                <textarea
                  rows={3}
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  placeholder="Provide equipment serial number, location, error logs..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium shadow-md cursor-pointer"
                >
                  Submit Support Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

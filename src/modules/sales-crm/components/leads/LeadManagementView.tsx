import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Building2,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Award,
  ChevronDown,
  ExternalLink,
  Plus,
  RefreshCw
} from 'lucide-react';
import { useSalesCrm } from '../../services/salesCrmStore';
import { Lead, LeadSource, LeadStatus, LeadRating } from '../../types';
import { ERPUserRole } from '../../../../types/erp';

interface LeadManagementViewProps {
  activeTransactionId?: string;
  onNavigate?: (route: any) => void;
  activeRole: ERPUserRole;
}

export const LeadManagementView: React.FC<LeadManagementViewProps> = ({
  activeTransactionId,
  onNavigate,
  activeRole
}) => {
  const { leads, addLead, updateLead, convertLead, scoreLeadAI } = useSalesCrm();

  const [activeTab, setActiveTab] = useState<'all' | 'capture' | 'qualification' | 'assignment' | 'conversion'>(
    activeTransactionId === 'tx-lead-capture'
      ? 'capture'
      : activeTransactionId === 'tx-lead-qual'
      ? 'qualification'
      : activeTransactionId === 'tx-lead-assign'
      ? 'assignment'
      : activeTransactionId === 'tx-lead-conversion'
      ? 'conversion'
      : 'all'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Modal / Form state for Capture Lead
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newIndustry, setNewIndustry] = useState<Lead['industry']>('Oil & Gas');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState('Muscat');
  const [newSource, setNewSource] = useState<LeadSource>('Website / Inbound');
  const [newEstimatedValue, setNewEstimatedValue] = useState(150000);
  const [newNotes, setNewNotes] = useState('');
  const [assignedRepName, setAssignedRepName] = useState('Eng. Tariq Al-Habsi');

  // Conversion Success Notification
  const [conversionSuccessMsg, setConversionSuccessMsg] = useState<string | null>(null);

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.leadCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === 'ALL' || l.industry === selectedIndustry;
    const matchesStatus = selectedStatus === 'ALL' || l.status === selectedStatus;
    return matchesSearch && matchesIndustry && matchesStatus;
  });

  const handleCaptureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newCompany || !newEmail) return;

    addLead({
      fullName: newFullName,
      jobTitle: newJobTitle || 'Procurement Manager',
      companyName: newCompany,
      industry: newIndustry,
      email: newEmail,
      phone: newPhone || '+968 2400 0000',
      country: 'Sultanate of Oman',
      city: newCity,
      source: newSource,
      status: 'BANT Qualified',
      rating: 'Hot (High Intent)',
      assignedRepId: 'usr-rep-01',
      assignedRepName,
      estimatedDealValueOMR: Number(newEstimatedValue),
      bant: {
        budgetOMR: Number(newEstimatedValue),
        budgetStatus: 'Estimated',
        authorityRole: 'Decision Maker',
        needUrgency: 'Critical (< 30 days)',
        timelineDate: '2026-10-31',
        bantScore: 85
      },
      notes: newNotes || 'Inbound prospect inquiry recorded in Artify ERP.'
    });

    setShowCaptureModal(false);
    // Reset form
    setNewFullName('');
    setNewJobTitle('');
    setNewCompany('');
    setNewEmail('');
    setNewPhone('');
    setNewNotes('');
  };

  const handleConvertLeadClick = (lead: Lead) => {
    const result = convertLead(lead.id);
    setConversionSuccessMsg(
      `Successfully converted ${lead.fullName} (${lead.companyName}) into Customer "${result.customer.legalName}" (${result.customer.customerCode}) and Opportunity "${result.opportunity.title}" (${result.opportunity.opportunityCode})!`
    );
    setTimeout(() => setConversionSuccessMsg(null), 7000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                Functional Area 06.01
              </span>
              <span className="text-xs text-slate-500">Lead Pipeline & Qualification</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Lead Management & Qualification Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Omnichannel prospect capture, BANT qualification scoring, sales rep routing, and instant 1-click Opportunity conversion.
            </p>
          </div>

          <button
            onClick={() => setShowCaptureModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Capture New Lead
          </button>
        </div>

        {/* Process Tabs */}
        <div className="flex flex-wrap gap-2 border-t border-slate-200 dark:border-slate-800 pt-4 mt-5">
          {[
            { id: 'all', label: 'All Leads', code: '06.01' },
            { id: 'capture', label: '06.01.01 Lead Capture', code: 'tx-lead-capture' },
            { id: 'qualification', label: '06.01.02 BANT Qualification', code: 'tx-lead-qual' },
            { id: 'assignment', label: '06.01.03 Rep Assignment', code: 'tx-lead-assign' },
            { id: 'conversion', label: '06.01.04 Opportunity Conversion', code: 'tx-lead-conversion' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversion Banner Alert */}
      {conversionSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm flex items-start gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">{conversionSuccessMsg}</div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by contact name, company, code..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="ALL">All Industries</option>
          <option value="Oil & Gas">Oil & Gas</option>
          <option value="Logistics & Ports">Logistics & Ports</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Telecom & IT">Telecom & IT</option>
          <option value="Construction & Infra">Construction & Infra</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="BANT Qualified">BANT Qualified</option>
          <option value="Contacted">Contacted</option>
          <option value="New / Unassigned">New / Unassigned</option>
          <option value="Converted">Converted</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Lead Code / Prospect</th>
                <th className="px-4 py-3">Industry & Source</th>
                <th className="px-4 py-3 text-right">Est. Deal Value</th>
                <th className="px-4 py-3 text-center">BANT Score</th>
                <th className="px-4 py-3">Assigned Rep</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{lead.fullName}</span>
                      <span className="text-[11px] font-normal text-slate-400">({lead.jobTitle})</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">{lead.companyName}</span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span>{lead.leadCode}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">{lead.industry}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{lead.source}</div>
                  </td>
                  <td className="px-4 py-3.5 text-right font-bold text-slate-900 dark:text-white">
                    OMR {lead.estimatedDealValueOMR.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        lead.bant.bantScore >= 85
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : lead.bant.bantScore >= 70
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {lead.bant.bantScore}/100
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-700 dark:text-slate-300">
                    <div className="font-medium">{lead.assignedRepName}</div>
                    <div className="text-[10px] text-slate-400">{lead.city}, Oman</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
                        lead.status === 'Converted'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : lead.status === 'BANT Qualified'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                    {lead.status !== 'Converted' ? (
                      <button
                        onClick={() => handleConvertLeadClick(lead)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                        title="Convert to Customer & Opportunity"
                      >
                        Convert <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                        ✓ Converted
                      </span>
                    )}

                    <button
                      onClick={() => {
                        scoreLeadAI(lead.id);
                        setSelectedLead(lead);
                      }}
                      className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 text-xs cursor-pointer"
                      title="AI Score & Insights"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Capture Lead Modal Form */}
      {showCaptureModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    06.01.01 Lead Capture Intake
                  </h3>
                  <p className="text-xs text-slate-500">Record incoming prospect inquiry into ERP database</p>
                </div>
              </div>
              <button
                onClick={() => setShowCaptureModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCaptureSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Contact Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    placeholder="e.g. Eng. Khalid Al-Amri"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Designation / Job Title
                  </label>
                  <input
                    type="text"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    placeholder="e.g. Head of Engineering"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Duqm Marine Logistics SAOC"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Industry Sector
                  </label>
                  <select
                    value={newIndustry}
                    onChange={(e) => setNewIndustry(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Oil & Gas">Oil & Gas</option>
                    <option value="Construction & Infra">Construction & Infra</option>
                    <option value="Utilities & Power">Utilities & Power</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Logistics & Ports">Logistics & Ports</option>
                    <option value="Telecom & IT">Telecom & IT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="khalid@company.om"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Phone / Mobile
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+968 9900 1122"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Lead Source
                  </label>
                  <select
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Website / Inbound">Website / Inbound</option>
                    <option value="Trade Exhibition (Oman Expo)">Trade Exhibition (Oman Expo)</option>
                    <option value="Tender Portal (E-Tendering Oman)">Tender Portal (E-Tendering Oman)</option>
                    <option value="Referral / Partner">Referral / Partner</option>
                    <option value="Direct Inquiry">Direct Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Estimated Deal Budget (OMR)
                  </label>
                  <input
                    type="number"
                    value={newEstimatedValue}
                    onChange={(e) => setNewEstimatedValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Assign to Sales Account Manager
                </label>
                <select
                  value={assignedRepName}
                  onChange={(e) => setAssignedRepName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Eng. Tariq Al-Habsi">Eng. Tariq Al-Habsi (Energy & Government)</option>
                  <option value="Zainab Al-Balushi">Zainab Al-Balushi (Industrial & Petrochemicals)</option>
                  <option value="Ahmed Al-Shehhi">Ahmed Al-Shehhi (Commercial & EPC Contractors)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Project Scope & Technical Notes
                </label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Specify key client requirements, delivery dates, or RFP tender references..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCaptureModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md cursor-pointer"
                >
                  Save & Qualify Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

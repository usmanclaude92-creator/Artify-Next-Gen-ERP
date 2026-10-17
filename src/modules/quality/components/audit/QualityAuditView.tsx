// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 14: QUALITY MANAGEMENT (QMS)
// 14.06 Quality Audits, Supplier Scorecards & Executive KPIs
// ==========================================

import React, { useState } from 'react';
import { useQualityStore } from '../../services/qualityStore';
import { QualityAudit, SupplierQualityScorecard, QualityCertificate } from '../../types/qualityTypes';
import {
  FileSpreadsheet,
  Building2,
  Award,
  BarChart3,
  Search,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  ShieldCheck,
  Percent,
  Download,
  Calendar,
  X,
  UserCheck
} from 'lucide-react';

export const QualityAuditView: React.FC = () => {
  const { audits, supplierScorecards, certificates, kpiMetrics, addAudit, addSupplierScorecard } = useQualityStore();

  const [activeTab, setActiveTab] = useState<'AUDITS' | 'SUPPLIER_QUALITY' | 'CERT_VAULT' | 'KPI_DASHBOARD'>('AUDITS');
  const [selectedAudit, setSelectedAudit] = useState<QualityAudit | null>(audits[0] || null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAddAuditModal, setShowAddAuditModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);

  // Form State for Audit
  const [auditForm, setAuditForm] = useState({
    auditNumber: '',
    auditType: 'INTERNAL_ISO' as const,
    standardScope: 'ISO 9001:2015 Clause 8 (Operations)',
    targetDepartmentOrVendor: 'Machining & Assembly Plant 2',
    leadAuditor: 'Lead Auditor Tariq Al-Busaidi',
    auditDate: new Date().toISOString().split('T')[0],
    closureTargetDate: new Date(Date.now() + 45 * 24 * 3600 * 1000).toISOString().split('T')[0],
    status: 'COMPLETED' as const,
    majorNonConformances: 0,
    minorNonConformances: 2,
    opportunitiesForImprovement: 3,
    executiveSummary: 'General process adherence observed. Traceability logs up to date with minor calibration log gaps.'
  });

  // Form State for Supplier Scorecard
  const [supForm, setSupForm] = useState({
    vendorCode: '',
    vendorName: '',
    category: 'Forgings & Castings',
    overallRatingPercent: 96.5,
    inboundPpm: 120,
    lotsReceivedCount: 45,
    lotsRejectedCount: 0,
    onTimeDeliveryPercent: 98.2,
    lastAuditScore: 94,
    qualificationStatus: 'CERTIFIED_PREFERRED' as const
  });

  const handleCreateAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditForm.auditNumber || !auditForm.targetDepartmentOrVendor) return;
    addAudit({
      ...auditForm,
      findingsList: [
        {
          findingId: 'F-01',
          clauseReference: 'Clause 7.1.5 (Monitoring & Measuring Resources)',
          severity: 'MINOR',
          description: 'Calibration sticker on Vernier Caliper #CAL-048 was missing updated date.',
          assignedActionee: 'Toolroom Supervisor',
          dueDate: auditForm.closureTargetDate,
          isClosed: false
        }
      ]
    });
    setShowAddAuditModal(false);
  };

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supForm.vendorCode || !supForm.vendorName) return;
    addSupplierScorecard(supForm);
    setShowAddSupplierModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Header Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('AUDITS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'AUDITS'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Quality Audits ({audits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('SUPPLIER_QUALITY')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'SUPPLIER_QUALITY'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Supplier Scorecards ({supplierScorecards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('CERT_VAULT')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'CERT_VAULT'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Certificates & Calibration Vault ({certificates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('KPI_DASHBOARD')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'KPI_DASHBOARD'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Executive KPI Dashboard</span>
          </button>
        </div>

        {activeTab === 'AUDITS' && (
          <button
            onClick={() => setShowAddAuditModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-teal-600/20 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Audit</span>
          </button>
        )}

        {activeTab === 'SUPPLIER_QUALITY' && (
          <button
            onClick={() => setShowAddSupplierModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-teal-600/20 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Supplier Score</span>
          </button>
        )}
      </div>

      {/* TAB 1: QUALITY AUDITS */}
      {activeTab === 'AUDITS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="space-y-3">
            {audits.map(audit => {
              const isSelected = selectedAudit?.id === audit.id;
              return (
                <div
                  key={audit.id}
                  onClick={() => setSelectedAudit(audit)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-teal-500 shadow-xl shadow-teal-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950 text-teal-400 border border-teal-800">
                      {audit.auditNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {audit.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white leading-snug">{audit.standardScope}</h4>
                  <div className="text-[11px] text-slate-400 mt-1">Target: {audit.targetDepartmentOrVendor}</div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80">
                    <span className="text-amber-400 font-medium">
                      {audit.minorNonConformances} Minor NCs • {audit.majorNonConformances} Major
                    </span>
                    <span className="font-mono text-slate-500">{audit.auditDate}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Audit Findings & Action Logs */}
          {selectedAudit ? (
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-teal-400 bg-teal-950 px-2.5 py-0.5 rounded border border-teal-800">
                      {selectedAudit.auditNumber}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {selectedAudit.auditType.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-1">{selectedAudit.standardScope}</h3>
                  <div className="text-xs text-slate-400">Auditee: {selectedAudit.targetDepartmentOrVendor} • Lead Auditor: {selectedAudit.leadAuditor}</div>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {selectedAudit.status}
                  </span>
                  <div className="text-[11px] font-mono text-slate-500 mt-1">Conducted: {selectedAudit.auditDate}</div>
                </div>
              </div>

              {/* Findings Summary Cards */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-500 block text-[10px]">Major NCs</span>
                  <span className="font-black font-mono text-rose-400 text-xl">{selectedAudit.majorNonConformances}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-500 block text-[10px]">Minor NCs</span>
                  <span className="font-black font-mono text-amber-400 text-xl">{selectedAudit.minorNonConformances}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-500 block text-[10px]">Opportunities (OFI)</span>
                  <span className="font-black font-mono text-teal-400 text-xl">{selectedAudit.opportunitiesForImprovement}</span>
                </div>
              </div>

              {/* Findings Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-teal-400" />
                  <span>Corrective Action Requests (CAR) from Audit</span>
                </h4>

                <div className="space-y-2.5">
                  {selectedAudit.findingsList.map(f => (
                    <div key={f.findingId} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-teal-400">{f.clauseReference}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-950 text-amber-400 border border-amber-800">
                          {f.severity}
                        </span>
                      </div>
                      <p className="text-slate-300">{f.description}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                        <span>Actionee: <strong className="text-slate-300">{f.assignedActionee}</strong></span>
                        <span className="font-mono">Due: {f.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
              Select an audit to review findings and corrective actions.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SUPPLIER QUALITY MANAGEMENT */}
      {activeTab === 'SUPPLIER_QUALITY' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supplierScorecards.map(vendor => (
              <div key={vendor.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950 text-teal-400 border border-teal-800">
                      {vendor.vendorCode}
                    </span>
                    <h3 className="text-base font-bold text-white">{vendor.vendorName}</h3>
                    <div className="text-xs text-slate-400">{vendor.category}</div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black border ${
                      vendor.qualificationStatus === 'CERTIFIED_PREFERRED'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : vendor.qualificationStatus === 'QUALIFIED'
                        ? 'bg-blue-950 text-blue-400 border-blue-800'
                        : 'bg-amber-950 text-amber-400 border-amber-800'
                    }`}
                  >
                    {vendor.qualificationStatus.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-center">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Vendor Score (VQR)</span>
                    <span className="font-black font-mono text-teal-400 text-base">{vendor.overallRatingPercent}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Defect Rate (PPM)</span>
                    <span className="font-black font-mono text-emerald-400 text-base">{vendor.inboundPpm} PPM</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">On-Time Delivery</span>
                    <span className="font-black font-mono text-white text-base">{vendor.onTimeDeliveryPercent}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span>Lots Processed: <strong className="text-slate-200">{vendor.lotsReceivedCount}</strong></span>
                  <span>Audit Score: <strong className="text-teal-400">{vendor.lastAuditScore}/100</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CERTIFICATES & CALIBRATION VAULT */}
      {activeTab === 'CERT_VAULT' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-400" />
                <span>Certificate of Analysis & Calibration Repository</span>
              </h3>
              <p className="text-xs text-slate-400">Archived compliance documents, calibration stickers, and ISO certificates</p>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-950 text-teal-400 border border-teal-800">
              {certificates.length} Active Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-950 font-semibold">
                  <th className="py-3 px-3">Certificate Ref</th>
                  <th className="py-3 px-3">Certificate Title</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Issued By</th>
                  <th className="py-3 px-3">Effective Date</th>
                  <th className="py-3 px-3">Expiry Date</th>
                  <th className="py-3 px-3">Compliance Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {certificates.map(cert => (
                  <tr key={cert.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-teal-400">{cert.certificateNumber}</td>
                    <td className="py-3 px-3 font-bold text-white">{cert.title}</td>
                    <td className="py-3 px-3 text-slate-400">{cert.type.replace('_', ' ')}</td>
                    <td className="py-3 px-3 text-slate-300">{cert.issuingAuthority}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{cert.issuedDate}</td>
                    <td className="py-3 px-3 font-mono text-amber-400 font-bold">{cert.expiryDate}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {cert.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => alert(`Downloading certificate document: ${cert.certificateNumber}`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-400 hover:text-white transition-colors cursor-pointer"
                        title="Download file"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: EXECUTIVE QUALITY KPI DASHBOARD */}
      {activeTab === 'KPI_DASHBOARD' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>First Pass Yield (FPY)</span>
                <Percent className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-2xl font-black font-mono text-white">{kpiMetrics.firstPassYieldPct}%</div>
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+0.8% vs last quarter target (98.0%)</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Customer Return Rate</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black font-mono text-emerald-400">{kpiMetrics.customerReturnRatePpm} PPM</div>
              <div className="text-[11px] text-slate-500 font-semibold">World-class benchmark &lt; 200 PPM</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Cost of Poor Quality (COPQ)</span>
                <Percent className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black font-mono text-amber-400">{kpiMetrics.costOfPoorQualityPct}% of Revenue</div>
              <div className="text-[11px] text-emerald-400 font-semibold">Target ceiling: 1.50%</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Supplier Quality Index</span>
                <ShieldCheck className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-2xl font-black font-mono text-teal-400">{kpiMetrics.supplierQualityIndexScore}/100</div>
              <div className="text-[11px] text-slate-400">Across 18 audited critical vendors</div>
            </div>
          </div>

          {/* Quality Philosophy Callout */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Zero-Defect Total Quality Management (TQM) Posture</span>
              </h4>
              <p className="text-xs text-slate-400">
                Real-time automated gating across all ERP work centers guarantees no non-conforming lot is issued to manufacturing without MRB signoff.
              </p>
            </div>
            <span className="px-3.5 py-1.5 bg-teal-600/20 border border-teal-500/40 text-teal-300 font-mono font-bold text-xs rounded-xl shrink-0">
              Audit Status: 100% ISO Compliant
            </span>
          </div>
        </div>
      )}

      {/* MODAL: SCHEDULE AUDIT */}
      {showAddAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-teal-400" />
                <span>Schedule Quality Audit</span>
              </h3>
              <button onClick={() => setShowAddAuditModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAudit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Audit Plan Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AUD-2024-ISO-03"
                    value={auditForm.auditNumber}
                    onChange={e => setAuditForm({ ...auditForm, auditNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Audit Type</label>
                  <select
                    value={auditForm.auditType}
                    onChange={e => setAuditForm({ ...auditForm, auditType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                  >
                    <option value="INTERNAL_ISO">Internal ISO 9001/45001</option>
                    <option value="SUPPLIER_AUDIT">Supplier Qualification Audit</option>
                    <option value="EXTERNAL_CERTIFICATION">External Certification Body</option>
                    <option value="CUSTOMER_AUDIT">Customer Client Audit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Audit Scope / Standard Reference *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ISO 9001:2015 Clause 8.5 (Production & Service Provision)"
                  value={auditForm.standardScope}
                  onChange={e => setAuditForm({ ...auditForm, standardScope: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Target Department / Auditee</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Inbound Receiving & Warehouse"
                    value={auditForm.targetDepartmentOrVendor}
                    onChange={e => setAuditForm({ ...auditForm, targetDepartmentOrVendor: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Lead Auditor</label>
                  <input
                    type="text"
                    value={auditForm.leadAuditor}
                    onChange={e => setAuditForm({ ...auditForm, leadAuditor: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddAuditModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold shadow-lg shadow-teal-600/30 cursor-pointer"
                >
                  Save & Schedule Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 14: QUALITY MANAGEMENT (QMS)
// 14.04 Non-Conformance & MRB Quarantine Management
// ==========================================

import React, { useState } from 'react';
import { useQualityStore } from '../../services/qualityStore';
import { NonConformanceReport, MrbDisposition } from '../../types/qualityTypes';
import {
  AlertTriangle,
  Flame,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  DollarSign,
  Tag,
  Layers,
  ArrowRight,
  UserCheck,
  Building,
  Clock,
  X,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

export const NonConformanceView: React.FC = () => {
  const { ncrs, updateNcrDisposition, addNcr } = useQualityStore();

  const [activeTab, setActiveTab] = useState<'NCR_REGISTER' | 'MRB_BOARD' | 'COPQ_ANALYTICS'>('NCR_REGISTER');
  const [selectedNcr, setSelectedNcr] = useState<NonConformanceReport | null>(ncrs[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddNcrModal, setShowAddNcrModal] = useState(false);

  // Form State for new NCR
  const [ncrForm, setNcrForm] = useState({
    title: '',
    origin: 'INCOMING_INSPECTION' as const,
    severity: 'MAJOR' as const,
    itemCode: '',
    itemName: '',
    lotNumber: '',
    quarantineLocation: 'QUARANTINE_BAY_Q1',
    defectCategory: 'DIMENSIONAL',
    defectDescription: '',
    quantityAffected: 10,
    unit: 'Units',
    raisedBy: 'QA Inspector',
    vendorOrDepartment: '',
    disposition: 'PENDING_MRB' as MrbDisposition,
    scrapCostEstimated: 500,
    reworkHoursEstimated: 4,
    capaRequired: true
  });

  const filteredNcrs = ncrs.filter(n =>
    n.ncrNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.vendorOrDepartment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateNcr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ncrForm.title || !ncrForm.itemCode) return;
    addNcr({
      ...ncrForm,
      mrbSignatures: {
        qualityApproved: false,
        engineeringApproved: false,
        operationsApproved: false
      }
    });
    setShowAddNcrModal(false);
  };

  const handleDispositionChange = (ncrId: string, newDisposition: MrbDisposition) => {
    updateNcrDisposition(ncrId, newDisposition, `MRB formal decision set to ${newDisposition}`);
    if (selectedNcr && selectedNcr.id === ncrId) {
      setSelectedNcr({ ...selectedNcr, disposition: newDisposition, status: 'DISPOSITIONED' });
    }
  };

  // Calculate COPQ metrics
  const totalScrapCost = ncrs.reduce((acc, n) => acc + (n.scrapCostEstimated || 0), 0);
  const totalReworkHours = ncrs.reduce((acc, n) => acc + (n.reworkHoursEstimated || 0), 0);
  const openNcrCount = ncrs.filter(n => n.status !== 'CLOSED').length;

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">Active Non-Conformances</span>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">{openNcrCount} Open NCRs</div>
            <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">Pending MRB review</span>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">Estimated Scrap Loss (COPQ)</span>
            <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">${totalScrapCost.toLocaleString()} USD</div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Includes material write-off</span>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">Cumulative Rework Labor</span>
            <div className="text-2xl font-black font-mono text-teal-600 dark:text-teal-400">{totalReworkHours} Shop Hours</div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Corrective machining required</span>
          </div>
          <div className="p-3 bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800 rounded-xl">
            <RotateCcw className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Sub-Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 p-1 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('NCR_REGISTER')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'NCR_REGISTER'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>NCR Registry ({ncrs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('MRB_BOARD')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'MRB_BOARD'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>MRB Disposition Board</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search NCRs, items, lots..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 w-52"
            />
          </div>

          <button
            onClick={() => setShowAddNcrModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/20 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Raise NCR</span>
          </button>
        </div>
      </div>

      {/* TAB 1: NCR REGISTRY */}
      {activeTab === 'NCR_REGISTER' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="space-y-3">
            {filteredNcrs.map(ncr => {
              const isSelected = selectedNcr?.id === ncr.id;
              return (
                <div
                  key={ncr.id}
                  onClick={() => setSelectedNcr(ncr)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-teal-500 shadow-xl shadow-teal-500/10'
                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                      {ncr.ncrNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                        ncr.severity === 'CRITICAL'
                          ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                          : ncr.severity === 'MAJOR'
                          ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {ncr.severity}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{ncr.title}</h4>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">{ncr.itemName} (Lot: {ncr.lotNumber})</div>
                  <div className="text-[11px] text-teal-600 dark:text-teal-400 font-mono mt-0.5">Hold: {ncr.quarantineLocation}</div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mt-3 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Disposition: {ncr.disposition}</span>
                    <span className="font-mono text-slate-500 dark:text-slate-400">{ncr.dateRaised}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* NCR Detailed View & Quarantine Tag */}
          {selectedNcr ? (
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-2.5 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                      {selectedNcr.ncrNumber}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {(selectedNcr.origin ?? 'IN_PROCESS').replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">{selectedNcr.title}</h3>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Target Item: {selectedNcr.itemName} ({selectedNcr.itemCode})</div>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 inline-flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>RED QUARANTINE TAG</span>
                  </span>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">Bay: {selectedNcr.quarantineLocation}</div>
                </div>
              </div>

              {/* Defect Details */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">Defect Category: {selectedNcr.defectCategory}</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">Qty Affected: {selectedNcr.quantityAffected} {selectedNcr.unit}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">{selectedNcr.defectDescription}</p>
              </div>

              {/* MRB Disposition Status & Action Buttons */}
              <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>Material Review Board (MRB) Decision</span>
                  </h4>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                    Current: {selectedNcr.disposition}
                  </span>
                </div>

                {/* Disposition selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'REWORK', label: 'Rework In-House', color: 'hover:bg-amber-600 text-amber-800 dark:text-amber-300' },
                    { id: 'SCRAP', label: 'Scrap & Write-Off', color: 'hover:bg-rose-600 text-rose-700 dark:text-rose-300' },
                    { id: 'RETURN_TO_VENDOR', label: 'Return to Vendor (RTV)', color: 'hover:bg-blue-600 text-blue-700 dark:text-blue-300' },
                    { id: 'USE_AS_IS', label: 'Use-As-Is (Concession)', color: 'hover:bg-emerald-600 text-emerald-700 dark:text-emerald-300' }
                  ].map(btn => (
                    <button
                      key={btn.id}
                      onClick={() => handleDispositionChange(selectedNcr.id, btn.id as MrbDisposition)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        selectedNcr.disposition === btn.id
                          ? 'bg-teal-600 border-teal-500 text-white shadow-lg shadow-teal-600/30'
                          : `bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 ${btn.color}`
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                {/* Approvals Checklist */}
                <div className="grid grid-cols-3 gap-3 text-xs pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className={`w-4 h-4 ${selectedNcr.mrbSignatures?.qualityApproved ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span>Quality Lead Sign</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className={`w-4 h-4 ${selectedNcr.mrbSignatures?.engineeringApproved ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span>Chief Engineer Sign</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className={`w-4 h-4 ${selectedNcr.mrbSignatures?.operationsApproved ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span>Plant Manager Sign</span>
                  </div>
                </div>
              </div>

              {/* Financial Impact & CAPA Trigger */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold uppercase">Cost of Poor Quality (COPQ)</span>
                  <div className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400">
                    ${selectedNcr.scrapCostEstimated?.toLocaleString() || '0'} USD
                  </div>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">Estimated rework hours: {selectedNcr.reworkHoursEstimated} hrs</span>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold uppercase">CAPA Root Cause Action</span>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedNcr.capaRequired ? (
                      <span className="text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mt-1">
                        <Flame className="w-4 h-4" />
                        <span>Mandatory 8D CAPA Linked: CAPA-2024-001</span>
                      </span>
                    ) : (
                      <span className="text-slate-600 dark:text-slate-400 mt-1 block">Isolated incident (No CAPA triggered)</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
              Select an NCR to review disposition board and quarantine tags.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MRB DISPOSITION BOARD (Kanban style) */}
      {activeTab === 'MRB_BOARD' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(['PENDING_MRB', 'REWORK', 'SCRAP', 'RETURN_TO_VENDOR'] as MrbDisposition[]).map(status => {
            const columnNcrs = ncrs.filter(n => n.disposition === status);
            return (
              <div key={status} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">{status.replace('_', ' ')}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400">
                    {columnNcrs.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {columnNcrs.map(ncr => (
                    <div
                      key={ncr.id}
                      onClick={() => {
                        setSelectedNcr(ncr);
                        setActiveTab('NCR_REGISTER');
                      }}
                      className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 cursor-pointer hover:border-teal-500 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400">{ncr.ncrNumber}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">{ncr.severity}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{ncr.title}</div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 truncate">{ncr.itemName}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: RAISE NEW NCR */}
      {showAddNcrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-500" />
                <span>Issue Non-Conformance Report (NCR)</span>
              </h3>
              <button onClick={() => setShowAddNcrModal(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNcr} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Origin *</label>
                  <select
                    value={ncrForm.origin}
                    onChange={e => setNcrForm({ ...ncrForm, origin: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-rose-500"
                  >
                    <option value="INCOMING_INSPECTION">Incoming Inspection</option>
                    <option value="IN_PROCESS">In-Process Machining / Assembly</option>
                    <option value="FINAL_INSPECTION">Final Pre-Dispatch Inspection</option>
                    <option value="CUSTOMER_COMPLAINT">Customer Claim / Return</option>
                    <option value="INTERNAL_AUDIT">Internal ISO Audit</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Severity *</label>
                  <select
                    value={ncrForm.severity}
                    onChange={e => setNcrForm({ ...ncrForm, severity: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-rose-500"
                  >
                    <option value="CRITICAL">Critical (Safety/Shutdown)</option>
                    <option value="MAJOR">Major (Spec Out of Limit)</option>
                    <option value="MINOR">Minor (Cosmetic/Packaging)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">NCR Title / Non-Conformance Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wall Thickness Below Minimum Tolerance on Flange Neck"
                  value={ncrForm.title}
                  onChange={e => setNcrForm({ ...ncrForm, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Item Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FG-VALVE-01"
                    value={ncrForm.itemCode}
                    onChange={e => setNcrForm({ ...ncrForm, itemCode: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Lot / Batch Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LOT-449"
                    value={ncrForm.lotNumber}
                    onChange={e => setNcrForm({ ...ncrForm, lotNumber: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Quantity Affected</label>
                  <input
                    type="number"
                    value={ncrForm.quantityAffected}
                    onChange={e => setNcrForm({ ...ncrForm, quantityAffected: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Quarantine Physical Location</label>
                  <input
                    type="text"
                    value={ncrForm.quarantineLocation}
                    onChange={e => setNcrForm({ ...ncrForm, quarantineLocation: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Estimated Scrap Cost ($ USD)</label>
                  <input
                    type="number"
                    value={ncrForm.scrapCostEstimated}
                    onChange={e => setNcrForm({ ...ncrForm, scrapCostEstimated: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Detailed Defect Investigation Notes</label>
                <textarea
                  rows={2}
                  value={ncrForm.defectDescription}
                  onChange={e => setNcrForm({ ...ncrForm, defectDescription: e.target.value })}
                  placeholder="Measurement deviations, tool wear observations, or operator notes..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddNcrModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-600/30 cursor-pointer"
                >
                  Create NCR & Issue Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

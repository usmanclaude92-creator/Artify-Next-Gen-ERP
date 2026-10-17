// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 14: QUALITY MANAGEMENT (QMS)
// 14.01 Quality Standards, Policies & Specifications
// ==========================================

import React, { useState } from 'react';
import { useQualityStore } from '../../services/qualityStore';
import { QualityStandard, QualityPolicy, QualitySpecification } from '../../types/qualityTypes';
import {
  BookOpen,
  FileText,
  Sliders,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Award,
  Layers,
  ChevronRight,
  Filter,
  X,
  Target,
  FileCheck
} from 'lucide-react';

export const QualityStandardsView: React.FC = () => {
  const { standards, policies, specifications, addStandard, addPolicy, addSpecification } = useQualityStore();
  const [activeTab, setActiveTab] = useState<'STANDARDS' | 'POLICIES' | 'SPECS'>('STANDARDS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStandard, setSelectedStandard] = useState<QualityStandard | null>(standards[0] || null);
  const [selectedSpec, setSelectedSpec] = useState<QualitySpecification | null>(specifications[0] || null);

  // Modals
  const [showAddStdModal, setShowAddStdModal] = useState(false);
  const [showAddPolicyModal, setShowAddPolicyModal] = useState(false);
  const [showAddSpecModal, setShowAddSpecModal] = useState(false);

  // Form states for Standard
  const [stdForm, setStdForm] = useState({
    code: '',
    name: '',
    category: 'ISO' as const,
    version: '2024 Rev 1',
    effectiveDate: new Date().toISOString().split('T')[0],
    reviewCycleMonths: 12,
    nextReviewDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
    ownerDepartment: 'Quality Assurance',
    status: 'COMPLIANT' as const,
    clausesCount: 10,
    description: '',
    certificationBody: 'Bureau Veritas',
    certificateExpiry: '2027-12-31'
  });

  // Form states for Policy
  const [polForm, setPolForm] = useState({
    code: '',
    title: '',
    scope: 'All facilities',
    targetObjective: '',
    currentScorePct: 98.0,
    approvedBy: 'Executive Leadership',
    approvalDate: new Date().toISOString().split('T')[0],
    revisionNumber: 'Rev 1.0',
    mandatoryDepartments: ['Production', 'Warehouse', 'QA'],
    status: 'ACTIVE' as const
  });

  // Form states for Specification
  const [specForm, setSpecForm] = useState({
    code: '',
    itemCode: '',
    itemName: '',
    category: 'RAW_MATERIAL' as const,
    revision: 'Rev A',
    effectiveDate: new Date().toISOString().split('T')[0],
    samplingStandard: 'ISO 2859-1 Level II',
    aqlLevel: '0.65 Normal',
    approvedBy: 'Lead Quality Engineer',
    status: 'ACTIVE' as const,
    paramName: 'Tensile Strength',
    paramUnit: 'MPa',
    paramNominal: 500,
    paramLsl: 450,
    paramUsl: 550,
    paramMethod: 'ASTM Standard'
  });

  const filteredStandards = standards.filter(
    s =>
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.ownerDepartment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPolicies = policies.filter(
    p =>
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.scope.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSpecs = specifications.filter(
    sp =>
      sp.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sp.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sp.itemCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateStandard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stdForm.code || !stdForm.name) return;
    addStandard(stdForm);
    setShowAddStdModal(false);
    setStdForm({
      code: '',
      name: '',
      category: 'ISO',
      version: '2024 Rev 1',
      effectiveDate: new Date().toISOString().split('T')[0],
      reviewCycleMonths: 12,
      nextReviewDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
      ownerDepartment: 'Quality Assurance',
      status: 'COMPLIANT',
      clausesCount: 10,
      description: '',
      certificationBody: 'Bureau Veritas',
      certificateExpiry: '2027-12-31'
    });
  };

  const handleCreatePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!polForm.code || !polForm.title) return;
    addPolicy(polForm);
    setShowAddPolicyModal(false);
  };

  const handleCreateSpec = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specForm.code || !specForm.itemName) return;
    addSpecification({
      code: specForm.code,
      itemCode: specForm.itemCode,
      itemName: specForm.itemName,
      category: specForm.category,
      revision: specForm.revision,
      effectiveDate: specForm.effectiveDate,
      samplingStandard: specForm.samplingStandard,
      aqlLevel: specForm.aqlLevel,
      approvedBy: specForm.approvedBy,
      status: specForm.status,
      parameters: [
        {
          id: `p-${Date.now()}`,
          name: specForm.paramName,
          unit: specForm.paramUnit,
          targetNominal: Number(specForm.paramNominal),
          lowerSpecLimit: Number(specForm.paramLsl),
          upperSpecLimit: Number(specForm.paramUsl),
          toleranceType: 'BILATERAL',
          testMethod: specForm.paramMethod,
          criticality: 'CRITICAL_TO_QUALITY'
        }
      ]
    });
    setShowAddSpecModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('STANDARDS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'STANDARDS'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Standards Registry ({standards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('POLICIES')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'POLICIES'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Quality Policies ({policies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('SPECS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'SPECS'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Technical Specs ({specifications.length})</span>
          </button>
        </div>

        {/* Search & Action */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${activeTab.toLowerCase()}...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 w-56"
            />
          </div>

          {activeTab === 'STANDARDS' && (
            <button
              onClick={() => setShowAddStdModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-teal-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Standard</span>
            </button>
          )}

          {activeTab === 'POLICIES' && (
            <button
              onClick={() => setShowAddPolicyModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-teal-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Policy</span>
            </button>
          )}

          {activeTab === 'SPECS' && (
            <button
              onClick={() => setShowAddSpecModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-teal-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Specification</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: STANDARDS REGISTRY */}
      {activeTab === 'STANDARDS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List column */}
          <div className="lg:col-span-2 space-y-3">
            {filteredStandards.map(std => {
              const isSelected = selectedStandard?.id === std.id;
              return (
                <div
                  key={std.id}
                  onClick={() => setSelectedStandard(std)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-teal-500 shadow-xl shadow-teal-500/10'
                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                          {std.code}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {std.category}
                        </span>
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">{std.version}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{std.name}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{std.description}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                          std.status === 'COMPLIANT'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                            : std.status === 'NEEDS_REVIEW'
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        {std.status}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                        Next: {std.nextReviewDate}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Standard Details Panel */}
          {selectedStandard ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 self-start shadow-xl">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                    {selectedStandard.code}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {selectedStandard.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedStandard.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{selectedStandard.description}</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400">Standard Category</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedStandard.category}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400">Current Edition / Version</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{selectedStandard.version}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400">Owner Department</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedStandard.ownerDepartment}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400">Effective Date</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{selectedStandard.effectiveDate}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400">Review Cycle</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">Every {selectedStandard.reviewCycleMonths} Months</span>
                </div>
                {selectedStandard.certificationBody && (
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                    <span className="text-slate-500 dark:text-slate-400">Auditing Body</span>
                    <span className="font-semibold text-teal-600 dark:text-teal-400">{selectedStandard.certificationBody}</span>
                  </div>
                )}
                {selectedStandard.certificateExpiry && (
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                    <span className="text-slate-500 dark:text-slate-400">Certificate Expiry</span>
                    <span className="font-mono text-amber-700 dark:text-amber-400">{selectedStandard.certificateExpiry}</span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Compliance Verification Audit</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  All {selectedStandard.clausesCount} mandatory clauses mapped to Standard Operating Procedures (SOPs) with 100% trace log verification.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
              Select a standard from the list to view compliance breakdown.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: QUALITY POLICIES */}
      {activeTab === 'POLICIES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPolicies.map(policy => (
            <div
              key={policy.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                    {policy.code}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{policy.title}</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  {policy.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Scope:</span> {policy.scope}
              </p>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
                <div className="text-[11px] font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>Key Quality Target:</span>
                </div>
                <div className="text-xs text-slate-900 dark:text-white font-medium">{policy.targetObjective}</div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                <div>
                  Approved: <span className="text-slate-800 dark:text-slate-200">{policy.approvedBy}</span>
                </div>
                <div className="font-mono text-teal-600 dark:text-teal-400 font-bold">{policy.revisionNumber}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: TECHNICAL SPECIFICATIONS */}
      {activeTab === 'SPECS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Spec list */}
          <div className="space-y-3">
            {filteredSpecs.map(spec => {
              const isSelected = selectedSpec?.id === spec.id;
              return (
                <div
                  key={spec.id}
                  onClick={() => setSelectedSpec(spec)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-teal-500 shadow-xl shadow-teal-500/10'
                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
                      {spec.code}
                    </span>
                    <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 font-bold">{spec.revision}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{spec.itemName}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{spec.itemCode}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mt-3 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                    <span>{spec.parameters.length} Parameters</span>
                    <span className="text-teal-600 dark:text-teal-400 font-medium">{spec.aqlLevel}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Spec Parameters Table & Limits */}
          {selectedSpec ? (
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                      {selectedSpec.code}
                    </span>
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-400 font-semibold">{selectedSpec.revision}</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">{selectedSpec.itemName}</h3>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">Item Code: {selectedSpec.itemCode} • Category: {selectedSpec.category}</div>
                </div>

                <div className="text-right text-xs">
                  <div className="text-slate-600 dark:text-slate-400">Sampling Standard:</div>
                  <div className="font-bold text-slate-900 dark:text-white">{selectedSpec.samplingStandard}</div>
                  <div className="text-teal-600 dark:text-teal-400 font-mono font-semibold">AQL: {selectedSpec.aqlLevel}</div>
                </div>
              </div>

              {/* Parameters List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Quantitative Tolerance Limits (LSL / Nominal / USL)</span>
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold bg-slate-50/60 dark:bg-slate-950/60">
                        <th className="py-2.5 px-3">Parameter</th>
                        <th className="py-2.5 px-3">Unit</th>
                        <th className="py-2.5 px-3">Lower (LSL)</th>
                        <th className="py-2.5 px-3">Target Nominal</th>
                        <th className="py-2.5 px-3">Upper (USL)</th>
                        <th className="py-2.5 px-3">Test Method</th>
                        <th className="py-2.5 px-3">Criticality</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                      {(selectedSpec.parameters ?? []).map(param => (
                        <tr key={param.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{param.name}</td>
                          <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">{param.unit}</td>
                          <td className="py-3 px-3 font-mono text-rose-600 dark:text-rose-400 font-bold">{param.lowerSpecLimit}</td>
                          <td className="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-black">{param.targetNominal}</td>
                          <td className="py-3 px-3 font-mono text-amber-700 dark:text-amber-400 font-bold">{param.upperSpecLimit}</td>
                          <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{param.testMethod}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                param.criticality === 'CRITICAL_TO_QUALITY'
                                  ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {param.criticality === 'CRITICAL_TO_QUALITY' ? 'CTQ' : 'STANDARD'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Approved by Metallurgical & Quality Engineering Authority:</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">{selectedSpec.approvedBy}</span>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
              Select a specification to view its parameter tolerance matrix.
            </div>
          )}
        </div>
      )}

      {/* CREATE STANDARD MODAL */}
      {showAddStdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Register New Quality Standard</span>
              </h3>
              <button onClick={() => setShowAddStdModal(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStandard} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Standard Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ISO-45001:2018"
                    value={stdForm.code}
                    onChange={e => setStdForm({ ...stdForm, code: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Category</label>
                  <select
                    value={stdForm.category}
                    onChange={e => setStdForm({ ...stdForm, category: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-500"
                  >
                    <option value="ISO">ISO Standard</option>
                    <option value="ASTM">ASTM Specification</option>
                    <option value="API">API Petroleum Standard</option>
                    <option value="GMP">Good Manufacturing Practice (GMP)</option>
                    <option value="INTERNAL_SOP">Internal Company SOP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Standard Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Occupational Health & Safety Management Systems"
                  value={stdForm.name}
                  onChange={e => setStdForm({ ...stdForm, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Edition / Revision</label>
                  <input
                    type="text"
                    value={stdForm.version}
                    onChange={e => setStdForm({ ...stdForm, version: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Owner Department</label>
                  <input
                    type="text"
                    value={stdForm.ownerDepartment}
                    onChange={e => setStdForm({ ...stdForm, ownerDepartment: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Scope & Description</label>
                <textarea
                  rows={3}
                  value={stdForm.description}
                  onChange={e => setStdForm({ ...stdForm, description: e.target.value })}
                  placeholder="Summary of mandatory requirements and audit boundaries..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddStdModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold shadow-lg shadow-teal-600/30 cursor-pointer"
                >
                  Save Standard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE SPECIFICATION MODAL */}
      {showAddSpecModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Create Quality Specification</span>
              </h3>
              <button onClick={() => setShowAddSpecModal(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSpec} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Spec Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SPEC-PIPE-API-5L"
                    value={specForm.code}
                    onChange={e => setSpecForm({ ...specForm, code: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Item Category</label>
                  <select
                    value={specForm.category}
                    onChange={e => setSpecForm({ ...specForm, category: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-500"
                  >
                    <option value="RAW_MATERIAL">Raw Material</option>
                    <option value="SEMI_FINISHED">Semi-Finished</option>
                    <option value="FINISHED_GOODS">Finished Goods</option>
                    <option value="PACKAGING">Packaging</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Item Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RM-PIPE-API5L-X65"
                    value={specForm.itemCode}
                    onChange={e => setSpecForm({ ...specForm, itemCode: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Item Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. API 5L Grade X65 Seamless Line Pipe"
                    value={specForm.itemName}
                    onChange={e => setSpecForm({ ...specForm, itemName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="text-[11px] font-bold text-teal-600 dark:text-teal-400">Primary Parameter & Tolerance</div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-slate-500 dark:text-slate-400 block mb-1 text-[10px]">Parameter Name</label>
                    <input
                      type="text"
                      value={specForm.paramName}
                      onChange={e => setSpecForm({ ...specForm, paramName: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 dark:text-slate-400 block mb-1 text-[10px]">Unit</label>
                    <input
                      type="text"
                      value={specForm.paramUnit}
                      onChange={e => setSpecForm({ ...specForm, paramUnit: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 dark:text-slate-400 block mb-1 text-[10px]">Nominal Target</label>
                    <input
                      type="number"
                      value={specForm.paramNominal}
                      onChange={e => setSpecForm({ ...specForm, paramNominal: Number(e.target.value) })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-500 dark:text-slate-400 block mb-1 text-[10px]">Lower Limit (LSL)</label>
                    <input
                      type="number"
                      value={specForm.paramLsl}
                      onChange={e => setSpecForm({ ...specForm, paramLsl: Number(e.target.value) })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-rose-600 dark:text-rose-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 dark:text-slate-400 block mb-1 text-[10px]">Upper Limit (USL)</label>
                    <input
                      type="number"
                      value={specForm.paramUsl}
                      onChange={e => setSpecForm({ ...specForm, paramUsl: Number(e.target.value) })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-amber-700 dark:text-amber-400 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddSpecModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold shadow-lg shadow-teal-600/30 cursor-pointer"
                >
                  Save Specification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

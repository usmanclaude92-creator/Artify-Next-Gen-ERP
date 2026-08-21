// ==========================================
// 15.01 CONTRACT MANAGEMENT VIEW
// Prime Contracts, Subcontracts, Terms & Master Register
// ==========================================

import React, { useState } from 'react';
import { useConstructionStore } from '../../services/constructionStore';
import { ContractMaster, SubcontractPackage, ContractClauseTerm, ContractType } from '../../types/constructionTypes';
import {
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Building,
  Users,
  Shield,
  Layers,
  ChevronRight,
  TrendingUp,
  Percent,
  Calendar,
  DollarSign,
  ArrowUpRight
} from 'lucide-react';

export const ContractManagementView: React.FC = () => {
  const {
    contracts,
    subcontracts,
    contractTerms,
    selectedContractId,
    setSelectedContractId,
    currency,
    addContract,
    addSubcontract
  } = useConstructionStore();

  const [activeTab, setActiveTab] = useState<'prime' | 'subcontracts' | 'terms'>('prime');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddContractModal, setShowAddContractModal] = useState(false);
  const [showAddSubcontractModal, setShowAddSubcontractModal] = useState(false);

  // New Contract Form State
  const [newContractNumber, setNewContractNumber] = useState('');
  const [newContractTitle, setNewContractTitle] = useState('');
  const [newProjectCode, setNewProjectCode] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newContractType, setNewContractType] = useState<ContractType>('FIDIC_RED_BOOK');
  const [newClientName, setNewClientName] = useState('');
  const [newConsultant, setNewConsultant] = useState('');
  const [newContractValue, setNewContractValue] = useState<number>(15000000);
  const [newStartDate, setNewStartDate] = useState('2024-09-01');
  const [newCompletionDate, setNewCompletionDate] = useState('2026-03-31');
  const [newLocation, setNewLocation] = useState('Muscat, Sultanate of Oman');
  const [newScope, setNewScope] = useState('');

  // New Subcontract Form State
  const [newSubNumber, setNewSubNumber] = useState('');
  const [newSubTrade, setNewSubTrade] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubContact, setNewSubContact] = useState('');
  const [newSubValue, setNewSubValue] = useState<number>(1200000);
  const [newSubStart, setNewSubStart] = useState('2024-10-01');
  const [newSubEnd, setNewSubEnd] = useState('2025-12-31');

  const selectedContract = contracts.find(c => c.id === selectedContractId) || contracts[0];

  const filteredContracts = contracts.filter(
    c =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contractNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubcontracts = subcontracts.filter(
    s =>
      s.contractId === selectedContractId &&
      (s.subcontractorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tradePackage.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredTerms = contractTerms.filter(t => t.contractId === selectedContractId);

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContractNumber || !newContractTitle) return;

    addContract({
      contractNumber: newContractNumber,
      title: newContractTitle,
      projectCode: newProjectCode || 'PRJ-NEW-01',
      projectName: newProjectName || newContractTitle,
      contractType: newContractType,
      clientName: newClientName || 'Oman Development Authority',
      mainContractor: 'Artify Engineering & Construction LLC',
      supervisingConsultant: newConsultant || 'Lead International Consultants',
      currency,
      originalContractValue: Number(newContractValue),
      approvedVariationsValue: 0,
      revisedContractValue: Number(newContractValue),
      contractStartDate: newStartDate,
      contractualCompletionDate: newCompletionDate,
      revisedCompletionDate: newCompletionDate,
      siteLocation: newLocation,
      status: 'ACTIVE',
      progressPhysicalPct: 0,
      progressFinancialPct: 0,
      scopeSummary: newScope || 'General construction execution works.',
      advancePaymentPercentage: 10,
      advanceRecoveryStartPct: 20,
      advanceRecoveryEndPct: 80,
      retentionPercentage: 10,
      retentionCapPercentage: 5,
      defectLiabilityPeriodMonths: 24,
      liquidatedDamagesPerDay: 4000,
      maxLiquidatedDamagesPct: 10
    });

    setShowAddContractModal(false);
    setNewContractNumber('');
    setNewContractTitle('');
  };

  const handleCreateSubcontract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubNumber || !newSubTrade || !newSubName) return;

    addSubcontract({
      subcontractNumber: newSubNumber,
      contractId: selectedContractId,
      tradePackage: newSubTrade,
      subcontractorName: newSubName,
      contactPerson: newSubContact || 'Operations Manager',
      subcontractValue: Number(newSubValue),
      awardedDate: new Date().toISOString().split('T')[0],
      targetStartDate: newSubStart,
      targetEndDate: newSubEnd,
      retentionPercentage: 10,
      advancePercentage: 10,
      payWhenPaidClause: true,
      cumulativeBilled: 0,
      cumulativeCertified: 0,
      status: 'ACTIVE'
    });

    setShowAddSubcontractModal(false);
    setNewSubNumber('');
    setNewSubTrade('');
    setNewSubName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider">
            <Building className="w-3.5 h-3.5" />
            Module 15.01 — Contract Management
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Prime Client & Subcontract Agreements</h2>
          <p className="text-sm text-slate-400">
            FIDIC Red/Yellow/Silver book terms, mobilization advance schedules, retention rules, and specialized trade subcontract packages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <select
            value={selectedContractId}
            onChange={e => setSelectedContractId(e.target.value)}
            className="bg-slate-800 text-slate-100 border border-slate-700 text-sm rounded-xl px-4 py-2.5 font-medium focus:ring-2 focus:ring-orange-500"
          >
            {contracts.map(c => (
              <option key={c.id} value={c.id}>
                {c.contractNumber} — {c.projectName}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddContractModal(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            New Contract
          </button>
        </div>
      </div>

      {/* Selected Contract Overview Card */}
      {selectedContract && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/50">
                  {selectedContract.contractNumber}
                </span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
                  {selectedContract.contractType.replace(/_/g, ' ')}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                  {selectedContract.status}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                {selectedContract.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-4">
                <span><strong>Client:</strong> {selectedContract.clientName}</span>
                <span>•</span>
                <span><strong>Consultant:</strong> {selectedContract.supervisingConsultant}</span>
              </p>
            </div>

            <div className="flex items-center gap-6 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Revised Contract Value</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                  {currency} {selectedContract.revisedContractValue.toLocaleString()}
                </p>
              </div>
              <div className="border-l border-slate-200 dark:border-slate-700 pl-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Physical Progress</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-24 bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-orange-500 h-full rounded-full"
                      style={{ width: `${selectedContract.progressPhysicalPct}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                    {selectedContract.progressPhysicalPct}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Commercial Parameters Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-6 text-sm">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">Advance Payment</span>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                {selectedContract.advancePaymentPercentage}% (Recovery {selectedContract.advanceRecoveryStartPct}%–{selectedContract.advanceRecoveryEndPct}%)
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">Retention Deductions</span>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                {selectedContract.retentionPercentage}% (Cap at {selectedContract.retentionCapPercentage}%)
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">Defect Liability (DLP)</span>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                {selectedContract.defectLiabilityPeriodMonths} Months Warranty
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">Liquidated Damages</span>
              <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 mt-1">
                {currency} {selectedContract.liquidatedDamagesPerDay.toLocaleString()} / Day
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">Start Date</span>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                {selectedContract.contractStartDate}
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">Revised Completion</span>
              <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mt-1">
                {selectedContract.revisedCompletionDate}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('prime')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
              activeTab === 'prime'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Prime Contracts ({contracts.length})
          </button>
          <button
            onClick={() => setActiveTab('subcontracts')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
              activeTab === 'subcontracts'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Subcontracts ({filteredSubcontracts.length})
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
              activeTab === 'terms'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Contract Clauses & Terms ({filteredTerms.length})
          </button>
        </div>

        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search contracts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Tab 1: Prime Contracts List */}
      {activeTab === 'prime' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContracts.map(contract => (
            <div
              key={contract.id}
              onClick={() => setSelectedContractId(contract.id)}
              className={`cursor-pointer rounded-2xl border transition-all p-6 relative overflow-hidden ${
                contract.id === selectedContractId
                  ? 'border-orange-500 bg-orange-50/20 dark:bg-orange-950/20 shadow-lg'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 bg-orange-100/50 dark:bg-orange-950/60 px-2 py-0.5 rounded">
                  {contract.contractNumber}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-100/50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                  {contract.status}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 dark:text-white mt-3 text-base line-clamp-2">
                {contract.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Client: {contract.clientName}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Contract Sum:</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">
                    {contract.currency} {contract.revisedContractValue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Completion:</span>
                  <span className="text-slate-700 dark:text-slate-300">{contract.revisedCompletionDate}</span>
                </div>
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Progress</span>
                    <span className="font-semibold text-orange-600">{contract.progressPhysicalPct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: `${contract.progressPhysicalPct}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Subcontracts */}
      {activeTab === 'subcontracts' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Subcontracts for {selectedContract?.contractNumber}
            </h4>
            <button
              onClick={() => setShowAddSubcontractModal(true)}
              className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold px-3 py-2 rounded-xl shadow transition-all hover:bg-slate-800"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Trade Subcontract
            </button>
          </div>

          <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Subcontract No.</th>
                  <th className="py-3 px-4">Trade Package</th>
                  <th className="py-3 px-4">Subcontractor Name</th>
                  <th className="py-3 px-4 text-right">Contract Value</th>
                  <th className="py-3 px-4 text-right">Certified</th>
                  <th className="py-3 px-4">Retention</th>
                  <th className="py-3 px-4">Pay When Paid</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredSubcontracts.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-orange-600 dark:text-orange-400">
                      {sub.subcontractNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {sub.tradePackage}
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{sub.subcontractorName}</div>
                      <div className="text-[11px] text-slate-400">{sub.contactPerson}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold">
                      {currency} {sub.subcontractValue.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      {currency} {sub.cumulativeCertified.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">{sub.retentionPercentage}%</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${sub.payWhenPaidClause ? 'bg-amber-100/60 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}>
                        {sub.payWhenPaidClause ? 'Enabled (Standard)' : 'Direct Terms'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100/60 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Contract Terms */}
      {activeTab === 'terms' && (
        <div className="space-y-4">
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            FIDIC Commercial Conditions & Clauses ({selectedContract?.contractNumber})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTerms.map(term => (
              <div key={term.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 px-2 py-1 rounded">
                    {term.clauseCode}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                    {term.complianceLevel}
                  </span>
                </div>
                <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                  {term.clauseHeading}
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {term.standardText}
                </p>
                <div className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/50">
                  <strong>Special Particular Conditions:</strong> {term.customModifications}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: New Prime Contract */}
      {showAddContractModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Construction Prime Contract</h3>
              <button onClick={() => setShowAddContractModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateContract} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Contract Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CON-2024-OM-020"
                    value={newContractNumber}
                    onChange={e => setNewContractNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Contract Type</label>
                  <select
                    value={newContractType}
                    onChange={e => setNewContractType(e.target.value as ContractType)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="FIDIC_RED_BOOK">FIDIC Red Book (Measurement)</option>
                    <option value="FIDIC_YELLOW_BOOK">FIDIC Yellow Book (Design & Build)</option>
                    <option value="FIDIC_SILVER_BOOK">FIDIC Silver Book (EPC Turnkey)</option>
                    <option value="LUMP_SUM_FIXED_PRICE">Lump Sum Fixed Price</option>
                    <option value="ITEM_RATE_REMEASURABLE">Item Rate Re-Measurable</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Contract & Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salalah Freezone Container Logistics Hub"
                  value={newContractTitle}
                  onChange={e => setNewContractTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Client / Employer Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Salalah Freezone SAOC"
                    value={newClientName}
                    onChange={e => setNewClientName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Supervising Consultant</label>
                  <input
                    type="text"
                    placeholder="e.g. Renardet SA & Partners"
                    value={newConsultant}
                    onChange={e => setNewConsultant(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Original Contract Value ({currency})</label>
                  <input
                    type="number"
                    value={newContractValue}
                    onChange={e => setNewContractValue(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Commencement Date</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={e => setNewStartDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Completion Date</label>
                  <input
                    type="date"
                    value={newCompletionDate}
                    onChange={e => setNewCompletionDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddContractModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-md"
                >
                  Create Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Subcontract */}
      {showAddSubcontractModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Subcontract Package</h3>
              <button onClick={() => setShowAddSubcontractModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateSubcontract} className="space-y-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Subcontract Reference No. *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUB-MCT-ELEC-04"
                  value={newSubNumber}
                  onChange={e => setNewSubNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Trade Package Scope *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LV Switchgear, Transformers & Cabling"
                  value={newSubTrade}
                  onChange={e => setNewSubTrade(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Subcontractor Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oman National Electrical Co."
                  value={newSubName}
                  onChange={e => setNewSubName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Subcontract Value ({currency})</label>
                  <input
                    type="number"
                    value={newSubValue}
                    onChange={e => setNewSubValue(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={newSubContact}
                    onChange={e => setNewSubContact(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddSubcontractModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                >
                  Add Subcontract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

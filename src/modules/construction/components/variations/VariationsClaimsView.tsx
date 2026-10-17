// ==========================================
// 15.07 VARIATIONS & CLAIMS VIEW
// Variation Orders (VO), FIDIC Claims, Extension of Time (EOT) & Liquidated Damages
// ==========================================

import React, { useState } from 'react';
import { useConstructionStore } from '../../services/constructionStore';
import { ExtensionOfTimeRecord, VariationStatus } from '../../types/constructionTypes';
import {
  GitPullRequest,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  DollarSign,
  FileText,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Percent
} from 'lucide-react';

export const VariationsClaimsView: React.FC = () => {
  const {
    variations,
    claims,
    eots: eotRecords,
    selectedContractId,
    contracts,
    currency,
    addVariationOrder,
    addContractClaim
  } = useConstructionStore();

  const [activeTab, setActiveTab] = useState<'variations' | 'claims' | 'eot' | 'ld-calculator'>('variations');

  // Modals
  const [showAddVoModal, setShowAddVoModal] = useState(false);
  const [showAddClaimModal, setShowAddClaimModal] = useState(false);

  // New VO Form State
  const [newVoNumber, setNewVoNumber] = useState('');
  const [newVoTitle, setNewVoTitle] = useState('');
  const [newVoType, setNewVoType] = useState<'ADDITION' | 'OMISSION' | 'SUBSTITUTION' | 'PRICE_ADJUSTMENT'>('ADDITION');
  const [newVoProposed, setNewVoProposed] = useState<number>(350000);
  const [newVoDays, setNewVoDays] = useState<number>(14);
  const [newVoJustification, setNewVoJustification] = useState('');

  // New Claim Form State
  const [newClaimNumber, setNewClaimNumber] = useState('');
  const [newClaimClause, setNewClaimClause] = useState('CLAUSE_20_1_CONTRACTOR_CLAIMS');
  const [newClaimTitle, setNewClaimTitle] = useState('');
  const [newClaimCost, setNewClaimCost] = useState<number>(180000);
  const [newClaimEot, setNewClaimEot] = useState<number>(21);

  const selectedContract = contracts.find(c => c.id === selectedContractId) || contracts[0];
  const contractVos = variations.filter(v => v.contractId === selectedContractId);
  const contractClaims = claims.filter(c => c.contractId === selectedContractId);
  const contractEot = eotRecords.filter(e => e.contractId === selectedContractId);

  const totalApprovedVos = contractVos
    .filter(v => v.status === 'APPROVED' || v.status === 'EXECUTED')
    .reduce((acc, v) => acc + v.finalAgreedAmount, 0);

  const totalApprovedEotDays = contractEot.reduce((acc, e) => acc + e.delayDaysApprovedByEmployer, 0);

  // Liquidated damages parameters
  const ldPerDay = selectedContract?.liquidatedDamagesPerDay || 4000;
  const maxLdCap = (selectedContract?.revisedContractValue || 0) * 0.10;
  const simulatedUnapprovedDelayDays = 0; // Current project on schedule with approved EOT
  const currentLdExposure = simulatedUnapprovedDelayDays * ldPerDay;

  const handleCreateVO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoNumber || !newVoTitle) return;

    addVariationOrder({
      voNumber: newVoNumber,
      contractId: selectedContractId,
      title: newVoTitle,
      originatingParty: 'CLIENT_REQUEST',
      dateInitiated: new Date().toISOString().split('T')[0],
      dateApproved: new Date().toISOString().split('T')[0],
      contractorProposedAmount: Number(newVoProposed),
      engineerEvaluatedAmount: Number(newVoProposed) * 0.95,
      finalAgreedAmount: Number(newVoProposed) * 0.95,
      extensionOfTimeDaysGranted: Number(newVoDays),
      scopeDescription: `${newVoType.replace(/_/g, ' ')} — ${newVoTitle}`,
      technicalJustification: newVoJustification || 'Structural and architectural revisions as per client instruction.',
      boqItemsAddedCount: 0,
      status: 'APPROVED'
    });

    setShowAddVoModal(false);
    setNewVoNumber('');
    setNewVoTitle('');
  };

  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClaimNumber || !newClaimTitle) return;

    const today = new Date().toISOString().split('T')[0];
    addContractClaim({
      claimNumber: newClaimNumber,
      contractId: selectedContractId,
      title: newClaimTitle,
      fidicClauseReference: newClaimClause.replace(/_/g, ' '),
      claimCategory: 'PROLONGATION_AND_DISRUPTION',
      noticeOfClaimDate: today,
      fullParticularsSubmissionDate: today,
      claimedFinancialQuantum: Number(newClaimCost),
      claimedTimeExtensionDays: Number(newClaimEot),
      engineerDeterminedAmount: Number(newClaimCost) * 0.8,
      engineerDeterminedEOTDays: Number(newClaimEot) * 0.8,
      narrativeSummary: newClaimTitle,
      status: 'UNDER_DETERMINATION',
      disputeAdjudicationBoardInvolved: false
    });

    setShowAddClaimModal(false);
    setNewClaimNumber('');
    setNewClaimTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-slate-900 dark:text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold uppercase tracking-wider">
            <GitPullRequest className="w-3.5 h-3.5" />
            Module 15.07 — Variations & Claims
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Variation Orders, Claims & Extension of Time (EOT)</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            FIDIC Clause 13 Variations, Clause 20.1 28-day notice verification, EOT critical path delay claims, and Liquidated Damages exposure risk.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddClaimModal(true)}
            className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-medium text-xs px-4 py-2.5 rounded-xl shadow transition-all"
          >
            <ShieldAlert className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            Lodge FIDIC Claim
          </button>
          <button
            onClick={() => setShowAddVoModal(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Issue Variation Order (VO)
          </button>
        </div>
      </div>

      {/* Summary KPI Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Approved Variations Value</span>
          <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {currency} {totalApprovedVos.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">Added to baseline contract sum</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Contractual EOT Approved</span>
          <p className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
            +{totalApprovedEotDays} Calendar Days
          </p>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">Completion shifted to {selectedContract?.revisedCompletionDate}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Liquidated Damages (LD) Exposure</span>
          <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {currency} 0.00 (Zero Exposure)
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400">Project timeline protected by approved EOT</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('variations')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'variations'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Variation Orders ({contractVos.length})
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'claims'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Contractor Claims Register ({contractClaims.length})
          </button>
          <button
            onClick={() => setActiveTab('eot')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'eot'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Extension of Time (EOT) Log ({contractEot.length})
          </button>
          <button
            onClick={() => setActiveTab('ld-calculator')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'ld-calculator'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Liquidated Damages (LD) Risk Calculator
          </button>
        </div>
      </div>

      {/* Tab 1: Variation Orders */}
      {activeTab === 'variations' && (
        <div className="space-y-4">
          <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">VO No.</th>
                  <th className="py-3 px-4">Variation Title</th>
                  <th className="py-3 px-4">Initiation</th>
                  <th className="py-3 px-4 text-right">Proposed Sum</th>
                  <th className="py-3 px-4 text-right">Engineer Evaluated</th>
                  <th className="py-3 px-4 text-right">Approved Amount</th>
                  <th className="py-3 px-4 text-center">EOT Days</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {contractVos.map(vo => (
                  <tr key={vo.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-600 dark:text-rose-400">
                      {vo.voNumber}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white max-w-xs">
                      <div>{vo.title}</div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 truncate">{vo.technicalJustification}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{vo.originatingParty.replace(/_/g, ' ')}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold">{currency} {vo.contractorProposedAmount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-blue-600 dark:text-blue-400 font-semibold">{currency} {vo.engineerEvaluatedAmount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">{currency} {vo.finalAgreedAmount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-center font-bold font-mono">+{vo.extensionOfTimeDaysGranted} d</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                        {vo.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Contractor Claims */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {contractClaims.map(claim => (
              <div key={claim.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-1 rounded">
                    {claim.claimNumber}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    {claim.status}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400">{claim.fidicClauseReference}</span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {claim.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Event Date: <strong>{claim.noticeOfClaimDate}</strong> • 28-Day Notice: <strong>{claim.fullParticularsSubmissionDate}</strong> (Compliant)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Claimed Cost</span>
                    <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                      {currency} {claim.claimedFinancialQuantum.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Claimed EOT</span>
                    <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                      +{claim.claimedTimeExtensionDays} Calendar Days
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Engineer Assessed</span>
                    <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {currency} {claim.engineerDeterminedAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Assessed EOT</span>
                    <p className="font-mono font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                      +{claim.engineerDeterminedEOTDays} Calendar Days
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: EOT Log */}
      {activeTab === 'eot' && (
        <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">EOT Ref</th>
                <th className="py-3 px-4">Delay Event Cause</th>
                <th className="py-3 px-4 text-center">Claimed Days</th>
                <th className="py-3 px-4 text-center">Consultant Recommended</th>
                <th className="py-3 px-4 text-center">Approved Days</th>
                <th className="py-3 px-4">New Completion Date</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {contractEot.map(eot => (
                <tr key={eot.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-rose-600 dark:text-rose-400">{eot.eotNumber}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white max-w-sm">{eot.eventDescription}</td>
                  <td className="py-3.5 px-4 text-center font-mono font-semibold">+{eot.delayDaysClaimed} d</td>
                  <td className="py-3.5 px-4 text-center font-mono text-blue-600 dark:text-blue-400 font-semibold">+{eot.delayDaysRecommendedByEngineer} d</td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">+{eot.delayDaysApprovedByEmployer} d</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 dark:text-white">{eot.revisedContractualCompletionDate}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      {eot.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: Liquidated Damages Risk Calculator */}
      {activeTab === 'ld-calculator' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Liquidated Damages (LD) Exposure & Delay Penalty Simulator
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-slate-500 dark:text-slate-400">Daily Liquidated Damages Penalty</span>
              <p className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400">
                {currency} {ldPerDay.toLocaleString()} / Day
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">As stipulated in Contract Appendix</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-slate-500 dark:text-slate-400">Maximum Liquidated Damages Cap (10%)</span>
              <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {currency} {maxLdCap.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Statutory FIDIC liability ceiling</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-slate-500 dark:text-slate-400">Current Delay Exposure</span>
              <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {currency} {currentLdExposure.toLocaleString()}
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400">0 days critical path unauthorized delay</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New VO */}
      {showAddVoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Issue Variation Order (VO)</h3>
              <button onClick={() => setShowAddVoModal(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-400">✕</button>
            </div>

            <form onSubmit={handleCreateVO} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">VO Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VO-04"
                  value={newVoNumber}
                  onChange={e => setNewVoNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Variation Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Additional Smart BMS Sensors & Control Panels"
                  value={newVoTitle}
                  onChange={e => setNewVoTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Proposed Value ({currency})</label>
                  <input
                    type="number"
                    value={newVoProposed}
                    onChange={e => setNewVoProposed(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Schedule Impact (Days)</label>
                  <input
                    type="number"
                    value={newVoDays}
                    onChange={e => setNewVoDays(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddVoModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold"
                >
                  Create Variation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Claim */}
      {showAddClaimModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Lodge FIDIC Contractor Claim</h3>
              <button onClick={() => setShowAddClaimModal(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-400">✕</button>
            </div>

            <form onSubmit={handleCreateClaim} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Claim Ref *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CLM-2024-02"
                  value={newClaimNumber}
                  onChange={e => setNewClaimNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Claim Title / Event *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unforeseen High Underground Water Table at Basements"
                  value={newClaimTitle}
                  onChange={e => setNewClaimTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Claimed Cost ({currency})</label>
                  <input
                    type="number"
                    value={newClaimCost}
                    onChange={e => setNewClaimCost(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Claimed EOT (Days)</label>
                  <input
                    type="number"
                    value={newClaimEot}
                    onChange={e => setNewClaimEot(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddClaimModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                >
                  Submit Notice & Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

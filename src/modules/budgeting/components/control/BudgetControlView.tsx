// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 11: BUDGETING & FINANCIAL PLANNING
// 11.04 — Budget Control View (Allocation, Approval, Consumption, Restrictions)
// ==========================================

import React, { useState } from 'react';
import { useBudgetStore } from '../../services/budgetStore';
import { RestrictionMode } from '../../types';
import {
  ShieldCheck,
  ShieldAlert,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Plus,
  Play,
  Settings2,
  Sliders,
  DollarSign,
  TrendingUp,
  FileCheck,
  Building,
  UserCheck,
  Sparkles
} from 'lucide-react';

export const BudgetControlView: React.FC = () => {
  const {
    reallocationTransfers,
    createReallocationTransfer,
    approveReallocationTransfer,
    approvalWorkflows,
    approveWorkflowStep,
    rejectWorkflowStep,
    restrictionRules,
    updateRestrictionRule,
    simulateBudgetCheck,
    costCenterSummaries,
    currency
  } = useBudgetStore();

  const [activeSubTab, setActiveSubTab] = useState<'allocation' | 'approval' | 'consumption' | 'restrictions'>('allocation');
  const [showVirementModal, setShowVirementModal] = useState(false);

  // Virement Form
  const [vFromCc, setVFromCc] = useState('CC-100 (Executive HQ)');
  const [vFromGl, setVFromGl] = useState('GL-6850 (Executive Travel)');
  const [vToCc, setVToCc] = useState('CC-400 (IT Operations)');
  const [vToGl, setVToGl] = useState('GL-6400 (Enterprise Cloud Infrastructure)');
  const [vAmount, setVAmount] = useState<number>(30000);
  const [vReason, setVReason] = useState('');
  const [vImpact, setVImpact] = useState('');

  // Real-time PR/PO Simulator State
  const [simCostCenter, setSimCostCenter] = useState('CC-200');
  const [simCategory, setSimCategory] = useState('Direct Materials');
  const [simAmount, setSimAmount] = useState<number>(450000);
  const [simResult, setSimResult] = useState<any>(null);

  const handleVirementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vAmount || !vReason) return;

    createReallocationTransfer({
      transferCode: `VMT-2026-00${reallocationTransfers.length + 1}`,
      fromCostCenter: vFromCc,
      fromAccountCode: vFromGl.split(' ')[0],
      fromAccountName: vFromGl,
      toCostCenter: vToCc,
      toAccountCode: vToGl.split(' ')[0],
      toAccountName: vToGl,
      transferAmount: Number(vAmount),
      reason: vReason,
      impactAssessment: vImpact || 'Rebalancing departmental operational allocations',
      requestedBy: 'Current Cost Center Head',
      effectiveDate: new Date().toISOString().split('T')[0]
    });

    setShowVirementModal(false);
    setVReason('');
    setVImpact('');
  };

  const runSimulation = () => {
    const res = simulateBudgetCheck({
      costCenterCode: simCostCenter,
      accountCategory: simCategory,
      proposedAmount: Number(simAmount)
    });
    setSimResult(res);
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-Nav */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                11.04 BUDGET CONTROL
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">Spending Restrictions, Virements & Approvals</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Active Budget Enforcement & Spending Controls
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Prevent unauthorized expenditure, process departmental budget transfers (virements), manage multi-tier executive signoffs, and enforce hard blocks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeSubTab === 'allocation' && (
              <button
                onClick={() => setShowVirementModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Request Budget Virement</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub Nav Strip */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('allocation')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'allocation'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>11.04.01 Budget Allocation & Transfers</span>
          </button>
          <button
            onClick={() => setActiveSubTab('approval')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'approval'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>11.04.02 Budget Approval Workflows</span>
          </button>
          <button
            onClick={() => setActiveSubTab('consumption')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'consumption'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>11.04.03 Real-Time Consumption Burn</span>
          </button>
          <button
            onClick={() => setActiveSubTab('restrictions')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'restrictions'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>11.04.04 Restrictions & PO Simulator</span>
          </button>
        </div>
      </div>

      {/* 11.04.01: Allocation & Transfers (Virements) */}
      {activeSubTab === 'allocation' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Departmental Budget Reallocations (Virements)</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Audit-tracked fund transfers between Cost Centers and GL Accounts with zero net balance change</p>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {reallocationTransfers.map(trn => (
                <div key={trn.id} className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                        {trn.transferCode}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        trn.status === 'Approved'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      }`}>
                        {trn.status}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Requested {trn.requestDate}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                      <span className="font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900/60">
                        From: {trn.fromCostCenter} ({trn.fromAccountName})
                      </span>
                      <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/60">
                        To: {trn.toCostCenter} ({trn.toAccountName})
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-sans">
                      <strong className="text-slate-600 dark:text-slate-400">Reason: </strong>{trn.reason}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right font-mono">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold block">Transfer Value</span>
                      <span className="text-base font-black text-cyan-600 dark:text-cyan-400">{trn.transferAmount.toLocaleString()} {currency}</span>
                    </div>

                    {trn.status === 'Pending Approval' && (
                      <button
                        onClick={() => approveReallocationTransfer(trn.id, 'Dr. Salim Al-Harthy (CFO)')}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
                      >
                        Authorize Virement
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 11.04.02: Approval Workflows */}
      {activeSubTab === 'approval' && (
        <div className="space-y-6">
          <div className="space-y-5">
            {approvalWorkflows.map(wf => (
              <div key={wf.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                        {wf.workflowCode}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded font-bold bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                        {wf.priority} Priority
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400">Submitted by {wf.submittedBy} on {wf.submissionDate}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">{wf.budgetName}</h3>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold block">Total Amount</span>
                    <span className="text-lg font-black text-slate-900 dark:text-white">{wf.totalBudgetAmount.toLocaleString()} {currency}</span>
                  </div>
                </div>

                {/* Multi-Tier Stepper Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
                  {wf.steps.map(step => (
                    <div
                      key={step.id}
                      className={`p-4 rounded-xl border ${
                        step.status === 'Approved'
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-800/80 text-emerald-700 dark:text-emerald-300'
                          : step.status === 'Rejected'
                          ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-800/80 text-rose-700 dark:text-rose-300'
                          : step.level === wf.currentLevel
                          ? 'bg-slate-50 dark:bg-slate-950 border-cyan-500 ring-2 ring-cyan-500/20 text-slate-900 dark:text-white'
                          : 'bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider">Level {step.level}</span>
                        {step.status === 'Approved' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : step.status === 'Rejected' ? (
                          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        ) : (
                          <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400 animate-pulse" />
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-2">{step.roleName}</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{step.approverName}</p>

                      <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px]">
                        <span className="text-slate-500 dark:text-slate-400">Limit: </span>
                        <span className="font-mono text-slate-700 dark:text-slate-300">Up to {step.thresholdMaxAmount.toLocaleString()} {currency}</span>
                      </div>

                      {step.timestamp && (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-mono">{step.timestamp}</p>
                      )}
                      {step.comments && (
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5 italic">"{step.comments}"</p>
                      )}

                      {step.level === wf.currentLevel && wf.status === 'Pending Approval' && (
                        <div className="flex gap-2 mt-3 pt-2">
                          <button
                            onClick={() => approveWorkflowStep(wf.id, step.level, 'Verified and approved')}
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectWorkflowStep(wf.id, step.level, 'Returned for clarification')}
                            className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-50 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11.04.03: Real-Time Consumption Burn */}
      {activeSubTab === 'consumption' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Enterprise Real-Time Budget Consumption Tracker</h3>
            <div className="space-y-4">
              {costCenterSummaries.map(cc => {
                const totalUsed = cc.committedBudget + cc.actualSpent;
                const pct = Math.round((totalUsed / cc.allocatedBudget) * 100);
                return (
                  <div key={cc.costCenterId} className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                            {cc.costCenterCode}
                          </span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{cc.costCenterName}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Manager: {cc.managerName} ({cc.departmentName})</p>
                      </div>

                      <div className="flex items-center gap-6 font-mono text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold block">Authorized</span>
                          <span className="text-slate-900 dark:text-white font-bold">{cc.allocatedBudget.toLocaleString()} {currency}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold block">Encumbered</span>
                          <span className="text-amber-700 dark:text-amber-400 font-bold">{cc.committedBudget.toLocaleString()} {currency}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold block">Actual Spent</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{cc.actualSpent.toLocaleString()} {currency}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold block">Available</span>
                          <span className="text-cyan-600 dark:text-cyan-400 font-bold">{cc.remainingBudget.toLocaleString()} {currency}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 dark:text-slate-400">Total Consumption (Committed + Incurred)</span>
                        <span className={`font-mono font-bold ${pct > 80 ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {pct}% Consumed
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                        <div className="bg-emerald-500 h-full" style={{ width: `${Math.round((cc.actualSpent / cc.allocatedBudget) * 100)}%` }} title="Actual Spent" />
                        <div className="bg-amber-500 h-full" style={{ width: `${Math.round((cc.committedBudget / cc.allocatedBudget) * 100)}%` }} title="Committed Encumbrances" />
                      </div>
                      <div className="flex gap-4 text-[10px] text-slate-600 dark:text-slate-400 mt-1.5">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Actual Incurred</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Open PO Encumbrances</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800" /> Remaining Available</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 11.04.04: Restrictions & Live Simulator */}
      {activeSubTab === 'restrictions' && (
        <div className="space-y-6">
          {/* Real-time PR/PO Live Budget Check Simulator */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Live Purchase Requisition / PO Budget Check Simulator</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Simulate an incoming procurement commitment against the active budget restriction rulebook to test hard blocks, tolerance thresholds, and automated rejection behaviors.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Cost Center</label>
                <select
                  value={simCostCenter}
                  onChange={(e) => setSimCostCenter(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="CC-200">CC-200 (Muscat Plant — Hard Block)</option>
                  <option value="CC-400">CC-400 (IT Operations — Soft Warning)</option>
                  <option value="CC-300">CC-300 (Sohar Hub — Manager Override)</option>
                  <option value="CC-100">CC-100 (Corporate HQ — Hard Block)</option>
                  <option value="CC-500">CC-500 (Commercial — Advisory)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Expense Category</label>
                <input
                  type="text"
                  value={simCategory}
                  onChange={(e) => setSimCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Proposed Commitment Amount ({currency})</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="number"
                    value={simAmount}
                    onChange={(e) => setSimAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    onClick={runSimulation}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Test</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Simulation Result Output */}
            {simResult && (
              <div className={`mt-5 p-4 rounded-xl border ${
                simResult.allowed
                  ? simResult.actionRequired === 'CFO Approval Needed'
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-800/80 text-amber-900 dark:text-amber-200'
                    : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-800/80 text-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {simResult.allowed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    )}
                    <span className="font-bold text-sm">
                      {simResult.allowed ? 'COMMITMENT PERMITTED' : 'TRANSACTION REJECTED — HARD BLOCK'}
                    </span>
                  </div>

                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700">
                    Rule Mode: {simResult.ruleMode}
                  </span>
                </div>

                <p className="text-xs mt-2 font-sans">{simResult.message}</p>

                <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-3 gap-2 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 uppercase font-sans block">Available Before</span>
                    <span className="font-bold text-slate-900 dark:text-white">{simResult.availableBefore.toLocaleString()} {currency}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 uppercase font-sans block">Available After</span>
                    <span className={`font-bold ${simResult.availableAfter < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-cyan-600 dark:text-cyan-400'}`}>
                      {simResult.availableAfter.toLocaleString()} {currency}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 uppercase font-sans block">Post-Action Utilization</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{simResult.utilizationAfterPercent}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Active Restriction Rules Registry */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Configured Budget Restriction Rules</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-sans">
                    <th className="p-3 font-bold">Cost Center</th>
                    <th className="p-3 font-bold">GL Category</th>
                    <th className="p-3 font-bold">Enforcement Mode</th>
                    <th className="p-3 font-bold text-right">Soft Threshold</th>
                    <th className="p-3 font-bold text-right">Hard Threshold</th>
                    <th className="p-3 font-bold text-right">Tolerance Buffer</th>
                    <th className="p-3 font-bold">Designated Signoff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                  {restrictionRules.map(rul => (
                    <tr key={rul.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-sans">
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{rul.costCenterCode}</span>
                        <p className="text-slate-900 dark:text-white font-bold text-xs mt-0.5">{rul.costCenterName}</p>
                      </td>
                      <td className="p-3 font-sans text-slate-700 dark:text-slate-300">{rul.accountCategory}</td>
                      <td className="p-3 font-sans">
                        <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                          rul.controlMode === 'Hard Block'
                            ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                            : rul.controlMode === 'Manager Override'
                            ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                            : 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                        }`}>
                          {rul.controlMode}
                        </span>
                      </td>
                      <td className="p-3 text-right text-amber-700 dark:text-amber-400 font-bold">{rul.softWarningThresholdPercent}%</td>
                      <td className="p-3 text-right text-rose-600 dark:text-rose-400 font-bold">{rul.hardThresholdPercent}%</td>
                      <td className="p-3 text-right text-cyan-600 dark:text-cyan-400 font-bold">+{rul.managerOverrideTolerancePercent}%</td>
                      <td className="p-3 font-sans text-slate-700 dark:text-slate-300">{rul.designatedApprover}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Request Virement */}
      {showVirementModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Request Budget Reallocation (Virement)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Submit intra-departmental or cross-cost center fund transfer request.</p>

            <form onSubmit={handleVirementSubmit} className="space-y-4 mt-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Source Cost Center</label>
                  <select
                    value={vFromCc}
                    onChange={(e) => setVFromCc(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="CC-100 (Executive HQ)">CC-100 (Executive HQ)</option>
                    <option value="CC-200 (Muscat Plant)">CC-200 (Muscat Plant)</option>
                    <option value="CC-300 (Sohar Hub)">CC-300 (Sohar Hub)</option>
                    <option value="CC-500 (Commercial)">CC-500 (Commercial)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Destination Cost Center</label>
                  <select
                    value={vToCc}
                    onChange={(e) => setVToCc(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="CC-400 (IT Operations)">CC-400 (IT Operations)</option>
                    <option value="CC-200 (Muscat Plant)">CC-200 (Muscat Plant)</option>
                    <option value="CC-300 (Sohar Hub)">CC-300 (Sohar Hub)</option>
                    <option value="CC-500 (Commercial)">CC-500 (Commercial)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Transfer Amount ({currency})</label>
                <input
                  type="number"
                  required
                  value={vAmount}
                  onChange={(e) => setVAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Business Reason</label>
                <textarea
                  rows={2}
                  required
                  value={vReason}
                  onChange={(e) => setVReason(e.target.value)}
                  placeholder="Explain why funds need to be reallocated..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white mt-1 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowVirementModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  Submit Virement Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetControlView;

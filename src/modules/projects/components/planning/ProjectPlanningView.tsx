// ==========================================
// ARTIFY ERP — MODULE 10.02: PROJECT PLANNING
// Gantt Schedules, Resource Allocations, Baseline Budget & Cash Forecast
// ==========================================

import React, { useState } from 'react';
import { useProjectStore } from '../../services/projectStore';
import { ProjectBudgetLine, ResourceAllocation } from '../../types';
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Activity,
  Layers,
  Sparkles,
  BarChart3
} from 'lucide-react';

export const ProjectPlanningView: React.FC = () => {
  const {
    selectedProject,
    budgetLines,
    createBudgetLine,
    resourceAllocations,
    allocateResource,
    costCodes
  } = useProjectStore();

  const [activeSubTab, setActiveSubTab] = useState<'SCHEDULE_GANTT' | 'RESOURCE_PLANNING' | 'PROJECT_BUDGET' | 'CASH_FORECAST'>('SCHEDULE_GANTT');
  const [showNewBudgetModal, setShowNewBudgetModal] = useState(false);
  const [showNewResourceModal, setShowNewResourceModal] = useState(false);

  // New Budget Line Form State
  const [newBudgetForm, setNewBudgetForm] = useState({
    costCodeNumber: 'CC-MAT-101',
    costCodeName: 'Structural Steel & Heavy Sections',
    category: 'MATERIAL' as ProjectBudgetLine['category'],
    phaseId: selectedProject.phases[0]?.id || 'ph-01',
    phaseName: selectedProject.phases[0]?.phaseName || 'Phase 1: Deep Foundation',
    baselineBudget: 150000,
    revisedBudget: 150000
  });

  // New Resource Form State
  const [newResourceForm, setNewResourceForm] = useState({
    projectId: selectedProject.id,
    resourceName: '',
    resourceRole: 'PROJECT_ENGINEER' as ResourceAllocation['resourceRole'],
    resourceType: 'INTERNAL_STAFF' as ResourceAllocation['resourceType'],
    allocatedDailyHours: 8,
    hourlyBillingRate: 40,
    hourlyCostRate: 22,
    assignedWbsActivities: ['1.1.02'],
    startDate: selectedProject.startDate,
    endDate: selectedProject.targetCompletionDate,
    utilizationPercent: 100
  });

  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedCode = costCodes.find(c => c.codeNumber === newBudgetForm.costCodeNumber);
    const matchedPhase = selectedProject.phases.find(p => p.id === newBudgetForm.phaseId);

    createBudgetLine({
      costCodeId: matchedCode?.id || 'cc-101',
      costCodeNumber: newBudgetForm.costCodeNumber,
      costCodeName: matchedCode?.name || newBudgetForm.costCodeName,
      category: matchedCode?.category || 'MATERIAL',
      phaseId: newBudgetForm.phaseId,
      phaseName: matchedPhase?.phaseName || 'Phase 1',
      baselineBudget: newBudgetForm.baselineBudget,
      revisedBudget: newBudgetForm.revisedBudget
    });
    setShowNewBudgetModal(false);
  };

  const handleAllocateResource = (e: React.FormEvent) => {
    e.preventDefault();
    allocateResource(newResourceForm);
    setShowNewResourceModal(false);
  };

  // Mock Cash Forecast calculation
  const cashForecastMonths = [
    { month: '2026-06', plannedCapex: 40000, plannedMat: 180000, plannedLab: 65000, plannedSub: 50000, totalOut: 335000, inflow: 450000, net: 115000, cum: 350000 },
    { month: '2026-07', plannedCapex: 25000, plannedMat: 220000, plannedLab: 72000, plannedSub: 60000, totalOut: 377000, inflow: 520000, net: 143000, cum: 493000 },
    { month: '2026-08', plannedCapex: 15000, plannedMat: 160000, plannedLab: 58000, plannedSub: 80000, totalOut: 313000, inflow: 390000, net: 77000, cum: 570000 },
    { month: '2026-09', plannedCapex: 50000, plannedMat: 140000, plannedLab: 50000, plannedSub: 95000, totalOut: 335000, inflow: 480000, net: 145000, cum: 715000 },
    { month: '2026-10', plannedCapex: 10000, plannedMat: 90000, plannedLab: 45000, plannedSub: 110000, totalOut: 255000, inflow: 350000, net: 95000, cum: 810000 },
    { month: '2026-11', plannedCapex: 5000, plannedMat: 40000, plannedLab: 30000, plannedSub: 60000, totalOut: 135000, inflow: 280000, net: 145000, cum: 955000 }
  ];

  return (
    <div id="project-planning-module" className="space-y-6">
      {/* Sub-module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-widest text-purple-400 bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-800">
                10.02 — Project Planning & Controls
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {selectedProject.projectCode}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mt-1">
              Critical Path Scheduling, Resource Loading & Budgets
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'PROJECT_BUDGET' && (
            <button
              onClick={() => setShowNewBudgetModal(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Budget Line</span>
            </button>
          )}
          {activeSubTab === 'RESOURCE_PLANNING' && (
            <button
              onClick={() => setShowNewResourceModal(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Allocate Resource</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('SCHEDULE_GANTT')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeSubTab === 'SCHEDULE_GANTT'
              ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>CPM Gantt Schedule</span>
        </button>
        <button
          onClick={() => setActiveSubTab('RESOURCE_PLANNING')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeSubTab === 'RESOURCE_PLANNING'
              ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Resource Allocation ({resourceAllocations.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('PROJECT_BUDGET')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeSubTab === 'PROJECT_BUDGET'
              ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Project Budget Matrix ({budgetLines.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('CASH_FORECAST')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeSubTab === 'CASH_FORECAST'
              ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Cash Inflow & Outflow Forecast</span>
        </button>
      </div>

      {/* SUB-TAB 1: CPM GANTT SCHEDULE */}
      {activeSubTab === 'SCHEDULE_GANTT' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Interactive Critical Path Method (CPM) Schedule</span>
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-bold uppercase">
                  Zero-Float Critical Activities
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Visual timeline showing early start, late finish, float variance, and physical progress
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <div className="w-3 h-3 rounded-sm bg-rose-500" />
                <span>Critical Path (0 Float)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <div className="w-3 h-3 rounded-sm bg-purple-500" />
                <span>Standard Activity</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                <span>Completed</span>
              </div>
            </div>
          </div>

          {/* Timeline Gantt Representation */}
          <div className="space-y-4">
            {selectedProject.phases?.map(phase => (
              <div key={phase.id} className="space-y-2">
                <div className="bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-bold text-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400">Phase {phase.phaseSequence}:</span>
                    <span>{phase.phaseName}</span>
                  </div>
                  <span className="text-slate-400 font-mono font-normal">
                    {phase.startDate} to {phase.endDate} ({phase.completionPercent}% Complete)
                  </span>
                </div>

                <div className="space-y-2 pl-4">
                  {phase.activities?.map(act => {
                    const isCrit = act.isCriticalPath;
                    return (
                      <div key={act.id} className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 hover:border-purple-500/40 transition-all text-xs">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-purple-400">{act.wbsCode}</span>
                            <span className="font-semibold text-white">{act.activityName}</span>
                            {isCrit && (
                              <span className="px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-400 border border-rose-800 text-[10px] font-bold">
                                CPM CRITICAL
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                            <span>{act.startDate} → {act.endDate}</span>
                            <span className="font-bold text-white">{act.durationDays} Days</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              act.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-400' : 'bg-blue-950 text-blue-400'
                            }`}>
                              {act.progressPercent}%
                            </span>
                          </div>
                        </div>

                        {/* Interactive Gantt Bar Simulation */}
                        <div className="w-full bg-slate-800 rounded-full h-3 mt-2.5 overflow-hidden flex items-center">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              act.status === 'COMPLETED'
                                ? 'bg-emerald-500'
                                : isCrit
                                ? 'bg-gradient-to-r from-rose-600 to-rose-400'
                                : 'bg-gradient-to-r from-purple-600 to-indigo-500'
                            }`}
                            style={{ width: `${Math.max(8, act.progressPercent)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: RESOURCE ALLOCATION */}
      {activeSubTab === 'RESOURCE_PLANNING' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white">Project Resource Loading & Manpower Plan</h2>
              <p className="text-xs text-slate-400">Allocated site engineers, certified specialists, and heavy riggers</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Target Utilization Baseline: <strong className="text-emerald-400">95%+</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Resource Personnel</th>
                  <th className="py-3 px-4">Trade / Specialization</th>
                  <th className="py-3 px-4">Employment Type</th>
                  <th className="py-3 px-4">Daily Hours</th>
                  <th className="py-3 px-4 text-right">Cost Rate / Hr</th>
                  <th className="py-3 px-4 text-right">Billing Rate / Hr</th>
                  <th className="py-3 px-4">Utilization</th>
                  <th className="py-3 px-4">Allocated Dates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {resourceAllocations.map(res => (
                  <tr key={res.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold text-[10px]">
                        {res.resourceName.charAt(0)}
                      </div>
                      {res.resourceName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-200">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                        {res.resourceRole}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {res.resourceType}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-white">
                      {res.allocatedDailyHours} hrs/day
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-amber-400">
                      {selectedProject.currency} {res.hourlyCostRate}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-emerald-400 font-semibold">
                      {selectedProject.currency} {res.hourlyBillingRate}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{res.utilizationPercent}%</span>
                        <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${res.utilizationPercent}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono">
                      {res.startDate} → {res.endDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PROJECT BUDGET MATRIX */}
      {activeSubTab === 'PROJECT_BUDGET' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white">Cost Breakdown Structure (CBS) Budget Matrix</h2>
              <p className="text-xs text-slate-400">Baseline vs. committed vs. actual expenditures per cost code line</p>
            </div>
            <div className="text-xs text-slate-300 font-mono">
              Total Budget: <strong className="text-emerald-400">{selectedProject.currency} {selectedProject.totalBudget.toLocaleString()}</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Cost Code</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Project Phase</th>
                  <th className="py-3 px-4 text-right">Baseline Budget</th>
                  <th className="py-3 px-4 text-right">Committed</th>
                  <th className="py-3 px-4 text-right">Actual Cost</th>
                  <th className="py-3 px-4 text-right">Variance (Under/Over)</th>
                  <th className="py-3 px-4 text-right">Forecast (EAC)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {budgetLines.map(bgt => {
                  const isOver = bgt.actualCost > bgt.revisedBudget;
                  return (
                    <tr key={bgt.id} className="hover:bg-slate-800/40 transition-colors font-mono">
                      <td className="py-3 px-4 font-bold text-purple-400">
                        {bgt.costCodeNumber}
                      </td>
                      <td className="py-3 px-4 font-sans font-medium text-white">
                        {bgt.costCodeName}
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">
                          {bgt.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-400">
                        {bgt.phaseName}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-200">
                        {selectedProject.currency} {bgt.baselineBudget.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-blue-400">
                        {selectedProject.currency} {bgt.committedCost.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-amber-400 font-bold">
                        {selectedProject.currency} {bgt.actualCost.toLocaleString()}
                      </td>
                      <td className={`py-3 px-4 text-right font-bold ${isOver ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {selectedProject.currency} {bgt.varianceAmount.toLocaleString()} ({bgt.variancePercent}%)
                      </td>
                      <td className="py-3 px-4 text-right text-purple-300 font-bold">
                        {selectedProject.currency} {bgt.forecastAtCompletion.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: CASH INFLOW & OUTFLOW FORECAST */}
      {activeSubTab === 'CASH_FORECAST' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <span>Monthly Cash Flow S-Curve Projection (2026)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Projected milestone client payment receipts vs. direct vendor/labor cash disbursements
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
              Project Liquidity Status: Healthy Positive Surplus
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4 text-right">Direct Material</th>
                  <th className="py-3 px-4 text-right">Site Labor</th>
                  <th className="py-3 px-4 text-right">Equipment / Plant</th>
                  <th className="py-3 px-4 text-right">Subcontractors</th>
                  <th className="py-3 px-4 text-right text-rose-400">Total Outflow</th>
                  <th className="py-3 px-4 text-right text-emerald-400">Progress Inflow</th>
                  <th className="py-3 px-4 text-right">Net Cash Flow</th>
                  <th className="py-3 px-4 text-right font-bold text-purple-400">Cumulative Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {cashForecastMonths.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white font-sans">
                      {m.month}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300">
                      {selectedProject.currency} {m.plannedMat.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300">
                      {selectedProject.currency} {m.plannedLab.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300">
                      {selectedProject.currency} {m.plannedCapex.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300">
                      {selectedProject.currency} {m.plannedSub.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-rose-400 font-bold">
                      {selectedProject.currency} {m.totalOut.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-emerald-400 font-bold">
                      {selectedProject.currency} {m.inflow.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-white font-bold">
                      +{selectedProject.currency} {m.net.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-purple-400 font-extrabold text-sm">
                      {selectedProject.currency} {m.cum.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD BUDGET LINE */}
      {showNewBudgetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-xs">
            <h2 className="text-base font-bold text-white">Add Baseline Budget Line to {selectedProject.projectCode}</h2>
            <form onSubmit={handleCreateBudget} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Cost Code</label>
                <select
                  value={newBudgetForm.costCodeNumber}
                  onChange={(e) => setNewBudgetForm({ ...newBudgetForm, costCodeNumber: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {costCodes.map(c => (
                    <option key={c.id} value={c.codeNumber}>{c.codeNumber} — {c.name} ({c.category})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Target Phase</label>
                <select
                  value={newBudgetForm.phaseId}
                  onChange={(e) => setNewBudgetForm({ ...newBudgetForm, phaseId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {selectedProject.phases?.map(ph => (
                    <option key={ph.id} value={ph.id}>{ph.phaseSequence}. {ph.phaseName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Baseline Budget ({selectedProject.currency})</label>
                  <input
                    type="number"
                    required
                    value={newBudgetForm.baselineBudget}
                    onChange={(e) => setNewBudgetForm({ ...newBudgetForm, baselineBudget: Number(e.target.value), revisedBudget: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Approved Revised Budget</label>
                  <input
                    type="number"
                    required
                    value={newBudgetForm.revisedBudget}
                    onChange={(e) => setNewBudgetForm({ ...newBudgetForm, revisedBudget: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewBudgetModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold cursor-pointer"
                >
                  Commit Budget Line
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ALLOCATE RESOURCE */}
      {showNewResourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-xs">
            <h2 className="text-base font-bold text-white">Allocate Resource to {selectedProject.projectCode}</h2>
            <form onSubmit={handleAllocateResource} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Resource Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Engineer Salim Balushi"
                  value={newResourceForm.resourceName}
                  onChange={(e) => setNewResourceForm({ ...newResourceForm, resourceName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Specialization Role</label>
                  <select
                    value={newResourceForm.resourceRole}
                    onChange={(e) => setNewResourceForm({ ...newResourceForm, resourceRole: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="PROJECT_ENGINEER">Project Engineer</option>
                    <option value="SITE_SUPERVISOR">Site Supervisor</option>
                    <option value="CERTIFIED_WELDER">Certified ASME Welder</option>
                    <option value="HEAVY_RIGGER">Heavy Rigger Master</option>
                    <option value="SAFETY_OFFICER">HSE Safety Officer</option>
                    <option value="CRANE_OPERATOR">Crane Operator</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Resource Type</label>
                  <select
                    value={newResourceForm.resourceType}
                    onChange={(e) => setNewResourceForm({ ...newResourceForm, resourceType: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="INTERNAL_STAFF">Internal Direct Staff</option>
                    <option value="SITE_DIRECT_HIRE">Site Direct Hire</option>
                    <option value="SUBCONTRACT_MANPOWER">Subcontract Agency Manpower</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Daily Hours</label>
                  <input
                    type="number"
                    value={newResourceForm.allocatedDailyHours}
                    onChange={(e) => setNewResourceForm({ ...newResourceForm, allocatedDailyHours: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Hourly Cost ({selectedProject.currency})</label>
                  <input
                    type="number"
                    value={newResourceForm.hourlyCostRate}
                    onChange={(e) => setNewResourceForm({ ...newResourceForm, hourlyCostRate: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Billing Rate ({selectedProject.currency})</label>
                  <input
                    type="number"
                    value={newResourceForm.hourlyBillingRate}
                    onChange={(e) => setNewResourceForm({ ...newResourceForm, hourlyBillingRate: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewResourceModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold cursor-pointer"
                >
                  Save Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

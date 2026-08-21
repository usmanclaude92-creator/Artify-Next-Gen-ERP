// ==========================================
// ARTIFY ERP — MODULE 17: COMPLIANCE, RISK & AUDIT
// 17.03 — Internal Controls View (COSO & SoD)
// ==========================================

import React, { useState } from 'react';
import { useComplianceStore } from '../../services/complianceStore';
import { ControlActivity, ApprovalControlRule, SoDConflictRule, ControlTestRecord } from '../../types';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Layers,
  KeyRound,
  FileCheck,
  SlidersHorizontal,
  X
} from 'lucide-react';

export const InternalControlsView: React.FC = () => {
  const {
    controlActivities,
    approvalRules,
    sodRules,
    controlTests,
    addControlActivity,
    recordControlTest,
    resolveSodViolation
  } = useComplianceStore();

  const [activeTab, setActiveTab] = useState<'framework' | 'approval' | 'sod' | 'testing'>('framework');
  const [selectedProcessArea, setSelectedProcessArea] = useState<string>('ALL');
  const [ctrlSearch, setCtrlSearch] = useState('');

  // Modals
  const [isAddCtrlOpen, setIsAddCtrlOpen] = useState(false);
  const [isRecordTestOpen, setIsRecordTestOpen] = useState(false);
  const [selectedSodConflict, setSelectedSodConflict] = useState<{
    ruleId: string;
    userId: string;
    userName: string;
  } | null>(null);
  const [mitigatingInput, setMitigatingInput] = useState('');
  const [approvedByInput, setApprovedByInput] = useState('Chief Financial Officer');

  // Form for new control
  const [ctrlForm, setCtrlForm] = useState<Omit<ControlActivity, 'id'>>({
    code: '',
    processArea: 'PROCURE_TO_PAY',
    controlName: '',
    controlObjective: '',
    controlType: 'PREVENTATIVE',
    frequency: 'CONTINUOUS',
    ownerRole: '',
    automatedOrManual: 'AUTOMATED',
    keyControl: true,
    status: 'NOT_TESTED',
    lastTestedDate: '-',
    testResult: 'PASS'
  });

  // Form for control test
  const [testForm, setTestForm] = useState<Omit<ControlTestRecord, 'id'>>({
    controlCode: controlActivities[0]?.code || '',
    testPeriod: '2026-Q1 Fieldwork',
    testerName: 'Nasser Al-Harthy (Senior Internal Auditor)',
    sampleSize: 30,
    exceptionsIdentified: 0,
    testConclusion: 'OPERATING_EFFECTIVELY',
    walkthroughNotes: '',
    workpaperReference: `WP-IA-2026Q1-${Date.now().toString().slice(-3)}`,
    completedDate: new Date().toISOString().split('T')[0]
  });

  const filteredControls = controlActivities.filter(c => {
    const matchesSearch =
      c.code.toLowerCase().includes(ctrlSearch.toLowerCase()) ||
      c.controlName.toLowerCase().includes(ctrlSearch.toLowerCase()) ||
      c.ownerRole.toLowerCase().includes(ctrlSearch.toLowerCase());
    const matchesArea = selectedProcessArea === 'ALL' || c.processArea === selectedProcessArea;
    return matchesSearch && matchesArea;
  });

  const handleAddCtrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ctrlForm.code || !ctrlForm.controlName || !ctrlForm.ownerRole) return;
    addControlActivity(ctrlForm);
    setIsAddCtrlOpen(false);
    setCtrlForm({
      code: '',
      processArea: 'PROCURE_TO_PAY',
      controlName: '',
      controlObjective: '',
      controlType: 'PREVENTATIVE',
      frequency: 'CONTINUOUS',
      ownerRole: '',
      automatedOrManual: 'AUTOMATED',
      keyControl: true,
      status: 'NOT_TESTED',
      lastTestedDate: '-',
      testResult: 'PASS'
    });
  };

  const handleRecordTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testForm.controlCode || !testForm.walkthroughNotes) return;
    recordControlTest(testForm);
    setIsRecordTestOpen(false);
  };

  const handleResolveSod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSodConflict || !mitigatingInput) return;
    resolveSodViolation(
      selectedSodConflict.ruleId,
      selectedSodConflict.userId,
      mitigatingInput,
      approvedByInput
    );
    setSelectedSodConflict(null);
    setMitigatingInput('');
  };

  return (
    <div className="space-y-6">
      {/* Submodule Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              17.03
            </span>
            <h2 className="text-xl font-bold text-slate-900">COSO Internal Controls & Segregation of Duties (SoD)</h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Enterprise key control matrix, Delegation of Authority (DOA) financial thresholds, automated SoD conflict matrices, and control effectiveness workpapers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'framework' && (
            <button
              onClick={() => setIsAddCtrlOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" /> Define Key Control
            </button>
          )}
          {activeTab === 'testing' && (
            <button
              onClick={() => setIsRecordTestOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" /> Log Control Walkthrough Test
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('framework')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'framework'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Control Matrix ({controlActivities.length})
        </button>
        <button
          onClick={() => setActiveTab('approval')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'approval'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" /> Approval Limits (DOA) ({approvalRules.length})
        </button>
        <button
          onClick={() => setActiveTab('sod')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'sod'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Lock className="w-4 h-4" /> Segregation of Duties ({sodRules.length})
        </button>
        <button
          onClick={() => setActiveTab('testing')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'testing'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-4 h-4" /> Walkthrough Testing ({controlTests.length})
        </button>
      </div>

      {/* 1. CONTROL FRAMEWORK */}
      {activeTab === 'framework' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search control by code, name, owner..."
                value={ctrlSearch}
                onChange={e => setCtrlSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <select
                value={selectedProcessArea}
                onChange={e => setSelectedProcessArea(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Process Cycles</option>
                <option value="PROCURE_TO_PAY">Procure-to-Pay (P2P)</option>
                <option value="ORDER_TO_CASH">Order-to-Cash (O2C)</option>
                <option value="RECORD_TO_REPORT">Record-to-Report (R2R)</option>
                <option value="TREASURY">Treasury & Payments</option>
                <option value="FIXED_ASSETS">Fixed Assets</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Control Code & Area</th>
                    <th className="px-4 py-3">Control Description & Objective</th>
                    <th className="px-4 py-3">Type & Nature</th>
                    <th className="px-4 py-3">Frequency</th>
                    <th className="px-4 py-3">Assigned Owner</th>
                    <th className="px-4 py-3 text-center">Design Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredControls.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                            {c.code}
                          </span>
                          {c.keyControl && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[10px]">
                              KEY
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-1">
                          {c.processArea.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4 max-w-md">
                        <p className="font-semibold text-slate-900 text-xs">{c.controlName}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{c.controlObjective}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-medium text-slate-800 block">{c.controlType}</span>
                        <span className="text-[11px] text-slate-400">{c.automatedOrManual}</span>
                      </td>
                      <td className="px-4 py-4 font-mono text-xs text-slate-600">{c.frequency}</td>
                      <td className="px-4 py-4 text-xs font-medium text-slate-800">{c.ownerRole}</td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            c.status === 'EFFECTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : c.status === 'DEFICIENT'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {c.status === 'EFFECTIVE' && <CheckCircle2 className="w-3 h-3" />}
                          {c.status === 'DEFICIENT' && <AlertOctagon className="w-3 h-3" />}
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. APPROVAL CONTROLS (DOA) */}
      {activeTab === 'approval' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {approvalRules.map(rule => (
              <div key={rule.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                    {rule.ruleCode}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                    {rule.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{rule.workflowName}</h4>
                  <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Monetary Threshold</span>
                    <strong className="text-sm font-mono text-slate-900">
                      OMR {rule.thresholdMinOMR.toLocaleString()} — OMR {rule.thresholdMaxOMR.toLocaleString()}
                    </strong>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5">
                  <strong className="text-[11px] font-bold text-slate-700 block">Required Dual Approvers:</strong>
                  <div className="flex flex-wrap gap-1.5">
                    {rule.requiredApprovers.map((appr, i) => (
                      <span key={i} className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 font-medium text-[11px]">
                        {appr}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Self-Approval: <strong>Forbidden</strong></span>
                  <span>Active Violations: <strong className="text-emerald-600">0</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SEGREGATION OF DUTIES (SoD) */}
      {activeTab === 'sod' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base">Incompatible Role Conflict Analyzer</h3>
              <p className="text-xs text-slate-500">
                Continuous automated scans detecting users holding conflicting transactional roles across modules.
              </p>
            </div>

            <div className="divide-y divide-slate-200">
              {sodRules.map(sod => (
                <div key={sod.id} className="p-5 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        {sod.ruleCode}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{sod.conflictTitle}</h4>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        sod.severity === 'CRITICAL'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {sod.severity} Risk
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Incompatible Role A</span>
                      <strong className="text-slate-800">{sod.incompatibleRoleA}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Incompatible Role B</span>
                      <strong className="text-slate-800">{sod.incompatibleRoleB}</strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{sod.riskDescription}</p>

                  {/* Active Violations List */}
                  {sod.activeViolations.length > 0 ? (
                    <div className="mt-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        Active User Conflict Identified ({sod.activeViolations.length})
                      </div>
                      {sod.activeViolations.map((v, i) => (
                        <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-2.5 bg-white rounded-lg border border-amber-200 text-xs">
                          <div>
                            <strong className="text-slate-900">{v.userName}</strong> ({v.department})
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Mitigating Control: {v.mitigatingControl || 'None assigned'}
                            </p>
                            {v.exceptionApprovedBy && (
                              <p className="text-[10px] text-emerald-700 font-mono">
                                Waiver Approved By: {v.exceptionApprovedBy}
                              </p>
                            )}
                          </div>
                          {!v.exceptionApprovedBy && (
                            <button
                              onClick={() =>
                                setSelectedSodConflict({
                                  ruleId: sod.id,
                                  userId: v.userId,
                                  userName: v.userName
                                })
                              }
                              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs transition cursor-pointer"
                            >
                              Assign Mitigating Control
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" /> Zero active SoD conflicts across all company branches
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. CONTROL TESTING */}
      {activeTab === 'testing' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base">Internal Control Sample Testing Workpapers</h3>
              <p className="text-xs text-slate-500">
                Formal walkthrough results, sample populations, and operational effectiveness conclusions.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Workpaper Ref & Date</th>
                    <th className="px-4 py-3">Target Control Code</th>
                    <th className="px-4 py-3">Auditor / Tester</th>
                    <th className="px-4 py-3">Sample & Exceptions</th>
                    <th className="px-4 py-3">Walkthrough Notes</th>
                    <th className="px-4 py-3">Conclusion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {controlTests.map(test => (
                    <tr key={test.id} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs font-bold text-slate-900">{test.workpaperReference}</span>
                        <span className="text-[11px] text-slate-400 block">{test.completedDate}</span>
                      </td>
                      <td className="px-4 py-4 font-mono font-bold text-xs text-slate-800">{test.controlCode}</td>
                      <td className="px-4 py-4 text-xs text-slate-700">{test.testerName}</td>
                      <td className="px-4 py-4 text-xs font-mono">
                        <span>Tested: {test.sampleSize}</span>
                        <span className={`block font-bold ${test.exceptionsIdentified > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          Exceptions: {test.exceptionsIdentified}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-600 max-w-sm">{test.walkthroughNotes}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            test.testConclusion === 'OPERATING_EFFECTIVELY'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {test.testConclusion.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD CONTROL */}
      {isAddCtrlOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg">Define Key Internal Control</h3>
              <button onClick={() => setIsAddCtrlOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCtrlSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Control Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CTRL-TRE-05"
                    value={ctrlForm.code}
                    onChange={e => setCtrlForm({ ...ctrlForm, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Process Area</label>
                  <select
                    value={ctrlForm.processArea}
                    onChange={e => setCtrlForm({ ...ctrlForm, processArea: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="PROCURE_TO_PAY">Procure-to-Pay (P2P)</option>
                    <option value="ORDER_TO_CASH">Order-to-Cash (O2C)</option>
                    <option value="RECORD_TO_REPORT">Record-to-Report (R2R)</option>
                    <option value="TREASURY">Treasury</option>
                    <option value="FIXED_ASSETS">Fixed Assets</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Control Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bank Master Account Signatory Verification"
                  value={ctrlForm.controlName}
                  onChange={e => setCtrlForm({ ...ctrlForm, controlName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Control Objective</label>
                <textarea
                  rows={2}
                  value={ctrlForm.controlObjective}
                  onChange={e => setCtrlForm({ ...ctrlForm, controlObjective: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={ctrlForm.controlType}
                    onChange={e => setCtrlForm({ ...ctrlForm, controlType: e.target.value as any })}
                    className="w-full px-2 py-2 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="PREVENTATIVE">Preventative</option>
                    <option value="DETECTIVE">Detective</option>
                    <option value="CORRECTIVE">Corrective</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Execution</label>
                  <select
                    value={ctrlForm.automatedOrManual}
                    onChange={e => setCtrlForm({ ...ctrlForm, automatedOrManual: e.target.value as any })}
                    className="w-full px-2 py-2 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="AUTOMATED">Automated</option>
                    <option value="MANUAL">Manual</option>
                    <option value="IT_DEPENDENT_MANUAL">IT-Dependent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Frequency</label>
                  <select
                    value={ctrlForm.frequency}
                    onChange={e => setCtrlForm({ ...ctrlForm, frequency: e.target.value as any })}
                    className="w-full px-2 py-2 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="CONTINUOUS">Continuous</option>
                    <option value="DAILY">Daily</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="ANNUAL">Annual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Owner Role *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Treasury Operations Lead"
                  value={ctrlForm.ownerRole}
                  onChange={e => setCtrlForm({ ...ctrlForm, ownerRole: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCtrlOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition cursor-pointer shadow-sm"
                >
                  Save Control
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD TEST */}
      {isRecordTestOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg">Record Control Walkthrough Test</h3>
              <button onClick={() => setIsRecordTestOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordTestSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Control</label>
                <select
                  value={testForm.controlCode}
                  onChange={e => setTestForm({ ...testForm, controlCode: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                >
                  {controlActivities.map(c => (
                    <option key={c.id} value={c.code}>
                      {c.code} — {c.controlName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sample Size Tested</label>
                  <input
                    type="number"
                    min="1"
                    value={testForm.sampleSize}
                    onChange={e => setTestForm({ ...testForm, sampleSize: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Exceptions Identified</label>
                  <input
                    type="number"
                    min="0"
                    value={testForm.exceptionsIdentified}
                    onChange={e => setTestForm({ ...testForm, exceptionsIdentified: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Test Conclusion</label>
                <select
                  value={testForm.testConclusion}
                  onChange={e => setTestForm({ ...testForm, testConclusion: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="OPERATING_EFFECTIVELY">Operating Effectively (Pass)</option>
                  <option value="SIGNIFICANT_DEFICIENCY">Significant Deficiency</option>
                  <option value="MATERIAL_WEAKNESS">Material Weakness (Fail)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Walkthrough Notes & Observations *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed testing results and sample transaction voucher numbers..."
                  value={testForm.walkthroughNotes}
                  onChange={e => setTestForm({ ...testForm, walkthroughNotes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecordTestOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition cursor-pointer shadow-sm"
                >
                  Save Test Workpaper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN SOD MITIGATING CONTROL */}
      {selectedSodConflict && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg">SoD Exception Mitigating Control</h3>
              <button onClick={() => setSelectedSodConflict(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResolveSod} className="space-y-4 text-sm">
              <p className="text-xs text-slate-600">
                User: <strong>{selectedSodConflict.userName}</strong>
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Compensating / Mitigating Control *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Monthly independent inventory audit and CFO journal review"
                  value={mitigatingInput}
                  onChange={e => setMitigatingInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Executive Waiver Approver</label>
                <input
                  type="text"
                  required
                  value={approvedByInput}
                  onChange={e => setApprovedByInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSodConflict(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition cursor-pointer shadow-sm"
                >
                  Approve Exception
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

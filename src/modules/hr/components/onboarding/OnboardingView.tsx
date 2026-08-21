// ==========================================
// ARTIFY ERP — MODULE 09: HUMAN RESOURCES (HR)
// 09.03: Employee Onboarding View
// (Joining Process, Document Collection, Induction, Asset Custody)
// ==========================================

import React, { useState } from 'react';
import { useHrStore } from '../../services/hrStore';
import { OnboardingWorkflow, CompanyAsset, OnboardingStage } from '../../types';
import { ERPRouteState } from '../../../../types/erp';
import {
  UserCheck,
  CheckSquare,
  FileCheck2,
  GraduationCap,
  Laptop,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  User,
  Building,
  ChevronRight,
  X,
  Smartphone,
  HardHat,
  Key
} from 'lucide-react';

interface OnboardingViewProps {
  initialTab?: 'joining' | 'docs' | 'induction' | 'assets';
  onNavigate: (route: ERPRouteState) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  initialTab = 'joining',
  onNavigate
}) => {
  const {
    employees,
    onboardingWorkflows,
    companyAssets,
    toggleOnboardingTask,
    updateOnboardingStage,
    assignAsset,
    returnAsset,
    addCompanyAsset
  } = useHrStore();

  const [activeTab, setActiveTab] = useState<'joining' | 'docs' | 'induction' | 'assets'>(initialTab);
  const [selectedWorkflow, setSelectedWorkflow] = useState<OnboardingWorkflow | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAssetForAssign, setSelectedAssetForAssign] = useState<CompanyAsset | null>(null);
  const [assignEmpId, setAssignEmpId] = useState(employees[0]?.id || '');

  const stages: { key: OnboardingStage; label: string }[] = [
    { key: 'PRE_ARRIVAL', label: 'Pre-Arrival' },
    { key: 'DAY_ONE', label: 'Day 1 Orientation' },
    { key: 'WEEK_ONE', label: 'Week 1 Deep Dive' },
    { key: 'MONTH_ONE', label: 'Month 1 Check-in' },
    { key: 'PROBATION_REVIEW', label: '90-Day Probation Review' },
    { key: 'COMPLETED', label: 'Confirmed Full-Time' }
  ];

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('joining')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'joining'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Joining Pipelines ({onboardingWorkflows.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'docs'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Document Intake Verification</span>
          </button>

          <button
            onClick={() => setActiveTab('induction')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'induction'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Induction & Mentorship</span>
          </button>

          <button
            onClick={() => setActiveTab('assets')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'assets'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>Asset Assignment & Custody ({companyAssets.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: JOINING WORKFLOWS */}
      {activeTab === 'joining' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {onboardingWorkflows.map(wf => (
              <div
                key={wf.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {wf.id}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1.5">{wf.employeeName}</h4>
                      <p className="text-xs text-slate-400">{wf.designation} • {wf.department}</p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {wf.stage.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Onboarding Completion</span>
                      <span className="font-bold text-emerald-400">{wf.completionPercentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${wf.completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Checklist Summary */}
                  <div className="mt-4 space-y-2">
                    <div className="text-xs font-semibold text-slate-300">Milestone Action Items:</div>
                    <div className="space-y-1.5">
                      {wf.tasks.map(task => (
                        <div
                          key={task.id}
                          onClick={() => toggleOnboardingTask(wf.id, task.id)}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer hover:bg-slate-800 transition-all text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={task.isCompleted}
                              onChange={() => {}}
                              className="rounded border-slate-700 text-rose-500 focus:ring-rose-500"
                            />
                            <span className={task.isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}>
                              {task.title}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">{task.dueDate}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Mentor: <strong className="text-white">{wf.mentorName}</strong></span>
                  <button
                    onClick={() => setSelectedWorkflow(wf)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg font-medium transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DOCUMENT COLLECTION INTAKE */}
      {activeTab === 'docs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-rose-400" />
              New Hire Document Intake & Compliance Checklist
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Verify pre-employment background verification documents before granting full enterprise system access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Hamdan Al-Suwaidi (Cloud Security)</h4>
                <span className="text-xs text-emerald-400 font-bold">4 of 4 Verified</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 flex items-center justify-between">
                  <span className="text-slate-200">1. Signed Employment Contract & IP Agreement</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">VERIFIED</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 flex items-center justify-between">
                  <span className="text-slate-200">2. Attested Bachelor Degree & Transcripts</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">VERIFIED</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 flex items-center justify-between">
                  <span className="text-slate-200">3. Police Good Conduct Certificate</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">VERIFIED</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 flex items-center justify-between">
                  <span className="text-slate-200">4. Bank Account Verification Slip & IBAN</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">VERIFIED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INDUCTION & MENTORSHIP */}
      {activeTab === 'induction' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-rose-400" />
              Corporate Induction & Buddy Mentorship Schedule
            </h3>
            <p className="text-xs text-slate-400 mt-1">Structured orientation sessions and 90-day progress check-ins.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">SESSION 01</span>
              <h4 className="text-sm font-bold text-white">Artify Corporate Vision & Values</h4>
              <p className="text-xs text-slate-400">Conducted by Dr. Rashid Al-Mansoor (COO)</p>
              <div className="pt-2 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Completed
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">SESSION 02</span>
              <h4 className="text-sm font-bold text-white">EHS & Industrial Safety Protocols</h4>
              <p className="text-xs text-slate-400">Conducted by Eng. Sarah Al-Harthy (QA Lead)</p>
              <div className="pt-2 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Completed
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">SESSION 03</span>
              <h4 className="text-sm font-bold text-white">IT Security, VPN & 2FA Setup</h4>
              <p className="text-xs text-slate-400">Conducted by Cloud NOC Team</p>
              <div className="pt-2 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Completed
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ASSET ASSIGNMENT & CUSTODY */}
      {activeTab === 'assets' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-rose-400" />
                  Hardware & Facility Asset Custody Registry
                </h3>
                <p className="text-xs text-slate-400 mt-1">Laptops, Mobile SIMs, Security Badges, and Handover Receipts.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companyAssets.map(asset => (
                <div key={asset.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {asset.assetTag}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        asset.status === 'ASSIGNED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      }`}>
                        {asset.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mt-2">{asset.assetName}</h4>
                    <p className="text-xs text-slate-400 font-mono">S/N: {asset.serialNumber}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-700/60 text-xs space-y-2">
                    {asset.assignedToEmployeeName ? (
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Assigned to: <strong className="text-rose-400">{asset.assignedToEmployeeName}</strong></span>
                        <button
                          onClick={() => returnAsset(asset.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-semibold"
                        >
                          Return Asset
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Ready in Store</span>
                        <button
                          onClick={() => {
                            setSelectedAssetForAssign(asset);
                            setShowAssignModal(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold"
                        >
                          Assign to Employee
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN ASSET MODAL */}
      {showAssignModal && selectedAssetForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Laptop className="w-5 h-5 text-rose-400" />
                Assign {selectedAssetForAssign.assetName}
              </h3>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Select Employee</label>
                <select
                  value={assignEmpId}
                  onChange={e => setAssignEmpId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.fullName} ({e.department})</option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300">
                <p className="text-[11px]">
                  Digital handover custody receipt will be generated and sent for electronic signature.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const emp = employees.find(e => e.id === assignEmpId);
                    if (emp) {
                      assignAsset(selectedAssetForAssign.id, emp.id, emp.fullName);
                    }
                    setShowAssignModal(false);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-bold"
                >
                  Confirm Handover
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

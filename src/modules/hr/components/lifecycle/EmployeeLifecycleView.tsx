// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 09: HUMAN RESOURCES (HR)
// 09.07: Employee Lifecycle & Separation View
// (Transfers, Promotions, Disciplinary Actions, Resignations, EOSB Gratuity)
// ==========================================

import React, { useState } from 'react';
import { useHrStore } from '../../services/hrStore';
import { EmployeeTransfer, EmployeePromotion, DisciplinaryRecord, EmployeeSeparation } from '../../types';
import { ERPRouteState } from '../../../../types/erp';
import {
  ArrowRightLeft,
  TrendingUp,
  AlertOctagon,
  UserMinus,
  Calculator,
  Search,
  Plus,
  CheckCircle,
  Clock,
  DollarSign,
  Building,
  User,
  ShieldAlert,
  FileText,
  Briefcase,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';

interface EmployeeLifecycleViewProps {
  initialTab?: 'transfers' | 'promotions' | 'disciplinary' | 'separation';
  onNavigate: (route: ERPRouteState) => void;
}

export const EmployeeLifecycleView: React.FC<EmployeeLifecycleViewProps> = ({
  initialTab = 'transfers',
  onNavigate
}) => {
  const {
    employees,
    transfers,
    promotions,
    disciplinaryRecords,
    separations,
    createTransferRequest,
    updateTransferStatus,
    createPromotionRequest,
    updatePromotionStatus,
    recordDisciplinaryAction,
    initiateSeparation,
    updateSeparationClearance
  } = useHrStore();

  const [activeTab, setActiveTab] = useState<'transfers' | 'promotions' | 'disciplinary' | 'separation'>(initialTab);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [showDisciplinaryModal, setShowDisciplinaryModal] = useState(false);
  const [showSeparationModal, setShowSeparationModal] = useState(false);

  // Transfer Form State
  const [transForm, setTransForm] = useState({
    employeeId: employees[0]?.id || '',
    employeeName: employees[0]?.fullName || '',
    fromDepartment: employees[0]?.department || '',
    toDepartment: 'Commercial Sales & CRM',
    fromBranch: 'Dubai Corporate HQ',
    toBranch: 'Abu Dhabi Branch',
    fromDesignation: employees[0]?.designation || '',
    toDesignation: 'Senior Technical Sales Lead',
    effectiveDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    reason: 'Strategic realignment of industrial project accounts'
  });

  // Promotion Form State
  const [promForm, setPromForm] = useState({
    employeeId: employees[0]?.id || '',
    employeeName: employees[0]?.fullName || '',
    fromGrade: 'G3',
    toGrade: 'G4',
    fromDesignation: 'Senior Process Engineer',
    toDesignation: 'Lead Industrial Operations Manager',
    fromSalary: 22000,
    toSalary: 27500,
    currency: 'AED',
    effectiveDate: '2026-04-01',
    justification: 'Exceeded annual production yield KPIs by 14% and spearheaded energy optimization initiative'
  });

  // Disciplinary Form State
  const [discForm, setDiscForm] = useState({
    employeeId: employees[0]?.id || '',
    employeeName: employees[0]?.fullName || '',
    incidentDate: new Date().toISOString().split('T')[0],
    severity: 'MEDIUM' as const,
    warningLevel: 'FIRST_WRITTEN_WARNING' as const,
    infractionCategory: 'SAFETY_VIOLATION' as const,
    description: 'Bypassed safety interlock switch on milling station during shift handover',
    actionTaken: 'Formal written warning issued and mandatory 4-hour EHS re-certification scheduled',
    conductedBy: 'Eng. Sarah Al-Harthy (QA & Safety Lead)'
  });

  // Separation Form State (with statutory EOSB Gratuity)
  const [sepForm, setSepForm] = useState({
    employeeId: employees[0]?.id || '',
    employeeName: employees[0]?.fullName || '',
    department: employees[0]?.department || '',
    designation: employees[0]?.designation || '',
    separationType: 'RESIGNATION' as const,
    resignationDate: new Date().toISOString().split('T')[0],
    lastWorkingDay: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    reason: 'Relocating overseas with family',
    yearsOfService: 3.8,
    basicSalary: 22000,
    endOfServiceGratuity: 58666.67,
    unutilizedLeavePayout: 11000.00,
    deductions: 0,
    netSettlementAmount: 69666.67,
    currency: 'AED'
  });

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(x => x.id === transForm.employeeId);
    createTransferRequest({
      ...transForm,
      employeeName: emp?.fullName || transForm.employeeName,
      fromDepartment: emp?.department || transForm.fromDepartment,
      fromDesignation: emp?.designation || transForm.fromDesignation
    });
    setShowTransferModal(false);
  };

  const handlePromotionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(x => x.id === promForm.employeeId);
    const inc = ((promForm.toSalary - promForm.fromSalary) / promForm.fromSalary) * 100;
    createPromotionRequest({
      ...promForm,
      employeeName: emp?.fullName || promForm.employeeName,
      incrementPercentage: Math.round(inc * 10) / 10
    });
    setShowPromotionModal(false);
  };

  const handleDisciplinarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(x => x.id === discForm.employeeId);
    recordDisciplinaryAction({
      ...discForm,
      employeeName: emp?.fullName || discForm.employeeName
    });
    setShowDisciplinaryModal(false);
  };

  const handleSeparationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(x => x.id === sepForm.employeeId);
    initiateSeparation({
      ...sepForm,
      employeeName: emp?.fullName || sepForm.employeeName,
      department: emp?.department || sepForm.department,
      designation: emp?.designation || sepForm.designation
    });
    setShowSeparationModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('transfers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'transfers'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Transfers & Mobility ({transfers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('promotions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'promotions'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Promotions & Increments ({promotions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('disciplinary')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'disciplinary'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Disciplinary Registry ({disciplinaryRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('separation')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'separation'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <UserMinus className="w-4 h-4" />
            <span>Separation & EOSB Gratuity ({separations.length})</span>
          </button>
        </div>

        {activeTab === 'transfers' && (
          <button
            onClick={() => setShowTransferModal(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Initiate Transfer</span>
          </button>
        )}

        {activeTab === 'promotions' && (
          <button
            onClick={() => setShowPromotionModal(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Propose Promotion</span>
          </button>
        )}

        {activeTab === 'disciplinary' && (
          <button
            onClick={() => setShowDisciplinaryModal(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Log Infraction</span>
          </button>
        )}

        {activeTab === 'separation' && (
          <button
            onClick={() => setShowSeparationModal(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Initiate Separation</span>
          </button>
        )}
      </div>

      {/* TAB 1: TRANSFERS */}
      {activeTab === 'transfers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transfers.map(tr => (
              <div key={tr.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {tr.transferNumber}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1.5">{tr.employeeName}</h4>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      tr.status === 'APPROVED' || tr.status === 'EFFECTIVE'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {tr.status}
                    </span>
                  </div>

                  {/* Transfer Matrix */}
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs mt-3">
                    <div>
                      <span className="text-slate-400 block text-[11px]">From Department & Location:</span>
                      <span className="font-semibold text-white">{tr.fromDepartment}</span>
                      <span className="text-[10px] text-slate-400 block">{tr.fromBranch}</span>
                    </div>
                    <div>
                      <span className="text-rose-400 block text-[11px] font-bold">To Department & Location:</span>
                      <span className="font-semibold text-white">{tr.toDepartment}</span>
                      <span className="text-[10px] text-rose-300 block">{tr.toBranch}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 italic mt-3">"{tr.reason}"</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Effective Date: <strong className="text-white">{tr.effectiveDate}</strong></span>
                  {tr.status === 'PENDING_APPROVAL' && (
                    <button
                      onClick={() => updateTransferStatus(tr.id, 'APPROVED')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                    >
                      Approve Relocation
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PROMOTIONS */}
      {activeTab === 'promotions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {promotions.map(pr => (
              <div key={pr.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {pr.promotionNumber}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1.5">{pr.employeeName}</h4>
                      <p className="text-xs text-slate-400">{pr.fromDesignation} → <strong className="text-rose-400">{pr.toDesignation}</strong></p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      pr.status === 'APPROVED' || pr.status === 'EFFECTIVE'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {pr.status}
                    </span>
                  </div>

                  {/* Compensation Adjustment */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs mt-3">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Previous Comp:</span>
                      <span className="font-bold text-white">{pr.fromSalary.toLocaleString()} {pr.currency}</span>
                      <span className="text-[10px] text-slate-400 block">Grade {pr.fromGrade}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">New Package:</span>
                      <span className="font-bold text-emerald-400">{pr.toSalary.toLocaleString()} {pr.currency}</span>
                      <span className="text-[10px] text-emerald-300 block">Grade {pr.toGrade}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Increment:</span>
                      <span className="font-bold text-rose-400">+{pr.incrementPercentage}%</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 italic mt-3">"{pr.justification}"</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Effective Date: <strong className="text-white">{pr.effectiveDate}</strong></span>
                  {pr.status === 'PENDING_APPROVAL' && (
                    <button
                      onClick={() => updatePromotionStatus(pr.id, 'APPROVED')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                    >
                      Authorize Promotion
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DISCIPLINARY REGISTRY */}
      {activeTab === 'disciplinary' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-400" />
                Corporate Conduct & Disciplinary Action Registry
              </h3>
              <p className="text-xs text-slate-400 mt-1">Formal incident reports, hearing records, and statutory warnings.</p>
            </div>

            <div className="space-y-3">
              {disciplinaryRecords.map(disc => (
                <div key={disc.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                          {disc.caseNumber}
                        </span>
                        <h4 className="text-sm font-bold text-white">{disc.employeeName}</h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Incident Date: <strong>{disc.incidentDate}</strong> • Category: <strong>{disc.infractionCategory}</strong>
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 self-start">
                      {disc.warningLevel.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 text-xs space-y-1.5">
                    <div className="text-slate-300">
                      <strong className="text-rose-400">Infraction Description: </strong>
                      {disc.description}
                    </div>
                    <div className="text-slate-300">
                      <strong className="text-cyan-400">Action & Corrective Measures: </strong>
                      {disc.actionTaken}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                    <span>Investigated By: <strong className="text-slate-200">{disc.conductedBy}</strong></span>
                    <span className="text-emerald-400 font-semibold">{disc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SEPARATION & EOSB GRATUITY */}
      {activeTab === 'separation' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-rose-400" />
                  Statutory End-of-Service Benefits (EOSB) & Multi-Department Clearance
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Complies with UAE/GCC labor laws (21 days basic salary for first 5 years + 30 days for each additional year).
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {separations.map(sep => (
                <div key={sep.id} className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {sep.separationNumber}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1.5">{sep.employeeName}</h4>
                      <p className="text-xs text-slate-400">{sep.designation} • {sep.department}</p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {sep.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* EOSB Settlement Calculation Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Tenure:</span>
                      <span className="font-bold text-white">{sep.yearsOfService} Years</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Gratuity Payout:</span>
                      <span className="font-bold text-emerald-400">{sep.endOfServiceGratuity.toLocaleString()} {sep.currency}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Leave Encashment:</span>
                      <span className="font-bold text-white">{sep.unutilizedLeavePayout.toLocaleString()} {sep.currency}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Net Final Settlement:</span>
                      <span className="font-bold text-rose-400">{sep.netSettlementAmount.toLocaleString()} {sep.currency}</span>
                    </div>
                  </div>

                  {/* Multi-Department Clearance Matrix */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-300">Departmental Exit Clearance Sign-Offs:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                      <div
                        onClick={() => updateSeparationClearance(sep.id, 'it', !sep.clearanceChecklist.it)}
                        className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          sep.clearanceChecklist.it ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        <span>IT Assets</span>
                        {sep.clearanceChecklist.it ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      </div>

                      <div
                        onClick={() => updateSeparationClearance(sep.id, 'finance', !sep.clearanceChecklist.finance)}
                        className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          sep.clearanceChecklist.finance ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        <span>Finance / Loans</span>
                        {sep.clearanceChecklist.finance ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      </div>

                      <div
                        onClick={() => updateSeparationClearance(sep.id, 'facilities', !sep.clearanceChecklist.facilities)}
                        className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          sep.clearanceChecklist.facilities ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        <span>Facilities / Keys</span>
                        {sep.clearanceChecklist.facilities ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      </div>

                      <div
                        onClick={() => updateSeparationClearance(sep.id, 'hrAdmin', !sep.clearanceChecklist.hrAdmin)}
                        className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          sep.clearanceChecklist.hrAdmin ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        <span>Visa / HR Admin</span>
                        {sep.clearanceChecklist.hrAdmin ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      </div>

                      <div
                        onClick={() => updateSeparationClearance(sep.id, 'lineManager', !sep.clearanceChecklist.lineManager)}
                        className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          sep.clearanceChecklist.lineManager ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        <span>Project Handover</span>
                        {sep.clearanceChecklist.lineManager ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SEPARATION MODAL */}
      {showSeparationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserMinus className="w-5 h-5 text-rose-400" />
                Initiate Employee Separation
              </h3>
              <button onClick={() => setShowSeparationModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSeparationSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Employee</label>
                <select
                  value={sepForm.employeeId}
                  onChange={e => setSepForm({ ...sepForm, employeeId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.fullName} ({e.department})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Separation Type</label>
                <select
                  value={sepForm.separationType}
                  onChange={e => setSepForm({ ...sepForm, separationType: e.target.value as any })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="RESIGNATION">Voluntary Resignation</option>
                  <option value="CONTRACT_END">End of Fixed-Term Contract</option>
                  <option value="RETIREMENT">Statutory Retirement</option>
                  <option value="MUTUAL_AGREEMENT">Mutual Separation Agreement</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Resignation Date</label>
                  <input
                    type="date"
                    value={sepForm.resignationDate}
                    onChange={e => setSepForm({ ...sepForm, resignationDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Last Working Day</label>
                  <input
                    type="date"
                    value={sepForm.lastWorkingDay}
                    onChange={e => setSepForm({ ...sepForm, lastWorkingDay: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Exit Reason</label>
                <input
                  type="text"
                  required
                  value={sepForm.reason}
                  onChange={e => setSepForm({ ...sepForm, reason: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSeparationModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-bold"
                >
                  Initiate Exit & EOSB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

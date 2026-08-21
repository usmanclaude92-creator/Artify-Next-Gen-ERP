// ==========================================
// ARTIFY ERP — MODULE 09: HUMAN RESOURCES (HR)
// 09.05: Benefits & Loans View
// (Benefits Plans, Corporate Loans, Salary Advances, Health Insurance)
// ==========================================

import React, { useState } from 'react';
import { useHrStore } from '../../services/hrStore';
import { BenefitPackage, EmployeeLoan, SalaryAdvance, InsurancePolicy } from '../../types';
import { ERPRouteState } from '../../../../types/erp';
import {
  Gift,
  Coins,
  CreditCard,
  HeartPulse,
  Search,
  Plus,
  CheckCircle,
  Clock,
  DollarSign,
  Building,
  User,
  ShieldCheck,
  Percent,
  Check,
  X,
  FileText
} from 'lucide-react';

interface BenefitsViewProps {
  initialTab?: 'plans' | 'loans' | 'advances' | 'insurance';
  onNavigate: (route: ERPRouteState) => void;
}

export const BenefitsView: React.FC<BenefitsViewProps> = ({
  initialTab = 'plans',
  onNavigate
}) => {
  const {
    employees,
    benefitPackages,
    employeeLoans,
    salaryAdvances,
    insurancePolicies,
    applyForLoan,
    updateLoanStatus,
    requestSalaryAdvance,
    updateSalaryAdvanceStatus
  } = useHrStore();

  const [activeTab, setActiveTab] = useState<'plans' | 'loans' | 'advances' | 'insurance'>(initialTab);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);

  // Loan Form State
  const [loanForm, setLoanForm] = useState({
    employeeId: employees[0]?.id || '',
    employeeName: employees[0]?.fullName || '',
    department: employees[0]?.department || '',
    loanType: 'HOUSING_ASSISTANCE' as const,
    principalAmount: 40000,
    tenureMonths: 12,
    interestRate: 0,
    monthlyDeduction: 3333.33,
    currency: 'AED',
    disbursementDate: new Date().toISOString().split('T')[0],
    deductionStartMonth: '2026-04',
    reason: 'Annual housing lease advance rental payment'
  });

  // Advance Form State
  const [advForm, setAdvForm] = useState({
    employeeId: employees[0]?.id || '',
    employeeName: employees[0]?.fullName || '',
    department: employees[0]?.department || '',
    amount: 5000,
    currency: 'AED',
    recoveryMonth: '2026-04',
    reason: 'Family urgent medical requirement'
  });

  const handleLoanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(x => x.id === loanForm.employeeId);
    const monthly = loanForm.principalAmount / loanForm.tenureMonths;
    applyForLoan({
      ...loanForm,
      employeeName: emp?.fullName || loanForm.employeeName,
      department: emp?.department || loanForm.department,
      monthlyDeduction: Math.round(monthly * 100) / 100
    });
    setShowLoanModal(false);
  };

  const handleAdvanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(x => x.id === advForm.employeeId);
    requestSalaryAdvance({
      ...advForm,
      employeeName: emp?.fullName || advForm.employeeName,
      department: emp?.department || advForm.department
    });
    setShowAdvanceModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'plans'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Corporate Benefit Plans ({benefitPackages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('loans')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'loans'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Employee Loans ({employeeLoans.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('advances')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'advances'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Salary Advances ({salaryAdvances.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('insurance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'insurance'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>Group Health Insurance ({insurancePolicies.length})</span>
          </button>
        </div>

        {activeTab === 'loans' && (
          <button
            onClick={() => setShowLoanModal(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Apply for Loan</span>
          </button>
        )}

        {activeTab === 'advances' && (
          <button
            onClick={() => setShowAdvanceModal(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Request Advance</span>
          </button>
        )}
      </div>

      {/* TAB 1: BENEFIT PLANS */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {benefitPackages.map(pkg => (
              <div key={pkg.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      {pkg.code}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">{pkg.enrolledCount} Enrolled</span>
                  </div>

                  <h4 className="text-base font-bold text-white mt-2">{pkg.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{pkg.description}</p>

                  <div className="mt-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-2">
                    <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Package Inclusions:</div>
                    <ul className="space-y-1.5 text-slate-300">
                      {pkg.inclusions.map((inc, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Target Grades: <strong className="text-white">{pkg.eligibleGrades.join(', ')}</strong></span>
                  <span className="text-emerald-400 font-bold">{pkg.annualAllowanceValue.toLocaleString()} {pkg.currency}/yr</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: EMPLOYEE LOANS */}
      {activeTab === 'loans' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {employeeLoans.map(loan => (
              <div key={loan.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {loan.loanNumber}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1.5">{loan.employeeName}</h4>
                      <p className="text-xs text-slate-400">{loan.loanType.replace('_', ' ')} • {loan.department}</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      loan.status === 'ACTIVE_DISBURSED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : loan.status === 'APPROVED'
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {loan.status}
                    </span>
                  </div>

                  {/* Loan Metrics */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs mt-3">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Principal:</span>
                      <span className="font-bold text-white">{loan.principalAmount.toLocaleString()} {loan.currency}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Monthly Deduct:</span>
                      <span className="font-bold text-rose-400">{loan.monthlyDeduction.toLocaleString()} {loan.currency}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Remaining Bal:</span>
                      <span className="font-bold text-emerald-400">{loan.remainingBalance.toLocaleString()} {loan.currency}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 italic mt-3">"{loan.reason}"</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Tenure: <strong className="text-white">{loan.tenureMonths} Months ({loan.interestRate}% APR)</strong></span>
                  {loan.status === 'REQUESTED' && (
                    <button
                      onClick={() => updateLoanStatus(loan.id, 'ACTIVE_DISBURSED')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                    >
                      Approve & Disburse
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SALARY ADVANCES */}
      {activeTab === 'advances' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-rose-400" />
                  Short-Term Salary Advance Requests
                </h3>
                <p className="text-xs text-slate-400 mt-1">Automatic payroll deduction configured for the specified recovery cycle.</p>
              </div>
            </div>

            <div className="space-y-3">
              {salaryAdvances.map(adv => (
                <div key={adv.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                        {adv.requestNumber}
                      </span>
                      <h4 className="text-sm font-bold text-white">{adv.employeeName} ({adv.department})</h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Reason: <em>{adv.reason}</em> • Recovery Cycle: <strong>{adv.recoveryMonth} Payroll</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <span className="text-slate-400 text-[11px] block">Advance Amount:</span>
                      <span className="text-base font-bold text-emerald-400">{adv.amount.toLocaleString()} {adv.currency}</span>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      adv.status === 'APPROVED' || adv.status === 'DEDUCTED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {adv.status}
                    </span>

                    {adv.status === 'REQUESTED' && (
                      <button
                        onClick={() => updateSalaryAdvanceStatus(adv.id, 'APPROVED')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GROUP HEALTH INSURANCE */}
      {activeTab === 'insurance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insurancePolicies.map(pol => (
              <div key={pol.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      {pol.policyNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {pol.status}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mt-2">{pol.provider}</h4>
                  <p className="text-xs text-rose-400 font-semibold">{pol.planCategory}</p>

                  <div className="mt-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Annual Limit:</span>
                      <span className="font-bold text-emerald-400">{pol.annualLimitPerMember.toLocaleString()} {pol.currency}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Co-Pay / Deductible:</span>
                      <span className="font-bold text-white">{pol.coPayPercentage}% Co-Pay</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Enrolled Members:</span>
                      <span className="font-bold text-white">{pol.totalMembersCovered} Lives</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Network: <strong className="text-slate-200">{pol.networkTier}</strong></span>
                  <span>Expires: <strong className="text-white">{pol.expiryDate}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LOAN MODAL */}
      {showLoanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-rose-400" />
                Apply for Company Loan
              </h3>
              <button onClick={() => setShowLoanModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLoanSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Employee</label>
                <select
                  value={loanForm.employeeId}
                  onChange={e => setLoanForm({ ...loanForm, employeeId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.fullName} ({e.department})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Loan Type</label>
                <select
                  value={loanForm.loanType}
                  onChange={e => setLoanForm({ ...loanForm, loanType: e.target.value as any })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="HOUSING_ASSISTANCE">Housing Rent Assistance</option>
                  <option value="VEHICLE_PURCHASE">Vehicle Purchase Scheme</option>
                  <option value="HIGHER_EDUCATION">Higher Education / Executive MBA</option>
                  <option value="EMERGENCY_HARDSHIP">Emergency Hardship Relief</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Principal Amount (AED)</label>
                  <input
                    type="number"
                    min="1000"
                    value={loanForm.principalAmount}
                    onChange={e => setLoanForm({ ...loanForm, principalAmount: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Tenure (Months)</label>
                  <input
                    type="number"
                    min="1"
                    max="36"
                    value={loanForm.tenureMonths}
                    onChange={e => setLoanForm({ ...loanForm, tenureMonths: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Reason / Purpose</label>
                <textarea
                  rows={2}
                  required
                  value={loanForm.reason}
                  onChange={e => setLoanForm({ ...loanForm, reason: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowLoanModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-bold"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADVANCE MODAL */}
      {showAdvanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-rose-400" />
                Request Salary Advance
              </h3>
              <button onClick={() => setShowAdvanceModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdvanceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Employee</label>
                <select
                  value={advForm.employeeId}
                  onChange={e => setAdvForm({ ...advForm, employeeId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.fullName} ({e.department})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Advance Amount (AED)</label>
                <input
                  type="number"
                  min="500"
                  value={advForm.amount}
                  onChange={e => setAdvForm({ ...advForm, amount: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Reason</label>
                <input
                  type="text"
                  required
                  value={advForm.reason}
                  onChange={e => setAdvForm({ ...advForm, reason: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAdvanceModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-bold"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

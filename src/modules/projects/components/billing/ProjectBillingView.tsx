// ==========================================
// ARTIFY ERP — MODULE 10.05: PROJECT BILLING
// Revenue Recognition, Progress Billing, Interim Payment Certificates & Invoices
// ==========================================

import React, { useState } from 'react';
import { useProjectStore } from '../../services/projectStore';
import { ProgressPaymentCertificate, RevenueRecognitionSchedule } from '../../types';
import {
  Receipt,
  FileSpreadsheet,
  CheckCircle2,
  DollarSign,
  Plus,
  Search,
  Printer,
  ArrowRight,
  Clock,
  AlertCircle,
  FileText,
  Building2,
  TrendingUp
} from 'lucide-react';

export const ProjectBillingView: React.FC = () => {
  const {
    selectedProject,
    revenueRecognitions,
    calculateRevenueRecognition,
    paymentCertificates,
    submitPaymentCertificate,
    certifyPaymentCertificate,
    customerInvoices,
    generateInvoiceFromCertificate
  } = useProjectStore();

  const [activeTab, setActiveTab] = useState<'REVENUE_RECOGNITION' | 'PROGRESS_BILLING' | 'CUSTOMER_INVOICING'>('PROGRESS_BILLING');
  const [showNewIpcModal, setShowNewIpcModal] = useState(false);

  // New IPC Form State
  const [newIpcForm, setNewIpcForm] = useState({
    projectId: selectedProject.id,
    claimPeriodStart: '2026-06-01',
    claimPeriodEnd: '2026-06-30',
    submissionDate: new Date().toISOString().split('T')[0],
    grossAmountClaimed: 580000,
    certifiedWorkAmount: 550000,
    retentionDeductionPercent: selectedProject.retentionWithheldPercent || 10,
    mobilizationAdvanceRecoveryAmount: 41250,
    materialOnSiteCertifiedAmount: 30000,
    currency: selectedProject.currency,
    clientConsultantEngineer: 'WorleyParsons Oman / Eng. Malcolm Hughes'
  });

  const handleCreateIpc = (e: React.FormEvent) => {
    e.preventDefault();
    submitPaymentCertificate(newIpcForm);
    setShowNewIpcModal(false);
  };

  const currentProjectRevs = revenueRecognitions.filter(r => r.projectId === selectedProject.id);
  const currentProjectIpcs = paymentCertificates.filter(ipc => ipc.projectId === selectedProject.id);
  const currentProjectInvoices = customerInvoices.filter(inv => inv.projectId === selectedProject.id);

  return (
    <div id="project-billing-module" className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-widest text-purple-400 bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-800">
                10.05 — Project Billing & Revenue Recognition
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {selectedProject.projectCode}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mt-1">
              Percentage-of-Completion Revenue, Progress Claims & Tax Invoicing
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'REVENUE_RECOGNITION' && (
            <button
              onClick={() => calculateRevenueRecognition(selectedProject.id, `2026-Q${Math.floor(Math.random()*4 + 1)} (Current)`)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Compute POCM Revenue Run</span>
            </button>
          )}
          {activeTab === 'PROGRESS_BILLING' && (
            <button
              onClick={() => setShowNewIpcModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit Progress Claim (IPC)</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Contract Value</span>
          <p className="text-lg font-bold text-white font-mono mt-1">
            {selectedProject.currency} {selectedProject.contractValue.toLocaleString()}
          </p>
          <span className="text-[11px] text-purple-400">Method: {selectedProject.billingMethod}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Cumulative Billed to Client</span>
          <p className="text-lg font-bold text-emerald-400 font-mono mt-1">
            {selectedProject.currency} {selectedProject.totalBilledAmount.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400">
            {Math.round((selectedProject.totalBilledAmount / selectedProject.contractValue) * 100)}% of Contract
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Collected Cash Receipts</span>
          <p className="text-lg font-bold text-blue-400 font-mono mt-1">
            {selectedProject.currency} {selectedProject.totalReceivedAmount.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-400">Settled via AR Bank Clearing</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Retention Withheld (10%)</span>
          <p className="text-lg font-bold text-amber-400 font-mono mt-1">
            {selectedProject.currency} {(selectedProject.totalBilledAmount * 0.10).toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400">Released upon Final PAC Handover</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('PROGRESS_BILLING')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'PROGRESS_BILLING'
              ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Interim Payment Claims (IPC) ({currentProjectIpcs.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('CUSTOMER_INVOICING')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'CUSTOMER_INVOICING'
              ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Official Customer Tax Invoices ({currentProjectInvoices.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('REVENUE_RECOGNITION')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'REVENUE_RECOGNITION'
              ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>IFRS 15 / POCM Revenue Recognition ({currentProjectRevs.length})</span>
        </button>
      </div>

      {/* TAB 1: INTERIM PAYMENT CLAIMS (IPC) */}
      {activeTab === 'PROGRESS_BILLING' && (
        <div className="space-y-4">
          {currentProjectIpcs.map(ipc => (
            <div key={ipc.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-purple-400 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-800">
                    {ipc.certificateNumber}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">Period: {ipc.claimPeriodStart} to {ipc.claimPeriodEnd}</h3>
                    <p className="text-xs text-slate-400">Consultant: {ipc.clientConsultantEngineer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className={`px-2.5 py-1 rounded-full font-bold uppercase ${
                    ipc.status === 'CONSULTANT_CERTIFIED' || ipc.status === 'PAYMENT_RECEIVED'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {ipc.status}
                  </span>
                  {ipc.status === 'SUBMITTED_TO_CLIENT' && (
                    <button
                      onClick={() => certifyPaymentCertificate(ipc.id, 'WorleyParsons / Eng. Malcolm Hughes')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold cursor-pointer"
                    >
                      Certify IPC
                    </button>
                  )}
                  {ipc.status === 'CONSULTANT_CERTIFIED' && (
                    <button
                      onClick={() => generateInvoiceFromCertificate(ipc.id)}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold cursor-pointer"
                    >
                      Post Tax Invoice to AR
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs font-mono">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-slate-500 font-sans">Gross Work Done</span>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {ipc.currency} {ipc.certifiedWorkAmount.toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-slate-500 font-sans">Retention ({ipc.retentionDeductionPercent}%)</span>
                  <p className="text-sm font-bold text-amber-400 mt-0.5">
                    -{ipc.currency} {ipc.retentionDeductionAmount.toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-slate-500 font-sans">Advance Recovery</span>
                  <p className="text-sm font-bold text-rose-400 mt-0.5">
                    -{ipc.currency} {ipc.mobilizationAdvanceRecoveryAmount.toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-slate-500 font-sans">Material on Site</span>
                  <p className="text-sm font-bold text-blue-400 mt-0.5">
                    +{ipc.currency} {ipc.materialOnSiteCertifiedAmount.toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-slate-500 font-sans">Net Certified</span>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">
                    {ipc.currency} {ipc.netPayableAmount.toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-slate-500 font-sans">Total Client Payable (+VAT)</span>
                  <p className="text-sm font-extrabold text-purple-400 mt-0.5">
                    {ipc.currency} {ipc.totalClientPayable.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: OFFICIAL CUSTOMER TAX INVOICES */}
      {activeTab === 'CUSTOMER_INVOICING' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Accounts Receivable Commercial Tax Invoices</h2>
            <span className="text-xs text-slate-400">Integrated with Financial General Ledger</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Customer Entity</th>
                  <th className="py-3 px-4">Linked IPC #</th>
                  <th className="py-3 px-4">Invoice Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Net Amount</th>
                  <th className="py-3 px-4 text-right">VAT (5%)</th>
                  <th className="py-3 px-4 text-right font-bold text-purple-400">Total Gross</th>
                  <th className="py-3 px-4">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {currentProjectInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-purple-400">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4 font-sans font-medium text-white">
                      {inv.customerName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {inv.linkedIpcNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {inv.invoiceDate}
                    </td>
                    <td className="py-3.5 px-4 text-amber-400 font-bold">
                      {inv.paymentDueDate}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-200">
                      {inv.currency} {inv.netAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400">
                      {inv.currency} {inv.vatAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right text-emerald-400 font-extrabold text-sm">
                      {inv.currency} {inv.totalGrossInvoiceAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">
                        {inv.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: IFRS 15 / POCM REVENUE RECOGNITION */}
      {activeTab === 'REVENUE_RECOGNITION' && (
        <div className="space-y-4">
          {currentProjectRevs.map(rev => (
            <div key={rev.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-purple-400 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-800">
                    {rev.fiscalPeriod}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">Cost-to-Cost POCM Revenue Recognition Run</h3>
                    <p className="text-xs text-slate-400">Auditor: {rev.auditedBy} | Method: {rev.methodApplied}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold text-xs uppercase">
                  {rev.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs font-mono">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-slate-500 font-sans">Cumulative Cost Incurred</span>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {rev.currency} {rev.cumulativeCostIncurred.toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-slate-500 font-sans">Estimated Cost at Completion</span>
                  <p className="text-sm font-bold text-slate-300 mt-0.5">
                    {rev.currency} {rev.estimatedTotalCostAtCompletion.toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-slate-500 font-sans">Calculated POCM %</span>
                  <p className="text-sm font-extrabold text-purple-400 mt-0.5">
                    {rev.calculatedCostToCostPercent}%
                  </p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-slate-500 font-sans">Cumulative Recognized</span>
                  <p className="text-sm font-bold text-slate-200 mt-0.5">
                    {rev.currency} {rev.cumulativeRecognizedRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-slate-500 font-sans">Period Revenue to Post</span>
                  <p className="text-sm font-extrabold text-emerald-400 mt-0.5">
                    {rev.currency} {rev.currentPeriodRevenueToRecognize.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: SUBMIT PROGRESS CLAIM (IPC) */}
      {showNewIpcModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-xs">
            <h2 className="text-base font-bold text-white">Generate Interim Payment Application (IPA / IPC)</h2>
            <form onSubmit={handleCreateIpc} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Claim Start Date</label>
                  <input
                    type="date"
                    required
                    value={newIpcForm.claimPeriodStart}
                    onChange={(e) => setNewIpcForm({ ...newIpcForm, claimPeriodStart: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Claim Cutoff Date</label>
                  <input
                    type="date"
                    required
                    value={newIpcForm.claimPeriodEnd}
                    onChange={(e) => setNewIpcForm({ ...newIpcForm, claimPeriodEnd: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Gross Certified Work Done ({selectedProject.currency})</label>
                <input
                  type="number"
                  required
                  value={newIpcForm.certifiedWorkAmount}
                  onChange={(e) => setNewIpcForm({ ...newIpcForm, certifiedWorkAmount: Number(e.target.value), grossAmountClaimed: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Advance Recovery</label>
                  <input
                    type="number"
                    value={newIpcForm.mobilizationAdvanceRecoveryAmount}
                    onChange={(e) => setNewIpcForm({ ...newIpcForm, mobilizationAdvanceRecoveryAmount: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Material on Site (MOS)</label>
                  <input
                    type="number"
                    value={newIpcForm.materialOnSiteCertifiedAmount}
                    onChange={(e) => setNewIpcForm({ ...newIpcForm, materialOnSiteCertifiedAmount: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewIpcModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold cursor-pointer"
                >
                  Submit Payment Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

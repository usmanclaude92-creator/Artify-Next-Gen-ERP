// ==========================================
// 15.04 PROGRESS & BILLING VIEW
// Joint Measurement Sheets (JMS), Interim Payment Certificates (IPC) & Subcontractor Billing
// ==========================================

import React, { useState } from 'react';
import { useConstructionStore } from '../../services/constructionStore';
import { InterimPaymentCertificate, ProgressTaxInvoice } from '../../types/constructionTypes';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  DollarSign,
  Printer,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet,
  Calendar
} from 'lucide-react';

export const ProgressBillingView: React.FC = () => {
  const {
    ipcs,
    progressInvoices,
    selectedContractId,
    contracts,
    currency,
    createIPC,
    approveIPC
  } = useConstructionStore();

  const [activeTab, setActiveTab] = useState<'ipc-ledger' | 'tax-invoices' | 'subcontractor-billing'>('ipc-ledger');
  const [selectedIpc, setSelectedIpc] = useState<InterimPaymentCertificate | null>(ipcs[ipcs.length - 1] || null);
  const [showCreateIpcModal, setShowCreateIpcModal] = useState(false);

  // New IPC Form State
  const [newIpcNumber, setNewIpcNumber] = useState(`IPC-10`);
  const [newPeriodStart, setNewPeriodStart] = useState('2024-08-01');
  const [newPeriodEnd, setNewPeriodEnd] = useState('2024-08-31');
  const [newGrossWork, setNewGrossWork] = useState<number>(1480000);
  const [newMos, setNewMos] = useState<number>(280000);
  const [newVos, setNewVos] = useState<number>(190000);

  const selectedContract = contracts.find(c => c.id === selectedContractId) || contracts[0];
  const contractIpcs = ipcs.filter(i => i.contractId === selectedContractId);
  const contractInvoices = progressInvoices.filter(inv => inv.contractId === selectedContractId);

  const handleCreateIPC = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIpcNumber) return;

    const previousIpc = contractIpcs[contractIpcs.length - 1];
    const prevCumWork = previousIpc ? previousIpc.cumulativeGrossWorkExecuted : 0;
    const prevCumPaid = previousIpc ? previousIpc.grossCertifiedCumulativeTotal : 0;
    const cumGross = prevCumWork + Number(newGrossWork);
    const grossTotal = cumGross + Number(newMos) + Number(newVos);

    const advanceRecovery = Number(newGrossWork) * 0.10;
    const retentionDeduction = 0; // Capped
    const netPayable = Number(newGrossWork) + Number(newMos) + Number(newVos) - advanceRecovery;
    const vat = netPayable * 0.05;

    createIPC({
      ipcNumber: newIpcNumber,
      contractId: selectedContractId,
      periodStartDate: newPeriodStart,
      periodEndDate: newPeriodEnd,
      submissionDate: new Date().toISOString().split('T')[0],
      clientName: selectedContract.clientName,
      grossWorkExecutedThisPeriod: Number(newGrossWork),
      cumulativeGrossWorkExecuted: cumGross,
      materialsOnSiteAdvancement: Number(newMos),
      approvedVariationsThisPeriod: Number(newVos),
      cumulativeApprovedVariations: (previousIpc?.cumulativeApprovedVariations || 0) + Number(newVos),
      grossCertifiedCumulativeTotal: grossTotal,
      advancePaymentRecoveryThisPeriod: advanceRecovery,
      cumulativeAdvanceRecovered: (previousIpc?.cumulativeAdvanceRecovered || 0) + advanceRecovery,
      retentionDeductedThisPeriod: retentionDeduction,
      cumulativeRetentionWithheld: previousIpc?.cumulativeRetentionWithheld || 1425000,
      previousCertificatesCumulativePaid: prevCumPaid,
      netPayableBeforeVat: netPayable,
      vatTaxAmount: vat,
      totalNetPayableWithVat: netPayable + vat,
      certifiedByConsultantEngineer: selectedContract.supervisingConsultant,
      status: 'SUBMITTED_TO_ENGINEER',
      paymentDueDate: '2024-09-30'
    });

    setShowCreateIpcModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Receipt className="w-3.5 h-3.5" />
            Module 15.04 — Progress & Billing
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Interim Payment Certificates (IPC) & Progress Billing</h2>
          <p className="text-sm text-slate-400">
            Certified surveyor joint measurement sheets, consultant engineer valuations, advance payment amortization, retention withholds, and VAT tax invoicing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowCreateIpcModal(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Generate Monthly IPC
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('ipc-ledger')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'ipc-ledger'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Interim Payment Certificates ({contractIpcs.length})
          </button>
          <button
            onClick={() => setActiveTab('tax-invoices')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'tax-invoices'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Client Tax Invoices ({contractInvoices.length})
          </button>
          <button
            onClick={() => setActiveTab('subcontractor-billing')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'subcontractor-billing'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Subcontractor Billing Applications
          </button>
        </div>
      </div>

      {/* Tab 1: IPC Ledger & Detailed Statement */}
      {activeTab === 'ipc-ledger' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: IPC Cards List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Issued Certificates ({selectedContract?.contractNumber})
            </h4>
            {contractIpcs.map(ipc => (
              <div
                key={ipc.id}
                onClick={() => setSelectedIpc(ipc)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                  selectedIpc?.id === ipc.id
                    ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/30 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                    {ipc.ipcNumber}
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    ipc.status === 'PAID'
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                      : ipc.status === 'CERTIFIED'
                      ? 'bg-blue-50 dark:bg-blue-950 text-blue-600'
                      : 'bg-amber-50 dark:bg-amber-950 text-amber-600'
                  }`}>
                    {ipc.status}
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Period:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{ipc.periodStartDate} to {ipc.periodEndDate}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span>Net Payable (with VAT):</span>
                    <span className="font-mono text-slate-900 dark:text-white">
                      {currency} {ipc.totalNetPayableWithVat.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Detailed IPC Certificate Statement */}
          <div className="lg:col-span-2">
            {selectedIpc ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
                <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-xl">
                        {selectedIpc.ipcNumber}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                        {selectedIpc.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                      Interim Payment Certificate Valuation Summary
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Client: <strong>{selectedIpc.clientName}</strong> • Certified by: <strong>{selectedIpc.certifiedByConsultantEngineer}</strong>
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {selectedIpc.status === 'SUBMITTED_TO_ENGINEER' && (
                      <button
                        onClick={() => approveIPC(selectedIpc.id)}
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3 py-2 rounded-xl shadow transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Certify IPC
                      </button>
                    )}
                    <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 text-slate-600 dark:text-slate-400">
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* FIDIC Certificate Breakdown Ledger */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-medium text-slate-600 dark:text-slate-400">1. Gross Work Executed This Period (Joint Measurement)</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{currency} {selectedIpc.grossWorkExecutedThisPeriod.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-medium text-slate-600 dark:text-slate-400">2. Materials on Site (MOS) Advancement (80% Invoice Value)</span>
                    <span className="font-mono font-semibold text-blue-600">{currency} {selectedIpc.materialsOnSiteAdvancement.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-medium text-slate-600 dark:text-slate-400">3. Approved Variation Orders Certified This Period</span>
                    <span className="font-mono font-semibold text-emerald-600">{currency} {selectedIpc.approvedVariationsThisPeriod.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 bg-slate-50 dark:bg-slate-800/50 px-3 rounded-xl font-bold">
                    <span className="text-slate-900 dark:text-white">A. Cumulative Gross Work Certified to Date</span>
                    <span className="font-mono text-slate-900 dark:text-white">{currency} {selectedIpc.grossCertifiedCumulativeTotal.toLocaleString()}</span>
                  </div>

                  {/* Deductions Section */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">Contractual Deductions</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-rose-600 dark:text-rose-400">
                    <span>4. Less: Mobilization Advance Payment Recovery (10%)</span>
                    <span className="font-mono font-semibold">({currency} {selectedIpc.advancePaymentRecoveryThisPeriod.toLocaleString()})</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-rose-600 dark:text-rose-400">
                    <span>5. Less: Retention Money Deducted This Period (5% Cap Reached)</span>
                    <span className="font-mono font-semibold">({currency} {selectedIpc.retentionDeductedThisPeriod.toLocaleString()})</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-slate-500">
                    <span>6. Less: Previous Certificates Certified & Paid</span>
                    <span className="font-mono font-semibold">({currency} {selectedIpc.previousCertificatesCumulativePaid.toLocaleString()})</span>
                  </div>

                  {/* Final Net Payable */}
                  <div className="pt-2 space-y-2">
                    <div className="flex justify-between py-2 bg-blue-50/50 dark:bg-blue-950/40 px-3 rounded-xl font-bold text-slate-900 dark:text-white">
                      <span>Net Amount Payable Before VAT</span>
                      <span className="font-mono text-blue-600 dark:text-blue-400">{currency} {selectedIpc.netPayableBeforeVat.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 px-3 text-slate-600 dark:text-slate-400">
                      <span>Value Added Tax (VAT 5.0%)</span>
                      <span className="font-mono font-semibold">{currency} {selectedIpc.vatTaxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-3 bg-slate-900 text-white px-4 rounded-xl font-bold text-sm">
                      <span>TOTAL NET AMOUNT CERTIFIED & PAYABLE (INCL. VAT)</span>
                      <span className="font-mono text-emerald-400">{currency} {selectedIpc.totalNetPayableWithVat.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                Select an IPC on the left to view the certified calculation statement.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Tax Invoices */}
      {activeTab === 'tax-invoices' && (
        <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Invoice No.</th>
                <th className="py-3 px-4">Matching IPC</th>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Invoice Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Taxable Amount</th>
                <th className="py-3 px-4 text-right">VAT (5%)</th>
                <th className="py-3 px-4 text-right">Total Invoice Sum</th>
                <th className="py-3 px-4">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {contractInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4 font-mono">{inv.ipcId}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">{inv.clientName}</td>
                  <td className="py-3.5 px-4 font-mono">{inv.invoiceDate}</td>
                  <td className="py-3.5 px-4 font-mono">{inv.paymentDueDate}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold">{currency} {inv.taxableCertifiedAmount.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-500">{currency} {inv.vatAmount.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">{currency} {inv.totalInvoiceAmount.toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      inv.paymentStatus === 'PAID'
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                        : 'bg-amber-50 dark:bg-amber-950 text-amber-600'
                    }`}>
                      {inv.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Subcontractor Billing */}
      {activeTab === 'subcontractor-billing' && (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs space-y-3">
          <FileCheck className="w-10 h-10 mx-auto text-blue-500" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white">Trade Subcontractor Payment Applications</h4>
          <p className="max-w-md mx-auto text-slate-400">
            Subcontractor claims for Bahwan Engineering (MEP) and Alumco (Facade) are audited by the Senior QS against Joint Measurement Sheets and approved for Treasury disbursements.
          </p>
        </div>
      )}

      {/* Modal: New IPC */}
      {showCreateIpcModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Generate Monthly Interim Payment Certificate (IPC)</h3>
              <button onClick={() => setShowCreateIpcModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateIPC} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">IPC Certificate Number *</label>
                <input
                  type="text"
                  required
                  value={newIpcNumber}
                  onChange={e => setNewIpcNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Valuation Period Start</label>
                  <input
                    type="date"
                    value={newPeriodStart}
                    onChange={e => setNewPeriodStart(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Valuation Period End</label>
                  <input
                    type="date"
                    value={newPeriodEnd}
                    onChange={e => setNewPeriodEnd(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Gross Work Executed This Month ({currency})</label>
                <input
                  type="number"
                  value={newGrossWork}
                  onChange={e => setNewGrossWork(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Materials on Site (MOS)</label>
                  <input
                    type="number"
                    value={newMos}
                    onChange={e => setNewMos(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Variations Certified</label>
                  <input
                    type="number"
                    value={newVos}
                    onChange={e => setNewVos(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateIpcModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                >
                  Submit IPC for Certification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

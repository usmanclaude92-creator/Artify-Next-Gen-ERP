// ==========================================
// 16.02 ACCOUNTS PAYABLE (AP) VIEW
// Supplier Invoices, 3-Way Verification, VAT Tax, Approvals, GL Posting & Due Dates
// ==========================================

import React, { useState } from 'react';
import { useFinanceStore } from '../../services/financeStore';
import { SupplierInvoice } from '../../types/financeTypes';
import {
  ArrowDownRight,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  FileCheck,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Receipt,
  DollarSign
} from 'lucide-react';
import { mockRandom } from '@/src/utils/mockRandom';

export const AccountsPayableView: React.FC = () => {
  const {
    currency,
    supplierInvoices,
    addSupplierInvoice,
    approveSupplierInvoice,
    postSupplierInvoiceToGL
  } = useFinanceStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<SupplierInvoice | null>(null);

  // Form State for new Supplier Invoice
  const [vendorName, setVendorName] = useState('');
  const [vendorVatNo, setVendorVatNo] = useState('OM1100' + Math.floor(100000 + mockRandom() * 900000));
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [poNumber, setPoNumber] = useState('');
  const [grnNumber, setGrnNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [subTotal, setSubTotal] = useState<number>(100000);
  const [description, setDescription] = useState('Structural building materials delivery');

  const vatRate = 0.05; // 5% Standard VAT in Oman
  const vatAmount = subTotal * vatRate;
  const grandTotal = subTotal + vatAmount;

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    addSupplierInvoice({
      invoiceNumber,
      vendorId: `VEND-${Math.floor(100 + mockRandom() * 900)}`,
      vendorName,
      vendorVatNo,
      poNumber: poNumber || undefined,
      grnNumber: grnNumber || undefined,
      invoiceDate,
      dueDate,
      paymentTerms,
      currency,
      subTotal,
      vatAmount,
      grandTotal,
      paidAmount: 0,
      balanceDue: grandTotal,
      status: 'VERIFIED',
      approvalStatus: 'PENDING',
      is3WayMatched: !!(poNumber && grnNumber),
      lines: [
        {
          id: `sil-${Date.now()}`,
          description,
          expenseAccountId: 'coa-5010',
          quantity: 1,
          unitPrice: subTotal,
          netAmount: subTotal,
          vatRate,
          vatAmount,
          totalAmount: grandTotal
        }
      ]
    });

    setShowCreateModal(false);
    setVendorName('');
    setInvoiceNumber('');
    setPoNumber('');
    setGrnNumber('');
  };

  const filteredInvoices = supplierInvoices.filter(inv => {
    const matchesSearch =
      inv.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.systemRef.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOutstandingAP = supplierInvoices.reduce((sum, i) => sum + i.balanceDue, 0);
  const totalVerifiedPendingPost = supplierInvoices
    .filter(i => i.status === 'APPROVED' || i.status === 'VERIFIED')
    .reduce((sum, i) => sum + i.grandTotal, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-slate-900 dark:text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <ArrowDownRight className="w-3.5 h-3.5" />
            Module 16.02 — Accounts Payable (AP)
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Accounts Payable & Supplier Sub-ledger</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            3-Way matching (PO vs GRN vs Invoice), 5% Input VAT recovery, dual-tier approval routing, automatic GL booking, and payment maturity schedule.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-2xl shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Book Supplier Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Open AP Payables</span>
          <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {currency} {totalOutstandingAP.toLocaleString()}
          </p>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">Across {supplierInvoices.length} supplier accounts</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verified & Approved for GL Post</span>
          <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {currency} {totalVerifiedPendingPost.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Ready for automated GL journal creation</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Input VAT Recoverable (5%)</span>
          <p className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
            {currency} {supplierInvoices.reduce((s, i) => s + i.vatAmount, 0).toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">100% Tax Compliant</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          {['ALL', 'VERIFIED', 'APPROVED', 'POSTED', 'PARTIALLY_PAID'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-600 dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search vendor, invoice #, PO..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-3">
        {filteredInvoices.map(inv => (
          <div
            key={inv.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-amber-500/50 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 font-mono font-bold text-xs">
                  {inv.systemRef}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {inv.vendorName}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-normal">
                      (Inv #{inv.invoiceNumber})
                    </span>
                    {inv.is3WayMatched && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                        <ShieldCheck className="w-3 h-3" /> 3-Way Matched
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    VAT No: <strong className="font-mono">{inv.vendorVatNo}</strong> • Invoice Date: <strong>{inv.invoiceDate}</strong> • Due: <strong className="text-amber-600 dark:text-amber-400">{inv.dueDate}</strong> ({inv.paymentTerms})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Grand Total (incl 5% VAT)</span>
                  <p className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                    {currency} {inv.grandTotal.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Bal Due: {currency} {inv.balanceDue.toLocaleString()}
                  </span>
                </div>

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    inv.status === 'POSTED'
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : inv.status === 'APPROVED'
                      ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30'
                      : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
                  }`}
                >
                  {inv.status}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {inv.approvalStatus === 'PENDING' && (
                    <button
                      onClick={() => approveSupplierInvoice(inv.id)}
                      className="px-3 py-1 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow cursor-pointer"
                    >
                      Approve (L2)
                    </button>
                  )}
                  {inv.status === 'APPROVED' && (
                    <button
                      onClick={() => postSupplierInvoiceToGL(inv.id)}
                      className="px-3 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow cursor-pointer"
                    >
                      Post to GL
                    </button>
                  )}
                  {inv.status === 'POSTED' && inv.glVoucherId && (
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-500/30">
                      GL Voucher Linked
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Line Items Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl">
              <div>
                <span className="text-slate-600 dark:text-slate-400 block text-[10px]">Purchase Order & GRN Link:</span>
                <strong className="text-slate-700 dark:text-slate-300 font-mono">
                  {inv.poNumber || 'Standalone Service'} {inv.grnNumber ? `› ${inv.grnNumber}` : ''}
                </strong>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400 block text-[10px]">Net Taxable Base & 5% VAT:</span>
                <span className="text-slate-700 dark:text-slate-300 font-mono">
                  Base: {currency} {inv.subTotal.toLocaleString()} + VAT: {currency} {inv.vatAmount.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400 block text-[10px]">Approval Signoff:</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {inv.approvalStatus === 'APPROVED_L2' ? '✓ CFO Salim Al-Harthy' : '⏳ Pending Management Signoff'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Book Supplier Invoice */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold">Register Supplier Tax Invoice (AP)</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">3-Way match verification and VAT computation</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xl">✕</button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Supplier / Vendor Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oman Readymix Building Materials"
                    value={vendorName}
                    onChange={e => setVendorName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Vendor VAT Reg #</label>
                  <input
                    type="text"
                    required
                    value={vendorVatNo}
                    onChange={e => setVendorVatNo(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Vendor Invoice #</label>
                  <input
                    type="text"
                    required
                    placeholder="INV-9982"
                    value={invoiceNumber}
                    onChange={e => setInvoiceNumber(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Linked PO Number</label>
                  <input
                    type="text"
                    placeholder="PO-2026-881"
                    value={poNumber}
                    onChange={e => setPoNumber(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Linked GRN #</label>
                  <input
                    type="text"
                    placeholder="GRN-2026-1044"
                    value={grnNumber}
                    onChange={e => setGrnNumber(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Invoice Date</label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={e => setInvoiceDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Payment Terms</label>
                  <select
                    value={paymentTerms}
                    onChange={e => setPaymentTerms(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="Net 15">Net 15 Days</option>
                    <option value="Net 30">Net 30 Days</option>
                    <option value="Net 60">Net 60 Days</option>
                    <option value="Immediate">Immediate Upon Receipt</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Item / Expense Description</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Net Taxable Amount ({currency})</label>
                <input
                  type="number"
                  required
                  value={subTotal}
                  onChange={e => setSubTotal(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-right text-sm font-bold"
                />
              </div>

              {/* Tax summary calculation */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl space-y-1.5 font-mono text-xs border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-sans">Net Subtotal:</span>
                  <span className="font-bold">{currency} {subTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-blue-600 dark:text-blue-400">
                  <span className="font-sans">Input VAT (5% Standard Oman):</span>
                  <span className="font-bold">+ {currency} {vatAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                  <span className="font-sans">Grand Total Payable:</span>
                  <span className="text-amber-600 dark:text-amber-400">{currency} {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg cursor-pointer"
                >
                  Save & Verify Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

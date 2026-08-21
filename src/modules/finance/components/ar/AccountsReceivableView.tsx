// ==========================================
// 16.03 ACCOUNTS RECEIVABLE (AR) VIEW
// Customer Invoices, Credit Notes, Customer Receipts, Multi-Invoice Allocation & Aging
// ==========================================

import React, { useState } from 'react';
import { useFinanceStore } from '../../services/financeStore';
import { CustomerInvoice, CustomerReceipt } from '../../types/financeTypes';
import {
  ArrowUpRight,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Receipt,
  CreditCard,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  Download,
  Printer,
  ChevronRight,
  Send,
  PieChart,
  UserCheck
} from 'lucide-react';

export const AccountsReceivableView: React.FC = () => {
  const {
    currency,
    customerInvoices,
    customerReceipts,
    addCustomerInvoice,
    addCustomerReceipt
  } = useFinanceStore();

  const [activeTab, setActiveTab] = useState<'invoices' | 'receipts' | 'aging'>('invoices');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [showCreateReceiptModal, setShowCreateReceiptModal] = useState(false);

  // Form State for Customer Invoice
  const [customerName, setCustomerName] = useState('');
  const [customerVatNo, setCustomerVatNo] = useState('OM1200' + Math.floor(100000 + Math.random() * 900000));
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));
  const [subTotal, setSubTotal] = useState<number>(250000);
  const [description, setDescription] = useState('EPC Milestone Progress Certified Billing');

  const vatRate = 0.05;
  const vatAmount = subTotal * vatRate;
  const grandTotal = subTotal + vatAmount;

  // Form State for Customer Receipt
  const [receiptCustomerName, setReceiptCustomerName] = useState('');
  const [receiptAmount, setReceiptAmount] = useState<number>(500000);
  const [paymentMethod, setPaymentMethod] = useState<CustomerReceipt['paymentMethod']>('BANK_TRANSFER');
  const [referenceNumber, setReferenceNumber] = useState('FT-BM-' + Math.floor(1000000 + Math.random() * 9000000));
  const [selectedInvoiceForAlloc, setSelectedInvoiceForAlloc] = useState<string>(customerInvoices[0]?.id || '');

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const invNumber = `AR-INV-2026-${String(customerInvoices.length + 143).padStart(4, '0')}`;
    addCustomerInvoice({
      invoiceNumber: invNumber,
      customerId: `CUST-${Math.floor(100 + Math.random() * 900)}`,
      customerName,
      customerVatNo,
      invoiceDate,
      dueDate,
      currency,
      subTotal,
      vatAmount,
      grandTotal,
      allocatedAmount: 0,
      balanceAmount: grandTotal,
      status: 'ISSUED',
      lines: [
        {
          id: `cil-${Date.now()}`,
          description,
          revenueAccountId: 'coa-4010',
          quantity: 1,
          unitPrice: subTotal,
          discount: 0,
          netAmount: subTotal,
          vatRate,
          vatAmount,
          totalAmount: grandTotal
        }
      ]
    });
    setShowCreateInvoiceModal(false);
    setCustomerName('');
  };

  const handleCreateReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    const targetInv = customerInvoices.find(i => i.id === selectedInvoiceForAlloc);
    const allocAmount = Math.min(receiptAmount, targetInv ? targetInv.balanceAmount : receiptAmount);

    addCustomerReceipt({
      customerId: targetInv ? targetInv.customerId : 'CUST-001',
      customerName: receiptCustomerName || (targetInv ? targetInv.customerName : 'Client Customer'),
      receiptDate: new Date().toISOString().slice(0, 10),
      paymentMethod,
      bankAccountId: 'bank-01',
      amount: receiptAmount,
      unallocatedAmount: Math.max(0, receiptAmount - allocAmount),
      currency,
      referenceNumber,
      status: 'POSTED',
      allocations: targetInv
        ? [
            {
              invoiceId: targetInv.id,
              invoiceNumber: targetInv.invoiceNumber,
              allocatedAmount: allocAmount
            }
          ]
        : []
    });

    setShowCreateReceiptModal(false);
  };

  const totalReceivables = customerInvoices.reduce((sum, i) => sum + i.balanceAmount, 0);
  const totalCollected = customerReceipts.reduce((sum, r) => sum + r.amount, 0);
  const overdueReceivables = customerInvoices
    .filter(i => i.status === 'OVERDUE')
    .reduce((sum, i) => sum + i.balanceAmount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Module 16.03 — Accounts Receivable (AR)
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Accounts Receivable & Customer Collections</h2>
          <p className="text-sm text-slate-400">
            Statutory 5% VAT invoice generation, credit notes, electronic customer receipts, smart multi-invoice matching, and comprehensive aging buckets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateReceiptModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-2xl border border-slate-700 shadow-lg transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Record Receipt</span>
          </button>
          <button
            onClick={() => setShowCreateInvoiceModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-2xl shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Customer Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Total Outstanding AR</span>
          <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {currency} {totalReceivables.toLocaleString()}
          </p>
          <span className="text-[11px] text-blue-600 font-semibold">Across active client projects</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Collections Recorded (YTD)</span>
          <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {currency} {totalCollected.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500">100% matched to bank receipts</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">Overdue Invoices (&gt; 60 Days)</span>
          <p className="text-xl font-bold font-mono text-red-600 dark:text-red-400 mt-1">
            {currency} {overdueReceivables.toLocaleString()}
          </p>
          <span className="text-[11px] text-red-500 font-semibold">Dunning Level 2 Reminder Issued</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'invoices'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Customer Tax Invoices ({customerInvoices.length})
          </button>
          <button
            onClick={() => setActiveTab('receipts')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'receipts'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Customer Receipts & Allocations ({customerReceipts.length})
          </button>
          <button
            onClick={() => setActiveTab('aging')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'aging'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            AR Aging Analysis
          </button>
        </div>
      </div>

      {/* Tab 1: Customer Invoices */}
      {activeTab === 'invoices' && (
        <div className="space-y-3">
          {customerInvoices.map(inv => (
            <div
              key={inv.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-blue-500/50 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-mono font-bold text-xs">
                    {inv.invoiceNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {inv.customerName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 font-normal">
                        (VAT: {inv.customerVatNo})
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Issue Date: <strong>{inv.invoiceDate}</strong> • Due: <strong className={inv.status === 'OVERDUE' ? 'text-red-500 font-bold' : ''}>{inv.dueDate}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-400 font-medium font-sans">Grand Total (incl 5% VAT)</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {currency} {inv.grandTotal.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      Balance: {currency} {inv.balanceAmount.toLocaleString()}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      inv.status === 'PAID'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200'
                        : inv.status === 'OVERDUE'
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-blue-50 text-blue-600 border border-blue-200'
                    }`}
                  >
                    {inv.status}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                      <Printer className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Lines description */}
              <div className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl flex justify-between items-center">
                <span>{inv.lines[0]?.description || 'Statutory certified bill'}</span>
                <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                  Taxable: {currency} {inv.subTotal.toLocaleString()} + 5% VAT: {currency} {inv.vatAmount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Receipts & Allocations */}
      {activeTab === 'receipts' && (
        <div className="space-y-3">
          {customerReceipts.map(rec => (
            <div
              key={rec.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-mono font-bold text-xs">
                    {rec.receiptNumber}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{rec.customerName}</h4>
                    <p className="text-xs text-slate-500">
                      Date: <strong>{rec.receiptDate}</strong> • Method: <strong>{rec.paymentMethod}</strong> • Ref: <strong>{rec.referenceNumber}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400">Total Receipt Amount</span>
                  <p className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {currency} {rec.amount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Allocations Table */}
              <div className="bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl text-xs space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Invoice Allocations:</span>
                {rec.allocations.map((alloc, idx) => (
                  <div key={idx} className="flex justify-between font-mono">
                    <span className="text-slate-600 dark:text-slate-400">Applied to Invoice {alloc.invoiceNumber}:</span>
                    <strong className="text-slate-900 dark:text-white">{currency} {alloc.allocatedAmount.toLocaleString()}</strong>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: AR Aging Analysis */}
      {activeTab === 'aging' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Customer Receivables Aging Schedule</h3>
              <p className="text-xs text-slate-500">Bucketed into Current (0-30), 31-60, 61-90, and &gt;90 Days with Expected Credit Loss (ECL)</p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-all">
              <Download className="w-3.5 h-3.5" />
              <span>Export Aging Matrix</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 font-sans font-semibold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4 text-right">Current (0-30 d)</th>
                  <th className="py-3 px-4 text-right">31-60 Days</th>
                  <th className="py-3 px-4 text-right">61-90 Days</th>
                  <th className="py-3 px-4 text-right">&gt; 90 Days (Overdue)</th>
                  <th className="py-3 px-4 text-right font-bold">Total Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-sans font-medium text-slate-900 dark:text-white">
                    Muscat Metro & Infrastructure Authority
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-600">{currency} 1,029,000</td>
                  <td className="py-3 px-4 text-right text-slate-400">-</td>
                  <td className="py-3 px-4 text-right text-slate-400">-</td>
                  <td className="py-3 px-4 text-right text-slate-400">-</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">{currency} 1,029,000</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-sans font-medium text-slate-900 dark:text-white">
                    Al Madina Logistics Services Co
                  </td>
                  <td className="py-3 px-4 text-right text-slate-400">-</td>
                  <td className="py-3 px-4 text-right text-slate-400">-</td>
                  <td className="py-3 px-4 text-right text-amber-600">{currency} 441,000</td>
                  <td className="py-3 px-4 text-right text-red-600 font-bold">{currency} 441,000</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">{currency} 441,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/70 font-bold border-t border-slate-200 dark:border-slate-700">
                  <td className="py-3 px-4 font-sans uppercase">Total Portfolio Aging:</td>
                  <td className="py-3 px-4 text-right text-emerald-600">{currency} 1,029,000</td>
                  <td className="py-3 px-4 text-right text-slate-400">-</td>
                  <td className="py-3 px-4 text-right text-amber-600">{currency} 441,000</td>
                  <td className="py-3 px-4 text-right text-red-600">{currency} 441,000</td>
                  <td className="py-3 px-4 text-right text-blue-600">{currency} 1,470,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Issue Customer Tax Invoice */}
      {showCreateInvoiceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold">Issue Official Tax Invoice (AR)</h3>
                <p className="text-xs text-slate-400">Statutory 5% VAT billing with automated GL revenue recognition</p>
              </div>
              <button onClick={() => setShowCreateInvoiceModal(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Customer / Client Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muscat Metro & Infrastructure"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Customer VAT Number</label>
                  <input
                    type="text"
                    required
                    value={customerVatNo}
                    onChange={e => setCustomerVatNo(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={e => setInvoiceDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Payment Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Service / Progress Billing Description</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Taxable Base Amount ({currency})</label>
                <input
                  type="number"
                  required
                  value={subTotal}
                  onChange={e => setSubTotal(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-right font-bold text-sm"
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl space-y-1.5 font-mono text-xs border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Revenue Subtotal:</span>
                  <span className="font-bold">{currency} {subTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-blue-600">
                  <span className="font-sans">Output VAT (5% Standard Oman):</span>
                  <span className="font-bold">+ {currency} {vatAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                  <span className="font-sans">Total Billed to Customer:</span>
                  <span className="text-blue-600">{currency} {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateInvoiceModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg cursor-pointer"
                >
                  Issue & Post Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Customer Receipt */}
      {showCreateReceiptModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold">Record Customer Payment Receipt</h3>
                <p className="text-xs text-slate-400">Match incoming bank wire / cheque to unpaid customer invoices</p>
              </div>
              <button onClick={() => setShowCreateReceiptModal(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>

            <form onSubmit={handleCreateReceipt} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Select Open Customer Invoice to Settle</label>
                <select
                  value={selectedInvoiceForAlloc}
                  onChange={e => setSelectedInvoiceForAlloc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                >
                  {customerInvoices.map(inv => (
                    <option key={inv.id} value={inv.id}>
                      {inv.invoiceNumber} — {inv.customerName} (Bal Due: {currency} {inv.balanceAmount.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Receipt Amount ({currency})</label>
                  <input
                    type="number"
                    required
                    value={receiptAmount}
                    onChange={e => setReceiptAmount(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-sm text-right"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="BANK_TRANSFER">Electronic Bank Transfer / Wire</option>
                    <option value="CHEQUE">Corporate Cheque</option>
                    <option value="CREDIT_CARD">Corporate Credit Card</option>
                    <option value="CASH">Cash Till Deposit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Bank Reference / Swift Tracking #</label>
                <input
                  type="text"
                  required
                  value={referenceNumber}
                  onChange={e => setReferenceNumber(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateReceiptModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg cursor-pointer"
                >
                  Allocate & Post Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

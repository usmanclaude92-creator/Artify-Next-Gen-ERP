import React, { useState } from 'react';
import { useProcurement } from '../../services/procurementStore';
import { PurchaseInvoice, InvoiceLineItem } from '../../types';
import {
  Receipt,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Search,
  Plus,
  Filter,
  DollarSign,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { mockRandom } from '@/src/utils/mockRandom';

export const PurchaseInvoiceView: React.FC = () => {
  const {
    invoices,
    createPurchaseInvoice,
    runThreeWayMatch,
    approvePurchaseInvoice,
    purchaseOrders,
    grns,
    suppliers
  } = useProcurement();

  const [activeTab, setActiveTab] = useState<'invoices' | 'matching' | 'create'>('invoices');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<PurchaseInvoice | null>(null);

  // Form states
  const [selectedPoId, setSelectedPoId] = useState(purchaseOrders[0]?.id || '');
  const [invNumber, setInvNumber] = useState('');
  const [invDate, setInvDate] = useState(new Date().toISOString().split('T')[0]);
  const [invDueDate, setInvDueDate] = useState(
    new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0]
  );
  const [subtotal, setSubtotal] = useState<number>(148000);
  const [vatAmount, setVatAmount] = useState<number>(7400);

  const formatOMR = (amt: number) =>
    `OMR ${amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const po = purchaseOrders.find((p) => p.id === selectedPoId);
    if (!po) return;

    const supp = suppliers.find((s) => s.id === po.supplierId);
    const grn = grns.find((g) => g.poId === po.id);

    const lines: InvoiceLineItem[] = [
      {
        id: `invline-${Date.now()}`,
        poLineId: po.lines[0]?.id || 'line-1',
        itemDescription: po.lines[0]?.itemDescription || 'Invoiced Goods / Services',
        invoicedQuantity: po.lines[0]?.orderedQuantity || 1,
        unitOfMeasure: po.lines[0]?.unitOfMeasure || 'Units',
        unitPrice: Number(subtotal) / (po.lines[0]?.orderedQuantity || 1),
        invoicedUnitPrice: Number(subtotal) / (po.lines[0]?.orderedQuantity || 1),
        discountAmount: 0,
        netAmount: Number(subtotal),
        vatRatePercentage: 5,
        vatAmount: Number(vatAmount),
        lineTotal: Number(subtotal) + Number(vatAmount),
        glAccountCode: '2110-01-001 (AP Trade Payables)'
      }
    ];

    const newInv = createPurchaseInvoice({
      supplierInvoiceNumber: invNumber || `INV-TAX-${Math.floor(100000 + mockRandom() * 900000)}`,
      poId: po.id,
      poNumber: po.poNumber,
      grnId: grn?.id,
      grnNumber: grn?.grnNumber,
      supplierId: po.supplierId,
      supplierName: po.supplierName,
      supplierTaxId: supp?.taxIdentificationNumber || 'OM-VAT-100293849',
      invoiceDate: invDate,
      dueDate: invDueDate,
      currency: 'OMR',
      exchangeRate: 1.0,
      subtotalAmount: Number(subtotal),
      vatAmount: Number(vatAmount),
      withholdingTaxAmount: 0,
      grandTotalAmount: Number(subtotal) + Number(vatAmount),
      paymentTerms: po.paymentTerms,
      threeWayMatchStatus: 'Matched',
      toleranceVariancePercentage: 0,
      status: 'Pending 3-Way Match',
      lines
    });

    // Automatically execute 3-way match validation
    runThreeWayMatch(newInv.id);

    setActiveTab('invoices');
  };

  const filteredInvoices = invoices.filter(
    (i) =>
      i.invoiceSystemNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.supplierInvoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.poNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Sub-header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'invoices'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>05.07.01 Supplier Tax Invoices</span>
          </button>
          <button
            onClick={() => setActiveTab('matching')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'matching'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>05.07.02 3-Way Matching Engine</span>
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'create'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Vendor Invoice</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SUPPLIER INVOICES REGISTER */}
      {activeTab === 'invoices' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by invoice #, vendor, or PO..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
                  <th className="py-3 px-4">System Ref & Tax #</th>
                  <th className="py-3 px-4">Supplier & VAT ID</th>
                  <th className="py-3 px-4">PO & GRN Ref</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Net Amount</th>
                  <th className="py-3 px-4 text-right">VAT (5%)</th>
                  <th className="py-3 px-4 text-right">Grand Total (OMR)</th>
                  <th className="py-3 px-4">3-Way Match</th>
                  <th className="py-3 px-4">AP Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900 dark:text-slate-100">{inv.invoiceSystemNumber}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{inv.supplierInvoiceNumber}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{inv.supplierName}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{inv.supplierTaxId}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                      <div>{inv.poNumber}</div>
                      <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">{inv.grnNumber || 'No GRN'}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{inv.dueDate}</td>
                    <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">{formatOMR(inv.subtotalAmount)}</td>
                    <td className="py-3 px-4 text-right text-slate-700 dark:text-slate-300">{formatOMR(inv.vatAmount)}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                      {formatOMR(inv.grandTotalAmountOMR)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.threeWayMatchStatus === 'Matched'
                            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                            : 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200'
                        }`}
                      >
                        {inv.threeWayMatchStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'Approved for Payment'
                            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                            : inv.status === 'Paid'
                            ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-200'
                            : 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: 3-WAY MATCHING ENGINE */}
      {activeTab === 'matching' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Automated 3-Way Reconciliation Engine (PO vs GRN vs Invoice)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Audits unit prices from approved POs against warehouse receipt quantities from GRNs and vendor billed totals. Tolerance benchmark: 2.0%.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {invoices.map((inv) => (
              <div key={inv.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{inv.invoiceSystemNumber}</span>
                    <span className="text-slate-600 dark:text-slate-400 font-semibold">• {inv.supplierName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{formatOMR(inv.grandTotalAmountOMR)}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.threeWayMatchStatus === 'Matched'
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                          : 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200'
                      }`}
                    >
                      {inv.threeWayMatchStatus}
                    </span>
                  </div>
                </div>

                {/* Match Comparison Matrix */}
                <div className="grid grid-cols-3 gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Step 1: Purchase Order</div>
                    <div className="font-mono font-bold text-slate-900 dark:text-slate-100 mt-1">{inv.poNumber}</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">Unit Price & Ordered Quantities Verified</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Step 2: Warehouse GRN</div>
                    <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-1">{inv.grnNumber || 'GRN-VERIFIED'}</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">Physical Stock Delivery Accepted</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Step 3: Supplier Tax Invoice</div>
                    <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">{inv.supplierInvoiceNumber}</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">Variance: {inv.toleranceVariancePercentage}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 dark:text-slate-400">Oman VAT 5% verified: {formatOMR(inv.vatAmount)}</span>
                  {inv.status !== 'Approved for Payment' && (
                    <button
                      onClick={() => approvePurchaseInvoice(inv.id, 'AP Lead Specialist')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs cursor-pointer"
                    >
                      Approve for AP Disbursement
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CREATE INVOICE FORM */}
      {activeTab === 'create' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl p-6 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Register Supplier Tax Invoice</h3>
          <form onSubmit={handleCreateSubmit} className="space-y-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Select Purchase Order</label>
              <select
                value={selectedPoId}
                onChange={(e) => setSelectedPoId(e.target.value)}
                className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900"
              >
                {purchaseOrders.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.poNumber} — {p.supplierName} ({formatOMR(p.grandTotalOMR)})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Vendor Invoice #</label>
                <input
                  type="text"
                  required
                  value={invNumber}
                  onChange={(e) => setInvNumber(e.target.value)}
                  placeholder="e.g. INV-2026-90412"
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Invoice Date</label>
                <input
                  type="date"
                  required
                  value={invDate}
                  onChange={(e) => setInvDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Net Invoice Subtotal (OMR)</label>
                <input
                  type="number"
                  required
                  value={subtotal}
                  onChange={(e) => {
                    const sub = Number(e.target.value);
                    setSubtotal(sub);
                    setVatAmount(sub * 0.05);
                  }}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">VAT Amount (5% OMR)</label>
                <input
                  type="number"
                  required
                  value={vatAmount}
                  onChange={(e) => setVatAmount(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs cursor-pointer"
              >
                Register & Run 3-Way Match
              </button>
            </div>
          </form>
        </div>
      )}

      {/* INVOICE DETAILS MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                    {selectedInvoice.invoiceSystemNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {selectedInvoice.status}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">{selectedInvoice.supplierName}</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-400 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block">Vendor Invoice Ref</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedInvoice.supplierInvoiceNumber}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block">Tax Registration #</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedInvoice.supplierTaxId}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block">Grand Total</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">{formatOMR(selectedInvoice.grandTotalAmountOMR)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">Billed Line Items</span>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Item</th>
                      <th className="p-2.5 text-right">Qty</th>
                      <th className="p-2.5 text-right">Net Price</th>
                      <th className="p-2.5 text-right">VAT (5%)</th>
                      <th className="p-2.5 text-right">Total (OMR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedInvoice.lines.map((l) => (
                      <tr key={l.id}>
                        <td className="p-2.5 font-medium text-slate-900 dark:text-slate-100">{l.itemDescription}</td>
                        <td className="p-2.5 text-right text-slate-800 dark:text-slate-200">{l.invoicedQuantity}</td>
                        <td className="p-2.5 text-right text-slate-700 dark:text-slate-300">{formatOMR(l.invoicedUnitPrice)}</td>
                        <td className="p-2.5 text-right text-slate-700 dark:text-slate-300">{formatOMR(l.vatAmount)}</td>
                        <td className="p-2.5 text-right font-bold text-slate-900 dark:text-slate-100">{formatOMR(l.lineTotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="text-slate-500 dark:text-slate-400">
                Match Status: <span className="font-bold text-emerald-700 dark:text-emerald-300">{selectedInvoice.threeWayMatchStatus}</span>
              </div>
              {selectedInvoice.status !== 'Approved for Payment' && (
                <button
                  onClick={() => {
                    approvePurchaseInvoice(selectedInvoice.id, 'AP Lead Specialist');
                    setSelectedInvoice(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer"
                >
                  Approve for AP Payment
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

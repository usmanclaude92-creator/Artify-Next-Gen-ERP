import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  Building2,
  DollarSign,
  ArrowRight,
  ShieldAlert,
  Percent,
  Sparkles,
  ShoppingBag,
  Trash2,
  Eye,
  Printer
} from 'lucide-react';
import { useSalesCrm } from '../../services/salesCrmStore';
import { Quotation, QuotationLineItem, QuotationStatus } from '../../types';
import { ERPUserRole } from '../../../../types/erp';
import { notify } from '@/src/components/common/Feedback';
import { mockRandom } from '@/src/utils/mockRandom';

interface SalesQuotationsViewProps {
  activeTransactionId?: string;
  onNavigate?: (route: any) => void;
  activeRole: ERPUserRole;
}

export const SalesQuotationsView: React.FC<SalesQuotationsViewProps> = ({
  activeTransactionId,
  onNavigate,
  activeRole
}) => {
  const {
    quotations,
    customers,
    addQuotation,
    updateQuotationStatus,
    createSalesOrderFromQuotation
  } = useSalesCrm();

  const [activeTab, setActiveTab] = useState<'all' | 'create' | 'pricing' | 'discounts' | 'approvals'>(
    activeTransactionId === 'tx-quote-creation'
      ? 'create'
      : activeTransactionId === 'tx-pricing-calc'
      ? 'pricing'
      : activeTransactionId === 'tx-discount-rules'
      ? 'discounts'
      : activeTransactionId === 'tx-quote-approvals'
      ? 'approvals'
      : 'all'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(quotations[0] || null);

  // New Quotation Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [quoteCustomer, setQuoteCustomer] = useState(customers[0]?.id || '');
  const [quoteValidity, setQuoteValidity] = useState('2026-10-15');
  const [quotePaymentTerms, setQuotePaymentTerms] = useState('Net 60 Days');
  const [quoteDeliveryLead, setQuoteDeliveryLead] = useState('6-8 Weeks Ex-Works Muscat');
  const [quoteDiscountPct, setQuoteDiscountPct] = useState<number>(0);

  // Line items state in modal
  const [lineItems, setLineItems] = useState<
    { description: string; partNumber: string; quantity: number; unitPriceOMR: number; uom: string }[]
  >([
    {
      description: 'API 610 Submersible Multistage ESP Pump Set',
      partNumber: 'PMP-ESP-9800',
      quantity: 2,
      unitPriceOMR: 120000,
      uom: 'Sets'
    },
    {
      description: 'Variable Speed Drive (VSD) Control Panel (3.3kV)',
      partNumber: 'PNL-VSD-3300',
      quantity: 2,
      unitPriceOMR: 45000,
      uom: 'Units'
    }
  ]);

  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemPrice, setNewItemPrice] = useState(10000);

  // Notification for Sales Order conversion
  const [orderCreatedMsg, setOrderCreatedMsg] = useState<string | null>(null);

  const filteredQuotes = quotations.filter((q) => {
    const matchesSearch =
      q.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || q.status === selectedStatus;
    const matchesTab =
      activeTab === 'all' ||
      activeTab === 'create' ||
      (activeTab === 'approvals' && (q.status === 'Pending Commercial Approval' || q.requiresCommercialApproval)) ||
      (activeTab === 'discounts' && q.discountPercentage > 0) ||
      activeTab === 'pricing';
    return matchesSearch && matchesStatus && matchesTab;
  });

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.quantity * item.unitPriceOMR, 0);
  };

  const handleAddItem = () => {
    if (!newItemDesc) return;
    setLineItems([
      ...lineItems,
      {
        description: newItemDesc,
        partNumber: `SKU-${Math.floor(1000 + mockRandom() * 9000)}`,
        quantity: Number(newItemQty),
        unitPriceOMR: Number(newItemPrice),
        uom: 'EA'
      }
    ]);
    setNewItemDesc('');
    setNewItemQty(1);
    setNewItemPrice(10000);
  };

  const handleRemoveItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleCreateQuotationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteCustomer || lineItems.length === 0) return;

    const cust = customers.find((c) => c.id === quoteCustomer);
    const subtotal = calculateSubtotal();
    const discountAmt = (subtotal * quoteDiscountPct) / 100;
    const taxableAmt = subtotal - discountAmt;
    const vatAmt = (taxableAmt * 5) / 100;
    const total = taxableAmt + vatAmt;

    const requiresApproval = quoteDiscountPct > 7.5;

    const created = addQuotation({
      customerId: quoteCustomer,
      customerName: cust?.legalName || 'Client',
      customerVatNumber: cust?.taxIdentificationNumber || 'OM-VAT-10000000',
      currency: 'OMR',
      validUntilDate: quoteValidity,
      paymentTerms: quotePaymentTerms,
      deliveryLeadTime: quoteDeliveryLead,
      incoterms: 'DDP Site Delivery (Oman)',
      subtotalAmountOMR: subtotal,
      discountPercentage: quoteDiscountPct,
      discountAmountOMR: discountAmt,
      taxableAmountOMR: taxableAmt,
      vatPercentage: 5,
      vatAmountOMR: vatAmt,
      totalAmountOMR: total,
      grossMarginPercentage: 24.5 - quoteDiscountPct * 0.8,
      status: requiresApproval ? 'Pending Commercial Approval' : 'Approved',
      requiresCommercialApproval: requiresApproval,
      salesRepName: 'Eng. Tariq Al-Habsi',
      lines: lineItems.map((item, idx) => ({
        id: `ql-${Date.now()}-${idx}`,
        quotationId: 'temp',
        itemCode: item.partNumber,
        description: item.description,
        quantity: item.quantity,
        uom: item.uom,
        unitPriceOMR: item.unitPriceOMR,
        discountPercentage: quoteDiscountPct,
        lineTotalOMR: item.quantity * item.unitPriceOMR * (1 - quoteDiscountPct / 100),
        costPriceOMR: item.unitPriceOMR * 0.72,
        marginPercentage: 28
      }))
    });

    setSelectedQuote(created);
    setShowCreateModal(false);
  };

  const handleConvertToOrder = (quote: Quotation) => {
    try {
      const order = createSalesOrderFromQuotation(quote.id);
      setOrderCreatedMsg(
        `Sales Order ${order.orderNumber} successfully booked and confirmed for ${order.customerName} (Total: OMR ${order.totalAmountOMR.toLocaleString()})! Inventory reserved.`
      );
      setTimeout(() => setOrderCreatedMsg(null), 7000);
    } catch (err: any) {
      notify(err.message);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                Functional Area 06.05
              </span>
              <span className="text-xs text-slate-500">Configure, Price, Quote (CPQ) Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Sales Quotations, Pricing & Commercial Approvals
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              CPQ proposal generation, 5% Oman VAT computation, automated margin guardrails, and commercial director discount governance.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Generate CPQ Quotation
          </button>
        </div>

        {/* Process Tabs */}
        <div className="flex flex-wrap gap-2 border-t border-slate-200 dark:border-slate-800 pt-4 mt-5">
          {[
            { id: 'all', label: 'All Quotations' },
            { id: 'create', label: '06.05.01 Quotation CPQ Engine', code: 'tx-quote-creation' },
            { id: 'approvals', label: '06.05.04 Commercial Director Approvals', code: 'tx-quote-approvals' },
            { id: 'discounts', label: '06.05.03 Discount & Margin Guardrails', code: 'tx-discount-rules' },
            { id: 'pricing', label: '06.05.02 Price Matrices & Rules', code: 'tx-pricing-calc' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Success Alert for Order Booking */}
      {orderCreatedMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm flex items-start gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{orderCreatedMsg}</div>
        </div>
      )}

      {/* 2-Column Split: Quotation List & Live CPQ Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quotes Directory (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search quotes by number, customer..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending Commercial Approval">Pending Approval</option>
              <option value="Accepted by Client">Accepted by Client</option>
              <option value="Converted to Sales Order">Converted to SO</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredQuotes.map((quote) => {
              const isSelected = selectedQuote?.id === quote.id;

              return (
                <div
                  key={quote.id}
                  onClick={() => setSelectedQuote(quote)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 shadow-sm ring-1 ring-emerald-400/50'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {quote.quotationNumber}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                        {quote.customerName}
                      </h4>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        quote.status === 'Converted to Sales Order'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : quote.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : quote.status === 'Pending Commercial Approval'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {quote.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Total (incl. 5% VAT):</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      OMR {quote.totalAmountOMR.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>Valid until: {quote.validUntilDate}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Margin: {quote.grossMarginPercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive CPQ Quotation Document (7 cols) */}
        <div className="lg:col-span-7">
          {selectedQuote ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedQuote.quotationNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Rev: {selectedQuote.revisionNumber}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    Commercial Proposal for {selectedQuote.customerName}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Client VAT No: {selectedQuote.customerVatNumber} • Prepared by: {selectedQuote.salesRepName}
                  </div>
                </div>

                {/* Workflow Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {selectedQuote.status === 'Pending Commercial Approval' && (
                    <button
                      onClick={() => updateQuotationStatus(selectedQuote.id, 'Approved')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      ✓ Approve Discount
                    </button>
                  )}

                  {selectedQuote.status === 'Approved' && (
                    <button
                      onClick={() => handleConvertToOrder(selectedQuote)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Book Sales Order (LPO)
                    </button>
                  )}

                  <button
                    onClick={() => window.print()}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs cursor-pointer"
                    title="Print Formal Quotation"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Commercial Terms Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Payment Terms</span>
                  <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
                    {selectedQuote.paymentTerms}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Delivery Lead Time</span>
                  <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
                    {selectedQuote.deliveryLeadTime}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Incoterms</span>
                  <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
                    {selectedQuote.incoterms}
                  </span>
                </div>
              </div>

              {/* Line Items Table */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                  Quotation Line Items & Specifications
                </h4>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                      <tr>
                        <th className="px-3.5 py-2.5">Item & Description</th>
                        <th className="px-3 py-2.5 text-center">Qty / UOM</th>
                        <th className="px-3 py-2.5 text-right">Unit Price (OMR)</th>
                        <th className="px-3.5 py-2.5 text-right">Total (OMR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {selectedQuote.lines.map((line) => (
                        <tr key={line.id}>
                          <td className="px-3.5 py-2.5">
                            <div className="font-semibold text-slate-900 dark:text-white">{line.description}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{line.itemCode}</div>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            {line.quantity} {line.uom}
                          </td>
                          <td className="px-3 py-2.5 text-right font-medium">
                            {line.unitPriceOMR.toLocaleString()}
                          </td>
                          <td className="px-3.5 py-2.5 text-right font-bold text-slate-900 dark:text-white">
                            {line.lineTotalOMR.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Calculation Summary Box */}
              <div className="flex justify-end">
                <div className="w-full sm:w-72 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      OMR {selectedQuote.subtotalAmountOMR.toLocaleString()}
                    </span>
                  </div>

                  {selectedQuote.discountAmountOMR > 0 && (
                    <div className="flex justify-between text-rose-600 dark:text-rose-400">
                      <span>Discount ({selectedQuote.discountPercentage}%):</span>
                      <span>- OMR {selectedQuote.discountAmountOMR.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Taxable Base:</span>
                    <span>OMR {selectedQuote.taxableAmountOMR.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Oman VAT (5.0%):</span>
                    <span>OMR {selectedQuote.vatAmountOMR.toLocaleString()}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                    <span>Grand Total:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      OMR {selectedQuote.totalAmountOMR.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              Select a quotation to inspect line items and pricing breakdown.
            </div>
          )}
        </div>
      </div>

      {/* CPQ Generator Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  06.05.01 CPQ Quotation Generator
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuotationSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Select Customer *
                  </label>
                  <select
                    value={quoteCustomer}
                    onChange={(e) => setQuoteCustomer(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.legalName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Quotation Validity Date
                  </label>
                  <input
                    type="date"
                    value={quoteValidity}
                    onChange={(e) => setQuoteValidity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Line Items List */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-2">
                  Line Items Configured ({lineItems.length})
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                  {lineItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-between gap-2 border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex-1">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {item.description}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {item.quantity} {item.uom} × OMR {item.unitPriceOMR.toLocaleString()}
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        OMR {(item.quantity * item.unitPriceOMR).toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Item Row */}
                <div className="grid grid-cols-12 gap-2 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <input
                    type="text"
                    placeholder="Item description / Model"
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    className="col-span-6 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(Number(e.target.value))}
                    className="col-span-2 px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Unit Price"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    className="col-span-3 px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="col-span-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center justify-center font-bold text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Commercial Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={quoteDiscountPct}
                    onChange={(e) => setQuoteDiscountPct(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  {quoteDiscountPct > 7.5 && (
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1 font-semibold">
                      ⚠️ Requires Commercial Director Sign-off (&gt; 7.5%)
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Delivery Lead Time
                  </label>
                  <input
                    type="text"
                    value={quoteDeliveryLead}
                    onChange={(e) => setQuoteDeliveryLead(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md cursor-pointer"
                >
                  Generate Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

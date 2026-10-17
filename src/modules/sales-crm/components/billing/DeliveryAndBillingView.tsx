import React, { useState } from 'react';
import {
  Truck,
  FileText,
  DollarSign,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  QrCode,
  Building2,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Printer,
  Plus
} from 'lucide-react';
import { useSalesCrm } from '../../services/salesCrmStore';
import { DeliveryNote, ARInvoice, CreditNote, CustomerAdvance } from '../../types';
import { ERPUserRole } from '../../../../types/erp';
import { notify } from '@/src/components/common/Feedback';

interface DeliveryAndBillingViewProps {
  activeTransactionId?: string;
  onNavigate?: (route: any) => void;
  activeRole: ERPUserRole;
}

export const DeliveryAndBillingView: React.FC<DeliveryAndBillingViewProps> = ({
  activeTransactionId,
  onNavigate,
  activeRole
}) => {
  const {
    deliveryNotes,
    arInvoices,
    creditNotes,
    advances,
    confirmDeliveryNote,
    createInvoiceFromDeliveryNote,
    settleInvoicePayment
  } = useSalesCrm();

  const [activeTab, setActiveTab] = useState<'all' | 'delivery' | 'invoicing' | 'creditnotes' | 'advances'>(
    activeTransactionId === 'tx-delivery-notes'
      ? 'delivery'
      : activeTransactionId === 'tx-ar-invoicing'
      ? 'invoicing'
      : activeTransactionId === 'tx-credit-notes'
      ? 'creditnotes'
      : activeTransactionId === 'tx-cust-advances'
      ? 'advances'
      : 'all'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<ARInvoice | null>(arInvoices[0] || null);
  const [selectedDN, setSelectedDN] = useState<DeliveryNote | null>(deliveryNotes[0] || null);

  const [billingAlert, setBillingAlert] = useState<string | null>(null);

  const handleGenerateInvoice = (dn: DeliveryNote) => {
    try {
      const inv = createInvoiceFromDeliveryNote(dn.id);
      setSelectedInvoice(inv);
      setActiveTab('invoicing');
      setBillingAlert(
        `Tax Invoice ${inv.invoiceNumber} generated for ${inv.customerName}! 5% Oman VAT (${inv.vatAmountOMR.toLocaleString()} OMR) and QR verification token created.`
      );
      setTimeout(() => setBillingAlert(null), 7000);
    } catch (err: any) {
      notify(err.message);
    }
  };

  const handleSettlePayment = (inv: ARInvoice) => {
    const settleAmt = inv.balanceDueOMR ?? inv.amountDueOMR ?? inv.grandTotalOMR;
    settleInvoicePayment(inv.id, settleAmt);
    setBillingAlert(
      `Payment of OMR ${settleAmt.toLocaleString()} received and settled for Invoice ${inv.invoiceNumber}! Customer ledger updated.`
    );
    setTimeout(() => setBillingAlert(null), 7000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                Functional Area 06.07
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Logistics Dispatch, Tax Invoicing & Receivables</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Delivery Notes, AR Tax Invoices, Credit Memos & Advances
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Oman VAT statutory compliant e-invoices with QR verification, proof-of-delivery tracking, and advance payment matching.
            </p>
          </div>
        </div>

        {/* Process Tabs */}
        <div className="flex flex-wrap gap-2 border-t border-slate-200 dark:border-slate-800 pt-4 mt-5">
          {[
            { id: 'all', label: 'All Transactions' },
            { id: 'delivery', label: '06.07.01 Delivery Notes (DN)', code: 'tx-delivery-notes' },
            { id: 'invoicing', label: '06.07.02 AR Tax Invoices (5% VAT)', code: 'tx-ar-invoicing' },
            { id: 'creditnotes', label: '06.07.03 Credit Notes / Memos', code: 'tx-credit-notes' },
            { id: 'advances', label: '06.07.04 Customer Advances', code: 'tx-cust-advances' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Banner */}
      {billingAlert && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-3 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{billingAlert}</div>
        </div>
      )}

      {/* 1. DELIVERY NOTES SUB-SECTION */}
      {(activeTab === 'all' || activeTab === 'delivery') && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                06.07.01 Delivery Notes & Shipment Gate Passes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Goods dispatch documentation and site delivery receipts</p>
            </div>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              {deliveryNotes.length} Dispatched Shipments
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">DN # / Customer</th>
                  <th className="px-4 py-3">Sales Order Ref</th>
                  <th className="px-4 py-3">Carrier & Waybill</th>
                  <th className="px-4 py-3">Dispatch Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {deliveryNotes.map((dn) => (
                  <tr key={dn.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{dn.deliveryNoteNumber}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                        <span>{dn.customerName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {dn.salesOrderNumber}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-400">
                      <div>{dn.carrierName}</div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-400 font-mono">WB: {dn.waybillNumber}</div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-400">
                      {dn.dispatchDate}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          dn.status === 'Delivered / Customer Signed'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {dn.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      {dn.status === 'In Transit' && (
                        <button
                          onClick={() => confirmDeliveryNote(dn.id, 'Eng. Salim Al-Ghafri (PDO Receiving Lead)')}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                        >
                          Confirm POD
                        </button>
                      )}

                      <button
                        onClick={() => handleGenerateInvoice(dn)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-xs cursor-pointer"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        Generate Tax Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. AR TAX INVOICES & STATUTORY TAX BREAKDOWN */}
      {(activeTab === 'all' || activeTab === 'invoicing') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Invoice List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                06.07.02 Accounts Receivable Tax Invoices
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">{arInvoices.length} Invoices</span>
            </div>

            <div className="space-y-3">
              {arInvoices.map((inv) => {
                const isSelected = selectedInvoice?.id === inv.id;
                const isPaid = inv.status === 'Paid';

                return (
                  <div
                    key={inv.id}
                    onClick={() => setSelectedInvoice(inv)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 shadow-sm ring-1 ring-amber-400/50'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">
                          {inv.invoiceNumber}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                          {inv.customerName}
                        </h4>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">Invoice Total:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        OMR {inv.totalAmountOMR.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                      <span>Due: {inv.paymentDueDate}</span>
                      <span className="font-semibold text-amber-600 dark:text-amber-400">
                        Due: OMR {inv.amountDueOMR.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Invoice Document Preview (7 cols) */}
          <div className="lg:col-span-7">
            {selectedInvoice ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-bold text-amber-600 dark:text-amber-400">
                        {selectedInvoice.invoiceNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        5% Oman VAT Tax Invoice
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      Tax Invoice for {selectedInvoice.customerName}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Client Tax ID: <span className="font-mono text-slate-700 dark:text-slate-300">{selectedInvoice.customerTaxId}</span> • DN Ref: <span className="font-mono text-slate-700 dark:text-slate-300">{selectedInvoice.deliveryNoteNumber}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedInvoice.status !== 'Paid' && (
                      <button
                        onClick={() => handleSettlePayment(selectedInvoice)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4" />
                        Record Settlement
                      </button>
                    )}

                    <button
                      onClick={() => window.print()}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Statutory QR Code & Invoice Details */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">Tax Authority QR Compliance:</span> Validated
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">Seller VATIN:</span> OM-VAT-10008888 (Artify Industrial LLC)
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">Payment Due Date:</span> {selectedInvoice.paymentDueDate}
                    </div>
                  </div>

                  {/* Visual QR Code Mock */}
                  <div className="w-20 h-20 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center shrink-0 shadow-xs">
                    <QrCode className="w-12 h-12 text-slate-900 dark:text-white" />
                    <span className="text-[9px] font-mono text-slate-600 dark:text-slate-400 mt-0.5">Oman E-Tax</span>
                  </div>
                </div>

                {/* Line Items */}
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                      <tr>
                        <th className="px-3.5 py-2.5">Scope & Description</th>
                        <th className="px-3 py-2.5 text-center">Billed Qty</th>
                        <th className="px-3 py-2.5 text-right">Unit Price</th>
                        <th className="px-3 py-2.5 text-right">Total (OMR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {selectedInvoice.lines.map((l) => (
                        <tr key={l.id}>
                          <td className="px-3.5 py-2.5 font-semibold text-slate-900 dark:text-white">
                            {l.description}
                          </td>
                          <td className="px-3 py-2.5 text-center font-bold">
                            {l.quantityBilled} {l.uom}
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            OMR {l.unitPriceOMR.toLocaleString()}
                          </td>
                          <td className="px-3 py-2.5 text-right font-bold text-slate-900 dark:text-white">
                            OMR {l.lineTotalOMR.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Table */}
                <div className="flex justify-end">
                  <div className="w-full sm:w-72 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Taxable Net:</span>
                      <span>OMR {selectedInvoice.subtotalAmountOMR.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Oman VAT (5%):</span>
                      <span>OMR {selectedInvoice.vatAmountOMR.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                      <span>Grand Total:</span>
                      <span className="text-amber-600 dark:text-amber-400">
                        OMR {selectedInvoice.totalAmountOMR.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                Select an invoice to inspect tax calculations.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. CUSTOMER ADVANCES & DEPOSITS */}
      {(activeTab === 'all' || activeTab === 'advances') && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                06.07.04 Customer Down-Payments & Advances
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Advance payments received against project milestones</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {advances.map((adv) => (
              <div
                key={adv.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    {adv.receiptNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {adv.status}
                  </span>
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {adv.customerName}
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  Ref SO: <span className="font-mono text-slate-700 dark:text-slate-300">{adv.salesOrderNumber}</span> • Bank: <span className="text-slate-700 dark:text-slate-300">{adv.bankAccount}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                  <span>Advance Received:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    OMR {adv.amountReceivedOMR.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

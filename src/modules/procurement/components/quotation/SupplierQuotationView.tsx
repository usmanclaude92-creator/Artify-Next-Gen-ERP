import React, { useState } from 'react';
import { useProcurement } from '../../services/procurementStore';
import { SupplierQuotation, QuotationLineItem, CurrencyCode } from '../../types';
import {
  Columns,
  CheckCircle2,
  Award,
  Filter,
  Search,
  Plus,
  TrendingDown,
  Clock,
  ShieldCheck,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export const SupplierQuotationView: React.FC = () => {
  const {
    quotations,
    supplierSelections,
    addSupplierQuotation,
    awardSupplierSelection,
    rfqs,
    suppliers
  } = useProcurement();

  const [activeTab, setActiveTab] = useState<'comparison' | 'entry' | 'awards'>('comparison');
  const [selectedRfqFilter, setSelectedRfqFilter] = useState<string>(rfqs[0]?.rfqNumber || '');
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [targetQuoteForAward, setTargetQuoteForAward] = useState<SupplierQuotation | null>(null);

  // Award Form
  const [justification, setJustification] = useState('');
  const [savingsOMR, setSavingsOMR] = useState<number>(14600);

  // Entry Form
  const [selectedRfqId, setSelectedRfqId] = useState(rfqs[0]?.id || '');
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [quoteCurrency, setQuoteCurrency] = useState<CurrencyCode>('OMR');
  const [quoteSubtotal, setQuoteSubtotal] = useState<number>(148000);
  const [leadTimeWeeks, setLeadTimeWeeks] = useState<number>(10);
  const [warrantyMonths, setWarrantyMonths] = useState<number>(60);
  const [techScore, setTechScore] = useState<number>(95);
  const [evalRemarks, setEvalRemarks] = useState('');

  const formatOMR = (amt: number) =>
    `OMR ${amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const currentRfqQuotes = quotations.filter(
    (q) => !selectedRfqFilter || q.rfqNumber === selectedRfqFilter
  );

  const handleEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rfq = rfqs.find((r) => r.id === selectedRfqId);
    const supp = suppliers.find((s) => s.id === selectedSupplierId);
    if (!supp) return;

    const vat = quoteSubtotal * 0.05;
    const total = quoteSubtotal + vat;

    addSupplierQuotation({
      rfqId: rfq?.id,
      rfqNumber: rfq?.rfqNumber,
      supplierId: supp.id,
      supplierName: supp.name,
      supplierContact: supp.primaryContactName,
      quotationDate: new Date().toISOString().split('T')[0],
      validUntilDate: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
      currency: quoteCurrency,
      subtotal: Number(quoteSubtotal),
      taxAmount: vat,
      totalAmount: total,
      paymentTerms: 'Net 45 Days',
      incoterms: 'DDP (Delivered Duty Paid)',
      deliveryLeadTimeWeeks: Number(leadTimeWeeks),
      warrantyPeriodMonths: Number(warrantyMonths),
      technicalScore: Number(techScore),
      commercialScore: 90,
      compositeScore: Number(((techScore * 0.6) + (90 * 0.4)).toFixed(1)),
      status: 'Submitted',
      evaluationRemarks: evalRemarks || 'Quotation submitted in response to tender invitation.',
      lines: [
        {
          id: `qline-${Date.now()}`,
          itemDescription: rfq?.lines[0]?.itemDescription || 'Tender Line Item',
          offeredQuantity: rfq?.lines[0]?.targetQuantity || 1,
          unitOfMeasure: 'Units',
          unitPrice: Number(quoteSubtotal) / (rfq?.lines[0]?.targetQuantity || 1),
          discountPercentage: 0,
          netUnitPrice: Number(quoteSubtotal) / (rfq?.lines[0]?.targetQuantity || 1),
          lineTotal: Number(quoteSubtotal),
          leadTimeDays: leadTimeWeeks * 7,
          brandOrOrigin: supp.country,
          technicalCompliance: 'Full Compliance'
        }
      ]
    });

    setActiveTab('comparison');
  };

  const handleAwardConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetQuoteForAward) return;

    awardSupplierSelection({
      rfqNumber: targetQuoteForAward.rfqNumber || 'RFQ-DIRECT',
      awardDate: new Date().toISOString().split('T')[0],
      selectedSupplierId: targetQuoteForAward.supplierId,
      selectedSupplierName: targetQuoteForAward.supplierName,
      selectedQuotationNumber: targetQuoteForAward.quotationNumber,
      totalAwardValueOMR: targetQuoteForAward.totalAmountOMR,
      savingsVsBudgetOMR: Number(savingsOMR),
      committeeChairman: 'Mazin Al-Hinai (CPO)',
      committeeMembers: [
        'Eng. Salim Al-Rawahi (Lead Technical Evaluator)',
        'Fatma Al-Hasani (Lead Buyer)',
        'Nasser Al-Balushi (Finance Observer)'
      ],
      justificationNotes:
        justification ||
        'Bidder demonstrated superior composite score, lowest landed total cost of ownership, and full compliance with Omani ICV standards.',
      approvalStatus: 'Approved'
    });

    setShowAwardModal(false);
    setTargetQuoteForAward(null);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'comparison'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>05.04.02 Comparative Bid Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab('entry')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'entry'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>05.04.01 Quotation Entry</span>
          </button>
          <button
            onClick={() => setActiveTab('awards')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'awards'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>05.04.03 Committee Award Register</span>
          </button>
        </div>

        {activeTab === 'comparison' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Filter RFQ:</span>
            <select
              value={selectedRfqFilter}
              onChange={(e) => setSelectedRfqFilter(e.target.value)}
              className="text-xs p-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white font-bold text-slate-800 cursor-pointer"
            >
              <option value="">All Active Tender Bids</option>
              {rfqs.map((r) => (
                <option key={r.id} value={r.rfqNumber}>
                  {r.rfqNumber} — {r.title.slice(0, 35)}...
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: COMPARATIVE BID MATRIX */}
      {activeTab === 'comparison' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Commercial & Technical Bid Tabulation</h3>
                <p className="text-xs text-slate-500">
                  Side-by-side evaluation of landed unit rates, warranty coverage, delivery lead times, and weighted composite score.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <th className="py-3 px-3">Quotation #</th>
                    <th className="py-3 px-3">Supplier Name</th>
                    <th className="py-3 px-3">Currency & Terms</th>
                    <th className="py-3 px-3 text-right">Offered Value</th>
                    <th className="py-3 px-3 text-right">Value (OMR)</th>
                    <th className="py-3 px-3 text-center">Lead Time</th>
                    <th className="py-3 px-3 text-center">Warranty</th>
                    <th className="py-3 px-3 text-center">Tech Score</th>
                    <th className="py-3 px-3 text-center">Composite Score</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Award Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentRfqQuotes.map((q) => {
                    const isWinner = q.status === 'Selected / Awarded';
                    return (
                      <tr
                        key={q.id}
                        className={`transition-colors ${
                          isWinner ? 'bg-emerald-50/60 font-semibold' : 'hover:bg-slate-50/70'
                        }`}
                      >
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{q.quotationNumber}</td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{q.supplierName}</div>
                          <div className="text-[10px] text-slate-500">{q.supplierContact}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-700">
                          <div>{q.currency} • {q.incoterms}</div>
                          <div className="text-[10px] text-slate-500">{q.paymentTerms}</div>
                        </td>
                        <td className="py-3 px-3 text-right font-medium text-slate-800">
                          {q.currency} {q.totalAmount.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-900">
                          {formatOMR(q.totalAmountOMR)}
                        </td>
                        <td className="py-3 px-3 text-center text-slate-700">{q.deliveryLeadTimeWeeks} Weeks</td>
                        <td className="py-3 px-3 text-center text-slate-700">{q.warrantyPeriodMonths} Months</td>
                        <td className="py-3 px-3 text-center font-bold text-slate-800">{q.technicalScore}/100</td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              q.compositeScore >= 90
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {q.compositeScore} / 100
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isWinner
                                ? 'bg-emerald-200 text-emerald-900'
                                : q.status === 'Rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {q.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {q.status !== 'Selected / Awarded' && (
                            <button
                              onClick={() => {
                                setTargetQuoteForAward(q);
                                setShowAwardModal(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Award Contract
                            </button>
                          )}
                          {isWinner && (
                            <span className="text-[11px] text-emerald-800 font-bold flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Awarded</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QUOTATION ENTRY FORM */}
      {activeTab === 'entry' && (
        <div className="bg-white rounded-2xl max-w-2xl p-6 border border-slate-200 shadow-2xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900">Record Vendor Bid Submission</h3>
          <form onSubmit={handleEntrySubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select RFQ Tender</label>
                <select
                  value={selectedRfqId}
                  onChange={(e) => setSelectedRfqId(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {rfqs.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.rfqNumber} — {r.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Bidding Supplier</label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.country})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Currency</label>
                <select
                  value={quoteCurrency}
                  onChange={(e) => setQuoteCurrency(e.target.value as CurrencyCode)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="OMR">OMR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Net Bid Subtotal</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={quoteSubtotal}
                  onChange={(e) => setQuoteSubtotal(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Lead Time (Weeks)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={leadTimeWeeks}
                  onChange={(e) => setLeadTimeWeeks(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Warranty Period (Months)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={warrantyMonths}
                  onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Technical Evaluation Score (0-100)</label>
                <input
                  type="number"
                  required
                  min={0}
                  max={100}
                  value={techScore}
                  onChange={(e) => setTechScore(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Technical & Evaluation Remarks</label>
              <textarea
                rows={3}
                value={evalRemarks}
                onChange={(e) => setEvalRemarks(e.target.value)}
                placeholder="Compliance remarks, deviations, and factory audit notes..."
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs cursor-pointer"
              >
                Log Quotation
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: AWARDS REGISTER */}
      {activeTab === 'awards' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Procurement Committee Official Award Signoffs</h3>

            <div className="space-y-3">
              {supplierSelections.map((award) => (
                <div key={award.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{award.awardNumber}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {award.approvalStatus}
                      </span>
                    </div>
                    <span className="text-slate-500 font-medium">Award Date: {award.awardDate}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm font-bold text-slate-900 pt-1">
                    <span>{award.selectedSupplierName}</span>
                    <span className="text-emerald-700">{formatOMR(award.totalAwardValueOMR)}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100">
                    <div>
                      <span className="font-semibold text-slate-800">Linked RFQ:</span> {award.rfqNumber}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800">Savings vs Budget:</span>{' '}
                      <span className="font-bold text-emerald-600">{formatOMR(award.savingsVsBudgetOMR)}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="font-semibold text-slate-800">Committee Signoff:</span> {award.committeeChairman} & Members ({award.committeeMembers.join(', ')})
                    </div>
                  </div>

                  <p className="text-slate-700 text-[11px] pt-1 italic">"{award.justificationNotes}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AWARD CONFIRMATION MODAL */}
      {showAwardModal && targetQuoteForAward && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Procurement Committee Award Signoff</h3>
            <p className="text-slate-600">
              Confirm official contract award for <span className="font-bold text-slate-900">{targetQuoteForAward.supplierName}</span> at <span className="font-bold text-emerald-700">{formatOMR(targetQuoteForAward.totalAmountOMR)}</span>.
            </p>

            <form onSubmit={handleAwardConfirm} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Calculated Cost Savings vs Budget (OMR)</label>
                <input
                  type="number"
                  required
                  value={savingsOMR}
                  onChange={(e) => setSavingsOMR(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Award Committee Justification</label>
                <textarea
                  rows={3}
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Justification statement for audit and compliance records..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAwardModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs cursor-pointer"
                >
                  Execute Award & Notify Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

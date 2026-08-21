import React, { useState } from 'react';
import { useProcurement } from '../../services/procurementStore';
import { RequestForQuotation, RFQLineItem } from '../../types';
import {
  Send,
  Plus,
  Search,
  Filter,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Mail,
  UserPlus
} from 'lucide-react';

export const RequestForQuotationView: React.FC = () => {
  const { rfqs, createRFQ, inviteSupplierToRfq, updateRfqStatus, suppliers } = useProcurement();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRfq, setSelectedRfq] = useState<RequestForQuotation | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');

  // RFQ Form state
  const [rfqTitle, setRfqTitle] = useState('');
  const [rfqCategory, setRfqCategory] = useState('Capital Equipment');
  const [rfqClosingDate, setRfqClosingDate] = useState(
    new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0]
  );
  const [rfqLocation, setRfqLocation] = useState('Sohar Industrial Estate Distribution Yard');
  const [rfqPaymentTerms, setRfqPaymentTerms] = useState('Net 45 Days from GRN Acceptance');
  const [rfqTerms, setRfqTerms] = useState('');

  // Line items state
  const [lines, setLines] = useState<Omit<RFQLineItem, 'id'>[]>([
    {
      itemCode: 'EQP-GEN-01',
      itemDescription: '1500 kVA Step-Down Industrial Power Distribution Transformer',
      specification: 'Copper windings, Dyn11 vector group, ONAN cooling, IEC 60076 standards.',
      targetQuantity: 4,
      unitOfMeasure: 'Units',
      targetDeliveryDate: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0]
    }
  ]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfqTitle.trim()) return;

    const rfqLines: RFQLineItem[] = lines.map((l, idx) => ({
      ...l,
      id: `rfqline-${Date.now()}-${idx}`
    }));

    const today = new Date().toISOString().split('T')[0];

    createRFQ({
      title: rfqTitle,
      issueDate: today,
      closingDate: rfqClosingDate,
      category: rfqCategory,
      procurementSpecialist: 'Fatma Al-Hasani (Lead Buyer)',
      deliveryLocation: rfqLocation,
      paymentTerms: rfqPaymentTerms,
      status: 'Published',
      lines: rfqLines,
      invitedSuppliers: suppliers.slice(0, 3).map((s) => ({
        supplierId: s.id,
        supplierName: s.name,
        supplierEmail: s.primaryEmail,
        inviteStatus: 'Invited',
        invitedAt: today,
        submissionDeadline: rfqClosingDate
      })),
      termsAndConditions:
        rfqTerms ||
        'All bidders must provide fixed unit rates inclusive of duties, warranty terms, and valid tax compliance certificates.'
    });

    setShowCreateModal(false);
    setRfqTitle('');
    setRfqTerms('');
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRfq || !selectedSupplierId) return;

    inviteSupplierToRfq(selectedRfq.id, selectedSupplierId);
    setShowInviteModal(false);

    // Refresh selected RFQ state
    const updated = rfqs.find((r) => r.id === selectedRfq.id);
    if (updated) setSelectedRfq(updated);
  };

  const filteredRfqs = rfqs.filter(
    (r) =>
      r.rfqNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search RFQ #, title, or category..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Issue New RFQ Tender</span>
        </button>
      </div>

      {/* RFQ List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRfqs.map((rfq) => (
          <div
            key={rfq.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {rfq.rfqNumber}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    rfq.status === 'Published'
                      ? 'bg-blue-100 text-blue-800'
                      : rfq.status === 'Under Evaluation'
                      ? 'bg-amber-100 text-amber-800'
                      : rfq.status === 'Awarded'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {rfq.status}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Closes: {rfq.closingDate}</span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 leading-snug">{rfq.title}</h3>
            <p className="text-xs text-slate-500 line-clamp-2">
              {rfq.lines[0]?.specification || 'Detailed engineering specifications specified in tender package.'}
            </p>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600">
              <div>
                <span className="font-semibold text-slate-700">Invited Suppliers:</span>{' '}
                {rfq.invitedSuppliers.length} Vendors
              </div>
              <div>
                <span className="font-semibold text-slate-700">Bids Received:</span>{' '}
                <span className="font-bold text-indigo-600">{rfq.bidSubmissionCount} Bids</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500 font-medium">{rfq.category}</span>
              <button
                onClick={() => setSelectedRfq(rfq)}
                className="font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                Manage Bids & Invites →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RFQ DETAIL & INVITATION MODAL */}
      {selectedRfq && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-slate-900">{selectedRfq.rfqNumber}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                    {selectedRfq.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{selectedRfq.title}</h3>
              </div>
              <button
                onClick={() => setSelectedRfq(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scope Specifications */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-900 block">Tender Scope of Work & Items</span>
              {selectedRfq.lines.map((l) => (
                <div key={l.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{l.itemDescription}</span>
                    <span>
                      Target: {l.targetQuantity} {l.unitOfMeasure}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{l.specification}</p>
                </div>
              ))}
            </div>

            {/* Invited Supplier Register */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  Invited Bidders & Response Status ({selectedRfq.invitedSuppliers.length})
                </span>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>Invite Additional Supplier</span>
                </button>
              </div>

              <div className="space-y-2">
                {selectedRfq.invitedSuppliers.map((supp, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{supp.supplierName}</div>
                      <div className="text-[11px] text-slate-500">{supp.supplierEmail}</div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          supp.inviteStatus === 'Bid Submitted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {supp.inviteStatus}
                      </span>
                      {supp.responseRef && (
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{supp.responseRef}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedRfq(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INVITE SUPPLIER SUB-MODAL */}
      {showInviteModal && selectedRfq && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-slate-200 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Invite Qualified Supplier</h3>
            <form onSubmit={handleInviteSubmit} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Supplier from AVL</label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category} • {s.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-[11px]">
                An automated tender package notification with bidding credentials will be dispatched to the supplier's primary email.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-xs cursor-pointer"
                >
                  Dispatch Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE RFQ MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-slate-200 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Create Request for Quotation (RFQ)</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tender Title</label>
                <input
                  type="text"
                  required
                  value={rfqTitle}
                  onChange={(e) => setRfqTitle(e.target.value)}
                  placeholder="e.g. Competitive Tender for 1500 kVA Step-Down Distribution Transformers"
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={rfqCategory}
                    onChange={(e) => setRfqCategory(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="Raw Materials">Raw Materials</option>
                    <option value="Capital Equipment">Capital Equipment</option>
                    <option value="IT & Telecom">IT & Telecom</option>
                    <option value="Facilities & Services">Facilities & Services</option>
                    <option value="Logistics">Logistics</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Bid Submission Closing Date</label>
                  <input
                    type="date"
                    required
                    value={rfqClosingDate}
                    onChange={(e) => setRfqClosingDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Delivery Destination</label>
                  <input
                    type="text"
                    value={rfqLocation}
                    onChange={(e) => setRfqLocation(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Standard Payment Terms</label>
                  <input
                    type="text"
                    value={rfqPaymentTerms}
                    onChange={(e) => setRfqPaymentTerms(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Commercial Terms & Special Conditions</label>
                <textarea
                  rows={3}
                  value={rfqTerms}
                  onChange={(e) => setRfqTerms(e.target.value)}
                  placeholder="Compliance requirements, warranty periods, Incoterms..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs cursor-pointer"
                >
                  Publish & Invite Suppliers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

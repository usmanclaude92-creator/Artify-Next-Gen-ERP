import React, { useState } from 'react';
import { useProcurement } from '../../services/procurementStore';
import { PurchaseRequisition, PRLineItem, PriorityLevel, CurrencyCode } from '../../types';
import {
  FilePlus,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  FileCheck,
  Search,
  Filter,
  Eye,
  Plus,
  Trash2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const PurchaseRequisitionView: React.FC = () => {
  const {
    requisitions,
    createRequisition,
    submitRequisition,
    approveRequisition,
    rejectRequisition,
    convertPrToPo,
    convertPrToRfq,
    suppliers
  } = useProcurement();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPr, setSelectedPr] = useState<PurchaseRequisition | null>(null);

  // Form states
  const [prDept, setPrDept] = useState('Engineering & Projects');
  const [prCostCenter, setPrCostCenter] = useState('CC-ENG-401');
  const [prProject, setPrProject] = useState('PROJ-SOHAR-SUBSTATION');
  const [prRequiredDate, setPrRequiredDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [prPriority, setPrPriority] = useState<PriorityLevel>('Standard');
  const [prCurrency, setPrCurrency] = useState<CurrencyCode>('OMR');
  const [prPurpose, setPrPurpose] = useState('');
  const [prJustification, setPrJustification] = useState('');

  // Line items state
  const [lines, setLines] = useState<Omit<PRLineItem, 'id' | 'lineTotal'>[]>([
    {
      itemCode: 'MAT-GEN-01',
      itemDescription: 'Industrial Grade Heavy Duty Cables & Fitting Accessories',
      category: 'Raw Materials',
      quantity: 50,
      unitOfMeasure: 'Units',
      estimatedUnitPrice: 120,
      requiredByDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      glAccountCode: '1410-02-001',
      costCenter: 'CC-ENG-401',
      preferredSupplierId: 'supp-01',
      preferredSupplierName: 'Oman Cables Industry SAOG'
    }
  ]);

  const formatOMR = (amt: number) =>
    `OMR ${amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const addLine = () => {
    setLines([
      ...lines,
      {
        itemDescription: '',
        category: 'Raw Materials',
        quantity: 1,
        unitOfMeasure: 'Units',
        estimatedUnitPrice: 0,
        requiredByDate: prRequiredDate,
        glAccountCode: '1410-02-001',
        costCenter: prCostCenter
      }
    ]);
  };

  const removeLine = (idx: number) => {
    if (lines.length === 1) return;
    setLines(lines.filter((_, i) => i !== idx));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prPurpose.trim()) return;

    const prLines: PRLineItem[] = lines.map((l, idx) => ({
      ...l,
      id: `prline-${Date.now()}-${idx}`,
      lineTotal: l.quantity * l.estimatedUnitPrice
    }));

    const totalEst = prLines.reduce((acc, curr) => acc + curr.lineTotal, 0);

    createRequisition({
      requestDate: new Date().toISOString().split('T')[0],
      requiredDeliveryDate: prRequiredDate,
      requestorId: 'emp-current',
      requestorName: 'Eng. Salim Al-Rawahi',
      department: prDept,
      costCenter: prCostCenter,
      projectCode: prProject || undefined,
      priority: prPriority,
      currency: prCurrency,
      totalEstimatedAmount: totalEst,
      status: 'Submitted',
      purpose: prPurpose,
      justification: prJustification || 'Required for scheduled operational / project milestone fulfillment.',
      lines: prLines,
      attachedDocCount: 1
    });

    setShowCreateModal(false);
    setPrPurpose('');
    setPrJustification('');
  };

  const filteredPrs = requisitions.filter((pr) => {
    const matchesFilter = filterStatus === 'ALL' || pr.status === filterStatus;
    const matchesSearch =
      pr.prNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.requestorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by PR #, description, department, or requestor..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs p-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white font-medium text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Requisition Statuses</option>
            <option value="Submitted">Submitted / In Review</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Approved">Approved</option>
            <option value="Converted to PO">Converted to PO</option>
            <option value="Converted to RFQ">Converted to RFQ</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <FilePlus className="w-3.5 h-3.5" />
          <span>New Purchase Requisition</span>
        </button>
      </div>

      {/* PR Table List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <th className="py-3 px-4">PR Number</th>
                <th className="py-3 px-4">Requestor & Dept</th>
                <th className="py-3 px-4">Purpose & Line Items</th>
                <th className="py-3 px-4">Required Date</th>
                <th className="py-3 px-4 text-right">Est. Value (OMR)</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPrs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    No purchase requisitions found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredPrs.map((pr) => (
                  <tr key={pr.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900">{pr.prNumber}</span>
                      <div className="text-[10px] text-slate-400">{pr.requestDate}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{pr.requestorName}</div>
                      <div className="text-[11px] text-slate-500">{pr.department}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-slate-900 truncate">{pr.purpose}</div>
                      <div className="text-[11px] text-slate-500">
                        {pr.lines.length} Line Item(s) • {pr.lines[0]?.itemDescription}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{pr.requiredDeliveryDate}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {formatOMR(pr.totalEstimatedAmountOMR)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          pr.priority === 'Urgent / Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : pr.priority === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {pr.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          pr.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : pr.status === 'Converted to PO'
                            ? 'bg-blue-100 text-blue-800'
                            : pr.status === 'Converted to RFQ'
                            ? 'bg-cyan-100 text-cyan-800'
                            : pr.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {pr.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedPr(pr)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PR DETAILS & WORKFLOW MODAL */}
      {selectedPr && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 border border-slate-200 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-slate-900">{selectedPr.prNumber}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                    {selectedPr.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Requested on {selectedPr.requestDate} by {selectedPr.requestorName} ({selectedPr.department})
                </p>
              </div>
              <button
                onClick={() => setSelectedPr(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* General Information Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl text-xs">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Cost Center</span>
                <span className="font-bold text-slate-800">{selectedPr.costCenter}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Project Code</span>
                <span className="font-bold text-slate-800">{selectedPr.projectCode || 'N/A — Operational'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Delivery Deadline</span>
                <span className="font-bold text-slate-800">{selectedPr.requiredDeliveryDate}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Est. Value</span>
                <span className="font-bold text-slate-900">{formatOMR(selectedPr.totalEstimatedAmountOMR)}</span>
              </div>
            </div>

            {/* Purpose & Justification */}
            <div className="space-y-1 text-xs">
              <span className="font-semibold text-slate-700 block">Procurement Scope & Purpose:</span>
              <p className="p-3 bg-slate-50 rounded-lg text-slate-800">{selectedPr.purpose}</p>
              <span className="font-semibold text-slate-700 block mt-2">Business Justification:</span>
              <p className="p-3 bg-slate-50 rounded-lg text-slate-800">{selectedPr.justification}</p>
            </div>

            {/* Line Items Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900">Requisition Line Items</span>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Item Description</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5 text-right">Qty</th>
                      <th className="p-2.5 text-right">Unit Rate</th>
                      <th className="p-2.5 text-right">Total (OMR)</th>
                      <th className="p-2.5">Preferred Supplier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedPr.lines.map((l) => (
                      <tr key={l.id}>
                        <td className="p-2.5 font-medium text-slate-900">{l.itemDescription}</td>
                        <td className="p-2.5 text-slate-600">{l.category}</td>
                        <td className="p-2.5 text-right font-medium text-slate-800">
                          {l.quantity} {l.unitOfMeasure}
                        </td>
                        <td className="p-2.5 text-right text-slate-700">{formatOMR(l.estimatedUnitPrice)}</td>
                        <td className="p-2.5 text-right font-bold text-slate-900">{formatOMR(l.lineTotal)}</td>
                        <td className="p-2.5 text-slate-600">{l.preferredSupplierName || 'Open Vendor Pool'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Workflow Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div>
                {selectedPr.approvedBy && (
                  <div className="text-[11px] text-emerald-700 font-medium">
                    ✓ Approved by {selectedPr.approvedBy} on {selectedPr.approvedDate}
                  </div>
                )}
                {selectedPr.convertedPoNumber && (
                  <div className="text-[11px] text-blue-700 font-bold">
                    Linked PO: {selectedPr.convertedPoNumber}
                  </div>
                )}
                {selectedPr.convertedRfqNumber && (
                  <div className="text-[11px] text-cyan-700 font-bold">
                    Linked RFQ: {selectedPr.convertedRfqNumber}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedPr.status === 'Submitted' && (
                  <>
                    <button
                      onClick={() => {
                        rejectRequisition(selectedPr.id, 'Procurement Committee', 'Budget allocation review pending.');
                        setSelectedPr(null);
                      }}
                      className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Reject PR
                    </button>
                    <button
                      onClick={() => {
                        approveRequisition(selectedPr.id, 'Mazin Al-Hinai (CPO)', 'Budget confirmed.');
                        setSelectedPr(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Approve Requisition
                    </button>
                  </>
                )}

                {selectedPr.status === 'Approved' && (
                  <>
                    <button
                      onClick={() => {
                        const newRfq = convertPrToRfq(selectedPr.id, 'Senior Sourcing Specialist');
                        alert(`Successfully converted PR to RFQ: ${newRfq.rfqNumber}`);
                        setSelectedPr(null);
                      }}
                      className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Convert to RFQ Tender
                    </button>
                    <button
                      onClick={() => {
                        const targetSupplier = selectedPr.lines[0]?.preferredSupplierId || suppliers[0].id;
                        const newPo = convertPrToPo(selectedPr.id, targetSupplier, 'Fatma Al-Hasani (Lead Buyer)');
                        alert(`Successfully converted PR to Purchase Order: ${newPo.poNumber}`);
                        setSelectedPr(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Direct Convert to PO
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PR MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Create Purchase Requisition (PR)</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department</label>
                  <input
                    type="text"
                    value={prDept}
                    onChange={(e) => setPrDept(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Cost Center Code</label>
                  <input
                    type="text"
                    value={prCostCenter}
                    onChange={(e) => setPrCostCenter(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Project Code</label>
                  <input
                    type="text"
                    value={prProject}
                    onChange={(e) => setPrProject(e.target.value)}
                    placeholder="e.g. PROJ-SOHAR-SUBSTATION"
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Required Delivery Date</label>
                  <input
                    type="date"
                    required
                    value={prRequiredDate}
                    onChange={(e) => setPrRequiredDate(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Priority Level</label>
                  <select
                    value={prPriority}
                    onChange={(e) => setPrPriority(e.target.value as PriorityLevel)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent / Critical">Urgent / Critical</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Currency</label>
                  <select
                    value={prCurrency}
                    onChange={(e) => setPrCurrency(e.target.value as CurrencyCode)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="OMR">OMR — Omani Rial</option>
                    <option value="USD">USD — US Dollar</option>
                    <option value="EUR">EUR — Euro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Scope & Purpose Summary</label>
                <input
                  type="text"
                  required
                  value={prPurpose}
                  onChange={(e) => setPrPurpose(e.target.value)}
                  placeholder="e.g. Procurement of high-voltage underground copper cables for Sohar substation upgrade..."
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Line Items Section */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Line Items</span>
                  <button
                    type="button"
                    onClick={addLine}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {lines.map((line, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] text-slate-700">Line #{idx + 1}</span>
                        {lines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLine(idx)}
                            className="text-rose-500 hover:text-rose-700 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            required
                            placeholder="Item description / specification"
                            value={line.itemDescription}
                            onChange={(e) => {
                              const updated = [...lines];
                              updated[idx].itemDescription = e.target.value;
                              setLines(updated);
                            }}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            required
                            min={1}
                            placeholder="Quantity"
                            value={line.quantity}
                            onChange={(e) => {
                              const updated = [...lines];
                              updated[idx].quantity = Number(e.target.value);
                              setLines(updated);
                            }}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            required
                            min={0.1}
                            placeholder="Est. Unit Price"
                            value={line.estimatedUnitPrice}
                            onChange={(e) => {
                              const updated = [...lines];
                              updated[idx].estimatedUnitPrice = Number(e.target.value);
                              setLines(updated);
                            }}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
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
                  Submit Requisition for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

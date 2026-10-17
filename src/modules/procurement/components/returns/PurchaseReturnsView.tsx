import React, { useState } from 'react';
import { useProcurement } from '../../services/procurementStore';
import { PurchaseReturn, DebitNote, ReturnLineItem } from '../../types';
import {
  RotateCcw,
  FileMinus,
  AlertOctagon,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  DollarSign,
  Truck,
  ArrowRight
} from 'lucide-react';
import { notify } from '@/src/components/common/Feedback';
import { mockRandom } from '@/src/utils/mockRandom';

export const PurchaseReturnsView: React.FC = () => {
  const {
    returns,
    debitNotes,
    createPurchaseReturn,
    generateDebitNoteFromReturn,
    grns,
    suppliers
  } = useProcurement();

  const [activeTab, setActiveTab] = useState<'returns' | 'debitNotes' | 'create'>('returns');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReturn, setSelectedReturn] = useState<PurchaseReturn | null>(null);

  // Return Form State
  const [selectedGrnId, setSelectedGrnId] = useState(grns[0]?.id || '');
  const [returnReason, setReturnReason] = useState<
    'QC Failure / Defective Material' | 'Damaged in Transit' | 'Incorrect Specification' | 'Excess Delivery'
  >('QC Failure / Defective Material');
  const [returnType, setReturnType] = useState<'Goods Return' | 'Service Dispute'>('Goods Return');
  const [returnAmount, setReturnAmount] = useState<number>(3780);
  const [returnRemarks, setReturnRemarks] = useState('');

  const formatOMR = (amt: number) =>
    `OMR ${amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const grn = grns.find((g) => g.id === selectedGrnId);
    if (!grn) return;

    const supp = suppliers.find((s) => s.id === grn.supplierId);

    const returnLines: ReturnLineItem[] = [
      {
        id: `retline-${Date.now()}`,
        poLineId: grn.lines[0]?.poLineId || 'line-1',
        itemCode: grn.lines[0]?.itemCode,
        itemDescription: grn.lines[0]?.itemDescription || 'Defective Items',
        returnedQuantity: 2,
        unitOfMeasure: 'Units',
        unitPriceOMR: Number(returnAmount) / 2,
        lineTotalOMR: Number(returnAmount),
        reasonForReturn: returnReason,
        batchNumber: grn.lines[0]?.batchNumber
      }
    ];

    const newReturn = createPurchaseReturn({
      returnType,
      poNumber: grn.poNumber,
      grnId: grn.id,
      grnNumber: grn.grnNumber,
      supplierId: grn.supplierId,
      supplierName: grn.supplierName,
      returnDate: new Date().toISOString().split('T')[0],
      reason: returnReason,
      currency: 'OMR',
      totalReturnValueOMR: Number(returnAmount),
      rmaNumber: `RMA-${Math.floor(10000 + mockRandom() * 90000)}`,
      status: 'Awaiting Dispatch',
      lines: returnLines,
      resolutionType: 'Supplier Debit Note',
      remarks: returnRemarks || 'Items isolated in warehouse quarantine bay pending supplier collection.'
    });

    setActiveTab('returns');
  };

  return (
    <div className="space-y-6">
      {/* Sub-header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('returns')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'returns'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>05.08.01 Goods Returns & RMA</span>
          </button>
          <button
            onClick={() => setActiveTab('debitNotes')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'debitNotes'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <FileMinus className="w-3.5 h-3.5" />
            <span>05.08.03 Supplier Debit Notes</span>
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
            <span>Initiate Return / Dispute</span>
          </button>
        </div>
      </div>

      {/* TAB 1: GOODS RETURNS REGISTER */}
      {activeTab === 'returns' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {returns.map((ret) => (
              <div key={ret.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {ret.returnNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200">
                      {ret.reason}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{formatOMR(ret.totalReturnValueOMR)}</span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">{ret.supplierName}</h4>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                    PO: {ret.poNumber} • GRN: {ret.grnNumber || 'N/A'} • RMA: {ret.rmaNumber || 'Pending RMA'}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg text-slate-700 dark:text-slate-300 text-[11px]">
                  <span className="font-bold">Remarks:</span> {ret.remarks}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">Status: {ret.status}</span>
                  {!ret.linkedDebitNoteNumber ? (
                    <button
                      onClick={() => {
                        const dn = generateDebitNoteFromReturn(ret.id, 'Procurement Accounting');
                        notify(`Debit Note Generated: ${dn.debitNoteNumber}`);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs cursor-pointer"
                    >
                      Generate Debit Note
                    </button>
                  ) : (
                    <span className="text-emerald-700 dark:text-emerald-300 font-bold">
                      Linked DN: {ret.linkedDebitNoteNumber}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DEBIT NOTES REGISTER */}
      {activeTab === 'debitNotes' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Supplier Debit Notes & AP Subledger Offsets</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official debit notes issued to suppliers with automatic GL account reversals against Accounts Payable trade balances.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {debitNotes.map((dn) => (
              <div key={dn.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{dn.debitNoteNumber}</span>
                    <span className="text-slate-500 dark:text-slate-400">• {dn.issueDate}</span>
                  </div>
                  <span className="font-bold text-rose-700 dark:text-rose-300 text-sm">{formatOMR(dn.grandTotalOMR)}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Supplier</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{dn.supplierName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Reference Return</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{dn.returnNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">GL Reversal Code</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{dn.glAccountCode}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-600 dark:text-slate-400">{dn.reasonDescription}</span>
                  <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-[10px]">
                    {dn.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INITIATE RETURN FORM */}
      {activeTab === 'create' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl p-6 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Initiate Goods Return / RMA</h3>
          <form onSubmit={handleCreateSubmit} className="space-y-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Select GRN Warehouse Delivery</label>
              <select
                value={selectedGrnId}
                onChange={(e) => setSelectedGrnId(e.target.value)}
                className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900"
              >
                {grns.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.grnNumber} — {g.supplierName} ({g.poNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Return Reason</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900"
                >
                  <option value="QC Failure / Defective Material">QC Failure / Defective Material</option>
                  <option value="Damaged in Transit">Damaged in Transit</option>
                  <option value="Incorrect Specification">Incorrect Specification</option>
                  <option value="Excess Delivery">Excess Delivery</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Return Claim Value (OMR)</label>
                <input
                  type="number"
                  required
                  value={returnAmount}
                  onChange={(e) => setReturnAmount(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Reason Details & Defect Log</label>
              <textarea
                rows={3}
                value={returnRemarks}
                onChange={(e) => setReturnRemarks(e.target.value)}
                placeholder="Details of laboratory rejection or shipping damage..."
                className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs cursor-pointer"
              >
                Log Return Document
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

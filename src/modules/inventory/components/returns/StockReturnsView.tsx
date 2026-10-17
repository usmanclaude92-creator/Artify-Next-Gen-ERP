import React, { useState } from 'react';
import { useInventoryStore } from '../../services/inventoryStore';
import { StockReturn, ReturnType, ReturnReason, ReturnDisposition } from '../../types';
import {
  RotateCcw,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  UserCheck,
  Building2,
  Trash2,
  RefreshCw
} from 'lucide-react';

interface StockReturnsViewProps {
  initialTab?: 'all' | 'customer_rma' | 'vendor_returns' | 'qc_inspection';
  onNavigate?: (route: any) => void;
}

export const StockReturnsView: React.FC<StockReturnsViewProps> = ({
  initialTab = 'all',
  onNavigate
}) => {
  const { returns, items, warehouses, createStockReturn, completeReturnInspection } = useInventoryStore();

  const [activeTab, setActiveTab] = useState<'all' | 'customer_rma' | 'vendor_returns' | 'qc_inspection'>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReturn, setSelectedReturn] = useState<StockReturn | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);

  // QC Inspection Form State
  const [qcInspector, setQcInspector] = useState('Salim Al-Busaidi (Lead QC Inspector)');
  const [qcNotes, setQcNotes] = useState('');
  const [qcDisposition, setQcDisposition] = useState<ReturnDisposition>('RESTOCK_PRIME');

  // Create Return Form State
  const [returnType, setReturnType] = useState<ReturnType>('SALES_RETURN');
  const [returnReason, setReturnReason] = useState<ReturnReason>('DEFECTIVE_PRODUCT');
  const [partnerName, setPartnerName] = useState('Petroleum Development Oman (PDO)');
  const [refDocNumber, setRefDocNumber] = useState('INV-2026-0812');
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id || '');
  const [selectedSku, setSelectedSku] = useState(items[0]?.sku || '');
  const [returnQty, setReturnQty] = useState(2);

  const filteredReturns = returns.filter((ret) => {
    const matchesSearch =
      ret.returnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ret.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ret.referenceDocNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ret.lines.some((l) => l.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || l.sku.toLowerCase().includes(searchTerm.toLowerCase()));

    if (activeTab === 'customer_rma') return matchesSearch && ret.returnType === 'SALES_RETURN';
    if (activeTab === 'vendor_returns') return matchesSearch && ret.returnType === 'PURCHASE_RETURN';
    if (activeTab === 'qc_inspection') return matchesSearch && ret.status === 'PENDING_INSPECTION';
    return matchesSearch;
  });

  const handleCreateReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = items.find((i) => i.sku === selectedSku) || items[0];
    const wh = warehouses.find((w) => w.id === warehouseId);

    const total = returnQty * item.unitCostOMR;

    const today = new Date().toISOString().split('T')[0];
    createStockReturn({
      returnType,
      status: 'PENDING_INSPECTION',
      returnDate: today,
      partnerId: '',
      partnerName,
      referenceDocType: returnType === 'SALES_RETURN' ? 'DELIVERY_NOTE' : 'GOODS_RECEIPT_NOTE',
      referenceDocNumber: refDocNumber,
      warehouseId,
      warehouseName: wh?.name || 'Warehouse',
      quarantineBinCode: 'QC-BAY-01',
      lines: [
        {
          id: `retline-${Date.now()}`,
          itemId: item.id,
          sku: item.sku,
          itemName: item.name,
          returnedQuantity: returnQty,
          uom: item.baseUom,
          unitCostOMR: item.unitCostOMR,
          totalCostOMR: total,
          returnReason: returnReason,
          inspectionNotes: 'Awaiting laboratory dimensional & metallurgical inspection'
        }
      ],
      totalQuantity: returnQty,
      totalValueOMR: total,
      notes: 'Under quarantine in QC Bay 01',
      createdBy: 'Said Al-Rawahi'
    });

    setIsCreateModalOpen(false);
  };

  const handleInspectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReturn) return;

    completeReturnInspection(
      selectedReturn.id,
      qcInspector,
      selectedReturn.lines.map((l) => ({
        lineId: l.id,
        disposition: qcDisposition,
        notes: qcNotes,
        passedQty: qcDisposition === 'RESTOCK_PRIME' ? l.returnedQuantity : 0,
        rejectedQty: qcDisposition === 'RESTOCK_PRIME' ? 0 : l.returnedQuantity
      }))
    );
    setIsInspectModalOpen(false);
    setSelectedReturn(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-800/40">
              07.04
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Stock Returns & QC Inspection Workbench</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Vendor purchase returns, customer RMA cases, credit/debit note linkage, and quarantine inspection
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'all' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              All Returns ({returns.length})
            </button>
            <button
              onClick={() => setActiveTab('customer_rma')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'customer_rma' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Customer RMA
            </button>
            <button
              onClick={() => setActiveTab('vendor_returns')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'vendor_returns' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Vendor Returns
            </button>
            <button
              onClick={() => setActiveTab('qc_inspection')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'qc_inspection' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              QC Workbench
            </button>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 text-xs font-medium bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Initiate Return</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-600 dark:text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search return RMA #, customer/vendor, invoice #, or item description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Returns Data Table */}
      <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Return RMA & Date</th>
                <th className="py-3 px-3">Return Class</th>
                <th className="py-3 px-3">Counterparty</th>
                <th className="py-3 px-3">Ref Invoice / PO</th>
                <th className="py-3 px-3">Receiving Hub</th>
                <th className="py-3 px-3">Defect Reason</th>
                <th className="py-3 px-3 text-right">Refund Value</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-center">QC Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
              {filteredReturns.map((ret) => (
                <tr
                  key={ret.id}
                  onClick={() => setSelectedReturn(ret)}
                  className="hover:bg-slate-100/70 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-rose-600 dark:text-rose-400">
                        <RotateCcw className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">{ret.returnNumber}</span>
                        <div className="text-[10px] text-slate-600 dark:text-slate-400 font-mono">{ret.returnDate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                      {ret.returnType === 'SALES_RETURN' ? 'Customer RMA' : 'Vendor Return'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-900 dark:text-white">{ret.partnerName}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-cyan-600 dark:text-cyan-400">{ret.referenceDocNumber}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-slate-700 dark:text-slate-300">{ret.warehouseName}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-slate-700 dark:text-slate-300">{(ret.lines[0]?.returnReason ?? '').replace(/_/g, ' ')}</span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    OMR {ret.totalValueOMR.toFixed(2)}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                        ret.status === 'RESTOCKED'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-800/40'
                          : ret.status === 'PENDING_INSPECTION'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-800/40'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-800/40'
                      }`}
                    >
                      {ret.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    {ret.status === 'PENDING_INSPECTION' ? (
                      <button
                        onClick={() => {
                          setSelectedReturn(ret);
                          setIsInspectModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded text-[10px] font-semibold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1 mx-auto"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>Inspect QC</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-600 dark:text-slate-400">Inspected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QC INSPECTION MODAL */}
      {isInspectModalOpen && selectedReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Quarantine Quality Control Inspection</h3>
                  <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400">Case: {selectedReturn.returnNumber}</span>
                </div>
              </div>
              <button
                onClick={() => setIsInspectModalOpen(false)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInspectSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-100/60 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-lg space-y-1">
                <div className="text-slate-600 dark:text-slate-400">Inspecting Return Items:</div>
                {selectedReturn.lines.map((l, idx) => (
                  <div key={idx} className="font-semibold text-slate-900 dark:text-white">
                    {l.returnedQuantity} {l.uom} of {l.itemName} ({l.sku})
                  </div>
                ))}
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Lead QC Inspector</label>
                <input
                  type="text"
                  required
                  value={qcInspector}
                  onChange={(e) => setQcInspector(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">QC Disposition Routing Decision</label>
                <select
                  value={qcDisposition}
                  onChange={(e) => setQcDisposition(e.target.value as ReturnDisposition)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-medium"
                >
                  <option value="RESTOCK_PRIME">Pristine Condition — Restock to Prime Inventory</option>
                  <option value="SCRAP_WRITEOFF">Irreparable Defect — Scrap & Destroy</option>
                  <option value="REFURBISH_REWORK">Repairable — Send to Internal Workshop Rework</option>
                  <option value="SUPPLIER_CLAIM">Vendor Fault — Return to Supplier (Debit Note)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Laboratory Findings & Inspection Notes</label>
                <textarea
                  rows={3}
                  required
                  value={qcNotes}
                  onChange={(e) => setQcNotes(e.target.value)}
                  placeholder="Dimensional verification, pressure test results, metallurgical certificate review..."
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInspectModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold"
                >
                  Sign & Certify QC Disposition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE RETURN MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Initiate Stock Return (RMA)</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReturnSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Return Class</label>
                  <select
                    value={returnType}
                    onChange={(e) => setReturnType(e.target.value as ReturnType)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="SALES_RETURN">Customer Sales Return (RMA)</option>
                    <option value="PURCHASE_RETURN">Vendor Purchase Return</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Defect / Reason</label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value as ReturnReason)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="DEFECTIVE_PRODUCT">Defective / Non-Conforming</option>
                    <option value="WRONG_SPECIFICATION">Wrong Specification Delivered</option>
                    <option value="ORDER_CANCELLED">Project Surplus Cancellation</option>
                    <option value="TRANSIT_DAMAGE">Damaged In Road Transit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Client / Vendor Organization</label>
                <input
                  type="text"
                  required
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Reference Invoice / PO #</label>
                  <input
                    type="text"
                    required
                    value={refDocNumber}
                    onChange={(e) => setRefDocNumber(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Quarantine Receiving Facility</label>
                  <select
                    value={warehouseId}
                    onChange={(e) => setWarehouseId(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Material SKU</label>
                  <select
                    value={selectedSku}
                    onChange={(e) => setSelectedSku(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                  >
                    {items.map((i) => (
                      <option key={i.id} value={i.sku}>{i.sku} — {i.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Returned Quantity</label>
                  <input
                    type="number"
                    required
                    value={returnQty}
                    onChange={(e) => setReturnQty(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold"
                >
                  Create RMA & Send to QC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

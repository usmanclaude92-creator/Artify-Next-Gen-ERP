import React, { useState } from 'react';
import { useInventoryStore } from '../../services/inventoryStore';
import { StockTransaction, StockTransactionType, StockMovementReason, StockTransactionLine } from '../../types';
import {
  Repeat,
  Plus,
  Search,
  Filter,
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
  Truck,
  FileCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  Layers,
  FileText
} from 'lucide-react';

interface StockTransactionsViewProps {
  initialTab?: 'all' | 'receipts' | 'issues' | 'transfers' | 'adjustments' | 'opening';
  onNavigate?: (route: any) => void;
}

export const StockTransactionsView: React.FC<StockTransactionsViewProps> = ({
  initialTab = 'all',
  onNavigate
}) => {
  const {
    transactions,
    items,
    warehouses,
    binLocations,
    createTransaction,
    approveTransaction,
    postTransaction
  } = useInventoryStore();

  const [activeTab, setActiveTab] = useState<'all' | 'receipts' | 'issues' | 'transfers' | 'adjustments' | 'opening'>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTxForDetail, setSelectedTxForDetail] = useState<StockTransaction | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // New Transaction Form State
  const [txType, setTxType] = useState<StockTransactionType>('GOODS_RECEIPT');
  const [sourceWarehouseId, setSourceWarehouseId] = useState<string>(warehouses[0]?.id || '');
  const [targetWarehouseId, setTargetWarehouseId] = useState<string>(warehouses[1]?.id || '');
  const [reasonCode, setReasonCode] = useState<StockMovementReason>('PURCHASE_RECEIPT');
  const [notes, setNotes] = useState<string>('');
  const [selectedSku, setSelectedSku] = useState<string>(items[0]?.sku || '');
  const [lineQty, setLineQty] = useState<number>(10);
  const [lineCost, setLineCost] = useState<number>(items[0]?.unitCostOMR || 100);
  const [lineBatch, setLineBatch] = useState<string>('');

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.sourceDocumentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.lines.some((l) => l.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || l.sku.toLowerCase().includes(searchTerm.toLowerCase()));

    if (activeTab === 'receipts') return matchesSearch && tx.type === 'GOODS_RECEIPT';
    if (activeTab === 'issues') return matchesSearch && tx.type === 'GOODS_ISSUE';
    if (activeTab === 'transfers') return matchesSearch && tx.type === 'STOCK_TRANSFER';
    if (activeTab === 'adjustments') return matchesSearch && tx.type === 'STOCK_ADJUSTMENT';
    if (activeTab === 'opening') return matchesSearch && tx.type === 'OPENING_STOCK';
    return matchesSearch;
  });

  const handlePostTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = items.find((i) => i.sku === selectedSku) || items[0];
    const srcWh = warehouses.find((w) => w.id === sourceWarehouseId);
    const tgtWh = warehouses.find((w) => w.id === targetWarehouseId);

    const line: StockTransactionLine = {
      id: `line-${Date.now()}`,
      itemId: item.id,
      sku: item.sku,
      itemName: item.name,
      quantity: lineQty,
      uom: item.baseUom,
      unitCostOMR: lineCost,
      totalCostOMR: lineQty * lineCost,
      fromWarehouseId: txType === 'GOODS_RECEIPT' || txType === 'OPENING_STOCK' ? undefined : sourceWarehouseId,
      toWarehouseId: txType === 'GOODS_ISSUE' ? undefined : targetWarehouseId,
      batchNumber: lineBatch || undefined
    };

    createTransaction({
      type: txType,
      transactionDate: new Date().toISOString().split('T')[0],
      postingDate: new Date().toISOString().split('T')[0],
      fromWarehouseId: txType === 'GOODS_RECEIPT' || txType === 'OPENING_STOCK' ? undefined : sourceWarehouseId,
      fromWarehouseName: txType === 'GOODS_RECEIPT' || txType === 'OPENING_STOCK' ? undefined : srcWh?.name,
      toWarehouseId: txType === 'GOODS_ISSUE' ? undefined : targetWarehouseId,
      toWarehouseName: txType === 'GOODS_ISSUE' ? undefined : tgtWh?.name,
      reasonCode: reasonCode,
      status: 'APPROVED',
      lines: [line],
      totalQuantity: lineQty,
      totalValueOMR: line.totalCostOMR,
      createdBy: 'Said Al-Rawahi',
      notes: notes || `Stock voucher processed via ERP`
    });

    setIsPostModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-800/40">
              07.03
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Stock Transactions & Material Movements</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Goods receipts, issues, inter-warehouse transfers, opening stock, and audited adjustments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'all' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              All Movements ({transactions.length})
            </button>
            <button
              onClick={() => setActiveTab('receipts')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'receipts' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Receipts
            </button>
            <button
              onClick={() => setActiveTab('issues')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'issues' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Issues
            </button>
            <button
              onClick={() => setActiveTab('transfers')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'transfers' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Transfers
            </button>
            <button
              onClick={() => setActiveTab('adjustments')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'adjustments' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Adjustments
            </button>
            <button
              onClick={() => setActiveTab('opening')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'opening' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Opening
            </button>
          </div>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="px-3.5 py-2 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Movement</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-600 dark:text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Voucher #, PO/SO reference, SKU, or item description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <span className="text-xs text-slate-600 dark:text-slate-400">{filteredTransactions.length} vouchers recorded</span>
      </div>

      {/* Transactions Data Table */}
      <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Voucher No & Date</th>
                <th className="py-3 px-3">Movement Type</th>
                <th className="py-3 px-3">Source Facility</th>
                <th className="py-3 px-3">Destination Facility</th>
                <th className="py-3 px-3">Reason & Ref</th>
                <th className="py-3 px-3 text-right">Total Items</th>
                <th className="py-3 px-3 text-right">Voucher Value</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
              {filteredTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  onClick={() => setSelectedTxForDetail(tx)}
                  className="hover:bg-slate-100/70 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-emerald-600 dark:text-emerald-400">
                        {tx.type === 'GOODS_RECEIPT' && <ArrowDownLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                        {tx.type === 'GOODS_ISSUE' && <ArrowUpRight className="w-4 h-4 text-amber-700 dark:text-amber-400" />}
                        {tx.type === 'STOCK_TRANSFER' && <Truck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
                        {tx.type === 'STOCK_ADJUSTMENT' && <Repeat className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                        {tx.type === 'OPENING_STOCK' && <Package className="w-4 h-4 text-sky-600 dark:text-sky-400" />}
                      </div>
                      <div>
                        <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">{tx.transactionNumber}</span>
                        <div className="text-[10px] text-slate-600 dark:text-slate-400 font-mono">{tx.transactionDate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                      {tx.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      {tx.fromWarehouseName || '— (External Supplier)'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      {tx.toWarehouseName || '— (Job / Customer)'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-xs text-slate-700 dark:text-slate-300 block">{(tx.reasonCode ?? 'N/A').replace(/_/g, ' ')}</span>
                    {tx.sourceDocumentNumber && (
                      <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">Ref: {tx.sourceDocumentNumber}</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {tx.lines.reduce((acc, l) => acc + l.quantity, 0)} Units
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    OMR {tx.totalValueOMR.toFixed(2)}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                        tx.status === 'POSTED'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-800/40'
                          : tx.status === 'APPROVED'
                          ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-800/40'
                          : tx.status === 'PENDING_APPROVAL'
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-800/40'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-800/40'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1">
                      {tx.status === 'DRAFT' && (
                        <button
                          onClick={() => approveTransaction(tx.id, 'Said Al-Rawahi')}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-700 hover:bg-emerald-600 text-white"
                        >
                          Approve
                        </button>
                      )}
                      {tx.status === 'APPROVED' && (
                        <button
                          onClick={() => postTransaction(tx.id)}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-cyan-700 hover:bg-cyan-600 text-white"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedTxForDetail(tx)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* POST MOVEMENT MODAL */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Repeat className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Post Stock Movement Voucher</h3>
              </div>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostTransactionSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Transaction Type</label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as StockTransactionType)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="GOODS_RECEIPT">Goods Receipt (GRN)</option>
                    <option value="GOODS_ISSUE">Goods Issue (GIN / Job Order)</option>
                    <option value="STOCK_TRANSFER">Inter-Warehouse Transfer (2-Step)</option>
                    <option value="STOCK_ADJUSTMENT">Stock Adjustment (Audit Variance)</option>
                    <option value="OPENING_STOCK">Opening Stock Migration</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Reason Code</label>
                  <select
                    value={reasonCode}
                    onChange={(e) => setReasonCode(e.target.value as StockMovementReason)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="PURCHASE_RECEIPT">Purchase Receipt (Vendor PO)</option>
                    <option value="PRODUCTION_ISSUE">Production / Fabrication Issue</option>
                    <option value="PROJECT_DISPATCH">EPC Project Site Dispatch</option>
                    <option value="INTER_WAREHOUSE_TRANSFER">Inter-Hub Stock Transfer</option>
                    <option value="CYCLE_COUNT_VARIANCE">Cycle Count Audit Variance</option>
                    <option value="DAMAGE_WRITE_OFF">Damage / Defect Write-Off</option>
                    <option value="SCRAP">Scrap / Decommissioned</option>
                  </select>
                </div>
              </div>

              {/* Warehouse Routing */}
              <div className="grid grid-cols-2 gap-3">
                {txType !== 'GOODS_RECEIPT' && txType !== 'OPENING_STOCK' && (
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Source Facility (Issuing)</label>
                    <select
                      value={sourceWarehouseId}
                      onChange={(e) => setSourceWarehouseId(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                    >
                      {warehouses.map((w) => (
                        <option key={w.id} value={w.id}>{w.code} — {w.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                {txType !== 'GOODS_ISSUE' && (
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Destination Facility (Receiving)</label>
                    <select
                      value={targetWarehouseId}
                      onChange={(e) => setTargetWarehouseId(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                    >
                      {warehouses.map((w) => (
                        <option key={w.id} value={w.id}>{w.code} — {w.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Line Item Entry */}
              <div className="p-4 bg-slate-100/70 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl space-y-3">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">Item Movement Line Details</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1">Select Item / SKU</label>
                    <select
                      value={selectedSku}
                      onChange={(e) => {
                        setSelectedSku(e.target.value);
                        const sel = items.find((i) => i.sku === e.target.value);
                        if (sel) setLineCost(sel.unitCostOMR);
                      }}
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                    >
                      {items.map((i) => (
                        <option key={i.id} value={i.sku}>{i.sku} — {i.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1">Batch / Lot Number</label>
                    <input
                      type="text"
                      placeholder="e.g. LOT-2026-N201"
                      value={lineBatch}
                      onChange={(e) => setLineBatch(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1">Quantity</label>
                    <input
                      type="number"
                      required
                      value={lineQty}
                      onChange={(e) => setLineQty(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1">Unit Cost (OMR)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={lineCost}
                      onChange={(e) => setLineCost(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div className="text-right pt-2 border-t border-slate-300 dark:border-slate-700 text-xs font-mono">
                  <span className="text-slate-600 dark:text-slate-400">Total Line Valuation: </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">OMR {(lineQty * lineCost).toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Remarks / Justification Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                  placeholder="Material dispatch notes, truck license number, reference..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Confirm & Post Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedTxForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{selectedTxForDetail.transactionNumber}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedTxForDetail.type.replace('_', ' ')}</h3>
              </div>
              <button
                onClick={() => setSelectedTxForDetail(null)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-100/60 dark:bg-slate-800/60 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400 block">Source Facility</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedTxForDetail.fromWarehouseName || 'External Vendor / Migration'}</span>
              </div>
              <div className="p-3 bg-slate-100/60 dark:bg-slate-800/60 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400 block">Target Facility</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedTxForDetail.toWarehouseName || 'Project Job Order / Client'}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-semibold text-slate-700 dark:text-slate-300">Voucher Line Items</h4>
              <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                {selectedTxForDetail.lines.map((l, i) => (
                  <div key={i} className="p-3 bg-slate-100/70 dark:bg-slate-800/40 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">{l.sku}</span>
                      <div className="text-slate-900 dark:text-white font-medium">{l.itemName}</div>
                      {l.batchNumber && <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400">Batch: {l.batchNumber}</span>}
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-slate-900 dark:text-white">{l.quantity} {l.uom}</div>
                      <div className="text-emerald-600 dark:text-emerald-400">OMR {l.totalCostOMR.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedTxForDetail(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium"
              >
                Close Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 08: MANUFACTURING
// 08.05 — Production Output, Receipts & Scrap Management View
// ==========================================

import React, { useState } from 'react';
import { useManufacturingStore } from '../../services/manufacturingStore';
import { ScrapReasonCode, DefectSeverity } from '../../types';
import { ERPRouteState } from '../../../../types/erp';
import {
  PackageCheck,
  RotateCcw,
  AlertTriangle,
  FileCheck,
  Plus,
  Search,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  Layers,
  ArrowUpRight,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { mockRandom } from '@/src/utils/mockRandom';

interface ProductionOutputViewProps {
  initialTab?: 'receipts' | 'byproducts' | 'scrap' | 'closeout';
  onNavigate: (route: ERPRouteState) => void;
}

export const ProductionOutputView: React.FC<ProductionOutputViewProps> = ({
  initialTab = 'receipts',
  onNavigate
}) => {
  const {
    productionReceipts,
    scrapRecords,
    workOrders,
    recordProductionReceipt,
    logScrapDefect
  } = useManufacturingStore();

  const [activeTab, setActiveTab] = useState<'receipts' | 'byproducts' | 'scrap' | 'closeout'>(initialTab);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showScrapModal, setShowScrapModal] = useState(false);

  // New Receipt state
  const [receiptWorkOrderId, setReceiptWorkOrderId] = useState(workOrders[0]?.id || '');
  const [receiptQty, setReceiptQty] = useState(1);
  const [targetWarehouse, setTargetWarehouse] = useState('WH-FINISHED-GOODS-SOHAR');
  const [inspector, setInspector] = useState('Salim Al-Ghafri (QC Level III)');

  // New Scrap state
  const [scrapWorkOrderId, setScrapWorkOrderId] = useState(workOrders[0]?.id || '');
  const [scrapQty, setScrapQty] = useState(1);
  const [scrapReason, setScrapReason] = useState<ScrapReasonCode>('MACHINING_TOLERANCE_ERROR');
  const [scrapSeverity, setScrapSeverity] = useState<DefectSeverity>('MAJOR');
  const [defectDesc, setDefectDesc] = useState('');
  const [fiveWhys, setFiveWhys] = useState('');

  const selectedWo = workOrders.find((w) => w.id === receiptWorkOrderId) || workOrders[0];

  const handlePostReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWo) return;

    const today = new Date().toISOString().split('T')[0];
    const unitCost = selectedWo.totalStandardCostOMR / selectedWo.plannedQuantity;
    recordProductionReceipt({
      workOrderId: selectedWo.id,
      workOrderNumber: selectedWo.orderNumber,
      productSku: selectedWo.productSku,
      productName: selectedWo.productName,
      receivedQuantity: Number(receiptQty),
      uom: selectedWo.uom,
      lotBatchNumber: selectedWo.targetLotNumber,
      manufactureDate: today,
      targetWarehouse,
      targetBinLocation: 'BIN-FG-01',
      inspectedBy: inspector,
      qcReleaseStatus: 'RELEASED_PRIME',
      unitCostOMR: unitCost,
      totalInventoryValuationOMR: unitCost * Number(receiptQty),
      receivedDate: today,
      createdByName: inspector
    });

    setShowReceiptModal(false);
  };

  const handlePostScrap = (e: React.FormEvent) => {
    e.preventDefault();
    const wo = workOrders.find((w) => w.id === scrapWorkOrderId) || workOrders[0];
    if (!wo) return;

    logScrapDefect({
      workOrderId: wo.id,
      workOrderNumber: wo.orderNumber,
      productSku: wo.productSku,
      productName: wo.productName,
      operationStep: 1,
      operationName: 'Machining',
      workCenterName: 'Heavy CNC Milling Bay 1',
      scrappedQuantity: Number(scrapQty),
      uom: wo.uom,
      reasonCode: scrapReason,
      defectDescription: defectDesc || 'Out of dimension tolerance on internal bore',
      rootCauseAnalysis: fiveWhys || 'Tooling edge chipped during high-speed pass',
      estimatedScrapValueLossOMR: Number(scrapQty) * 120.0,
      correctiveActionTaken: 'Replaced carbide inserts and re-calibrated spindle offsets',
      recordedBy: 'Mahmoud Al-Zadjali',
      recordedDate: new Date().toISOString().split('T')[0],
      disposition: 'SCRAP_RECYCLE'
    });

    setShowScrapModal(false);
    setDefectDesc('');
    setFiveWhys('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-orange-500/10 text-orange-700 dark:text-orange-400">
            <PackageCheck className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">08.05 — Production Output, Finished Goods Receipts & Scrap</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              QC release gatekeeping, finished goods inventory capitalization, by-product recovery, and 5-Whys scrap defect logs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowReceiptModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <PackageCheck className="w-4 h-4" />
            Receive Finished Goods
          </button>
          <button
            onClick={() => setShowScrapModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <AlertTriangle className="w-4 h-4" />
            Log Scrap Defect
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('receipts')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'receipts'
              ? 'border-orange-500 text-orange-700 dark:text-orange-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          Production Receipts ({productionReceipts.length})
        </button>
        <button
          onClick={() => setActiveTab('byproducts')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'byproducts'
              ? 'border-orange-500 text-orange-700 dark:text-orange-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          By-Product & Scrap Metal Recovery
        </button>
        <button
          onClick={() => setActiveTab('scrap')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'scrap'
              ? 'border-orange-500 text-orange-700 dark:text-orange-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Scrap Records & 5-Whys Root Cause ({scrapRecords.length})
        </button>
        <button
          onClick={() => setActiveTab('closeout')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'closeout'
              ? 'border-orange-500 text-orange-700 dark:text-orange-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Production Order Financial Closeout
        </button>
      </div>

      {/* TAB 1: Production Receipts */}
      {activeTab === 'receipts' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Finished Goods Production Receipts & QC Clearances</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Official stock capitalization entries transferring completed units from WIP into warehouse valuation.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Receipt Code / Date</th>
                  <th className="p-3">Work Order #</th>
                  <th className="p-3">Product Name / Lot #</th>
                  <th className="p-3 text-center">Received Qty</th>
                  <th className="p-3 text-right">Unit Valuation</th>
                  <th className="p-3 text-right">Total Inventory Value</th>
                  <th className="p-3 text-center">QC Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {productionReceipts.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <div className="font-mono font-bold text-orange-700 dark:text-orange-400">{rec.receiptNumber}</div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{rec.receivedDate}</span>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">{rec.workOrderNumber}</td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{rec.productName}</div>
                      <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">Lot: {rec.lotBatchNumber}</span>
                    </td>
                    <td className="p-3 text-center font-bold text-slate-900 dark:text-white text-sm">
                      {rec.receivedQuantity} {rec.uom}
                    </td>
                    <td className="p-3 text-right font-mono text-slate-700 dark:text-slate-300">
                      OMR {rec.unitCostOMR.toFixed(2)}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      OMR {rec.totalInventoryValuationOMR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                        {rec.qcReleaseStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: By-Products & Scrap Metal */}
      {activeTab === 'byproducts' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recoverable Metal Turnings, Offcuts & Swarf Inventory</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Secondary materials reclaimed from machining and fabrication bays credited against BOM overhead costs.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-orange-700 dark:text-orange-400">SWARF-SS316-01</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  RECYCLER CONTRACT ACTIVE
                </span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Stainless Steel 316L Machining Turnings</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Recovered from CNC Machining Bay 1. Stored in designated 200L sealed recycling drums.
              </p>
              <div className="flex justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">On-Hand Stock: <strong className="text-slate-900 dark:text-white">450 KG</strong></span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Valuation Credit: OMR 360.00</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-orange-700 dark:text-orange-400">OFC-A516-PLATE</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold">
                  INTERNAL RE-USE
                </span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">ASTM SA516 Gr 70N Plate Cut-Offs</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Heavy boiler plate segments larger than 400×400mm reclaimed for weld test coupons and support gussets.
              </p>
              <div className="flex justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">On-Hand Stock: <strong className="text-slate-900 dark:text-white">1,200 KG</strong></span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Valuation Credit: OMR 720.00</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Scrap & 5-Whys */}
      {activeTab === 'scrap' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Scrap Incident Records & Root Cause Analysis</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Documented manufacturing non-conformances with corrective and preventive actions (CAPA).
              </p>
            </div>
            <button
              onClick={() => setShowScrapModal(true)}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Log Defect
            </button>
          </div>

          <div className="space-y-3">
            {scrapRecords.map((sc) => (
              <div
                key={sc.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-rose-900/30 space-y-3 hover:border-rose-700/50 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">{sc.scrapVoucherNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300 text-[10px] font-bold">
                      {sc.disposition.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{sc.productName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-rose-600 dark:text-rose-400 font-bold font-mono">
                      -OMR {sc.estimatedScrapValueLossOMR.toFixed(2)} Loss
                    </span>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{sc.recordedDate}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-white/60 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Defect Summary:</span>
                    <p className="text-slate-800 dark:text-slate-200 mt-0.5">{sc.defectDescription}</p>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Reason: <strong className="text-slate-700 dark:text-slate-300">{sc.reasonCode.replace(/_/g, ' ')}</strong> • Work Center:{' '}
                      <span className="text-slate-700 dark:text-slate-300">{sc.workCenterName}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-600 dark:text-slate-400 font-medium">CAPA / Root Cause (5-Whys):</span>
                    <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mt-0.5 space-y-0.5">
                      {sc.rootCauseAnalysis.split(/\n|; /).map((why, i) => (
                        <li key={i}>{why}</li>
                      ))}
                    </ul>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                      Action Taken: {sc.correctiveActionTaken}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Production Order Financial Closeout */}
      {activeTab === 'closeout' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Work Order Financial Closeout & WIP Settlement</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Final reconciliation comparing accumulated actual material/labor/machine charges against standard costing formulas.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-orange-700 dark:text-orange-400 text-sm">WO-2026-0081 Financial Summary</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                READY FOR CLOSEOUT
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center text-xs">
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400 text-[10px]">Standard Target Cost</span>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">OMR 19,840.00</div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400 text-[10px]">Actual Accumulated WIP</span>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">OMR 19,360.00</div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400 text-[10px]">Cost Variance</span>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">OMR 480.00 (Favorable)</div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400 text-[10px]">Closeout Status</span>
                <div className="text-sm font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">Pending GL Post</div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm">
                Settle & Close Work Order in GL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Record Production Receipt */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Receive Completed Finished Goods into Inventory</h3>
            <form onSubmit={handlePostReceipt} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Source Work Order *</label>
                <select
                  value={receiptWorkOrderId}
                  onChange={(e) => setReceiptWorkOrderId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                >
                  {workOrders.map((wo) => (
                    <option key={wo.id} value={wo.id}>
                      {wo.orderNumber} — {wo.productName} ({wo.completedQuantity}/{wo.plannedQuantity} {wo.uom})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Received Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={receiptQty}
                    onChange={(e) => setReceiptQty(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Target Warehouse</label>
                  <input
                    type="text"
                    value={targetWarehouse}
                    onChange={(e) => setTargetWarehouse(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Lead QC Inspector</label>
                <input
                  type="text"
                  value={inspector}
                  onChange={(e) => setInspector(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowReceiptModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg"
                >
                  Post Inventory Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Scrap */}
      {showScrapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Log Manufacturing Defect & Scrap</h3>
            <form onSubmit={handlePostScrap} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Work Order *</label>
                <select
                  value={scrapWorkOrderId}
                  onChange={(e) => setScrapWorkOrderId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                >
                  {workOrders.map((wo) => (
                    <option key={wo.id} value={wo.id}>
                      {wo.orderNumber} — {wo.productName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Scrap Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={scrapQty}
                    onChange={(e) => setScrapQty(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Reason Code</label>
                  <select
                    value={scrapReason}
                    onChange={(e) => setScrapReason(e.target.value as ScrapReasonCode)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="MACHINING_TOLERANCE_ERROR">Machining Out of Tolerance</option>
                    <option value="EQUIPMENT_MALFUNCTION">Welding Porosity Defect</option>
                    <option value="THERMAL_DISTORTION">Heat Treatment Crack</option>
                    <option value="RAW_MATERIAL_FLAW">Raw Material Inclusion</option>
                    <option value="OPERATOR_ERROR">Operator Setup Error</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Defect Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wall thickness under minimum ASME requirement after CNC bore"
                  value={defectDesc}
                  onChange={(e) => setDefectDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">5-Whys Root Cause Statement</label>
                <textarea
                  rows={2}
                  placeholder="Why did this occur and what is the underlying root cause?"
                  value={fiveWhys}
                  onChange={(e) => setFiveWhys(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowScrapModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg"
                >
                  Record Scrap Defect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

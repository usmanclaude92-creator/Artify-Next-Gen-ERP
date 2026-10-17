// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 08: MANUFACTURING
// 08.03 — Production Orders, Material Issue & Returns View
// ==========================================

import React, { useState } from 'react';
import { useManufacturingStore } from '../../services/manufacturingStore';
import { WorkOrder, WorkOrderStatus, WorkOrderPriority } from '../../types';
import { ERPRouteState } from '../../../../types/erp';
import {
  ClipboardList,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Package,
  Layers,
  FileText,
  Printer,
  ShieldCheck,
  Wrench,
  Clock,
  CheckSquare
} from 'lucide-react';
import { mockRandom } from '@/src/utils/mockRandom';

interface ProductionOrdersViewProps {
  initialTab?: 'orders' | 'traveler' | 'issue' | 'return';
  onNavigate: (route: ERPRouteState) => void;
}

export const ProductionOrdersView: React.FC<ProductionOrdersViewProps> = ({
  initialTab = 'orders',
  onNavigate
}) => {
  const {
    workOrders,
    boms,
    createWorkOrder,
    updateWorkOrderStatus,
    updateWorkOrderOperation,
    issueMaterialsToWorkOrder,
    returnMaterialsFromWorkOrder
  } = useManufacturingStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'traveler' | 'issue' | 'return'>(initialTab);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(workOrders[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);

  // New Work Order form state
  const [selectedBomId, setSelectedBomId] = useState(boms[0]?.id || '');
  const [plannedQty, setPlannedQty] = useState(10);
  const [orderPriority, setOrderPriority] = useState<WorkOrderPriority>('HIGH');
  const [customerName, setCustomerName] = useState('Petroleum Development Oman (PDO LLC)');
  const [sourceRef, setSourceRef] = useState('SO-2026-0975');
  const [supervisor, setSupervisor] = useState('Khamis Al-Harthy');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
  );

  const selectedOrder = workOrders.find((w) => w.id === selectedOrderId) || workOrders[0];

  const filteredOrders = workOrders.filter((w) => {
    const matchesSearch =
      w.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.customerName && w.customerName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const bom = boms.find((b) => b.id === selectedBomId) || boms[0];
    if (!bom) return;

    const newOrder = createWorkOrder({
      productSku: bom.productSku,
      productName: bom.productName,
      bomId: bom.id,
      bomVersion: bom.version,
      plannedQuantity: Number(plannedQty),
      uom: bom.baseUom,
      priority: orderPriority,
      status: 'RELEASED',
      sourceType: 'SALES_ORDER',
      sourceReference: sourceRef,
      customerName,
      productionPlant: 'Sohar Industrial Plant — Line A',
      supervisor,
      scheduledStartDate: startDate,
      scheduledEndDate: endDate,
      targetLotNumber: `LOT-2026-${bom.productSku.slice(-6)}-${Math.floor(mockRandom() * 900) + 100}`,
      totalStandardCostOMR: bom.totalStandardCostOMR * Number(plannedQty),
      materialRequirements: bom.components.map((c) => ({
        id: `mr-${Date.now()}-${c.itemCode}`,
        itemCode: c.itemCode,
        itemName: c.itemName,
        uom: c.uom,
        requiredQty: c.quantityPerUnit * Number(plannedQty),
        allocatedQty: c.quantityPerUnit * Number(plannedQty),
        issuedQty: 0,
        returnedQty: 0,
        consumedQty: 0,
        unitCostOMR: c.unitCostOMR,
        totalIssuedValueOMR: 0,
        warehouseId: 'wh-sohar',
        isFullyIssued: false
      })),
      operations: bom.routingSteps.map((s) => ({
        stepNumber: s.stepNumber,
        operationName: s.operationName,
        workCenterName: s.workCenterName,
        status: 'PENDING',
        plannedHours: (s.runTimeMinutesPerUnit * Number(plannedQty)) / 60,
        actualHours: 0,
        completedQuantity: 0,
        scrapQuantity: 0
      }))
    });

    setSelectedOrderId(newOrder.id);
    setShowCreateModal(false);
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    issueMaterialsToWorkOrder({
      workOrderId: selectedOrder.id,
      workOrderNumber: selectedOrder.orderNumber,
      productName: selectedOrder.productName,
      issueDate: new Date().toISOString().split('T')[0],
      issueType: 'PICK_AND_ISSUE',
      fromWarehouse: 'Sohar Central Stores (WH-SOHAR)',
      toWorkCenter: 'Sohar Assembly Line A',
      issuedBy: 'Said Al-Rawahi (Storekeeper)',
      authorizedBy: 'Khamis Al-Harthy (Production Lead)',
      items: selectedOrder.materialRequirements.map((m) => ({
        itemCode: m.itemCode,
        itemName: m.itemName,
        uom: m.uom,
        requestedQty: m.requiredQty - m.issuedQty,
        issuedQty: m.requiredQty - m.issuedQty,
        unitCostOMR: m.unitCostOMR,
        totalCostOMR: (m.requiredQty - m.issuedQty) * m.unitCostOMR,
        batchNumber: `BATCH-RAW-${Math.floor(mockRandom() * 8000) + 1000}`,
        binLocation: 'BIN-SOHAR-A01'
      })),
      totalValueOMR: selectedOrder.materialRequirements.reduce(
        (sum, m) => sum + (m.requiredQty - m.issuedQty) * m.unitCostOMR,
        0
      ),
      status: 'POSTED'
    });

    setShowIssueModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
            <ClipboardList className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-white">08.03 — Production Orders & Material Staging</h2>
            <p className="text-xs text-slate-400">
              Discrete work order lifecycle, shop floor traveler routing, material pick & issue vouchers, and returns.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Work Order
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          Work Orders Queue ({workOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('traveler')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'traveler'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Shop Floor Traveler Card
        </button>
        <button
          onClick={() => setActiveTab('issue')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'issue'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          Material Issue Vouchers (WIP Loading)
        </button>
        <button
          onClick={() => setActiveTab('return')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'return'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          Material Returns (Unconsumed Stock)
        </button>
      </div>

      {/* TAB 1: Work Orders List & Operations */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Master List */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search order #, customer, product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="RELEASED">Released</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div className="space-y-2">
              {filteredOrders.map((wo) => (
                <div
                  key={wo.id}
                  onClick={() => setSelectedOrderId(wo.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedOrder?.id === wo.id
                      ? 'bg-orange-500/10 border-orange-500/40 text-white'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-orange-400">{wo.orderNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        wo.status === 'IN_PROGRESS'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : wo.status === 'RELEASED'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {wo.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white mt-1 line-clamp-1">{wo.productName}</h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span>
                      {wo.completedQuantity} / {wo.plannedQuantity} {wo.uom}
                    </span>
                    <span className="font-bold text-slate-300">{wo.customerName || 'Stock Build'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Detail Execution Card */}
          <div className="lg:col-span-2 space-y-4">
            {selectedOrder && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-orange-400 text-sm">{selectedOrder.orderNumber}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {selectedOrder.priority}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">{selectedOrder.productName}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Customer: <strong className="text-slate-200">{selectedOrder.customerName || 'Stock Build'}</strong> • Lot:{' '}
                      <span className="font-mono text-slate-300">{selectedOrder.targetLotNumber}</span> • Ref:{' '}
                      <span className="text-slate-300">{selectedOrder.sourceReference}</span>
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {selectedOrder.status === 'RELEASED' && (
                      <button
                        onClick={() => updateWorkOrderStatus(selectedOrder.id, 'IN_PROGRESS')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5" /> Start Production
                      </button>
                    )}
                    {selectedOrder.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => updateWorkOrderStatus(selectedOrder.id, 'COMPLETED')}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
                      >
                        <CheckSquare className="w-3.5 h-3.5" /> Complete Order
                      </button>
                    )}
                    <button
                      onClick={() => setShowIssueModal(true)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5"
                    >
                      <Layers className="w-3.5 h-3.5" /> Issue Materials
                    </button>
                  </div>
                </div>

                {/* Operations Traveler Sequence */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Routing Operations Dispatch & Sign-Off
                  </h4>

                  <div className="space-y-2">
                    {selectedOrder.operations.map((op) => (
                      <div
                        key={op.stepNumber}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                              op.status === 'COMPLETED'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : op.status === 'IN_PROGRESS' || op.status === 'RUNNING'
                                ? 'bg-orange-500/20 text-orange-300 animate-pulse'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {op.stepNumber}
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-white">{op.operationName}</h5>
                            <p className="text-[11px] text-slate-400">
                              Work Center: <strong className="text-slate-300">{op.workCenterName}</strong> • Operator:{' '}
                              <span className="text-slate-300">{op.operatorName || 'Unassigned'}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <div className="text-right text-xs">
                            <div className="font-bold text-white">
                              {op.completedQuantity} / {selectedOrder.plannedQuantity} {selectedOrder.uom}
                            </div>
                            <span className="text-[10px] text-slate-500">{op.actualHours} hrs logged</span>
                          </div>

                          {op.status !== 'COMPLETED' && (
                            <button
                              onClick={() =>
                                updateWorkOrderOperation(selectedOrder.id, op.stepNumber, {
                                  status: 'COMPLETED',
                                  completedQuantity: selectedOrder.plannedQuantity,
                                  actualHours: op.plannedHours
                                })
                              }
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white text-[11px] font-semibold transition-all"
                            >
                              Sign Off
                            </button>
                          )}
                          {op.status === 'COMPLETED' && (
                            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
                              <CheckCircle2 className="w-5 h-5" />
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Material Staging Checklist */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Raw Material Issue Status ({selectedOrder.materialRequirements.length} Items)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedOrder.materialRequirements.map((mat) => (
                      <div
                        key={mat.id}
                        className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-white">{mat.itemName}</div>
                          <span className="text-[10px] text-slate-500 font-mono">{mat.itemCode}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-200">
                            {mat.issuedQty} / {mat.requiredQty} {mat.uom}
                          </div>
                          <span
                            className={`text-[9px] font-bold uppercase ${
                              mat.isFullyIssued ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                          >
                            {mat.isFullyIssued ? 'Issued to WIP' : 'Pending Staging'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Shop Floor Traveler Card */}
      {activeTab === 'traveler' && selectedOrder && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-orange-500/10 text-orange-400 font-mono text-xs font-bold rounded">
                  OFFICIAL SHOP FLOOR TRAVELER
                </span>
                <span className="text-xs text-slate-400">PDO Qualified Plant Spec</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">{selectedOrder.orderNumber}</h3>
              <p className="text-xs text-slate-400">
                Product: <strong className="text-slate-200">{selectedOrder.productName}</strong>
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-lg border border-slate-700 flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Traveler Badge
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500">Planned Batch:</span>
              <div className="font-bold text-white mt-0.5">{selectedOrder.plannedQuantity} {selectedOrder.uom}</div>
            </div>
            <div>
              <span className="text-slate-500">Target Batch / Lot:</span>
              <div className="font-mono font-bold text-orange-400 mt-0.5">{selectedOrder.targetLotNumber}</div>
            </div>
            <div>
              <span className="text-slate-500">Supervisor:</span>
              <div className="font-bold text-slate-200 mt-0.5">{selectedOrder.supervisor}</div>
            </div>
          </div>

          {/* Sequential Checkpoints */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Mandatory Quality Hold-Points & Operator Verification
            </h4>
            <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
              {selectedOrder.operations.map((op) => (
                <div key={op.stepNumber} className="p-3 bg-slate-950/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-orange-400">Op {op.stepNumber}</span>
                    <span className="font-semibold text-white">{op.operationName}</span>
                    <span className="text-slate-400 text-[11px]">({op.workCenterName})</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-slate-400">{op.plannedHours} planned hrs</span>
                    <div className="w-32 border-b border-dashed border-slate-600 text-center text-[10px] text-slate-500">
                      Operator Signature
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Material Issue */}
      {activeTab === 'issue' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Material Issue Vouchers (Warehouse to WIP)</h3>
              <p className="text-xs text-slate-400">
                Log inventory deductions from raw materials storage into active shop floor WIP ledgers.
              </p>
            </div>
            <button
              onClick={() => setShowIssueModal(true)}
              className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Issue Materials
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="font-mono font-bold text-orange-400">MIV-2026-0041</span>
              <span className="text-emerald-400 font-bold">POSTED TO WIP</span>
            </div>
            <p className="text-slate-300 font-semibold">
              WO-2026-0081: 20 pcs ASTM A105 Forgings + Inconel Seats issued to Sohar Line A.
            </p>
            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>Issued By: Said Al-Rawahi</span>
              <span>Total Value: OMR 19,700.00</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Material Return */}
      {activeTab === 'return' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Material Return Vouchers (WIP to Warehouse)</h3>
              <p className="text-xs text-slate-400">
                Credit unconsumed materials, offcuts, or rejected lots back to inventory stores.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="font-mono font-bold text-orange-400">MRV-2026-0012</span>
              <span className="text-emerald-400 font-bold">POSTED INVENTORY CREDIT</span>
            </div>
            <p className="text-slate-300 font-semibold">
              WO-2026-0083: 2 sets Viton Hydraulic Seals returned from Cleanroom Assembly.
            </p>
            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>Returned By: Eng. Said Al-Hajri</span>
              <span>Credit Value: OMR 70.00</span>
            </div>
          </div>
        </div>
      )}

      {/* Create Work Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Release New Production Work Order</h3>
            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Target Product Bill of Materials (BOM) *</label>
                <select
                  value={selectedBomId}
                  onChange={(e) => setSelectedBomId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                >
                  {boms.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.bomCode} — {b.productName} ({b.version})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Planned Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={plannedQty}
                    onChange={(e) => setPlannedQty(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Order Priority</label>
                  <select
                    value={orderPriority}
                    onChange={(e) => setOrderPriority(e.target.value as WorkOrderPriority)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="LOW">Low</option>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High Priority</option>
                    <option value="EMERGENCY_RUSH">Emergency Rush</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Sales Ref / PO #</label>
                  <input
                    type="text"
                    value={sourceRef}
                    onChange={(e) => setSourceRef(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Scheduled Start</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Scheduled Finish</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg"
                >
                  Release Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Material Issue Modal */}
      {showIssueModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Generate Material Issue Voucher</h3>
            <p className="text-xs text-slate-400">
              Dispatch raw materials from warehouse inventory to Work-In-Progress for {selectedOrder.orderNumber}.
            </p>
            <form onSubmit={handleIssueSubmit} className="space-y-3 text-xs">
              <div className="max-h-60 overflow-y-auto space-y-2 border border-slate-800 rounded-lg p-2.5 bg-slate-950">
                {selectedOrder.materialRequirements.map((mat) => (
                  <div key={mat.id} className="flex justify-between items-center text-xs p-1.5 border-b border-slate-800/60">
                    <div>
                      <div className="font-semibold text-white">{mat.itemName}</div>
                      <span className="text-[10px] text-slate-500">{mat.itemCode}</span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">
                      {mat.requiredQty - mat.issuedQty} {mat.uom} to issue
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg"
                >
                  Post Issue Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

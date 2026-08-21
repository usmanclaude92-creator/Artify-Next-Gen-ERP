import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  AlertTriangle,
  FileText,
  Building2,
  Package,
  Layers,
  ArrowRight,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { useSalesCrm } from '../../services/salesCrmStore';
import { SalesOrder, SalesOrderStatus, FulfillmentStatus } from '../../types';
import { ERPUserRole } from '../../../../types/erp';

interface SalesOrdersViewProps {
  activeTransactionId?: string;
  onNavigate?: (route: any) => void;
  activeRole: ERPUserRole;
}

export const SalesOrdersView: React.FC<SalesOrdersViewProps> = ({
  activeTransactionId,
  onNavigate,
  activeRole
}) => {
  const { salesOrders, updateSalesOrderStatus, createDeliveryNoteFromOrder } = useSalesCrm();

  const [activeTab, setActiveTab] = useState<'all' | 'booking' | 'approvals' | 'fulfillment' | 'tracking'>(
    activeTransactionId === 'tx-order-booking'
      ? 'booking'
      : activeTransactionId === 'tx-order-approvals'
      ? 'approvals'
      : activeTransactionId === 'tx-order-fulfillment'
      ? 'fulfillment'
      : activeTransactionId === 'tx-order-tracking'
      ? 'tracking'
      : 'all'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(salesOrders[0] || null);

  const [dispatchAlertMsg, setDispatchAlertMsg] = useState<string | null>(null);

  const filteredOrders = salesOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPoNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || order.status === selectedStatus;
    const matchesTab =
      activeTab === 'all' ||
      activeTab === 'booking' ||
      (activeTab === 'approvals' && (order.status === 'Draft' || order.status === 'Confirmed')) ||
      (activeTab === 'fulfillment' && (order.fulfillmentStatus === 'Allocated in Warehouse' || order.fulfillmentStatus === 'Picking & Staging')) ||
      activeTab === 'tracking';
    return matchesSearch && matchesStatus && matchesTab;
  });

  const handleDispatchOrder = (order: SalesOrder) => {
    try {
      const dn = createDeliveryNoteFromOrder(order.id);
      setDispatchAlertMsg(
        `Delivery Note ${dn.deliveryNoteNumber} generated successfully! Dispatched via carrier "${dn.carrierName}" (Waybill: ${dn.waybillNumber}). Status updated to Dispatched.`
      );
      setTimeout(() => setDispatchAlertMsg(null), 7000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 text-xs font-semibold">
                Functional Area 06.06
              </span>
              <span className="text-xs text-slate-500">Order-to-Fulfillment Lifecycle</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Sales Order Booking, Warehouse Fulfillment & Tracking
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Customer LPO validation, warehouse stock reservation, multi-level order release, and shipment dispatch orchestration.
            </p>
          </div>
        </div>

        {/* Process Tabs */}
        <div className="flex flex-wrap gap-2 border-t border-slate-200 dark:border-slate-800 pt-4 mt-5">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'booking', label: '06.06.01 Order Booking (LPO)', code: 'tx-order-booking' },
            { id: 'approvals', label: '06.06.02 Order Release Approvals', code: 'tx-order-approvals' },
            { id: 'fulfillment', label: '06.06.03 Warehouse Fulfillment & Staging', code: 'tx-order-fulfillment' },
            { id: 'tracking', label: '06.06.04 Milestone & Shipping Tracking', code: 'tx-order-tracking' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dispatch Success Alert */}
      {dispatchAlertMsg && (
        <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-200 text-xs sm:text-sm flex items-start gap-3 shadow-sm animate-fade-in">
          <Truck className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{dispatchAlertMsg}</div>
        </div>
      )}

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sales Orders Directory (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders by SO #, PO #, client..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="In Fulfillment">In Fulfillment</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Invoiced">Invoiced</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const isSelected = selectedOrder?.id === order.id;

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-cyan-50/70 dark:bg-cyan-950/40 border-cyan-400 dark:border-cyan-700 shadow-sm ring-1 ring-cyan-400/50'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-400">
                        {order.orderNumber}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                        {order.customerName}
                      </h4>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.status === 'Dispatched' || order.status === 'Invoiced'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : order.status === 'In Fulfillment'
                          ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Client LPO: <span className="font-mono text-slate-700 dark:text-slate-300">{order.customerPoNumber}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Order Value:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      OMR {order.totalAmountOMR.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>Fulfillment: <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{order.fulfillmentStatus}</span></span>
                    <span>Target: {order.requestedDeliveryDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Order 360 Workspace (7 cols) */}
        <div className="lg:col-span-7">
          {selectedOrder ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-cyan-600 dark:text-cyan-400">
                      {selectedOrder.orderNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {selectedOrder.fulfillmentStatus}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    Sales Order for {selectedOrder.customerName}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Customer PO: <span className="font-mono text-slate-700 dark:text-slate-300">{selectedOrder.customerPoNumber}</span> • Ref Quote: <span className="font-mono text-slate-700 dark:text-slate-300">{selectedOrder.quotationNumber}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {selectedOrder.status !== 'Dispatched' && selectedOrder.status !== 'Invoiced' && (
                    <button
                      onClick={() => handleDispatchOrder(selectedOrder)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      <Truck className="w-4 h-4" />
                      Dispatch Delivery Note (DN)
                    </button>
                  )}

                  {selectedOrder.status === 'Dispatched' && (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold">
                      ✓ Dispatched to Site
                    </span>
                  )}
                </div>
              </div>

              {/* Order Metadata Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Delivery Destination</span>
                  <span className="font-bold text-slate-900 dark:text-white mt-0.5 block truncate">
                    {selectedOrder.deliveryAddress}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Payment Terms</span>
                  <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
                    {selectedOrder.paymentTerms}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Committed Delivery</span>
                  <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
                    {selectedOrder.requestedDeliveryDate}
                  </span>
                </div>
              </div>

              {/* Milestone Tracking Progress Bar */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-500 block mb-3">
                  06.06.04 Milestone Progression Status
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                    1. Booked (LPO)
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                    2. Inventory Allocated
                  </div>
                  <div
                    className={`p-2 rounded-lg font-semibold border ${
                      selectedOrder.status === 'Dispatched' || selectedOrder.status === 'Invoiced'
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200'
                    }`}
                  >
                    3. Dispatch DN
                  </div>
                  <div
                    className={`p-2 rounded-lg font-semibold border ${
                      selectedOrder.status === 'Invoiced'
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200'
                    }`}
                  >
                    4. AR Invoiced
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                  Order Line Items & Allocated Inventory
                </h4>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                      <tr>
                        <th className="px-3.5 py-2.5">Item Code & Scope</th>
                        <th className="px-3 py-2.5 text-center">Ordered</th>
                        <th className="px-3 py-2.5 text-center">Delivered</th>
                        <th className="px-3 py-2.5 text-right">Unit Price</th>
                        <th className="px-3 py-2.5 text-right">Line Total (OMR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {selectedOrder.lines.map((line) => (
                        <tr key={line.id}>
                          <td className="px-3.5 py-2.5">
                            <div className="font-semibold text-slate-900 dark:text-white">{line.description}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{line.itemCode}</div>
                          </td>
                          <td className="px-3 py-2.5 text-center font-bold">
                            {line.quantityOrdered} {line.uom}
                          </td>
                          <td className="px-3 py-2.5 text-center text-emerald-600 dark:text-emerald-400 font-semibold">
                            {line.quantityDelivered} {line.uom}
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            OMR {line.unitPriceOMR.toLocaleString()}
                          </td>
                          <td className="px-3 py-2.5 text-right font-bold text-slate-900 dark:text-white">
                            OMR {line.lineTotalOMR.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-full sm:w-72 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Taxable Base:</span>
                    <span>OMR {selectedOrder.taxableAmountOMR.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Oman VAT (5%):</span>
                    <span>OMR {selectedOrder.vatAmountOMR.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                    <span>Order Total:</span>
                    <span className="text-cyan-600 dark:text-cyan-400">
                      OMR {selectedOrder.totalAmountOMR.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              Select an order to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

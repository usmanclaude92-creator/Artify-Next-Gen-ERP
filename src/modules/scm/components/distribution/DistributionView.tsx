// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 12: SUPPLY CHAIN MANAGEMENT (SCM)
// 12.06 — Distribution & Supply Chain Analytics View
// ==========================================

import React, { useState } from 'react';
import { useScmStore } from '../../services/scmStore';
import { DistributionReplenishmentOrder } from '../../types';
import {
  Share2,
  Building2,
  Truck,
  BarChart3,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Percent,
  Clock,
  ShieldAlert,
  Boxes,
  PenTool
} from 'lucide-react';

export const DistributionView: React.FC = () => {
  const {
    warehouseHubs,
    replenishmentOrders,
    deliveryRecords,
    kpiMetrics,
    createReplenishmentOrder,
    updateReplenishmentStatus,
    completeDeliveryEpod,
    currency
  } = useScmStore();

  const [activeSubTab, setActiveSubTab] = useState<'hubs' | 'replenishment' | 'delivery' | 'analytics'>('hubs');
  const [showNewReplenishmentModal, setShowNewReplenishmentModal] = useState(false);
  const [signingDeliveryId, setSigningDeliveryId] = useState<string | null>(null);
  const [epodRecipient, setEpodRecipient] = useState('');
  const [epodNotes, setEpodNotes] = useState('');

  // New Replenishment Form
  const [newReplenishmentForm, setNewReplenishmentForm] = useState({
    sourceHub: 'Sohar Freezone Deepwater Cross-Dock Center',
    destinationDepot: 'Muscat Central Distribution & Spares Hub',
    requestedDate: '2026-08-21',
    dispatchDate: '2026-08-22',
    totalPallets: 36,
    skuCount: 12,
    priority: 'Urgent' as DistributionReplenishmentOrder['priority'],
    status: 'Planned' as DistributionReplenishmentOrder['status']
  });

  const handleCreateReplenishment = (e: React.FormEvent) => {
    e.preventDefault();
    createReplenishmentOrder(newReplenishmentForm);
    setShowNewReplenishmentModal(false);
  };

  const handleConfirmEpod = (e: React.FormEvent) => {
    e.preventDefault();
    if (signingDeliveryId && epodRecipient.trim()) {
      completeDeliveryEpod(signingDeliveryId, epodRecipient.trim(), epodNotes.trim());
      setSigningDeliveryId(null);
      setEpodRecipient('');
      setEpodNotes('');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 tracking-wider">
                12.06 DISTRIBUTION & ANALYTICS
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Hubs, Replenishment & Last-Mile ePOD</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Regional Distribution Centers, Transfer Waves & Supply Chain KPIs
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Coordinate multi-facility warehouse cross-dock throughput, dispatch inter-depot replenishment transfers, capture mobile ePOD signatures, and track enterprise OTIF metrics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeSubTab === 'replenishment' && (
              <button
                onClick={() => setShowNewReplenishmentModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Transfer Order</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveSubTab('hubs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'hubs'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Warehouse Hubs (12.06.01)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('replenishment')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'replenishment'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Distribution Planning (12.06.02)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('delivery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'delivery'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Delivery Management & ePOD (12.06.03)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>SCM Analytics & OTIF (12.06.04)</span>
          </button>
        </div>
      </div>

      {/* ----------------- SUB-TAB 1: WAREHOUSE HUBS & CROSS-DOCKS ----------------- */}
      {activeSubTab === 'hubs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {warehouseHubs.map((hub) => (
              <div
                key={hub.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{hub.hubCode}</span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{hub.hubName}</h3>
                      <span className="text-[11px] text-slate-600 dark:text-slate-400">{hub.city}</span>
                    </div>
                  </div>

                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {hub.utilizationPercent}% Capacity
                  </span>
                </div>

                {/* Utilization Progress Bar */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-600 dark:text-slate-400">Occupied Pallet Positions:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {hub.occupiedPalletPositions.toLocaleString()} / {hub.totalPalletCapacity.toLocaleString()} ({hub.utilizationPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-50 dark:bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        hub.utilizationPercent > 85 ? 'bg-amber-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${hub.utilizationPercent}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold">Cross-Dock Bays</span>
                    <p className="font-bold text-cyan-600 dark:text-cyan-400">{hub.crossDockBaysAvailable} Available</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold">Active Inbound</span>
                    <p className="font-bold text-slate-900 dark:text-white">{hub.activeInboundTrailers} Trailers</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold">Fast-Pick Score</span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">{hub.fastPickEfficiencyIndex}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 2: DISTRIBUTION REPLENISHMENT ORDERS ----------------- */}
      {activeSubTab === 'replenishment' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {replenishmentOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded border border-indigo-800/60">
                      {order.replenishmentOrderNumber}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">{order.sourceHub}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <span>Destination Depot:</span>
                      <span className="text-slate-900 dark:text-white font-bold">{order.destinationDepot}</span>
                    </p>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      order.status === 'In Transit'
                        ? 'bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800'
                        : order.status === 'Received & Stored'
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold">Total Pallets</span>
                    <p className="font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">{order.totalPallets} Pallets</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold">SKU Count</span>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">{order.skuCount} Lines</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-sans font-bold">Priority</span>
                    <p className="font-bold text-rose-600 dark:text-rose-400 mt-0.5">{order.priority}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <span className="text-slate-600 dark:text-slate-400 font-mono">Dispatch Date: {order.dispatchDate}</span>
                  {order.status === 'Staged for Loading' && (
                    <button
                      onClick={() => updateReplenishmentStatus(order.id, 'In Transit')}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-all cursor-pointer"
                    >
                      Dispatch Transfer
                    </button>
                  )}
                  {order.status === 'In Transit' && (
                    <button
                      onClick={() => updateReplenishmentStatus(order.id, 'Received & Stored')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-all cursor-pointer"
                    >
                      Acknowledge Depot Receipt
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 3: DELIVERY MANAGEMENT & EPOD ----------------- */}
      {activeSubTab === 'delivery' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Last-Mile Customer Deliveries & Electronic Proof of Delivery (ePOD)</span>
              </h3>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">{deliveryRecords.length} Dispatches</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase font-bold border-b border-slate-200 dark:border-slate-800 text-[10px] tracking-wider font-sans">
                  <tr>
                    <th className="py-3 px-4">Dispatch & Order</th>
                    <th className="py-3 px-4">Client / Destination</th>
                    <th className="py-3 px-4">Driver & Vehicle</th>
                    <th className="py-3 px-4">Window</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">ePOD Digital Proof</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                  {deliveryRecords.map((del) => (
                    <tr key={del.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-sans">
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 block">{del.dispatchId}</span>
                        <span className="text-slate-700 dark:text-slate-300 text-xs">{del.customerOrderRef}</span>
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <span className="font-bold text-slate-900 dark:text-white block">{del.customerName}</span>
                        <span className="text-slate-600 dark:text-slate-400 text-[11px] truncate block">{del.deliveryAddress}</span>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-700 dark:text-slate-300">
                        <span>{del.assignedDriver}</span>
                        <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] block">{del.vehiclePlate}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{del.scheduledTimeWindow}</td>
                      <td className="py-3 px-4 text-center font-sans">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            del.status === 'Delivered'
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                          }`}
                        >
                          {del.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-sans">
                        {del.epodSignatureCaptured ? (
                          <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Signed ({del.recipientName?.split(' ')[0]})</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 dark:text-slate-400 text-xs">Pending Signature</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-sans">
                        {!del.epodSignatureCaptured && (
                          <button
                            onClick={() => setSigningDeliveryId(del.id)}
                            className="px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-600 dark:text-indigo-400 border border-indigo-500/40 rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            Capture ePOD
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 4: SCM EXECUTIVE ANALYTICS ----------------- */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top 4 KPI Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">On-Time In-Full (OTIF)</span>
              <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                {kpiMetrics.onTimeInFullPercent}%
              </p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 block">Target &gt;95% met</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Customs Clearance Latency</span>
              <p className="text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400 mt-1">
                {kpiMetrics.customsAvgClearanceDays} Days
              </p>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 block">Bayan Green Channel average</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Inventory Dwell Time</span>
              <p className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400 mt-1">
                {kpiMetrics.inventoryDwellDaysAvg} Days
              </p>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 block">Average throughput velocity</span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Supply Chain Risk Index</span>
              <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                {kpiMetrics.supplyChainRiskScore} / 100
              </p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 block">Low Risk Rating</span>
            </div>
          </div>

          {/* Deep Freight & Cost Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Total Landed Cost Optimization Breakdown</span>
              </h3>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Multi-Hub Route Optimization Savings:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">+{kpiMetrics.totalLandedCostSavingsPercent}% Net Savings</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Average Landed Freight Cost Per Unit:</span>
                  <span className="text-slate-900 dark:text-white font-bold">{kpiMetrics.freightCostPerUnitAvg} {currency} / Unit</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400 font-sans">Active Inbound Sea / Air Containers:</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">{kpiMetrics.inboundContainerCount} FCL Containers</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>Port & Demurrage Risk Mitigation Summary</span>
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Zero demurrage penalties incurred across Sohar and Salalah ports during the current quarter. Automated Bayan customs pre-clearance triggers reduced import hold times from 4.8 days to 2.1 days.
              </p>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>All ocean carrier free-time windows are healthy (&gt;5 days buffer remaining).</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 1: NEW REPLENISHMENT ORDER ----------------- */}
      {showNewReplenishmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Create Distribution Replenishment Wave</span>
              </h3>
              <button
                onClick={() => setShowNewReplenishmentModal(false)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleCreateReplenishment} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Source Hub</label>
                <select
                  value={newReplenishmentForm.sourceHub}
                  onChange={(e) => setNewReplenishmentForm({ ...newReplenishmentForm, sourceHub: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                >
                  <option value="Sohar Freezone Deepwater Cross-Dock Center">Sohar Freezone Cross-Dock</option>
                  <option value="Muscat Central Distribution & Spares Hub">Muscat Central Hub</option>
                  <option value="Salalah Port Gateway Hub">Salalah Port Hub</option>
                  <option value="Dubai Logistics Hub (JAFZA Regional)">Dubai Logistics Hub</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Destination Depot</label>
                <select
                  value={newReplenishmentForm.destinationDepot}
                  onChange={(e) => setNewReplenishmentForm({ ...newReplenishmentForm, destinationDepot: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                >
                  <option value="Muscat Central Distribution & Spares Hub">Muscat Central Hub</option>
                  <option value="Sohar Freezone Deepwater Cross-Dock Center">Sohar Freezone Cross-Dock</option>
                  <option value="Salalah Port Gateway Hub">Salalah Port Hub</option>
                  <option value="Dubai Logistics Hub (JAFZA Regional)">Dubai Logistics Hub</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Pallet Count</label>
                  <input
                    type="number"
                    value={newReplenishmentForm.totalPallets}
                    onChange={(e) => setNewReplenishmentForm({ ...newReplenishmentForm, totalPallets: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Priority</label>
                  <select
                    value={newReplenishmentForm.priority}
                    onChange={(e) => setNewReplenishmentForm({ ...newReplenishmentForm, priority: e.target.value as DistributionReplenishmentOrder['priority'] })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="Standard Replenishment">Standard Replenishment</option>
                    <option value="Bulk Transfer">Bulk Transfer</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewReplenishmentModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30"
                >
                  Stage & Issue Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL 2: CAPTURE EPOD SIGNATURE ----------------- */}
      {signingDeliveryId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PenTool className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Capture Electronic Proof of Delivery (ePOD)</span>
              </h3>
              <button
                onClick={() => setSigningDeliveryId(null)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleConfirmEpod} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Recipient Name & Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eng. Khalid Al-Amri (Site Receiver)"
                  value={epodRecipient}
                  onChange={(e) => setEpodRecipient(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Digital Signature Pad (Simulated Touch Confirmation)</label>
                <div className="h-24 bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 font-mono">
                  <span>[ Digital Signature Verified on Touch Device ]</span>
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Delivery Notes / Seal Verification</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Container seals inspected and verified intact."
                  value={epodNotes}
                  onChange={(e) => setEpodNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSigningDeliveryId(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/30"
                >
                  Confirm Delivery & Lock ePOD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

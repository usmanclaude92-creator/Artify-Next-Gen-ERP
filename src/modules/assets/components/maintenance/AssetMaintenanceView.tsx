// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 13: ASSET MANAGEMENT
// 13.05 Asset Maintenance, Work Orders, Downtime & Spares
// ==========================================

import React, { useState } from 'react';
import { useAssetStore } from '../../services/assetStore';
import { MaintenanceWorkOrder, PreventiveMaintenancePlan } from '../../types';
import {
  Wrench,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  DollarSign,
  Plus,
  Package,
  Activity,
  Layers,
  Hammer,
  ShieldAlert,
  PlayCircle,
  FileText
} from 'lucide-react';
import { notify } from '@/src/components/common/Feedback';
import { mockRandom } from '@/src/utils/mockRandom';

export const AssetMaintenanceView: React.FC = () => {
  const {
    assets,
    workOrders,
    pmPlans,
    currency,
    createWorkOrder,
    completeWorkOrder,
    createPMPlan
  } = useAssetStore();

  const [activeTab, setActiveTab] = useState<'work_orders' | 'pm_plans' | 'calendar' | 'cost_rollup'>('work_orders');
  const [showWoModal, setShowWoModal] = useState(false);
  const [showPmModal, setShowPmModal] = useState(false);
  const [selectedWoForComplete, setSelectedWoForComplete] = useState<MaintenanceWorkOrder | null>(null);

  // Work Order Form
  const [woForm, setWoForm] = useState({
    assetId: assets[0]?.id || '',
    type: 'CORRECTIVE' as any,
    priority: 'HIGH' as any,
    title: '',
    description: '',
    technicianName: 'Salim Al-Harthy',
    scheduledStartDate: new Date().toISOString().split('T')[0],
    isCapitalizedRepair: false,
    sparePartsCost: 2400,
    laborCost: 1600,
    contractorCost: 0
  });

  // PM Plan Form
  const [pmForm, setPmForm] = useState({
    assetId: assets[0]?.id || '',
    planCode: `PM-PLAN-${Math.floor(100 + mockRandom() * 900)}`,
    title: '',
    frequency: 'MONTHLY' as any,
    serviceIntervalHours: 250,
    assignedVendor: 'Al-Khadra Technical Fleet Services'
  });

  const handleCreateWO = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAsset = assets.find(a => a.id === woForm.assetId) || assets[0];
    const today = new Date().toISOString().split('T')[0];
    const sparePartsCost = Number(woForm.sparePartsCost);
    const laborCost = Number(woForm.laborCost);
    const vendorServiceCost = Number(woForm.contractorCost);
    createWorkOrder({
      type: woForm.isCapitalizedRepair ? 'OVERHAUL' : woForm.type,
      priority: woForm.priority,
      assetId: targetAsset.id,
      assetTag: targetAsset.assetTag,
      assetName: targetAsset.name,
      location: targetAsset.locationName ?? '',
      reportedDate: today,
      scheduledDate: woForm.scheduledStartDate,
      problemDescription: woForm.title ? `${woForm.title} — ${woForm.description}` : woForm.description,
      technician: woForm.technicianName,
      sparePartsCost,
      laborCost,
      vendorServiceCost,
      sparePartsUsed: [
        { itemCode: 'SPR-HYD-09', description: 'Hydraulic Seal Kit & High Pressure Hose', quantity: 2, unitCost: 1200, total: 2400 }
      ],
      downTimeHours: 0,
      status: 'IN_PROGRESS'
    });
    setShowWoModal(false);
  };

  const handleCreatePM = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAsset = assets.find(a => a.id === pmForm.assetId) || assets[0];
    createPMPlan({
      assetId: targetAsset.id,
      assetTag: targetAsset.assetTag,
      assetName: targetAsset.name,
      planName: pmForm.title,
      frequencyType: 'CALENDAR_DAYS',
      frequencyInterval: pmForm.frequency === 'WEEKLY' ? 7 : pmForm.frequency === 'QUARTERLY' ? 90 : 30,
      lastExecutedDate: new Date().toISOString().split('T')[0],
      nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tasksChecklist: [{ taskName: 'Standard inspection & lubrication', mandatory: true }],
      estimatedLaborHours: Number(pmForm.serviceIntervalHours) / 25,
      estimatedCost: 0,
      assignedTechnician: pmForm.assignedVendor,
      status: 'ACTIVE'
    });
    setShowPmModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                13.05
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Asset Maintenance & Work Orders</h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Preventive maintenance cycles, corrective breakdown work orders, spare parts consumption, and capitalized overhaul rollups.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPmModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Create PM Plan</span>
            </button>

            <button
              onClick={() => setShowWoModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
            >
              <Wrench className="w-4 h-4" />
              <span>Raise Work Order</span>
            </button>
          </div>
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('work_orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'work_orders'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Active Work Orders ({workOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pm_plans')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pm_plans'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Preventive Maintenance Plans ({pmPlans.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cost_rollup')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'cost_rollup'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Overhauls vs Expense Rollup</span>
          </button>
        </div>
      </div>

      {/* VIEW: ACTIVE WORK ORDERS */}
      {activeTab === 'work_orders' && (
        <div className="space-y-4">
          {workOrders.map(wo => (
            <div key={wo.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded border border-amber-200 dark:border-amber-800">
                    {wo.workOrderNumber}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{wo.problemDescription}</h4>
                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{wo.assetTag} • {wo.assetName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider ${
                    wo.priority === 'CRITICAL' || wo.priority === 'HIGH'
                      ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 animate-pulse'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {wo.priority} PRIORITY
                  </span>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded border ${
                    wo.status === 'COMPLETED'
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                  }`}>
                    {wo.status.replace(/_/g, ' ')}
                  </span>

                  {wo.status !== 'COMPLETED' && (
                    <button
                      onClick={() => {
                        completeWorkOrder(wo.id, 'Completed and returned to service', wo.totalCost);
                        notify(`Work order ${wo.workOrderNumber} marked as completed and asset restored to IN_SERVICE!`);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Complete & Restore Asset</span>
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300">{wo.actionTaken ?? wo.rootCauseAnalysis ?? wo.problemDescription}</p>

              {/* Cost & Technician Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl">
                  <div className="text-slate-500 dark:text-slate-400">Lead Technician</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{wo.technician}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl">
                  <div className="text-slate-500 dark:text-slate-400">Spares Cost</div>
                  <div className="font-mono font-bold text-slate-700 dark:text-slate-300 mt-0.5">{currency} {wo.sparePartsCost.toLocaleString()}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl">
                  <div className="text-slate-500 dark:text-slate-400">Labor & Overhead</div>
                  <div className="font-mono font-bold text-slate-700 dark:text-slate-300 mt-0.5">{currency} {(wo.laborCost + wo.vendorServiceCost).toLocaleString()}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl">
                  <div className="text-slate-500 dark:text-slate-400">Accounting Treatment</div>
                  <div className="font-bold text-amber-700 dark:text-amber-400 mt-0.5">
                    {wo.type === 'OVERHAUL' ? 'CAPITALIZED OVERHAUL' : 'EXPENSED REPAIR'}
                  </div>
                </div>
              </div>

              {/* Parts consumed */}
              {wo.sparePartsUsed.length > 0 && (
                <div className="bg-slate-50/60 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 text-xs">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-1.5">Consumed Spare Parts (Inventory Subledger)</div>
                  <div className="flex items-center gap-4 flex-wrap">
                    {wo.sparePartsUsed.map((p, idx) => (
                      <span key={idx} className="font-mono text-slate-700 dark:text-slate-300">
                        • {p.description} (Qty: {p.quantity}) — <span className="text-amber-700 dark:text-amber-400">{currency} {p.total.toLocaleString()}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* VIEW: PM PLANS */}
      {activeTab === 'pm_plans' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Preventive Maintenance Schedules & Intervals</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Automated recurring service intervals triggered by operating hours or calendar dates.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase font-mono tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Plan Code</th>
                  <th className="py-3 px-4">Asset Tag & Description</th>
                  <th className="py-3 px-4">Service Plan Title</th>
                  <th className="py-3 px-4">Frequency</th>
                  <th className="py-3 px-4">Next Due Date</th>
                  <th className="py-3 px-4">Assigned Vendor</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {pmPlans.map(pm => (
                  <tr key={pm.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-700 dark:text-amber-400">{pm.planCode}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{pm.assetName}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{pm.assetTag}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">{pm.planName}</td>
                    <td className="py-3.5 px-4 font-mono">{pm.frequencyType} ({pm.frequencyInterval} Days)</td>
                    <td className="py-3.5 px-4 font-mono text-cyan-600 dark:text-cyan-400 font-bold">{pm.nextDueDate}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{pm.assignedTechnician}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        {pm.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: COST ROLLUP & CAPITALIZATION */}
      {activeTab === 'cost_rollup' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Maintenance Cost Rollup & Overhaul Capitalization</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Analysis of major component rebuilds capitalized into asset gross carrying value versus routine OPEX repairs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">Total Spares Consumed</div>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                {currency} {workOrders.reduce((acc, wo) => acc + wo.sparePartsCost, 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Credited to Spare Parts Inventory</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">Expensed OPEX Repairs</div>
              <div className="text-2xl font-black font-mono text-amber-700 dark:text-amber-400">
                {currency} {workOrders.filter(w => w.type !== 'OVERHAUL').reduce((acc, w) => acc + w.totalCost, 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Debited to P&L Machinery Maintenance Expense</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">Capitalized Major Overhauls</div>
              <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {currency} {workOrders.filter(w => w.type === 'OVERHAUL').reduce((acc, w) => acc + w.totalCost, 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Debited to Fixed Asset Cost Basis & Depreciated</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RAISE WORK ORDER */}
      {showWoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Raise Maintenance Work Order</h3>
              <button
                onClick={() => setShowWoModal(false)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWO} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Target Asset *</label>
                <select
                  value={woForm.assetId}
                  onChange={e => setWoForm({ ...woForm, assetId: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                >
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>{a.assetTag} — {a.name} ({a.locationName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Work Order Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hydraulic Pump Overhaul & Filter Replacement"
                  value={woForm.title}
                  onChange={e => setWoForm({ ...woForm, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Work Order Type</label>
                  <select
                    value={woForm.type}
                    onChange={e => setWoForm({ ...woForm, type: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="PREVENTIVE">Preventive Maintenance</option>
                    <option value="CORRECTIVE">Corrective Repair</option>
                    <option value="OVERHAUL">Major Overhaul</option>
                    <option value="CALIBRATION">Calibration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Priority</label>
                  <select
                    value={woForm.priority}
                    onChange={e => setWoForm({ ...woForm, priority: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical Breakdown</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Lead Technician</label>
                  <input
                    type="text"
                    value={woForm.technicianName}
                    onChange={e => setWoForm({ ...woForm, technicianName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Estimated Spares Cost ({currency})</label>
                  <input
                    type="number"
                    value={woForm.sparePartsCost}
                    onChange={e => setWoForm({ ...woForm, sparePartsCost: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Defect Description / Scope of Work</label>
                <textarea
                  rows={3}
                  value={woForm.description}
                  onChange={e => setWoForm({ ...woForm, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowWoModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  Dispatch Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW PM PLAN */}
      {showPmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Create Preventive Maintenance Plan</h3>
              <button
                onClick={() => setShowPmModal(false)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePM} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Target Asset *</label>
                <select
                  value={pmForm.assetId}
                  onChange={e => setPmForm({ ...pmForm, assetId: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                >
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>{a.assetTag} — {a.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">PM Title / Service Plan *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 500-Hour Fluid & Filter Comprehensive Service"
                  value={pmForm.title}
                  onChange={e => setPmForm({ ...pmForm, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Frequency</label>
                  <select
                    value={pmForm.frequency}
                    onChange={e => setPmForm({ ...pmForm, frequency: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="MONTHLY">Monthly</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="SEMI_ANNUAL">Semi-Annual</option>
                    <option value="ANNUAL">Annual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Interval Hours</label>
                  <input
                    type="number"
                    value={pmForm.serviceIntervalHours}
                    onChange={e => setPmForm({ ...pmForm, serviceIntervalHours: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPmModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  Save PM Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

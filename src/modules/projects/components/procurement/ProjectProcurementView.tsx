// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 10.04: PROJECT PROCUREMENT & SUBCONTRACTS
// Requisitions, Project POs, Site Material Inventory, Subcontractor Packages
// ==========================================

import React, { useState } from 'react';
import { useProjectStore } from '../../services/projectStore';
import { ProjectPurchaseRequisition, SubcontractorContract } from '../../types';
import {
  Truck,
  FileCheck2,
  ShoppingCart,
  Boxes,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileText,
  DollarSign
} from 'lucide-react';

export const ProjectProcurementView: React.FC = () => {
  const {
    selectedProject,
    purchaseRequisitions,
    createPurchaseRequisition,
    approvePurchaseRequisition,
    purchaseOrders,
    generatePurchaseOrderFromPr,
    siteInventory,
    subcontracts,
    createSubcontract
  } = useProjectStore();

  const [activeTab, setActiveTab] = useState<'REQUISITIONS' | 'PURCHASE_ORDERS' | 'SITE_MATERIALS' | 'SUBCONTRACTOR_COST'>('REQUISITIONS');
  const [showNewPrModal, setShowNewPrModal] = useState(false);
  const [showNewSubModal, setShowNewSubModal] = useState(false);

  // New PR Form State
  const [newPrForm, setNewPrForm] = useState({
    projectId: selectedProject.id,
    projectName: selectedProject.projectName,
    requestedBy: 'Eng. Salem Al-Maamari',
    department: 'Site Engineering & Cryogenic QA',
    requestDate: new Date().toISOString().split('T')[0],
    priority: 'ROUTINE' as ProjectPurchaseRequisition['priority'],
    requiredDeliveryLocation: selectedProject.location,
    currency: selectedProject.currency,
    justification: 'High pressure cryogenic valve trim components for ethylene gas terminal.',
    items: [
      { id: 'item-1', itemCode: 'VLV-CRYO-TRIM', itemDescription: 'Stellite Trim Kit for 12" Cryo Valves', costCodeNumber: 'CC-MAT-103', requiredQuantity: 6, uom: 'SET', estimatedUnitPrice: 4200, estimatedTotal: 25200, requiredByDate: '2026-08-01', budgetCheckPassed: true }
    ]
  });

  // New Subcontract Form State
  const [newSubForm, setNewSubForm] = useState({
    projectId: selectedProject.id,
    subcontractorVendorId: 'VND-SUB-009',
    subcontractorName: '',
    scopeOfWork: '',
    contractTotalValue: 350000,
    currency: selectedProject.currency,
    retentionPercent: 10,
    advancePaid: 35000,
    siteEngineerSignoff: 'Eng. Saeed Farooqi'
  });

  const handleCreatePr = (e: React.FormEvent) => {
    e.preventDefault();
    createPurchaseRequisition(newPrForm);
    setShowNewPrModal(false);
  };

  const handleCreateSub = (e: React.FormEvent) => {
    e.preventDefault();
    createSubcontract(newSubForm);
    setShowNewSubModal(false);
  };

  const currentProjectPrs = purchaseRequisitions.filter(pr => pr.projectId === selectedProject.id);
  const currentProjectPos = purchaseOrders.filter(po => po.projectId === selectedProject.id);
  const currentProjectSubs = subcontracts.filter(sub => sub.projectId === selectedProject.id);
  const currentProjectInventory = siteInventory.filter(inv => inv.projectId === selectedProject.id);

  return (
    <div id="project-procurement-module" className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl text-slate-900 dark:text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-widest text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                10.04 — Project Procurement & Subcontracts
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                {selectedProject.projectCode}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Site Requisitions, Purchase Orders, Material Verification & Subcontracts
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'REQUISITIONS' && (
            <button
              onClick={() => setShowNewPrModal(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Purchase Requisition</span>
            </button>
          )}
          {activeTab === 'SUBCONTRACTOR_COST' && (
            <button
              onClick={() => setShowNewSubModal(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Subcontract Agreement</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('REQUISITIONS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'REQUISITIONS'
              ? 'bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Purchase Requisitions ({currentProjectPrs.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('PURCHASE_ORDERS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'PURCHASE_ORDERS'
              ? 'bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Project Purchase Orders ({currentProjectPos.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('SITE_MATERIALS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'SITE_MATERIALS'
              ? 'bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Site Material Stock ({currentProjectInventory.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('SUBCONTRACTOR_COST')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'SUBCONTRACTOR_COST'
              ? 'bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Subcontractor Packages ({currentProjectSubs.length})</span>
        </button>
      </div>

      {/* TAB 1: PURCHASE REQUISITIONS */}
      {activeTab === 'REQUISITIONS' && (
        <div className="space-y-4">
          {currentProjectPrs.map(pr => (
            <div key={pr.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-800">
                    {pr.prNumber}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{pr.department}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Requested by {pr.requestedBy} on {pr.requestDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className={`px-2.5 py-1 rounded-full font-bold uppercase ${
                    pr.status === 'APPROVED_READY_FOR_PO' || pr.status === 'PO_GENERATED'
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                  }`}>
                    {pr.status}
                  </span>
                  {pr.status === 'SUBMITTED_FOR_PM_APPROVAL' && (
                    <button
                      onClick={() => approvePurchaseRequisition(pr.id, 'Dr. Tarek Al-Ghamdi (PM)')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold cursor-pointer"
                    >
                      Approve PR
                    </button>
                  )}
                  {pr.status === 'APPROVED_READY_FOR_PO' && (
                    <button
                      onClick={() => generatePurchaseOrderFromPr(pr.id, 'VND-00109', 'Mannesmann Stainless GmbH', '30% Advance, 70% LC at Sight')}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold cursor-pointer"
                    >
                      Generate Project PO
                    </button>
                  )}
                </div>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
                <strong className="text-slate-600 dark:text-slate-400">Engineering Justification:</strong> {pr.justification}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Item Code</th>
                      <th className="py-2.5 px-3">Description & Specification</th>
                      <th className="py-2.5 px-3">Cost Code</th>
                      <th className="py-2.5 px-3 text-right">Qty</th>
                      <th className="py-2.5 px-3 text-right">Est. Unit Price</th>
                      <th className="py-2.5 px-3 text-right">Total Est.</th>
                      <th className="py-2.5 px-3">Budget Check</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 font-mono">
                    {pr.items.map(item => (
                      <tr key={item.id}>
                        <td className="py-2.5 px-3 font-bold text-purple-600 dark:text-purple-400">{item.itemCode}</td>
                        <td className="py-2.5 px-3 font-sans text-slate-900 dark:text-white">{item.itemDescription}</td>
                        <td className="py-2.5 px-3 font-sans text-slate-700 dark:text-slate-300">{item.costCodeNumber}</td>
                        <td className="py-2.5 px-3 text-right text-slate-900 dark:text-white font-bold">{item.requiredQuantity} {item.uom}</td>
                        <td className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">{pr.currency} {item.estimatedUnitPrice.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400 font-extrabold">{pr.currency} {item.estimatedTotal.toLocaleString()}</td>
                        <td className="py-2.5 px-3 font-sans">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold">
                            PASSED BOQ
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: PURCHASE ORDERS */}
      {activeTab === 'PURCHASE_ORDERS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Committed Project Purchase Orders</h2>
            <span className="text-xs text-slate-600 dark:text-slate-400">Encumbered against project budget lines</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">PO Number</th>
                  <th className="py-3 px-4">Vendor Supplier</th>
                  <th className="py-3 px-4">Cost Code</th>
                  <th className="py-3 px-4">Order Date</th>
                  <th className="py-3 px-4">Expected Delivery</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                  <th className="py-3 px-4 text-right">Total (+VAT)</th>
                  <th className="py-3 px-4">Delivery Site</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 font-mono">
                {currentProjectPos.map(po => (
                  <tr key={po.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-purple-600 dark:text-purple-400">
                      {po.poNumber}
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-semibold text-slate-900 dark:text-white">{po.vendorName}</div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400">{po.vendorId}</div>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-slate-800 dark:text-slate-200">
                      {po.costCodeNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {po.orderDate}
                    </td>
                    <td className="py-3.5 px-4 text-amber-700 dark:text-amber-400 font-bold">
                      {po.expectedDeliveryDate}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-700 dark:text-slate-300">
                      {po.currency} {po.subtotalAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right text-emerald-600 dark:text-emerald-400 font-extrabold">
                      {po.currency} {po.totalPoAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-slate-600 dark:text-slate-400">
                      {po.deliverySiteLocation}
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10px] font-bold">
                        {po.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SITE MATERIAL STOCK */}
      {activeTab === 'SITE_MATERIALS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Physical Materials Stock Held at Site Stores</h2>
            <span className="text-xs text-slate-600 dark:text-slate-400">Verified by Material Receiving Reports (MRR) & Lab MTCs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Item Code & Name</th>
                  <th className="py-3 px-4">Cost Code</th>
                  <th className="py-3 px-4 text-right">Received to Date</th>
                  <th className="py-3 px-4 text-right">Consumed in Job</th>
                  <th className="py-3 px-4 text-right font-bold text-purple-600 dark:text-purple-400">Current Site Stock</th>
                  <th className="py-3 px-4 text-right">Unit Value</th>
                  <th className="py-3 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">Valuation</th>
                  <th className="py-3 px-4">Yard Location</th>
                  <th className="py-3 px-4">MTC Cert</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 font-mono">
                {currentProjectInventory.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-semibold text-slate-900 dark:text-white">{inv.itemName}</div>
                      <div className="text-[11px] text-purple-600 dark:text-purple-400 font-mono">{inv.itemCode}</div>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-slate-800 dark:text-slate-200">
                      {inv.costCodeNumber}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-700 dark:text-slate-300">
                      {inv.totalReceivedToDate} {inv.uom}
                    </td>
                    <td className="py-3.5 px-4 text-right text-amber-700 dark:text-amber-400">
                      {inv.totalConsumedToDate} {inv.uom}
                    </td>
                    <td className="py-3.5 px-4 text-right text-purple-600 dark:text-purple-400 font-extrabold text-sm">
                      {inv.currentStockOnSite} {inv.uom}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-700 dark:text-slate-300">
                      {inv.currency} {inv.unitValue.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                      {inv.currency} {inv.totalInventoryValuation.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-slate-700 dark:text-slate-300">
                      {inv.siteStorageLocation}
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold">
                        {inv.inspectionCertRef}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SUBCONTRACTOR PACKAGES */}
      {activeTab === 'SUBCONTRACTOR_COST' && (
        <div className="space-y-4">
          {currentProjectSubs.map(sub => (
            <div key={sub.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-800">
                    {sub.subcontractNumber}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{sub.subcontractorName}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Vendor ID: {sub.subcontractorVendorId} | Lead Signoff: {sub.siteEngineerSignoff}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold uppercase">
                    {sub.status}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
                <strong className="text-slate-600 dark:text-slate-400">Scope of Work:</strong> {sub.scopeOfWork}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs font-mono">
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 font-sans">Contract Value</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {sub.currency} {sub.contractTotalValue.toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 font-sans">Certified Work</span>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {sub.currency} {sub.totalCertifiedWorkDone.toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 font-sans">Retention Deducted (10%)</span>
                  <p className="text-sm font-bold text-amber-700 dark:text-amber-400 mt-0.5">
                    {sub.currency} {sub.totalRetentionDeducted.toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 font-sans">Net Billed to Date</span>
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                    {sub.currency} {sub.netBilledToDate.toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 font-sans">Paid Disbursements</span>
                  <p className="text-sm font-bold text-purple-600 dark:text-purple-400 mt-0.5">
                    {sub.currency} {sub.totalPaidToDate.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: CREATE REQUISITION */}
      {showNewPrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Create Site Purchase Requisition</h2>
            <form onSubmit={handleCreatePr} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-semibold">Department / Package</label>
                <input
                  type="text"
                  required
                  value={newPrForm.department}
                  onChange={(e) => setNewPrForm({ ...newPrForm, department: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-semibold">Engineering Justification</label>
                <textarea
                  required
                  rows={2}
                  value={newPrForm.justification}
                  onChange={(e) => setNewPrForm({ ...newPrForm, justification: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold">Item Description</label>
                  <input
                    type="text"
                    required
                    value={newPrForm.items[0].itemDescription}
                    onChange={(e) => {
                      const updatedItems = [...newPrForm.items];
                      updatedItems[0].itemDescription = e.target.value;
                      setNewPrForm({ ...newPrForm, items: updatedItems });
                    }}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold">Estimated Total ({selectedProject.currency})</label>
                  <input
                    type="number"
                    required
                    value={newPrForm.items[0].estimatedTotal}
                    onChange={(e) => {
                      const updatedItems = [...newPrForm.items];
                      updatedItems[0].estimatedTotal = Number(e.target.value);
                      setNewPrForm({ ...newPrForm, items: updatedItems });
                    }}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewPrModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold cursor-pointer"
                >
                  Submit Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE SUBCONTRACT */}
      {showNewSubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">New Subcontract Package Agreement</h2>
            <form onSubmit={handleCreateSub} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-semibold">Subcontractor Firm Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Al-Turki Marine Construction Co."
                  value={newSubForm.subcontractorName}
                  onChange={(e) => setNewSubForm({ ...newSubForm, subcontractorName: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-semibold">Scope of Work</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Detail subcontracted execution milestones..."
                  value={newSubForm.scopeOfWork}
                  onChange={(e) => setNewSubForm({ ...newSubForm, scopeOfWork: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold">Total Package Value ({selectedProject.currency})</label>
                  <input
                    type="number"
                    required
                    value={newSubForm.contractTotalValue}
                    onChange={(e) => setNewSubForm({ ...newSubForm, contractTotalValue: Number(e.target.value) })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold">Mobilization Advance</label>
                  <input
                    type="number"
                    value={newSubForm.advancePaid}
                    onChange={(e) => setNewSubForm({ ...newSubForm, advancePaid: Number(e.target.value) })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewSubModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold cursor-pointer"
                >
                  Execute Subcontract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

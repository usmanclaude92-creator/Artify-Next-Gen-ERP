// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 10.03: PROJECT COSTING
// Cost Codes, Material Job Issues, Labor Timesheets, Equipment Plant Hire
// ==========================================

import React, { useState } from 'react';
import { useProjectStore } from '../../services/projectStore';
import { CostCode, MaterialCostEntry, LaborCostEntry, EquipmentCostEntry } from '../../types';
import {
  DollarSign,
  Layers,
  Package,
  Clock,
  Truck,
  Plus,
  Search,
  CheckCircle2,
  FileText,
  AlertCircle,
  Tag,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { mockRandom } from '@/src/utils/mockRandom';

export const ProjectCostingView: React.FC = () => {
  const {
    selectedProject,
    costCodes,
    createCostCode,
    materialCosts,
    postMaterialCost,
    laborCosts,
    postLaborCost,
    equipmentCosts,
    postEquipmentCost
  } = useProjectStore();

  const [activeTab, setActiveTab] = useState<'COST_CODES' | 'MATERIAL_COST' | 'LABOR_COST' | 'EQUIPMENT_COST'>('MATERIAL_COST');
  const [showNewCostCodeModal, setShowNewCostCodeModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showLaborModal, setShowLaborModal] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);

  // Forms
  const [newCostCodeForm, setNewCostCodeForm] = useState({
    codeNumber: 'CC-GEN-501',
    name: 'Temporary Site Facilities & Power',
    category: 'OVERHEAD_GENERAL' as CostCode['category'],
    glAccountCode: '5050-01',
    description: 'Site offices, diesel generators, camp utilities',
    isActive: true
  });

  const [materialForm, setMaterialForm] = useState({
    projectId: selectedProject.id,
    activityWbsCode: '1.2.02',
    costCodeNumber: 'CC-MAT-101',
    itemCode: 'RAW-STL-9NI-08',
    itemName: '9% Nickel Alloy Cryogenic Plates (24mm)',
    issueDate: new Date().toISOString().split('T')[0],
    quantityIssued: 12,
    uom: 'MT',
    unitCost: 4500,
    currency: selectedProject.currency,
    warehouseLocation: 'Sohar Central Yard Laydown A',
    issueDocReference: `DN-SOH-2026-${Math.floor(100 + mockRandom() * 900)}`,
    issuedBy: 'Storekeeper Murugan',
    receivedBySiteStaff: 'Lead Welder Arshad Mehmood'
  });

  const [laborForm, setLaborForm] = useState({
    projectId: selectedProject.id,
    activityWbsCode: '1.2.02',
    costCodeNumber: 'CC-LAB-201',
    employeeId: 'EMP-00244',
    employeeName: 'Cryogenic Welding Gang A',
    tradeOrRole: 'High-Pressure TIG Pipe Welders',
    workDate: new Date().toISOString().split('T')[0],
    regularHoursWorked: 120,
    overtimeHoursWorked: 24,
    regularHourlyRate: 14,
    overtimeHourlyRate: 21,
    currency: selectedProject.currency,
    approvedBySiteForeman: 'Eng. Salem Al-Maamari',
    glPostingReference: `JV-LAB-2026-${Math.floor(10 + mockRandom() * 90)}`
  });

  const [equipmentForm, setEquipmentForm] = useState({
    projectId: selectedProject.id,
    activityWbsCode: '1.2.02',
    costCodeNumber: 'CC-EQP-301',
    equipmentAssetId: 'EQ-CRN-250T',
    equipmentName: 'Liebherr LTM 1250-5.1 (250T Mobile Crane)',
    equipmentOwnership: 'INTERNAL_COMPANY_PLANT' as EquipmentCostEntry['equipmentOwnership'],
    usageDate: new Date().toISOString().split('T')[0],
    operatingHours: 8,
    idleHours: 1,
    hourlyOperatingRate: 120,
    hourlyIdleRate: 40,
    fuelAndMaintenanceCharge: 200,
    currency: selectedProject.currency,
    operatorName: 'Certified Crane Master Bipin'
  });

  const handleCreateCostCode = (e: React.FormEvent) => {
    e.preventDefault();
    createCostCode(newCostCodeForm);
    setShowNewCostCodeModal(false);
  };

  const handlePostMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    postMaterialCost(materialForm);
    setShowMaterialModal(false);
  };

  const handlePostLabor = (e: React.FormEvent) => {
    e.preventDefault();
    postLaborCost(laborForm);
    setShowLaborModal(false);
  };

  const handlePostEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    postEquipmentCost(equipmentForm);
    setShowEquipmentModal(false);
  };

  const currentProjectMaterials = materialCosts.filter(m => m.projectId === selectedProject.id);
  const currentProjectLabor = laborCosts.filter(l => l.projectId === selectedProject.id);
  const currentProjectEquipment = equipmentCosts.filter(e => e.projectId === selectedProject.id);

  const totalMatCost = currentProjectMaterials.reduce((sum, m) => sum + m.totalCost, 0);
  const totalLabCost = currentProjectLabor.reduce((sum, l) => sum + l.totalLaborCost, 0);
  const totalEqpCost = currentProjectEquipment.reduce((sum, e) => sum + e.totalCost, 0);

  return (
    <div id="project-costing-module" className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl text-slate-900 dark:text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-widest text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                10.03 — Project Costing & Job Ledger
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                {selectedProject.projectCode}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Direct Material Issue, Labor Timesheets & Equipment Plant Log
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'COST_CODES' && (
            <button
              onClick={() => setShowNewCostCodeModal(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Cost Code</span>
            </button>
          )}
          {activeTab === 'MATERIAL_COST' && (
            <button
              onClick={() => setShowMaterialModal(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Material Issue</span>
            </button>
          )}
          {activeTab === 'LABOR_COST' && (
            <button
              onClick={() => setShowLaborModal(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book Labor Timesheet</span>
            </button>
          )}
          {activeTab === 'EQUIPMENT_COST' && (
            <button
              onClick={() => setShowEquipmentModal(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Equipment Log</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">Direct Materials Incurred</span>
          <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-1">
            {selectedProject.currency} {totalMatCost.toLocaleString()}
          </p>
          <span className="text-[11px] text-purple-600 dark:text-purple-400">{currentProjectMaterials.length} Issues Posted</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">Direct Site Labor Cost</span>
          <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-1">
            {selectedProject.currency} {totalLabCost.toLocaleString()}
          </p>
          <span className="text-[11px] text-blue-600 dark:text-blue-400">{currentProjectLabor.length} Timesheet Batches</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">Plant & Heavy Equipment</span>
          <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-1">
            {selectedProject.currency} {totalEqpCost.toLocaleString()}
          </p>
          <span className="text-[11px] text-amber-700 dark:text-amber-400">{currentProjectEquipment.length} Plant Logs Charged</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">Total Direct Job Cost</span>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            {selectedProject.currency} {(totalMatCost + totalLabCost + totalEqpCost).toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-600 dark:text-slate-400">Excludes Subcontract Retention</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('MATERIAL_COST')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'MATERIAL_COST'
              ? 'bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Material Issues ({currentProjectMaterials.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('LABOR_COST')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'LABOR_COST'
              ? 'bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Labor Timesheets ({currentProjectLabor.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('EQUIPMENT_COST')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'EQUIPMENT_COST'
              ? 'bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Equipment & Plant Hire ({currentProjectEquipment.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('COST_CODES')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
            activeTab === 'COST_CODES'
              ? 'bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Standard Cost Codes Master ({costCodes.length})</span>
        </button>
      </div>

      {/* TAB 1: MATERIAL ISSUES */}
      {activeTab === 'MATERIAL_COST' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Direct Material Job Issues Log</h2>
            <span className="text-xs text-slate-600 dark:text-slate-400">Charged directly to WBS activities via Store Requisitions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Doc Ref #</th>
                  <th className="py-3 px-4">WBS & Cost Code</th>
                  <th className="py-3 px-4">Item & Specification</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4 text-right">Quantity</th>
                  <th className="py-3 px-4 text-right">Unit Cost</th>
                  <th className="py-3 px-4 text-right">Total Cost</th>
                  <th className="py-3 px-4">Site Receiver</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 font-mono">
                {currentProjectMaterials.map(m => (
                  <tr key={m.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-purple-600 dark:text-purple-400">
                      {m.transactionNumber}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-slate-800 dark:text-slate-200">
                      <div className="font-bold text-slate-900 dark:text-white">{m.activityWbsCode}</div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400">{m.costCodeNumber}</div>
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-medium text-slate-900 dark:text-white">{m.itemName}</div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400">{m.itemCode} | {m.warehouseLocation}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {m.issueDate}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-900 dark:text-white font-bold">
                      {m.quantityIssued} {m.uom}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-700 dark:text-slate-300">
                      {m.currency} {m.unitCost.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right text-emerald-600 dark:text-emerald-400 font-extrabold">
                      {m.currency} {m.totalCost.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-slate-700 dark:text-slate-300">
                      {m.receivedBySiteStaff}
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold">
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: LABOR TIMESHEETS */}
      {activeTab === 'LABOR_COST' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Site Labor Timesheets & Crew Wage Allocation</h2>
            <span className="text-xs text-slate-600 dark:text-slate-400">Verified by Site Foreman & Posted to General Ledger</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Timesheet #</th>
                  <th className="py-3 px-4">Crew / Employee</th>
                  <th className="py-3 px-4">WBS & Trade</th>
                  <th className="py-3 px-4">Work Date</th>
                  <th className="py-3 px-4 text-right">Regular Hrs</th>
                  <th className="py-3 px-4 text-right">OT Hrs</th>
                  <th className="py-3 px-4 text-right">Total Labor Cost</th>
                  <th className="py-3 px-4">Foreman Approval</th>
                  <th className="py-3 px-4">GL Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 font-mono">
                {currentProjectLabor.map(l => (
                  <tr key={l.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-purple-600 dark:text-purple-400">
                      {l.timesheetNumber}
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-semibold text-slate-900 dark:text-white">{l.employeeName}</div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400">{l.employeeId}</div>
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-bold text-slate-900 dark:text-white">{l.activityWbsCode}</div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400">{l.tradeOrRole}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {l.workDate}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-800 dark:text-slate-200">
                      {l.regularHoursWorked}h @ {l.regularHourlyRate}
                    </td>
                    <td className="py-3.5 px-4 text-right text-amber-700 dark:text-amber-400">
                      {l.overtimeHoursWorked}h @ {l.overtimeHourlyRate}
                    </td>
                    <td className="py-3.5 px-4 text-right text-emerald-600 dark:text-emerald-400 font-extrabold">
                      {l.currency} {l.totalLaborCost.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-slate-700 dark:text-slate-300">
                      {l.approvedBySiteForeman}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {l.glPostingReference}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: EQUIPMENT PLANT HIRE */}
      {activeTab === 'EQUIPMENT_COST' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Heavy Plant & Equipment Usage Log</h2>
            <span className="text-xs text-slate-600 dark:text-slate-400">Internal company crane fleet and third-party hired machinery</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Log #</th>
                  <th className="py-3 px-4">Equipment & Asset ID</th>
                  <th className="py-3 px-4">WBS Activity</th>
                  <th className="py-3 px-4">Usage Date</th>
                  <th className="py-3 px-4 text-right">Operating / Idle Hrs</th>
                  <th className="py-3 px-4 text-right">Hourly Rate</th>
                  <th className="py-3 px-4 text-right">Fuel & Maintenance</th>
                  <th className="py-3 px-4 text-right">Total Cost</th>
                  <th className="py-3 px-4">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 font-mono">
                {currentProjectEquipment.map(eq => (
                  <tr key={eq.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-purple-600 dark:text-purple-400">
                      {eq.equipmentLogNumber}
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-semibold text-slate-900 dark:text-white">{eq.equipmentName}</div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400">{eq.equipmentAssetId} | {eq.equipmentOwnership}</div>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-slate-800 dark:text-slate-200">
                      {eq.activityWbsCode}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {eq.usageDate}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-800 dark:text-slate-200">
                      {eq.operatingHours}h Run / {eq.idleHours}h Standby
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-700 dark:text-slate-300">
                      {eq.currency} {eq.hourlyOperatingRate}/h
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-700 dark:text-slate-300">
                      {eq.currency} {eq.fuelAndMaintenanceCharge}
                    </td>
                    <td className="py-3.5 px-4 text-right text-emerald-600 dark:text-emerald-400 font-extrabold">
                      {eq.currency} {eq.totalCost.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-slate-700 dark:text-slate-300">
                      {eq.operatorName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: COST CODES MASTER */}
      {activeTab === 'COST_CODES' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Standardized Cost Breakdown Structure (CBS) Catalog</h2>
            <span className="text-xs text-slate-600 dark:text-slate-400">Standard general ledger integration taxonomy</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {costCodes.map(code => (
              <div key={code.id} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 space-y-2 hover:border-purple-500/40 transition-all text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                    {code.codeNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-mono">
                    GL: {code.glAccountCode}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{code.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">{code.description}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-slate-600 dark:text-slate-400">
                  <span>Category: <strong className="text-slate-900 dark:text-white">{code.category}</strong></span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active in Job Ledger</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: POST MATERIAL */}
      {showMaterialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Post Direct Material Issue to Job</h2>
            <form onSubmit={handlePostMaterial} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold">WBS Activity Code</label>
                  <input
                    type="text"
                    required
                    value={materialForm.activityWbsCode}
                    onChange={(e) => setMaterialForm({ ...materialForm, activityWbsCode: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold">Cost Code</label>
                  <select
                    value={materialForm.costCodeNumber}
                    onChange={(e) => setMaterialForm({ ...materialForm, costCodeNumber: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    {costCodes.filter(c => c.category === 'MATERIAL').map(c => (
                      <option key={c.id} value={c.codeNumber}>{c.codeNumber} — {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-semibold">Item Name & Description</label>
                <input
                  type="text"
                  required
                  value={materialForm.itemName}
                  onChange={(e) => setMaterialForm({ ...materialForm, itemName: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold">Quantity</label>
                  <input
                    type="number"
                    required
                    value={materialForm.quantityIssued}
                    onChange={(e) => setMaterialForm({ ...materialForm, quantityIssued: Number(e.target.value) })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold">UOM</label>
                  <input
                    type="text"
                    value={materialForm.uom}
                    onChange={(e) => setMaterialForm({ ...materialForm, uom: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold">Unit Cost ({selectedProject.currency})</label>
                  <input
                    type="number"
                    value={materialForm.unitCost}
                    onChange={(e) => setMaterialForm({ ...materialForm, unitCost: Number(e.target.value) })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowMaterialModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold cursor-pointer"
                >
                  Post Material Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: POST LABOR */}
      {showLaborModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Book Site Labor Timesheet to Job</h2>
            <form onSubmit={handlePostLabor} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-semibold">Crew / Employee Name</label>
                <input
                  type="text"
                  required
                  value={laborForm.employeeName}
                  onChange={(e) => setLaborForm({ ...laborForm, employeeName: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold">Regular Hours</label>
                  <input
                    type="number"
                    value={laborForm.regularHoursWorked}
                    onChange={(e) => setLaborForm({ ...laborForm, regularHoursWorked: Number(e.target.value) })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold">Overtime Hours</label>
                  <input
                    type="number"
                    value={laborForm.overtimeHoursWorked}
                    onChange={(e) => setLaborForm({ ...laborForm, overtimeHoursWorked: Number(e.target.value) })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLaborModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold cursor-pointer"
                >
                  Post Labor Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: POST EQUIPMENT */}
      {showEquipmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Post Heavy Equipment Usage Log</h2>
            <form onSubmit={handlePostEquipment} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-700 dark:text-slate-300 font-semibold">Plant / Crane Description</label>
                <input
                  type="text"
                  required
                  value={equipmentForm.equipmentName}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, equipmentName: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold">Operating Run Hours</label>
                  <input
                    type="number"
                    value={equipmentForm.operatingHours}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, operatingHours: Number(e.target.value) })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold">Hourly Rate ({selectedProject.currency})</label>
                  <input
                    type="number"
                    value={equipmentForm.hourlyOperatingRate}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, hourlyOperatingRate: Number(e.target.value) })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEquipmentModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold cursor-pointer"
                >
                  Post Equipment Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

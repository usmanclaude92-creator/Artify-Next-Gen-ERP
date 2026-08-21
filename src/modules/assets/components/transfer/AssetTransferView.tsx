// ==========================================
// ARTIFY ERP — MODULE 13: ASSET MANAGEMENT
// 13.03 Asset Assignment, Transfer, Location & Custodians
// ==========================================

import React, { useState } from 'react';
import { useAssetStore } from '../../services/assetStore';
import {
  Repeat,
  UserCheck,
  MapPin,
  Users,
  Plus,
  Search,
  ArrowRight,
  Shield,
  CheckCircle,
  FileText,
  Building,
  Navigation,
  Smartphone,
  ExternalLink,
  Printer
} from 'lucide-react';

export const AssetTransferView: React.FC = () => {
  const {
    assets,
    assignments,
    transfers,
    custodians,
    currency,
    assignAsset,
    createTransferOrder
  } = useAssetStore();

  const [activeTab, setActiveTab] = useState<'assignments' | 'transfers' | 'locations' | 'custodians'>('assignments');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Assignment Form State
  const [assignForm, setAssignForm] = useState({
    assetId: assets[0]?.id || '',
    employeeId: 'emp-101',
    employeeName: 'Tariq Al-Balushi',
    employeeDepartment: 'Heavy Machinery & Fleet',
    employeeDesignation: 'Senior Equipment Operator',
    conditionAtIssuance: 'EXCELLENT' as any,
    acknowledgementNotes: 'Verified operating manuals and safety pre-trip checklist.'
  });

  // Transfer Form State
  const [trfForm, setTrfForm] = useState({
    assetId: assets[0]?.id || '',
    fromBranch: 'Muscat Logistics Base',
    toBranch: 'Duqm EPC Project Site',
    fromCostCenter: 'CC-OPS-HEAVY',
    toCostCenter: 'CC-PROJ-DUQM',
    fromLocation: 'Muscat Al Rusayl Industrial Yard',
    toLocation: 'Duqm Special Economic Zone Bay 4',
    fromCustodian: 'Tariq Al-Balushi',
    toCustodian: 'Mubarak Al-Saadi',
    transferReason: 'Operational redeployment for Duqm Phase 2 marine works',
    requiresGatePass: true,
    gatePassNumber: `GP-${Math.floor(10000 + Math.random() * 90000)}`
  });

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAsset = assets.find(a => a.id === assignForm.assetId) || assets[0];
    assignAsset({
      assetId: targetAsset.id,
      assetTag: targetAsset.assetTag,
      assetName: targetAsset.name,
      employeeId: assignForm.employeeId,
      employeeName: assignForm.employeeName,
      employeeDepartment: assignForm.employeeDepartment,
      employeeDesignation: assignForm.employeeDesignation,
      assignedDate: new Date().toISOString().split('T')[0],
      conditionAtIssuance: assignForm.conditionAtIssuance,
      signatureReceived: true,
      status: 'ACTIVE',
      acknowledgementNotes: assignForm.acknowledgementNotes
    });
    setShowAssignModal(false);
  };

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAsset = assets.find(a => a.id === trfForm.assetId) || assets[0];
    createTransferOrder({
      assetId: targetAsset.id,
      assetTag: targetAsset.assetTag,
      assetName: targetAsset.name,
      fromBranch: trfForm.fromBranch,
      toBranch: trfForm.toBranch,
      fromCostCenter: trfForm.fromCostCenter,
      toCostCenter: trfForm.toCostCenter,
      fromLocation: trfForm.fromLocation,
      toLocation: trfForm.toLocation,
      fromCustodian: trfForm.fromCustodian,
      toCustodian: trfForm.toCustodian,
      requestDate: new Date().toISOString().split('T')[0],
      effectiveDate: new Date().toISOString().split('T')[0],
      transferReason: trfForm.transferReason,
      requiresGatePass: trfForm.requiresGatePass,
      gatePassNumber: trfForm.gatePassNumber,
      status: 'APPROVED',
      approvedBy: 'Operations & Asset Controller'
    });
    setShowTransferModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Sub-Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-950 text-amber-400 border border-amber-800">
                13.03
              </span>
              <h2 className="text-xl font-black text-white">Asset Assignment, Transfer & Custodianship</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Employee equipment issuance, inter-site relocation orders, gate pass generation, and staff exit clearances.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAssignModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>Issue Asset</span>
            </button>

            <button
              onClick={() => setShowTransferModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
            >
              <Repeat className="w-4 h-4" />
              <span>Inter-Site Transfer</span>
            </button>
          </div>
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('assignments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'assignments'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Custody Assignments ({assignments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('transfers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'transfers'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Repeat className="w-4 h-4" />
            <span>Inter-Branch Transfers ({transfers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('locations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'locations'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Physical Location & GPS Map</span>
          </button>

          <button
            onClick={() => setActiveTab('custodians')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'custodians'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Custodian Directory & Clearance</span>
          </button>
        </div>
      </div>

      {/* VIEW: ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Employee Asset Issuance & Custodianship Log</h3>
              <p className="text-xs text-slate-400">Formal sign-off for enterprise machinery, IT laptops, and fleet vehicles.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Assignment #</th>
                  <th className="py-3 px-4">Asset Tag & Description</th>
                  <th className="py-3 px-4">Assigned Custodian</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Issued Date</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4 text-center">Digital Signature</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {assignments.map(asg => (
                  <tr key={asg.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{asg.assignmentNumber}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{asg.assetName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{asg.assetTag}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-white">{asg.employeeName}</div>
                      <div className="text-[10px] text-slate-500">{asg.employeeDesignation}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{asg.employeeDepartment}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{asg.assignedDate}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {asg.conditionAtIssuance}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        <CheckCircle className="w-3 h-3" /> VERIFIED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: TRANSFERS */}
      {activeTab === 'transfers' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Inter-Branch Asset Relocation Orders</h3>
              <p className="text-xs text-slate-400">Automated GL cost center transfer, asset relocation gate pass, and transport tracking.</p>
            </div>
          </div>

          <div className="space-y-4">
            {transfers.map(trf => (
              <div key={trf.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950 px-2.5 py-1 rounded border border-amber-800">
                      {trf.transferOrderNumber}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{trf.assetName}</h4>
                      <span className="font-mono text-xs text-slate-500">{trf.assetTag}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {trf.status}
                    </span>
                    <button
                      onClick={() => alert(`Printing Official Security Gate Pass #${trf.gatePassNumber} for vehicle release...`)}
                      className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold border border-slate-700 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                      <span>Gate Pass ({trf.gatePassNumber})</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Origin */}
                  <div className="bg-slate-900/80 p-3.5 rounded-xl space-y-1.5 border border-slate-800">
                    <div className="text-slate-500 font-semibold uppercase text-[10px]">ORIGIN (FROM)</div>
                    <div className="font-bold text-white">{trf.fromBranch}</div>
                    <div className="text-slate-400">Cost Center: <span className="font-mono text-slate-300">{trf.fromCostCenter}</span></div>
                    <div className="text-slate-400">Custodian: <span className="text-slate-300">{trf.fromCustodian}</span></div>
                  </div>

                  {/* Destination */}
                  <div className="bg-slate-900/80 p-3.5 rounded-xl space-y-1.5 border border-slate-800">
                    <div className="text-emerald-400 font-semibold uppercase text-[10px]">DESTINATION (TO)</div>
                    <div className="font-bold text-white">{trf.toBranch}</div>
                    <div className="text-slate-400">Cost Center: <span className="font-mono text-slate-300">{trf.toCostCenter}</span></div>
                    <div className="text-slate-400">Receiving Custodian: <span className="text-slate-300">{trf.toCustodian}</span></div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Reason: {trf.transferReason}</span>
                  <span className="font-mono text-cyan-400">GL Journal: {trf.glReallocationJournalId}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: LOCATIONS & GPS */}
      {activeTab === 'locations' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">Physical Location & Telematics Coordinates</h3>
            <p className="text-xs text-slate-400">Live operational positioning of plant machinery, fleet trucks, and corporate facilities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assets.map(asset => (
              <div key={asset.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400">{asset.assetTag}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    {asset.gpsCoordinates ? `${asset.gpsCoordinates.lat.toFixed(2)}°N, ${asset.gpsCoordinates.lng.toFixed(2)}°E` : 'FIXED PREMISES'}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{asset.name}</h4>
                  <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{asset.locationName}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 bg-slate-900 p-2 rounded-lg">
                  Sub-location: <span className="text-slate-300 font-medium">{asset.subLocation || 'Main Facility'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: CUSTODIANS & EXIT CLEARANCE */}
      {activeTab === 'custodians' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">Custodian Directory & Staff Exit Clearance</h3>
            <p className="text-xs text-slate-400">Track assigned asset value per employee and process HR departure handovers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {custodians.map(cust => (
              <div key={cust.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{cust.fullName}</h4>
                    <div className="text-xs text-slate-400">{cust.department} • {cust.branch}</div>
                    <div className="text-xs font-mono text-slate-500">{cust.email}</div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    cust.clearanceStatus === 'CLEARED'
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : 'bg-amber-950 text-amber-400 border-amber-800'
                  }`}>
                    {cust.clearanceStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500">Active Assets: </span>
                    <span className="font-bold text-white">{cust.activeAssetsCount} Items</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Total Value: </span>
                    <span className="font-bold font-mono text-emerald-400">{currency} {cust.totalAssetsValue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN ASSET */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-black text-white">Assign Asset Custodianship</h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Asset *</label>
                <select
                  value={assignForm.assetId}
                  onChange={e => setAssignForm({ ...assignForm, assetId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>{a.assetTag} — {a.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Employee Name *</label>
                  <input
                    type="text"
                    required
                    value={assignForm.employeeName}
                    onChange={e => setAssignForm({ ...assignForm, employeeName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Department</label>
                  <input
                    type="text"
                    value={assignForm.employeeDepartment}
                    onChange={e => setAssignForm({ ...assignForm, employeeDepartment: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Handover & Acknowledgement Notes</label>
                <textarea
                  rows={3}
                  value={assignForm.acknowledgementNotes}
                  onChange={e => setAssignForm({ ...assignForm, acknowledgementNotes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  Confirm Digital Issuance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INTER-SITE TRANSFER */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-black text-white">Create Inter-Site Transfer Order</h3>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTransfer} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Asset To Relocate *</label>
                <select
                  value={trfForm.assetId}
                  onChange={e => setTrfForm({ ...trfForm, assetId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>{a.assetTag} — {a.name} ({a.branch})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Destination Branch *</label>
                  <input
                    type="text"
                    required
                    value={trfForm.toBranch}
                    onChange={e => setTrfForm({ ...trfForm, toBranch: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Destination Cost Center *</label>
                  <input
                    type="text"
                    required
                    value={trfForm.toCostCenter}
                    onChange={e => setTrfForm({ ...trfForm, toCostCenter: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Transfer Reason / Project Justification</label>
                <textarea
                  rows={2}
                  value={trfForm.transferReason}
                  onChange={e => setTrfForm({ ...trfForm, transferReason: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  Approve & Issue Gate Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

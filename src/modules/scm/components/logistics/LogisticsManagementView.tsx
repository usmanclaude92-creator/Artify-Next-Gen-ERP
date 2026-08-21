// ==========================================
// ARTIFY ERP — MODULE 12: SUPPLY CHAIN MANAGEMENT (SCM)
// 12.04 — Logistics Management View
// ==========================================

import React, { useState } from 'react';
import { useScmStore } from '../../services/scmStore';
import { FreightShipment, TransportMode, ShipmentTransitStatus } from '../../types';
import {
  Navigation,
  Truck,
  Ship,
  Plane,
  Anchor,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  Eye,
  FileText,
  Compass,
  Thermometer,
  Shield,
  ArrowRight,
  ExternalLink,
  RotateCcw
} from 'lucide-react';

export const LogisticsManagementView: React.FC = () => {
  const {
    freightShipments,
    transportTrips,
    selectedShipment,
    createFreightShipment,
    updateShipmentStatus,
    selectShipment,
    currency
  } = useScmStore();

  const [activeSubTab, setActiveSubTab] = useState<'tracking' | 'planning' | 'transport'>('tracking');
  const [showNewShipmentModal, setShowNewShipmentModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modeFilter, setModeFilter] = useState<string>('ALL');

  // New Shipment Form State
  const [newShipmentForm, setNewShipmentForm] = useState({
    bookingRef: 'BKG-MAE-992144',
    mode: 'Ocean Freight (FCL)' as TransportMode,
    carrierName: 'Maersk Line A/S',
    vesselOrFlightNumber: 'Maersk Gibraltar (Voy 2609E)',
    billOfLadingOrAwb: 'MAEU99214488',
    originPort: 'Rotterdam (NLRTM)',
    originCountry: 'Netherlands',
    destinationPort: 'Sohar Port (OMSOH)',
    destinationHub: 'Sohar Industrial Hub RDC',
    containerCount: 2,
    containerNumbers: ['MSKU-440192', 'MSKU-440193'],
    totalWeightKg: 28400,
    totalVolumeCbm: 114.0,
    departureDate: '2026-08-25',
    estimatedArrivalDate: '2026-09-18',
    status: 'Booked' as ShipmentTransitStatus,
    currentLocationName: 'Rotterdam Terminal Gate 3',
    gpsCoordinates: { lat: 51.924, lng: 4.477 },
    demurrageFreeDaysRemaining: 14,
    delayRisk: 'None' as FreightShipment['delayRisk'],
    cargoValue: 380000,
    freightCost: 11500,
    currency: 'OMR'
  });

  const filteredShipments = freightShipments.filter(shp => {
    const matchSearch =
      shp.shipmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shp.carrierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shp.billOfLadingOrAwb.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shp.destinationPort.toLowerCase().includes(searchTerm.toLowerCase());
    const matchMode = modeFilter === 'ALL' || shp.mode.includes(modeFilter);
    return matchSearch && matchMode;
  });

  const activeShipment = selectedShipment || freightShipments[0];

  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();
    const created = createFreightShipment(newShipmentForm);
    setShowNewShipmentModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-sky-950 text-sky-400 border border-sky-800 tracking-wider">
                12.04 LOGISTICS MANAGEMENT
              </span>
              <span className="text-xs text-slate-400 font-medium">Multimodal Transport & Telemetry</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight mt-1">
              Global Freight Tracking, Multimodal Routing & Demurrage Control
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Monitor real-time vessel telemetry, manage Bill of Lading airway documentation, track cold-chain sensors, and mitigate port demurrage penalties.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewShipmentModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Book New Freight Shipment</span>
            </button>
          </div>
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveSubTab('tracking')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'tracking'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Live Freight Tracking & GPS (12.04.04)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('planning')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'planning'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Ship className="w-4 h-4" />
            <span>Multimodal Shipments (12.04.01 - 02)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('transport')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'transport'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Fleet & Transport Operations (12.04.03)</span>
          </button>
        </div>
      </div>

      {/* ----------------- SUB-TAB 1: LIVE SHIPMENT TRACKING & GPS ----------------- */}
      {activeSubTab === 'tracking' && activeShipment && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Shipment List */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search shipment, carrier, B/L..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center gap-2">
                {['ALL', 'Ocean', 'Air'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setModeFilter(m)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      modeFilter === m ? 'bg-sky-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {m === 'ALL' ? 'All Modes' : `${m} Freight`}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {filteredShipments.map((shp) => {
                const isSelected = shp.id === activeShipment.id;
                return (
                  <div
                    key={shp.id}
                    onClick={() => selectShipment(shp)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-950/40 border-sky-500 shadow-lg shadow-sky-950/40'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-xs font-black text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/60">
                          {shp.shipmentNumber}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1.5">{shp.carrierName}</h4>
                        <p className="text-xs text-slate-400 font-mono">{shp.vesselOrFlightNumber}</p>
                      </div>

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          shp.status === 'Delivered'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : shp.status === 'In Transit / High Seas'
                            ? 'bg-sky-950 text-sky-400 border border-sky-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {shp.status}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Route</span>
                        <p className="text-slate-300 font-sans truncate">{shp.originPort.split(' ')[0]} → {shp.destinationPort.split(' ')[0]}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">ETA Arrival</span>
                        <p className="text-emerald-400 font-bold">{shp.estimatedArrivalDate}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 2-Columns: Detailed Interactive Milestone Telemetry & Simulated GPS */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Detail Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950 px-2.5 py-0.5 rounded border border-sky-800">
                      {activeShipment.mode}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">B/L: {activeShipment.billOfLadingOrAwb}</span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-1">
                    {activeShipment.shipmentNumber} — {activeShipment.carrierName}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    Current Telemetry: <span className="text-slate-200 font-medium">{activeShipment.currentLocationName}</span>
                    <span className="font-mono text-slate-500 text-[11px]">
                      ({activeShipment.gpsCoordinates.lat}°N, {activeShipment.gpsCoordinates.lng}°E)
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Demurrage Free Time</span>
                    <p className="text-sm font-mono font-black text-amber-400">
                      {activeShipment.demurrageFreeDaysRemaining} Days Left
                    </p>
                  </div>
                </div>
              </div>

              {/* Simulated Map Visual Header */}
              <div className="h-44 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center p-4">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Route Line */}
                <div className="relative z-10 w-full max-w-lg flex items-center justify-between">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-sky-500 flex items-center justify-center text-sky-400 mx-auto">
                      <Anchor className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 mt-1 block">{activeShipment.originPort}</span>
                    <span className="text-[10px] font-mono text-slate-500">{activeShipment.departureDate}</span>
                  </div>

                  <div className="flex-1 mx-4 flex flex-col items-center">
                    <span className="text-[10px] font-mono font-bold text-sky-400 mb-1 animate-pulse">
                      {activeShipment.status}
                    </span>
                    <div className="w-full h-1 bg-slate-800 rounded-full relative">
                      <div className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 w-3/5 rounded-full" />
                      <div className="absolute top-1/2 left-3/5 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-sky-400 ring-4 ring-sky-500/30" />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">{activeShipment.vesselOrFlightNumber}</span>
                  </div>

                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 mt-1 block">{activeShipment.destinationPort}</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">ETA: {activeShipment.estimatedArrivalDate}</span>
                  </div>
                </div>
              </div>

              {/* Milestones Stepper */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Transit Progression & Port Gate Milestones
                </h4>

                <div className="space-y-3">
                  {activeShipment.milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                        m.isCompleted
                          ? 'bg-slate-950/80 border-emerald-900/60 text-slate-200'
                          : 'bg-slate-950/30 border-slate-800/80 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            m.isCompleted
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div>
                          <span className="font-bold text-white block">{m.stage}</span>
                          <span className="text-slate-400 text-[11px]">{m.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 font-mono">
                        <span>{m.timestamp}</span>
                        {m.isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <button
                            onClick={() => updateShipmentStatus(activeShipment.id, m.stage)}
                            className="px-2.5 py-1 bg-sky-600/20 hover:bg-sky-600/40 text-sky-400 border border-sky-500/40 rounded-lg text-[10px] font-bold cursor-pointer"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cargo & Container Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Containers</span>
                  <p className="font-bold text-cyan-400 mt-0.5">{activeShipment.containerCount} Units</p>
                  <p className="text-[10px] text-slate-400 font-sans truncate">{activeShipment.containerNumbers.join(', ')}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Payload Weight</span>
                  <p className="font-bold text-white mt-0.5">{(activeShipment.totalWeightKg / 1000).toFixed(1)} MT</p>
                  <p className="text-[10px] text-slate-400 font-sans">{activeShipment.totalVolumeCbm} CBM</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Cargo CIF Value</span>
                  <p className="font-bold text-emerald-400 mt-0.5">
                    {activeShipment.cargoValue.toLocaleString()} {activeShipment.currency}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Freight Expense</span>
                  <p className="font-bold text-white mt-0.5">
                    {activeShipment.freightCost.toLocaleString()} {activeShipment.currency}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 2: MULTIMODAL SHIPMENT PLANNING ----------------- */}
      {activeSubTab === 'planning' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Ship className="w-4 h-4 text-sky-400" />
                <span>Active Multimodal Freight Contracts & Packing Registers</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">{freightShipments.length} Active Shipments</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800 text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Shipment / Carrier</th>
                    <th className="py-3 px-4">Mode</th>
                    <th className="py-3 px-4">Bill of Lading / AWB</th>
                    <th className="py-3 px-4">Origin → Destination</th>
                    <th className="py-3 px-4 text-center">Containers</th>
                    <th className="py-3 px-4 text-right">Cargo Value</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {freightShipments.map((shp) => (
                    <tr key={shp.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-sans">
                        <span className="font-mono font-bold text-sky-400 block">{shp.shipmentNumber}</span>
                        <span className="text-slate-300 text-xs">{shp.carrierName}</span>
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-bold">
                          {shp.mode}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-bold">{shp.billOfLadingOrAwb}</td>
                      <td className="py-3 px-4 font-sans text-slate-400">
                        {shp.originPort.split(' ')[0]} → <span className="text-white font-bold">{shp.destinationPort.split(' ')[0]}</span>
                      </td>
                      <td className="py-3 px-4 text-center text-cyan-400 font-bold">
                        {shp.containerCount} x FCL
                      </td>
                      <td className="py-3 px-4 text-right text-emerald-400 font-bold">
                        {shp.cargoValue.toLocaleString()} {shp.currency}
                      </td>
                      <td className="py-3 px-4 text-center font-sans">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            shp.status === 'Delivered'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-sky-950 text-sky-400 border border-sky-800'
                          }`}
                        >
                          {shp.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-sans">
                        <button
                          onClick={() => {
                            selectShipment(shp);
                            setActiveSubTab('tracking');
                          }}
                          className="px-3 py-1 bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/40 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          Track Telemetry
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 3: FLEET & TRANSPORT OPERATIONS ----------------- */}
      {activeSubTab === 'transport' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transportTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/60 px-2.5 py-0.5 rounded border border-sky-800/60">
                      {trip.tripCode}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">{trip.origin} → {trip.destination}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Vehicle: {trip.vehiclePlate} ({trip.vehicleType})</p>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-sky-950 text-sky-400 border border-sky-800">
                    {trip.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Driver Assigned</span>
                    <p className="font-bold text-white mt-0.5 truncate">{trip.driverName}</p>
                    <p className="text-[10px] text-slate-400">{trip.driverPhone}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Capacity Load</span>
                    <p className="font-bold text-cyan-400 mt-0.5">{trip.capacityUtilizationPercent}% FTL</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">Fuel Est.</span>
                    <p className="font-bold text-emerald-400 mt-0.5">{trip.fuelCostEst} OMR</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-mono text-slate-400">
                  <span>Departure: {trip.departureTime}</span>
                  <span className="text-emerald-400 font-bold">Est Delivery: {trip.estimatedDeliveryTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- MODAL: BOOK NEW FREIGHT SHIPMENT ----------------- */}
      {showNewShipmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Ship className="w-5 h-5 text-sky-400" />
                <span>Book New Multimodal Freight Shipment</span>
              </h3>
              <button
                onClick={() => setShowNewShipmentModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleCreateShipment} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Carrier Name</label>
                  <input
                    type="text"
                    required
                    value={newShipmentForm.carrierName}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, carrierName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Transport Mode</label>
                  <select
                    value={newShipmentForm.mode}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, mode: e.target.value as TransportMode })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Ocean Freight (FCL)">Ocean Freight (FCL)</option>
                    <option value="Ocean Freight (LCL)">Ocean Freight (LCL)</option>
                    <option value="Air Cargo">Air Cargo</option>
                    <option value="Road Cross-Border">Road Cross-Border</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Vessel / Flight / Truck Reg</label>
                  <input
                    type="text"
                    required
                    value={newShipmentForm.vesselOrFlightNumber}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, vesselOrFlightNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Bill of Lading / AWB</label>
                  <input
                    type="text"
                    required
                    value={newShipmentForm.billOfLadingOrAwb}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, billOfLadingOrAwb: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Origin Port</label>
                  <input
                    type="text"
                    required
                    value={newShipmentForm.originPort}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, originPort: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Destination Port / Hub</label>
                  <input
                    type="text"
                    required
                    value={newShipmentForm.destinationPort}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, destinationPort: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Containers</label>
                  <input
                    type="number"
                    value={newShipmentForm.containerCount}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, containerCount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Cargo Value (OMR)</label>
                  <input
                    type="number"
                    value={newShipmentForm.cargoValue}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, cargoValue: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Freight Fee (OMR)</label>
                  <input
                    type="number"
                    value={newShipmentForm.freightCost}
                    onChange={(e) => setNewShipmentForm({ ...newShipmentForm, freightCost: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewShipmentModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold shadow-lg shadow-sky-600/30"
                >
                  Create & Dispatch Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

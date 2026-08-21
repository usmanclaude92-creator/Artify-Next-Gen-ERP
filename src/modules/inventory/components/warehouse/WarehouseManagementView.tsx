import React, { useState } from 'react';
import { useInventoryStore } from '../../services/inventoryStore';
import { Warehouse, BinLocation, WarehouseZone, WarehouseType, WarehouseZoneType } from '../../types';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Layers,
  MapPin,
  Flame,
  Snowflake,
  ShieldCheck,
  Package,
  Activity,
  Maximize2,
  Box,
  Truck,
  Phone,
  Mail,
  User
} from 'lucide-react';

interface WarehouseManagementViewProps {
  initialTab?: 'warehouses' | 'bins' | 'zones' | 'capacity';
  onNavigate?: (route: any) => void;
}

export const WarehouseManagementView: React.FC<WarehouseManagementViewProps> = ({
  initialTab = 'warehouses',
  onNavigate
}) => {
  const { warehouses, binLocations, createWarehouse, createBinLocation } = useInventoryStore();

  const [activeTab, setActiveTab] = useState<'warehouses' | 'bins' | 'zones' | 'capacity'>(initialTab);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>(warehouses[0]?.id || '');
  const [selectedBin, setSelectedBin] = useState<BinLocation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddWhModalOpen, setIsAddWhModalOpen] = useState(false);
  const [isAddBinModalOpen, setIsAddBinModalOpen] = useState(false);

  const currentWh = warehouses.find((w) => w.id === selectedWarehouseId) || warehouses[0];

  const filteredBins = binLocations.filter((b) => {
    const matchesWh = b.warehouseId === selectedWarehouseId;
    const matchesSearch =
      b.binCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.zoneCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.barcode.includes(searchTerm);
    return matchesWh && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-indigo-950/60 text-indigo-400 border border-indigo-800/40">
              07.02
            </span>
            <h2 className="text-xl font-bold text-white">Warehouse Management & Topography</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Physical distribution hubs, 3D bin coordinates, temperature zones, and volumetric capacities
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('warehouses')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'warehouses'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Warehouses ({warehouses.length})
            </button>
            <button
              onClick={() => setActiveTab('bins')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'bins'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bin Topography ({binLocations.length})
            </button>
            <button
              onClick={() => setActiveTab('zones')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'zones'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Storage Zones
            </button>
            <button
              onClick={() => setActiveTab('capacity')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'capacity'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Capacity Heatmap
            </button>
          </div>

          <button
            onClick={() => setIsAddWhModalOpen(true)}
            className="px-3.5 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Facility</span>
          </button>
        </div>
      </div>

      {/* TAB 1: WAREHOUSES MASTER OVERVIEW */}
      {activeTab === 'warehouses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {warehouses.map((wh) => (
            <div
              key={wh.id}
              className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-950/50 border border-indigo-800/50">
                    {wh.code}
                  </span>
                  <h3 className="mt-1 text-base font-bold text-white">{wh.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{wh.location}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white bg-slate-800 border border-slate-700">
                  {wh.type.replace('_', ' ')}
                </span>
              </div>

              {/* Progress & Utilization */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Pallet Slot Utilization:</span>
                  <span className="font-bold text-white font-mono">{wh.utilizationPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${
                      wh.utilizationPercent > 80 ? 'bg-amber-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${wh.utilizationPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>{wh.occupiedPalletPositions.toLocaleString()} Occupied</span>
                  <span>{wh.totalPalletPositions.toLocaleString()} Total Slots</span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                <div className="bg-slate-800/40 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Floor Footprint</span>
                  <span className="font-bold text-slate-200 font-mono">{wh.totalFloorAreaSqm.toLocaleString()} m²</span>
                </div>
                <div className="bg-slate-800/40 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Storage Volume</span>
                  <span className="font-bold text-slate-200 font-mono">{wh.totalStorageCapacityCbm.toLocaleString()} m³</span>
                </div>
              </div>

              {/* Manager & Contact */}
              <div className="pt-2 border-t border-slate-800 space-y-1 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{wh.managerName}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-500" />
                    {wh.managerPhone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-500" />
                    {wh.managerEmail}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">GL: {wh.glLocationCode}</span>
                <button
                  onClick={() => {
                    setSelectedWarehouseId(wh.id);
                    setActiveTab('bins');
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  View Bins Topography →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: BIN LOCATIONS & INTERACTIVE TOPOGRAPHY */}
      {activeTab === 'bins' && (
        <div className="space-y-4">
          {/* Warehouse Switcher & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-slate-300">Active Warehouse:</label>
              <select
                value={selectedWarehouseId}
                onChange={(e) => setSelectedWarehouseId(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
              >
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>{w.code} — {w.name}</option>
                ))}
              </select>
            </div>

            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter by bin coordinate, zone, barcode, or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Bin Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBins.map((bin) => (
              <div
                key={bin.id}
                onClick={() => setSelectedBin(bin)}
                className={`bg-slate-900/70 border rounded-xl p-4 cursor-pointer transition-all shadow-sm space-y-3 ${
                  bin.isQuarantine
                    ? 'border-rose-800/60 bg-rose-950/10'
                    : 'border-slate-800 hover:border-indigo-500/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">{bin.zoneCode}</span>
                    <h4 className="text-sm font-bold font-mono text-cyan-400 mt-0.5">{bin.binCode}</h4>
                    <span className="text-[10px] text-slate-400">
                      Aisle {bin.aisle} • Rack {bin.rack} • Shelf {bin.shelf}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-200 border border-slate-700">
                      {bin.occupancyPercent}% Occ
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono mt-1">{bin.barcode}</span>
                  </div>
                </div>

                {/* Stored Items Preview */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Stored Material</span>
                  {bin.storedItems.length === 0 ? (
                    <span className="text-xs text-slate-500 italic block">Empty bin location</span>
                  ) : (
                    bin.storedItems.map((item, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-800/50 border border-slate-700/60 text-xs">
                        <div className="font-semibold text-white truncate">{item.itemName}</div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5 font-mono">
                          <span>{item.sku}</span>
                          <span className="text-emerald-400 font-bold">{item.quantity} {item.uom}</span>
                        </div>
                        {item.batchNumber && (
                          <span className="text-[10px] text-indigo-400 font-mono">Lot: {item.batchNumber}</span>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Capacity Meters */}
                <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-mono">
                  <div>Weight: {bin.currentWeightKg} / {bin.maxWeightKg} kg</div>
                  <div className="text-right">Vol: {bin.currentVolumeCbm} / {bin.maxVolumeCbm} m³</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WAREHOUSE ZONES */}
      {activeTab === 'zones' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-slate-300">Select Warehouse:</label>
              <select
                value={selectedWarehouseId}
                onChange={(e) => setSelectedWarehouseId(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200"
              >
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
            <span className="text-xs text-slate-400">{currentWh?.zones.length || 0} Configured Storage Zones</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentWh?.zones.map((zone) => (
              <div
                key={zone.id}
                className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                      {zone.zoneType === 'COLD_STORAGE' ? (
                        <Snowflake className="w-5 h-5 text-sky-400" />
                      ) : zone.zoneType === 'HAZMAT_BUNKER' ? (
                        <Flame className="w-5 h-5 text-amber-400" />
                      ) : zone.zoneType === 'QUARANTINE_QC' ? (
                        <ShieldCheck className="w-5 h-5 text-rose-400" />
                      ) : (
                        <Layers className="w-5 h-5 text-indigo-400" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-indigo-400">{zone.code}</span>
                      <h4 className="text-sm font-bold text-white">{zone.name}</h4>
                      <span className="text-xs text-slate-400">{zone.zoneType.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                    {Math.round((zone.occupiedBins / zone.totalBins) * 100)}% Bins Occ
                  </span>
                </div>

                {zone.temperatureRangeCelsius && (
                  <div className="p-2 rounded bg-sky-950/30 border border-sky-800/40 text-xs text-sky-300 flex items-center gap-2">
                    <Snowflake className="w-4 h-4" />
                    <span>Regulated Temperature: {zone.temperatureRangeCelsius}</span>
                  </div>
                )}

                {zone.isHazMatCertified && (
                  <div className="p-2 rounded bg-amber-950/30 border border-amber-800/40 text-xs text-amber-300 flex items-center gap-2">
                    <Flame className="w-4 h-4" />
                    <span>ROP HazMat Certified Chemical Storage Bunker</span>
                  </div>
                )}

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Bin Occupancy:</span>
                    <span className="font-mono text-white font-semibold">{zone.occupiedBins} / {zone.totalBins} Bins</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full"
                      style={{ width: `${(zone.occupiedBins / zone.totalBins) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CAPACITY HEATMAP */}
      {activeTab === 'capacity' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Live Multi-Site Volumetric & Pallet Load Matrix</h3>
              <p className="text-xs text-slate-400">Dynamic capacity monitoring across nationwide logistical infrastructure</p>
            </div>
          </div>

          <div className="space-y-4">
            {warehouses.map((w) => (
              <div key={w.id} className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{w.name} ({w.code})</h4>
                    <span className="text-xs text-slate-400">{w.location}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold font-mono text-white">{w.utilizationPercent}%</span>
                    <span className="block text-[10px] text-slate-400">Pallet Load Ratio</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Pallet Positions</span>
                    <span className="font-bold font-mono text-white">{w.occupiedPalletPositions} / {w.totalPalletPositions}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Volumetric Storage</span>
                    <span className="font-bold font-mono text-white">{w.totalStorageCapacityCbm.toLocaleString()} m³</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Facility Area</span>
                    <span className="font-bold font-mono text-white">{w.totalFloorAreaSqm.toLocaleString()} m²</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

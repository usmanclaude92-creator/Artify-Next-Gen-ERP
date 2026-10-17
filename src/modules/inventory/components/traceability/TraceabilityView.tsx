import React, { useState } from 'react';
import { useInventoryStore } from '../../services/inventoryStore';
import { BatchLot, SerialNumber } from '../../types';
import {
  Search,
  Plus,
  Filter,
  ShieldCheck,
  Award,
  Calendar,
  Clock,
  AlertTriangle,
  QrCode,
  FileText,
  Layers,
  ArrowRight,
  Truck,
  Building2,
  CheckCircle2,
  Lock,
  Boxes
} from 'lucide-react';

interface TraceabilityViewProps {
  initialTab?: 'batches' | 'serials' | 'fefo_expiry' | 'genealogy';
  onNavigate?: (route: any) => void;
}

export const TraceabilityView: React.FC<TraceabilityViewProps> = ({
  initialTab = 'batches',
  onNavigate
}) => {
  const { batches, serials, items, createBatch, createSerial } = useInventoryStore();

  const [activeTab, setActiveTab] = useState<'batches' | 'serials' | 'fefo_expiry' | 'genealogy'>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<BatchLot | null>(null);
  const [selectedSerial, setSelectedSerial] = useState<SerialNumber | null>(null);
  const [genealogyQuery, setGenealogyQuery] = useState('LOT-2026-N201');

  // New Batch Modal State
  const [isNewBatchModalOpen, setIsNewBatchModalOpen] = useState(false);
  const [batchNumber, setBatchNumber] = useState('');
  const [batchSku, setBatchSku] = useState(items[0]?.sku || '');
  const [batchQty, setBatchQty] = useState(50);
  const [heatNumber, setHeatNumber] = useState('HT-774921');
  const [millCert, setMillCert] = useState('MTR-EN10204-3.1-2026');
  const [mfgDate, setMfgDate] = useState('2026-01-15');
  const [expDate, setExpDate] = useState('2028-01-15');

  const filteredBatches = batches.filter((b) => {
    const matchesSearch =
      b.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.heatNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredSerials = serials.filter((s) => {
    const matchesSearch =
      s.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.warrantyNumber ?? s.grnNumber)?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleCreateBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = items.find((i) => i.sku === batchSku) || items[0];
    const bNum = batchNumber || `LOT-${Date.now().toString().slice(-6)}`;

    createBatch({
      batchNumber: bNum,
      itemId: item.id,
      sku: item.sku,
      itemName: item.name,
      quantityOnHand: batchQty,
      quantityReserved: 0,
      quantityAvailable: batchQty,
      manufacturingDate: mfgDate,
      expiryDate: expDate,
      heatNumber,
      millTestCertNumber: millCert,
      qaApprovalStatus: 'PASSED'
    });

    setIsNewBatchModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-800/40">
              07.06
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Traceability & Expiry Management</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Batch lot genealogy, metallurgical test certificates (MTR), serial tracking, and FEFO picking rules
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('batches')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'batches' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Batch Lots ({batches.length})
            </button>
            <button
              onClick={() => setActiveTab('serials')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'serials' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Serial Numbers ({serials.length})
            </button>
            <button
              onClick={() => setActiveTab('fefo_expiry')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'fefo_expiry' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              FEFO Shelf-Life
            </button>
            <button
              onClick={() => setActiveTab('genealogy')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'genealogy' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Interactive Genealogy Tree
            </button>
          </div>

          <button
            onClick={() => setIsNewBatchModalOpen(true)}
            className="px-3.5 py-2 text-xs font-medium bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Batch Lot</span>
          </button>
        </div>
      </div>

      {/* TAB 1: BATCH LOTS & MTR CERTIFICATES */}
      {activeTab === 'batches' && (
        <div className="space-y-4">
          <div className="bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-600 dark:text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Batch Lot #, Heat #, MTR certificate, or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400">{filteredBatches.length} tracked batch lots</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBatches.map((batch) => (
              <div
                key={batch.id}
                onClick={() => setSelectedBatch(batch)}
                className="bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 rounded-xl p-5 shadow-sm cursor-pointer transition-colors space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400 px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-950/50 border border-sky-800/50">
                      {batch.batchNumber}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white mt-1.5 truncate max-w-[200px]">{batch.itemName}</h4>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono">{batch.sku}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-800/40">
                    QA {batch.qaApprovalStatus}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <div className="bg-slate-100/70 dark:bg-slate-800/50 p-2 rounded">
                    <span className="text-slate-600 dark:text-slate-400 text-[10px] block">On Hand</span>
                    <span className="font-bold text-slate-900 dark:text-white">{batch.quantityOnHand}</span>
                  </div>
                  <div className="bg-slate-100/70 dark:bg-slate-800/50 p-2 rounded">
                    <span className="text-slate-600 dark:text-slate-400 text-[10px] block">Reserved</span>
                    <span className="font-bold text-amber-700 dark:text-amber-400">{batch.quantityReserved}</span>
                  </div>
                  <div className="bg-slate-100/70 dark:bg-slate-800/50 p-2 rounded">
                    <span className="text-slate-600 dark:text-slate-400 text-[10px] block">Available</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{batch.quantityAvailable}</span>
                  </div>
                </div>

                {/* Heat & Mill Cert */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1 text-xs text-slate-700 dark:text-slate-300 font-mono">
                  {batch.heatNumber && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Heat Cast #:</span>
                      <span className="text-slate-800 dark:text-slate-200">{batch.heatNumber}</span>
                    </div>
                  )}
                  {batch.millTestCertNumber && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Mill Test Cert (MTR):</span>
                      <span className="text-cyan-600 dark:text-cyan-400">{batch.millTestCertNumber}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                  <span>Mfg: {batch.manufacturingDate}</span>
                  <span>Exp: {batch.expiryDate || 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SERIAL NUMBERS & LIFECYCLE */}
      {activeTab === 'serials' && (
        <div className="space-y-4">
          <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-100/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Serial Number</th>
                    <th className="py-3 px-3">Material SKU & Name</th>
                    <th className="py-3 px-3">Current Location</th>
                    <th className="py-3 px-3">Lifecycle Status</th>
                    <th className="py-3 px-3">Warranty Expiration</th>
                    <th className="py-3 px-3">Warranty Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                  {filteredSerials.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">
                        {s.serialNumber}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-900 dark:text-white">{s.itemName}</span>
                        <div className="text-[10px] text-slate-600 dark:text-slate-400 font-mono">{s.sku}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-mono">
                        {s.currentWarehouseName || 'Dispatched To Client'}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">{s.warrantyExpiryDate || '—'}</td>
                      <td className="py-3 px-3 font-mono text-cyan-600 dark:text-cyan-400">{s.warrantyNumber || s.grnNumber || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FEFO SHELF-LIFE COUNTDOWNS */}
      {activeTab === 'fefo_expiry' && (
        <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">First-Expired-First-Out (FEFO) Dispatch Matrix</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Batches ordered strictly by nearest expiration date for priority picking</p>
            </div>
          </div>

          <div className="space-y-3">
            {batches
              .filter((b) => b.expiryDate)
              .map((b) => (
                <div key={b.id} className="p-3.5 bg-slate-100/70 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">{b.batchNumber}</span>
                        <span className="text-xs text-slate-700 dark:text-slate-300">— {b.itemName}</span>
                      </div>
                      <span className="text-[10px] text-slate-600 dark:text-slate-400">Manufacturing Date: {b.manufacturingDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 block">{b.quantityOnHand} Units Available</span>
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono">Expires: {b.expiryDate}</span>
                    </div>
                    <span className="px-2 py-1 rounded text-[10px] font-semibold bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                      Priority 1 Pick
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 4: INTERACTIVE UNIVERSAL GENEALOGY TREE */}
      {activeTab === 'genealogy' && (
        <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Universal Material Traceability Genealogy Tree</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">End-to-end provenance: Supplier Casting → Port Clearance → Warehouse Bin → Project Dispatch</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={genealogyQuery}
                onChange={(e) => setGenealogyQuery(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white font-mono"
                placeholder="Enter Lot # or Serial #"
              />
              <button className="px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-medium">
                Trace Path
              </button>
            </div>
          </div>

          {/* Flow Diagram */}
          <div className="p-6 bg-slate-50/60 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Step 1: Supplier Origin */}
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex-1 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto">
                  <Building2 className="w-4 h-4" />
                </div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">1. Supplier Foundry</h5>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Nippon Steel Corp (Japan)</p>
                <div className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">Heat: HT-774921</div>
                <div className="text-[9px] text-emerald-600 dark:text-emerald-400">MTR 3.1 Certified</div>
              </div>

              <ArrowRight className="w-5 h-5 text-slate-500 dark:text-slate-400 hidden md:block" />

              {/* Step 2: Port & QC Inspection */}
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex-1 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">2. Port Clearance & QC</h5>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Sohar Port Freezone</p>
                <div className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">GRN-2026-00481</div>
                <div className="text-[9px] text-emerald-600 dark:text-emerald-400">QA Inspection Passed</div>
              </div>

              <ArrowRight className="w-5 h-5 text-slate-500 dark:text-slate-400 hidden md:block" />

              {/* Step 3: Central Warehouse Hub */}
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex-1 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <Boxes className="w-4 h-4" />
                </div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">3. Storage Topography</h5>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Rusayl Central Hub</p>
                <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Bin: RUS-A01-R02-S03</div>
                <div className="text-[9px] text-slate-700 dark:text-slate-300">50 Units in Prime Stock</div>
              </div>

              <ArrowRight className="w-5 h-5 text-slate-500 dark:text-slate-400 hidden md:block" />

              {/* Step 4: Dispatch / Project */}
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex-1 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto">
                  <Truck className="w-4 h-4" />
                </div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white">4. Project Allocation</h5>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">PDO Harweel Phase 3</p>
                <div className="text-[10px] font-mono text-amber-700 dark:text-amber-400">RES-2026-00104</div>
                <div className="text-[9px] text-amber-800 dark:text-amber-300">Allocated for Site Dispatch</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW BATCH MODAL */}
      {isNewBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  <Boxes className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Register Inward Batch Lot & MTR</h3>
              </div>
              <button onClick={() => setIsNewBatchModalOpen(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateBatchSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Batch / Lot Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LOT-2026-N202"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Material SKU</label>
                  <select
                    value={batchSku}
                    onChange={(e) => setBatchSku(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                  >
                    {items.map((i) => (
                      <option key={i.id} value={i.sku}>{i.sku} — {i.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Supplier Heat / Cast #</label>
                  <input
                    type="text"
                    value={heatNumber}
                    onChange={(e) => setHeatNumber(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Mill Test Cert (MTR) #</label>
                  <input
                    type="text"
                    value={millCert}
                    onChange={(e) => setMillCert(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Quantity</label>
                  <input
                    type="number"
                    required
                    value={batchQty}
                    onChange={(e) => setBatchQty(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Manufacturing Date</label>
                  <input
                    type="date"
                    required
                    value={mfgDate}
                    onChange={(e) => setMfgDate(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Expiration Date</label>
                  <input
                    type="date"
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewBatchModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold"
                >
                  Save Batch Lot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

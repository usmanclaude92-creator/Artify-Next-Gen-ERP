// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 13: ASSET MANAGEMENT
// 13.01 Asset Master, Categories, Register & Classification
// ==========================================

import React, { useState } from 'react';
import { useAssetStore } from '../../services/assetStore';
import { FixedAsset, AssetCategory, AssetClassification } from '../../types';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  QrCode,
  Layers,
  FolderTree,
  Building,
  Truck,
  Cpu,
  Armchair,
  Wrench,
  CheckCircle,
  AlertTriangle,
  FileText,
  Download,
  Eye,
  Edit2,
  Trash2,
  Tag,
  Calendar,
  DollarSign,
  MapPin,
  User,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { notify } from '@/src/components/common/Feedback';
import { mockRandom } from '@/src/utils/mockRandom';

export const AssetMasterView: React.FC = () => {
  const {
    assets,
    categories,
    classifications,
    currency,
    addAsset,
    updateAsset,
    deleteAsset,
    addCategory
  } = useAssetStore();

  const [activeTab, setActiveTab] = useState<'master' | 'categories' | 'register' | 'classification'>('master');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedAssetForTag, setSelectedAssetForTag] = useState<FixedAsset | null>(null);

  // Form State for new asset
  const [formData, setFormData] = useState({
    name: '',
    categoryId: categories[0]?.id || 'cat-mach',
    classificationId: classifications[0]?.id || 'cls-1',
    serialNumber: '',
    brand: '',
    model: '',
    manufactureYear: new Date().getFullYear(),
    supplierName: '',
    originalCost: 50000,
    additionalCosts: 2500,
    salvageValue: 5000,
    usefulLifeMonths: 120,
    depreciationMethod: 'STRAIGHT_LINE' as any,
    branch: 'Muscat Logistics Base',
    plant: 'Muscat Heavy Equipment Yard',
    costCenter: 'CC-OPS-HEAVY',
    department: 'Heavy Machinery & Fleet',
    locationName: 'Muscat Al Rusayl Industrial Yard',
    custodianName: 'Tariq Al-Balushi',
    condition: 'EXCELLENT' as any
  });

  // Filtered Assets
  const filteredAssets = assets.filter(a => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategoryFilter === 'ALL' || a.categoryId === selectedCategoryFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || a.status === selectedStatusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find(c => c.id === formData.categoryId) || categories[0];
    const cls = classifications.find(c => c.id === formData.classificationId) || classifications[0];
    const newTag = `AST-OMN-${new Date().getFullYear()}-${Math.floor(1000 + mockRandom() * 9000)}`;

    addAsset({
      assetTag: newTag,
      name: formData.name,
      categoryId: cat.id,
      categoryName: cat.name,
      classificationId: cls.id,
      classificationName: cls.name,
      serialNumber: formData.serialNumber || `SN-${Math.floor(100000 + mockRandom() * 900000)}`,
      barcode: `890${Math.floor(100000000 + mockRandom() * 900000000)}`,
      rfidTag: `RFID-${Math.floor(1000 + mockRandom() * 9000)}`,
      brand: formData.brand,
      model: formData.model,
      manufactureYear: Number(formData.manufactureYear),
      supplierId: 'VND-DEFAULT',
      supplierName: formData.supplierName || 'Oman Equipment Supplier LLC',
      currency,
      acquisitionDate: new Date().toISOString().split('T')[0],
      placedInServiceDate: new Date().toISOString().split('T')[0],
      originalCost: Number(formData.originalCost),
      additionalCosts: Number(formData.additionalCosts),
      revaluationsTotal: 0,
      impairmentsTotal: 0,
      salvageValue: Number(formData.salvageValue),
      usefulLifeMonths: Number(formData.usefulLifeMonths),
      depreciationMethod: formData.depreciationMethod,
      accumulatedDepreciation: 0,
      netBookValue: Number(formData.originalCost) + Number(formData.additionalCosts),
      currentYearDepreciation: 0,
      companyId: 'artify-corp',
      branch: formData.branch,
      plant: formData.plant,
      costCenter: formData.costCenter,
      department: formData.department,
      locationId: 'loc-default',
      locationName: formData.locationName,
      custodianName: formData.custodianName,
      status: 'IN_SERVICE',
      condition: formData.condition,
      isInsured: true
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Sub-tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-950 text-amber-400 border border-amber-800">
                13.01
              </span>
              <h2 className="text-xl font-black text-white">Fixed Asset Master & Classification</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Statutory fixed asset register, category configuration, barcode/RFID generation, and IFRS/IAS 16 groupings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Asset</span>
            </button>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('master')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'master'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Asset Master Directory</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Asset Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Statutory Asset Register</span>
          </button>

          <button
            onClick={() => setActiveTab('classification')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'classification'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>IFRS / Tax Classification</span>
          </button>
        </div>
      </div>

      {/* VIEW: ASSET MASTER DIRECTORY */}
      {activeTab === 'master' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by Asset Tag, Name, Serial #, Brand..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={selectedCategoryFilter}
                onChange={e => setSelectedCategoryFilter(e.target.value)}
                aria-label="Filter by Category"
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="ALL">All Asset Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                value={selectedStatusFilter}
                onChange={e => setSelectedStatusFilter(e.target.value)}
                aria-label="Filter by Status"
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="IN_SERVICE">In Service</option>
                <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                <option value="DISPOSED">Disposed</option>
                <option value="SCRAPPED">Scrapped</option>
              </select>
            </div>
          </div>

          {/* Asset Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map(asset => (
              <div
                key={asset.id}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all rounded-2xl p-5 shadow-lg relative group"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded-md">
                        {asset.assetTag}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        asset.status === 'IN_SERVICE'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                          : asset.status === 'UNDER_MAINTENANCE'
                          ? 'bg-amber-950/60 text-amber-400 border border-amber-800 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {asset.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-white mt-1.5 line-clamp-1 group-hover:text-amber-300 transition-colors">
                      {asset.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => setSelectedAssetForTag(asset)}
                    title="Generate Tag / QR Code"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-amber-600 hover:text-white text-slate-400 transition-colors cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>

                {/* Specs / Details */}
                <div className="space-y-2 text-xs text-slate-400 py-3 border-y border-slate-800/80 my-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Category:</span>
                    <span className="text-slate-300 font-medium">{asset.categoryName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Brand & Model:</span>
                    <span className="text-slate-300">{asset.brand} {asset.model}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Serial #:</span>
                    <span className="font-mono text-slate-300">{asset.serialNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span className="text-slate-300 truncate max-w-[180px]">{asset.locationName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Custodian:</span>
                    <span className="text-slate-300">{asset.custodianName || 'Unassigned'}</span>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Net Book Value (NBV)</div>
                    <div className="text-sm font-black text-white font-mono">
                      {currency} {asset.netBookValue.toLocaleString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Original Cost</div>
                    <div className="text-xs text-slate-400 font-mono">
                      {currency} {(asset.originalCost + asset.additionalCosts).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: ASSET CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Asset Categories & GL Account Rules</h3>
              <p className="text-xs text-slate-400">Configure default useful lives, depreciation methods, and GL posting accounts.</p>
            </div>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Category Name</th>
                  <th className="py-3 px-4">Asset Class</th>
                  <th className="py-3 px-4">Depreciation Method</th>
                  <th className="py-3 px-4">Default Life</th>
                  <th className="py-3 px-4">GL Asset Account</th>
                  <th className="py-3 px-4">GL Depr Expense</th>
                  <th className="py-3 px-4 text-right">Total NBV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{cat.code}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{cat.name}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                        {cat.assetClass}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium">{cat.defaultDepreciationMethod.replace('_', ' ')}</td>
                    <td className="py-3.5 px-4 font-mono">{cat.usefulLifeYears} Years</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{cat.assetGlAccount}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{cat.depreciationExpenseGlAccount}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                      {currency} {cat.totalNBV.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: STATUTORY ASSET REGISTER */}
      {activeTab === 'register' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Statutory Fixed Asset Register</h3>
              <p className="text-xs text-slate-400">Comprehensive IFRS/IAS 16 audit schedule of Cost, Revaluations, Impairments, Accumulated Depreciation & Net Book Value.</p>
            </div>
            <button
              onClick={() => notify('Exporting Official Fixed Asset Register to Excel/PDF schedule...')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Export Audit Schedule</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Asset Tag</th>
                  <th className="py-3 px-3">Asset Description</th>
                  <th className="py-3 px-3">Acq. Date</th>
                  <th className="py-3 px-3 text-right">Gross Cost</th>
                  <th className="py-3 px-3 text-right">Revaluation</th>
                  <th className="py-3 px-3 text-right">Accum Depr</th>
                  <th className="py-3 px-3 text-right">Net Book Value</th>
                  <th className="py-3 px-3">Location & Custodian</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {assets.map(a => (
                  <tr key={a.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-amber-400">{a.assetTag}</td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white">{a.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{a.categoryName} • SN: {a.serialNumber}</div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-400">{a.acquisitionDate}</td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-white">
                      {currency} {(a.originalCost + a.additionalCosts).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-cyan-400">
                      {a.revaluationsTotal > 0 ? `+${a.revaluationsTotal.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-rose-400">
                      ({a.accumulatedDepreciation.toLocaleString()})
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-black text-emerald-400">
                      {currency} {a.netBookValue.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="text-slate-300">{a.locationName}</div>
                      <div className="text-[10px] text-slate-500">{a.custodianName}</div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: IFRS & TAX CLASSIFICATION */}
      {activeTab === 'classification' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">IFRS Standards & Tax Depreciation Rates</h3>
            <p className="text-xs text-slate-400">Mapping statutory asset groupings to IFRS financial disclosures and tax depreciation pools.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {classifications.map(cls => (
              <div key={cls.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                    {cls.code}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">
                    ACTIVE
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{cls.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{cls.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">IFRS Standard:</span>
                    <span className="text-slate-300 font-medium">{cls.ifrsStandard}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tax Depr Rate:</span>
                    <span className="text-amber-400 font-mono font-bold">{cls.taxDepreciationRatePercent}% p.a.</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: REGISTER NEW ASSET */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Register Fixed Asset</h3>
                  <p className="text-xs text-slate-400">Enter technical, financial, and location details</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Asset Name / Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Komatsu PC210LC Hydraulic Excavator"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Asset Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Brand & Manufacturer</label>
                  <input
                    type="text"
                    placeholder="e.g. Komatsu / Caterpillar / Dell"
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Serial Number / Chassis #</label>
                  <input
                    type="text"
                    placeholder="e.g. KM-99820-2024"
                    value={formData.serialNumber}
                    onChange={e => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Original Invoice Cost ({currency}) *</label>
                  <input
                    type="number"
                    required
                    value={formData.originalCost}
                    onChange={e => setFormData({ ...formData, originalCost: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Additional Freight/Duties ({currency})</label>
                  <input
                    type="number"
                    value={formData.additionalCosts}
                    onChange={e => setFormData({ ...formData, additionalCosts: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Useful Life (Months) *</label>
                  <input
                    type="number"
                    required
                    value={formData.usefulLifeMonths}
                    onChange={e => setFormData({ ...formData, usefulLifeMonths: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Estimated Salvage Value ({currency})</label>
                  <input
                    type="number"
                    value={formData.salvageValue}
                    onChange={e => setFormData({ ...formData, salvageValue: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Physical Location</label>
                  <input
                    type="text"
                    value={formData.locationName}
                    onChange={e => setFormData({ ...formData, locationName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Assigned Custodian</label>
                  <input
                    type="text"
                    value={formData.custodianName}
                    onChange={e => setFormData({ ...formData, custodianName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl font-bold shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TAG / QR CODE DISPLAY */}
      {selectedAssetForTag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-center space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-amber-400">ARTIFY FINANCIAL ECOSYSTEM (AFE) ASSET TAG</span>
              <button
                onClick={() => setSelectedAssetForTag(null)}
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Generated Tag Card */}
            <div className="bg-white text-slate-950 p-6 rounded-2xl shadow-inner text-left space-y-3 font-sans border-2 border-slate-300">
              <div className="flex items-center justify-between border-b border-slate-300 pb-2">
                <span className="text-xs font-black tracking-wider text-slate-900">ARTIFY ENTERPRISE ERP</span>
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  {selectedAssetForTag.assetTag}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-extrabold text-slate-900">{selectedAssetForTag.name}</div>
                  <div className="text-xs text-slate-600">SN: {selectedAssetForTag.serialNumber}</div>
                  <div className="text-xs text-slate-600">Location: {selectedAssetForTag.locationName}</div>
                  <div className="text-xs text-slate-600">Custodian: {selectedAssetForTag.custodianName || 'Unassigned'}</div>
                </div>

                <div className="p-2 bg-slate-100 rounded-xl border border-slate-300 flex flex-col items-center">
                  <QrCode className="w-16 h-16 text-slate-900" />
                  <span className="text-[8px] font-mono text-slate-600 mt-1">SCAN RFID/QR</span>
                </div>
              </div>

              <div className="text-center pt-2 border-t border-slate-200">
                <div className="font-mono text-xs tracking-widest font-black text-slate-800">
                  ||| | ||||| || |||| ||| |||||||
                </div>
                <div className="text-[10px] font-mono text-slate-500">{selectedAssetForTag.barcode}</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => notify('Sending asset tag to thermal Zebra printer...')}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Print Thermal Asset Label
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

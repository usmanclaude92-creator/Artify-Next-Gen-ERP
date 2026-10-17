// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 13: ASSET MANAGEMENT
// 13.02 Asset Acquisition, Capitalization, CWIP & Opening Balance
// ==========================================

import React, { useState } from 'react';
import { useAssetStore } from '../../services/assetStore';
import { CWIPProject } from '../../types';
import {
  PlusCircle,
  Building,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Calendar,
  Layers,
  Wrench,
  Sparkles,
  Download,
  FileSpreadsheet
} from 'lucide-react';

export const AssetAcquisitionView: React.FC = () => {
  const {
    cwipProjects,
    categories,
    currency,
    createCWIPProject,
    capitalizeCWIP,
    addAsset
  } = useAssetStore();

  const [activeTab, setActiveTab] = useState<'cwip' | 'purchase' | 'capitalization' | 'opening_balance'>('cwip');
  
  // CWIP Form
  const [showCwipModal, setShowCwipModal] = useState(false);
  const [cwipForm, setCwipForm] = useState({
    projectCode: `CWIP-2026-${Math.floor(100 + Math.random() * 900)}`,
    projectName: '',
    targetAssetCategory: 'Plant & Heavy Machinery',
    costCenter: 'CC-PLANT-MFG',
    budgetAllocated: 500000,
    accumulatedMaterialCost: 240000,
    accumulatedContractorCost: 110000,
    accumulatedInternalLaborCost: 35000,
    accumulatedOverheadCost: 15000,
    startDate: new Date().toISOString().split('T')[0],
    estimatedCompletionDate: '2026-12-31'
  });

  // Capitalize Modal
  const [selectedCwipToCap, setSelectedCwipToCap] = useState<CWIPProject | null>(null);
  const [capForm, setCapForm] = useState({
    assetName: '',
    categoryId: categories[0]?.id || 'cat-mach',
    usefulLifeMonths: 240
  });

  // Purchase Acquisition Form
  const [purchaseForm, setPurchaseForm] = useState({
    vendorName: 'Liebherr Middle East FZE',
    poReference: 'PO-2026-0811',
    invoiceNumber: 'INV-2026-9901',
    assetName: 'Heavy Rotary Drilling Rig 45T',
    categoryId: 'cat-mach',
    baseInvoiceCost: 340000,
    shippingFreightCost: 12000,
    installationLaborCost: 8000,
    customsDutyCost: 17000,
    usefulLifeYears: 10,
    salvageValue: 35000,
    location: 'Muscat Al Rusayl Industrial Yard'
  });

  const handleCreateCWIP = (e: React.FormEvent) => {
    e.preventDefault();
    createCWIPProject({
      projectCode: cwipForm.projectCode,
      projectName: cwipForm.projectName,
      targetAssetCategory: cwipForm.targetAssetCategory,
      costCenter: cwipForm.costCenter,
      startDate: cwipForm.startDate,
      estimatedCompletionDate: cwipForm.estimatedCompletionDate,
      budgetAllocated: Number(cwipForm.budgetAllocated),
      accumulatedMaterialCost: Number(cwipForm.accumulatedMaterialCost),
      accumulatedContractorCost: Number(cwipForm.accumulatedContractorCost),
      accumulatedInternalLaborCost: Number(cwipForm.accumulatedInternalLaborCost),
      accumulatedOverheadCost: Number(cwipForm.accumulatedOverheadCost),
      status: 'IN_PROGRESS',
      completionCertificateNumber: `CERT-${cwipForm.projectCode}`
    });
    setShowCwipModal(false);
  };

  const handleConfirmCapitalize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCwipToCap) return;
    capitalizeCWIP(
      selectedCwipToCap.id,
      capForm.assetName || selectedCwipToCap.projectName,
      capForm.categoryId,
      Number(capForm.usefulLifeMonths)
    );
    setSelectedCwipToCap(null);
  };

  const handleDirectPurchaseCapitalization = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAdditional = Number(purchaseForm.shippingFreightCost) + Number(purchaseForm.installationLaborCost) + Number(purchaseForm.customsDutyCost);
    const cat = categories.find(c => c.id === purchaseForm.categoryId) || categories[0];
    const newTag = `AST-PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    addAsset({
      assetTag: newTag,
      name: purchaseForm.assetName,
      categoryId: cat.id,
      categoryName: cat.name,
      classificationId: 'cls-1',
      classificationName: 'IAS 16 — Property, Plant & Equipment',
      serialNumber: `SN-ACQ-${Math.floor(100000 + Math.random() * 900000)}`,
      barcode: `890${Math.floor(100000000 + Math.random() * 900000000)}`,
      brand: 'Imported Capital Asset',
      model: 'Model 2026',
      manufactureYear: 2026,
      supplierId: 'VND-DIRECT',
      supplierName: purchaseForm.vendorName,
      poNumber: purchaseForm.poReference,
      invoiceNumber: purchaseForm.invoiceNumber,
      currency,
      acquisitionDate: new Date().toISOString().split('T')[0],
      placedInServiceDate: new Date().toISOString().split('T')[0],
      originalCost: Number(purchaseForm.baseInvoiceCost),
      additionalCosts: totalAdditional,
      revaluationsTotal: 0,
      impairmentsTotal: 0,
      salvageValue: Number(purchaseForm.salvageValue),
      usefulLifeMonths: Number(purchaseForm.usefulLifeYears) * 12,
      depreciationMethod: cat.defaultDepreciationMethod,
      accumulatedDepreciation: 0,
      netBookValue: Number(purchaseForm.baseInvoiceCost) + totalAdditional,
      currentYearDepreciation: 0,
      companyId: 'artify-corp',
      branch: 'Muscat Logistics Base',
      plant: 'Heavy Yard Plant 1',
      costCenter: 'CC-OPS-HEAVY',
      department: 'Operations',
      locationId: 'loc-muscat-yard',
      locationName: purchaseForm.location,
      status: 'IN_SERVICE',
      condition: 'EXCELLENT',
      isInsured: true
    });

    alert(`Asset ${newTag} capitalized successfully with total cost basis of ${currency} ${(Number(purchaseForm.baseInvoiceCost) + totalAdditional).toLocaleString()}!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-950 text-amber-400 border border-amber-800">
                13.02
              </span>
              <h2 className="text-xl font-black text-white">Asset Acquisition & Construction (CWIP)</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Capital purchases, multi-cost capitalization, CWIP construction tracking, and legacy opening balance uploads.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCwipModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New CWIP Project</span>
            </button>
          </div>
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('cwip')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'cwip'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>CWIP Construction Projects ({cwipProjects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('capitalization')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'capitalization'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Multi-Element Capitalization</span>
          </button>

          <button
            onClick={() => setActiveTab('purchase')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'purchase'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>PO & Invoice Direct Intake</span>
          </button>

          <button
            onClick={() => setActiveTab('opening_balance')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'opening_balance'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Opening Balance Migration</span>
          </button>
        </div>
      </div>

      {/* VIEW: CWIP CONSTRUCTION PROJECTS */}
      {activeTab === 'cwip' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cwipProjects.map(project => {
              const progressPct = Math.min(100, Math.round((project.totalCwipCost / project.budgetAllocated) * 100));
              return (
                <div
                  key={project.id}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 shadow-xl space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                          {project.projectCode}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          project.status === 'READY_FOR_CAPITALIZATION'
                            ? 'bg-cyan-950 text-cyan-400 border-cyan-800 animate-pulse'
                            : project.status === 'CAPITALIZED'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          {project.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1.5">{project.projectName}</h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">Target: {project.targetAssetCategory} • {project.costCenter}</p>
                    </div>

                    {project.status === 'READY_FOR_CAPITALIZATION' && (
                      <button
                        onClick={() => {
                          setSelectedCwipToCap(project);
                          setCapForm({ ...capForm, assetName: project.projectName });
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer whitespace-nowrap"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Capitalize to Fixed Asset</span>
                      </button>
                    )}
                  </div>

                  {/* Budget & Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Budget Consumed ({progressPct}%)</span>
                      <span className="font-mono text-slate-200">
                        {currency} {project.totalCwipCost.toLocaleString()} / {currency} {project.budgetAllocated.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all duration-500 ${
                          progressPct > 95 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Cost breakdown items */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-[11px]">
                    <div className="bg-slate-950 p-2 rounded-lg">
                      <div className="text-slate-500">Materials</div>
                      <div className="font-mono font-bold text-slate-300">{currency} {project.accumulatedMaterialCost.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg">
                      <div className="text-slate-500">Contractors</div>
                      <div className="font-mono font-bold text-slate-300">{currency} {project.accumulatedContractorCost.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg">
                      <div className="text-slate-500">Direct Labor</div>
                      <div className="font-mono font-bold text-slate-300">{currency} {project.accumulatedInternalLaborCost.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg">
                      <div className="text-slate-500">Overheads</div>
                      <div className="font-mono font-bold text-slate-300">{currency} {project.accumulatedOverheadCost.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>Est. Commissioning: {project.estimatedCompletionDate}</span>
                    <span className="font-mono">{project.completionCertificateNumber}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: MULTI-ELEMENT CAPITALIZATION FORM */}
      {activeTab === 'capitalization' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">IAS 16 Multi-Element Asset Capitalization</h3>
            <p className="text-xs text-slate-400">
              Combine invoice base cost with shipping, port customs duties, foundation construction, and technician installation labor into a single asset cost basis.
            </p>
          </div>

          <form onSubmit={handleDirectPurchaseCapitalization} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">1. Technical & Commercial</h4>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Asset Full Description *</label>
                  <input
                    type="text"
                    required
                    value={purchaseForm.assetName}
                    onChange={e => setPurchaseForm({ ...purchaseForm, assetName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Supplier / OEM Vendor</label>
                  <input
                    type="text"
                    value={purchaseForm.vendorName}
                    onChange={e => setPurchaseForm({ ...purchaseForm, vendorName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">PO Reference</label>
                    <input
                      type="text"
                      value={purchaseForm.poReference}
                      onChange={e => setPurchaseForm({ ...purchaseForm, poReference: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Vendor Invoice #</label>
                    <input
                      type="text"
                      value={purchaseForm.invoiceNumber}
                      onChange={e => setPurchaseForm({ ...purchaseForm, invoiceNumber: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">2. Cost Component Allocation</h4>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Base Machinery Invoice Cost ({currency}) *</label>
                  <input
                    type="number"
                    required
                    value={purchaseForm.baseInvoiceCost}
                    onChange={e => setPurchaseForm({ ...purchaseForm, baseInvoiceCost: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Ocean / Air Freight & Marine Insurance ({currency})</label>
                  <input
                    type="number"
                    value={purchaseForm.shippingFreightCost}
                    onChange={e => setPurchaseForm({ ...purchaseForm, shippingFreightCost: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Customs Clearance / Bayan</label>
                    <input
                      type="number"
                      value={purchaseForm.customsDutyCost}
                      onChange={e => setPurchaseForm({ ...purchaseForm, customsDutyCost: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Installation / Commissioning</label>
                    <input
                      type="number"
                      value={purchaseForm.installationLaborCost}
                      onChange={e => setPurchaseForm({ ...purchaseForm, installationLaborCost: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">3. Capitalization Summary</h4>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Base Cost:</span>
                    <span className="font-mono text-slate-300">{currency} {purchaseForm.baseInvoiceCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Capitalized Add-ons:</span>
                    <span className="font-mono text-cyan-400">
                      +{currency} {(purchaseForm.shippingFreightCost + purchaseForm.customsDutyCost + purchaseForm.installationLaborCost).toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold">
                    <span className="text-white">Total Gross Asset Basis:</span>
                    <span className="font-mono text-emerald-400">
                      {currency} {(purchaseForm.baseInvoiceCost + purchaseForm.shippingFreightCost + purchaseForm.customsDutyCost + purchaseForm.installationLaborCost).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
                >
                  Post Capitalization to Asset Subledger
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* VIEW: PURCHASE ORDERS INTAKE */}
      {activeTab === 'purchase' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Direct PO & AP Invoice Capital Ingestion</h3>
              <p className="text-xs text-slate-400">Match pending Capital Purchase Orders (CAPEX) with vendor goods receipts (GRN).</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">PO Reference</th>
                  <th className="py-3 px-4">Vendor</th>
                  <th className="py-3 px-4">Item Description</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4 text-right">Invoice Amount</th>
                  <th className="py-3 px-4">GRN Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-400">PO-CAPEX-2026-091</td>
                  <td className="py-3.5 px-4 font-medium text-white">Yamazaki Mazak Gulf FZCO</td>
                  <td className="py-3.5 px-4">High Precision Milling Machine 4-Axis</td>
                  <td className="py-3.5 px-4 font-mono">1 Unit</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">{currency} 185,000</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800 text-[10px]">
                      GRN RECEIVED
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => alert('Direct capitalization wizard opened for PO-CAPEX-2026-091')}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                    >
                      Capitalize
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: OPENING BALANCE MIGRATION */}
      {activeTab === 'opening_balance' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Legacy Fixed Asset Opening Balance Migration</h3>
              <p className="text-xs text-slate-400">Batch upload existing asset books with historical cost, placed in service dates, and accumulated depreciation layers.</p>
            </div>
            <button
              onClick={() => alert('Downloading Excel Opening Balance Migration Template...')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Download Excel Template</span>
            </button>
          </div>

          <div className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 transition-colors rounded-2xl p-10 text-center space-y-4 bg-slate-950/60">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Upload Completed Excel / CSV Asset Register</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                File must include AssetTag, Name, CategoryCode, AcquisitionDate, GrossCost, AccumDepreciation, and Location.
              </p>
            </div>
            <button
              onClick={() => alert('Opening balance batch migration simulated: 420 legacy assets uploaded and reconciled successfully!')}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
            >
              Simulate Excel Import & Validate GL Tie-out
            </button>
          </div>
        </div>
      )}

      {/* MODAL: NEW CWIP PROJECT */}
      {showCwipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-black text-white">Create Capital Work In Progress (CWIP)</h3>
              <button
                onClick={() => setShowCwipModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCWIP} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Project Code</label>
                  <input
                    type="text"
                    value={cwipForm.projectCode}
                    onChange={e => setCwipForm({ ...cwipForm, projectCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Cost Center</label>
                  <input
                    type="text"
                    value={cwipForm.costCenter}
                    onChange={e => setCwipForm({ ...cwipForm, costCenter: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Duqm Bulk Storage Warehouse Construction"
                  value={cwipForm.projectName}
                  onChange={e => setCwipForm({ ...cwipForm, projectName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Allocated Budget ({currency})</label>
                  <input
                    type="number"
                    value={cwipForm.budgetAllocated}
                    onChange={e => setCwipForm({ ...cwipForm, budgetAllocated: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Target Asset Category</label>
                  <select
                    value={cwipForm.targetAssetCategory}
                    onChange={e => setCwipForm({ ...cwipForm, targetAssetCategory: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Land & Buildings">Land & Buildings</option>
                    <option value="Plant & Heavy Machinery">Plant & Heavy Machinery</option>
                    <option value="IT Hardware & Infrastructure">IT Hardware & Infrastructure</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCwipModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  Save CWIP Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CAPITALIZE CWIP TO FIXED ASSET */}
      {selectedCwipToCap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-black text-white">Capitalize CWIP to Fixed Asset Subledger</h3>
              <button
                onClick={() => setSelectedCwipToCap(null)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmCapitalize} className="space-y-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl space-y-2 border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500">CWIP Reference:</span>
                  <span className="font-mono text-amber-400 font-bold">{selectedCwipToCap.projectCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Accumulated Cost Basis:</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">
                    {currency} {selectedCwipToCap.totalCwipCost.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Commissioned Asset Name *</label>
                <input
                  type="text"
                  required
                  value={capForm.assetName}
                  onChange={e => setCapForm({ ...capForm, assetName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Asset Category</label>
                  <select
                    value={capForm.categoryId}
                    onChange={e => setCapForm({ ...capForm, categoryId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Useful Life (Months)</label>
                  <input
                    type="number"
                    value={capForm.usefulLifeMonths}
                    onChange={e => setCapForm({ ...capForm, usefulLifeMonths: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedCwipToCap(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  Confirm Capitalization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

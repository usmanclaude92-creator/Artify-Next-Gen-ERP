// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 08: MANUFACTURING
// 08.01 — Product & BOM Management View
// ==========================================

import React, { useState } from 'react';
import { useManufacturingStore } from '../../services/manufacturingStore';
import { BillOfMaterials, BomComponentLine, RoutingOperationStep } from '../../types';
import { ERPRouteState } from '../../../../types/erp';
import {
  GitFork,
  Layers,
  FileCode,
  Clock,
  DollarSign,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Wrench,
  Cpu,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Download,
  Share2,
  Sparkles
} from 'lucide-react';

interface ProductBomManagementViewProps {
  initialTab?: 'boms' | 'versions' | 'routings' | 'specs';
  onNavigate: (route: ERPRouteState) => void;
}

export const ProductBomManagementView: React.FC<ProductBomManagementViewProps> = ({
  initialTab = 'boms',
  onNavigate
}) => {
  const { boms, workCenters, addBom, updateBom } = useManufacturingStore();
  const [activeTab, setActiveTab] = useState<'boms' | 'versions' | 'routings' | 'specs'>(initialTab);
  const [selectedBomId, setSelectedBomId] = useState<string>(boms[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New BOM form state
  const [newBomCode, setNewBomCode] = useState('');
  const [newProductSku, setNewProductSku] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newVersion, setNewVersion] = useState('v1.0');

  const selectedBom = boms.find((b) => b.id === selectedBomId) || boms[0];

  const filteredBoms = boms.filter(
    (b) =>
      b.bomCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.productSku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateBom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBomCode || !newProductSku || !newProductName) return;

    const created = addBom({
      bomCode: newBomCode,
      productSku: newProductSku,
      productName: newProductName,
      description: newDescription,
      version: newVersion,
      status: 'ACTIVE',
      baseQuantity: 1,
      baseUom: 'PCS',
      effectiveFrom: new Date().toISOString().split('T')[0],
      createdBy: 'Eng. Said Al-Rawahi',
      components: [
        {
          id: `comp-${Date.now()}-1`,
          itemCode: 'RAW-MAT-STD-01',
          itemName: 'Standard Heavy Forging Alloy',
          category: 'Raw Materials',
          quantityPerUnit: 1,
          uom: 'PCS',
          unitCostOMR: 150.00,
          totalCostOMR: 150.00,
          scrapAllowancePct: 2.0,
          isSubAssembly: false,
          operationSeqNumber: 10
        }
      ],
      byProducts: [],
      routingSteps: [
        {
          id: `rt-${Date.now()}-10`,
          stepNumber: 10,
          operationName: 'CNC Machining & Milling',
          description: 'Machine external profiles and bore cavities to ISO tolerances.',
          workCenterId: workCenters[0]?.id || 'wc-01',
          workCenterName: workCenters[0]?.name || 'Heavy CNC Machining',
          setupTimeMinutes: 30,
          runTimeMinutesPerUnit: 120,
          laborHoursPerUnit: 2.0,
          machineHoursPerUnit: 2.0,
          standardLaborRateOMR: 12.50,
          standardMachineRateOMR: 28.00,
          standardOverheadRateOMR: 8.50,
          totalStepCostPerUnitOMR: 98.00,
          qualityCheckRequired: true
        }
      ],
      totalMaterialCostOMR: 150.00,
      totalLaborCostOMR: 25.00,
      totalMachineCostOMR: 56.00,
      totalStandardCostOMR: 248.00
    });

    setSelectedBomId(created.id);
    setShowCreateModal(false);
    setNewBomCode('');
    setNewProductSku('');
    setNewProductName('');
    setNewDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
              <GitFork className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">08.01 — Product & Bill of Materials (BOM)</h2>
              <p className="text-xs text-slate-400">
                Multi-level component engineering formulas, revision version control, routings, and technical drawings.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Create New BOM
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('boms')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'boms'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          Bill of Materials Catalog & Tree
        </button>
        <button
          onClick={() => setActiveTab('versions')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'versions'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-4 h-4" />
          BOM Versions & Engineering Change Notices (ECN)
        </button>
        <button
          onClick={() => setActiveTab('routings')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'routings'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          Manufacturing Routings & Operations
        </button>
        <button
          onClick={() => setActiveTab('specs')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'specs'
              ? 'border-orange-500 text-orange-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Production Specifications & QA Checkpoints
        </button>
      </div>

      {/* TAB 1: BOMs Catalog & Tree */}
      {activeTab === 'boms' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Master List */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search BOM code, SKU or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              {filteredBoms.map((bom) => (
                <div
                  key={bom.id}
                  onClick={() => setSelectedBomId(bom.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedBom?.id === bom.id
                      ? 'bg-orange-500/10 border-orange-500/40 text-white'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-orange-400">{bom.bomCode}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      {bom.version}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white mt-1 line-clamp-1">{bom.productName}</h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span>{bom.components.length} Components • {bom.routingSteps.length} Ops</span>
                    <span className="font-bold text-emerald-400">OMR {bom.totalStandardCostOMR.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Detail Card */}
          <div className="lg:col-span-2 space-y-4">
            {selectedBom && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{selectedBom.productName}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                        {selectedBom.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      SKU: <span className="font-mono text-slate-300">{selectedBom.productSku}</span> • Version:{' '}
                      <span className="font-bold text-orange-400">{selectedBom.version}</span> • Base:{' '}
                      <span className="text-slate-300">{selectedBom.baseQuantity} {selectedBom.baseUom}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-400">Total Standard Cost</div>
                    <div className="text-xl font-bold text-emerald-400">
                      OMR {selectedBom.totalStandardCostOMR.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Cost Summary Pills */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Material Cost</div>
                    <div className="text-sm font-bold text-white mt-1">OMR {selectedBom.totalMaterialCostOMR.toFixed(2)}</div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Labor Cost</div>
                    <div className="text-sm font-bold text-white mt-1">OMR {selectedBom.totalLaborCostOMR.toFixed(2)}</div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Machine & Overhead</div>
                    <div className="text-sm font-bold text-white mt-1">OMR {selectedBom.totalMachineCostOMR.toFixed(2)}</div>
                  </div>
                </div>

                {/* Components Table */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-orange-400" />
                      Bill of Materials Components Line Items ({selectedBom.components.length})
                    </h4>
                  </div>

                  <div className="overflow-x-auto border border-slate-800 rounded-lg">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                        <tr>
                          <th className="p-2.5">Item / SKU</th>
                          <th className="p-2.5">Category</th>
                          <th className="p-2.5 text-center">Qty / UOM</th>
                          <th className="p-2.5 text-center">Scrap %</th>
                          <th className="p-2.5 text-right">Unit Cost</th>
                          <th className="p-2.5 text-right">Total Cost</th>
                          <th className="p-2.5 text-center">Op Step</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {selectedBom.components.map((comp) => (
                          <tr key={comp.id} className="hover:bg-slate-800/40">
                            <td className="p-2.5">
                              <div className="font-semibold text-white">{comp.itemName}</div>
                              <span className="font-mono text-[10px] text-slate-500">{comp.itemCode}</span>
                              {comp.isSubAssembly && (
                                <span className="ml-2 px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold">
                                  Sub-Assembly
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 text-slate-400">{comp.category}</td>
                            <td className="p-2.5 text-center font-bold text-white">
                              {comp.quantityPerUnit} {comp.uom}
                            </td>
                            <td className="p-2.5 text-center text-slate-400">{comp.scrapAllowancePct}%</td>
                            <td className="p-2.5 text-right font-mono">OMR {comp.unitCostOMR.toFixed(2)}</td>
                            <td className="p-2.5 text-right font-bold text-white font-mono">
                              OMR {comp.totalCostOMR.toFixed(2)}
                            </td>
                            <td className="p-2.5 text-center">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                                Op {comp.operationSeqNumber}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* By-Products if any */}
                {selectedBom.byProducts.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                      Recoverable By-Products / Swarf
                    </h4>
                    <div className="space-y-2">
                      {selectedBom.byProducts.map((byp) => (
                        <div
                          key={byp.id}
                          className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-semibold text-white">{byp.itemName}</span>
                            <span className="text-slate-400 ml-2">({byp.itemCode})</span>
                          </div>
                          <div className="text-emerald-400 font-bold">
                            +{byp.expectedOutputRatio} {byp.uom} / unit (Credit: OMR {byp.estimatedValueOMR.toFixed(2)} / {byp.uom})
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: BOM Versions & ECN */}
      {activeTab === 'versions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Engineering Change Notice (ECN) & Revision History</h3>
              <p className="text-xs text-slate-400">
                Audit trail of product engineering modifications, design enhancements, and material substitutions.
              </p>
            </div>
            <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium rounded-lg border border-slate-700">
              New ECN Proposal
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-bold text-xs">
                    ECN-2026-014
                  </span>
                  <h4 className="text-xs font-bold text-white">
                    Trim Material Upgrade to Inconel 625 Cladding for Sour Gas H2S
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                  APPROVED & ACTIVE (v2.2)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Upgraded stem and ball overlay to Inconel 625 cladding for PDO Marmul Sour Gas Depletion project compliance.
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                <span>Author: Eng. Tariq Al-Balushi</span>
                <span>Effective Date: 2026-01-01</span>
                <span>Signoff: PDO QA/QC TA-2</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold text-xs">
                    ECN-2025-088
                  </span>
                  <h4 className="text-xs font-bold text-white">
                    Sub-assembly Integration of Hydraulic Scotch Yoke Actuator
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                  SUPERSEDED (v2.0)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transitioned actuator procurement to modular in-house sub-assembly BOM-ACT-HYD-002 to save 18% on unit cost.
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                <span>Author: Eng. Said Al-Hajri</span>
                <span>Effective Date: 2025-08-15</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Manufacturing Routings */}
      {activeTab === 'routings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">
                Sequential Routing Operations — {selectedBom?.productName}
              </h3>
              <p className="text-xs text-slate-400">
                Standard setup minutes, run cycle hours, labor/machine absorption rates, and work center routing.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {selectedBom?.routingSteps.map((step, idx) => (
              <div
                key={step.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-xs">
                      {step.stepNumber}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{step.operationName}</h4>
                      <p className="text-[11px] text-slate-400">
                        Work Center: <strong className="text-slate-300">{step.workCenterName}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <span className="text-slate-400">Setup / Run:</span>{' '}
                      <strong className="text-white">
                        {step.setupTimeMinutes}m setup • {step.runTimeMinutesPerUnit}m run
                      </strong>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400">Cost / Unit:</span>{' '}
                      <strong className="text-emerald-400 font-bold">
                        OMR {step.totalStepCostPerUnitOMR.toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400">{step.description}</p>

                {step.qualityCheckRequired && (
                  <div className="flex items-center gap-2 text-[11px] text-amber-400 bg-amber-950/20 px-2.5 py-1 rounded border border-amber-900/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Mandatory QA Hold Point: Standard doc {step.inspectionStandardDoc || 'QA-INSP-STANDARD'}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Production Specifications */}
      {activeTab === 'specs' && selectedBom?.specifications && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 text-xs font-bold mb-1">
                {selectedBom.specifications.specCode}
              </div>
              <h3 className="text-base font-bold text-white">{selectedBom.specifications.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Drawing: <strong className="text-slate-200">{selectedBom.specifications.drawingNumber}</strong> • Grade:{' '}
                <strong className="text-slate-200">{selectedBom.specifications.materialGrade}</strong> • Revision:{' '}
                <strong className="text-orange-400">{selectedBom.specifications.revision}</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium rounded-lg border border-slate-700 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" /> Download STEP/CAD
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Mandatory Safety & Compliance Standards
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {selectedBom.specifications.safetyRequirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Quality Inspection Checkpoints & Hold-Points
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {selectedBom.specifications.qaCheckpoints.map((chk, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{chk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Create BOM Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Create New Bill of Materials (BOM)</h3>
            <form onSubmit={handleCreateBom} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">BOM Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BOM-FLG-WN-004"
                  value={newBomCode}
                  onChange={(e) => setNewBomCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Product SKU *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FG-FLANGE-10IN"
                    value={newProductSku}
                    onChange={(e) => setNewProductSku(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Version</label>
                  <input
                    type="text"
                    value={newVersion}
                    onChange={(e) => setNewVersion(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10in Weld Neck Flange ANSI 600"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg"
                >
                  Save BOM Formula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

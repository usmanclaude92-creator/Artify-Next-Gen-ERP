// ==========================================
// 15.02 BOQ MANAGEMENT VIEW
// Hierarchical Bill of Quantities, Rate Breakdown, Revisions & Quantity Tracking
// ==========================================

import React, { useState } from 'react';
import { useConstructionStore } from '../../services/constructionStore';
import { BOQItem, BOQDivision, BOQRevision } from '../../types/constructionTypes';
import {
  List,
  Plus,
  Search,
  Filter,
  DollarSign,
  Layers,
  History,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  PieChart,
  FileSpreadsheet,
  ArrowRight,
  Maximize2
} from 'lucide-react';

export const BOQManagementView: React.FC = () => {
  const {
    boqItems,
    boqRevisions,
    selectedContractId,
    contracts,
    currency,
    addBOQItem,
    addBOQRevision
  } = useConstructionStore();

  const [activeTab, setActiveTab] = useState<'boq-items' | 'rate-analysis' | 'revisions' | 'quantity-tracking'>('boq-items');
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBoqItemForRate, setSelectedBoqItemForRate] = useState<BOQItem | null>(null);

  // Modals
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddRevisionModal, setShowAddRevisionModal] = useState(false);

  // New Item State
  const [newCode, setNewCode] = useState('');
  const [newDivision, setNewDivision] = useState<BOQDivision>('DIV_03_CONCRETE_WORKS');
  const [newDesc, setNewDesc] = useState('');
  const [newUnit, setNewUnit] = useState('m3');
  const [newTenderQty, setNewTenderQty] = useState<number>(100);
  const [newRate, setNewRate] = useState<number>(150);

  // New Revision State
  const [newRevCode, setNewRevCode] = useState('');
  const [newRevTitle, setNewRevTitle] = useState('');
  const [newRevReason, setNewRevReason] = useState<'IFC_DRAWING_UPDATE' | 'TENDER_ADDENDUM' | 'SITE_RE_MEASUREMENT' | 'CLIENT_SCOPE_CHANGE'>('IFC_DRAWING_UPDATE');
  const [newRevImpact, setNewRevImpact] = useState<number>(50000);

  const selectedContract = contracts.find(c => c.id === selectedContractId) || contracts[0];

  const contractBoqItems = boqItems.filter(b => b.contractId === selectedContractId);

  const filteredItems = contractBoqItems.filter(item => {
    const matchesDiv = selectedDivision === 'ALL' || item.division === selectedDivision;
    const matchesSearch =
      item.itemDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.boqCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiv && matchesSearch;
  });

  const totalTenderValue = contractBoqItems.reduce((acc, i) => acc + i.totalTenderAmount, 0);
  const totalRevisedValue = contractBoqItems.reduce((acc, i) => acc + i.totalRevisedAmount, 0);
  const totalExecutedValue = contractBoqItems.reduce((acc, i) => acc + i.totalExecutedAmount, 0);

  const handleCreateBOQItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newDesc) return;

    const totalAmt = newTenderQty * newRate;
    addBOQItem({
      boqCode: newCode,
      contractId: selectedContractId,
      division: newDivision,
      itemDescription: newDesc,
      unitOfMeasure: newUnit,
      tenderQuantity: Number(newTenderQty),
      revisedQuantity: Number(newTenderQty),
      executedQuantityToDate: 0,
      certifiedQuantityToDate: 0,
      unitRate: Number(newRate),
      totalTenderAmount: totalAmt,
      totalRevisedAmount: totalAmt,
      totalExecutedAmount: 0,
      rateBreakdown: {
        materialRate: Number(newRate) * 0.6,
        laborRate: Number(newRate) * 0.2,
        equipmentRate: Number(newRate) * 0.1,
        subcontractorRate: 0,
        overheadProfitRate: Number(newRate) * 0.1
      },
      reMeasurementRequired: true
    });

    setShowAddItemModal(false);
    setNewCode('');
    setNewDesc('');
  };

  const handleCreateRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRevCode || !newRevTitle) return;

    addBOQRevision({
      revisionCode: newRevCode,
      contractId: selectedContractId,
      title: newRevTitle,
      reason: newRevReason,
      dateIssued: new Date().toISOString().split('T')[0],
      issuedBy: 'Senior Quantity Surveyor',
      approvedBy: 'Consultant & Employer Project Director',
      affectedItemsCount: 5,
      netFinancialImpact: Number(newRevImpact),
      status: 'APPROVED'
    });

    setShowAddRevisionModal(false);
    setNewRevCode('');
    setNewRevTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <List className="w-3.5 h-3.5" />
            Module 15.02 — BOQ Management
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Hierarchical Bill of Quantities (BOQ)</h2>
          <p className="text-sm text-slate-400">
            Multi-division measurement breakdown, analytical unit rate deconstruction, drawing revision addendums, and certified quantity takeoff.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddRevisionModal(true)}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs px-4 py-2.5 rounded-xl shadow transition-all"
          >
            <History className="w-4 h-4" />
            Issue BOQ Addendum
          </button>
          <button
            onClick={() => setShowAddItemModal(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Add BOQ Item
          </button>
        </div>
      </div>

      {/* Summary KPI Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Tender BOQ Value</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-0.5">
              {currency} {totalTenderValue.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <History className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Revised BOQ Value (with IFC Revs)</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-0.5">
              {currency} {totalRevisedValue.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Executed Value to Date</span>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
              {currency} {totalExecutedValue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('boq-items')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'boq-items'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Bill of Quantities ({contractBoqItems.length})
          </button>
          <button
            onClick={() => setActiveTab('rate-analysis')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'rate-analysis'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Unit Rate Analysis Breakdown
          </button>
          <button
            onClick={() => setActiveTab('revisions')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'revisions'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            BOQ Revisions & Addendums ({boqRevisions.length})
          </button>
          <button
            onClick={() => setActiveTab('quantity-tracking')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'quantity-tracking'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Quantity Takeoff & Variance Tracking
          </button>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedDivision}
            onChange={e => setSelectedDivision(e.target.value)}
            className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 font-medium"
          >
            <option value="ALL">All Divisions</option>
            <option value="DIV_01_GENERAL_REQUIREMENTS">Div 01: General Requirements</option>
            <option value="DIV_02_EXISTING_CONDITIONS_EARTHWORKS">Div 02: Earthworks & Dewatering</option>
            <option value="DIV_03_CONCRETE_WORKS">Div 03: Concrete Works</option>
            <option value="DIV_08_OPENINGS_DOORS_WINDOWS">Div 08: Openings & Facade</option>
          </select>

          <div className="relative w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Tab 1: BOQ Items Table */}
      {activeTab === 'boq-items' && (
        <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Item Code</th>
                <th className="py-3 px-4">Division</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-center">Unit</th>
                <th className="py-3 px-4 text-right">Tender Qty</th>
                <th className="py-3 px-4 text-right">Revised Qty</th>
                <th className="py-3 px-4 text-right">Unit Rate ({currency})</th>
                <th className="py-3 px-4 text-right">Total Revised Sum</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                    {item.boqCode}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {item.division.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate font-medium text-slate-900 dark:text-white" title={item.itemDescription}>
                    {item.itemDescription}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-semibold">
                    {item.unitOfMeasure}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono">
                    {item.tenderQuantity.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900 dark:text-white">
                    {item.revisedQuantity.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-amber-600 dark:text-amber-400">
                    {item.unitRate.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {currency} {item.totalRevisedAmount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedBoqItemForRate(item);
                        setActiveTab('rate-analysis');
                      }}
                      className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-semibold"
                    >
                      Rate Breakdown
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Rate Analysis */}
      {activeTab === 'rate-analysis' && (
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500">Selected BOQ Item Rate Analysis:</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {selectedBoqItemForRate ? `${selectedBoqItemForRate.boqCode} — ${selectedBoqItemForRate.itemDescription}` : 'Select an item to view rate composition'}
              </h4>
            </div>
            {selectedBoqItemForRate && (
              <span className="text-base font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-xl">
                {currency} {selectedBoqItemForRate.unitRate.toFixed(2)} / {selectedBoqItemForRate.unitOfMeasure}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {selectedBoqItemForRate ? (
              <>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-xs font-medium text-slate-500">Material Cost</span>
                  <p className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                    {currency} {selectedBoqItemForRate.rateBreakdown.materialRate.toFixed(2)}
                  </p>
                  <p className="text-[11px] text-slate-400">Direct raw materials</p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-xs font-medium text-slate-500">Direct Labor Cost</span>
                  <p className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                    {currency} {selectedBoqItemForRate.rateBreakdown.laborRate.toFixed(2)}
                  </p>
                  <p className="text-[11px] text-slate-400">Gang rate & productivity</p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-xs font-medium text-slate-500">Plant & Equipment</span>
                  <p className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                    {currency} {selectedBoqItemForRate.rateBreakdown.equipmentRate.toFixed(2)}
                  </p>
                  <p className="text-[11px] text-slate-400">Fuel & mobilization</p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-xs font-medium text-slate-500">Trade Subcontractor</span>
                  <p className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                    {currency} {selectedBoqItemForRate.rateBreakdown.subcontractorRate.toFixed(2)}
                  </p>
                  <p className="text-[11px] text-slate-400">Specialist package</p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-xs font-medium text-slate-500">Overhead & Profit</span>
                  <p className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {currency} {selectedBoqItemForRate.rateBreakdown.overheadProfitRate.toFixed(2)}
                  </p>
                  <p className="text-[11px] text-slate-400">Site prelims + 12% margin</p>
                </div>
              </>
            ) : (
              <div className="col-span-5 p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                Click "Rate Breakdown" on any BOQ line in the first tab to inspect the 5-component rate analysis.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Revisions */}
      {activeTab === 'revisions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {boqRevisions.map(rev => (
              <div key={rev.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-1 rounded">
                    {rev.revisionCode}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                    {rev.status}
                  </span>
                </div>
                <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                  {rev.title}
                </h5>
                <p className="text-xs text-slate-500">
                  <strong>Reason:</strong> {rev.reason.replace(/_/g, ' ')} • <strong>Issued by:</strong> {rev.issuedBy}
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-500">Net Value Change:</span>
                  <span className={`font-mono font-bold ${rev.netFinancialImpact >= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {rev.netFinancialImpact >= 0 ? '+' : ''}{currency} {rev.netFinancialImpact.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Quantity Tracking */}
      {activeTab === 'quantity-tracking' && (
        <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Item Code</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Tender Qty</th>
                <th className="py-3 px-4 text-right">Revised Qty</th>
                <th className="py-3 px-4 text-right">Executed Qty</th>
                <th className="py-3 px-4 text-right">Certified Qty</th>
                <th className="py-3 px-4 text-center">Execution %</th>
                <th className="py-3 px-4 text-center">Variance Alert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {contractBoqItems.map(item => {
                const execPct = item.revisedQuantity > 0 ? (item.executedQuantityToDate / item.revisedQuantity) * 100 : 0;
                const isOverrun = item.executedQuantityToDate > item.revisedQuantity;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                      {item.boqCode}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white max-w-xs truncate">
                      {item.itemDescription}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono">{item.tenderQuantity.toLocaleString()} {item.unitOfMeasure}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold">{item.revisedQuantity.toLocaleString()} {item.unitOfMeasure}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-blue-600 font-semibold">{item.executedQuantityToDate.toLocaleString()} {item.unitOfMeasure}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-emerald-600 font-semibold">{item.certifiedQuantityToDate.toLocaleString()} {item.unitOfMeasure}</td>
                    <td className="py-3.5 px-4 text-center font-bold font-mono">
                      {execPct.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {isOverrun ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">
                          <AlertTriangle className="w-3 h-3" /> Overrun
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" /> Within Cap
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: New BOQ Item */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add New BOQ Line Item</h3>
              <button onClick={() => setShowAddItemModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateBOQItem} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">BOQ Item Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 03.04.01"
                    value={newCode}
                    onChange={e => setNewCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Division</label>
                  <select
                    value={newDivision}
                    onChange={e => setNewDivision(e.target.value as BOQDivision)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="DIV_01_GENERAL_REQUIREMENTS">Div 01: General Requirements</option>
                    <option value="DIV_02_EXISTING_CONDITIONS_EARTHWORKS">Div 02: Earthworks</option>
                    <option value="DIV_03_CONCRETE_WORKS">Div 03: Concrete Works</option>
                    <option value="DIV_04_MASONRY">Div 04: Masonry</option>
                    <option value="DIV_05_METALS_STRUCTURAL_STEEL">Div 05: Structural Steel</option>
                    <option value="DIV_08_OPENINGS_DOORS_WINDOWS">Div 08: Openings & Facade</option>
                    <option value="DIV_22_PLUMBING_DRAINAGE">Div 22: Plumbing</option>
                    <option value="DIV_23_HVAC_MECHANICAL">Div 23: HVAC Mechanical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Item Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Detailed engineering specification of the work item..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Unit of Measure</label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={e => setNewUnit(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Tender Qty</label>
                  <input
                    type="number"
                    value={newTenderQty}
                    onChange={e => setNewTenderQty(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Unit Rate ({currency})</label>
                  <input
                    type="number"
                    value={newRate}
                    onChange={e => setNewRate(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                >
                  Save BOQ Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Revision */}
      {showAddRevisionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Issue BOQ Addendum / Revision</h3>
              <button onClick={() => setShowAddRevisionModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateRevision} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Revision Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. REV-IFC-03"
                  value={newRevCode}
                  onChange={e => setNewRevCode(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Addendum Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Structural Steel Truss modifications for Atrium Roof"
                  value={newRevTitle}
                  onChange={e => setNewRevTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Revision Reason</label>
                  <select
                    value={newRevReason}
                    onChange={e => setNewRevReason(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="IFC_DRAWING_UPDATE">IFC Drawing Update</option>
                    <option value="TENDER_ADDENDUM">Tender Addendum</option>
                    <option value="SITE_RE_MEASUREMENT">Site Re-Measurement</option>
                    <option value="CLIENT_SCOPE_CHANGE">Client Scope Change</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Net Financial Impact ({currency})</label>
                  <input
                    type="number"
                    value={newRevImpact}
                    onChange={e => setNewRevImpact(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddRevisionModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                >
                  Publish Addendum
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

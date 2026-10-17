import React, { useState } from 'react';
import { useInventoryStore } from '../../services/inventoryStore';
import { ItemMaster, ItemCategory, UnitOfMeasure, ItemAttribute, ItemType, ValuationMethod } from '../../types';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  Layers,
  Sparkles,
  QrCode,
  Tag,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  Calculator,
  Scale,
  FileText,
  Sliders,
  DollarSign
} from 'lucide-react';

interface ItemMasterViewProps {
  initialTab?: 'items' | 'categories' | 'uoms' | 'attributes';
  onNavigate?: (route: any) => void;
}

export const ItemMasterView: React.FC<ItemMasterViewProps> = ({
  initialTab = 'items',
  onNavigate
}) => {
  const {
    items,
    categories,
    uoms,
    attributes,
    warehouses,
    createItem,
    updateItem,
    deleteItem,
    createCategory
  } = useInventoryStore();

  const [activeTab, setActiveTab] = useState<'items' | 'categories' | 'uoms' | 'attributes'>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<ItemMaster | null>(null);

  // UOM Conversion Calculator State
  const [calcFromQty, setCalcFromQty] = useState<number>(10);
  const [calcFromUom, setCalcFromUom] = useState<string>('BOX');
  const [calcToUom, setCalcToUom] = useState<string>('PCS');

  // New Item Form State
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    categoryId: categories[0]?.id || '',
    itemType: 'FINISHED_GOOD' as ItemType,
    baseUom: 'PCS',
    purchaseUom: 'PCS',
    salesUom: 'PCS',
    barcode: '',
    valuationMethod: 'FIFO' as ValuationMethod,
    defaultWarehouseId: warehouses[0]?.id || '',
    unitCostOMR: 100,
    standardCostOMR: 95,
    weightedAvgCostOMR: 98,
    sellingPriceOMR: 150,
    totalStockOnHand: 50,
    totalReservedStock: 0,
    totalAvailableStock: 50,
    totalInTransitStock: 0,
    totalQuarantineStock: 0,
    reorderPoint: 20,
    safetyStock: 10,
    minStockLevel: 10,
    maxStockLevel: 200,
    economicOrderQty: 40,
    leadTimeDays: 21,
    isBatchManaged: true,
    isSerialManaged: false,
    isExpiryTracked: false,
    countryOfOrigin: 'Sultanate of Oman',
    hsCode: '8481.80.00',
    status: 'ACTIVE' as const,
    customAttributes: {}
  });

  const filteredItems = items.filter((itm) => {
    const matchesSearch =
      itm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itm.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itm.barcode.includes(searchTerm);
    const matchesCat = selectedCategory === 'all' || itm.categoryId === selectedCategory;
    const matchesType = selectedType === 'all' || itm.itemType === selectedType;
    return matchesSearch && matchesCat && matchesType;
  });

  const handleCreateItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === formData.categoryId);
    const skuCode = formData.sku || `SKU-${Date.now().toString().slice(-6)}`;
    const barcodeCode = formData.barcode || `629110${Date.now().toString().slice(-7)}`;

    createItem({
      ...formData,
      sku: skuCode,
      barcode: barcodeCode,
      categoryName: cat?.name || 'General Category',
      totalAvailableStock: formData.totalStockOnHand - formData.totalReservedStock
    });

    setIsCreateModalOpen(false);
  };

  const calculateUomConversion = () => {
    const from = uoms.find((u) => u.code === calcFromUom);
    const to = uoms.find((u) => u.code === calcToUom);
    if (!from || !to) return 0;
    const baseQty = calcFromQty * from.conversionFactor;
    const targetQty = baseQty / to.conversionFactor;
    return targetQty;
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-800/40">
              07.01
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Item Master & Product Catalog</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Global material master records, valuation methods, category hierarchies, and conversion matrices
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('items')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'items'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Item Master ({items.length})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'categories'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Categories ({categories.length})
            </button>
            <button
              onClick={() => setActiveTab('uoms')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'uoms'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Units of Measure ({uoms.length})
            </button>
            <button
              onClick={() => setActiveTab('attributes')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'attributes'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Item Attributes ({attributes.length})
            </button>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create SKU</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ITEM MASTER LIST & CARDS */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-600 dark:text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search SKU code, item name, barcode, or specifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Item Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Item Types</option>
                <option value="FINISHED_GOOD">Finished Good</option>
                <option value="RAW_MATERIAL">Raw Material</option>
                <option value="CONSUMABLE">HSE & Consumable</option>
                <option value="SEMI_FINISHED">Semi-Finished</option>
              </select>
            </div>
          </div>

          {/* Items Data Table */}
          <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-100/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">SKU & Item Details</th>
                    <th className="py-3 px-3">Category & Type</th>
                    <th className="py-3 px-3">Valuation / Cost</th>
                    <th className="py-3 px-3">Selling Price</th>
                    <th className="py-3 px-3 text-right">On Hand</th>
                    <th className="py-3 px-3 text-right">Reserved</th>
                    <th className="py-3 px-3 text-right">Available</th>
                    <th className="py-3 px-3">Stock Buffer</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                  {filteredItems.map((item) => {
                    const isLow = item.totalStockOnHand <= item.reorderPoint;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedItemForDetail(item)}
                        className="hover:bg-slate-100/70 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-start gap-2.5">
                            <div className="p-2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-cyan-600 dark:text-cyan-400 mt-0.5">
                              <Boxes className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400 text-xs">{item.sku}</span>
                              <div className="font-medium text-slate-900 dark:text-white text-xs">{item.name}</div>
                              <div className="flex items-center gap-2 text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">
                                <span className="flex items-center gap-1 font-mono">
                                  <QrCode className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                                  {item.barcode}
                                </span>
                                <span>•</span>
                                <span>{item.baseUom}</span>
                                {item.isBatchManaged && (
                                  <span className="px-1 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[9px] border border-indigo-800/40">
                                    Batch
                                  </span>
                                )}
                                {item.isSerialManaged && (
                                  <span className="px-1 py-0.2 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-[9px] border border-sky-800/40">
                                    Serial
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                            {item.categoryName}
                          </span>
                          <span className="block text-[10px] text-slate-600 dark:text-slate-400 mt-1">{item.itemType}</span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                            OMR {item.unitCostOMR.toFixed(2)}
                          </div>
                          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                            {item.valuationMethod}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                            OMR {item.sellingPriceOMR.toFixed(2)}
                          </div>
                          <span className="text-[10px] text-slate-600 dark:text-slate-400">
                            Margin: {(((item.sellingPriceOMR - item.unitCostOMR) / item.sellingPriceOMR) * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                          {item.totalStockOnHand.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-amber-700 dark:text-amber-400 font-medium">
                          {item.totalReservedStock.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {item.totalAvailableStock.toLocaleString()}
                        </td>
                        <td className="py-3 px-3">
                          <div className="space-y-1">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                                isLow
                                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-800/50'
                                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-800/50'
                              }`}
                            >
                              {isLow ? `Reorder (Min: ${item.minStockLevel})` : `Safe (> ${item.reorderPoint})`}
                            </span>
                            <div className="text-[10px] text-slate-600 dark:text-slate-400">Lead Time: {item.leadTimeDays}d</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setSelectedItemForDetail(item)}
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 rounded transition-colors"
                              title="Edit SKU"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteItem(item.id)}
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors"
                              title="Delete SKU"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORIES HIERARCHY */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-800/50">
                    {cat.code}
                  </span>
                  <h4 className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{cat.name}</h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                  {cat.defaultValuationMethod}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">{cat.description}</p>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>GL Inventory Asset:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{cat.glAssetAccount}</span>
                </div>
                <div className="flex justify-between">
                  <span>GL Cost of Goods (COGS):</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{cat.glCogsAccount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Oman VAT Rate:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">{cat.taxRatePercent}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: UNITS OF MEASURE & CONVERSION MATRIX */}
      {activeTab === 'uoms' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* UOM List */}
          <div className="lg:col-span-2 bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Defined Units of Measure & Multipliers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {uoms.map((uom) => (
                <div
                  key={uom.code}
                  className="p-3 bg-slate-100/70 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400 text-xs">{uom.code}</span>
                      <span className="text-xs text-slate-900 dark:text-white">{uom.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400">{uom.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                      x{uom.conversionFactor}
                    </span>
                    <span className="block text-[10px] text-slate-600 dark:text-slate-400">
                      {uom.isBaseUnit ? 'Base Standard' : `rel to ${uom.baseUnitCode}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Conversion Calculator */}
          <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Calculator className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">UOM Dynamic Converter</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Convert quantities instantly across standard packaging scales</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Source Quantity</label>
                <input
                  type="number"
                  value={calcFromQty}
                  onChange={(e) => setCalcFromQty(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">From UOM</label>
                  <select
                    value={calcFromUom}
                    onChange={(e) => setCalcFromUom(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                  >
                    {uoms.map((u) => (
                      <option key={u.code} value={u.code}>{u.code} ({u.name})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">To Target UOM</label>
                  <select
                    value={calcToUom}
                    onChange={(e) => setCalcToUom(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white"
                  >
                    {uoms.map((u) => (
                      <option key={u.code} value={u.code}>{u.code} ({u.name})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-800/50 rounded-lg text-center mt-3">
                <span className="text-[10px] text-slate-600 dark:text-slate-400 uppercase tracking-wider block">Equivalent Converted Output</span>
                <span className="text-xl font-bold font-mono text-cyan-600 dark:text-cyan-400">
                  {calculateUomConversion()} {calcToUom}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ITEM ATTRIBUTES & METADATA SPECS */}
      {activeTab === 'attributes' && (
        <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Configured Material Technical Attributes</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Dynamic attribute schemas for engineering, chemical, and electrical SKUs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {attributes.map((attr) => (
              <div
                key={attr.id}
                className="p-3 bg-slate-100/70 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400">{attr.attributeKey}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                    {attr.dataType}
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-900 dark:text-white">{attr.attributeLabel}</div>
                {attr.options && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {attr.options.map((opt) => (
                      <span key={opt} className="px-1.5 py-0.5 rounded text-[9px] bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                        {opt}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE SKU MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Boxes className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Master SKU</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateItemSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">SKU Code (e.g. SKU-VLV-99001)</label>
                  <input
                    type="text"
                    required
                    placeholder="Auto or Custom SKU"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Item Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Item Name / Technical Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Forged Carbon Steel Ball Valve 8 Inch CL300"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Description & Engineering Specifications</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                  placeholder="Material specs, pressure rating, standards..."
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Base Unit (UOM)</label>
                  <select
                    value={formData.baseUom}
                    onChange={(e) => setFormData({ ...formData, baseUom: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                  >
                    {uoms.map((u) => (
                      <option key={u.code} value={u.code}>{u.code} ({u.name})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Valuation Method</label>
                  <select
                    value={formData.valuationMethod}
                    onChange={(e) => setFormData({ ...formData, valuationMethod: e.target.value as ValuationMethod })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                  >
                    <option value="FIFO">FIFO (First-In First-Out)</option>
                    <option value="WEIGHTED_AVERAGE">Weighted Average Cost</option>
                    <option value="STANDARD_COST">Standard Costing</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Default Warehouse</label>
                  <select
                    value={formData.defaultWarehouseId}
                    onChange={(e) => setFormData({ ...formData, defaultWarehouseId: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Unit Cost (OMR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.unitCostOMR}
                    onChange={(e) => setFormData({ ...formData, unitCostOMR: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Selling Price (OMR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.sellingPriceOMR}
                    onChange={(e) => setFormData({ ...formData, sellingPriceOMR: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Initial Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.totalStockOnHand}
                    onChange={(e) => setFormData({ ...formData, totalStockOnHand: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Reorder Point (ROP)</label>
                  <input
                    type="number"
                    value={formData.reorderPoint}
                    onChange={(e) => setFormData({ ...formData, reorderPoint: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Safety Stock Buffer</label>
                  <input
                    type="number"
                    value={formData.safetyStock}
                    onChange={(e) => setFormData({ ...formData, safetyStock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Lead Time (Days)</label>
                  <input
                    type="number"
                    value={formData.leadTimeDays}
                    onChange={(e) => setFormData({ ...formData, leadTimeDays: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBatchManaged}
                    onChange={(e) => setFormData({ ...formData, isBatchManaged: e.target.checked })}
                    className="rounded border-slate-300 dark:border-slate-700 text-cyan-600 dark:text-cyan-400 focus:ring-0"
                  />
                  <span className="text-slate-700 dark:text-slate-300">Batch Lot Managed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isSerialManaged}
                    onChange={(e) => setFormData({ ...formData, isSerialManaged: e.target.checked })}
                    className="rounded border-slate-300 dark:border-slate-700 text-cyan-600 dark:text-cyan-400 focus:ring-0"
                  />
                  <span className="text-slate-700 dark:text-slate-300">Serial Number Managed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isExpiryTracked}
                    onChange={(e) => setFormData({ ...formData, isExpiryTracked: e.target.checked })}
                    className="rounded border-slate-300 dark:border-slate-700 text-cyan-600 dark:text-cyan-400 focus:ring-0"
                  />
                  <span className="text-slate-700 dark:text-slate-300">FEFO Expiry Tracked</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors"
                >
                  Register SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedItemForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">{selectedItemForDetail.sku}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedItemForDetail.name}</h3>
              </div>
              <button
                onClick={() => setSelectedItemForDetail(null)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-100/60 dark:bg-slate-800/60 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400 block">Total On Hand</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">{selectedItemForDetail.totalStockOnHand} {selectedItemForDetail.baseUom}</span>
              </div>
              <div className="p-3 bg-slate-100/60 dark:bg-slate-800/60 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400 block">Reserved For Orders</span>
                <span className="text-lg font-bold text-amber-700 dark:text-amber-400 font-mono">{selectedItemForDetail.totalReservedStock} {selectedItemForDetail.baseUom}</span>
              </div>
              <div className="p-3 bg-slate-100/60 dark:bg-slate-800/60 rounded-lg">
                <span className="text-slate-600 dark:text-slate-400 block">Net Available</span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">{selectedItemForDetail.totalAvailableStock} {selectedItemForDetail.baseUom}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-semibold text-slate-700 dark:text-slate-300">Technical Specifications & Custom Attributes</h4>
              <div className="p-3 bg-slate-100/70 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5">
                {Object.entries(selectedItemForDetail.customAttributes).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="font-medium text-slate-900 dark:text-white">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedItemForDetail(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

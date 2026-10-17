import React, { useState } from 'react';
import { useProcurement } from '../../services/procurementStore';
import { PurchaseOrder, BlanketPurchaseOrder, POLineItem, CurrencyCode } from '../../types';
import {
  FileCheck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  Layers,
  FileText,
  Truck,
  DollarSign,
  AlertTriangle
} from 'lucide-react';

export const PurchaseOrdersView: React.FC = () => {
  const {
    purchaseOrders,
    blanketPOs,
    createPurchaseOrder,
    approvePurchaseOrder,
    issuePoToVendor,
    createBlanketPO,
    createReleaseOrderFromBlanket,
    suppliers
  } = useProcurement();

  const [activeTab, setActiveTab] = useState<'standard' | 'blanket' | 'tracking'>('standard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPo, setSelectedPo] = useState<PurchaseOrder | null>(null);
  const [showCreatePoModal, setShowCreatePoModal] = useState(false);
  const [showBlanketModal, setShowBlanketModal] = useState(false);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [targetBlanket, setTargetBlanket] = useState<BlanketPurchaseOrder | null>(null);

  // Standard PO Form
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [poCurrency, setPoCurrency] = useState<CurrencyCode>('OMR');
  const [poDeliveryDate, setPoDeliveryDate] = useState(
    new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0]
  );
  const [poPaymentTerms, setPoPaymentTerms] = useState('Net 60 Days from GRN');
  const [poIncoterms, setPoIncoterms] = useState('DDP Site Delivery');
  const [poDeliveryAddr, setPoDeliveryAddr] = useState('Central Warehouse / Site Location, Oman');
  const [poSpecialInstructions, setPoSpecialInstructions] = useState('');

  // PO Line item form
  const [lines, setLines] = useState<Omit<POLineItem, 'id' | 'receivedQuantity' | 'invoicedQuantity' | 'lineTotal' | 'lineStatus'>[]>([
    {
      itemCode: 'MAT-GEN-01',
      itemDescription: 'Industrial Distribution Components Package',
      orderedQuantity: 100,
      unitOfMeasure: 'Units',
      unitPrice: 150,
      discountPercentage: 0,
      vatRatePercentage: 5,
      glAccountCode: '1410-02-001',
      deliveryDate: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0]
    }
  ]);

  // Blanket PO Form
  const [blanketTitle, setBlanketTitle] = useState('');
  const [blanketCeiling, setBlanketCeiling] = useState<number>(500000);
  const [blanketExpiry, setBlanketExpiry] = useState('2026-12-31');
  const [blanketTerms, setBlanketTerms] = useState('');

  // Release Order Form
  const [releaseAmount, setReleaseAmount] = useState<number>(25000);
  const [releaseDesc, setReleaseDesc] = useState('');

  const formatOMR = (amt: number) =>
    `OMR ${amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleCreatePoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const supp = suppliers.find((s) => s.id === selectedSupplierId);
    if (!supp) return;

    const poLines: POLineItem[] = lines.map((l, idx) => {
      const net = l.orderedQuantity * l.unitPrice;
      return {
        ...l,
        id: `poline-${Date.now()}-${idx}`,
        receivedQuantity: 0,
        invoicedQuantity: 0,
        lineTotal: net,
        lineStatus: 'Open'
      };
    });

    const subtotal = poLines.reduce((acc, curr) => acc + curr.lineTotal, 0);
    const vatTotal = subtotal * 0.05;
    const grandTotal = subtotal + vatTotal;

    const newPo = createPurchaseOrder({
      poType: 'Standard PO',
      orderDate: new Date().toISOString().split('T')[0],
      promisedDeliveryDate: poDeliveryDate,
      supplierId: supp.id,
      supplierName: supp.name,
      supplierContact: supp.primaryContactName,
      supplierTaxNumber: supp.taxIdentificationNumber,
      currency: poCurrency,
      exchangeRate: poCurrency === 'USD' ? 0.385 : 1.0,
      subtotal,
      vatTotal,
      grandTotal,
      paymentTerms: poPaymentTerms,
      incoterms: poIncoterms,
      deliveryAddress: poDeliveryAddr,
      buyerName: 'Fatma Al-Hasani (Lead Buyer)',
      status: 'Pending Approval',
      approvalLevel: grandTotal > 50000 ? 'Tier 3 (CFO / Director)' : 'Tier 2 (Procurement Mgr)',
      lines: poLines,
      specialInstructions: poSpecialInstructions || 'Inspect factory test certificates prior to dispatch.'
    });

    setShowCreatePoModal(false);
  };

  const handleCreateBlanketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const supp = suppliers.find((s) => s.id === selectedSupplierId);
    if (!supp) return;

    createBlanketPO({
      agreementTitle: blanketTitle,
      supplierId: supp.id,
      supplierName: supp.name,
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: blanketExpiry,
      currency: 'OMR',
      agreedCeilingAmount: Number(blanketCeiling),
      releasedAmount: 0,
      remainingAmount: Number(blanketCeiling),
      numberOfReleaseOrders: 0,
      status: 'Active',
      agreedTerms: blanketTerms || 'Locked rate contract for 12 months with quarterly price reviews.',
      priceLockGuarantee: true
    });

    setShowBlanketModal(false);
    setBlanketTitle('');
  };

  const handleReleaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBlanket) return;

    createReleaseOrderFromBlanket(targetBlanket.id, Number(releaseAmount), releaseDesc);
    setShowReleaseModal(false);
    setTargetBlanket(null);
  };

  const filteredPOs = purchaseOrders.filter(
    (p) =>
      p.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.buyerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('standard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'standard'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>05.05.01 Standard POs</span>
          </button>
          <button
            onClick={() => setActiveTab('blanket')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'blanket'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>05.05.02 Blanket Framework POs</span>
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'tracking'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>05.05.04 Fulfillment Tracking</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'standard' && (
            <button
              onClick={() => setShowCreatePoModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Purchase Order</span>
            </button>
          )}
          {activeTab === 'blanket' && (
            <button
              onClick={() => setShowBlanketModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Blanket Framework Agreement</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: STANDARD PURCHASE ORDERS */}
      {activeTab === 'standard' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search PO #, supplier name, buyer..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
                    <th className="py-3 px-4">PO Number & Date</th>
                    <th className="py-3 px-4">Supplier & Contact</th>
                    <th className="py-3 px-4">Delivery Deadline</th>
                    <th className="py-3 px-4 text-right">Grand Total (OMR)</th>
                    <th className="py-3 px-4">Approval Tier</th>
                    <th className="py-3 px-4">Order Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredPOs.map((po) => (
                    <tr key={po.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-900 dark:text-slate-100">{po.poNumber}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{po.orderDate}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{po.supplierName}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{po.supplierContact}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">{po.promisedDeliveryDate}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                        {formatOMR(po.grandTotalOMR)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">{po.approvalLevel}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            po.status === 'Approved'
                              ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-200'
                              : po.status === 'Issued to Vendor'
                              ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-200'
                              : po.status === 'Received'
                              ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                              : po.status === 'Closed'
                              ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-200'
                              : 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200'
                          }`}
                        >
                          {po.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedPo(po)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer"
                        >
                          View & Approve
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

      {/* TAB 2: BLANKET FRAMEWORK AGREEMENTS */}
      {activeTab === 'blanket' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blanketPOs.map((bpo) => (
            <div key={bpo.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {bpo.blanketPoNumber}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">{bpo.agreementTitle}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{bpo.supplierName}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                  {bpo.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block">Ceiling Limit</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{formatOMR(bpo.agreedCeilingAmount)}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block">Released Total</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{formatOMR(bpo.releasedAmount)}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block">Remaining</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatOMR(bpo.remainingAmount)}</span>
                </div>
              </div>

              {/* Meter */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (bpo.releasedAmount / (bpo.agreedCeilingAmount || 1)) * 100)}%`
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500 dark:text-slate-400">{bpo.numberOfReleaseOrders} Call-Off Release Orders</span>
                <button
                  onClick={() => {
                    setTargetBlanket(bpo);
                    setShowReleaseModal(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-xs cursor-pointer"
                >
                  Issue Call-Off Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: ORDER FULFILLMENT TRACKING */}
      {activeTab === 'tracking' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Purchase Order Line-Item Receipt & Invoicing Status</h3>

          <div className="space-y-4">
            {purchaseOrders.map((po) => (
              <div key={po.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{po.poNumber}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">• {po.supplierName}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{formatOMR(po.grandTotalOMR)}</span>
                </div>

                <div className="space-y-2">
                  {po.lines.map((l) => {
                    const recPct = Math.round((l.receivedQuantity / (l.orderedQuantity || 1)) * 100);
                    return (
                      <div key={l.id} className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1.5">
                        <div className="flex justify-between font-medium text-slate-800 dark:text-slate-200">
                          <span>{l.itemDescription}</span>
                          <span>
                            Ordered: {l.orderedQuantity} {l.unitOfMeasure} | Received: {l.receivedQuantity} | Invoiced: {l.invoicedQuantity}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${recPct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PO DETAIL & APPROVAL MODAL */}
      {selectedPo && (
        <div className="fixed inset-0 z-50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">{selectedPo.poNumber}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {selectedPo.status}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  Ordered on {selectedPo.orderDate} by {selectedPo.buyerName}
                </p>
              </div>
              <button
                onClick={() => setSelectedPo(null)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-400 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* General Information */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block">Supplier</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedPo.supplierName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block">Payment Terms</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedPo.paymentTerms}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block">Incoterms</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedPo.incoterms}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block">Grand Total</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{formatOMR(selectedPo.grandTotalOMR)}</span>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">Order Line Items</span>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Item Description</th>
                      <th className="p-2.5 text-right">Qty</th>
                      <th className="p-2.5 text-right">Unit Price</th>
                      <th className="p-2.5 text-right">VAT (5%)</th>
                      <th className="p-2.5 text-right">Total (OMR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedPo.lines.map((l) => (
                      <tr key={l.id}>
                        <td className="p-2.5 font-medium text-slate-900 dark:text-slate-100">{l.itemDescription}</td>
                        <td className="p-2.5 text-right font-medium text-slate-800 dark:text-slate-200">
                          {l.orderedQuantity} {l.unitOfMeasure}
                        </td>
                        <td className="p-2.5 text-right text-slate-700 dark:text-slate-300">{formatOMR(l.unitPrice)}</td>
                        <td className="p-2.5 text-right text-slate-700 dark:text-slate-300">{formatOMR(l.lineTotal * 0.05)}</td>
                        <td className="p-2.5 text-right font-bold text-slate-900 dark:text-slate-100">
                          {formatOMR(l.lineTotal * 1.05)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg text-[11px]">
              <span className="font-bold">Instructions:</span> {selectedPo.specialInstructions}
            </p>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <div>
                {selectedPo.approvedBy && (
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium text-xs">
                    ✓ Approved by {selectedPo.approvedBy} on {selectedPo.approvedDate}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedPo.status === 'Pending Approval' && (
                  <button
                    onClick={() => {
                      approvePurchaseOrder(selectedPo.id, 'Mazin Al-Hinai (CPO)');
                      setSelectedPo(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs cursor-pointer"
                  >
                    Execute Approval Signoff
                  </button>
                )}

                {selectedPo.status === 'Approved' && (
                  <button
                    onClick={() => {
                      issuePoToVendor(selectedPo.id);
                      setSelectedPo(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs cursor-pointer"
                  >
                    Issue PO to Vendor (EDI/Email)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PO MODAL */}
      {showCreatePoModal && (
        <div className="fixed inset-0 z-50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Create Standard Purchase Order (PO)</h3>
            <form onSubmit={handleCreatePoSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Select Supplier</label>
                  <select
                    value={selectedSupplierId}
                    onChange={(e) => setSelectedSupplierId(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Promised Delivery Date</label>
                  <input
                    type="date"
                    required
                    value={poDeliveryDate}
                    onChange={(e) => setPoDeliveryDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Incoterms</label>
                  <input
                    type="text"
                    value={poIncoterms}
                    onChange={(e) => setPoIncoterms(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Payment Terms</label>
                  <input
                    type="text"
                    value={poPaymentTerms}
                    onChange={(e) => setPoPaymentTerms(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Delivery Destination</label>
                <input
                  type="text"
                  value={poDeliveryAddr}
                  onChange={(e) => setPoDeliveryAddr(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreatePoModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs cursor-pointer"
                >
                  Generate PO Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE BLANKET PO MODAL */}
      {showBlanketModal && (
        <div className="fixed inset-0 z-50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">New Blanket Purchase Agreement</h3>
            <form onSubmit={handleCreateBlanketSubmit} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Agreement Title</label>
                <input
                  type="text"
                  required
                  value={blanketTitle}
                  onChange={(e) => setBlanketTitle(e.target.value)}
                  placeholder="e.g. Annual Rate Contract for Heavy Cables"
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Contractor / Supplier</label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Agreed Ceiling Limit (OMR)</label>
                <input
                  type="number"
                  required
                  value={blanketCeiling}
                  onChange={(e) => setBlanketCeiling(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBlanketModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold cursor-pointer"
                >
                  Create Blanket Agreement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RELEASE ORDER MODAL */}
      {showReleaseModal && targetBlanket && (
        <div className="fixed inset-0 z-50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Issue Call-Off Release Order</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Agreement: <span className="font-bold text-slate-900 dark:text-slate-100">{targetBlanket.agreementTitle}</span>
              <br />
              Remaining Ceiling: <span className="font-bold text-emerald-700 dark:text-emerald-300">{formatOMR(targetBlanket.remainingAmount)}</span>
            </p>

            <form onSubmit={handleReleaseSubmit} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Release Amount (OMR)</label>
                <input
                  type="number"
                  required
                  max={targetBlanket.remainingAmount}
                  value={releaseAmount}
                  onChange={(e) => setReleaseAmount(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Release Order Description / Lot</label>
                <input
                  type="text"
                  required
                  value={releaseDesc}
                  onChange={(e) => setReleaseDesc(e.target.value)}
                  placeholder="e.g. Call-off batch #4 for Sohar substation delivery"
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowReleaseModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer"
                >
                  Confirm Release Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

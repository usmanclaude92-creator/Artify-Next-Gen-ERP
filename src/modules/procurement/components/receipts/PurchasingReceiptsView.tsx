import React, { useState } from 'react';
import { useProcurement } from '../../services/procurementStore';
import { GoodsReceiptNote, ServiceEntrySheet, GRNLineItem } from '../../types';
import {
  PackageCheck,
  ClipboardList,
  ShieldCheck,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertOctagon,
  FileText,
  Warehouse,
  Truck
} from 'lucide-react';
import { mockRandom } from '@/src/utils/mockRandom';

export const PurchasingReceiptsView: React.FC = () => {
  const {
    grns,
    serviceSheets,
    createGoodsReceiptNote,
    createServiceEntrySheet,
    inspectGrnLine,
    approveServiceEntrySheet,
    purchaseOrders
  } = useProcurement();

  const [activeTab, setActiveTab] = useState<'grn' | 'ses' | 'inspection'>('grn');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateGrnModal, setShowCreateGrnModal] = useState(false);
  const [showCreateSesModal, setShowCreateSesModal] = useState(false);
  const [selectedGrn, setSelectedGrn] = useState<GoodsReceiptNote | null>(null);

  // GRN Form
  const [selectedPoId, setSelectedPoId] = useState(purchaseOrders[0]?.id || '');
  const [deliveryNoteNumber, setDeliveryNoteNumber] = useState('');
  const [carrierName, setCarrierName] = useState('Oman National Transport Logistics');
  const [vehiclePlate, setVehiclePlate] = useState('OM-74892-A');
  const [warehouseLocation, setWarehouseLocation] = useState('Main Warehouse Rusayl - Bay 4');

  // SES Form
  const [sesTitle, setSesTitle] = useState('');
  const [sesVendor, setSesVendor] = useState('Bahwan IT Solutions LLC');
  const [sesHours, setSesHours] = useState<number>(120);
  const [sesAmount, setSesAmount] = useState<number>(7500);
  const [sesDeliverables, setSesDeliverables] = useState('');

  // Inspection Form
  const [selectedGrnForInspect, setSelectedGrnForInspect] = useState<GoodsReceiptNote | null>(null);
  const [acceptedQty, setAcceptedQty] = useState<number>(0);
  const [rejectedQty, setRejectedQty] = useState<number>(0);
  const [quarantineQty, setQuarantineQty] = useState<number>(0);
  const [qcNotes, setQcNotes] = useState('');

  const formatOMR = (amt: number) =>
    `OMR ${amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleCreateGrnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const po = purchaseOrders.find((p) => p.id === selectedPoId);
    if (!po) return;

    const grnLines: GRNLineItem[] = po.lines.map((l, idx) => ({
      id: `grnline-${Date.now()}-${idx}`,
      poLineId: l.id,
      itemCode: l.itemCode,
      itemDescription: l.itemDescription,
      orderedQty: l.orderedQuantity,
      previouslyReceivedQty: l.receivedQuantity ?? 0,
      deliveredQty: l.orderedQuantity, // Default to full delivery
      acceptedQty: l.orderedQuantity,
      rejectedQty: 0,
      quarantineQty: 0,
      unitOfMeasure: l.unitOfMeasure,
      unitPrice: l.unitPrice ?? 0,
      lineTotal: (l.unitPrice ?? 0) * l.orderedQuantity,
      batchNumber: `LOT-2026-${Math.floor(1000 + mockRandom() * 9000)}`,
      storageWarehouseId: 'WH-MAIN',
      storageBinLocation: warehouseLocation,
      inspectionResult: 'Pending',
      qcInspectionStatus: 'Pending Inspection'
    }));

    createGoodsReceiptNote({
      poId: po.id,
      poNumber: po.poNumber,
      supplierId: po.supplierId,
      supplierName: po.supplierName,
      receiptDate: new Date().toISOString().split('T')[0],
      deliveryNoteNumber: deliveryNoteNumber || `DN-${Math.floor(100000 + mockRandom() * 900000)}`,
      carrierName,
      vehiclePlateNumber: vehiclePlate,
      receivedBy: 'Yahya Al-Maamari (Receiving Officer)',
      warehouseLocation,
      qcInspector: 'Quality Control Lead Inspector',
      inspectionDate: new Date().toISOString().split('T')[0],
      overallQcStatus: 'Passed',
      status: 'Received',
      lines: grnLines,
      qcReportSummary: 'Physical shipment unloaded, lot tags applied, ready for QC lab checks.'
    });

    setShowCreateGrnModal(false);
  };

  const handleCreateSesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createServiceEntrySheet({
      sesTitle,
      poNumber: 'PO-2026-004',
      supplierName: sesVendor,
      serviceStartDate: '2026-02-01',
      serviceEndDate: '2026-02-28',
      serviceHoursLogged: Number(sesHours),
      serviceAmountClaimedOMR: Number(sesAmount),
      serviceAmountApprovedOMR: Number(sesAmount),
      serviceProviderLead: 'Anand Sundaram (Principal Consultant)',
      supervisingEngineer: 'Eng. Khalid Al-Farsi',
      status: 'Pending Verification',
      verifiedDeliverables: sesDeliverables || 'System rollout milestone 3 and user training completed.'
    });

    setShowCreateSesModal(false);
  };

  const handleExecuteInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrnForInspect) return;

    const line = selectedGrnForInspect.lines[0];
    if (line) {
      inspectGrnLine(
        selectedGrnForInspect.id,
        line.id,
        Number(acceptedQty),
        Number(rejectedQty),
        Number(quarantineQty),
        rejectedQty > 0 ? 'Quarantined' : 'Passed',
        qcNotes || 'Standard dimension, insulation, and spark testing completed.'
      );
    }

    setSelectedGrnForInspect(null);
  };

  return (
    <div className="space-y-6">
      {/* Sub-header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('grn')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'grn'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>05.06.01 Goods Receipt Notes (GRN)</span>
          </button>
          <button
            onClick={() => setActiveTab('ses')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'ses'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>05.06.02 Service Entry Sheets (SES)</span>
          </button>
          <button
            onClick={() => setActiveTab('inspection')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'inspection'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>05.06.03 QA/QC Inspection & Quarantine</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'grn' && (
            <button
              onClick={() => setShowCreateGrnModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create GRN Receipt</span>
            </button>
          )}
          {activeTab === 'ses' && (
            <button
              onClick={() => setShowCreateSesModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Service Entry Sheet</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: GOODS RECEIPT NOTES */}
      {activeTab === 'grn' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700">
                  <th className="py-3 px-4">GRN Number</th>
                  <th className="py-3 px-4">PO Reference</th>
                  <th className="py-3 px-4">Supplier & Delivery Note</th>
                  <th className="py-3 px-4">Warehouse & Received By</th>
                  <th className="py-3 px-4">Lines & Items</th>
                  <th className="py-3 px-4">QC Status</th>
                  <th className="py-3 px-4">Receipt Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {grns.map((grn) => (
                  <tr key={grn.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900 dark:text-slate-100">{grn.grnNumber}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{grn.receiptDate}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-indigo-600 dark:text-indigo-400">{grn.poNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{grn.supplierName}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">DN: {grn.deliveryNoteNumber}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{grn.warehouseLocation}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">By: {grn.receivedByWarehouseOfficer}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{grn.lines.length} Line Item(s)</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-xs">
                        {grn.lines[0]?.itemDescription} ({grn.lines[0]?.acceptedQty} Accepted)
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          grn.overallQcStatus === 'Passed'
                            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                            : grn.overallQcStatus === 'Quarantined'
                            ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {grn.overallQcStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        {grn.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedGrn(grn)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                      >
                        GRN Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SERVICE ENTRY SHEETS (SES) */}
      {activeTab === 'ses' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceSheets.map((ses) => (
              <div key={ses.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {ses.sesNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                      {ses.status}
                    </span>
                  </div>
                  <span className="font-mono text-slate-500 dark:text-slate-400">{ses.poNumber}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{ses.sesTitle}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">{ses.supplierName}</p>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block">Service Period</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{ses.serviceStartDate} → {ses.serviceEndDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block">Approved Amount</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">{formatOMR(ses.serviceAmountApprovedOMR)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block">Hours Logged</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{ses.serviceHoursLogged} Hours</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block">Supervising Eng.</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{ses.supervisingEngineer}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-slate-600 dark:text-slate-400 text-[11px]">
                  <span className="font-bold">Verified Deliverables:</span> {ses.verifiedDeliverables}
                </div>

                {ses.status === 'Pending Verification' && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => approveServiceEntrySheet(ses.id, 'Eng. Khalid Al-Farsi')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs cursor-pointer"
                    >
                      Sign Off & Certify SES
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: QA/QC INSPECTION */}
      {activeTab === 'inspection' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Goods Receipt Quality Control & Quarantine Register</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Non-destructive testing, sample validation, quarantine holds, and rejection logs prior to inventory valuation.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {grns.map((g) => (
              <div key={g.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{g.grnNumber}</span>
                    <span className="text-slate-500 dark:text-slate-400 ml-2">({g.supplierName} • {g.poNumber})</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      g.overallQcStatus === 'Passed'
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                        : 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200'
                    }`}
                  >
                    QC: {g.overallQcStatus}
                  </span>
                </div>

                <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-2.5">Item Description</th>
                        <th className="p-2.5">Batch / Lot #</th>
                        <th className="p-2.5 text-right">Received</th>
                        <th className="p-2.5 text-right text-emerald-700 dark:text-emerald-300">Accepted</th>
                        <th className="p-2.5 text-right text-rose-700 dark:text-rose-300">Rejected</th>
                        <th className="p-2.5 text-right text-amber-700 dark:text-amber-300">Quarantine</th>
                        <th className="p-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {g.lines.map((l) => (
                        <tr key={l.id}>
                          <td className="p-2.5 font-medium text-slate-900 dark:text-slate-100">{l.itemDescription}</td>
                          <td className="p-2.5 font-mono text-slate-600 dark:text-slate-400">{l.batchNumber || 'N/A'}</td>
                          <td className="p-2.5 text-right font-medium text-slate-800 dark:text-slate-200">
                            {l.deliveredQty} {l.unitOfMeasure}
                          </td>
                          <td className="p-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400">{l.acceptedQty}</td>
                          <td className="p-2.5 text-right font-bold text-rose-600 dark:text-rose-400">{l.rejectedQty}</td>
                          <td className="p-2.5 text-right font-bold text-amber-600 dark:text-amber-400">{l.quarantineQty}</td>
                          <td className="p-2.5 text-right">
                            <button
                              onClick={() => {
                                setSelectedGrnForInspect(g);
                                setAcceptedQty(l.acceptedQty);
                                setRejectedQty(l.rejectedQty);
                                setQuarantineQty(l.quarantineQty);
                              }}
                              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                            >
                              Update QC
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <span className="font-bold">Inspector:</span> {g.qcInspector} • {g.qcReportSummary}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QC INSPECTION MODAL */}
      {selectedGrnForInspect && (
        <div className="fixed inset-0 z-50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Execute Quality Inspection Signoff</h3>
            <p className="text-slate-600 dark:text-slate-400">GRN Ref: {selectedGrnForInspect.grnNumber}</p>

            <form onSubmit={handleExecuteInspection} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-emerald-700 dark:text-emerald-300 block mb-1">Accepted Qty</label>
                  <input
                    type="number"
                    min={0}
                    value={acceptedQty}
                    onChange={(e) => setAcceptedQty(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-rose-700 dark:text-rose-300 block mb-1">Rejected Qty</label>
                  <input
                    type="number"
                    min={0}
                    value={rejectedQty}
                    onChange={(e) => setRejectedQty(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-amber-700 dark:text-amber-300 block mb-1">Quarantine</label>
                  <input
                    type="number"
                    min={0}
                    value={quarantineQty}
                    onChange={(e) => setQuarantineQty(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">QC Lab Inspection Summary</label>
                <textarea
                  rows={3}
                  value={qcNotes}
                  onChange={(e) => setQcNotes(e.target.value)}
                  placeholder="Material test certificates, hydrostatic test logs, sample batch pass/fail..."
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedGrnForInspect(null)}
                  className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold cursor-pointer"
                >
                  Save Inspection Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE GRN MODAL */}
      {showCreateGrnModal && (
        <div className="fixed inset-0 z-50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Create Goods Receipt Note (GRN)</h3>
            <form onSubmit={handleCreateGrnSubmit} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Select Purchase Order</label>
                <select
                  value={selectedPoId}
                  onChange={(e) => setSelectedPoId(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  {purchaseOrders.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.poNumber} — {p.supplierName} ({formatOMR(p.grandTotalOMR)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Vendor Delivery Note #</label>
                  <input
                    type="text"
                    required
                    value={deliveryNoteNumber}
                    onChange={(e) => setDeliveryNoteNumber(e.target.value)}
                    placeholder="e.g. DN-849204"
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Carrier / Truck Plate</label>
                  <input
                    type="text"
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Warehouse Staging Bay</label>
                <input
                  type="text"
                  value={warehouseLocation}
                  onChange={(e) => setWarehouseLocation(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateGrnModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold cursor-pointer"
                >
                  Generate GRN Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE SES MODAL */}
      {showCreateSesModal && (
        <div className="fixed inset-0 z-50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Create Service Entry Sheet (SES)</h3>
            <form onSubmit={handleCreateSesSubmit} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Service Title / Scope</label>
                <input
                  type="text"
                  required
                  value={sesTitle}
                  onChange={(e) => setSesTitle(e.target.value)}
                  placeholder="e.g. ERP Cloud Integration Consulting & Customization Services"
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Service Provider</label>
                  <input
                    type="text"
                    value={sesVendor}
                    onChange={(e) => setSesVendor(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Amount Claimed (OMR)</label>
                  <input
                    type="number"
                    required
                    value={sesAmount}
                    onChange={(e) => setSesAmount(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Verified Deliverables & Milestone</label>
                <textarea
                  rows={3}
                  value={sesDeliverables}
                  onChange={(e) => setSesDeliverables(e.target.value)}
                  placeholder="Documented milestones completed, test cases passed, and signoffs..."
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateSesModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold cursor-pointer"
                >
                  Log Service Entry Sheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

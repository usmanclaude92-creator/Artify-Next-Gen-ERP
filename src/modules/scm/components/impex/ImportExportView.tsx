// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 12: SUPPLY CHAIN MANAGEMENT (SCM)
// 12.05 — Import & Export View (Customs, Tariffs & Trade Compliance)
// ==========================================

import React, { useState } from 'react';
import { useScmStore } from '../../services/scmStore';
import { CustomsDeclaration, DeclarationType, CustomsStatus, TradeComplianceRecord } from '../../types';
import {
  Globe,
  FileCheck,
  ShieldCheck,
  Calculator,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  Download,
  Building,
  ShieldAlert,
  Zap,
  ArrowRight
} from 'lucide-react';

export const ImportExportView: React.FC = () => {
  const {
    customsDeclarations,
    tradeComplianceRecords,
    createCustomsDeclaration,
    updateCustomsStatus,
    runTradeComplianceScreening,
    currency
  } = useScmStore();

  const [activeSubTab, setActiveSubTab] = useState<'bayan' | 'compliance' | 'calculator'>('bayan');
  const [showNewBayanModal, setShowNewBayanModal] = useState(false);
  const [screeningPartnerName, setScreeningPartnerName] = useState('');
  const [screeningPartnerType, setScreeningPartnerType] = useState<TradeComplianceRecord['partnerType']>('Supplier');

  // Duty Calculator Interactive state
  const [calcCifValue, setCalcCifValue] = useState<number>(100000);
  const [calcDutyRate, setCalcDutyRate] = useState<number>(5.0);
  const [calcVatRate, setCalcVatRate] = useState<number>(5.0);

  const calculatedDuty = Math.round(calcCifValue * (calcDutyRate / 100));
  const calculatedVat = Math.round((calcCifValue + calculatedDuty) * (calcVatRate / 100));
  const calculatedTotalPayable = calculatedDuty + calculatedVat;

  // New Bayan Declaration Form
  const [newBayanForm, setNewBayanForm] = useState({
    type: 'Import Bayan' as DeclarationType,
    commercialInvoiceNumber: 'INV-EU-2026-9921',
    billOfLading: 'MAEU98214410',
    importerExporterName: 'Artify Global Technologies LLC',
    customsPortCode: 'OM-SOH-SEA' as CustomsDeclaration['customsPortCode'],
    customsPortName: 'Sohar Port Customs Terminal',
    status: 'Submitted to Bayan' as CustomsStatus,
    totalCifValue: 240000,
    totalCustomsDuty: 12000,
    totalVat: 12600,
    totalPayable: 24600,
    currency: 'OMR',
    documentsAttached: [
      { type: 'Commercial Invoice' as const, fileName: 'Invoice_9921.pdf', verified: true },
      { type: 'Packing List' as const, fileName: 'PackingList_40ft.pdf', verified: true },
      { type: 'Certificate of Origin (COO)' as const, fileName: 'COO_Certified.pdf', verified: true },
      { type: 'Bill of Lading' as const, fileName: 'Original_BL.pdf', verified: true }
    ],
    items: [
      {
        lineId: 'LINE-01',
        hsCode: '8481.80.90',
        description: 'Industrial Flow Control Valves Class 600',
        countryOfOrigin: 'Germany (DE)',
        quantity: 180,
        uom: 'Units',
        cifValue: 240000,
        dutyRatePercent: 5.0,
        calculatedDutyAmount: 12000,
        vatRatePercent: 5.0,
        vatAmount: 12600
      }
    ],
    inspectionType: 'Green Channel (Immediate)' as CustomsDeclaration['inspectionType']
  });

  const handleCreateBayan = (e: React.FormEvent) => {
    e.preventDefault();
    createCustomsDeclaration(newBayanForm);
    setShowNewBayanModal(false);
  };

  const handleRunScreening = (e: React.FormEvent) => {
    e.preventDefault();
    if (screeningPartnerName.trim()) {
      runTradeComplianceScreening(screeningPartnerName.trim(), screeningPartnerType);
      setScreeningPartnerName('');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800 tracking-wider">
                12.05 IMPORT & EXPORT
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Bayan Customs & Trade Compliance</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Customs Declarations, HS Code Tariffs & Sanctions Compliance
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Direct Oman Bayan electronic filing, automated GCC 5% tariff duty calculations, certificate of origin validation, and international sanctions screening.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewBayanModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-teal-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Bayan Declaration</span>
            </button>
          </div>
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveSubTab('bayan')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'bayan'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Customs Declarations (12.05.01 - 03)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('compliance')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'compliance'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Trade Compliance & Sanctions (12.05.04)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('calculator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'calculator'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>HS Code Duty & VAT Calculator</span>
          </button>
        </div>
      </div>

      {/* ----------------- SUB-TAB 1: CUSTOMS DECLARATIONS (BAYAN) ----------------- */}
      {activeSubTab === 'bayan' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {customsDeclarations.map((dec) => (
              <div
                key={dec.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/80 border border-teal-800/60 flex items-center justify-center text-teal-600 dark:text-teal-400">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2.5 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                          {dec.declarationNumber}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                          {dec.type}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded font-mono bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-800/60">
                          {dec.inspectionType}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        Port: {dec.customsPortName} ({dec.customsPortCode})
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold ${
                        dec.status === 'Duty Paid' || dec.status === 'Release Order Issued'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {dec.status}
                    </span>

                    {dec.status === 'Submitted to Bayan' && (
                      <button
                        onClick={() => updateCustomsStatus(dec.id, 'Duty Paid')}
                        className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-lg shadow-teal-600/20"
                      >
                        Pay Duty & Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Items & HS Code Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase font-bold border-b border-slate-200 dark:border-slate-800 text-[10px] tracking-wider font-sans">
                      <tr>
                        <th className="py-2.5 px-3">HS Tariff Code</th>
                        <th className="py-2.5 px-3">Description</th>
                        <th className="py-2.5 px-3">Origin</th>
                        <th className="py-2.5 px-3 text-right">Quantity</th>
                        <th className="py-2.5 px-3 text-right">CIF Value ({dec.currency})</th>
                        <th className="py-2.5 px-3 text-right">Duty (5%)</th>
                        <th className="py-2.5 px-3 text-right">VAT (5%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/80 font-mono">
                      {dec.items.map((it) => (
                        <tr key={it.lineId} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 text-teal-600 dark:text-teal-400 font-bold">{it.hsCode}</td>
                          <td className="py-2.5 px-3 font-sans text-slate-700 dark:text-slate-300">{it.description}</td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 font-sans">{it.countryOfOrigin}</td>
                          <td className="py-2.5 px-3 text-right text-slate-800 dark:text-slate-200">{it.quantity} {it.uom}</td>
                          <td className="py-2.5 px-3 text-right text-slate-900 dark:text-white font-bold">{it.cifValue.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right text-amber-700 dark:text-amber-400 font-bold">{it.calculatedDutyAmount.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right text-cyan-600 dark:text-cyan-400 font-bold">{it.vatAmount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Attached Verified Documents Badges */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-500 dark:text-slate-400 font-bold">Customs Verification:</span>
                    {dec.documentsAttached.map((doc, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[11px] flex items-center gap-1 font-mono"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        {doc.type}
                      </span>
                    ))}
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-slate-600 dark:text-slate-400 text-xs">Total Duty & VAT Payable: </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm">
                      {dec.totalPayable.toLocaleString()} {dec.currency}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 2: TRADE COMPLIANCE & SANCTIONS ----------------- */}
      {activeSubTab === 'compliance' && (
        <div className="space-y-6">
          {/* Real-time Screening Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Real-Time Sanctions Screening Engine (OFAC, EU, UN, GCC Lists)</span>
            </h3>

            <form onSubmit={handleRunScreening} className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                required
                placeholder="Enter corporate entity or bank name for instant screening..."
                value={screeningPartnerName}
                onChange={(e) => setScreeningPartnerName(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />

              <select
                value={screeningPartnerType}
                onChange={(e) => setScreeningPartnerType(e.target.value as TradeComplianceRecord['partnerType'])}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 font-bold focus:outline-none"
              >
                <option value="Supplier">Supplier / Vendor</option>
                <option value="Customer">Customer / Consignee</option>
                <option value="Freight Forwarder">Freight Forwarder</option>
                <option value="Bank">Financial Institution / Bank</option>
              </select>

              <button
                type="submit"
                className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-teal-600/30 transition-all cursor-pointer whitespace-nowrap"
              >
                Run Sanctions Screen
              </button>
            </form>
          </div>

          {/* Compliance Records List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Compliance Audit Trail & Screening History</h3>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">{tradeComplianceRecords.length} Entities Audited</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase font-bold border-b border-slate-200 dark:border-slate-800 text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Entity / Partner</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-center">Sanctions Status</th>
                    <th className="py-3 px-4 text-center">Dual-Use Check</th>
                    <th className="py-3 px-4 text-center">Embargo Status</th>
                    <th className="py-3 px-4 text-center">Final Decision</th>
                    <th className="py-3 px-4 text-right">Screen Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                  {tradeComplianceRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-sans font-bold text-slate-900 dark:text-white">{rec.partnerName}</td>
                      <td className="py-3 px-4 font-sans text-slate-600 dark:text-slate-400">{rec.partnerType}</td>
                      <td className="py-3 px-4 text-center font-sans">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          rec.sanctionListScreening === 'Clear' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                        }`}>
                          {rec.sanctionListScreening}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-sans">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          rec.dualUseGoodsCheck === 'Compliant' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                        }`}>
                          {rec.dualUseGoodsCheck}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-sans">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
                          {rec.embargoCountryCheck}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-sans">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          rec.overallComplianceStatus === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                        }`}>
                          {rec.overallComplianceStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">{rec.checkDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 3: HS CODE DUTY & VAT CALCULATOR ----------------- */}
      {activeSubTab === 'calculator' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>GCC Unified Tariff & VAT Simulation Engine</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1">Declared CIF Value (OMR)</label>
                <input
                  type="number"
                  value={calcCifValue}
                  onChange={(e) => setCalcCifValue(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono font-bold text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Customs Duty Rate (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={calcDutyRate}
                    onChange={(e) => setCalcDutyRate(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">VAT Rate (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={calcVatRate}
                    onChange={(e) => setCalcVatRate(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Calculated Payable Breakdown</h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-sans">CIF Base:</span>
                <span className="font-bold text-slate-900 dark:text-white">{calcCifValue.toLocaleString()} OMR</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-sans">Calculated Customs Duty ({calcDutyRate}%):</span>
                <span className="font-bold text-amber-700 dark:text-amber-400">+{calculatedDuty.toLocaleString()} OMR</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-sans">Calculated Import VAT ({calcVatRate}% on CIF + Duty):</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">+{calculatedVat.toLocaleString()} OMR</span>
              </div>

              <div className="p-4 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-800/60 flex justify-between text-sm">
                <span className="text-teal-700 dark:text-teal-300 font-sans font-bold">Total Customs Due:</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400">{calculatedTotalPayable.toLocaleString()} OMR</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: CREATE BAYAN DECLARATION ----------------- */}
      {showNewBayanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Create Oman Bayan Customs Declaration</span>
              </h3>
              <button
                onClick={() => setShowNewBayanModal(false)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleCreateBayan} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Declaration Type</label>
                  <select
                    value={newBayanForm.type}
                    onChange={(e) => setNewBayanForm({ ...newBayanForm, type: e.target.value as DeclarationType })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="Import Bayan">Import Bayan</option>
                    <option value="Export Bayan">Export Bayan</option>
                    <option value="Transit Declaration">Transit Declaration</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Customs Port</label>
                  <select
                    value={newBayanForm.customsPortCode}
                    onChange={(e) => setNewBayanForm({ ...newBayanForm, customsPortCode: e.target.value as CustomsDeclaration['customsPortCode'] })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono"
                  >
                    <option value="OM-SOH-SEA">Sohar Sea Port (OM-SOH-SEA)</option>
                    <option value="OM-MCT-AIR">Muscat Airport (OM-MCT-AIR)</option>
                    <option value="OM-SLH-SEA">Salalah Sea Port (OM-SLH-SEA)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Commercial Invoice Number</label>
                  <input
                    type="text"
                    required
                    value={newBayanForm.commercialInvoiceNumber}
                    onChange={(e) => setNewBayanForm({ ...newBayanForm, commercialInvoiceNumber: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Bill of Lading / AWB</label>
                  <input
                    type="text"
                    required
                    value={newBayanForm.billOfLading}
                    onChange={(e) => setNewBayanForm({ ...newBayanForm, billOfLading: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Total CIF Value (OMR)</label>
                  <input
                    type="number"
                    value={newBayanForm.totalCifValue}
                    onChange={(e) => setNewBayanForm({ ...newBayanForm, totalCifValue: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono font-bold text-emerald-600 dark:text-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1">Inspection Channel</label>
                  <select
                    value={newBayanForm.inspectionType}
                    onChange={(e) => setNewBayanForm({ ...newBayanForm, inspectionType: e.target.value as CustomsDeclaration['inspectionType'] })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                  >
                    <option value="Green Channel (Immediate)">Green Channel (Immediate Clearance)</option>
                    <option value="Yellow Channel (Document Review)">Yellow Channel (Document Review)</option>
                    <option value="Red Channel (Physical Inspection)">Red Channel (Physical Inspection)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewBayanModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold shadow-lg shadow-teal-600/30"
                >
                  Transmit to Bayan Customs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

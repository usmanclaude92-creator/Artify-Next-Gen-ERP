// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 13: ASSET MANAGEMENT
// 13.06 Asset Disposal, Sale, Physical Verification & Insurance
// ==========================================

import React, { useState } from 'react';
import { useAssetStore } from '../../services/assetStore';
import {
  Trash2,
  DollarSign,
  QrCode,
  ShieldCheck,
  FileText,
  AlertOctagon,
  CheckCircle2,
  Plus,
  Search,
  Download,
  FileCheck,
  TrendingDown,
  Building,
  Printer
} from 'lucide-react';

export const AssetDisposalView: React.FC = () => {
  const {
    assets,
    disposals,
    audits,
    insurancePolicies,
    currency,
    postDisposal,
    addInsurancePolicy
  } = useAssetStore();

  const [activeTab, setActiveTab] = useState<'disposal' | 'sale' | 'verification' | 'insurance' | 'tax_reports'>('disposal');
  const [showDisposalModal, setShowDisposalModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);

  // Disposal Form State
  const [dispForm, setDispForm] = useState({
    assetId: assets[0]?.id || '',
    disposalType: 'SALE' as any,
    proceedsAmount: 180000,
    buyerName: 'Al-Madina Contractors Trading LLC',
    reason: 'Asset reached economic useful life threshold; superseded by modern CNC equipment.',
    authorizedBy: 'Chief Financial Officer & Board of Directors'
  });

  // Insurance Form State
  const [insForm, setInsForm] = useState({
    policyNumber: `POL-OMAN-2026-${Math.floor(100 + Math.random() * 900)}`,
    insurerName: 'Oman Qatar Insurance Company (OQIC)',
    coverageType: 'COMPREHENSIVE_ALL_RISKS',
    sumInsured: 2500000,
    annualPremium: 45000,
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: '2027-08-31',
    deductibleAmount: 10000,
    brokerContact: 'Oman Marine & Property Brokers'
  });

  const handleCreateDisposal = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAsset = assets.find(a => a.id === dispForm.assetId) || assets[0];
    const gainOrLoss = Number(dispForm.proceedsAmount) - targetAsset.netBookValue;

    postDisposal({
      assetId: targetAsset.id,
      assetTag: targetAsset.assetTag,
      assetName: targetAsset.name,
      disposalDate: new Date().toISOString().split('T')[0],
      disposalType: dispForm.disposalType,
      grossCostAtDisposal: targetAsset.originalCost + targetAsset.additionalCosts,
      accumulatedDeprAtDisposal: targetAsset.accumulatedDepreciation,
      netBookValueAtDisposal: targetAsset.netBookValue,
      proceedsAmount: Number(dispForm.proceedsAmount),
      gainLossAmount: gainOrLoss,
      buyerName: dispForm.buyerName,
      salesInvoiceNumber: dispForm.disposalType === 'SALE' ? `INV-DISP-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      reason: dispForm.reason,
      status: 'APPROVED',
      authorizedBy: dispForm.authorizedBy
    });

    setShowDisposalModal(false);
  };

  const handleCreateInsurance = (e: React.FormEvent) => {
    e.preventDefault();
    addInsurancePolicy({
      policyNumber: insForm.policyNumber,
      insurerName: insForm.insurerName,
      coverageType: insForm.coverageType,
      coveredAssetIds: assets.map(a => a.id),
      sumInsured: Number(insForm.sumInsured),
      annualPremium: Number(insForm.annualPremium),
      startDate: insForm.startDate,
      expiryDate: insForm.expiryDate,
      deductibleAmount: Number(insForm.deductibleAmount),
      status: 'ACTIVE',
      brokerContact: insForm.brokerContact
    });
    setShowInsuranceModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-950 text-amber-400 border border-amber-800">
                13.06
              </span>
              <h2 className="text-xl font-black text-white">Asset Disposal, Physical Audits & Insurance</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Asset retirement/sale posting, RFID physical count reconciliation, insurance claims tracking, and statutory tax schedules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowInsuranceModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Add Insurance Policy</span>
            </button>

            <button
              onClick={() => setShowDisposalModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Retire / Sell Asset</span>
            </button>
          </div>
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('disposal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'disposal'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Asset Disposal Register ({disposals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'verification'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>RFID / Physical Audits ({audits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('insurance')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'insurance'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Insurance Policies ({insurancePolicies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tax_reports')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'tax_reports'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Statutory Tax & Depreciation Schedules</span>
          </button>
        </div>
      </div>

      {/* VIEW: ASSET DISPOSAL REGISTER */}
      {activeTab === 'disposal' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">Asset Retirement & Sale Records</h3>
            <p className="text-xs text-slate-400">P&L Gain/Loss calculation, VAT capital sale invoicing, and GL derecognition journal vouchers.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Disposal #</th>
                  <th className="py-3 px-4">Asset Tag & Description</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-right">Carrying NBV</th>
                  <th className="py-3 px-4 text-right">Proceeds</th>
                  <th className="py-3 px-4 text-right">P&L Gain / (Loss)</th>
                  <th className="py-3 px-4">GL Derecognition Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {disposals.map(disp => (
                  <tr key={disp.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-400">{disp.disposalNumber}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{disp.assetName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{disp.assetTag} • {disp.disposalDate}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                        {disp.disposalType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-300">
                      {currency} {disp.netBookValueAtDisposal.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                      {currency} {disp.proceedsAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-black">
                      {disp.gainLossAmount >= 0 ? (
                        <span className="text-emerald-400">+{currency} {disp.gainLossAmount.toLocaleString()}</span>
                      ) : (
                        <span className="text-rose-400">({currency} {Math.abs(disp.gainLossAmount).toLocaleString()})</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-cyan-400">{disp.glDerecognitionJournalId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: RFID / PHYSICAL VERIFICATION AUDITS */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          {audits.map(audit => (
            <div key={audit.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950 px-2.5 py-1 rounded border border-amber-800">
                      {audit.auditNumber}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                      {audit.status}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-1.5">{audit.title}</h4>
                  <p className="text-xs text-slate-400 font-mono">Location: {audit.locationName} • Lead Auditor: {audit.leadAuditor}</p>
                </div>

                <button
                  onClick={() => alert(`Generating reconciliation adjustments for Audit ${audit.auditNumber}...`)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Reconcile Discrepancies</span>
                </button>
              </div>

              {/* Audit Count KPI Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-slate-500 font-semibold">Total Assets Expected</div>
                  <div className="text-xl font-mono font-black text-white mt-1">{audit.totalAssetsInScope}</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-emerald-400 font-semibold">Verified / Found</div>
                  <div className="text-xl font-mono font-black text-emerald-400 mt-1">{audit.assetsFound}</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-rose-400 font-semibold">Missing Items</div>
                  <div className="text-xl font-mono font-black text-rose-400 mt-1">{audit.assetsMissing}</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-amber-400 font-semibold">Location Discrepancies</div>
                  <div className="text-xl font-mono font-black text-amber-400 mt-1">{audit.assetsMisplaced}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW: INSURANCE POLICIES */}
      {activeTab === 'insurance' && (
        <div className="space-y-4">
          {insurancePolicies.map(pol => (
            <div key={pol.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                      {pol.policyNumber}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                      {pol.status}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-1.5">{pol.insurerName}</h4>
                  <p className="text-xs text-slate-400">{pol.coverageType.replace(/_/g, ' ')} • Broker: {pol.brokerContact}</p>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">Total Sum Insured</div>
                  <div className="text-lg font-black font-mono text-emerald-400">
                    {currency} {pol.sumInsured.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl">
                  <div className="text-slate-500">Annual Premium</div>
                  <div className="font-mono font-bold text-white mt-0.5">{currency} {pol.annualPremium.toLocaleString()}</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl">
                  <div className="text-slate-500">Policy Period</div>
                  <div className="font-mono text-slate-300 mt-0.5">{pol.startDate} to {pol.expiryDate}</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl">
                  <div className="text-slate-500">Excess / Deductible</div>
                  <div className="font-mono text-slate-300 mt-0.5">{currency} {pol.deductibleAmount.toLocaleString()}</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl">
                  <div className="text-slate-500">Covered Assets</div>
                  <div className="font-bold text-amber-400 mt-0.5">{pol.coveredAssetIds.length} Registered Units</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW: STATUTORY TAX REPORTS */}
      {activeTab === 'tax_reports' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Statutory Tax Depreciation & Capital Allowances Schedule</h3>
              <p className="text-xs text-slate-400">Oman Tax Authority compliant capital allowance pools and book-to-tax timing differences.</p>
            </div>
            <button
              onClick={() => alert('Generating Statutory Tax Schedule PDF...')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Export Tax Schedule</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="text-slate-500 text-xs font-semibold uppercase">Total IFRS Book Depreciation</div>
              <div className="text-2xl font-black font-mono text-white">{currency} 184,200</div>
              <p className="text-[11px] text-slate-500">Debited to P&L accounts</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="text-slate-500 text-xs font-semibold uppercase">Allowable Tax Depreciation</div>
              <div className="text-2xl font-black font-mono text-emerald-400">{currency} 212,500</div>
              <p className="text-[11px] text-slate-500">Claimed on corporate income tax return</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="text-slate-500 text-xs font-semibold uppercase">Deferred Tax Timing Difference</div>
              <div className="text-2xl font-black font-mono text-cyan-400">{currency} 28,300</div>
              <p className="text-[11px] text-slate-500">Deferred Tax Liability (IAS 12)</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RETIRE / SELL ASSET */}
      {showDisposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-black text-white">Asset Disposal & Derecognition</h3>
              <button
                onClick={() => setShowDisposalModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDisposal} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Asset to Retire *</label>
                <select
                  value={dispForm.assetId}
                  onChange={e => setDispForm({ ...dispForm, assetId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  {assets.filter(a => a.status !== 'DISPOSED').map(a => (
                    <option key={a.id} value={a.id}>{a.assetTag} — {a.name} (Carrying NBV: {currency} {a.netBookValue.toLocaleString()})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Disposal Method *</label>
                  <select
                    value={dispForm.disposalType}
                    onChange={e => setDispForm({ ...dispForm, disposalType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="SALE">Commercial Sale</option>
                    <option value="SCRAP">Scrap / Zero Value Write-off</option>
                    <option value="THEFT_LOSS">Theft / Total Loss</option>
                    <option value="DONATION">Charitable Donation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Proceeds / Salvage ({currency})</label>
                  <input
                    type="number"
                    value={dispForm.proceedsAmount}
                    onChange={e => setDispForm({ ...dispForm, proceedsAmount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Buyer / Salvage Contractor Name</label>
                <input
                  type="text"
                  value={dispForm.buyerName}
                  onChange={e => setDispForm({ ...dispForm, buyerName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Disposal Justification & Approval Ref *</label>
                <textarea
                  rows={3}
                  required
                  value={dispForm.reason}
                  onChange={e => setDispForm({ ...dispForm, reason: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDisposalModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  Confirm Derecognition & Post to GL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD INSURANCE */}
      {showInsuranceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-black text-white">Add Asset Insurance Policy</h3>
              <button
                onClick={() => setShowInsuranceModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInsurance} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Policy Number *</label>
                  <input
                    type="text"
                    required
                    value={insForm.policyNumber}
                    onChange={e => setInsForm({ ...insForm, policyNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Insurer Name *</label>
                  <input
                    type="text"
                    required
                    value={insForm.insurerName}
                    onChange={e => setInsForm({ ...insForm, insurerName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Total Sum Insured ({currency})</label>
                  <input
                    type="number"
                    value={insForm.sumInsured}
                    onChange={e => setInsForm({ ...insForm, sumInsured: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Annual Premium ({currency})</label>
                  <input
                    type="number"
                    value={insForm.annualPremium}
                    onChange={e => setInsForm({ ...insForm, annualPremium: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowInsuranceModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  Save Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

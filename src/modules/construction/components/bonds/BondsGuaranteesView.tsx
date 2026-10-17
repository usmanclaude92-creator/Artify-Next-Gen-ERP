// ==========================================
// 15.06 BONDS & GUARANTEES VIEW
// Bank Guarantees, Performance Bonds, Retention & Advance Payment Bonds
// ==========================================

import React, { useState } from 'react';
import { useConstructionStore } from '../../services/constructionStore';
import { BondType } from '../../types/constructionTypes';
import {
  Shield,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building,
  DollarSign,
  Calendar,
  Lock,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

export const BondsGuaranteesView: React.FC = () => {
  const {
    bonds,
    selectedContractId,
    contracts,
    currency,
    addBondGuarantee
  } = useConstructionStore();

  const [activeTab, setActiveTab] = useState<'all-bonds' | 'expiry-alerts' | 'collateral-margin'>('all-bonds');
  const [showAddBondModal, setShowAddBondModal] = useState(false);

  // New Bond Form State
  const [newBondNumber, setNewBondNumber] = useState('');
  const [newBondType, setNewBondType] = useState<BondType>('PERFORMANCE_BOND');
  const [newIssuingBank, setNewIssuingBank] = useState('Bank Muscat SAOG');
  const [newBeneficiary, setNewBeneficiary] = useState('Oman Investment & Real Estate Development SAOC');
  const [newBondAmount, setNewBondAmount] = useState<number>(2850000);
  const [newIssueDate, setNewIssueDate] = useState('2024-01-15');
  const [newExpiryDate, setNewExpiryDate] = useState('2026-03-31');

  const selectedContract = contracts.find(c => c.id === selectedContractId) || contracts[0];
  const contractBonds = bonds.filter(b => b.contractId === selectedContractId);

  const totalActiveExposure = contractBonds
    .filter(b => b.status === 'ACTIVE')
    .reduce((acc, b) => acc + b.instrumentValue, 0);

  const totalCollateralMargin = contractBonds
    .filter(b => b.status === 'ACTIVE')
    .reduce((acc, b) => acc + b.marginCashCollateralHeld, 0);

  const handleCreateBond = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBondNumber) return;

    addBondGuarantee({
      instrumentNumber: newBondNumber,
      contractId: selectedContractId,
      bondType: newBondType,
      title: `${newBondType.replace(/_/g, ' ')} — ${newBondNumber}`,
      issuingBank: newIssuingBank,
      beneficiaryName: newBeneficiary,
      currency,
      instrumentValue: Number(newBondAmount),
      percentageOfContract: selectedContract?.originalContractValue
        ? (Number(newBondAmount) / selectedContract.originalContractValue) * 100
        : 0,
      issueDate: newIssueDate,
      originalExpiryDate: newExpiryDate,
      currentExpiryDate: newExpiryDate,
      claimPeriodDays: 30,
      renewalAlertDaysBefore: 60,
      marginCashCollateralHeld: Number(newBondAmount) * 0.1,
      bankCommissionFeeAnnualPct: 1.25,
      status: 'ACTIVE',
      linkedMilestoneRelease: '',
      physicalDocumentLocation: ''
    });

    setShowAddBondModal(false);
    setNewBondNumber('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-slate-900 dark:text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            Module 15.06 — Bank Guarantees & Bonds
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Performance Bonds & Bank Guarantees Register</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Performance bonds, advance payment security, bid tenders, retention release bonds, and banking cash collateral margin monitoring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddBondModal(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Register Bank Guarantee
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Guarantee Exposure</span>
          <p className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
            {currency} {totalActiveExposure.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">Total liability backed by prime tier-1 banks</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Restricted Cash Collateral Margin</span>
          <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">
            {currency} {totalCollateralMargin.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">10% cash held in escrow accounts</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Upcoming Expiry Renewals (&lt; 60 Days)</span>
          <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            0 Bonds Pending
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400">All bonds valid through contractual DLP</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all-bonds')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'all-bonds'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Bank Guarantees Register ({contractBonds.length})
          </button>
          <button
            onClick={() => setActiveTab('collateral-margin')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'collateral-margin'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Bank Margin & Commission Ledger
          </button>
        </div>
      </div>

      {/* Tab 1: Bonds List */}
      {activeTab === 'all-bonds' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {contractBonds.map(bond => (
            <div
              key={bond.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded">
                  {bond.instrumentNumber}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  {bond.status}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{bond.bondType.replace(/_/g, ' ')}</span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {bond.issuingBank}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Beneficiary: <strong>{bond.beneficiaryName}</strong>
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between font-bold">
                  <span>Guarantee Face Value:</span>
                  <span className="font-mono text-slate-900 dark:text-white">{bond.currency} {bond.instrumentValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Validity Period:</span>
                  <span className="font-mono">{bond.issueDate} → {bond.currentExpiryDate}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Cash Margin (10%):</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{bond.currency} {bond.marginCashCollateralHeld.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Commission: {bond.bankCommissionFeeAnnualPct}% p.a.</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Auto-Extension Clause Active</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Collateral Margin */}
      {activeTab === 'collateral-margin' && (
        <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Bond No.</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Bank</th>
                <th className="py-3 px-4 text-right">Face Amount</th>
                <th className="py-3 px-4 text-right">Cash Margin (10%)</th>
                <th className="py-3 px-4 text-right">Annual Bank Fee (1.25%)</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {contractBonds.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{b.instrumentNumber}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">{b.bondType.replace(/_/g, ' ')}</td>
                  <td className="py-3.5 px-4">{b.issuingBank}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">{currency} {b.instrumentValue.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{currency} {b.marginCashCollateralHeld.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold">{currency} {(b.instrumentValue * 0.0125).toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: New Bond */}
      {showAddBondModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Register Bank Guarantee / Bond</h3>
              <button onClick={() => setShowAddBondModal(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-400">✕</button>
            </div>

            <form onSubmit={handleCreateBond} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Guarantee Bond Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BG-2024-BM-09"
                    value={newBondNumber}
                    onChange={e => setNewBondNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Bond Type</label>
                  <select
                    value={newBondType}
                    onChange={e => setNewBondType(e.target.value as BondType)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="PERFORMANCE_BOND">Performance Bond (10%)</option>
                    <option value="ADVANCE_PAYMENT_GUARANTEE">Advance Payment Guarantee</option>
                    <option value="TENDER_BID_BOND">Tender / Bid Bond</option>
                    <option value="RETENTION_MONEY_BOND">Retention Money Bond</option>
                    <option value="MAINTENANCE_DLP_BOND">Defect Liability (DLP) Bond</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Issuing Bank</label>
                <input
                  type="text"
                  value={newIssuingBank}
                  onChange={e => setNewIssuingBank(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Beneficiary Employer</label>
                <input
                  type="text"
                  value={newBeneficiary}
                  onChange={e => setNewBeneficiary(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Face Value ({currency})</label>
                  <input
                    type="number"
                    value={newBondAmount}
                    onChange={e => setNewBondAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={newIssueDate}
                    onChange={e => setNewIssueDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newExpiryDate}
                    onChange={e => setNewExpiryDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddBondModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold"
                >
                  Register Guarantee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

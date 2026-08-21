import React, { useState } from 'react';
import { useBankingTreasury } from '../../services/bankingTreasuryStore';
import {
  CashFlowForecastItem,
  BankFacilityRecord,
  BankChargeAuditRecord,
  PostDatedChequeRecord,
  PDCStatus
} from '../../types';
import {
  Briefcase,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  Layers,
  DollarSign,
  TrendingUp,
  CreditCard,
  Building,
  ShieldCheck,
  RotateCcw,
  Sliders,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Archive,
  Eye
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export const TreasuryManagementView: React.FC = () => {
  const {
    cashFlowForecast,
    bankFacilities,
    bankChargeAudits,
    postDatedCheques,
    bankAccounts,
    addBankFacility,
    updateBankFacilityUtilization,
    recordBankChargeAudit,
    registerPostDatedCheque,
    updatePDCStatus,
    totalLiquidityOMR,
    totalFacilitiesSanctionedOMR,
    totalFacilitiesHeadroomOMR
  } = useBankingTreasury();

  const [activeTab, setActiveTab] = useState<'forecast' | 'position' | 'facilities' | 'charges' | 'pdc'>('forecast');
  const [searchTerm, setSearchTerm] = useState('');
  const [forecastScenario, setForecastScenario] = useState<'Base' | 'Stress'>('Base');

  // Modals
  const [showAddFacilityModal, setShowAddFacilityModal] = useState(false);
  const [showAddChargeAuditModal, setShowAddChargeAuditModal] = useState(false);
  const [showAddPdcModal, setShowAddPdcModal] = useState(false);
  const [selectedPdcForAction, setSelectedPdcForAction] = useState<PostDatedChequeRecord | null>(null);

  // Form State: Bank Facility
  const [facBankId, setFacBankId] = useState(bankAccounts[0]?.bankId || 'bank-01');
  const [facBankName, setFacBankName] = useState('Bank Muscat SAOG');
  const [facNumber, setFacNumber] = useState('');
  const [facType, setFacType] = useState<BankFacilityRecord['facilityType']>('Letter of Credit (LC Line)');
  const [facSanctioned, setFacSanctioned] = useState<number>(1000000);
  const [facUtilized, setFacUtilized] = useState<number>(350000);
  const [facInterest, setFacInterest] = useState<number>(4.75);
  const [facExpiry, setFacExpiry] = useState('2027-06-30');
  const [facCovenants, setFacCovenants] = useState('Minimum DSCR of 1.25x; Tangible Net Worth >= OMR 12M');

  // Form State: Bank Charge Audit
  const [auditBankAccId, setAuditBankAccId] = useState(bankAccounts[0]?.id || '');
  const [auditTxnRef, setAuditTxnRef] = useState('TXN-WIRE-9921');
  const [auditCharged, setAuditCharged] = useState<number>(45.0);
  const [auditAgreed, setAuditAgreed] = useState<number>(20.0);
  const [auditCat, setAuditCat] = useState('Outward SWIFT Wire Commission');

  // Form State: Post-Dated Cheque
  const [pdcDirection, setPdcDirection] = useState<PostDatedChequeRecord['direction']>('Receivable (Customer PDC)');
  const [pdcNumber, setPdcNumber] = useState('');
  const [pdcBank, setPdcBank] = useState('National Bank of Oman');
  const [pdcDrawerPayee, setPdcDrawerPayee] = useState('');
  const [pdcAmount, setPdcAmount] = useState<number>(28500);
  const [pdcMaturity, setPdcMaturity] = useState(new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]);
  const [pdcCustody, setPdcCustody] = useState('Treasury Fireproof Safe Box');
  const [pdcLinkedRef, setPdcLinkedRef] = useState('INV-2026-08-992');

  const formatCurrency = (val: number, curr = 'OMR') => {
    return `${curr} ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const chartData = cashFlowForecast.map((f) => {
    const stressBuffer = forecastScenario === 'Stress' ? 0.85 : 1.0;
    const inflows = Math.round(f.projectedInflows.totalInflow * stressBuffer);
    const outflows = f.projectedOutflows.totalOutflow;
    return {
      week: f.weekLabel.split(' ')[1] || f.weekLabel,
      Inflows: inflows,
      Outflows: outflows,
      ClosingBalance: f.closingTreasuryBalance
    };
  });

  const handleCreateFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facNumber || facSanctioned <= 0) return;
    const avail = Math.max(0, facSanctioned - facUtilized);
    addBankFacility({
      bankId: facBankId,
      bankName: facBankName,
      facilityNumber: facNumber,
      facilityType: facType,
      currency: 'OMR',
      sanctionedLimitOMR: Number(facSanctioned),
      utilizedAmountOMR: Number(facUtilized),
      availableHeadroomOMR: avail,
      interestOrCommissionRate: `${facInterest}% p.a.`,
      expiryDate: facExpiry,
      securityOrCollateral: 'Corporate Guarantee & Assignment of Receivables',
      covenantsDescription: facCovenants,
      status: 'Active'
    });
    setShowAddFacilityModal(false);
    setFacNumber('');
  };

  const handleCreateChargeAudit = (e: React.FormEvent) => {
    e.preventDefault();
    const acc = bankAccounts.find((b) => b.id === auditBankAccId);
    const variance = Number(auditCharged) - Number(auditAgreed);
    recordBankChargeAudit({
      bankAccountId: auditBankAccId,
      bankAccountName: acc?.accountName || 'Operating Account',
      statementLineRef: auditTxnRef,
      chargeDate: new Date().toISOString().split('T')[0],
      chargeCategory: auditCat,
      bankChargedAmountOMR: Number(auditCharged),
      scheduledAgreedTariffOMR: Number(auditAgreed),
      varianceOverchargedOMR: variance,
      auditStatus: variance > 0 ? 'Disputed / Refund Requested' : 'Verified OK',
      disputeNotes: variance > 0 ? `Overcharge of OMR ${variance.toFixed(3)} flagged vs SLA.` : 'Compliant'
    });
    setShowAddChargeAuditModal(false);
  };

  const handleCreatePdc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdcNumber || !pdcDrawerPayee || pdcAmount <= 0) return;
    registerPostDatedCheque({
      direction: pdcDirection,
      chequeNumber: pdcNumber,
      bankName: pdcBank,
      drawerOrPayeeName: pdcDrawerPayee,
      chequeDate: new Date().toISOString().split('T')[0],
      maturityDate: pdcMaturity,
      amount: Number(pdcAmount),
      currency: 'OMR',
      amountInOMR: Number(pdcAmount),
      custodyLocation: pdcCustody,
      linkedInvoiceOrVoucherRef: pdcLinkedRef,
      clearingBankAccountId: bankAccounts[0]?.id || 'acct-01'
    });
    setShowAddPdcModal(false);
    setPdcNumber('');
    setPdcDrawerPayee('');
  };

  const filteredFacilities = bankFacilities.filter(
    (f) =>
      f.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.facilityNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.facilityType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPdcs = postDatedCheques.filter(
    (p) =>
      p.chequeNumber.includes(searchTerm) ||
      p.drawerOrPayeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.bankName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Tabs & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('forecast')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'forecast'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>13-Week Cash Forecast</span>
          </button>

          <button
            onClick={() => setActiveTab('position')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'position'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Group Treasury Position</span>
          </button>

          <button
            onClick={() => setActiveTab('facilities')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'facilities'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Credit Facilities & Lines ({bankFacilities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('charges')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'charges'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Bank Charges Audit ({bankChargeAudits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pdc')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'pdc'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Post-Dated Cheque Vault ({postDatedCheques.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search treasury records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 w-48 sm:w-60"
            />
          </div>

          {activeTab === 'facilities' && (
            <button
              onClick={() => setShowAddFacilityModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Facility</span>
            </button>
          )}

          {activeTab === 'charges' && (
            <button
              onClick={() => setShowAddChargeAuditModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Audit Fee Entry</span>
            </button>
          )}

          {activeTab === 'pdc' && (
            <button
              onClick={() => setShowAddPdcModal(true)}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register New PDC</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: 13-WEEK CASH FLOW FORECAST */}
      {activeTab === 'forecast' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Operational Cash Flow Modeling (13-Week Horizon)</h3>
                <p className="text-xs text-slate-500">
                  Comprehensive liquidity tracking comparing projected customer receivables against vendor maturities, salaries and debt service.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Scenario:</span>
                <button
                  onClick={() => setForecastScenario('Base')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    forecastScenario === 'Base'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Base Model
                </button>
                <button
                  onClick={() => setForecastScenario('Stress')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    forecastScenario === 'Stress'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Stress Test (-15% Inflow Delay)
                </button>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value: any) => [`OMR ${Number(value).toLocaleString()}`, '']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="Inflows" fill="#10b981" radius={[4, 4, 0, 0]} name="Projected Inflows" />
                  <Bar dataKey="Outflows" fill="#ef4444" radius={[4, 4, 0, 0]} name="Projected Outflows" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Detail Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-800">
              Weekly Detailed Inflow / Outflow Breakdown
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Forecast Period</th>
                    <th className="p-3.5 text-right">Opening Balance</th>
                    <th className="p-3.5 text-right">Customer Inflow</th>
                    <th className="p-3.5 text-right">Vendor Outflow</th>
                    <th className="p-3.5 text-right">Payroll & Statutory</th>
                    <th className="p-3.5 text-right">Debt Service</th>
                    <th className="p-3.5 text-right font-bold">Closing Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cashFlowForecast.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">{w.weekLabel}</td>
                      <td className="p-3.5 text-right font-medium text-slate-700">{formatCurrency(w.openingTreasuryBalance)}</td>
                      <td className="p-3.5 text-right text-emerald-700 font-bold">
                        {formatCurrency(w.projectedInflows.totalInflow)}
                      </td>
                      <td className="p-3.5 text-right text-rose-700 font-medium">
                        {formatCurrency(w.projectedOutflows.vendorPayments)}
                      </td>
                      <td className="p-3.5 text-right text-slate-600">
                        {formatCurrency(w.projectedOutflows.payrollWpsDisbursements + w.projectedOutflows.taxAndVatRemittance)}
                      </td>
                      <td className="p-3.5 text-right text-slate-600">
                        {formatCurrency(w.projectedOutflows.debtServiceAndInterest)}
                      </td>
                      <td className="p-3.5 text-right font-bold text-slate-900 text-sm">
                        {formatCurrency(w.closingTreasuryBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GROUP TREASURY POSITION */}
      {activeTab === 'position' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 uppercase">Total Corporate Liquidity</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalLiquidityOMR)}</h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">100% Capital Adequacy Met</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 uppercase">Total Sanctioned Credit</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalFacilitiesSanctionedOMR)}</h3>
              <p className="text-[11px] text-slate-500 mt-1">Across 4 Tier-1 Banking Partners</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 uppercase">Available Headroom</span>
              <h3 className="text-2xl font-bold text-indigo-600 mt-1">{formatCurrency(totalFacilitiesHeadroomOMR)}</h3>
              <p className="text-[11px] text-indigo-700 mt-1">Ready for Project Bonding / Trade LCs</p>
            </div>
          </div>

          {/* Currency Breakdown Matrix */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Currency Exposure & Balance Reserves</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-700">OMR (Omani Rial)</span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Local Base</span>
                </div>
                <div className="text-xl font-bold text-slate-900 mt-2">OMR 3,375,000.00</div>
                <span className="text-[11px] text-slate-500">Operating float & tax reserves</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-700">USD (US Dollar)</span>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Pegged 0.385</span>
                </div>
                <div className="text-xl font-bold text-slate-900 mt-2">USD 1,200,000.00</div>
                <span className="text-[11px] text-slate-500">≈ OMR 462,000.00 (Import trade escrow)</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-700">AED (UAE Dirham)</span>
                  <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">GCC Trade</span>
                </div>
                <div className="text-xl font-bold text-slate-900 mt-2">AED 450,000.00</div>
                <span className="text-[11px] text-slate-500">≈ OMR 47,160.00 (Regional supply chain)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BANK CREDIT FACILITIES */}
      {activeTab === 'facilities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFacilities.map((fac) => {
            const utilRatio = Math.round((fac.utilizedAmountOMR / fac.sanctionedLimitOMR) * 100);
            return (
              <div key={fac.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {fac.facilityNumber}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">{fac.facilityType}</h3>
                      <p className="text-xs text-slate-500">{fac.bankName}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {fac.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Sanctioned Limit</span>
                      <span className="font-bold text-slate-900 text-sm">{formatCurrency(fac.sanctionedLimitOMR)}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Utilized ({utilRatio}%)</span>
                      <span className="font-bold text-indigo-700 text-sm">{formatCurrency(fac.utilizedAmountOMR)}</span>
                    </div>
                  </div>

                  {/* Progress meter */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
                    <div
                      className={`h-full rounded-full ${utilRatio > 80 ? 'bg-amber-500' : 'bg-indigo-600'}`}
                      style={{ width: `${utilRatio}%` }}
                    />
                  </div>

                  <div className="mt-3 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Available Headroom:</span>
                      <span className="font-bold text-emerald-700">{formatCurrency(fac.availableHeadroomOMR)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Pricing / Rate:</span>
                      <span className="font-semibold text-slate-800">{fac.interestOrCommissionRate}</span>
                    </div>
                  </div>

                  <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Covenants</span>
                    <p className="line-clamp-2">{fac.covenantsDescription}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Expiry: {fac.expiryDate}</span>
                  <span className="text-indigo-600 font-semibold cursor-pointer hover:underline">
                    Edit Utilization
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: BANK CHARGES AUDIT */}
      {activeTab === 'charges' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Audit Ref & Date</th>
                  <th className="p-3.5">Bank Account & Txn Ref</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5 text-right">Bank Charged</th>
                  <th className="p-3.5 text-right">Agreed Tariff</th>
                  <th className="p-3.5 text-right">Variance / Overcharge</th>
                  <th className="p-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bankChargeAudits.map((audit) => (
                  <tr key={audit.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-slate-900">{audit.auditRefNumber}</div>
                      <div className="text-[11px] text-slate-500">{audit.chargeDate}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{audit.bankAccountName}</div>
                      <div className="font-mono text-[10px] text-slate-400">{audit.statementLineRef}</div>
                    </td>
                    <td className="p-3.5 text-slate-800 font-medium">{audit.chargeCategory}</td>
                    <td className="p-3.5 text-right font-bold text-slate-900">
                      {formatCurrency(audit.bankChargedAmountOMR)}
                    </td>
                    <td className="p-3.5 text-right font-medium text-slate-700">
                      {formatCurrency(audit.scheduledAgreedTariffOMR)}
                    </td>
                    <td className="p-3.5 text-right font-bold text-rose-700">
                      {audit.varianceOverchargedOMR > 0 ? formatCurrency(audit.varianceOverchargedOMR) : '0.000'}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          audit.auditStatus === 'Verified OK'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {audit.auditStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: POST-DATED CHEQUES (PDC) VAULT */}
      {activeTab === 'pdc' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">PDC Ref & Direction</th>
                    <th className="p-3.5">Cheque # & Bank</th>
                    <th className="p-3.5">Customer / Drawer / Payee</th>
                    <th className="p-3.5">Maturity Date</th>
                    <th className="p-3.5 text-right">Amount (OMR)</th>
                    <th className="p-3.5 text-center">Days Left</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-center">Vault Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPdcs.map((pdc) => (
                    <tr key={pdc.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-slate-900">{pdc.pdcReference}</div>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded inline-block mt-0.5 ${
                            pdc.direction.startsWith('Rec')
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {pdc.direction.startsWith('Rec') ? 'Receivable' : 'Payable'}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-slate-900">#{pdc.chequeNumber}</div>
                        <div className="text-[10px] text-slate-500">{pdc.bankName}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{pdc.drawerOrPayeeName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{pdc.linkedInvoiceOrVoucherRef}</div>
                      </td>
                      <td className="p-3.5 font-mono text-slate-700">{pdc.maturityDate}</td>
                      <td className="p-3.5 text-right font-bold text-slate-900 text-sm">
                        {formatCurrency(pdc.amountInOMR)}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px]">
                          {pdc.daysUntilMaturity} Days
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            pdc.status === 'Cleared'
                              ? 'bg-emerald-100 text-emerald-800'
                              : pdc.status === 'Deposited'
                              ? 'bg-blue-100 text-blue-800'
                              : pdc.status === 'Bounced / Returned'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {pdc.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        {pdc.status === 'In Vault' && (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => updatePDCStatus(pdc.id, 'Deposited')}
                              className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[10px] font-semibold cursor-pointer"
                            >
                              Deposit to Bank
                            </button>
                          </div>
                        )}
                        {pdc.status === 'Deposited' && (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => updatePDCStatus(pdc.id, 'Cleared')}
                              className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[10px] font-semibold cursor-pointer"
                            >
                              Mark Cleared
                            </button>
                            <button
                              onClick={() => updatePDCStatus(pdc.id, 'Bounced / Returned')}
                              className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded text-[10px] font-semibold cursor-pointer"
                            >
                              Bounce
                            </button>
                          </div>
                        )}
                        {pdc.status === 'Cleared' && (
                          <span className="text-[10px] text-emerald-700 font-semibold flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Cleared</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD CREDIT FACILITY */}
      {showAddFacilityModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Add Bank Credit Facility</h3>
            <form onSubmit={handleCreateFacility} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Facility Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FAC-BMUS-LC-2026"
                    value={facNumber}
                    onChange={(e) => setFacNumber(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Partner Bank *</label>
                  <input
                    type="text"
                    required
                    value={facBankName}
                    onChange={(e) => setFacBankName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Facility Type *</label>
                <select
                  value={facType}
                  onChange={(e) => setFacType(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  <option value="Letter of Credit (LC Line)">Letter of Credit (LC Line)</option>
                  <option value="Bank Guarantee (BG / Performance Bond)">Bank Guarantee (BG / Performance Bond)</option>
                  <option value="Revolving Overdraft Facility (OD)">Revolving Overdraft Facility (OD)</option>
                  <option value="Short-Term Loan (STL / Trust Receipt)">Short-Term Loan (STL / Trust Receipt)</option>
                  <option value="Term Loan (Capex Financing)">Term Loan (Capex Financing)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Sanctioned Limit (OMR) *</label>
                  <input
                    type="number"
                    required
                    value={facSanctioned}
                    onChange={(e) => setFacSanctioned(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Currently Utilized (OMR)</label>
                  <input
                    type="number"
                    value={facUtilized}
                    onChange={(e) => setFacUtilized(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Interest / Fee Rate (% p.a.)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={facInterest}
                    onChange={(e) => setFacInterest(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Sanction Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={facExpiry}
                    onChange={(e) => setFacExpiry(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Covenants / DSCR Clauses</label>
                <input
                  type="text"
                  value={facCovenants}
                  onChange={(e) => setFacCovenants(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddFacilityModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Save Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AUDIT BANK CHARGE */}
      {showAddChargeAuditModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Audit Bank Service Fee Entry</h3>
            <form onSubmit={handleCreateChargeAudit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Bank Account *</label>
                <select
                  value={auditBankAccId}
                  onChange={(e) => setAuditBankAccId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  {bankAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.accountName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Bank Charged (OMR) *</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={auditCharged}
                    onChange={(e) => setAuditCharged(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Agreed Tariff (OMR) *</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={auditAgreed}
                    onChange={(e) => setAuditAgreed(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Charge Category</label>
                <input
                  type="text"
                  value={auditCat}
                  onChange={(e) => setAuditCat(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddChargeAuditModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Log Charge Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTER POST-DATED CHEQUE */}
      {showAddPdcModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Register Post-Dated Cheque (PDC)</h3>
            <form onSubmit={handleCreatePdc} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Direction *</label>
                <select
                  value={pdcDirection}
                  onChange={(e) => setPdcDirection(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  <option value="Receivable (Customer PDC)">Receivable (Customer PDC)</option>
                  <option value="Payable (Supplier PDC)">Payable (Supplier PDC)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Cheque Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="994102"
                    value={pdcNumber}
                    onChange={(e) => setPdcNumber(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Amount (OMR) *</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={pdcAmount}
                    onChange={(e) => setPdcAmount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Drawer / Payee *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Al-Madina Real Estate SAOC"
                    value={pdcDrawerPayee}
                    onChange={(e) => setPdcDrawerPayee(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Drawn Bank</label>
                  <input
                    type="text"
                    value={pdcBank}
                    onChange={(e) => setPdcBank(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Maturity Date *</label>
                  <input
                    type="date"
                    required
                    value={pdcMaturity}
                    onChange={(e) => setPdcMaturity(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Safe Custody Location</label>
                  <input
                    type="text"
                    value={pdcCustody}
                    onChange={(e) => setPdcCustody(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPdcModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Deposit PDC to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

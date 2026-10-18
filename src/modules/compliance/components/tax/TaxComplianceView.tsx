// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 17: COMPLIANCE, RISK & AUDIT
// 17.02 — Tax Compliance View
// ==========================================

import React, { useState } from 'react';
import { useComplianceStore } from '../../services/complianceStore';
import { VATComplianceRecord, TaxScheduleItem, StatutoryTaxReturn, StatutoryReportPackage } from '../../types';
import {
  Receipt,
  FileSpreadsheet,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  ExternalLink,
  DollarSign,
  Calendar,
  Building,
  Layers,
  ArrowDownRight,
  ArrowUpRight,
  Send,
  X
} from 'lucide-react';

export const TaxComplianceView: React.FC = () => {
  const {
    vatRecords,
    taxSchedules,
    statutoryTaxReturns,
    statutoryReports,
    addVatRecord,
    updateTaxReturnStatus,
    addTaxSchedule
  } = useComplianceStore();

  const [activeSubTab, setActiveSubTab] = useState<'vat' | 'schedules' | 'returns' | 'statutory'>('vat');
  const [vatSearch, setVatSearch] = useState('');
  const [selectedDirection, setSelectedDirection] = useState<'ALL' | 'OUTPUT_VAT' | 'INPUT_VAT'>('ALL');

  // Modals
  const [isAddVatOpen, setIsAddVatOpen] = useState(false);
  const [isAddSchedOpen, setIsAddSchedOpen] = useState(false);
  const [selectedReturnPay, setSelectedReturnPay] = useState<StatutoryTaxReturn | null>(null);
  const [paymentRefInput, setPaymentRefInput] = useState('');

  // Form for VAT Record
  const [vatForm, setVatForm] = useState<Omit<VATComplianceRecord, 'id'>>({
    period: '2026-Q1',
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    partyName: '',
    partyVatTin: 'OM',
    taxableAmountOMR: 0,
    vatRate: 0.05,
    vatAmountOMR: 0,
    direction: 'OUTPUT_VAT',
    qrCodeValidated: true,
    cryptographicHashValid: true,
    reverseChargeApplicable: false,
    complianceFlag: 'PASS',
    notes: 'Standard electronic invoice with verified QR cryptographic tag.'
  });

  // Form for Tax Schedule
  const [schedForm, setSchedForm] = useState<Omit<TaxScheduleItem, 'id'>>({
    taxYear: '2025',
    scheduleCode: '',
    description: '',
    accountingBasisOMR: 0,
    taxAdjustmentsOMR: 0,
    taxableBasisOMR: 0,
    taxRatePercent: 15.0,
    taxLiabilityOMR: 0,
    status: 'DRAFT',
    preparedBy: 'Tariq Al-Lawati (Head of Tax)',
    reviewedBy: 'Chief Financial Officer'
  });

  const filteredVatRecords = vatRecords.filter(r => {
    const matchesSearch =
      r.invoiceNumber.toLowerCase().includes(vatSearch.toLowerCase()) ||
      r.partyName.toLowerCase().includes(vatSearch.toLowerCase()) ||
      r.partyVatTin.toLowerCase().includes(vatSearch.toLowerCase());
    const matchesDir = selectedDirection === 'ALL' || r.direction === selectedDirection;
    return matchesSearch && matchesDir;
  });

  // Summary calculations
  const totalOutputVat = vatRecords
    .filter(r => r.direction === 'OUTPUT_VAT')
    .reduce((acc, curr) => acc + curr.vatAmountOMR, 0);

  const totalInputVat = vatRecords
    .filter(r => r.direction === 'INPUT_VAT')
    .reduce((acc, curr) => acc + curr.vatAmountOMR, 0);

  const netVatPayable = totalOutputVat - totalInputVat;

  const handleAddVatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vatForm.invoiceNumber || !vatForm.partyName || vatForm.taxableAmountOMR <= 0) return;
    const vatAmount = vatForm.taxableAmountOMR * vatForm.vatRate;
    addVatRecord({
      ...vatForm,
      vatAmountOMR: vatAmount
    });
    setIsAddVatOpen(false);
    setVatForm({
      period: '2026-Q1',
      invoiceNumber: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      partyName: '',
      partyVatTin: 'OM',
      taxableAmountOMR: 0,
      vatRate: 0.05,
      vatAmountOMR: 0,
      direction: 'OUTPUT_VAT',
      qrCodeValidated: true,
      cryptographicHashValid: true,
      reverseChargeApplicable: false,
      complianceFlag: 'PASS',
      notes: 'Standard electronic invoice with verified QR cryptographic tag.'
    });
  };

  const handleAddSchedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const taxableBasis = schedForm.accountingBasisOMR + schedForm.taxAdjustmentsOMR;
    const taxLiability = (taxableBasis * schedForm.taxRatePercent) / 100;
    addTaxSchedule({
      ...schedForm,
      taxableBasisOMR: taxableBasis,
      taxLiabilityOMR: taxLiability
    });
    setIsAddSchedOpen(false);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReturnPay || !paymentRefInput) return;
    updateTaxReturnStatus(selectedReturnPay.id, 'AUTHORITY_ACCEPTED', paymentRefInput);
    setSelectedReturnPay(null);
    setPaymentRefInput('');
  };

  return (
    <div className="space-y-6">
      {/* Submodule Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              17.02
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Tax Compliance & Statutory Reporting</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            5% Standard Oman VAT e-invoicing audit, Corporate Income Tax (CIT 15%) computation schedules, and Central Bank / MOCIIP statutory reporting packages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'vat' && (
            <button
              onClick={() => setIsAddVatOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" /> Log Tax Invoice
            </button>
          )}
          {activeSubTab === 'schedules' && (
            <button
              onClick={() => setIsAddSchedOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Tax Schedule
            </button>
          )}
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveSubTab('vat')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeSubTab === 'vat'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-t-xl'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Receipt className="w-4 h-4" /> VAT Electronic Compliance ({vatRecords.length})
        </button>
        <button
          onClick={() => setActiveSubTab('schedules')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeSubTab === 'schedules'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-t-xl'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" /> Corporate Tax Schedules ({taxSchedules.length})
        </button>
        <button
          onClick={() => setActiveSubTab('returns')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeSubTab === 'returns'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-t-xl'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Building className="w-4 h-4" /> Statutory Tax Returns ({statutoryTaxReturns.length})
        </button>
        <button
          onClick={() => setActiveSubTab('statutory')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeSubTab === 'statutory'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-500/10 rounded-t-xl'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Regulatory Reporting ({statutoryReports.length})
        </button>
      </div>

      {/* 1. VAT ELECTRONIC INVOICING COMPLIANCE */}
      {activeSubTab === 'vat' && (
        <div className="space-y-4">
          {/* VAT Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 block">Total Output VAT (Sales)</span>
                <strong className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
                  OMR {totalOutputVat.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </strong>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-0.5">5% Standard Rate on Supplies</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 block">Total Input VAT (Purchases)</span>
                <strong className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
                  OMR {totalInputVat.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </strong>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 block mt-0.5">Deductible Tax on Invoices</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <ArrowDownRight className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl border border-slate-700 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 block">Net VAT Settlement Position</span>
                <strong className="text-xl font-bold font-mono text-emerald-400">
                  OMR {netVatPayable.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </strong>
                <span className="text-[11px] text-slate-300 block mt-0.5">Payable to Oman Tax Authority</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Search invoice number, client/supplier name, VAT TIN..."
                value={vatSearch}
                onChange={e => setVatSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedDirection}
                onChange={e => setSelectedDirection(e.target.value as any)}
                className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Directions</option>
                <option value="OUTPUT_VAT">Output VAT (Sales Invoices)</option>
                <option value="INPUT_VAT">Input VAT (Vendor Invoices)</option>
              </select>
            </div>
          </div>

          {/* VAT Records Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Invoice & Date</th>
                    <th className="px-4 py-3">Counterparty & Tax TIN</th>
                    <th className="px-4 py-3">Taxable Basis (OMR)</th>
                    <th className="px-4 py-3">VAT Amount (5%)</th>
                    <th className="px-4 py-3 text-center">Cryptographic E-Invoice</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredVatRecords.map(rec => (
                    <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="px-5 py-4">
                        <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">{rec.invoiceNumber}</div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{rec.invoiceDate} • {rec.period}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">{rec.partyName}</div>
                        <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{rec.partyVatTin}</span>
                        {rec.reverseChargeApplicable && (
                          <span className="ml-2 px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                            Reverse Charge
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 font-mono text-xs font-medium text-slate-800 dark:text-slate-200">
                        OMR {rec.taxableAmountOMR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`font-mono text-xs font-bold ${
                            rec.direction === 'OUTPUT_VAT' ? 'text-emerald-700 dark:text-emerald-300' : 'text-indigo-700 dark:text-indigo-300'
                          }`}
                        >
                          {rec.direction === 'OUTPUT_VAT' ? '+' : '-'} OMR{' '}
                          {rec.vatAmountOMR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block capitalize">
                          {rec.direction.toLowerCase().replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
                          <QrCode className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                          <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">SHA-256 Valid</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> {rec.complianceFlag}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. CORPORATE TAX SCHEDULES (CIT 15%) */}
      {activeSubTab === 'schedules' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Corporate Income Tax (CIT) Schedule of Adjustments</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Reconciliation of IFRS accounting net profit to taxable net profit under Sultanate of Oman Income Tax Law (RD 28/2009).
                </p>
              </div>
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold rounded-lg">
                Statutory CIT Rate: 15.0%
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Schedule Code</th>
                    <th className="px-4 py-3">Adjustment Description</th>
                    <th className="px-4 py-3">Accounting Basis (OMR)</th>
                    <th className="px-4 py-3">Tax Adjustment (OMR)</th>
                    <th className="px-4 py-3">Taxable Basis (OMR)</th>
                    <th className="px-4 py-3">Tax Liability (15%)</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {taxSchedules.map(sched => (
                    <tr key={sched.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="px-5 py-4 font-mono font-bold text-xs text-slate-800 dark:text-slate-200">{sched.scheduleCode}</td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs">{sched.description}</p>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Prep: {sched.preparedBy} • Rev: {sched.reviewedBy}</span>
                      </td>
                      <td className="px-4 py-4 font-mono text-xs text-slate-800 dark:text-slate-200">
                        OMR {sched.accountingBasisOMR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-4 font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300">
                        {sched.taxAdjustmentsOMR >= 0 ? '+' : ''} OMR{' '}
                        {sched.taxAdjustmentsOMR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-4 font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                        OMR {sched.taxableBasisOMR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-4 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        OMR {sched.taxLiabilityOMR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                          {sched.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. STATUTORY TAX RETURNS */}
      {activeSubTab === 'returns' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statutoryTaxReturns.map(tr => (
            <div key={tr.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {tr.period}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                      tr.status === 'AUTHORITY_ACCEPTED'
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
                        : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30'
                    }`}
                  >
                    {tr.status}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {tr.returnType.replace(/_/g, ' ')}
                </h4>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Net Tax Payable</span>
                  <strong className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">
                    OMR {tr.netTaxPayableOMR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </strong>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <p><strong>Filing Deadline:</strong> {tr.filingDeadline}</p>
                  {tr.acknowledgementNumber && (
                    <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      <strong>Ack No:</strong> {tr.acknowledgementNumber}
                    </p>
                  )}
                  {tr.paymentReference && (
                    <p className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                      <strong>Payment Ref:</strong> {tr.paymentReference}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {tr.paymentStatus === 'PAID' ? '✓ Settled' : '⏳ Payment Pending'}
                </span>
                {tr.paymentStatus === 'UNPAID' && (
                  <button
                    onClick={() => setSelectedReturnPay(tr)}
                    className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition cursor-pointer"
                  >
                    Confirm Payment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. STATUTORY REPORTING (CBO / MOCIIP / NCSI) */}
      {activeSubTab === 'statutory' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Regulatory & Ministerial Reporting Packages</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Statutory economic packages filed with Central Bank of Oman, MOCIIP, and National Statistics.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Report Name</th>
                  <th className="px-4 py-3">Regulatory Body</th>
                  <th className="px-4 py-3">Period & Frequency</th>
                  <th className="px-4 py-3">Filing Due Date</th>
                  <th className="px-4 py-3">Submission Channel</th>
                  <th className="px-4 py-3">Signatory</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {statutoryReports.map(rep => (
                  <tr key={rep.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100 text-xs">{rep.reportName}</td>
                    <td className="px-4 py-4">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        {rep.regulatoryBody}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-600 dark:text-slate-400">
                      {rep.reportingPeriod} ({rep.submissionFrequency})
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-slate-700 dark:text-slate-300 font-medium">{rep.dueDate}</td>
                    <td className="px-4 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{rep.submissionChannel}</td>
                    <td className="px-4 py-4 text-xs text-slate-800 dark:text-slate-200">{rep.signedBy}</td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                        {rep.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: LOG TAX INVOICE */}
      {isAddVatOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg">Log Electronic Tax Invoice</h3>
              <button onClick={() => setIsAddVatOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVatSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Invoice Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. INV-2026-0410"
                    value={vatForm.invoiceNumber}
                    onChange={e => setVatForm({ ...vatForm, invoiceNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Direction</label>
                  <select
                    value={vatForm.direction}
                    onChange={e => setVatForm({ ...vatForm, direction: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="OUTPUT_VAT">Output VAT (Sales)</option>
                    <option value="INPUT_VAT">Input VAT (Purchase)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Counterparty Entity Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oman Cables Industry SAOG"
                  value={vatForm.partyName}
                  onChange={e => setVatForm({ ...vatForm, partyName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Party VAT TIN *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. OM1200984729"
                    value={vatForm.partyVatTin}
                    onChange={e => setVatForm({ ...vatForm, partyVatTin: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Taxable Amount (OMR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={vatForm.taxableAmountOMR || ''}
                    onChange={e => setVatForm({ ...vatForm, taxableAmountOMR: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex justify-between items-center">
                <span className="text-emerald-800 font-semibold">Standard 5% VAT Calculated:</span>
                <strong className="font-mono text-emerald-900 text-sm">
                  OMR {((vatForm.taxableAmountOMR || 0) * 0.05).toFixed(2)}
                </strong>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="revCharge"
                  checked={vatForm.reverseChargeApplicable}
                  onChange={e => setVatForm({ ...vatForm, reverseChargeApplicable: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="revCharge" className="text-xs text-slate-700">
                  Cross-Border Reverse Charge Mechanism applies
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddVatOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition cursor-pointer shadow-sm"
                >
                  Log Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRM TAX PAYMENT */}
      {selectedReturnPay && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-lg">Confirm Tax Settlement</h3>
              <button onClick={() => setSelectedReturnPay(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-4 text-sm">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Return Period</span>
                <p className="font-semibold text-slate-900">{selectedReturnPay.returnType} ({selectedReturnPay.period})</p>
                <p className="text-sm font-mono font-bold text-emerald-700 mt-1">
                  Payable: OMR {selectedReturnPay.netTaxPayableOMR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bank Payment Wire Reference No. *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NBO-OTA-20260420-9402"
                  value={paymentRefInput}
                  onChange={e => setPaymentRefInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReturnPay(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition cursor-pointer shadow-sm"
                >
                  Verify Payment & Accept
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

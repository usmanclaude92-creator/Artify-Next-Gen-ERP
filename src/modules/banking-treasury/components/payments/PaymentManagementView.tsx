import React, { useState } from 'react';
import { useBankingTreasury } from '../../services/bankingTreasuryStore';
import {
  BankPaymentRecord,
  ChequePaymentRecord,
  ElectronicPaymentBatch,
  PaymentApprovalQueueItem,
  CurrencyCode,
  TransactionStatus
} from '../../types';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  Download,
  ShieldCheck,
  Send,
  Building,
  Calendar,
  Layers,
  ArrowUpRight,
  UserCheck,
  XCircle,
  Clock,
  Lock,
  AlertOctagon,
  Eye,
  FileCheck,
  Check,
  X,
  BookOpen
} from 'lucide-react';

export const PaymentManagementView: React.FC = () => {
  const {
    bankPayments,
    chequePayments,
    electronicBatches,
    approvalQueue,
    bankAccounts,
    createBankPayment,
    updateBankPaymentStatus,
    issueChequePayment,
    updateChequeStatus,
    createElectronicBatch,
    processPaymentApproval,
    activeActor,
    availableActors,
    setActiveActor,
    glJournalEntries,
    auditLogs
  } = useBankingTreasury();

  const [activeTab, setActiveTab] = useState<'bank' | 'cheque' | 'electronic' | 'approvals' | 'gl_audit'>('approvals');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals & Drawers
  const [showWireModal, setShowWireModal] = useState(false);
  const [showChequeModal, setShowChequeModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedQueueItem, setSelectedQueueItem] = useState<PaymentApprovalQueueItem | null>(null);
  const [rejectionComment, setRejectionComment] = useState('');
  const [approvalFeedback, setApprovalFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State: Bank Wire Transfer
  const [wireBankAccId, setWireBankAccId] = useState(bankAccounts[0]?.id || '');
  const [wireBeneficiary, setWireBeneficiary] = useState('');
  const [wireIban, setWireIban] = useState('');
  const [wireSwift, setWireSwift] = useState('BMUSOMRX');
  const [wireAmount, setWireAmount] = useState<number>(25000);
  const [wireCurrency, setWireCurrency] = useState<CurrencyCode>('OMR');
  const [wireMethod, setWireMethod] = useState<BankPaymentRecord['paymentMethod']>('ACH / Local RTGS');
  const [wirePurpose, setWirePurpose] = useState('');
  const [wirePreparedBy, setWirePreparedBy] = useState(activeActor.name);

  // Form State: Cheque Payment
  const [chqBankAccId, setChqBankAccId] = useState(bankAccounts[0]?.id || '');
  const [chqNumber, setChqNumber] = useState('');
  const [chqPayee, setChqPayee] = useState('');
  const [chqAmount, setChqAmount] = useState<number>(12000);
  const [chqCurrency, setChqCurrency] = useState<CurrencyCode>('OMR');
  const [chqDate, setChqDate] = useState(new Date().toISOString().split('T')[0]);
  const [chqDueDate, setChqDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [chqIsPdc, setChqIsPdc] = useState(false);
  const [chqPurpose, setChqPurpose] = useState('');

  // Form State: Electronic Batch
  const [batchBankAccId, setBatchBankAccId] = useState(bankAccounts[0]?.id || '');
  const [batchType, setBatchType] = useState<ElectronicPaymentBatch['batchType']>('WPS Salary Transfer');
  const [batchTotalCount, setBatchTotalCount] = useState(240);
  const [batchTotalAmount, setBatchTotalAmount] = useState(145000);

  const formatCurrency = (val: number, curr = 'OMR') => {
    return `${curr} ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleCreateWire = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wireBeneficiary || wireAmount <= 0) return;
    const selectedAcc = bankAccounts.find((b) => b.id === wireBankAccId);
    const amountInOMR = wireCurrency === 'USD' ? wireAmount * 0.385 : wireAmount;

    const result = createBankPayment({
      bankAccountId: wireBankAccId,
      bankAccountName: selectedAcc?.accountName || 'Operating Current A/C',
      paymentMethod: wireMethod,
      beneficiaryName: wireBeneficiary,
      beneficiaryBank: 'Beneficiary Bank Oman',
      beneficiaryIban: wireIban || 'OM44BMUS9988221100',
      beneficiarySwift: wireSwift,
      amount: Number(wireAmount),
      currency: wireCurrency,
      exchangeRate: wireCurrency === 'USD' ? 0.385 : 1.0,
      amountInOMR: amountInOMR,
      paymentDate: new Date().toISOString().split('T')[0],
      valueDate: new Date().toISOString().split('T')[0],
      purposeOfRemittance: wirePurpose || 'Commercial Supplier Settlement',
      invoiceReferences: [`INV-2026-${Math.floor(Math.random() * 800) + 100}`],
      preparedBy: wirePreparedBy,
      bankChargesBorneBy: 'OUR (Debtor)'
    });

    if (!result.success) {
      alert(result.error);
      return;
    }

    setShowWireModal(false);
    setWireBeneficiary('');
    setWireAmount(25000);
    setWirePurpose('');
    setActiveTab('approvals');
  };

  const handleIssueCheque = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chqNumber || !chqPayee || chqAmount <= 0) return;
    const selectedAcc = bankAccounts.find((b) => b.id === chqBankAccId);

    const result = issueChequePayment({
      bankAccountId: chqBankAccId,
      bankAccountName: selectedAcc?.accountName || 'Operating Account',
      chequeNumber: chqNumber,
      chequeBookId: 'CHQ-BK-2026-A',
      payeeName: chqPayee,
      amount: Number(chqAmount),
      currency: chqCurrency,
      chequeDate: chqDate,
      dueDate: chqDueDate,
      isAccountPayeeOnly: true,
      isPostDated: chqIsPdc,
      purpose: chqPurpose || 'Advance supplier settlement',
      glDebitAccount: '2010-01-001',
      preparedBy: activeActor.name,
      signatoryA: 'Dr. Tariq Al-Habsi'
    });

    if (!result.success) {
      alert(result.error);
      return;
    }

    setShowChequeModal(false);
    setChqNumber('');
    setChqPayee('');
    setChqAmount(12000);
    setChqIsPdc(false);
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedAcc = bankAccounts.find((b) => b.id === batchBankAccId);
    const result = createElectronicBatch({
      batchType: batchType,
      bankAccountId: batchBankAccId,
      bankAccountName: selectedAcc?.accountName || 'WPS Payroll Account',
      totalTransactions: Number(batchTotalCount),
      totalAmount: Number(batchTotalAmount),
      currency: 'OMR',
      creationDate: new Date().toISOString().split('T')[0],
      executionDate: new Date().toISOString().split('T')[0],
      generatedFileFormat: 'WPS .SIF',
      authorizedSignatories: ['Sarah Jenkins (CFO)', 'Eng. Salim Al-Rawahi (CEO)']
    });

    if (!result.success) {
      alert(result.error);
      return;
    }

    setShowBatchModal(false);
    setActiveTab('approvals');
  };

  const handleExecuteApproval = (decision: 'approve' | 'reject') => {
    if (!selectedQueueItem) return;

    const res = processPaymentApproval(selectedQueueItem.id, decision, rejectionComment);
    if (!res.success) {
      setApprovalFeedback({ type: 'error', message: res.error || 'Approval rejected by workflow engine.' });
    } else {
      setApprovalFeedback({
        type: 'success',
        message:
          decision === 'approve'
            ? `Decision recorded successfully! ${res.glVoucherId ? `GL Voucher ${res.glVoucherId} posted to ledger.` : res.updatedStatus}`
            : 'Payment record marked as Rejected.'
      });
      // Refresh local modal selection
      const updated = approvalQueue.find((q) => q.id === selectedQueueItem.id);
      setSelectedQueueItem(updated || null);
    }
  };

  // Filtered lists
  const filteredWires = bankPayments.filter((p) => {
    const matchesSearch =
      p.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.paymentReference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCheques = chequePayments.filter((c) => {
    const matchesSearch =
      c.payeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.chequeNumber.includes(searchTerm);
    return matchesSearch;
  });

  const filteredQueue = approvalQueue.filter((q) => {
    const matchesSearch =
      q.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.transactionRef.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Pending Dual Approvals
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-amber-600">
              {approvalQueue.filter((q) => q.status === 'Pending').length}
            </span>
            <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
              Queue SLA &lt; 24h
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Approved Bank Wires (MT103)
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-emerald-600">
              {bankPayments.filter((p) => p.status === 'Approved' || p.status === 'Posted').length}
            </span>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
              Real-Time RTGS
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            WPS Payroll / Bulk Batches
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-indigo-600">{electronicBatches.length}</span>
            <span className="text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full font-medium">
              ISO 20022 SIF
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            GL Posted Vouchers
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-slate-900">{glJournalEntries.length}</span>
            <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-medium font-mono">
              Auto-Balanced
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs & Primary Action Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('approvals')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'approvals'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Workflow Approval Queue</span>
              {approvalQueue.filter((q) => q.status === 'Pending').length > 0 && (
                <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                  {approvalQueue.filter((q) => q.status === 'Pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('bank')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'bank'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Bank Wire Transfers ({bankPayments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('cheque')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'cheque'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Cheque Register ({chequePayments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('electronic')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'electronic'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>WPS & Electronic Batches</span>
            </button>

            <button
              onClick={() => setActiveTab('gl_audit')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'gl_audit'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>GL Journals & Audit Trail</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowWireModal(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Initiate Wire Transfer</span>
            </button>
            <button
              onClick={() => setShowChequeModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Issue Cheque</span>
            </button>
            <button
              onClick={() => setShowBatchModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Create WPS Batch</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search beneficiary, reference, IBAN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 self-end">
            <span className="text-[11px] text-slate-400 font-medium">Status Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* TAB 1: WORKFLOW APPROVAL QUEUE */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-900">
                Active Segregation of Duties (SoD) & Multi-Tier Governance Engine
              </h4>
              <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                Every payment requisition is evaluated in real time. Self-approvals by transaction preparers are strictly prohibited (Rule SOD-BNK-01). Transactions over OMR 50,000 require concurrent Category A (Executive) and Category B (Treasury Director) authorization.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Transaction Ref & Type</th>
                  <th className="p-3.5">Beneficiary / Payee</th>
                  <th className="p-3.5">Workflow Matrix & Stage</th>
                  <th className="p-3.5">Compliance & Sanctions</th>
                  <th className="p-3.5 text-right">Amount</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredQueue.map((item) => {
                  const isPending = item.status === 'Pending';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-slate-900">{item.transactionRef}</div>
                        <div className="text-[11px] text-slate-500">{item.transactionType}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{item.submissionDate}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{item.beneficiaryName}</div>
                        <div className="text-[11px] text-slate-500">
                          Submitted by: <strong className="text-slate-700">{item.submittedBy}</strong>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800">{item.requiredApprovalLevel}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden w-24">
                            <div
                              className="bg-indigo-600 h-full rounded-full transition-all"
                              style={{
                                width: `${Math.min(100, (item.currentStep / item.totalSteps) * 100)}%`
                              }}
                            />
                          </div>
                          <span className="text-[10px] text-indigo-700 font-bold">
                            Stage {item.currentStep}/{item.totalSteps}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Sanctions Clear</span>
                        </div>
                        <span className="text-[10px] text-slate-400">CBO Whitelist OK</span>
                      </td>
                      <td className="p-3.5 text-right font-bold text-slate-900 text-sm">
                        {formatCurrency(item.amount, item.currency)}
                      </td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : item.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {item.status}
                        </span>
                        {item.glVoucherId && (
                          <span className="block text-[10px] font-mono text-indigo-600 mt-0.5">
                            {item.glVoucherId}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => {
                            setSelectedQueueItem(item);
                            setApprovalFeedback(null);
                            setRejectionComment('');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs cursor-pointer shadow-2xs transition-colors flex items-center gap-1.5 mx-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isPending ? 'Review & Sign' : 'View Workflow'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BANK WIRE TRANSFERS */}
      {activeTab === 'bank' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Payment Ref & Date</th>
                  <th className="p-3.5">Beneficiary & Bank</th>
                  <th className="p-3.5">Drawn Bank Account</th>
                  <th className="p-3.5">Method & Purpose</th>
                  <th className="p-3.5 text-right">Disbursement Amount</th>
                  <th className="p-3.5 text-center">Workflow Status</th>
                  <th className="p-3.5 text-center">GL Ledger Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredWires.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-slate-900">{pay.paymentReference}</div>
                      <div className="text-[10px] text-slate-500">{pay.paymentDate}</div>
                      <div className="text-[10px] text-slate-400">Prep: {pay.preparedBy}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{pay.beneficiaryName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{pay.beneficiaryIban}</div>
                      <div className="text-[10px] text-slate-400">{pay.beneficiarySwift}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800">{pay.bankAccountName}</div>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                        {pay.currency}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-800 font-medium">{pay.purposeOfRemittance}</div>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-semibold mt-0.5 inline-block">
                        {pay.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-bold text-slate-900 text-sm">
                      {formatCurrency(pay.amount, pay.currency)}
                      {pay.currency !== 'OMR' && (
                        <span className="block text-[10px] text-slate-400 font-normal">
                          ≈ {formatCurrency(pay.amountInOMR, 'OMR')}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          pay.status === 'Approved' || pay.status === 'Posted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : pay.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {pay.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      {pay.glVoucherId ? (
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-mono font-bold">
                          {pay.glVoucherId}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Pending Post</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CHEQUES & PDCs */}
      {activeTab === 'cheque' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Cheque # & Series</th>
                  <th className="p-3.5">Payee Name & Purpose</th>
                  <th className="p-3.5">Drawn Bank Account</th>
                  <th className="p-3.5">Issue Date / Maturity</th>
                  <th className="p-3.5 text-right">Amount</th>
                  <th className="p-3.5 text-center">PDC Classification</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCheques.map((chq) => (
                  <tr key={chq.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-slate-900">#{chq.chequeNumber}</div>
                      <div className="text-[10px] text-slate-400">{chq.chequeBookId}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{chq.payeeName}</div>
                      <div className="text-[10px] text-slate-500">{chq.purpose}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800">{chq.bankAccountName}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-800">Date: {chq.chequeDate}</div>
                      <div className="text-[11px] text-slate-500 font-medium">Due: {chq.dueDate}</div>
                    </td>
                    <td className="p-3.5 text-right font-bold text-slate-900 text-sm">
                      {formatCurrency(chq.amount, chq.currency)}
                    </td>
                    <td className="p-3.5 text-center">
                      {chq.isPostDated ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                          Post-Dated (PDC)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                          Current Date
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          chq.status === 'Presented & Cleared'
                            ? 'bg-emerald-100 text-emerald-800'
                            : chq.status === 'Signed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {chq.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      {chq.status !== 'Presented & Cleared' && (
                        <button
                          onClick={() => updateChequeStatus(chq.id, 'Presented & Cleared')}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-indigo-700 text-[11px] font-semibold cursor-pointer"
                        >
                          Mark Cleared
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ELECTRONIC BATCHES & WPS */}
      {activeTab === 'electronic' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {electronicBatches.map((batch) => (
              <div key={batch.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {batch.batchNumber}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{batch.batchType}</h3>
                    <p className="text-xs text-slate-500">{batch.bankAccountName}</p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      batch.status === 'Approved' || batch.status === 'Processed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {batch.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Beneficiary Records</span>
                    <span className="text-sm font-bold text-slate-900">
                      {batch.totalTransactions} Employees
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Total Disbursement</span>
                    <span className="text-sm font-bold text-emerald-700">
                      {formatCurrency(batch.totalAmount, batch.currency)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs flex items-center justify-between">
                  <span className="text-indigo-900 font-medium">Format: {batch.generatedFileFormat}</span>
                  <button
                    onClick={() => alert(`Simulated file export for ${batch.batchNumber} generated.`)}
                    className="text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download WPS SIF</span>
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Signatories: {batch.authorizedSignatories?.join(', ') || 'Dual Sign-off'}</span>
                  <span>Exec: {batch.executionDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: GL JOURNALS & AUDIT TRAIL */}
      {activeTab === 'gl_audit' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              General Ledger (GL) Posted Accounting Vouchers
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Real-time balanced double-entry accounting journals generated by workflow approvals and cash postings
            </p>

            {glJournalEntries.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100 text-slate-400 text-xs">
                No GL vouchers posted in this session yet. Approve a payment or post a cash voucher to see automatic balanced journals.
              </div>
            ) : (
              <div className="space-y-3">
                {glJournalEntries.map((gl) => (
                  <div key={gl.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div>
                        <span className="font-mono font-bold text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {gl.voucherNumber}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 ml-2">{gl.narration}</span>
                      </div>
                      <div className="text-xs text-slate-500">
                        Date: {gl.postingDate} • Posted by: <strong className="text-slate-700">{gl.postedBy}</strong>
                      </div>
                    </div>

                    <table className="w-full text-xs text-left mt-2 bg-white rounded-lg overflow-hidden border border-slate-100">
                      <thead className="bg-slate-100 text-slate-600 text-[11px]">
                        <tr>
                          <th className="p-2">Account Code & Name</th>
                          <th className="p-2">Description</th>
                          <th className="p-2 text-right">Debit (OMR)</th>
                          <th className="p-2 text-right">Credit (OMR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {gl.lines.map((line) => (
                          <tr key={line.id}>
                            <td className="p-2 font-mono font-medium text-slate-800">
                              {line.accountCode} — {line.accountName}
                            </td>
                            <td className="p-2 text-slate-600">{line.description}</td>
                            <td className="p-2 text-right font-bold text-slate-900">
                              {line.debit > 0 ? formatCurrency(line.debit) : '—'}
                            </td>
                            <td className="p-2 text-right font-bold text-slate-900">
                              {line.credit > 0 ? formatCurrency(line.credit) : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Banking & Treasury Audit Trail Log
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Immutable historical trace of all payment submissions, signatory decisions, and authorization attempts
            </p>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 text-xs flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-200 px-1.5 py-0.2 rounded">
                        {log.action}
                      </span>
                      <strong className="text-slate-900">{log.entityReference}</strong>
                      <span className="text-slate-400">by {log.actorName} ({log.actorRole})</span>
                    </div>
                    <p className="text-slate-600 mt-1">{log.details}</p>
                    {log.violationCode && (
                      <span className="text-rose-600 font-mono text-[10px] font-bold block mt-0.5">
                        Violation Code: {log.violationCode}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REVIEW & AUTHORIZE WORKFLOW DRAWER */}
      {selectedQueueItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {selectedQueueItem.transactionRef}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Workflow Authorization Matrix
                </h3>
                <p className="text-xs text-slate-500">{selectedQueueItem.requiredApprovalLevel}</p>
              </div>
              <button
                onClick={() => setSelectedQueueItem(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 py-4 text-xs">
              {/* Feedback Banner if any */}
              {approvalFeedback && (
                <div
                  className={`p-3 rounded-xl border flex items-start gap-2 ${
                    approvalFeedback.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  {approvalFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-relaxed font-medium">{approvalFeedback.message}</span>
                </div>
              )}

              {/* Transaction Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block">Beneficiary</span>
                  <strong className="text-slate-900 block truncate">{selectedQueueItem.beneficiaryName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Disbursement Total</span>
                  <strong className="text-emerald-700 text-sm">
                    {formatCurrency(selectedQueueItem.amount, selectedQueueItem.currency)}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Prepared / Made By</span>
                  <strong className="text-slate-900">{selectedQueueItem.submittedBy}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Current Status</span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedQueueItem.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedQueueItem.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedQueueItem.status}
                  </span>
                </div>
              </div>

              {/* SoD & DoA Real-Time Verification Check */}
              {selectedQueueItem.status === 'Pending' && (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-indigo-600" />
                      Active Approver Identity Validation
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Acting as: <strong>{activeActor.name}</strong> ({activeActor.role})
                    </span>
                  </div>

                  {/* Maker Check */}
                  {selectedQueueItem.submittedBy.toLowerCase().includes(activeActor.name.toLowerCase()) ||
                  activeActor.name.toLowerCase().includes(selectedQueueItem.submittedBy.toLowerCase()) ? (
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2 text-[11px]">
                      <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Self-Approval Prohibited (SOD-BNK-01):</strong> You created/submitted this payment voucher. Under corporate governance policy, an independent checker or authorized signatory must execute the sign-off. Switch actor above to test independent approval.
                      </div>
                    </div>
                  ) : activeActor.approvalLimitOMR < (selectedQueueItem.amountInOMR || selectedQueueItem.amount) ? (
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-2 text-[11px]">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>DoA Limit Shortage (DOA-BNK-01):</strong> Your authorization limit of OMR {activeActor.approvalLimitOMR.toLocaleString()} is below the transaction value of OMR {(selectedQueueItem.amountInOMR || selectedQueueItem.amount).toLocaleString()}. Escalation to CFO or CEO is required.
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-[11px]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        <strong>Authorization Verified:</strong> Segregation of duties validated. Authority limit of OMR {activeActor.approvalLimitOMR.toLocaleString()} exceeds requirement.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Sequential Approval Stages Stepper */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Sequential Approval Stages</h4>
                <div className="space-y-2">
                  {(selectedQueueItem.approverStages || []).map((stage) => {
                    const isPassed = stage.status === 'Approved';
                    const isCurrent = stage.level === selectedQueueItem.currentStep && selectedQueueItem.status === 'Pending';
                    return (
                      <div
                        key={stage.level}
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          isPassed
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : isCurrent
                            ? 'bg-indigo-50/50 border-indigo-200 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                              isPassed
                                ? 'bg-emerald-600 text-white'
                                : isCurrent
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-300 text-slate-600'
                            }`}
                          >
                            {isPassed ? <Check className="w-4 h-4" /> : stage.level}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{stage.role}</span>
                            <span className="text-[10px] text-slate-500">
                              Designated: {stage.approverName} • Limit: OMR {stage.approvalLimitOMR.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isPassed
                                ? 'bg-emerald-100 text-emerald-800'
                                : isCurrent
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {stage.status}
                          </span>
                          {stage.decisionBy && (
                            <span className="block text-[10px] text-slate-400 mt-0.5">
                              by {stage.decisionBy}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rejection / Comment Area if Pending */}
              {selectedQueueItem.status === 'Pending' && (
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Signatory Comments / Rejection Reason (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Approved as per Board resolution #41 or Reason for return..."
                    value={rejectionComment}
                    onChange={(e) => setRejectionComment(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedQueueItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>

              {selectedQueueItem.status === 'Pending' && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleExecuteApproval('reject')}
                    className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold cursor-pointer border border-rose-200 transition-colors"
                  >
                    Reject & Return
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExecuteApproval('approve')}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authorize & Advance Step</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INITIATE WIRE TRANSFER */}
      {showWireModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Initiate Bank Wire Transfer</h3>
            <p className="text-xs text-slate-500 mb-4">
              Vouchers will be routed automatically through the sequential Workflow Engine.
            </p>
            <form onSubmit={handleCreateWire} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Debit Bank Account *</label>
                <select
                  value={wireBankAccId}
                  onChange={(e) => setWireBankAccId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  {bankAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.accountName} — {a.currency} ({formatCurrency(a.currentBookBalance, a.currency)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Beneficiary Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Al-Tasnim Infrastructure LLC"
                    value={wireBeneficiary}
                    onChange={(e) => setWireBeneficiary(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Beneficiary IBAN *</label>
                  <input
                    type="text"
                    required
                    placeholder="OM44BMUS042399990001"
                    value={wireIban}
                    onChange={(e) => setWireIban(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Amount *</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={wireAmount}
                    onChange={(e) => setWireAmount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Currency</label>
                  <select
                    value={wireCurrency}
                    onChange={(e) => setWireCurrency(e.target.value as CurrencyCode)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  >
                    <option value="OMR">OMR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="AED">AED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Payment Method</label>
                <select
                  value={wireMethod}
                  onChange={(e) => setWireMethod(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  <option value="ACH / Local RTGS">ACH / Local RTGS (Central Bank of Oman)</option>
                  <option value="Bank Transfer">International SWIFT MT103</option>
                  <option value="Direct Debit">Internal Book Transfer</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Commercial Purpose</label>
                <input
                  type="text"
                  placeholder="Monthly subcontractor milestone certificate release"
                  value={wirePurpose}
                  onChange={(e) => setWirePurpose(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowWireModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Submit to Workflow Engine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ISSUE CHEQUE */}
      {showChequeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Issue Commercial Cheque</h3>
            <p className="text-xs text-slate-500 mb-4">
              Registered cheques update the Cheque register and PDC vault if post-dated.
            </p>
            <form onSubmit={handleIssueCheque} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Drawn Bank Account *</label>
                <select
                  value={chqBankAccId}
                  onChange={(e) => setChqBankAccId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  {bankAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.accountName} — {a.currency}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Cheque Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="004921"
                    value={chqNumber}
                    onChange={(e) => setChqNumber(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Payee Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Muscat Electrics SAOC"
                    value={chqPayee}
                    onChange={(e) => setChqPayee(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Amount (OMR) *</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={chqAmount}
                    onChange={(e) => setChqAmount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Cheque Issue Date</label>
                  <input
                    type="date"
                    value={chqDate}
                    onChange={(e) => setChqDate(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Post-Dated Cheque (PDC)</span>
                  <span className="text-[10px] text-slate-500">Matures at a future date for supplier guarantee</span>
                </div>
                <input
                  type="checkbox"
                  checked={chqIsPdc}
                  onChange={(e) => setChqIsPdc(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

              {chqIsPdc && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">PDC Maturity / Presentation Date *</label>
                  <input
                    type="date"
                    required
                    value={chqDueDate}
                    onChange={(e) => setChqDueDate(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Purpose</label>
                <input
                  type="text"
                  placeholder="Security deposit for heavy machinery lease"
                  value={chqPurpose}
                  onChange={(e) => setChqPurpose(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowChequeModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Issue Cheque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE WPS BATCH */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Create Electronic Payment Batch (WPS)</h3>
            <p className="text-xs text-slate-500 mb-4">
              Generates Wages Protection System (WPS) .SIF format for Ministry of Labour compliance.
            </p>
            <form onSubmit={handleCreateBatch} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Salary Bank Account *</label>
                <select
                  value={batchBankAccId}
                  onChange={(e) => setBatchBankAccId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  {bankAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.accountName} — {a.currency}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Total Employees *</label>
                  <input
                    type="number"
                    required
                    value={batchTotalCount}
                    onChange={(e) => setBatchTotalCount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Total Net Payroll (OMR) *</label>
                  <input
                    type="number"
                    required
                    value={batchTotalAmount}
                    onChange={(e) => setBatchTotalAmount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Generate WPS Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

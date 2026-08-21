import React, { useState } from 'react';
import { useBankingTreasury } from '../../services/bankingTreasuryStore';
import {
  BankPaymentRecord,
  ChequePaymentRecord,
  ElectronicPaymentBatch,
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
  Clock
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
    processPaymentApproval
  } = useBankingTreasury();

  const [activeTab, setActiveTab] = useState<'bank' | 'cheque' | 'electronic' | 'approvals'>('bank');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showWireModal, setShowWireModal] = useState(false);
  const [showChequeModal, setShowChequeModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);

  // Form State: Bank Wire Transfer
  const [wireBankAccId, setWireBankAccId] = useState(bankAccounts[0]?.id || '');
  const [wireBeneficiary, setWireBeneficiary] = useState('');
  const [wireIban, setWireIban] = useState('');
  const [wireSwift, setWireSwift] = useState('BMUSOMRX');
  const [wireAmount, setWireAmount] = useState<number>(25000);
  const [wireCurrency, setWireCurrency] = useState<CurrencyCode>('OMR');
  const [wireMethod, setWireMethod] = useState<BankPaymentRecord['paymentMethod']>('ACH / Local RTGS');
  const [wirePurpose, setWirePurpose] = useState('');
  const [wirePreparedBy, setWirePreparedBy] = useState('Treasury Ops (Hilal Al-Kharusi)');

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

    createBankPayment({
      bankAccountId: wireBankAccId,
      bankAccountName: selectedAcc?.accountName || 'Operating Account',
      paymentMethod: wireMethod,
      beneficiaryName: wireBeneficiary,
      beneficiaryBankName: 'Beneficiary Bank',
      beneficiaryIbanOrAccountNumber: wireIban || 'OM44BMUS9988221100',
      beneficiarySwiftBic: wireSwift,
      amount: Number(wireAmount),
      currency: wireCurrency,
      exchangeRate: wireCurrency === 'USD' ? 0.385 : 1.0,
      amountInOMR: amountInOMR,
      paymentDate: new Date().toISOString().split('T')[0],
      valueDate: new Date().toISOString().split('T')[0],
      purpose: wirePurpose || 'Commercial Supplier Settlement',
      glCreditAccountCode: selectedAcc?.glAccountCode || '1010-01-001',
      glDebitAccountCode: '2010-01-001',
      preparedBy: wirePreparedBy
    });

    setShowWireModal(false);
    setWireBeneficiary('');
    setWireAmount(25000);
    setWirePurpose('');
  };

  const handleIssueCheque = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chqNumber || !chqPayee || chqAmount <= 0) return;
    const selectedAcc = bankAccounts.find((b) => b.id === chqBankAccId);
    issueChequePayment({
      bankAccountId: chqBankAccId,
      bankAccountName: selectedAcc?.accountName || 'Operating Account',
      chequeNumber: chqNumber,
      chequeBookSeries: 'CHQ-2026-A',
      payeeName: chqPayee,
      amount: Number(chqAmount),
      currency: chqCurrency,
      chequeDate: chqDate,
      dueDate: chqDueDate,
      isAccountPayeeOnly: true,
      isPostDated: chqIsPdc,
      purpose: chqPurpose || 'Advance supplier settlement',
      voucherReference: `PV-2026-${Math.floor(Math.random() * 900) + 100}`,
      issuedBy: 'Hilal Al-Kharusi (Treasury Specialist)'
    });

    setShowChequeModal(false);
    setChqNumber('');
    setChqPayee('');
    setChqAmount(12000);
    setChqIsPdc(false);
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedAcc = bankAccounts.find((b) => b.id === batchBankAccId);
    createElectronicBatch({
      batchType: batchType,
      bankAccountId: batchBankAccId,
      bankAccountName: selectedAcc?.accountName || 'Payroll Account',
      creationDate: new Date().toISOString().split('T')[0],
      executionDate: new Date().toISOString().split('T')[0],
      totalRecordsCount: Number(batchTotalCount),
      totalAmountOMR: Number(batchTotalAmount),
      fileFormat: batchType === 'WPS Salary Transfer' ? 'WPS .SIF File' : 'ISO 20022 XML (pain.001.001.03)',
      signedByFirstSignatory: 'Eng. Nasser Al-Hinai (CEO)'
    });
    setShowBatchModal(false);
  };

  const filteredBankPayments = bankPayments.filter(
    (p) =>
      p.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.paymentReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCheques = chequePayments.filter(
    (c) =>
      c.chequeNumber.includes(searchTerm) ||
      c.payeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Tabs & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('bank')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'bank'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Bank Transfers ({bankPayments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cheque')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'cheque'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Cheque Issuance ({chequePayments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('electronic')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'electronic'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Electronic Batches / WPS ({electronicBatches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'approvals'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Approval Queue ({approvalQueue.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search payments, payee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 w-48 sm:w-60"
            />
          </div>

          {activeTab === 'bank' && (
            <button
              onClick={() => setShowWireModal(true)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Initiate Wire Transfer</span>
            </button>
          )}

          {activeTab === 'cheque' && (
            <button
              onClick={() => setShowChequeModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Issue Cheque</span>
            </button>
          )}

          {activeTab === 'electronic' && (
            <button
              onClick={() => setShowBatchModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create WPS / ISO Batch</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: BANK PAYMENTS (WIRE TRANSFERS) */}
      {activeTab === 'bank' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Reference # & Date</th>
                  <th className="p-3.5">Beneficiary & IBAN</th>
                  <th className="p-3.5">Debit Bank Account</th>
                  <th className="p-3.5">Method & Purpose</th>
                  <th className="p-3.5 text-right">Transfer Amount</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBankPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-slate-900">{pay.paymentReference}</div>
                      <div className="text-[11px] text-slate-500">{pay.paymentDate}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{pay.beneficiaryName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{pay.beneficiaryIbanOrAccountNumber}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800">{pay.bankAccountName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{pay.glCreditAccountCode}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-800 font-medium">{pay.purpose}</div>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
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
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          pay.status === 'Executed' || pay.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {pay.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      {pay.status === 'Submitted' ? (
                        <button
                          onClick={() => updateBankPaymentStatus(pay.id, 'Approved')}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[11px] font-semibold cursor-pointer"
                        >
                          Quick Sign
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CHEQUE PAYMENTS */}
      {activeTab === 'cheque' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Cheque # & Series</th>
                  <th className="p-3.5">Payee Name</th>
                  <th className="p-3.5">Drawn Bank Account</th>
                  <th className="p-3.5">Issue Date / Due Date</th>
                  <th className="p-3.5 text-right">Amount (OMR)</th>
                  <th className="p-3.5 text-center">PDC Flag</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCheques.map((chq) => (
                  <tr key={chq.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-slate-900">#{chq.chequeNumber}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{chq.chequeBookSeries}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{chq.payeeName}</div>
                      <div className="text-[10px] text-slate-500">{chq.purpose}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800">{chq.bankAccountName}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-800">Issue: {chq.chequeDate}</div>
                      <div className="text-[11px] text-slate-500 font-medium">Maturity: {chq.dueDate}</div>
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
                          chq.status === 'Cleared'
                            ? 'bg-emerald-100 text-emerald-800'
                            : chq.status === 'Signed' || chq.status === 'Handed Over'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {chq.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      {chq.status !== 'Cleared' && (
                        <button
                          onClick={() => updateChequeStatus(chq.id, 'Cleared')}
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
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

      {/* TAB 3: ELECTRONIC BATCHES & WPS */}
      {activeTab === 'electronic' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {electronicBatches.map((batch) => (
              <div key={batch.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {batch.batchNumber}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{batch.batchType}</h3>
                    <p className="text-xs text-slate-500">{batch.bankAccountName}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {batch.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Beneficiary Records</span>
                    <span className="text-sm font-bold text-slate-900">{batch.totalRecordsCount} Employees</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Total Disbursement</span>
                    <span className="text-sm font-bold text-emerald-700">{formatCurrency(batch.totalAmountOMR)}</span>
                  </div>
                </div>

                <div className="mt-3 p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs flex items-center justify-between">
                  <span className="text-indigo-900 font-medium">Format: {batch.fileFormat}</span>
                  <button
                    onClick={() => alert(`Simulated file export for ${batch.batchNumber} generated.`)}
                    className="text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Signatory: {batch.signedByFirstSignatory}</span>
                  <span>Exec: {batch.executionDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PAYMENT APPROVAL QUEUE */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">Dual Authorization Protocol Active</h4>
                <p className="text-[11px] text-amber-800">
                  Transactions exceeding OMR 50,000 require concurrent Category A (CEO) and Category B (CFO) digital sign-offs before transmission to the Central Bank of Oman (CBO) RTGS network.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Transaction Ref & Type</th>
                  <th className="p-3.5">Beneficiary Name</th>
                  <th className="p-3.5">Approval Tier & Progress</th>
                  <th className="p-3.5">Compliance & Sanctions</th>
                  <th className="p-3.5 text-right">Amount</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {approvalQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-slate-900">{item.transactionRef}</div>
                      <div className="text-[11px] text-slate-500">{item.transactionType}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{item.beneficiaryName}</div>
                      <div className="text-[10px] text-slate-400">By: {item.submittedBy}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800">{item.requiredApprovalLevel}</div>
                      <div className="text-[10px] text-indigo-600 font-semibold">
                        Step {item.currentStep} of {item.totalSteps} Completed
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Sanctions Clear</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-right font-bold text-slate-900 text-sm">
                      {formatCurrency(item.amount, item.currency)}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      {item.status === 'Pending' ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => processPaymentApproval(item.id, 'approve')}
                            className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                            title="Approve & Sign"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => processPaymentApproval(item.id, 'reject')}
                            className="p-1 rounded bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
                            title="Reject"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400">Decision Recorded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: INITIATE WIRE TRANSFER */}
      {showWireModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Initiate Bank Wire Transfer</h3>
            <form onSubmit={handleCreateWire} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Debit From Bank Account *</label>
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
                  <option value="International Wire (SWIFT)">International Wire (SWIFT MT103)</option>
                  <option value="Book Transfer (Internal)">Book Transfer (Internal Bank)</option>
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
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Submit for Authorization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ISSUE CHEQUE */}
      {showChequeModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Issue Commercial Cheque</h3>
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
                      {a.accountName} ({a.accountNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Cheque Serial Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="900241"
                    value={chqNumber}
                    onChange={(e) => setChqNumber(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none font-mono"
                  />
                </div>
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
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Payee Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Al-Futtaim Engineering LLC"
                  value={chqPayee}
                  onChange={(e) => setChqPayee(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Cheque Issue Date *</label>
                  <input
                    type="date"
                    required
                    value={chqDate}
                    onChange={(e) => setChqDate(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Maturity / Due Date *</label>
                  <input
                    type="date"
                    required
                    value={chqDueDate}
                    onChange={(e) => setChqDueDate(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <input
                  type="checkbox"
                  id="isPdc"
                  checked={chqIsPdc}
                  onChange={(e) => setChqIsPdc(e.target.checked)}
                  className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
                />
                <label htmlFor="isPdc" className="text-xs font-semibold text-slate-800 cursor-pointer">
                  Mark as Post-Dated Cheque (PDC) & Register into Treasury Vault
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowChequeModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Sign & Issue Cheque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE ELECTRONIC BATCH */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Create Electronic Payment Batch</h3>
            <form onSubmit={handleCreateBatch} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Batch Type *</label>
                <select
                  value={batchType}
                  onChange={(e) => setBatchType(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  <option value="WPS Salary Transfer">WPS Salary Transfer (Ministry of Labour)</option>
                  <option value="Vendor Bulk Wire (ISO 20022)">Vendor Bulk Wire (ISO 20022 pain.001)</option>
                  <option value="Dividend Distribution">Dividend Distribution Batch</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Disbursing Bank Account *</label>
                <select
                  value={batchBankAccId}
                  onChange={(e) => setBatchBankAccId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  {bankAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.accountName} ({formatCurrency(a.currentBookBalance)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Beneficiary Count *</label>
                  <input
                    type="number"
                    required
                    value={batchTotalCount}
                    onChange={(e) => setBatchTotalCount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Total Batch Value (OMR) *</label>
                  <input
                    type="number"
                    step="0.001"
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
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Generate Batch & Sign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

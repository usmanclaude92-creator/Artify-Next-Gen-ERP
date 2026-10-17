import React, { useState } from 'react';
import { useBankingTreasury } from '../../services/bankingTreasuryStore';
import {
  CustomerReceiptRecord,
  OtherReceiptRecord,
  BankDepositSlipRecord,
  ReceiptAllocationItem,
  CurrencyCode
} from '../../types';
import {
  ArrowDownLeft,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  CreditCard,
  Building,
  Layers,
  DollarSign,
  Send,
  PieChart,
  CheckCheck
} from 'lucide-react';

export const ReceiptManagementView: React.FC = () => {
  const {
    customerReceipts,
    otherReceipts,
    depositSlips,
    receiptAllocations,
    bankAccounts,
    recordCustomerReceipt,
    allocateReceiptToInvoice,
    recordOtherReceipt,
    generateDepositSlip
  } = useBankingTreasury();

  const [activeTab, setActiveTab] = useState<'customer' | 'allocations' | 'other' | 'deposits'>('customer');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals & Drawers
  const [showAddCustomerReceiptModal, setShowAddCustomerReceiptModal] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showAddOtherReceiptModal, setShowAddOtherReceiptModal] = useState(false);
  const [showAddDepositSlipModal, setShowAddDepositSlipModal] = useState(false);
  const [selectedReceiptForAllocation, setSelectedReceiptForAllocation] = useState<CustomerReceiptRecord | null>(null);

  // Form State: Customer Receipt
  const [rcptBankAccId, setRcptBankAccId] = useState(bankAccounts[0]?.id || '');
  const [rcptDate, setRcptDate] = useState(new Date().toISOString().split('T')[0]);
  const [rcptCustomerName, setRcptCustomerName] = useState('');
  const [rcptAmount, setRcptAmount] = useState<number>(45000);
  const [rcptCurrency, setRcptCurrency] = useState<CurrencyCode>('OMR');
  const [rcptInstrument, setRcptInstrument] = useState<CustomerReceiptRecord['paymentMode']>('Direct Bank Wire');
  const [rcptInstrumentRef, setRcptInstrumentRef] = useState('');
  const [rcptCollector, setRcptCollector] = useState('Hilal Al-Kharusi (Treasury Specialist)');

  // Form State: Allocation
  const [allocInvoiceNo, setAllocInvoiceNo] = useState('INV-2026-08-991');
  const [allocInvTotal, setAllocInvTotal] = useState<number>(30000);
  const [allocAmount, setAllocAmount] = useState<number>(30000);

  // Form State: Other Receipt
  const [otherBankAccId, setOtherBankAccId] = useState(bankAccounts[0]?.id || '');
  const [otherDate, setOtherDate] = useState(new Date().toISOString().split('T')[0]);
  const [otherSource, setOtherSource] = useState('Bank Sohar International Treasury');
  const [otherCategory, setOtherCategory] = useState<OtherReceiptRecord['receiptCategory']>('Bank Term Deposit Interest');
  const [otherAmount, setOtherAmount] = useState<number>(3250);
  const [otherDesc, setOtherDesc] = useState('');

  // Form State: Deposit Slip
  const [depBankAccId, setDepBankAccId] = useState(bankAccounts[0]?.id || '');
  const [depBranch, setDepBranch] = useState('Bank Muscat — Al-Khuwair Branch');
  const [depCashAmt, setDepCashAmt] = useState<number>(15000);
  const [depChequeAmt, setDepChequeAmt] = useState<number>(35000);
  const [depChequeCount, setDepChequeCount] = useState<number>(3);
  const [depDepositor, setDepDepositor] = useState('Salim Al-Ghafri (Chief Cashier)');

  const formatCurrency = (val: number, curr = 'OMR') => {
    return `${curr} ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleCreateCustomerReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rcptCustomerName || rcptAmount <= 0) return;
    const selectedAcc = bankAccounts.find((b) => b.id === rcptBankAccId);
    recordCustomerReceipt({
      receiptDate: rcptDate,
      customerId: `cust-${Date.now()}`,
      customerName: rcptCustomerName,
      receivingBankAccountId: rcptBankAccId,
      receivingBankAccountName: selectedAcc?.accountName || 'Bank Account',
      paymentMode: rcptInstrument,
      instrumentReference: rcptInstrumentRef || `TXN-${Date.now().toString().slice(-6)}`,
      currency: rcptCurrency,
      amountReceived: Number(rcptAmount),
      exchangeRate: rcptCurrency === 'USD' ? 0.385 : 1.0,
      amountOMR: rcptCurrency === 'USD' ? rcptAmount * 0.385 : rcptAmount,
      glCreditAccount: '1200-01-001',
      collectorName: rcptCollector
    });

    setShowAddCustomerReceiptModal(false);
    setRcptCustomerName('');
    setRcptAmount(45000);
  };

  const handlePerformAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReceiptForAllocation || allocAmount <= 0) return;
    allocateReceiptToInvoice(
      selectedReceiptForAllocation.id,
      allocInvoiceNo,
      Number(allocInvTotal),
      Number(allocAmount)
    );
    setShowAllocateModal(false);
    setSelectedReceiptForAllocation(null);
  };

  const handleCreateOtherReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otherSource || otherAmount <= 0) return;
    const selectedAcc = bankAccounts.find((b) => b.id === otherBankAccId);
    recordOtherReceipt({
      receiptDate: otherDate,
      payerName: otherSource,
      receiptCategory: otherCategory,
      amount: Number(otherAmount),
      currency: 'OMR',
      receivingBankAccountId: otherBankAccId,
      receivingBankAccountName: selectedAcc?.accountName || 'Bank Account',
      glCreditAccount: '4080-01-001',
      glCreditAccountName: 'Treasury Income & Interest',
      remarks: otherDesc || 'Treasury income credit'
    });
    setShowAddOtherReceiptModal(false);
    setOtherSource('');
    setOtherAmount(3250);
  };

  const handleCreateDepositSlip = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedAcc = bankAccounts.find((b) => b.id === depBankAccId);
    const total = Number(depCashAmt) + Number(depChequeAmt);
    generateDepositSlip({
      depositDate: new Date().toISOString().split('T')[0],
      targetBankAccountId: depBankAccId,
      targetBankAccountName: selectedAcc?.accountName || 'Operating Account',
      bankBranchDepositLocation: depBranch,
      totalCashAmount: Number(depCashAmt),
      totalChequesAmount: Number(depChequeAmt),
      grandTotalDeposit: total,
      chequeCount: Number(depChequeCount),
      depositedBy: depDepositor,
      currency: 'OMR',
      bankTellerStampRef: `STAMP-CBO-${Date.now().toString().slice(-4)}`
    });
    setShowAddDepositSlipModal(false);
  };

  const filteredCustomerReceipts = customerReceipts.filter(
    (r) =>
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.instrumentReference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Tabs & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('customer')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'customer'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Customer Receipts ({customerReceipts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('allocations')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'allocations'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>AR Allocations Matrix ({receiptAllocations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('other')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'other'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Other Income Receipts ({otherReceipts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('deposits')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'deposits'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Bank Deposit Slips ({depositSlips.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search receipts, invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 w-48 sm:w-60"
            />
          </div>

          {activeTab === 'customer' && (
            <button
              onClick={() => setShowAddCustomerReceiptModal(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Customer Receipt</span>
            </button>
          )}

          {activeTab === 'other' && (
            <button
              onClick={() => setShowAddOtherReceiptModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Other Receipt</span>
            </button>
          )}

          {activeTab === 'deposits' && (
            <button
              onClick={() => setShowAddDepositSlipModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Bank Deposit Slip</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: CUSTOMER RECEIPTS */}
      {activeTab === 'customer' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3.5">Receipt # & Date</th>
                  <th className="p-3.5">Customer Name & Code</th>
                  <th className="p-3.5">Instrument & Ref</th>
                  <th className="p-3.5">Bank Deposited</th>
                  <th className="p-3.5 text-right">Received Amount</th>
                  <th className="p-3.5 text-right">Allocated / Open</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCustomerReceipts.map((rcpt) => (
                  <tr key={rcpt.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-slate-900 dark:text-slate-100">{rcpt.receiptNumber}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{rcpt.receiptDate}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{rcpt.customerName}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{rcpt.customerId}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{rcpt.paymentMode}</div>
                      <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400">{rcpt.instrumentReference}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{rcpt.receivingBankAccountName}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{rcpt.glCreditAccount}</div>
                    </td>
                    <td className="p-3.5 text-right font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {formatCurrency(rcpt.amountReceived, rcpt.currency)}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="text-emerald-700 dark:text-emerald-300 font-bold">{formatCurrency(rcpt.allocatedAmount)}</div>
                      <div className="text-[10px] text-amber-700 dark:text-amber-300 font-medium">
                        Unalloc: {formatCurrency(rcpt.unallocatedAmount)}
                      </div>
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rcpt.status === 'Fully Allocated'
                            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                            : rcpt.status === 'Partially Allocated'
                            ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {rcpt.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      {rcpt.unallocatedAmount > 0 ? (
                        <button
                          onClick={() => {
                            setSelectedReceiptForAllocation(rcpt);
                            setAllocAmount(rcpt.unallocatedAmount);
                            setShowAllocateModal(true);
                          }}
                          className="px-2 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded text-[11px] font-semibold cursor-pointer"
                        >
                          Allocate
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Matched</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: RECEIPT ALLOCATIONS MATRIX */}
      {activeTab === 'allocations' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3.5">Allocation ID</th>
                  <th className="p-3.5">Invoice Number & Date</th>
                  <th className="p-3.5 text-right">Invoice Original</th>
                  <th className="p-3.5 text-right">Allocated Amount</th>
                  <th className="p-3.5 text-right">Withholding / Discount</th>
                  <th className="p-3.5 text-right">Balance Due After</th>
                  <th className="p-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {receiptAllocations.map((alloc) => (
                  <tr key={alloc.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">{alloc.id}</td>
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-slate-900 dark:text-slate-100">{alloc.invoiceNumber}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{alloc.invoiceDate}</div>
                    </td>
                    <td className="p-3.5 text-right font-medium text-slate-800 dark:text-slate-200">
                      {formatCurrency(alloc.invoiceOriginalAmount)}
                    </td>
                    <td className="p-3.5 text-right font-bold text-emerald-700 dark:text-emerald-300">
                      {formatCurrency(alloc.allocatedThisVoucher)}
                    </td>
                    <td className="p-3.5 text-right text-slate-500 dark:text-slate-400">
                      {formatCurrency(alloc.discountTaken + alloc.withholdingTaxDeducted)}
                    </td>
                    <td className="p-3.5 text-right font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(alloc.remainingDueAfterAllocation)}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                        {alloc.remainingDueAfterAllocation === 0 ? 'Settled in Full' : 'Partial Settle'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: OTHER RECEIPTS */}
      {activeTab === 'other' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3.5">Receipt # & Date</th>
                  <th className="p-3.5">Source / Remitter</th>
                  <th className="p-3.5">Income Category</th>
                  <th className="p-3.5">Deposited Bank Account</th>
                  <th className="p-3.5 text-right">Amount (OMR)</th>
                  <th className="p-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {otherReceipts.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-slate-900 dark:text-slate-100">{o.receiptNumber}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{o.receiptDate}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{o.payerName}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{o.remarks}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold">
                        {o.receiptCategory}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{o.receivingBankAccountName}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{o.glCreditAccount}</div>
                    </td>
                    <td className="p-3.5 text-right font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                      {formatCurrency(o.amount)}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BANK DEPOSIT SLIPS */}
      {activeTab === 'deposits' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {depositSlips.map((slip) => (
            <div key={slip.id} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    {slip.depositSlipNumber}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">{slip.targetBankAccountName}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{slip.bankBranchDepositLocation}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                  {slip.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Physical Cash Portion</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(slip.totalCashAmount)}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Cheques ({slip.chequeCount})</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(slip.totalChequesAmount)}</span>
                </div>
              </div>

              <div className="mt-3 p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-500/70 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-950">Total Deposited:</span>
                <span className="text-base font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(slip.grandTotalDeposit)}</span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Deposited By: {slip.depositedBy}</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">Courier: {slip.bankTellerStampRef}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: RECORD CUSTOMER RECEIPT */}
      {showAddCustomerReceiptModal && (
        <div className="fixed inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Record Customer Receipt (AR Collection)</h3>
            <form onSubmit={handleCreateCustomerReceipt} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Deposited Bank Account *</label>
                <select
                  value={rcptBankAccId}
                  onChange={(e) => setRcptBankAccId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
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
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Receipt Date *</label>
                  <input
                    type="date"
                    required
                    value={rcptDate}
                    onChange={(e) => setRcptDate(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Amount Received *</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={rcptAmount}
                    onChange={(e) => setRcptAmount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Customer / Client Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Petroleum Development Oman (PDO) LLC"
                  value={rcptCustomerName}
                  onChange={(e) => setRcptCustomerName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Payment Mode</label>
                  <select
                    value={rcptInstrument}
                    onChange={(e) => setRcptInstrument(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                  >
                    <option value="Direct Bank Wire">Direct Bank Wire</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Credit Card Payment Gateway">Credit Card Payment Gateway</option>
                    <option value="Point of Sale (POS)">Point of Sale (POS)</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Instrument Ref / TXN #</label>
                  <input
                    type="text"
                    placeholder="ACH-CBO-991288"
                    value={rcptInstrumentRef}
                    onChange={(e) => setRcptInstrumentRef(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerReceiptModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Post Customer Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ALLOCATE RECEIPT TO INVOICE */}
      {showAllocateModal && selectedReceiptForAllocation && (
        <div className="fixed inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Allocate Receipt to Outstanding AR Invoice</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Allocating against receipt <strong className="text-slate-800 dark:text-slate-200">{selectedReceiptForAllocation.receiptNumber}</strong> (
              {selectedReceiptForAllocation.customerName}).
            </p>

            <form onSubmit={handlePerformAllocation} className="space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between text-xs">
                <span>Unallocated Balance:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">
                  {formatCurrency(selectedReceiptForAllocation.unallocatedAmount)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Invoice Number *</label>
                  <input
                    type="text"
                    required
                    value={allocInvoiceNo}
                    onChange={(e) => setAllocInvoiceNo(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Invoice Total (OMR)</label>
                  <input
                    type="number"
                    value={allocInvTotal}
                    onChange={(e) => setAllocInvTotal(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Amount to Allocate (OMR) *</label>
                <input
                  type="number"
                  step="0.001"
                  max={selectedReceiptForAllocation.unallocatedAmount}
                  required
                  value={allocAmount}
                  onChange={(e) => setAllocAmount(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAllocateModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD OTHER RECEIPT */}
      {showAddOtherReceiptModal && (
        <div className="fixed inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Record Miscellaneous / Other Receipt</h3>
            <form onSubmit={handleCreateOtherReceipt} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Deposited Bank Account *</label>
                <select
                  value={otherBankAccId}
                  onChange={(e) => setOtherBankAccId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
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
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Receipt Date *</label>
                  <input
                    type="date"
                    required
                    value={otherDate}
                    onChange={(e) => setOtherDate(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Amount (OMR) *</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={otherAmount}
                    onChange={(e) => setOtherAmount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Remitter / Source Entity *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhofar Insurance SAOG"
                  value={otherSource}
                  onChange={(e) => setOtherSource(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Income Category</label>
                <select
                  value={otherCategory}
                  onChange={(e) => setOtherCategory(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                >
                  <option value="Bank Term Deposit Interest">Bank Term Deposit Interest</option>
                  <option value="Scrap & Asset Disposal Proceeds">Scrap & Asset Disposal Proceeds</option>
                  <option value="Insurance Claim Settlement">Insurance Claim Settlement</option>
                  <option value="Inter-Company Loan Receipt">Inter-Company Loan Receipt</option>
                  <option value="Government Subsidy / Incentive">Government Subsidy / Incentive</option>
                  <option value="Rental Income">Rental Income</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddOtherReceiptModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Post Other Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE DEPOSIT SLIP */}
      {showAddDepositSlipModal && (
        <div className="fixed inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Generate Bank Deposit Slip</h3>
            <form onSubmit={handleCreateDepositSlip} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Target Bank Account *</label>
                <select
                  value={depBankAccId}
                  onChange={(e) => setDepBankAccId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                >
                  {bankAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.accountName} ({a.bankName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Cash to Deposit (OMR)</label>
                  <input
                    type="number"
                    value={depCashAmt}
                    onChange={(e) => setDepCashAmt(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Cheques Amount (OMR)</label>
                  <input
                    type="number"
                    value={depChequeAmt}
                    onChange={(e) => setDepChequeAmt(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Number of Cheques</label>
                  <input
                    type="number"
                    value={depChequeCount}
                    onChange={(e) => setDepChequeCount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Bank Branch</label>
                  <input
                    type="text"
                    value={depBranch}
                    onChange={(e) => setDepBranch(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddDepositSlipModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Generate Deposit Slip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

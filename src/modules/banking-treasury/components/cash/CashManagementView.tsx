import React, { useState } from 'react';
import { useBankingTreasury } from '../../services/bankingTreasuryStore';
import {
  CashAccountRecord,
  CashReceiptRecord,
  CashPaymentRecord,
  CurrencyCode
} from '../../types';
import {
  DollarSign,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  Shield,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  User,
  Calendar,
  Lock,
  Building,
  Coins
} from 'lucide-react';

export const CashManagementView: React.FC = () => {
  const {
    cashAccounts,
    cashReceipts,
    cashPayments,
    cashPosition,
    addCashAccount,
    recordCashReceipt,
    recordCashPayment,
    updateCashPaymentStatus
  } = useBankingTreasury();

  const [activeTab, setActiveTab] = useState<'accounts' | 'receipts' | 'payments' | 'position'>('accounts');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showAddReceiptModal, setShowAddReceiptModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [selectedReceiptForPrint, setSelectedReceiptForPrint] = useState<CashReceiptRecord | null>(null);

  // Form State: Cash Account
  const [newAccCode, setNewAccCode] = useState('');
  const [newAccName, setNewAccName] = useState('');
  const [newAccBranch, setNewAccBranch] = useState('Muscat HQ Branch');
  const [newAccCustName, setNewAccCustName] = useState('');
  const [newAccCustId, setNewAccCustId] = useState('');
  const [newAccMaxLimit, setNewAccMaxLimit] = useState(25000);
  const [newAccInsurance, setNewAccInsurance] = useState(50000);
  const [newAccGlCode, setNewAccGlCode] = useState('1020-01-004');

  // Form State: Cash Receipt
  const [newRcptCashAccId, setNewRcptCashAccId] = useState(cashAccounts[0]?.id || '');
  const [newRcptDate, setNewRcptDate] = useState(new Date().toISOString().split('T')[0]);
  const [newRcptCustomer, setNewRcptCustomer] = useState('');
  const [newRcptAmount, setNewRcptAmount] = useState<number>(500);
  const [newRcptParticulars, setNewRcptParticulars] = useState('');
  const [newRcptReceivedBy, setNewRcptReceivedBy] = useState('Salim Al-Ghafri (Chief Cashier)');

  // Form State: Cash Payment
  const [newPayCashAccId, setNewPayCashAccId] = useState(cashAccounts[0]?.id || '');
  const [newPayDate, setNewPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [newPayPayee, setNewPayPayee] = useState('');
  const [newPayCivilId, setNewPayCivilId] = useState('');
  const [newPayAmount, setNewPayAmount] = useState<number>(150);
  const [newPayPurpose, setNewPayPurpose] = useState('');
  const [newPayExpenseCategory, setNewPayExpenseCategory] = useState('Office Maintenance & Supplies');
  const [newPayAuthorizedBy, setNewPayAuthorizedBy] = useState('Dr. Tariq Al-Habsi (Finance Director)');

  const formatCurrency = (val: number, curr = 'OMR') => {
    return `${curr} ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleCreateCashAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccCode || !newAccName || !newAccCustName) return;
    addCashAccount({
      accountCode: newAccCode,
      accountName: newAccName,
      branchName: newAccBranch,
      currency: 'OMR',
      currentBalance: 0,
      maximumCashHoldingLimit: Number(newAccMaxLimit),
      insurancePolicyLimit: Number(newAccInsurance),
      primaryCustodianName: newAccCustName,
      primaryCustodianCivilId: newAccCustId || 'OM-9921820',
      glAccountCode: newAccGlCode,
      status: 'Active'
    });
    setShowAddAccountModal(false);
    setNewAccCode('');
    setNewAccName('');
  };

  const handleRecordCashReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRcptCustomer || newRcptAmount <= 0) return;
    const selectedAcc = cashAccounts.find((a) => a.id === newRcptCashAccId);
    recordCashReceipt({
      receiptDate: newRcptDate,
      cashAccountId: newRcptCashAccId,
      cashAccountName: selectedAcc?.accountName || 'Main Cash Vault',
      receivedFromCustomerName: newRcptCustomer,
      amount: Number(newRcptAmount),
      currency: 'OMR',
      amountInWordsEn: `${newRcptAmount} Omani Rials Only`,
      amountInWordsAr: `${newRcptAmount} ريال عماني فقط لا غير`,
      particulars: newRcptParticulars || 'Direct cash collection counter receipt',
      receivedByCashierName: newRcptReceivedBy,
      glCreditAccountCode: '1200-01-001',
      glCreditAccountName: 'Accounts Receivable — Trade'
    });
    setShowAddReceiptModal(false);
    setNewRcptCustomer('');
    setNewRcptAmount(500);
    setNewRcptParticulars('');
  };

  const handleRecordCashPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayPayee || newPayAmount <= 0) return;
    const selectedAcc = cashAccounts.find((a) => a.id === newPayCashAccId);
    recordCashPayment({
      paymentDate: newPayDate,
      cashAccountId: newPayCashAccId,
      cashAccountName: selectedAcc?.accountName || 'Main Cash Vault',
      paidToPayeeName: newPayPayee,
      payeeCivilOrCrNumber: newPayCivilId || 'CR-1099238',
      amount: Number(newPayAmount),
      currency: 'OMR',
      purpose: newPayPurpose || 'Operational cash disbursement',
      expenseCategory: newPayExpenseCategory,
      glDebitAccountCode: '5030-01-008',
      glDebitAccountName: 'Office & Facility Administration Expenses',
      authorizedByManagerName: newPayAuthorizedBy
    });
    setShowAddPaymentModal(false);
    setNewPayPayee('');
    setNewPayAmount(150);
    setNewPayPurpose('');
  };

  const filteredAccounts = cashAccounts.filter(
    (a) =>
      a.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.accountCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.primaryCustodianName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReceipts = cashReceipts.filter(
    (r) =>
      r.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.receivedFromCustomerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.particulars.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPayments = cashPayments.filter(
    (p) =>
      p.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.paidToPayeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Tabs & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('accounts')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'accounts'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Cash Vaults & Tills ({cashAccounts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('receipts')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'receipts'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Cash Receipts ({cashReceipts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Cash Payments ({cashPayments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('position')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'position'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Cash Position & Safe Limits</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search cash registers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 w-48 sm:w-60"
            />
          </div>

          {activeTab === 'accounts' && (
            <button
              onClick={() => setShowAddAccountModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Cash Account</span>
            </button>
          )}

          {activeTab === 'receipts' && (
            <button
              onClick={() => setShowAddReceiptModal(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Cash Receipt</span>
            </button>
          )}

          {activeTab === 'payments' && (
            <button
              onClick={() => setShowAddPaymentModal(true)}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Disburse Cash Voucher</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: CASH ACCOUNTS */}
      {activeTab === 'accounts' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredAccounts.map((acc) => {
            const holdingRatio = Math.round((acc.currentBalance / acc.maximumCashHoldingLimit) * 100);
            return (
              <div
                key={acc.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {acc.accountCode}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">{acc.accountName}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{acc.branchName}</p>
                    </div>
                    <span className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Lock className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block uppercase">Physical Cash Balance</span>
                    <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{formatCurrency(acc.currentBalance)}</div>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="text-slate-500 dark:text-slate-400">Primary Custodian</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{acc.primaryCustodianName}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="text-slate-500 dark:text-slate-400">Holding Cap</span>
                      <span className="text-slate-800 dark:text-slate-200">{formatCurrency(acc.maximumCashHoldingLimit)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="text-slate-500 dark:text-slate-400">Insurance Cover</span>
                      <span className="text-slate-800 dark:text-slate-200 font-medium">{formatCurrency(acc.insurancePolicyLimit)}</span>
                    </div>

                    {/* Safe limit indicator */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                      <div
                        className={`h-full rounded-full ${holdingRatio > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(100, holdingRatio)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span>Holding: {holdingRatio}%</span>
                      <span>Safe Limit: OK</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Last count: {acc.lastCountTimestamp}</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{acc.glAccountCode}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: CASH RECEIPTS */}
      {activeTab === 'receipts' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3.5">Receipt # & Date</th>
                  <th className="p-3.5">Customer / Received From</th>
                  <th className="p-3.5">Cash Vault & Cashier</th>
                  <th className="p-3.5">Particulars</th>
                  <th className="p-3.5 text-right">Amount (OMR)</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-center">Print / View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredReceipts.map((rcpt) => (
                  <tr key={rcpt.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-slate-900 dark:text-slate-100">{rcpt.receiptNumber}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{rcpt.receiptDate}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{rcpt.receivedFromCustomerName}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{rcpt.glCreditAccountCode}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{rcpt.cashAccountName}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{rcpt.receivedByCashierName}</div>
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400 max-w-xs truncate">{rcpt.particulars}</td>
                    <td className="p-3.5 text-right font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                      {formatCurrency(rcpt.amount)}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                        {rcpt.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => setSelectedReceiptForPrint(rcpt)}
                        className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                        title="Print Official Cash Receipt"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CASH PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3.5">Voucher # & Date</th>
                  <th className="p-3.5">Paid To (Payee & ID)</th>
                  <th className="p-3.5">Vault & Authorizer</th>
                  <th className="p-3.5">Purpose & Category</th>
                  <th className="p-3.5 text-right">Disbursed (OMR)</th>
                  <th className="p-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-slate-900 dark:text-slate-100">{pay.voucherNumber}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{pay.paymentDate}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{pay.paidToPayeeName}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">ID: {pay.payeeCivilOrCrNumber}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{pay.cashAccountName}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Auth: {pay.authorizedByManagerName}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">{pay.purpose}</div>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono">
                        {pay.expenseCategory}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-bold text-rose-700 dark:text-rose-300 text-sm">
                      {formatCurrency(pay.amount)}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                        {pay.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: REAL-TIME CASH POSITION */}
      {activeTab === 'position' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Consolidated Cash in Hand</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{formatCurrency(cashPosition.totalCashInHandOMR)}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Across 3 branches & central treasury vault</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Cash In Transit to Bank</span>
              <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{formatCurrency(cashPosition.totalCashInTransitOMR)}</h3>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-1">Secured armored courier en route</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Max Insured Capacity</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{formatCurrency(cashPosition.totalSafeHoldingLimitOMR)}</h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Safe coverage active & compliant</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Surplus Over Safe Limit</span>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrency(cashPosition.surplusCashToDepositOMR)}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">No mandatory bank sweep triggered</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Branch-Wise Physical Cash Breakdown</h3>
            <div className="space-y-3">
              {cashPosition.branchWiseBreakdown.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.branchName}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.vaultCount} Register / Vault</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{formatCurrency(item.balanceOMR)}</div>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PRINT PREVIEW MODAL */}
      {selectedReceiptForPrint && (
        <div className="fixed inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                  OM
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">ARTIFY GLOBAL ENTERPRISE LLC</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Official Cash Receipt Voucher</p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                {selectedReceiptForPrint.receiptNumber}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Date Issued:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedReceiptForPrint.receiptDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Received From:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedReceiptForPrint.receivedFromCustomerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Amount Received:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300 text-base">{formatCurrency(selectedReceiptForPrint.amount)}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Amount in Words:</span>
                <p className="font-medium italic">{selectedReceiptForPrint.amountInWordsEn}</p>
                <p className="font-arabic text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">{selectedReceiptForPrint.amountInWordsAr}</p>
              </div>
              <div className="py-1">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Particulars / Purpose:</span>
                <p className="font-medium text-slate-800 dark:text-slate-200">{selectedReceiptForPrint.particulars}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                <div>
                  <div className="h-10 border-b border-dashed border-slate-300 dark:border-slate-600 flex items-end justify-center pb-1">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-signature">{selectedReceiptForPrint.receivedByCashierName}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">Cashier Signature</span>
                </div>
                <div>
                  <div className="h-10 border-b border-dashed border-slate-300 dark:border-slate-600 flex items-end justify-center pb-1">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Customer Stamp</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">Depositor / Payer</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedReceiptForPrint(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD CASH ACCOUNT */}
      {showAddAccountModal && (
        <div className="fixed inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Add Cash Till / Safe Register</h3>
            <form onSubmit={handleCreateCashAccount} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Account Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CASH-SAL-01"
                    value={newAccCode}
                    onChange={(e) => setNewAccCode(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Branch Name</label>
                  <input
                    type="text"
                    value={newAccBranch}
                    onChange={(e) => setNewAccBranch(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Account Title / Register Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salalah Branch Retail Collection Till"
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Custodian Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mohammed Al-Maamari"
                    value={newAccCustName}
                    onChange={(e) => setNewAccCustName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Max Safe Limit (OMR)</label>
                  <input
                    type="number"
                    value={newAccMaxLimit}
                    onChange={(e) => setNewAccMaxLimit(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddAccountModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Save Cash Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD CASH RECEIPT */}
      {showAddReceiptModal && (
        <div className="fixed inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Record Official Cash Receipt</h3>
            <form onSubmit={handleRecordCashReceipt} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Receiving Cash Account *</label>
                <select
                  value={newRcptCashAccId}
                  onChange={(e) => setNewRcptCashAccId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                >
                  {cashAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.accountName} ({a.branchName})
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
                    value={newRcptDate}
                    onChange={(e) => setNewRcptDate(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Amount (OMR) *</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={newRcptAmount}
                    onChange={(e) => setNewRcptAmount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Received From (Customer / Entity) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Al-Batinah Steel & Engineering LLC"
                  value={newRcptCustomer}
                  onChange={(e) => setNewRcptCustomer(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Particulars / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Advance cash deposit for project delivery order..."
                  value={newRcptParticulars}
                  onChange={(e) => setNewRcptParticulars(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddReceiptModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Post Cash Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD CASH PAYMENT */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Disburse Cash Payment Voucher</h3>
            <form onSubmit={handleRecordCashPayment} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Paying Cash Account *</label>
                <select
                  value={newPayCashAccId}
                  onChange={(e) => setNewPayCashAccId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                >
                  {cashAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.accountName} (Balance: {formatCurrency(a.currentBalance)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Payment Date *</label>
                  <input
                    type="date"
                    required
                    value={newPayDate}
                    onChange={(e) => setNewPayDate(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Amount (OMR) *</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={newPayAmount}
                    onChange={(e) => setNewPayAmount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Paid To (Payee) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muscat Municipality Desk"
                    value={newPayPayee}
                    onChange={(e) => setNewPayPayee(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Civil / CR ID</label>
                  <input
                    type="text"
                    placeholder="CR-1099238"
                    value={newPayCivilId}
                    onChange={(e) => setNewPayCivilId(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Purpose / Description *</label>
                <input
                  type="text"
                  required
                  placeholder="Government building sign renewal fee"
                  value={newPayPurpose}
                  onChange={(e) => setNewPayPurpose(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddPaymentModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Disburse Cash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

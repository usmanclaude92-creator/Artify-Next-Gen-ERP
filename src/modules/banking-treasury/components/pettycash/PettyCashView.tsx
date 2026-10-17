import React, { useState } from 'react';
import { useBankingTreasury } from '../../services/bankingTreasuryStore';
import {
  PettyCashAccountRecord,
  PettyCashAdvanceRecord,
  PettyCashExpenseRecord,
  PettyCashReconciliationRecord
} from '../../types';
import {
  Coins,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  Calendar,
  Layers,
  ArrowRightLeft,
  DollarSign,
  ShieldCheck,
  CheckCheck,
  RotateCcw,
  Printer
} from 'lucide-react';

export const PettyCashView: React.FC = () => {
  const {
    pettyCashAccounts,
    pettyCashAdvances,
    pettyCashExpenses,
    pettyCashReconciliations,
    addPettyCashAccount,
    issuePettyCashAdvance,
    settlePettyCashAdvance,
    submitPettyCashExpense,
    createPettyCashReconciliation
  } = useBankingTreasury();

  const [activeTab, setActiveTab] = useState<'accounts' | 'advances' | 'expenses' | 'reconciliation'>('accounts');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showReconModal, setShowReconModal] = useState(false);
  const [settlingAdvance, setSettlingAdvance] = useState<PettyCashAdvanceRecord | null>(null);

  // Form State: Add Account
  const [newFundCode, setNewFundCode] = useState('');
  const [newFundName, setNewFundName] = useState('');
  const [newCustodianName, setNewCustodianName] = useState('');
  const [newCustodianId, setNewCustodianId] = useState('');
  const [newLocation, setNewLocation] = useState('Muscat HQ — Administration');
  const [newImprestLimit, setNewImprestLimit] = useState<number>(1500);

  // Form State: Advance / IOU
  const [advAccountId, setAdvAccountId] = useState(pettyCashAccounts[0]?.id || '');
  const [advEmpName, setAdvEmpName] = useState('');
  const [advEmpId, setAdvEmpId] = useState('');
  const [advDept, setAdvDept] = useState('Operations & Maintenance');
  const [advAmount, setAdvAmount] = useState<number>(60);
  const [advPurpose, setAdvPurpose] = useState('');
  const [advDueDate, setAdvDueDate] = useState(new Date().toISOString().split('T')[0]);

  // Form State: Settle Advance
  const [settleActualExp, setSettleActualExp] = useState<number>(45);
  const [settleCashBack, setSettleCashBack] = useState<number>(15);

  // Form State: Expense Voucher
  const [expAccountId, setExpAccountId] = useState(pettyCashAccounts[0]?.id || '');
  const [expPayee, setExpPayee] = useState('');
  const [expTaxInv, setExpTaxInv] = useState('');
  const [expGross, setExpGross] = useState<number>(31.5);
  const [expVat, setExpVat] = useState<number>(1.5);
  const [expDesc, setExpDesc] = useState('');
  const [expCategory, setExpCategory] = useState('Office Refreshments & Hospitality');
  const [expGlCode, setExpGlCode] = useState('5030-01-008');

  // Form State: Reconciliation Count
  const [reconAccountId, setReconAccountId] = useState(pettyCashAccounts[0]?.id || '');
  const [reconCountedCash, setReconCountedCash] = useState<number>(485);

  const formatCurrency = (val: number, curr = 'OMR') => {
    return `${curr} ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFundCode || !newFundName || !newCustodianName) return;
    addPettyCashAccount({
      fundCode: newFundCode,
      fundName: newFundName,
      custodianName: newCustodianName,
      custodianEmail: '',
      department: newLocation,
      branch: newLocation,
      imprestLimitOMR: Number(newImprestLimit),
      currentAvailableCashOMR: Number(newImprestLimit),
      openAdvancesIOUOMR: 0,
      pendingUnclaimedExpensesOMR: 0,
      glAccountCode: '1030-01-005',
      reimbursementThresholdPercent: Number(newImprestLimit) * 0.3,
      status: 'Active'
    });
    setShowAddAccountModal(false);
    setNewFundCode('');
    setNewFundName('');
    setNewCustodianName('');
  };

  const handleIssueAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advEmpName || advAmount <= 0) return;
    const acc = pettyCashAccounts.find((a) => a.id === advAccountId);
    issuePettyCashAdvance({
      pettyCashAccountId: advAccountId,
      pettyCashAccountName: acc?.fundName || 'Main Petty Cash Float',
      employeeName: advEmpName,
      employeeCivilId: advEmpId || 'EMP-OM-992',
      department: advDept,
      issuedDate: new Date().toISOString().split('T')[0],
      settlementDueDate: advDueDate,
      advanceAmountOMR: Number(advAmount),
      purpose: advPurpose || 'Emergency site tools purchase',
    });
    setShowAdvanceModal(false);
    setAdvEmpName('');
    setAdvAmount(60);
    setAdvPurpose('');
  };

  const handleSettleAdvanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settlingAdvance) return;
    settlePettyCashAdvance(settlingAdvance.id, Number(settleActualExp), Number(settleCashBack));
    setSettlingAdvance(null);
  };

  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expPayee || expGross <= 0) return;
    const acc = pettyCashAccounts.find((a) => a.id === expAccountId);
    const net = expGross - expVat;
    submitPettyCashExpense({
      pettyCashAccountId: expAccountId,
      pettyCashAccountName: acc?.fundName || 'Main Float',
      expenseDate: new Date().toISOString().split('T')[0],
      payeeOrMerchant: expPayee,
      billInvoiceNo: expTaxInv || 'TAX-INV-9921',
      category: expCategory as PettyCashExpenseRecord['category'],
      netAmountOMR: net,
      vatAmountOMR: Number(expVat),
      grossAmountOMR: Number(expGross),
      glExpenseAccount: expGlCode,
      glExpenseAccountName: expCategory,
      claimedByEmployee: expDesc || 'Operational petty expense claim',
      approvedByDeptHead: ''
    });
    setShowExpenseModal(false);
    setExpPayee('');
    setExpGross(31.5);
    setExpDesc('');
  };

  const handleCreateReconciliationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPettyCashReconciliation(reconAccountId, Number(reconCountedCash));
    setShowReconModal(false);
  };

  const filteredAdvances = pettyCashAdvances.filter(
    (a) =>
      a.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.advanceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredExpenses = pettyCashExpenses.filter(
    (e) =>
      e.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.payeeOrMerchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.payeeOrMerchant.toLowerCase().includes(searchTerm.toLowerCase())
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
            <Coins className="w-3.5 h-3.5" />
            <span>Imprest Fund Accounts ({pettyCashAccounts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('advances')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'advances'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Staff Advances (IOUs) ({pettyCashAdvances.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'expenses'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Expense Claims / Vouchers ({pettyCashExpenses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reconciliation')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'reconciliation'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Audit & Reimbursements ({pettyCashReconciliations.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search vouchers, staff..."
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
              <span>Add Imprest Fund</span>
            </button>
          )}

          {activeTab === 'advances' && (
            <button
              onClick={() => setShowAdvanceModal(true)}
              className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Issue Staff Advance (IOU)</span>
            </button>
          )}

          {activeTab === 'expenses' && (
            <button
              onClick={() => setShowExpenseModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Expense Voucher</span>
            </button>
          )}

          {activeTab === 'reconciliation' && (
            <button
              onClick={() => setShowReconModal(true)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Audit Count & Request Replenishment</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: IMPREST FUND ACCOUNTS */}
      {activeTab === 'accounts' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pettyCashAccounts.map((acc) => {
            const availRatio = Math.round((acc.currentAvailableCashOMR / acc.imprestLimitOMR) * 100);
            return (
              <div
                key={acc.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {acc.fundCode}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">{acc.fundName}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{acc.department}</p>
                    </div>
                    <span className="p-2 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400">
                      <Coins className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block uppercase">
                      Physical Cash in Float Box
                    </span>
                    <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                      {formatCurrency(acc.currentAvailableCashOMR)}
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="text-slate-500 dark:text-slate-400">Fixed Imprest Ceiling</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(acc.imprestLimitOMR)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="text-slate-500 dark:text-slate-400">Open Staff IOUs</span>
                      <span className="text-amber-700 dark:text-amber-300 font-semibold">{formatCurrency(acc.openAdvancesIOUOMR)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="text-slate-500 dark:text-slate-400">Pending Expense Vouchers</span>
                      <span className="text-indigo-700 dark:text-indigo-300 font-semibold">
                        {formatCurrency(acc.pendingUnclaimedExpensesOMR)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                      <div
                        className={`h-full rounded-full ${availRatio < 30 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${availRatio}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span>Available: {availRatio}%</span>
                      <span>Threshold: {formatCurrency(acc.reimbursementThresholdPercent)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Custodian: {acc.custodianName}</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{acc.glAccountCode}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: STAFF ADVANCES (IOUS) */}
      {activeTab === 'advances' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3.5">Advance # & Date</th>
                  <th className="p-3.5">Employee Name & ID</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Purpose</th>
                  <th className="p-3.5 text-right">Advance (OMR)</th>
                  <th className="p-3.5">Due Date</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredAdvances.map((adv) => (
                  <tr key={adv.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-slate-900 dark:text-slate-100">{adv.advanceNumber}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{adv.issuedDate}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{adv.employeeName}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{adv.employeeCivilId}</div>
                    </td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300">{adv.department}</td>
                    <td className="p-3.5 text-slate-700 dark:text-slate-300 max-w-xs truncate">{adv.purpose}</td>
                    <td className="p-3.5 text-right font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {formatCurrency(adv.advanceAmountOMR)}
                    </td>
                    <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">{adv.settlementDueDate}</td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          adv.status === 'Settled'
                            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                            : 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-200'
                        }`}
                      >
                        {adv.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      {adv.status !== 'Settled' ? (
                        <button
                          onClick={() => {
                            setSettlingAdvance(adv);
                            setSettleActualExp(adv.advanceAmountOMR * 0.8);
                            setSettleCashBack(adv.advanceAmountOMR * 0.2);
                          }}
                          className="px-2 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded text-[11px] font-semibold cursor-pointer"
                        >
                          Settle IOU
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">Settled on {adv.settlementDate}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: EXPENSE CLAIMS / VOUCHERS */}
      {activeTab === 'expenses' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3.5">Voucher # & Date</th>
                  <th className="p-3.5">Payee / Merchant</th>
                  <th className="p-3.5">Tax Invoice #</th>
                  <th className="p-3.5">Category & GL Account</th>
                  <th className="p-3.5 text-right">Net Amount</th>
                  <th className="p-3.5 text-right">VAT 5%</th>
                  <th className="p-3.5 text-right">Gross Claim</th>
                  <th className="p-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-slate-900 dark:text-slate-100">{exp.voucherNumber}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{exp.expenseDate}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{exp.payeeOrMerchant}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{exp.billInvoiceNo}</div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">{exp.billInvoiceNo}</td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{exp.category}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{exp.glExpenseAccount}</div>
                    </td>
                    <td className="p-3.5 text-right font-medium text-slate-800 dark:text-slate-200">
                      {formatCurrency(exp.netAmountOMR)}
                    </td>
                    <td className="p-3.5 text-right font-medium text-indigo-700 dark:text-indigo-300">
                      {formatCurrency(exp.vatAmountOMR)}
                    </td>
                    <td className="p-3.5 text-right font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {formatCurrency(exp.grossAmountOMR)}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                        {exp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: RECONCILIATION & REIMBURSEMENT AUDIT */}
      {activeTab === 'reconciliation' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pettyCashReconciliations.map((rec) => (
              <div key={rec.id} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                      {rec.reconciliationBatchNo}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">{rec.pettyCashAccountName}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Audit Period: {rec.periodEndDate}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                    {rec.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Physical Cash</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(rec.physicalCashCountedOMR)}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Vouchers Sum</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(rec.vouchersSumOMR)}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Open IOUs</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(rec.advancesSumOMR)}</span>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-lg bg-indigo-50/70 dark:bg-indigo-500/70 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-950">Replenishment Cheque Requested:</span>
                  <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                    {formatCurrency(rec.replenishmentChequeRequestedOMR)}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Auditor: {rec.auditedBy}</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">Float: {formatCurrency(rec.floatLimitOMR)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD IMPREST FUND */}
      {showAddAccountModal && (
        <div className="fixed inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Add Petty Cash Float Account</h3>
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Fund Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PC-SAL-01"
                    value={newFundCode}
                    onChange={(e) => setNewFundCode(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Imprest Ceiling (OMR) *</label>
                  <input
                    type="number"
                    required
                    value={newImprestLimit}
                    onChange={(e) => setNewImprestLimit(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Fund Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salalah Regional Office Operating Petty Cash"
                  value={newFundName}
                  onChange={(e) => setNewFundName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Custodian Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Salim Al-Ghafri"
                    value={newCustodianName}
                    onChange={(e) => setNewCustodianName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Location / Dept</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
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
                  Save Imprest Fund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ISSUE ADVANCE (IOU) */}
      {showAdvanceModal && (
        <div className="fixed inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Issue Staff Petty Cash Advance (IOU)</h3>
            <form onSubmit={handleIssueAdvance} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Disbursing Float *</label>
                <select
                  value={advAccountId}
                  onChange={(e) => setAdvAccountId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                >
                  {pettyCashAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.fundName} (Available: {formatCurrency(a.currentAvailableCashOMR)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Employee Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Al-Habsi"
                    value={advEmpName}
                    onChange={(e) => setAdvEmpName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Advance Amount (OMR) *</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={advAmount}
                    onChange={(e) => setAdvAmount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Department</label>
                  <input
                    type="text"
                    value={advDept}
                    onChange={(e) => setAdvDept(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Settlement Deadline</label>
                  <input
                    type="date"
                    required
                    value={advDueDate}
                    onChange={(e) => setAdvDueDate(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Purpose of Advance</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Local transport & courier fees for legal attestation"
                  value={advPurpose}
                  onChange={(e) => setAdvPurpose(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAdvanceModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Disburse Advance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SETTLE ADVANCE (IOU) */}
      {settlingAdvance && (
        <div className="fixed inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">Settle Staff Advance (IOU)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Settling IOU <strong className="text-slate-800 dark:text-slate-200">{settlingAdvance.advanceNumber}</strong> for {settlingAdvance.employeeName} (Total: {formatCurrency(settlingAdvance.advanceAmountOMR)}).
            </p>

            <form onSubmit={handleSettleAdvanceSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Actual Expense Spent (OMR) *</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={settleActualExp}
                    onChange={(e) => {
                      const exp = Number(e.target.value);
                      setSettleActualExp(exp);
                      setSettleCashBack(Math.max(0, settlingAdvance.advanceAmountOMR - exp));
                    }}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Cash Returned to Float (OMR) *</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={settleCashBack}
                    onChange={(e) => setSettleCashBack(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none font-bold text-emerald-700 dark:text-emerald-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSettlingAdvance(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Close & Settle IOU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT EXPENSE CLAIM */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Record Petty Cash Expense Voucher</h3>
            <form onSubmit={handleSubmitExpense} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Petty Cash Float *</label>
                <select
                  value={expAccountId}
                  onChange={(e) => setExpAccountId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                >
                  {pettyCashAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.fundName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Payee / Merchant *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Al-Maha Petrol Station"
                    value={expPayee}
                    onChange={(e) => setExpPayee(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Tax Invoice #</label>
                  <input
                    type="text"
                    placeholder="TAX-INV-99218"
                    value={expTaxInv}
                    onChange={(e) => setExpTaxInv(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Gross Amount (OMR) *</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={expGross}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setExpGross(val);
                      setExpVat(Number((val * 0.05).toFixed(3)));
                    }}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">VAT 5% (OMR)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={expVat}
                    onChange={(e) => setExpVat(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none font-bold text-indigo-700 dark:text-indigo-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Expense Category</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                >
                  <option value="Office Refreshments & Hospitality">Office Refreshments & Hospitality</option>
                  <option value="Vehicle Fuel & Toll Charges">Vehicle Fuel & Toll Charges</option>
                  <option value="Postage, Courier & Attestation">Postage, Courier & Attestation</option>
                  <option value="Minor Repairs & Consumables">Minor Repairs & Consumables</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Description / Memo</label>
                <input
                  type="text"
                  placeholder="Monthly project client refreshments meeting"
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Record Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECONCILIATION AUDIT */}
      {showReconModal && (
        <div className="fixed inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Petty Cash Physical Audit & Reimbursement</h3>
            <form onSubmit={handleCreateReconciliationSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Select Float Account *</label>
                <select
                  value={reconAccountId}
                  onChange={(e) => setReconAccountId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none"
                >
                  {pettyCashAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.fundName} (Float: {formatCurrency(a.imprestLimitOMR)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Physical Cash Counted in Box (OMR) *</label>
                <input
                  type="number"
                  step="0.001"
                  required
                  value={reconCountedCash}
                  onChange={(e) => setReconCountedCash(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 focus:outline-none font-bold text-base"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Unclaimed Vouchers:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {formatCurrency(pettyCashAccounts.find((a) => a.id === reconAccountId)?.pendingUnclaimedExpensesOMR || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Open Advances (IOUs):</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {formatCurrency(pettyCashAccounts.find((a) => a.id === reconAccountId)?.openAdvancesIOUOMR || 0)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowReconModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Generate Audit Batch & Reimbursement Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

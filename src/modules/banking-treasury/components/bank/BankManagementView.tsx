import React, { useState } from 'react';
import { useBankingTreasury } from '../../services/bankingTreasuryStore';
import {
  BankMasterRecord,
  BankAccountRecord,
  BankSignatoryRecord,
  BankLimitRecord,
  CurrencyCode
} from '../../types';
import {
  Building,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Layers,
  Phone,
  Mail,
  UserCheck,
  Sliders,
  DollarSign,
  Filter
} from 'lucide-react';

export const BankManagementView: React.FC = () => {
  const {
    bankMasters,
    bankAccounts,
    bankSignatories,
    bankLimits,
    addBankMaster,
    addBankAccount,
    updateBankAccountStatus,
    addBankSignatory,
    addBankLimit
  } = useBankingTreasury();

  const [activeTab, setActiveTab] = useState<'masters' | 'accounts' | 'signatories' | 'limits'>('masters');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showAddSignatoryModal, setShowAddSignatoryModal] = useState(false);

  // Form State: Bank Master
  const [newBankCode, setNewBankCode] = useState('');
  const [newBankNameEn, setNewBankNameEn] = useState('');
  const [newBankNameAr, setNewBankNameAr] = useState('');
  const [newSwiftBic, setNewSwiftBic] = useState('');
  const [newRoutingCode, setNewRoutingCode] = useState('');
  const [newHeadOfficeAddress, setNewHeadOfficeAddress] = useState('');
  const [newRmName, setNewRmName] = useState('');
  const [newRmEmail, setNewRmEmail] = useState('');
  const [newRmPhone, setNewRmPhone] = useState('');

  // Form State: Bank Account
  const [newAccBankId, setNewAccBankId] = useState(bankMasters[0]?.id || '');
  const [newAccNumber, setNewAccNumber] = useState('');
  const [newAccName, setNewAccName] = useState('');
  const [newAccType, setNewAccType] = useState<BankAccountRecord['accountType']>('Current Operating');
  const [newAccIban, setNewAccIban] = useState('');
  const [newAccCurrency, setNewAccCurrency] = useState<CurrencyCode>('OMR');
  const [newAccGlCode, setNewAccGlCode] = useState('1010-01-005');
  const [newAccGlName, setNewAccGlName] = useState('');
  const [newAccBranch, setNewAccBranch] = useState('Muscat Main Branch');
  const [newAccOverdraftLimit, setNewAccOverdraftLimit] = useState(0);

  // Form State: Signatory
  const [newSigAccountId, setNewSigAccountId] = useState(bankAccounts[0]?.id || '');
  const [newSigName, setNewSigName] = useState('');
  const [newSigTitle, setNewSigTitle] = useState('');
  const [newSigTier, setNewSigTier] = useState<BankSignatoryRecord['categoryTier']>('Category A (Executive)');
  const [newSigLimit, setNewSigLimit] = useState(1000000);
  const [newSigPoa, setNewSigPoa] = useState('MOCI-POA-2026-');

  const formatCurrency = (val: number, curr = 'OMR') => {
    return `${curr} ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleCreateBankMaster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBankCode || !newBankNameEn || !newSwiftBic) return;
    addBankMaster({
      bankCode: newBankCode,
      bankNameEn: newBankNameEn,
      bankNameAr: newBankNameAr || newBankNameEn,
      swiftBic: newSwiftBic,
      routingCode: newRoutingCode || '010099',
      country: 'Sultanate of Oman',
      headOfficeAddress: newHeadOfficeAddress || 'Muscat, Oman',
      relationshipManagerName: newRmName || 'Corporate RM Desk',
      relationshipManagerEmail: newRmEmail || 'rm@bank.om',
      relationshipManagerPhone: newRmPhone || '+968 2400 0000',
      supportHelpdesk: 'support@bank.om',
      ratingAgencyGrade: 'Moody Baa2',
      status: 'Active'
    });
    setShowAddBankModal(false);
    setNewBankCode('');
    setNewBankNameEn('');
    setNewSwiftBic('');
  };

  const handleCreateBankAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccNumber || !newAccName || !newAccIban) return;
    const selectedBank = bankMasters.find((b) => b.id === newAccBankId);
    addBankAccount({
      bankId: newAccBankId,
      bankName: selectedBank?.bankNameEn || 'Corporate Bank',
      accountNumber: newAccNumber,
      accountName: newAccName,
      accountType: newAccType,
      iban: newAccIban,
      currency: newAccCurrency,
      glAccountCode: newAccGlCode,
      glAccountName: newAccGlName || newAccName,
      branchName: newAccBranch,
      openingDate: new Date().toISOString().split('T')[0],
      overdraftLimit: Number(newAccOverdraftLimit),
      interestRatePercent: newAccType === 'Call Deposit' ? 4.5 : 0.0,
      signatoryRule: 'Dual Signatory: 1 Category A + 1 Category B',
      isPrimaryOperating: bankAccounts.length === 0,
      status: 'Active'
    });
    setShowAddAccountModal(false);
    setNewAccNumber('');
    setNewAccName('');
    setNewAccIban('');
  };

  const handleCreateSignatory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSigName || !newSigTitle) return;
    const selectedAcc = bankAccounts.find((a) => a.id === newSigAccountId);
    addBankSignatory({
      bankAccountId: newSigAccountId,
      accountNumber: selectedAcc?.accountNumber || '04230000000',
      signatoryName: newSigName,
      signatoryTitle: newSigTitle,
      categoryTier: newSigTier,
      authorizationLimitOMR: Number(newSigLimit),
      powerOfAttorneyRef: newSigPoa,
      validFrom: '2026-01-01',
      validUntil: '2028-12-31',
      specimenCardStatus: 'Verified On File',
      status: 'Active',
      contactEmail: 'signatory@artifyerp.com',
      contactMobile: '+968 9900 1122'
    });
    setShowAddSignatoryModal(false);
    setNewSigName('');
    setNewSigTitle('');
  };

  const filteredBanks = bankMasters.filter(
    (b) =>
      b.bankNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bankCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.swiftBic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAccounts = bankAccounts.filter(
    (a) =>
      a.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.accountNumber.includes(searchTerm) ||
      a.iban.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.bankName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Tabs & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('masters')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'masters'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Bank Master ({bankMasters.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'accounts'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Bank Accounts ({bankAccounts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('signatories')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'signatories'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Signatories & Mandates ({bankSignatories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('limits')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'limits'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Bank Limits ({bankLimits.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search banks, accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 w-48 sm:w-60"
            />
          </div>

          {activeTab === 'masters' && (
            <button
              onClick={() => setShowAddBankModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Bank</span>
            </button>
          )}

          {activeTab === 'accounts' && (
            <button
              onClick={() => setShowAddAccountModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Account</span>
            </button>
          )}

          {activeTab === 'signatories' && (
            <button
              onClick={() => setShowAddSignatoryModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Signatory</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: BANK MASTERS */}
      {activeTab === 'masters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBanks.map((bank) => (
            <div
              key={bank.id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 font-bold flex items-center justify-center text-sm border border-amber-200">
                      {bank.bankCode.slice(3, 6)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{bank.bankNameEn}</h3>
                      <p className="text-xs text-slate-500 font-arabic">{bank.bankNameAr}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {bank.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">SWIFT / BIC</span>
                    <span className="font-mono font-bold text-slate-800">{bank.swiftBic}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Routing Code</span>
                    <span className="font-mono font-bold text-slate-800">{bank.routingCode}</span>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-lg bg-slate-50/70 border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Relationship Manager</span>
                    <span className="font-semibold text-slate-800">{bank.relationshipManagerName}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">RM Contact</span>
                    <span className="text-slate-700">{bank.relationshipManagerPhone}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Rating Agency</span>
                    <span className="font-medium text-indigo-600">{bank.ratingAgencyGrade}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{bank.totalAccountsLinked} Linked Accounts</span>
                <span className="font-semibold text-slate-800">Facilities: {formatCurrency(bank.totalFacilitiesOMR)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: BANK ACCOUNTS */}
      {activeTab === 'accounts' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Bank & Account Name</th>
                  <th className="p-3.5">Account Number & IBAN</th>
                  <th className="p-3.5">Currency</th>
                  <th className="p-3.5">Type & GL Account</th>
                  <th className="p-3.5 text-right">Book Balance</th>
                  <th className="p-3.5 text-right">Bank Balance</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{acc.accountName}</div>
                      <div className="text-[11px] text-slate-500">{acc.bankName}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-mono font-medium text-slate-800">{acc.accountNumber}</div>
                      <div className="font-mono text-[10px] text-slate-400">{acc.iban}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        {acc.currency}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800">{acc.accountType}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{acc.glAccountCode}</div>
                    </td>
                    <td className="p-3.5 text-right font-bold text-slate-900">
                      {formatCurrency(acc.currentBookBalance, acc.currency)}
                    </td>
                    <td className="p-3.5 text-right font-bold text-emerald-700">
                      {formatCurrency(acc.clearedBankBalance, acc.currency)}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {acc.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() =>
                          updateBankAccountStatus(acc.id, acc.status === 'Active' ? 'Frozen' : 'Active')
                        }
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                      >
                        {acc.status === 'Active' ? 'Freeze' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SIGNATORIES & MANDATES */}
      {activeTab === 'signatories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bankSignatories.map((sig) => (
            <div key={sig.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{sig.signatoryName}</h3>
                  <p className="text-xs text-slate-500">{sig.signatoryTitle}</p>
                </div>
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100 text-indigo-950">
                  <span className="text-[10px] font-semibold text-indigo-600 block">Authority Tier</span>
                  <span className="font-bold">{sig.categoryTier}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Signing Limit</span>
                  <span className="font-bold text-slate-900">{formatCurrency(sig.authorizationLimitOMR)}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Power of Attorney</span>
                  <span className="font-mono text-slate-700 font-medium">{sig.powerOfAttorneyRef}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Specimen Card</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{sig.specimenCardStatus}</span>
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Valid until: {sig.validUntil}</span>
                <span className="text-slate-800 font-semibold">{sig.contactMobile}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: BANK LIMITS */}
      {activeTab === 'limits' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bankLimits.map((lim) => {
              const utilPercent = Math.round((lim.utilizedAmountOMR / lim.allocatedAmountOMR) * 100);
              return (
                <div key={lim.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{lim.bankName}</span>
                      <h3 className="text-sm font-bold text-slate-900 mt-0.5">{lim.limitType}</h3>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        lim.status === 'Compliant'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {lim.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Allocated Cap</span>
                      <span className="font-bold text-slate-900">{formatCurrency(lim.allocatedAmountOMR)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Utilized ({utilPercent}%)</span>
                      <span className="font-semibold text-slate-800">{formatCurrency(lim.utilizedAmountOMR)}</span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                      <div
                        className={`h-full rounded-full transition-all ${
                          utilPercent > 85 ? 'bg-amber-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${utilPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-400">Available</span>
                      <span className="font-bold text-emerald-600">{formatCurrency(lim.availableAmountOMR)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                    <p className="line-clamp-2">{lim.covenantTerms}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: ADD BANK MASTER */}
      {showAddBankModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Add Bank Financial Institution</h3>
            <form onSubmit={handleCreateBankMaster} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Bank Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BK-DHOFAR"
                    value={newBankCode}
                    onChange={(e) => setNewBankCode(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">SWIFT / BIC Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DHOFOMRX"
                    value={newSwiftBic}
                    onChange={(e) => setNewSwiftBic(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Bank Name (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bank Dhofar SAOG"
                  value={newBankNameEn}
                  onChange={(e) => setNewBankNameEn(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">RM Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Mazin Al-Hinai"
                    value={newRmName}
                    onChange={(e) => setNewRmName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">RM Phone</label>
                  <input
                    type="text"
                    placeholder="+968 2400 1122"
                    value={newRmPhone}
                    onChange={(e) => setNewRmPhone(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddBankModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Save Bank Master
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD BANK ACCOUNT */}
      {showAddAccountModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Configure New Bank Account</h3>
            <form onSubmit={handleCreateBankAccount} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Partner Bank *</label>
                <select
                  value={newAccBankId}
                  onChange={(e) => setNewAccBankId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  {bankMasters.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.bankNameEn} ({b.swiftBic})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Account Title / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artify Global — Salalah Operations Current"
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Account Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="042301988271009"
                    value={newAccNumber}
                    onChange={(e) => setNewAccNumber(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Currency *</label>
                  <select
                    value={newAccCurrency}
                    onChange={(e) => setNewAccCurrency(e.target.value as CurrencyCode)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  >
                    <option value="OMR">OMR — Omani Rial</option>
                    <option value="USD">USD — US Dollar</option>
                    <option value="AED">AED — UAE Dirham</option>
                    <option value="EUR">EUR — Euro</option>
                    <option value="GBP">GBP — British Pound</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">IBAN *</label>
                <input
                  type="text"
                  required
                  placeholder="OM44BMUS042301988271009"
                  value={newAccIban}
                  onChange={(e) => setNewAccIban(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Account Type</label>
                  <select
                    value={newAccType}
                    onChange={(e) => setNewAccType(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  >
                    <option value="Current Operating">Current Operating</option>
                    <option value="Call Deposit">Call Deposit</option>
                    <option value="Escrow Account">Escrow Account</option>
                    <option value="Payroll (WPS)">Payroll (WPS)</option>
                    <option value="Foreign Currency Reserve">Foreign Currency Reserve</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Overdraft Limit (OMR)</label>
                  <input
                    type="number"
                    value={newAccOverdraftLimit}
                    onChange={(e) => setNewAccOverdraftLimit(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAccountModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SIGNATORY */}
      {showAddSignatoryModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Register Bank Account Signatory</h3>
            <form onSubmit={handleCreateSignatory} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Link to Bank Account *</label>
                <select
                  value={newSigAccountId}
                  onChange={(e) => setNewSigAccountId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  {bankAccounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.accountName} ({a.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Signatory Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eng. Nasser Al-Hinai"
                    value={newSigName}
                    onChange={(e) => setNewSigName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Designation Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Executive Officer"
                    value={newSigTitle}
                    onChange={(e) => setNewSigTitle(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Mandate Tier</label>
                  <select
                    value={newSigTier}
                    onChange={(e) => setNewSigTier(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  >
                    <option value="Category A (Executive)">Category A (Executive)</option>
                    <option value="Category B (Senior Management)">Category B (Senior Management)</option>
                    <option value="Category C (Operational Finance)">Category C (Operational Finance)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Limit (OMR)</label>
                  <input
                    type="number"
                    value={newSigLimit}
                    onChange={(e) => setNewSigLimit(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Power of Attorney Reference</label>
                <input
                  type="text"
                  placeholder="MOCI-POA-2026-9941"
                  value={newSigPoa}
                  onChange={(e) => setNewSigPoa(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddSignatoryModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                >
                  Save Signatory Mandate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

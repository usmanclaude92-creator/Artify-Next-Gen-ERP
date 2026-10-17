import React, { useState } from 'react';
import {
  Users,
  Building2,
  Search,
  Filter,
  CreditCard,
  Phone,
  Mail,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Edit2,
  FileText,
  DollarSign,
  UserCheck,
  ChevronRight,
  Lock,
  Unlock
} from 'lucide-react';
import { useSalesCrm } from '../../services/salesCrmStore';
import { Customer, CustomerContact, CustomerTier, CustomerCategory } from '../../types';
import { ERPUserRole } from '../../../../types/erp';
import { mockRandom } from '@/src/utils/mockRandom';

interface CustomerManagementViewProps {
  activeTransactionId?: string;
  onNavigate?: (route: any) => void;
  activeRole: ERPUserRole;
}

export const CustomerManagementView: React.FC<CustomerManagementViewProps> = ({
  activeTransactionId,
  onNavigate,
  activeRole
}) => {
  const { customers, addCustomer, updateCustomer, addContactToCustomer, updateCreditLimit } = useSalesCrm();

  const [activeTab, setActiveTab] = useState<'all' | 'master' | 'contacts' | 'classification' | 'credit'>(
    activeTransactionId === 'tx-cust-master'
      ? 'master'
      : activeTransactionId === 'tx-contact-mgmt'
      ? 'contacts'
      : activeTransactionId === 'tx-cust-classification'
      ? 'classification'
      : activeTransactionId === 'tx-cust-credit-limits'
      ? 'credit'
      : 'all'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customers[0] || null);

  // Modals
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [newCreditLimit, setNewCreditLimit] = useState(1000000);
  const [newCreditDays, setNewCreditDays] = useState(60);

  // New Customer Form State
  const [legalName, setLegalName] = useState('');
  const [crNumber, setCrNumber] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [category, setCategory] = useState<CustomerCategory>('Oil & Gas Upstream/Downstream');
  const [tier, setTier] = useState<CustomerTier>('Tier 2 — Enterprise Corporate');
  const [city, setCity] = useState('Muscat');
  const [billingAddr, setBillingAddr] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.legalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.taxIdentificationNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = selectedTier === 'ALL' || c.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!legalName || !crNumber) return;

    const created = addCustomer({
      legalName,
      tradeName: legalName,
      commercialRegistrationNumber: crNumber,
      taxIdentificationNumber: vatNumber || `OM-VAT-${Math.floor(10000000 + mockRandom() * 90000000)}`,
      category,
      tier,
      country: 'Sultanate of Oman',
      governorate: 'Muscat',
      city,
      billingAddress: billingAddr || `${legalName} Office, ${city}`,
      shippingAddress: `${legalName} Warehouse, ${city}`,
      currency: 'OMR',
      accountManagerId: 'usr-rep-01',
      accountManagerName: 'Eng. Tariq Al-Habsi',
      lifetimeRevenueOMR: 0,
      activeOrdersCount: 0,
      status: 'Active',
      tags: ['Verified Client', category],
      contacts: [
        {
          id: `cnt-${Date.now()}`,
          customerId: 'temp',
          fullName: contactName || 'Primary Focal Point',
          designation: 'Procurement Director',
          department: 'Procurement',
          email: contactEmail || 'info@client.om',
          phone: contactPhone || '+968 2400 0000',
          mobile: contactPhone || '+968 9900 0000',
          isPrimaryDecisionMaker: true,
          isBillingContact: true
        }
      ],
      creditTerms: {
        creditLimitOMR: 500000,
        creditDays: 60,
        currentOutstandingOMR: 0,
        unbilledOrdersOMR: 0,
        availableCreditOMR: 500000,
        creditStatus: 'Good Standing',
        paymentTermsLabel: 'Net 60 Days'
      }
    });

    setSelectedCustomer(created);
    setShowAddCustomerModal(false);
    // Reset
    setLegalName('');
    setCrNumber('');
    setVatNumber('');
    setBillingAddr('');
  };

  const handleUpdateCreditLimit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    updateCreditLimit(selectedCustomer.id, Number(newCreditLimit), Number(newCreditDays));
    setShowCreditModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                Functional Area 06.02
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Customer 360 Directory & Credit Governance</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Customer Master, Contacts & Credit Limits
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Statutory Oman VAT accounts, multi-stakeholder contact hierarchies, credit limit controls, and automated credit block flags.
            </p>
          </div>

          <button
            onClick={() => setShowAddCustomerModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Customer Account
          </button>
        </div>

        {/* Process Tabs */}
        <div className="flex flex-wrap gap-2 border-t border-slate-200 dark:border-slate-800 pt-4 mt-5">
          {[
            { id: 'all', label: 'All Accounts' },
            { id: 'master', label: '06.02.01 Customer Master', code: 'tx-cust-master' },
            { id: 'contacts', label: '06.02.02 Contact Directory', code: 'tx-contact-mgmt' },
            { id: 'classification', label: '06.02.03 Tiers & Classification', code: 'tx-cust-classification' },
            { id: 'credit', label: '06.02.04 Credit Limits & Ceilings', code: 'tx-cust-credit-limits' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Customer Directory List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-600 dark:text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customers by name, CR or VAT ID..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Tiers</option>
              <option value="Tier 1 — Strategic Key Account">Tier 1 Strategic</option>
              <option value="Tier 2 — Enterprise Corporate">Tier 2 Enterprise</option>
              <option value="Government / Public Authority">Government / Utility</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredCustomers.map((cust) => {
              const isSelected = selectedCustomer?.id === cust.id;
              const creditPct =
                cust.creditTerms.creditLimitOMR > 0
                  ? Math.round(
                      ((cust.creditTerms.currentOutstandingOMR + cust.creditTerms.unbilledOrdersOMR) /
                        cust.creditTerms.creditLimitOMR) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomer(cust)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700 shadow-sm ring-1 ring-blue-400/50'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                        {cust.customerCode}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                        {cust.legalName}
                      </h4>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        cust.tier.includes('Tier 1')
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : cust.tier.includes('Government')
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {cust.tier.split('—')[0]}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {cust.category} • {cust.city}
                  </div>

                  {/* Credit Bar */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Credit Limit:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      OMR {cust.creditTerms.creditLimitOMR.toLocaleString()}
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        creditPct > 85 ? 'bg-rose-500' : creditPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(creditPct, 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span
                      className={`font-semibold ${
                        cust.creditTerms.creditStatus === 'Good Standing'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {cust.creditTerms.creditStatus}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">{creditPct}% Utilized</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Customer 360 Detailed Profile (7 cols) */}
        <div className="lg:col-span-7">
          {selectedCustomer ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                      {selectedCustomer.customerCode}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {selectedCustomer.status}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
                    {selectedCustomer.legalName}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Tax ID: <span className="font-mono text-slate-700 dark:text-slate-300">{selectedCustomer.taxIdentificationNumber}</span> • CR: <span className="font-mono text-slate-700 dark:text-slate-300">{selectedCustomer.commercialRegistrationNumber}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setNewCreditLimit(selectedCustomer.creditTerms.creditLimitOMR);
                    setNewCreditDays(selectedCustomer.creditTerms.creditDays);
                    setShowCreditModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  Adjust Credit Limit
                </button>
              </div>

              {/* Credit Terms Metric Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Credit Limit</div>
                  <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    OMR {selectedCustomer.creditTerms.creditLimitOMR.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">{selectedCustomer.creditTerms.paymentTermsLabel}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Outstanding AR</div>
                  <div className="text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                    OMR {selectedCustomer.creditTerms.currentOutstandingOMR.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">Invoiced Balance</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Unbilled Orders</div>
                  <div className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                    OMR {selectedCustomer.creditTerms.unbilledOrdersOMR.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">Allocated in Whse</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Available Credit</div>
                  <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    OMR {selectedCustomer.creditTerms.availableCreditOMR.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-500 dark:text-emerald-400 mt-0.5">Ready for Booking</div>
                </div>
              </div>

              {/* Entity Information & Addresses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="font-semibold text-slate-900 dark:text-white block mb-1.5">
                    Billing Location & Address
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {selectedCustomer.billingAddress}
                  </p>
                  <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                    Governorate: <span className="font-medium text-slate-700 dark:text-slate-300">{selectedCustomer.governorate}, Oman</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="font-semibold text-slate-900 dark:text-white block mb-1.5">
                    Designated Shipping Receiving Gate
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {selectedCustomer.shippingAddress}
                  </p>
                  <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                    Account Manager: <span className="font-medium text-slate-700 dark:text-slate-300">{selectedCustomer.accountManagerName}</span>
                  </div>
                </div>
              </div>

              {/* Key Stakeholders & Contact Hierarchy */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    06.02.02 Key Decision Makers & Stakeholders
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{selectedCustomer.contacts.length} Registered Contacts</span>
                </div>

                <div className="space-y-2.5">
                  {selectedCustomer.contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">
                            {contact.fullName}
                          </span>
                          {contact.isPrimaryDecisionMaker && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                              Primary Decision Maker
                            </span>
                          )}
                          {contact.isBillingContact && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                              Finance Liaison
                            </span>
                          )}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">
                          {contact.designation} • <span className="text-slate-700 dark:text-slate-300">{contact.department}</span>
                        </div>
                      </div>

                      <div className="text-right space-y-1 text-slate-600 dark:text-slate-400">
                        <div className="flex items-center justify-end gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                          <span>{contact.email}</span>
                        </div>
                        <div className="flex items-center justify-end gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                          <span>{contact.phone}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              Select a customer to view 360° master profile
            </div>
          )}
        </div>
      </div>

      {/* Credit Limit Adjustment Modal */}
      {showCreditModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  06.02.04 Customer Credit Governance
                </h3>
              </div>
              <button
                onClick={() => setShowCreditModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateCreditLimit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Customer Account
                </label>
                <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-medium text-slate-900 dark:text-white">
                  {selectedCustomer.legalName} ({selectedCustomer.customerCode})
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Authorized Credit Ceiling (OMR)
                </label>
                <input
                  type="number"
                  required
                  value={newCreditLimit}
                  onChange={(e) => setNewCreditLimit(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Payment Credit Period (Days)
                </label>
                <select
                  value={newCreditDays}
                  onChange={(e) => setNewCreditDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value={30}>Net 30 Days</option>
                  <option value={45}>Net 45 Days</option>
                  <option value={60}>Net 60 Days</option>
                  <option value={90}>Net 90 Days (Government / Key Accounts)</option>
                  <option value={120}>Net 120 Days (Special Approval)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreditModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md cursor-pointer"
                >
                  Update Credit Limit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Customer Account Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  06.02.01 New Customer Master Registration
                </h3>
              </div>
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Legal Entity Name (As per Commercial Registration) *
                </label>
                <input
                  type="text"
                  required
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  placeholder="e.g. Oman Cables Industry SAOG"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Commercial Registration (CR) *
                  </label>
                  <input
                    type="text"
                    required
                    value={crNumber}
                    onChange={(e) => setCrNumber(e.target.value)}
                    placeholder="CR-1049281"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Oman VAT Identification No
                  </label>
                  <input
                    type="text"
                    value={vatNumber}
                    onChange={(e) => setVatNumber(e.target.value)}
                    placeholder="OM-VAT-10009999"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Industry Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Oil & Gas Upstream/Downstream">Oil & Gas</option>
                    <option value="Industrial Manufacturer">Industrial Manufacturer</option>
                    <option value="EPC & Main Contractor">EPC Contractor</option>
                    <option value="Government Ministry / Utility">Government Ministry / Utility</option>
                    <option value="Commercial Trader">Commercial Trader</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Customer Tier Classification
                  </label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Tier 1 — Strategic Key Account">Tier 1 — Strategic Key Account</option>
                    <option value="Tier 2 — Enterprise Corporate">Tier 2 — Enterprise Corporate</option>
                    <option value="Tier 3 — SME / Commercial">Tier 3 — SME / Commercial</option>
                    <option value="Government / Public Authority">Government / Public Authority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Billing Office Address
                </label>
                <input
                  type="text"
                  value={billingAddr}
                  onChange={(e) => setBillingAddr(e.target.value)}
                  placeholder="e.g. Rusayl Industrial Estate, Way 4200, Muscat"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                <span className="font-bold text-slate-900 dark:text-white block mb-2">
                  Primary Contact Person
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Contact Name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Phone / Mobile"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md cursor-pointer"
                >
                  Save Customer Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

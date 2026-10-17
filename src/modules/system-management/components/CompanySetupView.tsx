import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Globe2,
  Landmark,
  FileCheck2,
  Coins,
  ShieldCheck,
  Building,
  Save,
  X
} from 'lucide-react';
import { useSystemManagement } from '../services/systemManagementStore';
import { Company } from '../types';

export const CompanySetupView: React.FC = () => {
  const {
    companies = [],
    addCompany,
    updateCompany,
    currencies = [],
    addCurrency,
    updateCurrency
  } = useSystemManagement();

  const [activeTab, setActiveTab] = useState<'companies' | 'statutory' | 'currencies'>('companies');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>((companies && companies[0]?.id) || 'comp-1');

  // Modal State for Company Creation / Editing
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [companyForm, setCompanyForm] = useState({
    code: '',
    legalName: '',
    tradingName: '',
    companyType: 'Subsidiary' as Company['companyType'],
    registrationNumber: '',
    taxNumber: '',
    chamberOfCommerceNumber: '',
    country: 'Oman',
    state: 'Muscat',
    city: 'Muscat',
    currency: 'OMR',
    decimalPrecision: 3,
    fiscalYearStart: '2026-01-01',
    timeZone: 'Asia/Muscat (UTC+4)',
    dateFormat: 'DD/MM/YYYY',
    postalCode: '100',
    website: 'https://al-arabiya-group.com',
    status: 'Active' as 'Active' | 'Draft' | 'Pending Approval' | 'Inactive' | 'Archived' | 'Suspended',
    contactPerson: '',
    email: '',
    phone: '',
    address: 'Muscat, Sultanate of Oman',
    isParent: false
  });

  const handleOpenNewCompany = () => {
    setEditingCompany(null);
    setCompanyForm({
      code: `COMP-${String((companies || []).length + 1).padStart(2, '0')}`,
      legalName: '',
      tradingName: '',
      companyType: 'Subsidiary',
      registrationNumber: 'CR-1098442',
      taxNumber: 'OM-VAT-1004928',
      chamberOfCommerceNumber: 'COC-88921',
      country: 'Oman',
      state: 'Muscat Governorate',
      city: 'Muscat',
      currency: 'OMR',
      decimalPrecision: 3,
      fiscalYearStart: '2026-01-01',
      timeZone: 'Asia/Muscat (UTC+4)',
      dateFormat: 'DD/MM/YYYY',
      postalCode: '112',
      website: 'https://enterprise.om',
      status: 'Active',
      contactPerson: 'Directorate of Corporate Affairs',
      email: 'info@enterprise.om',
      phone: '+968 2450 0000',
      address: 'Way 2144, Plot 88, Ruwi Business District, Muscat',
      isParent: false
    });
    setIsCompanyModalOpen(true);
  };

  const handleEditCompany = (comp: Company) => {
    setEditingCompany(comp);
    setCompanyForm({
      code: comp.code,
      legalName: comp.legalName,
      tradingName: comp.tradingName || comp.legalName,
      companyType: comp.companyType || 'Subsidiary',
      registrationNumber: comp.registrationNumber,
      taxNumber: comp.taxNumber,
      chamberOfCommerceNumber: comp.chamberOfCommerceNumber || '',
      country: comp.country,
      state: comp.state || 'Muscat',
      city: comp.city || 'Muscat',
      currency: comp.currency,
      decimalPrecision: comp.decimalPrecision || 3,
      fiscalYearStart: comp.fiscalYearStart,
      timeZone: comp.timeZone || 'Asia/Muscat (UTC+4)',
      dateFormat: comp.dateFormat || 'DD/MM/YYYY',
      postalCode: comp.postalCode || '100',
      website: comp.website || '',
      status: comp.status,
      contactPerson: comp.contactPerson || '',
      email: comp.email,
      phone: comp.phone,
      address: comp.address,
      isParent: comp.isParent
    });
    setIsCompanyModalOpen(true);
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCompany) {
      updateCompany(editingCompany.id, companyForm);
    } else {
      addCompany(companyForm);
    }
    setIsCompanyModalOpen(false);
  };

  const safeCompanies = companies || [];
  const safeCurrencies = currencies || [];

  const filteredCompanies = safeCompanies.filter(c => {
    return (
      (c.legalName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.taxNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.registrationNumber || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const selectedCompany = safeCompanies.find(c => c.id === selectedCompanyId) || safeCompanies[0];

  return (
    <div id="company-setup-view" className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800">
                  01.01.01
                </span>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Company Setup & Legal Entity Definition
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                  Multi-Company Active
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
                Define parent holding companies, subsidiaries, commercial registration records, VAT tax authority credentials, and statutory currencies.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleOpenNewCompany}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Company Entity</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mt-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('companies')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'companies'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>01.01.01.01 / 02 Legal Entities Master ({companies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('statutory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'statutory'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>01.01.01.03 Statutory & Tax Profiles</span>
          </button>

          <button
            onClick={() => setActiveTab('currencies')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'currencies'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>01.01.01.04 Currency & Decimal Setup ({currencies.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Companies Table */}
      {activeTab === 'companies' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-600 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search legal name, code, CR, VAT..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Showing <strong>{filteredCompanies.length}</strong> registered legal entities
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Entity Code & Legal Name</th>
                  <th className="px-4 py-3">Commercial Reg (CR)</th>
                  <th className="px-4 py-3">Tax Identification (VAT)</th>
                  <th className="px-4 py-3">Base Currency</th>
                  <th className="px-4 py-3">Jurisdiction</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCompanies.map(company => (
                  <tr
                    key={company.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold font-mono text-xs">
                          {company.code.substring(0, 3)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-slate-100 block">
                            {company.legalName}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            {company.code} • {company.tradingName}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-700 dark:text-slate-300 font-medium">
                      {company.registrationNumber}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-700 dark:text-slate-300 font-medium">
                      {company.taxNumber}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-semibold text-[11px]">
                        {company.currency} ({company.decimalPrecision || 3} Decimals)
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300 font-medium">
                      {company.country}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          company.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                        }`}
                      >
                        {company.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleEditCompany(company)}
                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                        title="Edit Entity Parameters"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Statutory Profile Details */}
      {activeTab === 'statutory' && selectedCompany && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Statutory Compliance & Legal Entity Profile</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Official registration credentials, Tax Authority Oman compliance, and Ministry of Commerce certifications.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Select Entity:</span>
              <select
                value={selectedCompanyId}
                onChange={e => setSelectedCompanyId(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none"
              >
                {companies.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.legalName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Landmark className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Commercial Registry Details</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">CR Number:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{selectedCompany.registrationNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Chamber of Commerce:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{selectedCompany.chamberOfCommerceNumber || 'COC-88291'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Incorporation Country:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{selectedCompany.country}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>VAT & Tax Authority Profile</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">VAT Registration No:</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{selectedCompany.taxNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Tax Type:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">Standard 5% VAT (Sultanate of Oman)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Filing Frequency:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">Quarterly Electronic Returns</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Fiscal & Contact Registry</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Fiscal Year Period:</span>
                  <span className="font-mono font-medium text-slate-900 dark:text-slate-100">{selectedCompany.fiscalYearStart} – 31 Dec</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Authorized Signatory:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{selectedCompany.contactPerson || 'Managing Director'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Official Phone:</span>
                  <span className="font-mono text-slate-900 dark:text-slate-100">{selectedCompany.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Currencies & Decimals */}
      {activeTab === 'currencies' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Coins className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Multi-Currency Master & Decimal Precision Parameters</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Currency Code</th>
                  <th className="px-4 py-3">Currency Name</th>
                  <th className="px-4 py-3">Symbol</th>
                  <th className="px-4 py-3">Decimal Places</th>
                  <th className="px-4 py-3">Exchange Rate (vs Base OMR)</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {currencies.map(curr => (
                  <tr
                    key={curr.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-bold font-mono text-slate-900 dark:text-slate-100">
                      {curr.code}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                      {curr.name}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {curr.symbol}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-700 dark:text-slate-300">
                      {curr.decimalPlaces} Decimals (e.g. 1.{'0'.repeat(curr.decimalPlaces)})
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-700 dark:text-slate-300">
                      {curr.exchangeRate.toFixed(4)}
                    </td>
                    <td className="px-4 py-3.5">
                      {curr.isBase ? (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800 text-[10px] font-bold">
                          BASE CURRENCY
                        </span>
                      ) : (
                        <span className="text-slate-500 dark:text-slate-400 text-xs">Foreign Currency</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                        {curr.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Creating / Editing Company Entity */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>{editingCompany ? 'Edit Legal Entity Parameters' : 'Create New Legal Company Entity'}</span>
              </h3>
              <button
                onClick={() => setIsCompanyModalOpen(false)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCompany} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Company Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyForm.code}
                    onChange={e => setCompanyForm({ ...companyForm, code: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Base Currency *
                  </label>
                  <select
                    value={companyForm.currency}
                    onChange={e => {
                      const dec = e.target.value === 'OMR' ? 3 : 2;
                      setCompanyForm({ ...companyForm, currency: e.target.value, decimalPrecision: dec });
                    }}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="OMR">OMR - Omani Rial (3 Decimals)</option>
                    <option value="AED">AED - UAE Dirham (2 Decimals)</option>
                    <option value="SAR">SAR - Saudi Riyal (2 Decimals)</option>
                    <option value="USD">USD - US Dollar (2 Decimals)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Legal Registered Name *
                </label>
                <input
                  type="text"
                  required
                  value={companyForm.legalName}
                  onChange={e => setCompanyForm({ ...companyForm, legalName: e.target.value })}
                  placeholder="e.g. Al-Futtaim Engineering & Construction LLC"
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Commercial Registration (CR) *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyForm.registrationNumber}
                    onChange={e => setCompanyForm({ ...companyForm, registrationNumber: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    VAT Tax Identification Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyForm.taxNumber}
                    onChange={e => setCompanyForm({ ...companyForm, taxNumber: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Authorized Signatory / MD
                  </label>
                  <input
                    type="text"
                    value={companyForm.contactPerson}
                    onChange={e => setCompanyForm({ ...companyForm, contactPerson: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={companyForm.email}
                    onChange={e => setCompanyForm({ ...companyForm, email: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Registered Headquarters Address
                </label>
                <input
                  type="text"
                  value={companyForm.address}
                  onChange={e => setCompanyForm({ ...companyForm, address: e.target.value })}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCompanyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  {editingCompany ? 'Update Legal Entity' : 'Save Legal Entity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 16: FINANCIAL ACCOUNTING & REPORTING
// Master Module Runner (16.01 - 16.08)
// ==========================================

import React, { useState, useEffect } from 'react';
import { FinanceProvider, useFinanceStore } from './services/financeStore';
import { GeneralLedgerView } from './components/gl/GeneralLedgerView';
import { AccountsPayableView } from './components/ap/AccountsPayableView';
import { AccountsReceivableView } from './components/ar/AccountsReceivableView';
import { CashBankView } from './components/cashbank/CashBankView';
import { FixedAssetsAccountingView } from './components/assets/FixedAssetsAccountingView';
import { PeriodEndClosingView } from './components/periodend/PeriodEndClosingView';
import { CostAccountingView } from './components/cost/CostAccountingView';
import { IntercompanyFxView } from './components/intercompany/IntercompanyFxView';
import { FinancialReportingView } from './components/reporting/FinancialReportingView';

import {
  BookOpen,
  ArrowDownRight,
  ArrowUpRight,
  Landmark,
  Shield,
  CalendarCheck,
  PieChart,
  FileSpreadsheet,
  Globe,
  Calculator,
  Layers,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface FinanceDashboardContentProps {
  activeSection?: string;
  onNavigate?: (route: any) => void;
}

const FinanceDashboardContent: React.FC<FinanceDashboardContentProps> = ({
  activeSection = '16.01',
  onNavigate
}) => {
  const {
    currency,
    chartOfAccounts,
    supplierInvoices,
    customerInvoices,
    bankAccounts,
    fixedAssets,
    fiscalPeriods,
    intercompanyTransactions
  } = useFinanceStore();

  const [selectedSection, setSelectedSection] = useState<string>(activeSection);

  useEffect(() => {
    if (activeSection) {
      setSelectedSection(activeSection);
    }
  }, [activeSection]);

  const sections = [
    {
      id: '16.01',
      title: 'General Ledger',
      subtitle: 'COA & Double-Entry Journals',
      icon: BookOpen,
      count: `${chartOfAccounts.length} GL Accounts`
    },
    {
      id: '16.02',
      title: 'Accounts Payable (AP)',
      subtitle: '3-Way Match & Supplier Sub-ledger',
      icon: ArrowDownRight,
      count: `${supplierInvoices.length} Supplier Invoices`
    },
    {
      id: '16.03',
      title: 'Accounts Receivable (AR)',
      subtitle: 'Client Invoices, Receipts & Aging',
      icon: ArrowUpRight,
      count: `${customerInvoices.length} Client Invoices`
    },
    {
      id: '16.04',
      title: 'Cash & Bank Accounting',
      subtitle: 'Treasury & Bank Reconciliations',
      icon: Landmark,
      count: `${bankAccounts.length} Bank Accounts`
    },
    {
      id: '16.05',
      title: 'Fixed Assets Accounting',
      subtitle: 'Capitalization & IAS 16 Depreciation',
      icon: Shield,
      count: `${fixedAssets.length} Fixed Assets`
    },
    {
      id: '16.06',
      title: 'Period-End Closing',
      subtitle: 'Accruals, Subledger Lock & Year-End',
      icon: CalendarCheck,
      count: `${fiscalPeriods.length} Fiscal Periods`
    },
    {
      id: '16.07',
      title: 'Cost Accounting',
      subtitle: 'Profit Centers & Overhead Allocations',
      icon: PieChart,
      count: '3 Profit Centers'
    },
    {
      id: '16.08',
      title: 'Financial Reporting',
      subtitle: 'IFRS Statements & 5% VAT Return',
      icon: FileSpreadsheet,
      count: '5 Statutory Statements'
    },
    {
      id: '16.09',
      title: 'Intercompany & FX',
      subtitle: 'Group Matching & Currency Rates',
      icon: Globe,
      count: `${intercompanyTransactions.length} IC Transactions`
    },
    {
      id: '16.10',
      title: 'Financial Statements',
      subtitle: 'Trial Balance & IFRS Statements',
      icon: FileSpreadsheet,
      count: '5 Statutory Statements'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Enterprise Module Header Strip */}
      <div className="bg-gradient-to-r from-slate-50 dark:from-slate-900 via-slate-100 dark:via-slate-800 to-slate-50 dark:to-slate-900 rounded-3xl p-6 text-slate-900 dark:text-white shadow-xl border border-slate-300/50 dark:border-slate-700/50">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5" />
                Artify Enterprise ERP — Module 16
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-mono">
                IFRS & Oman Commercial Law Compliant
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Financial Accounting & Statutory Reporting
            </h1>
            <p className="text-sm text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed">
              Unified double-entry General Ledger, 3-way matched Accounts Payable, statutory 5% VAT billing in Accounts Receivable, Treasury bank statement reconciliations, IAS 16 depreciation, multi-subledger period locks, and real-time IFRS Financial Statements.
            </p>
          </div>

          <div className="flex flex-wrap lg:flex-col items-end gap-2 shrink-0">
            <div className="bg-slate-100/80 dark:bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 font-mono text-xs text-right">
              <span className="text-slate-600 dark:text-slate-400 block text-[10px] uppercase font-sans">Primary Operating Currency</span>
              <strong className="text-emerald-600 dark:text-emerald-400 text-sm">OMR (Omani Rial) • 5% Standard VAT</strong>
            </div>
          </div>
        </div>

        {/* Submodule Fast Switcher Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          {sections.map(sec => {
            const Icon = sec.icon;
            const isSelected = selectedSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setSelectedSection(sec.id)}
                className={`p-3 rounded-2xl text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-400/50 scale-102'
                    : 'bg-white/70 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-mono font-bold ${isSelected ? 'text-white' : 'text-emerald-700 dark:text-emerald-400'}`}>
                    {sec.id}
                  </span>
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-tight truncate">{sec.title}</h4>
                  <span className={`text-[10px] block truncate mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    {sec.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Submodule Active View */}
      <div className="transition-all duration-200">
        {selectedSection === '16.01' && <GeneralLedgerView />}
        {selectedSection === '16.02' && <AccountsPayableView />}
        {selectedSection === '16.03' && <AccountsReceivableView />}
        {selectedSection === '16.04' && <CashBankView />}
        {selectedSection === '16.05' && <FixedAssetsAccountingView />}
        {selectedSection === '16.06' && <PeriodEndClosingView />}
        {selectedSection === '16.07' && <CostAccountingView />}
        {selectedSection === '16.08' && <FinancialReportingView initialReport="vat-return" />}
        {selectedSection === '16.09' && <IntercompanyFxView />}
        {selectedSection === '16.10' && <FinancialReportingView initialReport="trial-balance" />}
      </div>
    </div>
  );
};

export interface FinanceModuleRunnerProps {
  module?: any;
  functionalArea?: any;
  process?: any;
  transaction?: any;
  onNavigate?: (route: any) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  activeRole?: any;
  activeSection?: string;
}

export const FinanceModuleRunner: React.FC<FinanceModuleRunnerProps> = ({
  module,
  functionalArea,
  process,
  transaction,
  onNavigate,
  isFavorite,
  onToggleFavorite,
  activeRole,
  activeSection
}) => {
  // Determine initial active section from functional area code if available
  let initialSection = activeSection || '16.01';
  if (functionalArea?.code) {
    if (functionalArea.code.startsWith('16.01')) initialSection = '16.01';
    else if (functionalArea.code.startsWith('16.02')) initialSection = '16.02';
    else if (functionalArea.code.startsWith('16.03')) initialSection = '16.03';
    else if (functionalArea.code.startsWith('16.04')) initialSection = '16.04';
    else if (functionalArea.code.startsWith('16.05')) initialSection = '16.05';
    else if (functionalArea.code.startsWith('16.06')) initialSection = '16.06';
    else if (functionalArea.code.startsWith('16.07')) initialSection = '16.07';
    else if (functionalArea.code.startsWith('16.08')) initialSection = '16.08';
    else if (functionalArea.code.startsWith('16.09')) initialSection = '16.09';
    else if (functionalArea.code.startsWith('16.10')) initialSection = '16.10';
  } else if (process?.code) {
    if (process.code.startsWith('16.01')) initialSection = '16.01';
    else if (process.code.startsWith('16.02')) initialSection = '16.02';
    else if (process.code.startsWith('16.03')) initialSection = '16.03';
    else if (process.code.startsWith('16.04')) initialSection = '16.04';
    else if (process.code.startsWith('16.05')) initialSection = '16.05';
    else if (process.code.startsWith('16.06')) initialSection = '16.06';
    else if (process.code.startsWith('16.07')) initialSection = '16.07';
    else if (process.code.startsWith('16.08')) initialSection = '16.08';
    else if (process.code.startsWith('16.09')) initialSection = '16.09';
    else if (process.code.startsWith('16.10')) initialSection = '16.10';
  }

  return (
    <FinanceProvider>
      <FinanceDashboardContent activeSection={initialSection} onNavigate={onNavigate} />
    </FinanceProvider>
  );
};

export default FinanceModuleRunner;

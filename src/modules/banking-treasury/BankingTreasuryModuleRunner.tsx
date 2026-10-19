import React, { useState } from 'react';
import {
  ERPModule,
  ERPFunctionalArea,
  ERPProcess,
  ERPTransaction,
  ERPRouteState,
  ERPUserRole
} from '../../types/erp';
import { BankingTreasuryProvider, useBankingTreasury } from './services/bankingTreasuryStore';
import { BankingTreasuryDashboardView } from './components/dashboard/BankingTreasuryDashboardView';
import { BankManagementView } from './components/bank/BankManagementView';
import { CashManagementView } from './components/cash/CashManagementView';
import { PaymentManagementView } from './components/payments/PaymentManagementView';
import { ReceiptManagementView } from './components/receipts/ReceiptManagementView';
import { BankReconciliationView } from './components/reconciliation/BankReconciliationView';
import { PettyCashView } from './components/pettycash/PettyCashView';
import { TreasuryManagementView } from './components/treasury/TreasuryManagementView';
import {
  ArrowLeft,
  Star,
  LayoutDashboard,
  ShieldCheck,
  UserCheck,
  AlertOctagon,
  RefreshCw,
  FileCheck2,
  Lock,
  Layers
} from 'lucide-react';

interface BankingTreasuryModuleRunnerProps {
  module: ERPModule;
  functionalArea?: ERPFunctionalArea;
  process?: ERPProcess;
  transaction?: ERPTransaction;
  onNavigate: (route: ERPRouteState) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  activeRole: ERPUserRole;
}

const BankingTreasuryContentRunner: React.FC<BankingTreasuryModuleRunnerProps> = ({
  module,
  functionalArea,
  process,
  transaction,
  onNavigate,
  isFavorite,
  onToggleFavorite,
  activeRole
}) => {
  const {
    activeActor,
    setActiveActor,
    availableActors,
    pendingApprovalsCount,
    totalLiquidityOMR,
    resetToDefaultData,
    auditLogs,
    glJournalEntries
  } = useBankingTreasury();

  const [showPolicyModal, setShowPolicyModal] = useState(false);

  const handleAreaNavigate = (faCodeOrId: string) => {
    const codeMap: Record<string, string> = {
      '04.01': 'bank-management',
      '04.02': 'cash-management',
      '04.03': 'payment-management',
      '04.04': 'receipt-management',
      '04.05': 'bank-reconciliation',
      '04.06': 'petty-cash',
      '04.07': 'treasury-mgmt'
    };

    const targetId = codeMap[faCodeOrId] || faCodeOrId;
    onNavigate({
      view: 'functional_area',
      moduleId: 'banking-treasury',
      functionalAreaId: targetId
    });
  };

  const renderActiveSubView = () => {
    if (!functionalArea) {
      return <BankingTreasuryDashboardView onNavigateToSubView={handleAreaNavigate} />;
    }

    switch (functionalArea.id) {
      case 'bank-management':
      case '04.01':
        return <BankManagementView />;
      case 'cash-management':
      case '04.02':
        return <CashManagementView />;
      case 'payment-management':
      case '04.03':
        return <PaymentManagementView />;
      case 'receipt-management':
      case '04.04':
        return <ReceiptManagementView />;
      case 'bank-reconciliation':
      case '04.05':
        return <BankReconciliationView />;
      case 'petty-cash':
      case '04.06':
        return <PettyCashView />;
      case 'treasury-mgmt':
      case '04.07':
        return <TreasuryManagementView />;
      default:
        return <BankingTreasuryDashboardView onNavigateToSubView={handleAreaNavigate} />;
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* 1. Module Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {functionalArea && (
              <button
                onClick={() => onNavigate({ view: 'module', moduleId: 'banking-treasury' })}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                title="Back to Banking & Treasury Dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              04
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {functionalArea ? functionalArea.name : '04 — Banking & Treasury Management'}
                </h1>
                <button
                  onClick={onToggleFavorite}
                  className="text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-700 dark:text-amber-400' : ''}`} />
                </button>
                {pendingApprovalsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-200 animate-pulse">
                    {pendingApprovalsCount} Approvals Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {functionalArea
                  ? functionalArea.description
                  : 'Institutional banking, cash vaults, multi-tier electronic payments, automated MT940 reconciliation, imprest petty cash, and 13-week cash flow modeling'}
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onNavigate({ view: 'module', moduleId: 'banking-treasury' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                !functionalArea ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Executive Dashboard</span>
            </button>

            <select
              value={functionalArea?.id || 'dashboard'}
              onChange={(e) => {
                if (e.target.value === 'dashboard') {
                  onNavigate({ view: 'module', moduleId: 'banking-treasury' });
                } else {
                  handleAreaNavigate(e.target.value);
                }
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-900 cursor-pointer"
            >
              <option value="dashboard">Select Functional Area...</option>
              <option value="bank-management">04.01 Bank Management & Mandates</option>
              <option value="cash-management">04.02 Cash Management & Vaults</option>
              <option value="payment-management">04.03 Payment Management & WPS</option>
              <option value="receipt-management">04.04 Receipt Management & Allocations</option>
              <option value="bank-reconciliation">04.05 Bank Reconciliation (MT940)</option>
              <option value="petty-cash">04.06 Petty Cash & Imprest Floats</option>
              <option value="treasury-mgmt">04.07 Treasury Management & Forecast</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. High-Contrast Actor Simulation & Segregation of Duties (SoD) Bar */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Active Simulated Actor */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-400">
                  Simulated Active Actor:
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  {activeActor.name}
                  <span className="text-[11px] font-normal text-slate-600 dark:text-slate-400">({activeActor.role})</span>
                </span>
                {activeActor.signatoryTier && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                    {activeActor.signatoryTier}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                <span>
                  Authority Limit:{' '}
                  <strong className="text-emerald-600 dark:text-emerald-400">
                    OMR {activeActor.approvalLimitOMR.toLocaleString()}
                  </strong>
                </span>
                <span>•</span>
                <span>Dept: {activeActor.department}</span>
                <span>•</span>
                <span>Ref: {activeActor.employeeRef}</span>
              </div>
            </div>
          </div>

          {/* Right: Quick Switcher & Policy Tools */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-slate-100/90 dark:bg-slate-800/90 rounded-xl p-1 border border-slate-300 dark:border-slate-700">
              <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 px-2">Switch Actor:</span>
              <div className="flex items-center gap-1 overflow-x-auto">
                {availableActors.map((actor) => {
                  const isCurrent = actor.id === activeActor.id;
                  const shortName = actor.name.split(' ')[0] + ' (' + (actor.signatoryTier ? actor.signatoryTier.split(' ')[1] : 'Prep') + ')';
                  return (
                    <button
                      key={actor.id}
                      onClick={() => setActiveActor(actor)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        isCurrent
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/60'
                      }`}
                      title={`${actor.name} — ${actor.role} (Limit: OMR ${actor.approvalLimitOMR.toLocaleString()})`}
                    >
                      {shortName}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setShowPolicyModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-colors"
              title="View Segregation of Duties & Delegation of Authority rules"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>SoD & DoA Matrix</span>
            </button>

            <button
              onClick={resetToDefaultData}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-300 border border-slate-700 cursor-pointer transition-colors"
              title="Reset Demo Data to Initial State"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic SoD Notice Banner */}
        <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>
              <strong>Rule SOD-BNK-01 Active:</strong> Makers cannot approve their own vouchers. Dual sign-offs enforced for &gt; OMR 50,000.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>
              GL Vouchers Posted: <strong className="text-slate-800 dark:text-slate-200">{glJournalEntries.length}</strong>
            </span>
            <span>•</span>
            <span>
              Audit Trail Entries: <strong className="text-slate-800 dark:text-slate-200">{auditLogs.length}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  Banking & Treasury Governance & SoD Rules
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mandatory Segregation of Duties and Delegation of Authority (DoA) limits
                </p>
              </div>
              <button
                onClick={() => setShowPolicyModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-amber-600" />
                  1. Segregation of Duties (SOD-BNK-01: Maker-Checker Principle)
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  The person who creates or submits a bank payment wire, cash payment voucher, or cheque disbursement (e.g. Fatima Al-Riyami or Hilal Al-Kharusi) is strictly prohibited from approving it. The system automatically verifies that <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">makerUserId !== approverUserId</code>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-indigo-600" />
                  2. Delegation of Authority (DoA) Thresholds
                </h4>
                <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px]">
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Tier 1 (≤ OMR 2,500)</span>
                    <strong className="text-slate-900">Treasury Specialist</strong> (Hilal Al-Kharusi)
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Tier 2 (≤ OMR 25,000)</span>
                    <strong className="text-slate-900">Head of Treasury</strong> (Dr. Tariq Al-Habsi)
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Tier 3 (≤ OMR 100,000)</span>
                    <strong className="text-slate-900">Group CFO (Cat A)</strong> (Sarah Jenkins)
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Tier 4 (&gt; OMR 100,000)</span>
                    <strong className="text-slate-900">Group CEO (Cat A)</strong> (Eng. Salim Al-Rawahi)
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  3. Automated General Ledger Posting
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Upon final stage sign-off, transactions automatically post balanced double-entry vouchers to General Ledger (Debit AP/Expense, Credit Bank GL) and adjust live Bank Book Balances and Cash Vault tallies.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowPolicyModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs cursor-pointer hover:bg-slate-800"
              >
                Close Policy Matrix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Sub-View Output */}
      {renderActiveSubView()}
    </div>
  );
};

export const BankingTreasuryModuleRunner: React.FC<BankingTreasuryModuleRunnerProps> = (props) => {
  return (
    <BankingTreasuryProvider>
      <BankingTreasuryContentRunner {...props} />
    </BankingTreasuryProvider>
  );
};

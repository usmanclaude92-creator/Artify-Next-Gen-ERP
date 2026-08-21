import React from 'react';
import {
  ERPModule,
  ERPFunctionalArea,
  ERPProcess,
  ERPTransaction,
  ERPRouteState,
  ERPUserRole
} from '../../types/erp';
import { BankingTreasuryProvider } from './services/bankingTreasuryStore';
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
  LayoutDashboard
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

export const BankingTreasuryModuleRunner: React.FC<BankingTreasuryModuleRunnerProps> = ({
  module,
  functionalArea,
  process,
  transaction,
  onNavigate,
  isFavorite,
  onToggleFavorite,
  activeRole
}) => {
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
        return <BankManagementView />;
      case 'cash-management':
        return <CashManagementView />;
      case 'payment-management':
        return <PaymentManagementView />;
      case 'receipt-management':
        return <ReceiptManagementView />;
      case 'bank-reconciliation':
        return <BankReconciliationView />;
      case 'petty-cash':
        return <PettyCashView />;
      case 'treasury-mgmt':
        return <TreasuryManagementView />;
      default:
        return <BankingTreasuryDashboardView onNavigateToSubView={handleAreaNavigate} />;
    }
  };

  return (
    <BankingTreasuryProvider>
      <div className="space-y-6 pb-12">
        {/* Module Header Bar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {functionalArea && (
                <button
                  onClick={() => onNavigate({ view: 'module', moduleId: 'banking-treasury' })}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
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
                  <h1 className="text-lg font-bold text-slate-900">
                    {functionalArea ? functionalArea.name : '04 — Banking & Treasury Management'}
                  </h1>
                  <button
                    onClick={onToggleFavorite}
                    className="text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  {functionalArea
                    ? functionalArea.description
                    : 'Institutional banking, cash vaults, multi-tier electronic payments, automated MT940 reconciliation, imprest petty cash, and 13-week cash flow modeling'}
                </p>
              </div>
            </div>

            {/* Sub-module Navigation Dropdown / Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onNavigate({ view: 'module', moduleId: 'banking-treasury' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  !functionalArea ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
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
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
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

        {/* Dynamic Sub-view */}
        {renderActiveSubView()}
      </div>
    </BankingTreasuryProvider>
  );
};

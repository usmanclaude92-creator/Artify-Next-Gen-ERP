import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Bell,
  CheckCircle2,
  ListTodo,
  Star,
  HelpCircle,
  Building2,
  MapPin,
  Calendar,
  ShieldCheck,
  ChevronDown,
  User,
  Sliders,
  ExternalLink,
  Lock,
  Layers
} from 'lucide-react';
import { ERPRouteState, ERPUserRole, ERPNotification } from '../../types/erp';
import { ENTERPRISE_COMPANIES, ENTERPRISE_BRANCHES, MOCK_USER_ROLES, MOCK_SYSTEM_NOTIFICATIONS } from '../../navigation/erpHierarchy';

interface TopBarProps {
  currentRoute: ERPRouteState;
  onNavigate: (route: ERPRouteState) => void;
  onOpenSearch: () => void;
  selectedCompanyId: string;
  onSelectCompany: (id: string) => void;
  selectedBranchId: string;
  onSelectBranch: (id: string) => void;
  activeRole: ERPUserRole;
  onSelectRole: (role: ERPUserRole) => void;
  favoritesCount: number;
  onOpenPermissionsModal: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onNavigate,
  onOpenSearch,
  selectedCompanyId,
  onSelectCompany,
  selectedBranchId,
  onSelectBranch,
  activeRole,
  onSelectRole,
  favoritesCount,
  onOpenPermissionsModal
}) => {
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isApprovalsOpen, setIsApprovalsOpen] = useState(false);
  const [notifications, setNotifications] = useState<ERPNotification[]>(MOCK_SYSTEM_NOTIFICATIONS);

  const activeCompany = ENTERPRISE_COMPANIES.find(c => c.id === selectedCompanyId) || ENTERPRISE_COMPANIES[0];
  const activeBranch = ENTERPRISE_BRANCHES.find(b => b.id === selectedBranchId) || ENTERPRISE_BRANCHES[0];

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-30 px-4 flex items-center justify-between gap-3 select-none">
      {/* Left Section: Company & Branch Selectors + Fiscal Period Indicator */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Company Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setIsCompanyDropdownOpen(!isCompanyDropdownOpen);
              setIsBranchDropdownOpen(false);
              setIsNotificationsOpen(false);
              setIsUserDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/70 hover:bg-slate-100 transition-all text-xs font-semibold text-slate-800"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="max-w-[120px] sm:max-w-[160px] truncate">{activeCompany.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isCompanyDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                Operating Entities & Subsidiaries
              </div>
              <div className="mt-1 space-y-0.5">
                {ENTERPRISE_COMPANIES.map(company => (
                  <button
                    key={company.id}
                    onClick={() => {
                      onSelectCompany(company.id);
                      setIsCompanyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                      company.id === selectedCompanyId
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <p className="truncate font-medium">{company.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {company.country} • Currency: {company.currency}
                      </p>
                    </div>
                    <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                      {company.code}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Branch Selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => {
              setIsBranchDropdownOpen(!isBranchDropdownOpen);
              setIsCompanyDropdownOpen(false);
              setIsNotificationsOpen(false);
              setIsUserDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/70 hover:bg-slate-100 transition-all text-xs text-slate-700 font-medium"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="max-w-[130px] truncate">{activeBranch.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isBranchDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                Operating Site & Branch
              </div>
              <div className="mt-1 space-y-0.5">
                {ENTERPRISE_BRANCHES.map(branch => (
                  <button
                    key={branch.id}
                    onClick={() => {
                      onSelectBranch(branch.id);
                      setIsBranchDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                      branch.id === selectedBranchId
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="truncate">{branch.name}</span>
                    <span className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded text-slate-500">
                      {branch.code}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fiscal Period & Status Pills */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/80 border border-slate-200/80 rounded-md text-[11px] font-medium text-slate-700">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span>{activeCompany.fiscalPeriod}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/80 rounded-md text-[11px] font-medium text-emerald-700">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Phase 1 Architecture Active</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Global Search Trigger */}
      <div className="flex-1 max-w-lg mx-2">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-xs text-slate-500 transition-all shadow-2xs"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">Search 17 Modules, Vouchers, Reports...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-white border border-slate-200 rounded">
            ⌘K / Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Section: AI Button, Approvals, Tasks, Notifications, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* AI Command Center Launcher */}
        <button
          onClick={() => onNavigate({ view: 'ai' })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
          <span className="hidden sm:inline">AI Command</span>
        </button>

        {/* Approvals Quick Button */}
        <div className="relative">
          <button
            onClick={() => {
              setIsApprovalsOpen(!isApprovalsOpen);
              setIsNotificationsOpen(false);
              setIsUserDropdownOpen(false);
              setIsCompanyDropdownOpen(false);
            }}
            title="Pending Approvals"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500"></span>
          </button>

          {isApprovalsOpen && (
            <div className="absolute right-0 mt-1.5 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-40 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  Executive Approval Queue
                </span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                  2 Pending
                </span>
              </div>
              <div className="mt-2 space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Payment Run #PR-2026-088</span>
                    <span className="text-emerald-600 font-mono">OMR 142,500</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Banking & Treasury • Dual CFO Signature Required</p>
                  <div className="mt-2 flex gap-1.5">
                    <button
                      onClick={() => {
                        onNavigate({ view: 'transaction', moduleId: 'banking-treasury', functionalAreaId: 'payment-management', processId: 'payment-proc', transactionId: 'tx-payment-approvals' });
                        setIsApprovalsOpen(false);
                      }}
                      className="px-2 py-1 bg-indigo-600 text-white rounded text-[11px] font-medium hover:bg-indigo-700"
                    >
                      View Approval
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Subcontract Variation #VO-04</span>
                    <span className="text-emerald-600 font-mono">OMR 38,000</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Construction • Muscat Marina Tower</p>
                  <div className="mt-2 flex gap-1.5">
                    <button
                      onClick={() => {
                        onNavigate({ view: 'transaction', moduleId: 'construction', functionalAreaId: 'variations-claims', processId: 'claims-proc', transactionId: 'tx-variations' });
                        setIsApprovalsOpen(false);
                      }}
                      className="px-2 py-1 bg-indigo-600 text-white rounded text-[11px] font-medium hover:bg-indigo-700"
                    >
                      View Approval
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsApprovalsOpen(false);
              setIsUserDropdownOpen(false);
              setIsCompanyDropdownOpen(false);
            }}
            title="Notifications"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-1.5 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-40 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-slate-900">System Notifications</span>
                  {unreadNotifCount > 0 && (
                    <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">
                      {unreadNotifCount} New
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllRead}
                  className="text-[11px] text-indigo-600 hover:underline font-medium"
                >
                  Mark all read
                </button>
              </div>

              <div className="mt-2 divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`py-2 px-1 text-xs flex gap-2.5 items-start ${
                      !notif.read ? 'bg-indigo-50/30' : ''
                    }`}
                  >
                    <span
                      className={`w-2 h-2 mt-1 rounded-full shrink-0 ${
                        notif.priority === 'high'
                          ? 'bg-rose-500'
                          : notif.priority === 'medium'
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                      }`}
                    ></span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 text-xs">{notif.title}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">{notif.message}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                        <span>{notif.moduleRef}</span>
                        <span>{notif.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Role Switcher & Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setIsUserDropdownOpen(!isUserDropdownOpen);
              setIsNotificationsOpen(false);
              setIsApprovalsOpen(false);
              setIsCompanyDropdownOpen(false);
            }}
            className="flex items-center gap-2 p-1 pl-2 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-xs"
          >
            <div className="w-6 h-6 rounded-md bg-indigo-600 text-white font-bold text-[11px] flex items-center justify-center">
              {activeRole.avatar}
            </div>
            <div className="text-left hidden xl:block">
              <p className="font-semibold text-slate-800 text-xs leading-none">{activeRole.name}</p>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">{activeRole.title}</p>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-40 animate-in fade-in zoom-in-95">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                <p className="font-bold text-xs text-slate-900">{activeRole.name}</p>
                <p className="text-xs text-slate-600">{activeRole.title}</p>
                <p className="text-[10px] text-indigo-600 font-medium mt-1">Department: {activeRole.department}</p>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100">
                <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Switch Executive Role (Simulate Persona)
                </p>
                <div className="space-y-0.5">
                  {MOCK_USER_ROLES.map(role => (
                    <button
                      key={role.id}
                      onClick={() => {
                        onSelectRole(role);
                        setIsUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs transition-colors ${
                        role.id === activeRole.id
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="w-5 h-5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                        {role.avatar}
                      </span>
                      <div className="truncate">
                        <p className="font-medium truncate">{role.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{role.title}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-1">
                <button
                  onClick={() => {
                    onOpenPermissionsModal();
                    setIsUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-xs text-slate-700 flex items-center gap-2 font-medium"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Inspect Enterprise Permission Matrix</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

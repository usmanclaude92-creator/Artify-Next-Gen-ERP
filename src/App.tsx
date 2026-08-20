/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ERPRouteState,
  ERPUserRole,
  FavoriteItem,
  RecentItem
} from './types/erp';
import {
  ERP_MODULES,
  findModuleById,
  findFunctionalAreaById,
  findProcessById,
  findTransactionById,
  getBreadcrumbs,
  ENTERPRISE_COMPANIES,
  ENTERPRISE_BRANCHES,
  MOCK_USER_ROLES
} from './navigation/erpHierarchy';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { Breadcrumbs } from './components/navigation/Breadcrumbs';
import { GlobalSearchModal } from './components/navigation/GlobalSearchModal';
import { PermissionsModal } from './components/modals/PermissionsModal';
import { DashboardView } from './components/pages/DashboardView';
import { AICommandCenterView } from './components/pages/AICommandCenterView';
import { ModuleLandingView } from './components/pages/ModuleLandingView';
import { FunctionalAreaView } from './components/pages/FunctionalAreaView';
import { ProcessView } from './components/pages/ProcessView';
import { PlaceholderPageView } from './components/pages/PlaceholderPageView';
import { SystemManagementModuleRunner } from './modules/system-management/SystemManagementModuleRunner';
import { BusinessIntelligenceModuleRunner } from './modules/business-intelligence/BusinessIntelligenceModuleRunner';
import { AdministrationModuleRunner } from './modules/administration/AdministrationModuleRunner';

export default function App() {
  const [routeState, setRouteState] = useState<ERPRouteState>({ view: 'dashboard' });
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(ENTERPRISE_COMPANIES[0].id);
  const [selectedBranchId, setSelectedBranchId] = useState<string>(ENTERPRISE_BRANCHES[0].id);
  const [activeRole, setActiveRole] = useState<ERPUserRole>(MOCK_USER_ROLES[0]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState<boolean>(false);

  // Favorites state
  const [favorites, setFavorites] = useState<FavoriteItem[]>([
    {
      id: 'fav-1',
      title: 'Module 16 — Financial Accounting',
      subtitle: 'GL, Period Close, Multi-Company Consolidation',
      route: { view: 'module', moduleId: 'financial-accounting' },
      type: 'module',
      addedAt: '2026-08-20'
    },
    {
      id: 'fav-2',
      title: '15.02 IPC Certification & Subcontracts',
      subtitle: 'Construction & EPC Project Operations',
      route: { view: 'functional_area', moduleId: 'construction', functionalAreaId: 'ipc-management' },
      type: 'functional_area',
      addedAt: '2026-08-20'
    },
    {
      id: 'fav-3',
      title: '04.01 Bank Reconciliation & Dual Signoff',
      subtitle: 'Banking & Treasury Management',
      route: { view: 'functional_area', moduleId: 'banking-treasury', functionalAreaId: 'bank-reconciliation' },
      type: 'functional_area',
      addedAt: '2026-08-20'
    }
  ]);

  // Recents state
  const [recents, setRecents] = useState<RecentItem[]>([]);

  // Register recent item on route change
  const navigateTo = (newRoute: ERPRouteState) => {
    setRouteState(newRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track recents
    if (newRoute.view === 'module' && newRoute.moduleId) {
      const mod = findModuleById(newRoute.moduleId);
      if (mod) {
        addRecentItem({
          id: `rec-${mod.id}`,
          title: `${mod.code} — ${mod.name}`,
          subtitle: 'Module Level-1',
          route: newRoute,
          timestamp: 'Just now'
        });
      }
    } else if (newRoute.view === 'functional_area' && newRoute.moduleId && newRoute.functionalAreaId) {
      const fa = findFunctionalAreaById(newRoute.moduleId, newRoute.functionalAreaId);
      if (fa) {
        addRecentItem({
          id: `rec-${fa.id}`,
          title: `${fa.code} ${fa.name}`,
          subtitle: 'Functional Area Level-2',
          route: newRoute,
          timestamp: 'Just now'
        });
      }
    } else if (newRoute.view === 'process' && newRoute.moduleId && newRoute.functionalAreaId && newRoute.processId) {
      const proc = findProcessById(newRoute.moduleId, newRoute.functionalAreaId, newRoute.processId);
      if (proc) {
        addRecentItem({
          id: `rec-${proc.id}`,
          title: `${proc.code} ${proc.name}`,
          subtitle: 'Process Level-3',
          route: newRoute,
          timestamp: 'Just now'
        });
      }
    } else if (newRoute.view === 'transaction' && newRoute.moduleId && newRoute.functionalAreaId && newRoute.processId && newRoute.transactionId) {
      const tx = findTransactionById(newRoute.moduleId, newRoute.functionalAreaId, newRoute.processId, newRoute.transactionId);
      if (tx) {
        addRecentItem({
          id: `rec-${tx.id}`,
          title: `${tx.code} — ${tx.name}`,
          subtitle: 'Transaction Level-4',
          route: newRoute,
          timestamp: 'Just now'
        });
      }
    }
  };

  const addRecentItem = (item: RecentItem) => {
    setRecents(prev => {
      const filtered = prev.filter(r => r.id !== item.id);
      return [item, ...filtered].slice(0, 10);
    });
  };

  const toggleFavorite = (favItem: Omit<FavoriteItem, 'addedAt'>) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === favItem.id);
      if (exists) {
        return prev.filter(f => f.id !== favItem.id);
      } else {
        return [{ ...favItem, addedAt: new Date().toISOString().split('T')[0] }, ...prev];
      }
    });
  };

  // Keyboard shortcut listener for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const breadcrumbs = getBreadcrumbs(routeState);

  // Resolve current active entities
  const activeModule = findModuleById(routeState.moduleId);
  const activeFA = findFunctionalAreaById(routeState.moduleId, routeState.functionalAreaId);
  const activeProcess = findProcessById(routeState.moduleId, routeState.functionalAreaId, routeState.processId);
  const activeTransaction = findTransactionById(
    routeState.moduleId,
    routeState.functionalAreaId,
    routeState.processId,
    routeState.transactionId
  );

  const isCurrentModuleFavorited = activeModule
    ? favorites.some(f => f.id === `fav-mod-${activeModule.id}`)
    : false;

  const isCurrentFaFavorited = activeFA
    ? favorites.some(f => f.id === `fav-fa-${activeFA.id}`)
    : false;

  const isCurrentProcessFavorited = activeProcess
    ? favorites.some(f => f.id === `fav-proc-${activeProcess.id}`)
    : false;

  const isCurrentTxFavorited = activeTransaction
    ? favorites.some(f => f.id === `fav-tx-${activeTransaction.id}`)
    : false;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Collapsible Left Navigation Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        currentRoute={routeState}
        onNavigate={navigateTo}
        favorites={favorites}
        recents={recents}
        onOpenPermissionsModal={() => setIsPermissionsModalOpen(true)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Enterprise Top Navigation Bar */}
        <TopBar
          currentRoute={routeState}
          onNavigate={navigateTo}
          onOpenSearch={() => setIsSearchModalOpen(true)}
          selectedCompanyId={selectedCompanyId}
          onSelectCompany={setSelectedCompanyId}
          selectedBranchId={selectedBranchId}
          onSelectBranch={setSelectedBranchId}
          activeRole={activeRole}
          onSelectRole={setActiveRole}
          favoritesCount={favorites.length}
          onOpenPermissionsModal={() => setIsPermissionsModalOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Breadcrumb Navigation Strip */}
        <div className="bg-white border-b border-slate-200 px-6 py-2">
          <Breadcrumbs items={breadcrumbs} onNavigate={navigateTo} />
        </div>

        {/* Dynamic Viewport Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* View 1: Executive Dashboard */}
            {routeState.view === 'dashboard' && (
              <DashboardView
                onNavigate={navigateTo}
                activeRole={activeRole}
                selectedCompanyId={selectedCompanyId}
              />
            )}

            {/* View 2: AI Command Center */}
            {routeState.view === 'ai' && (
              <AICommandCenterView onNavigate={navigateTo} />
            )}

            {/* View 3: Level-1 Module Landing */}
            {routeState.view === 'module' && activeModule && (
              activeModule.id === 'system-management' ? (
                <SystemManagementModuleRunner
                  module={activeModule}
                  onNavigate={navigateTo}
                  isFavorite={isCurrentModuleFavorited}
                  onToggleFavorite={() =>
                    toggleFavorite({
                      id: `fav-mod-${activeModule.id}`,
                      title: `${activeModule.code} — ${activeModule.name}`,
                      subtitle: activeModule.category,
                      route: { view: 'module', moduleId: activeModule.id },
                      type: 'module'
                    })
                  }
                  activeRole={activeRole}
                />
              ) : activeModule.id === 'business-intelligence' ? (
                <BusinessIntelligenceModuleRunner
                  module={activeModule}
                  onNavigate={navigateTo}
                  isFavorite={isCurrentModuleFavorited}
                  onToggleFavorite={() =>
                    toggleFavorite({
                      id: `fav-mod-${activeModule.id}`,
                      title: `${activeModule.code} — ${activeModule.name}`,
                      subtitle: activeModule.category,
                      route: { view: 'module', moduleId: activeModule.id },
                      type: 'module'
                    })
                  }
                  activeRole={activeRole}
                />
              ) : activeModule.id === 'administration' ? (
                <AdministrationModuleRunner
                  module={activeModule}
                  onNavigate={navigateTo}
                  isFavorite={isCurrentModuleFavorited}
                  onToggleFavorite={() =>
                    toggleFavorite({
                      id: `fav-mod-${activeModule.id}`,
                      title: `${activeModule.code} — ${activeModule.name}`,
                      subtitle: activeModule.category,
                      route: { view: 'module', moduleId: activeModule.id },
                      type: 'module'
                    })
                  }
                  activeRole={activeRole}
                />
              ) : (
                <ModuleLandingView
                  module={activeModule}
                  onNavigate={navigateTo}
                  isFavorite={isCurrentModuleFavorited}
                  onToggleFavorite={() =>
                    toggleFavorite({
                      id: `fav-mod-${activeModule.id}`,
                      title: `${activeModule.code} — ${activeModule.name}`,
                      subtitle: activeModule.category,
                      route: { view: 'module', moduleId: activeModule.id },
                      type: 'module'
                    })
                  }
                />
              )
            )}

            {/* View 4: Level-2 Functional Area View */}
            {routeState.view === 'functional_area' && activeModule && activeFA && (
              activeModule.id === 'system-management' ? (
                <SystemManagementModuleRunner
                  module={activeModule}
                  functionalArea={activeFA}
                  onNavigate={navigateTo}
                  isFavorite={isCurrentFaFavorited}
                  onToggleFavorite={() =>
                    toggleFavorite({
                      id: `fav-fa-${activeFA.id}`,
                      title: `${activeFA.code} ${activeFA.name}`,
                      subtitle: activeModule.shortName,
                      route: {
                        view: 'functional_area',
                        moduleId: activeModule.id,
                        functionalAreaId: activeFA.id
                      },
                      type: 'functional_area'
                    })
                  }
                  activeRole={activeRole}
                />
              ) : activeModule.id === 'business-intelligence' ? (
                <BusinessIntelligenceModuleRunner
                  module={activeModule}
                  functionalArea={activeFA}
                  onNavigate={navigateTo}
                  isFavorite={isCurrentFaFavorited}
                  onToggleFavorite={() =>
                    toggleFavorite({
                      id: `fav-fa-${activeFA.id}`,
                      title: `${activeFA.code} ${activeFA.name}`,
                      subtitle: activeModule.shortName,
                      route: {
                        view: 'functional_area',
                        moduleId: activeModule.id,
                        functionalAreaId: activeFA.id
                      },
                      type: 'functional_area'
                    })
                  }
                  activeRole={activeRole}
                />
              ) : activeModule.id === 'administration' ? (
                <AdministrationModuleRunner
                  module={activeModule}
                  functionalArea={activeFA}
                  onNavigate={navigateTo}
                  isFavorite={isCurrentFaFavorited}
                  onToggleFavorite={() =>
                    toggleFavorite({
                      id: `fav-fa-${activeFA.id}`,
                      title: `${activeFA.code} ${activeFA.name}`,
                      subtitle: activeModule.shortName,
                      route: {
                        view: 'functional_area',
                        moduleId: activeModule.id,
                        functionalAreaId: activeFA.id
                      },
                      type: 'functional_area'
                    })
                  }
                  activeRole={activeRole}
                />
              ) : (
                <FunctionalAreaView
                  module={activeModule}
                  functionalArea={activeFA}
                  onNavigate={navigateTo}
                  isFavorite={isCurrentFaFavorited}
                  onToggleFavorite={() =>
                    toggleFavorite({
                      id: `fav-fa-${activeFA.id}`,
                      title: `${activeFA.code} ${activeFA.name}`,
                      subtitle: activeModule.shortName,
                      route: {
                        view: 'functional_area',
                        moduleId: activeModule.id,
                        functionalAreaId: activeFA.id
                      },
                      type: 'functional_area'
                    })
                  }
                />
              )
            )}

            {/* View 5: Level-3 Process View */}
            {routeState.view === 'process' && activeModule && activeFA && activeProcess && (
              activeModule.id === 'system-management' ? (
                <SystemManagementModuleRunner
                  module={activeModule}
                  functionalArea={activeFA}
                  process={activeProcess}
                  onNavigate={navigateTo}
                  isFavorite={isCurrentProcessFavorited}
                  onToggleFavorite={() =>
                    toggleFavorite({
                      id: `fav-proc-${activeProcess.id}`,
                      title: `${activeProcess.code} ${activeProcess.name}`,
                      subtitle: `${activeModule.shortName} › ${activeFA.name}`,
                      route: {
                        view: 'process',
                        moduleId: activeModule.id,
                        functionalAreaId: activeFA.id,
                        processId: activeProcess.id
                      },
                      type: 'process'
                    })
                  }
                  activeRole={activeRole}
                />
              ) : activeModule.id === 'business-intelligence' ? (
                <BusinessIntelligenceModuleRunner
                  module={activeModule}
                  functionalArea={activeFA}
                  process={activeProcess}
                  onNavigate={navigateTo}
                  isFavorite={isCurrentProcessFavorited}
                  onToggleFavorite={() =>
                    toggleFavorite({
                      id: `fav-proc-${activeProcess.id}`,
                      title: `${activeProcess.code} ${activeProcess.name}`,
                      subtitle: `${activeModule.shortName} › ${activeFA.name}`,
                      route: {
                        view: 'process',
                        moduleId: activeModule.id,
                        functionalAreaId: activeFA.id,
                        processId: activeProcess.id
                      },
                      type: 'process'
                    })
                  }
                  activeRole={activeRole}
                />
              ) : activeModule.id === 'administration' ? (
                <AdministrationModuleRunner
                  module={activeModule}
                  functionalArea={activeFA}
                  process={activeProcess}
                  onNavigate={navigateTo}
                  isFavorite={isCurrentProcessFavorited}
                  onToggleFavorite={() =>
                    toggleFavorite({
                      id: `fav-proc-${activeProcess.id}`,
                      title: `${activeProcess.code} ${activeProcess.name}`,
                      subtitle: `${activeModule.shortName} › ${activeFA.name}`,
                      route: {
                        view: 'process',
                        moduleId: activeModule.id,
                        functionalAreaId: activeFA.id,
                        processId: activeProcess.id
                      },
                      type: 'process'
                    })
                  }
                  activeRole={activeRole}
                />
              ) : (
                <ProcessView
                  module={activeModule}
                  functionalArea={activeFA}
                  process={activeProcess}
                  onNavigate={navigateTo}
                  isFavorite={isCurrentProcessFavorited}
                  onToggleFavorite={() =>
                    toggleFavorite({
                      id: `fav-proc-${activeProcess.id}`,
                      title: `${activeProcess.code} ${activeProcess.name}`,
                      subtitle: `${activeModule.shortName} › ${activeFA.name}`,
                      route: {
                        view: 'process',
                        moduleId: activeModule.id,
                        functionalAreaId: activeFA.id,
                        processId: activeProcess.id
                      },
                      type: 'process'
                    })
                  }
                />
              )
            )}

            {/* View 6: Level-4 Transaction Screen */}
            {routeState.view === 'transaction' && activeModule && activeFA && activeProcess && activeTransaction && (
              activeModule.id === 'system-management' ? (
                <SystemManagementModuleRunner
                  module={activeModule}
                  functionalArea={activeFA}
                  process={activeProcess}
                  transaction={activeTransaction}
                  onNavigate={navigateTo}
                  isFavorite={isCurrentTxFavorited}
                  onToggleFavorite={() =>
                    toggleFavorite({
                      id: `fav-tx-${activeTransaction.id}`,
                      title: `${activeTransaction.code} — ${activeTransaction.name}`,
                      subtitle: `${activeModule.shortName} › ${activeProcess.name}`,
                      route: {
                        view: 'transaction',
                        moduleId: activeModule.id,
                        functionalAreaId: activeFA.id,
                        processId: activeProcess.id,
                        transactionId: activeTransaction.id
                      },
                      type: 'transaction'
                    })
                  }
                  activeRole={activeRole}
                />
              ) : activeModule.id === 'business-intelligence' ? (
                <BusinessIntelligenceModuleRunner
                  module={activeModule}
                  functionalArea={activeFA}
                  process={activeProcess}
                  transaction={activeTransaction}
                  onNavigate={navigateTo}
                  isFavorite={isCurrentTxFavorited}
                  onToggleFavorite={() =>
                    toggleFavorite({
                      id: `fav-tx-${activeTransaction.id}`,
                      title: `${activeTransaction.code} — ${activeTransaction.name}`,
                      subtitle: `${activeModule.shortName} › ${activeProcess.name}`,
                      route: {
                        view: 'transaction',
                        moduleId: activeModule.id,
                        functionalAreaId: activeFA.id,
                        processId: activeProcess.id,
                        transactionId: activeTransaction.id
                      },
                      type: 'transaction'
                    })
                  }
                  activeRole={activeRole}
                />
              ) : activeModule.id === 'administration' ? (
                <AdministrationModuleRunner
                  module={activeModule}
                  functionalArea={activeFA}
                  process={activeProcess}
                  transaction={activeTransaction}
                  onNavigate={navigateTo}
                  isFavorite={isCurrentTxFavorited}
                  onToggleFavorite={() =>
                    toggleFavorite({
                      id: `fav-tx-${activeTransaction.id}`,
                      title: `${activeTransaction.code} — ${activeTransaction.name}`,
                      subtitle: `${activeModule.shortName} › ${activeProcess.name}`,
                      route: {
                        view: 'transaction',
                        moduleId: activeModule.id,
                        functionalAreaId: activeFA.id,
                        processId: activeProcess.id,
                        transactionId: activeTransaction.id
                      },
                      type: 'transaction'
                    })
                  }
                  activeRole={activeRole}
                />
              ) : (
                <PlaceholderPageView
                  module={activeModule}
                  functionalArea={activeFA}
                  process={activeProcess}
                  transaction={activeTransaction}
                  onNavigate={navigateTo}
                  isFavorite={isCurrentTxFavorited}
                  onToggleFavorite={() =>
                    toggleFavorite({
                      id: `fav-tx-${activeTransaction.id}`,
                      title: `${activeTransaction.code} — ${activeTransaction.name}`,
                      subtitle: `${activeModule.shortName} › ${activeProcess.name}`,
                      route: {
                        view: 'transaction',
                        moduleId: activeModule.id,
                        functionalAreaId: activeFA.id,
                        processId: activeProcess.id,
                        transactionId: activeTransaction.id
                      },
                      type: 'transaction'
                    })
                  }
                  activeRole={activeRole}
                />
              )
            )}
          </div>
        </main>
      </div>

      {/* Global Search Modal (⌘K / Ctrl+K) */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onNavigate={navigateTo}
      />

      {/* Enterprise Permissions & RBAC Inspector Modal */}
      <PermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        activeRole={activeRole}
        onSelectRole={setActiveRole}
      />
    </div>
  );
}

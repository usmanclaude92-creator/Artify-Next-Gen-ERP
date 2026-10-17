import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  Sparkles,
  Star,
  Clock,
  ChevronRight,
  ChevronDown,
  Search,
  PanelLeftClose,
  PanelLeft,
  Settings,
  Shield,
  Layers,
  CheckCircle2,
  Lock,
  ExternalLink,
  HelpCircle,
  Cpu
} from 'lucide-react';
import { ERP_MODULES } from '../../navigation/erpHierarchy';
import { ERPRouteState, FavoriteItem, RecentItem } from '../../types/erp';
import { IconRenderer } from '../common/IconRenderer';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  currentRoute: ERPRouteState;
  onNavigate: (route: ERPRouteState) => void;
  favorites: FavoriteItem[];
  recents: RecentItem[];
  onOpenPermissionsModal: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  currentRoute,
  onNavigate,
  favorites,
  recents,
  onOpenPermissionsModal,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    [currentRoute.moduleId || '']: true
  });
  const [filterQuery, setFilterQuery] = useState('');
  const [activeSection, setActiveSection] = useState<'all' | 'favorites' | 'recents'>('all');
  const moduleScrollRef = useRef<HTMLDivElement>(null);

  // Keep only the current active module expanded (collapsing others) and revealed in viewport
  useEffect(() => {
    if (currentRoute.moduleId) {
      setExpandedModules({
        [currentRoute.moduleId]: true
      });

      if (!isCollapsed) {
        const timer = setTimeout(() => {
          const activeEl = document.getElementById(`nav-module-${currentRoute.moduleId}`);
          if (activeEl && moduleScrollRef.current) {
            const container = moduleScrollRef.current;
            const containerRect = container.getBoundingClientRect();
            const activeRect = activeEl.getBoundingClientRect();

            if (activeRect.top < containerRect.top || activeRect.bottom > containerRect.bottom) {
              activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }
        }, 120);
        return () => clearTimeout(timer);
      }
    }
  }, [currentRoute.moduleId, currentRoute.functionalAreaId, isCollapsed]);

  const toggleModuleExpand = (modId: string) => {
    setExpandedModules(prev => {
      // Accordion mode: If clicked module is already expanded, collapse it.
      // Otherwise, expand ONLY this module and collapse all other modules.
      if (prev[modId]) {
        return {};
      }
      return { [modId]: true };
    });
  };

  const filteredModules = ERP_MODULES.filter(mod => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      (mod.name || '').toLowerCase().includes(q) ||
      (mod.code || '').toLowerCase().includes(q) ||
      (mod.functionalAreas || []).some(fa =>
        (fa.name || '').toLowerCase().includes(q) ||
        (fa.code || '').toLowerCase().includes(q) ||
        (fa.processes || []).some(p => (p.name || '').toLowerCase().includes(q) || (p.code || '').toLowerCase().includes(q))
      )
    );
  });

  return (
    <aside
      id="app-sidebar"
      aria-label="Primary navigation"
      className={`bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 transition-all duration-200 z-50 lg:z-40 select-none h-screen w-72 max-w-[85vw] fixed inset-y-0 left-0 lg:sticky lg:top-0 lg:translate-x-0 overflow-hidden ${
        isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      } ${isCollapsed ? 'lg:w-18' : 'lg:w-72'}`}
    >
      {/* 1. FIXED TOP HEADER */}
      <div className="h-16 shrink-0 border-b border-slate-800/80 px-4 flex items-center justify-between">
        {!isCollapsed && (
          <div
            onClick={() => onNavigate({ view: 'dashboard' })}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              A
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-white">ARTIFY</span>
                <span className="text-[10px] font-mono font-bold bg-indigo-500/30 text-indigo-300 px-1 py-0.2 rounded border border-indigo-400/30">
                  AFE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Artify Financial Ecosystem</p>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div
            onClick={() => onNavigate({ view: 'dashboard' })}
            className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-extrabold text-base cursor-pointer shadow-md shadow-indigo-500/20"
          >
            A
          </div>
        )}

        <button
          onClick={() => (isMobileOpen && onCloseMobile ? onCloseMobile() : onToggleCollapse())}
          title={isCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
          className={`p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer ${
            isCollapsed ? 'hidden' : 'block'
          }`}
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* 2. FIXED NAVIGATION / QUICK ACCESS AREA */}
      <div className="shrink-0 border-b border-slate-800/60 bg-slate-900">
        {/* Navigation Search (Expanded Only) */}
        {!isCollapsed && (
          <div className="p-3 pb-2 border-b border-slate-800/50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filter 17 modules..."
                value={filterQuery}
                onChange={e => setFilterQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60"
              />
            </div>
          </div>
        )}

        {/* Core Quick Links (Home, AI, Favorites, Recents) */}
        <div className="p-2 space-y-1">
          <button
            onClick={() => onNavigate({ view: 'dashboard' })}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentRoute.view === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Executive Dashboard</span>}
          </button>

          <button
            onClick={() => onNavigate({ view: 'ai' })}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentRoute.view === 'ai'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            {!isCollapsed && (
              <div className="flex items-center justify-between w-full">
                <span>AI Command Center</span>
                <span className="text-[9px] font-bold bg-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-400/30">
                  PROMPT
                </span>
              </div>
            )}
          </button>

          {/* Favorites Section Switcher (Expanded) */}
          {!isCollapsed && (
            <div className="flex items-center gap-1 pt-1">
              <button
                onClick={() => setActiveSection(activeSection === 'favorites' ? 'all' : 'favorites')}
                className={`flex-1 flex items-center justify-between px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  activeSection === 'favorites'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400/30" />
                  <span>Favorites</span>
                </span>
                <span className="text-[10px] font-mono bg-slate-800 px-1 py-0.2 rounded text-slate-300">
                  {favorites.length}
                </span>
              </button>

              <button
                onClick={() => setActiveSection(activeSection === 'recents' ? 'all' : 'recents')}
                className={`flex-1 flex items-center justify-between px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  activeSection === 'recents'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-blue-400" />
                  <span>Recent</span>
                </span>
                <span className="text-[10px] font-mono bg-slate-800 px-1 py-0.2 rounded text-slate-300">
                  {recents.length}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Fixed Section Heading Above Scrollable Module List */}
        {!isCollapsed && activeSection === 'all' && (
          <div className="px-3 py-1.5 bg-slate-950/40 border-t border-slate-800/40 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-indigo-400" />
              <span>AFE Architecture (17 Modules)</span>
            </span>
            <span className="font-mono text-[9px] bg-slate-800 px-1 py-0.2 rounded text-slate-400">
              L1 to L4
            </span>
          </div>
        )}

        {!isCollapsed && activeSection === 'favorites' && (
          <div className="px-3 py-1.5 bg-slate-950/40 border-t border-slate-800/40 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-amber-400">
            <span className="flex items-center gap-1.5">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400/30" />
              <span>Pinned Favorites ({favorites.length})</span>
            </span>
            <button
              onClick={() => setActiveSection('all')}
              className="text-[10px] text-slate-400 hover:text-white font-medium cursor-pointer"
            >
              Show All
            </button>
          </div>
        )}

        {!isCollapsed && activeSection === 'recents' && (
          <div className="px-3 py-1.5 bg-slate-950/40 border-t border-slate-800/40 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-blue-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-blue-400" />
              <span>Recently Visited ({recents.length})</span>
            </span>
            <button
              onClick={() => setActiveSection('all')}
              className="text-[10px] text-slate-400 hover:text-white font-medium cursor-pointer"
            >
              Show All
            </button>
          </div>
        )}
      </div>

      {/* 3. INDEPENDENT ERP MODULE SCROLL AREA */}
      <div
        id="erp-module-scroll-container"
        ref={moduleScrollRef}
        className="flex-1 min-h-0 erp-module-scroll-area px-2 py-2 space-y-1.5 overscroll-contain"
      >
        {/* Favorites View Mode */}
        {activeSection === 'favorites' && !isCollapsed && (
          <div className="space-y-1 animate-in fade-in">
            {favorites.length === 0 ? (
              <p className="text-xs text-slate-500 px-2 py-4 text-center italic">
                No favorites pinned yet. Click the star icon on any module, area, or voucher.
              </p>
            ) : (
              favorites.map(fav => (
                <button
                  key={fav.id}
                  onClick={() => onNavigate(fav.route)}
                  className="w-full text-left p-2 rounded-lg bg-slate-950/40 hover:bg-slate-800 border border-slate-800/80 text-xs flex items-center justify-between group transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-200 truncate group-hover:text-amber-300">
                      {fav.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{fav.subtitle}</p>
                  </div>
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/40 shrink-0" />
                </button>
              ))
            )}
          </div>
        )}

        {/* Recents View Mode */}
        {activeSection === 'recents' && !isCollapsed && (
          <div className="space-y-1 animate-in fade-in">
            {recents.length === 0 ? (
              <p className="text-xs text-slate-500 px-2 py-4 text-center italic">
                Navigate to any module to log recent activities.
              </p>
            ) : (
              recents.map((rec, idx) => (
                <button
                  key={`${rec.id}-${idx}`}
                  onClick={() => onNavigate(rec.route)}
                  className="w-full text-left p-2 rounded-lg bg-slate-950/40 hover:bg-slate-800 border border-slate-800/80 text-xs flex items-center justify-between group transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-200 truncate group-hover:text-blue-300">
                      {rec.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{rec.subtitle}</p>
                  </div>
                  <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                </button>
              ))
            )}
          </div>
        )}

        {/* All 17 ERP Modules Hierarchy */}
        {activeSection === 'all' && (
          <div className="space-y-1">
            {filteredModules.map(mod => {
              const isModuleActive = currentRoute.moduleId === mod.id;
              const isExpanded = !!expandedModules[mod.id];

              if (isCollapsed) {
                return (
                  <button
                    key={mod.id}
                    id={`nav-module-${mod.id}`}
                    onClick={() => onNavigate({ view: 'module', moduleId: mod.id })}
                    title={`${mod.code} — ${mod.name}`}
                    className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      isModuleActive
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <IconRenderer name={mod.icon} className="w-5 h-5" />
                  </button>
                );
              }

              return (
                <div
                  key={mod.id}
                  id={`nav-module-${mod.id}`}
                  className="rounded-xl overflow-hidden bg-slate-950/30 border border-slate-800/40 transition-colors"
                >
                  {/* Module Header Button */}
                  <div
                    className={`flex items-center justify-between px-2.5 py-2 cursor-pointer transition-all ${
                      isModuleActive && currentRoute.view === 'module'
                        ? 'bg-indigo-900/60 border-l-2 border-indigo-400 text-white'
                        : isModuleActive
                        ? 'bg-slate-800/60 text-indigo-300'
                        : 'hover:bg-slate-800/40 text-slate-300 hover:text-white'
                    }`}
                  >
                    <button
                      onClick={() => onNavigate({ view: 'module', moduleId: mod.id })}
                      className="flex items-center gap-2.5 min-w-0 flex-1 text-left cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center shrink-0 text-slate-300">
                        <IconRenderer name={mod.icon} className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold text-slate-400">
                            {mod.code}
                          </span>
                          <span className="text-xs font-semibold truncate leading-tight">
                            {mod.shortName}
                          </span>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleModuleExpand(mod.id);
                      }}
                      className="p-1 text-slate-500 hover:text-slate-200 rounded shrink-0 cursor-pointer"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Level 2 Functional Areas (Submenu Accordion) */}
                  {isExpanded && (
                    <div className="pl-6 pr-1.5 py-1 bg-slate-950/60 border-t border-slate-800/50 space-y-0.5 animate-in slide-in-from-top-1 duration-150">
                      {mod.functionalAreas.map(fa => {
                        const isFaActive =
                          currentRoute.moduleId === mod.id && currentRoute.functionalAreaId === fa.id;

                        return (
                          <button
                            key={fa.id}
                            onClick={() =>
                              onNavigate({
                                view: 'functional_area',
                                moduleId: mod.id,
                                functionalAreaId: fa.id
                              })
                            }
                            className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              isFaActive
                                ? 'bg-indigo-600/30 text-indigo-200 font-semibold border border-indigo-500/30'
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="font-mono text-[9px] text-slate-500">{fa.code}</span>
                              <span className="truncate">{fa.name}</span>
                            </div>
                            <span className="font-mono text-[9px] text-slate-500 bg-slate-900 px-1 rounded">
                              {fa.processes.length}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. FIXED SIDEBAR FOOTER: Permissions Inspector & Expand Toggle */}
      <div className="shrink-0 p-3 border-t border-slate-800 bg-slate-950/80 text-xs">
        {!isCollapsed ? (
          <div className="space-y-2">
            <button
              onClick={onOpenPermissionsModal}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Enterprise Permissions</span>
              </span>
              <span className="font-mono text-[9px] bg-slate-800 px-1 py-0.2 rounded text-slate-400">
                11 Actions
              </span>
            </button>
            <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
              <span>Artify Framework v1.0</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Ready
              </span>
            </div>
          </div>
        ) : (
          <button
            onClick={onToggleCollapse}
            title="Expand Sidebar"
            className="w-9 h-9 mx-auto rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};


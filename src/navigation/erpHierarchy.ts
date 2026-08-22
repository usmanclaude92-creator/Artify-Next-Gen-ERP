import { ERPModule, ERPRouteState, ERPUserRole, ERPNotification } from '../types/erp';
import { MODULES_01_05 } from './data/modules_01_05';
import { MODULES_06_10 } from './data/modules_06_10';
import { MODULES_11_17 } from './data/modules_11_17';

export const ERP_MODULES: ERPModule[] = [
  ...MODULES_01_05,
  ...MODULES_06_10,
  ...MODULES_11_17
];

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  type: 'module' | 'functional_area' | 'process' | 'transaction';
  route: ERPRouteState;
  moduleCode: string;
  moduleName: string;
  icon: string;
  phase: string;
  matchScore?: number;
}

// Flat search index for ultra-fast instant searching
export const ERP_SEARCH_INDEX: SearchResultItem[] = [];

ERP_MODULES.forEach(mod => {
  ERP_SEARCH_INDEX.push({
    id: mod.id,
    title: mod.name,
    subtitle: `${mod.category} • ${mod.phase}`,
    code: mod.code,
    type: 'module',
    route: { view: 'module', moduleId: mod.id },
    moduleCode: mod.code,
    moduleName: mod.shortName,
    icon: mod.icon,
    phase: mod.phase
  });

  mod.functionalAreas.forEach(fa => {
    ERP_SEARCH_INDEX.push({
      id: fa.id,
      title: `${fa.code} ${fa.name}`,
      subtitle: `${mod.shortName} • ${fa.phase}`,
      code: fa.code,
      type: 'functional_area',
      route: { view: 'functional_area', moduleId: mod.id, functionalAreaId: fa.id },
      moduleCode: mod.code,
      moduleName: mod.shortName,
      icon: fa.icon || mod.icon,
      phase: fa.phase
    });

    fa.processes.forEach(proc => {
      ERP_SEARCH_INDEX.push({
        id: proc.id,
        title: `${proc.code} ${proc.name}`,
        subtitle: `${mod.shortName} › ${fa.name}`,
        code: proc.code,
        type: 'process',
        route: { view: 'process', moduleId: mod.id, functionalAreaId: fa.id, processId: proc.id },
        moduleCode: mod.code,
        moduleName: mod.shortName,
        icon: proc.icon || fa.icon || mod.icon,
        phase: proc.phase
      });

      proc.transactions.forEach(tx => {
        ERP_SEARCH_INDEX.push({
          id: tx.id,
          title: tx.name,
          subtitle: `${mod.shortName} › ${fa.name} › ${proc.name}`,
          code: tx.code,
          type: 'transaction',
          route: { view: 'transaction', moduleId: mod.id, functionalAreaId: fa.id, processId: proc.id, transactionId: tx.id },
          moduleCode: mod.code,
          moduleName: mod.shortName,
          icon: 'FileText',
          phase: tx.phase
        });
      });
    });
  });
});

export function findModuleById(id?: string): ERPModule | undefined {
  if (!id) return undefined;
  return ERP_MODULES.find(m => m.id === id);
}

export function findFunctionalAreaById(moduleId?: string, faId?: string) {
  const mod = findModuleById(moduleId);
  if (!mod || !faId) return undefined;
  
  // Direct match
  const direct = mod.functionalAreas.find(fa => fa.id === faId || fa.code === faId);
  if (direct) return direct;

  // Alias support for legacy or alternative IDs
  if (faId === 'org-company-setup' || faId === 'org-setup' || faId === '01.01') {
    return mod.functionalAreas.find(fa => fa.id === 'company-organization-setup' || fa.code === '01.01');
  }
  return undefined;
}

export function findProcessById(moduleId?: string, faId?: string, procId?: string) {
  const fa = findFunctionalAreaById(moduleId, faId);
  if (!fa || !procId) return undefined;

  const direct = fa.processes.find(p => p.id === procId || p.code === procId);
  if (direct) return direct;

  // Alias support for legacy or alternative process IDs
  if (procId === 'company-master' || procId === '01.01.01') {
    return fa.processes.find(p => p.id === 'company-setup' || p.code === '01.01.01');
  }
  if (procId === 'branch-setup' || procId === '01.01.02') {
    return fa.processes.find(p => p.id === 'branch-location-setup' || p.code === '01.01.02');
  }
  if (procId === 'dept-setup' || procId === '01.01.03') {
    return fa.processes.find(p => p.id === 'org-structure' || p.code === '01.01.03');
  }
  if (procId === '01.01.04') {
    return fa.processes.find(p => p.id === 'fiscal-year' || p.code === '01.01.04');
  }
  if (procId === '01.01.05') {
    return fa.processes.find(p => p.id === 'posting-periods' || p.code === '01.01.05');
  }
  return undefined;
}

export function findTransactionById(moduleId?: string, faId?: string, procId?: string, txId?: string) {
  const proc = findProcessById(moduleId, faId, procId);
  if (!proc || !txId) return undefined;
  return proc.transactions.find(t => t.id === txId);
}

export interface BreadcrumbItem {
  label: string;
  route: ERPRouteState;
  code?: string;
  isCurrent?: boolean;
}

export function getBreadcrumbs(route: ERPRouteState): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Enterprise Home', route: { view: 'dashboard' } }
  ];

  if (route.view === 'ai') {
    breadcrumbs.push({ label: 'AI Command Center', route: { view: 'ai' }, isCurrent: true });
    return breadcrumbs;
  }

  if (!route.moduleId) return breadcrumbs;

  const mod = findModuleById(route.moduleId);
  if (mod) {
    const isModCurrent = route.view === 'module';
    breadcrumbs.push({
      label: mod.shortName,
      code: mod.code,
      route: { view: 'module', moduleId: mod.id },
      isCurrent: isModCurrent
    });

    if (route.functionalAreaId) {
      const fa = findFunctionalAreaById(mod.id, route.functionalAreaId);
      if (fa) {
        const isFaCurrent = route.view === 'functional_area';
        breadcrumbs.push({
          label: fa.name,
          code: fa.code,
          route: { view: 'functional_area', moduleId: mod.id, functionalAreaId: fa.id },
          isCurrent: isFaCurrent
        });

        if (route.processId) {
          const proc = findProcessById(mod.id, fa.id, route.processId);
          if (proc) {
            const isProcCurrent = route.view === 'process';
            breadcrumbs.push({
              label: proc.name,
              code: proc.code,
              route: { view: 'process', moduleId: mod.id, functionalAreaId: fa.id, processId: proc.id },
              isCurrent: isProcCurrent
            });

            if (route.transactionId) {
              const tx = findTransactionById(mod.id, fa.id, proc.id, route.transactionId);
              if (tx) {
                breadcrumbs.push({
                  label: tx.name,
                  code: tx.code,
                  route: { view: 'transaction', moduleId: mod.id, functionalAreaId: fa.id, processId: proc.id, transactionId: tx.id },
                  isCurrent: true
                });
              }
            }
          }
        }
      }
    }
  }

  return breadcrumbs;
}

export const ENTERPRISE_COMPANIES = [
  { id: 'artify-holding', code: 'HOLD-01', name: 'Artify Global Holding Co.', currency: 'OMR', country: 'Oman', fiscalPeriod: 'FY 2026 / Q3' },
  { id: 'artify-industries', code: 'IND-02', name: 'Artify Industrial & Manufacturing LLC', currency: 'OMR', country: 'Oman', fiscalPeriod: 'FY 2026 / Q3' },
  { id: 'artify-contracting', code: 'CON-03', name: 'Artify Engineering & Contracting WLL', currency: 'AED', country: 'UAE', fiscalPeriod: 'FY 2026 / Q3' },
  { id: 'artify-tech', code: 'TECH-04', name: 'Artify Intelligent Technologies SAOC', currency: 'SAR', country: 'Saudi Arabia', fiscalPeriod: 'FY 2026 / Q3' }
];

export const ENTERPRISE_BRANCHES = [
  { id: 'muscat-hq', name: 'Muscat Global HQ (Main Operating Hub)', code: 'MCT-HQ' },
  { id: 'sohar-plant', name: 'Sohar Industrial Plant & Logistics Yard', code: 'SOH-PLANT' },
  { id: 'dubai-office', name: 'Dubai Regional Commercial Office', code: 'DXB-REG' },
  { id: 'riyadh-hub', name: 'Riyadh Central Project Management Hub', code: 'RUH-HUB' }
];

export const MOCK_USER_ROLES: ERPUserRole[] = [
  { id: 'role-cfo', name: 'Nasser Al-Harthy', title: 'Group Chief Financial Officer (CFO)', department: 'Executive Finance', avatar: 'NA', permissions: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE', 'REJECT', 'EXPORT', 'PRINT', 'POST', 'REVERSE', 'ADMIN'] },
  { id: 'role-ceo', name: 'Tariq Al-Said', title: 'Chief Executive Officer (CEO)', department: 'Executive Directorate', avatar: 'TS', permissions: ['VIEW', 'APPROVE', 'EXPORT', 'ADMIN'] },
  { id: 'role-coo', name: 'Fatima Al-Balushi', title: 'Chief Operating Officer (COO)', department: 'Operations & Supply', avatar: 'FB', permissions: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'EXPORT'] },
  { id: 'role-fin-mgr', name: 'Zaid Al-Habsi', title: 'Senior Finance & Tax Manager', department: 'Financial Accounting', avatar: 'ZH', permissions: ['VIEW', 'CREATE', 'EDIT', 'APPROVE', 'POST', 'EXPORT'] },
  { id: 'role-proc-mgr', name: 'Hamad Al-Lawati', title: 'Head of Strategic Procurement', department: 'Supply Chain', avatar: 'HL', permissions: ['VIEW', 'CREATE', 'EDIT', 'APPROVE'] },
  { id: 'role-proj-dir', name: 'Eng. Salem Al-Maamari', title: 'Project Director', department: 'Engineering & EPC', avatar: 'SM', permissions: ['VIEW', 'CREATE', 'EDIT', 'APPROVE'] },
  { id: 'role-auditor', name: 'Dr. Evelyn Reed', title: 'Chief Internal Auditor', department: 'Governance & Risk', avatar: 'ER', permissions: ['VIEW', 'EXPORT', 'PRINT', 'ADMIN'] }
];

export const MOCK_SYSTEM_NOTIFICATIONS: ERPNotification[] = [
  { id: 'notif-1', title: 'Pending Approval: Payment Run #PR-2026-088', message: 'Payment batch of OMR 142,500 awaiting dual CFO authorization before cut-off.', type: 'approval', timestamp: '12 min ago', read: false, moduleRef: '04 — BANKING & TREASURY', priority: 'high' },
  { id: 'notif-2', title: 'Statutory VAT Filing Due in 12 Days', message: 'Q2 2026 Tax Return summary ready for reconciliation and executive signoff.', type: 'compliance', timestamp: '1 hour ago', read: false, moduleRef: '16 — FINANCIAL ACCOUNTING', priority: 'medium' },
  { id: 'notif-3', title: 'IPC-14 Certified on Muscat Marina Tower', message: 'Supervising consultant approved interim certificate for OMR 480,000.', type: 'approval', timestamp: '3 hours ago', read: true, moduleRef: '15 — CONSTRUCTION', priority: 'medium' },
  { id: 'notif-4', title: 'Security Audit: MFA Policy Compliance', message: 'All privileged administrator accounts have verified FIDO2 security keys.', type: 'security', timestamp: '1 day ago', read: true, moduleRef: '01 — SYSTEM MANAGEMENT', priority: 'low' }
];

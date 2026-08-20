export type ModuleCategory =
  | 'Core Finance'
  | 'Operations & Supply'
  | 'Enterprise Management'
  | 'Governance & Analytics'
  | string;

export type ImplementationPhase = string;

export type PermissionAction =
  | 'VIEW'
  | 'CREATE'
  | 'EDIT'
  | 'DELETE'
  | 'APPROVE'
  | 'REJECT'
  | 'EXPORT'
  | 'PRINT'
  | 'POST'
  | 'REVERSE'
  | 'ADMIN'
  | string;

export type ERPPermissionAction = PermissionAction;

export interface ERPTransaction {
  id: string;
  code: string;
  name: string;
  description: string;
  phase: ImplementationPhase;
  aiFeatures?: string[];
  requiredPermissions?: PermissionAction[];
  formType?: 'standard' | 'master' | 'report' | 'wizard' | 'dashboard' | string;
  complexity?: 'Low' | 'Medium' | 'High' | string;
  actionType?: string;
  [key: string]: any;
}

export interface ERPProcess {
  id: string;
  code: string;
  name: string;
  description: string;
  phase: ImplementationPhase;
  icon?: string;
  transactions: ERPTransaction[];
  [key: string]: any;
}

export interface ERPFunctionalArea {
  id: string;
  code: string;
  name: string;
  description: string;
  phase: ImplementationPhase;
  icon?: string;
  processes: ERPProcess[];
  [key: string]: any;
}

export interface ERPModule {
  id: string;
  code: string;
  name: string;
  shortName: string;
  description: string;
  category: ModuleCategory;
  phase: ImplementationPhase;
  icon: string;
  functionalAreas: ERPFunctionalArea[];
  kpiPlaceholders?: {
    title?: string;
    label?: string;
    value: string;
    change?: string;
    isPositive?: boolean;
    changeType?: 'positive' | 'negative' | 'neutral' | string;
    status?: string;
    [key: string]: any;
  }[];
  aiSuggestions?: string[];
  [key: string]: any;
}

export interface ERPRouteState {
  view: 'dashboard' | 'ai' | 'module' | 'functional_area' | 'process' | 'transaction';
  moduleId?: string;
  functionalAreaId?: string;
  processId?: string;
  transactionId?: string;
}

export interface FavoriteItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'module' | 'functional_area' | 'process' | 'transaction' | string;
  path?: string;
  route: ERPRouteState;
  icon?: string;
  timestamp?: number | string;
  addedAt?: string;
}

export interface RecentItem {
  id: string;
  title: string;
  subtitle: string;
  type?: 'module' | 'functional_area' | 'process' | 'transaction' | string;
  path?: string;
  route: ERPRouteState;
  icon?: string;
  timestamp: number | string;
}

export interface ERPUserRole {
  id: string;
  name: string;
  title: string;
  department: string;
  avatar: string;
  permissions: PermissionAction[];
}

export interface ERPNotification {
  id: string;
  title: string;
  message: string;
  type: 'approval' | 'system' | 'compliance' | 'security' | string;
  timestamp: string;
  read: boolean;
  moduleRef?: string;
  priority: 'low' | 'medium' | 'high' | 'critical' | string;
}

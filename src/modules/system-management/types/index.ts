export interface CompanyAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  category: 'Commercial Registration (CR)' | 'Tax / VAT Certificate' | 'Chamber of Commerce' | 'Municipality Permit' | 'Articles of Association' | 'Audited Financials' | 'Board Resolution' | 'Other';
  fileUrl?: string;
  documentNumber?: string;
  expiryDate?: string;
}

export interface CompanyHistoryRecord {
  id: string;
  companyId: string;
  fieldChanged: string;
  oldValue: string;
  newValue: string;
  changeReason: string;
  changedBy: string;
  timestamp: string;
  documentRef?: string;
}

export interface Company {
  id: string;
  code: string;
  legalName: string;
  tradingName: string;
  shortName?: string;
  companyType: 'Holding' | 'Subsidiary' | 'Joint Venture' | 'Branch' | 'Associate';
  legalStructure?: 'Public Joint Stock Company (SAOG)' | 'Closed Joint Stock Company (SAOC)' | 'Limited Liability Company (LLC)' | 'Sole Proprietorship (SPC)' | 'Branch of Foreign Entity' | 'Free Zone Entity (FZE/FZ-LLC)' | 'Holding Company' | 'Other';
  industrySegment?: string;
  
  // Registration & Statutory Identification
  registrationNumber: string; // CR Number
  registrationDate?: string;
  registrationExpiryDate?: string;
  taxNumber: string; // VAT TRN
  taxAuthority?: string;
  commercialRegistryOffice?: string;
  chamberOfCommerceNumber?: string;
  municipalLicenseNumber?: string;

  // Capital Structure & Financials
  capitalAuthorized?: number;
  capitalPaidUp?: number;
  parValuePerShare?: number;
  totalShares?: number;

  // Address & Geography
  country: string;
  state: string; // Governorate / Province / Emirate
  city: string;
  address: string;
  postalCode: string;
  poBox?: string;
  buildingNumber?: string;
  wayStreet?: string;

  // Contact Details & Leadership
  phone: string;
  email: string;
  website: string;
  contactPerson?: string;
  managingDirectorName?: string;
  cfoName?: string;
  statutoryAuditor?: string;

  // Financial, Fiscal & System Parameters
  currency: string; // Base currency (e.g. OMR, AED, SAR, USD)
  secondaryCurrency?: string;
  fiscalYearStart: string; // YYYY-MM-DD
  fiscalYearStartMonth?: number; // 1-12
  timeZone: string;
  dateFormat: string;
  numberFormat?: string;
  decimalPrecision?: number; // 2 or 3
  defaultRoundingMethod?: 'Round Half Up' | 'Round Down' | 'Round Up';
  taxScheme?: 'Standard VAT 5%' | 'VAT 15%' | 'Zero-Rated / Exempt' | 'Corporate Tax 15%' | 'Free Zone Tax Exempt';
  corporateTaxRate?: number;
  vatRate?: number;

  // Branding, Logo & Template Identity
  logo?: string;
  logoUrl?: string;
  brandLogoDark?: string;
  brandColor?: string;
  brandSecondaryColor?: string;
  watermarkText?: string;
  watermarkEnabled?: boolean;
  watermarkOpacity?: number;
  watermarkAngle?: number;
  letterheadTemplate?: 'Default Standard' | 'Modern Minimalist' | 'Executive Classic' | 'Bilingual English/Arabic' | 'Centered Official';
  letterheadHeaderHtml?: string;
  letterheadFooterHtml?: string;
  headerTagline?: string;
  footerBankDetails?: string;
  arabicLegalName?: string;
  arabicAddress?: string;
  signatureStampUrl?: string;
  stampEnabled?: boolean;
  signatureOfficerName?: string;
  signatureOfficerTitle?: string;

  // Status, Lifecycle & Workflow
  status: 'Active' | 'Inactive' | 'Draft' | 'Pending Approval' | 'Suspended' | 'Archived';
  isParent: boolean;
  isHolding?: boolean;
  parentId?: string;
  parentEntityId?: string;
  ownershipPercentage?: number;
  version?: number;
  
  // Attachments & History
  attachments?: CompanyAttachment[];
  history?: CompanyHistoryRecord[];

  // Workflow tracking
  submittedAt?: string;
  submittedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  approvalComments?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CurrencyDefinition {
  id: string;
  code: string;
  name: string;
  symbol: string;
  decimalPlaces: number;
  exchangeRate: number; // vs base currency
  isBase: boolean;
  status: 'Active' | 'Inactive';
}

export interface GroupAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  category: 'Shareholding Agreement' | 'Articles of Association' | 'Commercial Registry' | 'Tax Clearance' | 'Board Resolution' | 'Other';
  fileUrl?: string;
}

export interface GroupMaster {
  id: string;
  code: string;
  name: string;
  shortName: string;
  groupType: 'Holding Group' | 'Corporate Group' | 'Investment Group' | 'Parent-Subsidiary Group' | 'Consolidation Group' | 'Other Group';
  parentCompanyId: string; // References Company.id (Authoritative Company Master)
  currency: string; // Base consolidation currency (e.g. OMR, AED, USD, SAR)
  description: string;
  status: 'Draft' | 'Pending Approval' | 'Active' | 'Inactive' | 'Suspended' | 'Archived';
  effectiveFrom: string;
  effectiveTo?: string;
  consolidationMethod?: 'Full Consolidation (IFRS 10)' | 'Proportional Consolidation' | 'Equity Method (IAS 28)' | 'Cost Method (IFRS 9)';
  fiscalYearStartMonth?: number;
  attachments?: GroupAttachment[];
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  version: number;
  // Workflow attributes
  submittedAt?: string;
  submittedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  approvalComments?: string;
}

export type RelationshipType =
  | 'Parent'
  | 'Subsidiary'
  | 'Wholly Owned Subsidiary'
  | 'Associate'
  | 'Joint Venture'
  | 'Affiliate'
  | 'Related Company'
  | 'Investment'
  | 'Other';

export type ControlType =
  | 'Direct Control (>50%)'
  | 'Wholly Owned (100%)'
  | 'Joint Control (50/50)'
  | 'Significant Influence (20-50%)'
  | 'Minority Interest (<20%)'
  | 'Statutory Control';

export interface GroupMembership {
  id: string;
  groupId: string; // References GroupMaster.id
  companyId: string; // References Company.id
  companyCode?: string;
  companyName?: string;
  relationshipType: RelationshipType;
  ownershipPercentage: number; // 0.00 to 100.00 %
  votingPercentage: number; // 0.00 to 100.00 %
  acquisitionDate: string;
  effectiveFrom: string;
  effectiveTo?: string;
  controlType: ControlType;
  consolidationTreatment: 'Consolidated' | 'Equity Accounting' | 'Fair Value' | 'Exempt';
  status: 'Active' | 'Inactive' | 'Draft' | 'Pending Approval' | 'Suspended' | 'Archived';
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  version: number;
}

export interface RelationshipHistoryRecord {
  id: string;
  groupId: string;
  groupName?: string;
  companyId: string;
  companyName: string;
  companyCode: string;
  previousOwnership: number;
  newOwnership: number;
  previousVoting?: number;
  newVoting?: number;
  previousRelationshipType?: string;
  newRelationshipType: string;
  changeReason: string;
  effectiveDate: string;
  changedBy: string;
  timestamp: string;
  documentRef?: string;
}

// Backwards-compatible alias for existing imports
export type CompanyGroup = GroupMaster;

export interface Branch {
  id: string;
  code: string;
  name: string;
  companyId: string;
  companyName: string;
  locationId: string;
  locationName: string;
  manager: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  isTaxBranch: boolean;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  companyId: string;
  companyName: string;
  branchId: string;
  branchName: string;
  parentDepartmentId?: string;
  parentDepartmentName?: string;
  departmentHead: string;
  costCenterCode: string;
  status: 'Active' | 'Inactive';
  employeeCount: number;
}

export interface Location {
  id: string;
  code: string;
  name: string;
  locationType: 'Headquarters' | 'Regional Office' | 'Factory / Plant' | 'Warehouse' | 'Project Site' | 'Yard';
  companyId: string;
  companyName: string;
  branchId?: string;
  country: string;
  region: string;
  city: string;
  address: string;
  coordinates: string;
  status: 'Active' | 'Inactive';
}

export interface OperatingUnit {
  id: string;
  code: string;
  name: string;
  companyId: string;
  companyName: string;
  branchId: string;
  departmentId: string;
  locationId: string;
  manager: string;
  unitType: 'Profit Center' | 'Cost Center' | 'Investment Center' | 'Revenue Center';
  status: 'Active' | 'Inactive';
}

// 01.02 User & Access Types
export interface UserAccount {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  email: string;
  mobile: string;
  employeeRef: string;
  companyId: string;
  companyName: string;
  branchId: string;
  departmentId: string;
  departmentName: string;
  position: string;
  roleId: string;
  roleName: string;
  userGroupId: string;
  userGroupName: string;
  status: 'Active' | 'Inactive' | 'Locked' | 'Suspended';
  authMethod: 'Password' | 'SAML SSO' | 'MFA / TOTP' | 'FIDO2 WebAuthn';
  mfaEnabled: boolean;
  lastLogin: string;
  lastLoginIp: string;
  createdAt: string;
}

export interface UserRoleDefinition {
  id: string;
  code: string;
  name: string;
  description: string;
  department: string;
  userCount: number;
  permissions: {
    module: string;
    functionalArea: string;
    page: string;
    actions: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
      approve: boolean;
      reject: boolean;
      export: boolean;
      print: boolean;
      post: boolean;
      reverse: boolean;
      admin: boolean;
    };
  }[];
  status: 'Active' | 'Inactive';
}

export interface UserGroup {
  id: string;
  code: string;
  name: string;
  description: string;
  memberCount: number;
  members: string[];
  assignedRoles: string[];
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface SoDRule {
  id: string;
  code: string;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  conflictingActionA: string;
  conflictingActionB: string;
  moduleA: string;
  moduleB: string;
  status: 'Enforced' | 'Warning Only' | 'Disabled';
  activeViolationsCount: number;
  exceptions: {
    id: string;
    userId: string;
    userName: string;
    approvedBy: string;
    reason: string;
    expiresAt: string;
    status: 'Active' | 'Expired' | 'Revoked';
  }[];
}

export interface AccessRestriction {
  id: string;
  name: string;
  type: 'IP Whitelist' | 'Time Window' | 'Device Binding' | 'Geofence' | 'Department Scope';
  targetType: 'Company' | 'Role' | 'User' | 'Global';
  targetValue: string;
  ruleValue: string;
  enforceMfa: boolean;
  status: 'Active' | 'Inactive';
  description: string;
}

// 01.03 Workflow & Approval Types
export interface ApprovalStage {
  stageNumber: number;
  name: string;
  approverType: 'Role' | 'User' | 'Department Head' | 'Hierarchy Level';
  approverValue: string;
  condition?: string;
  approvalLimitOMR?: number;
  timeoutHours: number;
  allowDelegation: boolean;
}

export interface ApprovalWorkflow {
  id: string;
  code: string;
  name: string;
  module: string;
  process: string;
  triggerEvent: 'Document Submit' | 'Budget Breach' | 'Payment Dispatch' | 'Master Creation' | 'Period Lock';
  stages: ApprovalStage[];
  status: 'Active' | 'Draft' | 'Suspended';
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalMatrixRule {
  id: string;
  companyId: string;
  departmentId: string;
  module: string;
  transactionType: string;
  minAmount: number;
  maxAmount: number;
  currency: string;
  approvalLevels: string[];
  effectiveDate: string;
  status: 'Active' | 'Inactive';
}

export interface DelegationOfAuthority {
  id: string;
  delegatorId: string;
  delegatorName: string;
  delegatorRole: string;
  delegateId: string;
  delegateName: string;
  delegateRole: string;
  startDate: string;
  endDate: string;
  scope: 'All Approvals' | 'Financial Only' | 'Procurement Only' | 'HR Only';
  maxApprovalLimitOMR: number;
  reason: string;
  status: 'Active' | 'Scheduled' | 'Expired' | 'Revoked';
}

export interface ApprovalLimit {
  id: string;
  targetType: 'User' | 'Role' | 'Management Tier';
  targetName: string;
  companyId: string;
  module: string;
  transactionType: string;
  limitAmount: number;
  currency: string;
  effectiveDate: string;
  expiryDate?: string;
  status: 'Active' | 'Inactive';
}

export interface EscalationRule {
  id: string;
  workflowId: string;
  workflowName: string;
  stageNumber: number;
  waitingHours: number;
  escalationRecipient: string;
  reminderFrequencyHours: number;
  maxEscalations: number;
  notifyMethod: 'Email & In-App' | 'SMS Urgent' | 'WhatsApp';
  status: 'Active' | 'Inactive';
}

// 01.04 Financial & Period Controls Types
export interface FiscalYear {
  id: string;
  yearCode: string;
  companyId: string;
  companyName: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: 'Open' | 'Closed' | 'Locked' | 'Planning';
  totalPeriods: number;
  openPeriodsCount: number;
}

export interface PostingPeriod {
  id: string;
  fiscalYearId: string;
  fiscalYearCode: string;
  periodNumber: number;
  periodName: string;
  startDate: string;
  endDate: string;
  subLedgers: {
    gl: 'Open' | 'Closed' | 'Locked';
    ap: 'Open' | 'Closed' | 'Locked';
    ar: 'Open' | 'Closed' | 'Locked';
    inventory: 'Open' | 'Closed' | 'Locked';
    fixedAssets: 'Open' | 'Closed' | 'Locked';
    payroll: 'Open' | 'Closed' | 'Locked';
  };
  overallStatus: 'Open' | 'Closed' | 'Locked';
  closedBy?: string;
  closedAt?: string;
}

export interface DocumentSequence {
  id: string;
  documentType: string;
  documentTypeName: string;
  companyId: string;
  companyName: string;
  branchId?: string;
  prefix: string;
  suffix?: string;
  startingNumber: number;
  currentNumber: number;
  numberLength: number;
  fiscalYearReset: boolean;
  sampleFormatted: string;
  status: 'Active' | 'Inactive';
}

export interface PostingControl {
  id: string;
  companyId: string;
  companyName: string;
  allowedBackdatedDays: number;
  allowedFutureDays: number;
  requireFinanceManagerApprovalForBackdate: boolean;
  allowCrossYearPosting: boolean;
  unbalancedJournalBlock: boolean;
  status: 'Enforced' | 'Custom';
}

export interface PeriodLockRecord {
  id: string;
  periodId: string;
  periodName: string;
  companyId: string;
  companyName: string;
  lockedBy: string;
  lockedAt: string;
  lockReason: string;
  unlockRequests: {
    id: string;
    requestedBy: string;
    requestedAt: string;
    reason: string;
    approvedBy?: string;
    approvedAt?: string;
    status: 'Pending' | 'Approved' | 'Rejected';
  }[];
}

// 01.05 Master Data Management Types
export interface MasterDataDefinition {
  id: string;
  code: string;
  entityName: string;
  category: 'Finance' | 'Supply Chain' | 'HR' | 'Projects' | 'Sales';
  ownerDepartment: string;
  approvalRequired: boolean;
  duplicateCheckEnabled: boolean;
  goldenRecordCount: number;
  version: string;
  status: 'Active' | 'Draft';
}

export interface DuplicateRule {
  id: string;
  entityType: string;
  ruleName: string;
  fieldsChecked: string[];
  matchType: 'Exact Match' | 'Fuzzy Partial' | 'Phonetic / Metaphone' | 'Normalized Tax ID';
  similarityThresholdPercent: number;
  actionOnMatch: 'Block Creation' | 'Flag for Review' | 'Warn User';
  status: 'Active' | 'Inactive';
}

export interface ValidationRule {
  id: string;
  entityType: string;
  fieldName: string;
  ruleType: 'Required' | 'Regex Format' | 'Unique Constraint' | 'Range' | 'Conditional Dependency';
  ruleExpression: string;
  errorMessage: string;
  severity: 'Error' | 'Warning';
  status: 'Active' | 'Inactive';
}

export interface MasterDataApprovalRequest {
  id: string;
  entityType: string;
  recordIdentifier: string;
  recordData: Record<string, any>;
  submittedBy: string;
  submittedAt: string;
  status: 'Pending Review' | 'Approved' | 'Rejected' | 'Draft';
  assignedApprover: string;
  comments?: string;
}

// 01.06 Notifications & Alerts Types
export interface NotificationTemplate {
  id: string;
  code: string;
  title: string;
  channel: 'Email' | 'In-App' | 'SMS' | 'Push Notification';
  category: 'Approval' | 'Due Date' | 'Exception' | 'System';
  subject: string;
  bodyTemplate: string;
  variables: string[];
  status: 'Active' | 'Inactive';
}

export interface NotificationRule {
  id: string;
  name: string;
  triggerEvent: string;
  channel: 'Email' | 'In-App' | 'Multi-Channel';
  recipientGroup: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  schedule: 'Immediate' | 'Hourly Digest' | 'Daily Morning (08:00)';
  status: 'Active' | 'Inactive';
}

export interface SystemAlertItem {
  id: string;
  title: string;
  message: string;
  type: 'approval' | 'system' | 'compliance' | 'security';
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  read: boolean;
  moduleRef: string;
  actionUrl?: string;
}

// 01.07 Audit Trail & Activity Monitoring Types
export interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'LOCK' | 'UNLOCK' | 'EXPORT' | 'LOGIN' | 'REVOKE' | 'CONFIG_CHANGE';
  module: string;
  entity: string;
  recordId: string;
  previousValue?: string;
  newValue?: string;
  ipAddress: string;
  userAgent: string;
  result: 'SUCCESS' | 'FAILED' | 'DENIED';
  details: string;
}

export interface LoginHistoryEvent {
  id: string;
  timestamp: string;
  username: string;
  fullName: string;
  result: 'Success' | 'Failed (Bad Password)' | 'Failed (MFA Required)' | 'Blocked (IP Restriction)' | 'Account Locked';
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
}

// 01.08 Integration & API Management Types
export interface ApiClient {
  id: string;
  name: string;
  clientId: string;
  maskedSecret: string;
  scopes: string[];
  rateLimitPerMinute: number;
  dailyRequestCount: number;
  status: 'Active' | 'Suspended' | 'Revoked';
  expiresAt: string;
  createdAt: string;
}

export interface ExternalIntegration {
  id: string;
  name: string;
  provider: string;
  category: 'Banking / Treasury' | 'Tax & Government Portal' | 'WMS / Logistics' | 'Legacy ERP' | 'Payment Gateway';
  endpoint: string;
  authType: 'OAuth 2.0 MTLS' | 'API Key Header' | 'HMAC Signature' | 'AS2 Gateway';
  status: 'Connected / Healthy' | 'Degraded' | 'Offline' | 'Sandbox Mock';
  lastSync: string;
  errorCount24h: number;
  syncSchedule: string;
}

export interface IntegrationLog {
  id: string;
  timestamp: string;
  integrationName: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  statusCode: number;
  durationMs: number;
  status: 'Success' | 'Failed';
  errorMessage?: string;
}

// 01.09 Backup & Recovery Types
export interface BackupConfiguration {
  id: string;
  backupType: 'Full Database' | 'Incremental Transaction Logs' | 'Configuration & Masters Only';
  frequency: 'Daily at 02:00 UTC' | 'Every 6 Hours' | 'Real-time WAL Stream';
  retentionDays: number;
  storageDestination: string;
  encryptionAlgorithm: 'AES-256 GCM';
  lastBackupAt: string;
  lastBackupSizeBytes: number;
  lastBackupStatus: 'Success' | 'Warning' | 'Failed';
  isAutoReplicated: boolean;
}

export interface RestorePoint {
  id: string;
  timestamp: string;
  backupType: string;
  sizeFormatted: string;
  checksumSha256: string;
  location: string;
  verified: boolean;
  status: 'Ready for Sandbox' | 'Archived to Cold Storage';
}

export interface DisasterRecoveryStatus {
  rpoTargetMinutes: number;
  currentRpoMinutes: number;
  rtoTargetMinutes: number;
  currentRtoEstimateMinutes: number;
  primaryRegion: string;
  failoverRegion: string;
  clusterSyncStatus: 'Synchronous Streaming (Healthy)' | 'Catching Up' | 'Degraded';
  drReadinessScore: number;
  lastDrDrillDate: string;
}

// 01.10 Security Management Types
export interface SecurityPolicy {
  id: string;
  policyName: string;
  category: 'Encryption' | 'Network' | 'Session' | 'Data Protection';
  settingValue: string;
  description: string;
  isMandatory: boolean;
  status: 'Enforced' | 'Draft';
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  expiryDays: number;
  preventHistoryCount: number;
  maxFailedAttempts: number;
  lockoutDurationMinutes: number;
}

export interface ActiveSession {
  id: string;
  userId: string;
  userName: string;
  role: string;
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
  loginTime: string;
  lastActiveTime: string;
  status: 'Active' | 'Idle';
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: 'Failed Login' | 'Privilege Escalation' | 'Multiple Failed MFAs' | 'Unauthorized Endpoint Access' | 'Session Revoked';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  ipAddress: string;
  userId?: string;
  userName?: string;
  details: string;
  actionTaken: 'Account Locked' | 'IP Blocked' | 'Alert Dispatched' | 'Session Terminated' | 'Logged';
}

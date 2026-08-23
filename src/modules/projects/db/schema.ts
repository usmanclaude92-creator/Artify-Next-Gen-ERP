// ============================================================================
// ARTIFY ERP — MODULE 10: PROJECT MANAGEMENT & JOB COSTING
// DATABASE SCHEMA & RELATIONAL ENTITY MODELS (MODULE 10.01: PROJECT SETUP)
// ============================================================================

/**
 * Standard ERP Audit & Organizational Context Fields
 * Applied across all transactional and master data tables.
 */
export interface DbAuditFields {
  tenant_id: string;              // Multi-tenant isolation partition key
  created_at: string;             // ISO 8601 UTC Timestamp with Timezone
  created_by: string;             // User UUID / Employee Code of creator
  updated_at: string;             // ISO 8601 UTC Timestamp of last modification
  updated_by: string;             // User UUID / Employee Code of last modifier
  deleted_at: string | null;      // Soft delete timestamp (NULL for active records)
  deleted_by: string | null;      // User UUID who archived the record
  is_deleted: boolean;            // Soft delete flag for fast indexing
  row_version: number;            // Optimistic concurrency locking counter (increments on UPDATE)
}

export interface DbOrgContextFields {
  company_id: string;             // Foreign Key -> org_companies.company_id
  company_name: string;           // Denormalized company legal name for fast read queries
  branch_id: string;              // Foreign Key -> org_branches.branch_id
  branch_name: string;            // Denormalized regional branch name
  department_id: string;          // Foreign Key -> org_departments.department_id
  department_name: string;        // Denormalized operating department
  cost_center_id: string;         // Foreign Key -> fin_cost_centers.cost_center_id
  cost_center_code: string;       // Cost Center reference code (e.g. "CC-PRJ-SOHAR-01")
}

// ============================================================================
// 1. PROJECT CLASSIFICATION TABLE (project_classifications)
// ============================================================================

export type ClassificationSectorEnum =
  | 'ENERGY_UTILITIES'
  | 'CONSTRUCTION_CIVIL'
  | 'HEAVY_ENGINEERING'
  | 'COMMERCIAL_BUILD'
  | 'GOVERNMENT_INFRA'
  | 'DEFENSE_SECURITY'
  | 'MARITIME_OFFSHORE';

export interface DbProjectClassification extends DbAuditFields {
  classification_id: string;                  // Primary Key (UUID v4 or 'CLS-xxxx')
  classification_code: string;                // Unique classification identifier (e.g., 'EPC-HEAVY-TURNKEY')
  classification_name: string;                // Display name of project taxonomy
  sector: ClassificationSectorEnum;           // Economic / Engineering sector
  description: string | null;                 // Detailed scope definition
  
  // Standard Commercial & Costing Policy Defaults
  std_overhead_markup_pct: number;            // Standard overhead percentage (NUMERIC(5,2), e.g. 15.00)
  std_retention_rate_pct: number;             // Standard contract retention withholding rate (NUMERIC(5,2), e.g. 10.00)
  std_advance_recovery_pct: number;           // Standard mobilization advance recovery rate (NUMERIC(5,2), e.g. 15.00)
  std_defect_liability_months: number;        // Standard warranty / DLP period in months (INTEGER, e.g. 12)
  
  // Status & Metadata
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'; // Classification status
  is_system_template: boolean;                // Flag indicating whether this is a seeded system template
}

// ============================================================================
// 2. PROJECT MASTER TABLE (project_masters)
// ============================================================================

export type ProjectStatusEnum =
  | 'PROPOSED'
  | 'PLANNING'
  | 'ACTIVE_IN_PROGRESS'
  | 'ON_HOLD'
  | 'SUBSTANTIALLY_COMPLETE'
  | 'CLOSED'
  | 'CANCELLED';

export type ProjectTypeEnum =
  | 'EPC_COMMERCIAL'
  | 'INFRASTRUCTURE'
  | 'INDUSTRIAL_FABRICATION'
  | 'OIL_GAS_FACILITY'
  | 'RESIDENTIAL_COMPLEX'
  | 'MAINTENANCE_SHUTDOWN'
  | 'INTERNAL_RD';

export type ProjectPriorityEnum =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL_FAST_TRACK';

export type BillingMethodEnum =
  | 'PROGRESS_PERCENT_COMPLETION'
  | 'MILESTONE_DELIVERABLE'
  | 'TIME_AND_MATERIALS'
  | 'FIXED_LUMP_SUM'
  | 'COST_PLUS_PERCENT';

export interface DbProjectMaster extends DbAuditFields, DbOrgContextFields {
  project_id: string;                         // Primary Key (UUID v4 or 'PRJ-xxxx')
  project_code: string;                       // Business identifier (e.g. 'PRJ-2026-OM-001', UNIQUE per tenant)
  project_name: string;                       // Official project title / contract scope
  
  // Classification Foreign Key
  classification_id: string;                  // FK -> project_classifications.classification_id
  project_type: ProjectTypeEnum;              // Project engineering categorization
  
  // Client Principal Entity & Contractual Context
  client_id: string | null;                   // FK -> crm_client_entities.client_id
  client_entity_name: string;                 // Client Principal Legal Name
  client_contact_person: string;              // Client Representative / Engineer's Rep
  client_email: string;                       // Contact Email Address
  client_phone: string;                       // Contact Telephone
  contract_number: string;                    // Formal Contract / Letter of Award reference
  
  // Commercial & Financial Baseline
  contract_value: number;                     // Awarded contract value (NUMERIC(18,3))
  currency_code: string;                      // ISO 4217 Currency (CHAR(3), e.g. 'OMR', 'USD', 'AED')
  exchange_rate_to_base: number;              // Exchange rate to ERP functional currency (NUMERIC(12,6))
  total_budget: number;                       // Approved project baseline cost budget (NUMERIC(18,3))
  billing_method: BillingMethodEnum;          // Revenue & Progress billing mechanism
  retention_withheld_pct: number;             // Retention withholding rate (NUMERIC(5,2))
  retention_max_cap_amount: number | null;    // Maximum monetary cap for retention fund (NUMERIC(18,3))
  advance_payment_received: number;           // Mobilization advance received (NUMERIC(18,3))
  advance_recovery_rate_pct: number;          // Advance recovery percentage against gross IPCs (NUMERIC(5,2))
  
  // Project Leadership & Site Execution
  project_manager_id: string | null;          // FK -> hr_employees.employee_id
  project_manager_name: string;               // Assigned Project Manager
  site_engineer_id: string | null;            // FK -> hr_employees.employee_id
  site_engineer_name: string;                 // Assigned Lead Site / Project Engineer
  site_location: string;                      // Physical site address / GPS / Port berth coordinates
  latitude: number | null;                    // Site latitude (NUMERIC(10,7))
  longitude: number | null;                   // Site longitude (NUMERIC(10,7))
  
  // Schedule Baseline & Progress
  start_date: string;                         // Official Notice to Proceed (NTP) / Start Date (DATE)
  target_completion_date: string;             // Contractual Baseline Completion Date (DATE)
  revised_completion_date: string | null;     // Approved Extension of Time (EOT) Date (DATE)
  actual_completion_date: string | null;      // Practical Completion Certificate Date (DATE)
  overall_progress_pct: number;               // Weighted physical progress percentage (NUMERIC(5,2), 0.00 to 100.00)
  schedule_variance_days: number;             // Variance in calendar days (+ Ahead, - Delay)
  
  // Financial Live Summary (Cached / Computed rollup)
  total_committed_cost: number;               // Sum of active POs + Subcontracts (NUMERIC(18,3))
  total_actual_cost: number;                  // Sum of approved Material issues + Timesheets + Plant hire (NUMERIC(18,3))
  total_billed_amount: number;                // Sum of certified Interim Payment Certificates (NUMERIC(18,3))
  total_received_amount: number;              // Total cash collected against progress invoices (NUMERIC(18,3))
  
  // Project Status & Control
  status: ProjectStatusEnum;                  // Lifecycle status
  priority: ProjectPriorityEnum;              // Operational priority
  tags: string[];                             // Searchable tag array (e.g. ['Petrochemical', 'Cryogenic'])
}

// ============================================================================
// 3. PROJECT PHASE TABLE (project_phases)
// ============================================================================

export type PhaseStatusEnum =
  | 'UPCOMING'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'DELAYED'
  | 'SUSPENDED';

export interface DbProjectPhase extends DbAuditFields {
  phase_id: string;                           // Primary Key (UUID v4 or 'PHS-xxxx')
  project_id: string;                         // Foreign Key -> project_masters.project_id (ON DELETE CASCADE)
  
  // Phase Definition & Sequence
  phase_sequence: number;                     // Integer sequence order (1, 2, 3...)
  phase_code: string;                         // WBS Level 1 Code (e.g. '1.1', '1.2', 'PHS-01')
  phase_name: string;                         // Milestone phase title (e.g. 'Detailed Engineering & Hazop')
  description: string | null;                 // Milestone scope details
  
  // Schedule & Dates
  start_date: string;                         // Phase planned start date (DATE)
  end_date: string;                           // Phase planned finish date (DATE)
  actual_start_date: string | null;           // Actual start date (DATE)
  actual_end_date: string | null;             // Actual completion date (DATE)
  
  // Costing & Weightage
  budget_allocated: number;                   // Budget allocated for this phase (NUMERIC(18,3))
  actual_spent: number;                       // Cumulative actual costs logged against phase (NUMERIC(18,3))
  weightage_pct: number;                      // Contribution weight to total project (NUMERIC(5,2), e.g. 20.00%)
  completion_pct: number;                     // Physical percentage completion of phase (NUMERIC(5,2), 0.00 to 100.00)
  
  // Status & Signoff
  status: PhaseStatusEnum;                    // Current phase status
  is_milestone_billed: boolean;               // Indicates if billing milestone has been certified
}

// ============================================================================
// 4. PROJECT ACTIVITY TABLE (project_activities - WBS Level 2+)
// ============================================================================

export type ActivityStatusEnum =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'BLOCKED'
  | 'ON_HOLD';

export interface DbProjectActivity extends DbAuditFields {
  activity_id: string;                        // Primary Key (UUID v4 or 'ACT-xxxx')
  project_id: string;                         // Foreign Key -> project_masters.project_id (ON DELETE CASCADE)
  phase_id: string;                           // Foreign Key -> project_phases.phase_id (ON DELETE CASCADE)
  
  // WBS Coding & Scope
  wbs_code: string;                           // Standard hierarchical WBS code (e.g. '1.1.01', '1.2.03')
  activity_name: string;                      // Work package description
  description: string | null;                 // Technical specifications and scope details
  
  // Schedule & Critical Path
  duration_days: number;                      // Working duration in calendar days (INTEGER)
  start_date: string;                         // Planned start date (DATE)
  end_date: string;                           // Planned completion date (DATE)
  actual_start_date: string | null;           // Actual commencement date (DATE)
  actual_end_date: string | null;             // Actual finish date (DATE)
  early_start_date: string | null;            // CPM Early Start date
  early_finish_date: string | null;           // CPM Early Finish date
  late_start_date: string | null;             // CPM Late Start date
  late_finish_date: string | null;            // CPM Late Finish date
  total_float_days: number;                   // Total schedule float in days (INTEGER, 0 indicates Critical Path)
  free_float_days: number;                    // Free schedule float in days (INTEGER)
  is_critical_path: boolean;                  // Boolean flag (true if total_float_days == 0)
  
  // Costing & Earned Value Management (EVM)
  planned_cost: number;                       // Budgeted Cost of Work Scheduled (BCWS / PV) (NUMERIC(18,3))
  actual_cost: number;                        // Actual Cost of Work Performed (ACWP / AC) (NUMERIC(18,3))
  earned_value: number;                       // Budgeted Cost of Work Performed (BCWP / EV) (NUMERIC(18,3))
  progress_pct: number;                       // Physical completion percentage (NUMERIC(5,2), 0.00 to 100.00)
  
  // Assignment & Accountability
  assigned_leader_id: string | null;          // FK -> hr_employees.employee_id
  assigned_team_leader: string;               // Lead Engineer / Trade Foreman name
  cost_code_id: string | null;                // FK -> prj_cost_codes.cost_code_id
  
  // Status
  status: ActivityStatusEnum;                 // Execution status
}

// ============================================================================
// 5. ACTIVITY DEPENDENCY TABLE (project_activity_dependencies)
// ============================================================================

export type DependencyTypeEnum =
  | 'FS' // Finish-to-Start (standard)
  | 'SS' // Start-to-Start
  | 'FF' // Finish-to-Finish
  | 'SF'; // Start-to-Finish

export interface DbProjectActivityDependency extends DbAuditFields {
  dependency_id: string;                      // Primary Key (UUID v4)
  project_id: string;                         // Foreign Key -> project_masters.project_id
  predecessor_activity_id: string;            // Foreign Key -> project_activities.activity_id
  successor_activity_id: string;              // Foreign Key -> project_activities.activity_id
  dependency_type: DependencyTypeEnum;        // Relationship rule
  lag_days: number;                           // Lead (-) or Lag (+) duration in days (INTEGER)
}

// ============================================================================
// 6. PROJECT AUDIT LOG TABLE (project_audit_logs)
// ============================================================================

export interface DbProjectAuditLog {
  audit_id: string;                           // Primary Key (UUID v4)
  tenant_id: string;                          // Tenant identifier
  table_name: string;                         // Target database table (e.g. 'project_masters')
  record_id: string;                          // Target record primary key ID
  action_type: 'INSERT' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'PROGRESS_UPDATE';
  field_name: string | null;                  // Specific column modified
  old_value: string | null;                   // JSON / String previous state
  new_value: string | null;                   // JSON / String updated state
  changed_by: string;                         // User identifier
  changed_by_name: string;                    // User full name
  changed_at: string;                         // Timestamp with timezone
  ip_address: string | null;                  // Request IP address
  user_agent: string | null;                  // Client User-Agent
}

// ============================================================================
// DATABASE SCHEMA DEFINITIONS & TABLE METADATA
// (Used for Schema Inspectors, DDL Migrations & Type Validation)
// ============================================================================

export interface ColumnDefinition {
  name: string;
  dataType: string;
  isNullable: boolean;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  references?: string;
  defaultValue?: string;
  checkConstraint?: string;
  description: string;
}

export interface TableDefinition {
  tableName: string;
  displayName: string;
  schema: string;
  description: string;
  primaryKey: string;
  columns: ColumnDefinition[];
  indexes: { name: string; columns: string[]; isUnique?: boolean }[];
  foreignKeys: { name: string; column: string; refTable: string; refColumn: string; onDelete: string }[];
}

export const PROJECT_DB_SCHEMAS: Record<string, TableDefinition> = {
  project_classifications: {
    tableName: 'project_classifications',
    displayName: 'Project Classification Taxonomy',
    schema: 'public',
    description: 'Master table defining project classification categories, sectors, and standard commercial markup rates.',
    primaryKey: 'classification_id',
    columns: [
      { name: 'classification_id', dataType: 'VARCHAR(64)', isNullable: false, isPrimaryKey: true, description: 'Primary Key unique identifier' },
      { name: 'classification_code', dataType: 'VARCHAR(32)', isNullable: false, description: 'Unique classification code (e.g. EPC-HEAVY)' },
      { name: 'classification_name', dataType: 'VARCHAR(128)', isNullable: false, description: 'Classification category title' },
      { name: 'sector', dataType: 'VARCHAR(32)', isNullable: false, checkConstraint: "sector IN ('ENERGY_UTILITIES', 'CONSTRUCTION_CIVIL', 'HEAVY_ENGINEERING', 'COMMERCIAL_BUILD', 'GOVERNMENT_INFRA', 'DEFENSE_SECURITY', 'MARITIME_OFFSHORE')", description: 'Industrial/engineering sector' },
      { name: 'description', dataType: 'TEXT', isNullable: true, description: 'Scope and taxonomy definition' },
      { name: 'std_overhead_markup_pct', dataType: 'NUMERIC(5,2)', isNullable: false, defaultValue: '10.00', checkConstraint: 'std_overhead_markup_pct >= 0 AND std_overhead_markup_pct <= 100', description: 'Standard overhead markup percentage' },
      { name: 'std_retention_rate_pct', dataType: 'NUMERIC(5,2)', isNullable: false, defaultValue: '10.00', checkConstraint: 'std_retention_rate_pct >= 0 AND std_retention_rate_pct <= 100', description: 'Standard contractual retention rate' },
      { name: 'std_advance_recovery_pct', dataType: 'NUMERIC(5,2)', isNullable: false, defaultValue: '15.00', checkConstraint: 'std_advance_recovery_pct >= 0 AND std_advance_recovery_pct <= 100', description: 'Standard advance recovery rate' },
      { name: 'std_defect_liability_months', dataType: 'INTEGER', isNullable: false, defaultValue: '12', description: 'Defect liability period in months' },
      { name: 'status', dataType: 'VARCHAR(20)', isNullable: false, defaultValue: "'ACTIVE'", checkConstraint: "status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')", description: 'Record status' },
      { name: 'is_system_template', dataType: 'BOOLEAN', isNullable: false, defaultValue: 'FALSE', description: 'System pre-configured template indicator' },
      { name: 'tenant_id', dataType: 'VARCHAR(64)', isNullable: false, defaultValue: "'DEFAULT_TENANT'", description: 'Multi-tenant partition key' },
      { name: 'created_at', dataType: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Audit creation timestamp' },
      { name: 'created_by', dataType: 'VARCHAR(64)', isNullable: false, defaultValue: "'SYSTEM'", description: 'Creator user ID' },
      { name: 'updated_at', dataType: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Audit modification timestamp' },
      { name: 'updated_by', dataType: 'VARCHAR(64)', isNullable: false, defaultValue: "'SYSTEM'", description: 'Modifier user ID' },
      { name: 'deleted_at', dataType: 'TIMESTAMPTZ', isNullable: true, description: 'Soft deletion timestamp' },
      { name: 'deleted_by', dataType: 'VARCHAR(64)', isNullable: true, description: 'Deleting user ID' },
      { name: 'is_deleted', dataType: 'BOOLEAN', isNullable: false, defaultValue: 'FALSE', description: 'Soft delete flag' },
      { name: 'row_version', dataType: 'INTEGER', isNullable: false, defaultValue: '1', description: 'Optimistic lock version' }
    ],
    indexes: [
      { name: 'idx_proj_class_code_tenant', columns: ['tenant_id', 'classification_code'], isUnique: true },
      { name: 'idx_proj_class_status', columns: ['tenant_id', 'status', 'is_deleted'] }
    ],
    foreignKeys: []
  },

  project_masters: {
    tableName: 'project_masters',
    displayName: 'Project Master Charters',
    schema: 'public',
    description: 'Central project master table holding charter contracts, enterprise organizational mapping, leadership, commercial baseline, and live financial totals.',
    primaryKey: 'project_id',
    columns: [
      { name: 'project_id', dataType: 'VARCHAR(64)', isNullable: false, isPrimaryKey: true, description: 'Primary Key UUID/Code' },
      { name: 'project_code', dataType: 'VARCHAR(64)', isNullable: false, description: 'Business project code (e.g. PRJ-2026-OM-001)' },
      { name: 'project_name', dataType: 'VARCHAR(255)', isNullable: false, description: 'Official project title' },
      { name: 'classification_id', dataType: 'VARCHAR(64)', isNullable: false, isForeignKey: true, references: 'project_classifications(classification_id)', description: 'Classification taxonomy FK' },
      { name: 'project_type', dataType: 'VARCHAR(32)', isNullable: false, description: 'Engineering classification' },
      { name: 'company_id', dataType: 'VARCHAR(64)', isNullable: false, description: 'Enterprise company FK' },
      { name: 'company_name', dataType: 'VARCHAR(128)', isNullable: false, description: 'Denormalized company name' },
      { name: 'branch_id', dataType: 'VARCHAR(64)', isNullable: false, description: 'Enterprise branch FK' },
      { name: 'branch_name', dataType: 'VARCHAR(128)', isNullable: false, description: 'Denormalized branch name' },
      { name: 'department_id', dataType: 'VARCHAR(64)', isNullable: false, description: 'Enterprise department FK' },
      { name: 'department_name', dataType: 'VARCHAR(128)', isNullable: false, description: 'Denormalized department name' },
      { name: 'cost_center_id', dataType: 'VARCHAR(64)', isNullable: false, description: 'Cost Center FK' },
      { name: 'cost_center_code', dataType: 'VARCHAR(64)', isNullable: false, description: 'Cost Center reference' },
      { name: 'client_id', dataType: 'VARCHAR(64)', isNullable: true, description: 'CRM Client Entity FK' },
      { name: 'client_entity_name', dataType: 'VARCHAR(255)', isNullable: false, description: 'Client company legal name' },
      { name: 'client_contact_person', dataType: 'VARCHAR(128)', isNullable: false, description: 'Client contact person' },
      { name: 'client_email', dataType: 'VARCHAR(128)', isNullable: false, description: 'Client email' },
      { name: 'client_phone', dataType: 'VARCHAR(64)', isNullable: false, description: 'Client telephone' },
      { name: 'contract_number', dataType: 'VARCHAR(128)', isNullable: false, description: 'Official contract award reference' },
      { name: 'contract_value', dataType: 'NUMERIC(18,3)', isNullable: false, defaultValue: '0.000', checkConstraint: 'contract_value >= 0', description: 'Contract awarded sum' },
      { name: 'currency_code', dataType: 'VARCHAR(3)', isNullable: false, defaultValue: "'OMR'", description: 'ISO Currency code' },
      { name: 'exchange_rate_to_base', dataType: 'NUMERIC(12,6)', isNullable: false, defaultValue: '1.000000', description: 'FX conversion rate' },
      { name: 'total_budget', dataType: 'NUMERIC(18,3)', isNullable: false, defaultValue: '0.000', description: 'Approved baseline cost budget' },
      { name: 'billing_method', dataType: 'VARCHAR(32)', isNullable: false, defaultValue: "'PROGRESS_PERCENT_COMPLETION'", description: 'Billing mechanism' },
      { name: 'retention_withheld_pct', dataType: 'NUMERIC(5,2)', isNullable: false, defaultValue: '10.00', description: 'Retention deduction rate' },
      { name: 'retention_max_cap_amount', dataType: 'NUMERIC(18,3)', isNullable: true, description: 'Maximum retention withholding cap' },
      { name: 'advance_payment_received', dataType: 'NUMERIC(18,3)', isNullable: false, defaultValue: '0.000', description: 'Advance mobilization amount' },
      { name: 'advance_recovery_rate_pct', dataType: 'NUMERIC(5,2)', isNullable: false, defaultValue: '15.00', description: 'Advance recovery rate' },
      { name: 'project_manager_id', dataType: 'VARCHAR(64)', isNullable: true, description: 'HR Employee ID for PM' },
      { name: 'project_manager_name', dataType: 'VARCHAR(128)', isNullable: false, description: 'Assigned Project Manager' },
      { name: 'site_engineer_id', dataType: 'VARCHAR(64)', isNullable: true, description: 'HR Employee ID for Site Engineer' },
      { name: 'site_engineer_name', dataType: 'VARCHAR(128)', isNullable: false, description: 'Assigned Site Engineer' },
      { name: 'site_location', dataType: 'VARCHAR(255)', isNullable: false, description: 'Site physical location' },
      { name: 'latitude', dataType: 'NUMERIC(10,7)', isNullable: true, description: 'GPS Latitude' },
      { name: 'longitude', dataType: 'NUMERIC(10,7)', isNullable: true, description: 'GPS Longitude' },
      { name: 'start_date', dataType: 'DATE', isNullable: false, description: 'Contract start date' },
      { name: 'target_completion_date', dataType: 'DATE', isNullable: false, description: 'Target completion date' },
      { name: 'revised_completion_date', dataType: 'DATE', isNullable: true, description: 'Approved EOT completion date' },
      { name: 'actual_completion_date', dataType: 'DATE', isNullable: true, description: 'Actual handover date' },
      { name: 'overall_progress_pct', dataType: 'NUMERIC(5,2)', isNullable: false, defaultValue: '0.00', checkConstraint: 'overall_progress_pct >= 0 AND overall_progress_pct <= 100', description: 'Overall physical completion %' },
      { name: 'schedule_variance_days', dataType: 'INTEGER', isNullable: false, defaultValue: '0', description: 'Schedule variance in days' },
      { name: 'total_committed_cost', dataType: 'NUMERIC(18,3)', isNullable: false, defaultValue: '0.000', description: 'Committed PO/Subcontract cost' },
      { name: 'total_actual_cost', dataType: 'NUMERIC(18,3)', isNullable: false, defaultValue: '0.000', description: 'Cumulative actual cost spent' },
      { name: 'total_billed_amount', dataType: 'NUMERIC(18,3)', isNullable: false, defaultValue: '0.000', description: 'Total certified billed amount' },
      { name: 'total_received_amount', dataType: 'NUMERIC(18,3)', isNullable: false, defaultValue: '0.000', description: 'Total payments collected' },
      { name: 'status', dataType: 'VARCHAR(32)', isNullable: false, defaultValue: "'PLANNING'", checkConstraint: "status IN ('PROPOSED', 'PLANNING', 'ACTIVE_IN_PROGRESS', 'ON_HOLD', 'SUBSTANTIALLY_COMPLETE', 'CLOSED', 'CANCELLED')", description: 'Project lifecycle status' },
      { name: 'priority', dataType: 'VARCHAR(32)', isNullable: false, defaultValue: "'MEDIUM'", checkConstraint: "priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL_FAST_TRACK')", description: 'Project operational priority' },
      { name: 'tags', dataType: 'TEXT[]', isNullable: true, description: 'Searchable tags array' },
      { name: 'tenant_id', dataType: 'VARCHAR(64)', isNullable: false, defaultValue: "'DEFAULT_TENANT'", description: 'Multi-tenant partition key' },
      { name: 'created_at', dataType: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Audit creation timestamp' },
      { name: 'created_by', dataType: 'VARCHAR(64)', isNullable: false, defaultValue: "'SYSTEM'", description: 'Creator user ID' },
      { name: 'updated_at', dataType: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Audit modification timestamp' },
      { name: 'updated_by', dataType: 'VARCHAR(64)', isNullable: false, defaultValue: "'SYSTEM'", description: 'Modifier user ID' },
      { name: 'deleted_at', dataType: 'TIMESTAMPTZ', isNullable: true, description: 'Soft deletion timestamp' },
      { name: 'deleted_by', dataType: 'VARCHAR(64)', isNullable: true, description: 'Deleting user ID' },
      { name: 'is_deleted', dataType: 'BOOLEAN', isNullable: false, defaultValue: 'FALSE', description: 'Soft delete flag' },
      { name: 'row_version', dataType: 'INTEGER', isNullable: false, defaultValue: '1', description: 'Optimistic concurrency version' }
    ],
    indexes: [
      { name: 'idx_proj_master_code_tenant', columns: ['tenant_id', 'project_code'], isUnique: true },
      { name: 'idx_proj_master_org_ctx', columns: ['tenant_id', 'company_id', 'branch_id', 'department_id'] },
      { name: 'idx_proj_master_status_priority', columns: ['tenant_id', 'status', 'priority', 'is_deleted'] },
      { name: 'idx_proj_master_pm', columns: ['tenant_id', 'project_manager_id'] },
      { name: 'idx_proj_master_client', columns: ['tenant_id', 'client_id'] }
    ],
    foreignKeys: [
      { name: 'fk_proj_master_classification', column: 'classification_id', refTable: 'project_classifications', refColumn: 'classification_id', onDelete: 'RESTRICT' }
    ]
  },

  project_phases: {
    tableName: 'project_phases',
    displayName: 'Project Milestone Phases',
    schema: 'public',
    description: 'Milestone work phases decomposing projects into sequential deliverables with budget, weightage, and completion metrics.',
    primaryKey: 'phase_id',
    columns: [
      { name: 'phase_id', dataType: 'VARCHAR(64)', isNullable: false, isPrimaryKey: true, description: 'Primary Key unique phase identifier' },
      { name: 'project_id', dataType: 'VARCHAR(64)', isNullable: false, isForeignKey: true, references: 'project_masters(project_id)', description: 'Parent Project Master FK' },
      { name: 'phase_sequence', dataType: 'INTEGER', isNullable: false, checkConstraint: 'phase_sequence > 0', description: 'Sequential milestone order (1, 2, 3...)' },
      { name: 'phase_code', dataType: 'VARCHAR(32)', isNullable: false, description: 'WBS Level 1 code (e.g. 1.1)' },
      { name: 'phase_name', dataType: 'VARCHAR(128)', isNullable: false, description: 'Milestone phase title' },
      { name: 'description', dataType: 'TEXT', isNullable: true, description: 'Milestone scope notes' },
      { name: 'start_date', dataType: 'DATE', isNullable: false, description: 'Planned start date' },
      { name: 'end_date', dataType: 'DATE', isNullable: false, description: 'Planned completion date' },
      { name: 'actual_start_date', dataType: 'DATE', isNullable: true, description: 'Actual start date' },
      { name: 'actual_end_date', dataType: 'DATE', isNullable: true, description: 'Actual finish date' },
      { name: 'budget_allocated', dataType: 'NUMERIC(18,3)', isNullable: false, defaultValue: '0.000', checkConstraint: 'budget_allocated >= 0', description: 'Phase allocated budget' },
      { name: 'actual_spent', dataType: 'NUMERIC(18,3)', isNullable: false, defaultValue: '0.000', description: 'Cumulative actual cost spent' },
      { name: 'weightage_pct', dataType: 'NUMERIC(5,2)', isNullable: false, defaultValue: '0.00', checkConstraint: 'weightage_pct >= 0 AND weightage_pct <= 100', description: 'Contribution weight to overall project %' },
      { name: 'completion_pct', dataType: 'NUMERIC(5,2)', isNullable: false, defaultValue: '0.00', checkConstraint: 'completion_pct >= 0 AND completion_pct <= 100', description: 'Physical progress %' },
      { name: 'status', dataType: 'VARCHAR(20)', isNullable: false, defaultValue: "'UPCOMING'", checkConstraint: "status IN ('UPCOMING', 'ACTIVE', 'COMPLETED', 'DELAYED', 'SUSPENDED')", description: 'Milestone status' },
      { name: 'is_milestone_billed', dataType: 'BOOLEAN', isNullable: false, defaultValue: 'FALSE', description: 'Milestone certification indicator' },
      { name: 'tenant_id', dataType: 'VARCHAR(64)', isNullable: false, defaultValue: "'DEFAULT_TENANT'", description: 'Multi-tenant partition key' },
      { name: 'created_at', dataType: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Audit creation timestamp' },
      { name: 'created_by', dataType: 'VARCHAR(64)', isNullable: false, defaultValue: "'SYSTEM'", description: 'Creator user ID' },
      { name: 'updated_at', dataType: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Audit modification timestamp' },
      { name: 'updated_by', dataType: 'VARCHAR(64)', isNullable: false, defaultValue: "'SYSTEM'", description: 'Modifier user ID' },
      { name: 'deleted_at', dataType: 'TIMESTAMPTZ', isNullable: true, description: 'Soft deletion timestamp' },
      { name: 'deleted_by', dataType: 'VARCHAR(64)', isNullable: true, description: 'Deleting user ID' },
      { name: 'is_deleted', dataType: 'BOOLEAN', isNullable: false, defaultValue: 'FALSE', description: 'Soft delete flag' },
      { name: 'row_version', dataType: 'INTEGER', isNullable: false, defaultValue: '1', description: 'Optimistic lock version' }
    ],
    indexes: [
      { name: 'idx_proj_phase_prj_seq', columns: ['tenant_id', 'project_id', 'phase_sequence'], isUnique: true },
      { name: 'idx_proj_phase_status', columns: ['tenant_id', 'project_id', 'status'] }
    ],
    foreignKeys: [
      { name: 'fk_proj_phase_project_id', column: 'project_id', refTable: 'project_masters', refColumn: 'project_id', onDelete: 'CASCADE' }
    ]
  },

  project_activities: {
    tableName: 'project_activities',
    displayName: 'WBS Activities (Work Packages)',
    schema: 'public',
    description: 'Work Breakdown Structure (WBS Level 2+) work packages tagged with CPM schedule parameters, planned cost, actual cost, and physical progress.',
    primaryKey: 'activity_id',
    columns: [
      { name: 'activity_id', dataType: 'VARCHAR(64)', isNullable: false, isPrimaryKey: true, description: 'Primary Key unique activity identifier' },
      { name: 'project_id', dataType: 'VARCHAR(64)', isNullable: false, isForeignKey: true, references: 'project_masters(project_id)', description: 'Parent Project FK' },
      { name: 'phase_id', dataType: 'VARCHAR(64)', isNullable: false, isForeignKey: true, references: 'project_phases(phase_id)', description: 'Parent Phase FK' },
      { name: 'wbs_code', dataType: 'VARCHAR(64)', isNullable: false, description: 'Hierarchical WBS code (e.g. 1.2.04)' },
      { name: 'activity_name', dataType: 'VARCHAR(255)', isNullable: false, description: 'Activity work package name' },
      { name: 'description', dataType: 'TEXT', isNullable: true, description: 'Detailed scope specification' },
      { name: 'duration_days', dataType: 'INTEGER', isNullable: false, checkConstraint: 'duration_days >= 0', description: 'Duration in calendar days' },
      { name: 'start_date', dataType: 'DATE', isNullable: false, description: 'Planned start date' },
      { name: 'end_date', dataType: 'DATE', isNullable: false, description: 'Planned completion date' },
      { name: 'actual_start_date', dataType: 'DATE', isNullable: true, description: 'Actual start date' },
      { name: 'actual_end_date', dataType: 'DATE', isNullable: true, description: 'Actual finish date' },
      { name: 'early_start_date', dataType: 'DATE', isNullable: true, description: 'CPM Early Start' },
      { name: 'early_finish_date', dataType: 'DATE', isNullable: true, description: 'CPM Early Finish' },
      { name: 'late_start_date', dataType: 'DATE', isNullable: true, description: 'CPM Late Start' },
      { name: 'late_finish_date', dataType: 'DATE', isNullable: true, description: 'CPM Late Finish' },
      { name: 'total_float_days', dataType: 'INTEGER', isNullable: false, defaultValue: '0', description: 'Total schedule float days' },
      { name: 'free_float_days', dataType: 'INTEGER', isNullable: false, defaultValue: '0', description: 'Free schedule float days' },
      { name: 'is_critical_path', dataType: 'BOOLEAN', isNullable: false, defaultValue: 'FALSE', description: 'Critical Path (Zero Float) flag' },
      { name: 'planned_cost', dataType: 'NUMERIC(18,3)', isNullable: false, defaultValue: '0.000', checkConstraint: 'planned_cost >= 0', description: 'Budgeted Cost of Work Scheduled (PV)' },
      { name: 'actual_cost', dataType: 'NUMERIC(18,3)', isNullable: false, defaultValue: '0.000', description: 'Actual Cost of Work Performed (AC)' },
      { name: 'earned_value', dataType: 'NUMERIC(18,3)', isNullable: false, defaultValue: '0.000', description: 'Earned Value (EV = PV * Progress%)' },
      { name: 'progress_pct', dataType: 'NUMERIC(5,2)', isNullable: false, defaultValue: '0.00', checkConstraint: 'progress_pct >= 0 AND progress_pct <= 100', description: 'Physical progress %' },
      { name: 'assigned_leader_id', dataType: 'VARCHAR(64)', isNullable: true, description: 'Supervisor employee FK' },
      { name: 'assigned_team_leader', dataType: 'VARCHAR(128)', isNullable: false, description: 'Assigned Lead Engineer/Foreman' },
      { name: 'cost_code_id', dataType: 'VARCHAR(64)', isNullable: true, description: 'Direct Cost Code FK' },
      { name: 'status', dataType: 'VARCHAR(20)', isNullable: false, defaultValue: "'NOT_STARTED'", checkConstraint: "status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED', 'ON_HOLD')", description: 'Activity status' },
      { name: 'tenant_id', dataType: 'VARCHAR(64)', isNullable: false, defaultValue: "'DEFAULT_TENANT'", description: 'Multi-tenant partition key' },
      { name: 'created_at', dataType: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Audit creation timestamp' },
      { name: 'created_by', dataType: 'VARCHAR(64)', isNullable: false, defaultValue: "'SYSTEM'", description: 'Creator user ID' },
      { name: 'updated_at', dataType: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Audit modification timestamp' },
      { name: 'updated_by', dataType: 'VARCHAR(64)', isNullable: false, defaultValue: "'SYSTEM'", description: 'Modifier user ID' },
      { name: 'deleted_at', dataType: 'TIMESTAMPTZ', isNullable: true, description: 'Soft deletion timestamp' },
      { name: 'deleted_by', dataType: 'VARCHAR(64)', isNullable: true, description: 'Deleting user ID' },
      { name: 'is_deleted', dataType: 'BOOLEAN', isNullable: false, defaultValue: 'FALSE', description: 'Soft delete flag' },
      { name: 'row_version', dataType: 'INTEGER', isNullable: false, defaultValue: '1', description: 'Optimistic lock version' }
    ],
    indexes: [
      { name: 'idx_proj_act_prj_wbs', columns: ['tenant_id', 'project_id', 'wbs_code'], isUnique: true },
      { name: 'idx_proj_act_phase', columns: ['tenant_id', 'phase_id', 'status'] },
      { name: 'idx_proj_act_critical', columns: ['tenant_id', 'project_id', 'is_critical_path'] }
    ],
    foreignKeys: [
      { name: 'fk_proj_act_project_id', column: 'project_id', refTable: 'project_masters', refColumn: 'project_id', onDelete: 'CASCADE' },
      { name: 'fk_proj_act_phase_id', column: 'phase_id', refTable: 'project_phases', refColumn: 'phase_id', onDelete: 'CASCADE' }
    ]
  },

  project_activity_dependencies: {
    tableName: 'project_activity_dependencies',
    displayName: 'Activity Predecessor Dependencies',
    schema: 'public',
    description: 'Precedence network mapping linking predecessor and successor activities for Critical Path Method (CPM) scheduling.',
    primaryKey: 'dependency_id',
    columns: [
      { name: 'dependency_id', dataType: 'VARCHAR(64)', isNullable: false, isPrimaryKey: true, description: 'Primary Key UUID' },
      { name: 'project_id', dataType: 'VARCHAR(64)', isNullable: false, isForeignKey: true, references: 'project_masters(project_id)', description: 'Project FK' },
      { name: 'predecessor_activity_id', dataType: 'VARCHAR(64)', isNullable: false, isForeignKey: true, references: 'project_activities(activity_id)', description: 'Predecessor Activity FK' },
      { name: 'successor_activity_id', dataType: 'VARCHAR(64)', isNullable: false, isForeignKey: true, references: 'project_activities(activity_id)', description: 'Successor Activity FK' },
      { name: 'dependency_type', dataType: 'VARCHAR(4)', isNullable: false, defaultValue: "'FS'", checkConstraint: "dependency_type IN ('FS', 'SS', 'FF', 'SF')", description: 'Relationship type (FS/SS/FF/SF)' },
      { name: 'lag_days', dataType: 'INTEGER', isNullable: false, defaultValue: '0', description: 'Lead (-) or Lag (+) days' },
      { name: 'tenant_id', dataType: 'VARCHAR(64)', isNullable: false, defaultValue: "'DEFAULT_TENANT'", description: 'Multi-tenant partition key' },
      { name: 'created_at', dataType: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Creation timestamp' },
      { name: 'created_by', dataType: 'VARCHAR(64)', isNullable: false, defaultValue: "'SYSTEM'", description: 'Creator user ID' },
      { name: 'updated_at', dataType: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Modification timestamp' },
      { name: 'updated_by', dataType: 'VARCHAR(64)', isNullable: false, defaultValue: "'SYSTEM'", description: 'Modifier user ID' },
      { name: 'deleted_at', dataType: 'TIMESTAMPTZ', isNullable: true, description: 'Soft deletion timestamp' },
      { name: 'deleted_by', dataType: 'VARCHAR(64)', isNullable: true, description: 'Deleting user ID' },
      { name: 'is_deleted', dataType: 'BOOLEAN', isNullable: false, defaultValue: 'FALSE', description: 'Soft delete flag' },
      { name: 'row_version', dataType: 'INTEGER', isNullable: false, defaultValue: '1', description: 'Optimistic lock version' }
    ],
    indexes: [
      { name: 'idx_proj_dep_pred_succ', columns: ['tenant_id', 'project_id', 'predecessor_activity_id', 'successor_activity_id'], isUnique: true }
    ],
    foreignKeys: [
      { name: 'fk_proj_dep_project', column: 'project_id', refTable: 'project_masters', refColumn: 'project_id', onDelete: 'CASCADE' },
      { name: 'fk_proj_dep_pred', column: 'predecessor_activity_id', refTable: 'project_activities', refColumn: 'activity_id', onDelete: 'CASCADE' },
      { name: 'fk_proj_dep_succ', column: 'successor_activity_id', refTable: 'project_activities', refColumn: 'activity_id', onDelete: 'CASCADE' }
    ]
  },

  project_audit_logs: {
    tableName: 'project_audit_logs',
    displayName: 'Project Audit Trail & Mutation Log',
    schema: 'public',
    description: 'Immutable historical audit trail capturing every creation, update, progress recalculation, and status transition.',
    primaryKey: 'audit_id',
    columns: [
      { name: 'audit_id', dataType: 'VARCHAR(64)', isNullable: false, isPrimaryKey: true, description: 'Primary Key UUID' },
      { name: 'tenant_id', dataType: 'VARCHAR(64)', isNullable: false, defaultValue: "'DEFAULT_TENANT'", description: 'Tenant partition key' },
      { name: 'table_name', dataType: 'VARCHAR(64)', isNullable: false, description: 'Modified table name' },
      { name: 'record_id', dataType: 'VARCHAR(64)', isNullable: false, description: 'Target record ID' },
      { name: 'action_type', dataType: 'VARCHAR(32)', isNullable: false, description: 'INSERT / UPDATE / DELETE / PROGRESS_UPDATE' },
      { name: 'field_name', dataType: 'VARCHAR(64)', isNullable: true, description: 'Modified column' },
      { name: 'old_value', dataType: 'TEXT', isNullable: true, description: 'Previous serialized value' },
      { name: 'new_value', dataType: 'TEXT', isNullable: true, description: 'New serialized value' },
      { name: 'changed_by', dataType: 'VARCHAR(64)', isNullable: false, description: 'User ID' },
      { name: 'changed_by_name', dataType: 'VARCHAR(128)', isNullable: false, description: 'User display name' },
      { name: 'changed_at', dataType: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Timestamp of mutation' },
      { name: 'ip_address', dataType: 'VARCHAR(45)', isNullable: true, description: 'Client IP address' },
      { name: 'user_agent', dataType: 'TEXT', isNullable: true, description: 'User-Agent header' }
    ],
    indexes: [
      { name: 'idx_proj_audit_table_record', columns: ['tenant_id', 'table_name', 'record_id', 'changed_at'] },
      { name: 'idx_proj_audit_user', columns: ['tenant_id', 'changed_by', 'changed_at'] }
    ],
    foreignKeys: []
  }
};

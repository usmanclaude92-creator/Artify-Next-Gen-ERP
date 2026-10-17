-- ============================================================================
-- ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 10: PROJECT MANAGEMENT & JOB COSTING
-- MODULE 10.01: PROJECT SETUP & WBS HIERARCHY
-- PRODUCTION RELATIONAL DATABASE DDL SCHEMA (POSTGRESQL / ANSI SQL COMPLIANT)
-- ============================================================================

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. ENUMERATION TYPES (OR CHECK CONSTRAINTS)
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE project_status_enum AS ENUM (
        'PROPOSED',
        'PLANNING',
        'ACTIVE_IN_PROGRESS',
        'ON_HOLD',
        'SUBSTANTIALLY_COMPLETE',
        'CLOSED',
        'CANCELLED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_type_enum AS ENUM (
        'EPC_COMMERCIAL',
        'INFRASTRUCTURE',
        'INDUSTRIAL_FABRICATION',
        'OIL_GAS_FACILITY',
        'RESIDENTIAL_COMPLEX',
        'MAINTENANCE_SHUTDOWN',
        'INTERNAL_RD'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_priority_enum AS ENUM (
        'LOW',
        'MEDIUM',
        'HIGH',
        'CRITICAL_FAST_TRACK'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE billing_method_enum AS ENUM (
        'PROGRESS_PERCENT_COMPLETION',
        'MILESTONE_DELIVERABLE',
        'TIME_AND_MATERIALS',
        'FIXED_LUMP_SUM',
        'COST_PLUS_PERCENT'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE phase_status_enum AS ENUM (
        'UPCOMING',
        'ACTIVE',
        'COMPLETED',
        'DELAYED',
        'SUSPENDED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE activity_status_enum AS ENUM (
        'NOT_STARTED',
        'IN_PROGRESS',
        'COMPLETED',
        'BLOCKED',
        'ON_HOLD'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 2. TABLE: project_classifications
-- Standardized project categorization taxonomy, standard overhead markups,
-- and contract retention presets.
-- ============================================================================

CREATE TABLE IF NOT EXISTS project_classifications (
    classification_id              VARCHAR(64) PRIMARY KEY,
    classification_code            VARCHAR(32) NOT NULL,
    classification_name            VARCHAR(128) NOT NULL,
    sector                         VARCHAR(32) NOT NULL,
    description                    TEXT,
    
    -- Commercial & Costing Policy Defaults
    std_overhead_markup_pct        NUMERIC(5,2) NOT NULL DEFAULT 10.00,
    std_retention_rate_pct         NUMERIC(5,2) NOT NULL DEFAULT 10.00,
    std_advance_recovery_pct       NUMERIC(5,2) NOT NULL DEFAULT 15.00,
    std_defect_liability_months    INTEGER NOT NULL DEFAULT 12,
    
    -- Status & Metadata
    status                         VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    is_system_template             BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Standard Multi-Tenant & Audit Fields
    tenant_id                      VARCHAR(64) NOT NULL DEFAULT 'DEFAULT_TENANT',
    created_at                     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by                     VARCHAR(64) NOT NULL DEFAULT 'SYSTEM',
    updated_at                     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by                     VARCHAR(64) NOT NULL DEFAULT 'SYSTEM',
    deleted_at                     TIMESTAMPTZ NULL,
    deleted_by                     VARCHAR(64) NULL,
    is_deleted                     BOOLEAN NOT NULL DEFAULT FALSE,
    row_version                    INTEGER NOT NULL DEFAULT 1,
    
    -- Table Constraints
    CONSTRAINT chk_proj_class_sector CHECK (sector IN (
        'ENERGY_UTILITIES', 'CONSTRUCTION_CIVIL', 'HEAVY_ENGINEERING', 
        'COMMERCIAL_BUILD', 'GOVERNMENT_INFRA', 'DEFENSE_SECURITY', 'MARITIME_OFFSHORE'
    )),
    CONSTRAINT chk_proj_class_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')),
    CONSTRAINT chk_proj_class_markup CHECK (std_overhead_markup_pct >= 0 AND std_overhead_markup_pct <= 100),
    CONSTRAINT chk_proj_class_retention CHECK (std_retention_rate_pct >= 0 AND std_retention_rate_pct <= 100),
    CONSTRAINT chk_proj_class_advance CHECK (std_advance_recovery_pct >= 0 AND std_advance_recovery_pct <= 100)
);

-- Unique index per tenant
CREATE UNIQUE INDEX IF NOT EXISTS uq_proj_class_code_tenant 
    ON project_classifications (tenant_id, classification_code) 
    WHERE is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS idx_proj_class_status 
    ON project_classifications (tenant_id, status, is_deleted);

-- ============================================================================
-- 3. TABLE: project_masters
-- Master Project Charters linking Contractual terms, Client Entity,
-- Organizational Hierarchy, Site Logistics, Budget Baselines, and Live Rollups.
-- ============================================================================

CREATE TABLE IF NOT EXISTS project_masters (
    project_id                     VARCHAR(64) PRIMARY KEY,
    project_code                   VARCHAR(64) NOT NULL,
    project_name                   VARCHAR(255) NOT NULL,
    
    -- Classification & Type Mapping
    classification_id              VARCHAR(64) NOT NULL REFERENCES project_classifications(classification_id) ON DELETE RESTRICT,
    project_type                   VARCHAR(32) NOT NULL DEFAULT 'EPC_COMMERCIAL',
    
    -- Organizational Context (Enterprise Hierarchy)
    company_id                     VARCHAR(64) NOT NULL,
    company_name                   VARCHAR(128) NOT NULL,
    branch_id                      VARCHAR(64) NOT NULL,
    branch_name                    VARCHAR(128) NOT NULL,
    department_id                  VARCHAR(64) NOT NULL,
    department_name                VARCHAR(128) NOT NULL,
    cost_center_id                 VARCHAR(64) NOT NULL,
    cost_center_code               VARCHAR(64) NOT NULL,
    
    -- Client Principal & Contract Reference
    client_id                      VARCHAR(64) NULL,
    client_entity_name             VARCHAR(255) NOT NULL,
    client_contact_person          VARCHAR(128) NOT NULL,
    client_email                   VARCHAR(128) NOT NULL,
    client_phone                   VARCHAR(64) NOT NULL,
    contract_number                VARCHAR(128) NOT NULL,
    
    -- Commercial & Financial Baseline
    contract_value                 NUMERIC(18,3) NOT NULL DEFAULT 0.000,
    currency_code                  VARCHAR(3) NOT NULL DEFAULT 'OMR',
    exchange_rate_to_base          NUMERIC(12,6) NOT NULL DEFAULT 1.000000,
    total_budget                   NUMERIC(18,3) NOT NULL DEFAULT 0.000,
    billing_method                 VARCHAR(32) NOT NULL DEFAULT 'PROGRESS_PERCENT_COMPLETION',
    retention_withheld_pct         NUMERIC(5,2) NOT NULL DEFAULT 10.00,
    retention_max_cap_amount       NUMERIC(18,3) NULL,
    advance_payment_received       NUMERIC(18,3) NOT NULL DEFAULT 0.000,
    advance_recovery_rate_pct      NUMERIC(5,2) NOT NULL DEFAULT 15.00,
    
    -- Leadership & Site Execution
    project_manager_id             VARCHAR(64) NULL,
    project_manager_name           VARCHAR(128) NOT NULL,
    site_engineer_id               VARCHAR(64) NULL,
    site_engineer_name             VARCHAR(128) NOT NULL,
    site_location                  VARCHAR(255) NOT NULL,
    latitude                       NUMERIC(10,7) NULL,
    longitude                      NUMERIC(10,7) NULL,
    
    -- Schedule Baseline & Milestones
    start_date                     DATE NOT NULL,
    target_completion_date         DATE NOT NULL,
    revised_completion_date        DATE NULL,
    actual_completion_date         DATE NULL,
    overall_progress_pct           NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    schedule_variance_days         INTEGER NOT NULL DEFAULT 0,
    
    -- Live Financial Accumulators (Rollup totals)
    total_committed_cost           NUMERIC(18,3) NOT NULL DEFAULT 0.000,
    total_actual_cost              NUMERIC(18,3) NOT NULL DEFAULT 0.000,
    total_billed_amount            NUMERIC(18,3) NOT NULL DEFAULT 0.000,
    total_received_amount          NUMERIC(18,3) NOT NULL DEFAULT 0.000,
    
    -- Status & Priority
    status                         VARCHAR(32) NOT NULL DEFAULT 'PLANNING',
    priority                       VARCHAR(32) NOT NULL DEFAULT 'MEDIUM',
    tags                           TEXT[] NULL,
    
    -- Standard Multi-Tenant & Audit Fields
    tenant_id                      VARCHAR(64) NOT NULL DEFAULT 'DEFAULT_TENANT',
    created_at                     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by                     VARCHAR(64) NOT NULL DEFAULT 'SYSTEM',
    updated_at                     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by                     VARCHAR(64) NOT NULL DEFAULT 'SYSTEM',
    deleted_at                     TIMESTAMPTZ NULL,
    deleted_by                     VARCHAR(64) NULL,
    is_deleted                     BOOLEAN NOT NULL DEFAULT FALSE,
    row_version                    INTEGER NOT NULL DEFAULT 1,
    
    -- Table Constraints
    CONSTRAINT chk_proj_contract_val CHECK (contract_value >= 0),
    CONSTRAINT chk_proj_budget_val CHECK (total_budget >= 0),
    CONSTRAINT chk_proj_progress_pct CHECK (overall_progress_pct >= 0.00 AND overall_progress_pct <= 100.00),
    CONSTRAINT chk_proj_retention_pct CHECK (retention_withheld_pct >= 0.00 AND retention_withheld_pct <= 100.00),
    CONSTRAINT chk_proj_dates CHECK (target_completion_date >= start_date),
    CONSTRAINT chk_proj_status CHECK (status IN (
        'PROPOSED', 'PLANNING', 'ACTIVE_IN_PROGRESS', 'ON_HOLD', 
        'SUBSTANTIALLY_COMPLETE', 'CLOSED', 'CANCELLED'
    )),
    CONSTRAINT chk_proj_priority CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL_FAST_TRACK')),
    CONSTRAINT chk_proj_billing_method CHECK (billing_method IN (
        'PROGRESS_PERCENT_COMPLETION', 'MILESTONE_DELIVERABLE', 'TIME_AND_MATERIALS', 
        'FIXED_LUMP_SUM', 'COST_PLUS_PERCENT'
    ))
);

-- Unique project code per tenant
CREATE UNIQUE INDEX IF NOT EXISTS uq_proj_master_code_tenant 
    ON project_masters (tenant_id, project_code) 
    WHERE is_deleted = FALSE;

-- Composite index on organizational context
CREATE INDEX IF NOT EXISTS idx_proj_master_org_ctx 
    ON project_masters (tenant_id, company_id, branch_id, department_id, cost_center_id);

-- Index on lifecycle status and operational priority
CREATE INDEX IF NOT EXISTS idx_proj_master_status_priority 
    ON project_masters (tenant_id, status, priority, is_deleted);

-- Index on leadership and client entity
CREATE INDEX IF NOT EXISTS idx_proj_master_pm 
    ON project_masters (tenant_id, project_manager_id);

CREATE INDEX IF NOT EXISTS idx_proj_master_client 
    ON project_masters (tenant_id, client_id);

-- ============================================================================
-- 4. TABLE: project_phases (WBS Level 1 Milestones)
-- Sequential milestones decomposing project charters into major deliverable gates.
-- ============================================================================

CREATE TABLE IF NOT EXISTS project_phases (
    phase_id                       VARCHAR(64) PRIMARY KEY,
    project_id                     VARCHAR(64) NOT NULL REFERENCES project_masters(project_id) ON DELETE CASCADE,
    
    -- Phase Details & Sequence
    phase_sequence                 INTEGER NOT NULL,
    phase_code                     VARCHAR(32) NOT NULL,
    phase_name                     VARCHAR(128) NOT NULL,
    description                    TEXT NULL,
    
    -- Timeline
    start_date                     DATE NOT NULL,
    end_date                       DATE NOT NULL,
    actual_start_date              DATE NULL,
    actual_end_date                DATE NULL,
    
    -- Costing & Progress Weightage
    budget_allocated               NUMERIC(18,3) NOT NULL DEFAULT 0.000,
    actual_spent                   NUMERIC(18,3) NOT NULL DEFAULT 0.000,
    weightage_pct                  NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    completion_pct                 NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    
    -- Status & Certification
    status                         VARCHAR(20) NOT NULL DEFAULT 'UPCOMING',
    is_milestone_billed            BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Standard Multi-Tenant & Audit Fields
    tenant_id                      VARCHAR(64) NOT NULL DEFAULT 'DEFAULT_TENANT',
    created_at                     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by                     VARCHAR(64) NOT NULL DEFAULT 'SYSTEM',
    updated_at                     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by                     VARCHAR(64) NOT NULL DEFAULT 'SYSTEM',
    deleted_at                     TIMESTAMPTZ NULL,
    deleted_by                     VARCHAR(64) NULL,
    is_deleted                     BOOLEAN NOT NULL DEFAULT FALSE,
    row_version                    INTEGER NOT NULL DEFAULT 1,
    
    -- Table Constraints
    CONSTRAINT chk_phase_seq CHECK (phase_sequence > 0),
    CONSTRAINT chk_phase_budget CHECK (budget_allocated >= 0),
    CONSTRAINT chk_phase_weightage CHECK (weightage_pct >= 0.00 AND weightage_pct <= 100.00),
    CONSTRAINT chk_phase_completion CHECK (completion_pct >= 0.00 AND completion_pct <= 100.00),
    CONSTRAINT chk_phase_dates CHECK (end_date >= start_date),
    CONSTRAINT chk_phase_status CHECK (status IN ('UPCOMING', 'ACTIVE', 'COMPLETED', 'DELAYED', 'SUSPENDED'))
);

-- Unique sequential phase order per project
CREATE UNIQUE INDEX IF NOT EXISTS uq_proj_phase_seq 
    ON project_phases (tenant_id, project_id, phase_sequence) 
    WHERE is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS idx_proj_phase_lookup 
    ON project_phases (tenant_id, project_id, status);

-- ============================================================================
-- 5. TABLE: project_activities (WBS Level 2+ Work Packages)
-- Detailed work packages carrying CPM dates, duration, floats, planned costs,
-- actual costs, and team leader assignments.
-- ============================================================================

CREATE TABLE IF NOT EXISTS project_activities (
    activity_id                    VARCHAR(64) PRIMARY KEY,
    project_id                     VARCHAR(64) NOT NULL REFERENCES project_masters(project_id) ON DELETE CASCADE,
    phase_id                       VARCHAR(64) NOT NULL REFERENCES project_phases(phase_id) ON DELETE CASCADE,
    
    -- WBS Hierarchical Coding
    wbs_code                       VARCHAR(64) NOT NULL,
    activity_name                  VARCHAR(255) NOT NULL,
    description                    TEXT NULL,
    
    -- Schedule & Critical Path Calculation
    duration_days                  INTEGER NOT NULL DEFAULT 1,
    start_date                     DATE NOT NULL,
    end_date                       DATE NOT NULL,
    actual_start_date              DATE NULL,
    actual_end_date                DATE NULL,
    early_start_date               DATE NULL,
    early_finish_date              DATE NULL,
    late_start_date                DATE NULL,
    late_finish_date               DATE NULL,
    total_float_days               INTEGER NOT NULL DEFAULT 0,
    free_float_days                INTEGER NOT NULL DEFAULT 0,
    is_critical_path               BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Costing & Earned Value Metrics
    planned_cost                   NUMERIC(18,3) NOT NULL DEFAULT 0.000,
    actual_cost                    NUMERIC(18,3) NOT NULL DEFAULT 0.000,
    earned_value                   NUMERIC(18,3) NOT NULL DEFAULT 0.000,
    progress_pct                   NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    
    -- Assignment & Cost Code
    assigned_leader_id             VARCHAR(64) NULL,
    assigned_team_leader           VARCHAR(128) NOT NULL,
    cost_code_id                   VARCHAR(64) NULL,
    
    -- Execution Status
    status                         VARCHAR(20) NOT NULL DEFAULT 'NOT_STARTED',
    
    -- Standard Multi-Tenant & Audit Fields
    tenant_id                      VARCHAR(64) NOT NULL DEFAULT 'DEFAULT_TENANT',
    created_at                     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by                     VARCHAR(64) NOT NULL DEFAULT 'SYSTEM',
    updated_at                     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by                     VARCHAR(64) NOT NULL DEFAULT 'SYSTEM',
    deleted_at                     TIMESTAMPTZ NULL,
    deleted_by                     VARCHAR(64) NULL,
    is_deleted                     BOOLEAN NOT NULL DEFAULT FALSE,
    row_version                    INTEGER NOT NULL DEFAULT 1,
    
    -- Table Constraints
    CONSTRAINT chk_act_duration CHECK (duration_days >= 0),
    CONSTRAINT chk_act_planned_cost CHECK (planned_cost >= 0),
    CONSTRAINT chk_act_progress CHECK (progress_pct >= 0.00 AND progress_pct <= 100.00),
    CONSTRAINT chk_act_dates CHECK (end_date >= start_date),
    CONSTRAINT chk_act_status CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED', 'ON_HOLD'))
);

-- Unique WBS code per project
CREATE UNIQUE INDEX IF NOT EXISTS uq_proj_act_wbs 
    ON project_activities (tenant_id, project_id, wbs_code) 
    WHERE is_deleted = FALSE;

CREATE INDEX IF NOT EXISTS idx_proj_act_phase_lookup 
    ON project_activities (tenant_id, phase_id, status);

CREATE INDEX IF NOT EXISTS idx_proj_act_critical 
    ON project_activities (tenant_id, project_id, is_critical_path) 
    WHERE is_critical_path = TRUE;

-- ============================================================================
-- 6. TABLE: project_activity_dependencies
-- Precedence graph defining CPM logic (Finish-to-Start, Start-to-Start, etc.)
-- ============================================================================

CREATE TABLE IF NOT EXISTS project_activity_dependencies (
    dependency_id                  VARCHAR(64) PRIMARY KEY,
    project_id                     VARCHAR(64) NOT NULL REFERENCES project_masters(project_id) ON DELETE CASCADE,
    predecessor_activity_id        VARCHAR(64) NOT NULL REFERENCES project_activities(activity_id) ON DELETE CASCADE,
    successor_activity_id          VARCHAR(64) NOT NULL REFERENCES project_activities(activity_id) ON DELETE CASCADE,
    dependency_type                VARCHAR(4) NOT NULL DEFAULT 'FS',
    lag_days                       INTEGER NOT NULL DEFAULT 0,
    
    -- Standard Multi-Tenant & Audit Fields
    tenant_id                      VARCHAR(64) NOT NULL DEFAULT 'DEFAULT_TENANT',
    created_at                     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by                     VARCHAR(64) NOT NULL DEFAULT 'SYSTEM',
    updated_at                     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by                     VARCHAR(64) NOT NULL DEFAULT 'SYSTEM',
    deleted_at                     TIMESTAMPTZ NULL,
    deleted_by                     VARCHAR(64) NULL,
    is_deleted                     BOOLEAN NOT NULL DEFAULT FALSE,
    row_version                    INTEGER NOT NULL DEFAULT 1,
    
    -- Table Constraints
    CONSTRAINT chk_dep_type CHECK (dependency_type IN ('FS', 'SS', 'FF', 'SF')),
    CONSTRAINT chk_dep_not_self CHECK (predecessor_activity_id <> successor_activity_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_proj_dep_pair 
    ON project_activity_dependencies (tenant_id, project_id, predecessor_activity_id, successor_activity_id) 
    WHERE is_deleted = FALSE;

-- ============================================================================
-- 7. TABLE: project_audit_logs
-- Immutable change logs capturing every insert, update, progress shift, and deletion.
-- ============================================================================

CREATE TABLE IF NOT EXISTS project_audit_logs (
    audit_id                       VARCHAR(64) PRIMARY KEY,
    tenant_id                      VARCHAR(64) NOT NULL DEFAULT 'DEFAULT_TENANT',
    table_name                     VARCHAR(64) NOT NULL,
    record_id                      VARCHAR(64) NOT NULL,
    action_type                    VARCHAR(32) NOT NULL,
    field_name                     VARCHAR(64) NULL,
    old_value                      TEXT NULL,
    new_value                      TEXT NULL,
    changed_by                     VARCHAR(64) NOT NULL,
    changed_by_name                VARCHAR(128) NOT NULL,
    changed_at                     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address                     VARCHAR(45) NULL,
    user_agent                     TEXT NULL
);

CREATE INDEX IF NOT EXISTS idx_proj_audit_query 
    ON project_audit_logs (tenant_id, table_name, record_id, changed_at DESC);

-- ============================================================================
-- 8. AUTOMATIC AUDIT TRIGGER FUNCTION
-- Automatically increments row_version and updates updated_at timestamp on change.
-- ============================================================================

CREATE OR REPLACE FUNCTION trg_fn_update_timestamp_and_version()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    NEW.row_version = OLD.row_version + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Bind triggers to master and transaction tables
DROP TRIGGER IF EXISTS trg_proj_class_upd ON project_classifications;
CREATE TRIGGER trg_proj_class_upd
    BEFORE UPDATE ON project_classifications
    FOR EACH ROW
    EXECUTE FUNCTION trg_fn_update_timestamp_and_version();

DROP TRIGGER IF EXISTS trg_proj_master_upd ON project_masters;
CREATE TRIGGER trg_proj_master_upd
    BEFORE UPDATE ON project_masters
    FOR EACH ROW
    EXECUTE FUNCTION trg_fn_update_timestamp_and_version();

DROP TRIGGER IF EXISTS trg_proj_phase_upd ON project_phases;
CREATE TRIGGER trg_proj_phase_upd
    BEFORE UPDATE ON project_phases
    FOR EACH ROW
    EXECUTE FUNCTION trg_fn_update_timestamp_and_version();

DROP TRIGGER IF EXISTS trg_proj_activity_upd ON project_activities;
CREATE TRIGGER trg_proj_activity_upd
    BEFORE UPDATE ON project_activities
    FOR EACH ROW
    EXECUTE FUNCTION trg_fn_update_timestamp_and_version();

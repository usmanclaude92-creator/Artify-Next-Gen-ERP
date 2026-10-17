import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ERP_MODULES } from '../navigation/erpHierarchy';
import { SystemManagementModuleRunner } from '../modules/system-management/SystemManagementModuleRunner';
import { BusinessIntelligenceModuleRunner } from '../modules/business-intelligence/BusinessIntelligenceModuleRunner';
import { AdministrationModuleRunner } from '../modules/administration/AdministrationModuleRunner';
import { BankingTreasuryModuleRunner } from '../modules/banking-treasury/BankingTreasuryModuleRunner';
import { ProcurementModuleRunner } from '../modules/procurement/ProcurementModuleRunner';
import { SalesCrmModuleRunner } from '../modules/sales-crm/SalesCrmModuleRunner';
import { InventoryModuleRunner } from '../modules/inventory/InventoryModuleRunner';
import { ManufacturingModuleRunner } from '../modules/manufacturing/ManufacturingModuleRunner';
import { HrModuleRunner } from '../modules/hr/HrModuleRunner';
import { ProjectManagementModuleRunner } from '../modules/projects/ProjectManagementModuleRunner';
import { BudgetingModuleRunner } from '../modules/budgeting/BudgetingModuleRunner';
import { ScmModuleRunner } from '../modules/scm/ScmModuleRunner';
import { AssetModuleRunner } from '../modules/assets/AssetModuleRunner';
import { QualityModuleRunner } from '../modules/quality/QualityModuleRunner';
import { ConstructionModuleRunner } from '../modules/construction/ConstructionModuleRunner';
import { FinanceModuleRunner } from '../modules/finance/FinanceModuleRunner';
import { ComplianceModuleRunner } from '../modules/compliance/ComplianceModuleRunner';

const RUNNERS: Record<string, React.ComponentType<any>> = {
  'system-management': SystemManagementModuleRunner,
  'business-intelligence': BusinessIntelligenceModuleRunner,
  administration: AdministrationModuleRunner,
  'banking-treasury': BankingTreasuryModuleRunner,
  procurement: ProcurementModuleRunner,
  'sales-crm': SalesCrmModuleRunner,
  inventory: InventoryModuleRunner,
  manufacturing: ManufacturingModuleRunner,
  hr: HrModuleRunner,
  projects: ProjectManagementModuleRunner,
  budgeting: BudgetingModuleRunner,
  scm: ScmModuleRunner,
  assets: AssetModuleRunner,
  quality: QualityModuleRunner,
  construction: ConstructionModuleRunner,
  'financial-accounting': FinanceModuleRunner,
  'compliance-risk-audit': ComplianceModuleRunner,
};

describe('navigation data', () => {
  it('defines 17 modules with unique ids', () => {
    expect(ERP_MODULES).toHaveLength(17);
    expect(new Set(ERP_MODULES.map(m => m.id)).size).toBe(17);
  });

  it('has a runner for every module', () => {
    for (const m of ERP_MODULES) expect(RUNNERS[m.id], m.id).toBeDefined();
  });
});

describe.each(Object.entries(RUNNERS))('%s runner', (id, Runner) => {
  it('renders its landing view without throwing', () => {
    const module = ERP_MODULES.find(m => m.id === id)!;
    const { container } = render(
      <Runner
        module={module}
        onNavigate={vi.fn()}
        isFavorite={false}
        onToggleFavorite={vi.fn()}
        activeRole="Administrator"
      />
    );
    expect(container.childElementCount).toBeGreaterThan(0);
  });
});

import { DataSource, ReportDefinition, ReportFilter } from '../types';
import { DATA_SOURCE_REGISTRY } from '../data-sources/registry';
export { DATA_SOURCE_REGISTRY };
import {
  MOCK_SALES_RECORDS,
  MOCK_PURCHASE_RECORDS,
  MOCK_INVENTORY_RECORDS,
  MOCK_HR_RECORDS,
  MOCK_PROJECT_RECORDS,
  MOCK_BUDGET_VS_ACTUAL
} from '../data-sources/mockDataProviders';

export interface ExecutionResult {
  headers: { key: string; label: string; dataType: string }[];
  rows: Record<string, any>[];
  totalRowCount: number;
  aggregatedSummary?: Record<string, number>;
  executionTimeMs: number;
}

export function executeReportQuery(report: ReportDefinition): ExecutionResult {
  const startTime = performance.now();
  const ds = DATA_SOURCE_REGISTRY.find(d => d.id === report.dataSourceId);

  let rawData: any[] = [];
  if (report.dataSourceId === 'ds-sales-invoices') {
    rawData = MOCK_SALES_RECORDS.map(r => ({
      sl_invoice_no: r.id,
      sl_customer_name: r.customerName,
      sl_category: r.category,
      sl_branch: r.branchName,
      sl_rep: r.salesRep,
      sl_date: r.period,
      sl_revenue: r.revenueOMR,
      sl_cogs: r.cogsOMR,
      sl_margin_amt: r.revenueOMR - r.cogsOMR,
      sl_units: r.volumeUnits
    }));
  } else if (report.dataSourceId === 'ds-procurement-pos') {
    rawData = MOCK_PURCHASE_RECORDS.map(r => ({
      po_number: r.id,
      po_vendor_name: r.supplierName,
      po_category: r.category,
      po_status: 'Approved',
      po_order_date: r.period,
      po_amount: r.spendOMR,
      po_lead_time: r.leadTimeDaysAvg,
      po_otif_rate: r.otifPercent
    }));
  } else if (report.dataSourceId === 'ds-inventory-valuation') {
    rawData = MOCK_INVENTORY_RECORDS.map(r => ({
      inv_item_code: r.itemCode,
      inv_item_name: r.itemName,
      inv_category: r.category,
      inv_warehouse: r.warehouse,
      inv_qty: r.quantityOnHand,
      inv_unit_cost: r.unitCostOMR,
      inv_valuation: r.totalValuationOMR,
      inv_turnover: r.stockTurnoverRatio
    }));
  } else if (report.dataSourceId === 'ds-hr-workforce') {
    rawData = MOCK_HR_RECORDS.map(r => ({
      hr_dept: r.department,
      hr_headcount: r.headcount,
      hr_turnover: r.turnoverRatePercent,
      hr_attendance: r.attendanceRatePercent,
      hr_overtime: r.overtimeHoursTotal
    }));
  } else if (report.dataSourceId === 'ds-projects-eva') {
    rawData = MOCK_PROJECT_RECORDS.map(r => ({
      prj_code: r.projectCode,
      prj_name: r.projectName,
      prj_client: r.clientName,
      prj_manager: r.projectManager,
      prj_contract_value: r.contractValueOMR,
      prj_actual_cost: r.actualCostOMR,
      prj_progress: r.progressPercent,
      prj_cpi: r.cpi
    }));
  } else if (report.dataSourceId === 'ds-budget-planning') {
    rawData = MOCK_BUDGET_VS_ACTUAL.map(r => ({
      bg_cost_center: r.accountOrDept,
      bg_category: r.category,
      bg_budget_amt: r.ytdBudgetOMR,
      bg_actual_amt: r.ytdActualOMR,
      bg_variance_amt: r.varianceOMR
    }));
  } else {
    // Default fallback
    rawData = [
      { field_01: 'Record A', field_02: 120000, field_03: 'Muscat' },
      { field_01: 'Record B', field_02: 85000, field_03: 'Sohar' }
    ];
  }

  // 1. Apply Filters
  let filtered = rawData.filter(row => {
    return report.filters.every(filter => evaluateFilter(row, filter));
  });

  // 2. Compute Calculated Fields (Safe Arithmetic Evaluation)
  if (report.calculatedFields && report.calculatedFields.length > 0) {
    filtered = filtered.map(row => {
      const updatedRow = { ...row };
      report.calculatedFields.forEach(calc => {
        updatedRow[calc.name] = evaluateCalculatedExpression(calc.expression, updatedRow);
      });
      return updatedRow;
    });
  }

  // 3. Sorting
  if (report.sorts && report.sorts.length > 0) {
    filtered.sort((a, b) => {
      for (const sort of report.sorts) {
        const valA = a[sort.fieldId];
        const valB = b[sort.fieldId];
        if (valA === valB) continue;
        if (sort.direction === 'asc') {
          return valA > valB ? 1 : -1;
        } else {
          return valA < valB ? 1 : -1;
        }
      }
      return 0;
    });
  }

  // 4. Construct Headers
  const allFields = ds ? ds.fields : [];
  const selectedFieldIds = report.selectedFields.length > 0 ? report.selectedFields : allFields.map(f => f.id);
  
  const headers = selectedFieldIds.map(fId => {
    const f = allFields.find(field => field.id === fId);
    if (f) return { key: f.id, label: f.label, dataType: f.dataType };
    // Check calculated fields
    const calc = report.calculatedFields?.find(c => c.name === fId);
    if (calc) return { key: calc.name, label: calc.label, dataType: calc.outputType };
    return { key: fId, label: fId, dataType: 'string' };
  });

  // Add calculated field headers if not included
  report.calculatedFields?.forEach(calc => {
    if (!headers.some(h => h.key === calc.name)) {
      headers.push({ key: calc.name, label: calc.label, dataType: calc.outputType });
    }
  });

  const executionTimeMs = Math.round(performance.now() - startTime);

  return {
    headers,
    rows: filtered,
    totalRowCount: filtered.length,
    executionTimeMs
  };
}

function evaluateFilter(row: any, filter: ReportFilter): boolean {
  const val = row[filter.fieldId];
  if (val === undefined || val === null) return true;
  const target = filter.value;

  switch (filter.operator) {
    case 'equals':
      return String(val).toLowerCase() === String(target).toLowerCase();
    case 'not_equals':
      return String(val).toLowerCase() !== String(target).toLowerCase();
    case 'contains':
      return String(val).toLowerCase().includes(String(target).toLowerCase());
    case 'starts_with':
      return String(val).toLowerCase().startsWith(String(target).toLowerCase());
    case 'greater_than':
      return Number(val) > Number(target);
    case 'less_than':
      return Number(val) < Number(target);
    case 'between':
      return Number(val) >= Number(target) && Number(val) <= Number(filter.valueSecondary || target);
    case 'in_list':
      if (Array.isArray(target)) return target.includes(val);
      return String(target).split(',').map(s => s.trim().toLowerCase()).includes(String(val).toLowerCase());
    default:
      return true;
  }
}

/**
 * Safe token-based arithmetic evaluator for calculated fields.
 * Replaces bracketed field names like [sl_margin_amt] with numeric values.
 */
function evaluateCalculatedExpression(expression: string, row: Record<string, any>): number {
  try {
    let sanitized = expression;
    // Replace [field_name] with row value
    const matches = expression.match(/\[([a-zA-Z0-9_]+)\]/g);
    if (matches) {
      matches.forEach(m => {
        const fieldName = m.replace('[', '').replace(']', '');
        const val = Number(row[fieldName]) || 0;
        sanitized = sanitized.replace(m, String(val));
      });
    }

    // Only allow digits, arithmetic operators (+, -, *, /, (, ), .) and whitespace
    if (!/^[0-9+\-*/().\s]+$/.test(sanitized)) {
      return 0;
    }

    // Safe mathematical evaluation via Function constructor with strict no-op scope
    // eslint-disable-next-line no-new-func
    const result = new Function(`'use strict'; return (${sanitized});`)();
    return typeof result === 'number' && !isNaN(result) && isFinite(result) ? Number(result.toFixed(2)) : 0;
  } catch (err) {
    return 0;
  }
}

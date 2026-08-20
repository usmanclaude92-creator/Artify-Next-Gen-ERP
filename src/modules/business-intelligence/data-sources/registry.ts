import { DataSource } from '../types';

export const DATA_SOURCE_REGISTRY: DataSource[] = [
  {
    id: 'ds-financial-gl',
    code: 'DS-01',
    name: 'General Ledger & Financial Accounting',
    domain: 'Financial',
    description: 'Multi-entity chart of accounts, journal vouchers, subledger balances, and P&L/Balance Sheet line items.',
    status: 'Available (Demo Data)',
    isLive: false,
    sampleRecordCount: 48200,
    fields: [
      { id: 'gl_account_code', name: 'Account Code', label: 'GL Account Code', dataType: 'string', type: 'dimension' },
      { id: 'gl_account_name', name: 'Account Name', label: 'GL Account Name', dataType: 'string', type: 'dimension' },
      { id: 'gl_category', name: 'Account Category', label: 'Financial Category', dataType: 'string', type: 'dimension' },
      { id: 'gl_company', name: 'Company Entity', label: 'Legal Company', dataType: 'string', type: 'dimension' },
      { id: 'gl_branch', name: 'Branch Site', label: 'Operating Branch', dataType: 'string', type: 'dimension' },
      { id: 'gl_dept', name: 'Department', label: 'Cost Center Department', dataType: 'string', type: 'dimension' },
      { id: 'gl_period', name: 'Fiscal Period', label: 'Period (YYYY-MM)', dataType: 'date', type: 'dimension' },
      { id: 'gl_debit', name: 'Debit Amount', label: 'Debit (OMR)', dataType: 'currency', type: 'measure', aggregationType: 'sum' },
      { id: 'gl_credit', name: 'Credit Amount', label: 'Credit (OMR)', dataType: 'currency', type: 'measure', aggregationType: 'sum' },
      { id: 'gl_net_amount', name: 'Net Amount', label: 'Net Balance (OMR)', dataType: 'currency', type: 'measure', aggregationType: 'sum' }
    ]
  },
  {
    id: 'ds-sales-invoices',
    code: 'DS-02',
    name: 'Sales & Customer Invoices',
    domain: 'Sales',
    description: 'Customer order logs, billing invoices, product lines, sales reps, and commercial gross margins.',
    status: 'Available (Demo Data)',
    isLive: false,
    sampleRecordCount: 18450,
    fields: [
      { id: 'sl_invoice_no', name: 'Invoice Number', label: 'Tax Invoice ID', dataType: 'string', type: 'dimension' },
      { id: 'sl_customer_name', name: 'Customer Name', label: 'Client / Account', dataType: 'string', type: 'dimension' },
      { id: 'sl_category', name: 'Product Category', label: 'Product Segment', dataType: 'string', type: 'dimension' },
      { id: 'sl_branch', name: 'Sales Branch', label: 'Territory Branch', dataType: 'string', type: 'dimension' },
      { id: 'sl_rep', name: 'Sales Representative', label: 'Account Executive', dataType: 'string', type: 'dimension' },
      { id: 'sl_date', name: 'Invoice Date', label: 'Posting Date', dataType: 'date', type: 'dimension' },
      { id: 'sl_revenue', name: 'Gross Revenue', label: 'Revenue (OMR)', dataType: 'currency', type: 'measure', aggregationType: 'sum' },
      { id: 'sl_cogs', name: 'Direct COGS', label: 'Cost of Goods (OMR)', dataType: 'currency', type: 'measure', aggregationType: 'sum' },
      { id: 'sl_margin_amt', name: 'Gross Profit', label: 'Gross Profit (OMR)', dataType: 'currency', type: 'measure', aggregationType: 'sum' },
      { id: 'sl_units', name: 'Units Sold', label: 'Quantity', dataType: 'number', type: 'measure', aggregationType: 'sum' }
    ]
  },
  {
    id: 'ds-procurement-pos',
    code: 'DS-03',
    name: 'Procurement & Purchase Commitments',
    domain: 'Procurement',
    description: 'Vendor purchase orders, commodity spending, lead times, and fulfillment accuracy metrics.',
    status: 'Available (Demo Data)',
    isLive: false,
    sampleRecordCount: 9340,
    fields: [
      { id: 'po_number', name: 'PO Number', label: 'Purchase Order ID', dataType: 'string', type: 'dimension' },
      { id: 'po_vendor_name', name: 'Vendor Name', label: 'Supplier Enterprise', dataType: 'string', type: 'dimension' },
      { id: 'po_category', name: 'Spend Category', label: 'Procurement Category', dataType: 'string', type: 'dimension' },
      { id: 'po_status', name: 'PO Status', label: 'Commitment Status', dataType: 'string', type: 'dimension' },
      { id: 'po_order_date', name: 'Order Date', label: 'Placement Date', dataType: 'date', type: 'dimension' },
      { id: 'po_amount', name: 'Spend Amount', label: 'PO Total (OMR)', dataType: 'currency', type: 'measure', aggregationType: 'sum' },
      { id: 'po_lead_time', name: 'Lead Time Days', label: 'Lead Time (Days)', dataType: 'number', type: 'measure', aggregationType: 'avg' },
      { id: 'po_otif_rate', name: 'OTIF Score', label: 'On-Time In-Full %', dataType: 'percent', type: 'measure', aggregationType: 'avg' }
    ]
  },
  {
    id: 'ds-inventory-valuation',
    code: 'DS-04',
    name: 'Inventory Valuation & Stock Turnover',
    domain: 'Inventory',
    description: 'Warehouse on-hand quantities, weighted average costs, stock turnover, and safety stock status.',
    status: 'Available (Demo Data)',
    isLive: false,
    sampleRecordCount: 6520,
    fields: [
      { id: 'inv_item_code', name: 'Item Code', label: 'SKU Code', dataType: 'string', type: 'dimension' },
      { id: 'inv_item_name', name: 'Item Description', label: 'Product Name', dataType: 'string', type: 'dimension' },
      { id: 'inv_category', name: 'Item Category', label: 'Material Family', dataType: 'string', type: 'dimension' },
      { id: 'inv_warehouse', name: 'Warehouse Location', label: 'Logistics Facility', dataType: 'string', type: 'dimension' },
      { id: 'inv_qty', name: 'On-Hand Stock', label: 'Quantity Available', dataType: 'number', type: 'measure', aggregationType: 'sum' },
      { id: 'inv_unit_cost', name: 'Unit Cost', label: 'Unit Cost (OMR)', dataType: 'currency', type: 'measure', aggregationType: 'avg' },
      { id: 'inv_valuation', name: 'Total Valuation', label: 'Total Value (OMR)', dataType: 'currency', type: 'measure', aggregationType: 'sum' },
      { id: 'inv_turnover', name: 'Turnover Ratio', label: 'Annual Turnover', dataType: 'number', type: 'measure', aggregationType: 'avg' }
    ]
  },
  {
    id: 'ds-projects-eva',
    code: 'DS-05',
    name: 'Project Accounting & Earned Value (EVA)',
    domain: 'Projects',
    description: 'Milestone delivery, contract value, budget burn, Earned Value Analysis, and profitability tracking.',
    status: 'Available (Demo Data)',
    isLive: false,
    sampleRecordCount: 380,
    fields: [
      { id: 'prj_code', name: 'Project Code', label: 'Project WBS ID', dataType: 'string', type: 'dimension' },
      { id: 'prj_name', name: 'Project Name', label: 'Engagement Title', dataType: 'string', type: 'dimension' },
      { id: 'prj_client', name: 'Client Account', label: 'Contracting Client', dataType: 'string', type: 'dimension' },
      { id: 'prj_manager', name: 'Project Director', label: 'Lead Manager', dataType: 'string', type: 'dimension' },
      { id: 'prj_contract_value', name: 'Contract Value', label: 'Total Value (OMR)', dataType: 'currency', type: 'measure', aggregationType: 'sum' },
      { id: 'prj_actual_cost', name: 'Actual Cost', label: 'Actual Incurred (OMR)', dataType: 'currency', type: 'measure', aggregationType: 'sum' },
      { id: 'prj_progress', name: 'Progress %', label: 'Physical Progress %', dataType: 'percent', type: 'measure', aggregationType: 'avg' },
      { id: 'prj_cpi', name: 'CPI Index', label: 'Cost Efficiency Index', dataType: 'number', type: 'measure', aggregationType: 'avg' }
    ]
  },
  {
    id: 'ds-hr-workforce',
    code: 'DS-06',
    name: 'Workforce & HR Analytics',
    domain: 'HR',
    description: 'Headcount distribution, retention metrics, overtime ratios, training hours, and payroll allocation.',
    status: 'Available (Demo Data)',
    isLive: false,
    sampleRecordCount: 1420,
    fields: [
      { id: 'hr_dept', name: 'Department', label: 'Business Department', dataType: 'string', type: 'dimension' },
      { id: 'hr_headcount', name: 'Active Headcount', label: 'Full-Time Staff', dataType: 'number', type: 'measure', aggregationType: 'sum' },
      { id: 'hr_turnover', name: 'Turnover Rate %', label: 'Annual Turnover %', dataType: 'percent', type: 'measure', aggregationType: 'avg' },
      { id: 'hr_attendance', name: 'Attendance Rate', label: 'Attendance %', dataType: 'percent', type: 'measure', aggregationType: 'avg' },
      { id: 'hr_overtime', name: 'Overtime Hours', label: 'Total Overtime Hrs', dataType: 'number', type: 'measure', aggregationType: 'sum' }
    ]
  },
  {
    id: 'ds-budget-planning',
    code: 'DS-07',
    name: 'Annual Operating Budget & Forecasts',
    domain: 'Budgeting',
    description: 'Approved baseline budgets, quarterly forecasts, operational variances, and capex allocations.',
    status: 'Available (Demo Data)',
    isLive: false,
    sampleRecordCount: 3200,
    fields: [
      { id: 'bg_cost_center', name: 'Cost Center', label: 'Cost Center Code', dataType: 'string', type: 'dimension' },
      { id: 'bg_category', name: 'Expense Category', label: 'Budget Line Category', dataType: 'string', type: 'dimension' },
      { id: 'bg_budget_amt', name: 'Annual Budget', label: 'Approved Budget (OMR)', dataType: 'currency', type: 'measure', aggregationType: 'sum' },
      { id: 'bg_actual_amt', name: 'Actual Spend', label: 'YTD Incurred (OMR)', dataType: 'currency', type: 'measure', aggregationType: 'sum' },
      { id: 'bg_variance_amt', name: 'Net Variance', label: 'Variance (OMR)', dataType: 'currency', type: 'measure', aggregationType: 'sum' }
    ]
  },
  {
    id: 'ds-cash-bank',
    code: 'DS-08',
    name: 'Cash & Treasury Banking Feeds',
    domain: 'Financial',
    description: 'Multi-currency commercial accounts, liquidity forecasts, unposted bank entries, and sweep deposits.',
    status: 'Coming in Future Phase',
    isLive: false,
    sampleRecordCount: 0,
    fields: [
      { id: 'cb_bank_name', name: 'Bank Name', label: 'Financial Institution', dataType: 'string', type: 'dimension' },
      { id: 'cb_balance', name: 'Current Liquidity', label: 'Account Balance (OMR)', dataType: 'currency', type: 'measure', aggregationType: 'sum' }
    ]
  }
];

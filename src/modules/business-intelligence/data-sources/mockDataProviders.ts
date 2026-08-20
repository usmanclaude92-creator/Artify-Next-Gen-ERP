import {
  ProfitAndLossLineItem,
  BalanceSheetCategory,
  CashFlowActivity,
  FinancialRatio,
  SalesReportRecord,
  PurchaseReportRecord,
  InventoryReportRecord,
  HrReportRecord,
  ProjectReportRecord,
  ProfitabilityAnalysisItem,
  CostAnalysisItem,
  CustomerAnalyticsRecord,
  SupplierAnalyticsRecord,
  BudgetVsActualLine,
  AgingBucketSchedule,
  DeepVarianceFactor,
  KPIDefinition,
  KPITarget,
  KPIScorecard,
  ReportDefinition,
  ScheduledReportConfig,
  AIInsight
} from '../types';

// ==========================================
// 1. EXECUTIVE KPI OVERVIEW (DEMO DATA)
// ==========================================
export const MOCK_EXECUTIVE_METRICS = {
  currency: 'OMR',
  revenueYTD: 14850200,
  revenuePriorYTD: 13210400,
  revenueGrowthPercent: 12.41,
  grossProfitYTD: 5643000,
  grossMarginPercent: 38.0,
  operatingExpensesYTD: 3120000,
  operatingProfitEBITDA: 2523000,
  netProfitYTD: 2185400,
  netMarginPercent: 14.72,
  cashPosition: 3410500,
  accountsReceivable: 4120800,
  accountsPayable: 2280600,
  workingCapital: 5250700,
  inventoryValuation: 2840000,
  activeProjectsCount: 42,
  averageProjectMarginPercent: 24.8,
  kpiAchievementRate: 91.4,
  outstandingApprovalsCount: 8,
  budgetUtilizationPercent: 78.6,
  daysSalesOutstanding: 48,
  daysPayableOutstanding: 39
};

export const MOCK_MONTHLY_FINANCIAL_TRENDS = [
  { month: 'Jan', revenue: 1120000, expenses: 840000, profit: 280000, cash: 3100000, budget: 1100000 },
  { month: 'Feb', revenue: 1180000, expenses: 860000, profit: 320000, cash: 3150000, budget: 1120000 },
  { month: 'Mar', revenue: 1240000, expenses: 890000, profit: 350000, cash: 3220000, budget: 1150000 },
  { month: 'Apr', revenue: 1190000, expenses: 870000, profit: 320000, cash: 3180000, budget: 1180000 },
  { month: 'May', revenue: 1290000, expenses: 910000, profit: 380000, cash: 3290000, budget: 1200000 },
  { month: 'Jun', revenue: 1350000, expenses: 940000, profit: 410000, cash: 3340000, budget: 1220000 },
  { month: 'Jul', revenue: 1310000, expenses: 920000, profit: 390000, cash: 3380000, budget: 1250000 },
  { month: 'Aug', revenue: 1420000, expenses: 960000, profit: 460000, cash: 3410500, budget: 1280000 }
];

export const MOCK_REVENUE_BY_BRANCH = [
  { branch: 'Muscat HQ & Capital', revenue: 6420000, percent: 43.2, growth: '+14.8%' },
  { branch: 'Sohar Industrial Freezone', revenue: 3890000, percent: 26.2, growth: '+11.2%' },
  { branch: 'Salalah Port & Logistics', revenue: 2680000, percent: 18.0, growth: '+9.4%' },
  { branch: 'Nizwa Regional Distribution', revenue: 1860200, percent: 12.6, growth: '+13.5%' }
];

export const MOCK_EXPENSES_BY_DEPARTMENT = [
  { department: 'Manufacturing & Operations', amount: 1180000, share: 37.8 },
  { department: 'Logistics & Supply Chain', amount: 680000, share: 21.8 },
  { department: 'Sales & Client Partnerships', amount: 540000, share: 17.3 },
  { department: 'Corporate General & Admin', amount: 410000, share: 13.1 },
  { department: 'Information Technology & AI', amount: 310000, share: 10.0 }
];

// ==========================================
// 2. FINANCIAL STATEMENTS (DEMO DATA)
// ==========================================
export const MOCK_PROFIT_AND_LOSS: ProfitAndLossLineItem[] = [
  {
    id: 'pnl-01',
    code: '4000',
    accountGroup: 'Revenue',
    name: 'Gross Operating Revenue',
    currentActualOMR: 14850200,
    priorActualOMR: 13210400,
    budgetOMR: 14500000,
    varianceOMR: 350200,
    variancePercent: 2.41,
    status: 'Favorable',
    depth: 0,
    children: [
      { id: 'pnl-01-01', code: '4100', accountGroup: 'Revenue', name: 'Commercial Sales & Projects', currentActualOMR: 10240000, priorActualOMR: 9100000, budgetOMR: 10000000, varianceOMR: 240000, variancePercent: 2.4, status: 'Favorable', depth: 1 },
      { id: 'pnl-01-02', code: '4200', accountGroup: 'Revenue', name: 'Maintenance & Service Contracts', currentActualOMR: 3410200, priorActualOMR: 2980000, budgetOMR: 3300000, varianceOMR: 110200, variancePercent: 3.3, status: 'Favorable', depth: 1 },
      { id: 'pnl-01-03', code: '4300', accountGroup: 'Revenue', name: 'Software & Technology Licensing', currentActualOMR: 1200000, priorActualOMR: 1130400, budgetOMR: 1200000, varianceOMR: 0, variancePercent: 0.0, status: 'Neutral', depth: 1 }
    ]
  },
  {
    id: 'pnl-02',
    code: '5000',
    accountGroup: 'Cost of Goods Sold',
    name: 'Cost of Sales (COGS)',
    currentActualOMR: 9207200,
    priorActualOMR: 8190000,
    budgetOMR: 8990000,
    varianceOMR: -217200,
    variancePercent: -2.42,
    status: 'Unfavorable',
    depth: 0,
    children: [
      { id: 'pnl-02-01', code: '5100', accountGroup: 'Cost of Goods Sold', name: 'Raw Material Consumption', currentActualOMR: 5410000, priorActualOMR: 4800000, budgetOMR: 5250000, varianceOMR: -160000, variancePercent: -3.0, status: 'Unfavorable', depth: 1 },
      { id: 'pnl-02-02', code: '5200', accountGroup: 'Cost of Goods Sold', name: 'Direct Project Labor', currentActualOMR: 2640000, priorActualOMR: 2390000, budgetOMR: 2600000, varianceOMR: -40000, variancePercent: -1.5, status: 'Unfavorable', depth: 1 },
      { id: 'pnl-02-03', code: '5300', accountGroup: 'Cost of Goods Sold', name: 'Freight & Port Handling Fees', currentActualOMR: 1157200, priorActualOMR: 1000000, budgetOMR: 1140000, varianceOMR: -17200, variancePercent: -1.5, status: 'Unfavorable', depth: 1 }
    ]
  },
  {
    id: 'pnl-03',
    code: 'GP',
    accountGroup: 'Gross Profit',
    name: 'GROSS PROFIT',
    currentActualOMR: 5643000,
    priorActualOMR: 5020400,
    budgetOMR: 5510000,
    varianceOMR: 133000,
    variancePercent: 2.41,
    status: 'Favorable',
    depth: 0
  },
  {
    id: 'pnl-04',
    code: '6000',
    accountGroup: 'Operating Expenses',
    name: 'Operating Overheads (OPEX)',
    currentActualOMR: 3120000,
    priorActualOMR: 2890000,
    budgetOMR: 3200000,
    varianceOMR: 80000,
    variancePercent: 2.5,
    status: 'Favorable',
    depth: 0,
    children: [
      { id: 'pnl-04-01', code: '6100', accountGroup: 'Operating Expenses', name: 'Personnel & Executive Salaries', currentActualOMR: 1650000, priorActualOMR: 1520000, budgetOMR: 1680000, varianceOMR: 30000, variancePercent: 1.8, status: 'Favorable', depth: 1 },
      { id: 'pnl-04-02', code: '6200', accountGroup: 'Operating Expenses', name: 'Rent & Facility Utilities', currentActualOMR: 520000, priorActualOMR: 510000, budgetOMR: 530000, varianceOMR: 10000, variancePercent: 1.9, status: 'Favorable', depth: 1 },
      { id: 'pnl-04-03', code: '6300', accountGroup: 'Operating Expenses', name: 'Marketing, Bidding & PR', currentActualOMR: 390000, priorActualOMR: 360000, budgetOMR: 420000, varianceOMR: 30000, variancePercent: 7.1, status: 'Favorable', depth: 1 },
      { id: 'pnl-04-04', code: '6400', accountGroup: 'Operating Expenses', name: 'IT Infrastructure & Cloud Licenses', currentActualOMR: 310000, priorActualOMR: 280000, budgetOMR: 320000, varianceOMR: 10000, variancePercent: 3.1, status: 'Favorable', depth: 1 },
      { id: 'pnl-04-05', code: '6500', accountGroup: 'Operating Expenses', name: 'Depreciation & Amortization', currentActualOMR: 250000, priorActualOMR: 220000, budgetOMR: 250000, varianceOMR: 0, variancePercent: 0.0, status: 'Neutral', depth: 1 }
    ]
  },
  {
    id: 'pnl-05',
    code: 'EBIT',
    accountGroup: 'Operating Profit',
    name: 'OPERATING PROFIT (EBIT)',
    currentActualOMR: 2523000,
    priorActualOMR: 2130400,
    budgetOMR: 2310000,
    varianceOMR: 213000,
    variancePercent: 9.22,
    status: 'Favorable',
    depth: 0
  },
  {
    id: 'pnl-06',
    code: '7000',
    accountGroup: 'Other Income & Expense',
    name: 'Finance Cost & Tax Provision',
    currentActualOMR: -337600,
    priorActualOMR: -310000,
    budgetOMR: -340000,
    varianceOMR: 2400,
    variancePercent: 0.71,
    status: 'Favorable',
    depth: 0
  },
  {
    id: 'pnl-07',
    code: 'NET',
    accountGroup: 'Net Profit',
    name: 'NET COMPREHENSIVE INCOME',
    currentActualOMR: 2185400,
    priorActualOMR: 1820400,
    budgetOMR: 1970000,
    varianceOMR: 215400,
    variancePercent: 10.93,
    status: 'Favorable',
    depth: 0
  }
];

export const MOCK_BALANCE_SHEET: BalanceSheetCategory[] = [
  {
    category: 'Current Assets',
    totalCurrentOMR: 10371300,
    totalPriorOMR: 9140000,
    items: [
      { code: '1110', name: 'Cash & Short-Term Bank Placements', currentOMR: 3410500, priorOMR: 2980000, changePercent: 14.4 },
      { code: '1120', name: 'Trade Accounts Receivable (Net of Allowance)', currentOMR: 4120800, priorOMR: 3750000, changePercent: 9.9 },
      { code: '1130', name: 'Merchandise & Raw Material Inventories', currentOMR: 2840000, priorOMR: 2410000, changePercent: 17.8 }
    ]
  },
  {
    category: 'Non-Current Assets',
    totalCurrentOMR: 14680000,
    totalPriorOMR: 14120000,
    items: [
      { code: '1210', name: 'Property, Plant & Heavy Equipment (PPE)', currentOMR: 9850000, priorOMR: 9600000, changePercent: 2.6 },
      { code: '1220', name: 'Capital Work-In-Progress (CWIP)', currentOMR: 2430000, priorOMR: 2120000, changePercent: 14.6 },
      { code: '1230', name: 'Intangibles, Patents & ERP Licenses', currentOMR: 2400000, priorOMR: 2400000, changePercent: 0.0 }
    ]
  },
  {
    category: 'Current Liabilities',
    totalCurrentOMR: 5120600,
    totalPriorOMR: 4680000,
    items: [
      { code: '2110', name: 'Trade Accounts Payable & Accruals', currentOMR: 2280600, priorOMR: 2110000, changePercent: 8.1 },
      { code: '2120', name: 'Short-Term Bank Credit & Letters of Credit', currentOMR: 1840000, priorOMR: 1650000, changePercent: 11.5 },
      { code: '2130', name: 'Customer Advances & Deferred Income', currentOMR: 1000000, priorOMR: 920000, changePercent: 8.7 }
    ]
  },
  {
    category: 'Non-Current Liabilities',
    totalCurrentOMR: 4320000,
    totalPriorOMR: 4650000,
    items: [
      { code: '2210', name: 'Long-Term Syndicated Bank Loans', currentOMR: 3500000, priorOMR: 3850000, changePercent: -9.1 },
      { code: '2220', name: 'End of Service Indemnity Obligations', currentOMR: 820000, priorOMR: 800000, changePercent: 2.5 }
    ]
  },
  {
    category: 'Equity',
    totalCurrentOMR: 15610700,
    totalPriorOMR: 13930000,
    items: [
      { code: '3100', name: 'Paid-Up Share Capital', currentOMR: 8000000, priorOMR: 8000000, changePercent: 0.0 },
      { code: '3200', name: 'Statutory Legal Reserve', currentOMR: 2650000, priorOMR: 2410000, changePercent: 10.0 },
      { code: '3300', name: 'Retained Earnings & Reserves', currentOMR: 4960700, priorOMR: 3520000, changePercent: 40.9 }
    ]
  }
];

export const MOCK_CASH_FLOW_STATEMENT: CashFlowActivity[] = [
  {
    section: 'Operating Activities',
    totalOMR: 2840000,
    items: [
      { name: 'Operating Net Profit (Adjusted for Non-Cash)', amountOMR: 2435400, type: 'Inflow' },
      { name: 'Depreciation & Amortization Add-Back', amountOMR: 250000, type: 'Inflow' },
      { name: 'Increase in Trade Receivables', amountOMR: -370800, type: 'Outflow' },
      { name: 'Increase in Inventory Balances', amountOMR: -430000, type: 'Outflow' },
      { name: 'Increase in Trade Payables & Accruals', amountOMR: 955400, type: 'Inflow' }
    ]
  },
  {
    section: 'Investing Activities',
    totalOMR: -1450000,
    items: [
      { name: 'Purchase of Plant Machinery & Automation', amountOMR: -1140000, type: 'Outflow' },
      { name: 'Capitalized Software & ERP Investment', amountOMR: -310000, type: 'Outflow' }
    ]
  },
  {
    section: 'Financing Activities',
    totalOMR: -959500,
    items: [
      { name: 'Principal Repayment of Term Loans', amountOMR: -350000, type: 'Outflow' },
      { name: 'Dividend Distribution to Shareholders', amountOMR: -450000, type: 'Outflow' },
      { name: 'Finance Lease Obligations', amountOMR: -159500, type: 'Outflow' }
    ]
  }
];

export const MOCK_FINANCIAL_RATIOS: FinancialRatio[] = [
  { category: 'Liquidity', name: 'Current Ratio', formula: 'Current Assets / Current Liabilities', value: 2.03, unit: 'x', benchmark: 1.5, status: 'Optimal', trend: 'Up', commentary: 'Working capital coverage is robust at 2.03x.' },
  { category: 'Liquidity', name: 'Quick Ratio (Acid Test)', formula: '(Cash + AR) / Current Liabilities', value: 1.47, unit: 'x', benchmark: 1.0, status: 'Optimal', trend: 'Up', commentary: 'Immediate liquidity easily satisfies short-term dues.' },
  { category: 'Profitability', name: 'Gross Profit Margin', formula: 'Gross Profit / Total Revenue', value: 38.0, unit: '%', benchmark: 35.0, status: 'Optimal', trend: 'Up', commentary: 'Exceeding target benchmark by 300 bps.' },
  { category: 'Profitability', name: 'EBITDA Margin', formula: 'EBITDA / Total Revenue', value: 16.99, unit: '%', benchmark: 15.0, status: 'Optimal', trend: 'Up', commentary: 'Operational profitability supported by high value contracts.' },
  { category: 'Profitability', name: 'Return on Equity (ROE)', formula: 'Net Income / Total Equity', value: 14.0, unit: '%', benchmark: 12.0, status: 'Optimal', trend: 'Up', commentary: 'Strong equity return reflecting disciplined capital deployment.' },
  { category: 'Efficiency', name: 'Days Sales Outstanding (DSO)', formula: '(AR / Revenue) * 365', value: 48.0, unit: 'Days', benchmark: 45.0, status: 'Acceptable', trend: 'Stable', commentary: 'Collection cycle is within normal 45-60 day contract terms.' },
  { category: 'Solvency', name: 'Debt-to-Equity Ratio', formula: 'Total Debt / Total Equity', value: 0.34, unit: 'x', benchmark: 0.6, status: 'Optimal', trend: 'Down', commentary: 'Conservative leverage position minimizes interest rate exposure.' }
];

// ==========================================
// 3. OPERATIONAL REPORTS (DEMO DATA)
// ==========================================
export const MOCK_SALES_RECORDS: SalesReportRecord[] = [
  { id: 'sl-01', period: '2026-08', customerCode: 'CUST-101', customerName: 'Oman National Energy SAOG', category: 'Turnkey Infrastructure', branchName: 'Muscat HQ & Capital', salesRep: 'Tariq Al-Lawati', revenueOMR: 1840000, cogsOMR: 1080000, grossMarginPercent: 41.3, orderCount: 4, volumeUnits: 12 },
  { id: 'sl-02', period: '2026-08', customerCode: 'CUST-102', customerName: 'Apex Petrochem Industries', category: 'Process Automation', branchName: 'Sohar Industrial Freezone', salesRep: 'Fatima Al-Riyami', revenueOMR: 1250000, cogsOMR: 740000, grossMarginPercent: 40.8, orderCount: 6, volumeUnits: 45 },
  { id: 'sl-03', period: '2026-08', customerCode: 'CUST-103', customerName: 'Salalah Port Logistics Corp', category: 'Logistics Equipment', branchName: 'Salalah Port & Logistics', salesRep: 'Salim Al-Harthy', revenueOMR: 980000, cogsOMR: 620000, grossMarginPercent: 36.7, orderCount: 3, volumeUnits: 18 },
  { id: 'sl-04', period: '2026-08', customerCode: 'CUST-104', customerName: 'Muscat Municipality Infrastructure', category: 'Civil Projects', branchName: 'Muscat HQ & Capital', salesRep: 'Nadia Al-Balushi', revenueOMR: 850000, cogsOMR: 570000, grossMarginPercent: 32.9, orderCount: 2, volumeUnits: 8 },
  { id: 'sl-05', period: '2026-08', customerCode: 'CUST-105', customerName: 'Gulf Telecommunications Co', category: 'Technology Systems', branchName: 'Nizwa Regional Distribution', salesRep: 'Ahmed Al-Kharusi', revenueOMR: 640000, cogsOMR: 390000, grossMarginPercent: 39.1, orderCount: 5, volumeUnits: 80 }
];

export const MOCK_PURCHASE_RECORDS: PurchaseReportRecord[] = [
  { id: 'pur-01', period: '2026-08', supplierCode: 'SUP-201', supplierName: 'Sohar Steel & Heavy Forgings', category: 'Raw Materials & Alloys', spendOMR: 2150000, poCount: 14, leadTimeDaysAvg: 18, otifPercent: 96.4, priceVariancePercent: -1.2 },
  { id: 'pur-02', period: '2026-08', supplierCode: 'SUP-202', supplierName: 'Siemens Energy Automation FZE', category: 'Instrumentation & Drives', spendOMR: 1420000, poCount: 8, leadTimeDaysAvg: 24, otifPercent: 98.1, priceVariancePercent: 0.0 },
  { id: 'pur-03', period: '2026-08', supplierCode: 'SUP-203', supplierName: 'Gulf Polymers & Resins Ltd', category: 'Chemical Reagents', spendOMR: 890000, poCount: 19, leadTimeDaysAvg: 12, otifPercent: 92.5, priceVariancePercent: 2.4 },
  { id: 'pur-04', period: '2026-08', supplierCode: 'SUP-204', supplierName: 'Bahwan DHL Logistics Oman', category: 'International Freight', spendOMR: 620000, poCount: 32, leadTimeDaysAvg: 7, otifPercent: 99.0, priceVariancePercent: -0.5 }
];

export const MOCK_INVENTORY_RECORDS: InventoryReportRecord[] = [
  { id: 'inv-01', itemCode: 'SKU-8801', itemName: 'High-Tensile Structural Steel 40mm', category: 'Raw Materials', warehouse: 'Sohar Bulk Yard A', quantityOnHand: 450, unitCostOMR: 185.0, totalValuationOMR: 832500, stockTurnoverRatio: 6.4, daysOfInventoryRemaining: 57, reorderPoint: 150, safetyStock: 100, status: 'Healthy' },
  { id: 'inv-02', itemCode: 'SKU-8802', itemName: 'Industrial PLC Controller Modules', category: 'Electronics', warehouse: 'Muscat Central Store', quantityOnHand: 180, unitCostOMR: 420.0, totalValuationOMR: 756000, stockTurnoverRatio: 8.1, daysOfInventoryRemaining: 45, reorderPoint: 60, safetyStock: 40, status: 'Healthy' },
  { id: 'inv-03', itemCode: 'SKU-8803', itemName: 'High-Pressure Hydraulic Valves 6in', category: 'Mechanical Fittings', warehouse: 'Salalah Port Depot', quantityOnHand: 35, unitCostOMR: 890.0, totalValuationOMR: 311500, stockTurnoverRatio: 3.2, daysOfInventoryRemaining: 114, reorderPoint: 50, safetyStock: 30, status: 'Low Stock' },
  { id: 'inv-04', itemCode: 'SKU-8804', itemName: 'Polymer Extrusion Granules Grade-B', category: 'Chemicals', warehouse: 'Sohar Bulk Yard B', quantityOnHand: 620, unitCostOMR: 140.0, totalValuationOMR: 868000, stockTurnoverRatio: 4.8, daysOfInventoryRemaining: 76, reorderPoint: 200, safetyStock: 120, status: 'Healthy' },
  { id: 'inv-05', itemCode: 'SKU-8805', itemName: 'Legacy Flange Connectors 12in (Pre-2024)', category: 'Spares', warehouse: 'Nizwa Staging', quantityOnHand: 90, unitCostOMR: 80.0, totalValuationOMR: 72000, stockTurnoverRatio: 0.4, daysOfInventoryRemaining: 380, reorderPoint: 10, safetyStock: 10, status: 'Excess/Aging' }
];

export const MOCK_HR_RECORDS: HrReportRecord[] = [
  { id: 'hr-01', department: 'Engineering & EPC Operations', headcount: 240, joinersYtd: 28, leaversYtd: 9, turnoverRatePercent: 3.75, avgTenureYears: 4.8, attendanceRatePercent: 97.4, overtimeHoursTotal: 3420, trainingHoursAvg: 28, recruitmentOpenPositions: 8 },
  { id: 'hr-02', department: 'Manufacturing & Plants', headcount: 380, joinersYtd: 35, leaversYtd: 14, turnoverRatePercent: 3.68, avgTenureYears: 5.4, attendanceRatePercent: 98.1, overtimeHoursTotal: 7890, trainingHoursAvg: 22, recruitmentOpenPositions: 12 },
  { id: 'hr-03', department: 'Commercial & Sales', headcount: 85, joinersYtd: 12, leaversYtd: 4, turnoverRatePercent: 4.70, avgTenureYears: 3.9, attendanceRatePercent: 96.5, overtimeHoursTotal: 620, trainingHoursAvg: 36, recruitmentOpenPositions: 4 },
  { id: 'hr-04', department: 'Finance & Supply Chain', headcount: 65, joinersYtd: 6, leaversYtd: 2, turnoverRatePercent: 3.07, avgTenureYears: 6.2, attendanceRatePercent: 98.6, overtimeHoursTotal: 410, trainingHoursAvg: 30, recruitmentOpenPositions: 2 },
  { id: 'hr-05', department: 'Executive & Digital Technology', headcount: 45, joinersYtd: 8, leaversYtd: 1, turnoverRatePercent: 2.22, avgTenureYears: 3.2, attendanceRatePercent: 99.0, overtimeHoursTotal: 280, trainingHoursAvg: 48, recruitmentOpenPositions: 3 }
];

export const MOCK_PROJECT_RECORDS: ProjectReportRecord[] = [
  { id: 'prj-01', projectCode: 'PRJ-2026-01', projectName: 'Duqm Refinery Power Automation Phase 2', clientName: 'Oman National Energy SAOG', projectManager: 'Eng. Khalfan Al-Busaidi', contractValueOMR: 4200000, costBudgetOMR: 3100000, actualCostOMR: 2150000, revenueRecognizedOMR: 3150000, progressPercent: 75.0, earnedValueOMR: 3150000, cpi: 1.05, spi: 1.02, marginPercent: 31.7, health: 'Green' },
  { id: 'prj-02', projectCode: 'PRJ-2026-02', projectName: 'Sohar Plastics Desalination Substation', clientName: 'Apex Petrochem Industries', projectManager: 'Eng. Mariam Al-Ghafri', contractValueOMR: 2850000, costBudgetOMR: 2100000, actualCostOMR: 1680000, revenueRecognizedOMR: 1850000, progressPercent: 65.0, earnedValueOMR: 1852500, cpi: 1.01, spi: 0.96, marginPercent: 26.3, health: 'Amber' },
  { id: 'prj-03', projectCode: 'PRJ-2026-03', projectName: 'Salalah Container Logistics Terminal Hub', clientName: 'Salalah Port Logistics Corp', projectManager: 'Eng. Rashid Al-Harthy', contractValueOMR: 3400000, costBudgetOMR: 2600000, actualCostOMR: 1100000, revenueRecognizedOMR: 1530000, progressPercent: 45.0, earnedValueOMR: 1530000, cpi: 1.09, spi: 1.04, marginPercent: 30.8, health: 'Green' },
  { id: 'prj-04', projectCode: 'PRJ-2026-04', projectName: 'Nizwa Highway Smart Monitoring Grid', clientName: 'Muscat Municipality Infrastructure', projectManager: 'Eng. Tariq Al-Habsi', contractValueOMR: 1600000, costBudgetOMR: 1250000, actualCostOMR: 1050000, revenueRecognizedOMR: 960000, progressPercent: 60.0, earnedValueOMR: 960000, cpi: 0.91, spi: 0.88, marginPercent: 18.0, health: 'Red' }
];

// ==========================================
// 4. MANAGEMENT ANALYSIS (DEMO DATA)
// ==========================================
export const MOCK_PROFITABILITY_ANALYSIS: ProfitabilityAnalysisItem[] = [
  { id: 'pf-01', dimension: 'Turnkey Infrastructure Systems', dimensionType: 'Product', revenueOMR: 5840000, directCostOMR: 3450000, grossProfitOMR: 2390000, grossMarginPercent: 40.9, operatingOverheadOMR: 780000, netProfitOMR: 1610000, netMarginPercent: 27.6, rank: 1 },
  { id: 'pf-02', dimension: 'Industrial Process Automation', dimensionType: 'Product', revenueOMR: 4120000, directCostOMR: 2480000, grossProfitOMR: 1640000, grossMarginPercent: 39.8, operatingOverheadOMR: 540000, netProfitOMR: 1100000, netMarginPercent: 26.7, rank: 2 },
  { id: 'pf-03', dimension: 'Port Logistics Machinery', dimensionType: 'Product', revenueOMR: 2890000, directCostOMR: 1890000, grossProfitOMR: 1000000, grossMarginPercent: 34.6, operatingOverheadOMR: 420000, netProfitOMR: 580000, netMarginPercent: 20.1, rank: 3 },
  { id: 'pf-04', dimension: 'Municipal Civil Contracts', dimensionType: 'Product', revenueOMR: 2000200, directCostOMR: 1387200, grossProfitOMR: 613000, grossMarginPercent: 30.6, operatingOverheadOMR: 380000, netProfitOMR: 233000, netMarginPercent: 11.6, rank: 4 }
];

export const MOCK_COST_ANALYSIS: CostAnalysisItem[] = [
  { costCenterCode: 'CC-OPS-01', costCenterName: 'Sohar Manufacturing Plant 1', department: 'Manufacturing', category: 'Direct Material', budgetedAmountOMR: 4200000, actualSpendOMR: 4360000, absorbedCostOMR: 4300000, underOverAbsorptionOMR: -60000, varianceOMR: -160000, status: 'Warning Deviation' },
  { costCenterCode: 'CC-OPS-02', costCenterName: 'Plant Direct Labor Crew', department: 'Manufacturing', category: 'Direct Labor', budgetedAmountOMR: 2100000, actualSpendOMR: 2060000, absorbedCostOMR: 2060000, underOverAbsorptionOMR: 0, varianceOMR: 40000, status: 'Within Budget' },
  { costCenterCode: 'CC-LOG-01', costCenterName: 'Sohar to Salalah Freight Fleet', department: 'Logistics', category: 'Manufacturing Overhead', budgetedAmountOMR: 780000, actualSpendOMR: 750000, absorbedCostOMR: 760000, underOverAbsorptionOMR: 10000, varianceOMR: 30000, status: 'Within Budget' },
  { costCenterCode: 'CC-ADM-01', costCenterName: 'Corporate IT & Cloud Operations', department: 'Technology', category: 'Technology', budgetedAmountOMR: 320000, actualSpendOMR: 310000, absorbedCostOMR: 310000, underOverAbsorptionOMR: 0, varianceOMR: 10000, status: 'Within Budget' }
];

export const MOCK_CUSTOMER_ANALYTICS: CustomerAnalyticsRecord[] = [
  { customerCode: 'CUST-101', customerName: 'Oman National Energy SAOG', tier: 'Tier 1 Strategic', lifetimeValueOMR: 28400000, ytdRevenueOMR: 4850000, ytdGrossMarginPercent: 41.2, currentReceivablesOMR: 1420000, daysSalesOutstanding: 42, ordersYtd: 18, churnRisk: 'Low', concentrationPercent: 32.7 },
  { customerCode: 'CUST-102', customerName: 'Apex Petrochem Industries', tier: 'Tier 1 Strategic', lifetimeValueOMR: 18900000, ytdRevenueOMR: 3410000, ytdGrossMarginPercent: 39.8, currentReceivablesOMR: 980000, daysSalesOutstanding: 45, ordersYtd: 14, churnRisk: 'Low', concentrationPercent: 23.0 },
  { customerCode: 'CUST-103', customerName: 'Salalah Port Logistics Corp', tier: 'Tier 2 Enterprise', lifetimeValueOMR: 12400000, ytdRevenueOMR: 2680000, ytdGrossMarginPercent: 36.4, currentReceivablesOMR: 740000, daysSalesOutstanding: 51, ordersYtd: 9, churnRisk: 'Low', concentrationPercent: 18.0 },
  { customerCode: 'CUST-104', customerName: 'Muscat Municipality Infrastructure', tier: 'Tier 2 Enterprise', lifetimeValueOMR: 9800000, ytdRevenueOMR: 2110200, ytdGrossMarginPercent: 32.1, currentReceivablesOMR: 620000, daysSalesOutstanding: 58, ordersYtd: 7, churnRisk: 'Medium', concentrationPercent: 14.2 },
  { customerCode: 'CUST-105', customerName: 'Gulf Telecommunications Co', tier: 'Tier 3 Commercial', lifetimeValueOMR: 5400000, ytdRevenueOMR: 1800000, ytdGrossMarginPercent: 38.5, currentReceivablesOMR: 360800, daysSalesOutstanding: 38, ordersYtd: 11, churnRisk: 'Low', concentrationPercent: 12.1 }
];

export const MOCK_SUPPLIER_ANALYTICS: SupplierAnalyticsRecord[] = [
  { supplierCode: 'SUP-201', supplierName: 'Sohar Steel & Heavy Forgings', category: 'Raw Materials', ytdSpendOMR: 4890000, spendConcentrationPercent: 38.2, onTimeDeliveryRate: 96.4, qualityDefectRatePpm: 120, outstandingPayablesOMR: 890000, paymentTermDays: 45, riskRating: 'Low', contractRenewalDate: '2027-03-31' },
  { supplierCode: 'SUP-202', supplierName: 'Siemens Energy Automation FZE', category: 'Automation Drives', ytdSpendOMR: 3120000, spendConcentrationPercent: 24.4, onTimeDeliveryRate: 98.1, qualityDefectRatePpm: 40, outstandingPayablesOMR: 620000, paymentTermDays: 30, riskRating: 'Low', contractRenewalDate: '2026-12-31' },
  { supplierCode: 'SUP-203', supplierName: 'Gulf Polymers & Resins Ltd', category: 'Chemical Reagents', ytdSpendOMR: 2450000, spendConcentrationPercent: 19.1, onTimeDeliveryRate: 92.5, qualityDefectRatePpm: 280, outstandingPayablesOMR: 440000, paymentTermDays: 60, riskRating: 'Medium', contractRenewalDate: '2026-11-30' },
  { supplierCode: 'SUP-204', supplierName: 'Bahwan DHL Logistics Oman', category: 'Freight Carriers', ytdSpendOMR: 1890000, spendConcentrationPercent: 14.8, onTimeDeliveryRate: 99.0, qualityDefectRatePpm: 10, outstandingPayablesOMR: 330600, paymentTermDays: 30, riskRating: 'Low', contractRenewalDate: '2027-06-30' }
];

// ==========================================
// 5. VARIANCE & AGING SCHEDULES (DEMO DATA)
// ==========================================
export const MOCK_BUDGET_VS_ACTUAL: BudgetVsActualLine[] = [
  { id: 'bva-01', accountOrDept: 'Commercial Infrastructure Contracts', category: 'Revenue', annualBudgetOMR: 18000000, ytdBudgetOMR: 12000000, ytdActualOMR: 12450000, varianceOMR: 450000, variancePercent: 3.75, status: 'Favorable', explanation: 'Strong intake from Duqm phase 2 expansion.', trend: 'Improving' },
  { id: 'bva-02', accountOrDept: 'Sohar Raw Material Inputs', category: 'Direct Cost', annualBudgetOMR: 7500000, ytdBudgetOMR: 5000000, ytdActualOMR: 5240000, varianceOMR: -240000, variancePercent: -4.80, status: 'Unfavorable', explanation: 'Global alloy surcharge spiked in Q2.', trend: 'Deteriorating' },
  { id: 'bva-03', accountOrDept: 'Direct Site Installation Labor', category: 'Direct Cost', annualBudgetOMR: 3800000, ytdBudgetOMR: 2530000, ytdActualOMR: 2480000, varianceOMR: 50000, variancePercent: 1.98, status: 'Favorable', explanation: 'Optimized crew scheduling reduced idle time.', trend: 'Improving' },
  { id: 'bva-04', accountOrDept: 'Logistics Fleet & Transportation', category: 'Operating Overhead', annualBudgetOMR: 1100000, ytdBudgetOMR: 730000, ytdActualOMR: 710000, varianceOMR: 20000, variancePercent: 2.74, status: 'Favorable', explanation: 'Route optimization saved 4% fuel.', trend: 'Improving' },
  { id: 'bva-05', accountOrDept: 'Corporate IT & Software Infrastructure', category: 'Operating Overhead', annualBudgetOMR: 480000, ytdBudgetOMR: 320000, ytdActualOMR: 310000, varianceOMR: 10000, variancePercent: 3.12, status: 'Favorable', explanation: 'Vendor volume discount applied.', trend: 'Stable' }
];

export const MOCK_CUSTOMER_AGING: AgingBucketSchedule[] = [
  { entityCode: 'CUST-101', entityName: 'Oman National Energy SAOG', category: 'Strategic Utility', totalOutstandingOMR: 1420000, currentNotDueOMR: 980000, days1To30OMR: 380000, days31To60OMR: 60000, days61To90OMR: 0, days91To120OMR: 0, daysOver120OMR: 0, disputedAmountOMR: 0, creditLimitOMR: 3000000, lastPaymentDate: '2026-08-12' },
  { entityCode: 'CUST-102', entityName: 'Apex Petrochem Industries', category: 'Industrial', totalOutstandingOMR: 980000, currentNotDueOMR: 640000, days1To30OMR: 260000, days31To60OMR: 80000, days61To90OMR: 0, days91To120OMR: 0, daysOver120OMR: 0, disputedAmountOMR: 0, creditLimitOMR: 2000000, lastPaymentDate: '2026-08-15' },
  { entityCode: 'CUST-103', entityName: 'Salalah Port Logistics Corp', category: 'Logistics', totalOutstandingOMR: 740000, currentNotDueOMR: 410000, days1To30OMR: 190000, days31To60OMR: 95000, days61To90OMR: 45000, days91To120OMR: 0, daysOver120OMR: 0, disputedAmountOMR: 25000, creditLimitOMR: 1500000, lastPaymentDate: '2026-07-28' },
  { entityCode: 'CUST-104', entityName: 'Muscat Municipality Infrastructure', category: 'Government', totalOutstandingOMR: 620000, currentNotDueOMR: 280000, days1To30OMR: 150000, days31To60OMR: 110000, days61To90OMR: 50000, days91To120OMR: 30000, daysOver120OMR: 0, disputedAmountOMR: 0, creditLimitOMR: 1200000, lastPaymentDate: '2026-07-10' },
  { entityCode: 'CUST-105', entityName: 'Gulf Telecommunications Co', category: 'Telecom', totalOutstandingOMR: 360800, currentNotDueOMR: 290000, days1To30OMR: 55000, days31To60OMR: 15800, days61To90OMR: 0, days91To120OMR: 0, daysOver120OMR: 0, disputedAmountOMR: 0, creditLimitOMR: 800000, lastPaymentDate: '2026-08-18' }
];

export const MOCK_SUPPLIER_AGING: AgingBucketSchedule[] = [
  { entityCode: 'SUP-201', entityName: 'Sohar Steel & Heavy Forgings', category: 'Raw Materials', totalOutstandingOMR: 890000, currentNotDueOMR: 620000, days1To30OMR: 210000, days31To60OMR: 60000, days61To90OMR: 0, days91To120OMR: 0, daysOver120OMR: 0, disputedAmountOMR: 0, lastPaymentDate: '2026-08-10' },
  { entityCode: 'SUP-202', entityName: 'Siemens Energy Automation FZE', category: 'Instrumentation', totalOutstandingOMR: 620000, currentNotDueOMR: 480000, days1To30OMR: 140000, days31To60OMR: 0, days61To90OMR: 0, days91To120OMR: 0, daysOver120OMR: 0, disputedAmountOMR: 0, lastPaymentDate: '2026-08-14' },
  { entityCode: 'SUP-203', entityName: 'Gulf Polymers & Resins Ltd', category: 'Chemicals', totalOutstandingOMR: 440000, currentNotDueOMR: 310000, days1To30OMR: 90000, days31To60OMR: 40000, days61To90OMR: 0, days91To120OMR: 0, daysOver120OMR: 0, disputedAmountOMR: 0, lastPaymentDate: '2026-08-05' },
  { entityCode: 'SUP-204', entityName: 'Bahwan DHL Logistics Oman', category: 'Freight', totalOutstandingOMR: 330600, currentNotDueOMR: 270000, days1To30OMR: 60600, days31To60OMR: 0, days61To90OMR: 0, days91To120OMR: 0, daysOver120OMR: 0, disputedAmountOMR: 0, lastPaymentDate: '2026-08-19' }
];

export const MOCK_DEEP_VARIANCE_FACTORS: DeepVarianceFactor[] = [
  { parameter: 'Steel Material Purchase Price', standardBenchmark: '175.00 OMR / Ton', actualResult: '185.00 OMR / Ton', varianceEffectOMR: -160000, varianceType: 'Purchase Price', impact: 'Unfavorable', recommendation: 'Initiate 6-month hedge forward contracts with Sohar Steel mills.' },
  { parameter: 'Duqm Project Sales Volume', standardBenchmark: '10.0 M units', actualResult: '12.4 M units', varianceEffectOMR: 450000, varianceType: 'Sales Volume', impact: 'Favorable', recommendation: 'Expand installation subcontractor capacity to maintain on-time commissioning.' },
  { parameter: 'Direct Assembly Labor Efficiency', standardBenchmark: '12.5 hrs / unit', actualResult: '11.8 hrs / unit', varianceEffectOMR: 50000, varianceType: 'Labor Efficiency', impact: 'Favorable', recommendation: 'Adopt newly piloted lean staging jigs across all manufacturing bays.' },
  { parameter: 'Logistics Fleet Freight Routing', standardBenchmark: '0.45 OMR / Ton-Km', actualResult: '0.43 OMR / Ton-Km', varianceEffectOMR: 20000, varianceType: 'Overhead Spending', impact: 'Favorable', recommendation: 'Standardize GPS-guided fleet consolidation for all regional transfer routes.' }
];

// ==========================================
// 6. KPI MANAGEMENT (DEMO DATA)
// ==========================================
export const MOCK_KPI_DEFINITIONS: KPIDefinition[] = [
  {
    id: 'kpi-01',
    code: 'KPI-FIN-01',
    name: 'EBITDA Operating Margin',
    description: 'Measures operational profitability as a percentage of total recognized revenue.',
    category: 'Financial',
    module: 'Finance & Accounts',
    department: 'Corporate Finance',
    company: 'Artify Group Holdings',
    calculationDefinition: '(Operating EBITDA / Gross Revenue) * 100',
    unit: '%',
    frequency: 'Monthly',
    direction: 'higher_is_better',
    owner: 'Chief Financial Officer',
    status: 'Active',
    currentValue: 16.99,
    targetValue: 15.0,
    minThreshold: 12.0,
    maxThreshold: 20.0,
    historicalTrend: [
      { date: 'Jan', value: 14.8, target: 15.0 },
      { date: 'Feb', value: 15.2, target: 15.0 },
      { date: 'Mar', value: 15.9, target: 15.0 },
      { date: 'Apr', value: 15.5, target: 15.0 },
      { date: 'May', value: 16.2, target: 15.0 },
      { date: 'Jun', value: 16.8, target: 15.0 },
      { date: 'Jul', value: 16.5, target: 15.0 },
      { date: 'Aug', value: 16.99, target: 15.0 }
    ]
  },
  {
    id: 'kpi-02',
    code: 'KPI-OPS-02',
    name: 'Order Fulfillment OTIF (On-Time In-Full)',
    description: 'Percentage of customer project deliveries shipped on schedule with zero line item shortages.',
    category: 'Operational',
    module: 'Supply Chain & Logistics',
    department: 'Logistics Operations',
    company: 'Artify Manufacturing LLC',
    calculationDefinition: '(Total Orders Delivered On-Time and In-Full / Total Dispatched Orders) * 100',
    unit: '%',
    frequency: 'Weekly',
    direction: 'higher_is_better',
    owner: 'VP Supply Chain',
    status: 'Active',
    currentValue: 96.8,
    targetValue: 95.0,
    minThreshold: 90.0,
    maxThreshold: 100.0,
    historicalTrend: [
      { date: 'W31', value: 94.2, target: 95.0 },
      { date: 'W32', value: 95.1, target: 95.0 },
      { date: 'W33', value: 96.4, target: 95.0 },
      { date: 'W34', value: 96.8, target: 95.0 }
    ]
  },
  {
    id: 'kpi-03',
    code: 'KPI-FIN-03',
    name: 'Days Sales Outstanding (DSO)',
    description: 'Average collection cycle in calendar days required to convert accounts receivable into liquid cash.',
    category: 'Financial',
    module: 'Accounts Receivable',
    department: 'Treasury & Credit',
    company: 'Artify Group Holdings',
    calculationDefinition: '(Total Accounts Receivable / Annualized Revenue) * 365',
    unit: 'Days',
    frequency: 'Monthly',
    direction: 'lower_is_better',
    owner: 'Head of Treasury',
    status: 'Active',
    currentValue: 48.0,
    targetValue: 45.0,
    minThreshold: 30.0,
    maxThreshold: 60.0,
    historicalTrend: [
      { date: 'May', value: 52.0, target: 45.0 },
      { date: 'Jun', value: 50.5, target: 45.0 },
      { date: 'Jul', value: 49.2, target: 45.0 },
      { date: 'Aug', value: 48.0, target: 45.0 }
    ]
  },
  {
    id: 'kpi-04',
    code: 'KPI-PRJ-04',
    name: 'Project Cost Performance Index (CPI)',
    description: 'Earned Value Analysis metric indicating whether projects are delivering within approved budgets.',
    category: 'Operational',
    module: 'Project Management',
    department: 'PMO & Engineering',
    company: 'Artify Engineering Contracting',
    calculationDefinition: 'Earned Value (EV) / Actual Cost of Work Performed (ACWP)',
    unit: 'Ratio',
    frequency: 'Weekly',
    direction: 'higher_is_better',
    owner: 'PMO Director',
    status: 'Active',
    currentValue: 1.04,
    targetValue: 1.0,
    minThreshold: 0.95,
    maxThreshold: 1.15,
    historicalTrend: [
      { date: 'W31', value: 1.01, target: 1.0 },
      { date: 'W32', value: 1.02, target: 1.0 },
      { date: 'W33', value: 1.03, target: 1.0 },
      { date: 'W34', value: 1.04, target: 1.0 }
    ]
  },
  {
    id: 'kpi-05',
    code: 'KPI-HR-05',
    name: 'Annualized Employee Retention Rate',
    description: 'Percentage of key technical and managerial talent retained over a rolling 12-month window.',
    category: 'People',
    module: 'Human Resources',
    department: 'People & Culture',
    company: 'Artify Group Holdings',
    calculationDefinition: '(1 - (Total Voluntary Exits / Average Headcount)) * 100',
    unit: '%',
    frequency: 'Monthly',
    direction: 'higher_is_better',
    owner: 'Chief Human Resources Officer',
    status: 'Active',
    currentValue: 96.3,
    targetValue: 95.0,
    minThreshold: 90.0,
    maxThreshold: 100.0,
    historicalTrend: [
      { date: 'May', value: 95.8, target: 95.0 },
      { date: 'Jun', value: 96.0, target: 95.0 },
      { date: 'Jul', value: 96.1, target: 95.0 },
      { date: 'Aug', value: 96.3, target: 95.0 }
    ]
  }
];

export const MOCK_KPI_TARGETS: KPITarget[] = [
  { id: 'tgt-01', kpiId: 'kpi-01', kpiCode: 'KPI-FIN-01', kpiName: 'EBITDA Operating Margin', companyId: 'comp-01', companyName: 'Artify Group Holdings', period: 'FY2026', baselineTarget: 15.0, stretchTarget: 18.0, minThreshold: 12.0, maxThreshold: 22.0, effectiveDate: '2026-01-01', expiryDate: '2026-12-31', status: 'Active' },
  { id: 'tgt-02', kpiId: 'kpi-02', kpiCode: 'KPI-OPS-02', kpiName: 'Order Fulfillment OTIF', companyId: 'comp-02', companyName: 'Artify Manufacturing LLC', period: 'FY2026', baselineTarget: 95.0, stretchTarget: 98.0, minThreshold: 90.0, maxThreshold: 100.0, effectiveDate: '2026-01-01', expiryDate: '2026-12-31', status: 'Active' },
  { id: 'tgt-03', kpiId: 'kpi-03', kpiCode: 'KPI-FIN-03', kpiName: 'Days Sales Outstanding (DSO)', companyId: 'comp-01', companyName: 'Artify Group Holdings', period: 'FY2026', baselineTarget: 45.0, stretchTarget: 38.0, minThreshold: 30.0, maxThreshold: 60.0, effectiveDate: '2026-01-01', expiryDate: '2026-12-31', status: 'Active' }
];

export const MOCK_KPI_SCORECARDS: KPIScorecard[] = [
  {
    id: 'sc-01',
    code: 'BSC-FIN-2026',
    title: 'Financial Perspective Balanced Scorecard',
    perspective: 'Financial',
    department: 'Corporate Finance',
    period: 'Q3 2026',
    owner: 'CFO Office',
    weightPercent: 35,
    score: 94.2,
    status: 'On Track',
    kpis: [
      { kpiId: 'kpi-01', kpiName: 'EBITDA Operating Margin', weight: 40, target: 15.0, actual: 16.99, unit: '%', achievementPercent: 113.3, weightedScore: 45.3, status: 'Exceeding' },
      { kpiId: 'kpi-03', kpiName: 'Days Sales Outstanding (DSO)', weight: 30, target: 45.0, actual: 48.0, unit: 'Days', achievementPercent: 93.8, weightedScore: 28.1, status: 'On Track' },
      { kpiId: 'kpi-99', kpiName: 'Working Capital Coverage', weight: 30, target: 1.8, actual: 2.03, unit: 'x', achievementPercent: 112.8, weightedScore: 33.8, status: 'Exceeding' }
    ]
  },
  {
    id: 'sc-02',
    code: 'BSC-OPS-2026',
    title: 'Internal Business Processes Scorecard',
    perspective: 'Internal Business Processes',
    department: 'Operations & Engineering',
    period: 'Q3 2026',
    owner: 'COO Office',
    weightPercent: 30,
    score: 96.5,
    status: 'Exceeding',
    kpis: [
      { kpiId: 'kpi-02', kpiName: 'Order Fulfillment OTIF', weight: 50, target: 95.0, actual: 96.8, unit: '%', achievementPercent: 101.9, weightedScore: 50.9, status: 'Exceeding' },
      { kpiId: 'kpi-04', kpiName: 'Project Cost Performance Index', weight: 50, target: 1.0, actual: 1.04, unit: 'Ratio', achievementPercent: 104.0, weightedScore: 52.0, status: 'Exceeding' }
    ]
  }
];

// ==========================================
// 7. PREBUILT CUSTOM REPORTS & SCHEDULES
// ==========================================
export const MOCK_REPORT_DEFINITIONS: ReportDefinition[] = [
  {
    id: 'rep-01',
    code: 'REP-SL-001',
    title: 'Top 10 Strategic Client Revenue & Margins',
    description: 'Detailed commercial sales breakdown by customer and product category with gross margin calculations.',
    dataSourceId: 'ds-sales-invoices',
    category: 'Commercial Analytics',
    selectedFields: ['sl_customer_name', 'sl_category', 'sl_branch', 'sl_revenue', 'sl_cogs', 'sl_margin_amt'],
    filters: [
      { id: 'f1', fieldId: 'sl_revenue', operator: 'greater_than', value: 500000 }
    ],
    groupByFields: ['sl_customer_name'],
    sorts: [{ fieldId: 'sl_revenue', direction: 'desc' }],
    calculatedFields: [
      { id: 'c1', name: 'MarginPercentage', label: 'Gross Margin %', expression: '([sl_margin_amt] / [sl_revenue]) * 100', outputType: 'percent' }
    ],
    visualization: 'bar_chart',
    chartConfig: {
      xAxisField: 'sl_customer_name',
      yAxisFields: ['sl_revenue', 'sl_margin_amt']
    },
    isScheduled: true,
    isFavorite: true,
    createdBy: 'Executive Analytics Team',
    createdAt: '2026-08-01',
    updatedAt: '2026-08-18'
  },
  {
    id: 'rep-02',
    code: 'REP-INV-002',
    title: 'Critical Inventory Safety Stock & Turnover Matrix',
    description: 'Warehouse on-hand quantities, turnover velocity, and low-stock reorder warnings.',
    dataSourceId: 'ds-inventory-valuation',
    category: 'Supply Chain',
    selectedFields: ['inv_item_code', 'inv_item_name', 'inv_warehouse', 'inv_qty', 'inv_valuation', 'inv_turnover'],
    filters: [],
    groupByFields: ['inv_warehouse'],
    sorts: [{ fieldId: 'inv_valuation', direction: 'desc' }],
    calculatedFields: [],
    visualization: 'table',
    isScheduled: false,
    isFavorite: true,
    createdBy: 'Inventory Controller',
    createdAt: '2026-07-20',
    updatedAt: '2026-08-15'
  },
  {
    id: 'rep-03',
    code: 'REP-FIN-003',
    title: 'Cost Center Budget Variance Master Report',
    description: 'Line-by-line departmental spend compared against approved annual budget allocations.',
    dataSourceId: 'ds-budget-planning',
    category: 'Management Accounting',
    selectedFields: ['bg_cost_center', 'bg_category', 'bg_budget_amt', 'bg_actual_amt', 'bg_variance_amt'],
    filters: [],
    groupByFields: ['bg_cost_center'],
    sorts: [{ fieldId: 'bg_variance_amt', direction: 'asc' }],
    calculatedFields: [],
    visualization: 'bar_chart',
    isScheduled: true,
    isFavorite: false,
    createdBy: 'Corporate FP&A',
    createdAt: '2026-08-05',
    updatedAt: '2026-08-19'
  }
];

export const MOCK_SCHEDULED_REPORTS: ScheduledReportConfig[] = [
  {
    id: 'sch-01',
    reportId: 'rep-01',
    reportTitle: 'Top 10 Strategic Client Revenue & Margins',
    frequency: 'Weekly',
    deliveryTime: 'Monday 08:00 GST',
    format: 'PDF',
    recipients: ['ceo@artify.om', 'cfo@artify.om', 'vp.sales@artify.om'],
    deliveryMethod: 'Email',
    startDate: '2026-08-01',
    lastRunAt: '2026-08-18 08:00',
    nextRunAt: '2026-08-25 08:00',
    status: 'Active',
    lastRunResult: 'Success'
  },
  {
    id: 'sch-02',
    reportId: 'rep-03',
    reportTitle: 'Cost Center Budget Variance Master Report',
    frequency: 'Monthly',
    deliveryTime: '1st of Month 07:00 GST',
    format: 'Excel',
    recipients: ['finance.team@artify.om', 'department.heads@artify.om'],
    deliveryMethod: 'Secure Portal',
    startDate: '2026-08-01',
    lastRunAt: '2026-08-01 07:00',
    nextRunAt: '2026-09-01 07:00',
    status: 'Active',
    lastRunResult: 'Success'
  }
];

// ==========================================
// 8. AI INSIGHTS & EXPLAINABILITY (DEMO DATA)
// ==========================================
export const MOCK_AI_INSIGHTS: AIInsight[] = [
  {
    id: 'ai-ins-01',
    title: 'Gross Margin Expansion in Turnkey Projects',
    summary: 'Turnkey Infrastructure Systems delivered a 40.9% gross margin in August, exceeding the baseline plan by 280 bps due to automated fabrication efficiency in the Sohar Freezone plant.',
    category: 'Margin Risk',
    severity: 'positive',
    confidenceScore: 0.96,
    timestamp: '2026-08-20 09:15',
    dataSourceRef: 'ds-sales-invoices',
    periodRef: 'August 2026 (YTD)',
    supportingMetrics: [
      { label: 'Turnkey Gross Revenue', value: '5,840,000 OMR', variance: '+14.2%' },
      { label: 'Direct COGS Efficiency', value: '3,450,000 OMR', variance: '-2.1%' },
      { label: 'Gross Margin %', value: '40.9%', variance: '+2.8%' }
    ],
    actionableRecommendation: 'Replicate fabrication jigs used in Duqm project across upcoming Salalah logistics contracts to lock in 40%+ margins.',
    isGeneratedFromDemoData: true
  },
  {
    id: 'ai-ins-02',
    title: 'Material Price Variance Anomaly in Structural Steel',
    summary: 'Raw material procurement for Structural Steel 40mm experienced a 5.7% price surge (+160,000 OMR variance) driven by international freight surcharges.',
    category: 'Cost Anomaly',
    severity: 'warning',
    confidenceScore: 0.94,
    timestamp: '2026-08-20 08:30',
    dataSourceRef: 'ds-procurement-pos',
    periodRef: 'Q3 2026',
    supportingMetrics: [
      { label: 'Standard Price Benchmark', value: '175.00 OMR/Ton' },
      { label: 'Actual Weighted Average', value: '185.00 OMR/Ton' },
      { label: 'Budget Variance Effect', value: '-160,000 OMR', variance: '-5.7%' }
    ],
    actionableRecommendation: 'Trigger long-term index-linked procurement hedge contracts with Sohar Steel to cap raw material upside risk.',
    isGeneratedFromDemoData: true
  },
  {
    id: 'ai-ins-03',
    title: 'Customer Concentration Warning: Top 2 Clients Account for 55.7%',
    summary: 'Oman National Energy and Apex Petrochem represent 55.7% of total YTD revenue. While both accounts maintain high solvency, portfolio diversification is advised.',
    category: 'Revenue Growth',
    severity: 'info',
    confidenceScore: 0.92,
    timestamp: '2026-08-19 14:00',
    dataSourceRef: 'ds-sales-invoices',
    periodRef: 'FY2026 YTD',
    supportingMetrics: [
      { label: 'Top 2 Combined Revenue', value: '8,260,000 OMR' },
      { label: 'Portfolio Share', value: '55.7%' },
      { label: 'Average DSO', value: '43.5 Days' }
    ],
    actionableRecommendation: 'Accelerate municipal and telecommunication bids to lower Tier 1 concentration below 45% by FY2027.',
    isGeneratedFromDemoData: true
  },
  {
    id: 'ai-ins-04',
    title: 'AR Aging Acceleration in 31–60 Day Bucket',
    summary: 'Receivables in the 31-60 day bucket increased by 18% month-over-month to 480,800 OMR, mainly associated with municipal progress billing sign-offs.',
    category: 'Aging Warning',
    severity: 'warning',
    confidenceScore: 0.89,
    timestamp: '2026-08-19 11:20',
    dataSourceRef: 'ds-financial-gl',
    periodRef: 'August 2026',
    supportingMetrics: [
      { label: '31-60 Day Balance', value: '480,800 OMR' },
      { label: 'Municipal Share', value: '110,000 OMR' },
      { label: 'Overall DSO', value: '48 Days' }
    ],
    actionableRecommendation: 'Engage Government Relations team to expedite milestone inspection certificates before month-end closure.',
    isGeneratedFromDemoData: true
  }
];

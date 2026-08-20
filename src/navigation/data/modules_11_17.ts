import { ERPModule } from '../../types/erp';

export const MODULES_11_17: ERPModule[] = [
  {
    id: 'budgeting',
    code: '11',
    name: '11 — BUDGETING & FINANCIAL PLANNING',
    shortName: 'Budgeting & Planning',
    category: 'Core Finance',
    description: 'Corporate budget hierarchy, annual operating budgets (OPEX), capital expenditure plans (CAPEX), real-time budget consumption controls, and rolling scenario forecasts.',
    icon: 'PieChart',
    color: 'emerald',
    accentColor: 'text-emerald-500',
    phase: 'Phase 12 — Budgeting',
    phaseNumber: 12,
    kpiPlaceholders: [
      { label: 'Annual Enterprise Budget', value: 'OMR 28,400,000', status: 'normal' },
      { label: 'Year-to-Date Budget Burn', value: '62.4% (Optimal)', status: 'positive' },
      { label: 'Budget Lock Status', value: 'Q3 Unlocked', status: 'normal' },
      { label: 'Variance Alerts', value: '2 Cost Centers >90%', status: 'warning' }
    ],
    aiSuggestions: [
      'Simulate 10% raw material price inflation impact on full-year gross operating profit',
      'Detect cost centers trending to breach annual budget limits 2 months before year-end',
      'Auto-generate rolling 12-month zero-based budget recommendation from past 3-year actuals'
    ],
    functionalAreas: [
      {
        id: 'budget-structure',
        code: '11.01',
        name: 'Budget Structure',
        description: 'Hierarchical budget master trees, annual corporate allocations, departmental envelopes, and cost center budgets.',
        icon: 'Layers',
        phase: 'Phase 12 — Budgeting',
        processes: [
          {
            id: 'budget-struct-proc',
            code: '11.01.01',
            name: 'Budget Models & Hierarchies',
            description: 'Define fiscal budgets, version dimensions, and consolidation rollups.',
            phase: 'Phase 12 — Budgeting',
            transactions: [
              { id: 'tx-annual-budget', code: '11.01.01.01', name: 'Annual Budget', description: 'Establish master corporate annual financial envelopes across legal entities.', phase: 'Phase 12 — Budgeting', actionType: 'configuration', requiredPermissions: ['VIEW', 'CREATE', 'EDIT', 'ADMIN'] },
              { id: 'tx-dept-budget', code: '11.01.01.02', name: 'Department Budget', description: 'Allocate departmental spending thresholds and operational head budgets.', phase: 'Phase 12 — Budgeting', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-proj-budget-plan', code: '11.01.01.03', name: 'Project Budget', description: 'Define discrete multi-year capital budget limits for ongoing project portfolios.', phase: 'Phase 12 — Budgeting', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-cost-center-budget', code: '11.01.01.04', name: 'Cost Center Budget', description: 'Map GL expense lines directly to operational cost center hierarchies.', phase: 'Phase 12 — Budgeting', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'operating-budget',
        code: '11.02',
        name: 'Operating Budget',
        description: 'Operational expenditure (OPEX) planning, revenue projections, direct operating cost budgets, and monthly phasing.',
        icon: 'Calculator',
        phase: 'Phase 12 — Budgeting',
        processes: [
          {
            id: 'opex-proc',
            code: '11.02.01',
            name: 'Revenue & OPEX Planning',
            description: 'Bottom-up and top-down operational expense formulation and revenue quotas.',
            phase: 'Phase 12 — Budgeting',
            transactions: [
              { id: 'tx-revenue-budget', code: '11.02.01.01', name: 'Revenue Budget', description: 'Set target sales revenue by product line, region, and customer tier.', phase: 'Phase 12 — Budgeting', actionType: 'configuration', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-expense-budget', code: '11.02.01.02', name: 'Expense Budget', description: 'Plan general and administrative (G&A), travel, marketing, and utility expenses.', phase: 'Phase 12 — Budgeting', actionType: 'configuration', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-operating-cost-budget', code: '11.02.01.03', name: 'Operating Cost Budget', description: 'Budget direct cost of goods sold, plant maintenance, and production labor.', phase: 'Phase 12 — Budgeting', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'capital-cash-budget',
        code: '11.03',
        name: 'Capital & Cash Budget',
        description: 'CAPEX asset acquisition budgets, long-term financing plans, and monthly cash flow forecasting.',
        icon: 'DollarSign',
        phase: 'Phase 12 — Budgeting',
        processes: [
          {
            id: 'capex-proc',
            code: '11.03.01',
            name: 'CAPEX & Cash Flow Budgets',
            description: 'Capital investment proposals, ROI feasibility calculations, and cash funding.',
            phase: 'Phase 12 — Budgeting',
            transactions: [
              { id: 'tx-capex-budget', code: '11.03.01.01', name: 'CAPEX Budget', description: 'Submit and approve major machinery, property, and IT infrastructure investments.', phase: 'Phase 12 — Budgeting', actionType: 'configuration', requiredPermissions: ['VIEW', 'CREATE', 'APPROVE'] },
              { id: 'tx-cash-flow-budget', code: '11.03.01.02', name: 'Cash Flow Budget', description: 'Project monthly cash inflows vs operational/capital outflows.', phase: 'Phase 12 — Budgeting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] },
              { id: 'tx-financing-budget', code: '11.03.01.03', name: 'Financing Budget', description: 'Plan bank loan drawdowns, debt repayments, and interest service obligations.', phase: 'Phase 12 — Budgeting', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'budget-control',
        code: '11.04',
        name: 'Budget Control',
        description: 'Real-time commit checks on PR/PO creation, hard/soft spending restrictions, and budget reallocation transfers.',
        icon: 'ShieldCheck',
        phase: 'Phase 12 — Budgeting',
        processes: [
          {
            id: 'budget-ctrl-proc',
            code: '11.04.01',
            name: 'Spending Controls & Thresholds',
            description: 'Real-time ledger validation preventing unbudgeted commitments.',
            phase: 'Phase 12 — Budgeting',
            transactions: [
              { id: 'tx-budget-allocation', code: '11.04.01.01', name: 'Budget Allocation', description: 'Distribute approved budget totals across monthly/quarterly spending periods.', phase: 'Phase 12 — Budgeting', actionType: 'transaction', requiredPermissions: ['VIEW', 'EDIT', 'ADMIN'] },
              { id: 'tx-budget-approval', code: '11.04.01.02', name: 'Budget Approval', description: 'Executive board signoff on proposed annual and supplemental budget plans.', phase: 'Phase 12 — Budgeting', actionType: 'workflow', requiredPermissions: ['VIEW', 'APPROVE', 'ADMIN'] },
              { id: 'tx-budget-consumption', code: '11.04.01.03', name: 'Budget Consumption', description: 'Monitor committed vs actual spent vs remaining available budget balances.', phase: 'Phase 12 — Budgeting', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-budget-restrictions', code: '11.04.01.04', name: 'Budget Restrictions', description: 'Configure tolerance limits (e.g. hard block at 100% vs manager override at 105%).', phase: 'Phase 12 — Budgeting', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT', 'ADMIN'] }
            ]
          }
        ]
      },
      {
        id: 'forecasting-analysis',
        code: '11.05',
        name: 'Forecasting & Analysis',
        description: 'Multi-scenario financial modeling (Best/Base/Worst case), rolling quarterly forecasts, and deep variance root-cause drills.',
        icon: 'TrendingUp',
        phase: 'Phase 12 — Budgeting',
        processes: [
          {
            id: 'forecast-proc',
            code: '11.05.01',
            name: 'Rolling Forecasts & Scenarios',
            description: 'Dynamic financial re-forecasting and scenario sensitivity testing.',
            phase: 'Phase 12 — Budgeting',
            transactions: [
              { id: 'tx-budget-vs-actual-plan', code: '11.05.01.01', name: 'Budget vs Actual', description: 'Variance drill-down comparing budgeted amounts against posted GL expenses.', phase: 'Phase 12 — Budgeting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] },
              { id: 'tx-forecasting', code: '11.05.01.02', name: 'Forecasting', description: 'Re-project year-end financial outcomes based on completed months + open pipeline.', phase: 'Phase 12 — Budgeting', actionType: 'report', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-rolling-forecast', code: '11.05.01.03', name: 'Rolling Forecast', description: 'Continuous 4-quarter outlook updated monthly with actual performance data.', phase: 'Phase 12 — Budgeting', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-variance-analysis-plan', code: '11.05.01.04', name: 'Variance Analysis', description: 'Attribute variance to volume, price, efficiency, or timing differences.', phase: 'Phase 12 — Budgeting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] },
              { id: 'tx-scenario-planning', code: '11.05.01.05', name: 'Scenario Planning', description: 'What-if simulations testing interest rate swings, FX fluctuations, and demand dips.', phase: 'Phase 12 — Budgeting', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'scm',
    code: '12',
    name: '12 — SUPPLY CHAIN MANAGEMENT (SCM)',
    shortName: 'Supply Chain (SCM)',
    category: 'Operations & Supply',
    description: 'End-to-end supply chain visibility, multi-tier demand & supply planning, global logistics freight tracking, customs documentation, and distribution network optimization.',
    icon: 'Truck',
    color: 'blue',
    accentColor: 'text-blue-500',
    phase: 'Phase 13 — SCM',
    phaseNumber: 13,
    kpiPlaceholders: [
      { label: 'On-Time In-Full (OTIF) Delivery', value: '94.8%', trend: '+1.5%', status: 'positive' },
      { label: 'Active Inbound Sea/Air Shipments', value: '16 Containers', status: 'normal' },
      { label: 'Customs Clearance Latency', value: '2.1 Days (Avg)', status: 'normal' },
      { label: 'Supply Chain Risk Index', value: 'Low (12/100)', status: 'positive' }
    ],
    aiSuggestions: [
      'Predict container port congestion delay risk for incoming shipments from Shanghai',
      'Optimize multi-hub warehouse distribution allocation to reduce last-mile courier cost by 8%',
      'Detect anomalous customs tariff classification discrepancies on chemical imports'
    ],
    functionalAreas: [
      {
        id: 'demand-planning',
        code: '12.01',
        name: 'Demand Planning',
        description: 'Statistical demand forecasting, market trend analysis, collaborative sales consensus, and demand consolidation.',
        icon: 'TrendingUp',
        phase: 'Phase 13 — SCM',
        processes: [
          {
            id: 'demand-plan-proc',
            code: '12.01.01',
            name: 'Demand Forecasting & Consensus',
            description: 'Algorithmic demand projections and regional consumption rollups.',
            phase: 'Phase 13 — SCM',
            transactions: [
              { id: 'tx-demand-forecasting', code: '12.01.01.01', name: 'Demand Forecasting', description: 'Generate baseline demand curves using moving averages and seasonality models.', phase: 'Phase 13 — SCM', actionType: 'report', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-demand-analysis', code: '12.01.01.02', name: 'Demand Analysis', description: 'Analyze forecast error, bias percentage, and stock consumption velocity.', phase: 'Phase 13 — SCM', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-demand-consolidation', code: '12.01.01.03', name: 'Demand Consolidation', description: 'Aggregate branch and regional demands into unified enterprise purchasing plans.', phase: 'Phase 13 — SCM', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] }
            ]
          }
        ]
      },
      {
        id: 'supply-planning',
        code: '12.02',
        name: 'Supply Planning',
        description: 'Supply constraint modeling, vendor capacity allocations, safety stock buffers, and network optimization.',
        icon: 'GitPullRequest',
        phase: 'Phase 13 — SCM',
        processes: [
          {
            id: 'supply-plan-proc',
            code: '12.02.01',
            name: 'Supply Allocation & Optimization',
            description: 'Match unconstrained demand against factory constraints and lead times.',
            phase: 'Phase 13 — SCM',
            transactions: [
              { id: 'tx-supply-forecast', code: '12.02.01.01', name: 'Supply Forecast', description: 'Model supplier material availability and factory throughput projections.', phase: 'Phase 13 — SCM', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-supply-allocation', code: '12.02.01.02', name: 'Supply Allocation', description: 'Ration scarce inventory across strategic business units and premier clients.', phase: 'Phase 13 — SCM', actionType: 'transaction', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-supply-optimization', code: '12.02.01.03', name: 'Supply Optimization', description: 'Linear programming solver optimizing total landed cost and service level.', phase: 'Phase 13 — SCM', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] }
            ]
          }
        ]
      },
      {
        id: 'material-planning-scm',
        code: '12.03',
        name: 'Material Planning',
        description: 'Multi-echelon inventory planning, automated procurement requisitions, and vendor replenishment lead-time controls.',
        icon: 'Layers',
        phase: 'Phase 13 — SCM',
        processes: [
          {
            id: 'mat-plan-proc',
            code: '12.03.01',
            name: 'MRP & Replenishment Schedules',
            description: 'Time-phased net requirements calculations for materials and packaging.',
            phase: 'Phase 13 — SCM',
            transactions: [
              { id: 'tx-mrp-scm', code: '12.03.01.01', name: 'MRP', description: 'Execute supply chain MRP engine explosion across all active assemblies.', phase: 'Phase 13 — SCM', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] },
              { id: 'tx-proc-planning-scm', code: '12.03.01.02', name: 'Procurement Planning', description: 'Schedule container purchase orders aligned to supplier production windows.', phase: 'Phase 13 — SCM', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-inventory-planning', code: '12.03.01.03', name: 'Inventory Planning', description: 'Calculate multi-echelon safety stock, reorder quantities, and service levels.', phase: 'Phase 13 — SCM', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'logistics-mgmt',
        code: '12.04',
        name: 'Logistics Management',
        description: 'Freight carrier management, shipping manifests, multimodal transport routes (Air/Sea/Road), and live GPS tracking.',
        icon: 'Navigation',
        phase: 'Phase 13 — SCM',
        processes: [
          {
            id: 'logistics-proc',
            code: '12.04.01',
            name: 'Shipments & Fleet Logistics',
            description: 'Carrier booking, bill of lading generation, and milestone transit tracking.',
            phase: 'Phase 13 — SCM',
            transactions: [
              { id: 'tx-logistics-planning', code: '12.04.01.01', name: 'Logistics Planning', description: 'Consolidate shipments, optimize truckload volume (FTL/LTL), and plan routes.', phase: 'Phase 13 — SCM', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-shipment-planning', code: '12.04.01.02', name: 'Shipment Planning', description: 'Assemble commercial packing lists, container stuffing plans, and freight bookings.', phase: 'Phase 13 — SCM', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-transport-mgmt-scm', code: '12.04.01.03', name: 'Transportation Management', description: 'Carrier rate comparisons, vehicle assignment, and delivery proof (POD).', phase: 'Phase 13 — SCM', actionType: 'transaction', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-shipment-tracking', code: '12.04.01.04', name: 'Shipment Tracking', description: 'Real-time telemetry tracking container milestone events and ETA updates.', phase: 'Phase 13 — SCM', actionType: 'report', requiredPermissions: ['VIEW'] }
            ]
          }
        ]
      },
      {
        id: 'import-export',
        code: '12.05',
        name: 'Import & Export',
        description: 'Letters of credit (LC), customs declarations (Bayan/HS Codes), Certificate of Origin (COO), and trade compliance.',
        icon: 'Globe',
        phase: 'Phase 13 — SCM',
        processes: [
          {
            id: 'impex-proc',
            code: '12.05.01',
            name: 'Customs, Tariff & Trade Compliance',
            description: 'Customs brokerage filing, duty calculations, and export declarations.',
            phase: 'Phase 13 — SCM',
            transactions: [
              { id: 'tx-import-mgmt', code: '12.05.01.01', name: 'Import Management', description: 'Track commercial invoices, marine insurance, and customs import entries.', phase: 'Phase 13 — SCM', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-export-mgmt', code: '12.05.01.02', name: 'Export Management', description: 'Generate export declarations, shipping bills, and consular certifications.', phase: 'Phase 13 — SCM', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-customs-doc', code: '12.05.01.03', name: 'Customs Documentation', description: 'HS code tariff mapping, COO, SASO/inspection certificates, and duty debits.', phase: 'Phase 13 — SCM', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-trade-compliance', code: '12.05.01.04', name: 'Trade Compliance', description: 'Sanctions screening, restricted party lists, and dual-use export compliance.', phase: 'Phase 13 — SCM', actionType: 'configuration', requiredPermissions: ['VIEW', 'ADMIN'] }
            ]
          }
        ]
      },
      {
        id: 'distribution',
        code: '12.06',
        name: 'Distribution',
        description: 'Regional distribution centers (RDC), hub-and-spoke replenishment, fleet dispatching, and supply chain analytics.',
        icon: 'Share2',
        phase: 'Phase 13 — SCM',
        processes: [
          {
            id: 'dist-proc',
            code: '12.06.01',
            name: 'Network Distribution & Hubs',
            description: 'Warehouse cross-docking, route dispatch, and supply chain KPIs.',
            phase: 'Phase 13 — SCM',
            transactions: [
              { id: 'tx-wh-planning-scm', code: '12.06.01.01', name: 'Warehouse Planning', description: 'Layout cross-docking zones, fast-pick channels, and pallet throughput.', phase: 'Phase 13 — SCM', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-dist-planning', code: '12.06.01.02', name: 'Distribution Planning', description: 'Plan daily replenishment waves from central distribution to local depots.', phase: 'Phase 13 — SCM', actionType: 'transaction', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-delivery-mgmt-scm', code: '12.06.01.03', name: 'Delivery Management', description: 'Dispatch delivery vans, track ePOD signatures, and handle failed delivery returns.', phase: 'Phase 13 — SCM', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] },
              { id: 'tx-scm-analytics', code: '12.06.01.04', name: 'Supply Chain Analytics', description: 'Total landed cost analysis, OTIF trends, freight spend, and inventory dwell time.', phase: 'Phase 13 — SCM', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'assets',
    code: '13',
    name: '13 — ASSET MANAGEMENT',
    shortName: 'Asset Management',
    category: 'Core Finance',
    description: 'Fixed asset register, barcode/RFID tracking, automated monthly depreciation runs (Straight Line, Declining Balance), asset revaluation, preventive maintenance, and disposals.',
    icon: 'Shield',
    color: 'amber',
    accentColor: 'text-amber-500',
    phase: 'Phase 14 — Asset Management',
    phaseNumber: 14,
    kpiPlaceholders: [
      { label: 'Total Net Book Value (NBV)', value: 'OMR 22,140,000', status: 'normal' },
      { label: 'Registered Fixed Assets', value: '1,840 Assets', status: 'normal' },
      { label: 'Maintenance Work Orders Due', value: '7 Overdue', status: 'warning' },
      { label: 'Monthly Depreciation Accrual', value: 'OMR 145,000', status: 'normal' }
    ],
    aiSuggestions: [
      'Predict remaining useful life and failure risk on Heavy Excavator EX-04 based on telematics',
      'Detect fixed assets with missing physical verification tags across regional job sites',
      'Simulate fiscal impact of shifting vehicle fleet to accelerated double-declining depreciation'
    ],
    functionalAreas: [
      {
        id: 'asset-master',
        code: '13.01',
        name: 'Asset Master',
        description: 'Comprehensive fixed asset registry, asset categorization, RFID/barcode tagging, and asset class hierarchies.',
        icon: 'BookOpen',
        phase: 'Phase 14 — Asset Management',
        processes: [
          {
            id: 'asset-master-proc',
            code: '13.01.01',
            name: 'Fixed Asset Register & Classification',
            description: 'Asset identification, tag generation, technical specifications, and category rules.',
            phase: 'Phase 14 — Asset Management',
            transactions: [
              { id: 'tx-asset-master', code: '13.01.01.01', name: 'Asset Master', description: 'Maintain asset records, serial numbers, manufacture year, and supplier details.', phase: 'Phase 14 — Asset Management', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-asset-categories', code: '13.01.01.02', name: 'Asset Categories', description: 'Configure asset classes (Buildings, Vehicles, Machinery, IT) and GL account rules.', phase: 'Phase 14 — Asset Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-asset-register', code: '13.01.01.03', name: 'Asset Register', description: 'Comprehensive statutory asset register detailing cost, accumulated depreciation, and NBV.', phase: 'Phase 14 — Asset Management', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] },
              { id: 'tx-asset-class', code: '13.01.01.04', name: 'Asset Classification', description: 'Define asset grouping hierarchies for IFRS/GAAP statutory reporting schedules.', phase: 'Phase 14 — Asset Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'asset-acquisition',
        code: '13.02',
        name: 'Asset Acquisition',
        description: 'Capital asset purchase posting, Capital Work In Progress (CWIP) capitalization, self-constructed assets, and opening asset migration.',
        icon: 'PlusCircle',
        phase: 'Phase 14 — Asset Management',
        processes: [
          {
            id: 'asset-acq-proc',
            code: '13.02.01',
            name: 'Capitalization & CWIP',
            description: 'Asset intake from AP invoices, CWIP project transfer, and opening balance uploads.',
            phase: 'Phase 14 — Asset Management',
            transactions: [
              { id: 'tx-asset-purchase', code: '13.02.01.01', name: 'Asset Purchase', description: 'Post capitalized invoice costs directly to asset subledger and generate asset tags.', phase: 'Phase 14 — Asset Management', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-asset-capitalization', code: '13.02.01.02', name: 'Asset Capitalization', description: 'Capitalize commissioning costs, freight, duties, and installation labor into asset value.', phase: 'Phase 14 — Asset Management', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] },
              { id: 'tx-asset-construction', code: '13.02.01.03', name: 'Asset Construction', description: 'Accumulate project costs in CWIP and capitalize upon issuance of completion certificate.', phase: 'Phase 14 — Asset Management', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] },
              { id: 'tx-asset-opening-bal', code: '13.02.01.04', name: 'Asset Opening Balance', description: 'Migrate legacy asset books with historical cost and accumulated depreciation layers.', phase: 'Phase 14 — Asset Management', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST', 'ADMIN'] }
            ]
          }
        ]
      },
      {
        id: 'asset-assignment-transfer',
        code: '13.03',
        name: 'Asset Assignment & Transfer',
        description: 'Custodian responsibility signoff, inter-branch asset transfers, physical location tracking, and department reassignments.',
        icon: 'Repeat',
        phase: 'Phase 14 — Asset Management',
        processes: [
          {
            id: 'asset-transfer-proc',
            code: '13.03.01',
            name: 'Custodianship & Relocation',
            description: 'Employee asset issuance, custody logs, and inter-site transfer notes.',
            phase: 'Phase 14 — Asset Management',
            transactions: [
              { id: 'tx-asset-assignment', code: '13.03.01.01', name: 'Asset Assignment', description: 'Assign equipment to specific employees or departments with digital signoff.', phase: 'Phase 14 — Asset Management', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-asset-transfer', code: '13.03.01.02', name: 'Asset Transfer', description: 'Transfer assets between branches, cost centers, or project sites with GL cost reallocation.', phase: 'Phase 14 — Asset Management', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-asset-location', code: '13.03.01.03', name: 'Asset Location', description: 'Update physical building, floor, room, or GPS coordinates for mobile assets.', phase: 'Phase 14 — Asset Management', actionType: 'transaction', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-custodian-mgmt', code: '13.03.01.04', name: 'Custodian Management', description: 'Directory of asset holders and hand-over clearance records upon staff departure.', phase: 'Phase 14 — Asset Management', actionType: 'master', requiredPermissions: ['VIEW', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'asset-valuation',
        code: '13.04',
        name: 'Asset Valuation',
        description: 'Depreciation calculation engines, revaluation reserves, impairment testing (IAS 36), and fair value adjustments.',
        icon: 'TrendingDown',
        phase: 'Phase 14 — Asset Management',
        processes: [
          {
            id: 'asset-val-proc',
            code: '13.04.01',
            name: 'Depreciation & Impairment',
            description: 'Automated depreciation schedules, salvage value changes, and revaluation postings.',
            phase: 'Phase 14 — Asset Management',
            transactions: [
              { id: 'tx-depreciation', code: '13.04.01.01', name: 'Depreciation', description: 'Execute periodic batch depreciation runs posting expense and accumulated entries to GL.', phase: 'Phase 14 — Asset Management', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] },
              { id: 'tx-asset-revaluation', code: '13.04.01.02', name: 'Asset Revaluation', description: 'Post professional asset revaluation gains/losses and update revaluation reserve.', phase: 'Phase 14 — Asset Management', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST', 'ADMIN'] },
              { id: 'tx-asset-impairment', code: '13.04.01.03', name: 'Asset Impairment', description: 'Assess recoverable amount and book impairment write-downs under IAS 36.', phase: 'Phase 14 — Asset Management', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST', 'ADMIN'] },
              { id: 'tx-asset-valuation-tx', code: '13.04.01.04', name: 'Asset Valuation', description: 'Comprehensive valuation summary displaying historical cost, indexation, and fair value.', phase: 'Phase 14 — Asset Management', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] }
            ]
          }
        ]
      },
      {
        id: 'asset-maintenance',
        code: '13.05',
        name: 'Asset Maintenance',
        description: 'Plant maintenance schedules, equipment breakdown tickets, spare part consumption, and maintenance costing.',
        icon: 'Tool',
        phase: 'Phase 14 — Asset Management',
        processes: [
          {
            id: 'asset-maint-proc',
            code: '13.05.01',
            name: 'Preventive & Corrective Maintenance',
            description: 'PM schedules, work order workbooks, spare parts, and technician logs.',
            phase: 'Phase 14 — Asset Management',
            transactions: [
              { id: 'tx-prev-maint', code: '13.05.01.01', name: 'Preventive Maintenance', description: 'Set calendar or meter-based (hours, km) automated PM service triggers.', phase: 'Phase 14 — Asset Management', actionType: 'configuration', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-corrective-maint', code: '13.05.01.02', name: 'Corrective Maintenance', description: 'Log breakdown work orders, root cause diagnostic notes, and repair actions.', phase: 'Phase 14 — Asset Management', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-maint-sched', code: '13.05.01.03', name: 'Maintenance Schedule', description: 'Visual master calendar of planned shutdowns and technician service tasks.', phase: 'Phase 14 — Asset Management', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-maint-cost', code: '13.05.01.04', name: 'Maintenance Cost', description: 'Track cumulative spare parts, external vendor services, and labor spent on each asset.', phase: 'Phase 14 — Asset Management', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] }
            ]
          }
        ]
      },
      {
        id: 'asset-disposal-verification',
        code: '13.06',
        name: 'Asset Disposal & Verification',
        description: 'Asset scrapping, auction/sale invoicing, physical RFID stocktake verification, insurance policies, and statutory disposal reporting.',
        icon: 'Trash2',
        phase: 'Phase 14 — Asset Management',
        processes: [
          {
            id: 'asset-disp-proc',
            code: '13.06.01',
            name: 'Disposals, Physical Audit & Insurance',
            description: 'De-recognition of assets, physical verification counts, and insurance coverage.',
            phase: 'Phase 14 — Asset Management',
            transactions: [
              { id: 'tx-asset-disposal', code: '13.06.01.01', name: 'Asset Disposal', description: 'Retire obsolete or damaged assets and write off remaining net book value.', phase: 'Phase 14 — Asset Management', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST', 'APPROVE'] },
              { id: 'tx-asset-sale', code: '13.06.01.02', name: 'Asset Sale', description: 'Sell assets to external buyers, calculate gain/loss on disposal, and issue tax invoice.', phase: 'Phase 14 — Asset Management', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-asset-verification', code: '13.06.01.03', name: 'Asset Verification', description: 'Conduct physical barcode/RFID audits and reconcile missing or unrecorded assets.', phase: 'Phase 14 — Asset Management', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-asset-insurance', code: '13.06.01.04', name: 'Asset Insurance', description: 'Track asset insurance policies, insured values, premium schedules, and claims.', phase: 'Phase 14 — Asset Management', actionType: 'master', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-asset-reports', code: '13.06.01.05', name: 'Asset Reports', description: 'Disposal gain/loss schedules, depreciation forecasts, and asset movement ledgers.', phase: 'Phase 14 — Asset Management', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'quality',
    code: '14',
    name: '14 — QUALITY MANAGEMENT (QMS)',
    shortName: 'Quality Management (QMS)',
    category: 'Governance & Analytics',
    description: 'ISO 9001 quality framework, inspection plans, material laboratory testing, Non-Conformance Reports (NCR), Corrective Actions (CAPA), and audit compliance.',
    icon: 'CheckCircle',
    color: 'teal',
    accentColor: 'text-teal-500',
    phase: 'Phase 15 — QMS',
    phaseNumber: 15,
    kpiPlaceholders: [
      { label: 'First Pass Quality Yield', value: '98.6%', trend: '+0.4%', status: 'positive' },
      { label: 'Open Non-Conformance (NCR)', value: '6 Reports', status: 'warning' },
      { label: 'Active CAPA Investigations', value: '4 In-Progress', status: 'normal' },
      { label: 'Supplier Defect PPM', value: '180 PPM (Top Tier)', status: 'positive' }
    ],
    aiSuggestions: [
      'Perform 5-Why root cause analysis on Recurring Defect Code D-402 on welding joints',
      'Generate draft Corrective and Preventive Action (CAPA) response plan for ISO audit finding',
      'Predict supplier batch rejection probability using incoming inspection history'
    ],
    functionalAreas: [
      {
        id: 'quality-standards',
        code: '14.01',
        name: 'Quality Standards',
        description: 'Corporate quality manuals, ISO/ASTM specification libraries, test parameters, and regulatory quality policies.',
        icon: 'Book',
        phase: 'Phase 15 — QMS',
        processes: [
          {
            id: 'q-standards-proc',
            code: '14.01.01',
            name: 'Standards & Technical Specifications',
            description: 'Quality policies, acceptable quality limits (AQL), and tolerance standards.',
            phase: 'Phase 15 — QMS',
            transactions: [
              { id: 'tx-quality-standards', code: '14.01.01.01', name: 'Quality Standards', description: 'Define international standards (ISO 9001, API, ASTM) and internal quality benchmarks.', phase: 'Phase 15 — QMS', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-quality-policies', code: '14.01.01.02', name: 'Quality Policies', description: 'Publish organizational quality objectives, governance guidelines, and compliance rules.', phase: 'Phase 15 — QMS', actionType: 'master', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-quality-specs', code: '14.01.01.03', name: 'Quality Specifications', description: 'Configure quantitative parameter thresholds (tensile strength, purity, dimensions).', phase: 'Phase 15 — QMS', actionType: 'configuration', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'quality-planning',
        code: '14.02',
        name: 'Quality Planning',
        description: 'Inspection & Test Plans (ITP), quality checklists, sampling plan formulas (MIL-STD-105E), and hold points.',
        icon: 'Calendar',
        phase: 'Phase 15 — QMS',
        processes: [
          {
            id: 'q-plan-proc',
            code: '14.02.01',
            name: 'Inspection Plans & Checklists',
            description: 'ITPs, quality control points, sampling sizes, and inspection checklists.',
            phase: 'Phase 15 — QMS',
            transactions: [
              { id: 'tx-quality-plans', code: '14.02.01.01', name: 'Quality Plans', description: 'Establish project-specific quality control plans and milestone inspection gates.', phase: 'Phase 15 — QMS', actionType: 'configuration', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-inspection-plans', code: '14.02.01.02', name: 'Inspection Plans', description: 'Define mandatory test sequences for raw material, in-process, and finished goods.', phase: 'Phase 15 — QMS', actionType: 'configuration', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-quality-checklists', code: '14.02.01.03', name: 'Quality Checklists', description: 'Digital inspection checklists for mobile QA/QC inspectors on shop floor or site.', phase: 'Phase 15 — QMS', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-sampling-plans', code: '14.02.01.04', name: 'Sampling Plans', description: 'Configure statistical sampling levels based on batch lot size and risk criticality.', phase: 'Phase 15 — QMS', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'inspection-testing',
        code: '14.03',
        name: 'Inspection & Testing',
        description: 'Receiving inspection, in-process testing during production, final pre-dispatch inspection, and lab certificates of analysis (CoA).',
        icon: 'CheckSquare',
        phase: 'Phase 15 — QMS',
        processes: [
          {
            id: 'insp-test-proc',
            code: '14.03.01',
            name: 'Quality Testing & Certificate of Analysis',
            description: 'Inspection execution, lab test results, pass/fail decisions, and release notes.',
            phase: 'Phase 15 — QMS',
            transactions: [
              { id: 'tx-incoming-inspection', code: '14.03.01.01', name: 'Incoming Inspection', description: 'Test supplier raw materials at warehouse receiving before posting GRN.', phase: 'Phase 15 — QMS', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-inprocess-inspection', code: '14.03.01.02', name: 'In-Process Inspection', description: 'Conduct stage quality checks on production line between operations.', phase: 'Phase 15 — QMS', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-final-inspection', code: '14.03.01.03', name: 'Final Inspection', description: 'Verify finished goods packaging, dimensions, and issue Certificate of Conformity.', phase: 'Phase 15 — QMS', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-material-testing', code: '14.03.01.04', name: 'Material Testing', description: 'Log specialized lab test results, chemical composition, and stress curves.', phase: 'Phase 15 — QMS', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] }
            ]
          }
        ]
      },
      {
        id: 'non-conformance',
        code: '14.04',
        name: 'Non-Conformance',
        description: 'Non-Conformance Reports (NCR), material quarantine tagging, defect categorization, and disposition boards.',
        icon: 'AlertTriangle',
        phase: 'Phase 15 — QMS',
        processes: [
          {
            id: 'ncr-proc',
            code: '14.04.01',
            name: 'NCRs, Quarantine & Disposition',
            description: 'Issue defect reports, place stock on quarantine hold, and approve dispositions.',
            phase: 'Phase 15 — QMS',
            transactions: [
              { id: 'tx-ncr', code: '14.04.01.01', name: 'NCR', description: 'Raise official Non-Conformance Reports detailing defect nature, severity, and photo proofs.', phase: 'Phase 15 — QMS', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-defect-mgmt', code: '14.04.01.02', name: 'Defect Management', description: 'Classify defects (Critical, Major, Minor) and track frequency trends by supplier/line.', phase: 'Phase 15 — QMS', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-ncr-tracking', code: '14.04.01.03', name: 'Non-Conformance Tracking', description: 'Review disposition outcomes (Rework, Scrap, Return to Vendor, Concession).', phase: 'Phase 15 — QMS', actionType: 'report', requiredPermissions: ['VIEW', 'APPROVE'] }
            ]
          }
        ]
      },
      {
        id: 'corrective-preventive-actions',
        code: '14.05',
        name: 'Corrective & Preventive Actions',
        description: 'CAPA lifecycle management, 8D problem solving, 5-Why root cause investigations, action verification, and closure.',
        icon: 'ShieldAlert',
        phase: 'Phase 15 — QMS',
        processes: [
          {
            id: 'capa-proc',
            code: '14.05.01',
            name: 'CAPA & 8D Problem Solving',
            description: 'Root cause analysis, containment actions, long-term fix verification, and closure.',
            phase: 'Phase 15 — QMS',
            transactions: [
              { id: 'tx-corrective-actions', code: '14.05.01.01', name: 'Corrective Actions', description: 'Initiate formal corrective action requests to eliminate causes of detected defects.', phase: 'Phase 15 — QMS', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-preventive-actions', code: '14.05.01.02', name: 'Preventive Actions', description: 'Formulate proactive process modifications to mitigate potential quality risks.', phase: 'Phase 15 — QMS', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-root-cause-analysis', code: '14.05.01.03', name: 'Root Cause Analysis', description: 'Interactive Ishikawa (Fishbone) diagrams, 5-Why trees, and fault tree logging.', phase: 'Phase 15 — QMS', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-capa-tracking', code: '14.05.01.04', name: 'CAPA Tracking', description: 'Audit implementation effectiveness before approving formal CAPA closure.', phase: 'Phase 15 — QMS', actionType: 'report', requiredPermissions: ['VIEW', 'APPROVE'] }
            ]
          }
        ]
      },
      {
        id: 'quality-audit-reporting',
        code: '14.06',
        name: 'Quality Audit & Reporting',
        description: 'Internal QMS audits, supplier qualification audits, compliance certificates, and executive quality KPI scorecards.',
        icon: 'FileCheck',
        phase: 'Phase 15 — QMS',
        processes: [
          {
            id: 'q-audit-proc',
            code: '14.06.01',
            name: 'Quality Audits, Certificates & KPIs',
            description: 'Audit schedules, findings reports, calibration records, and quality metrics.',
            phase: 'Phase 15 — QMS',
            transactions: [
              { id: 'tx-quality-audits', code: '14.06.01.01', name: 'Quality Audits', description: 'Plan internal department quality audits and log non-compliance findings.', phase: 'Phase 15 — QMS', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-supp-quality', code: '14.06.01.02', name: 'Supplier Quality', description: 'Supplier quality audit ratings, incoming defect PPM, and approved vendor list (AVL).', phase: 'Phase 15 — QMS', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-quality-cert', code: '14.06.01.03', name: 'Quality Certificates', description: 'Store calibration certificates, mill test certificates, and ISO compliance credentials.', phase: 'Phase 15 — QMS', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-quality-kpis', code: '14.06.01.04', name: 'Quality KPIs', description: 'Executive dashboard showing Cost of Poor Quality (COPQ), scrap rate, and yield.', phase: 'Phase 15 — QMS', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'construction',
    code: '15',
    name: '15 — CONSTRUCTION / CONTRACT MANAGEMENT',
    shortName: 'Construction & Contracts',
    category: 'Operations & Supply',
    description: 'FIDIC contracts, hierarchical Bill of Quantities (BOQ), site daily activity logs, Interim Payment Certificates (IPC), retention bonds, claims, and final account closeout.',
    icon: 'HardHat',
    color: 'orange',
    accentColor: 'text-orange-500',
    phase: 'Phase 16 — Construction / Contract',
    phaseNumber: 16,
    kpiPlaceholders: [
      { label: 'Active FIDIC Contracts', value: '12 Active Sites', status: 'normal' },
      { label: 'Certified Work-In-Progress', value: 'OMR 34,200,000', status: 'normal' },
      { label: 'Retention Withheld', value: 'OMR 1,710,000', status: 'normal' },
      { label: 'Pending Variation Claims', value: 'OMR 890,000 (4 Claims)', status: 'warning' }
    ],
    aiSuggestions: [
      'Compare contractor Interim Payment Certificate (IPC-14) against surveyor certified progress',
      'Analyze contract variation claim documentation against FIDIC Clause 20 notice deadlines',
      'Predict retention release cash flow dates based on practical completion milestones'
    ],
    functionalAreas: [
      {
        id: 'contract-management',
        code: '15.01',
        name: 'Contract Management',
        description: 'Prime client contracts, FIDIC terms, specialized trade subcontracts, and commercial payment conditions.',
        icon: 'FileText',
        phase: 'Phase 16 — Construction / Contract',
        processes: [
          {
            id: 'contract-mgmt-proc',
            code: '15.01.01',
            name: 'Prime Contracts & Subcontracts',
            description: 'Contract terms, employer requirements, subcontractor agreements, and milestones.',
            phase: 'Phase 16 — Construction / Contract',
            transactions: [
              { id: 'tx-contract-master', code: '15.01.01.01', name: 'Contract Master', description: 'Maintain contract agreements, original values, commencement, and completion dates.', phase: 'Phase 16 — Construction / Contract', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-client-contracts', code: '15.01.01.02', name: 'Client Contracts', description: 'Manage employer agreements, billing terms, advance percentages, and retention rules.', phase: 'Phase 16 — Construction / Contract', actionType: 'master', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-subcontracts', code: '15.01.01.03', name: 'Subcontracts', description: 'Package trade subcontracts (MEP, Civil, Fitout), back-to-back conditions, and pay-when-paid.', phase: 'Phase 16 — Construction / Contract', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-contract-terms', code: '15.01.01.04', name: 'Contract Terms', description: 'Track liquidated damages clauses, defect liability periods (DLP), and dispute terms.', phase: 'Phase 16 — Construction / Contract', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'boq-management',
        code: '15.02',
        name: 'BOQ Management',
        description: 'Hierarchical Bill of Quantities (BOQ), unit rate breakdown analysis, revision addendums, and quantity takeoff tracking.',
        icon: 'List',
        phase: 'Phase 16 — Construction / Contract',
        processes: [
          {
            id: 'boq-proc',
            code: '15.02.01',
            name: 'Bill of Quantities & Rate Analysis',
            description: 'BOQ line items, unit rates, quantities, and re-measurement records.',
            phase: 'Phase 16 — Construction / Contract',
            transactions: [
              { id: 'tx-boq', code: '15.02.01.01', name: 'BOQ', description: 'Upload and maintain multi-division bill of quantities (Civil, Structural, Architectural).', phase: 'Phase 16 — Construction / Contract', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-boq-rate-mgmt', code: '15.02.01.02', name: 'BOQ Rate Management', description: 'Deconstruct unit rates into material, labor, equipment, and markup components.', phase: 'Phase 16 — Construction / Contract', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-boq-revision', code: '15.02.01.03', name: 'BOQ Revision', description: 'Manage tender addendums, issued-for-construction (IFC) revisions, and variations.', phase: 'Phase 16 — Construction / Contract', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'APPROVE'] },
              { id: 'tx-boq-qty-tracking', code: '15.02.01.04', name: 'BOQ Quantity Tracking', description: 'Track tender vs actual installed quantities to detect scope creep or overruns.', phase: 'Phase 16 — Construction / Contract', actionType: 'report', requiredPermissions: ['VIEW'] }
            ]
          }
        ]
      },
      {
        id: 'site-work-mgmt',
        code: '15.03',
        name: 'Site & Work Management',
        description: 'Daily Site Diary reports (DSR), subcontractor work orders, milestone inspections, and site safety logs.',
        icon: 'MapPin',
        phase: 'Phase 16 — Construction / Contract',
        processes: [
          {
            id: 'site-mgmt-proc',
            code: '15.03.01',
            name: 'Site Diary, Work Orders & Milestones',
            description: 'Daily site activity logs, plant utilization records, and milestone inspections.',
            phase: 'Phase 16 — Construction / Contract',
            transactions: [
              { id: 'tx-site-mgmt', code: '15.03.01.01', name: 'Site Management', description: 'Configure site office setups, access permits, and material staging yards.', phase: 'Phase 16 — Construction / Contract', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-site-work-orders', code: '15.03.01.02', name: 'Work Orders', description: 'Issue specific construction work tasks to internal crews or trade subcontractors.', phase: 'Phase 16 — Construction / Contract', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-project-milestones-const', code: '15.03.01.03', name: 'Project Milestones', description: 'Track contractual progress milestones and consultant inspection signoffs.', phase: 'Phase 16 — Construction / Contract', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-site-activities', code: '15.03.01.04', name: 'Site Activities', description: 'Daily site diary logging manpower headcount, equipment hours, weather, and progress.', phase: 'Phase 16 — Construction / Contract', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] }
            ]
          }
        ]
      },
      {
        id: 'progress-billing-const',
        code: '15.04',
        name: 'Progress & Billing',
        description: 'Surveyor joint measurement sheets, Interim Payment Certificates (IPC), client progress claims, and subcontractor billing.',
        icon: 'Receipt',
        phase: 'Phase 16 — Construction / Contract',
        processes: [
          {
            id: 'ipc-proc',
            code: '15.04.01',
            name: 'Measurement & Payment Certificates (IPC)',
            description: 'Joint progress measurement, IPC calculations, and subcontractor certificates.',
            phase: 'Phase 16 — Construction / Contract',
            transactions: [
              { id: 'tx-progress-meas', code: '15.04.01.01', name: 'Progress Measurement', description: 'Record joint on-site quantity measurements signed off by supervising engineer.', phase: 'Phase 16 — Construction / Contract', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-ipc', code: '15.04.01.02', name: 'Interim Payment Certificate', description: 'Generate formal IPCs with previous cumulative, this period, and balance to complete.', phase: 'Phase 16 — Construction / Contract', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'PRINT'] },
              { id: 'tx-progress-billing-const', code: '15.04.01.03', name: 'Progress Billing', description: 'Issue client tax invoices matching certified IPC values and VAT requirements.', phase: 'Phase 16 — Construction / Contract', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] },
              { id: 'tx-subcontractor-billing', code: '15.04.01.04', name: 'Subcontractor Billing', description: 'Audit and approve trade subcontractor payment applications against site verification.', phase: 'Phase 16 — Construction / Contract', actionType: 'transaction', requiredPermissions: ['VIEW', 'APPROVE', 'POST'] }
            ]
          }
        ]
      },
      {
        id: 'contract-fin-mgmt',
        code: '15.05',
        name: 'Contract Financial Management',
        description: 'Retention money deductions, advance payment amortization schedules, site costing ledger, and contract profitability.',
        icon: 'DollarSign',
        phase: 'Phase 16 — Construction / Contract',
        processes: [
          {
            id: 'contract-fin-proc',
            code: '15.05.01',
            name: 'Retention, Advances & Profitability',
            description: 'Retention ledger, advance payment recovery schedules, and contract margins.',
            phase: 'Phase 16 — Construction / Contract',
            transactions: [
              { id: 'tx-retention', code: '15.05.01.01', name: 'Retention', description: 'Track withheld retention ledger accounts (5-10%) for clients and subcontractors.', phase: 'Phase 16 — Construction / Contract', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-advance-payment', code: '15.05.01.02', name: 'Advance Payment', description: 'Book mobilization advances received from employer or paid to subcontractors.', phase: 'Phase 16 — Construction / Contract', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] },
              { id: 'tx-advance-recovery', code: '15.05.01.03', name: 'Advance Recovery', description: 'Automate pro-rata advance payment deductions from monthly progress certificates.', phase: 'Phase 16 — Construction / Contract', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] },
              { id: 'tx-contract-costing', code: '15.05.01.04', name: 'Contract Costing', description: 'Consolidated contract cost ledger tracking actuals against BOQ allowances.', phase: 'Phase 16 — Construction / Contract', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-contract-profitability', code: '15.05.01.05', name: 'Contract Profitability', description: 'Real-time project gross margin analysis and projected completion profitability.', phase: 'Phase 16 — Construction / Contract', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] }
            ]
          }
        ]
      },
      {
        id: 'bonds-guarantees',
        code: '15.06',
        name: 'Bonds & Guarantees',
        description: 'Performance Bonds, Tender Bid Bonds, Advance Payment Guarantees (APG), Retention Bonds, and bank letter expiry alerts.',
        icon: 'ShieldCheck',
        phase: 'Phase 16 — Construction / Contract',
        processes: [
          {
            id: 'bonds-proc',
            code: '15.06.01',
            name: 'Bank Guarantees & Bonds',
            description: 'Issue, track, renew, and release project bank guarantee instruments.',
            phase: 'Phase 16 — Construction / Contract',
            transactions: [
              { id: 'tx-perf-bonds', code: '15.06.01.01', name: 'Performance Bonds', description: 'Maintain bank performance guarantees (typically 10%) and track expiry milestones.', phase: 'Phase 16 — Construction / Contract', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-retention-bonds', code: '15.06.01.02', name: 'Retention Bonds', description: 'Issue bank guarantees in lieu of cash retention to optimize contractor cash flow.', phase: 'Phase 16 — Construction / Contract', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-bank-guarantees', code: '15.06.01.03', name: 'Bank Guarantees', description: 'Manage tender bonds and advance payment guarantees with issuing banks.', phase: 'Phase 16 — Construction / Contract', actionType: 'master', requiredPermissions: ['VIEW', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'variations-claims',
        code: '15.07',
        name: 'Variations & Claims',
        description: 'Variation Orders (VO), scope changes, Extension of Time (EOT) claims, prolongation cost assessments, and liquidated damages.',
        icon: 'AlertCircle',
        phase: 'Phase 16 — Construction / Contract',
        processes: [
          {
            id: 'claims-proc',
            code: '15.07.01',
            name: 'Variation Orders & EOT Claims',
            description: 'Scope change evaluation, rate negotiations, EOT requests, and claim settlements.',
            phase: 'Phase 16 — Construction / Contract',
            transactions: [
              { id: 'tx-variations', code: '15.07.01.01', name: 'Variations', description: 'Register site Variation Orders (VO), submit rate justifications, and track client approvals.', phase: 'Phase 16 — Construction / Contract', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'APPROVE'] },
              { id: 'tx-claims', code: '15.07.01.02', name: 'Claims', description: 'Formal financial claims for unforeseen site conditions, delays, and disruptions.', phase: 'Phase 16 — Construction / Contract', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-eot', code: '15.07.01.03', name: 'Extension of Time', description: 'Submit and substantiate EOT claims with critical path delay fragnet analysis.', phase: 'Phase 16 — Construction / Contract', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'APPROVE'] },
              { id: 'tx-liquidated-damages', code: '15.07.01.04', name: 'Liquidated Damages', description: 'Assess and monitor contractual delay damages exposure under contract terms.', phase: 'Phase 16 — Construction / Contract', actionType: 'report', requiredPermissions: ['VIEW'] }
            ]
          }
        ]
      },
      {
        id: 'contract-closeout',
        code: '15.08',
        name: 'Contract Closeout',
        description: 'Practical completion certificates (TOC), Final Account settlement, Defect Liability Period (DLP) retention release, and closeout signoff.',
        icon: 'CheckCircle',
        phase: 'Phase 16 — Construction / Contract',
        processes: [
          {
            id: 'closeout-proc',
            code: '15.08.01',
            name: 'Final Accounts & Retention Release',
            description: 'Reconcile all VOs, finalize contract balance, release final retention, and close.',
            phase: 'Phase 16 — Construction / Contract',
            transactions: [
              { id: 'tx-final-account', code: '15.08.01.01', name: 'Final Account', description: 'Prepare comprehensive final statement of contract value reconciling all VOs and claims.', phase: 'Phase 16 — Construction / Contract', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'APPROVE'] },
              { id: 'tx-contract-completion', code: '15.08.01.02', name: 'Contract Completion', description: 'Issue Taking-Over Certificate (TOC) and transition project to maintenance warranty.', phase: 'Phase 16 — Construction / Contract', actionType: 'transaction', requiredPermissions: ['VIEW', 'APPROVE'] },
              { id: 'tx-final-retention-release', code: '15.08.01.03', name: 'Final Retention Release', description: 'Process final 50% retention release upon expiry of Defect Liability Period (DLP).', phase: 'Phase 16 — Construction / Contract', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST', 'APPROVE'] },
              { id: 'tx-contract-closeout-tx', code: '15.08.01.04', name: 'Contract Closeout', description: 'Formal commercial and legal closeout archiving all project and contract documents.', phase: 'Phase 16 — Construction / Contract', actionType: 'transaction', requiredPermissions: ['VIEW', 'ADMIN'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'financial-accounting',
    code: '16',
    name: '16 — FINANCIAL ACCOUNTING & REPORTING',
    shortName: 'Financial Accounting',
    category: 'Core Finance',
    description: 'Double-entry General Ledger (GL), Accounts Payable (AP), Accounts Receivable (AR), automated VAT tax reporting, intercompany eliminations, multi-currency, and IFRS financial statements.',
    icon: 'Calculator',
    color: 'emerald',
    accentColor: 'text-emerald-500',
    phase: 'Phase 17 — Financial Accounting',
    phaseNumber: 17,
    kpiPlaceholders: [
      { label: 'Current Ratio (Liquidity)', value: '2.14 (Strong)', status: 'positive' },
      { label: 'Open AR Aging (>90 Days)', value: 'OMR 420,000', status: 'warning' },
      { label: 'Unposted Journal Vouchers', value: '8 Drafts', status: 'normal' },
      { label: 'Net Profit Margin (YTD)', value: '18.4%', trend: '+2.1%', status: 'positive' }
    ],
    aiSuggestions: [
      'Detect anomalous duplicate supplier invoices with matching amount and date patterns',
      'Generate draft commentary for quarterly IFRS Balance Sheet variances for board audit pack',
      'Perform automated intercompany account reconciliation and propose elimination journal entries'
    ],
    functionalAreas: [
      {
        id: 'general-ledger',
        code: '16.01',
        name: 'General Ledger',
        description: 'Multi-tiered Chart of Accounts (COA), manual and automated journal entries, recurring vouchers, and general ledger inquiry.',
        icon: 'BookOpen',
        phase: 'Phase 17 — Financial Accounting',
        processes: [
          {
            id: 'gl-proc',
            code: '16.01.01',
            name: 'Chart of Accounts & Journals',
            description: 'Master COA architecture, journal entry postings, and ledger queries.',
            phase: 'Phase 17 — Financial Accounting',
            transactions: [
              { id: 'tx-coa', code: '16.01.01.01', name: 'Chart of Accounts', description: 'Hierarchical account structure with asset, liability, equity, revenue, and expense trees.', phase: 'Phase 17 — Financial Accounting', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT', 'ADMIN'] },
              { id: 'tx-journal-entries', code: '16.01.01.02', name: 'Journal Entries', description: 'Create balanced double-entry vouchers with currency, cost center, and project tags.', phase: 'Phase 17 — Financial Accounting', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-recurring-journals', code: '16.01.01.03', name: 'Recurring Journals', description: 'Automate periodic monthly adjustments (e.g., rent amortization, insurance accruals).', phase: 'Phase 17 — Financial Accounting', actionType: 'configuration', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-general-ledger-tx', code: '16.01.01.04', name: 'General Ledger', description: 'Comprehensive transactional ledger inquiry with running balance and source voucher drill-down.', phase: 'Phase 17 — Financial Accounting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] }
            ]
          }
        ]
      },
      {
        id: 'accounts-payable',
        code: '16.02',
        name: 'Accounts Payable',
        description: 'Vendor invoice processing, VAT tax checks, invoice approval routing, sub-ledger posting, and payment due schedules.',
        icon: 'ArrowDownRight',
        phase: 'Phase 17 — Financial Accounting',
        processes: [
          {
            id: 'ap-proc',
            code: '16.02.01',
            name: 'Supplier Invoices & AP Sub-ledger',
            description: 'Vendor bill booking, tax calculation, payment schedule, and AP aging.',
            phase: 'Phase 17 — Financial Accounting',
            transactions: [
              { id: 'tx-supp-invoices-ap', code: '16.02.01.01', name: 'Supplier Invoices', description: 'Register vendor invoices against purchase orders or standalone services.', phase: 'Phase 17 — Financial Accounting', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-inv-verification-ap', code: '16.02.01.02', name: 'Invoice Verification', description: 'Audit supplier tax registration, billing amounts, and verify line item math.', phase: 'Phase 17 — Financial Accounting', actionType: 'transaction', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-vat-calc-ap', code: '16.02.01.03', name: 'VAT Calculation', description: 'Calculate input VAT credits, zero-rated purchases, and reverse charge mechanisms.', phase: 'Phase 17 — Financial Accounting', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] },
              { id: 'tx-inv-approval-ap', code: '16.02.01.04', name: 'Invoice Approval', description: 'Managerial signoff for invoice processing based on approval limit rules.', phase: 'Phase 17 — Financial Accounting', actionType: 'workflow', requiredPermissions: ['VIEW', 'APPROVE'] },
              { id: 'tx-posting-to-gl', code: '16.02.01.05', name: 'Posting to GL', description: 'Commit verified AP vouchers to General Ledger updating accounts payable liabilities.', phase: 'Phase 17 — Financial Accounting', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] },
              { id: 'tx-payment-due-date', code: '16.02.01.06', name: 'Payment Due Date', description: 'Cash outflow payment run queue prioritized by vendor credit term maturity.', phase: 'Phase 17 — Financial Accounting', actionType: 'report', requiredPermissions: ['VIEW'] }
            ]
          }
        ]
      },
      {
        id: 'accounts-receivable',
        code: '16.03',
        name: 'Accounts Receivable',
        description: 'Customer billing tax invoices, credit notes, customer collections, receipt allocation, and AR aging analysis.',
        icon: 'ArrowUpRight',
        phase: 'Phase 17 — Financial Accounting',
        processes: [
          {
            id: 'ar-proc',
            code: '16.03.01',
            name: 'Customer Invoices & AR Aging',
            description: 'Statutory invoicing, customer payment matching, and collection workflows.',
            phase: 'Phase 17 — Financial Accounting',
            transactions: [
              { id: 'tx-cust-invoices-ar', code: '16.03.01.01', name: 'Customer Invoices', description: 'Issue official tax invoices debiting customer sub-ledger and crediting revenue.', phase: 'Phase 17 — Financial Accounting', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST', 'PRINT'] },
              { id: 'tx-credit-notes-ar', code: '16.03.01.02', name: 'Credit Notes', description: 'Post customer credit adjustments, trade discounts, and return credits.', phase: 'Phase 17 — Financial Accounting', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-cust-receipts-ar', code: '16.03.01.03', name: 'Customer Receipts', description: 'Record bank wires, cheques, and credit card payments against client accounts.', phase: 'Phase 17 — Financial Accounting', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-receipt-alloc-ar', code: '16.03.01.04', name: 'Receipt Allocation', description: 'Match customer receipts against open invoice lines and tax schedules.', phase: 'Phase 17 — Financial Accounting', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] },
              { id: 'tx-cust-aging-ar', code: '16.03.01.05', name: 'Customer Aging', description: 'Comprehensive AR aging reports bucketed by 30, 60, 90, 120+ days.', phase: 'Phase 17 — Financial Accounting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] }
            ]
          }
        ]
      },
      {
        id: 'cash-bank-accounting',
        code: '16.04',
        name: 'Cash & Bank Accounting',
        description: 'Cash journal vouchers, bank receipts & disbursements, automated bank reconciliations, and real-time treasury balances.',
        icon: 'Landmark',
        phase: 'Phase 17 — Financial Accounting',
        processes: [
          {
            id: 'cash-bank-proc',
            code: '16.04.01',
            name: 'Treasury & Bank Ledgers',
            description: 'Cash books, bank transactions, and ledger reconciliation balances.',
            phase: 'Phase 17 — Financial Accounting',
            transactions: [
              { id: 'tx-cash-trans', code: '16.04.01.01', name: 'Cash Transactions', description: 'Record physical cash deposits, till disbursements, and safe transfers.', phase: 'Phase 17 — Financial Accounting', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-bank-trans', code: '16.04.01.02', name: 'Bank Transactions', description: 'Post electronic wire transfers, bank charges, and interest earnings to GL.', phase: 'Phase 17 — Financial Accounting', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-bank-recon-acct', code: '16.04.01.03', name: 'Bank Reconciliation', description: 'Reconcile general ledger bank accounts against imported bank statements.', phase: 'Phase 17 — Financial Accounting', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] },
              { id: 'tx-cash-bank-balances', code: '16.04.01.04', name: 'Cash & Bank Balances', description: 'Real-time multi-currency liquidity balance sheet across all institution accounts.', phase: 'Phase 17 — Financial Accounting', actionType: 'report', requiredPermissions: ['VIEW'] }
            ]
          }
        ]
      },
      {
        id: 'fixed-assets-accounting',
        code: '16.05',
        name: 'Fixed Assets Accounting',
        description: 'Asset capitalization vouchers, monthly depreciation expense posting, disposal gain/loss recognition, and asset sub-ledger reconciliation.',
        icon: 'Shield',
        phase: 'Phase 17 — Financial Accounting',
        processes: [
          {
            id: 'fa-acct-proc',
            code: '16.05.01',
            name: 'Asset Sub-ledger & Depreciation Postings',
            description: 'Asset capitalization, depreciation entries, and disposal gain/loss GL impact.',
            phase: 'Phase 17 — Financial Accounting',
            transactions: [
              { id: 'tx-asset-cap-acct', code: '16.05.01.01', name: 'Asset Capitalization', description: 'Transfer accumulated CWIP expenses to fixed asset balance sheet accounts.', phase: 'Phase 17 — Financial Accounting', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] },
              { id: 'tx-depr-acct', code: '16.05.01.02', name: 'Depreciation', description: 'Post monthly depreciation expense debit and accumulated depreciation credit.', phase: 'Phase 17 — Financial Accounting', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] },
              { id: 'tx-asset-disp-acct', code: '16.05.01.03', name: 'Asset Disposal', description: 'De-recognize asset cost, reverse accumulated depreciation, and recognize gain/loss.', phase: 'Phase 17 — Financial Accounting', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] },
              { id: 'tx-asset-acct-rep', code: '16.05.01.04', name: 'Asset Accounting', description: 'Reconcile fixed asset sub-ledger against GL control account balance.', phase: 'Phase 17 — Financial Accounting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] }
            ]
          }
        ]
      },
      {
        id: 'period-end-accounting',
        code: '16.06',
        name: 'Period-End Accounting',
        description: 'Accrual journals, prepayment amortization, provisions for doubtful debts, monthly soft closing, and annual fiscal year-end closing.',
        icon: 'CalendarCheck',
        phase: 'Phase 17 — Financial Accounting',
        processes: [
          {
            id: 'period-end-proc',
            code: '16.06.01',
            name: 'Closing & Adjustments',
            description: 'Monthly closing checklists, prepayments, provisions, and fiscal year closing.',
            phase: 'Phase 17 — Financial Accounting',
            transactions: [
              { id: 'tx-accruals', code: '16.06.01.01', name: 'Accruals', description: 'Book unbilled expenses (utilities, unbilled vendor services) to period expense.', phase: 'Phase 17 — Financial Accounting', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-prepayments', code: '16.06.01.02', name: 'Prepayments', description: 'Amortize prepaid rent and annual software licenses into monthly expense lines.', phase: 'Phase 17 — Financial Accounting', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-provisions', code: '16.06.01.03', name: 'Provisions', description: 'Post IFRS 9 Expected Credit Loss (ECL) provisions and warranty reserves.', phase: 'Phase 17 — Financial Accounting', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-period-closing', code: '16.06.01.04', name: 'Period Closing', description: 'Execute automated month-end checklists and lock subledgers against edits.', phase: 'Phase 17 — Financial Accounting', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST', 'ADMIN'] },
              { id: 'tx-year-end-closing', code: '16.06.01.05', name: 'Year-End Closing', description: 'Transfer P&L balances to Retained Earnings and roll forward balance sheet.', phase: 'Phase 17 — Financial Accounting', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST', 'ADMIN'] }
            ]
          }
        ]
      },
      {
        id: 'cost-accounting',
        code: '16.07',
        name: 'Cost Accounting',
        description: 'Cost centers, profit centers, secondary cost allocation cycles, and activity-based costing (ABC) margin analysis.',
        icon: 'PieChart',
        phase: 'Phase 17 — Financial Accounting',
        processes: [
          {
            id: 'cost-acct-proc',
            code: '16.07.01',
            name: 'Cost & Profit Centers',
            description: 'Cost allocation cycles, overhead distribution, and managerial profitability.',
            phase: 'Phase 17 — Financial Accounting',
            transactions: [
              { id: 'tx-cost-centers', code: '16.07.01.01', name: 'Cost Centers', description: 'Define departmental responsibility cost centers and manager linkages.', phase: 'Phase 17 — Financial Accounting', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-profit-centers', code: '16.07.01.02', name: 'Profit Centers', description: 'Establish business units and product division profit centers.', phase: 'Phase 17 — Financial Accounting', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-cost-allocation', code: '16.07.01.03', name: 'Cost Allocation', description: 'Execute distribution rules allocating shared corporate overhead to profit centers.', phase: 'Phase 17 — Financial Accounting', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] },
              { id: 'tx-cost-analysis-tx', code: '16.07.01.04', name: 'Cost Analysis', description: 'Multi-dimensional direct vs absorbed overhead cost reports by business unit.', phase: 'Phase 17 — Financial Accounting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] }
            ]
          }
        ]
      },
      {
        id: 'tax-vat-accounting',
        code: '16.08',
        name: 'Tax & VAT Accounting',
        description: 'Input VAT credits, Output VAT liabilities, statutory tax return filing, tax adjustments, and audit ledger reconciliation.',
        icon: 'Receipt',
        phase: 'Phase 17 — Financial Accounting',
        processes: [
          {
            id: 'tax-proc',
            code: '16.08.01',
            name: 'VAT & Statutory Tax Returns',
            description: 'VAT return compilation, tax code management, and tax authority filing.',
            phase: 'Phase 17 — Financial Accounting',
            transactions: [
              { id: 'tx-vat-acct', code: '16.08.01.01', name: 'VAT Accounting', description: 'Maintain tax codes, standard 5% VAT, zero-rated, exempt, and out-of-scope rules.', phase: 'Phase 17 — Financial Accounting', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-input-vat', code: '16.08.01.02', name: 'Input VAT', description: 'Audit recoverable input tax paid on supplier purchases and import customs.', phase: 'Phase 17 — Financial Accounting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] },
              { id: 'tx-output-vat', code: '16.08.01.03', name: 'Output VAT', description: 'Consolidate tax collected on customer sales and taxable service invoices.', phase: 'Phase 17 — Financial Accounting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] },
              { id: 'tx-tax-adjustments', code: '16.08.01.04', name: 'Tax Adjustments', description: 'Book bad debt tax relief adjustments, credit note adjustments, and apportionment.', phase: 'Phase 17 — Financial Accounting', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-tax-reporting', code: '16.08.01.05', name: 'Tax Reporting', description: 'Generate official periodic VAT return summary ready for tax authority portal upload.', phase: 'Phase 17 — Financial Accounting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT', 'PRINT'] }
            ]
          }
        ]
      },
      {
        id: 'intercompany-fx',
        code: '16.09',
        name: 'Intercompany & Foreign Currency',
        description: 'Intercompany billing, matching reconciliations, multi-currency revaluation, and realized/unrealized FX gain/loss accounting.',
        icon: 'Globe',
        phase: 'Phase 17 — Financial Accounting',
        processes: [
          {
            id: 'intercompany-proc',
            code: '16.09.01',
            name: 'Intercompany & FX Revaluations',
            description: 'Cross-entity transactions, intercompany matching, and daily FX rate updates.',
            phase: 'Phase 17 — Financial Accounting',
            transactions: [
              { id: 'tx-intercompany-trans', code: '16.09.01.01', name: 'Intercompany Transactions', description: 'Mirror transactions between group parent and operating subsidiaries.', phase: 'Phase 17 — Financial Accounting', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-intercompany-recon', code: '16.09.01.02', name: 'Intercompany Reconciliation', description: 'Match intercompany receivable and payable balances and identify discrepancies.', phase: 'Phase 17 — Financial Accounting', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-foreign-currency', code: '16.09.01.03', name: 'Foreign Currency', description: 'Configure daily spot rates, average rates, and currency table hierarchies.', phase: 'Phase 17 — Financial Accounting', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-exchange-gain-loss', code: '16.09.01.04', name: 'Exchange Gain / Loss', description: 'Post periodic unrealized FX revaluation on monetary foreign currency balances.', phase: 'Phase 17 — Financial Accounting', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] }
            ]
          }
        ]
      },
      {
        id: 'financial-statements',
        code: '16.10',
        name: 'Financial Statements',
        description: 'IFRS statutory statements, multi-level Trial Balance, Profit & Loss Statement, Balance Sheet, and Cash Flow Statement.',
        icon: 'FileText',
        phase: 'Phase 17 — Financial Accounting',
        processes: [
          {
            id: 'fin-statements-proc',
            code: '16.10.01',
            name: 'Statutory Financial Statements',
            description: 'Trial balance, consolidated statements of income, position, and cash flows.',
            phase: 'Phase 17 — Financial Accounting',
            transactions: [
              { id: 'tx-trial-balance', code: '16.10.01.01', name: 'Trial Balance', description: 'Full trial balance with opening, debit/credit movements, and closing balances.', phase: 'Phase 17 — Financial Accounting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT', 'PRINT'] },
              { id: 'tx-profit-loss-stmt', code: '16.10.01.02', name: 'Profit & Loss', description: 'Comprehensive income statement detailing revenue, gross margin, EBITDA, and net profit.', phase: 'Phase 17 — Financial Accounting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT', 'PRINT'] },
              { id: 'tx-balance-sheet-stmt', code: '16.10.01.03', name: 'Balance Sheet', description: 'Statement of financial position detailing current/non-current assets, liabilities, and equity.', phase: 'Phase 17 — Financial Accounting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT', 'PRINT'] },
              { id: 'tx-cashflow-stmt', code: '16.10.01.04', name: 'Cash Flow Statement', description: 'Direct and indirect method cash flows from operating, investing, and financing.', phase: 'Phase 17 — Financial Accounting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT', 'PRINT'] },
              { id: 'tx-fin-statements-tx', code: '16.10.01.05', name: 'Financial Statements', description: 'Executive board financial reporting package with footnote disclosures.', phase: 'Phase 17 — Financial Accounting', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT', 'PRINT'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'compliance-risk-audit',
    code: '17',
    name: '17 — COMPLIANCE, RISK & AUDIT',
    shortName: 'Compliance, Risk & Audit',
    category: 'Governance & Analytics',
    description: 'Enterprise governance (GRC), statutory regulatory compliance calendars, Enterprise Risk Management (ERM) matrix, internal audit fieldwork, external auditor packs, and fraud detection analytics.',
    icon: 'ShieldAlert',
    color: 'slate',
    accentColor: 'text-slate-500',
    phase: 'Phase 18 — Compliance, Risk & Audit',
    phaseNumber: 18,
    kpiPlaceholders: [
      { label: 'Regulatory Compliance Health', value: '100% (No Breaches)', status: 'positive' },
      { label: 'Open Audit Observations', value: '5 Low Risk Findings', status: 'normal' },
      { label: 'Enterprise Risk Rating', value: 'Medium (Score: 24)', status: 'normal' },
      { label: 'Upcoming Statutory Filings', value: '2 Due in 15 Days', status: 'warning' }
    ],
    aiSuggestions: [
      'Detect anomalous high-frequency journal entries posted directly outside standard business hours',
      'Generate auditor sample selection for Accounts Payable transactions based on monetary risk weighting',
      'Scan supplier registration database for conflict-of-interest linkages to employee records'
    ],
    functionalAreas: [
      {
        id: 'regulatory-compliance',
        code: '17.01',
        name: 'Regulatory Compliance',
        description: 'Statutory laws, labor regulations, environmental mandates, corporate governance calendars, and monitoring.',
        icon: 'Award',
        phase: 'Phase 18 — Compliance, Risk & Audit',
        processes: [
          {
            id: 'reg-comp-proc',
            code: '17.01.01',
            name: 'Statutory Mandates & Calendar',
            description: 'Regulatory requirement tracking, filing calendars, and compliance monitoring.',
            phase: 'Phase 18 — Compliance, Risk & Audit',
            transactions: [
              { id: 'tx-reg-requirements', code: '17.01.01.01', name: 'Regulatory Requirements', description: 'Catalog legal obligations, ministerial decrees, and labor law stipulations.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-compliance-cal', code: '17.01.01.02', name: 'Compliance Calendar', description: 'Schedule corporate filing deadlines, commercial registration renewals, and tax dates.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-compliance-monitoring', code: '17.01.01.03', name: 'Compliance Monitoring', description: 'Track enterprise adherence scorecards and assign compliance owners.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'report', requiredPermissions: ['VIEW', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'tax-compliance',
        code: '17.02',
        name: 'Tax Compliance',
        description: 'Corporate income tax filings, VAT compliance audit logs, transfer pricing documentation, and statutory reporting packages.',
        icon: 'Receipt',
        phase: 'Phase 18 — Compliance, Risk & Audit',
        processes: [
          {
            id: 'tax-comp-proc',
            code: '17.02.01',
            name: 'Tax Returns & Statutory Filings',
            description: 'Tax authority submission records, tax audit defense files, and transfer pricing.',
            phase: 'Phase 18 — Compliance, Risk & Audit',
            transactions: [
              { id: 'tx-vat-compliance', code: '17.02.01.01', name: 'VAT Compliance', description: 'Audit electronic invoice archives for mandatory cryptographic QR codes and tags.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-tax-compliance-tx', code: '17.02.01.02', name: 'Tax Compliance', description: 'Prepare annual corporate tax schedules, capital allowances, and tax adjustments.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] },
              { id: 'tx-tax-returns', code: '17.02.01.03', name: 'Tax Returns', description: 'Archive signed copies of statutory tax filings and authority acknowledgement receipts.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-statutory-reporting', code: '17.02.01.04', name: 'Statutory Reporting', description: 'Generate mandatory statistical reports for central banks and ministries.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] }
            ]
          }
        ]
      },
      {
        id: 'internal-controls',
        code: '17.03',
        name: 'Internal Controls',
        description: 'COSO internal control framework, automated approval controls, Segregation of Duties (SoD) testing, and control effectiveness.',
        icon: 'ShieldCheck',
        phase: 'Phase 18 — Compliance, Risk & Audit',
        processes: [
          {
            id: 'internal-ctrl-proc',
            code: '17.03.01',
            name: 'COSO Control Testing & SoD',
            description: 'Control repository, approval limits enforcement, and conflict of interest testing.',
            phase: 'Phase 18 — Compliance, Risk & Audit',
            transactions: [
              { id: 'tx-control-framework', code: '17.03.01.01', name: 'Control Framework', description: 'Define key business controls across Procure-to-Pay, Order-to-Cash, and Record-to-Report.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'master', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-approval-controls', code: '17.03.01.02', name: 'Approval Controls', description: 'Audit system delegation rules to verify no transactions bypassed authority thresholds.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-sod-testing', code: '17.03.01.03', name: 'Segregation of Duties', description: 'Run automated SoD conflict analyzers across active user permissions.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'report', requiredPermissions: ['VIEW', 'ADMIN'] },
              { id: 'tx-control-testing', code: '17.03.01.04', name: 'Control Testing', description: 'Record periodic internal control walkthroughs, sample testing, and pass/fail ratings.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'risk-management',
        code: '17.04',
        name: 'Risk Management',
        description: 'Enterprise Risk Register, risk impact vs probability heatmaps, financial/operational risk ratings, and mitigation plans.',
        icon: 'AlertTriangle',
        phase: 'Phase 18 — Compliance, Risk & Audit',
        processes: [
          {
            id: 'risk-mgmt-proc',
            code: '17.04.01',
            name: 'Enterprise Risk Matrix & Mitigation',
            description: 'Risk register, 5x5 probability/impact matrix, and mitigation action trackers.',
            phase: 'Phase 18 — Compliance, Risk & Audit',
            transactions: [
              { id: 'tx-risk-register', code: '17.04.01.01', name: 'Risk Register', description: 'Catalog enterprise risks across strategic, financial, operational, and cyber categories.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-risk-assessment', code: '17.04.01.02', name: 'Risk Assessment', description: 'Conduct qualitative and quantitative risk scoring sessions with risk owners.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-risk-rating', code: '17.04.01.03', name: 'Risk Rating', description: 'Interactive visual 5x5 heatmap plotting inherent vs residual risk positions.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-risk-mitigation', code: '17.04.01.04', name: 'Risk Mitigation', description: 'Track mitigation action plans, milestones, assigned risk leads, and target reduction.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'transaction', requiredPermissions: ['VIEW', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'internal-audit',
        code: '17.05',
        name: 'Internal Audit',
        description: 'Annual audit charter, audit programs, sample testing workpapers, finding draft observations, and audit committee reports.',
        icon: 'Search',
        phase: 'Phase 18 — Compliance, Risk & Audit',
        processes: [
          {
            id: 'internal-audit-proc',
            code: '17.05.01',
            name: 'Audit Programs, Workpapers & Findings',
            description: 'Audit cycle planning, electronic working papers, and finding issuance.',
            phase: 'Phase 18 — Compliance, Risk & Audit',
            transactions: [
              { id: 'tx-audit-planning', code: '17.05.01.01', name: 'Audit Planning', description: 'Draft multi-year risk-based internal audit plan approved by Board Audit Committee.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'configuration', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-audit-programs', code: '17.05.01.02', name: 'Audit Programs', description: 'Step-by-step audit testing procedures, checklists, and sampling methodologies.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-audit-testing', code: '17.05.01.03', name: 'Audit Testing', description: 'Compile electronic audit workpapers and attach supporting transaction evidence.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-audit-findings', code: '17.05.01.04', name: 'Audit Findings', description: 'Issue formal audit observations with risk impact rating and management responses.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'APPROVE'] }
            ]
          }
        ]
      },
      {
        id: 'external-audit',
        code: '17.06',
        name: 'External Audit',
        description: 'Statutory auditor PBC (Provided by Client) requests, PBC evidence repository, auditor query tracker, and management representations.',
        icon: 'Folder',
        phase: 'Phase 18 — Compliance, Risk & Audit',
        processes: [
          {
            id: 'ext-audit-proc',
            code: '17.06.01',
            name: 'PBC Requests, Evidence & Responses',
            description: 'Auditor request list coordination, evidence upload, and audit pack tracking.',
            phase: 'Phase 18 — Compliance, Risk & Audit',
            transactions: [
              { id: 'tx-audit-requests', code: '17.06.01.01', name: 'Audit Requests', description: 'Track statutory external audit PBC item requests with fulfillment due dates.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-auditor-info', code: '17.06.01.02', name: 'Auditor Information', description: 'External audit firm profiles, partner details, engagement letter, and fee agreements.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'master', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-audit-evidence', code: '17.06.01.03', name: 'Audit Evidence', description: 'Secure digital repository for trial balances, bank confirms, and contract samples.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-audit-responses', code: '17.06.01.04', name: 'Audit Responses', description: 'Track formal management responses to audit queries and draft management letters.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'APPROVE'] }
            ]
          }
        ]
      },
      {
        id: 'corrective-actions-audit',
        code: '17.07',
        name: 'Corrective Actions',
        description: 'Audit recommendation remediation tracking, action plans, responsible owner milestones, and audit committee closure verification.',
        icon: 'CheckSquare',
        phase: 'Phase 18 — Compliance, Risk & Audit',
        processes: [
          {
            id: 'audit-action-proc',
            code: '17.07.01',
            name: 'Remediation Plans & Closure',
            description: 'Action plan tracking, target dates, and validation signoffs.',
            phase: 'Phase 18 — Compliance, Risk & Audit',
            transactions: [
              { id: 'tx-corrective-actions-audit', code: '17.07.01.01', name: 'Corrective Actions', description: 'Log formal management remediation commitments against identified audit findings.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-action-plans', code: '17.07.01.02', name: 'Action Plans', description: 'Break down remediation projects into actionable operational steps and milestones.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-action-tracking', code: '17.07.01.03', name: 'Action Tracking', description: 'Dashboard showing on-track vs overdue remediation commitments by department.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-closure-verification', code: '17.07.01.04', name: 'Closure Verification', description: 'Internal audit re-testing and formal verification to officially close findings.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'transaction', requiredPermissions: ['VIEW', 'APPROVE'] }
            ]
          }
        ]
      },
      {
        id: 'fraud-compliance-monitoring',
        code: '17.08',
        name: 'Fraud & Compliance Monitoring',
        description: 'AI anomaly detection, Benford analysis on vouchers, policy compliance tracking, document retention enforcement, and compliance cockpit.',
        icon: 'Shield',
        phase: 'Phase 18 — Compliance, Risk & Audit',
        processes: [
          {
            id: 'fraud-proc',
            code: '17.08.01',
            name: 'Fraud Detection & Exception Monitoring',
            description: 'Red-flag monitoring, Benford law checks, policy compliance, and audit dashboards.',
            phase: 'Phase 18 — Compliance, Risk & Audit',
            transactions: [
              { id: 'tx-fraud-monitoring', code: '17.08.01.01', name: 'Fraud Monitoring', description: 'Continuous automated scans for duplicate payments, split POs, and dormant vendors.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'report', requiredPermissions: ['VIEW', 'ADMIN'] },
              { id: 'tx-exception-monitoring', code: '17.08.01.02', name: 'Exception Monitoring', description: 'Real-time alert feeds for manual journal entries and after-hours system access.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'report', requiredPermissions: ['VIEW', 'ADMIN'] },
              { id: 'tx-policy-compliance', code: '17.08.01.03', name: 'Policy Compliance', description: 'Audit employee adherence to code of conduct, gift declarations, and travel limits.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-doc-retention', code: '17.08.01.04', name: 'Document Retention', description: 'Enforce statutory 10-year immutable legal retention periods for tax vouchers.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'configuration', requiredPermissions: ['VIEW', 'ADMIN'] },
              { id: 'tx-compliance-dashboard', code: '17.08.01.05', name: 'Compliance Dashboard', description: 'Executive GRC overview displaying overall compliance health and open risk items.', phase: 'Phase 18 — Compliance, Risk & Audit', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] }
            ]
          }
        ]
      }
    ]
  }
];

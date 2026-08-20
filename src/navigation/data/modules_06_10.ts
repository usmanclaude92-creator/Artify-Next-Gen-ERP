import { ERPModule } from '../../types/erp';

export const MODULES_06_10: ERPModule[] = [
  {
    id: 'sales-crm',
    code: '06',
    name: '06 — SALES & CRM',
    shortName: 'Sales & CRM',
    category: 'Operations & Supply',
    description: 'Omnichannel lead qualification, sales opportunity pipeline, quote-to-cash execution, AR billing, and customer service satisfaction.',
    icon: 'TrendingUp',
    color: 'indigo',
    accentColor: 'text-indigo-500',
    phase: 'Phase 7 — Sales & CRM',
    phaseNumber: 7,
    kpiPlaceholders: [
      { label: 'Quarterly Sales Pipeline', value: 'OMR 5,120,000', trend: '+18.2%', status: 'positive' },
      { label: 'Active Opportunities', value: '64 Deals', status: 'normal' },
      { label: 'Unbilled Deliveries', value: 'OMR 184,000', status: 'warning' },
      { label: 'Win Rate (LTM)', value: '38.6%', trend: '+2.4%', status: 'positive' }
    ],
    aiSuggestions: [
      'Score lead win probability for open enterprise proposals exceeding OMR 50k',
      'Detect accounts exhibiting delayed payment patterns before approving new credit orders',
      'Generate personalized sales quotation proposal summary for client presentation'
    ],
    functionalAreas: [
      {
        id: 'lead-management',
        code: '06.01',
        name: 'Lead Management',
        description: 'Omnichannel lead capture, qualification criteria, automated rep distribution, and opportunity conversion.',
        icon: 'UserPlus',
        phase: 'Phase 7 — Sales & CRM',
        processes: [
          {
            id: 'lead-proc',
            code: '06.01.01',
            name: 'Lead Qualification & Funnel',
            description: 'Lead generation intake, BANT qualification scoring, and assignment rules.',
            phase: 'Phase 7 — Sales & CRM',
            transactions: [
              { id: 'tx-lead-capture', code: '06.01.01.01', name: 'Lead Capture', description: 'Log incoming prospect inquiries from web, exhibitions, referrals, and partners.', phase: 'Phase 7 — Sales & CRM', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-lead-qual', code: '06.01.01.02', name: 'Lead Qualification', description: 'Score leads against budget, authority, need, and timeline criteria.', phase: 'Phase 7 — Sales & CRM', actionType: 'transaction', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-lead-assign', code: '06.01.01.03', name: 'Lead Assignment', description: 'Route leads automatically to sales reps by region, vertical, and deal size.', phase: 'Phase 7 — Sales & CRM', actionType: 'transaction', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-lead-conversion', code: '06.01.01.04', name: 'Lead Conversion', description: 'Convert qualified leads into Customer Master and Sales Opportunity records.', phase: 'Phase 7 — Sales & CRM', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] }
            ]
          }
        ]
      },
      {
        id: 'customer-management',
        code: '06.02',
        name: 'Customer Management',
        description: '360-degree customer directory, contact matrices, customer credit limits, and tier classifications.',
        icon: 'Users',
        phase: 'Phase 7 — Sales & CRM',
        processes: [
          {
            id: 'cust-mgmt-proc',
            code: '06.02.01',
            name: 'Customer Master & Credit',
            description: 'Customer master files, billing addresses, tax registrations, and credit terms.',
            phase: 'Phase 7 — Sales & CRM',
            transactions: [
              { id: 'tx-cust-master', code: '06.02.01.01', name: 'Customer Master', description: 'Maintain client entity records, billing info, VAT IDs, and currency.', phase: 'Phase 7 — Sales & CRM', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-contact-mgmt', code: '06.02.01.02', name: 'Contact Management', description: 'Directory of key stakeholders, decision-makers, and finance liaisons.', phase: 'Phase 7 — Sales & CRM', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-cust-classification', code: '06.02.01.03', name: 'Customer Classification', description: 'Segment customers by enterprise tier, strategic partner, and industry sector.', phase: 'Phase 7 — Sales & CRM', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-cust-credit-limits', code: '06.02.01.04', name: 'Customer Credit Limits', description: 'Enforce credit ceilings, payment terms, and automated credit block flags.', phase: 'Phase 7 — Sales & CRM', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT', 'ADMIN'] }
            ]
          }
        ]
      },
      {
        id: 'opportunity-management',
        code: '06.03',
        name: 'Opportunity Management',
        description: 'Visual deal pipeline, stage probability weighting, competitor analysis, and weighted revenue forecasts.',
        icon: 'Kanban',
        phase: 'Phase 7 — Sales & CRM',
        processes: [
          {
            id: 'opp-mgmt-proc',
            code: '06.03.01',
            name: 'Pipeline & Opportunity Stages',
            description: 'Deal pipeline governance, qualification stages, and sales forecasting.',
            phase: 'Phase 7 — Sales & CRM',
            transactions: [
              { id: 'tx-sales-opps', code: '06.03.01.01', name: 'Sales Opportunities', description: 'Register sales deals with estimated contract values and close dates.', phase: 'Phase 7 — Sales & CRM', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-sales-pipeline', code: '06.03.01.02', name: 'Sales Pipeline', description: 'Kanban board of opportunities progressing across qualification and closing.', phase: 'Phase 7 — Sales & CRM', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-opp-stages', code: '06.03.01.03', name: 'Opportunity Stages', description: 'Configure stage gates, probability percentages, and mandatory criteria.', phase: 'Phase 7 — Sales & CRM', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-opp-forecast', code: '06.03.01.04', name: 'Opportunity Forecast', description: 'Weighted revenue projections calculated across rep pipelines.', phase: 'Phase 7 — Sales & CRM', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] }
            ]
          }
        ]
      },
      {
        id: 'sales-activities',
        code: '06.04',
        name: 'Sales Activities',
        description: 'Customer interaction logs, phone calls, client meetings, follow-up reminders, and rep task lists.',
        icon: 'PhoneCall',
        phase: 'Phase 7 — Sales & CRM',
        processes: [
          {
            id: 'sales-act-proc',
            code: '06.04.01',
            name: 'Client Engagements & Interactions',
            description: 'Chronological communication timeline with prospects and clients.',
            phase: 'Phase 7 — Sales & CRM',
            transactions: [
              { id: 'tx-sales-calls', code: '06.04.01.01', name: 'Calls', description: 'Log outbound call notes, outcomes, and schedule next follow-up dates.', phase: 'Phase 7 — Sales & CRM', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-sales-meetings', code: '06.04.01.02', name: 'Meetings', description: 'Schedule client presentations, demos, and commercial review meetings.', phase: 'Phase 7 — Sales & CRM', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-sales-followups', code: '06.04.01.03', name: 'Follow-ups', description: 'Automated reminders for proposal expiration, check-ins, and renewal dates.', phase: 'Phase 7 — Sales & CRM', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-sales-tasks', code: '06.04.01.04', name: 'Tasks', description: 'Rep action items linked directly to opportunities and account records.', phase: 'Phase 7 — Sales & CRM', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'sales-quotations',
        code: '06.05',
        name: 'Sales Quotations',
        description: 'CPQ commercial proposals, multi-tier discount approval matrices, price lists, and quote PDF generation.',
        icon: 'FileText',
        phase: 'Phase 7 — Sales & CRM',
        processes: [
          {
            id: 'quote-proc',
            code: '06.05.01',
            name: 'Quotation Generation & Pricing',
            description: 'Price calculation, margin validation, and commercial approval workflows.',
            phase: 'Phase 7 — Sales & CRM',
            transactions: [
              { id: 'tx-quote-creation', code: '06.05.01.01', name: 'Quotation Creation', description: 'Assemble items, quantities, delivery terms, and customer-specific price books.', phase: 'Phase 7 — Sales & CRM', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-pricing', code: '06.05.01.02', name: 'Pricing', description: 'Configure customer tier price lists, volume break discounts, and promotional rates.', phase: 'Phase 7 — Sales & CRM', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-discounts', code: '06.05.01.03', name: 'Discounts', description: 'Define max rep discount allowances and margin threshold safety checks.', phase: 'Phase 7 — Sales & CRM', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-quote-approval', code: '06.05.01.04', name: 'Quotation Approval', description: 'Commercial director signoff on high-value or discounted proposals.', phase: 'Phase 7 — Sales & CRM', actionType: 'workflow', requiredPermissions: ['VIEW', 'APPROVE', 'REJECT'] }
            ]
          }
        ]
      },
      {
        id: 'sales-orders',
        code: '06.06',
        name: 'Sales Orders',
        description: 'Customer purchase order confirmation, inventory allocation reservation, credit check, and order tracking.',
        icon: 'ShoppingBag',
        phase: 'Phase 7 — Sales & CRM',
        processes: [
          {
            id: 'so-proc',
            code: '06.06.01',
            name: 'Sales Order Processing',
            description: 'Order booking, credit release, and warehouse fulfillment instruction.',
            phase: 'Phase 7 — Sales & CRM',
            transactions: [
              { id: 'tx-sales-order', code: '06.06.01.01', name: 'Sales Order', description: 'Book confirmed customer orders linked to quotations and client POs.', phase: 'Phase 7 — Sales & CRM', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-order-approval', code: '06.06.01.02', name: 'Order Approval', description: 'Finance and sales management authorization for order booking.', phase: 'Phase 7 — Sales & CRM', actionType: 'workflow', requiredPermissions: ['VIEW', 'APPROVE'] },
              { id: 'tx-order-fulfilment', code: '06.06.01.03', name: 'Order Fulfilment', description: 'Generate warehouse pick/pack instructions and production orders.', phase: 'Phase 7 — Sales & CRM', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] },
              { id: 'tx-order-tracking', code: '06.06.01.04', name: 'Order Tracking', description: 'End-to-end customer order status from booking to final site delivery.', phase: 'Phase 7 — Sales & CRM', actionType: 'report', requiredPermissions: ['VIEW'] }
            ]
          }
        ]
      },
      {
        id: 'delivery-billing',
        code: '06.07',
        name: 'Delivery & Billing',
        description: 'Delivery notes (DN), shipping dispatch, Accounts Receivable tax invoices, credit memos, and down payments.',
        icon: 'Truck',
        phase: 'Phase 7 — Sales & CRM',
        processes: [
          {
            id: 'billing-proc',
            code: '06.07.01',
            name: 'Dispatch, Invoicing & Advances',
            description: 'Logistics delivery notes, VAT billing, credit notes, and customer advances.',
            phase: 'Phase 7 — Sales & CRM',
            transactions: [
              { id: 'tx-delivery-note', code: '06.07.01.01', name: 'Delivery Note', description: 'Issue official goods dispatch note reducing stock from warehouse inventory.', phase: 'Phase 7 — Sales & CRM', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST', 'PRINT'] },
              { id: 'tx-ar-invoice', code: '06.07.01.02', name: 'AR Invoice', description: 'Generate statutory tax invoice posting revenue and customer receivable ledger.', phase: 'Phase 7 — Sales & CRM', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST', 'PRINT'] },
              { id: 'tx-credit-note', code: '06.07.01.03', name: 'Credit Note', description: 'Issue customer credit memo for returns, billing adjustments, or discounts.', phase: 'Phase 7 — Sales & CRM', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-cust-advances', code: '06.07.01.04', name: 'Customer Advances', description: 'Record advance deposits received against unbilled future sales orders.', phase: 'Phase 7 — Sales & CRM', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] }
            ]
          }
        ]
      },
      {
        id: 'customer-service',
        code: '06.08',
        name: 'Customer Service',
        description: 'Customer ticket management, warranty claims, service requests, customer satisfaction (CSAT), and CRM analytics.',
        icon: 'HelpCircle',
        phase: 'Phase 7 — Sales & CRM',
        processes: [
          {
            id: 'cs-proc',
            code: '06.08.01',
            name: 'Service Ticketing & Satisfaction',
            description: 'Incident tickets, field service visits, and customer satisfaction metrics.',
            phase: 'Phase 7 — Sales & CRM',
            transactions: [
              { id: 'tx-cust-complaints', code: '06.08.01.01', name: 'Customer Complaints', description: 'Log customer disputes, product issues, and assign resolution SLAs.', phase: 'Phase 7 — Sales & CRM', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-service-req', code: '06.08.01.02', name: 'Service Requests', description: 'Dispatch field service technicians for installation, repair, or maintenance.', phase: 'Phase 7 — Sales & CRM', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-cust-followup', code: '06.08.01.03', name: 'Customer Follow-up', description: 'Post-delivery satisfaction surveys and relationship check-ins.', phase: 'Phase 7 — Sales & CRM', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-crm-analytics', code: '06.08.01.04', name: 'CRM Analytics', description: 'Customer lifetime value (CLV), churn rate, and ticket resolution speed.', phase: 'Phase 7 — Sales & CRM', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'inventory',
    code: '07',
    name: '07 — INVENTORY & WAREHOUSE MANAGEMENT',
    shortName: 'Inventory & Warehouse',
    category: 'Operations & Supply',
    description: 'Multi-warehouse stock control, bin location tracking, batch & serial traceability, inventory counting, stock adjustments, and FIFO/weighted average valuation.',
    icon: 'Package',
    color: 'cyan',
    accentColor: 'text-cyan-500',
    phase: 'Phase 8 — Inventory',
    phaseNumber: 8,
    kpiPlaceholders: [
      { label: 'Total Inventory Valuation', value: 'OMR 8,920,400', status: 'normal' },
      { label: 'Warehouse Capacity Utilization', value: '76.8%', status: 'normal' },
      { label: 'Items Below Safety Stock', value: '28 SKUs', status: 'warning' },
      { label: 'Stock Accuracy Rate', value: '99.4%', trend: '+0.3%', status: 'positive' }
    ],
    aiSuggestions: [
      'Detect 28 stock items trending toward stockout based on open sales reservations',
      'Optimize bin placement recommendations to minimize picker transit travel time',
      'Identify slow-moving stock batches with nearing shelf-life expiry dates'
    ],
    functionalAreas: [
      {
        id: 'item-master',
        code: '07.01',
        name: 'Item Master',
        description: 'Comprehensive product SKU catalog, category taxonomies, units of measure conversions, and material attributes.',
        icon: 'Boxes',
        phase: 'Phase 8 — Inventory',
        processes: [
          {
            id: 'item-master-proc',
            code: '07.01.01',
            name: 'SKU & Category Management',
            description: 'Item definitions, barcoding, valuation methods, and dimension attributes.',
            phase: 'Phase 8 — Inventory',
            transactions: [
              { id: 'tx-item-master', code: '07.01.01.01', name: 'Item Master', description: 'Define SKU codes, descriptions, default warehouse, and costing method.', phase: 'Phase 8 — Inventory', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-item-categories', code: '07.01.01.02', name: 'Item Categories', description: 'Hierarchical product groupings linked to default GL asset and COGS accounts.', phase: 'Phase 8 — Inventory', actionType: 'configuration', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-uom', code: '07.01.01.03', name: 'Units of Measure', description: 'Base units and conversion matrices (e.g., Box to Pieces, Ton to Kg).', phase: 'Phase 8 — Inventory', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-item-attributes', code: '07.01.01.04', name: 'Item Attributes', description: 'Custom technical specifications, dimensions, weight, and MSDS sheets.', phase: 'Phase 8 — Inventory', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'warehouse-mgmt',
        code: '07.02',
        name: 'Warehouse Management',
        description: 'Multi-site warehouse structures, aisle-rack-shelf bin locations, temperature zones, and volumetric capacities.',
        icon: 'Building2',
        phase: 'Phase 8 — Inventory',
        processes: [
          {
            id: 'wh-proc',
            code: '07.02.01',
            name: 'Warehouse Topography & Bins',
            description: 'Facility zoning, 3D bin coordinates, and storage capacity parameters.',
            phase: 'Phase 8 — Inventory',
            transactions: [
              { id: 'tx-wh-master', code: '07.02.01.01', name: 'Warehouse Master', description: 'Configure physical warehouses, transit depots, and quarantine yards.', phase: 'Phase 8 — Inventory', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-bin-locations', code: '07.02.01.02', name: 'Bin Locations', description: 'Define exact bin codes with aisle, rack, shelf, and position identifiers.', phase: 'Phase 8 — Inventory', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-wh-zones', code: '07.02.01.03', name: 'Warehouse Zones', description: 'Establish cold storage, hazardous materials, and fast-moving pick zones.', phase: 'Phase 8 — Inventory', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-wh-capacity', code: '07.02.01.04', name: 'Warehouse Capacity', description: 'Monitor maximum pallet counts, floor area weight limits, and cubic space.', phase: 'Phase 8 — Inventory', actionType: 'report', requiredPermissions: ['VIEW'] }
            ]
          }
        ]
      },
      {
        id: 'stock-transactions',
        code: '07.03',
        name: 'Stock Transactions',
        description: 'Opening balances, warehouse receipts, department issues, inter-warehouse transfers, and physical adjustments.',
        icon: 'Repeat',
        phase: 'Phase 8 — Inventory',
        processes: [
          {
            id: 'stock-trans-proc',
            code: '07.03.01',
            name: 'Movement & Stock Postings',
            description: 'Material movements, transfer orders, and stock adjustments with GL impact.',
            phase: 'Phase 8 — Inventory',
            transactions: [
              { id: 'tx-opening-stock', code: '07.03.01.01', name: 'Opening Stock', description: 'Upload initial quantities and unit costs during system migration.', phase: 'Phase 8 — Inventory', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST', 'ADMIN'] },
              { id: 'tx-goods-receipt-inv', code: '07.03.01.02', name: 'Goods Receipt', description: 'Receive miscellaneous inventory from internal production or unbilled sources.', phase: 'Phase 8 — Inventory', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-goods-issue-inv', code: '07.03.01.03', name: 'Goods Issue', description: 'Issue stock to cost centers, internal consumption, or maintenance jobs.', phase: 'Phase 8 — Inventory', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-stock-transfer', code: '07.03.01.04', name: 'Stock Transfer', description: 'Initiate and receive stock transfers across physical locations and transit.', phase: 'Phase 8 — Inventory', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-stock-adjustment', code: '07.03.01.05', name: 'Stock Adjustment', description: 'Post inventory gain or write-off vouchers with managerial justification.', phase: 'Phase 8 — Inventory', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST', 'APPROVE'] }
            ]
          }
        ]
      },
      {
        id: 'stock-returns',
        code: '07.04',
        name: 'Stock Returns',
        description: 'Vendor return logistics, customer return receipts (RMA), and quarantine return inspections.',
        icon: 'RotateCcw',
        phase: 'Phase 8 — Inventory',
        processes: [
          {
            id: 'stock-ret-proc',
            code: '07.04.01',
            name: 'Reverse Logistics & Inspections',
            description: 'Returned inventory processing, testing, and restocking into inventory.',
            phase: 'Phase 8 — Inventory',
            transactions: [
              { id: 'tx-purchase-return-inv', code: '07.04.01.01', name: 'Purchase Return', description: 'Deduct and pack inventory for dispatch back to supplier.', phase: 'Phase 8 — Inventory', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-sales-return-inv', code: '07.04.01.02', name: 'Sales Return', description: 'Accept returned products from clients and receive into inspection holding.', phase: 'Phase 8 — Inventory', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-return-inspection-inv', code: '07.04.01.03', name: 'Return Inspection', description: 'QC evaluation to classify returned goods as prime stock, refurb, or scrap.', phase: 'Phase 8 — Inventory', actionType: 'transaction', requiredPermissions: ['VIEW', 'EDIT', 'POST'] }
            ]
          }
        ]
      },
      {
        id: 'inventory-control',
        code: '07.05',
        name: 'Inventory Control',
        description: 'Hard/soft stock reservations, reorder point triggers, min/max buffer thresholds, and cycle count reconciliation.',
        icon: 'Sliders',
        phase: 'Phase 8 — Inventory',
        processes: [
          {
            id: 'inv-ctrl-proc',
            code: '07.05.01',
            name: 'Stock Policies & Cycle Counting',
            description: 'Inventory parameters, safety stock triggers, and physical audit counts.',
            phase: 'Phase 8 — Inventory',
            transactions: [
              { id: 'tx-stock-reservation', code: '07.05.01.01', name: 'Stock Reservation', description: 'Reserve stock against sales orders and production orders to prevent over-allocation.', phase: 'Phase 8 — Inventory', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-reorder-levels', code: '07.05.01.02', name: 'Reorder Levels', description: 'Configure automated reorder triggers based on replenishment lead times.', phase: 'Phase 8 — Inventory', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-min-max-levels', code: '07.05.01.03', name: 'Min / Max Levels', description: 'Establish floor and ceiling stock levels to prevent capital lockup or stockouts.', phase: 'Phase 8 — Inventory', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-inv-counting', code: '07.05.01.04', name: 'Inventory Counting', description: 'Cycle count sheets, blind counting sheets, and variance reconciliation.', phase: 'Phase 8 — Inventory', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] }
            ]
          }
        ]
      },
      {
        id: 'traceability',
        code: '07.06',
        name: 'Traceability',
        description: 'End-to-end batch lot genealogy, serial number tracking, shelf-life expiry alerts, and recall traceability.',
        icon: 'Search',
        phase: 'Phase 8 — Inventory',
        processes: [
          {
            id: 'trace-proc',
            code: '07.06.01',
            name: 'Lot & Serial Traceability',
            description: 'Genealogy tracking from raw material lot to finished good customer delivery.',
            phase: 'Phase 8 — Inventory',
            transactions: [
              { id: 'tx-batch-mgmt', code: '07.06.01.01', name: 'Batch Management', description: 'Track lot numbers, supplier batch certificates, and production dates.', phase: 'Phase 8 — Inventory', actionType: 'master', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-serial-mgmt', code: '07.06.01.02', name: 'Serial Number Management', description: 'Individual unit serial number tracking with warranty and repair history.', phase: 'Phase 8 — Inventory', actionType: 'master', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-expiry-mgmt', code: '07.06.01.03', name: 'Expiry Management', description: 'Monitor FEFO (First-Expired-First-Out) rules and impending expiration dates.', phase: 'Phase 8 — Inventory', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-lot-tracking', code: '07.06.01.04', name: 'Lot Tracking', description: 'Universal genealogy search tracing where a lot was consumed or dispatched.', phase: 'Phase 8 — Inventory', actionType: 'report', requiredPermissions: ['VIEW'] }
            ]
          }
        ]
      },
      {
        id: 'inventory-valuation-rep',
        code: '07.07',
        name: 'Inventory Valuation & Reporting',
        description: 'Cost layers (FIFO, Moving Average, Standard Cost), stock aging analysis, movement cards, and inventory financial summaries.',
        icon: 'BarChart',
        phase: 'Phase 8 — Inventory',
        processes: [
          {
            id: 'inv-val-proc',
            code: '07.07.01',
            name: 'Valuation & Stock Ledgers',
            description: 'Inventory subledger valuation reports and stock turnover analytics.',
            phase: 'Phase 8 — Inventory',
            transactions: [
              { id: 'tx-inv-valuation', code: '07.07.01.01', name: 'Inventory Valuation', description: 'Calculate total asset value across warehouses under configured costing methods.', phase: 'Phase 8 — Inventory', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] },
              { id: 'tx-stock-aging', code: '07.07.01.02', name: 'Stock Aging', description: 'Analyze slow-moving inventory bucketed by 60, 90, 180, and 365+ days.', phase: 'Phase 8 — Inventory', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] },
              { id: 'tx-stock-movement', code: '07.07.01.03', name: 'Stock Movement', description: 'Item bin card transaction log displaying ins, outs, and running balances.', phase: 'Phase 8 — Inventory', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] },
              { id: 'tx-inv-reports', code: '07.07.01.04', name: 'Inventory Reports', description: 'Stock turn ratios, inventory discrepancy trends, and valuation summaries.', phase: 'Phase 8 — Inventory', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'manufacturing',
    code: '08',
    name: '08 — MANUFACTURING / PRODUCTION',
    shortName: 'Manufacturing & Production',
    category: 'Operations & Supply',
    description: 'Multi-level Bill of Materials (BOM), Material Requirements Planning (MRP), routing work centers, shop floor work orders, and production cost variance.',
    icon: 'Factory',
    color: 'orange',
    accentColor: 'text-orange-500',
    phase: 'Phase 9 — Manufacturing',
    phaseNumber: 9,
    kpiPlaceholders: [
      { label: 'Active Work Orders', value: '34 Running', status: 'normal' },
      { label: 'Overall Equipment Effectiveness (OEE)', value: '84.2%', trend: '+3.1%', status: 'positive' },
      { label: 'Material Variance', value: '+1.4% Over Standard', status: 'warning' },
      { label: 'Scheduled Plant Downtime', value: '4.5 Hours', status: 'normal' }
    ],
    aiSuggestions: [
      'Optimize machine work center scheduling sequence to minimize changeover setup times',
      'Detect anomalous scrap rates on Assembly Line 2 exceeding standard BOM tolerances',
      'Run automated MRP simulation against updated 90-day sales forecast'
    ],
    functionalAreas: [
      {
        id: 'product-bom-mgmt',
        code: '08.01',
        name: 'Product & BOM Management',
        description: 'Multi-level engineering bills of materials, BOM version revisions, operational routings, and technical specs.',
        icon: 'GitFork',
        phase: 'Phase 9 — Manufacturing',
        processes: [
          {
            id: 'bom-proc',
            code: '08.01.01',
            name: 'Bill of Materials & Routings',
            description: 'Component formulas, sub-assembly trees, and sequential operation routings.',
            phase: 'Phase 9 — Manufacturing',
            transactions: [
              { id: 'tx-bom', code: '08.01.01.01', name: 'Bill of Materials', description: 'Define raw material component quantities, scrap percentages, and by-products.', phase: 'Phase 9 — Manufacturing', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-bom-versions', code: '08.01.01.02', name: 'BOM Versions', description: 'Maintain engineering revision history, active date ranges, and approval status.', phase: 'Phase 9 — Manufacturing', actionType: 'master', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-routing', code: '08.01.01.03', name: 'Routing', description: 'Define sequential production steps, setup times, run times, and work centers.', phase: 'Phase 9 — Manufacturing', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-prod-specs', code: '08.01.01.04', name: 'Production Specifications', description: 'Attach blueprint drawings, standard operating procedures, and safety rules.', phase: 'Phase 9 — Manufacturing', actionType: 'master', requiredPermissions: ['VIEW', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'production-planning',
        code: '08.02',
        name: 'Production Planning',
        description: 'Master Production Schedule (MPS), finite capacity planning, material requirements planning (MRP), and demand forecasts.',
        icon: 'CalendarRange',
        phase: 'Phase 9 — Manufacturing',
        processes: [
          {
            id: 'prod-plan-proc',
            code: '08.02.01',
            name: 'MPS, MRP & Capacity Planning',
            description: 'Production forecast consolidation, MRP run algorithms, and plant capacity leveling.',
            phase: 'Phase 9 — Manufacturing',
            transactions: [
              { id: 'tx-prod-forecast', code: '08.02.01.01', name: 'Production Forecast', description: 'Convert commercial sales targets into manufacturing build requirements.', phase: 'Phase 9 — Manufacturing', actionType: 'report', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-prod-plan', code: '08.02.01.02', name: 'Production Plan', description: 'Master production schedule leveling output across manufacturing weeks.', phase: 'Phase 9 — Manufacturing', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-capacity-planning', code: '08.02.01.03', name: 'Capacity Planning', description: 'Compare required machine/labor hours against available work center capacity.', phase: 'Phase 9 — Manufacturing', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-mrp', code: '08.02.01.04', name: 'MRP', description: 'Execute Material Requirements Planning to generate planned POs and Work Orders.', phase: 'Phase 9 — Manufacturing', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] }
            ]
          }
        ]
      },
      {
        id: 'production-orders',
        code: '08.03',
        name: 'Production Orders',
        description: 'Shop floor work orders, raw material staging, material issue vouchers, and return of unused stock.',
        icon: 'ClipboardList',
        phase: 'Phase 9 — Manufacturing',
        processes: [
          {
            id: 'prod-orders-proc',
            code: '08.03.01',
            name: 'Work Orders & Material Staging',
            description: 'Production dispatch, shop floor traveler documents, and material issuance.',
            phase: 'Phase 9 — Manufacturing',
            transactions: [
              { id: 'tx-work-orders', code: '08.03.01.01', name: 'Work Orders', description: 'Generate discrete manufacturing shop floor work orders with job numbers.', phase: 'Phase 9 — Manufacturing', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-prod-orders', code: '08.03.01.02', name: 'Production Orders', description: 'Batch release orders to line supervisors with scheduled start/end dates.', phase: 'Phase 9 — Manufacturing', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] },
              { id: 'tx-material-issue-prod', code: '08.03.01.03', name: 'Material Issue', description: 'Issue raw materials from store warehouse into Work-In-Progress (WIP).', phase: 'Phase 9 — Manufacturing', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-material-return-prod', code: '08.03.01.04', name: 'Material Return', description: 'Return unused raw materials from WIP back to warehouse inventory.', phase: 'Phase 9 — Manufacturing', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] }
            ]
          }
        ]
      },
      {
        id: 'work-centers',
        code: '08.04',
        name: 'Work Centers',
        description: 'Plant machine assets, labor skill pools, hourly overhead absorption rates, and preventive maintenance calendars.',
        icon: 'Wrench',
        phase: 'Phase 9 — Manufacturing',
        processes: [
          {
            id: 'work-center-proc',
            code: '08.04.01',
            name: 'Machines & Labor Work Centers',
            description: 'Plant equipment definitions, shifts, standard labor rates, and hourly capacities.',
            phase: 'Phase 9 — Manufacturing',
            transactions: [
              { id: 'tx-work-center-master', code: '08.04.01.01', name: 'Work Center Master', description: 'Configure assembly stations, CNC machines, paint booths, and lines.', phase: 'Phase 9 — Manufacturing', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-machine-capacity', code: '08.04.01.02', name: 'Machine Capacity', description: 'Define operational hours, shifts, efficiency ratings, and downtime schedules.', phase: 'Phase 9 — Manufacturing', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-labor-capacity', code: '08.04.01.03', name: 'Labor Capacity', description: 'Staffing skill matrices, man-hour availability, and overtime allowances.', phase: 'Phase 9 — Manufacturing', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-work-center-sched', code: '08.04.01.04', name: 'Work Center Scheduling', description: 'Visual dispatch board assigning operations to active machines and shifts.', phase: 'Phase 9 — Manufacturing', actionType: 'transaction', requiredPermissions: ['VIEW', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'production-output',
        code: '08.05',
        name: 'Production Output',
        description: 'Finished goods receipts into stock, co-product/by-product logging, scrap recording, and order closeout.',
        icon: 'CheckSquare',
        phase: 'Phase 9 — Manufacturing',
        processes: [
          {
            id: 'prod-output-proc',
            code: '08.05.01',
            name: 'Completion, By-Products & Scrap',
            description: 'Finished product receipt, batch serial creation, scrap logging, and closure.',
            phase: 'Phase 9 — Manufacturing',
            transactions: [
              { id: 'tx-prod-receipt', code: '08.05.01.01', name: 'Production Receipt', description: 'Receive inspected finished goods into warehouse inventory with lot codes.', phase: 'Phase 9 — Manufacturing', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-by-products', code: '08.05.01.02', name: 'By-Products', description: 'Log secondary outputs and assign allocated joint production costs.', phase: 'Phase 9 — Manufacturing', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-scrap-mgmt', code: '08.05.01.03', name: 'Scrap Management', description: 'Record defect scrap quantities, root causes, and write off to scrap ledger.', phase: 'Phase 9 — Manufacturing', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-prod-completion', code: '08.05.01.04', name: 'Production Completion', description: 'Close work orders, reconcile actual vs standard inputs, and finalize WIP.', phase: 'Phase 9 — Manufacturing', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST', 'ADMIN'] }
            ]
          }
        ]
      },
      {
        id: 'production-costing',
        code: '08.06',
        name: 'Production Costing',
        description: 'Standard vs actual costing, direct material cost, absorbed labor and machine overhead, and production variance accounting.',
        icon: 'DollarSign',
        phase: 'Phase 9 — Manufacturing',
        processes: [
          {
            id: 'prod-cost-proc',
            code: '08.06.01',
            name: 'WIP Cost Absorption & Variances',
            description: 'Material usage variances, labor efficiency variances, and overhead calculations.',
            phase: 'Phase 9 — Manufacturing',
            transactions: [
              { id: 'tx-material-cost-prod', code: '08.06.01.01', name: 'Material Cost', description: 'Track actual raw material consumption value posted to work orders.', phase: 'Phase 9 — Manufacturing', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-labor-cost-prod', code: '08.06.01.02', name: 'Labor Cost', description: 'Absorb direct labor hours multiplied by work center hourly labor rates.', phase: 'Phase 9 — Manufacturing', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-machine-cost-prod', code: '08.06.01.03', name: 'Machine Cost', description: 'Absorb equipment depreciation, energy, and maintenance hourly overhead.', phase: 'Phase 9 — Manufacturing', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-prod-variance', code: '08.06.01.04', name: 'Production Variance', description: 'Calculate price, usage, and efficiency variances against standard cost cards.', phase: 'Phase 9 — Manufacturing', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'hr',
    code: '09',
    name: '09 — HUMAN RESOURCES (HR)',
    shortName: 'Human Resources (HR)',
    category: 'Enterprise Management',
    description: 'Complete employee lifecycle management, recruitment applicant tracking, biometric attendance, leave balances, benefits, performance reviews, and end of service.',
    icon: 'UserCheck',
    color: 'rose',
    accentColor: 'text-rose-500',
    phase: 'Phase 10 — HR',
    phaseNumber: 10,
    kpiPlaceholders: [
      { label: 'Total Active Headcount', value: '412 Employees', status: 'normal' },
      { label: 'Monthly Attendance Rate', value: '98.1%', trend: '+0.4%', status: 'positive' },
      { label: 'Expiring Visas / Documents', value: '11 Within 30 Days', status: 'warning' },
      { label: 'Open Job Requisitions', value: '8 Positions', status: 'normal' }
    ],
    aiSuggestions: [
      'Alert HR managers to 11 expatriate employees with visa renewals due within 30 days',
      'Generate candidate interview scorecard summary and compare against job role requirements',
      'Simulate end-of-service gratuity liability across departments under updated labor law'
    ],
    functionalAreas: [
      {
        id: 'employee-management',
        code: '09.01',
        name: 'Employee Management',
        description: 'Comprehensive employee profiles, digital document vaults, organization chart hierarchy, and employment contracts.',
        icon: 'Users',
        phase: 'Phase 10 — HR',
        processes: [
          {
            id: 'emp-mgmt-proc',
            code: '09.01.01',
            name: 'Employee Master & Org Charts',
            description: 'Employee master data, passport/visa vaults, reporting lines, and contracts.',
            phase: 'Phase 10 — HR',
            transactions: [
              { id: 'tx-emp-master', code: '09.01.01.01', name: 'Employee Master', description: 'Maintain personal details, national ID, bank account, job title, and grade.', phase: 'Phase 10 — HR', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT', 'ADMIN'] },
              { id: 'tx-emp-docs', code: '09.01.01.02', name: 'Employee Documents', description: 'Store passports, work permits, certifications, and track expiry alerts.', phase: 'Phase 10 — HR', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-org-chart', code: '09.01.01.03', name: 'Organization Chart', description: 'Interactive visual hierarchy showing departmental structures and reporting managers.', phase: 'Phase 10 — HR', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-emp-contracts', code: '09.01.01.04', name: 'Employee Contracts', description: 'Track contract types (unlimited, fixed), probation terms, and renewal dates.', phase: 'Phase 10 — HR', actionType: 'master', requiredPermissions: ['VIEW', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'recruitment',
        code: '09.02',
        name: 'Recruitment',
        description: 'Job opening requisitions, applicant tracking system (ATS), interview scorecards, and candidate selection.',
        icon: 'UserPlus',
        phase: 'Phase 10 — HR',
        processes: [
          {
            id: 'recruit-proc',
            code: '09.02.01',
            name: 'Job Requisitions & ATS',
            description: 'Hiring pipeline, candidate stages, interview scheduling, and job offer releases.',
            phase: 'Phase 10 — HR',
            transactions: [
              { id: 'tx-job-req', code: '09.02.01.01', name: 'Job Requisition', description: 'Department heads submit hiring requests with budget validation.', phase: 'Phase 10 — HR', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'APPROVE'] },
              { id: 'tx-ats', code: '09.02.01.02', name: 'Applicant Tracking', description: 'Resume intake, candidate screening pipeline, and stage advancement.', phase: 'Phase 10 — HR', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-interview-mgmt', code: '09.02.01.03', name: 'Interview Management', description: 'Schedule panel interviews, log structured evaluator feedback and scores.', phase: 'Phase 10 — HR', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-recruit-selection', code: '09.02.01.04', name: 'Recruitment Selection', description: 'Issue formal offer letters, salary packages, and record acceptance status.', phase: 'Phase 10 — HR', actionType: 'transaction', requiredPermissions: ['VIEW', 'APPROVE'] }
            ]
          }
        ]
      },
      {
        id: 'employee-onboarding',
        code: '09.03',
        name: 'Employee Onboarding',
        description: 'New hire checklists, document collection, orientation scheduling, IT/workstation asset provisioning, and badge issuing.',
        icon: 'UserCheck',
        phase: 'Phase 10 — HR',
        processes: [
          {
            id: 'onboard-proc',
            code: '09.03.01',
            name: 'New Hire Provisioning & Induction',
            description: 'Onboarding workflows, asset handovers, and orientation milestone signoffs.',
            phase: 'Phase 10 — HR',
            transactions: [
              { id: 'tx-joining-proc', code: '09.03.01.01', name: 'Joining Process', description: 'Initiate day-one employee onboarding workflow and system account provisioning.', phase: 'Phase 10 — HR', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE'] },
              { id: 'tx-doc-collection', code: '09.03.01.02', name: 'Document Collection', description: 'Collect signed policies, medical clearance, and bank verification slips.', phase: 'Phase 10 — HR', actionType: 'transaction', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-emp-induction', code: '09.03.01.03', name: 'Employee Induction', description: 'Track departmental training schedules, mentor assignments, and safety briefs.', phase: 'Phase 10 — HR', actionType: 'transaction', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-asset-assignment-hr', code: '09.03.01.04', name: 'Asset Assignment', description: 'Issue laptops, mobile SIMs, access cards, and tools with signed custody slips.', phase: 'Phase 10 — HR', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] }
            ]
          }
        ]
      },
      {
        id: 'attendance-leave',
        code: '09.04',
        name: 'Attendance & Leave',
        description: 'Biometric clocking synchronization, shift rosters, annual leave applications, public holidays, and overtime calculation.',
        icon: 'Calendar',
        phase: 'Phase 10 — HR',
        processes: [
          {
            id: 'att-leave-proc',
            code: '09.04.01',
            name: 'Time, Attendance & Leave Rosters',
            description: 'Biometric logs, shift patterns, leave accrual balances, and overtime signoffs.',
            phase: 'Phase 10 — HR',
            transactions: [
              { id: 'tx-attendance', code: '09.04.01.01', name: 'Attendance', description: 'Import biometric time clock logs, review lateness, and manage shift schedules.', phase: 'Phase 10 — HR', actionType: 'transaction', requiredPermissions: ['VIEW', 'EDIT', 'POST'] },
              { id: 'tx-leave-mgmt', code: '09.04.01.02', name: 'Leave Management', description: 'Submit and approve annual, sick, maternity, and emergency leave requests.', phase: 'Phase 10 — HR', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'APPROVE'] },
              { id: 'tx-holidays', code: '09.04.01.03', name: 'Holidays', description: 'Configure statutory public holiday calendars across company branches.', phase: 'Phase 10 — HR', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-overtime', code: '09.04.01.04', name: 'Overtime', description: 'Calculate and approve overtime hours for monthly payroll processing.', phase: 'Phase 10 — HR', actionType: 'transaction', requiredPermissions: ['VIEW', 'APPROVE', 'POST'] }
            ]
          }
        ]
      },
      {
        id: 'employee-benefits',
        code: '09.05',
        name: 'Employee Benefits',
        description: 'Company medical insurance policies, staff loans and salary advances, housing allowances, and school subsidies.',
        icon: 'Heart',
        phase: 'Phase 10 — HR',
        processes: [
          {
            id: 'benefits-proc',
            code: '09.05.01',
            name: 'Loans, Allowances & Insurance',
            description: 'Staff loan schedules, salary advances, and medical policy enrollment.',
            phase: 'Phase 10 — HR',
            transactions: [
              { id: 'tx-benefits', code: '09.05.01.01', name: 'Benefits', description: 'Manage grade-based allowances, transport subsidies, and mobile perks.', phase: 'Phase 10 — HR', actionType: 'master', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-emp-loans', code: '09.05.01.02', name: 'Employee Loans', description: 'Approve corporate staff loans with automated monthly payroll deductions.', phase: 'Phase 10 — HR', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'APPROVE'] },
              { id: 'tx-emp-advances', code: '09.05.01.03', name: 'Employee Advances', description: 'Process emergency salary advance requests against accrued service earnings.', phase: 'Phase 10 — HR', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'APPROVE'] },
              { id: 'tx-insurance', code: '09.05.01.04', name: 'Insurance', description: 'Track health insurance network tiers, dependent additions, and policy renewals.', phase: 'Phase 10 — HR', actionType: 'master', requiredPermissions: ['VIEW', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'perf-development',
        code: '09.06',
        name: 'Performance & Development',
        description: 'Annual appraisal cycles, OKR goal setting, employee training programs, skill gap analysis, and career ladders.',
        icon: 'Award',
        phase: 'Phase 10 — HR',
        processes: [
          {
            id: 'perf-dev-proc',
            code: '09.06.01',
            name: 'Appraisals & Training',
            description: '360 review matrices, corporate training calendars, and competency roadmaps.',
            phase: 'Phase 10 — HR',
            transactions: [
              { id: 'tx-perf-mgmt', code: '09.06.01.01', name: 'Performance Management', description: 'Configure appraisal cycles, 360-degree feedback, and rating curves.', phase: 'Phase 10 — HR', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-training', code: '09.06.01.02', name: 'Training', description: 'Plan corporate training sessions, track certifications, and manage course budgets.', phase: 'Phase 10 — HR', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-career-dev', code: '09.06.01.03', name: 'Career Development', description: 'Succession planning, talent matrix (9-box grid), and promotion pathways.', phase: 'Phase 10 — HR', actionType: 'master', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-perf-reviews', code: '09.06.01.04', name: 'Performance Reviews', description: 'Manager and employee evaluation forms, score calculation, and signoff.', phase: 'Phase 10 — HR', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'APPROVE'] }
            ]
          }
        ]
      },
      {
        id: 'employee-lifecycle',
        code: '09.07',
        name: 'Employee Lifecycle',
        description: 'Departmental transfers, promotion orders, disciplinary incident management, resignation exit clearances, and End of Service (EOSB).',
        icon: 'Activity',
        phase: 'Phase 10 — HR',
        processes: [
          {
            id: 'lifecycle-proc',
            code: '09.07.01',
            name: 'Transfers, Promotions & Offboarding',
            description: 'Internal job mobility, disciplinary committees, and statutory exit clearances.',
            phase: 'Phase 10 — HR',
            transactions: [
              { id: 'tx-transfers', code: '09.07.01.01', name: 'Transfers', description: 'Process inter-branch and departmental transfers with updated cost center mapping.', phase: 'Phase 10 — HR', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'APPROVE'] },
              { id: 'tx-promotions', code: '09.07.01.02', name: 'Promotions', description: 'Update job grade, title, compensation band, and issue promotion letters.', phase: 'Phase 10 — HR', actionType: 'transaction', requiredPermissions: ['VIEW', 'APPROVE', 'POST'] },
              { id: 'tx-disciplinary-mgmt', code: '09.07.01.03', name: 'Disciplinary Management', description: 'Log formal warnings, grievance inquiries, and committee minutes.', phase: 'Phase 10 — HR', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'ADMIN'] },
              { id: 'tx-emp-separation', code: '09.07.01.04', name: 'Employee Separation', description: 'Manage resignations, notice periods, exit interviews, and asset clearances.', phase: 'Phase 10 — HR', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'APPROVE'] },
              { id: 'tx-eosb', code: '09.07.01.05', name: 'End of Service', description: 'Calculate statutory gratuity, leave encashment, and final settlement payout.', phase: 'Phase 10 — HR', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'APPROVE', 'POST'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'projects',
    code: '10',
    name: '10 — PROJECT MANAGEMENT & JOB COSTING',
    shortName: 'Projects & Job Costing',
    category: 'Operations & Supply',
    description: 'Work Breakdown Structures (WBS), project budgeting & forecast, labor & material job costing, subcontractor procurement, progress billing, and Earned Value Analysis.',
    icon: 'Briefcase',
    color: 'purple',
    accentColor: 'text-purple-500',
    phase: 'Phase 11 — Projects & Job Costing',
    phaseNumber: 11,
    kpiPlaceholders: [
      { label: 'Active Commercial Projects', value: '19 Active Sites', status: 'normal' },
      { label: 'Total Committed Budget', value: 'OMR 14,850,000', status: 'normal' },
      { label: 'Schedule Performance Index (SPI)', value: '0.96 (Minor Delay)', status: 'warning' },
      { label: 'Cost Performance Index (CPI)', value: '1.04 (Under Budget)', trend: '+0.03', status: 'positive' }
    ],
    aiSuggestions: [
      'Forecast project completion cost variance (EAC) for Muscat Marina Tower Phase 2',
      'Identify cost codes where labor expenditure exceeds planned baseline by >15%',
      'Generate interim client progress payment certificate from certified milestone deliverables'
    ],
    functionalAreas: [
      {
        id: 'project-setup',
        code: '10.01',
        name: 'Project Setup',
        description: 'Project charter creation, classification taxonomy, milestone phases, and hierarchical WBS activity codes.',
        icon: 'FolderPlus',
        phase: 'Phase 11 — Projects & Job Costing',
        processes: [
          {
            id: 'project-setup-proc',
            code: '10.01.01',
            name: 'Charters, Phases & WBS',
            description: 'Project metadata, client links, geographic location, and milestone definitions.',
            phase: 'Phase 11 — Projects & Job Costing',
            transactions: [
              { id: 'tx-proj-master', code: '10.01.01.01', name: 'Project Master', description: 'Define project scope, contract value, project manager, and client entity.', phase: 'Phase 11 — Projects & Job Costing', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-proj-class', code: '10.01.01.02', name: 'Project Classification', description: 'Categorize by commercial, infrastructure, EPC, maintenance, or internal R&D.', phase: 'Phase 11 — Projects & Job Costing', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-proj-phases', code: '10.01.01.03', name: 'Project Phases', description: 'Define sequential project phases (e.g., Design, Foundation, Structure, Fit-out).', phase: 'Phase 11 — Projects & Job Costing', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-proj-activities', code: '10.01.01.04', name: 'Project Activities', description: 'Hierarchical WBS activity breakdown for scheduling and direct cost tagging.', phase: 'Phase 11 — Projects & Job Costing', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] }
            ]
          }
        ]
      },
      {
        id: 'project-planning',
        code: '10.02',
        name: 'Project Planning',
        description: 'Critical Path Method (CPM) Gantt schedules, resource allocation loading, baseline project budgets, and cash flow curves.',
        icon: 'Calendar',
        phase: 'Phase 11 — Projects & Job Costing',
        processes: [
          {
            id: 'proj-plan-proc',
            code: '10.02.01',
            name: 'Gantt Schedules, Budgets & Cash Projections',
            description: 'Resource loading, milestone schedules, and baseline cost curves.',
            phase: 'Phase 11 — Projects & Job Costing',
            transactions: [
              { id: 'tx-proj-schedule', code: '10.02.01.01', name: 'Project Schedule', description: 'Interactive Gantt chart showing activity dependencies and critical paths.', phase: 'Phase 11 — Projects & Job Costing', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-resource-planning', code: '10.02.01.02', name: 'Resource Planning', description: 'Allocate engineers, site labor crews, heavy equipment, and subcontractors.', phase: 'Phase 11 — Projects & Job Costing', actionType: 'transaction', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-proj-budget', code: '10.02.01.03', name: 'Project Budget', description: 'Establish baseline budget broken down by cost code and phase.', phase: 'Phase 11 — Projects & Job Costing', actionType: 'configuration', requiredPermissions: ['VIEW', 'CREATE', 'APPROVE'] },
              { id: 'tx-proj-forecast', code: '10.02.01.04', name: 'Project Forecast', description: 'Monthly projected cash outflows and billing milestones across project duration.', phase: 'Phase 11 — Projects & Job Costing', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] }
            ]
          }
        ]
      },
      {
        id: 'project-costing',
        code: '10.03',
        name: 'Project Costing',
        description: 'Standardized Cost Breakdown Structure (CBS), direct material job issue, site timesheet labor booking, and heavy equipment allocation.',
        icon: 'DollarSign',
        phase: 'Phase 11 — Projects & Job Costing',
        processes: [
          {
            id: 'proj-cost-proc',
            code: '10.03.01',
            name: 'Cost Breakdown Structure (CBS) & Job Costing',
            description: 'Cost code catalogs, timesheet postings, and plant hire allocations.',
            phase: 'Phase 11 — Projects & Job Costing',
            transactions: [
              { id: 'tx-cost-codes', code: '10.03.01.01', name: 'Cost Codes', description: 'Standardized CBS taxonomy linking site expenditures to GL accounts.', phase: 'Phase 11 — Projects & Job Costing', actionType: 'master', requiredPermissions: ['VIEW', 'CREATE', 'EDIT'] },
              { id: 'tx-proj-material-cost', code: '10.03.01.02', name: 'Material Cost', description: 'Record direct site deliveries and warehouse inventory issues charged to projects.', phase: 'Phase 11 — Projects & Job Costing', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] },
              { id: 'tx-proj-labor-cost', code: '10.03.01.03', name: 'Labor Cost', description: 'Post verified site timesheets and direct labor wages to project activities.', phase: 'Phase 11 — Projects & Job Costing', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] },
              { id: 'tx-proj-equipment-cost', code: '10.03.01.04', name: 'Equipment Cost', description: 'Charge internal plant hire hours and external rented crane/excavator costs.', phase: 'Phase 11 — Projects & Job Costing', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] }
            ]
          }
        ]
      },
      {
        id: 'project-procurement',
        code: '10.04',
        name: 'Project Procurement',
        description: 'Site purchase requisitions against BOQ budgets, project purchase orders, site GRNs, and subcontractor contracts.',
        icon: 'Truck',
        phase: 'Phase 11 — Projects & Job Costing',
        processes: [
          {
            id: 'proj-proc-proc',
            code: '10.04.01',
            name: 'Site Requisitions & Subcontracts',
            description: 'Project-specific purchasing controls and subcontractor package commitments.',
            phase: 'Phase 11 — Projects & Job Costing',
            transactions: [
              { id: 'tx-proj-pr', code: '10.04.01.01', name: 'Project Purchase Requisition', description: 'Submit site material requests validated against allocated project budget lines.', phase: 'Phase 11 — Projects & Job Costing', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'APPROVE'] },
              { id: 'tx-proj-po', code: '10.04.01.02', name: 'Project Purchase Orders', description: 'Issue POs tagged to project cost codes and delivery milestone schedules.', phase: 'Phase 11 — Projects & Job Costing', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'APPROVE'] },
              { id: 'tx-proj-materials', code: '10.04.01.03', name: 'Project Materials', description: 'Log site material inspection reports and physical inventory held at site stores.', phase: 'Phase 11 — Projects & Job Costing', actionType: 'transaction', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-subcontractor-cost', code: '10.04.01.04', name: 'Subcontractor Cost', description: 'Track specialist subcontractor packages, payment certificates, and retentions.', phase: 'Phase 11 — Projects & Job Costing', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] }
            ]
          }
        ]
      },
      {
        id: 'project-billing',
        code: '10.05',
        name: 'Project Billing',
        description: 'Revenue recognition rules, progress milestone billing, percent-of-completion invoices, and customer payment certification.',
        icon: 'Receipt',
        phase: 'Phase 11 — Projects & Job Costing',
        processes: [
          {
            id: 'proj-bill-proc',
            code: '10.05.01',
            name: 'Progress Invoicing & Milestones',
            description: 'Interim payment claims, milestone verification, and client billing.',
            phase: 'Phase 11 — Projects & Job Costing',
            transactions: [
              { id: 'tx-proj-revenue', code: '10.05.01.01', name: 'Project Revenue', description: 'Configure revenue recognition schedules (POCM / Cost-to-Cost / Milestones).', phase: 'Phase 11 — Projects & Job Costing', actionType: 'configuration', requiredPermissions: ['VIEW', 'EDIT'] },
              { id: 'tx-proj-billing', code: '10.05.01.02', name: 'Project Billing', description: 'Generate client progress invoices based on certified engineer progress notes.', phase: 'Phase 11 — Projects & Job Costing', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'POST'] },
              { id: 'tx-progress-billing', code: '10.05.01.03', name: 'Progress Billing', description: 'Interim Payment Application (IPA) calculations with advance recovery and retention.', phase: 'Phase 11 — Projects & Job Costing', actionType: 'transaction', requiredPermissions: ['VIEW', 'CREATE', 'PRINT'] },
              { id: 'tx-cust-invoicing-proj', code: '10.05.01.04', name: 'Customer Invoicing', description: 'Post official tax invoices into Accounts Receivable against approved certificates.', phase: 'Phase 11 — Projects & Job Costing', actionType: 'transaction', requiredPermissions: ['VIEW', 'POST'] }
            ]
          }
        ]
      },
      {
        id: 'project-performance',
        code: '10.06',
        name: 'Project Performance',
        description: 'Committed cost tracking, project profit & loss statements, cash flow balances, and Earned Value Management (EVM).',
        icon: 'TrendingUp',
        phase: 'Phase 11 — Projects & Job Costing',
        processes: [
          {
            id: 'proj-perf-proc',
            code: '10.06.01',
            name: 'Profitability, EVA & Progress',
            description: 'Earned Value Analysis, schedule variance, cost-to-complete, and project P&L.',
            phase: 'Phase 11 — Projects & Job Costing',
            transactions: [
              { id: 'tx-proj-commitments', code: '10.06.01.01', name: 'Project Commitments', description: 'Track open POs, subcontract values, and pending purchase requisitions.', phase: 'Phase 11 — Projects & Job Costing', actionType: 'report', requiredPermissions: ['VIEW'] },
              { id: 'tx-proj-profitability', code: '10.06.01.02', name: 'Project Profitability', description: 'Real-time project gross margin analysis comparing earned revenue vs actual cost.', phase: 'Phase 11 — Projects & Job Costing', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] },
              { id: 'tx-proj-pnl', code: '10.06.01.03', name: 'Project P&L', description: 'Comprehensive income statement sliced by project and phase.', phase: 'Phase 11 — Projects & Job Costing', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] },
              { id: 'tx-proj-cashflow', code: '10.06.01.04', name: 'Project Cash Flow', description: 'Cumulative collections received minus cumulative vendor/labor payouts.', phase: 'Phase 11 — Projects & Job Costing', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] },
              { id: 'tx-proj-progress', code: '10.06.01.05', name: 'Project Progress', description: 'Earned Value (EV), Planned Value (PV), Actual Cost (AC), CPI, and SPI metrics.', phase: 'Phase 11 — Projects & Job Costing', actionType: 'report', requiredPermissions: ['VIEW', 'EXPORT'] }
            ]
          }
        ]
      }
    ]
  }
];

import { ERPUserRole } from '../../../types/erp';

export type CurrencyCode = 'OMR' | 'USD' | 'EUR' | 'AED' | 'SAR' | 'GBP';

// ==========================================
// 06.01 LEAD MANAGEMENT
// ==========================================
export type LeadSource =
  | 'Website / Inbound'
  | 'Trade Exhibition (Oman Expo)'
  | 'Referral / Partner'
  | 'Cold Outreach'
  | 'Tender Portal (E-Tendering Oman)'
  | 'Direct Inquiry';

export type LeadStatus =
  | 'New / Unassigned'
  | 'Contacted'
  | 'BANT Qualified'
  | 'Unqualified'
  | 'Converted'
  | 'Lost';

export type LeadRating = 'Hot (High Intent)' | 'Warm (Exploring)' | 'Cold (Low Activity)';

export interface BantQualification {
  budgetOMR: number;
  budgetStatus: 'Verified' | 'Estimated' | 'No Budget' | 'TBD';
  authorityRole: 'Decision Maker' | 'Influencer' | 'Procurement Liaison' | 'Gatekeeper';
  needUrgency: 'Critical (< 30 days)' | 'Medium (1-3 mos)' | 'Low / Exploratory';
  timelineDate: string;
  bantScore: number; // 0-100
}

export interface Lead {
  id: string;
  leadCode: string; // e.g. LED-2026-0081
  fullName: string;
  jobTitle: string;
  companyName: string;
  industry: 'Oil & Gas' | 'Construction & Infra' | 'Utilities & Power' | 'Manufacturing' | 'Government & Defense' | 'Telecom & IT' | 'Logistics & Ports';
  email: string;
  phone: string;
  country: string;
  city: string;
  source: LeadSource;
  status: LeadStatus;
  rating: LeadRating;
  assignedRepId: string;
  assignedRepName: string;
  estimatedDealValueOMR: number;
  bant: BantQualification;
  notes: string;
  createdDate: string;
  convertedCustomerId?: string;
  convertedOpportunityId?: string;
  aiScore?: number;
  aiReasoning?: string;
}

// ==========================================
// 06.02 CUSTOMER MANAGEMENT
// ==========================================
export type CustomerTier =
  | 'Tier 1 — Strategic Key Account'
  | 'Tier 2 — Enterprise Corporate'
  | 'Tier 3 — SME / Commercial'
  | 'Government / Public Authority';

export type CustomerCategory =
  | 'Oil & Gas Upstream/Downstream'
  | 'EPC & Main Contractor'
  | 'Government Ministry / Utility'
  | 'Industrial Manufacturer'
  | 'Commercial Trader';

export interface CustomerContact {
  id: string;
  customerId: string;
  fullName: string;
  designation: string;
  department: 'Executive' | 'Procurement' | 'Finance & AP' | 'Project Operations' | 'Technical Engineering';
  email: string;
  phone: string;
  mobile: string;
  isPrimaryDecisionMaker: boolean;
  isBillingContact: boolean;
}

export interface CustomerCreditTerms {
  creditLimitOMR: number;
  creditDays: number; // e.g. 30, 60, 90 days
  currentOutstandingOMR: number;
  unbilledOrdersOMR: number;
  availableCreditOMR: number;
  creditStatus: 'Good Standing' | 'Near Credit Limit (>85%)' | 'Credit Blocked' | 'Cash in Advance Required';
  paymentTermsLabel: 'Net 30 Days' | 'Net 60 Days' | 'Net 90 Days' | 'PDC upon Delivery' | '100% Advance / LC';
}

export interface Customer {
  id: string;
  customerCode: string; // e.g. CUST-OM-1029
  legalName: string;
  tradeName: string;
  commercialRegistrationNumber: string; // CR number
  taxIdentificationNumber: string; // OM VAT ID e.g. OM-VAT-9021882
  category: CustomerCategory;
  tier: CustomerTier;
  country: string;
  governorate: string;
  city: string;
  billingAddress: string;
  shippingAddress: string;
  currency: CurrencyCode;
  accountManagerId: string;
  accountManagerName: string;
  contacts: CustomerContact[];
  creditTerms: CustomerCreditTerms;
  lifetimeRevenueOMR: number;
  activeOrdersCount: number;
  status: 'Active' | 'Under Review' | 'On Hold' | 'Blacklisted';
  tags: string[];
  createdDate: string;
}

// ==========================================
// 06.03 OPPORTUNITY MANAGEMENT
// ==========================================
export type OpportunityStage =
  | 'Discovery & Prospecting'
  | 'Technical Qualification'
  | 'Proposal & Commercial Quotation'
  | 'Negotiation & Review'
  | 'Closed Won'
  | 'Closed Lost';

export interface Opportunity {
  id: string;
  opportunityCode: string; // e.g. OPP-2026-0312
  title: string;
  customerId: string;
  customerName: string;
  leadId?: string;
  stage: OpportunityStage;
  probabilityPercentage: number; // 10%, 25%, 50%, 75%, 100%, 0%
  dealValueOMR: number;
  weightedValueOMR: number; // dealValue * (probability / 100)
  currency: CurrencyCode;
  ownerId: string;
  ownerName: string;
  expectedCloseDate: string;
  actualCloseDate?: string;
  productLines: string[];
  keyCompetitors: string[];
  winLossReason?: string;
  nextStep: string;
  nextStepDueDate: string;
  createdDate: string;
  aiWinProbabilityScore?: number;
  aiRecommendedAction?: string;
}

// ==========================================
// 06.04 SALES ACTIVITIES
// ==========================================
export type ActivityType = 'Phone Call' | 'Client Meeting' | 'Follow-up' | 'Task' | 'Site Inspection' | 'Product Demo' | 'Client In-Person Meeting' | 'Video Conference' | 'Follow-up Reminder' | 'Action Task / Proposal Draft';

export interface SalesActivity {
  customerId?: string;
  customerName?: string;
  contactName?: string;
  assignedToName?: string;
  dueDate?: string;
  location?: string;
  notes?: string;

  id: string;
  activityCode: string; // e.g. ACT-2026-0941
  type: ActivityType;
  subject: string;
  relatedToType: 'Lead' | 'Customer' | 'Opportunity' | 'Sales Order';
  relatedToId: string;
  relatedToName: string;
  assignedRepId: string;
  assignedRepName: string;
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: number;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Overdue' | 'Pending';
  priority: 'High' | 'Medium' | 'Low' | 'Urgent';
  outcomeNotes?: string;
  nextFollowUpDate?: string;
  completedAt?: string;
}

// ==========================================
// 06.05 SALES QUOTATIONS (CPQ)
// ==========================================
export type QuotationStatus =
  | 'Draft'
  | 'Pending Approval'
  | 'Approved'
  | 'Sent to Client'
  | 'Accepted'
  | 'Revised'
  | 'Rejected'
  | 'Expired'
  | 'Pending Commercial Approval'
  | 'Converted to Sales Order';

export interface QuoteLineItem {
  description?: string;
  unitPriceOMR?: number;
  uom?: string;
  quotationId?: string;
  costPriceOMR?: number;

  id: string;
  itemCode: string;
  itemDescription: string;
  quantity: number;
  unitOfMeasure: 'Units' | 'Meters' | 'Metric Tons' | 'Sets' | 'Hours' | 'Lots';
  listPriceOMR: number;
  discountPercentage: number;
  discountAmountOMR: number;
  netUnitPriceOMR: number;
  lineSubtotalOMR: number;
  vatPercentage: number; // 5% in Oman
  vatAmountOMR: number;
  lineTotalOMR: number;
  estimatedDeliveryWeeks: number;
  marginPercentage: number;
}

export interface SalesQuotation {
  customerVatNumber?: string;
  deliveryLeadTime?: string;
  discountAmountOMR?: number;
  discountPercentage?: number;
  grossMarginPercentage?: number;
  requiresCommercialApproval?: boolean;
  subtotalAmountOMR?: number;
  taxableAmountOMR?: number;
  totalAmountOMR?: number;
  vatPercentage?: number;

  id: string;
  quotationNumber: string; // e.g. QUO-2026-00452
  revisionNumber: number; // e.g. 0, 1, 2
  customerId: string;
  customerName: string;
  opportunityId?: string;
  opportunityName?: string;
  quotationDate: string;
  validUntilDate: string;
  paymentTerms: string;
  incoterms: 'DDP (Delivered Duty Paid)' | 'FOB (Free on Board)' | 'CIF (Cost, Insurance & Freight)' | 'EXW (Ex Works)' | string;
  currency: CurrencyCode;
  exchangeRate: number;
  salesRepId: string;
  salesRepName: string;
  lines: QuoteLineItem[];
  subtotalOMR: number;
  totalDiscountOMR: number;
  vatAmountOMR: number;
  grandTotalOMR: number;
  overallMarginPercentage: number;
  status: QuotationStatus;
  requiresSpecialApproval: boolean; // true if discount > 15% or margin < 20%
  approvalNotes?: string;
  approvedBy?: string;
  approvedAt?: string;
  customerRfQReference?: string;
  deliveryLocation: string;
  warrantyPeriod: string;
}

// ==========================================
// 06.06 SALES ORDERS
// ==========================================
export type SalesOrderStatus =
  | 'Draft'
  | 'Pending Approval'
  | 'Credit Approved'
  | 'Processing / Allocated'
  | 'Partially Delivered'
  | 'Fully Delivered'
  | 'Completed & Billed'
  | 'Cancelled'
  | 'Confirmed'
  | 'In Fulfillment'
  | 'Dispatched'
  | 'Invoiced';

export interface SalesOrderLineItem {
  description?: string;
  quantityOrdered?: number;
  quantityDelivered?: number;
  uom?: string;

  id: string;
  itemCode: string;
  itemDescription: string;
  orderedQuantity: number;
  allocatedQuantity: number;
  deliveredQuantity: number;
  invoicedQuantity: number;
  unitOfMeasure: string;
  unitPriceOMR: number;
  discountPercentage: number;
  netUnitPriceOMR: number;
  lineSubtotalOMR: number;
  vatAmountOMR: number;
  lineTotalOMR: number;
  warehouseLocation: string;
  fulfillmentStatus: 'Pending' | 'Allocated' | 'Partial' | 'Complete';
}

export interface SalesOrder {
  orderNumber?: string;
  totalAmountOMR?: number;
  requestedDeliveryDate?: string;
  deliveryAddress?: string;
  taxableAmountOMR?: number;
  paymentTerms?: string;
  fulfillmentStatus?: string;

  id: string;
  soNumber: string; // e.g. SO-2026-00789
  customerPoNumber: string; // Client's official LPO reference
  quotationId?: string;
  quotationNumber?: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  expectedDeliveryDate: string;
  salesRepId: string;
  salesRepName: string;
  currency: CurrencyCode;
  lines: SalesOrderLineItem[];
  subtotalOMR: number;
  vatAmountOMR: number;
  grandTotalOMR: number;
  advanceDepositPaidOMR: number;
  balanceDueOMR: number;
  creditCheckStatus: 'Passed' | 'Credit Override Approved' | 'Credit Limit Exceeded / Blocked';
  approvalStatus: 'Approved' | 'Pending Commercial Director' | 'Draft';
  status: SalesOrderStatus;
  shippingAddress: string;
  incoterms: string;
  shippingInstructions: string;
  createdDate: string;
}

// ==========================================
// 06.07 DELIVERY & BILLING
// ==========================================
export type DeliveryNoteStatus = 'Draft' | 'Ready for Dispatch' | 'Dispatched / In-Transit' | 'Delivered & Signed' | 'Cancelled' | 'In Transit' | 'Delivered / Customer Signed';

export interface DeliveryNoteLineItem {
  id: string;
  soLineId: string;
  itemCode: string;
  itemDescription: string;
  dispatchedQuantity: number;
  unitOfMeasure: string;
  batchNumber?: string;
  warehouseCode: string;
}

export interface DeliveryNote {
  salesOrderNumber?: string;

  id: string;
  dnNumber: string; // e.g. DN-2026-01201
  deliveryNoteNumber?: string; // alias
  soId: string;
  soNumber: string;
  customerPoNumber: string;
  customerId: string;
  customerName: string;
  dispatchDate: string;
  deliveryDate?: string;
  driverName: string;
  carrierName?: string;
  waybillNumber?: string;
  vehicleRegistration: string;
  gatePassNumber: string;
  deliveryAddress: string;
  receivedByCustomerSignatureName?: string;
  status: DeliveryNoteStatus;
  lines: DeliveryNoteLineItem[];
  invoiced: boolean;
  invoiceNumber?: string;
}

export type ARInvoiceStatus = 'Draft' | 'Posted' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Voided';

export interface ARInvoiceLineItem {
  description?: string;
  quantityBilled?: number;
  uom?: string;
  lineTotalOMR?: number;

  id: string;
  soLineId?: string;
  dnLineId?: string;
  itemCode: string;
  itemDescription: string;
  invoicedQuantity: number;
  unitOfMeasure: string;
  unitPriceOMR: number;
  subtotalOMR: number;
  vatPercentage: number; // 5%
  vatAmountOMR: number;
  totalOMR: number;
  glAccountCode: string; // e.g. 4100-01 Sales Revenue
}

export interface ARInvoice {
  customerTaxId?: string;
  deliveryNoteNumber?: string;
  subtotalAmountOMR?: number;

  id: string;
  invoiceNumber: string; // e.g. INV-2026-04981
  soId: string;
  soNumber: string;
  dnId?: string;
  dnNumber?: string;
  customerId: string;
  customerName: string;
  customerVatNumber: string;
  invoiceDate: string;
  dueDate: string;
  paymentDueDate?: string; // alias
  paymentTerms: string;
  subtotalOMR: number;
  vatAmountOMR: number;
  grandTotalOMR: number;
  totalAmountOMR?: number; // alias
  amountPaidOMR: number;
  balanceDueOMR: number;
  amountDueOMR?: number; // alias
  status: ARInvoiceStatus;
  glAccountReceivable: string; // e.g. 1200-01 Accounts Receivable Trade
  paymentReceiptReferences: string[];
  lines: ARInvoiceLineItem[];
  qrCodeData?: string; // Oman Tax Authority QR compliance
}

export interface CustomerCreditNote {
  id: string;
  creditNoteNumber: string; // e.g. CN-2026-00124
  originalInvoiceNumber: string;
  customerId: string;
  customerName: string;
  issueDate: string;
  reason: 'Price Correction' | 'Goods Returned / Defective' | 'Volume Rebate' | 'Service Penalty Offset';
  subtotalOMR: number;
  vatReversalAmountOMR: number;
  grandTotalOMR: number;
  glAccountCode: string;
  status: 'Draft' | 'Approved' | 'Applied to AR Balance';
  notes: string;
}

export interface CustomerAdvanceDeposit {
  receiptNumber?: string;
  salesOrderNumber?: string;
  bankAccount?: string;
  amountReceivedOMR?: number;

  id: string;
  advanceReceiptNumber: string; // e.g. ADV-2026-00342
  soId?: string;
  soNumber?: string;
  customerId: string;
  customerName: string;
  receiptDate: string;
  paymentMethod: 'Bank Transfer / SWIFT' | 'Cheque' | 'Credit Card' | 'Letter of Credit (LC)';
  bankReference: string;
  depositAmountOMR: number;
  allocatedToInvoiceAmountOMR: number;
  unallocatedBalanceOMR: number;
  glAccountAdvance: string; // e.g. 2150-01 Customer Advance Liabilities
  status: 'Received & Held' | 'Partially Allocated' | 'Fully Utilized' | 'Refunded';
}

// ==========================================
// 06.08 CUSTOMER SERVICE
// ==========================================
export type ComplaintUrgency = 'Critical / Emergency' | 'High' | 'Medium' | 'Low';
export type ComplaintStatus = 'Open / Logged' | 'Under Investigation' | 'Corrective Action in Progress' | 'Resolved / Closed' | 'Resolved';

export interface CustomerComplaint {
  assignedEngineer?: string;
  resolutionNotes?: string;

  id: string;
  ticketNumber: string; // e.g. SR-2026-00431
  customerId: string;
  customerName: string;
  contactPerson: string;
  contactPhone: string;
  soNumber?: string;
  invoiceNumber?: string;
  category: 'Product Quality Defect' | 'Late Delivery' | 'Billing / Invoicing Dispute' | 'Installation Issue' | 'Commercial Grievance';
  subject: string;
  description: string;
  urgency: ComplaintUrgency;
  slaTargetHours: number;
  assignedEngineerId: string;
  assignedEngineerName: string;
  loggedDate: string;
  targetResolutionDate: string;
  actualResolutionDate?: string;
  rootCauseAnalysis?: string;
  correctiveActionTaken?: string;
  status: ComplaintStatus;
  customerSatisfactionRating?: 1 | 2 | 3 | 4 | 5;
}

export interface FieldServiceRequest {
  id: string;
  requestNumber: string; // e.g. FSR-2026-00122
  customerId: string;
  customerName: string;
  siteLocation: string;
  serviceType: 'Commissioning & Startup' | 'Preventive Maintenance' | 'Emergency Breakdown Repair' | 'Calibration & Testing';
  scheduledDate: string;
  leadTechnicianName: string;
  technicianTeamCount: number;
  jobStatus: 'Scheduled' | 'In Progress' | 'Completed' | 'Pending Spare Parts';
  partsReplacedList?: string;
  customerSignOffName?: string;
  serviceReportDocUrl?: string;
}

export interface CustomerFollowUpSurvey {
  id: string;
  surveyNumber: string;
  customerId: string;
  customerName: string;
  soNumber: string;
  feedbackDate: string;
  csatScore: number; // 1 to 10
  npsCategory: 'Promoter' | 'Passive' | 'Detractor';
  feedbackComments: string;
  conductedBy: string;
}

export type ActivityPriority = 'High' | 'Medium' | 'Low';
export type ActivityStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'Overdue';
export type FulfillmentStatus = 'Pending' | 'Allocated' | 'Partial' | 'Complete' | 'Allocated in Warehouse' | 'Picking & Staging';

export type Quotation = SalesQuotation;
export type QuotationLineItem = QuoteLineItem;
export type CreditNote = CustomerCreditNote;
export type CustomerAdvance = CustomerAdvanceDeposit;

// ==========================================
// OVERALL MODULE STATE & STATS
// ==========================================
export interface SalesCrmStats {
  totalPipelineValueOMR: number;
  weightedPipelineValueOMR: number;
  activeOpportunitiesCount: number;
  ytdBookedSalesOrdersOMR: number;
  ytdBilledRevenueOMR: number;
  unbilledDeliveriesOMR: number;
  outstandingReceivablesOMR: number;
  avgWinRatePercentage: number;
  customerSatisfactionIndex: number; // e.g. 94.2%
  openComplaintsCount: number;
  riyadaSmeClientsCount: number;
}

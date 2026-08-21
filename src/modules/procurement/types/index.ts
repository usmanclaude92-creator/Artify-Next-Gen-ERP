// TypeScript definitions for Module 05: Procurement & Purchasing

export type ProcurementStatus = 
  | 'Draft'
  | 'Submitted'
  | 'Pending Approval'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'Published'
  | 'Closed'
  | 'Issued'
  | 'Partially Received'
  | 'Received'
  | 'Inspected'
  | 'Passed'
  | 'Failed'
  | 'Matched'
  | 'Tolerance Warning'
  | 'Discrepancy'
  | 'Posted'
  | 'Cancelled'
  | 'Active'
  | 'Expired';

export type CurrencyCode = 'OMR' | 'USD' | 'EUR' | 'AED' | 'GBP' | 'SAR';

export type PriorityLevel = 'Standard' | 'Medium' | 'High' | 'Urgent / Critical';

// ==========================================
// 05.01 PURCHASE PLANNING
// ==========================================
export interface ProcurementPlanLine {
  id: string;
  category: string;
  itemDescription: string;
  estimatedQuantity: number;
  unitOfMeasure: string;
  estimatedUnitPriceOMR: number;
  estimatedTotalOMR: number;
  targetQuarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  targetMonth: string;
  procurementMethod: 'Open Public Tender' | 'Selective RFQ' | 'Direct Framework Agreement' | 'Sole Source';
  linkedDepartment: string;
  status: 'Planned' | 'In Sourcing' | 'Committed' | 'Completed';
}

export interface ProcurementPlan {
  id: string;
  planNumber: string;
  planTitle: string;
  fiscalYear: number;
  department: string;
  preparedBy: string;
  approvalDate?: string;
  totalEstimatedBudgetOMR: number;
  committedAmountOMR: number;
  utilizedAmountOMR: number;
  status: 'Draft' | 'Approved' | 'Active' | 'Archived';
  lines: ProcurementPlanLine[];
  remarks: string;
}

export interface PurchaseForecastItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  currentStockLevel: number;
  reorderPoint: number;
  leadTimeDays: number;
  historicalRunRateMonthly: number;
  forecastQ1Qty: number;
  forecastQ2Qty: number;
  forecastQ3Qty: number;
  forecastQ4Qty: number;
  recommendedOrderQty: number;
  estimatedCostOMR: number;
  confidenceScore: number;
}

export interface ProcurementBudgetCategory {
  id: string;
  categoryCode: string;
  categoryName: string;
  department: string;
  fiscalYear: number;
  allocatedBudgetOMR: number;
  committedPR_PO_OMR: number;
  invoicedActualOMR: number;
  remainingBudgetOMR: number;
  utilizationPercentage: number;
  alertThresholdPercentage: number;
}

// ==========================================
// 05.02 PURCHASE REQUISITION (PR)
// ==========================================
export interface PRLineItem {
  id: string;
  itemCode?: string;
  itemDescription: string;
  category: string;
  quantity: number;
  unitOfMeasure: string;
  estimatedUnitPrice: number;
  lineTotal: number;
  requiredByDate: string;
  glAccountCode: string;
  costCenter: string;
  preferredSupplierId?: string;
  preferredSupplierName?: string;
  notes?: string;
}

export interface PurchaseRequisition {
  id: string;
  prNumber: string;
  requestDate: string;
  requiredDeliveryDate: string;
  requestorId: string;
  requestorName: string;
  department: string;
  costCenter: string;
  projectCode?: string;
  priority: PriorityLevel;
  currency: CurrencyCode;
  totalEstimatedAmount: number;
  totalEstimatedAmountOMR: number;
  status: 'Draft' | 'Submitted' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Converted to RFQ' | 'Converted to PO' | 'Cancelled';
  assignedBuyer?: string;
  purpose: string;
  justification: string;
  approverComments?: string;
  approvedBy?: string;
  approvedDate?: string;
  lines: PRLineItem[];
  attachedDocCount: number;
  convertedPoNumber?: string;
  convertedRfqNumber?: string;
}

// ==========================================
// 05.03 REQUEST FOR QUOTATION (RFQ)
// ==========================================
export interface RFQLineItem {
  id: string;
  prLineId?: string;
  itemCode?: string;
  itemDescription: string;
  specification: string;
  targetQuantity: number;
  unitOfMeasure: string;
  targetDeliveryDate: string;
}

export interface RFQSupplierInvite {
  supplierId: string;
  supplierName: string;
  supplierEmail: string;
  inviteStatus: 'Invited' | 'Viewed' | 'Bid Submitted' | 'Declined' | 'No Response';
  invitedAt: string;
  submissionDeadline: string;
  responseRef?: string;
}

export interface RequestForQuotation {
  id: string;
  rfqNumber: string;
  title: string;
  issueDate: string;
  closingDate: string;
  category: string;
  procurementSpecialist: string;
  sourcePrNumber?: string;
  deliveryLocation: string;
  paymentTerms: string;
  status: 'Draft' | 'Published' | 'Closed' | 'Under Evaluation' | 'Awarded' | 'Cancelled';
  lines: RFQLineItem[];
  invitedSuppliers: RFQSupplierInvite[];
  termsAndConditions: string;
  bidSubmissionCount: number;
}

// ==========================================
// 05.04 SUPPLIER QUOTATION
// ==========================================
export interface QuotationLineItem {
  id: string;
  rfqLineId?: string;
  itemDescription: string;
  offeredQuantity: number;
  unitOfMeasure: string;
  unitPrice: number;
  discountPercentage: number;
  netUnitPrice: number;
  lineTotal: number;
  leadTimeDays: number;
  brandOrOrigin: string;
  technicalCompliance: 'Full Compliance' | 'Partial / Deviations' | 'Non-Compliant';
}

export interface SupplierQuotation {
  id: string;
  quotationNumber: string;
  rfqId?: string;
  rfqNumber?: string;
  supplierId: string;
  supplierName: string;
  supplierContact: string;
  quotationDate: string;
  validUntilDate: string;
  currency: CurrencyCode;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  totalAmountOMR: number;
  paymentTerms: string;
  incoterms: 'DDP (Delivered Duty Paid)' | 'FOB (Free on Board)' | 'CIF (Cost, Insurance & Freight)' | 'EXW (Ex Works)';
  deliveryLeadTimeWeeks: number;
  warrantyPeriodMonths: number;
  technicalScore: number; // 0-100
  commercialScore: number; // 0-100
  compositeScore: number; // 0-100
  status: 'Submitted' | 'Under Review' | 'Shortlisted' | 'Selected / Awarded' | 'Rejected';
  evaluationRemarks?: string;
  lines: QuotationLineItem[];
}

export interface SupplierSelectionRecord {
  id: string;
  awardNumber: string;
  rfqNumber: string;
  awardDate: string;
  selectedSupplierId: string;
  selectedSupplierName: string;
  selectedQuotationNumber: string;
  totalAwardValueOMR: number;
  savingsVsBudgetOMR: number;
  committeeChairman: string;
  committeeMembers: string[];
  justificationNotes: string;
  approvalStatus: 'Pending Committee Signoff' | 'Approved' | 'Rejected';
}

// ==========================================
// 05.05 PURCHASE ORDERS (PO)
// ==========================================
export interface POLineItem {
  id: string;
  itemCode?: string;
  itemDescription: string;
  orderedQuantity: number;
  receivedQuantity: number;
  invoicedQuantity: number;
  unitOfMeasure: string;
  unitPrice: number;
  discountPercentage: number;
  vatRatePercentage: number;
  lineTotal: number;
  glAccountCode: string;
  deliveryDate: string;
  lineStatus: 'Open' | 'Partially Received' | 'Fully Received' | 'Invoiced' | 'Cancelled';
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  poType: 'Standard PO' | 'Blanket Agreement PO' | 'Service Order';
  orderDate: string;
  promisedDeliveryDate: string;
  supplierId: string;
  supplierName: string;
  supplierContact: string;
  supplierTaxNumber: string;
  currency: CurrencyCode;
  exchangeRate: number;
  subtotal: number;
  vatTotal: number;
  grandTotal: number;
  grandTotalOMR: number;
  sourcePrNumber?: string;
  sourceRfqNumber?: string;
  sourceQuotationNumber?: string;
  paymentTerms: string;
  incoterms: string;
  deliveryAddress: string;
  buyerName: string;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Issued to Vendor' | 'Acknowledged' | 'Partially Received' | 'Received' | 'Closed' | 'Cancelled';
  approvalLevel: 'Tier 1 (Buyer)' | 'Tier 2 (Procurement Mgr)' | 'Tier 3 (CFO / Director)';
  approvedBy?: string;
  approvedDate?: string;
  lines: POLineItem[];
  specialInstructions: string;
}

export interface BlanketPurchaseOrder {
  id: string;
  blanketPoNumber: string;
  agreementTitle: string;
  supplierId: string;
  supplierName: string;
  startDate: string;
  expiryDate: string;
  currency: CurrencyCode;
  agreedCeilingAmount: number;
  releasedAmount: number;
  remainingAmount: number;
  numberOfReleaseOrders: number;
  status: 'Active' | 'Under Review' | 'Expired' | 'Exhausted';
  agreedTerms: string;
  priceLockGuarantee: boolean;
}

// ==========================================
// 05.06 PURCHASING RECEIPTS (GRN / SES)
// ==========================================
export interface GRNLineItem {
  id: string;
  poLineId: string;
  itemDescription: string;
  orderedQty: number;
  previouslyReceivedQty: number;
  deliveredQty: number;
  acceptedQty: number;
  rejectedQty: number;
  unitOfMeasure: string;
  unitPrice: number;
  lineTotal: number;
  batchNumber?: string;
  expiryDate?: string;
  storageWarehouseId: string;
  storageBinLocation: string;
  inspectionResult: 'Pending' | 'Passed' | 'Rejected' | 'Conditional';
}

export interface GoodsReceiptNote {
  id: string;
  grnNumber: string;
  grnType: 'Physical Goods (GRN)' | 'Service Entry Sheet (SES)';
  receiptDate: string;
  poId: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  deliveryNoteNumber: string;
  carrierOrTransporter: string;
  vehicleNumber?: string;
  receivedByWarehouseOfficer: string;
  warehouseLocation: string;
  status: 'Draft' | 'Under Inspection' | 'Accepted' | 'Discrepancy / Partial' | 'Posted to Stock';
  totalDeliveredValueOMR: number;
  lines: GRNLineItem[];
  discrepancyRemarks?: string;
}

export interface ReceiptInspectionRecord {
  id: string;
  inspectionNumber: string;
  grnNumber: string;
  poNumber: string;
  inspectionDate: string;
  inspectorName: string;
  sampleSizeInspected: number;
  acceptedCount: number;
  defectCount: number;
  defectType?: 'Dimensional Error' | 'Surface Damage' | 'Packaging Rupture' | 'Specification Deviation' | 'None';
  overallStatus: 'Pass' | 'Fail' | 'Concession Pass';
  qcCertAttachmentRef?: string;
  correctiveActionRequired: boolean;
  remarks: string;
}

// ==========================================
// 05.07 PURCHASE INVOICE & 3-WAY MATCH
// ==========================================
export interface InvoiceLineItem {
  id: string;
  poLineId?: string;
  grnLineId?: string;
  itemDescription: string;
  invoicedQuantity: number;
  unitOfMeasure?: string;
  unitPrice: number;
  invoicedUnitPrice?: number;
  discountAmount?: number;
  netAmount?: number;
  vatPercentage?: number;
  vatRatePercentage?: number;
  vatAmount: number;
  lineTotal: number;
  glAccountCode?: string;
  poUnitPrice?: number;
  poQuantity?: number;
  grnQuantity?: number;
  variancePercentage?: number;
  matchStatus?: 'Matched' | 'Quantity Mismatch' | 'Price Variance' | 'No GRN Found';
}

export interface PurchaseInvoice {
  id: string;
  invoiceNumber: string; // ERP internal ref
  vendorInvoiceNumber?: string; // External bill number
  supplierInvoiceNumber?: string;
  invoiceDate: string;
  dueDate: string;
  supplierId: string;
  supplierName: string;
  supplierVatNumber?: string;
  poId?: string;
  poNumber: string;
  grnId?: string;
  grnNumber?: string;
  currency: CurrencyCode;
  exchangeRate?: number;
  netSubtotal?: number;
  subtotalOMR?: number;
  vatAmount: number;
  totalInvoiceAmount: number;
  totalInvoiceAmountOMR: number;
  threeWayMatchResult?: 'Full 3-Way Match Passed' | 'Variance Within Tolerance' | 'Price Discrepancy' | 'Quantity Discrepancy' | 'Pending Matching';
  priceTolerancePercentage?: number; // e.g. 2%
  status: 'Draft' | 'Under Verification' | 'Matched' | 'Approved for Payment' | 'On Hold' | 'Posted to AP' | 'Paid';
  paymentReference?: string;
  apGlAccount?: string;
  verifiedBy?: string;
  approvedBy?: string;
  lines: InvoiceLineItem[];
  notes?: string;
}

// ==========================================
// 05.08 PURCHASE RETURNS & DEBIT NOTES
// ==========================================
export interface ReturnLineItem {
  id: string;
  poLineId?: string;
  grnLineId?: string;
  itemCode?: string;
  itemDescription: string;
  returnQuantity?: number;
  returnedQuantity?: number;
  unitOfMeasure: string;
  unitPrice?: number;
  unitPriceOMR?: number;
  returnTotal?: number;
  lineTotalOMR?: number;
  batchNumber?: string;
  reasonForReturn?: string;
  actionRequested?: 'Replacement Required' | 'Debit Note / Refund' | 'Store Credit';
}

export interface PurchaseReturn {
  id: string;
  returnNumber: string;
  returnDate: string;
  returnType: 'Goods Return (RMA)' | 'Service Dispute' | 'Goods Return';
  supplierId: string;
  supplierName: string;
  poNumber: string;
  grnId?: string;
  grnNumber?: string;
  rmaReferenceNumber?: string;
  rmaNumber?: string;
  carrierName?: string;
  gatePassNumber?: string;
  currency?: CurrencyCode;
  totalReturnValueOMR: number;
  status: 'Draft' | 'Awaiting Supplier RMA' | 'Dispatched' | 'Completed' | 'Debit Note Issued' | 'Awaiting Dispatch';
  resolutionType?: string;
  lines: ReturnLineItem[];
  debitNoteNumber?: string;
  linkedDebitNoteNumber?: string;
  reason?: string;
  remarks: string;
}

export interface SupplierDebitNote {
  id: string;
  debitNoteNumber: string;
  issueDate: string;
  supplierId: string;
  supplierName: string;
  originalInvoiceNumber?: string;
  originalPoNumber?: string;
  returnNumber?: string;
  returnReferenceNumber?: string;
  currency: CurrencyCode;
  debitSubtotal?: number;
  grandTotalOMR?: number;
  vatReversalAmount?: number;
  totalDebitAmount?: number;
  totalDebitAmountOMR?: number;
  glAccountDebit?: string;
  glAccountCredit?: string;
  glAccountCode?: string;
  reason?: string;
  reasonDescription?: string;
  status: 'Draft' | 'Posted' | 'Settled Against AP' | 'Refund Received' | 'Posted to AP Subledger';
  approvedBy: string;
}

export type DebitNote = SupplierDebitNote;

// ==========================================
// 05.09 SUPPLIER MANAGEMENT
// ==========================================
export interface SupplierMaster {
  id: string;
  supplierCode: string;
  name: string;
  tradeName?: string;
  commercialRegistrationNo?: string;
  commercialRegistrationNumber?: string;
  taxIdentificationNumber: string;
  category: 'Raw Materials' | 'Capital Equipment' | 'IT & Telecom' | 'Subcontractor / Construction' | 'Facilities & Services' | 'Logistics' | string;
  tier?: string;
  rating: 'Tier 1 Strategic' | 'Tier 2 Preferred' | 'Tier 3 Approved' | 'Under Review' | 'Blacklisted' | 'Tier A' | 'Tier B' | 'Tier C';
  country: string;
  city: string;
  address?: string;
  primaryContactName: string;
  primaryEmail: string;
  primaryPhone?: string;
  phone?: string;
  paymentTerms?: string;
  currency?: CurrencyCode;
  bankName: string;
  bankAccountNumber: string;
  bankIban: string;
  bankSwiftCode?: string;
  swiftCode?: string;
  creditLimitOMR?: number;
  outstandingPayableOMR?: number;
  spendYTD_OMR?: number;
  qualityScore: number; // 0-100
  onTimeDeliveryRate: number; // 0-100 %
  esgScore?: number; // 0-100
  isOmaniSME: boolean;
  icvScorePercentage?: number;
  qualificationStatus?: string;
  activeContractsCount?: number;
  activeContractCount?: number;
  status?: 'Active' | 'Inactive' | 'Suspended' | 'Probation';
  onboardingDate?: string;
}

export type Supplier = SupplierMaster;

export interface SupplierContract {
  id: string;
  contractNumber: string;
  contractTitle: string;
  supplierId: string;
  supplierName: string;
  contractType: 'Master Service Agreement (MSA)' | 'Annual Rate Contract (ARC)' | 'Non-Disclosure Agreement (NDA)' | 'Service Level Agreement (SLA)' | string;
  startDate: string;
  expiryDate: string;
  valueOMR?: number;
  contractValueOMR?: number;
  paymentMilestones?: string;
  noticePeriodDays?: number;
  renewalAlertDays?: number;
  autoRenewalClause?: boolean;
  slaResponseTimeHours?: number;
  penaltyTerms?: string;
  governingLaw?: string;
  status: 'Active' | 'Expiring Soon' | 'Expired' | 'Terminated';
  custodianManager?: string;
  attachmentCount?: number;
}

export interface SupplierEvaluationRecord {
  id: string;
  evaluationNumber?: string;
  scorecardNumber?: string;
  supplierId: string;
  supplierName: string;
  evaluationPeriod: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Annual' | string;
  evaluatedDate?: string;
  evaluatedBy: string;
  qualityMetricScore?: number; // Max 30
  qualityScore?: number;
  deliveryPunctualityScore?: number; // Max 30
  onTimeDeliveryScore?: number;
  commercialCompetitivenessScore?: number;
  priceCompetitivenessScore?: number; // Max 20
  afterSalesSupportScore?: number; // Max 10
  serviceResponsivenessScore?: number;
  complianceAndEsgScore?: number; // Max 10
  esgAndComplianceScore?: number;
  compositeScore?: number;
  totalScore?: number; // 0 - 100
  evaluationGrade?: 'A - Excellent' | 'B - Good' | 'C - Satisfactory' | 'D - Poor / Warning' | 'F - Action Required' | string;
  performanceGrade?: string;
  strengths?: string;
  areasForImprovement?: string;
  actionPlan?: string;
  recommendation?: string;
}

export type EvaluationScorecard = SupplierEvaluationRecord;
export type ServiceEntrySheet = GoodsReceiptNote;

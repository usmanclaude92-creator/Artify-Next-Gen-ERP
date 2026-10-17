// ============================================================================
// MODULE 07: INVENTORY & WAREHOUSE MANAGEMENT — TYPES & INTERFACES
// ============================================================================

export type ValuationMethod = 'FIFO' | 'WEIGHTED_AVERAGE' | 'STANDARD_COST';
export type ItemType = 'RAW_MATERIAL' | 'SEMI_FINISHED' | 'FINISHED_GOOD' | 'CONSUMABLE' | 'SERVICE' | 'CAPITAL_EQUIPMENT';
export type ItemStatus = 'ACTIVE' | 'DISCONTINUED' | 'BLOCKED' | 'PHASE_OUT';

export type WarehouseType = 'CENTRAL_HUB' | 'REGIONAL_DEPOT' | 'EPC_STAGING_YARD' | 'TRANSIT_FACILITY' | 'QUARANTINE_YARD' | 'BONDED_WAREHOUSE';
export type WarehouseZoneType = 'BULK_STORAGE' | 'FAST_PICK' | 'COLD_STORAGE' | 'HAZMAT_BUNKER' | 'QUARANTINE_QC' | 'STAGING_RECEIVING' | 'DISPATCH_DOCK';

export type TransactionType = 'OPENING_STOCK' | 'GOODS_RECEIPT' | 'GOODS_ISSUE' | 'STOCK_TRANSFER' | 'STOCK_ADJUSTMENT';
export type StockTransactionType = TransactionType;
export type StockMovementReason = 'PURCHASE_RECEIPT' | 'SALES_DISPATCH' | 'PRODUCTION_ISSUE' | 'INTER_WAREHOUSE' | 'PHYSICAL_AUDIT_ADJUSTMENT' | 'DAMAGE_SCRAP' | 'INITIAL_MIGRATION' | 'OTHER';
export type TransactionStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'POSTED' | 'CANCELLED';

export type ReturnType = 'PURCHASE_RETURN' | 'SALES_RETURN';
export type ReturnStatus = 'PENDING_INSPECTION' | 'INSPECTED' | 'APPROVED' | 'RESTOCKED' | 'SCRAPPED' | 'SUPPLIER_CLAIM';
export type InspectionDisposition = 'RESTOCK_PRIME' | 'REFURBISH_REWORK' | 'SUPPLIER_CLAIM' | 'SCRAP_WRITEOFF';
export type ReturnDisposition = InspectionDisposition;
export type ReturnReason = 'DEFECTIVE_PRODUCT' | 'WRONG_SPECIFICATION' | 'TRANSIT_DAMAGE' | 'OVER_DELIVERY' | 'ORDER_CANCELLED' | 'CUSTOMER_WARRANTY' | 'OTHER';

export type ReservationType = 'SALES_ORDER' | 'PRODUCTION_WORK_ORDER' | 'PROJECT_STAGING' | 'MAINTENANCE_JOB';
export type ReservationStatus = 'RESERVED' | 'PARTIALLY_ISSUED' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';

export type CountStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COUNTED' | 'RECONCILED' | 'ADJUSTED' | 'CANCELLED';
export type CycleCountCampaign = InventoryCount;
export type CycleCountLine = InventoryCountLine;
export type SerialNumber = SerialNumberRecord;

// ==========================================
// 07.01 — ITEM MASTER & ATTRIBUTES
// ==========================================

export interface UnitOfMeasure {
  code: string; // e.g. PCS, BOX, SET, MTR, KG, TON, DRUM
  name: string;
  category: 'Count' | 'Weight' | 'Length' | 'Volume' | 'Packaging';
  isBaseUnit: boolean;
  baseUnitCode?: string;
  conversionFactor: number; // e.g. 1 BOX = 24 PCS (factor = 24)
}

export interface ItemCategory {
  id: string;
  code: string; // e.g. CAT-VALVES
  name: string;
  description: string;
  parentCategoryId?: string;
  defaultValuationMethod: ValuationMethod;
  glAssetAccount: string; // e.g. 1300-01 Raw Materials Inventory
  glCogsAccount: string; // e.g. 5000-01 Cost of Goods Sold
  glInventoryAdjustmentAccount: string; // e.g. 5200-01 Stock Variance
  taxRatePercent: number; // 5% Oman VAT
  itemCount: number;
}

export interface ItemAttribute {
  id: string;
  attributeKey: string;
  attributeLabel: string;
  dataType: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'SELECT' | 'DATE';
  unitOfMeasure?: string;
  options?: string[];
  isRequired: boolean;
}

export interface ItemMaster {
  id: string;
  sku: string; // e.g. SKU-VLV-99201
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  itemType: ItemType;
  baseUom: string;
  purchaseUom: string;
  salesUom: string;
  barcode: string; // EAN-13 / QR Code
  valuationMethod: ValuationMethod;
  defaultWarehouseId: string;
  defaultBinLocationId?: string;
  
  // Pricing & Costing
  unitCostOMR: number;
  standardCostOMR: number;
  weightedAvgCostOMR: number;
  sellingPriceOMR: number;
  
  // Stock Balances
  totalStockOnHand: number;
  totalReservedStock: number;
  totalAvailableStock: number;
  totalInTransitStock: number;
  totalQuarantineStock: number;
  
  // Planning & Buffers
  reorderPoint: number;
  safetyStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  economicOrderQty: number;
  leadTimeDays: number;
  
  // Traceability & Control
  isBatchManaged: boolean;
  isSerialManaged: boolean;
  isExpiryTracked: boolean;
  shelfLifeDays?: number;
  storageTempCelsius?: string;
  hazardClass?: string; // HazMat UN Code or Non-Hazardous
  countryOfOrigin: string;
  hsCode: string; // Oman Customs Harmonized Code
  
  status: ItemStatus;
  customAttributes: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 07.02 — WAREHOUSE MANAGEMENT & TOPOGRAPHY
// ==========================================

export interface BinLocation {
  id: string;
  warehouseId: string;
  warehouseCode: string;
  zoneId: string;
  zoneCode: string;
  binCode: string; // e.g. RSL-Z1-A04-R02-S3 (Aisle 4, Rack 2, Shelf 3)
  aisle: string;
  rack: string;
  shelf: string;
  position: string;
  barcode: string;
  
  maxWeightKg: number;
  currentWeightKg: number;
  maxVolumeCbm: number;
  currentVolumeCbm: number;
  maxPalletCount: number;
  currentPalletCount: number;
  
  isBlocked: boolean;
  isQuarantine: boolean;
  occupancyPercent: number;
  storedItems: {
    sku: string;
    itemName: string;
    batchNumber?: string;
    quantity: number;
    uom: string;
  }[];
}

export interface WarehouseZone {
  id: string;
  warehouseId: string;
  code: string; // e.g. ZONE-COLD-01
  name: string;
  zoneType: WarehouseZoneType;
  temperatureRangeCelsius?: string; // e.g. "15°C to 25°C"
  isHazMatCertified: boolean;
  totalBins: number;
  occupiedBins: number;
}

export interface Warehouse {
  id: string;
  code: string; // e.g. WH-RSL-01
  name: string;
  type: WarehouseType;
  location: string; // e.g. Rusayl Industrial Estate, Muscat
  governorate: string; // Muscat, Al Batinah, Dhofar, Al Wusta
  address: string;
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  
  totalFloorAreaSqm: number;
  totalStorageCapacityCbm: number;
  totalPalletPositions: number;
  occupiedPalletPositions: number;
  utilizationPercent: number;
  
  zones: WarehouseZone[];
  isActive: boolean;
  allowsDirectShipping: boolean;
  glLocationCode: string;
}

// ==========================================
// 07.03 — STOCK TRANSACTIONS
// ==========================================

export interface StockTransactionLine {
  id: string;
  itemId: string;
  sku: string;
  itemName: string;
  uom: string;
  quantity: number;
  unitCostOMR: number;
  totalCostOMR: number;
  
  fromWarehouseId?: string;
  fromBinLocationId?: string;
  fromBinCode?: string;
  
  toWarehouseId?: string;
  toBinLocationId?: string;
  toBinCode?: string;
  
  batchNumber?: string;
  serialNumbers?: string[];
  expiryDate?: string;
  remarks?: string;
}

export interface StockTransaction {
  id: string;
  transactionNumber: string; // e.g. ST-2026-00481
  type: TransactionType;
  status: TransactionStatus;
  transactionDate: string;
  postingDate: string;
  
  sourceDocumentType?: string; // PO, SO, PROD_WO, PHYSICAL_COUNT, DIRECT
  sourceDocumentNumber?: string; // PO-2026-0811, SO-2026-0419
  
  fromWarehouseId?: string;
  fromWarehouseName?: string;
  toWarehouseId?: string;
  toWarehouseName?: string;
  
  costCenter?: string; // e.g. CC-PLANT-MAINT
  reasonCode?: string; // e.g. DAMAGE, SCRAP, COUNT_VARIANCE, INITIAL_LOAD, REVALUATION
  
  lines: StockTransactionLine[];
  totalQuantity: number;
  totalValueOMR: number;
  
  carrierName?: string;
  driverName?: string;
  vehicleNo?: string;
  waybillNumber?: string;
  
  notes?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
}

// ==========================================
// 07.04 — STOCK RETURNS & INSPECTIONS
// ==========================================

export interface StockReturnLine {
  id: string;
  itemId: string;
  sku: string;
  itemName: string;
  returnedQuantity: number;
  uom: string;
  unitCostOMR: number;
  totalCostOMR: number;
  batchNumber?: string;
  serialNumber?: string;
  returnReason: string; // Defective, Incorrect Spec, Transit Damage, Excess Supply
  inspectionDisposition?: InspectionDisposition;
  inspectionNotes?: string;
  passedQuantity?: number;
  rejectedQuantity?: number;
}

export interface StockReturn {
  id: string;
  returnNumber: string; // e.g. RET-2026-00102
  returnType: ReturnType;
  status: ReturnStatus;
  returnDate: string;
  
  partnerId: string; // Vendor ID or Customer ID
  partnerName: string;
  referenceDocType: 'PURCHASE_ORDER' | 'GOODS_RECEIPT_NOTE' | 'SALES_ORDER' | 'DELIVERY_NOTE';
  referenceDocNumber: string;
  
  warehouseId: string;
  warehouseName: string;
  quarantineBinCode?: string;
  
  lines: StockReturnLine[];
  totalQuantity: number;
  totalValueOMR: number;
  
  inspectedBy?: string;
  inspectionDate?: string;
  debitCreditNoteRef?: string;
  
  notes?: string;
  createdBy: string;
  createdAt: string;
}

// ==========================================
// 07.05 — INVENTORY CONTROL & COUNTING
// ==========================================

export interface StockReservation {
  id: string;
  reservationNumber: string; // e.g. RSV-2026-00912
  reservationType: ReservationType;
  referenceDocNumber: string; // SO-2026-0419 or WO-2026-0120
  customerIdOrProject: string;
  
  itemId: string;
  sku: string;
  itemName: string;
  warehouseId: string;
  warehouseName: string;
  binLocationCode?: string;
  
  reservedQuantity: number;
  issuedQuantity: number;
  remainingQuantity: number;
  uom: string;
  
  reservedDate: string;
  expiryDate: string; // auto-release if not picked by this date
  status: ReservationStatus;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'NORMAL';
  createdBy: string;
}

export interface InventoryCountLine {
  id: string;
  itemId: string;
  sku: string;
  itemName: string;
  uom: string;
  warehouseId: string;
  binLocationCode: string;
  batchNumber?: string;
  systemQuantity: number;
  countedQuantity: number;
  varianceQuantity: number; // counted - system
  unitCostOMR: number;
  varianceValueOMR: number;
  recountRequired: boolean;
  notes?: string;
}

export interface InventoryCount {
  id: string;
  countNumber: string; // e.g. CC-2026-Q3-01
  title: string;
  countType: 'ANNUAL_WALL_TO_WALL' | 'CYCLE_COUNT_ABC' | 'PERPETUAL_SPOT_CHECK' | 'ZONE_COUNT';
  warehouseId: string;
  warehouseName: string;
  zoneCode?: string;
  categoryFilter?: string;
  status: CountStatus;
  
  scheduledDate: string;
  countStartedAt?: string;
  countCompletedAt?: string;
  
  leadAuditor: string;
  counters: string[];
  
  lines: InventoryCountLine[];
  totalSystemItems: number;
  totalCountedItems: number;
  totalVariancesFound: number;
  totalVarianceValueOMR: number;
  accuracyRatePercent: number;
  
  adjustmentTransactionId?: string;
  adjustmentTransactionNumber?: string;
  notes?: string;
  createdAt: string;
}

// ==========================================
// 07.06 — TRACEABILITY (BATCH, SERIAL, EXPIRY)
// ==========================================

export interface BatchLot {
  heatNumber?: string;
  qaApprovalStatus?: string;
  quantityOnHand?: number;
  quantityReserved?: number;
  quantityAvailable?: number;

  id: string;
  batchNumber: string; // e.g. LOT-2026-VLV-8812
  itemId: string;
  sku: string;
  itemName: string;
  warehouseId: string;
  warehouseName: string;
  binLocationCode: string;
  
  manufacturingDate: string;
  expiryDate?: string;
  supplierBatchNumber: string;
  supplierPoNumber: string;
  millTestCertNumber?: string; // MTR Certificate
  
  initialQuantity: number;
  currentQuantity: number;
  allocatedQuantity: number;
  availableQuantity: number;
  uom: string;
  
  qcStatus: 'APPROVED' | 'QUARANTINE' | 'REJECTED' | 'EXPIRED';
  storageConditionNote?: string;
}

export interface SerialNumberRecord {
  warrantyNumber?: string;
  warrantyExpiryDate?: string;

  id: string;
  serialNumber: string; // e.g. SN-VSD-9948210
  itemId: string;
  sku: string;
  itemName: string;
  
  currentWarehouseId?: string;
  currentWarehouseName?: string;
  currentBinCode?: string;
  
  status: 'IN_STOCK' | 'ISSUED' | 'DISPATCHED_TO_CUSTOMER' | 'UNDER_MAINTENANCE' | 'SCRAPPED';
  
  supplierPoNumber: string;
  grnNumber: string;
  customerSoNumber?: string;
  deliveryNoteNumber?: string;
  customerName?: string;
  
  warrantyStartDate?: string;
  warrantyEndDate?: string;
  commissioningDate?: string;
  serviceHistoryCount: number;
}

// ==========================================
// 07.07 — VALUATION & REPORTING
// ==========================================

export interface StockAgingBucket {
  range: '0-30 Days' | '31-60 Days' | '61-90 Days' | '91-180 Days' | '181-365 Days' | '> 365 Days (Slow/Dead)';
  skuCount: number;
  totalValueOMR: number;
  percentageOfInventory: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface StockMovementLedgerEntry {
  id: string;
  timestamp: string;
  transactionNumber: string;
  transactionType: TransactionType | 'PURCHASE_GRN' | 'SALES_DISPATCH';
  referenceDoc: string;
  sku: string;
  itemName: string;
  warehouseName: string;
  binCode: string;
  quantityIn: number;
  quantityOut: number;
  balanceQuantity: number;
  unitCostOMR: number;
  totalMovementValueOMR: number;
  performedBy: string;
}

// ==========================================
// MODULE 07 STATE & CONTEXT
// ==========================================

export interface InventoryStats {
  totalInventoryValuationOMR: number;
  totalSkuCount: number;
  totalPhysicalUnitsOnHand: number;
  warehouseCapacityUtilizationPercent: number;
  itemsBelowSafetyStockCount: number;
  inventoryAccuracyRatePercent: number;
  openReservationsCount: number;
  pendingInspectionsCount: number;
  nearExpiryBatchesCount: number;
  averageInventoryTurnoverRatio: number;
  daysSalesOfInventory: number;
}

export interface InventoryAiRecommendation {
  id: string;
  type: 'STOCKOUT_PREVENTION' | 'REORDER_OPTIMIZATION' | 'SLOW_MOVING_LIQUIDATION' | 'BIN_RELOCATION' | 'EXPIRY_ALERT';
  severity: 'CRITICAL' | 'WARNING' | 'OPPORTUNITY' | 'INFO';
  title: string;
  description: string;
  suggestedAction: string;
  impactValueOMR?: number;
  affectedSku?: string;
  confidenceScore: number;
}

// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 12: SUPPLY CHAIN MANAGEMENT (SCM)
// Domain Types, Data Contracts & Master Interfaces
// ==========================================

export type DemandForecastMethod = 'MOVING_AVERAGE' | 'EXPONENTIAL_SMOOTHING' | 'HOLT_WINTERS' | 'MACHINE_LEARNING' | 'CONSENSUS';
export type AbcClassification = 'A' | 'B' | 'C';
export type XyzClassification = 'X' | 'Y' | 'Z';
export type ForecastStatus = 'Draft' | 'In Review' | 'Approved' | 'Locked' | 'Superseeded';
export type ConsolidationStatus = 'Pending' | 'Consolidated' | 'Converted to PR' | 'Approved';

export interface DemandForecastItem {
  id: string;
  sku: string;
  itemName: string;
  category: string;
  uom: string;
  region: 'Muscat HQ' | 'Sohar Industrial' | 'Salalah Freezone' | 'Dubai Logistics Hub' | 'Abu Dhabi';
  period: string; // e.g. '2026-Q3' or '2026-09'
  historicalSalesQty: number;
  baselineForecastQty: number;
  seasonalityFactor: number;
  promotionalUpliftQty: number;
  consensusForecastQty: number;
  forecastMethod: DemandForecastMethod;
  confidenceScore: number; // 0-100%
  status: ForecastStatus;
  lastUpdated: string;
  updatedBy: string;
  notes?: string;
}

export interface DemandAnalysisMetric {
  sku: string;
  itemName: string;
  category: string;
  abcClass: AbcClassification;
  xyzClass: XyzClassification;
  mapePercent: number; // Mean Absolute Percentage Error
  trackingSignal: number;
  biasPercent: number;
  velocityRank: 'Fast Mover' | 'Medium Mover' | 'Slow Mover' | 'Non-Moving';
  stockoutRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  avgMonthlyDemand: number;
  demandVolatilityStdDev: number;
}

export interface DemandConsolidationBatch {
  id: string;
  batchNumber: string;
  period: string;
  targetFulfillmentMonth: string;
  totalSkus: number;
  totalDemandUnits: number;
  estimatedPurchasingValue: number;
  currency: string;
  status: ConsolidationStatus;
  generatedPrNumber?: string;
  createdDate: string;
  regionsIncluded: string[];
  approvedBy?: string;
}

// -------------------------------------------------------------
// 12.02 — Supply Planning
// -------------------------------------------------------------
export type SupplyConstraintType = 'Raw Material Scarcity' | 'Supplier Capacity Cap' | 'Port Congestion' | 'Production Bottleneck' | 'None';
export type AllocationPriority = 'Tier 1 Strategic' | 'Tier 2 Enterprise' | 'Tier 3 Standard' | 'Internal Reserve';

export interface SupplyForecastItem {
  id: string;
  supplierId: string;
  supplierName: string;
  componentSku: string;
  componentName: string;
  committedMonthlyCapacity: number;
  actualAvailableCapacity: number;
  leadTimeDays: number;
  minOrderQuantity: number;
  constraintType: SupplyConstraintType;
  constraintSeverity: 'None' | 'Moderate' | 'Severe';
  reliabilityRating: number; // 0-100%
  plantOrigin: string;
}

export interface SupplyAllocationRule {
  id: string;
  ruleCode: string;
  sku: string;
  itemName: string;
  totalAvailableStock: number;
  totalUnconstrainedDemand: number;
  shortageUnits: number;
  allocations: {
    channel: string;
    priority: AllocationPriority;
    requestedQty: number;
    allocatedQty: number;
    fulfillmentRatePercent: number;
  }[];
  status: 'Draft' | 'Active' | 'Approved' | 'Executed';
  effectiveDate: string;
}

export interface SupplyOptimizationScenario {
  id: string;
  scenarioName: string;
  description: string;
  serviceLevelTargetPercent: number;
  estimatedTotalLandedCost: number;
  inventoryHoldingCost: number;
  freightCost: number;
  stockoutPenaltyCost: number;
  suggestedTransfersCount: number;
  costSavingsPercent: number;
  status: 'Evaluated' | 'Recommended' | 'Adopted';
}

// -------------------------------------------------------------
// 12.03 — Material Planning (MRP & Inventory Policy)
// -------------------------------------------------------------
export type LotSizingMethod = 'L4L' | 'EOQ' | 'POQ' | 'Fixed Period';

export interface MrpNetRequirement {
  id: string;
  materialCode: string;
  materialName: string;
  category: string;
  uom: string;
  grossRequirementQty: number;
  scheduledReceiptsQty: number;
  projectedOnHandQty: number;
  safetyStockQty: number;
  netRequirementQty: number;
  plannedOrderReceiptQty: number;
  plannedOrderReleaseDate: string;
  requiredDeliveryDate: string;
  leadTimeDays: number;
  lotSizing: LotSizingMethod;
  primarySupplier: string;
  orderActionRequired: 'Create PO' | 'Expedite PO' | 'Defer Order' | 'No Action';
  actionStatus: 'Open' | 'PO Generated' | 'Dismissed';
}

export interface InventoryPlanningPolicy {
  sku: string;
  itemName: string;
  leadTimeDays: number;
  demandStdDevDaily: number;
  serviceLevelTargetPercent: number; // e.g. 95% or 99%
  calculatedSafetyStock: number;
  reorderPoint: number;
  economicOrderQuantity: number;
  maxStockLevel: number;
  currentStock: number;
  stockHealth: 'Healthy' | 'Overstocked' | 'Understocked' | 'Critical Shortage';
}

export interface ProcurementScheduleItem {
  id: string;
  scheduleRef: string;
  materialSku: string;
  materialName: string;
  supplier: string;
  targetContainerCount: number;
  orderVolumeUom: string;
  orderQuantity: number;
  orderDate: string;
  plannedDepartureDate: string;
  estimatedArrivalDate: string;
  poReference?: string;
  status: 'Planned' | 'PO Issued' | 'Confirmed By Supplier' | 'In Transit';
}

// -------------------------------------------------------------
// 12.04 — Logistics Management
// -------------------------------------------------------------
export type TransportMode = 'Ocean Freight (FCL)' | 'Ocean Freight (LCL)' | 'Air Cargo' | 'Road Cross-Border' | 'Rail Express';
export type ShipmentTransitStatus = 
  | 'Booked' 
  | 'Cargo Picked Up' 
  | 'Vessel Departed' 
  | 'In Transit / High Seas' 
  | 'Port of Arrival' 
  | 'Customs Hold' 
  | 'Customs Cleared' 
  | 'Dispatched to RDC' 
  | 'Delivered';

export interface MilestoneEvent {
  stage: ShipmentTransitStatus;
  location: string;
  timestamp: string;
  isCompleted: boolean;
  notes?: string;
}

export interface FreightShipment {
  id: string;
  shipmentNumber: string;
  bookingRef: string;
  mode: TransportMode;
  carrierName: string;
  vesselOrFlightNumber: string;
  billOfLadingOrAwb: string;
  originPort: string;
  originCountry: string;
  destinationPort: string;
  destinationHub: string;
  containerCount: number;
  containerNumbers: string[];
  totalWeightKg: number;
  totalVolumeCbm: number;
  departureDate: string;
  estimatedArrivalDate: string;
  actualArrivalDate?: string;
  status: ShipmentTransitStatus;
  currentLocationName: string;
  gpsCoordinates: { lat: number; lng: number };
  demurrageFreeDaysRemaining: number;
  delayRisk: 'None' | 'Minor Delay (+2d)' | 'High Risk (+5d)' | 'Critical';
  delayReason?: string;
  milestones: MilestoneEvent[];
  temperatureMonitoring?: {
    required: boolean;
    targetCelsius: number;
    currentCelsius: number;
    isExcursionAlert: boolean;
  };
  cargoValue: number;
  freightCost: number;
  currency: string;
}

export interface TransportTrip {
  id: string;
  tripCode: string;
  vehiclePlate: string;
  vehicleType: 'Heavy Flatbed 40ft' | 'Refrigerated 24T' | 'Box Truck 10T' | 'Sprinter Van';
  driverName: string;
  driverPhone: string;
  origin: string;
  destination: string;
  stopsCount: number;
  capacityUtilizationPercent: number;
  departureTime: string;
  estimatedDeliveryTime: string;
  status: 'Scheduled' | 'Loading' | 'En Route' | 'Delivered' | 'Returned';
  fuelCostEst: number;
}

// -------------------------------------------------------------
// 12.05 — Import & Export (Customs, Tariffs & Trade Compliance)
// -------------------------------------------------------------
export type DeclarationType = 'Import Bayan' | 'Export Bayan' | 'Transit Declaration' | 'Freezone Transfer';
export type CustomsStatus = 'Draft' | 'Submitted to Bayan' | 'Under Inspection' | 'Duty Assessment' | 'Duty Paid' | 'Release Order Issued' | 'Rejected';

export interface CustomsDeclarationItem {
  lineId: string;
  hsCode: string;
  description: string;
  countryOfOrigin: string;
  quantity: number;
  uom: string;
  cifValue: number;
  dutyRatePercent: number;
  calculatedDutyAmount: number;
  vatRatePercent: number;
  vatAmount: number;
  exemptionCode?: string;
}

export interface CustomsDeclaration {
  id: string;
  declarationNumber: string; // e.g. BAYAN-2026-OM-88391
  type: DeclarationType;
  commercialInvoiceNumber: string;
  billOfLading: string;
  importerExporterName: string;
  customsPortCode: 'OM-MCT-SEA' | 'OM-SLH-SEA' | 'OM-SOH-SEA' | 'OM-MCT-AIR' | 'AE-DXB-AIR';
  customsPortName: string;
  submissionDate: string;
  status: CustomsStatus;
  totalCifValue: number;
  totalCustomsDuty: number;
  totalVat: number;
  totalPayable: number;
  currency: string;
  documentsAttached: {
    type: 'Commercial Invoice' | 'Packing List' | 'Certificate of Origin (COO)' | 'Inspection / SASO' | 'Bill of Lading';
    fileName: string;
    verified: boolean;
  }[];
  items: CustomsDeclarationItem[];
  inspectionType: 'Green Channel (Immediate)' | 'Yellow Channel (Document Review)' | 'Red Channel (Physical Inspection)';
  dutyPaymentRef?: string;
}

export interface TradeComplianceRecord {
  id: string;
  checkDate: string;
  partnerName: string;
  partnerType: 'Supplier' | 'Customer' | 'Freight Forwarder' | 'Bank';
  sanctionListScreening: 'Clear' | 'Match Found' | 'Requires Review';
  dualUseGoodsCheck: 'Compliant' | 'Requires Export License';
  embargoCountryCheck: 'Pass' | 'Blocked';
  overallComplianceStatus: 'Approved' | 'Blocked' | 'Review Required';
  screenedBy: string;
}

// -------------------------------------------------------------
// 12.06 — Distribution & SCM Analytics
// -------------------------------------------------------------
export interface WarehousePlanHub {
  id: string;
  hubCode: string;
  hubName: string;
  city: string;
  totalPalletCapacity: number;
  occupiedPalletPositions: number;
  utilizationPercent: number;
  crossDockBaysAvailable: number;
  activeInboundTrailers: number;
  activeOutboundDispatches: number;
  fastPickEfficiencyIndex: number;
}

export interface DistributionReplenishmentOrder {
  id: string;
  replenishmentOrderNumber: string;
  sourceHub: string;
  destinationDepot: string;
  requestedDate: string;
  dispatchDate: string;
  totalPallets: number;
  skuCount: number;
  priority: 'Urgent' | 'Standard Replenishment' | 'Bulk Transfer';
  status: 'Planned' | 'Picking' | 'Staged for Loading' | 'In Transit' | 'Received & Stored';
}

export interface DeliveryShipmentRecord {
  id: string;
  dispatchId: string;
  customerOrderRef: string;
  customerName: string;
  deliveryAddress: string;
  city: string;
  assignedDriver: string;
  driverPhone: string;
  vehiclePlate: string;
  scheduledTimeWindow: string;
  actualDeliveryTime?: string;
  status: 'Dispatched' | 'Out for Delivery' | 'Delivered' | 'Attempt Failed' | 'Returned';
  epodSignatureCaptured: boolean;
  recipientName?: string;
  proofPhotoUrl?: string;
  deliveryNotes?: string;
}

export interface ScmKpiMetrics {
  onTimeInFullPercent: number;
  totalActiveShipments: number;
  inboundContainerCount: number;
  customsAvgClearanceDays: number;
  inventoryDwellDaysAvg: number;
  totalLandedCostSavingsPercent: number;
  freightCostPerUnitAvg: number;
  supplyChainRiskScore: number; // 0-100
}

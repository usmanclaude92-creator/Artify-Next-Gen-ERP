// ==========================================
// ARTIFY ERP — MODULE 08: MANUFACTURING / PRODUCTION
// Types & Schema Definitions
// ==========================================

export type BomStatus = 'DRAFT' | 'UNDER_REVIEW' | 'ACTIVE' | 'OBSOLETE';
export type WorkOrderStatus = 'PLANNED' | 'RELEASED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CLOSED' | 'CANCELLED';
export type WorkOrderPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'EMERGENCY_RUSH';
export type WorkCenterType = 'MACHINING' | 'FABRICATION' | 'WELDING' | 'SURFACE_TREATMENT' | 'ASSEMBLY' | 'TESTING_QC' | 'PACKAGING';
export type WorkCenterStatus = 'OPERATIONAL' | 'MAINTENANCE_DOWNTIME' | 'STANDBY' | 'OFFLINE';
export type ScrapReasonCode = 'MACHINING_TOLERANCE_ERROR' | 'RAW_MATERIAL_FLAW' | 'OPERATOR_ERROR' | 'THERMAL_DISTORTION' | 'EQUIPMENT_MALFUNCTION' | 'TEST_FAILURE' | 'OTHER';
export type VarianceType = 'FAVORABLE' | 'UNFAVORABLE' | 'NEUTRAL';
export type MaterialIssueType = 'PICK_AND_ISSUE' | 'BACKFLUSH' | 'MANUAL_DISPATCH';
export type DefectSeverity = 'MINOR' | 'MAJOR' | 'CRITICAL_SCRAP';

// ==========================================
// 08.01 — PRODUCT & BOM MANAGEMENT
// ==========================================

export interface BomComponentLine {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  quantityPerUnit: number;
  uom: string;
  unitCostOMR: number;
  totalCostOMR: number;
  scrapAllowancePct: number; // e.g. 2.5%
  isSubAssembly: boolean;
  subAssemblyBomId?: string;
  operationSeqNumber: number; // Linked routing op, e.g. 10, 20
  notes?: string;
}

export interface BomByProductLine {
  id: string;
  itemCode: string;
  itemName: string;
  expectedOutputRatio: number; // per 1 unit of parent finished good
  uom: string;
  estimatedValueOMR: number;
  costAllocationMethod: 'NET_REALIZABLE_VALUE' | 'PERCENTAGE_SPLIT' | 'ZERO_COST';
}

export interface RoutingOperationStep {
  id: string;
  stepNumber: number; // 10, 20, 30, 40, 50
  operationName: string;
  description: string;
  workCenterId: string;
  workCenterName: string;
  setupTimeMinutes: number;
  runTimeMinutesPerUnit: number;
  laborHoursPerUnit: number;
  machineHoursPerUnit: number;
  standardLaborRateOMR: number;
  standardMachineRateOMR: number;
  standardOverheadRateOMR: number;
  totalStepCostPerUnitOMR: number;
  qualityCheckRequired: boolean;
  inspectionStandardDoc?: string;
}

export interface ProductionSpecification {
  id: string;
  specCode: string;
  title: string;
  drawingNumber: string;
  cadFileRef?: string;
  revision: string;
  toleranceStandard: string; // e.g. ISO 2768-mK / PDO-SP-2040
  materialGrade: string; // e.g. ASTM A105 / 316L Stainless Steel
  safetyRequirements: string[];
  qaCheckpoints: string[];
  approvedBy: string;
  approvedDate: string;
}

export interface BillOfMaterials {
  id: string;
  bomCode: string;
  productSku: string;
  productName: string;
  description: string;
  version: string; // e.g. v2.1
  status: BomStatus;
  baseQuantity: number;
  baseUom: string;
  components: BomComponentLine[];
  byProducts: BomByProductLine[];
  routingSteps: RoutingOperationStep[];
  specifications?: ProductionSpecification;
  totalMaterialCostOMR: number;
  totalLaborCostOMR: number;
  totalMachineCostOMR: number;
  totalStandardCostOMR: number;
  effectiveFrom: string;
  effectiveTo?: string;
  ecnReference?: string; // Engineering Change Notice #
  changeNotes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 08.02 — PRODUCTION PLANNING (MPS, MRP, RCCP)
// ==========================================

export interface MonthlyForecastBucket {
  month: string; // "2026-09"
  monthName: string;
  salesForecastUnits: number;
  confirmedOrdersUnits: number;
  totalDemandUnits: number;
  plannedProductionUnits: number;
  projectedEndingInventoryUnits: number;
}

export interface ProductionForecast {
  id: string;
  forecastCode: string;
  productSku: string;
  productName: string;
  planningYear: number;
  baselineSafetyStockUnits: number;
  leadTimeDays: number;
  buckets: MonthlyForecastBucket[];
  confidenceScorePct: number;
  generatedByAi: boolean;
}

export interface MasterProductionScheduleItem {
  id: string;
  mpsCode: string;
  productSku: string;
  productName: string;
  planWeek: string; // e.g. "2026-W36"
  targetDate: string;
  plannedBatchQuantity: number;
  uom: string;
  priority: WorkOrderPriority;
  status: 'PROPOSED' | 'FIRM_PLANNED' | 'COMMITTED';
  assignedLine: string;
  workCenterDemandHours: Record<string, number>; // workCenterId -> hours
}

export interface MrpRequirementLine {
  id: string;
  materialSku: string;
  materialName: string;
  uom: string;
  isPurchased: boolean;
  currentStockOnHand: number;
  allocatedInWip: number;
  freeAvailableStock: number;
  grossRequirement: number;
  scheduledReceipts: number;
  netRequirement: number;
  leadTimeDays: number;
  recommendedOrderQuantity: number;
  suggestedAction: 'GENERATE_PURCHASE_REQUISITION' | 'GENERATE_SUB_WORK_ORDER' | 'STOCK_SUFFICIENT';
  actionStatus: 'PENDING' | 'CONVERTED' | 'DISMISSED';
  generatedRefNumber?: string;
}

export interface CapacityPlanCenterSummary {
  workCenterId: string;
  workCenterName: string;
  totalWeeklyCapacityHours: number;
  scheduledLoadHours: number;
  utilizationPercentage: number;
  isOverloaded: boolean;
  bottleneckRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

// ==========================================
// 08.03 — PRODUCTION ORDERS & TRAVELERS
// ==========================================

export interface WorkOrderOperationProgress {
  stepNumber: number;
  operationName: string;
  workCenterName: string;
  status: 'PENDING' | 'IN_SETUP' | 'RUNNING' | 'COMPLETED' | 'SKIPPED';
  setupStartTime?: string;
  runStartTime?: string;
  completionTime?: string;
  plannedHours: number;
  actualHours: number;
  completedQuantity: number;
  scrapQuantity: number;
  operatorName?: string;
}

export interface WorkOrderMaterialRequirement {
  id: string;
  itemCode: string;
  itemName: string;
  uom: string;
  requiredQty: number;
  allocatedQty: number;
  issuedQty: number;
  returnedQty: number;
  consumedQty: number;
  unitCostOMR: number;
  totalIssuedValueOMR: number;
  warehouseId: string;
  batchLotAllocated?: string;
  isFullyIssued: boolean;
}

export interface WorkOrder {
  id: string;
  orderNumber: string; // WO-2026-0081
  productSku: string;
  productName: string;
  bomId: string;
  bomVersion: string;
  plannedQuantity: number;
  completedQuantity: number;
  scrappedQuantity: number;
  uom: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  sourceType: 'SALES_ORDER' | 'MPS_PLAN' | 'SAFETY_STOCK_REPLENISHMENT' | 'INTERNAL_RND';
  sourceReference: string; // SO-2026-0941 / MPS-W36
  customerName?: string;
  productionPlant: string; // e.g. "Sohar Industrial Plant — Line A"
  supervisor: string;
  scheduledStartDate: string;
  scheduledEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  materialRequirements: WorkOrderMaterialRequirement[];
  operations: WorkOrderOperationProgress[];
  targetLotNumber: string;
  notes?: string;
  totalStandardCostOMR: number;
  totalActualWipCostOMR: number;
}

export interface MaterialIssueVoucher {
  id: string;
  voucherNumber: string; // MIV-2026-0041
  workOrderId: string;
  workOrderNumber: string;
  productName: string;
  issueDate: string;
  issueType: MaterialIssueType;
  fromWarehouse: string;
  toWorkCenter: string;
  issuedBy: string;
  authorizedBy: string;
  items: {
    itemCode: string;
    itemName: string;
    uom: string;
    requestedQty: number;
    issuedQty: number;
    unitCostOMR: number;
    totalCostOMR: number;
    batchNumber: string;
    binLocation: string;
  }[];
  totalValueOMR: number;
  status: 'DRAFT' | 'POSTED' | 'CANCELLED';
}

export interface MaterialReturnVoucher {
  id: string;
  returnVoucherNumber: string; // MRV-2026-0012
  workOrderId: string;
  workOrderNumber: string;
  returnDate: string;
  fromWorkCenter: string;
  toWarehouse: string;
  returnedBy: string;
  reasonCode: 'EXCESS_MATERIAL' | 'ORDER_MODIFICATION' | 'DEFECTIVE_INPUT' | 'JOB_COMPLETED';
  items: {
    itemCode: string;
    itemName: string;
    uom: string;
    returnedQty: number;
    unitCostOMR: number;
    totalCreditValueOMR: number;
    batchNumber: string;
    binLocation: string;
  }[];
  totalCreditValueOMR: number;
  status: 'DRAFT' | 'POSTED';
}

// ==========================================
// 08.04 — WORK CENTERS & CAPACITY
// ==========================================

export interface MachineAsset {
  machineId: string;
  machineCode: string;
  name: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
  commissionYear: number;
  status: 'RUNNING' | 'MAINTENANCE_DUE' | 'BREAKDOWN' | 'CALIBRATION_OK';
  powerRatingKw: number;
  hourlyOperatingCostOMR: number;
  lastPmDate: string;
  nextPmDueDate: string;
}

export interface LaborSkillAllocation {
  roleTitle: string;
  requiredCertification: string;
  headcountAvailable: number;
  hourlyLaborRateOMR: number;
  overtimeMultiplier: number;
}

export interface WorkCenter {
  id: string;
  code: string;
  name: string;
  type: WorkCenterType;
  plantLocation: string;
  costCenterCode: string;
  status: WorkCenterStatus;
  shiftsPerDay: number; // 1, 2, or 3
  workingHoursPerShift: number; // 8
  daysPerWeek: number; // 5 or 6
  nominalCapacityHoursPerWeek: number;
  efficiencyFactorPct: number; // e.g. 90%
  effectiveCapacityHoursPerWeek: number;
  standardHourlyLaborRateOMR: number;
  standardHourlyMachineRateOMR: number;
  standardHourlyOverheadRateOMR: number;
  totalHourlyBurdenRateOMR: number;
  oeeAvailabilityPct: number;
  oeePerformancePct: number;
  oeeQualityPct: number;
  oeeOverallPct: number;
  machines: MachineAsset[];
  laborSkills: LaborSkillAllocation[];
  currentScheduledJobsCount: number;
}

export interface WorkCenterScheduleSlot {
  id: string;
  workCenterId: string;
  workCenterName: string;
  workOrderId: string;
  workOrderNumber: string;
  productName: string;
  operationStep: number;
  operationName: string;
  startTime: string; // ISO datetime
  endTime: string;
  durationHours: number;
  colorTag: string;
  isDowntime: boolean;
  downtimeReason?: string;
  operatorAssigned: string;
}

// ==========================================
// 08.05 — PRODUCTION OUTPUT & SCRAP
// ==========================================

export interface ProductionReceiptVoucher {
  id: string;
  receiptNumber: string; // PR-2026-0092
  workOrderId: string;
  workOrderNumber: string;
  productSku: string;
  productName: string;
  receivedQuantity: number;
  uom: string;
  lotBatchNumber: string;
  manufactureDate: string;
  expiryDate?: string;
  targetWarehouse: string;
  targetBinLocation: string;
  inspectedBy: string;
  qcReleaseStatus: 'RELEASED_PRIME' | 'CONDITIONAL_PASS' | 'QUARANTINE_HOLD';
  unitCostOMR: number;
  totalInventoryValuationOMR: number;
  receivedDate: string;
  createdByName: string;
}

export interface ScrapRecord {
  id: string;
  scrapVoucherNumber: string; // SCRAP-2026-0033
  workOrderId: string;
  workOrderNumber: string;
  productSku: string;
  productName: string;
  operationStep: number;
  operationName: string;
  workCenterName: string;
  scrappedQuantity: number;
  uom: string;
  reasonCode: ScrapReasonCode;
  defectDescription: string;
  rootCauseAnalysis: string; // 5-Whys or Ishikawa summary
  estimatedScrapValueLossOMR: number;
  correctiveActionTaken: string;
  recordedBy: string;
  recordedDate: string;
  disposition: 'SCRAP_RECYCLE' | 'HAZARDOUS_DISPOSAL' | 'REWORK_SECONDARY';
}

export interface ByProductReceipt {
  id: string;
  byProductNumber: string; // BYP-2026-0015
  workOrderId: string;
  workOrderNumber: string;
  itemCode: string;
  itemName: string;
  quantityProduced: number;
  uom: string;
  allocatedUnitValueOMR: number;
  totalCreditedValueOMR: number;
  targetWarehouse: string;
  targetBin: string;
  loggedDate: string;
}

// ==========================================
// 08.06 — PRODUCTION COSTING & VARIANCE
// ==========================================

export interface CostBreakdownItem {
  category: 'DIRECT_MATERIAL' | 'DIRECT_LABOR' | 'MACHINE_OVERHEAD' | 'FACTORY_BURDEN';
  categoryLabel: string;
  standardCostOMR: number;
  actualCostOMR: number;
  varianceOMR: number;
  variancePct: number;
  type: VarianceType;
  explanation: string;
}

export interface ProductionCostSheet {
  id: string;
  workOrderId: string;
  workOrderNumber: string;
  productSku: string;
  productName: string;
  producedQuantity: number;
  uom: string;
  standardUnitCostOMR: number;
  actualUnitCostOMR: number;
  totalStandardCostOMR: number;
  totalActualCostOMR: number;
  netVarianceOMR: number;
  netVarianceType: VarianceType;
  costItems: CostBreakdownItem[];
  materialPriceVarianceOMR: number;
  materialUsageVarianceOMR: number;
  laborRateVarianceOMR: number;
  laborEfficiencyVarianceOMR: number;
  machineSpendingVarianceOMR: number;
  machineEfficiencyVarianceOMR: number;
  glJournalVoucherRef?: string;
  closedDate: string;
}

// ==========================================
// MODULE EXECUTIVE STATS & KPI AGGREGATION
// ==========================================

export interface ManufacturingExecutiveStats {
  activeWorkOrdersCount: number;
  workOrdersInProgress: number;
  workOrdersReleased: number;
  workOrdersCompletedMTD: number;
  monthlyProductionVolumeUnits: number;
  plantCapacityUtilizationPct: number;
  overallEquipmentEffectivenessPct: number; // OEE
  totalWipValuationOMR: number;
  finishedGoodsProducedValueOMR: number;
  totalProductionVarianceOMR: number;
  scrapRatePercentage: number;
  scheduledDowntimeHoursThisWeek: number;
  activeWorkCentersCount: number;
}

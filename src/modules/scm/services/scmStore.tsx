// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 12: SUPPLY CHAIN MANAGEMENT (SCM)
// Centralized Reactive State Store & Business Logic
// ==========================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DemandForecastItem,
  DemandAnalysisMetric,
  DemandConsolidationBatch,
  SupplyForecastItem,
  SupplyAllocationRule,
  SupplyOptimizationScenario,
  MrpNetRequirement,
  InventoryPlanningPolicy,
  ProcurementScheduleItem,
  FreightShipment,
  TransportTrip,
  CustomsDeclaration,
  TradeComplianceRecord,
  WarehousePlanHub,
  DistributionReplenishmentOrder,
  DeliveryShipmentRecord,
  ScmKpiMetrics,
  ShipmentTransitStatus,
  CustomsStatus
} from '../types';
import { mockRandom } from '@/src/utils/mockRandom';

interface ScmStoreContextType {
  // State
  demandForecasts: DemandForecastItem[];
  demandAnalysis: DemandAnalysisMetric[];
  consolidationBatches: DemandConsolidationBatch[];
  supplyForecasts: SupplyForecastItem[];
  supplyAllocations: SupplyAllocationRule[];
  supplyScenarios: SupplyOptimizationScenario[];
  mrpRequirements: MrpNetRequirement[];
  inventoryPolicies: InventoryPlanningPolicy[];
  procurementSchedules: ProcurementScheduleItem[];
  freightShipments: FreightShipment[];
  transportTrips: TransportTrip[];
  customsDeclarations: CustomsDeclaration[];
  tradeComplianceRecords: TradeComplianceRecord[];
  warehouseHubs: WarehousePlanHub[];
  replenishmentOrders: DistributionReplenishmentOrder[];
  deliveryRecords: DeliveryShipmentRecord[];
  kpiMetrics: ScmKpiMetrics;
  selectedShipment: FreightShipment | null;
  currency: string;

  // Actions — 12.01 Demand Planning
  addDemandForecast: (item: Omit<DemandForecastItem, 'id' | 'lastUpdated'>) => void;
  updateDemandForecast: (id: string, updates: Partial<DemandForecastItem>) => void;
  recalculateStatisticalForecast: (id: string, method: DemandForecastItem['forecastMethod'], seasonalityFactor?: number) => void;
  createConsolidationBatch: (period: string, regions: string[]) => DemandConsolidationBatch;
  convertConsolidationToPr: (batchId: string) => void;

  // Actions — 12.02 Supply Planning
  updateSupplyAllocationQty: (ruleId: string, channelIndex: number, newAllocatedQty: number) => void;
  adoptSupplyOptimizationScenario: (scenarioId: string) => void;

  // Actions — 12.03 Material Planning (MRP)
  generatePurchaseOrderFromMrp: (mrpId: string) => string;
  updateInventorySafetyLevel: (sku: string, serviceLevelPercent: number) => void;

  // Actions — 12.04 Logistics Management
  createFreightShipment: (shipment: Omit<FreightShipment, 'id' | 'shipmentNumber' | 'milestones'>) => FreightShipment;
  updateShipmentStatus: (shipmentId: string, newStatus: ShipmentTransitStatus, note?: string) => void;
  selectShipment: (shipment: FreightShipment | null) => void;

  // Actions — 12.05 Import & Export
  createCustomsDeclaration: (dec: Omit<CustomsDeclaration, 'id' | 'declarationNumber' | 'submissionDate'>) => CustomsDeclaration;
  updateCustomsStatus: (declarationId: string, status: CustomsStatus) => void;
  runTradeComplianceScreening: (partnerName: string, partnerType: TradeComplianceRecord['partnerType']) => TradeComplianceRecord;

  // Actions — 12.06 Distribution
  createReplenishmentOrder: (order: Omit<DistributionReplenishmentOrder, 'id' | 'replenishmentOrderNumber'>) => void;
  updateReplenishmentStatus: (id: string, status: DistributionReplenishmentOrder['status']) => void;
  completeDeliveryEpod: (deliveryId: string, recipientName: string, notes?: string) => void;

  // Global SCM Refresh & Filters
  refreshScmMetrics: () => void;
}

const ScmStoreContext = createContext<ScmStoreContextType | undefined>(undefined);

// -------------------------------------------------------------
// Realistic Industrial Seed Data
// -------------------------------------------------------------

const INITIAL_DEMAND_FORECASTS: DemandForecastItem[] = [
  {
    id: 'DF-2026-001',
    sku: 'VALVE-ISO-DN150',
    itemName: 'High-Pressure Cryogenic Ball Valve DN150',
    category: 'Valves & Flow Control',
    uom: 'Units',
    region: 'Muscat HQ',
    period: '2026-Q3',
    historicalSalesQty: 480,
    baselineForecastQty: 520,
    seasonalityFactor: 1.15,
    promotionalUpliftQty: 45,
    consensusForecastQty: 643,
    forecastMethod: 'HOLT_WINTERS',
    confidenceScore: 94,
    status: 'Approved',
    lastUpdated: '2026-08-18',
    updatedBy: 'S. Al-Mamari (Demand Lead)',
    notes: 'Uplift driven by new LNG export terminal expansion phase.'
  },
  {
    id: 'DF-2026-002',
    sku: 'STEEL-ALLOY-BEAM-316L',
    itemName: 'Marine Grade Stainless Steel Beam 316L (12m)',
    category: 'Structural Metals',
    uom: 'Metric Tons',
    region: 'Sohar Industrial',
    period: '2026-Q3',
    historicalSalesQty: 820,
    baselineForecastQty: 850,
    seasonalityFactor: 1.05,
    promotionalUpliftQty: 0,
    consensusForecastQty: 892,
    forecastMethod: 'EXPONENTIAL_SMOOTHING',
    confidenceScore: 91,
    status: 'Approved',
    lastUpdated: '2026-08-19',
    updatedBy: 'R. Mehta (SCM Planner)'
  },
  {
    id: 'DF-2026-003',
    sku: 'POLY-HDPE-PELLET-EX5',
    itemName: 'High-Density Polyethylene Resin Pellets (Film Grade)',
    category: 'Polymers & Chemicals',
    uom: 'Metric Tons',
    region: 'Salalah Freezone',
    period: '2026-Q3',
    historicalSalesQty: 1450,
    baselineForecastQty: 1500,
    seasonalityFactor: 1.20,
    promotionalUpliftQty: 120,
    consensusForecastQty: 1920,
    forecastMethod: 'MACHINE_LEARNING',
    confidenceScore: 88,
    status: 'In Review',
    lastUpdated: '2026-08-20',
    updatedBy: 'K. Al-Balushi'
  },
  {
    id: 'DF-2026-004',
    sku: 'PUMP-CENTRIF-50KW',
    itemName: 'Industrial Multistage Centrifugal Pump 50kW',
    category: 'Rotating Equipment',
    uom: 'Units',
    region: 'Dubai Logistics Hub',
    period: '2026-Q3',
    historicalSalesQty: 75,
    baselineForecastQty: 80,
    seasonalityFactor: 1.0,
    promotionalUpliftQty: 10,
    consensusForecastQty: 90,
    forecastMethod: 'MOVING_AVERAGE',
    confidenceScore: 85,
    status: 'Approved',
    lastUpdated: '2026-08-15',
    updatedBy: 'A. Chen'
  },
  {
    id: 'DF-2026-005',
    sku: 'ELEC-PLC-CONTROLLER-S7',
    itemName: 'Programmable Automation PLC Controller S7-1500',
    category: 'Electrical & Instrumentation',
    uom: 'Units',
    region: 'Muscat HQ',
    period: '2026-Q3',
    historicalSalesQty: 190,
    baselineForecastQty: 210,
    seasonalityFactor: 1.08,
    promotionalUpliftQty: 20,
    consensusForecastQty: 247,
    forecastMethod: 'CONSENSUS',
    confidenceScore: 96,
    status: 'Approved',
    lastUpdated: '2026-08-17',
    updatedBy: 'M. Al-Harthy'
  }
];

const INITIAL_DEMAND_ANALYSIS: DemandAnalysisMetric[] = [
  {
    sku: 'VALVE-ISO-DN150',
    itemName: 'High-Pressure Cryogenic Ball Valve DN150',
    category: 'Valves & Flow Control',
    abcClass: 'A',
    xyzClass: 'X',
    mapePercent: 4.8,
    trackingSignal: 0.65,
    biasPercent: +1.2,
    velocityRank: 'Fast Mover',
    stockoutRisk: 'Low',
    avgMonthlyDemand: 215,
    demandVolatilityStdDev: 14.2
  },
  {
    sku: 'STEEL-ALLOY-BEAM-316L',
    itemName: 'Marine Grade Stainless Steel Beam 316L (12m)',
    category: 'Structural Metals',
    abcClass: 'A',
    xyzClass: 'Y',
    mapePercent: 7.2,
    trackingSignal: -1.2,
    biasPercent: -2.1,
    velocityRank: 'Fast Mover',
    stockoutRisk: 'Medium',
    avgMonthlyDemand: 298,
    demandVolatilityStdDev: 38.5
  },
  {
    sku: 'POLY-HDPE-PELLET-EX5',
    itemName: 'High-Density Polyethylene Resin Pellets',
    category: 'Polymers & Chemicals',
    abcClass: 'B',
    xyzClass: 'X',
    mapePercent: 5.1,
    trackingSignal: 0.3,
    biasPercent: +0.8,
    velocityRank: 'Fast Mover',
    stockoutRisk: 'Low',
    avgMonthlyDemand: 640,
    demandVolatilityStdDev: 25.0
  },
  {
    sku: 'PUMP-CENTRIF-50KW',
    itemName: 'Industrial Multistage Centrifugal Pump 50kW',
    category: 'Rotating Equipment',
    abcClass: 'A',
    xyzClass: 'Z',
    mapePercent: 14.5,
    trackingSignal: 2.8,
    biasPercent: +6.4,
    velocityRank: 'Medium Mover',
    stockoutRisk: 'High',
    avgMonthlyDemand: 30,
    demandVolatilityStdDev: 12.8
  },
  {
    sku: 'ELEC-PLC-CONTROLLER-S7',
    itemName: 'Programmable Automation PLC Controller S7-1500',
    category: 'Electrical & Instrumentation',
    abcClass: 'B',
    xyzClass: 'X',
    mapePercent: 3.9,
    trackingSignal: -0.4,
    biasPercent: -0.9,
    velocityRank: 'Fast Mover',
    stockoutRisk: 'Low',
    avgMonthlyDemand: 82,
    demandVolatilityStdDev: 6.4
  }
];

const INITIAL_CONSOLIDATION_BATCHES: DemandConsolidationBatch[] = [
  {
    id: 'BATCH-2026-Q3-01',
    batchNumber: 'CONSOL-2026-Q3-OM',
    period: '2026-Q3',
    targetFulfillmentMonth: '2026-09',
    totalSkus: 24,
    totalDemandUnits: 3840,
    estimatedPurchasingValue: 2450000,
    currency: 'OMR',
    status: 'Converted to PR',
    generatedPrNumber: 'PR-SCM-2026-0089',
    createdDate: '2026-08-12',
    regionsIncluded: ['Muscat HQ', 'Sohar Industrial', 'Salalah Freezone'],
    approvedBy: 'Eng. Tariq Al-Said (VP Operations)'
  },
  {
    id: 'BATCH-2026-Q4-01',
    batchNumber: 'CONSOL-2026-Q4-REG',
    period: '2026-Q4',
    targetFulfillmentMonth: '2026-11',
    totalSkus: 18,
    totalDemandUnits: 2950,
    estimatedPurchasingValue: 1820000,
    currency: 'OMR',
    status: 'Consolidated',
    createdDate: '2026-08-19',
    regionsIncluded: ['Muscat HQ', 'Dubai Logistics Hub', 'Abu Dhabi']
  }
];

const INITIAL_SUPPLY_FORECASTS: SupplyForecastItem[] = [
  {
    id: 'SF-01',
    supplierId: 'SUP-VALVETECH-DE',
    supplierName: 'ValveTech Precision GmbH (Germany)',
    componentSku: 'VALVE-ISO-DN150',
    componentName: 'High-Pressure Cryogenic Ball Valve DN150',
    committedMonthlyCapacity: 300,
    actualAvailableCapacity: 280,
    leadTimeDays: 45,
    minOrderQuantity: 50,
    constraintType: 'None',
    constraintSeverity: 'None',
    reliabilityRating: 98,
    plantOrigin: 'Stuttgart, Germany'
  },
  {
    id: 'SF-02',
    supplierId: 'SUP-NIPPON-STEEL-JP',
    supplierName: 'Nippon Marine Steel Corp (Japan)',
    componentSku: 'STEEL-ALLOY-BEAM-316L',
    componentName: 'Marine Grade Stainless Steel Beam 316L',
    committedMonthlyCapacity: 1200,
    actualAvailableCapacity: 950,
    leadTimeDays: 60,
    minOrderQuantity: 100,
    constraintType: 'Raw Material Scarcity',
    constraintSeverity: 'Moderate',
    reliabilityRating: 94,
    plantOrigin: 'Yokohama, Japan'
  },
  {
    id: 'SF-03',
    supplierId: 'SUP-SABIC-POLYMERS',
    supplierName: 'SABIC Petrochemical Global (KSA)',
    componentSku: 'POLY-HDPE-PELLET-EX5',
    componentName: 'High-Density Polyethylene Resin Pellets',
    committedMonthlyCapacity: 2500,
    actualAvailableCapacity: 2400,
    leadTimeDays: 14,
    minOrderQuantity: 250,
    constraintType: 'None',
    constraintSeverity: 'None',
    reliabilityRating: 99,
    plantOrigin: 'Jubail Industrial City, KSA'
  },
  {
    id: 'SF-04',
    supplierId: 'SUP-SIEMENS-AUTO',
    supplierName: 'Siemens Automation AG (Nuremberg)',
    componentSku: 'ELEC-PLC-CONTROLLER-S7',
    componentName: 'Programmable Automation PLC Controller S7-1500',
    committedMonthlyCapacity: 400,
    actualAvailableCapacity: 320,
    leadTimeDays: 30,
    minOrderQuantity: 20,
    constraintType: 'Production Bottleneck',
    constraintSeverity: 'Moderate',
    reliabilityRating: 96,
    plantOrigin: 'Nuremberg, Germany'
  }
];

const INITIAL_SUPPLY_ALLOCATIONS: SupplyAllocationRule[] = [
  {
    id: 'ALLOC-RULE-01',
    ruleCode: 'ALLOC-2026-VALVE',
    sku: 'VALVE-ISO-DN150',
    itemName: 'High-Pressure Cryogenic Ball Valve DN150',
    totalAvailableStock: 500,
    totalUnconstrainedDemand: 643,
    shortageUnits: 143,
    allocations: [
      {
        channel: 'OQ LNG Mega Expansion Project (Tier 1)',
        priority: 'Tier 1 Strategic',
        requestedQty: 350,
        allocatedQty: 350,
        fulfillmentRatePercent: 100
      },
      {
        channel: 'Petroleum Development Oman PDO (Tier 1)',
        priority: 'Tier 1 Strategic',
        requestedQty: 180,
        allocatedQty: 120,
        fulfillmentRatePercent: 66.7
      },
      {
        channel: 'Regional Maintenance & Spares Stock (Tier 2)',
        priority: 'Tier 2 Enterprise',
        requestedQty: 75,
        allocatedQty: 30,
        fulfillmentRatePercent: 40.0
      },
      {
        channel: 'Spot Commercial Market (Tier 3)',
        priority: 'Tier 3 Standard',
        requestedQty: 38,
        allocatedQty: 0,
        fulfillmentRatePercent: 0.0
      }
    ],
    status: 'Approved',
    effectiveDate: '2026-08-15'
  }
];

const INITIAL_SUPPLY_SCENARIOS: SupplyOptimizationScenario[] = [
  {
    id: 'SCEN-01',
    scenarioName: 'Direct Ocean Route + Hub Balancing',
    description: 'Bypasses secondary transshipment via Jebel Ali; routes directly into Sohar Port with safety stock consolidation.',
    serviceLevelTargetPercent: 96.5,
    estimatedTotalLandedCost: 4120000,
    inventoryHoldingCost: 280000,
    freightCost: 450000,
    stockoutPenaltyCost: 35000,
    suggestedTransfersCount: 6,
    costSavingsPercent: 8.4,
    status: 'Recommended'
  },
  {
    id: 'SCEN-02',
    scenarioName: 'Dual-Sourcing Air Freight Expedite',
    description: 'Splits 25% of critical automation controllers via Air Cargo to guarantee zero downtime for Muscat plant.',
    serviceLevelTargetPercent: 99.2,
    estimatedTotalLandedCost: 4380000,
    inventoryHoldingCost: 240000,
    freightCost: 710000,
    stockoutPenaltyCost: 0,
    suggestedTransfersCount: 2,
    costSavingsPercent: 2.1,
    status: 'Evaluated'
  }
];

const INITIAL_MRP_REQUIREMENTS: MrpNetRequirement[] = [
  {
    id: 'MRP-001',
    materialCode: 'RAW-ALLOY-BAR-316L',
    materialName: 'Stainless Steel Round Bar 316L 80mm',
    category: 'Raw Metals',
    uom: 'Meters',
    grossRequirementQty: 1200,
    scheduledReceiptsQty: 300,
    projectedOnHandQty: 250,
    safetyStockQty: 200,
    netRequirementQty: 850,
    plannedOrderReceiptQty: 900,
    plannedOrderReleaseDate: '2026-08-25',
    requiredDeliveryDate: '2026-10-15',
    leadTimeDays: 50,
    lotSizing: 'EOQ',
    primarySupplier: 'Nippon Marine Steel Corp',
    orderActionRequired: 'Create PO',
    actionStatus: 'Open'
  },
  {
    id: 'MRP-002',
    materialCode: 'SEAL-GRAPHITE-DN150',
    materialName: 'Spiral Wound Graphite Gasket DN150 Class 600',
    category: 'Gaskets & Seals',
    uom: 'Pieces',
    grossRequirementQty: 800,
    scheduledReceiptsQty: 200,
    projectedOnHandQty: 150,
    safetyStockQty: 100,
    netRequirementQty: 550,
    plannedOrderReceiptQty: 600,
    plannedOrderReleaseDate: '2026-08-28',
    requiredDeliveryDate: '2026-09-30',
    leadTimeDays: 32,
    lotSizing: 'POQ',
    primarySupplier: 'Flexitallic Gaskets Ltd (UK)',
    orderActionRequired: 'Create PO',
    actionStatus: 'Open'
  },
  {
    id: 'MRP-003',
    materialCode: 'BEARING-SKF-ROLLER-6214',
    materialName: 'Spherical Roller Bearing SKF 6214-2RS',
    category: 'Hardware & Bearings',
    uom: 'Units',
    grossRequirementQty: 350,
    scheduledReceiptsQty: 400,
    projectedOnHandQty: 120,
    safetyStockQty: 80,
    netRequirementQty: 0,
    plannedOrderReceiptQty: 0,
    plannedOrderReleaseDate: '—',
    requiredDeliveryDate: '2026-11-01',
    leadTimeDays: 20,
    lotSizing: 'L4L',
    primarySupplier: 'SKF Bearings Middle East',
    orderActionRequired: 'No Action',
    actionStatus: 'Dismissed'
  }
];

const INITIAL_INVENTORY_POLICIES: InventoryPlanningPolicy[] = [
  {
    sku: 'VALVE-ISO-DN150',
    itemName: 'High-Pressure Cryogenic Ball Valve DN150',
    leadTimeDays: 45,
    demandStdDevDaily: 1.8,
    serviceLevelTargetPercent: 98,
    calculatedSafetyStock: 42,
    reorderPoint: 280,
    economicOrderQuantity: 150,
    maxStockLevel: 450,
    currentStock: 195,
    stockHealth: 'Healthy'
  },
  {
    sku: 'STEEL-ALLOY-BEAM-316L',
    itemName: 'Marine Grade Stainless Steel Beam 316L',
    leadTimeDays: 60,
    demandStdDevDaily: 3.2,
    serviceLevelTargetPercent: 95,
    calculatedSafetyStock: 68,
    reorderPoint: 420,
    economicOrderQuantity: 300,
    maxStockLevel: 800,
    currentStock: 210,
    stockHealth: 'Understocked'
  },
  {
    sku: 'ELEC-PLC-CONTROLLER-S7',
    itemName: 'Programmable Automation PLC Controller S7-1500',
    leadTimeDays: 30,
    demandStdDevDaily: 0.9,
    serviceLevelTargetPercent: 99,
    calculatedSafetyStock: 25,
    reorderPoint: 110,
    economicOrderQuantity: 80,
    maxStockLevel: 220,
    currentStock: 140,
    stockHealth: 'Healthy'
  }
];

const INITIAL_PROCUREMENT_SCHEDULES: ProcurementScheduleItem[] = [
  {
    id: 'SCHED-01',
    scheduleRef: 'FCL-PO-2026-081',
    materialSku: 'STEEL-ALLOY-BEAM-316L',
    materialName: 'Marine Grade Stainless Steel Beam 316L',
    supplier: 'Nippon Marine Steel Corp',
    targetContainerCount: 4,
    orderVolumeUom: 'Metric Tons',
    orderQuantity: 320,
    orderDate: '2026-08-01',
    plannedDepartureDate: '2026-08-28',
    estimatedArrivalDate: '2026-09-26',
    poReference: 'PO-2026-00441',
    status: 'Confirmed By Supplier'
  },
  {
    id: 'SCHED-02',
    scheduleRef: 'FCL-PO-2026-082',
    materialSku: 'VALVE-ISO-DN150',
    materialName: 'High-Pressure Cryogenic Ball Valve DN150',
    supplier: 'ValveTech Precision GmbH',
    targetContainerCount: 2,
    orderVolumeUom: 'Units',
    orderQuantity: 180,
    orderDate: '2026-08-10',
    plannedDepartureDate: '2026-09-05',
    estimatedArrivalDate: '2026-09-28',
    poReference: 'PO-2026-00458',
    status: 'PO Issued'
  }
];

const INITIAL_FREIGHT_SHIPMENTS: FreightShipment[] = [
  {
    id: 'SHIP-2026-001',
    shipmentNumber: 'SHP-MAERSK-99410',
    bookingRef: 'BKG-MAE-882194',
    mode: 'Ocean Freight (FCL)',
    carrierName: 'Maersk Line A/S',
    vesselOrFlightNumber: 'Maersk Mc-Kinney Moller (Voy 2608W)',
    billOfLadingOrAwb: 'MAEU948210399',
    originPort: 'Hamburg (DEHAM)',
    originCountry: 'Germany',
    destinationPort: 'Sohar Port (OMSOH)',
    destinationHub: 'Sohar Industrial Hub RDC',
    containerCount: 3,
    containerNumbers: ['MSKU-8829104', 'MSKU-8829110', 'MSKU-8829125'],
    totalWeightKg: 42800,
    totalVolumeCbm: 172.5,
    departureDate: '2026-08-04',
    estimatedArrivalDate: '2026-08-26',
    status: 'In Transit / High Seas',
    currentLocationName: 'Gulf of Aden / Arabian Sea Corridor',
    gpsCoordinates: { lat: 14.821, lng: 52.418 },
    demurrageFreeDaysRemaining: 14,
    delayRisk: 'None',
    milestones: [
      { stage: 'Booked', location: 'Hamburg, Germany', timestamp: '2026-07-28 10:00', isCompleted: true },
      { stage: 'Cargo Picked Up', location: 'Stuttgart Works', timestamp: '2026-08-01 14:30', isCompleted: true },
      { stage: 'Vessel Departed', location: 'Hamburg Container Terminal (CTA)', timestamp: '2026-08-04 18:00', isCompleted: true },
      { stage: 'In Transit / High Seas', location: 'Arabian Sea Corridor', timestamp: '2026-08-20 08:00', isCompleted: true },
      { stage: 'Port of Arrival', location: 'Sohar Port Quay 3', timestamp: '2026-08-26 (ETA)', isCompleted: false },
      { stage: 'Customs Cleared', location: 'Oman Customs Bayan', timestamp: '2026-08-28 (Est)', isCompleted: false },
      { stage: 'Delivered', location: 'Sohar Industrial Hub RDC', timestamp: '2026-08-29 (Est)', isCompleted: false }
    ],
    temperatureMonitoring: {
      required: false,
      targetCelsius: 22,
      currentCelsius: 24.2,
      isExcursionAlert: false
    },
    cargoValue: 640000,
    freightCost: 18500,
    currency: 'OMR'
  },
  {
    id: 'SHIP-2026-002',
    shipmentNumber: 'SHP-EMIRATES-SKY-402',
    bookingRef: 'AWB-EK-993201',
    mode: 'Air Cargo',
    carrierName: 'Emirates SkyCargo',
    vesselOrFlightNumber: 'EK 9842 (Boeing 777-F)',
    billOfLadingOrAwb: '176-99320188',
    originPort: 'Frankfurt Airport (FRA)',
    originCountry: 'Germany',
    destinationPort: 'Muscat International Airport (MCT)',
    destinationHub: 'Muscat HQ Central Warehouse',
    containerCount: 1,
    containerNumbers: ['ULD-AKE-49102-EK'],
    totalWeightKg: 1840,
    totalVolumeCbm: 9.8,
    departureDate: '2026-08-20',
    estimatedArrivalDate: '2026-08-21',
    actualArrivalDate: '2026-08-21',
    status: 'Customs Cleared',
    currentLocationName: 'Muscat Airport Cargo Village Bay 4',
    gpsCoordinates: { lat: 23.593, lng: 58.281 },
    demurrageFreeDaysRemaining: 5,
    delayRisk: 'None',
    milestones: [
      { stage: 'Booked', location: 'Frankfurt Airport', timestamp: '2026-08-18 11:00', isCompleted: true },
      { stage: 'Cargo Picked Up', location: 'Siemens Logistics Center', timestamp: '2026-08-19 16:00', isCompleted: true },
      { stage: 'Vessel Departed', location: 'Frankfurt Runway 18', timestamp: '2026-08-20 22:15', isCompleted: true },
      { stage: 'Port of Arrival', location: 'Muscat Airport Cargo Terminal', timestamp: '2026-08-21 06:40', isCompleted: true },
      { stage: 'Customs Cleared', location: 'Bayan Green Channel MCT Air', timestamp: '2026-08-21 10:15', isCompleted: true },
      { stage: 'Dispatched to RDC', location: 'Muscat Express Highway', timestamp: '2026-08-21 14:00 (Est)', isCompleted: false },
      { stage: 'Delivered', location: 'Muscat HQ Central Warehouse', timestamp: '2026-08-21 16:30 (Est)', isCompleted: false }
    ],
    temperatureMonitoring: {
      required: true,
      targetCelsius: 20,
      currentCelsius: 19.8,
      isExcursionAlert: false
    },
    cargoValue: 185000,
    freightCost: 4200,
    currency: 'OMR'
  },
  {
    id: 'SHIP-2026-003',
    shipmentNumber: 'SHP-CMA-CGM-44109',
    bookingRef: 'BKG-CMA-773199',
    mode: 'Ocean Freight (FCL)',
    carrierName: 'CMA CGM Group',
    vesselOrFlightNumber: 'CMA CGM Palais Royal (Voy 048E)',
    billOfLadingOrAwb: 'CMACGM77319902',
    originPort: 'Shanghai Port (CNSHG)',
    originCountry: 'China',
    destinationPort: 'Salalah Port (OMSLH)',
    destinationHub: 'Salalah Freezone Distribution Center',
    containerCount: 6,
    containerNumbers: ['CMAU-1029481', 'CMAU-1029482', 'CMAU-1029483', 'CMAU-1029484', 'CMAU-1029485', 'CMAU-1029486'],
    totalWeightKg: 134000,
    totalVolumeCbm: 385.0,
    departureDate: '2026-08-10',
    estimatedArrivalDate: '2026-09-02',
    status: 'In Transit / High Seas',
    currentLocationName: 'Malacca Strait heading Indian Ocean',
    gpsCoordinates: { lat: 3.125, lng: 99.412 },
    demurrageFreeDaysRemaining: 21,
    delayRisk: 'Minor Delay (+2d)',
    delayReason: 'Typhoon deviation around Taiwan Strait',
    milestones: [
      { stage: 'Booked', location: 'Shanghai Port', timestamp: '2026-08-02 09:00', isCompleted: true },
      { stage: 'Cargo Picked Up', location: 'Kunshan Industrial Zone', timestamp: '2026-08-06 13:00', isCompleted: true },
      { stage: 'Vessel Departed', location: 'Yangshan Deepwater Port', timestamp: '2026-08-10 19:45', isCompleted: true },
      { stage: 'In Transit / High Seas', location: 'Malacca Strait', timestamp: '2026-08-21 04:00', isCompleted: true },
      { stage: 'Port of Arrival', location: 'Salalah Port Berth 5', timestamp: '2026-09-02 (ETA)', isCompleted: false },
      { stage: 'Customs Cleared', location: 'Salalah Freezone Customs', timestamp: '2026-09-04 (Est)', isCompleted: false },
      { stage: 'Delivered', location: 'Salalah Freezone DC', timestamp: '2026-09-05 (Est)', isCompleted: false }
    ],
    cargoValue: 920000,
    freightCost: 26800,
    currency: 'OMR'
  }
];

const INITIAL_TRANSPORT_TRIPS: TransportTrip[] = [
  {
    id: 'TRIP-2026-101',
    tripCode: 'TRIP-MCT-SOH-01',
    vehiclePlate: 'OM-88214-A',
    vehicleType: 'Heavy Flatbed 40ft',
    driverName: 'Hamood Al-Farsi',
    driverPhone: '+968 9912 3456',
    origin: 'Sohar Port Gate 2',
    destination: 'Muscat HQ Central Hub',
    stopsCount: 2,
    capacityUtilizationPercent: 92,
    departureTime: '2026-08-21 07:30',
    estimatedDeliveryTime: '2026-08-21 13:00',
    status: 'En Route',
    fuelCostEst: 48.5
  },
  {
    id: 'TRIP-2026-102',
    tripCode: 'TRIP-MCT-DXB-EXP',
    vehiclePlate: 'OM-77312-C',
    vehicleType: 'Refrigerated 24T',
    driverName: 'Salim Al-Hajri',
    driverPhone: '+968 9845 6789',
    origin: 'Muscat HQ Central Hub',
    destination: 'Dubai Logistics Hub (JAFZA)',
    stopsCount: 1,
    capacityUtilizationPercent: 88,
    departureTime: '2026-08-21 09:00',
    estimatedDeliveryTime: '2026-08-21 17:30',
    status: 'En Route',
    fuelCostEst: 95.0
  }
];

const INITIAL_CUSTOMS_DECLARATIONS: CustomsDeclaration[] = [
  {
    id: 'DEC-2026-001',
    declarationNumber: 'BAYAN-2026-OM-982140',
    type: 'Import Bayan',
    commercialInvoiceNumber: 'INV-DE-2026-4418',
    billOfLading: 'MAEU948210399',
    importerExporterName: 'Artify Global Technologies LLC (CR: 1098421)',
    customsPortCode: 'OM-SOH-SEA',
    customsPortName: 'Sohar Port Customs Gate',
    submissionDate: '2026-08-19',
    status: 'Duty Paid',
    totalCifValue: 640000,
    totalCustomsDuty: 32000, // 5% GCC Unified Tariff
    totalVat: 33600, // 5% VAT on CIF + Duty
    totalPayable: 65600,
    currency: 'OMR',
    documentsAttached: [
      { type: 'Commercial Invoice', fileName: 'Commercial_Invoice_INV-4418.pdf', verified: true },
      { type: 'Packing List', fileName: 'Packing_List_3x40ft_FCL.pdf', verified: true },
      { type: 'Certificate of Origin (COO)', fileName: 'EU_Chamber_COO_Stuttgart.pdf', verified: true },
      { type: 'Bill of Lading', fileName: 'Original_Sea_Waybill_MAEU.pdf', verified: true }
    ],
    items: [
      {
        lineId: 'LINE-01',
        hsCode: '8481.80.90',
        description: 'Industrial Cryogenic Ball Valves & Pressure Regulators',
        countryOfOrigin: 'Germany (DE)',
        quantity: 480,
        uom: 'Units',
        cifValue: 420000,
        dutyRatePercent: 5.0,
        calculatedDutyAmount: 21000,
        vatRatePercent: 5.0,
        vatAmount: 22050
      },
      {
        lineId: 'LINE-02',
        hsCode: '7308.90.00',
        description: 'Structural Stainless Steel Alloy Assemblies',
        countryOfOrigin: 'Germany (DE)',
        quantity: 220,
        uom: 'Units',
        cifValue: 220000,
        dutyRatePercent: 5.0,
        calculatedDutyAmount: 11000,
        vatRatePercent: 5.0,
        vatAmount: 11550
      }
    ],
    inspectionType: 'Green Channel (Immediate)',
    dutyPaymentRef: 'EPAY-OM-CUSTOMS-882194'
  },
  {
    id: 'DEC-2026-002',
    declarationNumber: 'BAYAN-2026-OM-982141',
    type: 'Export Bayan',
    commercialInvoiceNumber: 'EXP-INV-2026-0182',
    billOfLading: 'EX-BL-2026-991',
    importerExporterName: 'Artify Global Technologies LLC',
    customsPortCode: 'OM-MCT-AIR',
    customsPortName: 'Muscat Airport Air Cargo Bayan',
    submissionDate: '2026-08-20',
    status: 'Submitted to Bayan',
    totalCifValue: 145000,
    totalCustomsDuty: 0, // Export 0% duty
    totalVat: 0,
    totalPayable: 0,
    currency: 'OMR',
    documentsAttached: [
      { type: 'Commercial Invoice', fileName: 'Export_Invoice_0182.pdf', verified: true },
      { type: 'Packing List', fileName: 'Air_Pallet_Packing_List.pdf', verified: true },
      { type: 'Certificate of Origin (COO)', fileName: 'Oman_Chamber_Of_Commerce_COO.pdf', verified: true }
    ],
    items: [
      {
        lineId: 'LINE-01',
        hsCode: '8537.10.00',
        description: 'Engineered Industrial SCADA Telemetry Control Panels',
        countryOfOrigin: 'Oman (OM)',
        quantity: 12,
        uom: 'Units',
        cifValue: 145000,
        dutyRatePercent: 0.0,
        calculatedDutyAmount: 0,
        vatRatePercent: 0.0,
        vatAmount: 0,
        exemptionCode: 'EX-OM-MANUF-001'
      }
    ],
    inspectionType: 'Green Channel (Immediate)'
  }
];

const INITIAL_TRADE_COMPLIANCE_RECORDS: TradeComplianceRecord[] = [
  {
    id: 'COMP-01',
    checkDate: '2026-08-20',
    partnerName: 'ValveTech Precision GmbH (Germany)',
    partnerType: 'Supplier',
    sanctionListScreening: 'Clear',
    dualUseGoodsCheck: 'Compliant',
    embargoCountryCheck: 'Pass',
    overallComplianceStatus: 'Approved',
    screenedBy: 'Automated Global Sanctions API (Dow Jones Risk & Compliance)'
  },
  {
    id: 'COMP-02',
    checkDate: '2026-08-19',
    partnerName: 'Nippon Marine Steel Corp (Japan)',
    partnerType: 'Supplier',
    sanctionListScreening: 'Clear',
    dualUseGoodsCheck: 'Compliant',
    embargoCountryCheck: 'Pass',
    overallComplianceStatus: 'Approved',
    screenedBy: 'Automated Global Sanctions API'
  },
  {
    id: 'COMP-03',
    checkDate: '2026-08-18',
    partnerName: 'Caspian Petro-Equipment FZE (Freezone)',
    partnerType: 'Customer',
    sanctionListScreening: 'Requires Review',
    dualUseGoodsCheck: 'Requires Export License',
    embargoCountryCheck: 'Pass',
    overallComplianceStatus: 'Review Required',
    screenedBy: 'Legal & Trade Compliance Desk'
  }
];

const INITIAL_WAREHOUSE_HUBS: WarehousePlanHub[] = [
  {
    id: 'HUB-MCT',
    hubCode: 'RDC-MCT-01',
    hubName: 'Muscat Central Distribution & Spares Hub',
    city: 'Muscat (Rusayl Industrial)',
    totalPalletCapacity: 12000,
    occupiedPalletPositions: 9840,
    utilizationPercent: 82.0,
    crossDockBaysAvailable: 6,
    activeInboundTrailers: 4,
    activeOutboundDispatches: 9,
    fastPickEfficiencyIndex: 96.2
  },
  {
    id: 'HUB-SOH',
    hubCode: 'RDC-SOH-02',
    hubName: 'Sohar Freezone Deepwater Cross-Dock Center',
    city: 'Sohar Industrial Port',
    totalPalletCapacity: 24000,
    occupiedPalletPositions: 18720,
    utilizationPercent: 78.0,
    crossDockBaysAvailable: 12,
    activeInboundTrailers: 8,
    activeOutboundDispatches: 14,
    fastPickEfficiencyIndex: 94.8
  },
  {
    id: 'HUB-SLH',
    hubCode: 'RDC-SLH-03',
    hubName: 'Salalah Port Gateway Hub',
    city: 'Salalah Freezone',
    totalPalletCapacity: 16000,
    occupiedPalletPositions: 11200,
    utilizationPercent: 70.0,
    crossDockBaysAvailable: 8,
    activeInboundTrailers: 3,
    activeOutboundDispatches: 5,
    fastPickEfficiencyIndex: 91.5
  },
  {
    id: 'HUB-DXB',
    hubCode: 'RDC-DXB-04',
    hubName: 'Dubai Logistics Hub (JAFZA Regional)',
    city: 'Dubai (Jebel Ali Free Zone)',
    totalPalletCapacity: 18000,
    occupiedPalletPositions: 15480,
    utilizationPercent: 86.0,
    crossDockBaysAvailable: 10,
    activeInboundTrailers: 6,
    activeOutboundDispatches: 12,
    fastPickEfficiencyIndex: 97.4
  }
];

const INITIAL_REPLENISHMENT_ORDERS: DistributionReplenishmentOrder[] = [
  {
    id: 'REPL-2026-001',
    replenishmentOrderNumber: 'REP-SOH-MCT-0941',
    sourceHub: 'Sohar Freezone Deepwater Cross-Dock Center',
    destinationDepot: 'Muscat Central Distribution & Spares Hub',
    requestedDate: '2026-08-20',
    dispatchDate: '2026-08-21',
    totalPallets: 48,
    skuCount: 14,
    priority: 'Urgent',
    status: 'In Transit'
  },
  {
    id: 'REPL-2026-002',
    replenishmentOrderNumber: 'REP-MCT-SLH-0942',
    sourceHub: 'Muscat Central Distribution & Spares Hub',
    destinationDepot: 'Salalah Port Gateway Hub',
    requestedDate: '2026-08-21',
    dispatchDate: '2026-08-22',
    totalPallets: 32,
    skuCount: 8,
    priority: 'Standard Replenishment',
    status: 'Staged for Loading'
  }
];

const INITIAL_DELIVERY_RECORDS: DeliveryShipmentRecord[] = [
  {
    id: 'DELIV-001',
    dispatchId: 'DISP-2026-8812',
    customerOrderRef: 'SO-2026-00918',
    customerName: 'Oman LNG Development SAOC',
    deliveryAddress: 'Sur Industrial Complex, Qalhat Terminal Gate 4',
    city: 'Sur, Oman',
    assignedDriver: 'Nasser Al-Amri',
    driverPhone: '+968 9123 4567',
    vehiclePlate: 'OM-99214-B',
    scheduledTimeWindow: '08:00 - 12:00',
    actualDeliveryTime: '2026-08-21 10:45',
    status: 'Delivered',
    epodSignatureCaptured: true,
    recipientName: 'Eng. Khalid Al-Araimi (Lead Mechanical)',
    deliveryNotes: 'All 12 Cryogenic valves received with inspection certificates intact.'
  },
  {
    id: 'DELIV-002',
    dispatchId: 'DISP-2026-8813',
    customerOrderRef: 'SO-2026-00922',
    customerName: 'Petroleum Development Oman (PDO)',
    deliveryAddress: 'Mina Al Fahal Refinery Depot Berth 2',
    city: 'Muscat, Oman',
    assignedDriver: 'Ahmed Al-Shehhi',
    driverPhone: '+968 9234 5678',
    vehiclePlate: 'OM-44102-D',
    scheduledTimeWindow: '13:00 - 16:00',
    status: 'Out for Delivery',
    epodSignatureCaptured: false,
    deliveryNotes: 'Gate security permit pre-cleared via PDO portal.'
  }
];

export const ScmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [demandForecasts, setDemandForecasts] = useState<DemandForecastItem[]>(INITIAL_DEMAND_FORECASTS);
  const [demandAnalysis, setDemandAnalysis] = useState<DemandAnalysisMetric[]>(INITIAL_DEMAND_ANALYSIS);
  const [consolidationBatches, setConsolidationBatches] = useState<DemandConsolidationBatch[]>(INITIAL_CONSOLIDATION_BATCHES);
  const [supplyForecasts, setSupplyForecasts] = useState<SupplyForecastItem[]>(INITIAL_SUPPLY_FORECASTS);
  const [supplyAllocations, setSupplyAllocations] = useState<SupplyAllocationRule[]>(INITIAL_SUPPLY_ALLOCATIONS);
  const [supplyScenarios, setSupplyScenarios] = useState<SupplyOptimizationScenario[]>(INITIAL_SUPPLY_SCENARIOS);
  const [mrpRequirements, setMrpRequirements] = useState<MrpNetRequirement[]>(INITIAL_MRP_REQUIREMENTS);
  const [inventoryPolicies, setInventoryPolicies] = useState<InventoryPlanningPolicy[]>(INITIAL_INVENTORY_POLICIES);
  const [procurementSchedules, setProcurementSchedules] = useState<ProcurementScheduleItem[]>(INITIAL_PROCUREMENT_SCHEDULES);
  const [freightShipments, setFreightShipments] = useState<FreightShipment[]>(INITIAL_FREIGHT_SHIPMENTS);
  const [transportTrips, setTransportTrips] = useState<TransportTrip[]>(INITIAL_TRANSPORT_TRIPS);
  const [customsDeclarations, setCustomsDeclarations] = useState<CustomsDeclaration[]>(INITIAL_CUSTOMS_DECLARATIONS);
  const [tradeComplianceRecords, setTradeComplianceRecords] = useState<TradeComplianceRecord[]>(INITIAL_TRADE_COMPLIANCE_RECORDS);
  const [warehouseHubs, setWarehouseHubs] = useState<WarehousePlanHub[]>(INITIAL_WAREHOUSE_HUBS);
  const [replenishmentOrders, setReplenishmentOrders] = useState<DistributionReplenishmentOrder[]>(INITIAL_REPLENISHMENT_ORDERS);
  const [deliveryRecords, setDeliveryRecords] = useState<DeliveryShipmentRecord[]>(INITIAL_DELIVERY_RECORDS);

  const [selectedShipment, setSelectedShipment] = useState<FreightShipment | null>(INITIAL_FREIGHT_SHIPMENTS[0]);
  const [currency] = useState<string>('OMR');

  // KPI calculations
  const [kpiMetrics, setKpiMetrics] = useState<ScmKpiMetrics>({
    onTimeInFullPercent: 94.8,
    totalActiveShipments: INITIAL_FREIGHT_SHIPMENTS.length,
    inboundContainerCount: INITIAL_FREIGHT_SHIPMENTS.reduce((sum, s) => sum + s.containerCount, 0),
    customsAvgClearanceDays: 2.1,
    inventoryDwellDaysAvg: 18.4,
    totalLandedCostSavingsPercent: 8.4,
    freightCostPerUnitAvg: 24.5,
    supplyChainRiskScore: 12
  });

  const refreshScmMetrics = () => {
    const totalContainers = freightShipments.reduce((sum, s) => sum + s.containerCount, 0);
    const deliveredCount = deliveryRecords.filter(d => d.status === 'Delivered').length;
    const otif = deliveryRecords.length > 0 ? (deliveredCount / deliveryRecords.length) * 100 : 94.8;

    setKpiMetrics(prev => ({
      ...prev,
      totalActiveShipments: freightShipments.length,
      inboundContainerCount: totalContainers,
      onTimeInFullPercent: Math.round(otif * 10) / 10
    }));
  };

  // 12.01 Actions
  const addDemandForecast = (item: Omit<DemandForecastItem, 'id' | 'lastUpdated'>) => {
    const newItem: DemandForecastItem = {
      ...item,
      id: `DF-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setDemandForecasts(prev => [newItem, ...prev]);
  };

  const updateDemandForecast = (id: string, updates: Partial<DemandForecastItem>) => {
    setDemandForecasts(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }
          : item
      )
    );
  };

  const recalculateStatisticalForecast = (id: string, method: DemandForecastItem['forecastMethod'], seasonalityFactor: number = 1.1) => {
    setDemandForecasts(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        let baseline = item.baselineForecastQty;
        if (method === 'HOLT_WINTERS') {
          baseline = Math.round(item.historicalSalesQty * seasonalityFactor * 1.08);
        } else if (method === 'EXPONENTIAL_SMOOTHING') {
          baseline = Math.round(item.historicalSalesQty * 0.7 + item.baselineForecastQty * 0.3);
        } else if (method === 'MOVING_AVERAGE') {
          baseline = Math.round(item.historicalSalesQty * 1.02);
        } else if (method === 'MACHINE_LEARNING') {
          baseline = Math.round(item.historicalSalesQty * seasonalityFactor * 1.12);
        }
        const consensus = baseline + item.promotionalUpliftQty;
        return {
          ...item,
          forecastMethod: method,
          seasonalityFactor,
          baselineForecastQty: baseline,
          consensusForecastQty: consensus,
          confidenceScore: method === 'MACHINE_LEARNING' ? 95 : 91,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      })
    );
  };

  const createConsolidationBatch = (period: string, regions: string[]): DemandConsolidationBatch => {
    const filtered = demandForecasts.filter(df => regions.includes(df.region) && df.period === period);
    const totalUnits = filtered.reduce((acc, curr) => acc + curr.consensusForecastQty, 0);
    const estimatedValue = totalUnits * 650; // average blended unit cost

    const newBatch: DemandConsolidationBatch = {
      id: `BATCH-${Date.now()}`,
      batchNumber: `CONSOL-${period}-${regions.length}R`,
      period,
      targetFulfillmentMonth: period.includes('Q3') ? '2026-09' : '2026-12',
      totalSkus: filtered.length || 15,
      totalDemandUnits: totalUnits || 2800,
      estimatedPurchasingValue: estimatedValue || 1820000,
      currency: 'OMR',
      status: 'Consolidated',
      createdDate: new Date().toISOString().split('T')[0],
      regionsIncluded: regions
    };

    setConsolidationBatches(prev => [newBatch, ...prev]);
    return newBatch;
  };

  const convertConsolidationToPr = (batchId: string) => {
    const prNumber = `PR-SCM-2026-${Math.floor(1000 + mockRandom() * 9000)}`;
    setConsolidationBatches(prev =>
      prev.map(b =>
        b.id === batchId
          ? {
              ...b,
              status: 'Converted to PR',
              generatedPrNumber: prNumber,
              approvedBy: 'Auto-Consolidation Procurement Bridge'
            }
          : b
      )
    );
  };

  // 12.02 Actions
  const updateSupplyAllocationQty = (ruleId: string, channelIndex: number, newAllocatedQty: number) => {
    setSupplyAllocations(prev =>
      prev.map(rule => {
        if (rule.id !== ruleId) return rule;
        const updatedChannels = [...rule.allocations];
        const target = updatedChannels[channelIndex];
        if (target) {
          target.allocatedQty = newAllocatedQty;
          target.fulfillmentRatePercent = Math.min(100, Math.round((newAllocatedQty / (target.requestedQty || 1)) * 100));
        }
        return {
          ...rule,
          allocations: updatedChannels
        };
      })
    );
  };

  const adoptSupplyOptimizationScenario = (scenarioId: string) => {
    setSupplyScenarios(prev =>
      prev.map(sc => ({
        ...sc,
        status: sc.id === scenarioId ? 'Adopted' : 'Evaluated'
      }))
    );
  };

  // 12.03 Actions
  const generatePurchaseOrderFromMrp = (mrpId: string): string => {
    const poNumber = `PO-2026-${Math.floor(10000 + mockRandom() * 90000)}`;
    setMrpRequirements(prev =>
      prev.map(item =>
        item.id === mrpId
          ? { ...item, actionStatus: 'PO Generated', orderActionRequired: 'No Action' }
          : item
      )
    );
    return poNumber;
  };

  const updateInventorySafetyLevel = (sku: string, serviceLevelPercent: number) => {
    setInventoryPolicies(prev =>
      prev.map(policy => {
        if (policy.sku !== sku) return policy;
        // Normal distribution Z score approximation: 95% = 1.65, 98% = 2.05, 99% = 2.33
        const zScore = serviceLevelPercent >= 99 ? 2.33 : serviceLevelPercent >= 98 ? 2.05 : 1.65;
        const newSafetyStock = Math.round(zScore * policy.demandStdDevDaily * Math.sqrt(policy.leadTimeDays));
        const newRop = Math.round(policy.leadTimeDays * (policy.demandStdDevDaily * 3) + newSafetyStock);
        return {
          ...policy,
          serviceLevelTargetPercent: serviceLevelPercent,
          calculatedSafetyStock: newSafetyStock,
          reorderPoint: newRop,
          stockHealth: policy.currentStock < newSafetyStock ? 'Understocked' : 'Healthy'
        };
      })
    );
  };

  // 12.04 Actions
  const createFreightShipment = (shipment: Omit<FreightShipment, 'id' | 'shipmentNumber' | 'milestones'>): FreightShipment => {
    const newId = `SHIP-${Date.now()}`;
    const shpNumber = `SHP-${shipment.carrierName.split(' ')[0].toUpperCase()}-${Math.floor(10000 + mockRandom() * 90000)}`;
    const newShipment: FreightShipment = {
      ...shipment,
      id: newId,
      shipmentNumber: shpNumber,
      milestones: [
        { stage: 'Booked', location: shipment.originPort, timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16), isCompleted: true },
        { stage: 'Cargo Picked Up', location: `${shipment.originCountry} Port Depot`, timestamp: 'Scheduled', isCompleted: false },
        { stage: 'Vessel Departed', location: shipment.originPort, timestamp: shipment.departureDate, isCompleted: false },
        { stage: 'Port of Arrival', location: shipment.destinationPort, timestamp: shipment.estimatedArrivalDate, isCompleted: false },
        { stage: 'Customs Cleared', location: 'Bayan Terminal', timestamp: 'Pending', isCompleted: false },
        { stage: 'Delivered', location: shipment.destinationHub, timestamp: 'Pending', isCompleted: false }
      ]
    };
    setFreightShipments(prev => [newShipment, ...prev]);
    setSelectedShipment(newShipment);
    refreshScmMetrics();
    return newShipment;
  };

  const updateShipmentStatus = (shipmentId: string, newStatus: ShipmentTransitStatus, note?: string) => {
    setFreightShipments(prev =>
      prev.map(shp => {
        if (shp.id !== shipmentId) return shp;
        const updatedMilestones = shp.milestones.map(m => {
          if (m.stage === newStatus) {
            return {
              ...m,
              isCompleted: true,
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
              notes: note || m.notes
            };
          }
          return m;
        });

        const updated = {
          ...shp,
          status: newStatus,
          milestones: updatedMilestones
        };
        if (selectedShipment?.id === shipmentId) {
          setSelectedShipment(updated);
        }
        return updated;
      })
    );
  };

  const selectShipment = (shipment: FreightShipment | null) => {
    setSelectedShipment(shipment);
  };

  // 12.05 Actions
  const createCustomsDeclaration = (dec: Omit<CustomsDeclaration, 'id' | 'declarationNumber' | 'submissionDate'>): CustomsDeclaration => {
    const newId = `DEC-${Date.now()}`;
    const decNumber = `BAYAN-2026-OM-${Math.floor(100000 + mockRandom() * 900000)}`;
    const newDec: CustomsDeclaration = {
      ...dec,
      id: newId,
      declarationNumber: decNumber,
      submissionDate: new Date().toISOString().split('T')[0]
    };
    setCustomsDeclarations(prev => [newDec, ...prev]);
    return newDec;
  };

  const updateCustomsStatus = (declarationId: string, status: CustomsStatus) => {
    setCustomsDeclarations(prev =>
      prev.map(d =>
        d.id === declarationId
          ? {
              ...d,
              status,
              dutyPaymentRef: status === 'Duty Paid' ? `EPAY-OM-CUSTOMS-${Math.floor(100000 + mockRandom() * 900000)}` : d.dutyPaymentRef
            }
          : d
      )
    );
  };

  const runTradeComplianceScreening = (partnerName: string, partnerType: TradeComplianceRecord['partnerType']): TradeComplianceRecord => {
    const newRec: TradeComplianceRecord = {
      id: `COMP-${Date.now()}`,
      checkDate: new Date().toISOString().split('T')[0],
      partnerName,
      partnerType,
      sanctionListScreening: 'Clear',
      dualUseGoodsCheck: 'Compliant',
      embargoCountryCheck: 'Pass',
      overallComplianceStatus: 'Approved',
      screenedBy: 'Automated Global Trade Compliance Engine (OFAC, EU, UN, GCC)'
    };
    setTradeComplianceRecords(prev => [newRec, ...prev]);
    return newRec;
  };

  // 12.06 Actions
  const createReplenishmentOrder = (order: Omit<DistributionReplenishmentOrder, 'id' | 'replenishmentOrderNumber'>) => {
    const newId = `REPL-${Date.now()}`;
    const refNum = `REP-${order.sourceHub.slice(0, 3).toUpperCase()}-${order.destinationDepot.slice(0, 3).toUpperCase()}-${Math.floor(1000 + mockRandom() * 9000)}`;
    const newOrder: DistributionReplenishmentOrder = {
      ...order,
      id: newId,
      replenishmentOrderNumber: refNum
    };
    setReplenishmentOrders(prev => [newOrder, ...prev]);
  };

  const updateReplenishmentStatus = (id: string, status: DistributionReplenishmentOrder['status']) => {
    setReplenishmentOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, status } : o))
    );
  };

  const completeDeliveryEpod = (deliveryId: string, recipientName: string, notes?: string) => {
    setDeliveryRecords(prev =>
      prev.map(del =>
        del.id === deliveryId
          ? {
              ...del,
              status: 'Delivered',
              epodSignatureCaptured: true,
              recipientName,
              actualDeliveryTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
              deliveryNotes: notes || del.deliveryNotes
            }
          : del
      )
    );
    refreshScmMetrics();
  };

  return (
    <ScmStoreContext.Provider
      value={{
        demandForecasts,
        demandAnalysis,
        consolidationBatches,
        supplyForecasts,
        supplyAllocations,
        supplyScenarios,
        mrpRequirements,
        inventoryPolicies,
        procurementSchedules,
        freightShipments,
        transportTrips,
        customsDeclarations,
        tradeComplianceRecords,
        warehouseHubs,
        replenishmentOrders,
        deliveryRecords,
        kpiMetrics,
        selectedShipment,
        currency,
        addDemandForecast,
        updateDemandForecast,
        recalculateStatisticalForecast,
        createConsolidationBatch,
        convertConsolidationToPr,
        updateSupplyAllocationQty,
        adoptSupplyOptimizationScenario,
        generatePurchaseOrderFromMrp,
        updateInventorySafetyLevel,
        createFreightShipment,
        updateShipmentStatus,
        selectShipment,
        createCustomsDeclaration,
        updateCustomsStatus,
        runTradeComplianceScreening,
        createReplenishmentOrder,
        updateReplenishmentStatus,
        completeDeliveryEpod,
        refreshScmMetrics
      }}
    >
      {children}
    </ScmStoreContext.Provider>
  );
};

export const useScmStore = (): ScmStoreContextType => {
  const context = useContext(ScmStoreContext);
  if (!context) {
    throw new Error('useScmStore must be used within an ScmProvider');
  }
  return context;
};

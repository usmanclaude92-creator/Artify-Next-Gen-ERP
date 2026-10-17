// ==========================================
// ARTIFY FINANCIAL ECOSYSTEM (AFE) — MODULE 12: SUPPLY CHAIN MANAGEMENT (SCM)
// 12.04.05 — Supply Chain Network Visualization Component
// Interactive Visual Topology: Warehouse Hubs, Transit Nodes, Multimodal Arcs & Real-Time Delivery Status
// ==========================================

import React, { useState, useMemo, useEffect } from 'react';
import { useScmStore } from '../../services/scmStore';
import { FreightShipment, TransportTrip, WarehousePlanHub, DeliveryShipmentRecord } from '../../types';
import {
  Navigation,
  Truck,
  Ship,
  Plane,
  Anchor,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Eye,
  FileText,
  Compass,
  Thermometer,
  Shield,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  Activity,
  Boxes,
  Warehouse,
  Radio,
  Gauge,
  Sparkles,
  RefreshCw,
  Play,
  Pause,
  ExternalLink,
  ChevronRight,
  Info,
  DollarSign,
  Fuel,
  Phone,
  Crosshair,
  PackageCheck
} from 'lucide-react';

// Network Node Interfaces
export type NetworkNodeType = 'WAREHOUSE_RDC' | 'SEAPORT' | 'AIRPORT' | 'CUSTOMS_BORDER' | 'CUSTOMER_SITE' | 'OVERLAND_HUB';

export interface NetworkNode {
  id: string;
  code: string;
  name: string;
  shortName: string;
  type: NetworkNodeType;
  region: 'Domestic (Oman)' | 'GCC Regional' | 'Europe' | 'Asia-Pacific';
  country: string;
  city: string;
  x: number; // 0-100% SVG canvas coordinate
  y: number; // 0-100% SVG canvas coordinate
  capacityPallets?: number;
  occupancyPercent?: number;
  crossDockBays?: number;
  customsTerminalCode?: string;
  activeShipmentsInbound: number;
  activeShipmentsOutbound: number;
  operationalStatus: 'Optimal' | 'High Congestion' | 'Weather Advisory' | 'Clear';
  throughputIndex: number; // 0-100
  notes?: string;
}

export interface NetworkArc {
  id: string;
  arcCode: string;
  fromNodeId: string;
  toNodeId: string;
  mode: 'Ocean' | 'Air' | 'Road' | 'Last-Mile';
  distanceKm: number;
  avgTransitHours: number;
  status: 'Active Flow' | 'Delayed' | 'Congested' | 'Scheduled';
  activeShipmentsCount: number;
  curvature?: number; // for bezier arc rendering
}

export const SupplyChainNetworkMap: React.FC = () => {
  const {
    freightShipments,
    transportTrips,
    warehouseHubs,
    deliveryRecords,
    selectedShipment,
    selectShipment,
    updateShipmentStatus,
    currency
  } = useScmStore();

  // Viewport & Filter States
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [selectedArc, setSelectedArc] = useState<NetworkArc | null>(null);
  const [activeShipmentEntity, setActiveShipmentEntity] = useState<FreightShipment | null>(selectedShipment || freightShipments[0] || null);
  const [filterMode, setFilterMode] = useState<'ALL' | 'Ocean' | 'Air' | 'Road' | 'Last-Mile'>('ALL');
  const [filterNodeType, setFilterNodeType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLiveTelemetrySimulating, setIsLiveTelemetrySimulating] = useState<boolean>(true);
  const [telemetryTick, setTelemetryTick] = useState<number>(0);
  const [activeLayer, setActiveLayer] = useState<'all' | 'warehouses' | 'transit' | 'shipments'>('all');
  const [showTelemetryFeed, setShowTelemetryFeed] = useState<boolean>(true);

  // Live Pulse Interval for Real-Time Fleet Animation
  useEffect(() => {
    if (!isLiveTelemetrySimulating) return;
    const interval = setInterval(() => {
      setTelemetryTick(prev => (prev + 1) % 100);
    }, 1500);
    return () => clearInterval(interval);
  }, [isLiveTelemetrySimulating]);

  // Master Network Nodes Database (Global Suppliers -> Regional Hubs -> Domestic Warehouses -> Customer Sites)
  const networkNodes: NetworkNode[] = useMemo(() => [
    // 1. Global Origin Gateways (International Transit Nodes)
    {
      id: 'NODE-DEHAM',
      code: 'DEHAM',
      name: 'Hamburg Port Container Terminal (CTA)',
      shortName: 'Hamburg CTA',
      type: 'SEAPORT',
      region: 'Europe',
      country: 'Germany',
      city: 'Hamburg',
      x: 15,
      y: 22,
      customsTerminalCode: 'DE-HAM-SEA',
      activeShipmentsInbound: 2,
      activeShipmentsOutbound: 4,
      operationalStatus: 'Clear',
      throughputIndex: 96,
      notes: 'Main European heavy industrial machinery & steel consolidation gate.'
    },
    {
      id: 'NODE-FRA',
      code: 'FRA-AIR',
      name: 'Frankfurt International Airport Cargo City',
      shortName: 'Frankfurt FRA',
      type: 'AIRPORT',
      region: 'Europe',
      country: 'Germany',
      city: 'Frankfurt',
      x: 18,
      y: 38,
      customsTerminalCode: 'DE-FRA-AIR',
      activeShipmentsInbound: 1,
      activeShipmentsOutbound: 3,
      operationalStatus: 'Optimal',
      throughputIndex: 98,
      notes: 'Express cold-chain and precision automation air dispatch hub.'
    },
    {
      id: 'NODE-CNSHG',
      code: 'CNSHG',
      name: 'Shanghai Yangshan Deepwater Terminal',
      shortName: 'Shanghai Port',
      type: 'SEAPORT',
      region: 'Asia-Pacific',
      country: 'China',
      city: 'Shanghai',
      x: 88,
      y: 32,
      customsTerminalCode: 'CN-SHG-SEA',
      activeShipmentsInbound: 1,
      activeShipmentsOutbound: 7,
      operationalStatus: 'Weather Advisory',
      throughputIndex: 89,
      notes: 'Typhoon season alternate routing active via southern Malacca corridor.'
    },

    // 2. GCC Regional Gateway
    {
      id: 'NODE-DXB-JAFZA',
      code: 'RDC-DXB-04',
      name: 'Dubai Jebel Ali Free Zone Logistics Hub (JAFZA)',
      shortName: 'Dubai JAFZA Hub',
      type: 'WAREHOUSE_RDC',
      region: 'GCC Regional',
      country: 'UAE',
      city: 'Dubai',
      x: 52,
      y: 30,
      capacityPallets: 18000,
      occupancyPercent: 86.0,
      crossDockBays: 10,
      customsTerminalCode: 'AE-DXB-JAFZA',
      activeShipmentsInbound: 5,
      activeShipmentsOutbound: 8,
      operationalStatus: 'Optimal',
      throughputIndex: 97,
      notes: 'Cross-border bonded transit hub feeding Oman northern border routes.'
    },

    // 3. Domestic Core Warehouses & Primary Maritime Gateways (Oman)
    {
      id: 'NODE-OMSOH',
      code: 'OMSOH-SEA',
      name: 'Sohar Industrial Port Terminal Quay 3',
      shortName: 'Sohar Deepwater Port',
      type: 'SEAPORT',
      region: 'Domestic (Oman)',
      country: 'Oman',
      city: 'Sohar',
      x: 55,
      y: 44,
      customsTerminalCode: 'OM-SOH-SEA',
      activeShipmentsInbound: 4,
      activeShipmentsOutbound: 6,
      operationalStatus: 'Optimal',
      throughputIndex: 95,
      notes: 'Deepwater container terminal with direct rail & highway links to RDC.'
    },
    {
      id: 'NODE-HUB-SOH',
      code: 'RDC-SOH-02',
      name: 'Sohar Freezone Deepwater Cross-Dock Center',
      shortName: 'Sohar RDC Hub',
      type: 'WAREHOUSE_RDC',
      region: 'Domestic (Oman)',
      country: 'Oman',
      city: 'Sohar Freezone',
      x: 59,
      y: 47,
      capacityPallets: 24000,
      occupancyPercent: 78.0,
      crossDockBays: 12,
      customsTerminalCode: 'OM-SOH-FZ',
      activeShipmentsInbound: 6,
      activeShipmentsOutbound: 9,
      operationalStatus: 'Optimal',
      throughputIndex: 95,
      notes: 'Primary bulk import staging, heavy steel yard and break-bulk facility.'
    },
    {
      id: 'NODE-MCT-AIR',
      code: 'OM-MCT-AIR',
      name: 'Muscat Airport Cargo Village Terminal',
      shortName: 'Muscat Air Cargo',
      type: 'AIRPORT',
      region: 'Domestic (Oman)',
      country: 'Oman',
      city: 'Muscat',
      x: 64,
      y: 52,
      customsTerminalCode: 'OM-MCT-AIR',
      activeShipmentsInbound: 2,
      activeShipmentsOutbound: 3,
      operationalStatus: 'Clear',
      throughputIndex: 98,
      notes: 'Automated temperature-controlled Pharma & High-Value electronics gate.'
    },
    {
      id: 'NODE-HUB-MCT',
      code: 'RDC-MCT-01',
      name: 'Muscat Central Distribution & Spares Hub',
      shortName: 'Muscat Central RDC',
      type: 'WAREHOUSE_RDC',
      region: 'Domestic (Oman)',
      country: 'Oman',
      city: 'Rusayl Industrial',
      x: 68,
      y: 57,
      capacityPallets: 12000,
      occupancyPercent: 82.0,
      crossDockBays: 6,
      customsTerminalCode: 'OM-MCT-WH01',
      activeShipmentsInbound: 8,
      activeShipmentsOutbound: 12,
      operationalStatus: 'Optimal',
      throughputIndex: 96,
      notes: 'National central fulfillment warehouse, high-bay automated racking.'
    },
    {
      id: 'NODE-OMSLH',
      code: 'OMSLH-SEA',
      name: 'Port of Salalah Transshipment Terminal',
      shortName: 'Salalah Port',
      type: 'SEAPORT',
      region: 'Domestic (Oman)',
      country: 'Oman',
      city: 'Salalah',
      x: 54,
      y: 84,
      customsTerminalCode: 'OM-SLH-SEA',
      activeShipmentsInbound: 3,
      activeShipmentsOutbound: 5,
      operationalStatus: 'Optimal',
      throughputIndex: 92,
      notes: 'Indian Ocean deep-sea transshipment gateway serving Southern Oman.'
    },
    {
      id: 'NODE-HUB-SLH',
      code: 'RDC-SLH-03',
      name: 'Salalah Freezone Gateway Hub',
      shortName: 'Salalah RDC Hub',
      type: 'WAREHOUSE_RDC',
      region: 'Domestic (Oman)',
      country: 'Oman',
      city: 'Salalah Freezone',
      x: 58,
      y: 87,
      capacityPallets: 16000,
      occupancyPercent: 70.0,
      crossDockBays: 8,
      customsTerminalCode: 'OM-SLH-FZ',
      activeShipmentsInbound: 4,
      activeShipmentsOutbound: 4,
      operationalStatus: 'Optimal',
      throughputIndex: 91,
      notes: 'Chemical, polymer and energy spares staging hub for southern fields.'
    },

    // 4. Critical Delivery Destination Nodes / Industrial Customer Sites
    {
      id: 'NODE-CUST-PDO',
      code: 'CUST-PDO-MCT',
      name: 'Petroleum Development Oman (PDO) - Mina Al Fahal',
      shortName: 'PDO Mina Al Fahal',
      type: 'CUSTOMER_SITE',
      region: 'Domestic (Oman)',
      country: 'Oman',
      city: 'Muscat',
      x: 74,
      y: 53,
      activeShipmentsInbound: 3,
      activeShipmentsOutbound: 0,
      operationalStatus: 'Optimal',
      throughputIndex: 100,
      notes: 'Direct client refinery receiving depot, strict gate security compliance.'
    },
    {
      id: 'NODE-CUST-OLNG',
      code: 'CUST-OLNG-SUR',
      name: 'Oman LNG Development Terminal (Sur Complex)',
      shortName: 'Oman LNG Sur',
      type: 'CUSTOMER_SITE',
      region: 'Domestic (Oman)',
      country: 'Oman',
      city: 'Sur, Qalhat',
      x: 82,
      y: 66,
      activeShipmentsInbound: 2,
      activeShipmentsOutbound: 0,
      operationalStatus: 'Optimal',
      throughputIndex: 99,
      notes: 'Cryogenic ball valve delivery destination with ePOD signed.'
    }
  ], []);

  // Multi-Modal Network Connecting Arcs
  const networkArcs: NetworkArc[] = useMemo(() => [
    // Ocean Freight Corridors
    {
      id: 'ARC-HAM-SOH',
      arcCode: 'LANE-OCEAN-EUR-01',
      fromNodeId: 'NODE-DEHAM',
      toNodeId: 'NODE-OMSOH',
      mode: 'Ocean',
      distanceKm: 6850,
      avgTransitHours: 432, // 18 days
      status: 'Active Flow',
      activeShipmentsCount: 2,
      curvature: 0.15
    },
    {
      id: 'ARC-SHG-SLH',
      arcCode: 'LANE-OCEAN-ASIA-02',
      fromNodeId: 'NODE-CNSHG',
      toNodeId: 'NODE-OMSLH',
      mode: 'Ocean',
      distanceKm: 8200,
      avgTransitHours: 528, // 22 days
      status: 'Delayed',
      activeShipmentsCount: 1,
      curvature: -0.2
    },

    // Air Cargo Corridor
    {
      id: 'ARC-FRA-MCT',
      arcCode: 'LANE-AIR-EUR-01',
      fromNodeId: 'NODE-FRA',
      toNodeId: 'NODE-MCT-AIR',
      mode: 'Air',
      distanceKm: 5120,
      avgTransitHours: 8,
      status: 'Active Flow',
      activeShipmentsCount: 1,
      curvature: -0.1
    },

    // Port to RDC Feeder Links
    {
      id: 'ARC-SOH-PORT-RDC',
      arcCode: 'FEEDER-SOH-01',
      fromNodeId: 'NODE-OMSOH',
      toNodeId: 'NODE-HUB-SOH',
      mode: 'Road',
      distanceKm: 14,
      avgTransitHours: 1,
      status: 'Active Flow',
      activeShipmentsCount: 3,
      curvature: 0.05
    },
    {
      id: 'ARC-MCT-AIR-RDC',
      arcCode: 'FEEDER-MCT-02',
      fromNodeId: 'NODE-MCT-AIR',
      toNodeId: 'NODE-HUB-MCT',
      mode: 'Road',
      distanceKm: 28,
      avgTransitHours: 1.5,
      status: 'Active Flow',
      activeShipmentsCount: 1,
      curvature: 0.05
    },
    {
      id: 'ARC-SLH-PORT-RDC',
      arcCode: 'FEEDER-SLH-03',
      fromNodeId: 'NODE-OMSLH',
      toNodeId: 'NODE-HUB-SLH',
      mode: 'Road',
      distanceKm: 18,
      avgTransitHours: 1,
      status: 'Active Flow',
      activeShipmentsCount: 2,
      curvature: 0.05
    },

    // Inter-Hub National Trunk Corridors
    {
      id: 'ARC-SOH-MCT',
      arcCode: 'TRUNK-SOH-MCT-N01',
      fromNodeId: 'NODE-HUB-SOH',
      toNodeId: 'NODE-HUB-MCT',
      mode: 'Road',
      distanceKm: 215,
      avgTransitHours: 3.5,
      status: 'Active Flow',
      activeShipmentsCount: 4,
      curvature: 0.08
    },
    {
      id: 'ARC-DXB-MCT',
      arcCode: 'CROSSBORDER-DXB-MCT',
      fromNodeId: 'NODE-DXB-JAFZA',
      toNodeId: 'NODE-HUB-MCT',
      mode: 'Road',
      distanceKm: 460,
      avgTransitHours: 6.5,
      status: 'Active Flow',
      activeShipmentsCount: 2,
      curvature: 0.12
    },
    {
      id: 'ARC-MCT-SLH',
      arcCode: 'TRUNK-MCT-SLH-S01',
      fromNodeId: 'NODE-HUB-MCT',
      toNodeId: 'NODE-HUB-SLH',
      mode: 'Road',
      distanceKm: 1040,
      avgTransitHours: 12,
      status: 'Active Flow',
      activeShipmentsCount: 2,
      curvature: -0.15
    },

    // Last-Mile Customer Fulfillment Links
    {
      id: 'ARC-MCT-PDO',
      arcCode: 'LASTMILE-MCT-PDO',
      fromNodeId: 'NODE-HUB-MCT',
      toNodeId: 'NODE-CUST-PDO',
      mode: 'Last-Mile',
      distanceKm: 32,
      avgTransitHours: 1.5,
      status: 'Active Flow',
      activeShipmentsCount: 2,
      curvature: 0.05
    },
    {
      id: 'ARC-MCT-OLNG',
      arcCode: 'LASTMILE-MCT-SUR',
      fromNodeId: 'NODE-HUB-MCT',
      toNodeId: 'NODE-CUST-OLNG',
      mode: 'Last-Mile',
      distanceKm: 195,
      avgTransitHours: 3,
      status: 'Active Flow',
      activeShipmentsCount: 1,
      curvature: 0.1
    }
  ], []);

  // Filtered Nodes
  const filteredNodes = useMemo(() => {
    return networkNodes.filter(node => {
      const matchesSearch研 =
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterNodeType === 'ALL' || node.type === filterNodeType;
      const matchesStatus = filterStatus === 'ALL' || node.operationalStatus === filterStatus;
      
      if (activeLayer === 'warehouses') return node.type === 'WAREHOUSE_RDC';
      if (activeLayer === 'transit') return node.type === 'SEAPORT' || node.type === 'AIRPORT' || node.type === 'CUSTOMS_BORDER';

      return matchesSearch研 && matchesType && matchesStatus;
    });
  }, [networkNodes, searchTerm, filterNodeType, filterStatus, activeLayer]);

  // Filtered Arcs
  const filteredArcs深 = useMemo(() => {
    return networkArcs.filter(arc => {
      const matchesMode = filterMode === 'ALL' || arc.mode === filterMode;
      return matchesMode;
    });
  }, [networkArcs, filterMode]);

  // Real-Time Delivery Status KPIs
  const networkMetrics = useMemo(() => {
    const totalOceanShipments = freightShipments.filter(s => s.mode.includes('Ocean')).length;
    const totalAirShipments述 = freightShipments.filter(s => s.mode.includes('Air')).length;
    const totalRoadTrips = transportTrips.length;
    const totalLastMile = deliveryRecords.length;
    const totalCargoValueInTransit = freightShipments.reduce((sum, s) => sum + s.cargoValue, 0);
    const deliveredCount = deliveryRecords.filter(d => d.status === 'Delivered').length;
    const outForDeliveryCount = deliveryRecords.filter(d => d.status === 'Out for Delivery').length;
    const avgHubOccupancy = warehouseHubs.reduce((acc, h) => acc + h.utilizationPercent, 0) / (warehouseHubs.length || 1);

    return {
      totalOceanShipments,
      totalAirShipments述,
      totalRoadTrips,
      totalLastMile,
      totalCargoValueInTransit,
      deliveredCount,
      outForDeliveryCount,
      avgHubOccupancy: Math.round(avgHubOccupancy * 10) / 10,
      totalActiveVessels: freightShipments.filter(s => s.status === 'In Transit / High Seas').length,
      delayedRoutes: networkArcs.filter(a => a.status === 'Delayed').length
    };
  }, [freightShipments, transportTrips, deliveryRecords, warehouseHubs, networkArcs]);

  // Helper to map node ID to coordinate
  const getNodeCoord = (nodeId: string) => {
    const node = networkNodes.find(n => n.id === nodeId);
    if (!node) return { x: 50, y: 50 };
    return { x: node.x, y: node.y };
  };

  // Helper to generate smooth SVG curved path string
  const generatePathD = (from: { x: number; y: number }, to: { x: number; y: number }, curvature: number = 0) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    // Control point offset perpendicular to vector
    const cx = (from.x + to.x) / 2 - dy * curvature;
    const cy = (from.y + to.y) / 2 + dx * curvature;
    return `M ${from.x * 10} ${from.y * 7} Q ${cx * 10} ${cy * 7} ${to.x * 10} ${to.y * 7}`;
  };

  // Helper for node type badge color
  const getNodeBadgeColor = (type: NetworkNodeType) => {
    switch (type) {
      case 'WAREHOUSE_RDC':
        return { bg: 'bg-purple-950/80', text: 'text-purple-400', border: 'border-purple-800', icon: Warehouse };
      case 'SEAPORT':
        return { bg: 'bg-sky-950/80', text: 'text-sky-400', border: 'border-sky-800', icon: Anchor };
      case 'AIRPORT':
        return { bg: 'bg-cyan-950/80', text: 'text-cyan-400', border: 'border-cyan-800', icon: Plane };
      case 'CUSTOMER_SITE':
        return { bg: 'bg-emerald-950/80', text: 'text-emerald-400', border: 'border-emerald-800', icon: PackageCheck };
      default:
        return { bg: 'bg-amber-950/80', text: 'text-amber-400', border: 'border-amber-800', icon: MapPin };
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ----------------- HEADER & TOPOLOGY METRICS STRIP ----------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-sky-950 text-sky-400 border border-sky-800 tracking-wider">
                12.04.05 SUPPLY CHAIN NETWORK VISUALIZATION
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Multimodal Telemetry Active
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
              <span>Interactive Supply Chain Topology & Live Shipment Flow</span>
              <Sparkles className="w-5 h-5 text-sky-400" />
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live end-to-end visual network graph mapping global sea/air arrival corridors, central distribution hubs (RDCs), transshipment terminals, and last-mile delivery tracking.
            </p>
          </div>

          {/* Quick Simulation & Zoom Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLiveTelemetrySimulating(!isLiveTelemetrySimulating)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                isLiveTelemetrySimulating
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80 shadow-lg shadow-emerald-950/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title={isLiveTelemetrySimulating ? 'Pause live coordinate polling' : 'Resume live GPS coordinate updates'}
            >
              {isLiveTelemetrySimulating ? (
                <>
                  <Activity className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                  <span>Live Pulse: ON</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Telemetry: PAUSED</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowTelemetryFeed(!showTelemetryFeed)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                showTelemetryFeed
                  ? 'bg-sky-600/30 text-sky-300 border-sky-500/50'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <Radio className="w-3.5 h-3.5 inline mr-1" />
              <span>Status Feed</span>
            </button>
          </div>
        </div>

        {/* Real-Time Supply Chain Performance KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 text-xs font-mono">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[10px] text-slate-500 uppercase font-sans font-bold block">Ocean Freight</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-base font-black text-sky-400 flex items-center gap-1">
                <Ship className="w-4 h-4 text-sky-400" />
                {networkMetrics.totalOceanShipments}
              </span>
              <span className="text-[10px] text-slate-400">{networkMetrics.totalActiveVessels} In-Transit</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[10px] text-slate-500 uppercase font-sans font-bold block">Air Cargo Flights</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-base font-black text-cyan-400 flex items-center gap-1">
                <Plane className="w-4 h-4 text-cyan-400" />
                {networkMetrics.totalAirShipments述}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">100% Cleared</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[10px] text-slate-500 uppercase font-sans font-bold block">Overland Road Trips</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-base font-black text-indigo-400 flex items-center gap-1">
                <Truck className="w-4 h-4 text-indigo-400" />
                {networkMetrics.totalRoadTrips}
              </span>
              <span className="text-[10px] text-slate-400 font-sans">FTL 90%</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[10px] text-slate-500 uppercase font-sans font-bold block">Last-Mile Deliveries</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-base font-black text-emerald-400 flex items-center gap-1">
                <PackageCheck className="w-4 h-4 text-emerald-400" />
                {networkMetrics.totalLastMile}
              </span>
              <span className="text-[10px] text-emerald-300 font-sans">{networkMetrics.deliveredCount} Delivered</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[10px] text-slate-500 uppercase font-sans font-bold block">Hub Storage Load</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-base font-black text-purple-400 flex items-center gap-1">
                <Warehouse className="w-4 h-4 text-purple-400" />
                {networkMetrics.avgHubOccupancy}%
              </span>
              <span className="text-[10px] text-slate-400">4 RDCs</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-[10px] text-slate-500 uppercase font-sans font-bold block">Cargo Value In Transit</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-black text-emerald-400 truncate">
                {(networkMetrics.totalCargoValueInTransit / 1000000).toFixed(2)}M {currency}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- INTERACTIVE CONTROL BAR ----------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        {/* Search */}
        <div className="relative min-w-[240px] flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search warehouse, seaport, airport, corridor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Layer Selectors */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveLayer('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeLayer === 'all' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Network
          </button>
          <button
            onClick={() => setActiveLayer('warehouses')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeLayer === 'warehouses' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Warehouse RDCs
          </button>
          <button
            onClick={() => setActiveLayer('transit')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeLayer === 'transit' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Transit Gateways
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-500 font-bold uppercase mr-1">Mode:</span>
          {(['ALL', 'Ocean', 'Air', 'Road', 'Last-Mile'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterMode === mode
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Zoom Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.1))}
            className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono font-bold text-slate-400 px-1">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel(prev => Math.min(1.5, prev + 0.1))}
            className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 cursor-pointer text-xs"
            title="Reset Zoom"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ----------------- PRIMARY INTERACTIVE NETWORK CANVAS ----------------- */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* SVG Network Map (3 Columns on Wide Screens) */}
        <div className="xl:col-span-3 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-2xl relative overflow-hidden flex flex-col min-h-[580px]">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          
          {/* Regional Background Watermark Annotations */}
          <div className="absolute top-4 left-6 text-slate-800 font-black text-xs tracking-widest uppercase pointer-events-none">
            [ European Supply Corridor ]
          </div>
          <div className="absolute top-4 right-8 text-slate-800 font-black text-xs tracking-widest uppercase pointer-events-none">
            [ Far East Asia & Pacific ]
          </div>
          <div className="absolute bottom-6 right-8 text-slate-800 font-black text-xs tracking-widest uppercase pointer-events-none">
            [ Indian Ocean & Arabian Sea Lanes ]
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-800/40 font-black text-3xl tracking-widest uppercase pointer-events-none select-none">
            OMAN & GCC SCM CORRIDOR
          </div>

          {/* Interactive SVG Diagram */}
          <div className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center">
            <div
              className="w-full h-full transition-transform duration-300 origin-center relative"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <svg viewBox="0 0 1000 700" className="w-full h-full">
                <defs>
                  {/* Gradients for Arcs */}
                  <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="airGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="1" />
                  </linearGradient>
                  <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="lastMileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#34d399" stopOpacity="1" />
                  </linearGradient>

                  {/* Marker Arrow heads */}
                  <marker id="arrow-ocean" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
                  </marker>
                  <marker id="arrow-air" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#22d3ee" />
                  </marker>
                  <marker id="arrow-road" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
                  </marker>
                  <marker id="arrow-lastmile" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#34d399" />
                  </marker>
                </defs>

                {/* 1. Render Network Arcs (Connecting Lines) */}
                {filteredArcs深.map((arc) => {
                  const from = getNodeCoord(arc.fromNodeId);
                  const to = getNodeCoord(arc.toNodeId);
                  const pathD = generatePathD(from, to, arc.curvature || 0);
                  const isSelected = selectedArc?.id === arc.id;

                  let strokeColor = 'url(#roadGrad)';
                  let markerEnd = 'url(#arrow-road)';
                  let strokeDash = '4 4';
                  let strokeWidth = isSelected ? 4 : 2;

                  if (arc.mode === 'Ocean') {
                    strokeColor = 'url(#oceanGrad)';
                    markerEnd = 'url(#arrow-ocean)';
                    strokeDash = '6 6';
                    strokeWidth = isSelected ? 4.5 : 2.5;
                  } else if (arc.mode === 'Air') {
                    strokeColor = 'url(#airGrad)';
                    markerEnd = 'url(#arrow-air)';
                    strokeDash = '3 3';
                    strokeWidth = isSelected ? 4 : 2.2;
                  } else if (arc.mode === 'Last-Mile') {
                    strokeColor = 'url(#lastMileGrad)';
                    markerEnd = 'url(#arrow-lastmile)';
                    strokeDash = 'none';
                    strokeWidth = isSelected ? 4 : 2.5;
                  }

                  // Calculate animated moving pulse position along the arc
                  const midX = (from.x + to.x) / 2 * 10;
                  const midY = (from.y + to.y) / 2 * 7;

                  return (
                    <g key={arc.id} className="cursor-pointer group" onClick={() => { setSelectedArc(arc); setSelectedNode(null); }}>
                      {/* Interactive broad hit area */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke="transparent"
                        strokeWidth={16}
                      />
                      
                      {/* Visual Arc Path */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDash}
                        markerEnd={markerEnd}
                        className={`transition-all duration-200 ${
                          isSelected ? 'filter drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]' : 'group-hover:stroke-white'
                        }`}
                      />

                      {/* Moving Vehicle / Packet Dot Simulation */}
                      {isLiveTelemetrySimulating && (
                        <circle
                          r={arc.mode === 'Ocean' ? 4.5 : 3.5}
                          fill={arc.mode === 'Ocean' ? '#38bdf8' : arc.mode === 'Air' ? '#22d3ee' : '#a855f7'}
                          className="animate-ping"
                          style={{
                            cx: `${(from.x + (to.x - from.x) * ((telemetryTick % 100) / 100)) * 10}`,
                            cy: `${(from.y + (to.y - from.y) * ((telemetryTick % 100) / 100)) * 7}`
                          }}
                        />
                      )}

                      {/* Arc Mode & Active Flow Label */}
                      <g transform={`translate(${midX}, ${midY})`}>
                        <rect
                          x="-32"
                          y="-10"
                          width="64"
                          height="18"
                          rx="9"
                          fill="#0f172a"
                          stroke={isSelected ? '#38bdf8' : '#334155'}
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="3"
                          textAnchor="middle"
                          fill="#94a3b8"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {arc.mode === 'Ocean' ? '⚓ FCL' : arc.mode === 'Air' ? '✈ AIR' : '🚚 ROAD'}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* 2. Render Network Nodes */}
                {filteredNodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  const isWarehouse = node.type === 'WAREHOUSE_RDC';
                  const isCustomer = node.type === 'CUSTOMER_SITE';
                  const isSeaport = node.type === 'SEAPORT';
                  const isAirport展 = node.type === 'AIRPORT';

                  const nodeX = node.x * 10;
                  const nodeY = node.y * 7;

                  // Node color mappings
                  let circleColor = '#0284c7';
                  let ringColor = '#38bdf8';
                  let iconBg = '#0c4a6e';

                  if (isWarehouse) {
                    circleColor = '#7e22ce';
                    ringColor = '#c084fc';
                    iconBg = '#3b0764';
                  } else if (isAirport展) {
                    circleColor = '#0891b2';
                    ringColor = '#22d3ee';
                    iconBg = '#164e63';
                  } else if (isCustomer) {
                    circleColor = '#059669';
                    ringColor = '#34d399';
                    iconBg = '#064e3b';
                  }

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${nodeX}, ${nodeY})`}
                      className="cursor-pointer group"
                      onClick={() => { setSelectedNode(node); setSelectedArc(null); }}
                    >
                      {/* Outer Pulse Ring if selected or high throughput */}
                      {(isSelected || isWarehouse) && (
                        <circle
                          r={isWarehouse ? 28 : 22}
                          fill="none"
                          stroke={ringColor}
                          strokeWidth="1.5"
                          opacity="0.4"
                          className="animate-pulse"
                        />
                      )}

                      {/* Base Node Circle */}
                      <circle
                        r={isWarehouse ? 22 : isCustomer ? 18 : 16}
                        fill="#0f172a"
                        stroke={isSelected ? '#ffffff' : ringColor}
                        strokeWidth={isSelected ? 3 : 2}
                        className="transition-all duration-200 filter drop-shadow-md group-hover:scale-110"
                      />

                      {/* Inner Colored Core */}
                      <circle
                        r={isWarehouse ? 14 : 10}
                        fill={circleColor}
                        opacity="0.9"
                      />

                      {/* Utilization Ring for Warehouses */}
                      {isWarehouse && node.occupancyPercent && (
                        <circle
                          r="20"
                          fill="none"
                          stroke="#a855f7"
                          strokeWidth="3"
                          strokeDasharray={`${(node.occupancyPercent / 100) * 125} 125`}
                          strokeLinecap="round"
                          transform="rotate(-90)"
                        />
                      )}

                      {/* Node Label Pin */}
                      <g transform="translate(0, 32)">
                        <rect
                          x="-50"
                          y="-8"
                          width="100"
                          height="18"
                          rx="6"
                          fill="#020617"
                          stroke={isSelected ? '#38bdf8' : '#1e293b'}
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="4"
                          textAnchor="middle"
                          fill={isSelected ? '#ffffff' : '#e2e8f0'}
                          fontSize="9.5"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          {node.shortName}
                        </text>
                      </g>

                      {/* Secondary Info Tag (Throughput / Occupancy) */}
                      <g transform="translate(0, 48)">
                        <text
                          x="0"
                          y="2"
                          textAnchor="middle"
                          fill="#94a3b8"
                          fontSize="8"
                          fontFamily="monospace"
                        >
                          {isWarehouse ? `${node.occupancyPercent}% cap` : `${node.activeShipmentsOutbound + node.activeShipmentsInbound} active`}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Map Legend Footer */}
          <div className="mt-auto pt-3 border-t border-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-500 border border-purple-300" />
                <span className="text-[11px] font-medium text-slate-300">Central Warehouse RDC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-sky-500 border border-sky-300" />
                <span className="text-[11px] font-medium text-slate-300">Deepwater Seaport</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-cyan-500 border border-cyan-300" />
                <span className="text-[11px] font-medium text-slate-300">Air Cargo Hub</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300" />
                <span className="text-[11px] font-medium text-slate-300">Customer Site / Destination</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
              Click any node or corridor to inspect live telemetry & cargo manifests
            </div>
          </div>
        </div>

        {/* ----------------- RIGHT COLUMN: NODE/CORRIDOR/SHIPMENT 360 INSPECTION PANEL ----------------- */}
        <div className="space-y-4">
          {/* Active Node 360 Inspection */}
          {selectedNode ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 animate-fadeIn">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                      {selectedNode.code}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-800 text-slate-300">
                      {selectedNode.type.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white mt-1">{selectedNode.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    {selectedNode.city}, {selectedNode.country} ({selectedNode.region})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-slate-400 hover:text-white text-xs font-bold p-1"
                >
                  ✕
                </button>
              </div>

              {/* Warehouse / Terminal Metrics */}
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                {selectedNode.capacityPallets && (
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-sans uppercase font-bold">Storage Capacity</span>
                    <p className="text-sm font-bold text-purple-400 mt-0.5">
                      {selectedNode.capacityPallets.toLocaleString()} Pallets
                    </p>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                      <div
                        className="bg-purple-500 h-1.5 rounded-full"
                        style={{ width: `${selectedNode.occupancyPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Occupancy: {selectedNode.occupancyPercent}%
                    </span>
                  </div>
                )}

                {selectedNode.crossDockBays && (
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-sans uppercase font-bold">Cross-Dock Bays</span>
                    <p className="text-sm font-bold text-cyan-400 mt-0.5">{selectedNode.crossDockBays} Active Bays</p>
                    <span className="text-[10px] text-emerald-400 mt-1 block">Direct Transshipment</span>
                  </div>
                )}

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-sans uppercase font-bold">Active Flow In/Out</span>
                  <p className="text-sm font-bold text-white mt-0.5">
                    +{selectedNode.activeShipmentsInbound} / -{selectedNode.activeShipmentsOutbound}
                  </p>
                  <span className="text-[10px] text-slate-400 font-sans">Shipments</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-sans uppercase font-bold">Throughput Index</span>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">{selectedNode.throughputIndex} / 100</p>
                  <span className="text-[10px] text-slate-400 font-sans">Status: {selectedNode.operationalStatus}</span>
                </div>
              </div>

              {selectedNode.customsTerminalCode && (
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Customs Bayan Authority Code</span>
                  <p className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                    {selectedNode.customsTerminalCode}
                  </p>
                </div>
              )}

              {selectedNode.notes && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                  <span className="text-[10px] font-bold text-slate-300 uppercase block mb-1">Operational Directive</span>
                  {selectedNode.notes}
                </div>
              )}
            </div>
          ) : selectedArc ? (
            /* Selected Corridor Arc 360 Inspection */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 animate-fadeIn">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                    {selectedArc.arcCode}
                  </span>
                  <h3 className="text-base font-black text-white mt-1">
                    {networkNodes.find(n => n.id === selectedArc.fromNodeId)?.shortName} →{' '}
                    {networkNodes.find(n => n.id === selectedArc.toNodeId)?.shortName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Mode: <strong className="text-white">{selectedArc.mode} Transport Lane</strong>
                  </p>
                </div>
                <button onClick={() => setSelectedArc(null)} className="text-slate-400 hover:text-white text-xs font-bold">
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-sans uppercase font-bold">Corridor Distance</span>
                  <p className="text-sm font-bold text-white mt-0.5">{selectedArc.distanceKm.toLocaleString()} KM</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-sans uppercase font-bold">Standard Transit</span>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">
                    {selectedArc.avgTransitHours > 48
                      ? `${(selectedArc.avgTransitHours / 24).toFixed(0)} Days`
                      : `${selectedArc.avgTransitHours} Hours`}
                  </p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-sans uppercase font-bold">Active Payloads</span>
                  <p className="text-sm font-bold text-sky-400 mt-0.5">{selectedArc.activeShipmentsCount} Shipments</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 font-sans uppercase font-bold">Flow Condition</span>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">{selectedArc.status}</p>
                </div>
              </div>
            </div>
          ) : (
            /* Active Live Freight Telemetry Snapshot */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-sky-400 animate-pulse" />
                  <h3 className="text-sm font-bold text-white">Live In-Transit Vessels & Flights</h3>
                </div>
                <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                  {freightShipments.length} Global Units
                </span>
              </div>

              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {freightShipments.map((shp) => {
                  const isCurrent = activeShipmentEntity?.id === shp.id;
                  return (
                    <div
                      key={shp.id}
                      onClick={() => {
                        setActiveShipmentEntity(shp);
                        selectShipment(shp);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-sky-950/50 border-sky-500 shadow-md'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono text-[10px] font-bold text-sky-400">
                            {shp.shipmentNumber}
                          </span>
                          <h4 className="text-xs font-bold text-white mt-0.5">{shp.carrierName}</h4>
                          <p className="text-[11px] text-slate-400 font-mono truncate">{shp.vesselOrFlightNumber}</p>
                        </div>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                            shp.status === 'Delivered'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : shp.status === 'In Transit / High Seas'
                              ? 'bg-sky-950 text-sky-400 border border-sky-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {shp.status}
                        </span>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>ETA: <strong className="text-emerald-400">{shp.estimatedArrivalDate}</strong></span>
                        <span>{shp.containerCount} x FCL</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Last-Mile Real-Time Dispatch Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Last-Mile Customer Dispatches</span>
              </h4>
              <span className="text-[10px] text-slate-500 font-mono">ePOD Active</span>
            </div>

            <div className="space-y-2">
              {deliveryRecords.map((deliv) => (
                <div key={deliv.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{deliv.customerName}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        deliv.status === 'Delivered'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {deliv.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 truncate">{deliv.deliveryAddress}</p>
                  <div className="flex items-center justify-between mt-1.5 text-[10px] font-mono text-slate-500">
                    <span>Driver: {deliv.assignedDriver}</span>
                    <span>Ref: {deliv.customerOrderRef}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

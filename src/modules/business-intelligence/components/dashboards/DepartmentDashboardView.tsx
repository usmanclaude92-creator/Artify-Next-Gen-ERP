import React, { useState } from 'react';
import {
  Building2,
  DollarSign,
  ShoppingCart,
  Users,
  Briefcase,
  Boxes,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useBI } from '../../services/biStore';
import { BiFilterBar } from '../common/BiFilterBar';
import { DemoDataBanner } from '../common/DemoDataBanner';
import { BiMetricCard } from '../common/BiMetricCard';

type DepartmentKey = 'finance' | 'procurement' | 'hr' | 'projects' | 'inventory';

export const DepartmentDashboardView: React.FC = () => {
  const {
    pnlData,
    financialRatios,
    purchaseData,
    supplierAnalytics,
    hrData,
    projectData,
    inventoryData,
    formatCurrency,
    currencySymbol
  } = useBI();

  const [activeDept, setActiveDept] = useState<DepartmentKey>('finance');

  const deptTabs: { key: DepartmentKey; label: string; icon: React.ReactNode }[] = [
    { key: 'finance', label: 'Finance & Treasury', icon: <DollarSign className="w-4 h-4" /> },
    { key: 'procurement', label: 'Procurement & Spend', icon: <ShoppingCart className="w-4 h-4" /> },
    { key: 'projects', label: 'PMO & Projects', icon: <Briefcase className="w-4 h-4" /> },
    { key: 'inventory', label: 'Inventory & Warehouse', icon: <Boxes className="w-4 h-4" /> },
    { key: 'hr', label: 'Human Resources & Talent', icon: <Users className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6">
      <DemoDataBanner moduleSource="Module 02.03 Departmental Intelligence" />

      {/* Department Tab Switcher */}
      <div className="bg-white border border-slate-200 rounded-xl p-1.5 shadow-xs flex flex-wrap gap-1.5">
        {deptTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveDept(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeDept === tab.key
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <BiFilterBar />

      {/* FINANCE & TREASURY TAB */}
      {activeDept === 'finance' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <BiMetricCard
              title="Operating Profit (EBIT)"
              value={formatCurrency(2523000)}
              change="+9.22% vs Budget"
              changeType="positive"
              target={formatCurrency(2310000)}
            />
            <BiMetricCard
              title="Current Liquidity Ratio"
              value="2.03x"
              change="Benchmark: 1.50x"
              changeType="positive"
              subtitle="Acid test: 1.47x"
            />
            <BiMetricCard
              title="Debt-to-Equity Ratio"
              value="0.34x"
              change="Conservative Leverage"
              changeType="positive"
              target="< 0.60x"
            />
            <BiMetricCard
              title="Days Sales Outstanding"
              value="48.0 Days"
              change="Stable Collections"
              changeType="neutral"
              target="45 Days"
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Core Financial Ratios & Benchmark Scorecard</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <th className="py-2.5 px-3 font-semibold">Category</th>
                    <th className="py-2.5 px-3 font-semibold">Financial Ratio</th>
                    <th className="py-2.5 px-3 font-semibold">Formula</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Actual Value</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Target Benchmark</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                    <th className="py-2.5 px-3 font-semibold">Executive Commentary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {financialRatios.map(r => (
                    <tr key={r.name} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 font-medium text-slate-600">{r.category}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{r.name}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{r.formula}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-right text-indigo-900">
                        {r.value} {r.unit}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-right text-slate-600">
                        {r.benchmark} {r.unit}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {r.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 text-[11px]">{r.commentary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PROCUREMENT TAB */}
      {activeDept === 'procurement' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <BiMetricCard
              title="YTD Total Spend"
              value={formatCurrency(5080000)}
              change="73 Purchase Orders"
              changeType="neutral"
            />
            <BiMetricCard
              title="On-Time Delivery (OTIF)"
              value="96.5%"
              change="+1.5% vs SLA"
              changeType="positive"
              target="95.0%"
            />
            <BiMetricCard
              title="Avg Supplier Lead Time"
              value="15.2 Days"
              change="Fast Cycle"
              changeType="positive"
              target="< 20 Days"
            />
            <BiMetricCard
              title="Price Variance Savings"
              value={formatCurrency(48500)}
              change="Negotiated Discount"
              changeType="positive"
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Key Strategic Suppliers & Delivery SLA</h3>
            <div className="space-y-3">
              {supplierAnalytics.map(sup => (
                <div key={sup.supplierCode} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{sup.supplierName}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Category: <strong>{sup.category}</strong> • Terms: <strong>{sup.paymentTermDays} Days</strong> • Renewal: <strong>{sup.contractRenewalDate}</strong>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block">YTD Spend</span>
                      <span className="font-bold text-slate-900">{formatCurrency(sup.ytdSpendOMR)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">OTIF Rate</span>
                      <span className="font-bold text-emerald-700">{sup.onTimeDeliveryRate}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Risk Rating</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sup.riskRating === 'Low' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {sup.riskRating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PROJECTS TAB */}
      {activeDept === 'projects' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <BiMetricCard
              title="Active EPC Contracts"
              value="4 Projects"
              change="Total Value: 12.05M OMR"
              changeType="neutral"
            />
            <BiMetricCard
              title="Cost Performance (CPI)"
              value="1.04"
              change="Budget Favorable"
              changeType="positive"
              target=">= 1.0"
            />
            <BiMetricCard
              title="Schedule Index (SPI)"
              value="0.98"
              change="Minor Lag on Nizwa"
              changeType="neutral"
              target=">= 1.0"
            />
            <BiMetricCard
              title="Earned Value (EV)"
              value={formatCurrency(7492500)}
              change="72.4% Progress Avg"
              changeType="positive"
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Project Portfolio Earned Value & Margin Tracking</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <th className="py-2.5 px-3 font-semibold">Project Code & Name</th>
                    <th className="py-2.5 px-3 font-semibold">Client</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Contract Value</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Actual Cost</th>
                    <th className="py-2.5 px-3 font-semibold text-center">CPI</th>
                    <th className="py-2.5 px-3 font-semibold text-center">SPI</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Margin %</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projectData.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{p.projectName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{p.projectCode} • Lead: {p.projectManager}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">{p.clientName}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-right text-slate-900">{formatCurrency(p.contractValueOMR)}</td>
                      <td className="py-2.5 px-3 font-mono text-right text-slate-600">{formatCurrency(p.actualCostOMR)}</td>
                      <td className="py-2.5 px-3 font-mono text-center font-bold text-emerald-700">{p.cpi}</td>
                      <td className="py-2.5 px-3 font-mono text-center font-bold text-indigo-700">{p.spi}</td>
                      <td className="py-2.5 px-3 font-mono text-right font-bold text-emerald-700">{p.marginPercent}%</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.health === 'Green' ? 'bg-emerald-100 text-emerald-800' : p.health === 'Amber' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {p.health}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* INVENTORY TAB */}
      {activeDept === 'inventory' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <BiMetricCard
              title="Total Stock Valuation"
              value={formatCurrency(2840000)}
              change="4 Warehouses"
              changeType="neutral"
            />
            <BiMetricCard
              title="Inventory Turnover"
              value="6.2x"
              change="Healthy Velocity"
              changeType="positive"
              target="> 5.5x"
            />
            <BiMetricCard
              title="Low Stock Reorder Alerts"
              value="1 SKU"
              change="Hydraulic Valves 6in"
              changeType="negative"
            />
            <BiMetricCard
              title="Dead / Aging Stock"
              value={formatCurrency(72000)}
              change="Legacy Flanges"
              changeType="negative"
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Warehouse Valuation & Days of Stock</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <th className="py-2.5 px-3 font-semibold">SKU / Item Name</th>
                    <th className="py-2.5 px-3 font-semibold">Warehouse</th>
                    <th className="py-2.5 px-3 font-semibold text-right">On Hand Qty</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Total Valuation</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Turnover</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Days Remaining</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Stock Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventoryData.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-900 block">{item.itemName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{item.itemCode} • {item.category}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">{item.warehouse}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-right text-slate-900">{item.quantityOnHand}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-right text-indigo-900">{formatCurrency(item.totalValuationOMR)}</td>
                      <td className="py-2.5 px-3 font-mono text-right text-slate-700">{item.stockTurnoverRatio}x</td>
                      <td className="py-2.5 px-3 font-mono text-right text-slate-700">{item.daysOfInventoryRemaining}d</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'Healthy' ? 'bg-emerald-100 text-emerald-800' : item.status === 'Low Stock' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* HR TAB */}
      {activeDept === 'hr' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <BiMetricCard
              title="Total Headcount"
              value="815 Employees"
              change="+79 Hires YTD"
              changeType="positive"
            />
            <BiMetricCard
              title="Annual Turnover Rate"
              value="3.58%"
              change="Low Industry Churn"
              changeType="positive"
              target="< 5.0%"
            />
            <BiMetricCard
              title="Attendance Reliability"
              value="97.8%"
              change="Optimal Operations"
              changeType="positive"
            />
            <BiMetricCard
              title="Avg Training Hours"
              value="32.8 hrs"
              change="Skills Upskilling"
              changeType="positive"
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Workforce Distribution & Retention by Department</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <th className="py-2.5 px-3 font-semibold">Department</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Headcount</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Joiners YTD</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Turnover %</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Avg Tenure</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Open Requisitions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {hrData.map(h => (
                    <tr key={h.id} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{h.department}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-right text-slate-900">{h.headcount}</td>
                      <td className="py-2.5 px-3 font-mono text-right text-emerald-700">+{h.joinersYtd}</td>
                      <td className="py-2.5 px-3 font-mono text-right font-semibold text-slate-700">{h.turnoverRatePercent}%</td>
                      <td className="py-2.5 px-3 font-mono text-right text-slate-600">{h.avgTenureYears} yrs</td>
                      <td className="py-2.5 px-3 font-mono text-right font-bold text-indigo-700">{h.recruitmentOpenPositions} Roles</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Target, TrendingUp, TrendingDown, CheckCircle2, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { useBI } from '../../services/biStore';
import { DemoDataBanner } from '../common/DemoDataBanner';

export const KpiMonitoringView: React.FC = () => {
  const { kpis } = useBI();

  return (
    <div className="space-y-6">
      <DemoDataBanner moduleSource="Module 02.07 Live KPI Performance & Threshold Monitoring" />

      {/* Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            Live KPI Telemetry & Velocity Monitor
          </h2>
          <p className="text-xs text-slate-500">
            Real-time tracking of organizational KPIs against active targets and safety thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Polling Active
          </span>
        </div>
      </div>

      {/* Live KPI Monitoring Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpis.map(kpi => {
          const isHigherBetter = kpi.direction === 'higher_is_better';
          const variance = kpi.currentValue - kpi.targetValue;
          const isFavorable = isHigherBetter ? variance >= 0 : variance <= 0;
          const achievement = ((kpi.currentValue / (kpi.targetValue || 1)) * 100).toFixed(1);

          return (
            <div
              key={kpi.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Top */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {kpi.code}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded ${
                      isFavorable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {isFavorable ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {achievement}% Achieved
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1">{kpi.name}</h3>
                <p className="text-xs text-slate-500 mb-3">{kpi.department}</p>

                {/* Primary Metric & Target Display */}
                <div className="flex items-baseline justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Actual</span>
                    <span className="text-xl font-bold font-mono text-slate-900">
                      {kpi.currentValue} {kpi.unit}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Baseline Target</span>
                    <span className="text-sm font-bold font-mono text-indigo-700">
                      {kpi.targetValue} {kpi.unit}
                    </span>
                  </div>
                </div>

                {/* Sparkline Trend */}
                {kpi.historicalTrend && kpi.historicalTrend.length > 0 && (
                  <div className="mt-3">
                    <span className="text-[10px] font-semibold text-slate-400 block mb-1">Performance Trend</span>
                    <div className="h-16 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={kpi.historicalTrend}>
                          <XAxis dataKey="date" hide />
                          <YAxis hide domain={['auto', 'auto']} />
                          <Tooltip formatter={(val: any) => [`${val} ${kpi.unit}`, 'Value']} />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={isFavorable ? '#10b981' : '#f43f5e'}
                            strokeWidth={2}
                            dot={{ r: 2 }}
                          />
                          <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="3 3" strokeWidth={1} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Threshold: [{kpi.minThreshold} - {kpi.maxThreshold}]</span>
                <span className="font-mono font-medium">Freq: {kpi.frequency}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

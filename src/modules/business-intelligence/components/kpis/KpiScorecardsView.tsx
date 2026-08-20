import React from 'react';
import { Award, Layers, CheckCircle2, TrendingUp, TrendingDown, Target, Building2 } from 'lucide-react';
import { useBI } from '../../services/biStore';
import { DemoDataBanner } from '../common/DemoDataBanner';

export const KpiScorecardsView: React.FC = () => {
  const { kpiScorecards } = useBI();

  return (
    <div className="space-y-6">
      <DemoDataBanner moduleSource="Module 02.08 Balanced Scorecards & Strategic Perspectives" />

      {/* Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            Executive Balanced Scorecard Management
          </h2>
          <p className="text-xs text-slate-500">
            Four-pillar strategic framework measuring Financial, Customer, Operational, and Growth metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg">
            Q3 FY2026 Scorecard Active
          </span>
        </div>
      </div>

      {/* Scorecards List */}
      <div className="space-y-6">
        {kpiScorecards.map(sc => (
          <div key={sc.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            {/* Scorecard Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {sc.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{sc.perspective}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{sc.title}</h3>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Perspective Weight</span>
                  <span className="text-xs font-mono font-bold text-slate-700">{sc.weightPercent}% Weight</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Overall Score</span>
                  <span className="text-base font-mono font-bold text-emerald-700">{sc.score} / 100</span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {sc.status}
                </span>
              </div>
            </div>

            {/* KPI Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <th className="py-2 px-3 font-semibold">Strategic Metric</th>
                    <th className="py-2 px-3 font-semibold text-right">Weight %</th>
                    <th className="py-2 px-3 font-semibold text-right">Target</th>
                    <th className="py-2 px-3 font-semibold text-right">Actual Result</th>
                    <th className="py-2 px-3 font-semibold text-right">Achievement %</th>
                    <th className="py-2 px-3 font-semibold text-right">Weighted Score</th>
                    <th className="py-2 px-3 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sc.kpis.map(k => (
                    <tr key={k.kpiId} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{k.kpiName}</td>
                      <td className="py-2.5 px-3 font-mono text-right text-slate-600">{k.weight}%</td>
                      <td className="py-2.5 px-3 font-mono text-right text-slate-700">
                        {k.target} {k.unit}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-right text-indigo-900">
                        {k.actual} {k.unit}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-right text-emerald-700">
                        {k.achievementPercent}%
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-right text-slate-900">{k.weightedScore}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {k.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

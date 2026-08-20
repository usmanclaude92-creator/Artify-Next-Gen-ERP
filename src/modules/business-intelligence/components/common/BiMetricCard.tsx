import React from 'react';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

interface BiMetricCardProps {
  id?: string;
  title: string;
  value: string;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  target?: string;
  achievementPercent?: number;
  icon?: React.ReactNode;
  onClickInfo?: () => void;
  accentColor?: string;
}

export const BiMetricCard: React.FC<BiMetricCardProps> = ({
  id,
  title,
  value,
  subtitle,
  change,
  changeType = 'positive',
  target,
  achievementPercent,
  icon,
  onClickInfo,
  accentColor = 'border-l-indigo-500'
}) => {
  return (
    <div
      id={id}
      className={`bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-500 truncate">{title}</span>
          <div className="flex items-center gap-1">
            {icon && <div className="text-slate-400">{icon}</div>}
            {onClickInfo && (
              <button
                onClick={onClickInfo}
                className="text-slate-400 hover:text-indigo-600 transition-colors p-0.5"
                title="View Calculation & Explainability Trace"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono tracking-tight text-slate-900">{value}</span>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        {change && (
          <div
            className={`flex items-center gap-1 font-semibold ${
              changeType === 'positive'
                ? 'text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded'
                : changeType === 'negative'
                ? 'text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded'
                : 'text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded'
            }`}
          >
            {changeType === 'positive' && <TrendingUp className="w-3 h-3" />}
            {changeType === 'negative' && <TrendingDown className="w-3 h-3" />}
            {changeType === 'neutral' && <Minus className="w-3 h-3" />}
            <span>{change}</span>
          </div>
        )}

        {target && (
          <span className="text-[11px] text-slate-500 font-mono">
            Target: <strong className="text-slate-700">{target}</strong>
          </span>
        )}

        {subtitle && !target && !change && (
          <span className="text-[11px] text-slate-500">{subtitle}</span>
        )}

        {achievementPercent !== undefined && (
          <div className="flex items-center gap-1.5">
            <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full ${
                  achievementPercent >= 100
                    ? 'bg-emerald-500'
                    : achievementPercent >= 80
                    ? 'bg-indigo-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(achievementPercent, 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-700">{achievementPercent}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

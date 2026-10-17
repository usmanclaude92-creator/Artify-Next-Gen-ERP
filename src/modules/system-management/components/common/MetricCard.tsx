import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  status?: 'positive' | 'warning' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  description?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  isPositive,
  status = 'neutral',
  icon,
  description,
  onClick
}) => {
  let statusBadgeStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
  if (status === 'positive' || isPositive === true) {
    statusBadgeStyle = 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30';
  } else if (status === 'warning') {
    statusBadgeStyle = 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30';
  } else if (status === 'negative' || isPositive === false) {
    statusBadgeStyle = 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30';
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-xs transition-all ${
        onClick ? 'cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{label}</p>
          <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 tracking-tight">{value}</h4>
        </div>
        {icon && (
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
            {icon}
          </div>
        )}
      </div>

      {(change || description) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {change && (
            <span className={`px-1.5 py-0.5 rounded-md font-semibold border ${statusBadgeStyle}`}>
              {change}
            </span>
          )}
          {description && <span className="text-slate-500 dark:text-slate-400 truncate">{description}</span>}
        </div>
      )}
    </div>
  );
};

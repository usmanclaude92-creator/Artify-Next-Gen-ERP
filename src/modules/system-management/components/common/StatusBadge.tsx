import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status = '', size = 'sm' }) => {
  const normalized = (status || '').toLowerCase();

  let styles = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

  if (['active', 'open', 'success', 'approved', 'ready for sandbox', 'connected / healthy', 'enforced', 'normal', 'positive'].includes(normalized)) {
    styles = 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30';
  } else if (['pending', 'pending approval', 'draft', 'scheduled', 'warning', 'warning only', 'degraded', 'review', 'pending review', 'planning'].includes(normalized)) {
    styles = 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30';
  } else if (['locked', 'closed', 'rejected', 'suspended', 'archived', 'failed', 'offline', 'critical', 'revoked'].includes(normalized)) {
    styles = 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30';
  } else if (['sandbox mock', 'holding', 'holding group', 'parent', 'profit center', 'high'].includes(normalized)) {
    styles = 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30';
  } else if (['subsidiary', 'wholly owned subsidiary', 'wholly owned', 'cost center', 'medium'].includes(normalized)) {
    styles = 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-500/30';
  } else if (['associate', 'joint venture', 'affiliate', 'investment'].includes(normalized)) {
    styles = 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-500/30';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border whitespace-nowrap ${sizeClasses} ${styles}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      <span>{status}</span>
    </span>
  );
};

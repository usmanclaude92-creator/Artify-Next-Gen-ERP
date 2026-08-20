import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status = '', size = 'sm' }) => {
  const normalized = (status || '').toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';

  if (['active', 'open', 'success', 'approved', 'ready for sandbox', 'connected / healthy', 'enforced', 'normal', 'positive'].includes(normalized)) {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (['pending', 'draft', 'scheduled', 'warning', 'warning only', 'degraded', 'review', 'pending review', 'planning'].includes(normalized)) {
    styles = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (['locked', 'closed', 'rejected', 'suspended', 'archived', 'failed', 'offline', 'critical', 'revoked'].includes(normalized)) {
    styles = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (['sandbox mock', 'holding', 'profit center', 'high'].includes(normalized)) {
    styles = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  } else if (['subsidiary', 'cost center', 'medium'].includes(normalized)) {
    styles = 'bg-sky-50 text-sky-700 border-sky-200';
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

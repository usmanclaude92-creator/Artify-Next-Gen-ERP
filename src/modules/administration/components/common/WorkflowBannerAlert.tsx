import React from 'react';
import { useAdmin } from '../../services/administrationStore';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';

export const WorkflowBannerAlert: React.FC = () => {
  const { workflowBanner, clearWorkflowBanner } = useAdmin();

  if (!workflowBanner) return null;

  const isError = workflowBanner.type === 'error';
  const isWarning = workflowBanner.type === 'warning';
  const isSuccess = workflowBanner.type === 'success';

  return (
    <div
      className={`rounded-xl p-4 border flex items-start justify-between gap-3 shadow-xs transition-all animate-in fade-in slide-in-from-top-2 ${
        isError
          ? 'bg-rose-50 border-rose-200 text-rose-900'
          : isWarning
          ? 'bg-amber-50 border-amber-200 text-amber-900'
          : isSuccess
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
          : 'bg-indigo-50 border-indigo-200 text-indigo-900'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          {isError && <ShieldAlert className="w-5 h-5 text-rose-600" />}
          {isWarning && <AlertTriangle className="w-5 h-5 text-amber-600" />}
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          {!isError && !isWarning && !isSuccess && <Info className="w-5 h-5 text-indigo-600" />}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-xs uppercase tracking-wide">
              {isError
                ? 'Workflow Engine Validation Error'
                : isWarning
                ? 'Governance Warning'
                : isSuccess
                ? 'Approval Stage Processed'
                : 'Workflow Notification'}
            </span>
            {workflowBanner.violationCode && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/80 border border-current shadow-2xs">
                {workflowBanner.violationCode}
              </span>
            )}
          </div>
          <p className="text-xs mt-1 leading-relaxed opacity-90">{workflowBanner.message}</p>
        </div>
      </div>

      <button
        onClick={clearWorkflowBanner}
        className="p-1 rounded-lg hover:bg-black/5 text-current opacity-70 hover:opacity-100 transition-opacity cursor-pointer shrink-0"
        title="Dismiss Notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

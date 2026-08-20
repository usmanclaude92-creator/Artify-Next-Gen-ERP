import React from 'react';
import { X } from 'lucide-react';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  onSubmit,
  submitLabel = 'Save Record',
  cancelLabel = 'Cancel',
  isSubmitting = false,
  maxWidth = '2xl'
}) => {
  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl'
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className={`bg-white rounded-2xl border border-slate-200 shadow-2xl w-full ${maxWidthClass} overflow-hidden animate-in fade-in zoom-in-95 duration-150`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="flex flex-col">
          <div className="px-6 py-5 max-h-[70vh] overflow-y-auto space-y-4 text-xs">
            {children}
          </div>

          {/* Actions Footer */}
          <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
            >
              {isSubmitting ? 'Processing...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

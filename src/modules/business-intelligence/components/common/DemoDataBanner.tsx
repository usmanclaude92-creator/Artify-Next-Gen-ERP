import React from 'react';
import { Database, ShieldAlert, Sparkles } from 'lucide-react';

interface DemoDataBannerProps {
  moduleSource?: string;
  className?: string;
}

export const DemoDataBanner: React.FC<DemoDataBannerProps> = ({
  moduleSource = 'Enterprise Analytics Core',
  className = ''
}) => {
  return (
    <div
      className={`flex items-center justify-between px-3.5 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-amber-600 text-white uppercase tracking-wider">
          <Database className="w-3 h-3" />
          DEMO DATA
        </span>
        <span className="font-medium text-slate-700">
          Source: <strong className="text-slate-900">{moduleSource}</strong>. Financial and operational values reflect sample enterprise test data.
        </span>
      </div>
      <div className="hidden md:flex items-center gap-2 text-slate-500 text-[11px]">
        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
        <span>Live ERP Data ingestion connects automatically upon Module 03–17 activation.</span>
      </div>
    </div>
  );
};

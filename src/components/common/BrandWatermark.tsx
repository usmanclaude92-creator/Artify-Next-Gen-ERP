import React from 'react';
import { BrandLogo } from './BrandLogo';

/** Faint Artify mark for hero/header panels. The parent must be `relative overflow-hidden`. */
export const BrandWatermark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div aria-hidden="true" className={`pointer-events-none select-none absolute -right-6 top-1/2 -translate-y-1/2 h-[130%] max-h-72 flex items-center ${className}`}>
    <BrandLogo className="h-full w-auto object-contain opacity-[0.07] dark:opacity-[0.08]" alt="" />
  </div>
);

import React from 'react';
import { BrandLogo, BrandLogoVariant } from './BrandLogo';

interface BrandWatermarkProps {
  /** Pick a different artwork per panel so a page never repeats the same watermark. */
  variant?: BrandLogoVariant;
}

const LAYOUT: Record<BrandLogoVariant, { wrap: string; img: string }> = {
  mark: {
    wrap: '-right-4 top-1/2 -translate-y-1/2 h-[125%] max-h-80',
    img: 'h-full w-auto opacity-[0.07] dark:opacity-[0.09]'
  },
  lockup: {
    wrap: 'right-6 bottom-4 w-[min(26%,240px)]',
    img: 'w-full h-auto opacity-[0.09] dark:opacity-[0.11]'
  },
  wordmark: {
    wrap: 'right-5 top-1/2 -translate-y-1/2 w-[min(40%,380px)]',
    img: 'w-full h-auto opacity-[0.09] dark:opacity-[0.11]'
  },
  tile: {
    wrap: 'right-5 bottom-4 h-12 w-12 md:h-14 md:w-14',
    img: 'h-full w-full opacity-[0.12] dark:opacity-[0.16]'
  }
};

/** Faint Artify branding for hero/header panels. The parent must be `relative overflow-hidden`. */
export const BrandWatermark: React.FC<BrandWatermarkProps> = ({ variant = 'mark' }) => {
  const l = LAYOUT[variant];
  return (
    <div aria-hidden="true" className={`pointer-events-none select-none absolute -z-10 hidden sm:flex items-center justify-end ${l.wrap}`}>
      <BrandLogo variant={variant} className={l.img} alt="" />
    </div>
  );
};

import React from 'react';

const BRAND_ASSETS = {
  mark: '/brand/mark.png',
  lightFull: '/brand/logo-light-full.png',
  lightWordmark: '/brand/logo-light.png'
} as const;

interface BrandLogoProps {
  /** `mark` is the transparent "A" glyph for dark surfaces; `light` is the full colour lockup for light surfaces. */
  variant?: 'mark' | 'light' | 'light-full';
  className?: string;
  alt?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'mark', className = 'h-8 w-auto', alt = 'Artify' }) => {
  const src =
    variant === 'light-full' ? BRAND_ASSETS.lightFull : variant === 'light' ? BRAND_ASSETS.lightWordmark : BRAND_ASSETS.mark;
  return <img src={src} alt={alt} className={className} draggable={false} />;
};

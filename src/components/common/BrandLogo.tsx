import React from 'react';

const BRAND_ASSETS = {
  mark: '/brand/mark.png',
  wordmark: { light: '/brand/logo-wordmark-light.png', dark: '/brand/logo-wordmark-dark.png' },
  lockup: { light: '/brand/logo-lockup-light.png', dark: '/brand/logo-lockup-dark.png' },
  tile: { light: '/brand/tile-light.png', dark: '/brand/tile-dark.png' }
} as const;

export type BrandLogoVariant = 'mark' | 'wordmark' | 'lockup' | 'tile';

interface BrandLogoProps {
  /**
   * `mark` is the colour "A" glyph (transparent, works on both themes);
   * `wordmark` / `lockup` / `tile` swap to the light- or dark-surface artwork with the theme.
   */
  variant?: BrandLogoVariant;
  className?: string;
  alt?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'mark', className = 'h-8 w-auto', alt = 'Artify' }) => {
  if (variant === 'mark') {
    return <img src={BRAND_ASSETS.mark} alt={alt} className={className} draggable={false} decoding="async" />;
  }
  const set = BRAND_ASSETS[variant];
  return (
    <>
      <img src={set.light} alt={alt} className={`${className} dark:hidden`} draggable={false} decoding="async" />
      <img src={set.dark} alt={alt} className={`${className} hidden dark:block`} draggable={false} decoding="async" />
    </>
  );
};

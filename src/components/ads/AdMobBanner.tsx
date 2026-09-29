import React, { useEffect, useState } from 'react';
import { ADMOB_CONFIG } from '../../config/admob';
import { admobService } from '../../services/admobService';

interface AdMobBannerProps {
  className?: string;
  theme?: 'dark' | 'light';
}

export const AdMobBanner: React.FC<AdMobBannerProps> = ({ className = '', theme = 'dark' }) => {
  const [isOnline, setIsOnline] = useState<boolean>(admobService.isOnline());
  const [hasNativeBridge, setHasNativeBridge] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // @ts-ignore
    if (typeof window !== 'undefined' && window.AndroidAdMob) {
      setHasNativeBridge(true);
      try {
        // @ts-ignore
        window.AndroidAdMob.showBanner?.(ADMOB_CONFIG.AD_UNITS.BANNER);
      } catch (e) {
        console.warn('[AdMob] Native Banner error:', e);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      // @ts-ignore
      if (typeof window !== 'undefined' && window.AndroidAdMob?.hideBanner) {
        try {
          // @ts-ignore
          window.AndroidAdMob.hideBanner();
        } catch (e) {}
      }
    };
  }, []);

  if (!isOnline) {
    return null; // Completely hide when offline without empty boxes or error text
  }

  if (hasNativeBridge) {
    return (
      <div 
        id="admob-banner-container" 
        className={`w-full max-w-lg mx-auto min-h-[50px] my-3 select-none flex items-center justify-center ${className}`}
      />
    );
  }

  // Do not render HTML placeholders or raw IDs when native bridge is absent
  return null;
};

import React, { useState, useEffect } from 'react';
import { ADMOB_CONFIG } from '../../config/admob';
import { admobService } from '../../services/admobService';

interface AdMobNativeProps {
  language: 'ar' | 'en';
  theme: 'dark' | 'light';
}

export const AdMobNative: React.FC<AdMobNativeProps> = ({ language, theme }) => {
  const [isOnline, setIsOnline] = useState<boolean>(admobService.isOnline());
  const [hasNativeBridge, setHasNativeBridge] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // @ts-ignore
    if (typeof window !== 'undefined' && window.AndroidAdMob?.showNativeAd) {
      setHasNativeBridge(true);
      try {
        // @ts-ignore
        window.AndroidAdMob.showNativeAd(ADMOB_CONFIG.AD_UNITS.NATIVE);
      } catch (e) {
        console.warn('[AdMob] Native Ad error:', e);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) return null;

  if (hasNativeBridge) {
    return <div id="admob-native-container" className="w-full my-3 min-h-[100px]" />;
  }

  // Hide completely when native bridge is not available (no mock/placeholder cards or ID text)
  return null;
};

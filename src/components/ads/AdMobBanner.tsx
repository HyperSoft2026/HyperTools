import React, { useEffect, useState } from 'react';
import { ADMOB_CONFIG } from '../../config/admob';
import { admobService } from '../../services/admobService';

interface AdMobBannerProps {
  className?: string;
}

export const AdMobBanner: React.FC<AdMobBannerProps> = ({ className = '' }) => {
  const [isOnline, setIsOnline] = useState<boolean>(admobService.isOnline());

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return null; // Hide completely when offline without error
  }

  return (
    <div
      className={`w-full max-w-lg mx-auto p-2 my-3 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm text-center flex items-center justify-between px-4 select-none ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
          Ad
        </span>
        <span className="text-xs text-slate-400 font-medium">
          AdMob Banner ({ADMOB_CONFIG.AD_UNITS.BANNER.slice(-8)})
        </span>
      </div>
      <span className="text-[10px] text-slate-500 font-mono">HyperTools Ads</span>
    </div>
  );
};

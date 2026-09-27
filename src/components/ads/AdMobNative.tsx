import React, { useState, useEffect } from 'react';
import { ADMOB_CONFIG } from '../../config/admob';
import { admobService } from '../../services/admobService';
import { ExternalLink, Sparkles } from 'lucide-react';

interface AdMobNativeProps {
  language: 'ar' | 'en';
  theme: 'dark' | 'light';
}

export const AdMobNative: React.FC<AdMobNativeProps> = ({ language, theme }) => {
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

  if (!isOnline) return null;

  const isDark = theme === 'dark';

  return (
    <div
      className={`group relative rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between border ${
        isDark
          ? 'bg-slate-900/60 border-slate-800'
          : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
            {language === 'ar' ? 'إعلان مخصص' : 'Sponsored Ad'}
          </span>
        </div>

        <h3 className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {language === 'ar' ? 'إعلان AdMob Native' : 'AdMob Native Content'}
        </h3>

        <p className="text-xs text-slate-400 leading-relaxed">
          {language === 'ar'
            ? 'محتوى إعلاني مدمج من شبكة Google AdMob ودعم لتطوير التطبيق.'
            : 'Sponsored native content integrated via Google AdMob.'}
        </p>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-800/40 flex items-center justify-between text-[11px] text-slate-500">
        <span className="font-mono text-[10px]">ID: ...{ADMOB_CONFIG.AD_UNITS.NATIVE.slice(-6)}</span>
        <div className="flex items-center gap-1 text-purple-400 font-semibold">
          <span>{language === 'ar' ? 'عرض الإعلان' : 'Learn More'}</span>
          <ExternalLink className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};

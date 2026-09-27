import React, { useState } from 'react';
import { ADMOB_CONFIG } from '../../config/admob';
import { admobService } from '../../services/admobService';
import { Gift, X, PlayCircle, ShieldCheck, AlertCircle } from 'lucide-react';

interface AdMobRewardModalProps {
  isOpen: boolean;
  language: 'ar' | 'en';
  theme: 'dark' | 'light';
  onClose: () => void;
  onRewardGranted: (amount: number, item: string) => void;
}

export const AdMobRewardModal: React.FC<AdMobRewardModalProps> = ({
  isOpen,
  language,
  theme,
  onClose,
  onRewardGranted,
}) => {
  if (!isOpen) return null;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const isDark = theme === 'dark';

  const handleWatchRewarded = () => {
    if (!admobService.isOnline()) {
      setErrorMsg(
        language === 'ar'
          ? 'تنبيه: يلزم وجود اتصال بالإنترنت لتحميل الإعلان.'
          : 'Internet connection required to load ads.'
      );
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    admobService.showRewardedAd(
      (amount, item) => {
        setIsLoading(false);
        onRewardGranted(amount, item);
        onClose();
      },
      () => {
        setIsLoading(false);
      }
    );
  };

  const handleWatchRewardedInterstitial = () => {
    if (!admobService.isOnline()) {
      setErrorMsg(
        language === 'ar'
          ? 'تنبيه: يلزم وجود اتصال بالإنترنت لتحميل الإعلان.'
          : 'Internet connection required to load ads.'
      );
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    admobService.showRewardedInterstitial(
      (amount, item) => {
        setIsLoading(false);
        onRewardGranted(amount, item);
        onClose();
      },
      () => {
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl space-y-5 relative ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">
              {language === 'ar' ? 'مشاهدة إعلان لفتح الميزة' : 'Watch Ad to Unlock'}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'ar' ? 'احصل على مكافأة فتح ميزة اختيارية' : 'Earn 1 Unlock Reward upon completion'}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between font-mono text-slate-300">
            <span>{language === 'ar' ? 'مقدار المكافأة:' : 'Reward Amount:'}</span>
            <span className="font-bold text-amber-400">{ADMOB_CONFIG.REWARD_SETTINGS.AMOUNT}</span>
          </div>
          <div className="flex justify-between font-mono text-slate-300">
            <span>{language === 'ar' ? 'عنصر المكافأة:' : 'Reward Item:'}</span>
            <span className="font-bold text-purple-400">{ADMOB_CONFIG.REWARD_SETTINGS.ITEM}</span>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <button
            onClick={handleWatchRewarded}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <PlayCircle className="w-5 h-5" />
            <span>
              {isLoading
                ? language === 'ar'
                  ? 'جاري تحميل الإعلان...'
                  : 'Loading Ad...'
                : language === 'ar'
                ? 'مشاهدة إعلان بمكافأة (Rewarded Ad)'
                : 'Watch Rewarded Ad'}
            </span>
          </button>

          <button
            onClick={handleWatchRewardedInterstitial}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>
              {language === 'ar'
                ? 'مشاهدة إعلان بيني بمكافأة (Rewarded Interstitial)'
                : 'Watch Rewarded Interstitial'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

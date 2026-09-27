import React, { useEffect, useState } from 'react';
import { HyperLogo } from './HyperLogo';
import { Language, Theme } from '../types';

interface SplashScreenProps {
  language: Language;
  theme: Theme;
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  language,
  theme,
  onFinish,
}) => {
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    // Show splash for 1.8 seconds then trigger smooth fadeout
    const timer1 = setTimeout(() => {
      setIsFadingOut(true);
    }, 1800);

    const timer2 = setTimeout(() => {
      onFinish();
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-8 transition-opacity duration-400 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } ${
        isDark
          ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white'
          : 'bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900'
      }`}
    >
      {/* Top Spacer */}
      <div className="w-full" />

      {/* Center Branding Content */}
      <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-sm animate-in zoom-in-95 duration-500">
        <HyperLogo size="lg" showText={false} theme={theme} language={language} />

        <div className="space-y-1">
          <div className="text-sm font-semibold tracking-widest text-purple-400 uppercase">
            HyperSoft
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Hyper<span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">Tools</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium pt-1">
            {language === 'ar'
              ? 'أدوات تقنية وبرمجية احترافية'
              : 'Professional Developer & Utility Tools'}
          </p>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="flex flex-col items-center text-center space-y-1">
        <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
          Local-First Engine
        </span>
        <span className="text-[10px] text-slate-600 font-mono">
          By HyperSoft
        </span>
      </div>
    </div>
  );
};

import React from 'react';
import { Language, Theme, LegalPage } from '../../types';
import { HyperLogo } from '../HyperLogo';
import {
  Globe,
  Sun,
  Moon,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Info,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Gift,
} from 'lucide-react';
import { translations } from '../../data/translations';

interface SettingsViewProps {
  language: Language;
  theme: Theme;
  onLanguageToggle: () => void;
  onThemeToggle: () => void;
  onSelectLegal: (page: LegalPage) => void;
  onOpenRewardModal: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  language,
  theme,
  onLanguageToggle,
  onThemeToggle,
  onSelectLegal,
  onOpenRewardModal,
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';
  const isAr = language === 'ar';
  const ChevronIcon = isAr ? ChevronLeft : ChevronRight;

  const handleOpenWebsite = () => {
    window.open('https://51.75.118.17:20137', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          {t.settings}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {isAr
            ? 'تخصيص تفضيلات التطبيق واللغة والمظهر والمعلومات القانونية.'
            : 'Customize app options, language, theme, and view legal policies.'}
        </p>
      </div>

      {/* Language & Theme Controls */}
      <div
        className={`p-5 rounded-2xl border space-y-4 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-sm font-bold">{t.language}</div>
              <div className="text-xs text-slate-400">
                {isAr ? 'العربية (RTL)' : 'English (LTR)'}
              </div>
            </div>
          </div>

          <button
            onClick={onLanguageToggle}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
          >
            {isAr ? 'Switch to English' : 'التحويل للعربية'}
          </button>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-purple-500" />
            )}
            <div>
              <div className="text-sm font-bold">{t.theme}</div>
              <div className="text-xs text-slate-400">
                {isDark ? t.darkMode : t.lightMode}
              </div>
            </div>
          </div>

          <button
            onClick={onThemeToggle}
            className={`px-4 py-2 rounded-xl border font-bold text-xs transition-colors ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
            }`}
          >
            {isDark ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      {/* Optional AdMob Reward Trigger */}
      <div
        className={`p-4 rounded-2xl border flex items-center justify-between ${
          isDark
            ? 'bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border-purple-500/30'
            : 'bg-purple-50 border-purple-200 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              {isAr ? 'شاهد إعلان لفتح ميزة (Rewarded)' : 'Watch Ad for Reward'}
            </div>
            <div className="text-[11px] text-slate-400">
              {isAr ? 'احصل على مكافأة مشاهدة الإعلان' : 'Watch an ad to unlock items'}
            </div>
          </div>
        </div>

        <button
          onClick={onOpenRewardModal}
          className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shadow-sm"
        >
          {isAr ? 'فتح' : 'Watch'}
        </button>
      </div>

      {/* Information & Legal Section */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-400 px-1">
          {t.infoAndLegal}
        </div>

        <div
          className={`rounded-2xl border divide-y overflow-hidden ${
            isDark
              ? 'bg-slate-900/80 border-slate-800 divide-slate-800/80'
              : 'bg-white border-slate-200 divide-slate-100 shadow-sm'
          }`}
        >
          {/* Privacy Policy */}
          <button
            onClick={() => onSelectLegal('privacy')}
            className={`w-full p-4 text-left flex items-center justify-between transition-colors ${
              isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-semibold">{t.privacyPolicy}</span>
            </div>
            <ChevronIcon className="w-4 h-4 text-slate-500" />
          </button>

          {/* Terms of Use */}
          <button
            onClick={() => onSelectLegal('terms')}
            className={`w-full p-4 text-left flex items-center justify-between transition-colors ${
              isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold">{t.termsOfUse}</span>
            </div>
            <ChevronIcon className="w-4 h-4 text-slate-500" />
          </button>

          {/* Disclaimer */}
          <button
            onClick={() => onSelectLegal('disclaimer')}
            className={`w-full p-4 text-left flex items-center justify-between transition-colors ${
              isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-semibold">{t.disclaimer}</span>
            </div>
            <ChevronIcon className="w-4 h-4 text-slate-500" />
          </button>

          {/* About HyperTools */}
          <button
            onClick={() => onSelectLegal('about')}
            className={`w-full p-4 text-left flex items-center justify-between transition-colors ${
              isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-semibold">{t.aboutAppTitle}</span>
            </div>
            <ChevronIcon className="w-4 h-4 text-slate-500" />
          </button>

          {/* HyperSoft Website */}
          <button
            onClick={handleOpenWebsite}
            className={`w-full p-4 text-left flex items-center justify-between transition-colors ${
              isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="w-5 h-5 text-indigo-400" />
              <span className="text-sm font-semibold">{t.hyperSoftWebsite}</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* HyperSoft About Branding */}
      <div
        className={`p-6 rounded-2xl border space-y-4 text-center ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex justify-center">
          <HyperLogo size="lg" showText={true} theme={theme} language={language} />
        </div>

        <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
          {t.aboutApp}
        </p>

        <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-500 flex items-center justify-between font-mono">
          <span>v1.0.0 (Android Edition)</span>
          <span>HyperTools By HyperSoft</span>
        </div>
      </div>
    </div>
  );
};

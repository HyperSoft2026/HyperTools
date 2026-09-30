import React from 'react';
import { Language, Theme, LegalPage, AppTheme } from '../../types';
import { HyperLogo } from '../HyperLogo';
import { ThemeSelector } from '../ThemeSelector';
import { appThemes } from '../../data/themes';
import {
  Globe,
  Sun,
  Moon,
  Palette,
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
  appTheme: AppTheme;
  onLanguageToggle: () => void;
  onThemeToggle: () => void;
  onSelectAppTheme: (theme: AppTheme) => void;
  onSelectLegal: (page: LegalPage) => void;
  onOpenRewardModal: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  language,
  theme,
  appTheme,
  onLanguageToggle,
  onThemeToggle,
  onSelectAppTheme,
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

  const currentThemeObj = appThemes.find((item) => item.id === appTheme);

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h1 style={{ color: 'var(--theme-text)' }} className="text-xl sm:text-2xl font-bold tracking-tight">
          {t.settings}
        </h1>
        <p style={{ color: 'var(--theme-text-secondary)' }} className="text-xs sm:text-sm">
          {isAr
            ? 'تخصيص تفضيلات التطبيق واللغة والمظهر والمعلومات القانونية.'
            : 'Customize app options, language, theme, and view legal policies.'}
        </p>
      </div>

      {/* Language & Theme Controls */}
      <div
        style={{
          backgroundColor: 'var(--theme-surface)',
          borderColor: 'var(--theme-border)',
        }}
        className="p-5 rounded-2xl border space-y-4 shadow-xs"
      >
        <div
          style={{ borderColor: 'var(--theme-border)' }}
          className="flex items-center justify-between py-2 border-b"
        >
          <div className="flex items-center gap-3">
            <Globe style={{ color: 'var(--theme-primary)' }} className="w-5 h-5" />
            <div>
              <div style={{ color: 'var(--theme-text)' }} className="text-sm font-bold">
                {t.language}
              </div>
              <div style={{ color: 'var(--theme-text-secondary)' }} className="text-xs">
                {isAr ? 'العربية (RTL)' : 'English (LTR)'}
              </div>
            </div>
          </div>

          <button
            onClick={onLanguageToggle}
            style={{
              background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))',
              color: 'var(--theme-primary-text)',
              boxShadow: 'var(--theme-shadow)',
            }}
            className="px-4 py-2 rounded-xl font-bold text-xs transition-opacity hover:opacity-90 shadow-xs"
          >
            {isAr ? 'Switch to English' : 'التحويل للعربية'}
          </button>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon style={{ color: 'var(--theme-primary)' }} className="w-5 h-5" />
            )}
            <div>
              <div style={{ color: 'var(--theme-text)' }} className="text-sm font-bold">
                {t.theme}
              </div>
              <div style={{ color: 'var(--theme-text-secondary)' }} className="text-xs">
                {isDark ? t.darkMode : t.lightMode}
              </div>
            </div>
          </div>

          <button
            onClick={onThemeToggle}
            style={{
              backgroundColor: 'var(--theme-surface-elevated)',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text)',
            }}
            className="px-4 py-2 rounded-xl border font-bold text-xs transition-colors hover:opacity-90 shadow-xs"
          >
            {isDark ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      {/* App Themes Section (6 Themes with Previews) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold px-1">
          <div className="flex items-center gap-2">
            <Palette style={{ color: 'var(--theme-primary)' }} className="w-4 h-4" />
            <span style={{ color: 'var(--theme-text)' }}>
              {isAr ? 'مظهر التطبيق (App Themes)' : 'App Theme & Style'}
            </span>
          </div>
          <span
            style={{ color: 'var(--theme-primary)' }}
            className="text-[11px] font-bold font-mono"
          >
            {currentThemeObj?.[isAr ? 'nameAr' : 'nameEn']}
          </span>
        </div>

        <ThemeSelector
          currentTheme={appTheme}
          language={language}
          theme={theme}
          onSelectTheme={onSelectAppTheme}
        />
      </div>

      {/* Optional AdMob Reward Trigger */}
      <div
        style={{
          background: 'var(--theme-hero-gradient)',
          borderColor: 'var(--theme-hero-border)',
          boxShadow: 'var(--theme-shadow)',
        }}
        className="p-4 rounded-2xl border flex items-center justify-between shadow-md"
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              backgroundColor: 'var(--theme-primary-subtle)',
              color: 'var(--theme-primary)',
            }}
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-current"
          >
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <div style={{ color: 'var(--theme-text)' }} className="text-xs font-bold">
              {isAr ? 'شاهد إعلان لفتح ميزة (Rewarded)' : 'Watch Ad for Reward'}
            </div>
            <div style={{ color: 'var(--theme-text-secondary)' }} className="text-[11px]">
              {isAr ? 'احصل على مكافأة مشاهدة الإعلان' : 'Watch an ad to unlock items'}
            </div>
          </div>
        </div>

        <button
          onClick={onOpenRewardModal}
          style={{
            background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))',
            color: 'var(--theme-primary-text)',
          }}
          className="px-3.5 py-2 rounded-xl font-bold text-xs transition-opacity hover:opacity-90 shadow-xs"
        >
          {isAr ? 'فتح' : 'Watch'}
        </button>
      </div>

      {/* Information & Legal Section */}
      <div className="space-y-3">
        <div style={{ color: 'var(--theme-text-secondary)' }} className="text-xs font-bold px-1">
          {t.infoAndLegal}
        </div>

        <div
          style={{
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'var(--theme-border)',
          }}
          className="rounded-2xl border divide-y overflow-hidden shadow-xs"
        >
          {/* Privacy Policy */}
          <button
            onClick={() => onSelectLegal('privacy')}
            style={{ borderColor: 'var(--theme-border)' }}
            className="w-full p-4 text-left flex items-center justify-between transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span style={{ color: 'var(--theme-text)' }} className="text-sm font-semibold">
                {t.privacyPolicy}
              </span>
            </div>
            <ChevronIcon style={{ color: 'var(--theme-text-secondary)' }} className="w-4 h-4" />
          </button>

          {/* Terms of Use */}
          <button
            onClick={() => onSelectLegal('terms')}
            style={{ borderColor: 'var(--theme-border)' }}
            className="w-full p-4 text-left flex items-center justify-between transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <FileText style={{ color: 'var(--theme-primary)' }} className="w-5 h-5" />
              <span style={{ color: 'var(--theme-text)' }} className="text-sm font-semibold">
                {t.termsOfUse}
              </span>
            </div>
            <ChevronIcon style={{ color: 'var(--theme-text-secondary)' }} className="w-4 h-4" />
          </button>

          {/* Disclaimer */}
          <button
            onClick={() => onSelectLegal('disclaimer')}
            style={{ borderColor: 'var(--theme-border)' }}
            className="w-full p-4 text-left flex items-center justify-between transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span style={{ color: 'var(--theme-text)' }} className="text-sm font-semibold">
                {t.disclaimer}
              </span>
            </div>
            <ChevronIcon style={{ color: 'var(--theme-text-secondary)' }} className="w-4 h-4" />
          </button>

          {/* About HyperTools */}
          <button
            onClick={() => onSelectLegal('about')}
            style={{ borderColor: 'var(--theme-border)' }}
            className="w-full p-4 text-left flex items-center justify-between transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <Info style={{ color: 'var(--theme-accent)' }} className="w-5 h-5" />
              <span style={{ color: 'var(--theme-text)' }} className="text-sm font-semibold">
                {t.aboutAppTitle}
              </span>
            </div>
            <ChevronIcon style={{ color: 'var(--theme-text-secondary)' }} className="w-4 h-4" />
          </button>

          {/* HyperSoft Website */}
          <button
            onClick={handleOpenWebsite}
            style={{ borderColor: 'var(--theme-border)' }}
            className="w-full p-4 text-left flex items-center justify-between transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <ExternalLink style={{ color: 'var(--theme-secondary)' }} className="w-5 h-5" />
              <span style={{ color: 'var(--theme-text)' }} className="text-sm font-semibold">
                {t.hyperSoftWebsite}
              </span>
            </div>
            <ExternalLink style={{ color: 'var(--theme-text-secondary)' }} className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* HyperSoft About Branding */}
      <div
        style={{
          backgroundColor: 'var(--theme-surface)',
          borderColor: 'var(--theme-border)',
        }}
        className="p-6 rounded-2xl border space-y-4 text-center shadow-xs"
      >
        <div className="flex justify-center">
          <HyperLogo size="lg" showText={true} theme={theme} language={language} />
        </div>

        <p style={{ color: 'var(--theme-text-secondary)' }} className="text-xs leading-relaxed max-w-md mx-auto">
          {t.aboutApp}
        </p>

        <div
          style={{ borderColor: 'var(--theme-border)', color: 'var(--theme-text-secondary)' }}
          className="pt-2 border-t text-[11px] flex items-center justify-between font-mono"
        >
          <span>v1.0.1 (Android Edition)</span>
          <span>HyperTools By HyperSoft</span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Language, Theme, TabView } from '../types';
import { HyperLogo } from './HyperLogo';
import { Moon, Sun, Globe, Heart, Home, Grid } from 'lucide-react';

interface HeaderProps {
  language: Language;
  theme: Theme;
  activeTab: TabView;
  favoritesCount: number;
  onLanguageToggle: () => void;
  onThemeToggle: () => void;
  onSelectTab: (tab: TabView) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  theme,
  activeTab,
  favoritesCount,
  onLanguageToggle,
  onThemeToggle,
  onSelectTab,
}) => {
  const isDark = theme === 'dark';

  return (
    <header
      style={{
        backgroundColor: 'var(--theme-nav-bg)',
        borderColor: 'var(--theme-border)',
      }}
      className="sticky top-0 z-40 w-full transition-colors duration-200 border-b backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Brand Mark */}
        <div
          onClick={() => onSelectTab('home')}
          className="cursor-pointer hover:opacity-90 transition-opacity"
        >
          <HyperLogo size="md" showText={true} theme={theme} language={language} />
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav
          style={{
            backgroundColor: 'var(--theme-surface-elevated)',
            borderColor: 'var(--theme-border)',
          }}
          className="hidden md:flex items-center gap-1 p-1 rounded-xl border"
        >
          <button
            onClick={() => onSelectTab('home')}
            style={
              activeTab === 'home'
                ? {
                    background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))',
                    color: 'var(--theme-primary-text)',
                    boxShadow: 'var(--theme-shadow)',
                  }
                : {
                    color: 'var(--theme-text-secondary)',
                  }
            }
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
          >
            <Home className="w-4 h-4" />
            <span>{language === 'ar' ? 'الرئيسية' : 'Home'}</span>
          </button>

          <button
            onClick={() => onSelectTab('tools')}
            style={
              activeTab === 'tools' || activeTab === 'tool-detail'
                ? {
                    background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))',
                    color: 'var(--theme-primary-text)',
                    boxShadow: 'var(--theme-shadow)',
                  }
                : {
                    color: 'var(--theme-text-secondary)',
                  }
            }
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
          >
            <Grid className="w-4 h-4" />
            <span>{language === 'ar' ? 'الأدوات' : 'Tools'}</span>
          </button>

          <button
            onClick={() => onSelectTab('favorites')}
            style={
              activeTab === 'favorites'
                ? {
                    background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))',
                    color: 'var(--theme-primary-text)',
                    boxShadow: 'var(--theme-shadow)',
                  }
                : {
                    color: 'var(--theme-text-secondary)',
                  }
            }
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative hover:opacity-90"
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>{language === 'ar' ? 'المفضلة' : 'Favorites'}</span>
            {favoritesCount > 0 && (
              <span
                style={{
                  backgroundColor: 'var(--theme-accent)',
                  color: '#ffffff',
                }}
                className="text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-xs"
              >
                {favoritesCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Quick Action Switches */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            onClick={onLanguageToggle}
            style={{
              backgroundColor: 'var(--theme-surface-elevated)',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-primary)',
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border hover:opacity-90 shadow-xs"
            title={language === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'EN' : 'العربية'}</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onThemeToggle}
            style={{
              backgroundColor: 'var(--theme-surface-elevated)',
              borderColor: 'var(--theme-border)',
            }}
            className="p-2 rounded-xl transition-all border hover:opacity-90 shadow-xs"
            title={isDark ? 'Switch to Light Mode' : 'التحويل للوضع الداكن'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon style={{ color: 'var(--theme-primary)' }} className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { Language, Theme, TabView } from '../types';
import { HyperLogo } from './HyperLogo';
import { Moon, Sun, Globe, Heart, Home, Grid, Sparkles } from 'lucide-react';

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
      className={`sticky top-0 z-40 w-full transition-colors duration-200 border-b ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 text-white backdrop-blur-md'
          : 'bg-white/90 border-slate-200 text-slate-900 backdrop-blur-md'
      }`}
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
        <nav className="hidden md:flex items-center gap-1 bg-slate-800/40 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-700/50">
          <button
            onClick={() => onSelectTab('home')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'home'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>{language === 'ar' ? 'الرئيسية' : 'Home'}</span>
          </button>

          <button
            onClick={() => onSelectTab('tools')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tools' || activeTab === 'tool-detail'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>{language === 'ar' ? 'الأدوات' : 'Tools'}</span>
          </button>

          <button
            onClick={() => onSelectTab('favorites')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
              activeTab === 'favorites'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>{language === 'ar' ? 'المفضلة' : 'Favorites'}</span>
            {favoritesCount > 0 && (
              <span className="bg-pink-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isDark
                ? 'bg-slate-800/80 border-slate-700/80 text-purple-300 hover:bg-slate-700 hover:text-white'
                : 'bg-slate-100 border-slate-200 text-purple-700 hover:bg-slate-200'
            }`}
            title={language === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'EN' : 'العربية'}</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onThemeToggle}
            className={`p-2 rounded-xl transition-all border ${
              isDark
                ? 'bg-slate-800/80 border-slate-700/80 text-amber-400 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};

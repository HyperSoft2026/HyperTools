import React from 'react';
import { TabView, Language, Theme } from '../types';
import { Home, Grid, Heart, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: TabView;
  language: Language;
  theme: Theme;
  favoritesCount: number;
  onSelectTab: (tab: TabView) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  language,
  theme,
  favoritesCount,
  onSelectTab,
}) => {
  const isDark = theme === 'dark';

  const navItems = [
    {
      id: 'home' as TabView,
      labelAr: 'الرئيسية',
      labelEn: 'Home',
      icon: Home,
    },
    {
      id: 'tools' as TabView,
      labelAr: 'الأدوات',
      labelEn: 'Tools',
      icon: Grid,
    },
    {
      id: 'favorites' as TabView,
      labelAr: 'المفضلة',
      labelEn: 'Favorites',
      icon: Heart,
      badge: favoritesCount > 0 ? favoritesCount : null,
    },
    {
      id: 'settings' as TabView,
      labelAr: 'الإعدادات',
      labelEn: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden border-t transition-colors duration-200 ${
        isDark
          ? 'bg-slate-900/95 border-slate-800 text-slate-300 backdrop-blur-lg'
          : 'bg-white/95 border-slate-200 text-slate-600 backdrop-blur-lg shadow-lg'
      }`}
    >
      <div className="grid grid-cols-4 h-16 max-w-md mx-auto items-center px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id || (item.id === 'tools' && activeTab === 'tool-detail');

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center h-full w-full relative transition-all active:scale-95 ${
                isActive
                  ? 'text-purple-500 font-bold'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2.5 bg-pink-500 text-white text-[9px] font-black px-1 py-0.2 rounded-full min-w-[15px] text-center shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1">
                {language === 'ar' ? item.labelAr : item.labelEn}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-purple-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

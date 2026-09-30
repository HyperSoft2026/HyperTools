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
      style={{
        backgroundColor: 'var(--theme-nav-bg)',
        borderColor: 'var(--theme-border)',
      }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t transition-colors duration-200 backdrop-blur-lg shadow-lg"
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
              style={
                isActive
                  ? { color: 'var(--theme-primary)' }
                  : { color: 'var(--theme-text-secondary)' }
              }
              className={`flex flex-col items-center justify-center h-full w-full relative transition-all active:scale-95 ${
                isActive ? 'font-bold' : ''
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'
                  }`}
                />
                {item.badge && (
                  <span
                    style={{
                      backgroundColor: 'var(--theme-accent)',
                      color: '#ffffff',
                    }}
                    className="absolute -top-1.5 -right-2.5 text-[9px] font-black px-1 py-0.2 rounded-full min-w-[15px] text-center shadow-xs"
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1">
                {language === 'ar' ? item.labelAr : item.labelEn}
              </span>
              {isActive && (
                <span
                  style={{
                    backgroundColor: 'var(--theme-primary)',
                    boxShadow: '0 0 8px var(--theme-primary)',
                  }}
                  className="absolute bottom-1 w-1.5 h-1.5 rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

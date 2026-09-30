import React from 'react';
import { AppTheme, Language, Theme } from '../types';
import { appThemes, ThemeDefinition } from '../data/themes';
import { Check } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: AppTheme;
  language: Language;
  theme: Theme; // 'dark' | 'light'
  onSelectTheme: (themeId: AppTheme) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  language,
  theme,
  onSelectTheme,
}) => {
  const isDark = theme === 'dark';
  const isAr = language === 'ar';

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {appThemes.map((item: ThemeDefinition) => {
          const isSelected = currentTheme === item.id;

          return (
            <div
              key={item.id}
              onClick={() => onSelectTheme(item.id)}
              style={
                isSelected
                  ? {
                      borderColor: item.primaryHex,
                      boxShadow: `0 0 0 2px ${item.primaryHex}70, 0 10px 25px -5px ${item.primaryHex}35`,
                      backgroundColor: `${item.primaryHex}1a`,
                    }
                  : {
                      backgroundColor: 'var(--theme-surface)',
                      borderColor: 'var(--theme-border)',
                    }
              }
              className="relative rounded-2xl p-4 border transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xs hover:border-[var(--theme-border-hover)]"
            >
              {/* Header: Name, Badge & Selection Radio */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4
                        style={{ color: isSelected ? item.primaryHex : 'var(--theme-text)' }}
                        className="text-sm font-bold"
                      >
                        {isAr ? item.nameAr : item.nameEn}
                      </h4>
                    </div>
                    <span
                      style={{
                        backgroundColor: 'var(--theme-surface-elevated)',
                        color: isSelected ? item.primaryHex : 'var(--theme-text-secondary)',
                        borderColor: 'var(--theme-border)',
                      }}
                      className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                    >
                      {isAr ? item.badgeAr : item.badgeEn}
                    </span>
                  </div>

                  <div
                    style={
                      isSelected
                        ? {
                            backgroundColor: item.primaryHex,
                            borderColor: item.primaryHex,
                            color: '#ffffff',
                          }
                        : {
                            backgroundColor: 'var(--theme-surface-elevated)',
                            borderColor: 'var(--theme-border)',
                          }
                    }
                    className="w-6 h-6 rounded-full border flex items-center justify-center transition-all shrink-0"
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <p
                  style={{ color: 'var(--theme-text-secondary)' }}
                  className="text-xs line-clamp-2 leading-relaxed mb-3"
                >
                  {isAr ? item.descAr : item.descEn}
                </p>
              </div>

              {/* Theme Mini Visual Preview */}
              <div
                style={{
                  backgroundColor: 'var(--theme-input)',
                  borderColor: 'var(--theme-border)',
                }}
                className="p-2.5 rounded-xl border flex items-center justify-between"
              >
                {/* 4-Color Swatch Preview */}
                <div className="flex items-center gap-1.5">
                  {item.palette.map((color, idx) => (
                    <span
                      key={idx}
                      className="w-4 h-4 rounded-full border border-black/20 shadow-xs"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Simulated UI Component Preview */}
                <div className="flex items-center gap-1.5">
                  <div
                    className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-xs"
                    style={{ backgroundColor: item.primaryHex }}
                  >
                    {isAr ? 'زر تجريبي' : 'Button'}
                  </div>
                  <div
                    className="w-4 h-4 rounded-md border"
                    style={{ borderColor: item.accentHex, backgroundColor: `${item.accentHex}20` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { Tool, Language, Theme } from '../../types';
import { ToolCard } from '../ToolCard';
import { Heart } from 'lucide-react';
import { translations } from '../../data/translations';

interface FavoritesViewProps {
  tools: Tool[];
  language: Language;
  theme: Theme;
  favorites: string[];
  recentToolIds?: string[];
  onSelectTool: (tool: Tool) => void;
  onToggleFavorite: (toolId: string, e: React.MouseEvent) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  tools,
  language,
  theme,
  favorites,
  recentToolIds = [],
  onSelectTool,
  onToggleFavorite,
}) => {
  const t = translations[language];

  const favoriteTools = tools.filter((t) => favorites.includes(t.id));

  return (
    <div className="space-y-6 pb-20">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
          <h1 style={{ color: 'var(--theme-text)' }} className="text-xl sm:text-2xl font-bold tracking-tight">
            {t.favorites}
          </h1>
        </div>
        <p style={{ color: 'var(--theme-text-secondary)' }} className="text-xs sm:text-sm">
          {language === 'ar'
            ? 'الأدوات التي قمت بنجمها للحصول على وصول سريع ومباشر.'
            : 'Your starred tools for fast, one-tap access.'}
        </p>
      </div>

      {favoriteTools.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'var(--theme-border)',
          }}
          className="p-12 text-center rounded-3xl border space-y-3 shadow-xs"
        >
          <div className="w-14 h-14 rounded-2xl bg-pink-500/10 text-pink-500 mx-auto flex items-center justify-center">
            <Heart className="w-7 h-7" />
          </div>
          <p style={{ color: 'var(--theme-text)' }} className="text-sm font-bold">
            {t.noFavoritesYet}
          </p>
          <p style={{ color: 'var(--theme-text-secondary)' }} className="text-xs max-w-sm mx-auto">
            {language === 'ar'
              ? 'اضغط على رمز النجمة على أي أداة لإضافتها إلى المفضلة لتصل إليها بنقرة واحدة.'
              : 'Click the star icon on any tool card to add it here for instant one-tap access.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              language={language}
              theme={theme}
              isFavorite={true}
              isRecent={recentToolIds.includes(tool.id)}
              onSelect={onSelectTool}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

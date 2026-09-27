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
  onSelectTool: (tool: Tool) => void;
  onToggleFavorite: (toolId: string, e: React.MouseEvent) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  tools,
  language,
  theme,
  favorites,
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
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {t.favorites}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          {language === 'ar'
            ? 'الأدوات التي قمت بنجمها للحصول على وصول سريع ومباشر.'
            : 'Your starred tools for fast, one-tap access.'}
        </p>
      </div>

      {favoriteTools.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <Heart className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-slate-400 text-sm font-semibold">{t.noFavoritesYet}</p>
          <p className="text-slate-500 text-xs">
            {language === 'ar'
              ? 'اضغط على رمز النجمة على أي أداة لإضافتها إلى المفضلة.'
              : 'Click the star icon on any tool card to add it here.'}
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
              onSelect={onSelectTool}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

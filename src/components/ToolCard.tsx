import React from 'react';
import { Tool, Language, Theme } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { Star } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  language: Language;
  theme: Theme;
  isFavorite: boolean;
  onSelect: (tool: Tool) => void;
  onToggleFavorite: (toolId: string, e: React.MouseEvent) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  language,
  theme,
  isFavorite,
  onSelect,
  onToggleFavorite,
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      onClick={() => onSelect(tool)}
      className={`group relative rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between border ${
        isDark
          ? 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 hover:border-purple-500/50 shadow-md hover:shadow-purple-500/10'
          : 'bg-white hover:bg-slate-50/90 border-slate-200/80 hover:border-purple-300 shadow-sm hover:shadow-md'
      }`}
    >
      <div>
        {/* Top Header: Icon & Favorite Toggle */}
        <div className="flex items-center justify-between mb-3">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-white shadow-md shadow-purple-500/10 group-hover:scale-105 transition-transform duration-200`}
          >
            <DynamicIcon name={tool.iconName} className="w-6 h-6 text-white" />
          </div>

          <button
            onClick={(e) => onToggleFavorite(tool.id, e)}
            className={`p-2 rounded-xl transition-colors ${
              isFavorite
                ? 'text-amber-400 bg-amber-400/10'
                : isDark
                ? 'text-slate-600 hover:text-slate-300 hover:bg-slate-800'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Tool Title */}
        <h3
          className={`font-bold text-sm sm:text-base mb-1 line-clamp-1 ${
            isDark ? 'text-white group-hover:text-purple-300' : 'text-slate-900 group-hover:text-purple-600'
          }`}
        >
          {language === 'ar' ? tool.titleAr : tool.titleEn}
        </h3>

        {/* Tool Description */}
        <p
          className={`text-xs line-clamp-2 leading-relaxed ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          {language === 'ar' ? tool.descAr : tool.descEn}
        </p>
      </div>

      {/* Footer Badges */}
      <div className="mt-3 pt-2 border-t border-slate-800/40 dark:border-slate-800 flex items-center justify-between text-[11px]">
        <span
          className={`font-medium ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}
        >
          {tool.category.toUpperCase()}
        </span>

        {tool.isPopular && (
          <span className="bg-purple-500/10 text-purple-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-purple-500/20">
            {language === 'ar' ? 'شائع' : 'Popular'}
          </span>
        )}
        {tool.isNew && (
          <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-cyan-500/20">
            {language === 'ar' ? 'جديد' : 'New'}
          </span>
        )}
      </div>
    </div>
  );
};

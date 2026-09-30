import React from 'react';
import { Tool, Language, Theme } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { Star } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  language: Language;
  theme: Theme;
  isFavorite: boolean;
  isRecent?: boolean;
  onSelect: (tool: Tool) => void;
  onToggleFavorite: (toolId: string, e: React.MouseEvent) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  language,
  theme,
  isFavorite,
  isRecent,
  onSelect,
  onToggleFavorite,
}) => {
  return (
    <div
      onClick={() => onSelect(tool)}
      style={{
        backgroundColor: 'var(--theme-card)',
        borderColor: 'var(--theme-border)',
      }}
      className="group relative rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between border shadow-sm hover:shadow-lg hover:border-[var(--theme-border-hover)]"
    >
      <div>
        {/* Top Header: Icon & Favorite Toggle */}
        <div className="flex items-center justify-between mb-3">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200`}
          >
            <DynamicIcon name={tool.iconName} className="w-6 h-6 text-white" />
          </div>

          <button
            onClick={(e) => onToggleFavorite(tool.id, e)}
            style={
              isFavorite
                ? {
                    color: '#fbbf24',
                    backgroundColor: 'rgba(251, 191, 36, 0.15)',
                    borderColor: 'rgba(251, 191, 36, 0.35)',
                  }
                : {
                    color: 'var(--theme-text-secondary)',
                    backgroundColor: 'var(--theme-surface-elevated)',
                    borderColor: 'transparent',
                  }
            }
            className="p-2 rounded-xl transition-all border hover:border-[var(--theme-border)]"
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Tool Title */}
        <h3
          style={{ color: 'var(--theme-text)' }}
          className="font-bold text-sm sm:text-base mb-1 line-clamp-1 group-hover:text-[var(--theme-primary)] transition-colors"
        >
          {language === 'ar' ? tool.titleAr : tool.titleEn}
        </h3>

        {/* Tool Description */}
        <p
          style={{ color: 'var(--theme-text-secondary)' }}
          className="text-xs line-clamp-2 leading-relaxed"
        >
          {language === 'ar' ? tool.descAr : tool.descEn}
        </p>
      </div>

      {/* Footer Badges */}
      <div
        style={{ borderColor: 'var(--theme-border)' }}
        className="mt-3 pt-2 border-t flex items-center justify-between text-[11px]"
      >
        <span
          style={{ color: 'var(--theme-text-secondary)' }}
          className="font-semibold text-[10px] tracking-wider uppercase"
        >
          {tool.category}
        </span>

        <div className="flex items-center gap-1.5 flex-wrap">
          {isRecent && (
            <span
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                borderColor: 'rgba(16, 185, 129, 0.3)',
                color: 'var(--theme-success, #10b981)',
              }}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
            >
              {language === 'ar' ? 'مؤخراً' : 'Recent'}
            </span>
          )}
          {tool.isPopular && (
            <span
              style={{
                backgroundColor: 'var(--theme-primary-subtle)',
                borderColor: 'var(--theme-border)',
                color: 'var(--theme-primary)',
              }}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
            >
              {language === 'ar' ? 'شائع' : 'Popular'}
            </span>
          )}
          {tool.isNew && (
            <span
              style={{
                backgroundColor: 'rgba(6, 182, 212, 0.15)',
                borderColor: 'var(--theme-border)',
                color: 'var(--theme-accent)',
              }}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
            >
              {language === 'ar' ? 'جديد' : 'New'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

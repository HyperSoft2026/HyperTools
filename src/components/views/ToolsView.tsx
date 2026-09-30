import React, { useState } from 'react';
import { Category, Tool, Language, Theme, CategoryId } from '../../types';
import { CategoryFilter } from '../CategoryFilter';
import { ToolCard } from '../ToolCard';
import { Search, X, SearchX, RotateCcw } from 'lucide-react';
import { translations } from '../../data/translations';
import { logSearchUsed, logCategorySelected } from '../../services/firebaseAnalytics';

interface ToolsViewProps {
  tools: Tool[];
  categories: Category[];
  language: Language;
  theme: Theme;
  favorites: string[];
  recentToolIds?: string[];
  onSelectTool: (tool: Tool) => void;
  onToggleFavorite: (toolId: string, e: React.MouseEvent) => void;
}

export const ToolsView: React.FC<ToolsViewProps> = ({
  tools,
  categories,
  language,
  theme,
  favorites,
  recentToolIds = [],
  onSelectTool,
  onToggleFavorite,
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';
  const isAr = language === 'ar';

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim().length >= 3) {
      logSearchUsed(val.trim().length);
    }
  };

  const handleCategoryChange = (catId: CategoryId) => {
    setSelectedCategory(catId);
    logCategorySelected(catId);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  // Instant multi-criteria filtering
  const query = searchQuery.trim().toLowerCase();
  const filteredTools = tools.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    if (!matchesCategory) return false;
    if (!query) return true;

    // Search across Arabic title, English title, descriptions, category, and dedicated keywords
    const inTitleAr = tool.titleAr.toLowerCase().includes(query);
    const inTitleEn = tool.titleEn.toLowerCase().includes(query);
    const inDescAr = tool.descAr.toLowerCase().includes(query);
    const inDescEn = tool.descEn.toLowerCase().includes(query);
    const inCat = tool.category.toLowerCase().includes(query);
    const inKeywords = tool.keywords ? tool.keywords.some((k) => k.toLowerCase().includes(query)) : false;

    return inTitleAr || inTitleEn || inDescAr || inDescEn || inCat || inKeywords;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* View Header */}
      <div className="space-y-2">
        <h1 style={{ color: 'var(--theme-text)' }} className="text-xl sm:text-2xl font-bold tracking-tight">
          {language === 'ar' ? 'جميع أدوات المطورين' : 'All Developer Tools'}
        </h1>
        <p style={{ color: 'var(--theme-text-secondary)' }} className="text-xs sm:text-sm">
          {language === 'ar'
            ? 'تصفح قائمة الأدوات الكاملة حسب التخصص أو بواسطة البحث الفوري.'
            : 'Browse full list of tools by category or instant search.'}
        </p>
      </div>

      {/* Enhanced Search Input Bar with Clear Button */}
      <div className="relative">
        <div
          className={`absolute top-3.5 ${
            isAr ? 'right-4' : 'left-4'
          } pointer-events-none flex items-center`}
        >
          <Search style={{ color: 'var(--theme-primary)' }} className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={t.searchPlaceholder}
          style={{
            backgroundColor: 'var(--theme-input)',
            borderColor: 'var(--theme-border)',
            color: 'var(--theme-input-text)',
          }}
          className={`w-full py-3.5 rounded-2xl text-sm font-semibold outline-none transition-all border ${
            isAr ? 'pr-12 pl-11' : 'pl-12 pr-11'
          }`}
        />

        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className={`absolute top-3 ${
              isAr ? 'left-3' : 'right-3'
            } p-1.5 rounded-xl transition-colors text-slate-400 hover:text-white hover:bg-black/20`}
            title={t.clearSearch}
            aria-label={t.clearSearch}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        language={language}
        theme={theme}
        onSelectCategory={handleCategoryChange}
      />

      {/* Tools Count & Grid / Empty State */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold px-1">
          <span style={{ color: 'var(--theme-text-secondary)' }}>
            {t.allTools} ({filteredTools.length})
          </span>
          {searchQuery && (
            <button
              onClick={handleResetFilters}
              style={{ color: 'var(--theme-primary)' }}
              className="text-xs font-semibold flex items-center gap-1 hover:opacity-80"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.reset}</span>
            </button>
          )}
        </div>

        {filteredTools.length === 0 ? (
          <div
            style={{
              backgroundColor: 'var(--theme-surface)',
              borderColor: 'var(--theme-border)',
            }}
            className="p-10 sm:p-14 text-center rounded-3xl border space-y-4 shadow-xs"
          >
            <div
              style={{
                backgroundColor: 'var(--theme-primary-subtle)',
                color: 'var(--theme-primary)',
              }}
              className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center border border-current"
            >
              <SearchX className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 style={{ color: 'var(--theme-text)' }} className="text-base font-bold">
                {t.noToolsFound}
              </h3>
              <p style={{ color: 'var(--theme-text-secondary)' }} className="text-xs max-w-sm mx-auto">
                {t.searchNoResultsDesc}
              </p>
            </div>
            <div>
              <button
                onClick={handleResetFilters}
                style={{
                  background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))',
                  color: 'var(--theme-primary-text)',
                  boxShadow: 'var(--theme-shadow)',
                }}
                className="px-4 py-2 rounded-xl font-bold text-xs transition-opacity hover:opacity-90 shadow-sm inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.clearSearch}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                language={language}
                theme={theme}
                isFavorite={favorites.includes(tool.id)}
                isRecent={recentToolIds.includes(tool.id)}
                onSelect={onSelectTool}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Category, Tool, Language, Theme, CategoryId } from '../../types';
import { CategoryFilter } from '../CategoryFilter';
import { ToolCard } from '../ToolCard';
import { AdMobBanner } from '../ads/AdMobBanner';
import { AdMobNative } from '../ads/AdMobNative';
import { Search, Sparkles, Zap, Trash2, X, SearchX, RotateCcw } from 'lucide-react';
import { translations } from '../../data/translations';
import { logSearchUsed, logCategorySelected } from '../../services/firebaseAnalytics';

interface HomeViewProps {
  tools: Tool[];
  categories: Category[];
  language: Language;
  theme: Theme;
  favorites: string[];
  recentToolIds: string[];
  onSelectTool: (tool: Tool) => void;
  onToggleFavorite: (toolId: string, e: React.MouseEvent) => void;
  onClearRecents?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  tools,
  categories,
  language,
  theme,
  favorites,
  recentToolIds,
  onSelectTool,
  onToggleFavorite,
  onClearRecents,
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';
  const isAr = language === 'ar';

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

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

  // Multi-criteria instant search
  const query = searchQuery.trim().toLowerCase();
  const filteredTools = tools.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    if (!matchesCategory) return false;
    if (!query) return true;

    const inTitleAr = tool.titleAr.toLowerCase().includes(query);
    const inTitleEn = tool.titleEn.toLowerCase().includes(query);
    const inDescAr = tool.descAr.toLowerCase().includes(query);
    const inDescEn = tool.descEn.toLowerCase().includes(query);
    const inCat = tool.category.toLowerCase().includes(query);
    const inKeywords = tool.keywords ? tool.keywords.some((k) => k.toLowerCase().includes(query)) : false;

    return inTitleAr || inTitleEn || inDescAr || inDescEn || inCat || inKeywords;
  });

  // Recent tools ordered by most recent first
  const recentTools = recentToolIds
    .map((id) => tools.find((t) => t.id === id))
    .filter((tool): tool is Tool => Boolean(tool));

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Header & Search Section */}
      <div
        style={{
          background: 'var(--theme-hero-gradient)',
          borderColor: 'var(--theme-hero-border)',
          boxShadow: 'var(--theme-shadow)',
        }}
        className="relative rounded-3xl p-6 sm:p-8 border shadow-xl overflow-hidden"
      >
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div
            style={{
              backgroundColor: 'var(--theme-primary-subtle)',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-primary)',
            }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تطبيق أدوات تقنية للمطورين' : 'Developer Utilities Suite'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {language === 'ar' ? (
              <>
                هايبر تولز - <span className="brand-gradient-text font-black">أدوات المطورين</span>
              </>
            ) : (
              <>
                HyperTools - <span className="brand-gradient-text font-black">Developer Utilities</span>
              </>
            )}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {language === 'ar'
              ? 'مجموعة أدوات برمجية من شركة HyperSoft مصممة لمساعدتك في إنجاز مهامك التقنية واليومية بسرعة وسهولة مع الحرص على خصوصية بياناتك.'
              : 'Developer utilities by HyperSoft designed to help you accomplish technical and coding tasks quickly and easily with respect for your privacy.'}
          </p>

          {/* Search Input Box with Clear Button */}
          <div className="relative pt-2">
            <div className="relative flex items-center">
              <Search
                style={{ color: 'var(--theme-primary)' }}
                className={`w-5 h-5 absolute ${isAr ? 'right-4' : 'left-4'} pointer-events-none`}
              />
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
                className={`w-full py-3.5 rounded-2xl border text-sm font-semibold outline-none focus:ring-2 transition-all shadow-inner ${
                  isAr ? 'pr-12 pl-11' : 'pl-12 pr-11'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute ${isAr ? 'left-3' : 'right-3'} p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-black/20 transition-colors`}
                  title={t.clearSearch}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
          <span>{t.categories}</span>
        </div>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          language={language}
          theme={theme}
          onSelectCategory={handleCategoryChange}
        />
      </div>

      {/* Recent Tools Bar (with Clear History Action) */}
      {recentTools.length > 0 && !searchQuery && selectedCategory === 'all' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.recentTools}</span>
            </div>

            {onClearRecents && (
              <div>
                {showClearConfirm ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-amber-400">{isAr ? 'مسح السجل؟' : 'Clear?'}</span>
                    <button
                      onClick={() => {
                        onClearRecents();
                        setShowClearConfirm(false);
                      }}
                      className="text-[11px] font-bold text-red-400 hover:text-red-300 underline"
                    >
                      {isAr ? 'نعم' : 'Yes'}
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="text-[11px] text-slate-400 hover:text-slate-300"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="text-[11px] font-medium text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
                    title={t.clearRecents}
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{t.clearRecents}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {recentTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => onSelectTool(tool)}
                style={{
                  backgroundColor: 'var(--theme-surface)',
                  borderColor: 'var(--theme-border)',
                  color: 'var(--theme-primary)',
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold border shrink-0 flex items-center gap-2 transition-transform active:scale-95 hover:opacity-90 shadow-xs"
              >
                <span>{language === 'ar' ? tool.titleAr : tool.titleEn}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Tools Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold px-1">
          <span style={{ color: 'var(--theme-text-secondary)' }}>{t.allTools} ({filteredTools.length})</span>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
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
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
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
            {filteredTools.map((tool, idx) => (
              <React.Fragment key={tool.id}>
                <ToolCard
                  tool={tool}
                  language={language}
                  theme={theme}
                  isFavorite={favorites.includes(tool.id)}
                  isRecent={recentToolIds.includes(tool.id)}
                  onSelect={onSelectTool}
                  onToggleFavorite={onToggleFavorite}
                />
                {/* Insert Native Ad Card seamlessly after 6th tool */}
                {idx === 5 && <AdMobNative language={language} theme={theme} />}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* AdMob Banner at Bottom */}
      <AdMobBanner />
    </div>
  );
};

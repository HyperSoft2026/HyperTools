import React, { useState } from 'react';
import { Category, Tool, Language, Theme, CategoryId } from '../../types';
import { CategoryFilter } from '../CategoryFilter';
import { ToolCard } from '../ToolCard';
import { AdMobBanner } from '../ads/AdMobBanner';
import { AdMobNative } from '../ads/AdMobNative';
import { Search, Sparkles, Zap } from 'lucide-react';
import { translations } from '../../data/translations';

interface HomeViewProps {
  tools: Tool[];
  categories: Category[];
  language: Language;
  theme: Theme;
  favorites: string[];
  recentToolIds: string[];
  onSelectTool: (tool: Tool) => void;
  onToggleFavorite: (toolId: string, e: React.MouseEvent) => void;
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
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');

  // Filter tools by search & category
  const filteredTools = tools.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const title = language === 'ar' ? tool.titleAr : tool.titleEn;
    const desc = language === 'ar' ? tool.descAr : tool.descEn;
    const matchesSearch =
      !searchQuery.trim() ||
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const recentTools = tools.filter((tool) => recentToolIds.includes(tool.id));

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Header & Search Section */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-purple-900/50 via-slate-900 to-indigo-950 border border-purple-500/20 shadow-xl overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تطبيق أدوات تقنية مجاني 100%' : '100% Free Developer Tools'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {language === 'ar' ? (
              <>
                هايبر تولز - <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">أدوات المطورين</span>
              </>
            ) : (
              <>
                HyperTools - <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">Developer Utilities</span>
              </>
            )}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {language === 'ar'
              ? 'مجموعة أدوات برمجية فائقة السرعة من شركة HyperSoft تعمل مباشرة على جهازك دون الحاجة لسيرفر للحفاظ على خصوصيتك وسرعة عملك.'
              : 'Lightning-fast developer and security tools by HyperSoft running 100% client-side for maximum speed and security.'}
          </p>

          {/* Search Input Box */}
          <div className="relative pt-2">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 absolute left-4 text-purple-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950/80 border border-purple-500/30 text-white text-sm font-semibold placeholder-slate-400 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-inner"
              />
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
          onSelectCategory={(id) => setSelectedCategory(id)}
        />
      </div>

      {/* Recent Tools Bar (If any exist) */}
      {recentTools.length > 0 && !searchQuery && selectedCategory === 'all' && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 px-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.recentTools}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {recentTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => onSelectTool(tool)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border shrink-0 flex items-center gap-2 transition-transform active:scale-95 ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 text-purple-300 hover:bg-slate-800'
                    : 'bg-white border-slate-200 text-purple-700 shadow-sm'
                }`}
              >
                <span>{language === 'ar' ? tool.titleAr : tool.titleEn}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Tools Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
          <span>{t.allTools} ({filteredTools.length})</span>
        </div>

        {filteredTools.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-semibold rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
            <p>{t.noToolsFound}</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs font-bold text-purple-400 hover:underline"
            >
              {t.clearSearch}
            </button>
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

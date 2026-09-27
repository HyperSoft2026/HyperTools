import React, { useState } from 'react';
import { Category, Tool, Language, Theme, CategoryId } from '../../types';
import { CategoryFilter } from '../CategoryFilter';
import { ToolCard } from '../ToolCard';
import { Search } from 'lucide-react';
import { translations } from '../../data/translations';

interface ToolsViewProps {
  tools: Tool[];
  categories: Category[];
  language: Language;
  theme: Theme;
  favorites: string[];
  onSelectTool: (tool: Tool) => void;
  onToggleFavorite: (toolId: string, e: React.MouseEvent) => void;
}

export const ToolsView: React.FC<ToolsViewProps> = ({
  tools,
  categories,
  language,
  theme,
  favorites,
  onSelectTool,
  onToggleFavorite,
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');

  const filteredTools = tools.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const title = language === 'ar' ? tool.titleAr : tool.titleEn;
    const desc = language === 'ar' ? tool.descAr : tool.descEn;
    const matchesSearch =
      !searchQuery.trim() ||
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20">
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          {language === 'ar' ? 'جميع أدوات المطورين' : 'All Developer Tools'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {language === 'ar'
            ? 'تصفح قائمة الأدوات الكاملة حسب التخصص أو بواسطة البحث الفوري.'
            : 'Browse full list of tools by category or instant search.'}
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-3.5 text-purple-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm font-semibold outline-none focus:border-purple-500"
        />
      </div>

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        language={language}
        theme={theme}
        onSelectCategory={(id) => setSelectedCategory(id)}
      />

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            language={language}
            theme={theme}
            isFavorite={favorites.includes(tool.id)}
            onSelect={onSelectTool}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};

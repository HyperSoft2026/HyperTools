import React from 'react';
import { Category, CategoryId, Language, Theme } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: CategoryId;
  language: Language;
  theme: Theme;
  onSelectCategory: (id: CategoryId) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  language,
  theme,
  onSelectCategory,
}) => {
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-1.5 border ${
              isSelected
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500/50 shadow-md shadow-purple-500/20'
                : isDark
                ? 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>{language === 'ar' ? cat.nameAr : cat.nameEn}</span>
          </button>
        );
      })}
    </div>
  );
};

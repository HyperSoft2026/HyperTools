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
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            style={
              isSelected
                ? {
                    background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))',
                    borderColor: 'var(--theme-border)',
                    color: 'var(--theme-primary-text)',
                    boxShadow: 'var(--theme-shadow)',
                  }
                : {
                    backgroundColor: 'var(--theme-surface)',
                    borderColor: 'var(--theme-border)',
                    color: 'var(--theme-text-secondary)',
                  }
            }
            className="whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-1.5 border shadow-xs hover:border-[var(--theme-border-hover)] active:scale-95"
          >
            <span>{language === 'ar' ? cat.nameAr : cat.nameEn}</span>
          </button>
        );
      })}
    </div>
  );
};

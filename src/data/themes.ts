import { AppTheme } from '../types';

export interface ThemeDefinition {
  id: AppTheme;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  palette: string[]; // 4 color swatches for preview
  primaryHex: string;
  accentHex: string;
  badgeAr: string;
  badgeEn: string;
  isDefault?: boolean;
}

export const appThemes: ThemeDefinition[] = [
  {
    id: 'professional',
    nameAr: 'هايبر سوفت بروفيشنال',
    nameEn: 'HyperSoft Professional',
    descAr: 'التصميم الكلاسيكي الأصلي لـ HyperTools بتدرجات البنفسجي والأزرق والرمادي الداكن.',
    descEn: 'The original signature HyperTools design with purple, indigo, and deep slate tones.',
    palette: ['#9333ea', '#6366f1', '#06b6d4', '#0f172a'],
    primaryHex: '#9333ea',
    accentHex: '#06b6d4',
    badgeAr: 'الافتراضي',
    badgeEn: 'Default',
    isDefault: true,
  },
  {
    id: 'arabic',
    nameAr: 'العربي الحديث',
    nameEn: 'Modern Arabic',
    descAr: 'تصميم عربي معاصر بلمسات ذهبية راقية وزخارف هندسية مستوحاة من العمارة الإسلامية.',
    descEn: 'Contemporary Arabesque styling with warm royal gold, cream accents, and subtle geometry.',
    palette: ['#d97706', '#059669', '#f59e0b', '#064e3b'],
    primaryHex: '#d97706',
    accentHex: '#059669',
    badgeAr: 'أندلسي حديث',
    badgeEn: 'Arabesque',
  },
  {
    id: 'babylonian',
    nameAr: 'بابل وبلاد الرافدين',
    nameEn: 'Babylonian Heritage',
    descAr: 'مستوحى من حضارة بابل والصلصال الطيني مع أزرق بوابة عشتار والذهب العتيق.',
    descEn: 'Inspired by Babylon and Mesopotamia with terracotta clay, Ishtar lapis, and antique gold.',
    palette: ['#b45309', '#1d4ed8', '#ca8a04', '#1e1b4b'],
    primaryHex: '#b45309',
    accentHex: '#1d4ed8',
    badgeAr: 'بابل العريقة',
    badgeEn: 'Babylon',
  },
  {
    id: 'pharaonic',
    nameAr: 'الفرعوني الملكي',
    nameEn: 'Royal Pharaonic',
    descAr: 'مستوحى من مصر القديمة؛ ذهب الملوك مع أزرق النيل اللازوردي ورمال الصحراء الذهبية.',
    descEn: 'Ancient Egyptian aesthetic with imperial gold, Nile cobalt blue, and desert sand hues.',
    palette: ['#eab308', '#0284c7', '#ca8a04', '#0c4a6e'],
    primaryHex: '#eab308',
    accentHex: '#0284c7',
    badgeAr: 'طيبة الملكية',
    badgeEn: 'Pharaonic',
  },
  {
    id: 'sumerian',
    nameAr: 'السومري العريق',
    nameEn: 'Ancient Sumerian',
    descAr: 'مستوحى من حضارة سومر؛ درجات الطين البرونزي وحجر اللازورد والنقوش المسمارية الأثرية.',
    descEn: 'Sumerian civilization roots with bronze, clay stone, lapis lazuli, and cuneiform motifs.',
    palette: ['#c2410c', '#1e3a8a', '#d97706', '#451a03'],
    primaryHex: '#c2410c',
    accentHex: '#1e3a8a',
    badgeAr: 'أور وسومر',
    badgeEn: 'Sumerian',
  },
  {
    id: 'modern',
    nameAr: 'عصري مينيمال',
    nameEn: 'Modern Minimalist',
    descAr: 'واجهة تقنية نقية وخفيفة بحدود فائقة الدقة وألوان النيون السماوي والزنك المعاصر.',
    descEn: 'Clean high-tech minimalism with razor-sharp borders, electric cyan, and clean surfaces.',
    palette: ['#06b6d4', '#3b82f6', '#10b981', '#18181b'],
    primaryHex: '#06b6d4',
    accentHex: '#3b82f6',
    badgeAr: 'تقني نقي',
    badgeEn: 'Minimal',
  },
];

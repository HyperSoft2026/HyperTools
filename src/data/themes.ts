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
    descAr: 'التصميم الاحترافي الكلاسيكي لـ HyperTools بتدرجات البنفسجي والنيلي والأزرق النيوني.',
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
    descAr: 'تصميم عربي معاصر بلمسات ذهبية ملكية وزمردية وزخارف هندسية خفيفة وأنيقة.',
    descEn: 'Contemporary Arabesque styling with warm royal gold, jade emerald, and subtle geometry.',
    palette: ['#d97706', '#059669', '#10b981', '#081410'],
    primaryHex: '#d97706',
    accentHex: '#059669',
    badgeAr: 'أندلسي حديث',
    badgeEn: 'Arabesque',
  },
  {
    id: 'babylonian',
    nameAr: 'التراث البابلي',
    nameEn: 'Babylonian Heritage',
    descAr: 'مستوحى من حضارة بلاد الرافدين وبابل؛ درجات الصلصال والطين، وأزرق بوابة عشتار، والذهب العتيق.',
    descEn: 'Inspired by Mesopotamia and Babylon with terracotta clay, Ishtar Gate lapis blue, and antique gold.',
    palette: ['#ea580c', '#2563eb', '#fbbf24', '#120c08'],
    primaryHex: '#ea580c',
    accentHex: '#2563eb',
    badgeAr: 'بابل العريقة',
    badgeEn: 'Babylonian',
  },
  {
    id: 'pharaonic',
    nameAr: 'الفرعوني الملكي',
    nameEn: 'Royal Pharaonic',
    descAr: 'مستوحى من مصر القديمة؛ ذهب الملوك مع أزرق النيل اللازوردي ورمال الصحراء الذهبية.',
    descEn: 'Ancient Egyptian aesthetic with imperial gold, Nile cobalt blue, and desert sand hues.',
    palette: ['#eab308', '#0284c7', '#38bdf8', '#0a0d18'],
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
    descEn: 'Ancient Sumerian roots with bronze, clay stone, lapis lazuli, and cuneiform motifs.',
    palette: ['#c2410c', '#1e3a8a', '#d97706', '#100d0a'],
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
    palette: ['#06b6d4', '#3b82f6', '#10b981', '#060709'],
    primaryHex: '#06b6d4',
    accentHex: '#3b82f6',
    badgeAr: 'تقني نقي',
    badgeEn: 'Minimalist',
  },
];

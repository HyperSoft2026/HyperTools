export type Language = 'ar' | 'en';
export type Theme = 'dark' | 'light';

export type CategoryId = 'all' | 'dev' | 'text' | 'security' | 'converters' | 'network' | 'color' | 'css';

export interface Category {
  id: CategoryId;
  nameAr: string;
  nameEn: string;
  iconName: string;
}

export type AppTheme = 'professional' | 'arabic' | 'babylonian' | 'pharaonic' | 'sumerian' | 'modern';

export type ToolId =
  | 'password-gen'
  | 'color-converter'
  | 'dev-calculator'
  | 'json-formatter'
  | 'text-tools'
  | 'text-stats'
  | 'uuid-gen'
  | 'ip-calculator'
  | 'unix-timestamp'
  | 'base64'
  | 'url-encoder'
  | 'hash-gen'
  | 'jwt-decoder'
  | 'regex-tester'
  | 'css-generator'
  | 'text-diff'
  | 'sql-formatter'
  | 'html-formatter'
  | 'chmod-calculator'
  | 'cron-builder';

export interface Tool {
  id: ToolId;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  category: CategoryId;
  iconName: string;
  color: string;
  gradient: string;
  isPopular?: boolean;
  isNew?: boolean;
  keywords?: string[];
}

export type TabView = 'home' | 'tools' | 'favorites' | 'settings' | 'tool-detail' | 'legal';

export type LegalPage = 'privacy' | 'terms' | 'disclaimer' | 'about';

export interface HistoryItem {
  id: string;
  toolId: ToolId;
  toolTitle: string;
  summary: string;
  timestamp: number;
}

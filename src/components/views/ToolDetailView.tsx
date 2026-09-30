import React from 'react';
import { Tool, Language, Theme } from '../../types';
import { ArrowLeft, ArrowRight, Star, Share2 } from 'lucide-react';
import { DynamicIcon } from '../DynamicIcon';

// Tool Components
import { PasswordGenerator } from '../tools/PasswordGenerator';
import { ColorConverter } from '../tools/ColorConverter';
import { DevCalculator } from '../tools/DevCalculator';
import { JsonFormatter } from '../tools/JsonFormatter';
import { TextTools } from '../tools/TextTools';
import { TextStatistics } from '../tools/TextStatistics';
import { UuidGenerator } from '../tools/UuidGenerator';
import { IpCalculator } from '../tools/IpCalculator';
import { UnixTimestamp } from '../tools/UnixTimestamp';
import { Base64Tool } from '../tools/Base64Tool';
import { UrlEncoder } from '../tools/UrlEncoder';
import { HashGenerator } from '../tools/HashGenerator';
import { JwtDecoder } from '../tools/JwtDecoder';
import { RegexTester } from '../tools/RegexTester';
import { CssGenerator } from '../tools/CssGenerator';
import { TextDiff } from '../tools/TextDiff';
import { SqlFormatter } from '../tools/SqlFormatter';
import { HtmlFormatter } from '../tools/HtmlFormatter';
import { ChmodCalculator } from '../tools/ChmodCalculator';
import { CronBuilder } from '../tools/CronBuilder';

interface ToolDetailViewProps {
  tool: Tool;
  language: Language;
  theme: Theme;
  isFavorite: boolean;
  onBack: () => void;
  onToggleFavorite: (toolId: string, e: React.MouseEvent) => void;
  onCopy: (text: string) => void;
  onTriggerToast: (msg: string) => void;
}

export const ToolDetailView: React.FC<ToolDetailViewProps> = ({
  tool,
  language,
  theme,
  isFavorite,
  onBack,
  onToggleFavorite,
  onCopy,
  onTriggerToast,
}) => {
  const isDark = theme === 'dark';
  const BackIcon = language === 'ar' ? ArrowRight : ArrowLeft;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: language === 'ar' ? tool.titleAr : tool.titleEn,
        text: language === 'ar' ? tool.descAr : tool.descEn,
        url: window.location.href,
      });
    } else {
      onCopy(window.location.href);
      onTriggerToast(
        language === 'ar' ? 'تم نسخ رابط الأداة إلى الحافظة!' : 'Tool link copied to clipboard!'
      );
    }
  };

  const renderToolComponent = () => {
    switch (tool.id) {
      case 'password-gen':
        return <PasswordGenerator language={language} theme={theme} onCopy={onCopy} />;
      case 'color-converter':
        return <ColorConverter language={language} theme={theme} onCopy={onCopy} />;
      case 'dev-calculator':
        return <DevCalculator language={language} theme={theme} onCopy={onCopy} />;
      case 'json-formatter':
        return <JsonFormatter language={language} theme={theme} onCopy={onCopy} />;
      case 'text-tools':
        return <TextTools language={language} theme={theme} onCopy={onCopy} />;
      case 'text-stats':
        return <TextStatistics language={language} theme={theme} onCopy={onCopy} />;
      case 'uuid-gen':
        return <UuidGenerator language={language} theme={theme} onCopy={onCopy} />;
      case 'ip-calculator':
        return <IpCalculator language={language} theme={theme} onCopy={onCopy} />;
      case 'unix-timestamp':
        return <UnixTimestamp language={language} theme={theme} onCopy={onCopy} />;
      case 'base64':
        return <Base64Tool language={language} theme={theme} onCopy={onCopy} />;
      case 'url-encoder':
        return <UrlEncoder language={language} theme={theme} onCopy={onCopy} />;
      case 'hash-gen':
        return <HashGenerator language={language} theme={theme} onCopy={onCopy} />;
      case 'jwt-decoder':
        return <JwtDecoder language={language} theme={theme} onCopy={onCopy} />;
      case 'regex-tester':
        return <RegexTester language={language} theme={theme} onCopy={onCopy} />;
      case 'css-generator':
        return <CssGenerator language={language} theme={theme} onCopy={onCopy} />;
      case 'text-diff':
        return <TextDiff language={language} theme={theme} onCopy={onCopy} />;
      case 'sql-formatter':
        return <SqlFormatter language={language} theme={theme} onCopy={onCopy} />;
      case 'html-formatter':
        return <HtmlFormatter language={language} theme={theme} onCopy={onCopy} />;
      case 'chmod-calculator':
        return <ChmodCalculator language={language} theme={theme} onCopy={onCopy} />;
      case 'cron-builder':
        return <CronBuilder language={language} theme={theme} onCopy={onCopy} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto">
      {/* Top Header Navigation Bar */}
      <div
        style={{ borderColor: 'var(--theme-border)' }}
        className="flex items-center justify-between border-b pb-4"
      >
        <button
          onClick={onBack}
          style={{
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'var(--theme-border)',
            color: 'var(--theme-text)',
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors hover:opacity-90 shadow-xs"
        >
          <BackIcon className="w-4 h-4" />
          <span>{language === 'ar' ? 'الرجوع' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            style={{
              backgroundColor: 'var(--theme-surface)',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text)',
            }}
            className="p-2.5 rounded-xl border transition-colors hover:opacity-90 shadow-xs"
            title="Share tool"
          >
            <Share2 className="w-4 h-4" />
          </button>

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
                    backgroundColor: 'var(--theme-surface)',
                    borderColor: 'var(--theme-border)',
                    color: 'var(--theme-text-secondary)',
                  }
            }
            className="p-2.5 rounded-xl border transition-colors hover:border-[var(--theme-border)] shadow-xs"
            title={isFavorite ? 'Remove favorite' : 'Add favorite'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tool Title Block */}
      <div className="flex items-start gap-4">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-white shadow-xl shrink-0`}
        >
          <DynamicIcon name={tool.iconName} className="w-7 h-7 text-white" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              style={{
                backgroundColor: 'var(--theme-primary-subtle)',
                borderColor: 'var(--theme-border)',
                color: 'var(--theme-primary)',
              }}
              className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md border"
            >
              {tool.category}
            </span>
          </div>

          <h1
            style={{ color: 'var(--theme-text)' }}
            className="text-xl sm:text-3xl font-extrabold tracking-tight"
          >
            {language === 'ar' ? tool.titleAr : tool.titleEn}
          </h1>

          <p
            style={{ color: 'var(--theme-text-secondary)' }}
            className="text-xs sm:text-sm leading-relaxed"
          >
            {language === 'ar' ? tool.descAr : tool.descEn}
          </p>
        </div>
      </div>

      {/* Embedded Tool Workspace */}
      <div className="pt-2">
        {renderToolComponent()}
      </div>
    </div>
  );
};

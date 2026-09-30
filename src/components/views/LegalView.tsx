import React, { useState } from 'react';
import { LegalPage, Language, Theme } from '../../types';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Info,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { HyperLogo } from '../HyperLogo';
import { translations } from '../../data/translations';

interface LegalViewProps {
  page: LegalPage;
  language: Language;
  theme: Theme;
  onBack: () => void;
  onTriggerToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const LegalView: React.FC<LegalViewProps> = ({
  page,
  language,
  theme,
  onBack,
  onTriggerToast,
}) => {
  const isDark = theme === 'dark';
  const BackIcon = language === 'ar' ? ArrowRight : ArrowLeft;
  const isAr = language === 'ar';
  const t = translations[language];

  const [isCheckingUpdate, setIsCheckingUpdate] = useState<boolean>(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  const handleOpenHyperSoftSite = () => {
    window.open('https://51.75.118.17:20137', '_blank', 'noopener,noreferrer');
  };

  const handleCheckUpdates = () => {
    setIsCheckingUpdate(true);
    setUpdateMessage(null);
    setTimeout(() => {
      setIsCheckingUpdate(false);
      setUpdateMessage(t.latestVersionInstalled);
      if (onTriggerToast) {
        onTriggerToast(t.latestVersionInstalled, 'success');
      }
    }, 700);
  };

  const titles: Record<LegalPage, string> = {
    privacy: isAr ? 'سياسة الخصوصية' : 'Privacy Policy',
    terms: isAr ? 'شروط الاستخدام' : 'Terms of Use',
    disclaimer: isAr ? 'إخلاء المسؤولية' : 'Disclaimer',
    about: isAr ? 'حول HyperTools' : 'About HyperTools',
  };

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto">
      {/* Top Nav Header */}
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
          <span>{isAr ? 'الرجوع للإعدادات' : 'Back to Settings'}</span>
        </button>

        <span style={{ color: 'var(--theme-text-secondary)' }} className="text-xs font-semibold">
          HyperTools v1.0.1
        </span>
      </div>

      {/* Page Title */}
      <div className="space-y-1">
        <h1 style={{ color: 'var(--theme-text)' }} className="text-xl sm:text-2xl font-bold tracking-tight">
          {titles[page]}
        </h1>
        <p style={{ color: 'var(--theme-text-secondary)' }} className="text-xs sm:text-sm">
          {isAr
            ? 'تطبيق HyperTools من تطوير شركة HyperSoft للأدوات والحلول البرمجية.'
            : 'HyperTools by HyperSoft software solutions and developer utilities.'}
        </p>
      </div>

      {/* PRIVACY POLICY */}
      {page === 'privacy' && (
        <div
          style={{
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'var(--theme-border)',
          }}
          className="p-6 rounded-3xl border space-y-4 text-xs sm:text-sm leading-relaxed shadow-xs"
        >
          <div
            style={{
              backgroundColor: 'var(--theme-primary-subtle)',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text)',
            }}
            className="p-4 rounded-2xl border font-medium"
          >
            {isAr
              ? 'نحرص على تقليل البيانات التي يتم جمعها ومشاركة أقل قدر ممكن من المعلومات الضرورية لتشغيل وتحسين التطبيق.'
              : 'We strive to minimize data collection and share only the essential information necessary to operate and improve the application.'}
          </div>

          <h3 style={{ color: 'var(--theme-text)' }} className="font-bold text-base pt-2">
            {isAr ? '1. البيانات والخصوصية' : '1. Data & Privacy'}
          </h3>
          <p style={{ color: 'var(--theme-text-secondary)' }}>
            {isAr
              ? 'تتم معظم العمليات الحسابية للأدوات محلياً على جهازك. لا نطلب إنشاء حساب أو تسجيل دخول، ولا نقوم بجمع أو حفظ كلمات المرور أو الرموز المشفرة أو أي مدخلات حساسة يدخلها المستخدم.'
              : 'Most utility calculations are processed directly on your device. We do not require registration or account creation, and we do not collect or store passwords, encrypted tokens, or sensitive user inputs.'}
          </p>

          <h3 style={{ color: 'var(--theme-text)' }} className="font-bold text-base pt-2">
            {isAr ? '2. الإعلانات' : '2. Advertisements'}
          </h3>
          <p style={{ color: 'var(--theme-text-secondary)' }}>
            {isAr
              ? 'يستخدم التطبيق شبكة Google AdMob لعرض إعلانات تدعم استمرارية التطبيق المجاني وفق سياسات Google المعتمدة.'
              : 'The application uses Google AdMob to display compliant advertisements that support our free application in accordance with Google publisher policies.'}
          </p>

          <h3 style={{ color: 'var(--theme-text)' }} className="font-bold text-base pt-2">
            {isAr ? '3. تحسين الأداء والاستقرار' : '3. Stability & Performance'}
          </h3>
          <p style={{ color: 'var(--theme-text-secondary)' }}>
            {isAr
              ? 'قد نستخدم خدمات تحليلية وتقنية لرصد أعطال النظام الفنية وتحسين استقرار التطبيق دون تسجيل بيانات المستخدم الشخصية.'
              : 'We may use technical telemetry to monitor app stability and resolve crashes without collecting personal user identities.'}
          </p>
        </div>
      )}

      {/* TERMS OF USE */}
      {page === 'terms' && (
        <div
          style={{
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'var(--theme-border)',
          }}
          className="p-6 rounded-3xl border space-y-4 text-xs sm:text-sm leading-relaxed shadow-xs"
        >
          <h3 style={{ color: 'var(--theme-text)' }} className="font-bold text-base">
            {isAr ? '1. شروط الاستخدام المشروع' : '1. Legitimate Usage'}
          </h3>
          <p style={{ color: 'var(--theme-text-secondary)' }}>
            {isAr
              ? 'يُتاح تطبيق HyperTools مجاناً للاستخدام في الأغراض المشروعة والتعليمية والبرمجية. يحظر تماماً استخدام أي من أدوات التشفير أو الشبكات في أنشطة ضارة أو تنتهك القوانين.'
              : 'HyperTools is provided free for legitimate, educational, and software engineering purposes. Using networking or security tools for unauthorized activities is strictly forbidden.'}
          </p>

          <h3 style={{ color: 'var(--theme-text)' }} className="font-bold text-base pt-2">
            {isAr ? '2. الملكية الفكرية' : '2. Intellectual Property'}
          </h3>
          <p style={{ color: 'var(--theme-text-secondary)' }}>
            {isAr
              ? 'جميع حقوق التصميم والشعار والعلامة التجارية HyperTools و HyperSoft محفوظة لشركة HyperSoft.'
              : 'All design rights, logos, and trademarks of HyperTools and HyperSoft belong exclusively to HyperSoft.'}
          </p>
        </div>
      )}

      {/* DISCLAIMER */}
      {page === 'disclaimer' && (
        <div
          style={{
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'var(--theme-border)',
          }}
          className="p-6 rounded-3xl border space-y-4 text-xs sm:text-sm leading-relaxed shadow-xs"
        >
          <div
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              borderColor: 'rgba(245, 158, 11, 0.35)',
              color: 'var(--theme-text)',
            }}
            className="p-4 rounded-2xl border font-medium leading-relaxed"
          >
            <h4 className="font-bold text-sm text-amber-400 mb-2">
              {isAr ? 'النص العربي:' : 'Arabic Version:'}
            </h4>
            <p className="dir-rtl text-right">
              "الغرض من تطبيق HyperTools هو التعلم والتطوير والاستخدام المشروع للأدوات التقنية المتوفرة داخل التطبيق. يُمنع استخدام التطبيق أو أي من أدواته في أي نشاط غير قانوني أو ضار أو غير مصرح به أو ينتهك حقوق الآخرين. يتحمل المستخدم وحده مسؤولية طريقة استخدام الأدوات والنتائج الناتجة عنها. لا تتحمل HyperTools أو HyperSoft مسؤولية أي استخدام غير قانوني أو ضار أو غير مصرح به أو مخالف لشروط الاستخدام أو القوانين والأنظمة المعمول بها."
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'var(--theme-input)',
              borderColor: 'var(--theme-border)',
              color: 'var(--theme-text-secondary)',
            }}
            className="p-4 rounded-2xl border font-medium leading-relaxed"
          >
            <h4 style={{ color: 'var(--theme-primary)' }} className="font-bold text-sm mb-2">
              {isAr ? 'النص الإنجليزي (English Version):' : 'English Version:'}
            </h4>
            <p className="dir-ltr text-left font-sans">
              "The purpose of HyperTools is learning, development, and legitimate use of the technical tools available within the application. The use of the application or any of its tools for illegal, harmful, unauthorized activities, or violating the rights of others is strictly prohibited. The user alone bears full responsibility for how the tools are used and the results obtained. HyperTools and HyperSoft assume no liability for any illegal, harmful, unauthorized use, or violation of applicable terms or laws."
            </p>
          </div>
        </div>
      )}

      {/* ABOUT HYPERTOOLS */}
      {page === 'about' && (
        <div
          style={{
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'var(--theme-border)',
          }}
          className="p-6 rounded-3xl border space-y-6 text-center shadow-xs"
        >
          <div className="flex justify-center">
            <HyperLogo size="lg" showText={true} theme={theme} language={language} />
          </div>

          <div className="space-y-3">
            <div
              style={{
                backgroundColor: 'var(--theme-primary-subtle)',
                borderColor: 'var(--theme-border)',
                color: 'var(--theme-primary)',
              }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold"
            >
              <span>Android Edition</span>
              <span>·</span>
              <span>v1.0.1</span>
            </div>

            <p style={{ color: 'var(--theme-text-secondary)' }} className="text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              {isAr
                ? 'HyperTools هو تطبيق أدوات تقنية وبرمجية متنوعة من شركة HyperSoft يساعد المطورين والمستخدمين في إنجاز مهامهم التقنية بكفاءة وسهولة.'
                : 'HyperTools is a developer utilities application by HyperSoft designed to help developers and users handle technical tasks with ease and efficiency.'}
            </p>
          </div>

          {/* User-Facing Project Specs */}
          <div
            style={{
              backgroundColor: 'var(--theme-input)',
              borderColor: 'var(--theme-border)',
            }}
            className="p-4 rounded-2xl border text-left text-xs space-y-2.5 max-w-md mx-auto"
          >
            <div className="flex items-center justify-between">
              <span style={{ color: 'var(--theme-text-secondary)' }}>{isAr ? 'اسم التطبيق:' : 'App Name:'}</span>
              <span style={{ color: 'var(--theme-text)' }} className="font-bold font-mono">HyperTools</span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: 'var(--theme-text-secondary)' }}>{isAr ? 'الشركة:' : 'Company:'}</span>
              <span style={{ color: 'var(--theme-primary)' }} className="font-bold font-mono">HyperSoft</span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: 'var(--theme-text-secondary)' }}>{isAr ? 'الإصدار:' : 'Version:'}</span>
              <span className="font-bold text-emerald-400 font-mono">1.0.1</span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: 'var(--theme-text-secondary)' }}>{isAr ? 'كود الإصدار:' : 'Version Code:'}</span>
              <span style={{ color: 'var(--theme-text)' }} className="font-bold font-mono">2</span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: 'var(--theme-text-secondary)' }}>{isAr ? 'المنصة:' : 'Platform:'}</span>
              <span style={{ color: 'var(--theme-accent)' }} className="font-bold font-mono">Android</span>
            </div>
          </div>

          {/* Check for Updates Action */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleCheckUpdates}
              disabled={isCheckingUpdate}
              style={{
                backgroundColor: 'var(--theme-surface-elevated)',
                borderColor: 'var(--theme-border)',
                color: 'var(--theme-text)',
              }}
              className="py-3 px-6 rounded-2xl font-bold text-xs sm:text-sm inline-flex items-center gap-2 border transition-all hover:opacity-90 shadow-xs"
            >
              <RefreshCw className={`w-4 h-4 ${isCheckingUpdate ? 'animate-spin' : ''}`} style={{ color: 'var(--theme-primary)' }} />
              <span>{isCheckingUpdate ? t.checkingUpdates : t.checkForUpdates}</span>
            </button>

            {updateMessage && (
              <div className="text-xs text-emerald-400 flex items-center justify-center gap-1.5 pt-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{updateMessage}</span>
              </div>
            )}
          </div>

          {/* HyperSoft Official Link */}
          <div className="pt-2">
            <button
              onClick={handleOpenHyperSoftSite}
              style={{
                background: 'linear-gradient(to right, var(--theme-primary), var(--theme-secondary))',
                color: 'var(--theme-primary-text)',
                boxShadow: 'var(--theme-shadow)',
              }}
              className="py-3 px-6 rounded-2xl font-bold text-sm inline-flex items-center gap-2 active:scale-95 transition-transform"
            >
              <span>{isAr ? 'موقع HyperSoft الرسمي' : 'HyperSoft Official Website'}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          <div
            style={{ borderColor: 'var(--theme-border)', color: 'var(--theme-text-secondary)' }}
            className="pt-4 border-t text-xs flex justify-between items-center"
          >
            <span>© 2026 HyperSoft</span>
            <span>All rights reserved</span>
          </div>
        </div>
      )}
    </div>
  );
};

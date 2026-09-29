import React from 'react';
import { LegalPage, Language, Theme } from '../../types';
import { ArrowLeft, ArrowRight, ShieldCheck, FileText, AlertTriangle, Info, ExternalLink } from 'lucide-react';
import { HyperLogo } from '../HyperLogo';

interface LegalViewProps {
  page: LegalPage;
  language: Language;
  theme: Theme;
  onBack: () => void;
}

export const LegalView: React.FC<LegalViewProps> = ({
  page,
  language,
  theme,
  onBack,
}) => {
  const isDark = theme === 'dark';
  const BackIcon = language === 'ar' ? ArrowRight : ArrowLeft;
  const isAr = language === 'ar';

  const handleOpenHyperSoftSite = () => {
    window.open('https://51.75.118.17:20137', '_blank', 'noopener,noreferrer');
  };

  const titles = {
    privacy: isAr ? 'سياسة الخصوصية' : 'Privacy Policy',
    terms: isAr ? 'شروط الاستخدام' : 'Terms of Use',
    disclaimer: isAr ? 'إخلاء المسؤولية' : 'Disclaimer',
    about: isAr ? 'حول HyperTools' : 'About HyperTools',
  };

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto">
      {/* Top Nav Header */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <BackIcon className="w-4 h-4" />
          <span>{isAr ? 'الرجوع للإعدادات' : 'Back to Settings'}</span>
        </button>

        <span className="text-xs font-bold text-slate-400">HyperSoft Legal</span>
      </div>

      {/* Page Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
          {page === 'privacy' && <ShieldCheck className="w-5 h-5" />}
          {page === 'terms' && <FileText className="w-5 h-5" />}
          {page === 'disclaimer' && <AlertTriangle className="w-5 h-5" />}
          {page === 'about' && <Info className="w-5 h-5" />}
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">{titles[page]}</h1>
      </div>

      {/* Page Content Cards */}

      {/* PRIVACY POLICY */}
      {page === 'privacy' && (
        <div
          className={`p-6 rounded-3xl border space-y-4 text-xs sm:text-sm leading-relaxed ${
            isDark ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
          }`}
        >
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 font-semibold space-y-1">
            <div className="text-sm font-bold">{isAr ? 'تطبيق محلي 100% (Local-First Architecture)' : '100% Local-First Application'}</div>
            <p>
              {isAr
                ? 'تطبيق HyperTools يعتمد تماماً على المعالجة المحلية على جهاز المستخدم. لا توجد خوادم تعتمد عليها الأدوات الأساسية.'
                : 'HyperTools operates fully as a Local-First utility suite on your device without backend dependency.'}
            </p>
          </div>

          <h3 className="font-bold text-base text-white pt-2">{isAr ? '1. معالجة بيانات الأدوات' : '1. Tool Data Processing'}</h3>
          <p>
            {isAr
              ? 'جميع البيانات والمعلومات التي يدخلها المستخدم في الأدوات البرمجية (مثل مولد كلمات المرور، النصوص، رموز JSON/JWT، التشفير) تتم معالجتها وحسابها محلياً على جهازك دون إرسالها إلى خوادم HyperSoft.'
              : 'All input data across tools (Password Gen, JSON, JWT, Base64, Hashes, IP calculations) is processed purely locally on your device and is never sent to HyperSoft servers.'}
          </p>

          <h3 className="font-bold text-base text-white pt-2">{isAr ? '2. الحسابات والتخزين المحلي' : '2. Accounts & Local Storage'}</h3>
          <p>
            {isAr
              ? 'لا يتطلب التطبيق إنشاء حساب أو تسجيل دخول لاستخدام الأدوات. يتم تخزين تفضيلات المستخدم (مثل المفضلة، اللغة، والمظهر) محلياً على الجهاز باستخدام LocalStorage.'
              : 'No account creation or login is required. User preferences such as favorites, language, and theme are stored locally on device via LocalStorage.'}
          </p>

          <h3 className="font-bold text-base text-white pt-2">{isAr ? '3. الإعلانات والخدمات الخارجية' : '3. Advertisements & External Services'}</h3>
          <p>
            {isAr
              ? 'قد يستخدم التطبيق خدمة Google AdMob لعرض الإعلانات عند الاتصال بالشبكة، وتخضع معالجة بيانات الإعلانات لسياسات الخصوصية الخاصة بشركة Google. فتح موقع HyperSoft يتم عبر المتصفح الخارجي.'
              : 'Google AdMob may process information necessary for displaying ads when online according to Google policies. Opening the HyperSoft website launches your external mobile browser.'}
          </p>

          <h3 className="font-bold text-base text-white pt-2">{isAr ? '4. التحديثات' : '4. Policy Updates'}</h3>
          <p>
            {isAr
              ? 'قد تتغير سياسة الخصوصية هذه مستقبلاً مع إضافة ميزات جديدة، وسيكون التحديث متوفراً دائماً داخل التطبيق.'
              : 'This Privacy Policy may be updated in future releases as new features are introduced.'}
          </p>
        </div>
      )}

      {/* TERMS OF USE */}
      {page === 'terms' && (
        <div
          className={`p-6 rounded-3xl border space-y-4 text-xs sm:text-sm leading-relaxed ${
            isDark ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
          }`}
        >
          <h3 className="font-bold text-base text-white">{isAr ? '1. الاستخدام المقبول والقانوني' : '1. Acceptable Legal Use'}</h3>
          <p>
            {isAr
              ? 'يجب استخدام تطبيق HyperTools لأغراض التعلم والتطوير والاستخدام التقني المشروع فقط. يُمنع منعاً باتاً استخدام أي من أدوات التطبيق في أنشطة غير قانونية، ضارة، أو غير مصرح بها.'
              : 'HyperTools must be used for learning, development, and legitimate technical uses only. Unauthorized or unlawful use is strictly prohibited.'}
          </p>

          <h3 className="font-bold text-base text-white pt-2">{isAr ? '2. مسؤولية المستخدم والنتائج' : '2. User Responsibility'}</h3>
          <p>
            {isAr
              ? 'يتحمل المستخدم وحده المسئولية الكاملة عن طريقة استخدام الأدوات والنتائج التي يحصل عليها من التطبيق. لا يوجد ضمان صريح بأن نتائج الأدوات مناسبة لجميع حالات الاستخدام دون تحقق تقني.'
              : 'The user assumes full responsibility for the usage of tools and the results obtained. No warranty is provided that outputs are fit for every purpose without verification.'}
          </p>

          <h3 className="font-bold text-base text-white pt-2">{isAr ? '3. التحديثات والتعديلات' : '3. Service Updates'}</h3>
          <p>
            {isAr
              ? 'تحتفظ شركة HyperSoft بحق تحديث، تعديل، أو تحسين وظائف التطبيق أو تعديل شروط الاستخدام بما يتوافق مع الأنظمة والقوانين المعمول بها.'
              : 'HyperSoft reserves the right to update or modify features and terms in compliance with applicable laws.'}
          </p>
        </div>
      )}

      {/* DISCLAIMER */}
      {page === 'disclaimer' && (
        <div
          className={`p-6 rounded-3xl border space-y-4 text-xs sm:text-sm leading-relaxed ${
            isDark ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
          }`}
        >
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 font-medium leading-relaxed">
            <h4 className="font-bold text-sm text-amber-400 mb-2">
              {isAr ? 'النص العربي:' : 'Arabic Version:'}
            </h4>
            <p className="dir-rtl text-right">
              "الغرض من تطبيق HyperTools هو التعلم والتطوير والاستخدام المشروع للأدوات التقنية المتوفرة داخل التطبيق. يُمنع استخدام التطبيق أو أي من أدواته في أي نشاط غير قانوني أو ضار أو غير مصرح به أو ينتهك حقوق الآخرين. يتحمل المستخدم وحده مسؤولية طريقة استخدام الأدوات والنتائج الناتجة عنها. لا تتحمل HyperTools أو HyperSoft مسؤولية أي استخدام غير قانوني أو ضار أو غير مصرح به أو مخالف لشروط الاستخدام أو القوانين والأنظمة المعمول بها."
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 font-medium leading-relaxed">
            <h4 className="font-bold text-sm text-purple-400 mb-2">
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
          className={`p-6 rounded-3xl border space-y-6 text-center ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex justify-center">
            <HyperLogo size="lg" showText={true} theme={theme} language={language} />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <span>Android Edition</span>
              <span>·</span>
              <span>v1.0.0</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto pt-2">
              {isAr
                ? 'HyperTools هو تطبيق أدوات تقنية وبرمجية متكامل مصمم بنظام Local-First ليعمل بالكامل بدون إتصال بالإنترنت مع سرعة فائقة وحفاظ تام على خصوصية بياناتك.'
                : 'HyperTools is a fast Local-First developer utilities application built to function 100% offline with maximum speed and complete client-side data privacy.'}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleOpenHyperSoftSite}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm inline-flex items-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95 transition-transform"
            >
              <span>{isAr ? 'موقع HyperSoft' : 'HyperSoft Website'}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-4 border-t border-slate-800/60 text-xs text-slate-500 flex justify-between items-center">
            <span>© 2026 HyperSoft</span>
            <span>Local-First Architecture</span>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Language, Theme } from '../../types';
import { translations } from '../../data/translations';
import {
  Clock,
  Copy,
  RotateCcw,
  Sparkles,
  Info,
  Calendar,
} from 'lucide-react';

interface CronBuilderProps {
  language: Language;
  theme: Theme;
  onCopy: (text: string) => void;
}

export const CronBuilder: React.FC<CronBuilderProps> = ({ language, theme, onCopy }) => {
  const isDark = theme === 'dark';
  const isAr = language === 'ar';
  const t = translations[language];

  const [minute, setMinute] = useState<string>('0');
  const [hour, setHour] = useState<string>('0');
  const [dayOfMonth, setDayOfMonth] = useState<string>('*');
  const [month, setMonth] = useState<string>('*');
  const [dayOfWeek, setDayOfWeek] = useState<string>('*');

  const cronExpression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`.trim();

  // Presets
  const presets = [
    { labelAr: 'كل دقيقة', labelEn: 'Every Minute', expr: ['*', '*', '*', '*', '*'] },
    { labelAr: 'كل 5 دقائق', labelEn: 'Every 5 Minutes', expr: ['*/5', '*', '*', '*', '*'] },
    { labelAr: 'كل 15 دقيقة', labelEn: 'Every 15 Minutes', expr: ['*/15', '*', '*', '*', '*'] },
    { labelAr: 'رأس كل ساعة', labelEn: 'Every Hour', expr: ['0', '*', '*', '*', '*'] },
    { labelAr: 'يومياً منتصف الليل', labelEn: 'Daily at Midnight', expr: ['0', '0', '*', '*', '*'] },
    { labelAr: 'يومياً الساعة 9:00 صباحاً', labelEn: 'Daily at 9:00 AM', expr: ['0', '9', '*', '*', '*'] },
    { labelAr: 'أيام العمل (إثنين-جمعة) 9 ص', labelEn: 'Weekdays (Mon-Fri) 9 AM', expr: ['0', '9', '*', '*', '1-5'] },
    { labelAr: 'أول يوم في الشهر', labelEn: 'Monthly (1st at Midnight)', expr: ['0', '0', '1', '*', '*'] },
  ];

  const applyPreset = (expr: string[]) => {
    setMinute(expr[0]);
    setHour(expr[1]);
    setDayOfMonth(expr[2]);
    setMonth(expr[3]);
    setDayOfWeek(expr[4]);
  };

  const handleReset = () => {
    applyPreset(['0', '0', '*', '*', '*']);
  };

  // Human description generator
  const getHumanDescription = (): string => {
    if (cronExpression === '* * * * *') {
      return isAr ? 'يتم التنفيذ في كل دقيقة من كل ساعة ويوم.' : 'Runs every minute of every hour and day.';
    }
    if (cronExpression === '*/5 * * * *') {
      return isAr ? 'يتم التنفيذ كل 5 دقائق باستمرار.' : 'Runs every 5 minutes continuously.';
    }
    if (cronExpression === '0 * * * *') {
      return isAr ? 'يتم التنفيذ عند بداية كل ساعة بالضبط (:00).' : 'Runs at minute 00 of every hour.';
    }
    if (cronExpression === '0 0 * * *') {
      return isAr ? 'يتم التنفيذ يومياً في تمام الساعة 12:00 منتصف الليل.' : 'Runs once a day at 00:00 midnight.';
    }
    if (cronExpression === '0 9 * * *') {
      return isAr ? 'يتم التنفيذ يومياً في تمام الساعة 09:00 صباحاً.' : 'Runs every day at 09:00 AM.';
    }
    if (cronExpression === '0 9 * * 1-5') {
      return isAr ? 'يتم التنفيذ في أيام العمل (من الإثنين إلى الجمعة) في تمام الساعة 09:00 صباحاً.' : 'Runs on weekdays (Mon-Fri) at 09:00 AM.';
    }
    if (cronExpression === '0 0 1 * *') {
      return isAr ? 'يتم التنفيذ في اليوم الأول من كل شهر ميلادي عند منتصف الليل.' : 'Runs on the 1st of every month at midnight.';
    }

    // Dynamic builder
    const minDesc = minute === '*' ? (isAr ? 'كل دقيقة' : 'every minute') : `${isAr ? 'الدقيقة' : 'minute'} ${minute}`;
    const hrDesc = hour === '*' ? (isAr ? 'كل ساعة' : 'every hour') : `${isAr ? 'الساعة' : 'hour'} ${hour}`;
    const dayDesc = dayOfMonth === '*' ? '' : ` ${isAr ? 'يوم' : 'day'} ${dayOfMonth}`;
    const monDesc = month === '*' ? '' : ` ${isAr ? 'شهر' : 'month'} ${month}`;
    const dowDesc = dayOfWeek === '*' ? '' : ` (${isAr ? 'أيام أسبوع' : 'weekday'}: ${dayOfWeek})`;

    return isAr
      ? `يتم التنفيذ في: ${minDesc}، ${hrDesc}${dayDesc}${monDesc}${dowDesc}.`
      : `Executes at: ${minDesc}, ${hrDesc}${dayDesc}${monDesc}${dowDesc}.`;
  };

  return (
    <div className="space-y-6">
      {/* Generated Cron Display Banner */}
      <div
        className={`p-6 rounded-3xl border text-center space-y-3 relative overflow-hidden ${
          isDark
            ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 border-purple-500/20'
            : 'bg-gradient-to-br from-white via-purple-50/40 to-indigo-50/30 border-purple-200 shadow-sm'
        }`}
      >
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {isAr ? 'تعبير الجدولة Cron الناتج' : 'Generated Cron Expression'}
        </div>

        <div className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-purple-400">
          {cronExpression}
        </div>

        {/* Human explanation banner */}
        <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs sm:text-sm font-semibold text-purple-300 max-w-xl mx-auto flex items-center justify-center gap-2">
          <Info className="w-4 h-4 shrink-0 text-purple-400" />
          <span>{getHumanDescription()}</span>
        </div>

        <div className="pt-2 flex items-center justify-center gap-2">
          <button
            onClick={() => onCopy(cronExpression)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{isAr ? 'نسخ التعبير' : 'Copy Expression'}</span>
          </button>

          <button
            onClick={handleReset}
            className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.reset}</span>
          </button>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-400 px-1">
          {isAr ? 'جداول زمنية شائعة (Quick Presets):' : 'Common Schedules (Presets):'}
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(p.expr)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                cronExpression === p.expr.join(' ')
                  ? 'bg-purple-600 border-purple-500 text-white shadow-sm'
                  : isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {isAr ? p.labelAr : p.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Visual 5-Field Builder */}
      <div
        className={`p-5 rounded-3xl border space-y-4 ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="text-sm font-bold flex items-center gap-2 pb-2 border-b border-slate-800/60">
          <Calendar className="w-4 h-4 text-purple-400" />
          <span>{isAr ? 'تخصيص الحقول الخمسة' : 'Customize Cron Fields'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Minute */}
          <div className={`p-3.5 rounded-2xl border space-y-2 ${
            isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <label className="block text-[11px] font-bold text-purple-400">
              {isAr ? 'الدقيقة (0-59)' : 'Minute (0-59)'}
            </label>
            <input
              type="text"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              placeholder="*"
              className={`w-full p-2.5 rounded-xl border font-mono text-center text-sm font-bold outline-none ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            />
            <div className="flex gap-1 justify-center flex-wrap text-[10px]">
              {['*', '0', '*/5', '*/15', '30'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setMinute(opt)}
                  className={`px-1.5 py-0.5 rounded border font-mono ${
                    minute === opt ? 'bg-purple-600 text-white border-purple-500' : 'border-slate-800/40 text-slate-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Hour */}
          <div className={`p-3.5 rounded-2xl border space-y-2 ${
            isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <label className="block text-[11px] font-bold text-indigo-400">
              {isAr ? 'الساعة (0-23)' : 'Hour (0-23)'}
            </label>
            <input
              type="text"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              placeholder="*"
              className={`w-full p-2.5 rounded-xl border font-mono text-center text-sm font-bold outline-none ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            />
            <div className="flex gap-1 justify-center flex-wrap text-[10px]">
              {['*', '0', '9', '12', '*/2'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setHour(opt)}
                  className={`px-1.5 py-0.5 rounded border font-mono ${
                    hour === opt ? 'bg-indigo-600 text-white border-indigo-500' : 'border-slate-800/40 text-slate-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Day of Month */}
          <div className={`p-3.5 rounded-2xl border space-y-2 ${
            isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <label className="block text-[11px] font-bold text-emerald-400">
              {isAr ? 'يوم الشهر (1-31)' : 'Day (1-31)'}
            </label>
            <input
              type="text"
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(e.target.value)}
              placeholder="*"
              className={`w-full p-2.5 rounded-xl border font-mono text-center text-sm font-bold outline-none ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            />
            <div className="flex gap-1 justify-center flex-wrap text-[10px]">
              {['*', '1', '15', 'L'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setDayOfMonth(opt)}
                  className={`px-1.5 py-0.5 rounded border font-mono ${
                    dayOfMonth === opt ? 'bg-emerald-600 text-white border-emerald-500' : 'border-slate-800/40 text-slate-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Month */}
          <div className={`p-3.5 rounded-2xl border space-y-2 ${
            isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <label className="block text-[11px] font-bold text-amber-400">
              {isAr ? 'الشهر (1-12)' : 'Month (1-12)'}
            </label>
            <input
              type="text"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="*"
              className={`w-full p-2.5 rounded-xl border font-mono text-center text-sm font-bold outline-none ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            />
            <div className="flex gap-1 justify-center flex-wrap text-[10px]">
              {['*', '1', '6', '12'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setMonth(opt)}
                  className={`px-1.5 py-0.5 rounded border font-mono ${
                    month === opt ? 'bg-amber-600 text-white border-amber-500' : 'border-slate-800/40 text-slate-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Day of Week */}
          <div className={`p-3.5 rounded-2xl border space-y-2 ${
            isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <label className="block text-[11px] font-bold text-cyan-400">
              {isAr ? 'يوم الأسبوع (0-6)' : 'Weekday (0-6)'}
            </label>
            <input
              type="text"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              placeholder="*"
              className={`w-full p-2.5 rounded-xl border font-mono text-center text-sm font-bold outline-none ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            />
            <div className="flex gap-1 justify-center flex-wrap text-[10px]">
              {['*', '0', '1', '1-5', '0,6'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setDayOfWeek(opt)}
                  className={`px-1.5 py-0.5 rounded border font-mono ${
                    dayOfWeek === opt ? 'bg-cyan-600 text-white border-cyan-500' : 'border-slate-800/40 text-slate-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

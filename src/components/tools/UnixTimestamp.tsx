import React, { useState, useEffect } from 'react';
import { Language, Theme } from '../../types';
import { translations } from '../../data/translations';
import { Copy, RefreshCw, Clock } from 'lucide-react';

interface UnixTimestampProps {
  language: Language;
  theme: Theme;
  onCopy: (text: string) => void;
}

export const UnixTimestamp: React.FC<UnixTimestampProps> = ({
  language,
  theme,
  onCopy,
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  const [nowMs, setNowMs] = useState<number>(Date.now());
  const [isMilliseconds, setIsMilliseconds] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeTimestamp = customInput
    ? parseInt(customInput, 10) || 0
    : isMilliseconds
    ? nowMs
    : Math.floor(nowMs / 1000);

  const parsedDate = new Date(
    activeTimestamp > 100000000000 ? activeTimestamp : activeTimestamp * 1000
  );

  const localDateStr = parsedDate.toString();
  const utcDateStr = parsedDate.toUTCString();

  const handleUpdateToNow = () => {
    setCustomInput('');
    setNowMs(Date.now());
  };

  const handleOffset = (seconds: number) => {
    const targetSec = (isMilliseconds ? Math.floor(nowMs / 1000) : activeTimestamp) + seconds;
    setCustomInput(isMilliseconds ? (targetSec * 1000).toString() : targetSec.toString());
  };

  return (
    <div className="space-y-5">
      {/* Live Epoch Counter Display Card */}
      <div
        className={`p-5 rounded-2xl border text-center space-y-3 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
          <Clock className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>{t.currentUnixTimestamp}</span>
        </div>

        <div className="font-mono text-2xl sm:text-4xl font-extrabold text-purple-400 tracking-widest selection:bg-purple-600">
          {activeTimestamp}
        </div>

        {/* Seconds / Milliseconds Toggle */}
        <div className="flex justify-center gap-2 pt-1">
          <button
            onClick={() => setIsMilliseconds(false)}
            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
              !isMilliseconds
                ? 'bg-purple-600 text-white border-purple-500'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {t.seconds}
          </button>
          <button
            onClick={() => setIsMilliseconds(true)}
            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
              isMilliseconds
                ? 'bg-purple-600 text-white border-purple-500'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {t.milliseconds}
          </button>
        </div>
      </div>

      {/* Human Date Outputs */}
      <div className="space-y-3">
        {/* Local Date */}
        <div
          className={`p-4 rounded-2xl border space-y-1 ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex justify-between items-center text-xs font-bold text-slate-400">
            <span>{t.localDateTime}</span>
            <button onClick={() => onCopy(localDateStr)} className="hover:text-purple-400">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="font-mono text-xs sm:text-sm text-emerald-400 font-bold">
            {localDateStr}
          </div>
        </div>

        {/* UTC Date */}
        <div
          className={`p-4 rounded-2xl border space-y-1 ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex justify-between items-center text-xs font-bold text-slate-400">
            <span>{t.utcDateTime}</span>
            <button onClick={() => onCopy(utcDateStr)} className="hover:text-purple-400">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="font-mono text-xs sm:text-sm text-cyan-400 font-bold">
            {utcDateStr}
          </div>
        </div>
      </div>

      {/* Quick Offset Controls */}
      <div
        className={`p-4 rounded-2xl border space-y-3 ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="text-xs font-bold text-slate-400">
          {language === 'ar' ? 'إزاحة سريعة للوقت:' : 'Quick Offsets:'}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleOffset(3600)}
            className="py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-purple-600 hover:text-white transition-colors"
          >
            +1 Hour
          </button>
          <button
            onClick={() => handleOffset(86400)}
            className="py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-purple-600 hover:text-white transition-colors"
          >
            +1 Day
          </button>
          <button
            onClick={() => handleOffset(604800)}
            className="py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-purple-600 hover:text-white transition-colors"
          >
            +1 Week
          </button>
        </div>

        <button
          onClick={handleUpdateToNow}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95 transition-transform"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t.updateNow}</span>
        </button>
      </div>
    </div>
  );
};

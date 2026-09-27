import React, { useState } from 'react';
import { Language, Theme } from '../../types';
import { translations } from '../../data/translations';
import { Terminal, Copy, BookOpen } from 'lucide-react';

interface RegexTesterProps {
  language: Language;
  theme: Theme;
  onCopy: (text: string) => void;
}

export const RegexTester: React.FC<RegexTesterProps> = ({ language, theme, onCopy }) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  const [pattern, setPattern] = useState<string>('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState<string>('g');
  const [testString, setTestString] = useState<string>(
    'Contact support@hypersoft.com or dev.team@hypertools.app for details.'
  );
  const [showCheatsheet, setShowCheatsheet] = useState<boolean>(false);

  let matches: string[] = [];
  let error = '';

  try {
    const re = new RegExp(pattern, flags);
    const found = testString.match(re);
    if (found) matches = Array.from(found);
  } catch (err: any) {
    error = err.message;
  }

  return (
    <div className="space-y-5">
      {/* Pattern Input & Flags */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
        <div className="sm:col-span-3 space-y-1">
          <label className="text-xs font-bold text-slate-400">Regex Pattern:</label>
          <div className="flex bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 items-center">
            <span className="text-purple-400 font-mono font-bold mr-1">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="w-full bg-transparent text-emerald-400 font-mono text-sm font-bold outline-none"
            />
            <span className="text-purple-400 font-mono font-bold ml-1">/</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400">Flags:</label>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="g, i, m"
            className="w-full bg-slate-950 border border-slate-800 text-purple-300 font-mono text-sm font-bold px-3 py-2 rounded-xl outline-none"
          />
        </div>
      </div>

      {/* Test String */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-400">Test String Input:</label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          rows={4}
          className={`w-full p-4 rounded-2xl border text-sm font-mono leading-relaxed outline-none transition-colors ${
            isDark
              ? 'bg-slate-950 border-slate-800 text-white focus:border-purple-500'
              : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
          }`}
        />
      </div>

      {/* Matches Results */}
      <div
        className={`p-4 rounded-2xl border space-y-2 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex justify-between items-center text-xs font-bold text-slate-400">
          <span>{matches.length} Matches Found:</span>
          <button
            onClick={() => setShowCheatsheet(!showCheatsheet)}
            className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'جدول المساعدة' : 'Cheatsheet'}</span>
          </button>
        </div>

        {error ? (
          <div className="text-rose-400 font-bold text-xs p-3 bg-rose-950/30 rounded-xl border border-rose-500/30">
            {error}
          </div>
        ) : matches.length === 0 ? (
          <div className="text-slate-500 text-xs italic py-2">
            {language === 'ar' ? 'لا توجد تطابقات مع النمط الحلي' : 'No matches found.'}
          </div>
        ) : (
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {matches.map((m, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 font-bold"
              >
                <span>{m}</span>
                <button onClick={() => onCopy(m)} className="hover:text-white">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cheatsheet Drawer */}
      {showCheatsheet && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2 font-mono">
          <div className="font-bold text-purple-400 mb-1">Regex Quick Guide:</div>
          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div><span className="text-emerald-400">\d</span> : Digit (0-9)</div>
            <div><span className="text-emerald-400">\w</span> : Word char</div>
            <div><span className="text-emerald-400">\s</span> : Whitespace</div>
            <div><span className="text-emerald-400">+</span> : 1 or more</div>
            <div><span className="text-emerald-400">*</span> : 0 or more</div>
            <div><span className="text-emerald-400">^ / $</span> : Start / End</div>
          </div>
        </div>
      )}
    </div>
  );
};

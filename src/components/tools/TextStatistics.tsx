import React, { useState } from 'react';
import { Language, Theme } from '../../types';
import { translations } from '../../data/translations';
import { FileText, Copy, Trash2 } from 'lucide-react';

interface TextStatisticsProps {
  language: Language;
  theme: Theme;
  onCopy: (text: string) => void;
}

export const TextStatistics: React.FC<TextStatisticsProps> = ({
  language,
  theme,
  onCopy,
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  const [text, setText] = useState<string>(
    'HyperTools v1.0 helps developers with fast utilities like Base64 encoding, color conversions, and JSON formatting.'
  );

  const words = text.trim() ? text.trim().split(/\s+/) : [];
  const wordCount = words.length;
  const charCount = text.length;
  const charNoSpaces = text.replace(/\s/g, '').length;
  const lineCount = text ? text.split(/\r\n|\r|\n/).length : 0;
  const sentenceCount = text.trim()
    ? text.split(/[.!?]+/).filter(Boolean).length
    : 0;
  const readTimeMin = Math.ceil(wordCount / 200);

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="space-y-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text for deep analytics..."
          rows={6}
          className={`w-full p-4 rounded-2xl border text-sm leading-relaxed outline-none transition-colors ${
            isDark
              ? 'bg-slate-950 border-slate-800 text-white focus:border-purple-500'
              : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
          }`}
        />
        <div className="flex justify-end">
          <button
            onClick={() => setText('')}
            className="text-rose-400 text-xs font-bold hover:text-rose-300 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.clear}</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: t.wordCount, val: wordCount, color: 'text-purple-400' },
          { label: t.charCount, val: charCount, color: 'text-cyan-400' },
          { label: t.charNoSpaces, val: charNoSpaces, color: 'text-emerald-400' },
          { label: t.lineCount, val: lineCount, color: 'text-amber-400' },
          { label: language === 'ar' ? 'عدد الجمل' : 'Sentences', val: sentenceCount, color: 'text-rose-400' },
          { label: t.readTime, val: `${readTimeMin} min`, color: 'text-indigo-400' },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border text-center space-y-1 ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="text-xs font-semibold text-slate-400">{item.label}</div>
            <div className={`font-mono text-xl sm:text-2xl font-black ${item.color}`}>
              {item.val}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

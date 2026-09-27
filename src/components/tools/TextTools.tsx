import React, { useState } from 'react';
import { Language, Theme } from '../../types';
import { translations } from '../../data/translations';
import { Copy, Trash2, ArrowRightLeft } from 'lucide-react';

interface TextToolsProps {
  language: Language;
  theme: Theme;
  onCopy: (text: string) => void;
}

export const TextTools: React.FC<TextToolsProps> = ({ language, theme, onCopy }) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  const [text, setText] = useState<string>('HyperTools provides quick developer utilities.');

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handleUpper = () => setText(text.toUpperCase());
  const handleLower = () => setText(text.toLowerCase());
  const handleTitle = () => {
    setText(
      text.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      )
    );
  };
  const handleCamel = () => {
    setText(
      text
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
          index === 0 ? letter.toLowerCase() : letter.toUpperCase()
        )
        .replace(/\s+/g, '')
    );
  };
  const handleKebab = () => {
    setText(
      text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, ' ')
        .trim()
        .replace(/\s+/g, '-')
    );
  };
  const handleSnake = () => {
    setText(
      text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, ' ')
        .trim()
        .replace(/\s+/g, '_')
    );
  };
  const handleRemoveSpaces = () => setText(text.replace(/\s+/g, ' ').trim());
  const handleReverse = () => setText(text.split('').reverse().join(''));
  const handleStripHtml = () => setText(text.replace(/<[^>]*>?/gm, ''));

  return (
    <div className="space-y-4">
      {/* Input Area */}
      <div className="space-y-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text here..."
          rows={6}
          className={`w-full p-4 rounded-2xl border text-sm font-sans leading-relaxed outline-none transition-colors ${
            isDark
              ? 'bg-slate-950 border-slate-800 text-white focus:border-purple-500'
              : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
          }`}
        />

        {/* Counters Bar */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
          <div className="flex gap-4">
            <span>
              {t.wordCount}: <strong className="text-purple-400 font-mono">{wordCount}</strong>
            </span>
            <span>
              {t.charCount}: <strong className="text-cyan-400 font-mono">{charCount}</strong>
            </span>
          </div>
          <button
            onClick={() => setText('')}
            className="text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.clear}</span>
          </button>
        </div>
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {[
          { label: t.toUpper, action: handleUpper },
          { label: t.toLower, action: handleLower },
          { label: t.toTitle, action: handleTitle },
          { label: t.toCamel, action: handleCamel },
          { label: t.toKebab, action: handleKebab },
          { label: t.toSnake, action: handleSnake },
          { label: t.removeSpaces, action: handleRemoveSpaces },
          { label: t.reverseText, action: handleReverse },
          { label: t.stripHtml, action: handleStripHtml },
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs border transition-all active:scale-95 ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-purple-600 hover:border-purple-500 hover:text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-purple-600 hover:text-white hover:border-purple-500 shadow-sm'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Copy Output CTA */}
      <button
        onClick={() => onCopy(text)}
        className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95 transition-transform"
      >
        <Copy className="w-4 h-4" />
        <span>{t.copy}</span>
      </button>
    </div>
  );
};

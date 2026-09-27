import React, { useState } from 'react';
import { Language, Theme } from '../../types';
import { translations } from '../../data/translations';
import { Copy, Link, ExternalLink, RefreshCw } from 'lucide-react';

interface UrlEncoderProps {
  language: Language;
  theme: Theme;
  onCopy: (text: string) => void;
}

export const UrlEncoder: React.FC<UrlEncoderProps> = ({ language, theme, onCopy }) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState<string>(
    'https://example.com/search?q=HyperTools+تطبيق'
  );

  let output = '';
  let error = '';

  try {
    if (mode === 'encode') {
      output = encodeURIComponent(input);
    } else {
      output = decodeURIComponent(input);
    }
  } catch {
    error = language === 'ar' ? 'فشل فك ترميز الـ URL' : 'Invalid URL encoding';
  }

  return (
    <div className="space-y-5">
      {/* Mode Selector */}
      <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => setMode('encode')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
            mode === 'encode'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.encode} (URL Encode)
        </button>

        <button
          onClick={() => setMode('decode')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
            mode === 'decode'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {t.decode} (URL Decode)
        </button>
      </div>

      {/* Input Field */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-400">
          {mode === 'encode' ? 'Raw URL / String:' : 'Encoded URL String:'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className={`w-full p-4 rounded-2xl border text-sm font-mono leading-relaxed outline-none transition-colors ${
            isDark
              ? 'bg-slate-950 border-slate-800 text-white focus:border-purple-500'
              : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
          }`}
        />
      </div>

      {/* Output Field */}
      <div
        className={`p-4 rounded-2xl border space-y-2 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex justify-between items-center text-xs font-bold text-slate-400">
          <span>{mode === 'encode' ? 'Encoded URL Output:' : 'Decoded URL Output:'}</span>
          <button
            onClick={() => onCopy(output)}
            className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{t.copy}</span>
          </button>
        </div>

        {error ? (
          <div className="text-rose-400 font-bold text-xs p-3 bg-rose-950/30 rounded-xl border border-rose-500/30">
            {error}
          </div>
        ) : (
          <div className="font-mono text-xs sm:text-sm text-cyan-400 font-bold break-all max-h-36 overflow-y-auto">
            {output}
          </div>
        )}
      </div>
    </div>
  );
};

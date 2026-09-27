import React, { useState, useEffect } from 'react';
import { Language, Theme } from '../../types';
import { translations } from '../../data/translations';
import { Copy, KeyRound, Check, X } from 'lucide-react';

interface HashGeneratorProps {
  language: Language;
  theme: Theme;
  onCopy: (text: string) => void;
}

export const HashGenerator: React.FC<HashGeneratorProps> = ({
  language,
  theme,
  onCopy,
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  const [input, setInput] = useState<string>('HyperTools by HyperSoft');
  const [sha1, setSha1] = useState<string>('');
  const [sha256, setSha256] = useState<string>('');
  const [sha512, setSha512] = useState<string>('');
  const [compareWith, setCompareWith] = useState<string>('');

  useEffect(() => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    crypto.subtle.digest('SHA-1', data).then((buffer) => {
      setSha1(Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, '0')).join(''));
    });

    crypto.subtle.digest('SHA-256', data).then((buffer) => {
      setSha256(Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, '0')).join(''));
    });

    crypto.subtle.digest('SHA-512', data).then((buffer) => {
      setSha512(Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, '0')).join(''));
    });
  }, [input]);

  const isMatch = compareWith && (
    compareWith.toLowerCase() === sha1.toLowerCase() ||
    compareWith.toLowerCase() === sha256.toLowerCase() ||
    compareWith.toLowerCase() === sha512.toLowerCase()
  );

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-400">{t.hashInput}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          className={`w-full p-4 rounded-2xl border text-sm font-mono leading-relaxed outline-none transition-colors ${
            isDark
              ? 'bg-slate-950 border-slate-800 text-white focus:border-purple-500'
              : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
          }`}
        />
      </div>

      {/* Hashes List */}
      <div className="space-y-3">
        {[
          { name: 'SHA-256', hash: sha256, color: 'text-purple-400' },
          { name: 'SHA-1', hash: sha1, color: 'text-cyan-400' },
          { name: 'SHA-512', hash: sha512, color: 'text-emerald-400' },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-2xl border space-y-1 ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex justify-between items-center text-xs font-bold text-slate-400">
              <span>{item.name}</span>
              <button onClick={() => onCopy(item.hash)} className="hover:text-purple-400">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className={`font-mono text-xs font-bold break-all ${item.color}`}>
              {item.hash}
            </div>
          </div>
        ))}
      </div>

      {/* Hash Comparator */}
      <div
        className={`p-4 rounded-2xl border space-y-2 ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <label className="text-xs font-bold text-slate-400">{t.compareHash}</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={compareWith}
            onChange={(e) => setCompareWith(e.target.value)}
            placeholder="Paste hash to compare..."
            className="w-full bg-slate-950 border border-slate-800 text-white font-mono text-xs px-3 py-2 rounded-xl outline-none"
          />
          {compareWith && (
            <div
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 ${
                isMatch
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
              }`}
            >
              {isMatch ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              <span>{isMatch ? t.match : t.noMatch}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

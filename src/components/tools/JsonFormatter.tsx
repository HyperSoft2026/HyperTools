import React, { useState } from 'react';
import { Language, Theme } from '../../types';
import { translations } from '../../data/translations';
import { Copy, Check, AlertCircle, Download, FileCode, Minimize2 } from 'lucide-react';

interface JsonFormatterProps {
  language: Language;
  theme: Theme;
  onCopy: (text: string) => void;
}

export const JsonFormatter: React.FC<JsonFormatterProps> = ({
  language,
  theme,
  onCopy,
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  const defaultJson = `{\n  "name": "HyperTools",\n  "version": "1.0.0",\n  "company": "HyperSoft",\n  "tools": [\n    "PasswordGen",\n    "ColorConverter",\n    "JsonFormatter"\n  ],\n  "isFree": true\n}`;

  const [input, setInput] = useState<string>(defaultJson);
  const [status, setStatus] = useState<{ isValid: boolean | null; message: string }>({
    isValid: true,
    message: t.jsonValid,
  });

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setInput(formatted);
      setStatus({ isValid: true, message: t.jsonValid });
    } catch (err: any) {
      setStatus({ isValid: false, message: err.message || t.jsonInvalid });
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setInput(minified);
      setStatus({ isValid: true, message: t.jsonValid });
    } catch (err: any) {
      setStatus({ isValid: false, message: err.message || t.jsonInvalid });
    }
  };

  const handleValidate = () => {
    try {
      JSON.parse(input);
      setStatus({ isValid: true, message: t.jsonValid });
    } catch (err: any) {
      setStatus({ isValid: false, message: err.message || t.jsonInvalid });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([input], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Code Input Area */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setStatus({ isValid: null, message: '' });
          }}
          placeholder="Paste or write JSON here..."
          rows={12}
          className="w-full p-4 bg-transparent text-emerald-400 font-mono text-xs sm:text-sm leading-relaxed outline-none resize-y selection:bg-purple-600"
          spellCheck={false}
        />
      </div>

      {/* Validation Status Banner */}
      {status.isValid !== null && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs font-bold ${
            status.isValid
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}
        >
          {status.isValid ? (
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        <button
          onClick={handleFormat}
          className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20 active:scale-95 transition-transform"
        >
          <FileCode className="w-4 h-4" />
          <span>{t.format}</span>
        </button>

        <button
          onClick={handleMinify}
          className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20 active:scale-95 transition-transform"
        >
          <Minimize2 className="w-4 h-4" />
          <span>{t.minifyJson}</span>
        </button>

        <button
          onClick={() => onCopy(input)}
          className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-colors ${
            isDark
              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Copy className="w-4 h-4" />
          <span>{t.copy}</span>
        </button>

        <button
          onClick={handleDownload}
          className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-colors ${
            isDark
              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>{t.download}</span>
        </button>
      </div>
    </div>
  );
};

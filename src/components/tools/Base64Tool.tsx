import React, { useState } from 'react';
import { Language, Theme } from '../../types';
import { translations } from '../../data/translations';
import { Copy, Lock, Unlock, Upload } from 'lucide-react';

interface Base64ToolProps {
  language: Language;
  theme: Theme;
  onCopy: (text: string) => void;
}

export const Base64Tool: React.FC<Base64ToolProps> = ({ language, theme, onCopy }) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState<string>('HyperSoft - HyperTools developer suite');
  const [fileBase64, setFileBase64] = useState<string>('');

  let output = '';
  let error = '';

  try {
    if (mode === 'encode') {
      output = btoa(unescape(encodeURIComponent(input)));
    } else {
      output = decodeURIComponent(escape(atob(input)));
    }
  } catch {
    error = language === 'ar' ? 'فشل فك التشفير - نص Base64 غير صالح' : 'Invalid Base64 string';
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFileBase64(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5">
      {/* Mode Selector */}
      <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => setMode('encode')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            mode === 'encode'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>{t.encode} (Text ➔ Base64)</span>
        </button>

        <button
          onClick={() => setMode('decode')}
          className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            mode === 'decode'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Unlock className="w-3.5 h-3.5" />
          <span>{t.decode} (Base64 ➔ Text)</span>
        </button>
      </div>

      {/* Text Area Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-400">
          {mode === 'encode' ? 'Plain Text Input:' : 'Base64 Encoded Input:'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.inputPlaceholderText}
          rows={5}
          className={`w-full p-4 rounded-2xl border text-sm font-mono leading-relaxed outline-none transition-colors ${
            isDark
              ? 'bg-slate-950 border-slate-800 text-white focus:border-purple-500'
              : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
          }`}
        />
      </div>

      {/* Output Display */}
      <div
        className={`p-4 rounded-2xl border space-y-2 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex justify-between items-center text-xs font-bold text-slate-400">
          <span>{mode === 'encode' ? t.encodedOutput : t.decodedOutput}</span>
          <button
            onClick={() => onCopy(output)}
            disabled={!!error}
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
          <div className="font-mono text-xs sm:text-sm text-emerald-400 font-bold break-all max-h-40 overflow-y-auto">
            {output}
          </div>
        )}
      </div>

      {/* File to Base64 Upload Box */}
      <div
        className={`p-4 rounded-2xl border space-y-3 ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span>{t.fileToBase64}</span>
          <label className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'رفع ملف' : 'Upload File'}</span>
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {fileBase64 && (
          <div className="space-y-2 pt-1">
            <div className="font-mono text-[11px] text-cyan-400 break-all max-h-24 overflow-y-auto p-2 bg-slate-950 rounded-lg border border-slate-800">
              {fileBase64}
            </div>
            <button
              onClick={() => onCopy(fileBase64)}
              className="py-2 w-full rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-purple-600 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'نسخ Data URL' : 'Copy Data URL'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

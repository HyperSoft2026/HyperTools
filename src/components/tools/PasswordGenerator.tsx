import React, { useState, useEffect } from 'react';
import { Language, Theme } from '../../types';
import { translations } from '../../data/translations';
import { Copy, RefreshCw, Shield, Check, List } from 'lucide-react';

interface PasswordGeneratorProps {
  language: Language;
  theme: Theme;
  onCopy: (text: string) => void;
}

export const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({
  language,
  theme,
  onCopy,
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  const [length, setLength] = useState<number>(16);
  const [useSymbols, setUseSymbols] = useState<boolean>(true);
  const [useNumbers, setUseNumbers] = useState<boolean>(true);
  const [useUppercase, setUseUppercase] = useState<boolean>(true);
  const [useLowercase, setUseLowercase] = useState<boolean>(true);
  const [excludeSimilar, setExcludeSimilar] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [batchCount, setBatchCount] = useState<number>(1);
  const [batchPasswords, setBatchPasswords] = useState<string[]>([]);
  const [showBatch, setShowBatch] = useState<boolean>(false);

  const generateSinglePassword = (): string => {
    let chars = '';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (useUppercase) chars += uppercase;
    if (useLowercase) chars += lowercase;
    if (useNumbers) chars += numbers;
    if (useSymbols) chars += symbols;

    if (excludeSimilar) {
      chars = chars.replace(/[l1I0O]/g, '');
    }

    if (!chars) return '';

    let result = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    return result;
  };

  const handleGenerate = () => {
    if (showBatch) {
      const list: string[] = [];
      for (let i = 0; i < batchCount; i++) {
        list.push(generateSinglePassword());
      }
      setBatchPasswords(list);
      if (list.length > 0) setPassword(list[0]);
    } else {
      const pwd = generateSinglePassword();
      setPassword(pwd);
    }
  };

  useEffect(() => {
    handleGenerate();
  }, [length, useSymbols, useNumbers, useUppercase, useLowercase, excludeSimilar, showBatch, batchCount]);

  // Calculate strength score
  const getStrength = () => {
    let score = 0;
    if (length >= 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    if (useSymbols) score += 1;
    if (useNumbers) score += 1;
    if (useUppercase && useLowercase) score += 1;

    if (score <= 2) return { label: t.weak, color: 'bg-rose-500', text: 'text-rose-400', width: '25%' };
    if (score <= 4) return { label: t.medium, color: 'bg-amber-500', text: 'text-amber-400', width: '50%' };
    if (score <= 5) return { label: t.strong, color: 'bg-emerald-500', text: 'text-emerald-400', width: '75%' };
    return { label: t.ultra, color: 'bg-purple-500', text: 'text-purple-400', width: '100%' };
  };

  const strength = getStrength();

  return (
    <div className="space-y-6">
      {/* Primary Output Display */}
      <div
        className={`p-4 rounded-2xl border transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800'
            : 'bg-slate-50 border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <input
            type="text"
            readOnly
            value={password}
            className="w-full bg-transparent text-emerald-400 font-mono text-lg sm:text-xl font-bold tracking-wider outline-none overflow-x-auto select-all"
          />
          <button
            onClick={() => onCopy(password)}
            className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 shadow-md shadow-purple-500/20"
          >
            <Copy className="w-4 h-4" />
            <span>{t.copy}</span>
          </button>
        </div>

        {/* Strength Meter Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              {t.pwdStrength}
            </span>
            <span className={strength.text}>{strength.label}</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full ${strength.color} rounded-full transition-all duration-300`}
              style={{ width: strength.width }}
            />
          </div>
        </div>
      </div>

      {/* Controls Container */}
      <div
        className={`p-5 rounded-2xl border space-y-5 ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        {/* Password Length Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-bold">
            <label className={isDark ? 'text-slate-200' : 'text-slate-800'}>
              {t.pwdLength}
            </label>
            <span className="text-purple-400 font-mono text-base px-2.5 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20">
              {length}
            </span>
          </div>
          <input
            type="range"
            min="6"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Option Switches */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {[
            { label: t.includeSymbols, value: useSymbols, setter: setUseSymbols },
            { label: t.includeNumbers, value: useNumbers, setter: setUseNumbers },
            { label: t.includeUppercase, value: useUppercase, setter: setUseUppercase },
            { label: t.includeLowercase, value: useLowercase, setter: setUseLowercase },
            { label: t.excludeSimilar, value: excludeSimilar, setter: setExcludeSimilar },
          ].map((opt, idx) => (
            <label
              key={idx}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                opt.value
                  ? isDark
                    ? 'bg-purple-950/30 border-purple-500/40 text-purple-200'
                    : 'bg-purple-50 border-purple-200 text-purple-900'
                  : isDark
                  ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <span className="text-xs sm:text-sm font-semibold">{opt.label}</span>
              <input
                type="checkbox"
                checked={opt.value}
                onChange={(e) => opt.setter(e.target.checked)}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
            </label>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleGenerate}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-transform"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t.generate}</span>
          </button>

          <button
            onClick={() => setShowBatch(!showBatch)}
            className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-colors ${
              showBatch
                ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                : isDark
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <List className="w-4 h-4" />
            <span>{language === 'ar' ? 'إنشاء دفعة' : 'Batch Generator'}</span>
          </button>
        </div>

        {/* Batch Password Drawer */}
        {showBatch && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{language === 'ar' ? 'عدد كلمات المرور:' : 'Batch Quantity:'}</span>
              <div className="flex gap-2">
                {[5, 10, 15].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => setBatchCount(cnt)}
                    className={`px-2.5 py-1 rounded-md font-mono text-xs font-bold ${
                      batchCount === cnt
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {batchPasswords.map((pwd, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400"
                >
                  <span className="truncate mr-2">{pwd}</span>
                  <button
                    onClick={() => onCopy(pwd)}
                    className="p-1 rounded bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

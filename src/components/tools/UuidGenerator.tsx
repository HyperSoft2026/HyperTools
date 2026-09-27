import React, { useState, useEffect } from 'react';
import { Language, Theme } from '../../types';
import { translations } from '../../data/translations';
import { Copy, RefreshCw, Download } from 'lucide-react';

interface UuidGeneratorProps {
  language: Language;
  theme: Theme;
  onCopy: (text: string) => void;
}

export const UuidGenerator: React.FC<UuidGeneratorProps> = ({
  language,
  theme,
  onCopy,
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  const [version, setVersion] = useState<'v4' | 'v1'>('v4');
  const [quantity, setQuantity] = useState<number>(5);
  const [hyphens, setHyphens] = useState<boolean>(true);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [uuids, setUuids] = useState<string[]>([]);

  const generateUuidV4 = (): string => {
    let u = '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
    if (!hyphens) u = u.replace(/-/g, '');
    if (uppercase) u = u.toUpperCase();
    return u;
  };

  const generateUuidV1 = (): string => {
    // Pseudo RFC4122 v1 time-based simulation
    const now = Date.now();
    const hexTime = now.toString(16).padStart(12, '0');
    let u = `${hexTime.slice(0, 8)}-${hexTime.slice(8, 12)}-11e1-a716-446655440000`;
    if (!hyphens) u = u.replace(/-/g, '');
    if (uppercase) u = u.toUpperCase();
    return u;
  };

  const handleGenerate = () => {
    const list: string[] = [];
    for (let i = 0; i < quantity; i++) {
      list.push(version === 'v4' ? generateUuidV4() : generateUuidV1());
    }
    setUuids(list);
  };

  useEffect(() => {
    handleGenerate();
  }, [version, quantity, hyphens, uppercase]);

  const allText = uuids.join('\n');

  return (
    <div className="space-y-5">
      {/* Primary Display List */}
      <div
        className={`p-4 rounded-2xl border space-y-2.5 max-h-60 overflow-y-auto ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        {uuids.map((uuid, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between p-3 rounded-xl border text-xs sm:text-sm font-mono font-bold ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-emerald-400'
                : 'bg-white border-slate-200 text-emerald-700 shadow-sm'
            }`}
          >
            <span className="truncate pr-2">{uuid}</span>
            <button
              onClick={() => onCopy(uuid)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white transition-colors shrink-0"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Controls Card */}
      <div
        className={`p-5 rounded-2xl border space-y-4 ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        {/* Version Switch Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          {['v4', 'v1'].map((v) => (
            <button
              key={v}
              onClick={() => setVersion(v as 'v4' | 'v1')}
              className={`flex-1 py-2 rounded-lg text-xs font-extrabold font-mono transition-all ${
                version === v
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              UUID {v.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Quantity Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
              {t.uuidQuantity}
            </span>
            <span className="font-mono text-purple-400 font-bold">{quantity}</span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <label
            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
              hyphens
                ? 'bg-purple-950/30 border-purple-500/40 text-purple-200'
                : 'bg-slate-950/40 border-slate-800 text-slate-400'
            }`}
          >
            <span className="text-xs font-bold">{t.uuidHyphens}</span>
            <input
              type="checkbox"
              checked={hyphens}
              onChange={(e) => setHyphens(e.target.checked)}
              className="accent-purple-600 w-4 h-4 rounded"
            />
          </label>

          <label
            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
              uppercase
                ? 'bg-purple-950/30 border-purple-500/40 text-purple-200'
                : 'bg-slate-950/40 border-slate-800 text-slate-400'
            }`}
          >
            <span className="text-xs font-bold">{t.uuidUppercase}</span>
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="accent-purple-600 w-4 h-4 rounded"
            />
          </label>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          <button
            onClick={handleGenerate}
            className="py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95 transition-transform"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t.generate}</span>
          </button>

          <button
            onClick={() => onCopy(allText)}
            className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-colors ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Copy className="w-4 h-4" />
            <span>{language === 'ar' ? 'نسخ الكل' : 'Copy All'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

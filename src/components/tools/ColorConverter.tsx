import React, { useState } from 'react';
import { Language, Theme } from '../../types';
import { translations } from '../../data/translations';
import { Copy, RefreshCw, Eye } from 'lucide-react';

interface ColorConverterProps {
  language: Language;
  theme: Theme;
  onCopy: (text: string) => void;
}

export const ColorConverter: React.FC<ColorConverterProps> = ({
  language,
  theme,
  onCopy,
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  const [hex, setHex] = useState<string>('#008080'); // Teal default from image 3!
  const [rgb, setRgb] = useState<{ r: number; g: number; b: number }>({ r: 0, g: 128, b: 128 });

  // Update RGB when HEX changes
  const handleHexChange = (newHex: string) => {
    setHex(newHex);
    if (/^#([A-Fa-f0-9]{6})$/.test(newHex)) {
      const r = parseInt(newHex.slice(1, 3), 16);
      const g = parseInt(newHex.slice(3, 5), 16);
      const b = parseInt(newHex.slice(5, 7), 16);
      setRgb({ r, g, b });
    }
  };

  // Update HEX when RGB changes
  const handleRgbChange = (r: number, g: number, b: number) => {
    setRgb({ r, g, b });
    const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
    setHex(`#${toHex(r)}${toHex(g)}${toHex(b)}`);
  };

  // Conversions
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    let c = 1 - r / 255;
    let m = 1 - g / 255;
    let y = 1 - b / 255;
    let k = Math.min(c, Math.min(m, y));

    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };

    c = Math.round(((c - k) / (1 - k)) * 100);
    m = Math.round(((m - k) / (1 - k)) * 100);
    y = Math.round(((y - k) / (1 - k)) * 100);
    k = Math.round(k * 100);

    return { c, m, y, k };
  };

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const cmykString = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;

  return (
    <div className="space-y-6">
      {/* Color Visual Block */}
      <div
        className="w-full h-44 sm:h-52 rounded-2xl shadow-xl flex items-end justify-between p-4 relative overflow-hidden transition-colors border border-slate-700/50"
        style={{ backgroundColor: hex }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        
        {/* Color picker native trigger button overlay */}
        <label className="relative z-10 bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-black/80 transition-colors">
          <input
            type="color"
            value={hex}
            onChange={(e) => handleHexChange(e.target.value)}
            className="w-0 h-0 opacity-0 absolute"
          />
          <Eye className="w-4 h-4" />
          <span>{language === 'ar' ? 'اختر لون بالفرشاة' : 'Pick Color'}</span>
        </label>

        <div className="relative z-10 text-white font-mono text-xl sm:text-2xl font-bold tracking-wider drop-shadow-md">
          {hex}
        </div>
      </div>

      {/* HEX and RGB Input Controls */}
      <div
        className={`p-5 rounded-2xl border space-y-5 ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        {/* HEX Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400">
            <span>HEX</span>
            <button
              onClick={() => onCopy(hex)}
              className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{t.copy}</span>
            </button>
          </div>
          <input
            type="text"
            value={hex}
            onChange={(e) => handleHexChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-white font-mono text-lg font-bold px-4 py-2.5 rounded-xl outline-none focus:border-purple-500 uppercase"
          />
        </div>

        {/* RGB Sliders */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-400">RGB (0 - 255)</div>
          
          {/* Red Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-rose-400">
              <span>Red (R)</span>
              <span className="font-mono">{rgb.r}</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.r}
              onChange={(e) => handleRgbChange(parseInt(e.target.value), rgb.g, rgb.b)}
              className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Green Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-emerald-400">
              <span>Green (G)</span>
              <span className="font-mono">{rgb.g}</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.g}
              onChange={(e) => handleRgbChange(rgb.r, parseInt(e.target.value), rgb.b)}
              className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Blue Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-sky-400">
              <span>Blue (B)</span>
              <span className="font-mono">{rgb.b}</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.b}
              onChange={(e) => handleRgbChange(rgb.r, rgb.g, parseInt(e.target.value))}
              className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Converted Format Display Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* HSL */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400 font-bold">
              <span>HSL</span>
              <button
                onClick={() => onCopy(hslString)}
                className="text-purple-400 hover:text-purple-300"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <div className="font-mono text-xs text-white font-semibold truncate">
              {hslString}
            </div>
          </div>

          {/* CMYK */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400 font-bold">
              <span>CMYK</span>
              <button
                onClick={() => onCopy(cmykString)}
                className="text-purple-400 hover:text-purple-300"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <div className="font-mono text-xs text-white font-semibold truncate">
              {cmykString}
            </div>
          </div>

          {/* RGB Code */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400 font-bold">
              <span>RGB</span>
              <button
                onClick={() => onCopy(rgbString)}
                className="text-purple-400 hover:text-purple-300"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <div className="font-mono text-xs text-white font-semibold truncate">
              {rgbString}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

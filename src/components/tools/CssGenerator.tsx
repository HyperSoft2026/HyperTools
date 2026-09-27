import React, { useState } from 'react';
import { Language, Theme } from '../../types';
import { translations } from '../../data/translations';
import { Copy, Sparkles } from 'lucide-react';

interface CssGeneratorProps {
  language: Language;
  theme: Theme;
  onCopy: (text: string) => void;
}

export const CssGenerator: React.FC<CssGeneratorProps> = ({
  language,
  theme,
  onCopy,
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'shadow' | 'glass' | 'gradient'>('glass');

  // Shadow params
  const [xShadow, setXShadow] = useState<number>(0);
  const [yShadow, setYShadow] = useState<number>(20);
  const [blurShadow, setBlurShadow] = useState<number>(30);
  const [spreadShadow, setSpreadShadow] = useState<number>(-5);

  // Glass params
  const [glassBlur, setGlassBlur] = useState<number>(16);
  const [glassOpacity, setGlassOpacity] = useState<number>(20);
  const [glassBorder, setGlassBorder] = useState<number>(10);

  // Gradient params
  const [color1, setColor1] = useState<string>('#a855f7');
  const [color2, setColor2] = useState<string>('#3b82f6');
  const [angle, setAngle] = useState<number>(135);

  let cssCode = '';
  if (activeTab === 'shadow') {
    cssCode = `box-shadow: ${xShadow}px ${yShadow}px ${blurShadow}px ${spreadShadow}px rgba(168, 85, 247, 0.4);`;
  } else if (activeTab === 'glass') {
    cssCode = `background: rgba(255, 255, 255, ${glassOpacity / 100});\nbackdrop-filter: blur(${glassBlur}px);\n-webkit-backdrop-filter: blur(${glassBlur}px);\nborder: 1px solid rgba(255, 255, 255, ${glassBorder / 100});`;
  } else {
    cssCode = `background: linear-gradient(${angle}deg, ${color1}, ${color2});`;
  }

  return (
    <div className="space-y-5">
      {/* Tab Switcher */}
      <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
        {[
          { id: 'glass', label: t.cssGlassmorphic },
          { id: 'shadow', label: t.cssBoxShadow },
          { id: 'gradient', label: t.cssGradient },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Live Preview Screen */}
      <div className="h-48 rounded-2xl bg-gradient-to-tr from-purple-900 via-slate-900 to-indigo-950 p-8 flex items-center justify-center relative overflow-hidden border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        
        <div
          className="w-36 h-28 rounded-2xl flex items-center justify-center font-bold text-white text-xs shadow-2xl relative z-10 transition-all"
          style={
            activeTab === 'shadow'
              ? {
                  backgroundColor: '#1e1b4b',
                  boxShadow: `${xShadow}px ${yShadow}px ${blurShadow}px ${spreadShadow}px rgba(168, 85, 247, 0.4)`,
                }
              : activeTab === 'glass'
              ? {
                  background: `rgba(255, 255, 255, ${glassOpacity / 100})`,
                  backdropFilter: `blur(${glassBlur}px)`,
                  WebkitBackdropFilter: `blur(${glassBlur}px)`,
                  border: `1px solid rgba(255, 255, 255, ${glassBorder / 100})`,
                }
              : {
                  background: `linear-gradient(${angle}deg, ${color1}, ${color2})`,
                }
          }
        >
          HyperTools
        </div>
      </div>

      {/* Controls */}
      <div
        className={`p-4 rounded-2xl border space-y-3 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        {activeTab === 'shadow' && (
          <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
            <div>
              <label className="text-slate-400">Y Offset ({yShadow}px)</label>
              <input
                type="range"
                min="-50"
                max="50"
                value={yShadow}
                onChange={(e) => setYShadow(parseInt(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>
            <div>
              <label className="text-slate-400">Blur ({blurShadow}px)</label>
              <input
                type="range"
                min="0"
                max="80"
                value={blurShadow}
                onChange={(e) => setBlurShadow(parseInt(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>
          </div>
        )}

        {activeTab === 'glass' && (
          <div className="grid grid-cols-3 gap-3 text-xs font-semibold">
            <div>
              <label className="text-slate-400">Blur ({glassBlur}px)</label>
              <input
                type="range"
                min="0"
                max="40"
                value={glassBlur}
                onChange={(e) => setGlassBlur(parseInt(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>
            <div>
              <label className="text-slate-400">Opacity ({glassOpacity}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={glassOpacity}
                onChange={(e) => setGlassOpacity(parseInt(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>
            <div>
              <label className="text-slate-400">Border ({glassBorder}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={glassBorder}
                onChange={(e) => setGlassBorder(parseInt(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>
          </div>
        )}

        {activeTab === 'gradient' && (
          <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
            <div>
              <label className="text-slate-400">Color 1</label>
              <input
                type="color"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="w-full h-8 rounded-lg cursor-pointer bg-transparent"
              />
            </div>
            <div>
              <label className="text-slate-400">Color 2</label>
              <input
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="w-full h-8 rounded-lg cursor-pointer bg-transparent"
              />
            </div>
            <div>
              <label className="text-slate-400">Angle ({angle}°)</label>
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(parseInt(e.target.value))}
                className="w-full accent-purple-500 mt-2"
              />
            </div>
          </div>
        )}
      </div>

      {/* CSS Code Snippet */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-slate-400">
          <span>Generated CSS:</span>
          <button onClick={() => onCopy(cssCode)} className="text-purple-400 hover:text-purple-300 flex items-center gap-1">
            <Copy className="w-3.5 h-3.5" />
            <span>{t.copy}</span>
          </button>
        </div>
        <pre className="font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap">
          {cssCode}
        </pre>
      </div>
    </div>
  );
};

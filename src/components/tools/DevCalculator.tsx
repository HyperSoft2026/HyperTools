import React, { useState } from 'react';
import { Language, Theme } from '../../types';
import { translations } from '../../data/translations';
import { Copy } from 'lucide-react';

interface DevCalculatorProps {
  language: Language;
  theme: Theme;
  onCopy: (text: string) => void;
}

export const DevCalculator: React.FC<DevCalculatorProps> = ({
  language,
  theme,
  onCopy,
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  const [val, setVal] = useState<bigint>(BigInt(420));
  const [activeBase, setActiveBase] = useState<'HEX' | 'DEC' | 'OCT' | 'BIN'>('HEX');

  const uintVal = BigInt.asUintN(64, val);

  const hexString = '0x' + uintVal.toString(16).toUpperCase();
  const decString = uintVal.toString(10);
  const octString = uintVal.toString(8);
  const binString = uintVal.toString(2).padStart(16, '0');

  const handleKeyClick = (key: string) => {
    if (key === 'C') {
      setVal(BigInt(0));
      return;
    }
    if (key === 'DEL') {
      const current = uintVal.toString(10);
      if (current.length <= 1) {
        setVal(BigInt(0));
      } else {
        setVal(BigInt(current.slice(0, -1)));
      }
      return;
    }

    try {
      if (activeBase === 'HEX') {
        const currentHex = uintVal.toString(16);
        const newHex = currentHex === '0' ? key : currentHex + key;
        setVal(BigInt.asUintN(64, BigInt('0x' + newHex)));
      } else if (activeBase === 'DEC') {
        if (['A', 'B', 'C', 'D', 'E', 'F'].includes(key)) return;
        const currentDec = uintVal.toString(10);
        const newDec = currentDec === '0' ? key : currentDec + key;
        setVal(BigInt.asUintN(64, BigInt(newDec)));
      } else if (activeBase === 'OCT') {
        if (['8', '9', 'A', 'B', 'C', 'D', 'E', 'F'].includes(key)) return;
        const currentOct = uintVal.toString(8);
        const newOct = currentOct === '0' ? key : currentOct + key;
        setVal(BigInt.asUintN(64, BigInt('0o' + newOct)));
      } else if (activeBase === 'BIN') {
        if (!['0', '1'].includes(key)) return;
        const currentBin = uintVal.toString(2);
        const newBin = currentBin === '0' ? key : currentBin + key;
        setVal(BigInt.asUintN(64, BigInt('0b' + newBin)));
      }
    } catch {
      // Overflows guarded
    }
  };

  const handleBitwiseOp = (op: string) => {
    try {
      if (op === 'Lsh') setVal(BigInt.asUintN(64, uintVal << BigInt(1)));
      if (op === 'Rsh') setVal(BigInt.asUintN(64, uintVal >> BigInt(1)));
      if (op === 'NOT') setVal(BigInt.asUintN(64, ~uintVal));
    } catch {
      // Overflow safe
    }
  };

  // Toggle individual bit (0-31)
  const toggleBit = (bitIndex: number) => {
    const mask = BigInt(1) << BigInt(bitIndex);
    setVal(BigInt.asUintN(64, uintVal ^ mask));
  };

  return (
    <div className="space-y-6">
      {/* Primary Conversion Display Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { key: 'HEX' as const, label: t.hexadecimal, val: hexString, color: 'text-purple-400' },
          { key: 'DEC' as const, label: t.decimal, val: decString, color: 'text-cyan-400' },
          { key: 'OCT' as const, label: t.octal, val: octString, color: 'text-emerald-400' },
          { key: 'BIN' as const, label: t.binary, val: binString, color: 'text-amber-400' },
        ].map((item) => {
          const isSelected = activeBase === item.key;
          return (
            <div
              key={item.key}
              onClick={() => setActiveBase(item.key)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-900 border-purple-500/60 ring-2 ring-purple-500/30'
                  : isDark
                  ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1">
                <span>{item.label}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopy(item.val);
                  }}
                  className="hover:text-white"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <div
                className={`font-mono font-bold text-base sm:text-lg truncate ${item.color}`}
              >
                {item.val}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bit Viewer (32-bit Interactive Matrix) */}
      <div
        className={`p-4 rounded-2xl border space-y-2 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="text-xs font-bold text-slate-400 flex justify-between items-center">
          <span>{t.bitViewer}</span>
          <span className="text-[10px] text-purple-400">
            {language === 'ar' ? 'اضغط على البت لتغيير قيمته' : 'Click bit to flip'}
          </span>
        </div>

        <div className="grid grid-cols-8 gap-1.5 pt-1">
          {Array.from({ length: 32 }).map((_, idx) => {
            const bitIndex = 31 - idx;
            const isSet = ((uintVal >> BigInt(bitIndex)) & BigInt(1)) === BigInt(1);

            return (
              <button
                key={bitIndex}
                onClick={() => toggleBit(bitIndex)}
                className={`flex flex-col items-center justify-center py-1.5 rounded-lg font-mono transition-all border ${
                  isSet
                    ? 'bg-purple-600 text-white border-purple-400 font-bold shadow-sm shadow-purple-500/30'
                    : 'bg-slate-950/60 text-slate-500 border-slate-800 hover:text-slate-300'
                }`}
              >
                <span className="text-[9px] opacity-60 mb-0.5">{bitIndex}</span>
                <span className="text-xs">{isSet ? '1' : '0'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Calculator Keypad */}
      <div
        className={`p-4 rounded-2xl border space-y-3 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>{language === 'ar' ? 'لوحة مفاتيح المطور' : 'Dev Keypad'}</span>
          <span className="text-purple-400 font-bold">{activeBase} Mode</span>
        </div>

        {/* Bitwise Row */}
        <div className="grid grid-cols-4 gap-2">
          {['Lsh', 'Rsh', 'NOT', 'C'].map((op) => (
            <button
              key={op}
              onClick={() => (op === 'C' ? handleKeyClick('C') : handleBitwiseOp(op))}
              className="py-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 font-mono text-xs font-bold hover:bg-purple-900/40 active:scale-95 transition-all"
            >
              {op}
            </button>
          ))}
        </div>

        {/* Keypad Buttons */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {['A', 'B', 'C_KEY', 'D', 'E', 'F', '7', '8', '9', '4', '5', '6', '1', '2', '3', '0', 'DEL'].map(
            (k) => {
              if (k === 'C_KEY') return null;
              const isHexOnly = ['A', 'B', 'D', 'E', 'F'].includes(k);
              const isDisabled =
                (activeBase === 'DEC' && isHexOnly) ||
                (activeBase === 'OCT' && (isHexOnly || ['8', '9'].includes(k))) ||
                (activeBase === 'BIN' && (isHexOnly || !['0', '1'].includes(k)));

              return (
                <button
                  key={k}
                  disabled={isDisabled}
                  onClick={() => handleKeyClick(k)}
                  className={`py-3 rounded-xl font-mono text-sm font-bold border transition-all active:scale-95 ${
                    isDisabled
                      ? 'opacity-20 cursor-not-allowed bg-slate-950 border-slate-900 text-slate-600'
                      : k === 'DEL'
                      ? 'bg-rose-950/40 border-rose-500/30 text-rose-300 hover:bg-rose-900/40'
                      : 'bg-slate-800/80 border-slate-700 text-white hover:bg-purple-600 hover:border-purple-500'
                  }`}
                >
                  {k}
                </button>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

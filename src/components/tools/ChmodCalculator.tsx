import React, { useState, useEffect } from 'react';
import { Language, Theme } from '../../types';
import { translations } from '../../data/translations';
import {
  TerminalSquare,
  Copy,
  RotateCcw,
  Check,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface ChmodCalculatorProps {
  language: Language;
  theme: Theme;
  onCopy: (text: string) => void;
}

interface TierPermissions {
  read: boolean;
  write: boolean;
  execute: boolean;
}

export const ChmodCalculator: React.FC<ChmodCalculatorProps> = ({ language, theme, onCopy }) => {
  const isDark = theme === 'dark';
  const isAr = language === 'ar';
  const t = translations[language];

  // Default: 755 (rwxr-xr-x)
  const [owner, setOwner] = useState<TierPermissions>({ read: true, write: true, execute: true });
  const [group, setGroup] = useState<TierPermissions>({ read: true, write: false, execute: true });
  const [others, setOthers] = useState<TierPermissions>({ read: true, write: false, execute: true });
  const [special, setSpecial] = useState<{ suid: boolean; sgid: boolean; sticky: boolean }>({
    suid: false,
    sgid: false,
    sticky: false,
  });

  const [filename, setFilename] = useState<string>('app.sh');

  // Compute octal number for a tier
  const getTierOctal = (p: TierPermissions): number => {
    return (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0);
  };

  const specialOctal = (special.suid ? 4 : 0) + (special.sgid ? 2 : 0) + (special.sticky ? 1 : 0);
  const ownerOctal = getTierOctal(owner);
  const groupOctal = getTierOctal(group);
  const othersOctal = getTierOctal(others);

  const octalString = specialOctal > 0
    ? `${specialOctal}${ownerOctal}${groupOctal}${othersOctal}`
    : `${ownerOctal}${groupOctal}${othersOctal}`;

  // Compute symbolic string
  const getTierSymbolic = (p: TierPermissions, specialType?: 'suid' | 'sgid' | 'sticky'): string => {
    let r = p.read ? 'r' : '-';
    let w = p.write ? 'w' : '-';
    let x = p.execute ? 'x' : '-';

    if (specialType === 'suid' && special.suid) {
      x = p.execute ? 's' : 'S';
    } else if (specialType === 'sgid' && special.sgid) {
      x = p.execute ? 's' : 'S';
    } else if (specialType === 'sticky' && special.sticky) {
      x = p.execute ? 't' : 'T';
    }

    return `${r}${w}${x}`;
  };

  const symbolicString = `-${getTierSymbolic(owner, 'suid')}${getTierSymbolic(group, 'sgid')}${getTierSymbolic(others, 'sticky')}`;

  // Parse numeric string e.g. "755" or "0755"
  const handleNumericInput = (val: string) => {
    const cleaned = val.replace(/[^0-7]/g, '').slice(0, 4);
    if (!cleaned) return;

    let o = 0, g = 0, oth = 0;
    if (cleaned.length === 3) {
      o = parseInt(cleaned[0], 10);
      g = parseInt(cleaned[1], 10);
      oth = parseInt(cleaned[2], 10);
      setSpecial({ suid: false, sgid: false, sticky: false });
    } else if (cleaned.length === 4) {
      const sp = parseInt(cleaned[0], 10);
      o = parseInt(cleaned[1], 10);
      g = parseInt(cleaned[2], 10);
      oth = parseInt(cleaned[3], 10);
      setSpecial({
        suid: (sp & 4) === 4,
        sgid: (sp & 2) === 2,
        sticky: (sp & 1) === 1,
      });
    }

    setOwner({ read: (o & 4) === 4, write: (o & 2) === 2, execute: (o & 1) === 1 });
    setGroup({ read: (g & 4) === 4, write: (g & 2) === 2, execute: (g & 1) === 1 });
    setOthers({ read: (oth & 4) === 4, write: (oth & 2) === 2, execute: (oth & 1) === 1 });
  };

  // Apply preset
  const applyPreset = (octal: string) => {
    handleNumericInput(octal);
  };

  const handleReset = () => {
    applyPreset('755');
    setFilename('app.sh');
  };

  const chmodCommand = `chmod ${octalString} ${filename}`;

  return (
    <div className="space-y-6">
      {/* Top Value Cards: Octal & Symbolic & Command */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Octal */}
        <div
          className={`p-4 rounded-2xl border text-center space-y-1 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {isAr ? 'الترميز الرقمي (Numeric)' : 'Numeric / Octal'}
          </div>
          <div className="text-2xl font-black text-purple-400 font-mono tracking-wider">
            {octalString}
          </div>
          <button
            onClick={() => onCopy(octalString)}
            className="text-[11px] font-bold text-slate-400 hover:text-purple-400 flex items-center justify-center gap-1 mx-auto pt-1"
          >
            <Copy className="w-3 h-3" />
            <span>{isAr ? 'نسخ' : 'Copy'}</span>
          </button>
        </div>

        {/* Symbolic */}
        <div
          className={`p-4 rounded-2xl border text-center space-y-1 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {isAr ? 'الترميز الرمزي (Symbolic)' : 'Symbolic Mode'}
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono tracking-wider">
            {symbolicString}
          </div>
          <button
            onClick={() => onCopy(symbolicString)}
            className="text-[11px] font-bold text-slate-400 hover:text-emerald-400 flex items-center justify-center gap-1 mx-auto pt-1"
          >
            <Copy className="w-3 h-3" />
            <span>{isAr ? 'نسخ' : 'Copy'}</span>
          </button>
        </div>

        {/* Full Command */}
        <div
          className={`p-4 rounded-2xl border text-center space-y-1 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {isAr ? 'أمر الطرفية (Terminal Command)' : 'Linux Command'}
          </div>
          <div className="text-sm font-black text-cyan-400 font-mono truncate px-1">
            {chmodCommand}
          </div>
          <button
            onClick={() => onCopy(chmodCommand)}
            className="text-[11px] font-bold text-slate-400 hover:text-cyan-400 flex items-center justify-center gap-1 mx-auto pt-1"
          >
            <Copy className="w-3 h-3" />
            <span>{isAr ? 'نسخ الأمر' : 'Copy Command'}</span>
          </button>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-400 px-1">
          {isAr ? 'أشهر الأذونات الجاهزة (Quick Presets):' : 'Common Permissions (Presets):'}
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: '755 (Standard Executable)', val: '755' },
            { label: '644 (Standard File)', val: '644' },
            { label: '700 (Private Executable)', val: '700' },
            { label: '600 (Private Secret File)', val: '600' },
            { label: '777 (Full Access)', val: '777' },
            { label: '400 (Read Only Private)', val: '400' },
          ].map((preset) => (
            <button
              key={preset.val}
              onClick={() => applyPreset(preset.val)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-colors ${
                octalString === preset.val
                  ? 'bg-purple-600 border-purple-500 text-white shadow-sm'
                  : isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Permission Checkbox Matrix */}
      <div
        className={`p-5 rounded-3xl border space-y-4 ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
          <span className="text-sm font-bold flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <span>{isAr ? 'مصفوفة الأذونات التفاعلية' : 'Permissions Matrix'}</span>
          </span>

          <button
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.reset}</span>
          </button>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Owner (User) */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-purple-400">
                {isAr ? 'المالك (Owner / User)' : 'Owner (User)'}
              </span>
              <span className="font-mono text-xs font-black text-slate-400">
                {ownerOctal}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={owner.read}
                  onChange={(e) => setOwner({ ...owner, read: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <span>{isAr ? 'قراءة (Read - 4)' : 'Read (r - 4)'}</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={owner.write}
                  onChange={(e) => setOwner({ ...owner, write: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <span>{isAr ? 'كتابة (Write - 2)' : 'Write (w - 2)'}</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={owner.execute}
                  onChange={(e) => setOwner({ ...owner, execute: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <span>{isAr ? 'تنفيذ (Execute - 1)' : 'Execute (x - 1)'}</span>
              </label>
            </div>
          </div>

          {/* Group */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-emerald-400">
                {isAr ? 'المجموعة (Group)' : 'Group'}
              </span>
              <span className="font-mono text-xs font-black text-slate-400">
                {groupOctal}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={group.read}
                  onChange={(e) => setGroup({ ...group, read: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>{isAr ? 'قراءة (Read - 4)' : 'Read (r - 4)'}</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={group.write}
                  onChange={(e) => setGroup({ ...group, write: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>{isAr ? 'كتابة (Write - 2)' : 'Write (w - 2)'}</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={group.execute}
                  onChange={(e) => setGroup({ ...group, execute: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>{isAr ? 'تنفيذ (Execute - 1)' : 'Execute (x - 1)'}</span>
              </label>
            </div>
          </div>

          {/* Others / Public */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-cyan-400">
                {isAr ? 'الآخرين (Others / Public)' : 'Others (Public)'}
              </span>
              <span className="font-mono text-xs font-black text-slate-400">
                {othersOctal}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={others.read}
                  onChange={(e) => setOthers({ ...others, read: e.target.checked })}
                  className="rounded text-cyan-600 focus:ring-cyan-500 w-4 h-4"
                />
                <span>{isAr ? 'قراءة (Read - 4)' : 'Read (r - 4)'}</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={others.write}
                  onChange={(e) => setOthers({ ...others, write: e.target.checked })}
                  className="rounded text-cyan-600 focus:ring-cyan-500 w-4 h-4"
                />
                <span>{isAr ? 'كتابة (Write - 2)' : 'Write (w - 2)'}</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={others.execute}
                  onChange={(e) => setOthers({ ...others, execute: e.target.checked })}
                  className="rounded text-cyan-600 focus:ring-cyan-500 w-4 h-4"
                />
                <span>{isAr ? 'تنفيذ (Execute - 1)' : 'Execute (x - 1)'}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Target Filename Input */}
        <div className="pt-2 flex items-center gap-3">
          <label className="text-xs font-bold text-slate-400 shrink-0">
            {isAr ? 'اسم الملف للمطابقة:' : 'Target file name:'}
          </label>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className={`flex-1 px-3 py-1.5 rounded-xl border text-xs font-mono outline-none ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

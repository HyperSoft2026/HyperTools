import React, { useState } from 'react';
import { Language, Theme } from '../../types';
import { translations } from '../../data/translations';
import {
  GitCompare,
  Copy,
  RotateCcw,
  ArrowLeftRight,
  FileText,
  CheckCircle2,
  PlusCircle,
  MinusCircle,
} from 'lucide-react';

interface TextDiffProps {
  language: Language;
  theme: Theme;
  onCopy: (text: string) => void;
}

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
  lineA?: number;
  lineB?: number;
}

export const TextDiff: React.FC<TextDiffProps> = ({ language, theme, onCopy }) => {
  const isDark = theme === 'dark';
  const isAr = language === 'ar';
  const t = translations[language];

  const sampleA = isAr
    ? `const appName = "HyperTools";\nconst version = "1.0.0";\nconst isOffline = true;\nconsole.log("Welcome to HyperTools");`
    : `const appName = "HyperTools";\nconst version = "1.0.0";\nconst isOffline = true;\nconsole.log("Welcome to HyperTools");`;

  const sampleB = isAr
    ? `const appName = "HyperTools Pro";\nconst version = "1.0.1";\nconst isOffline = true;\nconst supportThemes = true;\nconsole.log("Welcome to HyperTools Pro");`
    : `const appName = "HyperTools Pro";\nconst version = "1.0.1";\nconst isOffline = true;\nconst supportThemes = true;\nconsole.log("Welcome to HyperTools Pro");`;

  const [textA, setTextA] = useState<string>(sampleA);
  const [textB, setTextB] = useState<string>(sampleB);
  const [diffResults, setDiffResults] = useState<DiffLine[] | null>(null);
  const [stats, setStats] = useState<{ added: number; removed: number; unchanged: number } | null>(null);

  // Compute Longest Common Subsequence line diff
  const computeDiff = () => {
    const linesA = textA.split('\n');
    const linesB = textB.split('\n');

    const m = linesA.length;
    const n = linesB.length;

    // dp table
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (linesA[i] === linesB[j]) {
          dp[i + 1][j + 1] = dp[i][j] + 1;
        } else {
          dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
        }
      }
    }

    // Backtrack to find differences
    const result: DiffLine[] = [];
    let i = m;
    let j = n;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
        result.unshift({
          type: 'unchanged',
          text: linesA[i - 1],
          lineA: i,
          lineB: j,
        });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        result.unshift({
          type: 'added',
          text: linesB[j - 1],
          lineB: j,
        });
        j--;
      } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
        result.unshift({
          type: 'removed',
          text: linesA[i - 1],
          lineA: i,
        });
        i--;
      }
    }

    const added = result.filter((r) => r.type === 'added').length;
    const removed = result.filter((r) => r.type === 'removed').length;
    const unchanged = result.filter((r) => r.type === 'unchanged').length;

    setDiffResults(result);
    setStats({ added, removed, unchanged });
  };

  const handleClear = () => {
    setTextA('');
    setTextB('');
    setDiffResults(null);
    setStats(null);
  };

  const handleSwap = () => {
    setTextA(textB);
    setTextB(textA);
    setDiffResults(null);
    setStats(null);
  };

  const handleCopyDiff = () => {
    if (!diffResults) return;
    const textOutput = diffResults
      .map((line) => {
        const prefix = line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  ';
        return `${prefix}${line.text}`;
      })
      .join('\n');
    onCopy(textOutput);
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSwap}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-purple-400" />
            <span>{isAr ? 'تبديل النصوص' : 'Swap Inputs'}</span>
          </button>

          <button
            onClick={handleClear}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-500 hover:text-red-500 hover:bg-slate-50'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.clear}</span>
          </button>
        </div>

        <button
          onClick={computeDiff}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-purple-500/20 active:scale-95 transition-transform"
        >
          <GitCompare className="w-4 h-4" />
          <span>{isAr ? 'مقارنة الاختلافات' : 'Compare Diff'}</span>
        </button>
      </div>

      {/* Two Text Inputs (Responsive Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Text A */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-rose-400" />
              <span>{isAr ? 'النص الأصلي (Text A)' : 'Original (Text A)'}</span>
            </span>
            <span className="font-mono text-[11px] text-slate-500">
              {textA.split('\n').length} {isAr ? 'سطر' : 'lines'}
            </span>
          </div>
          <textarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            placeholder={isAr ? 'أدخل النص الأصلي هنا...' : 'Enter original text or code here...'}
            rows={8}
            className={`w-full p-3.5 rounded-2xl font-mono text-xs outline-none transition-all border resize-y ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-white focus:border-purple-500'
                : 'bg-white border-slate-200 text-slate-900 focus:border-purple-400'
            }`}
          />
        </div>

        {/* Text B */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAr ? 'النص المعدل (Text B)' : 'Modified (Text B)'}</span>
            </span>
            <span className="font-mono text-[11px] text-slate-500">
              {textB.split('\n').length} {isAr ? 'سطر' : 'lines'}
            </span>
          </div>
          <textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            placeholder={isAr ? 'أدخل النص المعدل هنا...' : 'Enter modified text or code here...'}
            rows={8}
            className={`w-full p-3.5 rounded-2xl font-mono text-xs outline-none transition-all border resize-y ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-white focus:border-purple-500'
                : 'bg-white border-slate-200 text-slate-900 focus:border-purple-400'
            }`}
          />
        </div>
      </div>

      {/* Diff Results Output */}
      {diffResults !== null && (
        <div className="space-y-3">
          {/* Stats Bar */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1 text-emerald-400">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+{stats?.added} {isAr ? 'إضافة' : 'added'}</span>
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <MinusCircle className="w-3.5 h-3.5" />
                <span>-{stats?.removed} {isAr ? 'حذف' : 'deleted'}</span>
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{stats?.unchanged} {isAr ? 'بدون تغيير' : 'unchanged'}</span>
              </span>
            </div>

            <button
              onClick={handleCopyDiff}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-purple-300 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-200 text-purple-700 hover:bg-slate-200'
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{isAr ? 'نسخ نتيجة المقارنة' : 'Copy Diff'}</span>
            </button>
          </div>

          {/* Unified Diff Viewer */}
          <div
            className={`rounded-2xl border overflow-x-auto font-mono text-xs ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            {diffResults.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-semibold">
                {isAr ? 'النصوص متطابقة تماماً دون أي اختلاف!' : 'Both texts are completely identical!'}
              </div>
            ) : (
              <div className="divide-y divide-slate-800/20">
                {diffResults.map((line, index) => {
                  let rowBg = '';
                  let prefixSymbol = ' ';
                  let textStyle = '';

                  if (line.type === 'added') {
                    rowBg = isDark ? 'bg-emerald-950/40 text-emerald-300' : 'bg-emerald-50 text-emerald-900';
                    prefixSymbol = '+';
                    textStyle = 'font-semibold';
                  } else if (line.type === 'removed') {
                    rowBg = isDark ? 'bg-rose-950/40 text-rose-300' : 'bg-rose-50 text-rose-900';
                    prefixSymbol = '-';
                    textStyle = 'line-through opacity-80';
                  } else {
                    rowBg = isDark ? 'text-slate-300' : 'text-slate-700';
                  }

                  return (
                    <div
                      key={index}
                      className={`flex items-start px-3 py-1.5 gap-3 transition-colors ${rowBg}`}
                    >
                      <span className="w-6 shrink-0 text-center font-bold text-slate-500 select-none">
                        {prefixSymbol}
                      </span>
                      <span className="w-8 shrink-0 text-right text-[10px] text-slate-500 select-none font-mono">
                        {line.lineA || line.lineB || ''}
                      </span>
                      <pre className={`flex-1 whitespace-pre-wrap break-all ${textStyle}`}>
                        {line.text || ' '}
                      </pre>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

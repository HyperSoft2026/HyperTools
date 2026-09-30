import React, { useState } from 'react';
import { Language, Theme } from '../../types';
import { translations } from '../../data/translations';
import {
  Database,
  Copy,
  RotateCcw,
  Sparkles,
  Minimize2,
  Check,
} from 'lucide-react';

interface SqlFormatterProps {
  language: Language;
  theme: Theme;
  onCopy: (text: string) => void;
}

export const SqlFormatter: React.FC<SqlFormatterProps> = ({ language, theme, onCopy }) => {
  const isDark = theme === 'dark';
  const isAr = language === 'ar';
  const t = translations[language];

  const sampleSql = `SELECT u.id, u.username, u.email, COUNT(o.id) as total_orders, SUM(o.amount) as total_spent FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.is_active = 1 AND u.created_at >= '2026-01-01' GROUP BY u.id, u.username, u.email HAVING COUNT(o.id) > 5 ORDER BY total_spent DESC LIMIT 10;`;

  const [inputSql, setInputSql] = useState<string>(sampleSql);
  const [outputSql, setOutputSql] = useState<string>('');
  const [uppercaseKeywords, setUppercaseKeywords] = useState<boolean>(true);

  // Core SQL keywords for formatting
  const KEYWORDS = [
    'SELECT', 'FROM', 'WHERE', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN',
    'CROSS JOIN', 'JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
    'UNION ALL', 'UNION', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
    'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'AND', 'OR', 'BETWEEN', 'IN', 'IS NULL',
    'IS NOT NULL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'AS', 'DISTINCT', 'ASC', 'DESC'
  ];

  const formatSql = () => {
    if (!inputSql.trim()) {
      setOutputSql('');
      return;
    }

    let sql = inputSql.trim();

    // Standardize whitespace
    sql = sql.replace(/\s+/g, ' ');

    // Major clauses that start a new line with no indent
    const majorClauses = [
      'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'OFFSET',
      'UNION ALL', 'UNION', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM'
    ];

    // Minor clauses that start a new line with indent
    const minorClauses = [
      'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'CROSS JOIN', 'JOIN',
      'ON', 'AND', 'OR'
    ];

    // Process case for keywords if requested
    if (uppercaseKeywords) {
      KEYWORDS.forEach((kw) => {
        const regex = new RegExp(`\\b${kw}\\b`, 'gi');
        sql = sql.replace(regex, kw);
      });
    }

    // Insert formatting newlines
    majorClauses.forEach((clause) => {
      const regex = new RegExp(`\\s*\\b(${clause})\\b\\s*`, 'gi');
      sql = sql.replace(regex, `\n$1 `);
    });

    minorClauses.forEach((clause) => {
      const regex = new RegExp(`\\s*\\b(${clause})\\b\\s*`, 'gi');
      sql = sql.replace(regex, `\n  $1 `);
    });

    // Format commas in SELECT clause
    sql = sql.replace(/,\s*/g, ',\n  ');

    // Clean up multiple newlines
    const formatted = sql
      .split('\n')
      .map((line) => line.trimEnd())
      .filter((line) => line.length > 0)
      .join('\n');

    setOutputSql(formatted);
  };

  const minifySql = () => {
    if (!inputSql.trim()) {
      setOutputSql('');
      return;
    }

    let minified = inputSql
      .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '') // remove comments
      .replace(/\s+/g, ' ')
      .replace(/\s*([,;()=><])\s*/g, '$1')
      .trim();

    setOutputSql(minified);
  };

  const handleClear = () => {
    setInputSql('');
    setOutputSql('');
  };

  const handleCopyOutput = () => {
    if (!outputSql) return;
    onCopy(outputSql);
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUppercaseKeywords(!uppercaseKeywords)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              uppercaseKeywords
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                : isDark
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Check className={`w-3.5 h-3.5 ${uppercaseKeywords ? 'opacity-100' : 'opacity-30'}`} />
            <span>{isAr ? 'أحرف كبيرة للكلمات المفتاحية' : 'UPPERCASE Keywords'}</span>
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

        <div className="flex items-center gap-2">
          <button
            onClick={minifySql}
            className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-sm'
            }`}
          >
            <Minimize2 className="w-4 h-4 text-cyan-400" />
            <span>{isAr ? 'ضغط (Minify)' : 'Minify'}</span>
          </button>

          <button
            onClick={formatSql}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-purple-500/20 active:scale-95 transition-transform"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAr ? 'تنسيق (Format)' : 'Format SQL'}</span>
          </button>
        </div>
      </div>

      {/* SQL Input Textarea */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isAr ? 'استعلام SQL المدخل' : 'Input SQL Query'}</span>
          </span>
          <span className="font-mono text-[11px] text-slate-500">
            {inputSql.length} {isAr ? 'حرف' : 'chars'}
          </span>
        </div>
        <textarea
          value={inputSql}
          onChange={(e) => setInputSql(e.target.value)}
          placeholder={isAr ? 'أدخل استعلام SQL هنا...' : 'Paste your raw SQL query here...'}
          rows={6}
          className={`w-full p-4 rounded-2xl font-mono text-xs outline-none transition-all border resize-y ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-white focus:border-purple-500'
              : 'bg-white border-slate-200 text-slate-900 focus:border-purple-400'
          }`}
        />
      </div>

      {/* SQL Output Box */}
      {outputSql && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>{isAr ? 'النتيجة المنسقة' : 'Formatted SQL Output'}</span>
            <button
              onClick={handleCopyOutput}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-purple-300 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-200 text-purple-700 hover:bg-slate-200'
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{isAr ? 'نسخ الاستعلام' : 'Copy SQL'}</span>
            </button>
          </div>

          <div
            className={`p-4 rounded-2xl border font-mono text-xs overflow-x-auto ${
              isDark ? 'bg-slate-950 border-slate-800 text-emerald-300' : 'bg-slate-50 border-slate-200 text-emerald-800'
            }`}
          >
            <pre className="whitespace-pre-wrap break-all leading-relaxed font-mono">
              {outputSql}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

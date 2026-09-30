import React, { useState } from 'react';
import { Language, Theme } from '../../types';
import { translations } from '../../data/translations';
import {
  Code,
  Copy,
  RotateCcw,
  Sparkles,
  Minimize2,
  Eye,
  FileCode,
} from 'lucide-react';

interface HtmlFormatterProps {
  language: Language;
  theme: Theme;
  onCopy: (text: string) => void;
}

export const HtmlFormatter: React.FC<HtmlFormatterProps> = ({ language, theme, onCopy }) => {
  const isDark = theme === 'dark';
  const isAr = language === 'ar';
  const t = translations[language];

  const sampleHtml = `<div class="container" id="main"><header class="navbar"><h1 class="logo">HyperTools</h1><nav><ul><li><a href="#tools">Tools</a></li><li><a href="#about">About</a></li></ul></nav></header><main><section class="hero"><p>Welcome to our local-first developer suite.</p><button type="button" class="btn btn-primary">Get Started</button></section></main><footer><p>&copy; 2026 HyperSoft</p></footer></div>`;

  const [inputHtml, setInputHtml] = useState<string>(sampleHtml);
  const [outputHtml, setOutputHtml] = useState<string>('');
  const [indentSize, setIndentSize] = useState<number>(2);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Pure client-side HTML beautifier
  const formatHtml = () => {
    if (!inputHtml.trim()) {
      setOutputHtml('');
      return;
    }

    const tab = ' '.repeat(indentSize);
    let result = '';
    let indent = 0;

    // Normalize spacing and tokenize tags
    const clean = inputHtml.replace(/>\s*</g, '><').trim();
    const tokens = clean.split(/(<[^>]+>)/g).filter(Boolean);

    const voidElements = new Set([
      'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
      'link', 'meta', 'param', 'source', 'track', 'wbr', '!doctype'
    ]);

    tokens.forEach((token) => {
      if (token.startsWith('</')) {
        // Closing tag
        indent = Math.max(0, indent - 1);
        result += '\n' + tab.repeat(indent) + token;
      } else if (token.startsWith('<') && !token.startsWith('<!')) {
        // Opening tag or self-closing
        const tagName = token.match(/<([a-zA-Z0-9]+)/)?.[1]?.toLowerCase() || '';
        const isSelfClosing = token.endsWith('/>') || voidElements.has(tagName);

        result += '\n' + tab.repeat(indent) + token;
        if (!isSelfClosing) {
          indent++;
        }
      } else if (token.startsWith('<!')) {
        // Doctype or comment
        result += '\n' + tab.repeat(indent) + token;
      } else {
        // Text content
        const text = token.trim();
        if (text) {
          result += text;
        }
      }
    });

    setOutputHtml(result.trim());
  };

  const minifyHtml = () => {
    if (!inputHtml.trim()) {
      setOutputHtml('');
      return;
    }

    let minified = inputHtml
      .replace(/<!--[\s\S]*?-->/g, '') // strip comments
      .replace(/>\s+</g, '><')          // remove whitespace between tags
      .replace(/\s+/g, ' ')             // collapse multiple whitespaces
      .trim();

    setOutputHtml(minified);
  };

  const handleClear = () => {
    setInputHtml('');
    setOutputHtml('');
  };

  const handleCopyOutput = () => {
    if (!outputHtml) return;
    onCopy(outputHtml);
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {/* Indent selector */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <span>{isAr ? 'المسافة:' : 'Indent:'}</span>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold outline-none ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-white'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
            </select>
          </div>

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
            onClick={minifyHtml}
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
            onClick={formatHtml}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-purple-500/20 active:scale-95 transition-transform"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAr ? 'تنسيق (Format)' : 'Format HTML'}</span>
          </button>
        </div>
      </div>

      {/* Input HTML Textarea */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400">
          <span className="flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'كود HTML الأصلي' : 'Input HTML Markup'}</span>
          </span>
          <span className="font-mono text-[11px] text-slate-500">
            {inputHtml.length} {isAr ? 'حرف' : 'chars'}
          </span>
        </div>
        <textarea
          value={inputHtml}
          onChange={(e) => setInputHtml(e.target.value)}
          placeholder={isAr ? 'أدخل كود HTML هنا...' : 'Paste your raw HTML markup here...'}
          rows={7}
          className={`w-full p-4 rounded-2xl font-mono text-xs outline-none transition-all border resize-y ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-white focus:border-purple-500'
              : 'bg-white border-slate-200 text-slate-900 focus:border-purple-400'
          }`}
        />
      </div>

      {/* Output / Preview Section */}
      {outputHtml && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <div className="flex items-center gap-2">
              <span>{isAr ? 'النتيجة' : 'Output'}</span>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                  showPreview
                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                    : isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-400'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>{showPreview ? (isAr ? 'عرض الكود' : 'Show Code') : (isAr ? 'معاينة النتيجة' : 'Live Preview')}</span>
              </button>
            </div>

            <button
              onClick={handleCopyOutput}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-purple-300 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-200 text-purple-700 hover:bg-slate-200'
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{isAr ? 'نسخ الكود' : 'Copy HTML'}</span>
            </button>
          </div>

          {showPreview ? (
            <div
              className={`p-4 rounded-2xl border min-h-[140px] ${
                isDark ? 'bg-white text-slate-900 border-slate-800' : 'bg-white border-slate-200 text-slate-900'
              }`}
              dangerouslySetInnerHTML={{ __html: outputHtml }}
            />
          ) : (
            <div
              className={`p-4 rounded-2xl border font-mono text-xs overflow-x-auto ${
                isDark ? 'bg-slate-950 border-slate-800 text-amber-300' : 'bg-slate-50 border-slate-200 text-amber-800'
              }`}
            >
              <pre className="whitespace-pre-wrap break-all leading-relaxed font-mono">
                {outputHtml}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

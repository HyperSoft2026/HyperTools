import React, { useState } from 'react';
import { Language, Theme } from '../../types';
import { translations } from '../../data/translations';
import { Copy, ShieldCheck, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

interface JwtDecoderProps {
  language: Language;
  theme: Theme;
  onCopy: (text: string) => void;
}

export const JwtDecoder: React.FC<JwtDecoderProps> = ({ language, theme, onCopy }) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  const defaultJwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikh5cGVyVG9vbHMgVXNlciIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMDQxMjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  const [jwt, setJwt] = useState<string>(defaultJwt);

  let headerObj: any = null;
  let payloadObj: any = null;
  let error = '';

  try {
    const parts = jwt.trim().split('.');
    if (parts.length >= 2) {
      headerObj = JSON.parse(atob(parts[0]));
      payloadObj = JSON.parse(atob(parts[1]));
    } else {
      error = language === 'ar' ? 'رمز JWT غير مكتمل' : 'Incomplete JWT string';
    }
  } catch {
    error = language === 'ar' ? 'فشل فك تشفير JWT' : 'Invalid JWT token format';
  }

  const isExpired = payloadObj?.exp ? Date.now() >= payloadObj.exp * 1000 : false;
  const expDateStr = payloadObj?.exp
    ? new Date(payloadObj.exp * 1000).toLocaleString()
    : null;

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-400">JWT Token Input:</label>
        <textarea
          value={jwt}
          onChange={(e) => setJwt(e.target.value)}
          placeholder="Paste JWT token (e.g. eyJhbGci...)..."
          rows={4}
          className={`w-full p-4 rounded-2xl border text-xs font-mono break-all leading-relaxed outline-none transition-colors ${
            isDark
              ? 'bg-slate-950 border-slate-800 text-purple-300 focus:border-purple-500'
              : 'bg-slate-50 border-slate-200 text-purple-700 focus:border-purple-500'
          }`}
        />
      </div>

      {/* Expiry Badge */}
      {payloadObj && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-bold ${
            isExpired
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {isExpired ? (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            )}
            <span>
              {isExpired ? t.jwtExpired : t.jwtValid}
            </span>
          </div>
          {expDateStr && <span className="font-mono">{expDateStr}</span>}
        </div>
      )}

      {error ? (
        <div className="text-rose-400 font-bold text-xs p-3 bg-rose-950/30 rounded-xl border border-rose-500/30">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Header */}
          <div
            className={`p-4 rounded-2xl border space-y-2 ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex justify-between items-center text-xs font-bold text-rose-400">
              <span>{t.jwtHeader}</span>
              <button
                onClick={() => onCopy(JSON.stringify(headerObj, null, 2))}
                className="hover:text-white"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <pre className="font-mono text-xs text-slate-300 overflow-x-auto p-2 bg-slate-950 rounded-lg">
              {JSON.stringify(headerObj, null, 2)}
            </pre>
          </div>

          {/* Payload */}
          <div
            className={`p-4 rounded-2xl border space-y-2 ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex justify-between items-center text-xs font-bold text-purple-400">
              <span>{t.jwtPayload}</span>
              <button
                onClick={() => onCopy(JSON.stringify(payloadObj, null, 2))}
                className="hover:text-white"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <pre className="font-mono text-xs text-slate-300 overflow-x-auto p-2 bg-slate-950 rounded-lg">
              {JSON.stringify(payloadObj, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

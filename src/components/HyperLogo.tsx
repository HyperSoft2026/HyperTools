import React from 'react';

interface HyperLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  theme?: 'dark' | 'light';
  language?: 'ar' | 'en';
}

export const HyperLogo: React.FC<HyperLogoProps> = ({
  size = 'md',
  showText = true,
  theme = 'dark',
  language = 'ar',
}) => {
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }[size];

  const textSize = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
  }[size];

  const subTextSize = {
    sm: 'text-[9px]',
    md: 'text-xs',
    lg: 'text-sm',
  }[size];

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Icon Badge */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--theme-primary, #9333ea), var(--theme-secondary, #6366f1))',
          boxShadow: 'var(--theme-shadow, 0 8px 20px -4px rgba(147, 51, 234, 0.2))',
        }}
        className={`relative ${iconDimensions} rounded-xl p-0.5 border border-white/20 flex items-center justify-center shrink-0 overflow-hidden group`}
      >
        <div className="absolute inset-0 bg-white/10 opacity-50 group-hover:opacity-100 transition-opacity" />
        
        {/* SVG Emblem representing H with wrench and gear */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-white relative z-10 p-1.5 drop-shadow-md"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Left Vertical Bar of H */}
          <path d="M25 20 V80" stroke="url(#logo-grad-1)" strokeWidth="12" />
          {/* Right Vertical Bar of H */}
          <path d="M75 20 V80" stroke="url(#logo-grad-1)" strokeWidth="12" />
          
          {/* Curved Ribbon Crossbar */}
          <path
            d="M25 50 C40 30, 60 70, 75 50"
            stroke="url(#logo-grad-2)"
            strokeWidth="10"
            fill="none"
          />
          
          {/* Wrench symbol in upper middle */}
          <path
            d="M50 18 L50 34 M45 20 L55 20"
            stroke="#f0abfc"
            strokeWidth="6"
            strokeLinecap="round"
          />
          
          {/* Gear symbol in lower middle */}
          <circle cx="50" cy="70" r="7" stroke="#38bdf8" strokeWidth="5" fill="none" />
          <path d="M50 60 V80 M40 70 H60" stroke="#38bdf8" strokeWidth="4" />

          {/* Gradients */}
          <defs>
            <linearGradient id="logo-grad-1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="var(--theme-primary, #c084fc)" />
            </linearGradient>
            <linearGradient id="logo-grad-2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--theme-primary, #a855f7)" />
              <stop offset="50%" stopColor="var(--theme-accent, #38bdf8)" />
              <stop offset="100%" stopColor="var(--theme-secondary, #818cf8)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className={`font-extrabold tracking-tight ${textSize} flex items-center gap-1`}>
            <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>
              Hyper
            </span>
            <span className="brand-gradient-text font-black">
              Tools
            </span>
          </div>
          <span
            className={`${subTextSize} font-medium tracking-wide ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            } mt-0.5`}
          >
            {language === 'ar' ? 'من شركة HyperSoft' : 'By HyperSoft'}
          </span>
        </div>
      )}
    </div>
  );
};

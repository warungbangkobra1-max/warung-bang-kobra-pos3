import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const BrandLogo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = true 
}) => {
  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-lg'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-black p-2 shadow-lg shadow-red-950/40 border border-red-500/30 ${sizeMap[size]}`}>
        {/* Cobra stylized emblem SVG */}
        <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current filter drop-shadow">
          <path d="M50 8 C30 8 18 22 18 38 C18 52 28 62 38 68 C38 78 32 85 24 90 C45 92 62 82 62 68 C72 62 82 52 82 38 C82 22 70 8 50 8 Z" fill="#DC2626" />
          <path d="M50 16 C38 16 30 26 30 38 C30 48 38 56 46 60 L50 92 L54 60 C62 56 70 48 70 38 C70 26 62 16 50 16 Z" fill="#18181B" />
          <circle cx="42" cy="34" r="3.5" fill="#EF4444" />
          <circle cx="58" cy="34" r="3.5" fill="#EF4444" />
          <circle cx="42" cy="34" r="1.5" fill="#FEF08A" />
          <circle cx="58" cy="34" r="1.5" fill="#FEF08A" />
          <path d="M47 48 L50 56 L53 48 Z" fill="#F8FAFC" />
          <path d="M49 56 L47 62 M51 56 L53 62" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <span className="text-[10px] tracking-wider uppercase font-extrabold text-red-500">
            WARUNG
          </span>
          <span className="font-black tracking-tight text-white text-base md:text-lg">
            BANG KOBRA
          </span>
          <span className="text-[10px] text-zinc-400 font-medium">
            Khas Sambal Kobra & DQM
          </span>
        </div>
      )}
    </div>
  );
};

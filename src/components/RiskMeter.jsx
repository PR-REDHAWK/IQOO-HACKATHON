import React from 'react';

export const RiskMeter = ({ score, size = 'medium' }) => {
  // Determine color matching risk scale
  let strokeColor = '#00F0FF'; // Low risk - Neon Blue
  let riskText = 'LOW RISK';
  let textColorClass = 'text-secondary-container';

  if (score >= 75) {
    strokeColor = '#ffb4ab'; // High risk - Coral Red
    riskText = 'HIGH RISK';
    textColorClass = 'text-error';
  } else if (score >= 40) {
    strokeColor = '#FFD700'; // Medium risk - Gold
    riskText = 'MEDIUM RISK';
    textColorClass = 'text-primary-fixed-dim';
  }

  // Dimension mapping
  const dimensions = {
    small: { circle: 'w-32 h-32', fontScore: 'text-2xl', fontLabel: 'text-[9px]' },
    medium: { circle: 'w-48 h-48', fontScore: 'text-4xl', fontLabel: 'text-[11px]' },
    large: { circle: 'w-64 h-64 md:w-72 md:h-72', fontScore: 'text-6xl font-extrabold', fontLabel: 'text-xs' }
  };

  const dim = dimensions[size] || dimensions.medium;

  // We can render this as a gorgeous SVG circular progress bar
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className={`relative ${dim.circle} flex items-center justify-center`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-full blur-2xl opacity-15 pointer-events-none transition-all duration-1000"
             style={{ backgroundColor: strokeColor }}></div>

        {/* Circular SVG Track */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          {/* Base Track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          {/* Active progress */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Inner Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`${dim.fontLabel} tracking-[0.2em] text-on-surface-variant uppercase font-semibold mb-0.5`}>
            AI THREAT SCORE
          </span>
          <span className={`font-headline-xl font-bold tracking-tight text-white ${dim.fontScore} leading-none my-1`}>
            {score}
          </span>
          <span className={`font-label-sm font-bold tracking-widest ${textColorClass}`}>
            {riskText}
          </span>
        </div>
      </div>
    </div>
  );
};

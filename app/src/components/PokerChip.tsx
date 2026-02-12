import React from 'react';

interface PokerChipProps {
  value: number;
  color?: 'purple' | 'teal' | 'gold' | 'red' | 'green' | 'black';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const chipColors = {
  purple: { main: '#7f56d9', dark: '#6b46c1', light: '#a78bfa' },
  teal: { main: '#14b8a6', dark: '#0d9488', light: '#5eead4' },
  gold: { main: '#f59e0b', dark: '#d97706', light: '#fcd34d' },
  red: { main: '#ef4444', dark: '#dc2626', light: '#fca5a5' },
  green: { main: '#22c55e', dark: '#16a34a', light: '#86efac' },
  black: { main: '#1f2937', dark: '#111827', light: '#4b5563' },
};

const sizeClasses = {
  sm: 'w-10 h-10 text-xs',
  md: 'w-16 h-16 text-sm',
  lg: 'w-24 h-24 text-lg',
};

const borderSizes = {
  sm: 'border-2',
  md: 'border-4',
  lg: 'border-6',
};

export const PokerChip: React.FC<PokerChipProps> = ({
  value,
  color = 'purple',
  size = 'md',
  className = '',
}) => {
  const colors = chipColors[color];

  return (
    <div
      className={`${sizeClasses[size]} rounded-full relative cursor-pointer hover:scale-110 hover:rotate-12 transition-transform ${className}`}
      style={{
        background: `radial-gradient(circle at 30% 30%, ${colors.light}, ${colors.main})`,
        boxShadow: `0 4px 15px ${colors.main}80, inset 0 2px 4px rgba(255,255,255,0.3)`,
      }}
    >
      {/* Outer border pattern */}
      <div 
        className={`absolute inset-0 rounded-full ${borderSizes[size]}`}
        style={{
          border: `dashed ${colors.dark}`,
          borderWidth: size === 'sm' ? '2px' : size === 'md' ? '3px' : '4px',
        }}
      />
      
      {/* Inner circle */}
      <div 
        className="absolute inset-2 rounded-full flex items-center justify-center"
        style={{
          background: `linear-gradient(145deg, ${colors.dark}, ${colors.main})`,
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        <span className="font-bold text-white drop-shadow-lg">
          {value >= 1000 ? `${value / 1000}K` : value}
        </span>
      </div>
      
      {/* Shine effect */}
      <div 
        className="absolute top-2 left-2 w-1/3 h-1/3 rounded-full opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.8), transparent)',
        }}
      />
    </div>
  );
};

export const ChipStack: React.FC<{
  chips: { value: number; color: PokerChipProps['color'] }[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ chips, size = 'md', className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {chips.map((chip, index) => (
        <div
          key={index}
          className="absolute animate-slide-in-bottom"
          style={{
            bottom: index * (size === 'sm' ? 3 : size === 'md' ? 5 : 8),
            zIndex: chips.length - index,
            animationDelay: `${index * 0.1}s`,
          }}
        >
          <PokerChip
            value={chip.value}
            color={chip.color}
            size={size}
          />
        </div>
      ))}
    </div>
  );
};

export const AnimatedChip: React.FC<{
  value: number;
  color?: PokerChipProps['color'];
  onClick?: () => void;
}> = ({ value, color = 'gold', onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer animate-float"
    >
      <PokerChip value={value} color={color} size="lg" />
    </div>
  );
};

export const ChipRain: React.FC<{ count?: number }> = ({ count = 20 }) => {
  const colors: PokerChipProps['color'][] = ['purple', 'teal', 'gold', 'red', 'green'];
  const values = [100, 500, 1000, 5000, 10000];
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-fall"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 3 + 2}s`,
          }}
        >
          <PokerChip
            value={values[Math.floor(Math.random() * values.length)]}
            color={colors[Math.floor(Math.random() * colors.length)]}
            size="sm"
          />
        </div>
      ))}
    </div>
  );
};

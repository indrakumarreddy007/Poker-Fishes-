import React from 'react';

interface PokerCardProps {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: string;
  size?: 'sm' | 'md' | 'lg';
  faceDown?: boolean;
  animated?: boolean;
}

const suitColors = {
  hearts: '#ef4444',
  diamonds: '#ef4444',
  clubs: '#1f2937',
  spades: '#1f2937',
};

const suitSymbols = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

const sizeClasses = {
  sm: 'w-12 h-16 text-sm',
  md: 'w-20 h-28 text-xl',
  lg: 'w-28 h-40 text-3xl',
};

export const PokerCard: React.FC<PokerCardProps> = ({
  suit,
  rank,
  size = 'md',
  faceDown = false,
}) => {
  if (faceDown) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-lg relative cursor-pointer hover:scale-105 transition-transform`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background: 'linear-gradient(145deg, #7f56d9, #6b46c1)',
          }}
        >
          <div className="absolute inset-2 rounded-md border-2 border-white/20 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/30" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} bg-white rounded-lg shadow-xl relative cursor-pointer hover:scale-105 hover:rotate-2 transition-transform`}
    >
      <div
        className="absolute inset-0 bg-white rounded-lg flex flex-col items-center justify-center"
      >
        {/* Top Left */}
        <div
          className="absolute top-1 left-1 font-bold leading-none"
          style={{ color: suitColors[suit] }}
        >
          <div>{rank}</div>
          <div className="text-xs">{suitSymbols[suit]}</div>
        </div>

        {/* Center */}
        <div
          className="text-4xl font-bold"
          style={{ color: suitColors[suit] }}
        >
          {suitSymbols[suit]}
        </div>

        {/* Bottom Right */}
        <div
          className="absolute bottom-1 right-1 font-bold leading-none transform rotate-180"
          style={{ color: suitColors[suit] }}
        >
          <div>{rank}</div>
          <div className="text-xs">{suitSymbols[suit]}</div>
        </div>
      </div>
    </div>
  );
};

export const CardBack: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-12 h-16',
    md: 'w-20 h-28',
    lg: 'w-28 h-40',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-lg ${className} hover:scale-105 transition-transform`}
      style={{
        background: 'linear-gradient(145deg, #7f56d9, #14b8a6)',
      }}
    >
      <div className="w-full h-full rounded-lg border-2 border-white/20 flex items-center justify-center m-0 p-2">
        <div className="w-full h-full rounded border border-white/10 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center">
            <span className="text-white/40 text-2xl">♠</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FloatingCards: React.FC = () => {
  const cards = [
    { suit: 'spades' as const, rank: 'A', x: -100, y: -50 },
    { suit: 'hearts' as const, rank: 'K', x: 100, y: -80 },
    { suit: 'diamonds' as const, rank: 'Q', x: -80, y: 80 },
    { suit: 'clubs' as const, rank: 'J', x: 120, y: 50 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {cards.map((card, index) => (
        <div
          key={index}
          className="absolute top-1/2 left-1/2 animate-float"
          style={{
            transform: `translate(${card.x}px, ${card.y}px)`,
            animationDelay: `${index * 0.5}s`,
          }}
        >
          <PokerCard suit={card.suit} rank={card.rank} size="lg" faceDown />
        </div>
      ))}
    </div>
  );
};

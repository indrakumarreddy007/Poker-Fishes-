import React, { useState } from 'react';

import { CardBack, FloatingCards } from '@/components/PokerCard';
import { PokerChip } from '@/components/PokerChip';
import { Sparkles, TrendingUp, Users, Shield } from 'lucide-react';

export const Login: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  const features = [
    { icon: Users, label: 'Join Sessions', desc: 'Enter session codes to join games' },
    { icon: Shield, label: 'Secure Buy-ins', desc: 'Request and approve buy-ins in INR' },
    { icon: TrendingUp, label: 'Track Stats', desc: 'Weekly, monthly & yearly analytics' },
    { icon: Sparkles, label: 'Role Switching', desc: 'Be both admin and player' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-purple-950/20 to-black">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-600/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Floating Cards */}
      <FloatingCards />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding */}
          <div className="text-center lg:text-left animate-slide-in-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-white/70">Live Poker Ledger</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              <span className="gradient-text">Emergent</span>
              <br />
              <span className="text-white">Poker</span>
            </h1>

            <p className="text-xl text-white/60 mb-8 max-w-md mx-auto lg:mx-0">
              The modern way to manage poker sessions. Create games, track buy-ins, and calculate profits in real-time.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="glass-card p-4 rounded-xl animate-fade-in"
                    style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                  >
                    <Icon className="w-6 h-6 text-purple-400 mb-2" />
                    <p className="font-medium text-sm">{feature.label}</p>
                    <p className="text-xs text-white/50">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side - Login Card */}
          <div className="flex justify-center animate-slide-in-right">
            <div className="relative">
              {/* Decorative Chips */}
              <div className="absolute -top-8 -left-8 animate-float">
                <PokerChip value={5000} color="gold" size="lg" />
              </div>
              <div className="absolute -bottom-8 -right-8 animate-float" style={{ animationDelay: '1s' }}>
                <PokerChip value={1000} color="purple" size="lg" />
              </div>

              {/* Login Card */}
              <div
                className="glass-card p-8 rounded-3xl w-full max-w-md relative overflow-hidden"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {/* Shimmer Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 ${isHovering ? 'translate-x-full' : '-translate-x-full'}`}
                />

                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center">
                      <span className="text-4xl">♠</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
                    <p className="text-white/60">Sign in to continue to your dashboard</p>
                  </div>

                  {/* Google Login Button */}
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full py-4 px-6 rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  </button>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-white/40">
                      By signing in, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </div>
                </div>

                {/* Card Decorations */}
                <div className="absolute -bottom-4 -right-4 opacity-20">
                  <CardBack size="sm" />
                </div>
                <div className="absolute -top-4 -left-4 opacity-20">
                  <CardBack size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 text-center animate-fade-in" style={{ animationDelay: '1s' }}>
        <p className="text-sm text-white/30">
          Made with ♠ for poker enthusiasts
        </p>
      </footer>
    </div>
  );
};

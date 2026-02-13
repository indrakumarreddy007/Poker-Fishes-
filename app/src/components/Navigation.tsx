import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  LogOut,
  LayoutGrid
} from 'lucide-react';

interface NavigationProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navigation: React.FC<NavigationProps> = ({ onNavigate, currentPage }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-4 py-3 animate-slide-in-bottom">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-2xl px-4 py-3 flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => onNavigate('dashboard')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center">
                <span className="text-xl">♠</span>
              </div>
              <span className="font-bold text-lg hidden sm:block">Emergent Poker</span>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2">

              <button
                onClick={() => onNavigate('dashboard')}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${currentPage === 'dashboard'
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">Dashboard</span>
              </button>

              {/* User Avatar */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative hover:scale-105 transition-transform ml-2"
              >
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-10 h-10 rounded-xl border-2 border-white/20"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* User Dropdown / Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed top-20 right-4 z-50 glass-card rounded-xl p-4 min-w-[200px] animate-scale-in">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={user.picture}
              alt={user.name}
              className="w-12 h-12 rounded-xl"
            />
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-white/60">{user.email}</p>
            </div>
          </div>
          <hr className="border-white/10 mb-3" />
          <button
            onClick={logout}
            className="w-full px-4 py-2 rounded-lg flex items-center gap-2 text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </>
  );
};

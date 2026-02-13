import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  LogOut, 
  SwitchCamera, 
  LayoutDashboard, 
  History, 
  PlusCircle, 
  Users,
  Menu,
  X
} from 'lucide-react';

interface NavigationProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navigation: React.FC<NavigationProps> = ({ onNavigate, currentPage }) => {
  const { user, logout, switchRole } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRoleSwitch, setShowRoleSwitch] = useState(false);

  if (!user) return null;

  const isAdmin = user.currentRole === 'admin';
  const canSwitchRole = user.role === 'both';

  const navItems = isAdmin
    ? [
        { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'create-session', label: 'Create Session', icon: PlusCircle },
        { id: 'manage-sessions', label: 'My Sessions', icon: Users },
      ]
    : [
        { id: 'player-dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'join-session', label: 'Join Session', icon: Users },
        { id: 'history', label: 'History', icon: History },
      ];

  const handleRoleSwitch = () => {
    switchRole();
    setShowRoleSwitch(false);
    onNavigate(isAdmin ? 'player-dashboard' : 'admin-dashboard');
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-4 py-3 animate-slide-in-bottom">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-2xl px-4 py-3 flex items-center justify-between">
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => onNavigate(isAdmin ? 'admin-dashboard' : 'player-dashboard')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center">
                <span className="text-xl">♠</span>
              </div>
              <span className="font-bold text-lg hidden sm:block">Emergent Poker</span>
            </div>

            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2">
              {/* Role Badge */}
              <div className="hidden sm:flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isAdmin 
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                    : 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                }`}>
                  {isAdmin ? 'Admin' : 'Player'}
                </span>
              </div>

              {/* Role Switch Button */}
              {canSwitchRole && (
                <button
                  onClick={() => setShowRoleSwitch(!showRoleSwitch)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors relative"
                >
                  <SwitchCamera className="w-5 h-5" />
                </button>
              )}

              {/* User Avatar */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative hover:scale-105 transition-transform"
              >
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-10 h-10 rounded-xl border-2 border-white/20"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Role Switch Dropdown */}
      {showRoleSwitch && canSwitchRole && (
        <div className="fixed top-20 right-4 z-50 glass-card rounded-xl p-4 min-w-[200px] animate-scale-in">
          <p className="text-sm text-white/60 mb-3">Switch Role</p>
          <div className="flex gap-2">
            <button
              onClick={handleRoleSwitch}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                isAdmin
                  ? 'bg-white/5 text-white/60 hover:bg-white/10'
                  : 'bg-purple-500 text-white'
              }`}
            >
              Player
            </button>
            <button
              onClick={handleRoleSwitch}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                isAdmin
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed top-20 left-4 right-4 z-50 glass-card rounded-xl p-4 md:hidden animate-scale-in">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
            <hr className="border-white/10 my-2" />
            <button
              onClick={logout}
              className="px-4 py-3 rounded-xl flex items-center gap-3 text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* User Dropdown */}
      {isMenuOpen && (
        <div className="fixed top-20 right-4 z-50 glass-card rounded-xl p-4 min-w-[200px] hidden md:block animate-scale-in">
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

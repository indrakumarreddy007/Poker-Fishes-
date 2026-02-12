import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSession } from '@/context/SessionContext';
import { 
  Plus, 
  Users, 
  Clock, 
  TrendingUp,
  Wallet,
  Calendar,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { formatINR, formatTime } from '@/data/mockData';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { sessions, createSession } = useSession();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sessionName, setSessionName] = useState('');

  const mySessions = sessions.filter(s => s.adminId === user?.id);
  const activeSessions = mySessions.filter(s => s.status === 'active');
  const endedSessions = mySessions.filter(s => s.status === 'ended');

  const totalStats = {
    sessionsHosted: mySessions.length,
    totalBuyIns: mySessions.reduce((sum, s) => sum + s.totalBuyIn, 0),
    activePlayers: activeSessions.reduce((sum, s) => sum + s.players.length, 0),
    pendingRequests: activeSessions.reduce((sum, s) => sum + s.buyInRequests.length, 0),
  };

  const handleCreateSession = () => {
    if (!sessionName.trim() || !user) return;
    
    createSession(sessionName, user.id, user.name);
    setShowCreateModal(false);
    setSessionName('');
  };

  return (
    <div className="p-4 pt-24 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-slide-in-bottom">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-white/60">Manage your poker sessions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          <Plus className="w-5 h-5" />
          <span>Create Session</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-6 rounded-2xl animate-slide-in-bottom" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-purple-500/20">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-2xl font-bold">{totalStats.sessionsHosted}</span>
          </div>
          <p className="text-white/60 text-sm">Sessions Hosted</p>
        </div>

        <div className="glass-card p-6 rounded-2xl animate-slide-in-bottom" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-green-500/20">
              <Wallet className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-2xl font-bold">{formatINR(totalStats.totalBuyIns)}</span>
          </div>
          <p className="text-white/60 text-sm">Total Buy-ins</p>
        </div>

        <div className="glass-card p-6 rounded-2xl animate-slide-in-bottom" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-teal-500/20">
              <Users className="w-6 h-6 text-teal-400" />
            </div>
            <span className="text-2xl font-bold">{totalStats.activePlayers}</span>
          </div>
          <p className="text-white/60 text-sm">Active Players</p>
        </div>

        <div className="glass-card p-6 rounded-2xl animate-slide-in-bottom" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-yellow-500/20">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-2xl font-bold">{totalStats.pendingRequests}</span>
          </div>
          <p className="text-white/60 text-sm">Pending Requests</p>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="mb-8 animate-slide-in-bottom" style={{ animationDelay: '0.5s' }}>
        <h2 className="text-xl font-semibold mb-4">Active Sessions</h2>
        {activeSessions.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-white/30" />
            </div>
            <p className="text-white/60">No active sessions</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 text-purple-400 hover:text-purple-300 font-medium"
            >
              Create your first session
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {activeSessions.map((session, index) => (
              <div
                key={session.id}
                className="glass-card p-6 rounded-2xl animate-slide-in-bottom"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center">
                      <span className="text-2xl">♠</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{session.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-white/50">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {session.players.length} players
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTime(session.createdAt)}
                        </span>
                        {session.buyInRequests.length > 0 && (
                          <span className="flex items-center gap-1 text-yellow-400">
                            <TrendingUp className="w-4 h-4" />
                            {session.buyInRequests.length} pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-white/50">Session Code</p>
                      <p className="text-2xl font-bold tracking-wider">{session.code}</p>
                    </div>
                    <button
                      onClick={() => onNavigate(`session-${session.id}`)}
                      className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors hover:scale-105 active:scale-95"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Session Stats */}
                <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-white/50">Total Buy-ins</p>
                    <p className="text-lg font-semibold">{formatINR(session.totalBuyIn)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Players</p>
                    <p className="text-lg font-semibold">{session.players.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/50">Pending Requests</p>
                    <p className="text-lg font-semibold text-yellow-400">
                      {session.buyInRequests.length}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Sessions */}
      {endedSessions.length > 0 && (
        <div className="animate-slide-in-bottom" style={{ animationDelay: '0.8s' }}>
          <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>
          <div className="grid gap-3">
            {endedSessions.slice(0, 3).map((session, index) => (
              <div
                key={session.id}
                className="glass-card p-4 rounded-xl flex items-center justify-between opacity-60 animate-slide-in-bottom"
                style={{ animationDelay: `${0.9 + index * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">{session.name}</p>
                    <p className="text-sm text-white/50">
                      {session.endedAt?.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatINR(session.totalBuyIn)}</p>
                  <p className="text-sm text-white/50">{session.players.length} players</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card p-8 rounded-3xl max-w-md w-full animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center">
                <Plus className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-1">Create New Session</h3>
              <p className="text-white/60">Start a new poker game</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-white/60 mb-2">Session Name</label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="e.g., Friday Night Poker"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSession}
                disabled={!sessionName.trim()}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                Create Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSession } from '@/context/SessionContext';
import { CardBack } from '@/components/PokerCard';
import { PokerChip } from '@/components/PokerChip';
import {
  Search,
  Users,
  Clock,
  X,
  Plus,
  Minus,
  ArrowRight,
  Timer,
  Trash2,
  XCircle
} from 'lucide-react';
import { formatINR, formatTime } from '@/data/mockData';

export const JoinSession: React.FC = () => {
  const { user } = useAuth();
  const { joinSession, requestBuyIn, getUserSessions, dismissBuyInRequest } = useSession();
  const [sessionCode, setSessionCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinedSession, setJoinedSession] = useState<any>(null);
  const [buyInAmount, setBuyInAmount] = useState(1000);
  const [showBuyInModal, setShowBuyInModal] = useState(false);

  const userSessions = user ? getUserSessions(user.id) : [];
  const activeSessions = userSessions.filter(s => s.status === 'active');

  const handleJoin = async () => {
    if (!sessionCode.trim() || !user) return;

    setIsJoining(true);
    const success = await joinSession(sessionCode, user.id, user.name, user.email, user.picture);

    if (success) {
      setJoinedSession(getUserSessions(user.id).find(s => s.code.toUpperCase() === sessionCode.toUpperCase()));
      setShowBuyInModal(true);
    }
    setIsJoining(false);
  };

  const handleBuyInRequest = () => {
    if (joinedSession && user) {
      requestBuyIn(
        joinedSession.id,
        user.id,
        user.name,
        user.picture,
        buyInAmount
      );
      setShowBuyInModal(false);
      setSessionCode('');
      setJoinedSession(null);
    }
  };

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  return (
    <div className="p-4 pt-24 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          <span className="gradient-text">Join a Session</span>
        </h1>
        <p className="text-white/60">Enter the session code to join a poker game</p>
      </div>

      {/* Session Code Input */}
      <div className="glass-card p-8 rounded-3xl mb-8 relative overflow-hidden animate-slide-in-bottom">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 opacity-10">
          <CardBack size="lg" />
        </div>
        <div className="absolute bottom-0 left-0 opacity-10">
          <CardBack size="lg" />
        </div>

        <div className="relative z-10">
          <label className="block text-sm font-medium text-white/60 mb-3">
            Session Code
          </label>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-digit code (e.g., POKER88)"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 transition-all text-lg tracking-wider uppercase"
                maxLength={6}
              />
            </div>
            <button
              onClick={handleJoin}
              disabled={!sessionCode.trim() || isJoining}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              {isJoining ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Join</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      {activeSessions.length > 0 && (
        <div className="animate-slide-in-bottom" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-semibold mb-4">Your Active Sessions</h2>
          <div className="grid gap-4">
            {activeSessions.map((session, index) => (
              <div
                key={session.id}
                className="glass-card p-6 rounded-2xl animate-slide-in-bottom"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
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
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/50">Session Code</p>
                    <p className="text-2xl font-bold tracking-wider">{session.code}</p>
                  </div>
                </div>

                {/* Player Stats in Session */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/50">Your Buy-ins</p>
                        <p className="text-lg font-semibold">
                          {formatINR(session.players.find(p => p.userId === user?.id)?.totalBuyIn || 0)}
                        </p>
                      </div>

                      {/* Check for pending requests */}
                      {(() => {
                        const myPendingRequest = session.buyInRequests.find(r => r.userId === user?.id && r.status === 'pending');

                        if (myPendingRequest) {
                          return (
                            <div className="px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex items-center gap-2">
                              <Timer className="w-4 h-4 animate-pulse" />
                              <span className="text-sm font-medium">Request Pending: {formatINR(myPendingRequest.amount)}</span>
                            </div>
                          );
                        }

                        return (
                          <button
                            onClick={() => {
                              setJoinedSession(session);
                              setShowBuyInModal(true);
                            }}
                            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Request Buy-in</span>
                          </button>
                        );
                      })()}
                    </div>

                    {/* Rejected Requests List */}
                    {session.buyInRequests.filter(r => r.userId === user?.id && r.status === 'rejected').map(req => (
                      <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20 animate-fade-in">
                        <div className="flex items-center gap-2 text-red-400">
                          <XCircle className="w-4 h-4" />
                          <span className="text-sm">Buy-in Rejected: {formatINR(req.amount)}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissBuyInRequest(session.id, req.id);
                          }}
                          className="p-1.5 rounded-md hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Dismiss"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buy-in Modal */}
      {showBuyInModal && joinedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card p-8 rounded-3xl max-w-md w-full relative animate-scale-in">
            <button
              onClick={() => setShowBuyInModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center">
                <PokerChip value={buyInAmount} color="gold" size="sm" />
              </div>
              <h3 className="text-xl font-bold mb-1">Request Buy-in</h3>
              <p className="text-white/60">{joinedSession.name}</p>
            </div>

            {/* Amount Selector */}
            <div className="mb-6">
              <label className="block text-sm text-white/60 mb-3">Select Amount (INR)</label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBuyInAmount(amount)}
                    className={`py-3 rounded-xl font-medium transition-all ${buyInAmount === amount
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                  >
                    {formatINR(amount)}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setBuyInAmount(Math.max(500, buyInAmount - 500))}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <input
                  type="number"
                  value={buyInAmount}
                  onChange={(e) => setBuyInAmount(Number(e.target.value))}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-center text-lg font-semibold"
                  min={500}
                  step={500}
                />
                <button
                  onClick={() => setBuyInAmount(buyInAmount + 500)}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <button
              onClick={handleBuyInRequest}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              Request {formatINR(buyInAmount)} Buy-in
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

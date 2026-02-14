import React, { useState } from 'react';
import { useSession } from '@/context/SessionContext';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lock,
  Save
} from 'lucide-react';
import { formatINR } from '@/data/mockData';

interface SessionManageProps {
  sessionId: string;
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export const SessionManage: React.FC<SessionManageProps> = ({ sessionId, onBack, onNavigate }) => {
  const {
    getSessionById,
    approveBuyIn,
    rejectBuyIn,
    endSession,
    updatePlayerStack,
    validateSession
  } = useSession();

  const session = getSessionById(sessionId);
  const [showEndModal, setShowEndModal] = useState(false);
  const [playerStacks, setPlayerStacks] = useState<Record<string, number>>({});
  const [validationResult, setValidationResult] = useState<any>(null);

  if (!session) {
    return (
      <div className="p-4 pt-24 text-center">
        <p className="text-white/60">Session not found</p>
        <button onClick={onBack} className="mt-4 text-purple-400">Go Back</button>
      </div>
    );
  }

  const handleStackChange = (playerId: string, value: string) => {
    setPlayerStacks(prev => ({
      ...prev,
      [playerId]: Number(value) || 0
    }));
  };

  const handleSaveStacks = () => {
    Object.entries(playerStacks).forEach(([playerId, stack]) => {
      updatePlayerStack(sessionId, playerId, stack);
    });
    const validation = validateSession(sessionId);
    setValidationResult(validation);
  };

  const handleEndSession = async () => {
    await endSession(sessionId);
    setShowEndModal(false);
    onNavigate(`session-settlement-${sessionId}`);
  };

  return (
    <div className="p-4 pt-24 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-slide-in-bottom">
        <div>
          <button
            onClick={onBack}
            className="text-white/60 hover:text-white mb-2 flex items-center gap-1"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold">{session.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
              Active
            </span>
            <span className="text-white/60">Code: <span className="font-bold text-white">{session.code}</span></span>
          </div>
        </div>
        <div className="flex gap-3">
          {session.status === 'ended' ? (
            <button
              onClick={() => onNavigate(`session-settlement-${sessionId}`)}
              className="px-6 py-3 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>View Settlement</span>
            </button>
          ) : (
            <button
              onClick={() => setShowEndModal(true)}
              className="px-6 py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Lock className="w-5 h-5" />
              <span>End Session</span>
            </button>
          )}
        </div>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-slide-in-bottom" style={{ animationDelay: '0.1s' }}>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-white/60 text-sm mb-1">Total Buy-ins</p>
          <p className="text-3xl font-bold">{formatINR(session.totalBuyIn)}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-white/60 text-sm mb-1">Players</p>
          <p className="text-3xl font-bold">{session.players.length}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-white/60 text-sm mb-1">Pending Requests</p>
          <p className="text-3xl font-bold text-yellow-400">{session.buyInRequests.length}</p>
        </div>
      </div>

      {/* Buy-in Requests */}
      {session.buyInRequests.length > 0 && (
        <div className="mb-8 animate-slide-in-bottom" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-semibold mb-4">Pending Buy-in Requests</h2>
          <div className="grid gap-3">
            {session.buyInRequests.map((request) => (
              <div
                key={request.id}
                className="glass-card p-4 rounded-xl flex items-center justify-between animate-slide-in-bottom"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={request.userPicture}
                    alt={request.userName}
                    className="w-12 h-12 rounded-xl"
                  />
                  <div>
                    <p className="font-medium">{request.userName}</p>
                    <p className="text-sm text-white/50">
                      Requested {formatINR(request.amount)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => rejectBuyIn(sessionId, request.id)}
                    className="p-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors hover:scale-105 active:scale-95"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => approveBuyIn(sessionId, request.id, session.adminId)}
                    className="p-3 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors hover:scale-105 active:scale-95"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Players List */}
      <div className="mb-8 animate-slide-in-bottom" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-xl font-semibold mb-4">Players</h2>
        <div className="grid gap-3">
          {session.players.map((player, index) => (
            <div
              key={player.userId}
              className="glass-card p-4 rounded-xl animate-slide-in-bottom"
              style={{ animationDelay: `${0.4 + index * 0.05}s` }}
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={player.picture}
                    alt={player.name}
                    className="w-12 h-12 rounded-xl"
                  />
                  <div>
                    <p className="font-medium">{player.name}</p>
                    <p className="text-sm text-white/50">
                      Total Buy-in: {formatINR(player.totalBuyIn)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-white/50">Current Stack</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">₹</span>
                      <input
                        type="number"
                        value={playerStacks[player.userId] || player.currentStack}
                        onChange={(e) => handleStackChange(player.userId, e.target.value)}
                        className="w-32 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-right"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  {player.profitLoss !== 0 && (
                    <div className={`text-right ${player.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <p className="text-sm">P/L</p>
                      <p className="font-bold">
                        {player.profitLoss >= 0 ? '+' : ''}{formatINR(player.profitLoss)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Buy-in History */}
              {player.buyIns.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs text-white/40 mb-2">Buy-in History</p>
                  <div className="flex gap-2 flex-wrap">
                    {player.buyIns.map((buyIn) => (
                      <span
                        key={buyIn.id}
                        className="px-2 py-1 rounded-lg bg-white/5 text-xs"
                      >
                        {formatINR(buyIn.amount)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Save Stacks Button */}
      <div className="flex justify-end mb-8 animate-slide-in-bottom" style={{ animationDelay: '0.5s' }}>
        <button
          onClick={handleSaveStacks}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          <Save className="w-5 h-5" />
          <span>Save Stacks & Validate</span>
        </button>
      </div>

      {/* Validation Result */}
      {validationResult && (
        <div
          className={`glass-card p-6 rounded-2xl mb-8 animate-slide-in-bottom ${validationResult.isValid ? 'border-green-500/30' : 'border-red-500/30'
            }`}
          style={{ animationDelay: '0.6s' }}
        >
          <div className="flex items-center gap-3 mb-4">
            {validationResult.isValid ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-red-400" />
            )}
            <h3 className="text-lg font-semibold">
              {validationResult.isValid ? 'Session Balanced' : 'Validation Warning'}
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-white/50">Total Buy-ins</p>
              <p className="text-lg font-semibold">{formatINR(validationResult.totalBuyIns)}</p>
            </div>
            <div>
              <p className="text-sm text-white/50">Total Stacks</p>
              <p className="text-lg font-semibold">{formatINR(validationResult.totalStacks)}</p>
            </div>
            <div>
              <p className="text-sm text-white/50">Difference</p>
              <p className={`text-lg font-semibold ${validationResult.difference === 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatINR(Math.abs(validationResult.difference))}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/60">{validationResult.message}</p>
        </div>
      )}

      {/* End Session Modal */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card p-8 rounded-3xl max-w-md w-full animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/20 flex items-center justify-center">
                <Lock className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-1">End Session?</h3>
              <p className="text-white/60">
                This will close the session and calculate final profits/losses.
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-white/60">Total Buy-ins</span>
                <span className="font-semibold">{formatINR(session.totalBuyIn)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Players</span>
                <span className="font-semibold">{session.players.length}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEndModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEndSession}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

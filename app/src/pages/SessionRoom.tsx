import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSession } from '@/context/SessionContext';
import { SettlementModal } from '@/components/SettlementModal';
import {
    CheckCircle,
    XCircle,
    Crown,
    Lock,
    Plus,
    ArrowLeft,
    DollarSign
} from 'lucide-react';
import { formatINR } from '@/data/mockData';
import { PokerCard } from '@/components/PokerCard';

interface SessionRoomProps {
    sessionId: string;
    onBack: () => void;
}

export const SessionRoom: React.FC<SessionRoomProps> = ({ sessionId, onBack }) => {
    const { user } = useAuth();
    const {
        getSessionById,
        approveBuyIn,
        rejectBuyIn,
        requestBuyIn,
        updatePlayerStack,
        validateSession,
        endSession
    } = useSession();

    const session = getSessionById(sessionId);
    const [showSettlementModal, setShowSettlementModal] = useState(false);

    // Local state for Buy-in Modal
    const [showBuyInModal, setShowBuyInModal] = useState(false);
    const [buyInAmount, setBuyInAmount] = useState(1000);

    // Local state for Admin "Cashout" (Update Stack)
    const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
    const [editStackValue, setEditStackValue] = useState('');

    if (!session || !user) {
        return (
            <div className="p-4 pt-24 text-center">
                <p className="text-white/60">Session not found</p>
                <button onClick={onBack} className="mt-4 text-purple-400">Go Back</button>
            </div>
        );
    }

    const isAdmin = session.adminId === user.id;
    const currentPlayer = session.players.find(p => p.userId === user.id);

    const handleRequestBuyIn = () => {
        requestBuyIn(sessionId, user.id, user.name, user.picture, buyInAmount);
        setShowBuyInModal(false);
    };

    const handleSettleSession = async (playerStacks: { userId: string; currentStack: number }[]) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/sessions/${sessionId}/settle`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerStacks })
            });

            if (response.ok) {
                // Refresh logic or redirect
                setShowSettlementModal(false);
                onBack(); // Go back to dashboard on end
            } else {
                console.error("Failed to settle");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const savePlayerStack = (playerId: string) => {
        updatePlayerStack(sessionId, playerId, Number(editStackValue));
        setEditingPlayerId(null);
    };

    return (
        <div className="p-4 pt-24 max-w-7xl mx-auto animate-fade-in pb-20">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            {session.name}
                            {isAdmin && <Crown className="w-5 h-5 text-yellow-500" />}
                        </h1>
                        <p className="text-white/50 text-sm">Code: <span className="text-white font-mono">{session.code}</span></p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {!isAdmin && currentPlayer && (
                        <button
                            onClick={() => setShowBuyInModal(true)}
                            className="px-4 py-2 rounded-xl bg-green-600/20 text-green-400 hover:bg-green-600/30 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Buy-in
                        </button>
                    )}
                    {isAdmin && (
                        <button
                            onClick={() => setShowSettlementModal(true)}
                            className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20 flex items-center gap-2"
                        >
                            <Lock className="w-4 h-4" /> End Session
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="glass-card p-4 rounded-xl">
                    <p className="text-white/50 text-xs text-center">Total Buy-in</p>
                    <p className="text-xl font-bold text-center text-green-400">{formatINR(session.totalBuyIn)}</p>
                </div>
                <div className="glass-card p-4 rounded-xl">
                    <p className="text-white/50 text-xs text-center">Players</p>
                    <p className="text-xl font-bold text-center">{session.players.length}</p>
                </div>
                {isAdmin && (
                    <div className="glass-card p-4 rounded-xl relative overflow-hidden">
                        {session.buyInRequests.length > 0 && <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />}
                        <p className="text-white/50 text-xs text-center">Requests</p>
                        <p className="text-xl font-bold text-center text-yellow-400">{session.buyInRequests.length}</p>
                    </div>
                )}
                {currentPlayer && (
                    <div className="glass-card p-4 rounded-xl border border-purple-500/30">
                        <p className="text-purple-300 text-xs text-center">My Stack</p>
                        <p className="text-xl font-bold text-center">{formatINR(currentPlayer.currentStack)}</p>
                    </div>
                )}
            </div>

            {/* Admin: Buy-in Requests */}
            {isAdmin && session.buyInRequests.length > 0 && (
                <div className="mb-8 animate-slide-in-bottom">
                    <h2 className="text-lg font-semibold mb-4 px-2">Pending Requests</h2>
                    <div className="grid gap-3 md:grid-cols-2">
                        {session.buyInRequests.map(req => (
                            <div key={req.id} className="glass-card p-4 rounded-xl flex items-center justify-between border-l-4 border-yellow-500">
                                <div className="flex items-center gap-3">
                                    <img src={req.userPicture} alt={req.userName} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-bold">{req.userName}</p>
                                        <p className="text-green-400 font-mono">{formatINR(req.amount)}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => rejectBuyIn(sessionId, req.id)}
                                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors"
                                    >
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() => approveBuyIn(sessionId, req.id, user.id)}
                                        className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/40 transition-colors"
                                    >
                                        <CheckCircle className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Players Grid */}
            <h2 className="text-lg font-semibold mb-4 px-2">Players At Table</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {session.players.map(player => (
                    <div key={player.userId} className="glass-card p-5 rounded-2xl relative group">
                        {player.userId === session.adminId && (
                            <div className="absolute top-3 right-3 text-yellow-500 opacity-50"><Crown className="w-4 h-4" /></div>
                        )}

                        <div className="flex items-center gap-4 mb-4">
                            <img src={player.picture} alt={player.name} className="w-12 h-12 rounded-xl border border-white/10" />
                            <div>
                                <p className="font-bold text-lg">{player.name}</p>
                                <p className="text-white/40 text-xs">Buy-in: {formatINR(player.totalBuyIn)}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl mb-3">
                            <span className="text-white/60 text-sm">Stack</span>
                            {editingPlayerId === player.userId ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        autoFocus
                                        type="number"
                                        value={editStackValue}
                                        onChange={(e) => setEditStackValue(e.target.value)}
                                        className="w-20 bg-white/10 rounded px-2 py-1 text-right text-sm"
                                    />
                                    <button onClick={() => savePlayerStack(player.userId)} className="text-green-400"><CheckCircle className="w-4 h-4" /></button>
                                </div>
                            ) : (
                                <span className="font-mono font-bold text-lg">{formatINR(player.currentStack)}</span>
                            )}
                        </div>

                        {/* Admin Actions for Player */}
                        {isAdmin && (
                            <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => {
                                        setEditingPlayerId(player.userId);
                                        setEditStackValue(player.currentStack.toString());
                                    }}
                                    className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium"
                                >
                                    Update Stack
                                </button>
                            </div>
                        )}

                        {/* Player Self-Actions (If user is this player and NOT admin - admin has controls above) */}
                        {user.id === player.userId && (
                            <button
                                onClick={() => setShowBuyInModal(true)}
                                className="w-full mt-2 py-2 rounded-lg border border-green-500/30 text-green-400 text-xs hover:bg-green-500/10"
                            >
                                + Add Chips
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Buy-in Modal */}
            {showBuyInModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="glass-card p-6 rounded-2xl w-full max-w-sm">
                        <h3 className="text-xl font-bold mb-4 text-center">Request Chips</h3>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {[500, 1000, 2000, 5000].map(amt => (
                                <button
                                    key={amt}
                                    onClick={() => setBuyInAmount(amt)}
                                    className={`py-2 rounded-lg text-sm ${buyInAmount === amt ? 'bg-purple-500' : 'bg-white/10'}`}
                                >
                                    {formatINR(amt)}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-white/60">₹</span>
                            <input
                                type="number"
                                value={buyInAmount}
                                onChange={(e) => setBuyInAmount(Number(e.target.value))}
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 px-3"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => setShowBuyInModal(false)} className="flex-1 py-3 rounded-xl bg-white/5">Cancel</button>
                            <button onClick={handleRequestBuyIn} className="flex-1 py-3 rounded-xl bg-green-500 font-bold">Request</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Settlement Modal */}
            <SettlementModal
                isOpen={showSettlementModal}
                onClose={() => setShowSettlementModal(false)}
                onConfirm={handleSettleSession}
                players={session.players}
                totalBuyIn={session.totalBuyIn}
                sessionName={session.name}
            />

        </div>
    );
};

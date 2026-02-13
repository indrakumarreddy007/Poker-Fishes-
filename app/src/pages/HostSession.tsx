import React, { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSession } from '@/context/SessionContext';
import {
    Plus,
    ArrowRight,
    TrendingUp,
    TrendingDown,
    ChevronRight,
    Calendar
} from 'lucide-react';
import { PokerChip } from '@/components/PokerChip';
import { formatINR, formatDate } from '@/data/mockData';

interface HostSessionProps {
    onNavigate: (page: string) => void;
}

export const HostSession: React.FC<HostSessionProps> = ({ onNavigate }) => {
    const { user } = useAuth();
    const { createSession, getUserSessions } = useSession();
    const [sessionName, setSessionName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const mySessions = useMemo(() => {
        if (!user) return [];
        return getUserSessions(user.id).sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [user, getUserSessions]);

    const handleCreateSession = async () => {
        if (!sessionName.trim() || !user) return;

        setIsCreating(true);
        try {
            const newSession = await createSession(sessionName, user.id, user.name);
            setSessionName('');
            onNavigate(`session-${newSession.id}`);
        } catch (error) {
            console.error('Failed to create session');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="p-4 pt-24 max-w-4xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">
                    <span className="gradient-text">Host a Session</span>
                </h1>
                <p className="text-white/60">Create a new poker table for your friends</p>
            </div>

            {/* Main Card */}
            <div className="glass-card p-8 rounded-3xl max-w-2xl mx-auto relative overflow-hidden animate-slide-in-bottom">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <PokerChip value={1000} color="purple" size="lg" />
                </div>
                <div className="absolute bottom-0 left-0 opacity-10 transform -translate-x-1/4 translate-y-1/4">
                    <PokerChip value={500} color="teal" size="lg" />
                </div>

                <div className="relative z-10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Plus className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">New Session Details</h2>
                        <p className="text-white/50">Enter a name to identify your game</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">
                                Session Name
                            </label>
                            <input
                                type="text"
                                value={sessionName}
                                onChange={(e) => setSessionName(e.target.value)}
                                placeholder="e.g., Friday Night Poker"
                                className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 transition-all text-lg"
                                autoFocus
                            />
                        </div>

                        <button
                            onClick={handleCreateSession}
                            disabled={!sessionName.trim() || isCreating}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold text-lg shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            {isCreating ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Create Session</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 mb-12 max-w-4xl mx-auto">
                <div className="glass-card p-6 rounded-2xl text-center animate-slide-in-bottom" style={{ animationDelay: '0.1s' }}>
                    <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="text-xl">👑</span>
                    </div>
                    <h3 className="font-semibold mb-1">You are Admin</h3>
                    <p className="text-sm text-white/50">Full control over buy-ins and cashouts</p>
                </div>

                <div className="glass-card p-6 rounded-2xl text-center animate-slide-in-bottom" style={{ animationDelay: '0.2s' }}>
                    <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center">
                        <span className="text-xl">💰</span>
                    </div>
                    <h3 className="font-semibold mb-1">Track Stacks</h3>
                    <p className="text-sm text-white/50">Real-time chip counting for everyone</p>
                </div>

                <div className="glass-card p-6 rounded-2xl text-center animate-slide-in-bottom" style={{ animationDelay: '0.3s' }}>
                    <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <span className="text-xl">🔒</span>
                    </div>
                    <h3 className="font-semibold mb-1">Secure</h3>
                    <p className="text-sm text-white/50">Unique 6-digit code for your lobby</p>
                </div>
            </div>

            {/* Recent Sessions */}
            {mySessions.length > 0 && (
                <div className="max-w-2xl mx-auto animate-slide-in-bottom" style={{ animationDelay: '0.4s' }}>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-400" />
                        Recent Sessions
                    </h3>
                    <div className="space-y-3">
                        {mySessions.slice(0, 5).map((session) => {
                            const player = session.players.find(p => p.userId === user?.id);
                            const profitLoss = player ? (player.currentStack - player.totalBuyIn) : 0;
                            const isWin = profitLoss >= 0;

                            return (
                                <div
                                    key={session.id}
                                    onClick={() => onNavigate(`session-${session.id}`)}
                                    className="glass-card p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isWin ? 'bg-green-500/20 group-hover:bg-green-500/30' : 'bg-red-500/20 group-hover:bg-red-500/30'
                                            }`}>
                                            {isWin ? (
                                                <TrendingUp className="w-6 h-6 text-green-400" />
                                            ) : (
                                                <TrendingDown className="w-6 h-6 text-red-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">{session.name}</p>
                                            <p className="text-sm text-white/50 flex items-center gap-2">
                                                <span>{formatDate(session.createdAt)}</span>
                                                <span>•</span>
                                                <span className="text-white/70">Code: <span className="font-mono">{session.code}</span></span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className={`font-bold text-lg ${isWin ? 'text-green-400' : 'text-red-400'}`}>
                                                {isWin ? '+' : ''}{formatINR(profitLoss)}
                                            </p>
                                            <p className="text-xs text-white/50">
                                                Buy-in: {formatINR(player?.totalBuyIn || 0)}
                                            </p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSession } from '@/context/SessionContext';
import {
    Plus,
    Users,
    Clock,
    ArrowRight,
    Search,
    LayoutGrid,
    History as HistoryIcon
} from 'lucide-react';
import { formatINR, formatTime } from '@/data/mockData';
import { CardBack } from '@/components/PokerCard';

interface DashboardProps {
    onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const { user } = useAuth();
    const { createSession, joinSession, getUserSessions } = useSession();
    const [activeTab, setActiveTab] = useState<'overview' | 'create' | 'join'>('overview');

    // Create Session State
    const [newSessionName, setNewSessionName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    // Join Session State
    const [joinCode, setJoinCode] = useState('');
    const [isJoining, setIsJoining] = useState(false);

    // Data
    const mySessions = user ? getUserSessions(user.id) : [];
    const activeSessions = mySessions.filter(s => s.status === 'active');
    const recentSessions = mySessions.filter(s => s.status === 'ended').slice(0, 5);

    const handleCreate = async () => {
        if (!newSessionName.trim() || !user) return;
        setIsCreating(true);
        const session = await createSession(newSessionName, user.id, user.name);
        setIsCreating(false);
        if (session) {
            onNavigate(`session-${session.id}`);
        }
    };

    const handleJoin = async () => {
        if (!joinCode.trim() || !user) return;
        setIsJoining(true);
        const success = await joinSession(joinCode, user.id, user.name, user.email, user.picture);
        setIsJoining(false);
        if (success) {
            // Find the session we just joined
            // In a real app joinSession might return the session ID. 
            // For now, let's assume successful join means we can find it in the refreshed list or duplicate check.
            // The simplest interaction is to switch to overview or show success.
            setActiveTab('overview');
        }
    };

    return (
        <div className="p-4 pt-24 max-w-7xl mx-auto animate-fade-in pb-20">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        Warning <span className="gradient-text">Poker</span>
                    </h1>
                    <p className="text-white/60">Welcome back, {user?.name}</p>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-white/5 rounded-xl">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-purple-500 text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'create' ? 'bg-purple-500 text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
                    >
                        Create
                    </button>
                    <button
                        onClick={() => setActiveTab('join')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'join' ? 'bg-purple-500 text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
                    >
                        Join
                    </button>
                </div>
            </div>

            {/* VIEW: OVERVIEW */}
            {activeTab === 'overview' && (
                <div className="animate-slide-in-bottom">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <LayoutGrid className="w-5 h-5 text-purple-400" />
                        Active Sessions
                    </h2>

                    {activeSessions.length === 0 ? (
                        <div className="glass-card p-12 rounded-3xl text-center border-dashed border-2 border-white/10 mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                                <Users className="w-8 h-8 text-white/20" />
                            </div>
                            <p className="text-white/40 font-medium text-lg">No active sessions</p>
                            <div className="flex items-center justify-center gap-4 mt-6">
                                <button onClick={() => setActiveTab('create')} className="text-purple-400 hover:text-purple-300 font-medium">Create New</button>
                                <span className="text-white/20">or</span>
                                <button onClick={() => setActiveTab('join')} className="text-teal-400 hover:text-teal-300 font-medium">Join Existing</button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-10">
                            {activeSessions.map(session => (
                                <div
                                    key={session.id}
                                    onClick={() => onNavigate(`session-${session.id}`)}
                                    className="glass-card p-6 rounded-2xl cursor-pointer hover:scale-[1.02] transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-50">
                                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/20">Active</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">{session.name}</h3>
                                    <p className="text-white/50 text-sm mb-4">Code: <span className="text-white font-mono tracking-wider">{session.code}</span></p>

                                    <div className="flex items-center gap-4 text-sm text-white/60">
                                        <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {session.players.length}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {formatTime(session.createdAt)}</span>
                                    </div>

                                    {session.adminId === user?.id && (
                                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-purple-400 text-sm font-medium">
                                            <span>You are Admin</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {recentSessions.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <HistoryIcon className="w-5 h-5 text-teal-400" />
                                Recent History
                            </h2>
                            <div className="space-y-3">
                                {recentSessions.map(session => (
                                    <div key={session.id} className="glass-card p-4 rounded-xl flex items-center justify-between opacity-70 hover:opacity-100 transition-opacity">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${session.totalStack >= session.totalBuyIn ? 'bg-green-500/10' : 'bg-red-500/10'
                                                }`}>
                                                <span className="text-lg">♠</span>
                                            </div>
                                            <div>
                                                <p className="font-medium">{session.name}</p>
                                                <p className="text-xs text-white/50">{new Date(session.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">{formatINR(session.totalBuyIn)}</p>
                                            <p className="text-xs text-white/50">Total Pool</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* VIEW: CREATE */}
            {activeTab === 'create' && (
                <div className="max-w-md mx-auto animate-scale-in">
                    <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 opacity-10"><CardBack size="lg" /></div>

                        <h2 className="text-2xl font-bold mb-6 text-center">Create Session</h2>

                        <div className="mb-6">
                            <label className="block text-sm text-white/60 mb-2">Session Name</label>
                            <input
                                type="text"
                                value={newSessionName}
                                onChange={(e) => setNewSessionName(e.target.value)}
                                placeholder="e.g. Friday Night Poker"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none transition-all"
                            />
                        </div>

                        <button
                            onClick={handleCreate}
                            disabled={!newSessionName.trim() || isCreating}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isCreating ? <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : <Plus className="w-5 h-5" />}
                            Create & Join
                        </button>

                        <p className="mt-6 text-center text-sm text-white/40">
                            You will be the Admin and also a Player in this session.
                        </p>
                    </div>
                </div>
            )}

            {/* VIEW: JOIN */}
            {activeTab === 'join' && (
                <div className="max-w-md mx-auto animate-scale-in">
                    <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 opacity-10"><CardBack size="lg" /></div>

                        <h2 className="text-2xl font-bold mb-6 text-center">Join Session</h2>

                        <div className="mb-6">
                            <label className="block text-sm text-white/60 mb-2">Session Code</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input
                                    type="text"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                    placeholder="ENTER CODE"
                                    maxLength={6}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-teal-500 focus:outline-none transition-all font-mono tracking-widest uppercase"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleJoin}
                            disabled={joinCode.length < 3 || isJoining}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold hover:shadow-lg hover:shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isJoining ? <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                            Join Session
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

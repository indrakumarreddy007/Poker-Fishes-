import React, { useEffect, useState } from 'react';
import { useSession } from '@/context/SessionContext';
import {
    ArrowRight,
    CheckCircle,
    AlertTriangle,
    Home
} from 'lucide-react';
import { formatINR } from '@/data/mockData';
import api from '@/lib/api';

interface Transaction {
    from: string;
    fromId: string;
    to: string;
    toId: string;
    amount: number;
}

interface SettlementData {
    sessionId: string;
    transactions: Transaction[];
    unsettledWinners: any[];
    unsettledLosers: any[];
}

interface SessionSettlementProps {
    sessionId: string;
    onNavigate: (page: string) => void;
}

export const SessionSettlement: React.FC<SessionSettlementProps> = ({ sessionId, onNavigate }) => {
    const { getSessionById } = useSession();
    const session = getSessionById(sessionId);
    const [settlement, setSettlement] = useState<SettlementData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettlement = async () => {
            try {
                const res = await api.get(`/sessions/${sessionId}/settlement`);
                setSettlement(res.data);
            } catch (error) {
                console.error('Failed to fetch settlement', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettlement();
    }, [sessionId]);

    if (loading) {
        return <div className="p-8 text-center text-white/60">Calculating settlement...</div>;
    }

    if (!session || !settlement) {
        return <div className="p-8 text-center text-red-400">Failed to load settlement data.</div>;
    }

    return (
        <div className="p-4 pt-24 max-w-4xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">
                    <span className="gradient-text">Session Settlement</span>
                </h1>
                <p className="text-white/60">Final results for {session.name}</p>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Session Closed</span>
                </div>
            </div>

            {/* Transactions Card */}
            <div className="glass-card p-8 rounded-3xl mb-8 animate-slide-in-bottom">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <span>💸</span>
                    <span>Settlements (Who Pays Whom)</span>
                </h2>

                {settlement.transactions.length === 0 ? (
                    <div className="text-center py-8 text-white/50">
                        No payments needed. Everyone is square!
                    </div>
                ) : (
                    <div className="space-y-4">
                        {settlement.transactions.map((tx, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="font-bold text-red-400">{tx.from}</p>
                                        <p className="text-xs text-white/40">Pays</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-white/20" />
                                    <div>
                                        <p className="font-bold text-green-400">{tx.to}</p>
                                        <p className="text-xs text-white/40">Receives</p>
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-white">
                                    {formatINR(tx.amount)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Unsettled Warning */}
                {(settlement.unsettledWinners.length > 0 || settlement.unsettledLosers.length > 0) && (
                    <div className="mt-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-yellow-400 text-sm">Unbalanced Session</h4>
                            <p className="text-xs text-white/60 mt-1">
                                Total buy-ins did not match total stack count. Some amounts could not be settled perfectly.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Detailed Standings */}
            <div className="glass-card p-8 rounded-3xl mb-8 animate-slide-in-bottom" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-xl font-bold mb-6">Final Standings</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-white/40 text-sm border-b border-white/10">
                                <th className="pb-3 pl-4">Player</th>
                                <th className="pb-3 text-right">Buy-in</th>
                                <th className="pb-3 text-right">Final Stack</th>
                                <th className="pb-3 text-right pr-4">Net Result</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {session.players.map((p) => (
                                <tr key={p.userId} className="border-b border-white/5">
                                    <td className="py-4 pl-4 font-medium">{p.name}</td>
                                    <td className="py-4 text-right text-white/60">{formatINR(p.totalBuyIn)}</td>
                                    <td className="py-4 text-right text-white/60">{formatINR(p.currentStack)}</td>
                                    <td className={`py-4 text-right font-bold pr-4 ${p.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                        {p.profitLoss >= 0 ? '+' : ''}{formatINR(p.profitLoss)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4 animate-slide-in-bottom" style={{ animationDelay: '0.3s' }}>
                <button
                    onClick={() => onNavigate('player-dashboard')}
                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                    <Home className="w-5 h-5" />
                    <span>Dashboard</span>
                </button>
            </div>
        </div>
    );
};

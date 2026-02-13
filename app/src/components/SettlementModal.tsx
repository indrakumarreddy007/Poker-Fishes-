import React, { useState, useEffect } from 'react';
import { Lock, AlertTriangle, CheckCircle, Calculator } from 'lucide-react';
import { formatINR } from '@/data/mockData';

interface Player {
    userId: string;
    name: string;
    picture: string;
    totalBuyIn: number;
}

interface SettlementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (playerStacks: { userId: string; currentStack: number }[]) => void;
    players: Player[];
    totalBuyIn: number;
    sessionName: string;
}

export const SettlementModal: React.FC<SettlementModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    players,
    totalBuyIn,
    sessionName
}) => {
    const [stacks, setStacks] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);

    // Initialize stacks with 0 or previous values if we had them
    useEffect(() => {
        if (isOpen) {
            const initialStacks: Record<string, string> = {};
            players.forEach(p => {
                initialStacks[p.userId] = '';
            });
            setStacks(initialStacks);
            setError(null);
        }
    }, [isOpen, players]);

    if (!isOpen) return null;

    const currentTotalStack = Object.values(stacks).reduce((sum, val) => sum + (Number(val) || 0), 0);
    const difference = totalBuyIn - currentTotalStack;
    const isValid = difference === 0;

    const handleStackChange = (userId: string, value: string) => {
        setStacks(prev => ({
            ...prev,
            [userId]: value
        }));
    };

    const handleSubmit = () => {
        if (!isValid) {
            setError(`Total stacks must equal total buy-ins. Difference: ${formatINR(Math.abs(difference))}`);
            return;
        }

        const payload = players.map(p => ({
            userId: p.userId,
            currentStack: Number(stacks[p.userId]) || 0
        }));

        onConfirm(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="glass-card w-full max-w-2xl rounded-3xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/20">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Lock className="w-6 h-6 text-red-400" />
                            End Session & Settle
                        </h2>
                        <p className="text-white/60 text-sm mt-1">{sessionName}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-white/50">Total Buy-ins</p>
                        <p className="text-xl font-bold text-yellow-400">{formatINR(totalBuyIn)}</p>
                    </div>
                </div>

                {/* content */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    <p className="text-white/60 mb-6 bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 text-sm">
                        <span className="font-bold text-blue-300">Instructions:</span> Please enter the final stack (chips count) for each player.
                        The total amount must match the Total Buy-in of <b>{formatINR(totalBuyIn)}</b>.
                    </p>

                    <div className="space-y-3">
                        {players.map(player => (
                            <div key={player.userId} className="glass-card p-4 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src={player.picture} alt={player.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-medium">{player.name}</p>
                                        <p className="text-xs text-white/50">Buy-in: {formatINR(player.totalBuyIn)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`text-right text-sm mr-2 ${(Number(stacks[player.userId]) || 0) - player.totalBuyIn >= 0 ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                        {(Number(stacks[player.userId]) || 0) > 0 && (
                                            <>
                                                {((Number(stacks[player.userId]) || 0) - player.totalBuyIn) >= 0 ? '+' : ''}
                                                {formatINR((Number(stacks[player.userId]) || 0) - player.totalBuyIn)}
                                            </>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">₹</span>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={stacks[player.userId]}
                                            onChange={(e) => handleStackChange(player.userId, e.target.value)}
                                            className="w-32 bg-white/5 border border-white/10 rounded-lg py-2 pl-7 pr-3 text-right focus:outline-none focus:border-purple-500 transition-all font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer / Validation */}
                <div className="p-6 border-t border-white/10 bg-black/20">
                    <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-white/5">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isValid ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {isValid ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="text-sm text-white/60">Current Total</p>
                                <p className={`font-bold ${isValid ? 'text-green-400' : 'text-white'}`}>
                                    {formatINR(currentTotalStack)}
                                </p>
                            </div>
                        </div>

                        {!isValid && (
                            <div className="text-right">
                                <p className="text-sm text-red-300">Remaining</p>
                                <p className="font-bold text-red-400">{formatINR(difference)}</p>
                            </div>
                        )}
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm text-center mb-4">{error}</p>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!isValid}
                            className="flex-1 py-3 rounded-xl bg-green-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                        >
                            <Calculator className="w-4 h-4" />
                            Settle & End Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

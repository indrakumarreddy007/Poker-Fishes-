import React, { useState } from 'react';
import { useSession } from '@/context/SessionContext';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Search,
} from 'lucide-react';
import { formatINR, formatDate } from '@/data/mockData';

interface HistoryProps {
  onNavigate?: (page: string) => void;
}

export const History: React.FC<HistoryProps> = ({ onNavigate }) => {
  const { sessionHistory } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'win' | 'loss'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'profit'>('date');

  const filteredHistory = sessionHistory
    .filter(session => {
      const matchesSearch = session.sessionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' ||
        (filterStatus === 'win' && session.profitLoss >= 0) ||
        (filterStatus === 'loss' && session.profitLoss < 0);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.profitLoss - a.profitLoss;
    });

  const totalProfit = filteredHistory.reduce((sum, s) => sum + s.profitLoss, 0);
  const totalBuyIn = filteredHistory.reduce((sum, s) => sum + s.totalBuyIn, 0);
  const winCount = filteredHistory.filter(s => s.profitLoss >= 0).length;

  return (
    <div className="p-4 pt-24 max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8 animate-slide-in-bottom">
        <h1 className="text-3xl font-bold mb-2">
          Session <span className="gradient-text">History</span>
        </h1>
        <p className="text-white/60">View all your past poker sessions</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-in-bottom" style={{ animationDelay: '0.1s' }}>
        <div className="glass-card p-4 rounded-xl">
          <p className="text-white/50 text-sm">Total Sessions</p>
          <p className="text-2xl font-bold">{filteredHistory.length}</p>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <p className="text-white/50 text-sm">Total P/L</p>
          <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalProfit >= 0 ? '+' : ''}{formatINR(totalProfit)}
          </p>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <p className="text-white/50 text-sm">Win Rate</p>
          <p className="text-2xl font-bold">
            {filteredHistory.length > 0 ? Math.round((winCount / filteredHistory.length) * 100) : 0}%
          </p>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <p className="text-white/50 text-sm">Total Buy-in</p>
          <p className="text-2xl font-bold">{formatINR(totalBuyIn)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 animate-slide-in-bottom" style={{ animationDelay: '0.2s' }}>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sessions..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 transition-all"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
        >
          <option value="all">All Results</option>
          <option value="win">Wins Only</option>
          <option value="loss">Losses Only</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500"
        >
          <option value="date">Sort by Date</option>
          <option value="profit">Sort by Profit</option>
        </select>
      </div>

      {/* Session List */}
      <div className="space-y-3 animate-slide-in-bottom" style={{ animationDelay: '0.3s' }}>
        {filteredHistory.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-white/30" />
            </div>
            <p className="text-white/60">No sessions found</p>
          </div>
        ) : (
          filteredHistory.map((session) => (
            <div
              key={session.sessionId}
              onClick={() => onNavigate && onNavigate(`session-settlement-${session.sessionId}`)}
              className="glass-card p-5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${session.profitLoss >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                    {session.profitLoss >= 0 ? (
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-red-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{session.sessionName}</h3>
                    <div className="flex items-center gap-3 text-sm text-white/50">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(session.date)}
                      </span>
                      <span>•</span>
                      <span>Code: {session.code}</span>
                      <span>•</span>
                      <span>Host: {session.adminName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-white/50">Buy-in</p>
                    <p className="font-medium">{formatINR(session.totalBuyIn)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/50">Cash Out</p>
                    <p className="font-medium">{formatINR(session.currentStack)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/50">P/L</p>
                    <p className={`font-bold text-lg ${session.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {session.profitLoss >= 0 ? '+' : ''}{formatINR(session.profitLoss)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredHistory.length > 0 && filteredHistory.length < sessionHistory.length && (
        <div className="text-center mt-6 animate-slide-in-bottom" style={{ animationDelay: '0.4s' }}>
          <button className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/60">
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

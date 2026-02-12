import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSession } from '@/context/SessionContext';
import { mockPlayerStats, formatINR, formatDate } from '@/data/mockData';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Wallet,
  ChevronRight,
  Trophy,
  AlertTriangle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

type TimeRange = 'weekly' | 'monthly' | 'yearly' | 'allTime';

export const PlayerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { sessionHistory } = useSession();
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');

  const stats = mockPlayerStats[timeRange];

  const profitData = [
    { name: 'Mon', profit: 1200 },
    { name: 'Tue', profit: -800 },
    { name: 'Wed', profit: 2500 },
    { name: 'Thu', profit: -1500 },
    { name: 'Fri', profit: 3000 },
    { name: 'Sat', profit: 1800 },
    { name: 'Sun', profit: -500 },
  ];

  const winLossData = [
    { name: 'Wins', value: stats.winRate, color: '#22c55e' },
    { name: 'Losses', value: 100 - stats.winRate, color: '#ef4444' },
  ];

  const timeRangeLabels = {
    weekly: 'This Week',
    monthly: 'This Month',
    yearly: 'This Year',
    allTime: 'All Time',
  };

  return (
    <div className="p-4 pt-24 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8 animate-slide-in-bottom">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, <span className="gradient-text">{user?.name.split(' ')[0]}</span>
        </h1>
        <p className="text-white/60">Here's your poker performance overview</p>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2 mb-6 flex-wrap animate-slide-in-bottom" style={{ animationDelay: '0.1s' }}>
        {(Object.keys(timeRangeLabels) as TimeRange[]).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              timeRange === range
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {timeRangeLabels[range]}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Profit/Loss */}
        <div className="glass-card p-6 rounded-2xl animate-slide-in-bottom" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${stats.totalProfitLoss >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              {stats.totalProfitLoss >= 0 ? (
                <TrendingUp className="w-6 h-6 text-green-400" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-400" />
              )}
            </div>
            <span className={`text-2xl font-bold ${stats.totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.totalProfitLoss >= 0 ? '+' : ''}{formatINR(stats.totalProfitLoss)}
            </span>
          </div>
          <p className="text-white/60 text-sm">Total Profit/Loss</p>
        </div>

        {/* Sessions Played */}
        <div className="glass-card p-6 rounded-2xl animate-slide-in-bottom" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-purple-500/20">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-2xl font-bold">{stats.totalSessions}</span>
          </div>
          <p className="text-white/60 text-sm">Sessions Played</p>
        </div>

        {/* Win Rate */}
        <div className="glass-card p-6 rounded-2xl animate-slide-in-bottom" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-teal-500/20">
              <Trophy className="w-6 h-6 text-teal-400" />
            </div>
            <span className="text-2xl font-bold">{stats.winRate}%</span>
          </div>
          <p className="text-white/60 text-sm">Win Rate</p>
        </div>

        {/* Avg Profit/Session */}
        <div className="glass-card p-6 rounded-2xl animate-slide-in-bottom" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-yellow-500/20">
              <Wallet className="w-6 h-6 text-yellow-400" />
            </div>
            <span className={`text-2xl font-bold ${stats.avgProfitPerSession >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatINR(stats.avgProfitPerSession)}
            </span>
          </div>
          <p className="text-white/60 text-sm">Avg per Session</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Profit Chart */}
        <div className="glass-card p-6 rounded-2xl animate-slide-in-bottom" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-lg font-semibold mb-4">Profit Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#7f56d9" 
                  strokeWidth={2}
                  dot={{ fill: '#7f56d9' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Win/Loss Distribution */}
        <div className="glass-card p-6 rounded-2xl animate-slide-in-bottom" style={{ animationDelay: '0.7s' }}>
          <h3 className="text-lg font-semibold mb-4">Win/Loss Distribution</h3>
          <div className="h-64 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={winLossData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {winLossData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <p className="text-3xl font-bold">{stats.winRate}%</p>
              <p className="text-sm text-white/60">Win Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Best/Worst Sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {stats.bestSession && (
          <div className="glass-card p-6 rounded-2xl border-l-4 border-green-500 animate-slide-in-bottom" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-green-400" />
              <span className="text-sm text-white/60">Best Session</span>
            </div>
            <p className="text-lg font-semibold">{stats.bestSession.sessionName}</p>
            <p className="text-green-400 font-bold">+{formatINR(stats.bestSession.profit)}</p>
            <p className="text-sm text-white/40">{formatDate(stats.bestSession.date)}</p>
          </div>
        )}

        {stats.worstSession && (
          <div className="glass-card p-6 rounded-2xl border-l-4 border-red-500 animate-slide-in-bottom" style={{ animationDelay: '0.9s' }}>
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-sm text-white/60">Worst Session</span>
            </div>
            <p className="text-lg font-semibold">{stats.worstSession.sessionName}</p>
            <p className="text-red-400 font-bold">{formatINR(stats.worstSession.loss)}</p>
            <p className="text-sm text-white/40">{formatDate(stats.worstSession.date)}</p>
          </div>
        )}
      </div>

      {/* Session History */}
      <div className="animate-slide-in-bottom" style={{ animationDelay: '1s' }}>
        <h3 className="text-xl font-semibold mb-4">Recent Sessions</h3>
        <div className="space-y-3">
          {sessionHistory.slice(0, 5).map((session) => (
            <div
              key={session.sessionId}
              className="glass-card p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  session.profitLoss >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {session.profitLoss >= 0 ? (
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-red-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{session.sessionName}</p>
                  <p className="text-sm text-white/50">
                    {formatDate(session.date)} • Code: {session.code}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`font-bold ${session.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {session.profitLoss >= 0 ? '+' : ''}{formatINR(session.profitLoss)}
                  </p>
                  <p className="text-xs text-white/50">
                    Buy-in: {formatINR(session.totalBuyIn)}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/30" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

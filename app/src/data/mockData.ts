import type { User, Session, SessionHistory, TimeRangeStats } from '@/types';

// Mock Current User
export const mockCurrentUser: User = {
  id: 'user_1',
  email: 'player@example.com',
  name: 'Alex Poker',
  picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  role: 'both',
  currentRole: 'player',
  createdAt: new Date('2024-01-15'),
};

// Mock Sessions
export const mockSessions: Session[] = [
  {
    id: 'session_1',
    code: 'POKER88',
    name: 'Friday Night Poker',
    adminId: 'admin_1',
    adminName: 'Mike Host',
    status: 'active',
    createdAt: new Date('2025-02-10T18:00:00'),
    players: [
      {
        userId: 'user_1',
        name: 'Alex Poker',
        email: 'player@example.com',
        picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        buyIns: [
          { id: 'buyin_1', amount: 5000, status: 'approved', requestedAt: new Date('2025-02-10T18:05:00'), approvedAt: new Date('2025-02-10T18:06:00') },
          { id: 'buyin_2', amount: 3000, status: 'approved', requestedAt: new Date('2025-02-10T20:00:00'), approvedAt: new Date('2025-02-10T20:02:00') },
        ],
        currentStack: 0,
        totalBuyIn: 8000,
        profitLoss: 0,
        status: 'active',
        joinedAt: new Date('2025-02-10T18:05:00'),
      },
      {
        userId: 'user_2',
        name: 'Sarah Bluffs',
        email: 'sarah@example.com',
        picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        buyIns: [
          { id: 'buyin_3', amount: 5000, status: 'approved', requestedAt: new Date('2025-02-10T18:10:00'), approvedAt: new Date('2025-02-10T18:12:00') },
        ],
        currentStack: 0,
        totalBuyIn: 5000,
        profitLoss: 0,
        status: 'active',
        joinedAt: new Date('2025-02-10T18:10:00'),
      },
    ],
    buyInRequests: [
      { id: 'req_1', userId: 'user_3', userName: 'Tom AllIn', userPicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom', amount: 10000, status: 'pending', requestedAt: new Date('2025-02-10T21:00:00') },
    ],
    totalBuyIn: 13000,
    totalStack: 0,
    isValid: false,
  },
  {
    id: 'session_2',
    code: 'HIGH55',
    name: 'High Stakes Sunday',
    adminId: 'user_1',
    adminName: 'Alex Poker',
    status: 'ended',
    createdAt: new Date('2025-02-02T14:00:00'),
    endedAt: new Date('2025-02-02T22:00:00'),
    players: [
      {
        userId: 'user_1',
        name: 'Alex Poker',
        email: 'player@example.com',
        picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        buyIns: [
          { id: 'buyin_4', amount: 10000, status: 'approved', requestedAt: new Date('2025-02-02T14:05:00'), approvedAt: new Date('2025-02-02T14:06:00') },
        ],
        currentStack: 15000,
        totalBuyIn: 10000,
        profitLoss: 5000,
        status: 'active',
        joinedAt: new Date('2025-02-02T14:05:00'),
      },
      {
        userId: 'user_4',
        name: 'John River',
        email: 'john@example.com',
        picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        buyIns: [
          { id: 'buyin_5', amount: 10000, status: 'approved', requestedAt: new Date('2025-02-02T14:10:00'), approvedAt: new Date('2025-02-02T14:12:00') },
        ],
        currentStack: 5000,
        totalBuyIn: 10000,
        profitLoss: -5000,
        status: 'active',
        joinedAt: new Date('2025-02-02T14:10:00'),
      },
    ],
    buyInRequests: [],
    totalBuyIn: 20000,
    totalStack: 20000,
    isValid: true,
  },
];

// Mock Player Stats
export const mockPlayerStats: TimeRangeStats = {
  weekly: {
    totalSessions: 2,
    totalBuyIn: 18000,
    totalCashOut: 15000,
    totalProfitLoss: -3000,
    winRate: 0,
    avgProfitPerSession: -1500,
    bestSession: null,
    worstSession: {
      sessionName: 'Friday Night Poker',
      loss: 3000,
      date: new Date('2025-02-10'),
    },
  },
  monthly: {
    totalSessions: 5,
    totalBuyIn: 45000,
    totalCashOut: 52000,
    totalProfitLoss: 7000,
    winRate: 60,
    avgProfitPerSession: 1400,
    bestSession: {
      sessionName: 'High Stakes Sunday',
      profit: 5000,
      date: new Date('2025-02-02'),
    },
    worstSession: {
      sessionName: 'Monday Grind',
      loss: 2000,
      date: new Date('2025-02-03'),
    },
  },
  yearly: {
    totalSessions: 25,
    totalBuyIn: 180000,
    totalCashOut: 195000,
    totalProfitLoss: 15000,
    winRate: 52,
    avgProfitPerSession: 600,
    bestSession: {
      sessionName: 'New Year Special',
      profit: 12000,
      date: new Date('2025-01-01'),
    },
    worstSession: {
      sessionName: 'Bad Beat Tuesday',
      loss: 8000,
      date: new Date('2025-01-15'),
    },
  },
  allTime: {
    totalSessions: 42,
    totalBuyIn: 280000,
    totalCashOut: 310000,
    totalProfitLoss: 30000,
    winRate: 55,
    avgProfitPerSession: 714,
    bestSession: {
      sessionName: 'Championship Final',
      profit: 25000,
      date: new Date('2024-12-20'),
    },
    worstSession: {
      sessionName: 'Tilt Session',
      loss: 15000,
      date: new Date('2024-11-10'),
    },
  },
};

// Mock Session History
export const mockSessionHistory: SessionHistory[] = [
  {
    sessionId: 'session_2',
    sessionName: 'High Stakes Sunday',
    code: 'HIGH55',
    adminName: 'Alex Poker',
    date: new Date('2025-02-02'),
    totalBuyIn: 10000,
    currentStack: 15000,
    profitLoss: 5000,
    status: 'ended',
  },
  {
    sessionId: 'session_3',
    sessionName: 'Monday Grind',
    code: 'GRIND99',
    adminName: 'Mike Host',
    date: new Date('2025-02-03'),
    totalBuyIn: 5000,
    currentStack: 3000,
    profitLoss: -2000,
    status: 'ended',
  },
  {
    sessionId: 'session_4',
    sessionName: 'Wednesday Warmup',
    code: 'WARM22',
    adminName: 'Sarah Bluffs',
    date: new Date('2025-02-05'),
    totalBuyIn: 3000,
    currentStack: 4500,
    profitLoss: 1500,
    status: 'ended',
  },
  {
    sessionId: 'session_5',
    sessionName: 'Weekend Warriors',
    code: 'WEEK77',
    adminName: 'John River',
    date: new Date('2025-02-08'),
    totalBuyIn: 8000,
    currentStack: 6000,
    profitLoss: -2000,
    status: 'ended',
  },
];

// Generate unique session code
export const generateSessionCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Format currency in INR
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
};

// Format time
export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

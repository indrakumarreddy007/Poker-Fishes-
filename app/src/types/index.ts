// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  role: 'admin' | 'player' | 'both';
  currentRole: 'admin' | 'player';
  createdAt: Date;
}

// Session Types
export interface Session {
  id: string;
  code: string;
  name: string;
  adminId: string;
  adminName: string;
  status: 'active' | 'ended';
  createdAt: Date;
  endedAt?: Date;
  players: SessionPlayer[];
  buyInRequests: BuyInRequest[];
  totalBuyIn: number;
  totalStack: number;
  isValid: boolean;
}

export interface SessionPlayer {
  userId: string;
  name: string;
  email: string;
  picture: string;
  buyIns: BuyIn[];
  currentStack: number;
  totalBuyIn: number;
  profitLoss: number;
  status: 'active' | 'left';
  joinedAt: Date;
}

// Buy-in Types
export interface BuyIn {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
}

export interface BuyInRequest {
  id: string;
  userId: string;
  userName: string;
  userPicture: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
}

// Stats Types
export interface PlayerStats {
  totalSessions: number;
  totalBuyIn: number;
  totalCashOut: number;
  totalProfitLoss: number;
  winRate: number;
  avgProfitPerSession: number;
  bestSession: {
    sessionName: string;
    profit: number;
    date: Date;
  } | null;
  worstSession: {
    sessionName: string;
    loss: number;
    date: Date;
  } | null;
}

export interface TimeRangeStats {
  weekly: PlayerStats;
  monthly: PlayerStats;
  yearly: PlayerStats;
  allTime: PlayerStats;
}

// Session History
export interface SessionHistory {
  sessionId: string;
  sessionName: string;
  code: string;
  adminName: string;
  date: Date;
  totalBuyIn: number;
  currentStack: number;
  profitLoss: number;
  status: 'active' | 'ended';
}

// Validation Result
export interface ValidationResult {
  isValid: boolean;
  totalBuyIns: number;
  totalStacks: number;
  difference: number;
  message: string;
}

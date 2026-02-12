import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Session, BuyInRequest, ValidationResult, SessionHistory } from '@/types';
import { mockSessions, mockSessionHistory, generateSessionCode, formatINR } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

interface SessionContextType {
  sessions: Session[];
  sessionHistory: SessionHistory[];
  currentSession: Session | null;
  createSession: (name: string, adminId: string, adminName: string) => Session;
  joinSession: (code: string, userId: string, userName: string, userEmail: string, userPicture: string) => boolean;
  requestBuyIn: (sessionId: string, userId: string, userName: string, userPicture: string, amount: number) => void;
  approveBuyIn: (sessionId: string, requestId: string, approvedBy: string) => void;
  rejectBuyIn: (sessionId: string, requestId: string) => void;
  endSession: (sessionId: string) => void;
  updatePlayerStack: (sessionId: string, userId: string, stack: number) => void;
  validateSession: (sessionId: string) => ValidationResult;
  getSessionByCode: (code: string) => Session | undefined;
  getSessionById: (id: string) => Session | undefined;
  getUserSessions: (userId: string) => Session[];
  refreshSessions: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [sessionHistory, setSessionHistory] = useState<SessionHistory[]>(mockSessionHistory);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const { toast } = useToast();

  const createSession = useCallback((name: string, adminId: string, adminName: string): Session => {
    const newSession: Session = {
      id: `session_${Date.now()}`,
      code: generateSessionCode(),
      name,
      adminId,
      adminName,
      status: 'active',
      createdAt: new Date(),
      players: [],
      buyInRequests: [],
      totalBuyIn: 0,
      totalStack: 0,
      isValid: false,
    };
    
    setSessions(prev => [newSession, ...prev]);
    toast({
      title: 'Session Created!',
      description: `Session code: ${newSession.code}`,
    });
    return newSession;
  }, [toast]);

  const joinSession = useCallback((code: string, userId: string, userName: string, userEmail: string, userPicture: string): boolean => {
    const session = sessions.find(s => s.code.toUpperCase() === code.toUpperCase() && s.status === 'active');
    
    if (!session) {
      toast({
        title: 'Invalid Session Code',
        description: 'Please check the code and try again.',
        variant: 'destructive',
      });
      return false;
    }

    if (session.players.find(p => p.userId === userId)) {
      toast({
        title: 'Already Joined',
        description: 'You are already in this session.',
      });
      setCurrentSession(session);
      return true;
    }

    const updatedSession: Session = {
      ...session,
      players: [
        ...session.players,
        {
          userId,
          name: userName,
          email: userEmail,
          picture: userPicture,
          buyIns: [],
          currentStack: 0,
          totalBuyIn: 0,
          profitLoss: 0,
          status: 'active',
          joinedAt: new Date(),
        },
      ],
    };

    setSessions(prev => prev.map(s => s.id === session.id ? updatedSession : s));
    setCurrentSession(updatedSession);
    
    toast({
      title: 'Joined Session!',
      description: `Welcome to ${session.name}`,
    });
    return true;
  }, [sessions, toast]);

  const requestBuyIn = useCallback((sessionId: string, userId: string, userName: string, userPicture: string, amount: number) => {
    const request: BuyInRequest = {
      id: `req_${Date.now()}`,
      userId,
      userName,
      userPicture,
      amount,
      status: 'pending',
      requestedAt: new Date(),
    };

    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          buyInRequests: [...session.buyInRequests, request],
        };
      }
      return session;
    }));

    toast({
      title: 'Buy-in Requested',
      description: `${formatINR(amount)} - Waiting for admin approval`,
    });
  }, [toast]);

  const approveBuyIn = useCallback((sessionId: string, requestId: string, approvedBy: string) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        const request = session.buyInRequests.find(r => r.id === requestId);
        if (!request) return session;

        const updatedPlayers = session.players.map(player => {
          if (player.userId === request.userId) {
            const newBuyIn = {
              id: requestId,
              amount: request.amount,
              status: 'approved' as const,
              requestedAt: request.requestedAt,
              approvedAt: new Date(),
              approvedBy,
            };
            return {
              ...player,
              buyIns: [...player.buyIns, newBuyIn],
              totalBuyIn: player.totalBuyIn + request.amount,
            };
          }
          return player;
        });

        const totalBuyIn = updatedPlayers.reduce((sum, p) => sum + p.totalBuyIn, 0);

        return {
          ...session,
          players: updatedPlayers,
          buyInRequests: session.buyInRequests.filter(r => r.id !== requestId),
          totalBuyIn,
        };
      }
      return session;
    }));

    toast({
      title: 'Buy-in Approved',
      description: 'Player can now start playing!',
    });
  }, [toast]);

  const rejectBuyIn = useCallback((sessionId: string, requestId: string) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          buyInRequests: session.buyInRequests.filter(r => r.id !== requestId),
        };
      }
      return session;
    }));

    toast({
      title: 'Buy-in Rejected',
      description: 'The request has been declined.',
      variant: 'destructive',
    });
  }, [toast]);

  const updatePlayerStack = useCallback((sessionId: string, userId: string, stack: number) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        const updatedPlayers = session.players.map(player => {
          if (player.userId === userId) {
            return {
              ...player,
              currentStack: stack,
              profitLoss: stack - player.totalBuyIn,
            };
          }
          return player;
        });

        const totalStack = updatedPlayers.reduce((sum, p) => sum + p.currentStack, 0);

        return {
          ...session,
          players: updatedPlayers,
          totalStack,
        };
      }
      return session;
    }));
  }, []);

  const validateSession = useCallback((sessionId: string): ValidationResult => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) {
      return {
        isValid: false,
        totalBuyIns: 0,
        totalStacks: 0,
        difference: 0,
        message: 'Session not found',
      };
    }

    const difference = session.totalBuyIn - session.totalStack;
    const isValid = difference === 0;

    return {
      isValid,
      totalBuyIns: session.totalBuyIn,
      totalStacks: session.totalStack,
      difference,
      message: isValid 
        ? 'Session is balanced! All buy-ins match total stacks.' 
        : `Difference: ${formatINR(Math.abs(difference))} - ${difference > 0 ? 'Missing from table' : 'Extra on table'}`,
    };
  }, [sessions]);

  const endSession = useCallback((sessionId: string) => {
    const validation = validateSession(sessionId);
    
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          status: 'ended',
          endedAt: new Date(),
          isValid: validation.isValid,
        };
      }
      return session;
    }));

    // Add to history
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      session.players.forEach(player => {
        const historyEntry: SessionHistory = {
          sessionId: session.id,
          sessionName: session.name,
          code: session.code,
          adminName: session.adminName,
          date: new Date(),
          totalBuyIn: player.totalBuyIn,
          currentStack: player.currentStack,
          profitLoss: player.profitLoss,
          status: 'ended',
        };
        setSessionHistory(prev => [historyEntry, ...prev]);
      });
    }

    toast({
      title: validation.isValid ? 'Session Ended' : 'Session Ended (Unbalanced)',
      description: validation.message,
      variant: validation.isValid ? 'default' : 'destructive',
    });
  }, [sessions, validateSession, toast]);

  const getSessionByCode = useCallback((code: string) => {
    return sessions.find(s => s.code.toUpperCase() === code.toUpperCase());
  }, [sessions]);

  const getSessionById = useCallback((id: string) => {
    return sessions.find(s => s.id === id);
  }, [sessions]);

  const getUserSessions = useCallback((userId: string) => {
    return sessions.filter(s => 
      s.adminId === userId || s.players.some(p => p.userId === userId)
    );
  }, [sessions]);

  const refreshSessions = useCallback(() => {
    // In a real app, this would fetch from API
    setSessions([...sessions]);
  }, [sessions]);

  return (
    <SessionContext.Provider
      value={{
        sessions,
        sessionHistory,
        currentSession,
        createSession,
        joinSession,
        requestBuyIn,
        approveBuyIn,
        rejectBuyIn,
        endSession,
        updatePlayerStack,
        validateSession,
        getSessionByCode,
        getSessionById,
        getUserSessions,
        refreshSessions,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

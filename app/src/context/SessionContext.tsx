import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Session, SessionHistory, ValidationResult } from '@/types';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { useAuth } from './AuthContext';

interface SessionContextType {
  sessions: Session[];
  sessionHistory: SessionHistory[];
  currentSession: Session | null;
  createSession: (name: string, adminId: string, adminName: string) => Promise<Session>;
  joinSession: (code: string, userId: string, userName: string, userEmail: string, userPicture: string) => Promise<boolean>;
  requestBuyIn: (sessionId: string, userId: string, userName: string, userPicture: string, amount: number) => Promise<void>;
  approveBuyIn: (sessionId: string, requestId: string, approvedBy: string) => Promise<void>;
  rejectBuyIn: (sessionId: string, requestId: string) => Promise<void>;
  dismissBuyInRequest: (sessionId: string, requestId: string) => Promise<void>;
  endSession: (sessionId: string) => Promise<void>;
  updatePlayerStack: (sessionId: string, userId: string, stack: number) => Promise<void>;
  validateSession: (sessionId: string) => ValidationResult;
  getSessionByCode: (code: string) => Session | undefined;
  getSessionById: (id: string) => Session | undefined;
  getUserSessions: (userId: string) => Session[];
  refreshSessions: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionHistory] = useState<SessionHistory[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const refreshSessions = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get('/sessions');
      setSessions(res.data);
    } catch (error) {
      console.error('Failed to fetch sessions', error);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  const createSession = useCallback(async (name: string, adminId: string, adminName: string): Promise<Session> => {
    try {
      const res = await api.post('/sessions', { name, adminId, adminName });
      const newSession = res.data;

      setSessions(prev => [newSession, ...prev]);
      toast({
        title: 'Session Created!',
        description: `Session code: ${newSession.code}`,
      });
      return newSession;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create session',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  const joinSession = useCallback(async (code: string, userId: string, userName: string, userEmail: string, userPicture: string): Promise<boolean> => {
    try {
      const res = await api.post('/sessions/join', { code, userId, userName, userEmail, userPicture });
      const updatedSession = res.data;

      setSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
      setCurrentSession(updatedSession);

      toast({
        title: 'Joined Session!',
        description: `Welcome to ${updatedSession.name}`,
      });
      return true;
    } catch (error) {
      toast({
        title: 'Join Failed',
        description: 'Invalid code or session ended',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  const requestBuyIn = useCallback(async (sessionId: string, userId: string, userName: string, userPicture: string, amount: number) => {
    try {
      const res = await api.post(`/sessions/${sessionId}/buyin`, { userId, userName, userPicture, amount });
      const updatedSession = res.data;

      setSessions(prev => prev.map(s => s.id === sessionId ? updatedSession : s));
      if (currentSession?.id === sessionId) setCurrentSession(updatedSession);

      toast({
        title: 'Buy-in Requested',
        description: `Waiting for admin approval`,
      });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to request buy-in', variant: 'destructive' });
    }
  }, [currentSession, toast]);

  const approveBuyIn = useCallback(async (sessionId: string, requestId: string, approvedBy: string) => {
    try {
      const res = await api.put(`/sessions/${sessionId}/buyin/${requestId}/approve`, { approvedBy });
      const updatedSession = res.data;

      setSessions(prev => prev.map(s => s.id === sessionId ? updatedSession : s));
      if (currentSession?.id === sessionId) setCurrentSession(updatedSession);

      toast({
        title: 'Buy-in Approved',
        description: 'Player can now start playing!',
      });
    } catch (error) {
      console.error(error);
    }
  }, [currentSession, toast]);

  const rejectBuyIn = useCallback(async (sessionId: string, requestId: string) => {
    try {
      const res = await api.put(`/sessions/${sessionId}/buyin/${requestId}/reject`);
      const updatedSession = res.data;

      setSessions(prev => prev.map(s => s.id === sessionId ? updatedSession : s));
      if (currentSession?.id === sessionId) setCurrentSession(updatedSession);

      toast({
        title: 'Buy-in Rejected',
        description: 'The request has been declined.',
        variant: 'destructive',
      });
    } catch (error) {
      console.error(error);
    }
  }, [currentSession, toast]);

  const dismissBuyInRequest = useCallback(async (sessionId: string, requestId: string) => {
    try {
      const res = await api.delete(`/sessions/${sessionId}/buyin/${requestId}`);
      const updatedSession = res.data;

      setSessions(prev => prev.map(s => s.id === sessionId ? updatedSession : s));
      if (currentSession?.id === sessionId) setCurrentSession(updatedSession);
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to dismiss request', variant: 'destructive' });
    }
  }, [currentSession, toast]);

  const updatePlayerStack = useCallback(async (sessionId: string, userId: string, stack: number) => {
    try {
      const res = await api.put(`/sessions/${sessionId}/stack`, { userId, stack });
      const updatedSession = res.data;

      setSessions(prev => prev.map(s => s.id === sessionId ? updatedSession : s));
      if (currentSession?.id === sessionId) setCurrentSession(updatedSession);
    } catch (error) {
      console.error(error);
    }
  }, [currentSession]);

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
        : `Difference: ${Math.abs(difference)} - ${difference > 0 ? 'Missing from table' : 'Extra on table'}`,
    };
  }, [sessions]);

  const endSession = useCallback(async (sessionId: string) => {
    const validation = validateSession(sessionId);
    try {
      const res = await api.put(`/sessions/${sessionId}/end`);
      const updatedSession = res.data;

      setSessions(prev => prev.map(s => s.id === sessionId ? updatedSession : s));
      if (currentSession?.id === sessionId) setCurrentSession(updatedSession);

      toast({
        title: validation.isValid ? 'Session Ended' : 'Session Ended (Unbalanced)',
        description: validation.message,
        variant: validation.isValid ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error(error);
    }
  }, [currentSession, validateSession, toast]);

  const getSessionByCode = useCallback((code: string) => {
    return sessions.find(s => s.code.toUpperCase() === code.toUpperCase());
  }, [sessions]);

  const getSessionById = useCallback((id: string) => {
    return sessions.find(s => s.id === id);
  }, [sessions]);

  const getUserSessions = useCallback((userId: string) => {
    // This could also be an API call if user has many sessions
    return sessions.filter(s =>
      s.adminId === userId || s.players.some(p => p.userId === userId)
    );
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
        dismissBuyInRequest,
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

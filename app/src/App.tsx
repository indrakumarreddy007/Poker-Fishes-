import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { SessionProvider } from '@/context/SessionContext';
import { Login } from '@/pages/Login';
import { PlayerDashboard } from '@/pages/PlayerDashboard';
import { HostSession } from '@/pages/HostSession';
import { JoinSession } from '@/pages/JoinSession';
import { History } from '@/pages/History';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { SessionManage } from '@/pages/SessionManage';
import { SessionSettlement } from '@/pages/SessionSettlement';
import { Navigation } from '@/components/Navigation';
import { ToastContainer } from '@/components/Toast';
import { useToast } from '@/hooks/use-toast';
import './App.css';

// Main App Content Component
const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { toasts, dismiss } = useToast();
  const [currentPage, setCurrentPage] = useState('player-dashboard');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // Set initial page based on user role
  useEffect(() => {
    if (isAuthenticated && user) {
      setCurrentPage(user.currentRole === 'admin' ? 'admin-dashboard' : 'player-dashboard');
    }
  }, [isAuthenticated, user]);

  const handleNavigate = (page: string) => {
    if (page.startsWith('session-settlement-')) {
      const sessionId = page.replace('session-settlement-', '');
      setSelectedSessionId(sessionId);
      setCurrentPage('session-settlement');
    } else if (page.startsWith('session-')) {
      const sessionId = page.replace('session-', '');
      setSelectedSessionId(sessionId);
      // Determine if session is ended, if so go to settlement?
      // For now, let's keep it simple. If status is ended, SessionManage will redirect or we handle it here.
      // But we don't have session status here easily without context lookup.
      // Let's rely on SessionManage to redirect if ended, OR just let user view manage and click "View Settlement".
      // MVP: Host Session -> Create -> onNavigate('session-id'). 
      setCurrentPage('session-manage');
    } else {
      setCurrentPage(page);
      setSelectedSessionId(null);
    }
  };



  const renderPage = () => {
    switch (currentPage) {
      case 'player-dashboard':
        return <PlayerDashboard />;
      case 'join-session':
        return <JoinSession />;
      case 'host-session':
        return <HostSession onNavigate={handleNavigate} />;
      case 'history':
        return <History onNavigate={handleNavigate} />;
      case 'admin-dashboard':
        return <AdminDashboard onNavigate={handleNavigate} />;
      case 'session-manage':
        return selectedSessionId ? (
          <SessionManage
            sessionId={selectedSessionId}
            onBack={() => handleNavigate('player-dashboard')}
            onNavigate={handleNavigate}
          />
        ) : (
          <AdminDashboard onNavigate={handleNavigate} />
        );
      case 'session-settlement':
        return selectedSessionId ? (
          <SessionSettlement
            sessionId={selectedSessionId}
            onNavigate={handleNavigate}
          />
        ) : (
          <PlayerDashboard />
        );
      default:
        return user?.currentRole === 'admin' ? (
          <AdminDashboard onNavigate={handleNavigate} />
        ) : (
          <PlayerDashboard />
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {!isAuthenticated ? (
        <Login />
      ) : (
        <>
          <Navigation onNavigate={handleNavigate} currentPage={currentPage} />
          {renderPage()}
        </>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
};

// Main App Component with Providers
function App() {
  return (
    <AuthProvider>
      <SessionProvider>
        <AppContent />
      </SessionProvider>
    </AuthProvider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { SessionProvider } from '@/context/SessionContext';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { SessionRoom } from '@/pages/SessionRoom';
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
      setCurrentPage('dashboard');
    }
  }, [isAuthenticated, user]);

  const handleNavigate = (page: string) => {
    if (page.startsWith('session-')) {
      const sessionId = page.replace('session-', '');
      setSelectedSessionId(sessionId);
      setCurrentPage('session-room');
    } else {
      setCurrentPage(page);
      setSelectedSessionId(null);
    }
  };



  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'session-room':
        return selectedSessionId ? (
          <SessionRoom
            sessionId={selectedSessionId}
            onBack={() => handleNavigate('dashboard')}
          />
        ) : (
          <Dashboard onNavigate={handleNavigate} />
        );
      default:
        return <Dashboard onNavigate={handleNavigate} />;
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

import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HostingSlotsProvider, useHostingSlots } from './contexts/HostingSlotsContext';
import LoginForm from './components/LoginForm';
import CurrentDateStatus from './components/CurrentDateStatus';
import HostingSlotsList from './components/HostingSlotsList';
import './App.css';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { deleteSlot } = useHostingSlots();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const handleDeleteSlot = async (id: number): Promise<void> => {
    try {
      await deleteSlot(id);
    } catch (error) {
      console.error('Failed to delete slot:', error);
    }
  };

  return (
    <div className="app">
      <main className="main-content">
        <div className="content-container">
          <CurrentDateStatus />
          <HostingSlotsList onDeleteSlot={handleDeleteSlot} />
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HostingSlotsProvider>
        <AppContent />
      </HostingSlotsProvider>
    </AuthProvider>
  );
};

export default App;

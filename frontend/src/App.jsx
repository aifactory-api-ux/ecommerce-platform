import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <Header user={user} onLogout={logout} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
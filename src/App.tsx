import React, { useState, useEffect } from 'react';
import './App.css';
import Game from './components/Game';
import Auth from './components/Auth/Auth';
import { AuthService, User } from './utils/AuthService';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session on app load
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    AuthService.clearUserSession();
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="App">
        <div className="loading-screen">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {user ? (
        // User is authenticated - show game
        <>
          <header className="App-header">
            <div className="header-content">
              <div className="header-left">
                <h1>Cows & Bulls</h1>
                <p>Daily Number Guessing Game</p>
              </div>
              <div className="header-right">
                <div className="user-info">
                  <span className="username">Welcome, {user.username}</span>
                  <button onClick={handleLogout} className="logout-button">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </header>
          <main>
            <Game />
          </main>
        </>
      ) : (
        // User is not authenticated - show auth screen
        <Auth onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

export default App;

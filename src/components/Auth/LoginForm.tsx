import React, { useState } from 'react';
import './Auth.css';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  onSwitchToRegister: () => void;
  isLoading?: boolean;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onLogin, 
  onSwitchToRegister, 
  isLoading = false, 
  error 
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && username.trim() && password.trim()) {
      onLogin(username.trim(), password);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign In</h2>
        <p className="auth-subtitle">Welcome back! Please sign in to continue.</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button primary"
            disabled={isLoading || !username.trim() || !password.trim()}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button 
              type="button" 
              className="auth-link"
              onClick={onSwitchToRegister}
              disabled={isLoading}
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

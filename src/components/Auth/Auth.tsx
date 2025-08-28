import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { AuthService, User, AuthResult } from '../../utils/AuthService';
import { AirtableService } from '../../services/AirtableService';

interface AuthProps {
  onAuthSuccess: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    setError(undefined);

    try {
      // Check if Airtable is configured
      if (!AirtableService.isConfigured()) {
        // Fallback to simulation for demo purposes
        const result = await simulateLogin(username, password);
        
        if (result.success && result.user) {
          AuthService.storeUserSession(result.user);
          onAuthSuccess(result.user);
        } else {
          setError(result.error || 'Login failed');
        }
        return;
      }

      // Use real Airtable authentication
      const result = await AirtableService.authenticateUser(username, password);
      
      if (result.success && result.user) {
        AuthService.storeUserSession(result.user);
        onAuthSuccess(result.user);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(undefined);

    try {
      // Check if Airtable is configured
      if (!AirtableService.isConfigured()) {
        // Fallback to simulation for demo purposes
        const result = await simulateRegister(username, email, password);
        
        if (result.success && result.user) {
          AuthService.storeUserSession(result.user);
          onAuthSuccess(result.user);
        } else {
          setError(result.error || 'Registration failed');
        }
        return;
      }

      // Use real Airtable registration
      const result = await AirtableService.createUser(username, email, password);
      
      if (result.success && result.user) {
        AuthService.storeUserSession(result.user);
        onAuthSuccess(result.user);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setError(undefined);
  };

  const switchToRegister = () => {
    setIsLogin(false);
    setError(undefined);
  };

  return (
    <>
      {isLogin ? (
        <LoginForm
          onLogin={handleLogin}
          onSwitchToRegister={switchToRegister}
          isLoading={isLoading}
          error={error}
        />
      ) : (
        <RegisterForm
          onRegister={handleRegister}
          onSwitchToLogin={switchToLogin}
          isLoading={isLoading}
          error={error}
        />
      )}
    </>
  );
};

// Fallback simulation functions for when Airtable is not configured
const simulateLogin = async (username: string, password: string): Promise<AuthResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, accept any login with username "demo" and password "demo123"
  if (username === 'demo' && password === 'demo123') {
    const user: User = {
      id: 'demo-user-1',
      username: 'demo',
      email: 'demo@example.com',
      name: 'Demo User',
      createdAt: new Date('2024-01-01'),
      lastSignIn: new Date(),
      noSessions: 0,
      score: 0
    };
    
    return { success: true, user };
  }
  
  return { success: false, error: 'Invalid username or password' };
};

const simulateRegister = async (username: string, email: string, password: string): Promise<AuthResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, accept any registration
  const user: User = {
    id: `user-${Date.now()}`,
    username,
    email,
    name: username,
    createdAt: new Date(),
    lastSignIn: new Date(),
    noSessions: 0,
    score: 0
  };
  
  return { success: true, user };
};

export default Auth;

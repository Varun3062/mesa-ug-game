import React, { useState } from 'react';
import './Auth.css';

interface RegisterFormProps {
  onRegister: (username: string, email: string, password: string) => void;
  onSwitchToLogin: () => void;
  isLoading?: boolean;
  error?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onRegister, 
  onSwitchToLogin, 
  isLoading = false, 
  error 
}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateForm = () => {
    const errors: string[] = [];
    
    if (username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      errors.push('Please enter a valid email address');
    }
    
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    
    if (password !== confirmPassword) {
      errors.push('Passwords do not match');
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && !isLoading) {
      onRegister(username.trim(), email.trim().toLowerCase(), password);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join us and start playing today!</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}
          
          {(validationErrors.length > 0) && (
            <div className="auth-error">
              <ul>
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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
              placeholder="Create a password"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              disabled={isLoading}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button primary"
            disabled={isLoading || !username.trim() || !email.trim() || !password || !confirmPassword}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button 
              type="button" 
              className="auth-link"
              onClick={onSwitchToLogin}
              disabled={isLoading}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;

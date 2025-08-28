import React, { useState } from 'react';
import { GameLogic } from '../utils/GameLogic';
import './GuessInput.css';

interface GuessInputProps {
  onGuess: (guess: number) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const GuessInput: React.FC<GuessInputProps> = ({ onGuess, disabled = false, isLoading = false }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow digits and limit to 3 characters
    if (/^\d{0,3}$/.test(value)) {
      setInput(value);
      setError(null); // Clear error when user starts typing
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (disabled || isLoading) return;

    const validation = GameLogic.validateGuess(input);
    
    if (!validation.isValid) {
      setError(validation.error || 'Invalid input');
      return;
    }

    if (validation.number !== undefined) {
      onGuess(validation.number);
      setInput('');
      setError(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Allow only digits
    if (!/\d/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
      e.preventDefault();
    }
  };

  return (
    <div className="guess-input-container">
      <form onSubmit={handleSubmit} className="guess-form">
        <div className="input-group">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter 3 digits"
            maxLength={3}
            disabled={disabled || isLoading}
            className={`guess-input ${error ? 'error' : ''}`}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={disabled || isLoading || input.length !== 3}
            className="guess-button"
          >
            {isLoading ? (
              <span className="loading-spinner">⏳</span>
            ) : (
              'Guess'
            )}
          </button>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="input-hint">
          <p>Enter 3 unique digits (e.g., 123, 456, 789)</p>
        </div>
      </form>
    </div>
  );
};

export default GuessInput;

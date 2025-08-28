import React from 'react';
import { GuessResult } from '../utils/GameLogic';
import './GuessHistory.css';

interface GuessHistoryProps {
  guesses: GuessResult[];
  targetNumber?: number;
  showTarget?: boolean;
}

const GuessHistory: React.FC<GuessHistoryProps> = ({ 
  guesses, 
  targetNumber, 
  showTarget = false 
}) => {
  if (guesses.length === 0) {
    return (
      <div className="guess-history-container">
        <div className="no-guesses">
          <p>No guesses yet. Make your first guess!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="guess-history-container">
      <h3 className="history-title">
        Guess History ({guesses.length} {guesses.length === 1 ? 'guess' : 'guesses'})
      </h3>
      
      {showTarget && targetNumber && (
        <div className="target-number-reveal">
          <p>The number was: <span className="target-number">{targetNumber}</span></p>
        </div>
      )}
      
      <div className="guesses-list">
        {guesses.map((guess, index) => (
          <div 
            key={index} 
            className={`guess-item ${guess.isCorrect ? 'correct' : ''}`}
          >
            <div className="guess-number">
              <span className="guess-label">Guess #{index + 1}:</span>
              <span className="guess-value">{guess.guess}</span>
            </div>
            
            <div className="guess-feedback">
              <div className="feedback-item">
                <span className="feedback-icon">🐄</span>
                <span className="feedback-label">Cows:</span>
                <span className="feedback-value">{guess.cows}</span>
              </div>
              
              <div className="feedback-item">
                <span className="feedback-icon">🐂</span>
                <span className="feedback-label">Bulls:</span>
                <span className="feedback-value">{guess.bulls}</span>
              </div>
            </div>
            
            {guess.isCorrect && (
              <div className="correct-badge">
                🎉 Correct!
              </div>
            )}
            
            <div className="guess-timestamp">
              {guess.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      
      <div className="history-summary">
        <div className="summary-item">
          <span className="summary-label">Total Attempts:</span>
          <span className="summary-value">{guesses.length}</span>
        </div>
        
        {guesses.some(g => g.isCorrect) && (
          <div className="summary-item">
            <span className="summary-label">Solved in:</span>
            <span className="summary-value">
              {guesses.findIndex(g => g.isCorrect) + 1} attempts
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuessHistory;

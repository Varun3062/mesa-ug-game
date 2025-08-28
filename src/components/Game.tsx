import React, { useState, useEffect } from 'react';
import { DailyNumberGenerator } from '../utils/DailyNumberGenerator';
import { GameLogic, GameState } from '../utils/GameLogic';
import GuessInput from './GuessInput';
import GuessHistory from './GuessHistory';
import './Game.css';

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTarget, setShowTarget] = useState(false);

  // Initialize game on component mount
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    setIsLoading(true);
    
    try {
      // Generate today's number
      const todayNumber = DailyNumberGenerator.getTodayNumber();
      
      // Initialize game state
      const newGameState = GameLogic.initializeGame(todayNumber);
      
      setGameState(newGameState);
      console.log('Today\'s number:', todayNumber); // For debugging
    } catch (error) {
      console.error('Error initializing game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuess = (guess: number) => {
    if (!gameState) return;

    // Add guess to game state
    const updatedGameState = GameLogic.addGuess(gameState, guess);
    setGameState(updatedGameState);

    // If game is won, show target number after a delay
    if (updatedGameState.isWon) {
      setTimeout(() => {
        setShowTarget(true);
      }, 2000);
    }
  };

  const resetGame = () => {
    setShowTarget(false);
    initializeGame();
  };

  const getGameStatus = () => {
    if (!gameState) return 'Loading...';
    
    if (gameState.isWon) {
      return '🎉 Congratulations! You solved it!';
    }
    
    if (gameState.attempts === 0) {
      return 'Ready to play! Enter your first guess.';
    }
    
    return `Keep guessing! You've made ${gameState.attempts} ${gameState.attempts === 1 ? 'attempt' : 'attempts'}.`;
  };

  if (isLoading) {
    return (
      <div className="game-container">
        <div className="loading-screen">
          <div className="loading-spinner">🎲</div>
          <p>Loading today's puzzle...</p>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="game-container">
        <div className="error-screen">
          <p>Error loading game. Please refresh the page.</p>
          <button onClick={initializeGame} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-stats">
          <div className="stat">
            <label>Attempts:</label>
            <span>{gameState.attempts}</span>
          </div>
          <div className="stat">
            <label>Status:</label>
            <span className={gameState.isWon ? 'status-won' : 'status-playing'}>
              {gameState.isWon ? 'Won!' : 'Playing'}
            </span>
          </div>
        </div>
        
        <div className="game-controls">
          {gameState.isWon && (
            <button className="btn btn-primary" onClick={resetGame}>
              Play Again
            </button>
          )}
          
          {!gameState.isWon && gameState.attempts > 0 && (
            <button className="btn btn-secondary" onClick={resetGame}>
              New Game
            </button>
          )}
        </div>
      </div>

      <div className="game-area">
        <div className="game-content">
          <div className="game-status">
            <h2>{getGameStatus()}</h2>
          </div>

          {!gameState.isWon && (
            <GuessInput
              onGuess={handleGuess}
              disabled={gameState.isWon}
              isLoading={isLoading}
            />
          )}

          {gameState.isWon && (
            <div className="victory-message">
              <h3>🎉 You Won! 🎉</h3>
              <p>You solved the puzzle in {gameState.attempts} {gameState.attempts === 1 ? 'attempt' : 'attempts'}!</p>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowTarget(!showTarget)}
              >
                {showTarget ? 'Hide' : 'Show'} the Number
              </button>
            </div>
          )}

          <GuessHistory
            guesses={gameState.guesses}
            targetNumber={gameState.targetNumber}
            showTarget={showTarget}
          />
        </div>
      </div>
    </div>
  );
};

export default Game;

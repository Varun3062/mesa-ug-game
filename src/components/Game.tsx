import React, { useState, useEffect } from 'react';
import { GameLogic, GameState } from '../utils/GameLogic';
import { SessionManager, GameSession } from '../services/SessionManager';
import { AuthService, User } from '../utils/AuthService';
import GuessInput from './GuessInput';
import GuessHistory from './GuessHistory';
import './Game.css';

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [session, setSession] = useState<GameSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTarget, setShowTarget] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Initialize game on component mount
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    setIsLoading(true);
    
    try {
      // Get current user
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) {
        console.error('No authenticated user found');
        setIsLoading(false);
        return;
      }
      
      setUser(currentUser);

      // Initialize session with Airtable
      const gameSession = await SessionManager.initializeSession(currentUser);
      
      if (!gameSession) {
        console.error('Failed to initialize session');
        setIsLoading(false);
        return;
      }

      setSession(gameSession);

      // Initialize game state with the target number from session
      const newGameState = GameLogic.initializeGame(gameSession.targetNumber);
      setGameState(newGameState);
      
      console.log('Today\'s number:', gameSession.targetNumber); // For debugging
    } catch (error) {
      console.error('Error initializing game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuess = async (guess: number) => {
    if (!gameState || !session || !user) return;

    // Add guess to game state
    const updatedGameState = GameLogic.addGuess(gameState, guess);
    setGameState(updatedGameState);

    // If game is won, update session and user stats
    if (updatedGameState.isWon) {
      try {
        // Mark session as completed
        await SessionManager.completeSession(session.sessionId, true);
        
        // Update user statistics
        await SessionManager.updateUserStats(user, true);
        
        // Update local user data
        AuthService.storeUserSession(user);
        
        console.log('Game completed successfully!');
      } catch (error) {
        console.error('Error updating session/user stats:', error);
      }

      // Show target number after a delay
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
      return 'Congratulations! You solved it!';
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
          <div className="loading-spinner">Loading...</div>
          <p>Initializing today's puzzle...</p>
        </div>
      </div>
    );
  }

  if (!gameState || !session) {
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
          {user && (
            <div className="stat">
              <label>Total Score:</label>
              <span>{user.score}</span>
            </div>
          )}
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
              <h3>You Won!</h3>
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

import React, { useState } from 'react';
import './Game.css';

interface GameState {
  score: number;
  level: number;
  isPlaying: boolean;
  gameStarted: boolean;
}

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    isPlaying: false,
    gameStarted: false
  });

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      gameStarted: true,
      score: 0,
      level: 1
    }));
  };

  const pauseGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false
    }));
  };

  const resumeGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true
    }));
  };

  const resetGame = () => {
    setGameState({
      score: 0,
      level: 1,
      isPlaying: false,
      gameStarted: false
    });
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-stats">
          <div className="stat">
            <label>Score:</label>
            <span>{gameState.score}</span>
          </div>
          <div className="stat">
            <label>Level:</label>
            <span>{gameState.level}</span>
          </div>
        </div>
        
        <div className="game-controls">
          {!gameState.gameStarted ? (
            <button className="btn btn-primary" onClick={startGame}>
              Start Game
            </button>
          ) : gameState.isPlaying ? (
            <button className="btn btn-secondary" onClick={pauseGame}>
              Pause
            </button>
          ) : (
            <button className="btn btn-primary" onClick={resumeGame}>
              Resume
            </button>
          )}
          
          {gameState.gameStarted && (
            <button className="btn btn-danger" onClick={resetGame}>
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="game-area">
        {!gameState.gameStarted ? (
          <div className="welcome-screen">
            <h2>Welcome to Mesa UG Game!</h2>
            <p>Click "Start Game" to begin your adventure.</p>
          </div>
        ) : (
          <div className="game-board">
            <div className="game-content">
              <p>Game content will go here...</p>
              <p>Level {gameState.level} - Score: {gameState.score}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;

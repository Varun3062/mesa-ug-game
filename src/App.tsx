import React from 'react';
import './App.css';
import Game from './components/Game';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🐄 Cows & Bulls 🐂</h1>
        <p>Daily Number Guessing Game</p>
      </header>
      <main>
        <Game />
      </main>
    </div>
  );
}

export default App;

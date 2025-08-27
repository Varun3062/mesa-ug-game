import React, { useState } from 'react';
import './App.css';
import Game from './components/Game';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Mesa UG Game</h1>
        <p>A Single Player Adventure</p>
      </header>
      <main>
        <Game />
      </main>
    </div>
  );
}

export default App;

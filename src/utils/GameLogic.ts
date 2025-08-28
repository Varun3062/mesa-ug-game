/**
 * Core Game Logic for Cows and Bulls Game
 * Handles game mechanics, validation, and scoring
 */

export interface GuessResult {
  guess: number;
  cows: number;
  bulls: number;
  isCorrect: boolean;
  timestamp: Date;
}

export interface GameState {
  targetNumber: number;
  guesses: GuessResult[];
  isCompleted: boolean;
  isWon: boolean;
  attempts: number;
  startTime: Date;
  endTime?: Date;
}

export class GameLogic {
  /**
   * Calculate Cows and Bulls for a guess
   * @param guess - User's guess (3-digit number)
   * @param targetNumber - The target number to guess
   * @returns Object with cows and bulls count
   */
  static calculateCowsAndBulls(guess: number, targetNumber: number): { cows: number; bulls: number } {
    const guessDigits = guess.toString().split('').map(Number);
    const targetDigits = targetNumber.toString().split('').map(Number);
    
    let bulls = 0;
    let cows = 0;
    
    // Count bulls (correct digit in correct position)
    for (let i = 0; i < 3; i++) {
      if (guessDigits[i] === targetDigits[i]) {
        bulls++;
      }
    }
    
    // Count cows (correct digit in wrong position)
    for (let i = 0; i < 3; i++) {
      if (guessDigits[i] !== targetDigits[i] && targetDigits.includes(guessDigits[i])) {
        cows++;
      }
    }
    
    return { cows, bulls };
  }

  /**
   * Validate user input for a guess
   * @param input - User input string
   * @returns Validation result
   */
  static validateGuess(input: string): { isValid: boolean; error?: string; number?: number } {
    // Check if input is empty
    if (!input || input.trim() === '') {
      return { isValid: false, error: 'Please enter a number' };
    }
    
    // Check if input is numeric
    if (!/^\d+$/.test(input)) {
      return { isValid: false, error: 'Please enter only digits' };
    }
    
    // Check if input is exactly 3 digits
    if (input.length !== 3) {
      return { isValid: false, error: 'Please enter exactly 3 digits' };
    }
    
    const number = parseInt(input, 10);
    
    // Check if all digits are unique
    const digits = input.split('');
    const uniqueDigits = new Set(digits);
    
    if (uniqueDigits.size !== 3) {
      return { isValid: false, error: 'All digits must be unique' };
    }
    
    return { isValid: true, number };
  }

  /**
   * Process a user guess
   * @param guess - Validated guess number
   * @param targetNumber - Target number
   * @returns Guess result
   */
  static processGuess(guess: number, targetNumber: number): GuessResult {
    const { cows, bulls } = this.calculateCowsAndBulls(guess, targetNumber);
    const isCorrect = bulls === 3;
    
    return {
      guess,
      cows,
      bulls,
      isCorrect,
      timestamp: new Date()
    };
  }

  /**
   * Initialize a new game state
   * @param targetNumber - The target number for the game
   * @returns New game state
   */
  static initializeGame(targetNumber: number): GameState {
    return {
      targetNumber,
      guesses: [],
      isCompleted: false,
      isWon: false,
      attempts: 0,
      startTime: new Date()
    };
  }

  /**
   * Add a guess to the game state
   * @param gameState - Current game state
   * @param guess - User's guess
   * @returns Updated game state
   */
  static addGuess(gameState: GameState, guess: number): GameState {
    const guessResult = this.processGuess(guess, gameState.targetNumber);
    const newGuesses = [...gameState.guesses, guessResult];
    
    const isCompleted = guessResult.isCorrect;
    const endTime = isCompleted ? new Date() : gameState.endTime;
    
    return {
      ...gameState,
      guesses: newGuesses,
      attempts: gameState.attempts + 1,
      isCompleted,
      isWon: isCompleted,
      endTime
    };
  }

  /**
   * Get game statistics
   * @param gameState - Current game state
   * @returns Game statistics
   */
  static getGameStats(gameState: GameState) {
    const duration = gameState.endTime 
      ? gameState.endTime.getTime() - gameState.startTime.getTime()
      : Date.now() - gameState.startTime.getTime();
    
    return {
      attempts: gameState.attempts,
      isCompleted: gameState.isCompleted,
      isWon: gameState.isWon,
      duration: Math.floor(duration / 1000), // Duration in seconds
      startTime: gameState.startTime,
      endTime: gameState.endTime
    };
  }

  /**
   * Check if game is over (won or max attempts reached)
   * @param gameState - Current game state
   * @param maxAttempts - Maximum allowed attempts (optional)
   * @returns True if game is over
   */
  static isGameOver(gameState: GameState, maxAttempts?: number): boolean {
    if (gameState.isWon) return true;
    if (maxAttempts && gameState.attempts >= maxAttempts) return true;
    return false;
  }

  /**
   * Get feedback message for a guess
   * @param cows - Number of cows
   * @param bulls - Number of bulls
   * @returns Human-readable feedback message
   */
  static getFeedbackMessage(cows: number, bulls: number): string {
    if (bulls === 3) {
      return "Congratulations! You've found the number!";
    }
    
    const parts: string[] = [];
    
    if (bulls > 0) {
      parts.push(`${bulls} Bull${bulls > 1 ? 's' : ''}`);
    }
    
    if (cows > 0) {
      parts.push(`${cows} Cow${cows > 1 ? 's' : ''}`);
    }
    
    if (parts.length === 0) {
      return "No matches found. Try again!";
    }
    
    return parts.join(', ');
  }

  /**
   * Format number for display (add leading zeros if needed)
   * @param number - Number to format
   * @returns Formatted string
   */
  static formatNumber(number: number): string {
    return number.toString().padStart(3, '0');
  }
}

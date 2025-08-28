/**
 * Daily Number Generator for Cows and Bulls Game
 * Generates consistent 3-digit numbers with unique digits based on date
 */

export class DailyNumberGenerator {
  private static readonly DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  /**
   * Generate a deterministic 3-digit number with unique digits for a given date
   * @param date - The date to generate number for (defaults to today in IST)
   * @returns 3-digit number with unique digits
   */
  static generateDailyNumber(date: Date = new Date()): number {
    // Convert to IST (UTC+5:30)
    const istDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
    const dateString = istDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Create a seed from the date string
    const seed = this.createSeedFromDate(dateString);
    
    // Generate the number using the seed
    return this.generateNumberFromSeed(seed);
  }

  /**
   * Create a numeric seed from date string
   * @param dateString - Date in YYYY-MM-DD format
   * @returns Numeric seed
   */
  private static createSeedFromDate(dateString: string): number {
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Generate a 3-digit number with unique digits using a seed
   * @param seed - Numeric seed for generation
   * @returns 3-digit number with unique digits
   */
  private static generateNumberFromSeed(seed: number): number {
    // Create a copy of digits array
    const availableDigits = [...this.DIGITS];
    let result = 0;
    
    // Generate 3 digits
    for (let i = 0; i < 3; i++) {
      // Use seed to select a random digit
      const randomIndex = seed % availableDigits.length;
      const selectedDigit = availableDigits[randomIndex];
      
      // Remove selected digit from available digits
      availableDigits.splice(randomIndex, 1);
      
      // Add digit to result
      result = result * 10 + selectedDigit;
      
      // Update seed for next iteration
      seed = Math.floor(seed / 10) + selectedDigit;
    }
    
    return result;
  }

  /**
   * Get today's number in IST
   * @returns Today's 3-digit number
   */
  static getTodayNumber(): number {
    return this.generateDailyNumber();
  }

  /**
   * Get number for a specific date
   * @param date - Specific date
   * @returns 3-digit number for that date
   */
  static getNumberForDate(date: Date): number {
    return this.generateDailyNumber(date);
  }

  /**
   * Check if a number is valid (3 digits with unique digits)
   * @param number - Number to validate
   * @returns True if valid
   */
  static isValidNumber(number: number): boolean {
    const digits = number.toString().split('').map(Number);
    
    // Check if it's exactly 3 digits
    if (digits.length !== 3) return false;
    
    // Check if all digits are unique
    const uniqueDigits = new Set(digits);
    return uniqueDigits.size === 3;
  }

  /**
   * Get current IST date string
   * @returns Date string in YYYY-MM-DD format (IST)
   */
  static getCurrentISTDateString(): string {
    const now = new Date();
    const istDate = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    return istDate.toISOString().split('T')[0];
  }
}

import { AirtableService } from './AirtableService';
import { DailyNumberGenerator } from '../utils/DailyNumberGenerator';
import { User } from '../utils/AuthService';

export interface GameSession {
  sessionId: string;
  userId: string;
  date: string;
  targetNumber: number;
  isCompleted: boolean;
  score: number;
}

export class SessionManager {
  /**
   * Initialize or get existing session for today
   */
  static async initializeSession(user: User): Promise<GameSession | null> {
    try {
      const today = DailyNumberGenerator.getCurrentISTDateString();
      const targetNumber = DailyNumberGenerator.getTodayNumber();

      // Create or get existing session from Airtable
      const sessionId = await AirtableService.createOrUpdateSession(user.id, today);

      if (!sessionId) {
        console.error('Failed to create session');
        return null;
      }

      return {
        sessionId,
        userId: user.id,
        date: today,
        targetNumber,
        isCompleted: false,
        score: 0
      };
    } catch (error) {
      console.error('Error initializing session:', error);
      return null;
    }
  }

  /**
   * Mark session as completed
   */
  static async completeSession(sessionId: string, isWon: boolean): Promise<boolean> {
    try {
      const score = isWon ? 1 : 0;
      const success = await AirtableService.updateSessionScore(sessionId, score);
      
      if (success) {
        console.log(`Session ${sessionId} marked as ${isWon ? 'won' : 'lost'}`);
      }
      
      return success;
    } catch (error) {
      console.error('Error completing session:', error);
      return false;
    }
  }

  /**
   * Update user statistics after game completion
   */
  static async updateUserStats(user: User, isWon: boolean): Promise<boolean> {
    try {
      const newNoSessions = user.noSessions + 1;
      const newScore = isWon ? user.score + 1 : user.score;

      const success = await AirtableService.updateUserStats(
        user.id, 
        newNoSessions, 
        newScore
      );

      if (success) {
        // Update local user data
        user.noSessions = newNoSessions;
        user.score = newScore;
      }

      return success;
    } catch (error) {
      console.error('Error updating user stats:', error);
      return false;
    }
  }

  /**
   * Get today's date in IST format
   */
  static getTodayDate(): string {
    return DailyNumberGenerator.getCurrentISTDateString();
  }

  /**
   * Check if a date is today
   */
  static isToday(date: string): boolean {
    const today = this.getTodayDate();
    return date === today;
  }

  /**
   * Get target number for a specific date
   */
  static getTargetNumber(date?: string): number {
    if (date) {
      const targetDate = new Date(date);
      return DailyNumberGenerator.getNumberForDate(targetDate);
    }
    return DailyNumberGenerator.getTodayNumber();
  }
}

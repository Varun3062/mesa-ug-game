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

      // Check if Airtable is configured
      if (!AirtableService.isConfigured()) {
        // Fallback to local session without Airtable
        console.log('Airtable not configured, using local session');
        return {
          sessionId: `local-${user.id}-${today}`,
          userId: user.id,
          date: today,
          targetNumber,
          isCompleted: false,
          score: 0
        };
      }

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
      // Fallback to local session
      const today = DailyNumberGenerator.getCurrentISTDateString();
      const targetNumber = DailyNumberGenerator.getTodayNumber();
      return {
        sessionId: `local-${user.id}-${today}`,
        userId: user.id,
        date: today,
        targetNumber,
        isCompleted: false,
        score: 0
      };
    }
  }

  /**
   * Mark session as completed
   */
  static async completeSession(sessionId: string, isWon: boolean): Promise<boolean> {
    try {
      // Check if this is a local session
      if (sessionId.startsWith('local-')) {
        console.log(`Local session ${sessionId} marked as ${isWon ? 'won' : 'lost'}`);
        return true;
      }

      // Use Airtable if configured
      if (AirtableService.isConfigured()) {
        const score = isWon ? 1 : 0;
        const success = await AirtableService.updateSessionScore(sessionId, score);
        
        if (success) {
          console.log(`Session ${sessionId} marked as ${isWon ? 'won' : 'lost'}`);
        }
        
        return success;
      }

      return true; // Local mode
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

      // Update local user data first
      user.noSessions = newNoSessions;
      user.score = newScore;

      // Use Airtable if configured
      if (AirtableService.isConfigured()) {
        const success = await AirtableService.updateUserStats(
          user.id, 
          newNoSessions, 
          newScore
        );

        if (success) {
          console.log('User stats updated in Airtable');
        }

        return success;
      }

      console.log('User stats updated locally (Airtable not configured)');
      return true; // Local mode
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

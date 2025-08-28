import Airtable from 'airtable';
import { AuthService, User, AirtableUser, AuthResult } from '../utils/AuthService';

// Airtable configuration
const AIRTABLE_API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY || '';
const AIRTABLE_BASE_ID = process.env.REACT_APP_AIRTABLE_BASE_ID || '';

// Debug: Log configuration status (remove in production)
console.log('Airtable Configuration Status:');
console.log('- API Key available:', !!AIRTABLE_API_KEY);
console.log('- Base ID available:', !!AIRTABLE_BASE_ID);
console.log('- Both configured:', !!(AIRTABLE_API_KEY && AIRTABLE_BASE_ID));

// Initialize Airtable only if credentials are available
let base: any = null;

try {
  if (AIRTABLE_API_KEY && AIRTABLE_BASE_ID) {
    const Airtable = require('airtable');
    base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    console.log('✅ Airtable initialized successfully');
  } else {
    console.log('⚠️ Airtable not configured - using demo mode');
  }
} catch (error) {
  console.warn('❌ Airtable initialization failed:', error);
}

export class AirtableService {
  private static readonly USERS_TABLE = 'Users';
  private static readonly SESSIONS_TABLE = 'Sessions';

  /**
   * Check if Airtable is properly configured
   */
  static isConfigured(): boolean {
    return !!(AIRTABLE_API_KEY && AIRTABLE_BASE_ID && base);
  }

  /**
   * Create a new user in Airtable
   */
  static async createUser(username: string, email: string, password: string): Promise<AuthResult> {
    try {
      if (!this.isConfigured() || !base) {
        throw new Error('Airtable not configured');
      }

      // Hash the password
      const { hash, salt } = await AuthService.hashPassword(password);

      // Check if username already exists
      const existingUser = await this.findUserByUsername(username);
      if (existingUser) {
        return { success: false, error: 'Username already exists' };
      }

      // Check if email already exists
      const existingEmail = await this.findUserByEmail(email);
      if (existingEmail) {
        return { success: false, error: 'Email already exists' };
      }

      // Create new user record
      const userData = {
        Name: username,
        Email: email.toLowerCase(),
        Passwordhash: hash,
        Salt: salt,
        Nosessions: 0,
        Score: 0
      };

      const record = await base(this.USERS_TABLE).create([{ fields: userData }]);
      
      if (record && record[0]) {
        const airtableUser: AirtableUser = {
          Userid: record[0].id,
          Name: record[0].fields.Name as string,
          Email: record[0].fields.Email as string,
          Passwordhash: record[0].fields.Passwordhash as string,
          Salt: record[0].fields.Salt as string,
          Createdat: record[0].fields.Createdat as string,
          Nosessions: (record[0].fields.Nosessions as number) || 0,
          Score: (record[0].fields.Score as number) || 0
        };

        const user = AuthService.mapAirtableUser(airtableUser);
        return { success: true, user };
      }

      return { success: false, error: 'Failed to create user' };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error: 'Failed to create user' };
    }
  }

  /**
   * Authenticate user login
   */
  static async authenticateUser(username: string, password: string): Promise<AuthResult> {
    try {
      if (!this.isConfigured() || !base) {
        throw new Error('Airtable not configured');
      }

      // Find user by username
      const user = await this.findUserByUsername(username);
      if (!user) {
        return { success: false, error: 'Invalid username or password' };
      }

      // Verify password
      const isValidPassword = await AuthService.verifyPassword(
        password, 
        user.Passwordhash, 
        user.Salt
      );

      if (!isValidPassword) {
        return { success: false, error: 'Invalid username or password' };
      }

      // Update last sign in
      await this.updateLastSignIn(user.Userid);

      const mappedUser = AuthService.mapAirtableUser(user);
      return { success: true, user: mappedUser };
    } catch (error) {
      console.error('Error authenticating user:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  /**
   * Find user by username
   */
  private static async findUserByUsername(username: string): Promise<AirtableUser | null> {
    try {
      const records = await base(this.USERS_TABLE)
        .select({
          filterByFormula: `{Name} = '${username}'`,
          maxRecords: 1
        })
        .firstPage();

      if (records && records.length > 0) {
        const record = records[0];
        return {
          Userid: record.id,
          Name: record.fields.Name as string,
          Email: record.fields.Email as string,
          Passwordhash: record.fields.Passwordhash as string,
          Salt: record.fields.Salt as string,
          Createdat: record.fields.Createdat as string,
          Lastsignin: record.fields.Lastsignin as string,
          Nosessions: (record.fields.Nosessions as number) || 0,
          Score: (record.fields.Score as number) || 0
        };
      }

      return null;
    } catch (error) {
      console.error('Error finding user by username:', error);
      return null;
    }
  }

  /**
   * Find user by email
   */
  private static async findUserByEmail(email: string): Promise<AirtableUser | null> {
    try {
      const records = await base(this.USERS_TABLE)
        .select({
          filterByFormula: `{Email} = '${email.toLowerCase()}'`,
          maxRecords: 1
        })
        .firstPage();

      if (records && records.length > 0) {
        const record = records[0];
        return {
          Userid: record.id,
          Name: record.fields.Name as string,
          Email: record.fields.Email as string,
          Passwordhash: record.fields.Passwordhash as string,
          Salt: record.fields.Salt as string,
          Createdat: record.fields.Createdat as string,
          Lastsignin: record.fields.Lastsignin as string,
          Nosessions: (record.fields.Nosessions as number) || 0,
          Score: (record.fields.Score as number) || 0
        };
      }

      return null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  /**
   * Update last sign in time
   */
  private static async updateLastSignIn(userId: string): Promise<void> {
    try {
      await base(this.USERS_TABLE).update([
        {
          id: userId,
          fields: {
            Lastsignin: new Date().toISOString()
          }
        }
      ]);
    } catch (error) {
      console.error('Error updating last sign in:', error);
    }
  }

  /**
   * Create or update a session for a user
   */
  static async createOrUpdateSession(userId: string, date: string): Promise<string | null> {
    try {
      if (!this.isConfigured() || !base) {
        throw new Error('Airtable not configured');
      }

      // Check if session already exists for this user and date
      const existingSession = await this.findSessionByUserAndDate(userId, date);
      
      if (existingSession) {
        // Return existing session ID
        return existingSession.Sessionid;
      } else {
        // Create new session
        const sessionData = {
          Userid: [userId], // Airtable linked field
          Score: 0 // Not completed yet
        };

        const record = await base(this.SESSIONS_TABLE).create([{ fields: sessionData }]);
        
        if (record && record[0]) {
          return record[0].id;
        }
      }

      return null;
    } catch (error) {
      console.error('Error creating/updating session:', error);
      return null;
    }
  }

  /**
   * Update session score (completion status)
   */
  static async updateSessionScore(sessionId: string, score: number): Promise<boolean> {
    try {
      if (!this.isConfigured() || !base) {
        throw new Error('Airtable not configured');
      }

      await base(this.SESSIONS_TABLE).update([
        {
          id: sessionId,
          fields: {
            Score: score
          }
        }
      ]);

      return true;
    } catch (error) {
      console.error('Error updating session score:', error);
      return false;
    }
  }

  /**
   * Update user statistics
   */
  static async updateUserStats(userId: string, noSessions: number, score: number): Promise<boolean> {
    try {
      if (!this.isConfigured() || !base) {
        throw new Error('Airtable not configured');
      }

      await base(this.USERS_TABLE).update([
        {
          id: userId,
          fields: {
            Nosessions: noSessions,
            Score: score
          }
        }
      ]);

      return true;
    } catch (error) {
      console.error('Error updating user stats:', error);
      return false;
    }
  }

  /**
   * Find session by user and date
   */
  private static async findSessionByUserAndDate(userId: string, date: string): Promise<any | null> {
    try {
      const records = await base(this.SESSIONS_TABLE)
        .select({
          filterByFormula: `AND({Userid} = '${userId}', DATE({Createdat}) = '${date}')`,
          maxRecords: 1
        })
        .firstPage();

      if (records && records.length > 0) {
        return {
          Sessionid: records[0].id,
          Userid: records[0].fields.Userid,
          Createdat: records[0].fields.Createdat,
          Score: records[0].fields.Score
        };
      }

      return null;
    } catch (error) {
      console.error('Error finding session:', error);
      return null;
    }
  }
}

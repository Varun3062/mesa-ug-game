/**
 * Authentication Service
 * Handles password hashing, validation, and user authentication
 */

export interface User {
  id: string;
  username: string; // This maps to the Name field in Airtable
  email: string;
  name?: string;
  createdAt: Date;
  lastSignIn?: Date;
  noSessions: number;
  score: number;
}

export interface AirtableUser {
  Userid: string;
  Name: string; // Username is stored here
  Email: string;
  Passwordhash: string; // Note: lowercase 'h' in Airtable
  Salt: string;
  Createdat: string;
  Lastsignin?: string;
  Nosessions: number;
  Score: number;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export class AuthService {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Convert Airtable user format to internal User format
   * @param airtableUser - User data from Airtable
   * @returns Internal User object
   */
  static mapAirtableUser(airtableUser: AirtableUser): User {
    return {
      id: airtableUser.Userid,
      username: airtableUser.Name, // Username is stored in Name field
      email: airtableUser.Email,
      name: airtableUser.Name,
      createdAt: new Date(airtableUser.Createdat),
      lastSignIn: airtableUser.Lastsignin ? new Date(airtableUser.Lastsignin) : undefined,
      noSessions: airtableUser.Nosessions || 0,
      score: airtableUser.Score || 0
    };
  }

  /**
   * Convert internal User format to Airtable format
   * @param user - Internal User object
   * @param passwordHash - Password hash for new users
   * @param salt - Salt for new users
   * @returns Airtable user format
   */
  static mapToAirtableUser(user: Partial<User>, passwordHash?: string, salt?: string): Partial<AirtableUser> {
    return {
      Name: user.username, // Username goes to Name field
      Email: user.email,
      Passwordhash: passwordHash || '', // Note: lowercase 'h' in Airtable
      Salt: salt || '',
      Lastsignin: user.lastSignIn?.toISOString(),
      Nosessions: user.noSessions || 0,
      Score: user.score || 0
    };
  }

  /**
   * Hash a password with salt
   * @param password - Plain text password
   * @returns Object with hash and salt
   */
  static async hashPassword(password: string): Promise<{ hash: string; salt: string }> {
    // Generate a random salt
    const salt = this.generateSalt();
    
    // Simple hash function (in production, use bcrypt or similar)
    const hash = this.simpleHash(password + salt);
    
    return { hash, salt };
  }

  /**
   * Verify a password against stored hash and salt
   * @param password - Plain text password
   * @param hash - Stored password hash
   * @param salt - Stored salt
   * @returns True if password matches
   */
  static async verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
    const computedHash = this.simpleHash(password + salt);
    return computedHash === hash;
  }

  /**
   * Generate a random salt
   * @returns Random salt string
   */
  private static generateSalt(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Simple hash function (for demo purposes)
   * In production, use bcrypt, scrypt, or Argon2
   * @param input - String to hash
   * @returns Hashed string
   */
  private static simpleHash(input: string): string {
    let hash = 0;
    if (input.length === 0) return hash.toString();
    
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  /**
   * Validate username format
   * @param username - Username to validate
   * @returns Validation result
   */
  static validateUsername(username: string): { isValid: boolean; error?: string } {
    if (!username || username.trim().length < 3) {
      return { isValid: false, error: 'Username must be at least 3 characters long' };
    }
    
    if (username.length > 20) {
      return { isValid: false, error: 'Username must be less than 20 characters' };
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return { isValid: false, error: 'Username can only contain letters, numbers, and underscores' };
    }
    
    return { isValid: true };
  }

  /**
   * Validate email format
   * @param email - Email to validate
   * @returns Validation result
   */
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || !emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    
    return { isValid: true };
  }

  /**
   * Validate password strength
   * @param password - Password to validate
   * @returns Validation result
   */
  static validatePassword(password: string): { isValid: boolean; error?: string } {
    if (!password || password.length < 6) {
      return { isValid: false, error: 'Password must be at least 6 characters long' };
    }
    
    if (password.length > 128) {
      return { isValid: false, error: 'Password must be less than 128 characters' };
    }
    
    return { isValid: true };
  }

  /**
   * Store user session in localStorage
   * @param user - User object to store
   */
  static storeUserSession(user: User): void {
    const sessionData = {
      user,
      timestamp: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    
    localStorage.setItem('userSession', JSON.stringify(sessionData));
  }

  /**
   * Get current user session from localStorage
   * @returns User object if session is valid, null otherwise
   */
  static getCurrentUser(): User | null {
    try {
      const sessionData = localStorage.getItem('userSession');
      if (!sessionData) return null;
      
      const session = JSON.parse(sessionData);
      
      // Check if session has expired
      if (session.expiresAt < Date.now()) {
        this.clearUserSession();
        return null;
      }
      
      return session.user;
    } catch (error) {
      this.clearUserSession();
      return null;
    }
  }

  /**
   * Clear user session from localStorage
   */
  static clearUserSession(): void {
    localStorage.removeItem('userSession');
  }

  /**
   * Check if user is authenticated
   * @returns True if user has valid session
   */
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Update last sign in time
   * @param userId - User ID
   */
  static async updateLastSignIn(userId: string): Promise<void> {
    // This will be implemented when we add Airtable integration
    // For now, just update the local session
    const user = this.getCurrentUser();
    if (user && user.id === userId) {
      user.lastSignIn = new Date();
      this.storeUserSession(user);
    }
  }
}

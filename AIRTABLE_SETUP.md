# Airtable Integration Setup

## Prerequisites

1. **Airtable Account**: You need an Airtable account with your database set up
2. **Airtable Package**: Install the Airtable package in your Replit environment

## Installation

### 1. Install Airtable Package

In your Replit terminal, run:
```bash
npm install airtable
```

### 2. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
REACT_APP_AIRTABLE_API_KEY=your_airtable_api_key_here
REACT_APP_AIRTABLE_BASE_ID=your_airtable_base_id_here
```

### 3. Get Your Airtable Credentials

#### API Key
1. Go to [Airtable Account](https://airtable.com/account)
2. Click on "API" in the left sidebar
3. Copy your API key

#### Base ID
1. Open your Airtable base
2. Look at the URL: `https://airtable.com/appXXXXXXXXXXXXXX`
3. Copy the part after `/app/` - this is your Base ID

## Database Schema

### Users Table
| Field Name | Type | Description |
|------------|------|-------------|
| Userid | Formula (`=recordid()`) | Auto-generated unique ID |
| Name | Single line text | Username for login |
| Email | Email | User's email address |
| Passwordhash | Single line text | Hashed password |
| Salt | Single line text | Password salt |
| Createdat | Date (incl time) | Auto-generated creation date |
| Lastsignin | Date (incl time) | Last sign-in timestamp |
| Nosessions | Number | Total completed sessions |
| Score | Number | Total puzzles solved |

### Sessions Table
| Field Name | Type | Description |
|------------|------|-------------|
| Sessionid | Formula (`=recordid()`) | Auto-generated unique ID |
| Userid | Linked to record (User) | Reference to user |
| Createdat | Date (incl time) | Auto-generated creation date |
| Score | Number | 1 if won, 0 if failed/not completed |

## Features

### Authentication
- **User Registration**: Creates new users with hashed passwords
- **User Login**: Authenticates users against stored credentials
- **Session Management**: Tracks user sessions and login times

### Game Integration
- **Daily Sessions**: Creates one session per user per day
- **Progress Tracking**: Records game completion status
- **Statistics**: Updates user scores and session counts

### Security
- **Password Hashing**: Passwords are hashed with salt before storage
- **Input Validation**: All user inputs are validated
- **Error Handling**: Comprehensive error handling for all operations

## Testing

### Demo Mode
If Airtable is not configured, the app will fall back to demo mode:
- **Demo Login**: Username: `demo`, Password: `demo123`
- **Demo Registration**: Any credentials will work

### Production Mode
Once Airtable is configured:
- Real user registration and authentication
- Persistent data storage
- Session tracking and statistics

## Troubleshooting

### Common Issues

1. **"Airtable not configured" error**
   - Check that environment variables are set correctly
   - Verify API key and Base ID are correct

2. **"Failed to create user" error**
   - Check that all required fields exist in your Users table
   - Verify field names match exactly (case-sensitive)

3. **"Authentication failed" error**
   - Check API key permissions
   - Verify Base ID is correct

### Debug Mode
Check the browser console for detailed error messages and logs.

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your API key secure and don't share it publicly
- Consider using environment variables in production deployments

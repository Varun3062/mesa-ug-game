# Quick Setup Guide - Airtable to Replit

## 🚀 Fast Setup

### Option 1: Run Setup Script (Recommended)
```bash
npm run setup-airtable
```

### Option 2: Manual Setup

#### For Replit:
1. **Go to your Replit workspace**
2. **Click "Tools" → "Secrets"**
3. **Add these secrets:**

**Secret 1:**
- Key: `REACT_APP_AIRTABLE_API_KEY`
- Value: `patChpK6g65ZJymi2.0c43cdb7646e4863d435372778cc3b0b9ffa59f5fec48df9a6022932b8126182`

**Secret 2:**
- Key: `REACT_APP_AIRTABLE_BASE_ID`
- Value: `appYRYGNKDxOFjJUl`

4. **Restart your Replit workspace**
5. **Install Airtable package:**
   ```bash
   npm install airtable
   ```
6. **Start the app:**
   ```bash
   npm start
   ```

#### For Local Development:
1. **Create `.env.local` file** in project root
2. **Add this content:**
   ```env
   REACT_APP_AIRTABLE_API_KEY=patChpK6g65ZJymi2.0c43cdb7646e4863d435372778cc3b0b9ffa59f5fec48df9a6022932b8126182
   REACT_APP_AIRTABLE_BASE_ID=appYRYGNKDxOFjJUl
   ```
3. **Install Airtable package:**
   ```bash
   npm install airtable
   ```
4. **Start the app:**
   ```bash
   npm start
   ```

## ✅ Verification

Once set up, you should see:
- **Real user registration** (creates users in Airtable)
- **Real user authentication** (verifies against Airtable)
- **Session tracking** (records game sessions)
- **Statistics updates** (updates user scores)

## 🔗 Your Airtable Base

**Base URL:** https://airtable.com/appYRYGNKDxOFjJUl

**Tables:**
- **Users** - User accounts and statistics
- **Sessions** - Daily game sessions

## 🎯 Test Credentials

**Demo Mode** (if Airtable not configured):
- Username: `demo`
- Password: `demo123`

**Production Mode** (with Airtable):
- Create any account - it will be stored in Airtable
- Login with your created credentials

## 🆘 Troubleshooting

**If you see "Airtable not configured":**
1. Check that environment variables are set correctly
2. Restart your development server
3. Verify API key and Base ID are correct

**If authentication fails:**
1. Check browser console for error messages
2. Verify your Airtable base has the correct table structure
3. Ensure field names match exactly (case-sensitive)

#!/usr/bin/env node

/**
 * Airtable Setup Script
 * This script helps configure Airtable credentials for the Cows & Bulls game
 */

const fs = require('fs');
const path = require('path');

// Airtable credentials
const AIRTABLE_CONFIG = {
  apiKey: 'patChpK6g65ZJymi2.0c43cdb7646e4863d435372778cc3b0b9ffa59f5fec48df9a6022932b8126182',
  baseId: 'appYRYGNKDxOFjJUl'
};

console.log('🐄 Cows & Bulls - Airtable Setup 🐂\n');

// Check if we're in Replit
const isReplit = process.env.REPL_ID || process.env.REPL_OWNER;

if (isReplit) {
  console.log('📍 Detected Replit environment');
  console.log('\n📋 To configure Airtable in Replit:');
  console.log('1. Go to your Replit workspace');
  console.log('2. Click on "Tools" in the left sidebar');
  console.log('3. Click on "Secrets"');
  console.log('4. Add these two secrets:\n');
  
  console.log('Secret 1:');
  console.log('  Key: REACT_APP_AIRTABLE_API_KEY');
  console.log(`  Value: ${AIRTABLE_CONFIG.apiKey}\n`);
  
  console.log('Secret 2:');
  console.log('  Key: REACT_APP_AIRTABLE_BASE_ID');
  console.log(`  Value: ${AIRTABLE_CONFIG.baseId}\n`);
  
  console.log('5. Restart your Replit workspace');
  console.log('6. Run: npm install airtable');
  console.log('7. Run: npm start');
  
} else {
  console.log('📍 Detected local environment');
  
  const envPath = path.join(process.cwd(), '.env.local');
  
  try {
    // Create .env.local file
    const envContent = `# Airtable Configuration
REACT_APP_AIRTABLE_API_KEY=${AIRTABLE_CONFIG.apiKey}
REACT_APP_AIRTABLE_BASE_ID=${AIRTABLE_CONFIG.baseId}
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env.local file with Airtable credentials');
    
    console.log('\n📋 Next steps:');
    console.log('1. Install Airtable package: npm install airtable');
    console.log('2. Restart your development server: npm start');
    console.log('3. Test the authentication system');
    
  } catch (error) {
    console.error('❌ Error creating .env.local file:', error.message);
    console.log('\n📋 Manual setup:');
    console.log('1. Create a file named .env.local in your project root');
    console.log('2. Add the following content:');
    console.log(`   REACT_APP_AIRTABLE_API_KEY=${AIRTABLE_CONFIG.apiKey}`);
    console.log(`   REACT_APP_AIRTABLE_BASE_ID=${AIRTABLE_CONFIG.baseId}`);
  }
}

console.log('\n🎯 Your Airtable credentials:');
console.log(`   API Key: ${AIRTABLE_CONFIG.apiKey}`);
console.log(`   Base ID: ${AIRTABLE_CONFIG.baseId}`);

console.log('\n🔗 Airtable Base URL:');
console.log(`   https://airtable.com/${AIRTABLE_CONFIG.baseId}`);

console.log('\n✨ Setup complete! Your game is ready for Airtable integration.');

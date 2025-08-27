# Mesa UG Game

A single player web game built with React and TypeScript, optimized for Replit hosting.

## Features

- Modern, responsive UI design
- Game state management with React hooks
- TypeScript for type safety
- PWA-ready structure
- Mobile-friendly design
- Optimized for Replit hosting

## Getting Started

### Option 1: Running on Replit (Recommended)

1. **Fork this repository** or create a new Replit project
2. **Import the code** into your Replit workspace
3. **Install dependencies** by running in the Replit shell:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm start
   ```
5. **View your app** in the Replit webview or use the "Open in new tab" button

### Option 2: Local Development

#### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

#### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mesa-ug-game
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open in your browser at `http://localhost:3000`.

### Available Scripts

- `npm start` - Runs the app in development mode (optimized for Replit)
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Replit Configuration

This project includes special configuration files for Replit:

- `.replit` - Specifies the run command and environment settings
- `replit.nix` - Defines the required system dependencies
- Updated `package.json` with Replit-optimized start script

## Project Structure

```
src/
├── components/
│   ├── Game.tsx          # Main game component
│   └── Game.css          # Game component styles
├── App.tsx               # Main app component
├── App.css               # App component styles
├── index.tsx             # App entry point
├── index.css             # Global styles
└── reportWebVitals.ts    # Performance monitoring
```

## Game Features

- **Game State Management**: Tracks score, level, and game status
- **Control System**: Start, pause, resume, and reset functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Beautiful gradients and animations

## Future Enhancements

- Airtable integration for data storage
- More complex game mechanics
- Sound effects and animations
- Leaderboard system
- Multiple game modes

## Technologies Used

- React 18
- TypeScript
- CSS3 with modern features
- Create React App
- Optimized for Replit hosting

## Troubleshooting on Replit

### Common Issues:

1. **Port Issues**: The app is configured to run on port 3000 by default
2. **Dependencies**: Make sure to run `npm install` first
3. **Browser**: The app will open in Replit's webview automatically
4. **Hot Reload**: Changes will automatically reload in the webview

### If the app doesn't start:

1. Check the console for error messages
2. Try running `npm install` again
3. Restart the Replit workspace
4. Check if all files are properly uploaded

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

# Snake IO - Earn While Playing! 🐍💰

A multiplayer Snake IO game with monetization features similar to JustPlay, where players can earn coins by watching advertisements during gameplay.

![Game Screenshot](https://github.com/user-attachments/assets/8ab6e9c3-67ab-420c-8f3d-be5f98ead068)

## Features ✨

### 🎮 Core Gameplay
- **Classic Snake IO mechanics** - Navigate your snake using WASD or Arrow keys
- **Multiplayer simulation** - Play alongside AI-controlled snakes for an IO game experience
- **Real-time scoring** - Earn points by eating food items
- **Special food items** - Gold food provides bonus points and coins

### 💰 Monetization System
- **Watch ads to earn coins** - Click "Watch Ad" button to watch 5-second advertisements
- **Revive with ads** - Continue playing after game over by watching an ad
- **Persistent coin storage** - Your coins are saved locally and persist between sessions
- **Real-time notifications** - Get instant feedback when earning coins

### 🔥 Game Features
- **Players online counter** - Shows simulated multiplayer activity
- **Responsive design** - Works on desktop and mobile devices
- **Beautiful UI** - Modern gradient design with smooth animations
- **Game over system** - Comprehensive end-game experience with revival options

## How to Play 🕹️

1. **Movement**: Use WASD or Arrow keys to control your snake
2. **Eat food**: Navigate to red food items to grow and increase your score
3. **Avoid collisions**: Don't hit walls, yourself, or other players
4. **Earn coins**: 
   - Watch ads anytime during gameplay (+10 coins)
   - Eat special golden food items (+1 coin)
   - Watch revive ads after game over (+5 coins)

## Screenshots 📸

**Initial Game State:**
![Initial Game](https://github.com/user-attachments/assets/8ab6e9c3-67ab-420c-8f3d-be5f98ead068)

**After Earning Coins:**
![After Monetization](https://github.com/user-attachments/assets/b1c5df25-914e-4e58-9f69-2f7e82038ce4)

## Quick Start 🚀

1. Clone the repository:
   ```bash
   git clone https://github.com/asume21/Snack-game.git
   cd Snack-game
   ```

2. Start the local server:
   ```bash
   npm start
   # or
   python3 -m http.server 8000
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

4. Start playing and earning coins!

## Technical Details 🔧

### Built With
- **HTML5 Canvas** - For game rendering
- **Vanilla JavaScript** - Core game logic and ad system
- **CSS3** - Modern styling with gradients and animations
- **Local Storage** - Persistent coin and progress tracking

### File Structure
```
├── index.html          # Main game page
├── style.css           # Game styling and UI
├── game.js             # Core snake game logic
├── ads.js              # Monetization and ad system
├── package.json        # Project configuration
└── README.md           # This file
```

### Game Architecture
- **SnakeGame class** - Handles game logic, rendering, and player input
- **AdSystem class** - Manages advertisement display, coin rewards, and persistence
- **Modular design** - Separate concerns for maintainability

## Monetization Features 💎

- **Ad Integration Ready** - Mock ad system that can be easily replaced with real ad networks
- **Analytics Tracking** - Built-in event tracking for ad impressions and completions
- **Flexible Rewards** - Configurable coin rewards for different actions
- **User Engagement** - Multiple touchpoints for ad interaction throughout gameplay

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

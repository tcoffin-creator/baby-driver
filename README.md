# 🚗 Baby Driver

Educational driving game to teach kids (ages 5-10) the rules of the road with enhanced graphics, responsive design, and comprehensive road systems.

## ✨ Features

### Core Gameplay
- 🚦 **Enhanced Traffic Lights**: Realistic pulsing lights with proper timing cycles
- 🛑 **Stop Signs**: Properly placed at road edges (not in lane centers)
- 💡 **Turn Signals**: Use blinkers before changing lanes with visual feedback
- 🛣️ **Road System**: Support for straight roads, curves, T-intersections, and cross-intersections
- 🎯 **Crosswalks & Stop Lines**: Visible at all intersections for realistic road experience
- ✅ **Scoring System**: Earn points for following the rules
- ❌ **Violation Tracking**: Learn from mistakes with clear feedback

### User Interface & Controls
- 📱 **Enhanced Touch Controls**: Configurable floating controls for mobile/tablet
- 🎮 **Keyboard Controls**: Full arrow key support with Q/E for blinkers
- 📖 **Interactive Tutorial**: First-time onboarding with persistent help button
- 📊 **Real-time HUD**: Score, violations, and contextual messages
- 🖥️ **Responsive Design**: Adapts to any screen size without scrollbars

### Graphics & Performance
- 🎨 **High-DPI Support**: Automatic retina/high-resolution asset loading
- 🌟 **Visual Polish**: Pulsing traffic lights, smooth animations, proper z-ordering
- 🎭 **Optional Post-Processing**: Bloom effects for enhanced visuals (configurable)
- ⚡ **Optimized Rendering**: Maintains 60 FPS on desktop, 30+ FPS on mobile
- 🗺️ **Asset Pipeline**: Texture atlas support for efficient loading

## 🎮 How to Play

### Desktop
- **Arrow Keys**: Drive your car (Up=accelerate, Down=brake, Left/Right=change lanes)
- **Q**: Activate left turn signal
- **E**: Activate right turn signal  
- **W**: Turn signals off
- **?** Button: Open help/tutorial anytime

### Mobile/Tablet
- Use the floating touch control buttons on the right side of the screen
- Tap blinker buttons at the bottom to signal turns
- Tap **?** button in top-right corner for help

### Getting Started
1. Clone the repository
2. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)
3. Tutorial will appear automatically on first visit
4. Start driving and follow the rules!

**Or use the built-in web server:**
```bash
npm install
npm start
# Open http://localhost:8000
```

## 📋 Rules to Learn

- 🛑 Always come to a **complete stop** at stop signs (speed must reach 0)
- 🚦 Stop at **red and yellow** traffic lights
- 🟢 Go when the light is **green**
- 💡 Use your **turn signal** before changing lanes
- 🎯 Stay in your lane and follow road markings
- 🚸 Watch for crosswalks at intersections

## 🏗️ Architecture

### Project Structure
```
baby-driver/
├── index.html              # Main HTML file
├── game.js                 # Original game (fallback)
├── game-enhanced.js        # Enhanced game engine with ES6 modules
├── styles.css              # Base styles
├── package.json            # Build scripts and metadata
├── PLAYTEST.md            # QA checklist and test procedures
├── src/
│   ├── ui/
│   │   ├── responsive.js   # Responsive canvas manager
│   │   ├── touch-controls.js # Touch control system
│   │   ├── tutorial.js     # Tutorial/help system
│   │   └── styles.css      # UI-specific styles
│   ├── road/
│   │   ├── roadTiles.js    # Tile type definitions
│   │   ├── roadGenerator.js # Road generation system
│   │   ├── roadRenderer.js  # Road rendering with crosswalks
│   │   └── lane.js         # Lane management
│   ├── traffic/
│   │   ├── trafficLight.js # Enhanced traffic lights
│   │   └── signs.js        # Sign placement system
│   ├── render/
│   │   └── bloom.js        # Post-processing effects
│   └── loader.js           # Asset loading system
├── assets/
│   ├── atlas.json          # Asset mapping
│   ├── pack-atlas.js       # Texture packing script
│   ├── *.png               # Standard resolution assets
│   └── highres/
│       └── *.png           # High-DPI assets (2x)
└── tests/
    └── smoke/
        └── playtest-smoke.js # Automated tests
```

## 🧪 Testing

### Run Automated Tests
```bash
npm test
```

### Manual Playtest
See [PLAYTEST.md](PLAYTEST.md) for comprehensive testing checklist and procedures.

## 🛠️ Technologies

- **ES6+ JavaScript**: Modern module system with classes
- **HTML5 Canvas**: Hardware-accelerated 2D rendering
- **CSS3**: Responsive design with flexbox and viewport units
- **Web APIs**: localStorage for tutorial tracking, devicePixelRatio for HiDPI
- **Node.js**: Build scripts and testing (optional, no runtime dependency)

## 🚀 Build & Deploy

### Development
```bash
npm run dev        # Start local server on port 8000
```

### Production
```bash
npm run build      # Pack texture atlases
npm run test       # Run smoke tests
```

### Browser Support
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari (desktop and iOS)
- ✅ Modern mobile browsers
- ⚠️ IE11 not supported (uses ES6 modules)

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

This is an educational project. Contributions welcome! Please ensure:
- Code follows existing style
- All tests pass (`npm test`)
- Manual playtest completed (see PLAYTEST.md)
- Screenshots provided for visual changes

## 📸 Screenshots

See the following screenshots demonstrating key features:
- Tutorial modal with controls
- Game running with touch controls visible
- Blinker activation with feedback message
- Traffic lights with pulsing effect
- Intersections with crosswalks and stop lines

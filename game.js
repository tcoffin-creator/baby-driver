/**
 * Baby Driver - Main Game Entry Point
 * Integrates all modular components from src/
 */

import { ResponsiveCanvas } from './src/ui/responsive.js';
import { TouchControls } from './src/ui/touch-controls.js';
import { Tutorial } from './src/ui/tutorial.js';
import { RoadGenerator } from './src/road/roadGenerator.js';
import { RoadRenderer } from './src/road/roadRenderer.js';
import { LaneHelper } from './src/road/lane.js';
import { StopSign, SignSpawner } from './src/traffic/signs.js';
import { TrafficLight } from './src/traffic/trafficLight.js';
import { BloomEffect } from './src/render/bloom.js';
import { assetLoader } from './src/loader-highres.js';

// Get DOM elements
const CANVAS = document.getElementById('game-canvas');
const CTX = CANVAS.getContext('2d');
const MESSAGES = document.getElementById('game-messages');
const SCORE_DISPLAY = document.getElementById('score');
const VIOLATIONS_DISPLAY = document.getElementById('violations');

// Initialize responsive canvas system
const responsiveCanvas = new ResponsiveCanvas(CANVAS);
const canvasSize = responsiveCanvas.getLogicalSize();

// Initialize UI modules
const touchControls = new TouchControls({ enabled: true });
const tutorial = new Tutorial();
const bloomEffect = new BloomEffect(false); // Disabled by default for performance

// Initialize road system
const laneHelper = new LaneHelper(canvasSize.width, 3);
const roadGenerator = new RoadGenerator({ 
    tileSize: 200, 
    width: 3, 
    initialLength: 10 
});
const roadRenderer = new RoadRenderer(CTX, canvasSize.width, canvasSize.height);
const signSpawner = new SignSpawner(laneHelper);

// Initialize road tiles
const roadTiles = roadGenerator.generate();

// Game State
const game = {
    score: 0,
    violations: 0,
    player: {
        x: 0,
        y: 0,
        width: 40,
        height: 60,
        speed: 0,
        maxSpeed: 5,
        lane: 1, // 0, 1, 2 (left, center, right)
        blinker: 'off', // 'off', 'left', 'right'
        color: '#4CAF50'
    },
    keys: {},
    touchInput: {
        up: false,
        down: false,
        left: false,
        right: false
    },
    trafficLights: [],
    stopSigns: [],
    roadOffset: 0,
    lastViolationCheck: 0,
    messageTimeout: null,
    laneHelper: laneHelper
};

// Initialize player position using lane helper
game.player.x = laneHelper.getLaneCenter(game.player.lane);
game.player.y = canvasSize.height - 100;

// Setup touch control handlers
touchControls.on('accelerate', (pressed) => { game.touchInput.up = pressed; });
touchControls.on('brake', (pressed) => { game.touchInput.down = pressed; });
touchControls.on('left', (pressed) => { game.touchInput.left = pressed; });
touchControls.on('right', (pressed) => { game.touchInput.right = pressed; });

// Traffic Light and Stop Sign classes now imported from modules

// Initialize game objects
function initializeGame() {
    // Create traffic lights at intervals using enhanced TrafficLight class
    for (let i = 0; i < 3; i++) {
        const y = -500 - (i * 800);
        const lane = Math.floor(Math.random() * 3);
        const laneX = laneHelper.getLaneCenter(lane);
        game.trafficLights.push(new TrafficLight(laneX, y, lane));
    }
    
    // Create stop signs using SignSpawner for curb-edge placement
    for (let i = 0; i < 5; i++) {
        const y = -300 - (i * 600);
        const lane = Math.floor(Math.random() * 3);
        signSpawner.spawnSign(y, lane);
    }
    game.stopSigns = signSpawner.signs;
}

// Input Handling
document.addEventListener('keydown', (e) => {
    game.keys[e.key] = true;
    
    // Blinker controls
    if (e.key === 'q' || e.key === 'Q') {
        setBlinker('left');
    } else if (e.key === 'e' || e.key === 'E') {
        setBlinker('right');
    } else if (e.key === 'w' || e.key === 'W') {
        setBlinker('off');
    }
});

document.addEventListener('keyup', (e) => {
    game.keys[e.key] = false;
});

// Legacy button controls setup (keeping existing HTML buttons functional)
function setupTouchControls() {
    const btnUp = document.getElementById('btn-up');
    const btnDown = document.getElementById('btn-down');
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    const btnBlinkerLeft = document.getElementById('blinker-left');
    const btnBlinkerRight = document.getElementById('blinker-right');
    const btnBlinkerOff = document.getElementById('blinker-off');
    
    if (!btnUp) return; // Exit if buttons don't exist
    
    // D-pad buttons
    ['mousedown', 'touchstart'].forEach(event => {
        btnUp.addEventListener(event, (e) => { e.preventDefault(); game.touchInput.up = true; });
        btnDown.addEventListener(event, (e) => { e.preventDefault(); game.touchInput.down = true; });
        btnLeft.addEventListener(event, (e) => { e.preventDefault(); game.touchInput.left = true; });
        btnRight.addEventListener(event, (e) => { e.preventDefault(); game.touchInput.right = true; });
    });
    
    ['mouseup', 'touchend', 'touchcancel'].forEach(event => {
        btnUp.addEventListener(event, (e) => { e.preventDefault(); game.touchInput.up = false; });
        btnDown.addEventListener(event, (e) => { e.preventDefault(); game.touchInput.down = false; });
        btnLeft.addEventListener(event, (e) => { e.preventDefault(); game.touchInput.left = false; });
        btnRight.addEventListener(event, (e) => { e.preventDefault(); game.touchInput.right = false; });
    });
    
    // Blinker buttons
    btnBlinkerLeft.addEventListener('click', () => setBlinker('left'));
    btnBlinkerRight.addEventListener('click', () => setBlinker('right'));
    btnBlinkerOff.addEventListener('click', () => setBlinker('off'));
}

function setBlinker(direction) {
    game.player.blinker = direction;
    
    // Update button visuals
    document.getElementById('blinker-left').classList.toggle('active', direction === 'left');
    document.getElementById('blinker-right').classList.toggle('active', direction === 'right');
    
    if (direction !== 'off') {
        showMessage(`${direction === 'left' ? '⬅️' : '➡️'} Blinker ON - Good job!`, 'good', 2000);
    }
}

// Message Display
function showMessage(text, type, duration = 3000) {
    MESSAGES.textContent = text;
    MESSAGES.className = type;
    
    if (game.messageTimeout) clearTimeout(game.messageTimeout);
    
    game.messageTimeout = setTimeout(() => {
        MESSAGES.textContent = '';
        MESSAGES.className = '';
    }, duration);
}

// Game Update Logic
function update() {
    // Handle input (keyboard and touch)
    const isAccelerating = game.keys['ArrowUp'] || game.touchInput.up;
    const isBraking = game.keys['ArrowDown'] || game.touchInput.down;
    const isMovingLeft = game.keys['ArrowLeft'] || game.touchInput.left;
    const isMovingRight = game.keys['ArrowRight'] || game.touchInput.right;
    
    // Update speed
    if (isAccelerating && game.player.speed < game.player.maxSpeed) {
        game.player.speed += 0.2;
    } else if (isBraking && game.player.speed > 0) {
        game.player.speed -= 0.4;
    } else if (!isAccelerating && !isBraking) {
        // Natural deceleration
        game.player.speed *= 0.98;
        if (game.player.speed < 0.1) game.player.speed = 0;
    }
    
    // Update road offset (scrolling effect)
    game.roadOffset += game.player.speed;
    
    // Lane changing using lane helper
    const targetX = laneHelper.getLaneCenter(game.player.lane);
    
    if (isMovingLeft && Math.abs(game.player.x - targetX) < 5) {
        if (game.player.lane > 0) {
            // Check for blinker before lane change
            if (game.player.blinker !== 'left') {
                addViolation('Use left blinker before changing lanes!');
            } else {
                addScore(5, 'Used blinker correctly!');
            }
            game.player.lane--;
        }
    } else if (isMovingRight && Math.abs(game.player.x - targetX) < 5) {
        if (game.player.lane < 2) {
            // Check for blinker before lane change
            if (game.player.blinker !== 'right') {
                addViolation('Use right blinker before changing lanes!');
            } else {
                addScore(5, 'Used blinker correctly!');
            }
            game.player.lane++;
        }
    }
    
    // Smooth lane transition
    const newTargetX = laneHelper.getLaneCenter(game.player.lane);
    if (game.player.x < newTargetX) {
        game.player.x += 3;
    } else if (game.player.x > newTargetX) {
        game.player.x -= 3;
    }
    
    // Update traffic lights
    game.trafficLights.forEach(light => {
        light.update();
        
        // Recycle lights that have passed
        const drawY = light.y + game.roadOffset;
        if (drawY > canvasSize.height + 200) {
            light.y = -800;
            light.lane = Math.floor(Math.random() * 3);
            light.x = laneHelper.getLaneCenter(light.lane);
        }
    });
    
    // Update road tiles and signs
    roadGenerator.update(game.roadOffset);
    signSpawner.update(game.roadOffset, canvasSize.height);
    
    // Spawn new stop signs as needed
    if (Math.random() < 0.01) { // 1% chance per frame
        const y = -600;
        signSpawner.spawnSign(y);
    }
    game.stopSigns = signSpawner.signs;
    
    // Check for violations
    checkTrafficRules();
}

function checkTrafficRules() {
    const now = Date.now();
    if (now - game.lastViolationCheck < 1000) return; // Check once per second
    
    // Check traffic lights using enhanced collision detection
    game.trafficLights.forEach(light => {
        const drawY = light.y + game.roadOffset;
        
        // Use traffic light's built-in collision detection
        if (light.checkCollision(game.player.x, drawY - game.player.y, game.player.lane)) {
            if (light.shouldStop() && game.player.speed > 0.5) {
                addViolation(`🚦 Ran a ${light.state} light!`);
                game.lastViolationCheck = now;
            } else if (light.state === 'green' && game.player.speed > 0) {
                // Reward for properly going through green light
                addScore(2, '✅ Green light - nice!');
                game.lastViolationCheck = now;
            }
        }
    });
    
    // Check stop signs using enhanced collision detection
    game.stopSigns.forEach(sign => {
        const drawY = sign.y + game.roadOffset;
        
        if (sign.checkCollision(game.player.x, game.player.y, game.player.lane)) {
            if (game.player.speed < 0.3) {
                sign.stoppedFrames++;
                if (sign.stoppedFrames === 30 && !sign.playerStopped) {
                    sign.playerStopped = true;
                    addScore(10, '🛑 Stopped at STOP sign - great!');
                    game.lastViolationCheck = now;
                }
            } else if (!sign.playerStopped && drawY > game.player.y - 30) {
                addViolation('🛑 Ran STOP sign!');
                sign.playerStopped = true; // Avoid multiple violations
                game.lastViolationCheck = now;
            }
        }
    });
}

function addScore(points, message) {
    game.score += points;
    SCORE_DISPLAY.textContent = game.score;
    if (message) showMessage(message, 'good', 2000);
}

function addViolation(message) {
    game.violations++;
    VIOLATIONS_DISPLAY.textContent = game.violations;
    if (message) showMessage(message, 'bad', 3000);
}

// Drawing Functions
function draw() {
    // Use road renderer for tiles, intersections, and lane markings
    roadRenderer.drawRoad(roadTiles, game.roadOffset);
    
    // Draw traffic lights
    game.trafficLights.forEach(light => {
        light.draw(CTX, game.roadOffset);
    });
    
    // Draw stop signs via sign spawner
    signSpawner.draw(CTX, game.roadOffset);
    
    // Draw player car
    drawCar();
    
    // Apply bloom effect if enabled
    if (bloomEffect.enabled) {
        bloomEffect.apply(CTX, CANVAS);
    }
}

function drawCar() {
    const x = game.player.x;
    const y = game.player.y;
    const w = game.player.width;
    const h = game.player.height;
    
    // Car body
    CTX.fillStyle = game.player.color;
    CTX.fillRect(x - w / 2, y - h / 2, w, h);
    
    // Car roof
    CTX.fillStyle = '#2E7D32';
    CTX.fillRect(x - w / 2 + 5, y - h / 2, w - 10, 20);
    
    // Windows
    CTX.fillStyle = '#90CAF9';
    CTX.fillRect(x - w / 2 + 8, y - h / 2 + 3, w - 16, 7);
    CTX.fillRect(x - w / 2 + 8, y - h / 2 + 12, w - 16, 6);
    
    // Wheels
    CTX.fillStyle = '#000';
    CTX.fillRect(x - w / 2 - 3, y - h / 2 + 10, 6, 12);
    CTX.fillRect(x + w / 2 - 3, y - h / 2 + 10, 6, 12);
    CTX.fillRect(x - w / 2 - 3, y + h / 2 - 22, 6, 12);
    CTX.fillRect(x + w / 2 - 3, y + h / 2 - 22, 6, 12);
    
    // Blinkers
    if (game.player.blinker === 'left') {
        CTX.fillStyle = '#FFA500';
        CTX.beginPath();
        CTX.arc(x - w / 2 - 8, y, 6, 0, Math.PI * 2);
        CTX.fill();
    } else if (game.player.blinker === 'right') {
        CTX.fillStyle = '#FFA500';
        CTX.beginPath();
        CTX.arc(x + w / 2 + 8, y, 6, 0, Math.PI * 2);
        CTX.fill();
    }
    
    // Outline
    CTX.strokeStyle = '#000';
    CTX.lineWidth = 2;
    CTX.strokeRect(x - w / 2, y - h / 2, w, h);
}

// Game Loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Initialize and start game
setupTouchControls();
initializeGame();
showMessage('🎮 Drive safely and follow the rules! Use arrow keys or touch controls.', 'warning', 5000);
gameLoop();

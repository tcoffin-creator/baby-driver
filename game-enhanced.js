// Baby Driver - Enhanced Game Engine
// Integrates all new systems: responsive canvas, enhanced controls, improved graphics, road system, etc.

import { ResponsiveManager } from './src/ui/responsive.js';
import { TouchControls } from './src/ui/touch-controls.js';
import { Tutorial } from './src/ui/tutorial.js';
import { AssetLoader } from './src/loader.js';
import { LaneManager } from './src/road/lane.js';
import { RoadGenerator } from './src/road/roadGenerator.js';
import { RoadRenderer, IntersectionRenderer } from './src/road/roadRenderer.js';
import { EnhancedTrafficLight } from './src/traffic/trafficLight.js';
import { StopSign, SignPlacementManager } from './src/traffic/signs.js';
import { PostProcessing, BloomEffect } from './src/render/bloom.js';

// Game state
class BabyDriverGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Initialize managers
        this.responsive = new ResponsiveManager(this.canvas);
        this.tutorial = new Tutorial();
        this.assetLoader = new AssetLoader();
        
        // Get logical dimensions
        const dims = this.responsive.getLogicalDimensions();
        this.width = dims.width;
        this.height = dims.height;
        
        this.laneManager = new LaneManager(this.width, 3);
        this.roadGenerator = new RoadGenerator({ tileSize: 200 });
        this.roadRenderer = new RoadRenderer(this.canvas);
        this.intersectionRenderer = new IntersectionRenderer(this.roadRenderer);
        this.signPlacementManager = new SignPlacementManager(this.laneManager);
        
        // Post-processing effects
        this.postProcessing = new PostProcessing(this.canvas, {
            bloom: { enabled: false, intensity: 0.2 }
        });
        
        // Touch controls
        this.touchControls = new TouchControls({
            enabled: true,
            size: 70,
            opacity: 0.8
        });
        
        // Game state
        this.score = 0;
        this.violations = 0;
        this.roadOffset = 0;
        this.lastViolationCheck = 0;
        this.messageTimeout = null;
        
        // Player
        this.player = {
            x: this.width / 2,
            y: this.height - 100,
            width: 40,
            height: 60,
            speed: 0,
            maxSpeed: 5,
            lane: 1,
            blinker: 'off',
            color: '#4CAF50'
        };
        
        // Input state
        this.keys = {};
        
        // Game objects
        this.trafficLights = [];
        this.stopSigns = [];
        this.intersections = [];
        
        // UI elements
        this.scoreDisplay = document.getElementById('score');
        this.violationsDisplay = document.getElementById('violations');
        this.messagesDisplay = document.getElementById('game-messages');
        
        // Setup
        this.setupInputHandlers();
        this.initializeGameObjects();
        
        // Show tutorial on first run
        this.tutorial.showIfFirstTime();
        
        // Start game
        this.responsive.setGameActive(true);
        this.running = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }
    
    setupInputHandlers() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            if (e.key === 'q' || e.key === 'Q') {
                this.setBlinker('left');
            } else if (e.key === 'e' || e.key === 'E') {
                this.setBlinker('right');
            } else if (e.key === 'w' || e.key === 'W') {
                this.setBlinker('off');
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Touch controls callback
        this.touchControls.onControlChange((action, active) => {
            // This gets called when touch buttons are pressed
        });
        
        // Blinker buttons
        const btnBlinkerLeft = document.getElementById('blinker-left');
        const btnBlinkerRight = document.getElementById('blinker-right');
        const btnBlinkerOff = document.getElementById('blinker-off');
        
        if (btnBlinkerLeft) btnBlinkerLeft.addEventListener('click', () => this.setBlinker('left'));
        if (btnBlinkerRight) btnBlinkerRight.addEventListener('click', () => this.setBlinker('right'));
        if (btnBlinkerOff) btnBlinkerOff.addEventListener('click', () => this.setBlinker('off'));
    }
    
    setBlinker(direction) {
        this.player.blinker = direction;
        
        const btnLeft = document.getElementById('blinker-left');
        const btnRight = document.getElementById('blinker-right');
        
        if (btnLeft) btnLeft.classList.toggle('active', direction === 'left');
        if (btnRight) btnRight.classList.toggle('active', direction === 'right');
        
        if (direction !== 'off') {
            this.showMessage(
                `${direction === 'left' ? '⬅️' : '➡️'} Blinker ON - Good job!`,
                'good',
                2000
            );
        }
    }
    
    initializeGameObjects() {
        // Create traffic lights
        for (let i = 0; i < 3; i++) {
            const y = -500 - (i * 800);
            const lane = Math.floor(Math.random() * 3);
            const x = this.laneManager.getLaneX(lane);
            this.trafficLights.push(new EnhancedTrafficLight(x, y, lane));
        }
        
        // Create stop signs with proper placement
        for (let i = 0; i < 5; i++) {
            const y = -300 - (i * 600);
            const lane = Math.floor(Math.random() * 3);
            this.signPlacementManager.placeSign('stop', lane, y);
        }
        this.stopSigns = this.signPlacementManager.signs.filter(s => s.type === 'stop');
        
        // Create intersections
        for (let i = 0; i < 4; i++) {
            const y = -400 - (i * 700);
            this.intersections.push({
                y: y,
                width: this.width,
                height: 120
            });
        }
    }
    
    update(deltaTime) {
        // Get input from keyboard or touch controls
        const touchState = this.touchControls.getControls();
        const isAccelerating = this.keys['ArrowUp'] || touchState.up;
        const isBraking = this.keys['ArrowDown'] || touchState.down;
        const isMovingLeft = this.keys['ArrowLeft'] || touchState.left;
        const isMovingRight = this.keys['ArrowRight'] || touchState.right;
        
        // Update speed
        if (isAccelerating && this.player.speed < this.player.maxSpeed) {
            this.player.speed += 0.2;
        } else if (isBraking && this.player.speed > 0) {
            this.player.speed -= 0.4;
        } else if (!isAccelerating && !isBraking) {
            this.player.speed *= 0.98;
            if (this.player.speed < 0.1) this.player.speed = 0;
        }
        
        // Update road offset
        this.roadOffset += this.player.speed;
        
        // Lane changing
        const targetX = this.laneManager.getLaneX(this.player.lane);
        
        if (isMovingLeft && Math.abs(this.player.x - targetX) < 5) {
            if (this.player.lane > 0) {
                if (this.player.blinker !== 'left') {
                    this.addViolation('Use left blinker before changing lanes!');
                } else {
                    this.addScore(5, 'Used blinker correctly!');
                }
                this.player.lane--;
            }
        } else if (isMovingRight && Math.abs(this.player.x - targetX) < 5) {
            if (this.player.lane < 2) {
                if (this.player.blinker !== 'right') {
                    this.addViolation('Use right blinker before changing lanes!');
                } else {
                    this.addScore(5, 'Used blinker correctly!');
                }
                this.player.lane++;
            }
        }
        
        // Smooth lane transition
        const newTargetX = this.laneManager.getLaneX(this.player.lane);
        if (this.player.x < newTargetX) {
            this.player.x += 3;
        } else if (this.player.x > newTargetX) {
            this.player.x -= 3;
        }
        
        // Update traffic lights
        this.trafficLights.forEach(light => {
            light.update(deltaTime);
            
            const drawY = light.y + this.roadOffset;
            if (drawY > this.height + 200) {
                light.y = -800;
                light.lane = Math.floor(Math.random() * 3);
                light.x = this.laneManager.getLaneX(light.lane);
            }
        });
        
        // Update stop signs
        this.stopSigns.forEach(sign => {
            const drawY = sign.y + this.roadOffset;
            if (drawY > this.height + 200) {
                sign.y = -600;
                sign.lane = Math.floor(Math.random() * 3);
                sign.x = this.laneManager.getSignPlacementOffset(sign.lane);
                sign.reset();
            }
        });
        
        // Update intersections
        this.intersections.forEach(intersection => {
            const drawY = intersection.y + this.roadOffset;
            if (drawY > this.height + 200) {
                intersection.y = -700;
            }
        });
        
        // Check traffic rules
        this.checkTrafficRules();
        
        // Update sign placement manager
        this.signPlacementManager.update(this.roadOffset);
    }
    
    checkTrafficRules() {
        const now = Date.now();
        if (now - this.lastViolationCheck < 1000) return;
        
        // Check traffic lights
        this.trafficLights.forEach(light => {
            const drawY = light.y + this.roadOffset;
            const lightLaneX = this.laneManager.getLaneX(light.lane);
            
            if (Math.abs(this.player.x - lightLaneX) < 40 &&
                drawY > this.player.y - 80 && drawY < this.player.y) {
                
                if (light.shouldStop() && this.player.speed > 0.5) {
                    this.addViolation(`🚦 Ran a ${light.getState()} light!`);
                    this.lastViolationCheck = now;
                } else if (light.getState() === 'green' && this.player.speed > 0) {
                    this.addScore(2, '✅ Green light - nice!');
                    this.lastViolationCheck = now;
                }
            }
        });
        
        // Check stop signs
        this.stopSigns.forEach(sign => {
            const drawY = sign.y + this.roadOffset;
            const signLaneX = this.laneManager.getLaneX(sign.lane);
            
            if (Math.abs(this.player.x - signLaneX) < 40 &&
                drawY > this.player.y - 60 && drawY < this.player.y + 20) {
                
                const stopCheck = sign.checkPlayerStop(this.player.speed);
                if (stopCheck.stopped && stopCheck.complete) {
                    this.addScore(10, '🛑 Stopped at STOP sign - great!');
                    this.lastViolationCheck = now;
                } else if (!sign.playerStopped && this.player.speed > 0.3 && drawY > this.player.y - 30) {
                    this.addViolation('🛑 Ran STOP sign!');
                    sign.playerStopped = true;
                    this.lastViolationCheck = now;
                }
            }
        });
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw road
        this.roadRenderer.drawRoad(this.roadOffset, this.laneManager);
        
        // Draw intersections
        this.intersections.forEach(intersection => {
            this.roadRenderer.drawIntersection(
                0,
                intersection.y,
                intersection.width,
                intersection.height,
                this.roadOffset
            );
        });
        
        // Draw traffic lights
        this.trafficLights.forEach(light => {
            light.draw(this.ctx, this.roadOffset);
        });
        
        // Draw stop signs
        this.stopSigns.forEach(sign => {
            sign.draw(this.ctx, this.roadOffset);
        });
        
        // Draw player car
        this.drawCar();
        
        // Apply post-processing effects
        // this.postProcessing.apply(); // Disabled by default for performance
    }
    
    drawCar() {
        const x = this.player.x;
        const y = this.player.y;
        const w = this.player.width;
        const h = this.player.height;
        
        // Car body
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(x - w / 2, y - h / 2, w, h);
        
        // Car roof
        this.ctx.fillStyle = '#2E7D32';
        this.ctx.fillRect(x - w / 2 + 5, y - h / 2, w - 10, 20);
        
        // Windows
        this.ctx.fillStyle = '#90CAF9';
        this.ctx.fillRect(x - w / 2 + 8, y - h / 2 + 3, w - 16, 7);
        this.ctx.fillRect(x - w / 2 + 8, y - h / 2 + 12, w - 16, 6);
        
        // Wheels
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(x - w / 2 - 3, y - h / 2 + 10, 6, 12);
        this.ctx.fillRect(x + w / 2 - 3, y - h / 2 + 10, 6, 12);
        this.ctx.fillRect(x - w / 2 - 3, y + h / 2 - 22, 6, 12);
        this.ctx.fillRect(x + w / 2 - 3, y + h / 2 - 22, 6, 12);
        
        // Blinkers
        if (this.player.blinker === 'left') {
            this.ctx.fillStyle = '#FFA500';
            this.ctx.beginPath();
            this.ctx.arc(x - w / 2 - 8, y, 6, 0, Math.PI * 2);
            this.ctx.fill();
        } else if (this.player.blinker === 'right') {
            this.ctx.fillStyle = '#FFA500';
            this.ctx.beginPath();
            this.ctx.arc(x + w / 2 + 8, y, 6, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Outline
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x - w / 2, y - h / 2, w, h);
    }
    
    showMessage(text, type, duration = 3000) {
        if (this.messagesDisplay) {
            this.messagesDisplay.textContent = text;
            this.messagesDisplay.className = type;
            
            if (this.messageTimeout) clearTimeout(this.messageTimeout);
            
            this.messageTimeout = setTimeout(() => {
                this.messagesDisplay.textContent = '';
                this.messagesDisplay.className = '';
            }, duration);
        }
    }
    
    addScore(points, message) {
        this.score += points;
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = this.score;
        }
        if (message) this.showMessage(message, 'good', 2000);
    }
    
    addViolation(message) {
        this.violations++;
        if (this.violationsDisplay) {
            this.violationsDisplay.textContent = this.violations;
        }
        if (message) this.showMessage(message, 'bad', 3000);
    }
    
    gameLoop() {
        if (!this.running) return;
        
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 16.67; // Normalize to 60fps
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    destroy() {
        this.running = false;
        this.responsive.destroy();
        this.touchControls.destroy();
        this.tutorial.destroy();
        this.responsive.setGameActive(false);
    }
}

// Start game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.game = new BabyDriverGame();
    });
} else {
    window.game = new BabyDriverGame();
}

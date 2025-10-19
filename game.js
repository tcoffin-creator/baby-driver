// Game Constants
const CANVAS = document.getElementById('game-canvas');
const CTX = CANVAS.getContext('2d');
const MESSAGES = document.getElementById('game-messages');
const SCORE_DISPLAY = document.getElementById('score');
const VIOLATIONS_DISPLAY = document.getElementById('violations');

// Set canvas size
function resizeCanvas() {
    const container = CANVAS.parentElement;
    CANVAS.width = Math.min(800, container.clientWidth - 40);
    CANVAS.height = 500;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

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
    touchControls: {
        up: false,
        down: false,
        left: false,
        right: false
    },
    trafficLights: [],
    stopSigns: [],
    intersections: [],
    roadOffset: 0,
    lastViolationCheck: 0,
    messageTimeout: null
};

// Initialize player position
game.player.x = CANVAS.width / 2 - game.player.width / 2;
game.player.y = CANVAS.height - 100;

// Traffic Light Class
class TrafficLight {
    constructor(x, y, lane) {
        this.x = x;
        this.y = y;
        this.lane = lane; // Which lane this light controls
        this.state = 'green'; // 'red', 'yellow', 'green'
        this.timer = 0;
        this.redDuration = 180; // frames
        this.yellowDuration = 60;
        this.greenDuration = 240;
        this.width = 30;
        this.height = 80;
    }
    
    update() {
        this.timer++;
        if (this.state === 'green' && this.timer >= this.greenDuration) {
            this.state = 'yellow';
            this.timer = 0;
        } else if (this.state === 'yellow' && this.timer >= this.yellowDuration) {
            this.state = 'red';
            this.timer = 0;
        } else if (this.state === 'red' && this.timer >= this.redDuration) {
            this.state = 'green';
            this.timer = 0;
        }
    }
    
    draw(ctx, offset) {
        const drawY = this.y + offset;
        if (drawY < -100 || drawY > CANVAS.height + 100) return;
        
        // Traffic light pole
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x - 5, drawY, 10, 50);
        
        // Traffic light box
        ctx.fillStyle = '#222';
        ctx.fillRect(this.x - this.width / 2, drawY - this.height, this.width, this.height);
        
        // Lights
        const lightRadius = 10;
        const lightX = this.x;
        
        // Red light
        ctx.fillStyle = this.state === 'red' ? '#ff0000' : '#440000';
        ctx.beginPath();
        ctx.arc(lightX, drawY - 60, lightRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Yellow light
        ctx.fillStyle = this.state === 'yellow' ? '#ffff00' : '#444400';
        ctx.beginPath();
        ctx.arc(lightX, drawY - 40, lightRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Green light
        ctx.fillStyle = this.state === 'green' ? '#00ff00' : '#004400';
        ctx.beginPath();
        ctx.arc(lightX, drawY - 20, lightRadius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    shouldStop() {
        return this.state === 'red' || this.state === 'yellow';
    }
}

// Stop Sign Class
class StopSign {
    constructor(x, y, lane) {
        this.x = x;
        this.y = y;
        this.lane = lane;
        this.width = 50;
        this.height = 50;
        this.stoppedFrames = 0;
        this.playerStopped = false;
    }
    
    draw(ctx, offset) {
        const drawY = this.y + offset;
        if (drawY < -100 || drawY > CANVAS.height + 100) return;
        
        // Stop sign pole
        ctx.fillStyle = '#888';
        ctx.fillRect(this.x - 3, drawY, 6, 40);
        
        // Stop sign octagon
        ctx.fillStyle = '#ff0000';
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        const sides = 8;
        const radius = 25;
        for (let i = 0; i < sides; i++) {
            const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
            const x = this.x + radius * Math.cos(angle);
            const y = drawY - 30 + radius * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // STOP text
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('STOP', this.x, drawY - 30);
    }
}

// Intersection Class
class Intersection {
    constructor(y) {
        this.y = y;
        this.width = CANVAS.width;
        this.height = 120;
        this.requiresBlinker = true;
    }
    
    draw(ctx, offset) {
        const drawY = this.y + offset;
        if (drawY < -200 || drawY > CANVAS.height + 200) return;
        
        // Draw intersection
        ctx.fillStyle = '#555';
        ctx.fillRect(0, drawY, this.width, this.height);
        
        // Draw crosswalk
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        for (let i = 0; i < this.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, drawY);
            ctx.lineTo(i + 10, drawY);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(i, drawY + this.height);
            ctx.lineTo(i + 10, drawY + this.height);
            ctx.stroke();
        }
    }
}

// Initialize game objects
function initializeGame() {
    // Create traffic lights at intervals
    for (let i = 0; i < 3; i++) {
        const y = -500 - (i * 800);
        const lane = Math.floor(Math.random() * 3);
        const laneX = getLaneX(lane);
        game.trafficLights.push(new TrafficLight(laneX, y, lane));
    }
    
    // Create stop signs
    for (let i = 0; i < 5; i++) {
        const y = -300 - (i * 600);
        const lane = Math.floor(Math.random() * 3);
        const laneX = getLaneX(lane);
        game.stopSigns.push(new StopSign(laneX, y, lane));
    }
    
    // Create intersections
    for (let i = 0; i < 4; i++) {
        const y = -400 - (i * 700);
        game.intersections.push(new Intersection(y));
    }
}

function getLaneX(lane) {
    const laneWidth = CANVAS.width / 3;
    return laneWidth * lane + laneWidth / 2;
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

// Touch/Button Controls
function setupTouchControls() {
    const btnUp = document.getElementById('btn-up');
    const btnDown = document.getElementById('btn-down');
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    const btnBlinkerLeft = document.getElementById('blinker-left');
    const btnBlinkerRight = document.getElementById('blinker-right');
    const btnBlinkerOff = document.getElementById('blinker-off');
    
    // D-pad buttons
    ['mousedown', 'touchstart'].forEach(event => {
        btnUp.addEventListener(event, (e) => { e.preventDefault(); game.touchControls.up = true; });
        btnDown.addEventListener(event, (e) => { e.preventDefault(); game.touchControls.down = true; });
        btnLeft.addEventListener(event, (e) => { e.preventDefault(); game.touchControls.left = true; });
        btnRight.addEventListener(event, (e) => { e.preventDefault(); game.touchControls.right = true; });
    });
    
    ['mouseup', 'touchend', 'touchcancel'].forEach(event => {
        btnUp.addEventListener(event, (e) => { e.preventDefault(); game.touchControls.up = false; });
        btnDown.addEventListener(event, (e) => { e.preventDefault(); game.touchControls.down = false; });
        btnLeft.addEventListener(event, (e) => { e.preventDefault(); game.touchControls.left = false; });
        btnRight.addEventListener(event, (e) => { e.preventDefault(); game.touchControls.right = false; });
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
    // Handle input
    const isAccelerating = game.keys['ArrowUp'] || game.touchControls.up;
    const isBraking = game.keys['ArrowDown'] || game.touchControls.down;
    const isMovingLeft = game.keys['ArrowLeft'] || game.touchControls.left;
    const isMovingRight = game.keys['ArrowRight'] || game.touchControls.right;
    
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
    
    // Lane changing
    const laneWidth = CANVAS.width / 3;
    const targetX = getLaneX(game.player.lane);
    
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
    const newTargetX = getLaneX(game.player.lane);
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
        if (drawY > CANVAS.height + 200) {
            light.y = -800;
            light.lane = Math.floor(Math.random() * 3);
            light.x = getLaneX(light.lane);
        }
    });
    
    // Recycle stop signs
    game.stopSigns.forEach(sign => {
        const drawY = sign.y + game.roadOffset;
        if (drawY > CANVAS.height + 200) {
            sign.y = -600;
            sign.lane = Math.floor(Math.random() * 3);
            sign.x = getLaneX(sign.lane);
            sign.playerStopped = false;
            sign.stoppedFrames = 0;
        }
    });
    
    // Recycle intersections
    game.intersections.forEach(intersection => {
        const drawY = intersection.y + game.roadOffset;
        if (drawY > CANVAS.height + 200) {
            intersection.y = -700;
        }
    });
    
    // Check for violations
    checkTrafficRules();
}

function checkTrafficRules() {
    const now = Date.now();
    if (now - game.lastViolationCheck < 1000) return; // Check once per second
    
    // Check traffic lights
    game.trafficLights.forEach(light => {
        const drawY = light.y + game.roadOffset;
        const lightLaneX = getLaneX(light.lane);
        
        // Check if player is in the same lane and approaching the light
        if (Math.abs(game.player.x - lightLaneX) < 40 && 
            drawY > game.player.y - 80 && drawY < game.player.y) {
            
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
    
    // Check stop signs
    game.stopSigns.forEach(sign => {
        const drawY = sign.y + game.roadOffset;
        const signLaneX = getLaneX(sign.lane);
        
        if (Math.abs(game.player.x - signLaneX) < 40 && 
            drawY > game.player.y - 60 && drawY < game.player.y + 20) {
            
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
    // Clear canvas
    CTX.fillStyle = '#87CEEB'; // Sky blue
    CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
    
    // Draw road
    drawRoad();
    
    // Draw intersections
    game.intersections.forEach(intersection => {
        intersection.draw(CTX, game.roadOffset);
    });
    
    // Draw traffic lights
    game.trafficLights.forEach(light => {
        light.draw(CTX, game.roadOffset);
    });
    
    // Draw stop signs
    game.stopSigns.forEach(sign => {
        sign.draw(CTX, game.roadOffset);
    });
    
    // Draw player car
    drawCar();
}

function drawRoad() {
    const laneWidth = CANVAS.width / 3;
    
    // Road background
    CTX.fillStyle = '#333';
    CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
    
    // Lane markings
    CTX.strokeStyle = '#ffff00';
    CTX.lineWidth = 3;
    CTX.setLineDash([20, 15]);
    
    // Left lane divider
    CTX.beginPath();
    CTX.moveTo(laneWidth, 0);
    CTX.lineTo(laneWidth, CANVAS.height);
    CTX.stroke();
    
    // Right lane divider
    CTX.beginPath();
    CTX.moveTo(laneWidth * 2, 0);
    CTX.lineTo(laneWidth * 2, CANVAS.height);
    CTX.stroke();
    
    CTX.setLineDash([]);
    
    // Road edges
    CTX.strokeStyle = '#fff';
    CTX.lineWidth = 5;
    CTX.beginPath();
    CTX.moveTo(0, 0);
    CTX.lineTo(0, CANVAS.height);
    CTX.stroke();
    
    CTX.beginPath();
    CTX.moveTo(CANVAS.width, 0);
    CTX.lineTo(CANVAS.width, CANVAS.height);
    CTX.stroke();
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

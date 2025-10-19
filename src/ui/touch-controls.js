/**
 * Touch Controls System
 * Provides on-screen touch controls with pointer/touch handling and keyboard fallback
 */

export class TouchControls {
    constructor() {
        this.state = {
            up: false,
            down: false,
            left: false,
            right: false,
            blinkerLeft: false,
            blinkerRight: false
        };
        
        this.listeners = [];
        this.setupKeyboardFallback();
    }
    
    /**
     * Create touch controls overlay
     */
    createOverlay() {
        // Create overlay container
        const overlay = document.createElement('div');
        overlay.className = 'touch-controls-overlay';
        overlay.id = 'touch-controls';
        
        // Create control buttons
        const buttons = [
            { id: 'touch-up', icon: '⬆️', action: 'up' },
            { id: 'touch-down', icon: '⬇️', action: 'down' },
            { id: 'touch-left', icon: '⬅️', action: 'left' },
            { id: 'touch-right', icon: '➡️', action: 'right' }
        ];
        
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.id = btn.id;
            button.className = 'touch-control-btn';
            button.textContent = btn.icon;
            button.dataset.action = btn.action;
            
            // Handle both touch and pointer events
            this.attachButtonHandlers(button, btn.action);
            
            overlay.appendChild(button);
        });
        
        document.body.appendChild(overlay);
        return overlay;
    }
    
    /**
     * Attach touch/pointer handlers to a button
     */
    attachButtonHandlers(button, action) {
        const handleStart = (e) => {
            e.preventDefault();
            this.setState(action, true);
            button.classList.add('pressed');
        };
        
        const handleEnd = (e) => {
            e.preventDefault();
            this.setState(action, false);
            button.classList.remove('pressed');
        };
        
        // Touch events
        button.addEventListener('touchstart', handleStart, { passive: false });
        button.addEventListener('touchend', handleEnd, { passive: false });
        button.addEventListener('touchcancel', handleEnd, { passive: false });
        
        // Pointer events (for mouse)
        button.addEventListener('pointerdown', handleStart);
        button.addEventListener('pointerup', handleEnd);
        button.addEventListener('pointercancel', handleEnd);
        button.addEventListener('pointerleave', handleEnd);
    }
    
    /**
     * Setup keyboard fallback controls
     */
    setupKeyboardFallback() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    this.setState('up', true);
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.setState('down', true);
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.setState('left', true);
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.setState('right', true);
                    e.preventDefault();
                    break;
                case 'q':
                case 'Q':
                    this.setState('blinkerLeft', true);
                    e.preventDefault();
                    break;
                case 'e':
                case 'E':
                    this.setState('blinkerRight', true);
                    e.preventDefault();
                    break;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    this.setState('up', false);
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.setState('down', false);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.setState('left', false);
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.setState('right', false);
                    break;
                case 'q':
                case 'Q':
                    this.setState('blinkerLeft', false);
                    break;
                case 'e':
                case 'E':
                    this.setState('blinkerRight', false);
                    break;
            }
        });
    }
    
    /**
     * Set control state and notify listeners
     */
    setState(action, value) {
        this.state[action] = value;
        this.notifyListeners(action, value);
    }
    
    /**
     * Get current control state
     */
    getState() {
        return { ...this.state };
    }
    
    /**
     * Check if a control is active
     */
    isActive(action) {
        return this.state[action];
    }
    
    /**
     * Add listener for control state changes
     */
    onChange(callback) {
        this.listeners.push(callback);
    }
    
    /**
     * Notify all listeners of state change
     */
    notifyListeners(action, value) {
        this.listeners.forEach(callback => {
            callback(action, value, this.state);
        });
    }
    
    /**
     * Clean up resources
     */
    destroy() {
        const overlay = document.getElementById('touch-controls');
        if (overlay) {
            overlay.remove();
        }
        this.listeners = [];
    }
}

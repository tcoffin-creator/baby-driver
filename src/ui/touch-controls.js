// Enhanced touch controls with configurable size and opacity
export class TouchControls {
    constructor(config = {}) {
        this.enabled = config.enabled !== false;
        this.size = config.size || 70;
        this.opacity = config.opacity || 0.8;
        this.container = null;
        this.controls = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        this.callbacks = {};
        
        if (this.enabled) {
            this.createControls();
        }
    }
    
    createControls() {
        // Create overlay container
        this.container = document.createElement('div');
        this.container.id = 'touch-controls-overlay';
        this.container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 1000;
            opacity: ${this.opacity};
            pointer-events: none;
        `;
        
        // Create control buttons
        const buttons = [
            { id: 'accelerate', label: '⬆️', action: 'up' },
            { id: 'brake', label: '⬇️', action: 'down' },
            { id: 'left', label: '⬅️', action: 'left' },
            { id: 'right', label: '➡️', action: 'right' }
        ];
        
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.id = `touch-${btn.id}`;
            button.textContent = btn.label;
            button.style.cssText = `
                width: ${this.size}px;
                height: ${this.size}px;
                font-size: 2em;
                border: 3px solid #333;
                border-radius: 15px;
                background: #4CAF50;
                color: white;
                cursor: pointer;
                transition: all 0.2s ease;
                pointer-events: auto;
                touch-action: none;
                user-select: none;
                -webkit-user-select: none;
                -webkit-tap-highlight-color: transparent;
            `;
            
            // Event handlers for touch and mouse
            ['touchstart', 'mousedown'].forEach(event => {
                button.addEventListener(event, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.controls[btn.action] = true;
                    button.style.transform = 'scale(0.9)';
                    button.style.background = '#45a049';
                    if (this.callbacks.onControlChange) {
                        this.callbacks.onControlChange(btn.action, true);
                    }
                }, { passive: false });
            });
            
            ['touchend', 'touchcancel', 'mouseup', 'mouseleave'].forEach(event => {
                button.addEventListener(event, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.controls[btn.action] = false;
                    button.style.transform = 'scale(1)';
                    button.style.background = '#4CAF50';
                    if (this.callbacks.onControlChange) {
                        this.callbacks.onControlChange(btn.action, false);
                    }
                }, { passive: false });
            });
            
            this.container.appendChild(button);
        });
        
        document.body.appendChild(this.container);
    }
    
    setVisible(visible) {
        if (this.container) {
            this.container.style.display = visible ? 'flex' : 'none';
        }
    }
    
    setOpacity(opacity) {
        this.opacity = opacity;
        if (this.container) {
            this.container.style.opacity = opacity;
        }
    }
    
    setSize(size) {
        this.size = size;
        if (this.container) {
            const buttons = this.container.querySelectorAll('button');
            buttons.forEach(btn => {
                btn.style.width = `${size}px`;
                btn.style.height = `${size}px`;
            });
        }
    }
    
    getControls() {
        return { ...this.controls };
    }
    
    onControlChange(callback) {
        this.callbacks.onControlChange = callback;
    }
    
    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

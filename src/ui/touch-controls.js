/**
 * Touch controls module
 * Provides on-screen overlay buttons for mobile/touch devices
 */

export class TouchControls {
    constructor(options = {}) {
        this.enabled = options.enabled !== false;
        this.opacity = options.opacity || 0.8;
        this.size = options.size || 60;
        this.container = null;
        this.handlers = {};
        
        if (this.enabled) {
            this.create();
        }
    }
    
    create() {
        // Create overlay container
        this.container = document.createElement('div');
        this.container.className = 'touch-controls-overlay';
        this.container.style.opacity = this.opacity;
        
        // Create control buttons
        const controls = [
            { id: 'touch-up', label: '⬆️', action: 'accelerate' },
            { id: 'touch-down', label: '⬇️', action: 'brake' },
            { id: 'touch-left', label: '⬅️', action: 'left' },
            { id: 'touch-right', label: '➡️', action: 'right' }
        ];
        
        controls.forEach(ctrl => {
            const btn = document.createElement('button');
            btn.id = ctrl.id;
            btn.textContent = ctrl.label;
            btn.style.width = this.size + 'px';
            btn.style.height = this.size + 'px';
            
            // Prevent default touch behavior
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.emit(ctrl.action, true);
            });
            
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.emit(ctrl.action, false);
            });
            
            btn.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                this.emit(ctrl.action, false);
            });
            
            // Also support mouse for desktop testing
            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.emit(ctrl.action, true);
            });
            
            btn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.emit(ctrl.action, false);
            });
            
            this.container.appendChild(btn);
        });
        
        document.body.appendChild(this.container);
    }
    
    on(event, handler) {
        if (!this.handlers[event]) {
            this.handlers[event] = [];
        }
        this.handlers[event].push(handler);
    }
    
    emit(event, data) {
        if (this.handlers[event]) {
            this.handlers[event].forEach(handler => handler(data));
        }
    }
    
    setEnabled(enabled) {
        this.enabled = enabled;
        if (this.container) {
            this.container.style.display = enabled ? 'flex' : 'none';
        }
    }
    
    destroy() {
        if (this.container && this.container.parentElement) {
            this.container.parentElement.removeChild(this.container);
        }
        this.handlers = {};
    }
}

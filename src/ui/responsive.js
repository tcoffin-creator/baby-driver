/**
 * Responsive canvas module
 * Handles window resizing and devicePixelRatio for high-DPI displays
 */

export class ResponsiveCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.dpr = window.devicePixelRatio || 1;
        this.resizeHandler = this.handleResize.bind(this);
        
        // Prevent body scroll when game is active
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        
        // Initialize
        this.handleResize();
        window.addEventListener('resize', this.resizeHandler);
    }
    
    handleResize() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        // Set CSS dimensions
        const cssWidth = Math.min(800, rect.width - 40);
        const cssHeight = 500;
        
        this.canvas.style.width = cssWidth + 'px';
        this.canvas.style.height = cssHeight + 'px';
        
        // Set actual canvas dimensions accounting for devicePixelRatio
        this.canvas.width = cssWidth * this.dpr;
        this.canvas.height = cssHeight * this.dpr;
        
        // Scale context to match
        const ctx = this.canvas.getContext('2d');
        ctx.scale(this.dpr, this.dpr);
        
        // Store logical dimensions for game code
        this.logicalWidth = cssWidth;
        this.logicalHeight = cssHeight;
    }
    
    getLogicalSize() {
        return {
            width: this.logicalWidth,
            height: this.logicalHeight
        };
    }
    
    destroy() {
        window.removeEventListener('resize', this.resizeHandler);
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
    }
}

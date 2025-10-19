// Responsive canvas handling with devicePixelRatio support
export class ResponsiveManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.gameActive = false;
        this.handleResize = this.handleResize.bind(this);
        this.init();
    }
    
    init() {
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    }
    
    handleResize() {
        const container = this.canvas.parentElement;
        const dpr = window.devicePixelRatio || 1;
        
        // Get CSS dimensions
        const cssWidth = Math.min(800, container.clientWidth - 40);
        const cssHeight = 500;
        
        // Set actual canvas size with device pixel ratio
        this.canvas.width = cssWidth * dpr;
        this.canvas.height = cssHeight * dpr;
        
        // Set CSS size
        this.canvas.style.width = `${cssWidth}px`;
        this.canvas.style.height = `${cssHeight}px`;
        
        // Scale context to account for device pixel ratio
        const ctx = this.canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        
        // Return logical dimensions for game logic
        return { width: cssWidth, height: cssHeight, dpr };
    }
    
    setGameActive(active) {
        this.gameActive = active;
        if (active) {
            // Prevent body scrolling when game is active
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        } else {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        }
    }
    
    getLogicalDimensions() {
        const dpr = window.devicePixelRatio || 1;
        return {
            width: this.canvas.width / dpr,
            height: this.canvas.height / dpr,
            dpr: dpr
        };
    }
    
    destroy() {
        window.removeEventListener('resize', this.handleResize);
        this.setGameActive(false);
    }
}

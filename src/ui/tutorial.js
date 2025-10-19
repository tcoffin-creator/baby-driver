/**
 * Tutorial/Onboarding System
 * Provides tutorial modal with help icon for game instructions
 */

export class Tutorial {
    constructor() {
        this.isShown = false;
        this.modal = null;
        this.helpIcon = null;
        this.createHelpIcon();
        this.createModal();
    }
    
    /**
     * Create help icon button
     */
    createHelpIcon() {
        this.helpIcon = document.createElement('button');
        this.helpIcon.className = 'help-icon';
        this.helpIcon.innerHTML = '?';
        this.helpIcon.title = 'Show Tutorial';
        this.helpIcon.onclick = () => this.show();
        document.body.appendChild(this.helpIcon);
    }
    
    /**
     * Create tutorial modal
     */
    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'tutorial-modal hidden';
        
        const content = document.createElement('div');
        content.className = 'tutorial-content';
        
        content.innerHTML = `
            <h2>🚗 Welcome to Baby Driver!</h2>
            <p style="text-align: center; margin-bottom: 20px;">Learn the rules of the road and become a safe driver!</p>
            
            <h3 style="color: #4CAF50; margin-top: 20px;">🎮 Controls</h3>
            <ul>
                <li><strong>Desktop:</strong> Use Arrow Keys to drive, Q for left blinker, E for right blinker</li>
                <li><strong>Mobile:</strong> Use on-screen touch controls</li>
                <li><strong>Arrow Up/Down:</strong> Accelerate and brake</li>
                <li><strong>Arrow Left/Right:</strong> Change lanes</li>
            </ul>
            
            <h3 style="color: #2196F3; margin-top: 20px;">🚦 Traffic Rules</h3>
            <ul>
                <li>🛑 <strong>Stop Signs:</strong> Come to a complete stop</li>
                <li>🚦 <strong>Traffic Lights:</strong> Stop at red and yellow, go on green</li>
                <li>💡 <strong>Turn Signals:</strong> Use blinkers before changing lanes</li>
                <li>🏁 <strong>Stay in Lane:</strong> Don't drift between lanes</li>
                <li>📏 <strong>Safe Following:</strong> Keep safe distance from other vehicles</li>
            </ul>
            
            <h3 style="color: #FF9800; margin-top: 20px;">⭐ Scoring</h3>
            <ul>
                <li>✅ <strong>Earn Points:</strong> Follow traffic rules correctly</li>
                <li>❌ <strong>Violations:</strong> Breaking rules loses points and adds violations</li>
                <li>🏆 <strong>Goal:</strong> Drive safely with zero violations!</li>
            </ul>
            
            <button class="tutorial-btn" id="tutorial-close">Let's Drive! 🚗</button>
        `;
        
        this.modal.appendChild(content);
        document.body.appendChild(this.modal);
        
        // Close button handler
        const closeBtn = content.querySelector('#tutorial-close');
        closeBtn.onclick = () => this.hide();
        
        // Click outside to close
        this.modal.onclick = (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        };
    }
    
    /**
     * Show tutorial modal
     */
    show() {
        if (!this.isShown) {
            this.modal.classList.remove('hidden');
            this.isShown = true;
        }
    }
    
    /**
     * Hide tutorial modal
     */
    hide() {
        if (this.isShown) {
            this.modal.classList.add('hidden');
            this.isShown = false;
        }
    }
    
    /**
     * Show tutorial on first visit
     */
    showOnFirstVisit() {
        const hasVisited = localStorage.getItem('baby-driver-tutorial-seen');
        if (!hasVisited) {
            this.show();
            localStorage.setItem('baby-driver-tutorial-seen', 'true');
        }
    }
    
    /**
     * Clean up resources
     */
    destroy() {
        if (this.modal) {
            this.modal.remove();
        }
        if (this.helpIcon) {
            this.helpIcon.remove();
        }
    }
}

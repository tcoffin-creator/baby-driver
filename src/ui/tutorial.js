/**
 * Tutorial/onboarding module
 * Shows instructions on first load and provides help icon to reopen
 */

export class Tutorial {
    constructor() {
        this.modal = null;
        this.helpIcon = null;
        this.hasShown = localStorage.getItem('baby-driver-tutorial-shown') === 'true';
        
        this.create();
        
        // Show on first load
        if (!this.hasShown) {
            this.show();
        }
    }
    
    create() {
        // Create modal
        this.modal = document.createElement('div');
        this.modal.className = 'tutorial-modal hidden';
        
        const content = document.createElement('div');
        content.className = 'tutorial-content';
        content.innerHTML = `
            <h2>🚗 Welcome to Baby Driver!</h2>
            <h3>How to Play:</h3>
            <ul>
                <li><strong>Desktop Controls:</strong>
                    <ul>
                        <li>Arrow Keys: Drive (↑ accelerate, ↓ brake, ← → change lanes)</li>
                        <li>Q: Left blinker</li>
                        <li>E: Right blinker</li>
                        <li>W: Turn off blinkers</li>
                    </ul>
                </li>
                <li><strong>Touch/Mobile Controls:</strong>
                    <ul>
                        <li>Use on-screen buttons to control your car</li>
                        <li>Tap blinker buttons before changing lanes</li>
                    </ul>
                </li>
            </ul>
            <h3>Traffic Rules:</h3>
            <ul>
                <li>🛑 <strong>Stop at STOP signs</strong> - Come to a complete stop!</li>
                <li>🚦 <strong>Obey traffic lights</strong> - Stop at red/yellow, go on green</li>
                <li>💡 <strong>Use your blinkers</strong> - Signal before changing lanes</li>
                <li>✅ <strong>Follow the rules</strong> - Earn points for good driving!</li>
            </ul>
            <p><em>Tip: Click the ? icon in the top-right corner anytime to see these instructions again.</em></p>
            <button id="tutorial-close">Got it! Let's Drive!</button>
        `;
        
        this.modal.appendChild(content);
        document.body.appendChild(this.modal);
        
        // Create help icon
        this.helpIcon = document.createElement('button');
        this.helpIcon.className = 'help-icon';
        this.helpIcon.textContent = '?';
        this.helpIcon.title = 'Show instructions';
        document.body.appendChild(this.helpIcon);
        
        // Event listeners
        content.querySelector('#tutorial-close').addEventListener('click', () => {
            this.hide();
        });
        
        this.helpIcon.addEventListener('click', () => {
            this.show();
        });
        
        // Close on backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        });
    }
    
    show() {
        this.modal.classList.remove('hidden');
        this.hasShown = true;
        localStorage.setItem('baby-driver-tutorial-shown', 'true');
    }
    
    hide() {
        this.modal.classList.add('hidden');
    }
    
    destroy() {
        if (this.modal && this.modal.parentElement) {
            this.modal.parentElement.removeChild(this.modal);
        }
        if (this.helpIcon && this.helpIcon.parentElement) {
            this.helpIcon.parentElement.removeChild(this.helpIcon);
        }
    }
}

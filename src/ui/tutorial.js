// Tutorial and help system
export class Tutorial {
    constructor() {
        this.shown = this.hasSeenTutorial();
        this.modal = null;
        this.helpButton = null;
        this.createHelpButton();
    }
    
    hasSeenTutorial() {
        return localStorage.getItem('baby-driver-tutorial-seen') === 'true';
    }
    
    markTutorialSeen() {
        localStorage.setItem('baby-driver-tutorial-seen', 'true');
        this.shown = true;
    }
    
    createHelpButton() {
        this.helpButton = document.createElement('button');
        this.helpButton.id = 'help-button';
        this.helpButton.innerHTML = '❓';
        this.helpButton.title = 'Show controls';
        this.helpButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #2196f3;
            color: white;
            border: 3px solid #1976d2;
            font-size: 1.5em;
            cursor: pointer;
            z-index: 1001;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
        `;
        
        this.helpButton.addEventListener('click', () => {
            this.show();
        });
        
        this.helpButton.addEventListener('mouseenter', () => {
            this.helpButton.style.transform = 'scale(1.1)';
        });
        
        this.helpButton.addEventListener('mouseleave', () => {
            this.helpButton.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(this.helpButton);
    }
    
    show() {
        // Create modal overlay
        this.modal = document.createElement('div');
        this.modal.id = 'tutorial-modal';
        this.modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        `;
        
        // Create modal content
        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 20px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
            animation: slideIn 0.3s ease;
        `;
        
        content.innerHTML = `
            <style>
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { transform: translateY(-50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            </style>
            <h2 style="color: #1976d2; margin-top: 0; text-align: center;">🎮 How to Play Baby Driver</h2>
            
            <div style="margin: 20px 0;">
                <h3 style="color: #333; border-bottom: 2px solid #2196f3; padding-bottom: 5px;">🖥️ Desktop Controls</h3>
                <ul style="list-style: none; padding-left: 0;">
                    <li style="padding: 8px 0;"><strong>↑</strong> Arrow Up - Accelerate</li>
                    <li style="padding: 8px 0;"><strong>↓</strong> Arrow Down - Brake</li>
                    <li style="padding: 8px 0;"><strong>←</strong> Arrow Left - Change lane left</li>
                    <li style="padding: 8px 0;"><strong>→</strong> Arrow Right - Change lane right</li>
                    <li style="padding: 8px 0;"><strong>Q</strong> - Left turn signal</li>
                    <li style="padding: 8px 0;"><strong>E</strong> - Right turn signal</li>
                    <li style="padding: 8px 0;"><strong>W</strong> - Turn signals off</li>
                </ul>
            </div>
            
            <div style="margin: 20px 0;">
                <h3 style="color: #333; border-bottom: 2px solid #2196f3; padding-bottom: 5px;">📱 Touch Controls</h3>
                <p style="color: #555;">Use the on-screen buttons to control your car:</p>
                <ul style="list-style: none; padding-left: 0;">
                    <li style="padding: 8px 0;">⬆️ - Accelerate</li>
                    <li style="padding: 8px 0;">⬇️ - Brake</li>
                    <li style="padding: 8px 0;">⬅️ - Turn left</li>
                    <li style="padding: 8px 0;">➡️ - Turn right</li>
                </ul>
            </div>
            
            <div style="margin: 20px 0;">
                <h3 style="color: #333; border-bottom: 2px solid #2196f3; padding-bottom: 5px;">📚 Rules of the Road</h3>
                <ul style="list-style: none; padding-left: 0;">
                    <li style="padding: 8px 0;">🛑 <strong>Stop Signs:</strong> Come to a complete stop (speed = 0)</li>
                    <li style="padding: 8px 0;">🚦 <strong>Red Lights:</strong> Stop and wait for green</li>
                    <li style="padding: 8px 0;">🟡 <strong>Yellow Lights:</strong> Slow down and prepare to stop</li>
                    <li style="padding: 8px 0;">🟢 <strong>Green Lights:</strong> Go!</li>
                    <li style="padding: 8px 0;">💡 <strong>Turn Signals:</strong> Use before changing lanes</li>
                    <li style="padding: 8px 0;">✅ <strong>Follow Rules:</strong> Earn points for good driving!</li>
                    <li style="padding: 8px 0;">❌ <strong>Violations:</strong> Breaking rules costs points</li>
                </ul>
            </div>
            
            <button id="close-tutorial" style="
                width: 100%;
                padding: 15px;
                font-size: 1.2em;
                font-weight: bold;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                margin-top: 20px;
                transition: background 0.2s ease;
            ">Got it! Let's Drive 🚗</button>
        `;
        
        this.modal.appendChild(content);
        document.body.appendChild(this.modal);
        
        // Close button handler
        const closeBtn = document.getElementById('close-tutorial');
        closeBtn.addEventListener('click', () => {
            this.hide();
            if (!this.shown) {
                this.markTutorialSeen();
            }
        });
        
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = '#45a049';
        });
        
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = '#4CAF50';
        });
        
        // Click overlay to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
                if (!this.shown) {
                    this.markTutorialSeen();
                }
            }
        });
    }
    
    hide() {
        if (this.modal && this.modal.parentNode) {
            this.modal.parentNode.removeChild(this.modal);
            this.modal = null;
        }
    }
    
    showIfFirstTime() {
        if (!this.shown) {
            // Show after a brief delay
            setTimeout(() => this.show(), 500);
        }
    }
    
    destroy() {
        this.hide();
        if (this.helpButton && this.helpButton.parentNode) {
            this.helpButton.parentNode.removeChild(this.helpButton);
        }
    }
}

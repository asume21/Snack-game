// Ad System and Monetization
class AdSystem {
    constructor() {
        this.coins = this.getStoredCoins();
        this.adWatchCount = this.getStoredAdWatchCount();
        this.adTimer = 5; // 5 second ads for demo
        this.adReward = 10;
        this.reviveReward = 5;
        this.initializeElements();
        this.updateCoinsDisplay();
    }

    getStoredCoins() {
        return parseInt(localStorage.getItem('snakeGameCoins') || '0');
    }

    getStoredAdWatchCount() {
        return parseInt(localStorage.getItem('snakeGameAdWatchCount') || '0');
    }

    saveCoins() {
        localStorage.setItem('snakeGameCoins', this.coins.toString());
    }

    saveAdWatchCount() {
        localStorage.setItem('snakeGameAdWatchCount', this.adWatchCount.toString());
    }

    initializeElements() {
        this.watchAdBtn = document.getElementById('watch-ad-btn');
        this.watchAdReviveBtn = document.getElementById('watch-ad-revive');
        this.closeAdBtn = document.getElementById('close-ad-btn');
        this.adModal = document.getElementById('ad-modal');
        this.adTimerSpan = document.getElementById('ad-timer');
        this.coinsDisplay = document.getElementById('coins');

        // Bind event listeners
        this.watchAdBtn.addEventListener('click', () => this.showAd(this.adReward));
        this.watchAdReviveBtn.addEventListener('click', () => this.showAd(this.reviveReward, true));
        this.closeAdBtn.addEventListener('click', () => this.closeAd());
    }

    updateCoinsDisplay() {
        if (this.coinsDisplay) {
            this.coinsDisplay.textContent = this.coins;
        }
    }

    showAd(reward = this.adReward, isRevive = false) {
        // Show ad modal
        this.adModal.classList.remove('hidden');
        this.closeAdBtn.disabled = true;
        
        let timeLeft = this.adTimer;
        this.adTimerSpan.textContent = timeLeft;

        // Simulate ad duration
        const adInterval = setInterval(() => {
            timeLeft--;
            this.adTimerSpan.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(adInterval);
                this.closeAdBtn.disabled = false;
                this.closeAdBtn.textContent = `Close Ad (Earn ${reward} coins!)`;
                this.currentReward = reward;
                this.isReviveAd = isRevive;
            }
        }, 1000);

        // Track ad impression
        this.trackAdImpression();
    }

    closeAd() {
        // Award coins
        this.coins += this.currentReward;
        this.adWatchCount++;
        
        // Save progress
        this.saveCoins();
        this.saveAdWatchCount();
        
        // Update display
        this.updateCoinsDisplay();
        
        // Hide modal
        this.adModal.classList.add('hidden');
        
        // Reset button text
        this.closeAdBtn.textContent = 'Close Ad';
        
        // Show reward notification
        this.showRewardNotification(this.currentReward);
        
        // If this was a revive ad, revive the player
        if (this.isReviveAd && window.game) {
            window.game.revivePlayer();
        }

        // Track ad completion
        this.trackAdCompletion(this.currentReward);
    }

    showRewardNotification(amount) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = `+${amount} coins earned!`;
        
        // Add animation keyframes if not already added
        if (!document.getElementById('notificationStyles')) {
            const style = document.createElement('style');
            style.id = 'notificationStyles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    trackAdImpression() {
        // Track ad impression (in a real app, this would send data to analytics)
        console.log('Ad impression tracked', {
            timestamp: new Date().toISOString(),
            adWatchCount: this.adWatchCount,
            totalCoins: this.coins
        });
    }

    trackAdCompletion(reward) {
        // Track ad completion (in a real app, this would send data to analytics)
        console.log('Ad completed', {
            timestamp: new Date().toISOString(),
            reward: reward,
            adWatchCount: this.adWatchCount,
            totalCoins: this.coins
        });
    }

    // Method to spend coins (for future features like power-ups)
    spendCoins(amount) {
        if (this.coins >= amount) {
            this.coins -= amount;
            this.saveCoins();
            this.updateCoinsDisplay();
            return true;
        }
        return false;
    }

    // Get current coins
    getCoins() {
        return this.coins;
    }

    // Add coins (for gameplay rewards)
    addCoins(amount) {
        this.coins += amount;
        this.saveCoins();
        this.updateCoinsDisplay();
    }

    // Get statistics for display
    getStats() {
        return {
            totalCoins: this.coins,
            adsWatched: this.adWatchCount
        };
    }
}

// Initialize ad system when page loads
let adSystem;
document.addEventListener('DOMContentLoaded', () => {
    adSystem = new AdSystem();
    window.adSystem = adSystem; // Make it globally accessible
});
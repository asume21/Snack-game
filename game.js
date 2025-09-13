// Snake IO Game with Monetization
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.tileCount = {
            x: this.canvas.width / this.gridSize,
            y: this.canvas.height / this.gridSize
        };

        // Game state
        this.snake = [{x: 10, y: 10}];
        this.food = [];
        this.otherPlayers = [];
        this.direction = {x: 0, y: 0};
        this.score = 0;
        this.gameRunning = false;
        this.gameOver = false;
        
        // Multiplayer simulation
        this.playerId = 'player_' + Math.random().toString(36).substr(2, 9);
        this.simulatedPlayers = 3; // Simulate 3 other players
        
        this.initializeElements();
        this.initializeControls();
        this.generateFood();
        this.simulateOtherPlayers();
        this.startGame();
    }

    initializeElements() {
        this.scoreDisplay = document.getElementById('score');
        this.playersOnlineDisplay = document.getElementById('players-online');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.finalScoreDisplay = document.getElementById('final-score');
        this.coinsEarnedDisplay = document.getElementById('coins-earned');
        this.restartBtn = document.getElementById('restart-btn');

        this.restartBtn.addEventListener('click', () => this.restartGame());
        
        // Update players online display
        this.playersOnlineDisplay.textContent = this.simulatedPlayers + 1;
    }

    initializeControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning) return;

            switch(e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    if (this.direction.y !== 1) {
                        this.direction = {x: 0, y: -1};
                    }
                    break;
                case 's':
                case 'arrowdown':
                    if (this.direction.y !== -1) {
                        this.direction = {x: 0, y: 1};
                    }
                    break;
                case 'a':
                case 'arrowleft':
                    if (this.direction.x !== 1) {
                        this.direction = {x: -1, y: 0};
                    }
                    break;
                case 'd':
                case 'arrowright':
                    if (this.direction.x !== -1) {
                        this.direction = {x: 1, y: 0};
                    }
                    break;
            }
        });
    }

    generateFood() {
        // Generate multiple food items for more engaging gameplay
        this.food = [];
        for (let i = 0; i < 5; i++) {
            this.food.push({
                x: Math.floor(Math.random() * this.tileCount.x),
                y: Math.floor(Math.random() * this.tileCount.y),
                type: Math.random() > 0.8 ? 'special' : 'normal' // 20% chance for special food
            });
        }
    }

    simulateOtherPlayers() {
        // Create simulated other players for IO feel
        this.otherPlayers = [];
        for (let i = 0; i < this.simulatedPlayers; i++) {
            const player = {
                id: 'bot_' + i,
                snake: [{
                    x: Math.floor(Math.random() * this.tileCount.x),
                    y: Math.floor(Math.random() * this.tileCount.y)
                }],
                direction: {x: 1, y: 0},
                color: this.getRandomColor(),
                score: Math.floor(Math.random() * 50) + 10
            };
            
            // Add some body segments
            for (let j = 1; j < Math.floor(Math.random() * 5) + 2; j++) {
                player.snake.push({
                    x: player.snake[0].x - j,
                    y: player.snake[0].y
                });
            }
            
            this.otherPlayers.push(player);
        }
    }

    getRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    startGame() {
        this.gameRunning = true;
        this.gameLoop();
    }

    gameLoop() {
        if (!this.gameRunning) return;

        this.update();
        this.draw();
        setTimeout(() => this.gameLoop(), 150); // Game speed
    }

    update() {
        if (this.direction.x === 0 && this.direction.y === 0) return;

        // Move snake head
        const head = {x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y};

        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount.x || head.y < 0 || head.y >= this.tileCount.y) {
            this.endGame();
            return;
        }

        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.endGame();
            return;
        }

        // Check collision with other players
        if (this.checkCollisionWithOthers(head)) {
            this.endGame();
            return;
        }

        this.snake.unshift(head);

        // Check food collision
        let foodEaten = false;
        for (let i = this.food.length - 1; i >= 0; i--) {
            if (this.food[i].x === head.x && this.food[i].y === head.y) {
                const food = this.food[i];
                foodEaten = true;
                
                if (food.type === 'special') {
                    this.score += 10;
                    // Award coins for special food
                    if (window.adSystem) {
                        window.adSystem.addCoins(1);
                    }
                } else {
                    this.score += 5;
                }
                
                this.food.splice(i, 1);
                break;
            }
        }

        if (!foodEaten) {
            this.snake.pop();
        }

        // Add new food if needed
        if (this.food.length < 5) {
            this.food.push({
                x: Math.floor(Math.random() * this.tileCount.x),
                y: Math.floor(Math.random() * this.tileCount.y),
                type: Math.random() > 0.8 ? 'special' : 'normal'
            });
        }

        // Update other players (simple AI)
        this.updateOtherPlayers();
        
        // Update score display
        this.scoreDisplay.textContent = this.score;
    }

    checkCollisionWithOthers(head) {
        for (let player of this.otherPlayers) {
            for (let segment of player.snake) {
                if (segment.x === head.x && segment.y === head.y) {
                    return true;
                }
            }
        }
        return false;
    }

    updateOtherPlayers() {
        for (let player of this.otherPlayers) {
            // Simple AI: occasionally change direction
            if (Math.random() < 0.1) {
                const directions = [{x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}];
                const newDir = directions[Math.floor(Math.random() * directions.length)];
                if (newDir.x !== -player.direction.x || newDir.y !== -player.direction.y) {
                    player.direction = newDir;
                }
            }

            // Move player
            const head = {
                x: player.snake[0].x + player.direction.x,
                y: player.snake[0].y + player.direction.y
            };

            // Wrap around screen (simple behavior)
            if (head.x < 0) head.x = this.tileCount.x - 1;
            if (head.x >= this.tileCount.x) head.x = 0;
            if (head.y < 0) head.y = this.tileCount.y - 1;
            if (head.y >= this.tileCount.y) head.y = 0;

            player.snake.unshift(head);
            player.snake.pop();
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid lines
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        for (let x = 0; x <= this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y <= this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }

        // Draw other players
        for (let player of this.otherPlayers) {
            this.ctx.fillStyle = player.color;
            for (let segment of player.snake) {
                this.ctx.fillRect(
                    segment.x * this.gridSize + 1,
                    segment.y * this.gridSize + 1,
                    this.gridSize - 2,
                    this.gridSize - 2
                );
            }
        }

        // Draw food
        for (let food of this.food) {
            if (food.type === 'special') {
                this.ctx.fillStyle = '#FFD700'; // Gold for special food
                this.ctx.fillRect(
                    food.x * this.gridSize + 2,
                    food.y * this.gridSize + 2,
                    this.gridSize - 4,
                    this.gridSize - 4
                );
                // Add sparkle effect
                this.ctx.fillStyle = '#FFF';
                this.ctx.fillRect(
                    food.x * this.gridSize + this.gridSize / 2 - 1,
                    food.y * this.gridSize + this.gridSize / 2 - 1,
                    2,
                    2
                );
            } else {
                this.ctx.fillStyle = '#FF0000';
                this.ctx.fillRect(
                    food.x * this.gridSize + 3,
                    food.y * this.gridSize + 3,
                    this.gridSize - 6,
                    this.gridSize - 6
                );
            }
        }

        // Draw player snake
        this.ctx.fillStyle = '#0095DD';
        for (let i = 0; i < this.snake.length; i++) {
            if (i === 0) {
                // Head - slightly different color
                this.ctx.fillStyle = '#0077BB';
            } else {
                this.ctx.fillStyle = '#0095DD';
            }
            this.ctx.fillRect(
                this.snake[i].x * this.gridSize + 1,
                this.snake[i].y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
        }
    }

    endGame() {
        this.gameRunning = false;
        this.gameOver = true;
        
        // Calculate coins earned based on score
        const coinsFromScore = Math.floor(this.score / 50);
        
        // Show game over screen
        this.finalScoreDisplay.textContent = this.score;
        this.coinsEarnedDisplay.textContent = coinsFromScore;
        this.gameOverScreen.classList.remove('hidden');
        
        // Award coins
        if (window.adSystem && coinsFromScore > 0) {
            window.adSystem.addCoins(coinsFromScore);
        }
    }

    restartGame() {
        // Reset game state
        this.snake = [{x: 10, y: 10}];
        this.direction = {x: 0, y: 0};
        this.score = 0;
        this.gameOver = false;
        
        // Hide game over screen
        this.gameOverScreen.classList.add('hidden');
        
        // Regenerate food and other players
        this.generateFood();
        this.simulateOtherPlayers();
        
        // Update score display
        this.scoreDisplay.textContent = this.score;
        
        // Restart game
        this.startGame();
    }

    revivePlayer() {
        if (this.gameOver) {
            // Move snake to a safe position
            this.snake = [{x: Math.floor(this.tileCount.x / 2), y: Math.floor(this.tileCount.y / 2)}];
            this.direction = {x: 0, y: 0};
            this.gameOver = false;
            
            // Hide game over screen
            this.gameOverScreen.classList.add('hidden');
            
            // Continue the game
            this.startGame();
        }
    }
}

// Initialize game when page loads
let game;
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for ad system to initialize
    setTimeout(() => {
        game = new SnakeGame();
        window.game = game; // Make it globally accessible
    }, 100);
});
class EmojiGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('gameScore');
        this.timerElement = document.getElementById('gameTimer');
        this.startBtn = document.getElementById('startGameBtn');
        
        this.score = 0;
        this.timeLeft = 30;
        this.isPlaying = false;
        this.emojis = [];
        this.paddle = {
            x: 0,
            y: 0,
            width: 80,
            height: 20,
            color: '#fff176'
        };
        
        this.positiveEmojis = ['😊', '🥰', '✨', '🔥', '🌈', '💖'];
        this.negativeEmojis = ['😢', '💢', '⛈️', '💣', '💀', '💩'];
        
        this.init();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.paddle.x = e.clientX - rect.left - this.paddle.width / 2;
            
            // Boundary check
            if (this.paddle.x < 0) this.paddle.x = 0;
            if (this.paddle.x > this.canvas.width - this.paddle.width) {
                this.paddle.x = this.canvas.width - this.paddle.width;
            }
        });
        
        this.startBtn.addEventListener('click', () => this.startGame());
    }
    
    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = 400;
        this.paddle.y = this.canvas.height - 40;
    }
    
    startGame() {
        if (this.isPlaying) return;
        
        this.score = 0;
        this.timeLeft = 30;
        this.emojis = [];
        this.isPlaying = true;
        this.scoreElement.textContent = this.score;
        this.timerElement.textContent = this.timeLeft;
        this.startBtn.disabled = true;
        this.startBtn.textContent = '게임 중...';
        
        this.lastTime = performance.now();
        this.gameLoop();
        
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.timerElement.textContent = this.timeLeft;
            if (this.timeLeft <= 0) this.endGame();
        }, 1000);
    }
    
    spawnEmoji() {
        const isPositive = Math.random() > 0.3;
        const emojiList = isPositive ? this.positiveEmojis : this.negativeEmojis;
        const char = emojiList[Math.floor(Math.random() * emojiList.length)];
        
        this.emojis.push({
            x: Math.random() * (this.canvas.width - 30),
            y: -30,
            char: char,
            speed: 2 + Math.random() * 3,
            isPositive: isPositive,
            size: 30
        });
    }
    
    update() {
        if (Math.random() < 0.05) this.spawnEmoji();
        
        for (let i = this.emojis.length - 1; i >= 0; i--) {
            const e = this.emojis[i];
            e.y += e.speed;
            
            // Collision check
            if (e.y + e.size > this.paddle.y && 
                e.x + e.size > this.paddle.x && 
                e.x < this.paddle.x + this.paddle.width) {
                
                if (e.isPositive) {
                    this.score += 10;
                    this.createParticle(e.x, e.y, '#fff176');
                } else {
                    this.score = Math.max(0, this.score - 5);
                    this.createParticle(e.x, e.y, '#f44336');
                }
                this.scoreElement.textContent = this.score;
                this.emojis.splice(i, 1);
                continue;
            }
            
            // Remove off-screen
            if (e.y > this.canvas.height) {
                this.emojis.splice(i, 1);
            }
        }
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw Paddle
        this.ctx.fillStyle = this.paddle.color;
        this.ctx.beginPath();
        this.ctx.roundRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height, 10);
        this.ctx.fill();
        
        // Draw Emojis
        this.ctx.font = '30px serif';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        for (const e of this.emojis) {
            this.ctx.fillText(e.char, e.x, e.y);
        }
    }
    
    createParticle(x, y, color) {
        // Simple visual feedback could be added here
    }
    
    gameLoop() {
        if (!this.isPlaying) return;
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    endGame() {
        this.isPlaying = false;
        clearInterval(this.timerInterval);
        this.startBtn.disabled = false;
        this.startBtn.textContent = '다시 시작';
        alert(`게임 종료! 최종 점수: ${this.score}점`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new EmojiGame();
});

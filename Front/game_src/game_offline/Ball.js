import { Config } from './Config.js'
import { Countdown } from './Countdown.js';
import { PowerUp } from './PowerUp.js'

export class Ball {
	constructor( scene, color, powerUpsEnabled) {
		this.scene = scene;
		this.arena = this.scene.arena;
		this.score = this.scene.score;
		this.color = color;

		// Ball propreties
		this.radius = 0.03;
		this.velocityX = 0.015;
		this.velocityY = 0.015;
		this.maxSpeed = 0.03

		//Ball Drawing
		this.geometry = new Config.THREE.SphereGeometry(this.radius)
		this.material = new Config.THREE.MeshLambertMaterial({color: this.color})
		this.mesh = new Config.THREE.Mesh(this.geometry, this.material);
		this.mesh.position.set(0, 0, this.radius + this.arena.arenaDepth / 2);

		//Countdown
		this.countdown = new Countdown(this.scene, this.arena);

		//PowerUps
		this.powerUpsEnabled = powerUpsEnabled;
		this.consecutiveGoals = { left: 0, right:0 };
		this.powerUp = null;
	}

	start( direction ) {
		const angle = (Math.random() * Math.PI / 4) - Math.PI / 8; // -22.5 to 22.5 degrees
		const speed = 0.025;
		this.velocityX = speed * Math.cos(angle) * direction;
		this.velocityY = speed * 0;
	}

	reset() {
		this.mesh.position.set(0, 0, this.radius + this.arena.arenaDepth / 2);
	
		// Initial velocity
		this.velocityX = 0;
		this.velocityY = 0;
	}

	update( leftPaddle, rightPaddle ) {
		// Check for wall collisions
		this.checkWallCollision(leftPaddle, rightPaddle);
	
		// Check for paddle collisions
		this.checkPaddleCollision(leftPaddle);
		this.checkPaddleCollision(rightPaddle);

		if (this.powerUp){
			if (!this.powerUp.isActive && this.powerUp.checkExpired()) {
				
				this.powerUp.remove();
				this.powerUp = null;
				return ;
			}
			if (!this.powerUp.isActive && this.powerUp.checkCollision()){
				
				this.powerUp.applyPowerUp();
				this.powerUp.remove();
			}
		}
	}

	removePowerUp( goalOwner ) {
		if (this.powerUp && this.powerUp.owner.side !== goalOwner.side){
			this.powerUp.remove();
			if (this.powerUp.isActive){
				this.powerUp.removeAbility();
			}
			this.powerUp = null;
		}
		else {
			if (this.powerUp && this.powerUp.owner.clan === "VERTEX"){
				if (this.powerUp.isActive){
					this.powerUp.removeAbility();
				}
			}
		}
	}

	checkWallCollision ( leftPaddle, rightPaddle ) {
		const prevBallY = this.mesh.position.y;

		// Move ball
		this.mesh.position.x += this.velocityX;
		this.mesh.position.y += this.velocityY;

		// Bounce off top and bottom with slight speed increase
		if (this.mesh.position.y + this.radius > this.arena.arenaHeight / 2 || 
		    this.mesh.position.y - this.radius < -this.arena.arenaHeight / 2) {
		  this.velocityY = -this.velocityY * 1.025;
		  this.mesh.position.y = prevBallY; // Prevent sticking to walls
		}

		// left scored
		if (this.mesh.position.x + this.radius > this.arena.arenaWidth / 2) {
			leftPaddle.score++;
			if (this.powerUpsEnabled){
			this.removePowerUp(leftPaddle);
				this.consecutiveGoals.right = 0;
				this.consecutiveGoals.left++;
				if (this.consecutiveGoals.left === 3){
					this.consecutiveGoals.left = 0;
					if (this.powerUp){
						this.powerUp.remove();
						this.powerUp = null;
					}
					this.powerUp = new PowerUp(this.scene, leftPaddle);
					this.powerUp.spawn();
				}
			}

			this.score.updateScore(leftPaddle.score, rightPaddle.score);

			if (leftPaddle.score === this.scene.goalLimit){
				this.scene.gameOverSequence();
				return ;
			}
			this.countdown.startCountdown("r");
			leftPaddle.reset();
			rightPaddle.reset();
			this.reset();
			this.start(1);
		}

		// right scored
		else if (this.mesh.position.x - this.radius < -this.arena.arenaWidth / 2) {
			rightPaddle.score++;
			if (this.powerUpsEnabled){
			this.removePowerUp(rightPaddle);
				this.consecutiveGoals.left = 0;
				this.consecutiveGoals.right++;
				if (this.consecutiveGoals.right === 3){
					this.consecutiveGoals.right = 0;
					if (this.powerUp){
						this.powerUp.remove();
						this.powerUp = null;
					}
					this.powerUp = new PowerUp(this.scene, rightPaddle);
					this.powerUp.spawn();
				}
			}
			this.score.updateScore(leftPaddle.score, rightPaddle.score);

			if (rightPaddle.score === this.scene.goalLimit){
				this.scene.gameOverSequence();
				return ;
			}
			this.countdown.startCountdown("l");
			leftPaddle.reset();
			rightPaddle.reset();
			this.reset();
			this.start(-1);
		}

		// Ensure ball doesn't exceed max speed
		const currentSpeed = Math.sqrt(this.velocityX ** 2 + this.velocityY ** 2);
		if (currentSpeed > this.maxSpeed) {
			const scale = this.maxSpeed / currentSpeed;
			this.velocityX *= scale;
			this.velocityY *= scale;
		}
	}

	checkPaddleCollision( paddle ) {
		const paddleX = paddle.mesh.position.x;
		const paddleY = paddle.mesh.position.y;
		const ballX = this.mesh.position.x;
		const ballY = this.mesh.position.y;

		// Basic collision detection
		if (ballX - this.radius < paddleX + paddle.paddleWidth / 2 &&
		    ballX + this.radius > paddleX - paddle.paddleWidth / 2 &&
		    ballY - this.radius < paddleY + paddle.paddleHeight / 2 &&
		    ballY + this.radius > paddleY - paddle.paddleHeight / 2) {
      
			// Calculate relative impact position (-1 to 1, from paddle bottom to top)
			const relativeIntersectY = (paddleY - ballY) / (paddle.paddleHeight / 2);
      
			// Calculate new angle (-60 to 60 degrees)
			const bounceAngle = relativeIntersectY * Math.PI / 3;
      
			// Calculate paddle's momentum
			const paddleMomentum = paddle.lastY - paddleY;
      
			// Determine if this is the left or right paddle
			const isLeftPaddle = paddleX < 0;
      
			// Calculate new velocities
			const speed = Math.sqrt(this.velocityX ** 2 + this.velocityY ** 2) * 1.05; // Slight speed increase
			this.velocityX = speed * Math.cos(bounceAngle) * (isLeftPaddle ? 1 : -1);
			this.velocityY = -speed * Math.sin(bounceAngle) - paddleMomentum * 0.2; // Add paddle momentum
      
			// Move ball out of paddle to prevent multiple collisions
			this.mesh.position.x = paddleX + (isLeftPaddle ? 1 : -1) * 
			(paddle.paddleWidth / 2 + this.radius);
		}
	}
}

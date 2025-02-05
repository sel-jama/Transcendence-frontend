import { Config } from './Config.js'

export class PowerUp {
    constructor(scene, powerUpInfo) {
		this.scene = scene;
		this.powerUpInfo = powerUpInfo;
        this.arena = scene.arena;
		this.ball = scene.ball;

        // PowerUp object properties
        this.size = 0.05;
        this.geometry = new Config.THREE.SphereGeometry(this.size);
        this.material = new Config.THREE.MeshLambertMaterial({ 
            color: this.getClanColor(),
        });
        this.mesh = new Config.THREE.Mesh(this.geometry, this.material);
        this.initialZ = this.arena.arenaDepth / 2 + this.size;

        // true if PowerUp is illusion
		this.illusion = false;
    }

	getClanColor() {
        const clanColors = {
            'SCAVENGERS': 0x0000ff,    // Blue
            'RAIDERS': 0xff0000,    // Red
            'VERTEX': 0x00ff00   // Green
        };
        return clanColors[this.powerUpInfo.clan];
    }

    spawn() {
        this.mesh.position.set(this.powerUpInfo.x, this.powerUpInfo.y, this.initialZ);
        this.arena.mesh.add(this.mesh);
    }

    remove() {
        this.arena.mesh.remove(this.mesh);
    }

	checkExpired() {
		return Date.now() - this.spawnTime >= this.duration;
	}

    checkCollision() {
        if (!this.mesh)
			return false;
        
        const powerUpBounds = {
            minX: this.mesh.position.x - this.size/2,
            maxX: this.mesh.position.x + this.size/2,
            minY: this.mesh.position.y - this.size/2,
            maxY: this.mesh.position.y + this.size/2
        };

        const ballBounds = {
            minX: this.ball.mesh.position.x - this.ball.radius,
            maxX: this.ball.mesh.position.x + this.ball.radius,
            minY: this.ball.mesh.position.y - this.ball.radius,
            maxY: this.ball.mesh.position.y + this.ball.radius
        };

		const	isValidDirection = ((this.owner.side === 'left' && this.ball.velocityX > 0) ||
									(this.owner.side === 'right' && this.ball.velocityX < 0));
		if (!isValidDirection)
			return false;

        return !(powerUpBounds.minX > ballBounds.maxX || 
                powerUpBounds.maxX < ballBounds.minX || 
                powerUpBounds.minY > ballBounds.maxY || 
                powerUpBounds.maxY < ballBounds.minY);
    }

	applyPowerUp() {
		this.isActive = true;
		if (this.owner.clan == "SCAVENGERS"){
			this.sizePowerUp();
		}
		else if (this.owner.clan == "RAIDERS"){
			this.speedPowerUp();
		}
		else if (this.owner.clan == "VERTEX"){
			this.illusionPowerUp();
		}
	}

	speedPowerUp () {
		this.owner.paddleSpeed *= 1.5;
		setTimeout(() => {
			this.removeAbility();
        }, this.abilityDuration);
	}

	sizePowerUp () {
		this.owner.paddleHeight = 0.4;
		this.owner.updatePaddleGeometry(this.owner.mesh.position);

		setTimeout(() => {
			this.removeAbility();
        }, this.abilityDuration);
	}

	illusionPowerUp () {
		this.illusion = true;
		this.illusions = [];
		this.numIllusions = 2;

		for (let i = 0; i < this.numIllusions; i++) {
			const illusion = this.createIllusion();
			this.illusions.push(illusion);
			this.arena.mesh.add(illusion.mesh);
		}

		const updateIllusions = () => {
			if (this.scene.pause)
				return ;
			this.illusions.forEach(illusion => {
				illusion.mesh.position.x += illusion.velocityX;
				illusion.mesh.position.y += illusion.velocityY;

				// Bounce off vertical walls (top and bottom)
				if (Math.abs(illusion.mesh.position.y) >
							this.arena.arenaHeight / 2 - this.ball.radius) {
					illusion.velocityY = -illusion.velocityY;
					// Adjust position to prevent sticking
					illusion.mesh.position.y = Math.sign(illusion.mesh.position.y) *
						(this.arena.arenaHeight / 2 - this.ball.radius);
				}

				// Bounce off horizontal walls (left and right)
				if (Math.abs(illusion.mesh.position.x) >
							this.arena.arenaWidth / 2 - this.ball.radius) {
					illusion.velocityX = -illusion.velocityX;
					// Adjust position to prevent sticking
					illusion.mesh.position.x = Math.sign(illusion.mesh.position.x) *
						(this.arena.arenaWidth / 2 - this.ball.radius);
				}
			});
		};

        const intervalId = setInterval(updateIllusions, 16);
		this.illusionIntervalId = intervalId;

		// setTimeout(() => {
		// 	this.clearIllusion();
		// }, this.abilityDuration);
	}

	 createIllusion() {
		const geometry = new Config.THREE.SphereGeometry(this.ball.radius);
        const material = new Config.THREE.MeshLambertMaterial({
            color: this.ball.color,
            opacity: 0.5,
            transparent: true
        });
        const mesh = new Config.THREE.Mesh(geometry, material);
        
        // Random initial position near the real ball
        const initialX = this.ball.mesh.position.x + (Math.random() - 0.5) * 0.2;
        const initialY = this.ball.mesh.position.y + (Math.random() - 0.5) * 0.2;

		const xDirection = this.owner === 'left' ? 1 : -1;
        
        // Random velocity
        const speed = 0.02; // Adjust this to control illusion ball speed
        const angle = Math.random() * 2 * Math.PI;
        const velocityX = speed * Math.cos(angle) * xDirection;
        const velocityY = speed * Math.sin(angle);

        mesh.position.set(
            initialX,
            initialY,
            this.ball.mesh.position.z
        );

        return { 
            mesh, 
            velocityX, 
            velocityY
        };
    }

	clearIllusion () {
		if (this.illusionIntervalId){
			clearInterval(this.illusionIntervalId);
		}
		this.illusions.forEach(illusion => {
			this.arena.mesh.remove(illusion.mesh);
		});
		this.illusions = [];
	}

	removeAbility() {
		this.isActive = false;
		if (this.owner.clan == "SCAVENGERS"){
			this.owner.paddleHeight = this.originalSize;
			this.owner.updatePaddleGeometry(this.owner.mesh.position);
		}
		else if (this.owner.clan == "RAIDERS"){
			this.owner.paddleSpeed = this.originalSpeed;
		}
		else if (this.owner.clan == "VERTEX"){
				this.clearIllusion();
		}
	}
}

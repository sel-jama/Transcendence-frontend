import { Config } from './Config.js'

export class Paddle {
	constructor( scene, side, controlScheme, clan ) {
		this.scene = scene;
		this.arena = scene.arena;

		//Paddle propreties
		this.paddleWidth = 0.06;
		this.paddleHeight = 0.2;
		this.paddleDepth = 0.05;
		this.side = side; this.clan = clan;

		if (this.side == "right")
			this.paddleX = this.arena.arenaWidth / 2 - this.paddleWidth / 2; // Right edge
		else if (this.side == "left")
			this.paddleX = this.paddleWidth / 2 - this.arena.arenaWidth / 2; // left edge
		this.paddleZ = this.arena.arenaDepth / 2 + this.paddleDepth / 2; // Directly on top

		// Paddle drawing ~solid color
		this.geometry = new Config.THREE.BoxGeometry(this.paddleWidth, this.paddleHeight,
			this.paddleDepth);
		this.material = new Config.THREE.MeshLambertMaterial({color: "white"})
		this.mesh = new Config.THREE.Mesh(this.geometry, this.material);
		this.mesh.position.set(this.paddleX, 0, this.paddleZ);

		this.x = this.mesh.position.x;
		this.y = this.mesh.position.y;
		this.paddleLastY = this.mesh.position.y;

		//Paddle movements
		this.paddleSpeed = 0.02;
		if (controlScheme == "arrows"){
			this.upKey = 38;
			this.downKey = 40;
		}
		else if (controlScheme == "ws"){
			this.upKey = 87;
			this.downKey = 83;
		}

		//Paddle scoring
		this.score = 0;
	}


	updatePaddleGeometry(position) {
		if (this.mesh){
			this.arena.mesh.remove(this.mesh);
		}

		this.geometry = new Config.THREE.BoxGeometry(this.paddleWidth, this.paddleHeight, this.paddleDepth);
		this.material = new Config.THREE.MeshLambertMaterial({color: "white"})
		this.mesh = new Config.THREE.Mesh(this.geometry, this.material);
		this.mesh.position.copy(position);
		this.paddleLastY = this.mesh.position.y;
		this.arena.mesh.add(this.mesh);
	}


	reset (){
		this.mesh.position.set(this.paddleX, 0, this.paddleZ);
	}

	update( keyPressed ) {
		if (!this.mesh)
			return;
		this.lastY = this.mesh.position.y;
		if (keyPressed[this.upKey]){
			const newY = this.mesh.position.y + this.paddleSpeed;
			const maxY = this.arena.arenaHeight / 2 - this.paddleHeight / 2;
			if (newY <= maxY) {
				this.mesh.position.y = newY;
			}
		}
		if (keyPressed[this.downKey]){
			const newY = this.mesh.position.y - this.paddleSpeed;
			const maxY = -this.arena.arenaHeight / 2 + this.paddleHeight / 2;
			if (newY >= maxY) {
				this.mesh.position.y = newY;
			}
		}
	}
}

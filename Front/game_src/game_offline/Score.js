import { Config } from './Config.js'
import { TextManager } from './TextManager.js';

export class Score {
	constructor( scene, color) {
		this.THREE = Config.THREE;
		this.scene = scene;
		this.game = scene.game;
		this.arena = scene.arena;
		this.color = 0xffffff;
		this.scoreLeft = 0;
		this.scoreRight = 0;

		this.textManager = new TextManager(this.scene, this.arena);
		this.textMeshes = [];

		this.createScoreText();
	}
	
	async createScoreText() {
		this.textMeshes = [ 
			await this.textManager.createText('0', 0.1, 0.02, this.color, [this.arena.arenaCenter.x - 0.6, this.arena.arenaCenter.y - 0.5, this.arena.arenaCenter.z +  this.arena.arenaDepth / 2 - 0.01]),
			await this.textManager.createText('0', 0.1, 0.02, this.color, [ this.arena.arenaCenter.x + 0.5, this.arena.arenaCenter.y -0.5,this.arena.arenaCenter.z + this.arena.arenaDepth / 2 - 0.01])
		];
	}

	async updateScore(leftPaddle, rightPaddle) {
		if (typeof leftPaddle === 'object' && leftPaddle !== null){
			this.scoreLeft = leftPaddle.score;
		}
		else
			this.scoreLeft = leftPaddle;
		if ( typeof rightPaddle === 'object' && rightPaddle !== null){
			this.scoreRight = rightPaddle.score;
		}
		else
			this.scoreRight = rightPaddle;

		await this.updateScoreDisplay();
	}

	async updateScoreDisplay() {
		if (this.textMeshes.length == 2){
			const leftScore = this.scoreLeft.toString();
			const rightScore = this.scoreRight.toString();
			await this.textManager.updateText(this.textMeshes[0], leftScore, 0.1, 0.02);
			await this.textManager.updateText(this.textMeshes[1], rightScore, 0.1, 0.02);
		}
	}

	updateScorePosition() {
		const arenaCenter = this.arena.getCenter();
		if (this.textMeshes.length == 2) {
			this.textMeshes[0].position.set(arenaCenter.x - 0.6, arenaCenter.y - 0.5, arenaCenter.z + this.arena.arenaDepth / 2 - 0.01);
			this.textMeshes[1].position.set(arenaCenter.x + 0.5, arenaCenter.y - 0.5, arenaCenter.z + this.arena.arenaDepth / 2 - 0.01);
		}
	}
}

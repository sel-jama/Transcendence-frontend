import { TextManager } from "./TextManager.js";

export class Countdown {
	constructor( scene, arena ) {
		this.scene = scene;
		this.arena = arena;
		this.arenaCenter = arena.arenaCenter;
		this.countdownMesh = null;
		this.textManager = new TextManager(scene, arena);
	}

	async startCountdown( side ) {
		this.scene.game.socket.send(JSON.stringify({ event: "game_pause"}));
		this.scene.pause = true;

        const leftSide = [this.arenaCenter.x - 0.6, this.arenaCenter.y - 0.07, this.arenaCenter.z + this.arena.arenaDepth / 2 - 0.01];
        const rightSide = [this.arenaCenter.x + 0.5, this.arenaCenter.y - 0.07, this.arenaCenter.z + this.arena.arenaDepth / 2 - 0.01];

		if (side === 'lr') {
			this.countdownMesh = [
				await this.textManager.createText('3', 0.15, 0.02, 0xffff00, leftSide),
				await this.textManager.createText('3', 0.15, 0.02, 0xffff00, rightSide),
			]
		}
		else {
			this.countdownMesh = await this.textManager.createText('3', 0.15, 0.02, 0xffff00,
			side === 'l' ? leftSide : rightSide);
		}

		let		countdown = 2;

		const	updateText = () => {
			if (this.countdownMesh.length === 2) {
				this.textManager.updateText(this.countdownMesh[0], countdown.toString(), 0.15, 0.02);
				this.textManager.updateText(this.countdownMesh[1], countdown.toString(), 0.15, 0.02);
			}
			else {
				this.textManager.updateText(this.countdownMesh, countdown.toString(), 0.15, 0.02);
			}
		};

		const	removeText = () => {
			if (this.countdownMesh.length === 2) {
				if (this.scene && this.scene.group){
					this.scene.group.remove(this.countdownMesh[0]);
					this.scene.group.remove(this.countdownMesh[1]);
				}
			}
			else {
				if (this.scene && this.countdownMesh && this.scene.group){
					this.scene.group.remove(this.countdownMesh);
				}
			}
		};

		const countdownInterval = setInterval(() => {
			updateText();
			if (countdown <= 0){
				clearInterval(countdownInterval);
				removeText();
				this.scene.pause = false;
				if (!this.scene.gameOver)
					this.scene.game.socket.send(JSON.stringify({ event: "game_start"}));
			}
			countdown--;
		}, 1000);
	}
}

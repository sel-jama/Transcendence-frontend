import { Scene } from './Scene.js'

export class Game {
	constructor( config = {}, gameSettings, onGameEnd) {
		this.pause = false;
		this.goalLimit = 5;
		this.scene = new Scene(this, config, gameSettings, onGameEnd);
	}

	start() {
		this.scene.start()
	}

	update() {
		if (!this.scene.pause)
			this.scene.update();
		this.scene.controls.update();
		this.scene.updateCameraTransition();
	}

	pauseGame() {
		this.pause = true;
	}

	resumeGame() {
		this.pause = false;
	}
}


import { Scene } from './Scene.js'

export class Game {
	constructor( clientId, config = {}, socket, gameSettings, client ) {
		this.clientId = clientId;
		this.pause = false;
		this.socket = socket;
		this.scene = new Scene(this, config, gameSettings);
		this.client_db = client;
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


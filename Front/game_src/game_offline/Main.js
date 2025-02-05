import { Game } from './Game.js'

const gameConfig = {
	gameInfo:{
	},
    modelName: 'CASTLE',
    environment: {
    },
    players: {
        paddle1Clan: 'SCAVENGERS',
        paddle2Clan: 'VERTEX'
    }
};

export function startGame( gameSettings, onGameEnd ){
	const game = new Game( gameConfig, gameSettings, onGameEnd);

	game.scene.render = () => {
		game.scene.renderer.render(game.scene.scene, game.scene.camera);
		game.update();
	}
	game.start();
}

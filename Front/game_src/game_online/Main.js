import { Game } from './Game.js'

const gameConfig = {
	gameInfo:{
	}, modelName: 'CASTLE',
    environment: {
    },
    players: {
        paddle1Clan: 'SCAVENGERS',
        paddle2Clan: 'RAIDERS'
    }
};

//-----------------------------------------------Game Class--------------------------------
class GameSession {
	constructor( roomId = null, playerId = null, tournamentSocket = null, stage = null ){
		this.roomId = roomId;
		this.playerId = playerId
		this.socket = null;
		this.tournamentSocket = tournamentSocket;
		this.stage = stage;
		this.end = false;
		this.winner = null;
		this.gameSettings = null;
		this.onError = null;
		this.semifinal = null;
		this.score = null;
		this.client;
	}

	async startGame( gameSettings = null ) {
		this.gameSettings = gameSettings;

		try {
			const response = await fetch("/api/user/",{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				credentials: 'include'
			});
       
			if(response.ok){
				this.client =  await response.json();
			}else{
				console.log("Failed to fetch user data", response.statusText);
				return ;
			}
		} catch (error) {
			console.log("Error fetching user data:", error);
			return ;
		}

		// if (this.client) {
		// 	this.socket.send(JSON.stringify({ event: 'client_info', client: this.client }));
		// }

		// Creating new Game
		if (this.gameSettings){

			this.socketManagement();
			this.socket.addEventListener('open', () => {
		    this.socket.send(JSON.stringify({ event: 'create_room', client: this.client }));
			});
		}
		// Joining a Game
		else if (!this.gameSettings){
			this.socketManagement();
			this.socket.addEventListener('open', () => {
		    this.socket.send(JSON.stringify({ event: 'join_room', client: this.client })); });
		}
	}

	socketManagement(){
        const url = this.roomId ? 
        `wss://${window.location.host}/ws/game/play/${this.roomId}/` : 
        `wss://${window.location.host}/ws/game/play/`;
		
		this.socket = new WebSocket(url);

		this.socket.onopen = (e) => {
            // console.log('--> Game WebSocket connection established');
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            switch(data.event) {
                case 'already_ingame':
					this.onError('You are already in another game');
                    break;
                case 'room_created':
                    this.handleRoomAssignment(data);
                    break;
                    
                case 'room_joined':
                    this.handleRoomAssignment(data);
                    break;
                    
                case 'join_failed':
					if (this.onError) {
						this.onError(data.reason || 'No rooms available');
					}
                    break;
                    
                case 'game_over':
                    this.handleGameOver(data);
                    break;
            }
        };

        this.socket.onclose = (e) => {
            // console.log('WebSocket connection closed');
        };
	}

    handleRoomAssignment(data) {
        this.roomId = data.room_id;
        this.id = data.client_id;

		// console.log(`Room ID: ${this.roomId}, Client ID: ${this.id}`);
        
        // If creator (player 1), send settings
        if (this.id === 1 && this.gameSettings) {
            const settingsData = JSON.stringify({ 
                event: 'settings', 
                settings: this.gameSettings 
            });
            this.socket.send(settingsData);
        }
        
        // If joiner (player 2) and settings were received
        if (this.id === 2 && data.settings) {
            this.gameSettings = data.settings;
        }
        
        // Initialize game
        this.game = new Game(this.id, gameConfig, this.socket, this.gameSettings, this.client);
        this.game.scene.render = () => {
           this.game.scene.renderer.render(this.game.scene.scene, this.game.scene.camera);
           this.game.update();
        }
        this.game.start(this.client);
    }

	handleGameOver(data) {
		if (this.id === data.state.winner_id) {
			if (this.tournamentSocket) {
				this.score = this.game.scene.paddle1.score + ' - ' + this.game.scene.paddle2.score;
                this.end = true;
                this.winner = this.playerId;
                if (this.stage === 'semifinal') {
                    this.tournamentSocket.send(JSON.stringify({ 
                        event: "semifinal_complete", 
                        winner_id: this.playerId, 
						score: this.score,
                    }));
                } else {
                    this.tournamentSocket.send(JSON.stringify({ 
                        event: "final_complete", 
                        winner_id: this.playerId 
                    }));
                }
            }
        }
    }
}

export { GameSession };

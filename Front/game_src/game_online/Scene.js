import { Config } from './Config.js'
import { Arena } from './Arena.js'
import { Ball } from './Ball.js'
import { Paddle } from './Paddle.js'
import { Score } from './Score.js'
import { Countdown } from './Countdown.js'
import { ModelManager } from './ModelManager.js'
import { PowerUp } from './PowerUp.js'
// import { Router } from 'express'
export class Scene {

	constructor( game, gameConfig, gameSettings ) {
		this.game = game;
		this.clientId = game.clientId;
		this.gameConfig = gameConfig;
		this.gameOver = false;
		this.gameSettings = gameSettings;

		this.group = new Config.THREE.Group();
		this.pause = game.pause;
		this.loader = new Config.GLTFLoader();
		this.keyPressed = [];

        this.boundEventListeners = {
            popstate: null,
            keydown: null,
            keyup: null,
            resize: null,
            socketMessage: null
        };

		this.player1 = null;
		this.player2 = null;

		this.checkLogoutInterval = null; // Store the interval ID

		this.init();
	}

	init() {
		this.initThreeScene();
		this.initModel();
		this.initArena();
		this.initText();
		this.initPaddles();
		this.initBall();
		this.initPowerUp();
		this.initLights();
		this.initCamera();
		this.initControls();
		this.addGroupToScene();

		this.checkLogoutInterval = setInterval(() => {
			this.checkLogout();
		}, 5000);

		//Axis helper
		// const axesHelper = new Config.THREE.AxesHelper( 5 );
		// axesHelper.setColors('white', 'green', 'red');
		// this.scene.add( axesHelper );
	}

	initPowerUp(){
		this.powerUp = null;
	}
	
	initThreeScene() {
		//Scene
		this.scene = new Config.THREE.Scene();
		this.scene.background = new Config.THREE.Color("black");

		//Canvas
		this.canvas = document.querySelector(".webgl");
		this.renderer = new Config.THREE.WebGLRenderer({
			canvas: this.canvas,
			powerPreference: "high-performance",
			antialias: true,
		});
		
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.toneMapping = Config.THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.6; // Darker exposure
        this.renderer.outputColorSpace = Config.THREE.SRGBColorSpace;
	}

	addGroupToScene() {
		this.scene.add(this.group);
	}

	initModel(){
		this.environmentModel = new ModelManager(this.scene);
		// this.modelName = this.gameConfig.modelName;
		this.modelName = this.gameSettings.arena;
		this.environmentModel.loadModel(this.modelName, () => {
			if (this.renderer)
				this.game.socket.send(JSON.stringify({ event: "ready", client_id: this.clientId }));
		});

		this.brightLight = this.environmentModel.brightLight;
		this.colors = this.environmentModel.getColors();
		this.cameraOffset = this.environmentModel.getCameraOffset();
		this.arenaId = this.environmentModel.getArenaId();
	}

	initArena() {
		this.arena = new Arena(this.arenaId);

		// this.group.position.copy
		this.group.add(this.arena.mesh);

		// GridHelper
		// this.gridHelper = new Config.THREE.GridHelper(10, 10); // Size 10x10, 10 divisions
		// this.gridHelper.rotation.x = Math.PI / 2; // Rotate to match the arena's orientation
		// this.gridHelper.position.copy(this.arena.arenaCenter);
		// this.group.add(this.gridHelper);
	}

	initText() { this.score = new Score(this, this.colors.score); this.countdown = new Countdown(this, this.arena);
	}

	initPaddles() {
		this.paddle1 = new Paddle(this, "left", "ws", this.gameConfig.players.paddle1Clan); // left paddle
		this.paddle2 = new Paddle(this, "right", "arrows", this.gameConfig.players.paddle2Clan); // right paddle
		this.arena.mesh.add(this.paddle1.mesh);
		this.arena.mesh.add(this.paddle2.mesh);
	}

	initBall() {
		this.ball = new Ball(this, this.colors.ball);
		this.arena.mesh.add(this.ball.mesh);
	}

	initLights() {

		// Bright light
		if (this.brightLight){
			this.light = [
				new Config.THREE.DirectionalLight("white", 0.5),
				new Config.THREE.DirectionalLight("white", 0.5),
				new Config.THREE.DirectionalLight("white", 1.5),
			];
			this.light[0].position.set(0, 1, 0);
			this.light[1].position.set(0, 1, 0);
			this.light[2].position.set(0, 1, 1);

			this.scene.add(...this.light);
		}

		this.mainLight = new Config.THREE.DirectionalLight('#704030', 0.3);
        this.mainLight.position.set(5, 10, 7);
        this.mainLight.castShadow = true;

		// Radiation/Contamination point light - suggesting environmental hazard
        this.radiationLight = new Config.THREE.PointLight('#00ff00', 0.5, 50);
        this.radiationLight.position.set(0, 5, 0);
        this.scene.add(this.radiationLight);
        
        // Configure shadow properties for dramatic effect
        this.mainLight.shadow.mapSize.width = 2048;
        this.mainLight.shadow.mapSize.height = 2048;
        this.mainLight.shadow.camera.near = 1;
        this.mainLight.shadow.camera.far = 50;
        this.mainLight.shadow.bias = -0.001;
        this.scene.add(this.mainLight);


		// Dim light
		// Arena spotlight
		this.arenaLight = new Config.THREE.SpotLight('white', 8);
		this.arenaLight.position.set(this.arena.arenaCenter.x, this.arena.arenaCenter.y, this.arena.arenaCenter.z + 5);
		this.arenaLight.angle = Math.PI / 3;
		this.arenaLight.penumbra = 0.5;
		this.arenaLight.decay = 1;
		this.arenaLight.distance = 80;
		this.arenaLight.castShadow = true;
		this.scene.add(this.arenaLight);

		// Ambient light
		this.ambientLight = new Config.THREE.AmbientLight('#102010', 0.1);
        this.scene.add(this.ambientLight);

		this.scene.fog = new Config.THREE.FogExp2('#1a1f1a', 0.02);

		// Flickering emergency light effect
        this.emergencyLight = new Config.THREE.SpotLight('#ff4500', 1, 100, Math.PI / 4, 0.5, 1);
        this.emergencyLight.position.set(-5, 5, -5);
        this.scene.add(this.emergencyLight);


		// Renderer settings for apocalyptic mood
        this.renderer.setClearColor('#0a0c0a'); // Dark, almost black background
        this.renderer.toneMappingExposure = 0.5; // Darker exposure
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = Config.THREE.PCFSoftShadowMap;
	}

	initCamera() {
		this.camera = new Config.THREE.PerspectiveCamera(75,
			window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.up.set(0, 0, 1);
		this.camera.position.set(
		this.arena.arenaCenter.x + this.cameraOffset.x,
		this.arena.arenaCenter.y + this.cameraOffset.y, 
        this.arena.arenaCenter.z + this.cameraOffset.z
		);

		this.initCameraTransition();
		this.scene.add(this.camera); }

	initControls() {
		this.controls = new Config.OrbitControls(this.camera, this.renderer.domElement);
        
		// Copntrols settings
		this.controls.enableDamping = true;
		this.controls.enableRotate = true;

		// Controls limits
		this.controls.minDistance = 1.5;
		this.controls.maxDistance = 90;

		// Rotation limits for the x-axis
		this.controls.minPolarAngle = 0; // Minimum tilt (top-down)
		this.controls.maxPolarAngle = Math.PI / 2; // Maximum tilt (horizontal view)

		// Target the center of the arena
		this.controls.target.set(this.arena.arenaCenter.x, this.arena.arenaCenter.y, this.arena.arenaCenter.z);
        
		// Mouse buttons configuration
		this.controls.mouseButtons = {
			LEFT: Config.THREE.MOUSE.ROTATE,
			MIDDLE: Config.THREE.MOUSE.DOLLY,
			RIGHT: Config.THREE.MOUSE.PAN
		};
		this.controls.panSpeed = 1.0;

		this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 5.0; // Adjust speed as needed
		// Update controls
		this.controls.update();
	}

	disconnection() {
		this.game.socket.send(JSON.stringify({
			event: "disconnect",
			client: this.game.client_db,
		}));
		setTimeout(() => {
			this.dispose();
		}, 100);

	}

	async checkLogout(){
		try {
			const response = await fetch("/api/user/",{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				credentials: 'include'
			});
       
			if(!response.ok){
				this.disconnection();
				Router.go("/methods");
			}
		} catch (error) {
			console.log("Error fetching user data:", error);
			return ;
		}
 	}
 
 	eventListeners() {
 		this.boundEventListeners.popstate = (event) => {
 			this.gameOver = true;
 			this.game.socket.send(JSON.stringify({
 				event: "disconnect",
 				client: this.game.client_db,
 			}));
 			setTimeout(() => {
 				this.dispose();
			}, 100);
        };

		this.boundEventListeners.keydown = (e) => {
            this.game.socket.send(JSON.stringify({ event: "keydown", client_id: this.clientId, key: e.keyCode }));
        };

        this.boundEventListeners.keyup = (e) => {
            this.game.socket.send(JSON.stringify({ event: "keyup", client_id: this.clientId, key: e.keyCode }));
        };

        this.boundEventListeners.resize = () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        };

		this.boundEventListeners.socketMessage = (message) => {
			// this.game.socket.addEventListener('message', (message) => {
			const data = JSON.parse(message.data);

			if (`${data.event}` === 'state_update'){
				if (!data.state)
					return
				const serverState = data.state

				if (serverState.game_over){
					this.gameOver = true;
					const winner = serverState.game_over.winner;
					const leftScore = serverState.paddles.left.score;
					const rightScore = serverState.paddles.right.score;

					this.paddle1.score = leftScore;
					this.paddle2.score = rightScore;

					this.startCameraTransition(
						this.arena.arenaCenter.x + this.cameraOffset.x,
						this.arena.arenaCenter.y + this.cameraOffset.y, 
						this.arena.arenaCenter.z + this.cameraOffset.z
					);
					this.isInitialOrbit = true;
					this.controls.autoRotate = true;

					const overlay = document.getElementById('postGameOverlay');
					const postGameView = document.getElementById('postGameView');
					const player1Label = document.getElementById('player1Label');
					const player2Label = document.getElementById('player2Label');
    
					// Remove the fade-out class to stop the transition
					overlay.classList.remove('fade-out');
   		
					// Set the display style to make the overlay visible again
					overlay.style.display = 'flex';

					postGameView.style.display = 'flex';

					// Optional: Reset any other styles or states for the overlay
					overlay.style.opacity = '1';


					setTimeout(() => {
						// Update the score
						const scoreDisplay = document.getElementById('scoreDisplay');
						scoreDisplay.textContent = `${leftScore} - ${rightScore}`;
						scoreDisplay.classList.remove('hidden');
						scoreDisplay.classList.add('visible');
						
						// Update the win/lose message
						const winLoseMessage = document.getElementById('winLoseMessage');
						if (winner === 'draw'){
						    winLoseMessage.textContent = 'Your opponent left';
						    winLoseMessage.style.color = '#FF0000'; // Red for loss
						}
						else if ((winner === 'left' && this.clientId === 1) || (winner === 'right' && this.clientId === 2)) {
						    winLoseMessage.textContent = 'You Won!';
						    winLoseMessage.style.color = '#00FF00'; // Green for win
						} else {
						    winLoseMessage.textContent = 'You Lost!';
						    winLoseMessage.style.color = '#FF0000'; // Red for loss
						}
						winLoseMessage.classList.remove('hidden');
						winLoseMessage.classList.add('visible');
						
						// Show player labels
						if (this.player1 && this.player2){
							player1Label.textContent = this.player1.username;
    						player2Label.textContent = this.player2.username;

							document.getElementById('player1Label').classList.remove('hidden');
							document.getElementById('player2Label').classList.remove('hidden');
							document.getElementById('lobbyButton').classList.remove('hidden');
							document.getElementById('player1Label').classList.add('visible');
							document.getElementById('player2Label').classList.add('visible');
						}
						document.getElementById('lobbyButton').classList.add('visible');

					}, 2000); // Adjust delay to match camera transition duration

					// this.dispose()
					this.game.socket.send(JSON.stringify({
						event: "disconnect",
						client: this.game.client_db,
					}));
					setTimeout(() => {
						this.dispose();
					}, 100);

					return ;
				}

				this.ball.mesh.position.set(serverState.ball.x, serverState.ball.y, this.ball.mesh.position.z);
				this.ball.velocityX = serverState.ball.vx;
				this.ball.velocityY = serverState.ball.vy;

				this.paddle1.mesh.position.y = serverState.paddles.left.y;
				this.paddle1.paddleSpeed = serverState.paddles.left.paddle_speed;

				if (this.paddle1.paddleHeight != serverState.paddles.left.height){
					this.paddle1.paddleHeight = serverState.paddles.left.height;
					this.paddle1.updatePaddleGeometry(this.paddle1.mesh.position);
				}

				this.paddle2.mesh.position.y = serverState.paddles.right.y;
				this.paddle2.paddleSpeed = serverState.paddles.right.speed;

				if (this.paddle2.paddleHeight != serverState.paddles.right.height){
					this.paddle2.paddleHeight = serverState.paddles.right.height;
					this.paddle2.updatePaddleGeometry(this.paddle2.mesh.position);
				}

				if (this.paddle1.score != serverState.paddles.left.score ||
					this.paddle2.score != serverState.paddles.right.score){
					if (this.paddle1.score != serverState.paddles.left.score)
						this.countdown.startCountdown('r');
					else
						this.countdown.startCountdown('l');
					this.paddle1.score = serverState.paddles.left.score;
					this.paddle2.score = serverState.paddles.right.score;
					this.score.updateScore(this.paddle1.score, this.paddle2.score);
				}
				if (serverState.power_up){
					if (!this.powerUp){
						this.powerUp = new PowerUp(this, serverState.power_up);
						this.powerUp.spawn();
					}
					if (serverState.power_up.is_active){
						this.powerUp.remove();
						if (serverState.paddles.right.illusion || serverState.paddles.left.illusion){
							if (!this.powerUp.illusion)
								this.powerUp.illusionPowerUp();
						}
					}
				}
				else{
					if (this.powerUp){
						this.powerUp.remove();
						if (this.powerUp.illusion){
							this.powerUp.clearIllusion();
							this.powerUp.illusion = false;
						}
						this.powerUp = null;
					}
				}
			}

			else if (`${data.event}` === 'ready'){

				this.player1 = data.player_1;
				this.player2 = data.player_2;

				const player1Span = document.querySelector('.player1');
    			const player2Span = document.querySelector('.player2');

				player1Span.textContent = this.player1.username;
    			player2Span.textContent = this.player2.username;

				// Select the overlay element
				const overlay = document.getElementById('preGameOverlay');
				overlay.querySelector('.center-instruction').style.display = 'none'; // Remove the waiting text


				// Display the matchbox 
				const matchMakingContainer = document.getElementById('matchMakingContainer');
				matchMakingContainer.style.display = 'flex';

				// After a 5 s countdown start the camera transition
				let countdown = 5;
				const timerElement = matchMakingContainer.querySelector('.timer');
				timerElement.textContent = `Starting in ${countdown}s`;

				const countdownInterval = setInterval(() => {
				    countdown -= 1;
				    timerElement.textContent = `Starting in ${countdown}s`;
				
				    if (countdown <= 0) {
				        clearInterval(countdownInterval);
				
				        // Hide the matchMakingContainer
				        matchMakingContainer.style.display = 'none';
				
				        // Add the fade-out class to the overlay element
				        overlay.classList.add('fade-out');
				
				        // Wait for the fade-out transition to complete
				        setTimeout(() => {
				            // Hide the overlay
				            overlay.style.display = 'none';
				        }, 500);
				
				        if (this.isInitialOrbit && !this.gameOver) {
				            this.isInitialOrbit = false;
				            this.controls.autoRotate = false;
				
							const gameOverlay = document.getElementById('gameView');
							if (gameOverlay !== null)
								gameOverlay.querySelector('.overlay').style.display = 'none';

				            // Start the camera transition
				            this.startCameraTransition(
				                this.arena.arenaCenter.x,
				                this.arena.arenaCenter.y - 1,
				                this.arena.arenaCenter.z + 1.5
				            );
				        }
				    }
				}, 1000);
			}
		};

        window.addEventListener('popstate', this.boundEventListeners.popstate);
        window.addEventListener('keydown', this.boundEventListeners.keydown);
        window.addEventListener('keyup', this.boundEventListeners.keyup);
        window.addEventListener('resize', this.boundEventListeners.resize);
        this.game.socket.addEventListener('message', this.boundEventListeners.socketMessage);
	}

	initCameraTransition() {
		this.isTransitioning = false; // To track if a transition is active
		this.transitionStart = null; // Start time of the transition
		this.transitionDuration = 3; // Duration of the transition in seconds
		this.startCameraPosition = new Config.THREE.Vector3(); // Initial camera position
		this.targetCameraPosition = new Config.THREE.Vector3(); // Target camera position
		this.clock = new Config.THREE.Clock(); // Clock to manage time
	}

	startCameraTransition(targetX, targetY, targetZ) {
		if (this.isTransitioning) return; // Prevent multiple transitions

		this.isTransitioning = true;
		this.transitionStart = this.clock.getElapsedTime();
		this.startCameraPosition.copy(this.camera.position);
		this.targetCameraPosition.set(targetX, targetY, targetZ);
	}

	updateCameraTransition() {
		if (!this.isTransitioning)
			return;

		const elapsedTime = this.clock.getElapsedTime() - this.transitionStart;
		const t = elapsedTime / this.transitionDuration;

		if (t >= 1){
			// Transition complete
			this.camera.position.copy(this.targetCameraPosition);
			this.controls.target.set(this.arena.arenaCenter.x, this.arena.arenaCenter.y, this.arena.arenaCenter.z);
			this.controls.update();
			this.isTransitioning = false;

			// Starting the game
			if (!this.gameOver){
				this.countdown.startCountdown('lr');
				this.ball.start(-1);
			}
		}
		else{
			// Interpolate the camera position
			this.camera.position.x = Config.THREE.MathUtils.lerp(this.startCameraPosition.x, this.targetCameraPosition.x, t);
			this.camera.position.y = Config.THREE.MathUtils.lerp(this.startCameraPosition.y, this.targetCameraPosition.y, t);
			this.camera.position.z = Config.THREE.MathUtils.lerp(this.startCameraPosition.z, this.targetCameraPosition.z, t);

			// Update the camera controls target
			this.controls.target.set(this.arena.arenaCenter.x, this.arena.arenaCenter.y, this.arena.arenaCenter.z);
			this.controls.update();
		}
	}

	render = () => {
		this.update();
		this.renderer.render(this.scene, this.camera);
	}

	start() {
		this.pause = true;
		this.isInitialOrbit = true;
		this.eventListeners()
		this.renderer.setAnimationLoop(this.render);
	}

	update() {
		this.controls.update();
	}
	
	dispose() {
        // Stop animation loop
		if (this.renderer)
			this.renderer.setAnimationLoop(null);

        // Remove event listeners
        window.removeEventListener('popstate', this.boundEventListeners.popstate);
        window.removeEventListener('keydown', this.boundEventListeners.keydown);
        window.removeEventListener('keyup', this.boundEventListeners.keyup);
        window.removeEventListener('resize', this.boundEventListeners.resize);
        this.game.socket.removeEventListener('message', this.boundEventListeners.socketMessage);


		if (this.checkLogoutInterval) {
			clearInterval(this.checkLogoutInterval);
			this.checkLogoutInterval = null;
		}

        // Dispose of Three.js objects
		if (this.scene){
			this.scene.traverse(object => {
				if (object.geometry) {
					object.geometry.dispose();
				}
				if (object.material) {
					if (Array.isArray(object.material)) {
						object.material.forEach(material => material.dispose());
					} else {
                    object.material.dispose();
					}
				}
			});
		}

        // Dispose of controls
        if (this.controls) {
            this.controls.dispose();
        }

        // Clear the scene
		if (this.scene){
			while(this.scene.children.length > 0) {
				this.scene.remove(this.scene.children[0]);
			}
		}

        // Dispose of renderer
        if (this.renderer) {
            this.renderer.dispose();
        }

        // Clear references
        this.game.socket.close();
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.group = null;
        this.arena = null;
        this.ball = null;
        this.paddle1 = null;
        this.paddle2 = null;
        this.powerUp = null;
        this.score = null;
        this.countdown = null;
        this.environmentModel = null;
    }
}

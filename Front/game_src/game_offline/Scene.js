import { Config } from './Config.js'
import { Arena } from './Arena.js'
import { Ball } from './Ball.js'
import { Paddle } from './Paddle.js'
import { Score } from './Score.js'
import { Countdown } from './Countdown.js'
import { ModelManager } from './ModelManager.js'
export class Scene {

	constructor( game, gameConfig, gameSettings, onGameEnd) {
		this.game = game;
		this.goalLimit = game.goalLimit;
		this.gameOver = false;
		this.gameConfig = gameConfig;
		this.gameSettings = gameSettings;
		this.onGameEnd = onGameEnd;

		this.group = new Config.THREE.Group();
		this.pause = game.pause;
		this.loader = new Config.GLTFLoader();
		this.keyPressed = [];

        this.boundEventListeners = {
            popstate: null,
            keydown: null,
            keyup: null,
            resize: null,
        };

		this.init();
	}

	init() {
		this.initThreeScene();
		this.initModel();
		this.initArena();
		this.initText();
		this.initPaddles();
		this.initBall();
		this.initLights();
		this.initCamera();
		this.initControls();
		this.addGroupToScene();

		//Axis helper
		// const axesHelper = new Config.THREE.AxesHelper( 5 );
		// axesHelper.setColors('white', 'green', 'red');
		// this.scene.add( axesHelper );
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
		this.modelName = this.gameSettings.arena;
		this.environmentModel.loadModel(this.modelName);

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

	initText() {
		this.score = new Score(this, this.colors.score);
		this.countdown = new Countdown(this, this.arena);
	}

	initPaddles() {
		this.paddle1 = new Paddle(this, "left", "ws", this.gameConfig.players.paddle1Clan);
		this.paddle2 = new Paddle(this, "right", "arrows", this.gameConfig.players.paddle2Clan);
		this.arena.mesh.add(this.paddle1.mesh);
		this.arena.mesh.add(this.paddle2.mesh);
	}

	initBall() {
		this.ball = new Ball(this, this.colors.ball, this.gameSettings.powerUpsEnabled);
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

		// const paddleGlow = (x, z) => {
		// 	const light = new Config.THREE.PointLight('#304030', 0.2, 15);
		// 	light.position.set(x, 2, z);
		// 	return light;
		// };

		// Add lights for each paddle
		// this.paddle1X = this.arenaWidth / 2 - this.paddleWidth / 2; // Right edge
		// this.paddle2X = this.paddleWidth / 2 - this.arena.arenaWidth / 2; // left edge
		// this.paddleZ = this.arena.arenaDepth / 2 + this.paddleDepth / 2; // Directly on top
		//
		// const paddle1Light = paddleGlow(this.paddle1X, this.paddleZ);
		// const paddle2Light = paddleGlow(this.paddle2X, this.paddleZ);
		// this.scene.add(paddle1Light);
		// this.scene.add(paddle2Light);

		// Add subtle light for the ball
		// this.ballLight = new Config.THREE.PointLight('#4a5a3d', 0.3, 10);
		// this.scene.add(this.ballLight);


	}

	updateLights() {
		// Updating light position to follow the ball
		// this.ballLight.position.copy(this.ball.mesh.position);
	}

	initCamera() {
		this.camera = new Config.THREE.PerspectiveCamera(75,
			window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.up.set(0, 0, 1);
		// this.camera.position.set(this.arena.arenaCenter.x, this.arena.arenaCenter.y - 1, this.arena.arenaCenter.z + 1.5);
		this.camera.position.set(
		this.arena.arenaCenter.x + this.cameraOffset.x,
		this.arena.arenaCenter.y + this.cameraOffset.y, 
        this.arena.arenaCenter.z + this.cameraOffset.z
		);

		this.initCameraTransition();
		this.scene.add(this.camera);
	}

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

	eventListeners() {
        // Keyboard controls
        this.boundEventListeners.keyup = (e) => {
			this.keyPressed[e.keyCode] = false;
		};
        this.boundEventListeners.keydown = (e) => {
			this.keyPressed[e.keyCode] = true;
		};
		// Window resize
		this.boundEventListeners.resize = () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        };

		// Click event to start the game
		this.renderer.domElement.addEventListener('click', () => {
			const overlay = document.getElementById('gameOverlay');
			if (overlay) {
				overlay.style.display = 'none';
			}

			if (this.isInitialOrbit) {
				this.isInitialOrbit = false;
				this.controls.autoRotate = false;

				// Start the camera transition
				this.startCameraTransition(
					this.arena.arenaCenter.x,
					this.arena.arenaCenter.y - 1,
					this.arena.arenaCenter.z + 1.5
				);
			}
		});

		// Listen for the back button
		window.addEventListener('popstate', (event) => {
			this.cleanup();
		});

		// Listen for the reload button
		window.addEventListener('beforeunload', (event) => {
			this.cleanup();
		});

        // window.addEventListener('popstate', this.boundEventListeners.popstate);
        window.addEventListener('keydown', this.boundEventListeners.keydown);
        window.addEventListener('keyup', this.boundEventListeners.keyup);
        window.addEventListener('resize', this.boundEventListeners.resize);
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
		this.paddle1.update(this.keyPressed);
		this.paddle2.update(this.keyPressed);
		this.ball.update(this.paddle1, this.paddle2);
	}

	gameOverSequence() {
		this.pause = true;
		this.gameOver = true;
		this.startCameraTransition(
			this.arena.arenaCenter.x + this.cameraOffset.x,
			this.arena.arenaCenter.y + this.cameraOffset.y, 
			this.arena.arenaCenter.z + this.cameraOffset.z
		);
		this.isInitialOrbit = true;
		this.controls.autoRotate = true;

		const overlay = document.getElementById('gameOverlay');
		const player1Label = document.getElementById('player1Label');
		const player2Label = document.getElementById('player2Label');

		// Remove the fade-out class to stop the transition
		overlay.classList.remove('fade-out');

   		
		// Set the display style to make the overlay visible again
		overlay.style.display = 'flex';

		// Optional: Reset any other styles or states for the overlay
		overlay.style.opacity = '1';


		setTimeout(() => {
			// Update the score
			const scoreDisplay = document.getElementById('scoreDisplay');
			scoreDisplay.textContent = `${this.paddle1.score} - ${this.paddle2.score}`;
			scoreDisplay.classList.remove('hidden');
			scoreDisplay.classList.add('visible');
			
			// Update the win/lose message
			const winLoseMessage = document.getElementById('winLoseMessage');
			if (this.paddle1.score > this.paddle2.score) {
			    winLoseMessage.textContent = 'Player 1 Wins!';
				this.onGameEnd('1', `${this.paddle1.score} - ${this.paddle2.score}`);
				this.cleanup();
			}
			else{
			    winLoseMessage.textContent = 'Player 2 Wins!';
				this.onGameEnd('2', `${this.paddle1.score} - ${this.paddle2.score}`);
				this.cleanup();
			}
			winLoseMessage.style.color = '#00FF00'; // Green for win
			winLoseMessage.classList.remove('hidden');
			winLoseMessage.classList.add('visible');
			
			// Show player labels
			player1Label.textContent = 'Player 1';
			player2Label.textContent = 'Player 2';
			document.getElementById('player1Label').classList.remove('hidden');
			document.getElementById('player2Label').classList.remove('hidden');

			document.getElementById('player1Label').classList.add('visible');
			document.getElementById('player2Label').classList.add('visible');

		}, 2000); // Adjust delay to match camera transition duration
	}

	cleanup() {
        // Stop animation loop
		if (this.renderer)
			this.renderer.setAnimationLoop(null);
		
		// window.removeEventListener('popstate', this.boundEventListeners.popstate);
        window.removeEventListener('keydown', this.boundEventListeners.keydown);
        window.removeEventListener('keyup', this.boundEventListeners.keyup);
        window.removeEventListener('resize', this.boundEventListeners.resize);

        // Dispose of geometry
		if (this.ball && this.paddle1 && this.paddle2 && this.arena){
			this.ball.mesh.geometry.dispose();
			this.paddle1.mesh.geometry.dispose();
			this.paddle2.mesh.geometry.dispose();
			this.arena.mesh.geometry.dispose();
			
			// Dispose of materials
			this.ball.mesh.material.dispose();
			this.paddle1.mesh.material.dispose();
			this.paddle2.mesh.material.dispose();
			this.arena.mesh.material.dispose();
		}


        // Dispose of textures if any
		if (this.scene){
			this.scene.traverse((object) => {
				if (object.material && object.material.map) {
					object.material.map.dispose();
				}
			});
			// Remove meshes from scene
			this.scene.remove(this.ball.mesh);
			this.scene.remove(this.paddle1.mesh);
			this.scene.remove(this.paddle2.mesh);
			this.scene.remove(this.arena.mesh);
		}


        // Dispose of lights
        if (this.light) {
            this.light.forEach(light => {
                this.scene.remove(light);
            });
        }
        if (this.arenaLight) {
            this.scene.remove(this.arenaLight);
        }
        if (this.ambientLight) {
            this.scene.remove(this.ambientLight);
        }
        if (this.radiationLight) {
            this.scene.remove(this.radiationLight);
        }
        if (this.emergencyLight) {
            this.scene.remove(this.emergencyLight);
        }
        if (this.mainLight) {
            this.scene.remove(this.mainLight);
        }

        // Dispose of controls
        if (this.controls) {
            this.controls.dispose();
        }

        // Clear any remaining cached items
		if (this.renderer)
			this.renderer.dispose();
        
        // Clear scene
		if (this.scene){
			while(this.scene.children.length > 0) {
				this.scene.remove(this.scene.children[0]);
			}
		}

        // Clear any references
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.ball = null;
        this.paddle1 = null;
        this.paddle2 = null;
        this.arena = null;
        this.light = null;
        this.arenaLight = null;
        this.ambientLight = null;
        this.radiationLight = null;
        this.emergencyLight = null;
        this.mainLight = null;
    }
}

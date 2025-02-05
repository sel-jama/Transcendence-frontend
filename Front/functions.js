

function fa(){
	document.querySelector("body").innerHTML=`<div class="Background-container-one">
         <div id="popup" style="display:none"> </div>
	<img class="flow-one" src="images2/screenshot.webp" alt="" class="Background-picture-one">
    </div>
        <div class="digit-verif-card">
            <div class="dv-card-body">
                <!-- <img class="cardOne" src="images2/card.webp" alt="" width="500" height="800"> -->
                <h5 class="dv-card-title">Two-Factor Authentication</h5>
                <p class="dv-description">Enter the 6-digit verification code<br>
                generated
                </p>
                <div class="dv-container">
                   
                    <input type="tel" id="digit1" maxlength="1" pattern="\d" required>
                    <input type="tel" id="digit2" maxlength="1" pattern="\d" required>
                    <input type="tel" id="digit3" maxlength="1" pattern="\d" required>
                    <input type="tel" id="digit4" maxlength="1" pattern="\d" required>
                    <input type="tel" id="digit5" maxlength="1" pattern="\d" required>
                    <input type="tel" id="digit6" maxlength="1" pattern="\d" required>
                    
                </div>
            </div>
        </div>
        <button class="button-2fa" id="2fa"></button>
    </div>`;
	updateStylesheet('2fa.css');
	two_fa();
}

function two_fa(){
	setupDigitInputs1();
	// const variable2 = document.getElementById('button4-id');
	// variable2.addEventListener('click', () =>{
	// 	Router.go("/dashboard");
	// });
}



function after_intro(){
          const variable2 = document.getElementById('button4-id');
                variable2.addEventListener('click', () =>{
                    Router.go("/game-intro2");
                });
}

function after_intro2(){
          const variable2 = document.getElementById('button4-id2');
          variable2.addEventListener('click', () =>{
                      Router.go("/clan-info");
          });
}

function clan_information(){
          const variable2 = document.getElementById('id-two');
          variable2.addEventListener('click', () =>{
              Router.go("/scavengers");
                  
          });
          const variable3 = document.getElementById('id-one');
          variable3.addEventListener('click', () =>{
              Router.go("/raiders");
                 
          });
          const variable4 = document.getElementById('id-three');
          variable4.addEventListener('click', () =>{
          Router.go("/vertex");
          });
}

function scavengers_fun(){
    // console.log("hello again");
    const variable2 = document.getElementById('id-choose');
    variable2.addEventListener('click', () =>{
        
        Router.go("/scavengers-identity");
    });
}

function scavengers_identity_(){
    let nickname = document.getElementById("nickname");
    const variable2 = document.getElementById('button-id');
                          variable2.addEventListener('click', async() =>{
                            await fetchUserdetails4("scavengers", nickname.value);
                            // await fetchUserdetails5(avatartarget);
                          });
}

function scavengers_card_(){
          const variable4 = document.getElementById('botton22-id');
                                      variable4.addEventListener('click', () =>{
                                        //  changeHeadData();
                                         Router.sendUserToDashboard();
                              });
}

function after_root(){
        // console.log("debugging");
    document.querySelector('body').innerHTML = `
                <div id="loader" class="loader">
                    <div class="spinner"></div>
                </div>
                <div id="first-id1">
                <div class="Background-container-one">
                <img class="flow-one" src="images2/screenshot.webp" alt="" class="Background-picture-one">
                </div>
                <h2 class="large-content1-one">Choose a login method</h2>
                <img class="cardOne" src="images2/card.webp" alt="" width="400" height="600">
                 <button class="button1-one" id="button1-id">
                <h2>&nbsp;&nbsp;&nbsp;REGISTRER&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa-solid fa-right-to-bracket"></i>&nbsp;&nbsp;&nbsp;</h2>
                </button>
                 <button class="button3-one" id="button3-id">
                <h2>&nbsp;&nbsp;&nbsp;LOGIN&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa-solid fa-right-to-bracket"></i>&nbsp;&nbsp;&nbsp;</h2>
                 </button>
                 <p class="paragra-one">Or continue with:</p>
                 <button class="button2-one" id="button2-id" onclick="window.location.href= getBackendUrl()">
				<!-- Router.go('/arena'); -->
                <h1>&nbsp;&nbsp;&nbsp;42&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa-solid fa-right-to-bracket"></i>&nbsp;&nbsp;&nbsp;</h1>
                </button>
                 </div>`; // Replace content;
                // toggleCSS(['index1.css'], ['styles.css']);
                updateStylesheet('index1.css');
                const but1 = document.getElementById('button1-id');
                but1.addEventListener("click", () => {
                    Router.go("/register");
                });
                const but2 = document.getElementById('button3-id');
                but2.addEventListener("click", () => {
                  
                    Router.go("/login-1");
                });
}


function root(){
    // toggleCSS(["https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"]);
    // loadCSSForPage();
    updateStylesheet('styles.css');
    document.querySelector('body').innerHTML=`
        <div id="loader" class="loader">
            <div class="spinner"></div>
        </div>
    <div class="container-fluid p-0" id="first-id">
            <div class="bg-image vh-100" style="background-image: url('images2/123.webp'); background-size: cover; background-position: center;">
                <div class="container p-0">
                    <img class="image-fluid float-end" src="images2/logo.webp" alt="Responsive Image" id="first-img">
                    <img class="image2" src="images2/radiation.gif" id="angled">
                    <h1 class="display-1 fw-bold text-start" id="paddle-text" >Paddle Through the<br>Fallout</h1>
                    <button class="button-" id="sec-id">
                        <h2 class="display-6 fw-bold">&nbsp;PLAY&nbsp;NOW&nbsp;<i class="fas fa-play-circle play-icon"></i>&nbsp;</h3>
                    </button>
                </div>
            </div>
        </div>`;
        // Router.go("/register");
        const but = document.getElementById('sec-id');
        but.addEventListener("click", () => {
            // toggleCSS([],["https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"]);
            // removePageSpecificCSS();
            Router.go("/methods");
        });
        // updateStylesheet('styles.css');
}

function raiders_fun(){
          const variable2 = document.getElementById('all-button1-id');
                  variable2.addEventListener('click', () =>{
                  Router.go("/raiders-identity")
                });
}



function raiders_identity_(){
	let nickname = document.getElementById("nickname");
	const variable2 = document.getElementById('button-id');
			  variable2.addEventListener('click', async() =>{
			    await fetchUserdetails4("raiders", nickname.value);
			    // await fetchUserdetails5(avatartarget);
			  });
}

function raiders_card_(){
          const variable4 = document.getElementById('botton2-id');
                                      variable4.addEventListener('click', () =>{
                                        //   changeHeadData();
                                         Router.sendUserToDashboard();
                              });
} 

function vertex_fun(){
          const variable2 = document.getElementById('all-button2-id');
                  variable2.addEventListener('click', () =>{
                      Router.go("/vertex-identity");
                  });
}

function vertex_identity_(){
	let nickname = document.getElementById("nickname");
	const variable2 = document.getElementById('button-id');
			  variable2.addEventListener('click', async() =>{
			    await fetchUserdetails4("vertex", nickname.value);
			  });
}

function vertex_card_(){
          const variable4 = document.getElementById('roboto-button21-id');
                                      variable4.addEventListener('click', () =>{
                                         Router.sendUserToDashboard();
                              });
}


function arena() {
	updateStylesheet('game_src/arena.css');

	document.querySelector('body').innerHTML = `

		<button id="onlineMatch">Online Match</button>

		<button id="offlineTournament">Offline Tournament</button>

		<button id="offlineMatch">Offline Match</button>
	`;

	const importMapScriptId = 'importMapScript';
    let importMapScript = document.getElementById(importMapScriptId);

    if (!importMapScript) {
        importMapScript = document.createElement('script');
        importMapScript.id = importMapScriptId;
        importMapScript.type = 'importmap';
        importMapScript.textContent = JSON.stringify({
            imports: {
                "three": "https://unpkg.com/three@latest/build/three.module.js",
                "three/addons/": "https://unpkg.com/three@latest/examples/jsm/"
            }
        });
        document.head.appendChild(importMapScript);
    }

    document.getElementById('onlineMatch').addEventListener('click', async () => {
        Router.go('/onlineGame', true);
    });

    document.getElementById('offlineMatch').addEventListener('click', async () => {
        Router.go('/offlineGame', true);
    });

    document.getElementById('offlineTournament').addEventListener('click', async () => {
        Router.go('/tournament', true);
    });
}


function offlineGame() {	
    updateStylesheet('game_src/offline_style.css');

	const importMapScriptId = 'importMapScript';
    let importMapScript = document.getElementById(importMapScriptId);

    if (!importMapScript) {
        importMapScript = document.createElement('script');
        importMapScript.id = importMapScriptId;
        importMapScript.type = 'importmap';
        importMapScript.textContent = JSON.stringify({
            imports: {
                "three": "https://unpkg.com/three@latest/build/three.module.js",
                "three/addons/": "https://unpkg.com/three@latest/examples/jsm/"
            }
        });
        document.head.appendChild(importMapScript);
    }

	document.querySelector('body').innerHTML = `

		<!--~~~~~~~~~~~~~~~~~~~~~~ Arena Selection Section ~~~~~~~~~~~~~~~~~~~~~~-->
		<div id="preGameView">
			<div class="arena-selection" id="arenaSelection">
			    <div class="arena-buttons">
			        <button class="arena-button" id="CASTLE">Castle</button>
			        <button class="arena-button" id="COLOSSEUM">Colosseum</button>
			        <button class="arena-button" id="FOREST">Forest</button>
			    </div>
			    <div class="toggle-container">
			        <label class="toggle-switch">
			            <input type="checkbox" id="powerUpsToggle">
			            <span class="slider"></span>
			        </label>
			        <span style="font-size: 30px">Enable Power Ups</span>
			    </div>
			    <button id="arenaStartButton" class="continue-button">Continue</button>
			</div>
		</div>

		<!--~~~~~~~~~~~~~~~~~~~~~~ Game Section ~~~~~~~~~~~~~~~~~~~~~~-->
		<div id="gameView">
		    <div class="overlay" id="gameOverlay">
		        <div class="instruction left-instruction">
		            Player 1
		            <div class="key-container">
		                <div class="key-square">W</div>
		                <div class="key-square">S</div>
		            </div>
		        </div>
		        <div class="instruction center-instruction">
		            Click to Start
		        </div>
		        <div class="instruction right-instruction">
		            Player 2
		            <div class="key-container">
		                <div class="key-square">↑</div>
		                <div class="key-square">↓</div>
		            </div>
		        </div>
		        <div id="winLoseMessage" class="hidden center-message"></div>
		        <div id="scoreDisplay" class="hidden center-instruction">0 - 0</div>
		        <div id="player1Label" class="hidden left-instruction">Player 1</div>
		        <div id="player2Label" class="hidden right-instruction">Player 2</div>
		        <button id="lobbyButton" class="hidden">Go to Lobby</button>
		    </div>
		    <canvas class="webgl"></canvas>
	`;

	//~~~~~~~~~~~~~~~~~~~~~~ Arena Selection Section ~~~~~~~~~~~~~~~~~~~~~~
	const arenaButtons = document.querySelectorAll('.arena-button');
	const arenaStartButton = document.getElementById('arenaStartButton');
   	
	arenaButtons.forEach(button => {
		button.addEventListener('click', () => {
			arenaButtons.forEach(btn => btn.classList.remove('selected'));
			button.classList.add('selected');
			arenaStartButton.classList.add('enabled');
		});
	});

	arenaStartButton.addEventListener('click', () => {
		if (arenaStartButton.classList.contains('enabled')) {
			const selectedArena = document.querySelector('.arena-buttons button.selected');
			const powerUpsEnabled = document.getElementById('powerUpsToggle').checked;
			const gameView = document.getElementById('gameView');
			const preGameView = document.getElementById('preGameView');
   	        
			if (selectedArena) {
				// Store arena settings
				sessionStorage.setItem('gameSettings', JSON.stringify({
					arena: selectedArena.id,
					powerUpsEnabled: powerUpsEnabled
				}));
   	
				// Switch to Game
				preGameView.style.display = 'none';
				gameView.style.display = 'block';
            
				// Initialize game
				initGame();
			}
		}
	});

	// Game view logic
	document.getElementById('gameOverlay').addEventListener('click', function(event) {
		const overlay = this;

		// Add the hidden class to all text elements
		const textElements = document.querySelectorAll('.instruction, .key-container, .key-square');
		textElements.forEach(element => {
			element.classList.add('hidden');
		});

		// Add the fade-out class to trigger the transition
		overlay.classList.add('fade-out');
        
		// Wait for the transition to complete before removing the element
		setTimeout(() => {
			overlay.style.display = 'none';
		}, 500);

		// Trigger click on canvas after fade
		setTimeout(() => {
			const canvas = document.querySelector('.webgl');
			canvas.dispatchEvent(new MouseEvent('click', {
				bubbles: true,
				cancelable: true,
				view: window
			}));
		}, 250);
	}, { once: true });

	// Game end handling

	function clearGameCache() {
		sessionStorage.removeItem('gameSettings');
		sessionStorage.removeItem('tournamentState');
	}

	function handleGameEnd(winner, score) {
		console.log('game one')
		gameActive = false; // Mark game as inactive
		const tournamentState = JSON.parse(sessionStorage.getItem('tournamentState'));

		history.replaceState(null, '', '/game/');
        
		if (tournamentState) {
			if (tournamentState.isFinal) {
				tournamentState.finals.completed = true;
				tournamentState.finals.winner = winner;
				tournamentState.finals.score = score;
			} else {
				const currentMatch = tournamentState.matches[tournamentState.currentMatch];
				currentMatch.completed = true;
				currentMatch.winner = winner;
				currentMatch.score = score;
				}
			sessionStorage.setItem('tournamentState', JSON.stringify(tournamentState));
                
			// Return to tournament page
			document.getElementById('tournamentButton').style.display = 'block';

			document.getElementById('tournamentButton').addEventListener('click', function() {
				gameView.style.display = 'none';
				resetGameState();
				preGameView.style.display = 'flex';
				updateMatchDisplay();
			});

		} else {
			// Show lobby button for normal game end
			document.getElementById('lobbyButton').classList.remove('hidden');
			document.getElementById('lobbyButton').addEventListener('click', function() {
				clearGameCache();
				preGameView.style.display = 'flex';
				gameView.style.display = 'none';
				const oldCanvas = document.querySelector('.webgl');
				if (oldCanvas) {
					oldCanvas.remove();
				}

				const oldOverlay = document.getElementById('gameOverlay');
				oldOverlay.remove();

				// Create new overlay with proper structure
				const newOverlay = document.createElement('div');
				newOverlay.className = 'overlay';
				newOverlay.id = 'gameOverlay';
				
				// Recreate the instruction elements with proper structure
				newOverlay.innerHTML = `
					<div class="instruction left-instruction">
						Player 1
						<div class="key-container">
							<div class="key-square">W</div>
							<div class="key-square">S</div>
						</div>
					</div>
					<div class="instruction center-instruction">
						Click to Start
					</div>
					<div class="instruction right-instruction">
						Player 2
						<div class="key-container">
							<div class="key-square">↑</div>
							<div class="key-square">↓</div>
						</div>
					</div>
					<div id="winLoseMessage" class="hidden center-message"></div>
					<div id="scoreDisplay" class="hidden center-instruction">0 - 0</div>
					<div id="player1Label" class="hidden left-instruction">Player 1</div>
					<div id="player2Label" class="hidden right-instruction">Player 2</div>
					<button id="lobbyButton" class="hidden">Go to Lobby</button>
				`;

				// Add click event listener to new overlay
				newOverlay.addEventListener('click', function(event) {
					const overlay = this;
				
					// Add the hidden class to all text elements
					const textElements = overlay.querySelectorAll('.instruction, .key-container, .key-square');
					textElements.forEach(element => {
				      element.classList.add('hidden');
					});
				
					// Add the fade-out class to trigger the transition
					overlay.classList.add('fade-out');
				  
					// Wait for the transition to complete before removing the element
					setTimeout(() => {
						overlay.style.display = 'none';
					}, 500);
				
					// Trigger click on canvas after fade
					setTimeout(() => {
						const canvas = document.querySelector('.webgl');
						canvas.dispatchEvent(new MouseEvent('click', {
							bubbles: true,
							cancelable: true,
							view: window
						}));
					}, 250);
				}, { once: true });

				// Add the new overlay to gameView
				gameView.insertBefore(newOverlay, gameView.firstChild);
				const newCanvas = document.createElement('canvas');
				newCanvas.className = 'webgl';
				gameView.appendChild(newCanvas);
			});
		}
	}

	// Initialize game
	async function initGame() {
		const gameSettings = JSON.parse(sessionStorage.getItem('gameSettings')) || {
			arena: 'CASTLE',
			powerUpsEnabled: true
		};
				      
		// Import and start the game
		const gameModule = await import('/game_src/game_offline/Main.js');
		gameModule.startGame(gameSettings, handleGameEnd);
	}
}

function tournament() {	
    updateStylesheet('game_src/offline_style.css');

    // const importMapScript = document.createElement('script');

	document.querySelector('body').innerHTML = `

		<!--~~~~~~~~~~~~~~~~~~~~~~ Arena Selection Section ~~~~~~~~~~~~~~~~~~~~~~-->
		<div id="preGameView">
			<div class="arena-selection" id="arenaSelection">
				<div class="arena-buttons">
					<button class="arena-button" id="CASTLE">Castle</button>
					<button class="arena-button" id="COLOSSEUM">Colosseum</button>
					<button class="arena-button" id="FOREST">Forest</button>
				</div>
				<div class="toggle-container">
					<label class="toggle-switch">
						<input type="checkbox" id="powerUpsToggle">
						<span class="slider"></span>
					</label>
					<span style="font-size: 30px">Enable Power Ups</span>
				</div>
				<button id="arenaStartButton" class="continue-button">Continue</button>
			</div>
			
			<!--~~~~~~~~~~~~~~~~~~~~~~ Players Naming Section ~~~~~~~~~~~~~~~~~~~~~~-->
			<div class="player-setup" id="playerSetup">
				<h1>Enter Participant Names</h1>
				<div class="input-container">
					<input type="text" placeholder="Player 1" class="player-input">
					<input type="text" placeholder="Player 2" class="player-input">
					<input type="text" placeholder="Player 3" class="player-input">
					<input type="text" placeholder="Player 4" class="player-input">
				</div>
				<button id="playerContinueBtn" class="continue-button">Continue</button>
			</div>
		
			<!--~~~~~~~~~~~~~~~~~~~~~~ Matchs Display Section ~~~~~~~~~~~~~~~~~~~~~~-->
			<div class="matchmaking-container" id="matchmakingContainer">
				<div class="match-box">
					<div class="players">
						<span class="player1"></span>
						<span class="vs">vs</span>
						<span class="player2"></span>
					</div>
					<button class="play-button">Play</button>
				</div>
				<div class="match-box">
					<div class="players">
						<span class="player3"></span>
						<span class="vs">vs</span>
						<span class="player4"></span>
					</div>
					<button class="play-button">Play</button>
				</div>
			</div>

			<!--~~~~~~~~~~~~~~~~~~~~~~ Final Section ~~~~~~~~~~~~~~~~~~~~~~-->
			<button class="finals-button" id="finalsButton">Proceed to Finals</button>
				<div class="finals-container" id="finalsContainer">
					<div class="match-box">
						<div class="players">
							<span class="finals-player1"></span>
							<span class="vs">vs</span>
							<span class="finals-player2"></span>
						</div>
						<button class="play-button">Play</button>
					</div>
				</div>
				<div class="tournament-winner" id="tournamentWinner">
					<div class="trophy-icon">🏆</div>
					<div class="winner-text"></div>
					<button id="lobbyButton" class="finals-button">Go to Lobby</button>
				</div>
		</div>

		<!--~~~~~~~~~~~~~~~~~~~~~~ Game Section ~~~~~~~~~~~~~~~~~~~~~~-->
		<div id="gameView">
		    <div class="overlay" id="gameOverlay">
		        <div class="instruction left-instruction">
		            Player 1
		            <div class="key-container">
		                <div class="key-square">W</div>
		                <div class="key-square">S</div>
		            </div>
		        </div>
		        <div class="instruction center-instruction">
		            Click to Start
		        </div>
		        <div class="instruction right-instruction">
		            Player 2
		            <div class="key-container">
		                <div class="key-square">↑</div>
		                <div class="key-square">↓</div>
		            </div>
		        </div>
		        <div id="winLoseMessage" class="hidden center-message"></div>
		        <div id="scoreDisplay" class="hidden center-instruction">0 - 0</div>
		        <div id="player1Label" class="hidden left-instruction">Player 1</div>
		        <div id="player2Label" class="hidden right-instruction">Player 2</div>
		        <button id="tournamentButton" class="tournament-button">Back</button>
		    </div>
		    <canvas class="webgl"></canvas>
		</div>
	`;

	const importMapScriptId = 'importMapScript';
    let importMapScript = document.getElementById(importMapScriptId);

    if (!importMapScript) {
        importMapScript = document.createElement('script');
        importMapScript.id = importMapScriptId;
        importMapScript.type = 'importmap';
        importMapScript.textContent = JSON.stringify({
            imports: {
                "three": "https://unpkg.com/three@latest/build/three.module.js",
                "three/addons/": "https://unpkg.com/three@latest/examples/jsm/"
            }
        });
        document.head.appendChild(importMapScript);
    }

	window.addEventListener('popstate', clearTournamentData);
	function clearTournamentData() {
		sessionStorage.removeItem('tournamentState');
		sessionStorage.removeItem('gameSettings');
	}
	
	// Tournament State Management
	const initializeTournamentState = (players) => {
		const tournamentState = {
			players: players,
			matches: [
				{
					player1: players[0],
					player2: players[1],
					winner: null,
					score: null,
					completed: false
				},
				{
					player1: players[2],
					player2: players[3],
					winner: null,
					score: null,
					completed: false
				}
			],
			finals: {
	            player1: null,
	            player2: null,
	            winner: null,
	            score: null,
	            completed: false
	        },
			isFinal: false,
			currentMatch: 0,
		};
		sessionStorage.setItem('tournamentState', JSON.stringify(tournamentState));
	};
	
	//~~~~~~~~~~~~~~~~~~~~~~ Arena Selection Section ~~~~~~~~~~~~~~~~~~~~~~
	const arenaButtons = document.querySelectorAll('.arena-button');
	const arenaStartButton = document.getElementById('arenaStartButton');
	const arenaSelection = document.getElementById('arenaSelection');
	const playerSetup = document.getElementById('playerSetup');
	
	arenaButtons.forEach(button => {
	    button.addEventListener('click', () => {
	        arenaButtons.forEach(btn => btn.classList.remove('selected'));
	        button.classList.add('selected');
	        arenaStartButton.classList.add('enabled');
	    });
	});
	
	arenaStartButton.addEventListener('click', () => {
	    if (arenaStartButton.classList.contains('enabled')) {
	        const selectedArena = document.querySelector('.arena-buttons button.selected');
	        const powerUpsEnabled = document.getElementById('powerUpsToggle').checked;
	        
	        if (selectedArena) {
	            // Store arena settings
	            sessionStorage.setItem('gameSettings', JSON.stringify({
	                arena: selectedArena.id,
	                powerUpsEnabled: powerUpsEnabled
	            }));
	
	            // Switch to player setup
	            arenaSelection.style.display = 'none';
	            playerSetup.style.display = 'flex';
	        }
	    }
	});
	
	//~~~~~~~~~~~~~~~~~~~~~~ Players Naming Section ~~~~~~~~~~~~~~~~~~~~~~
	const inputs = document.querySelectorAll('.player-input');
	const playerContinueBtn = document.getElementById('playerContinueBtn');
	const matchmakingContainer = document.getElementById('matchmakingContainer');
	
	function checkInputs() {
	    const allFilled = Array.from(inputs).every(input => input.value.trim() !== '');
	    if (allFilled) {
	        playerContinueBtn.classList.add('enabled');
	    } else {
	        playerContinueBtn.classList.remove('enabled');
	    }
	}
	
	inputs.forEach(input => {
	    input.addEventListener('input', checkInputs);
	});
	
	
	playerContinueBtn.addEventListener('click', () => {
		const players = Array.from(inputs).map(input => input.value.trim());
		initializeTournamentState(players);
		updateMatchDisplay();
	});
	
	//~~~~~~~~~~~~~~~~~~~~~~ Matches Display Section ~~~~~~~~~~~~~~~~~~~~~~
	function updateMatchDisplay() {
		//~~~~~~~ Normal Match ~~~~~~~
		const tournamentState = JSON.parse(sessionStorage.getItem('tournamentState'));
	
		// Hide other sections
		playerSetup.style.display = 'none';
		arenaSelection.style.display = 'none';
	
		// Show matchmaking
		matchmakingContainer.style.display = 'flex';
	
		// Update match boxes with players and results
		document.querySelector('.player1').textContent = tournamentState.matches[0].player1;
		document.querySelector('.player2').textContent = tournamentState.matches[0].player2;
		document.querySelector('.player3').textContent = tournamentState.matches[1].player1;
		document.querySelector('.player4').textContent = tournamentState.matches[1].player2;
	
		// Update match boxes with results if available
		const matchBoxes = document.querySelectorAll('.match-box');
		let completedMatches = 0;
	
		tournamentState.matches.forEach((match, index) => {
			const matchBox = matchBoxes[index];
			const playButton = matchBox.querySelector('.play-button');
	   
			if (match.completed) {
				completedMatches++
	
				// Add score display
				const scoreDisplay = matchBox.querySelector('.score-display') || document.createElement('div');
				scoreDisplay.className = 'score-display';
				scoreDisplay.textContent = match.score;
				matchBox.insertBefore(scoreDisplay, playButton);
	       
				// Update winner styling
				if (match.winner) {
					let playerClass = '';
	       
					if (index === 0) {
						playerClass = match.winner === '1' ? '.player1' : '.player2';
					} else {
						playerClass = match.winner === '1' ? '.player3' : '.player4';
					}
	       
					const playerElement = matchBox.querySelector(playerClass);
					if (playerElement) {
						playerElement.style.color = '#E1C290';
					} else {
						//console.warn(`Player element ${playerClass} not found in match ${index}`);
					}
				}
				playButton.style.display = 'none';
			}
		});
	
		//~~~~~~~ Final Section ~~~~~~~
	    const finalsButton = document.getElementById('finalsButton');
	    const finalsContainer = document.getElementById('finalsContainer');
	    
	    // Show finals button when both semifinals are complete
	    if (completedMatches === 2 && !tournamentState.finals.completed) {
	
	        finalsButton.style.display = 'block';
	
	        // Set up finals players if not already set
	        if (!tournamentState.finals.player1) {
	            const match1Winner = tournamentState.matches[0].winner === '1' ? 
	                tournamentState.matches[0].player1 : tournamentState.matches[0].player2;
	            const match2Winner = tournamentState.matches[1].winner === '1' ? 
	                tournamentState.matches[1].player1 : tournamentState.matches[1].player2;
	            
	            tournamentState.finals.player1 = match1Winner;
	            tournamentState.finals.player2 = match2Winner;
				tournamentState.isFinal = true;
	            sessionStorage.setItem('tournamentState', JSON.stringify(tournamentState));
	        }
	    }
	
	    // Show finals if they're in progress
	    if (tournamentState.finals.player1) {
	        document.querySelector('.finals-player1').textContent = tournamentState.finals.player1;
	        document.querySelector('.finals-player2').textContent = tournamentState.finals.player2;
	    }
	
	    // Show winner if finals are completed
	    if (tournamentState.finals.completed) {
	        //finalsButton.style.display = 'none';
	        finalsContainer.style.display = 'none';
			matchmakingContainer.style.display = 'none';
	        const tournamentWinner = document.getElementById('tournamentWinner');
	        const winnerName = tournamentState.finals.winner === '1' ? 
	            tournamentState.finals.player1 : tournamentState.finals.player2;
	        tournamentWinner.querySelector('.winner-text').textContent = 
	            `Tournament Winner: ${winnerName}`;
	
	        tournamentWinner.style.display = 'block';
	
	        const lobbyButton = document.getElementById('lobbyButton');
	        lobbyButton.style.display = 'block';
	
			setTimeout(clearTournamentData, 500);
	    }
	}
	
	// Add finals button click handler
	document.getElementById('finalsButton').addEventListener('click', () => {
	    const finalsContainer = document.getElementById('finalsContainer');
	    const matchmakingContainer = document.getElementById('matchmakingContainer');
	    const finalsButton = document.getElementById('finalsButton');
	    
	    matchmakingContainer.style.display = 'none';
	    finalsButton.style.display = 'none';
	    finalsContainer.style.display = 'block';
	});
	
	// Update play button click handler for finals
	document.querySelectorAll('.play-button').forEach((button, index) => {
	    button.addEventListener('click', () => {
	        const tournamentState = JSON.parse(sessionStorage.getItem('tournamentState'));
	        if (button.closest('.finals-container')) {
	            tournamentState.currentMatch = 'finals';
	        } else {
	            tournamentState.currentMatch = index;
	        }
	        sessionStorage.setItem('tournamentState', JSON.stringify(tournamentState));


			const preGameView = document.getElementById('preGameView');
			const gameView = document.getElementById('gameView');

			preGameView.style.display = 'none';
            gameView.style.display = 'block';

			resetGameState();
			initGame();
	    });
	});

	document.getElementById('lobbyButton').addEventListener('click', function() {
		clearTournamentData();
		Router.go('/arena');
	});

	// Game view logic
	document.getElementById('gameOverlay').addEventListener('click', function(event) {
		const overlay = this;

		// Add the hidden class to all text elements
		const textElements = document.querySelectorAll('.instruction, .key-container, .key-square');
		textElements.forEach(element => {
		element.classList.add('hidden');
		});

		// Add the fade-out class to trigger the transition
		overlay.classList.add('fade-out');

		// Wait for the transition to complete before removing the element
		setTimeout(() => {
			overlay.style.display = 'none';
		}, 500);

		// Trigger click on canvas after fade
		setTimeout(() => {
			const canvas = document.querySelector('.webgl');
			canvas.dispatchEvent(new MouseEvent('click', {
				bubbles: true,
				cancelable: true,
				view: window
			}));
		}, 250);
	}, { once: true });

	// Initialize game
	async function initGame() {
		const gameSettings = JSON.parse(sessionStorage.getItem('gameSettings')) || {
			arena: 'CASTLE',
			powerUpsEnabled: true
		};

		const gameModule = await import('/game_src/game_offline/Main.js');
		gameModule.startGame(gameSettings, handleGameEnd);
	}

function handleGameEnd(winner, score) {
	gameActive = false; // Mark game as inactive
	const tournamentState = JSON.parse(sessionStorage.getItem('tournamentState'));

	// history.replaceState(null, '', '/game/');

	if (tournamentState) {
		if (tournamentState.isFinal) {
			tournamentState.finals.completed = true;
			tournamentState.finals.winner = winner;
			tournamentState.finals.score = score;
		} else {
			const currentMatch = tournamentState.matches[tournamentState.currentMatch];
			currentMatch.completed = true;
			currentMatch.winner = winner;
			currentMatch.score = score;
		}
		sessionStorage.setItem('tournamentState', JSON.stringify(tournamentState));

		// Return to tournament page
		document.getElementById('tournamentButton').style.display = 'block';

		document.getElementById('tournamentButton').addEventListener('click', function() {
			gameView.style.display = 'none';
			resetGameState();
			preGameView.style.display = 'flex';
			updateMatchDisplay();
		});

	} else {
		// Show lobby button for normal game end
		document.getElementById('lobbyButton').classList.remove('hidden');
		document.getElementById('lobbyButton').addEventListener('click', function() {
			clearGameCache();
			preGameView.style.display = 'flex';
			gameView.style.display = 'none';
		});
	}
}

function resetGameState() {
	// Reset the overlay with proper structure
	const gameView = document.getElementById('gameView');
	const oldOverlay = document.getElementById('gameOverlay');
	oldOverlay.remove();

	// Create new overlay with proper structure
	const newOverlay = document.createElement('div');
	newOverlay.className = 'overlay';
	newOverlay.id = 'gameOverlay';
  
	// Recreate the instruction elements with proper structure
	newOverlay.innerHTML = `
		<div class="instruction left-instruction">
			Player 1
			<div class="key-container">
				<div class="key-square">W</div>
				<div class="key-square">S</div>
			</div>
		</div>
		<div class="instruction center-instruction">
			Click to Start
		</div>
		<div class="instruction right-instruction">
			Player 2
			<div class="key-container">
				<div class="key-square">↑</div>
				<div class="key-square">↓</div>
			</div>
		</div>
		<div id="winLoseMessage" class="hidden center-message"></div>
		<div id="scoreDisplay" class="hidden center-instruction">0 - 0</div>
		<div id="player1Label" class="hidden left-instruction">Player 1</div>
		<div id="player2Label" class="hidden right-instruction">Player 2</div>
		<button id="tournamentButton" class="tournament-button" style="display: none;">Back</button>
	`;

	// Add click event listener to new overlay
	newOverlay.addEventListener('click', function(event) {
		const overlay = this;

		// Add the hidden class to all text elements
		const textElements = overlay.querySelectorAll('.instruction, .key-container, .key-square');
		textElements.forEach(element => {
          element.classList.add('hidden');
		});

		// Add the fade-out class to trigger the transition
		overlay.classList.add('fade-out');
      
		// Wait for the transition to complete before removing the element
		setTimeout(() => {
			overlay.style.display = 'none';
		}, 500);

		// Trigger click on canvas after fade
		setTimeout(() => {
			const canvas = document.querySelector('.webgl');
			canvas.dispatchEvent(new MouseEvent('click', {
				bubbles: true,
				cancelable: true,
				view: window
			}));
		}, 250);
	}, { once: true });

	// Add the new overlay to gameView
	gameView.insertBefore(newOverlay, gameView.firstChild);

	// Reset the canvas
	const oldCanvas = document.querySelector('.webgl');
	if (oldCanvas) {
		oldCanvas.remove();
	}
	const newCanvas = document.createElement('canvas');
	newCanvas.className = 'webgl';
	gameView.appendChild(newCanvas);

	// Reattach tournament button click handler
	document.getElementById('tournamentButton').addEventListener('click', function() {
		const preGameView = document.getElementById('preGameView');
		const gameView = document.getElementById('gameView');
      
		preGameView.style.display = 'flex';
		gameView.style.display = 'none';
		updateMatchDisplay();
		});
	}
}

async function onlineGame() {
    updateStylesheet('game_src/game_online/game_style.css');


	document.querySelector('body').innerHTML = `

		<div id="preGameView">
			<!--~~~~ Game Create/Join ~~~~-->
			<div id="createJoin">
				<button id="createButton" class="continue-button enabled">Create a Game</button>
				<button id="joinButton" class="continue-button enabled">Join a Game</button>
			</div>

			<!--~~~~ Arena Selection ~~~~-->
			<div class="arena-selection" id="arenaSelection">
				<div class="arena-buttons">
					<button class="arena-button" id="CASTLE">Castle</button>
					<button class="arena-button" id="COLOSSEUM">Colosseum</button>
					<button class="arena-button" id="FOREST">Forest</button>
				</div>
				<div class="toggle-container">
					<label class="toggle-switch">
						<input type="checkbox" id="powerUpsToggle">
						<span class="slider"></span>
					</label>
					<span style="font-size: 30px; color: white;">Enable Power Ups</span>
				</div>
				<button id="arenaStartButton" class="continue-button">Continue</button>
			</div>
		</div>

		<!--~~~~~~~~~~~~~~~~~~~~~~ Game Section ~~~~~~~~~~~~~~~~~~~~~~-->
		<div id="gameView">
			<div class="overlay" id="preGameOverlay">
				<div id="waitingText" class="instruction center-instruction">
					Waiting for opponent...
				</div>
				<button id="errorLobbyButton" onclick="Router.go('/arena')">Return to Lobby</button>

				<div class="matchmaking-container" id="matchMakingContainer">
					<div class="match-box">
						<div class="players">
							<span class="player1">here</span>
							<span class="vs">vs</span>
							<span class="player2">there</span>
						</div>
						<span class="timer">Starting in 5s</span>
					</div>
				</div>

			</div>
        </div>

		<!--~~~~~~~~~~~~~~~~~~~~~~ Post-Game Section ~~~~~~~~~~~~~~~~~~~~~~-->
		<div id="postGameView">
			<div class="overlay" id="postGameOverlay">
				<div id="winLoseMessage" class="hidden center-message"></div>
				<div id="scoreDisplay" class="hidden center-instruction">0 - 0</div>
				<div id="player1Label" class="hidden left-instruction">Player 1</div>
				<div id="player2Label" class="hidden right-instruction">Player 2</div>
				<button id="lobbyButton" class="hidden">Go to Lobby</button>
			</div>
        </div>
		<canvas class="webgl"></canvas>
	`;


	const importMapScriptId = 'importMapScript';
    let importMapScript = document.getElementById(importMapScriptId);

    if (!importMapScript) {
        importMapScript = document.createElement('script');
        importMapScript.id = importMapScriptId;
        importMapScript.type = 'importmap';
        importMapScript.textContent = JSON.stringify({
            imports: {
                "three": "https://unpkg.com/three@latest/build/three.module.js",
                "three/addons/": "https://unpkg.com/three@latest/examples/jsm/"
            }
        });
        document.head.appendChild(importMapScript);
    }

    const module = await import('/game_src/game_online/Main.js');
    const GameSession = module.GameSession;
    const gameSession = new GameSession();

	//~~~~~~~~~~~~~~~~~~~~~~ Game Create/Join Section ~~~~~~~~~~~~~~~~~~~~~~
	const createJoin = document.getElementById('createJoin');
	const createButton = document.getElementById('createButton');
	const joinButton = document.getElementById('joinButton');
	const gameView = document.getElementById('gameView');

	createButton.addEventListener('click', () => {
	    arenaSelection.style.display = 'flex';
	    createJoin.style.display = 'none';
	});

	joinButton.addEventListener('click', () => {
	    createJoin.style.display = 'none';
	    gameView.style.display = 'flex';
		gameSession.startGame();
	});

	function showError(message) {
		const waitingText = document.getElementById('waitingText');
		const errorLobbyButton = document.getElementById('errorLobbyButton');
		const matchMakingContainer = document.getElementById('matchMakingContainer');
		
		waitingText.textContent = message;
		waitingText.classList.add('error-text');
		errorLobbyButton.style.display = 'block';
		matchMakingContainer.style.display = 'none';
	}

	gameSession.onError = function(message) {
		showError(message);
	};

	//~~~~~~~~~~~~~~~~~~~~~~ Arena Selection Section ~~~~~~~~~~~~~~~~~~~~~~
	const arenaButtons = document.querySelectorAll('.arena-button');
	const arenaStartButton = document.getElementById('arenaStartButton');
	const arenaSelection = document.getElementById('arenaSelection');
	const preGameView = document.getElementById('preGameView');
	
	arenaButtons.forEach(button => {
	    button.addEventListener('click', () => {
	        arenaButtons.forEach(btn => btn.classList.remove('selected'));
	        button.classList.add('selected');
	        arenaStartButton.classList.add('enabled');
	    });
	});
	
	arenaStartButton.addEventListener('click', () => {
	    if (arenaStartButton.classList.contains('enabled')) {
	        const selectedArena = document.querySelector('.arena-buttons button.selected');
	        const powerUpsEnabled = document.getElementById('powerUpsToggle').checked;
	        
	        if (selectedArena) {
	            // Store arena settings
	            sessionStorage.setItem('gameSettings', JSON.stringify({
	                arena: selectedArena.id,
	                powerUpsEnabled: powerUpsEnabled
	            }));
	
	            // Switch to Game
	            arenaSelection.style.display = 'none';
	            preGameView.style.display = 'none';
	            gameView.style.display = 'flex';

				const gameSettings = JSON.parse(sessionStorage.getItem('gameSettings')) || {
					arena: 'CASTLE',
					powerUpsEnabled: true
				};
				gameSession.startGame(gameSettings);
	        }
	    }
	});

	document.getElementById('lobbyButton').addEventListener('click', function() {
		// Reset the canvas
		const oldCanvas = document.querySelector('.webgl');
		if (oldCanvas) {
			oldCanvas.remove();
		}
		const newCanvas = document.createElement('canvas');
		newCanvas.className = 'webgl';

        Router.go("/arena");
	});
}

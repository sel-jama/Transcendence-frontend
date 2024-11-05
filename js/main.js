
const templates = {
    settings: `
            <div class="color-overlay">
                <nav class="navbar" id="settings-navbar">
                    <div class="container-fluid">
                        <!-- Left Button -->
                        <button class="btn-0 left-btn btn btn-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                            </svg>
                        </button>
                        <!-- Right Button -->
                        <button class="btn-0 right-btn btn btn-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                            </svg>
                        </button>
                    </div>
                </nav>

                <div class="container-ms mt-3">
                    <h1 class="settings-title">Settings</h1>
                    <!-- Image and card container -->
                    <div class="img-card-container">
                        <img src="images/card-settings.png" class="overlay-image"> 

                        <!-- Card positioned on top of the image -->
                        
                        <div class="overlay-card">
                            <!-- The variable of the card settings (what to change) -->
                            <div class="card-body"> 
                                <div class="card-buttons">
                                    <button type="button" class="btn-1 btn btn-lg">Sound Settings</button>
                                    <button type="button" class="btn-1 btn btn-lg">Control Settings</button>
                                    <button type="button" class="btn-1 btn btn-lg">Input Settings</button>
                        
                                </div>
                                                 
                                <!-- custom element -->
                                <card-content></card-content>
                            </div>
                        </div>
                    </div> 

                    <!-- Outer buttons -->
                    <div class="outer-buttons">
                        <button type="button" class="btn-2 btn btn-lg">Game Settings</button>
                        <button type="button" class="btn-2 btn btn-lg">Privacy Settings</button>
                        <button type="button" class="btn-2 btn btn-lg">Reset Options</button>
                    </div>
                </div>
            </div>

    `,

    Leaderboard: `
            <div class="color-overlay">
                <nav class="navbar" id="leaderboard-navbar">
                    <div class="container-fluid">
                        <!-- Left Button -->
                        <button class="btn-0 left-btn btn btn-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                            </svg>
                        </button>
                        <!-- Right Button -->
                        <button class="btn-0 right-btn btn btn-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                            </svg>
                        </button>
                    </div>
                </nav>

                <div class="container-ms mt-3">
                    <h1 class="leaderboard-title">Leaderboard</h1>
                    <div class="container leaderboard-container">
            
                            <div class="card-body"> 
                                <div class="leaderboard-buttons">
                                    <button type="button" class="btn-1 btn btn-lg">ALL CLANS</button>
                                    <button type="button" class="btn-1 btn btn-lg">CLAN</button>
                                </div>
                            </div>
                    </div> 

                </div>
            </div>
    `,
};

function updateStylesheet(href) {
    const linkTag = document.querySelector("link[data-section-style]");
    if (!linkTag){
        linkTag = document.createElement("link");
        linkTag.rel = "stylesheet";
        linkTag.dataset.dynamic = "true";
        document.head.appendChild(linkTag);
    }
    linkTag.href = href;
}

document.addEventListener('DOMContentLoaded', () => {
    updateStylesheet('css/dashboard.css');
    initializeDashboard();

    // initializeNavigation();
    // initializeSettings();
    // initializeVolumeControls();
});


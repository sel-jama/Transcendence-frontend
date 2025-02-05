
let info = {
    username: 'Default User',
    rank: '0',
    xp: '0',
    accountAge: '0',
    tournamentsWon: '0',
    pointsScored: '0',
    clanDuration: '0',
    longestStreak: '0',
    winRatio: '0',
    gameCount: '0'
};

const templates = {
    settings: `

            
            <div class="color-overlay">
                <div class="alert alert-success" role="alert"> 
                    <p></p>
                </div>
                
                <div id="popup" style="display:none"> </div>
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
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
                                <path d="M 0 9 L 0 11 L 50 11 L 50 9 Z M 0 24 L 0 26 L 50 26 L 50 24 Z M 0 39 L 0 41 L 50 41 L 50 39 Z"></path>
                            </svg>
                        </button>
                            <div id="dropdown">
                                <ul class="lb-menu">
                                    <li>Profile</li>
                                    <li>Leaderboard</li>
                                    <li>Arena</li>
                                </ul>
                            </div>
                    </div>
                </nav>

                <div class="container-ms mt-3">
                    <h1 class="settings-title">Settings</h1>
                    <!-- Image and card container -->
                    <div class="img-card-container">
                        <img src="images/card-settings.webp" class="overlay-image">

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
                        <button type="button" class="btn-2 btn btn-lg">Account Settings</button>
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
                        <div class="dropdown">
                            <button class="btn-0 right-btn btn btn-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
                                    <path d="M 0 9 L 0 11 L 50 11 L 50 9 Z M 0 24 L 0 26 L 50 26 L 50 24 Z M 0 39 L 0 41 L 50 41 L 50 39 Z"></path>
                                </svg>
                            </button>
                                <div id="dropdown">
                                    <ul class="lb-menu">
                                        <li>Profile</li>
                                        <li>Settings</li>
                                        <li>Arena</li>
                                    </ul>
                                </div>
                        </div>
                    </div>
                </nav>

                <div id="popup" style="display:none"> </div>
                <div class="container-ms mt-3">
                    <h1 class="leaderboard-title">Leaderboard</h1>
                    <div class="leaderboard-container-btns">
                        <div class="leaderboard-buttons">
                            <button type="button" class="btn-1 btn btn-lg">ALL CLANS</button>
                            <div class="btn-group dropend">
                                <button type="button" class="btn-1 btn btn-lg dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                    CLAN
                                </button>
                                <select class="dropdown-menu"> 
                                    <option value="raiders">RAIDERS</option>
                                    <option value="scavengers">SCAVENGERS</option>
                                    <option value="vertex">VERTEX</option>
                                </select>
                            </div>
                        </div>
                    
                        <div class="leaderboard-search">
                            <input type="text" placeholder="Search for a player" class="search-bar">
                            <button class="search-btn"> <i class="fa-solid fa-magnifying-glass"></i> </button> 
                        </div>
                    </div>

                    <div class="leaderboard-table">
                            <table class="lb-table">
                                <tbody></tbody>
                            </table>
                    </div>

                    
                    <div id="pagination-controls">
                        <button id="prev-btn">
                            <i class="fa-solid fa-chevron-up fa-rotate-270"></i>
                        </button>
                            <div id="page-indicator"></div>
                        <button id="next-btn">
                            <i class="fa-solid fa-chevron-up fa-rotate-90"></i>
                        </button>
                    </div>

                </div>
            </div>
    `,

    profile: `

        <nav class="navbar" id="profile-navbar">
            <div class="container-fluid">
                <button class="btn-0 left-btn btn btn-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
                        <path d="M 24.962891 1.0546875 A 1.0001 1.0001 0 0 0 24.384766 1.2636719 L 1.3847656 19.210938 A 1.0005659 1.0005659 0 0 0 2.6152344 20.789062 L 4 19.708984 L 4 46 A 1.0001 1.0001 0 0 0 5 47 L 18.832031 47 A 1.0001 1.0001 0 0 0 19.158203 47 L 30.832031 47 A 1.0001 1.0001 0 0 0 31.158203 47 L 45 47 A 1.0001 1.0001 0 0 0 46 46 L 46 19.708984 L 47.384766 20.789062 A 1.0005657 1.0005657 0 1 0 48.615234 19.210938 L 41 13.269531 L 41 6 L 35 6 L 35 8.5859375 L 25.615234 1.2636719 A 1.0001 1.0001 0 0 0 24.962891 1.0546875 z M 25 3.3222656 L 44 18.148438 L 44 45 L 32 45 L 32 26 L 18 26 L 18 45 L 6 45 L 6 18.148438 L 25 3.3222656 z M 37 8 L 39 8 L 39 11.708984 L 37 10.146484 L 37 8 z M 20 28 L 30 28 L 30 45 L 20 45 L 20 28 z"></path>
                    </svg>
                </button>

                <div class="ms-auto dropdown">
                    <button class="btn-0 right-btn btn btn-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
                            <path d="M 0 9 L 0 11 L 50 11 L 50 9 Z M 0 24 L 0 26 L 50 26 L 50 24 Z M 0 39 L 0 41 L 50 41 L 50 39 Z"></path>
                        </svg>
                    </button>

                    <div id="dropdown">
                        <ul class="profile-menu">
                            <li>Settings</li>
                            <li>Arena</li>
                            <li>Leaderboard</li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>

            <div class="profile-body">
                <div id="popup" style="display:none"> </div>

                <div class="profile-rectangle">
                    <svg width="1858" height="433" viewBox="0 0 1858 433" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="partialColorGradient" style="z-index:1000;" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stop-color="#686868" />
                                <stop offset="10%" stop-color="#686868" />
                                <stop offset="11%" stop-color="#686868" />
                                <stop offset="50%" stop-color="#EDDDC6" />
                                <stop offset="100%" stop-color="#EDDDC6" />
                            </linearGradient>

                        </defs>
                        
                        <path id="Rectangle" d="M1708 0L1708 0L1708 283L47 283C21.0391 283 0 261.961 0 236L0 47C0 21.0391 21.0391 0 47 0L1708 0Z" fill="url(#partialColorGradient)" transform="translate(75 0)" />
                    </svg>
                    
                    <div class="profile-avatar">
                        <div class="avatar-circle">
                            <img id="profile-avatar-img" src="../images/profile.webp" alt="Avatar">
                        </div>
                    </div>

                    <h2 id="username-profile">${info.username}</h2>
                    <h3 id="rank-profile">Rank #${info.rank}</h3>
                    <h1 id="xp-profile">${info.xp}XP</h1>

                    <button class="btn btn-lg" id="modify-info-btn">MODIFY INFO
                        <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g>
                            <rect width="41" height="41" />
                            <path id="Shape" d="M33.7225 0C32.7007 0 31.6821 0.400391 30.9037 1.17875C30.9037 1.17875 30.2375 1.845 30.2375 1.845C30.2375 1.845 35.875 7.4825 35.875 7.4825C35.8718 7.4857 36.5412 6.81625 36.5412 6.81625C38.1012 5.25633 38.098 2.73547 36.5412 1.17875C35.7597 0.400391 34.7443 0 33.7225 0C33.7225 0 33.7225 0 33.7225 0ZM28.9827 3.30562C28.7969 3.33125 28.6239 3.42414 28.4958 3.56187C28.4958 3.56187 1.89704 30.1862 1.89704 30.1862C1.79133 30.2823 1.71125 30.4073 1.66641 30.545C1.66641 30.545 0.0264101 36.695 0.0264101 36.695C-0.047262 36.9769 0.0360197 37.2748 0.24102 37.4798C0.44602 37.6848 0.74391 37.768 1.02578 37.6944C1.02578 37.6944 7.17578 36.0544 7.17578 36.0544C7.31352 36.0095 7.43844 35.9295 7.53453 35.8237C7.53453 35.8237 34.1589 9.225 34.1589 9.225C34.4856 8.90789 34.4888 8.38578 34.1717 8.05906C33.8546 7.73234 33.3325 7.72914 33.0058 8.04625C33.0058 8.04625 6.53516 34.5169 6.53516 34.5169L3.20391 31.1856C3.20391 31.1856 29.6745 4.715 29.6745 4.715C29.9212 4.47797 29.9948 4.10961 29.8571 3.7957C29.7194 3.4818 29.4023 3.28641 29.0595 3.30562C29.0339 3.30562 29.0083 3.30562 28.9827 3.30562C28.9827 3.30562 28.9827 3.30562 28.9827 3.30562Z" fill="#000000" transform="translate(1.64 1.64)" />
                            </g>
                        </svg>
                    </button>

                    <button class="btn btn-lg" id="invite-to-match-btn" style="display:none;">Add Friend
                        <img width="50" height="50" src="images/addfriendIcon.webp"/>
                    </button>

                </div>

                <div class="container-ms mt-3 image-content">
                    <img src="/images/profile_overlay.webp" class="overlay-image">
                    <div class="overlay-cards" style="display: block;">
                        <div id="card-1">
                            <div class="single-chart">
                                <svg viewBox="0 0 36 36" class="circular-chart">
                                    <path class="circle-bg"
                                        d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <path class="circle"
                                        stroke-dasharray="${info.winRatio}, 100"
                                        d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <text x="18" y="15" class="win-ratio">Win Ratio</text>
                                    <text x="18" y="25" class="percentage"></text>
                                </svg>
                            </div>

                            <div class="game-count"><span id="num">${info.gameCount}</span> Game</div>
                        </div>
                        <div id="card-2">
                            <div class="clock-box">
                                <span class="d-inline-block tooltip-container">
                                    <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path id="Shape" d="M23 0C10.3093 0 0 10.3093 0 23C0 35.6907 10.3093 46 23 46C35.6907 46 46 35.6907 46 23C46 10.3093 35.6907 0 23 0C23 0 23 0 23 0ZM23 2C34.6098 2 44 11.3902 44 23C44 34.6098 34.6098 44 23 44C11.3902 44 2 34.6098 2 23C2 11.3902 11.3902 2 23 2C23 2 23 2 23 2ZM35.0391 8.99023C34.745 8.98175 34.462 9.10321 34.2656 9.32227C34.2656 9.32227 24.1836 20.2441 24.1836 20.2441C23.8097 20.0833 23.407 20.0002 23 20C21.3431 20 20 21.3431 20 23C20 24.6569 21.3431 26 23 26C23.1675 26.0003 23.3348 25.9866 23.5 25.959C23.5 25.959 27.125 32.4863 27.125 32.4863C27.3936 32.9696 28.0031 33.1436 28.4863 32.875C28.9696 32.6064 29.1436 31.9969 28.875 31.5137C28.875 31.5137 25.2461 24.9844 25.2461 24.9844C25.7308 24.4369 25.9989 23.7312 26 23C26 22.5133 25.8809 22.0325 25.653 21.6009C25.653 21.6009 35.7344 10.6777 35.7344 10.6777C36.0054 10.3917 36.0832 9.97319 35.9331 9.60886C35.783 9.24454 35.4329 9.00231 35.0391 8.99023C35.0391 8.99023 35.0391 8.99023 35.0391 8.99023Z" fill="#E1C290" />
                                    </svg>
                                    <div class="tooltip-content">
                                        Account Age
                                    </div>
                                </span>
                                <h5 class="days-count">${info.accountAge} Days</h5>
                            </div>
                                                

                            <div class="handshake-box">
                                <span class="d-inline-block tooltip-container">
                                    <img id="img-1" width="50" height="50" src="/images/handshake-logo.webp"/>
                                    <div class="tooltip-content">
                                        Days played as part of their current clan
                                    </div>
                                </span>
                                <h5 class="days-count">${info.clanDuration} Days</h5>
                            </div>

                            <div class="trophy-box"> 
                                <span class="d-inline-block tooltip-container">
                                    <img id="img-1" width="50" height="50" src="/images/trophy-logo.webp"/>
                                    <div class="tooltip-content">
                                        Tournaments won
                                    </div>
                                </span>
                                <h5 class="days-count">${info.tournamentsWon}</h5>
                            </div>

                        
                        </div>
                        <div id="card-3">

                            <div id="scored-pointes">
                                <h4 class="txt-1">Total points scored 
                                    <span class="txt-1-num">${info.pointsScored}</span>
                                </h4>
                            </div>

                            <div class="streak-chart">
                                <svg viewBox="0 0 36 36" class="streak-circular-chart">
                                    <path class="streak-circle-bg"
                                        d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <path class="streak-circle"
                                        stroke-dasharray="100, 100"
                                        d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <text x="18" y="17" class="streak-count">2 Game</text>
                                    <image x="14" y="20" width="25%" height="25%" href="/images/fire-logo.webp"/>
                                </svg>

                            </div>
                            <div id="longest-streak">
                                <h4 class="txt-2">Longest streak 
                                    <span class="txt-2-num">${info.longestStreak}</span>
                                </h4>
                            </div>
                        </div>
                    </div>
                    
                    <div class="match-history-table" style="display: none;">
                        <div class="mh-scroll"> </div>
                        <table class="mh-table">
                            <tbody>
                               
                            </tbody>
                        </table>

                        <div id="hm-pagination-controls">
                            <button id="hm-prev-btn">
                                <i class="fa-solid fa-chevron-up fa-rotate-270"></i>
                            </button>
                                <div id="hm-page-indicator"></div>
                            <button id="hm-next-btn">
                                <i class="fa-solid fa-chevron-up fa-rotate-90"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                
                <div class="acheivements-container" style="display: none;">
                    <div class="scroll-div"> </div>
                </div>

                <div class="friends-container" style="display: none;">
                    <h3 class="friends-section-header">Friend Requests</h3>
                    <div class="friends-list friend-requests">
                    </div>

                    <h3 class="friends-section-header">Online Friends</h3>
                    <div class="friends-list online-friends">
                    </div>

                    <h3 class="friends-section-header">Offline Friends</h3>
                    <div class="friends-list offline-friends">
                    </div>

                </div>

                <!-- Outer buttons -->
                <div class="outer-buttons">
                    <button type="button" class="btn-2 btn btn-lg">General Stats</button>
                    <button type="button" class="btn-2 btn btn-lg">Match History</button>
                    <button type="button" class="btn-2 btn btn-lg">Acheivements</button>

                    <button type="button" class="btn-2 btn btn-lg friends-btn">Friends</button>
                </div>
            </div>

            <div class="modify-info-layout">
                <img width="1100" height="735" src="/images/modifyInfo-card.webp" alt="card">
                <div class="modify-card-buttons">

                    <div class="edit-avatar">
                        <form class="avatar">
                            <div class="avatar" id="avatar-container">
                                <img id="avatar-img" src="" style="display:none;" />
                                <div class="placeholder" id="avatar-placeholder">
                                    <img width="50" height="50" src="/images/pencilIconBlack.webp" alt="edit" class="edit-icon" id="edit-icon"/>
                                </div>
                            </div>
                            <input type="file" id="file-input" accept="image/*">
                        </form>
                    </div>
                    
                    <div id="edit-username">
                        <input type="text" placeholder="USERNAME" class="username has-content">
                    </div>
                    <div id="edit-email">
                        <input type="email" placeholder="EMAIL" class="email has-content">
                    </div>
                    <button class="btn btn-lg cancel">CANCEL</button>
                    <button class="btn btn-lg confirm">CONFIRM</button>
                </div>
            </div>
        `,

        Dashboard: ` 

            <main id="page">
                    <div id="popup" style="display:none"> </div>
                    <nav class="navbar" id="dashboard-navbar">
                        <div class="container-fluid">
                            <button class="btn-0 left-btn btn btn-lg">
                                <img src="/images/Group.webp" alt="latom ogo" />
                            </button>

                            <div class="ms-auto">
                                <button class="btn-0 right-btn btn btn-lg">
                                    <img width="47" height="47" src="/images/logoutIcon.webp"/> 
                                </button>
                            </div>
                        </div>
                    </nav>

                    <div class="dashboard-slides">
                        <div class="wrapper">
                            <div class="sliders-container">

                                <input type="radio" name="slide" id="c1" checked>
                                <label for="c1" class="card">
                                    <div class="row">
                                        <div class="title-container">
                                            <h4>Profile</h4>
                                        </div>
                                    </div>
                                </label>

                                <input type="radio" name="slide" id="c2">
                                <label for="c2" class="card">
                                    <div class="row">
                                        <div class="title-container">
                                            <h4>Leaderboard</h4>
                                        </div>
                                    </div>
                                </label>

                                <input type="radio" name="slide" id="c3">
                                <label for="c3" class="card">
                                    <div class="row">
                                        <div class="title-container">
                                            <h4>Arena</h4>
                                        </div>
                                    </div>
                                </label>

                                <!-- <input type="radio" name="slide" id="c4">
                                <label for="c4" class="card">
                                    <div class="row">
                                        <div class="title-container">
                                            <h4>History Vault</h4>
                                        </div>
                                    </div>
                                </label> -->
                                
                                <input type="radio" name="slide" id="c5">
                                <label for="c5" class="card">
                                    <div class="row">
                                        <div class="title-container">
                                            <h4>settings</h4>
                                        </div>
                                    </div>
                                </label>

                            </div>
                        </div>
                    </div>
                    
            </main>`
    };

function updateStylesheet(href) {
    const bootstrapLinks = Array.from(document.querySelectorAll('link[href*="bootstrap"]'));

    let linkTag = document.querySelector("link[data-section-style]");
    if (!linkTag) {
        linkTag = document.createElement("link");
        linkTag.rel = "stylesheet";
        linkTag.dataset.sectionStyle = "true";
    }

    linkTag.href = href;

    if (bootstrapLinks.length > 0) {
        const lastBootstrapLink = bootstrapLinks[bootstrapLinks.length - 1];
        lastBootstrapLink.parentNode.insertBefore(linkTag, lastBootstrapLink.nextSibling);
    } else {
        document.head.appendChild(linkTag);
    }
}



function showNotification(message, duration = 3000){
    const popup = document.getElementById('popup');
    if (popup){
        popup.style.display = 'block';
        popup.textContent = message;
        popup.classList.add('show');

        setTimeout(() => {
            popup.classList.remove('show');
            popup.style.display = 'none';
        }, duration);
    }

}

function toggleSpinner(show){
    const spinner = document.getElementById('loader');
    if(spinner){
        if (show) spinner.style.display = 'flex';
        else spinner.style.display = 'none';
    }
}


let currentCard = 1;
let playersPerCard = 5;
let allHistoryMatch = [
];


let acheivementInfo = [
    {img: 'images/featherIcon.webp', label: 'Game Explorer', description: ' Welcome To Atomic Pong'},
    {img: 'images/tankIcon.webp', label: 'UNSTOPPABLE', description: 'You achieved a win streak of 10 matches'},
    {img: 'images/dropIcon.webp', label: 'FIRST BLOOD', description: 'You Won your first match'},
    {img: 'images/fistIcon.webp', label: 'LOYALIST', description: 'You Stayed in the same clan for 30 days'},
    {img: 'images/briefcaseIcon.webp', label: 'DIPLOMAT', description: 'You Invited 10 people to games'},
    {img: 'images/crownIcon.webp', label: 'CHAMPION OF CHAMPIONS', description: 'You Won 3 consecutive tournaments'},
    {img: 'images/soldierIcon.webp', label: 'ARENA CONQUEROR', description: 'You Won 10 matches in the Colosseum arena'},
    {img: 'images/castleIcon.webp', label: 'DEFENDER OF THE KEEP', description: 'You Won 10 matches in the castle arena'},
    {img: 'images/wolfIcon.webp', label: 'GUARDIAN OF THE WILD', description: 'You Won 10 matches in the forest arena'},
    {img: 'images/armyGeneralIcon.webp', label: 'THE TRIUMVIRATE', description: 'You Won 10 matches in each arena'},
    {img: 'images/starIcon.webp', label: 'RISING STAR', description: 'You Secured your initial tournament win '}
];

async function updateProfileData(playerInfo){
    rank = await getPlayerRank(playerInfo.username);
    playerInfo.rank = Number.isInteger(rank) ? rank : 0;

    document.getElementById('username-profile').textContent = playerInfo.username;
    document.getElementById('rank-profile').textContent = 'Rank #' + playerInfo.rank;
    document.getElementById('xp-profile').textContent = playerInfo.xp + 'XP';
    document.querySelector('.circular-chart .percentage').textContent = playerInfo.win_rate + '%';
    document.querySelector('.game-count #num').textContent = playerInfo.gameCount;
    document.querySelector('.clock-box .days-count').textContent = playerInfo.days_since_creation + ' Days';
    document.querySelector('.handshake-box .days-count').textContent = playerInfo.clanDuration + ' Days';
    document.querySelector('.trophy-box .days-count').textContent = playerInfo.match_win;
    document.querySelector('.txt-1 .txt-1-num').textContent = playerInfo.pointsScored;
    document.querySelector('.txt-2 .txt-2-num').textContent = playerInfo.longestStreak;
    document.querySelector('.streak-count').textContent = playerInfo.match_lose;

    handleAvatarSystem(playerInfo.avatar || '../images/profile.webp');

    document.querySelector('.circle').setAttribute('stroke-dasharray', `${playerInfo.win_rate}, 100`);

}

function initializeProfile(){
    if (defaultUser.username == defaultUsername){
        const inviteToMatchBtn = document.getElementById('invite-to-match-btn');
        const modifyInfoBtn = document.getElementById('modify-info-btn');
        const friendsBtn = document.querySelector('.friends-btn');
        
        if (inviteToMatchBtn) inviteToMatchBtn.style.display = 'none';
        if (modifyInfoBtn) modifyInfoBtn.style.display = 'block';
        if (friendsBtn) friendsBtn.style.display = 'block';
    }
    else{
        const inviteToMatchBtn = document.getElementById('invite-to-match-btn');
        const modifyInfoBtn = document.getElementById('modify-info-btn');
        const friendsBtn = document.querySelector('.friends-btn');
        if (inviteToMatchBtn) inviteToMatchBtn.style.display = 'block';
        if (modifyInfoBtn) modifyInfoBtn.style.display = 'none';
        if (friendsBtn) friendsBtn.style.display = 'none';
        setUpAddFriendBtn(inviteToMatchBtn);
    }
    
    initProfileNav();
    const outerButtons = document.querySelectorAll('.btn-2');
    const cardContent = document.querySelector('card-content');

    const generalStats = document.querySelector('.overlay-cards');
    const matchHistory = document.querySelector('.match-history-table');
    const acheivements = document.querySelector('.acheivements-container');
    const friends = document.querySelector('.friends-container');

    const modifyInfo = document.querySelector('#modify-info-btn');
    const modifyLayout = document.querySelector('.modify-info-layout');
    const profileBody = document.querySelector('.profile-body');

    let acheivementAdded = 0;
    outerButtons.forEach(button => {
        button.addEventListener('click', () => {
            switch(button.textContent)
            {
                case 'General Stats':
                    matchHistory.style.display = 'none';
                    acheivements.style.display = 'none';
                    generalStats.style.display = 'block';
                    if(friends) friends.style.display = 'none';
                    break;
                
                case 'Match History' :
                    generalStats.style.display = 'none';
                    acheivements.style.display = 'none';
                    matchHistory.style.display = 'block';
                    if(friends) friends.style.display = 'none';
                    loadHistory(currentCard);
                    updateProfilePaginationControls();
                    setupProfilePaginationHandlers();
                    break;
                case 'Acheivements':
                    generalStats.style.display = 'none';
                    matchHistory.style.display = 'none';
                    acheivements.style.display = 'flex';
                    if(friends) friends.style.display = 'none';
                    if(!acheivementAdded){
                        addAcheivement(acheivementInfo[0]);
                        fillAchievements();

                        acheivementAdded = 1;
                    }
                    break;
                case 'Friends':
                    generalStats.style.display = 'none';
                    matchHistory.style.display = 'none';
                    acheivements.style.display = 'none';
                    if(friends) friends.style.display = 'flex';
                    initializeFriendsList();
            }
        });
    });

    modifyInfo.addEventListener('click', () =>{
        const profileBtns = document.querySelectorAll('.profile-body button');
        profileBody.style.filter = 'blur(10px)';
        modifyLayout.style.display = 'block';
        disableBtns(profileBtns);
        modifyInfoCardButtonsSetup(profileBody, modifyLayout, profileBtns);
    });
}

function modifyInfoCardButtonsSetup(profileBody, modifyLayout, profileBtns) {
    const cardBtns = document.querySelectorAll('.modify-card-buttons button');
    const inputUsername = document.querySelector('#edit-username .username');
    const inputEmail = document.querySelector('#edit-email .email');
    
    const avatarContainer = document.getElementById('avatar-container');
    const fileInput = document.getElementById('file-input');
    const avatarImg = document.getElementById('avatar-img');
    const avatarPlaceholder = document.getElementById('avatar-placeholder');
    const editIcon = document.getElementById('edit-icon');

    let avatarData = null;

    avatarContainer.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            avatarData = file;
            const reader = new FileReader();
            reader.onload = function (e){
                avatarImg.src = e.target.result;
                avatarImg.style.display = 'block';
                avatarPlaceholder.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    cardBtns.forEach(button => {
        button.addEventListener('click', () => {
            enableBtns(profileBtns);
            if (button.textContent === 'CONFIRM') {
                const username = inputUsername.value.trim();
                const email = inputEmail.value.trim();
    
                if (username || email || avatarData) {
                    fetchToBack(username, email, avatarData);
                }
            }
    
            if (['CANCEL', 'CONFIRM'].includes(button.textContent)) {
                inputUsername.value = '';
                inputEmail.value = '';
                inputUsername.classList.add('has-content');
                inputEmail.classList.add('has-content');
                profileBody.style.filter = 'blur(0px)';
                modifyLayout.style.display = 'none';
                resetAvatar();
            }
        });
    });

    inputUsername?.addEventListener('input', () => {
        const inputValue = inputUsername.value.trim();
        if (inputValue === '') inputUsername.classList.add('has-content');
        else inputUsername.classList.remove('has-content');
    });

    inputEmail?.addEventListener('input', () =>{
        const emailInput = inputEmail.value.trim();
        if (emailInput === '') inputEmail.classList.add('has-content');
        else inputEmail.classList.remove('has-content');
    });
}

function addHistoryMatchRow(player) {
    const wf = player.wf;
    const playerName = player.name;
    const oppnentName = player.oppenent.name;
    const playerScore = player.score;
    const oppenentScore = player.oppenent.score;
    const dateGame = player.gameDate;
    let color;
    if (wf == 'W') color = 'green';
    else color = 'red';

    let table = document.querySelector('.mh-table tbody');

    const tableNode = document.createElement('tr');
    tableNode.innerHTML = `
                <td class="td1" style="color: ${color};">${wf}</td>
                <td>${playerName}</td>
                <td data-full-text="${playerScore}-${oppenentScore}">${playerScore}-${oppenentScore}</td>
                <td>${oppnentName}</td>
                <td>
                    <img width="50" height="50" src="images/calendarIcon.webp">
                    ${dateGame}
                </td>`;
    if (table)
        table.appendChild(tableNode);
}

function loadHistory(page){
    const table = document.querySelector('.mh-table tbody');
    const paginationControls = document.querySelector('#hm-pagination-controls');
    if (allHistoryMatch.length === 0){
        if (paginationControls) paginationControls.style.display = 'none';
        table.innerHTML = `
        <tr class="no-players-tr">
            <td colspan="5" class="no-players-message">
                <div class="empty-state">
                    <i class="fa-solid fa-users-slash"></i>
                    <h3>No Matchs Yet</h3>
                    <p>Ready to start your gaming journey?</p>
                    <small>Play your first match to see your history here!</small>
                </div>
            </td>
        </tr>`
        return ;
    }
    const start = (page - 1) * playersPerCard;
    const end = start + playersPerCard;
    const historyRowsToShow = allHistoryMatch.slice(start, end);

    if (table) {
        paginationControls.style.display = 'flex';
        table.innerHTML = '';
        historyRowsToShow.forEach(player => addHistoryMatchRow(player));
    }
}

function updateProfilePaginationControls(){
    const totalPages = Math.ceil(allHistoryMatch.length / playersPerCard);
    const prevBtn = document.getElementById('hm-prev-btn');
    const nextBtn = document.getElementById('hm-next-btn');

    if (prevBtn) prevBtn.disabled = currentCard === 1;
    if (nextBtn) nextBtn.disabled = currentCard === totalPages;

    const pageIndicator = document.getElementById('hm-page-indicator');
    if (pageIndicator)
        pageIndicator.textContent = ` ${currentCard} / ${totalPages}`;
}

function setupProfilePaginationHandlers() {
    const prevBtn = document.getElementById('hm-prev-btn');
    const nextBtn = document.getElementById('hm-next-btn');

    prevBtn?.addEventListener('click', () => {
        if (currentCard > 1) {
            currentCard--;
            loadHistory(currentCard);
            updateProfilePaginationControls();
        }
    });

    nextBtn?.addEventListener('click', () => {
        const totalPages = Math.ceil(allHistoryMatch.length / playersPerCard);
        if (currentCard < totalPages){
            currentCard++;
            loadHistory(currentCard);
            updateProfilePaginationControls();
        }
    });
}


function addAcheivement(acheivement) {
    const acheivementIcon = acheivement.img;
    const acheivementLabel = acheivement.label;
    const acheivementDescription = acheivement.description;
    
    const acheivements = document.querySelector('.acheivements-container .scroll-div');
    
    const node = document.createElement('div');
    node.classList.add('acheivement');
    
    node.innerHTML = `
        <div class="flip">
            <!-- Front side of the achievement -->
            <div class="front">
                <img src="${acheivementIcon}" alt="logo" />
                <h5 class="acheivement-label">${acheivementLabel}</h5>
            </div>
            <!-- Back side of the achievement (description) -->
            <div class="back">
                <p>${acheivementDescription}</p>
            </div>
        </div>
    `;
    
    acheivements.appendChild(node);
    node.addEventListener('click', ()=>{
        node.classList.toggle('flipped');
    });
}

async function fillAchievements() {
    const uniqueAchievements = [...new Set(defaultUser.achievment)];
    
    uniqueAchievements.forEach(achieve => {
        const index = getIndexByLabel(achieve);
        if (index !== -1) {
            addAcheivement(acheivementInfo[index]);
        }
    });
}

function getIndexByLabel(label) {
    return acheivementInfo.findIndex(achievement => achievement.label === label);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidUsername(username) {
    return username && username.length <= 8;
}

async function fetchToBack(username, email, avatarFile) {
    try {
        if (username) {
            if (!isValidUsername(username)) {
                showNotification("Username must not exceed 8 characters");
                return;
            }
            if (username === defaultUser.username) {
                showNotification('The new username matches your current one');
                return;
            }
        }

        if (email){
            if (!isValidEmail(email)) {
                showNotification("Please enter a valid email address");
                return;
            }
            if (email === defaultUser.email) {
                showNotification('The new email matches your current one');
                return;
            }
        }

        if (avatarFile){
            const data = await fetchAvatar(avatarFile);
            if(data && data.avatar_url){
                handleAvatarSystem(data.avatar_url);
                showNotification("Avatar updated successfully");
            }
        }

        if (username || email) {
            const dataToSend = {};
            if (username) dataToSend.username = username;
            if (email) dataToSend.email = email;

            const response = await fetch("/api/update/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                // const errorData = await response.json();
                showNotification(`Error: Username or Email ALREADY EXISTS`);
                return;
            }

            const data = await response.json();
            if (username)
                await refreshProfilePage();
        }
        
        

    } catch (error) {
        showNotification("Failed to update the profile. Please try again.");
    }
}

async function refreshProfilePage(){
    const userData = await getUserData();

    if (JSON.stringify(userData) !== "{}") {
        Object.assign(defaultUser, userData);
        defaultUsername = userData.username;
    }

    Router.go(`/profile_${defaultUsername}`);
    showNotification("Profile updated successfully");
}


function resetAvatar(){
    const avatarImg = document.getElementById('avatar-img');
    const avatarPlaceholder = document.getElementById('avatar-placeholder');
    
    avatarImg.style.display = 'none';
    avatarPlaceholder.style.display = 'block';
}

function handleAvatarSystem(fetchedAvatar) {
    const profileAvatarImg = document.getElementById('profile-avatar-img');
    if (fetchedAvatar && profileAvatarImg){
        profileAvatarImg.src = fetchedAvatar;
    }
}

function setUpAddFriendBtn(addFriendBtn){
    if(!addFriendBtn) return;
    
    addFriendBtn.addEventListener('click', async()=>{
        const res = await fetchFriendRequest(defaultUser.id_user);
        if (!res){
            return ;
        }
        showNotification('Sent Succefully');
    });
}


async function getTheRightUserData(fullPath) {
    const userData = await getUserData();
    if (JSON.stringify(userData) !== "{}"){
        Object.assign(defaultUser, userData);
        defaultUsername = userData.username;
    }
    
    const page = fullPath.split('_')[0];
    if (page === '/leaderboard') return false;

    const id = fullPath.split('_')[1];
    if (!id || userData.username.toLowerCase() === id.toLowerCase()) return false;

    const user = await getUserProfile(id);
    if (user){
        loadPlayerProfile(user);
        return true;
    } else {
        showNotification('User not found');
        Router.go(`/profile_${defaultUser.username.toLowerCase()}`, true);
        return true;
    }
}

async function getUserProfile(id){
    try {
        const response = await apiSearchUser(id);
        if (!response || response.status !== 'success' || !response.users || !response.users.length){
            return null;
        }

        let result = response.users[0];
        for(let user of response.users){
            if (user.username === id){
                result = user;
                break;
            }
        }
        return result || null;

    } catch (error) {
        return null;
    }
}


async function profilePage(page, username){
    if (username && username !== defaultUser.username.toLowerCase()){
        const userData = await getUserProfile(username);
        if (!userData){
            showNotification('User not found');
            Router.go(`/dashboard}`, true);
            return ;
        }
        defaultUser = { ...defaultUser, ...userData };
    }
    else if (!defaultUser.username.toLowerCase()){
        const userData = await getUserData();
        if (JSON.stringify(userData) !== "{}"){
            Object.assign(defaultUser, userData);
            defaultUsername = userData.username;
        }
    }

    fillMatchHistory();
    loadCSSForPage();
    updateStylesheet('css/profile.css');
    page.innerHTML = templates.profile;
    updateProfileData(defaultUser);
    initializeProfile();
}


async function fetchAvatar(avatar){
    const formData = new FormData();
    formData.append('avatar', avatar);

    try{
        const response = await fetch('/user/avatar/', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.text();
            const errorJson = JSON.parse(errorData);
            const errorMessage = errorJson.message || 'FAILED: Could Not Update Avatar';
            showNotification(errorMessage);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error){
        showNotification('Something went wrong. Please try again later.');
        return null;
    }
}

async function fillMatchHistory(){
    const historyMatchData = defaultUser.matchHistory;
    allHistoryMatch = convertMatchHistory(historyMatchData);

}

function convertMatchHistory(arrayFormat) {
    return arrayFormat.map(match =>{
        const wf = match.player_score > match.opponent_score ? 'W' : 'F';
        
        const dateObj = new Date(match.match_date);
        const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;

        return {
            wf: wf,
            name: match.player,
            score: match.player_score.toString(),
            oppenent: {
                name: match.opponent,
                score: match.opponent_score.toString()
            },
            gameDate: formattedDate
        };
    });
}

let currentPage = 1;
let playersPerPage = 4;
let currentPlayersList = [];

const allPlayers = [];

async function getData(){
    const response = await fetch("/api/leadrboard", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        credentials: 'include'
    });
    
    if(response.ok){
        const data = await response.json();
        return data.sort((a, b) => b.xp - a.xp);
    }
    return [];
}

async function getPlayerRank(username){
    let playerList=[];
    const result = await getData();
    playerList.push(...result);
    return playerList.findIndex(p => (p.username === username)) + 1;
}

async function initializeLeaderboard() {
    const result = await getData();
    allPlayers.length = 0;
    allPlayers.push(...result);
    currentPlayersList = [...allPlayers];
    initializeNavigation();
    loadPage(currentPage);
    updatePaginationControls();
    setupPaginationHandlers();
    setupSearch();
    clanButtonsHandler();
}

function loadPage(page) {
    const table = document.querySelector('tbody');
    const paginationControls = document.querySelector('.pagination-controls');
    if (currentPlayersList.length === 0){
        if(table){
            if (paginationControls) paginationControls.style.display = 'none';

            table.innerHTML = `
                <tr class="no-players-tr">
                    <td colspan="5" class="no-players-message">
                        <div class="empty-state">
                            <i class="fa-solid fa-users-slash"></i>
                            <h3>No Players Yet</h3>
                        </div>
                    </td>
                </tr>
            `;
        }
        return;
    }

    const start = (page - 1) * playersPerPage;
    const end = start + playersPerPage;
    const playersToShow = currentPlayersList.slice(start, end);

    if (table) {
        if (paginationControls)
            paginationControls.style.display = 'flex';

        table.innerHTML = '';
        playersToShow.forEach(player => addPlayerToLeaderboard(player));
    }
}

function updatePaginationControls(){
    const totalPages = Math.ceil(currentPlayersList.length / playersPerPage);
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageIndicator = document.getElementById('page-indicator');
    
    if (currentPlayersList.length === 0) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (pageIndicator) pageIndicator.style.display = 'none';
        return;
    }
    
    if (prevBtn){
        prevBtn.disabled = currentPage === 1;
        prevBtn.style.display = 'block';
    }
    if (nextBtn){
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.style.display = 'block';
    }
    
    if (pageIndicator){
        pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
        pageIndicator.style.display = 'block';
    }
}

function setupPaginationHandlers(){
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    prevBtn?.addEventListener('click', () =>{
        if (currentPage > 1) {
            currentPage--;
            loadPage(currentPage);
            updatePaginationControls();
        }
    });
    
    nextBtn?.addEventListener('click', () => {
        const totalPages = Math.ceil(currentPlayersList.length / playersPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            loadPage(currentPage);
            updatePaginationControls();
        }
    });
}

function setupSearch() {
    const searchBtn = document.querySelector('.leaderboard-search button');
    const searchBar = document.querySelector('.leaderboard-search input');

    function handleSearchInput() {
        const query = searchBar.value.trim().toLowerCase();
        
        currentPlayersList = query === '' 
            ? [...allPlayers]
            : allPlayers.filter(player => 
                player.username.toLowerCase().includes(query)
              );
        
        currentPage = 1;
        updateLeaderboardDisplay();
    }

    function handleSearchBtn() {
        const query = searchBar.value.trim().toLowerCase();
        
        currentPlayersList = query === ''
            ? [...allPlayers]
            : allPlayers.filter(player => 
                player.username.toLowerCase() === query
              ); 
        
        currentPage = 1;
        updateLeaderboardDisplay();
    }

    function updateLeaderboardDisplay() {
        const table = document.querySelector('tbody');
        if (table) {
            if (currentPlayersList.length === 0) {
                table.innerHTML = '<tr><td colspan="5">No players found</td></tr>';
                document.getElementById('prev-btn').disabled = true;
                document.getElementById('next-btn').disabled = true;
                document.getElementById('page-indicator').textContent = 'Page 0';
            } else {
                loadPage(currentPage);
                updatePaginationControls();
            }
        }
    }

    if (searchBtn) {
        searchBtn.removeEventListener('click', handleSearchBtn);
        searchBtn.addEventListener('click', handleSearchBtn);
    }
    if (searchBar) {
        searchBar.removeEventListener('input', handleSearchInput);
        searchBar.addEventListener('input', handleSearchInput);
    }
}

function addPlayerToLeaderboard(player) {
    const num = allPlayers.findIndex(p => (p.username === player.username)) + 1;
    let color = styleFirstThree(num);
    let img = getLogo(player.clan.toLowerCase());

    let table = document.querySelector('.lb-table tbody');
    const tableNode = document.createElement('tr');
    tableNode.innerHTML = `
        <td style="color: ${color};">${num}</td>
        <td>${player.username}</td>
        <td>${player.xp}XP</td>
        <td>${player.clan.toUpperCase()}</td>
        <td>
            <div class="lb-icon">
                <img src="${img}"/>
            </div>
        </td>`;
    
    tableNode.removeEventListener('click', () => {
        loadPlayerProfile(player);
    });
    tableNode.addEventListener('click', () => {
        loadPlayerProfile(player);
    });

    if(table)
        table.appendChild(tableNode);

    if(num == 1) addTrophyIcon();
}

function addTrophyIcon() {
    const icon = document.querySelector('.lb-table tbody .lb-icon');
    const trophy = document.createElement('i');
    trophy.className = 'fa-solid fa-sm fa-trophy fa-fade';
    trophy.style = 'color: #e1c290;';
    
    if (icon) icon.appendChild(trophy);
}

async function loadPlayerProfile(player){
    if(!defaultUser.username){
        const userData = await getUserData();

        if (JSON.stringify(userData) !== "{}") {
            Object.assign(defaultUser, userData);
            defaultUsername = userData.username;
        }
    }
    
    try {
        const response = await apiSearchUser(player.username);

        if (!response || response.status !== 'success' || !response.users || !response.users.length){
            return;
        }

        let thisPlayerInfo = response.users[0];
        for(let user of response.users){
            if (user.username === player.username){
                thisPlayerInfo = user;
                break;
            }
        }

        if (!thisPlayerInfo || !thisPlayerInfo.username){
            return;
        }

        const isNotDefaultUser = thisPlayerInfo.username.toLowerCase() !== defaultUser.username.toLowerCase();

        if (isNotDefaultUser){
            defaultUser = { ...defaultUser, ...thisPlayerInfo };
        }

        Router.go(`/profile_${thisPlayerInfo.username.toLowerCase()}`);

    } catch (error) {
        showNotification(`Error loading profile for player: ${player.username}`);
    }
}


async function apiSearchUser(playerName) {
    if (!playerName)
        return null;
    const url = `/user/search_user/?username=${encodeURIComponent(playerName)}`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        }else{
            return null;
        }
    } catch (error) {
        showNotification(error.message);
        return null;
    }
}


function styleFirstThree(num) {
    if (num == 1) return "#FEE101";
    if (num == 2) return "#A7A7AD";
    if (num == 3) return "#824A02";
}

function getLogo(clan) {
    switch (clan) {
        case 'raiders':
            return "images/raiders_logo.webp";
        case 'scavengers':
            return "images/scavengers_logo.webp";
        case 'vertex':
            return "images/vertex_logo.webp";
    }
}

function clanButtonsHandler(){
    const clanBtns = document.querySelectorAll('.leaderboard-buttons button');
    
    clanBtns.forEach(button => {
        button.addEventListener('click', () => {
            currentPage = 1;
            if (button.innerHTML.trim() === 'CLAN') {
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                button.setAttribute('aria-expanded', isExpanded);

                const selectClan = document.querySelector('.dropdown-menu');
                selectClan.addEventListener('change', () => {
                    const selectedValue = selectClan.value;
                    currentPlayersList = allPlayers.filter(player => 
                        player.clan.toLowerCase() === selectedValue
                    );
                    loadPage(currentPage);
                    updatePaginationControls();
                });
            } else if (button.innerHTML.trim() === "ALL CLANS") {
                currentPlayersList = [...allPlayers];
                loadPage(currentPage);
                updatePaginationControls();
            }
        });
    });
}

async function leaderboardPage(page){
    loadCSSForPage();
    updateStylesheet('css/leaderboard.css');

    page.innerHTML = templates.Leaderboard;
    await initializeLeaderboard();
}
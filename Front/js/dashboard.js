let defaultUser = {
    id_user: 0,
    username: "",
    email: "",
    avatar: "/images/profile.webp",
    is_2fa_enabled: false,
    xp: 0,
    clan: "VERTEX",
    clan_logo: null,
    win_rate: 0.0,
    match_lose: 0,
    match_win: 0,
    days_since_creation: 0,
    tournamentsWon: 0,
    pointsScored: 0,
    longestStreak: 0,
    gameCount: 0,
    clanDuration: 0,
    achievment: [],
    matchHistory: [],
    rank: 0
};

let defaultUsername ;

async function getUserData(){
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
            return await response.json();
        }else{
            return {};
        }
    } catch (error) {
        return {};
    }
}

async function initializeDashboard(){
    document.title = "Dashboard";
    const slides = document.querySelectorAll('.card');
    
    slides.forEach(slide => {
        const oldSlide = slide.cloneNode(true);
        slide.parentNode.replaceChild(oldSlide, slide);
        
        oldSlide.addEventListener('click', async() => {
            const slideTitle = oldSlide.querySelector(".title-container h4").textContent;
            const route = `/${slideTitle.toLowerCase()}`;
            document.title = slideTitle;
            
            if(route === '/profile'){
                const userData = await getUserData();
                if (JSON.stringify(userData) !== "{}"){
                    Object.assign(defaultUser, userData);
                    defaultUsername = userData.username;
                }
            }
            Router.go(route);
        });
    });
}

async function dashboardPage(page){
    loadCSSForPage();
    updateStylesheet('css/dashboard.css');
    page.innerHTML = templates.Dashboard;
    initDashboardNav();
    await initializeDashboard();
}
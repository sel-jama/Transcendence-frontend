const Router = {
    validRoutes0: new Set(['/2fa', '/#','/login-1','/methods','/login', '/register', '/game-intro1', '/game-intro2', '/clan-info', '/scavengers', '/scavengers-identity', '/scavengers-card', '/vertex', '/vertex-identity', '/vertex-card','/raiders', '/raiders-identity', '/raiders-card']),
    validRoutes1: new Set(['/dashboard', '/profile', '/settings', '/leaderboard', '/arena', '/offlineGame', '/tournament', '/onlineGame']),
    
    boundHandlePopState: null,
    boundHandleLeftButtonClick: null,
    boundNavigationListener: null,

    currentRoute: null,
    logout: false,

    navigationStack: [],

    async init(){
        this.logout = false;
        this.removeAllEventListeners();
        this.boundHandlePopState = this.handlePopState.bind(this);
        this.boundHandleLeftButtonClick = this.handleLeftButtonClick.bind(this);
        
        window.addEventListener('popstate', this.boundHandlePopState);
        document.addEventListener('click', this.boundHandleLeftButtonClick);
        
        this.initializeNavigationListeners();
        let path = window.location.pathname;
        let fullPath = path;

        this.navigationStack.push(path);

        

        let [basePath, ...usernameParts] = path.split('_');
        let username = usernameParts.join('_');

        const isAuthed = await isAuthenticated();

        if((this.validRoutes1.has(basePath) || this.validRoutes0.has(basePath)) && hasOneSegment(path)){
            try {
                if (isAuthed){
                    if (basePath === '/profile'){
                        const userData = await getUserData();
                        if (JSON.stringify(userData) !== "{}"){
                            Object.assign(defaultUser, userData);
                            defaultUsername = userData.username;
                        }
                        
                        if (!username) {
                            const defaultPath = `/profile_${defaultUser.username.toLowerCase()}`;
                            history.replaceState({ route: defaultPath }, '', defaultPath);
                            await this.go(defaultPath, false);
                            return;
                        }
                        
                        const requestedUser = await getUserProfile(username);
                        if (!requestedUser){
                            const defaultPath = `/profile_${defaultUser.username.toLowerCase()}`;
                            history.replaceState({ route: defaultPath }, '', defaultPath);
                            await this.go(defaultPath, false);
                            showNotification('User not found, you got redirected to your profile');
                            return;
                        }
                        else {
                            loadPlayerProfile(requestedUser);
                            return;
                        }
                    }
                    
                    if (basePath === '/leaderboard'){
                        if (username && await getTheRightUserData(fullPath)){
                            return;
                        }
                    }
                    await this.go(fullPath, false);
                }else{
                    this.logout = true;
                    this.go('/methods', false);
                    showNotification('Access Denied: Please log in to access this page');
                }
            }catch (error){
                showNotification('FAILED: Could Not Navigate');
            }
        }else{
            if (isAuthed){ Router.go('/dashboard')}
            else {Router.go('/#', false);}
            showNotification('Page Not Found, You Got Redirected')
        }
    },

    removeAllEventListeners(){
        if (this.boundHandlePopState)
            window.removeEventListener('popstate', this.boundHandlePopState);

        if (this.boundHandleLeftButtonClick)
            document.removeEventListener('click', this.boundHandleLeftButtonClick);
        
        if (this.boundNavigationListener)
            document.removeEventListener('click', this.boundNavigationListener);
    },

    handleLeftButtonClick(event) {
        const leftBtn = event.target.closest('.left-btn');
        if (!leftBtn) return;
        
        event.preventDefault();
        const currentPath = window.location.pathname;
        
        if (currentPath.startsWith('/profile'))
            Router.go('/dashboard', true);
        else if(currentPath === '/dashboard'){
            Router.go('/profile');
        } else { window.history.back(); }
    },

    handlePopState(event) {
        const currentPath = this.navigationStack[this.navigationStack.length - 1];
        const targetPath = event.state?.route || window.location.pathname;
        
        this.navigationStack.push(targetPath);
        this.go(targetPath, false);
    },


    sendUserToDashboard: async() =>{
        Router.go('/dashboard');
    },

    initializeNavigationListeners: function() {
        if (this.boundNavigationListener){
            document.removeEventListener('click', this.boundNavigationListener);
        }

        this.boundNavigationListener = async (event) => {
            const menuItem = event.target.closest('li');
            if (!menuItem) return;

            let menuText = menuItem.textContent.toLowerCase().trim();
            if (['profile', 'settings', 'leaderboard', 'arena'].includes(menuText)){
                event.preventDefault();
                if (menuText === 'profile') {
                    const data = await getUserData();
                    defaultUsername = data.username;
                    menuText = menuText + '_' + defaultUsername;
                }
                this.go(`/${menuText}`);
            }
        };
        document.addEventListener('click', this.boundNavigationListener);

    },

    async startTransition() {
        return new Promise(resolve => {
            document.body.classList.add('fade-out');
            setTimeout(resolve, 200);
        });
    },

    async endTransition() {
        return new Promise(resolve => {
            document.body.classList.remove('fade-out');
            setTimeout(resolve, 200);
        });
    },
    

    go: async(route, addToHistory=true) =>{
        let notifText = '';
        const currentPath = window.location.pathname;
        const [baseCurrentPath] = currentPath.split('_');
        const [baseTargetPath] = route.split('_');
        
        const isAuthed = await isAuthenticated();
        if (isAuthed){
            if (baseTargetPath === '/login-1'){
                if (localStorage.getItem('2faCompleted') === 'false') {
                    notifText = 'Please Verify 2fa';
                    route = '/2fa';
                } else {
                    notifText = 'You Are Already LOGGED IN';
                    route = '/dashboard';
                }
            } else if (Router.validRoutes1.has(baseTargetPath) && localStorage.getItem('2faCompleted') === 'false') {
                notifText = 'Please Verify 2fa';
                route = '/2fa';
            }
        }
        if (addToHistory) Router.navigationStack.push(route);

        let normalizedRoute = route === '/' ? '/#' : route;


        let [basePath, ...usernameParts] = normalizedRoute.split('_');
        let username = usernameParts.join('_');

        if (!isAuthed && !noNeedToLoginPages(basePath)){
            go('/methods', false);
            showNotif = true;
        }

        if (route === '/profile' && !route.includes('_')){
            username = defaultUser.username.toLowerCase();
            if (defaultUser.username.toLowerCase())
                normalizedRoute = `/profile_${defaultUser.username.toLowerCase()}`;
        }
        
        await Router.startTransition();

        if (addToHistory && history.length > 1){
            history.pushState({ route: normalizedRoute }, '', normalizedRoute);
        }else{
            history.replaceState({ route: normalizedRoute }, '', normalizedRoute);
        }

        try{
            const page = document.querySelector("body");
            removePageSpecificCSS();
            Router.removeAllEventListeners();
    
            page.innerHTML = '';
            switch (basePath){
                case '/dashboard':
                    await dashboardPage(page);
                    break;

                case '/profile':
                    await profilePage(page, username)
                    break;

                case '/settings':
                    await settingsPage(page);
                    break;

                case '/leaderboard':
                    await leaderboardPage(page);
                    break;

                case '/arena':
					arena();
                    break;
                case '/offlineGame':
                    offlineGame();
                    break;
                case '/tournament':
                    tournament();
                    break;
                case '/onlineGame':
                    onlineGame();
                    break;
                
                    case '/#':
                        loadCSSForPage();
                        root();
                        break;
                    case '/methods':
                        after_root();
                        break;
                    case '/register':
                        register_page();
                        break;
                    case '/login-1':
                            login_page2();
                            break;
                    case '/game-intro1':
                            intro_page();
                            break;
                    case '/game-intro2':
                            intro2_page();
                            break;
                    case '/clan-info':
                            clan_info();
                            break;
                    case '/scavengers':
                            scavengers();
                            break;
                    case '/scavengers-identity':
                            scavengers_sh();
                            break;
                    case '/scavengers-card':
                            scavengers_card();
                                break;
                    case '/vertex':
                            vertex();
                            break;
                    case '/vertex-identity':
                            vertex_sh();
                            break;
                    case '/vertex-card':
                            vertex_card();
                            break;
                    case '/raiders':
                            raiders();
                            break;
                    case '/raiders-identity':
                            raiders_sh();
                                    break;
                    case '/raiders-card':
                            raiders_card();
                            break;
                    case '/2fa':
                            const res = await getUserData();
                            if (!res || !res.is_2fa_enabled){
                                if (isAuthed){ Router.go('/dashboard')}
                                else {Router.go('/methods', false);}
                                notifText = '2FA is Disabled';
                            }
                            else{
                                removePageSpecificCSS();
                                fa();
                            }
                            break;
                            
                    default:
                        
                        Router.go('/#', true);
                        return;
                
            }

            Router.boundHandlePopState = Router.handlePopState.bind(Router);
            Router.boundHandleLeftButtonClick = Router.handleLeftButtonClick.bind(Router);
            
            window.addEventListener('popstate', Router.boundHandlePopState);
            document.addEventListener('click', Router.boundHandleLeftButtonClick);
            
            Router.initializeNavigationListeners();

            if (notifText)
                showNotification(notifText);
            Router.currentRoute = normalizedRoute;
        
            await new Promise(resolve => setTimeout(resolve, 50));
            
        } catch (error) {
            showNotification('An error occurred while loading the page');
        }
        finally{
            setTimeout(() => toggleSpinner(false), 100);
            await Router.endTransition();
        }
    },
    
    clearNavigationStack() {
        this.navigationStack = [];
    },
    
    destroy(){
        this.removeAllEventListeners();
        this.clearNavigationStack();
        if (this.transitionElement){
            this.transitionElement.remove();
        }
    }
};

async function isAuthenticated(){
    const userData = await getUserData();

    if (JSON.stringify(userData) !== "{}"){
        return true;
    }
    else
        return false;
}

function noNeedToLoginPages(path){
    if (Router.validRoutes0.has(path))
        return true;
    return false;
}

function hasOneSegment(url){
    const pathSegments = url.split('/');
    if (pathSegments.length > 2) return false;
    else return true;
}

function removeAllBootstrapLinks() {
    const bootstrapLinks = document.querySelectorAll('link[href*="bootstrap"]');
    bootstrapLinks.forEach(link => link.remove());
}

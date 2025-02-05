function initProfileNav() {
    const cleanup = () => {
        const rightBtn = document.querySelector('#profile-navbar .right-btn');
        const doc = document;
        
        if (rightBtn?._clickHandler) {
            rightBtn.removeEventListener('click', rightBtn._clickHandler);
        }
        if (doc._clickHandler) {
            doc.removeEventListener('click', doc._clickHandler);
        }
    };

    cleanup();

    const rightBtn = document.querySelector('#profile-navbar .right-btn');
    
    rightBtn._clickHandler = function() {
        const dropdown = document.getElementById('dropdown');
        const button = this;

        if (!dropdown.classList.contains('show')) {
            dropdown.classList.add('show');
            button.classList.add('active');
        } else {
            dropdown.classList.remove('show');
            button.classList.remove('active');
        }
    };

    document._clickHandler = function(event) {
        const dropdown = document.getElementById('dropdown');
        const button = document.querySelector('.right-btn');
        if (!button?.contains(event.target) && !dropdown?.contains(event.target)) {
            dropdown?.classList.remove('show');
            button?.classList.remove('active');
        }
    };

    rightBtn?.addEventListener('click', rightBtn._clickHandler);
    document.addEventListener('click', document._clickHandler);
}


function setupDropdownNavigation(rightBtnSelector) {
    const rightBtn = document.querySelector(rightBtnSelector);
    
    if (rightBtn?._clickHandler) {
        rightBtn.removeEventListener('click', rightBtn._clickHandler);
    }
    if (document._clickHandler) {
        document.removeEventListener('click', document._clickHandler);
    }

    rightBtn._clickHandler = function() {
        const dropdown = document.getElementById('dropdown');
        const button = this;

        if (!dropdown.classList.contains('show')) {
            dropdown.classList.add('show');
            button.classList.add('active');
        } else {
            dropdown.classList.remove('show');
            button.classList.remove('active');
        }
    };

    document._clickHandler = function(event) {
        const dropdown = document.getElementById('dropdown');
        const button = document.querySelector(rightBtnSelector);
        if (!button?.contains(event.target) && !dropdown?.contains(event.target)) {
            dropdown?.classList.remove('show');
            button?.classList.remove('active');
        }
    };

    rightBtn?.addEventListener('click', rightBtn._clickHandler);
    document.addEventListener('click', document._clickHandler);
}

function initProfileNav() {
    setupDropdownNavigation('#profile-navbar .right-btn');
}

function initializeNavigation() {
    setupDropdownNavigation('.right-btn');
}

function setUpLogout() {
    const logoutBtn = document.querySelector('.right-btn');
    
    async function handleLogout(){
        try {
            logoutBtn.disabled = true;

            const response = await fetch('/api/logout/',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const error = await response.text();
                const errorJson = JSON.parse(error);
                throw new Error(errorJson.message || "Logout failed");
            }

            localStorage.clear();
            sessionStorage.clear();

            Router.logout = 'true';
            Router.destroy();
            Router.go('/methods');
            
        } catch (error) {
            showNotification('Failed to logout. Please try again.');
            logoutBtn.disabled = false;
        }
    }

    logoutBtn?.addEventListener('click', handleLogout);
}

function initDashboardNav(){
    setUpLogout();
}

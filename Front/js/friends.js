let friendsState = {
    friendRequests: [],
    onlineFriends: [],
    offlineFriends: [],
};

async function initializeFriendsList() {
    await fetchRequestFriendsData();
    await fetchAndProcessFriendsData();
    renderAllFriendsSections();
    setupFriendActionListeners();
}

async function fetchRequestFriendsData(){
    try {
        
        const response = await fetch('/user/friendship/list_request', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        
        if (!response.ok) {
            throw new Error(`Failed: ${response.status}`);
        }
        
        const data = await response.json();
        friendsState = {
            ...friendsState,
            friendRequests: data.list_of_requests || [],
        };
    } catch (error) {
        showNotification('Failed to load friends list. Please try again.');
    }
}

async function fetchAndProcessFriendsData(){
    try {
        const activeResponse = await fetch('/api/list_active/', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!activeResponse.ok) {
            throw new Error('Failed to fetch active users data');
        }

        const offlineResponse = await fetch('/api/list_offline/', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!offlineResponse.ok) {
            throw new Error('Failed to fetch offline users data');
        }

        const activeData = await activeResponse.json();
        const offlineData = await offlineResponse.json();

        const onlineFriends = (activeData?.data?.active_users || []).map(user => ({
            id_user: user.id_user,
            username: user.username || 'Unknown User',
            avatar: user.avatar || null,
            online: true
        })).sort((a, b) => a.username.localeCompare(b.username));

        const offlineFriends = (offlineData?.data?.active_users || []).map(user => ({
            id_user: user.id_user,
            username: user.username || 'Unknown User',
            avatar: user.avatar || null,
            lastOnline: user.last_online || new Date().toISOString(),
            online: false
        })).sort((a, b) => a.username.localeCompare(b.username));

        friendsState = {
            ...friendsState,
            onlineFriends,
            offlineFriends
        };

        return { onlineFriends, offlineFriends };

    } catch (error) {
        showNotification(error.message || 'Failed to load friends list');
        return { onlineFriends: [], offlineFriends: [] };
    }
}

function updateFriendsState(data) {
    friendsState = {
        friendRequests: data.list_of_requests || [],
        onlineFriends: data.onlineFriends || [],
        offlineFriends: data.offlineFriends || []
    };
}

function renderAllFriendsSections(){
    renderFriendSection('friend-requests', friendsState.friendRequests, createFriendRequestRow);
    renderFriendSection('online-friends', friendsState.onlineFriends, createOnlineFriendRow);
    renderFriendSection('offline-friends', friendsState.offlineFriends, createOfflineFriendRow);
}

function renderFriendSection(sectionClass, friends, rowCreatorFunction){
    const section = document.querySelector(`.friends-list.${sectionClass}`);
    if (!section) return;

    if (friends.length === 0){
        section.innerHTML = createEmptyStateMessage(sectionClass);
        return;
    }
    section.innerHTML = friends.map(friend => rowCreatorFunction(friend)).join('');
}

function createEmptyStateMessage(sectionType){
    const messages = {
        'friend-requests': 'No pending friend requests',
        'online-friends': 'No friends currently online',
        'offline-friends': 'No offline friends'
    };

    return `
        <div class="empty-state">
            <i class="fa-solid fa-users-slash"></i>
            <p>${messages[sectionType]}</p>
        </div>
    `;
}

function createFriendRequestRow(friend){
    return `
        <div class="friend-row" data-friend-id="${friend.id_user}" data-friendship-id="${friend.id_friendship}">
            <div class="friend-avatar">
                <img src="${friend.avatar || '/images/profile.webp'}" alt="${friend.username}'s avatar">
            </div>
            <div class="friend-info">
                <span class="friend-name">${friend.username}</span>
                <span class="friend-status">Wants to be your friend</span>
            </div>
            <div class="friend-actions">
                <button class="friend-btn accept-btn" data-action="accept">Accept</button>
                <button class="friend-btn decline-btn" data-action="decline">Decline</button>
            </div>
        </div>
    `;
}

function createOnlineFriendRow(friend) {
    return `
        <div class="friend-row" data-friend-id="${friend.id_user}" data-friendship-id="${friend.id_friendship}">
            <div class="friend-avatar">
                <img src="${friend.avatar || '/images/profile.webp'}" alt="${friend.username}'s avatar">
            </div>
            <div class="friend-info">
                <span class="friend-name">${friend.username}</span>
                <span class="friend-status online">
                    <span class="friend-status-indicator online"></span>
                        Online
                </span>
            </div>
        </div>
    `;
}

function createOfflineFriendRow(friend) {
    return `
        <div class="friend-row" data-friend-id="${friend.id_user}" data-friendship-id="${friend.id_friendship}">
            <div class="friend-avatar">
                <img src="${friend.avatar || '/images/profile.webp'}" alt="${friend.username}'s avatar">
            </div>
            <div class="friend-info">
                <span class="friend-name">${friend.username}</span>
                <span class="friend-status">
                    <span class="friend-status-indicator offline"></span>
                    Offline
                </span>
            </div>
        </div>
    `;
}

function setupFriendActionListeners(){
    const friendsContainer = document.querySelector('.friends-container');
    if (!friendsContainer) return;

    friendsContainer.addEventListener('click', async (event) => {
        const button = event.target.closest('.friend-btn');
        if (!button) return;

        const friendRow = button.closest('.friend-row');
        const userId = friendRow.dataset.friendId;
        const action = button.dataset.action;

        try {
            if (action === 'decline'){
                await removeFriendRequest(userId);
            }
            else if (action === 'accept'){
                await acceptFriendRequest(userId);
            }
        } catch (error) {
            showNotification(`Failed to ${action} friend. Please try again.`);
        }
    });
}

async function fetchFriendRequest(friendId) {
    const dataToSend = { from_id: friendId };
    try {
       
        const response = await fetch(`/user/friendship/request/`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(dataToSend),
        });

        if (!response.ok){
            const error = await response.text();
            const errorJson = JSON.parse(error);
            const errorMessage = errorJson.message || "An error occurred";
            showNotification(errorMessage);
            return false;
        }

        const responseData = await response.json();
        return responseData;

    }catch (error){
        showNotification('An unexpected error occurred. Please try again later.');
        return false;
    }
}


async function fetchAcceptFriend(userId) {
    try{
        
        const response = await fetch(`/user/friendship/manage/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ from_id: userId })
        });

        if (!response.ok) {
            const error = await response.text();

            const errorJson = JSON.parse(error);
            const errorMessage = errorJson.message || "An error occurred";
            showNotification(errorMessage);
            return null;
        }
        return response.json();
    }
    catch(e){
        showNotification('Something Went Wrong, try again later');
    }
}

async function fetchDeclinedFriend(userId){
    try{
        
        const response = await fetch(`/user/friendship/delete/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ from_id: userId })
        });

        if (!response.ok) {
            const error = await response.text();

            const errorJson = JSON.parse(error);
            const errorMessage = errorJson.message || "An error occurred";
            showNotification(errorMessage);
            return null;
        }
        return response.json();
    }
    catch(e){
        showNotification('Something Went Wrong, try again later');
    }
}

async function removeFriendRequest(idUser){
    const res = await fetchDeclinedFriend(idUser);
    if (!res) return ;

    const removedFriend = friendsState.friendRequests.find(friend => friend.id_user === parseInt(idUser));
    friendsState.friendRequests = friendsState.friendRequests.filter(friend => friend.id_user !== parseInt(idUser));
    renderFriendSection('friend-requests', friendsState.friendRequests, createFriendRequestRow);
    return removedFriend;
}


async function acceptFriendRequest(userId) {
    try {
        const res = await fetchAcceptFriend(userId);
        if (!res) return;

        const acceptedFriend = friendsState.friendRequests.find(friend => friend.id_user === parseInt(userId));
        friendsState.friendRequests = friendsState.friendRequests.filter(friend => friend.id_user !== parseInt(userId));
        renderFriendSection('friend-requests', friendsState.friendRequests, createFriendRequestRow);

        await fetchAndProcessFriendsData();
        
        renderFriendSection('online-friends', friendsState.onlineFriends, createOnlineFriendRow);
        renderFriendSection('offline-friends', friendsState.offlineFriends, createOfflineFriendRow);

        showNotification(`Friend request accepted for ${acceptedFriend?.username || 'user'}`);
    } catch (error) {
        showNotification('Failed to accept friend request.');
    }
}
function getIdByUsername(username) {
    for (const category in friendsState){
        const friend = friendsState[category].find(f => f.username === username);
        if (friend)
            return friend.id;
    }
    return null;
}


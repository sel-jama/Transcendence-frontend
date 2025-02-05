let setupInProgress = false;
let qr_code = null;

async function initializeSettings(){
    initializeNavigation();
    
    const settingsButtons = document.querySelectorAll('.btn-1');
    const outerButtons = document.querySelectorAll('.btn-2');
    const cardContent = document.querySelector('card-content');
    const cardButtons = document.querySelector('.card-buttons');

    settingsButtons.forEach(button => {
        button.addEventListener('click', () => {
            updateCardContent(button.textContent, cardContent);
        });
    })

    const userData = await getUserData();
    if (JSON.stringify(userData) !== "{}"){
        localStorage.setItem('auth_42', userData.auth_42);
    }


    outerButtons.forEach(button =>{
        button.addEventListener('click', () => {
            if (button.textContent != 'Game Settings')
                cardButtons.style.display = 'none';
            else
                cardButtons.style.display = 'block';

            updateCardContent(button.textContent, cardContent);
        });
    });

    window.addEventListener('beforeunload', (e) => {
        if (setupInProgress) {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            resetTwoFactorState();
        }
    });
}

function resetTwoFactorState() {
    localStorage.setItem('2fachecked', false);
    const cardContent = document.querySelector('card-content');
    if (cardContent){
        const twoFaCheckbox = cardContent.shadowRoot.querySelector('.twoFabox');
        if (twoFaCheckbox){
            twoFaCheckbox.checked = false;
        }
    }
    setupInProgress = false;
    enableAllButtons();
}

function enableAllButtons(){
    const allBtns = document.querySelectorAll('button');
    const cardContent = document.querySelector('card-content');
    if (cardContent){
        const cardBtns = cardContent.shadowRoot.querySelectorAll('button');
        enableBtns(allBtns);
        enableBtns(cardBtns);
    }
}

function updateCardContent(buttonText, cardContent){
    let newContent = '';
        
        switch(buttonText) {
            case 'Sound Settings':
                newContent = `
                    <div class="mb-3">
                        <label for="sfxVolume" class="form-label">Sound Effects Volume:</label>
                        <input type="range" class="form-range" id="sfxVolume">
                    </div>
                    <div class="mb-3">
                        <label for="musicVolume" class="form-label">Music Volume:</label>
                        <input type="range" class="form-range" id="musicVolume">
                    </div>
                `;
                break;
            case 'Input Settings':
                newContent = `
                    <div class="mb-3">
                        <label for="keybord" class="form-label">keybord Sensitivity:</label>
                        <input type="range" class="form-range" id="keybord">
                    </div>
                    <div class="mb-3">
                        <label for="mouse" class="form-label">Mouse Sensitivity:</label>
                        <input type="range" class="form-range" id="mouse">
                    </div>
                `;
                break;
            case 'Control Settings':
                newContent = `
    
                    <div class="control-settings mb-3">
                        <div class="move-up"> 
                            <label class="control-stg-label">Move Up</label>
                            <h5>W / <span class="fa-solid fa-arrow-up arrow-icon"></span> </h5>
                        </div>
    
                        <div class="move-down"> 
                            <label class="control-stg-label" >Move Down</label>
                            <h5>S / <span class="fa-solid fa-arrow-down arrow-icon"></span> </h5>
                        </div>
                    </div>
                `;
                break;
    
                //outer buttons
                case 'Game Settings':
                    newContent =  `
                        <div class="mb-3">
                            <label for="sfxVolume" class="form-label">Sound Effects Volume:</label>
                            <input type="range" class="form-range" id="sfxVolume">
                        </div>
                        <div class="mb-3">
                            <label for="musicVolume" class="form-label">Music Volume:</label>
                            <input type="range" class="form-range" id="musicVolume">
                        </div>
                    `;
                    break;
            case 'Privacy Settings':
                newContent = `
                    <div class="privacy-settings mb-3">
                        <label for="online-visibility" class="privacy-form-label">Online Status Visibility</label>
                        <select id="online-visibility" class="form-select">
                            <option value="online">Online</option>
                            <option value="invisible">Invisible</option>
                        </select>
                    </div>
                `;
                break;
            
            case 'Account Settings':
                let checked = '';
                if (localStorage.getItem('2fachecked') && localStorage.getItem('2fachecked') === 'true')
                    checked = 'checked';

                const qrCardDisplay = qr_code ? 
                `<div class="qr-card" style="display:none;">
                    <div class="qr-card-body">
                        <h5 class="qr-card-title">Two-Factor Authentication</h5>
                        <div class="qr-container">
                            <img src="${qr_code}" alt="qrCode"/>
                        </div>
                        <p class="qr-description">Open the authenticator<br>
                            app and scan the QR<br>
                            code.
                        </p>
                        <div class="qr-card-btns">
                            <button type="button" class="qr-cancel-btn btn">Cancel</button>
                            <button type="button" class="qr-continue-btn btn">Continue</button>
                        </div>
                    </div>
                </div>` : '';

                const isAuth42 = localStorage.getItem('auth_42') === 'true';
                const passwordButtonDisabled = isAuth42 ? 'disabled' : '';
                const passwordButtonStyle = isAuth42 ? 'opacity: 0.5; cursor: not-allowed;' : '';


                newContent = `
                        <div class="account-setting-btns1">
                            <button type="button" class="security-btn rs-btn-1 btn btn-lg">Security Settings</button>
                            <button type="button" class="accountOpt-btn rs-btn-1 btn btn-lg">Account Options</button>
                        </div>

                        <div class="security-content">
                            <div class="sc-2fa">
                                <h5 id="title">2FA</h5>
                                <label class="switch">
                                    <input type="checkbox" id="2fa" class="twoFabox" ${checked}>
                                    <span class="slider round"></span>
                                    <span class="switch-label"></span>
                                </label>
                            </div>

                            <div class="sc-pw">
                                <button type="button" class="btn btn-lg edit-password" ${passwordButtonDisabled} style="${passwordButtonStyle}">
                                    Change password
                                    <img src="images/forwardIcon.webp" alt="forward" />
                                </button>
                            </div>
                        </div>

                        <div class="account-options-content" style="display:none;">
                            <button type="button" class="rp-btn btn-lg">Reset Profile
                                <img src="images/resetIcon.webp" />
                            </button>
                            <button type="button" class="rs-btn btn-lg">Delete Account
                                <img src="images/trashIcon.webp" />
                            </button>
                        </div>

                        <div class="edit-pw-content">
                            <h5 id="pw-title">Change password</h5>

                            <div class="change-pw-inputs">
                                <input type="password" placeholder="NEW PASSWORD" id="new">
                                <input type="password" placeholder="CONFIRM NEW PASSWORD" id="confirm-new">
                            </div>

                            <div class="change-pw-buttons">
                                <button type="button" class="back-btn btn-lg btn">Back</button>
                                <button type="button" class="submit-btn btn-lg btn">Submit</button>
                            </div>
                        </div>

                        ${qrCardDisplay}

                        <div class="digit-verif-card" style="display:none;">
                            <div class="dv-card-body">
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
                                <div class="dv-card-btns">
                                    <button type="button" class="dv-cancel-btn btn">back</button>
                                    <button type="button" class="dv-continue-btn btn">Submit</button>
                                </div>
                            </div>
                        </div>
                `;
                break;
            }
            
            
            cardContent.shadowRoot.querySelector('.tab-content').innerHTML = newContent;
            if (buttonText === 'Privacy Settings') {
                initializePrivacySettings(cardContent);
            } else if (buttonText === 'Account Settings') {
                attachAccountSettingsListeners(cardContent);
            }

}

function attachAccountSettingsListeners(cardContent){
    const accountBtns = cardContent.shadowRoot.querySelectorAll('.account-setting-btns1 button');
    const button1Content = cardContent.shadowRoot.querySelector('.security-content');
    const button2Content = cardContent.shadowRoot.querySelector('.account-options-content');
    const pwEditContent = cardContent.shadowRoot.querySelector('.edit-pw-content');

    const twoFaCheckbox = cardContent.shadowRoot.querySelector('.twoFabox');
    const qrCard = cardContent.shadowRoot.querySelector('.qr-card');

    changePwBtnListener(cardContent, button1Content, pwEditContent);

    if (setupInProgress){
        resetTwoFactorState();
    }

    accountBtns.forEach(button => {
        button.addEventListener('click', ()=>{
            if(button.classList.contains('security-btn')){
                button2Content.style.display = "none";
                pwEditContent.style.display = 'none';
                button1Content.style.display = "flex";
            }
            else if(button.classList.contains('accountOpt-btn')){
                button2Content.style.display = "flex";
                button1Content.style.display = "none";
                pwEditContent.style.display = 'none';
                attachResetButtonListeners(cardContent);
            }
        });
    });

    twoFaCheckbox.addEventListener('change', async (event) => {
        await handleTwoFactorToggle(event, cardContent);
    });
}


async function handleTwoFactorToggle(event, cardContent) {
    const qrCard = cardContent.shadowRoot.querySelector('.qr-card');
    const twoFaCheckbox = event.target;

    if (event.target.checked) {
        qr_code = await fetchQrCode();
        
        if (!qr_code) {
            twoFaCheckbox.checked = false;
            return;
        }

        updateCardContent('Account Settings', cardContent);
        
        const updatedQrCard = cardContent.shadowRoot.querySelector('.qr-card');
        setupInProgress = true;
        localStorage.setItem('2fachecked', false);
        setTimeout(() => { updatedQrCard.style.display = 'block'; }, 300);
        attachQrCardButtonListerners(cardContent, updatedQrCard, twoFaCheckbox);
    } else {
        if (await disableTwoFactor()){
            setupInProgress = false;
            localStorage.setItem('2fachecked', false);
        }
    }
}

function attachQrCardButtonListerners(cardContent, qrCard, checkbox) {
    const qrBtns = cardContent.shadowRoot.querySelectorAll('.qr-card-btns button');
    const digitVerifCard = cardContent.shadowRoot.querySelector('.digit-verif-card');

    const allBtns = document.querySelectorAll('button');
    const cardBtns = cardContent.shadowRoot.querySelectorAll('.account-setting-btns1 button');

    disableBtns(allBtns);
    disableBtns(cardBtns);

    qrBtns.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('qr-cancel-btn')) {
                setupInProgress = false;
                enableBtns(allBtns);
                enableBtns(cardBtns);
                qrCard.style.display = 'none';
                checkbox.checked = false;
                localStorage.setItem('2fachecked', false);
            } else if (button.classList.contains('qr-continue-btn')) {
                qrCard.style.display = 'none';
                digitVerifCard.style.display = 'flex';
                attachDvCardBtnListeners(cardContent, qrCard, digitVerifCard, allBtns, cardBtns, checkbox);
            }
        });
    });
}

function attachDvCardBtnListeners(cardContent, qr, dv, allBtns, cardBtns, checkbox) {
    setupDigitInputs(cardContent);
    const dvCardBtns = cardContent.shadowRoot.querySelectorAll('.dv-card-btns button');

    dvCardBtns.forEach(button => {
        button.addEventListener('click', async () => {
            if (button.classList.contains('dv-cancel-btn')) {
                qr.style.display = 'flex';
                dv.style.display = 'none';
            } else if (button.classList.contains('dv-continue-btn')) {
                if (checkDigits(cardContent)){
                    const code = getVerificationCode(cardContent);

                    if (!await fetchTwoFaVerify(cardContent, code))
                        return;

                    if (!await enableTwoFactor()){
                        checkbox.checked = false;
                        localStorage.setItem('2fachecked', false);
                        return;
                    }

                    setupInProgress = false;
                    enableBtns(allBtns);
                    enableBtns(cardBtns);
                    checkbox.checked = true;
                    localStorage.setItem('2fachecked', true);
                    updateCardContent('Account Settings', cardContent);
                    dv.style.display = 'none';
                }
            }
        });
    });
}

async function fetchQrCode() {
    const url = `/api/2fa/setup`;
    
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "*/*",
            },
            credentials: 'include'
        });

        if (response.ok) {
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            return imageUrl;
        } else {
            showNotification('Failed to fetch QR code, please try again');
            return null;
        }
    } catch (error) {
        showNotification('Something went wrong, Please try again');
        return null;
    }
}


async function fetchTwoFaVerify(cardContent, code){
    try{
        const toSend = {};
        toSend.code = code;
        const updateResponse = await fetch("/api/2fa/verify", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(toSend)
        });
        
        if (updateResponse.ok){
            showNotification('2FA Verified Successfully');
            clearTwoFaInputs(cardContent);
        }else{
            const error = await updateResponse.json();
            showNotification(error.message || 'Failed To Verify');
            clearTwoFaInputs(cardContent);
            return false;
        }
        
    } catch (error) {
        showNotification('An error occurred. Please try again later.');
        return false;
    }
    return true;
}

function getVerificationCode(cardContent) {
    const inputs = cardContent.shadowRoot.querySelectorAll('.dv-container input');
    const code = Array.from(inputs).map(input => input.value).join('');
    return code;
}

function checkDigits(cardContent) {
    const inputDigits = cardContent.shadowRoot.querySelectorAll('.dv-container input');

    const allFilled = Array.from(inputDigits).every(digitInput => digitInput.value);

    if(!allFilled){
        showNotification('Please fill all the required input value');
        return false;
    }
    return true;
}

function disableBtns(buttons){
    buttons.forEach(button => {
        button.disabled = true;
    });
} 

function enableBtns(buttons){
    buttons.forEach(button => {
        button.disabled = false;
    });
}

function changePwBtnListener(cardContent, OldContent, pwEditContent) {
    const pwEditBtn = cardContent.shadowRoot.querySelector('.sc-pw .edit-password');

    pwEditBtn.addEventListener('click', (event)=>{
        event.stopPropagation();
        OldContent.style.display = 'none';
        pwEditContent.style.display = 'block';

        const backBtn = cardContent.shadowRoot.querySelector('.change-pw-buttons .back-btn');
        const submitBtn = cardContent.shadowRoot.querySelector('.change-pw-buttons .submit-btn');

        backBtn.addEventListener('click', ()=>{
                pwEditContent.style.display = 'none';
                OldContent.style.display = 'flex';
                clearInputs(cardContent);
        });

        submitBtn.addEventListener('click', async ()=>{
            if (!await handlePasswordChange(cardContent)){
                return ;
            }
            pwEditContent.style.display = 'none';
            OldContent.style.display = 'flex';
    });
    });
}

function attachResetButtonListeners(cardContent) {
    const resetButtons = cardContent.shadowRoot.querySelectorAll('.account-options-content button');
    let newContent = '';

    resetButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('rs-btn')) {
                newContent = `
                    <div class="card reset-card ">
                        <div class="reset-card-body">
                            <h5 class="reset-card-title">Delete Account</h5>
                            <p class="reset-card-text">
                                This action will <span style="color:red;">permanently remove your
                                account and erase all associated data,</span> including <br>
                                your progress, stats, achievements, and <br>
                                current rank. Once deleted, your account <br>
                                <span style="color:red;">cannot be recovered.</span>
                            </p>
                        
                            <div class="lg-btn reset-card-buttons">
                                <button id="cancel-btn" type="button">Cancel</button>
                                <button id="reset-btn" type="button">Confirm Reset</button>
                            </div> 
                        </div>
                    </div>
                `
            } 
            else if(button.classList.contains('rp-btn'))
            {
                newContent = `
                    <div class="card reset-card ">
                        <div class="reset-card-body">
                            <h5 class="reset-card-title">Reset Profile</h5>
                            <p class="reset-card-text">Are you sure you want to reset your profile? <br>
                                This action will <span style="color:red;">permanently erase all of your <br>
                                progress</span>, including your stats, achievements, <br>
                                and current rank. This cannot be undone.</p>
                        
                            <div class="lg-btn reset-card-buttons">
                                <button id="cancel-btn" type="button">Cancel</button>
                                <button id="reset-btn" type="button">Confirm Reset</button>
                            </div>
                        </div>
                    </div>
                `
            }

            cardContent.shadowRoot.querySelector('.tab-content').innerHTML = newContent;
            attachResetCardButtonsListeners(cardContent, button.classList.contains('rp-btn'));
        });
    });

}

function attachResetCardButtonsListeners(cardContent, rpBtn){
    const resetButtons = cardContent.shadowRoot.querySelectorAll('.reset-card-buttons button');
    let newContent = '';

    resetButtons.forEach(button => {
        button.addEventListener('click', async() => {
            if (button.textContent == 'Cancel'){
                updateCardContent('Account Settings', cardContent);
            }
            else if(button.textContent == 'Confirm Reset'){
                const notif = document.getElementsByClassName('alert')[0]; 
                if (rpBtn){
                    showNotification('Could not reset profile, Try again later');
                    updateCardContent('Account Settings', cardContent);
                }
                else if (await fetchResetProfile()){
                    showNotification('Profile Deleted Successfully');
                    localStorage.clear();
                    setTimeout(() => {
                        Router.logout = true;
                        Router.go('/methods', false);
                    }, 300);
                }
            }
        });
    });
}

async function fetchResetProfile() {
    try{
        
        const res = await fetch('/api/restprofile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            credentials: 'include',
        });

        if (!res.ok){
            const err = await res.text();
            const errJson = JSON.parse(err);
            const errMsg = errJson.message || 'FAILED: Could Not Reset Profile';
            showNotification(errMsg);
            return false;
        }
    }
    catch (error){
        showNotification('An error occurred. Please try again later.');
        return false;
    }
    return true;
}

function showNotification(notif){
    
    notif.style.display = "block";

    setTimeout(()=> { notif.style.display = "none" },3000);
}

async function settingsPage(page){
    const userData = await getUserData();

    if (JSON.stringify(userData) !== "{}") {
        Object.assign(defaultUser, userData);
        defaultUsername = userData.username;
        if (userData.is_2fa_enabled)
            localStorage.setItem('2fachecked', true);
        else
            localStorage.setItem('2fachecked', false);
    }
    loadCSSForPage();
    updateStylesheet('css/settings.css');

    page.innerHTML = templates.settings;
    await initializeSettings();
}

async function handlePasswordChange(cardContent){
    const newPassword = cardContent.shadowRoot.getElementById('new').value;
    const confirmPassword = cardContent.shadowRoot.getElementById('confirm-new').value;
    
    if (!newPassword || !confirmPassword){
        showNotification('All fields are required');
        return null;
    }
    
    if (newPassword !== confirmPassword){
        showNotification('New passwords do not match');
        return null;
    }
    
    if (newPassword.length < 8){
        showNotification('New password must be at least 8 characters long');
        return null;
    }

    try {
        const toSend = {};
        toSend.password = newPassword;
       
        const updateResponse = await fetch("/api/update/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(toSend)
        });
        
        if (updateResponse.ok){
            showNotification('Password updated successfully');
            clearInputs(cardContent);
        }else{
            const error = await updateResponse.json();
            showNotification(error.message || 'Failed to update password');
        }
        
    } catch (error) {
        showNotification('An error occurred. Please try again later.');
        clearInputs(cardContent);
    }
    return true ;
}

function clearInputs(cardContent){
    cardContent.shadowRoot.getElementById('new').value = '';
    cardContent.shadowRoot.getElementById('confirm-new').value = '';
}

function clearTwoFaInputs(cardContent){
    const inputs = cardContent.shadowRoot.querySelectorAll('.dv-container input');
    inputs.forEach((input) => {
        input.value = '';
    });
}


function setupDigitInputs(cardContent) {
    const inputs = cardContent.shadowRoot.querySelectorAll('.dv-container input');
    
    inputs.forEach((input, index) => {
        input.addEventListener('input', function(e) {
            if (this.value.length === 1) {
                if (!/^\d+$/.test(this.value)) {
                    this.value = '';
                    return;
                }
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            }
        });

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value && index > 0) {
                inputs[index - 1].focus();
            }
        });

        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').trim();
            
            if (/^\d{6}$/.test(pastedData)) {
                inputs.forEach((input, i) => {
                    input.value = pastedData[i];
                });
                inputs[inputs.length - 1].focus();
            }
        });
    });
}

async function enableTwoFactor() {
    try {
        const response = await fetch("api/2fa/enable", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to enable 2FA');
        }

        return true;
    } catch (error) {
        showNotification(error.message || 'Failed to enable 2FA');
        return false;
    }
}

async function enableTwoFactor() {
    try {
        const response = await fetch("api/2fa/enable", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to enable 2FA');
        }

        return true;
    } catch (error) {
        showNotification(error.message || 'Failed to enable 2FA');
        return false;
    }
}

async function disableTwoFactor(){
    try {
        const response = await fetch("api/2fa/disable", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to disable 2FA');
        }

        return true;
    } catch (error) {
        showNotification(error.message || 'Failed to disable 2FA');
        return false;
    }
}

function initializePrivacySettings(cardContent) {
    if (!cardContent || !cardContent.shadowRoot) {
        return;
    }

    const visibilitySelect = cardContent.shadowRoot.querySelector('#online-visibility');
    if (!visibilitySelect) {
        return;
    }

    const savedVisibility = localStorage.getItem('visibility_status') || 'online';
    visibilitySelect.value = savedVisibility;

    visibilitySelect.removeEventListener('change', handleVisibilityChange);
    
    visibilitySelect.addEventListener('change', handleVisibilityChange);
}

async function handleVisibilityChange(event) {
    try {
        const newStatus = event.target.value;
        if (newStatus === 'invisible'){
            if (!await setUserOffline()){
                showNotification('Failed to updated visibility status');
                return;
            }
        }
        else{
            if (!await setUserOnline()){
                showNotification('Failed to updated visibility status');
                return;
            }
        }
        
        localStorage.setItem('visibility_status', newStatus);
        showNotification('Visibility status updated successfully');
        
    } catch (error){
        showNotification('Failed to update visibility status');
    }
}

function getCurrentVisibilityStatus() {
    return localStorage.getItem('visibility_status') || 'online';
}

async function setUserOffline(){
    try {
        const response = await fetch("/api/offline", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }
        return true;
    } catch (error) {
        return false;
    }
}

async function setUserOnline(){
    try {
        const response = await fetch("/api/online", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }
        return true;
    } catch (error) {
        return false;
    }
}
function initializeSettings() {
    const settingsButtons = document.querySelectorAll('.btn-1');
    const outerButtons = document.querySelectorAll('.btn-2');
    const cardContent = document.querySelector('card-content');
    const cardButtons = document.querySelector('.card-buttons');
    // const resetButtons = document.querySelector('.reset-buttons');

    settingsButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log(`${button.textContent} clicked`);
            updateCardContent(button.textContent, cardContent);
        });
    });

    outerButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log(`${button.textContent} clicked`);
            // Add functionality for each outer button
            if (button.textContent != 'Game Settings')
                cardButtons.style.display = 'none';
            else
                cardButtons.style.display = 'block'

            updateCardContent(button.textContent, cardContent);
        });
    });
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
                    <div class=" privacy-settings mb-3">
                                <label for="OnlineVisibility"" class="privacy-form-label">Online Status Visibility</label>
                       
                           
                                <select id="online-visibility" class="form-select">
                                    <option value="invisible">Invisible</option>
                                    <option value="online">Online</option>
                                    <option value="away">Away</option>
                                    <option value="donotdisturb">Do Not Disturb</option>
                                </select>
                         

                           
                                <label for="ProfileVisibility" class="privacy-form-label">Profile Visibility</label>
                           
                            
                                <select id="profile-visibility" class="form-select">
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>
                         
                    </div>
                `;
                break;
            
            case 'Reset Options':
                newContent = `
                    <div class="reset-buttons">
                        <button type="button" class="rs-btn btn-lg">Reset to Default Settings</button>
                        <button type="button" class="rp-btn btn-lg">Reset Profile</button>
                    </div>
                `;
                break;
            }
            
            
            cardContent.shadowRoot.querySelector('.tab-content').innerHTML = newContent;
            if(buttonText=='Reset Options')
                attachResetButtonListeners(cardContent);
}

// Function to attach listeners to reset buttons inside shadow DOM
function attachResetButtonListeners(cardContent) {
    const resetButtons = cardContent.shadowRoot.querySelectorAll('.reset-buttons button');
    let newContent = '';

    resetButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log(`${button.textContent} clicked`);
            if (button.classList.contains('rs-btn')) {
                console.log('Reset to Default Settings clicked');
                newContent = `
                    <div class="card reset-card ">
                        <div class="reset-card-body">
                            <h5 class="reset-card-title">Reset to Default Settings</h5>
                            <p class="reset-card-text">Are you sure you want to reset all settings to their default values? Any <span style="color:red;">custom configurations will be lost</span>, but this will not affect your game progress.</p>
                        
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
                console.log('Reset Profile clicked');
                newContent = `
                    <div class="card reset-card ">
                        <div class="reset-card-body">
                            <h5 class="reset-card-title">Reset Profile</h5>
                            <p class="reset-card-text">Are you sure you want to reset your profile? This action will <span style="color:red;">permanently erase all of your progress</span>, including your stats, achievements, and current rank. This cannot be undone.</p>
                        
                            <div class="lg-btn reset-card-buttons">
                                <button id="cancel-btn" type="button">Cancel</button>
                                <button id="reset-btn" type="button">Confirm Reset</button>
                            </div> 
                        </div>
                    </div>
                `
            }

            cardContent.shadowRoot.querySelector('.tab-content').innerHTML = newContent;
            attachResetCardButtonsListeners(cardContent);
        });
    });

}

function attachResetCardButtonsListeners(cardContent) {
    const resetButtons = cardContent.shadowRoot.querySelectorAll('.reset-card-buttons button');
    let newContent = '';

    resetButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log(`${button.textContent} clicked`);
            if (button.textContent == 'Cancel') {
                // console.log('canceling');
                updateCardContent('Reset Options', cardContent);
            } 

        });
    });
}

// Call initializeSettings when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSettings);
// const { Router } = require("express");
// const { Router } = require("express");
function atleastupper(str) {
    // Test if there's at least one uppercase letter in the string
    return /[A-Z]/.test(str);
}

function register_page(){
    document.querySelector('body').innerHTML = `
                                                <div id="loader" class="loader">
                                                    <div class="spinner"></div>
                                                </div>
                                                <div id="popup" style="display:none"> </div>
                                                <div class="Background-container-two" >
                                                <img class="flow-two" src="images2/screenshot.webp" alt="" class="Background-picture-two">
                                                <div>
                                                    <h2 class="large-content1-two">Register</h2>
                                                    <div>
                                                        <img class="card-two" src="images2/card.webp" alt="" width="400" height="600">
                                                        <input  class="card-input1-two1" type="text" placeholder="USERNAME" id="id-four">
                                                        <input  class="card-input1-two" type="email" placeholder="EMAIL" id="id-one">
                                                        <input class="card-input2-two" type="password" placeholder="PASSWORD" id="id-two">
                                                        <input class="card-input3-two" type="password" placeholder="CONFIRM PASSWORD" id="id-three">
                                                        <button class="button-google-two" id="2id">
                                                            <H2>&nbsp;&nbsp;&nbsp;CONTINUE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa-solid fa-right-to-bracket"></i>&nbsp;&nbsp;&nbsp;</H2>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>`;
                                                // toggleCSS(['registration.css'], ['https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css']);
                                                updateStylesheet('registration.css');
                                                const but1 = document.getElementById('2id');
                                                but1.addEventListener("click", () => {
                                                    const username = document.getElementById('id-four');
                                                    const email = document.getElementById('id-one');
                                                    let password = document.getElementById('id-two');
                                                    const password2 = document.getElementById('id-three');
                                                    // if((password2.value !== password.value) || (username.value.length > 8)){
                                                    //     console.log("testting");
                                                    //     Router.go("/register");
                                           
                                                    // }
                                                    const notMatching = password2.value !== password.value;
                                                    const usernameValue = username.value.length;
                                                    const passwordValue = password.value.length;
                                                    if(atleastupper(password) == false)
                                                    {
                                                        showNotification('Error: no uppercase in password');
                                                        password.value = "";
                                                        password2.value = "";
                                                    }
                                                    
                                                    if (notMatching || usernameValue > 8 || passwordValue < 8) {
                                                        console.log("testing");
                                                        if (passwordValue < 8) {
                                                            showNotification('Error: password must be 8 characters or more');
                                                            password.value = "";
                                                            password2.value = "";
                                                        } 
                                                        if (usernameValue > 8) {
                                                            showNotification('Error: Username must be 8 characters or less');
                                                            username.value = "";
                                                        } 
                                                        if (notMatching) {
                                                            showNotification('Error: Passwords are not matched');
                                                            password.value = "";
                                                            password2.value = "";
                                                        }
                                                    }
                                                    else{
                                                        fetchUserdetails(username.value, email.value, password.value);
                                                    }
                                                });
}

function login_page(username, password){
    // localStorage.removeItem('stepsCompleted');
    // document.querySelector('body').innerHTML = `
    //                                                 <div id="loader" class="loader">
    //                                                     <div class="spinner"></div>
    //                                                 </div>
    //                                                 <div id="popup" style="display:none"> </div>
    //                                                 <div class="Background-container">
    //                                                 <img class="flow" src="images2/screenshot.webp" alt="" class="Background-picture">
    //                                                     <div>
    //                                                         <h2 class="large-content1">Login</h2>
    //                                                                 <div>
    //                                                                     <img class="card" src="images2/card.webp" alt="" width="400" height="600">
    //                                                                     <input class="card-input1" type="text" placeholder="USERNAME" id="input1-id">
    //                                                                     <input class="card-input2" type="password" placeholder="PASSWORD" id="input2-id">
    //                                                                     <button class="button-google" id="login-id">
    //                                                                     <H2>&nbsp;&nbsp;&nbsp;CONTINUE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa-solid fa-right-to-bracket"></i>&nbsp;&nbsp;&nbsp;</H2>
    //                                                                     </button>
    //                                                                   </div>
    //                                                              </div>
    //                                                </div>`;
    //                                              updateStylesheet('login.css');
                                                //  after_login();
    fetchUserdetails_2(username, password);         
}

function login_page2(){
    document.querySelector('body').innerHTML = `
                <div id="loader" class="loader">
                    <div class="spinner"></div>
                </div>
            <div id="popup" style="display:none"></div>
            <div class="Background-container">
            <img class="flow" src="images2/screenshot.webp" alt="" class="Background-picture">
                <div>
                    <h2 class="large-content1">Login</h2>
                            <div>
                                <img class="card" src="images2/card.webp" alt="" width="400" height="600">
                                <input class="card-input1" type="text" placeholder="USERNAME" id="input1-id">
                                <input class="card-input2" type="password" placeholder="PASSWORD" id="input2-id">
                                <button class="button-google" id="login-id">
                                <H2>&nbsp;&nbsp;&nbsp;CONTINUE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa-solid fa-right-to-bracket"></i>&nbsp;&nbsp;&nbsp;</H2>
                                </button>
                            </div>
                        </div>
        </div>`;
        updateStylesheet('login.css');
        const variable = document.getElementById('login-id');
            //  const variable = document.getElementById('button-google-id');
                variable.addEventListener('click', () => {
                const username = document.getElementById('input1-id');
                const password = document.getElementById('input2-id');
                    fetchUserdetails_3(username.value, password.value);   
    });
}
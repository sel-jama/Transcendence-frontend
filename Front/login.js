




function getBackendUrl() {
    const currentHost = window.location.hostname;  
    const referralURL = encodeURIComponent(`https://${currentHost}:8443`);
    let backendSigninURL = `/api/auth42/`;
    
    return backendSigninURL;
}

function clearTwoFaInputs1(){
    const inputs = document.querySelectorAll('.dv-container input');
    inputs.forEach((input) => {
        input.value = '';
    });
}

async function first_fetchTwoFaVerify(code){
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
            clearTwoFaInputs1();
        }else{
            showNotification('Failed To Verify');
            clearTwoFaInputs1();
            return false;
        }
        
    } catch (error) {
        showNotification(`Error: something went wrong, try again!`);
        return false;
    }
    return true;
}




async function fetchUserdetails(username, email, password) {
          try{
              const dataToSend = {};
              if(username)
                  dataToSend.username = username;
              if (email)
                  dataToSend.email = email;
              if (password)
                  dataToSend.password = password;
      
              const response = await fetch("/api/register/", {
                  method: "POST",
                  headers:{
                      "Content-Type": "application/json",
                      "Accept": "application/json"
                  },
                  credentials: "include",
                  body: JSON.stringify(dataToSend),
              });
      
              if (!response.ok) {
                showNotification(`Error: email or username not acceptable`);
                return;
              }
              login_page(username, password);
          }catch (error){
            showNotification(`Error: something went wrong, try again!`);
          }
      }

async function fetchUserdetails4(clan, nickname) {
    try{
        const dataToSend = {};
        if (nickname){
            dataToSend.nickname = nickname;
            }
            if(clan){
                dataToSend.clan = clan;
            }
            const response = await fetch("/api/updateinfo/", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(dataToSend),
            });
            
            if (!response.ok) {
                nickname = "";
                showNotification(`Error: nickname not loaded !`);
                return;
            }
            if(clan == "scavengers" ){
                  Router.go("/scavengers-card");
            }
            if(clan == "vertex" ){
                Router.go("/vertex-card"); 
            }
            if(clan == "raiders" ){
                Router.go("/raiders-card");    
            }
            
        }catch (error){
            showNotification(`Error: something went wrong, try again!`);
        }

    }



async function fetchUserdetails_2(username, password) {
        try{
            const dataToSend = {};
            if(username)
                dataToSend.username = username;
            if (password)
                dataToSend.password = password;
    
            const response = await fetch("/api/login/", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(dataToSend),
            });
    
            if (!response.ok) {
                return;
            }
            
            Router.go("/game-intro1");
        }catch (error){
        }
    }

async function fetchUserdetails_3(username, password) {
        try{
            const dataToSend = {};
            if(username)
                dataToSend.username = username;
            if (password)
                dataToSend.password = password;
    
            const response = await fetch("/api/login/", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(dataToSend),
            });
    
            if (!response.ok) {
                showNotification('Username or Password is incorrect');
                return;
            }
            // changeHeadData();
            const userData = await getUserData();
            if (JSON.stringify(userData) !== "{}") {
                if (userData.is_2fa_enabled){
                    localStorage.setItem('2faCompleted', false);
                    Router.go("/2fa", false);
                }
                else
                    Router.sendUserToDashboard();
            }
        }catch (error){
        }
    }

    
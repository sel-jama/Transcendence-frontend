function intro_page(){
    document.querySelector('body').innerHTML = `
                <div id="loader" class="loader">
                    <div class="spinner"></div>
                </div>
                <div id="popup" style="display:none"> </div>
                <div>                                                       
                <div>
                <img class="Background-picture" src="images2/ezgif.com-video-to-gif-converter.gif">
                </div>
                <button class="button4" id="button4-id">
                <h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CONTINUE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h2>
                </button>
                <img class="image2" src="images2/second.webp" alt="" height="1300" width="">
                </div>`;
    // setTimeout(hidesuccess, 1000);
    // toggleCSS(['styles2.css'], ['index1.css','https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css']);
    updateStylesheet('styles2.css');
    after_intro();

}

function intro2_page(){
    document.querySelector('body').innerHTML = ` 
    <div id="loader" class="loader">
        <div class="spinner"></div>
    </div>
    <div id="popup" style="display:none"> </div>
    <div>
    <div>
        <img class="Background-picture" src="images2/ezgif.com-video-to-gif-converter.gif">
    </div>
        <button class="button4" id="button4-id2">
            <h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CONTINUE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h2>
        </button>
        <img class="image2" src="images2/second.webp" alt="" height="1300" width="">
        <img class="image3" src="images2/intro-Photoroom.webp" alt="" height="1300" width="">
    </div>`;
    updateStylesheet('styles2.css');
    after_intro2();
}
function clan_info(){
    document.querySelector('body').innerHTML = `
                <div id="loader" class="loader">
                    <div class="spinner"></div>
                </div>
                <div id="popup" style="display:none"> </div>
                <div>
                <img class="Background-picture" src="images2/background.webp" alt="">
                <h1 class="paragra2">Choose your clan </h1>
                <div class="card1">
                    <img src="images2/red card.webp" alt="" height="500" width="310">
                    <img class="image-card" src="images2/05.webp" alt="" height="303">
                    <h4 class="titles">RAIDERS</h3>
                    <button  class="all-button" id="id-one">
                        <h1>&nbsp;&nbsp;SHOW INFO&nbsp;&nbsp;</h2>
                    </button>
                </div>
                <div class="card2">
                    <img src="images2/newblue card.webp" alt="" height="500" width="310">
                    <img class="image-card" src="images2/07.webp" alt="" height="303">
                    <h4 class="titles">SCAVENGERS</h3>
                    <button class="all-button" id="id-two">
                        <h1>&nbsp;&nbsp;SHOW INFO&nbsp;&nbsp;</h1>
                    </button>
                </div>
                <div class="card3">
                    <img src="images2/green card.webp" alt="" height="500" width="310">
                    <img class="image-card" src="images2/04.webp" alt="" height="303">
                    <h4 class="titles">VERTEX</h3>
                    <button class="all-button" id="id-three">
                        <h1>&nbsp;&nbsp;SHOW INFO&nbsp;&nbsp;</h1>
                    </button>
                </div>
            </div>`;
            // toggleCSS(['styles.css'], ['https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css']);
            updateStylesheet('styles.css');
            clan_information();
}

function scavengers(){
    document.querySelector('body').innerHTML = `<div id="loader" class="loader">
                                                    <div class="spinner"></div>
                                                </div>
                                                    <div id="popup" style="display:none"> </div>
                                                    <div>
                                                        <h2 class="titles1">SCAVENGERS</h2>
                                                        <img class="Background-picture" src="images2/background.webp" alt="">
                                                        <div>
                                                            <img  class="position" src="images2/blue card.webp" height="600">
                                                            <img class="position" src="images2/scavengers_logo.webp" height="750">
                                                            <img class="position" src="images2/Rectangle.webp" height="600">
                                                            <p class="text"> <span class="word-color">Adapt and Survive<br><br></span>
                                                                The SCAVENGERS are resourceful survivors who have learned to make the most out of the post-apocalyptic world. They are masters of adaptability, using anything and everything at their disposal to win. Their unconventional tactics often catch opponents off guard.<br>
                                                                <br>
                                                                - <span class="word-color">Strengths:</span>  Versatile playstyle, ability to steal or repurpose power-ups, and quick adaptability.<br>
                                                                - <span class="word-color">Playstyle</span>: Unpredictable and opportunistic, with a focus on outsmarting the opponent.</p>
                                                        </div>
                                                        <button class="all-button2" id="id-choose">
                                                            <h1>&nbsp;&nbsp;CHOOSE&nbsp;&nbsp;</h1>
                                                        </button>
                                                    </div>`;
                                    // toggleCSS(['styles5.css'], ['https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css']);
                                    updateStylesheet('styles5.css');
                                    scavengers_fun();
}

function scavengers_sh(){
        document.querySelector('body').innerHTML = `
            <div id="loader" class="loader">
                <div class="spinner"></div>
            </div>
            <div id="popup" style="display:none"> </div>
            <img class="img-fluid img-robot" src="images2/from i<3.gif" id="roboto">
            <p class="tittle">CLAIM YOUR IDENTITY</p>
            <p class="text">You're about to step into a world where your name <br> andimage will echo across the arena.Choose a <br>nickname that reflects your strength, and an avatar <br>that shows the world who you truly are.</p>
            <input type="text" class="rounded-input2" placeholder="NICKNAME" id="nickname"> 
            <button class="button" id="button-id">
                <h1 class="text4">&nbsp;&nbsp;CONTINUE&nbsp;&nbsp;</h1>
            </button>`;
        // toggleCSS(['identity.css', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', ]);
        updateStylesheet('identity.css');
        scavengers_identity_();
    }

function scavengers_card(){
    document.querySelector('body').innerHTML = `
                                                    <div id="loader" class="loader">
                                                        <div class="spinner"></div>
                                                    </div>
                                                    <div id="popup" style="display:none"> </div>
                                                    <div>
                                                        <img class="img-fluid img-robot2" src="images2/from i<3.gif" id="roboto2">

                                                            <img class="img2" src="images2/2.webp" alt="" >  
                                                            <button class="roboto-button22" id="botton22-id">&nbsp;&nbsp;CONFIRM&nbsp;&nbsp;</button>
                                                    </div>`;
    // toggleCSS(['prove3.css', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', ]);
    updateStylesheet('prove3.css');
    scavengers_card_()
}

function vertex_sh(){
    document.querySelector('body').innerHTML = `
            <div id="loader" class="loader">
                <div class="spinner"></div>
            </div>
        <div id="popup" style="display:none"> </div>
        <img class="img-fluid img-robot" src="images2/from i<3.gif" id="roboto">
        <p class="tittle">CLAIM YOUR IDENTITY</p>
        <p class="text">You're about to step into a world where your name <br> andimage will echo across the arena.Choose a <br>nickname that reflects your strength, and an avatar <br>that shows the world who you truly are.</p>
        <input type="text" class="rounded-input2" placeholder="NICKNAME" id="nickname"> 
        <button class="button" id="button-id">
            <h1 class="text4">&nbsp;&nbsp;CONTINUE&nbsp;&nbsp;</h1>
        </button>`;
    // toggleCSS(['identity.css', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', ]);
    updateStylesheet('identity.css');
    vertex_identity_();
}

function vertex_card(){
    document.querySelector('body').innerHTML = `<div id="loader" class="loader">
                                                    <div class="spinner"></div>
                                                </div>
                                                <div>
                                                <img class="img-fluid img-robot1" src="images2/from i<3.gif" id="roboto1">
                                                <img class="img1" src="images2/new vide.webp" alt="" >  
                                                <button class="roboto-button21" id="roboto-button21-id">&nbsp;&nbsp;CONFIRM&nbsp;&nbsp;</button>
                                                </div>`;
                            // toggleCSS(['prove2.css'], ['https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css']);
                            updateStylesheet('prove2.css');
        vertex_card_();
 }

function vertex(){
    document.querySelector('body').innerHTML = `
                                                            <div id="loader" class="loader">
                                                                <div class="spinner"></div>
                                                            </div>
                                                            <div>
                                                            <h2 class="titles1">VERTEX</h2>
                                                            <img class="Background-picture" src="images2/background.webp" alt="">
                                                            <div>
                                                                <img  class="position" src="images2/green card.webp" height="600">
                                                                <img class="position" src="images2/green.webp" height="750">
                                                                <img class="position" src="images2/Rectangle.webp" height="600">
                                                                <p class="text"> <span class="word-color">Precision and Control<br><br></span>
                                                                    The VERTEX clan is composed of remnants of the old world’s elite scientists and engineers. They have perfected the art of precision, using advanced technology to gain an edge in the game. VERTEX players are known for their sharp reflexes and strategic gameplay.<br>
                                                                    <br>
                                                                    - <span class="word-color">Strengths:</span> Enhanced accuracy, advanced paddle technology, and access to experimental power-ups.<br>
                                                                    - <span class="word-color">Playstyle</span>: Tactical and methodical, with a focus on controlling the ball’s trajectory.</p>
                                                            </div>
                                                            <button class="all-button2" id="all-button2-id">
                                                                <h1>&nbsp;&nbsp;CHOOSE&nbsp;&nbsp;</h1>
                                                            </button>
                                                        </div>`;
                                    // toggleCSS(['styles7.css'], ['https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css']);
                                    updateStylesheet('styles7.css');
                                    vertex_fun();

                                }

function raiders_sh(){
    document.querySelector('body').innerHTML = `
            <div id="loader" class="loader">
                <div class="spinner"></div>
            </div>
            <img class="img-fluid img-robot" src="images2/from i<3.gif" id="roboto"> 
            <p class="tittle">CLAIM YOUR IDENTITY</p>
            <p class="text">You're about to step into a world where your name <br> andimage will echo across the arena.Choose a <br>nickname that reflects your strength, and an avatar <br>that shows the world who you truly are.</p>
            <input type="text" class="rounded-input2" placeholder="NICKNAME" id="nickname">
            <button class="button" id="button-id">
                <h1 class="text4">&nbsp;&nbsp;CONTINUE&nbsp;&nbsp;</h1>
            </button>`;
    // toggleCSS(['identity.css', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', ]);
    updateStylesheet('identity.css');
    raiders_identity_();
}

function raiders_card(){
            document.querySelector('body').innerHTML = `
                <div id="loader" class="loader">
                    <div class="spinner"></div>
                </div>
                <div>
                <img class="img-fluid img-robot" src="images2/from i<3.gif" id="roboto">
                <img class="img" src="images2/vide raport.webp" alt="" >
                <button class="roboto-button2" id="botton2-id">&nbsp;&nbsp;CONFIRM&nbsp;&nbsp;</button>
            </div>`;
            updateStylesheet('prove.css');
            raiders_card_();
}

function raiders(){
            document.querySelector('body').innerHTML = `
            <div id="loader" class="loader">
                <div class="spinner"></div>
            </div>
            <div>
            <h2 class="titles1">RAIDERS</h2>
            <img class="Background-picture" src="images2/background.webp" alt="">
            <div>
                <img  class="position" src="images2/red card.webp" height="600">
                <img class="position" src="images2/raiders_logo.webp" height="750">
                <img class="position" src="images2/Rectangle.webp" height="600">
                <p class="text"> <span class="word-color">Strength in Chaos<br><br></span>
                    Born from the ashes of destruction, the RAIDERS are a fierce and aggressive clan. They thrive on chaos and unpredictability, using brute force and relentless pressure to overwhelm their opponents. RAIDERS value strength and intimidation.<br>
                    <br>
                    - <span class="word-color">Strengths:</span> Powerful strikes, increased ball speed, and disruptive abilities.<br>
                    - <span class="word-color">Playstyle</span>: Aggressive and fast-paced, aiming to overpower opponents with sheer force.</p>
            </div>
            <button class="all-button2" id="all-button1-id">
                <h1>&nbsp;&nbsp;CHOOSE&nbsp;&nbsp;</h1>
            </button>
        </div>`;
        // toggleCSS(['styles6.css'], ['https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css']);
        updateStylesheet('styles6.css');
        raiders_fun();
}
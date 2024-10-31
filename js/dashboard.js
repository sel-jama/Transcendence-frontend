// import { templates } from "./main";


function initializeDashboard(){
    document.title = "Dashboard";
    const slides = document.querySelectorAll('.card');

    slides.forEach(slide => {
        slide.addEventListener('click', ()=> {
            const slideTitle = slide.querySelector(".title-container h4").textContent;
            if (slideTitle == 'settings'){
                console.log(`${slideTitle} clicked slide`);
                // initializeNavigation();
                updateStylesheet('css/settings.css')
                const page = document.querySelector("body");
                page.innerHTML = templates.settings;
                initializeSettings();
            }
        });
        
    });
}
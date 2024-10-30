
function initializeDashboard(){
    document.title = "Dashboard";
    const slides = document.querySelectorAll('.card');

    slides.forEach(slide => {
        slide.addEventListener('click', ()=> {
            console.log(`${slide.textContent} clicked slide`);
        });
        
    });
}
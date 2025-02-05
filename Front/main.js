// const bootstrapLink = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";

function loadCSSForPage() {
    // Check if the CSS is already loaded
    const existingLink = document.querySelector(`link[href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"]`);
    if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        // link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
        link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
        link.setAttribute('data-page-css', 'true'); // Mark for identification
        document.head.appendChild(link);
    }
}

function removePageSpecificCSS(){
    // Select all links with the data attribute for page-specific CSS
    const pageCSSLinks = document.querySelectorAll('link[data-page-css]');
    pageCSSLinks.forEach(link => link.remove());

    // Select all Bootstrap links
    const bootstrapLinks = document.querySelectorAll('link[href*="bootstrap"]');
    bootstrapLinks.forEach(link => link.remove());
}



// function loadCSSForPage() {
//     return new Promise((resolve) => {
//         const cssId = 'bootstrap-css';
//         if (!document.getElementById(cssId)) {
//             const link = document.createElement('link');
//             link.id = cssId;
//             link.rel = 'stylesheet';
//             // link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
//             link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
//             link.setAttribute('data-page-css', 'true');
            
//             link.onload = () => resolve();
//             link.onerror = () => {
//                 console.error('Failed to load Bootstrap CSS');
//                 resolve();
//             };
            
//             document.head.appendChild(link);
//         } else {
//             resolve();
//         }
//     });
// }

// function removePageSpecificCSS(){
//     requestAnimationFrame(() => {
//         const pageCSSLinks = document.querySelectorAll('link[data-page-css]');
//         pageCSSLinks.forEach(link => link.remove());
//     });
// }

function goBack(){
    if(window.history.length > 1){
        window.history.go(-1);
    }
    else{
        alert("No previous page in history.");
    }
}

function toggleCSS(addFiles = [], removeFiles = []) {
    removeFiles.forEach(href => {
        const link = document.querySelector(`link[href="${href}"]`);
        if (link) document.head.removeChild(link);
    });

    addFiles.forEach(href => {
        if (!document.querySelector(`link[href="${href}"]`)){
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
        }
    });
}

function updateStylesheet(href) {
    let linkTag = document.querySelector("link[data-section-style]");
    if (!linkTag){
        linkTag = document.createElement("link");
    linkTag.rel = "stylesheet";
    linkTag.dataset.dynamic = "true";
    document.head.appendChild(linkTag);
}
linkTag.href = href;
}

function hidesuccess(){
    const holder = document.getElementById('success-id');
    if(holder){
        holder.classList.add('hidden');
    }
};

if(window.location.pathname === "/T/Project/index.html" || window.location.pathname === "/Front/" || window.location.pathname === "/")
    {
        

    }

    
document.addEventListener("DOMContentLoaded", () => {
    
    Router.init();
    Router.go("/#");
});
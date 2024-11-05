function initializeNavigation() {
    const leftBtn = document.querySelector('.left-btn');
    const rightBtn = document.querySelector('.right-btn');

    leftBtn.addEventListener('click', () => {
        console.log('Left button clicked');
        window.location.href = document.referrer;
        // Add functionality for left button (go back)
    });

    rightBtn.addEventListener('click', () => {
        console.log('Right button clicked');
        // Add functionality for right button (open menu)
    });
}
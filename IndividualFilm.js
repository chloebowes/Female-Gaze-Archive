// Initial update on page load
updateStylesheet();
// Update on window resize
window.addEventListener('resize', updateStylesheet);


//CHANGE TO MOBILE VIEW
function updateStylesheet() {
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth; // get width of view window
    var threshold = 768; // mobile width

    if (viewportWidth < threshold) {
        document.getElementById('stylesheet').href = 'IndividualFilmMOBILE.css'; // less than 768px, mobile view
    } else {
        document.getElementById('stylesheet').href = 'IndividualFilm.css'; // else, desktop view
    }
}



var originalOrder = [];
var activeFilters = [];

const logo = document.getElementById('logo'); 
const footer = document.getElementById('footer'); 
const noHoverSrc = 'eyesClosed.png'; // Eyes closed image by default
const hoverSrc = 'eyesOpen.png'; // Eyes open image on hover

// Initial update on page load
updateStylesheet();
// Update on window resize
window.addEventListener('resize', updateStylesheet);



//LOGO HOVER
footer.addEventListener('mouseover', () => {
    logo.src = hoverSrc; // on hover it will change the image source 
});
footer.addEventListener('mouseout', () => {
    logo.src = noHoverSrc; // on no hover it will change the image source
});

//LOGO RELOAD
logo.addEventListener('click', () => {
    location.reload(); //when logo is clicked page reloads
});

//COLLAPSIBLE MENUS
document.addEventListener("DOMContentLoaded", function () {
    //waits for full HTML page to load before triggering function
 
    //select everything with collapsible class
     var collapsibles = document.querySelectorAll(".collapsible");
 
     //adds a click function to the collapsibles
     collapsibles.forEach(function (collapsible) {
         collapsible.addEventListener("click", function () {
             this.classList.toggle("active"); // if clicked, gives collapsible active class
            
             var content = this.nextElementSibling; // selects content to be expanded
 
             //if active, changes the max height and bottom margin
             if (this.classList.contains("active")) {
                 content.style.maxHeight = "250px";
                 content.style.marginBottom = "15px";
             } else {
                 content.style.maxHeight = 0;
                 content.style.marginBottom = "0";
             }
         });
     });
 });



// MOBILE VIEW MENU BAR COLLAPSE
document.addEventListener("DOMContentLoaded", function () {
    // Select elements
    var sidebarButton = document.getElementById("sidebarButton");
    var sidebar = document.querySelector(".sidebar");
    var filters = document.querySelectorAll(".filters");
    var footer = document.querySelector(".footer");  // Corrected the selector
    var sortingButtons = document.querySelectorAll(".buttonSort");

    // click function for menu bar button
    sidebarButton.addEventListener("click", function () {
        // Changes to css
        sidebar.style.height = sidebar.style.height === "3%" ? "100%" : "3%";
        sidebar.style.overflowY = sidebar.style.overflowY === "hidden" ? "auto" : "hidden";
        sidebarButton.style.top = sidebarButton.style.top === "10%" ? "0.4%" : "10%";
        filters.forEach(function (filter) {
            filter.style.paddingTop = filter.style.paddingTop === "4%" ? "0%" : "4%";
        });

        // Change display property of .footer to flex
        footer.style.display = footer.style.display === "none" ? "flex" : "none";
    });
});




//FILTERING SYSTEM
function filterGenre(e) {
    const filterButtons = document.querySelectorAll(".filterOption"); // gets filter buttons
    const filmItems = document.querySelectorAll(".list .filterDiv"); // gets films

    let filter = e.target.dataset.filter; // e.target=clicked element
    let filterType = e.target.parentElement.parentElement.querySelector("span").innerText.toLowerCase(); //gets data-filter value

    //makes the clicked filter active
    e.target.classList.toggle('active'); 
    if (e.target.classList.contains('active')) {
        activeFilters.push({ type: filterType, filter: filter });
    } else {
        activeFilters = activeFilters.filter(f => f.filter !== filter || f.type !== filterType);
    }

    //extracts filters from each film, checks if they match the active filters
    filmItems.forEach(item => {
        const itemFilters = item.classList.value.split(' ').filter(f => f !== 'filterDiv' && f !== 'hidden');
        const matchesFilters = activeFilters.every(({ filter }) => itemFilters.includes(filter));


    //shows or hides the films by applying hidden css filter
        if (activeFilters.length === 0 || matchesFilters) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

//CHLOE'S PICKS
document.getElementById("chloe").addEventListener("click", function () {
    filterChloe(); // on click, trigger the filterChloe funcition
});
function filterChloe() {
    const chloeFilter = 'chloe'; // filter-value is chloe
    const filmItems = document.querySelectorAll(".list .filterDiv"); // selects all films

    //for each film, check if 'chloe' is present in the class
    filmItems.forEach(item => {
        const isChloeFilm = item.classList.contains(chloeFilter);

        //check if there are any current active filters 
        const matchesFilters = activeFilters.every(({ filter }) => item.classList.contains(filter));

        //show or hide films if they match
        if (activeFilters.length === 0 && !isChloeFilm) {
            item.classList.add('hidden');
        } else if ((activeFilters.length === 0 || matchesFilters) && isChloeFilm) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });

    //update the order of films shown
    updateSortOrder();
}

//SORTING SYSTEM
document.addEventListener("DOMContentLoaded", function () {
    //waits for HTML doc to load before executing function
    
    // creates array from films, in the default order listed in the HTML
    const defaultOrder = Array.from(document.querySelectorAll(".filterDiv")); 

    //triggers sorting based on which buttons
    document.getElementById("NewToOld").addEventListener("click", function () {
        currentSort = "NewToOld";
        sortFilms("data-day", "asc");
    });
    document.getElementById("OldToNew").addEventListener("click", function () {
        currentSort = "OldToNew";
        sortFilms("data-day", "desc");
    });
    document.getElementById("AtoZ").addEventListener("click", function () {
        restoreDefaultOrder();
    });

    //FUNCTION TO SORT FILMS
    function sortFilms(attribute, order) {
        const filmContainer = document.querySelector(".list"); // selects film container
        const films = Array.from(filmContainer.children); // puts films into an array

        //get the dates of each film
        films.sort(function (a, b) {
            const dateA = new Date(a.getAttribute(attribute));
            const dateB = new Date(b.getAttribute(attribute));

            // check if the dates are valid dates
            const isDateAValid = !isNaN(dateA);
            const isDateBValid = !isNaN(dateB);

            // if both or either date is invalid, move to the end and sort valid dates only
            if (!isDateAValid && !isDateBValid) {
                return 0; 
            } else if (!isDateAValid) {
                return 1; 
            } else if (!isDateBValid) {
                return -1; 
            }

            // Sort in ascending order for new-old and reverse for old-new
            return (order === "desc") ? dateA - dateB : dateB - dateA;
        });


        filmContainer.innerHTML = ""; // clear film container
        films.forEach(function (film) {
            filmContainer.appendChild(film); // put films back in container, in sorted order
        });
    }

    //FUNCTION TO RESTORE FILMS TO MANUALLY PUT HTML ORDER
    function restoreDefaultOrder() {
        const filmContainer = document.querySelector(".list"); // select film container

        filmContainer.innerHTML = ""; //clear the container
        defaultOrder.forEach(function (film) {
            filmContainer.appendChild(film.cloneNode(true)); //copy the films in the default order array into the container
        });
    }
});




//CHANGE TO MOBILE VIEW
function updateStylesheet() {
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth; // get width of view window
    var threshold = 768; // mobile width

    if (viewportWidth < threshold) {
        document.getElementById('stylesheet').href = '../archiveMOBILE.css'; // less than 768px, mobile view
    } else {
        document.getElementById('stylesheet').href = '../archive.css'; // else, desktop view
    }
}






//SOURCE CODE (modified with chat GPT to troubleshoot): 
    //https://codepen.io/avryx/pen/qBEMNoN
    //https://www.w3schools.com/howto/howto_js_collapsible.asp
    //https://dev.to/dhintz89/simple-filters-in-css-or-js-185k

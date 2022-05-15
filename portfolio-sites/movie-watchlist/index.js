/* imports */
import { init_film, GetFilmTrending, GetFilmTopRated, GetFilmUpcoming, GetSearchFilms} from './films.js';
import { init_watchlist, AddToWatchlist, ContainsInWatchlist, RemoveWatchlist } from './watchlist.js';

/* Variables */
const filmsContainerEl = document.getElementById("films-container");
const trendingBtnEl = document.getElementById("trending-btn");
const topRatedBtnEl = document.getElementById("top-rated-btn");
const upcomingBtnEl = document.getElementById("upcoming-btn");
const searchFilmEl = document.getElementById("search-film");

let activeButton = trendingBtnEl;
let page = 1;
/* On Search, use this API key and endpoint: ?s=filmName&apikey=36319788 */


/* Add listeners */
document.getElementById("search-bar").addEventListener("submit", async (e) => {
    //console.log(await SearchForFilm(e.target.elements[0].value));
    e.preventDefault();
    if (e.target.elements[0].value == "")
    {
        alert("Please enter a film name");
        return;
    }
    ClearFilms();
    const films = await GetSearchFilms(e.target.elements[0].value, 1);
    films.map(film => {
        const div = RenderFilm(film);
        /* Add onclick to film page - TODO*/

        /* Get element add-watchlist and add event listener */
        AddWatchlistFunction(div, film.id);
    })
    activeButton.classList.remove("active-button");
    searchFilmEl.classList.add("active-button");
});

trendingBtnEl.addEventListener("click", GetTrending);

topRatedBtnEl.addEventListener("click", GetTopRated);

upcomingBtnEl.addEventListener("click", GetUpcoming);

/* Functions */
async function GetTrending() {
    ClearFilms();

    const films = await GetFilmTrending(page);
    films.map(film => {
        const div = RenderFilm(film);
        /* Add onclick to film page - TODO*/

        /* Get element add-watchlist and add event listener */
        AddWatchlistFunction(div, film.id);
    })

    activeButton.classList.remove("active-button");
    trendingBtnEl.classList.add("active-button");
    activeButton = trendingBtnEl;
}

async function GetTopRated(){
    ClearFilms();
    const films = await GetFilmTopRated(page)
    films.map(film => {
        const div = RenderFilm(film);
        /* Add onclick to film page - TODO*/

        /* Get element add-watchlist and add event listener */
        AddWatchlistFunction(div, film.id);
    })

    activeButton.classList.remove("active-button");
    topRatedBtnEl.classList.add("active-button");
    activeButton = topRatedBtnEl;
}

async function GetUpcoming(){
    //console.log(await GetFilmUpcoming());
    ClearFilms();
    const films = await GetFilmUpcoming(page)
    films.map(film => {
        const div = RenderFilm(film);
        /* Add onclick to film page - TODO*/

        /* Get element add-watchlist and add event listener */
        AddWatchlistFunction(div, film.id);
    })

    activeButton.classList.remove("active-button");
    upcomingBtnEl.classList.add("active-button");
    activeButton = upcomingBtnEl;
}

function AddWatchlistFunction(div, filmId) {
    const addWatchlistEl = div.querySelector(".add-watchlist");
    const remWatchlistEl = div.querySelector(".remove-watchlist");
    
    if (ContainsInWatchlist(filmId)) {
        addWatchlistEl.classList.add("hidden");
    }
    else {
        remWatchlistEl.classList.add("hidden");
    }
    
    // Add
    addWatchlistEl.addEventListener("click", () => {
        if (!ContainsInWatchlist(filmId))
        {
            AddToWatchlist(filmId);
            addWatchlistEl.classList.add("hidden");
            remWatchlistEl.classList.remove("hidden");
        }
        else {
            alert("Film already in watchlist");
        }
    })

    // Remove
    remWatchlistEl.addEventListener("click", () => {
        RemoveWatchlist(filmId);
        addWatchlistEl.classList.remove("hidden");
        remWatchlistEl.classList.add("hidden");
    })
}

function ClearFilms() {
    filmsContainerEl.innerHTML = "";
}

function RenderFilms(films) {
    films.map(film => {
        filmsContainerEl.append(film.getFilmHTML());
    });
}

function RenderFilm(film) {
    const div = film.getFilmHTML()
    filmsContainerEl.append(div);

    return div;
}


/* On start functions to run */
init_film().then(async () => {
    ClearFilms()
    const films = await GetFilmTrending(1)
    films.map(film => {
        const div = RenderFilm(film);
        /* Add onclick to film page - TODO */

        /* Get element add-watchlist and add event listener */
        AddWatchlistFunction(div, film.id);
    })
})

init_watchlist()
import { init_watchlist, GetWatchlist, ContainsInWatchlist, RemoveWatchlist } from "./watchlist.js";
import { GetFilmID } from "./films.js";
import { CopyToClipboard } from "./utils.js";

/* Variables */
const filmsContainerEl = document.getElementById("films-container");
const shareEl = document.getElementById("share");
const titleEl = document.getElementById("title");

/* Listeners */

shareEl.addEventListener("click", () => {
    const w = GetWatchlist();
    CopyToClipboard(window.location + "?watchlist=" + w.join(","));
    shareEl.querySelector(".link").textContent = "Copied!"
});

/* Listeners */

/* Functions */

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

function RenderFilm(film) {
    const div = film.getFilmHTML()
    filmsContainerEl.append(div);

    return div;
}

/* Functions */


init_watchlist()


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if (urlParams.get("watchlist") != null) {
    ClearFilms();
    titleEl.textContent = "A Watchlist";
    shareEl.classList.add("hidden");
    let filmIds = urlParams.get("watchlist");
    filmIds.split(",").forEach(async (id) => {
        let film = await GetFilmID(id);
        let div = RenderFilm(film);
        AddWatchlistFunction(div, id)
    })
}
else {
    let ids = GetWatchlist();
    ids.forEach(async (id) => {
        let film = await GetFilmID(id);
        let div = RenderFilm(film);
        AddWatchlistFunction(div, id)
    })
}
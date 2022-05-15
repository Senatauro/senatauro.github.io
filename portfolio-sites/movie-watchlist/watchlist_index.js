import { init_watchlist, GetWatchlist, ContainsInWatchlist, RemoveWatchlist } from "./watchlist.js";
import { GetFilmID } from "./films.js";

/* Variables */
const filmsContainerEl = document.getElementById("films-container");

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

function RenderFilm(film) {
    const div = film.getFilmHTML()
    filmsContainerEl.append(div);

    return div;
}

/* Functions */


init_watchlist()
let ids = GetWatchlist();

ids.forEach(async (id) => {
    let film = await GetFilmID(id);
    let div = RenderFilm(film);
    AddWatchlistFunction(div, id)
})

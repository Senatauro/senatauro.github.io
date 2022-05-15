/* imports */
import { _fetch } from './utils.js';

let filmGenre = [];



async function init_film()
{
    /* Get film genre */
    let data = await (await _fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=24ea824551523c0b5ae69b8da22d3e72&language=en-US')).json();
    //console.log(data);
    data.genres.map(genre => {
        filmGenre.push(genre);
    })
}

class Film {
    constructor(id, title, poster_path, vote_average, overview, release_date, genre_ids) {
        this.id = id;
        this.title = title;
        this.poster_path = poster_path;
        this.vote_average = vote_average;
        this.overview = overview;
        /* Set the overview to a max of 256 char, including the last word */
        if (overview.length > 256)
        {
            let lastSpace = overview.lastIndexOf(" ", 256);
            this.overview = overview.substring(0, lastSpace) + "...";
        }
        this.release_date = release_date;
        this.genres = filmGenre.filter(genre => genre_ids.includes(genre.id)).map(genre => genre.name).join(' | ');
    }

    getFilmBannerURL() {
        return `https://image.tmdb.org/t/p/original${this.poster_path}`;
    }

    getFilmHTML() {
        let div = document.createElement("div");
        div.classList.add("film");
        div.innerHTML = `
            <p id="film-id">${this.id}</p>
            <img src="${this.getFilmBannerURL()}" alt="Blade Runner movie poster">
            <div class="film-info">
                <div class="film-info-title">
                    <h2>${this.title}</h2>
                    <img src="img/icons/star.png">
                    <p>${this.vote_average}</p>
                </div>
                <div class="film-info-data">
                    <p class="t-small">${this.genres}</p>
                    <div class="add-watchlist">
                        <img src="img/icons/plus.png">
                        <p class="t-small">Watchlist</p>
                    </div>
                    <div class="remove-watchlist">
                        <img src="img/icons/subtract.png">
                        <p class="t-small">remove</p>
                    </div>
                </div>
                <div class="film-info-desc">
                    <p>${this.overview}</p>
                </div>
            </div>
        `
        return div;
    }
}


/* Functions */
async function GetFilmTrending(page) {
    let data = await (await _fetch(`https://api.themoviedb.org/3/movie/popular?api_key=24ea824551523c0b5ae69b8da22d3e72&language=en-US&page=${page}`)).json();
    return CreateFilms(data);
}

async function GetFilmTopRated(page) {
    let data = await (await _fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=24ea824551523c0b5ae69b8da22d3e72&language=en-US&page=${page}`)).json();
    return CreateFilms(data);
}

async function GetFilmUpcoming(page) {
    let data = await (await _fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=24ea824551523c0b5ae69b8da22d3e72&language=en-US&page=${page}`)).json();
    return CreateFilms(data);
}

async function GetSearchFilms(search, page) {
    let data = await (await _fetch(`https://api.themoviedb.org/3/search/movie?api_key=24ea824551523c0b5ae69b8da22d3e72&query=${search}&language=en-US&page=${page}&include_adult=false`)).json();
    return CreateFilms(data);
}

async function GetFilmID(filmId) {
    let data = await (await _fetch(`https://api.themoviedb.org/3/movie/${filmId}?api_key=24ea824551523c0b5ae69b8da22d3e72&language=en-US`)).json();
    return new Film(data.id, data.title, data.poster_path, data.vote_average, data.overview, data.release_date, data.genre_ids);
}

function CreateFilms(filmArray) {
    return filmArray.results.map(film => {
        return new Film(film.id, film.title, film.poster_path, film.vote_average, film.overview, film.release_date, film.genre_ids);
    });
}



export { init_film, GetFilmTrending, GetFilmTopRated, GetFilmUpcoming, GetSearchFilms, GetFilmID};
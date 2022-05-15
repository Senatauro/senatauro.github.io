/* Imports */
import {GetLocalStorageJSON, SetLocalStorageJSON} from "./utils.js";

let watchlist = [];

function init_watchlist() {
    /* Get watchlist */
    watchlist = GetLocalStorageJSON("watchlist");
    console.log(watchlist);
}

function AddToWatchlist(filmId) {
    if (watchlist == null)
        watchlist = [];
    if (!watchlist.includes(filmId)) {
            watchlist.push(filmId);
            SetLocalStorageJSON("watchlist", watchlist);
        }
}

function RemoveWatchlist(filmId) {
    watchlist = watchlist.filter(function (value) {
        return value !== filmId;
    });
    SetLocalStorageJSON("watchlist", watchlist);
}

function ContainsInWatchlist(filmId) {
    try {
        return watchlist.includes(filmId);
    }catch (e) {
        return "";
    }
}

function GetWatchlist() {
    return watchlist;
}

export {init_watchlist, AddToWatchlist, ContainsInWatchlist, RemoveWatchlist, GetWatchlist};
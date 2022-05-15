async function _fetch(url, method = {method: 'GET'}, body = null) {
    return await fetch(url, method, body)
}

function SetLocalStorageJSON(localStorageID, value) {
    localStorage.setItem(localStorageID, JSON.stringify(value));
}

function AddLocalStorageJSON(localStorageID, valueToAdd) {
    let arr = JSON.parse(localStorage.getItem(localStorageID));
    arr.push(valueToAdd);
    localStorage.setItem(localStorageID, JSON.stringify(arr));
    return arr;
}

function GetLocalStorageJSON(localStorageID) {
    return JSON.parse(localStorage.getItem(localStorageID));
}

function RemoveLocalStorageJSON(localStorageID, valueToRemove) {
    let arr = JSON.parse(localStorage.getItem(localStorageID));
    arr = arr.filter(function (value) {
        return value !== valueToRemove;
    });
    localStorage.setItem(localStorageID, JSON.stringify(arr));
    return arr;
}


export { _fetch, SetLocalStorageJSON, AddLocalStorageJSON, GetLocalStorageJSON, RemoveLocalStorageJSON };
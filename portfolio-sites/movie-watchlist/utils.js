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

function CopyToClipboard(text){
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    
    navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
        fallbackCopyTextToClipboard(text);
    });
}

function fallbackCopyTextToClipboard(text){
    var textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea)
}

export { _fetch, SetLocalStorageJSON, AddLocalStorageJSON, GetLocalStorageJSON, RemoveLocalStorageJSON, CopyToClipboard };
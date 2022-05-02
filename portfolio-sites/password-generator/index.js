/* Starting ID variables */
let filterEl = document.getElementById("filters");
let passEls = [document.getElementById("pass1"), document.getElementById("pass2"), document.getElementById("pass3"), document.getElementById("pass4")]

//let filterLenghtEl = document.getElementById("filters-input");

/* Variables to use on the password generation */
let lenght = 8;
let charactersAccepted = "123456890qwertuiopasdfgjklzxcvbnm,.QWERTYUIOPASDFGHJKLZXCVBNM";



/* Password related functions */

function GeneratePassword(){
    for(let i = 0; i < 4; i++){
        let newPass = "";
        for(let j = 0; j < lenght; j++){
            let randomPosition = Math.floor(Math.random() * charactersAccepted.length);
            newPass += charactersAccepted.charAt(randomPosition)
        }
        passEls[i].value = newPass;
    }
    
}

function CopyPassword(passEl){
    if(passEl.value !== "..." && passEl.value !== "Password Copied")
    {
        CopyToClipboard(passEl.value)
        
        passEl.value = "Password Copied";
    }
}

/* Filter funtions */

function ShowFilters(){
    if(filterEl.style.display === "none" || filterEl.style.display === "")
        filterEl.style.display = "flex";
    else
        filterEl.style.display = "none";
}

function ChangeLenght(filter){
    lenght = filter.value;
    if(lenght > 20)
        lenght = 20;
    else if(lenght < 0)
        lenght = 0;
    
    filter.value = lenght;
}

/* Utility Functions */

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
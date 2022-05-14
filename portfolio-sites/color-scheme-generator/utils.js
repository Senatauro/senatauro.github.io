function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

function RGBToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
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


export { RGBToHex, CopyToClipboard};
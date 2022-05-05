

function Pagar() {
    fetch('/api/pagar', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            numPapers: 50
        })
    }).then(res => {
        if(res.ok) {
            return res.json();
        }
        throw new Error('Network response was not ok.');
    }).then(({ url }) => {
        window.location = url;
    }).catch(error => console.log(error.message));

}
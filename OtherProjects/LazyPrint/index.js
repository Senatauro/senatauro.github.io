var pdfjsLib = window['pdfjs-dist/build/pdf'];

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

/* Starting Variables */
const pageOne = document.getElementById("page-one");
const pageTwo = document.getElementById("page-two");

/* Page 1 */
const bwPagesEl = document.getElementById("bw-pages-el");
const bwPricePagesEl = document.getElementById("bw-price-pages-el");
const colPagesEl = document.getElementById("col-pages-el");
const colPricePagesEl = document.getElementById("col-price-pages-el");
const totalEl = document.getElementById("total-el");

/* Page 2 */
const reviewBWPagesEl = document.getElementById("review-bw-pages-el");
const reviewBWPricePagesEl = document.getElementById("review-bw-price-pages-el");
const reviewColPagesEl = document.getElementById("review-col-pages-el");
const reviewColPricePagesEl = document.getElementById("review-col-price-pages-el");
const reviewTotalEl = document.getElementById("review-total-el");

const emailInput = document.getElementById("email-input");
const pickUpSelect = document.getElementById("pickup-points");

let pricerPerBW = 0.25;
let pricePerCol = 0.5;

let PDFSelected;
let PDFObject;

let lazyPrintInfo = {
    email: "",
    pickup: "",
    base64: "",
    numPagesBlackWhite: 0,
    numPagesColored: 0,
};

/* FUNCTIONS */

async function FileSelected(input) {
    /* Using pdfjs load the PDF file from input */
    PDFSelected = input.files[0];

    /* Load The PDFSelected to the PDFObject using PDFjs */
    let base64 = await LoadPDF(PDFSelected);

    /* Load the information into the lazyPrintInfo */
    lazyPrintInfo.base64 = base64;
    let prom = [];
    /* foreach page, check if colored */
    for (let i = 0; i < 1; i++) {
        let page = await PDFObject.getPage(i + 1);
        prom.push(CheckIfColored(page));
    }

    /* Wait for all the promises to be resolved */
    let result = await Promise.all(prom);

    result.forEach(value => {
        if (value) {
            lazyPrintInfo.numPagesColored++;
            console.log("colored");
        }
        else {
            lazyPrintInfo.numPagesBlackWhite++;
            console.log("black and white");
        }
    });

    UpdatePrices();

    /* Update the prices */
}

function Proceed() {
    if (lazyPrintInfo.base64 == "") {
        alert("Please select a file!!!");
        return;
    }
    pageOne.style.display = "none";
    pageTwo.style.display = "block";
}

function Pay() {

    // Using PDFJS, load the file and get the number of pages
    let dataURI = "data:application/pdf;base64,"

    lazyPrintInfo.email = emailInput.value;
    lazyPrintInfo.pickup = pickUpSelect.value;

    if (lazyPrintInfo.email == "") {
        alert("Please enter an email address");
        return;
    }

    console.log(JSON.stringify(lazyPrintInfo));

    alert("Thank you for your purchase!");
    fetch("http://54.173.61.175:4242/create-checkout-session", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(lazyPrintInfo),
    }).then(res => {
        console.log(res);
        if(res.ok) {
            return res.json();
        }
        throw new Error('Network response was not ok.');
    }).then(({ url }) => {
        window.location = url;
    }).catch(error => console.log(error));
    //*/
}

function UpdatePrices() {
    /* Update the prices */
    bwPagesEl.textContent = lazyPrintInfo.numPagesBlackWhite + " black and white";
    bwPricePagesEl.textContent = "€" + (lazyPrintInfo.numPagesBlackWhite * pricerPerBW);
    reviewBWPagesEl.textContent = lazyPrintInfo.numPagesBlackWhite + " black and white";
    reviewBWPricePagesEl.textContent = "€" + (lazyPrintInfo.numPagesBlackWhite * pricerPerBW);

    colPagesEl.textContent = lazyPrintInfo.numPagesColored + " colored";
    colPricePagesEl.textContent = "€" + lazyPrintInfo.numPagesColored * pricePerCol;
    reviewColPagesEl.textContent = lazyPrintInfo.numPagesColored + " colored";
    reviewColPricePagesEl.textContent = "€" + (lazyPrintInfo.numPagesColored * pricePerCol);

    totalEl.textContent = "€" + (lazyPrintInfo.numPagesBlackWhite * pricerPerBW + lazyPrintInfo.numPagesColored * pricePerCol + 1.5);
    reviewTotalEl.textContent = "€" + (lazyPrintInfo.numPagesBlackWhite * pricerPerBW + lazyPrintInfo.numPagesColored * pricePerCol + 1.5);
}

async function CheckIfColored(pdfPage) {
    // Using PDFjs, check if a page is not black and white
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const viewport = pdfPage.getViewport({scale: 1.0});
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    console.log(viewport.width);
    console.log(viewport.height);
    const renderContext = {
        canvasContext: ctx,
        viewport: viewport
    };
    await pdfPage.render(renderContext);
    await Sleep(1000);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    let coloredPixel = 0;
    for (let i = 0; i < data.length; i += 8) {
        if (data[i] != data[i+1] || data[i+1] != data[i+2]) {
            coloredPixel++;
        }
    }
    console.log(data.length);
    if (coloredPixel > data.length/4/8) {
        return true;
    }
    return false;
}

/* FUNCTIONS */



/* UTIL FUNCTIONS */

function GetBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}

async function LoadPDF(file) {
    let base64 = await GetBase64(file);
    base64 = atob(base64.split(",")[1]);

    //Load the pdf from the base64
    let loadingTask = pdfjsLib.getDocument({ data: base64 });
    PDFObject = await loadingTask.promise;
    return base64;
}

async function Sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* SPECIAL */

const c = document.getElementsByClassName("jumping-text")
for (let i = 0; i < c.length; i++) {
    c[i].style.animationDelay = i / 10 + "s"
}

// Create background effect
let numSquares = 20;

const backgroundEffect = document.getElementById("squares")

// Create a bunch of LIs and asign them the css
for(let i = 0; i < numSquares; i++){
    let squaseLI = document.createElement("li");
    squaseLI.style.left = (i/numSquares * 100) + "%";
    
    let size =  Math.floor(Math.random() * 75) + 75
    squaseLI.style.width = size + "px";
    squaseLI.style.height = size + "px";
        
    squaseLI.style.listStyle = "none";
    squaseLI.style.background = "#FFFFFF";
    squaseLI.style.animation = "SquaresEffect 25s linear infinite";
    squaseLI.style.display = "block"
    squaseLI.style.position = "absolute";
    squaseLI.style.bottom = "-250px";
    
    let animDelay = Math.floor(Math.random() * 20)
    squaseLI.style.animationDelay = animDelay + "s";
    
    let animDuration = Math.floor(Math.random() * 30) + 5 
    squaseLI.style.animationDuration = animDuration + "s" 
        
    backgroundEffect.appendChild(squaseLI);
}
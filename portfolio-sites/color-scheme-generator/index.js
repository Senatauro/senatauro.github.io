/* Imports */
import { RGBToHex, CopyToClipboard } from "./utils.js";


/* Setting variables */
const colorEls = document.querySelectorAll('.color-element-item');
let selectedColor = '#ad4141';
let selectedMode = "monochrome";
let waitingResponse = false;

/* Setting listeners */
colorEls.forEach(colorEl => {
    colorEl.addEventListener('click', (e) => {
        OnClickColorSwatch(e.target);
    })
})

// On color change update our color variable
document.getElementById("main-color-selector").addEventListener("change", e => {
    selectedColor = e.target.value
})

// On mode change update our mode variable
document.getElementById("color-scheme").addEventListener("change", e => {
    selectedMode = e.target.value
})

// On the button click, get the color scheme info
document.getElementById("generate-btn").addEventListener("click", function () {
    if (!waitingResponse) {
        waitingResponse = true;
        fetch(`https://www.thecolorapi.com/scheme?hex=${selectedColor.split("#")[1]}&format=json&mode=${selectedMode}&count=6`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                for (let i = 0; i < data.colors.length; i++) {
                    RenderColor(data.colors[i], colorEls[i])
                }
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                waitingResponse = false;
            })
    }
})

/* Functions */

function OnClickColorSwatch(colorSwatch) {
    let r, g, b;
    r =  parseInt(colorSwatch.style.backgroundColor.split("(")[1].split(")")[0].split(",")[0]);
    g = parseInt(colorSwatch.style.backgroundColor.split("(")[1].split(")")[0].split(",")[1]);
    b = parseInt(colorSwatch.style.backgroundColor.split("(")[1].split(")")[0].split(",")[2]);
    CopyToClipboard(RGBToHex(r, g, b));
}

function RenderColor(colorInfo, element) {
    // Set the pallet color
    element.style.backgroundColor = `${colorInfo.hex.value}`;
    // Set the color name
    element.querySelector(".text-transparent").textContent = colorInfo.name.value;
    // Set the color hex value
    element.querySelector("h3").textContent = `${colorInfo.hex.value}`
}


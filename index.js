

/* Utils to animate text */

const coloredText = document.querySelectorAll(".jumpLetter")
console.log(coloredText[0].childElementCount);
// Get all the spans and animate them
for(let i = 0; i < coloredText.length; i++){
        coloredText[i].style.animation = "Jump 1s infinite alternate"
        coloredText[i].style.position= "relative";
        coloredText[i].style.margin= 0;
        coloredText[i].style.padding= 0;
        coloredText[i].style.animationDelay= i/10 + "s";
}
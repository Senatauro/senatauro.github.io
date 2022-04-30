/* Init consts */
const tasks = [
    {
        id: 0,
        name: "WebDev",
        price: 10
    },
    {
        id: 1,
        name: "Backend",
        price: 20
    },
    {
        id: 2,
        name: "Consultancy",
        price: 30
    }
]

const taskDivEl = document.getElementById("task-div");
const priceEl = document.getElementById("total-el");
const receiptEl = document.getElementById("receipt");

/* Init lets */
let tasksSel = []

//Add the task to the receipt
function AddTask(taskNumber){
    /* I should not use foreach for a search like this, but since it's only 3 elements I will go through the faster route */
    let hasTask = false;
    tasksSel.forEach(function(t){
        if(t.id === tasks[taskNumber].id){
            console.warn("Task Exist, do nothing and return");
            hasTask = true;
            return;   
        }
    })
    if(hasTask)
        return;
    tasksSel.push(tasks[taskNumber]);
    UpdateTasks();
}

// Remove the tasks from the receipt
function RemoveTask(taskId){
    /* Same thing as the AddTask function, should not use a for, but it's ok because it's only 3 elements */
    let text;
    for(let i = 0; i < tasksSel.length; i++){
        if(tasksSel[i].id == taskId)
            text = tasksSel.splice(i, 1);
    }
    UpdateTasks();
}

// Show the tasks from the receipt
function UpdateTasks(){
    taskDivEl.innerHTML = "";
    let totalPrice = 0;
    for(let i = 0; i < tasksSel.length; i++)
    {
        taskDivEl.innerHTML += 
        `
            <div class="task">
                <h3>${tasksSel[i].name}</h3>
                <button onclick="RemoveTask(${tasksSel[i].id})">Remove</button>
                <p>\$${tasksSel[i].price}</p>
            </div>
        `
        totalPrice += tasksSel[i].price;
    }
    priceEl.textContent = "$" + totalPrice;
}

function SendInvoice(){
    if(tasksSel.length === 0)
    {
        alert("There's no task selected, cant send an empty invoice!");
        return;
    }
    let b = document.getElementById("body");
    // Take a "screenshot" of the receipt
    html2canvas(b).then(function (canvas) {
        let link = document.createElement('a');
        link.setAttribute('download', 'Receipt.png');
        link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
        link.click();
    })
}

/* Utils functions */

const coloredText = document.querySelectorAll(".coloredText")
const backgroundEffect = document.getElementById("squares")

// Get all the spans and animate them
for(let i = 0; i < coloredText.length; i++){
    for(let j = 0; j < coloredText[i].childElementCount; j++){
        coloredText[i].children[j].style.animation = "Bounce 1s infinite alternate"
        coloredText[i].children[j].style.position= "relative";
        coloredText[i].children[j].style.margin= 0;
        coloredText[i].children[j].style.padding= 0;
        coloredText[i].children[j].style.animationDelay= j/10 + "s";
    }
}

// Create background effect
let numSquares = 10;

// Create a bunch of LIs and asign them the css
for(let i = 0; i < numSquares; i++){
    let squaseLI = document.createElement("li");
    squaseLI.style.left = (i/numSquares * 100) + "%";
    
    let size =  Math.floor(Math.random() * 75) + 75
    squaseLI.style.width = size + "px";
    squaseLI.style.height = size + "px";
        
    squaseLI.style.listStyle = "none";
    squaseLI.style.background = "#FFFFFF";
    squaseLI.style.animation = "Squares 25s linear infinite";
    squaseLI.style.display = "block"
    squaseLI.style.position = "absolute";
    squaseLI.style.bottom = "-150px";
    
    let animDelay = Math.floor(Math.random() * 20)
    squaseLI.style.animationDelay = animDelay + "s";
    
    let animDuration = Math.floor(Math.random() * 30) + 5 
    squaseLI.style.animationDuration = animDuration + "s" 
        
    backgroundEffect.appendChild(squaseLI);
}
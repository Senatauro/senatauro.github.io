let inp = document.getElementById("number-input");
let p_length = document.getElementById("length-info");
let p_volume = document.getElementById("volume-info");
let p_mass = document.getElementById("mass-info");

function ChangeCalculation(inputField){
    /* LENGHT */
    // If the value comes from the cookie
    if(inputField.value > 9999)
    {
        inputField.value = 9999;
    }
    inp.value = inputField.value;
        
    p_length.textContent = inputField.value + " meters = " + (inputField.value * 3.281).toPrecision(3) + " feets";
    p_length.textContent += " | ";
    p_length.textContent += inputField.value + " feets = " + (inputField.value / 3.281).toPrecision(3) + " meters";
    
    /* VOLUME */
    p_volume.textContent = inputField.value + " liters = " + (inputField.value * 0.2641720524).toPrecision(3) + " gallons";
    p_volume.textContent += " | ";
    p_volume.textContent += inputField.value + " gallons = " + (inputField.value / 0.2641720524).toPrecision(3) + " liters";
    
    /* MASS */
    p_mass.textContent = inputField.value + " kilos = " + (inputField.value * 2.205).toPrecision(3) + " gallons";
    p_mass.textContent = " | ";
    p_mass.textContent = inputField.value + " pounds = " + (inputField.value / 2.205).toPrecision(3) + " kilos"
    
    setCookie("lastValue", inputField.value);
}

function OnStart(){
    let lastValue = getCookie("lastValue");
    if(lastValue != "")
        ChangeCalculation({value: lastValue})
}

OnStart();

/* EXTRA - COOKIES :D */

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  let user = getCookie("username");
  if (user != "") {
    alert("Welcome again " + user);
  } else {
    user = prompt("Please enter your name:", "");
    if (user != "" && user != null) {
      setCookie("username", user, 365);
    }
  }
}
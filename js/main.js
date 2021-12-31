let lastRender = 0
let progress = 16.666666666666666666666666666667
let gameFPS = 60

let inputRange_speed = 0
let inputNumber_speed = 0


let elements = {
    inputRange_speed: document.getElementById("inputRange_speed"),
    inputNumber_speed: document.getElementById("inputNumber_speed"),
    atmosphereComposition: document.getElementById("atmosphereComposition"),
    pressureAndTemperature: document.getElementById("pressureAndTemperature"),
    speedFill: document.getElementById("speedFill"),
    speedText: document.getElementById("speedText"),
    antennasControl: document.getElementById("antennasControl"),
    energyConsumption: document.getElementById("energyConsumption"),
    energyGeneration: document.getElementById("energyGeneration"),
    generatorsControl: document.getElementById("generatorsControl"),
    capacitors: document.getElementById("capacitors"),
    batteries: document.getElementById("batteries"),
    batteryBorder: document.getElementById("batteryBorder"),
    batteryValue: document.getElementById("batteryValue"),
    batteryText: document.getElementById("batteryText"),
    gasTanksDiv: document.getElementById("gasTanksDiv"),
    fuelTanksDiv: document.getElementById("fuelTanksDiv"),
    btn_turnOffEngines: document.getElementById("btn_turnOffEngines"),
}


let speedInc = 1
function update(progress) {

    gameFPS = (1/progress*1000)/speedInc

    //update player ship
    playerShip.everyFrame(gameFPS)

    //speed range<->number
     if (elements.inputRange_speed.value!==inputRange_speed) {
         elements.inputNumber_speed.value = elements.inputRange_speed.value
     } else if (elements.inputNumber_speed.value!==inputNumber_speed) {
         elements.inputRange_speed.value = elements.inputNumber_speed.value
     }
     inputRange_speed = elements.inputRange_speed.value
     inputNumber_speed = elements.inputNumber_speed.value


}


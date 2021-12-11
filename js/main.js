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
}


function update(progress) {
    gameFPS = 1/progress*1000

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







//Charge Capacitors to 100%
function debug1() {
    playerShip.capacitors[0].charge = playerShip.capacitors[0].maxCharge
    playerShip.capacitors[1].charge = playerShip.capacitors[1].maxCharge
}

//switch generator [0]
function debug2() {
    if (playerShip.generators[0].on===1) {
        playerShip.generators[0].on=0
    } else {
        playerShip.generators[0].on=1
    }
}

//switch generator [1]
function debug3() {
    if (playerShip.generators[1].on===1) {
        playerShip.generators[1].on=0
    } else {
        playerShip.generators[1].on=1
    }
}

//change speed
function debug4() {
    let newSpeed = document.getElementById("set_speed_input").value
    if (playerShip.speed<newSpeed) {
        playerShip.acc = 1
    } else {
        playerShip.acc = 0
    }
    playerShip.resetWarpEngines()
    if (newSpeed<0) { newSpeed = 0}
    playerShip.targetSpeed = newSpeed
    playerShip.propulsion="on"

}

//change speedMode
function debug5() {
    let button = document.getElementById("btnSetting4")
    if (playerShip.speedMode==="FTL") {
        playerShip.speedMode="Sublight"
        button.innerText = "Sublight"
    } else {
        playerShip.speedMode="FTL"
        button.innerText = "FTL"
    }
}
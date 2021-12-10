let lastRender = 0
let progress = 16.666666666666666666666666666667
let gameFPS = 60

let inputRange_speed = 0
let inputNumber_speed = 0

function update(progress) {
    gameFPS = 1/progress*1000
    playerShip.everyFrame(gameFPS)




    //speed range<->number
     if (document.getElementById("inputRange_speed").value!==inputRange_speed) {
         document.getElementById("inputNumber_speed").value = document.getElementById("inputRange_speed").value
     } else if (document.getElementById("inputNumber_speed").value!==inputNumber_speed) {
         document.getElementById("inputRange_speed").value = document.getElementById("inputNumber_speed").value
     }
     inputRange_speed = document.getElementById("inputRange_speed").value
     inputNumber_speed = document.getElementById("inputNumber_speed").value
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
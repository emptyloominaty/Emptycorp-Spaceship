let lastRender = 0
let timeSec = 0
let progress = 16.666666666666666666666666666667
let gameFPS = 60


function update(progress) {
    gameFPS = 1/progress*1000
    timeSec += progress/1000

    playerShip.everyFrame(gameFPS)

    document.getElementById("debug6").innerText = playerShip.usePower(0.008) //0.1
}


//TEST

function debug1() {
    playerShip.capacitors[0].charge = playerShip.capacitors[0].maxCharge
    playerShip.capacitors[1].charge = playerShip.capacitors[1].maxCharge
}

function debug2() {
    if (playerShip.generators[0].on===1) {
        playerShip.generators[0].on=0
    } else {
        playerShip.generators[0].on=1
    }
}

function debug3() {
    if (playerShip.generators[1].on===1) {
        playerShip.generators[1].on=0
    } else {
        playerShip.generators[1].on=1
    }
}
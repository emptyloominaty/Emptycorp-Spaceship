

let inputFunctions = {
    toggleButtonText(id,val) {
        if (val===0) {
            //id.innerText = "Off"
            id.style.backgroundColor = "#d34644"
        } else {
            //id.innerText = "On"
            id.style.backgroundColor = "#4bd44f"

        }
    },
    toggleButtonComputerModuleText(id,val) {
        if (id===0) {
            this.toggleButtonText(document.getElementById("btn_memoryModule"),val)
        } else if(id===1) {
            this.toggleButtonText(document.getElementById("btn_communicationModule"),val)

        } else if(id===2) {
            this.toggleButtonText(document.getElementById("btn_fuelConsumptionModule"),val)

        } else if(id===3) {
            this.toggleButtonText(document.getElementById("btn_navigationModule"),val)
        }
    },

    toggleLightsInside() {
        playerShip.lights.insideOn = 1 - playerShip.lights.insideOn
        this.toggleButtonText( document.getElementById("btn_lightsInside"),playerShip.lights.insideOn)
    },
    toggleLightsOutside() {
        playerShip.lights.outsideOn = 1 - playerShip.lights.outsideOn
        this.toggleButtonText( document.getElementById("btn_lightsOutside"),playerShip.lights.outsideOn)
    },
    toggleComputer() {
        playerShip.computers[0].on = 1 - playerShip.computers[0].on
        this.toggleButtonText( document.getElementById("btn_computer"),playerShip.computers[0].on)
    },
    toggleComputerModule(id) {
        playerShip.computers[0].modules[id].on = 1 - playerShip.computers[0].modules[id].on
        this.toggleButtonComputerModuleText(id,playerShip.computers[0].modules[id].on)
    },
    toggleAntenna(id) {
        playerShip.antennas[id].on = 1 - playerShip.antennas[id].on
        this.toggleButtonText( document.getElementById("btn_antenna"+id),playerShip.antennas[id].on)
    },
    toggleSpeedMode() {
        if (playerShip.speedMode === "FTL" && playerShip.speed<0.0000001) {
            playerShip.speedMode = "Sublight"
        } else {
            playerShip.speedMode = "FTL"
        }
        document.getElementById("btn_speedMode").innerText = playerShip.speedMode
    },
    turnOffEngines() {
        playerShip.propulsion = "off"
        document.getElementById("btn_turnOffEngines").style.backgroundColor = "#d34644"
    },
    setSpeed() {
        playerShip.targetSpeed = document.getElementById("inputNumber_speed").value
        if (playerShip.speed<playerShip.targetSpeed) {
            playerShip.acc = 1
        } else {
            playerShip.acc = 0
        }
        playerShip.resetWarpEngines()
        if (playerShip.targetSpeed<0) { playerShip.targetSpeed = 0}
        playerShip.propulsion="on"
    },
    toggleAtmosphereControl() {
        playerShip.lifeSupport[0].on = 1 - playerShip.lifeSupport[0].on
        this.toggleButtonText( document.getElementById("btn_atmosphereControl"),playerShip.lifeSupport[0].on)
    },
    toggleTemperatureControl() {
        playerShip.lifeSupport[1].on = 1 - playerShip.lifeSupport[1].on
        this.toggleButtonText( document.getElementById("btn_temperatureControl"),playerShip.lifeSupport[1].on)
    },
    setPressure() {
        playerShip.pressureSet =  +document.getElementById("inputRange_pressure").value
    },
    setTemperature() {
        playerShip.temperatureSet =  +(document.getElementById("inputRange_temperature").value)+273.15
    },
    toggleGenerator(id) {
        playerShip.generators[id].on = 1 - playerShip.generators[id].on
        this.toggleButtonText( document.getElementById("btn_generator"+id),playerShip.generators[id].on)
    },
    toggleRCS() {
        playerShip.rcs = 1 - playerShip.rcs
         this.toggleButtonText( document.getElementById("btn_rcs"),playerShip.rcs)
    },
    toggleERCS() {
        playerShip.eRcs = 1 - playerShip.eRcs
        this.toggleButtonText( document.getElementById("btn_eRcs"),playerShip.eRcs)
    },
    setDirection() {
        playerShip.position.yaw.targetDirection =  +(document.getElementById("inputRange_direction").value)+360
    },
    setTime() {
        speedInc =  +(document.getElementById("inputRange_time").value)
    },
    toggleAutopilot() {
        playerShip.computers[0].autopilot = 1 - playerShip.computers[0].autopilot
        this.toggleButtonText( document.getElementById("btn_autopilot"),playerShip.computers[0].autopilot)
    }
}

let updateToggles = function() {
    inputFunctions.toggleButtonText( document.getElementById("btn_rcs"),playerShip.rcs)
    inputFunctions.toggleButtonText( document.getElementById("btn_eRcs"),playerShip.eRcs)
    inputFunctions.toggleButtonText( document.getElementById("btn_lightsInside"),playerShip.lights.insideOn)
    inputFunctions.toggleButtonText( document.getElementById("btn_lightsOutside"),playerShip.lights.outsideOn)
    inputFunctions.toggleButtonText( document.getElementById("btn_computer"),playerShip.computers[0].on)
    inputFunctions.toggleButtonText( document.getElementById("btn_atmosphereControl"),playerShip.lifeSupport[0].on)
    inputFunctions.toggleButtonText( document.getElementById("btn_temperatureControl"),playerShip.lifeSupport[1].on)
    inputFunctions.toggleButtonText( document.getElementById("btn_autopilot"),playerShip.computers[0].autopilot)
    if (playerShip.propulsion==="off") {
        document.getElementById("btn_turnOffEngines").style.backgroundColor = "#d34644"
    } else {
        document.getElementById("btn_turnOffEngines").style.backgroundColor = "#4bd44f"
    }

    for (let i = 0; i<playerShip.antennas.length; i++) {
        inputFunctions.toggleButtonText( document.getElementById("btn_antenna"+i),playerShip.antennas[i].on)
    }
    for (let i = 0; i<playerShip.generators.length; i++) {
        inputFunctions.toggleButtonText(document.getElementById("btn_generator" + i), playerShip.generators[i].on)
    }
}

updateToggles()

//-------------------------------Keyboard
let keyPressed = {}
let keyLoop = () => {
    let val = gameFPS/120
    let valSpeed = 1
    if (playerShip.speedMode==="FTL") {
        valSpeed = 50*gameFPS
    } else {
        valSpeed = 0.00000001*gameFPS
    }

    if (keyPressed["KeyA"]) {
        playerShip.position.yaw.targetDirection+=val
    } else if (keyPressed["KeyD"]) {
        playerShip.position.yaw.targetDirection-=val
    } else if (keyPressed["KeyW"]) {
        playerShip.position.pitch.targetDirection+=val
    } else if (keyPressed["KeyS"]) {
        playerShip.position.pitch.targetDirection-=val
    } else if (keyPressed["ShiftLeft"]) {
        playerShip.targetSpeed+=valSpeed
    } else if (keyPressed["ControlLeft"]) {
        playerShip.targetSpeed-=valSpeed
    }



    //Speed
    if (playerShip.targetSpeed<0) {
        playerShip.targetSpeed=0
    } else if (playerShip.targetSpeed>playerShip.maxSpeed) {
        playerShip.targetSpeed=playerShip.maxSpeed
    }
    //Direction
    if (playerShip.position.yaw.targetDirection<360) {
        playerShip.position.yaw.targetDirection=720
    } else if (playerShip.position.yaw.targetDirection>720) {
        playerShip.position.yaw.targetDirection=360
    }

    if (playerShip.position.pitch.targetDirection<90) {
        playerShip.position.pitch.targetDirection=90
    } else if (playerShip.position.pitch.targetDirection>270) {
        playerShip.position.pitch.targetDirection=270
    }
}

let keyup= (e)=> {
    keyPressed[e.code]=false
}
let keydown= (e)=> {
    keyPressed[e.code]=true
}
document.addEventListener('keydown', keydown)
document.addEventListener('keyup', keyup)






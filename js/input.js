

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
        toggleLights()
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
            document.getElementById("inputRange_speed").max = 0.0001
            document.getElementById("inputRange_speed").step = 0.0000001
        } else {
            playerShip.speedMode = "FTL"
            document.getElementById("inputRange_speed").max = playerShip.maxSpeed
            document.getElementById("inputRange_speed").step = 1
        }
        document.getElementById("btn_speedMode").innerText = playerShip.speedMode
    },
    turnOffEngines() {
        playerShip.propulsion = "off"
        document.getElementById("btn_turnOffEngines").style.backgroundColor = "#d34644"
    },
    setSpeed() {
        playerShip.targetSpeed = Number(document.getElementById("inputNumber_speed").value)
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
    },
    toggleShield() {
        playerShip.shields[0].on = 1 - playerShip.shields[0].on
        this.toggleButtonText( document.getElementById("btn_shield"),playerShip.shields[0].on)
    }
}

let toggleLights = function() {
    if (playerShip.lights.insideOn===1) {
        elements.root.style.setProperty("--background-color-light","#343434")
        elements.root.style.setProperty("--background-color-light2","#333")
    } else {
        elements.root.style.setProperty("--background-color-light","#171717")
        elements.root.style.setProperty("--background-color-light2","#151515")
    }
}

let updateToggles = function() {
    inputFunctions.toggleButtonText( document.getElementById("btn_rcs"),playerShip.rcs)
    inputFunctions.toggleButtonText( document.getElementById("btn_eRcs"),playerShip.eRcs)
    inputFunctions.toggleButtonText( document.getElementById("btn_lightsInside"),playerShip.lights.insideOn)
    inputFunctions.toggleButtonText( document.getElementById("btn_lightsOutside"),playerShip.lights.outsideOn)
    toggleLights()
    inputFunctions.toggleButtonText( document.getElementById("btn_computer"),playerShip.computers[0].on)
    inputFunctions.toggleButtonText( document.getElementById("btn_atmosphereControl"),playerShip.lifeSupport[0].on)
    inputFunctions.toggleButtonText( document.getElementById("btn_temperatureControl"),playerShip.lifeSupport[1].on)
    inputFunctions.toggleButtonText( document.getElementById("btn_autopilot"),playerShip.computers[0].autopilot)
    inputFunctions.toggleButtonText( document.getElementById("btn_shield"),playerShip.shields[0].on)
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

    if (speedInputSet==="Default") {
        if (playerShip.speedMode==="FTL") {
            valSpeed = 50*gameFPS
        } else {
            valSpeed = 0.000000001*gameFPS
        }
    } else if (speedInputSet==="VeryFast") {
        valSpeed = 250*gameFPS
    } else if (speedInputSet==="Fast") {
        valSpeed = 50*gameFPS
    } else if (speedInputSet==="Medium") {
        valSpeed = gameFPS
    } else if (speedInputSet==="Slow") {
        valSpeed = 0.000000001*gameFPS
    } else if (speedInputSet==="VerySlow") {
        valSpeed = 0.0000000001*gameFPS
    }

    //TODO:Shutdown engines

    //TODO:Autopilot


    //rotation
    if (keyPressed[keybinds["Yaw Left"]]) {
        playerShip.position.yaw.targetDirection+=val
    } else if (keyPressed[keybinds["Yaw Right"]]) {
        playerShip.position.yaw.targetDirection-=val
    }
    if (keyPressed[keybinds["Pitch Up"]]) {
        playerShip.position.pitch.targetDirection+=val
    } else if (keyPressed[keybinds["Pitch Down"]]) {
        playerShip.position.pitch.targetDirection-=val
    }

    //weapons
    if(keyPressed[keybinds["Weapon 1"]]) {
        if (playerShip.weapons[0]!==undefined) {
            playerShip.weapons[0].doDamage(0,0,0)
        }
    }
    if(keyPressed[keybinds["Weapon 2"]]) {
        if (playerShip.weapons[1]!==undefined) {
            playerShip.weapons[1].doDamage(0,0,0)
        }
    }
    if(keyPressed[keybinds["Weapon 3"]]) {
        if (playerShip.weapons[2]!==undefined) {
            playerShip.weapons[2].doDamage(0,0,0)
        }
    }
    if(keyPressed[keybinds["Weapon 4"]]) {
        if (playerShip.weapons[3]!==undefined) {
            playerShip.weapons[3].doDamage(0,0,0)
        }
    }

    //speed
    if (keyPressed[keybinds["Increase Speed"]]) {
        playerShip.targetSpeed+=valSpeed
        playerShip.propulsion="on"
        if (playerShip.speedMode==="Sublight") {
            if (playerShip.speed<playerShip.targetSpeed) {
                playerShip.acc = 1
            } else {
                playerShip.acc = 0
            }
        }
    } else if (keyPressed[keybinds["Decrease Speed"]]) {
        playerShip.targetSpeed-=valSpeed
        if (playerShip.speedMode==="Sublight") {
            playerShip.propulsion="on"
            if (playerShip.speed<playerShip.targetSpeed) {
                playerShip.acc = 1
            } else {
                playerShip.acc = 0
            }
        }
    }
    if (keyPressed[keybinds["Target Nearest Enemy"]]) {
        playerShip.computers[0].functions.findNearestEnemyTarget()
        keyPressed[keybinds["Target Nearest Enemy"]] = false
    }

    if (keyPressed["Escape"]) {
        settingsOpen = !settingsOpen
        keyPressed["Escape"] = false
    }


    //----------------------------------------------------------
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

let keyup = (e)=> {
    keyPressed[e.code]=false
}
let keydown = (e)=> {
    keyPressed[e.code]=true
    if (menuIn==="keybinds" && keybinds.keyListening!==0) {
        console.log(keybinds.keyListening+" set to "+e.code)
        keybinds[keybinds.keyListening]=e.code
        keybinds.keyListening = 0
        keyPressed[e.code]=false
        keybinds.keyDone = false
    }
}
document.addEventListener('keydown', keydown)
document.addEventListener('keyup', keyup)

//------------------------------------------------------------------------
let zoom = function(event) {
    event.preventDefault()
    let val = event.deltaY * -0.01
    if ( playerShip.computers[0].tab!=="nav") {
        val = 0
    }
    if (val>0) {
        playerShip.computers[0].incMapScaling()
    } else if((val<0)) {
        playerShip.computers[0].decMapScaling()
    }
}

playerShip.computers[0].display.canvasElement.onwheel = zoom

//------------------------------------------------------------------------
let changeSpeedSensitivity = function(event) {
    event.preventDefault()
    let val = event.deltaY * -0.01
    if (val>0) {
        speedIdArray++
        if (speedIdArray>speedInputArray.length-1) {speedIdArray = speedInputArray.length-1}
    } else if((val<0)) {
        speedIdArray--
        if (speedIdArray<0) {speedIdArray=0}
    }

    speedInputSet = speedInputArray[speedIdArray]
    elements.speedSensitivityValue.innerText = speedInputSet+""
}

elements.speedSensitivity.onwheel = changeSpeedSensitivity


let mouseSteering = false
elements.spaceShipWindow = document.getElementById("spaceShipWindow")

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
            /*document.getElementById("inputRange_speed").max = 0.0001
            document.getElementById("inputRange_speed").step = 0.0000001*/
        } else {
            playerShip.speedMode = "FTL"
           /* document.getElementById("inputRange_speed").max = playerShip.maxSpeed
            document.getElementById("inputRange_speed").step = 1*/
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
    setPitchDirection() {
        playerShip.position.pitch.targetDirection =  +(document.getElementById("inputRange_directionPitch").value)+180
    },
    setTimeFPS() {
        speedInc =  Number(document.getElementById("timeSpeedFPS").value)
        elements.timeSpeed.textContent = "Time Speed "+(speedInc*speedInc2)+"x"
    },
    setTimeMul() {
        speedInc2 =  Number(document.getElementById("timeSpeedMul").value)
        elements.timeSpeed.textContent = "Time Speed "+(speedInc*speedInc2)+"x"
    },
    toggleAutopilot() {
        playerShip.computers[0].toggleAutopilot()
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
        document.getElementById("tanksDiv").classList.remove("dark_tanks")
    } else {
        elements.root.style.setProperty("--background-color-light","#171717")
        elements.root.style.setProperty("--background-color-light2","#151515")
        document.getElementById("tanksDiv").classList.add("dark_tanks")
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
    let val = 0.5
    let valSpeed = 1

    let modPressed = function(name) {
        if (keybinds[name].mod === "") {
            return !(keyPressed["ShiftLeft"] || keyPressed["ControlLeft"])
        } else if (keyPressed[keybinds[name].mod]) {
            return true
        }
    }

    if (!settingsOpen) {
        if (speedInputSet === "Default") {
            if (playerShip.speedMode === "FTL") {
                valSpeed = 3000
            } else {
                valSpeed = 0.00000006
            }
        } else if (speedInputSet === "VeryFast") {
            valSpeed = 15000
        } else if (speedInputSet === "Fast") {
            valSpeed = 3000
        } else if (speedInputSet === "Medium-Fast") {
            valSpeed = 150
        } else if (speedInputSet === "Medium") {
            valSpeed = 3
        } else if (speedInputSet === "Medium-Slow") {
            valSpeed = 0.0001
        } else if (speedInputSet === "Slow") {
            valSpeed = 0.00000006
        } else if (speedInputSet === "VerySlow") {
            valSpeed = 0.000000006
        }

        //test
        /*if (keyPressed["KeyQ"]) {
            shipWindow3D.camera.rotation.z+=0.01
        } else if (keyPressed["KeyE"]) {
            shipWindow3D.camera.rotation.z-=0.01
        }*/
        /*if (keyPressed["KeyQ"]) {
            shipWindow3D.camera.fov+=0.8
        } else if (keyPressed["KeyE"]) {
            shipWindow3D.camera.fov-=0.8
        }
        if (shipWindow3D.camera.fov>165) {
            shipWindow3D.camera.fov=165
        } else if (shipWindow3D.camera.fov<30) {
            shipWindow3D.camera.fov = 30
        }*/

        //"Speed Sensitivity +"
        if (keyPressed[keybinds["Speed Sensitivity +"].key]) {
            if ((modPressed("Speed Sensitivity +"))) {
                //------------------------------
                speedIdArray++
                if (speedIdArray > speedInputArray.length - 1) {
                    speedIdArray = speedInputArray.length - 1
                }
                speedInputSet = speedInputArray[speedIdArray]
                elements.speedSensitivityValue.innerText = speedInputSet + ""
                //------------------------------
                keyPressed[keybinds["Speed Sensitivity +"].key] = false
            }
        }

        //"Speed Sensitivity -"
        if (keyPressed[keybinds["Speed Sensitivity -"].key]) {
            if ((modPressed("Speed Sensitivity -"))) {
                //------------------------------
                speedIdArray--
                if (speedIdArray < 0) {
                    speedIdArray = 0
                }
                speedInputSet = speedInputArray[speedIdArray]
                elements.speedSensitivityValue.innerText = speedInputSet + ""
                //------------------------------
                keyPressed[keybinds["Speed Sensitivity -"].key] = false
            }
        }

        if (keyPressed[keybinds["Mouse Steering"].key]) {
            if ((modPressed("Mouse Steering"))) {
                if (!mouseSteering) {
                    elements.spaceShipWindow.requestPointerLock()
                } else {
                    document.exitPointerLock()
                    document.removeEventListener("mousemove", updateRotation, false)
                    flashmessage.add("Mouse Steering Deactivated", "orange")
                    mouseSteering = false
                }
                keyPressed[keybinds["Mouse Steering"].key] = false
            }
        }

        //Toggle Showing Target
        if (keyPressed[keybinds["Show Target"].key]) {
            if ((modPressed("Show Target"))) {
                shipWindow3D.enableTargetTorus = Boolean(1 - shipWindow3D.enableTargetTorus)
                keyPressed[keybinds["Show Target"].key] = false
            }
        }

        //Reset Target
        if (keyPressed[keybinds["Reset Target"].key]) {
            if ((modPressed("Reset Target"))) {
                playerShip.computers[0].resetTarget()
                keyPressed[keybinds["Reset Target"].key] = false
            }
        }

        //Toggle Star Systems Name
        shipWindow3D.drawStarSystemsText = false
        if (keyPressed[keybinds["Show System Name"].key]) {
            if ((modPressed("Show System Name"))) {
                shipWindow3D.drawStarSystemsText = true
            }
        }

        //Shutdown engines
        if (keyPressed[keybinds["Shutdown Engine"].key]) {
            if ((modPressed("Shutdown Engine"))) {
                playerShip.propulsion = "off"
                playerShip.targetSpeed = 0
                keyPressed[keybinds["Shutdown Engine"].key] = false
            }
        }
        //Autopilot
        if (keyPressed[keybinds["Autopilot"].key]) {
            if ((modPressed("Autopilot"))) {
                playerShip.computers[0].toggleAutopilot()
                keyPressed[keybinds["Autopilot"].key] = false
            }
        }


        //Main generator
        if (keyPressed[keybinds["Main Generator"].key]) {
            if ((modPressed("Main Generator"))) {
                playerShip.generators[0].on = 1 - playerShip.generators[0].on
                keyPressed[keybinds["Main Generator"].key] = false
            }
        }

        //Hide HUD
        if (keyPressed[keybinds["Toggle Hud"].key]) {
            if ((modPressed("Toggle Hud"))) {
                hudEnabled = Boolean(1 - hudEnabled)
                keyPressed[keybinds["Toggle Hud"].key] = false
            }
        }

        //rotation
        if (keyPressed[keybinds["Yaw Left"].key]) {
            if ((modPressed("Yaw Left"))) {
                playerShip.position.yaw.targetDirection += val
            }
        }
        if (keyPressed[keybinds["Yaw Right"].key]) {
            if ((modPressed("Yaw Right"))) {
                playerShip.position.yaw.targetDirection -= val
            }
        }
        if (keyPressed[keybinds["Pitch Up"].key]) {
            if ((modPressed("Pitch Up"))) {
                playerShip.position.pitch.targetDirection += val
            }
        }
        if (keyPressed[keybinds["Pitch Down"].key]) {
            if ((modPressed("Pitch Down"))) {
                playerShip.position.pitch.targetDirection -= val
            }
        }

        //weapons
        if (keyPressed[keybinds["Weapon 1"].key]) {
            if ((modPressed("Weapon 1"))) {
                if (playerShip.weapons[0] !== undefined) {
                    playerShip.weapons[0].doDamage(0, 0, 0)
                }
            }
        }
        if (keyPressed[keybinds["Weapon 2"].key]) {
            if ((modPressed("Weapon 2"))) {
                if (playerShip.weapons[1] !== undefined) {
                    playerShip.weapons[1].doDamage(0, 0, 0)
                }
            }
        }
        if (keyPressed[keybinds["Weapon 3"].key]) {
            if ((modPressed("Weapon 3"))) {
                if (playerShip.weapons[2] !== undefined) {
                    playerShip.weapons[2].doDamage(0, 0, 0)
                }
            }
        }
        if (keyPressed[keybinds["Weapon 4"].key]) {
            if ((modPressed("Weapon 4"))) {
                if (playerShip.weapons[3] !== undefined) {
                    playerShip.weapons[3].doDamage(0, 0, 0)
                }
            }
        }

        //speed
        if (keyPressed[keybinds["Increase Speed"].key]) {
            if ((modPressed("Increase Speed"))) {
                playerShip.targetSpeed += valSpeed
                playerShip.propulsion = "on"
                if (playerShip.speedMode === "Sublight") {
                    if (playerShip.speed < playerShip.targetSpeed) {
                        playerShip.acc = 1
                    } else {
                        playerShip.acc = 0
                    }
                }
            }
        }
        if (keyPressed[keybinds["Decrease Speed"].key]) {
            if ((modPressed("Decrease Speed"))) {
                playerShip.targetSpeed -= valSpeed
                if (playerShip.speedMode === "Sublight") {
                    playerShip.propulsion = "on"
                    if (playerShip.speed < playerShip.targetSpeed) {
                        playerShip.acc = 1
                    } else {
                        playerShip.acc = 0
                    }
                }
            }
        }
        if (keyPressed[keybinds["Target Nearest Enemy"].key]) {
            if ((modPressed("Target Nearest Enemy"))) {
                playerShip.computers[0].functions.findNearestEnemyTarget()
                keyPressed[keybinds["Target Nearest Enemy"].key] = false
            }
        }
    } else {
        if (menuIn === "galaxyMap") {
            let s = settingsData.mapScaling
            if ((modPressed("Yaw Left"))) {
                if (keyPressed[keybinds["Yaw Left"].key]) {
                    settingsData.centerX += 10 / s
                    generateMenu(1)
                }
            }
            if ((modPressed("Yaw Right"))) {
                if (keyPressed[keybinds["Yaw Right"].key]) {
                    settingsData.centerX -= 10 / s
                    generateMenu(1)
                }
            }
            if ((modPressed("Pitch Up"))) {
                if (keyPressed[keybinds["Pitch Up"].key]) {
                    settingsData.centerY += 10 / s
                    generateMenu(1)
                }
            }
            if ((modPressed("Pitch Down"))) {
                if (keyPressed[keybinds["Pitch Down"].key]) {
                    settingsData.centerY -= 10 / s
                    generateMenu(1)
                }
            }
            if ((modPressed("Target Nearest Enemy"))) {
                if (keyPressed[keybinds["Target Nearest Enemy"].key]) {
                    settingsData.centerX = playerShip.position.x
                    settingsData.centerY = playerShip.position.y
                    generateMenu(1)
                    keyPressed[keybinds["Target Nearest Enemy"].key] = false
                }
            }
        }
    }

    if ((modPressed("Map"))) {
        if (keyPressed[keybinds["Map"].key]) {
            settingsOpen = !settingsOpen
            updateMenu(1)
            keyPressed[keybinds["Map"].key] = false
        }
    }


    if (keyPressed["Escape"]) {
        settingsOpen = !settingsOpen
        if (!settingsOpen) {
            document.getElementById("gamePaused").style.opacity = 0
            gamePaused = false
        } else {
            document.getElementById("gamePaused").style.opacity = 1
            gamePaused = true
        }
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
    if (playerShip.computers[0].listenForInput) {
        playerShip.computers[0].keyInput = e.key
    }
    if(e.code!=="F12" && e.code!=="F11" &&  e.code!=="F5" && e.code!=="Numpad0" && e.code!=="Numpad1" && e.code!=="Numpad2" && e.code!=="Numpad3" && e.code!=="Numpad4" && e.code!=="Numpad5" && e.code!=="Numpad6" && e.code!=="Numpad7" && e.code!=="Numpad8" && e.code!=="Numpad9" && e.code!=="Period" && e.code!=="NumpadDecimal" && e.code!=="Backspace") {
        e.preventDefault()
    }
    keyPressed[e.code]=false
}
let keydown = (e)=> {
    //console.log(e.code)
    if (e.code!=="F12" &&  e.code!=="F11" && e.code!=="F5" && e.code!=="Numpad0" && e.code!=="Numpad1" && e.code!=="Numpad2" && e.code!=="Numpad3" && e.code!=="Numpad4" && e.code!=="Numpad5" && e.code!=="Numpad6" && e.code!=="Numpad7" && e.code!=="Numpad8" && e.code!=="Numpad9" && e.code!=="Period" && e.code!=="NumpadDecimal" && e.code!=="Backspace") {
        e.preventDefault()
    }
    keyPressed[e.code]=true
    if (menuIn==="keybinds" && keybinds.keyListening!==0) {
        if (e.code!=="ShiftLeft" && e.code!=="ControlLeft") {
            keybinds[keybinds.keyListening].key = e.code
            if (keyPressed["ShiftLeft"]) {
                keybinds[keybinds.keyListening].mod = "ShiftLeft"
            } else if (keyPressed["ControlLeft"]) {
                keybinds[keybinds.keyListening].mod = "ControlLeft"
            } else {
                keybinds[keybinds.keyListening].mod = ""
            }
            keybinds.keyListening = 0
            keyPressed[e.code]=false
            keybinds.keyDone = false
        }
    }
}
document.addEventListener('keydown', keydown)
document.addEventListener('keyup', keyup)

//------------------------------------------------------------------------
let zoom = function(event) {
    event.preventDefault()
    let val = event.deltaY * -0.01
    if (playerShip.computers[0].tab==="nav") {
        if (val>0) {
            playerShip.computers[0].incMapScaling()
        } else if(val<0) {
            playerShip.computers[0].decMapScaling()
        }
    } else if (playerShip.computers[0].tab==="nav3") {
        if (val<0) {
            playerShip.computers[0].data.startId ++
        } else if (val>0) {
            if (playerShip.computers[0].data.startId>0) {
                playerShip.computers[0].data.startId --
            }
        }
    } else if (playerShip.computers[0].tab==="nav4") {
        if (val<0) {
            playerShip.computers[0].data.startIdPlanets ++
        } else if (val>0) {
            if (playerShip.computers[0].data.startIdPlanets>0) {
                playerShip.computers[0].data.startIdPlanets --
            }
        }
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

let resetInputs = function() {
    Object.keys(keyPressed).forEach(key => {
        keyPressed[key] = false
    })
}

window.addEventListener('blur', resetInputs)


//ctrl+w
/*
window.onbeforeunload = function (e) {
    // Cancel the event
    e.preventDefault()

    // Chrome requires returnValue to be set
    e.returnValue = 'Really want to quit the game?'
}*/


//----------------------------------------------------

/*elements.spaceShipWindow.onclick = function() {
    elements.spaceShipWindow.requestPointerLock()
}*/

function updateRotation(e) {
    playerShip.position.yaw.targetDirection -= e.movementX*settings.mouseSteeringSensitivity
    playerShip.position.pitch.targetDirection -= e.movementY*settings.mouseSteeringSensitivity

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

document.addEventListener('pointerlockchange', lockChangeAlert, false)

function lockChangeAlert() {
    if (document.pointerLockElement === elements.spaceShipWindow) {
        if (!mouseSteering) {
            document.addEventListener("mousemove", updateRotation, false)
            flashmessage.add("Mouse Steering Activated","success")
            mouseSteering = true
        }

    } else {
        if (mouseSteering) {
            document.removeEventListener("mousemove", updateRotation, false)
            flashmessage.add("Mouse Steering Deactivated", "orange")
            mouseSteering = false
        }
    }
}
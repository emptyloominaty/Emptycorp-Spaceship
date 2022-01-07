

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
        playerShip.position.targetDirection =  +(document.getElementById("inputRange_direction").value)
    }
}

inputFunctions.toggleButtonText( document.getElementById("btn_rcs"),playerShip.rcs)
inputFunctions.toggleButtonText( document.getElementById("btn_eRcs"),playerShip.eRcs)
inputFunctions.toggleButtonText( document.getElementById("btn_lightsInside"),playerShip.lights.insideOn)
inputFunctions.toggleButtonText( document.getElementById("btn_lightsOutside"),playerShip.lights.outsideOn)
inputFunctions.toggleButtonText( document.getElementById("btn_computer"),playerShip.computers[0].on)
inputFunctions.toggleButtonText( document.getElementById("btn_atmosphereControl"),playerShip.lifeSupport[0].on)
inputFunctions.toggleButtonText( document.getElementById("btn_temperatureControl"),playerShip.lifeSupport[1].on)
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
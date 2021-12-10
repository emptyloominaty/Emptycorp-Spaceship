
let inputFunctions = {
    toggleButtonText(id,val) {
        if (val===0) {
            id.innerText = "Off"
        } else {
            id.innerText = "On"
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
    },
    toggleComputerModule(id) {
        playerShip.computers[0].modules[id].on = 1 - playerShip.computers[0].modules[id].on
        this.toggleButtonComputerModuleText(id,playerShip.computers[0].modules[id].on)
    },
    toggleAntenna(id) {
        playerShip.antennas[id].on = 1 - playerShip.antennas[id].on
    },
    toggleSpeedMode() {
        if (playerShip.speedMode === "FTL") {
            playerShip.speedMode = "Sublight"
        } else {
            playerShip.speedMode = "FTL"
        }
        document.getElementById("btn_speedMode").innerText = playerShip.speedMode
    },
    turnOffEngines() {
        playerShip.propulsion = "off"
        document.getElementById("btn_turnOffEngines").innerText = playerShip.propulsion
    },
    setSpeed() {
        playerShip.targetSpeed = document.getElementById("inputNumber_speed").value
        playerShip.propulsion="on"
    },
    toggleAtmosphereControl() {
        playerShip.lifeSupport[0].on = 1 - playerShip.lifeSupport[0].on
    },
    toggleTemperatureControl() {
        playerShip.lifeSupport[1].on = 1 - playerShip.lifeSupport[1].on
    },
    setPressure() {
        //TODO:
    },
    setTemperature() {
        //TODO:
    },
    toggleGenerator(id) {
        playerShip.generators[id].on = 1 - playerShip.generators[id].on
    },



}

let inputFunctions = {
    toggleLightsInside() {
        playerShip.lights.insideOn = 1 - playerShip.lights.insideOn
    },
    toggleLightsOutside() {
        playerShip.lights.outsideOn = 1 - playerShip.lights.outsideOn
    },
    toggleComputer() {
        playerShip.computers[0].on = 1 - playerShip.computers[0].on
    },
    toggleComputerModule(id) {
        playerShip.computers[0].modules[id].on = 1 - playerShip.computers[0].modules[id].on
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
    },
    turnOffEngines() {
        playerShip.propulsion = "off"
    },
    setSpeed() {
        //TODO:
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
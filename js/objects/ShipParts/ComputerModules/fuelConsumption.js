class FuelConsumptionModule {
    consumption = 0.000075
    on = 1
    partsActivated = {preciseConsumption:1, calcRange:1}


    fuelA = 0
    fuelB = 0
    fuelDelta = 0
    fuelArray = []
    fuelArrayPrecise = []
    fuelConsumptionAvg = 0
    fuelConsumptionAvgPrecise = 0
    range = 0
    rangePrecise = 0

    run() {
        this.fuelA = playerShip.checkTank(playerShip.usingFuel)
        this.fuelDelta = this.fuelB - this.fuelA
        this.fuelB = playerShip.checkTank(playerShip.usingFuel)

        //fuel consumption (2sec avg)
        if (this.fuelArray.length>=120) {
            this.fuelArray.shift()
        }
        this.fuelArray.push(this.fuelDelta)
        let cons = 0
        for (let i = 0;i<this.fuelArray.length ;i++) {
            cons+=this.fuelArray[i]
        }
        this.fuelConsumptionAvg = (cons/120)*gameFPS*3600000//g/h
        document.getElementById("debug13").innerText = (this.fuelConsumptionAvg).toFixed(1)+" g/h"

        //fuel consumption (10sec avg)
        if (this.partsActivated.preciseConsumption===1) {
            if (this.fuelArrayPrecise.length>=600) {
                this.fuelArrayPrecise.shift()
            }
            this.fuelArrayPrecise.push(this.fuelDelta)

            let consPrecise = 0
            for (let i = 0;i<this.fuelArrayPrecise.length ;i++) {
                consPrecise+=this.fuelArrayPrecise[i]
            }
            this.fuelConsumptionAvgPrecise = (consPrecise/600)*gameFPS*3600000 //g/h
            document.getElementById("debug14").innerText = (this.fuelConsumptionAvgPrecise).toFixed(1)+" g/h"
        }


        if (this.partsActivated.calcRange===1) {

            let speed = playerShip.speed/8765.812756 //ly/h
            let fuelTimeLeft = ((this.fuelB*1000)/this.fuelConsumptionAvg)*3600 //seconds
            this.range = speed*(fuelTimeLeft/3600) //ly range
            document.getElementById("debug15").innerText = "range: "+(this.range).toFixed(1)+" ly "
            if (this.partsActivated.preciseConsumption===1) {
                let fuelTimeLeftPrecise = ((this.fuelB*1000)/this.fuelConsumptionAvgPrecise)*3600 //seconds
                this.rangePrecise = speed*(fuelTimeLeftPrecise/3600) //ly range
            }
        }


        //todo: return??? ram cpu usage?
    }
}
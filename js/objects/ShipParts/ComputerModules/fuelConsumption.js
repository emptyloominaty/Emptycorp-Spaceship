class FuelConsumptionModule {
    consumption = 0.000075
    on = 1

    fuelA = 0
    fuelB = 0
    fuelDelta = 0
    fuelArray = []
    fuelArrayPrecise = []
    fuelConsumptionAvg = 0
    fuelConsumptionAvgPrecise = 0

    run() {
        this.fuelA = playerShip.checkTank("fuel1")
        this.fuelDelta = this.fuelB - this.fuelA
        this.fuelB = playerShip.checkTank("fuel1")

        //fuel consumption (2sec avg)
        if (this.fuelArray.length>=120) {
            this.fuelArray.shift()
        }
        this.fuelArray.push(this.fuelDelta)
        let cons = 0
        for (let i = 0;i<this.fuelArray.length ;i++) {
            cons+=this.fuelArray[i]
        }
        this.fuelConsumptionAvg = cons/120
        document.getElementById("debug13").innerText = (this.fuelConsumptionAvg*3600000*gameFPS).toFixed(1)+" g/h"
        //fuel consumption (10sec avg)
        if (this.fuelArrayPrecise.length>=600) {
            this.fuelArrayPrecise.shift()
        }
        this.fuelArrayPrecise.push(this.fuelDelta)

        let consPrecise = 0
        for (let i = 0;i<this.fuelArrayPrecise.length ;i++) {
            consPrecise+=this.fuelArrayPrecise[i]
        }
        this.fuelConsumptionAvgPrecise = consPrecise/600
        document.getElementById("debug14").innerText = (this.fuelConsumptionAvgPrecise*3600000*gameFPS).toFixed(1)+" g/h"




    }
}
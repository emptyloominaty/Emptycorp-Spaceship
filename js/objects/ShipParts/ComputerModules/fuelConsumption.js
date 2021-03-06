class FuelConsumptionModule {
    consumption = 0.000045
    on = 1
    partsActivated = {preciseConsumption:1, calcRange:1}
    partsConsumption = {preciseConsumption:0.000005, calcRange:0.000035}

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
        this.fuelConsumptionAvg = (cons/this.fuelArray.length)*avgFPSSec*3600000//g/h

        //fuel consumption (10sec avg)
        if (this.partsActivated.preciseConsumption===1 && playerShip.usePower(this.partsConsumption.preciseConsumption/gameFPS,"computer")) {
            if (this.fuelArrayPrecise.length>=600) {
                this.fuelArrayPrecise.shift()
            }
            this.fuelArrayPrecise.push(this.fuelDelta)

            let consPrecise = 0
            for (let i = 0;i<this.fuelArrayPrecise.length ;i++) {
                consPrecise+=this.fuelArrayPrecise[i]
            }
            this.fuelConsumptionAvgPrecise = (consPrecise/this.fuelArrayPrecise.length)*avgFPSSec*3600000 //g/h
        }


        if (this.partsActivated.calcRange===1 && playerShip.speed !== 0 &&  this.fuelConsumptionAvg !== 0 && playerShip.usePower(this.partsConsumption.calcRange/gameFPS,"computer")) {
            let speed = playerShip.speed/8765.812756 //ly/h
            let fuelTimeLeft = ((this.fuelB*1000)/this.fuelConsumptionAvg)*3600 //seconds
            this.range = speed*(fuelTimeLeft/3600) //ly range
            if (this.partsActivated.preciseConsumption===1) {
                let fuelTimeLeftPrecise = ((this.fuelB*1000)/this.fuelConsumptionAvgPrecise)*3600 //seconds
                this.rangePrecise = speed*(fuelTimeLeftPrecise/3600) //ly range
            }
        } else {
            this.range = 0
            this.rangePrecise = 0
        }
    }


}


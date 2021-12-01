class Engine extends Part {
    on = 1

    run(percent,fps,targetSpeed,speed) {
        let p = percent/100
        if(p>1) {p = 1}

        if (targetSpeed>speed) {
            //TODO
            if (this.type === "Sublight") {
                if (this.usePower(speed)) {
                    if (this.useFuel(speed)) {
                        return this.thrust
                    }
                }
            } else if (this.type === "FTL") {
                if (this.usePower(speed)) {
                    if (this.useFuel(speed)) {
                        console.log(this.thrust)
                        return this.thrust
                    }
                }
            }
        } else if (targetSpeed<speed) {
            //TODO:BRAKING
        }


        return 0
    }

    usePower(speed) {
        let powerNeed = this.consumptionPower[0]+(this.consumptionPower[1]*(speed/this.maxSpeed))
        return playerShip.usePower(powerNeed/gameFPS)
    }

    useFuel(speed) {
        let fuelNeed = (0.0001+(this.consumptionFuel[2]*(speed/this.maxSpeed)))/3600    //TODO:FIX

        return playerShip.useTank(this.fuelType,fuelNeed/gameFPS)
    }

    constructor(weight,name,fuelType, type, minSpeed, maxSpeed, thrust, consumptionFuel, consumptionPower) {
        super(weight,name,"engine")
        this.fuelType = fuelType
        this.type = type
        this.minSpeed = minSpeed
        this.maxSpeed = maxSpeed
        this.thrust = thrust
        this.consumptionFuel = consumptionFuel
        this.consumptionPower = consumptionPower
    }
}
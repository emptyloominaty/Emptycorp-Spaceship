class Engine extends Part {

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
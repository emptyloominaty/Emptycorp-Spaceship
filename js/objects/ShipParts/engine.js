class Engine extends Part {

    run(percent,fps,speed) {
        let p = percent/100
        if(p>1) {p = 1}

        if (this.type==="Sublight") {

        } else if (this.type==="FTL") {

        }



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
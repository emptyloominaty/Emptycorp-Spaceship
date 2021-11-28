class Tank extends Part {

    constructor(weight,name, tankType, type, fuelWeight, volume, pressure) {
        super(weight,name,"tank" )
        this.tankType = tankType
        this.type = type
        this.fuelWeight = fuelWeight
        this.volume = volume
        this.pressure = pressure
        if (tankType === "gas") {
            this.capacity = volume*pressure
        } else if (tankType === "fuel") {
            this.capacity = fuelWeight
        }
        this.maxCapacity = this.capacity
    }
}
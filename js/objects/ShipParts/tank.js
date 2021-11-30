class Tank extends Part {
    gasDensity = 0
    constructor(weight,name, tankType, type, fuelWeight, volume, pressure) {
        super(weight,name,"tank" )
        this.tankType = tankType
        this.type = type
        this.fuelWeight = fuelWeight
        this.volume = volume
        this.pressure = pressure
        if (tankType === "gas") {
            this.capacity = volume*pressure
            if (type === "H2") {
                this.gasDensity = 0.00008988  // kg/l
            } else if (type === "O2") {
                this.gasDensity = 0.001429 // kg/l
            } else if (type === "N2") {
                this.gasDensity = 0.0012506 // kg/l
            }

        } else if (tankType === "fuel") {
            this.capacity = fuelWeight
        }
        this.maxCapacity = this.capacity
    }
}
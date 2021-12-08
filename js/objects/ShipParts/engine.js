class Engine extends Part {
    on = 1


    run(percent,fps,targetSpeed,speed) {
        let p = percent/100
        if(p>1) {p = 1}
        if (this.type==="FTL") {
            if (this.maxFTLThrust<1) {
                this.maxFTLThrust+=0.01
                if (this.maxFTLThrust>1) {
                    this.maxFTLThrust=1
                }
            }
        }


        if (targetSpeed>speed) {
            if (this.type === "Sublight") {
                let thrust = this.thrust*(this.maxSpeed/(speed+0.1))
                thrust = thrust*(0.0001+(targetSpeed-speed)*10000000)
                if (thrust>this.thrust) {thrust = this.thrust}
                if (speed>this.maxSpeed) {thrust = 0}
                let consumption = thrust/this.thrust
                if (this.usePower(speed,consumption)) {
                    if (this.useFuel(speed,consumption)) {
                        return thrust
                    }
                }
            } else if (this.type === "FTL") {
                let thrust = (this.thrust*(this.maxSpeed/(speed+0.1)))*this.maxFTLThrust
                let divThrustVal = 1+(1000000/(speed+5))
                thrust = thrust*(0.00000000000000000000000000000000001+(targetSpeed-speed)/divThrustVal)
                if (thrust>this.thrust*this.maxFTLThrust) {thrust = this.thrust*this.maxFTLThrust}
                if (speed>this.maxSpeed) {thrust = 0}
                if (this.usePower(speed,1)) {
                    if (this.useFuel(speed,1)) {
                        return thrust
                    }
                }
            }
            //-------------------"BRAKING"
        } else if (targetSpeed<speed) {
            if (this.type === "Sublight") {
                let thrust = this.thrust*(-1)
                thrust = thrust*(0.0001+(speed-targetSpeed)*10000000)
                if (thrust<(this.thrust*(-1))) {thrust = this.thrust*(-1)}
                let consumption = thrust/this.thrust
                if (this.usePower(speed,consumption)) {
                    if (this.useFuel(speed,consumption)) {
                        return thrust
                    }
                }
            } else if (this.type === "FTL") {
                if (targetSpeed<speed/1.01) {
                    playerShip.speed-=speed/30
                }
            }
        }

        return 0
    }

    usePower(speed,throttle) {
        let powerNeed = (this.consumptionPower[0]+(this.consumptionPower[1]*(speed/this.maxSpeed)))*throttle
        if (powerNeed<0) {powerNeed=0}
        return playerShip.usePower(powerNeed/gameFPS,this.group)
    }

    useFuel(speed,throttle) {
        let fuelNeed = ((0.0001+(this.consumptionFuel[2]*(speed/this.maxSpeed)))/3600)*throttle    //TODO:FIX
        if (fuelNeed<0) {fuelNeed=0}
        return playerShip.useTank(this.fuelType,fuelNeed/gameFPS)
    }

    constructor(id,weight,name,fuelType, type, minSpeed, maxSpeed, thrust, consumptionFuel, consumptionPower) {
        super(weight,name,"engine",id)
        this.fuelType = fuelType
        this.type = type
        this.minSpeed = minSpeed
        this.maxSpeed = maxSpeed
        this.thrust = thrust
        this.maxFTLThrust = 0
        this.consumptionFuel = consumptionFuel
        this.consumptionPower = consumptionPower
    }
}
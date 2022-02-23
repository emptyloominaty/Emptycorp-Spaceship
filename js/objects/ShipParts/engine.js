class Engine extends Part {
    on = 1


    run(percent,fps,targetSpeed,speed,angularSpeed = 0) {
        let p = percent/100
        if(p>1) {p = 1}
        if (this.type==="FTL") {
            if (this.maxFTLThrust<1) {
                this.maxFTLThrust+=0.1
                if (this.maxFTLThrust>1) {
                    this.maxFTLThrust=1
                }
            }
        }


        if (targetSpeed>speed && this.minSpeed<targetSpeed) {
            if (this.type === "Sublight") {
                //-----------------------------------------------------------SUBLIGHT
                let thrust = this.thrust*(this.maxSpeed/(speed+0.1))
                thrust = thrust*(0.0001+(targetSpeed-speed)*10000000)
                if (thrust>this.thrust) {thrust = this.thrust}
                if (speed>this.maxSpeed) {thrust = 0}
                let consumption = thrust/this.thrust
                playerShip.computers[0].data.engineThrottle = thrust/this.thrust
                if (this.usePower(speed,consumption)) {
                    if (this.useFuel(speed,consumption)) {
                        return thrust
                    } else {this.noPowerOrFuel()}
                } else {this.noPowerOrFuel()}
            } else if (this.type === "FTL") {
                //-----------------------------------------------------------FTL
                let thrust = this.thrust*this.maxFTLThrust
                let warpFriction = (Math.pow(speed*75, 1.5))
                let warpFrictionTarget = (Math.pow(targetSpeed*75, 1.5))
                //(((thrust*1000000)/this.weight)/299792458)/fps

                let thrustNeed = warpFrictionTarget
                if (speed<targetSpeed && speed!==0) {
                    thrustNeed = thrustNeed * (Math.pow((targetSpeed/speed), 3))
                }
                if (targetSpeed<10000) {
                    thrustNeed = (targetSpeed+(targetSpeed-speed)*10000000)
                }

                if (thrust>thrustNeed) {
                    thrust = thrustNeed
                }

                playerShip.computers[0].data.engineThrottle = thrust/this.thrust
                let throttle = (thrust/this.thrust)+0.15
                if (speed<1) {throttle=1-speed}
                if (throttle>1) {throttle=1}
                if (thrust>this.thrust*this.maxFTLThrust) {thrust = this.thrust*this.maxFTLThrust}
                if (speed>this.maxSpeed) {thrust = 0}
                if (this.usePower(speed,throttle)) {
                    if (this.useFuel(speed,throttle)) {
                        return thrust
                    } else {this.noPowerOrFuel()}
                } else {this.noPowerOrFuel()}
            } else if (this.type==="RCS") {
                //-----------------------------------------------------------RCS
                let thrust = this.thrust*((targetSpeed-speed)/30)*p
                if (thrust>this.thrust) {thrust = this.thrust}
                let throttle = thrust/this.thrust
                if (settings.realRcs===0) {
                    throttle=throttle/10
                }
                if (this.usePower(1,throttle)) {
                    if (this.useFuel(1,throttle)) {
                        return thrust
                    } else {this.noPowerOrFuel()}
                } else {this.noPowerOrFuel()}
            }
        } else if (targetSpeed<speed) {
            //---------------------------------------------------------------------------------------------------------------------------"BRAKING"
            //-----------------------------------------------------------SUBLIGHT
            if (this.type === "Sublight") {
                let thrust = this.thrust*(-1)
                thrust = thrust*(0.0001+(speed-targetSpeed)*10000000)
                if (thrust<(this.thrust*(-1))) {thrust = this.thrust*(-1)}
                let consumption = thrust/this.thrust
                if (this.usePower(speed,consumption)) {
                    if (this.useFuel(speed,consumption)) {
                        playerShip.computers[0].data.engineThrottle = thrust/this.thrust
                        return thrust
                    } else {this.noPowerOrFuel()}
                } else {this.noPowerOrFuel()}
            } else if (this.type === "FTL") {
                //-----------------------------------------------------------FTL
                if (targetSpeed<speed/1.01) {
                    if (speed<1000 && speed>26) {
                        playerShip.speed-=25
                    } else if (speed<=26) {
                        playerShip.speed-= speed/10
                    }
                    playerShip.speed-= speed/20
                }
            } else if (this.type==="RCS") {
                //-----------------------------------------------------------RCS
                let thrust = this.thrust*((speed-targetSpeed)/30)*p
                if (thrust>this.thrust) {thrust = this.thrust}
                let throttle = thrust/this.thrust
                if (settings.realRcs===0) {
                    throttle=throttle/10
                }
                if (this.usePower(1,throttle)) {
                    if (this.useFuel(1,throttle)) {
                        return thrust*(-1)
                    } else {this.noPowerOrFuel()}
                } else {this.noPowerOrFuel()}
            }
        }

        return 0
    }

    noPowerOrFuel() {
        playerShip.propulsion="off"
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
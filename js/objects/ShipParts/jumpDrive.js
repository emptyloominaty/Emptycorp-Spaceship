class JumpDrive extends Part {
    charged = 0
    chargeNeeded = 0
    fuelNeeded = 0

    running = 0
    on = 1
    jumpTo = {x:0,y:0,z:0}


    jump(x,y,z) {
        if (x==="") {x=0}
        if (y==="") {y=0}
        if (z==="") {z=0}
        let distance = calcDistance(playerShip,{position:{x:x,y:y,z:z}})
        if (distance<this.maxDistance) {
            this.chargeNeeded = this.getChargeNeeded(distance)
            this.fuelNeeded = this.getFuelNeeded(distance)
            this.jumpTo = {x:x, y:y, z:z}
            this.running = 1
            flashmessage.add("Charging Jump Drive","default")
            return true
        } else {
            flashmessage.add("Jump Failed (Distance)","fail")
            return false
        }
    }

    getChargeNeeded(distance) {
        return this.baseCharge+Math.pow(distance*this.chargePerLy,this.chargePow)
    }

    getFuelNeeded(distance) {
        return 1+Math.pow(distance*this.fuelPerLy,this.chargePow)
    }

    run() {
        if (this.running===1 && this.on===1) {
            this.charge()
        }
    }

    charge() {
        let c = this.chargeSpeed/gameFPS
        if (playerShip.usePower(c,this.group)) {
            this.charged += c
            if (this.charged>this.chargeNeeded) {
                if (playerShip.useTank(this.fuelType,this.fuelNeeded)) {
                    //do jump
                    playerShip.positionPrecise.x = new BigNumber(this.jumpTo.x)
                    playerShip.positionPrecise.y = new BigNumber(this.jumpTo.y)
                    playerShip.positionPrecise.z = new BigNumber(this.jumpTo.z)
                    flashmessage.add("Jumped successfully to x:"+this.jumpTo.x+" y:"+this.jumpTo.y+" z:"+this.jumpTo.z,"success")
                    playerShip.computers[0].nav.start.recalcPosition()
                    this.charged = 0
                    this.running = 0
                } else {
                    this.charged = 0
                    this.running = 0
                    flashmessage.add("Jump Failed (Fuel)","fail")
                }
            }
        } else {
            this.charged = 0
            this.running = 0
            flashmessage.add("Jump Failed (Power)","fail")
        }
    }

    changeChargingSpeed(charge) {
        this.chargeSpeed = charge
        if (this.chargeSpeed>this.maxChargeSpeed) {
            this.chargeSpeed = this.maxChargeSpeed
        } else if (this.chargeSpeed<1) {
            this.chargeSpeed = 1
        }
    }



    constructor(id,weight,name,d) {
        super(weight,name,"engine",id)
        this.fuelType = d.fuelType
        this.maxDistance = d.maxDistance
        this.chargePerLy = d.chargePerLy
        this.chargePow = d.chargePow
        this.baseCharge = d.baseCharge
        this.chargeSpeed = d.chargeSpeed
        this.maxChargeSpeed = d.chargeSpeed
        this.fuelPerLy = d.fuelPerLy
    }




}
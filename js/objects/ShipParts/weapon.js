class Weapon extends Part {
    doDamage(yaw,pitch,speed) {
        if (this.type==="laser") {
            if (playerShip.usePower((this.power*this.length),this.group)) {
                //Todo:Create moving object
            }
        }
    }
    constructor(id,weight,name,type,damageData) {
        super(weight,name,"weapon",id)
        this.type = type
        if (type==="laser") {
            this.power = damageData.power
            this.length = damageData.length
        }
    }
}
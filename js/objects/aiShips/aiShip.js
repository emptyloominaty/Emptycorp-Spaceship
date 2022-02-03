class AiShip {
    position = {x:0,y:0,z:0}
    positionPrecise = {x:new BigNumber(0),y:new BigNumber(0),z:new BigNumber(0)}
    positionHi = {x:0, y:0, z:0}
    positionLo = {x:0, y:0, z:0}
    hitbox = {x1:0,y1:0,z1:0,x2:0,y2:0,z2:0}
    type = "Fighter"

    yaw = 0
    targetYaw = 0
    pitch = 0
    targetPitch = 0

    speed = 0
    targetSpeed = 0

    faction = ""

    armor = 200
    armorMax = 200
    shield = 100
    shieldMax = 100
    shieldRecharge = 0.05

    rotationSpeed = 60 // °/60 per sec
    accelerationSpeed = 2000 // c/60 per sec
    weapon = {type:"laser",damageData:{power:40/* MW */, length:0.01 /*seconds*/,cd:0.32 /*seconds*/,life: 5, speed:2000, color: 0xff0000}}
    fuelTank = {type:"fuel1", capacity:500, maxCapacity:500}
    consumption = 5 // kg per ly
    consumptionC = 5/8765.812756 //kg per c

    credits = 0

    //ai
    target = {}

    destroyed = false

    run() {
        if (this.destroyed) {
            return false
        }
        this.hitbox = calcHitbox(this.position.x,this.position.y,this.position.z,0.0001)
        if (this.shield<this.shieldMax) {
            this.shield+=this.shieldRecharge/gameFPS
        }
        let consNow = (this.consumptionC*this.speed/3600)
        this.move()
        this.fuelTank.capacity -= consNow
        return true
    }

    getDamage(damage,shieldDmgBonus,ignoreShield = false) {
        shieldDmgBonus = 1+(shieldDmgBonus/100)
        //shield
        if (!ignoreShield) {
            if(this.shield>damage*shieldDmgBonus) {
                this.shield -= damage*shieldDmgBonus
                damage = 0
            } else if (this.shield>0) {
                damage -= this.shield/shieldDmgBonus
                this.shield = 0
            }
        }
        //armor
        if(this.armor>damage) {
            this.armor-=damage
            damage = 0
        } else {
            damage -= this.armor
            this.armor = 0
        }
        if(damage>0) {
            this.destroyed = true
        }
    }

    move() {
        let speedInlyh = this.speed/8765.812756
        let speed = speedInlyh/3600/gameFPS

        let angleInRadianYaw = (this.yaw*Math.PI) / 180
        let angleInRadianPitch = (this.pitch*Math.PI) / 180

        let theta = angleInRadianYaw
        let phi = Math.PI/2-angleInRadianPitch

        let vx = (Math.sin(phi)*Math.sin(theta) )* speed
        let vy = (Math.sin(phi)*Math.cos(theta) )* speed
        let vz = (Math.cos(phi))* speed
        this.positionPrecise.x = this.positionPrecise.x.plus(vx)
        this.positionPrecise.y = this.positionPrecise.y.plus(vy)
        this.positionPrecise.z = this.positionPrecise.z.plus(vz)
        this.position.x = this.positionPrecise.x.toNumber()
        this.position.y = this.positionPrecise.y.toNumber()
        this.position.z = this.positionPrecise.z.toNumber()

        this.positionHi.x = ((this.positionPrecise.x.toNumber().toPrecision(12)))
        this.positionHi.y = ((this.positionPrecise.y.toNumber().toPrecision(12)))
        this.positionHi.z = ((this.positionPrecise.z.toNumber().toPrecision(12)))

        this.positionLo.x = this.positionPrecise.x.minus(this.positionHi.x)
        this.positionLo.y = this.positionPrecise.y.minus(this.positionHi.y)
        this.positionLo.z = this.positionPrecise.z.minus(this.positionHi.z)
    }

    constructor(x,y,z,type,faction,rotSpeed,accSpeed,weapon,fuelTank,consumption,armor,shield,shieldRecharge ) {
        this.positionPrecise.x = new BigNumber(x)
        this.positionPrecise.y = new BigNumber(y)
        this.positionPrecise.z = new BigNumber(z)
        this.type = type
        this.faction = faction
        this.rotationSpeed = rotSpeed
        this.accelerationSpeed = accSpeed
        this.weapon = weapon
        this.fuelTank = fuelTank
        this.consumption = consumption
        this.consumptionC = consumption/8765.812756
        this.armor = armor
        this.armorMax = armor
        this.shield = shield
        this.shieldMax = shield
        this.shieldRecharge = shieldRecharge
    }
}

let aiShips = []

let aiShipsRun = function() {
    for (let i = 0; i<aiShips.length; i++) {
        if (aiShips[i]!==undefined) {
            let destroy = aiShips[i].run()
            aiShips[i].run2()
            if (!destroy) {
                if (playerShip.computers[0].targetObj===aiShips[i]) {playerShip.computers[0].targetObj={};playerShip.computers[0].target=""}
                shipWindow3D.scene.remove(shipWindow3D.ships[i])
                shipWindow3D.ships[i] = undefined
                aiShips[i]=undefined
            }
        }
    }
}

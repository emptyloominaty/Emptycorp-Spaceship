class AiShip {
    position = {x:0,y:0,z:0}
    type = "civilian"

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

    rotationSpeed = 60 // °/60 per sec
    accelerationSpeed = 2000 // c/60 per sec
    weapon = {type:"laser",damageData:{power:40/* MW */, length:0.01 /*seconds*/,cd:0.32 /*seconds*/,life: 5, speed:2000, color: 0xff0000}}
    fuelTank = {type:"fuel1", capacity:500, maxCapacity:500}
    consumption = 5 // kg per ly
    consumptionC = 5/8765.812756 //kg per c

    //ai
    target = {}

    destroyed = false

    run() {
        if (this.destroyed) {
            return false
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
        console.log("BEFORE:"+this.armor)
        //armor
        if(this.armor>damage) {
            this.armor-=damage
            damage = 0
        } else {
            damage -= this.armor
            this.armor = 0
        }
        console.log("AFTER:"+this.armor)
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
        this.position.x += vx
        this.position.y += vy
        this.position.z += vz
    }

    constructor(x,y,z,type,faction,rotSpeed,accSpeed,weapon,fuelTank,consumption,armor,shield) {
        this.position.x = x
        this.position.y = y
        this.position.z = z
        this.type = type //miner,trader,civilian,military
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
    }
}

let aiShips = []

let aiShipsRun = function() {
    for (let i = 0; i<aiShips.length; i++) {
        if (aiShips[i]!==undefined) {
            let destroy = aiShips[i].run()
            aiShips[i].run2()
            if (!destroy) {
                //shipWindow3D.scene.remove()
                //shipWindow3D.aiShips[i] = undefined
                aiShips[i]=undefined
            }
        }
    }
}

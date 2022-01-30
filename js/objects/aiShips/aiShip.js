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


    constructor(x,y,z,type,faction,rotSpeed,accSpeed,weapon,fuelTank) {
        this.position.x = x
        this.position.y = y
        this.position.z = z
        this.type = type //miner,trader,civilian,military
        this.faction = faction
        this.rotationSpeed = rotSpeed
        this.accelerationSpeed = accSpeed
        this.weapon = weapon
        this.fuelTank = fuelTank

    }
}
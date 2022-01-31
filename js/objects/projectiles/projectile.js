class Projectile {
    yaw = 0
    pitch = 0
    targetYaw = 0
    targetPitch = 0
    position = {x:0,y:0,z:0}
    positionPrecise = {x:new BigNumber(1),y:new BigNumber(1),z:new BigNumber(0)}
    positionHi = {x:0, y:0, z:0}
    positionLo = {x:0, y:0, z:0}

    speed = 0
    life = 10
    maxLife = 10

    run() {
        this.life-=1/gameFPS
        if (this.life<0) {
            return false
        }
        this.move()
        //collision
        for (let i = 0; i<aiShips.length; i++) {
            if (aiShips[i]!==undefined) {
                let objPos = aiShips[i].hitbox
                if (this.checkCollision(objPos.x1,objPos.y1,objPos.z1,objPos.x2,objPos.y2,objPos.z2)) {
                    aiShips[i].getDamage(this.damage,this.shieldDmgBonus,this.ignoreShield)
                    return false
                }
            }
        }
        return true
    }

    checkCollision(x1,y1,z1,x2,y2,z2) {
        return ((this.position.x >= x1 && this.position.x <= x2) &&
            (this.position.y >= y1 && this.position.y <= y2) &&
            (this.position.z >= z1 && this.position.z <= z2))
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

    constructor(x,y,z,yaw,pitch,speed,type,source,maxLife,damageData) {
        this.positionPrecise.x = x
        this.positionPrecise.y = y
        this.positionPrecise.z = z
        this.yaw = yaw
        this.targetYaw = yaw
        this.pitch = pitch
        this.targetPitch = pitch
        this.speed = speed
        this.type = type
        this.maxLife = maxLife
        this.life = maxLife
        this.source = source

        this.damage = damageData.damage
        this.ignoreShield = damageData.ignoreShield
        this.shieldDmgBonus = damageData.shieldDmgBonus
    }
}

let projectiles = []

let projectilesRun = function() {
    for (let i = 0; i<projectiles.length; i++) {
        if (projectiles[i]!==undefined) {
            let destroy = projectiles[i].run()
            if (projectiles[i].type==="missile") {
                projectiles[i].run2()
            }
            if (!destroy) {
                shipWindow3D.scene.remove(shipWindow3D.projectiles[i])
                shipWindow3D.projectiles[i] = undefined
                projectiles[i]=undefined
            }
        }
    }
}

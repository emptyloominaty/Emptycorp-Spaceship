class Projectile {
    yaw = 0
    pitch = 0
    targetYaw = 0
    targetPitch = 0
    position = {x:0,y:0,z:0}
    speed = 0
    life = 10
    maxLife = 10

    run() {
        this.life-=1/gameFPS
        if (this.life<0) {
            return false
        }
        this.move()
        //checkCollision (if distance<0.0.000000000000105702341) //1km
        //doDamage
        return true
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

    checkCollision(x1,y1,z1,x2,y2,z2) {
        return (this.position.x >= x1 && this.position.x <= x2) &&
            (this.position.y >= y1 && this.position.y <= y2) &&
            (this.position.z >= z1 && this.position.z <= z2)
    }



    constructor(x,y,z,yaw,pitch,speed,type,source,maxLife) {
        this.position.x = x
        this.position.y = y
        this.position.z = z
        this.yaw = yaw
        this.targetYaw = yaw
        this.pitch = pitch
        this.targetPitch = pitch
        this.speed = speed
        this.type = type
        this.maxLife = maxLife
        this.life = maxLife
        this.source = source
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
           // console.log(projectiles[i].x," | ",projectiles[i].y," | ",projectiles[i].z)
            if (!destroy) {
                shipWindow3D.scene.remove(shipWindow3D.projectiles[i])
                shipWindow3D.projectiles[i] = undefined
                projectiles[i]=undefined
            }
        }
    }
}

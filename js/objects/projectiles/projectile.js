class Projectile {
    yaw = 0
    pitch = 0
    x = 0
    y = 0
    z = 0
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
        this.x += vx
        this.y += vy
        this.z += vz
    }

    checkCollision(x1,y1,z1,x2,y2,z2) {
        return (this.x >= x1 && this.x <= x2) &&
            (this.y >= y1 && this.y <= y2) &&
            (this.z >= z1 && this.z <= z2)
    }



    constructor(x,y,z,yaw,pitch,speed,type,maxLife) {
        this.x = x
        this.y = y
        this.z = z
        this.yaw = yaw
        this.pitch = pitch
        this.speed = speed
        this.type = type
        this.maxLife = maxLife
        this.life = maxLife
    }
}

let projectiles = []

let projectilesRun = function() {
    for (let i = 0; i<projectiles.length; i++) {
        if (projectiles[i]!==undefined) {
            let destroy = projectiles[i].run()
           // console.log(projectiles[i].x," | ",projectiles[i].y," | ",projectiles[i].z)
            if (!destroy) {
                shipWindow3D.scene.remove(shipWindow3D.projectiles[i])
                shipWindow3D.projectiles[i] = undefined
                projectiles[i]=undefined
            }
        }
    }
}

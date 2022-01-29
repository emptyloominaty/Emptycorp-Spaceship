class Weapon extends Part {
    doDamage(yaw,pitch,speed) {
        if (this.type==="laser") {
            if (this.cooldown>=this.maxCooldown) {
                if (playerShip.usePower((this.power*this.length),this.group)) {



                    let xyz = this.getStartPosition()
                    let x = playerShip.position.x + xyz[0]
                    let y = playerShip.position.y + xyz[1]
                    let z = playerShip.position.z + xyz[2]
                    let yaw = playerShip.position.yaw.direction
                    let pitch = playerShip.position.pitch.direction-180
                    let speed = playerShip.speed+1000 //+this.damageData.speed



                    for (let i = 0; i<projectiles.length; i++) {
                        if (projectiles[i]===undefined) {
                            projectiles[i] = new Laser(x,y,z,yaw,pitch,speed,"laser",this.damageData.life)
                            break
                        }
                    }
                    projectiles.push(new Laser(x,y,z,yaw,pitch,speed,"laser",this.damageData.life))
                    this.cooldown = 0

                }
            }
        }
    }
    run() {
        if (this.cooldown<this.maxCooldown) {
            this.cooldown+=1/gameFPS
        }
    }

    getStartPosition() {
        let speed = 0.0000003 //0.005

        let angleInRadianYaw = (playerShip.position.yaw.direction*Math.PI) / 180
        let angleInRadianPitch = (((playerShip.position.pitch.direction-45)-180)*Math.PI) / 180

        let theta = angleInRadianYaw
        let phi = Math.PI/2-(angleInRadianPitch)

        let vx = (Math.sin(phi)*Math.sin(theta) )* speed
        let vy = (Math.sin(phi)*Math.cos(theta) )* speed
        let vz = (Math.cos(phi))* speed
        console.log(vx," | ",vy," | ",vz)
        return [vx,vy,vz]
    }


    constructor(id,weight,name,type,damageData) {
        super(weight,name,"weapon",id)
        this.type = type
        this.cooldown = damageData.cd
        this.maxCooldown = damageData.cd
        this.damageData = damageData
        if (type==="laser") {
            this.power = damageData.power
            this.length = damageData.length
        }
    }
}
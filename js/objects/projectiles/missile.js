class Missile extends Projectile {
    constructor(x,y,z,yaw,pitch,speed,type,source,maxLife,color,damageData,missileData) {
        damageData.damage = missileData.damage
        damageData.shieldDmgBonus = missileData.shieldDmgBonus
        damageData.ignoreShield = missileData.ignoreShield
        super(x,y,z,yaw,pitch,speed,type,source,maxLife,damageData)
        this.guided = missileData.guided
        this.missileData = missileData
        this.color = color
        this.wait = 1
        if (this.guided) {
            this.target = source.target
        }
    }
    run2() {
        if(this.wait>0) {
            this.wait-=1/gameFPS
        } else {
            if (this.speed<this.missileData.maxSpeed) {
                this.speed+=10000/gameFPS
            }
            if (this.guided) {
                console.log("yaw: "+this.targetYaw+" / "+this.yaw)
                this.guide()

                //yaw
                /*if (this.targetYaw>this.yaw) {
                    this.yaw+=60/gameFPS
                } else if (this.targetYaw<this.yaw) {
                    this.yaw-=60/gameFPS
                }
                //pitch
                if (this.targetPitch>this.pitch) {
                    this.pitch+=60/gameFPS
                } else if (this.targetPitch<this.pitch) {
                    this.pitch-=60/gameFPS
                }
                */
                this.yaw = this.targetYaw
                this.pitch = this.targetPitch
            }
        }
    }
    
    guide() {
        if (Object.keys(this.target).length!==0) {
            let a = this.source.target.position.x - this.position.x //x1 - x2
            let b = this.source.target.position.y - this.position.y //y1 - y2
            let c = this.source.target.position.z - this.position.z //z1 - z2
            let distanceToObject = Math.sqrt( a*a + b*b )

            let angleYaw = ((((Math.atan2( this.position.y - this.source.target.position.y, this.position.x - this.source.target.position.x ) * 180)) / Math.PI))-270
            angleYaw = angleYaw*(-1)
            angleYaw = angleYaw % 360
            if (angleYaw < 0) {
                angleYaw += 360
            }
            let anglePitch = Math.atan2(c,Math.sqrt(b * b + a * a))
            anglePitch = (((anglePitch)*57.2957795))


            this.targetYaw = angleYaw
            this.targetPitch = anglePitch
        }
    }
    
}
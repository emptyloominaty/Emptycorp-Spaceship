class Missile extends Projectile {
    constructor(x,y,z,yaw,pitch,speed,type,maxLife,color,guided = false) {
        super(x,y,z,yaw,pitch,speed,type,maxLife)
        this.guided = guided
        this.color = color
    }
}
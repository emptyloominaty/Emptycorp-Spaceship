class Laser extends Projectile {
    constructor(x,y,z,yaw,pitch,speed,type,maxLife,color) {
        super(x,y,z,yaw,pitch,speed,type,maxLife)
        this.color = color
    }
}
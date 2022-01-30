class Plasma extends Projectile {
    constructor(x,y,z,yaw,pitch,speed,type,source,maxLife,color) {
        super(x,y,z,yaw,pitch,speed,type,source,maxLife)
        this.color = color
    }
}
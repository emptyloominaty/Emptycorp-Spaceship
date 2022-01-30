class Plasma extends Projectile {
    constructor(x,y,z,yaw,pitch,speed,type,source,maxLife,color,damageData) {
        super(x,y,z,yaw,pitch,speed,type,source,maxLife,damageData)
        this.color = color
    }
}
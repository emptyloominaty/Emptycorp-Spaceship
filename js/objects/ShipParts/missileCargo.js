class MissileCargo extends Part {
    constructor(id,weight,name,count,maxCount,missileWeight,missiledata) {
        super(weight, name, "weapon", id)
        this.count = count
        this.maxCount = maxCount
        this.missileWeight = missileWeight
        this.missiledata = missiledata
    }
}
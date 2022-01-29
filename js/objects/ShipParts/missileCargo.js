class MissileCargo extends Part {
    constructor(id,weight,name,count,maxCount) {
        super(weight, name, "weapon", id)
        this.count = count
        this.maxCount = count
    }
}
class Capacitor extends Part {
    charge = 0 //MWh
    maxCharge = 0 //MWh

    discharge(val) {
        if ((this.charge-val)<0) {
            return false
        } else {
            this.charge-=val
            return true
        }
    }

    recharge(val) {
        if ((this.charge+val)>this.maxCharge) {
            return false
        } else {
            this.charge+=val
            return true
        }
    }

    constructor(weight,name,charge) {
        super(weight,name,"capacitor")
        this.charge = charge
        this.maxCharge = charge

    }


}
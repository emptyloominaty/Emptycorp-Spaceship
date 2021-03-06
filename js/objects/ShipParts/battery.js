class Battery extends Part {
    charge = 0 //MWh
    maxCharge = 0 //MWh
    maxDischarge = 0

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

    constructor(id,weight,name,charge,maxDischargeRate) {
        super(weight,name,"battery",id)
        this.charge = charge
        this.maxCharge = charge
        this.maxDischarge = maxDischargeRate
        this.maxDischargeSec = maxDischargeRate/60/60
    }

}
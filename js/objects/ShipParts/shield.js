class Shield extends Part {
    on=0
    maxCharge = 500
    charged = 0
    setCharge = 500
    rechargeRate = 1
    dischargeRate = 0.5
    consumption = [0.05,0.2]
    run() {
        if (this.on===1) {
            if (playerShip.usePower((this.consumption[0]*(this.charged/this.maxCharge))/gameFPS,this.group)) {
                if (this.setCharge>this.charged) {
                    if (playerShip.usePower(this.consumption[1]/gameFPS,this.group)) {
                        this.charge()
                    }
                }
            } else {
                this.discharge()
            }
        } else {
            this.discharge()
        }
    }

    charge() {
        this.charged+=this.rechargeRate/gameFPS
        if (this.charged>this.maxCharge) {
            this.charged=this.maxCharge
        }
    }

    discharge() {
        this.charged-=this.dischargeRate/gameFPS
        if (this.charged<0) {
            this.charged = 0
        }
    }

    constructor(id,weight,name,capacity,rechargeRate,consumption) {
        super(weight,name,"shield",id)
        this.maxCharge = capacity
        this.setCharge = capacity
        this.rechargeRate = rechargeRate
        this.dischargeRate = rechargeRate/2
        this.consumption = consumption
    }

}
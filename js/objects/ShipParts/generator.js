class Generator extends Part {
    on = 1
    run(percent,fps) { //every 1sec
        let p = percent/100
        let cons = (this.consumption/fps)/p
        let out = (this.output/fps)/p
        if (this.on===1) {
            let s = playerShip.checkBatteries()
            if (s===true) {
                let s2 = playerShip.useTank(this.type,cons)
                    if (s2===true) {
                        playerShip.generatePower(out)
                    }

            }
        }
    }


    constructor(weight,name,type,output,defaultOn) {
        super(weight,name,"generator")
        this.type = type
        this.output = output
        if (type === "H2FuelCell") {
            this.consumption = ((output/1000)/0.0000033) // l/hour   (3.3Wh per L)
            this.generatorFuelType = "H2"
        } else if (type === "UraniumReactor") {
           this.consumption = ((output/1000)/22) // kg/hour  (22gW per kg
            this.generatorFuelType = "Uranium"
        }
        this.on = defaultOn
    }

}
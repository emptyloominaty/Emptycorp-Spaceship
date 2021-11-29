class Generator extends Part {
    on = 1
    generatorFuelType2 = 0
    ratio = 1

    run(percent,fps) {
        let p = percent
        if(p>1) {p = 1}
        let cons = (this.consumption/fps)*p
        let out = (this.output/fps)*p
        if (this.on===1) {
            let s = playerShip.checkBatteries()
            if (s[0]<s[1]) {
                let s2 = playerShip.useTank(this.generatorFuelType,cons)
                if (this.generatorFuelType2!==0) {
                    let s3 = playerShip.useTank(this.generatorFuelType2,cons*this.ratio)
                    if (s3===false) {
                        this.on = 0
                    }
                }
                    if (s2===true) {
                        playerShip.generatePower(out)
                    } else {
                        this.on = 0
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
            this.generatorFuelType = "O2"
            this.generatorFuelType2 = "H2"
            this.ratio = 2 //2:1
        } else if (type === "UraniumReactor") {
           this.consumption = ((output/1000)/22) // kg/hour  (22gW per kg
            this.generatorFuelType = "uranium"
        }
        this.on = defaultOn
    }

}
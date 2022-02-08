class Generator extends Part {
    on = 1
    generatorFuelType2 = 0
    ratio = 1

    started = 0
    startingTime = 1 //sec

    run(percent,fps) {
        let p = percent
        if(p>1) {p = 1}
        if(p>this.started) {p=this.started}
        let cons = (this.consumption/fps)*p
        let out = (this.output/fps)*p
        if (this.on===1) {
            if (this.started<1) {
                this.started += (1/this.startingTime)/fps
            }
            if (this.started>1) {this.started=1}
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
        } else {
            this.started -= (1/this.startingTime)/fps
            if (this.started<0) {this.started=0}
        }
    }


    constructor(id,weight,name,type,output,defaultOn,efficiency = 100) {
        super(weight,name,"generator",id)
        this.type = type
        this.output = output
        if (type === "H2FuelCell") {
            this.consumption = ((output/1000)/(0.0000033*(efficiency/100)))/3600 // l/hour   (3.3Wh per L)
            this.generatorFuelType = "H2"
            this.generatorFuelType2 = "O2"
            this.ratio = 0.5 //0.5:1
            this.startingTime = 0.5
        } else if (type === "UraniumReactor") {
            this.consumption = ((output/1000)/(22.3944*(efficiency/100)))/3600 // kg/hour  (22.3944gW per kg)
            this.generatorFuelType = "uranium"
            this.startingTime = 120
        } else if (type === "FussionReactor") {
            this.consumption = ((output/1000)/(158.6618772*(efficiency/100)))/3600 // kg/hour  (158.6618772gW per kg)
            this.generatorFuelType = "deuterium"
            this.startingTime = 10
        } else if (type === "H2FussionReactor") {
            this.consumption = ((output/1000)/(177.716*(efficiency/100)))/3600 // kg/hour  (177.716gW per kg)
            this.generatorFuelType = "H2"
            this.startingTime = 20
        }
        this.on = defaultOn
    }

}
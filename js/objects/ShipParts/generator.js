class Generator extends Part {
    consumption = 0

    run(percent) {
        //todo:check fuel
        //todo: run
    }


    constructor(weight,name,type,output) {
        super(weight,name,"generator")
        this.type = type
        this.output = output
        if (type === "H2FuelCell") {
            this.consumption = ((output/1000)/0.0000033) // l/hour   (3.3Wh per L)
        } else if (type === "UraniumReactor") {
           this.consumption = ((output/1000)/22) // kg/hour  (22gW per kg
        }
    }
    }
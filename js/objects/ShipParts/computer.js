class Computer extends Part {
    on = 1
    modules = []
    mode = 0 //0 = 0%  1 = 100% usage
    run() {
       if (playerShip.usePower(this.consumption[0]/gameFPS,this.group)) { //todo:fix power consumption
           for (let i = 0; i<this.modules.length; i++) {
               if (this.modules[i].on===1) {
                   if (playerShip.usePower(this.modules[i].consumption/gameFPS,this.group)) {
                       this.modules[i].run()
                   }
               }
           }
       }
    }
    constructor(weight,name,modules,consumption) {
        super(weight,name,"computer")
        this.consumption = consumption

        for(let i = 0; i<modules.length; i++) {
            if (modules[i]==="communication") {
                this.modules.push(new CommunicationModule())
            } else if (modules[i]==="fuelConsumption") {
                this.modules.push(new FuelConsumptionModule())
            } else if (modules[i]==="lifeSupport") {
                this.modules.push(new LifeSupportModule())
            } else if (modules[i]==="navigation") {
                this.modules.push(new NavigationModule())
            }
        }

    }
}
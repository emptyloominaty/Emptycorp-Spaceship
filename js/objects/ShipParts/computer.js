class Computer extends Part {
    on = 1
    modules = []
    mode = 0 //0 = 0%  1 = 100% usage
    memory = 0
    comm = 0

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
    constructor(id,weight,name,modules,consumption,memorySize) {
        super(weight,name,"computer",id)
        this.consumption = consumption

        for(let i = 0; i<modules.length; i++) {
            if (modules[i]==="communication") {
                this.modules.push(new CommunicationModule())
                this.comm = this.modules[i]
            } else if (modules[i]==="fuelConsumption") {
                this.modules.push(new FuelConsumptionModule())
            } else if (modules[i]==="navigation") {
                this.modules.push(new NavigationModule())
            } else if (modules[i]==="memory") {
                this.modules.push(new MemoryModule(memorySize))
                this.memory = this.modules[i]
            }
        }

    }
}
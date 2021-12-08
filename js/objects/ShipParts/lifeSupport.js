class LifeSupport extends Part {
    on = 1
    usage = 0
    size = 0.068
    run() {
        if (this.on===1) {
            //CO2
            if (playerShip.usePower(this.baseConsumption/gameFPS, this.group)) {
                let co2 = playerShip.atmosphere.carbonDioxide
                if (co2>0.04) {
                    this.usage = (co2*100)-3.9
                    if (this.usage>1) {this.usage=1}
                    if (playerShip.usePower((this.maxConsumption*this.usage)/gameFPS, this.group)) {
                        let totalCo2 = co2 * playerShip.atmosphere.volume * playerShip.atmosphere.pressure
                        let change = (this.size * this.usage * co2) / gameFPS
                        let change2 = co2 - ((totalCo2 - change) / playerShip.atmosphere.volume / playerShip.atmosphere.pressure)

                        console.log()

                        playerShip.atmosphere.carbonDioxide -= change2
                        playerShip.atmosphere.oxygen += change2
                    }
                }
                //PRESSURE
                if (playerShip.atmosphere.pressure<playerShip.pressureSet) {
                    if (playerShip.checkTank("N2")>1 && playerShip.checkTank("O2")>1) {
                        if (playerShip.usePower((this.maxConsumption/3)/gameFPS, this.group)) {
                            let val = (160)/gameFPS
                            let n2use = (val)*3.76
                            let o2use = (val)
                            if (playerShip.useTank("N2",n2use) && playerShip.useTank("O2",o2use)) {
                                playerShip.atmosphere.pressure+=(((val*4.76)/1000)/playerShip.atmosphere.volume)
                            }
                        }
                    }
                } else if (playerShip.atmosphere.pressure>playerShip.pressureSet+0.001 && playerShip.atmosphere.pressure>0.000001) {
                    if (playerShip.usePower((this.maxConsumption*50) / gameFPS, this.group)) {
                        let val = (100*playerShip.atmosphere.pressure)/gameFPS
                        let n2use = (val)*3.76
                        let o2use = (val)
                        playerShip.fillTank("N2",n2use)
                        playerShip.fillTank("O2",o2use)
                        playerShip.atmosphere.pressure-=(((val*4.76)/1000)/playerShip.atmosphere.volume)
                    }
                }
                //TODO:O2


                //TODO:N2 ?
            }
        }
        document.getElementById("debug1Co2").innerText = "Pressure: "+playerShip.atmosphere.pressure+"bar"
        document.getElementById("debug2Co2").innerText = " N2: " + playerShip.atmosphere.nitrogen + "% | O2: " + playerShip.atmosphere.oxygen + "%  | CO2: " + playerShip.atmosphere.carbonDioxide + "% "
    }
    constructor(id,weight,name,baseConsumption,maxConsumption) {
        super(weight,name,"lifeSupport",id)
        this.baseConsumption = baseConsumption
        this.maxConsumption = maxConsumption
    }

}
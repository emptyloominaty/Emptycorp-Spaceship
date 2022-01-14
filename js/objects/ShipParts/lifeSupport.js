class AtmosphereControl extends Part {
    on = 1
    usage = 0
    size = 8.5
    run() {
        if (this.on===1) {
            //CO2
            if (playerShip.usePower(this.baseConsumption/gameFPS, this.group)) {
                let co2 = playerShip.atmosphere.carbonDioxide
                if (co2>0.03) {
                    this.usage = (co2*100)-2.9
                    if (this.usage>1) {this.usage=1}
                    if (playerShip.usePower(((this.maxConsumption*this.usage*this.size/2))/gameFPS, this.group)) {
                        let totalCo2 = co2 * playerShip.atmosphere.volume * playerShip.atmosphere.pressure
                        let change = (this.size * this.usage * Math.pow(co2,2)) / gameFPS
                        playerShip.atmosphere.carbonDioxideVolume -= change
                        playerShip.atmosphere.oxygenVolume += change
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
                                playerShip.atmosphere.oxygenVolume += o2use
                                playerShip.atmosphere.nitrogenVolume += n2use
                            }
                        }
                    }
                } else if (playerShip.atmosphere.pressure>playerShip.pressureSet+0.001 && playerShip.atmosphere.pressure>0.001) {
                    if (playerShip.usePower((this.maxConsumption*50) / gameFPS, this.group)) {
                        let val = (100*playerShip.atmosphere.pressure)/gameFPS
                        let n2use = (val)*3.76
                        let o2use = (val)
                        playerShip.fillTank("N2",n2use)
                        playerShip.fillTank("O2",o2use)
                        playerShip.atmosphere.carbonDioxideVolume -= (val*(100/playerShip.atmosphere.oxygen))*(playerShip.atmosphere.carbonDioxide/100)
                        playerShip.atmosphere.oxygenVolume -= o2use
                        playerShip.atmosphere.nitrogenVolume -= n2use
                    }
                }
                if (playerShip.atmosphere.carbonDioxideVolume<0) {playerShip.atmosphere.carbonDioxideVolume=0}
                if (playerShip.atmosphere.oxygenVolume<0) {playerShip.atmosphere.oxygenVolume=0}
                if (playerShip.atmosphere.nitrogenVolume<0) {playerShip.atmosphere.nitrogenVolume=0}
            }
        }
    }
    constructor(id,weight,name,baseConsumption,maxConsumption) {
        super(weight,name,"lifeSupport",id)
        this.baseConsumption = baseConsumption
        this.maxConsumption = maxConsumption
    }

}


class TemperatureControl extends Part {
    on = 1
    size = 0.0121
    run() {
        playerShip.computers[0].data.cooling = 0
        playerShip.computers[0].data.heating = 0
        if (this.on===1) {
            if (playerShip.usePower(this.baseConsumption / gameFPS, this.group)) {
                //COOLING
                if (playerShip.atmosphere.temperature > playerShip.temperatureSet + 0.001) {
                    let percent = (playerShip.atmosphere.temperature - playerShip.temperatureSet) + 0.001
                    if (percent > 1) {
                        percent = 1
                    }
                    playerShip.computers[0].data.cooling = percent*100

                    let dec = (this.size * percent) / playerShip.atmosphere.volume
                    if (playerShip.usePower((this.coldConsumption * percent) / gameFPS, this.group)) {
                        playerShip.atmosphere.temperature -= dec/(gameFPS/60)
                    }
                    //HEATING
                } else if (playerShip.atmosphere.temperature < playerShip.temperatureSet - 0.001) {
                    let percent = (playerShip.temperatureSet - playerShip.atmosphere.temperature) + 0.001 //0.01
                    if (percent > 1) {
                        percent = 1
                    }
                    playerShip.computers[0].data.heating = percent*100
                    let inc = this.size * percent / playerShip.atmosphere.volume
                    if (playerShip.usePower((this.heatConsumption * percent) / gameFPS, this.group)) {
                        playerShip.atmosphere.temperature += inc /(gameFPS/60)
                    }
                }
            }
        }
    }


    constructor(id,weight,name,baseConsumption,heatConsumption,coldConsumption) {
        super(weight,name,"lifeSupport",id)
        this.baseConsumption = baseConsumption
        this.heatConsumption = heatConsumption
        this.coldConsumption = coldConsumption
        this.size = this.heatConsumption/0.28
    }

}
class Ship {
    //---------------------------------------------
    crew = [{name:"Empty",status:"alive",dying:0}]
    baseWeight = 5500 //kg
    armor = 500
    armorMax = 500

    //---------------------------------------------
    speed = 0 //c
    position = {x:0, y:0, direction:0, targetDirection:0, angularSpeed:0}
    weight = this.baseWeight

    //radiation heat transfer
    emissivityCoefficient = 0.12 //avg
    surfaceArea =  128 //m2
    size = {l:7,h:3.5,w:3.5}


    atmosphere = {oxygen:21, nitrogen:78.96, carbonDioxide:0.04, volume:16/* m3 */, pressure:1/* bar */, temperature:294,
                oxygenVolume:3360, nitrogenVolume:12633.6, carbonDioxideVolume:6.4, /*Litres*/} //16000
    //---------------------------------------------
    targetSpeed = 0 //c
    speedMode = "FTL"
    propulsion = "off"
    acc = 0
    rcs = 1
    eRcs = 1
    powerInput = 0
    powerOutput = 0
    powerOutput2 = 0

    powerInputArray = []
    powerOutputArray = []

    thrust = 0
    usingFuel = "fuel1"
    everyS = 0
    pressureSet = 1
    temperatureSet = 294

    lights = { insideOn: 1, outsideOn:0, insideConsumption:0.0002, outsideConsumption:0.0005
    }
    
    //---------------------------------------------
    lifeSupport = [new AtmosphereControl(0,5.4,"Atmosphere Control",0.00004,0.00010),
        new TemperatureControl(0,28.2,"Temperature Control",0.00001,0.00314,0.00158)]
    antennas = []
    batteries = []
    capacitors = []
    computers = []
    generators = []
    engines = []
    shields = []
    tanks = []
    weapons = []

//------------------------------------------------------------------------------------------------------------------
    everyFrame(fps) {

        this.powerInputArray.push(this.powerInput)
        if (this.powerInputArray.length>60) {
            this.powerInputArray.shift()
        }
        this.powerOutputArray.push(this.powerOutput2)
        if (this.powerOutputArray.length>60) {
            this.powerOutputArray.shift()
        }
        this.doCrew()
        this.getAtmospherePercent()


        this.everyS+=progress
        if (this.everyS>=1000) {
            this.everySec()
            this.everyS=0
        }
        let outputNeeded = this.powerOutput
        this.resetVars()

        this.chargeCapacitors(fps)

        //Generators
        let percent = 0
        let battery = this.checkBatteries()
        let charging = 0
        if ((battery[0]/battery[1])<0.999) {
            charging = 1
        }
        for(let i = 0; i<this.generators.length; i++) {
            percent = outputNeeded/this.generators[i].output
           if(this.generators[i].on===1 && (this.generators[i].output-outputNeeded)<0) {
               outputNeeded = outputNeeded-this.generators[i].output
           }
           if (charging===1) {
               percent = 1
           }
            this.generators[i].run(percent,fps)
        }
        //Update Weight
        this.updateWeight()
        //propulsion
        this.computers[0].data.engineThrust = 0
        this.computers[0].data.engineThrottle = 0
        if (this.propulsion==="on") {
            for(let i = 0; i<this.engines.length; i++) {
                if (this.engines[i].on===1 && this.engines[i].type===this.speedMode && (this.engines[i].minSpeed+1)<this.targetSpeed) {
                    let thrust = this.engines[i].run(0,fps,this.targetSpeed,this.speed)
                    this.thrust += thrust
                    //------------------------------------------
                    if (thrust>1000000000) {
                        this.computers[0].data.engineThrustString = (thrust/1000000000).toFixed(1)+"PN"
                    } else if (thrust>1000000) {
                        this.computers[0].data.engineThrustString = (thrust/1000000).toFixed(1)+"TN"
                    } else if (thrust>1000) {
                        this.computers[0].data.engineThrustString = (thrust/1000).toFixed(1)+"GN"
                    } else {
                        this.computers[0].data.engineThrustString = (thrust).toFixed(2)+"MN"
                    }
                    this.computers[0].data.engineThrust = thrust
                    //------------------------------------------
                    this.speed += (((thrust*1000000)/this.weight)/299792458)/fps     //  MN-->N  kg  M/S->C
                    if (this.speedMode==="Sublight") {
                        if (this.acc === 1 && this.speed>this.targetSpeed) {
                            this.propulsion="off"
                        } else if (this.acc === 0 && this.speed<this.targetSpeed ) {
                            this.propulsion="off"
                        }

                    }
                }
            }
        }

        if (this.speed>1) {
            let warpFriction = (Math.pow(this.speed*75, 1.5))
            this.speed -= (((warpFriction*1000000)/this.weight)/299792458)/fps
            if (this.speed<0) {
                this.speed=0
            }
        }
        if (this.speed>0 && this.speedMode==="FTL") {
            if (this.targetSpeed==0 || this.propulsion==="off") {
                if (this.speed<1000) {
                    this.speed-=25
                }
               this.speed-= this.speed/20

                if (this.speed<0.000000000000000000000000001) { this.speed = 0}
                this.resetWarpEngines()
            }
        }
        if (this.speed<0) {
            this.speed = 0
        }



        //------------------------------------------------------------------------------------------------------------------------
        let getRcsThrust = (targetDirection,direction,p) => {
            let t = 0
            for(let i = 0; i<this.engines.length; i++) {
                if (this.engines[i].on===1 && this.engines[i].type==="RCS") {
                    t += this.engines[i].run(p, fps, targetDirection, direction, this.position.angularSpeed)
                }
            }
            return t
        }

        //direction
        this.position.direction += (this.position.angularSpeed*57.2957795)/fps
        if (this.position.targetDirection-0.01>this.position.direction || this.position.targetDirection+0.01<this.position.direction) {
            let thrust = 0
            let p = 100
            let targetDirection = this.position.targetDirection
            let timeUntil = 10
            if (this.position.angularSpeed!==0) {
                timeUntil = ((this.position.targetDirection-this.position.direction)/(this.position.angularSpeed*57.2957795))
            }
            if (this.rcs===1) {
                //RCS
                if (timeUntil<5) {
                    targetDirection = this.position.direction-0.01
                }
                if (timeUntil<0.5) {
                    targetDirection = (this.position.targetDirection+this.position.direction)/2
                }
                thrust = getRcsThrust(targetDirection,this.position.direction,p)
            } else if (this.eRcs===1){
                let tBoost = 1
                //Reaction Wheel
                if (timeUntil<10) {
                    targetDirection = this.position.direction-0.01
                }
                if (timeUntil<0.2) {
                    targetDirection = (this.position.targetDirection+this.position.direction)/2
                }
                if (timeUntil<-0.2) {
                    tBoost = 10
                }

                if (targetDirection>this.position.direction) {
                    thrust = 0.0003*((targetDirection-this.position.direction)/30)
                } else {
                    thrust = 0.0003*((this.position.direction-targetDirection)/30)*(-1)
                }
                thrust = thrust*tBoost
                let powerNeed = 0.00001
                if (thrust>0.002) {thrust=0.002}
                if (thrust<-0.002) {thrust=-0.002}
                if (thrust>0) {
                    powerNeed = thrust*(this.weight/75)
                } else if (thrust<0) {
                    powerNeed = (thrust*(-1))*(this.weight/75)
                }

                if (!playerShip.usePower(powerNeed/gameFPS,"engine")) {
                    thrust = 0
                }
            }
            let shipInertia = 0.0833*this.weight*Math.pow(this.size.l,2) //(kg∙m2)
            let torque = (thrust*1000000) * (this.size.l/2) //(N∙m)
            let acceleration = torque / shipInertia //(radians/s2)
            this.position.angularSpeed+= acceleration/fps

        } else if (this.position.angularSpeed>0.000001 || this.position.angularSpeed<-0.000001 && (this.position.targetDirection-0.005>this.position.direction || this.position.targetDirection+0.005<this.position.direction)){
            if (this.eRcs===1){
            //REACTION WHEEL
            let powerNeed = this.position.angularSpeed*(this.weight/10000)
            if ((this.position.angularSpeed<0.000001 && this.position.angularSpeed>0) || (this.position.angularSpeed>-0.000001 && this.position.angularSpeed<0)) {
            } else if (playerShip.usePower(powerNeed/gameFPS,"engine")) {
                let thrust = 0
                let targetDirection = this.position.targetDirection
                let timeUntil = 10
                if (this.position.angularSpeed!==0) {
                    timeUntil = ((this.position.targetDirection-this.position.direction)/(this.position.angularSpeed*57.2957795))
                }
                if (timeUntil<5) {
                    targetDirection = this.position.direction-0.01
                }
                if (timeUntil<0.5) {
                    targetDirection = (this.position.targetDirection+this.position.direction)/2
                }
                if (targetDirection>this.position.direction) {
                    thrust = 0.0001*((targetDirection-this.position.direction)/30)
                } else {
                    thrust = 0.0001*((this.position.direction-targetDirection)/30)*(-1)
                }
                let shipInertia = 0.0833*this.weight*Math.pow(this.size.l,2) //(kg∙m2)
                let torque = (thrust*1000000) * (this.size.l/2) //(N∙m)
                let acceleration = torque / shipInertia //(radians/s2)
                this.position.angularSpeed+= acceleration/fps
            }
        }
        }
        //------------------------------------------------------------------------------------------------------------------------



        //computers
        for(let i = 0; i<this.computers.length; i++) {
            this.computers[i].run()
        }
        //antennas
        for(let i = 0; i<this.antennas.length; i++) {
            this.antennas[i].run()
        }
        //life support
        for(let i = 0; i<this.lifeSupport.length; i++) {
            this.lifeSupport[i].run()
        }
        //capacitors
        for(let i = 0; i<this.capacitors.length; i++) {
            this.capacitors[i].run()
        }


        //heat transfer radiation
        let heatTransfer = (((this.surfaceArea * this.emissivityCoefficient)/this.weight)*Math.pow((this.atmosphere.temperature/293),1.75))*2 //bullshit but idc
        this.atmosphere.temperature -= heatTransfer/gameFPS
        //TODO:Star

        //-----------------------
        this.move()

        //lights
        this.doLights()
    }
//------------------------------------------------------------------------------------------------------------------
    everySec() {
        for (let i = 0; i<this.capacitors.length; i++) {
            this.capArrayA[i] = this.capacitors[i].charge
            this.capacitors[i].dischargePerSec = (this.capArrayA[i]-this.capArrayB[i] - this.capacitors[i].chargedPerSec)*(gameFPS/60)
            this.capArrayB[i] = this.capacitors[i].charge
            this.capacitors[i].chargedPerSec = 0
        }
        for(let i = 0; i<this.antennas.length; i++) {
            this.antennas[i].everySec()
        }

        if (this.propulsion==="off") {
            elements.btn_turnOffEngines.style.backgroundColor = "#d34644"
        } else if (this.propulsion==="on") {
            elements.btn_turnOffEngines.style.backgroundColor = "#4bd44f"
        }
    }

//------------------------------------------------------------------------------------------------------------------
    resetVars() {
        this.powerInput = 0
        this.powerOutput = 0
        this.powerOutput2 = 0
        this.thrust = 0
    }
    resetWarpEngines() {
        for(let i = 0; i<this.engines.length; i++) {
            if (this.engines[i].type==="FTL") {
                this.engines[i].maxFTLThrust=0
            }
        }
    }
    updateWeight() {
        this.weight = this.baseWeight
        //parts
        this.weight += this.getWeight("antennas")
        this.weight += this.getWeight("batteries")
        this.weight += this.getWeight("capacitors")
        this.weight += this.getWeight("computers")
        this.weight += this.getWeight("generators")
        this.weight += this.getWeight("engines")
        this.weight += this.getWeight("shields")
        this.weight += this.getWeight("tanks")
        this.weight += this.getWeight("weapons")
        //tanks
        for(let i = 0; i<this.tanks.length; i++) {
            let tank = this.tanks[i]

            if (tank.tankType==="gas") {
                this.weight+=(tank.pressure*tank.volume*tank.gasDensity)*(tank.capacity/tank.maxCapacity)
            } else if (tank.tankType==="fuel") {
                this.weight+=tank.fuelWeight*(tank.capacity/tank.maxCapacity)
            }
        }
    }
    getWeight(part) {
        let weight = 0
        for(let i = 0; i<this[part].length; i++) {
            weight+=this[part][i].weight
        }
        return weight
    }
    move() {
        let speedInlyh = this.speed/8765.812756  //lyh
        let speed = speedInlyh/3600/gameFPS

        let angleInRadian = (this.position.direction*Math.PI) / 180
        let vx = Math.sin(angleInRadian) * speed
        let vy = Math.cos(angleInRadian) * speed
        this.position.x += vx
        this.position.y += vy
    }
    doLights() {
        if (this.lights.insideOn===1) {
            if (!this.usePower(this.lights.insideConsumption/gameFPS,"light")) {
                this.lights.insideOn=0
            }
        }
        if (this.lights.outsideOn===1) {
            if (!this.usePower(this.lights.outsideConsumption/gameFPS,"light")) {
                this.lights.outsideOn=0
            }
        }
    }
    doCrew() {
        for(let i = 0; i<this.crew.length; i++) {
            if (this.crew[i].status!=="death") {
                this.atmosphere.carbonDioxideVolume += 0.0057/gameFPS
                this.atmosphere.oxygenVolume -= 0.0057/gameFPS

                if (this.crew[i].dying>0) {this.crew.dying-=1/gameFPS}

                if (this.atmosphere.carbonDioxide>8 || this.atmosphere.oxygen<10 || this.atmosphere.pressure<0.3) {
                    this.crew[i].status = "unconscious"
                    this.crew[i].dying+=2/gameFPS
                } else if (this.crew[i].status==="unconscious") {this.crew[i].status = "alive"}
                if (this.atmosphere.carbonDioxide>10 || this.atmosphere.oxygen<8 || this.atmosphere.pressure<0.2) {
                    this.crew[i].dying+=10/gameFPS
                }
                if (this.atmosphere.carbonDioxide>14 || this.atmosphere.oxygen<3 || this.atmosphere.pressure<0.1) {
                    this.crew[i].dying+=250/gameFPS
                }

                if (this.crew[i].dying>1000) {
                    this.crew[i].status = "death"
                }
            }
        }
    }
    getAtmospherePercent() {
        this.atmosphere.pressure = (this.atmosphere.nitrogenVolume+this.atmosphere.oxygenVolume+this.atmosphere.carbonDioxideVolume)/(this.atmosphere.volume*1000)
        this.atmosphere.nitrogen = (this.atmosphere.nitrogenVolume/(this.atmosphere.volume*this.atmosphere.pressure*1000))*100
        this.atmosphere.oxygen = (this.atmosphere.oxygenVolume/(this.atmosphere.volume*this.atmosphere.pressure*1000))*100
        this.atmosphere.carbonDioxide = (this.atmosphere.carbonDioxideVolume/(this.atmosphere.volume*this.atmosphere.pressure*1000))*100
    }
//------------------------------------------------------------------------------------------------------------------
    checkTank(type) {
        let val = 0
        for (let i = 0; i<this.tanks.length; i++) {
            if (this.tanks[i].type === type) {
                val += this.tanks[i].capacity
            }
        }
        return val
    }

    useTank(type,val) {
        for (let i = 0; i<this.tanks.length; i++) {
            if (this.tanks[i].type === type) {
                if (this.tanks[i].capacity>val) {
                    this.tanks[i].capacity-=val
                    return true
                }
            }
        }
        return false
    }

    fillTank(type,val) {
        for (let i = 0; i<this.tanks.length; i++) {
            if (this.tanks[i].type === type) {
                if (this.tanks[i].maxCapacity>this.tanks[i].capacity+val) {
                    this.tanks[i].capacity+=val
                    return true
                }
            }
        }
        return false
    }

    generatePower(val) { //MW
        this.powerInput += val*gameFPS
        for (let i = 0; i<this.batteries.length; i++) {
            this.batteries[i].charge+=val/60/60
            val=0
            if (this.batteries[i].charge>this.batteries[i].maxCharge) {
                val = this.batteries[i].charge - this.batteries[i].maxCharge
                this.batteries[i].charge = this.batteries[i].maxCharge
            }
        }
    }


    chargeCapacitors(fps) {
        let chargeNeeded = 0
        let chargeAvailable = 0
        let chargeArray = []

        for (let i = 0; i<this.capacitors.length; i++) {
            chargeArray[i] = 0
            if (this.capacitors[i].charge<this.capacitors[i].maxCharge) {
                chargeNeeded += this.capacitors[i].maxCharge-this.capacitors[i].charge
                chargeArray[i] = this.capacitors[i].maxCharge-this.capacitors[i].charge
            }
        }
        for (let i = 0; i<this.batteries.length; i++) {
            if (this.batteries[i].charge>chargeNeeded) {
                if ( this.batteries[i].maxDischargeSec > chargeNeeded) {
                    chargeAvailable += chargeNeeded/fps
                    this.batteries[i].charge -= chargeNeeded/fps
                } else {
                    chargeAvailable += this.batteries[i].maxDischargeSec/fps
                    this.batteries[i].charge -= this.batteries[i].maxDischargeSec/fps
                }
            } else if (this.batteries[i].charge>0) {
                let a = this.batteries[i].maxDischargeSec/fps
                if (this.batteries[i].charge < a) {
                    a = this.batteries[i].charge
                }
                chargeAvailable += a
                this.batteries[i].charge -= a

            }
        }
        for (let i = 0; i<this.capacitors.length; i++) {
            if (this.capacitors[i].charge<this.capacitors[i].maxCharge) {
                if (chargeArray[i]<=chargeAvailable) {
                    this.capacitors[i].charge += chargeArray[i]
                    this.capacitors[i].chargedPerSec += chargeArray[i]
                    chargeAvailable -= chargeArray[i]
                } else {
                    this.capacitors[i].charge += chargeAvailable
                    this.capacitors[i].chargedPerSec += chargeAvailable
                    chargeAvailable = 0
                }

            }
        }
    }

    usePower(val,powerGroup) {
        this.powerOutput += val*gameFPS
        for (let i = 0; i<this.capacitors.length; i++) {
            if (this.capacitors[i].powerGroup === powerGroup || this.capacitors[i].powerGroup === "everything") {
                if (this.capacitors[i].charge >= val / 3600) {
                    this.capacitors[i].charge -= val / 3600
                    this.powerOutput2 += val*gameFPS
                    return true
                }/* else {
                    this.powerOutput2 += this.capacitors[i].charge
                    val = val - this.capacitors[i].charge
                    this.capacitors[i].charge -= val / 3600
                    if (this.capacitors[i].charge < 0) {
                        this.capacitors[i].charge = 0
                    }
                }*/
            }
        }
        if (val!==0) {
            return false
        } else {
            return true
        }

    }

    checkBatteries() {
        let val = 0
        let valMax = 0
        for (let i = 0; i<this.batteries.length; i++) {
            valMax += this.batteries[i].maxCharge
            val += this.batteries[i].charge
        }
        return [val,valMax]
    }

    constructor(parts) {
        let maxSpeed = 0
        for (let i = 0 ; i < parts.antennas.length ; i++) {
            let part = parts.antennas[i]
            this.antennas.push(new Antenna(i,part.weight || 0,part.name || "name", part.maxSpeed, part.consumptionPower, part.consumptionFuel, part.fuelType))
        }
        for (let i = 0 ; i < parts.batteries.length ; i++) {
            let part = parts.batteries[i]
            this.batteries.push(new Battery(i,part.weight || 0,part.name || "name", part.capacity, part.maxDischarge))
        }
        for (let i = 0 ; i < parts.capacitors.length ; i++) {
            let part = parts.capacitors[i]
            this.capacitors.push(new Capacitor(i,part.weight || 0,part.name || "name", part.capacity, part.powerGroup))
        }
        for (let i = 0 ; i < parts.computers.length ; i++) {
            let part = parts.computers[i]
            this.computers.push(new Computer(i,part.weight || 0,part.name || "name", part.modules, part.consumption, part.memory))
        }
        for (let i = 0 ; i < parts.generators.length ; i++) {
            let part = parts.generators[i]
            this.generators.push(new Generator(i,part.weight || 0,part.name || "name", part.type, part.output, part.defaultOn))
        }
        for (let i = 0 ; i < parts.tanks.length ; i++) {
            let part = parts.tanks[i]
            this.tanks.push(new Tank(i,part.weight || 0,part.name || "name", part.tankType, part.type, part.fuelWeight || 0, part.volume || 0, part.pressure || 0))
        }
        for (let i = 0 ; i < parts.engines.length ; i++) {
            let part = parts.engines[i]
            this.engines.push(new Engine(i,part.weight || 0,part.name || "name", part.fuelType, part.type, part.minSpeed, part.maxSpeed, part.thrust,
                part.consumptionFuel, part.consumptionPower))

            for (let i = 0; i<100000000; i+=100) {
                let wp = Math.pow(i*75, 1.5)
                if ((part.thrust - wp)>0) {
                } else {
                    if(maxSpeed<i) {
                        maxSpeed = i
                        break
                    }
                    break
                }

            }

            //if (part.maxSpeed>maxSpeed) {maxSpeed = part.maxSpeed}
        }
        //this.shields.push
        //this.weapons.push
        document.getElementById("inputRange_speed").max = maxSpeed
        this.maxSpeed = maxSpeed
        this.capArrayA = []
        this.capArrayB = []
        for (let i = 0; i<this.capacitors.length; i++) {
            this.capArrayA.push(0)
            this.capArrayB.push(0)
        }
    }
}


let shipDefaultParts = {
    antennas: [{weight:4.7, maxSpeed:100 /* mbit */, consumptionPower:[0.00005, 0.00003, 0.0048]/* MW */, consumptionFuel:[0.000001, 0.000034, 0.010]/* kg/hour*/,name:"Antenna 100Mbit Mk1", fuelType:"fuel1"}],
    batteries: [{weight:350, capacity: 0.1, /* MWh */maxDischarge:0.5 /* MWh */,name:"Battery 0.1MWh",},],
    computers: [{weight:150, memory:512 /* TB */ , cpu:{cores:256, speed:6/* GhZ */}, consumption:[0.0003,0.0018] /* MWh */,name:"Computer A100", modules:["memory","communication","fuelConsumption","navigation","display"]}],
    capacitors: [{weight:10, capacity: 0.0035, /* MWh */name:"Capacitor 3.5kWh",powerGroup:"lifeSupport"},
                {weight:10, capacity: 0.0035, /* MWh */name:"Capacitor 3.5kWh",powerGroup:"computer"},
                {weight:4, capacity: 0.0010, /* MWh */name:"Capacitor 1kWh",powerGroup:"antenna"},
                {weight:10, capacity: 0.0035, /* MWh */name:"Capacitor 3.5kWh",powerGroup:"shield"},
                {weight:10, capacity: 0.0035, /* MWh */name:"Capacitor 3.5kWh",powerGroup:"weapon"},
                {weight:10, capacity: 0.0035, /* MWh */name:"Capacitor 3.5kWh",powerGroup:"engine"},
                {weight:17, capacity: 0.0050, /* MWh */name:"Capacitor 5kWh",powerGroup:"everything"}],
    generators: [{weight:18, type:"H2FuelCell", output: 0.0113 /* MW */,defaultOn:0},
        {weight:460, type:"UraniumReactor", output: 0.15 /* MW */,defaultOn:0},], //
    engines: [{weight:1500, fuelType:"fuel1", type:"FTL", minSpeed:1.4 /* c */, thrust: 147987520000,/* MN */ maxSpeed:50*8765.812756 /* c */, consumptionFuel:[0,40,150] /* kg/h */ , consumptionPower:[0.008,0.13] /* MW*/},
        {weight:320, fuelType:"fuel1", type:"Sublight", maxSpeed:46000000/299792458 /* c */ , thrust: 0.75 /* MN */, consumptionFuel:[0,1,3] /* kg/h */ , consumptionPower:[0.0004,0.1] /* MW*/  },
        {weight:80, fuelType:"fuel1", type:"RCS", maxSpeed:46000000/299792458 /* c */ , thrust: 0.05 /* MN */, consumptionFuel:[0,0.02,0.05] /* kg/h */ , consumptionPower:[0.00002,0.03] /* MW*/  }],
    shields: [{capacity:1000, rechargeRate:3.8 /* per sec */, consumption:[0.05,0.8] /*MWh 0-maintaining 1-charging*/}],
    tanks: [{weight:110,tankType:"gas",type:"N2",volume:200 /* Litres */,pressure:150 /* bar */},
        {weight:110,tankType:"gas",type:"O2",volume:100 /* Litres */,pressure:150 /* bar */},
        {weight:100,tankType:"gas",type:"H2",volume:80 ,pressure:680 },
        {weight:120,tankType:"gas",type:"O2",volume:160 ,pressure:170 },
        {weight:300,tankType:"fuel",type:"fuel1",fuelWeight:500 /* kg */ },
        {weight:300,tankType:"fuel",type:"fuel1",fuelWeight:500 /* kg */ },
        {weight:300,tankType:"fuel",type:"fuel1",fuelWeight:500 /* kg */ },
        {weight:300,tankType:"fuel",type:"fuel1",fuelWeight:500 /* kg */ },
        {weight:100,tankType:"fuel",type:"uranium",fuelWeight:10 /* kg */},
    ],
    weapons: [{type:"laser", power:20/* MW */, length:0.1 /*seconds*/}]
}



let playerShip = new Ship(shipDefaultParts)


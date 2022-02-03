class Ship {
    myAddress = 1
    //---------------------------------------------
    crew = [{name:"Empty",status:"alive",dying:0}]
    baseWeight = 5500 //kg
    armor = 500
    armorMax = 500
    maxERCSThrust = 0.002
    maxERCSThrustNeg = -0.002

    //---------------------------------------------
    speed = 0 //c
    position = {x:1, y:1, z:0, yaw: {direction:360, targetDirection:360, angularSpeed:0}, pitch: {direction:180, targetDirection:180, angularSpeed:0}}
    positionPrecise = {x:new BigNumber(1),y:new BigNumber(1),z:new BigNumber(0)}
    positionHi = {x:1, y:1, z:0}
    positionLo = {x:0, y:0, z:0}

    hitbox = {x1:0,y1:0,z1:0,x2:0,y2:0,z2:0}
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
    target = {}

    powerInputArray = []
    powerOutputArray = []

    thrust = 0
    usingFuel = "fuel1"
    everyS = 0
    pressureSet = 1
    temperatureSet = 294

    lights = { insideOn: 1, outsideOn:0, insideConsumption:0.00004, outsideConsumption:0.0005
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
    missileCargo = []

//------------------------------------------------------------------------------------------------------------------
    everyFrame(fps) {
        this.hitbox = calcHitbox(this.position.x,this.position.y,this.position.z,0.0001)
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
        this.computers[0].data.engineThrustString = 0+"N"
        this.computers[0].data.engineThrust = 0
        this.computers[0].data.engineThrottle = 0
        if (this.propulsion==="on") {
            for(let i = 0; i<this.engines.length; i++) {
                if (this.engines[i].on===1 && this.engines[i].type===this.speedMode) {
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

        //------------------------------------------------------------------------------------RCS
        //------------------------yaw
        this.position.yaw.direction += (this.position.yaw.angularSpeed*57.2957795)/gameFPS
        if (this.position.yaw.direction>1440) {
            this.position.yaw.direction = 360
        } else if (this.position.yaw.direction<-360) {
            this.position.yaw.direction = 360
        }
        this.position.yaw.angularSpeed = this.shipRCS(this.position.yaw.direction,this.position.yaw.targetDirection,this.position.yaw.angularSpeed,"yaw")
        //------------------------pitch
        this.position.pitch.direction += (this.position.pitch.angularSpeed*57.2957795)/gameFPS
        if (this.position.pitch.direction>1440) {
            this.position.pitch.direction = 360
        } else if (this.position.pitch.direction<-360) {
            this.position.pitch.direction = 360
        }
        this.position.pitch.angularSpeed = this.shipRCS(this.position.pitch.direction,this.position.pitch.targetDirection,this.position.pitch.angularSpeed,"pitch")
        //------------------------------------------------------------------------------------

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
        //shields
        for(let i = 0; i<this.shields.length; i++) {
            this.shields[i].run()
        }
        //weapons
        for(let i = 0; i<this.weapons.length; i++) {
            this.weapons[i].run()
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
        //fuel
        this.computers[0].data.fuelConsumptionAvg  = this.computers[0].fuelCons.fuelConsumptionAvg
        this.computers[0].data.fuelRange  = this.computers[0].fuelCons.range

        //THIS SHOULD NOT BE HERE XD
        updateToggles()
    }

//------------------------------------------------------------------------------------------------------------------
    resetVars() {
        this.powerInput = 0
        this.powerOutput = 0
        this.powerOutput2 = 0
        this.thrust = 0
        this.computers[0].data.rcsLThrust = 0
        this.computers[0].data.rcsRThrust = 0
        this.computers[0].data.rcsUThrust = 0
        this.computers[0].data.rcsDThrust = 0
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
        //missiles
        for(let i = 0; i<this.missileCargo.length; i++) {
            this.weight += this.missileCargo[i].missileWeight * this.missileCargo[i].count
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
        let speedInlyh = this.speed/8765.812756
        let speed = speedInlyh/3600/gameFPS // ly/s

        let angleInRadianYaw = (playerShip.position.yaw.direction*Math.PI) / 180
        let angleInRadianPitch = ((playerShip.position.pitch.direction-180)*Math.PI) / 180

        let theta = angleInRadianYaw
        let phi = Math.PI/2-angleInRadianPitch

        let vx = (Math.sin(phi)*Math.sin(theta) )* speed
        let vy = (Math.sin(phi)*Math.cos(theta) )* speed
        let vz = (Math.cos(phi))* speed

        this.positionPrecise.x = this.positionPrecise.x.plus(vx)
        this.positionPrecise.y = this.positionPrecise.y.plus(vy)
        this.positionPrecise.z = this.positionPrecise.z.plus(vz)
        this.position.x = this.positionPrecise.x.toNumber()
        this.position.y = this.positionPrecise.y.toNumber()
        this.position.z = this.positionPrecise.z.toNumber()

        this.positionHi.x = ((this.positionPrecise.x.toNumber().toPrecision(12)))
        this.positionHi.y = ((this.positionPrecise.y.toNumber().toPrecision(12)))
        this.positionHi.z = ((this.positionPrecise.z.toNumber().toPrecision(12))) // (new BigNumber(

        this.positionLo.x = this.positionPrecise.x.minus(this.positionHi.x)
        this.positionLo.y = this.positionPrecise.y.minus(this.positionHi.y)
        this.positionLo.z = this.positionPrecise.z.minus(this.positionHi.z)

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
        this.atmosphere.temperature += (val*10 / this.atmosphere.volume)/12
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

        //Charge All capacitors
        if (chargeNeeded>chargeAvailable) {
            let ratio = chargeNeeded/chargeAvailable
            for (let i = 0; i<chargeArray.length; i++) {
                chargeArray[i]=chargeArray[i]/ratio
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
                    this.atmosphere.temperature += (val / this.atmosphere.volume)/12
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

    //--------------------------NETWORK--------------------------

    receive(size,address,port,data) {
        return this.antennas[0].receive(size, address, port, data)
    }

    //------------------------------------------------------------------------------------------------------------------
    shipRCS(dir,targetDir,angularSpeed,axis) {
        //------------------------------------------------------------------------------------------------------------------------RCS
        let getRcsThrust = (targetDirection,direction,p,angularSpeed) => {
            let t = 0
            for(let i = 0; i<this.engines.length; i++) {
                if (this.engines[i].on===1 && this.engines[i].type==="RCS") {

                    t += this.engines[i].run(p, gameFPS, targetDirection, direction, angularSpeed)
                    if (axis==="yaw") {
                        if (t<0) {
                            this.computers[0].data.rcsLThrust += (t/this.engines[i].thrust)*(-1)
                        } else {
                            this.computers[0].data.rcsRThrust += (t/this.engines[i].thrust)
                        }
                    } else if (axis==="pitch") {
                        if (t<0) {
                            this.computers[0].data.rcsUThrust += (t/this.engines[i].thrust)*(-1)
                        } else {
                            this.computers[0].data.rcsDThrust += (t/this.engines[i].thrust)
                        }
                    }
                }
            }
            return t
        }

/*
         if (targetDir-dir>190) { //0->190  //50->320
             targetDir-=360
         } else if (dir-targetDir>190) {
             targetDir+=360
         }
*/


        let maxERCSThrust = this.maxERCSThrust
        let maxERCSThrustNeg = this.maxERCSThrustNeg

        if (targetDir-0.06>dir || targetDir+0.06<dir) {
            let thrust = 0
            let p = 100
            let targetDirection = targetDir
            let timeUntil = 10
            if (angularSpeed!==0) {
                timeUntil = ((targetDir-dir)/(angularSpeed*57.2957795))
            }
            if (this.rcs===1) {
                //RCS
                if (timeUntil<5) {
                    targetDirection = dir-0.01
                }
                if (timeUntil<0.5) {
                    targetDirection = (targetDir+dir)/2
                }
                thrust = getRcsThrust(targetDirection,dir,p,angularSpeed)
            } else if (this.eRcs===1){
                let tBoost = 1
                //Reaction Wheel
                if (timeUntil<10) {
                    targetDirection = dir-0.01
                }
                if (timeUntil<0.2) {
                    targetDirection = (targetDir+dir)/2
                }
                if (timeUntil<-0.2) {
                    tBoost = 10
                }

                if (targetDirection>dir) {
                    thrust = 0.0003*((targetDirection-dir)/30)
                } else {
                    thrust = 0.0003*((dir-targetDirection)/30)*(-1)
                }
                thrust = thrust*tBoost
                let powerNeed = 0.00001
                if (thrust>maxERCSThrust) {thrust=maxERCSThrust}
                if (thrust<maxERCSThrustNeg) {thrust=maxERCSThrustNeg}
                if (thrust>0) {
                    powerNeed = thrust*(this.weight/75)
                } else if (thrust<0) {
                    powerNeed = (thrust*(-1))*(this.weight/75)
                }

                if (!playerShip.usePower(powerNeed/gameFPS,"engine")) {
                    thrust = 0
                }

                if (axis==="yaw") {
                    if (thrust>0) {
                        this.computers[0].data.rcsLThrust += thrust/maxERCSThrust
                    } else {
                        this.computers[0].data.rcsRThrust += (thrust*(-1))/maxERCSThrust
                    }
                } else if (axis==="pitch") {
                    if (thrust>0) {
                        this.computers[0].data.rcsUThrust += thrust/maxERCSThrust
                    } else {
                        this.computers[0].data.rcsDThrust += (thrust*(-1))/maxERCSThrust
                    }
                }


            }


            let shipInertia = 0.0833*this.weight*Math.pow(this.size.l,2) //(kg∙m2)
            let torque = (thrust*1000000) * (this.size.l/2) //(N∙m)
            let acceleration = torque / shipInertia //(radians/s2)
            angularSpeed+= acceleration/gameFPS

        } else if (angularSpeed>0.000001 || angularSpeed<-0.000001 && (targetDir-0.05>dir || targetDir+0.05<dir)){
            if (this.eRcs===1){
                //REACTION WHEEL
                let powerNeed = angularSpeed*(this.weight/10000)
                if ((angularSpeed<0.000001 && angularSpeed>0) || (angularSpeed>-0.000001 && angularSpeed<0)) {
                } else if (playerShip.usePower(powerNeed/gameFPS,"engine")) {
                    let thrust = 0
                    let targetDirection = targetDir
                    let timeUntil = 10
                    if (angularSpeed!==0) {
                        timeUntil = ((targetDir-dir)/(angularSpeed*57.2957795))
                    }
                    if (timeUntil<5) {
                        targetDirection = dir-0.01
                    }
                    if (timeUntil<0.5) {
                        targetDirection = (targetDir+dir)/2
                    }
                    if (targetDirection>dir) {
                        thrust = 0.0001*((targetDirection-dir)/30)
                    } else {
                        thrust = 0.0001*((dir-targetDirection)/30)*(-1)
                    }
                    let shipInertia = 0.0833*this.weight*Math.pow(this.size.l,2) //(kg∙m2)
                    let torque = (thrust*1000000) * (this.size.l/2) //(N∙m)
                    let acceleration = torque / shipInertia //(radians/s2)
                    angularSpeed+= acceleration/gameFPS
                   /* if ((angularSpeed<0.002 && angularSpeed>0) || (angularSpeed>-0.002 && angularSpeed<0)) {
                        angularSpeed = 0
                    }*/
                }
            }
        }
        return angularSpeed
    }
    //-------------------------------------------------------------------------------------------------------------------------------------------------
    getDamage(damage,shieldDmgBonus,ignoreShield = false) {  //damage = MJ
        shieldDmgBonus = 1+(shieldDmgBonus/100)
        //shields
        if (!ignoreShield) {
            for (let i = 0; i<this.shields.length; i++) {
                if(this.shields[i].charged>damage*shieldDmgBonus) {
                    this.shields[i].charged -= damage*shieldDmgBonus
                    damage = 0
                } else if (this.shields[i].charged>0) {
                    damage -= this.shields[i].charged/shieldDmgBonus
                    this.shields[i].charged = 0
                }
            }
        }
        //armor
        if(this.armor>damage) {
            this.armor-=damage
            damage = 0
        } else {
            damage -= this.armor
            this.armor = 0
        }

        //TODO: damage parts
        if(damage>0) {

        }
    }


    constructor(parts,stats) {
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
            this.generators.push(new Generator(i,part.weight || 0,part.name || "name", part.type, part.output, part.defaultOn, part.efficiency))
        }
        for (let i = 0 ; i < parts.tanks.length ; i++) {
            let part = parts.tanks[i]
            this.tanks.push(new Tank(i,part.weight || 0,part.name || "name", part.tankType, part.type, part.fuelWeight || 0, part.volume || 0, part.pressure || 0))
        }
        for (let i = 0 ; i < parts.shields.length ; i++) {
            let part = parts.shields[i]
            this.shields.push(new Shield(i,part.weight || 0,part.name || "name", part.capacity, part.efficiency, part.consumption))
        }
        for (let i = 0 ; i < parts.weapons.length ; i++) {
            let part = parts.weapons[i]
            this.weapons.push(new Weapon(i,part.weight || 0,part.name || "name", part.type, part.damageData))
        }
        for (let i = 0 ; i < parts.missileCargo.length ; i++) {
            let part = parts.missileCargo[i]
            this.missileCargo.push(new MissileCargo(i,part.weight || 0,part.name || "name",part.count,part.maxCount,part.missileWeight,part.missiledata))
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
        }
        document.getElementById("inputRange_speed").max = maxSpeed
        this.maxSpeed = maxSpeed
        this.capArrayA = []
        this.capArrayB = []
        for (let i = 0; i<this.capacitors.length; i++) {
            this.capArrayA.push(0)
            this.capArrayB.push(0)
        }

        //stats
        this.armor = stats.armor
        this.armorMax = stats.armor
        this.baseWeight = stats.weight

        this.maxERCSThrust = stats.ercsThrust
        this.maxERCSThrustNeg = stats.ercsThrust * (-1)

        this.surfaceArea = stats.surfaceArea
        this.size = stats.size

    }
}


let shipDefaultParts = {
    antennas: [{weight:4.7, maxSpeed:100 /* mbit */, consumptionPower:[0.00005, 0.008, 0.0048]/* MW */, consumptionFuel:[0.000001, 0.000034, 0.010]/* kg/hour*/,name:"Antenna 100Mbit Mk1", fuelType:"fuel1"}],
    batteries: [{weight:350, capacity: 0.1, /* MWh */maxDischarge:0.5 /* MWh */,name:"Battery 0.1MWh",},],
    computers: [{weight:150, memory:512 /* TB */ , cpu:{cores:256, speed:6/* GhZ */}, consumption:[0.0003,0.0018] /* MWh */,name:"Computer A100", modules:["memory","communication","fuelConsumption","navigation","display"]}],
    capacitors: [{weight:10, capacity: 0.0035, /* MWh */name:"Capacitor 3.5kWh",powerGroup:"lifeSupport"},
                {weight:10, capacity: 0.0035, /* MWh */name:"Capacitor 3.5kWh",powerGroup:"computer"},
                {weight:4, capacity: 0.0010, /* MWh */name:"Capacitor 1kWh",powerGroup:"antenna"},
                {weight:10, capacity: 0.0035, /* MWh */name:"Capacitor 3.5kWh",powerGroup:"shield"},
                {weight:10, capacity: 0.0035, /* MWh */name:"Capacitor 3.5kWh",powerGroup:"weapon"},
                {weight:10, capacity: 0.0035, /* MWh */name:"Capacitor 3.5kWh",powerGroup:"engine"},
                {weight:17, capacity: 0.0050, /* MWh */name:"Capacitor 5kWh",powerGroup:"everything"}],
    generators: [{weight:18, type:"H2FuelCell", output: 0.0113 /* MW */,defaultOn:0,efficiency:80},
        {weight:460, type:"UraniumReactor", output: 0.15 /* MW */,defaultOn:0,efficiency:85}], //
    engines: [{weight:1500, fuelType:"fuel1", type:"FTL", minSpeed:50 /* c */, thrust: 147987520000,/* MN */ maxSpeed:50*8765.812756 /* c */, consumptionFuel:[0,40,150] /* kg/h */ , consumptionPower:[0.008,0.13] /* MW*/},
        {weight:320, fuelType:"fuel1", type:"Sublight", minSpeed:0, maxSpeed:46000000/299792458 /* c */ , thrust: 0.75 /* MN */, consumptionFuel:[0,1,3] /* kg/h */ , consumptionPower:[0.0004,0.1] /* MW*/  },
        {weight:80, fuelType:"fuel1", type:"RCS", minSpeed:0,  maxSpeed:46000000/299792458 /* c */ , thrust: 0.1 /* MN */, consumptionFuel:[0,0.09,0.15] /* kg/h */ , consumptionPower:[0.00005,0.06] /* MW*/  }],
    shields: [{weight:15 ,capacity:50, efficiency:0.5 /* per sec */, consumption:[0.05,0.2] /*MWh 0-maintaining 1-charging*/}],
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
    missileCargo:[{weight:0 ,name:"Missile 100MJ",count:5,maxCount:5,missileWeight:150,missiledata:{power:1000, length:0.1,life: 30,damage:100,shieldDmgBonus:0,ignoreShield:false, speed:0.00002, color: 0x555555, maxSpeed:100000, guided:true}}],
    weapons: [{weight:250 ,type:"laser",damageData:{power:40/* MW */, length:0.01 /*seconds*/,damage:0.8,shieldDmgBonus:0,ignoreShield:false,cd:0.32 /*seconds*/,life: 4, speed:0.00002, color: 0xff0000}},{weight:70 ,type:"missile",damageData:{power:0.001/* MW */, length:0.001 /*seconds*/,cd:2 /*seconds*/,life: 30, speed:0.00002, color: 0x555555,maxSpeed:100000,guided:false}}
        //{weight:70 ,type:"missile",damageData:{power:0.001/* MW */, length:0.001 /*seconds*/,cd:2 /*seconds*/,life: 30, speed:50, color: 0x555555,maxSpeed:100000,guided:false}}
        //{weight:250 ,type:"laser",damageData:{power:40/* MW */, length:0.01 /*seconds*/,damage:0.8,shieldDmgBonus:0,ignoreShield:false,cd:0.32 /*seconds*/,life: 4, speed:0.00002, color: 0xff0000}}
        //{weight:250 ,type:"laser",damageData:{power:40/* MW */, length:0.01 /*seconds*/,damage:0.8,shieldDmgBonus:0,ignoreShield:false,cd:0.32 /*seconds*/,life: 7, speed:20000, color: 0xff0000}}
        //{weight:280 ,type:"plasma",damageData:{power:500/* MW */, length:0.0025 /*seconds*/,damage:4,shieldDmgBonus:0,ignoreShield:false,cd:1 /*seconds*/,life: 5, speed:5000, color: 0xffaa00}}
        ]
}

let shipStats = {
    armor:100, weight:5500/*kg*/, ercsThrust: 0.01/*MN*/,
    surfaceArea:128/*m2*/,size:{l:7,h:3.5,w:3.5}/*m*/ ,
}


let playerShip = new Ship(shipDefaultParts,shipStats)


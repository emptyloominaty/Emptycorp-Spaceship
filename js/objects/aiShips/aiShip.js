class AiShip {
    position = {x:0,y:0,z:0}
    positionPrecise = {x:new BigNumber(0),y:new BigNumber(0),z:new BigNumber(0)}
    positionHi = {x:0, y:0, z:0}
    positionLo = {x:0, y:0, z:0}
    hitbox = {x1:0,y1:0,z1:0,x2:0,y2:0,z2:0}
    role = "Civilian"

    yaw = 0
    targetYaw = 0
    pitch = 0
    targetPitch = 0

    speed = 0
    targetSpeed = 0
    maxSpeed = 350000

    faction = ""

    armor = 200
    armorMax = 200
    shield = 100
    shieldMax = 100
    shieldRecharge = 0.05

    rotationSpeed = 60 // °/60 per sec
    accelerationSpeed = 2000 // c/60 per sec
    weapon = {type:"laser",damageData:{power:40/* MW */, length:0.01 /*seconds*/,cd:0.32 /*seconds*/,life: 5, speed:2000, color: 0xff0000}}
    fuelTank = {type:"fuel1", capacity:500, maxCapacity:500}
    consumption = 5 // kg per ly
    consumptionC = 5/8765.812756 //kg per c

    cargo = {max:50000,val:0,items:[]}  //items:[{name:itemName, val:5000, weight:5000,}]

    credits = 0

    //ai
    target = {}
    targetType = ""  //system,ship,point
    nearTarget = false
    destroyed = false
    task = "stop" // stop,refuel,attack,fuel,trade,home,
    prevTask = "stop"
    refuel = false

    tradeTodo = [] // [{do:"buy", item:"steel", amount:500, systemId:1},{do:"sell", item:"steel", amount:250, systemId:0},{do:"sell", item:"steel", amount:250, systemId:5}]
    currentTrade = {} //{do:"buy", item:"steel", amount:500, systemId:1}

    run() {
        if (this.destroyed) {
            return false
        }
        this.hitbox = calcHitbox(this.position.x,this.position.y,this.position.z,0.0001)
        if (this.shield<this.shieldMax) {
            this.shield+=this.shieldRecharge/gameFPS
        }
        let consNow = (this.consumptionC*this.speed/3600)/gameFPS
        if (this.nearTarget) {
            if (this.targetType==="system") {
                this.inSystem()
            }
        }
        if (this.task==="stop") {
            this.targetSpeed = 0
        } else if (this.task==="trade") {
            this.doTrade()
        }
        this.accelerate()
        this.navigate()
        this.rotate()
        this.move()
        if(this.fuelTank.capacity<this.fuelTank.maxCapacity/4) {
            if(!this.refuel && this.task!=="attack" && this.task!=="flee") {
                this.changeTarget(this.findRefuelStation(),"system",true)
                this.refuel = true
            }
        }
        this.fuelTank.capacity -= consNow
        return true
    }

    runMinute() {
        this.transferCredits()
    }

    accelerate() {
        if (this.targetSpeed>this.speed) {
            this.speed += (this.targetSpeed+(this.targetSpeed-this.speed))/gameFPS
        } else if (this.targetSpeed<this.speed) {
            this.speed -= this.speed/20
        }
        if (this.speed>this.maxSpeed) {
            this.speed = this.maxSpeed
        }
        if (this.speed<0.0000000000000000001) {
            this.speed = 0
        }
    }

    rotate() {
        if (this.targetYaw>this.yaw) {
            this.yaw+=this.rotationSpeed/gameFPS
        } else if (this.targetYaw<this.yaw) {
            this.yaw-=this.rotationSpeed/gameFPS
        }
        //pitch
        if (this.targetPitch>this.pitch) {
            this.pitch+=this.rotationSpeed/gameFPS
        } else if (this.targetPitch<this.pitch) {
            this.pitch-=this.rotationSpeed/gameFPS
        }
    }

    doTrade() {
        if (Object.keys(this.currentTrade).length===0) {
            if (this.tradeTodo.length>0) {
                this.currentTrade = Object.assign({}, this.tradeTodo[0])
                this.changeTarget(starSystems[this.currentTrade.systemId],"system",true)
                this.tradeTodo.shift()
            } else {
                this.task = "stop"
            }
        } else {

        }
    }

    inSystem() {
        if(this.task==="refuel") {
            let amount = this.fuelTank.maxCapacity-this.fuelTank.capacity
            let cr = this.target.resources[this.fuelTank.type].price*amount
            this.credits -= cr
            this.fuelTank.capacity += this.target.buy(this.fuelTank.type,amount,cr)
            this.refuel = false
            this.task = this.prevTask
            this.changeTarget("","",true)
        } else if (this.task==="trade") {
            //{max:50000,val:0,items:[]}  //items:[{name:itemName, val:5000, weight:5000,}]
            //{do:"buy", item:"steel", amount:500, systemId:1}
            if (this.currentTrade.do==="buy") {
                //buy
                let amount = this.currentTrade.amount
                let item = this.currentTrade.item
                let id = this.currentTrade.systemId
                let cr = this.target.resources[item].price*amount
                this.credits -= cr

                let bought = starSystems[id].buy(item,amount,cr)

                let itemId = this.cargo.items.findIndex(x => x.name === item)
                if (itemId===undefined || itemId===-1) {
                    this.cargo.items.push({name:item, val:bought, weight: bought}) //TODO: WEIGHT FOR GASSES
                } else {
                    this.cargo.items[itemId].val+=bought
                    this.cargo.items[itemId].weight+=bought //TODO: WEIGHT FOR GASSES
                }
                this.cargo.val+=bought //TODO: WEIGHT FOR GASSES


                this.currentTrade = {}
            } else if (this.currentTrade.do==="sell"){
                //sell
                let amount = this.currentTrade.amount
                let item = this.currentTrade.item
                let id = this.currentTrade.systemId
                this.credits += starSystems[id].sell(item,amount)

                let itemId = this.cargo.items.findIndex(x => x.name === item)
                this.cargo.items[itemId].val-=amount
                this.cargo.items[itemId].weight-=amount //TODO: WEIGHT FOR GASSES
                this.cargo.val-=amount //TODO: WEIGHT FOR GASSES

                this.currentTrade = {}
            }

        }
    }

    goHome() {
        this.task = "home"
        this.changeTarget(starSystems[this.home],"system",true)
    }

    navigate() {
        if (Object.keys(this.target).length!==0) {
            let a = this.target.position.x - this.position.x //x1 - x2
            let b = this.target.position.y - this.position.y //y1 - y2
            let c = this.target.position.z - this.position.z //z1 - z2
            let distanceToObject = Math.sqrt( a*a + b*b + c*c )

            let angleYaw = ((((Math.atan2( this.position.y - this.target.position.y, this.position.x - this.target.position.x ) * 180)) / Math.PI))-270
            angleYaw = angleYaw*(-1)
            /*angleYaw = angleYaw % 360
            if (angleYaw < 0) {
                angleYaw += 360
            }*/
            //angleYaw = 360-angleYaw
            let anglePitch = Math.atan2(c,Math.sqrt(b * b + a * a))
            anglePitch = (((anglePitch)*57.2957795))

            this.targetYaw = angleYaw
            this.targetPitch = anglePitch
            this.setTargetSpeed(distanceToObject)
        }
    }

    setTargetSpeed(distanceToObject) {
        if (this.targetType==="system") {
            this.targetSpeed = this.maxSpeed
            if (distanceToObject<0.15) {
                this.targetSpeed = 0
                this.nearTarget = true
            } else {
                this.nearTarget = false
            }
        } else if (this.targetType==="ship" || this.targetType==="point" || this.targetType==="")  {
            if (distanceToObject<0.0000000000105702341) {
                this.targetSpeed = 0
                this.nearTarget = true
            } else if (distanceToObject<0.0001) {
                this.targetSpeed = (distanceToObject*10000000)
                this.nearTarget = false
            } else if (distanceToObject<0.0003) {
                this.targetSpeed = 2000
                this.nearTarget = false
            } else if (distanceToObject<0.001) {
                this.targetSpeed = 10000
                this.nearTarget = false
            } else if (distanceToObject<0.005) {
                this.targetSpeed = 40000
                this.nearTarget = false
            } else {
                this.targetSpeed = this.maxSpeed
                this.nearTarget = false
            }
        }
    }

    findRefuelStation() {
        let systems = sortAllSystemsByDistance(this,this.position,starSystems)
        let maxDistance = this.fuelTank.capacity/this.consumption
        let prices = []
        for (let i = 0; i<systems.length; i++) {
            if(systems[i].distance>maxDistance){
                break
            }
            if (starSystems[systems[i].id].resources[this.fuelTank.type]!==undefined && systems[i].distance<maxDistance) {
                let relations = factionList[this.faction].relations[starSystems[systems[i].id].faction] //TODO:TEST
                if (relations>-25) {
                    let res = starSystems[systems[i].id].resources[this.fuelTank.type]
                    if (res.val>this.fuelTank.maxCapacity) {
                        let totalPrice = (res.price*this.fuelTank.maxCapacity)+((systems[i].distance/this.consumptionC)*res.price)
                        prices.push({id:systems[i].id, distance:systems[i].distance, price:res.price, amount:res.val, totalPrice:totalPrice})
                    }
                }
            }
        }
        prices = prices.sort((a, b) => a.totalPrice > b.totalPrice ? 1 : -1)
        this.prevTask = this.task
        this.task = "refuel"
        return starSystems[prices[0].id]
    }

    getDamage(damage,shieldDmgBonus,ignoreShield = false) {
        shieldDmgBonus = 1+(shieldDmgBonus/100)
        //shield
        if (!ignoreShield) {
            if(this.shield>damage*shieldDmgBonus) {
                this.shield -= damage*shieldDmgBonus
                damage = 0
            } else if (this.shield>0) {
                damage -= this.shield/shieldDmgBonus
                this.shield = 0
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
        if(damage>0) {
            this.destroyed = true
        }
    }

    move() {

            //threads[threadIdx].worker.postMessage({do:"move", yaw:aiShips[1].yaw, pitch:aiShips[1].pitch, speed:aiShips[1].speed, fps:gameFPS, positionPrecise:aiShips[1].positionPrecise, position:aiShips[1].position, positionLo: aiShips[1].positionLo, positionHi: aiShips[1].positionHi})
       /*    let postMsgData = {do:"move",id:this.id, yaw:this.yaw, pitch:this.pitch, speed:this.speed, fps:gameFPS, positionPrecise:this.positionPrecise, position:this.position, positionLo: this.positionLo, positionHi: this.positionHi}
            //postMsgData = JSON.parse(JSON.stringify(postMsgData))
            threads[threadIdx].worker.postMessage(postMsgData)*/
       // threadIdx++
       /* if (threadIdx>threads.length-1) {
            threadIdx = 0
        }*/

        let speedInlyh = this.speed/8765.812756
        let speed = speedInlyh/3600/gameFPS

        let angleInRadianYaw = (this.yaw*Math.PI) / 180
        let angleInRadianPitch = (this.pitch*Math.PI) / 180

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
        this.positionHi.z = ((this.positionPrecise.z.toNumber().toPrecision(12)))

        this.positionLo.x = this.positionPrecise.x.minus(this.positionHi.x).toNumber()
        this.positionLo.y = this.positionPrecise.y.minus(this.positionHi.y).toNumber()
        this.positionLo.z = this.positionPrecise.z.minus(this.positionHi.z).toNumber()
    }

    changeTarget(obj,type,resetNear = true) {
        this.target = obj
        this.targetType = type
        if(resetNear) {
            this.nearTarget = false
        }
    }

    transferCredits() {
        factionList[this.faction].credits += this.credits
        this.credits = 0
    }

    constructor(x,y,z,role,faction,rotSpeed,accSpeed,weapon,fuelTank,consumption,armor,shield,shieldRecharge,home,shipDesign) {
        this.positionPrecise.x = new BigNumber(x+0.0000000515648966666622154)
        this.positionPrecise.y = new BigNumber(y)
        this.positionPrecise.z = new BigNumber(z)
        this.role = role
        this.faction = faction
        this.rotationSpeed = rotSpeed
        this.accelerationSpeed = accSpeed
        this.weapon = weapon
        this.fuelTank = fuelTank
        this.consumption = consumption
        this.consumptionC = consumption/8765.812756
        this.armor = armor
        this.armorMax = armor
        this.shield = shield
        this.shieldMax = shield
        this.shieldRecharge = shieldRecharge
        this.home = home
        factionList[this.faction].ships[role].push(this)
        this.id = aiShips.length


    }
}

let aiShips = []

let aiShipsRun = function() {
    for (let i = 0; i<aiShips.length; i++) {
        if (aiShips[i]!==undefined) {
            let destroy = aiShips[i].run()
            aiShips[i].run2()
            aiShips[i].runMinute() //TODO
            if (!destroy) {
                if (playerShip.computers[0].targetObj===aiShips[i]) {playerShip.computers[0].targetObj={};playerShip.computers[0].target=""}
                shipWindow3D.scene.remove(shipWindow3D.ships[i])
                shipWindow3D.ships[i] = undefined
                aiShips[i]=undefined
            }
        }
    }
}

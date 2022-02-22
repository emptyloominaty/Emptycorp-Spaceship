class StarSystem {
    name = ""
    stars = []
    planets = []
    asteroids = []
    servers = []
    prices = {}
    resources = {}
    mapSize = 15
    position = {x:0,y:0,z:0}

    timeServerAddress = false
    popGrow = false
    building = false

    totalPopulation = 0
    totalWorkers = 0
    unemployment = 0

    faction = ""
    factionColor = "#999999"

    resourcesNeed = []
    producing = []
    factories = []

    credits = 1000000

    run() {

    }

    runMinute(avgFPS) {
        if (Object.keys(this.resources).length>0) {
            this.produceResources(avgFPS)
            this.popUseResources(avgFPS)
            this.checkResources()
            this.assignTrades()
            this.transferCredits()

            Object.keys(this.resources).forEach(key => {
                this.prices[key] = Math.round(this.resources[key].price*10000)/10000
            })

            this.updatePop()

            if (this.prosperity<0.5) {
                this.prosperity+=0.01*(0.5-this.prosperity)
            } else if (this.prosperity<0.1) {
                this.prosperity = 0.1
            } else if (this.prosperity>2) {
                this.prosperity-=0.01*this.prosperity
            }

            this.buildNewFactories()
            this.updateGalaxyData()
        }
    }

    updateGalaxyData() {
        Object.keys(this.resources).forEach(key => {
            if (galaxy.priceHistory[this.id][key]===undefined) {
                galaxy.priceHistory[this.id][key] = []
            }
            let amount = this.resources[key].val
            let price = this.resources[key].price
            galaxy.priceHistory[this.id][key].push({price:price, amount:amount, time:gameTime})
            if ( galaxy.priceHistory[this.id][key].length>100) {
                galaxy.priceHistory[this.id][key].shift()
            }
        })
    }

    buildNewFactories() {
        if (!this.building) {
            if (this.unemployment>2) {
                let fNames = ["electronics","steel","medicine"]
                let name = fNames[Math.floor(Math.random()*2.99)]
                let size = (this.totalWorkers*(this.unemployment/100)) / factories[name].peopleNeed
                if (size>10) {size=10}
                let f = factories.buildFactory(name,size)
                Object.keys(f.buildResources).forEach(key => {
                    if (f!==false)  {
                        if (this.resources[key].val>f.buildResources[key]) {
                            this.resources[key].val -= f.buildResources[key]
                        } else {
                            f = false
                        }
                    }
                })
                if (f!==false) {
                    this.factories.push(f)
                    //console.log("Building New Factory name:"+f.name+" size:"+f.size+" id:"+(this.factories.length-1))
                }
            }
        }
    }


    updatePop() {
        if (this.totalPopulation>0) {
            if (this.popGrow) {
                for (let i = 0; i < this.planets.length; i++) {
                    if (this.planets[i].population > 0) {
                        if (((this.planets[i].habitability * this.planets[i].radius) * 160000) > this.planets[i].population) {
                            this.planets[i].population += Math.round(1000 * Math.random())
                        }
                    }
                    for (let j = 0; j < this.planets[i].moons.length; j++) {
                        if (this.planets[i].moons[j].population > 0) {
                            if (((this.planets[i].moons[j].habitability * this.planets[i].moons[j].radius) * 160000) > this.planets[i].moons[j].population) {
                                this.planets[i].moons[j].population += Math.round(1000 * Math.random())
                            }
                        }
                    }
                }
                for (let i = 0; i < this.asteroids.length; i++) {
                    if (this.asteroids[i].population > 0) {
                        if (((this.asteroids[i].habitability * this.asteroids[i].radius) * 160000) > this.asteroids[i].population) {
                            this.asteroids[i].population += Math.round(100 * Math.random())
                        }
                    }

                }
            } else {
                for (let i = 0; i < this.planets.length; i++) {
                    this.planets[i].population -= Math.round(1000 * Math.random())
                    if (this.planets[i].population < 0) {
                        this.planets[i].population = 0
                    }
                    for (let j = 0; j < this.planets[i].moons.length; j++) {
                        this.planets[i].moons[j].population -= Math.round(1000 * Math.random())
                        if (this.planets[i].moons[j].population < 0) {
                            this.planets[i].moons[j].population = 0
                        }
                    }
                }
                for (let i = 0; i < this.asteroids.length; i++) {
                    this.asteroids[i].population -= Math.round(100 * Math.random())
                    if (this.asteroids[i].population < 0) {
                        this.asteroids[i].population = 0
                    }
                }
            }

            this.totalPopulation = 0
            for (let i = 0; i < this.planets.length; i++) {
                this.totalPopulation += this.planets[i].population
                for (let j = 0; j < this.planets[i].moons.length; j++) {
                    this.totalPopulation += this.planets[i].moons[j].population
                }
            }
            for (let i = 0; i < this.asteroids.length; i++) {
                this.totalPopulation += this.asteroids[i].population
            }
            this.totalWorkers = this.totalPopulation * 0.4
        }
    }

    transferCredits() {
        this.prosperity += this.credits/1000000000
        factionList[this.faction].credits += this.credits
        this.credits = 0
    }

    popUseResources(avgFPS) {
        if (this.totalPopulation>0) {
            let mul = 60/avgFPS
            let pop = this.totalPopulation/1000000
            this.resources.water.val -= (pop*69.4)*mul
            this.resources.food.val -= (pop*0.694)*mul
            this.resources.medicine.val -= (pop*0.07)*mul
            this.resources.electronics.val -= (pop*0.01)*mul

            this.resources.steel.val -= (pop*0.02)*mul
            this.resources.polymer.val -= (pop*0.07)*mul

            this.resources.O2.val -= (pop*381.94)*mul
            this.resources.deuterium.val -= (pop*0.001)*mul
            this.resources.uranium.val -= (pop*0.0001)*mul
            this.resources.fuel1.val -= (pop*0.001)*mul

            //
            this.credits += (pop*this.prosperity)*mul

        }
    }


    produceResources(avgFPS) {
        let mul = 60/avgFPS

        let prodNeed = []
        let prodTotalNeed = 0
        let factNeed = []
        let factTotalNeed = 0


        for (let i = 0; i<this.producing.length; i++) {
            prodNeed.push(this.producing[i].peopleNeed)
            prodTotalNeed += this.producing[i].peopleNeed
        }
        for (let i = 0; i<this.factories.length; i++) {
            factNeed.push(this.factories[i].peopleNeed)
            factTotalNeed += this.factories[i].peopleNeed
        }


        let unemployed = this.totalWorkers - prodTotalNeed - factTotalNeed
        let emRatio = 1
        if (unemployed<0) {
            emRatio = this.totalWorkers / (this.totalWorkers + (unemployed*(-1)))
        }

        //console.log(unemployed)
        //console.log(emRatio)
        //console.log("------------")
        let prodMul = []
        let factMul = []

        for (let i = 0; i<this.producing.length; i++) {
            prodMul.push(emRatio)
        }
        for (let i = 0; i<this.factories.length; i++) {
            factMul.push(emRatio)
        }



        for (let i = 0; i<this.producing.length; i++) {
            this.resources[this.producing[i].name].val += this.producing[i].amount*mul*prodMul[i]
        }
        for (let i = 0; i<this.factories.length; i++) {
            if (this.factories[i].built) {
                let useA = this.factories[i].amount*this.factories[i].ratio*mul*factMul[i]
                let useB = this.factories[i].amount/this.factories[i].ratio*mul*factMul[i]
                let matA = this.factories[i].input[0]
                let matB = this.factories[i].input[1]

                if (this.resources[matA].val>useA && this.resources[matB].val>useB) {
                    this.resources[matA].val-= useA
                    this.resources[matB].val-= useB

                    this.resources[this.factories[i].name].val += this.factories[i].amount*mul*factMul[i]
                }
            } else {
                //building factory
                this.factories[i].timeB += mul
                if (this.factories[i].timeB>=this.factories[i].time) {
                    this.factories[i].built = true
                }
            }
        }
        this.unemployment = ((this.totalWorkers-(prodTotalNeed + factTotalNeed))/this.totalPopulation)*100 //%
        if (this.unemployment<0) {this.unemployment=0}
    }

    checkResources() {
        Object.keys(this.resources).forEach(key => {
            let ratio = this.resources[key].val/this.resources[key].max
            this.resources[key].ratio = ratio
            //idk
            if (ratio>this.resources[key].ratios[2]) {
                this.resources[key].buying = false
                this.resources[key].selling = true
                //remove buy offer
                if (this.resources[key].need!==undefined) {
                    this.resourcesNeed[this.resources[name].need] = undefined
                    this.resources[name].need = undefined
                }
            } else if (ratio>this.resources[key].ratios[1]) {
                this.resources[key].buying = true
                this.resources[key].selling = true
            } else if (ratio>this.resources[key].ratios[0]){
                this.resources[key].buying = true
                this.resources[key].selling = true
            } else {
                this.resources[key].buying = true
                this.resources[key].selling = false
            }

            //create buy offer for resource
            if (this.resources[key].need!==undefined && ratio<this.resources[key].ratios[1]) {
                let amount = (this.resources[key].val*(this.resources[key].ratios[2]-ratio))
                let done = false
                for (let i = 0; i < this.resourcesNeed.length; i++) {
                    if (this.resourcesNeed[i] === undefined) {
                        this.resourcesNeed[this.resourcesNeed.length] = {name:this.resources[key].name, amount:amount, maxPrice:this.resources[key].price}
                        this.resources[key].need = i
                        done = true
                        break
                    }
                }
                if (!done) {
                    this.resourcesNeed[this.resourcesNeed.length] = {name:this.resources[key].name, amount:amount, maxPrice:this.resources[key].price}
                    this.resources[key].need = this.resourcesNeed.length
                }
            }

            //increase price
            if (ratio<this.resources[key].ratios[1]) {
                this.resources[key].maxPrice = this.resources[key].price/((1-this.resources[key].ratios[1])+ratio)
                this.resourcesNeed[this.resources[key].need] = this.resources[key].maxPrice
            }

            this.popGrow = true
            if (this.resources[key].val<0) {
                this.popGrow = false
                this.prosperity-=0.00000001 * ((this.resources[key].val*(-1))*this.resources[key].price)
                this.resources[key].val=0
            }
            this.updateSellingPrice(key,ratio)
        })
    }
    
    updateSellingPrice(name,ratio) {
        let rr = (1-this.resources[name].ratios[2])*(-1)
        ratio = 0.4+ratio+rr
        if (ratio>4) {ratio = 4}
        if (ratio<0.15) {ratio = 0.15}
        this.resources[name].price = globalPrices[name]/(ratio)
    }

    buy(name,amount,credits) { //system->ship
        this.prosperity += 0.001*(credits/100000)
        this.credits += credits
        this.resources[name].val -= amount
        return amount
    }

    sell(name,amount) { //ship->system
        let credits
        this.resources[name].val += amount
        if (this.resources[name].need!==undefined && this.resourcesNeed[this.resources[name].need]!==undefined) {
            this.resourcesNeed[this.resources[name].need].amount -= amount
            if (this.resourcesNeed[this.resources[name].need].amount<0) {
                this.resourcesNeed[this.resources[name].need] = undefined
                this.resources[name].need = undefined
            }
        }
        credits = amount*this.resources[name].price
        this.credits -= credits
        this.prosperity += 0.001*(credits/100000)
        return credits
    }

    assignTrades() {
        let needResources = []
        //which resources does this system need
        Object.keys(this.resources).forEach(key => {
            let res = this.resources[key]
            if (res.ratio<res.ratios[2]+0.4) {
                //this.resources[key].val/this.resources[key].max
                let needAmount = this.resources[key].max-this.resources[key].val
                if (needAmount>100) {
                    needResources.push({ratio:res.ratio, price:res.price, name:key, amount:needAmount})
                }
            }
        })
        needResources = needResources.sort((a, b) => a.ratio> b.ratio ? 1 : -1)
        //check prices in other systems
        for (let a = 0; a<needResources.length; a++) {
            let minPrice = 10000000000
            let idMinPrice = 0
            //TODO:Distance let systems = sortAllSystemsByDistance(this,this.position,starSystems)
            for (let i = 0; i<starSystems.length; i++) {
                if (i===this.id) {
                    continue
                }
                let relations = factionList[this.faction].relations[starSystems[i].faction] //TODO: TEST
                if(relations>-25) {
                    if (starSystems[i].resources[needResources[a].name]!==undefined) {
                        if (starSystems[i].resources[needResources[a].name].price<minPrice) {
                            idMinPrice = i
                            minPrice = starSystems[i].resources[needResources[a].name].price
                        }
                    }
                }
            }
            //lower price
            needResources[a].systemId = idMinPrice
            let res = this.resources[needResources[a].name]
            if(res.ratio>=res.ratios[1]) {
                if (minPrice*1.05>=this.resources[needResources[a].name].price) {
                    needResources[a] = undefined
                }
            } else if(res.ratio<res.ratios[0]) {
                if (minPrice>=this.resources[needResources[a].name].price) {
                    needResources[a] = undefined
                }
            } else if(res.ratio<res.ratios[1]) {
                if (minPrice*1.01>=this.resources[needResources[a].name].price) {
                    needResources[a] = undefined
                }
            }



        }
        //assign ship
        let n = 0
        let error = 0
        for (let i = 0; i<factionList[this.faction].ships["Trade"].length; i++) {
            let ship = factionList[this.faction].ships["Trade"][i]
            if (ship.task==="stop" || ship.task==="home") {

                if (needResources[n]===undefined) {
                    n++
                    error++
                    if (error>10) {
                        break
                    }
                    continue
                }
                error = 0

                let shipCargoAmount = ship.cargo.max-ship.cargo.val
                let shipCargoLeft =  ship.cargo.max-ship.cargo.val
                let amount = needResources[n].amount
                let am = amount
                if (shipCargoAmount<amount) {
                    shipCargoLeft = 0
                    amount = shipCargoAmount
                    am = shipCargoAmount
                    needResources[n].amount-=shipCargoAmount
                } else {
                    shipCargoLeft = shipCargoAmount-amount
                    am = amount
                    amount-=shipCargoAmount

                }
                //console.log("assigned: "+i+" for:"+n+" - "+needResources[n].name+" ( from "+needResources[n].systemId+" to "+this.id+" )"+" amount:"+am)
                ship.tradeTodo.push({do:"buy", item:needResources[n].name, amount:am, systemId:needResources[n].systemId})
                ship.tradeTodo.push({do:"sell", item:needResources[n].name, amount:am, systemId:this.id})
                ship.task = "trade"
                if(amount<1) {
                    n++
                } else if (Math.random()>0.5) {
                    n++
                }
            }
        }


    }



    constructor(stars,planets,asteroids,faction,prices,resources,name,position,servers,factories,naturalResources,prosperity,mapSize = 15) {
        this.stars = stars
        this.planets = planets
        this.asteroids = asteroids
        this.servers = servers
        this.id = starSystems.length

        this.faction = faction
        this.factionColor = factionList[faction].color
        this.prices = prices
        this.resources = resources

        this.naturalResources = naturalResources
        this.factoryResources = factories

        this.name = name
        this.mapSize = mapSize
        this.position = position
        this.prosperity = prosperity
        //TODO:planets,moons positions
        for (let i = 0; i<planets.length; i++) {
            planets[i].system = this.name
            planets[i].position.x = this.position.x
            planets[i].position.y = this.position.y+(planets[i].orbitHeight/946052840000)+0.1
            planets[i].position.z = this.position.z
            for (let j = 0; j<planets[i].moons.length; j++) {
                planets[i].moons[j].position.x = planets[i].position.x
                planets[i].moons[j].position.y = planets[i].position.y+(planets[i].moons[j].orbitHeight/9460528400000)
                planets[i].moons[j].position.z = planets[i].position.z
            }
        }

        //population
        for (let i = 0; i<planets.length; i++) {
            this.totalPopulation += planets[i].population
            for (let j = 0; j<planets[i].moons.length; j++) {
                this.totalPopulation += planets[i].moons[j].population
            }
        }
        for (let i = 0; i<asteroids.length; i++) {
            this.totalPopulation+=asteroids[i].population
        }
        this.totalWorkers = this.totalPopulation*0.4

        //TODO:function updateFactories()
        this.producing = naturalResources
        this.factories = factories

        //servers
        for (let i = 0; i<servers.length; i++) {
           if (servers[i].type==="time") {
               this.timeServerAddress = servers[i].myAddress
           }
        }

        galaxy.priceHistory[this.id] = {}

    }
}
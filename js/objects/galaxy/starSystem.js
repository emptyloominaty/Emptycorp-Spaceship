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

    totalPopulation = 0
    faction = ""
    factionColor = "#999999"

    resourcesNeed = [] // {name:"H2",amount:500,maxPrice:0.002}
    producing = [] //{name:"H2",amount:1/* per minute */}
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
        }
    }

    transferCredits() {
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
        for (let i = 0; i<this.producing.length; i++) {
            this.resources[this.producing[i].name].val += this.producing[i].amount*mul
            //console.log(this.producing[i].name," +",this.producing[i].amount*mul )
        }
        for (let i = 0; i<this.factories.length; i++) {
            let useA = this.factories[i].amount*this.factories[i].ratio*mul
            let useB = this.factories[i].amount/this.factories[i].ratio*mul
            let matA = this.factories[i].input[0]
            let matB = this.factories[i].input[1]

            if (this.resources[matA].val>useA && this.resources[matB].val>useB) {
                this.resources[matA].val-= useA
                this.resources[matB].val-= useB
                //console.log(matA," -",useA )
                //console.log(matB," -",useB )

                this.resources[this.factories[i].name].val += this.factories[i].amount*mul
                //console.log(this.factories[i].name," +",this.factories[i].amount*mul )
            }

        }

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
            this.updateSellingPrice(key,ratio)
        })
    }
    
    updateSellingPrice(name,ratio) {
        let rr = (1-this.resources[name].ratios[2])*(-1)
        ratio = 0.4+ratio+rr
        if (ratio>1.4) {ratio = 1.4}
        this.resources[name].price = globalPrices[name]/(ratio)
        //console.log(name," ",this.resources[name].price,"cr global:", globalPrices[name]," (",ratio," ratio)")
    }

    buy(name,amount,credits) { //system->ship
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
        //TODO:function updateFactories()
        for (let i = 0; i<naturalResources.length; i++) {
            if (naturalResources[i].producing) {
                this.producing.push({name:naturalResources[i].name, amount:naturalResources[i].amount})
            }
        }
        for (let i = 0; i<factories.length; i++) {
            if (factories[i].producing) {
                this.factories.push({name:factories[i].name, amount:factories[i].amount, input:factories[i].input, ratio:factories[i].ratio})
            }
        }

    }
}
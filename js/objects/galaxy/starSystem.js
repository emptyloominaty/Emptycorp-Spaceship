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

    run() {

    }


    produceResources() { //TODO:every min
        for (let i = 0; i<this.producing.length; i++) {
            this.resources[this.producing[i].name] += this.producing[i].amount
        }
    }

    checkResources() { //TODO:every min
        Object.keys(this.resources).forEach(key => {
            let ratio = this.resources[key].max/this.resources[key].val
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
        ratio = 0.3+ratio
        if (ratio>1) {ratio = 1}
        this.resources[name] = this.resources[name].price/(ratio)
    }

    buy(name,amount,credits) { //system->ship
        //TODO:credits
        this.resources[name].val -= Math.round(amount)


        return amount
    }

    sell(name,amount) { //ship->system
        let credits
        this.resources[name].val += Math.round(amount)
        if (this.resources[name].need!==undefined && this.resourcesNeed[this.resources[name].need]!==undefined) {
            this.resourcesNeed[this.resources[name].need].amount -= amount
            if (this.resourcesNeed[this.resources[name].need].amount<0) {
                this.resourcesNeed[this.resources[name].need] = undefined
                this.resources[name].need = undefined
            }
        }
        credits = this.resources[name].val*this.resources[name].price
        return credits
    }


    constructor(stars,planets,asteroids,faction,prices,resources,name,position,servers,mapSize = 15) {
        this.stars = stars
        this.planets = planets
        this.asteroids = asteroids
        this.servers = servers

        this.faction = faction
        this.factionColor = factionList[faction].color
        this.prices = prices
        this.resources = resources
        this.name = name
        this.mapSize = mapSize
        this.position = position
        for (let i = 0; i<planets.length; i++) {
            this.totalPopulation += planets[i].population
            for (let j = 0; j<planets[i].moons.length; j++) {
                this.totalPopulation += planets[i].moons[j].population
            }
        }
        for (let i = 0; i<asteroids.length; i++) {
            this.totalPopulation+=asteroids[i].population
        }
    }
}
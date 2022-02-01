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

    produceResources() {
        for (let i = 0; i<this.producing.length; i++) {
            this.resources[this.producing[i].name] += this.producing[i].amount
        }
    }

    checkResources() {
        Object.keys(this.resources).forEach(key => {
            console.log(key, this.resources[key])
            let ratio = this.resources[key].max/this.resources[key].val
            if (ratio>this.resources[key].ratios[2]) {
                this.resources[key].buying = false
                this.resources[key].selling = true
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

        })
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
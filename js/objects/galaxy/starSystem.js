class StarSystem {
    name = ""
    stars = []
    planets = []
    asteroids = []
    servers = []
    prices = {}
    mapSize = 15
    position = {x:0,y:0,z:0}

    totalPopulation = 0
    faction = ""
    factionColor = "#999999"
    constructor(stars,planets,asteroids,faction,prices,name,position,servers,mapSize = 15) {
        this.stars = stars
        this.planets = planets
        this.asteroids = asteroids
        this.servers = servers

        this.faction = faction
        this.factionColor = factionList[faction].color
        this.prices = prices
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
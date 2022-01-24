class StarSystem {
    name = ""
    stars = []
    planets = []
    asteroids = []
    prices = {}
    mapSize = 15
    position = {x:0,y:0,z:0}

    totalPopulation = 0
    faction = ""
    factionColor = "#999999"
    constructor(stars,planets,asteroids,faction,prices,name,position,mapSize = 15) {
        this.stars = stars
        this.planets = planets
        this.asteroids = asteroids

        this.faction = faction
        this.factionColor = factionList[faction].color
        this.prices = prices
        this.name = name
        this.mapSize = mapSize
        this.position = position
    }
}
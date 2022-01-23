class StarSystem {
    stars = []
    planets = []
    asteroids = []
    prices = {}

    totalPopulation = 0
    faction = ""
    factionColor = "#999999"
    constructor(stars,planets,asteroids,faction,prices) {
        this.stars = stars
        this.planets = planets
        this.asteroids = asteroids

        this.faction = faction
        this.factionColor = factionList[faction].color
        this.prices = prices
    }
}
class StarSystem {
    stars = []
    planets = []
    asteroids = []

    totalPopulation = 0
    faction = ""
    factionColor = "#999999"
    constructor(stars,planets,asteroids,faction) {
        //stars
        for(let i = 0; i<stars.length; i++) {
            this.stars.push(new Star(stars[i]))
        }
        //planets
        for(let i = 0; i<planets.length; i++) {
            this.planets.push(new Planet(planets[i]))
        }
        //asteroids
        for(let i = 0; i<asteroids.length; i++) {
            this.asteroids.push(new Asteroid(asteroids[i]))
        }
        this.faction = faction
        this.factionColor = factionList[faction]

    }
}
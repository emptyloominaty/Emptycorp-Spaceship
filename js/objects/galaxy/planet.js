class Planet extends CelestialBody {
    moons = []
    population = 0
    faction = ""
    constructor(name,x,y,z,type,radius,mass,atmosphere,atmoshperePressure,atmosphereTemperature,atmosphereGasses,atmosphereHeight,gravity,orbitHeight,population,faction,moons) {
        super(name,x,y,z,type,radius,mass,atmosphere,atmoshperePressure,atmosphereTemperature,atmosphereGasses,atmosphereHeight,gravity,orbitHeight)
        this.population = population
        this.faction = faction
        //moons
        for(let i = 0; i<moons.length; i++) {
            this.moons.push(new Moon(moons[i]))
        }
        //TODO:SERVERS
    }

}
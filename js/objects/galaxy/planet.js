class Planet extends CelestialBody {
    moons = []
    population = 0
    faction = ""
    constructor(name,x,y,z,type,radius,mass,atmosphere,atmoshperePressure,atmosphereTemperature,atmosphereGasses,atmosphereHeight,gravity,orbitHeight,population,faction,moons) {
        super(name,x,y,z,type,radius,mass,atmosphere,atmoshperePressure,atmosphereTemperature,atmosphereGasses,atmosphereHeight,gravity,orbitHeight)
        this.population = population
        this.faction = faction
        this.moons = moons
    }

}
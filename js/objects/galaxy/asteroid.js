class Asteroid extends CelestialBody {
    constructor(name,x,y,z,type,radius,mass,atmosphere,atmoshperePressure,atmosphereTemperature,atmosphereGasses,atmosphereHeight,gravity,orbitHeight,population,faction) {
        super(name,x, y, z, type, radius, mass, atmosphere, atmoshperePressure, atmosphereTemperature, atmosphereGasses, atmosphereHeight, gravity, orbitHeight)
        this.population = population
        this.faction = faction
    }
}
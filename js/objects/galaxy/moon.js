class Moon extends CelestialBody {
    constructor(name,x,y,z,type,radius,mass,atmosphere,atmoshperePressure,atmosphereTemperature,atmosphereGasses,atmosphereHeight,gravity,orbitHeight,population,faction,habitability,planetColor) {
        super(name,x, y, z, type, radius, mass, atmosphere, atmoshperePressure, atmosphereTemperature, atmosphereGasses, atmosphereHeight, gravity, orbitHeight)
        this.population = population
        this.faction = faction
        this.habitability = habitability
        this.planetColor = planetColor
    }
}
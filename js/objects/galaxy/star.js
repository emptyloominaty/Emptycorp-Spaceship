class Star extends CelestialBody {
    faction = ""
    constructor(name,x,y,z,type,radius,mass,atmosphere,atmoshperePressure,atmosphereTemperature,atmosphereGasses,atmosphereHeight,gravity,orbitHeight,faction) {
        super(name,x, y, z, type, radius, mass, atmosphere, atmoshperePressure, atmosphereTemperature, atmosphereGasses, atmosphereHeight, gravity, orbitHeight)
        this.faction = faction
    }
}
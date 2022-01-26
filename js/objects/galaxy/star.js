class Star extends CelestialBody {
    faction = ""
    starType = ""
    constructor(name,x,y,z,type,radius,mass,atmosphere,atmoshperePressure,atmosphereTemperature,atmosphereGasses,atmosphereHeight,gravity,orbitHeight,faction,starType = "Class G") {
        super(name,x, y, z, type, radius, mass, atmosphere, atmoshperePressure, atmosphereTemperature, atmosphereGasses, atmosphereHeight, gravity, orbitHeight)
        this.faction = faction
        this.starType = starType
    }
}
class CelestialBody {
    position = {x:0, y:0, z:0}
    name = ""
    constructor(name,x,y,z,type,radius,mass,atmosphere,atmoshperePressure,atmosphereTemperature,atmosphereGasses,atmosphereHeight,gravity,orbitHeight) {
        this.name = name
        this.position.x = x //ly
        this.position.y = y //ly
        this.position.z = z //ly
        this.type = type //planet, star, moon, asteroid, blackhole
        this.radius = radius //km
        this.mass = mass //t
        this.atmosphere = atmosphere //true false
        this.atmospherePressure = atmoshperePressure //bar
        this.atmosphereHeight = atmosphereHeight //km
        this.atmosphereTemperature = atmosphereTemperature //C (average)
        this.atmosphereGasses = atmosphereGasses // array {oxygen:5}
        this.gravity = gravity //m/s
        this.orbitHeight = orbitHeight //km
    }
}
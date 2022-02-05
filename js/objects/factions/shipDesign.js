class ShipDesign {
    constructor(name,shipRole,type,size,weapons,turrets,armor,shield,engine,fuelTank,cargo,shipDimensions) {
        this.name = name
        this.shipRole = shipRole
        this.type = type
        this.size = size
        this.shipDimensions = shipDimensions
        this.weapons = weapons
        this.turrets = turrets
        this.armor = armor
        this.shield = shield
        this.engine = engine
        this.fuelTank = fuelTank
        this.cargo = cargo

    }
}

let shipDesigns = {
    "Fighter 1":new ShipDesign("Fighter 1","Military","Fighter","S",{},{},35,50,{},{},{},{l:7,h:3.5,w:3.5}),
    "Interceptor 1":new ShipDesign("Interceptor 1","Military","Interceptor","S",{},{},25,20,{},{},{},{l:6,h:4,w:4}),
    "Trader 1":new ShipDesign("Trader 1","Trade","Freighter","M",{},{},150,50,{},{},{},{l:40,h:5,w:4}),
    "Ship 1":new ShipDesign("Ship 1","Civilian","Civilian","S",{},{},10,5,{},{},{},{l:7,h:3.5,w:3.5}),
}

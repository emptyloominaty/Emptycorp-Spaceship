class ShipDesign {
    constructor(name,shipRole,type,size,weapons,turrets,armor,shield,fuelTank,cargo,shipDimensions,resourceCost,baseWeight,crew) {
        this.name = name
        this.shipRole = shipRole
        this.type = type
        this.size = size
        this.shipDimensions = shipDimensions
        this.weapons = weapons
        this.turrets = turrets
        this.armor = armor
        this.shield = shield
        this.fuelTank = fuelTank
        this.cargo = cargo
        this.resourceCost = resourceCost //base cost
        this.baseWeight = baseWeight
        this.crew = crew
    }

    getDesign(weapon,turrets,engine,) {
        let resources = Object.assign({}, this.resourceCost)



        return {resources:this.resourceCost, }
    }

}

let shipDesigns = {
    "Fighter 1":new ShipDesign("Fighter 1","Military","Fighter","S",1,1,35,50,350,0,{l:7,h:3.5,w:3.5},
        {"steel":500,"titanium":100,"aluminium":20,"polymer":45,"copper":20,"tungsten":5,"carbon":10,"electronics":20},4200,2),
    "Interceptor 1":new ShipDesign("Interceptor 1","Military","Interceptor","S",1,0,25,20,250,0,{l:6,h:4,w:4},
        {"steel":300,"titanium":50,"aluminium":15,"polymer":35,"copper":15,"tungsten":2,"carbon":10,"electronics":15},2000,1),
    "Trader 1":new ShipDesign("Trader 1","Trade","Freighter","M",0,1,150,50,1000,50000,{l:40,h:5,w:4},
        {"steel":2500,"titanium":300,"aluminium":20,"polymer":45,"copper":20,"tungsten":10,"carbon":10,"electronics":20},20000,10),
    "Ship 1":new ShipDesign("Ship 1","Civilian","Civilian","S",1,0,10,5,500,500,{l:7,h:3.5,w:3.5},
        {"steel":520,"titanium":10,"aluminium":30,"polymer":60,"copper":20,"tungsten":1,"carbon":10,"electronics":20},5000,2),
    "Ship F1":new ShipDesign("Ship F1","Military","Fighter","S",2,1,50,50,500,0,{l:7,h:3.5,w:3.5},
        {"steel":550,"titanium":120,"aluminium":22,"polymer":60,"copper":25,"tungsten":5,"carbon":15,"electronics":25},5500,2),
}

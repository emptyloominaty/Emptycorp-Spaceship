class Faction {
    color = "#FFF"
    playerRelations = 0
    relations = {}

    ships = {
        "Trade":[],
        "Military":[],
        "Civilian":[],
    }

    constructor(color,playerRelations,relations) {
        this.color = color
        this.playerRelations = playerRelations
        this.relations = relations
    }
}

let factionList = {
    Player:new Faction("#53ee53",100,{"Player":100,"Terran":10,"Pirate":-100}),
    Terran:new Faction("#6c8aee",10,{"Player":10,"Terran":100,"Pirate":-100}),
    Pirate:new Faction("#ff3d3a",-100,{"Player":-100,"Terran":-100,"Pirate":100})
}
class Character {
    health = 100
    dead = false

    constructor(name,faction) {
        this.name = name
        this.id = characters.length
        this.faction = faction
    }
}

let characters = []

characters.push(new Character("Empty","Player"))
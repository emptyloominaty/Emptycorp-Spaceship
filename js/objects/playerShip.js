class Ship {
    armor = 500
    armorMax = 500
    shields = 1000
    shieldsMax = 1000

    speed = 0 //c
    atmosphere = {oxygen:21, nitrogen:78.96, carbonDioxide:0.04, volume:16/* m3 */, pressure:1/* bar */, temperature:293}
    airTanks = [{type:"N2+O2",volume:80 /* Litres */,pressure:150 /* bar */}]


    antennas = []
    batteries = []
    generators = []
    capacitors = []

    engines = []
    fueltanks = []
    weapons = []


    constructor() {

    }
}


let playerShip = new Ship()
class Ship {
    armor = 500
    armorMax = 500
    baseWeight = 5500 //kg
    speed = 0 //c
    atmosphere = {oxygen:21, nitrogen:78.96, carbonDioxide:0.04, volume:16/* m3 */, pressure:1/* bar */, temperature:293}

    //TODO:supplies water/food?

    airTanks = [{weight:110,type:"N2+O2",volume:80 /* Litres */,pressure:150 /* bar */},
                {weight:100,type:"H2",volume:80 ,pressure:680 },
                {weight:120,type:"O2",volume:160 ,pressure:170 }]
    antennas = [{weight:3, minSpeed:0.064, maxSpeed:100 /* mbit */, consumptionPower:[0.05, 1, 42]/* kW */, consumptionFuel:[0.001, 0.32, 10]/* g/hour*/,}] //0 = listening, 1-min speed, 2-max speed
    batteries = [{weight:1000, capacity: 50, /* MWh */}]
    capacitors = [{weight:50, capacity: 0.2, /* MWh */},
                  {weight:10, capacity: 0.05, /* MWh */},]
    generators = [{weight:500, type:"H2FuelCell", output: 0.0027 /* MW */, consumption:[2/*H2*/,1/*O2*/] /* litres/hour */}, //TODO: AUTO OUTPUT
                  {weight:1000, type:"UraniumReactor", output: 0.15 /* MW */, consumption:0.06818 /* g/hour */},] //TODO: AUTO OUTPUT 22GW/kg

    engines = [{weight:1500, fuelType:"fuel1", type:"FTL", minSpeed:0.00018408 /* ly/h */, thrust: 17987.52,/* TN */ maxSpeed:12 /* ly/h */, consumptionFuel:[0,40,150] /* kg/h */ , consumptionPower:[0.008,0.13] /* MW*/},
               {weigth:500, fuelType:"fuel1", type:"Sublight", maxSpeed:215000 /* m/s */ , thrust: 1 /* MN */, consumptionFuel:[0,1,3] /* kg/h */ , consumptionPower:[0.0004,0.1] /* MW*/  }]


    fueltanks = [{weight:300,type:"fuel1",fuelWeight:500 /* kg */ },
                {weight:300,type:"fuel1",fuelWeight:500 /* kg */ },
                {weight:300,type:"fuel1",fuelWeight:500 /* kg */ },
                {weight:300,type:"fuel1",fuelWeight:500 /* kg */ },
                {weight:100,type:"uranium",fuelWeight:10 /* kg */ }, //22GW /kg
    ]

    shields = [{capacity:1000, rechargeRate:3.8 /* per sec */, consumption:[0.1,1.5] /*MWh 0-maintaining 1-charging*/}]

    weapons = [{type:"laser", power:20/* MW */, length:0.1 /*seconds*/}]


    constructor() {

    }
}


let playerShip = new Ship()
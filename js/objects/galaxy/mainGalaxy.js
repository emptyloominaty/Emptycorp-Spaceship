let galaxy = {

}
let factionList = {Terran:new Faction("#6c8aee",10,), }

/* idk
let stars = {}
let planets = {}
let moons = {}
let asteroids = {}
*/

let starSystems = []


//--------------Sol
starSystems.push (new StarSystem(
    [
        new Star("Sol",0,0,0,"star",695700,1988500000000000000000000000,false,0,6000,{},0,274,0,"Terran","Class G")],
    [
        new Planet("Mercury",0,0,0,"planet",2439.7,330110000000000000000000,false,0,67,{},0,3.7,57909050,0,"Terran",[],[]),
        new Planet("Venus",0,0,0,"planet",6051.8,4867500000000000000000000,true,93,464,{carbonDioxide:96.5,nitrogen:3.5},100,8.87,108208000,0,"Terran",[],[]),
        new Planet("Terra",0,0,0,"planet",6371,5972370000000000000000000,true,1,14,{nitrogen:78.03,oxygen:21,argon:0.93,carbonDioxide:0.04},100,9.81,149598023,10000000000,"Terran",
            [new Moon("Luna",0,0,0,"moon",1737.4,73420000000000000000000,false,0,-22,{},0,1.622,384399,7000000,"Terran")],
            [new TimeServer(1,"Time Server(Sol)",1,"time",0,0)]),
        new Planet("Mars",0,0,0,"planet",3389.5,6417100000000000000000000,true,0.00636321,-63,{carbonDioxide:95.97,argon:1.93,nitrogen:1.89,oxygen:0.146},50,3.720,227939200,1000000,"Terran",
            [new Moon("Phobos",0,0,0,"moon",11.2667,10659000000000000,false,0,-40,{},0,0.0057,9376,0,"Terran"),
                    new Moon("Deimos",0,0,0,"moon",6.2,1476200000000000,false,0,-40,{},0,0.003,23463.2,0,"Terran")],
            []),
        //TODO: ASTEROID BELT
        new Planet("Jupiter",0,0,0,"planet",69911,1898200000000000000000000000,true,6,-108,{hydrogen:89,helium:10,methane:0.3},400,24.79,778570000,0,"Terran",
            [], //TODO:MOONS xD RIP
            []),
        new Planet("Saturn",0,0,0,"planet",58232,568340000000000000000000000,true,1.4,-138,{hydrogen:96.3,helium:3.25,methane:0.45},200,24.79,1433530000,0,"Terran",
            [], //TODO:MOONS xD RIP
            []),
        new Planet("Uranus",0,0,0,"planet",	25362,86810000000000000000000000,true,1.3,-197,{hydrogen:93,helium:15,methane:2.3},150,8.69,2870972000,0,"Terran",
            [],
            []),
        new Planet("Neptune",0,0,0,"planet",24622,102413000000000000000000000,true,1.2,-201,{hydrogen:80,helium:19,methane:1.5},150,	11.15,4500000000,0,"Terran",
            [],
            []),
    ],
    [],
    "Terran",
    {
        O2:0.0004,N2:0.0002,H2:0.005, //Gas (Litres)
        deuterium:1250,fuel1:10,uranium:5000,}, //Liquids,Solid (kg)
    "Sol",
    {x:0,y:0,z:0},
    15,
))

//-----------------------Obsidium
starSystems.push (new StarSystem(
    [
        new Star("Obsidium",6.5,2.3,0.5,"star",548300,1652400000000000000000000000,false,0,5000,{},0,250,0,"Terran","Class K")],
    [
        new Planet("XK1",0,0,0,"planet",3051.8,2867500000000000000000000,true,0.5,104,{carbonDioxide:10,nitrogen:65,argon:15,oxygen:10},100,6.87,68208000,1500,"Terran",[],[]),
        new Planet("Obsidian",0,0,0,"planet",9371,15972370000000000000000000,true,1.05,17,{nitrogen:73.57,oxygen:26,argon:0.4,carbonDioxide:0.03},100,10.50,119598023,1520000000,"Terran",
            [new Moon("Obsidoon",0,0,0,"moon",2737.4,133420000000000000000000,false,0,-22,{},0,2.22,450250,0,"Terran")],
            [new TimeServer(1,"Time Server(Obsidium)",1,"time",6.5,2.3)]),
        new Planet("Emptayk II",0,0,0,"planet",4551.8,3527200000000000000000000,true,0.9,5,{carbonDioxide:0.01,nitrogen:68.99,argon:1,oxygen:30},100,7.90,188208000,1000,"Terran",[],[]),
    ],
    [],
    "Terran",
    {
        O2:0.0004,N2:0.0002,H2:0.005, //Gas (Litres)
        deuterium:1250,fuel1:10,uranium:5000,}, //Liquids,Solid (kg)
    "Obsidium",
    {x:6.5,y:2.3,z:0.5},
    15,

))
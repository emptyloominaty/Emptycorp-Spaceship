let galaxy = {

}
let factionList = {Player:new Faction("#53ee53",100,),Terran:new Faction("#6c8aee",10,),Pirate:new Faction("#ff3d3a",-100,) }


let globalPrices = {
        O2:0.0004, N2:0.0002, H2:0.005, He:0.008, //Gas (Litres)
        deuterium:1250, fuel1:10, uranium:5000, //Liquids,Solid (kg)
        food:0.01, water:0.001, medicine:1.2, //pop resources
        iron:0.1, gold:1.4, silver:0.5, aluminium:0.2, titanium:0.6, silicon:0.05, chromium:0.12, carbon:0.075, polymer:0.5, lead:0.2, copper:0.25, tungsten:1, //building resources
        electronics:1.8, steel:1,  //other
    }

let starSystems = []
//--------------Sol
starSystems.push (new StarSystem(
    [
        new Star("Sol",0,0,0,"star",695700,1988500000000000000000000000,false,0,6000,{},0,274,0,"Terran","Class G")],
    [
        new Planet("Mercury",0,0,0,"planet",2439.7,330110000000000000000000,false,0,67,{},0,3.7,57909050,0,"Terran",[],0.00001,),
        new Planet("Venus",0,0,0,"planet",6051.8,4867500000000000000000000,true,93,464,{carbonDioxide:96.5,nitrogen:3.5},100,8.87,108208000,0,"Terran",[],0.000001),
        new Planet("Terra",0,0,0,"planet",6371,5972370000000000000000000,true,1,14,{nitrogen:78.03,oxygen:21,argon:0.93,carbonDioxide:0.04},100,9.81,149598023,10000000000,"Terran",
            [new Moon("Luna",0,0,0,"moon",1737.4,73420000000000000000000,false,0,-22,{},0,1.622,384399,7000000,"Terran",0.001)],10,
            ),
        new Planet("Mars",0,0,0,"planet",3389.5,6417100000000000000000000,true,0.00636321,-63,{carbonDioxide:95.97,argon:1.93,nitrogen:1.89,oxygen:0.146},50,3.720,227939200,1000000,"Terran",
            [new Moon("Phobos",0,0,0,"moon",11.2667,10659000000000000,false,0,-40,{},0,0.0057,9376,0,"Terran",0.000001,),
                    new Moon("Deimos",0,0,0,"moon",6.2,1476200000000000,false,0,-40,{},0,0.003,23463.2,0,"Terran",0.000001)],0.01),
        //TODO: ASTEROID BELT
        new Planet("Jupiter",0,0,0,"planet",69911,1898200000000000000000000000,true,6,-108,{hydrogen:89,helium:10,methane:0.3},400,24.79,778570000,0,"Terran",
            [],0.001),
        new Planet("Saturn",0,0,0,"planet",58232,568340000000000000000000000,true,1.4,-138,{hydrogen:96.3,helium:3.25,methane:0.45},200,24.79,1433530000,0,"Terran",
            [],0.001),
        new Planet("Uranus",0,0,0,"planet",	25362,86810000000000000000000000,true,1.3,-197,{hydrogen:93,helium:15,methane:2.3},150,8.69,2870972000,0,"Terran",
            [],0.001),
        new Planet("Neptune",0,0,0,"planet",24622,102413000000000000000000000,true,1.2,-201,{hydrogen:80,helium:19,methane:1.5},150,	11.15,4500000000,0,"Terran",
            [],0.001),
    ],
    [],
    "Terran",
    {
        O2:0.0004, N2:0.0002, H2:0.005, He:0.008, //Gas (Litres)
        deuterium:1250, fuel1:10, uranium:5000, //Liquids,Solid (kg)
        food:0.01, water:0.001, medicine:1.2, //pop resources
        iron:0.1, gold:1.4, silver:0.5, aluminium:0.2, titanium:0.6, silicon:0.05, chromium:0.12, carbon:0.075, polymer:0.5, lead:0.2, copper:0.25,tungsten:1, //building resources
        electronics:1.8,steel:1,  //other
        },
    {
        O2:{max:5000000000,val:5000000000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["O2"], ratios:[0.2,0.5,0.8]}, N2:{max:5000000,val:5000000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["N2"], ratios:[0.2,0.5,0.8]}, H2:{max:5000000,val:5000000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["H2"], ratios:[0.2,0.5,0.8]}, He:{max:1000000,val:1000000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["He"], ratios:[0.2,0.5,0.8]}, //Gas (Litres)
        deuterium:{max:2000000,val:1800000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["deuterium"], ratios:[0.2,0.5,0.8]}, fuel1:{max:6000000,val:5800000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["fuel1"], ratios:[0.2,0.5,0.8]}, uranium:{max:10000,val:8000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["uranium"], ratios:[0.15,0.3,0.6]}, //Liquids,Solid (kg)
        food:{max:200000000,val:180000000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["food"], ratios:[0.3,0.6,0.8]}, water:{max:2000000000,val:1800000000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["water"], ratios:[0.3,0.6,0.8]}, medicine:{max:500000,val:480000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["medicine"], ratios:[0.2,0.5,0.8]}, //pop resources
        iron:{max:20000,val:19000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["steel"], ratios:[0.2,0.4,0.7]}, gold:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["gold"], ratios:[0.2,0.4,0.7]}, silver:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["silver"], ratios:[0.2,0.4,0.7]}, aluminium:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["aluminium"], ratios:[0.2,0.4,0.7]},
        titanium:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["titan"], ratios:[0.2,0.4,0.7]}, silicon:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["silicon"], ratios:[0.2,0.4,0.7]}, chromium:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["chromium"], ratios:[0.2,0.4,0.7]}, carbon:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["carbon"], ratios:[0.2,0.4,0.7]},
        polymer:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["polymer"], ratios:[0.2,0.4,0.7]}, lead:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["lead"], ratios:[0.2,0.4,0.7]}, copper:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["copper"], ratios:[0.2,0.4,0.7]},tungsten:{max:10000,val:8500,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["tungsten"], ratios:[0.2,0.5,0.8]}, //building resources
        electronics:{max:50000,val:38000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["electronics"], ratios:[0.15,0.3,0.6]},steel:{max:90000,val:89000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["steel"], ratios:[0.2,0.5,0.8]}  //other
    },
    "Sol",
    {x:0,y:0,z:0},
    [
        new TimeServer(1,"Time Server(Sol)",1,"time",0,0,0,"Sol"),
        new TradeServer(1,"Trade Server(Sol)",1,"trade",0,0,0,"Sol"),
    ],
    [{name:"steel",amount:2000,producing:true, input:["iron","carbon"], ratio:3},{name:"electronics",amount:500,producing:true, input:["silicon","gold"], ratio:10},
        {name:"medicine",amount:100,producing:true,input:["silicon","silver"], ratio:1}],
    [{name:"iron",amount:7500 ,producing:true},{name:"carbon",amount:3000,producing:true},{name:"water",amount:100000,producing:true},{name:"food",amount:10000,producing:true},
        {name:"O2",amount:500000,producing:true},{name:"N2",amount:50000,producing:true},{name:"H2",amount:50000,producing:true},{name:"He",amount:200,producing:true},
        {name:"silicon",amount:15000,producing:true},{name:"gold",amount:250,producing:true},{name:"silver",amount:250,producing:true},{name:"aluminium",amount:300,producing:true},
        {name:"titanium",amount:100,producing:true},{name:"chromium",amount:100,producing:true},{name:"polymer",amount:1000,producing:true},
        {name:"copper",amount:1000,producing:true},{name:"tungsten",amount:70,producing:true},
        {name:"deuterium",amount:10,producing:true},{name:"uranium",amount:2,producing:true},{name:"fuel1",amount:500,producing:true}],
    1,
    15,
))

//-----------------------Obsidium
starSystems.push (new StarSystem(
    [
        new Star("Obsidium",6.5,2.3,0.5,"star",548300,1652400000000000000000000000,false,0,5000,{},0,250,0,"Terran","Class K")],
    [
        new Planet("XK1",0,0,0,"planet",3051.8,2867500000000000000000000,true,0.5,104,{carbonDioxide:10,nitrogen:65,argon:15,oxygen:10},100,6.87,68208000,1500,"Terran",[],0.05,
            []),
        new Planet("Obsidian",0,0,0,"planet",9371,15972370000000000000000000,true,1.05,17,{nitrogen:73.57,oxygen:26,argon:0.4,carbonDioxide:0.03},100,10.50,119598023,1520000000,"Terran",
            [new Moon("Obsidoon",0,0,0,"moon",2737.4,133420000000000000000000,false,0,-22,{},0,2.22,450250,0,"Terran",0.00001,
                [])],12,
            []),
        new Planet("Emptayk II",0,0,0,"planet",4551.8,3527200000000000000000000,true,0.9,5,{carbonDioxide:0.01,nitrogen:68.99,argon:1,oxygen:30},100,7.90,188208000,1000,"Terran",[],2.8,
            []),
    ],
    [],
    "Terran",
    {
        O2:0.0004, N2:0.0002, H2:0.005, He:0.008, //Gas (Litres)
        deuterium:1250, fuel1:10, uranium:5000, //Liquids,Solid (kg)
        food:0.01, water:0.001, medicine:1.2, //pop resources
        iron:0.1, gold:1.4, silver:0.5, aluminium:0.2, titanium:0.6, silicon:0.05, chromium:0.12, carbon:0.075, polymer:0.5, lead:0.2, copper:0.25,tungsten:1, //building resources
        electronics:1.8,steel:1,  //other
        },
    {
        O2:{max:50000000,val:50000000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["O2"], ratios:[0.2,0.5,0.8]}, N2:{max:5000000,val:5000000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["N2"], ratios:[0.2,0.5,0.8]}, H2:{max:5000000,val:5000000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["H2"], ratios:[0.2,0.5,0.8]}, He:{max:1000000,val:1000000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["He"], ratios:[0.2,0.5,0.8]}, //Gas (Litres)
        deuterium:{max:2000000,val:1800000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["deuterium"], ratios:[0.2,0.5,0.8]}, fuel1:{max:6000000,val:5800000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["fuel1"], ratios:[0.2,0.5,0.8]}, uranium:{max:10000,val:8000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["uranium"], ratios:[0.15,0.3,0.6]}, //Liquids,Solid (kg)
        food:{max:2000000,val:1800000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["food"], ratios:[0.3,0.6,0.8]}, water:{max:2000000,val:1800000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["water"], ratios:[0.3,0.6,0.8]}, medicine:{max:500000,val:480000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["medicine"], ratios:[0.2,0.5,0.8]}, //pop resources
        iron:{max:20000,val:19000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["steel"], ratios:[0.2,0.4,0.7]}, gold:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["gold"], ratios:[0.2,0.4,0.7]}, silver:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["silver"], ratios:[0.2,0.4,0.7]}, aluminium:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["aluminium"], ratios:[0.2,0.4,0.7]},
        titanium:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["titan"], ratios:[0.2,0.4,0.7]}, silicon:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["silicon"], ratios:[0.2,0.4,0.7]}, chromium:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["chromium"], ratios:[0.2,0.4,0.7]}, carbon:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["carbon"], ratios:[0.2,0.4,0.7]},
        polymer:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["polymer"], ratios:[0.2,0.4,0.7]}, lead:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["lead"], ratios:[0.2,0.4,0.7]}, copper:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["copper"], ratios:[0.2,0.4,0.7]},tungsten:{max:10000,val:8500,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["tungsten"], ratios:[0.2,0.5,0.8]}, //building resources
        electronics:{max:50000,val:38000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["electronics"], ratios:[0.15,0.3,0.6]},steel:{max:90000,val:89000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["steel"], ratios:[0.2,0.5,0.8]}  //other
    },
    "Obsidium",
    {x:6.3,y:2.5,z:0.5},
    [new TimeServer(1,"Time Server(Obsidium)",1,"time",6.5,2.3,0.5,"Obsidium"),
        new TradeServer(1,"Trade Server(Obsidium)",1,"trade",6.5,2.3,0.5,"Obsidium"),],
    [],
    [],
    0.8,
    15,
))

starSystems.push (new StarSystem(
    [
        new Star("Test",6.5,2.3,0.5,"star",548300,1652400000000000000000000000,false,0,5000,{},0,250,0,"Terran","Class K")],
    [],
    [],
    "Terran",
    {},
    {},
    "Test",
    {x:-2,y:-1,z:1},
    [],
    [],
    [],
    0.2,
    15,
))

starSystems.push (new StarSystem(
    [
        new Star("Test2",6.5,2.3,0.5,"star",548300,1652400000000000000000000000,false,0,5000,{},0,250,0,"Terran","Class K")],
    [],
    [],
    "Terran",
    {},
    {},
    "Test2",
    {x:4,y:4,z:0.5},
    [],
    [],
    [],
    0.2,
    15,
))
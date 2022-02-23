let galaxy = {
    priceHistory:[],
    avgPriceHistory:{ O2:[], N2:[], H2:[], He:[],
    deuterium:[], fuel1:[], uranium:[],
    food:[], water:[], medicine:[],
    iron:[], gold:[], silver:[], aluminium:[], titanium:[], silicon:[], chromium:[], carbon:[], polymer:[], lead:[], copper:[], tungsten:[],
    electronics:[], steel:[]}
}

let constants = {
    density:{ // gas: g/L
        O2:0.001429, N2:0.0012506, H2:0.00008988, He:0.0001786,
        //TODO: ?
        deuterium:1, fuel1:1, uranium:0,
        food:1, water:1, medicine:1,
        iron:1, gold:1, silver:1, aluminium:1, titanium:1, silicon:1, chromium:1, carbon:1, polymer:1, lead:1, copper:1, tungsten:1,
        electronics:1, steel:1,
    }
}


let factories = {
    buildFactory:function(name,size,built = false) {
        let factory = JSON.parse(JSON.stringify(this[name]))
        factory.amount *= size
        factory.peopleNeed *= size /*k people*/

        Object.keys(factory.buildResources).forEach(key => {
            factory.buildResources[key] *= size
        })
        factory.built = built
        factory.timeB = 0
        if (factory.built) {
            factory.timeB = factory.time
        }
        return factory
    },
    "steel":{name:"steel",amount:100,producing:true, input:["iron","carbon"], ratio:3, peopleNeed:17000000, time:5, buildResources:{"steel":5000,"polymer":500,"tungsten":1000,"electronics":500,"copper":100,"silver":100}},
    "electronics":{name:"electronics",amount:100,producing:true, input:["silicon","gold"], ratio:10, peopleNeed:8000000, time:20, buildResources:{"steel":1000,"polymer":2000,"tungsten":100,"electronics":1500,"copper":100,"silver":100,"gold":300}},
    "medicine":{name:"medicine",amount:100,producing:true,input:["silicon","silver"], ratio:1, peopleNeed:12000000, time:10, buildResources:{"steel":700,"polymer":3000,"electronics":1000,"copper":100,"silver":100}},
}
let naturalResources = {
    c:function(name,size) {
        let resource = {...this[name]}
        resource.amount *= size
        resource.peopleNeed *= size
        return resource
    },
    "iron":{name:"iron",amount:100, peopleNeed:2500000},
    "carbon":{name:"carbon",amount:100, peopleNeed:1500000},
    "gold":{name:"gold",amount:100, peopleNeed:3000000},
    "silver":{name:"silver",amount:100, peopleNeed:2000000},
    "aluminium":{name:"aluminium",amount:100, peopleNeed:2500000},
    "titanium":{name:"titanium",amount:100, peopleNeed:4000000},
    "silicon":{name:"silicon",amount:100, peopleNeed:1500000},
    "chromium":{name:"chromium",amount:100, peopleNeed:3500000},
    "polymer":{name:"polymer",amount:100, peopleNeed:1500000},
    "lead":{name:"lead",amount:100, peopleNeed:3000000},
    "copper":{name:"copper",amount:100, peopleNeed:2500000},
    "tungsten":{name:"tungsten",amount:100, peopleNeed:400000},
    "food":{name:"food",amount:100, peopleNeed:50000},
    "water":{name:"water",amount:100, peopleNeed:5000},
    "O2":{name:"O2", amount:10000, peopleNeed:50000},
    "H2":{name:"H2", amount:10000, peopleNeed:100000},
    "N2":{name:"N2", amount:10000, peopleNeed:50000},
    "He":{name:"He", amount:10000, peopleNeed:100000},
    "deuterium":{name:"deuterium", amount:100, peopleNeed:500000},
    "fuel1":{name:"fuel1", amount:100, peopleNeed:5000000},
    "uranium":{name:"uranium", amount:100, peopleNeed:2500000},
}

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
        new Planet("Mercury",0,0,0,"planet",2439.7,330110000000000000000000,false,0,67,{},0,3.7,57909050,0,"Terran",[],0.00001,"Mercury"),
        new Planet("Venus",0,0,0,"planet",6051.8,4867500000000000000000000,true,93,464,{carbonDioxide:96.5,nitrogen:3.5},100,8.87,108208000,0,"Terran",[],0.000001,"Venus"),
        new Planet("Earth",0,0,0,"planet",6371,5972370000000000000000000,true,1,14,{nitrogen:78.03,oxygen:21,argon:0.93,carbonDioxide:0.04},100,9.81,149598023,10000000000,"Terran",
            [new Moon("Moon",0,0,0,"moon",1737.4,73420000000000000000000,false,0,-22,{},0,1.622,384399,7000000,"Terran",0.001,"Moon")],10,"Earth",
            ),
        new Planet("Mars",0,0,0,"planet",3389.5,6417100000000000000000000,true,0.00636321,-63,{carbonDioxide:95.97,argon:1.93,nitrogen:1.89,oxygen:0.146},50,3.720,227939200,1000000,"Terran",
            [new Moon("Phobos",0,0,0,"moon",11.2667,10659000000000000,false,0,-40,{},0,0.0057,9376,0,"Terran",0.000001,"Moon"),
                    new Moon("Deimos",0,0,0,"moon",6.2,1476200000000000,false,0,-40,{},0,0.003,23463.2,0,"Terran",0.000001,"Moon")],0.01,"Mars"),
        //TODO: ASTEROID BELT
        new Planet("Jupiter",0,0,0,"planet",69911,1898200000000000000000000000,true,6,-108,{hydrogen:89,helium:10,methane:0.3},400,24.79,778570000,0,"Terran",
            [],0.001,"Jupiter"),
        new Planet("Saturn",0,0,0,"planet",58232,568340000000000000000000000,true,1.4,-138,{hydrogen:96.3,helium:3.25,methane:0.45},200,24.79,1433530000,0,"Terran",
            [],0.001,"Saturn"),
        new Planet("Uranus",0,0,0,"planet",	25362,86810000000000000000000000,true,1.3,-197,{hydrogen:93,helium:15,methane:2.3},150,8.69,2870972000,0,"Terran",
            [],0.001,"Uranus"),
        new Planet("Neptune",0,0,0,"planet",24622,102413000000000000000000000,true,1.2,-201,{hydrogen:80,helium:19,methane:1.5},150,	11.15,4500000000,0,"Terran",
            [],0.001,"Neptune"),
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
        iron:{max:200000,val:190000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["iron"], ratios:[0.2,0.4,0.7]}, gold:{max:100000,val:90000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["gold"], ratios:[0.2,0.4,0.7]}, silver:{max:100000,val:90000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["silver"], ratios:[0.2,0.4,0.7]}, aluminium:{max:100000,val:90000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["aluminium"], ratios:[0.2,0.4,0.7]},
        titanium:{max:100000,val:90000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["titan"], ratios:[0.2,0.4,0.7]}, silicon:{max:100000,val:90000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["silicon"], ratios:[0.2,0.4,0.7]}, chromium:{max:100000,val:90000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["chromium"], ratios:[0.2,0.4,0.7]}, carbon:{max:100000,val:99000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["carbon"], ratios:[0.2,0.4,0.7]},
        polymer:{max:100000,val:90000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["polymer"], ratios:[0.2,0.4,0.7]}, lead:{max:100000,val:90000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["lead"], ratios:[0.2,0.4,0.7]}, copper:{max:100000,val:90000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["copper"], ratios:[0.2,0.4,0.7]},tungsten:{max:100000,val:85000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["tungsten"], ratios:[0.2,0.5,0.8]}, //building resources
        electronics:{max:50000,val:38000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["electronics"], ratios:[0.15,0.3,0.6]},steel:{max:90000,val:89000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["steel"], ratios:[0.2,0.5,0.8]}  //other
    },
    "Sol",
    {x:0,y:0,z:0},
    [new SystemServer(1,"System Server(Sol)",1,"system",0,0,0,"Sol"),
        new TimeServer(1,"Time Server(Sol)",1,"time",0,0,0,"Sol"),
        new TradeServer(1,"Trade Server(Sol)",1,"trade",0,0,0,"Sol"),
    ],
    [factories.buildFactory("steel",20,true),factories.buildFactory("electronics",20,true),
        factories.buildFactory("medicine",1,true)],
    [naturalResources.c("iron",75),naturalResources.c("carbon",30),naturalResources.c("water",2000),naturalResources.c("food",200),
        naturalResources.c("O2",80),naturalResources.c("N2",8),naturalResources.c("H2",3),naturalResources.c("He",0.01),
        naturalResources.c("silicon",15),naturalResources.c("gold",2),naturalResources.c("silver",3),naturalResources.c("aluminium",8),
        naturalResources.c("titanium",2),naturalResources.c("chromium",5),naturalResources.c("polymer",40),naturalResources.c("lead",2),
        naturalResources.c("copper",4),naturalResources.c("tungsten",1),
        naturalResources.c("deuterium",1),naturalResources.c("uranium",5),naturalResources.c("fuel1",20)],
    1,
    15,
))

//-----------------------Obsidium
starSystems.push (new StarSystem(
    [
        new Star("Obsidium",6.5,2.3,0.5,"star",548300,1652400000000000000000000000,false,0,5000,{},0,250,0,"Terran","Class K")],
    [
        new Planet("XK1",0,0,0,"planet",3051.8,2867500000000000000000000,true,0.5,104,{carbonDioxide:10,nitrogen:65,argon:15,oxygen:10},100,6.87,68208000,1500,"Terran",[],0.05,
            "Venus"),
        new Planet("Obsidian",0,0,0,"planet",9371,15972370000000000000000000,true,1.05,17,{nitrogen:73.57,oxygen:26,argon:0.4,carbonDioxide:0.03},100,10.50,119598023,1520000000,"Terran",
            [new Moon("Obsidoon",0,0,0,"moon",2737.4,133420000000000000000000,false,0,-22,{},0,2.22,450250,0,"Terran",0.00001,
                "Moon")],12,
            "Earth"),
        new Planet("Emptayk II",0,0,0,"planet",4551.8,3527200000000000000000000,true,0.9,5,{carbonDioxide:0.01,nitrogen:68.99,argon:1,oxygen:30},100,7.90,188208000,1000,"Terran",[],2.8,
            "Mercury"),
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
        O2:{max:500000000,val:500000000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["O2"], ratios:[0.2,0.5,0.8]}, N2:{max:5000000,val:5000000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["N2"], ratios:[0.2,0.5,0.8]}, H2:{max:5000000,val:5000000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["H2"], ratios:[0.2,0.5,0.8]}, He:{max:1000000,val:1000000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["He"], ratios:[0.2,0.5,0.8]}, //Gas (Litres)
        deuterium:{max:2000000,val:1800000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["deuterium"], ratios:[0.2,0.5,0.8]}, fuel1:{max:6000000,val:5800000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["fuel1"], ratios:[0.2,0.5,0.8]}, uranium:{max:20000,val:19990,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["uranium"], ratios:[0.15,0.3,0.6]}, //Liquids,Solid (kg)
        food:{max:2000000,val:1800000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["food"], ratios:[0.3,0.6,0.8]}, water:{max:2000000,val:1800000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["water"], ratios:[0.3,0.6,0.8]}, medicine:{max:500000,val:480000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["medicine"], ratios:[0.2,0.5,0.8]}, //pop resources
        iron:{max:20000,val:19000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["iron"], ratios:[0.2,0.4,0.7]}, gold:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["gold"], ratios:[0.2,0.4,0.7]}, silver:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["silver"], ratios:[0.2,0.4,0.7]}, aluminium:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["aluminium"], ratios:[0.2,0.4,0.7]},
        titanium:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["titan"], ratios:[0.2,0.4,0.7]}, silicon:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["silicon"], ratios:[0.2,0.4,0.7]}, chromium:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["chromium"], ratios:[0.2,0.4,0.7]}, carbon:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["carbon"], ratios:[0.2,0.4,0.7]},
        polymer:{max:10000,val:1000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["polymer"], ratios:[0.2,0.4,0.7]}, lead:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["lead"], ratios:[0.2,0.4,0.7]}, copper:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["copper"], ratios:[0.2,0.4,0.7]},tungsten:{max:10000,val:8500,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["tungsten"], ratios:[0.2,0.5,0.8]}, //building resources
        electronics:{max:50000,val:18000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["electronics"], ratios:[0.15,0.3,0.6]},steel:{max:90000,val:45000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["steel"], ratios:[0.2,0.5,0.8]}  //other
    },
    "Obsidium",
    {x:6.3,y:2.5,z:0.5},
    [new SystemServer(1,"System Server(Obsidium)",1,"system",6.5,2.3,0.5,"Obsidium"),
        new TimeServer(1,"Time Server(Obsidium)",1,"time",6.5,2.3,0.5,"Obsidium"),
        new TradeServer(1,"Trade Server(Obsidium)",1,"trade",6.5,2.3,0.5,"Obsidium"),],
    [factories.buildFactory("steel",1, true),factories.buildFactory("electronics",20, true),
        factories.buildFactory("medicine",2, true)],
    [naturalResources.c("iron",20),naturalResources.c("carbon",10),naturalResources.c("water",1000),naturalResources.c("food",150),
        naturalResources.c("O2",50),naturalResources.c("N2",5),naturalResources.c("H2",5),naturalResources.c("He",0.01),
        naturalResources.c("silicon",150),naturalResources.c("gold",2.5),naturalResources.c("silver",2.5),naturalResources.c("aluminium",0.8),
        naturalResources.c("titanium",1),naturalResources.c("chromium",1),naturalResources.c("polymer",5),naturalResources.c("lead",2),
        naturalResources.c("copper",1),naturalResources.c("tungsten",0.7),
        naturalResources.c("deuterium",0.5),naturalResources.c("uranium",5),naturalResources.c("fuel1",7)],
    0.8,
    15,
))

starSystems.push (new StarSystem(
    [
        new Star("Alpha",6.5,2.3,0.5,"star",548300,1652400000000000000000000000,false,0,5900,{},0,250,0,"Terran","Class K")],
    [new Planet("Alpha I",0,0,0,"planet",3051.8,2867500000000000000000000,true,0.5,104,{carbonDioxide:10,nitrogen:65,argon:15,oxygen:10},100,6.87,68208000,0,"Terran",[],0.05,
        "Venus"),
        new Planet("Alpha II",0,0,0,"planet",9371,15972370000000000000000000,true,1.05,17,{nitrogen:73.57,oxygen:26,argon:0.4,carbonDioxide:0.03},100,10.50,119598023,120000000,"Terran",
            [new Moon("Alpha IIm",0,0,0,"moon",2737.4,133420000000000000000000,false,0,-22,{},0,2.22,450250,0,"Terran",0.00001,
                "Moon")],12,
            "Earth"),
        new Planet("Alpha III",0,0,0,"planet",4551.8,3527200000000000000000000,true,0.9,5,{carbonDioxide:0.01,nitrogen:68.99,argon:1,oxygen:30},100,7.90,188208000,8000,"Terran",[],1.8,
            "Mercury"),],
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
        O2:{max:500000000,val:500000000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["O2"], ratios:[0.2,0.5,0.8]}, N2:{max:5000000,val:5000000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["N2"], ratios:[0.2,0.5,0.8]}, H2:{max:5000000,val:5000000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["H2"], ratios:[0.2,0.5,0.8]}, He:{max:1000000,val:1000000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["He"], ratios:[0.2,0.5,0.8]}, //Gas (Litres)
        deuterium:{max:2000000,val:1800000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["deuterium"], ratios:[0.2,0.5,0.8]}, fuel1:{max:6000000,val:5800000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["fuel1"], ratios:[0.2,0.5,0.8]}, uranium:{max:20000,val:19990,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["uranium"], ratios:[0.15,0.3,0.6]}, //Liquids,Solid (kg)
        food:{max:2000000,val:1800000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["food"], ratios:[0.3,0.6,0.8]}, water:{max:2000000,val:1800000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["water"], ratios:[0.3,0.6,0.8]}, medicine:{max:500000,val:480000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["medicine"], ratios:[0.2,0.5,0.8]}, //pop resources
        iron:{max:20000,val:19000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["iron"], ratios:[0.2,0.4,0.7]}, gold:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["gold"], ratios:[0.2,0.4,0.7]}, silver:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["silver"], ratios:[0.2,0.4,0.7]}, aluminium:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["aluminium"], ratios:[0.2,0.4,0.7]},
        titanium:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["titan"], ratios:[0.2,0.4,0.7]}, silicon:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["silicon"], ratios:[0.2,0.4,0.7]}, chromium:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["chromium"], ratios:[0.2,0.4,0.7]}, carbon:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["carbon"], ratios:[0.2,0.4,0.7]},
        polymer:{max:10000,val:1000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["polymer"], ratios:[0.2,0.4,0.7]}, lead:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["lead"], ratios:[0.2,0.4,0.7]}, copper:{max:10000,val:9000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["copper"], ratios:[0.2,0.4,0.7]},tungsten:{max:10000,val:8500,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["tungsten"], ratios:[0.2,0.5,0.8]}, //building resources
        electronics:{max:50000,val:18000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["electronics"], ratios:[0.15,0.3,0.6]},steel:{max:90000,val:45000,selling:true, buying:false, maxPrice:0.0004, price:globalPrices["steel"], ratios:[0.2,0.5,0.8]}  //other
    },
    "Alpha",
    {x:1,y:-1,z:0.25},
    [new SystemServer(1,"System Server(Alpha)",1,"system",1,-1,0.25,"Alpha"),
        new TimeServer(1,"Time Server(Alpha)",1,"time",1,-1,0.25,"Alpha"),
        new TradeServer(1,"Trade Server(Alpha)",1,"trade",1,-1,0.25,"Alpha"),],
    [factories.buildFactory("steel",1, true),factories.buildFactory("electronics",1, true),
        factories.buildFactory("medicine",0.5, true)],
    [naturalResources.c("iron",40),naturalResources.c("carbon",20),naturalResources.c("water",1000),naturalResources.c("food",150),
        naturalResources.c("O2",50),naturalResources.c("N2",5),naturalResources.c("H2",5),naturalResources.c("He",0.01),
        naturalResources.c("silicon",150),naturalResources.c("gold",2.5),naturalResources.c("silver",2.5),naturalResources.c("aluminium",0.8),
        naturalResources.c("titanium",4),naturalResources.c("chromium",1),naturalResources.c("polymer",5),naturalResources.c("lead",2),
        naturalResources.c("copper",1),naturalResources.c("tungsten",0.7),
        naturalResources.c("deuterium",1.5),naturalResources.c("uranium",8),naturalResources.c("fuel1",20)],
    0.7,
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
    0.01,
    15,
))

starSystems.push (new StarSystem(
    [
        new Star("Test2",6.5,2.3,0.5,"star",548300,1652400000000000000000000000,false,0,5000,{},0,250,0,"Terran","Class K")],
    [],
    [],
    "Terran",
    { },
    {},
    "Test2",
    {x:4,y:4,z:0.5},
    [],
    [],
    [],
    0.01,
    15,
))


//Generate Planets Array
let planets = []
for (let i = 0; i<starSystems.length; i++) {
    for (let j = 0; j<starSystems[i].planets.length; j++) {
       planets.push(starSystems[i].planets[j])
    }
}
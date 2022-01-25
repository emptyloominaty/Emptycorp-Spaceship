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

starSystems.push (new StarSystem(
    [
        new Star("Sol",0,0,0,"star",695700,1988500000000000000000000000,false,0,6000,{},0,274,0,"Terran")],
    [
        new Planet("Mercury",0,0,0,"planet",2439.7,330110000000000000000000,false,0,67,{},0,3.7,57909050,0,"Terran",[],[]),
        new Planet("Venus",0,0,0,"planet",6051.8,4867500000000000000000000,true,93,464,{carbonDioxide:96.5,nitrogen:3.5},100,8.87,108208000,0,"Terran",[],[]),
        new Planet("Terra",0,0,0,"planet",6371,5972370000000000000000000,true,1,14,{nitrogen:78.03,oxygen:21,argon:0.93,carbonDioxide:0.04},100,9.81,149598023,10000000000,"Terran",
            [new Moon("Luna",0,0,0,"moon",1737.4,73420000000000000000000,false,0,-22,{},0,1.622,384399,7000000,"Terran")],
            [new TimeServer(1,"Time Server(Sol)",1,"time",0,0)]),

    ],
    [],
    "Terran",
    {
        O2:0.0004,N2:0.0002,H2:0.005, //Gas (Litres)
        deuterium:1250,fuel1:10,uranium:5000,}, //Liquids,Solid (kg)
    "Sol System",
    {x:0,y:0,z:0},
    15,
))
class TradeShip extends AiShip {
    run2() {
    }
    constructor(x,y,z,role,faction,rotSpeed,accSpeed,weapon,fuelTank,consumption,armor,shield,shieldRecharge,home,shipDesign) {
        super(x,y,z,role,faction,rotSpeed,accSpeed,weapon,fuelTank,consumption,armor,shield,shieldRecharge,home,shipDesign)

    }
}


//test trade ships
aiShips.push(new TradeShip(1.251,1.51,0,"Trade","Terran",60,200,{},{type:"fuel1", capacity:500, maxCapacity:500},5,20,50,0.05,0,{}))


//performance test
for (let i = 0; i<100; i++) {
    aiShips.push(new TradeShip(2.401+Math.random(),1.001+Math.random(),0,"Trade","Terran",60,200,{},{type:"fuel1", capacity:500, maxCapacity:500},5,20,50,0.05,0,{}))
    /*aiShips[i].target = {position:{x:50,y:60,z:0}}
    aiShips[i].task = "move"*/
}
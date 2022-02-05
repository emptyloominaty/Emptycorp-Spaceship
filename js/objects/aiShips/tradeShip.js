class TradeShip extends AiShip {
    run2() {
    }
    constructor(x,y,z,role,faction,rotSpeed,accSpeed,weapon,fuelTank,consumption,armor,shield,shieldRecharge,home,shipDesign) {
        super(x,y,z,role,faction,rotSpeed,accSpeed,weapon,fuelTank,consumption,armor,shield,shieldRecharge,home,shipDesign)

    }
}



aiShips.push(new TradeShip(1.001,1.001,0,"Trade","Terran",60,200,{},{type:"fuel1", capacity:500, maxCapacity:500},5,20,50,0.05,0,{}))
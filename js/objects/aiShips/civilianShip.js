class CivilianShip extends AiShip {
    run2() {

    }
    constructor(x,y,z,type,faction,rotSpeed,accSpeed,weapon,fuelTank,consumption,armor,shield) {
        super(x,y,z,type,faction,rotSpeed,accSpeed,weapon,fuelTank,consumption,armor,shield)

    }
}

//TEST TEST TEST
aiShips.push(new CivilianShip(1.001,1.001,0,"civilian","test",60,200,{},{type:"fuel1", capacity:500, maxCapacity:500},5,200,100))
class Antenna extends Part {
    on = 1


    receiveArray = [] //{size:/*mbytes*/, address:/*0-*/, port:/*port 0-65536*/ data:/*string*/
    transmitArray = []//{size:/*mbytes*/, address:/*0-*/, port:/*port 0-65536*/ data:/*string*/


    run() { //listen
        if (this.on === 1) {
            if (playerShip.usePower(this.consumptionPower[0] / gameFPS, this.group)) {
                if (playerShip.useTank(this.fuelType, this.consumptionFuel[0] / gameFPS)) {
                    //receive
                    if (this.receiveArray.length > 0) {
                        let received = this.receiveArray[0]

                        if (playerShip.computers[0].comm !==0 && playerShip.computers[0].comm.on ===1 ) {
                            playerShip.computers[0].comm.receiveData(received)
                            this.receiveArray.shift()
                        }
                    }
                    //transmit
                    if (this.transmitArray.length > 0) {
                        let transmitData = this.transmitArray[0]
                        let transmitSuccess = this.transmit(transmitData.size, transmitData.address, transmitData.port, transmitData.data, transmitData.senderAddress)
                        if (transmitSuccess) {
                            this.transmitArray.shift()
                        } else {
                            if (this.transmitArray.failure===undefined) {
                                this.transmitArray.failure = 0
                            }
                            this.transmitArray.failure++
                            if (this.transmitArray.failure>60) {
                                this.transmitArray.shift()
                            }
                        }

                    }
                } else {
                    this.on = 0
                }
            } else {
                this.on = 0
            }
        }
    }
    everySec() {
        this.rxArray.push(this.rx[0])
        this.txArray.push(this.tx[0])
        if (this.rxArray.length>2) {
            this.rxArray.shift()
            this.txArray.shift()
        }

        this.realrx = (this.rxArray[0]+this.rxArray[1])/2
        this.realtx = (this.txArray[0]+this.txArray[1])/2
        this.rx[0] = 0
        this.tx[0] = 0
    }

    transmit(size,address,port,data,senderAddress) {
        if (this.tx[0]+size<this.tx[1]) {
            if (playerShip.usePower((this.consumptionPower[1]*size)/gameFPS,this.group)) { //TODO:consumption speed idk
                if (playerShip.useTank(this.fuelType,(this.consumptionFuel[1]*size)/gameFPS)) {
                    this.tx[0] += size
                    mainServer.sendData(size,address,port,data,senderAddress)
                    return true
                }
            }
        } else {
            return false
        }
    }

    receive(size,address,port,data,senderAddress) {
        if (this.rx[0]+size<this.rx[1]) {
            if (playerShip.usePower((this.consumptionPower[1]*size)/gameFPS,this.group)) { //TODO:consumption speed idk
                if (playerShip.useTank(this.fuelType,(this.consumptionFuel[1]*size)/gameFPS)) {
                    this.rx[0] += size
                    this.receiveArray.push({size: size, address: address, port: port, data: data, senderAddress:senderAddress})
                    return true
                }
            }
        }
        return false
    }

    constructor(id,weight,name,maxSpeed,consumptionPower,consumptionFuel,fuelType) {
        super(weight,name,"antenna",id)
        this.maxSpeed = maxSpeed
        this.consumptionPower = consumptionPower
        this.consumptionFuel = consumptionFuel
        this.fuelType = fuelType

        this.rx = [0,this.maxSpeed/8] //0=r 1=max
        this.tx = [0,this.maxSpeed/8] //0=t 1=max

        this.realtx = 0
        this.realrx = 0

        this.rxArray = [0,0]
        this.txArray = [0,0]
    }
}
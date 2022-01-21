class Server {
    receiveArray = []
    position = {x:1,y:1}
    myAddress = 0

    constructor(myAddress, x = 1,y = 1) {
        this.position.x = x
        this.position.y = y
        this.myAddress = myAddress
    }

    transmit(size,address,port,data) {
        return mainServer.sendData(size,address,port,data,this.myAddress)
    }

    receive(size,address,port,data,senderAddress) {
        this.receiveArray.push({size: size, address: address, port: port, data: data, senderAddress:senderAddress})
        return true
    }
}


class TestServer extends Server {

}


let testServer = new TestServer(0)
class Server {
    receiveArray = []

    transmit(size,address,port,data) {
        return mainServer.sendData(size,address,port,data)
    }

    receive(size,address,port,data) {
        this.receiveArray.push({size: size, address: address, port: port, data: data})
        return true
    }
}


class TestServer extends Server {

}


let testServer = new TestServer()
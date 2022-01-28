class Server {
    receiveArray = []
    position = {x:0,y:0,z:0}
    myAddress = 0
    systemName = ""
    type = ""

    constructor(myAddress,name,run,type, x = 0,y = 0,z = 0,systemName = "") {
        this.position.x = x
        this.position.y = y
        this.position.z = z
        this.systemName = systemName
        this.type = type
        this.myAddress = mainServer.addAddress(name,this,"Server",run,type)
    }

    transmit(size,address,port,data) {
        return mainServer.sendData(size,address,port,data,this.myAddress)
    }

    receive(size,address,port,data,senderAddress) {
        this.receiveArray.push({size: size, address: address, port: port, data: data, senderAddress:senderAddress})
        return true
    }
}
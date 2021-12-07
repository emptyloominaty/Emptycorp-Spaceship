class MainServer {
    /* type: ship,planet,station,server */
    addressList = [{name:"Test Server", object:testServer, type:"server", address:0},{name:"Player Ship", object:playerShip, type:"ship", address:1}]

    addAddress(name,object,type) {
        this.addressList.push({name:name, object:object, type:type, address:this.addressList.length})
    }

    sendData(size,address,port,data) {
        this.addressList[address].object.receive(size,address,port,data)
    }
}

let mainServer = new MainServer()
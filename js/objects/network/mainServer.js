class MainServer {
    /* type: ship,planet,station,server */
    addressList = [{name:"Test Server", object:testServer, type:"server", address:0, run:0},
        {name:"Player Ship", object:playerShip, type:"ship", address:1, run:0},
        {name:"Time Server", object:timeServer, type:"server", address:2, run:1}
        ]

    addAddress(name,object,type,run) {
        this.addressList.push({name:name, object:object, type:type, address:this.addressList.length, run:run})
    }

    sendData(size,address,port,data) {
        this.addressList[address].object.receive(size,address,port,data)
    }

    run() {
        for(let i = 0; i<this.addressList.length; i++) {
            if (this.addressList[i].run===1) {
                this.addressList[i].object.run()
            }
        }
        //
    }

}

let mainServer = new MainServer()
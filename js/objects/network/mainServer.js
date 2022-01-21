class MainServer {
    //CONFIG
    speedOfData = 20 //ly/s
    //-------

    /* type: ship,planet,station,server */
    addressList = [{name:"Test Server", object:testServer, type:"server", address:0, run:0},
        {name:"Player Ship", object:playerShip, type:"ship", address:1, run:0},
        {name:"Time Server", object:timeServer, type:"server", address:2, run:1}
        ]

    addAddress(name,object,type,run) {
        this.addressList.push({name:name, object:object, type:type, address:this.addressList.length, run:run})
    }

    sendData(size,address,port,data,senderAddress) {
        console.log(senderAddress," -> ",address)
        let a = this.addressList[senderAddress].object.position.x - this.addressList[address].object.position.x //x1 - x2
        let b = this.addressList[senderAddress].object.position.y - this.addressList[address].object.position.y //y1 - y2
        let latency = Math.sqrt( a*a + b*b )/this.speedOfData*1000
        console.log(latency+"ms")
        setTimeout( ()=> {
            return this.addressList[address].object.receive(size,address,port,data,senderAddress)
        },latency)
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
class MainServer {
    //CONFIG
    speedOfData = 20 //ly/s
    position = {x:0,y:0}
    //-------

    /* type: ship,planet,station,server */
    addressList = [{name:"Main Server", object:this, type:"server", address:0, run:0},
        {name:"Player Ship", object:playerShip, type:"ship", address:1, run:0}
    ]

    addAddress(name,object,type,run,serverType = "") {
        this.addressList.push({name:name, object:object, type:type, address:this.addressList.length, run:run, serverType:serverType})
        return this.addressList.length-1
    }

    sendData(size,address,port,data,senderAddress) {
        console.log(senderAddress," -> ",address)
        let a = this.addressList[senderAddress].object.position.x - this.addressList[address].object.position.x //x1 - x2
        let b = this.addressList[senderAddress].object.position.y - this.addressList[address].object.position.y //y1 - y2
        let latency = Math.sqrt( a*a + b*b )/this.speedOfData*1000
        console.log(latency+"ms")
        setTimeout( ()=> {
            if (address===1) {
                this.addressList[address].object.receive(0.002,senderAddress,0,{type:"var",var:"ping",ping:latency},0)
                this.addressList[address].object.receive(0.005,senderAddress,0,{type:"var",var:"pingServerName",name:this.addressList[senderAddress].name},0)
            }
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

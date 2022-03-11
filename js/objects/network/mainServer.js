class MainServer {
    //CONFIG
    speedOfData = 20 //ly/s
    position = {x:0,y:0,z:0}
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
        let a = this.addressList[senderAddress].object.position.x - this.addressList[address].object.position.x
        let b = this.addressList[senderAddress].object.position.y - this.addressList[address].object.position.y
        let c = this.addressList[senderAddress].object.position.z - this.addressList[address].object.position.z
        let latency = ((Math.sqrt( a*a + b*b + c*c )/this.speedOfData*1000)*2)
        if (latency<2) { latency = 1+Math.random()}
        //console.log(latency)

        /*if (address===1) {
            if (playerShip.antennas[0].rx+size>playerShip.antennas[1].rx) {

            }
        }*/
        setTimeout( ()=> {
            if (address===1) {
                data.latency = latency
                this.addressList[address].object.receive(0.0002,senderAddress,0,{type:"var",var:"ping",ping:latency,name:this.addressList[senderAddress].name},0)
            }
            //console.log(senderAddress+" -> "+address)
            return this.addressList[address].object.receive(size,address,port,data,senderAddress)
        },(latency/speedInc)/speedInc2)
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

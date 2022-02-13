class ShipServer extends Server {

    run() {
        if (this.receiveArray.length>0) {
            if (this.receiveArray[0].data.data === "sendPing") {
                this.transmit(0.005,this.receiveArray[0].data.senderAddress,0,{type:"shipPing", address:this.myAddress, name:this.systemName})
            }

            this.receiveArray.shift()
        }
    }

    updatePosition(x,y,z) {
        this.position.x = x
        this.position.y = y
        this.position.z = z
    }
}

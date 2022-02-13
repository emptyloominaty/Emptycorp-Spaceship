class SystemServer extends Server {

    run() {
        if (this.receiveArray.length>0) {
            if (this.receiveArray[0].data.data === "sendPing") {
                this.transmit(0.005,this.receiveArray[0].data.senderAddress,0,{type:"systemPing", address:this.myAddress, name:this.systemName})
            }

            this.receiveArray.shift()
        }
    }

}

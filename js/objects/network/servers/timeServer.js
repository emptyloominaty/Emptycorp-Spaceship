class TimeServer extends Server {
    time = 0
    run() {
        this.time = gameTime
        if (this.receiveArray.length>0) {
            this.transmit(0.01,this.receiveArray[0].data.senderAddress,2,{type:"var",var:"time",time:this.time})
            this.receiveArray.shift()
        }
    }
}
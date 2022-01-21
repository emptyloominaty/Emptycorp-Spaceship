
class TimeServer extends Server {
    time = 0
    run() {
        this.time+=1000/gameFPS
        if (this.receiveArray.length>0) {
            let sendSuccess = this.transmit(0.01,this.receiveArray[0].data.senderAddress,2,{type:"var",var:"time",time:this.time})
            if (!sendSuccess) {
                if (this.receiveArray!==undefined) {
                    this.receiveArray.failure = 0
                }
                this.receiveArray.failure++
                if (this.receiveArray.failure>100) {
                    this.receiveArray.shift()
                }
            } else {
                this.receiveArray.shift()
            }

        }
    }
}

let timeServer = new TimeServer()